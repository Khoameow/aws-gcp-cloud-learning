/* ============================================================
   upgrade4.js — ĐỢT 3 · PHẦN B: SƠ ĐỒ VÍ DỤ CHO MỌI SERVICE
   Thêm mục "Sơ đồ ví dụ — cách dùng điển hình" vào trang chi
   tiết của cả 358 service: một SVG nhỏ tự vẽ cùng phong cách
   thư viện sơ đồ, service ở node TRUNG TÂM, xung quanh là
   nguồn kích hoạt → service → đích/đầu ra điển hình, mũi tên
   có nhãn luồng, kèm chú thích tình huống VI + tóm tắt JP.
   - Service cốt lõi: tình huống viết tay theo use-case tiêu
     biểu nhất của chính service đó.
   - Service còn lại: sinh từ mẫu theo nhóm chức năng, node kề
     là các tích hợp điển hình thật của nhóm trên cùng cloud.
   Node kề là service thật thì link sang trang chi tiết của nó.
   Nạp SAU upgrade3.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function ja(){ return window.LANG==='ja'; }
function L(vi,jaT){ return (window.LANG==='ja'&&jaT)?jaT:vi; }
function pick(pair){ return (window.LANG==='ja'&&pair[1])?pair[1]:pair[0]; }

/* tuple node kề: [nhãn hiển thị, tên service thật | null, nhãn luồng VI, nhãn luồng JP] */
function ND(disp,svc,ev,ej){ return [disp,svc,ev,ej]; }

/* ---------- KỊCH BẢN VIẾT TAY (service cốt lõi) ---------- */
var SCEN={
'aws|Amazon EC2':{inn:[ND('ALB','Elastic Load Balancing (ALB)','HTTPS đã cân bằng tải','負荷分散済み HTTPS')],
 out:[ND('RDS','Amazon RDS','SQL đọc / ghi','SQL の読み書き'),ND('S3','Amazon S3','file · media','ファイル・メディア')],
 cap:['Tình huống điển hình: EC2 chạy tầng ứng dụng sau ALB trong VPC — nhận request đã qua cân bằng tải, đọc/ghi dữ liệu ở RDS và lấy file từ S3 thay vì lưu trên đĩa máy.','典型例：VPC 内で ALB の背後に置くアプリ層。リクエストを受け、RDS へ読み書きし、ファイルはディスクではなく S3 から取得します。']},
'aws|AWS Lambda':{inn:[ND('API Gateway','Amazon API Gateway','HTTPS request','HTTPS リクエスト'),ND('S3','Amazon S3','sự kiện có object mới','新規オブジェクトのイベント')],
 out:[ND('DynamoDB','Amazon DynamoDB','ghi / đọc dữ liệu','データの読み書き')],
 cap:['Tình huống điển hình: Lambda là tầng xử lý không server — API Gateway gọi vào cho request web, S3 kích hoạt khi có file mới; kết quả ghi xuống DynamoDB.','典型例：サーバーレス処理層。Web リクエストは API Gateway から、ファイル投入は S3 から起動し、結果を DynamoDB へ書きます。']},
'aws|Amazon S3':{inn:[ND('EC2 / Ứng dụng','Amazon EC2','API đọc / ghi object','オブジェクトの読み書き API')],
 out:[ND('CloudFront','Amazon CloudFront','phân phối toàn cầu','グローバル配信'),ND('Athena','Amazon Athena','SQL truy vấn tại chỗ','その場で SQL 検索')],
 cap:['Tình huống điển hình: S3 là kho object trung tâm — ứng dụng đọc/ghi qua API, CloudFront phân phối nội dung tĩnh ra toàn cầu, Athena chạy SQL trực tiếp trên dữ liệu trong bucket (data lake).','典型例：S3 は中心のオブジェクト保管庫。アプリは API で読み書き、CloudFront が静的配信、Athena がバケット内データへ直接 SQL（データレイク）。']},
'aws|Amazon CloudFront':{inn:[ND('Người dùng',null,'HTTPS','HTTPS')],
 out:[ND('S3 (origin)','Amazon S3','cache miss → về origin','キャッシュミス → オリジン'),ND('Lambda@Edge','AWS Lambda','xử lý tại edge','エッジで処理')],
 cap:['Tình huống điển hình: CloudFront đứng trước mọi origin — cache hit trả ngay tại edge gần người dùng; cache miss mới quay về S3 lấy nội dung và lưu cache cho lần sau.','典型例：CloudFront は全オリジンの手前。キャッシュヒットは最寄りエッジから即応答し、ミスの時だけ S3 へ取りに行き、次回用にキャッシュします。']},
'aws|Elastic Load Balancing (ALB)':{inn:[ND('Người dùng',null,'HTTPS','HTTPS')],
 out:[ND('EC2 · AZ-a','Amazon EC2','target group A','ターゲット A'),ND('EC2 · AZ-b','Amazon EC2','target group B','ターゲット B')],
 cap:['Tình huống điển hình: ALB là cửa ngõ lớp 7 duy nhất ở public subnet — chia request cho các target group EC2 ở nhiều AZ, tự loại target fail health check.','典型例：ALB はパブリック層唯一の L7 入口。複数 AZ の EC2 ターゲットへ分散し、ヘルスチェック失敗のターゲットを自動で外します。']},
'aws|Amazon RDS':{inn:[ND('EC2 (tầng app)','Amazon EC2','kết nối SQL qua mạng riêng','プライベート接続で SQL')],
 out:[ND('RDS Standby','Amazon RDS','đồng bộ Multi-AZ','Multi-AZ 同期')],
 cap:['Tình huống điển hình: RDS nằm ở data subnet riêng, chỉ tầng app kết nối được; bản Standby ở AZ khác đồng bộ liên tục và tự thăng cấp khi Primary sập (Multi-AZ).','典型例：RDS はデータ層サブネットに置き、アプリ層だけが接続。別 AZ のスタンバイが常時同期し、本系障害時に自動昇格します（Multi-AZ）。']},
'aws|Amazon Aurora':{inn:[ND('EC2 (tầng app)','Amazon EC2','SQL qua cluster endpoint','クラスタエンドポイントで SQL')],
 out:[ND('Aurora Replica','Amazon Aurora','replica đọc (≤15)','読み取りレプリカ（最大15）')],
 cap:['Tình huống điển hình: Aurora tách tầng lưu trữ khỏi compute — writer phục vụ ghi, các replica dùng chung storage để gánh lượt đọc, failover nhanh hơn RDS thường.','典型例：Aurora はストレージ層と計算層を分離。ライターが書き込み、共有ストレージのリプリカが読み取りを担い、通常の RDS より高速にフェイルオーバーします。']},
'aws|Amazon DynamoDB':{inn:[ND('Lambda','AWS Lambda','Get / Put theo key','キーで Get / Put')],
 out:[ND('Lambda','AWS Lambda','Streams → xử lý thay đổi','Streams → 変更を処理')],
 cap:['Tình huống điển hình: DynamoDB phục vụ tra cứu theo key ở độ trễ mili-giây cho tầng serverless; mọi thay đổi dữ liệu phát ra Streams để Lambda khác xử lý tiếp (đồng bộ search, thông báo…).','典型例：DynamoDB はサーバーレス層のキー参照をミリ秒で処理。変更は全て Streams に流れ、別の Lambda が続きを処理します（検索同期、通知等）。']},
'aws|Amazon VPC':{inn:[ND('Internet Gateway',null,'traffic vào / ra','出入りトラフィック')],
 out:[ND('EC2 (private subnet)','Amazon EC2','tài nguyên trong VPC','VPC 内リソース'),ND('NAT Gateway',null,'đường ra cho subnet private','プライベート側の出口')],
 cap:['Tình huống điển hình: VPC là “mảnh đất có hàng rào” chứa mọi tài nguyên — traffic vào qua Internet Gateway, tài nguyên ở private subnet ra ngoài qua NAT Gateway.','典型例：VPC は全リソースを囲む「柵付きの土地」。入ってくる通信は Internet Gateway 経由、私有サブネットの出口は NAT Gateway です。']},
'aws|AWS IAM':{inn:[ND('Người dùng / Ứng dụng',null,'yêu cầu cấp quyền','権限のリクエスト')],
 out:[ND('EC2 + IAM Role','Amazon EC2','role tạm thời (STS)','一時ロール（STS）')],
 cap:['Tình huống điển hình: IAM cấp “thẻ ra vào” cho mọi chủ thể — ứng dụng trên EC2 nhận role tạm thời qua STS để gọi AWS API, thay vì nhúng access key tĩnh vào máy.','典型例：IAM は全ての主体に「入館カード」を発行。EC2 上のアプリは STS の一時ロールで AWS API を呼び、静的キーを埋め込みません。']},
'aws|Amazon SQS':{inn:[ND('EC2 (bên gửi)','Amazon EC2','gửi message','メッセージ送信')],
 out:[ND('Lambda (bên xử lý)','AWS Lambda','poll & xử lý theo nhịp','ポーリングして処理')],
 cap:['Tình huống điển hình: SQS là hàng đợi “lấy số” giữa bên gửi và bên xử lý — giờ cao điểm message xếp hàng chờ, bên xử lý làm theo nhịp của mình mà không sập.','典型例：SQS は送信側と処理側の間の「番号札の列」。ピーク時はメッセージが並んで待ち、処理側は自分のペースで捌けます。']},
'aws|Amazon SNS':{inn:[ND('EC2 (bên phát)','Amazon EC2','publish 1 lần','1回 publish')],
 out:[ND('SQS','Amazon SQS','fan-out cho từng bên nhận','各購読者へファンアウト'),ND('Lambda','AWS Lambda','kích hoạt xử lý','処理を起動')],
 cap:['Tình huống điển hình: SNS là “loa phát thanh” — một thông báo publish một lần, mọi subscriber (SQS, Lambda, email, SMS…) đều nhận ngay.','典型例：SNS は「放送設備」。1回のアナウンスを、全ての購読者（SQS、Lambda、メール、SMS 等）が即座に受け取ります。']},
'aws|Amazon EventBridge':{inn:[ND('EC2 (nguồn sự kiện)','Amazon EC2','sự kiện nghiệp vụ','業務イベント')],
 out:[ND('Lambda','AWS Lambda','rule khớp → target','ルール一致 → ターゲット'),ND('Step Functions','AWS Step Functions','kích hoạt workflow','ワークフロー起動')],
 cap:['Tình huống điển hình: EventBridge là trạm trung chuyển sự kiện — sự kiện từ ứng dụng và từ chính AWS được lọc theo rule rồi chuyển đúng tới các target đã đăng ký.','典型例：EventBridge はイベントの仕分けターミナル。アプリと AWS 自身のイベントをルールで振り分け、登録済みターゲットへ正確に配送します。']},
'aws|AWS Step Functions':{inn:[ND('EventBridge','Amazon EventBridge','kích hoạt quy trình','プロセス起動')],
 out:[ND('Lambda (các bước)','AWS Lambda','điều phối · retry từng bước','各ステップを統括・リトライ')],
 cap:['Tình huống điển hình: Step Functions là “nhạc trưởng” của quy trình nhiều bước — gọi lần lượt các Lambda/dịch vụ, retry khi lỗi, rẽ nhánh theo kết quả, giữ trạng thái toàn trình.','典型例：Step Functions は多段プロセスの指揮者。Lambda やサービスを順に呼び、失敗時はリトライ、結果で分岐し、全体の状態を保持します。']},
'aws|Amazon API Gateway':{inn:[ND('App mobile / web',null,'HTTPS request','HTTPS リクエスト')],
 out:[ND('Lambda','AWS Lambda','xử lý nghiệp vụ','業務処理')],
 cap:['Tình huống điển hình: API Gateway là quầy lễ tân soát vé — kiểm tra API key/token, throttle chống quá tải, rồi mới chuyển request vào Lambda phía sau.','典型例：API Gateway は入口の受付。API キー/トークン確認と過負荷防止（スロットル）をしてから、背後の Lambda へ通します。']},
'aws|Amazon Route 53':{inn:[ND('Người dùng',null,'truy vấn DNS','DNS 問い合わせ')],
 out:[ND('ALB','Elastic Load Balancing (ALB)','alias record','エイリアスレコード'),ND('CloudFront','Amazon CloudFront','domain qua CDN','CDN 経由ドメイン')],
 cap:['Tình huống điển hình: Route 53 trả lời “domain này ở đâu” bằng bản ghi alias trỏ thẳng tới ALB/CloudFront, kèm health check để failover sang nơi khoẻ khi đích chính sập.','典型例：Route 53 はエイリアスレコードで ALB/CloudFront を直接指し、「このドメインはどこか」に答えます。ヘルスチェックで障害時は正常な側へ誘導します。']},
'aws|Amazon CloudWatch':{inn:[ND('EC2','Amazon EC2','metric · log','メトリクス・ログ')],
 out:[ND('SNS (alarm)','Amazon SNS','báo động → thông báo','アラーム → 通知')], bot:null,
 cap:['Tình huống điển hình: CloudWatch gom metric và log từ mọi service; khi chỉ số vượt ngưỡng, alarm kích hoạt SNS để gọi người trực — “camera + chuông báo” của cả hệ thống.','典型例：CloudWatch は全サービスの指標とログを集約。閾値を超えるとアラームが SNS 経由で当番を呼びます。システムの「カメラ＋警報ベル」です。']},
'aws|AWS Transit Gateway':{inn:[ND('VPC sản xuất',null,'attachment','アタッチメント')],
 out:[ND('VPC dùng chung',null,'route qua hub trung tâm','中央ハブ経由ルート'),ND('On-prem (Direct Connect)','AWS Direct Connect','kết nối lai','ハイブリッド接続')],
 cap:['Tình huống điển hình: Transit Gateway là “sân bay trung chuyển” — mọi VPC và cả on-prem nối về một hub duy nhất thay vì nối peering chéo nhau n×n.','典型例：Transit Gateway は「ハブ空港」。VPC 同士を総当たりでつなぐ代わりに、全てが中央ハブ経由でつながり、オンプレミスも接続します。']},
'aws|Amazon ECS':{inn:[ND('ALB','Elastic Load Balancing (ALB)','route request theo path','パスで振り分け')],
 out:[ND('RDS','Amazon RDS','dữ liệu của service','サービスのデータ')],
 cap:['Tình huống điển hình: ECS là quản đốc container phía AWS — giữ đúng số task mong muốn sau ALB, task chết được thay tự động; nơi chạy task có thể là Fargate hoặc EC2.','典型例：ECS は AWS のコンテナ現場監督。ALB の背後で希望タスク数を維持し、死んだタスクを自動で入れ替えます。実行場所は Fargate か EC2。']},
'aws|Amazon EKS':{inn:[ND('ALB (Ingress)','Elastic Load Balancing (ALB)','Ingress → Service','Ingress → Service')],
 out:[ND('RDS','Amazon RDS','dữ liệu của workload','ワークロードのデータ')],
 cap:['Tình huống điển hình: EKS chạy Kubernetes chuẩn — request vào qua Ingress (ALB), pod xử lý trong VPC và nối xuống RDS; mang nguyên manifest/Helm từ cụm K8s khác sang vẫn chạy.','典型例：EKS は標準 Kubernetes。リクエストは Ingress（ALB）から入り、Pod が VPC 内で処理して RDS へ。他クラスタのマニフェスト/Helm をそのまま持ち込めます。']},
'aws|AWS Fargate':{inn:[ND('ALB','Elastic Load Balancing (ALB)','request tới task','タスクへのリクエスト')],
 out:[ND('RDS','Amazon RDS','dữ liệu của task','タスクのデータ')],
 cap:['Tình huống điển hình: Fargate chạy container mà không cần thuê “tàu” (server) — bạn khai báo CPU/RAM của task, AWS lo phần máy bên dưới cho ECS/EKS.','典型例：Fargate は「船（サーバー）を借りずにコンテナだけ送る」方式。タスクの CPU/メモリを宣言すれば、下回りは AWS が用意します（ECS/EKS 用）。']},
'aws|Amazon ElastiCache':{inn:[ND('EC2 (tầng app)','Amazon EC2','cache-aside: hỏi cache trước','キャッシュアサイド：先にキャッシュ')],
 out:[ND('RDS','Amazon RDS','cache miss → đọc DB','ミス → DB を読む')],
 cap:['Tình huống điển hình: ElastiCache đứng trước RDS theo mẫu cache-aside — app hỏi cache trong RAM trước, chỉ khi miss mới đọc DB rồi nạp lại cache cho lần sau.','典型例：ElastiCache は RDS の手前にキャッシュアサイド型で配置。アプリはまず RAM 上のキャッシュを聞き、ミスの時だけ DB を読んでキャッシュを補充します。']},
'aws|Amazon Redshift':{inn:[ND('S3','Amazon S3','COPY nạp dữ liệu','COPY で取り込み')],
 out:[ND('QuickSight','Amazon QuickSight','dashboard BI','BI ダッシュボード')],
 cap:['Tình huống điển hình: Redshift là kho phân tích (OLAP) — dữ liệu nạp hàng loạt từ S3 bằng COPY, nhà phân tích chạy SQL tổng hợp và xem qua QuickSight.','典型例：Redshift は分析倉庫（OLAP）。データを S3 から COPY で一括投入し、アナリストが集計 SQL を実行、QuickSight で可視化します。']},
'aws|Amazon Athena':{inn:[ND('S3','Amazon S3','SQL trên object','オブジェクトへ SQL')],
 out:[ND('S3 (kết quả truy vấn)','Amazon S3','ghi kết quả','結果を保存')],
 cap:['Tình huống điển hình: Athena chạy SQL trực tiếp trên file trong S3 mà không cần dựng server hay nạp dữ liệu — trả tiền theo lượng dữ liệu quét, kết quả ghi lại vào S3.','典型例：Athena はサーバー構築も取り込みもなしに、S3 内ファイルへ直接 SQL。課金はスキャン量で、結果は S3 に保存されます。']},
'aws|Amazon Kinesis Data Streams':{inn:[ND('EC2 / IoT','Amazon EC2','put records liên tục','レコードを連続投入')],
 out:[ND('Lambda','AWS Lambda','xử lý stream','ストリーム処理')],
 cap:['Tình huống điển hình: Kinesis Data Streams nhận dòng sự kiện liên tục (click, telemetry) theo shard; các consumer như Lambda đọc và xử lý gần thời gian thực, đọc lại được khi cần.','典型例：Kinesis Data Streams はシャード単位で連続イベント（クリック、テレメトリ）を受け、Lambda 等のコンシューマが準リアルタイムに処理し、必要なら再生もできます。']},
'aws|AWS Backup':{inn:[ND('EC2 · RDS','Amazon EC2','backup theo lịch tập trung','集中スケジュールでバックアップ')],
 out:[ND('S3 (vault)','Amazon S3','bản sao sang region khác','別リージョンへ複製')],
 cap:['Tình huống điển hình: AWS Backup gom lịch sao lưu của EC2/RDS/EBS… về một nơi — backup tự động trong region và sao chép sang region thứ hai cho kịch bản DR.','典型例：AWS Backup は EC2/RDS/EBS 等のバックアップ計画を一元化。リージョン内の自動バックアップと、DR 用の第2リージョンへの複製を行います。']},
'aws|Amazon EMR':{inn:[ND('S3','Amazon S3','dữ liệu thô (raw)','生データ')],
 out:[ND('S3','Amazon S3','kết quả đã xử lý','処理済み結果')],
 cap:['Tình huống điển hình: EMR chạy Spark/Hadoop xử lý dữ liệu lớn theo cụm tạm thời — đọc từ S3, ghi kết quả về S3, xong việc là xoá cụm để ngừng tính tiền.','典型例：EMR は一時クラスタで Spark/Hadoop の大規模処理。S3 から読み、結果を S3 へ書き、終わればクラスタを消して課金を止めます。']},
'aws|AWS Glue':{inn:[ND('S3','Amazon S3','crawl & đăng ký catalog','クロールとカタログ登録')],
 out:[ND('Athena','Amazon Athena','truy vấn qua catalog','カタログ経由で検索')],
 cap:['Tình huống điển hình: Glue crawl dữ liệu trong S3 để dựng Data Catalog (schema) và chạy ETL; Athena/EMR dùng chung catalog đó để truy vấn.','典型例：Glue が S3 内データをクロールしてデータカタログ（スキーマ）を構築し、ETL も実行。Athena/EMR がそのカタログを共用して検索します。']},
'aws|Amazon SageMaker':{inn:[ND('S3','Amazon S3','dữ liệu huấn luyện','学習データ')],
 out:[ND('Model endpoint',null,'suy luận thời gian thực','リアルタイム推論')],
 cap:['Tình huống điển hình: SageMaker huấn luyện model từ dữ liệu trong S3 rồi triển khai thành endpoint để ứng dụng gọi suy luận — vòng đời ML khép kín trong một service.','典型例：SageMaker は S3 のデータでモデルを学習し、エンドポイントとしてデプロイしてアプリから推論を呼べます。ML のライフサイクルを1サービスで完結。']},
'aws|Amazon Bedrock':{inn:[ND('Ứng dụng GenAI',null,'prompt / câu hỏi','プロンプト／質問')],
 out:[ND('S3 (Knowledge Base)','Amazon S3','tài liệu cho RAG','RAG 用ドキュメント')],
 cap:['Tình huống điển hình: Bedrock cho gọi các foundation model qua API — ứng dụng gửi prompt, model đối chiếu tài liệu trong Knowledge Base (trên S3) để trả lời có căn cứ (RAG).','典型例：Bedrock は API で基盤モデルを呼べます。アプリがプロンプトを送り、モデルが Knowledge Base（S3 上の文書）を参照して根拠付きで回答します（RAG）。']},
'aws|Amazon Cognito':{inn:[ND('App mobile / web',null,'đăng ký · đăng nhập','登録・ログイン')],
 out:[ND('API Gateway','Amazon API Gateway','JWT đính kèm request','リクエストに JWT 付与')],
 cap:['Tình huống điển hình: Cognito quản lý người dùng cuối — app đăng nhập qua Cognito, nhận JWT rồi đính vào mọi request gọi API Gateway/Lambda.','典型例：Cognito はエンドユーザー管理。アプリがログインして JWT を受け取り、以降の API Gateway/Lambda 呼び出しに付与します。']}
};

/* ---------- KỊCH BẢN VIẾT TAY (GCP) ---------- */
Object.assign(SCEN,{
'gcp|Compute Engine':{inn:[ND('Cloud Load Balancing','Cloud Load Balancing','HTTPS đã cân bằng tải','負荷分散済み HTTPS')],
 out:[ND('Cloud SQL','Cloud SQL','SQL đọc / ghi','SQL の読み書き')],
 cap:['Tình huống điển hình: Compute Engine là tầng máy ảo sau Global LB — toàn quyền OS, và được giảm giá tự động (Sustained Use) khi chạy lâu dài.','典型例：Compute Engine はグローバル LB の背後の VM 層。OS の全権限を持ち、長時間稼働では継続利用割引が自動で効きます。']},
'gcp|Cloud Run':{inn:[ND('Người dùng / hệ thống',null,'HTTPS request','HTTPS リクエスト')],
 out:[ND('Cloud SQL','Cloud SQL','kết nối IP riêng','プライベート IP で接続')],
 cap:['Tình huống điển hình: Cloud Run nhận HTTPS request, tự scale theo traffic (về 0 khi rảnh) và nối vào Cloud SQL bằng IP riêng trong VPC — container serverless hoàn chỉnh cho API/web.','典型例：Cloud Run は HTTPS を受け、トラフィックでスケール（無ければ0）し、VPC 内のプライベート IP で Cloud SQL へ接続。API/Web 向けの完成したサーバーレスコンテナです。']},
'gcp|Cloud Storage':{inn:[ND('Compute Engine','Compute Engine','API đọc / ghi object','オブジェクトの読み書き API')],
 out:[ND('Global LB + Cloud CDN','Cloud Load Balancing','phân phối qua CDN','CDN で配信'),ND('BigQuery','BigQuery','nạp dữ liệu phân tích','分析データ取り込み')],
 cap:['Tình huống điển hình: Cloud Storage là kho object trung tâm của GCP — ứng dụng đọc/ghi qua API, nội dung tĩnh phân phối qua LB + Cloud CDN, dữ liệu nạp thẳng vào BigQuery để phân tích.','典型例：Cloud Storage は GCP の中心のオブジェクト保管庫。アプリは API で読み書き、静的配信は LB＋Cloud CDN、データは BigQuery へ直接取り込んで分析します。']},
'gcp|Cloud SQL':{inn:[ND('Cloud Run','Cloud Run','kết nối IP riêng','プライベート IP で接続')],
 out:[ND('Standby (HA)','Cloud SQL','đồng bộ trong region','リージョン内で同期')],
 cap:['Tình huống điển hình: Cloud SQL nằm sau tầng ứng dụng với IP riêng; bản Regional HA giữ standby ở zone khác trong region và failover tự động khi zone chính sập.','典型例：Cloud SQL はアプリ層の背後にプライベート IP で配置。リージョナル HA は同一リージョンの別ゾーンにスタンバイを持ち、ゾーン障害時に自動フェイルオーバーします。']},
'gcp|BigQuery':{inn:[ND('Cloud Storage','Cloud Storage','load dữ liệu','データ取り込み')],
 out:[ND('Looker Studio / BI',null,'dashboard · báo cáo','ダッシュボード・レポート')],
 cap:['Tình huống điển hình: BigQuery là kho phân tích serverless — nạp dữ liệu từ Cloud Storage, chạy SQL quét hàng TB trong vài giây, kết quả ra dashboard BI.','典型例：BigQuery はサーバーレス分析基盤。Cloud Storage から取り込み、TB 級を数秒で走査する SQL を実行し、結果を BI ダッシュボードへ。']},
'gcp|Pub/Sub':{inn:[ND('Compute Engine','Compute Engine','publish message','メッセージを publish')],
 out:[ND('Dataflow','Dataflow','subscription → xử lý stream','サブスクリプション → ストリーム処理'),ND('Cloud Run functions','Cloud Run functions','xử lý theo sự kiện','イベントで処理')],
 cap:['Tình huống điển hình: Pub/Sub là xương sống truyền tin của GCP — bên phát publish vào topic, mỗi bên nhận có subscription riêng: Dataflow xử lý stream, functions xử lý từng sự kiện.','典型例：Pub/Sub は GCP のメッセージング基盤。発信側がトピックへ publish し、受け手は各自のサブスクリプションで受けます（Dataflow がストリーム処理、関数がイベント処理）。']},
'gcp|Google Kubernetes Engine (GKE)':{inn:[ND('Cloud Load Balancing','Cloud Load Balancing','Ingress → Service','Ingress → Service')],
 out:[ND('Cloud SQL','Cloud SQL','dữ liệu của workload','ワークロードのデータ')],
 cap:['Tình huống điển hình: GKE chạy Kubernetes ở “quê hương” của nó — request vào qua Ingress/LB, pod xử lý trong VPC và nối xuống Cloud SQL; chế độ Autopilot lo gần như toàn bộ node.','典型例：GKE は Kubernetes の本家で動かします。リクエストは Ingress/LB から入り、Pod が VPC 内で処理して Cloud SQL へ。Autopilot ならノードはほぼ全て任せられます。']},
'gcp|Cloud Load Balancing':{inn:[ND('Người dùng',null,'HTTPS vào IP anycast','anycast IP へ HTTPS')],
 out:[ND('Cloud Run','Cloud Run','backend service','バックエンドサービス'),ND('Compute Engine (MIG)','Compute Engine','backend MIG','MIG バックエンド')],
 cap:['Tình huống điển hình: Cloud Load Balancing dùng một địa chỉ anycast toàn cầu duy nhất — người dùng ở đâu cũng được đưa về backend (Cloud Run/MIG) gần nhất đang khoẻ.','典型例：Cloud Load Balancing は単一のグローバル anycast アドレス。世界中どこからでも、最も近く正常なバックエンド（Cloud Run/MIG）へ案内します。']},
'gcp|Cloud VPC (Google Cloud)':{inn:[ND('Cloud Load Balancing','Cloud Load Balancing','traffic vào VPC','VPC へのトラフィック')],
 out:[ND('Compute Engine','Compute Engine','subnet theo region','リージョン別サブネット'),ND('Cloud NAT','Cloud NAT','đường ra cho VM private','プライベート VM の出口')],
 cap:['Tình huống điển hình: VPC của GCP là một mạng toàn cầu dùng chung — subnet mới phân theo region; VM private ra internet qua Cloud NAT theo region.','典型例：GCP の VPC は全世界共通の単一ネットワーク。サブネットだけがリージョン単位で、プライベート VM の出口はリージョン単位の Cloud NAT です。']},
'gcp|Google Cloud IAM':{inn:[ND('Admin / người dùng',null,'gán role theo project','プロジェクト単位でロール付与')],
 out:[ND('Compute Engine','Compute Engine','quyền thừa hưởng xuống project','プロジェクトへ継承される権限')],
 cap:['Tình huống điển hình: IAM của GCP cấp quyền theo cây tổ chức — role gán ở cấp organization/folder sẽ thừa hưởng xuống các project con; service account là danh tính cho workload như Cloud Run/GCE.','典型例：GCP の IAM は組織ツリーで権限を付与。上位（組織/フォルダ）のロールは配下プロジェクトへ継承され、サービスアカウントが Cloud Run/GCE 等のワークロードの ID になります。']},
'gcp|Cloud DNS':{inn:[ND('Người dùng',null,'truy vấn DNS','DNS 問い合わせ')],
 out:[ND('Cloud Load Balancing','Cloud Load Balancing','A record → IP anycast','A レコード → anycast IP')],
 cap:['Tình huống điển hình: Cloud DNS trả lời tên miền bằng bản ghi trỏ tới địa chỉ anycast của Global LB — chạy trên mạng anycast của Google nên phân giải nhanh ở mọi nơi.','典型例：Cloud DNS はドメインに対し、グローバル LB の anycast アドレスを指すレコードで応答。Google の anycast 網で動くため、世界中どこでも高速です。']},
'gcp|Cloud Monitoring':{inn:[ND('Compute Engine','Compute Engine','metric · log','メトリクス・ログ')],
 out:[ND('Thông báo cho SRE',null,'alert policy → email/chat','アラート → メール/チャット')], bot:null,
 cap:['Tình huống điển hình: Cloud Monitoring là phòng điều hành trung tâm — gom metric/log của mọi dịch vụ về một dashboard, alert policy gọi đội SRE khi chỉ số vượt ngưỡng.','典型例：Cloud Monitoring は中央管制室。全サービスの指標とログを1つのダッシュボードに集め、閾値超過時はアラートポリシーが SRE を呼びます。']},
'gcp|Cloud NAT':{inn:[ND('Compute Engine (private)','Compute Engine','VM không có IP public','公開 IP の無い VM')],
 out:[ND('Internet',null,'ra ngoài qua NAT dùng chung','共通 NAT 経由で外へ')],
 cap:['Tình huống điển hình: Cloud NAT là “lễ tân chung” theo region — VM private liên hệ ra internet qua NAT nên không cần IP public, và bên ngoài không khởi tạo được kết nối vào.','典型例：Cloud NAT はリージョン単位の「共通受付」。プライベート VM は NAT 経由で外へ出るため公開 IP が不要で、外から勝手に入ることもできません。']},
'gcp|Firestore':{inn:[ND('Cloud Run','Cloud Run','đọc / ghi document','ドキュメントの読み書き')],
 out:[ND('App mobile',null,'đồng bộ realtime','リアルタイム同期')],
 cap:['Tình huống điển hình: Firestore là document DB cho app — backend Cloud Run ghi dữ liệu, client mobile/web lắng nghe thay đổi theo realtime và dùng được cả khi offline.','典型例：Firestore はアプリ向けドキュメント DB。バックエンド（Cloud Run）が書き込み、モバイル/Web クライアントがリアルタイムに購読し、オフラインでも使えます。']},
'gcp|Cloud Bigtable':{inn:[ND('Dataflow','Dataflow','ghi time-series liên tục','時系列を連続書き込み')],
 out:[ND('Ứng dụng phân tích',null,'đọc theo key ở quy mô lớn','大規模なキー読み取り')],
 cap:['Tình huống điển hình: Bigtable nhận luồng ghi khổng lồ (telemetry, IoT, lịch sử sự kiện) qua Dataflow và phục vụ đọc theo key ở độ trễ mili-giây trên hàng tỉ dòng.','典型例：Bigtable は Dataflow 経由で巨大な書き込み流（テレメトリ、IoT、イベント履歴）を受け、数十億行に対してミリ秒のキー読み取りを提供します。']},
'gcp|Dataflow':{inn:[ND('Pub/Sub','Pub/Sub','stream sự kiện','イベントストリーム')],
 out:[ND('BigQuery','BigQuery','ghi kết quả đã xử lý','処理結果を書き込み')],
 cap:['Tình huống điển hình: Dataflow là tầng xử lý stream/batch managed (Apache Beam) — đọc sự kiện từ Pub/Sub, biến đổi theo cửa sổ thời gian, ghi kết quả vào BigQuery.','典型例：Dataflow はマネージドなストリーム/バッチ処理（Apache Beam）。Pub/Sub のイベントを読み、時間窓で変換し、結果を BigQuery へ書きます。']},
'gcp|Cloud Run functions':{inn:[ND('Pub/Sub','Pub/Sub','kích hoạt theo sự kiện','イベントで起動')],
 out:[ND('Firestore','Firestore','ghi dữ liệu','データを書き込み')],
 cap:['Tình huống điển hình: Cloud Run functions chạy hàm theo sự kiện — message tới Pub/Sub thì hàm thức dậy xử lý rồi ghi kết quả vào Firestore, không sự kiện thì không tốn chi phí.','典型例：Cloud Run functions はイベント駆動の関数。Pub/Sub にメッセージが来ると起動して処理し、結果を Firestore へ。イベントが無ければ費用もゼロです。']},
'gcp|Vertex AI':{inn:[ND('Cloud Storage','Cloud Storage','dữ liệu · tài liệu','データ・ドキュメント')],
 out:[ND('Ứng dụng AI',null,'gọi model Gemini / endpoint','Gemini モデル／エンドポイント呼び出し')],
 cap:['Tình huống điển hình: Vertex AI là nền tảng AI hợp nhất của GCP — dữ liệu nằm ở Cloud Storage, ứng dụng gọi model Gemini hoặc endpoint đã triển khai qua API.','典型例：Vertex AI は GCP の統合 AI 基盤。データは Cloud Storage に置き、アプリは API 経由で Gemini モデルやデプロイ済みエンドポイントを呼びます。']},
'gcp|Cloud Spanner':{inn:[ND('Cloud Run','Cloud Run','giao dịch SQL toàn cầu','グローバル SQL トランザクション')],
 out:[ND('Replica đa region','Cloud Spanner','nhất quán mạnh xuyên region','リージョン間の強い整合性')],
 cap:['Tình huống điển hình: Spanner phục vụ giao dịch SQL cần đúng tuyệt đối ở quy mô toàn cầu — replica trải nhiều region nhưng vẫn giữ nhất quán mạnh như một DB duy nhất.','典型例：Spanner は全世界規模で厳密さが要る SQL トランザクション向け。レプリカは複数リージョンに広がりながら、単一 DB のような強い整合性を保ちます。']},
'gcp|Memorystore':{inn:[ND('Compute Engine','Compute Engine','cache-aside: hỏi cache trước','キャッシュアサイド：先にキャッシュ')],
 out:[ND('Cloud SQL','Cloud SQL','cache miss → đọc DB','ミス → DB を読む')],
 cap:['Tình huống điển hình: Memorystore (Redis/Memcached managed) đứng trước Cloud SQL theo mẫu cache-aside — đọc lặp được phục vụ từ RAM, giảm tải cho database trong giờ cao điểm.','典型例：Memorystore（マネージド Redis/Memcached）は Cloud SQL の手前にキャッシュアサイド型で配置。繰り返し読み取りを RAM から返し、ピーク時の DB 負担を減らします。']}
});

/* ---------- MẪU THEO NHÓM (mọi service còn lại) ---------- */
var OBS={aws:'Amazon CloudWatch', gcp:'Cloud Monitoring'};
var GTPL={
aws:{
 'Compute':{inn:[ND('ALB','Elastic Load Balancing (ALB)','request đã cân bằng tải','負荷分散済みリクエスト')],out:[ND('RDS','Amazon RDS','dữ liệu ứng dụng','アプリデータ')]},
 'Containers':{inn:[ND('ALB','Elastic Load Balancing (ALB)','request tới container','コンテナへのリクエスト')],out:[ND('RDS','Amazon RDS','dữ liệu ứng dụng','アプリデータ')]},
 'Storage':{inn:[ND('EC2 / Ứng dụng','Amazon EC2','API đọc / ghi','読み書き API')],out:[ND('CloudFront','Amazon CloudFront','phân phối nội dung','コンテンツ配信')]},
 'Database':{inn:[ND('EC2 (tầng app)','Amazon EC2','kết nối từ tầng app','アプリ層から接続')],out:[ND('Replica / Backup',null,'sao lưu & dự phòng','バックアップと冗長化')]},
 'Networking & Content Delivery':{inn:[ND('Người dùng',null,'traffic vào','入ってくるトラフィック')],out:[ND('EC2 (origin / backend)','Amazon EC2','chuyển tới backend','バックエンドへ転送')]},
 'Analytics':{inn:[ND('S3','Amazon S3','dữ liệu nguồn','ソースデータ')],out:[ND('Dashboard / báo cáo',null,'kết quả phân tích','分析結果')]},
 'Machine Learning':{inn:[ND('S3','Amazon S3','dữ liệu / tài liệu','データ・ドキュメント')],out:[ND('Ứng dụng AI',null,'kết quả model','モデルの結果')]},
 'Application Integration':{inn:[ND('EC2 (bên phát)','Amazon EC2','phát lệnh / sự kiện','命令・イベント発行')],out:[ND('Lambda (bên nhận)','AWS Lambda','xử lý tiếp','続きを処理')]},
 'Security, Identity & Compliance':{inn:[ND('Admin / hệ thống',null,'cấu hình & kiểm tra','設定と検査')],out:[ND('SNS','Amazon SNS','cảnh báo bảo mật','セキュリティ警告')]},
 'Management & Governance':{inn:[ND('Admin / SRE',null,'quản trị & giám sát','管理と監視')],out:[ND('SNS','Amazon SNS','thông báo','通知')]},
 'Developer Tools':{inn:[ND('Lập trình viên',null,'commit / triển khai','コミット／デプロイ')],out:[ND('EC2 (đích triển khai)','Amazon EC2','đưa code lên chạy','コードを配置')]},
 'Migration & Transfer':{inn:[ND('On-prem / nguồn',null,'dữ liệu nguồn','移行元データ')],out:[ND('S3 (đích trên AWS)','Amazon S3','đích di chuyển','移行先')]},
 'Front-end Web & Mobile':{inn:[ND('App mobile / web',null,'request từ client','クライアントのリクエスト')],out:[ND('Lambda (backend)','AWS Lambda','xử lý backend','バックエンド処理')]},
 'Media Services':{inn:[ND('Nguồn media',null,'media đầu vào','入力メディア')],out:[ND('S3','Amazon S3','media đầu ra','出力メディア')]},
 'Internet of Things':{inn:[ND('Thiết bị IoT',null,'telemetry / sự kiện','テレメトリ・イベント')],out:[ND('S3','Amazon S3','lưu dữ liệu thiết bị','デバイスデータを保存')]},
 'End User Computing':{inn:[ND('Nhân viên',null,'phiên làm việc','作業セッション')],out:[ND('EC2 (ứng dụng nội bộ)','Amazon EC2','ứng dụng nội bộ','内部アプリ')]},
 'Business Applications':{inn:[ND('Người dùng nghiệp vụ',null,'thao tác nghiệp vụ','業務操作')],out:[ND('Hệ thống nghiệp vụ khác',null,'tích hợp','連携')]},
 '_def':{inn:[ND('Người dùng / Ứng dụng',null,'request / gọi API','リクエスト／API 呼び出し')],out:[ND('Hệ thống tích hợp',null,'kết quả / sự kiện','結果・イベント')]}
},
gcp:{
 'Compute':{inn:[ND('Cloud Load Balancing','Cloud Load Balancing','request đã cân bằng tải','負荷分散済みリクエスト')],out:[ND('Cloud SQL','Cloud SQL','dữ liệu ứng dụng','アプリデータ')]},
 'Containers':{inn:[ND('Cloud Load Balancing','Cloud Load Balancing','request tới container','コンテナへのリクエスト')],out:[ND('Cloud SQL','Cloud SQL','dữ liệu ứng dụng','アプリデータ')]},
 'Storage':{inn:[ND('Compute Engine','Compute Engine','API đọc / ghi','読み書き API')],out:[ND('BigQuery','BigQuery','nạp dữ liệu phân tích','分析データ取り込み')]},
 'Databases':{inn:[ND('Cloud Run (tầng app)','Cloud Run','kết nối từ tầng app','アプリ層から接続')],out:[ND('Replica / Backup',null,'sao lưu & dự phòng','バックアップと冗長化')]},
 'Networking':{inn:[ND('Người dùng',null,'traffic vào','入ってくるトラフィック')],out:[ND('Compute Engine (backend)','Compute Engine','chuyển tới backend','バックエンドへ転送')]},
 'Analytics':{inn:[ND('Cloud Storage','Cloud Storage','dữ liệu nguồn','ソースデータ')],out:[ND('Dashboard / báo cáo',null,'kết quả phân tích','分析結果')]},
 'AI & Machine Learning':{inn:[ND('Cloud Storage','Cloud Storage','dữ liệu / tài liệu','データ・ドキュメント')],out:[ND('Ứng dụng AI',null,'kết quả model','モデルの結果')]},
 'Application Integration':{inn:[ND('Compute Engine (bên phát)','Compute Engine','phát lệnh / sự kiện','命令・イベント発行')],out:[ND('Cloud Run functions','Cloud Run functions','xử lý tiếp','続きを処理')]},
 'Security & Identity':{inn:[ND('Admin / hệ thống',null,'cấu hình & kiểm tra','設定と検査')],out:[ND('Cloud Monitoring','Cloud Monitoring','cảnh báo bảo mật','セキュリティ警告')]},
 'Management & DevOps':{inn:[ND('Admin / SRE',null,'quản trị & giám sát','管理と監視')],out:[ND('Cloud Monitoring','Cloud Monitoring','thông báo · cảnh báo','通知・アラート')]},
 'Developer Tools':{inn:[ND('Lập trình viên',null,'commit / triển khai','コミット／デプロイ')],out:[ND('Cloud Run (đích triển khai)','Cloud Run','đưa code lên chạy','コードを配置')]},
 'Migration':{inn:[ND('On-prem / nguồn',null,'dữ liệu nguồn','移行元データ')],out:[ND('Cloud Storage (đích)','Cloud Storage','đích di chuyển','移行先')]},
 'Media & Other':{inn:[ND('Người dùng / hệ thống',null,'request','リクエスト')],out:[ND('Cloud Storage','Cloud Storage','lưu kết quả','結果を保存')]},
 '_def':{inn:[ND('Người dùng / Ứng dụng',null,'request / gọi API','リクエスト／API 呼び出し')],out:[ND('Hệ thống tích hợp',null,'kết quả / sự kiện','結果・イベント')]}
}};
function findItem4(cloud,name){
  var core=(typeof COREMAP!=='undefined')?COREMAP[cloud+'|'+name]:null;
  if(core) return {group:core.g, glyph:core.gl};
  var cat=cloud==='aws'?AWS_CAT:GCP_CAT, found=null, group='';
  cat.forEach(function(gr){ gr.items.forEach(function(it){ if(it[0]===name){ found=it; group=gr.g; } }); });
  return {group:group, glyph:found?found[1]:'box'};
}
function scenFor(cloud,name,group){
  var sc=SCEN[cloud+'|'+name];
  if(sc) return sc;
  var tpl=(GTPL[cloud]&&(GTPL[cloud][group]||GTPL[cloud]._def))||GTPL.aws._def;
  var obs=OBS[cloud];
  return {inn:tpl.inn, out:tpl.out,
    cap:[name+' trong một kiến trúc điển hình của nhóm '+group+': nhận đầu vào từ phía trái, xử lý theo đúng chức năng của nó và chuyển kết quả sang phía phải; log và metric luôn đổ về '+obs+' để giám sát.',
         group+' グループにおける '+name+' の典型構成：左側から入力を受け、本来の機能で処理して右側へ渡します。ログとメトリクスは常に '+obs+' へ送られ監視されます。']};
}

/* ---------- VẼ SVG SƠ ĐỒ VÍ DỤ ---------- */
function glyphOf(svc){
  if(!svc||typeof NAME2I==='undefined') return null;
  var m=NAME2I[svc]; if(!m) return null;
  var col=(m.cloud==='gcp')?((typeof GCP_GC!=='undefined'&&GCP_GC[m.group])||'#4285F4'):((typeof AWS_GC!=='undefined'&&AWS_GC[m.group])||'#E07700');
  return {g:(typeof GLYPHS!=='undefined'&&(GLYPHS[m.glyph]||GLYPHS.box))||'', col:col, cloud:m.cloud};
}
function wrap2(txt,max){
  txt=String(txt); if(txt.length<=max) return [txt];
  var words=txt.split(' '), lines=[''], li=0;
  words.forEach(function(w){
    if(lines[li].length+(lines[li]?1:0)+w.length<=max) lines[li]+=(lines[li]?' ':'')+w;
    else if(li===0){ lines.push(w); li=1; }
    else lines[li]+=' '+w;
  });
  if(lines.length>2){ lines=lines.slice(0,2); lines[1]=lines[1].length>max?lines[1].slice(0,max-1)+'…':lines[1]; }
  return lines;
}
function nodeSVG(cx,cy,w,h,disp,svc,center){
  var x=cx-w/2, y=cy-h/2;
  var gi=glyphOf(svc);
  var stroke=center?'#ffb84d':(gi?gi.col:'rgba(167,139,250,.75)');
  var inner='';
  if(gi){
    var gs=center?30:22;
    inner+='<g transform="translate('+(cx-gs/2)+','+(y+(center?8:6))+') scale('+(gs/24)+')" fill="none" stroke="'+gi.col+'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="color:'+gi.col+'">'+gi.g+'</g>';
  }else{
    inner+='<circle cx="'+cx+'" cy="'+(y+17)+'" r="8" fill="none" stroke="rgba(167,139,250,.8)" stroke-width="1.6" stroke-dasharray="3 3"/>';
  }
  var lines=wrap2(disp,center?17:16);
  var ly=y+(center?50:40);
  lines.forEach(function(ln,i){
    inner+='<text x="'+cx+'" y="'+(ly+i*15)+'" text-anchor="middle" font-size="'+(center?14.5:13)+'" font-weight="'+(center?800:700)+'" fill="'+(center?'#ffffff':'#e8eefb')+'">'+E(ln)+'</text>';
  });
  var g='<g><rect class="svcd-nb" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="'+(center?'#12233f':'#0d1730')+'" stroke="'+stroke+'" stroke-width="'+(center?2.4:1.5)+'"'+(svc?'':' stroke-dasharray="5 4"')+'/>'+inner+'</g>';
  if(svc&&gi){
    return '<a href="#/service/'+gi.cloud+'/'+encodeURIComponent(svc)+'" aria-label="'+E(svc)+'">'+g+'</a>';
  }
  return g;
}
function edgeSVG(x1,y1,x2,y2,label){
  var mx=(x1+x2)/2, my=(y1+y2)/2, out='';
  if(label){
    var ls=wrap2(label,15);
    ls.forEach(function(ln,i){ out+='<text x="'+mx+'" y="'+(my-5+i*12)+'" text-anchor="middle" font-size="10.3" fill="#8fa3c2">'+E(ln)+'</text>'; });
  }
  return '<path d="M'+x1+','+y1+' L'+x2+','+y2+'" stroke="#5b7ba6" stroke-width="1.8" fill="none" marker-end="url(#svcdAh)"/>'+out;
}
function diagramSVG(cloud,name,group,glyph,scen){
  var CY=104;
  var inn=scen.inn.slice(0,2), out=scen.out.slice(0,2);
  var s='<svg class="svcd-diagram" viewBox="0 0 720 262" role="img" aria-label="'+E(L('Sơ đồ ví dụ: ','例の図：')+name)+'">'
    +'<defs><marker id="svcdAh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7f93ad"/></marker></defs>';
  function ys(list){ return list.length===1?[CY]:[56,166]; }
  var iy=ys(inn), oy=ys(out);
  inn.forEach(function(nd,i){ s+=edgeSVG(176,iy[i],266,CY, ja()?nd[3]:nd[2]); });
  out.forEach(function(nd,i){ s+=edgeSVG(454,CY,544,oy[i], ja()?nd[3]:nd[2]); });
  inn.forEach(function(nd,i){ s+=nodeSVG(93,iy[i],166,64,nd[0],nd[1],false); });
  out.forEach(function(nd,i){ s+=nodeSVG(627,oy[i],166,64,nd[0],nd[1],false); });
  /* node trung tâm = chính service, icon của nó */
  s+=nodeSVG(360,CY,188,78,name,name,true);
  /* node giám sát phía dưới */
  var bot=('bot' in scen)?scen.bot:ND(cloud==='gcp'?'Cloud Monitoring':'CloudWatch',OBS[cloud],'','');
  if(bot){
    s+='<path d="M360,143 L360,204" stroke="#40649f" stroke-width="1.6" stroke-dasharray="4 4" fill="none" marker-end="url(#svcdAh)"/>'
      +'<text x="369" y="180" font-size="10.8" fill="#8fa3c2">log · metric · alarm</text>'
      +nodeSVG(360,226,190,46,bot[0],bot[1],false);
  }
  return s+'</svg>';
}
function svcdHTML(cloud,name){
  var f=findItem4(cloud,name);
  var scen=scenFor(cloud,name,f.group);
  return '<h3>🗺️ '+L('Sơ đồ ví dụ — cách dùng điển hình','例の図 — 典型的な使い方')+'</h3>'
    +'<div class="svcd-frame">'+diagramSVG(cloud,name,f.group,f.glyph,scen)+'</div>'
    +'<p class="svcd-cap">'+E(pick(scen.cap))+'</p>'
    +(ja()?'':'<p class="svcd-cap-jp">日本語：'+E(scen.cap[1])+'</p>');
}

/* ---------- GẮN VÀO TRANG CHI TIẾT SERVICE ---------- */
var svcdState={cloud:null,name:null};
function injectSvcd(){
  var host=$('svcDetailBody'); if(!host||!host.innerHTML) return;
  var m=(location.hash||'').match(/^#\/service\/(aws|gcp)\/(.+)$/); if(!m) return;
  var cloud=m[1], name=decodeURIComponent(m[2]);
  var old=host.querySelector('[data-svcd]');
  if(old){
    if(svcdState.cloud===cloud&&svcdState.name===name&&old.getAttribute('data-lang')===window.LANG) return;
    old.innerHTML=svcdHTML(cloud,name); old.setAttribute('data-lang',window.LANG); svcdState={cloud:cloud,name:name}; return;
  }
  var div=document.createElement('div');
  div.className='dsec svcd'; div.setAttribute('data-svcd','1'); div.setAttribute('data-lang',window.LANG);
  div.innerHTML=svcdHTML(cloud,name);
  svcdState={cloud:cloud,name:name};
  var anchor=host.querySelector('[data-tldr]')||host.querySelector('[data-svcnav]')||host.querySelector('.d-actions');
  if(anchor&&anchor.nextSibling) host.insertBefore(div,anchor.nextSibling);
  else if(anchor) host.appendChild(div);
  else host.insertBefore(div,host.firstChild);
}
try{
  var svcBodyEl4=$('svcDetailBody');
  if(svcBodyEl4) new MutationObserver(function(){ injectSvcd(); }).observe(svcBodyEl4,{childList:true});
  window.addEventListener('hashchange',function(){ setTimeout(injectSvcd,40); });
  setTimeout(injectSvcd,80);
}catch(e){}
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){ setTimeout(function(){ svcdState={cloud:null,name:null}; injectSvcd(); },90); });
});
})();
