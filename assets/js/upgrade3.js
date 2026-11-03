/* ============================================================
   upgrade3.js — ĐỢT 3 (theo bản đánh giá Gemini):
   1 · Guided Tour "Chạy từng bước" trên Thư viện Sơ đồ:
       làm sáng node + đường đi của bước hiện tại, làm mờ phần
       còn lại, hộp giải thích kèm câu hỏi "vì sao" từng bước.
       Có sẵn cho: Data Pipeline 10 bước (pipe), Web 3-tier
       Multi-AZ (a2), Website tĩnh toàn cầu (a1) — cả bản AWS
       lẫn GCP; các sơ đồ còn lại có node đánh số thì tự sinh
       tour theo số thứ tự của node.
   2 · Failure Simulation trên 3 sơ đồ HA: Web 3-tier Multi-AZ
       (a2), Backup & DR (a5), Multi-region Active–Active (b14):
       nhánh sập đỏ + mờ, đường sống sáng xanh, chú thích ngay
       trên sơ đồ + hộp diễn tiến failover, nút khôi phục.
   3 · Trang Pricing Gotchas (#/pricing) — phí ẩn & bẫy giá,
       so sánh mô hình giảm giá AWS ⇄ GCP.
   4 · Trang Cây quyết định (#/decisions) — 3 cây hỏi–đáp chọn
       service: compute/container, lưu trữ/database, truyền tin.
   Nạp SAU upgrade2.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function ja(){ return window.LANG==='ja'; }
function L(vi,jaT){ return (window.LANG==='ja'&&jaT)?jaT:vi; }
function pick(pair){ return (window.LANG==='ja'&&pair[1])?pair[1]:pair[0]; }

/* ============================================================
   0 · HAI TRANG MỚI + ĐIỀU HƯỚNG (route #/pricing, #/decisions)
   ============================================================ */
var mainEl=document.querySelector('main');
var pricingPage=document.createElement('section'); pricingPage.id='pricingPage'; pricingPage.className='page-off';
pricingPage.innerHTML='<div class="wrap"><div id="prcBody"></div></div>';
var decPage=document.createElement('section'); decPage.id='decisionsPage'; decPage.className='page-off';
decPage.innerHTML='<div class="wrap"><div id="decBody"></div></div>';
if(mainEl){ mainEl.appendChild(pricingPage); mainEl.appendChild(decPage); }

var KNOWN_IDS=['homeHub','services','labs','migration','diagrams','networking','du-an','architect','command','glossary','deploy','svcDetailPage','labDetailPage','comparePage','archLibPage','flowPage','pricingPage','decisionsPage'];
function routeMine(){
  var h=location.hash||'#/';
  var mine=(h==='#/pricing')?'pricingPage':((h==='#/decisions')?'decisionsPage':null);
  if(mine){
    KNOWN_IDS.forEach(function(id){ var el=$(id); if(el) el.classList.toggle('page-off', id!==mine); });
    var hero=document.querySelector('header.hero'); if(hero) hero.classList.add('page-off');
    document.querySelectorAll('nav.top a[data-route]').forEach(function(a){ a.classList.toggle('act', a.getAttribute('data-route')===h); });
    window.scrollTo(0,0);
  }else{
    ['pricingPage','decisionsPage'].forEach(function(id){ var el=$(id); if(el) el.classList.add('page-off'); });
  }
}
window.addEventListener('hashchange',routeMine);

/* --- Link trong navbar: Pricing vào trụ "Kiến trúc & Thiết kế",
       Cây quyết định vào trụ "Tra cứu nhanh" (nâng cấp đợt 1) --- */
function makeNavLink(href){
  var a=document.createElement('a'); a.href=href; a.setAttribute('data-route',href);
  a.addEventListener('click',function(){
    var g=a.closest('.nav-group');
    if(g){ g.classList.remove('open'); var b=g.querySelector('.nav-pillar'); if(b) b.setAttribute('aria-expanded','false'); }
  });
  return a;
}
var navLinkPricing=null, navLinkDec=null;
try{
  var panels=document.querySelectorAll('nav.top .nav-panel');
  var archPanel=null, quickPanel=null;
  Array.prototype.forEach.call(panels,function(p){
    if(p.querySelector('a[data-route="#/diagrams"]')) archPanel=p;
    if(p.querySelector('a[data-route="#/command"]')) quickPanel=p;
  });
  if(archPanel){ navLinkPricing=makeNavLink('#/pricing'); archPanel.appendChild(navLinkPricing); }
  if(quickPanel){ navLinkDec=makeNavLink('#/decisions'); quickPanel.appendChild(navLinkDec); }
  var hubGrid=document.querySelector('.hub-grid');
  if(hubGrid){
    var hc1=document.createElement('a'); hc1.className='hub-card'; hc1.href='#/pricing';
    hc1.innerHTML='<span class="hub-ic">💸</span><b>Pricing Gotchas — Bẫy giá</b><p>Các khoản phí ẩn dễ mất tiền oan nhất khi thiết kế kiến trúc: data transfer, NAT Gateway, EIP bỏ không, DB quên tắt… kèm so sánh mô hình giảm giá AWS ⇄ GCP.</p>';
    hubGrid.appendChild(hc1);
    var hc2=document.createElement('a'); hc2.className='hub-card'; hc2.href='#/decisions';
    hc2.innerHTML='<span class="hub-ic">🌳</span><b>Cây quyết định chọn service</b><p>Trả lời vài câu hỏi ngắn là tới đúng service: chạy container thì Fargate/Cloud Run hay EKS/GKE? Lưu dữ liệu thì S3, RDS hay DynamoDB? Truyền tin thì SQS, EventBridge hay Kinesis?</p>';
    hubGrid.appendChild(hc2);
  }
}catch(e){}
function navLabels3(){
  if(navLinkPricing) navLinkPricing.textContent=L('Pricing Gotchas','料金の落とし穴');
  if(navLinkDec) navLinkDec.textContent=L('Cây quyết định','決定ツリー');
}

/* ============================================================
   3 · PRICING GOTCHAS — thẻ phí ẩn (số liệu = THAM KHẢO)
   ============================================================ */
var PRC=[
 {ic:'📤', t:['Data Transfer Out — dữ liệu ra Internet','インターネットへのデータ転送（egress）'],
  num:['≈ $0.09–0.12 / GB tuỳ region','リージョンにより約 $0.09〜0.12 / GB'],
  what:['Phí tính trên mỗi GB dữ liệu rời khỏi cloud ra Internet công cộng. AWS gộp 100 GB/tháng đầu miễn phí cho toàn tài khoản; vào (ingress) thì miễn phí ở cả hai hãng.','クラウドから公共インターネットへ出るデータ量（GB）への課金。AWS はアカウント全体で月100GBまで無料。入ってくる方向（ingress）は両社とも無料です。'],
  why:['Dễ dính nhất khi cho user tải file trực tiếp từ S3/EC2, hoặc quên đặt CDN phía trước: traffic càng lớn hoá đơn càng phình theo cấp số nhân mà không ai để ý vì “service vẫn chạy bình thường”.','S3/EC2 から直接ダウンロードさせる、CDN を前に置き忘れる場合に最頻出。トラフィックに比例して静かに膨らみます。'],
  avoid:['Đặt CloudFront / Cloud CDN trước origin (egress từ CDN rẻ hơn và cache giảm số lần về origin); dùng VPC Endpoint cho traffic nội bộ gọi AWS service thay vì đi vòng ra Internet.','オリジンの前に CloudFront / Cloud CDN を置く（CDN 経由の方が安く、キャッシュでオリジン往復も減る）。内部から AWS サービスを呼ぶ通信は VPC エンドポイントでインターネットに出さない。']},
 {ic:'🔀', t:['Traffic cross-AZ — dữ liệu chạy giữa hai AZ','AZ 間トラフィック'],
  num:['≈ $0.01 / GB mỗi chiều (cả AWS và GCP liên zone)','両社とも約 $0.01 / GB（片方向）'],
  what:['Dữ liệu truyền giữa hai Availability Zone trong cùng region bị tính phí hai đầu (gửi + nhận), dù vẫn nằm “trong nhà” của cloud. GCP tương đương là traffic liên zone trong cùng region.','同一リージョン内の AZ 間通信は、送信側・受信側の両方に課金されます。GCP では同一リージョン内のゾーン間通信が相当します。'],
  why:['Kiến trúc multi-AZ nhân bản liên tục (RDS Multi-AZ, Kafka, cache cluster…) tạo ra dòng GB chạy ngầm 24/7. Hai service “chatty” đặt lệch AZ nhau cũng âm thầm đốt tiền theo từng GB.','Multi-AZ レプリケーション（RDS、Kafka、キャッシュ等）は24時間流れ続けます。「おしゃべり」な2サービスを別 AZ に置くのも典型的な出血源です。'],
  avoid:['Đặt các thành phần trao đổi dữ liệu cực nhiều cùng AZ khi không cần HA ở lớp đó; tính cả phí cross-AZ khi so sánh “multi-AZ cho mọi thứ” với nhu cầu thật.','大量に通信する部品は、HA が不要な層では同一 AZ に寄せる。「全て Multi-AZ」と本当の要件のコスト差を cross-AZ 料金込みで比較する。']},
 {ic:'🚪', t:['NAT Gateway — phí theo giờ + theo GB','NAT Gateway — 時間課金＋GB課金'],
  num:['≈ $0.045/giờ/AZ + $0.045/GB xử lý → ≈ $33/tháng/AZ','約 $0.045/時/AZ ＋ $0.045/GB → 約 $33/月/AZ'],
  what:['NAT Gateway tính tiền theo giờ tồn tại (mỗi AZ một cái) cộng phí trên mỗi GB dữ liệu đi qua nó — kể cả khi instance đích chỉ tải bản vá vài MB. Cloud NAT của GCP cũng tính theo giờ theo số VM dùng NAT.','NAT Gateway は存在時間（AZ ごと）と通過データ量の両方に課金。GCP の Cloud NAT も利用 VM 数に応じた時間課金があります。'],
  why:['Là khoản phí “cố định” kinh điển bị quên: dựng VPC học tập xong để NAT chạy qua đêm/qua tuần. Hai AZ = hai NAT = gấp đôi, dù gần như không có traffic.','学習用 VPC を作ったまま NAT を一晩〜1週間放置するのが典型。2 AZ なら2台分で倍になります。'],
  avoid:['Traffic từ private subnet tới S3/DynamoDB hãy đi qua Gateway Endpoint (miễn phí) thay vì NAT; làm lab xong xoá NAT trước tiên (xem khối Dọn dẹp 1-Click ở từng lab); production cân nhắc Interface Endpoint cho các AWS service hay dùng.','プライベートサブネットから S3/DynamoDB へは無料のゲートウェイ エンドポイントを使う。ラボ後は NAT を真っ先に消す（各ラボの後片付けブロック参照）。本番では利用頻度の高い AWS サービスにインターフェース エンドポイントも検討。']},
 {ic:'📌', t:['Elastic IP không gắn vào EC2 đang chạy','実行中 EC2 に付いていない Elastic IP'],
  num:['$0.005/giờ cho mỗi EIP “bỏ không” ≈ $3.65/tháng','未使用 EIP 1個あたり $0.005/時 ≈ $3.65/月'],
  what:['Từ 2024, AWS tính phí mọi địa chỉ IPv4 public — EIP đã allocate nhưng không gắn vào instance đang chạy (instance đã stop/terminate, hoặc EIP nằm chờ) bị tính phí theo giờ.','2024年以降、AWS は全てのパブリック IPv4 に課金します。確保したのに稼働中インスタンスへ付いていない EIP は時間課金されます。'],
  why:['Allocate EIP cho NAT Gateway/instace rồi terminate máy mà quên release EIP là lỗi cực phổ biến sau khi dọn lab; vài EIP “mồ côi” nằm im cả tháng không ai nhìn tới.','NAT やインスタンス用に確保した EIP を、削除時に解放し忘れるのが典型。数個の「孤児 EIP」が1か月放置されます。'],
  avoid:['Sau cleanup luôn kiểm tra EC2 Console → Elastic IPs: trạng thái phải là “đã gắn vào tài nguyên đang chạy” hoặc không còn EIP thừa; release ngay EIP không dùng.','後片付け後は EC2 コンソール → Elastic IP を必ず確認。使っていない EIP は即解放する。']},
 {ic:'🗄️', t:['RDS / Cloud SQL quên tắt — Multi-AZ nhân đôi','消し忘れた RDS / Cloud SQL — Multi-AZ で倍額'],
  num:['Instance chạy 24/7 theo giờ; Multi-AZ ≈ ×2 tiền compute','インスタンスは24時間課金。Multi-AZ は計算料金がほぼ2倍'],
  what:['Database managed tính theo giờ instance + storage + backup, chạy liên tục kể cả ban đêm không ai dùng. Bật Multi-AZ/Regional HA nghĩa là trả tiền cho cả standby. GCP Cloud SQL tương tự (standby tính trong giá HA).','マネージド DB はインスタンス時間＋ストレージ＋バックアップで常時課金。Multi-AZ / リージョナル HA はスタンバイ分も料金に含まれます。'],
  why:['Hai bẫy chồng nhau: (1) quên xoá DB sau lab; (2) bẫy riêng của RDS — “Stop” instance chỉ giữ được tối đa 7 ngày rồi AWS tự bật lại, nhiều người tưởng đã tắt hẳn. Storage và snapshot vẫn tính tiền kể cả khi instance đã stop ở cả hai hãng.','落とし穴は2重：（1）ラボ後の消し忘れ、（2）RDS の Stop は最大7日で自動再起動する仕様。停止中もストレージとスナップショットは両社とも課金されます。'],
  avoid:['Dev/học tập: xoá hẳn instance sau khi làm (snapshot cuối nếu cần giữ), đặt lịch stop/start tự động cho giờ hành chính; production thì dùng đúng cỡ instance + xem xét Aurora Serverless/Cloud SQL theo nhu cầu scale.','学習・開発用は実施後にインスタンス自体を削除（必要なら最終スナップショット）。業務時間外の自動停止/起動も有効。本番は適正サイジングとサーバーレス型 DB の検討を。']},
 {ic:'⚖️', t:['Load Balancer — phí giờ cố định + LCU','ロードバランサー — 固定時間料金＋LCU'],
  num:['ALB ≈ $0.0225/giờ + $0.008/LCU-giờ → từ ≈ $16/tháng','ALB 約 $0.0225/時 ＋ $0.008/LCU時 → 月約 $16〜'],
  what:['ALB tính hai thành phần: phí theo giờ tồn tại của load balancer và LCU (dung lượng xử lý: kết nối mới, băng thông, rule…). Không có request nào thì vẫn mất phần phí giờ. Phía GCP, Global LB tính phí forwarding rule theo giờ tương tự.','ALB は「存在時間」と LCU（処理量：新規接続、帯域、ルール数等）の2要素課金。リクエストゼロでも時間料金は発生。GCP のグローバル LB も転送ルールの時間課金が同様です。'],
  why:['Mỗi môi trường (dev/stage/test) một ALB “để sẵn” — nhân với số môi trường và số tháng, khoản “không ai dùng” này thành tiền thật. LCU còn bất ngờ khi traffic có đỉnh nhọn hoặc bật nhiều rule.','環境ごとに「置きっぱなし」の ALB が、環境数×月数で実額になります。LCU はトラフィックの尖りやルール増でも跳ねます。'],
  avoid:['Gộp nhiều service sau một ALB bằng rule theo host/path thay vì mỗi service một ALB; xoá LB của môi trường tạm ngay khi hết đợt kiểm thử.','ホスト/パス ルールで1台の ALB に複数サービスを相乗りさせる。一時環境の LB は検証終了と同時に削除。']},
 {ic:'☸️', t:['Control plane EKS / GKE tính theo giờ mỗi cluster','EKS / GKE コントロールプレーンの時間課金'],
  num:['≈ $0.10/giờ/cluster ≈ $73/tháng (chưa kể node)','約 $0.10/時/クラスタ ≈ $73/月（ノード別）'],
  what:['EKS tính phí control plane theo giờ cho mỗi cluster, cộng thêm tiền EC2/Fargate chạy node. GKE cũng tính phí quản lý cluster theo giờ — nhưng mỗi billing account được miễn phí cho 1 cluster zonal hoặc 1 Autopilot cluster.','EKS はクラスタごとのコントロールプレーン時間課金＋ノード代。GKE もクラスタ管理料がありますが、請求アカウントごとにゾーン型1クラスタまたは Autopilot 1クラスタが無料枠です。'],
  why:['Tạo cluster để học Kubernetes rồi quên xoá: node có thể đã scale về 0 nhưng control plane vẫn đều đặn tính ~$73/tháng cho mỗi cluster “chết”. Nhiều cluster nhỏ cho nhiều team cũng nhân phí tương tự.','学習用クラスタの消し忘れ：ノードが0でもコントロールプレーンは月約$73ずつ課金され続けます。小さいクラスタを多数作る運用も同様に積み上がります。'],
  avoid:['Học tập thì dùng 1 cluster chung hoặc kind/minikube tại máy cho phần cơ bản; xoá cluster ngay sau lab (kiểm tra cả node group/Fargate profile sót lại); GCP tận dụng cluster miễn phí đầu tiên.','学習は共通1クラスタかローカルの kind/minikube で。ラボ後はクラスタごと削除（ノードグループの残りも確認）。GCP は無料枠の1クラスタを活用。']},
 {ic:'📜', t:['Phí nạp log — CloudWatch Logs / Cloud Logging','ログ取り込み料金 — CloudWatch Logs / Cloud Logging'],
  num:['≈ $0.50 / GB log nạp vào + phí lưu trữ theo tháng','取り込み約 $0.50/GB ＋ 保管料（月）'],
  what:['Log được tính tiền theo GB dữ liệu nạp (ingestion) cộng lưu trữ. Bật DEBUG/TRACE log cho production, hoặc log từng request của hệ thống đông người dùng, là GB log tăng tuyến tính theo traffic.','ログは取り込み GB と保管の両方に課金。本番で DEBUG/TRACE を有効化したり、リクエスト毎に詳細ログを出すと、トラフィック比例で GB が増えます。'],
  why:['Không ai “nhìn thấy” log tốn tiền cho tới khi hoá đơn tới — một service lỗi lặp (error loop) có thể ghi hàng chục GB log mỗi ngày mà không ai hay biết.','請求が来るまで誰も気づきません。エラーループを起こしたサービスが1日数十GB書き続けることもあります。'],
  avoid:['Đặt log level production ở INFO/WARN; đặt retention ngắn cho log ít giá trị (đừng để “không bao giờ xoá” mặc định); dùng sampling/metric filter thay vì log toàn bộ request.','本番のログレベルは INFO/WARN に。価値の低いログは保持期間を短く（「無期限」既定のままにしない）。全リクエスト記録の代わりにサンプリングやメトリクスフィルタを使う。']},
 {ic:'🌉', t:['Egress cross-cloud — chuyển dữ liệu giữa AWS và GCP','クロスクラウド egress — AWS と GCP 間の転送'],
  num:['Ra Internet ở phía nguồn ≈ $0.09/GB → 10 TB ≈ $900+','送信側のインターネット egress 約 $0.09/GB → 10TB で約 $900〜'],
  what:['Hai cloud không có “đường nội bộ” miễn phí cho nhau: dữ liệu AWS → GCP đi ra Internet nên phía nguồn trả egress như bình thường, phía đích nhận ingress miễn phí nhưng vẫn tốn thời gian và phí các service đồng bộ (DMS, Storage Transfer…).','2つのクラウド間に無料の内部回線はありません。AWS → GCP のデータはインターネット経由となり、送信側に通常の egress が課金されます。'],
  why:['Migration cross-cloud thường ước tính thiếu khoản này: đồng bộ CDC chạy nhiều tuần, hoặc pipeline hai chiều ghi qua lại, biến “phí truyền” thành khoản lớn nhất của dự án.','クロスクラウド移行で最も見積もり漏れしやすい項目。数週間の CDC 同期や双方向パイプラインで、転送費がプロジェクト最大のコストになることがあります。'],
  avoid:['Lập kế hoạch chuyển một chiều, gom và nén dữ liệu trước khi chuyển; tính egress vào bài toán migration ngay từ giai đoạn Assess; cân nhắc đường kết nối đối tác (Interconnect/Direct Connect qua nhà cung cấp) khi khối lượng rất lớn.','一方向の移行計画にし、転送前に集約・圧縮する。Assess 段階から egress を移行コストに含める。超大容量ならパートナー相互接続の検討も。']},
 {ic:'👻', t:['Tài nguyên “mồ côi” — volume, snapshot, địa chỉ bỏ quên','孤児リソース — 放置されたボリュームとスナップショット'],
  num:['EBS ≈ $0.08–0.096/GB-tháng; snapshot tính theo dung lượng đã dùng','EBS 約 $0.08〜0.096/GB月。スナップショットは使用量課金'],
  what:['Xoá EC2/VM không đồng nghĩa xoá hết: EBS volume tách rời, snapshot chụp tay, Persistent Disk không gắn vào VM, địa chỉ IP phụ… vẫn tiếp tục tính phí theo dung lượng/thời gian.','EC2/VM を消しても終わりではありません。切り離された EBS、 手動スナップショット、未接続の Persistent Disk 等は課金され続けます。'],
  why:['Cleanup theo “xoá instance” là chưa đủ — các tài nguyên phụ trợ nằm ở những màn hình console khác nhau nên rất dễ sót, và chúng không gây lỗi gì nên không ai phát hiện.','「インスタンス削除」だけでは後片付け不足。補助リソースは別画面にあるため見落としやすく、エラーも出ないので誰も気づきません。'],
  avoid:['Sau mỗi lab chạy checklist hoá đơn ở khối Dọn dẹp 1-Click (đợt 2): soi Volumes/Snapshots/Disks ở trạng thái “không gắn”; gắn tag cho tài nguyên học tập để lọc xoá theo tag.','各ラボの後片付けチェックリストで「未接続」のボリューム/スナップショット/ディスクを確認。学習用リソースにはタグを付け、タグで一括削除できるようにする。']}
];
function renderPricing(){
  var host=$('prcBody'); if(!host) return;
  var h='<div class="sec-head"><span class="sec-tag">'+L('Chuyên mục · FinOps thực chiến','特集 · 実践 FinOps')+'</span>'
    +'<h2>'+L('Pricing Gotchas — các khoản phí ẩn dễ mất tiền oan','Pricing Gotchas — ハマりやすい隠れ料金')+'</h2>'
    +'<p>'+L('Người học cloud bối rối nhất ở phần tính giá, vì hoá đơn không chỉ gồm “tiền máy chủ”: rất nhiều khoản tính theo giờ tồn tại, theo GB truyền, hoặc nhân đôi theo cơ chế HA mà lúc thiết kế ít ai cộng vào. Dưới đây là 10 cái bẫy phổ biến nhất — mỗi thẻ gồm: phí là gì, vì sao dễ dính, con số tham khảo và cách tránh.','クラウドの料金で最も混乱するのは、請求が「サーバー代」だけでできていない点です。存在時間、転送 GB、HA の仕組みによる倍額など、設計時に数え忘れる課金が多数あります。代表的な10件の落とし穴を、仕組み・ハマる理由・参考価格・回避策でまとめます。')+'</p></div>'
    +'<div class="prc-grid">'
    +PRC.map(function(c){
      return '<article class="prc-card"><h3><span class="prc-ic">'+c.ic+'</span><span>'+E(pick(c.t))+'</span></h3>'
        +'<span class="prc-num">💰 '+E(pick(c.num))+'</span>'
        +'<dl><dt>'+L('Phí là gì','どんな料金か')+'</dt><dd>'+E(pick(c.what))+'</dd>'
        +'<dt>'+L('Vì sao dễ dính','なぜハマるか')+'</dt><dd>'+E(pick(c.why))+'</dd>'
        +'<dt>'+L('Cách tránh','回避策')+'</dt><dd class="avoid">'+E(pick(c.avoid))+'</dd></dl></article>';
    }).join('')
    +'</div>'
    +'<div class="diagram-card" style="margin-top:18px"><h3>'+L('So sánh mô hình giá AWS ⇄ GCP — khác biệt tư duy quan trọng nhất','料金モデルの比較 AWS ⇄ GCP — 最も重要な考え方の違い')+'</h3>'
    +'<p>'+L('Cùng một workload nhưng “chiến lược mua” tối ưu ở hai hãng ngược nhau: GCP thưởng cho việc… cứ chạy (giảm giá tự động), còn AWS thưởng cho việc cam kết trước. Quên mất khác biệt này là nguồn gốc của nhiều hoá đơn đắt bất ngờ khi chuyển cloud.','同じワークロードでも最適な「買い方」が逆です。GCP は「使い続けること」に自動割引で応え、AWS は「事前のコミット」に応えます。この違いの見落としが、移行後の想定外の高額請求の原因になります。')+'</p>'
    +'<div class="sub-scroll"><table class="cmp"><tr><th style="width:22%">'+L('Khía cạnh','観点')+'</th><th style="width:39%">Google Cloud</th><th>AWS</th></tr>'
    +'<tr><td><b>'+L('Giảm giá không cam kết','コミットなしの割引')+'</b></td><td><b>Sustained Use Discounts (SUD)</b>: '+L('tự động giảm tới ~30% cho Compute Engine chạy hơn 25% thời gian của tháng — không cần đăng ký, không cần cam kết. Lưu ý: không áp dụng cho mọi họ máy (vd họ E2) và không cộng dồn với CUD trên cùng tài nguyên.','継続利用割引（SUD）：月の25%以上稼働した Compute Engine に自動で最大約30%割引。申込もコミットも不要。ただし全てのマシンシリーズに適用されるわけではなく（E2 等は対象外）、同一リソースで CUD とは併用できません。')+'</td><td>'+L('Không có cơ chế tương đương: giá On-Demand là giá niêm yết đầy đủ. Muốn rẻ hơn phải dùng Spot (bị thu hồi) hoặc cam kết (Savings Plans/RI).','同等の仕組みはありません。オンデマンドは定価そのもの。安くするには Spot（回収あり）かコミット（Savings Plans/RI）が必要です。')+'</td></tr>'
    +'<tr><td><b>'+L('Giảm giá có cam kết','コミット型の割引')+'</b></td><td><b>Committed Use Discounts (CUD)</b>: '+L('cam kết dùng vCPU/RAM theo region trong 1 hoặc 3 năm, giảm tới ~55% (dạng linh hoạt theo chi tiêu có thể tới ~70% ở một số dịch vụ). Cam kết thừa vẫn phải trả.','リソースベースのコミット（1年/3年）で最大約55%割引、支出ベースの柔軟なコミットでは一部サービスで約70%。余らせても支払いは発生します。')+'</td><td><b>Savings Plans / Reserved Instances</b>: '+L('cam kết mức chi tiêu $/giờ trong 1 hoặc 3 năm, giảm tới ~72%. Linh hoạt theo họ máy/region (Compute SP) hoặc khoá chặt hơn để rẻ hơn (EC2 Instance SP, RI). Cam kết thiếu thực tế = trả tiền cho capacity không dùng.','$/時の支出コミット（1年/3年）で最大約72%割引。Compute SP は柔軟、EC2 Instance SP / RI は固定度が高い分さらに安く。過剰なコミットは未使用分への支払いになります。')+'</td></tr>'
    +'<tr><td><b>'+L('Hệ quả khi thiết kế','設計への影響')+'</b></td><td>'+L('Workload chạy 24/7 trên GCP “tự nhiên rẻ dần” — khi so sánh giá hai hãng ở tháng đầu rất dễ kết luận sai nếu không tính SUD.','GCP の常時稼働は「自然に安くなる」ため、初月だけの比較では誤った結論になりやすい。')+'</td><td>'+L('Workload chạy 24/7 trên AWS bắt buộc phải mua Savings Plans/RI mới tối ưu — hoá đơn tháng đầu (chưa cam kết) cao hơn hẳn trạng thái đã tối ưu.','AWS の常時稼働は Savings Plans/RI を買って初めて最適化されます。未コミットの初月請求は最適化後と大きく異なります。')+'</td></tr>'
    +'</table></div></div>'
    +'<p class="prc-note">⚠ '+L('Mọi con số trong chuyên mục này là THAM KHẢO theo giá công bố phổ biến (region Tokyo / US) tại thời điểm viết — giá cloud thay đổi theo region và theo thời gian. Trước khi thiết kế thật hoặc chốt ngân sách, hãy kiểm tra lại tại trang giá chính thức của AWS và Google Cloud, và luôn bật cảnh báo ngân sách (Budgets / Billing Alert) ngay từ ngày đầu học.','この特集の数値は全て、執筆時点の公表価格（東京/US リージョン）に基づく参考値です。クラウドの価格はリージョンと時期で変わります。実際の設計や予算確定の前に AWS と Google Cloud の公式料金ページで確認し、学習初日から予算アラート（Budgets / 課金アラート）を必ず有効にしてください。')+'</p>';
  host.innerHTML=h;
}
try{ renderPricing(); }catch(e){}

/* ============================================================
   4 · CÂY QUYẾT ĐỊNH — hỏi–đáp chọn service
   nodes: key -> {q:[vi,ja], sub:[vi,ja], opts:[{t:[vi,ja], ic, to}]}
          hoặc {res:{aws:[[tên, lý do vi, lý do ja]...], gcp:[...],
                      tip:[vi,ja]}}
   ============================================================ */
var TREES=[
 {id:'compute', ic:'🖥️', t:['Chạy ứng dụng / container','アプリ／コンテナの実行基盤'],
  d:['Workload của bạn nên chạy ở đâu: hàm serverless, container serverless, Kubernetes hay máy ảo?','ワークロードはどこで動かすべきか：関数、サーバーレスコンテナ、Kubernetes、仮想マシンのどれ？'],
  start:'q1',
  nodes:{
   q1:{q:['Workload của bạn thuộc dạng nào?','ワークロードはどのタイプですか？'], sub:['Chọn mô tả gần nhất với bài toán của bạn.','課題に最も近いものを選んでください。'],
    opts:[
     {ic:'⚡', t:['Tác vụ ngắn theo sự kiện: webhook, xử lý file mới, cron job, API nhẹ — chạy vài giây tới vài phút rồi tắt','イベント駆動の短い処理：Webhook、新規ファイル処理、cron、軽い API — 数秒〜数分で終わる'], to:'r-func'},
     {ic:'📦', t:['Ứng dụng đã đóng gói (hoặc sẽ đóng gói) thành container','コンテナ化されている（または予定の）アプリ'], to:'q2'},
     {ic:'🖥️', t:['Cần kiểm soát OS hoàn toàn: phần mềm legacy, license gắn theo máy, tiến trình chạy dài đặc thù','OS の完全な制御が必要：レガシー、機械 tied ライセンス、特殊な長時間プロセス'], to:'r-vm'}
    ]},
   q2:{q:['Bạn muốn tự quản lý máy chủ / node tới mức nào?','サーバー／ノードをどこまで自分で管理したいですか？'], sub:['Đây là câu hỏi quyết định nhất khi chọn compute dạng container.','コンテナ基盤選びで最も決定的な質問です。'],
    opts:[
     {ic:'🎉', t:['Không muốn quản lý hạ tầng chút nào — đưa container là chạy, scale theo request, hết traffic thì về 0','インフラ管理は一切したくない — コンテナを渡せば動き、リクエストでスケールし、無 traffic ではゼロに'], to:'r-serverless-container'},
     {ic:'☸️', t:['Cần kiểm soát sâu Kubernetes: Helm, operator/CRD, network policy, multi-cluster','Kubernetes の深い制御が必要：Helm、Operator/CRD、ネットワークポリシー、マルチクラスタ'], to:'r-k8s'},
     {ic:'🤖', t:['Muốn chuẩn Kubernetes nhưng vận hành node càng ít càng tốt (autopilot / serverless node)','Kubernetes 標準は欲しいが、ノード運用は最小に（Autopilot／サーバーレスノード）'], to:'r-k8s-auto'}
    ]},
   'r-func':{res:{aws:[['AWS Lambda','Sự kiện kích hoạt mới chạy, scale về 0, trả theo request + thời gian chạy — đúng bản chất tác vụ ngắn. Hàm tối đa 15 phút/lần chạy.','イベント時のみ実行しゼロへスケール。課金はリクエスト＋実行時間。1回の実行は最大15分です。']],
                  gcp:[['Cloud Run functions','Hàm serverless của GCP (thế hệ mới của Cloud Functions): kích hoạt bởi HTTP hoặc sự kiện Pub/Sub/Storage, scale về 0.','GCP のサーバーレス関数（Cloud Functions の後継世代）。HTTP や Pub/Sub/Storage のイベントで起動し、ゼロへスケールします。']],
                  tip:['Nếu tác vụ có lúc chạy quá 15 phút (AWS) hoặc cần môi trường container tuỳ biến sâu, quay lại nhánh container.','15分（AWS）を超える処理や深いコンテナカスタマイズが必要なら、コンテナ分岐に戻ってください。']}},
   'r-serverless-container':{res:{aws:[['AWS Fargate','Chạy container trên ECS/EKS mà không quản lý EC2 node: khai báo CPU/RAM cho task, AWS lo máy bên dưới. Trả theo vCPU/GB của task đang chạy.','ECS/EKS 上で EC2 ノードを管理せずにコンテナ実行。タスクの CPU/メモリを宣言すれば下回りは AWS 任せ。課金は実行中タスクの vCPU/GB。'],
                                   ['Amazon ECS','Control plane chạy container phía AWS — kết hợp Fargate (serverless) hoặc EC2 (tự quản) làm nơi chạy task.','AWS のコンテナ実行基盤。実行場所として Fargate（サーバーレス）か EC2（自前管理）を選べます。']],
                  gcp:[['Cloud Run','Đưa image là có HTTPS endpoint: scale từ 0 tới rất lớn theo request, trả theo thời gian xử lý thực tế. Lựa chọn mặc định cho container stateless trên GCP.','イメージを渡せば HTTPS エンドポイント。0から大きくスケールし、課金は実処理時間。GCP のステートレスコンテナの既定解です。']],
                  tip:['Cặp đôi kinh điển: AWS = Fargate (trên ECS), GCP = Cloud Run. Cả hai đều hợp nhất với workload traffic thất thường.','定番の対応：AWS = Fargate（ECS 上）、GCP = Cloud Run。どちらもトラフィックが読めないワークロードに最適です。']}},
   'r-k8s':{res:{aws:[['Amazon EKS','Kubernetes managed của AWS: bạn kiểm soát node group, add-on, network (VPC CNI) — mang được nguyên hệ sinh thái Helm/operator sang.','AWS のマネージド Kubernetes。ノードグループ、アドオン、ネットワーク（VPC CNI）を制御でき、Helm/Operator の資産をそのまま持ち込めます。']],
                  gcp:[['Google Kubernetes Engine (GKE)','Kubernetes “quê hương” của Google: bản Standard cho kiểm soát sâu, tích hợp chặt với IAM, Cloud Load Balancing và Cloud Monitoring của GCP.','Kubernetes 発祥の Google のマネージド版。Standard モードで深く制御でき、GCP の IAM・LB・監視と密に連携します。']],
                  tip:['Chỉ trả “giá” của Kubernetes (vận hành, nâng cấp, bảo mật node) khi bạn thật sự cần tính di động đa cloud hoặc hệ sinh thái K8s — nếu không, Fargate/Cloud Run rẻ và nhẹ hơn nhiều.','多クラウド可搬性や K8s エコシステムが本当に必要な時だけ Kubernetes の運用コストを払う価値があります。そうでなければ Fargate/Cloud Run が圧倒的に軽量です。']}},
   'r-k8s-auto':{res:{aws:[['Amazon EKS','Dùng EKS với Fargate profile cho pod: pod chạy serverless, không node để vá — vẫn giữ API Kubernetes chuẩn.','EKS ＋ Fargate プロファイルで Pod をサーバーレス実行。ノードのパッチ不要で、標準の Kubernetes API はそのまま。'],
                                   ['AWS Fargate','Nơi chạy pod dạng serverless phía EKS — tính tiền theo vCPU/RAM pod yêu cầu.','EKS の Pod 実行場所（サーバーレス）。課金は Pod が要求する vCPU/メモリ。']],
                  gcp:[['Google Kubernetes Engine (GKE)','Dùng chế độ Autopilot: Google quản lý node, bảo mật và scale — bạn chỉ khai báo workload, trả theo tài nguyên pod yêu cầu.','Autopilot モード：ノード管理・セキュリティ・スケールは Google 任せ。宣言したワークロードの Pod リソース分だけ課金されます。']],
                  tip:['Autopilot (GKE) và EKS + Fargate là “Kubernetes không node” — điểm cân bằng giữa chuẩn K8s và ít vận hành.','Autopilot（GKE）と EKS＋Fargate は「ノードレス Kubernetes」。標準準拠と運用軽さのバランス点です。']}},
   'r-vm':{res:{aws:[['Amazon EC2','Toàn quyền OS, chọn instance theo CPU/RAM/GPU/mạng; kết hợp ASG để HA và scale. Mô hình mua: On-Demand / Savings Plans / Spot.','OS の全権限。CPU/メモリ/GPU/ネットワークでインスタンスを選択し、ASG で HA とスケールを。購入はオンデマンド／Savings Plans／Spot。']],
                  gcp:[['Compute Engine','Máy ảo của GCP với custom machine type (chọn lẻ vCPU/RAM), giảm giá tự động Sustained Use khi chạy lâu, Preemptible/Spot VM cho batch chịu gián đoạn.','GCP の VM。カスタムマシンタイプ（vCPU/メモリを個別指定）や、長時間稼働への継続利用割引、バッチ向け Spot VM が特徴。']],
                  tip:['Máy ảo cho bạn quyền kiểm soát tối đa và “nợ vận hành” tối đa: vá OS, bảo mật, backup là việc của bạn — chỉ chọn khi thật sự cần.','VM は最大の制御と最大の運用負債（OS パッチ、セキュリティ、バックアップは自前）がセット。本当に必要な時だけ選びましょう。']}}
  }},
 {id:'data', ic:'🗄️', t:['Lưu trữ & Database','ストレージとデータベース'],
  d:['Dữ liệu của bạn nên nằm ở đâu: object storage, DB quan hệ, NoSQL mili-giây, cache hay kho phân tích?','データをどこに置くべきか：オブジェクト、リレーショナル、ミリ秒 NoSQL、キャッシュ、分析倉庫？'],
  start:'q1',
  nodes:{
   q1:{q:['Dữ liệu của bạn chủ yếu là gì?','データは主にどんなものですか？'], sub:['Chọn theo bản chất dữ liệu, không theo thói quen.','習慣ではなく、データの性質で選んでください。'],
    opts:[
     {ic:'🖼️', t:['File, ảnh, video, backup, log — object không cấu trúc, truy cập theo tên/đường dẫn','ファイル、画像、動画、バックアップ、ログ — 名前でアクセスする非構造オブジェクト'], to:'r-object'},
     {ic:'🧾', t:['Dữ liệu có cấu trúc rõ ràng, cần SQL và giao dịch ACID (đơn hàng, thanh toán, tồn kho)','構造が明確で、SQL と ACID トランザクションが必要（注文、決済、在庫）'], to:'r-sql'},
     {ic:'⚡', t:['Tra cứu theo key ở tốc độ mili-giây, quy mô ghi/đọc rất lớn (session, giỏ hàng, hồ sơ người dùng, IoT)','キー参照でミリ秒応答、巨大な読み書き規模（セッション、カート、プロフィール、IoT）'], to:'q2'},
     {ic:'📊', t:['Dữ liệu phân tích: quét tổng hợp trên TB–PB bằng SQL (báo cáo, BI, data warehouse)','分析用途：TB〜PB 規模を SQL で集計走査（レポート、BI、データウェアハウス）'], to:'r-warehouse'},
     {ic:'🔥', t:['Dữ liệu nóng đọc lặp liên tục, cần tốc độ trong RAM (leaderboard, cache kết quả truy vấn)','繰り返し読まれるホットデータ。RAM 速度が必要（ランキング、クエリキャッシュ）'], to:'r-cache'}
    ]},
   q2:{q:['Mẫu truy cập chính của bạn là gì?','主なアクセスパターンは？'], sub:['NoSQL không có một đáp án chung — hình dạng truy cập quyết định service.','NoSQL に万能解はありません。アクセス形状がサービスを決めます。'],
    opts:[
     {ic:'🔑', t:['Tra cứu key-value / document đơn giản, cần scale gần như vô hạn và mô hình serverless trả theo request','シンプルな Key-Value／ドキュメント参照。ほぼ無限のスケールとリクエスト課金のサーバーレスモデル'], to:'r-kv'},
     {ic:'📈', t:['Wide-column, hàng tỉ dòng, ghi liên tục tốc độ cao (time-series, IoT, lịch sử sự kiện)','ワイドカラム、数十億行、高速な連続書き込み（時系列、IoT、イベント履歴）'], to:'r-wide'},
     {ic:'📱', t:['Document cho app mobile/web, cần đồng bộ realtime và offline cho client','モバイル/Web 向けドキュメント。クライアントへのリアルタイム同期とオフライン対応が必要'], to:'r-doc'}
    ]},
   'r-object':{res:{aws:[['Amazon S3','Object storage chuẩn ngành: độ bền 11 số 9, phân lớp Standard → Glacier để giảm giá theo độ “nóng”, làm nền cho data lake và hosting web tĩnh qua CloudFront.','業界標準のオブジェクトストレージ。耐久性はイレブンナイン。Standard → Glacier の階層化でコスト最適化し、データレイクや CloudFront 経由の静的ホスティングの基盤に。']],
                  gcp:[['Cloud Storage','Tương đương S3 phía GCP: bucket toàn cục theo tên, lớp Standard/Nearline/Coldline/Archive và lifecycle tự hạ lớp theo tuổi dữ liệu.','GCP 版の相当サービス。全世界で一意なバケット名、Standard/Nearline/Coldline/Archive の階層と、経過日数で自動的に下げるライフサイクル。']],
                  tip:['Object storage không phải filesystem: cần mount như ổ đĩa thì xem EBS/Persistent Disk (block) hoặc EFS/Filestore (file).','オブジェクトストレージはファイルシステムではありません。マウントが必要なら EBS/Persistent Disk（ブロック）か EFS/Filestore（ファイル）を見てください。']}},
   'r-sql':{res:{aws:[['Amazon RDS','DB quan hệ managed (PostgreSQL/MySQL/SQL Server…): backup, vá lỗi, Multi-AZ failover do AWS vận hành. Cần scale đọc/ghi lớn hơn nữa thì cân nhắc Aurora.','マネージドなリレーショナル DB（PostgreSQL/MySQL/SQL Server 等）。バックアップ、パッチ、Multi-AZ フェイルオーバーは AWS 任せ。さらに大きな規模なら Aurora を検討。']],
                  gcp:[['Cloud SQL','Tương đương phía GCP: MySQL/PostgreSQL/SQL Server managed, HA theo region. Tải PostgreSQL lớn cần hiệu năng cao hơn thì có AlloyDB.','GCP の相当サービス。MySQL/PostgreSQL/SQL Server のマネージド版でリージョナル HA。大規模 PostgreSQL で性能が必要なら AlloyDB。']],
                  tip:['“Có cấu trúc + ACID” thì cứ bắt đầu ở RDS/Cloud SQL — đừng nhảy thẳng lên NoSQL chỉ vì “nghe scale hơn”; NoSQL đổi lấy việc mất join và ràng buộc giao dịch.','「構造化＋ACID」ならまず RDS/Cloud SQL から。NoSQL は結合とトランザクション制約を捨てる代わりにスケールを得るものです。']}},
   'r-kv':{res:{aws:[['Amazon DynamoDB','Key-value/document serverless của AWS: độ trễ mili-giây một con số ở mọi quy mô, trả theo request, global table cho multi-region.','AWS のサーバーレス Key-Value/ドキュメント DB。あらゆる規模で1桁ミリ秒、リクエスト課金。マルチリージョンにはグローバルテーブル。']],
                  gcp:[['Firestore','Phía GCP gần nhất cho mẫu này ở dạng document; nếu thuần key-value wide-column quy mô cực lớn thì xem tiếp kết quả Bigtable ở nhánh bên cạnh.','このパターンに最も近い GCP サービス（ドキュメント型）。純粋な大規模ワイドカラムなら隣の分岐の Bigtable を。'],
                        ['Cloud Bigtable','Khi dữ liệu vượt khỏi mô hình document đơn giản và cần ghi/đọc hàng tỉ dòng với độ trễ mili-giây ổn định.','ドキュメント型を超え、数十億行の読み書きを安定したミリ秒レイテンシで捌く場合に。']],
                  tip:['Thiết kế NoSQL bắt đầu từ câu truy vấn (access pattern), không bắt đầu từ bảng: liệt kê mọi cách app sẽ đọc dữ liệu trước khi chọn key.','NoSQL 設計はテーブルではなくアクセスパターンから始めます。キーを選ぶ前に、アプリの読み方を全て列挙してください。']}},
   'r-wide':{res:{aws:[['Amazon DynamoDB','Phía AWS, đa số bài toán time-series/IoT vẫn đáp ứng tốt bằng DynamoDB với partition key theo thiết bị + sort key theo thời gian; chỉ hệ thống tương thích Cassandra/HBase mới cần cân nhắc thêm.','AWS 側では、デバイスをパーティションキー、時刻をソートキーにする設計で大半の時系列/IoT 要件を満たせます。Cassandra/HBase 互換が必要な場合のみ追加検討を。']],
                  gcp:[['Cloud Bigtable','Wide-column NoSQL của GCP (cùng họ HBase): sinh ra cho time-series, IoT và lịch sử sự kiện hàng tỉ dòng với throughput ghi cực cao.','GCP のワイドカラム NoSQL（HBase 系）。時系列、IoT、数十億行のイベント履歴と超高スループットの書き込みのために設計されています。']],
                  tip:['Bigtable không phải DB “đa năng”: không join, không giao dịch nhiều dòng — đổi lại là scale ghi tuyến tính gần như không giới hạn.','Bigtable は万能 DB ではありません。結合も複数行トランザクションもなし。その代わり書き込みはほぼ無限に線形スケールします。']}},
   'r-doc':{res:{aws:[['Amazon DynamoDB','Phía AWS dùng DynamoDB (document JSON) kết hợp AppSync khi cần đồng bộ realtime cho app; mô hình dữ liệu phải thiết kế theo access pattern từ đầu.','AWS 側は DynamoDB（JSON ドキュメント）＋リアルタイム同期が必要なら AppSync。データモデルは最初からアクセスパターン基準で設計します。']],
                  gcp:[['Firestore','Sinh ra cho app mobile/web: SDK client trực tiếp, lắng nghe realtime, hỗ trợ offline và quy tắc bảo mật theo người dùng — ít phải dựng backend trung gian nhất.','モバイル/Web のために生まれた DB。クライアント SDK 直接接続、リアルタイム購読、オフライン対応、ユーザー単位のセキュリティルールで中間バックエンドを最小化できます。']],
                  tip:['Nếu app của bạn là mobile/web và cần realtime sync, Firestore rút ngắn đường đi rất nhiều; hệ thống backend thuần server thì DynamoDB thường hợp hơn.','モバイル/Web ＋リアルタイム同期なら Firestore が最短路。サーバー中心のシステムなら DynamoDB が合うことが多いです。']}},
   'r-warehouse':{res:{aws:[['Amazon Redshift','Data warehouse của AWS: SQL phân tích trên dữ liệu cột, tách compute/storage (RA3), hợp khi đã ở hệ AWS và cần workload BI ổn định.','AWS のデータウェアハウス。列指向の分析 SQL、コンピュート/ストレージ分離（RA3）。AWS 中心で安定した BI ワークロードに。']],
                  gcp:[['BigQuery','Kho phân tích serverless của GCP: không quản cluster, quét TB trong vài giây, trả theo dữ liệu quét hoặc slot — thường là lựa chọn mặc định cho analytics mới trên GCP.','GCP のサーバーレス分析基盤。クラスタ管理不要で TB 級を数秒で走査。課金はスキャン量またはスロット。GCP の新規分析の既定解です。']],
                  tip:['Đừng dùng warehouse cho giao dịch (OLTP) và đừng dùng DB giao dịch cho phân tích (OLAP) — hai thế giới tối ưu ngược nhau.','ウェアハウスをトランザクション（OLTP）に、トランザクション DB を分析（OLAP）に使わないこと。最適化の方向が真逆です。']}},
   'r-cache':{res:{aws:[['Amazon ElastiCache','Cache managed Redis/Memcached của AWS: đặt trước RDS để gánh lượt đọc lặp, lưu session và leaderboard với độ trễ dưới mili-giây.','AWS のマネージドキャッシュ（Redis/Memcached）。RDS の手前に置いて繰り返し読み取りを引き受け、セッションやランキングをサブミリ秒で。']],
                  gcp:[['Memorystore','Tương đương phía GCP: Redis/Memcached managed, kết nối qua VPC — cùng mẫu cache-aside đặt trước Cloud SQL.','GCP の相当サービス。マネージド Redis/Memcached で、Cloud SQL の手前に置くキャッシュアサイド型が定番。']],
                  tip:['Cache là lớp tăng tốc, không phải nơi lưu dữ liệu gốc: luôn phải trả lời được câu hỏi “cache mất sạch thì hệ thống có sống không?”.','キャッシュは高速化層であり、原本の置き場所ではありません。「キャッシュが全消去されてもシステムは生きるか」に答えられる設計を。']}}
  }},
 {id:'msg', ic:'📨', t:['Truyền tin & Tích hợp','メッセージングと統合'],
  d:['Các thành phần của hệ thống nên nói chuyện với nhau bằng gì: hàng đợi, event bus, streaming hay workflow?','システムの部品同士はどう会話すべきか：キュー、イベントバス、ストリーミング、ワークフロー？'],
  start:'q1',
  nodes:{
   q1:{q:['Bạn cần kết nối các thành phần theo kiểu nào?','部品同士をどうつなぎたいですか？'], sub:['Bốn mẫu truyền tin kinh điển — chọn theo hành vi bạn cần, không theo độ “hot” của công nghệ.','4つの古典的パターンから、必要な振る舞いで選んでください。'],
    opts:[
     {ic:'🧾', t:['Hàng đợi công việc: bên gửi thả việc rồi đi, bên xử lý làm theo nhịp riêng — chống sốc tải giờ cao điểm','ジョブキュー：送り手は投げて終わり、処理側は自分のペースで。ピーク時の衝撃吸収に'], to:'r-queue'},
     {ic:'📣', t:['Một sự kiện cần phát cho NHIỀU bên đăng ký nhận (đơn hàng mới → kho, giao vận, email…), có lọc theo nội dung','1つのイベントを多数の購読者へ（新規注文 → 在庫、配送、メール等）。内容でのフィルタ付き'], to:'r-bus'},
     {ic:'🌊', t:['Luồng dữ liệu liên tục tốc độ cao: clickstream, IoT telemetry, log thời gian thực — cần đọc lại (replay) và xử lý theo cửa sổ thời gian','高速な連続データ流：クリックストリーム、IoT、リアルタイムログ — 再生（リプレイ）と時間窓処理が必要'], to:'r-stream'},
     {ic:'🧭', t:['Điều phối quy trình nhiều bước có trạng thái: retry từng bước, chờ duyệt, rẽ nhánh theo kết quả, chạy hàng giờ/ngày','状態を持つ多段プロセスの統括：ステップ毎リトライ、承認待ち、結果での分岐、数時間〜数日の実行'], to:'r-flow'}
    ]},
   'r-queue':{res:{aws:[['Amazon SQS','Hàng đợi chuẩn của AWS: at-least-once, visibility timeout, DLQ cho message lỗi — mẫu “lấy số thứ tự” tách bên gửi khỏi bên xử lý.','AWS の標準キュー。少なくとも1回配信、不可視タイムアウト、失敗用 DLQ。「番号札」で送信側と処理側を分離します。']],
                  gcp:[['Pub/Sub','Phía GCP, Pub/Sub đảm nhiệm luôn vai trò hàng đợi: subscription dạng pull cho worker lấy việc theo nhịp, có dead-letter topic.','GCP では Pub/Sub がキューの役割も担います。プル型サブスクリプションでワーカーが自分のペースで取得し、デッドレターも用意。']],
                  tip:['Dấu hiệu cần queue: bên nhận thỉnh thoảng chậm/sập mà bên gửi không được phép chậm theo. Nếu hai bên phải đồng bộ chờ kết quả ngay, đó là gọi API trực tiếp, không phải queue.','キューの兆候：受け手が時々遅い/落ちても、送り手は待たされないこと。結果を同期で待つ必要があるなら、それは直接 API 呼び出しです。']}},
   'r-bus':{res:{aws:[['Amazon EventBridge','Event bus của AWS: rule lọc sự kiện theo nội dung rồi chuyển tới nhiều target (Lambda, SQS, Step Functions…), có schema registry và archive để phát lại.','AWS のイベントバス。内容フィルタのルールで多数のターゲット（Lambda、SQS、Step Functions 等）へ配送。スキーマレジストリと再送用アーカイブ付き。'],
                        ['Amazon SNS','Khi chỉ cần fan-out đơn giản theo topic (email, SMS, SQS, Lambda) mà không cần lọc nội dung phức tạp.','内容フィルタが不要な単純ファンアウト（メール、SMS、SQS、Lambda）ならこちら。']],
                  gcp:[['Eventarc','Event bus của GCP: gom sự kiện từ Google service và nguồn tuỳ chỉnh, chuyển tới Cloud Run/Workflows/functions theo trigger khai báo.','GCP のイベントバス。Google サービスとカスタムソースのイベントを集め、宣言したトリガーで Cloud Run/Workflows/関数へ。'],
                        ['Pub/Sub','Khi “nhiều bên nhận” thực chất là nhiều subscription độc lập trên cùng topic và cần đảm bảo thứ tự/ack chặt chẽ.','「多数の受け手」が実質、同一トピックへの独立サブスクリプションで、順序や ack を厳密に扱いたい場合。']],
                  tip:['Bus khác queue ở chỗ: một sự kiện, nhiều người nhận độc lập, bên phát không biết (và không cần biết) ai đang nghe.','バスとキューの違い：1イベントに多数の独立した受け手がいて、発信側は誰が聞いているかを知りません（知る必要もありません）。']}},
   'r-stream':{res:{aws:[['Amazon Kinesis Data Streams','Stream có shard của AWS: dữ liệu giữ lại để replay tới 365 ngày, consumer đọc theo vị trí — hợp clickstream/IoT cần xử lý thời gian thực và đọc lại.','AWS のシャード型ストリーム。最大365日の保持で再生可能、コンシューマは位置指定で読みます。クリックストリーム/IoT のリアルタイム処理と再読込に。']],
                  gcp:[['Pub/Sub','Phía GCP, Pub/Sub chính là xương sống streaming: throughput gần như không giới hạn, kết hợp Dataflow để xử lý theo cửa sổ thời gian và ghi xuống BigQuery.','GCP では Pub/Sub 自体がストリーミングの基盤。ほぼ無制限のスループットで、Dataflow と組み合わせて時間窓処理し BigQuery へ。']],
                  tip:['Phân biệt với queue: streaming giữ dữ liệu thành “dòng” có thứ tự theo shard/key và cho phép nhiều consumer đọc độc lập + replay; queue thì message bị xoá sau khi xử lý xong.','キューとの違い：ストリームはシャード/キー順の「流れ」としてデータを保持し、複数コンシューマの独立読み取りと再生が可能。キューは処理後にメッセージが消えます。']}},
   'r-flow':{res:{aws:[['AWS Step Functions','State machine điều phối Lambda/container/API: retry + backoff khai báo, rẽ nhánh Choice, chờ callback của người duyệt — nhìn thấy toàn bộ quy trình dạng sơ đồ.','Lambda/コンテナ/API を統括するステートマシン。リトライ＋バックオフ、Choice 分岐、人手承認のコールバック待ちまで宣言でき、全体が図で見えます。']],
                  gcp:[['Workflows','Tương đương phía GCP: workflow YAML điều phối các HTTP service và Google Cloud API, có retry, rẽ nhánh và chờ sự kiện/khoảng thời gian dài.','GCP の相当サービス。YAML ワークフローで HTTP サービスと Google Cloud API を統括。リトライ、分岐、長時間の待機に対応。']],
                  tip:['Khi quy trình vượt quá “một hàm gọi một hàm”, đừng tự viết logic điều phối rải rác trong code — state machine cho bạn retry, timeout và khả năng quan sát tập trung.','「関数が関数を呼ぶ」を超えたら、統括ロジックをコードに散らさず、ステートマシンでリトライ・タイムアウト・可観測性を集中管理しましょう。']}}
  }}
];
var decState={}; TREES.forEach(function(t){ decState[t.id]={cur:t.start, hist:[], ans:[]}; });
var decTree=TREES[0].id;
function svcLink(cloud,name){
  return '<a class="dec-svc" href="#/service/'+cloud+'/'+encodeURIComponent(name)+'">'+(typeof iconOf==='function'?iconOf(name,22):'')+E(name)+'</a>';
}
function renderDecisions(){
  var host=$('decBody'); if(!host) return;
  var tree=TREES.filter(function(x){return x.id===decTree;})[0];
  var st=decState[tree.id];
  var node=tree.nodes[st.cur];
  var h='<div class="sec-head"><span class="sec-tag">'+L('Chuyên mục · Chọn đúng service','特集 · 正しいサービス選び')+'</span>'
    +'<h2>'+L('Cây quyết định — chọn service bằng vài câu hỏi','決定ツリー — 数問で選ぶサービス')+'</h2>'
    +'<p>'+L('Thay vì đọc một mình danh sách 358 service, hãy trả lời từng câu hỏi ngắn dưới đây. Mỗi cây đi từ bản chất bài toán (không phải từ tên công nghệ) tới gợi ý cụ thể cho cả AWS và Google Cloud — bấm vào tên service trong thẻ kết quả để mở trang chi tiết của nó.','358サービスのリストを一人で読む代わりに、短い質問に答えていく形式です。各ツリーは課題の性質（技術名ではなく）から出発し、AWS と Google Cloud の具体的な候補に到達します。結果カードのサービス名をクリックすると詳細ページが開きます。')+'</p></div>'
    +'<div class="dec-tabs">'+TREES.map(function(t){
      return '<button type="button" class="dec-tab'+(t.id===decTree?' on':'')+'" data-dtree="'+t.id+'">'+t.ic+' '+E(pick(t.t))+'</button>';
    }).join('')+'</div>'
    +'<p class="dec-qsub" style="margin-bottom:12px">'+E(pick(tree.d))+'</p>';
  if(st.ans.length){
    h+='<div class="dec-path"><span>'+L('Đường đã đi:','たどった道：')+'</span>'
      +st.ans.map(function(a,i){ return (i?'<span class="dec-arrow">→</span>':'')+'<span class="dec-crumb">'+E(pick(a.q))+' → <b>'+E(pick(a.a))+'</b></span>'; }).join('')+'</div>';
  }
  if(node&&node.res){
    var r=node.res;
    h+='<div class="dec-q">🎯 '+L('Gợi ý cho bài toán của bạn','あなたの課題への提案')+'</div>'
      +'<div class="dec-res-grid">'
      +[['aws','AWS',r.aws],['gcp','Google Cloud',r.gcp]].map(function(side){
        return '<div class="dec-res"><h4>'+side[1]+'</h4>'
          +side[2].map(function(sv){
            return '<div>'+svcLink(side[0],sv[0])+'<p>'+E(ja()?sv[2]:sv[1])+'</p></div>';
          }).join('')+'</div>';
      }).join('')
      +'</div>'
      +(r.tip?'<div class="dec-tip"><b>'+L('Lưu ý khi áp dụng: ','適用時の注意：')+'</b>'+E(pick(r.tip))+'</div>':'')
      +'<div class="dec-actions">'
      +(st.hist.length?'<button type="button" class="dg-btn" data-dback="'+tree.id+'">‹ '+L('Quay lại câu trước','前の質問に戻る')+'</button>':'')
      +'<button type="button" class="dg-btn" data-dreset="'+tree.id+'">↺ '+L('Làm lại cây này','このツリーをやり直す')+'</button></div>';
  }else if(node){
    h+='<div class="dec-q">'+E(pick(node.q))+'</div>'
      +(node.sub?'<p class="dec-qsub">'+E(pick(node.sub))+'</p>':'')
      +'<div class="dec-opts">'
      +node.opts.map(function(o,i){
        return '<button type="button" class="dec-opt" data-dopt="'+tree.id+':'+st.cur+':'+i+'"><span class="dec-opt-ic">'+o.ic+'</span><span>'+E(pick(o.t))+'</span></button>';
      }).join('')+'</div>'
      +'<div class="dec-actions">'
      +(st.hist.length?'<button type="button" class="dg-btn" data-dback="'+tree.id+'">‹ '+L('Quay lại câu trước','前の質問に戻る')+'</button>':'')
      +(st.ans.length?'<button type="button" class="dg-btn" data-dreset="'+tree.id+'">↺ '+L('Làm lại từ đầu','最初からやり直す')+'</button>':'')
      +'</div>';
  }
  host.innerHTML=h;
  host.querySelectorAll('[data-dtree]').forEach(function(b){ b.addEventListener('click',function(){ decTree=b.getAttribute('data-dtree'); renderDecisions(); }); });
  host.querySelectorAll('[data-dopt]').forEach(function(b){ b.addEventListener('click',function(){
    var p=b.getAttribute('data-dopt').split(':'); var tr=TREES.filter(function(x){return x.id===p[0];})[0]; var s=decState[p[0]];
    var nd=tr.nodes[p[1]]; var opt=nd.opts[+p[2]]; if(!opt) return;
    s.hist.push(p[1]); s.ans.push({q:nd.q, a:opt.t}); s.cur=opt.to; renderDecisions();
    var y=$('decisionsPage'); if(y) y.scrollIntoView({block:'start'});
  }); });
  host.querySelectorAll('[data-dback]').forEach(function(b){ b.addEventListener('click',function(){
    var s=decState[b.getAttribute('data-dback')]; if(!s.hist.length) return;
    s.cur=s.hist.pop(); s.ans.pop(); renderDecisions();
  }); });
  host.querySelectorAll('[data-dreset]').forEach(function(b){ b.addEventListener('click',function(){
    var id=b.getAttribute('data-dreset'); var tr=TREES.filter(function(x){return x.id===id;})[0];
    decState[id]={cur:tr.start, hist:[], ans:[]}; renderDecisions();
  }); });
}
try{ renderDecisions(); }catch(e){}

/* ============================================================
   1 · GUIDED TOUR — dữ liệu bước cho các sơ đồ chính
   step: {n:[chỉ số node], e:[chỉ số cạnh], t:[tiêu đề], b:[giải thích], w:[hộp "vì sao"]}
   ============================================================ */
function TS(n,e,t,b,w){ return {n:n,e:e,t:t,b:b,w:w||null}; }
var TOURS={
pipe:{aws:[
 TS([0],[],['Bước 1 · Nguồn dữ liệu tại cơ sở khách hàng','ステップ1 · 顧客拠点のデータ源'],
   ['Xe tự hành và trạm sao chép dữ liệu (data logger copy station) tại cơ sở khách hàng sinh ra file MDF4/Rosbag khổng lồ. AWS Outposts mang hạ tầng AWS tới tận nơi để tiền xử lý tại chỗ, thay vì đẩy dữ liệu thô qua mạng ngay lập tức.','自動運転車と顧客拠点のデータロガー複写ステーションが、巨大な MDF4/Rosbag ファイルを生みます。AWS Outposts で現地に AWS 基盤を持ち込み、生データを即座に送らず現地で前処理します。'],
   ['Vì sao tiền xử lý tại chỗ? Dữ liệu lái xe tính bằng TB mỗi ngày — lọc và nén ngay tại nguồn giúp giảm mạnh băng thông và chi phí truyền về cloud.','なぜ現地で前処理するのか。走行データは1日あたり TB 規模です。源でフィルタと圧縮を行うことで、クラウドへの転送帯域と費用を大幅に削減できます。']),
 TS([0,1,2,3],[0,1,2,3],['Bước 2 · Ingest — hai đường vào S3 Raw','ステップ2 · 収集 — S3 Raw への2経路'],
   ['Dữ liệu nhỏ và liên tục (telemetry, cập nhật OTA) đi qua IoT Core + Firehose gần thời gian thực; dữ liệu lớn theo đợt đi qua Direct Connect — đường riêng ổn định. Cả hai cùng đổ về một đích chung: S3 Raw.','小さく継続的なデータ（テレメトリ、OTA更新）は IoT Core ＋ Firehose で準リアルタイムに。大容量データは専用線 Direct Connect で。両者は共通の受け口 S3 Raw に集まります。'],
   ['Vì sao tách hai đường? Lưu lượng nhỏ cần độ trễ thấp và quản lý theo thiết bị; file lớn cần băng thông ổn định giá tốt. Gộp một đường nghĩa là trả giá của đường đắt nhất cho mọi loại dữ liệu.','なぜ2経路に分けるのか。小さい通信は低遅延とデバイス管理、大容量は安定した帯域と単価が要ります。1経路にまとめると、全データに最も高い単価を払うことになります。']),
 TS([3,4],[4,8],['Bước 3 · Quality Check bằng EMR','ステップ3 · EMR による品質チェック'],
   ['EMR đọc dữ liệu từ S3 Raw và chấm chất lượng: đạt chuẩn được đánh dấu high-quality để đi tiếp, kém thì tách sang nhánh low-quality. Kết quả kiểm tra ghi ngược về S3 kèm metadata.','EMR が S3 Raw を読み品質を判定します。合格は high-quality として先へ、不良は low-quality へ分離。判定結果はメタデータ付きで S3 に書き戻されます。'],
   ['Vì sao kiểm tra ngay ở cửa vào? Dữ liệu hỏng lọt xuống các bước sau sẽ làm bẩn cả quá trình gắn nhãn và huấn luyện model — chặn sớm rẻ hơn dọn dẹp muộn rất nhiều.','なぜ入口で検査するのか。壊れたデータが後段に流れると、ラベリングもモデル学習も汚染されます。早期遮断は後片付けよりはるかに安くつきます。']),
 TS([5,6],[9],['Bước 4 · MWAA điều phối toàn pipeline','ステップ4 · MWAA が全体を統括'],
   ['Amazon MWAA (Airflow bản managed) là “nhạc trưởng”: kích hoạt các bước trích xuất/làm giàu theo lịch và sự kiện, tự retry khi lỗi và ghi lại thứ tự chạy của từng bước.','Amazon MWAA（マネージド Airflow）が指揮者です。抽出・拡張の各ステップをスケジュールとイベントで起動し、失敗時はリトライ、実行順序を記録します。'],
   ['Vì sao cần orchestrator riêng thay vì để các bước tự gọi nhau? Pipeline 10 bước luôn có lỗi ngẫu nhiên — chỉ orchestrator mới thấy toàn cảnh: bước nào đang chạy, bước nào cần chạy lại, dữ liệu đang kẹt ở đâu.','なぜ専用の統括役が要るのか。10ステップのパイプラインには必ずランダムな失敗が起きます。全体像（実行中、要再実行、滞留箇所）を見られるのは統括役だけです。']),
 TS([3,6,7],[5,6],['Bước 5 · Extract Topics → Enrichment & Sync','ステップ5 · トピック抽出 → 拡張と同期'],
   ['Fargate trích xuất các topics cần thiết từ file thô (camera, lidar, CAN bus…), rồi EMR làm giàu bằng dữ liệu thời tiết và bản đồ, đồng bộ kết quả sang vùng S3 enriched.','Fargate が生ファイルから必要なトピック（カメラ、LiDAR、CANバス等）を抽出し、EMR が気象と地図データで拡張して S3 の enriched 領域へ同期します。'],
   ['Vì sao Fargate cho trích xuất, EMR cho làm giàu? Trích xuất là tác vụ container ngắn, độc lập theo từng file; làm giàu là xử lý phân tán trên dữ liệu lớn — đúng sở trường Spark trên EMR.','なぜ抽出は Fargate、拡張は EMR なのか。抽出はファイル単位の短い独立コンテナ処理。拡張は大規模データの分散処理で、EMR 上の Spark の本領です。']),
 TS([7,8],[7],['Bước 6 · Scene Detection','ステップ6 · シーン検出'],
   ['EMR chạy thuật toán phát hiện tình huống (scenario): phanh gấp, cắt làn, suýt va chạm… và cắt dữ liệu thành các đoạn scene có giá trị cho huấn luyện, thay vì giữ cả hành trình dài.','EMR がシナリオ検出（急ブレーキ、割り込み、ヒヤリハット等）を実行し、長い走行全体ではなく、学習価値のあるシーン単位にデータを切り出します。'],
   ['Vì sao phải cắt scene? 99% thời gian lái xe là “nhàm chán” — model chỉ học được từ các tình huống đáng chú ý, và gắn nhãn theo scene rẻ hơn gắn nhãn video hàng giờ.','なぜシーンに切るのか。走行時間の99%は「退屈」です。モデルが学べるのは注目すべき場面だけであり、シーン単位のラベリングは長時間動画より桁違いに安くなります。']),
 TS([6,7,9],[10,11],['Bước 7 · Data Catalog & metadata','ステップ7 · データカタログとメタデータ'],
   ['Glue Data Catalog đăng ký schema của mọi dataset; Neptune giữ lineage (dữ liệu này sinh ra từ đâu), DynamoDB giữ metadata tra cứu nhanh, OpenSearch phục vụ tìm kiếm scene theo thuộc tính.','Glue データカタログが全データセットのスキーマを登録。Neptune がリネージ（由来）、DynamoDB が高速参照用メタデータ、OpenSearch が属性によるシーン検索を担います。'],
   ['Vì sao tới bốn hệ lưu trữ ở một bước? Mỗi loại dữ liệu một mẫu truy cập khác nhau: schema → catalog, quan hệ nguồn gốc → đồ thị, tra cứu theo key → NoSQL, tìm kiếm full-text → search engine. Ép một hệ làm cả bốn việc là anti-pattern.','なぜ1ステップに4つの保存系か。スキーマはカタログ、由来はグラフ、キー参照は NoSQL、全⽂検索は検索エンジン — アクセスパターンが違うからです。1つに全部やらせるのはアンチパターンです。']),
 TS([3,10,11],[12,13],['Bước 8 · Trích ảnh & ẩn danh','ステップ8 · 画像抽出と匿名化'],
   ['Từ dữ liệu ở S3, Fargate trích khung hình, Lambda điều phối việc gọi Rekognition để phát hiện và làm mờ mặt người, biển số — trước khi dữ liệu tới tay đội gắn nhãn và vào huấn luyện.','S3 のデータから Fargate がフレームを抽出し、Lambda が Rekognition を呼び出して顔とナンバープレートを検出・ぼかし処理します。ラベリング担当者と学習に渡る前段で行います。'],
   ['Vì sao ẩn danh là bước bắt buộc, không phải tuỳ chọn? Dữ liệu lái xe chứa mặt và biển số của người đi đường — yêu cầu pháp lý về quyền riêng tư buộc phải xử lý trước khi con người nhìn thấy dữ liệu.','なぜ匿名化は必須なのか。走行データには通行人の顔とナンバーが含まれます。プライバシー法制上、人がデータを見る前に処理しなければなりません。']),
 TS([10,8,12],[14,15],['Bước 9 · Labeling bằng SageMaker Ground Truth','ステップ9 · SageMaker Ground Truth でラベリング'],
   ['Ảnh và scene đã ẩn danh được đưa vào SageMaker Ground Truth để đội gắn nhãn chú thích (bounding box, loại đối tượng…). Dữ liệu scene từ bước 6 cũng cấp cho vòng gắn nhãn này.','匿名化済みの画像とシーンが SageMaker Ground Truth に渡され、ラベリングチームが注釈（バウンディングボックス、対象種別等）を付けます。ステップ6のシーンもこの工程に供給されます。'],
   ['Vì sao gắn nhãn nằm gần cuối pipeline? Nhãn là dữ liệu đắt nhất vì tốn công người — chỉ gắn nhãn trên dữ liệu đã qua kiểm tra chất lượng, đã làm giàu và đã ẩn danh, tránh lãng phí vào dữ liệu sẽ bị bỏ đi.','なぜラベリングは終盤なのか。ラベルは人手コストで最も高いデータです。品質検査・拡張・匿名化を通過したデータにだけ付け、捨てるデータへの浪費を防ぎます。']),
 TS([9,13,14],[16,17],['Bước 10 · Analytics & tìm kiếm scenario','ステップ10 · 分析とシナリオ検索'],
   ['QuickSight hiển thị KPI về chất lượng dữ liệu và tiến độ gắn nhãn; AppSync + Fargate (Webviz/RViz) cho kỹ sư tìm và xem lại đúng scene cần tìm — mọi truy vấn đều bắt đầu từ catalog ở bước 7.','QuickSight がデータ品質とラベリング進捗の KPI を表示。AppSync ＋ Fargate（Webviz/RViz）でエンジニアが必要なシーンを検索・再生します。全ての検索はステップ7のカタログから始まります。'],
   ['Cách đọc sơ đồ lớn: luôn đi theo số thứ tự và chiều dữ liệu (ingest → xử lý → catalog → tiêu thụ), đừng đọc theo vị trí hình. Sơ đồ này “khép vòng” ở catalog — bước 7 là điểm bắt đầu của mọi phân tích.','大きな図の読み方：位置ではなく、番号順とデータの流れ（収集 → 処理 → カタログ → 活用）で読みます。この図はカタログで「輪」が閉じ、ステップ7が全分析の起点です。'])
]},
'hybrid-cert':{aws:[
 TS([1,2],[0],['Bước 1 · Scheduler kích hoạt CertCheck theo lịch','ステップ1 · スケジューラが CertCheck を定期起動'],
   ['EventBridge Scheduler chạy theo lịch cố định (ví dụ mỗi ngày một lần) và gọi Lambda CertCheck. Toàn bộ vòng đời chứng chỉ bắt đầu từ một “đồng hồ” duy nhất này — không ai phải nhớ kiểm tra hạn bằng tay.','EventBridge Scheduler が固定スケジュール（例：1日1回）で Lambda CertCheck を呼びます。証明書ライフサイクル全体はこの1つの「時計」から始まります — 期限確認を人が覚えておく必要はありません。'],
   ['Vì sao dùng Scheduler thay vì cron trên server? Server on-prem có thể tắt/bảo trì đúng lúc cron chạy; Scheduler phía AWS chạy độc lập, có retry và ghi lại mọi lần kích hoạt.','なぜサーバー上の cron ではなく Scheduler なのか。オンプレミスサーバーは cron の時刻に停止・保守中かもしれません。AWS 側の Scheduler は独立して動き、リトライと実行記録が残ります。']),
 TS([2,3],[1],['Bước 2 · CertCheck truy vấn DynamoDB','ステップ2 · CertCheck が DynamoDB を照会'],
   ['CertCheck đọc bảng DynamoDB — “sổ theo dõi” mọi chứng chỉ của các server on-prem: hạn hết, trạng thái, server sở hữu. Nó lọc ra những cert sắp hết hạn hoặc còn thiếu.','CertCheck が DynamoDB の台帳を読みます — 全オンプレミスサーバーの証明書について、期限・状態・所有サーバーを記録したものです。期限間近と未発行のものを抽出します。'],
   ['Vì sao cần một bảng theo dõi riêng? Lambda là stateless — không có “sổ” này thì mỗi lần chạy nó không biết cert nào tồn tại, cert nào sắp chết. DynamoDB đóng vai bộ nhớ bền của cả hệ thống.','なぜ専用の台帳が要るのか。Lambda はステートレスです。この台帳がなければ、どの証明書が存在し、どれが期限間近か分かりません。DynamoDB がシステム全体の永続メモリです。']),
 TS([3,2],[2],['Bước 3 · DynamoDB trả danh sách cần xử lý','ステップ3 · DynamoDB が対象リストを返す'],
   ['Danh sách chứng chỉ cần cấp mới/cấp bổ sung quay về CertCheck. Mũi tên 2 và 3 dùng chung một đường hai chiều giữa CertCheck và DynamoDB — đọc sơ đồ hybrid luôn chú ý các cặp mũi tên hỏi/đáp như thế này.','新規・追加発行が必要な証明書のリストが CertCheck へ戻ります。矢印2と3は CertCheck と DynamoDB の間の往復ペアです — ハイブリッド図ではこうした「問い合わせ／応答」のペアに注目してください。'],
   null),
 TS([2,4],[3],['Bước 4 · CertCheck gọi CertIssue','ステップ4 · CertCheck が CertIssue を呼ぶ'],
   ['Với mỗi chứng chỉ cần xử lý, CertCheck gọi Lambda CertIssue. Việc “phát hiện” và việc “cấp phát” tách thành hai hàm riêng: CertCheck chỉ quyết định, CertIssue mới thực thi.','処理対象ごとに、CertCheck が Lambda CertIssue を呼びます。「検出」と「発行」を別関数に分け、CertCheck は判断だけ、CertIssue が実行を担います。'],
   ['Vì sao tách hai Lambda? Nguyên tắc một việc một hàm (single responsibility): hàm kiểm tra chạy thường xuyên và nhẹ; hàm cấp phát chạy ít hơn, cần quyền mạnh hơn (gọi Private CA, Run Command) — tách ra để cấp quyền tối thiểu cho từng hàm.','なぜ2つの Lambda に分けるのか。単一責務の原則です。点検は頻繁で軽く、発行は頻度が低く強い権限（プライベート CA 呼出、Run Command）が要ります。分けることで各関数へ最小権限を渡せます。']),
 TS([4,8,0],[4,5],['Bước 5 · CertIssue nhờ SSM Run Command yêu cầu tạo CSR','ステップ5 · CertIssue が SSM Run Command で CSR 生成を依頼'],
   ['CertIssue gửi lệnh qua Systems Manager Run Command xuyên qua viền khung AWS xuống server on-premise: “hãy tạo một cặp khoá mới và CSR cho chứng chỉ này”. Huy hiệu 5 nằm trên chặng CertIssue → SSM, lệnh sau đó được SSM chuyển tiếp xuống server.','CertIssue が Systems Manager Run Command で、AWS のフレーム境界を越えてオンプレミスサーバーへ命令を送ります。「この証明書用に新しい鍵ペアと CSR を作れ」。番号5は CertIssue → SSM の区間にあり、命令は SSM がサーバーへ転送します。'],
   ['Vì sao lệnh phải đi qua SSM thay vì SSH vào server? Run Command cho phép ra lệnh tới máy ngoài AWS (qua hybrid activation) mà không mở cổng inbound nào trên firewall của data center, mọi lệnh đều được ghi log và gắn quyền IAM.','なぜ SSH ではなく SSM 経由なのか。Run Command はハイブリッドアクティベーションにより AWS 外のマシンへも命令でき、データセンターのファイアウォールに受信ポートを開けずに済みます。全命令が記録され IAM 権限で制御されます。']),
 TS([0,4],[6],['Bước 6 · Server tạo CSR/khoá và gửi CSR về','ステップ6 · サーバーが CSR と鍵を生成し CSR を返す'],
   ['Server on-premise tự tạo private key và CSR ngay tại chỗ, rồi gửi CSR ngược lên CertIssue. Đây là mũi tên dài xuyên cả hai khung — và là chi tiết bảo mật quan trọng nhất của sơ đồ.','オンプレミスサーバーが秘密鍵と CSR を現地で生成し、CSR を CertIssue へ送り返します。2つのフレームを横切る長い矢印であり、この図で最も重要なセキュリティ上の要点です。'],
   ['Vì sao private key không bao giờ rời server? Nếu khoá riêng bị lộ trên đường truyền hoặc phía cloud, chứng chỉ mất giá trị bảo mật. Mô hình CSR chuẩn PKI sinh ra đúng để giải quyết việc này: chỉ phần công khai (CSR) được đi xa.','なぜ秘密鍵はサーバーを出ないのか。鍵が伝送路やクラウド側で漏れれば証明書の安全性は失われます。CSR という PKI の標準モデルはまさにこのためにあり、遠くへ行くのは公開部分（CSR）だけです。']),
 TS([4,5],[7],['Bước 7 · CertIssue chuyển CSR sang ACM Private CA','ステップ7 · CertIssue が CSR を ACM プライベート CA へ'],
   ['CertIssue gọi IssueCertificate của ACM Private CA với CSR vừa nhận. Private CA là CA riêng của tổ chức, chỉ cấp chứng chỉ cho nội bộ — chứng chỉ của nó không được trình duyệt công cộng tin cậy, và đó là chủ đích.','CertIssue が受け取った CSR で ACM プライベート CA の IssueCertificate を呼びます。プライベート CA は組織専用の CA で社内向けだけに発行します — 公共ブラウザに信頼されないのは仕様通りです。'],
   ['Vì sao dùng Private CA thay vì CA công cộng? Chứng chỉ ở đây phục vụ server nội bộ và xác thực máy-với-máy (mTLS / Roles Anywhere), không phục vụ website công cộng. CA riêng cho phép tự động hoá hoàn toàn, tuổi thọ cert ngắn và thu hồi tức thì.','なぜ公共 CA ではなくプライベート CA なのか。この証明書は社内サーバーとマシン間認証（mTLS／Roles Anywhere）用で、公開サイト用ではありません。専用 CA なら完全自動化、短寿命化、即時失効が可能です。']),
 TS([5,4],[8],['Bước 8 · Private CA cấp chứng chỉ mới','ステップ8 · プライベート CA が新証明書を発行'],
   ['ACM Private CA ký vào CSR và tạo chứng chỉ mới. Huy hiệu 8 và 9 đặt lệch nhau trên cùng một mũi tên PCA → CertIssue: “cấp” và “trả về” là hai mặt của cùng một lần gọi API.','ACM プライベート CA が CSR に署名し新しい証明書を作ります。番号8と9は同じ矢印（PCA → CertIssue）上にずらして配置 — 「発行」と「返却」は1回の API 呼出の表裏です。'],
   null),
 TS([5,4],[15],['Bước 9 · Chứng chỉ trả về CertIssue','ステップ9 · 証明書が CertIssue へ返る'],
   ['Chứng chỉ mới (chỉ phần công khai + chuỗi tin cậy) về tới CertIssue. Từ đây luồng đổi hướng: thay vì CertIssue tự đẩy xuống server, nó phát một sự kiện để khâu triển khai xử lý độc lập.','新しい証明書（公開部分と信頼チェーンのみ）が CertIssue へ届きます。ここで流れが変わります。CertIssue 自身がサーバーへ配るのではなく、イベントを発して配置工程を独立に動かします。'],
   ['Vì sao phát sự kiện thay vì gọi thẳng CertDeploy? Tách bằng sự kiện (decoupling) giúp khâu cấp và khâu triển khai lỗi độc lập, retry độc lập — và sau này thêm bên nhận khác (thông báo Slack, ghi audit…) mà không sửa CertIssue.','なぜ CertDeploy を直接呼ばずイベントにするのか。イベントで分離すると、発行側と配置側が独立に失敗・リトライできます。後から別な受け手（Slack 通知、監査記録等）を CertIssue 無修正で追加できます。']),
 TS([4,6],[9],['Bước 10 · CertIssue phát sự kiện lên EventBridge','ステップ10 · CertIssue が EventBridge へイベント発行'],
   ['CertIssue đưa sự kiện “certificate issued” kèm thông tin server đích và chứng chỉ lên event bus của EventBridge. Event bus là điểm trung chuyển sự kiện dùng chung của kiến trúc hướng sự kiện trên AWS.','CertIssue が「certificate issued」イベント（対象サーバーと証明書の情報付き）を EventBridge のイベントバスへ送ります。イベントバスは AWS のイベント駆動構成の共通中継点です。'],
   null),
 TS([6,7],[10],['Bước 11 · EventBridge kích hoạt CertDeploy','ステップ11 · EventBridge が CertDeploy を起動'],
   ['Rule trên event bus khớp sự kiện “đã cấp cert” và kích hoạt Lambda CertDeploy. CertDeploy chỉ thức dậy khi có cert mới — đúng mẫu serverless trả tiền theo sự kiện.','イベントバス上のルールが「発行完了」イベントに一致し Lambda CertDeploy を起動します。CertDeploy は新証明書がある時だけ目覚めます — イベント課金のサーバーレスらしい形です。'],
   null),
 TS([7,8],[11],['Bước 12 · CertDeploy nhờ SSM cài chứng chỉ xuống server','ステップ12 · CertDeploy が SSM 経由で証明書を配置'],
   ['CertDeploy gửi Run Command thứ hai (khác lệnh tạo CSR ở bước 5): lần này payload mang theo chứng chỉ mới và lệnh cài đặt xuống đúng server đích.','CertDeploy が2つ目の Run Command を送ります（ステップ5の CSR 生成命令とは別）。今回は新しい証明書と配置命令が対象サーバーへ届きます。'],
   ['Vì sao cùng một kênh SSM cho cả hai chiều công việc? Một kênh vận hành duy nhất nghĩa là một nơi để cấp quyền, một nơi xem log lệnh, một cơ chế retry — vận hành hybrid càng ít kênh càng ít rủi ro.','なぜ同じ SSM 経路で両方の仕事をするのか。運用経路が1つなら、権限付与も、命令ログも、リトライも1か所で済みます。ハイブリッド運用は経路が少ないほど安全です。']),
 TS([8,0],[12],['Bước 13 · Server cài chứng chỉ + nạp lại dịch vụ','ステップ13 · サーバーが証明書を配置しサービスを再読込'],
   ['Lệnh của SSM chạm tới server on-premise (huy hiệu 13 trên mũi tên SSM → Server): server ghi chứng chỉ mới vào đúng vị trí, nạp lại (reload) dịch vụ đang dùng cert và báo kết quả chạy lệnh về SSM. Vòng đời một chứng chỉ khép lại tại đây.','SSM の命令がオンプレミスサーバーに届きます（番号13は SSM → Server の矢印上）。サーバーが新証明書を所定の位置へ書き、利用中サービスを再読込し、実行結果を SSM へ報告します。証明書1件のライフサイクルがここで閉じます。'],
   ['Vì sao phải reload dịch vụ sau khi thay cert? Hầu hết dịch vụ (web server, agent…) chỉ đọc chứng chỉ lúc khởi động hoặc khi được ra lệnh nạp lại — thay file mà không reload thì cert cũ vẫn được dùng cho tới lần restart tình cờ nào đó.','なぜ配置後にサービスの再読込が要るのか。多くのサービスは証明書を起動時（または再読込指示時）にしか読みません。ファイルだけ替えても、偶然の再起動まで旧証明書が使われ続けます。']),
 TS([0,9,8],[13,14],['Bước 14 · IAM Roles Anywhere — đổi chứng chỉ lấy thông tin xác thực AWS','ステップ14 · IAM Roles Anywhere — 証明書を AWS 認証情報に交換'],
   ['Node IAM Roles Anywhere đứng ngay trên biên hai khung: server on-premise trình chứng chỉ X.509 của mình (được Private CA cấp, PCA đóng vai trust anchor) để đổi lấy thông tin xác thực AWS tạm thời. Đây là nền xác thực để chính server đó thực hiện các tương tác AWS trong các bước trên — không cần access key dài hạn nào nằm trên server.','IAM Roles Anywhere のノードは2フレームの境界上にあります。オンプレミスサーバーが自らの X.509 証明書（プライベート CA 発行、CA がトラストアンカー）を提示し、一時的な AWS 認証情報に交換します。これが、上記ステップでサーバー自身が AWS とやり取りする際の認証基盤であり、サーバー上に長期アクセスキーは不要です。'],
   ['Vì sao đây là bước “nền” thay vì bước cuối theo thời gian? Thông tin xác thực tạm thời hết hạn theo giờ và được cấp lại mỗi khi cần — nó không chạy một lần ở cuối quy trình, mà đứng dưới mọi lần server gọi AWS API.','なぜ時間順の最後ではなく「基盤」のステップなのか。一時認証情報は数時間で失効し、必要な度に再取得されます。流程の最後に1回だけ走るのではなく、サーバーが AWS API を呼ぶ全ての場面の下支えです。'])
]},
a2:{aws:[
 TS([0,1],[0],['Chặng 1 · Người dùng → ALB','区間1 · ユーザー → ALB'],
   ['Mọi request đều vào qua ALB ở public subnet — điểm vào công khai duy nhất của hệ thống. EC2 nằm ở private subnet, không có public IP, nên internet không chạm trực tiếp được vào máy ứng dụng.','全リクエストはパブリックサブネットの ALB から入ります。これがシステム唯一の公開入口です。EC2 はプライベートサブネットにあり公開 IP を持たないため、インターネットから直接届きません。'],
   ['Vì sao không cho user vào thẳng EC2? Auto Scaling liên tục thay máy nên IP đích thay đổi; máy chết phải bị loại khỏi vòng quay ngay; TLS và health check cần một điểm tập trung. ALB giải quyết cả ba. (Biến thể có CDN: đặt CloudFront trước ALB để cache nội dung tĩnh — xem tour của sơ đồ Website tĩnh toàn cầu.)','なぜ EC2 へ直接入れないのか。Auto Scaling はマシンを常に入れ替えるため宛先 IP が変わり、死んだマシンは即座に外す必要があり、TLS とヘルスチェックには集約点が要ります。ALB がこの3点を解決します。（CDN 付きの変種では ALB の前に CloudFront を置きます — 静的サイトの図のツアー参照）']),
 TS([1,2],[1],['Chặng 2 · ALB → EC2 Auto Scaling (2 AZ)','区間2 · ALB → EC2 Auto Scaling（2 AZ）'],
   ['ALB chia request cho các EC2 khoẻ mạnh ở cả hai AZ theo target group. Health check fail thì target bị loại ngay; ASG tự launch máy thay thế để giữ đúng số lượng mong muốn.','ALB はターゲットグループに従い、両 AZ の正常な EC2 へリクエストを分散します。ヘルスチェック失敗で即座に除外され、ASG が代替マシンを起動して希望数を維持します。'],
   ['Vì sao ASG phải trải 2 AZ? Một AZ mất điện thì nửa capacity còn lại vẫn gánh toàn bộ traffic — đây là nền của tính sẵn sàng cao (HA), và là tiền đề cho phần Giả lập sự cố của chính sơ đồ này.','なぜ ASG を2 AZ に広げるのか。1つの AZ が落ちても残り半分が全トラフィックを担えます。これが高可用性（HA）の土台であり、この図の障害シミュレーションの前提です。']),
 TS([2,4],[3],['Chặng 3 · EC2 → ElastiCache (tuỳ chọn)','区間3 · EC2 → ElastiCache（任意）'],
   ['Session, giỏ hàng và dữ liệu đọc lặp được lấy từ cache trong RAM trước; chỉ cache miss mới đi tiếp xuống database — giúp RDS “thở” được trong giờ cao điểm.','セッション、カート、繰り返し読まれるデータはまず RAM 上のキャッシュから。キャッシュミス時のみ DB へ進み、ピーク時の RDS の負担を減らします。'],
   ['Vì sao cache đứng trước DB? Khoảng 80% lượt đọc thường lặp lại trên một tập dữ liệu nóng rất nhỏ — phục vụ từ RAM rẻ hơn và nhanh hơn đọc đĩa ở DB hàng chục lần.','なぜキャッシュを DB の前に置くのか。読み取りの8割は小さなホットデータの繰り返しです。RAM からの応答は DB のディスク読みより桁違いに速く安くなります。']),
 TS([2,3],[2],['Chặng 4 · EC2 → RDS Multi-AZ','区間4 · EC2 → RDS Multi-AZ'],
   ['Tầng dữ liệu nằm ở subnet riêng sâu nhất, chỉ nhận kết nối từ tầng app. RDS Primary ghi dữ liệu và đồng bộ liên tục sang Standby ở AZ còn lại — standby không phục vụ đọc, chỉ chờ failover.','データ層は最も深い専用サブネットにあり、アプリ層からの接続だけを受けます。RDS プライマリが書き込み、もう一方の AZ のスタンバイへ常時同期。スタンバイは読み取りには使わず、フェイルオーバー専用です。'],
   ['Vì sao standby không cho đọc “cho đỡ phí”? Nhiệm vụ duy nhất của standby Multi-AZ là lên thay primary trong 1–2 phút khi AZ chính sập. Muốn đọc thêm thì dùng Read Replica — hai cơ chế, hai mục đích khác nhau.','なぜスタンバイを読ませないのか。Multi-AZ スタンバイの唯一の仕事は、本系 AZ 障害時に1〜2分で昇格することです。読み取りを増やしたいならリードレプリカ — 仕組みも目的も別です。']),
 TS([2,5],[4],['Chặng 5 · EC2 → S3 (file người dùng upload)','区間5 · EC2 → S3（アップロードファイル）'],
   ['Ảnh và file upload được ghi thẳng lên S3 (thường qua presigned URL hoặc SDK) thay vì lưu vào đĩa của EC2 — vì đĩa máy ảo sẽ mất khi máy bị ASG thay thế.','画像とアップロードファイルは EC2 のディスクではなく、S3 へ直接（署名付きURLや SDK 経由で）保存します。VM のディスクは ASG の入れ替えで消えるからです。'],
   ['Nguyên tắc vàng của tầng app stateless: EC2 phải “chết là thay” bất cứ lúc nào mà không mất dữ liệu — mọi trạng thái bền (file, session, dữ liệu) đều đẩy ra service dùng chung bên ngoài.','ステートレスなアプリ層の黄金律：EC2 はいつ死んで入れ替わってもデータを失わないこと。永続状態（ファイル、セッション、データ）は全て外部の共有サービスへ出します。'])
 ],
 gcp:[
 TS([0,1],[0],['Chặng 1 · Người dùng → Global Load Balancing','区間1 · ユーザー → グローバル LB'],
   ['Toàn bộ người dùng trên thế giới dùng chung một địa chỉ IP anycast. Global LB tự đưa mỗi người dùng về region gần nhất và khoẻ nhất; Cloud Armor (WAF) và Cloud CDN bật ngay trên LB này.','全世界のユーザーが単一の anycast IP を共有します。グローバル LB が各ユーザーを最も近く正常なリージョンへ案内し、Cloud Armor（WAF）と Cloud CDN はこの LB 上で有効化します。'],
   ['Khác biệt với AWS: GCP không cần một ALB cho mỗi region rồi dùng DNS để chọn region — bản thân LB đã là toàn cầu. Đây là hệ quả trực tiếp của tư duy VPC toàn cầu của GCP.','AWS との違い：GCP はリージョン毎の ALB ＋ DNS 選定が不要で、LB 自体がグローバルです。GCP の「グローバル VPC」思想の直接の帰結です。']),
 TS([1,2],[1],['Chặng 2 · Global LB → Cloud Run','区間2 · グローバル LB → Cloud Run'],
   ['LB chuyển request tới Cloud Run — container chạy theo request, tự scale từ 0 lên rất lớn và về 0 khi hết traffic, không có máy nào phải “trực” sẵn.','LB がリクエストを Cloud Run へ。コンテナはリクエスト駆動で0から大きくスケールし、トラフィックが無ければ0に戻ります。「待機」するマシンはありません。'],
   ['So với ASG phía AWS: ASG luôn giữ tối thiểu một số máy chạy (trả tiền cả khi rảnh), còn Cloud Run trả theo thời gian xử lý thực tế — đổi lại có cold start khi scale từ 0.','AWS の ASG との比較：ASG は最小台数を常時稼働させ（暇でも課金）、Cloud Run は実処理時間の課金です。代償は0からのコールドスタートです。']),
 TS([2,3],[2],['Chặng 3 · Cloud Run → Cloud SQL (HA theo region)','区間3 · Cloud Run → Cloud SQL（リージョナル HA）'],
   ['Cloud Run nối vào Cloud SQL bằng private IP trong VPC. Bản HA theo region giữ một standby ở zone khác trong cùng region: zone chính sập thì failover tự động, địa chỉ kết nối giữ nguyên.','Cloud Run は VPC 内のプライベート IP で Cloud SQL へ接続します。リージョナル HA は同一リージョンの別ゾーンにスタンバイを持ち、ゾーン障害時は自動フェイルオーバー。接続先アドレスは変わりません。'],
   ['Thuật ngữ tương ứng: “Multi-AZ” của AWS ≈ “Regional HA” của GCP — cùng một ý tưởng (standby ở vùng chịu lỗi khác), khác ở chỗ GCP tổ chức theo zone trong một VPC toàn cầu.','用語対応：AWS の Multi-AZ ≒ GCP のリージョナル HA。考え方（別の障害ドメインにスタンバイ）は同じで、GCP はグローバル VPC 内のゾーンで構成する点が異なります。']),
 TS([2,4],[4],['Chặng 4 · Cloud Run → Cloud Storage (file upload)','区間4 · Cloud Run → Cloud Storage（ファイル）'],
   ['File người dùng upload đi thẳng lên Cloud Storage qua signed URL; container của Cloud Run là ephemeral — ghi vào đĩa container là mất khi instance bị thu hồi.','アップロードファイルは署名付きURLで Cloud Storage へ直接。Cloud Run のコンテナは一時的なもので、コンテナのディスクに書いてもインスタンス回収で消えます。'],
   ['Giống nguyên tắc phía AWS: tầng compute stateless, trạng thái bền luôn nằm ở service lưu trữ dùng chung.','AWS 側と同じ原則です。コンピュート層はステートレスにし、永続状態は共有ストレージサービスに置きます。'])
 ]},
a1:{aws:[
 TS([0,1],[0],['Chặng 1 · Người dùng → Route 53','区間1 · ユーザー → Route 53'],
   ['Người dùng gõ tên miền; Route 53 phân giải DNS và trả về địa chỉ của CloudFront. DNS là cửa ngõ đầu tiên của mọi kiến trúc web — sai ở đây thì mọi thứ sau đều không tới được.','ユーザーがドメインを入力し、Route 53 が DNS を解決して CloudFront のアドレスを返します。DNS は全 Web 構成の最初の関門です。'],
   null),
 TS([1,2,3],[1,2],['Chặng 2 · Route 53 → CloudFront → (cache miss) → S3','区間2 · Route 53 → CloudFront →（キャッシュミス時）S3'],
   ['Request tới điểm edge CloudFront gần người dùng nhất. Nếu nội dung đã có trong cache (cache hit), CloudFront trả ngay từ edge — không chạm tới S3. Chỉ khi cache miss, CloudFront mới quay về origin S3 lấy nội dung, trả cho người dùng đồng thời lưu vào cache cho các lần sau.','リクエストは最寄りの CloudFront エッジへ。キャッシュヒットならエッジから即応答し、S3 には触れません。キャッシュミスの時だけオリジン S3 へ取りに行き、応答しながらキャッシュにも保存します。'],
   ['Vì sao qua CloudFront trước mà không vào thẳng S3/ALB? Ba lý do: (1) cache tại edge gần user cho độ trễ thấp, đồng thời giảm tải và giảm phí truyền dữ liệu cho origin; (2) HTTPS, WAF, chống DDoS được xử lý tại edge trước khi traffic chạm hạ tầng của bạn; (3) bucket S3 có thể khoá hoàn toàn, chỉ cho CloudFront đọc. Cache miss thì sao? Request đầu tiên chậm hơn một chút vì phải đi hết đường về origin — đó là cái giá của lần đầu; mọi request sau trên cùng nội dung đều hưởng cache hit.','なぜ S3/ALB へ直接ではなく CloudFront を先に通すのか。理由は3つ：（1）ユーザー近くのエッジキャッシュで低遅延になり、オリジンの負荷と転送費が減る。（2）HTTPS、WAF、DDoS 対策をエッジで処理し、自前基盤に触れさせない。（3）S3 バケットを完全に閉じ、CloudFront だけに読ませられる。キャッシュミス時は？ 初回だけオリジンまで往復する分遅くなりますが、その代償で以降は全てキャッシュヒットになります。']),
 TS([4,2],[3],['Chặng 3 · WAF gắn tại CloudFront','区間3 · CloudFront に付ける WAF'],
   ['AWS WAF kiểm tra mọi request ngay tại edge: chặn bot, SQL injection, XSS và giới hạn tốc độ theo IP — trước khi request xấu kịp tới origin.','AWS WAF がエッジで全リクエストを検査します。ボット、SQL インジェクション、XSS、IP 単位のレート制限を、オリジンに届く前に遮断します。'],
   ['Vì sao chặn ở edge thay vì ở server? Request xấu bị loại càng sớm, origin càng đỡ tốn băng thông và tài nguyên — khi bị tấn công, origin của bạn thậm chí không “biết” mình đang bị tấn công.','なぜサーバーではなくエッジで止めるのか。悪性リクエストを早く落とすほど、オリジンの帯域と資源を節約できます。攻撃時にはオリジンが「攻撃に気づかない」状態にできます。']),
 TS([2,5],[4],['Chặng 4 · Lambda@Edge (tuỳ chọn)','区間4 · Lambda@Edge（任意）'],
   ['Khi cần logic ngay tại edge — redirect theo quốc gia, thêm header bảo mật, A/B testing — Lambda@Edge hoặc CloudFront Functions chạy tại điểm edge thay vì quay về server gốc.','国別リダイレクト、セキュリティヘッダ付与、A/B テストなどエッジ側ロジックが必要な場合、Lambda@Edge や CloudFront Functions がオリジンに戻らずエッジで実行します。'],
   null)
 ],
 gcp:[
 TS([0,1,2],[0,1],['Chặng 1 · Người dùng → Cloud DNS → Global LB','区間1 · ユーザー → Cloud DNS → グローバル LB'],
   ['Cloud DNS phân giải tên miền về địa chỉ anycast duy nhất của Global LB. Khác AWS: CDN không phải sản phẩm riêng — Cloud CDN được bật ngay trên chính LB này.','Cloud DNS がドメインをグローバル LB の単一 anycast アドレスへ解決します。AWS と違い、CDN は別製品ではなく、この LB 上で Cloud CDN を有効化します。'],
   ['Cache miss thì sao? LB không có nội dung trong cache tại edge thì quay xuống backend bucket (Cloud Storage) lấy, trả cho người dùng và giữ lại bản cache — cùng một nguyên lý “lần đầu chậm, lần sau nhanh” như CloudFront.','キャッシュミス時は？ エッジに無ければ LB がバックエンドバケット（Cloud Storage）へ取りに行き、応答しながらキャッシュに保持します。CloudFront と同じ「初回は遅く、次回から速い」原理です。']),
 TS([2,3],[2,3],['Chặng 2 · Global LB ⇄ Cloud Storage (origin)','区間2 · グローバル LB ⇄ Cloud Storage（オリジン）'],
   ['Mũi tên hai chiều giữa LB và bucket chính là vòng đời của cache: chiều xuống là cache miss (đi lấy nội dung), chiều lên là nội dung quay về để phục vụ và lưu cache tại edge của Google trên toàn cầu.','LB とバケットの双方向の矢印はキャッシュのライフサイクルです。下りはキャッシュミス（取得）、上りは応答とエッジキャッシュへの保存を表します。'],
   null),
 TS([4,2],[4],['Chặng 3 · Cloud Armor gắn tại LB','区間3 · LB に付ける Cloud Armor'],
   ['Cloud Armor là lớp bảo vệ lớp 7 của GCP gắn trực tiếp trên Global LB: chặn theo IP/quốc gia, chống DDoS và các mẫu tấn công web phổ biến trước khi traffic tới bucket.','Cloud Armor はグローバル LB に直接付ける GCP の L7 防御です。IP/国別ブロック、DDoS、代表的な Web 攻撃をバケット到達前に遮断します。'],
   null)
 ]}
};
/* Tour tự sinh cho sơ đồ có node đánh số (theo số thứ tự trên node) */
function autoTour(d,key){
  var v=d.variants[key]; if(!v) return null;
  var numbered=v.nodes.map(function(n,i){ return {n:n,i:i}; }).filter(function(x){ return x.n.num>0; })
    .sort(function(a,b){ return a.n.num-b.n.num; });
  if(numbered.length<2) return null;
  return numbered.map(function(x,k){
    var prev=k>0?numbered[k-1]:null, es=[];
    if(prev) v.edges.forEach(function(e,ei){ if((e[0]===prev.i&&e[1]===x.i)||(e[0]===x.i&&e[1]===prev.i)) es.push(ei); });
    return TS(prev?[prev.i,x.i]:[x.i], es,
      ['Bước '+x.n.num+' · '+x.n.l,'ステップ'+x.n.num+' · '+x.n.l],
      [x.n.u||'Bước này là mắt xích thứ '+x.n.num+' trong luồng của sơ đồ — hãy bấm vào node để xem giải thích đầy đủ và link tới trang chi tiết service.',
       x.n.uj||'この図の流れにおける第'+x.n.num+'の要素です。ノードをクリックすると詳しい説明とサービス詳細へのリンクが出ます。'],
      null);
  });
}
function getTour(d,key){
  if(TOURS[d.id]&&TOURS[d.id][key]) return TOURS[d.id][key];
  return autoTour(d,key);
}

/* ============================================================
   2 · FAILURE SIMULATION — cấu hình cho 3 sơ đồ HA
   down: node sập hẳn · half: node mất phần AZ-a · liveN/liveE:
   đường sống · deadE: đường chết · steps: diễn tiến failover
   ============================================================ */
var SIMS={
a2:{aws:{btn:['Giả lập sự cố: sập AZ-a','障害シミュレーション：AZ-a がダウン'],
  cap:['⚠ AZ-a (ap-northeast-1a) mất điện — traffic dồn sang AZ-b · RDS failover đang diễn ra','⚠ AZ-a（ap-northeast-1a）が停電 — トラフィックは AZ-b へ · RDS フェイルオーバー実行中'],
  half:[2,3], badges:{2:['AZ-a ✕','AZ-a ✕'],3:['AZ-a ✕','AZ-a ✕']}, liveN:[0,1], liveE:[0,1,2], deadE:[],
  steps:[
   ['<b>Phát hiện (vài chục giây):</b> health check của ALB target group fail với các target ở AZ-a → ALB lập tức ngừng chuyển request mới sang AZ-a. Người dùng gần như không cảm nhận được vì AZ-b vẫn khoẻ.','<b>検知（数十秒）：</b> ALB ターゲットグループのヘルスチェックが AZ-a のターゲットで失敗 → ALB は AZ-a への新規リクエストを即停止。AZ-b が正常なためユーザーはほぼ気づきません。'],
   ['<b>ASG phản ứng:</b> Auto Scaling nhận tín hiệu instance AZ-a không khoẻ, terminate chúng và launch máy thay thế ở AZ-b để bù capacity (khi AZ-b còn quota).','<b>ASG の反応：</b> Auto Scaling は AZ-a のインスタンス異常を検知し、終了して AZ-b に代替を起動します（クォータに空きがある場合）。'],
   ['<b>RDS Multi-AZ failover (≈60–120 giây):</b> mất kết nối tới Primary ở AZ-a → Standby ở AZ-b tự thăng cấp thành Primary, CNAME của endpoint lật sang máy mới nên app không phải đổi connection string. Các kết nối đang mở bị ngắt — app cần cơ chế retry.','<b>RDS Multi-AZ フェイルオーバー（約60〜120秒）：</b> AZ-a のプライマリと接続断 → AZ-b のスタンバイが自動昇格し、エンドポイントの CNAME が新しい側へ向くため接続文字列は不変。既存接続は切れるため、アプリ側のリトライが必要です。'],
   ['<b>Kết quả:</b> hệ thống chạy tiếp trên 1 AZ (tạm mất dự phòng tới khi AZ-a hồi phục). HA không có nghĩa “không bao giờ lỗi” — mà là lỗi trong một vùng chịu lỗi không kéo sập toàn hệ thống.','<b>結果：</b> システムは1 AZ で稼働継続（一時的に冗長性は喪失）。HA とは「決して壊れない」ことではなく、1つの障害ドメインの障害が全体を巻き込まないことです。']]},
 gcp:{btn:['Giả lập sự cố: sập zone-a','障害シミュレーション：ゾーン a がダウン'],
  cap:['⚠ Zone-a mất điện — Global LB dồn traffic sang zone còn lại · Cloud SQL HA failover','⚠ ゾーン a が停電 — グローバル LB が残りのゾーンへ · Cloud SQL HA フェイルオーバー'],
  half:[2,3], badges:{2:['zone-a ✕','ゾーンa ✕'],3:['zone-a ✕','ゾーンa ✕']}, liveN:[0,1], liveE:[0,1,2], deadE:[],
  steps:[
   ['<b>Phát hiện:</b> health check của Global LB fail với backend ở zone-a → LB ngừng đưa traffic về zone đó. Cloud Run là service theo region chạy đa zone nên các instance ở zone còn lại gánh toàn bộ.','<b>検知：</b> グローバル LB のヘルスチェックがゾーン a のバックエンドで失敗 → そのゾーンへの振り分けを停止。Cloud Run はリージョンサービスとして複数ゾーンで動くため、残りのゾーンが全量を担います。'],
   ['<b>Cloud SQL regional HA failover:</b> instance chính ở zone-a mất → standby ở zone khác trong cùng region được thăng cấp. Địa chỉ IP private của instance được giữ nguyên nên app chỉ cần kết nối lại (kết nối cũ bị ngắt, cần retry).','<b>Cloud SQL リージョナル HA フェイルオーバー：</b> ゾーン a のプライマリが喪失 → 同一リージョン別ゾーンのスタンバイが昇格。インスタンスのプライベート IP は維持されるため、アプリは再接続するだけです（旧接続は切断、リトライ必須）。'],
   ['<b>Khác biệt với AWS:</b> GCP tổ chức HA theo zone bên trong một VPC toàn cầu — không phải dựng subnet/route riêng cho từng AZ như AWS.','<b>AWS との違い：</b> GCP はグローバル VPC の内側でゾーン単位に HA を構成します。AWS のように AZ 毎のサブネット/ルートは不要です。']]}},
a5:{aws:{btn:['Giả lập sự cố: sập Region Tokyo','障害シミュレーション：東京リージョンがダウン'],
  cap:['⚠ Region Tokyo gặp sự cố — Route 53 chuyển hướng sang DR Osaka · replica thăng cấp','⚠ 東京リージョン障害 — Route 53 が DR 大阪へ切替 · レプリカ昇格'],
  down:[0], badges:{0:['Region sập ✕','リージョン障害 ✕']}, liveN:[1,2,3,4], liveE:[1,2,3,4], deadE:[0],
  steps:[
   ['<b>Phát hiện:</b> Route 53 health check trỏ vào hệ thống Tokyo fail liên tiếp → bản ghi failover được kích hoạt.','<b>検知：</b> 東京系への Route 53 ヘルスチェックが連続失敗 → フェイルオーバーレコードが有効化されます。'],
   ['<b>Chuyển hướng:</b> DNS trả về đầu DR ở Osaka cho người dùng mới. TTL càng thấp chuyển càng nhanh (đổi lại là nhiều truy vấn DNS hơn) — vì vậy hãy hạ TTL trước mỗi đợt diễn tập/chuyển đổi lớn.','<b>切替：</b> 新規ユーザーの DNS は DR 大阪を返します。TTL が低いほど切替は速く（代償は DNS クエリ増）。大規模な切替や訓練の前には TTL を下げておきます。'],
   ['<b>Dữ liệu:</b> RDS cross-region replica ở Osaka được promote thành DB độc lập để hệ DR ghi/đọc bình thường; backup trong S3 cross-region là lớp khôi phục sâu hơn khi cần.','<b>データ：</b> 大阪の RDS クロスリージョンレプリカを独立 DB に昇格し、DR 側で通常の読み書きを再開。S3 クロスリージョンのバックアップはさらに深い復旧層です。'],
   ['<b>Bài học:</b> DR chỉ đáng tin khi đã diễn tập khôi phục thật — RTO/RPO phải lấy từ lần diễn tập gần nhất, không phải con số trên giấy.','<b>教訓：</b> DR は実際の復旧訓練をして初めて信頼できます。RTO/RPO は紙の数字ではなく、直近の訓練実績から取ること。']]},
 gcp:{btn:['Giả lập sự cố: sập Region Tokyo','障害シミュレーション：東京リージョンがダウン'],
  cap:['⚠ Region Tokyo gặp sự cố — Cloud DNS chuyển hướng sang DR Osaka · replica thăng cấp','⚠ 東京リージョン障害 — Cloud DNS が DR 大阪へ切替 · レプリカ昇格'],
  down:[0], badges:{0:['Region sập ✕','リージョン障害 ✕']}, liveN:[1,2,3], liveE:[1,2], deadE:[0],
  steps:[
   ['<b>Phát hiện & chuyển hướng:</b> Cloud DNS routing policy kèm health check phát hiện hệ thống Tokyo không khoẻ → trả về đầu DR ở Osaka cho các truy vấn mới.','<b>検知と切替：</b> Cloud DNS のルーティングポリシーとヘルスチェックが東京系の異常を検知 → 新規クエリには DR 大阪を返します。'],
   ['<b>Dữ liệu:</b> Cloud SQL cross-region replica ở Osaka được promote thành instance độc lập; snapshot và bucket dual-region là lớp dữ liệu dự phòng còn lại.','<b>データ：</b> 大阪の Cloud SQL クロスリージョンレプリカを独立インスタンスに昇格。スナップショットとデュアルリージョンバケットが残りのデータ保護層です。'],
   ['<b>Bài học:</b> giống phía AWS — DR chưa diễn tập restore thì chưa phải DR. Hãy ghi RTO/RPO đo được vào tài liệu vận hành.','<b>教訓：</b> AWS 側と同じく、リストア訓練をしていない DR は DR ではありません。実測した RTO/RPO を運用資料に残してください。']]}},
b14:{aws:{btn:['Giả lập sự cố: sập Region Tokyo','障害シミュレーション：東京リージョンがダウン'],
  cap:['⚠ Region Tokyo sập — 100% traffic dồn sang Singapore · Global Tables tiếp tục tại Singapore','⚠ 東京リージョン障害 — 全トラフィックはシンガポールへ · Global Tables はシンガポールで継続'],
  down:[2], badges:{2:['Region sập ✕','リージョン障害 ✕']}, liveN:[0,1,3,4,5], liveE:[0,2,4,5], deadE:[1,3],
  steps:[
   ['<b>Định tuyến:</b> Route 53 (latency-based + health check) đánh dấu endpoint Tokyo unhealthy → mọi người dùng, kể cả người ở gần Tokyo, được đưa sang Singapore: chấp nhận latency cao hơn thay vì downtime.','<b>ルーティング：</b> Route 53（遅延ベース＋ヘルスチェック）が東京エンドポイントを異常と判定 → 東京に近いユーザーも含め全員がシンガポールへ。ダウンタイムの代わりに遅延増を受け入れます。'],
   ['<b>Compute:</b> stack Singapore đang active sẵn (active–active) nên không có “thời gian dựng dự phòng” — chỉ cần đủ capacity gánh gấp đôi tải. Đây là lý do active–active đắt: cả hai phía đều phải sẵn sàng cho 100% tải.','<b>コンピュート：</b> シンガポール側は active-active で常時稼働中のため「予備を立てる時間」はありません。必要なのは2倍の負荷に耐える容量だけ。これが active-active が高額な理由です（両側が100%負荷に備える）。'],
   ['<b>Dữ liệu:</b> DynamoDB Global Tables nhân bản hai chiều: dữ liệu ghi ở Tokyo trước khi sập đã/đang đồng bộ sang Singapore. Xung đột khi ghi hai phía được xử lý last-writer-wins — nghiệp vụ phải được thiết kế để chịu được điều này.','<b>データ：</b> DynamoDB グローバルテーブルは双方向複製。障害前に東京で書かれたデータはシンガポールへ同期済み/同期中です。両側書き込みの競合は last-writer-wins で解決されるため、業務設計がそれを許容する必要があります。']]},
 gcp:{btn:['Giả lập sự cố: sập Region Tokyo','障害シミュレーション：東京リージョンがダウン'],
  cap:['⚠ Region Tokyo sập — Global LB rút backend Tokyo · Cloud Run Singapore gánh toàn bộ · Spanner giữ nhất quán','⚠ 東京リージョン障害 — グローバル LB が東京バックエンドを除外 · シンガポールが全量を処理 · Spanner が整合性を維持'],
  down:[2], badges:{2:['Region sập ✕','リージョン障害 ✕']}, liveN:[0,1,3,4], liveE:[0,2,4], deadE:[1,3],
  steps:[
   ['<b>Định tuyến:</b> Global LB anycast tự rút backend Tokyo khỏi vòng quay khi health check fail — người dùng vẫn gọi vào đúng một địa chỉ IP toàn cầu duy nhất, LB tự đưa họ sang Singapore.','<b>ルーティング：</b> グローバル LB（anycast）はヘルスチェック失敗で東京バックエンドを自動的に外します。ユーザーは同じ単一グローバル IP のままで、LB がシンガポールへ案内します。'],
   ['<b>Compute:</b> Cloud Run ở Singapore đang active sẵn và tự scale lên gấp đôi tải — không có bước “khởi động dự phòng”.','<b>コンピュート：</b> シンガポールの Cloud Run は常時アクティブで、2倍の負荷へ自動スケールします。「予備起動」の手順はありません。'],
   ['<b>Dữ liệu:</b> Cloud Spanner multi-region giữ tính nhất quán mạnh (strong consistency) xuyên region — khác DynamoDB Global Tables (nhất quán sau cùng), Spanner đổi lại bằng độ trễ ghi cao hơn và giá cao hơn.','<b>データ：</b> Cloud Spanner のマルチリージョンはリージョンをまたいだ強い整合性を保ちます。DynamoDB グローバルテーブル（結果整合性）と対照的で、代償は書き込み遅延と価格です。']]}}
};

/* ============================================================
   Engine gắn Tour + Sim vào từng thẻ sơ đồ (chạy lại sau mỗi
   lần renderLib vẽ lại — chuyển AWS/GCP, lọc, đổi ngôn ngữ)
   ============================================================ */
function dgById(id){ if(typeof DG==='undefined') return null; return DG.filter(function(x){ return x.id===id; })[0]||null; }
function variantKeyOf(card,did){
  var p=card.querySelector('svg.wires > path[id]');
  if(p){ var m=p.id.match(new RegExp('^w-'+did+'-(aws|gcp|multi)-\\d+')); if(m) return m[1]; }
  return null;
}
function clearStageFx(stage){
  stage.classList.remove('tour-on','sim-on');
  stage.querySelectorAll('.dg-node').forEach(function(n){ n.classList.remove('hl','fail','half','live'); });
  stage.querySelectorAll('svg.wires > path').forEach(function(p){ p.classList.remove('hl','dead','live'); });
  stage.querySelectorAll('svg.wires > circle.packet').forEach(function(c){ c.classList.remove('hl','dead','live'); });
  stage.querySelectorAll('.sim-badge').forEach(function(b){ b.remove(); });
  var bn=stage.querySelector('.sim-banner'); if(bn) bn.hidden=true;
}
function markEdges(stage,idxs,cls){
  var paths=stage.querySelectorAll('svg.wires > path'), circles=stage.querySelectorAll('svg.wires > circle.packet');
  idxs.forEach(function(i){ if(paths[i]) paths[i].classList.add(cls); if(circles[i]) circles[i].classList.add(cls); });
}
function decorateCard(card){
  var did=(card.id||'').replace(/^dg-/,''); if(!did) return;
  var d=dgById(did); if(!d) return;
  var key=variantKeyOf(card,did); if(!key) return;
  if(card.getAttribute('data-t3')===key) return;
  card.setAttribute('data-t3',key);
  var stage=card.querySelector('.dg-stage'); if(!stage) return;
  var tools=card.querySelector('.dg-tools'); if(!tools) return;
  var tour=getTour(d,key), sim=(SIMS[did]&&SIMS[did][key])||null;
  if(!tour&&!sim) return;
  var st={tourOn:false, simOn:false, idx:0};

  var banner=document.createElement('div'); banner.className='sim-banner'; banner.hidden=true; stage.appendChild(banner);
  var tourPanel=document.createElement('div'); tourPanel.className='dg-tour'; tourPanel.hidden=true;
  var simPanel=document.createElement('div'); simPanel.className='dg-sim'; simPanel.hidden=true;
  tools.parentNode.insertBefore(tourPanel,tools.nextSibling);
  tools.parentNode.insertBefore(simPanel,tourPanel.nextSibling);

  var tourBtn=null, simBtn=null;
  function exitTour(){ st.tourOn=false; if(tourBtn) tourBtn.classList.remove('tour-on-btn'); tourPanel.hidden=true; if(!st.simOn) clearStageFx(stage); }
  function exitSim(){ st.simOn=false; if(simBtn){ simBtn.classList.remove('sim-on-btn'); simBtn.innerHTML='⚠ '+E(pick(sim.btn)); } simPanel.hidden=true; if(!st.tourOn) clearStageFx(stage); }
  function applyStep(){
    clearStageFx(stage);
    stage.classList.add('tour-on');
    var step=tour[st.idx];
    var nodes=stage.querySelectorAll('.dg-node');
    step.n.forEach(function(i){ if(nodes[i]) nodes[i].classList.add('hl'); });
    markEdges(stage,step.e,'hl');
    var last=st.idx>=tour.length-1;
    tourPanel.innerHTML='<div class="tour-head"><span class="tour-count">🧭 '+L('Bước ','ステップ ')+(st.idx+1)+'/'+tour.length+'</span>'
      +'<span class="tour-nav"><button type="button" class="dg-btn" data-tp'+(st.idx===0?' disabled':'')+'>‹ '+L('Trước','前へ')+'</button>'
      +'<button type="button" class="dg-btn" data-tn'+(last?' disabled':'')+'>'+(last?('✓ '+L('Bước cuối','最終ステップ')):(L('Sau','次へ')+' ›'))+'</button>'
      +'<button type="button" class="dg-btn" data-tx>✕ '+L('Thoát tour','ツアーを終了')+'</button></span></div>'
      +'<h4>'+E(pick(step.t))+'</h4><p>'+E(pick(step.b))+'</p>'
      +(step.w?'<div class="tour-why"><b>❓ '+L('Vì sao? ','なぜ？ ')+'</b>'+E(pick(step.w))+'</div>':'');
    var bp=tourPanel.querySelector('[data-tp]'); if(bp) bp.addEventListener('click',function(){ if(st.idx>0){ st.idx--; applyStep(); } });
    var bn2=tourPanel.querySelector('[data-tn]'); if(bn2) bn2.addEventListener('click',function(){ if(st.idx<tour.length-1){ st.idx++; applyStep(); } });
    var bx=tourPanel.querySelector('[data-tx]'); if(bx) bx.addEventListener('click',exitTour);
  }
  function applySim(){
    clearStageFx(stage);
    stage.classList.add('sim-on');
    var nodes=stage.querySelectorAll('.dg-node');
    function badge(i,txt){ if(!nodes[i]||!txt) return; var s=document.createElement('span'); s.className='sim-badge'; s.textContent=txt; nodes[i].appendChild(s); }
    (sim.down||[]).forEach(function(i){ if(nodes[i]) nodes[i].classList.add('fail'); if(sim.badges) badge(i,pick(sim.badges[i]||['✕','✕'])); });
    (sim.half||[]).forEach(function(i){ if(nodes[i]) nodes[i].classList.add('half'); if(sim.badges) badge(i,pick(sim.badges[i]||['✕','✕'])); });
    (sim.liveN||[]).forEach(function(i){ if(nodes[i]) nodes[i].classList.add('live'); });
    markEdges(stage,sim.deadE||[],'dead');
    markEdges(stage,sim.liveE||[],'live');
    banner.textContent=pick(sim.cap); banner.hidden=false;
    simPanel.innerHTML='<div class="tour-head"><span class="tour-count">⚠ '+L('Đang giả lập sự cố','障害シミュレーション中')+'</span></div>'
      +'<h4>'+L('Diễn tiến failover — hệ thống tự cứu mình thế nào','フェイルオーバーの経過 — システムはどう自己回復するか')+'</h4>'
      +'<ol class="sim-steps">'+sim.steps.map(function(s){ return '<li>'+pick(s)+'</li>'; }).join('')+'</ol>'
      +'<div class="sim-actions"><button type="button" class="dg-btn" data-sx>↻ '+L('Khôi phục — tắt giả lập','復旧 — シミュレーションを終了')+'</button></div>';
    var bx=simPanel.querySelector('[data-sx]'); if(bx) bx.addEventListener('click',exitSim);
    simPanel.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  if(tour){
    tourBtn=document.createElement('button'); tourBtn.type='button'; tourBtn.className='dg-btn';
    tourBtn.innerHTML='▶ '+L('Chạy từng bước','ステップツアー');
    tourBtn.addEventListener('click',function(){
      if(st.tourOn){ exitTour(); return; }
      if(st.simOn) exitSim();
      st.tourOn=true; st.idx=0; tourBtn.classList.add('tour-on-btn'); tourPanel.hidden=false; applyStep();
      tourPanel.scrollIntoView({block:'nearest',behavior:'smooth'});
    });
    tools.appendChild(tourBtn);
  }
  if(sim){
    simBtn=document.createElement('button'); simBtn.type='button'; simBtn.className='dg-btn warn';
    simBtn.innerHTML='⚠ '+E(pick(sim.btn));
    simBtn.addEventListener('click',function(){
      if(st.simOn){ exitSim(); return; }
      if(st.tourOn) exitTour();
      st.simOn=true; simBtn.classList.add('sim-on-btn'); simBtn.innerHTML='⚠ '+L('Đang giả lập — bấm để khôi phục','シミュレーション中 — クリックで復旧');
      simPanel.hidden=false; applySim();
    });
    tools.appendChild(simBtn);
  }
}
function decorateDiagrams(){
  var page=$('archLibPage'); if(!page) return;
  page.querySelectorAll('.dg-card').forEach(decorateCard);
}
try{
  decorateDiagrams();
  var archPage=$('archLibPage');
  if(archPage) new MutationObserver(function(){ decorateDiagrams(); }).observe(archPage,{childList:true});
}catch(e){}

/* ---- Khởi tạo + đổi ngôn ngữ: vẽ lại các khối Đợt 3 ---- */
try{ navLabels3(); routeMine(); }catch(e){}
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      try{ navLabels3(); }catch(e){}
      try{ renderPricing(); }catch(e){}
      try{ renderDecisions(); }catch(e){}
    },80);
  });
});
})();
