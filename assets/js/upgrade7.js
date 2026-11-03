/* ============================================================
   upgrade7.js — ĐỢT 7 (yêu cầu người dùng 2026-11-04):
   1 · Phần 6 (Thiết kế dự án): cả 6 thẻ bước thành dạng bấm mở
       panel chi tiết ngay bên dưới hàng thẻ — mục tiêu, checklist
       việc cần làm, đầu ra, ví dụ áp dụng xuyên suốt (dự án mẫu
       Shop JP) và lỗi thường gặp. Song ngữ VI/JP.
   2 · Khối "Từ viết tắt trong phần này" cuối Phần 6: tra nhanh
       NFR, RTO, RPO, SLA, p95, ADR, HRI, IaC, CI/CD.
   3 · Sơ đồ Hybrid Certificate Lifecycle: panel node bổ sung
       dòng giải thích CSR / CA / SSM dạng đầy đủ cho các node
       liên quan (Server on-premise, CertIssue, ACM Private CA,
       Systems Manager).
   Nạp SAU upgrade6.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function L(vi,ja){ return (window.LANG==='ja'&&ja)?ja:vi; }

/* ================= 1 · PHẦN 6 — CHI TIẾT 6 BƯỚC ================= */
var S6=[
{n:'01',t:['Thu thập yêu cầu','要件収集'],
 goal:['Hiểu đúng bài toán trước khi nghĩ tới bất kỳ service nào: ai sử dụng, dùng để làm gì, quy mô hiện tại và dự báo, cùng mọi ràng buộc cứng (ngân sách, deadline, pháp lý). Mọi quyết định ở 5 bước sau đều truy về dữ liệu thu thập ở bước này.',
       'どのサービスも考える前に、課題を正しく把握します。誰が何のために使うのか、現状と予測の規模、硬い制約（予算、納期、法務）。後続5ステップの全判断は、ここで集めた情報に遡ります。'],
 todo:[['Phỏng vấn stakeholder — người ra quyết định, người dùng cuối và đội vận hành (ba nhóm này thường muốn ba thứ khác nhau).','ステークホルダーへのヒアリング — 意思決定者、最終ユーザー、運用チーム（この3者は往々にして別のものを望みます）。'],
       ['Vẽ lại luồng nghiệp vụ chính và liệt kê các hệ thống hiện có phải tích hợp (kho, thanh toán, CRM…).','主要な業務フローを描き直し、連携が必要な既存システム（在庫、決済、CRM等）を洗い出す。'],
       ['Thu thập số liệu hiện tại: số user, request ở giờ cao điểm, dung lượng dữ liệu, tốc độ tăng trưởng.','現状の数値を集める：ユーザー数、ピーク時のリクエスト数、データ量、成長率。'],
       ['Chốt các ràng buộc cứng: dữ liệu phải nằm ở region nào, ngân sách trần, ngày go-live không được lùi.','硬い制約を確定する：データを置くリージョン、予算上限、後ろ倒しできない稼働開始日。'],
       ['Ghi lại mọi giả định và điểm chưa rõ — xác nhận lại bằng văn bản thay vì "hiểu ngầm".','全ての前提と未確認事項を記録し、「暗黙の了解」ではなく文書で確認する。']],
 out:['Tài liệu yêu cầu (requirements) đã được stakeholder xác nhận, kèm danh sách ràng buộc cứng và các giả định — đây là "hợp đồng phạm vi" cho cả dự án.',
      'ステークホルダーが確認した要件定義書、硬い制約の一覧、前提条件 — プロジェクト全体の「範囲の契約」になります。'],
 ex:['Dự án mẫu xuyên suốt phần này — Shop JP: một chuỗi bán lẻ 40 cửa hàng tại Nhật muốn mở kênh bán hàng trực tuyến. Phỏng vấn ban giám đốc và quản lý cửa hàng cho ra 4 dữ kiện quyết định: giờ sale tải gấp 10 lần ngày thường; dữ liệu khách hàng phải ở Nhật; team IT chỉ có 3 người; phải go-live trước mùa sale cuối năm.',
     'この部の通し事例 — Shop JP：日本の小売チェーン（40店舗）がオンライン販売を始める案件。経営層と店舗責任者へのヒアリングで、設計を決める4事実が判明しました。セール時は通常の10倍の負荷、顧客データは日本国内に置くこと、IT担当は3名のみ、年末セール前に稼働開始すること。'],
 errs:[['Bắt đầu bằng chọn service ("dùng EKS cho hiện đại") khi chưa rõ yêu cầu — kiến trúc đi trước bài toán.','要件が不明なままサービス選定から始める（「今風だから EKS」等）— 課題より先に構成が決まってしまう。'],
       ['Chỉ hỏi người đặt hàng, bỏ qua người vận hành và người dùng cuối — đến lúc go-live mới lộ yêu cầu.','発注者だけに聞き、運用者と最終ユーザーを省く — 稼働開始直前に要件が噴出する。'],
       ['Không ghi lại giả định; sau này tranh cãi "tưởng là đã thống nhất rồi".','前提を記録しない。後で「合意したと思った」の水掛け論になる。']]},
{n:'02',t:['Phân tích NFR','NFR（非機能要件）の分析'],
 goal:['Biến những mong muốn mơ hồ ("phải nhanh, phải ổn định") thành con số đo được. Chính các con số NFR (Non-Functional Requirements — yêu cầu phi chức năng) này quyết định kiến trúc ở bước 3, không phải sở thích công nghệ.',
       '「速く、安定して」という曖昧な希望を、測定できる数値に変換します。ステップ3の構成を決めるのは技術の好みではなく、この NFR（Non-Functional Requirements — 非機能要件）の数値です。'],
 todo:[['Chốt SLA (Service Level Agreement — cam kết mức dịch vụ) về uptime: 99,9% nghĩa là downtime tối đa ≈ 43 phút/tháng; 99,99% chỉ còn ≈ 4,3 phút/tháng — mỗi số 9 cộng thêm đều nhân chi phí.','稼働率の SLA（Service Level Agreement — サービスレベル合意）を決める：99.9% は月あたり停止 ≈43分まで、99.99% は ≈4.3分まで。「9」が1つ増えるごとにコストは跳ね上がります。'],
       ['Chốt RTO (Recovery Time Objective — thời gian khôi phục tối đa chấp nhận được) và RPO (Recovery Point Objective — lượng dữ liệu tối đa chấp nhận mất, tính ngược theo thời gian) cho từng nhóm dữ liệu.','データ群ごとに RTO（Recovery Time Objective — 目標復旧時間）と RPO（Recovery Point Objective — 目標復旧時点、失ってよいデータ量を時間で表現）を決める。'],
       ['Định lượng hiệu năng: p95 latency (ngưỡng mà 95% số request nhanh hơn) cho các trang/tác vụ chính, và throughput ở giờ đỉnh.','性能を数値化する：主要画面・処理の p95 レイテンシ（リクエストの95%が収まる値）と、ピーク時のスループット。'],
       ['Ước lượng tăng trưởng theo năm để kiến trúc có dư địa, tránh thiết kế lại sau 1 năm.','年間の成長を見積もり、1年で作り直しにならない余地を構成に持たせる。'],
       ['Phân loại dữ liệu: nhóm không được phép mất (đơn hàng, thanh toán) và nhóm mất được (log, cache) — hai nhóm có RPO rất khác nhau.','データを分類する：失ってはいけないもの（注文、決済）と、失ってもよいもの（ログ、キャッシュ）— 両者で RPO は大きく異なる。']],
 out:['Bảng NFR có con số cụ thể cho từng hạng mục: uptime/SLA, RTO, RPO, p95 latency, throughput đỉnh, mức tăng trưởng/năm.',
      '項目ごとの具体的な数値を備えた NFR 一覧表：稼働率／SLA、RTO、RPO、p95 レイテンシ、ピーク時スループット、年間成長率。'],
 ex:['Shop JP chốt NFR: uptime 99,95% cho trang bán hàng; dữ liệu đơn hàng RTO 1 giờ, RPO 5 phút (mất tối đa 5 phút dữ liệu đơn gần nhất); p95 latency trang sản phẩm dưới 800 ms; tải đỉnh 50.000 user đồng thời trong giờ sale. Chính con số "giờ sale gấp 10 lần" này buộc thiết kế phải có Auto Scaling thay vì máy cố định.',
     'Shop JP の NFR：販売サイトの稼働率 99.95%。注文データは RTO 1時間、RPO 5分（直近5分までの注文データ損失を許容）。商品ページの p95 レイテンシ 800ms 未満。セール時のピークは同時接続 50,000 ユーザー。この「セール時10倍」という数値が、固定台数ではなく Auto Scaling を必須にしました。'],
 errs:[['Ghi NFR bằng tính từ ("nhanh", "ổn định") mà không có con số — không thể kiểm chứng cũng không thể thiết kế theo.','NFR を形容詞（「速い」「安定」）で書き、数値がない — 検証も設計もできない。'],
       ['Đòi 99,99% và RPO = 0 cho mọi thứ: chi phí đội lên nhiều lần trong khi nghiệp vụ không hề cần.','全てに 99.99% と RPO=0 を要求する：業務に不要な水準でコストが何倍にもなる。'],
       ['Thiết kế theo tải trung bình, quên mất giờ đỉnh — hệ thống sập đúng ngày sale, ngày quan trọng nhất.','平均負荷で設計しピークを忘れる — 最も大事なセール当日に落ちる。']]},
{n:'03',t:['Thiết kế kiến trúc','アーキテクチャ設計'],
 goal:['Chọn service và vẽ sơ đồ đáp ứng đúng các con số NFR đã chốt, đồng thời ghi lại lý do của từng quyết định lớn để sau này ai cũng truy vết được "vì sao lại làm thế này".',
       '確定した NFR の数値を満たすサービス選定と図面化を行い、大きな決定の理由を記録して、後から「なぜこうしたか」を誰でも追えるようにします。'],
 todo:[['Vẽ sơ đồ tổng thể: VPC, các AZ, subnet public/private và các luồng dữ liệu chính.','全体図を描く：VPC、各 AZ、パブリック／プライベートサブネット、主要なデータの流れ。'],
       ['Chọn service theo NFR: cần chịu tải đỉnh thay đổi → ALB + Auto Scaling; dữ liệu quan hệ cần failover tự động → RDS/Aurora Multi-AZ; file tĩnh toàn quốc → S3 + CloudFront.','NFR に沿ってサービスを選ぶ：変動するピーク負荷 → ALB ＋ Auto Scaling。自動フェイルオーバーが要る RDB → RDS/Aurora Multi-AZ。全国向け静的ファイル → S3 ＋ CloudFront。'],
       ['Ghi mỗi quyết định lớn thành một ADR (Architecture Decision Record — bản ghi quyết định kiến trúc) theo mẫu: bối cảnh → quyết định → phương án đã loại bỏ → đánh đổi chấp nhận.','大きな決定は1件ごとに ADR（Architecture Decision Record — アーキテクチャ決定記録）に残す：背景 → 決定 → 却下した案 → 受け入れたトレードオフ。'],
       ['Rà soát điểm lỗi đơn (single point of failure): thành phần nào chết một mình mà kéo sập cả hệ thống?','単一障害点を洗う：単独で死ぬと全体を巻き込む部品はどれか。'],
       ['Đánh dấu trên sơ đồ những đường dữ liệu nhạy cảm cần mã hoá và ranh giới quyền truy cập (IAM).','図の上に、暗号化が必要な機微データの経路と、アクセス権の境界（IAM）を明記する。']],
 out:['Sơ đồ kiến trúc (đủ VPC/AZ/luồng dữ liệu) + bộ ADR cho các quyết định lớn — hai tài sản này là căn cứ cho bước ước tính chi phí và review.',
      'アーキテクチャ図（VPC／AZ／データの流れを含む）と、大きな決定の ADR 一式 — 次のコスト見積もりとレビューの根拠になります。'],
 ex:['Shop JP: web chạy ALB + EC2 Auto Scaling trải 3 AZ ở private subnet; đơn hàng lưu Aurora Multi-AZ; ảnh sản phẩm lên S3 + CloudFront. ADR-001 ghi quyết định "chọn Aurora thay vì tự cài MySQL trên EC2" — lý do: team chỉ 3 người, cần failover tự động để đạt RTO 1 giờ và RPO 5 phút đã chốt ở bước 2.',
     'Shop JP：Web は ALB ＋ EC2 Auto Scaling（3 AZ、プライベートサブネット）。注文は Aurora Multi-AZ、商品画像は S3 ＋ CloudFront。ADR-001 には「EC2 に MySQL を自前構築せず Aurora を選ぶ」決定を記録 — 理由は、担当3名という体制で、ステップ2で決めた RTO 1時間・RPO 5分を満たす自動フェイルオーバーが必要なため。'],
 errs:[['Chỉ vẽ luồng "mọi thứ đều ổn" (happy path), không vẽ chuyện gì xảy ra khi một AZ hoặc DB sập.','「全て正常」な流れ（ハッピーパス）だけを描き、AZ や DB が落ちた時を描かない。'],
       ['Quyết định lớn chỉ nằm trong đầu người thiết kế — 6 tháng sau không ai giải thích nổi vì sao hệ thống lại như vậy.','大きな決定が設計者の頭の中だけにある — 半年後、誰も理由を説明できない。'],
       ['Chọn service theo độ "hot" thay vì theo NFR và khả năng vận hành của team.','NFR とチームの運用力ではなく、話題性でサービスを選ぶ。']]},
{n:'04',t:['Ước tính chi phí','コスト見積もり'],
 goal:['Dự báo chi phí bằng con số trước khi triển khai, để stakeholder quyết định trên dữ kiện thật và không bị bất ngờ bởi các khoản phí ẩn.',
       '構築前にコストを数値で予測し、ステークホルダーが事実に基づいて判断できるようにします。隠れコストに驚かされないためでもあります。'],
 todo:[['Dựng ước tính bằng AWS Pricing Calculator theo 3 kịch bản: hiện tại / tăng trưởng / giờ đỉnh.','AWS Pricing Calculator で3シナリオ（現状／成長時／ピーク時）の見積もりを作る。'],
       ['Tính riêng các phí ẩn kinh điển: NAT Gateway (phí theo giờ + phí theo GB dữ liệu đi qua), data transfer (ra internet, liên region), số lượng request tới S3 và API Gateway.','典型的な隠れコストを別途計算する：NAT Gateway（時間課金＋処理 GB 課金）、データ転送（インターネット向け、リージョン間）、S3 や API Gateway へのリクエスト数。'],
       ['Gắn tag chi phí theo dự án/môi trường ngay từ thiết kế để sau go-live đối chiếu được thực tế với ước tính.','設計段階からプロジェクト／環境ごとのコストタグを決め、稼働後に実績と見積もりを突き合わせられるようにする。'],
       ['Đề xuất đòn bẩy giảm chi phí: Savings Plans cho phần tải ổn định, tắt môi trường dev ngoài giờ làm, đẩy nội dung tĩnh qua CloudFront.','削減レバーを提案する：安定した負荷分は Savings Plans、開発環境は業務時間外に停止、静的コンテンツは CloudFront へ。'],
       ['Chốt ngưỡng cảnh báo ngân sách (ví dụ 80% ngân sách tháng) — ngưỡng này sẽ được bật thành alarm ở bước 6.','予算アラートの閾値（例：月予算の80%）を決める — この閾値はステップ6でアラームとして有効化する。']],
 out:['Bảng ước tính chi phí 3 kịch bản (kèm file Pricing Calculator) + danh sách phí ẩn đã tính + ngưỡng cảnh báo ngân sách.',
      '3シナリオのコスト見積もり表（Pricing Calculator の根拠付き）、計算済みの隠れコスト一覧、予算アラートの閾値。'],
 ex:['Shop JP: kịch bản giờ sale tốn khoảng 6 lần ngày thường, chủ yếu do EC2 scale-out và data transfer của ảnh sản phẩm. Từ con số này, team quyết định ngay từ bước thiết kế: đưa toàn bộ ảnh qua CloudFront và đặt VPC Endpoint cho S3 để cắt phí dữ liệu chạy qua NAT Gateway.',
     'Shop JP：セール時のシナリオは通常時の約6倍。主因は EC2 のスケールアウトと商品画像のデータ転送でした。この数値から、設計段階で「画像は全て CloudFront 経由」「S3 には VPC エンドポイントを置き、NAT Gateway 経由の転送費を削る」と即決しました。'],
 errs:[['Chỉ cộng tiền EC2/RDS mà quên NAT Gateway và data transfer — hai khoản "âm thầm giết" hoá đơn của dự án vừa và nhỏ.','EC2 と RDS だけを集計し、NAT Gateway とデータ転送を忘れる — 中小規模案件の請求を静かに押し上げる2大要因。'],
       ['Ước tính đúng một kịch bản theo tải hiện tại; lúc tăng trưởng hoặc vào giờ sale thì vỡ ngân sách.','現状負荷の1シナリオしか見積もらない。成長時やセール時に予算を突破する。'],
       ['Không đặt cảnh báo ngân sách — chỉ phát hiện vượt chi khi hoá đơn cuối tháng đã về.','予算アラートを置かない — 超過に気付くのが月末の請求書では遅い。']]},
{n:'05',t:['Well-Architected Review','Well-Architected レビュー'],
 goal:['Soi lại toàn bộ thiết kế qua 6 trụ cột của AWS Well-Architected Framework trước khi triển khai — sửa trên giấy luôn rẻ hơn sửa trên production rất nhiều.',
       '構築前に、設計全体を AWS Well-Architected Framework の6本柱で点検します。紙の上で直す方が、本番で直すより桁違いに安く済みます。'],
 todo:[['Chạy review bằng AWS Well-Architected Tool, trả lời bộ câu hỏi cho cả 6 trụ cột (vận hành, bảo mật, độ tin cậy, hiệu năng, chi phí, bền vững).','AWS Well-Architected Tool でレビューを実施し、6本柱（運用、セキュリティ、信頼性、性能、コスト、持続可能性）全ての設問に答える。'],
       ['Ghi nhận mọi HRI (High-Risk Issue — vấn đề rủi ro cao) tìm thấy, gán rõ người phụ trách và hạn xử lý cho từng mục.','見つかった全 HRI（High-Risk Issue — 高リスク課題）を記録し、担当者と期限を付ける。'],
       ['Ưu tiên xử lý trước go-live các HRI thuộc hai trụ Security và Reliability.','Security と Reliability の柱の HRI は、稼働開始前に優先して解消する。'],
       ['Với HRI chấp nhận tạm thời: ghi rõ lý do chấp nhận rủi ro và người có thẩm quyền phê duyệt — không chấp nhận "ngầm".','一時的に受け入れる HRI は、理由と承認者を明記する — 「黙って受け入れ」は禁止。'],
       ['Lên lịch review lại sau mỗi thay đổi kiến trúc lớn.','大きな構成変更のたびに再レビューの予定を入れる。']],
 out:['Báo cáo review + danh sách HRI kèm kế hoạch xử lý (hoặc quyết định chấp nhận rủi ro có phê duyệt) — "giấy thông hành" để bước sang triển khai.',
      'レビュー報告書と、対応計画（または承認付きのリスク受容判断）を伴う HRI 一覧 — 実装へ進むための「通行証」です。'],
 ex:['Review cho Shop JP phát hiện 2 HRI: (1) database chưa bật mã hoá bằng khoá KMS riêng; (2) chưa từng diễn tập khôi phục, trong khi bước 2 đã cam kết RTO 1 giờ. Cả hai được xử lý trước go-live, và buổi diễn tập failover được đưa thẳng vào kế hoạch vận hành ở bước 6.',
     'Shop JP のレビューで HRI が2件：（1）データベースが専用 KMS キーで暗号化されていない。（2）RTO 1時間を約束しながら復旧訓練をしたことがない。両件とも稼働開始前に解消し、フェイルオーバー訓練はステップ6の運用計画に組み込みました。'],
 errs:[['Review sau khi đã triển khai xong — lúc đó phát hiện HRI thì sửa đắt gấp nhiều lần, hoặc đành chấp nhận rủi ro.','構築後にレビューする — その時点で HRI が見つかっても、直すコストは跳ね上がり、結局リスクを受け入れる羽目になる。'],
       ['Tự đánh dấu "đạt" cho qua chuyện mà không có bằng chứng kiểm chứng.','証拠なしに「達成」と自己申告で済ませる。'],
       ['HRI ghi ra rồi để đó: không người phụ trách, không hạn xử lý, không ai theo dõi.','HRI を書き出すだけで放置する：担当者なし、期限なし、追跡なし。']]},
{n:'06',t:['Triển khai & vận hành','構築・運用'],
 goal:['Đưa thiết kế lên production bằng quy trình lặp lại được — không thao tác tay — và vận hành có quan sát, có runbook, có diễn tập khôi phục để các cam kết ở bước 2 được kiểm chứng bằng thực tế.',
       '設計を、再現可能な手順で本番へ載せます — 手作業は禁止。監視、ランブック、復旧訓練を備え、ステップ2の約束を実地で検証できる運用にします。'],
 todo:[['Viết toàn bộ hạ tầng bằng IaC (Infrastructure as Code — hạ tầng dạng code: Terraform/CDK) và triển khai qua pipeline CI/CD (Continuous Integration / Continuous Delivery — tích hợp & chuyển giao liên tục) có bước phê duyệt.','インフラ全体を IaC（Infrastructure as Code — TerraformやCDKによるコード管理）で書き、承認ステップ付きの CI/CD（Continuous Integration / Continuous Delivery — 継続的インテグレーション／デリバリー）パイプラインで配布する。'],
       ['Bật observability ngay từ ngày đầu: metric, log, trace (CloudWatch, X-Ray) và alarm phải có người trực nhận — alarm không ai nhận còn tệ hơn không có alarm.','初日からオブザーバビリティを有効化する：メトリクス、ログ、トレース（CloudWatch、X-Ray）。アラームには必ず受け手の当番を付ける — 受け手のないアラームは、ないより悪い。'],
       ['Viết runbook cho các tình huống thường gặp: một AZ sập, DB failover, chi phí vượt ngưỡng cảnh báo đã chốt ở bước 4.','頻出事象のランブックを書く：1 AZ の障害、DB フェイルオーバー、ステップ4で決めた予算閾値の超過。'],
       ['Diễn tập failover và khôi phục định kỳ để kiểm chứng RTO/RPO bằng số đo thật, không phải con số trên giấy.','フェイルオーバーと復旧の訓練を定期実施し、RTO/RPO を紙の数値ではなく実測で検証する。'],
       ['Mỗi tháng đối chiếu chi phí thực tế với ước tính ở bước 4 và rà soát lại các HRI còn mở.','毎月、実績コストを見積もり（ステップ4）と突き合わせ、未解決の HRI を棚卸しする。']],
 out:['Hệ thống production vận hành bằng IaC + pipeline, bộ dashboard và alarm có người trực, runbook, lịch diễn tập khôi phục — sản phẩm bàn giao cuối cùng của Architect.',
      'IaC ＋パイプラインで運用される本番システム、当番付きのダッシュボードとアラーム、ランブック、復旧訓練の予定 — アーキテクトの最終成果物です。'],
 ex:['Shop JP go-live: GitHub Actions chạy terraform plan, người phụ trách duyệt rồi mới apply lên production. Ngay tuần đầu, alarm ngân sách 80% đã bắt được sự cố ảnh sản phẩm chưa qua CloudFront khiến phí data transfer tăng vọt — đúng kịch bản phí ẩn đã lường trước ở bước 4.',
     'Shop JP の稼働開始：GitHub Actions が terraform plan を実行し、責任者の承認を経て本番へ apply。初週、予算80%アラームが「商品画像が CloudFront を経由しておらず転送費が急増」する事象を検知しました — ステップ4で予見した隠れコストそのものです。'],
 errs:[['Lên production bằng thao tác tay trên Console rồi hứa "viết lại Terraform sau" — và cái "sau" đó thường không bao giờ đến.','コンソールで手作業で本番を構築し、「Terraform 化は後で」と言う — その「後で」は大抵来ない。'],
       ['Có monitoring nhưng alarm không tới được ai; sự cố chỉ được biết khi khách hàng phàn nàn.','監視はあるがアラームが誰にも届かない。障害の第一報が顧客からの苦情になる。'],
       ['Chưa từng diễn tập khôi phục: RTO/RPO mãi là con số trên giấy cho tới ngày sự cố thật đầu tiên.','復旧訓練を一度もしない：RTO/RPO は、最初の本当の障害の日まで紙の上の数値のまま。']]}
];

var openIdx=-1, panelEl=null, stepCards=[];
function secLabels(){
  return window.LANG==='ja'
    ? {goal:'🎯 このステップの目的',todo:'✅ やることチェックリスト',out:'📦 成果物（デリバラブル）',ex:'🧪 適用例 — 通し事例 Shop JP',errs:'⚠️ よくあるミス',detail:'詳細'}
    : {goal:'🎯 Mục tiêu của bước',todo:'✅ Việc cần làm',out:'📦 Đầu ra (deliverable)',ex:'🧪 Ví dụ áp dụng — dự án mẫu Shop JP',errs:'⚠️ Lỗi thường gặp',detail:'chi tiết'};
}
function renderPanel(){
  if(!panelEl) return;
  if(openIdx<0){ panelEl.hidden=true; return; }
  var s=S6[openIdx], lb=secLabels();
  var h='<div class="sd-head"><span class="sd-n">'+s.n+'</span><h4>'+E(L(s.t[0],s.t[1]))+' — '+lb.detail+'</h4></div>';
  h+='<div class="sd-sec"><b>'+lb.goal+'</b><p>'+E(L(s.goal[0],s.goal[1]))+'</p></div>';
  h+='<div class="sd-sec"><b>'+lb.todo+'</b><ul class="checklist sd-one">'
    +s.todo.map(function(x){ return '<li>'+E(L(x[0],x[1]))+'</li>'; }).join('')+'</ul></div>';
  h+='<div class="sd-sec"><b>'+lb.out+'</b><p>'+E(L(s.out[0],s.out[1]))+'</p></div>';
  h+='<div class="sd-sec sd-ex"><b>'+lb.ex+'</b><p>'+E(L(s.ex[0],s.ex[1]))+'</p></div>';
  h+='<div class="sd-sec"><b>'+lb.errs+'</b><ul class="sd-errs">'
    +s.errs.map(function(x){ return '<li>'+E(L(x[0],x[1]))+'</li>'; }).join('')+'</ul></div>';
  panelEl.innerHTML=h;
  panelEl.hidden=false;
}
function paintCards(){
  stepCards.forEach(function(c,i){
    var open=(i===openIdx);
    c.classList.toggle('open',open);
    c.setAttribute('aria-expanded',open?'true':'false');
    var ch=c.querySelector('.chev'); if(ch) ch.textContent=open?'▴':'▾';
  });
}
function toggleStep(i){
  openIdx=(openIdx===i)?-1:i;
  paintCards(); renderPanel();
  if(openIdx>=0&&panelEl) panelEl.scrollIntoView({block:'nearest',behavior:'smooth'});
}
try{
  var sec=$('du-an');
  var grid=sec?sec.querySelector('.steps'):null;
  if(grid){
    stepCards=Array.prototype.slice.call(grid.querySelectorAll('.step')).slice(0,6);
    stepCards.forEach(function(c,i){
      c.classList.add('step-x');
      c.setAttribute('role','button'); c.setAttribute('tabindex','0'); c.setAttribute('aria-expanded','false');
      var ch=document.createElement('span'); ch.className='chev'; ch.setAttribute('aria-hidden','true'); ch.textContent='▾';
      c.appendChild(ch);
      c.addEventListener('click',function(){ toggleStep(i); });
      c.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); toggleStep(i); } });
    });
    panelEl=document.createElement('div');
    panelEl.className='step-detail'; panelEl.id='stepDetail'; panelEl.hidden=true;
    grid.parentNode.insertBefore(panelEl,grid.nextSibling);
  }
}catch(e){}

/* ================= 2 · PHẦN 6 — KHỐI TỪ VIẾT TẮT ================= */
var GLOSS=[
 ['NFR','Non-Functional Requirements',['Yêu cầu phi chức năng: các ràng buộc về chất lượng vận hành — độ sẵn sàng, hiệu năng, bảo mật, chi phí — chứ không phải tính năng nghiệp vụ.','非機能要件：機能そのものではなく、可用性・性能・セキュリティ・コストといった運用品質に関する要件。']],
 ['RTO','Recovery Time Objective',['Thời gian khôi phục tối đa chấp nhận được sau sự cố: hệ thống phải sống lại trong khoảng thời gian này.','目標復旧時間：障害後、復旧までに許容できる最大の時間。']],
 ['RPO','Recovery Point Objective',['Lượng dữ liệu tối đa chấp nhận mất khi sự cố, tính ngược theo thời gian — RPO 5 phút nghĩa là mất tối đa 5 phút dữ liệu gần nhất.','目標復旧時点：障害時に失ってよいデータの最大量を時間で表したもの。RPO 5分なら直近5分までのデータ損失を許容。']],
 ['SLA','Service Level Agreement',['Cam kết mức dịch vụ (ví dụ uptime 99,9%/tháng), thường kèm điều khoản bồi hoàn khi nhà cung cấp không đạt.','サービスレベル合意：稼働率などの水準についての約束。未達時の取扱い条項を伴うことが多い。']],
 ['p95','Percentile 95 (phần trăm 95)',['Ngưỡng độ trễ mà 95% số request nhanh hơn; dùng để đo trải nghiệm "xấu điển hình" thay vì giá trị trung bình dễ gây ảo giác.','95パーセンタイル：リクエストの95%がこの値より速いという指標。平均値の錯覚を避けるために使う。']],
 ['ADR','Architecture Decision Record',['Bản ghi quyết định kiến trúc: tài liệu ngắn cho mỗi quyết định lớn, gồm bối cảnh, lựa chọn, phương án loại bỏ và đánh đổi.','アーキテクチャ決定記録：大きな決定ごとに、背景・選択・却下案・トレードオフを残す短い文書。']],
 ['HRI','High-Risk Issue',['Vấn đề rủi ro cao tìm thấy trong Well-Architected Review; phải xử lý, hoặc chấp nhận có phê duyệt rõ ràng, trước khi go-live.','高リスク課題：Well-Architected レビューで見つかった重大なリスク。稼働開始前に解消するか、承認付きで受け入れる。']],
 ['IaC','Infrastructure as Code',['Hạ tầng dạng code: khai báo hạ tầng bằng file code (Terraform, CDK…) thay vì thao tác tay, để triển khai lặp lại được và kiểm soát phiên bản.','コードとしてのインフラ：Terraform や CDK でインフラを宣言的に管理し、再現性とバージョン管理を確保する手法。']],
 ['CI/CD','Continuous Integration / Continuous Delivery',['Tích hợp & chuyển giao liên tục: pipeline tự động kiểm tra, build và triển khai mỗi thay đổi mã nguồn/hạ tầng.','継続的インテグレーション／デリバリー：変更のたびに検証・構築・配布を自動で行う仕組み。']]
];
var glossEl=null;
function renderGloss(){
  if(!glossEl) return;
  var ja=window.LANG==='ja';
  var h='<h3>'+(ja?'📖 この部の略語 — 早見表':'📖 Từ viết tắt trong phần này')+'</h3>'
    +'<p>'+(ja?'第6部に出てくる略語の早見表です。本文では、各略語の初出時に正式名称と意味を併記しています。':'Tra nhanh các từ viết tắt dùng trong Phần 6. Trong nội dung phía trên, mỗi từ đều được ghi đầy đủ kèm nghĩa ở lần xuất hiện đầu tiên.')+'</p>'
    +'<div class="gloss-grid">'
    +GLOSS.map(function(g){
      return '<div class="gloss-item"><b class="gt">'+E(g[0])+'</b> <span class="gf">'+E(g[1])+'</span><p>'+E(L(g[2][0],g[2][1]))+'</p></div>';
    }).join('')+'</div>';
  glossEl.innerHTML=h;
}
try{
  var sec6=$('du-an');
  if(sec6){
    glossEl=document.createElement('div');
    glossEl.className='diagram-card gloss-card'; glossEl.id='gloss6';
    sec6.querySelector('.wrap').appendChild(glossEl);
    renderGloss();
  }
}catch(e){}

/* ============ 3 · SƠ ĐỒ CHỨNG CHỈ — GIẢI THÍCH THUẬT NGỮ TRONG PANEL NODE ============ */
var CERT_TERM={
 csr:['<b>CSR</b> — Certificate Signing Request (yêu cầu ký chứng chỉ số): khối dữ liệu server tự tạo chứa khoá công khai và thông tin định danh, gửi cho CA ký thành chứng chỉ; khoá bí mật không bao giờ rời khỏi server.',
      '<b>CSR</b> — Certificate Signing Request（証明書署名要求）：サーバー自身が生成する、公開鍵と識別情報を含むデータ。CA の署名を受けて証明書になる。秘密鍵はサーバーから決して出ない。'],
 ca:['<b>CA</b> — Certificate Authority (tổ chức cấp chứng chỉ): đơn vị ký và cấp chứng chỉ số. ACM Private CA là CA riêng, chỉ cấp cho nội bộ công ty.',
     '<b>CA</b> — Certificate Authority（認証局）：証明書に署名し発行する機関。ACM プライベート CA は社内専用の CA。'],
 ssm:['<b>SSM</b> — AWS Systems Manager: dịch vụ quản lý vận hành của AWS. Run Command của SSM là kênh gửi lệnh xuống server — kể cả máy ngoài AWS qua hybrid activation — mà không cần mở cổng inbound.',
      '<b>SSM</b> — AWS Systems Manager：AWS の運用管理サービス。Run Command は、ハイブリッドアクティベーション経由で AWS 外のマシンにも、受信ポートを開けずに命令を届ける経路。']
};
/* Chỉ số node trong biến thể AWS của sơ đồ hybrid-cert:
   0 Server on-premise · 4 Lambda CertIssue · 5 ACM Private CA · 8 Systems Manager */
var CERT_NODE_TERMS={0:['csr'],4:['csr','ssm'],5:['ca','csr'],8:['ssm']};
document.addEventListener('click',function(e){
  var t=e.target; if(!t||!t.closest) return;
  var b=t.closest('.dg-node[data-dg="hybrid-cert"]'); if(!b) return;
  var keys=CERT_NODE_TERMS[+b.getAttribute('data-node')]; if(!keys) return;
  setTimeout(function(){
    var box=$('dginfo-hybrid-cert'); if(!box||box.querySelector('.cert-terms')) return;
    var div=document.createElement('div'); div.className='cert-terms';
    div.innerHTML=keys.map(function(k){ return L(CERT_TERM[k][0],CERT_TERM[k][1]); }).join('<br>');
    box.appendChild(div);
  },50);
},true);

/* ---- Đổi ngôn ngữ: vẽ lại panel chi tiết + khối từ viết tắt ---- */
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      try{ paintCards(); renderPanel(); }catch(e){}
      try{ renderGloss(); }catch(e){}
    },80);
  });
});
})();
