/* ============================================================
   data-content.js — Dữ liệu nội dung học
   Bảng đối chiếu AWS⇄GCP + render danh mục · Labs ·
   Architect · Từ điển song ngữ VI/JP (JAD) · Dữ liệu
   luyện Command (EX/CHEAT/SHELLINTRO) · Thư viện sơ đồ
   (DG) · Dữ liệu Flow học (FSTAGES/FN). Thứ tự giữ đúng
   như bản 1 file gốc.
   ============================================================ */

    /* ================= BẢNG ĐỐI CHIẾU AWS ⇄ GCP ================= */
    var COMPARE = [
    ['Amazon EC2','Compute Engine','Cùng là VM IaaS: chọn máy, OS, gắn đĩa block, scale bằng group tự động.','EC2 gắn với VPC regional & AMI; GCE thuộc VPC global, có giảm giá tự động Sustained Use và custom machine type linh hoạt hơn.','Đã quen hệ AWS/chạy license Windows đa dạng → EC2. Muốn giảm giá tự động & máy tuỳ biến → GCE.'],
    ['Amazon S3','Cloud Storage','Object storage: bucket, object, lifecycle, versioning, mã hoá mặc định.','S3 nhiều storage class & tính năng mới (Tables, Vectors, Metadata); GCS mô hình lớp đơn giản hơn, tên bucket là duy nhất toàn cục ở cả hai.','Data lake/AI trên AWS → S3. Hệ GCP/BigQuery → Cloud Storage.'],
    ['AWS Lambda','Cloud Run functions','Function serverless theo sự kiện, scale về 0, trả theo lần chạy.','Lambda giới hạn 15 phút & gắn hệ sinh thái AWS; bản GCP nay là một dạng triển khai của Cloud Run — chạy được cả container, thời gian xử lý dài hơn.','Sự kiện trong AWS → Lambda. Bên GCP hoặc cần container → Cloud Run (functions).'],
    ['Amazon EKS','Google Kubernetes Engine (GKE)','Kubernetes managed: control plane do cloud quản, workload chạy container chuẩn K8s.','GKE có Autopilot (Google quản cả node, trả theo pod) và danh tiếng vận hành mượt; EKS tích hợp sâu IAM/VPC AWS, add-on phong phú.','Nền tảng Kubernetes là trọng tâm → GKE. Workload gắn chặt AWS → EKS.'],
    ['Amazon Aurora','AlloyDB for PostgreSQL','DB quan hệ cloud-native tách compute/storage, tương thích PostgreSQL/MySQL (Aurora) — hiệu năng trên DB truyền thống.','Aurora có cả MySQL & PostgreSQL, scale read 15 replica; AlloyDB chỉ PostgreSQL nhưng có columnar engine cho HTAP ngay trong DB giao dịch.','PostgreSQL tải lớn + phân tích tại chỗ → AlloyDB. Hệ AWS/MySQL → Aurora.'],
    ['Amazon RDS','Cloud SQL','DB quan hệ managed đa engine (MySQL/PostgreSQL/SQL Server/Oracle ở RDS), backup & HA tự động.','RDS hỗ trợ thêm Oracle & MariaDB, nhiều tuỳ chọn instance; Cloud SQL đơn giản hơn, HA theo region, gắn GCP.','Chuyển từ on-prem nhanh, ít vận hành: cả hai đều tốt — chọn theo cloud đang dùng.'],
    ['Amazon DynamoDB','Firestore','NoSQL serverless latency thấp cho ứng dụng.','DynamoDB là key-value/document theo partition key, scale cực lớn cho backend; Firestore là document có realtime sync & SDK di động mạnh (gốc Firebase).','Backend/API quy mô lớn → DynamoDB. App mobile/web cần đồng bộ realtime → Firestore.'],
    ['Amazon DynamoDB','Cloud Bigtable','NoSQL cho dữ liệu khổng lồ, độ trễ thấp.','Bigtable là wide-column kiểu HBase cho chuỗi thời gian/IoT hàng PB; DynamoDB thiên về mẫu truy cập key-value của ứng dụng.','Dữ liệu cảm biến/IoT cực lớn → Bigtable. Dữ liệu ứng dụng theo key → DynamoDB.'],
    ['Amazon Redshift','BigQuery','Data warehouse phân tích cột, truy vấn SQL trên dữ liệu lớn.','BigQuery serverless hoàn toàn (tách storage/compute, không quản cluster); Redshift dùng cluster/provisioned hoặc serverless nhưng gắn hệ AWS & có RA3.','Analytics là ưu tiên số 1 → BigQuery. Đã đầu tư hệ AWS → Redshift.'],
    ['AWS Glue','Dataflow','ETL & xử lý dữ liệu managed/serverless.','Glue mạnh ở ETL batch + Data Catalog trên S3; Dataflow dùng Apache Beam hợp nhất stream+batch, cực mạnh cho streaming realtime.','ETL data lake AWS → Glue. Pipeline streaming → Dataflow (hoặc Managed Spark nếu team quen Spark/Dataproc).'],
    ['Amazon Kinesis Data Streams','Pub/Sub','Thu thập & phân phối dữ liệu/sự kiện realtime.','Kinesis là stream có shard, lưu & phát lại theo thứ tự thời gian; Pub/Sub là messaging pub/sub theo message, scale tự động không cần tính shard.','Cần phát lại stream theo cửa sổ thời gian → Kinesis. Event messaging đơn giản toàn cầu → Pub/Sub.'],
    ['Amazon SQS','Pub/Sub','Hàng đợi/pub-sub tách rời thành phần hệ thống.','SQS chỉ là queue (pull), SNS mới là fan-out; Pub/Sub gộp cả hai mô hình trong một service.','AWS: tách SQS (đệm việc) & SNS/EventBridge (sự kiện). GCP: Pub/Sub làm cả hai vai.'],
    ['Amazon Bedrock','Vertex AI','Nền tảng GenAI: gọi foundation model qua API, RAG, agent.','Bedrock đa nhà cung cấp mô hình (Claude, Nova, Llama…); Vertex AI gắn chặt Gemini, BigQuery & TPU, nay mở rộng thành Gemini Enterprise Agent Platform.','Cần nhiều họ mô hình → Bedrock. Ưu tiên Gemini & hệ dữ liệu Google → Vertex AI.'],
    ['Amazon VPC','Virtual Private Cloud (VPC)','Mạng ảo: subnet, route, firewall, kết nối hybrid.','KHÁC BIỆT LỚN NHẤT: VPC AWS là REGIONAL (subnet theo AZ); VPC GCP là GLOBAL (subnet theo region) — một VPC GCP phủ mọi region.','Thiết kế đa region: GCP đơn giản hơn về mạng; AWS cô lập region rõ ràng hơn.'],
    ['AWS PrivateLink & VPC Endpoints','Private Service Connect','Kết nối riêng tới service/API mà không đi internet công cộng.','Mô hình gần như tương đương (endpoint/interface & service attachment/producer); tên & cách tính phí khác nhau.','Dùng bản của cloud nơi workload đang chạy; cross-cloud thì qua Interconnect/DX + PSC/PrivateLink từng phía.'],
    ['AWS Direct Connect','Cloud Interconnect','Đường truyền riêng on-prem ↔ cloud, băng thông ổn định.','Cả hai có bản Dedicated & Partner, chạy BGP (AWS DX Gateway / Cloud Router phía GCP); khác ở điểm hiện diện (PoP) theo khu vực.','Chọn theo PoP gần data center của bạn nhất tại Nhật/châu Á.'],
    ['AWS Database Migration Service (DMS)','Database Migration Service','Chuyển database full load + CDC, downtime gần 0.','AWS DMS đa dạng engine nguồn/đích hơn (cả DynamoDB/Redshift); GCP DMS tối ưu sâu cho MySQL/PostgreSQL → Cloud SQL/AlloyDB.', 'Về AWS → AWS DMS. Về GCP (Cloud SQL/AlloyDB) → GCP DMS.'],
    ['AWS Application Migration Service (MGN)','Migrate to Virtual Machines','Rehost VM/server bằng replicate liên tục rồi cutover.','Cùng nguyên lý agent/replicate mức block; MGN đích là EC2, bản GCP đích là Compute Engine và tích hợp Migration Center.', 'Đích ở đâu thì dùng công cụ của cloud đích.'],
    ['AWS IAM','Cloud IAM','Phân quyền truy cập tài nguyên cloud.','AWS dùng policy JSON chi tiết theo action/resource; GCP gán role theo cây Organization → Folder → Project, quyền thừa hưởng xuống dưới.', 'Cả hai đều phải least-privilege; GCP cẩn thận quyền thừa hưởng, AWS cẩn thận policy quá rộng.'],
    ['Amazon CloudWatch','Cloud Monitoring','Giám sát metrics, log, cảnh báo.','CloudWatch gắn chặt mọi service AWS + Logs/X-Ray; GCP tách Monitoring/Logging/Trace/Error Reporting thành từng product trong bộ observability.', 'Dùng bộ gốc của cloud; multi-cloud thì cân nhắc Managed Grafana/Prometheus làm lớp hợp nhất.'],
    ['Amazon CloudFront','Cloud CDN','CDN phân phối nội dung tại edge.','CloudFront là sản phẩm độc lập nhiều tính năng (Functions, Origin Shield); Cloud CDN bật trực tiếp trên Load Balancer của GCP, tận dụng anycast của Google.', 'Web toàn cầu trên AWS → CloudFront. Đã dùng Global LB của GCP → Cloud CDN.'],
    ['Amazon Route 53','Cloud DNS','DNS managed: public/private zone.','Route 53 nổi bật với routing policy + health check failover; Cloud DNS đơn giản, độ trễ thấp nhờ anycast Google.', 'Cần failover DNS đa region → Route 53. Hệ GCP thuần → Cloud DNS.']
    ];

    /* ================= RENDER SERVICES ================= */
    var NAME2I = {};
    CORE.forEach(function(s){ NAME2I[s.n] = {cloud:s.c, group:s.g, glyph:s.gl}; });
    AWS_CAT.forEach(function(gr){ gr.items.forEach(function(it){ if(!NAME2I[it[0]]) NAME2I[it[0]] = {cloud:'aws', group:gr.g, glyph:it[1]}; }); });
    GCP_CAT.forEach(function(gr){ gr.items.forEach(function(it){ if(!NAME2I[it[0]]) NAME2I[it[0]] = {cloud:'gcp', group:gr.g, glyph:it[1]}; }); });
    function iconOf(name, size){
      var m = NAME2I[name];
      if(!m) return sicon('aws','Compute','box',name,size||22);
      return sicon(m.cloud, m.group, m.glyph, name, size||22);
    }
    var COREMAP = {};
    CORE.forEach(function(s){ COREMAP[s.c + '|' + s.n] = s; });
    var state = {cloud:'aws', group:'all', q:'', lvl:'all'};
    var svcGrid = document.getElementById('svcGrid');
    var svcFilters = document.getElementById('svcFilters');
    var svcCount = document.getElementById('svcCount');
    var cmpView = document.getElementById('cmpView');

    function badgeHTML(st, deep){
      var h = '';
      if(deep) h += '<span class="badge deep">Chi tiết sâu</span>';
      if(st) h += '<span class="badge ' + st[0] + '">' + st[1] + '</span>';
      return h;
    }
    function renderFilters(){
      var cat = state.cloud === 'aws' ? AWS_CAT : GCP_CAT;
      var h = '<button type="button" class="chip' + (state.group==='all'?' on':'') + '" data-g="all">Tất cả nhóm</button>';
      cat.forEach(function(gr){
        h += '<button type="button" class="chip' + (state.group===gr.g?' on':'') + '" data-g="' + esc(gr.g) + '">' + esc(gr.g) + ' (' + gr.items.length + ')</button>';
      });
      svcFilters.innerHTML = h;
      svcFilters.querySelectorAll('.chip').forEach(function(b){
        b.addEventListener('click', function(){ state.group = b.getAttribute('data-g'); renderServices(); });
      });
    }
    function renderServices(){
      if(state.cloud === 'cmp'){
        svcGrid.style.display = 'none'; svcFilters.style.display = 'none';
        document.querySelector('.svc-search').style.display = 'none';
        cmpView.hidden = false; svcCount.textContent = '';
        renderCompare(); return;
      }
      svcGrid.style.display = ''; svcFilters.style.display = '';
      document.querySelector('.svc-search').style.display = '';
      cmpView.hidden = true;
      renderFilters();
      var cat = state.cloud === 'aws' ? AWS_CAT : GCP_CAT;
      var q = state.q.trim().toLowerCase();
      var total = 0, html = '';
      cat.forEach(function(gr){
        if(state.group !== 'all' && state.group !== gr.g) return;
        gr.items.forEach(function(it){
          var name = it[0], desc = it[2], lvl = it[3], st = it[4];
          if(state.lvl !== 'all' && LVL[lvl] !== state.lvl) return;
          if(q && (name + ' ' + desc + ' ' + gr.g).toLowerCase().indexOf(q) === -1) return;
          total++;
          var core = COREMAP[state.cloud + '|' + name];
          html += '<button type="button" class="svc-card mini' + (st && st[0]==='dep' ? ' dep-card':'') + '" data-name="' + esc(name) + '">'
            + '<span class="svc-name">' + sicon(state.cloud, gr.g, it[1], name, 38) + '</span>'
            + '<span class="cat">' + esc(gr.g) + '</span>'
            + '<h3>' + esc(name) + '</h3><p>' + esc(desc) + '</p>'
            + '<span class="badges">' + badgeHTML(st, !!core) + '<span class="badge lvl">' + LVL[lvl] + '</span></span>'
            + '</button>';
        });
      });
      svcGrid.innerHTML = html || '<div class="empty-note">Không tìm thấy service nào khớp bộ lọc. Thử xoá từ khoá tìm kiếm.</div>';
      svcCount.textContent = 'Hiển thị ' + total + ' service';
      svcGrid.querySelectorAll('.svc-card').forEach(function(card){
        card.addEventListener('click', function(){ openSvc(state.cloud, card.getAttribute('data-name')); });
      });
    }
    function renderCompare(){
      var h = '<tr><th style="width:19%">AWS</th><th style="width:19%">Google Cloud</th><th style="width:20%">Điểm giống</th><th style="width:24%">Khác biệt quyết định</th><th>Khi nào chọn bên nào</th></tr>';
      COMPARE.forEach(function(r){
        h += '<tr><td><span class="svc-name">' + iconOf(r[0], 24) + '<b>' + esc(r[0]) + '</b></span></td>'
          + '<td><span class="svc-name">' + iconOf(r[1], 24) + '<b>' + esc(r[1]) + '</b></span></td>'
          + '<td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td></tr>';
      });
      document.getElementById('cmpTable').innerHTML = h;
    }
    /* ---------- Modal ---------- */
    var modalBk = document.getElementById('modalBk'), modalBox = document.getElementById('modalBox');
    function closeModal(){ modalBk.classList.remove('open'); document.body.style.overflow = ''; }
    modalBk.addEventListener('click', function(e){ if(e.target === modalBk) closeModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
    function relatedHTML(cloud, group, selfName){
      var cat = cloud === 'aws' ? AWS_CAT : GCP_CAT, rel = [];
      cat.forEach(function(gr){ if(gr.g === group) gr.items.forEach(function(it){ if(it[0] !== selfName && rel.length < 5) rel.push(it[0]); }); });
      if(!rel.length) return '';
      return '<h4>Service liên quan</h4><div style="display:flex;flex-wrap:wrap;gap:7px">' + rel.map(function(n){
        return '<button type="button" class="chip" data-rel="' + esc(n) + '" style="display:inline-flex;align-items:center;gap:7px">' + iconOf(n, 20) + esc(n) + '</button>';
      }).join('') + '</div>';
    }
    function wireRel(){
      modalBox.querySelectorAll('[data-rel]').forEach(function(b){
        b.addEventListener('click', function(){ openSvc(state.cloud === 'cmp' ? (NAME2I[b.getAttribute('data-rel')]||{}).cloud || 'aws' : state.cloud, b.getAttribute('data-rel')); });
      });
      modalBox.querySelectorAll('.copy-btn').forEach(function(b){ b.addEventListener('click', function(){ copyCode(b); }); });
    }
    function openSvc(cloud, name){
      var core = COREMAP[cloud + '|' + name];
      var cat = cloud === 'aws' ? AWS_CAT : GCP_CAT;
      var found = null, fgroup = '';
      cat.forEach(function(gr){ gr.items.forEach(function(it){ if(it[0] === name){ found = it; fgroup = gr.g; } }); });
      if(!found && !core) return;
      var glyph = core ? core.gl : found[1];
      var group = core ? core.g : fgroup;
      var st = found ? found[4] : null;
      var h = '<button class="x" type="button" aria-label="Đóng" onclick="document.getElementById(\'modalBk\').classList.remove(\'open\');document.body.style.overflow=\'\'">✕</button>';
      h += '<div class="modal-head-ic">' + sicon(cloud, group, glyph, name, 54) + '<div><span class="cat" style="font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">' + (cloud === 'aws' ? 'AWS' : 'Google Cloud') + ' · ' + esc(group) + '</span><h3 style="padding-right:0">' + esc(name) + '</h3></div></div>';
      if(st && st[0] === 'dep') h += '<div class="status-line dep">⚠ Trạng thái: ' + esc(st[1]) + ' — nội dung chỉ để nhận biết khi gặp trong hệ thống cũ, không nên chọn cho dự án mới.</div>';
      if(st && st[0] === 'new') h += '<div class="status-line new">✦ Service mới (2025) — đã GA hoặc vừa ra mắt, thuộc thế hệ mới nhất của ' + (cloud === 'aws' ? 'AWS' : 'Google Cloud') + '.</div>';
      if(st && st[0] === 'preview') h += '<div class="status-line new">✦ Đang ở giai đoạn Preview — dùng thử nghiệm, chưa nên đặt vào hệ thống trọng yếu.</div>';
      if(core){
        h += '<p style="margin-top:14px">' + esc(core.d) + '</p>';
        h += '<div class="kv"><div><b>Nhóm</b><span>' + esc(group) + '</span></div><div><b>Cấp độ học</b><span>' + LVL[core.lvl] + '</span></div><div><b>Loại chi tiết</b><span>Chi tiết sâu</span></div></div>';
        h += '<h4>Khi nào dùng</h4><ul>' + core.u.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        h += '<h4>Giới hạn &amp; điểm cần nhớ</h4><p>' + esc(core.lim) + '</p>';
        h += '<h4>Mô hình giá</h4><p>' + esc(core.pr) + '</p>';
        h += '<h4>Cấu hình mẫu (' + (cloud === 'aws' ? 'AWS CLI' : 'gcloud CLI') + ')</h4><div class="code-wrap"><button class="copy-btn" type="button">Copy</button><pre class="code">' + esc(core.cfg) + '</pre></div>';
        h += '<h4>So sánh với service dễ nhầm</h4><p>' + esc(core.vs) + '</p>';
        h += '<h4>Lỗi thường gặp</h4><p>' + esc(core.err) + '</p>';
      } else {
        h += '<h4>Nó làm gì</h4><p>' + esc(found[2]) + '</p>';
        h += '<div class="kv"><div><b>Nhóm</b><span>' + esc(group) + '</span></div><div><b>Cấp độ học</b><span>' + LVL[found[3]] + '</span></div><div><b>Cloud</b><span>' + (cloud === 'aws' ? 'Amazon Web Services' : 'Google Cloud Platform') + '</span></div></div>';
        h += '<p style="margin-top:12px">Mẹo học: nắm service này ở mức “biết nó tồn tại, giải quyết bài toán gì, đặt ở đâu trong kiến trúc” là đủ — chỉ học sâu khi dự án thật cần tới nó. Các service cốt lõi có nhãn <b>Chi tiết sâu</b> mới là phần bắt buộc thuộc lòng.</p>';
      }
      h += relatedHTML(cloud, group, name);
      modalBox.innerHTML = h;
      modalBox.scrollTop = 0;
      modalBk.classList.add('open');
      document.body.style.overflow = 'hidden';
      wireRel();
    }
    function copyCode(btn){
      var pre = btn.parentElement.querySelector('pre');
      if(!pre) return;
      var txt = pre.innerText;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ btn.textContent = 'Đã copy ✓'; setTimeout(function(){ btn.textContent = 'Copy'; }, 1600); });
      }
    }
    document.querySelectorAll('.copy-btn').forEach(function(b){ b.addEventListener('click', function(){ copyCode(b); }); });
    /* ---------- Cloud tabs ---------- */
    document.querySelectorAll('.ctab').forEach(function(t){
      t.addEventListener('click', function(){
        document.querySelectorAll('.ctab').forEach(function(x){ x.classList.remove('on'); });
        t.classList.add('on');
        state.cloud = t.getAttribute('data-cloud');
        state.group = 'all';
        renderServices();
      });
    });
    document.getElementById('svcSearch').addEventListener('input', function(e){ state.q = e.target.value; if(state.cloud !== 'cmp') renderServices(); });
    document.getElementById('svcLevel').addEventListener('change', function(e){ state.lvl = e.target.value; if(state.cloud !== 'cmp') renderServices(); });
    renderServices();

    /* ================= LABS SONG SONG AWS ⇄ GCP ================= */
    var LVLLAB = ['Cơ bản','Trung cấp','Nâng cao'];
    var LABS = [
    {t:'Lab 1 · Dựng mạng nền: VPC hai cloud',dom:'Networking',lv:0,time:'60 phút',goal:'Tạo VPC production-ready: public/private subnet, gateway ra internet, route đúng chuẩn.',svc:['Amazon VPC','Virtual Private Cloud (VPC)','Cloud NAT'],
     aws:['<b>Tạo VPC</b> <span class="mono">aws ec2 create-vpc --cidr-block 10.0.0.0/16</span> và bật DNS hostnames.','Tạo 4 subnet: public 10.0.1.0/24 (AZ a), 10.0.2.0/24 (AZ c); private 10.0.11.0/24, 10.0.12.0/24.','Tạo <b>Internet Gateway</b>, gắn vào VPC; route table public thêm <span class="mono">0.0.0.0/0 → igw</span>.','Tạo <b>NAT Gateway</b> ở public subnet (cấp Elastic IP), route table private trỏ <span class="mono">0.0.0.0/0 → nat</span>.','Kiểm chứng: EC2 ở private ping ra internet được nhưng internet không ping vào được.'],
     gcp:['<b>Tạo VPC custom mode</b> <span class="mono">gcloud compute networks create prod-net --subnet-mode=custom</span> — nhớ VPC của GCP là global.','Tạo subnet theo region: <span class="mono">gcloud compute networks subnets create tokyo-app --network=prod-net --region=asia-northeast1 --range=10.10.0.0/20</span>.','Bật <b>Private Google Access</b> cho subnet nếu VM không có IP public vẫn cần gọi API Google.','Dựng <b>Cloud NAT</b> + Cloud Router để VM private ra internet: <span class="mono">gcloud compute routers nats create nat-tokyo --router=… --auto-allocate-nat-external-ips --nat-all-subnet-ip-ranges</span>.','Tạo firewall rule mặc định: chặn ingress toàn bộ, chỉ mở theo tag cần thiết.'],
     out:'Hiểu tận gốc khác biệt: AWS subnet theo AZ + NAT Gateway theo AZ; GCP subnet theo region + Cloud NAT theo region.'},
    {t:'Lab 2 · Web server đầu tiên: EC2 vs Compute Engine',dom:'Compute',lv:0,time:'45 phút',goal:'Dựng một web server Nginx trên VM của cả hai cloud và truy cập được từ internet.',svc:['Amazon EC2','Compute Engine','AWS IAM','Cloud IAM'],
     aws:['Tạo key pair & security group chỉ mở 22 (IP của bạn) + 80 (mọi nơi).','Launch <span class="mono">t3.micro</span> Amazon Linux, user data cài nginx: <span class="mono">yum install -y nginx</span>.','Gắn <b>IAM Role</b> (không dùng access key) nếu server cần gọi S3.','Test bằng public DNS của instance; chụp AMI làm golden image.'],
     gcp:['Tạo VM <span class="mono">gcloud compute instances create web-1 --machine-type=e2-medium --tags=http-server</span> với startup script cài nginx.','Tạo firewall rule <span class="mono">allow tcp:80 --target-tags=http-server</span>.','Gắn <b>service account</b> riêng cho VM với quyền tối thiểu (không dùng default SA quyền rộng).','Test bằng external IP; tạo machine image làm golden image.'],
     out:'So sánh được AMI ↔ Machine Image, Security Group ↔ Firewall Rule + tag, IAM Role ↔ Service Account.'},
    {t:'Lab 3 · Web tĩnh toàn cầu: S3 + CloudFront vs Cloud Storage + Cloud CDN',dom:'Compute',lv:0,time:'50 phút',goal:'Xuất bản một website tĩnh có HTTPS, cache tại edge, không lộ origin.',svc:['Amazon S3','Amazon CloudFront','Cloud Storage','Cloud CDN'],
     aws:['Tạo bucket S3 (chặn public), upload <span class="mono">index.html</span> bằng <span class="mono">aws s3 sync</span>.','Tạo CloudFront distribution với <b>Origin Access Control</b> trỏ vào bucket.','Gắn chứng chỉ ACM (region us-east-1) + domain qua Route 53.','Invalidation cache sau mỗi lần deploy: <span class="mono">aws cloudfront create-invalidation --paths "/*"</span>.'],
     gcp:['Tạo bucket <span class="mono">gcloud storage buckets create gs://… --uniform-bucket-level-access</span>, upload site.','Tạo <b>Global External Application Load Balancer</b> với backend bucket.','Bật <b>Cloud CDN</b> trên backend, gắn chứng chỉ Google-managed cho domain qua Cloud DNS.','Đặt bucket ở chế độ không public, chỉ LB truy cập qua cơ chế backend bucket.'],
     out:'Hai mô hình khác nhau cho cùng bài toán: AWS dùng CDN độc lập; GCP gắn CDN ngay trên Load Balancer anycast.'},
    {t:'Lab 4 · Database managed & kết nối riêng: RDS vs Cloud SQL',dom:'Database',lv:1,time:'75 phút',goal:'Dựng PostgreSQL managed HA, chỉ cho phép kết nối từ subnet ứng dụng.',svc:['Amazon RDS','Cloud SQL','Amazon VPC','Virtual Private Cloud (VPC)'],
     aws:['Tạo DB subnet group từ 2 private subnet (data) ở 2 AZ.','<span class="mono">aws rds create-db-instance --engine postgres --multi-az --storage-encrypted</span>, SG chỉ cho phép 5432 từ SG của app.','Bật automated backup 7 ngày + xem thử thời gian failover Multi-AZ.','Kết nối từ EC2 trong private subnet bằng psql qua endpoint RDS.'],
     gcp:['<span class="mono">gcloud sql instances create prod-db --database-version=POSTGRES_15 --availability-type=REGIONAL</span>.','Bật <b>private IP</b> (Private Services Access) để DB chỉ có địa chỉ nội bộ trong VPC.','Bật backup tự động + PITR; tạo user app riêng, không dùng user postgres mặc định cho ứng dụng.','Kết nối từ VM/Cloud Run qua Cloud SQL Auth Proxy hoặc private IP.'],
     out:'Nắm mẫu thiết kế data tier chuẩn: DB không bao giờ có đường ra/vào internet trực tiếp.'},
    {t:'Lab 5 · API serverless: Lambda + API Gateway vs Cloud Run functions',dom:'Serverless',lv:1,time:'60 phút',goal:'Viết một REST API không server có đủ log, timeout và giới hạn ngân sách.',svc:['AWS Lambda','Amazon API Gateway','Cloud Run functions','API Gateway'],
     aws:['Viết hàm Python trả JSON, đóng zip, <span class="mono">aws lambda create-function --runtime python3.12</span>.','Tạo HTTP API trên API Gateway tích hợp Lambda, bật access log CloudWatch.','Đặt timeout 10s, memory 512MB, reserved concurrency để chống cháy chi phí.','Test bằng curl qua URL API; xem trace/log trong CloudWatch.'],
     gcp:['Viết function Python/Node, deploy: <span class="mono">gcloud functions deploy api --runtime=python312 --trigger-http</span> (hậu trường là Cloud Run).','Đặt phía trước API Gateway của GCP hoặc gọi trực tiếp URL Cloud Run có IAM auth.','Đặt max instances để khoá trần chi phí; bật log trong Cloud Logging.','Test bằng curl kèm token: <span class="mono">curl -H "Authorization: Bearer $(gcloud auth print-identity-token)"</span>.'],
     out:'Hiểu cold start, concurrency và cách khoá chi phí cho serverless ở cả hai cloud.'},
    {t:'Lab 6 · Container thực chiến: ECS Fargate vs Cloud Run',dom:'Compute',lv:1,time:'70 phút',goal:'Đóng gói một ứng dụng web thành container và chạy serverless trên cả hai nền tảng.',svc:['Amazon ECS','AWS Fargate','Amazon ECR','Cloud Run','Artifact Registry'],
     aws:['Build image, đẩy lên ECR: <span class="mono">aws ecr create-repository</span> + docker push.','Tạo ECS cluster + task definition (Fargate, 0.5 vCPU/1GB), service sau ALB.','Cấu hình log driver awslogs về CloudWatch; đặt desired count = 2 (2 AZ).','Cập nhật image mới → rolling deploy, quan sát ECS service events.'],
     gcp:['Build bằng Cloud Build: <span class="mono">gcloud builds submit --tag asia-northeast1-docker.pkg.dev/PROJECT/repo/app:v1</span>.','Deploy Cloud Run: <span class="mono">gcloud run deploy app --image=… --region=asia-northeast1</span>.','Đặt min=0/max=10, CPU throttling; tạo revision mới và chia traffic 90/10 để canary.','Xem log & metric trong Cloud Monitoring.'],
     out:'Thấy rõ triết lý: Fargate giữ mô hình “service/task” của orchestrator; Cloud Run trừu tượng hoá thành “service + revision”.'},
     {t:'Lab 7 · IaC đa cloud bằng Terraform',dom:'DevOps',lv:1,time:'90 phút',goal:'Một repo Terraform quản cả AWS và GCP: remote state riêng, module hoá, plan trước khi apply.',svc:['AWS CloudFormation','Infrastructure Manager','Amazon S3','Cloud Storage'],
     aws:['State backend: S3 + DynamoDB lock (<span class="mono">backend "s3"</span>).','Module <span class="mono">vpc</span> dùng provider aws: VPC, 2 public/2 private subnet, IGW, NAT.','<span class="mono">terraform plan</span> đọc kỹ diff rồi mới <span class="mono">apply</span>; gắn tag Project/Env bắt buộc.'],
     gcp:['State backend: bucket GCS (<span class="mono">backend "gcs"</span>).','Module <span class="mono">network</span> dùng provider google: VPC custom, subnet Tokyo, Cloud NAT, firewall tối thiểu.','Dùng cùng quy ước đặt tên/tag (labels) như phía AWS để quản trị thống nhất.'],
     out:'Terraform là “ngôn ngữ chung” cho multi-cloud: cùng workflow plan/apply, khác provider & tài nguyên.'},
    {t:'Lab 8 · CI/CD hai cloud',dom:'DevOps',lv:1,time:'80 phút',goal:'Pipeline tự build → test → deploy khi push code, có bước phê duyệt trước production.',svc:['AWS CodeBuild','AWS CodePipeline','Cloud Build','Cloud Deploy'],
     aws:['CodePipeline nối GitHub → CodeBuild (buildspec.yml chạy test + build image) → CodeDeploy/ECS deploy.','Thêm stage Manual Approval trước production.','Cấu hình thông báo lỗi pipeline về SNS/Chatbot.'],
     gcp:['Cloud Build trigger theo push: chạy test, build image vào Artifact Registry.','Cloud Deploy pipeline: staging (tự động) → production (yêu cầu approve).','Xem rollout history & rollback về release trước trong Cloud Deploy.'],
     out:'Đối chiếu được hai hệ CI/CD gốc: Code* của AWS và Cloud Build/Deploy của GCP.'},
    {t:'Lab 9 · Kubernetes: EKS vs GKE Autopilot',dom:'DevOps',lv:2,time:'120 phút',goal:'Dựng cluster K8s managed ở hai cloud, deploy cùng một ứng dụng Helm, autoscale theo tải.',svc:['Amazon EKS','Google Kubernetes Engine (GKE)','Elastic Load Balancing','Cloud Load Balancing'],
     aws:['<span class="mono">eksctl create cluster --name prod --region ap-northeast-1 --nodes 2</span> (hoặc Terraform).','Cài AWS Load Balancer Controller; deploy app bằng Helm với Ingress → ALB.','Bật Cluster Autoscaler/Karpenter + HPA; test scale bằng sinh tải.'],
     gcp:['<span class="mono">gcloud container clusters create-auto prod --region asia-northeast1</span> (Autopilot).','Deploy cùng Helm chart; Ingress/Gateway → Global Load Balancer.','Dùng Workload Identity thay key JSON cho pod cần gọi API Google.'],
     out:'Cùng một chart Helm chạy hai nơi — khác biệt nằm ở tích hợp cloud xung quanh (LB, IAM, storage class).'},
    {t:'Lab 10 · Kiến trúc sự kiện: SQS + EventBridge vs Pub/Sub + Eventarc',dom:'Serverless',lv:1,time:'70 phút',goal:'Xây pipeline xử lý đơn hàng bất đồng bộ có DLQ và khả năng phát lại sự kiện.',svc:['Amazon SQS','Amazon EventBridge','Pub/Sub','Eventarc'],
     aws:['Tạo SQS queue + DLQ (maxReceiveCount=3); Lambda consumer xử lý đơn.','EventBridge rule bắt sự kiện “OrderCreated” từ bus → đẩy vào SQS.','Bật archive EventBridge để replay sự kiện khi consumer lỗi.','Giả lập message lỗi để xem hành trình vào DLQ.'],
     gcp:['Tạo Pub/Sub topic + subscription có dead-letter topic.','Eventarc trigger: sự kiện Cloud Storage/Cloud Run → chuyển tới Cloud Run xử lý.','Consumer xử lý idempotent theo messageId; kiểm tra luồng vào DL topic khi lỗi.','Dùng seek/replay của Pub/Sub để phát lại theo mốc thời gian.'],
     out:'Hai hệ event đều mạnh: AWS tách queue/bus rõ ràng; GCP hợp nhất vào Pub/Sub + Eventarc.'},
    {t:'Lab 11 · Giám sát & cảnh báo đa cloud',dom:'DevOps',lv:1,time:'60 phút',goal:'Dựng dashboard + alarm cho web app trên cả hai cloud và một điểm nhìn hợp nhất.',svc:['Amazon CloudWatch','Cloud Monitoring','Amazon Managed Grafana'],
     aws:['Tạo CloudWatch Dashboard: CPU EC2, latency ALB, error 5xx.','Alarm CPU > 80% trong 10 phút → SNS gửi email/Slack.','Bật log retention 30 ngày cho mọi log group để khống chế chi phí.'],
     gcp:['Tạo Monitoring Dashboard: CPU VM, latency LB, error rate Cloud Run.','Alert policy tương đương → notification channel email/Slack.','Dùng log-based metric đếm lỗi 5xx trong Cloud Logging.'],
     out:'Có thể hợp nhất hai phía vào Amazon Managed Grafana hoặc Grafana tự host khi vận hành multi-cloud thật.'},
    {t:'Lab 12 · Nền tảng bảo mật: IAM Role vs Service Account',dom:'Security',lv:1,time:'65 phút',goal:'Áp least-privilege cho một ứng dụng: không access key tĩnh, mọi quyền đều tối thiểu & truy vết được.',svc:['AWS IAM','Cloud IAM','AWS CloudTrail','Cloud Audit Logs'],
     aws:['Tạo IAM Role cho EC2/Lambda chỉ gồm quyền đọc 1 bucket S3 cụ thể.','Bật CloudTrail toàn region + Config rule kiểm tra bucket public.','Dùng IAM Access Analyzer tìm quyền thừa cấp ra ngoài tài khoản.'],
     gcp:['Tạo service account riêng cho app, gán đúng role <span class="mono">roles/storage.objectViewer</span> trên đúng 1 bucket.','Bật Cloud Audit Logs (Data Access) cho bucket nhạy cảm.','Dùng Policy Analyzer/Recommender gỡ quyền thừa của service account.'],
     out:'Nguyên tắc vàng giống nhau ở mọi cloud: danh tính theo workload, quyền tối thiểu, ghi vết mọi thứ.'}
    ];
    var labGrid = document.getElementById('labGrid');
    function renderLabs(){
      var dom = document.getElementById('labFilter').value, lv = document.getElementById('labLevel').value;
      var html = '';
      LABS.forEach(function(l){
        if(dom !== 'all' && l.dom !== dom) return;
        if(lv !== 'all' && LVLLAB[l.lv] !== lv) return;
        var lvCls = l.lv === 0 ? 'lv-co' : (l.lv === 1 ? 'lv-tb' : 'lv-nc');
        html += '<article class="lab-card"><div class="lab-meta"><span class="tag ' + lvCls + '">' + LVLLAB[l.lv] + '</span><span class="tag tm">⏱ ' + l.time + '</span><span class="tag domain">' + l.dom + '</span></div>'
          + '<h3>' + esc(l.t) + '</h3><p>' + esc(l.goal) + '</p>'
          + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:11px">' + l.svc.map(function(n){ return '<span class="tag svc-chip">' + iconOf(n, 20) + esc(n) + '</span>'; }).join('') + '</div>'
          + '<details><summary>Xem các bước làm song song AWS ⇄ GCP</summary><div class="lab-dual">'
          + '<div><h5 class="aws">AWS · aws CLI</h5><ol>' + l.aws.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div>'
          + '<div><h5 class="gcp">Google Cloud · gcloud CLI</h5><ol>' + l.gcp.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div></div>'
          + '<div class="lab-out"><b>Kết quả cần đạt:</b> ' + esc(l.out) + '</div></details></article>';
      });
      labGrid.innerHTML = html || '<div class="empty-note">Không có lab nào khớp bộ lọc.</div>';
    }
    document.getElementById('labFilter').addEventListener('change', renderLabs);
    document.getElementById('labLevel').addEventListener('change', renderLabs);
    renderLabs();

    /* ================= MIGRATION LABS ================= */
    var MIGS = [
    {t:'On-premise VMware → AWS',from:'VMware vSphere (on-prem)',to:'Amazon EC2',tool:'AWS Application Migration Service (MGN)',time:'1–3 ngày / đợt sóng',steps:['Đánh giá bằng Migration Evaluator + Application Discovery Service: lập bản đồ phụ thuộc giữa các VM.','Dựng Landing Zone (Control Tower) & mạng đích: VPC, Direct Connect/VPN.','Cài MGN agent lên VM nguồn (hoặc agentless vCenter), chờ replicate đạt trạng thái “ready for testing”.','Launch test instance, kiểm thử ứng dụng trên subnet test riêng.','Cutover ngoài giờ cao điểm; theo dõi qua Migration Hub; giữ VM nguồn 1–2 tuần trước khi tắt.'],note:'Đường nhanh nhất để thoát data center. Muốn hiện đại hoá sâu (đổi kiến trúc VMware) thì cân nhắc AWS Transform.'},
    {t:'On-premise vật lý / VMware → Google Cloud',from:'Server vật lý / VMware (on-prem)',to:'Compute Engine',tool:'Migrate to Virtual Machines',time:'1–3 ngày / đợt sóng',steps:['Dùng Migration Center khám phá hạ tầng & ước tính chi phí GCP (rightsizing theo hiệu năng thật).','Kết nối nguồn qua Cloud VPN/Interconnect; cài đặt Migrate to VMs trên vCenter hoặc agent cho máy vật lý.','Replicate liên tục, chạy test clone trên mạng test của GCP.','Cutover theo nhóm ứng dụng phụ thuộc; kiểm chứng bằng Network Intelligence Center.','Tối ưu sau chuyển: chuyển sang Managed Instance Group, Spot cho workload phụ trợ.'],note:'Cặp đôi tự nhiên với kịch bản AWS ở trên — cùng tư duy rehost, khác công cụ đích.'},
    {t:'VMware → Google Cloud VMware Engine (GCVE)',from:'VMware vSphere (on-prem)',to:'Google Cloud VMware Engine (GCVE)',tool:'Google Cloud VMware Engine (GCVE)',time:'3–7 ngày dựng cụm',steps:['Dựng private cloud GCVE tại region Tokyo, kết nối về on-prem bằng Interconnect + HCX.','Mở rộng mạng (network stretching) để giữ nguyên IP cho VM khi chuyển.','Dùng HCX vMotion/Replication di chuyển VM gần như không downtime.','Giữ nguyên quy trình vận hành VMware (vCenter) — team không phải học lại.','Lộ trình dài hạn: từng bước refactor các VM sang GKE/Cloud Run.'],note:'Chiến lược Relocate: nhanh nhất cho “thoát VMware” khi chưa kịp đổi kiến trúc ứng dụng.'},
    {t:'VMware → AWS bằng AWS Transform / EVS',from:'VMware vSphere (on-prem)',to:'Amazon EC2',tool:'AWS Transform',time:'Theo đợt sóng',steps:['AWS Transform phân tích môi trường VMware, lập kế hoạch sóng di chuyển có AI hỗ trợ.','Workload giữ nguyên VMware: cân nhắc Amazon EVS (Elastic VMware Service).','Workload chuyển native: MGN rehost lên EC2 theo từng wave.','Đổi license & network: ánh xạ VLAN/subnet sang VPC, kiểm tra phụ thuộc Active Directory.','Xác thực sau chuyển & tối ưu chi phí bằng Compute Optimizer.'],note:'AWS Transform (GA 2025) cũng hỗ trợ hiện đại hoá .NET và mainframe trong cùng một chương trình.'},
    {t:'AWS → Google Cloud (cross-cloud)',from:'Amazon EC2',to:'Compute Engine',tool:'Migrate to Virtual Machines',time:'Theo đợt sóng',steps:['Lập danh mục: EC2, RDS, S3 và các phụ thuộc (dùng AWS Config/Resource Explorer xuất inventory).','Dựng đường truyền riêng hoặc VPN giữa VPC AWS và VPC GCP; mở đúng cổng replicate.','Server: Migrate to VMs (hỗ trợ nguồn cloud khác) replicate EC2 → Compute Engine.','Dữ liệu object: Storage Transfer Service chuyển S3 → Cloud Storage theo lịch, có kiểm chứng checksum.','Database: GCP Database Migration Service hoặc Datastream kéo CDC từ RDS/Aurora.','Cutover DNS (hạ TTL trước 24–48h), theo dõi song song 1–2 tuần rồi tắt phía AWS.'],note:'Cross-cloud luôn đắt ở phí egress — tính trước chi phí truyền dữ liệu của phía nguồn.'},
    {t:'Google Cloud → AWS (cross-cloud)',from:'Compute Engine',to:'Amazon EC2',tool:'AWS Application Migration Service (MGN)',time:'Theo đợt sóng',steps:['Xuất inventory GCP (Asset Inventory) & ánh xạ service tương đương theo bảng đối chiếu ở Phần 1.','Dựng VPC đích + kết nối VPN/Direct Connect về phía GCP.','Cài MGN agent lên VM Compute Engine, replicate về EC2, test launch kỹ (driver/kernel).','Object: DataSync hoặc công cụ transfer kéo Cloud Storage → S3 (chú ý phí egress GCP).','Database: AWS DMS full load + CDC từ Cloud SQL/AlloyDB về RDS/Aurora.','Cutover bằng Route 53 weighted routing: chuyển 10% → 50% → 100% traffic để giảm rủi ro.'],note:'Chuyển dần theo trọng số DNS là mẫu an toàn nhất cho hệ thống đang phục vụ người dùng thật.'},
    {t:'Database on-prem Oracle → Aurora PostgreSQL',from:'Oracle Database (on-prem)',to:'Amazon Aurora',tool:'AWS Database Migration Service (DMS)',time:'2–6 tuần',steps:['Dùng SCT quét schema: tự đổi ~70–90% đối tượng, đánh dấu phần phải sửa tay (PL/SQL).','Dựng DMS replication instance trong VPC đích, kiểm tra kết nối hai đầu.','Full load dữ liệu lịch sử vào Aurora.','Bật CDC (LogMiner) đồng bộ thay đổi liên tục, theo dõi độ trễ (replication lag).','Chạy bộ kiểm chứng dữ liệu (DMS validation) + test hiệu năng với workload thật.','Cutover: dừng ghi nguồn trong cửa sổ ngắn, chờ CDC về 0, đổi connection string.'],note:'Đây là mẫu Replatform kinh điển: thoát license Oracle là động lực chi phí lớn nhất.'},
    {t:'Database cross-cloud: Cloud SQL ⇄ RDS / AlloyDB ⇄ Aurora',from:'Cloud SQL',to:'Amazon Aurora',tool:'Database Migration Service',time:'1–3 tuần',steps:['Xác định cặp tương đương: Cloud SQL MySQL ↔ RDS MySQL; AlloyDB ↔ Aurora PostgreSQL (và chiều ngược lại).','Mở kết nối mạng hai chiều giữa hai VPC (VPN/Interconnect + DX) với rule tối thiểu theo IP instance DMS.','Chiều về AWS dùng AWS DMS; chiều về GCP dùng GCP DMS — nguyên lý full load + CDC giống hệt nhau.','Đồng bộ sequence, index phụ và user/grant bằng tay (DMS không chuyển hết).','Kiểm chứng bằng truy vấn đối chiếu tổng bản ghi + checksum mẫu trên các bảng lớn.','Giữ replication chạy thêm vài ngày sau cutover làm đường lui khẩn cấp.'],note:'Cross-cloud DB là phần khó nhất của mọi chương trình multi-cloud — hãy tập trước với DB nhỏ.'},
    {t:'File server on-prem → Cloud (cả hai phía)',from:'File Server Windows / NAS (on-prem)',to:'Amazon FSx for Windows File Server',tool:'AWS DataSync',time:'Vài ngày – vài tuần theo dung lượng',steps:['Phía AWS: DataSync agent tại on-prem đồng bộ SMB/NFS → FSx for Windows hoặc EFS/S3, giữ nguyên quyền NTFS.','Phía GCP: Storage Transfer Service hoặc NetApp Volumes (SnapMirror từ ONTAP on-prem) → Filestore/NetApp Volumes.','Chạy nhiều vòng đồng bộ tăng dần; vòng cuối trong cửa sổ bảo trì để bắt kịp delta.','Đổi đường dẫn UNC/GPO của người dùng sang endpoint mới; kiểm tra quyền truy cập mẫu.','Giữ bản on-prem ở chế độ chỉ đọc 2–4 tuần trước khi giải phóng.'],note:'Dữ liệu file luôn có “đuôi dài” thay đổi — kế hoạch nhiều vòng sync là bắt buộc, đừng copy một lần.'}
    ];
    var migGrid = document.getElementById('migGrid');
    migGrid.innerHTML = MIGS.map(function(m){
      return '<article class="lab-card"><div class="lab-meta"><span class="tag tm">⏱ ' + esc(m.time) + '</span></div>'
        + '<h3>' + esc(m.t) + '</h3>'
        + '<div class="src-flow"><span class="from">' + esc(m.from) + '</span><span class="arr">➜</span><span class="to">' + iconOf(m.to, 20) + ' ' + esc(m.to) + '</span></div>'
        + '<p style="margin-top:6px">Công cụ chính: <span class="tag svc-chip">' + iconOf(m.tool, 20) + esc(m.tool) + '</span></p>'
        + '<details><summary>Xem các bước thực hiện</summary><ol>' + m.steps.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>'
        + '<div class="lab-out"><b>Lưu ý:</b> ' + esc(m.note) + '</div></details></article>';
    }).join('');

    /* ================= NETWORKING TOPICS ================= */
    var NET = [
    {n:'CIDR & thiết kế dải IP — nền của mọi thứ',icon:'Amazon VPC',body:'<ul><li><b>Quy hoạch trước, tạo VPC sau:</b> dùng dải RFC1918 lớn (10.0.0.0/8) cấp phát theo sơ đồ toàn công ty, ghi vào IPAM — tránh 192.168.0.0/16 “mặc định” vì đụng mạng gia đình/VPN.</li><li>VPC thường /16 (65.536 IP). Mỗi subnet nên /24 (251 IP dùng được) hoặc lớn hơn cho EKS.</li><li><b>Chừa khoảng trống:</b> để 30–40% CIDR chưa cấp cho tương lai (subnet EKS, endpoint, inspection).</li><li>Không bao giờ để CIDR chồng lấn giữa các VPC/on-prem cần kết nối — chồng lấn = không route được, phải NAT/NAT64 rất đau.</li></ul>'},
    {n:'Route Table — “bản đồ” quyết định mọi gói tin',icon:'Amazon VPC',body:'<ul><li>Mỗi subnet gắn đúng 1 route table; route <b>local</b> (trong VPC) luôn tồn tại và không xoá được.</li><li>Nguyên tắc chọn route: <b>longest prefix match</b> — route cụ thể hơn thắng route tổng quát.</li><li>Public subnet = có route 0.0.0.0/0 → IGW. Private = 0.0.0.0/0 → NAT. Isolated = không route ra ngoài (chỉ local).</li><li>Debug mạng = đọc route table trước tiên: 80% sự cố “không thông” là thiếu route chiều về.</li></ul>'},
    {n:'Security Group vs NACL — hai lớp tường lửa',icon:'AWS WAF',body:'<ul><li>Xem bảng so sánh chi tiết ngay dưới phần công cụ CIDR: SG <b>stateful</b> tầng ENI, NACL <b>stateless</b> tầng subnet.</li><li>Thiết kế chuẩn: dùng SG là chính (tham chiếu SG↔SG thay vì mở theo IP), NACL chỉ làm lớp chặn bổ sung.</li><li>Nhớ ephemeral port 1024–65535 cho traffic trả về ở NACL stateless.</li></ul>'},
    {n:'NAT Gateway, IGW & Elastic IP',icon:'Amazon VPC',body:'<ul><li><b>IGW</b> là cổng hai chiều cho public subnet; instance cần public IP/EIP mới dùng được.</li><li><b>NAT Gateway</b> cho private subnet ra internet một chiều; đặt <b>mỗi AZ một NAT</b> để tránh chết chéo AZ và phí truyền liên AZ.</li><li>NAT Gateway là khoản phí “ẩn” lớn (theo giờ + GB) — workload tải nặng cân nhắc VPC Endpoint cho S3/DynamoDB (miễn phí với Gateway Endpoint).</li></ul>'},
    {n:'VPC Peering vs Transit Gateway',icon:'AWS Transit Gateway',body:'<ul><li>Peering: kết nối 1–1, rẻ, nhưng <b>không transitive</b> (A–B, B–C không suy ra A–C) và không dùng được khi CIDR chồng lấn.</li><li>TGW: hub trung tâm, nhiều route table để phân đoạn (prod tách dev), gắn chung Direct Connect/VPN.</li><li>Quy tắc bậc thầy: ≤3 VPC → peering; nhiều VPC/account hoặc có on-prem chung → TGW ngay từ đầu, đừng để “nợ peering”.</li></ul>'},
    {n:'VPC Endpoints & PrivateLink',icon:'AWS PrivateLink & VPC Endpoints',body:'<ul><li><b>Gateway Endpoint</b> (S3, DynamoDB): miễn phí, cấu hình bằng route table.</li><li><b>Interface Endpoint</b> (hầu hết service khác): ENI + PrivateLink, tính phí theo giờ/GB.</li><li>PrivateLink cũng để “xuất bản” service của bạn cho VPC khác truy cập riêng qua NLB.</li><li>Lợi ích kép: bảo mật (không ra internet) + giảm phí NAT cho traffic tới AWS service.</li></ul>'},
    {n:'Hybrid: Direct Connect + VPN + BGP',icon:'AWS Direct Connect',body:'<ul><li>DX cho đường riêng ổn định; VPN IPsec dựng trong vài giờ làm đường dự phòng hoặc tạm thời.</li><li>Mẫu chuẩn doanh nghiệp: <b>DX chính + VPN backup</b>, cả hai chạy BGP qua DX Gateway/TGW, failover tự động theo AS-PATH/preference.</li><li>Chú ý MTU, quảng bá đúng prefix (đừng quảng bá 0.0.0.0/0 từ on-prem về) và giới hạn số route BGP của DX.</li></ul>'},
    {n:'DNS với Route 53 — định tuyến bằng DNS',icon:'Amazon Route 53',body:'<ul><li>Routing policy: Simple, Weighted (canary/A-B), Latency (về region gần nhất), Geolocation (theo quốc gia), Failover (theo health check).</li><li>Private Hosted Zone + Resolver endpoints/inbound-outbound để phân giải lai AWS ⇄ on-prem.</li><li>Trước mọi cutover: hạ TTL xuống 60s trước 24–48 giờ.</li></ul>'},
    {n:'Load Balancer — kiến trúc điểm vào',icon:'Elastic Load Balancing',body:'<ul><li>ALB lớp 7: route theo host/path/header, target là EC2/ECS/Lambda/IP. NLB lớp 4: IP tĩnh, latency cực thấp, TLS passthrough.</li><li>Luôn triển khai LB ≥ 2 AZ, bật access log về S3, health check đúng path sống thật của ứng dụng.</li><li>Gắn WAF trước ALB/CloudFront; cân nhắc Global Accelerator khi client toàn cầu cần IP tĩnh anycast.</li></ul>'},
    {n:'Troubleshooting — quy trình debug bậc thầy',icon:'Amazon CloudWatch',body:'<ul><li>Thứ tự kiểm tra: <b>Route → NACL → Security Group → DNS → ứng dụng</b>. Đừng đoán, đi theo gói tin.</li><li><b>VPC Flow Logs</b>: xem ACCEPT/REJECT để biết gói tin chết ở đâu; <b>Reachability Analyzer</b>: kiểm chứng đường đi theo cấu hình.</li><li><b>VPC Traffic Mirroring</b> khi cần soi nội dung gói; CloudWatch + X-Ray cho tầng ứng dụng.</li><li>Ghi lại sơ đồ + bảng route của hệ thống: 90% sự cố mạng được giải nhanh khi tài liệu mạng đầy đủ.</li></ul>'}
    ];
    var GCPNET = [
    {n:'VPC toàn cầu & subnet theo region',icon:'Virtual Private Cloud (VPC)',body:'<ul><li>Một VPC GCP chứa subnet ở nhiều region — ứng dụng đa region không cần nhiều VPC/peering như AWS.</li><li>Subnet là tài nguyên regional, có thể mở rộng CIDR mà không downtime; bật Flow Logs & Private Google Access theo từng subnet.</li><li>Dùng <b>custom mode</b> cho production; auto mode chỉ để thử nhanh vì CIDR cố định dễ chồng lấn về sau.</li></ul>'},
    {n:'Shared VPC — mô hình mạng doanh nghiệp',icon:'Shared VPC',body:'<ul><li>Host project giữ VPC; service projects (của các team) dùng chung subnet được chia, mỗi team tự quản workload của mình.</li><li>IAM theo vai trò <span class="mono">roles/compute.networkUser</span> ở cấp subnet — phân quyền chi tiết hơn hẳn mô hình “mỗi team một VPC”.</li><li>Kết hợp Organization Policy + thư mục Folder là khung Landing Zone chuẩn của GCP.</li></ul>'},
    {n:'Firewall Rules, Cloud NGFW & Cloud Armor',icon:'Cloud NGFW',body:'<ul><li>Firewall rule của GCP áp ở tầng network theo target tag/service account, mặc định có <b>implied deny ingress</b>.</li><li>Hierarchical firewall policy đặt ở Organization/Folder — ép rule toàn cục (chặn SSH từ internet) mà project không gỡ được.</li><li>Cloud Armor làm WAF/DDoS lớp 7 tại Load Balancer; VPC Service Controls dựng “hàng rào dữ liệu” quanh API.</li></ul>'},
    {n:'Global Load Balancing & anycast IP',icon:'Cloud Load Balancing',body:'<ul><li>Global External Application LB dùng <b>một IP anycast duy nhất</b>: người dùng tự vào region gần nhất, failover toàn cầu không cần đổi DNS.</li><li>Bật Cloud CDN & Cloud Armor ngay trên backend service — ba lớp edge trong một cấu hình.</li><li>Phân biệt rõ các họ LB: global/regional × external/internal × L4/L7 — chọn sai họ là lỗi thiết kế kinh điển.</li></ul>'},
    {n:'Hybrid: Interconnect, HA VPN & Cloud Router',icon:'Cloud Interconnect',body:'<ul><li>Dedicated Interconnect cho đường riêng 10–200Gbps; Partner Interconnect qua nhà mạng trung gian.</li><li>HA VPN đạt SLA 99.99% với 2 interface/2 IP; <b>Cloud Router</b> chạy BGP cho cả Interconnect lẫn VPN — failover động.</li><li>Cloud NAT lo chiều ra internet cho VM private theo từng region, không phải dựng appliance.</li></ul>'},
    {n:'Private Service Connect & Network Connectivity Center',icon:'Private Service Connect',body:'<ul><li>PSC cho phép VPC tiêu thụ API Google & service tự xuất bản qua endpoint nội bộ — bản sao mô hình PrivateLink phía GCP.</li><li>NCC làm hub nối VPC spoke, site on-prem và cả cloud khác — vai trò tương đương Transit Gateway.</li><li>Cloud Service Mesh (Istio managed) bổ sung mTLS & quan sát giữa các microservice xuyên VPC.</li></ul>'}
    ];
    function netCard(t, cloud){
      var m = NAME2I[t.icon] || {};
      return '<article class="net-card"><h3>' + sicon(cloud, m.group || (cloud==='aws'?'Networking & Content Delivery':'Networking'), m.glyph || 'nodes', t.icon, 30) + esc(t.n) + '</h3>' + t.body + '</article>';
    }
    document.getElementById('netGrid').innerHTML = NET.map(function(t){ return netCard(t, 'aws'); }).join('');
    document.getElementById('gcpNetGrid').innerHTML = GCPNET.map(function(t){ return netCard(t, 'gcp'); }).join('');

    /* ================= CIDR CALCULATOR ================= */
    function ip2n(ip){ var p = ip.split('.').map(Number); return ((p[0]*256 + p[1])*256 + p[2])*256 + p[3]; }
    function n2ip(n){ return [Math.floor(n/16777216)%256, Math.floor(n/65536)%256, Math.floor(n/256)%256, n%256].join('.'); }
    function maskN(prefix){ return prefix === 0 ? 0 : (4294967295 << (32 - prefix)) >>> 0; }
    document.getElementById('calcBtn').addEventListener('click', function(){
      var err = document.getElementById('calcErr'), out = document.getElementById('calcOut');
      err.style.display = 'none'; out.classList.remove('show');
      var raw = document.getElementById('cidrIn').value.trim();
      var m = raw.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
      if(!m){ err.textContent = 'CIDR chưa đúng định dạng. Ví dụ hợp lệ: 10.0.0.0/16'; err.style.display = 'block'; return; }
      var oct = [+m[1],+m[2],+m[3],+m[4]], prefix = +m[5];
      if(oct.some(function(x){ return x > 255; }) || prefix < 8 || prefix > 24){ err.textContent = 'Octet phải ≤ 255 và prefix VPC nên từ /8 đến /24 để đủ chỗ chia subnet.'; err.style.display = 'block'; return; }
      var ipN = ip2n(raw.split('/')[0]), mask = maskN(prefix);
      var net = (ipN & mask) >>> 0, size = Math.pow(2, 32 - prefix);
      var bcast = net + size - 1;
      var azs = +document.getElementById('azIn').value, tierP = +document.getElementById('tierIn').value;
      var tierSize = Math.pow(2, 32 - tierP);
      var tiers = [['Public', 'IGW / Cloud NAT'], ['Private — App', 'qua NAT / Cloud NAT'], ['Private — Data', 'không route ra internet']];
      var rows = '', cur = net, azNames = ['A','B','C','D'];
      var ok = true;
      tiers.forEach(function(tier){
        for(var a = 0; a < azs; a++){
          if(cur + tierSize - 1 > bcast){ ok = false; break; }
          rows += '<tr><td>AZ ' + azNames[a] + '</td><td>' + tier[0] + '</td><td>' + n2ip(cur) + '/' + tierP + '</td><td>' + n2ip(cur + tierSize - 1) + '</td><td>' + (tierSize - 5) + ' IP</td><td>' + tier[1] + '</td></tr>';
          cur += tierSize;
        }
      });
      if(!ok){ err.textContent = 'Dải VPC không đủ chỗ cho ' + azs + ' AZ × 3 tầng ở /' + tierP + '. Hãy dùng VPC lớn hơn (prefix nhỏ hơn) hoặc subnet nhỏ hơn.'; err.style.display = 'block'; return; }
      document.getElementById('addrGrid').innerHTML =
        '<div><b>Network address</b><span>' + n2ip(net) + '/' + prefix + '</span></div>'
        + '<div><b>Broadcast</b><span>' + n2ip(bcast) + '</span></div>'
        + '<div><b>Tổng số IP</b><span>' + size.toLocaleString('vi-VN') + '</span></div>'
        + '<div><b>Netmask</b><span>' + n2ip(mask) + '</span></div>'
        + '<div><b>Còn trống sau khi chia</b><span>' + (bcast - cur + 1).toLocaleString('vi-VN') + ' IP (từ ' + n2ip(cur) + ')</span></div>';
      document.getElementById('subTable').innerHTML = '<tr><th>AZ</th><th>Tầng</th><th>CIDR subnet</th><th>IP cuối</th><th>IP dùng được</th><th>Route ra ngoài</th></tr>' + rows;
      out.classList.add('show');
    });

    /* ================= HIỆU ỨNG: counter, reveal, hạt dữ liệu ================= */
    var counters = document.querySelectorAll('[data-count]');
    var cObs = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target, target = +el.getAttribute('data-count'), t0 = null;
        function step(ts){ if(!t0) t0 = ts; var p = Math.min((ts - t0)/60, 1); el.textContent = Math.round(target * p) + (p === 1 ? '+' : ''); if(p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step); cObs.unobserve(el);
      });
    }, {threshold:.5});
    counters.forEach(function(el){ cObs.observe(el); });
    var rObs = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rObs.unobserve(e.target); } });
    }, {threshold:.08});
    document.querySelectorAll('.reveal').forEach(function(el){ rObs.observe(el); });
    (function(){
      var cv = document.getElementById('bgCanvas');
      if(!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var ctx = cv.getContext('2d'), W, H, pts = [], running = true;
      function resize(){ W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
      resize(); window.addEventListener('resize', resize);
      var COLORS = ['34,211,238','167,139,250','244,113,182','255,153,0','52,211,153'];
      for(var i = 0; i < 55; i++){
        pts.push({x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 0.00022, vy: (Math.random() - .5) * 0.00016, r: Math.random() * 1.6 + .6, c: COLORS[i % COLORS.length]});
      }
      document.addEventListener('visibilitychange', function(){ running = !document.hidden; if(running) requestAnimationFrame(draw); });
      function draw(){
        if(!running) return;
        ctx.clearRect(0, 0, W, H);
        pts.forEach(function(p){
          p.x += p.vx; p.y += p.vy;
          if(p.x < 0 || p.x > 1) p.vx *= -1;
          if(p.y < 0 || p.y > 1) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.283);
          ctx.fillStyle = 'rgba(' + p.c + ',.75)'; ctx.fill();
        });
        for(var i = 0; i < pts.length; i++) for(var j = i + 1; j < pts.length; j++){
          var dx = (pts[i].x - pts[j].x) * W, dy = (pts[i].y - pts[j].y) * H, d = Math.sqrt(dx*dx + dy*dy);
          if(d < 120){ ctx.beginPath(); ctx.moveTo(pts[i].x * W, pts[i].y * H); ctx.lineTo(pts[j].x * W, pts[j].y * H); ctx.strokeStyle = 'rgba(56,150,255,' + (0.10 * (1 - d/120)) + ')'; ctx.lineWidth = 1; ctx.stroke(); }
        }
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
    })();

    /* ================= CHUYÊN MỤC CLOUD ARCHITECT ================= */
    GLYPHS.wheel = '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="9.2"/><path d="M12 2.8v6M12 15.2v6M2.8 12h6M15.2 12h6M5.2 5.2l4.2 4.2M14.6 14.6l4.2 4.2M18.8 5.2l-4.2 4.2M9.4 14.6l-4.2 4.2"/>';
    GLYPHS.anchor = '<circle cx="12" cy="5" r="2.6"/><path d="M12 7.6V21M12 21c-4.5 0-8-3-8.7-7h3M12 21c4.5 0 8-3 8.7-7h-3M8 11.5h8"/>';
    GLYPHS.play = '<path d="M7 4.8v14.4L19 12 7 4.8Z"/>';
    var TECH = {
      'Terraform':['cube','#7B42BC'],'Kubernetes':['wheel','#326CE5'],'Docker':['box','#2496ED'],'Helm':['anchor','#2E6FDB'],
      'Argo CD':['refresh','#EF7B4D'],'Flux':['sync','#326CE5'],'GitHub Actions':['play','#2088FF'],'Git':['branch','#F05033'],
      'Linux':['code','#E8B400'],'Bash':['code','#4EAA25'],'Python':['code','#3776AB'],'Docker Compose':['layers','#2496ED'],
      'Prometheus':['gauge','#E6522C'],'Grafana':['graph','#F46800'],'Istio':['nodes','#466BB0'],'Linkerd':['link','#324AA8'],
      'OPA / Sentinel':['shield','#7D9199'],'Checkov':['search','#2EBFA5'],'HCP Terraform':['globe','#7B42BC'],
      'SQL':['db','#336791'],'API Design':['link','#FF6C37'],'gRPC':['zap','#244C5A'],'GraphQL':['nodes','#E535AB'],
      'Microservices':['hub','#01A88D'],'Event-Driven':['bell','#E7157B'],'Serverless':['lambda','#E07700'],'FinOps':['wallet','#4CC26E'],
      'Zero Trust':['lock','#DD344C'],'SRE / SLO':['target','#2E9E4F'],'GitHub':['branch','#9E9E9E'],'CI/CD':['flow','#2088FF']
    };
    function ticon(name, size){
      size = size || 30;
      var t = TECH[name] || ['box','#527FFF'];
      var gs = Math.round(size * 0.66);
      return '<span class="svc-ic" role="img" aria-label="Icon ' + name + '" title="' + name + '" style="width:' + size + 'px;height:' + size + 'px;background:' + t[1] + '"><svg width="' + gs + '" height="' + gs + '" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (GLYPHS[t[0]] || GLYPHS.box) + '</svg></span>';
    }
    document.getElementById('techStrip').innerHTML = Object.keys(TECH).slice(0, 18).map(function(k){
      return '<span class="tag svc-chip">' + ticon(k, 20) + esc(k) + '</span>';
    }).join('');

    function topicCard(tech, title, body){
      return '<article class="net-card"><h3>' + ticon(tech, 30) + esc(title) + '</h3>' + body + '</article>';
    }
    /* ---- Terraform topics ---- */
    var TF = [
    ['Terraform','1 · HCL & vòng đời lệnh','<ul><li>Ngôn ngữ <b>HCL</b>: block <span class="mono">resource / data / variable / output / locals / module</span>.</li><li>Vòng đời bất biến: <span class="mono">init → validate → plan → apply → destroy</span>; luôn đọc plan như đọc “hợp đồng thay đổi”.</li><li><span class="mono">terraform fmt</span> &amp; <span class="mono">tflint</span> là chuẩn tối thiểu trước khi commit.</li></ul>'],
    ['Terraform','2 · Provider AWS & google','<ul><li>Provider là “trình điều khiển” dịch API cloud thành resource: <span class="mono">hashicorp/aws</span>, <span class="mono">hashicorp/google</span> (và <span class="mono">google-beta</span> cho tính năng mới).</li><li>Ghim version provider &amp; Terraform, commit file <span class="mono">.terraform.lock.hcl</span> để mọi máy build giống hệt nhau.</li><li>Một repo có thể khai nhiều provider (multi-cloud, alias theo region).</li></ul>'],
    ['Terraform','3 · Resource, Data Source, Variable, Output','<ul><li><b>resource</b> = thứ Terraform tạo &amp; quản; <b>data source</b> = đọc thứ có sẵn (AMI mới nhất, VPC mặc định, secret…).</li><li><b>variable</b> có type, default, validation; giá trị bí mật đánh dấu <span class="mono">sensitive = true</span>.</li><li><b>output</b> là cầu nối giữa các module/layer state (qua <span class="mono">terraform_remote_state</span> khi cần).</li></ul>'],
    ['Terraform','4 · State & remote backend','<ul><li>State là “sổ đăng ký” ánh xạ code ↔ tài nguyên thật — mất state là mất quyền quản lý, nên <b>luôn để remote</b>.</li><li>AWS: S3 + DynamoDB lock. GCP: GCS backend (tự khoá). Mã hoá &amp; versioning bucket state là bắt buộc.</li><li>Tách state theo lớp (network / platform / app) &amp; theo môi trường để giảm bán kính rủi ro khi apply.</li></ul>'],
    ['Terraform','5 · Module hoá & tái sử dụng','<ul><li>Module tốt = một “sản phẩm hạ tầng” có input/output rõ ràng, version bằng Git tag.</li><li>Nguồn module: local, Git, Terraform Registry, HCP private registry cho doanh nghiệp.</li><li>Quy tắc: module không chứa giá trị riêng của môi trường — mọi khác biệt đi qua variable.</li></ul>'],
    ['Terraform','6 · count, for_each & dynamic block','<ul><li><span class="mono">count</span> cho số lượng đơn giản; <span class="mono">for_each</span> theo map/set cho tài nguyên có danh tính riêng (ổn định hơn khi thêm/bớt phần tử giữa danh sách).</li><li><span class="mono">dynamic block</span> sinh các block lồng nhau (ingress rules, tag…) từ dữ liệu.</li><li>Kết hợp <span class="mono">locals</span> để biến dữ liệu thô thành cấu trúc sạch trước khi for_each.</li></ul>'],
    ['Terraform','7 · Workspace & chiến lược môi trường','<ul><li>Workspace hợp cho khác biệt nhỏ (cùng cấu trúc, khác size/số lượng).</li><li>Dự án thật thường dùng <b>thư mục envs/ riêng + module chung</b> (như cấu trúc mẫu ở trên) vì state, backend và quyền apply của prod phải tách hẳn.</li><li>Không bao giờ cho CI quyền apply prod từ nhánh feature.</li></ul>'],
    ['OPA / Sentinel','8 · Policy as Code & bảo mật IaC','<ul><li><b>Checkov / tfsec</b>: quét tĩnh tìm cấu hình sai (bucket public, SG mở 0.0.0.0/0, thiếu mã hoá) ngay trong PR.</li><li><b>OPA (Conftest)</b> / <b>Sentinel</b> (HCP Terraform): luật tổ chức dạng code — vd “mọi RDS phải Multi-AZ”, “chỉ region Tokyo/Osaka”.</li><li>Policy chặn ở mức plan: vi phạm là pipeline đỏ, không chờ tới lúc apply.</li></ul>'],
    ['GitHub Actions','9 · CI/CD cho Terraform','<ul><li>PR mở → workflow chạy <span class="mono">fmt -check, validate, plan</span> và bình luận bản plan vào PR để người duyệt đọc.</li><li>Merge vào main → <span class="mono">apply</span> chỉ với environment protection (người duyệt) trên GitHub.</li><li>Thông tin đăng nhập cloud bằng <b>OIDC federation</b> (GitHub → AWS IAM Role / GCP Workload Identity) — không lưu access key dài hạn trong Secrets.</li></ul>']
    ];
    document.getElementById('tfTopics').innerHTML = TF.map(function(x){ return topicCard(x[0], x[1], x[2]); }).join('');

    var TFLAB = [{t:'Lab Terraform · Một code, hai cloud: kiến trúc 3-tier',dom:'DevOps',lv:1,time:'120 phút',goal:'Viết một repo Terraform triển khai cùng kiến trúc 3-tier (mạng, app, DB) lên cả AWS và GCP rồi so sánh khác biệt.',svc:['Amazon VPC','Virtual Private Cloud (VPC)','Amazon RDS','Cloud SQL'],
     aws:['Module <span class="mono">network</span>: VPC 10.0.0.0/16, 2 public + 2 private subnet, IGW, NAT theo AZ.','Module <span class="mono">app</span>: ALB + ECS Fargate service 2 task; module <span class="mono">data</span>: RDS PostgreSQL Multi-AZ ở private subnet.','Backend S3 + DynamoDB lock; <span class="mono">plan</span> phải cho đúng số resource dự kiến trước khi apply.'],
     gcp:['Module <span class="mono">network</span>: 1 VPC global, subnet Tokyo 10.10.0.0/20, Cloud NAT + Cloud Router.','Module <span class="mono">app</span>: Cloud Run sau Global LB; module <span class="mono">data</span>: Cloud SQL PostgreSQL HA regional với private IP.','Backend GCS; chạy cùng pipeline GitHub Actions với OIDC — không dùng key JSON.'],
     out:'Trả lời được bằng trải nghiệm thật: vì sao phía GCP ít resource mạng hơn (VPC global), phía AWS cần NAT theo AZ, và module nào dùng chung được tư duy thiết kế.'}];
    document.getElementById('tfLab').innerHTML = TFLAB.map(function(l){
      return '<article class="lab-card"><div class="lab-meta"><span class="tag lv-tb">Trung cấp</span><span class="tag tm">⏱ ' + l.time + '</span><span class="tag domain">' + ticon('Terraform', 18) + ' Terraform</span></div>'
      + '<h3>' + esc(l.t) + '</h3><p>' + esc(l.goal) + '</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:11px">' + l.svc.map(function(n){ return '<span class="tag svc-chip">' + iconOf(n, 20) + esc(n) + '</span>'; }).join('') + '</div>'
      + '<details><summary>Xem các bước làm song song AWS ⇄ GCP</summary><div class="lab-dual"><div><h5 class="aws">Phía AWS</h5><ol>' + l.aws.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div>'
      + '<div><h5 class="gcp">Phía Google Cloud</h5><ol>' + l.gcp.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div></div>'
      + '<div class="lab-out"><b>Kết quả cần đạt:</b> ' + esc(l.out) + '</div></details></article>';
    }).join('');

    /* ---- Kubernetes topics ---- */
    var K8S = [
    ['Kubernetes','1 · Pod, Deployment, ReplicaSet','<ul><li><b>Pod</b> là đơn vị chạy nhỏ nhất (1+ container chung mạng/đĩa). Không ai chạy Pod trần ở production.</li><li><b>Deployment</b> quản ReplicaSet: khai số bản sao mong muốn, rolling update &amp; rollback bằng <span class="mono">kubectl rollout</span>.</li><li>Luôn đặt <span class="mono">requests/limits</span> CPU/RAM — không có requests thì scheduler và HPA đều “mù”.</li></ul>'],
    ['Kubernetes','2 · Service & Ingress / Gateway API','<ul><li><b>ClusterIP</b> (nội bộ), <b>NodePort</b>, <b>LoadBalancer</b> (xin LB của cloud).</li><li><b>Ingress</b> định tuyến HTTP theo host/path; <b>Gateway API</b> là thế hệ mới thay Ingress — tách vai trò platform team (Gateway) và dev team (HTTPRoute).</li><li>Trên EKS Ingress → ALB; trên GKE Gateway → Global LB anycast.</li></ul>'],
    ['Kubernetes','3 · ConfigMap & Secret','<ul><li>ConfigMap cho cấu hình thường; Secret cho dữ liệu nhạy cảm (vẫn phải mã hoá etcd + KMS và giới hạn RBAC).</li><li>Production nên nối Secret với kho ngoài: AWS Secrets Manager (qua Secrets Store CSI) / GCP Secret Manager — pod lấy qua Workload Identity/IRSA, không nhúng vào image.</li><li>Đổi config nên tạo bản mới &amp; rollout, tránh sửa nóng khó truy vết.</li></ul>'],
    ['Kubernetes','4 · Storage: PV, PVC, StorageClass','<ul><li>Pod xin đĩa qua <b>PVC</b>; <b>StorageClass</b> ánh xạ sang đĩa cloud: EBS (EBS CSI) trên EKS, Persistent Disk (PD CSI) trên GKE.</li><li>Đĩa block là theo zone — pod stateful phải lên lịch cùng zone với đĩa (StorageClass <span class="mono">WaitForFirstConsumer</span>).</li><li>StatefulSet + PVC theo từng replica cho DB/queue tự host; còn lại ưu tiên DB managed của cloud.</li></ul>'],
    ['Kubernetes','5 · Namespace, RBAC & NetworkPolicy','<ul><li><b>Namespace</b> tách team/môi trường + ResourceQuota khoá ngân sách tài nguyên.</li><li><b>RBAC</b>: quyền theo ServiceAccount, nguyên tắc tối thiểu; tránh cluster-admin cho ứng dụng.</li><li><b>NetworkPolicy</b>: mặc định nên deny-all rồi mở đúng luồng cần thiết giữa các service.</li></ul>'],
    ['Kubernetes','6 · Autoscaling: HPA, VPA, Cluster Autoscaler','<ul><li><b>HPA</b> scale số Pod theo CPU/RAM/custom metric (qua Prometheus Adapter/KEDA theo sự kiện).</li><li><b>VPA</b> gợi ý/tự chỉnh requests cho đúng thực tế.</li><li>Tầng node: <b>Karpenter</b> (EKS) chọn node tối ưu chi phí; GKE dùng Cluster Autoscaler hoặc Autopilot (khỏi lo tầng node).</li></ul>'],
    ['Helm','7 · Helm & Kustomize — đóng gói cấu hình','<ul><li><b>Helm chart</b>: template + values theo môi trường — chuẩn đóng gói ứng dụng K8s phổ biến nhất.</li><li><b>Kustomize</b>: overlay không template, hợp khi cấu hình các môi trường gần giống nhau.</li><li>Chart của bên thứ ba phải ghim version &amp; quét bảo mật trước khi đưa vào cluster.</li></ul>'],
    ['Argo CD','8 · GitOps với Argo CD / Flux','<ul><li>Git là nguồn sự thật duy nhất: agent trong cluster tự kéo trạng thái về khớp Git (Argo CD có UI đẹp; Flux nhẹ, thuần CLI/GitOps Toolkit).</li><li>Luồng chuẩn: CI build image &amp; cập nhật tag trong repo GitOps → Argo CD tự sync → có thể rollback bằng <span class="mono">git revert</span>.</li><li>Tách repo ứng dụng và repo cấu hình triển khai để kiểm soát quyền rõ ràng.</li></ul>'],
    ['Prometheus','9 · Observability & bảo mật chuỗi cung ứng','<ul><li><b>Prometheus + Grafana</b> là cặp chuẩn: metrics, dashboard, cảnh báo qua Alertmanager; log bằng Loki/Fluent Bit; trace bằng OpenTelemetry.</li><li>Quét image (Trivy/Inspector/Artifact Registry scanning), ký image (cosign) và chỉ cho deploy image đã ký (Binary Authorization phía GKE, policy phía EKS).</li><li>Đặt SLO cho service quan trọng và alert theo triệu chứng người dùng, không alert theo mọi metric.</li></ul>']
    ];
    document.getElementById('k8sTopics').innerHTML = K8S.map(function(x){ return topicCard(x[0], x[1], x[2]); }).join('');

    var K8SLAB = [{t:'Lab Kubernetes · Ứng dụng hoàn chỉnh lên EKS & GKE',time:'150 phút',goal:'Triển khai một ứng dụng web + API có autoscaling, ingress HTTPS và monitoring lên cả EKS và GKE.',svc:['Amazon EKS','Google Kubernetes Engine (GKE)','Amazon ECR','Artifact Registry'],
     aws:['Tạo EKS bằng Terraform/eksctl, node group Graviton 2 node ở 2 AZ; cài AWS Load Balancer Controller + ExternalDNS.','Đẩy image lên ECR, deploy bằng Helm chart (Deployment 3 replica, Service, Ingress → ALB + chứng chỉ ACM).','Bật HPA (CPU 60%), cấu hình IRSA cho pod đọc S3; cài kube-prometheus-stack xem dashboard Grafana.','Dùng Argo CD sync từ repo GitOps; thử rollout bản mới và rollback.'],
     gcp:['Tạo GKE Autopilot bằng Terraform/gcloud; cài cert-manager hoặc dùng Google-managed certificate.','Đẩy image lên Artifact Registry, deploy cùng Helm chart (đổi values: Gateway → Global LB).','Bật HPA tương tự; cấu hình Workload Identity cho pod gọi Cloud Storage; xem metrics trong Cloud Monitoring + Grafana.','Dùng Argo CD (hoặc Flux) sync cùng repo GitOps — một quy trình, hai cluster.'],
     out:'Một ứng dụng, một chart Helm, một pipeline GitOps chạy trên cả hai cloud — đây chính là năng lực “platform” mà Architect hiện đại cần.'}];
    document.getElementById('k8sLab').innerHTML = K8SLAB.map(function(l){
      return '<article class="lab-card"><div class="lab-meta"><span class="tag lv-nc">Nâng cao</span><span class="tag tm">⏱ ' + l.time + '</span><span class="tag domain">' + ticon('Kubernetes', 18) + ' Kubernetes</span></div>'
      + '<h3>' + esc(l.t) + '</h3><p>' + esc(l.goal) + '</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:11px">' + l.svc.map(function(n){ return '<span class="tag svc-chip">' + iconOf(n, 20) + esc(n) + '</span>'; }).join('') + '</div>'
      + '<details><summary>Xem các bước làm song song EKS ⇄ GKE</summary><div class="lab-dual"><div><h5 class="aws">Amazon EKS</h5><ol>' + l.aws.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div>'
      + '<div><h5 class="gcp">Google GKE</h5><ol>' + l.gcp.map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ol></div></div>'
      + '<div class="lab-out"><b>Kết quả cần đạt:</b> ' + esc(l.out) + '</div></details></article>';
    }).join('');

    /* ---- Foundation ---- */
    var FOUND = [
    ['Linux','Linux & Command Line','<ul><li>Quản trị file/quyền (chmod/chown), tiến trình, systemd, ssh, quản lý gói.</li><li>Chuẩn đạt: xử lý được 90% thao tác máy chủ không cần GUI, đọc log bằng <span class="mono">journalctl/grep/awk</span>.</li></ul>'],
    ['Kubernetes','Mạng máy tính (TCP/IP, DNS, HTTP, TLS)','<ul><li>Mô hình TCP/IP, cách DNS phân giải, bắt tay TLS, HTTP/2, cơ chế load balancing &amp; CDN.</li><li>Chuẩn đạt: tự debug được “tên miền không vào được web” theo từng lớp (Phần 5 là phần đào sâu).</li></ul>'],
    ['Git','Git & GitHub','<ul><li>Branching (trunk-based/GitFlow), PR &amp; code review, rebase an toàn, tag/release.</li><li>Chuẩn đạt: cả team làm việc trên một repo mà không “đạp” code của nhau.</li></ul>'],
    ['Docker','Docker & Container','<ul><li>Image/layer caching, Dockerfile đa stage, bảo mật image (user non-root, quét lỗ hổng).</li><li>Chuẩn đạt: tự đóng gói được một ứng dụng thật thành image gọn &amp; an toàn.</li></ul>'],
    ['CI/CD','CI/CD (GitHub Actions, CodePipeline, Cloud Build)','<ul><li>Pipeline build–test–scan–deploy, môi trường ephemeral, phê duyệt production.</li><li>Chuẩn đạt: mọi thay đổi lên production đều qua pipeline có lưu vết (xem Lab 8).</li></ul>'],
    ['Python','Scripting: Bash & Python','<ul><li>Bash cho thao tác hệ thống; Python (boto3 / google-cloud SDK) cho automation cloud.</li><li>Chuẩn đạt: viết được script dọn tài nguyên thừa, báo cáo chi phí, kiểm tra cấu hình hàng loạt.</li></ul>'],
    ['SQL','SQL & NoSQL Modeling','<ul><li>Chuẩn hoá &amp; đánh index SQL; mô hình hoá NoSQL theo mẫu truy cập (không theo bảng).</li><li>Chuẩn đạt: chọn đúng RDS/Aurora/Cloud SQL/AlloyDB/DynamoDB/Firestore cho từng bài toán (xem bảng đối chiếu Phần 1).</li></ul>'],
    ['API Design','API Design: REST, gRPC, GraphQL','<ul><li>REST cho API công khai; gRPC cho giao tiếp nội bộ hiệu năng cao; GraphQL khi client cần chọn dữ liệu linh hoạt.</li><li>Chuẩn đạt: thiết kế được versioning, phân trang, idempotency &amp; giới hạn tốc độ cho API.</li></ul>'],
    ['Microservices','Microservices & Event-Driven','<ul><li>Chia service theo miền nghiệp vụ; giao tiếp bất đồng bộ qua SQS/Pub/Sub/EventBridge/Eventarc; pattern saga &amp; outbox.</li><li>Chuẩn đạt: biết khi nào KHÔNG nên chia nhỏ — monolith đúng chỗ vẫn thắng.</li></ul>'],
    ['Serverless','Serverless Patterns','<ul><li>API serverless, xử lý sự kiện file/stream, orchestration bằng Step Functions/Workflows.</li><li>Chuẩn đạt: thiết kế được hệ thống chịu đỉnh tải mà chi phí lúc rảnh gần 0 (Lab 5, Lab 10).</li></ul>']
    ];
    document.getElementById('foundGrid').innerHTML = FOUND.map(function(x){ return topicCard(x[0], x[1], x[2]); }).join('');

    /* ---- Architecture & design ---- */
    var ARCH = [
    ['SRE / SLO','Thiết kế HA & DR (RTO/RPO)','<ul><li>4 cấp chiến lược DR: <b>Backup &amp; Restore</b> (RTO giờ) → <b>Pilot Light</b> → <b>Warm Standby</b> → <b>Multi-site Active-Active</b> (RTO gần 0, đắt nhất).</li><li>Multi-AZ là mặc định cho production; multi-region chỉ khi RTO/RPO hoặc luật cư trú dữ liệu yêu cầu.</li><li>DR không diễn tập = không có DR: lên lịch game day khôi phục định kỳ.</li></ul>'],
    ['Grafana','Scalability & Performance','<ul><li>Scale ngang bằng stateless + queue đệm; cache đúng lớp (CDN, ElastiCache/Memorystore, DAX).</li><li>Đo bằng số: p95/p99 latency, throughput, độ bão hoà — không tối ưu theo cảm tính.</li><li>Load test trước ngày cao điểm (k6/Locust) và chốt giới hạn của từng thành phần.</li></ul>'],
    ['FinOps','Cost Optimization & FinOps','<ul><li>Văn hoá FinOps: tag đầy đủ, ngân sách theo team, review chi phí định kỳ như review code.</li><li>Đòn bẩy: right-sizing, Savings Plans/CUD, Spot, storage tiering, tắt môi trường ngoài giờ.</li><li>Đơn vị kinh tế (unit economics): chi phí / đơn hàng, / người dùng — con số Architect phải thuộc.</li></ul>'],
    ['Zero Trust','Security by Design','<ul><li>Zero Trust: không tin mặc định theo vị trí mạng; xác thực theo danh tính + ngữ cảnh (Verified Access / VPC Service Controls).</li><li>Least privilege, mã hoá everywhere (KMS hai phía), secret không nằm trong code/image.</li><li>Tuân thủ theo khung (CIS Benchmark, ISO 27001, PCI DSS) kiểm bằng Security Hub / Security Command Center.</li></ul>'],
    ['Prometheus','Observability: Log, Metric, Trace & SLI/SLO/SLA','<ul><li><b>SLI</b> = chỉ số đo (tỉ lệ request tốt); <b>SLO</b> = mục tiêu nội bộ (99,9%); <b>SLA</b> = cam kết với khách kèm bồi thường.</li><li>Error budget biến độ tin cậy thành quyết định kinh doanh: còn budget thì ship nhanh, hết budget thì ưu tiên ổn định.</li><li>Ba trụ: logs (CloudWatch Logs/Cloud Logging), metrics, traces (X-Ray/Cloud Trace) hợp nhất bằng OpenTelemetry.</li></ul>'],
    ['Terraform','Capacity, Trade-off & Đọc/vẽ sơ đồ','<ul><li>Mọi quyết định kiến trúc đều là đánh đổi: ghi <b>ADR</b> cho quyết định lớn (bối cảnh, lựa chọn, hệ quả).</li><li>Dự báo dung lượng theo tăng trưởng nghiệp vụ, không theo “phòng xa” vô hạn.</li><li>Vẽ sơ đồ chuẩn AWS/GCP (đúng icon, đúng biên VPC/region/AZ) như ở Phần 4 — sơ đồ là tài liệu giao tiếp số 1 của Architect.</li></ul>']
    ];
    document.getElementById('archGrid').innerHTML = ARCH.map(function(x){ return topicCard(x[0], x[1], x[2]); }).join('');

    /* ---- Roadmap ---- */
    var ROAD = [
    ['Foundation','AWS Certified Cloud Practitioner','Google Cloud Digital Leader','Mô hình cloud, nhóm service cốt lõi của cả hai cloud, billing &amp; bảo mật cơ bản, Linux/Git/Docker nền.','Lab 1–3 (mạng nền, VM, web tĩnh) ở cả hai cloud.','Dựng website tĩnh + VM web server hai cloud, viết README so sánh chi phí.'],
    ['Associate','AWS Solutions Architect – Associate','Google Associate Cloud Engineer','Thiết kế VPC multi-AZ/Shared VPC, IAM least-privilege, Terraform cơ bản, K8s cơ bản (EKS/GKE), HA &amp; backup.','Lab 4–8 + Lab Terraform (3-tier hai cloud).','Triển khai ứng dụng 3-tier bằng Terraform lên AWS và GCP, có monitoring &amp; alarm.'],
    ['Professional / Specialty','AWS Solutions Architect – Professional · Advanced Networking · Security Specialty','Google Professional Cloud Architect · Professional Cloud Network Engineer · Professional Cloud Security Engineer','Thiết kế đa tài khoản/đa region, migration quy mô lớn, DR, FinOps, bảo mật nâng cao, Kubernetes production &amp; GitOps.','Lab 9–12 + toàn bộ labs migration &amp; networking bậc thầy.','Hoàn thành Capstone ở Khối 6: phân tích → chọn cloud → Terraform → K8s → CI/CD → vận hành → báo cáo chi phí.']
    ];
    document.getElementById('roadmapTable').innerHTML = '<tr><th style="width:12%">Cấp độ</th><th style="width:19%">Chứng chỉ AWS</th><th style="width:19%">Chứng chỉ Google Cloud</th><th style="width:20%">Cần học gì</th><th style="width:15%">Lab trong trang này</th><th>Project mẫu phải làm được</th></tr>'
      + ROAD.map(function(r){ return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>'; }).join('');

    /* ---- Capstone steps ---- */
    var CAP = [
    ['1','Phân tích yêu cầu','Chuyển yêu cầu kinh doanh thành NFR đo được: RTO 4 giờ, RPO 15 phút, p95 < 300ms, dữ liệu ở Nhật, ngân sách trần/tháng.'],
    ['2','Chọn cloud & vẽ sơ đồ','AWS chính + BigQuery phụ trợ (multi-cloud có chủ đích), sơ đồ 3-tier trên EKS + đường dữ liệu sang GCP, ADR cho từng quyết định.'],
    ['3','Viết Terraform','Repo theo cấu trúc Khối 1: module network/app/data, envs dev/staging/prod, state remote hai phía, policy Checkov trong CI.'],
    ['4','Triển khai Kubernetes','Helm chart cho web + API, HPA, Ingress ALB + TLS, IRSA, Argo CD GitOps; phía GCP chỉ chạy pipeline dữ liệu (Dataflow/Datastream).'],
    ['5','CI/CD & kiểm thử','GitHub Actions: test → build → quét image → cập nhật GitOps repo; diễn tập failover AZ và khôi phục backup trước go-live.'],
    ['6','Giám sát, vận hành, chi phí','Dashboard Grafana hợp nhất, SLO 99,9% cho checkout, runbook sự cố, báo cáo chi phí theo tag + review FinOps 2 tuần/lần.']
    ];
    document.getElementById('capstoneSteps').innerHTML = '<div class="phase" style="margin:14px 0 18px">' + CAP.map(function(c){
      return '<div><span class="n">' + c[0] + '</span><b>' + c[1] + '</b><p>' + c[2] + '</p></div>';
    }).join('') + '</div>';
    document.querySelectorAll('#architect .copy-btn').forEach(function(b){ b.addEventListener('click', function(){ copyCode(b); }); });

    /* ================= I18N — BỘ TỪ ĐIỂN TIẾNG NHẬT ================= */
    var JAD = {
    /* Điều hướng & hero */
    'Học AWS & GCP':'AWS & GCP を学ぶ','Services':'サービス','Labs thực hành':'実践ラボ','Migration':'移行','Sơ đồ':'アーキテクチャ図','Networking':'ネットワーキング','Dự án':'プロジェクト設計','Architect':'アーキテクト','Deploy':'デプロイ',
    'Học AWS & Google Cloud song song: services, labs, migration & networking':'AWS & Google Cloud を並行して学ぶ：サービス・ラボ・移行・ネットワーキング',
    'Trang học tập thực chiến trên hai nền tảng cloud hàng đầu — AWS & Google Cloud — hiểu rõ từng service kèm cấu hình mẫu, làm labs từng bước bằng cả aws CLI lẫn gcloud CLI, di chuyển mọi môi trường (kể cả AWS ⇄ GCP), đối chiếu tương đương xuyên suốt, và làm chủ Cloud Networking đến cấp độ thiết kế dự án thật.':'AWS & Google Cloud、二つの主要クラウドを実践的に学ぶページです。各サービスの設定例を理解し、aws CLI と gcloud CLI の両方でラボを進め、あらゆる環境（AWS ⇄ GCP 間を含む）を移行し、対応関係を比較しながら、プロジェクト設計レベルまでクラウドネットワーキングを習得します。',
    'services AWS + GCP, tất cả đều có icon riêng':'AWS + GCP のサービス（全てに専用アイコン付き）','labs thực hành & migration từng bước':'実践ラボ＆移行ラボ（手順付き）','chiến lược migration (7R) · 9 labs migration':'移行戦略（7R）と移行ラボ9件','chủ đề networking chuyên sâu':'ネットワーキング専門トピック',
    'Bắt đầu làm lab':'ラボを始める','Vào phần Networking':'ネットワーキングへ',
    'Luồng request điển hình: User → CloudFront → ALB → EC2 Auto Scaling → RDS / S3, Lambda xử lý sự kiện bất đồng bộ. Các gói cam mô phỏng luồng dữ liệu đang di chuyển trên sơ đồ.':'典型的なリクエストフロー：ユーザー → CloudFront → ALB → EC2 Auto Scaling → RDS / S3。Lambda がイベントを非同期処理します。オレンジの点はデータフローのシミュレーションです。',
    'Người dùng':'ユーザー',
    /* Phần 1 Services */
    'Phần 1 · Services':'第1部 · サービス','Danh mục toàn bộ services — AWS & Google Cloud':'全サービスカタログ — AWS & Google Cloud',
    'So sánh AWS ⇄ GCP':'AWS ⇄ GCP 比較','Tất cả nhóm':'全グループ','Tìm service… vd: Bedrock, Transit Gateway, DMS, Kafka':'サービスを検索… 例：Bedrock、Transit Gateway、DMS、Kafka',
    'Mọi cấp độ':'全レベル','Nền tảng (học trước)':'基礎（最初に学ぶ）','Trung cấp':'中級','Chuyên sâu':'上級','Nền tảng':'基礎',
    'Chi tiết sâu':'詳細解説','Mới 2025':'2025年新登場','Mới':'新登場','Ngừng hỗ trợ':'サポート終了','Ngừng/Maintenance':'終了/メンテナンス',
    'Bảng đối chiếu các cặp service tương đương quan trọng nhất. Cột “Khác biệt quyết định” là thứ cần nhớ khi thiết kế: giống nhau về vai trò không có nghĩa giống nhau về mô hình vận hành và giá.':'主要な対応サービスの一覧です。「決定的な違い」の列が設計時に重要です。役割が同じでも、運用モデルや料金が同じとは限りません。',
    'Không tìm thấy service nào khớp bộ lọc. Thử xoá từ khoá tìm kiếm.':'条件に合うサービスがありません。検索キーワードを消して試してください。',
    /* Modal */
    'Khi nào dùng':'利用シーン','Giới hạn & điểm cần nhớ':'制限と注意点','Mô hình giá':'料金モデル','So sánh với service dễ nhầm':'混同しやすいサービスとの比較','Lỗi thường gặp':'よくあるミス','Service liên quan':'関連サービス','Nó làm gì':'概要','Nhóm':'グループ','Cấp độ học':'学習レベル','Loại chi tiết':'解説レベル','Chi tiết sâu':'詳細解説',
    /* Nhóm AWS */
    'Compute':'コンピュート','Containers':'コンテナ','Storage':'ストレージ','Database':'データベース','Migration & Transfer':'移行と転送','Networking & Content Delivery':'ネットワーキングとコンテンツ配信','Developer Tools':'開発者ツール','Management & Governance':'管理とガバナンス','Security, Identity & Compliance':'セキュリティ・ID・コンプライアンス','Analytics':'分析','Machine Learning':'機械学習','Application Integration':'アプリケーション統合','Front-end Web & Mobile':'フロントエンドとモバイル','Media Services':'メディアサービス','Internet of Things':'IoT','End User Computing':'エンドユーザーコンピューティング','Business Applications':'ビジネスアプリケーション','Specialized & Emerging':'専門・新興分野',
    'Databases':'データベース','Networking':'ネットワーキング','Management & DevOps':'管理とDevOps','Security & Identity':'セキュリティとID','AI & Machine Learning':'AIと機械学習','Media & Other':'メディア・その他',
    /* Phần 2 Labs */
    'Phần 2 · Labs thực hành':'第2部 · 実践ラボ','Labs thực tế — làm theo từng bước':'実践ラボ — 手順に沿って構築する',
    'Lọc theo chủ đề:':'トピックで絞り込む：','Tất cả chủ đề':'全トピック','Compute & Web':'コンピュートとWeb','Database':'データベース','Serverless':'サーバーレス','DevOps & IaC':'DevOps & IaC','Security':'セキュリティ','Mọi mức độ':'全レベル','Cơ bản':'初級','Nâng cao':'上級',
    'Xem các bước làm song song AWS ⇄ GCP':'AWS ⇄ GCP の手順を見る','Kết quả cần đạt:':'達成目標：','Không có lab nào khớp bộ lọc.':'条件に合うラボがありません。',
    /* Phần 3 Migration */
    'Phần 3 · Migration':'第3部 · 移行','Di chuyển mọi môi trường lên AWS Cloud':'あらゆる環境をクラウドへ移行する',
    '7 chiến lược di chuyển (7R)':'7つの移行戦略（7R）','Labs migration theo môi trường nguồn — gồm cả cross-cloud AWS ⇄ GCP':'移行元環境ごとの移行ラボ — AWS ⇄ GCP のクロスクラウドを含む',
    'Xem các bước thực hiện':'手順を見る','Lưu ý:':'注意：','Công cụ chính:':'主要ツール：',
    /* Phần 4 Sơ đồ */
    'Phần 4 · Sơ đồ kiến trúc':'第4部 · アーキテクチャ図','Sơ đồ chi tiết — đọc kiến trúc như Solutions Architect':'詳細図 — ソリューションアーキテクトのように図を読む',
    /* Phần 5 Networking */
    'Phần 5 · Networking':'第5部 · ネットワーキング','AWS Cloud Networking — từ căn bản đến bậc thầy':'AWS クラウドネットワーキング — 基礎からマスターレベルまで',
    'Networking trên Google Cloud — phần song song':'Google Cloud のネットワーキング — 並行パート',
    'Công cụ thực hành: Máy tính CIDR & chia subnet cho VPC':'実践ツール：CIDR計算とVPCサブネット分割','Tính & chia subnet':'計算してサブネットを分割','CIDR của VPC':'VPCのCIDR','Số Availability Zone':'AZ数','Prefix mỗi subnet':'サブネットのプレフィックス',
    'Security Group vs Network ACL — bảng so sánh phải thuộc lòng':'Security Group と Network ACL — 必ず覚える比較表',
    'Đối chiếu Networking AWS ⇄ GCP — bảng tổng kết bậc thầy':'ネットワーキング AWS ⇄ GCP 対照表 — マスターレベルのまとめ',
    /* Phần 6 Dự án */
    'Phần 6 · Thiết kế dự án':'第6部 · プロジェクト設計','Quy trình phân tích & thiết kế một dự án AWS từ A–Z':'AWSプロジェクトの分析・設計プロセス A–Z',
    '6 trụ cột AWS Well-Architected Framework':'AWS Well-Architected Framework の6つの柱','Case study mẫu — Sàn thương mại điện tử giờ cao điểm':'ケーススタディ — ピーク時のECサイト',
    'Checklist trước khi chốt thiết kế (dùng cho mọi dự án)':'設計確定前チェックリスト（全プロジェクト共通）',
    'Ma trận quyết định: chọn AWS, Google Cloud hay multi-cloud?':'意思決定マトリクス：AWS、Google Cloud、マルチクラウドの選び方',
    /* Phần 7 Architect */
    'Phần 7 · Lộ trình nghề nghiệp':'第7部 · キャリアロードマップ','Trở thành Cloud Architect (AWS & GCP)':'クラウドアーキテクトになる（AWS & GCP）',
    'Khối 1 · Terraform (IaC) — từ cơ bản đến nâng cao':'ブロック1 · Terraform（IaC）— 基礎から上級まで',
    'Khối 2 · Kubernetes — từ nền tảng đến production':'ブロック2 · Kubernetes — 基礎から本番運用まで',
    'Khối 3 · Kiến thức nền tảng bắt buộc của Architect':'ブロック3 · アーキテクト必須の基礎知識',
    'Khối 4 · Kiến trúc & thiết kế hệ thống':'ブロック4 · アーキテクチャとシステム設計',
    'Khối 5 · Lộ trình cấp độ & chứng chỉ song song':'ブロック5 · レベル別ロードマップと資格対応表',
    'Khối 6 · Project capstone mẫu — làm trọn một dự án Architect':'ブロック6 · キャップストーンプロジェクト例 — アーキテクト案件を一通り実施する',
    'Sơ đồ kiến trúc Kubernetes cluster':'Kubernetes クラスターのアーキテクチャ図','EKS vs GKE — so sánh sâu cho Architect':'EKS と GKE — アーキテクト向け詳細比較',
    'Cấu trúc thư mục project Terraform chuẩn & remote state hai cloud':'標準的なTerraformプロジェクト構成と両クラウドのリモートステート',
    'Đối chiếu hai bộ khung kiến trúc: AWS Well-Architected ⇄ Google Cloud Architecture Framework':'2つのフレームワークの対照：AWS Well-Architected ⇄ Google Cloud Architecture Framework',
    'Xem các bước làm song song EKS ⇄ GKE':'EKS ⇄ GKE の手順を見る',
    /* Phần 8-9 */
    'Phần 9 · Làm việc tại Nhật':'第9部 · 日本企業で働く','Thuật ngữ Cloud & quy trình làm việc trong công ty Nhật':'日本のIT企業で使うクラウド用語と開発プロセス',
    'Phần 10 · Deploy':'第10部 · デプロイ','Đưa trang này lên GitHub Pages — static 100%':'このページを GitHub Pages に公開する — 完全静的',
    'Tuỳ chọn nâng cao: GitHub Actions workflow cho static site':'発展オプション：静的サイト向け GitHub Actions ワークフロー',
    'Repository đã sẵn sàng':'リポジトリ準備完了','Đẩy file lên repo':'ファイルをリポジトリへpush','Bật GitHub Pages':'GitHub Pages を有効化','Địa chỉ web chính thức':'公開URL',
    /* Footer */
    'Tài liệu chính thức để học tiếp':'さらに学ぶための公式ドキュメント'
    };

    Object.assign(JAD, {
    /* Bảng đối chiếu — tiêu đề cột */
    'AWS':'AWS','Google Cloud':'Google Cloud','Điểm giống':'共通点','Khác biệt quyết định':'決定的な違い','Khi nào chọn bên nào':'どちらを選ぶか',
    /* Labs — tiêu đề & mục tiêu */
    'Lab 1 · Dựng mạng nền: VPC hai cloud':'ラボ1 · ネットワーク基盤の構築：両クラウドのVPC',
    'Lab 2 · Web server đầu tiên: EC2 vs Compute Engine':'ラボ2 · 初めてのWebサーバー：EC2 と Compute Engine',
    'Lab 3 · Web tĩnh toàn cầu: S3 + CloudFront vs Cloud Storage + Cloud CDN':'ラボ3 · グローバル静的サイト：S3 + CloudFront と Cloud Storage + Cloud CDN',
    'Lab 4 · Database managed & kết nối riêng: RDS vs Cloud SQL':'ラボ4 · マネージドDBとプライベート接続：RDS と Cloud SQL',
    'Lab 5 · API serverless: Lambda + API Gateway vs Cloud Run functions':'ラボ5 · サーバーレスAPI：Lambda + API Gateway と Cloud Run functions',
    'Lab 6 · Container thực chiến: ECS Fargate vs Cloud Run':'ラボ6 · コンテナ実践：ECS Fargate と Cloud Run',
    'Lab 7 · IaC đa cloud bằng Terraform':'ラボ7 · Terraform によるマルチクラウドIaC',
    'Lab 8 · CI/CD hai cloud':'ラボ8 · 両クラウドのCI/CD',
    'Lab 9 · Kubernetes: EKS vs GKE Autopilot':'ラボ9 · Kubernetes：EKS と GKE Autopilot',
    'Lab 10 · Kiến trúc sự kiện: SQS + EventBridge vs Pub/Sub + Eventarc':'ラボ10 · イベント駆動：SQS + EventBridge と Pub/Sub + Eventarc',
    'Lab 11 · Giám sát & cảnh báo đa cloud':'ラボ11 · マルチクラウドの監視とアラート',
    'Lab 12 · Nền tảng bảo mật: IAM Role vs Service Account':'ラボ12 · セキュリティ基盤：IAMロールとサービスアカウント',
    /* Migration — tiêu đề */
    'On-premise VMware → AWS':'オンプレミス VMware → AWS',
    'On-premise vật lý / VMware → Google Cloud':'オンプレミス物理 / VMware → Google Cloud',
    'VMware → Google Cloud VMware Engine (GCVE)':'VMware → GCVE',
    'VMware → AWS bằng AWS Transform / EVS':'VMware → AWS（AWS Transform / EVS）',
    'AWS → Google Cloud (cross-cloud)':'AWS → Google Cloud（クロスクラウド）',
    'Google Cloud → AWS (cross-cloud)':'Google Cloud → AWS（クロスクラウド）',
    'Database on-prem Oracle → Aurora PostgreSQL':'オンプレミス Oracle → Aurora PostgreSQL',
    'Database cross-cloud: Cloud SQL ⇄ RDS / AlloyDB ⇄ Aurora':'DBクロスクラウド：Cloud SQL ⇄ RDS / AlloyDB ⇄ Aurora',
    'File server on-prem → Cloud (cả hai phía)':'オンプレミスファイルサーバー → クラウド（両方向）',
    /* Networking — tiêu đề chủ đề AWS */
    'CIDR & thiết kế dải IP — nền của mọi thứ':'CIDRとIPアドレス設計 — すべての土台',
    'Route Table — “bản đồ” quyết định mọi gói tin':'ルートテーブル — 全パケットを決める「地図」',
    'Security Group vs NACL — hai lớp tường lửa':'Security Group と NACL — 2層のファイアウォール',
    'NAT Gateway, IGW & Elastic IP':'NAT Gateway、IGW、Elastic IP',
    'VPC Peering vs Transit Gateway':'VPCピアリング と Transit Gateway',
    'VPC Endpoints & PrivateLink':'VPCエンドポイント と PrivateLink',
    'Hybrid: Direct Connect + VPN + BGP':'ハイブリッド：Direct Connect + VPN + BGP',
    'DNS với Route 53 — định tuyến bằng DNS':'Route 53 によるDNSルーティング',
    'Load Balancer — kiến trúc điểm vào':'ロードバランサー — 入口のアーキテクチャ',
    'Troubleshooting — quy trình debug bậc thầy':'トラブルシューティング — マスターレベルの手順',
    /* Networking GCP — tiêu đề */
    'VPC toàn cầu & subnet theo region':'グローバルVPCとリージョン別サブネット',
    'Shared VPC — mô hình mạng doanh nghiệp':'共有VPC（Shared VPC）— 企業ネットワークの標準形',
    'Firewall Rules, Cloud NGFW & Cloud Armor':'ファイアウォールルール、Cloud NGFW、Cloud Armor',
    'Global Load Balancing & anycast IP':'グローバルロードバランシングとエニーキャストIP',
    'Hybrid: Interconnect, HA VPN & Cloud Router':'ハイブリッド：Interconnect、HA VPN、Cloud Router',
    'Private Service Connect & Network Connectivity Center':'Private Service Connect と Network Connectivity Center',
    /* Terraform topics — tiêu đề */
    '1 · HCL & vòng đời lệnh':'1 · HCLとコマンドのライフサイクル',
    '2 · Provider AWS & google':'2 · AWS / google プロバイダー',
    '3 · Resource, Data Source, Variable, Output':'3 · リソース、データソース、変数、出力',
    '4 · State & remote backend':'4 · ステートとリモートバックエンド',
    '5 · Module hoá & tái sử dụng':'5 · モジュール化と再利用',
    '6 · count, for_each & dynamic block':'6 · count、for_each、dynamic block',
    '7 · Workspace & chiến lược môi trường':'7 · ワークスペースと環境戦略',
    '8 · Policy as Code & bảo mật IaC':'8 · Policy as Code とIaCセキュリティ',
    '9 · CI/CD cho Terraform':'9 · Terraform の CI/CD',
    'Lab Terraform · Một code, hai cloud: kiến trúc 3-tier':'Terraformラボ · 1つのコードで2クラウド：3層アーキテクチャ',
    /* Kubernetes topics — tiêu đề */
    '1 · Pod, Deployment, ReplicaSet':'1 · Pod、Deployment、ReplicaSet',
    '2 · Service & Ingress / Gateway API':'2 · Service と Ingress / Gateway API',
    '3 · ConfigMap & Secret':'3 · ConfigMap と Secret',
    '4 · Storage: PV, PVC, StorageClass':'4 · ストレージ：PV、PVC、StorageClass',
    '5 · Namespace, RBAC & NetworkPolicy':'5 · Namespace、RBAC、NetworkPolicy',
    '6 · Autoscaling: HPA, VPA, Cluster Autoscaler':'6 · オートスケーリング：HPA、VPA、Cluster Autoscaler',
    '7 · Helm & Kustomize — đóng gói cấu hình':'7 · Helm と Kustomize — 構成のパッケージ化',
    '8 · GitOps với Argo CD / Flux':'8 · Argo CD / Flux による GitOps',
    '9 · Observability & bảo mật chuỗi cung ứng':'9 · 可観測性とサプライチェーンセキュリティ',
    'Lab Kubernetes · Ứng dụng hoàn chỉnh lên EKS & GKE':'Kubernetesラボ · EKS & GKE へ完全なアプリをデプロイ',
    /* Foundation — tiêu đề */
    'Linux & Command Line':'Linux とコマンドライン',
    'Mạng máy tính (TCP/IP, DNS, HTTP, TLS)':'コンピュータネットワーク（TCP/IP、DNS、HTTP、TLS）',
    'Git & GitHub':'Git & GitHub','Docker & Container':'Docker とコンテナ',
    'CI/CD (GitHub Actions, CodePipeline, Cloud Build)':'CI/CD（GitHub Actions、CodePipeline、Cloud Build）',
    'Scripting: Bash & Python':'スクリプト：Bash & Python',
    'SQL & NoSQL Modeling':'SQL と NoSQL モデリング',
    'API Design: REST, gRPC, GraphQL':'API設計：REST、gRPC、GraphQL',
    'Microservices & Event-Driven':'マイクロサービスとイベント駆動',
    'Serverless Patterns':'サーバーレスパターン',
    /* Architecture — tiêu đề */
    'Thiết kế HA & DR (RTO/RPO)':'高可用性とDR設計（RTO/RPO）',
    'Scalability & Performance':'スケーラビリティとパフォーマンス',
    'Cost Optimization & FinOps':'コスト最適化とFinOps',
    'Security by Design':'セキュリティ・バイ・デザイン',
    'Observability: Log, Metric, Trace & SLI/SLO/SLA':'可観測性：ログ、メトリクス、トレースとSLI/SLO/SLA',
    'Capacity, Trade-off & Đọc/vẽ sơ đồ':'キャパシティ、トレードオフ、図の読み書き',
    /* Lộ trình */
    'Cấp độ':'レベル','Chứng chỉ AWS':'AWS認定資格','Chứng chỉ Google Cloud':'Google Cloud認定資格','Cần học gì':'学ぶ内容','Lab trong trang này':'本ページのラボ','Project mẫu phải làm được':'到達目標プロジェクト',
    /* Sơ đồ */
    'Sơ đồ 1 — Web 3-tier Highly Available trong VPC':'図1 — VPC内の高可用性 3層Webアーキテクチャ',
    'Sơ đồ 2 — Data pipeline lớn kiểu AWS công bố (luyện đọc sơ đồ thật)':'図2 — AWS公開型の大規模データパイプライン（実図を読む練習）',
    'Replication Multi-AZ (đồng bộ)':'Multi-AZ レプリケーション（同期）'
    });

    Object.assign(JAD, {
    /* Mô tả service AWS — các service chính */
    'Máy chủ ảo toàn quyền OS — nền tảng compute gốc, dùng cho mọi workload truyền thống.':'OSを完全に制御できる仮想サーバー。コンピュートの基盤で、あらゆる従来型ワークロードに使います。',
    'Chạy code theo sự kiện, không server, tối đa 15 phút/lần chạy.':'イベント駆動でコードを実行するサーバーレス基盤。1回の実行は最大15分。',
    'PaaS triển khai web app (Java, .NET, PHP, Node…) — AWS lo hạ tầng, bạn chỉ đẩy code.':'WebアプリのPaaS（Java、.NET、PHP、Node等）。基盤はAWSが管理し、コードをデプロイするだけです。',
    'VPS đơn giản giá cố định theo tháng — cho blog, web nhỏ, môi trường học tập.':'月額固定のシンプルなVPS。ブログ、小規模サイト、学習環境向け。',
    'Chạy job batch quy mô lớn trên EC2/Fargate, tự xếp hàng & scale theo nhu cầu.':'EC2/Fargate上で大規模バッチジョブを実行。キューと自動スケーリング付き。',
    'Mang hạ tầng AWS vào data center của bạn — cho workload độ trễ thấp/gắn địa điểm.':'AWSの基盤を自社データセンターに設置。低レイテンシや設置場所の制約がある場合に。',
    'Orchestrator container của AWS, tích hợp sâu IAM/VPC/ALB — đơn giản hơn Kubernetes.':'AWSのコンテナオーケストレーター。IAM/VPC/ALBと深く統合され、Kubernetesよりシンプルです。',
    'Compute serverless cho container (dùng với ECS/EKS) — không quản lý node/EC2.':'コンテナ向けサーバーレスコンピュート（ECS/EKSで使用）。ノードやEC2の管理は不要です。',
    'Kubernetes managed của AWS, control plane do AWS vận hành.':'AWSのマネージドKubernetes。コントロールプレーンはAWSが運用します。',
    'Registry lưu container image riêng, quét lỗ hổng, replicate đa region.':'コンテナイメージのプライベートレジストリ。脆弱性スキャンとマルチリージョンレプリケーション対応。',
    'Object storage chuẩn của ngành, độ bền 11 số 9 — data lake, backup, static web.':'業界標準のオブジェクトストレージ。耐久性はイレブンナイン。データレイク、バックアップ、静的サイトに。',
    'Archive lạnh giá rẻ (Instant/Flexible/Deep Archive) cho dữ liệu lưu trữ dài hạn ít truy cập.':'低コストのコールドアーカイブ。長期保存でアクセスの少ないデータ向け。',
    'Lưu bảng Apache Iceberg dạng managed trên S3 — tối ưu cho analytics quy mô lớn.':'S3上のマネージドApache Icebergテーブル。大規模分析に最適化されています。',
    'Lưu & truy vấn vector embedding ngay trong S3 — nền cho RAG/AI với chi phí thấp.':'ベクトル埋め込みをS3に直接保存・検索。低コストなRAG/AIの基盤になります。',
    'Metadata truy vấn được (qua bảng Iceberg) cho mọi object S3 — tìm & quản trị data lake nhanh.':'S3オブジェクトのメタデータをIcebergテーブルで検索可能に。データレイクの検索と管理が高速化します。',
    'Ổ đĩa block gắn vào EC2 (gp3/io2) — như SSD/HDD của máy ảo, snapshot sao lưu dễ dàng.':'EC2に接続するブロックストレージ（gp3/io2）。スナップショットで簡単にバックアップできます。',
    'Filesystem NFS chia sẻ cho nhiều EC2/container cùng lúc, tự mở rộng theo dung lượng.':'複数のEC2/コンテナで共有できるNFSファイルシステム。容量に応じて自動拡張します。',
    'DB quan hệ managed: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server.':'マネージドRDB：MySQL、PostgreSQL、MariaDB、Oracle、SQL Server。',
    'DB quan hệ cloud-native tương thích MySQL/PostgreSQL, tách compute–storage, scale mạnh.':'MySQL/PostgreSQL互換のクラウドネイティブRDB。コンピュートとストレージを分離し、大きくスケールします。',
    'NoSQL key-value serverless, latency ms ở mọi quy mô.':'サーバーレスなキーバリューNoSQL。あらゆる規模でミリ秒のレイテンシを実現します。',
    'Cache Redis/Memcached managed — tăng tốc ứng dụng, giảm tải DB.':'マネージドRedis/Memcachedキャッシュ。アプリ高速化とDB負荷軽減に。',
    'Rehost (lift & shift) hàng loạt server bằng replicate mức block, cutover trong vài phút.':'ブロックレベルのレプリケーションでサーバーを一括リホスト。数分で切り替えできます。',
    'Chuyển database full load + CDC, downtime gần 0, hỗ trợ cả chuyển đổi khác engine (cùng SCT).':'フルロード + CDCでDBを移行。ダウンタイムはほぼゼロ。エンジン変換（SCT併用）にも対応。',
    'Đồng bộ dữ liệu lớn on-prem ⇄ AWS (NFS/SMB/object) nhanh gấp nhiều lần copy thường, có lịch & kiểm chứng.':'オンプレミス ⇄ AWS の大規模データ同期（NFS/SMB/オブジェクト）。通常コピーより高速で、スケジュールと検証機能付き。',
    'Mạng ảo riêng regional: subnet theo AZ, route table, gateway, firewall hai lớp SG/NACL.':'リージョン単位の仮想ネットワーク。AZ別サブネット、ルートテーブル、ゲートウェイ、SG/NACLの2層ファイアウォール。',
    'DNS managed SLA 100% với routing policy phong phú (weighted, latency, failover, geo).':'SLA 100%のマネージドDNS。加重、レイテンシ、フェイルオーバー、地理的ルーティングに対応。',
    'CDN toàn cầu cache tại edge — giảm latency, giảm tải origin, tích hợp WAF.':'エッジでキャッシュするグローバルCDN。レイテンシ削減とオリジン負荷軽減、WAF統合。',
    'Cổng API managed (REST/WebSocket/HTTP API): auth, throttle, cache cho backend.':'マネージドAPIゲートウェイ（REST/WebSocket/HTTP API）。認証、スロットリング、キャッシュ機能付き。',
    'Đường truyền riêng 전용 dụng on-prem → AWS, băng thông ổn định, không qua internet.':'オンプレミス → AWS の専用線接続。帯域が安定し、インターネットを経由しません。',
    'Hub kết nối hàng nghìn VPC + on-prem (hub-and-spoke) thay mê cung peering.':'数千のVPCとオンプレミスを結ぶハブ（ハブ＆スポーク）。ピアリングの複雑さを解消します。',
    'User, role, policy — hệ phân quyền gốc của mọi tài nguyên AWS.':'ユーザー、ロール、ポリシー — 全AWSリソースの権限管理の基盤です。',
    'Chạy code theo sự kiện, không quản lý server, tự scale từ 0 đến hàng nghìn request đồng thời.':'イベント駆動でコードを実行。サーバー管理不要で、0から数千リクエストまで自動スケールします。',
    'Hàng đợi message — đệm & tách rời các thành phần hệ thống.':'メッセージキュー。システムコンポーネントを分離し、負荷のピークを吸収します。',
    'Pub/sub push: fan-out thông báo tới SQS, Lambda, email, mobile push…':'プッシュ型Pub/Sub。SQS、Lambda、メール、モバイルプッシュへ通知を配信します。',
    'Event bus serverless + scheduler — xương sống của kiến trúc event-driven.':'サーバーレスなイベントバスとスケジューラー。イベント駆動アーキテクチャの中核です。',
    'Điều phối workflow bằng state machine trực quan: Lambda, ECS, API… có retry/nhánh rẽ.':'ステートマシンでワークフローを視覚的に調整。リトライや分岐を標準装備します。',
    'Metrics, logs, alarms, dashboard — trung tâm giám sát của AWS.':'メトリクス、ログ、アラーム、ダッシュボード — AWSの監視の中核です。',
    'Ghi lại mọi lời gọi API trong tài khoản — nền tảng của audit & điều tra sự cố.':'アカウント内の全APIコールを記録。監査と障害調査の基盤です。',
    'IaC khai báo hạ tầng bằng YAML/JSON, triển khai dạng stack có rollback.':'YAML/JSONで基盤を宣言するIaC。ロールバック可能なスタックとしてデプロイします。',
    'SQL trực tiếp trên dữ liệu S3, serverless — phân tích log & data lake không cần cluster.':'S3上のデータに直接SQLを実行。サーバーレスで、ログ分析やデータレイク照会にクラスター不要です。',
    'ETL serverless + Data Catalog trung tâm cho data lake; có Glue Studio & DataBrew.':'サーバーレスETLとデータレイク向け中央カタログ。Glue StudioやDataBrewも含みます。',
    'Data warehouse theo cột, scale petabyte — cho BI & phân tích ổn định quy mô lớn.':'列指向データウェアハウス。ペタバイト級にスケールし、大規模BI・分析向けです。',
    'Streaming dữ liệu realtime theo shard — thu thập click/log/IoT để xử lý tức thì.':'シャード単位のリアルタイムストリーミング。クリック、ログ、IoTデータを即時処理します。',
    'Nền tảng ML toàn trình: build, train, deploy model ở mọi quy mô.':'MLの全工程プラットフォーム：モデルの構築、学習、デプロイをあらゆる規模で。',
    'API dùng foundation model của nhiều hãng (Nova, Claude, Llama…) + RAG, Agents, Guardrails.':'複数社の基盤モデル（Nova、Claude、Llama等）を1つのAPIで利用。RAG、エージェント、ガードレール付き。',
    'Hạ tầng chạy AI agent vào production (runtime, memory, gateway, identity) — GA 10/2025.':'AIエージェントを本番運用するための基盤（ランタイム、メモリ、ゲートウェイ、ID管理）。2025年10月GA。',
    'Họ mô hình nền của Amazon: Nova Micro/Lite/Pro/Premier (văn bản/hình), Sonic (giọng nói realtime), Act (tác vụ UI), Canvas/Reel (ảnh/video).':'Amazonの基盤モデル群：Nova Micro/Lite/Pro/Premier（テキスト/画像）、Sonic（リアルタイム音声）、Act（UI操作）、Canvas/Reel（画像/動画）。',
    'Nền tảng GenAI managed: truy cập nhiều họ foundation model (Amazon Nova, Claude, Llama, Mistral…) qua một API, kèm Knowledge Bases (RAG), Agents và Guardrails.':'マネージド生成AI基盤。複数社の基盤モデルを1つのAPIで利用でき、Knowledge Bases（RAG）、Agents、Guardrailsを備えます。',
    /* Mô tả service GCP — các service chính */
    'Máy ảo IaaS của Google: nhiều dòng máy, custom cấu hình, MIG tự scale đa zone.':'GoogleのIaaS仮想マシン。多数のマシンタイプ、カスタム構成、マルチゾーンのMIG自動スケーリング。',
    'PaaS chạy web app (standard/flexible) — đẩy code, Google lo hạ tầng.':'WebアプリのPaaS（スタンダード/フレキシブル）。コードをデプロイすれば基盤はGoogleが管理します。',
    'Container serverless scale về 0 — xem chi tiết sâu ở thẻ riêng.':'ゼロまでスケールするサーバーレスコンテナ実行基盤。詳細は専用カードを参照。',
    'Function serverless theo sự kiện (tên cũ: Cloud Functions) — tương đương Lambda.':'イベント駆動のサーバーレス関数（旧称 Cloud Functions）。Lambdaに相当します。',
    'Chạy cụm VMware (vSphere/NSX/HCX) nguyên bản trên GCP — đường thoát data center cho VMware.':'VMware環境（vSphere/NSX/HCX）をGCP上でそのまま実行。データセンター移行の主要ルートです。',
    'Kubernetes managed — Standard & Autopilot. Xem chi tiết sâu ở thẻ riêng.':'マネージドKubernetes — スタンダードとAutopilot。詳細は専用カードを参照。',
    'Kho lưu container image & gói ngôn ngữ (Maven/npm…) — kế nhiệm Container Registry.':'コンテナイメージと言語パッケージ（Maven/npm等）のリポジトリ。Container Registryの後継です。',
    'CI/CD build serverless: build image, chạy test, ký artifact — cũng là Developer Tool cốt lõi.':'サーバーレスCI/CDビルド：イメージのビルド、テスト、アーティファクト署名。中核的な開発者ツールでもあります。',
    'Object storage toàn cầu: Standard/Nearline/Coldline/Archive + lifecycle tự động.':'グローバルなオブジェクトストレージ。Standard/Nearline/Coldline/Archiveのクラスと自動ライフサイクル。',
    'Ổ block cho VM (balanced/SSD/extreme), snapshot & replicate theo zone/region.':'VM向けブロックストレージ（バランス/SSD/エクストリーム）。ゾーン/リージョン単位のスナップショットと複製。',
    'DB quan hệ managed: MySQL, PostgreSQL, SQL Server.':'マネージドRDB：MySQL、PostgreSQL、SQL Server。',
    'PostgreSQL cloud-native hiệu năng cao + HTAP. Xem chi tiết sâu.':'高性能なクラウドネイティブPostgreSQL + HTAP。詳細は専用カードを参照。',
    'DB quan hệ phân tán toàn cầu, nhất quán mạnh, scale ngang gần như không giới hạn — “NewSQL”.':'グローバル分散RDB。強い一貫性とほぼ無制限の水平スケールを持つ「NewSQL」です。',
    'NoSQL document serverless cho app/web/mobile, realtime sync (gốc Firebase).':'アプリ/Web/モバイル向けサーバーレスドキュメントDB。リアルタイム同期対応（Firebase由来）。',
    'Data warehouse serverless — lá bài mạnh nhất của GCP. Xem chi tiết sâu.':'サーバーレスデータウェアハウス — GCP最強の分析基盤。詳細は専用カードを参照。',
    'Messaging toàn cầu — xương sống ingestion. Xem chi tiết sâu ở thẻ riêng.':'グローバルメッセージング — データ取り込みの中核。詳細は専用カードを参照。',
    'Xử lý stream/batch hợp nhất bằng Apache Beam — serverless, tự scale.':'Apache Beamによるストリーム/バッチ統合処理。サーバーレスで自動スケールします。',
    'Nền tảng AI hợp nhất — xem chi tiết sâu (đang mở rộng thành Gemini Enterprise Agent Platform).':'統合AIプラットフォーム。詳細は専用カードを参照（Gemini Enterprise Agent Platformへ拡張中）。',
    'Mạng TOÀN CẦU: subnet theo region, firewall theo tag/service account. Xem chi tiết sâu.':'グローバルネットワーク：サブネットはリージョン単位、ファイアウォールはタグ/サービスアカウント単位。詳細は専用カードを参照。',
    'Một VPC của host project được chia cho nhiều service project — mô hình mạng doanh nghiệp chuẩn.':'ホストプロジェクトのVPCを複数サービスプロジェクトで共有。企業ネットワークの標準モデルです。',
    'LB phần mềm: Global External ALB với 1 IP anycast toàn cầu, NLB, Internal LB. Xem chi tiết sâu.':'ソフトウェアLB：単一エニーキャストIPのグローバル外部ALB、NLB、内部LB。詳細は専用カードを参照。',
    'DNS managed độ trễ thấp trên mạng anycast của Google: public & private zone.':'Googleのエニーキャスト網を使った低レイテンシのマネージドDNS。パブリック/プライベートゾーン対応。',
    'Kết nối riêng on-prem → GCP: Dedicated (10–200Gbps) hoặc Partner qua đối tác.':'オンプレミス → GCP の専用線接続：Dedicated（10〜200Gbps）またはパートナー経由。',
    'WAF & chống DDoS lớp 7 gắn với Load Balancer, có Adaptive Protection bằng ML.':'ロードバランサーに付帯するL7 WAFとDDoS対策。MLによるAdaptive Protection付き。',
    'Phân quyền theo cây Organization → Folder → Project → Resource. Xem chi tiết sâu.':'Organization → Folder → Project → Resource の階層で権限を付与。詳細は専用カードを参照。',
    'Metrics, dashboard, alert & SLO cho GCP + multi-cloud (nền tảng Stackdriver cũ).':'GCPとマルチクラウド向けのメトリクス、ダッシュボード、アラート、SLO（旧Stackdriver）。',
    'Thu thập & phân tích log tập trung, xuất sang BigQuery/Pub/Sub.':'ログを集中収集・分析。BigQueryやPub/Subへのエクスポートも可能です。',
    'Chuyển VM (VMware/Hyper-V/vật lý/cloud khác) về Compute Engine bằng replicate liên tục.':'継続的レプリケーションでVM（VMware/Hyper-V/物理/他クラウド）をCompute Engineへ移行します。',
    'Chuyển dữ liệu object từ S3/Azure/on-prem về Cloud Storage theo lịch, quy mô PB.':'S3/Azure/オンプレミスからCloud Storageへ、PB規模のオブジェクトデータを定期転送します。',
    'Điều phối quy trình bằng YAML nối các API/service (tương đương Step Functions).':'YAMLでAPIやサービスを連携させるワークフロー調整。Step Functionsに相当します。',
    'Định tuyến sự kiện (CloudEvents) từ Google Cloud & bên thứ ba tới Cloud Run/functions/Workflows.':'CloudEvents形式のイベントをGoogle Cloudや外部からCloud Run、functions、Workflowsへルーティングします。',
    'Nền tảng quản lý API doanh nghiệp (API gateway, portal, monetization) — mạnh hơn API Gateway cơ bản.':'エンタープライズAPI管理基盤（ゲートウェイ、ポータル、収益化）。基本的なAPI Gatewayより高機能です。'
    });

/* ================= DỮ LIỆU LUYỆN COMMAND (logic ở app.js) ================= */
    /* ================= LUYỆN COMMAND ================= */
    Object.assign(JAD, {
      'Phần 8 · Phòng thực hành dòng lệnh':'第8部 · コマンド演習ルーム',
      'Luyện Command — Linux · AWS CLI · gcloud':'コマンド演習 — Linux · AWS CLI · gcloud',
      'Cheat sheet tra cứu nhanh — cùng tác vụ, ba hệ lệnh':'クイックリファレンス — 同じ操作を3系統のコマンドで',
      'Kiểm tra':'チェック','Gợi ý':'ヒント','Xem đáp án':'答えを見る','Bài tiếp theo →':'次の問題 →','Lộ trình:':'コース：','Cấp độ:':'レベル：','Tất cả':'すべて'
    });
    var EX = [
    /* ---- LINUX ---- */
    {tr:'linux',lv:0,ps:'user@linux:~$',q:'Liệt kê tất cả file trong thư mục hiện tại, kể cả file ẩn, dạng danh sách chi tiết.',ja:'隠しファイルを含む、カレントディレクトリ内の全ファイルを詳細表示してください。',acc:['ls -la','ls -al','ls -a -l','ls -l -a'],hint:'Lệnh ls + hai cờ: a (all — cả file ẩn) và l (long — dạng chi tiết).',exp:'<code>ls</code> liệt kê file; <code>-a</code> hiện cả file ẩn (bắt đầu bằng dấu .); <code>-l</code> hiện chi tiết quyền, chủ sở hữu, dung lượng, ngày sửa.',lab:'Lab 2 · Web server đầu tiên'},
    {tr:'linux',lv:0,ps:'user@linux:~$',q:'Kiểm tra dung lượng các phân vùng ổ đĩa dưới dạng dễ đọc (GB/MB).',ja:'ディスクパーティションの使用量を読みやすい単位（GB/MB）で確認してください。',acc:['df -h','df -kh','df -hT'],hint:'Lệnh df (disk free) + cờ human-readable.',exp:'<code>df</code> báo cáo dung lượng filesystem; <code>-h</code> chuyển sang đơn vị GB/MB dễ đọc. Đây là lệnh đầu tiên khi nghi ngờ đĩa đầy.',lab:'Tình huống: đĩa đầy 100%'},
    {tr:'linux',lv:0,ps:'user@linux:~$',q:'Tạo cây thư mục project/src và project/docs trong một lệnh duy nhất.',ja:'project/src と project/docs のディレクトリツリーを1コマンドで作成してください。',acc:['mkdir -p project/src project/docs','mkdir -p project/{src,docs}'],hint:'mkdir với cờ -p (parents) tạo cả thư mục cha còn thiếu.',exp:'<code>mkdir -p</code>: cờ <code>-p</code> tự tạo thư mục cha và không báo lỗi nếu đã tồn tại — mẫu lệnh bắt buộc khi viết script.',lab:'Lab 7 · IaC Terraform'},
    {tr:'linux',lv:1,ps:'user@linux:~$',q:'Đặt quyền cho file deploy.sh thành: chủ sở hữu đọc-ghi-chạy, group chỉ đọc-chạy, others không có quyền (ký hiệu số).',ja:'deploy.sh の権限を、所有者は読み書き実行、グループは読み取りと実行、その他は権限なしに設定してください（数値表記）。',acc:['chmod 750 deploy.sh','chmod u=rwx,g=rx,o= deploy.sh'],hint:'r=4, w=2, x=1. Cộng theo từng nhóm: owner 7, group 5, other 0.',exp:'<code>chmod 750</code>: 7 = rwx (4+2+1) cho owner, 5 = r-x cho group, 0 = không quyền cho others. Đọc quyền bằng <code>ls -l</code>: kết quả hiển thị -rwxr-x---.',lab:'Lab 12 · Nền tảng bảo mật'},
    {tr:'linux',lv:1,ps:'user@linux:~$',q:'Liệt kê các cổng TCP đang lắng nghe kèm tiến trình đang chiếm cổng.',ja:'待受中のTCPポートと、それを使用しているプロセスを一覧表示してください。',acc:['ss -tlnp','ss -tulpn','ss -tln','netstat -tlnp'],hint:'Công cụ hiện đại là ss (socket statistics), thay cho netstat cũ.',exp:'<code>ss -tlnp</code>: <code>-t</code> TCP, <code>-l</code> listening, <code>-n</code> hiện số cổng thay vì tên dịch vụ, <code>-p</code> hiện tiến trình (cần sudo để thấy của mọi user).',lab:'Phần 5 · Networking'},
    {tr:'linux',lv:1,ps:'user@linux:~$',q:'Đếm số lần xuất hiện của chuỗi ERROR trong file app.log.',ja:'app.log 内に文字列 ERROR が何回出現するか数えてください。',acc:['grep -c "ERROR" app.log',"grep -c 'ERROR' app.log",'grep -c ERROR app.log'],hint:'grep với cờ đếm -c (count).',exp:'<code>grep -c</code> chỉ in ra số dòng khớp thay vì nội dung — rất hợp để báo cáo nhanh mức độ lỗi. Kết hợp <code>grep -i</code> nếu không phân biệt hoa thường.',lab:'Lab 11 · Giám sát & cảnh báo'},
    {tr:'linux',lv:2,ps:'user@linux:~$',q:'Xem 50 dòng cuối của file /var/log/nginx/error.log và tiếp tục theo dõi log mới theo thời gian thực.',ja:'/var/log/nginx/error.log の最後の50行を表示し、新しいログをリアルタイムで追い続けてください。',acc:['tail -n 50 -f /var/log/nginx/error.log','tail -f -n 50 /var/log/nginx/error.log','tail -50f /var/log/nginx/error.log','tail -n50 -f /var/log/nginx/error.log'],hint:'tail + số dòng (-n) + cờ follow (-f).',exp:'<code>tail -n 50</code> lấy 50 dòng cuối; <code>-f</code> (follow) giữ file mở và in tiếp dòng mới — cặp lệnh kinh điển khi debug service web trực tiếp.',lab:'Tình huống: web chết'},
    /* ---- AWS CLI ---- */
    {tr:'aws',lv:0,ps:'aws-cloudshell:~$',q:'Trong AWS CloudShell, kiểm tra bạn đang đăng nhập bằng danh tính (user/role) nào.',ja:'AWS CloudShell で、現在のログイン身份（ユーザー/ロール）を確認してください。',acc:['aws sts get-caller-identity'],hint:'Service STS — lệnh “tôi là ai” của AWS.',exp:'<code>aws sts get-caller-identity</code> trả về Account, Arn, UserId. Đây là lệnh kiểm tra đầu tiên khi gặp lỗi quyền: xác nhận đúng tài khoản/role trước khi debug tiếp.',lab:'Lab 12 · Nền tảng bảo mật'},
    {tr:'aws',lv:0,ps:'aws-cloudshell:~$',q:'Liệt kê tất cả bucket S3 trong tài khoản.',ja:'アカウント内の全S3バケットを一覧表示してください。',acc:['aws s3 ls','aws s3api list-buckets'],hint:'Nhóm lệnh rút gọn aws s3 có lệnh ls giống Linux.',exp:'<code>aws s3 ls</code> dùng API rút gọn (high-level) của S3; bản đầy đủ là <code>aws s3api list-buckets</code>. Cấu trúc lệnh AWS CLI: aws &lt;service&gt; &lt;operation&gt;.',lab:'Lab 3 · Web tĩnh toàn cầu'},
    {tr:'aws',lv:1,ps:'aws-cloudshell:~$',q:'Đồng bộ thư mục ./dist lên bucket S3 tên my-bucket (chỉ tải phần thay đổi).',ja:'./dist ディレクトリを my-bucket というS3バケットへ同期してください（変更分のみ）。',acc:['aws s3 sync ./dist s3://my-bucket','aws s3 sync dist s3://my-bucket','aws s3 sync ./dist/ s3://my-bucket'],hint:'Lệnh sync của aws s3 — khác cp ở chỗ nó tự so sánh và chỉ truyền phần khác biệt.',exp:'<code>aws s3 sync</code> so sánh kích thước/thời gian sửa giữa nguồn và đích, chỉ tải phần thay đổi. Thêm <code>--delete</code> nếu muốn xoá file thừa ở đích (cẩn thận!).',lab:'Lab 3 · Web tĩnh toàn cầu'},
    {tr:'aws',lv:1,ps:'aws-cloudshell:~$',q:'Liệt kê instance EC2 nhưng chỉ lấy InstanceId, xuất dạng bảng dễ đọc.',ja:'EC2インスタンスの一覧を、InstanceId のみ、読みやすい表形式で表示してください。',acc:['aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId" --output table',"aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --output table"],hint:'Dùng --query (JMESPath) để lọc trường và --output table.',exp:'<code>--query</code> dùng cú pháp JMESPath lọc JSON ngay tại CLI; <code>--output</code> chọn json/table/text. Đây là cặp flag biến AWS CLI từ “đổ dữ liệu” thành công cụ báo cáo.',lab:'Lab 2 · Web server đầu tiên'},
    {tr:'aws',lv:2,ps:'aws-cloudshell:~$',q:'Tạo URL tải tạm thời (hiệu lực 3600 giây) cho file s3://my-bucket/file.zip để gửi cho người không có tài khoản AWS.',ja:'s3://my-bucket/file.zip に対して、有効期間3600秒の一時ダウンロードURLを発行してください。',acc:['aws s3 presign s3://my-bucket/file.zip --expires-in 3600','aws s3 presign s3://my-bucket/file.zip --expires-in 3600 --region ap-northeast-1'],hint:'Lệnh presign của nhóm aws s3, tham số --expires-in tính bằng giây.',exp:'<code>aws s3 presign</code> ký sẵn một URL GET có hạn — người nhận tải được file mà không cần tài khoản AWS. Hết --expires-in giây URL tự vô hiệu.',lab:'Lab 3 · Web tĩnh toàn cầu'},
    /* ---- GCLOUD ---- */
    {tr:'gcp',lv:0,ps:'gcloud-shell:~$',q:'Trong Google Cloud Shell, xem project mặc định hiện tại của gcloud.',ja:'Google Cloud Shell で、gcloud の現在のデフォルトプロジェクトを確認してください。',acc:['gcloud config get-value project','gcloud config get project','gcloud config list project'],hint:'Nhóm lệnh gcloud config — động từ get-value.',exp:'<code>gcloud config get-value project</code> in ra project đang hiệu lực. Cấu trúc lệnh gcloud: gcloud &lt;group&gt; &lt;resource&gt; &lt;verb&gt;. Đặt lại bằng <code>gcloud config set project PROJECT_ID</code>.',lab:'Lab 1 · Dựng mạng nền'},
    {tr:'gcp',lv:0,ps:'gcloud-shell:~$',q:'Liệt kê tất cả máy ảo Compute Engine trong project.',ja:'プロジェクト内の全 Compute Engine VMを一覧表示してください。',acc:['gcloud compute instances list'],hint:'gcloud compute instances + động từ list.',exp:'<code>gcloud compute instances list</code> hiện tên VM, zone, trạng thái, IP trong/ngoài. Thêm <code>--format="table(name,zone,status)"</code> để tuỳ biến cột hiển thị.',lab:'Lab 2 · Web server đầu tiên'},
    {tr:'gcp',lv:1,ps:'gcloud-shell:~$',q:'Liệt kê các bucket Cloud Storage trong project.',ja:'プロジェクト内の Cloud Storage バケットを一覧表示してください。',acc:['gcloud storage ls','gsutil ls'],hint:'Câu lệnh mới là gcloud storage; gsutil là công cụ đời trước vẫn dùng được.',exp:'<code>gcloud storage ls</code> là lệnh hợp nhất mới thay dần <code>gsutil ls</code>. Xem nội dung bucket: <code>gcloud storage ls gs://ten-bucket</code>.',lab:'Lab 3 · Web tĩnh toàn cầu'},
    {tr:'gcp',lv:1,ps:'gcloud-shell:~$',q:'Lấy thông tin đăng nhập kubectl cho cluster GKE tên prod tại region asia-northeast1.',ja:'asia-northeast1 リージョンにある prod というGKEクラスターの kubectl 認証情報を取得してください。',acc:['gcloud container clusters get-credentials prod --region asia-northeast1','gcloud container clusters get-credentials prod --region=asia-northeast1'],hint:'gcloud container clusters get-credentials + --region.',exp:'Lệnh này ghi kubeconfig để <code>kubectl</code> nói chuyện được với cluster. Cluster theo zone thì dùng <code>--zone</code> thay <code>--region</code>. Sau đó kiểm tra bằng <code>kubectl get nodes</code>.',lab:'Lab 9 · Kubernetes EKS & GKE'},
    {tr:'gcp',lv:2,ps:'gcloud-shell:~$',q:'Tải file file.zip từ máy hiện tại lên bucket gs://my-bucket.',ja:'現在のマシンから file.zip を gs://my-bucket へアップロードしてください。',acc:['gcloud storage cp file.zip gs://my-bucket/','gcloud storage cp file.zip gs://my-bucket','gsutil cp file.zip gs://my-bucket/'],hint:'gcloud storage cp — nguồn trước, đích sau, giống cp của Linux.',exp:'<code>gcloud storage cp</code> sao chép giữa máy local và Cloud Storage (cả hai chiều). Thêm <code>-r</code> khi sao chép cả thư mục.',lab:'Lab 3 · Web tĩnh toàn cầu'},
    /* ---- SCENARIO (trắc nghiệm chuỗi xử lý) ---- */
    {tr:'scenario',lv:1,type:'mc',q:'Triệu chứng: người dùng báo web không vào được, kiểm tra thấy ổ đĩa trên server đầy 100%. Chọn chuỗi xử lý đúng trình tự và an toàn nhất.',ja:'症状：Webにアクセスできず、確認するとサーバーのディスクが100%になっています。最も安全で正しい対処の順序を選んでください。',
     options:['df -h kiểm tra phân vùng đầy → du -sh /var/* tìm thư mục lớn → xem & dọn log cũ / mở rộng đĩa → df -h xác nhận lại','Ngay lập tức reboot server để “giải phóng” ổ đĩa','Xoá toàn bộ thư mục /var/lib để trống chỗ nhanh nhất'],correct:0,
     exp:'Nguyên tắc xử lý đĩa đầy: <b>đo trước, xoá sau</b>. <code>df -h</code> xác định phân vùng; <code>du</code> tìm thủ phạm (thường là log); chỉ dọn thứ đã hiểu rõ (log cũ, file tạm) hoặc mở rộng đĩa. Reboot không giải phóng dung lượng; xoá /var/lib phá huỷ dữ liệu ứng dụng.',lab:'Phần Linux · xử lý text & ổ đĩa'},
    {tr:'scenario',lv:1,type:'mc',q:'Triệu chứng: website trả lỗi 502, tiến trình nginx trên server không còn chạy. Chọn chuỗi xử lý đúng.',ja:'症状：Webサイトが502エラーを返し、サーバー上で nginx プロセスが動いていません。正しい対処を選んでください。',
     options:['Cài lại nginx từ đầu cho sạch','systemctl status nginx xem trạng thái & lỗi gần nhất → journalctl -u nginx xem log → sửa nguyên nhân (thường là cấu hình) → systemctl restart nginx → curl kiểm tra lại','Mở hết firewall để loại trừ khả năng do mạng'],correct:1,
     exp:'Quy trình service chết: <code>systemctl status</code> cho biết service dừng vì sao ở vài dòng cuối; <code>journalctl -u &lt;service&gt;</code> là nơi xem log đầy đủ. Restart mù mà không đọc log thường chỉ làm lỗi lặp lại.',lab:'Phần Linux · service & tiến trình'},
    {tr:'scenario',lv:2,type:'mc',q:'Triệu chứng: Pod trên Kubernetes ở trạng thái CrashLoopBackOff sau khi deploy bản mới. Chọn bước điều tra đúng đầu tiên.',ja:'症状：新しいバージョンをデプロイした後、Kubernetes の Pod が CrashLoopBackOff になっています。最初の調査手順として正しいものを選んでください。',
     options:['Xoá namespace và tạo lại từ đầu','kubectl logs &lt;pod&gt; --previous xem log của container vừa crash → kubectl describe pod kiểm tra sự kiện/env/probe → đối chiếu thay đổi cấu hình ở bản deploy mới','Tăng replica lên 5 để Pod khác “gánh” thay'],correct:1,
     exp:'CrashLoop = ứng dụng tự thoát lặp lại. <code>kubectl logs --previous</code> lấy log của lần chạy vừa sập (log hiện tại có thể trống); <code>describe pod</code> cho sự kiện kéo image, probe fail, thiếu env/secret. Tăng replica chỉ nhân bản cùng một lỗi.',lab:'Lab 9 · Kubernetes EKS & GKE'},
    {tr:'scenario',lv:2,type:'mc',q:'Triệu chứng: ứng dụng trong private subnet không gọi được API bên ngoài qua HTTPS (443). Chọn thứ tự kiểm tra mạng đúng (AWS).',ja:'症状：プライベートサブネット内のアプリが外部APIへHTTPS（443）で接続できません。AWSでの正しいネットワーク確認順序を選んでください。',
     options:['Route table của subnet (có đường 0.0.0.0/0 → NAT Gateway chưa) → trạng thái NAT Gateway → Security Group outbound 443 → NACL chiều về (ephemeral port) → DNS phân giải','Đổi instance sang public subnet cho nhanh','Tắt Security Group để kiểm tra'],correct:0,
     exp:'Đi theo gói tin: <b>Route → NAT → SG → NACL → DNS</b> (đúng quy trình ở Phần 5). Private subnet ra internet bắt buộc qua NAT; NACL stateless hay quên cổng ephemeral chiều về là thủ phạm kinh điển.',lab:'Phần 5 · Networking bậc thầy'}
    ];
    var CHEAT = [
    ['Liệt kê file trong thư mục hiện tại','ls -la','ls -la (CloudShell cũng là Linux)','ls -la (Cloud Shell cũng là Linux)'],
    ['Xem thư mục hiện tại','pwd','pwd','pwd'],
    ['Liệt kê object trong bucket','— (khái niệm cloud)','aws s3 ls s3://bucket','gcloud storage ls gs://bucket'],
    ['Xem địa chỉ IP của máy','ip addr / hostname -I','curl ifconfig.me (IP public)','curl ifconfig.me (IP public)'],
    ['Liệt kê máy ảo đang chạy','— (dùng trên từng máy)','aws ec2 describe-instances','gcloud compute instances list'],
    ['Tạo nơi chứa file (bucket)','mkdir backup','aws s3 mb s3://my-bucket','gcloud storage buckets create gs://my-bucket'],
    ['Tải file lên storage','scp file.zip user@host:/data/','aws s3 cp file.zip s3://my-bucket/','gcloud storage cp file.zip gs://my-bucket/'],
    ['Đồng bộ cả thư mục','rsync -av ./dist/ host:/srv/dist/','aws s3 sync ./dist s3://my-bucket','gcloud storage rsync ./dist gs://my-bucket'],
    ['Xem log hệ thống','journalctl -u nginx -f','aws logs tail /aws/lambda/fn --follow','gcloud logging read "resource.type=gce_instance"'],
    ['Xem danh tính / project đang hiệu lực','id / whoami','aws sts get-caller-identity','gcloud config get-value project'],
    ['Đặt vùng làm việc mặc định','export VAR=… (biến môi trường)','aws configure set region ap-northeast-1','gcloud config set compute/region asia-northeast1'],
    ['Liệt kê cơ sở dữ liệu','mysql -e "SHOW DATABASES;"','aws rds describe-db-instances','gcloud sql instances list'],
    ['Kết nối vào Kubernetes','kubectl get nodes','aws eks update-kubeconfig --name prod','gcloud container clusters get-credentials prod'],
    ['Tìm nội dung trong file/log','grep -rn "ERROR" /var/log','aws logs filter-log-events …','gcloud logging read "severity>=ERROR"']
    ];
    var SHELLINTRO = [
    {n:'AWS CloudShell',icon:'Amazon EC2',body:'<ul><li>Mở từ AWS Console (biểu tượng terminal trên thanh menu) — <b>đã đăng nhập sẵn</b> bằng chính danh tính console, không cần <span class="mono">aws configure</span>.</li><li>Thư mục home có <b>1GB lưu trữ bền vững</b> theo region; cài sẵn AWS CLI, Python, Node, Terraform…</li><li>Chuyển region bằng menu trong CloudShell; file ngoài home sẽ mất khi phiên kết thúc.</li></ul>'},
    {n:'Google Cloud Shell',icon:'Cloud Shell & gcloud CLI',body:'<ul><li>Mở từ Google Cloud Console (nút “Activate Cloud Shell”) — máy ảo tạm kèm <b>home 5GB bền vững</b>, có sẵn gcloud, kubectl, Terraform, Docker.</li><li>Có <b>Cloud Shell Editor</b> (VS Code thu nhỏ), Web Preview để xem thử web app, và tmux giữ phiên khi rớt mạng.</li><li>Mỗi tuần có hạn mức giờ sử dụng miễn phí — đủ cho học tập và vận hành nhẹ.</li></ul>'},
    {n:'Đọc lỗi như chuyên gia',icon:'AWS IAM',body:'<ul><li><b>AccessDenied (AWS) / PERMISSION_DENIED (GCP)</b>: thiếu quyền — kiểm tra danh tính trước (sts get-caller-identity / gcloud auth list), rồi mới tới policy.</li><li><b>ValidationError / InvalidArgument</b>: sai tham số — đọc kỹ dòng mô tả lỗi, kiểm tra region/zone và định dạng giá trị.</li><li>Mẹo: thêm <span class="mono">--debug</span> (AWS CLI) hoặc <span class="mono">--verbosity=debug</span> (gcloud) để xem request thật khi bí.</li></ul>'}
    ];

/* ================= V3 · THƯ VIỆN SƠ ĐỒ ARCHITECT TỰ VẼ ================= */
function L(vi,ja){ return (window.LANG==='ja'&&ja)?ja:vi; }
function escS(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
/* node: [svcName|null, cloud, label, subVI, subJA, x, y, num, actorEmoji] */
function N(s,c,l,u,uj,x,y,num,actor){ return {s:s,c:c||'aws',l:l,u:u,uj:uj,x:x,y:y,num:num||0,actor:actor||''}; }
function V(nodes,edges){ return {nodes:nodes,edges:edges}; }

var DG=[
/* ---------- FEATURED: data pipeline xe tự lái vẽ lại ---------- */
{id:'pipe',feat:1,grp:'B',cloud:'aws',
 t:'Sơ đồ lớn vẽ lại — Data pipeline cho xe tự lái (10 bước, kiểu AWS công bố)',
 tj:'描き直しの大規模図 — 自動運転データパイプライン（10ステップ）',
 prob:'Bài toán thật kiểu AWS công bố cho xe tự hành: xe và cơ sở khách hàng sinh dữ liệu lái (MDF4/Rosbag) khổng lồ; cần ingest gần thời gian thực, kiểm tra chất lượng, làm giàu bằng dữ liệu thời tiết/bản đồ, gắn nhãn để huấn luyện ML, rồi phân tích và tìm kiếm tình huống (scenario).',
 probj:'自動運転向けにAWSが公開した実例型の課題です。車両と顧客施設から大量の走行データ（MDF4/Rosbag）が生まれ、準リアルタイム収集、品質チェック、気象・地図データでの拡張、ML学習用ラベリング、分析とシナリオ検索までが必要です。',
 why:'Tách pipeline thành các zone độc lập nối bằng S3 (raw → parsed → enriched → labeled): mỗi bước scale và retry riêng, S3 đóng vai “bộ nhớ chung” rẻ và bền; MWAA điều phối toàn trình, Glue Catalog + Neptune + DynamoDB + OpenSearch giữ metadata/lineage để tìm lại đúng đoạn dữ liệu cần.',
 whyj:'パイプラインをS3でつながる独立ゾーン（raw→parsed→enriched→labeled）に分けることで、各ステップが個別にスケールとリトライを行えます。MWAAが全体を統括し、Glueカタログ、Neptune、DynamoDB、OpenSearchがメタデータとリネージを保持します。',
 rem:'Đọc sơ đồ lớn luôn đi theo số thứ tự 1→10 và theo chiều dữ liệu, đừng đọc theo vị trí hình. Ghi chú trung thực: sơ đồ này được vẽ lại để học tập dựa trên kiến trúc tham chiếu công bố của AWS — không phải ảnh gốc của AWS.',
 remj:'大きな図は番号順（1→10）とデータの流れで読みます。注記：この図はAWSが公開したリファレンスアーキテクチャをもとに学習用に描き直したもので、AWSの原画ではありません。',
 lab:'Phần Labs & Phần Migration — tư duy pipeline tương tự Lab 10 (kiến trúc sự kiện) và các lab streaming data.',
 variants:{aws:V([
  N('AWS Outposts','aws','① Cơ sở khách hàng','Data logger copy station + xử lý tại chỗ (Outposts)','データロガー複写ステーション＋現地処理',95,300,1),
  N('AWS IoT Core','aws','② OTA Ingest','IoT Core + Kinesis Data Firehose nạp gần thời gian thực','IoT Core＋Firehoseで準リアルタイム収集',265,140,2),
  N('AWS Direct Connect','aws','Direct Connect','Đường riêng chuyển dữ liệu lớn từ cơ sở','施設からの大容量転送専用線',265,470,0),
  N('Amazon S3','aws','S3 Raw','Raw drive data (MDF4/Rosbag)','生の走行データ',450,300,0),
  N('Amazon EMR','aws','③ Quality Check','EMR kiểm tra chất lượng: đạt → high, kém → low quality','EMRで品質チェック',450,470,3),
  N('Amazon MWAA','aws','④ MWAA','Điều phối workflow toàn pipeline','パイプライン全体の統括',450,120,4),
  N('AWS Fargate','aws','Extract Topics','Fargate trích xuất topics từ dữ liệu','トピック抽出',620,300,0),
  N('Amazon EMR','aws','⑤ Enrichment & Sync','EMR làm giàu (thời tiết & bản đồ) + đồng bộ → S3 enriched','気象・地図で拡張しS3へ',740,300,5),
  N('Amazon EMR','aws','⑥ Scene Detection','EMR phát hiện tình huống (scenario)','シナリオ検出',880,300,6),
  N('AWS Glue','aws','⑦ Data Catalog','Glue Catalog · Neptune lineage · DynamoDB metadata · OpenSearch','カタログとメタデータ群',740,120,7),
  N('AWS Lambda','aws','⑧ Ảnh & Ẩn danh','Fargate trích ảnh → Lambda + Rekognition làm mờ mặt/biển số','画像抽出と匿名化（顔・番号ぼかし）',620,470,8),
  N('Amazon Rekognition','aws','Rekognition','Nhận diện mặt/chữ phục vụ ẩn danh','顔・文字の検出',740,470,0),
  N('Amazon SageMaker','aws','⑨ Labeling','SageMaker Ground Truth gắn nhãn & chú thích','Ground Truthでラベリング',880,470,9),
  N('Amazon QuickSight','aws','⑩ Analytics','QuickSight KPI · AppSync tìm kiếm scenario · Fargate Webviz/RViz','KPI可視化とシナリオ検索',880,120,10),
  N(null,'aws','Developers','Kỹ sư & đội gắn nhãn bên ngoài','開発者とラベリングチーム',1010,300,0,'👥')
 ],[[0,1],[0,2],[2,3],[1,3],[3,4],[3,6],[6,7],[7,8],[4,3],[5,6],[6,9],[7,9],[3,10],[10,11],[10,12],[8,12],[9,13],[14,13]])}
 },
/* ================= A · DỰ ÁN NHỎ ================= */
{id:'a1',grp:'A',cloud:'both',
 t:'Website tĩnh toàn cầu',tj:'静的ウェブサイト（グローバル配信）',
 prob:'Blog/trang giới thiệu/landing page: chỉ có HTML/CSS/JS và ảnh, cần tải nhanh toàn cầu, gần như không tốn chi phí khi ít traffic.',
 probj:'ブログやランディングページなど静的コンテンツのみのサイト。世界中で高速に、トラフィックが少ない時はほぼ無料で配信したい。',
 why:'Không có server để vá và scale: object storage làm origin, CDN cache tại edge, DNS trỏ vào CDN. Đây là kiến trúc rẻ và bền nhất cho nội dung tĩnh.',
 whyj:'サーバーを持たないため保守もスケールも不要です。オブジェクトストレージをオリジンにし、CDNがエッジでキャッシュ、DNSがCDNを指します。',
 rem:'Luôn bật HTTPS (ACM/SSL) + versioning cho bucket; không bao giờ public bucket trực tiếp khi đã có CDN — dùng OAC/origin identity để chỉ CDN đọc được.',
 remj:'HTTPSとバージョニングは必須。CDN経由にしたらバケットを直接公開せず、CDNだけが読めるよう制限します。',
 lab:'Lab 3 · Web tĩnh toàn cầu: S3 + CloudFront vs Cloud Storage + Cloud CDN.',
 variants:{
 aws:V([N(null,'aws','Người dùng','Trình duyệt web','ブラウザ',80,280,0,'👤'),
  N('Amazon Route 53','aws','Route 53','DNS của domain','ドメインのDNS',280,280,1),
  N('Amazon CloudFront','aws','CloudFront','CDN + HTTPS (ACM) + WAF','CDN＋HTTPS＋WAF',490,280,2),
  N('Amazon S3','aws','S3 Website','Bucket chứa HTML/CSS/JS/ảnh','静的ファイルのバケット',720,280,3),
  N('AWS WAF','aws','AWS WAF','Chặn bot & tấn công lớp 7','ボットとL7攻撃を遮断',490,110,0),
  N('AWS Lambda','aws','Lambda@Edge','Tuỳ chọn: xử lý tại edge','任意：エッジ処理',720,110,0)],[[0,1],[1,2],[2,3],[4,2],[2,5]]),
 gcp:V([N(null,'gcp','Người dùng','Trình duyệt web','ブラウザ',80,280,0,'👤'),
  N('Cloud DNS','gcp','Cloud DNS','DNS của domain','ドメインのDNS',280,280,1),
  N('Cloud Load Balancing','gcp','Global LB + Cloud CDN','Anycast IP toàn cầu, CDN bật ngay trên LB','グローバルLBにCDNを有効化',500,280,2),
  N('Cloud Storage','gcp','Cloud Storage','Bucket chứa file tĩnh','静的ファイルのバケット',740,280,3),
  N('Cloud Armor','gcp','Cloud Armor','Chặn bot & tấn công lớp 7','ボットとL7攻撃を遮断',500,110,0)],[[0,1],[1,2],[2,3],[3,2],[4,2]])}
},
{id:'a2',grp:'A',cloud:'both',
 t:'Web 3-tier Multi-AZ (kiến trúc nền tảng quan trọng nhất)',tj:'3層Webアーキテクチャ（Multi-AZ）',
 prob:'Ứng dụng web có đăng nhập và database (shop nhỏ, hệ thống nội bộ): cần chạy 24/7, mất 1 AZ không sập, database không lộ ra internet.',
 probj:'ログインとDBを持つWebアプリ。要件は24時間稼働、1つのAZ障害でも止まらないこと、DBをインターネットに公開しないことです。',
 why:'Chia 3 tầng theo subnet: public chỉ đặt ALB/NAT, app ở private, data ở private sâu nhất; mỗi tầng trải 2 AZ và RDS Multi-AZ để không có điểm lỗi đơn.',
 whyj:'サブネットで3層に分け、公開層にはALB/NATのみ、アプリとデータはプライベートに置きます。各層を2AZに分散し単一障害点をなくします。',
 rem:'Đây là “sơ đồ mẹ” của hầu hết dự án AWS/GCP — phỏng vấn thiết kế hệ thống gần như luôn bắt đầu từ biến thể của nó. Nhớ: NAT Gateway đặt theo từng AZ, RDS không bao giờ ở public subnet.',
 remj:'多くのプロジェクトの原型となる図です。NATはAZごとに置き、DBは決してパブリックサブネットに置きません。',
 lab:'Lab 1 (VPC hai cloud), Lab 2 (web server), Lab 4 (database managed & kết nối riêng).',
 variants:{
 aws:V([N(null,'aws','Người dùng','','',70,280,0,'👤'),
  N('Elastic Load Balancing (ALB)','aws','ALB','Public subnet · 2 AZ','パブリック層・2AZ',255,280,1),
  N('Amazon EC2','aws','EC2 Auto Scaling','Private subnet · tự scale theo tải','プライベート層・自動スケール',470,280,2),
  N('Amazon RDS','aws','RDS Multi-AZ','Private data subnet · failover tự động','データ層・自動フェイルオーバー',690,280,3),
  N('Amazon ElastiCache','aws','ElastiCache','Cache session/giỏ hàng (tuỳ chọn)','セッションキャッシュ（任意）',470,105,0),
  N('Amazon S3','aws','S3','Ảnh & file upload của user','アップロード画像・ファイル',690,105,0)],[[0,1],[1,2],[2,3],[2,4],[2,5]]),
 gcp:V([N(null,'gcp','Người dùng','','',70,280,0,'👤'),
  N('Cloud Load Balancing','gcp','Global LB','Anycast · Cloud Armor/CDN tuỳ chọn','グローバルLB',255,280,1),
  N('Cloud Run','gcp','Cloud Run','Container serverless · scale theo request','コンテナ・リクエストでスケール',470,280,2),
  N('Cloud SQL','gcp','Cloud SQL HA','Regional HA · private IP','リージョナルHA・プライベートIP',690,280,3),
  N('Cloud Storage','gcp','Cloud Storage','Ảnh & file upload của user','アップロードファイル',690,105,0)],[[0,1],[1,2],[2,3],[2,3],[2,4]])}
},
{id:'a3',grp:'A',cloud:'both',
 t:'API serverless',tj:'サーバーレスAPI',
 prob:'Backend cho app mobile/web có traffic thất thường: lúc gần 0, lúc bùng nổ. Không muốn trả tiền server khi không ai dùng.',
 probj:'モバイル/Web向けAPIで、トラフィックが読めない。使われていない時間は課金されたくない。',
 why:'API Gateway làm cửa ngõ (auth, throttle, validate), function xử lý từng request và scale về 0, NoSQL serverless gánh dữ liệu theo key — cả 3 lớp đều không quản server.',
 whyj:'APIゲートウェイが入口、関数が処理、サーバーレスNoSQLがデータを担い、3層ともサーバー管理不要です。',
 rem:'Coi chừng cold start và giới hạn concurrency; dữ liệu quan hệ phức tạp (nhiều join) thì đừng cố nhét vào NoSQL — quay lại 3-tier với RDS/Cloud SQL.',
 remj:'コールドスタートと同時実行数の上限に注意。複雑な結合が多いデータはNoSQLに無理に入れず、RDS/Cloud SQLに戻します。',
 lab:'Lab 5 · API serverless: Lambda + API Gateway vs Cloud Run functions.',
 variants:{
 aws:V([N(null,'aws','App Mobile/Web','Client gọi REST API','RESTを呼ぶクライアント',80,280,0,'📱'),
  N('Amazon Cognito','aws','Cognito','Đăng nhập & cấp JWT','ログインとJWT発行',300,110,0),
  N('Amazon API Gateway','aws','API Gateway','HTTPS endpoint · throttle · validate','入口・スロットル・検証',300,300,1),
  N('AWS Lambda','aws','Lambda','Xử lý nghiệp vụ theo request','リクエスト処理',520,300,2),
  N('Amazon DynamoDB','aws','DynamoDB','Dữ liệu theo key · scale vô hạn','キーベースのデータ',740,300,3),
  N('Amazon S3','aws','S3','Upload file qua presigned URL','署名付きURLでアップロード',740,110,0)],[[0,2],[1,2],[2,3],[3,4],[3,5]]),
 gcp:V([N(null,'gcp','App Mobile/Web','Client gọi REST API','RESTを呼ぶクライアント',80,280,0,'📱'),
  N('Identity Platform','gcp','Identity Platform','Đăng nhập & cấp JWT','ログインとJWT発行',300,110,0),
  N('API Gateway','gcp','API Gateway','HTTPS endpoint · xác thực key/JWT','入口・認証',300,300,1),
  N('Cloud Run functions','gcp','Cloud Run functions','Hàm xử lý theo request','リクエスト処理',520,300,2),
  N('Firestore','gcp','Firestore','Document DB · realtime sync','ドキュメントDB',740,300,3),
  N('Cloud Storage','gcp','Cloud Storage','Upload file qua signed URL','署名付きURLでアップロード',740,110,0)],[[0,2],[1,2],[2,3],[3,4],[3,5]])}
},
{id:'a4',grp:'A',cloud:'both',
 t:'WordPress / CMS trên cloud',tj:'WordPress／CMSのクラウド構成',
 prob:'Đưa site WordPress từ hosting/share host lên cloud: nhanh hơn, chịu được pike traffic khi có bài viral, backup an toàn.',
 probj:'WordPressを共有ホスティングからクラウドへ。高速化し、バズ時の急増にも耐え、バックアップを安全にします。',
 why:'Giữ nguyên mô hình CMS (PHP + MySQL + thư mục uploads) nhưng thay từng điểm yếu: DB → managed, uploads → filesystem chia sẻ/object storage, phía trước gắn CDN.',
 whyj:'CMSの形（PHP＋MySQL＋uploads）は保ちつつ、弱点を置き換えます。DBはマネージド、uploadsは共有ストレージ、前段にCDNです。',
 rem:'WordPress là đích ngắm số 1 của bot — WAF + cập nhật plugin + giới hạn /wp-admin theo IP là bắt buộc, quan trọng không kém hiệu năng.',
 remj:'WordPressはボットの最大の標的です。WAF、プラグイン更新、/wp-adminのIP制限は性能と同じくらい重要です。',
 lab:'Lab 2 (web server) + Lab 4 (database) — ghép lại thành kiến trúc này.',
 variants:{
 aws:V([N(null,'aws','Độc giả','','',70,280,0,'👤'),
  N('Amazon CloudFront','aws','CloudFront + WAF','Cache trang tĩnh toàn cầu','静的キャッシュ配信',260,280,1),
  N('Elastic Load Balancing (ALB)','aws','ALB','Cân bằng tải 2 AZ','2AZで負荷分散',450,280,2),
  N('Amazon EC2','aws','EC2 WordPress','PHP-FPM + WordPress','WordPress本体',620,280,3),
  N('Amazon RDS','aws','RDS MySQL','Database managed Multi-AZ','マネージドDB',830,170,4),
  N('Amazon EFS','aws','EFS','Thư mục uploads dùng chung','共有uploads',830,400,5)],[[0,1],[1,2],[2,3],[3,4],[3,5]]),
 gcp:V([N(null,'gcp','Độc giả','','',70,280,0,'👤'),
  N('Cloud Load Balancing','gcp','LB + Cloud CDN','Cache + Cloud Armor','キャッシュとArmor',260,280,1),
  N('Compute Engine','gcp','Compute Engine','VM chạy WordPress (MIG khi cần scale)','WordPressのVM',470,280,2),
  N('Cloud SQL','gcp','Cloud SQL MySQL','Database managed HA','マネージドDB',700,170,3),
  N('Filestore','gcp','Filestore','NFS cho thư mục uploads','uploads用NFS',700,400,4)],[[0,1],[1,2],[2,3],[2,4]])}
},
{id:'a5',grp:'A',cloud:'both',
 t:'Backup & Disaster Recovery cơ bản',tj:'基本のバックアップとDR',
 prob:'Hệ thống nhỏ nhưng dữ liệu không được phép mất: ransomware, xoá nhầm, cả region gặp sự cố — cần khôi phục được ở region khác.',
 probj:'小規模でもデータを失えないシステム。ランサムウェア、誤削除、リージョン障害に備え、別リージョンで復旧できるようにします。',
 why:'Nguyên tắc 3-2-1 lên cloud: snapshot/backup tự động trong region + bản sao sang region thứ hai + DNS failover để chuyển hướng khi khôi phục.',
 whyj:'3-2-1原則のクラウド版です。リージョン内の自動バックアップ、第二リージョンへの複製、復旧時のDNSフェイルオーバーを組みます。',
 rem:'Backup chưa từng test restore = chưa có backup. RTO/RPO phải viết thành con số và diễn tập khôi phục định kỳ.',
 remj:'リストア試験をしていないバックアップは、バックアップではありません。RTO/RPOを数値で決め、定期的に復旧訓練をします。',
 lab:'Lab 4 (database) và Phần 7 Architect — mục HA/DR, RTO/RPO.',
 variants:{
 aws:V([N('Amazon EC2','aws','Hệ thống chính','EC2 + RDS tại Tokyo (ap-ne-1)','東京の本番系',220,280,1),
  N('AWS Backup','aws','AWS Backup','Lịch backup tập trung, vault khoá','集中バックアップ計画',440,280,2),
  N('Amazon S3','aws','S3 Cross-Region','Bản sao backup tại Osaka (ap-ne-3)','大阪へ複製',660,170,3),
  N('Amazon RDS','aws','RDS Replica (DR)','Cross-region replica chờ failover','DR側レプリカ',660,400,3),
  N('Amazon Route 53','aws','Route 53 Failover','Health check → chuyển DNS sang DR','ヘルスチェックで切替',880,280,4)],[[0,1],[1,2],[1,3],[2,4],[3,4]]),
 gcp:V([N('Compute Engine','gcp','Hệ thống chính','GCE + Cloud SQL tại Tokyo','東京の本番系',220,280,1),
  N('Cloud Storage','gcp','Snapshot + GCS','Snapshot theo lịch + bucket dual-region','スナップショットとデュアルリージョン',450,280,2),
  N('Cloud SQL','gcp','Cloud SQL Replica','Cross-region replica tại Osaka','大阪のレプリカ',680,280,3),
  N('Cloud DNS','gcp','Cloud DNS','Routing policy chuyển hướng khi DR','DR時の切替',890,280,4)],[[0,1],[1,2],[2,3]])}
}
];

/* ---------- SHOWCASE KHUNG MÔI TRƯỜNG: Hybrid Certificate Lifecycle ----------
   Sơ đồ tự vẽ theo kiểu reference architecture: khung Corporate data center
   (on-premise) cạnh khung AWS Cloud ⊃ Region, 14 bước đánh số trên mũi tên.
   frames: bộ khung chuẩn (kind: aws/region/vpc/az/pub/priv/gcp/onprem —
   style ở .dg-frame trong main.css). steps: danh sách bước đọc riêng vì
   14 bước nghiệp vụ không ánh xạ 1-1 với node. */
DG.splice(1,0,{id:'hybrid-cert',feat:1,fbadge:1,grp:'C',cloud:'aws',
 t:'Showcase khung môi trường — Tự động kiểm tra & cấp phát chứng chỉ cho server on-premise (Hybrid Certificate Lifecycle)',
 tj:'環境フレーム付きショーケース — オンプレミスサーバー証明書の自動点検・発行（ハイブリッド証明書ライフサイクル）',
 prob:'Server đặt tại data center công ty vẫn cần chứng chỉ X.509 (cho dịch vụ nội bộ và để xác thực với AWS), nhưng việc theo dõi hết hạn, tạo CSR, xin cấp và cài chứng chỉ làm tay rất dễ quên và dễ lỗi. Kiến trúc này tự động hoá toàn bộ vòng đời chứng chỉ: phía AWS định kỳ kiểm tra hạn trong DynamoDB, cấp cert mới qua ACM Private CA, rồi dùng Systems Manager Run Command đẩy xuống server on-premise; server dùng chính chứng chỉ của mình qua IAM Roles Anywhere để đổi lấy thông tin xác thực AWS tạm thời.',
 probj:'社内データセンターのサーバーにも X.509 証明書が必要ですが（社内サービス用と AWS 認証用）、期限監視・CSR 作成・発行申請・配置を手作業で行うのは漏れやすく危険です。本構成は証明書ライフサイクル全体を自動化します。AWS 側が DynamoDB の期限を定期点検し、ACM プライベート CA で新規発行、Systems Manager Run Command でオンプレミスへ配置。サーバーは自らの証明書を IAM Roles Anywhere で一時的な AWS 認証情報に交換します。',
 why:'Tách rõ hai môi trường bằng khung lồng nhau đúng quy ước sơ đồ kiến trúc: mọi logic điều phối và “sổ theo dõi hạn” nằm trong Region phía AWS (serverless, không máy chủ để vận hành), data center chỉ giữ đúng một server đích và nhận lệnh qua Run Command. Private CA là nguồn cấp duy nhất nên mọi chứng chỉ đều truy vết được; IAM Roles Anywhere cho phép workload on-prem xác thực với AWS bằng chứng chỉ thay vì access key dài hạn.',
 whyj:'2つの環境を入れ子のフレームで明確に分けます。統括ロジックと「期限台帳」は AWS リージョン側（サーバーレス）に置き、データセンター側は対象サーバー1台と Run Command の受信だけ。発行元はプライベート CA に一本化され全証明書が追跡可能で、IAM Roles Anywhere により長期アクセスキーの代わりに証明書で AWS 認証できます。',
 rem:'Đây là kiến trúc AWS hybrid nên không có bản GCP (ghi rõ như sơ đồ Data Pipeline). Điểm cần nhớ: private key không bao giờ rời server on-prem — chỉ CSR đi lên AWS và chứng chỉ đi xuống; Run Command tới được server on-prem nhờ SSM hybrid activations / agent trên máy ngoài AWS. Bước 8 và 9 có hai huy hiệu riêng đặt lệch nhau trên cùng một mũi tên PCA → CertIssue (cấp mới và trả cert là hai mặt của cùng một lần gọi IssueCertificate).',
 remj:'AWS ハイブリッド構成のため GCP 版はありません（データパイプライン図と同様に明記）。要点：秘密鍵はオンプレミスから決して出ず、上るのは CSR、下るのは証明書のみ。Run Command は SSM ハイブリッドアクティベーション経由でオンプレミスのサーバーに届きます。ステップ8と9は同じ矢印（PCA → CertIssue）を共有します。',
 lab:'Phần 3 Migration — kiến trúc hybrid (chiến lược Retain); Phần 5 Networking — kết nối hybrid on-prem ↔ cloud.',
 variants:{aws:Object.assign(V([
  N(null,'aws','Server On-premise','Đích cuối: tạo CSR + private key tại chỗ, cài chứng chỉ mới và nạp lại dịch vụ','対象：CSRと秘密鍵を現地生成し、新証明書を配置してサービスを再読込',172,320,0,'🖥️'),
  N('Amazon EventBridge','aws','EventBridge Scheduler','Kích hoạt CertCheck theo lịch định kỳ (vd: mỗi ngày)','定期スケジュールで CertCheck を起動',472,150,0),
  N('AWS Lambda','aws','Lambda CertCheck','Quét hạn chứng chỉ, quyết định cert nào cần cấp mới/cấp bổ sung','期限を走査し、発行対象を判定',664,150,0),
  N('Amazon DynamoDB','aws','DynamoDB','Bảng theo dõi: chứng chỉ nào sắp hết hạn hoặc còn thiếu','期限間近・未発行の証明書台帳',884,150,0),
  N('AWS Lambda','aws','Lambda CertIssue','Điều phối tạo CSR, xin cấp cert tại Private CA','CSR 作成を統括し、プライベート CA へ発行申請',664,300,0),
  N('AWS Certificate Manager (ACM)','aws','ACM Private CA','CA riêng của tổ chức — gọi IssueCertificate để ký CSR','組織専用 CA — IssueCertificate で CSR に署名',884,300,0),
  N('Amazon EventBridge','aws','EventBridge','Event bus nhận sự kiện “đã cấp cert” và phát cho bên triển khai','「発行完了」イベントのバス',472,300,0),
  N('AWS Lambda','aws','Lambda CertDeploy','Nhận sự kiện cấp cert, triển khai chứng chỉ xuống server đích','発行イベントを受け、対象サーバーへ配置',472,448,0),
  N('AWS Systems Manager','aws','Systems Manager','Run Command: kênh ra lệnh xuyên biên AWS → server on-premise','Run Command：AWS からオンプレミスへ命令を届ける経路',664,448,0),
  N('AWS IAM','aws','IAM Roles Anywhere','Server dùng chứng chỉ X.509 (trust anchor = Private CA) đổi lấy thông tin xác thực AWS tạm thời','サーバーが X.509 証明書（トラストアンカー＝プライベート CA）で一時認証情報に交換',318,548,0)
 ],[[1,2,1],[2,3,2,0.38],[3,2,3,0.38],[2,4,4],[4,8,5],[8,0],[0,4,6],[4,5,7,0.38],[5,4,8,0.38],[4,6,10],[6,7,11],[7,8,12],[8,0,13,0.62],[0,9,14],[9,8],[5,4,9,0.62]]),
 {frames:[
   {kind:'onprem',x:24,y:70,w:296,h:530,icon:'🏢',t:'Corporate data center — On-premise',tj:'コーポレートデータセンター — オンプレミス'},
   {kind:'aws',x:352,y:14,w:704,h:612,icon:'☁',t:'AWS Cloud',tj:'AWS Cloud'},
   {kind:'region',x:376,y:62,w:656,h:540,icon:'🌐',t:'Region — ap-northeast-1 (Tokyo)',tj:'リージョン — ap-northeast-1（東京）'}
  ],
  steps:[
   ['EventBridge Scheduler kích hoạt Lambda CertCheck theo lịch định kỳ.','EventBridge Scheduler が定期スケジュールで Lambda CertCheck を起動する。'],
   ['CertCheck truy vấn DynamoDB tìm chứng chỉ sắp hết hạn hoặc còn thiếu.','CertCheck が DynamoDB を照会し、期限間近・未発行の証明書を探す。'],
   ['DynamoDB trả về danh sách chứng chỉ cần xử lý.','DynamoDB が処理対象の証明書リストを返す。'],
   ['CertCheck gọi Lambda CertIssue cho từng chứng chỉ cần cấp mới / cấp bổ sung.','CertCheck が対象ごとに Lambda CertIssue を呼び出す。'],
   ['CertIssue nhờ Systems Manager Run Command yêu cầu server on-premise tạo CSR + private key (mũi tên CertIssue → SSM mang số 5, lệnh được SSM chuyển tiếp xuống server).','CertIssue が Systems Manager Run Command 経由で、オンプレミスサーバーに CSR＋秘密鍵の生成を依頼する（番号5は CertIssue → SSM の矢印、命令は SSM がサーバーへ転送）。'],
   ['Server tạo CSR/khoá ngay tại chỗ và gửi CSR về CertIssue — private key không rời khỏi server.','サーバーが現地で CSR と鍵を生成し CSR を CertIssue へ返す — 秘密鍵はサーバーから出ない。'],
   ['CertIssue chuyển CSR sang ACM Private CA bằng lệnh IssueCertificate.','CertIssue が CSR を ACM プライベート CA へ渡し IssueCertificate を呼ぶ。'],
   ['ACM Private CA ký và cấp chứng chỉ mới (huy hiệu 8 và 9 đặt lệch nhau trên cùng mũi tên PCA → CertIssue).','ACM プライベート CA が新しい証明書を発行する（番号8と9は PCA → CertIssue の同じ矢印上にずらして配置）。'],
   ['Chứng chỉ mới được trả về cho CertIssue.','新しい証明書が CertIssue へ返される。'],
   ['CertIssue phát sự kiện “đã cấp cert” lên EventBridge (event bus).','CertIssue が「発行完了」イベントを EventBridge（イベントバス）へ発する。'],
   ['EventBridge kích hoạt Lambda CertDeploy theo rule khớp sự kiện.','EventBridge がルールに一致し Lambda CertDeploy を起動する。'],
   ['CertDeploy nhờ Systems Manager Run Command cài chứng chỉ mới xuống server on-premise.','CertDeploy が Systems Manager Run Command 経由で新証明書をオンプレミスへ配置する。'],
   ['SSM chuyển lệnh cài đặt xuống server; server cài chứng chỉ và nạp lại dịch vụ để dùng cert mới (số 13 nằm trên mũi tên SSM → Server).','SSM が配置命令をサーバーへ転送し、サーバーが証明書を配置してサービスを再読込する（番号13は SSM → Server の矢印上）。'],
   ['IAM Roles Anywhere: server dùng chứng chỉ của mình (trust anchor là Private CA) đổi lấy thông tin xác thực AWS tạm thời — nền xác thực cho các tương tác AWS của server mà không cần access key dài hạn.','IAM Roles Anywhere：サーバーが自らの証明書（トラストアンカーはプライベート CA）で一時的な AWS 認証情報に交換する — 長期アクセスキーなしで AWS とやり取りするための認証基盤。']
  ]})}
});

/* V3 · nhóm B, C, D */
DG.push(
{id:'b6',grp:'B',cloud:'both',
 t:'Microservices trên Kubernetes (EKS / GKE)',tj:'Kubernetes上のマイクロサービス（EKS／GKE）',
 prob:'Hệ thống lớn gồm nhiều service độc lập (user, catalog, order…), nhiều team deploy độc lập, cần scale từng phần riêng lẻ.',
 probj:'多数の独立サービスと複数チームからなる大規模システム。部分ごとにスケールとデプロイを独立させたい。',
 why:'Kubernetes chuẩn hoá cách đóng gói/vận hành mọi service; Ingress là cửa ngõ duy nhất, mỗi service có DB/cache riêng theo nguyên tắc database-per-service, queue làm đệm giữa các service.',
 whyj:'Kubernetesが全サービスの実行基盤を標準化します。入口はIngress一本、各サービスは専用DBを持ち、キューがサービス間を緩衝します。',
 rem:'Đừng chia microservices quá sớm: monolith modular tốt vẫn thắng microservices rối. Chỉ tách khi team và tải thực sự đòi hỏi — chi phí vận hành K8s là thật.',
 remj:'マイクロサービス化を急がないこと。モジュラーモノリスが勝つ場面は多いです。K8sの運用コストは現実の負担です。',
 lab:'Lab 9 · Kubernetes: EKS vs GKE Autopilot; Lab 6 · Container: ECS Fargate vs Cloud Run.',
 variants:{
 aws:V([N(null,'aws','Người dùng','','',60,280,0,'👤'),
  N('Elastic Load Balancing (ALB)','aws','ALB Ingress','AWS LB Controller → Ingress','Ingress入口',230,280,1),
  N('Amazon EKS','aws','EKS Cluster','Control plane AWS quản','マネージドな制御プレーン',420,280,2),
  N('Amazon EC2','aws','Pods: user/catalog','Node group / Fargate profile','Pod群その1',620,150,3),
  N('Amazon EC2','aws','Pods: order/payment','Scale độc lập theo HPA','Pod群その2',620,410,3),
  N('Amazon ElastiCache','aws','ElastiCache','Cache dùng chung','共有キャッシュ',830,110,0),
  N('Amazon RDS','aws','RDS / Aurora','DB riêng cho từng service','サービス専用DB',830,280,4),
  N('Amazon SQS','aws','SQS','Đệm sự kiện giữa service','サービス間の緩衝',830,450,0)],[[0,1],[1,2],[2,3],[2,4],[3,5],[3,6],[4,6],[4,7]]),
 gcp:V([N(null,'gcp','Người dùng','','',60,280,0,'👤'),
  N('Cloud Load Balancing','gcp','Global LB / Gateway','Gateway API toàn cầu','グローバル入口',230,280,1),
  N('Google Kubernetes Engine (GKE)','gcp','GKE Autopilot','Google quản cả node','ノードまでマネージド',420,280,2),
  N('Compute Engine','gcp','Pods: user/catalog','Workload trong cluster','Pod群その1',620,150,3),
  N('Compute Engine','gcp','Pods: order/payment','HPA scale độc lập','Pod群その2',620,410,3),
  N('Cloud SQL','gcp','Cloud SQL / AlloyDB','DB riêng cho từng service','サービス専用DB',830,280,4),
  N('Pub/Sub','gcp','Pub/Sub','Sự kiện giữa các service','サービス間イベント',830,450,0)],[[0,1],[1,2],[2,3],[2,4],[3,5],[4,5],[4,6]])}
},
{id:'b7',grp:'B',cloud:'both',
 t:'CI/CD pipeline hoàn chỉnh',tj:'完全なCI/CDパイプライン',
 prob:'Team cần đưa code từ GitHub lên production an toàn, lặp lại được, có kiểm thử và duyệt — không deploy tay qua SSH.',
 probj:'GitHubから本番まで、安全で再現可能、テストと承認つきで届けたい。手作業SSHデプロイは禁止です。',
 why:'Pipeline 4 chặng bất biến: build một lần → đóng gói image có version → lưu registry → deploy cùng image đó qua mọi môi trường (dev → staging → prod kèm approval).',
 whyj:'不変の4段階です。一度ビルドし、版つきイメージ化、レジストリ保存、同じイメージを各環境へ（本番は承認つき）届けます。',
 rem:'Nguyên tắc vàng: build một lần, deploy nhiều nơi — tuyệt đối không build lại ở mỗi môi trường. Secret không nằm trong code/image mà ở Secrets Manager.',
 remj:'黄金律は「一度ビルドし、複数環境へ配る」こと。秘密情報はコードやイメージに入れず、Secrets Managerに置きます。',
 lab:'Lab 8 · CI/CD hai cloud; Lab 7 · IaC bằng Terraform (pipeline cho hạ tầng).',
 variants:{
 aws:V([N(null,'aws','Developer','git push lên GitHub','GitHubへpush',70,280,0,'💻'),
  N('AWS CodePipeline','aws','CodePipeline','Điều phối toàn pipeline','全体の統括',250,280,1),
  N('AWS CodeBuild','aws','CodeBuild','Test + build Docker image','テストとビルド',430,280,2),
  N('Amazon ECR','aws','ECR','Registry lưu image có version','イメージの保管',600,280,3),
  N('AWS CodeDeploy','aws','CodeDeploy','Deploy staging → duyệt → prod','承認つきデプロイ',770,280,4),
  N('Amazon ECS','aws','ECS / EKS','Môi trường chạy production','本番実行環境',950,280,5),
  N('AWS Secrets Manager','aws','Secrets Manager','Secret cấp lúc deploy','デプロイ時に秘密を供給',600,110,0)],[[0,1],[1,2],[2,3],[3,4],[4,5],[6,4]]),
 gcp:V([N(null,'gcp','Developer','git push lên GitHub','GitHubへpush',70,280,0,'💻'),
  N('Cloud Build','gcp','Cloud Build','Trigger theo push · test + build','pushで起動しビルド',260,280,1),
  N('Artifact Registry','gcp','Artifact Registry','Registry lưu image','イメージの保管',470,280,2),
  N('Cloud Deploy','gcp','Cloud Deploy','Delivery pipeline + approval','承認つき配信',660,280,3),
  N('Cloud Run','gcp','Cloud Run / GKE','Môi trường chạy production','本番実行環境',870,280,4),
  N('Secret Manager','gcp','Secret Manager','Secret cấp lúc deploy','秘密の供給',470,110,0)],[[0,1],[1,2],[2,3],[3,4],[5,3]])}
},
{id:'b8',grp:'B',cloud:'both',
 t:'Streaming data pipeline',tj:'ストリーミングデータパイプライン',
 prob:'Dữ liệu sự kiện chảy liên tục (click, IoT, log, giao dịch): cần phân tích gần thời gian thực và lưu lại để phân tích lịch sử.',
 probj:'クリック、IoT、ログ、取引などのイベントが流れ続けます。準リアルタイム分析と履歴分析の両方が必要です。',
 why:'Tách đường nóng (stream → dashboard phút) và đường lạnh (stream → data lake → SQL phân tích): cùng một nguồn sự kiện phục vụ cả hai nhu cầu.',
 whyj:'ホットパス（ストリーム→分単位ダッシュボード）とコールドパス（ストリーム→レイク→SQL分析）に分け、同じイベント源で両方を満たします。',
 rem:'Data lake phải có catalog + phân vùng (partition theo ngày) ngay từ đầu; thiếu hai thứ này, chi phí query Athena/BigQuery sẽ bùng nổ.',
 remj:'データレイクには最初からカタログと日次パーティションが必要です。欠けるとクエリ費用が膨張します。',
 lab:'Phần Labs — tư duy tương tự Lab 10 (sự kiện) và sơ đồ pipeline xe tự lái ở đầu trang này.',
 variants:{
 aws:V([N(null,'aws','Nguồn sự kiện','App · IoT · log','アプリ・IoT・ログ',70,280,0,'📡'),
  N('Amazon Kinesis Data Streams','aws','Kinesis Streams','Thu thập stream theo shard','ストリーム収集',270,280,1),
  N('AWS Lambda','aws','Lambda / Firehose','Biến đổi nhẹ & ghi xuống lake','軽い変換と書込み',480,200,2),
  N('Amazon S3','aws','S3 Data Lake','Raw → curated, partition theo ngày','日次パーティション',690,200,3),
  N('Amazon Athena','aws','Athena','SQL trực tiếp trên lake','レイク上SQL',880,120,4),
  N('Amazon QuickSight','aws','QuickSight','Dashboard cho business','業務ダッシュボード',880,300,5),
  N('Amazon Kinesis Data Streams','aws','Kinesis Analytics','Đường nóng: cảnh báo realtime','リアルタイム警告',480,430,0)],[[0,1],[1,2],[2,3],[3,4],[4,5],[1,6]]),
 gcp:V([N(null,'gcp','Nguồn sự kiện','App · IoT · log','アプリ・IoT・ログ',70,280,0,'📡'),
  N('Pub/Sub','gcp','Pub/Sub','Thu thập sự kiện toàn cầu','イベント収集',270,280,1),
  N('Dataflow','gcp','Dataflow','Apache Beam: stream + batch hợp nhất','ストリーム処理',480,200,2),
  N('Cloud Storage','gcp','Cloud Storage Lake','Raw → curated','レイク',690,200,3),
  N('BigQuery','gcp','BigQuery','Phân tích SQL serverless','サーバーレス分析',880,120,4),
  N('Looker','gcp','Looker Studio','Dashboard cho business','ダッシュボード',880,300,5)],[[0,1],[1,2],[2,3],[3,4],[4,5]])}
},
{id:'b9',grp:'B',cloud:'both',
 t:'Hệ thống đặt hàng event-driven',tj:'イベント駆動の注文システム',
 prob:'Luồng đặt hàng nhiều bước: kiểm kho → thanh toán → đóng gói → giao hàng; mỗi bước có thể lỗi và cần retry độc lập, giờ cao điểm không được sập cả chuỗi.',
 probj:'在庫確認→決済→梱包→配送の多段フロー。各段が個別に失敗とリトライをし、ピークでも全体が落ちないことが必要です。',
 why:'Event bus phát sự kiện “OrderPlaced”, workflow (Step Functions/Workflows) điều phối các bước dạng state machine có retry/timeout rõ ràng, queue đệm cho từng bước chậm.',
 whyj:'イベントバスが注文イベントを発行し、ワークフローが状態機械として各段を統括、キューが遅い処理を緩衝します。',
 rem:'Mỗi bước phải idempotent (xử lý trùng không sao) và có DLQ; thiếu hai thứ này, retry tự động sẽ tạo đơn trùng/trừ tiền hai lần.',
 remj:'各段は冪等で、DLQが必須です。欠けると自動リトライが二重注文や二重課金を生みます。',
 lab:'Lab 10 · Kiến trúc sự kiện: SQS + EventBridge vs Pub/Sub + Eventarc.',
 variants:{
 aws:V([N('Amazon API Gateway','aws','API Gateway','Nhận lệnh đặt hàng','注文を受ける',110,280,1),
  N('AWS Lambda','aws','Lambda Order','Validate + tạo đơn','検証と注文作成',300,280,2),
  N('Amazon EventBridge','aws','EventBridge','Phát sự kiện OrderPlaced','イベント発行',490,280,3),
  N('AWS Step Functions','aws','Step Functions','Điều phối: kho → tiền → giao','状態機械で統括',680,280,4),
  N('Amazon SQS','aws','SQS + DLQ','Đệm bước giao hàng, lỗi vào DLQ','配送の緩衝とDLQ',880,170,5),
  N('Amazon SNS','aws','SNS','Báo khách: email/SMS/push','顧客への通知',880,400,0),
  N('Amazon DynamoDB','aws','DynamoDB','Trạng thái đơn hàng','注文状態',490,470,0)],[[0,1],[1,2],[2,3],[3,4],[3,5],[1,6]]),
 gcp:V([N('Cloud Run','gcp','Cloud Run API','Nhận lệnh đặt hàng','注文を受ける',110,280,1),
  N('Eventarc','gcp','Eventarc / Pub/Sub','Phát sự kiện OrderPlaced','イベント発行',330,280,2),
  N('Workflows','gcp','Workflows','Điều phối các bước bằng YAML','YAMLで統括',540,280,3),
  N('Cloud Run','gcp','Cloud Run Workers','Kho · thanh toán · giao hàng','各処理ワーカー',740,280,4),
  N('Firestore','gcp','Firestore','Trạng thái đơn hàng','注文状態',540,470,0),
  N('Pub/Sub','gcp','Pub/Sub + DLQ','Bước lỗi vào dead-letter topic','失敗はDLQへ',900,170,5)],[[0,1],[1,2],[2,3],[3,4],[2,5]])}
},
{id:'b10',grp:'B',cloud:'both',
 t:'Landing Zone đa tài khoản / đa project',tj:'マルチアカウントのランディングゾーン',
 prob:'Doanh nghiệp có nhiều team và môi trường: cần tách tài khoản prod/dev, quản trị tập trung danh tính, logging và ngân sách — tránh “một tài khoản chứa tất cả”.',
 probj:'複数チームと環境を持つ組織向け。本番と開発を分け、ID・ログ・予算を集中管理します。「全部入りアカウント」を避けます。',
 why:'Cây tổ chức là khung xương: policy áp từ trên xuống (SCP / org policy), tài khoản dùng chung cho log và security, workload tách theo môi trường — blast radius nhỏ khi có sự cố.',
 whyj:'組織ツリーが骨格です。ポリシーを上位から適用し、ログとセキュリティは共有アカウントへ、工作負荷は環境ごとに分離します。',
 rem:'Landing Zone phải dựng TRƯỚC khi migrate (giai đoạn Mobilize). Chuyển nhà xong mới chia phòng thì tốn gấp nhiều lần.',
 remj:'ランディングゾーンは移行の前に（Mobilize段階で）作ります。移行後に分け直すと何倍も高くつきます。',
 lab:'Phần 3 Migration — giai đoạn Mobilize; Phần 7 Architect — capstone.',
 variants:{
 aws:V([N('AWS Organizations','aws','Organizations','Cây OU: Root → Security / Workloads','OUツリー',300,90,1),
  N('AWS Control Tower','aws','Control Tower','Dựng landing zone + guardrail','ランディングゾーン構築',300,250,2),
  N('AWS IAM','aws','IAM Identity Center','SSO tập trung cho mọi account','集中SSO',300,420,0),
  N(null,'aws','Log Archive','CloudTrail/Config tập trung','集中監査ログ',620,130,3,'🗄️'),
  N(null,'aws','Security Tooling','GuardDuty/Security Hub','集中セキュリティ',620,300,3,'🛡️'),
  N(null,'aws','Workload OU','Prod / Dev / Sandbox tách riêng','環境別アカウント',880,220,4,'📦')],[[0,1],[1,3],[1,4],[1,5],[2,5]]),
 gcp:V([N(null,'gcp','Organization','Gốc của cây tài nguyên','リソース階層の根',300,90,1,'🏢'),
  N(null,'gcp','Folders','Shared / Prod / Dev theo folder','フォルダで分離',300,250,2,'📁'),
  N('Cloud IAM','gcp','Cloud IAM','Role thừa hưởng theo cây','階層で継承する権限',300,420,0),
  N('Cloud Logging','gcp','Log Sink tập trung','Log bucket ở folder dùng chung','集中ログシンク',620,130,3),
  N(null,'gcp','Projects','Project theo môi trường/team','環境・チーム別プロジェクト',880,220,4,'📦')],[[0,1],[1,3],[1,4],[2,4]])}
},
{id:'b11',grp:'B',cloud:'both',
 t:'Thương mại điện tử quy mô lớn',tj:'大規模ECサイト',
 prob:'Sàn TMĐT giờ sale: 50.000 user đồng thời, ảnh sản phẩm toàn quốc, tìm kiếm nhanh, không mất đơn khi một AZ sập.',
 probj:'セール時のEC。5万同時接続、全国への画像配信、高速検索、AZ障害でも注文を失わないことが要件です。',
 why:'Tách mặt tiền (CDN + WAF + tách microservice theo nghiệp vụ) khỏi mặt dữ liệu (cache gánh đọc, DB Multi-AZ, search riêng), và mọi việc chậm (email, xử lý đơn) đẩy qua queue.',
 whyj:'前面（CDN・WAF・業務別サービス）とデータ面（キャッシュ、Multi-AZ DB、専用検索）を分け、遅い処理はキューへ逃がします。',
 rem:'Đỉnh tải giết hệ thống ở tầng DB chứ không phải web: cache + read replica + queue đệm ghi là bộ ba cứu nguy trong giờ sale.',
 remj:'ピークで死ぬのはWeb層ではなくDB層です。キャッシュ、リードレプリカ、書込み緩衝キューが救います。',
 lab:'Phần 6 Thiết kế dự án — case study sàn TMĐT giờ cao điểm (đây chính là sơ đồ của case đó).',
 variants:{
 aws:V([N(null,'aws','Khách hàng','','',55,280,0,'👥'),
  N('Amazon Route 53','aws','Route 53','DNS + health check','DNS',200,280,1),
  N('Amazon CloudFront','aws','CloudFront + WAF','Ảnh sản phẩm + chặn tấn công','画像配信と防御',360,280,2),
  N('Elastic Load Balancing (ALB)','aws','ALB','Vào cụm microservice','入口',520,280,3),
  N('Amazon EKS','aws','EKS Microservices','Catalog · Cart · Order · Payment','業務別サービス',690,280,4),
  N('Amazon ElastiCache','aws','ElastiCache','Cache danh mục (gánh 80% đọc)','カタログキャッシュ',870,110,5),
  N('Amazon Aurora','aws','Aurora Multi-AZ','Đơn hàng · RPO ≤ 5 phút','注文データ',870,250,5),
  N('Amazon OpenSearch Service','aws','OpenSearch','Tìm kiếm sản phẩm','商品検索',690,470,0),
  N('Amazon SQS','aws','SQS + Lambda','Xử lý đơn/email bất đồng bộ','非同期処理',870,430,0)],[[0,1],[1,2],[2,3],[3,4],[4,5],[4,6],[4,7],[4,8]]),
 gcp:V([N(null,'gcp','Khách hàng','','',55,280,0,'👥'),
  N('Cloud DNS','gcp','Cloud DNS','DNS','DNS',200,280,1),
  N('Cloud Load Balancing','gcp','Global LB + CDN + Armor','Ảnh sản phẩm + chặn tấn công','画像配信と防御',370,280,2),
  N('Google Kubernetes Engine (GKE)','gcp','GKE Microservices','Catalog · Cart · Order · Payment','業務別サービス',580,280,3),
  N('AlloyDB for PostgreSQL','gcp','AlloyDB','Đơn hàng + phân tích HTAP','注文と分析',790,200,4),
  N('Cloud Storage','gcp','Cloud Storage','Ảnh sản phẩm gốc','元画像',790,420,0),
  N('Pub/Sub','gcp','Pub/Sub','Sự kiện đơn hàng','注文イベント',950,300,0)],[[0,1],[1,2],[2,3],[3,4],[3,5],[3,6]])}
},
{id:'b12',grp:'B',cloud:'both',
 t:'Nền tảng AI / RAG cho doanh nghiệp',tj:'企業向けAI／RAG基盤',
 prob:'Cho nhân viên hỏi đáp trên tài liệu nội bộ bằng AI: phải trích dẫn đúng tài liệu, không lộ dữ liệu giữa các phòng ban, kiểm soát nội dung trả lời.',
 probj:'社内文書へのAI質問応答。正しい文書を引用し、部門間の情報漏れを防ぎ、回答内容を管理できることが必要です。',
 why:'RAG 3 chặng: ingestion (tài liệu → chunk → embedding → vector store), retrieval (câu hỏi → tìm chunk liên quan), generation (LLM trả lời kèm trích dẫn) — bọc ngoài là guardrails và phân quyền theo tài liệu.',
 whyj:'RAGは3段です。取り込み（分割→埋め込み→ベクトル保存）、検索（関連部分の取得）、生成（引用つき回答）。外側にガードレールと文書権限を置きます。',
 rem:'Chất lượng RAG quyết định ở khâu chunking + metadata phân quyền, không phải ở model to hơn. Model mạnh mà检索 sai tài liệu vẫn trả lời sai.',
 remj:'RAGの品質はモデルの大きさではなく、分割方法と権限メタデータで決まります。',
 lab:'Phần 1 Services — nhóm Machine Learning / AI & Machine Learning (Bedrock, Vertex AI, OpenSearch).',
 variants:{
 aws:V([N(null,'aws','Tài liệu nội bộ','PDF · Word · wiki','PDF・Word・wiki',90,140,0,'📄'),
  N('Amazon S3','aws','S3 Documents','Kho tài liệu gốc','原文書の保管',280,140,1),
  N('AWS Lambda','aws','Lambda Ingestion','Chunk + gọi embedding','分割と埋め込み生成',470,140,2),
  N('Amazon OpenSearch Service','aws','OpenSearch Vector','Vector store + hybrid search','ベクトル検索',660,140,3),
  N('Amazon Bedrock','aws','Bedrock','LLM + Knowledge Bases + Guardrails','LLMとガードレール',660,400,4),
  N('Amazon API Gateway','aws','API Gateway','Điểm vào có xác thực','認証つき入口',470,400,0),
  N(null,'aws','Nhân viên','Hỏi đáp kèm trích dẫn','引用つき回答',280,400,0,'👤')],[[0,1],[1,2],[2,3],[6,5],[5,4],[4,3]]),
 gcp:V([N(null,'gcp','Tài liệu nội bộ','PDF · Word · wiki','PDF・Word・wiki',90,140,0,'📄'),
  N('Cloud Storage','gcp','Cloud Storage','Kho tài liệu gốc','原文書の保管',280,140,1),
  N('Cloud Run','gcp','Cloud Run Ingestion','Chunk + gọi embedding','分割と埋め込み生成',470,140,2),
  N('AlloyDB for PostgreSQL','gcp','AlloyDB pgvector','Vector store trong PostgreSQL','ベクトル保存',660,140,3),
  N('Vertex AI','gcp','Vertex AI (Gemini)','LLM + Vertex AI Search + safety','LLMと安全性',660,400,4),
  N('API Gateway','gcp','API Gateway','Điểm vào có xác thực','認証つき入口',470,400,0),
  N(null,'gcp','Nhân viên','Hỏi đáp kèm trích dẫn','引用つき回答',280,400,0,'👤')],[[0,1],[1,2],[2,3],[6,5],[5,4],[4,3]])}
},
{id:'b13',grp:'B',cloud:'both',
 t:'Video streaming',tj:'動画ストリーミング配信',
 prob:'Nền tảng video: người dùng upload video thô, hệ thống chuyển mã nhiều độ phân giải, phân phối mượt toàn cầu và chống tải lậu cơ bản.',
 probj:'動画プラットフォーム。生動画をアップロードし、複数解像度へ変換、世界へ滑らかに配信し、基本的な不正対策も行います。',
 why:'Pipeline media chuẩn: upload → transcode (HLS/DASH nhiều bitrate) → storage → CDN ký URL; chuyển mã là việc batch nặng nên tách hẳn khỏi đường xem.',
 whyj:'標準のメディア処理です。アップロード→変換（HLS/DASH）→保存→署名URLつきCDN。重い変換は視聴経路から分離します。',
 rem:'Chi phí video nằm ở chuyển mã + băng thông ra (egress) — luôn tính hai khoản này trước, và bật adaptive bitrate để người dùng mạng yếu vẫn xem được.',
 remj:'動画の費用は変換と下り転送が中心です。この2つを先に見積り、適応ビットレートを有効にします。',
 lab:'Phần 1 Services — nhóm Media Services (AWS) / Media & Other (GCP).',
 variants:{
 aws:V([N(null,'aws','Người sáng tạo','Upload video thô','生動画をアップロード',90,280,0,'🎬'),
  N('Amazon S3','aws','S3 Input','Bucket chứa video gốc','元動画バケット',300,280,1),
  N('AWS Elemental MediaConvert','aws','MediaConvert','Chuyển mã HLS nhiều bitrate','HLSへ変換',520,280,2),
  N('Amazon S3','aws','S3 Output','File HLS/DASH đã chuyển mã','変換済みファイル',730,280,3),
  N('Amazon CloudFront','aws','CloudFront','Phân phối + signed URL','署名URLで配信',920,280,4)],[[0,1],[1,2],[2,3],[3,4]]),
 gcp:V([N(null,'gcp','Người sáng tạo','Upload video thô','生動画をアップロード',90,280,0,'🎬'),
  N('Cloud Storage','gcp','Cloud Storage In','Bucket chứa video gốc','元動画バケット',300,280,1),
  N('Transcoder API','gcp','Transcoder API','Chuyển mã HLS/DASH','HLS/DASHへ変換',520,280,2),
  N('Cloud Storage','gcp','Cloud Storage Out','File đã chuyển mã','変換済みファイル',730,280,3),
  N('Cloud CDN','gcp','Cloud CDN / Media CDN','Phân phối + signed URL','署名URLで配信',920,280,4)],[[0,1],[1,2],[2,3],[3,4]])}
},
{id:'b14',grp:'B',cloud:'both',
 t:'Multi-region active–active toàn cầu',tj:'グローバルなアクティブ・アクティブ構成',
 prob:'Ứng dụng toàn cầu: user ở đâu cũng phải nhanh, một region sập thì region còn lại gánh toàn bộ — không chấp nhận downtime chờ failover.',
 probj:'グローバルなアプリ。どこからでも速く、1リージョン障害時は残りが全てを担います。待機型フェイルオーバーは不可です。',
 why:'Cả hai region cùng phục vụ (active–active): định tuyến theo độ trễ/anycast ở cửa ngõ, dữ liệu nhân bản hai chiều ở tầng DB được thiết kế cho multi-region ngay từ đầu.',
 whyj:'両リージョンが同時に処理します。入口で遅延ベース／anycastで振り分け、DBは最初からマルチリージョン複製前提で設計します。',
 rem:'Khó nhất không phải compute mà là dữ liệu: xung đột ghi hai nơi (conflict) và tính nhất quán — chỉ workload nào thật sự cần mới trả cái giá này.',
 remj:'難しいのは計算ではなくデータです。両側書込みの競合と整合性。本当に必要な工作負荷だけがこの代償を払います。',
 lab:'Phần 7 Architect — HA/DR nâng cao; Phần 5 Networking — định tuyến toàn cầu.',
 variants:{
 aws:V([N(null,'aws','User toàn cầu','','',60,280,0,'🌍'),
  N('Amazon Route 53','aws','Route 53 Latency','Định tuyến về region gần nhất','最寄りへ振り分け',240,280,1),
  N('Elastic Load Balancing (ALB)','aws','Stack Tokyo','ALB + EC2 ASG (active)','東京スタック',480,140,2),
  N('Elastic Load Balancing (ALB)','aws','Stack Singapore','ALB + EC2 ASG (active)','シンガポールスタック',480,420,2),
  N('Amazon DynamoDB','aws','DynamoDB Global Tables','Nhân bản hai chiều hai region','双方向複製',760,280,3),
  N('Amazon S3','aws','S3 CRR','File nhân bản hai region','ファイル複製',950,280,0)],[[0,1],[1,2],[1,3],[2,4],[3,4],[4,5]]),
 gcp:V([N(null,'gcp','User toàn cầu','','',60,280,0,'🌍'),
  N('Cloud Load Balancing','gcp','Global LB Anycast','1 IP toàn cầu, về region gần nhất','単一グローバルIP',250,280,1),
  N('Cloud Run','gcp','Cloud Run Tokyo','Active','東京',490,140,2),
  N('Cloud Run','gcp','Cloud Run Singapore','Active','シンガポール',490,420,2),
  N('Cloud Spanner','gcp','Cloud Spanner','DB toàn cầu nhất quán mạnh','強整合グローバルDB',760,280,3)],[[0,1],[1,2],[1,3],[2,4],[3,4]])}
}
);

/* V3 · nhóm C + D */
DG.push(
{id:'c15',grp:'C',cloud:'aws',
 t:'Migration on-prem → AWS (lift & shift theo giai đoạn)',tj:'オンプレミスからAWSへの移行（段階的リフト＆シフト）',
 prob:'Chuyển cả data center lên AWS mà không dừng kinh doanh: phải biết mình có gì, chuyển theo đợt, và có đường lùi ở mỗi bước.',
 probj:'事業を止めずにデータセンター全体をAWSへ。現状把握、波状移行、各段の切り戻しが必要です。',
 why:'Đi đúng 3 giai đoạn Assess → Mobilize → Migrate: discovery tự động vẽ bản đồ phụ thuộc, landing zone dựng trước, MGN replicate liên tục nên cutover chỉ mất vài phút dừng.',
 whyj:'評価→準備→移行の3段階です。自動発見で依存関係を描き、土台を先に作り、MGNの継続複製で切替停止は数分です。',
 rem:'Sai lầm kinh điển: nhảy thẳng vào chuyển server khi chưa có landing zone và chưa biết bản đồ phụ thuộc — “chuyển xong không nói chuyện được với nhau”.',
 remj:'典型的な失敗は、土台と依存関係なしにサーバー移行へ飛ぶことです。',
 lab:'Phần 3 Migration — 7R và 9 lab migration; Lab: On-premise VMware → AWS.',
 variants:{aws:V([
  N(null,'aws','Data Center on-prem','VMware / vật lý tại công ty','社内VMware／物理',110,280,0,'🏢'),
  N('AWS Application Discovery Service','aws','① Discovery','Thu thập cấu hình + bản đồ phụ thuộc','構成と依存関係の収集',300,280,1),
  N('AWS Organizations','aws','② Landing Zone','Control Tower: account, mạng, bảo mật','土台の構築',490,120,2),
  N('AWS Application Migration Service (MGN)','aws','③ MGN Replicate','Sao chép liên tục mức block','ブロック単位の継続複製',490,300,3),
  N('AWS Direct Connect','aws','Direct Connect','Đường truyền riêng cho dữ liệu chuyển','移行用専用線',490,470,0),
  N('Amazon EC2','aws','④ EC2 đích','Test instance → kiểm thử → cutover','検証後に切替',700,300,4),
  N('Amazon Route 53','aws','⑤ Chuyển DNS','Hạ TTL trước, chuyển DNS khi cutover','TTLを下げて切替',890,300,5)],[[0,1],[1,3],[2,3],[4,3],[3,5],[5,6]])}
},
{id:'c16',grp:'C',cloud:'gcp',
 t:'Migration on-prem → Google Cloud',tj:'オンプレミスからGoogle Cloudへの移行',
 prob:'Chuyển workload on-prem lên GCP: tận dụng Migration Center để đánh giá và Migrate to Virtual Machines để replicate, giảm tối đa thời gian dừng.',
 probj:'オンプレミスをGCPへ。Migration Centerで評価し、Migrate to Virtual Machinesで複製し、停止時間を最小化します。',
 why:'Cùng khung 3 giai đoạn như AWS nhưng bằng bộ công cụ GCP: Migration Center (đánh giá + TCO) → landing zone (Organization/Folders) → replicate về Compute Engine qua Interconnect/VPN.',
 whyj:'AWSと同じ3段階をGCPの道具で進めます。評価、土台、Interconnect経由の複製です。',
 rem:'Đích đến quyết định công cụ: về GCP thì dùng công cụ của GCP (tích hợp sẵn với Compute Engine và Cloud DNS khi cutover).',
 remj:'移行先が道具を決めます。GCPへはGCPの道具が統合面で有利です。',
 lab:'Phần 3 Migration; Lab: On-premise vật lý / VMware → Google Cloud.',
 variants:{gcp:V([
  N(null,'gcp','Data Center on-prem','VMware / vật lý tại công ty','社内VMware／物理',110,280,0,'🏢'),
  N('Migration Center','gcp','① Migration Center','Đánh giá danh mục + ước tính TCO','資産評価とTCO',300,280,1),
  N(null,'gcp','② Landing Zone','Organization → Folders → Projects','組織階層の土台',490,120,2,'🏢'),
  N('Migrate to Virtual Machines','gcp','③ Migrate to VMs','Replicate liên tục về GCE','GCEへ継続複製',490,300,3),
  N('Cloud Interconnect','gcp','Cloud Interconnect','Đường riêng on-prem ↔ GCP','専用線接続',490,470,0),
  N('Compute Engine','gcp','④ Compute Engine','VM đích → kiểm thử → cutover','検証後に切替',700,300,4),
  N('Cloud DNS','gcp','⑤ Chuyển DNS','Chuyển DNS khi cutover','切替時にDNS変更',890,300,5)],[[0,1],[1,3],[2,3],[4,3],[3,5],[5,6]])}
},
{id:'c17',grp:'C',cloud:'multi',
 t:'VMware → cloud: AWS (EVS/MGN) và GCVE',tj:'VMwareからクラウドへ（AWS／GCVE）',
 prob:'Doanh nghiệp muốn thoát khỏi data center VMware (chi phí license, phần cứng hết hạn) nhưng ứng dụng chưa sẵn sàng viết lại.',
 probj:'VMwareのデータセンターから脱却したいが、アプリの書き直しはまだ無理な段階です。',
 why:'Hai triết lý: giữ nguyên VMware trên cloud (EVS / GCVE — relocate, gần như không đổi gì) hoặc rehost từng VM thành VM cloud gốc (MGN / Migrate to VMs — đổi nhiều hơn nhưng thoát hẳn VMware).',
 whyj:'2つの考え方です。クラウド上でもVMwareを保つ（EVS／GCVE）か、VMをクラウド原生へ移す（MGN等）かです。',
 rem:'Quyết định theo thời hạn: cần thoát DC trong vài tháng → GCVE/EVS; có 1–2 năm → rehost dần về VM gốc để giảm phụ thuộc VMware lâu dài.',
 remj:'期限で決めます。数ヶ月で出るならGCVE/EVS、1〜2年あるなら原生VMへ段階移行です。',
 lab:'Phần 3 Migration; Lab: VMware → GCVE và VMware → AWS bằng Transform / EVS.',
 variants:{multi:V([
  N(null,'aws','VMware on-prem','vSphere tại data center','社内vSphere',120,280,0,'🏢'),
  N('Amazon EVS','aws','Đường A · Amazon EVS','VMware nguyên bản trên AWS','AWS上でVMwareそのまま',430,140,1),
  N('AWS Application Migration Service (MGN)','aws','Đường B · MGN → EC2','Rehost thành EC2 gốc','EC2へリホスト',430,300,2),
  N('Google Cloud VMware Engine','gcp','Đường C · GCVE','VMware nguyên bản trên GCP','GCP上でVMwareそのまま',430,460,3),
  N(null,'aws','Vận hành sau chuyển','Chọn 1 đường chính, tránh chạy 2 nền lâu dài','主経路を1つに',760,300,0,'🎯')],[[0,1],[0,2],[0,3],[1,4],[2,4],[3,4]])}
},
{id:'c18',grp:'C',cloud:'both',
 t:'Migration database đa cloud (AWS ↔ GCP)',tj:'マルチクラウドのデータベース移行',
 prob:'Chuyển database đang chạy (MySQL/PostgreSQL) từ cloud này sang cloud kia với downtime gần bằng 0 — không thể dừng hệ thống cả cuối tuần để dump/restore.',
 probj:'稼働中DBを別クラウドへ、停止ほぼゼロで移します。週末停止のダンプ＆リストアは不可です。',
 why:'Mẫu CDC chuẩn: full load một lần + replicate thay đổi liên tục (binlog/WAL) → đích đuổi kịp nguồn → cutover trong vài phút; đường mạng riêng/VPN ổn định là điều kiện tiên quyết.',
 whyj:'CDCの標準形です。全量を一度移し、変更を継続複製、追いついたら数分で切替。安定した専用接続が前提です。',
 rem:'Luôn chạy thử với bản sao và đo độ trễ replicate (lag) trước ngày cutover; tương thích kiểu dữ liệu/engine version là nơi hay vỡ nhất.',
 remj:'事前に複製遅延を測り、型とエンジン版の互換性を確認すること。ここが一番壊れます。',
 lab:'Phần 3 Migration; Lab: AWS → Google Cloud và Google Cloud → AWS (cross-cloud).',
 variants:{
 aws:V([N('Amazon RDS','aws','RDS (nguồn, AWS)','MySQL/PostgreSQL đang chạy','稼働中の源DB',130,280,1),
  N('AWS Database Migration Service (DMS)','aws','AWS DMS','Full load + CDC liên tục','全量＋CDC',370,280,2),
  N('AWS Direct Connect','aws','DX / VPN','Đường mạng ổn định liên cloud','安定した接続',590,150,0),
  N('Cloud SQL','gcp','Cloud SQL (đích, GCP)','Đích đuổi kịp → cutover','追いついたら切替',820,280,3)],[[0,1],[1,3],[2,1]]),
 gcp:V([N('Cloud SQL','gcp','Cloud SQL (nguồn, GCP)','MySQL/PostgreSQL đang chạy','稼働中の源DB',130,280,1),
  N('Datastream','gcp','Datastream / DMS','CDC serverless của GCP','GCPのCDC',370,280,2),
  N('Cloud Interconnect','gcp','Interconnect / VPN','Đường mạng ổn định liên cloud','安定した接続',590,150,0),
  N('Amazon RDS','aws','RDS (đích, AWS)','Đích đuổi kịp → cutover','追いついたら切替',820,280,3)],[[0,1],[1,3],[2,1]])}
},
{id:'c19',grp:'C',cloud:'both',
 t:'Kiến trúc hybrid: on-prem + cloud',tj:'ハイブリッド構成（オンプレミス＋クラウド）',
 prob:'Một phần hệ thống phải ở lại on-prem (pháp lý, máy móc nhà máy, latency nội bộ) nhưng vẫn muốn dùng cloud cho phần còn lại — hai nơi phải nói chuyện như một hệ thống.',
 probj:'一部は法規制や工場設備のためオンプレミスに残し、残りはクラウドへ。両者が一つのシステムとして通信する必要があります。',
 why:'Đường riêng (DX/Interconnect) làm xương sống + VPN dự phòng, DNS hai chiều để phân giải tên qua lại, và danh tính liên kết (federation) để một lần đăng nhập dùng cả hai nơi.',
 whyj:'専用線を背骨にVPNを予備とし、双方向DNSとID連携で一つのシステムに見せます。',
 rem:'Hybrid là trạng thái tốn vận hành nhất — coi nó là giai đoạn chuyển tiếp có kế hoạch, không phải đích đến vĩnh viễn (trừ khi có ràng buộc thật).',
 remj:'ハイブリッドは運用が最も重い状態です。本当の制約がない限り、恒久形ではなく移行段階と考えます。',
 lab:'Phần 3 Migration (chiến lược Retain) + Phần 5 Networking (hybrid).',
 variants:{
 aws:V([N(null,'aws','On-prem DC','App & DB giữ lại tại công ty','残す社内システム',130,280,0,'🏢'),
  N('AWS Direct Connect','aws','Direct Connect','Đường riêng chính','主回線',380,170,1),
  N('AWS Site-to-Site VPN','aws','Site-to-Site VPN','Đường dự phòng qua internet','予備回線',380,400,2),
  N('AWS Transit Gateway','aws','Transit Gateway','Hub nối các VPC','VPCのハブ',620,280,3),
  N('Amazon VPC','aws','VPC Workload','Phần hệ thống trên cloud','クラウド側工作負荷',850,280,4),
  N('Amazon Route 53','aws','Route 53 Resolver','DNS hybrid hai chiều','双方向DNS',620,480,0)],[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]]),
 gcp:V([N(null,'gcp','On-prem DC','App & DB giữ lại tại công ty','残す社内システム',130,280,0,'🏢'),
  N('Cloud Interconnect','gcp','Cloud Interconnect','Đường riêng chính','主回線',380,170,1),
  N('Cloud VPN','gcp','HA VPN','Đường dự phòng qua internet','予備回線',380,400,2),
  N('Network Connectivity Center','gcp','NCC Hub','Hub nối các VPC','VPCのハブ',620,280,3),
  N('Virtual Private Cloud (VPC)','gcp','VPC Workload','Phần hệ thống trên cloud','クラウド側工作負荷',850,280,4),
  N('Cloud DNS','gcp','Cloud DNS Peering','DNS hybrid hai chiều','双方向DNS',620,480,0)],[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]])}
},
{id:'d20',grp:'D',cloud:'both',
 t:'VPC cơ bản: public / private subnet',tj:'VPCの基本（パブリック／プライベートサブネット）',
 prob:'Nền của mọi kiến trúc mạng cloud: chia mạng sao cho chỉ thành phần cần internet mới thấy internet, còn app và dữ liệu thì ẩn hoàn toàn.',
 probj:'クラウドネットワークの基礎です。インターネットが必要な部分だけを公開し、アプリとデータは完全に隠します。',
 why:'Public subnet (có route ra IGW) chỉ chứa ALB và NAT; private subnet chứa app (ra internet một chiều qua NAT để tải bản vá); data subnet không có route ra ngoài.',
 whyj:'パブリックにはALBとNATのみ、プライベートにアプリ（NAT経由で外向きのみ）、データ層には外への経路なし、が基本形です。',
 rem:'“Private” được quyết định bởi route table, không phải bởi tên gọi. Kiểm tra mạng luôn bắt đầu từ route table của từng subnet.',
 remj:'プライベートかどうかは名前ではなくルート表で決まります。確認は常にルート表からです。',
 lab:'Lab 1 · Dựng mạng nền VPC hai cloud; Phần 5 Networking chủ đề 1–3.',
 variants:{
 aws:V([N(null,'aws','Internet','','',60,280,0,'🌐'),
  N('Amazon VPC','aws','Internet Gateway','Cửa ra/vào internet của VPC','VPCの出入口',230,280,1),
  N('Elastic Load Balancing (ALB)','aws','Public Subnet','ALB + NAT Gateway','ALBとNAT',450,280,2),
  N('Amazon EC2','aws','Private Subnet — App','EC2/ECS: không IP public','アプリ層',670,200,3),
  N('Amazon RDS','aws','Private Subnet — Data','RDS: không route ra internet','データ層',880,200,4),
  N('AWS Transit Gateway','aws','NAT Gateway','App ra internet một chiều qua NAT','外向きはNAT経由',670,430,0)],[[0,1],[1,2],[2,3],[3,4],[3,5],[5,1]]),
 gcp:V([N(null,'gcp','Internet','','',60,280,0,'🌐'),
  N('Cloud Load Balancing','gcp','Cloud Load Balancing','Cửa vào toàn cầu của VPC','グローバル入口',240,280,1),
  N('Virtual Private Cloud (VPC)','gcp','VPC Global · Subnet Regional','1 VPC phủ mọi region','全リージョンを覆うVPC',470,280,2),
  N('Cloud Run','gcp','Workload Private','Cloud Run/GCE không IP public','非公開の工作負荷',690,200,3),
  N('Cloud SQL','gcp','Cloud SQL Private IP','Chỉ truy cập trong VPC','VPC内のみ',890,200,4),
  N('Cloud NAT','gcp','Cloud NAT','Ra internet một chiều theo region','外向きはNAT経由',690,430,0)],[[0,1],[1,2],[2,3],[3,4],[3,5],[5,1]])}
},
{id:'d21',grp:'D',cloud:'both',
 t:'VPC nâng cao: Multi-AZ + Endpoints + PrivateLink / PSC',tj:'VPC応用（Multi-AZ＋エンドポイント＋PrivateLink／PSC）',
 prob:'Workload private vẫn phải gọi API của cloud (S3, Secrets…) và nhận traffic riêng từ VPC khác — mà không được đi vòng ra internet công cộng.',
 probj:'プライベートな工作負荷がクラウドAPIや他VPCのサービスへ、公衆インターネットを通らずに届く必要があります。',
 why:'VPC Endpoint/PrivateLink (PSC phía GCP) đưa “cửa riêng” vào trong VPC cho từng service; NAT tách theo AZ để một AZ chết không kéo theo AZ còn lại.',
 whyj:'エンドポイント／PrivateLink（GCPはPSC）が各サービスへの私設入口をVPC内に作ります。NATはAZごとに分けます。',
 rem:'Interface endpoint tính tiền theo giờ × số AZ — chỉ tạo cho service thật sự dùng; S3/DynamoDB thì dùng Gateway endpoint miễn phí (AWS).',
 remj:'インターフェース型は時間×AZで課金されます。本当に使うサービスだけに作りましょう。',
 lab:'Lab 1 & Lab 4; Phần 5 Networking — chủ đề VPC Endpoints / Private Service Connect.',
 variants:{
 aws:V([N('Amazon EC2','aws','App Private (AZ-a)','Workload ở subnet riêng','プライベートなアプリ',170,170,1),
  N('Amazon EC2','aws','App Private (AZ-c)','Workload ở subnet riêng','プライベートなアプリ',170,400,1),
  N('AWS PrivateLink & VPC Endpoints','aws','Gateway Endpoint','Tới S3/DynamoDB — miễn phí','S3等へ無料接続',450,170,2),
  N('Amazon S3','aws','Amazon S3','Không qua internet','インターネット非経由',700,170,3),
  N('AWS PrivateLink & VPC Endpoints','aws','Interface Endpoint','PrivateLink tới service khác','他サービスへ私設接続',450,400,2),
  N('AWS Secrets Manager','aws','Secrets / API riêng','Service qua PrivateLink','PrivateLink先',700,400,3),
  N('AWS Transit Gateway','aws','NAT theo AZ','Mỗi AZ một NAT Gateway','AZごとにNAT',920,280,0)],[[0,2],[2,3],[1,4],[4,5],[0,6],[1,6]]),
 gcp:V([N('Cloud Run','gcp','Workload Private','Cloud Run/GCE trong VPC','VPC内の工作負荷',170,280,1),
  N('Private Service Connect','gcp','Private Service Connect','Endpoint riêng trong VPC','VPC内の私設入口',450,280,2),
  N('Cloud Storage','gcp','Google APIs / GCS','Truy cập riêng không ra internet','非公開アクセス',720,170,3),
  N('Secret Manager','gcp','Service đích (producer)','Service attachment phía nhà cung cấp','提供側アタッチメント',720,400,3),
  N('Cloud NAT','gcp','Cloud NAT theo Region','Ra internet một chiều','外向きNAT',930,280,0)],[[0,1],[1,2],[1,3],[0,4]])}
},
{id:'d22',grp:'D',cloud:'both',
 t:'Hub & Spoke đa VPC, đa region',tj:'ハブ＆スポーク（複数VPC・複数リージョン）',
 prob:'Doanh nghiệp có hàng chục VPC (theo team/môi trường/region): peering nối từng cặp sẽ thành mê cung không quản nổi.',
 probj:'VPCが数十ある組織では、ペアリングの全結合は管理不能な迷路になります。',
 why:'Một hub trung tâm (Transit Gateway / NCC) làm trạm trung chuyển: mọi VPC chỉ nối vào hub, route table của hub quyết định ai nói chuyện được với ai — cộng thêm VPC dùng chung cho DNS, inspection, egress.',
 whyj:'中央ハブ（TGW／NCC）に全VPCを接続し、ハブのルート表が通信可否を決めます。共有VPCにDNSや検査を集約します。',
 rem:'Peering không có tính bắc cầu (non-transitive) ở cả hai cloud — đó là lý do hub tồn tại. Thiết kế CIDR không chồng lấn là điều kiện sống còn.',
 remj:'ペアリングは推移的ではありません。それがハブの存在理由です。CIDRの非重複が絶対条件です。',
 lab:'Phần 5 Networking — Transit Gateway / Network Connectivity Center; Lab 1 nâng cao.',
 variants:{
 aws:V([N('AWS Transit Gateway','aws','Transit Gateway','Hub trung tâm (Tokyo)','中央ハブ',520,280,1),
  N('Amazon VPC','aws','VPC Prod','Spoke: production','本番スポーク',200,110,2),
  N('Amazon VPC','aws','VPC Dev','Spoke: development','開発スポーク',200,280,2),
  N('Amazon VPC','aws','VPC Shared','DNS · inspection · egress chung','共有サービス',200,450,2),
  N(null,'aws','On-prem','Qua Direct Connect Gateway','専用線経由',840,110,0,'🏢'),
  N('AWS Transit Gateway','aws','TGW Region 2','Peering liên region (Osaka)','リージョン間接続',840,400,3)],[[1,0],[2,0],[3,0],[4,0],[0,5]]),
 gcp:V([N('Network Connectivity Center','gcp','NCC Hub','Hub trung tâm toàn cầu','グローバルハブ',520,280,1),
  N('Virtual Private Cloud (VPC)','gcp','VPC Prod','Spoke: production','本番スポーク',200,110,2),
  N('Virtual Private Cloud (VPC)','gcp','VPC Dev','Spoke: development','開発スポーク',200,280,2),
  N('Virtual Private Cloud (VPC)','gcp','Shared VPC','Host project chia subnet','共有VPC',200,450,2),
  N(null,'gcp','On-prem','Qua Cloud Interconnect','専用線経由',840,110,0,'🏢'),
  N('Virtual Private Cloud (VPC)','gcp','VPC Region 2','Spoke ở region khác','別リージョン',840,400,3)],[[1,0],[2,0],[3,0],[4,0],[0,5]])}
},
{id:'d23',grp:'D',cloud:'both',
 t:'Hybrid networking: VPN + Direct Connect/Interconnect + DNS lai',tj:'ハイブリッドネットワーク（VPN＋専用線＋ハイブリッドDNS）',
 prob:'Kết nối data center với cloud sao cho ổn định như mạng nội bộ: băng thông đảm bảo, có dự phòng khi đứt đường chính, và phân giải tên được cả hai phía.',
 probj:'データセンターとクラウドを社内網のように安定接続します。帯域保証、冗長化、双方向の名前解決が必要です。',
 why:'Đường riêng làm chính (băng thông/latency ổn định, BGP), VPN IPsec làm dự phòng tự động failover, DNS forwarding hai chiều (Resolver/Cloud DNS peering) để tên nội bộ phân giải xuyên biên.',
 whyj:'専用線を主回線（BGP、安定帯域）、IPsec VPNを自動予備、双方向DNS転送で名前解決を通します。',
 rem:'Luôn test kịch bản đứt đường chính: BGP failover sang VPN phải tự động và có người được alarm — đừng đợi sự cố thật mới biết nó không hoạt động.',
 remj:'主回線断の訓練を必ず行います。BGPの切替とアラームが本当に働くか、事故前に確かめます。',
 lab:'Phần 5 Networking — hybrid; Phần 3 Migration — kiến trúc hybrid (C19).',
 variants:{
 aws:V([N(null,'aws','Router On-prem','BGP speaker tại DC','DCのルーター',120,280,0,'🏢'),
  N('AWS Direct Connect','aws','Direct Connect','Đường chính · BGP · ổn định','主回線',390,150,1),
  N('AWS Site-to-Site VPN','aws','Site-to-Site VPN','Dự phòng · IPsec qua internet','予備回線',390,410,2),
  N('AWS Transit Gateway','aws','Transit Gateway','Điểm cuối phía AWS','AWS側終端',650,280,3),
  N('Amazon Route 53','aws','Route 53 Resolver','Forwarding DNS hai chiều','双方向転送',880,150,4),
  N('Amazon VPC','aws','Các VPC','Đích đến trong cloud','クラウド側',880,400,0)],[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]]),
 gcp:V([N(null,'gcp','Router On-prem','BGP speaker tại DC','DCのルーター',120,280,0,'🏢'),
  N('Cloud Interconnect','gcp','Cloud Interconnect','Đường chính · BGP · ổn định','主回線',390,150,1),
  N('Cloud VPN','gcp','HA VPN','Dự phòng · IPsec, SLA 99.99%','予備回線',390,410,2),
  N('Cloud Router','gcp','Cloud Router','Điều khiển BGP phía GCP','BGP制御',650,280,3),
  N('Cloud DNS','gcp','Cloud DNS Peering','Forwarding DNS hai chiều','双方向転送',880,150,4),
  N('Virtual Private Cloud (VPC)','gcp','Các VPC','Đích đến trong cloud','クラウド側',880,400,0)],[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]])}
},
{id:'d24',grp:'D',cloud:'both',
 t:'Bảo mật mạng nhiều lớp (defense in depth)',tj:'多層のネットワークセキュリティ',
 prob:'Chịu tấn công từ internet là chuyện hằng ngày: DDoS, bot, exploit lớp 7 — một lớp tường lửa duy nhất là không đủ.',
 probj:'DDoS、ボット、L7攻撃は日常です。防御は一層では足りません。',
 why:'Xếp lớp theo hành trình của request: chặn DDoS ở edge → WAF lọc lớp 7 → firewall mạng kiểm tra lưu lượng vào VPC → security group/firewall rule siết đến từng workload → DB chỉ mở cho app.',
 whyj:'リクエストの旅路に沿って層を重ねます。エッジでDDoS遮断、WAFでL7検査、ネットワークFW、最後に工作負荷単位の制御です。',
 rem:'Defense in depth: giả định từng lớp sẽ có lúc thủng — lớp sau phải chặn được thứ lớp trước bỏ sót. Kèm theo là logging mọi lớp về một nơi để điều tra.',
 remj:'各層はいつか破られる前提で、後段が前段の漏れを止めます。全層のログを一箇所に集めることも必須です。',
 lab:'Lab 12 · Nền tảng bảo mật; Phần 5 Networking — SG vs NACL, WAF, firewall.',
 variants:{
 aws:V([N(null,'aws','Internet / Attacker','','',60,280,0,'🌐'),
  N('AWS Shield','aws','Shield + CloudFront','Chặn DDoS ở edge','エッジでDDoS遮断',240,280,1),
  N('AWS WAF','aws','AWS WAF','Lọc lớp 7: SQLi, XSS, bot','L7検査',420,280,2),
  N('AWS Network Firewall','aws','Network Firewall','Kiểm tra traffic vào/ra VPC','VPC出入口の検査',600,280,3),
  N('Elastic Load Balancing (ALB)','aws','ALB + Security Group','SG chỉ mở 443 từ WAF/LB','443のみ許可',780,280,4),
  N('Amazon EC2','aws','App Private','Workload sau 4 lớp lọc','4層の内側',950,170,5),
  N('Amazon RDS','aws','RDS','SG chỉ nhận từ app SG','アプリからのみ',950,400,0)],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]),
 gcp:V([N(null,'gcp','Internet / Attacker','','',60,280,0,'🌐'),
  N('Cloud Armor','gcp','Cloud Armor','Chặn DDoS + WAF ở edge','エッジ防御',250,280,1),
  N('Cloud NGFW','gcp','Cloud NGFW','Firewall thế hệ mới trong VPC','VPC内FW',450,280,2),
  N('Cloud Load Balancing','gcp','Load Balancer','Chỉ mở 443, backend private','443のみ',650,280,3),
  N('Cloud Run','gcp','App Private','Workload sau các lớp lọc','内側の工作負荷',850,170,4),
  N('Cloud SQL','gcp','Cloud SQL','Private IP, chỉ từ app','アプリからのみ',850,400,0)],[[0,1],[1,2],[2,3],[3,4],[4,5]])}
}
);

/* ================= ÁP BỘ KHUNG MÔI TRƯỜNG RA TOÀN BỘ THƯ VIỆN SƠ ĐỒ =================
   Đợt triển khai diện rộng của frame kit (ra mắt ở sơ đồ showcase
   hybrid-cert): gắn frames:[] cho MỌI biến thể của MỌI sơ đồ còn lại và
   dời một số node (chỉ toạ độ x/y — thứ tự node, cạnh, tour, giả lập sự
   cố đều tham chiếu theo chỉ số nên không đổi) để node nằm đúng khung
   theo kiến trúc thật:
   · AWS: Cloud ⊃ Region ⊃ VPC ⊃ AZ ⊃ Subnet; service toàn cục (Route 53,
     CloudFront, IAM…) nằm trong khung Cloud nhưng NGOÀI khung Region.
   · GCP: Cloud ⊃ VPC (GLOBAL — bao ngoài Region, khác thứ bậc AWS) ⊃
     Region ⊃ Zone/Subnet; Global LB nằm ở biên ngoài Region/VPC.
   · Migration/Hybrid: khung On-premise ở phía nguồn ↔ khung Cloud ở
     phía đích, công cụ migration/đường truyền nằm vắt trên biên.
   Đồng thời gán d.sz = thang mật độ node ('m' vừa · 's' đông — engine
   thu nhỏ icon + chữ + bề ngang node theo thang này, nhất quán cả hai
   biến thể; showcase hybrid-cert giữ nguyên kích cỡ gốc) và bật nhãn
   "Có khung môi trường" (fbadge) cho mọi sơ đồ đã có khung. */
function FRM(kind,x,y,w,h,lb,icon){ return {kind:kind,x:x,y:y,w:w,h:h,t:lb[0],tj:lb[1],icon:icon||''}; }
var LBL_AWSC=['AWS Cloud','AWS Cloud'], LBL_GCPC=['Google Cloud','Google Cloud'],
 LBL_ONP=['Corporate data center — On-premise','コーポレートデータセンター — オンプレミス'],
 LBL_RAT=['Region — ap-northeast-1 (Tokyo)','リージョン — ap-northeast-1（東京）'],
 LBL_RAO=['Region — ap-northeast-3 (Osaka)','リージョン — ap-northeast-3（大阪）'],
 LBL_RAS=['Region — ap-southeast-1 (Singapore)','リージョン — ap-southeast-1（シンガポール）'],
 LBL_RGT=['Region — asia-northeast1 (Tokyo)','リージョン — asia-northeast1（東京）'],
 LBL_RGO=['Region — asia-northeast2 (Osaka)','リージョン — asia-northeast2（大阪）'],
 LBL_RGS=['Region — asia-southeast1 (Singapore)','リージョン — asia-southeast1（シンガポール）'],
 LBL_VPG=['VPC — Global','VPC — グローバル'],
 LBL_PUB=['Public Subnet','パブリックサブネット'], LBL_PRIV=['Private Subnet','プライベートサブネット'];
var DGFR={
/* ----- Featured: Data Pipeline — Cloud ⊃ Region; cơ sở khách hàng trong
   khung on-premise, Direct Connect vắt trên biên hai môi trường ----- */
pipe:{aws:{f:[FRM('aws',214,12,860,616,LBL_AWSC,'☁'),FRM('region',230,50,738,562,LBL_RAT,'🌐'),FRM('onprem',4,204,200,200,LBL_ONP,'🏢')]}},
/* ----- A1 · Website tĩnh: Route 53/CloudFront/WAF/Lambda@Edge là global
   (trong Cloud, ngoài Region); S3 là regional nên nằm trong Region ----- */
a1:{aws:{f:[FRM('aws',170,24,900,512,LBL_AWSC,'☁'),FRM('region',612,196,330,230,LBL_RAT,'🌐')]},
    gcp:{f:[FRM('gcp',170,24,900,512,LBL_GCPC,'☁'),FRM('region',630,196,320,230,LBL_RGT,'🌐')]}},
/* ----- A2 · Web 3-tier: đủ VPC + 2 AZ + public/private subnet từng AZ.
   ALB/ASG/RDS là node logic trải 2 AZ nên đặt vắt trên biên hai khung AZ;
   ElastiCache nằm ở subnet app AZ-c; S3 trong Region nhưng ngoài VPC.
   Bản GCP: VPC global bao ngoài Region, subnet regional chứa 2 Zone,
   Global LB toàn cục nằm ở biên Cloud, ngoài VPC/Region ----- */
a2:{aws:{f:[FRM('aws',144,12,928,536,LBL_AWSC,'☁'),FRM('region',160,48,896,486,LBL_RAT,'🌐'),FRM('vpc',176,90,704,428,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('az',188,132,338,372,['AZ — ap-northeast-1a','AZ — ap-northeast-1a']),FRM('az',538,132,330,372,['AZ — ap-northeast-1c','AZ — ap-northeast-1c']),FRM('pub',198,168,318,106,['Public Subnet — 10.0.1.0/24','パブリックサブネット — 10.0.1.0/24']),FRM('pub',548,168,310,106,['Public Subnet — 10.0.2.0/24','パブリックサブネット — 10.0.2.0/24']),FRM('priv',198,288,318,106,['Private Subnet — App · 10.0.11.0/24','プライベートサブネット — アプリ · 10.0.11.0/24']),FRM('priv',548,288,310,106,['Private Subnet — App · 10.0.12.0/24','プライベートサブネット — アプリ · 10.0.12.0/24']),FRM('priv',198,408,318,88,['Private Subnet — Data · 10.0.21.0/24','プライベートサブネット — データ · 10.0.21.0/24']),FRM('priv',548,408,310,88,['Private Subnet — Data · 10.0.22.0/24','プライベートサブネット — データ · 10.0.22.0/24'])]},
    gcp:{f:[FRM('gcp',140,12,932,536,LBL_GCPC,'☁'),FRM('vpc',380,44,676,490,LBL_VPG),FRM('region',396,88,644,430,LBL_RGT,'🌐'),FRM('priv',408,136,620,366,['Subnet — Regional · 10.0.1.0/24','サブネット — リージョナル · 10.0.1.0/24']),FRM('zone',420,180,288,306,['Zone — asia-northeast1-a','ゾーン — asia-northeast1-a']),FRM('zone',720,180,288,306,['Zone — asia-northeast1-c','ゾーン — asia-northeast1-c'])]}},
/* ----- A3 · API serverless: mọi thành phần đều regional → Cloud ⊃ Region ----- */
a3:{aws:{f:[FRM('aws',170,20,902,520,LBL_AWSC,'☁'),FRM('region',186,58,870,466,LBL_RAT,'🌐')]},
    gcp:{f:[FRM('gcp',170,20,902,520,LBL_GCPC,'☁'),FRM('region',186,58,870,466,LBL_RGT,'🌐')]}},
/* ----- A4 · WordPress: CDN/WAF (AWS) và Global LB (GCP) là global — ngoài
   Region; tầng app/data nằm trong VPC, chia public/private subnet ----- */
a4:{aws:{f:[FRM('aws',160,16,912,528,LBL_AWSC,'☁'),FRM('region',420,54,636,474,LBL_RAT,'🌐'),FRM('vpc',436,92,604,420,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('pub',448,200,196,164,LBL_PUB),FRM('priv',652,100,380,404,LBL_PRIV)]},
    gcp:{f:[FRM('gcp',160,16,912,528,LBL_GCPC,'☁'),FRM('vpc',420,54,636,474,LBL_VPG),FRM('region',436,92,604,420,LBL_RGT,'🌐'),FRM('priv',500,196,250,170,['Private Subnet — App','プライベートサブネット — アプリ']),FRM('priv',752,100,280,404,['Private Subnet — Data','プライベートサブネット — データ'])]}},
/* ----- A5 · Backup & DR: HAI khung Region (chính + DR) trong một Cloud;
   Route 53 / Cloud DNS là global nên nằm ngoài cả hai Region ----- */
a5:{aws:{f:[FRM('aws',110,16,962,528,LBL_AWSC,'☁'),FRM('region',126,60,420,440,LBL_RAT,'🌐'),FRM('region',562,60,286,440,LBL_RAO,'🌐')]},
    gcp:{f:[FRM('gcp',110,16,962,528,LBL_GCPC,'☁'),FRM('region',126,60,440,440,LBL_RGT,'🌐'),FRM('region',582,60,210,440,LBL_RGO,'🌐')]}},
/* ----- B6 · Microservices K8s: ALB ở public subnet, EKS/pods/cache/DB ở
   private subnet (AWS). GCP: Global LB ở biên Cloud ngoài VPC; GKE +
   workload trong subnet của VPC global; Pub/Sub là global → ngoài Region ----- */
b6:{aws:{f:[FRM('aws',150,12,922,536,LBL_AWSC,'☁'),FRM('region',166,50,890,482,LBL_RAT,'🌐'),FRM('vpc',182,88,858,428,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('pub',190,190,190,180,LBL_PUB),FRM('priv',392,100,640,404,LBL_PRIV)]},
    gcp:{f:[FRM('gcp',150,12,922,536,LBL_GCPC,'☁'),FRM('vpc',330,44,726,488,LBL_VPG),FRM('region',346,88,694,428,LBL_RGT,'🌐'),FRM('priv',430,100,602,404,['Subnet — GKE & Workloads','サブネット — GKEとワークロード'])]}},
/* ----- B7 · CI/CD: toàn bộ pipeline nằm trong một Region ----- */
b7:{aws:{f:[FRM('aws',150,20,922,520,LBL_AWSC,'☁'),FRM('region',166,58,890,464,LBL_RAT,'🌐')]},
    gcp:{f:[FRM('gcp',150,20,922,520,LBL_GCPC,'☁'),FRM('region',166,58,890,464,LBL_RGT,'🌐')]}},
/* ----- B8 · Streaming: AWS mọi thành phần regional. GCP: Pub/Sub là
   global → ở biên Cloud ngoài Region; Dataflow/GCS/BigQuery trong Region ----- */
b8:{aws:{f:[FRM('aws',150,16,922,528,LBL_AWSC,'☁'),FRM('region',166,54,890,474,LBL_RAT,'🌐')]},
    gcp:{f:[FRM('gcp',150,16,922,528,LBL_GCPC,'☁'),FRM('region',360,54,696,474,LBL_RGT,'🌐')]}},
/* ----- B9 · Event-driven: AWS mọi thành phần regional. GCP: Pub/Sub là
   global → ngoài Region; phần còn lại trong Region ----- */
b9:{aws:{f:[FRM('aws',60,16,1012,528,LBL_AWSC,'☁'),FRM('region',76,54,980,474,LBL_RAT,'🌐')]},
    gcp:{f:[FRM('gcp',60,16,1012,528,LBL_GCPC,'☁'),FRM('region',76,54,790,474,LBL_RGT,'🌐')]}},
/* ----- B10 · Landing Zone: khung Cloud + khung tài khoản quản trị
   (Organizations/Control Tower/IAM) + khung các tài khoản thành viên ----- */
b10:{aws:{f:[FRM('aws',170,12,902,536,LBL_AWSC,'☁'),FRM('vpc',186,30,330,490,['Management Account — tài khoản quản trị','管理アカウント']),FRM('region',520,30,536,490,['Member Accounts — Security · Workloads · Log','メンバーアカウント — セキュリティ・ワークロード・ログ'])]},
     gcp:{f:[FRM('gcp',170,12,902,536,LBL_GCPC,'☁'),FRM('vpc',186,30,330,490,['Organization — cây tài nguyên','組織 — リソース階層']),FRM('region',520,30,536,490,['Folders & Projects thành viên','メンバーのフォルダとプロジェクト'])]}},
/* ----- B11 · E-commerce: Route 53 + CloudFront (AWS) / Cloud DNS +
   Global LB (GCP) là global — ngoài Region; mặt dữ liệu trong VPC.
   GCP: Cloud Storage và Pub/Sub là global/nằm ngoài VPC → ở biên Cloud ----- */
b11:{aws:{f:[FRM('aws',100,12,972,536,LBL_AWSC,'☁'),FRM('region',420,48,636,484,LBL_RAT,'🌐'),FRM('vpc',436,86,604,430,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('pub',452,196,190,168,LBL_PUB),FRM('priv',644,98,388,406,LBL_PRIV)]},
     gcp:{f:[FRM('gcp',130,12,942,536,LBL_GCPC,'☁'),FRM('vpc',470,44,586,488,LBL_VPG),FRM('region',486,88,554,428,LBL_RGT,'🌐'),FRM('priv',494,110,538,392,['Subnet — GKE & Data','サブネット — GKEとデータ'])]}},
/* ----- B12 · AI/RAG: tài liệu & nhân viên là tác nhân ngoài Cloud; toàn
   bộ pipeline ingestion/retrieval/generation nằm trong Region ----- */
b12:{aws:{f:[FRM('aws',250,40,822,480,LBL_AWSC,'☁'),FRM('region',266,78,790,428,LBL_RAT,'🌐')]},
     gcp:{f:[FRM('gcp',250,40,822,480,LBL_GCPC,'☁'),FRM('region',266,78,790,428,LBL_RGT,'🌐')]}},
/* ----- B13 · Video streaming: pipeline chuyển mã trong Region;
   CloudFront / Cloud CDN là edge toàn cục → ngoài Region ----- */
b13:{aws:{f:[FRM('aws',170,60,902,440,LBL_AWSC,'☁'),FRM('region',186,98,640,364,LBL_RAT,'🌐')]},
     gcp:{f:[FRM('gcp',170,60,902,440,LBL_GCPC,'☁'),FRM('region',186,98,640,364,LBL_RGT,'🌐')]}},
/* ----- B14 · Multi-region active–active: HAI khung Region trong một
   Cloud; Route 53 / Global LB / DynamoDB Global Tables / Spanner là
   global, nằm ngoài các Region. GCP thêm khung VPC global bao 2 Region ----- */
b14:{aws:{f:[FRM('aws',150,12,922,536,LBL_AWSC,'☁'),FRM('region',380,40,280,200,LBL_RAT,'🌐'),FRM('region',380,320,280,200,LBL_RAS,'🌐')]},
     gcp:{f:[FRM('gcp',150,12,922,536,LBL_GCPC,'☁'),FRM('vpc',384,28,300,504,LBL_VPG),FRM('region',400,40,280,200,LBL_RGT,'🌐'),FRM('region',400,320,280,200,LBL_RGS,'🌐')]}}
,
/* ----- C15/C16 · Migration lift & shift: khung On-premise ở nguồn ↔
   khung Cloud ⊃ Region ở đích; Discovery/Migration Center và đường
   truyền (DX/Interconnect) vắt trên biên; DNS đích là global → ngoài Region ----- */
c15:{aws:{f:[FRM('onprem',8,170,210,230,LBL_ONP,'🏢'),FRM('aws',232,16,840,528,LBL_AWSC,'☁'),FRM('region',248,54,632,474,LBL_RAT,'🌐')]}},
c16:{gcp:{f:[FRM('onprem',8,170,210,230,LBL_ONP,'🏢'),FRM('gcp',232,16,840,528,LBL_GCPC,'☁'),FRM('region',248,54,632,474,LBL_RGT,'🌐')]}},
/* ----- C17 · VMware → cloud: On-premise ở nguồn, hai khung Cloud đích
   (AWS cho EVS/MGN, Google Cloud cho GCVE) ----- */
c17:{multi:{f:[FRM('onprem',16,170,212,230,LBL_ONP,'🏢'),FRM('aws',318,48,318,324,LBL_AWSC,'☁'),FRM('gcp',318,380,318,168,LBL_GCPC,'☁')]}},
/* ----- C18 · DB migration cross-cloud: khung Cloud nguồn ⊃ Region chứa
   DB nguồn + công cụ CDC; khung Cloud đích ⊃ Region chứa DB đích;
   DX/Interconnect + VPN vắt trên biên hai cloud ----- */
c18:{aws:{f:[FRM('aws',20,170,474,230,LBL_AWSC,'☁'),FRM('region',34,208,444,176,LBL_RAT,'🌐'),FRM('gcp',700,170,372,230,LBL_GCPC,'☁'),FRM('region',716,208,340,176,LBL_RGT,'🌐')]},
     gcp:{f:[FRM('gcp',20,170,474,230,LBL_GCPC,'☁'),FRM('region',34,208,444,176,LBL_RGT,'🌐'),FRM('aws',700,170,372,230,LBL_AWSC,'☁'),FRM('region',716,208,340,176,LBL_RAT,'🌐')]}},
/* ----- C19 · Hybrid: On-premise ↔ Cloud; DX/Interconnect + VPN vắt
   trên biên; hub (TGW/NCC) và workload nằm phía Cloud ----- */
c19:{aws:{f:[FRM('onprem',24,170,214,230,LBL_ONP,'🏢'),FRM('aws',300,16,772,528,LBL_AWSC,'☁'),FRM('region',560,54,496,474,LBL_RAT,'🌐'),FRM('vpc',762,186,286,188,['VPC — Workload','VPC — ワークロード'])]},
     gcp:{f:[FRM('onprem',24,170,214,230,LBL_ONP,'🏢'),FRM('gcp',300,16,772,528,LBL_GCPC,'☁'),FRM('vpc',540,54,516,474,LBL_VPG),FRM('region',700,98,340,414,LBL_RGT,'🌐')]}},
/* ----- D20 · VPC cơ bản (chủ thể là mạng): Cloud ⊃ Region ⊃ VPC ⊃ AZ ⊃
   Public/Private Subnet; IGW vắt trên viền VPC; NAT nằm trong public
   subnet. GCP: LB toàn cục ở biên Cloud; VPC global ⊃ Region ⊃ Subnet ----- */
d20:{aws:{f:[FRM('aws',140,12,932,536,LBL_AWSC,'☁'),FRM('region',156,50,900,482,LBL_RAT,'🌐'),FRM('vpc',172,88,868,428,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('az',344,102,692,344,['AZ — ap-northeast-1a','AZ — ap-northeast-1a']),FRM('pub',360,110,660,150,['Public Subnet — 10.0.1.0/24','パブリックサブネット — 10.0.1.0/24']),FRM('priv',360,280,320,150,['Private Subnet — App · 10.0.11.0/24','プライベートサブネット — アプリ · 10.0.11.0/24']),FRM('priv',700,280,320,150,['Private Subnet — Data · 10.0.21.0/24','プライベートサブネット — データ · 10.0.21.0/24'])]},
     gcp:{f:[FRM('gcp',140,12,932,536,LBL_GCPC,'☁'),FRM('vpc',330,44,726,488,LBL_VPG),FRM('region',346,88,694,428,LBL_RGT,'🌐'),FRM('priv',362,110,662,392,['Subnet — Regional · 10.0.0.0/24','サブネット — リージョナル · 10.0.0.0/24'])]}},
/* ----- D21 · VPC nâng cao: app ở 2 AZ trong VPC, endpoints là thành
   phần cấp VPC (vắt biên AZ), S3/Secrets nằm ngoài VPC trong Region,
   NAT trong VPC. GCP: workload + PSC + Cloud NAT trong VPC global ⊃
   Region; Google APIs và service đích nằm ở mạng nhà cung cấp riêng ----- */
d21:{aws:{f:[FRM('aws',60,12,1012,536,LBL_AWSC,'☁'),FRM('region',76,50,980,482,LBL_RAT,'🌐'),FRM('vpc',92,88,700,428,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('az',108,100,330,150,['AZ — ap-northeast-1a','AZ — ap-northeast-1a']),FRM('az',108,300,330,150,['AZ — ap-northeast-1c','AZ — ap-northeast-1c'])]},
     gcp:{f:[FRM('gcp',60,12,1012,536,LBL_GCPC,'☁'),FRM('vpc',76,50,620,482,LBL_VPG),FRM('region',92,94,588,424,LBL_RGT,'🌐'),FRM('vpc',720,100,336,360,['Producer VPC — mạng nhà cung cấp','プロデューサー VPC — 提供側ネットワーク'])]}},
/* ----- D22 · Hub & spoke: các VPC spoke + TGW nằm trong Region chính,
   TGW region 2 trong khung Region thứ hai, on-prem ngoài Cloud.
   GCP: NCC là hub toàn cục (ngoài Region), các VPC spoke là global ----- */
d22:{aws:{f:[FRM('aws',60,12,1012,536,LBL_AWSC,'☁'),FRM('region',76,40,700,472,LBL_RAT,'🌐'),FRM('region',790,300,266,212,LBL_RAO,'🌐')]},
     gcp:{f:[FRM('gcp',60,12,1012,536,LBL_GCPC,'☁'),FRM('vpc',92,40,330,472,['Các VPC spoke — Global','スポーク VPC 群 — グローバル']),FRM('region',790,300,266,212,LBL_RGO,'🌐')]}},
/* ----- D23 · Hybrid networking: On-premise ↔ Cloud, DX/Interconnect +
   VPN vắt trên biên, hub + DNS lai + các VPC nằm phía Cloud ----- */
d23:{aws:{f:[FRM('onprem',14,170,216,230,LBL_ONP,'🏢'),FRM('aws',290,16,782,528,LBL_AWSC,'☁'),FRM('region',540,54,516,474,LBL_RAT,'🌐'),FRM('vpc',766,306,284,182,['VPC — Các VPC đích','VPC — 宛先 VPC 群'])]},
     gcp:{f:[FRM('onprem',14,170,216,230,LBL_ONP,'🏢'),FRM('gcp',290,16,782,528,LBL_GCPC,'☁'),FRM('vpc',540,54,516,474,LBL_VPG),FRM('region',556,98,484,414,LBL_RGT,'🌐')]}},
/* ----- D24 · Defense in depth: Shield/CloudFront/WAF (AWS) và Cloud
   Armor (GCP) là lớp edge toàn cục — ngoài Region/VPC; Network Firewall/
   NGFW + ALB/LB + app + DB nằm trong VPC, chia public/private subnet ----- */
d24:{aws:{f:[FRM('aws',140,12,932,536,LBL_AWSC,'☁'),FRM('region',430,48,626,484,LBL_RAT,'🌐'),FRM('vpc',446,86,604,430,['VPC — 10.0.0.0/16','VPC — 10.0.0.0/16']),FRM('pub',678,200,184,160,LBL_PUB),FRM('priv',868,100,176,404,LBL_PRIV)]},
     gcp:{f:[FRM('gcp',140,12,932,536,LBL_GCPC,'☁'),FRM('vpc',400,48,656,484,LBL_VPG),FRM('region',404,92,636,424,LBL_RGT,'🌐'),FRM('priv',746,100,286,404,LBL_PRIV)]}}
};
var DGMV={
pipe:{aws:{1:[325,145],5:[462,112],6:[598,300],7:[740,300],8:[878,300],9:[740,118],10:[598,470],11:[740,470],12:[878,470],13:[878,118],14:[1015,320]}},
a2:{aws:{1:[532,221],2:[532,341],3:[532,452],4:[700,341],5:[970,160]},gcp:{2:[714,300],3:[714,430],4:[255,110]}},
a3:{aws:{1:[300,140],5:[740,140]},gcp:{1:[300,140],5:[740,140]}},
a4:{aws:{2:[545,280],3:[760,280]},gcp:{2:[620,280],3:[860,170],4:[860,400]}},
a5:{aws:{0:[230,280],4:[956,280]},gcp:{0:[230,280],2:[688,280],3:[948,280]}},
b6:{aws:{1:[280,280],2:[490,280],3:[640,160],4:[640,400],5:[850,160],7:[850,440]},gcp:{1:[240,280],2:[520,280],3:[660,160],4:[660,400],6:[240,450]}},
b7:{aws:{1:[265,280],6:[600,140]},gcp:{5:[470,140]}},
b8:{gcp:{1:[250,280]}},
b9:{aws:{0:[180,280],1:[340,280],2:[510,280],3:[690,280],6:[510,455]},gcp:{0:[180,280],1:[340,280],4:[540,455],5:[968,170]}},
b10:{aws:{0:[300,110]},gcp:{0:[300,110]}},
b11:{aws:{1:[190,280],2:[345,280],3:[545,280],4:[730,280],5:[900,160],6:[900,300],7:[730,445],8:[900,445]},gcp:{1:[215,280],5:[330,110],6:[330,450]}},
b12:{aws:{1:[350,140],2:[515,140],3:[680,140],4:[680,400],5:[515,400],6:[150,400]},gcp:{1:[350,140],2:[515,140],3:[680,140],4:[680,400],5:[515,400],6:[150,400]}},
b14:{aws:{1:[245,280]},gcp:{2:[495,140],3:[495,420],4:[780,280]}},
c15:{aws:{4:[490,460],5:[680,300],6:[972,300]}},
c16:{gcp:{4:[490,460],5:[680,300],6:[972,300]}},
c19:{aws:{3:[660,280],4:[870,280],5:[660,455]},gcp:{3:[660,280],5:[660,455]}},
d20:{aws:{1:[250,300],2:[480,185],3:[520,355],4:[860,355],5:[800,185]},gcp:{1:[235,280]}},
d21:{aws:{0:[215,175],1:[215,375],3:[880,175],4:[450,375],5:[880,375],6:[620,280]},gcp:{0:[175,280],2:[830,170],3:[830,390],4:[580,430]}},
d22:{aws:{3:[200,440],4:[900,110],5:[900,400]},gcp:{3:[200,440],4:[900,110],5:[900,400]}},
d23:{gcp:{4:[880,170]}},
d24:{aws:{3:[595,280],4:[770,280],5:[955,170],6:[955,400]},gcp:{2:[495,280],3:[660,280]}}
};
/* Áp khung + dời node + gán thang mật độ + bật nhãn "Có khung môi trường" */
DG.forEach(function(d){
  var spec=DGFR[d.id]; if(!spec) return;
  Object.keys(spec).forEach(function(k){
    var v=d.variants[k]; if(!v) return;
    var mv=(DGMV[d.id]||{})[k]||{};
    Object.keys(mv).forEach(function(i){ var n=v.nodes[+i]; if(n){ n.x=mv[i][0]; n.y=mv[i][1]; } });
    v.frames=spec[k].f;
  });
  d.fbadge=1;
  var mx=0; Object.keys(d.variants).forEach(function(k){ mx=Math.max(mx,d.variants[k].nodes.length); });
  d.sz=(d.id==='b11')?'s':((d.id==='a2')?'m':(mx>=14?'xs':(mx>=10?'s':(mx>=7?'m':''))));
});

/* ================= V4 · DỮ LIỆU FLOW HỌC (FSTAGES + FN — engine ở app.js) ================= */
var FSTAGES=[
 {n:0,t:'Giai đoạn 0 · Nền tảng — trước khi vào service',tj:'ステージ0 · 基礎 — サービスに入る前に',d:'Chưa đụng vào service nào. Giai đoạn này quyết định bạn học cloud nhanh hay vật lộn: hiểu cloud chạy ở đâu, gõ được lệnh, đọc được mạng, và có tài khoản an toàn để thực hành.',dj:'サービスにはまだ触れません。クラウドがどこで動くか、コマンドが打てるか、ネットワークが読めるか、安全な実習アカウントがあるか — ここが学習速度を決めます。'},
 {n:1,t:'Giai đoạn 1 · Cốt lõi bảo mật & mạng',tj:'ステージ1 · セキュリティとネットワークの核心',d:'Mọi service đều sống trong mạng và bị IAM gác cổng. Học IAM + VPC trước thì mọi service sau này đều “có chỗ đứng” rõ ràng.',dj:'全サービスはネットワークの中にあり、IAMが入口を守ります。IAMとVPCを先に学ぶと、後の全サービスに「置き場所」ができます。'},
 {n:2,t:'Giai đoạn 2 · Compute & Storage đầu tiên',tj:'ステージ2 · 最初のコンピュートとストレージ',d:'Dựng được “máy + ổ đĩa + kho file” là dựng được 80% hệ thống truyền thống trên cloud.',dj:'「マシン＋ディスク＋ファイル保管」が作れれば、従来型システムの8割はクラウドで作れます。'},
 {n:3,t:'Giai đoạn 3 · Mở rộng web — từ 1 server thành hệ thống web hoàn chỉnh',tj:'ステージ3 · Webの拡張 — 1台から完全なWebシステムへ',d:'Thêm cân bằng tải, tự co giãn, DNS và CDN lên bộ khung Giai đoạn 2 — đây là lúc bạn dựng được web 3-tier hoàn chỉnh đầu tiên.',dj:'ステージ2の骨格に負荷分散、自動スケーリング、DNS、CDNを加え、最初の完全な3層Webを構築します。'},
 {n:4,t:'Giai đoạn 4 · Database',tj:'ステージ4 · データベース',d:'Dữ liệu là phần khó thay nhất của hệ thống — học sau khi đã vững mạng & compute để đặt DB đúng chỗ private ngay từ đầu.',dj:'データは最も交換しにくい部分です。ネットワークとコンピュートが固まってから学び、最初から正しくプライベートに置きます。'},
 {n:5,t:'Giai đoạn 5 · Serverless & ứng dụng hiện đại',tj:'ステージ5 · サーバーレスとモダンなアプリ',d:'Bỏ quản lý server: hàm sự kiện, API, hàng đợi và workflow — kiểu kiến trúc cloud-native phổ biến nhất hiện nay.',dj:'サーバー管理を手放します。イベント関数、API、キュー、ワークフロー — 現在主流のクラウドネイティブな形です。'},
 {n:6,t:'Giai đoạn 6 · DevOps & IaC',tj:'ステージ6 · DevOps と IaC',d:'Từ “bấm tay trên console” lên “hạ tầng dạng code + pipeline tự động” — ranh giới giữa người học cloud và kỹ sư cloud.',dj:'「コンソールで手作業」から「コード化されたインフラ＋自動パイプライン」へ。学習者とエンジニアの境界です。'},
 {n:7,t:'Giai đoạn 7 · Dữ liệu & AI',tj:'ステージ7 · データとAI',d:'Khi hệ thống đã chạy ổn, giá trị tiếp theo nằm ở dữ liệu: phân tích, streaming và GenAI trên nền Bedrock/Vertex AI.',dj:'システムが安定したら、次の価値はデータにあります。分析、ストリーミング、Bedrock／Vertex AI の生成AIです。'},
 {n:8,t:'Giai đoạn 8 · Chuyên sâu theo hướng chọn — rẽ 3 nhánh',tj:'ステージ8 · 進路別の専門 — 3つの分岐',d:'Đến đây bạn đã đi hết trục chính. Chọn 1 nhánh chính theo mục tiêu nghề nghiệp (đi sâu cả 3 vẫn được, theo thứ tự ưu tiên của bạn) — cả 3 nhánh đều bắt đầu từ cuối Giai đoạn 7.',dj:'ここまでで本筋は終了です。キャリア目標に合わせて主軸を1つ選びます（3つ全て進んでも構いません）。3分岐ともステージ7の終わりから始まります。'}
];
var FN=[
 /* GĐ0 */
 {id:'s0-1',st:0,t:'Khái niệm Cloud & Region/AZ ↔ Zone',tj:'クラウドの概念と Region/AZ ↔ Zone',why:'Mọi quyết định sau này (đặt tài nguyên ở đâu, chịu lỗi ra sao, chi phí bao nhiêu) đều bắt đầu từ bản đồ Region — AZ — Zone. Học xong bạn đọc được mọi sơ đồ kiến trúc.',wj:'配置、耐障害性、費用の判断は全て Region — AZ — Zone の地図から始まります。修了後は全てのアーキテクチャ図が読めます。',hrs:'2–3 giờ',sv:[],lk:[['#/diagrams','Sơ đồ mẫu để luyện đọc vùng/AZ','AZの読み方を図で練習']]},
 {id:'s0-2',st:0,t:'Linux & command cơ bản',tj:'Linux とコマンドの基礎',why:'Cloud vận hành bằng dòng lệnh. Thuộc ls/cd/chmod/ps/ss/grep trước thì CloudShell, SSH debug và đọc log sau này không còn đáng sợ.',wj:'クラウド運用はコマンドラインです。基本コマンドを先に覚えると、CloudShell も SSH デバッグも怖くなくなります。',hrs:'4–6 giờ',sv:[],lk:[['#/command','Phần Luyện Command — lộ trình Linux','コマンド演習 — Linuxコース']]},
 {id:'s0-3',st:0,t:'Mạng cơ bản: TCP/IP, DNS, HTTP/TLS, CIDR',tj:'ネットワーク基礎：TCP/IP、DNS、HTTP/TLS、CIDR',why:'90% lỗi cloud là lỗi mạng. Hiểu IP/subnet/CIDR, DNS phân giải thế nào và HTTPS bắt tay ra sao trước khi học VPC sẽ tiết kiệm hàng chục giờ debug mò.',wj:'クラウド障害の9割はネットワークです。VPC の前に IP/CIDR、DNS、HTTPS の仕組みを理解すると、デバッグ時間が大幅に減ります。',hrs:'4–6 giờ',sv:[],lk:[['#/networking','Phần Networking — chủ đề nền tảng & máy tính CIDR','ネットワーキング — 基礎とCIDR計算ツール']]},
 {id:'s0-4',st:0,t:'Git & GitHub',tj:'Git と GitHub',why:'Mọi thứ của Architect đều là code trong Git: Terraform, Kubernetes YAML, pipeline. Commit/push/branch/pull request thạo trước, Giai đoạn 6 sẽ rất nhẹ.',wj:'Terraform、Kubernetes YAML、パイプライン — アーキテクトの成果物は全て Git の中のコードです。先に慣れるとステージ6が軽くなります。',hrs:'3–4 giờ',sv:[],lk:[['#/architect','Khối nền tảng ở trang Architect','アーキテクトページの基礎ブロック']]},
 {id:'s0-5',st:0,t:'Tạo tài khoản AWS & GCP + Billing alert + MFA',tj:'AWS／GCP アカウント作成＋請求アラート＋MFA',why:'Có “sân chơi” an toàn là điều kiện để làm lab: tài khoản riêng cho học, cảnh báo ngân sách ngay từ ngày đầu và MFA cho tài khoản gốc — tránh cú sốc hoá đơn kinh điển của người mới.',wj:'安全な実験場がラボの前提です。学習専用アカウント、初日からの予算アラート、ルートのMFAで「請求ショック」を防ぎます。',hrs:'1–2 giờ',sv:[],lk:[['#/glossary','Thuật ngữ & hướng dẫn deploy (quy trình làm việc)','用語集とデプロイ手順']]},
 /* GĐ1 */
 {id:'s1-1',st:1,t:'IAM ↔ Cloud IAM — danh tính & phân quyền',tj:'IAM ↔ Cloud IAM — IDと権限',why:'Service đầu tiên phải học vì mọi lệnh gọi đều qua IAM. Học xong bạn cấp đúng quyền tối thiểu (least-privilege) thay vì gắn quyền quản trị khắp nơi.',wj:'全ての呼び出しが IAM を通るため最初に学びます。修了後は最小権限を正しく付与できます。',hrs:'4–5 giờ',sv:[['aws','AWS IAM'],['gcp','Cloud IAM']],lk:[['#/lab/11','Lab 12 · Nền tảng bảo mật','ラボ12 · セキュリティ基盤']]},
 {id:'s1-2',st:1,t:'VPC nền tảng ↔ VPC toàn cầu',tj:'VPCの基礎 ↔ グローバルVPC',why:'VPC là “mảnh đất” mọi tài nguyên đứng trên đó. Khác biệt lớn nhất hai cloud nằm ở đây: AWS regional theo AZ, GCP global với subnet theo region.',wj:'VPC は全リソースの「土地」です。両クラウド最大の違いがここにあります：AWSはAZ単位のリージョナル、GCPはグローバルでサブネットがリージョナルです。',hrs:'5–6 giờ',sv:[['aws','Amazon VPC'],['gcp','Virtual Private Cloud (VPC)']],lk:[['#/lab/0','Lab 1 · Dựng mạng nền VPC','ラボ1 · VPC基盤の構築'],['#/networking','Phần Networking','ネットワーキング']]},
 {id:'s1-3',st:1,t:'Subnet, Route Table, Security Group ↔ Firewall Rule',tj:'サブネット、ルート表、Security Group ↔ ファイアウォールルール',why:'Ba khái niệm này quyết định gói tin đi được đến đâu — là kỹ năng debug mạng số 1. Học ngay sau VPC, khi sơ đồ còn trong đầu.',wj:'この3概念がパケットの到達範囲を決め、ネットワークデバッグの最重要スキルです。VPC の直後に学びます。',hrs:'4–5 giờ',sv:[['aws','Amazon VPC'],['gcp','Virtual Private Cloud (VPC)']],lk:[['#/lab/0','Lab 1 · Dựng mạng nền VPC','ラボ1 · VPC基盤の構築'],['#/networking','Phần Networking — Route, SG vs NACL','ネットワーキング — ルートとSG/NACL']]},
 {id:'s1-4',st:1,t:'Làm quen CLI: AWS CloudShell ↔ Google Cloud Shell',tj:'CLI入門：AWS CloudShell ↔ Google Cloud Shell',why:'Từ bước này, mọi lab đều làm bằng CLI thay vì bấm console — nhanh hơn, lặp lại được và đúng cách kỹ sư cloud làm việc thật.',wj:'このステップ以降、ラボはコンソールではなく CLI で行います。速く、再現可能で、実務のやり方そのものです。',hrs:'2–3 giờ',sv:[['aws','AWS CloudShell'],['gcp','Cloud Shell & gcloud CLI']],lk:[['#/command','Phần Luyện Command — AWS CLI & gcloud','コマンド演習 — AWS CLI と gcloud']]},
 /* GĐ2 */
 {id:'s2-1',st:2,t:'EC2 ↔ Compute Engine — máy ảo đầu tiên',tj:'EC2 ↔ Compute Engine — 最初の仮想マシン',why:'Compute là trái tim của cloud. Có IAM + VPC ở Giai đoạn 1 rồi, giờ bạn đặt máy ảo đúng subnet, đúng quyền, đúng cách.',wj:'コンピュートはクラウドの心臓です。ステージ1の IAM と VPC があるので、正しいサブネットと権限で VM を置けます。',hrs:'4–6 giờ',sv:[['aws','Amazon EC2'],['gcp','Compute Engine']],lk:[['#/lab/1','Lab 2 · Web server đầu tiên','ラボ2 · 初めてのWebサーバー']]},
 {id:'s2-2',st:2,t:'EBS ↔ Persistent Disk — ổ đĩa block & snapshot',tj:'EBS ↔ Persistent Disk — ブロックディスクとスナップショット',why:'Máy ảo cần ổ đĩa tách rời để dữ liệu sống sót khi máy chết. Học kèm snapshot ngay — đó là bản backup đầu tiên của bạn.',wj:'データがマシンの死後も残るよう、ディスクは分離します。スナップショットも同時に学び、最初のバックアップとします。',hrs:'2–3 giờ',sv:[['aws','Amazon EBS'],['gcp','Persistent Disk']],lk:[['#/lab/1','Lab 2 · Web server đầu tiên','ラボ2 · 初めてのWebサーバー']]},
 {id:'s2-3',st:2,t:'S3 ↔ Cloud Storage — object storage',tj:'S3 ↔ Cloud Storage — オブジェクトストレージ',why:'Kho file phổ quát của cloud: web tĩnh, backup, data lake đều bắt đầu từ đây. Cũng là service dễ dính lỗi public dữ liệu nhất — học cùng IAM bạn vừa học.',wj:'クラウドの万能ファイル保管庫です。静的サイト、バックアップ、データレイクの起点であり、公開ミスが最も起きやすい場所でもあります。',hrs:'3–4 giờ',sv:[['aws','Amazon S3'],['gcp','Cloud Storage']],lk:[['#/lab/2','Lab 3 · Web tĩnh toàn cầu','ラボ3 · グローバル静的サイト']]},
 {id:'s2-4',st:2,t:'AMI / Machine Image & Snapshot — đóng gói máy mẫu',tj:'AMI／マシンイメージとスナップショット — 黄金イメージ',why:'Đóng gói một máy đã cấu hình chuẩn thành image mẫu để nhân bản hàng loạt — bước đệm bắt buộc trước khi học Auto Scaling ở Giai đoạn 3.',wj:'設定済みマシンをイメージ化して量産できるようにします。ステージ3の Auto Scaling の必須の前提です。',hrs:'2 giờ',sv:[['aws','Amazon EC2'],['gcp','Compute Engine']],lk:[['#/lab/1','Lab 2 · phần chụp AMI / machine image','ラボ2 · AMI／イメージ作成']]},
 /* GĐ3 */
 {id:'s3-1',st:3,t:'Load Balancer: ALB ↔ Cloud Load Balancing',tj:'ロードバランサー：ALB ↔ Cloud Load Balancing',why:'Một server thì mong manh — LB là cửa ngõ chia tải và che giấu việc từng máy chết/sống phía sau. Điều kiện: đã có nhiều EC2/VM từ Giai đoạn 2.',wj:'1台では脆弱です。LB が負荷を分散し、背後の生死を隠します。前提はステージ2の複数 VM です。',hrs:'3–4 giờ',sv:[['aws','Elastic Load Balancing'],['gcp','Cloud Load Balancing']],lk:[['#/diagrams','Sơ đồ web 3-tier Multi-AZ','3層Web（Multi-AZ）の図']]},
 {id:'s3-2',st:3,t:'Auto Scaling ↔ Managed Instance Group',tj:'Auto Scaling ↔ マネージドインスタンスグループ',why:'Cho hệ thống tự thêm/bớt máy theo tải bằng chính image mẫu của Bước 2.4 — học ngay sau LB vì ASG/MIG luôn đứng sau LB.',wj:'ステップ2.4のイメージで負荷に応じて自動増減させます。ASG/MIG は常に LB の背後にあるため、LB の直後に学びます。',hrs:'3–4 giờ',sv:[['aws','Amazon EC2'],['gcp','Compute Engine']],lk:[['#/diagrams','Sơ đồ web 3-tier Multi-AZ','3層Web（Multi-AZ）の図']]},
 {id:'s3-3',st:3,t:'Route 53 ↔ Cloud DNS',tj:'Route 53 ↔ Cloud DNS',why:'Hệ thống có tên miền riêng mới “ra hồn” sản phẩm. DNS cũng là công cụ failover rẻ nhất khi kết hợp health check.',wj:'独自ドメインで初めて製品らしくなります。DNS はヘルスチェックと組む最安のフェイルオーバー手段でもあります。',hrs:'2–3 giờ',sv:[['aws','Amazon Route 53'],['gcp','Cloud DNS']],lk:[['#/lab/2','Lab 3 · gắn domain cho web tĩnh','ラボ3 · 静的サイトへのドメイン設定']]},
 {id:'s3-4',st:3,t:'CloudFront ↔ Cloud CDN',tj:'CloudFront ↔ Cloud CDN',why:'Đưa nội dung ra edge gần người dùng: giảm latency, giảm tải origin, thêm lớp WAF phía trước. Học sau DNS vì CDN luôn gắn với domain.',wj:'コンテンツをエッジへ寄せ、遅延とオリジン負荷を下げ、前に WAF の層を加えます。ドメインとセットのため DNS の後に学びます。',hrs:'3 giờ',sv:[['aws','Amazon CloudFront'],['gcp','Cloud CDN']],lk:[['#/lab/2','Lab 3 · Web tĩnh toàn cầu','ラボ3 · グローバル静的サイト']]},
 {id:'s3-5',st:3,t:'Mốc Giai đoạn 3: dựng hoàn chỉnh web 3-tier',tj:'ステージ3の到達点：3層Webの完全構築',why:'Ghép toàn bộ Giai đoạn 1–3 thành một kiến trúc chạy thật: DNS → CDN → LB → ASG → (DB ở giai đoạn sau). Đây là sơ đồ phỏng vấn kinh điển nhất.',wj:'ステージ1〜3を実働アーキテクチャに統合します：DNS → CDN → LB → ASG。面接で最も定番の図です。',hrs:'4–5 giờ',sv:[],lk:[['#/diagrams','Sơ đồ 3-tier trong Thư viện Sơ đồ','図ライブラリの3層Web図'],['#/lab/0','Lab 1 · Mạng nền','ラボ1 · ネットワーク基盤'],['#/lab/1','Lab 2 · Web server','ラボ2 · Webサーバー']]},
 /* GĐ4 */
 {id:'s4-1',st:4,t:'RDS / Aurora ↔ Cloud SQL / AlloyDB — DB quan hệ managed',tj:'RDS／Aurora ↔ Cloud SQL／AlloyDB — マネージド関係DB',why:'Thay DB tự cài bằng managed: backup, failover Multi-AZ/HA, patch — cloud lo. Điều kiện cứng: DB phải nằm ở private subnet của Giai đoạn 1.',wj:'自前DBをマネージドへ置き換え、バックアップ、Multi-AZ/HA、パッチをクラウドに任せます。DB はステージ1のプライベートサブネットに置くのが絶対条件です。',hrs:'5–6 giờ',sv:[['aws','Amazon RDS'],['aws','Amazon Aurora'],['gcp','Cloud SQL'],['gcp','AlloyDB for PostgreSQL']],lk:[['#/lab/3','Lab 4 · Database managed','ラボ4 · マネージドDB']]},
 {id:'s4-2',st:4,t:'DynamoDB ↔ Firestore / Bigtable — NoSQL',tj:'DynamoDB ↔ Firestore／Bigtable — NoSQL',why:'Khi mẫu truy cập đơn giản nhưng quy mô cực lớn, NoSQL serverless thắng DB quan hệ. Học sau RDS để thấy rõ ranh giới chọn bên nào.',wj:'アクセスパターンが単純で規模が巨大なら、サーバーレス NoSQL が勝ちます。RDS の後に学ぶと比較軸が明確になります。',hrs:'4 giờ',sv:[['aws','Amazon DynamoDB'],['gcp','Firestore'],['gcp','Cloud Bigtable']],lk:[['#/lab/4','Lab 5 · API serverless (DynamoDB/Firestore)','ラボ5 · サーバーレスAPI']]},
 {id:'s4-3',st:4,t:'ElastiCache ↔ Memorystore — cache tăng tốc',tj:'ElastiCache ↔ Memorystore — 高速キャッシュ',why:'Cache là đòn bẩy hiệu năng rẻ nhất: gánh 80% lượt đọc lặp để DB thở được trong giờ cao điểm.',wj:'キャッシュは最も安い性能改善策です。繰り返し読み取りの8割を引き受け、ピーク時の DB を守ります。',hrs:'2–3 giờ',sv:[['aws','Amazon ElastiCache'],['gcp','Memorystore']],lk:[['#/diagrams','Sơ đồ TMĐT quy mô lớn (có cache)','大規模ECの図（キャッシュ付き）']]},
 /* GĐ5 */
 {id:'s5-1',st:5,t:'Lambda ↔ Cloud Run functions — hàm serverless',tj:'Lambda ↔ Cloud Run functions — サーバーレス関数',why:'Việc ngắn theo sự kiện thì đừng thuê server: hàm chạy khi có sự kiện, scale về 0 khi rảnh. Nền của mọi kiến trúc serverless phía sau.',wj:'短いイベント処理にサーバーは不要です。イベントで動き、暇な時はゼロに縮みます。後続のサーバーレス構成の土台です。',hrs:'4 giờ',sv:[['aws','AWS Lambda'],['gcp','Cloud Run functions']],lk:[['#/lab/4','Lab 5 · API serverless','ラボ5 · サーバーレスAPI']]},
 {id:'s5-2',st:5,t:'API Gateway — cửa ngõ API',tj:'API Gateway — APIの入口',why:'Hàm và container cần một cửa ngõ có xác thực, throttle và log. Học ngay sau Lambda/functions vì đây là cặp đôi mặc định.',wj:'関数とコンテナには認証、スロットル、ログを持つ入口が必要です。Lambda／functions の定番ペアとして直後に学びます。',hrs:'3 giờ',sv:[['aws','Amazon API Gateway'],['gcp','API Gateway']],lk:[['#/lab/4','Lab 5 · API serverless','ラボ5 · サーバーレスAPI']]},
 {id:'s5-3',st:5,t:'Cloud Run / ECS — container không quản node, và làm quen GKE',tj:'Cloud Run／ECS — ノード管理不要のコンテナと GKE 入門',why:'Khi hàm bị giới hạn (chạy dài, cần môi trường riêng), container là bước tiếp tự nhiên. GKE chỉ làm quen ở bước này — chuyên sâu để dành Giai đoạn 8.',wj:'関数の制限（長時間実行、専用環境）に当たったらコンテナが自然な次の一手です。GKE はここでは入門のみ、専門化はステージ8です。',hrs:'5–6 giờ',sv:[['aws','Amazon ECS'],['gcp','Cloud Run'],['gcp','Google Kubernetes Engine (GKE)']],lk:[['#/lab/5','Lab 6 · Container ECS Fargate vs Cloud Run','ラボ6 · コンテナ実践']]},
 {id:'s5-4',st:5,t:'SQS / SNS ↔ Pub/Sub — hàng đợi & sự kiện',tj:'SQS／SNS ↔ Pub/Sub — キューとイベント',why:'Tách các thành phần bằng message để một phần chậm/hỏng không kéo sập cả hệ thống — tư duy bất đồng bộ cốt lõi của Architect.',wj:'メッセージで分離すると、一部の遅延や障害が全体に波及しません。アーキテクトの非同期思考の核心です。',hrs:'4 giờ',sv:[['aws','Amazon SQS'],['aws','Amazon SNS'],['gcp','Pub/Sub']],lk:[['#/lab/9','Lab 10 · Kiến trúc sự kiện','ラボ10 · イベント駆動']]},
 {id:'s5-5',st:5,t:'EventBridge ↔ Eventarc & Step Functions ↔ Workflows — điều phối',tj:'EventBridge ↔ Eventarc と Step Functions ↔ Workflows — 統括',why:'Nhiều hàm + nhiều sự kiện cần người điều phối: event bus định tuyến sự kiện, state machine điều phối các bước có retry rõ ràng.',wj:'関数とイベントが増えたら統括役が必要です。イベントバスが配送し、状態機械がリトライ付きで手順を統括します。',hrs:'4 giờ',sv:[['aws','Amazon EventBridge'],['aws','AWS Step Functions'],['gcp','Eventarc'],['gcp','Workflows']],lk:[['#/lab/9','Lab 10 · Kiến trúc sự kiện','ラボ10 · イベント駆動'],['#/diagrams','Sơ đồ đặt hàng event-driven','イベント駆動の注文システム図']]},
 /* GĐ6 */
 {id:'s6-1',st:6,t:'Docker — đóng gói container',tj:'Docker — コンテナ化',why:'Terraform/Kubernetes đều vô nghĩa nếu chưa hiểu image/container. Một buổi Docker vững sẽ gỡ rối cho toàn bộ phần container phía sau.',wj:'イメージとコンテナが分からなければ Terraform も Kubernetes も意味を持ちません。Docker の基礎が後半全体を軽くします。',hrs:'4–5 giờ',sv:[],lk:[['#/lab/5','Lab 6 · Container thực chiến','ラボ6 · コンテナ実践'],['#/architect','Khối nền tảng Architect — Docker','アーキテクト基礎 — Docker']]},
 {id:'s6-2',st:6,t:'ECR ↔ Artifact Registry — kho image riêng',tj:'ECR ↔ Artifact Registry — プライベートなイメージ保管庫',why:'Image build ra phải có nơi lưu an toàn, quét lỗ hổng và cấp cho ECS/Cloud Run/GKE kéo về.',wj:'ビルドしたイメージには、安全な保管、脆弱性スキャン、実行基盤への配布経路が必要です。',hrs:'2 giờ',sv:[['aws','Amazon ECR'],['gcp','Artifact Registry']],lk:[['#/lab/5','Lab 6 · Container thực chiến','ラボ6 · コンテナ実践']]},
 {id:'s6-3',st:6,t:'CI/CD: CodePipeline / GitHub Actions ↔ Cloud Build',tj:'CI/CD：CodePipeline／GitHub Actions ↔ Cloud Build',why:'Deploy tay là nguồn lỗi lớn nhất. Pipeline build một lần — deploy nhiều nơi, có kiểm thử và phê duyệt production.',wj:'手動デプロイは最大の事故源です。一度ビルドして複数環境へ、テストと本番承認つきで届けます。',hrs:'5 giờ',sv:[['aws','AWS CodePipeline'],['aws','AWS CodeBuild'],['gcp','Cloud Build']],lk:[['#/lab/7','Lab 8 · CI/CD hai cloud','ラボ8 · 両クラウドのCI/CD']]},
 {id:'s6-4',st:6,t:'Terraform — hạ tầng dạng code đa cloud',tj:'Terraform — マルチクラウドの IaC',why:'Đỉnh của Giai đoạn 6: viết lại toàn bộ những gì đã bấm tay ở Giai đoạn 1–5 thành code — cùng một workflow cho cả AWS và GCP.',wj:'ステージ6の頂点です。ステージ1〜5で手作業した全てをコード化し、AWS と GCP で同じワークフローを使います。',hrs:'8–10 giờ',sv:[],lk:[['#/lab/6','Lab 7 · IaC đa cloud bằng Terraform','ラボ7 · Terraform のマルチクラウドIaC'],['#/architect','Trang Architect — Khối Terraform','アーキテクト — Terraform編']]},
 {id:'s6-5',st:6,t:'CloudWatch ↔ Cloud Monitoring & Logging — observability',tj:'CloudWatch ↔ Cloud Monitoring と Logging — 可観測性',why:'Hệ thống không có giám sát là hệ thống mù. Học ở cuối Giai đoạn 6 để gắn alarm/log/SLO lên mọi thứ bạn đã dựng.',wj:'監視のないシステムは盲目です。ステージ6の最後に、これまで作った全てへアラーム、ログ、SLO を付けます。',hrs:'4 giờ',sv:[['aws','Amazon CloudWatch'],['gcp','Cloud Monitoring'],['gcp','Cloud Logging']],lk:[['#/lab/10','Lab 11 · Giám sát & cảnh báo','ラボ11 · 監視とアラート']]},
 /* GĐ7 */
 {id:'s7-1',st:7,t:'Athena / Glue ↔ BigQuery / Dataflow — phân tích dữ liệu',tj:'Athena／Glue ↔ BigQuery／Dataflow — データ分析',why:'Data lake trên S3/Cloud Storage (Giai đoạn 2) giờ mới phát huy giá trị: truy vấn SQL serverless và ETL/streaming có quản lý.',wj:'ステージ2のデータレイクがここで価値を生みます。サーバーレス SQL とマネージド ETL／ストリーミングです。',hrs:'6 giờ',sv:[['aws','Amazon Athena'],['aws','AWS Glue'],['gcp','BigQuery'],['gcp','Dataflow']],lk:[['#/diagrams','Sơ đồ streaming data pipeline','ストリーミングパイプライン図']]},
 {id:'s7-2',st:7,t:'Kinesis ↔ Pub/Sub streaming — dữ liệu thời gian thực',tj:'Kinesis ↔ Pub/Sub ストリーミング — リアルタイムデータ',why:'Pub/Sub bạn đã học ở Giai đoạn 5 cho sự kiện ứng dụng; bước này nâng lên bài toán stream dữ liệu lớn: clickstream, IoT, log thời gian thực.',wj:'Pub/Sub はステージ5でアプリのイベントとして学びました。ここではクリックストリーム、IoT、リアルタイムログの大規模ストリームへ進みます。',hrs:'4 giờ',sv:[['aws','Amazon Kinesis Data Streams'],['gcp','Pub/Sub']],lk:[['#/diagrams','Sơ đồ data pipeline xe tự lái (vẽ lại)','自動運転データパイプライン図（描き直し）']]},
 {id:'s7-3',st:7,t:'Bedrock ↔ Vertex AI / Gemini — GenAI ứng dụng',tj:'Bedrock ↔ Vertex AI／Gemini — 生成AIの活用',why:'Dùng model có sẵn qua API để làm RAG/chatbot doanh nghiệp — không cần train model. Điều kiện: hiểu IAM (phân quyền dữ liệu) và S3/GCS (kho tài liệu).',wj:'既製モデルを API で使い、企業の RAG やチャットボットを作ります。前提は IAM（データ権限）と S3/GCS（文書保管）の理解です。',hrs:'6 giờ',sv:[['aws','Amazon Bedrock'],['gcp','Vertex AI']],lk:[['#/diagrams','Sơ đồ nền tảng AI / RAG','AI／RAG 基盤の図']]},
 {id:'s7-4',st:7,t:'SageMaker ↔ Vertex AI — ML chuyên sâu',tj:'SageMaker ↔ Vertex AI — 本格的な機械学習',why:'Khi cần train/fine-tune model riêng và MLOps bài bản mới xuống tầng này — đa số bài toán GenAI dừng ở Bước 7.3 là đủ.',wj:'独自モデルの学習や本格 MLOps が必要な時だけこの層へ。大半の生成AI案件はステップ7.3で十分です。',hrs:'6–8 giờ',sv:[['aws','Amazon SageMaker'],['gcp','Vertex AI']],lk:[['#/services','Chi tiết SageMaker / Vertex AI ở danh mục','カタログの SageMaker／Vertex AI 詳細']]},
 /* GĐ8 — 3 nhánh, mọi node đều bắt đầu từ s7-4 */
 {id:'s8-a',st:8,pre:'s7-4',branch:'A',t:'Nhánh A · Architect: Well-Architected, HA/DR, Migration & Capstone',tj:'分岐A · アーキテクト：Well-Architected、HA/DR、移行、キャップストーン',why:'Tổng hợp toàn bộ flow thành năng lực thiết kế: đánh giá kiến trúc theo Well-Architected, thiết kế chịu lỗi & thảm hoạ, dẫn một chương trình migration và bảo vệ một capstone hoàn chỉnh.',wj:'フロー全体を設計力に統合します。Well-Architected による評価、耐障害・災害設計、移行プログラムの主導、キャップストーンの完成です。',hrs:'20–30 giờ',sv:[],lk:[['#/architect','Trang Architect — framework & capstone','アーキテクト — フレームワークとキャップストーン'],['#/migration','Trang Migration — 7R & labs','移行 — 7R とラボ']]},
 {id:'s8-b',st:8,pre:'s7-4',branch:'B',t:'Nhánh B · Networking chuyên sâu: VPC nâng cao, Transit Gateway ↔ NCC, Direct Connect ↔ Interconnect',tj:'分岐B · ネットワーク専門：VPC応用、Transit Gateway ↔ NCC、Direct Connect ↔ Interconnect',why:'Đi sâu con đường mạng: hub & spoke đa VPC, kết nối lai on-prem ↔ cloud, DNS lai và bảo mật mạng nhiều lớp — đến cấp bậc thầy.',wj:'ネットワークを極めます。複数VPCのハブ＆スポーク、オンプレミスとのハイブリッド接続、ハイブリッドDNS、多層のネットワークセキュリティです。',hrs:'20–30 giờ',sv:[['aws','AWS Transit Gateway'],['aws','AWS Direct Connect'],['gcp','Network Connectivity Center'],['gcp','Cloud Interconnect']],lk:[['#/networking','Phần Networking — các chủ đề nâng cao','ネットワーキング — 応用トピック'],['#/diagrams','Nhóm sơ đồ Networking (D)','図ライブラリ D群（ネットワーク）']]},
 {id:'s8-c',st:8,pre:'s7-4',branch:'C',t:'Nhánh C · Security & DevOps: KMS, WAF, GuardDuty ↔ SCC, Kubernetes chuyên sâu EKS ↔ GKE',tj:'分岐C · セキュリティとDevOps：KMS、WAF、GuardDuty ↔ SCC、EKS ↔ GKE の専門化',why:'Cứng hoá bảo mật (mã hoá, WAF, phát hiện đe doạ) và vận hành Kubernetes ở mức production: autoscaling, GitOps, service mesh, bảo mật chuỗi cung ứng.',wj:'セキュリティを固め（暗号化、WAF、脅威検出）、Kubernetes を本番レベルで運用します：自動スケーリング、GitOps、サービスメッシュ、サプライチェーン保護です。',hrs:'20–30 giờ',sv:[['aws','AWS KMS'],['aws','AWS WAF'],['aws','Amazon GuardDuty'],['aws','Amazon EKS'],['gcp','Cloud KMS'],['gcp','Security Command Center'],['gcp','Google Kubernetes Engine (GKE)']],lk:[['#/lab/11','Lab 12 · Nền tảng bảo mật','ラボ12 · セキュリティ基盤'],['#/lab/8','Lab 9 · Kubernetes EKS vs GKE','ラボ9 · Kubernetes']]}
];
