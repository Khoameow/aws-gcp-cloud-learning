/* ============================================================
   upgrade2.js — ĐỢT 2 (theo bản đánh giá Gemini), tập trung LABS:
   1 · Nhãn chi phí ước tính trên thẻ lab + đầu trang chi tiết lab
       (suy ra từ tài nguyên thật lab tạo, kèm nguồn phí chính)
   2 · Khung "Top 3 lỗi hay gặp" đặc thù từng lab ở cuối trang
       chi tiết: hiện tượng · nguyên nhân · lệnh kiểm tra/khắc phục
   3 · Khung "Dọn dẹp 1-Click": một khối lệnh xoá duy nhất theo
       đúng thứ tự phụ thuộc an toàn + checklist kiểm tra hoá đơn
   4 · Đánh dấu "Đã làm xong lab này" (localStorage, try/catch như
       Flow Học) trên thẻ lab + trang chi tiết; thanh tiến độ
       x/21 lab ở đầu trang Labs; thẻ đã xong có viền + huy hiệu.
   Nạp SAU upgrade1.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function ja(){ return window.LANG==='ja'; }
function L(vi,jaT){ return (window.LANG==='ja'&&jaT)?jaT:vi; }
function pick(pair){ return (window.LANG==='ja'&&pair[1])?pair[1]:pair[0]; }

/* ================= TRẠNG THÁI HOÀN THÀNH (localStorage) ================= */
var DKEY='khoameow_labdone_v1';
var LDONE={};
try{ var __raw=localStorage.getItem(DKEY); if(__raw) LDONE=JSON.parse(__raw)||{}; }catch(e){ LDONE={}; }
function saveDone(){ try{ localStorage.setItem(DKEY, JSON.stringify(LDONE)); }catch(e){} }
function keyOf(kind,idx){ return (kind==='mig'?'mig':'lab')+idx; }
function totalLabs(){ var a=(typeof LABS!=='undefined'&&LABS)?LABS.length:12, b=(typeof MIGS!=='undefined'&&MIGS)?MIGS.length:9; return a+b; }
function doneCount(){ var n=0; for(var k in LDONE){ if(LDONE[k]) n++; } return n; }

/* ================= DỮ LIỆU ĐỢT 2 CHO 21 LAB =================
   cost: [nhãn VI, nhãn JA] · src: nguồn phí chính [VI, JA]
   pit: 3 lỗi {t:[hiện tượng], c:[nguyên nhân + xử lý], cmd}
   clean: {aws, gcp} script xoá theo thứ tự phụ thuộc an toàn
   bill: checklist kiểm tra hoá đơn [[VI,JA] × 4]              */
var LAB2={

/* ---------- Lab 1 · VPC hai cloud ---------- */
lab0:{
 cost:['~$0.10 cho ~1 giờ làm (cả 2 cloud)','~$0.10 / 約1時間の実施（両クラウド）'],
 src:['Nguồn phí chính: NAT Gateway phía AWS (~$0.045/giờ + phí xử lý GB) và Cloud NAT phía GCP (~$0.045/giờ). EC2 kiểm chứng dùng t3.micro thuộc Free Tier. Để NAT chạy qua đêm là lỗi tốn tiền kinh điển nhất của lab này.','主な課金源：AWS 側 NAT Gateway（約$0.045/時＋GB処理料）と GCP 側 Cloud NAT（約$0.045/時）。検証用 EC2（t3.micro）は無料枠内。NAT の一晩放置がこのラボ最大の課金事故です。'],
 pit:[
  {t:['Private subnet không ra được internet dù đã tạo NAT Gateway','NAT Gateway を作ったのにプライベートサブネットから外に出られない'],
   c:['Route table của private subnet chưa có route 0.0.0.0/0 → NAT, hoặc route table chưa associate đúng subnet. Debug mạng luôn bắt đầu từ route table trước (Route → SG → NACL).','プライベート側ルートテーブルに 0.0.0.0/0 → NAT のルートがない、または関連付け違い。ネットワークの切り分けはルートテーブルから（Route → SG → NACL の順）。'],
   cmd:'aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-xxxx'},
  {t:['NAT Gateway kẹt ở trạng thái pending rất lâu hoặc báo lỗi khi tạo','NAT Gateway が pending のまま、または作成エラーになる'],
   c:['NAT Gateway bắt buộc nằm ở public subnet (nơi có route ra IGW) và cần 1 Elastic IP đã allocate sẵn. Đặt NAT vào private subnet là lỗi phổ biến nhất — phải xoá NAT tạo lại ở public subnet, không sửa tại chỗ được.','NAT Gateway はパブリックサブネット（IGW へのルートがある場所）が必須で、確保済み Elastic IP が必要です。プライベート側に置いたら削除して作り直します（後から直せません）。'],
   cmd:'aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=vpc-xxxx'},
  {t:['Phía GCP: VM private vẫn không ra internet dù đã tạo Cloud NAT','GCP 側：Cloud NAT を作ってもプライベート VM が外に出られない'],
   c:['Cloud NAT phải gắn vào một Cloud Router cùng region, và nếu VM dùng dải IP phụ (secondary range) thì NAT phải áp cho mọi dải — chọn --nat-all-subnet-ip-ranges khi tạo. Kiểm tra mapping đã chứa VM của bạn chưa.','Cloud NAT は同リージョンの Cloud Router へのアタッチが必須です。VM がセカンダリ範囲を使う場合は --nat-all-subnet-ip-ranges を選択し、マッピングに対象 VM が含まれるか確認してください。'],
   cmd:'gcloud compute routers nats describe nat-tokyo --router=router-tokyo --region=asia-northeast1'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 1: VPC nền (chạy trong AWS CloudShell) ===\nVPC_ID=vpc-xxxxxxxxxxxxxxxxx\nNAT_ID=$(aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=$VPC_ID Name=state,Values=available --query \'NatGateways[0].NatGatewayId\' --output text)\nEIP_ALLOC=$(aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=$VPC_ID --query \'NatGateways[0].NatGatewayAddresses[0].AllocationId\' --output text)\n# 1) Xoá NAT Gateway TRƯỚC (mất vài phút mới chuyển sang deleted)\naws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID\n# 2) Chờ NAT xoá xong mới release Elastic IP (EIP còn gắn sẽ release lỗi)\nwhile [ "$(aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query \'NatGateways[0].State\' --output text 2>/dev/null)" = "deleting" ]; do sleep 15; done\naws ec2 release-address --allocation-id $EIP_ALLOC\n# 3) Tháo rồi xoá Internet Gateway\nIGW_ID=$(aws ec2 describe-internet-gateways --filters Name=attachment.vpc-id,Values=$VPC_ID --query \'InternetGateways[0].InternetGatewayId\' --output text)\naws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID\naws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID\n# 4) Xoá subnet, cuối cùng mới xoá VPC\nfor SN in $(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID --query \'Subnets[].SubnetId\' --output text); do aws ec2 delete-subnet --subnet-id $SN; done\naws ec2 delete-vpc --vpc-id $VPC_ID',
  gcp:'# === Google Cloud cleanup — Lab 1: VPC nền (chạy trong Cloud Shell) ===\nREGION=asia-northeast1\n# 1) Xoá Cloud NAT rồi mới xoá Cloud Router\n#    (tên router/nat thay bằng tên bạn đã đặt ở bước làm lab)\ngcloud compute routers nats delete nat-tokyo --router=router-tokyo --region=$REGION --quiet\ngcloud compute routers delete router-tokyo --region=$REGION --quiet\n# 2) Xoá các firewall rule tự tạo của lab trong network này\ngcloud compute firewall-rules list --filter="network:prod-net"   # xem lại tên rule trước khi xoá\ngcloud compute firewall-rules delete TEN-FIREWALL-RULE-CUA-LAB --quiet\n# 3) Xoá subnet, cuối cùng xoá VPC (custom mode bắt buộc thứ tự này)\ngcloud compute networks subnets delete tokyo-app --region=$REGION --quiet\ngcloud compute networks delete prod-net --quiet'
 },
 bill:[
  ['Cost Explorer (AWS): lọc dịch vụ VPC / NAT Gateway — không còn usage NatGateway phát sinh sau thời điểm cleanup.','コストエクスプローラー（AWS）で NAT Gateway の利用が cleanup 後も発生していないか確認する。'],
  ['EC2 Console → Elastic IPs: không còn địa chỉ nào ở trạng thái chưa gắn — EIP để trống vẫn bị tính phí theo giờ.','EC2 コンソール → Elastic IP：未割り当てのアドレスが残っていないか（未使用 EIP も時間課金されます）。'],
  ['GCP Billing → Reports: lọc Cloud NAT / Network — xác nhận không còn dòng phí Cloud NAT của project học tập.','GCP Billing → レポート：学習プロジェクトに Cloud NAT の課金行が残っていないか確認する。'],
  ['Đặt cảnh báo ngân sách thấp (AWS Budgets / GCP Billing Alert, mức $1–5) để lần học sau có quên xoá cũng được báo ngay.','次回に備えて低額（$1〜5）の予算アラート（AWS Budgets / GCP 課金アラート）を設定する。']
 ]
},

/* ---------- Lab 2 · EC2 vs Compute Engine ---------- */
lab1:{
 cost:['$0.00 (trong Free Tier) – ~$0.05 cho ~1 giờ',' $0.00（無料枠内）〜 ~$0.05 / 約1時間'],
 src:['EC2 t3.micro thuộc Free Tier 750 giờ/tháng của tài khoản mới; GCE e2-medium (~$0.03–0.045/giờ ở Tokyo) là nguồn phí chính nếu làm quá giờ hoặc quên tắt VM.','EC2 t3.micro は新規アカウントの無料枠（750時間/月）内。GCE e2-medium（東京で約$0.03〜0.045/時）が、時間超過や消し忘れ時の主な課金源です。'],
 pit:[
  {t:['Mở trình duyệt vào public IP/DNS của EC2 bị timeout dù instance đang running','EC2 が running なのにパブリック IP/DNS へブラウザ接続がタイムアウトする'],
   c:['99% là Security Group chưa mở cổng 80 inbound, hoặc mở nhưng gõ nhầm source. SG là stateful nên chỉ cần kiểm inbound; kiểm thêm nginx đã chạy chưa bằng systemctl.','99%は Security Group のインバウンド 80 未開放、または送信元の指定ミスです。SG はステートフルなのでインバウンド確認で十分。あわせて systemctl で nginx の稼働も確認。'],
   cmd:'aws ec2 describe-security-groups --group-ids sg-xxxx   # và trên máy: sudo systemctl status nginx'},
  {t:['SSH vào EC2 báo "Connection timed out" hoặc "Permission denied (publickey)"','EC2 への SSH が "Connection timed out" または "Permission denied (publickey)" になる'],
   c:['Timeout = đường mạng/SG cổng 22 chưa mở cho IP của bạn (IP nhà thay đổi là hay gặp). Permission denied = sai key pair, sai user (Amazon Linux là ec2-user) hoặc file .pem chưa chmod 400.','タイムアウト＝22番が自分の IP に開いていない（自宅 IP の変化が頻発）。Permission denied＝キーペア違い、ユーザー名違い（Amazon Linux は ec2-user）、.pem の chmod 400 漏れ。'],
   cmd:'chmod 400 lab-key.pem && ssh -i lab-key.pem ec2-user@<public-dns>'},
  {t:['Phía GCP: VM đã gắn tag http-server nhưng web vẫn không vào được','GCP 側：http-server タグを付けたのに Web に入れない'],
   c:['Firewall rule của GCP áp theo target tag — kiểm tra rule đã bật, đúng network, và tag trên VM khớp từng ký tự (http-server ≠ httpserver). Rule mặc định implied deny sẽ chặn mọi thứ không khớp.','GCP のファイアウォールはターゲットタグで適用されます。ルールの有効化・ネットワーク・タグの完全一致（http-server ≠ httpserver）を確認。デフォルトの implied deny が不一致を全て遮断します。'],
   cmd:'gcloud compute firewall-rules list --filter="network:prod-net" && gcloud compute instances describe web-1 --zone=asia-northeast1-a --format="get(tags.items)"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 2: EC2 web server ===\nINSTANCE_ID=i-xxxxxxxxxxxxxxxxx\n# 1) Terminate instance TRƯỚC (volume root tự xoá theo mặc định của lab)\naws ec2 terminate-instances --instance-ids $INSTANCE_ID\naws ec2 wait instance-terminated --instance-ids $INSTANCE_ID\n# 2) Xoá AMI golden image tự chụp: deregister AMI rồi xoá snapshot đi kèm\nAMI_ID=ami-xxxxxxxxxxxxxxxxx\nSNAP_ID=$(aws ec2 describe-images --image-ids $AMI_ID --query \'Images[0].BlockDeviceMappings[0].Ebs.SnapshotId\' --output text)\naws ec2 deregister-image --image-id $AMI_ID\naws ec2 delete-snapshot --snapshot-id $SNAP_ID\n# 3) Xoá key pair và security group của lab\naws ec2 delete-key-pair --key-name lab-key\naws ec2 delete-security-group --group-id sg-xxxxxxxxxxxxxxxxx',
  gcp:'# === Google Cloud cleanup — Lab 2: Compute Engine web server ===\nZONE=asia-northeast1-a\n# 1) Xoá VM trước\ngcloud compute instances delete web-1 --zone=$ZONE --quiet\n# 2) Xoá machine image golden tự tạo và firewall rule của lab\ngcloud compute machine-images delete web-golden --quiet\ngcloud compute firewall-rules delete allow-http-lab --quiet\n# 3) Nếu đã tạo service account riêng cho lab thì xoá luôn\ngcloud iam service-accounts delete web-vm@PROJECT_ID.iam.gserviceaccount.com --quiet'
 },
 bill:[
  ['EC2 Console → Instances: lọc trạng thái running — không còn VM nào của lab đang chạy (kể cả ở region khác nếu bạn từng đổi region).','EC2 コンソール → インスタンス：running 状態でラボ用 VM が残っていないか（リージョン違いも確認）。'],
  ['GCE Console → VM instances: xác nhận web-1 đã biến mất; kiểm thêm mục Disks — đĩa orphan không gắn VM vẫn tính phí.','GCE コンソール → VM インスタンス：web-1 が消えたか確認。Disks で VM 未接続の孤立ディスクも課金対象なので確認。'],
  ['EBS Snapshots / GCP Snapshots: snapshot của golden image đã xoá hẳn chưa — snapshot là khoản phí “âm thầm” hay sót nhất.','EBS スナップショット / GCP スナップショット：ゴールデンイメージのスナップショットが削除済みか（最も残りやすい隠れ課金）。'],
  ['Cost Explorer / GCP Billing hôm sau: tổng phí lab này phải dừng ở mức vài cent — tăng tiếp nghĩa là còn tài nguyên chạy.','翌日の Cost Explorer / GCP Billing：このラボの費用が数セントで止まっているか。増え続けるなら残存リソースあり。']
 ]
},

/* ---------- Lab 3 · S3 + CloudFront vs Cloud Storage + Cloud CDN ---------- */
lab2:{
 cost:['$0.00 – ~$0.03 cho 1 buổi làm',' $0.00 〜 ~$0.03 / 1回の実施'],
 src:['S3 + CloudFront nằm gần như trọn trong Free Tier ở quy mô lab. Phía GCP, Global Load Balancer tính phí forwarding rule theo giờ (~$0.025/giờ) — là khoản cần xoá ngay sau khi làm xong.','S3 と CloudFront はラボ規模ならほぼ無料枠内。GCP 側はグローバル LB の転送ルールが時間課金（約$0.025/時）なので、終わったらすぐ削除してください。'],
 pit:[
  {t:['Vào domain CloudFront báo AccessDenied / 403 dù đã upload index.html lên S3','ファイルは上げたのに CloudFront のドメインで AccessDenied / 403 になる'],
   c:['Thiếu bucket policy cho Origin Access Control (OAC), hoặc policy ghi sai ARN của distribution. Kiểm tra policy có Principal là cloudfront.amazonaws.com kèm điều kiện SourceArn đúng distribution chưa.','Origin Access Control（OAC）用のバケットポリシー不足、またはディストリビューション ARN の記載ミス。Principal が cloudfront.amazonaws.com で SourceArn 条件が正しいか確認。'],
   cmd:'aws s3api get-bucket-policy --bucket my-web-assets'},
  {t:['Gắn chứng chỉ ACM cho CloudFront bị báo không hợp lệ / không chọn được','CloudFront に ACM 証明書を付けようとすると無効と言われる'],
   c:['CloudFront chỉ nhận chứng chỉ ACM ở region us-east-1 — chứng chỉ tạo ở Tokyo sẽ không xuất hiện. Tạo lại cert ở us-east-1, validate DNS, rồi mới gắn vào distribution.','CloudFront が受け付ける ACM 証明書は us-east-1 のものだけです。東京で作った証明書は表示されません。us-east-1 で作り直して DNS 検証後にアタッチ。'],
   cmd:'aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[].DomainName"'},
  {t:['Phía GCP: LB báo lỗi 502 hoặc backend bucket trả 404 dù file đã có trong bucket','GCP 側：LB が 502、またはバケットにファイルがあるのに 404 になる'],
   c:['Backend bucket chưa bật Cloud CDN đúng cách hoặc URL map trỏ sai backend; 404 thường do object tên khác (index.html ở thư mục con). Kiểm tra backend service và đường dẫn object thực tế trong bucket.','バックエンドバケットの Cloud CDN 有効化漏れ、または URL マップの向き先ミス。404 はオブジェクト名・配置（サブフォルダ内の index.html）の食い違いが典型です。バックエンドサービスと実際のオブジェクトパスを確認。'],
   cmd:'gcloud compute backend-services list && gcloud storage ls gs://TEN-BUCKET/**'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 3: S3 + CloudFront ===\nDIST_ID=Exxxxxxxxxxxxx\n# 1) CloudFront: phải TẮT (disable) distribution trước, chờ Deployed mới xoá được\n#    (thao tác disable làm trên Console: Distribution → Disable; hoặc sửa Enabled=false qua CLI)\naws cloudfront get-distribution-config --id $DIST_ID   # ghi lại ETag để dùng khi update/delete\n#    Sau khi distribution đã disabled & deployed xong:\n#    aws cloudfront delete-distribution --id $DIST_ID --if-match <ETag>\n# 2) Xoá sạch object rồi mới xoá bucket (bucket còn object sẽ xoá lỗi)\naws s3 rm s3://my-web-assets --recursive\naws s3 rb s3://my-web-assets\n# 3) Xoá chứng chỉ ACM (chỉ xoá được khi không còn distribution nào dùng)\naws acm delete-certificate --region us-east-1 --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/xxxx',
  gcp:'# === Google Cloud cleanup — Lab 3: Cloud Storage + Cloud CDN / Global LB ===\n# Xoá theo thứ tự ngược lúc tạo: forwarding rule → proxy → URL map → backend\n# 1) Global forwarding rule\ngcloud compute forwarding-rules delete web-lb-fr --global --quiet\n# 2) Target HTTPS proxy + chứng chỉ SSL\ngcloud compute target-https-proxies delete web-lb-proxy --global --quiet\ngcloud compute ssl-certificates delete web-cert --global --quiet\n# 3) URL map và backend bucket (Cloud CDN nằm trên backend này)\ngcloud compute url-maps delete web-lb-map --global --quiet\ngcloud compute backend-buckets delete web-backend --quiet\n# 4) Xoá bucket cùng toàn bộ object\n#    gcloud storage rm -r gs://TEN-BUCKET'
 },
 bill:[
  ['GCP Billing: lọc Cloud Load Balancing — forwarding rule là phí theo giờ, phải biến mất ngay sau cleanup; còn thấy charge giờ sau là chưa xoá hết.','GCP Billing で Cloud Load Balancing を確認：転送ルールは時間課金なので cleanup 直後に消えるべき。残っていたら削除漏れ。'],
  ['CloudFront Console: distribution ở trạng thái Disabled rồi Deleted; S3 Console: bucket đã không còn trong danh sách.','CloudFront コンソール：ディストリビューションが Disabled → Deleted に。S3 コンソール：バケットが一覧から消えているか。'],
  ['ACM (us-east-1): chứng chỉ của lab không còn — cert tự nó miễn phí nhưng để sót sẽ lẫn với cert thật sau này.','ACM（us-east-1）：ラボ用証明書が残っていないか（証明書自体は無料ですが、本番用と混ざる原因になります）。'],
  ['Route 53 / Cloud DNS: gỡ bản ghi domain phụ trỏ về distribution/LB của lab để tránh trỏ vào tài nguyên đã xoá.','Route 53 / Cloud DNS：削除済みリソースを指すラボ用レコードを外す。']
 ]
},

/* ---------- Lab 4 · RDS vs Cloud SQL ---------- */
lab3:{
 cost:['~$0.15–0.30 nếu chạy khoảng 2 giờ rồi xoá','~$0.15〜0.30 / 約2時間動かして削除した場合'],
 src:['Nguồn phí chính: RDS chạy Multi-AZ (tính gấp đôi instance, cỡ nhỏ ~$0.034–0.07/giờ cho cả cặp) và Cloud SQL REGIONAL (HA). Database là nhóm “quên tắt qua đêm = mất vài USD” điển hình — làm xong xoá ngay.','主な課金源：Multi-AZ の RDS（インスタンス2台分、小型で約$0.034〜0.07/時）と REGIONAL（HA）構成の Cloud SQL。データベースは「一晩放置で数ドル」の典型 — 終わったら即削除。'],
 pit:[
  {t:['EC2 trong private subnet không kết nối được RDS — psql treo rồi timeout','プライベートサブネットの EC2 から RDS に接続できない（psql がタイムアウト）'],
   c:['Security Group của RDS chưa cho phép cổng 5432 từ Security Group của EC2. Cách đúng là source = SG của app (không mở 0.0.0.0/0). Kiểm tra thêm route: hai phía phải cùng VPC và DB subnet group gồm đúng các private subnet.','RDS の Security Group が EC2 の SG からの 5432 を許可していない。送信元はアプリの SG を指定するのが正解（0.0.0.0/0 は不可）。同一 VPC か、DB サブネットグループにプライベートサブネットが入っているかも確認。'],
   cmd:'aws rds describe-db-instances --db-instance-identifier prod-db --query "DBInstances[0].VpcSecurityGroups"'},
  {t:['Kết nối vào được nhưng ghi dữ liệu thất bại / đọc thấy dữ liệu cũ','接続はできるが書き込み失敗 / 古いデータが読める'],
   c:['Bạn đang nối vào reader endpoint (chỉ đọc) thay vì writer/cluster endpoint. Multi-AZ và Aurora đều có endpoint riêng cho ghi và đọc — đối chiếu endpoint trong output describe với connection string.','書き込み不可は reader エンドポイントへの接続が原因です。Multi-AZ / Aurora は書き込み用と読み取り用でエンドポイントが別 — describe の出力と接続文字列を照合してください。'],
   cmd:'aws rds describe-db-instances --db-instance-identifier prod-db --query "DBInstances[0].Endpoint"'},
  {t:['Phía GCP: tạo Cloud SQL với private IP báo lỗi "networks not connected" / không cấp được IP nội bộ','GCP 側：プライベート IP で Cloud SQL を作ると "networks not connected" エラー'],
   c:['Chưa thiết lập Private Services Access: phải allocate một dải IP và tạo VPC peering cho servicenetworking.googleapis.com TRƯỚC khi tạo instance có private IP. Làm xong hai bước đó mới tạo lại instance.','Private Services Access の事前設定不足です。IP 範囲の割り当てと servicenetworking.googleapis.com への VPC ピアリングを先に作ってから、プライベート IP のインスタンスを作成してください。'],
   cmd:'gcloud services vpc-peerings list --network=prod-net && gcloud sql instances describe prod-db --format="get(ipAddresses)"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 4: RDS ===\n# 1) Xoá DB instance TRƯỚC — bỏ qua final snapshot để không tốn phí lưu trữ snapshot\naws rds delete-db-instance --db-instance-identifier prod-db --skip-final-snapshot\naws rds wait db-instance-deleted --db-instance-identifier prod-db\n# 2) Xoá DB subnet group (chỉ xoá được khi không còn instance nào dùng)\naws rds delete-db-subnet-group --db-subnet-group-name prod-db-subnets\n# 3) Xoá security group riêng của DB (SG mặc định của VPC thì giữ)\naws ec2 delete-security-group --group-id sg-xxxxxxxxxxxxxxxxx',
  gcp:'# === Google Cloud cleanup — Lab 4: Cloud SQL ===\n# 1) Xoá instance TRƯỚC (backup tự động theo instance cũng bị xoá theo)\ngcloud sql instances delete prod-db --quiet\n# 2) Dọn Private Services Access nếu chỉ dùng cho lab này:\n#    ngắt peering rồi xoá dải IP đã allocate\ngcloud services vpc-peerings disconnect --service=servicenetworking.googleapis.com --network=prod-net\ngcloud compute addresses delete psa-range --global --quiet'
 },
 bill:[
  ['RDS Console → Databases: danh sách trống; mục Snapshots: không có snapshot thủ công nào của lab còn lưu (snapshot tính phí theo GB-tháng).','RDS コンソール → Databases：一覧が空。Snapshots：ラボの手動スナップショットが残っていないか（GB/月で課金）。'],
  ['Cloud SQL Console: instance prod-db đã biến mất; GCP Billing lọc Cloud SQL phải ngừng tăng sau giờ cleanup.','Cloud SQL コンソール：prod-db が消えていること。GCP Billing の Cloud SQL 課金が cleanup 後に止まっていること。'],
  ['Nếu từng bật backup/PITR để thử: xác nhận backup cũng bị xoá cùng instance — backup mồ côi vẫn âm thầm tính phí.','バックアップ/PITR を試した場合：インスタンス削除と一緒にバックアップも消えたか（孤立バックアップも課金されます）。'],
  ['Đặt Budgets/Billing Alert riêng cho nhóm Database nếu bạn hay làm lab DB — đây là nhóm phí cao nhất trong các lab cơ bản.','DB 系ラボをよくやる場合は Database 向けの予算アラートを別途設定（基礎ラボで最も高額なグループです）。']
 ]
},

/* ---------- Lab 5 · Lambda + API Gateway vs Cloud Run functions ---------- */
lab4:{
 cost:['$0.00 (trong Free Tier)',' $0.00（無料枠内）'],
 src:['Lambda + API Gateway và Cloud Run functions đều nằm trong Free Tier ở mức request của lab (Lambda: 1 triệu request/tháng miễn phí). Khoản duy nhất cần để mắt là log CloudWatch/Cloud Logging nếu bạn gọi test quá nhiều — vẫn ở mức vài cent.','Lambda＋API Gateway も Cloud Run functions も、ラボ程度のリクエストなら無料枠内（Lambda は月100万リクエスト無料）。唯一の注意は大量テスト時のログ料金で、それでも数セント程度です。'],
 pit:[
  {t:['Gọi API Gateway trả 502 Bad Gateway dù test trực tiếp Lambda thì chạy được','Lambda 単体では動くのに API Gateway 経由だと 502 Bad Gateway'],
   c:['Lambda trả response sai format cho proxy integration (thiếu statusCode/body dạng JSON string) hoặc API Gateway chưa có quyền gọi Lambda (thiếu lambda permission). Test payload chuẩn: {"statusCode":200,"body":"..."} .','プロキシ統合向けのレスポンス形式ミス（statusCode / JSON文字列の body 不足）、または API Gateway から Lambda を呼ぶ権限（lambda permission）不足。標準形は {"statusCode":200,"body":"..."} です。'],
   cmd:'aws lambda get-policy --function-name api-fn   # xem API Gateway đã được cấp quyền invoke chưa'},
  {t:['Lambda báo lỗi timeout sau 3 giây dù code rất nhẹ','軽いコードなのに Lambda が3秒でタイムアウトする'],
   c:['Timeout mặc định của Lambda chỉ 3 giây và lab yêu cầu đặt 10s — khả năng cao bạn chưa tăng timeout, hoặc hàm bị kẹt vì nằm trong VPC mà subnet không có đường ra (thiếu NAT/endpoint). Tăng timeout và kiểm tra cấu hình VPC của hàm.','Lambda のデフォルトタイムアウトは3秒で、このラボでは10秒に上げる前提 — 未変更か、VPC 内の関数が出口なしサブネットで詰まっている可能性。タイムアウトを上げ、関数の VPC 設定を確認。'],
   cmd:'aws lambda get-function-configuration --function-name api-fn --query "{Timeout:Timeout,Memory:MemorySize,Vpc:VpcConfig.VpcId}"'},
  {t:['Phía GCP: deploy function xong nhưng curl vào URL bị 403 Forbidden','GCP 側：関数をデプロイできたのに URL へ curl すると 403 Forbidden'],
   c:['Cloud Run functions (thế hệ 2) mặc định yêu cầu xác thực — đây là hành vi đúng, không phải lỗi. Muốn public thì deploy kèm --allow-unauthenticated; muốn giữ riêng tư thì curl kèm identity token như trong bước lab.','Cloud Run functions（第2世代）はデフォルトで認証必須 — これは正常な挙動です。公開するなら --allow-unauthenticated、非公開ならラボ手順通り ID トークン付きで curl してください。'],
   cmd:'gcloud functions describe api --region=asia-northeast1 --format="get(serviceConfig.uri)" && curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" <URL>'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 5: Lambda + API Gateway ===\nAPI_ID=xxxxxxxxxx\n# 1) Xoá API trước (HTTP API trên API Gateway v2)\naws apigatewayv2 delete-api --api-id $API_ID\n# 2) Xoá Lambda function\naws lambda delete-function --function-name api-fn\n# 3) Xoá execution role: gỡ policy đính kèm rồi mới xoá role\naws iam detach-role-policy --role-name api-fn-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole\naws iam delete-role --role-name api-fn-role\n# 4) Xoá log group (để lại sẽ vẫn tính phí lưu trữ log rất nhỏ nhưng nên dọn)\naws logs delete-log-group --log-group-name /aws/lambda/api-fn',
  gcp:'# === Google Cloud cleanup — Lab 5: Cloud Run functions ===\nREGION=asia-northeast1\n# 1) Xoá function (bản chất là Cloud Run service phía sau)\ngcloud functions delete api --region=$REGION --quiet\n# 2) Nếu lab có dựng API Gateway của GCP thì xoá theo thứ tự gateway → config → api\ngcloud api-gateway gateways delete lab-gw --location=$REGION --quiet\ngcloud api-gateway api-configs delete lab-cfg --api=lab-api --quiet\ngcloud api-gateway apis delete lab-api --quiet\n# 3) Xoá image build tạm trong Artifact Registry nếu có (repo _cloud-run)\n#    gcloud artifacts docker images list asia-northeast1-docker.pkg.dev/PROJECT_ID/_cloud-run'
 },
 bill:[
  ['Lambda & Cloud Run functions: phí tính theo request — sau cleanup, Cost Explorer/GCP Billing của hai dịch vụ này phải đứng ở $0.00.','Lambda と Cloud Run functions はリクエスト課金：cleanup 後は両サービスの請求が $0.00 で止まること。'],
  ['API Gateway (AWS) / API Gateway (GCP): xác nhận API đã xoá khỏi danh sách — API để trống không tốn phí nhưng xoá để tránh lẫn lộn về sau.','API Gateway（AWS/GCP）：API が一覧から消えたか（空の API は無課金ですが、混同防止のため削除）。'],
  ['CloudWatch Logs / Cloud Logging: log group của lab đã xoá hoặc đã đặt retention ngắn — log là phí lưu trữ tích lũy theo thời gian.','CloudWatch Logs / Cloud Logging：ラボ用ロググループを削除済み、または保持期間を短く設定（ログは時間とともに積み上がる保管料）。'],
  ['Tổng chi phí lab này kỳ vọng: $0.00 — nếu thấy số khác 0, thủ phạm thường là log hoặc request test số lượng lớn.','このラボの想定総額は $0.00 — 0 でない場合はログか大量テストリクエストが原因のことが多いです。']
 ]
},

/* ---------- Lab 6 · ECS Fargate vs Cloud Run ---------- */
lab5:{
 cost:['~$0.10–0.20 nếu chạy khoảng 2 giờ rồi xoá','~$0.10〜0.20 / 約2時間動かして削除した場合'],
 src:['Nguồn phí chính phía AWS: ALB (~$0.0225/giờ) + 2 task Fargate 0.5 vCPU/1GB (~$0.024/giờ/task). Phía GCP, Cloud Run tính theo request/CPU-giây và có Free Tier rộng — gần như $0 ở quy mô lab.','AWS 側の主因：ALB（約$0.0225/時）＋ Fargate タスク2台 0.5vCPU/1GB（約$0.024/時/タスク）。GCP 側の Cloud Run はリクエスト/CPU秒課金で無料枠が広く、ラボ規模ではほぼ $0 です。'],
 pit:[
  {t:['ECS task cứ khởi động rồi dừng (stopped) với lỗi CannotPullContainerError','ECS タスクが CannotPullContainerError で起動→停止を繰り返す'],
   c:['Task ở private subnet không có đường ra internet/endpoint để kéo image từ ECR: thiếu NAT Gateway hoặc thiếu VPC endpoint (ECR api/dkr + S3). Kiểm tra tab "Stopped tasks" để đọc đúng thông điệp lỗi thay vì đoán.','プライベートサブネットのタスクに ECR からイメージを引く出口がない：NAT Gateway 不足、または VPC エンドポイント（ECR api/dkr＋S3）不足。「Stopped tasks」タブで実際のエラーメッセージを確認してください。'],
   cmd:'aws ecs describe-tasks --cluster prod --tasks <task-arn> --query "tasks[0].stoppedReason"'},
  {t:['ALB health check liên tục báo unhealthy dù container đã chạy','コンテナは動いているのに ALB ヘルスチェックが unhealthy のまま'],
   c:['Ba nguyên nhân kinh điển: health check path sai (app không có /health), cổng target group lệch với cổng container, hoặc Security Group của task chưa cho phép traffic từ SG của ALB. Đối chiếu cả ba theo thứ tự đó.','典型の3原因：ヘルスチェックパスのミス（/health がない）、ターゲットグループのポートとコンテナポートの不一致、タスク SG が ALB の SG からの通信を許可していない。この順で照合を。'],
   cmd:'aws elbv2 describe-target-health --target-group-arn <tg-arn>'},
  {t:['Phía GCP: Cloud Run deploy thành công nhưng request vào báo 503 / container không start','GCP 側：Cloud Run のデプロイは成功するが 503 / コンテナが起動しない'],
   c:['Container không lắng nghe đúng cổng $PORT (Cloud Run mặc định 8080 và truyền qua biến môi trường PORT) — app hard-code cổng khác sẽ crash lúc start. Kiểm tra log "Container failed to start" trong Cloud Logging.','コンテナが $PORT（Cloud Run のデフォルトは8080、環境変数 PORT で渡される）を待ち受けていない — 別ポートをハードコードすると起動時に落ちます。Cloud Logging の "Container failed to start" を確認。'],
   cmd:'gcloud run services describe app --region=asia-northeast1 --format="get(status.latestReadyRevisionName)" && gcloud logging read "resource.type=cloud_run_revision" --limit=20'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 6: ECS Fargate ===\n# 1) Giảm service về 0 rồi xoá service & cluster\naws ecs update-service --cluster prod --service web --desired-count 0\naws ecs delete-service --cluster prod --service web\naws ecs delete-cluster --cluster prod\n# 2) Xoá ALB theo thứ tự: listener → load balancer → target group\naws elbv2 delete-listener --listener-arn <listener-arn>\naws elbv2 delete-load-balancer --load-balancer-arn <alb-arn>\naws elbv2 delete-target-group --target-group-arn <tg-arn>\n# 3) Xoá image trong ECR (repo phải trống hoặc dùng --force) và log group\naws ecr delete-repository --repository-name web-app --force\naws logs delete-log-group --log-group-name /ecs/web-app',
  gcp:'# === Google Cloud cleanup — Lab 6: Cloud Run ===\nREGION=asia-northeast1\n# 1) Xoá Cloud Run service (mọi revision bị xoá theo)\ngcloud run delete app --region=$REGION --quiet 2>/dev/null || gcloud run services delete app --region=$REGION --quiet\n# 2) Xoá image và repository trong Artifact Registry\ngcloud artifacts repositories delete repo --location=$REGION --quiet\n#    (nếu chỉ muốn xoá image: gcloud artifacts docker images delete <image-url> --delete-tags --quiet)'
 },
 bill:[
  ['ELB Console: ALB của lab đã biến mất — ALB tính phí theo giờ kể cả khi không có traffic, đây là khoản phải kiểm tra đầu tiên.','ELB コンソール：ラボ用 ALB が消えているか — ALB はトラフィックなしでも時間課金されるため最優先で確認。'],
  ['ECS Console: cluster prod không còn service/task nào chạy; Fargate chỉ tính tiền khi task RUNNING nên task dừng hẳn là ngừng phí.','ECS コンソール：cluster prod に稼働中のサービス/タスクがないこと。Fargate はタスク RUNNING 中のみ課金です。'],
  ['ECR / Artifact Registry: image của lab đã xoá — phí lưu trữ image nhỏ nhưng tích lũy nếu để nhiều bản.','ECR / Artifact Registry：ラボ用イメージが削除済みか（保管料は小さいが版数が増えると積み上がります）。'],
  ['Cloud Run (GCP): service đã xoá khỏi danh sách region asia-northeast1 — tránh revision cũ vẫn nhận traffic test.','Cloud Run（GCP）：asia-northeast1 の一覧からサービスが消えているか（旧リビジョンがテストトラフィックを受け続けないように）。']
 ]
},

/* ---------- Lab 7 · Terraform đa cloud ---------- */
lab6:{
 cost:['~$0.05–0.10 cho 1 buổi làm nếu destroy ngay','~$0.05〜0.10 / 終わったらすぐ destroy した場合'],
 src:['Terraform tự nó miễn phí — phí đến từ tài nguyên nó tạo: NAT Gateway AWS (~$0.045/giờ) + Cloud NAT GCP là hai khoản chính, giống hệt Lab 1. State bucket S3/GCS gần như $0. Quên terraform destroy thì phí chạy y như quên xoá tay.','Terraform 自体は無料 — 課金は作ったリソースから：AWS の NAT Gateway（約$0.045/時）と GCP の Cloud NAT が主因で、ラボ1と同じです。State バケットはほぼ $0。destroy 忘れは手作業の消し忘れと同じだけ課金されます。'],
 pit:[
  {t:['terraform apply báo "Error acquiring the state lock" và kẹt rất lâu','terraform apply が "Error acquiring the state lock" で止まる'],
   c:['Một phiên plan/apply trước bị ngắt giữa chừng để lại lock trong DynamoDB (AWS) / GCS. Kiểm tra không còn ai đang apply rồi mới force-unlock bằng đúng LOCK_ID in trong thông báo lỗi — đừng xoá tay object state.','前回の plan/apply が中断され、DynamoDB（AWS）/ GCS にロックが残っています。誰も apply していないことを確認し、エラー文中の LOCK_ID で force-unlock（state オブジェクトの手削除は厳禁）。'],
   cmd:'terraform force-unlock <LOCK_ID>'},
  {t:['terraform destroy kẹt ở VPC/NAT hoặc báo DependencyViolation','terraform destroy が VPC/NAT で詰まる・DependencyViolation が出る'],
   c:['Có tài nguyên ngoài Terraform đang dùng mạng (ENI của interface endpoint, task ECS quên xoá, NAT chưa về trạng thái deleted). Xoá các tài nguyên “ngoài state” đó trước, chờ NAT biến mất hẳn rồi chạy lại destroy — destroy an toàn để chạy lại nhiều lần.','Terraform 管理外のリソースがネットワークを使っています（エンドポイントの ENI、消し忘れた ECS タスク、削除中の NAT）。管理外を先に消し、NAT が完全消滅してから destroy を再実行（destroy は再実行安全です）。'],
   cmd:'aws ec2 describe-network-interfaces --filters Name=vpc-id,Values=vpc-xxxx --query "NetworkInterfaces[].{Id:NetworkInterfaceId,Type:InterfaceType,Desc:Description}"'},
  {t:['Phía GCP: plan/apply báo google_compute_network... "Error 403: ... API has not been used"','GCP 側：plan/apply が "API has not been used" の 403 になる'],
   c:['Project mới chưa enable API (compute.googleapis.com, servicenetworking...). Terraform không tự enable API — bật API trước bằng gcloud services enable, chờ vài phút rồi apply lại.','新規プロジェクトで API（compute.googleapis.com 等）が未有効化。Terraform は API を有効化しません。gcloud services enable で先に有効化し、数分待って再 apply。'],
   cmd:'gcloud services enable compute.googleapis.com cloudresourcemanager.googleapis.com --project=PROJECT_ID'}
 ],
 clean:{
  aws:'# === Cleanup — Lab 7: Terraform (cách đúng là destroy từ chính code) ===\n# 1) Destroy module AWS trước, đọc kỹ danh sách "Destroy complete!"\ncd terraform-aws && terraform destroy -auto-approve && cd ..\n# 2) Destroy module GCP\ncd terraform-gcp && terraform destroy -auto-approve && cd ..\n# 3) Cuối cùng mới dọn backend state (làm tay vì state không tự quản chính nó):\n#    - DynamoDB lock table\naws dynamodb delete-table --table-name tf-lock\n#    - Bucket S3 chứa state: phải xoá MỌI version của object mới xoá bucket được\naws s3 rm s3://tf-state-bucket --recursive\n#    (nếu bucket bật versioning: xoá thêm các version qua Console hoặc aws s3api list-object-versions)\naws s3 rb s3://tf-state-bucket',
  gcp:'# === Cleanup — Lab 7: backend state phía GCP ===\n# Sau khi terraform destroy xong cả hai module:\n# Xoá bucket GCS chứa state (kèm mọi object version nếu bật Object Versioning)\n#    gcloud storage rm -r gs://tf-state-bucket-gcp\n# Kiểm tra lại không còn VPC/NAT nào do Terraform tạo sót:\ngcloud compute networks list && gcloud compute routers list --regions=asia-northeast1'
 },
 bill:[
  ['Chạy terraform plan sau destroy: kết quả phải là "No changes" trên state rỗng / hoặc kiểm tra bằng lệnh list — không còn VPC, NAT nào mang tag Project của lab.','destroy 後に terraform plan：「No changes」になるか、list 系コマンドでラボのタグが付いた VPC / NAT が残っていないか確認。'],
  ['Cost Explorer / GCP Billing: hai dòng phí NAT Gateway và Cloud NAT phải ngừng tăng ngay sau buổi học.','Cost Explorer / GCP Billing：NAT Gateway と Cloud NAT の課金が学習直後に止まっているか。'],
  ['S3/GCS state bucket: nếu giữ lại cho lab sau thì phí gần $0 — nhưng phải chắc chắn bên trong không còn state trỏ tới tài nguyên thật đã xoá một nửa.','S3/GCS の state バケット：次回用に残すならほぼ $0。ただし中途半端に消えたリソースを指す state が残っていないか確認。'],
  ['DynamoDB lock table đã xoá hoặc để lại với phí ~$0 (on-demand, không dùng không tốn) — ghi chú lại quyết định của bạn cho lần học sau.','DynamoDB ロックテーブル：削除済み、または残してもほぼ $0（オンデマンド）。次回のために判断をメモしておく。']
 ]
},

/* ---------- Lab 8 · CI/CD hai cloud ---------- */
lab7:{
 cost:['$0.00 – ~$0.05 cho 1 buổi làm',' $0.00 〜 ~$0.05 / 1回の実施'],
 src:['CodeBuild tính theo phút build (~$0.005/phút bản small), pipeline đầu tiên của CodePipeline miễn phí hàng tháng; Cloud Build miễn phí 120 phút build/ngày. Phí thật sự gần $0 — trừ khi pipeline deploy ra ALB/ECS và bạn quên dọn phần đó (xem Lab 6).','CodeBuild はビルド分課金（small で約$0.005/分）、CodePipeline の最初のパイプラインは月額無料、Cloud Build は1日120分まで無料。実質ほぼ $0 — ただしデプロイ先の ALB/ECS を消し忘れるとそちらが課金されます（ラボ6参照）。'],
 pit:[
  {t:['CodeBuild chạy fail ngay ở giai đoạn BUILD với lỗi AccessDenied khi push image lên ECR','CodeBuild が BUILD フェーズで ECR への push に AccessDenied で落ちる'],
   c:['Service role của CodeBuild chưa có quyền ECR (hoặc thiếu logs/s3). Đây là lỗi IAM kinh điển của pipeline: mở CloudWatch Logs của build để đọc đúng dòng lỗi, rồi bổ sung policy tối thiểu cho role — đừng gắn AdministratorAccess cho nhanh.','CodeBuild のサービスロールに ECR 権限（logs/s3 も）がない典型的な IAM エラー。ビルドの CloudWatch Logs で実際のエラー行を読み、ロールに最小限のポリシーを追加（手早さで AdministratorAccess を付けない）。'],
   cmd:'aws codebuild batch-get-builds --ids <build-id> --query "builds[0].{Phase:currentPhase,Logs:logs.deepLink}"'},
  {t:['Pipeline đứng yên ở bước kết nối GitHub / stage Source không bao giờ chạy','GitHub 接続のところでパイプラインが止まり、Source ステージが動かない'],
   c:['CodeConnections (kết nối GitHub) đang ở trạng thái PENDING vì chưa bấm "Update pending connection" để uỷ quyền trên GitHub. Vào Developer Tools → Connections hoàn tất handshake một lần là pipeline chạy.','CodeConnections（GitHub 接続）が PENDING のまま — GitHub 側で認可を完了していないためです。Developer Tools → Connections で保留中の接続を承認すれば動き出します。'],
   cmd:'aws codeconnections list-connections --query "Connections[].{Name:ConnectionName,Status:ConnectionStatus}"'},
  {t:['Phía GCP: Cloud Build lỗi "PERMISSION_DENIED: ... service account" khi deploy Cloud Run','GCP 側：Cloud Run デプロイ時に Cloud Build が "PERMISSION_DENIED: ... service account"'],
   c:['Cloud Build service account thiếu hai thứ: quyền deploy Cloud Run (roles/run.admin) và quyền "actAs" service account runtime của Cloud Run (roles/iam.serviceAccountUser). Bổ sung đúng hai role này trên project là hết lỗi.','Cloud Build のサービスアカウントに2つ不足：Cloud Run へのデプロイ権限（roles/run.admin）と、Cloud Run ランタイム SA への actAs（roles/iam.serviceAccountUser）。この2ロール追加で解消します。'],
   cmd:'gcloud projects get-iam-policy PROJECT_ID --flatten="bindings[].members" --filter="bindings.members:cloudbuild" --format="get(bindings.role)"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 8: CI/CD ===\n# 1) Xoá pipeline trước để nó không tự deploy lại trong lúc dọn\naws codepipeline delete-pipeline --name web-pipeline\n# 2) Xoá project CodeBuild và ứng dụng CodeDeploy (nếu lab có tạo)\naws codebuild delete-project --name web-build\naws deploy delete-application --application-name web-app\n# 3) Xoá thông báo SNS và kết nối GitHub nếu chỉ dùng cho lab\naws sns delete-topic --topic-arn arn:aws:sns:ap-northeast-1:123456789012:pipeline-alerts\naws codeconnections delete-connection --connection-arn <connection-arn>\n# 4) Phần pipeline đã deploy ra (ECS service/ALB): dọn theo đúng khối cleanup của Lab 6',
  gcp:'# === Google Cloud cleanup — Lab 8: Cloud Build / Cloud Deploy ===\nREGION=asia-northeast1\n# 1) Xoá trigger trước để push code không kích hoạt build nữa\ngcloud builds triggers delete push-trigger --region=$REGION --quiet\n# 2) Xoá pipeline Cloud Deploy và các target\n#    gcloud deploy delivery-pipelines delete web-pipeline --region=$REGION --quiet\n#    gcloud deploy targets delete prod-target --region=$REGION --quiet\n# 3) Xoá Cloud Run service staging/prod mà pipeline đã deploy\n#    gcloud run services delete app --region=$REGION --quiet'
 },
 bill:[
  ['CodePipeline/CodeBuild: hai dịch vụ này gần như $0 — kiểm tra Cost Explorer nhóm Developer Tools chỉ để xác nhận không có build chạy lặp bất thường (trigger sai có thể build liên tục).','CodePipeline/CodeBuild はほぼ $0 — Developer Tools グループで異常な連続ビルド（トリガーミス）がないことだけ確認。'],
  ['Cloud Build (GCP Billing): số phút build trong ngày nằm trong 120 phút miễn phí; vượt nhiều nghĩa là trigger đang bị kích hoạt ngoài ý muốn.','Cloud Build（GCP Billing）：その日のビルド分数が無料枠120分以内か。大きく超えるなら想定外のトリガー発火あり。'],
  ['Tài nguyên do pipeline DEPLOY ra (ALB, ECS service, Cloud Run) mới là nơi tốn tiền — kiểm tra theo checklist của Lab 6.','費用がかかるのはパイプラインがデプロイした先（ALB、ECS、Cloud Run）— ラボ6のチェックリストで確認。'],
  ['SNS topic / notification channel đã xoá hoặc giữ có chủ đích — gửi thông báo thì rẻ, nhưng topic quên xoá sẽ tiếp tục nhận sự kiện từ pipeline sót.','SNS トピック / 通知チャネル：削除済みか意図的に残したか。残存パイプラインから通知が来続けていないか確認。']
 ]
},

/* ---------- Lab 9 · EKS vs GKE Autopilot ---------- */
lab8:{
 cost:['~$0.40–0.60 nếu chạy khoảng 2 giờ rồi xoá — lab đắt nhất nhóm cơ bản/trung cấp','~$0.40〜0.60 / 約2時間 — 基礎・中級ラボで最も高額'],
 src:['Nguồn phí chính: control plane EKS $0.10/giờ + GKE Autopilot $0.10/giờ (phí quản lý cluster) + node/pod compute + ALB/Global LB đi kèm Ingress. Hai cluster chạy song song nên phí gấp đôi — làm xong lab này phải xoá cluster ngay, đừng “để mai học tiếp”.','主な課金源：EKS コントロールプレーン $0.10/時 ＋ GKE Autopilot $0.10/時（クラスタ管理料）＋ ノード/Pod のコンピュート ＋ Ingress 用 LB。2クラスタ並行で費用は2倍 — 終わったら「明日続き」は禁物、即削除。'],
 pit:[
  {t:['eksctl tạo cluster fail ở bước CloudFormation / nodegroup không bao giờ Ready','eksctl が CloudFormation で失敗 / ノードグループが Ready にならない'],
   c:['Thường do thiếu quyền IAM để tạo stack, hoặc node ở private subnet không có đường ra (thiếu NAT) nên không join được cluster. Đọc sự kiện stack trong CloudFormation Console để biết tài nguyên nào fail đầu tiên thay vì tạo lại mù quáng.','IAM 権限不足でスタック作成失敗、またはプライベートサブネットのノードに出口（NAT）がなく join できないのが典型。CloudFormation コンソールで最初に失敗したリソースを確認してから対処を。'],
   cmd:'aws cloudformation describe-stack-events --stack-name eksctl-prod-cluster --query "StackEvents[?ResourceStatus==\'CREATE_FAILED\']"'},
  {t:['Pod trên EKS không gọi được API AWS (lỗi credentials) dù node có role','EKS の Pod がノードのロールを持つのに AWS API で認証エラーになる'],
   c:['Pod mặc định thừa hưởng quyền của node — muốn quyền riêng theo workload phải dùng IRSA (OIDC provider + service account gắn role). Kiểm tra OIDC provider đã associate với cluster chưa và annotation của service account có đúng ARN role không.','Pod はデフォルトでノードの権限を継承します。ワークロード単位の権限には IRSA（OIDC プロバイダ＋ロール付きサービスアカウント）が必要。OIDC の関連付けと SA のアノテーション ARN を確認。'],
   cmd:'aws eks describe-cluster --name prod --query "cluster.identity.oidc.issuer" && kubectl describe sa app-sa | grep -i annotations'},
  {t:['Phía GCP: pod trên GKE Autopilot bị Pending mãi hoặc bị từ chối tạo (Autopilot constraints)','GCP 側：GKE Autopilot で Pod が Pending のまま / 制約で作成拒否される'],
   c:['Autopilot bắt buộc resource request hợp lệ và cấm một số cấu hình (hostPath, privileged...). Xem sự kiện của pod bằng kubectl describe — Autopilot ghi rõ lý do từ chối trong events (vd: thiếu requests hoặc dùng tính năng không được phép).','Autopilot はリソース requests が必須で、一部設定（hostPath、privileged 等）が禁止です。kubectl describe の Events に拒否理由が明記されるので、まずそこを読む。'],
   cmd:'kubectl describe pod <pod> | tail -20 && gcloud container clusters describe prod --region=asia-northeast1 --format="get(status)"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 9: EKS (đắt — xoá ngay khi học xong) ===\n# 1) Gỡ ứng dụng và Ingress TRƯỚC để ALB do controller tạo được xoá theo\nhelm uninstall web-app\nkubectl delete ingress web-app   # chờ ALB biến mất hẳn trong EC2 Console → Load Balancers\n# 2) Xoá toàn bộ cluster bằng eksctl (tự dọn nodegroup, VPC nếu do nó tạo)\neksctl delete cluster --name prod --region ap-northeast-1\n# 3) Kiểm tra sót: CloudFormation stack eksctl-* phải ở trạng thái đã xoá\naws cloudformation list-stacks --query "StackSummaries[?contains(StackName,\'eksctl\') && StackStatus!=\'DELETE_COMPLETE\']"',
  gcp:'# === Google Cloud cleanup — Lab 9: GKE Autopilot ===\n# 1) Gỡ ứng dụng & Ingress trước để Global LB được dọn theo\nhelm uninstall web-app\nkubectl delete ingress web-app\n# 2) Xoá cluster (Autopilot không có node pool riêng để dọn thêm)\ngcloud container clusters delete prod --region=asia-northeast1 --quiet\n# 3) Kiểm tra sót: forwarding rule / target proxy của Ingress còn sót không\ngcloud compute forwarding-rules list'
 },
 bill:[
  ['EKS Console + CloudFormation: cluster prod và stack eksctl-* đã biến mất hoàn toàn — control plane tính $0.10/giờ tới khi cluster bị xoá hẳn.','EKS コンソール＋CloudFormation：prod クラスタと eksctl-* スタックが完全消滅したか — コントロールプレーンは削除完了まで $0.10/時課金。'],
  ['GKE Console: cluster prod không còn; GCP Billing lọc Kubernetes Engine phải ngừng tăng ngay trong giờ cleanup.','GKE コンソール：prod クラスタがないこと。GCP Billing の Kubernetes Engine 課金が cleanup の時間帯で止まること。'],
  ['Load Balancer mồ côi: Ingress bị xoá tay (không qua kubectl) sẽ để lại ALB/Global LB vẫn tính phí — kiểm tra danh sách LB ở cả hai cloud.','孤立 LB：Ingress を kubectl 経由で消さなかった場合、ALB / グローバル LB が残って課金され続けます。両クラウドの LB 一覧を確認。'],
  ['EC2 Console: node của EKS (instance mang tag eks/cluster) đã terminate hết — node sót là khoản phí chạy ngầm phổ biến nhất sau lab K8s.','EC2 コンソール：EKS ノード（eks/cluster タグ付き）が全て terminated か。ノード残りは K8s ラボ後の最も多い裏課金です。']
 ]
},

/* ---------- Lab 10 · SQS + EventBridge vs Pub/Sub + Eventarc ---------- */
lab9:{
 cost:['$0.00 (trong Free Tier)',' $0.00（無料枠内）'],
 src:['SQS, EventBridge, Pub/Sub đều có Free Tier rộng (SQS: 1 triệu request/tháng; Pub/Sub: 10GB throughput đầu miễn phí). Ở quy mô lab, chi phí thực tế là $0.00 — chỉ cần dọn để tránh rác tài khoản.','SQS、EventBridge、Pub/Sub はいずれも無料枠が広く（SQS は月100万リクエスト、Pub/Sub は最初の10GBが無料）、ラボ規模では実質 $0.00。課金ではなくアカウントの整理のために片付けます。'],
 pit:[
  {t:['Message gửi vào SQS bị nhảy thẳng vào DLQ sau vài lần nhận dù consumer code đúng','コードは正しいのに SQS メッセージが数回で DLQ に入ってしまう'],
   c:['Visibility timeout của queue ngắn hơn thời gian Lambda xử lý: message bị “hiện lại” khi đang xử lý dở, nhận đủ maxReceiveCount=3 là vào DLQ. Đặt visibility timeout ≥ 6 lần timeout của Lambda.','キューの可視性タイムアウトが Lambda の処理時間より短い：処理中に再表示され、maxReceiveCount=3 で DLQ 行き。可視性タイムアウトは Lambda のタイムアウトの6倍以上に。'],
   cmd:'aws sqs get-queue-attributes --queue-url <queue-url> --attribute-names VisibilityTimeout ReceiveMessageWaitTimeSeconds'},
  {t:['EventBridge rule đã tạo nhưng sự kiện OrderCreated không bao giờ tới đích','EventBridge ルールはあるのに OrderCreated イベントが届かない'],
   c:['Event pattern không khớp cấu trúc sự kiện thật (sai detail-type hoặc sai tên field trong detail), hoặc rule gắn nhầm event bus. Dùng tính năng "Test pattern" với sự kiện mẫu và kiểm tra rule đang ở trạng thái ENABLED trên đúng bus.','イベントパターンが実際の構造と不一致（detail-type や detail 内フィールド名のミス）、またはバス違い。サンプルイベントで「Test pattern」し、正しいバスで ENABLED か確認。'],
   cmd:'aws events describe-rule --name order-created --event-bus-name default'},
  {t:['Phía GCP: Pub/Sub subscription không nhận được message hoặc Eventarc trigger không kích hoạt','GCP 側：Pub/Sub サブスクリプションに届かない / Eventarc トリガーが発火しない'],
   c:['Hai thủ phạm chính: subscription tạo SAU khi publish (message trước đó không được giữ nếu không bật message retention), và service account của Eventarc thiếu quyền (eventarc.eventReceiver + run.invoker). Kiểm tra cả hai trước khi nghi ngờ code.','主因は2つ：publish 後に作ったサブスクリプション（保持設定なしでは過去分は届かない）と、Eventarc の SA 権限不足（eventarc.eventReceiver＋run.invoker）。コードを疑う前にこの2点を確認。'],
   cmd:'gcloud pubsub subscriptions describe orders-sub --format="get(ackDeadlineSeconds,deadLetterPolicy)" && gcloud eventarc triggers list --location=asia-northeast1'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 10: SQS + EventBridge ===\n# 1) Gỡ target khỏi rule rồi xoá rule (rule còn target sẽ không xoá được)\naws events remove-targets --rule order-created --ids "1"\naws events delete-rule --name order-created\n# 2) Xoá archive sự kiện (nếu đã bật ở bước replay)\naws events delete-archive --archive-name orders-archive\n# 3) Gỡ event source mapping của Lambda rồi xoá queue + DLQ\naws lambda delete-event-source-mapping --uuid <mapping-uuid>\naws sqs delete-queue --queue-url <queue-url>\naws sqs delete-queue --queue-url <dlq-url>\n# 4) Xoá Lambda consumer\naws lambda delete-function --function-name order-consumer',
  gcp:'# === Google Cloud cleanup — Lab 10: Pub/Sub + Eventarc ===\n# 1) Xoá trigger Eventarc trước\ngcloud eventarc triggers delete order-trigger --location=asia-northeast1 --quiet\n# 2) Xoá subscription TRƯỚC rồi mới xoá topic (gồm cả dead-letter topic)\ngcloud pubsub subscriptions delete orders-sub --quiet\ngcloud pubsub topics delete orders --quiet\ngcloud pubsub topics delete orders-dlq --quiet\n# 3) Xoá Cloud Run service xử lý sự kiện (nếu lab có tạo)\n#    gcloud run services delete order-processor --region=asia-northeast1 --quiet'
 },
 bill:[
  ['SQS / Pub/Sub: phí ở quy mô lab là $0 — chỉ cần xác nhận queue/topic đã xoá để không nhận nhầm sự kiện ở lab sau.','SQS / Pub/Sub：ラボ規模では $0 — キュー/トピックが消えていて、後のラボのイベントと混ざらないことだけ確認。'],
  ['EventBridge archive (nếu bật): archive tính phí lưu trữ sự kiện theo GB — đã xoá thì ngừng hẳn, để lại sẽ tích lũy rất chậm nhưng liên tục.','EventBridge アーカイブ（有効化した場合）：イベント保管料が GB 課金。消せば完全停止、残すと微額が積み上がります。'],
  ['Lambda / Cloud Run consumer đã xoá — consumer sót có thể bị trigger bởi sự kiện test còn sót và ghi log vô ích.','Lambda / Cloud Run のコンシューマが削除済みか — 残ると残存テストイベントで無駄に起動・ログ出力します。'],
  ['Tổng chi phí kỳ vọng của lab này: $0.00 — mọi con số khác 0 đều đáng truy vết ngay.','このラボの想定総額は $0.00 — 0 でない数字は即追跡する価値があります。']
 ]
},

/* ---------- Lab 11 · Giám sát & cảnh báo đa cloud ---------- */
lab10:{
 cost:['$0.00 – ~$0.02 cho 1 buổi làm',' $0.00 〜 ~$0.02 / 1回の実施'],
 src:['Dashboard miễn phí ở cả hai cloud; CloudWatch Alarm tính ~$0.10/alarm/tháng (quy ra vài giờ học chỉ là phần nhỏ của 1 cent). Amazon Managed Grafana nếu bạn thử tạo workspace sẽ tính phí theo user/tháng — chỉ tạo khi thật sự cần và xoá ngay sau lab.','ダッシュボードは両クラウドとも無料。CloudWatch アラームは約$0.10/個/月で、数時間なら1セント未満。Amazon Managed Grafana のワークスペースはユーザー/月課金なので、必要時のみ作成し終わったら即削除。'],
 pit:[
  {t:['CloudWatch Alarm kẹt ở INSUFFICIENT_DATA dù EC2 đang chạy','EC2 は動いているのに CloudWatch アラームが INSUFFICIENT_DATA のまま'],
   c:['Metric chưa có dữ liệu ở period bạn chọn (EC2 mặc định đẩy metric mỗi 5 phút), hoặc alarm trỏ sai namespace/dimension (nhầm InstanceId). Tạo xong alarm cần chờ ít nhất 1–2 period rồi mới đánh giá.','選択した period にメトリクスがまだない（EC2 の既定は5分間隔）、または namespace/dimension（InstanceId）の指定ミス。アラーム作成後は1〜2 period 待ってから判断を。'],
   cmd:'aws cloudwatch describe-alarms --alarm-names high-cpu --query "MetricAlarms[0].{State:StateValue,Reason:StateReason}"'},
  {t:['Alarm chuyển ALARM nhưng không nhận được email nào từ SNS','アラームは ALARM になるのに SNS からメールが来ない'],
   c:['Subscription email chưa được confirm (link xác nhận trong hộp thư bị bỏ qua) — SNS không gửi tới subscription ở trạng thái PendingConfirmation. Kiểm tra và confirm lại, hoặc dùng describe để xem trạng thái từng subscription.','メール購読が未確認（確認リンクを見落とし）— PendingConfirmation の購読先には SNS は送りません。購読状態を確認して再確認を。'],
   cmd:'aws sns list-subscriptions-by-topic --topic-arn <topic-arn> --query "Subscriptions[].{Endpoint:Endpoint,State:SubscriptionArn}"'},
  {t:['Phía GCP: Alert policy đã tạo nhưng không bắn thông báo, hoặc bắn liên tục vô nghĩa','GCP 側：アラートポリシーが通知しない、または無意味に鳴り続ける'],
   c:['Notification channel chưa verify email, hoặc điều kiện alert dùng cửa sổ/threshold khiến metric tổng hợp không bao giờ vượt ngưỡng (vd: aligner không khớp loại metric). Mở trang Monitoring → Alerting xem trạng thái policy và kênh thông báo.','通知チャネルのメール未検証、または条件の集計（aligner）とメトリクス種別が噛み合わず閾値を永遠に超えない設定。Monitoring → Alerting でポリシーとチャネルの状態を確認。'],
   cmd:'gcloud alpha monitoring policies list --format="table(displayName,enabled)" && gcloud beta monitoring channels list --format="table(displayName,verificationStatus)"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 11: CloudWatch ===\n# 1) Xoá alarm và dashboard của lab\naws cloudwatch delete-alarms --alarm-names high-cpu\naws cloudwatch delete-dashboards --dashboard-names web-overview\n# 2) Xoá topic SNS dùng cho cảnh báo\naws sns delete-topic --topic-arn arn:aws:sns:ap-northeast-1:123456789012:alerts\n# 3) Nếu đã thử Amazon Managed Grafana: xoá workspace (khoản phí lớn nhất của lab này)\n#    aws grafana delete-workspace --workspace-id g-xxxxxxxxxx\n# 4) Log group: giữ lại cũng được nếu đã đặt retention 30 ngày như bước lab',
  gcp:'# === Google Cloud cleanup — Lab 11: Cloud Monitoring ===\n# 1) Xoá dashboard và alert policy của lab (lấy ID bằng list trước)\ngcloud monitoring dashboards list\ngcloud monitoring dashboards delete <dashboard-id> --quiet\ngcloud alpha monitoring policies list\ngcloud alpha monitoring policies delete <policy-id> --quiet\n# 2) Xoà notification channel email/Slack của lab\n#    gcloud beta monitoring channels delete <channel-id> --quiet'
 },
 bill:[
  ['CloudWatch Alarms: đếm lại số alarm còn tồn tại — mỗi alarm sót là $0.10/tháng, nhỏ nhưng là “phí rác” điển hình trong hoá đơn thật.','CloudWatch アラーム：残っている個数を確認 — 1個 $0.10/月と小さいですが、実請求で典型的な「ゴミ課金」です。'],
  ['Amazon Managed Grafana: nếu từng tạo workspace để thử, xác nhận đã xoá — đây là khoản phí theo user, cao hơn mọi thứ khác trong lab này cộng lại.','Amazon Managed Grafana：試しに作ったワークスペースが削除済みか — ユーザー課金で、このラボの他項目合計より高額です。'],
  ['GCP Monitoring: alert policy/dashboard tự chúng không tính phí, nhưng log-based metric và log lưu trữ dài hạn thì có — kiểm tra retention của log bucket.','GCP Monitoring：ポリシー/ダッシュボード自体は無課金。ただしログベースメトリクスと長期ログ保管は課金 — ログバケットの保持期間を確認。'],
  ['SNS/notification channel đã xoá hoặc để lại có chủ đích — không tốn đáng kể, nhưng kênh sót sẽ nhận cảnh báo từ các lab sau gây nhiễu.','SNS / 通知チャネル：削除済みか意図的に残したか — 課金は僅少ですが、残すと後のラボの通知でノイズになります。']
 ]
},

/* ---------- Lab 12 · IAM Role vs Service Account ---------- */
lab11:{
 cost:['$0.00 (miễn phí hoàn toàn)',' $0.00（完全無料）'],
 src:['IAM, CloudTrail (trail đầu tiên cho management events), Config rule cơ bản, Access Analyzer và các tính năng IAM của GCP đều miễn phí ở quy mô lab. Lab này không tạo tài nguyên tính tiền — rủi ro của nó nằm ở bảo mật (quyền thừa để sót), không nằm ở hoá đơn.','IAM、CloudTrail（管理イベントの最初のトレイル）、基本の Config ルール、Access Analyzer、GCP の IAM 機能はいずれもラボ規模では無料。このラボは課金リソースを作りません — リスクは請求ではなく、残った過剰権限（セキュリティ）側にあります。'],
 pit:[
  {t:['EC2 gắn role rồi nhưng gọi S3 vẫn AccessDenied','ロールを付けた EC2 から S3 を呼んでも AccessDenied'],
   c:['Ba điểm phải khớp đồng thời: role đã gắn qua instance profile, policy của role cho phép đúng action (s3:GetObject khác s3:ListBucket), và Resource ARN đúng bucket/object (arn:...:s3:::bucket/* khác arn:...:s3:::bucket). Thiếu 1 trong 3 là denied.','3点が同時に必要：instance profile 経由でロール装着、ポリシーが正しいアクションを許可（s3:GetObject ≠ s3:ListBucket）、Resource ARN が正しい（bucket/* と bucket は別物）。1つ欠けても denied。'],
   cmd:'aws sts get-caller-identity && aws iam get-instance-profile --instance-profile-name app-profile --query "InstanceProfile.Roles"'},
  {t:['Role/policy đã sửa nhưng hành vi không đổi — lúc được lúc không','ロール/ポリシーを直したのに挙動が変わらない（通ったり通らなかったり）'],
   c:['IAM thay đổi cần thời gian lan truyền (thường vài giây đến vài phút) và session/credential cũ trên instance có thể còn cache qua metadata. Đợi 1–2 phút, lấy credential mới rồi test lại; đừng vội kết luận policy sai.','IAM の変更は伝播に時間（数秒〜数分）がかかり、インスタンス上の旧クレデンシャルがメタデータに残ることも。1〜2分待って新しいクレデンシャルで再テストを。早合点でポリシーを疑わない。'],
   cmd:'curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/ | head -1'},
  {t:['Phía GCP: service account đã tạo nhưng VM/app vẫn báo permission denied khi đọc bucket','GCP 側：SA を作ったのに VM/アプリからバケット読み取りが permission denied'],
   c:['Gán role ở sai cấp (project thay vì bucket hoặc ngược lại), hoặc VM vẫn chạy bằng default service account chứ chưa đổi sang SA mới (đổi SA cho VM phải dừng VM). Kiểm tra SA thực tế của VM và binding trên đúng bucket.','ロールの付与レベル違い（プロジェクト vs バケット）、または VM が既定 SA のまま（VM の SA 変更は停止が必要）。VM の実際の SA と、対象バケット上の binding を確認。'],
   cmd:'gcloud compute instances describe app-1 --zone=asia-northeast1-a --format="get(serviceAccounts.email)" && gcloud storage buckets get-iam-policy gs://TEN-BUCKET'}
 ],
 clean:{
  aws:'# === AWS cleanup — Lab 12: IAM ===\n# 1) Gỡ instance profile khỏi EC2 và gỡ policy khỏi role, rồi xoá role\naws iam remove-role-from-instance-profile --instance-profile-name app-profile --role-name app-role\naws iam detach-role-policy --role-name app-role --policy-arn arn:aws:iam::123456789012:policy/app-s3-read\naws iam delete-instance-profile --instance-profile-name app-profile\naws iam delete-role --role-name app-role\naws iam delete-policy --policy-arn arn:aws:iam::123456789012:policy/app-s3-read\n# 2) Tắt & xoá CloudTrail trail của lab + Config rule kiểm tra\naws cloudtrail stop-logging --name lab-trail\naws cloudtrail delete-trail --name lab-trail\naws configservice delete-config-rule --config-rule-name s3-bucket-public-read-prohibited',
  gcp:'# === Google Cloud cleanup — Lab 12: Service Account ===\n# 1) Gỡ binding của SA khỏi bucket TRƯỚC\ngcloud storage buckets remove-iam-policy-binding gs://TEN-BUCKET --member="serviceAccount:app-sa@PROJECT_ID.iam.gserviceaccount.com" --role="roles/storage.objectViewer"\n# 2) Xoá service account của lab (xoá SA sẽ vô hiệu mọi key đã cấp từ nó)\ngcloud iam service-accounts delete app-sa@PROJECT_ID.iam.gserviceaccount.com --quiet\n# 3) Nếu đã tải key JSON về máy để thử: XOÁ FILE KEY ngay — key tĩnh để sót là rủi ro bảo mật lớn nhất của lab này\n#    rm ~/app-sa-key.json'
 },
 bill:[
  ['Hoá đơn lab này phải là $0.00 — IAM/CloudTrail cơ bản/Access Analyzer không tính phí ở quy mô này; thấy phí lạ thì kiểm tra có bật nhầm Data Access log volume lớn không.','このラボの請求は $0.00 のはず — IAM / 基本 CloudTrail / Access Analyzer はこの規模では無課金。見慣れない課金があれば、大量の Data Access ログを有効化していないか確認。'],
  ['Config rule: mỗi rule ~$0.001/lần đánh giá — không đáng kể, nhưng rule để sót sẽ đánh giá mãi trên tài nguyên thật sau này.','Config ルール：評価1回 約$0.001 と僅少ですが、残すと今後の実リソースを評価し続けます。'],
  ['Kiểm tra bảo mật thay cho hoá đơn: không còn role/SA nào của lab với quyền rộng hơn dự định, không còn key JSON nào trên máy.','請求の代わりにセキュリティ確認：予定より広い権限のロール/SA が残っていないか、JSON キーが端末に残っていないか。'],
  ['CloudTrail trail / Audit Logs: nếu giữ lại để học tiếp, ghi chú rõ — log sự kiện quản trị là nền tảng audit, thường NÊN giữ trong tài khoản học tập.','CloudTrail / 監査ログ：学習継続のため残す場合は明記を — 管理イベントのログは監査の基盤で、学習アカウントでは通常「残す」が正解です。']
 ]
},

/* ---------- Mig 1 · VMware → AWS (MGN) ---------- */
mig0:{
 cost:['~$0.05–0.30 cho 1 đợt test launch vài giờ','~$0.05〜0.30 / テスト起動を数時間行う1回分'],
 src:['MGN miễn phí 90 ngày cho mỗi server nguồn (giai đoạn replicate). Phí phát sinh từ test instance EC2 khi launch kiểm thử và staging area (volume EBS sao chép) — tắt test instance ngay sau khi kiểm thử xong là hết phí chính.','MGN は移行元サーバーごとに90日間無料（複製フェーズ）。課金はテスト起動した EC2 とステージング領域（複製 EBS）から — テスト機を検証後すぐ止めれば主因は消えます。'],
 pit:[
  {t:['Cài MGN agent lên VM nguồn báo lỗi kết nối / agent không xuất hiện trong console','移行元 VM への MGN エージェント導入で接続エラー / コンソールに現れない'],
   c:['Agent cần ra internet (hoặc endpoint) tới dịch vụ MGN trên cổng 443 và đồng hồ hệ thống phải đúng (lệch giờ làm hỏng chữ ký request). Kiểm tra DNS + outbound 443 + NTP trước khi cài lại.','エージェントは 443 で MGN サービスへのアウトバウンドと、正しいシステム時刻（ずれると署名が壊れる）が必要。DNS＋443 疎通＋ NTP を確認してから再導入を。'],
   cmd:'curl -I https://mgn.ap-northeast-1.amazonaws.com && timedatectl status | grep -i synced'},
  {t:['Replication kẹt ở "initial sync" rất lâu, % không tăng','レプリケーションが "initial sync" で長時間止まり、% が進まない'],
   c:['Băng thông đường truyền là nút thắt thường gặp nhất, hoặc staging subnet thiếu đường ra để staging instance nhận dữ liệu. Xem replication backlog và kiểm tra route/NAT của staging subnet trước khi nghi ngờ agent.','帯域不足が最頻のボトルネック。またはステージング用サブネットに出口がなくデータを受けられない。エージェントを疑う前に複製バックログとステージング側サブネットのルート/NAT を確認。'],
   cmd:'aws mgn describe-source-servers --filters isArchived=false --query "items[].{Name:sourceProperties.identification.hn,State:lifeCycle.state}"'},
  {t:['Launch test instance thành công nhưng ứng dụng không lên / không đăng nhập được','テスト起動は成功するがアプリが上がらない / ログインできない'],
   c:['Thường do launch template hậu chuyển đổi (post-launch) chưa chỉnh: sai subnet/security group đích, hoặc driver/thứ tự boot của OS khách. Test trên subnet test riêng, đối chiếu console output và system log của instance trước khi cutover thật.','移行後テンプレート（post-launch）未調整が典型：サブネット/SG の向き先ミス、ゲスト OS のドライバやブート順。テスト用サブネットで、コンソール出力とシステムログを照合してから本番カットオーバーへ。'],
   cmd:'aws ec2 get-console-output --instance-id i-xxxx --query Output --output text | tail -30'}
 ],
 clean:{
  aws:'# === AWS cleanup — Mig 1: MGN (sau khi đã kiểm thử xong, CHƯA cutover thật) ===\n# 1) Terminate toàn bộ test instance đã launch từ MGN\naws ec2 terminate-instances --instance-ids i-xxxxxxxxxxxxxxxxx\naws ec2 wait instance-terminated --instance-ids i-xxxxxxxxxxxxxxxxx\n# 2) Ngắt replicate: trong MGN Console chọn server → Actions → "Disconnect from AWS"\n#    (bước này xoá staging instance/volume do MGN quản lý — làm trên Console vì CLI không hỗ trợ đầy đủ)\n# 3) Gỡ agent trên VM nguồn (nếu không định chuyển thật):\n#    Linux: sudo /usr/local/bin/aws-replication-agent... theo hướng dẫn gỡ của MGN; Windows: uninstall trong Programs\n# 4) Xoá launch template bản nháp do lab tạo\naws ec2 delete-launch-template --launch-template-name mgn-test-template'
 },
 bill:[
  ['EC2 Console: không còn test instance nào mang tag MGN đang running — test instance quên tắt là phí chính của lab này.','EC2 コンソール：MGN タグ付きテスト機が running で残っていないか — 消し忘れテスト機がこのラボの主課金源。'],
  ['EBS Volumes: không còn volume staging ở trạng thái available/in-use ngoài ý muốn sau khi disconnect replicate.','EBS ボリューム：複製切断後にステージング用ボリュームが想定外に残っていないか。'],
  ['Cost Explorer lọc Application Migration Service: MGN trong 90 ngày đầu phải là $0 — thấy phí MGN nghĩa là đã quá hạn miễn phí hoặc nhầm dịch vụ.','コストエクスプローラーで Application Migration Service を確認：90日以内なら MGN は $0 のはず。課金があれば無料期間超過か別サービスの混同。'],
  ['Ghi lại trạng thái từng server nguồn (đã disconnect hay vẫn replicate) — replicate chạy tiếp vẫn tốn staging EBS rất nhỏ nhưng liên tục.','移行元サーバーごとの状態（切断済み / 複製継続中）を記録 — 複製継続中はステージング EBS の微課金が続きます。']
 ]
},

/* ---------- Mig 2 · On-prem → GCP (Migrate to VMs) ---------- */
mig1:{
 cost:['~$0.05–0.30 cho 1 đợt test clone vài giờ','~$0.05〜0.30 / テストクローンを数時間動かす1回分'],
 src:['Migrate to Virtual Machines bản thân không tính phí bản quyền; phí đến từ test clone Compute Engine khi chạy kiểm thử và dữ liệu replicate lưu tạm. Tắt/xoá test clone ngay sau kiểm thử là hết phí chính.','Migrate to Virtual Machines 自体にライセンス料はありません。課金はテストクローンの Compute Engine 稼働と一時保管データから — テストクローンを検証後すぐ削除すれば主因は消えます。'],
 pit:[
  {t:['Không khám phá (discovery) được hạ tầng nguồn — Migration Center báo rỗng','移行元インフラを検出できない（Migration Center が空）'],
   c:['Thiếu quyền đọc trên vCenter (tài khoản discovery cần quyền read-only toàn cục) hoặc đường mạng từ connector tới vCenter bị firewall chặn. Kiểm tra quyền và kết nối trước khi chạy lại discovery.','vCenter 側の読み取り権限不足（検出用アカウントには全体の read-only が必要）、またはコネクタ→vCenter 間がファイアウォールで遮断。権限と疎通を確認してから検出を再実行。'],
   cmd:'gcloud migration-center sources list 2>/dev/null || echo "kiem tra lai tren Migration Center Console"'},
  {t:['Replication chạy nhưng test clone khởi động lỗi / màn hình đen','複製は進むがテストクローンが起動エラー / 画面真っ黒'],
   c:['OS khách chưa tương thích boot (UEFI/BIOS, driver virtio) hoặc test clone gắn nhầm network không có đường quản trị. Tạo test clone trên mạng test riêng và xem serial console output để đọc lỗi boot thật.','ゲスト OS のブート非互換（UEFI/BIOS、virtio ドライバ）、またはテストクローンのネットワーク違い。テスト専用ネットワークで作り、シリアルコンソール出力で実際のブートエラーを読む。'],
   cmd:'gcloud compute instances get-serial-port-output ten-test-clone --zone=asia-northeast1-a | tail -30'},
  {t:['Ước tính chi phí đích trong Migration Center lệch xa thực tế','Migration Center の移行先コスト見積もりが実績と大きくずれる'],
   c:['Rightsizing mặc định dùng cấu hình nguồn thay vì hiệu năng sử dụng thật (utilization). Bật thu thập số liệu hiệu năng vài ngày rồi tính lại — VM on-prem thường over-provision 50–70%.','既定の見積もりが移行元の構成ベースで、実使用率（utilization）を見ていないのが原因。数日分の性能データを集めて再計算を — オンプレ VM は通常50〜70%過剰構成です。'],
   cmd:'gcloud migration-center groups list && gcloud migration-center assets list --limit=5'}
 ],
 clean:{
  gcp:'# === Google Cloud cleanup — Mig 2: Migrate to Virtual Machines ===\n# 1) Xoá test clone TRƯỚC (đây là phần tính tiền)\ngcloud compute instances delete ten-test-clone --zone=asia-northeast1-a --quiet\n# 2) Dừng replication & xoá migration job: làm trong Console\n#    Migrate to Virtual Machines → chọn source → migration → Delete\n#    (CLI chưa hỗ trợ đầy đủ vòng đời của Migrate to VMs)\n# 3) Gỡ connector/appliance phía nguồn nếu chỉ dựng cho lab\n# 4) Kiểm tra sót VM/disk do quá trình test tạo ra\ngcloud compute instances list && gcloud compute disks list'
 },
 bill:[
  ['GCE Console: không còn test clone nào đang RUNNING; mục Disks không còn đĩa sao chép mồ côi.','GCE コンソール：テストクローンが RUNNING で残っていないか。Disks に複製用の孤立ディスクがないか。'],
  ['GCP Billing lọc Compute Engine: phí phải dừng tăng ngay sau khi xoá test clone.','GCP Billing の Compute Engine 課金が、テストクローン削除直後に止まっているか。'],
  ['Migration Center/Migrate to VMs tự thân không có dòng phí riêng — nếu thấy phí lạ, thủ phạm là VM hoặc disk ở mục trên.','Migration Center / Migrate to VMs 自体に課金行はありません — 見慣れない課金は上記の VM かディスクが原因。'],
  ['Ghi trạng thái từng migration job (đã dừng/đã xoá) để lần học sau không replicate trùng lặp vô ích.','各マイグレーションジョブの状態（停止/削除済み）を記録し、次回の無駄な再複製を防ぐ。']
 ]
},

/* ---------- Mig 3 · VMware → GCVE ---------- */
mig2:{
 cost:['⚠ RẤT ĐẮT — cụm GCVE tính phí cố định theo node, cỡ vài trăm USD/ngày','⚠ 非常に高額 — GCVE クラスタはノード単位の固定費で1日数百ドル規模'],
 src:['GCVE là dịch vụ dạng cụm phần cứng dành riêng: phí tính theo node/giờ bất kể có VM chạy hay không, và cụm tối thiểu nhiều node. Đây là lab KHÔNG nên tự dựng bằng tài khoản cá nhân — chỉ làm khi có dự án/budget thật hoặc sandbox được cấp riêng; đọc kỹ bước và xem demo là đủ để nắm kiến trúc.','GCVE は専用ハードウェアのクラスタ型サービス：VM の有無に関わらずノード/時間で課金され、最小構成でも複数ノード。個人アカウントで自習用に作るべきではありません — 実際のプロジェクト予算か専用サンドボックスがある場合のみ。手順を読みデモを見るだけでもアーキテクチャは掴めます。'],
 pit:[
  {t:['Tạo private cloud GCVE báo hết quota / không tạo được ở region đã chọn','GCVE プライベートクラウド作成がクォータ不足 / 選択リージョンで作れない'],
   c:['GCVE cần quota node riêng theo region và không phải region nào cũng có sẵn node. Kiểm tra quota "GCVE nodes" và chọn region Tokyo nếu có; thiếu quota phải gửi request tăng quota và chờ duyệt (không tức thời).','GCVE はリージョン別の専用ノードクォータが必要で、全リージョンに在庫があるわけではありません。「GCVE nodes」クォータを確認し、東京があれば選択。不足時は引き上げ申請（即時ではありません）。'],
   cmd:'gcloud compute project-info describe --format="get(quotas)" | grep -i gcve || gcloud vmware locations list'},
  {t:['HCX vMotion/replication fail giữa chừng khi chuyển VM','VM 移行中の HCX vMotion / レプリケーションが途中で失敗する'],
   c:['Đường Interconnect/HCX tunnel thiếu băng thông hoặc MTU không khớp khiến gói lớn bị phân mảnh/rớt. Kiểm tra trạng thái service mesh và MTU hai đầu trước khi chạy lại — chuyển theo đợt nhỏ để cô lập VM lỗi.','Interconnect / HCX トンネルの帯域不足、または MTU 不一致で大きなパケットが落ちるのが典型。サービスメッシュの状態と両端 MTU を確認し、小さいバッチで切り分けて再実行。'],
   cmd:'gcloud vmware private-clouds describe gcve-lab --location=asia-northeast1-a --format="get(state,networkConfig)"'},
  {t:['VM chuyển sang GCVE nhưng mất kết nối về hệ thống on-prem còn lại','GCVE へ移した VM が、残りのオンプレ側システムと通信できない'],
   c:['Network stretching/route chưa quảng bá đúng dải IP của VM đã chuyển, hoặc firewall của GCVE chưa mở luồng về on-prem. Rà soát bảng route hai phía và rule HCX trước khi kết luận do ứng dụng.','ネットワーク拡張/ルートが移行済み VM の IP 帯を正しく広告していない、または GCVE 側ファイアウォール未開放。アプリを疑う前に両側のルート表と HCX ルールを確認。'],
   cmd:'gcloud vmware private-clouds subnets list --private-cloud=gcve-lab --location=asia-northeast1-a'}
 ],
 clean:{
  gcp:'# === Google Cloud cleanup — Mig 3: GCVE (CẨN THẬN: phí chạy tới khi cụm xoá XONG) ===\n# 1) Chuyển nốt VM cần giữ ra khỏi cụm / tắt VM theo kế hoạch của bạn\n# 2) Xoá HCX service mesh & network peering liên quan trong Console GCVE/HCX\n# 3) Xoá private cloud — quá trình xoá mất nhiều giờ, phí node vẫn tính trong lúc xoá\ngcloud vmware private-clouds delete gcve-lab --location=asia-northeast1-a\n# 4) Kiểm tra trạng thái cho tới khi cụm biến mất hoàn toàn khỏi danh sách\ngcloud vmware private-clouds list --location=asia-northeast1-a'
 },
 bill:[
  ['⚠ Kiểm tra MỖI NGÀY sau cleanup: cụm GCVE còn xuất hiện trong danh sách là phí node còn chạy — đây là khoản phí lớn nhất toàn bộ chương trình học.','⚠ cleanup 後は毎日確認：GCVE クラスタが一覧に残る間はノード課金が継続 — 学習全体で最大の課金項目です。'],
  ['GCP Billing lọc VMware Engine: dòng phí phải biến mất hẳn sau ngày cụm xoá xong; còn thấy là chưa xoá triệt để.','GCP Billing の VMware Engine：クラスタ削除完了日の翌日から課金行が消えること。残っていたら削除が未完。'],
  ['Interconnect attachment dành riêng cho GCVE: gỡ nếu không còn dùng — attachment dung lượng lớn cũng tính phí theo giờ.','GCVE 専用の Interconnect アタッチメント：不要なら外す — 大容量アタッチメントも時間課金です。'],
  ['Nếu lab này chỉ đọc lý thuyết (khuyến nghị): hoá đơn đúng phải là $0.00 — không có dòng VMware Engine nào cả.','座学のみの場合（推奨）：請求は $0.00 で、VMware Engine の行自体が存在しないことが正解です。']
 ]
},

/* ---------- Mig 4 · VMware → AWS Transform / EVS ---------- */
mig3:{
 cost:['⚠ ĐẮT nếu dựng EVS thật (phí host theo giờ) — MGN rehost thì ~$0.05–0.30/đợt test','⚠ EVS を実構築すると高額（ホスト時間課金）— MGN リホストなら1回 ~$0.05〜0.30'],
 src:['Hai nhánh chi phí khác hẳn nhau: nhánh MGN rehost rẻ như Mig 1; nhánh Amazon EVS dùng host dành riêng tính phí theo giờ kiểu GCVE — chỉ dựng khi có budget dự án. AWS Transform (phân tích & lập kế hoạch) bản thân không phải nguồn phí chính.','2つの分岐で費用が全く違います：MGN リホスト分岐は Mig 1 並みに安価。Amazon EVS 分岐は専用ホストの時間課金で GCVE と同類 — プロジェクト予算がある場合のみ。AWS Transform（分析・計画）自体は主因ではありません。'],
 pit:[
  {t:['AWS Transform phân tích xong nhưng kế hoạch sóng (wave plan) thiếu nhiều VM/ứng dụng','AWS Transform の分析後、ウェーブ計画に多くの VM / アプリが欠けている'],
   c:['Nguồn dữ liệu khám phá chưa đầy đủ (thiếu một vCenter hoặc khoảng thời gian thu thập quá ngắn nên phụ thuộc chưa lộ). Bổ sung nguồn và chạy lại phân tích trước khi chốt wave — wave sai phụ thuộc là nguyên nhân cutover fail hàng đầu.','検出データ不足（一部 vCenter 欠落、または収集期間が短く依存関係が出ていない）。ソースを追加して再分析してからウェーブを確定 — 依存ミスのウェーブはカットオーバー失敗の筆頭原因。'],
   cmd:'aws transform list-jobs --query "jobList[].{Id:id,Status:status}" 2>/dev/null || echo "kiem tra AWS Transform tren Console"'},
  {t:['Workload VMware chuyển lên EC2 bằng MGN nhưng hiệu năng/boot không ổn định','MGN で EC2 化した VMware ワークロードのブート / 性能が不安定'],
   c:['Khác biệt tầng hypervisor: driver thiết bị ảo (VMware Tools vs driver AWS), thứ tự boot và licensing theo socket có thể vỡ. Kiểm tra console output, thay driver theo hướng dẫn post-launch của MGN, và cân nhắc nhánh EVS cho workload quá “dính” VMware.','ハイパーバイザ差異：仮想デバイスドライバ（VMware Tools vs AWS ドライバ）、ブート順、ソケット単位ライセンスが壊れることがあります。コンソール出力を確認し、MGN の移行後手順でドライバを差し替え。VMware 依存が強いものは EVS 分岐を検討。'],
   cmd:'aws ec2 get-console-output --instance-id i-xxxx --query Output --output text | tail -30'},
  {t:['Nhánh EVS: môi trường EVS tạo rất lâu hoặc báo thiếu năng lực (capacity) ở AZ đã chọn','EVS 分岐：環境作成が非常に遅い / 選択 AZ で capacity 不足'],
   c:['EVS dùng host vật lý dành riêng nên phụ thuộc năng lực AZ tại thời điểm tạo — đổi AZ/region hoặc liên hệ AWS để đặt capacity trước cho đợt migration lớn. Đừng tạo đi tạo lại nhiều môi trường thử vì mỗi môi trường đều tính phí host.','EVS は専用物理ホストのため、作成時点の AZ キャパシティに依存します。AZ/リージョン変更か、大規模移行なら事前に AWS へキャパシティ確保を依頼。環境の作り直しは毎回ホスト課金なので避ける。'],
   cmd:'aws evs list-environments --query "environments[].{Id:environmentId,State:environmentState}" 2>/dev/null || echo "kiem tra Amazon EVS tren Console"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Mig 4: Transform / EVS / MGN ===\n# 1) Nhánh MGN: terminate test instance và disconnect replicate (như Mig 1)\naws ec2 terminate-instances --instance-ids i-xxxxxxxxxxxxxxxxx\n# 2) Nhánh EVS: xoá môi trường EVS (host ngừng tính phí khi môi trường xoá xong)\n#    aws evs delete-environment --environment-id env-xxxxxxxxxxxx\n#    (kiểm tra cú pháp theo phiên bản AWS CLI của bạn bằng: aws evs help)\n# 3) Dọn job phân tích của lab trong AWS Transform Console nếu không cần giữ kết quả\n# 4) Kiểm tra sót EC2/EVS còn chạy\naws ec2 describe-instances --filters Name=instance-state-name,Values=running --query "Reservations[].Instances[].{Id:InstanceId,Type:InstanceType}"'
 },
 bill:[
  ['Nếu có dựng EVS: kiểm tra môi trường EVS đã biến mất hoàn toàn — host EVS là phí theo giờ lớn, ngang GCVE.','EVS を作った場合：環境が完全消滅したか — EVS ホストは GCVE 並みの大きな時間課金です。'],
  ['EC2 Console: test instance của nhánh MGN đã terminate; EBS staging đã được dọn khi disconnect.','EC2 コンソール：MGN 分岐のテスト機が terminated、切断時にステージング EBS が片付いているか。'],
  ['Cost Explorer: tách rõ dòng phí EC2 (nhánh MGN) và EVS — hai nhánh phải cùng về 0 sau cleanup.','コストエクスプローラー：EC2（MGN 分岐）と EVS の行を分けて確認 — cleanup 後は両方 0 に。'],
  ['AWS Transform: job phân tích để lại không tốn đáng kể, nhưng kết quả wave plan nên xuất/lưu lại trước khi xoá job.','AWS Transform：分析ジョブの残存は僅少。ただし削除前にウェーブ計画の結果をエクスポートして保存を。']
 ]
},

/* ---------- Mig 5 · AWS → GCP (cross-cloud) ---------- */
mig4:{
 cost:['~$0.20–1.00+ tuỳ dung lượng dữ liệu chuyển (phí egress phía AWS)','~$0.20〜1.00+（転送データ量次第 — AWS 側 egress 料金）'],
 src:['Nguồn phí chính của cross-cloud KHÔNG nằm ở compute mà ở phí truyền dữ liệu ra khỏi cloud nguồn: AWS data transfer out ~$0.09/GB (bậc đầu). Chuyển 10GB dữ liệu test đã ~$0.90. Cộng thêm VM đích chạy kiểm thử ở GCP. Tính egress TRƯỚC khi chuyển dữ liệu lớn.','クロスクラウドの主因はコンピュートではなく、移行元からのデータ転送費：AWS の外向き転送は約$0.09/GB（初期階層）。テストデータ10GBで約$0.90。加えて GCP 側の検証 VM。大量転送の前に egress を必ず試算。'],
 pit:[
  {t:['Storage Transfer Service job fail với lỗi quyền đọc S3','Storage Transfer Service のジョブが S3 読み取り権限エラーで失敗'],
   c:['Service account của Storage Transfer (dạng project-...@storage-transfer-service.iam.gserviceaccount.com) chưa được cấp quyền trên bucket S3 bằng access key/role phía AWS. Cấp đúng quyền s3:GetObject/ListBucket cho danh tính đó và kiểm tra bucket policy không chặn cross-account.','Storage Transfer のサービスアカウント（project-...@storage-transfer-service...）に、AWS 側のキー/ロールで S3 権限が未付与。s3:GetObject/ListBucket をその主体に付与し、バケットポリシーがクロスアカウントを遮断していないか確認。'],
   cmd:'gcloud transfer jobs describe ten-job --format="get(status)" && gcloud transfer operations list --name=transferJobs/ten-job --format="get(metadata)" | head -5'},
  {t:['Migrate to VMs không replicate được EC2 nguồn (agent/connector lỗi)','Migrate to VMs が移行元 EC2 を複製できない（エージェント/コネクタのエラー）'],
   c:['Nguồn là cloud khác nên cần agent trên từng EC2 và đường mạng mở đúng cổng replicate về GCP; security group phía AWS chặn outbound là thủ phạm thường gặp. Kiểm tra outbound SG và trạng thái agent trước.','他クラウドがソースの場合は EC2 ごとにエージェントが必要で、複製用ポートの疎通も必須。AWS 側 SG のアウトバウンド遮断が頻出。アウトバウンド SG とエージェント状態を先に確認。'],
   cmd:'aws ec2 describe-security-groups --group-ids sg-xxxx --query "SecurityGroups[0].IpPermissionsEgress"'},
  {t:['Cutover xong nhưng người dùng vẫn vào hệ thống cũ phía AWS','カットオーバー後もユーザーが AWS 側の旧システムに到達してしまう'],
   c:['TTL của bản ghi DNS chưa được hạ trước 24–48h nên cache DNS khắp nơi vẫn giữ IP cũ, hoặc bản ghi ở registrar/zone khác chưa đổi. Kiểm tra bằng dig nhiều resolver và đối chiếu zone đang authoritative thật sự.','DNS レコードの TTL を24〜48時間前に下げていないため、各地のキャッシュが旧 IP を保持。または別ゾーン/レジストラ側が未変更。複数リゾルバで dig し、実際に権威のあるゾーンを照合。'],
   cmd:'dig +noall +answer app.example.com @8.8.8.8 && dig +noall +answer app.example.com @1.1.1.1'}
 ],
 clean:{
  aws:'# === Phía AWS (nguồn) cleanup — Mig 5: AWS → GCP ===\n# 1) Dừng hẳn phía nguồn SAU khi đã xác nhận đích GCP chạy ổn 1-2 tuần (đừng xoá sớm!)\n#    Giai đoạn học: chỉ STOP instance để còn đường lui, chưa terminate\naws ec2 stop-instances --instance-ids i-xxxxxxxxxxxxxxxxx\n# 2) Xoá đường hầm VPN dùng cho replicate (nếu dựng riêng cho lab)\n#    aws ec2 delete-vpn-connection --vpn-connection-id vpn-xxxxxxxx\n# 3) Gỡ access key/role đã cấp cho Storage Transfer Service phía AWS\n#    aws iam delete-access-key --user-name transfer-svc --access-key-id AKIAxxxx',
  gcp:'# === Phía GCP (đích) cleanup — Mig 5: AWS → GCP ===\n# 1) Xoá job chuyển dữ liệu khi đã chuyển xong\ngcloud transfer jobs delete ten-job --quiet\n# 2) Dừng/xoá replication trong Migrate to Virtual Machines (Console) sau cutover\n# 3) Xoá đường hầm VPN phía GCP nếu chỉ dùng cho đợt chuyển\ngcloud compute vpn-tunnels delete tun-lab --region=asia-northeast1 --quiet\n# 4) VM đích: giữ lại nếu đây là đích thật; nếu chỉ học thì xoá như cleanup Lab 2 phía GCP'
 },
 bill:[
  ['AWS Cost Explorer lọc Data Transfer: con số egress phải khớp ước tính ~$0.09/GB × dung lượng đã chuyển — lệch lớn nghĩa là có luồng dữ liệu ngoài kế hoạch.','AWS コストエクスプローラーで Data Transfer を確認：egress が想定（約$0.09/GB × 転送量）と合うか。大きくずれるなら計画外の転送あり。'],
  ['GCP Billing: VM đích + Cloud Storage đích là hai dòng phí mới — đối chiếu dung lượng bucket đích với nguồn để chắc chắn không chuyển trùng hai lần.','GCP Billing：移行先 VM と Cloud Storage が新しい課金行 — 移行先バケット容量と移行元を照合し、二重転送がないか確認。'],
  ['VPN hai phía: tunnel dựng riêng cho migration còn để sẽ tính phí theo giờ ở cả AWS lẫn GCP — gỡ khi đợt chuyển kết thúc.','両側の VPN：移行専用トンネルは AWS / GCP 両方で時間課金 — 移行完了後に外す。'],
  ['EC2 nguồn ở trạng thái stopped vẫn tốn phí EBS — ghi chú ngày dự định terminate hẳn vào kế hoạch (sau 1–2 tuần chạy ổn).','停止中の移行元 EC2 も EBS 課金は継続 — 完全 terminate の予定日（安定稼働1〜2週間後）を計画に明記。']
 ]
},

/* ---------- Mig 6 · GCP → AWS (cross-cloud) ---------- */
mig5:{
 cost:['~$0.20–1.00+ tuỳ dung lượng dữ liệu chuyển (phí egress phía GCP)','~$0.20〜1.00+（転送データ量次第 — GCP 側 egress 料金）'],
 src:['Giống chiều ngược lại: phí egress ra khỏi GCP (Premium Tier ~$0.08–0.12/GB tuỳ đích) là nguồn phí chính, cộng test instance EC2 phía đích. Hạ TTL DNS và chuyển traffic theo trọng số giúp giảm rủi ro chứ không giảm egress — muốn rẻ thì giảm dữ liệu thừa trước khi chuyển.','逆方向も同じ：GCP からの egress（Premium Tier で約$0.08〜0.12/GB）が主因、加えて移行先 EC2 のテスト機。TTL 短縮と重み付き移行はリスク低減策で egress は減りません — 安くするなら転送前に不要データを削る。'],
 pit:[
  {t:['Cài MGN agent lên Compute Engine: instance đích launch test bị lỗi boot/driver','Compute Engine への MGN エージェント導入後、テスト起動でブート/ドライバエラー'],
   c:['VM từ GCP mang driver/cấu hình của môi trường Google (guest agent, driver virtio khác) — khi sang EC2 cần qua bước test launch kỹ và gỡ guest agent của GCP nếu xung đột. Đọc console output của test instance để xác định điểm chết.','GCP の VM は Google 環境のドライバ/設定（ゲストエージェント等）を持ち込むため、EC2 側では入念なテスト起動と、競合する GCP ゲストエージェントの除去が必要なことがあります。テスト機のコンソール出力で停止点を確認。'],
   cmd:'aws ec2 get-console-output --instance-id i-xxxx --query Output --output text | tail -30'},
  {t:['Weighted routing đã đặt 10% nhưng gần như không có traffic sang phía AWS','重み付き 10% にしたのに AWS 側へほぼトラフィックが来ない'],
   c:['Hai bản ghi weighted phải dùng cùng Set Identifier logic và health check phía AWS nếu unhealthy sẽ bị Route 53 loại khỏi vòng quay — 10% của 0 vẫn là 0. Kiểm tra health check và TTL (cache giữ tỉ lệ cũ lâu hơn bạn nghĩ).','2つの重み付きレコードの設定不整合、または AWS 側ヘルスチェックが unhealthy で Route 53 が外している（10% × 0 = 0）。ヘルスチェックと TTL（キャッシュは想像以上に旧比率を保持）を確認。'],
   cmd:'aws route53 list-resource-record-sets --hosted-zone-id Zxxxx --query "ResourceRecordSets[?SetIdentifier!=null]" && aws route53 get-health-check-status --health-check-id xxxx'},
  {t:['Chuyển Cloud Storage → S3 bằng công cụ transfer: job chậm bất thường hoặc tính phí cao hơn dự kiến','Cloud Storage → S3 の転送ジョブが異常に遅い / 想定より高い'],
   c:['Vật nhỏ (rất nhiều object nhỏ) làm transfer chậm vì tốn thao tác từng object, và phí egress tính theo GB thực truyền — gồm cả lần chạy lại khi fail. Gộp/đóng gói dữ liệu lạnh và chạy job một lần cho đúng thay vì chạy thử nhiều lần trên toàn bộ dữ liệu.','小さいオブジェクトが大量だと1件ずつ処理で遅くなり、egress は実転送 GB 課金（失敗した再実行分も含む）。コールドデータはまとめ、全データでの試行を繰り返さない。'],
   cmd:'aws s3 ls s3://bucket-dich --recursive --summarize | tail -2'}
 ],
 clean:{
  aws:'# === Phía AWS (đích) cleanup — Mig 6: GCP → AWS ===\n# 1) Sau cutover hoàn tất: disconnect server nguồn trong MGN Console\n#    rồi terminate các test instance còn sót\naws ec2 terminate-instances --instance-ids i-xxxxxxxxxxxxxxxxx\n# 2) DMS (nếu lab dùng cho DB): dọn theo khối cleanup của Mig 7 phía AWS\n# 3) Chốt tỉ lệ Route 53 weighted về 100% phía AWS và xoá bản ghi trỏ về GCP\n#    (làm trên Console Route 53 để tránh nhầm Set Identifier)',
  gcp:'# === Phía GCP (nguồn) cleanup — Mig 6: GCP → AWS ===\n# 1) Giai đoạn học: chỉ STOP VM nguồn để còn đường lui, chưa xoá ngay\ngcloud compute instances stop ten-vm-nguon --zone=asia-northeast1-a --quiet\n# 2) Xoá đường hầm VPN/Interconnect attachment dựng riêng cho đợt chuyển (nếu có)\ngcloud compute vpn-tunnels delete tun-lab --region=asia-northeast1 --quiet\n# 3) Sau 1-2 tuần ổn định mới xoá hẳn VM nguồn + disk\n#    gcloud compute instances delete ten-vm-nguon --zone=asia-northeast1-a --quiet'
 },
 bill:[
  ['GCP Billing lọc Network Egress: đối chiếu GB egress với dung lượng dữ liệu đã chuyển — đây là dòng phí quyết định của lab này.','GCP Billing で Network Egress を確認：転送したデータ量と GB が合うか — このラボの決定的な課金行です。'],
  ['AWS Cost Explorer: EC2 đích + phí DataSync/transfer (nếu dùng) — test instance đã terminate, không còn instance staging chạy ngầm.','AWS コストエクスプローラー：移行先 EC2 と転送系費用 — テスト機が terminated で、ステージング機が裏で動いていないか。'],
  ['VM nguồn GCP ở trạng thái STOPPED vẫn tốn phí disk persistent — ghi ngày xoá hẳn vào kế hoạch như chiều ngược lại.','停止中の移行元 VM（GCP）も永続ディスク課金は継続 — 完全削除の予定日を計画に明記（逆方向と同じ）。'],
  ['Route 53 health check tính phí theo check/tháng — health check của lab không dùng nữa thì xoá để khỏi lẫn với check thật.','Route 53 ヘルスチェックは件数/月課金 — ラボ用で不要なら削除し、本番用と混ざらないように。']
 ]
},

/* ---------- Mig 7 · Oracle on-prem → Aurora (DMS + SCT) ---------- */
mig6:{
 cost:['~$0.30–0.60 nếu để replication chạy 1 ngày tập luyện','~$0.30〜0.60 / 複製を1日動かして練習した場合'],
 src:['Nguồn phí chính: Aurora cluster (instance + storage + I/O) và DMS replication instance (dms.t3.medium ~$0.036/giờ) chạy liên tục trong lúc CDC. SCT miễn phí. Lab kéo dài 2–6 tuần ở dự án thật — khi học, hãy nén vào vài buổi và xoá replication instance ngay khi không tập.','主な課金源：Aurora クラスタ（インスタンス＋ストレージ＋I/O）と、CDC 中ずっと動く DMS 複製インスタンス（dms.t3.medium 約$0.036/時）。SCT は無料。実案件では2〜6週間ですが、学習では数セッションに圧縮し、練習しない時間は複製インスタンスを消す。'],
 pit:[
  {t:['Full load xong nhưng CDC không đồng bộ thay đổi mới nào từ Oracle','フルロードは終わったのに Oracle からの CDC が一切流れてこない'],
   c:['Oracle chưa bật supplemental logging (ít nhất ở mức database + theo bảng) nên LogMiner không có dữ liệu thay đổi để đọc. Bật supplemental logging phía nguồn rồi khởi động lại task — đây là lỗi CDC kinh điển số 1.','Oracle 側でサプリメンタルロギング（最低限 DB レベル＋表単位）が未有効化で、LogMiner が変更を読めません。移行元で有効化してタスクを再起動 — CDC の古典的エラー第1位。'],
   cmd:'aws dms describe-replication-tasks --filters Name=replication-task-id,Values=oracle-task --query "ReplicationTasks[0].{Status:Status,Stats:TableStatistics}"'},
  {t:['Test endpoint connection phía nguồn báo fail dù thông tin host/port đúng','エンドポイント接続テストが、ホスト/ポートが正しいのに失敗する'],
   c:['Replication instance nằm trong VPC/subnet không có đường tới nguồn (thiếu VPN/DX/route) hoặc security group chặn cổng 1521. Nhớ mô hình: DMS instance là bên chủ động kết nối tới cả nguồn lẫn đích — kiểm tra route + SG từ vị trí của replication instance.','複製インスタンスの VPC/サブネットから移行元への経路がない（VPN/DX/ルート不足）、または SG が 1521 を遮断。DMS インスタンスが能動的に両側へ接続するモデル — 複製インスタンスの位置からルート＋SG を確認。'],
   cmd:'aws dms test-connection --replication-instance-arn <ri-arn> --endpoint-arn <src-arn> && aws dms describe-connections --filters Name=endpoint-arn,Values=<src-arn>'},
  {t:['Dữ liệu sang Aurora bị thiếu cột/sequence nhảy sai, một số bảng lỗi LOB','Aurora 側で列欠落 / シーケンスずれ、一部テーブルで LOB エラー'],
   c:['DMS không chuyển mọi thứ: sequence, một số index phụ và ràng buộc phải tạo tay; cột LOB lớn cần chế độ Limited LOB/Full LOB phù hợp. Đối chiếu bằng DMS validation và danh sách đối tượng SCT đã đánh dấu “cần xử lý tay” trước khi trách dữ liệu.','DMS は全てを移しません：シーケンス、一部の副次インデックスや制約は手作業。大きな LOB 列には適切な LOB モードが必要。データを疑う前に DMS 検証と、SCT が「手作業」と mark した一覧を照合。'],
   cmd:'aws dms describe-table-statistics --replication-task-arn <task-arn> --query "TableStatistics[?TableState!=\'Table loaded\']"'}
 ],
 clean:{
  aws:'# === AWS cleanup — Mig 7: DMS + Aurora ===\n# 1) Dừng rồi xoá replication task TRƯỚC\naws dms stop-replication-task --replication-task-arn <task-arn>\naws dms delete-replication-task --replication-task-arn <task-arn>\n# 2) Xoá endpoints hai đầu\naws dms delete-endpoint --endpoint-arn <src-arn>\naws dms delete-endpoint --endpoint-arn <dst-arn>\n# 3) Xoá replication instance (khoản phí chạy liên tục của lab)\naws dms delete-replication-instance --replication-instance-arn <ri-arn>\n# 4) Xoá Aurora cluster — bỏ qua final snapshot nếu chỉ là lab\n#    aws rds delete-db-instance --db-instance-identifier aurora-1 --skip-final-snapshot\n#    aws rds delete-db-cluster --db-cluster-identifier aurora-cluster --skip-final-snapshot'
 },
 bill:[
  ['DMS Console: không còn replication instance nào ở trạng thái available — instance DMS tính phí liên tục dù task đã dừng.','DMS コンソール：available 状態の複製インスタンスが残っていないか — タスク停止後もインスタンスは課金され続けます。'],
  ['RDS Console → Aurora cluster đã xoá; Snapshots: không có snapshot export/sao lưu thủ công sót lại.','RDS コンソール：Aurora クラスタが削除済み。Snapshots：手動スナップショットの残りがないか。'],
  ['Cost Explorer lọc DMS + RDS: hai dòng này phải cùng về 0 trong ngày sau cleanup — CDC để chạy qua tuần là kịch bản tốn tiền nhất của nhóm migration.','コストエクスプローラーで DMS＋RDS：cleanup 翌日に両方 0 へ — CDC を週単位で放置するのが移行グループ最悪の課金シナリオ。'],
  ['Phía Oracle nguồn: supplemental logging bật thêm cho lab có thể giữ nguyên (không tốn phí AWS) nhưng ghi chú lại cho DBA phía nguồn.','移行元 Oracle：ラボ用に有効化したサプリメンタルロギングは残しても AWS 課金なし。ただし移行元 DBA 向けにメモを残す。']
 ]
},

/* ---------- Mig 8 · DB cross-cloud Cloud SQL ⇄ RDS / AlloyDB ⇄ Aurora ---------- */
mig7:{
 cost:['~$0.20–0.50 nếu để hai phía + replication chạy 1 ngày tập luyện','~$0.20〜0.50 / 両側＋複製を1日動かした場合'],
 src:['Phí gồm BA phần chạy đồng thời: database nguồn, database đích và công cụ replication (DMS/GCP DMS) ở giữa, cộng egress cross-cloud theo GB thay đổi. Đây là lab migration dễ “chảy tiền” nhất nếu để CDC chạy quên — tập xong là dừng job ngay.','課金は3要素が同時進行：移行元 DB、移行先 DB、間の複製ツール（DMS / GCP DMS）、加えて変更量に応じたクロスクラウド egress。CDC を忘れると最もお金が漏れる移行ラボ — 練習が終わったら即ジョブ停止。'],
 pit:[
  {t:['Job migration báo lỗi kết nối dù đã mở VPN/Interconnect giữa hai VPC','2つの VPC 間に VPN/Interconnect を開けたのに移行ジョブが接続エラー'],
   c:['Firewall hai phía mới mở chiều “người dùng” mà quên rằng instance DMS mới là bên kết nối: cần mở đúng IP của replication instance/DMS subnet tới cổng DB ở cả hai đầu. Kiểm tra bằng telnet/nc từ một VM cùng subnet với DMS trước.','両側ファイアウォールが「ユーザー側」だけ開いていて、実際に接続するのは DMS インスタンス側という点が抜けています。DMS の IP/サブネットから両端の DB ポートへ開ける。まず DMS と同じサブネットの VM から telnet/nc で確認。'],
   cmd:'aws dms describe-connections --query "Connections[].{Ep:Endpoint.EndpointIdentifier,Status:Status}"'},
  {t:['Full load khớp số bản ghi nhưng ứng dụng lỗi vì thiếu user/grant và sequence','フルロードの件数は合うのに、ユーザー/権限とシーケンス欠落でアプリがエラー'],
   c:['DMS (cả hai hãng) không chuyển tài khoản DB, grant và giá trị hiện tại của sequence/identity. Phải xuất/áp lại user+grant bằng tay và set sequence về max(id)+1 sau cutover — bước này nằm ngoài job migration.','DMS（両社とも）は DB アカウント、権限、シーケンスの現在値を移しません。ユーザー＋権限は手作業で再適用し、カットオーバー後にシーケンスを max(id)+1 へ — これは移行ジョブの範囲外です。'],
   cmd:'echo "Tren DB dich: SELECT max(id) FROM bang_lon; va doi chieu sequence hien tai"'},
  {t:['Độ trễ CDC (replication lag) tăng dần không giảm khi tải ghi cao','書き込み負荷が高いと CDC の遅延（レプリケーションラグ）が増え続ける'],
   c:['Replication instance quá nhỏ cho khối lượng thay đổi, hoặc bảng thiếu primary key khiến DMS phải quét toàn bảng cho mỗi thay đổi. Kiểm tra lag theo bảng, bổ sung PK/index cho bảng nặng và nâng cỡ replication instance trong giờ cao điểm.','変更量に対して複製インスタンスが小さすぎる、または主キーなしテーブルで毎回全表スキャン。テーブル単位の遅延を確認し、重いテーブルに PK/インデックスを追加、ピーク時は複製インスタンスを増強。'],
   cmd:'aws dms describe-replication-tasks --query "ReplicationTasks[0].ReplicationTaskStats" && gcloud database-migration migration-jobs list --region=asia-northeast1'}
 ],
 clean:{
  aws:'# === Phía AWS cleanup — Mig 8: DB cross-cloud ===\n# 1) Dừng & xoá task DMS (nếu chiều về AWS dùng DMS)\naws dms stop-replication-task --replication-task-arn <task-arn>\naws dms delete-replication-task --replication-task-arn <task-arn>\naws dms delete-endpoint --endpoint-arn <ep-arn>\naws dms delete-replication-instance --replication-instance-arn <ri-arn>\n# 2) DB đích tạo chỉ để học: xoá RDS/Aurora theo cleanup Lab 4 / Mig 7\n#    aws rds delete-db-instance --db-instance-identifier dich-db --skip-final-snapshot',
  gcp:'# === Phía GCP cleanup — Mig 8: DB cross-cloud ===\n# 1) Dừng & xoá migration job và connection profile của GCP DMS\ngcloud database-migration migration-jobs stop ten-job --region=asia-northeast1\ngcloud database-migration migration-jobs delete ten-job --region=asia-northeast1 --quiet\ngcloud database-migration connection-profiles delete prof-nguon --region=asia-northeast1 --quiet\n#    gcloud database-migration connection-profiles delete prof-dich --region=asia-northeast1 --quiet\n# 2) DB đích tạo chỉ để học: xoá Cloud SQL theo cleanup Lab 4 phía GCP\n#    gcloud sql instances delete dich-db --quiet'
 },
 bill:[
  ['Cả hai phía: replication (DMS instance / GCP DMS job) đã dừng hẳn — CDC là khoản phí “chạy ngầm” duy nhất còn lại sau khi DB đích đã ổn định.','両側確認：複製（DMS インスタンス / GCP DMS ジョブ）が完全停止 — 移行先 DB 安定後に残る「裏課金」は CDC だけ。'],
  ['Đọc hoá đơn theo cặp: RDS/Aurora phía AWS và Cloud SQL/AlloyDB phía GCP — lab học thì cả hai phải về 0 sau cleanup (trừ DB bạn chủ đích giữ).','請求をペアで読む：AWS 側 RDS/Aurora と GCP 側 Cloud SQL/AlloyDB — 学習目的なら意図的に残す DB 以外は cleanup 後 0 に。'],
  ['Egress cross-cloud của giai đoạn CDC: đối chiếu GB với khối lượng thay đổi thực tế của DB — bất thường cao nghĩa là có bảng đang bị đồng bộ lại toàn bộ.','CDC 期間のクロスクラウド egress：実際の変更量と GB を照合 — 異常に高い場合は全表再同期されているテーブルあり。'],
  ['Giữ lại replication vài ngày làm đường lui là chủ đích tốt — nhưng phải ghi rõ ngày tắt cuối cùng vào kế hoạch, đừng để “vài ngày” thành vô hạn.','ロールバック用に複製を数日残すのは良い判断 — ただし最終停止日を計画に明記し、「数日」が無期限にならないように。']
 ]
},

/* ---------- Mig 9 · File server → Cloud ---------- */
mig8:{
 cost:['~$0.20–0.50/ngày tuỳ dung lượng file đồng bộ và loại FSx/Filestore','~$0.20〜0.50/日（同期するファイル容量と FSx/Filestore の種別次第）'],
 src:['Nguồn phí chính: FSx for Windows tính theo dung lượng cấp phát (bản SSD tối thiểu đã có giá đáng kể) và DataSync tính theo GB dữ liệu truyền (~$0.0125/GB); phía GCP là Filestore/NetApp Volumes theo dung lượng. Đồng bộ 100GB qua DataSync chỉ ~$1.25 tiền truyền — phần đắt là file system để quên nhiều ngày.','主な課金源：FSx for Windows は割り当て容量課金（SSD の最小構成でも相応の価格）、DataSync は転送 GB 課金（約$0.0125/GB）。GCP 側は Filestore / NetApp Volumes が容量課金。DataSync で100GB同期しても転送費は約$1.25 — 高いのはファイルシステムの数日放置です。'],
 pit:[
  {t:['DataSync agent không kích hoạt (activate) được từ console','DataSync エージェントがコンソールからアクティベートできない'],
   c:['Agent cần đường mạng tới endpoint của DataSync (public hoặc VPC endpoint) trên cổng 443 từ chính VM agent. Kiểm tra outbound của VM agent và DNS trước; agent đặt sau proxy thì phải cấu hình proxy cho agent.','エージェント VM 自身から DataSync エンドポイント（パブリックまたは VPC エンドポイント）へ 443 の疎通が必要。VM のアウトバウンドと DNS を先に確認。プロキシ配下ならエージェントにプロキシ設定を。'],
   cmd:'aws datasync describe-agent --agent-arn <agent-arn> --query "{Status:Status,Endpoint:EndpointType}"'},
  {t:['Task đồng bộ xong nhưng quyền NTFS/ACL trên FSx không giống nguồn','同期は完了したが FSx 側の NTFS/ACL 権限が移行元と違う'],
   c:['Tuỳ chọn copy quyền (Posix/Ntfs) chưa bật đúng trong cấu hình task — mặc định không phải lúc nào cũng mang theo ACL. Kiểm tra Options của task (PreserveDeletedFiles, ObjectTags, và phần quyền) rồi chạy lại vòng sync tăng dần.','タスク設定で権限コピーのオプション（NTFS/Posix）が正しく有効化されていない — 既定では ACL が常に付いてくるとは限りません。タスクの Options（削除保持、タグ、権限まわり）を確認し、増分同期を再実行。'],
   cmd:'aws datasync describe-task --task-arn <task-arn> --query "Options"'},
  {t:['Phía GCP: Storage Transfer job báo lỗi quyền trên đích Filestore/NetApp hoặc nguồn on-prem','GCP 側：Storage Transfer ジョブが移行先 Filestore/NetApp や移行元で権限エラー'],
   c:['Agent phía on-prem chạy bằng tài khoản không đủ quyền đọc toàn bộ cây thư mục (hay gặp ở thư mục kế thừa quyền lạ), hoặc đích chưa mount/gắn đúng quyền ghi. Kiểm tra log chi tiết của job để biết file/thư mục đầu tiên bị từ chối.','オンプレ側エージェントのアカウントに、ツリー全体の読み取り権限がない（特殊な継承権限のフォルダで頻発）、または移行先の書き込み権限/マウント不備。ジョブ詳細ログで最初に拒否されたファイルを確認。'],
   cmd:'gcloud transfer jobs describe ten-job --format="get(status)" && gcloud transfer operations list --name=transferJobs/ten-job --format="table(metadata.status,metadata)" | head -5'}
 ],
 clean:{
  aws:'# === AWS cleanup — Mig 9: DataSync + FSx ===\n# 1) Xoá task TRƯỚC rồi mới xoá location hai đầu và agent\naws datasync delete-task --task-arn <task-arn>\naws datasync delete-location --location-arn <loc-nguon-arn>\naws datasync delete-location --location-arn <loc-fsx-arn>\naws datasync delete-agent --agent-arn <agent-arn>\n# 2) Xoá FSx file system (chọn tạo final backup nếu dữ liệu là thật;\n#    lab học thì bỏ qua backup để khỏi tốn phí lưu trữ)\naws fsx delete-file-system --file-system-id fs-xxxxxxxxxxxxxxxxx\n# 3) Kiểm tra sót snapshot/backup FSx trong AWS Backup\naws backup list-recovery-points-by-backup-vault --backup-vault-name Default --query "RecoveryPoints[?ResourceType==\'AMAZON_FSx\']" 2>/dev/null | head -5',
  gcp:'# === Google Cloud cleanup — Mig 9: Storage Transfer + Filestore ===\n# 1) Xoá transfer job\ngcloud transfer jobs delete ten-job --quiet\n# 2) Xoá Filestore instance đích (nếu chỉ tạo để học)\ngcloud filestore instances delete file-dich --zone=asia-northeast1-a --quiet\n# 3) Gỡ agent phía on-prem (uninstall trên máy agent) nếu không dùng tiếp'
 },
 bill:[
  ['FSx Console: file system đã ở trạng thái DELETED — FSx tính theo dung lượng cấp phát từng giờ, để quên 1 tuần là khoản phí lớn nhất lab này.','FSx コンソール：ファイルシステムが DELETED 状態か — FSx は割り当て容量の時間課金で、1週間の放置がこのラボ最大の課金。'],
  ['Filestore (GCP) tương tự: instance đích đã xoá hoặc được giữ có chủ đích kèm ngày rà soát.','Filestore（GCP）も同様：移行先インスタンスが削除済み、または見直し日付きで意図的に保持。'],
  ['DataSync (Cost Explorer): phí truyền tính theo GB — đối chiếu với dung lượng đã đồng bộ; số GB cao bất thường nghĩa là task đã chạy lặp nhiều vòng ngoài kế hoạch.','DataSync（コストエクスプローラー）：転送費は GB 課金 — 同期した容量と照合。異常に多い場合は計画外の繰り返し実行あり。'],
  ['AWS Backup / snapshot FSx: recovery point tạo tự động khi xoá FSx (nếu bạn chọn final backup) vẫn tính phí lưu trữ — xoá khi chắc chắn không cần.','AWS Backup / FSx スナップショット：FSx 削除時の最終バックアップ（選んだ場合）は保管課金が継続 — 不要と確定したら削除。']
 ]
}
};

/* ================= THANH TIẾN ĐỘ Ở ĐẦU TRANG LABS ================= */
var progHost=null;
function renderLabProg(){
  if(!progHost) return;
  var total=totalLabs(), done=doneCount(), pct=total?Math.round(done*100/total):0;
  progHost.innerHTML='<div class="lp-top"><b>🧪 '+L('Tiến độ Labs','ラボ進捗')+': '
    +L('Đã hoàn thành '+done+'/'+total+' lab','全'+total+'件中 '+done+' 件完了')
    +' <span style="font-weight:600;color:var(--muted);font-size:13px">('+L('12 lab thực hành + 9 lab migration','実践ラボ12件＋移行ラボ9件')+')</span></b>'
    +'<span class="lp-pct">'+pct+'%</span></div>'
    +'<div class="lp-bar"><div class="lp-fill" style="width:'+pct+'%"></div></div>'
    +'<p class="lp-note">'+L('Đánh dấu “Đã làm xong” ngay trên thẻ lab hoặc trong trang chi tiết của từng lab — tiến độ được lưu trong trình duyệt này (localStorage) để lần sau học tiếp đúng chỗ.','各ラボのカード、または詳細ページで「完了」をマークしてください — 進捗はこのブラウザ（localStorage）に保存され、次回の続きに使えます。')+'</p>';
}
try{
  var labsSec=$('labs');
  if(labsSec){
    progHost=document.createElement('div');
    progHost.className='lab-prog'; progHost.id='labProg';
    var tools=labsSec.querySelector('.lab-tools');
    if(tools&&tools.parentNode) tools.parentNode.insertBefore(progHost,tools);
    else labsSec.querySelector('.wrap').appendChild(progHost);
    renderLabProg();
  }
}catch(e){}

/* ================= THẺ LAB: NHÃN CHI PHÍ + NÚT ĐÃ XONG ================= */
function doneBtnLabel(done,big){
  if(done) return '✓ '+(big?L('Đã làm xong lab này','このラボは完了済み'):L('Đã làm xong — bấm để bỏ đánh dấu','完了済み — クリックで解除'));
  return '☐ '+L('Đánh dấu đã làm xong lab này','このラボを完了としてマーク');
}
function syncCard(card){
  var zone=card.querySelector('.lab2-zone'); if(!zone) return;
  var key=zone.getAttribute('data-labkey'), d=LAB2[key]; if(!d) return;
  var done=!!LDONE[key];
  card.classList.toggle('is-done',done);
  var chip=zone.querySelector('.lab-cost-chip');
  if(chip) chip.textContent='💰 '+L('Chi phí 1 lần làm: ','1回の実施コスト：')+pick(d.cost);
  var btn=zone.querySelector('.lab-done-btn');
  if(btn){ btn.classList.toggle('on',done); btn.textContent=doneBtnLabel(done,false); btn.setAttribute('aria-pressed',done?'true':'false'); }
  var meta=card.querySelector('.lab-meta'), badge=card.querySelector('.lab-done-badge');
  if(done&&meta&&!badge){
    badge=document.createElement('span'); badge.className='tag lab-done-badge'; badge.textContent=L('✓ Đã xong','✓ 完了');
    meta.appendChild(badge);
  } else if(done&&badge){ badge.textContent=L('✓ Đã xong','✓ 完了'); }
  else if(!done&&badge){ badge.remove(); }
}
function addToCard(card,kind,idx){
  var key=keyOf(kind,idx), d=LAB2[key]; if(!d||card.querySelector('.lab2-zone')) return;
  var zone=document.createElement('div'); zone.className='lab2-zone'; zone.setAttribute('data-labkey',key);
  var chip=document.createElement('div'); chip.className='lab-cost-chip';
  zone.appendChild(chip);
  var btn=document.createElement('button'); btn.type='button'; btn.className='lab-done-btn'; btn.setAttribute('data-done',key);
  btn.addEventListener('click',function(ev){ ev.preventDefault(); ev.stopPropagation(); toggleDone(key); });
  zone.appendChild(btn);
  card.appendChild(zone);
  syncCard(card);
}
/* Ánh xạ thẻ lab thực hành -> chỉ số gốc trong LABS.
   Hàm filteredLabIdx gốc nằm trong IIFE của app.js nên trước đây
   `typeof filteredLabIdx` ở đây luôn là 'undefined' -> toàn bộ nhánh
   #labGrid bị bỏ qua (thẻ migration không phụ thuộc hàm này nên vẫn chạy).
   Nay tự tính lại tại chỗ + đối chiếu thêm 2 nguồn độc lập để không
   bao giờ lệch khi lọc / đổi ngôn ngữ:
   1) href của nút chi tiết app.js đã gắn (#/lab/<idx>) — ground truth;
   2) danh sách đã lọc tự tính từ #labFilter/#labLevel + LABS/LVLLAB;
   3) khớp tiêu đề thẻ (h3) với LABS[i].t. */
function myFilteredLabIdx(){
  try{ if(typeof window!=='undefined'&&typeof window.__filteredLabIdx==='function') return window.__filteredLabIdx(); }catch(e){}
  try{ if(typeof window!=='undefined'&&typeof window.filteredLabIdx==='function') return window.filteredLabIdx(); }catch(e){}
  var out=[];
  var domEl=$('labFilter'), lvEl=$('labLevel');
  var dom=domEl?domEl.value:'all', lv=lvEl?lvEl.value:'all';
  if(typeof LABS!=='undefined'&&LABS){
    LABS.forEach(function(l,i){
      if(dom!=='all'&&l.dom!==dom) return;
      if(lv!=='all'&&typeof LVLLAB!=='undefined'&&LVLLAB[l.lv]!==lv) return;
      out.push(i);
    });
  }
  return out;
}
function labIdxForCard(card,pos,idxs){
  var a=card.querySelector('.lab-detail-btn');
  if(a){ var m=(a.getAttribute('href')||'').match(/#\/lab\/(\d+)/); if(m) return +m[1]; }
  if(idxs&&idxs[pos]!==undefined) return idxs[pos];
  var h=card.querySelector('h3');
  if(h&&typeof LABS!=='undefined'&&LABS){
    var t=h.textContent.trim();
    for(var i=0;i<LABS.length;i++){ if(LABS[i].t===t) return i; }
  }
  return undefined;
}
function decorateLabCards(){
  try{
    var lg=$('labGrid');
    if(lg){
      var idxs=myFilteredLabIdx();
      Array.prototype.forEach.call(lg.querySelectorAll('.lab-card'),function(card,pos){
        var idx=labIdxForCard(card,pos,idxs); if(idx!==undefined) addToCard(card,'lab',idx);
      });
    }
    var mg=$('migGrid');
    if(mg){
      Array.prototype.forEach.call(mg.querySelectorAll('.lab-card'),function(card,pos){ addToCard(card,'mig',pos); });
    }
  }catch(e){}
}
function refreshLabCards(){
  Array.prototype.forEach.call(document.querySelectorAll('.lab-card'),function(card){ syncCard(card); });
}
function toggleDone(key){
  if(LDONE[key]) delete LDONE[key]; else LDONE[key]=true;
  saveDone(); refreshLabCards(); renderLabProg(); syncDetailBtn(key);
}
try{
  decorateLabCards();
  ['labGrid','migGrid'].forEach(function(id){
    var g=$(id); if(g) new MutationObserver(function(){ decorateLabCards(); }).observe(g,{childList:true});
  });
  /* Mạng an toàn trực tiếp: mỗi lần lọc lab, renderLabs() thay toàn bộ
     innerHTML của #labGrid (xoá cả .lab2-zone) — gắn lại ngay sau render,
     không phụ thuộc riêng vào MutationObserver. addToCard có chốt chống
     gắn trùng (.lab2-zone đã tồn tại thì bỏ qua). */
  ['labFilter','labLevel'].forEach(function(id){
    var s=$(id); if(s) s.addEventListener('change',function(){ setTimeout(decorateLabCards,30); setTimeout(decorateLabCards,180); });
  });
  /* Bắt các lần render muộn ngay sau khi trang mở (app.js gắn nút chi tiết,
     đổi route…) — vẫn an toàn nhờ chốt chống trùng ở trên. */
  setTimeout(decorateLabCards,150);
  setTimeout(decorateLabCards,650);
}catch(e){}

/* ================= TRANG CHI TIẾT LAB: CHI PHÍ + ĐÃ XONG + LỖI + CLEANUP ================= */
var curDetail=null;
function syncDetailBtn(key){
  var body=$('labDetailBody'); if(!body) return;
  var btn=body.querySelector('.lab-done-btn[data-done="'+key+'"]'); if(!btn) return;
  var done=!!LDONE[key];
  btn.classList.toggle('on',done);
  btn.textContent=doneBtnLabel(done,true);
  btn.setAttribute('aria-pressed',done?'true':'false');
}
function pitHTML(d,num){
  var h='<div class="dsec pit"><h3>'+num+' · 🔧 '+L('Top 3 lỗi hay gặp nhất của lab này','このラボでよくあるエラー Top 3')+' (Common Pitfalls)</h3>'
    +'<p>'+L('Ba lỗi dưới đây là đặc thù của chính lab này (không phải lỗi chung chung) — gặp đúng hiện tượng thì đi thẳng tới lệnh kiểm tra tương ứng.','以下はこのラボ固有のエラー Top 3 です（一般論ではありません）— 症状が一致したら、対応する確認コマンドへ直行してください。')+'</p>'
    +'<ol class="pit-list">';
  d.pit.forEach(function(p){
    h+='<li><b>'+L('Hiện tượng: ','症状：')+'</b>'+E(pick(p.t))
      +'<p><b>'+L('Nguyên nhân & cách xử lý: ','原因と対処：')+'</b>'+E(pick(p.c))+'</p>'
      +'<div class="pit-cmd">'+L('Lệnh kiểm tra: ','確認コマンド：')+'<span class="mono">'+E(p.cmd)+'</span></div></li>';
  });
  return h+'</ol></div>';
}
function codeBlock(script){
  return '<div class="code-wrap"><button class="copy-btn" type="button">Copy</button><pre class="code">'+E(script)+'</pre></div>';
}
function cleanHTML(d,num,isMig){
  var h='<div class="dsec cleanup"><h3>'+num+' · 🧹 '+L('Dọn dẹp 1-Click','ワンクリック後片付け')+' (Cleanup Script)</h3>'
    +'<p>'+L('Toàn bộ lệnh xoá tài nguyên của lab đã được gom vào một khối duy nhất, sắp xếp theo đúng thứ tự phụ thuộc an toàn (xoá phần “chặn đường” trước, xoá mạng/VPC sau cùng). Thay các giá trị placeholder (ID, tên tài nguyên) bằng giá trị thật của bạn, copy cả khối và chạy trong Cloud Shell tương ứng.','このラボのリソース削除コマンドを、安全な依存順序（先に「塞いでいる側」を消し、ネットワーク/VPC は最後）で1ブロックにまとめました。プレースホルダ（ID、リソース名）を自分の値に置き換え、ブロックごとコピーして対応する Cloud Shell で実行してください。')+'</p>'
    +'<p class="clean-warn">⚠ '+L('Kiểm tra kỹ region/project đang chọn trước khi chạy — lệnh xoá không hoàn tác được.','実行前にリージョン/プロジェクトの選択を必ず確認 — 削除は取り消せません。')+'</p>';
  if(d.clean.aws) h+='<h4>'+L('AWS — bash (AWS CloudShell)','AWS — bash（AWS CloudShell）')+'</h4>'+codeBlock(d.clean.aws);
  if(d.clean.gcp) h+='<h4>'+L('Google Cloud — bash (Cloud Shell)','Google Cloud — bash（Cloud Shell）')+'</h4>'+codeBlock(d.clean.gcp);
  h+='<h4>✅ '+L('Checklist kiểm tra hoá đơn sau cleanup','cleanup 後の請求チェックリスト')+'</h4>'
    +'<ul class="check-list lab2-bill">'
    +d.bill.map(function(b){ return '<li><input type="checkbox" /><span>'+E(pick(b))+'</span></li>'; }).join('')
    +'</ul>'
    +'<p style="font-size:13px;color:var(--muted)">'+L('Tick từng mục khi bạn đã tự kiểm tra trên Billing Dashboard thật của mình — checklist này chỉ để tự theo dõi trong lúc học, không thay thế việc kiểm tra hoá đơn.','自分の Billing ダッシュボードで実際に確認した項目にチェックを — このリストは学習中の自己確認用です。')+'</p>'
    +'</div>';
  return h;
}
function wireDetailExtras(scope){
  scope.querySelectorAll('.copy-btn').forEach(function(b){
    b.addEventListener('click',function(){
      var pre=b.parentElement.querySelector('pre'); if(!pre) return;
      var txt=pre.innerText, done=function(){ b.textContent=L('Đã copy ✓','コピーしました ✓'); setTimeout(function(){ b.textContent='Copy'; },1600); };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done,function(){ fallbackCopy(txt); done(); }); }
      else { fallbackCopy(txt); done(); }
    });
  });
  scope.querySelectorAll('.lab2-bill input[type=checkbox]').forEach(function(cb){
    cb.addEventListener('change',function(){ cb.closest('li').classList.toggle('done',cb.checked); });
  });
}
function fallbackCopy(txt){
  try{
    var ta=document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }catch(e){}
}
function injectLabDetail(kind,idx){
  var body=$('labDetailBody'); if(!body) return;
  var key=keyOf(kind,idx), d=LAB2[key];
  curDetail={kind:kind,idx:idx};
  if(!d) return;
  var head=body.querySelector('.d-head');
  if(head&&!body.querySelector('.lab2-cost')){
    var banner=document.createElement('div'); banner.className='lab2-cost';
    banner.innerHTML='<div class="lc-main">💰 <b>'+L('Chi phí 1 lần làm: ','1回の実施コスト：')+E(pick(d.cost))+'</b></div>'
      +'<p>'+E(pick(d.src))+'</p>'
      +'<p class="lc-note">'+L('Ước tính tham khảo theo giá on-demand phổ biến (region Tokyo), thay đổi theo region — hãy xoá tài nguyên ngay sau khi làm để không phát sinh thêm.','一般的なオンデマンド価格（東京リージョン）に基づく参考見積もりです。リージョンにより変動します — 追加課金を避けるため、実施後はすぐにリソースを削除してください。')+'</p>';
    head.parentNode.insertBefore(banner,head.nextSibling);
    var bar=document.createElement('div'); bar.className='lab2-donebar';
    var btn=document.createElement('button'); btn.type='button'; btn.className='lab-done-btn big'; btn.setAttribute('data-done',key);
    btn.addEventListener('click',function(){ toggleDone(key); });
    var note=document.createElement('span');
    note.textContent=L('Đánh dấu khi bạn đã làm xong lab này — tiến độ được tính vào thanh % ở đầu trang Labs và huy hiệu trên thẻ lab.','このラボを終えたらマークしてください — 進捗はラボページ上部のバーと、カードのバッジに反映されます。');
    bar.appendChild(btn); bar.appendChild(note);
    banner.parentNode.insertBefore(bar,banner.nextSibling);
  }
  if(!body.querySelector('.lab2-extra')){
    var extra=document.createElement('div'); extra.className='lab2-extra'; extra.setAttribute('data-labkey',key);
    extra.innerHTML=pitHTML(d,6)+cleanHTML(d,7,kind==='mig');
    body.appendChild(extra);
    wireDetailExtras(extra);
  }
  syncDetailBtn(key);
}
try{
  if(typeof window.__openLabDetail==='function'){
    var __origOpenLab=window.__openLabDetail;
    window.__openLabDetail=function(kind,idx){
      __origOpenLab(kind,idx);
      try{ injectLabDetail(kind,idx); }catch(e){}
    };
    /* Nếu trang đang mở sẵn ở một lab chi tiết ngay từ đầu (deep link) */
    var m0=(location.hash||'').match(/^#\/(lab|miglab)\/(\d+)$/);
    if(m0){ try{ injectLabDetail(m0[1]==='miglab'?'mig':'lab',+m0[2]); }catch(e){} }
  }
}catch(e){}

/* ---- Đổi ngôn ngữ: vẽ lại các khối Đợt 2 theo ngôn ngữ mới ---- */
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      try{ renderLabProg(); }catch(e){}
      /* setLang() vẽ lại #labGrid bằng renderLabs() nên thẻ mất .lab2-zone:
         phải decorate lại trước, refresh (chỉ đồng bộ thẻ đã có zone) là chưa đủ. */
      try{ decorateLabCards(); }catch(e){}
      try{ refreshLabCards(); }catch(e){}
      if(curDetail&&/^#\/(lab|miglab)\//.test(location.hash||'')){
        try{ window.__openLabDetail(curDetail.kind,curDetail.idx); }catch(e){}
      }
    },80);
  });
});
})();
