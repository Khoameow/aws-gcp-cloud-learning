/* ============================================================
   upgrade9.js — GIAI ĐOẠN 1 (đánh giá ChatGPT, người dùng duyệt
   2026-11-04): IT Fundamentals + Troubleshooting.
   A · Trang "Nền tảng IT" (#/fundamentals): 10 chương nền tảng
       (Networking, IP/CIDR, Routing, DNS, Linux, Windows Server,
       Virtualization, Database, Scripting, Git) — mỗi chương có
       Mục tiêu / Nội dung chính / Ví dụ gắn với cloud / Điểm hay
       nhầm / Học tiếp; tick hoàn thành lưu localStorage
       (khoameow_fund_v1) + thanh tiến độ x/10.
   B · Ngân hàng câu hỏi nền tảng: 40 câu (4 câu/chương), ĐÚNG
       engine + định dạng ngân hàng Networking của upgrade8.js
       (mỗi phương án có giải thích riêng song ngữ, phiên 10 câu
       rút ngẫu nhiên, xáo trộn thứ tự phương án, điểm chạy,
       tổng kết, "Làm phiên mới").
   C · Trang "Vận hành & Xử lý sự cố" (#/troubleshooting): dải
       khung kiến thức (Observability, quy trình sự cố, SLI/SLO/
       SLA/Error Budget, RTO/RPO) + 14 tình huống sự cố đủ 5 mục
       (Triệu chứng / Quy trình xử lý / Nguyên nhân gốc / Lệnh &
       công cụ kiểm tra / Phòng ngừa) + ngân hàng 30 câu tình
       huống trên cùng engine, lọc Tất cả / AWS / GCP / K8s.
   D · Điều hướng: "Nền tảng IT" vào trụ "Lộ trình & Nền tảng",
       "Xử lý sự cố" vào trụ "Thực hành & Triển khai" (đúng cơ
       chế panel hiện tại như upgrade3/upgrade6); Flow Giai đoạn
       0 gắn liên kết sang trang Fundamentals, không đánh số lại.
   Nạp SAU upgrade8.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function JA(){ return window.LANG==='ja'; }
function L(vi,ja){ return (window.LANG==='ja'&&ja)?ja:vi; }
function P(pair){ return JA()?pair[1]:pair[0]; }

/* ================= CSS RIÊNG (tiền tố f9- / ts-) ================= */
try{
  var st9=document.createElement('style'); st9.id='u9css';
  st9.textContent=
  '.f9-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-bottom:16px}'
  +'.f9-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:17px 18px;cursor:pointer;text-align:left;font:inherit;color:var(--ink);width:100%}'
  +'.f9-card:hover{border-color:rgba(34,211,238,.55)}'
  +'.f9-card.open{border-color:var(--orange)}'
  +'.f9-card.is-done{border-color:rgba(74,222,128,.6)}'
  +'.f9-card h3{font-size:15.5px;display:flex;gap:9px;align-items:flex-start;margin:0 0 7px}'
  +'.f9-card h3 .num{background:var(--blue);color:#fff;min-width:26px;height:26px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;flex:none;padding:0 4px}'
  +'.f9-card p{font-size:13.3px;color:var(--ink2);margin:0 0 10px}'
  +'.f9-meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}'
  +'.f9-tag{font-size:11.5px;font-weight:800;letter-spacing:.4px;border:1px solid var(--line);border-radius:99px;padding:3px 10px;color:var(--ink2)}'
  +'.f9-tag.aws{color:#ffb84d;border-color:rgba(255,153,0,.5)}'
  +'.f9-tag.gcp{color:#7cc0ff;border-color:rgba(66,133,244,.55)}'
  +'.f9-tag.k8s{color:#a5b4fc;border-color:rgba(99,102,241,.55)}'
  +'.f9-tag.gen{color:#5eead4;border-color:rgba(45,212,191,.5)}'
  +'.f9-open-hint{font-size:12.5px;color:var(--cyan);font-weight:700}'
  +'.f9-check{display:inline-flex;gap:7px;align-items:center;font-size:13px;font-weight:700;color:var(--ink2);cursor:pointer}'
  +'.f9-check input{width:19px;height:19px;accent-color:#22c55e;cursor:pointer}'
  +'.f9-detail{margin:-4px 0 18px}'
  +'.f9-detail .dsec{margin-bottom:0}'
  +'.f9-prog{display:flex;flex-wrap:wrap;gap:12px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px 18px;margin-bottom:16px}'
  +'.f9-prog .fp-pct{font-size:26px;font-weight:800;color:#fff}'
  +'.f9-prog .fp-pct small{font-size:14px;color:var(--ink2)}'
  +'.f9-bar{flex:1 1 200px;height:10px;border-radius:99px;background:rgba(148,163,184,.18);overflow:hidden}'
  +'.f9-bar>div{height:100%;background:linear-gradient(90deg,#22d3ee,#4ade80);border-radius:99px;transition:width .3s}'
  +'.f9-prog .fp-note{font-size:13px;color:var(--ink2);flex:1 1 100%}'
  +'.ts-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-bottom:18px}'
  +'.ts-mini{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px}'
  +'.ts-mini h3{font-size:15px;margin:0 0 8px;color:var(--ink)}'
  +'.ts-mini p,.ts-mini li{font-size:13.5px;color:var(--ink2)}'
  +'.ts-mini ul,.ts-mini ol{margin:6px 0 0;padding-left:19px}'
  +'.ts-mini li{margin-bottom:5px}'
  +'.ts-mini li b,.ts-mini p b{color:var(--ink)}'
  +'.ts-cmd{background:rgba(5,10,20,.85);border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-family:"JetBrains Mono",monospace;font-size:12.8px;line-height:1.75;color:#a5f3fc;white-space:pre-wrap;word-break:break-word;margin:6px 0 4px}'
  +'.qb-k8s{background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.6);color:#c7d2fe}'
  +'.qb-gen{background:rgba(45,212,191,.14);border-color:rgba(45,212,191,.55);color:#99f6e4}'
  +'@media (max-width:640px){.f9-grid{grid-template-columns:1fr}}';
  document.head.appendChild(st9);
}catch(e){}

/* ================================================================
   ENGINE NGÂN HÀNG CÂU HỎI — cùng cơ chế + định dạng upgrade8.js:
   phiên 10 câu rút ngẫu nhiên, xáo trộn thứ tự phương án (giải
   thích đi theo phương án), điểm chạy, tổng kết cuối phiên,
   mỗi phương án có giải thích riêng song ngữ.
   cfg: {hostId, prefix, bank, tags, filters|null, title:[vi,ja],
         intro:function(total,sessionLen)->[vi,ja], sum:{...}}
   Câu hỏi: {q,qj,o:[[vi,ja]x4],c,e,ej,x:[[vi,ja]x4],tp:[vi,ja],tg}
   ================================================================ */
function makeBank(cfg){
  var SIZE=10;
  var st={filter:'all', session:[], ans:{}};
  function tagOf(q){ return cfg.tags[q.tg]||cfg.tags.gen||{label:['—','—'],cls:'gen'}; }
  function pool(){
    if(!cfg.filters||st.filter==='all') return cfg.bank.slice();
    return cfg.bank.filter(function(q){ return q.tg===st.filter; });
  }
  function shuffleQ(q){
    var idx=[0,1,2,3];
    for(var i=3;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=idx[i]; idx[i]=idx[j]; idx[j]=t; }
    return { q:q.q, qj:q.qj, tp:q.tp, tg:q.tg, e:q.e, ej:q.ej,
      o:idx.map(function(k){ return q.o[k]; }),
      x:idx.map(function(k){ return q.x[k]; }),
      c:idx.indexOf(q.c) };
  }
  function newSession(){
    var p=pool();
    for(var i=p.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=p[i]; p[i]=p[j]; p[j]=t; }
    st.session=p.slice(0,Math.min(SIZE,p.length)).map(shuffleQ);
    st.ans={};
  }
  function score(){ return st.session.reduce(function(a,q,i){ return a+((st.ans[i]===q.c)?1:0); },0); }
  function qHTML(q,i){
    var ja=JA();
    var picked=st.ans[i];
    var tag=tagOf(q);
    var s='<div class="quiz-q"><p class="quiz-qt"><span class="qb-badge qb-'+tag.cls+'">'+E(P(tag.label))+'</span> <b>'+(ja?'問':'Câu')+' '+(i+1)+'/'+st.session.length+'.</b> '+E(ja?q.qj:q.q)
      +(q.tp?' <span class="qb-topic">'+E(P(q.tp))+'</span>':'')+'</p><div class="quiz-opts">'
      +q.o.map(function(o,j){
        var cls='';
        if(picked!==undefined){ if(j===q.c) cls=' q-ok'; else if(j===picked) cls=' q-ng'; }
        return '<button type="button" class="'+cls.trim()+'" data-'+cfg.prefix+'="'+i+':'+j+'"'+(picked!==undefined?' disabled':'')+'>'+String.fromCharCode(65+j)+'. '+E(P(o))+'</button>';
      }).join('')+'</div>';
    if(picked!==undefined){
      s+='<div class="ex-feedback '+(picked===q.c?'ok':'ng')+'">'+(picked===q.c?('<b>'+(ja?'正解！':'Đúng!')+'</b> '):('<b>'+(ja?'不正解 — 正解は緑の選択肢です。':'Chưa đúng — đáp án đúng là phương án màu xanh.')+'</b> '))+E(ja?q.ej:q.e)+'</div>';
      s+='<div class="qb-whys"><p class="qb-whys-t">'+(ja?'各選択肢の解説：':'Giải thích từng phương án:')+'</p>'+q.o.map(function(o,j){
        var mark=j===q.c?'✓':(j===picked?'✗':'·');
        var cls=j===q.c?'w-ok':(j===picked?'w-ng':'w-no');
        return '<div class="qb-why '+cls+'"><span class="qb-wm" aria-hidden="true">'+mark+'</span><div><b>'+String.fromCharCode(65+j)+'.</b> '+E(P(o))+'<span class="qb-wx">'+E(P(q.x[j]))+'</span></div></div>';
      }).join('')+'</div>';
    }
    return s+'</div>';
  }
  function render(){
    var host=$(cfg.hostId); if(!host) return;
    var ja=JA();
    if(!st.session.length) newSession();
    var done=Object.keys(st.ans).length, total=st.session.length, sc=score();
    var h='<h3>'+E(P(cfg.title))+'</h3><p>'+E(P(cfg.intro(cfg.bank.length,total)))+'</p>';
    h+='<div class="qb-filter" role="group" aria-label="'+(ja?'フィルター':'Bộ lọc')+'">';
    if(cfg.filters){
      h+=cfg.filters.map(function(f){
        return '<button type="button" class="ctab qb-ftab'+(st.filter===f[0]?' on':'')+'" data-'+cfg.prefix+'f="'+f[0]+'">'+E(P(f[1]))+'</button>';
      }).join('');
    }
    h+='<span class="quiz-score qb-score">'+(ja?'スコア：':'Điểm: ')+sc+'/'+total+(done?(' · '+(ja?'回答済み ':'Đã trả lời ')+done+'/'+total):'')+'</span>'
      +'<button type="button" class="dg-btn" data-'+cfg.prefix+'new="1">'+(ja?'新しいセッション':'Làm phiên mới')+'</button></div>';
    h+=st.session.map(qHTML).join('');
    if(done===total&&total>0){
      var msg = sc===total?cfg.sum.perfect : (sc>=Math.ceil(total*0.7)?cfg.sum.good:cfg.sum.low);
      h+='<div class="qb-sum"><b>'+(ja?'セッション結果：':'Tổng kết phiên: ')+sc+'/'+total+'</b><p>'+E(P(msg))+'</p>'
        +'<button type="button" class="dg-btn" data-'+cfg.prefix+'new="1">'+(ja?'新しいセッションを始める':'Làm phiên mới')+'</button></div>';
    }
    host.innerHTML=h;
    host.querySelectorAll('[data-'+cfg.prefix+'f]').forEach(function(b){
      b.addEventListener('click',function(){
        var f=b.getAttribute('data-'+cfg.prefix+'f');
        if(f!==st.filter){ st.filter=f; }
        newSession(); render();
        host.scrollIntoView({block:'nearest'});
      });
    });
    host.querySelectorAll('[data-'+cfg.prefix+'new]').forEach(function(b){
      b.addEventListener('click',function(){ newSession(); render(); host.scrollIntoView({block:'nearest'}); });
    });
    host.querySelectorAll('[data-'+cfg.prefix+']').forEach(function(b){
      b.addEventListener('click',function(){
        var p=b.getAttribute('data-'+cfg.prefix).split(':');
        st.ans[+p[0]]=+p[1];
        render();
        var qs=host.querySelectorAll('.quiz-q'); var el=qs[+p[0]];
        if(el) el.scrollIntoView({block:'nearest'});
      });
    });
  }
  newSession();
  return {render:render};
}

/* ================================================================
   A · DỮ LIỆU 10 CHƯƠNG NỀN TẢNG IT
   body = HTML (dùng class sẵn của site: table.cmp, ul, p, b, code)
   ================================================================ */
var CH=[
{id:'net', ic:'🌐',
 t:['Computer Networking — mạng máy tính','コンピュータネットワーク'],
 goal:['Đọc được hành trình của một gói tin từ máy bạn tới server: qua những tầng nào, giao thức nào, và khi mất kết nối thì nghi ngờ tầng nào trước. Đây là chương quan trọng nhất của cả module — mọi sự cố cloud đều bắt đầu từ mạng.',
       'パケットが自分のマシンからサーバーへ届くまでの道のりを、どの層・どのプロトコルを通るか、そして接続できない時にどの層を先に疑うかまで読めるようになります。本モジュールで最も重要な章です。'],
 body:['<p>Mọi hệ thống cloud đều là máy tính nối với nhau bằng mạng. Mô hình <b>OSI (Open Systems Interconnection — mô hình kết nối các hệ thống mở)</b> chia việc truyền thông thành 7 tầng; thực tế hằng ngày ta dùng bộ <b>TCP/IP (Transmission Control Protocol / Internet Protocol — giao thức điều khiển truyền dẫn / giao thức Internet)</b> gộp còn 4 tầng, nhưng OSI vẫn là ngôn ngữ chung để mô tả sự cố (“lỗi này ở tầng mấy?”).</p>'
  +'<table class="cmp"><tr><th style="width:8%">Tầng</th><th style="width:26%">Tên</th><th style="width:30%">Giao thức / ví dụ</th><th>Vai trò một câu</th></tr>'
  +'<tr><td>7</td><td>Application (Ứng dụng)</td><td>HTTP, HTTPS, DNS, SSH</td><td>Nơi ứng dụng nói chuyện: web, API, phân giải tên miền.</td></tr>'
  +'<tr><td>6</td><td>Presentation (Trình diễn)</td><td>TLS, mã hoá, nén</td><td>Định dạng + mã hoá dữ liệu (TLS — Transport Layer Security, bảo mật tầng truyền tải — nằm ở đây).</td></tr>'
  +'<tr><td>5</td><td>Session (Phiên)</td><td>Phiên đăng nhập, RPC</td><td>Mở, duy trì và đóng phiên làm việc.</td></tr>'
  +'<tr><td>4</td><td>Transport (Truyền tải)</td><td>TCP, UDP + số cổng (port)</td><td>Chia dữ liệu thành đoạn, đưa tới đúng chương trình qua số cổng.</td></tr>'
  +'<tr><td>3</td><td>Network (Mạng)</td><td>IP, ICMP (ping)</td><td>Địa chỉ IP và định tuyến gói tin qua nhiều mạng.</td></tr>'
  +'<tr><td>2</td><td>Data Link (Liên kết dữ liệu)</td><td>Ethernet, địa chỉ MAC, ARP</td><td>Truyền trong cùng một mạng cục bộ, theo địa chỉ MAC.</td></tr>'
  +'<tr><td>1</td><td>Physical (Vật lý)</td><td>Cáp, sóng Wi-Fi, tín hiệu quang</td><td>Bit chạy trên môi trường vật lý thật.</td></tr></table>'
  +'<p><b>TCP so với UDP</b> — quyết định ở tầng 4 xuất hiện trong mọi thiết kế cloud:</p>'
  +'<table class="cmp"><tr><th style="width:22%"></th><th>TCP</th><th>UDP</th></tr>'
  +'<tr><td><b>Kết nối</b></td><td>Có bắt tay 3 bước (SYN → SYN-ACK → ACK) trước khi gửi</td><td>Không kết nối, gửi là gửi</td></tr>'
  +'<tr><td><b>Độ tin cậy</b></td><td>Đảm bảo đủ, đúng thứ tự, gửi lại khi mất</td><td>Không đảm bảo — gói có thể mất, trùng, lệch thứ tự</td></tr>'
  +'<tr><td><b>Tốc độ / độ trễ</b></td><td>Chậm hơn vì chi phí kiểm soát</td><td>Rất nhanh, độ trễ thấp</td></tr>'
  +'<tr><td><b>Dùng cho</b></td><td>Web (HTTP), SSH, database, email</td><td>DNS, video/voice trực tiếp, game, streaming</td></tr></table>'
  +'<p><b>HTTP / HTTPS:</b> HTTP (HyperText Transfer Protocol — giao thức truyền siêu văn bản) là giao thức tầng 7 của web: client gửi request (GET/POST… + đường dẫn), server trả response kèm mã trạng thái (200 OK, 404 Not Found, 500 lỗi server…). HTTPS chính là HTTP chạy bên trong TLS nên được mã hoá và xác thực danh tính server bằng chứng chỉ số — học kỹ ở chương DNS và tình huống “chứng chỉ hết hạn” tại trang Xử lý sự cố.</p>',
       '<p>クラウドのシステムはすべて、ネットワークでつながったコンピュータです。<b>OSI（Open Systems Interconnection）</b>参照モデルは通信を7層に分け、実務では <b>TCP/IP</b> の4層に集約されますが、「何層の障害か」を語る共通言語として OSI が使われます。</p>'
  +'<table class="cmp"><tr><th style="width:8%">層</th><th style="width:26%">名前</th><th style="width:30%">プロトコル / 例</th><th>役割（一言）</th></tr>'
  +'<tr><td>7</td><td>アプリケーション</td><td>HTTP、HTTPS、DNS、SSH</td><td>Web、API、名前解決などアプリの通信。</td></tr>'
  +'<tr><td>6</td><td>プレゼンテーション</td><td>TLS、暗号化、圧縮</td><td>データ形式と暗号化（TLS はここ）。</td></tr>'
  +'<tr><td>5</td><td>セッション</td><td>ログインセッション、RPC</td><td>セッションの開始・維持・終了。</td></tr>'
  +'<tr><td>4</td><td>トランスポート</td><td>TCP、UDP＋ポート番号</td><td>データを分割し、ポートで正しいプログラムへ届ける。</td></tr>'
  +'<tr><td>3</td><td>ネットワーク</td><td>IP、ICMP（ping）</td><td>IP アドレスとパケットのルーティング。</td></tr>'
  +'<tr><td>2</td><td>データリンク</td><td>Ethernet、MAC アドレス、ARP</td><td>同一 LAN 内を MAC アドレスで伝送。</td></tr>'
  +'<tr><td>1</td><td>物理</td><td>ケーブル、Wi-Fi、光信号</td><td>ビットが物理媒体を流れる。</td></tr></table>'
  +'<p><b>TCP と UDP の違い</b> — 第4層のこの判断はクラウド設計の随所に現れます：</p>'
  +'<table class="cmp"><tr><th style="width:22%"></th><th>TCP</th><th>UDP</th></tr>'
  +'<tr><td><b>接続</b></td><td>3ウェイハンドシェイク（SYN → SYN-ACK → ACK）後に送信</td><td>コネクションレス。送るだけ</td></tr>'
  +'<tr><td><b>信頼性</b></td><td>到達・順序を保証し、損失時は再送</td><td>保証なし — 損失・重複・順序入れ替わりあり</td></tr>'
  +'<tr><td><b>速度 / 遅延</b></td><td>制御の分だけ遅い</td><td>高速・低遅延</td></tr>'
  +'<tr><td><b>用途</b></td><td>Web（HTTP）、SSH、DB、メール</td><td>DNS、ライブ映像/音声、ゲーム、ストリーミング</td></tr></table>'
  +'<p><b>HTTP / HTTPS：</b>HTTP は Web の第7層プロトコルで、クライアントのリクエスト（GET/POST＋パス）に対しサーバーがステータスコード（200、404、500等）付きで応答します。HTTPS は HTTP を TLS の内側で運ぶもので、暗号化と証明書によるサーバー認証が加わります。</p>'],
 cloud:['EC2 mất internet — đừng đoán mò, đi đúng chuỗi tầng: (1) máy có IP chưa và đúng subnet không (tầng 3) → (2) route table của subnet có đường 0.0.0.0/0 chưa → (3) đường đó trỏ tới Internet Gateway hay NAT Gateway (gateway — cổng mặc định ra khỏi mạng) → (4) Security Group có cho phép chiều ra/về không (tầng 4, theo cổng) → (5) NACL (Network Access Control List — danh sách kiểm soát truy cập mạng) có chặn không → (6) cuối cùng mới là DNS (tầng 7): ping được IP nhưng không mở được tên miền thì lỗi nằm ở phân giải tên, không phải ở mạng. Chuỗi kiểm tra này được luyện lại ở trang Networking và trang Xử lý sự cố.',
        'EC2 がインターネットに出られない時、当てずっぽうではなく層の順に確認します：（1）IP があり正しいサブネットか（第3層）→（2）サブネットのルートテーブルに 0.0.0.0/0 があるか →（3）その宛先が Internet Gateway / NAT Gateway か →（4）Security Group が通信を許可しているか（第4層・ポート）→（5）NACL が遮断していないか →（6）最後に DNS（第7層）。IP へ ping が通るのに名前で開けないなら、問題は名前解決です。'],
 miss:[['“HTTPS là một giao thức hoàn toàn khác HTTP” — sai: HTTPS = HTTP + TLS; khác nhau ở lớp mã hoá và cổng mặc định (443 thay vì 80).','「HTTPS は HTTP と全く別のプロトコル」— 誤り。HTTPS ＝ HTTP ＋ TLS で、違いは暗号化層と既定ポート（443）です。'],
       ['“UDP không tin cậy nên không dùng cho việc quan trọng” — sai: DNS và hầu hết streaming đều chạy UDP vì độ trễ thấp; tầng ứng dụng tự xử lý phần cần tin cậy.','「UDP は信頼性がないので重要な用途に使えない」— 誤り。DNS やストリーミングは低遅延のため UDP を使い、必要な信頼性はアプリ層で担保します。'],
       ['“Ping không通 là server chết” — sai: ICMP thường bị firewall/Security Group chặn; ping tắc chỉ chứng minh ICMP không qua, không kết luận được TCP.','「ping が通らない＝サーバー停止」— 誤り。ICMP は遮断されがちで、ping 不通は TCP の可否を証明しません。']],
 links:[['#/networking','Sang trang Networking — VPC, route, bảo mật 2 lớp','ネットワーキングへ — VPC、ルート、2層のセキュリティ'],['#/troubleshooting','Sang trang Xử lý sự cố — luyện chuỗi debug này','トラブルシューティングへ — このデバッグ手順を演習']]},
{id:'ip', ic:'🔢',
 t:['IP Addressing — địa chỉ IP & CIDR','IP アドレッシング — IP と CIDR'],
 goal:['Đọc và tính được CIDR: một dải /24 có bao nhiêu IP dùng được, chia một VPC /16 thành các subnet không chồng lấn, và nhận ra ngay hai dải mạng có “đụng” nhau hay không — kỹ năng dùng mỗi ngày khi thiết kế VPC.',
       'CIDR を読み計算できるようになります：/24 の使用可能 IP 数、/16 の VPC を重ならないサブネットへ分割すること、2つのレンジが重なっているかの即断。VPC 設計で毎日使う技能です。'],
 body:['<p><b>IPv4</b> là số 32-bit viết thành 4 octet thập phân (vd 10.0.3.25). <b>CIDR (Classless Inter-Domain Routing — định tuyến liên miền không phân lớp)</b> viết dạng <span class="mono">10.0.0.0/16</span>: số sau “/” là số bit mạng — càng nhỏ dải càng lớn. Số IP trong dải = 2^(32 − prefix); trong AWS mỗi subnet bị giữ 5 IP (network, router .1, DNS .2, dự phòng .3, broadcast) nên /24 có 256 − 5 = <b>251 IP dùng được</b>.</p>'
  +'<table class="cmp"><tr><th style="width:30%">Dải</th><th style="width:22%">Tên gọi</th><th>Hay dùng cho</th></tr>'
  +'<tr><td class="mono">10.0.0.0/8</td><td>Private (RFC 1918)</td><td>Mạng nội bộ lớn — dải VPC phổ biến nhất trên AWS.</td></tr>'
  +'<tr><td class="mono">172.16.0.0/12</td><td>Private (RFC 1918)</td><td>Mặc định của Docker và nhiều mạng doanh nghiệp.</td></tr>'
  +'<tr><td class="mono">192.168.0.0/16</td><td>Private (RFC 1918)</td><td>Mạng nhà / văn phòng nhỏ, router gia đình.</td></tr>'
  +'<tr><td class="mono">0.0.0.0/0</td><td>Default route</td><td>“Mọi địa chỉ còn lại” — trong route table nghĩa là đường mặc định.</td></tr></table>'
  +'<p><b>Chia subnet</b> là mượn thêm bit: VPC 10.0.0.0/16 chia thành các subnet /24 → 10.0.1.0/24, 10.0.2.0/24… mỗi subnet 256 địa chỉ. Hai subnet chồng lấn nhau là lỗi thiết kế kinh điển khiến route mơ hồ và VPC Peering bị từ chối. <b>IPv6</b> dùng 128-bit (vd 2001:db8::/32), không còn NAT và broadcast; subnet VPC trên AWS luôn là /64 (2^64 địa chỉ — khỏi lo cạn IP).</p>',
       '<p><b>IPv4</b> は32ビットを4つの10進オクテットで表記します（例：10.0.3.25）。<b>CIDR</b> は <span class="mono">10.0.0.0/16</span> の形式で、「/」の後ろがネットワーク部のビット数。小さいほど範囲が広くなります。アドレス数 ＝ 2^(32 − プレフィックス)。AWS では各サブネットで5個（ネットワーク、ルーター .1、DNS .2、予約 .3、ブロードキャスト）が予約されるため、/24 の使用可能数は 256 − 5 ＝ <b>251</b> です。</p>'
  +'<table class="cmp"><tr><th style="width:30%">レンジ</th><th style="width:22%">呼称</th><th>主な用途</th></tr>'
  +'<tr><td class="mono">10.0.0.0/8</td><td>プライベート（RFC 1918）</td><td>大規模な内部ネットワーク — AWS の VPC で最も一般的。</td></tr>'
  +'<tr><td class="mono">172.16.0.0/12</td><td>プライベート（RFC 1918）</td><td>Docker の既定や多くの企業ネットワーク。</td></tr>'
  +'<tr><td class="mono">192.168.0.0/16</td><td>プライベート（RFC 1918）</td><td>家庭・小規模オフィス、家庭用ルーター。</td></tr>'
  +'<tr><td class="mono">0.0.0.0/0</td><td>デフォルトルート</td><td>「残り全部」— ルートテーブルでは既定の経路。</td></tr></table>'
  +'<p><b>サブネット分割</b>はビットをさらに借りること：VPC 10.0.0.0/16 を /24 に割ると 10.0.1.0/24、10.0.2.0/24…（各256アドレス）。サブネット同士の重なりは古典的な設計ミスで、ルートの曖昧さや VPC ピアリング拒否の原因になります。<b>IPv6</b> は128ビットで NAT もブロードキャストもなく、AWS の VPC サブネットは常に /64 です。</p>'],
 cloud:['Thiết kế VPC thật luôn bắt đầu từ CIDR: chọn /16 cho VPC để có dư địa chỉ, chia /24 cho mỗi tầng (Public / Private-App / Private-Data) × mỗi Availability Zone. Trang Networking của site có sẵn <b>công cụ tính CIDR & chia subnet</b> — nhập CIDR và số AZ là ra bảng subnet hoàn chỉnh, đúng quy ước vừa học.',
        '実際の VPC 設計は CIDR から始まります：VPC には /16 を確保し、AZ ごとに各層（Public / Private-App / Private-Data）へ /24 を割り当てます。本サイトのネットワーキングページには <b>CIDR 計算・サブネット分割ツール</b> があり、CIDR と AZ 数を入れるだけで割り当て表が完成します。'],
 miss:[['“/24 có 256 IP dùng hết được” — sai: trừ network + broadcast còn 254; trên AWS trừ thêm 3 IP dự trữ, còn 251.','「/24 は256個全部使える」— 誤り。ネットワークとブロードキャストを除き254、AWS ではさらに3個予約され251です。'],
       ['“Hai VPC trùng CIDR vẫn peering được nếu khác region” — sai: peering bị từ chối khi CIDR chồng lấn, bất kể region; phải tính chồng lấn ngay từ lúc chọn CIDR.','「CIDR が重なってもリージョンが違えばピアリングできる」— 誤り。重なる CIDR のピアリングはリージョン不問で拒否されます。'],
       ['“Subnet mask và prefix là hai khái niệm khác nhau” — chúng là hai cách viết của cùng một thứ: /24 ⇔ 255.255.255.0.','「サブネットマスクとプレフィックスは別物」— 同じものの2つの表記です：/24 ⇔ 255.255.255.0。']],
 links:[['#/networking','Dùng ngay công cụ tính CIDR ở trang Networking','ネットワーキングの CIDR 計算ツールを使う'],['#/diagrams','Xem sơ đồ Web 3 tầng — subnet được chia thế nào','3層 Web の図でサブネット分割を見る']]},
{id:'routing', ic:'🧭',
 t:['Routing — định tuyến','ルーティング'],
 goal:['Đọc hiểu một bảng định tuyến (routing table): gói tin tới địa chỉ X sẽ đi đường nào, vì sao “longest prefix match” quyết định, và default gateway là gì — nền để debug mọi lỗi “máy A không tới được máy B”.',
       'ルーティングテーブルを読めるようになります：宛先 X のパケットがどの経路を通るか、最長プレフィックス一致がなぜ決定的か、デフォルトゲートウェイとは何か。「A から B に届かない」障害の基盤です。'],
 body:['<p><b>Routing table</b> là bảng tra cứu của mỗi thiết bị mạng: mỗi dòng gồm <b>đích (destination CIDR)</b> → <b>đích đến tiếp theo (target / next hop)</b>. Khi nhiều dòng cùng khớp một địa chỉ, dòng có prefix <b>dài nhất (cụ thể nhất)</b> thắng — gọi là <b>longest prefix match</b>.</p>'
  +'<table class="cmp"><tr><th style="width:32%">Destination</th><th style="width:30%">Target</th><th>Đọc là</th></tr>'
  +'<tr><td class="mono">10.0.0.0/16</td><td class="mono">local</td><td>Trong cùng VPC — giao trực tiếp, không qua cổng nào.</td></tr>'
  +'<tr><td class="mono">10.1.0.0/16</td><td class="mono">pcx-0abc… (peering)</td><td>Sang VPC bên cạnh qua kết nối peering.</td></tr>'
  +'<tr><td class="mono">0.0.0.0/0</td><td class="mono">igw-… / nat-…</td><td>Mọi địa chỉ còn lại: ra Internet Gateway hoặc NAT Gateway.</td></tr></table>'
  +'<p><b>Static route</b> là route gõ tay — đơn giản, dễ kiểm soát, hợp hệ nhỏ; <b>dynamic routing</b> để các router tự trao đổi đường đi bằng BGP (Border Gateway Protocol — giao thức cổng biên), dùng trong Direct Connect / VPN / mạng lớn. <b>Default gateway</b> là “cửa ra” của một máy trong mạng cục bộ: đích nào không thuộc mạng của mình thì gửi hết cho gateway xử lý tiếp — trên AWS, router của VPC luôn ở địa chỉ .1 của mỗi subnet.</p>',
       '<p><b>ルーティングテーブル</b>は各ネットワーク機器の参照表で、各行は <b>宛先（destination CIDR）</b> → <b>次の転送先（target / next hop）</b> です。複数行が一致する場合は、プレフィックスが <b>最長（最も具体的）</b>の行が勝ちます — <b>最長プレフィックス一致</b>です。</p>'
  +'<table class="cmp"><tr><th style="width:32%">Destination</th><th style="width:30%">Target</th><th>意味</th></tr>'
  +'<tr><td class="mono">10.0.0.0/16</td><td class="mono">local</td><td>同じ VPC 内 — 直接配送。</td></tr>'
  +'<tr><td class="mono">10.1.0.0/16</td><td class="mono">pcx-0abc…（ピアリング）</td><td>ピアリング経由で隣の VPC へ。</td></tr>'
  +'<tr><td class="mono">0.0.0.0/0</td><td class="mono">igw-… / nat-…</td><td>残り全部：Internet Gateway または NAT Gateway へ。</td></tr></table>'
  +'<p><b>スタティックルート</b>は手入力の経路で、小規模向け。<b>ダイナミックルーティング</b>は BGP でルーター同士が経路を交換する方式で、Direct Connect / VPN / 大規模網で使います。<b>デフォルトゲートウェイ</b>は LAN 内のマシンの「出口」で、自分のネットワーク外の宛先はすべてゲートウェイへ渡します — AWS では各サブネットの .1 が VPC ルーターです。</p>'],
 cloud:['Trong VPC, “subnet là public hay private” không nằm ở subnet mà nằm ở <b>route table gắn với nó</b>: có route 0.0.0.0/0 → Internet Gateway thì là public; → NAT Gateway thì là private có internet chiều ra; không có route mặc định thì cách ly hoàn toàn. Rất nhiều sự cố “private subnet mất internet” chỉ là route trỏ sai NAT hoặc NAT nằm nhầm AZ — xem tình huống tương ứng ở trang Xử lý sự cố.',
        'VPC では「パブリックかプライベートか」はサブネット自体ではなく、<b>関連付いたルートテーブル</b>で決まります：0.0.0.0/0 → Internet Gateway ならパブリック、→ NAT Gateway ならプライベート（外向きのみ）、既定ルートなしなら完全分離。「プライベートサブネットがインターネットに出られない」障害の多くは、NAT へのルート誤りや NAT の AZ 違いです。'],
 miss:[['“Có hai route cùng tới một đích thì route nào cũng được áp dụng ngẫu nhiên” — sai: longest prefix match luôn thắng, route cụ thể hơn ghi đè route mặc định.','「同じ宛先のルートが2つあればランダムに選ばれる」— 誤り。最長プレフィックス一致が常に優先します。'],
       ['“Route 0.0.0.0/0 lúc nào cũng nghĩa là ra internet công cộng” — sai: phải xem target; 0.0.0.0/0 → NAT, → VPN, → Transit Gateway là những thiết kế hoàn toàn khác.','「0.0.0.0/0 は常に公共インターネット行き」— 誤り。ターゲット次第で NAT 行き、VPN 行き、Transit Gateway 行きと全く別の設計になります。'],
       ['“Default gateway của máy là địa chỉ .254” — chỉ là thói quen của một số mạng; trên AWS router ở .1, nơi khác có thể là bất kỳ địa chỉ nào trong subnet.','「ゲートウェイは .254」— 一部の慣習にすぎません。AWS では .1 ですし、場所により任意のアドレスです。']],
 links:[['#/networking','Đào sâu route table & Transit Gateway ở trang Networking','ネットワーキングでルートと Transit Gateway を深掘り'],['#/troubleshooting','Luyện tình huống “private subnet mất internet”','「プライベートサブネット断絶」の事例を演習']]},
{id:'dns', ic:'🏷️',
 t:['DNS — hệ thống tên miền','DNS — ドメインネームシステム'],
 goal:['Giải thích được chuyện gì xảy ra từ lúc gõ “shop.example.co.jp” tới lúc có IP để kết nối: các loại bản ghi, vai trò của resolver, và vì sao sửa DNS xong phải chờ TTL.',
       '「shop.example.co.jp」と入力してから接続先 IP が分かるまでの流れ（レコード種別、リゾルバの役割、変更後に TTL を待つ理由）を説明できるようになります。'],
 body:['<p><b>DNS (Domain Name System — hệ thống tên miền)</b> là “danh bạ” của Internet: dịch tên người đọc được thành địa chỉ IP. Mỗi tên miền chứa nhiều <b>bản ghi (record)</b>:</p>'
  +'<table class="cmp"><tr><th style="width:14%">Loại</th><th style="width:36%">Trỏ tới</th><th>Ví dụ / ghi chú</th></tr>'
  +'<tr><td><b>A</b></td><td>Địa chỉ IPv4</td><td class="mono">www → 203.0.113.10</td></tr>'
  +'<tr><td><b>AAAA</b></td><td>Địa chỉ IPv6</td><td>Tương tự A nhưng cho IPv6.</td></tr>'
  +'<tr><td><b>CNAME</b></td><td>Một <i>tên miền khác</i> (không phải IP)</td><td class="mono">blog → www.example.com</td></tr>'
  +'<tr><td><b>MX</b></td><td>Server nhận email + độ ưu tiên</td><td>Quyết định mail gửi tới example.com sẽ vào server nào.</td></tr>'
  +'<tr><td><b>NS</b></td><td>Nameserver có thẩm quyền của domain</td><td>Khai báo “ai là sổ gốc” của tên miền này.</td></tr>'
  +'<tr><td><b>PTR</b></td><td>Ngược: IP → tên miền</td><td>Phân giải ngược, dùng kiểm tra server gửi mail.</td></tr></table>'
  +'<p><b>Luồng phân giải:</b> trình duyệt → cache của máy / hệ điều hành → <b>resolver</b> (máy chủ phân giải đệ quy, thường của ISP hoặc 8.8.8.8 / 1.1.1.1) → nếu chưa có cache, resolver hỏi lần lượt root server → server của đuôi tên miền (TLD, vd .jp) → nameserver có thẩm quyền của domain → nhận IP và <b>cache lại theo TTL (Time To Live — thời gian sống của bản ghi, tính bằng giây)</b>. Chính TTL là lý do đổi DNS không có hiệu lực tức thì trên toàn cầu.</p>',
       '<p><b>DNS（Domain Name System）</b>はインターネットの「電話帳」で、人間向けの名前を IP アドレスへ変換します。各ドメインは複数の<b>レコード</b>を持ちます：</p>'
  +'<table class="cmp"><tr><th style="width:14%">種別</th><th style="width:36%">指すもの</th><th>例 / 注記</th></tr>'
  +'<tr><td><b>A</b></td><td>IPv4 アドレス</td><td class="mono">www → 203.0.113.10</td></tr>'
  +'<tr><td><b>AAAA</b></td><td>IPv6 アドレス</td><td>A の IPv6 版。</td></tr>'
  +'<tr><td><b>CNAME</b></td><td>別の<i>ドメイン名</i>（IP ではない）</td><td class="mono">blog → www.example.com</td></tr>'
  +'<tr><td><b>MX</b></td><td>メール受信サーバー＋優先度</td><td>example.com 宛メールの配送先を決めます。</td></tr>'
  +'<tr><td><b>NS</b></td><td>権威ネームサーバー</td><td>そのドメインの「原簿」が誰かを示します。</td></tr>'
  +'<tr><td><b>PTR</b></td><td>逆方向：IP → 名前</td><td>逆引き。メール送信サーバーの確認などに使用。</td></tr></table>'
  +'<p><b>名前解決の流れ：</b>ブラウザ → OS のキャッシュ → <b>リゾルバ</b>（再帰問い合わせを行うサーバー。ISP 提供や 8.8.8.8 / 1.1.1.1）→ キャッシュがなければルートサーバー → TLD（.jp 等）→ 権威ネームサーバーの順に問い合わせ、IP を得て <b>TTL（Time To Live：レコードの有効秒数）</b>の間キャッシュします。DNS 変更が即時に世界へ行き渡らないのは TTL のためです。</p>'],
 cloud:['Trên AWS là Route 53, trên Google Cloud là Cloud DNS — cả hai đều là nameserver có thẩm quyền cho domain của bạn. Bên trong VPC còn có resolver riêng: AWS cấp qua địa chỉ .2 của dải VPC (hoặc 169.254.169.253), GCP qua 169.254.169.254. EC2 “không phân giải được tên miền” trong khi ping IP vẫn thông là một trong 14 tình huống ở trang Xử lý sự cố.',
        'AWS では Route 53、Google Cloud では Cloud DNS が権威ネームサーバーです。VPC 内には専用リゾルバもあり、AWS は VPC レンジの .2（または 169.254.169.253）、GCP は 169.254.169.254。IP へ ping は通るのに名前解決できない EC2 は、トラブルシューティングページの14事例の一つです。'],
 miss:[['“CNAME trỏ thẳng vào địa chỉ IP cho nhanh” — sai: CNAME chỉ trỏ vào tên miền khác; trỏ IP phải dùng A/AAAA (trên Route 53 còn có Alias cho tài nguyên AWS).','「CNAME は IP を直接指せる」— 誤り。CNAME は別名へのみ。IP は A/AAAA（Route 53 には AWS リソース向け Alias もあり）。'],
       ['“Vừa sửa bản ghi DNS là cả thế giới thấy ngay” — sai: resolver khắp nơi vẫn giữ bản ghi cũ tới khi hết TTL; cắt giảm TTL phải làm <i>trước</i> ngày chuyển đổi.','「DNS を変えれば即座に世界へ反映」— 誤り。各リゾルバが TTL 切れまで旧レコードを保持します。TTL 短縮は切替日の前に行うのが鉄則。'],
       ['“DNS chạy trên TCP” — phần lớn truy vấn DNS chạy UDP cổng 53 vì nhanh; TCP chỉ dùng khi phản hồi lớn hoặc truyền dữ liệu giữa các nameserver.','「DNS は TCP」— 大半の問い合わせは高速な UDP 53 番。TCP は応答が大きい場合やゾーン転送で使います。']],
 links:[['#/networking','Route 53 & Cloud DNS trong trang Networking','ネットワーキングの Route 53 と Cloud DNS'],['#/troubleshooting','Luyện tình huống “DNS không phân giải được”','「DNS 解決できない」の事例を演習']]},
{id:'linux', ic:'🐧',
 t:['Linux — hệ điều hành máy chủ','Linux — サーバー OS'],
 goal:['Tự tin khi SSH vào một server Linux: biết file cấu hình và log nằm ở đâu, đọc được quyền rwx, kiểm tra một tiến trình/dịch vụ bằng systemd, và không làm hỏng hệ thống vì một lệnh chmod sai.',
       'Linux サーバーへ SSH して迷わない状態を目指します：設定ファイルとログの場所、rwx 権限の読み方、systemd でのプロセス/サービス確認、chmod ミスで壊さないこと。'],
 body:['<p>Hầu hết server cloud chạy Linux. Ba nhóm kỹ năng dùng hằng ngày:</p>'
  +'<p><b>1 · Filesystem (hệ thống tệp)</b> — mọi thứ là tệp, nằm trong cây thư mục gốc “/”:</p>'
  +'<table class="cmp"><tr><th style="width:22%">Đường dẫn</th><th>Chứa gì</th></tr>'
  +'<tr><td class="mono">/etc</td><td>File cấu hình của hệ thống và dịch vụ (vd /etc/ssh/sshd_config).</td></tr>'
  +'<tr><td class="mono">/var/log</td><td>Log: journal, nginx/access.log, secure… — nơi đầu tiên nhìn khi có sự cố.</td></tr>'
  +'<tr><td class="mono">/home/&lt;user&gt;</td><td>Thư mục nhà của từng user; khoá SSH nằm ở ~/.ssh/authorized_keys.</td></tr>'
  +'<tr><td class="mono">/usr, /bin</td><td>Chương trình và thư viện của hệ thống.</td></tr>'
  +'<tr><td class="mono">/tmp</td><td>Tệp tạm — bị dọn định kỳ, đừng lưu dữ liệu quan trọng.</td></tr></table>'
  +'<p><b>2 · Permissions (phân quyền)</b> — mỗi tệp có chủ (owner), nhóm (group) và “người khác” (others), mỗi nhóm có quyền <b>r</b>ead (đọc, 4), <b>w</b>rite (ghi, 2), e<b>x</b>ecute (thực thi / vào thư mục, 1). <span class="mono">chmod 644 file</span> = chủ đọc+ghi, còn lại chỉ đọc; thư mục web thường 755, khoá riêng SSH bắt buộc 600 — quyền lỏng hơn là SSH từ chối đăng nhập. <span class="mono">chown</span> đổi chủ sở hữu; <span class="mono">sudo</span> chạy một lệnh với quyền root có kiểm soát.</p>'
  +'<p><b>3 · Process & systemd (hệ thống quản lý dịch vụ)</b> — chương trình đang chạy gọi là process (tiến trình), mỗi cái có PID (Process ID — mã số tiến trình). Dịch vụ chạy nền do <b>systemd</b> quản lý: <span class="mono">systemctl status nginx</span> xem trạng thái, <span class="mono">systemctl restart nginx</span> khởi động lại, <span class="mono">journalctl -u nginx</span> đọc log của dịch vụ đó. <b>SSH (Secure Shell — giao thức đăng nhập từ xa an toàn)</b> dùng cặp khoá: khoá công khai đặt trên server (~/.ssh/authorized_keys), khoá riêng giữ ở máy bạn — mất khoá riêng = mất đường vào.</p>',
       '<p>クラウドサーバーの大半は Linux です。毎日使う3つの技能：</p>'
  +'<p><b>1 · ファイルシステム</b> — すべてがファイルで、ルート「/」の木構造に収まります：</p>'
  +'<table class="cmp"><tr><th style="width:22%">パス</th><th>中身</th></tr>'
  +'<tr><td class="mono">/etc</td><td>システムとサービスの設定（例：/etc/ssh/sshd_config）。</td></tr>'
  +'<tr><td class="mono">/var/log</td><td>ログ類。障害時に最初に見る場所。</td></tr>'
  +'<tr><td class="mono">/home/&lt;user&gt;</td><td>各ユーザーのホーム。SSH 鍵は ~/.ssh/authorized_keys。</td></tr>'
  +'<tr><td class="mono">/usr, /bin</td><td>システムのプログラムとライブラリ。</td></tr>'
  +'<tr><td class="mono">/tmp</td><td>一時ファイル — 定期的に消えるため重要データは置かない。</td></tr></table>'
  +'<p><b>2 · 権限（パーミッション）</b> — 各ファイルは所有者、グループ、その他の3区分を持ち、それぞれ <b>r</b>ead（4）、<b>w</b>rite（2）、e<b>x</b>ecute（1）の権限があります。<span class="mono">chmod 644</span> は所有者が読み書き可、他は読み取りのみ。Web ディレクトリは 755、SSH 秘密鍵は 600 が必須で、緩いと SSH がログインを拒否します。<span class="mono">chown</span> は所有者変更、<span class="mono">sudo</span> は制御された root 実行です。</p>'
  +'<p><b>3 · プロセスと systemd</b> — 実行中のプログラムはプロセスで、それぞれ PID を持ちます。常駐サービスは <b>systemd</b> が管理し、<span class="mono">systemctl status nginx</span> で状態確認、<span class="mono">restart</span> で再起動、<span class="mono">journalctl -u nginx</span> でそのサービスのログを読めます。<b>SSH</b> は鍵ペア方式で、公開鍵をサーバー側（~/.ssh/authorized_keys）に置き、秘密鍵は自分のマシンで厳重に保管します。</p>'],
 cloud:['SSH vào EC2 / Compute Engine chính là dùng đúng bộ kỹ năng này: kiểm tra dịch vụ web bằng systemctl, đọc /var/log khi trang trả lỗi 502, xem đĩa bằng df -h khi “đĩa đầy 100%”. Trang Luyện Command của site có terminal giả lập để gõ các lệnh này tới thuộc; trên AWS còn có Systems Manager Session Manager — đăng nhập không cần mở cổng 22, an toàn hơn SSH truyền thống.',
        'EC2 / Compute Engine への SSH はまさにこの技能の実践です：systemctl で Web サービス確認、502 の時は /var/log、ディスク満杯は df -h。本サイトのコマンド演習ページには模擬ターミナルがあります。AWS には Systems Manager Session Manager もあり、22番を開けずに安全にログインできます。'],
 miss:[['“chmod 777 cho nhanh, khỏi lo quyền” — thói quen nguy hiểm nhất của người mới: mọi user trên máy đều đọc/ghi/thực thi được, khoá SSH và file cấu hình bị nới lỏng còn làm dịch vụ từ chối chạy.','「面倒だから chmod 777」— 最も危険な初心者習慣。全ユーザーが読み書き実行でき、SSH 鍵や設定が緩むとサービス側が起動を拒否することもあります。'],
       ['“Cứ kill -9 mọi tiến trình treo” — kill -9 không cho tiến trình dọn dẹp (đóng file, ghi nốt dữ liệu); hãy SIGTERM (kill thường) trước, -9 là lựa chọn cuối.','「固まったら kill -9」— kill -9 は後片付け（ファイル close、書き込み完了）をさせません。まず通常の kill（SIGTERM）、-9 は最終手段。'],
       ['“Đăng nhập root trực tiếp cho tiện” — chuẩn vận hành là user thường + sudo từng lệnh: có vết (audit), thu hồi được, và tránh một lệnh gõ nhầm phá cả hệ thống.','「root で直接ログインすれば楽」— 運用の標準は通常ユーザー＋コマンドごとの sudo。監査証跡が残り、誤操作の被害も抑えられます。']],
 links:[['#/command','Luyện các lệnh này ở trang Luyện Command','コマンド演習でこれらのコマンドを練習'],['#/labs','Làm lab dựng web server trên EC2','EC2 に Web サーバーを立てるラボ']]}
];
CH.push(
{id:'win', ic:'🪟',
 t:['Windows Server & Active Directory — mức nền tảng','Windows Server と Active Directory — 基礎'],
 goal:['Hiểu các khái niệm cốt lõi của hạ tầng doanh nghiệp Windows: AD DS là gì, vì sao DNS và DHCP là hai “mạch máu” của domain, GPO dùng để làm gì, và domain join thực chất xác thực điều gì. Chương này ở mức khái niệm nền tảng — phần Hybrid Cloud & Active Directory chuyên sâu (kết nối on-premise ⇄ cloud, replication, federation) sẽ là một module riêng ở giai đoạn sau.',
       'Windows 企業インフラの中核概念を理解します：AD DS とは何か、なぜ DNS と DHCP がドメインの「血管」なのか、GPO の用途、ドメイン参加で実際に何が認証されるか。本章は概念の基礎までで、ハイブリッド AD の専門内容は後段のモジュールで扱います。'],
 body:['<p><b>AD DS (Active Directory Domain Services — dịch vụ miền Active Directory)</b> là hệ thống quản lý danh tính của doanh nghiệp Windows: một cơ sở dữ liệu tập trung chứa user, máy tính, nhóm quyền, được quản lý bởi các máy chủ gọi là <b>DC (Domain Controller — máy chủ điều khiển miền)</b>. Đăng nhập một lần vào domain là dùng được mọi tài nguyên trong domain — đó là tiền thân của mọi hệ thống SSO (Single Sign-On — đăng nhập một lần) ngày nay.</p>'
  +'<table class="cmp"><tr><th style="width:24%">Thành phần</th><th>Vai trò</th></tr>'
  +'<tr><td><b>Domain</b></td><td>Đơn vị quản trị, vd corp.example.co.jp — máy và user “thuộc” một domain.</td></tr>'
  +'<tr><td><b>OU (Organizational Unit — đơn vị tổ chức)</b></td><td>Thư mục con để gom user/máy theo phòng ban, chi nhánh — đơn vị áp chính sách.</td></tr>'
  +'<tr><td><b>DNS trong AD</b></td><td>AD <i>sống nhờ</i> DNS: máy trạm tìm DC bằng bản ghi SRV trong DNS nội bộ. DNS sai = không tìm thấy domain.</td></tr>'
  +'<tr><td><b>DHCP (Dynamic Host Configuration Protocol — giao thức cấp cấu hình động)</b></td><td>Tự cấp cho máy trạm: địa chỉ IP, subnet mask, gateway, và quan trọng nhất — địa chỉ DNS server (phải trỏ về DC).</td></tr>'
  +'<tr><td><b>GPO (Group Policy Object — đối tượng chính sách nhóm)</b></td><td>Gói chính sách áp tập trung xuống user/máy: bắt đổi mật khẩu, cấm USB, map ổ mạng, cài phần mềm…</td></tr></table>'
  +'<p><b>Domain join</b> là thao tác “nhập hộ khẩu” một máy vào domain: điều kiện tiên quyết là máy phải phân giải và liên lạc được DC — tức DNS của máy phải trỏ về DNS nội bộ của domain. Sau khi join, máy có tài khoản riêng trong AD, user domain đăng nhập được, và GPO bắt đầu áp xuống theo lịch (mặc định khoảng 90 phút, hoặc ép ngay bằng <span class="mono">gpupdate /force</span>).</p>',
       '<p><b>AD DS（Active Directory Domain Services）</b>は Windows 企業環境の ID 管理基盤で、ユーザー・コンピュータ・グループを一元管理するデータベースを <b>DC（ドメインコントローラー）</b>が保持します。ドメインへ一度ログインすれば全リソースが使える仕組みは、現代の SSO（シングルサインオン）の原型です。</p>'
  +'<table class="cmp"><tr><th style="width:24%">要素</th><th>役割</th></tr>'
  +'<tr><td><b>ドメイン</b></td><td>管理の単位（例：corp.example.co.jp）。マシンとユーザーが「所属」します。</td></tr>'
  +'<tr><td><b>OU（組織単位）</b></td><td>部門・拠点ごとにユーザー/マシンをまとめる入れ物。ポリシー適用の単位。</td></tr>'
  +'<tr><td><b>AD における DNS</b></td><td>AD は DNS で「生きて」います：端末は内部 DNS の SRV レコードで DC を探します。DNS が壊れればドメインが見つかりません。</td></tr>'
  +'<tr><td><b>DHCP</b></td><td>端末へ IP、サブネットマスク、ゲートウェイ、そして最重要な DNS サーバー（DC を指す）を自動配布。</td></tr>'
  +'<tr><td><b>GPO（グループポリシー）</b></td><td>パスワード強制、USB 禁止、ドライブマッピング、ソフト配布などを一元適用するポリシーの塊。</td></tr></table>'
  +'<p><b>ドメイン参加</b>はマシンをドメインに「住民登録」する操作で、前提条件は DC へ到達できること — つまり端末の DNS がドメインの内部 DNS を向いていることです。参加後はマシンアカウントが AD に作られ、ドメインユーザーがログインでき、GPO が定期（既定約90分、<span class="mono">gpupdate /force</span> で即時）適用されます。</p>'],
 cloud:['Doanh nghiệp Nhật dùng Windows Server + AD rất phổ biến, và khi lên cloud câu hỏi đầu tiên luôn là “AD thì sao?”. AWS có AWS Managed Microsoft AD, GCP có Managed Service for Microsoft AD — dịch vụ DC được quản lý sẵn để EC2/VM join vào. Nhưng dù managed hay tự dựng, nguyên lý không đổi: máy join domain được hay không quyết định bởi DNS — đúng bài học của chương này.',
        '日本の企業では Windows Server ＋ AD が広く使われ、クラウド移行時の最初の質問は常に「AD はどうするのか」です。AWS には AWS Managed Microsoft AD、GCP には Managed Service for Microsoft AD があります。マネージドでも自前でも原理は同じで、ドメイン参加の成否は DNS が決めます。'],
 miss:[['“Join domain chỉ cần điền đúng IP của DC” — sai: join đi qua DNS (tìm DC bằng bản ghi SRV); DNS của máy trỏ ra 8.8.8.8 là join thất bại dù ping tới DC vẫn thông.','「ドメイン参加は DC の IP が合えばよい」— 誤り。参加は DNS（SRV レコードで DC 検索）を経由します。DNS が 8.8.8.8 を向いていれば、DC へ ping が通っても参加は失敗します。'],
       ['“Sửa GPO xong là máy nhận ngay” — sai: GPO áp theo chu kỳ nền (~90 phút cộng ngẫu nhiên) hoặc khi đăng nhập/khởi động tuỳ loại chính sách; muốn ngay thì gpupdate /force.','「GPO を直せば即反映」— 誤り。GPO は約90分の背景サイクルやログオン/起動時に適用されます。即時は gpupdate /force。'],
       ['“DHCP chỉ cấp địa chỉ IP” — thiếu: DHCP cấp cả gói cấu hình (gateway, DNS server, domain suffix); cấp sai DNS trong DHCP là nguyên nhân số 1 của lỗi join domain hàng loạt.','「DHCP は IP を配るだけ」— 不十分。ゲートウェイ、DNS、ドメインサフィックスまで配布します。DHCP の DNS 誤配布はドメイン参加障害の最大原因です。']],
 links:[['#/migration','Xem các kịch bản Migration có hệ Windows','Windows を含む移行シナリオを見る'],['#/services','Tra service AD được quản lý trong trang Services','サービス一覧でマネージド AD を調べる']]},
{id:'virt', ic:'🧊',
 t:['Virtualization — ảo hoá','仮想化'],
 goal:['Hiểu máy ảo (VM) thực chất là gì: hypervisor đứng ở đâu, loại 1 khác loại 2 thế nào, vCPU/RAM/disk ảo được cấp từ tài nguyên thật ra sao, và snapshot khác backup ở điểm sống còn nào.',
       '仮想マシン（VM）の実体を理解します：ハイパーバイザーの位置、タイプ1と2の違い、vCPU/RAM/仮想ディスクが物理資源からどう切り出されるか、スナップショットとバックアップの決定的な違い。'],
 body:['<p><b>Hypervisor</b> là lớp phần mềm nằm giữa phần cứng thật và các máy ảo, chia CPU/RAM/disk thật thành nhiều phần ảo độc lập — mỗi VM tưởng mình có máy riêng.</p>'
  +'<table class="cmp"><tr><th style="width:20%"></th><th>Type 1 (bare-metal)</th><th>Type 2 (hosted)</th></tr>'
  +'<tr><td><b>Vị trí</b></td><td>Chạy thẳng trên phần cứng, không qua OS trung gian</td><td>Chạy như một ứng dụng trên Windows/macOS</td></tr>'
  +'<tr><td><b>Ví dụ</b></td><td>VMware ESXi, Microsoft Hyper-V (bản server), KVM, AWS Nitro</td><td>VirtualBox, VMware Workstation trên laptop</td></tr>'
  +'<tr><td><b>Dùng cho</b></td><td>Data center và cloud — hiệu năng, ổn định, bảo mật</td><td>Học tập, test trên máy cá nhân</td></tr></table>'
  +'<p><b>Giải phẫu một VM:</b> <b>vCPU</b> là phần thời gian CPU thật được chia (thường 1 vCPU = 1 luồng xử lý — hyperthread — chứ không phải 1 core vật lý nguyên vẹn); <b>RAM</b> là dung lượng bộ nhớ dành riêng; <b>disk</b> thường là một <i>tệp ảnh</i> trên storage (VMDK, VHDX…) nên VM di chuyển được giữa các host. <b>Snapshot</b> là “chụp nhanh” trạng thái VM tại một thời điểm để quay lui khi thử nghiệm — nhưng snapshot sống dựa trên đĩa gốc và chuỗi snapshot dài làm chậm máy, nên snapshot <b>không phải backup</b>: backup là bản sao độc lập, sống sót được kể cả khi VM và host gốc cháy.</p>',
       '<p><b>ハイパーバイザー</b>は物理ハードウェアと仮想マシンの間に立つソフトウェア層で、実 CPU/RAM/ディスクを独立した仮想の部分へ切り分けます — 各 VM は自分のマシンがあると思っています。</p>'
  +'<table class="cmp"><tr><th style="width:20%"></th><th>タイプ1（ベアメタル）</th><th>タイプ2（ホスト型）</th></tr>'
  +'<tr><td><b>位置</b></td><td>ハードウェア上で直接動作（中間 OS なし）</td><td>Windows/macOS 上のアプリとして動作</td></tr>'
  +'<tr><td><b>例</b></td><td>VMware ESXi、Hyper-V（サーバー版）、KVM、AWS Nitro</td><td>VirtualBox、ノート PC の VMware Workstation</td></tr>'
  +'<tr><td><b>用途</b></td><td>データセンターとクラウド — 性能・安定性・安全性</td><td>学習・個人マシンでのテスト</td></tr></table>'
  +'<p><b>VM の中身：</b><b>vCPU</b> は実 CPU 時間の取り分（通常 1 vCPU ＝ 1 論理スレッドであり、物理コア1個そのものではありません）。<b>RAM</b> は割り当てられたメモリ量。<b>ディスク</b>はストレージ上の<i>イメージファイル</i>であることが多く、だから VM はホスト間を移動できます。<b>スナップショット</b>は時点の状態を撮る巻き戻し用機能ですが、元ディスクに依存し、長く保持すると性能も落ちます。つまりスナップショットは<b>バックアップではありません</b> — バックアップは元が失われても残る独立した複製です。</p>'],
 cloud:['EC2 và Compute Engine chính là VM trên hypervisor type 1: AWS dùng Nitro, GCP dùng hạ tầng dựa trên KVM. Chọn instance type (t3.micro, e2-medium…) chính là chọn gói vCPU/RAM ảo. Hiểu snapshot ở đây giúp phân biệt đúng với EBS snapshot / Persistent Disk snapshot trên cloud — vẫn là ảnh chụp tại thời điểm, muốn an toàn dữ liệu phải có chiến lược backup riêng (xem phần Architect).',
        'EC2 と Compute Engine はそのままタイプ1ハイパーバイザー上の VM です：AWS は Nitro、GCP は KVM ベース。インスタンスタイプ（t3.micro、e2-medium 等）を選ぶことは vCPU/RAM の仮想パッケージを選ぶこと。ここでの理解が、クラウドの EBS / Persistent Disk スナップショットと「本当のバックアップ戦略」の切り分けにつながります。'],
 miss:[['“Snapshot giữ lâu dài thay backup được” — sai và nguy hiểm: snapshot phụ thuộc chuỗi đĩa gốc, host/VM gốc mất là mất theo; backup phải là bản sao độc lập, có kiểm tra khôi phục.','「スナップショットを長期保存すればバックアップ代わり」— 誤りで危険です。スナップショットは元ディスク連鎖に依存します。バックアップは独立した複製で、復元テストまで必要です。'],
       ['“1 vCPU = 1 core vật lý” — thường 1 vCPU chỉ là 1 hyperthread (nửa core vật lý); so hiệu năng giữa các dòng instance phải nhìn cả kiến trúc CPU.','「1 vCPU ＝ 物理1コア」— 通常 1 vCPU は1ハイパースレッド（物理コアの半分相当）。性能比較は CPU アーキテクチャも見る必要があります。'],
       ['“VM và container là một” — khác nền tảng: VM ảo hoá cả máy (có OS riêng), container chia sẻ kernel của host nên nhẹ và khởi động nhanh hơn nhiều — Docker/Kubernetes học sâu ở trang IaC.','「VM とコンテナは同じ」— 別物です。VM は OS ごと仮想化し、コンテナはホストのカーネルを共有するため軽く高速に起動します。']],
 links:[['#/services','Xem các dòng EC2 / Compute Engine trong trang Services','サービス一覧で EC2 / Compute Engine を見る'],['#/iac','Sang trang IaC — nơi VM nhường sân cho container','IaC ページへ — コンテナの世界へ']]},
{id:'db', ic:'🗄️',
 t:['Database — cơ sở dữ liệu','データベース'],
 goal:['Nắm các khái niệm tối thiểu để làm việc với database trong cloud: bảng/khoá/index, 4 lệnh SQL cơ bản, MySQL khác PostgreSQL ở đâu, và hai cơ chế sống còn — backup và replication — thực sự bảo vệ điều gì.',
       'クラウドでデータベースを扱う最小限の概念を押さえます：表・キー・インデックス、基本 SQL 4コマンド、MySQL と PostgreSQL の違い、そして生命線であるバックアップとレプリケーションが実際に何を守るか。'],
 body:['<p>Database quan hệ (relational database) tổ chức dữ liệu thành <b>bảng (table)</b> gồm hàng (row) và cột (column). Mỗi bảng có <b>khoá chính (primary key)</b> định danh mỗi hàng; <b>index (chỉ mục)</b> là cấu trúc phụ giúp tìm nhanh — như mục lục của sách: tra cứu nhanh hơn nhiều nhưng mỗi index làm ghi dữ liệu chậm đi một chút. Ngôn ngữ thao tác là <b>SQL (Structured Query Language — ngôn ngữ truy vấn có cấu trúc)</b>:</p>'
  +'<table class="cmp"><tr><th style="width:18%">Lệnh</th><th style="width:34%">Việc</th><th>Ví dụ</th></tr>'
  +'<tr><td class="mono">SELECT</td><td>Đọc dữ liệu</td><td class="mono">SELECT * FROM users WHERE id = 5;</td></tr>'
  +'<tr><td class="mono">INSERT</td><td>Thêm hàng mới</td><td class="mono">INSERT INTO users(name) VALUES (\'An\');</td></tr>'
  +'<tr><td class="mono">UPDATE</td><td>Sửa hàng đã có</td><td class="mono">UPDATE users SET name=\'Bình\' WHERE id = 5;</td></tr>'
  +'<tr><td class="mono">DELETE</td><td>Xoá hàng</td><td class="mono">DELETE FROM users WHERE id = 5;</td></tr></table>'
  +'<p class="mono" style="font-size:12.5px;color:var(--ink2)">⚠ UPDATE / DELETE quên WHERE = sửa / xoá <b>toàn bộ bảng</b> — tai nạn kinh điển, luôn viết WHERE trước rồi mới điền phần còn lại.</p>'
  +'<p><b>MySQL và PostgreSQL</b> là hai engine mã nguồn mở phổ biến nhất: MySQL thiên về đơn giản, tốc độ đọc/ghi thông thường, hệ sinh thái web lâu đời; PostgreSQL mạnh về truy vấn phức tạp, tính năng nâng cao (JSON, mở rộng địa lý PostGIS) và chuẩn SQL chặt chẽ. Trên cloud cả hai đều có bản managed: RDS / Aurora của AWS và Cloud SQL / AlloyDB của GCP.</p>'
  +'<p><b>Backup</b> là bản sao dữ liệu tại một thời điểm để khôi phục khi xoá nhầm / hỏng dữ liệu / ransomware — khôi phục điểm thời gian (PITR, Point-In-Time Recovery) cho phép quay về bất kỳ giây nào trong cửa sổ lưu trữ. <b>Replication (nhân bản)</b> là sao chép liên tục sang một bản phụ (replica) để: đọc mở rộng (read replica) và/hoặc dự phòng chuyển đổi khi bản chính chết — nhưng replica sao chép cả lệnh xoá nhầm, nên replication <b>không thay được backup</b>.</p>',
       '<p>リレーショナルデータベースはデータを<b>表（テーブル）</b>（行と列）で管理します。各表には行を一意に識別する<b>主キー</b>があり、<b>インデックス</b>は本の目次のように検索を高速化する代わりに書き込みを少し遅くします。操作言語は <b>SQL</b>です：</p>'
  +'<table class="cmp"><tr><th style="width:18%">コマンド</th><th style="width:34%">操作</th><th>例</th></tr>'
  +'<tr><td class="mono">SELECT</td><td>読み取り</td><td class="mono">SELECT * FROM users WHERE id = 5;</td></tr>'
  +'<tr><td class="mono">INSERT</td><td>行の追加</td><td class="mono">INSERT INTO users(name) VALUES (\'An\');</td></tr>'
  +'<tr><td class="mono">UPDATE</td><td>既存行の更新</td><td class="mono">UPDATE users SET name=\'Bình\' WHERE id = 5;</td></tr>'
  +'<tr><td class="mono">DELETE</td><td>行の削除</td><td class="mono">DELETE FROM users WHERE id = 5;</td></tr></table>'
  +'<p class="mono" style="font-size:12.5px;color:var(--ink2)">⚠ WHERE を忘れた UPDATE / DELETE は<b>表全体</b>を書き換え/削除します — 古典的事故。まず WHERE を書く癖を。</p>'
  +'<p><b>MySQL と PostgreSQL</b>は代表的なオープンソースエンジンです：MySQL はシンプルさと Web の実績、PostgreSQL は複雑なクエリや高度な機能（JSON、PostGIS）と厳密な SQL 準拠が強み。クラウドでは AWS の RDS / Aurora、GCP の Cloud SQL / AlloyDB がマネージド版です。</p>'
  +'<p><b>バックアップ</b>は時点のコピーで、誤削除・破損・ランサムウェアから復旧します（PITR：保持期間内の任意の秒へ復旧可能）。<b>レプリケーション</b>は副系（レプリカ）へ継続的に複製し、読み取り拡張とフェイルオーバーに使いますが、誤った削除も複製してしまうため、レプリケーションは<b>バックアップの代わりにはなりません</b>。</p>'],
 cloud:['“RDS hết connection” là tình huống vận hành kinh điển: mỗi kết nối tốn RAM trên instance, giới hạn theo cỡ máy (max_connections), và ứng dụng mở kết nối không đóng sẽ cạn dần — xem tình huống đầy đủ ở trang Xử lý sự cố. Hiểu backup/replication ở chương này cũng là điều kiện tiên quyết để học Multi-AZ, PITR và chiến lược DR (Disaster Recovery — khôi phục sau thảm hoạ) ở phần Architect.',
        '「RDS の接続枯渇」は古典的な運用障害です：接続ごとにインスタンスのメモリを消費し、上限（max_connections）はマシンサイズ依存。アプリが接続を閉じなければ徐々に枯渇します — 詳細はトラブルシューティングページで。バックアップ/レプリケーションの理解は、Architect 部で Multi-AZ、PITR、DR を学ぶ前提条件でもあります。'],
 miss:[['“Bật replication rồi thì khỏi cần backup” — sai: lệnh DELETE/DROP nhầm được nhân bản sang replica trong vài mili-giây; chỉ backup/PITR mới cứu được.','「レプリケーションがあればバックアップ不要」— 誤り。誤った DELETE/DROP は数ミリ秒でレプリカへ伝播します。救えるのはバックアップ/PITR だけです。'],
       ['“Càng nhiều index càng nhanh” — sai: index tăng tốc độ đọc nhưng mỗi lần INSERT/UPDATE phải cập nhật mọi index; index vô tội vạ làm ghi chậm và tốn dung lượng.','「インデックスは多いほど速い」— 誤り。読み取りは速くなりますが、書き込み時に全インデックスを更新するため、無闇に増やすと書き込みが遅くなり容量も食います。'],
       ['“Backup xong là yên tâm” — backup chưa từng test khôi phục thì chỉ là hy vọng; vận hành chuẩn là restore thử định kỳ và đo thời gian khôi phục thật.','「バックアップを取れば安心」— 復元テストをしていないバックアップは希望にすぎません。定期的な復元演習と実時間の計測が運用の標準です。']],
 links:[['#/labs','Làm lab database managed (RDS / Cloud SQL)','マネージド DB のラボを行う'],['#/troubleshooting','Luyện tình huống “RDS hết connection”','「RDS 接続枯渇」の事例を演習']]},
{id:'script', ic:'⌨️',
 t:['Scripting — Bash, PowerShell, Python','スクリプティング — Bash、PowerShell、Python'],
 goal:['Biết chọn đúng công cụ cho đúng việc: việc hệ thống trên Linux dùng Bash, quản trị Windows dùng PowerShell, tự động hoá có logic thì Python — và đọc được một script ngắn mà không sợ.',
       '仕事に合ったツールを選べるようになります：Linux のシステム作業は Bash、Windows 管理は PowerShell、ロジックのある自動化は Python。そして短いスクリプトを怖がらず読めること。'],
 body:['<table class="cmp"><tr><th style="width:20%">Công cụ</th><th style="width:30%">Môi trường nhà</th><th>Dùng khi nào + ví dụ rất ngắn</th></tr>'
  +'<tr><td><b>Bash</b></td><td>Linux, macOS</td><td>Việc hệ thống, nối các lệnh bằng pipe. Vd: kiểm tra đĩa rồi ghi log:<br><span class="mono">df -h / &gt;&gt; /var/log/disk.log</span></td></tr>'
  +'<tr><td><b>PowerShell</b></td><td>Windows Server</td><td>Quản trị Windows/AD, thao tác theo đối tượng (object) thay vì text. Vd: liệt kê dịch vụ đang chạy:<br><span class="mono">Get-Service | Where-Object Status -eq \'Running\'</span></td></tr>'
  +'<tr><td><b>Python</b></td><td>Mọi nền tảng</td><td>Tự động hoá có điều kiện/vòng lặp/xử lý dữ liệu, gọi API cloud (boto3 / google-cloud). Vd: in 3 số đầu:<br><span class="mono">for i in range(3): print(i)</span></td></tr></table>'
  +'<p>Quy tắc chọn nhanh: <b>thao tác OS thuần → shell của OS đó; cần logic, xử lý lỗi, gọi API → Python</b>. Ba lỗi người mới hay gặp ở cả ba ngôn ngữ: hardcode mật khẩu/access key ngay trong script (phải lấy từ biến môi trường hoặc Secrets Manager), không kiểm tra mã lỗi sau mỗi lệnh (script “chạy hết” dù bước giữa đã sập), và script chạy ngon ở máy mình nhưng lên server thì lỗi vì khác quyền, khác đường dẫn, hoặc file bị dính ký tự xuống dòng kiểu Windows (CRLF) khiến Bash báo lỗi khó hiểu.</p>',
       '<table class="cmp"><tr><th style="width:20%">ツール</th><th style="width:30%">本拠地</th><th>用途＋最小例</th></tr>'
  +'<tr><td><b>Bash</b></td><td>Linux、macOS</td><td>システム作業、パイプでコマンド連結。例：ディスク確認をログへ：<br><span class="mono">df -h / &gt;&gt; /var/log/disk.log</span></td></tr>'
  +'<tr><td><b>PowerShell</b></td><td>Windows Server</td><td>Windows/AD 管理。テキストでなくオブジェクトを扱う。例：実行中サービス一覧：<br><span class="mono">Get-Service | Where-Object Status -eq \'Running\'</span></td></tr>'
  +'<tr><td><b>Python</b></td><td>全プラットフォーム</td><td>条件分岐・ループ・データ処理・クラウド API（boto3 等）。例：<br><span class="mono">for i in range(3): print(i)</span></td></tr></table>'
  +'<p>早見の原則：<b>OS の素の操作 → その OS のシェル、ロジックや API 呼び出し → Python</b>。初心者の共通ミスは3つ：スクリプトへパスワード/キーを直書き（環境変数や Secrets Manager から取る）、各コマンドの終了コード未確認（途中が失敗しても「完走」してしまう）、自分のマシンでは動くのにサーバーで権限・パス・改行コード（CRLF）の違いで失敗すること。</p>'],
 cloud:['Script xuất hiện khắp cloud: <b>user data</b> của EC2 là một script Bash/PowerShell chạy một lần khi máy khởi động lần đầu để tự cài đặt; Lambda phần lớn viết bằng Python; và mọi tác vụ vận hành lặp lại (xoá snapshot cũ, kiểm tra tag…) đều nên thành script thay vì bấm tay. Trang Luyện Command là nơi gõ các lệnh nền cho Bash trước khi viết script hoàn chỉnh.',
        'スクリプトはクラウドの随所にあります：EC2 の<b>ユーザーデータ</b>は初回起動時に一度だけ走る Bash/PowerShell スクリプトで自動セットアップを行い、Lambda は Python が主流、繰り返し運用作業（古いスナップショット削除、タグ検査等）は手作業でなくスクリプト化すべきです。コマンド演習ページで Bash の基礎コマンドをまず体に覚えさせましょう。'],
 miss:[['“Script chạy được ở máy mình thì đưa lên server chắc chắn chạy” — sai: khác user/quyền, khác thư mục làm việc, thiếu biến môi trường và CRLF là 4 nguyên nhân quen thuộc; luôn test trong môi trường giống server.','「自分のマシンで動けばサーバーでも動く」— 誤り。ユーザー/権限、作業ディレクトリ、環境変数不足、CRLF が常連の原因です。サーバー同等環境でテストを。'],
       ['“Để sẵn mật khẩu trong script cho tiện, file này chỉ mình xem” — sai: script sớm muộn cũng vào Git, vào log, vào tay người khác; bí mật phải nằm ở Secrets Manager / biến môi trường.','「パスワードをスクリプトに書いておけば楽」— 誤り。スクリプトはいずれ Git やログや他人の手に渡ります。秘密は Secrets Manager / 環境変数へ。']],
 links:[['#/command','Luyện lệnh nền ở trang Luyện Command','コマンド演習で基礎コマンドを練習'],['#/iac','Từ script lên IaC — Terraform ở trang IaC','スクリプトから IaC へ — IaC ページの Terraform']]},
{id:'git', ic:'🌿',
 t:['Git — quản lý phiên bản','Git — バージョン管理'],
 goal:['Hiểu vòng đời thay đổi trong Git — sửa ở working tree, commit, push, mở pull request, merge — đủ để làm việc nhóm bằng code và đọc được lịch sử của một dự án hạ tầng (IaC).',
       'Git における変更のライフサイクル（作業ツリーで編集 → コミット → プッシュ → プルリクエスト → マージ）を理解し、チームでのコード作業とインフラ（IaC）プロジェクトの履歴読み取りができるようになります。'],
 body:['<p><b>Git</b> là hệ quản lý phiên bản phân tán: mỗi máy có một <b>repository (repo — kho chứa)</b> đầy đủ gồm code + toàn bộ lịch sử thay đổi. Năm khái niệm cốt lõi:</p>'
  +'<table class="cmp"><tr><th style="width:22%">Khái niệm</th><th>Nghĩa</th></tr>'
  +'<tr><td><b>Commit</b></td><td>Một “ảnh chụp” thay đổi kèm lời nhắn — đơn vị nhỏ nhất của lịch sử. Commit chỉ nằm ở máy bạn cho tới khi push.</td></tr>'
  +'<tr><td><b>Branch (nhánh)</b></td><td>Dòng phát triển độc lập: làm tính năng trên nhánh riêng, không đụng nhánh chính (main) đang ổn định.</td></tr>'
  +'<tr><td><b>Merge (gộp)</b></td><td>Đưa thay đổi từ nhánh này vào nhánh khác; khi hai bên sửa cùng một chỗ sẽ sinh conflict (xung đột) phải giải quyết tay.</td></tr>'
  +'<tr><td><b>Pull Request (PR)</b></td><td>Đề xuất gộp nhánh kèm thảo luận + review trên GitHub/GitLab — cổng kiểm soát chất lượng trước khi vào main.</td></tr>'
  +'<tr><td><b>Remote</b></td><td>Bản repo trên máy chủ (GitHub…) — push lên để đồng bộ, pull xuống để nhận thay đổi của người khác.</td></tr></table>'
  +'<p class="mono" style="font-size:12.8px;line-height:1.9">git clone &lt;url&gt; · git status · git add . · git commit -m "msg" · git push<br>git checkout -b feature/x · git pull · git merge feature/x</p>'
  +'<p>Luồng làm việc chuẩn của nhóm: tạo nhánh từ main → commit từng bước nhỏ, lời nhắn rõ nghĩa → push → mở PR → đồng đội review → merge vào main → hệ CI/CD (Continuous Integration / Continuous Delivery — tích hợp và bàn giao liên tục) tự triển khai.</p>',
       '<p><b>Git</b> は分散型バージョン管理システムで、各マシンがコードと全履歴を持つ<b>リポジトリ</b>を保持します。中核の5概念：</p>'
  +'<table class="cmp"><tr><th style="width:22%">概念</th><th>意味</th></tr>'
  +'<tr><td><b>コミット</b></td><td>変更の「スナップショット」とメッセージ — 履歴の最小単位。プッシュするまで自分のマシン内のみ。</td></tr>'
  +'<tr><td><b>ブランチ</b></td><td>独立した開発ライン。安定した main を汚さず機能開発できます。</td></tr>'
  +'<tr><td><b>マージ</b></td><td>あるブランチの変更を別のブランチへ取り込むこと。同じ箇所の競合は手で解決します。</td></tr>'
  +'<tr><td><b>プルリクエスト（PR）</b></td><td>議論とレビュー付きのマージ提案 — main へ入る前の品質ゲート。</td></tr>'
  +'<tr><td><b>リモート</b></td><td>サーバー側（GitHub 等）のリポジトリ。push で送り、pull で他者の変更を受け取ります。</td></tr></table>'
  +'<p class="mono" style="font-size:12.8px;line-height:1.9">git clone &lt;url&gt; · git status · git add . · git commit -m "msg" · git push<br>git checkout -b feature/x · git pull · git merge feature/x</p>'
  +'<p>標準的なチームの流れ：main からブランチを切る → 小さくコミット（意味のあるメッセージ）→ push → PR を開く → レビュー → main へマージ → CI/CD が自動デプロイ。</p>'],
 cloud:['Toàn bộ hạ tầng hiện đại đều sống trong Git: code Terraform/Kubernetes ở trang IaC, pipeline CI/CD, và cả chính website bạn đang đọc — mọi thay đổi đều là commit được deploy qua GitHub Pages. Trong doanh nghiệp, “ai đã đổi cấu hình này, khi nào, vì sao” được trả lời bằng lịch sử Git và PR review, không phải bằng trí nhớ.',
        '現代のインフラはすべて Git の中にあります：IaC ページの Terraform/Kubernetes コード、CI/CD パイプライン、そして今読んでいるこのサイト自体も、変更はすべてコミットとして GitHub Pages へデプロイされています。企業では「誰が・いつ・なぜこの設定を変えたか」は記憶ではなく Git の履歴と PR レビューが答えます。'],
 miss:[['“Commit xong là code đã lên GitHub” — sai: commit chỉ ghi ở máy local; phải push mới lên remote, và đồng đội phải pull mới thấy.','「コミットすれば GitHub に上がった」— 誤り。コミットはローカルのみ。push でリモートへ、仲間は pull して初めて見えます。'],
       ['“Làm thẳng trên nhánh main cho nhanh” — với dự án nhóm đây là cách phá vỡ bản đang chạy và mất cổng review; nhánh + PR tồn tại chính để ngăn điều đó.','「main へ直接作業が速い」— チームでは稼働中のコードを壊しレビューも失います。ブランチ＋PR はそのための仕組みです。'],
       ['“Đưa file .env / khoá AWS vào repo riêng tư thì an toàn” — sai: bí mật đã commit là lộ vĩnh viễn trong lịch sử kể cả khi xoá file sau đó; phải xoay khoá ngay và dùng .gitignore + Secrets Manager.','「プライベートリポジトリなら .env や AWS キーを入れても安全」— 誤り。コミットした秘密は後で消しても履歴に残ります。即座にキーをローテーションし、.gitignore と Secrets Manager を使うこと。']],
 links:[['#/iac','Mang code lên trang IaC — Terraform & Kubernetes','IaC ページで Terraform と Kubernetes へ'],['#/architect','Xem CI/CD trong lộ trình Architect','アーキテクトの道筋で CI/CD を見る']]}
);

/* ================================================================
   B · NGÂN HÀNG CÂU HỎI NỀN TẢNG — 40 câu (4 câu/chương)
   Định dạng y hệt upgrade8: o = 4 phương án [vi,ja], c = chỉ số
   đúng, e/ej = giải thích chung, x = giải thích RIÊNG từng
   phương án [vi,ja] — giải thích đi theo phương án khi xáo trộn.
   ================================================================ */
function FQ(tp,tpj,q,qj,o,c,e,ej,x){ return {tp:[tp,tpj],tg:'gen',q:q,qj:qj,o:o,c:c,e:e,ej:ej,x:x}; }
var QB_FUND=[
/* ---- Chương 1 · Networking ---- */
FQ('Mạng máy tính','ネットワーク',
 'Người dùng mở được trang web bằng địa chỉ IP 203.0.113.10 nhưng gõ tên miền thì báo không tìm thấy máy chủ. Lỗi nằm ở tầng nào trong chuỗi kiểm tra?',
 'IP アドレス 203.0.113.10 では開けるのに、ドメイン名だと「サーバーが見つかりません」になる。確認チェーンのどの層の問題か？',
 [['Tầng 3 — định tuyến IP bị sai','第3層 — IP ルーティングの誤り'],
  ['Tầng 7 — phân giải DNS','第7層 — DNS 名前解決'],
  ['Tầng 4 — Security Group chặn cổng','第4層 — Security Group の遮断'],
  ['Tầng 1 — cáp mạng / tín hiệu vật lý','第1層 — ケーブル・物理信号']],
 1,
 'Đi được bằng IP nghĩa là tầng 1–4 đều thông; chỉ tên miền không ra IP thì lỗi nằm ở bước phân giải tên — DNS, tầng 7.',
 'IP で到達できるなら第1〜4層は正常。名前だけが IP にならないのは名前解決、つまり第7層の DNS の問題です。',
 [['Sai — đi được bằng IP chứng tỏ định tuyến tầng 3 đang chạy bình thường.','誤り — IP で到達できる時点で第3層のルーティングは正常です。'],
  ['Đúng — triệu chứng “IP được, tên không” là dấu hiệu kinh điển của lỗi DNS.','正解 — 「IP は可、名前は不可」は DNS 障害の典型サインです。'],
  ['Sai — nếu Security Group chặn cổng thì truy cập bằng IP cũng phải thất bại.','誤り — Security Group が遮断していれば IP でも失敗します。'],
  ['Sai — lỗi vật lý sẽ làm mất kết nối hoàn toàn, kể cả bằng IP.','誤り — 物理層の障害なら IP でも一切つながりません。']]),
FQ('Mạng máy tính','ネットワーク',
 'Ứng dụng xem video trực tiếp chấp nhận mất vài khung hình nhưng cần độ trễ cực thấp. Nên chọn giao thức tầng 4 nào?',
 'ライブ映像配信で、多少のフレーム損失は許容するが極低遅延が必要。選ぶべき第4層プロトコルは？',
 [['TCP — vì đảm bảo không mất dữ liệu','TCP — データ損失がないため'],
  ['ICMP — vì ping có độ trễ thấp','ICMP — ping は低遅延なため'],
  ['UDP — không bắt tay, không gửi lại nên độ trễ thấp nhất','UDP — ハンドシェイクも再送もなく最も低遅延'],
  ['HTTP — vì sinh ra để truyền video','HTTP — 映像伝送のために生まれたため']],
 2,
 'UDP bỏ qua bắt tay và cơ chế gửi lại nên độ trễ thấp nhất; mất vài gói trong video trực tiếp ít hại hơn là chờ gửi lại gây giật hình.',
 'UDP はハンドシェイクと再送を省くため最も低遅延です。ライブ映像では数パケットの損失より、再送待ちのカクつきの方が有害です。',
 [['Sai — độ tin cậy của TCP đổi lấy độ trễ: mất gói là cả luồng phải chờ gửi lại.','誤り — TCP の信頼性は遅延と引き換えで、損失時は全体が再送待ちになります。'],
  ['Sai — ICMP là giao thức chẩn đoán (ping/traceroute), không chở dữ liệu ứng dụng.','誤り — ICMP は診断用（ping 等）で、アプリデータは運びません。'],
  ['Đúng — đánh đổi độ tin cậy lấy độ trễ chính là lý do UDP tồn tại (DNS, streaming, game).','正解 — 信頼性を遅延と交換するのが UDP の存在理由です（DNS、配信、ゲーム）。'],
  ['Sai — HTTP là giao thức tầng 7 chạy trên TCP; chọn HTTP đồng nghĩa chọn TCP kèm độ trễ của nó.','誤り — HTTP は TCP 上の第7層であり、選べば TCP の遅延も付いてきます。']]),
FQ('Mạng máy tính','ネットワーク',
 'HTTPS khác HTTP ở điểm cốt lõi nào?',
 'HTTPS と HTTP の核心的な違いは？',
 [['HTTPS là giao thức hoàn toàn khác, không liên quan HTTP','HTTPS は HTTP と無関係の別プロトコル'],
  ['HTTPS dùng cổng 80 còn HTTP dùng 443','HTTPS は80番、HTTP は443番を使う'],
  ['HTTPS nén dữ liệu tốt hơn nên tải nhanh hơn','HTTPS は圧縮が効くので速い'],
  ['HTTPS = HTTP chạy trong TLS: mã hoá + xác thực server bằng chứng chỉ, cổng mặc định 443','HTTPS ＝ HTTP を TLS で運ぶ：暗号化＋証明書によるサーバー認証、既定ポート443']],
 3,
 'HTTPS không thay giao thức web — nó bọc HTTP trong TLS để mã hoá nội dung và chứng thực server; cổng mặc định đổi từ 80 sang 443.',
 'HTTPS は Web プロトコルを置き換えるものではなく、HTTP を TLS で包み暗号化とサーバー認証を加えたものです。既定ポートは80から443へ変わります。',
 [['Sai — HTTPS dùng nguyên văn cú pháp HTTP, chỉ cộng thêm lớp TLS bên dưới.','誤り — HTTPS は HTTP の文法そのままで、下に TLS 層が加わっただけです。'],
  ['Sai — ngược lại: HTTP là 80, HTTPS là 443.','誤り — 逆です：HTTP が80、HTTPS が443。'],
  ['Sai — TLS không nhằm nén để tăng tốc; mục đích là bí mật và toàn vẹn dữ liệu.','誤り — TLS の目的は圧縮・高速化ではなく、機密性と完全性です。'],
  ['Đúng — ghi nhớ bộ ba: HTTP + TLS + cổng 443.','正解 — 「HTTP＋TLS＋443番」の3点セットです。']]),
FQ('Mạng máy tính','ネットワーク',
 'Trong mô hình OSI, việc chia dữ liệu thành đoạn và đưa tới đúng chương trình qua số cổng thuộc tầng nào?',
 'OSI モデルで、データの分割とポート番号による正しいプログラムへの配送は第何層か？',
 [['Tầng 3 (Network)','第3層（ネットワーク）'],
  ['Tầng 4 (Transport)','第4層（トランスポート）'],
  ['Tầng 2 (Data Link)','第2層（データリンク）'],
  ['Tầng 7 (Application)','第7層（アプリケーション）']],
 1,
 'Tầng 4 (TCP/UDP) lo việc phân đoạn và định danh chương trình bằng số cổng; tầng 3 chỉ lo địa chỉ IP giữa các mạng.',
 '第4層（TCP/UDP）が分割とポートによるプログラム識別を担います。第3層はネットワーク間の IP アドレスだけです。',
 [['Sai — tầng 3 làm việc với địa chỉ IP và định tuyến, không biết số cổng.','誤り — 第3層は IP とルーティングで、ポートは扱いません。'],
  ['Đúng — “cổng” (port) là khái niệm sinh ra ở tầng Transport.','正解 — 「ポート」はトランスポート層の概念です。'],
  ['Sai — tầng 2 dùng địa chỉ MAC trong cùng mạng cục bộ.','誤り — 第2層は同一 LAN 内の MAC アドレスです。'],
  ['Sai — tầng 7 là giao thức ứng dụng (HTTP, DNS), chạy phía trên tầng 4.','誤り — 第7層はアプリのプロトコルで、第4層の上で動きます。']]),
/* ---- Chương 2 · IP & CIDR ---- */
FQ('IP & CIDR','IP と CIDR',
 'Một subnet AWS có CIDR /24. Số địa chỉ IP dùng được thực tế là bao nhiêu?',
 'AWS のサブネットが /24 の場合、実際に使える IP アドレス数は？',
 [['256','256'],
  ['254','254'],
  ['251','251'],
  ['248','248']],
 2,
 '/24 có 256 địa chỉ; AWS giữ 5 địa chỉ (network, router .1, DNS .2, dự phòng .3, broadcast) nên còn 251 dùng được.',
 '/24 は256アドレス。AWS が5個（ネットワーク、ルーター .1、DNS .2、予約 .3、ブロードキャスト）を予約するため、使用可能は251です。',
 [['Sai — 256 là tổng số địa chỉ của /24, chưa trừ phần dự trữ.','誤り — 256 は総数で、予約分を引いていません。'],
  ['Sai — 254 là đáp án của mạng thường (chỉ trừ network + broadcast); AWS trừ thêm 3.','誤り — 254 は通常のネットワーク（2個差し引き）の答え。AWS はさらに3個引きます。'],
  ['Đúng — quy tắc “AWS trừ 5” áp cho mọi subnet.','正解 — 「AWS は5個引く」が全サブネット共通の規則です。'],
  ['Sai — 248 không tương ứng cách trừ nào chuẩn.','誤り — 248 は標準的な計算では出てきません。']]),
FQ('IP & CIDR','IP と CIDR',
 'Địa chỉ 172.20.5.9 thuộc nhóm nào?',
 'アドレス 172.20.5.9 はどのグループに属するか？',
 [['IP công cộng (public)','パブリック IP'],
  ['IP riêng (private) thuộc dải 172.16.0.0/12','プライベート IP（172.16.0.0/12 の範囲）'],
  ['Địa chỉ broadcast','ブロードキャストアドレス'],
  ['Địa chỉ loopback','ループバックアドレス']],
 1,
 'Ba dải private theo RFC 1918 là 10.0.0.0/8, 172.16.0.0/12 (tức 172.16 → 172.31) và 192.168.0.0/16; 172.20 nằm trong dải thứ hai.',
 'RFC 1918 のプライベート範囲は 10.0.0.0/8、172.16.0.0/12（172.16〜172.31）、192.168.0.0/16 の3つ。172.20 は2番目に入ります。',
 [['Sai — 172.20 thuộc dải private nên không định tuyến được trên Internet công cộng.','誤り — 172.20 はプライベート範囲で、公共インターネットではルーティングされません。'],
  ['Đúng — điểm hay nhầm là dải 172.16/12 chạy tới 172.31 chứ không chỉ 172.16.','正解 — 172.16/12 が 172.31 まで及ぶ点が引っかけポイントです。'],
  ['Sai — broadcast là địa chỉ cuối của một subnet cụ thể, không phải cả dải 172.','誤り — ブロードキャストは特定サブネットの末尾アドレスです。'],
  ['Sai — loopback là 127.0.0.0/8 (điển hình 127.0.0.1).','誤り — ループバックは 127.0.0.0/8（代表は 127.0.0.1）です。']]),
FQ('IP & CIDR','IP と CIDR',
 'Hai VPC có CIDR lần lượt 10.0.0.0/16 và 10.0.128.0/17. Có thể thiết lập VPC Peering giữa chúng không?',
 'CIDR が 10.0.0.0/16 と 10.0.128.0/17 の2つの VPC は、ピアリングできるか？',
 [['Được — khác prefix nên không sao','可能 — プレフィックスが違うので問題ない'],
  ['Được — miễn là khác region','可能 — リージョンが違えばよい'],
  ['Không — 10.0.128.0/17 nằm trọn trong 10.0.0.0/16, tức CIDR chồng lấn','不可 — 10.0.128.0/17 は 10.0.0.0/16 に完全に含まれ、CIDR が重なっている'],
  ['Được — nếu bật DNS resolution cho peering','可能 — ピアリングの DNS 解決を有効にすればよい']],
 2,
 'Dải /17 thứ hai nằm hoàn toàn bên trong dải /16 thứ nhất → chồng lấn → AWS từ chối peering; đây là lý do phải quy hoạch CIDR ngay từ đầu.',
 '2番目の /17 は1番目の /16 の内側に完全に入るため重なっており、ピアリングは拒否されます。CIDR 計画が最初に重要な理由です。',
 [['Sai — chồng lấn xét trên địa chỉ thực tế, không xét chữ số prefix khác nhau.','誤り — 重なりは実際のアドレス範囲で判定し、プレフィックスの数字の違いではありません。'],
  ['Sai — peering cấm chồng lấn ở mọi region, kể cả cùng hay khác region.','誤り — ピアリングはリージョンを問わず重なりを禁止します。'],
  ['Đúng — /17 (10.0.128.0 → 10.0.255.255) là nửa sau của chính dải /16 kia.','正解 — /17（10.0.128.0〜10.0.255.255）は、その /16 の後半そのものです。'],
  ['Sai — DNS resolution là tính năng phụ của peering, không thay đổi được quy tắc chồng lấn.','誤り — DNS 解決はピアリングの付随機能で、重なりの規則は変えられません。']]),
FQ('IP & CIDR','IP と CIDR',
 'VPC 10.0.0.0/16 cần chia subnet /24 cho các tầng và AZ. Tối đa chia được bao nhiêu subnet /24?',
 'VPC 10.0.0.0/16 を /24 に分割する場合、最大で何サブネット作れるか？',
 [['16 subnet','16'],
  ['64 subnet','64'],
  ['256 subnet','256'],
  ['65.536 subnet','65,536']],
 2,
 'Từ /16 lên /24 mượn thêm 8 bit → 2^8 = 256 subnet, mỗi subnet 256 địa chỉ.',
 '/16 から /24 は8ビット追加で借りるため、2^8 ＝ 256 サブネット（各256アドレス）です。',
 [['Sai — 16 là số bit của prefix, không phải số subnet.','誤り — 16 はプレフィックスのビット数です。'],
  ['Sai — 64 tương ứng mượn 6 bit (2^6); ở đây mượn 24 − 16 = 8 bit.','誤り — 64 は6ビット借用（2^6）。ここでは 24 − 16 ＝ 8ビットです。'],
  ['Đúng — số subnet = 2^(prefix mới − prefix cũ) = 2^8 = 256.','正解 — サブネット数 ＝ 2^(新−旧プレフィックス) ＝ 2^8 ＝ 256。'],
  ['Sai — 65.536 là tổng số địa chỉ của cả /16, không phải số subnet /24.','誤り — 65,536 は /16 全体のアドレス総数です。']]),
/* ---- Chương 3 · Routing ---- */
FQ('Routing','ルーティング',
 'Route table có hai dòng: 10.0.0.0/16 → local và 0.0.0.0/0 → igw. Gói tin tới 10.0.5.20 sẽ đi đâu?',
 'ルートテーブルに 10.0.0.0/16 → local と 0.0.0.0/0 → igw がある。宛先 10.0.5.20 のパケットはどこへ行くか？',
 [['Ra Internet Gateway vì 0.0.0.0/0 khớp mọi địa chỉ','0.0.0.0/0 は全てに一致するので Internet Gateway へ'],
  ['Đi local vì route /16 cụ thể hơn thắng theo longest prefix match','local — /16 の方が具体的なので最長プレフィックス一致で勝つ'],
  ['Bị huỷ vì có hai route cùng khớp','2つ一致するので破棄される'],
  ['Đi ngẫu nhiên một trong hai','ランダムにどちらか']],
 1,
 'Cả hai dòng đều khớp, nhưng /16 dài và cụ thể hơn /0 nên thắng — đó là nguyên tắc longest prefix match áp dụng ở mọi router.',
 '両行とも一致しますが、/16 の方が /0 より長く具体的なので勝ちます。これが最長プレフィックス一致です。',
 [['Sai — 0.0.0.0/0 đúng là khớp mọi địa chỉ, nhưng chỉ thắng khi không có route cụ thể hơn.','誤り — 0.0.0.0/0 は全一致ですが、より具体的なルートがない場合にのみ勝ちます。'],
  ['Đúng — đích trong VPC ở lại trong VPC, không chạy ra internet.','正解 — VPC 内の宛先は VPC 内に留まります。'],
  ['Sai — trùng khớp là chuyện bình thường của routing, được phân định bằng độ dài prefix.','誤り — 複数一致は通常のことで、プレフィックス長で決着します。'],
  ['Sai — routing là xác định (deterministic), không có yếu tố ngẫu nhiên.','誤り — ルーティングは決定的で、ランダム要素はありません。']]),
FQ('Routing','ルーティング',
 'Điều gì quyết định một subnet của VPC là “public” hay “private”?',
 'VPC のサブネットが「パブリック」か「プライベート」かを決めるのは何か？',
 [['Tên đặt cho subnet','サブネットの名前'],
  ['Việc subnet có tự cấp IP công cộng hay không','パブリック IP の自動割り当ての有無'],
  ['Route table gắn với subnet: có route 0.0.0.0/0 → Internet Gateway hay không','関連ルートテーブル：0.0.0.0/0 → Internet Gateway の有無'],
  ['Security Group gắn với subnet','サブネットの Security Group']],
 2,
 'Bản chất public/private nằm ở đường đi: route mặc định trỏ Internet Gateway = public, trỏ NAT = private có chiều ra, không có route mặc định = cách ly.',
 '本質は経路にあります：既定ルートが Internet Gateway ならパブリック、NAT なら外向きプライベート、既定ルートなしなら分離です。',
 [['Sai — tên chỉ là nhãn do người đặt, không ảnh hưởng hành vi mạng.','誤り — 名前はただのラベルで、ネットワークの挙動には無関係です。'],
  ['Sai — tự cấp IP công cộng là hệ quả thường gặp, không phải định nghĩa; subnet có route IGW mà tắt cấp IP vẫn là public về đường đi.','誤り — 自動割り当ては付随設定で定義ではありません。'],
  ['Đúng — kiểm tra route table là cách phân biệt duy nhất đáng tin.','正解 — ルートテーブルの確認が唯一確実な見分け方です。'],
  ['Sai — Security Group là tường lửa theo instance, không quyết định đường đi của subnet.','誤り — Security Group はインスタンス単位のファイアウォールで、サブネットの経路は決めません。']]),
FQ('Routing','ルーティング',
 '“Default gateway” của một máy trong mạng cục bộ là gì?',
 'LAN 内のマシンにとって「デフォルトゲートウェイ」とは？',
 [['Địa chỉ IP của máy chủ DNS','DNS サーバーの IP アドレス'],
  ['Thiết bị nhận mọi gói tin có đích nằm ngoài mạng của máy, để chuyển tiếp đi tiếp','自ネットワーク外の宛先のパケットをすべて受け取り転送する機器'],
  ['Địa chỉ broadcast của subnet','サブネットのブロードキャストアドレス'],
  ['Máy chủ DHCP cấp địa chỉ','IP を配る DHCP サーバー']],
 1,
 'Máy chỉ giao trực tiếp trong cùng mạng; mọi đích ở ngoài đều gửi cho default gateway (router) quyết định đường tiếp theo. Trên AWS router của VPC ở địa chỉ .1 mỗi subnet.',
 'マシンが直接届けられるのは同一ネットワーク内だけ。外の宛先はすべてデフォルトゲートウェイ（ルーター）へ渡します。AWS では各サブネットの .1 が VPC ルーターです。',
 [['Sai — DNS server lo phân giải tên, không chuyển tiếp gói tin dữ liệu.','誤り — DNS は名前解決専用で、データパケットは転送しません。'],
  ['Đúng — “không biết đi đâu thì gửi cho gateway” chính là ý nghĩa của default.','正解 — 「行き先不明はゲートウェイへ」が default の意味です。'],
  ['Sai — broadcast dùng để gửi cho mọi máy trong subnet, không phải cửa ra.','誤り — ブロードキャストはサブネット全員宛で、出口ではありません。'],
  ['Sai — DHCP chỉ cấp cấu hình lúc máy lên mạng (trong đó có thông tin gateway), bản thân nó không chuyển tiếp traffic.','誤り — DHCP は設定を配るだけで（ゲートウェイ情報も含む）、トラフィック自体は転送しません。']]),
FQ('Routing','ルーティング',
 'Kết nối Direct Connect cần trao đổi route tự động giữa on-premise và AWS. Giao thức nào được dùng?',
 'Direct Connect でオンプレミスと AWS が経路を自動交換するのに使うプロトコルは？',
 [['OSPF','OSPF'],
  ['BGP (Border Gateway Protocol)','BGP（Border Gateway Protocol）'],
  ['RIP','RIP'],
  ['ICMP','ICMP']],
 1,
 'BGP là giao thức định tuyến động chuẩn cho kết nối biên (giữa các hệ tự trị khác nhau) — Direct Connect và Site-to-Site VPN đều dùng BGP để quảng bá prefix hai phía.',
 'BGP は異なる自律システム間の境界用ルーティングプロトコルで、Direct Connect も Site-to-Site VPN も BGP で両側のプレフィックスを広告します。',
 [['Sai — OSPF là giao thức nội bộ trong một tổ chức (IGP), không dùng qua đường biên cloud.','誤り — OSPF は組織内用の IGP で、クラウド境界では使いません。'],
  ['Đúng — nhớ cặp đôi: Direct Connect / VPN ⇄ BGP.','正解 — 「Direct Connect / VPN ⇄ BGP」のセットで覚えましょう。'],
  ['Sai — RIP là giao thức cũ, giới hạn 15 hop, không dùng cho kết nối cloud doanh nghiệp.','誤り — RIP は古く15ホップ制限があり、企業のクラウド接続には使いません。'],
  ['Sai — ICMP là giao thức chẩn đoán (ping), không trao đổi route.','誤り — ICMP は診断用で、経路交換はしません。']]),
/* ---- Chương 4 · DNS ---- */
FQ('DNS','DNS',
 'Cần cấu hình để mail gửi tới domain example.com được nhận bởi server mail của Google Workspace. Dùng bản ghi nào?',
 'example.com 宛のメールを Google Workspace のメールサーバーで受けるために必要なレコードは？',
 [['A','A'],
  ['CNAME','CNAME'],
  ['MX','MX'],
  ['PTR','PTR']],
 2,
 'MX (Mail Exchange) khai báo server nhận mail cho domain kèm độ ưu tiên; hệ thống gửi mail luôn tra MX trước khi gửi.',
 'MX（Mail Exchange）はドメインのメール受信サーバーと優先度を宣言します。送信側は必ず MX を引いてから送ります。',
 [['Sai — A chỉ dịch tên thành IPv4 cho kết nối thông thường, không định hướng email.','誤り — A は名前→IPv4 の変換だけで、メールは誘導しません。'],
  ['Sai — CNAME tạo bí danh tên miền cho web, không liên quan luồng mail.','誤り — CNAME は Web 用の別名で、メールフローとは無関係です。'],
  ['Đúng — không có MX đúng thì mail tới domain sẽ không biết đi đâu.','正解 — 正しい MX がなければドメイン宛メールは行き先不明になります。'],
  ['Sai — PTR là phân giải ngược IP → tên, dùng kiểm tra chiều gửi chứ không định tuyến mail đến.','誤り — PTR は IP→名前の逆引きで、受信先の指定ではありません。']]),
FQ('DNS','DNS',
 'Vừa đổi bản ghi A của website sang server mới nhưng nhiều người dùng vẫn vào server cũ sau 2 giờ. Nguyên nhân đúng nhất?',
 'Web の A レコードを新サーバーへ変えたのに、2時間後も多くのユーザーが旧サーバーへ行く。最も正しい原因は？',
 [['Bản ghi NS chưa được đổi','NS レコードを変えていない'],
  ['Các resolver vẫn cache bản ghi cũ cho tới khi hết TTL','各リゾルバが TTL 切れまで旧レコードをキャッシュしている'],
  ['Trình duyệt bắt buộc dùng IPv6','ブラウザが IPv6 を強制している'],
  ['Server mới chưa mở cổng 443','新サーバーで443番が開いていない']],
 1,
 'DNS được cache ở khắp nơi theo TTL của bản ghi; đổi xong vẫn phải chờ nốt TTL cũ trôi qua — vì vậy trước ngày cutover phải hạ TTL xuống thấp từ trước.',
 'DNS はレコードの TTL に従い各地でキャッシュされます。変更後も旧 TTL が切れるまで待つ必要があり、切替日前に TTL を下げておくのが鉄則です。',
 [['Sai — NS chỉ thay đổi khi chuyển nhà cung cấp DNS, không liên quan việc đổi A.','誤り — NS は DNS 事業者を変える時のもので、A の変更とは無関係です。'],
  ['Đúng — đây là hành vi thiết kế của DNS (cache phân tán), không phải lỗi.','正解 — これは分散キャッシュという DNS の設計上の挙動で、障害ではありません。'],
  ['Sai — nếu là vấn đề IPv6 thì người dùng sẽ lỗi ngay từ đầu chứ không “vào nhầm server cũ”.','誤り — IPv6 の問題なら最初からエラーになり、旧サーバーへ行く現象にはなりません。'],
  ['Sai — cổng chưa mở thì kết nối bị từ chối, chứ người dùng không thể vào được server cũ.','誤り — ポート未開放なら接続拒否になるだけで、旧サーバーに入れる理由にはなりません。']]),
FQ('DNS','DNS',
 'Bản ghi CNAME có đặc điểm nào đúng?',
 'CNAME レコードについて正しいのはどれか？',
 [['Trỏ tên miền tới một địa chỉ IP','ドメイン名を IP アドレスへ向ける'],
  ['Trỏ tên miền tới một tên miền khác','ドメイン名を別のドメイン名へ向ける'],
  ['Chỉ dùng cho email','メール専用である'],
  ['Là bản ghi phân giải ngược','逆引き用のレコードである']],
 1,
 'CNAME (Canonical Name) là bí danh: tên này trỏ sang tên khác, và việc phân giải tiếp tục ở tên đích. Trỏ IP phải dùng A/AAAA; phân giải ngược là PTR.',
 'CNAME（Canonical Name）は別名で、この名前を別の名前へ向け、解決は宛先名で続きます。IP を指すのは A/AAAA、逆引きは PTR です。',
 [['Sai — trỏ thẳng IP là việc của bản ghi A (IPv4) và AAAA (IPv6).','誤り — IP を直接指すのは A（IPv4）と AAAA（IPv6）。'],
  ['Đúng — vd blog.example.com CNAME → www.example.com.','正解 — 例：blog.example.com CNAME → www.example.com。'],
  ['Sai — email dùng MX; CNAME chủ yếu dùng cho web và bí danh dịch vụ.','誤り — メールは MX。CNAME は主に Web とサービスの別名です。'],
  ['Sai — phân giải ngược IP → tên là bản ghi PTR.','誤り — IP→名前の逆引きは PTR です。']]),
FQ('DNS','DNS',
 'Khi resolver chưa có cache, thứ tự hỏi để phân giải một tên miền là gì?',
 'リゾルバにキャッシュがない場合、名前解決の問い合わせ順序は？',
 [['Authoritative → TLD → Root','権威 → TLD → ルート'],
  ['Root → TLD → nameserver có thẩm quyền của domain','ルート → TLD → ドメインの権威ネームサーバー'],
  ['DHCP → Root → TLD','DHCP → ルート → TLD'],
  ['Trình duyệt hỏi thẳng server đích','ブラウザが宛先サーバーへ直接聞く']],
 1,
 'Phân giải đệ quy đi từ gốc xuống: root chỉ đường tới TLD (.jp, .com), TLD chỉ tới nameserver có thẩm quyền, nơi đó mới có bản ghi thật.',
 '再帰解決は上から下へ：ルートが TLD（.jp、.com）を案内し、TLD が権威ネームサーバーを案内し、そこで実レコードが得られます。',
 [['Sai — thứ tự ngược: phải bắt đầu từ root vì resolver không biết ai có thẩm quyền trước khi hỏi.','誤り — 順序が逆。権威が誰か分からないため、ルートから始めます。'],
  ['Đúng — hình dung cây tên miền đi từ gốc (.) xuống lá.','正解 — ドメインの木を根（.）から葉へ辿るイメージです。'],
  ['Sai — DHCP chỉ cấp địa chỉ DNS server cho máy, không tham gia phân giải từng tên.','誤り — DHCP は DNS サーバーのアドレスを配るだけで、個別の解決には関与しません。'],
  ['Sai — trình duyệt không biết IP của “server đích” trước khi phân giải — đó chính là việc DNS phải làm.','誤り — ブラウザは解決前に宛先 IP を知りません。それを調べるのが DNS です。']])
];
QB_FUND.push(
/* ---- Chương 5 · Linux ---- */
FQ('Linux','Linux',
 'SSH báo lỗi “Permission denied (publickey)” ngay sau khi bạn copy khoá lên server và thư mục ~/.ssh đang để quyền 777. Nguyên nhân khả dĩ nhất?',
 '鍵をサーバーへコピーした直後、SSH が「Permission denied (publickey)」になる。~/.ssh の権限は777。最も可能性の高い原因は？',
 [['Server chưa cài SSH','サーバーに SSH が未インストール'],
  ['Quyền quá lỏng: SSH từ chối dùng authorized_keys khi thư mục/file khoá không được bảo vệ chặt (phải 700 / 600)','権限が緩すぎる：SSH は鍵ディレクトリ/ファイルが厳格（700 / 600）でないと authorized_keys を拒否する'],
  ['Phải mở thêm cổng 443 cho SSH','SSH 用に443番も開ける必要がある'],
  ['Khoá công khai phải được mã hoá lại','公開鍵を再暗号化する必要がある']],
 1,
 'sshd kiểm tra quyền rất nghiêm: ~/.ssh phải 700 và authorized_keys 600; quyền 777 nghĩa là ai cũng sửa được khoá → sshd bỏ qua file đó để bảo vệ bạn.',
 'sshd は権限を厳しく検査します：~/.ssh は700、authorized_keys は600 が必要。777 は誰でも鍵を書き換えられるため、sshd はそのファイルを無視します。',
 [['Sai — server đã trả lời ở tầng SSH (báo publickey) chứng tỏ sshd đang chạy.','誤り — SSH 層の応答が返っている時点で sshd は動いています。'],
  ['Đúng — “quyền lỏng nên bị từ chối” là bẫy kinh điển, ngược với直 giác “càng mở càng dễ vào”.','正解 — 「緩いから拒否される」は直感に反する古典的な落とし穴です。'],
  ['Sai — SSH dùng cổng 22; 443 là HTTPS, không liên quan.','誤り — SSH は22番。443 は HTTPS で無関係です。'],
  ['Sai — khoá công khai vốn để công khai; thứ cần bảo vệ là khoá riêng phía máy bạn và quyền file trên server.','誤り — 公開鍵は公開するもの。守るべきは手元の秘密鍵とサーバー側のファイル権限です。']]),
FQ('Linux','Linux',
 'Quyền 750 trên một thư mục nghĩa là gì?',
 'ディレクトリの権限 750 の意味は？',
 [['Mọi người đều đọc được','全員が読める'],
  ['Chủ sở hữu: đọc/ghi/thực thi; nhóm: đọc/thực thi; người khác: không quyền','所有者：読み書き実行、グループ：読み実行、その他：権限なし'],
  ['Chủ sở hữu chỉ đọc; nhóm ghi; người khác thực thi','所有者：読みのみ、グループ：書き、その他：実行'],
  ['Thư mục chứa tối đa 750 file','最大750ファイルまで入る']],
 1,
 'Ba số là ba nhóm (chủ / nhóm / người khác); mỗi số = r(4) + w(2) + x(1). 7 = rwx cho chủ, 5 = r-x cho nhóm, 0 = không gì cho người khác. Với thư mục, x nghĩa là được đi vào.',
 '3桁は（所有者 / グループ / その他）で、各桁は r(4)＋w(2)＋x(1)。7＝所有者 rwx、5＝グループ r-x、0＝その他なし。ディレクトリの x は「入れる」ことです。',
 [['Sai — “mọi người” là nhóm thứ ba (others) đang là 0 — không quyền nào.','誤り — 「全員」のその他は0で権限なしです。'],
  ['Đúng — đọc số theo từng nhóm: 7 / 5 / 0.','正解 — 桁ごとに 7 / 5 / 0 と読むのが正解です。'],
  ['Sai — thứ tự nhóm bị đọc ngược và giá trị cũng không khớp (7 là đủ rwx).','誤り — 区分の順序も値もずれています（7 は rwx 全部）。'],
  ['Sai — số quyền không liên quan số lượng file.','誤り — 権限の数字はファイル数とは無関係です。']]),
FQ('Linux','Linux',
 'Dịch vụ nginx trên server Linux không lên sau khi sửa cấu hình. Trình tự kiểm tra đúng nhất?',
 '設定変更後、Linux サーバーの nginx が起動しない。最も正しい確認手順は？',
 [['Cài lại nginx từ đầu','nginx を再インストールする'],
  ['systemctl status nginx để xem lỗi, rồi journalctl -u nginx đọc log chi tiết của dịch vụ','systemctl status nginx でエラーを見て、journalctl -u nginx でサービスの詳細ログを読む'],
  ['Khởi động lại cả server ngay','サーバー全体を即再起動する'],
  ['chmod 777 toàn bộ /etc/nginx','/etc/nginx 全体を chmod 777 する']],
 1,
 'systemd là quản lý của dịch vụ: status cho biết trạng thái + vài dòng lỗi gần nhất, journalctl -u cho toàn bộ log của đúng dịch vụ đó — chẩn đoán trước, can thiệp sau.',
 'サービス管理は systemd：status で状態と直近のエラー、journalctl -u でそのサービスの全ログ。まず診断、介入はその後です。',
 [['Sai — cài lại phá mất cấu hình và log, mà đa số lỗi là sai cú pháp file cấu hình chứ không phải hỏng chương trình.','誤り — 再インストールは設定とログを消し、原因の大半である設定ミスも直りません。'],
  ['Đúng — cặp lệnh status + journalctl là bước một của mọi sự cố dịch vụ trên Linux hiện đại.','正解 — status と journalctl のセットが現代 Linux のサービス障害の第一歩です。'],
  ['Sai — reboot xoá bằng chứng (trạng thái tiến trình, log trong RAM) và thường không sửa được lỗi cấu hình.','誤り — 再起動は証拠を消し、設定ミスは大抵直りません。'],
  ['Sai — nới quyền hàng loạt vừa không liên quan nguyên nhân vừa tạo lỗ hổng bảo mật.','誤り — 一括で権限を緩めるのは原因と無関係で、セキュリティホールにもなります。']]),
FQ('Linux','Linux',
 'File log của hệ thống và các dịch vụ trên Linux thường nằm ở thư mục nào?',
 'Linux のシステムとサービスのログは通常どのディレクトリか？',
 [['/etc/log','/etc/log'],
  ['/usr/log','/usr/log'],
  ['/var/log','/var/log'],
  ['/home/log','/home/log']],
 2,
 '/var/log chứa journal, log dịch vụ (nginx, ssh…), log hệ thống — “var” là phần dữ liệu thay đổi liên tục của hệ thống.',
 '/var/log にはジャーナル、サービスのログ、システムログが入ります。「var」は変化し続けるデータの置き場です。',
 [['Sai — /etc là nơi chứa file cấu hình, không phải log.','誤り — /etc は設定ファイルの場所です。'],
  ['Sai — /usr chứa chương trình và thư viện hệ thống.','誤り — /usr はプログラムとライブラリです。'],
  ['Đúng — sự cố nào trên Linux cũng bắt đầu bằng việc mở /var/log hoặc journalctl.','正解 — Linux の障害対応は /var/log か journalctl から始まります。'],
  ['Sai — /home là thư mục cá nhân của user.','誤り — /home はユーザーの個人領域です。']]),
/* ---- Chương 6 · Windows Server ---- */
FQ('Windows Server','Windows Server',
 'Một máy trạm Windows ping được tới Domain Controller nhưng join domain vẫn báo không tìm thấy domain. Kiểm tra điều gì đầu tiên?',
 'Windows 端末から DC へ ping は通るのに、ドメイン参加で「ドメインが見つかりません」と出る。最初に確認するのは？',
 [['Địa chỉ DNS của máy trạm — phải trỏ về DNS nội bộ của domain (DC) để tra bản ghi SRV','端末の DNS 設定 — ドメインの内部 DNS（DC）を向き、SRV レコードを引けること'],
  ['Cổng 3389 đã mở chưa','3389番が開いているか'],
  ['Máy trạm đã có địa chỉ IPv6 chưa','端末に IPv6 があるか'],
  ['Tên máy trạm có dài quá 30 ký tự không','コンピュータ名が30文字を超えていないか']],
 0,
 'AD sống nhờ DNS: máy trạm tìm DC qua bản ghi SRV trong DNS nội bộ. Nếu máy đang dùng DNS công cộng (8.8.8.8) thì ping IP vẫn通 nhưng không bao giờ tìm thấy domain.',
 'AD は DNS で生きています：端末は内部 DNS の SRV レコードで DC を探します。公共 DNS（8.8.8.8）を使っていれば、IP への ping は通ってもドメインは永遠に見つかりません。',
 [['Đúng — đây là nguyên nhân số 1 của lỗi join domain trong thực tế.','正解 — 実務でドメイン参加失敗の第1原因です。'],
  ['Sai — 3389 là cổng Remote Desktop, không dùng trong quá trình join.','誤り — 3389 はリモートデスクトップ用で、参加処理には使いません。'],
  ['Sai — domain join hoạt động hoàn toàn trên IPv4; IPv6 không phải điều kiện.','誤り — ドメイン参加は IPv4 だけで完結し、IPv6 は条件ではありません。'],
  ['Sai — giới hạn tên máy là 15 ký tự NetBIOS và kể cả vi phạm thì thông báo lỗi cũng khác hẳn.','誤り — 名前の制限は NetBIOS の15文字で、違反時のエラーも全く別です。']]),
FQ('Windows Server','Windows Server',
 'GPO (Group Policy Object) dùng để làm gì trong doanh nghiệp?',
 '企業における GPO（グループポリシー）の用途は？',
 [['Cấp địa chỉ IP tự động cho máy trạm','端末へ IP を自動配布する'],
  ['Áp chính sách tập trung xuống user và máy: bắt đổi mật khẩu, cấm USB, map ổ mạng…','ユーザーとマシンへポリシーを一元適用：パスワード強制、USB 禁止、ドライブマッピング等'],
  ['Sao lưu dữ liệu của Domain Controller','DC のデータをバックアップする'],
  ['Phân giải tên miền nội bộ','内部の名前解決を行う']],
 1,
 'GPO là cơ chế quản trị tập trung của AD: định nghĩa chính sách một chỗ (theo OU), áp xuống hàng nghìn máy/user mà không phải chạm từng máy.',
 'GPO は AD の一元管理の仕組みで、OU 単位でポリシーを定義し、数千台へ触らずに適用できます。',
 [['Sai — cấp IP tự động là việc của DHCP.','誤り — IP の自動配布は DHCP の仕事です。'],
  ['Đúng — “một chỗ sửa, toàn domain nhận” là giá trị cốt lõi của GPO.','正解 — 「一箇所で直せば全ドメインへ」が GPO の核心価値です。'],
  ['Sai — sao lưu DC là việc của công cụ backup (vd Windows Server Backup), không phải GPO.','誤り — DC のバックアップは専用ツールの仕事です。'],
  ['Sai — phân giải tên miền là việc của DNS.','誤り — 名前解決は DNS の仕事です。']]),
FQ('Windows Server','Windows Server',
 'DHCP cấp cho máy trạm những thông tin nào khi máy vào mạng?',
 'DHCP が端末へ配布する情報はどれか？',
 [['Chỉ địa chỉ IP','IP アドレスのみ'],
  ['IP + subnet mask + default gateway + địa chỉ DNS server','IP＋サブネットマスク＋デフォルトゲートウェイ＋DNS サーバーのアドレス'],
  ['Tên user và mật khẩu đăng nhập domain','ドメインのユーザー名とパスワード'],
  ['Bản sao của GPO','GPO のコピー']],
 1,
 'DHCP cấp cả gói cấu hình mạng: IP, mask, gateway và DNS server. Trong mạng AD, DNS được cấp phải trỏ về DC — cấp sai DNS trong DHCP là lỗi dây chuyền toàn công ty.',
 'DHCP は IP、マスク、ゲートウェイ、DNS サーバーまで一式を配ります。AD 環境では配布する DNS が DC を向いていないと全社規模の連鎖障害になります。',
 [['Sai — nói DHCP “chỉ cấp IP” là thiếu phần quan trọng nhất: DNS server đi kèm.','誤り — 「IP のみ」は最重要の DNS サーバー配布を落としています。'],
  ['Đúng — và đây là lý do một lỗi trong cấu hình DHCP lan ra mọi máy cùng lúc.','正解 — だからこそ DHCP の設定ミスは全端末へ同時に広がります。'],
  ['Sai — thông tin đăng nhập thuộc về AD/Kerberos, DHCP không hề biết user là ai.','誤り — ログイン情報は AD/Kerberos の領域で、DHCP はユーザーを知りません。'],
  ['Sai — GPO do DC phân phối qua cơ chế riêng, không qua DHCP.','誤り — GPO は DC が別経路で配布します。']]),
FQ('Windows Server','Windows Server',
 'OU (Organizational Unit) trong Active Directory là gì?',
 'Active Directory の OU（組織単位）とは？',
 [['Một loại tài khoản user đặc biệt','特殊なユーザーアカウント'],
  ['Thư mục con trong domain để gom user/máy theo phòng ban, là đơn vị để áp GPO và uỷ quyền quản trị','ドメイン内の入れ物。部門ごとにユーザー/マシンをまとめ、GPO 適用と管理委任の単位になる'],
  ['Một server vật lý phụ của domain','ドメインの予備物理サーバー'],
  ['Giao thức đồng bộ giữa các DC','DC 間の同期プロトコル']],
 1,
 'OU là cấu trúc tổ chức bên trong domain (theo phòng ban/chi nhánh); thiết kế OU quyết định GPO áp lên ai và ai được uỷ quyền quản trị nhóm nào.',
 'OU はドメイン内部の組織構造（部門・拠点）で、OU 設計が GPO の適用先と管理委任の範囲を決めます。',
 [['Sai — OU là vùng chứa (container), không phải tài khoản.','誤り — OU はコンテナであり、アカウントではありません。'],
  ['Đúng — nhớ bộ ba: OU gom đối tượng → GPO gắn vào OU → chính sách áp xuống.','正解 — 「OU が集め、GPO が付き、ポリシーが下る」の3点セットです。'],
  ['Sai — server phụ là DC thứ hai (additional Domain Controller), khái niệm khác hẳn.','誤り — 予備サーバーは追加 DC で、全く別の概念です。'],
  ['Sai — đồng bộ giữa các DC gọi là replication, không phải OU.','誤り — DC 間同期はレプリケーションと呼びます。']]),
/* ---- Chương 7 · Virtualization ---- */
FQ('Ảo hoá','仮想化',
 'Hypervisor type 1 khác type 2 ở điểm nào?',
 'タイプ1ハイパーバイザーとタイプ2の違いは？',
 [['Type 1 chạy trên laptop, type 2 chạy trong data center','タイプ1はノート PC、タイプ2はデータセンター'],
  ['Type 1 chạy thẳng trên phần cứng; type 2 chạy như ứng dụng trên một hệ điều hành có sẵn','タイプ1はハードウェア上で直接動作、タイプ2は既存 OS 上のアプリとして動作'],
  ['Type 1 chỉ chạy được 1 VM; type 2 chạy nhiều VM','タイプ1は VM 1台のみ、タイプ2は複数台'],
  ['Type 1 là mã nguồn mở; type 2 là thương mại','タイプ1は OSS、タイプ2は商用']],
 1,
 'Type 1 (bare-metal) như ESXi, KVM, Nitro nằm trực tiếp trên phần cứng nên dùng cho cloud/data center; type 2 như VirtualBox nằm trên Windows/macOS, tiện cho học tập.',
 'タイプ1（ベアメタル）は ESXi、KVM、Nitro のようにハードウェア直上で動きクラウド/DC 向け。タイプ2は VirtualBox のように Windows/macOS 上で動く学習向けです。',
 [['Sai — ngược lại: type 1 là chuẩn của data center/cloud, type 2 mới hay gặp trên laptop cá nhân.','誤り — 逆です：タイプ1が DC/クラウドの標準、タイプ2が個人ノート PC 向けです。'],
  ['Đúng — chữ “bare-metal” (trên kim loại trần) là từ khoá phân biệt.','正解 — 「ベアメタル」という言葉が区別の鍵です。'],
  ['Sai — cả hai đều chạy được nhiều VM; giới hạn nằm ở tài nguyên phần cứng.','誤り — どちらも複数 VM を動かせます。制限はハードウェア資源です。'],
  ['Sai — phân loại theo vị trí chạy, không theo giấy phép: KVM mở, ESXi thương mại đều là type 1.','誤り — 分類は動作位置によるもので、ライセンス形態ではありません。']]),
FQ('Ảo hoá','仮想化',
 'Vì sao snapshot không được coi là backup?',
 'スナップショットがバックアップとみなされない理由は？',
 [['Vì snapshot không chứa dữ liệu, chỉ chứa cấu hình','スナップショットは設定のみでデータを含まないため'],
  ['Vì snapshot phụ thuộc vào chuỗi đĩa gốc — mất VM/host gốc là mất cả snapshot; backup phải là bản sao độc lập','スナップショットは元ディスクの連鎖に依存し、元を失えば一緒に消える。バックアップは独立した複製であるべき'],
  ['Vì snapshot chỉ chụp được khi tắt máy','スナップショットは停止中しか撮れないため'],
  ['Vì snapshot hết hạn sau 24 giờ','スナップショットは24時間で失効するため']],
 1,
 'Snapshot là ảnh chụp phụ thuộc (delta trên đĩa gốc) để quay lui khi thử nghiệm; backup là bản sao độc lập sống sót được khi bản gốc mất — hai mục đích khác hẳn nhau.',
 'スナップショットは元ディスクへの差分に依存する巻き戻し用。バックアップは原本が消えても残る独立した複製 — 目的が根本的に違います。',
 [['Sai — snapshot chứa cả dữ liệu tại thời điểm chụp; vấn đề nằm ở tính phụ thuộc, không phải thiếu dữ liệu.','誤り — スナップショットは時点のデータを含みます。問題は依存性です。'],
  ['Đúng — kiểm tra tính “độc lập với bản gốc” là câu hỏi phân biệt snapshot và backup.','正解 — 「原本から独立しているか」が見分けの問いです。'],
  ['Sai — snapshot chụp được ngay cả khi VM đang chạy (hot snapshot).','誤り — 稼働中でも撮れます（ホットスナップショット）。'],
  ['Sai — snapshot không tự hết hạn theo giờ; nó tồn tại tới khi người quản trị xoá hoặc gộp.','誤り — 時間で失効はしません。管理者が削除/統合するまで残ります。']]),
FQ('Ảo hoá','仮想化',
 'Trên các cloud hiện nay, 1 vCPU thường tương ứng với gì ở phần cứng thật?',
 '現在のクラウドで、1 vCPU は実ハードウェアの何に相当することが多いか？',
 [['Một core vật lý nguyên vẹn','物理コア1個そのもの'],
  ['Một luồng xử lý (hyperthread) — thường là một nửa của một core vật lý','1つの論理スレッド（ハイパースレッド）— 通常は物理コアの半分'],
  ['Một phần tư core vật lý','物理コアの4分の1'],
  ['Toàn bộ một CPU socket','CPU ソケット全体']],
 1,
 'Đa số dòng instance định nghĩa vCPU theo hyperthread (SMT): 2 vCPU = 1 core vật lý có 2 luồng. Vì vậy so hiệu năng giữa các dòng máy phải xét cả thế hệ CPU.',
 '多くのインスタンス系統では vCPU をハイパースレッド（SMT）単位で定義し、2 vCPU ＝ 物理1コア（2スレッド）。性能比較では CPU 世代も見る必要があります。',
 [['Sai — nếu 1 vCPU = 1 core nguyên thì máy 96 vCPU cần 96 core vật lý; thực tế host dùng SMT để chia sẻ.','誤り — 1 vCPU＝1コアなら96 vCPU に96コア必要ですが、実際は SMT で共有しています。'],
  ['Đúng — đây là lý do cùng số vCPU nhưng khác dòng instance hiệu năng vẫn chênh nhau.','正解 — 同じ vCPU 数でも系統で性能が違う理由がこれです。'],
  ['Sai — 1/4 core không phải quy ước phổ biến của các dòng máy chủ đạo.','誤り — 4分の1は主流系統の規約ではありません。'],
  ['Sai — một socket chứa nhiều core, lớn hơn vCPU rất nhiều.','誤り — ソケットには複数コアが入り、vCPU よりはるかに大きい単位です。']]),
FQ('Ảo hoá','仮想化',
 'Khác biệt nền tảng giữa máy ảo (VM) và container là gì?',
 'VM とコンテナの根本的な違いは？',
 [['VM chạy Linux, container chạy Windows','VM は Linux、コンテナは Windows'],
  ['VM ảo hoá cả máy kèm hệ điều hành riêng; container chia sẻ kernel của host nên nhẹ và khởi động nhanh hơn','VM は OS ごと仮想化し、コンテナはホストのカーネルを共有するため軽く高速に起動する'],
  ['Container chỉ là VM nhỏ hơn','コンテナは小さい VM にすぎない'],
  ['VM không cần hypervisor, container thì cần','VM はハイパーバイザー不要、コンテナは必要']],
 1,
 'VM = ảo hoá phần cứng (mỗi VM một kernel riêng, qua hypervisor). Container = ảo hoá ở tầng hệ điều hành: nhiều container dùng chung kernel của host, tách nhau bằng namespace/cgroup.',
 'VM はハードウェア仮想化（VM ごとにカーネルを持ちハイパーバイザー経由）。コンテナは OS 層の仮想化で、ホストのカーネルを共有し namespace/cgroup で分離します。',
 [['Sai — cả hai đều chạy được trên Linux lẫn Windows (với điều kiện tương ứng), không phân theo hệ điều hành như vậy.','誤り — どちらも条件付きで Linux/Windows 両対応です。そのような分け方はしません。'],
  ['Đúng — “chia sẻ kernel hay không” là ranh giới cốt lõi giữa hai công nghệ.','正解 — 「カーネルを共有するか」が両技術の核心的な境界です。'],
  ['Sai — container không phải VM thu nhỏ: khác hẳn cơ chế cách ly và không có hypervisor ở giữa.','誤り — コンテナは小さい VM ではありません。分離の仕組みが根本的に違います。'],
  ['Sai — ngược lại: VM cần hypervisor; container chạy trên container runtime (Docker/containerd) chứ không cần hypervisor.','誤り — 逆です：VM はハイパーバイザーが必要で、コンテナはランタイム上で動きます。']]),
/* ---- Chương 8 · Database ---- */
FQ('Database','データベース',
 'Chạy lệnh UPDATE users SET name = \'X\' mà quên mệnh đề WHERE thì điều gì xảy ra?',
 'WHERE を忘れて UPDATE users SET name = \'X\' を実行するとどうなるか？',
 [['Database báo lỗi và từ chối','DB がエラーで拒否する'],
  ['Toàn bộ các hàng trong bảng users đều bị đổi name thành X','users 表の全行の name が X に変わる'],
  ['Chỉ hàng đầu tiên bị đổi','先頭の1行だけ変わる'],
  ['Lệnh tự động bị giới hạn ở 100 hàng','自動的に100行まで制限される']],
 1,
 'SQL không có “mặc định an toàn”: thiếu WHERE nghĩa là áp cho mọi hàng. Đây là tai nạn kinh điển — luôn viết WHERE trước và kiểm tra bằng SELECT cùng điều kiện.',
 'SQL に「安全な既定」はありません：WHERE がなければ全行が対象です。古典的事故なので、まず WHERE を書き、同じ条件の SELECT で確認する癖を。',
 [['Sai — cú pháp hoàn toàn hợp lệ nên database thực thi ngay, không có gì để báo lỗi.','誤り — 文法は完全に正しいため DB は即実行します。エラーにはなりません。'],
  ['Đúng — và khôi phục lúc này chỉ có backup/PITR mới cứu được.','正解 — この状態から救えるのはバックアップ/PITR だけです。'],
  ['Sai — SQL không tự giới hạn ở hàng đầu tiên nếu không có LIMIT/TOP.','誤り — LIMIT/TOP がなければ先頭1行に制限されません。'],
  ['Sai — không tồn tại giới hạn 100 hàng mặc định nào trong SQL chuẩn.','誤り — 標準 SQL に既定の100行制限などありません。']]),
FQ('Database','データベース',
 'Read replica giúp giải quyết vấn đề gì là chính?',
 'リードレプリカが主に解決する問題は？',
 [['Bảo vệ dữ liệu khi xoá nhầm bảng','表を誤削除した時のデータ保護'],
  ['Giảm tải đọc cho database chính bằng cách chuyển truy vấn đọc (báo cáo, thống kê) sang bản sao','読み取りクエリ（レポート、集計）を複製先へ逃がし、プライマリの読み取り負荷を下げる'],
  ['Tăng tốc độ ghi cho database chính','プライマリの書き込みを高速化する'],
  ['Thay thế hoàn toàn nhu cầu backup','バックアップを完全に不要にする']],
 1,
 'Replica nhân bản liên tục từ bản chính: chuyển phần đọc nặng (dashboard, báo cáo) sang replica để bản chính rảnh cho ghi và giao dịch. Ghi vẫn dồn về một bản chính duy nhất.',
 'レプリカはプライマリから継続複製されます。重い読み取り（ダッシュボード、レポート）をレプリカへ回し、プライマリを書き込みとトランザクションに空けるのが主目的。書き込みは1台のプライマリに集約されたままです。',
 [['Sai — lệnh xoá nhầm cũng được nhân bản sang replica gần như tức thì; chống xoá nhầm là việc của backup/PITR.','誤り — 誤削除もほぼ即座にレプリカへ伝播します。誤削除対策はバックアップ/PITR の仕事です。'],
  ['Đúng — từ khoá là “scale chiều đọc” (read scaling).','正解 — キーワードは「読み取りのスケーリング」です。'],
  ['Sai — replica không giúp ghi nhanh hơn; mọi ghi vẫn vào bản chính, thêm replica còn tốn thêm việc nhân bản.','誤り — 書き込みは速くなりません。全書き込みはプライマリへ入り、複製の手間も増えます。'],
  ['Sai — đây chính là ngộ nhận nguy hiểm đã học ở chương này: replication ≠ backup.','誤り — 本章で学んだ危険な誤解そのもの：レプリケーション ≠ バックアップ。']]),
FQ('Database','データベース',
 'Index trong database có đánh đổi (trade-off) nào?',
 'データベースのインデックスにはどんなトレードオフがあるか？',
 [['Chỉ có lợi, không có hại','利点しかなく欠点はない'],
  ['Tìm kiếm nhanh hơn nhưng mỗi lần ghi (INSERT/UPDATE) chậm đi và tốn thêm dung lượng','検索は速くなるが、書き込み（INSERT/UPDATE）が遅くなり容量も余分に使う'],
  ['Làm database chậm đi mọi mặt','あらゆる面で DB を遅くする'],
  ['Chỉ ảnh hưởng tới lệnh DELETE','DELETE にだけ影響する']],
 1,
 'Index như mục lục sách: tra cứu nhảy thẳng tới trang cần, nhưng mỗi lần thêm/sửa nội dung phải cập nhật mọi mục lục — đọc nhanh hơn, ghi chậm hơn và tốn dung lượng.',
 'インデックスは本の目次のようなもの：目的のページへ直行できますが、内容の追加・変更のたびに全目次を更新します。読みは速く、書きは遅く、容量も使います。',
 [['Sai — mọi index đều phải được duy trì khi dữ liệu thay đổi, đó là cái giá bắt buộc.','誤り — 全インデックスはデータ変更時に維持が必要で、それが必須のコストです。'],
  ['Đúng — vì thế index được tạo có chọn lọc theo truy vấn thực tế, không tạo vô tội vạ.','正解 — だからインデックスは実際のクエリに絞って作るものです。'],
  ['Sai — với truy vấn tìm kiếm, index tăng tốc rõ rệt chứ không làm chậm.','誤り — 検索クエリでは明確に高速化します。'],
  ['Sai — ảnh hưởng lớn nhất là ở INSERT và UPDATE (phải ghi vào index), không riêng DELETE.','誤り — 最も影響が大きいのは INSERT と UPDATE です。']]),
FQ('Database','データベース',
 'PITR (Point-In-Time Recovery — khôi phục tới một điểm thời gian) cho phép điều gì?',
 'PITR（ポイントインタイムリカバリ）でできることは？',
 [['Tăng số kết nối tối đa của database','DB の最大接続数を増やす'],
  ['Khôi phục database về trạng thái tại một giây cụ thể trong quá khứ, vd ngay trước lúc ai đó chạy DELETE nhầm','過去の特定の秒の状態へ復旧できる。例：誤った DELETE の直前'],
  ['Tự động cân bằng tải giữa các replica','レプリカ間の負荷を自動分散する'],
  ['Mã hoá dữ liệu khi truyền','転送中のデータを暗号化する']],
 1,
 'PITR kết hợp bản backup đầy đủ + nhật ký thay đổi (transaction log) để “quay phim ngược” tới đúng thời điểm trước sự cố — công cụ cứu dữ liệu kinh điển khi thao tác nhầm.',
 'PITR はフルバックアップ＋トランザクションログで、障害直前の時点まで「巻き戻す」仕組み。誤操作からのデータ救済の決定打です。',
 [['Sai — số kết nối là tham số cấu hình (max_connections), không liên quan khôi phục.','誤り — 接続数は設定パラメータで、復旧とは無関係です。'],
  ['Đúng — chọn đúng thời điểm “trước khi hỏng” là toàn bộ giá trị của PITR.','正解 — 「壊れる直前」を選べることこそ PITR の価値です。'],
  ['Sai — cân bằng tải đọc là vai trò của replica/proxy, không phải PITR.','誤り — 読み取り分散はレプリカ/プロキシの役割です。'],
  ['Sai — mã hoá khi truyền là TLS, một lớp bảo mật khác hẳn.','誤り — 転送暗号化は TLS で、全く別の層です。']]),
/* ---- Chương 9 · Scripting ---- */
FQ('Scripting','スクリプト',
 'Cần tự động hoá việc quản trị hàng loạt máy Windows Server trong domain (đọc trạng thái dịch vụ, sửa cấu hình AD). Công cụ tự nhiên nhất?',
 'ドメイン内の多数の Windows Server を一括管理（サービス状態取得、AD 設定変更）する。最も自然なツールは？',
 [['Bash','Bash'],
  ['PowerShell — sinh ra cho Windows, thao tác theo đối tượng và có sẵn module quản trị AD','PowerShell — Windows のために生まれ、オブジェクト操作と AD 管理モジュールが揃っている'],
  ['SQL','SQL'],
  ['HTML','HTML']],
 1,
 'PowerShell là shell + ngôn ngữ quản trị gốc của Windows với cmdlet theo đối tượng và module Active Directory chuyên dụng; Bash là của thế giới Linux.',
 'PowerShell は Windows 純正の管理シェルで、オブジェクト指向の cmdlet と Active Directory 専用モジュールを持ちます。Bash は Linux の世界です。',
 [['Sai — Bash là shell của Linux/macOS; đưa sang Windows Server quản trị AD là đi đường vòng.','誤り — Bash は Linux/macOS のシェルで、Windows の AD 管理には遠回りです。'],
  ['Đúng — quy tắc “việc của OS nào dùng shell của OS đó”.','正解 — 「その OS の仕事はその OS のシェルで」の原則です。'],
  ['Sai — SQL là ngôn ngữ truy vấn dữ liệu trong database, không quản trị hệ điều hành.','誤り — SQL は DB の問い合わせ言語で、OS 管理はできません。'],
  ['Sai — HTML là ngôn ngữ đánh dấu trang web, không thực thi được tác vụ nào.','誤り — HTML は Web のマークアップ言語で、タスクは実行できません。']]),
FQ('Scripting','スクリプト',
 'Đoạn script tự động hoá có nhiều điều kiện rẽ nhánh, xử lý lỗi và gọi API của AWS bằng thư viện sẵn có. Lựa chọn hợp lý nhất?',
 '分岐やエラー処理が多く、AWS の API を既存ライブラリで叩く自動化スクリプト。最も合理的な選択は？',
 [['Bash thuần','素の Bash'],
  ['Python — mạnh về logic, xử lý lỗi, và có boto3 là SDK chuẩn cho AWS','Python — ロジックとエラー処理に強く、AWS 標準 SDK の boto3 がある'],
  ['PowerShell trên mọi hệ','全環境で PowerShell'],
  ['Viết bằng file batch (.bat)','バッチファイル（.bat）']],
 1,
 'Khi script vượt khỏi “chạy nối vài lệnh” và bắt đầu có logic + gọi API, Python thắng nhờ cấu trúc rõ, thư viện khổng lồ và SDK cloud chính thức (boto3, google-cloud-*).',
 '「数コマンドの連結」を超えてロジック＋API 呼び出しになると、Python が構造の明快さ、巨大なライブラリ、公式クラウド SDK（boto3 等）で勝ります。',
 [['Sai — Bash vẫn làm được nhưng code nhanh chóng rối và xử lý lỗi rất vất vả.','誤り — Bash でも書けますが、すぐに複雑化しエラー処理が苦しくなります。'],
  ['Đúng — đây chính là vùng đất của Python trong vận hành cloud.','正解 — ここがクラウド運用における Python の本領です。'],
  ['Sai — PowerShell mạnh trong hệ Windows; bài toán này là API cloud đa nền tảng.','誤り — PowerShell は Windows 系の強者で、この課題はクロスプラットフォームなクラウド API です。'],
  ['Sai — .bat là ngôn ngữ kịch bản cổ của Windows, khả năng logic và thư viện rất hạn chế.','誤り — .bat は古い Windows の仕組みで、ロジックもライブラリも貧弱です。']]),
FQ('Scripting','スクリプト',
 'Điều gì sai nghiêm trọng trong thói quen viết access key của AWS trực tiếp vào đầu file script rồi commit lên Git?',
 'AWS のアクセスキーをスクリプト冒頭に直書きして Git へコミットする習慣の、何が致命的に間違っているか？',
 [['Không có gì sai nếu repo để private','プライベートリポジトリなら問題ない'],
  ['Bí mật đã commit thì lộ vĩnh viễn trong lịch sử Git — kể cả xoá file sau đó; phải để bí mật ở biến môi trường / Secrets Manager và xoay khoá ngay nếu đã lộ','コミットした秘密は履歴に永遠に残り、後で消しても漏れている。秘密は環境変数 / Secrets Manager に置き、漏れたら即ローテーションする'],
  ['Chỉ sai ở chỗ làm file script dài thêm','スクリプトが長くなるだけ'],
  ['Sai vì access key hết hạn sau 1 giờ','アクセスキーは1時間で失効するため']],
 1,
 'Git lưu toàn bộ lịch sử: xoá key ở commit sau không xoá được key trong các commit trước. Bất kỳ ai/clone nào có repo đều moi lại được — xử lý đúng là thu hồi + cấp khoá mới ngay.',
 'Git は全履歴を保持します：後のコミットで消しても過去のコミットに残ります。リポジトリを持つ者は誰でも掘り出せるため、正しい対応は即時の失効と再発行です。',
 [['Sai — repo private vẫn có người, có clone, có log CI; “private” không phải két sắt cho bí mật đã commit.','誤り — プライベートでも人・クローン・CI ログが存在し、「プライベート」は金庫ではありません。'],
  ['Đúng — đây là sự cố bảo mật thật sự, không phải chuyện phong cách code.','正解 — これは様式の問題ではなく本物のセキュリティ事故です。'],
  ['Sai — độ dài file không phải vấn đề; vấn đề là lộ thông tin xác thực.','誤り — 長さは問題ではありません。認証情報の露出が問題です。'],
  ['Sai — access key dài hạn không tự hết hạn sau 1 giờ; đó là thông tin xác thực tạm thời (session token).','誤り — 長期アクセスキーは1時間で失効しません。それは一時認証情報（セッショントークン）の話です。']]),
FQ('Scripting','スクリプト',
 'Một script Bash chạy hoàn hảo trên laptop Windows (soạn bằng Notepad) nhưng đưa lên server Linux thì báo lỗi khó hiểu ở dòng đầu tiên. Nguyên nhân quen thuộc?',
 'Windows のメモ帳で書いた Bash スクリプトが、Linux サーバーでは1行目から不可解なエラーになる。お馴染みの原因は？',
 [['Server Linux thiếu RAM','Linux サーバーのメモリ不足'],
  ['File dính ký tự xuống dòng kiểu Windows (CRLF) — Linux mong đợi LF, ký tự \\r thừa làm hỏng câu lệnh','改行コードが Windows 式（CRLF）— Linux は LF を期待し、余分な \\r がコマンドを壊す'],
  ['Script chưa được biên dịch','スクリプトがコンパイルされていない'],
  ['Bash không chạy được file .sh','Bash は .sh ファイルを実行できない']],
 1,
 'CRLF vs LF là khác biệt kinh điển khi chuyển file giữa Windows và Linux; ký tự \\r bị Bash coi là một phần của lệnh (vd tên lệnh bị dính \\r) nên lỗi trông rất “ma”. Khắc phục: dos2unix hoặc soạn bằng editor đặt LF.',
 'CRLF と LF は Windows ⇔ Linux 間の古典的な差異です。\\r がコマンドの一部とみなされ、不可解なエラーになります。対処は dos2unix か、LF 設定のエディタで書くこと。',
 [['Sai — thiếu RAM cho lỗi kiểu bị kill (OOM), không phải lỗi ngay dòng đầu.','誤り — メモリ不足は OOM で kill される形のエラーで、1行目のエラーとは違います。'],
  ['Đúng — gặp lỗi “ma” khi chuyển script Windows → Linux, hãy nghĩ tới CRLF đầu tiên.','正解 — Windows → Linux で不可解なエラーなら、まず CRLF を疑いましょう。'],
  ['Sai — Bash là ngôn ngữ thông dịch, không cần biên dịch.','誤り — Bash はインタプリタ型でコンパイル不要です。'],
  ['Sai — .sh là đuôi chuẩn của script shell; Bash chạy bình thường.','誤り — .sh は標準の拡張子で、Bash は普通に実行できます。']]),
/* ---- Chương 10 · Git ---- */
FQ('Git','Git',
 'Bạn vừa git commit xong trên máy mình. Đồng đội phàn nàn chưa thấy thay đổi trên GitHub. Vì sao?',
 '自分のマシンで git commit したのに、GitHub に変更が見えないと言われた。なぜか？',
 [['Commit cần được duyệt bởi quản trị GitHub','コミットには GitHub 管理者の承認が要る'],
  ['Commit chỉ ghi vào repo local — phải git push mới đưa lên remote','コミットはローカルリポジトリへの記録のみ — リモートへは git push が必要'],
  ['Phải đợi GitHub đồng bộ sau 24 giờ','GitHub の同期に24時間かかる'],
  ['Commit chỉ áp dụng cho file mới, file sửa thì không','コミットは新規ファイルにしか効かない']],
 1,
 'Git là hệ phân tán: commit là thao tác thuần local. Chuỗi đầy đủ là sửa → add → commit (local) → push (lên remote) → đồng đội pull (về máy họ).',
 'Git は分散型：コミットは完全にローカルの操作です。完全な流れは 編集 → add → commit（ローカル）→ push（リモート）→ 仲間が pull（自マシンへ）。',
 [['Sai — GitHub không duyệt từng commit; kiểm soát nằm ở quyền push và PR review.','誤り — GitHub が個別承認はしません。統制は push 権限と PR レビューです。'],
  ['Đúng — “commit rồi mà chưa push” là nhầm lẫn số 1 của người mới học Git.','正解 — 「コミットしたのに push していない」は初心者の誤解ナンバーワンです。'],
  ['Sai — push thành công là thấy ngay, không có độ trễ 24 giờ nào.','誤り — push が成功すれば即座に見えます。24時間の遅延はありません。'],
  ['Sai — commit ghi lại thay đổi của mọi file đã được add, cả mới lẫn sửa lẫn xoá.','誤り — コミットは add された全ファイル（新規・変更・削除）を記録します。']]),
FQ('Git','Git',
 'Pull Request (PR) trong quy trình nhóm đóng vai trò gì?',
 'チーム開発におけるプルリクエスト（PR）の役割は？',
 [['Là bản sao lưu của repo','リポジトリのバックアップ'],
  ['Là đề xuất gộp một nhánh vào nhánh khác, kèm review và thảo luận — cổng kiểm soát chất lượng trước khi code vào main','ブランチのマージ提案で、レビューと議論を伴う — main へ入る前の品質ゲート'],
  ['Là lệnh tải code mới nhất về máy','最新コードを取得するコマンド'],
  ['Là cách xoá nhánh từ xa','リモートブランチの削除方法']],
 1,
 'PR biến việc merge thành một sự kiện được nhìn thấy: diff rõ ràng, đồng đội review, CI chạy kiểm tra — qua được mới vào main. Đây là chuẩn làm việc của mọi đội hạ tầng.',
 'PR はマージを「見えるイベント」に変えます：差分が明確になり、レビューが入り、CI が検査し、通過して初めて main へ入ります。あらゆるインフラチームの標準です。',
 [['Sai — sao lưu là tính chất của việc repo phân tán/clone, không phải vai trò của PR.','誤り — バックアップは分散リポジトリの性質で、PR の役割ではありません。'],
  ['Đúng — nhớ PR = merge có review, không phải một lệnh Git thuần.','正解 — PR ＝ レビュー付きマージ、と覚えましょう。'],
  ['Sai — tải code mới nhất là git pull, một lệnh khác hẳn.','誤り — 最新取得は git pull という別コマンドです。'],
  ['Sai — xoá nhánh là thao tác riêng, không qua PR.','誤り — ブランチ削除は別の操作で、PR は経由しません。']]),
FQ('Git','Git',
 'Khi merge hai nhánh mà cả hai cùng sửa đúng một dòng trong cùng một file, Git sẽ làm gì?',
 '2つのブランチが同じファイルの同じ行を両方とも編集していた場合、マージ時に Git はどうするか？',
 [['Tự chọn bản mới hơn theo thời gian','時刻の新しい方を自動で選ぶ'],
  ['Báo conflict (xung đột) và dừng lại, để người dùng chọn/chắp nối nội dung đúng','コンフリクトとして停止し、人間が正しい内容を選ぶ/繋ぐ'],
  ['Giữ bản của nhánh main, xoá bản còn lại','main 側を残し他方を削除する'],
  ['Nhân đôi file thành hai bản','ファイルを2つに複製する']],
 1,
 'Git chỉ tự merge khi các thay đổi không chạm nhau; cùng sửa một chỗ thì nó không dám quyết thay con người — đánh dấu conflict trong file và chờ bạn sửa rồi commit.',
 'Git が自動マージできるのは変更が重ならない場合だけ。同じ箇所の編集は人間でなければ判断できず、ファイルにコンフリクトを印して解決とコミットを待ちます。',
 [['Sai — Git không dùng tiêu chí thời gian để phân xử nội dung.','誤り — Git は時刻で内容を裁定しません。'],
  ['Đúng — conflict không phải lỗi hỏng hóc mà là Git “hỏi ý kiến” đúng lúc cần.','正解 — コンフリクトは故障ではなく、必要な場面で Git が判断を仰いでいる状態です。'],
  ['Sai — Git không âm thầm vứt thay đổi của bất kỳ phía nào.','誤り — Git がどちらの変更も黙って捨てることはありません。'],
  ['Sai — Git sửa ngay trong cùng file với các dấu đánh dấu conflict, không nhân đôi file.','誤り — Git は同じファイル内に競合マーカーを入れます。複製はしません。']]),
FQ('Git','Git',
 'Vì sao đội hạ tầng lưu code Terraform trong Git thay vì để file trên một máy cá nhân?',
 'インフラチームが Terraform コードを個人 PC でなく Git に置く理由は？',
 [['Vì Terraform bắt buộc phải có Git mới chạy','Terraform の実行に Git が必須だから'],
  ['Vì Git cho lịch sử ai đổi gì/khi nào, review qua PR trước khi áp dụng, và khôi phục lại trạng thái hạ tầng trước đó','誰が・いつ・何を変えたかの履歴、適用前の PR レビュー、以前の状態への復旧が得られるから'],
  ['Vì Git giúp terraform apply chạy nhanh hơn','terraform apply が速くなるから'],
  ['Vì file Terraform quá lớn cho ổ cứng cá nhân','ファイルが大きすぎて個人のディスクに入らないから']],
 1,
 'Hạ tầng dạng code (IaC) cần đúng những gì Git cung cấp cho code thường: truy vết thay đổi, cổng review, và khả năng quay lui — “ai đã mở cổng 22 ra internet, ở commit nào” là câu hỏi Git trả lời được ngay.',
 'IaC は通常のコードと同じく Git の提供物（変更の追跡、レビューの関門、巻き戻し）を必要とします。「誰がどのコミットで22番を全開放したか」に Git は即答できます。',
 [['Sai — Terraform chạy độc lập hoàn toàn, không cần Git.','誤り — Terraform は Git なしで完全に動作します。'],
  ['Đúng — ba giá trị: truy vết, review, quay lui.','正解 — 追跡・レビュー・巻き戻しの3つの価値です。'],
  ['Sai — Git không ảnh hưởng tốc độ apply.','誤り — Git は apply の速度に影響しません。'],
  ['Sai — file Terraform là text thuần, dung lượng rất nhỏ.','誤り — Terraform ファイルはプレーンテキストで容量はごく小さいです。']])
);

/* ================================================================
   C · DỮ LIỆU 14 TÌNH HUỐNG SỰ CỐ
   Mỗi tình huống: sym (triệu chứng) · steps (quy trình xử lý) ·
   causes (nguyên nhân gốc thường gặp) · checks (lệnh/công cụ) ·
   prevent (phòng ngừa). tg: aws | gcp | k8s | gen.
   ================================================================ */
var SC=[
{id:'ec2cpu', tg:'aws', ic:'🔥',
 t:['EC2 CPU tăng 100% liên tục','EC2 の CPU が100%に張り付く'],
 sym:['CloudWatch báo CPUUtilization ~100% nhiều phút liền; SSH vào máy rất chậm, ứng dụng phản hồi ì ạch hoặc timeout.',
      'CloudWatch の CPUUtilization が数分間 ~100%。SSH は非常に重く、アプリ応答が遅い/タイムアウトする。'],
 steps:[['Xác nhận phạm vi: một instance hay cả fleet (Auto Scaling group)? Mở đầu bằng metric, đừng đoán.','範囲の確認：1台かフリート（Auto Scaling グループ）全体か。推測でなくメトリクスから始める。'],
       ['SSH vào máy, chạy top/htop: tiến trình nào chiếm CPU, là tiến trình lạ hay chính ứng dụng?','SSH で top/htop：どのプロセスが CPU を食っているか。見慣れないプロセスか、自アプリか。'],
       ['Nếu là ứng dụng: kiểm tra deploy gần nhất, traffic có tăng thật không (log truy cập), có vòng lặp/restart liên tục của dịch vụ không (systemctl status, journalctl).','アプリなら：直近のデプロイ、実際のトラフィック増、サービスの再起動ループ（systemctl status、journalctl）を確認。'],
       ['Nếu là tiến trình lạ (vd tên ngẫu nhiên, đào coin): coi là sự cố bảo mật — cô lập instance bằng Security Group, chụp snapshot đĩa để điều tra, không xoá ngay bằng chứng.','見慣れないプロセス（採掘など）ならセキュリティ事案として扱う：Security Group で隔離し、ディスクのスナップショットを保全。証拠を消さない。'],
       ['Giảm tải trước khi tìm hiểu sâu: tăng tạm instance size hoặc thêm instance sau ALB; sau đó mới tối ưu code/truy vấn gây tải.','深掘り前に負荷を逃がす：一時的にインスタンスを大きくするか ALB 後ろに台数を増やし、その後で原因のコード/クエリを直す。']],
 causes:[['Deploy mới có lỗi gây vòng lặp vô hạn hoặc retry bão hoà','新デプロイのバグによる無限ループやリトライ嵐'],
        ['Traffic thật tăng đột biến (chiến dịch, bot) vượt sức instance','実トラフィックの急増（キャンペーン、ボット）がインスタンスの限界超え'],
        ['Máy bị xâm nhập để đào tiền mã hoá (cryptomining)','侵害されて暗号通貨の採掘に使われている'],
        ['Tác vụ nền (backup, quét virus, cron) chạy trùng giờ cao điểm','バックグラウンド処理（バックアップ、スキャン、cron）がピーク時間と重なった']],
 checks:['top -o %CPU   # tiến trình ăn CPU nhất','ps aux --sort=-%cpu | head','aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=i-xxxx --statistics Average --period 300 --start-time ... --end-time ...'],
 prevent:[['Đặt alarm CPU kèm hành động (thông báo + Auto Scaling) thay vì đợi người dùng báo','CPU アラームに通知＋Auto Scaling のアクションを設定し、利用者の申告待ちにしない'],
         ['Giới hạn CPU cho tiến trình nền; tách lịch chạy batch khỏi giờ cao điểm','バックグラウンド処理に CPU 制限をかけ、バッチをピーク時間からずらす'],
         ['Bật GuardDuty và xem xét bất thường CPU như một tín hiệu bảo mật','GuardDuty を有効化し、CPU 異常をセキュリティのシグナルとしても扱う']]},
{id:'rdsconn', tg:'aws', ic:'🗄️',
 t:['RDS hết connection — ứng dụng báo “too many connections”','RDS の接続枯渇 — アプリが「too many connections」を出す'],
 sym:['Ứng dụng lỗi 500 hàng loạt; log đầy “FATAL: too many connections” / “remaining connection slots are reserved”; CloudWatch metric DatabaseConnections chạm trần max_connections.',
      'アプリが大量に500を返す。ログは「FATAL: too many connections」で埋まり、DatabaseConnections が max_connections の上限に張り付く。'],
 steps:[['Xem metric DatabaseConnections theo thời gian: tăng vọt đột ngột (rò rỉ sau deploy) hay leo thang đều (tăng trưởng thật)?','DatabaseConnections の時系列を見る：急騰（デプロイ後のリーク）か、漸増（実成長）か。'],
       ['Xác định ai đang giữ kết nối: truy vấn pg_stat_activity (PostgreSQL) / SHOW PROCESSLIST (MySQL) — user, ứng dụng nguồn, trạng thái idle bao nhiêu.','接続の持ち主を特定：pg_stat_activity（PostgreSQL）/ SHOW PROCESSLIST（MySQL）で、ユーザー、接続元、idle 数を確認。'],
       ['Khắc phục khẩn: ngắt các kết nối idle lâu (pg_terminate_backend), khởi động lại các instance ứng dụng nghi rò rỉ kết nối.','緊急対処：長く idle な接続を切断（pg_terminate_backend）し、リーク疑いのアプリを再起動。'],
       ['Giải pháp gốc: đặt connection pool (RDS Proxy hoặc pool phía ứng dụng như PgBouncer/HikariCP), chỉnh timeout đóng kết nối idle, và chỉ tăng max_connections / cỡ instance khi đã chắc chắn là tăng trưởng thật.','恒久策：接続プール（RDS Proxy / PgBouncer / HikariCP）を入れ、idle タイムアウトを設定。本当に成長が原因と確認できたら max_connections / サイズを見直す。']],
 causes:[['Ứng dụng mở kết nối mà không đóng (rò kết nối), nhất là sau bản deploy mới','アプリが接続を閉じない（接続リーク）。特に新デプロイ後'],
        ['Mỗi instance ứng dụng tự giữ pool quá lớn — scale số instance làm tổng kết nối vượt trần','アプリ各台のプールが大きすぎて、台数スケールで総接続数が上限超え'],
        ['Job báo cáo/batch mở hàng trăm kết nối song song vào giờ cao điểm','レポート/バッチがピーク時に数百接続を並行で開く'],
        ['max_connections của instance class nhỏ không còn theo kịp quy mô','小さいインスタンスクラスの max_connections が規模に追いついていない']],
 checks:["SELECT count(*), state FROM pg_stat_activity GROUP BY state;",'SHOW FULL PROCESSLIST;  -- MySQL','aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name DatabaseConnections ...'],
 prevent:[['Luôn dùng connection pool; đặt trần tổng = số instance × pool size và alarm ở 80% trần','接続プールを必須にし、総量＝台数×プール数を上限管理。80% でアラーム'],
         ['Đặt idle timeout ở cả phía ứng dụng và phía database','アプリ側と DB 側の両方に idle タイムアウトを設定'],
         ['Tách workload báo cáo sang read replica','レポート系ワークロードはリードレプリカへ分離']]},
{id:'dnsfail', tg:'gen', ic:'🏷️',
 t:['DNS không phân giải được — ping IP thông, tên miền không','DNS が解決できない — IP へは通るが名前が引けない'],
 sym:['Từ EC2/VM: ping 8.8.8.8 thành công nhưng curl https://api.example.com báo “Could not resolve host”; nslookup timeout hoặc trả về địa chỉ sai.',
      'EC2/VM から：ping 8.8.8.8 は成功するのに curl は「Could not resolve host」。nslookup がタイムアウト、または誤ったアドレスを返す。'],
 steps:[['Khoanh vùng: lỗi ở mọi tên miền hay chỉ một domain? Mọi máy trong VPC hay một máy?','切り分け：全ドメインか1つだけか。VPC 内の全マシンか1台だけか。'],
       ['Kiểm tra cấu hình resolver của máy: /etc/resolv.conf đang trỏ DNS nào; trong VPC phải là resolver của VPC (.2) hoặc DNS nội bộ đã chỉ định.','マシンのリゾルバ設定を確認：/etc/resolv.conf がどこを向いているか。VPC 内では VPC リゾルバ（.2）か指定の内部 DNS であるべき。'],
       ['Hỏi thẳng từng tầng: dig @<resolver-của-VPC> tên, rồi dig @8.8.8.8 tên — nơi nào trả sai thì lỗi ở tầng đó (cấu hình máy, resolver VPC, hay bản ghi phía authoritative).','各層へ直接聞く：dig @<VPCリゾルバ> 名前、dig @8.8.8.8 名前 — 誤答が返る層が障害点（マシン設定、VPC リゾルバ、権威側レコード）。'],
       ['Nếu là domain nội bộ: kiểm tra Route 53 Private Hosted Zone đã gắn đúng VPC chưa, DHCP options set có phát đúng DNS không; GCP kiểm tra Cloud DNS private zone và chính sách DNS của VPC.','内部ドメインなら：Route 53 プライベートホストゾーンが正しい VPC に関連付いているか、DHCP オプションセットの DNS が正しいか。GCP は Cloud DNS プライベートゾーンと VPC の DNS ポリシーを確認。'],
       ['Nếu vừa sửa bản ghi: nghĩ tới TTL/cache — so sánh kết quả dig từ nhiều resolver trước khi kết luận “chưa cập nhật”.','レコードを変更した直後なら TTL/キャッシュを疑う。複数リゾルバの dig 結果を比べる前に「未反映」と断定しない。']],
 causes:[['Máy bị cấu hình DNS công cộng thay vì resolver của VPC nên mất toàn bộ tên nội bộ','端末が VPC リゾルバでなく公共 DNS を向き、内部名が全て引けない'],
        ['Private Hosted Zone chưa gắn với VPC (lỗi kinh điển sau khi tạo zone ở tài khoản khác)','プライベートホストゾーンが VPC に関連付いていない（別アカウントで作った後の古典的ミス）'],
        ['Bản ghi vừa đổi, resolver khắp nơi còn giữ bản ghi cũ theo TTL','レコード変更直後で、各リゾルバが TTL まで旧レコードを保持'],
        ['Security Group / firewall chặn UDP 53 tới resolver','Security Group / ファイアウォールがリゾルバへの UDP 53 を遮断']],
 checks:['cat /etc/resolv.conf','dig api.example.com','dig @169.254.169.253 api.example.com   # resolver của VPC trên AWS','nslookup api.example.com'],
 prevent:[['Quản lý DHCP options set / DNS policy bằng IaC để mọi máy mới đều nhận đúng resolver','DHCP オプションセット / DNS ポリシーを IaC 管理し、新規マシンが必ず正しいリゾルバを受け取る'],
         ['Kiểm tra phân giải tên nội bộ trong checklist sau deploy','デプロイ後チェックリストに内部名の解決確認を含める'],
         ['Hạ TTL trước các đợt chuyển đổi DNS theo kế hoạch','計画的な DNS 切替の前に TTL を下げておく']]},
{id:'alb502', tg:'aws', ic:'🚪',
 t:['ALB trả lỗi 502 Bad Gateway','ALB が 502 Bad Gateway を返す'],
 sym:['Người dùng nhận 502 từ Application Load Balancer; target group báo healthy thấp hoặc toàn bộ unhealthy; metric HTTPCode_ELB_502_Count tăng vọt.',
      'ユーザーが ALB から502を受け取る。ターゲットグループの healthy が低下/全滅し、HTTPCode_ELB_502_Count が急増。'],
 steps:[['Phân biệt họ lỗi trước: 502 = ALB liên lạc được target nhưng response sai/thất bại; 503 = không có target healthy nào; 504 = target không trả lời kịp (timeout).','まずエラーの系統を分ける：502＝ターゲットへ届いたが応答が不正/失敗、503＝healthy なターゲットなし、504＝ターゲットが時間内に応答しない。'],
       ['Nhìn target health và lý do unhealthy: health check đang gọi đường dẫn nào, cổng nào; ứng dụng có trả 200 ở đường dẫn đó không (curl thẳng vào instance qua IP private).','ターゲットの health と unhealthy 理由を見る：ヘルスチェックのパスとポート、そのパスへ（プライベート IP 直通で curl）200 が返るか。'],
       ['Kiểm tra Security Group hai chiều: SG của ALB được ra, SG của target phải cho phép vào <i>từ SG của ALB</i> đúng cổng ứng dụng.','双方向の Security Group を確認：ALB の SG は外向き可、ターゲットの SG は「ALB の SG から」アプリのポートで入れること。'],
       ['Vào instance kiểm tra ứng dụng: tiến trình còn chạy không (systemctl status), cổng có nghe không (ss -lntp), log ứng dụng và /var/log — crash, hết bộ nhớ (OOM) hay deploy dở đều lộ ở đây.','インスタンスへ入りアプリを確認：プロセス生存（systemctl status）、ポート待受（ss -lntp）、アプリログと /var/log — クラッシュ、OOM、中途半端なデプロイはここに出る。'],
       ['Nếu ứng dụng chạy nhưng vẫn 502: đối chiếu giao thức/cổng của target group (HTTP vs HTTPS, cổng 80 vs 8080) và thời gian phản hồi — app chậm quá idle timeout của ALB cũng sinh 502/504.','アプリが動いているのに502なら：ターゲットグループのプロトコル/ポート（HTTP vs HTTPS、80 vs 8080）と応答時間を突き合わせる。遅すぎると ALB のアイドルタイムアウトで 502/504 になる。']],
 causes:[['Ứng dụng trên target đã chết/crash (OOM — Out Of Memory, hết bộ nhớ — là thủ phạm quen thuộc)','ターゲット上のアプリが停止/クラッシュ（OOM が常連）'],
        ['Health check cấu hình sai đường dẫn hoặc cổng nên target bị đánh dấu unhealthy dù app sống','ヘルスチェックのパス/ポート誤設定で、アプリ生存でも unhealthy 判定'],
        ['Security Group của target không cho ALB vào đúng cổng','ターゲットの SG が ALB からの該当ポートを許可していない'],
        ['Deploy dở: target mới chưa sẵn sàng đã nhận traffic, hoặc deregistration chưa xong','デプロイ不整合：新ターゲット未準備でトラフィックを受けた、登録解除の途中']],
 checks:['aws elbv2 describe-target-health --target-group-arn <arn>','curl -v http://<private-ip>:<port>/health   # từ một máy trong VPC','ss -lntp; systemctl status <app>; journalctl -u <app> -n 100'],
 prevent:[['Health check dùng endpoint /health nhẹ, tách khỏi trang chủ nặng','ヘルスチェックは軽い /health エンドポイント専用にし、重いトップページと分ける'],
         ['Alarm theo HTTPCode_ELB_502_Count và số target healthy','HTTPCode_ELB_502_Count と healthy ターゲット数でアラーム'],
         ['Deploy kiểu rolling/blue-green để luôn có target sẵn sàng','ローリング/ブルーグリーンデプロイで常に受けられるターゲットを残す']]},
{id:'crashloop', tg:'k8s', ic:'☸️',
 t:['Pod CrashLoopBackOff trên Kubernetes','Kubernetes で Pod が CrashLoopBackOff'],
 sym:['kubectl get pods cho trạng thái CrashLoopBackOff, số lần RESTARTS tăng liên tục; ứng dụng chớp tắt — container khởi động rồi chết, Kubernetes lùi thời gian chờ (back-off) rồi thử lại.',
      'kubectl get pods で CrashLoopBackOff、RESTARTS が増え続ける。コンテナが起動しては落ち、Kubernetes が待ち時間（back-off）を延ばして再試行する。'],
 steps:[['Đọc sự kiện trước: kubectl describe pod — xem lý do khởi động thất bại, lỗi kéo image, hay probe.','まずイベントを読む：kubectl describe pod — 起動失敗の理由、イメージ取得エラー、プローブを確認。'],
       ['Xem log của lần chạy <i>trước</i>: kubectl logs --previous — container chết rồi nên log hiện tại thường trống; log của instance đã crash mới chứa lỗi thật (thiếu biến môi trường, kết nối DB sai, cú pháp cấu hình).','<i>前回</i>のログを見る：kubectl logs --previous — 落ちた後は現行ログが空のことが多く、クラッシュした回のログに本当のエラー（環境変数不足、DB 接続ミス、設定ミス）がある。'],
       ['Phân biệt hai họ: app tự thoát (lỗi code/cấu hình — sửa ở bước 2) khác với bị giết: cột REASON trong describe cho OOMKilled (thiếu memory limit/request) hoặc Liveness probe failed (probe gọi sai đường dẫn/cổng, hoặc app khởi động chậm hơn probe).','2系統を分ける：アプリ自身の終了（コード/設定ミス）と、殺されているケース。describe の REASON に OOMKilled（メモリ不足）や Liveness probe failed（プローブのパス/ポート誤り、起動が遅すぎる）が出る。'],
       ['Kiểm tra đầu vào của pod: ConfigMap/Secret có tồn tại và đúng key không, biến môi trường bắt buộc, image tag có thật trong registry không (ImagePullBackOff là họ hàng gần).','Pod の入力を確認：ConfigMap/Secret の存在とキー、必須の環境変数、レジストリに実在するイメージタグか（ImagePullBackOff は近縁）。'],
       ['Sửa xong kiểm chứng bằng rollout status và quan sát RESTARTS ngừng tăng; đừng chỉ nhìn pod Running trong 10 giây đầu.','修正後は rollout status で確認し、RESTARTS が増え止まるまで観察する。最初の10秒の Running だけで判断しない。']],
 causes:[['Thiếu/sai biến môi trường hoặc Secret khiến app thoát ngay khi khởi động','環境変数や Secret の不足/誤りで起動直後に終了'],
        ['Kết nối database sai (endpoint, mật khẩu) — app crash thay vì chờ','DB 接続（エンドポイント、パスワード）誤り — アプリが待たずに落ちる'],
        ['OOMKilled: container vượt memory limit, nhân (kernel) giết để bảo vệ node','OOMKilled：コンテナがメモリ上限を超え、カーネルがノード保護のために kill'],
        ['Liveness probe quá hung hăng: app chưa kịp lên đã bị probe kết luận chết và restart','ライブネスプローブが攻撃的すぎる：起動完了前に「死んだ」と判定して再起動']],
 checks:['kubectl describe pod <pod> -n <ns>','kubectl logs <pod> -n <ns> --previous','kubectl get events -n <ns> --sort-by=.lastTimestamp'],
 prevent:[['Đặt readiness probe để pod chưa sẵn sàng không nhận traffic; liveness nới tay hơn readiness','レディネスプローブで未準備の Pod にトラフィックを入れない。ライブネスはレディネスより緩く'],
         ['Khai báo requests/limits theo số đo thật; kiểm tra cấu hình bắt buộc ngay từ CI (schema/env validation)','requests/limits は実測に基づいて設定。必須設定の検証を CI に入れる'],
         ['Test image ở môi trường staging giống production trước khi rollout','本番同等のステージングでイメージを検証してからロールアウト']]},
{id:'gcpssh', tg:'gcp', ic:'🔑',
 t:['GCP VM không SSH được','GCP の VM に SSH できない'],
 sym:['Bấm SSH trên Console quay vòng rồi báo không kết nối được, hoặc gcloud compute ssh timeout; VM vẫn chạy, website trên VM có thể vẫn mở bình thường.',
      'コンソールの SSH がぐるぐる回って接続失敗、または gcloud compute ssh がタイムアウト。VM は稼働中で、上の Web サイトは開ける場合もある。'],
 steps:[['Tách lớp: VM có lên không (Console, serial port output), mạng có tới được cổng 22 không, hay tới nơi rồi xác thực khoá thất bại — ba lớp lỗi hoàn toàn khác nhau.','層を分ける：VM は起動しているか（コンソール、シリアル出力）、22番まで届くか、届いた上で鍵認証が失敗するのか — 3つは全く別の障害。'],
       ['Kiểm tra firewall rule của VPC: có rule cho phép ingress TCP 22 từ nguồn của bạn chưa — với SSH qua Console/IAP (Identity-Aware Proxy — proxy nhận biết danh tính) nguồn là dải 35.235.240.0/20 của IAP; trực tiếp thì là IP của bạn kèm network tag đúng.','VPC ファイアウォールルールを確認：あなたの送信元から TCP 22 の ingress が許可されているか。コンソール/IAP（Identity-Aware Proxy）経由なら送信元は IAP の 35.235.240.0/20、直接なら自分の IP と正しいネットワークタグ。'],
       ['Nếu dùng IAP: kiểm tra IAM role IAP-secured Tunnel User và tính năng IAP đã bật cho backend chưa.','IAP 利用時：IAP-secured Tunnel User の IAM ロールと、バックエンドの IAP 有効化を確認。'],
       ['Nếu mạng thông mà vẫn lỗi: xem metadata ssh-keys của VM/project có chứa khoá của bạn không, user tương ứng với khoá, và đĩa boot có đầy 100% khiến sshd không ghi được phiên không (xem cả tình huống “đĩa đầy”).','ネットワークが通るのに失敗するなら：VM/プロジェクトのメタデータ ssh-keys に自分の鍵があるか、鍵に対応するユーザーか、ブートディスク満杯で sshd がセッションを書けない状態でないか（「ディスク満杯」の事例も参照）。'],
       ['Đường vòng cứu hộ: bật serial console để đăng nhập điều tra khi SSH chết hẳn; trên AWS tương đương là EC2 Serial Console / Session Manager.','救済路：SSH が完全に死んだらシリアルコンソールを有効化して調査する。AWS では EC2 シリアルコンソール / Session Manager が相当。']],
 causes:[['Thiếu firewall rule cho TCP 22 (mạng mới tạo mặc định không còn rule mở sẵn như default network)','TCP 22 のファイアウォールルール不足（新規ネットワークには default ネットワークのような既定ルールがない）'],
        ['Dùng SSH qua IAP nhưng thiếu role hoặc sai dải nguồn 35.235.240.0/20','IAP 経由なのにロール不足、または送信元レンジ 35.235.240.0/20 の誤り'],
        ['Khoá SSH trong metadata bị ghi đè/xoá hoặc không khớp user','メタデータの ssh-keys が上書き/削除され、ユーザーと合っていない'],
        ['Đĩa boot đầy 100% khiến sshd từ chối phiên mới','ブートディスク100%で sshd が新規セッションを拒否']],
 checks:['gcloud compute ssh <vm> --zone <zone> --tunnel-through-iap -- -v','gcloud compute firewall-rules list --filter="network=<net>"','gcloud compute instances get-serial-port-output <vm> --zone <zone>'],
 prevent:[['Ưu tiên SSH qua IAP (không mở 22 ra Internet) và quản lý firewall bằng Terraform','IAP 経由 SSH を優先（22番をインターネットへ開けない）し、ファイアウォールは Terraform 管理'],
         ['Bật OS Login để quản lý khoá SSH theo IAM thay vì metadata thủ công','OS Login を有効化し、SSH 鍵をメタデータ手作業でなく IAM で管理'],
         ['Alarm mức dùng đĩa của boot disk','ブートディスク使用率のアラーム']]},
{id:'s3denied', tg:'aws', ic:'🔒',
 t:['S3 trả lỗi AccessDenied','S3 が AccessDenied を返す'],
 sym:['Ứng dụng hoặc CLI gọi S3 nhận 403 AccessDenied dù “đã cấp quyền rồi”; đôi khi chỉ lỗi với một số object hoặc chỉ khi bật mã hoá.',
      'アプリや CLI の S3 呼び出しが 403 AccessDenied。「権限は付けたはず」なのに起き、特定オブジェクトだけ、暗号化時のだけ、という場合もある。'],
 steps:[['Xác định danh tính thật đang gọi: role gắn với EC2/Lambda, user IAM, hay đang dùng nhầm profile/credential của môi trường khác (kiểm tra bằng sts get-caller-identity).','実際の呼び出し元を特定：EC2/Lambda のロールか IAM ユーザーか、別環境の認証情報を掴んでいないか（sts get-caller-identity で確認）。'],
       ['Đọc đủ 3 lớp quyền: (1) IAM policy của danh tính — đủ action (s3:GetObject khác s3:ListBucket) và đúng ARN (bucket ARN khác object ARN có /*) chưa; (2) Bucket policy có Deny nào ghi đè không; (3) S3 Block Public Access / ACL nếu là truy cập public.','権限の3層を読む：（1）IAM ポリシー — アクション（s3:GetObject と s3:ListBucket は別）と ARN（バケット ARN と /* 付きオブジェクト ARN）(2) Bucket policy に上書き Deny がないか (3) public 系なら Block Public Access / ACL。'],
       ['Nhớ quy tắc vàng: một Deny tường minh ở bất kỳ lớp nào cũng thắng mọi Allow.','黄金律を思い出す：明示的 Deny はどの層にあっても全ての Allow に勝つ。'],
       ['Nếu lỗi chỉ khi đọc object đã mã hoá SSE-KMS: cần thêm quyền kms:Decrypt trên đúng key — đây là lớp quyền thứ tư hay bị quên nhất.','SSE-KMS 暗号化オブジェクトでのみ失敗するなら、そのキーへの kms:Decrypt が必要 — 最も忘れられる「第4の権限層」。'],
       ['Dùng CloudTrail để xem sự kiện lỗi gốc (errorCode, userIdentity) và Policy Simulator / Access Analyzer để kiểm chứng trước khi sửa.','CloudTrail で実際のエラー（errorCode、userIdentity）を見て、Policy Simulator / Access Analyzer で事前検証してから直す。']],
 causes:[['Nhầm ARN: cấp quyền trên ARN bucket (…:::my-bucket) cho thao tác trên object (cần …:::my-bucket/*)','ARN の混同：オブジェクト操作にバケット ARN（…:::my-bucket）だけを与えている（…:::my-bucket/* が必要）'],
        ['Có câu lệnh Deny tường minh trong bucket policy hoặc SCP của tổ chức','Bucket policy や組織の SCP に明示的 Deny がある'],
        ['Thiếu quyền KMS đi kèm khi object mã hoá bằng SSE-KMS','SSE-KMS 暗号化時の KMS 権限不足'],
        ['Credential/role đang dùng không phải cái đã được cấp quyền (nhầm profile, quên gắn instance profile)','権限を付けた先と実際に使っている認証情報/ロールが違う（プロファイル違い、インスタンスプロファイル未装着）']],
 checks:['aws sts get-caller-identity','aws s3api get-bucket-policy --bucket <bucket>','aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetObject'],
 prevent:[['Cấp quyền bằng IaC và review policy như code; dùng Access Analyzer để phát hiện policy thừa/thiếu','権限は IaC で管理しポリシーをコードレビュー。Access Analyzer で過不足を検出'],
         ['Chuẩn hoá mẫu policy cho các pattern lặp lại (đọc bucket X, ghi prefix Y + quyền KMS tương ứng)','繰り返しパターンのポリシー雛形（バケット X 読取、プレフィックス Y 書込＋対応 KMS 権限）を標準化'],
         ['Alarm trên CloudTrail khi tỷ lệ lỗi 403 tăng đột biến','403 エラー率の急増に CloudTrail ベースのアラーム']]},
{id:'cwalert', tg:'aws', ic:'🔔',
 t:['CloudWatch alarm không gửi thông báo','CloudWatch アラームが通知を送らない'],
 sym:['Metric đã vượt ngưỡng rõ ràng nhưng không ai nhận được thông báo; vào xem thì alarm hoặc chưa từng vào trạng thái ALARM, hoặc vào ALARM rồi mà kênh thông báo im lặng.',
      'メトリクスは明らかに閾値を超えているのに誰にも通知が届かない。アラームが一度も ALARM 状態になっていないか、なっていても通知チャネルが静かなまま。'],
 steps:[['Kiểm tra trạng thái alarm trong Alarm history: alarm có thật sự chuyển ALARM không, hay đang INSUFFICIENT_DATA / vẫn OK vì cách tính (period, evaluation periods, statistic) khác điều bạn tưởng.','Alarm history を確認：本当に ALARM へ遷移したか、INSUFFICIENT_DATA のままか。集計方法（期間、評価期間、統計）が想定と違うこともある。'],
       ['Nếu không vào ALARM: soi lại metric — đúng namespace/dimension chưa (alarm gắn nhầm instance id, sai đơn vị), dữ liệu có bị thiếu khiến “treat missing data” nuốt mất sự cố không.','ALARM にならない場合：メトリクスを確認 — namespace/dimension の取り違え（別インスタンス ID）、欠損データの扱いで障害が飲み込まれていないか。'],
       ['Nếu đã ALARM mà không có thông báo: kiểm tra alarm actions có bật (actions enabled) và trỏ đúng SNS topic chưa; SNS topic có subscription đã <i>confirmed</i> chưa (email chưa bấm xác nhận là lỗi kinh điển), subscription có bị lọc bởi filter policy không.','ALARM なのに無通知の場合：アクション有効化と SNS トピックの向き、サブスクリプションが <i>confirmed</i> か（メール未確認が古典的ミス）、フィルターポリシーで弾かれていないか。'],
       ['Kiểm tra đầu cuối nhận: Lambda/chat/email đích còn sống không, quyền của SNS publish tới đích (vd key KMS của topic mã hoá cần quyền cho cloudwatch).','受け側を確認：宛先（Lambda/チャット/メール）が生きているか、SNS から宛先への権限（暗号化トピックの KMS キー権限など）。'],
       ['Test toàn trình bằng cách set alarm state thủ công (set-alarm-state) và xác nhận thông báo tới nơi — đừng đợi sự cố thật mới biết chuỗi thông báo gãy.','set-alarm-state で手動テストし、通知が届くまでを一気通貫で確認する。本物の障害で初めて壊れを知ることのないように。']],
 causes:[['Subscription của SNS chưa được xác nhận (email pending confirmation)','SNS サブスクリプションが未確認（メールが pending confirmation）'],
        ['Alarm gắn sai dimension nên theo dõi nhầm tài nguyên khác','アラームの dimension 誤りで別リソースを監視している'],
        ['Cấu hình “treat missing data” khiến lúc metric biến mất (chính là lúc hệ thống chết) alarm lại coi như không có chuyện gì','欠損データの扱い設定により、メトリクス消失（＝システム死亡）時に何事もなかったことにされる'],
        ['Alarm actions bị tắt (disable) sau một lần bảo trì rồi quên bật lại','メンテナンスでアクションを無効化したまま再有効化を忘れた']],
 checks:['aws cloudwatch describe-alarms --alarm-names <name>','aws cloudwatch describe-alarm-history --alarm-name <name>','aws sns list-subscriptions-by-topic --topic-arn <arn>'],
 prevent:[['Mọi alarm mới đều phải qua bài test set-alarm-state ngay khi tạo','新規アラームは作成直後に set-alarm-state でテスト必須'],
         ['Theo dõi cả “alarm không bao giờ kêu” bằng heartbeat: định kỳ gửi sự kiện thử qua cùng kênh','「決して鳴らないアラーム」を heartbeat で監視：同じ経路へ定期的に試験イベントを送る'],
         ['Quản lý alarm + SNS bằng IaC, review subscription trong cùng PR','アラームと SNS を IaC 管理し、サブスクリプションも同じ PR でレビュー']]},
{id:'diskfull', tg:'gen', ic:'💽',
 t:['Đĩa đầy 100% — dịch vụ chết hàng loạt','ディスク100% — サービスが次々死ぬ'],
 sym:['Ứng dụng báo lỗi ghi file, database từ chối ghi, SSH vào được nhưng nhiều lệnh thất bại; df -h cho thấy một phân vùng ở 100%.',
      'アプリが書き込みエラー、DB が書き込みを拒否。SSH は入れるが多くのコマンドが失敗。df -h でパーティションが100%。'],
 steps:[['Xác định phân vùng nào đầy và đầy vì cái gì: df -h để thấy phân vùng; du -xh --max-depth=1 / để khoanh thư mục phình to nhất (log, dữ liệu, file tạm).','どのパーティションが、何で満杯か：df -h でパーティション確認、du -xh --max-depth=1 / で膨らんだディレクトリ（ログ、データ、一時ファイル）を特定。'],
       ['Nếu df bảo còn trống mà app vẫn báo đầy: kiểm tra inode (df -i) — hết inode vì quá nhiều file nhỏ cũng là “đầy” mà dung lượng vẫn còn.','df は空きがあるのにアプリが満杯と言う場合：inode を確認（df -i）— 小ファイル過多で inode 枯渇も「満杯」。'],
       ['Giải phóng an toàn: nén/xoá log cũ đã rotate, dọn cache và file tạm; tuyệt đối không xoá file đang được tiến trình mở (xoá rồi dung lượng vẫn chưa trả cho tới khi tiến trình chết — kiểm tra bằng lsof +L1).','安全に空ける：rotate 済みの古いログを圧縮/削除、キャッシュと一時ファイルを掃除。プロセスが開いているファイルは消さない（消してもプロセス終了まで容量が戻らない — lsof +L1 で確認）。'],
       ['Khôi phục dịch vụ theo thứ tự: database / ứng dụng sau khi có dung lượng trống, kiểm tra dữ liệu có hỏng do ghi dở không.','空きができたらサービスを順に復旧（DB / アプリ）、書き込み途中で壊れたデータがないか確認。'],
       ['Tìm thủ phạm tăng trưởng: log không rotate (kiểm tra logrotate), file core dump, ảnh/container cũ chất đống (docker system df), hay dữ liệu thật tăng — mỗi thủ phạm một cách chữa gốc khác nhau.','増加の犯人を探す：rotate されていないログ（logrotate 確認）、core ダンプ、古いイメージ/コンテナの山（docker system df）、実データの成長 — 犯人ごとに恒久策が違う。']],
 causes:[['Log ứng dụng/hệ thống không có rotate, ghi vô hạn theo thời gian','ログに rotate がなく時間とともに無限に増える'],
        ['File đã xoá nhưng tiến trình vẫn giữ (deleted-but-open) khiến dung lượng không được trả','削除済みだがプロセスが掴んだままのファイル（deleted-but-open）で容量が戻らない'],
        ['Hết inode vì hàng triệu file nhỏ (cache, session, mail queue)','数百万の小ファイル（キャッシュ、セッション、メールキュー）で inode 枯渇'],
        ['Ổ đĩa cấp quá nhỏ so với tốc độ tăng dữ liệu thật','実データの増加速度に対してディスクが小さすぎる']],
 checks:['df -h; df -i','du -xh --max-depth=1 / 2>/dev/null | sort -h','lsof +L1   # file đã xoá nhưng chưa được trả dung lượng','docker system df'],
 prevent:[['Bắt buộc logrotate + giới hạn journal; alarm dung lượng ở 75% và 90% kèm dự báo ngày đầy','logrotate と journal の上限を必須化。75% と90% でアラームし、満杯日を予測'],
         ['Tách phân vùng log/dữ liệu khỏi phân vùng hệ điều hành để một bên đầy không giết cả máy','ログ/データ用パーティションを OS と分離し、片方の満杯で全体が死なないように'],
         ['Định kỳ dọn image/container/snapshot rác bằng script có kiểm soát','イメージ/コンテナ/スナップショットのゴミを管理されたスクリプトで定期清掃']]},
{id:'tlsexp', tg:'gen', ic:'📜',
 t:['Chứng chỉ TLS hết hạn — website báo lỗi bảo mật','TLS 証明書の期限切れ — サイトがセキュリティ警告を出す'],
 sym:['Người dùng thấy cảnh báo “kết nối không riêng tư / chứng chỉ đã hết hạn”; API client lỗi xác thực x509; kiểm tra bằng openssl thấy notAfter đã qua.',
      'ユーザーが「プライベート接続ではありません / 証明書の期限切れ」警告を見る。API クライアントは x509 検証エラー。openssl で見ると notAfter を過ぎている。'],
 steps:[['Xác nhận chứng chỉ nào đang được phục vụ thật: openssl s_client tới đúng tên miền và cổng — lỗi thường nằm ở việc load balancer / CDN đang cầm chứng chỉ cũ chứ không phải server gốc.','実際に配信されている証明書を確認：openssl s_client で正しいドメインとポートへ。ロードバランサー / CDN が古い証明書を持っているのが定番。'],
       ['Xác định đường cấp phát của chứng chỉ này: ACM / Certificate Manager tự gia hạn, Let\'s Encrypt qua certbot, hay mua từ CA (Certificate Authority — tổ chức cấp chứng chỉ) và cài tay.','この証明書の発行経路を特定：ACM / Certificate Manager の自動更新、certbot の Let\'s Encrypt、手動インストールの商用 CA か。'],
       ['Nếu là tự gia hạn: tìm vì sao vòng gia hạn gãy — ACM kẹt ở bước xác thực DNS (bản ghi CNAME xác thực bị xoá), certbot lỗi vì cron/systemd timer chết hoặc thử thách HTTP bị chặn bởi thay đổi firewall.','自動更新のはずなら、更新ループの断点探し：ACM が DNS 検証で止まっている（検証用 CNAME が消えた）、certbot が cron/timer の停止や HTTP チャレンジの遮断で失敗。'],
       ['Cấp cứu: cấp chứng chỉ mới, gắn vào đúng nơi đang phục vụ (ALB/CloudFront/Cloud Load Balancing/nginx), rồi <i>kiểm chứng lại từ ngoài</i> bằng openssl và trình duyệt ẩn danh.','応急処置：新しい証明書を発行し、実際に配信している場所（ALB/CloudFront/Cloud LB/nginx）へ装着。<i>外部から</i> openssl とシークレットブラウザで再確認。'],
       ['Ghi lại hạn mới vào hệ thống giám sát ngay trong lúc xử lý, không để “để sau”.','処理中に新しい期限を監視システムへ即登録する。「後で」は禁物。']],
 causes:[['Chứng chỉ cài tay hết hạn 1 năm mà không ai sở hữu việc gia hạn (không chủ, không nhắc)','手動証明書が1年で切れたが、更新の担当者もリマインドもない'],
        ['Tự gia hạn silently fail nhiều tuần: xác thực DNS hỏng hoặc timer của certbot chết','自動更新が数週間サイレントに失敗：DNS 検証の破損や certbot タイマーの停止'],
        ['Gia hạn xong nhưng gắn nhầm nơi (server gốc mới, load balancer vẫn cũ)','更新したが装着先が違う（オリジンは新しく、LB は古いまま）'],
        ['Chuỗi chứng chỉ (chain) thiếu intermediate sau khi thay, một số client từ chối',' 교체後のチェーン不完全（中間証明書不足）で一部クライアントが拒否']],
 checks:['echo | openssl s_client -servername <domain> -connect <domain>:443 2>/dev/null | openssl x509 -noout -dates -issuer','certbot certificates   # nếu dùng Let\'s Encrypt','aws acm list-certificates --query "CertificateSummaryList[].{Domain:DomainName,Status:Status}"'],
 prevent:[['Ưu tiên chứng chỉ do cloud quản lý và tự gia hạn (ACM / Google-managed) cho mọi endpoint công cộng','公開エンドポイントはクラウド管理の自動更新証明書（ACM / Google マネージド）を優先'],
         ['Giám sát ngày hết hạn từ bên ngoài, alarm trước 30/14/7 ngày cho MỌI chứng chỉ kể cả nội bộ','外部から期限を監視し、内部証明書も含め全てに 30/14/7 日前アラーム'],
         ['Mọi chứng chỉ đều có chủ sở hữu ghi rõ và quy trình gia hạn được tài liệu hoá','全証明書に担当者を明記し、更新手順を文書化']]},
{id:'privnet', tg:'aws', ic:'🧭',
 t:['Private subnet mất internet sau khi sửa route/NAT','ルート/NAT 変更後にプライベートサブネットがインターネットに出られない'],
 sym:['EC2 trong private subnet không tải được bản vá, gọi API công cộng timeout; trước đó vừa có thay đổi về route table hoặc NAT Gateway; instance trong public subnet vẫn bình thường.',
      'プライベートサブネットの EC2 がパッチ取得も公開 API 呼び出しもタイムアウト。直前にルートテーブルか NAT の変更があった。パブリックサブネットのインスタンスは正常。'],
 steps:[['Vẽ lại đường đi mong đợi: private subnet → route 0.0.0.0/0 → NAT Gateway (nằm ở public subnet) → Internet Gateway. Sự cố là một mắt xích trong chuỗi này gãy.','期待経路を描き直す：プライベート → 0.0.0.0/0 のルート → NAT ゲートウェイ（パブリックサブネット内）→ Internet Gateway。この鎖のどこかが切れている。'],
       ['Kiểm tra route table của private subnet: còn dòng 0.0.0.0/0 → nat-… không, có bị trỏ nhầm sang NAT đã xoá hoặc sang gateway endpoint/VPC peering do một route cụ thể hơn ghi đè (longest prefix match) không.','プライベート側のルートテーブル確認：0.0.0.0/0 → nat-… の行があるか、削除済み NAT への向き、具体的なルート（最長プレフィックス一致）による上書きがないか。'],
       ['Kiểm tra chính NAT Gateway: trạng thái available, Elastic IP còn gắn, và quan trọng nhất — route table của <i>public subnet chứa NAT</i> có đường ra Internet Gateway không.','NAT ゲートウェイ自体を確認：状態が available か、Elastic IP が付いているか、そして NAT のある<i>パブリックサブネット</i>のルートに Internet Gateway への道があるか。'],
       ['Kiểm tra đúng AZ: mỗi private subnet nên dùng NAT cùng Availability Zone; NAT ở AZ khác vừa tốn phí cross-AZ vừa chết theo khi AZ đó sự cố.','AZ の対応を確認：各プライベートサブネットは同一 AZ の NAT を使うべき。別 AZ の NAT は AZ 間料金と、その AZ の障害に巻き込まれる問題がある。'],
       ['Loại trừ hai lớp còn lại: Security Group chiều ra và NACL hai chiều (NACL là stateless — quên chiều về với cổng ephemeral là lỗi kinh điển), rồi mới tới DNS.','残り2層を除外：Security Group の外向きと NACL の双方向（NACL はステートレス — 戻りのエフェメラルポート忘れが古典的）。その後に DNS。']],
 causes:[['Route mặc định bị xoá hoặc trỏ vào NAT đã bị xoá trong lần dọn dẹp trước','既定ルートの削除、または前回の後片付けで消した NAT への向きのまま'],
        ['NAT Gateway nằm trong subnet mà route table của chính subnet đó không có đường ra IGW','NAT のあるサブネット自身に IGW へのルートがない'],
        ['Một route cụ thể hơn (vd dải IP của đối tác → VPN) ghi đè đường đi của traffic vốn phải qua NAT','より具体的なルート（取引先レンジ → VPN 等）が NAT 経由のはずの通信を上書き'],
        ['NACL chặn chiều về (ephemeral ports 1024–65535) sau lần thắt chặt bảo mật','セキュリティ強化時に NACL が戻り（エフェメラル 1024–65535）を遮断']],
 checks:['aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=<subnet-id>','aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=<vpc-id> Name=state,Values=available','ping 8.8.8.8   # từ instance: tách lỗi đường đi với lỗi DNS'],
 prevent:[['Mọi thay đổi route/NAT qua IaC + review; cấm sửa tay route table của production','ルート/NAT の変更は全て IaC＋レビュー。本番ルートテーブルの手作業変更を禁止'],
         ['Kiểm tra sức khoẻ “đường ra internet của private subnet” bằng một bài test tự động định kỳ (synthetic check)','プライベートサブネットの外向き到達性を定期的な自動テスト（シンセティック）で監視'],
         ['Chuẩn mẫu: mỗi AZ một NAT, route table theo AZ — tránh NAT dùng chung xuyên AZ','標準形：AZ ごとに NAT 1台、ルートテーブルも AZ 単位 — AZ をまたぐ共用を避ける']]},
{id:'asgfail', tg:'aws', ic:'📈',
 t:['Auto Scaling không scale khi tải tăng','負荷が上がっても Auto Scaling がスケールしない'],
 sym:['CPU/latency tăng cao, người dùng chậm, nhưng số instance trong ASG đứng yên ở mức tối thiểu; CloudWatch alarm (nếu có) không kích hoạt hoặc kích hoạt mà không có hoạt động scale nào.',
      'CPU/レイテンシが悪化しユーザーが遅いのに、ASG のインスタンス数は最小のまま。アラームが鳴らない、または鳴ってもスケール活動がない。'],
 steps:[['Đọc Activity history của ASG trước tiên: nó ghi rõ từng lần thử scale và lý do thất bại (hết quota, AZ không còn capacity, lỗi launch template) — đây là nhật ký sự thật của ASG.','まず ASG の Activity history を読む：スケール試行と失敗理由（クォータ、AZ の容量不足、起動テンプレートのエラー）が全て記録された「事実のログ」。'],
       ['Kiểm tra các giới hạn trần: Desired capacity có bị kẹp bởi Max size không; tài khoản có chạm quota EC2 của dòng instance ở region đó không.','上限を確認：Desired が Max size に張り付いていないか、アカウントがそのリージョン/系統の EC2 クォータに達していないか。'],
       ['Kiểm tra chính sách scale: alarm gắn đúng metric của ASG chưa, ngưỡng có quá cao so với thực tế không, cooldown có đang khoá đợt scale tiếp theo không; target tracking thì kiểm tra metric mục tiêu có thật sự vượt ngưỡng.','スケールポリシーを確認：アラームのメトリクスが正しいか、閾値が高すぎないか、クールダウンが次を塞いでいないか。ターゲット追跡なら目標メトリクスの実測。'],
       ['Kiểm tra launch template: AMI còn tồn tại không, instance type bị AZ ngừng bán (capacity), user data lỗi khiến instance mới lên rồi chết ngay (scale “có chạy” nhưng instance không sống nổi).','起動テンプレート確認：AMI が存在するか、その AZ でそのタイプが容量切れでないか、ユーザーデータのエラーで新台が即死していないか（スケールは「動いた」が台が生き残らない）。'],
       ['Xác minh bằng cách tăng Desired capacity thủ công có kiểm soát và quan sát instance mới có healthy sau ALB không.','Desired を手動で慎重に増やして検証し、新台が ALB 後ろで healthy になるまで観察する。']],
 causes:[['Max size đặt quá thấp từ thời hệ thống còn nhỏ và không ai rà lại','システムが小さい時代の Max size のままで見直されていない'],
        ['Hết service quota EC2 theo dòng instance/region','インスタンス系統/リージョン単位の EC2 サービスクォータ枯渇'],
        ['Instance mới launch lỗi (AMI bị xoá, user data sập) khiến ASG lùi và bỏ cuộc âm thầm','新台の起動失敗（AMI 削除、ユーザーデータのクラッシュ）で ASG が静かに諦める'],
        ['Chính sách scale đo metric không phản ánh tải thật (vd CPU thấp nhưng hàng đợi request dài — phải scale theo ALB request count / SQS depth)','実負荷を反映しないメトリクスで判断（CPU が低くてもリクエスト待ち行列が長い — ALB リクエスト数 / SQS 深さでスケールすべき）']],
 checks:['aws autoscaling describe-scaling-activities --auto-scaling-group-name <asg>','aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names <asg>','aws service-quotas get-service-quota --service-code ec2 --quota-code <code>'],
 prevent:[['Alarm riêng cho “tải cao mà số instance không đổi” — sự cố câm lặng nguy hiểm nhất của ASG','「高負荷なのに台数が変わらない」専用アラーム — ASG の最も危険なサイレント障害への対策'],
         ['Load test định kỳ tới ngưỡng scale và xem Activity history như một bài diễn tập','スケール閾値までの負荷テストを定期実施し、Activity history を演習として確認'],
         ['Scale theo metric sát tải người dùng (request/latency/queue) thay vì chỉ CPU','CPU だけでなく利用者の実負荷（リクエスト/レイテンシ/キュー）に近いメトリクスでスケール']]},
{id:'runrev', tg:'gcp', ic:'🏃',
 t:['Cloud Run revision lỗi — không nhận được traffic','Cloud Run のリビジョンがエラー — トラフィックを受け取れない'],
 sym:['Deploy revision mới thất bại hoặc revision lên nhưng traffic vẫn ở bản cũ; log báo container không mở cổng đúng lúc, lỗi khởi động, hoặc kiểm tra sức khoẻ (startup probe) không qua.',
      '新リビジョンのデプロイが失敗、または上がってもトラフィックは旧版のまま。ログではコンテナが時間内にポートを開けない、起動エラー、スタートアッププローブ不通過。'],
 steps:[['Đọc log của chính revision lỗi trong Cloud Logging theo nhãn revision_name: thông báo lỗi khởi động của container là nguồn sự thật đầu tiên.','失敗したリビジョン自身のログを Cloud Logging で revision_name ラベルで読む。コンテナの起動エラーが第一の事実源。'],
       ['Kiểm tra hợp đồng cổng: container phải nghe ở cổng trong biến môi trường PORT mà Cloud Run cấp (mặc định 8080) trên 0.0.0.0 — nghe ở 127.0.0.1 hoặc cố định cổng khác trong code là lỗi số 1 khi mang app từ nơi khác sang.','ポートの契約を確認：コンテナは Cloud Run が渡す環境変数 PORT（既定8080）で 0.0.0.0 を聴くこと。127.0.0.1 のみ、他所から持ち込んで固定ポート、が移行時の第1ミス。'],
       ['Kiểm tra thời gian khởi động: app nặng khởi động chậm hơn cửa sổ cho phép — tăng CPU/memory cho lúc khởi động (CPU boost) hoặc nới startup probe, đồng thời soi lỗi phụ thuộc: không nối được Cloud SQL (chưa gắn Cloud SQL connection / sai instance connection name) hoặc thiếu biến môi trường/secret.','起動時間を確認：重いアプリが許容窓を超える — 起動時 CPU ブーストやスタートアッププローブ緩和を検討。同時に依存先の失敗（Cloud SQL 接続の未装着/接続名ミス、環境変数/シークレット不足）も見る。'],
       ['Phân bổ traffic có chủ đích: giữ 100% ở revision cũ trong lúc điều tra (đây là ưu điểm của mô hình revision), sửa xong mới dịch chuyển dần 10% → 100%.','トラフィックは意図的に旧リビジョンへ100%残して調査する（リビジョンモデルの利点）。直ったら10%→100%と段階移行。'],
       ['Kiểm chứng bằng URL của revision (tag URL) trước khi cho nhận traffic thật.','実トラフィックを入れる前に、リビジョンのタグ URL で検証する。']],
 causes:[['Container nghe sai cổng/địa chỉ (không đọc biến PORT)','コンテナの待受ポート/アドレス誤り（PORT 変数を読んでいない）'],
        ['Thiếu biến môi trường hoặc quyền truy cập Secret Manager của service account chạy Cloud Run','環境変数不足、または Cloud Run のサービスアカウントに Secret Manager 権限がない'],
        ['Chưa gắn kết nối Cloud SQL hoặc sai instance connection name khiến app chờ DB rồi timeout khởi động','Cloud SQL 接続の未装着/接続名ミスでアプリが DB 待ちのまま起動タイムアウト'],
        ['Image quá nặng / app khởi động chậm vượt quá cửa sổ startup probe','イメージ過大 / 起動が遅くスタートアッププローブの窓を超過']],
 checks:['gcloud logging read "resource.type=cloud_run_revision AND resource.labels.revision_name=<rev>" --limit 50','gcloud run revisions describe <rev> --region <region>','gcloud run services describe <svc> --region <region>'],
 prevent:[['Dockerfile/app đọc PORT từ môi trường và log lỗi khởi động ra stdout/stderr đầy đủ','Dockerfile/アプリは PORT を環境変数から読み、起動エラーを stdout/stderr へ十分に出す'],
         ['Deploy thử bằng tag/canary trước khi chuyển 100% traffic','タグ/カナリアで先にデプロイしてから100%へ移す'],
         ['Kiểm tra biến môi trường + secret + Cloud SQL connection trong pipeline trước khi deploy','デプロイ前のパイプラインで環境変数・シークレット・Cloud SQL 接続を検証']]},
{id:'iamapi', tg:'gen', ic:'🚫',
 t:['Lỗi phân quyền IAM khi gọi API — AccessDenied / PermissionDenied','API 呼び出しの IAM エラー — AccessDenied / PermissionDenied'],
 sym:['Thao tác bị từ chối với thông báo nêu tên quyền còn thiếu (GCP thường ghi rõ permission, vd storage.objects.get) hoặc chung chung AccessDenied (AWS); người dùng/role “vừa được cấp quyền hôm qua” vẫn lỗi.',
      '操作が拒否され、不足する権限名が出る（GCP は storage.objects.get のように明示的）か、AWS の AccessDenied。 「昨日権限を付けたはず」のユーザー/ロールでも起きる。'],
 steps:[['Đọc thông báo lỗi như một chỉ dẫn: ghi lại chính xác action/permission bị thiếu và tài nguyên đích — đa số lỗi IAM tự khai ra đáp án trong message.','エラーメッセージを指示書として読む：不足するアクション/権限と対象リソースを正確に記録。IAM エラーの大半は答えをメッセージに含んでいる。'],
       ['Xác định danh tính thật: bạn đang là ai trong phiên này (aws sts get-caller-identity / gcloud auth list) — nhầm tài khoản/project/profile là nguyên nhân phổ biến hơn cả thiếu quyền.','実際の身元を確認：このセッションで誰なのか（aws sts get-caller-identity / gcloud auth list）— アカウント/プロジェクト/プロファイルの取り違えは権限不足より多い原因。'],
       ['Kiểm tra nơi cấp quyền: AWS — policy gắn vào user/role, và bạn có đang <i>assume đúng role</i> đó không; GCP — role được cấp ở tầng nào của hierarchy (organization / folder / project / resource) vì quyền chỉ chảy xuống dưới.','付与場所を確認：AWS — ユーザー/ロールへのポリシー装着と、そのロールを<i>実際に引き受けているか</i>。GCP — 階層のどの層（組織/フォルダ/プロジェクト/リソース）で付与したか。権限は下方向にのみ流れる。'],
       ['Săn Deny ghi đè: AWS có explicit Deny trong policy/SCP/boundary; GCP có deny policy — một Deny thắng mọi Allow.','上書き Deny を狩る：AWS の明示的 Deny（ポリシー/SCP/境界）、GCP の deny ポリシー — Deny は全 Allow に勝つ。'],
       ['Cấp đúng quyền tối thiểu cho action còn thiếu (đừng dùng Administrator/Editor để “cho chắc”), rồi thử lại chính thao tác đó và ghi lại vào runbook.','不足アクションへ最小権限を付与（「念のため」の Administrator/Editor は禁止）。同じ操作で再検証し、ランブックに記録。']],
 causes:[['Nhầm danh tính: dùng nhầm profile/tài khoản/project so với nơi đã cấp quyền','身元の取り違え：権限を付けた先と違うプロファイル/アカウント/プロジェクトを使っている'],
        ['Cấp quyền nhưng chưa assume role (AWS) hoặc cấp ở tầng hierarchy không bao phủ tài nguyên (GCP)','ロール未装着（AWS）、またはリソースをカバーしない階層での付与（GCP）'],
        ['Deny tường minh ở một lớp khác (SCP của tổ chức, deny policy)','別層の明示的 Deny（組織の SCP、deny ポリシー）'],
        ['Quyền cần thêm không chỉ một: thao tác gọi API kéo theo quyền phụ (vd đọc object mã hoá cần cả quyền KMS)','必要な権限が1つでない：付随権限（暗号化オブジェクトの読み取りには KMS 権限も）']],
 checks:['aws sts get-caller-identity','aws iam simulate-principal-policy --policy-source-arn <arn> --action-names <action> --resource-arns <arn>','gcloud projects get-iam-policy <project>   # và Policy Troubleshooter trên Console'],
 prevent:[['Cấp quyền theo role công việc bằng IaC, tuyệt đối tránh quyền quản trị toàn phần cho tác vụ hằng ngày','権限は職務ロールとして IaC 管理。日常作業への全権付与を厳禁'],
         ['Môi trường học/thử dùng tài khoản/project riêng để lỗi phân quyền không chạm production','学習/検証は専用アカウント/プロジェクトで分離し、権限事故が本番に触れないように'],
         ['Bật audit log và rà soát quyền thừa định kỳ (Access Analyzer / Policy Analyzer)','監査ログを有効化し、過剰権限を定期レビュー（Access Analyzer / Policy Analyzer）']]}
];

/* ================================================================
   C2 · NGÂN HÀNG CÂU HỎI SỰ CỐ — 30 câu tình huống
   Dạng: “hệ thống đang gặp X — bước kiểm tra đầu tiên đúng nhất?”
   tg: aws | gcp | k8s | gen — phục vụ bộ lọc của engine.
   ================================================================ */
function TQ(tg,tp,tpj,q,qj,o,c,e,ej,x){ return {tp:[tp,tpj],tg:tg,q:q,qj:qj,o:o,c:c,e:e,ej:ej,x:x}; }
var QB_TROUBLE=[
TQ('aws','EC2 quá tải','EC2 の過負荷',
 '03:00 sáng, alarm báo một EC2 CPU 100% suốt 20 phút. Bước kiểm tra đầu tiên đúng nhất là gì?',
 '午前3時、アラームが EC2 の CPU 100% を20分間報告。最も正しい最初の確認は？',
 [['Restart instance ngay để hạ CPU','CPU を下げるため即再起動'],
  ['Vào máy chạy top/htop xem tiến trình nào đang chiếm CPU, đối chiếu với deploy và traffic gần nhất','top/htop で CPU を占有するプロセスを見て、直近のデプロイとトラフィックに照らす'],
  ['Tăng gấp đôi instance size','インスタンスサイズを倍にする'],
  ['Xoá alarm để khỏi bị đánh thức','起こされないようアラームを消す']],
 1,
 'Nguyên tắc vận hành: quan sát trước, can thiệp sau. top cho biết ngay đó là ứng dụng, tác vụ nền hay tiến trình lạ — mỗi khả năng một hướng xử lý khác hẳn.',
 '運用の原則：介入より観察が先。top を見れば、アプリか、裏処理か、怪しいプロセスかが分かり、対処はそれぞれ全く違います。',
 [['Sai — restart xoá bằng chứng (tiến trình nào, vì sao) và lỗi code sẽ đưa CPU lên 100% lại ngay.','誤り — 再起動は証拠（どのプロセスか、なぜか）を消し、コード起因なら即100%に戻ります。'],
  ['Đúng — phân loại nguyên nhân là bước một của mọi sự cố hiệu năng.','正解 — 原因の分類こそ性能障害の第一歩です。'],
  ['Sai — scale mù quáng tốn tiền và vẫn không biết đang scale cái gì (kể cả khi đang bị đào coin).','誤り — 中身を知らないスケールは無駄金で、採掘されている場合でも拡大してしまいます。'],
  ['Sai — tắt alarm là bịt mắt hệ thống giám sát, sự cố vẫn nguyên đó.','誤り — アラームを消しても障害は残り、監視が盲目になるだけです。']]),
TQ('aws','Database','データベース',
 'Ứng dụng báo “too many connections” tới RDS sau một bản deploy. Kiểm tra nào cho bằng chứng quyết định nhanh nhất?',
 'デプロイ直後、アプリが RDS へ「too many connections」。最も早く決定的な証拠が得られる確認は？',
 [['Nâng cấp instance class của RDS','RDS のインスタンスクラスを上げる'],
  ['Truy vấn pg_stat_activity / SHOW PROCESSLIST để xem ai đang giữ kết nối và bao nhiêu kết nối idle','pg_stat_activity / SHOW PROCESSLIST で、接続の持ち主と idle 数を見る'],
  ['Restart toàn bộ instance ứng dụng','アプリの全台を再起動する'],
  ['Tăng max_connections lên mức tối đa','max_connections を最大まで上げる']],
 1,
 'pg_stat_activity cho thấy ngay bức tranh: kết nối dồn từ ứng dụng nào, trạng thái idle chiếm bao nhiêu — phân biệt được rò kết nối (do deploy) với tăng trưởng thật.',
 'pg_stat_activity を見れば全体像が即分かります：どのアプリから接続が来ているか、idle がどれだけか — デプロイ起因のリークと実成長を切り分けられます。',
 [['Sai — nâng cấp là cách chữa đắt nhất và vô ích nếu nguyên nhân là rò kết nối: pool mới rồi cũng cạn.','誤り — アップグレードは最も高くつく対症療法で、リークが原因なら新しいプールも枯れます。'],
  ['Đúng — “ai giữ kết nối” là câu hỏi phải trả lời trước mọi quyết định.','正解 — 「誰が接続を持っているか」が全判断の前提です。'],
  ['Sai — restart hàng loạt có thể giải phóng tạm thời nhưng phá bằng chứng và gây downtime không cần thiết.','誤り — 一斉再起動は一時的には効いても証拠を消し、不要な停止を招きます。'],
  ['Sai — tăng trần mù quáng che giấu rò rỉ và đẩy tải RAM lên database.','誤り — 盲目的な上限引き上げはリークを隠し、DB のメモリを圧迫します。']]),
TQ('gen','DNS','DNS',
 'Một EC2 ping được 8.8.8.8 nhưng không phân giải được bất kỳ tên miền nào. Bước kiểm tra đầu tiên?',
 'EC2 から 8.8.8.8 へ ping は通るが、どのドメイン名も解決できない。最初の確認は？',
 [['Kiểm tra Security Group cổng 443','443番の Security Group を確認'],
  ['Xem /etc/resolv.conf — resolver đang trỏ tới đâu, có phải resolver của VPC không','/etc/resolv.conf を見て、リゾルバがどこを向いているか（VPC のリゾルバか）を確認'],
  ['Đăng ký lại tên miền','ドメインを登録し直す'],
  ['Restart dịch vụ network của máy','マシンのネットワークサービスを再起動']],
 1,
 'Mạng thông (ping IP được) mà mọi tên đều chết → lỗi nằm ở cấu hình resolver của chính máy: resolv.conf trỏ sai là nguyên nhân số 1.',
 'ネットワークは通っている（IP へ ping 可）のに全ての名前が死ぬ → そのマシン自身のリゾルバ設定の問題で、resolv.conf の向き先誤りが第1原因です。',
 [['Sai — cổng 443 là chuyện của HTTPS sau khi đã có IP; máy còn chưa phân giải được tên.','誤り — 443 は IP が得られた後の話。今は名前すら引けていません。'],
  ['Đúng — đi theo tầng: đường đi đã thông, kiểm tra tầng phân giải tên từ cấu hình máy trước.','正解 — 層に沿って：経路は正常なので、名前解決をマシン設定から確認します。'],
  ['Sai — mọi tên miền đều lỗi thì không thể là chuyện đăng ký của một domain cụ thể.','誤り — 全ドメインが失敗するなら、特定ドメインの登録問題ではありません。'],
  ['Sai — restart là can thiệp mù; đọc cấu hình trước luôn rẻ hơn.','誤り — 再起動は盲目的な介入。設定を読む方が常に先です。']]),
TQ('aws','Load Balancer','ロードバランサー',
 'ALB trả 502 hàng loạt. Kiểm tra nào phân biệt nhanh nhất giữa “ứng dụng chết” và “cấu hình ALB sai”?',
 'ALB が大量に502を返す。「アプリ死亡」と「ALB 設定ミス」を最速で切り分ける確認は？',
 [['Xem target health kèm lý do unhealthy, và curl thẳng vào instance qua IP private tới endpoint health','ターゲットの health と unhealthy 理由を見て、プライベート IP 直通で health エンドポイントへ curl する'],
  ['Xoá và tạo lại ALB','ALB を消して作り直す'],
  ['Tăng idle timeout của ALB lên tối đa','ALB のアイドルタイムアウトを最大にする'],
  ['Đổi chứng chỉ HTTPS','HTTPS 証明書を交換する']],
 0,
 'Target health + curl trực tiếp trả lời ngay: app chết (curl cũng lỗi), hay app sống mà ALB không tới được (health check/SG/cổng sai).',
 'ターゲット health ＋直接 curl で即答できます：アプリが死んでいる（curl も失敗）か、アプリは生きているが ALB が届いていない（ヘルスチェック/SG/ポート誤り）か。',
 [['Đúng — chia đôi không gian nguyên nhân bằng một kiểm tra rẻ là kỹ năng xử lý sự cố cốt lõi.','正解 — 安い確認で原因空間を二分するのが障害対応の核心スキルです。'],
  ['Sai — tạo lại ALB phá cấu hình đang chạy và đổi cả DNS endpoint, trong khi chưa biết lỗi ở đâu.','誤り — 作り直しは稼働中の設定を壊し DNS も変わるのに、原因は未判明のままです。'],
  ['Sai — timeout chỉ liên quan họ lỗi 504/app chậm, không phải bước phân loại đầu tiên.','誤り — タイムアウトは504系/アプリ遅延の話で、最初の切り分けではありません。'],
  ['Sai — lỗi chứng chỉ biểu hiện ở phía client khi bắt tay TLS, không sinh 502 từ ALB.','誤り — 証明書エラーはクライアントの TLS ハンドシェイクで出るもので、ALB の502にはなりません。']]),
TQ('k8s','Kubernetes','Kubernetes',
 'Pod ở trạng thái CrashLoopBackOff. Lệnh nào cho thông tin có giá trị nhất ngay lập tức?',
 'Pod が CrashLoopBackOff。最も価値ある情報が即得られるコマンドは？',
 [['kubectl delete pod để pod tạo lại','kubectl delete pod で作り直す'],
  ['kubectl logs --previous để đọc log của lần chạy vừa crash, kèm kubectl describe pod xem sự kiện','kubectl logs --previous で直前に落ちた回のログを読み、kubectl describe pod でイベントを見る'],
  ['kubectl scale lên 10 replica','kubectl scale で10レプリカに増やす'],
  ['Khởi động lại node chứa pod','Pod のあるノードを再起動する']],
 1,
 'Container đã chết nên log hiện tại thường trống; --previous mới chứa lỗi khởi động thật (thiếu env, sai cấu hình), còn describe cho sự kiện như OOMKilled hay lỗi probe.',
 'コンテナは既に死んでいるため現行ログは空のことが多く、--previous にこそ起動エラーの実物（env 不足、設定ミス）が残ります。describe では OOMKilled やプローブ失敗も見えます。',
 [['Sai — xoá pod chỉ để Deployment tạo lại một pod crash y hệt, và mất luôn bằng chứng.','誤り — 消しても全く同じく落ちる Pod が再生成され、証拠も消えます。'],
  ['Đúng — đọc log của “xác chết” thay vì nhìn pod mới là điểm người mới hay bỏ qua nhất.','正解 — 新しい Pod でなく「死骸」のログを読むのが、初心者が最も見落とす点です。'],
  ['Sai — scale nhân bản một cấu hình đang lỗi thành 10 bản crash.','誤り — スケールすると壊れた設定が10個に増殖します。'],
  ['Sai — node không có tội khi chưa có bằng chứng; restart node ảnh hưởng mọi pod khác trên đó.','誤り — 証拠なくノードを再起動すると、他の Pod まで巻き添えになります。']]),
TQ('gcp','Compute Engine','Compute Engine',
 'GCP VM vẫn chạy nhưng không SSH được sau khi chuyển sang VPC mới tự tạo. Nghi ngờ đầu tiên?',
 '自作の新規 VPC へ移した GCP VM に SSH できない（VM 自体は稼働中）。最初の疑いは？',
 [['VM bị hỏng đĩa boot','ブートディスクの故障'],
  ['VPC mới không có firewall rule cho phép TCP 22 từ nguồn của bạn (mạng tự tạo không có sẵn rule như default network)','新規 VPC に TCP 22 を許可するファイアウォールルールがない（自作ネットワークには default のような既定ルールがない）'],
  ['Tài khoản Google bị khoá','Google アカウントのロック'],
  ['Phải đổi region cho VM','VM のリージョン変更が必要']],
 1,
 'Mạng default của GCP có sẵn rule mở SSH; mạng custom mode thì trống trơn — mọi ingress phải tự khai. “Vừa đổi mạng xong mất SSH” là chữ ký của thiếu firewall rule.',
 'GCP の default ネットワークには SSH 用ルールがありますが、カスタムモードは空っぽで ingress は全て自前宣言。「ネットワークを変えたら SSH が死んだ」はファイアウォールルール不足のサインです。',
 [['Sai — đĩa hỏng thì VM khó mà “vẫn chạy” bình thường được; triệu chứng không khớp.','誤り — ディスク故障なら VM が正常稼働という前提と合いません。'],
  ['Đúng — kiểm tra firewall rule + network tag là bước một cho mọi lỗi kết nối trên GCP.','正解 — ファイアウォールルールとネットワークタグの確認が GCP の接続障害の第一歩です。'],
  ['Sai — tài khoản bị khoá thì Console cũng không vào được, trong khi đề bài nói VM vẫn chạy và đang thao tác được.','誤り — アカウントがロックされればコンソール自体に入れません。'],
  ['Sai — region không liên quan việc cổng 22 có được phép vào hay không.','誤り — リージョンは22番の到達可否と無関係です。']]),
TQ('aws','S3 & IAM','S3 と IAM',
 'Ứng dụng trên EC2 gọi S3 bị AccessDenied dù đã gắn IAM policy cho phép s3:GetObject trên bucket. Kiểm tra nào thường lật ra nguyên nhân thật?',
 'EC2 上のアプリが S3 へ AccessDenied。s3:GetObject を許可する IAM ポリシーは付けたはず。真因がよく判明する確認は？',
 [['Tạo lại bucket với tên khác','別名でバケットを作り直す'],
  ['Kiểm tra ARN trong policy (thiếu /* cho object) và việc instance có thật sự assume đúng role đó không (sts get-caller-identity), cộng quyền KMS nếu object mã hoá','ポリシーの ARN（オブジェクトには /* が必要）と、インスタンスが本当にそのロールを引き受けているか（sts get-caller-identity）、暗号化時は KMS 権限を確認'],
  ['Bật public access cho bucket','バケットをパブリックにする'],
  ['Đổi region của bucket','バケットのリージョンを変える']],
 1,
 'Ba thủ phạm kinh điển của AccessDenied “đã cấp quyền rồi”: ARN thiếu /*, danh tính thật khác danh tính được cấp, và thiếu kms:Decrypt đi kèm mã hoá.',
 '「付けたはず」の AccessDenied の古典的3原因：ARN に /* がない、実身元が付与先と違う、暗号化に伴う kms:Decrypt の不足。',
 [['Sai — đổi tên bucket không sửa được lỗi logic quyền, lại phá mọi tham chiếu hiện có.','誤り — 名前を変えても権限の論理ミスは直らず、既存の参照を壊します。'],
  ['Đúng — AccessDenied luôn được chẩn đoán bằng bộ ba: danh tính — ARN — quyền phụ đi kèm.','正解 — AccessDenied は「身元・ARN・付随権限」の3点で診断します。'],
  ['Sai — mở public là phản ứng nguy hiểm nhất: biến lỗi phân quyền thành vụ rò rỉ dữ liệu.','誤り — パブリック化は最も危険な反応で、権限ミスをデータ漏洩に変えます。'],
  ['Sai — region không quyết định quyền; policy đúng thì region nào cũng gọi được.','誤り — リージョンは権限を決めません。ポリシーが正しければどこからでも呼べます。']]),
TQ('aws','Giám sát','監視',
 'Metric đã vượt ngưỡng nhưng CloudWatch alarm chưa từng chuyển sang ALARM. Kiểm tra đầu tiên?',
 'メトリクスが閾値を超えているのに CloudWatch アラームが一度も ALARM にならない。最初の確認は？',
 [['Xoá alarm tạo lại','アラームを消して作り直す'],
  ['Xem cấu hình alarm: đúng metric/dimension chưa, period & evaluation periods, và cách xử lý dữ liệu thiếu (treat missing data)','アラーム設定を見る：メトリクス/dimension は正しいか、期間と評価期間、欠損データの扱い'],
  ['Nâng cấp gói CloudWatch','CloudWatch のプランを上げる'],
  ['Đổi địa chỉ email nhận thông báo','通知先メールを変更する']],
 1,
 'Alarm không chuyển trạng thái là vấn đề của chính alarm — sai dimension (theo dõi nhầm tài nguyên), ngưỡng tính theo statistic khác, hoặc missing data bị nuốt — chưa phải vấn đề kênh thông báo.',
 '状態遷移しないのはアラーム自身の問題です — dimension の取り違え、想定と違う統計、欠損データの飲み込み。通知チャネルの問題ではありません。',
 [['Sai — tạo lại mà không hiểu sai ở đâu chỉ sao chép lại lỗi cũ.','誤り — 間違いを理解せず作り直すと、同じミスを複製するだけです。'],
  ['Đúng — đọc alarm như đọc một chương trình: đầu vào (metric/dimension) và điều kiện (ngưỡng, số kỳ) đều phải đúng.','正解 — アラームはプログラムとして読む：入力（メトリクス/dimension）と条件（閾値、期間数）の両方が正しくなければなりません。'],
  ['Sai — CloudWatch không có “gói” nào khoá tính năng alarm cơ bản như vậy.','誤り — アラームの基本機能を塞ぐようなプランは存在しません。'],
  ['Sai — email chỉ liên quan khi alarm ĐÃ chuyển ALARM mà thông báo không tới; đây là alarm chưa từng kêu.','誤り — メールが関係するのは ALARM 遷移後に通知が届かない場合。今は一度も鳴っていません。']]),
TQ('gen','Hệ điều hành','OS',
 'Ứng dụng báo không ghi được file, nhưng df -h vẫn cho thấy đĩa còn trống 30%. Kiểm tra tiếp theo?',
 'アプリが「ファイルに書けない」と言うのに、df -h ではディスクに30%空きがある。次の確認は？',
 [['Định dạng lại phân vùng','パーティションをフォーマットする'],
  ['df -i để kiểm tra inode — hết inode vì quá nhiều file nhỏ cũng khiến ghi thất bại dù dung lượng còn','df -i で inode を確認 — 小ファイル過多の inode 枯渇でも、容量があっても書き込みは失敗する'],
  ['Tăng RAM cho máy','メモリを増やす'],
  ['Đổi quyền thư mục thành 777','ディレクトリ権限を777にする']],
 1,
 '“Đầy” có hai nghĩa: hết dung lượng hoặc hết inode (số file tối đa). df -i phân biệt ngay hai trường hợp — triệu chứng giống hệt nhau ở phía ứng dụng.',
 '「満杯」には2つの意味があります：容量の枯渇と inode（ファイル数の上限）の枯渇。df -i で即座に切り分けられ、アプリ側の症状は全く同じです。',
 [['Sai — format là huỷ diệt dữ liệu khi chưa rõ nguyên nhân; tuyệt đối không phải bước chẩn đoán.','誤り — フォーマットは原因不明のままデータを破壊します。診断手順ではありません。'],
  ['Đúng — cặp df -h / df -i là bộ đôi kiểm tra đĩa chuẩn.','正解 — df -h / df -i はディスク確認の標準セットです。'],
  ['Sai — RAM không liên quan lỗi ghi file lên đĩa.','誤り — メモリはディスク書き込みエラーと無関係です。'],
  ['Sai — nới quyền mù quáng không liên quan và còn tạo lỗ hổng; lỗi này ứng dụng thường báo rõ dạng “No space left on device”.','誤り — 盲目的な権限緩和は無関係で危険。この障害は通常「No space left on device」と出ます。']]),
TQ('gen','TLS / Chứng chỉ','TLS / 証明書',
 'Website đột ngột bị trình duyệt cảnh báo chứng chỉ hết hạn, trong khi đội vận hành khẳng định “đã gia hạn tuần trước”. Kiểm tra đúng nhất?',
 'サイトが突然「証明書の期限切れ」警告を出す。運用チームは「先週更新した」と言う。最も正しい確認は？',
 [['Yêu cầu người dùng xoá cache trình duyệt','ユーザーにブラウザキャッシュ削除を依頼する'],
  ['Dùng openssl s_client kiểm tra chứng chỉ đang được phục vụ thật tại tên miền — rất có thể nơi phục vụ (LB/CDN) vẫn cầm bản cũ','openssl s_client で、そのドメインで実際に配信されている証明書を確認 — 配信側（LB/CDN）が古い方を持っていることが多い'],
  ['Mua chứng chỉ mới đắt hơn','より高価な証明書を買う'],
  ['Tắt HTTPS chuyển về HTTP','HTTPS をやめて HTTP に戻す']],
 1,
 'Chứng chỉ “đã gia hạn” và chứng chỉ “đang được phục vụ” là hai việc khác nhau: openssl đọc thẳng thứ client thật sự nhận được — nơi gắn nhầm (origin mới, LB cũ) sẽ lộ ngay.',
 '「更新した証明書」と「配信されている証明書」は別物です。openssl はクライアントが実際に受け取るものを直接読むため、装着先の取り違え（オリジン新・LB旧）が即露呈します。',
 [['Sai — cảnh báo hết hạn đến từ dữ liệu chứng chỉ thật, không phải cache của trình duyệt.','誤り — 期限切れ警告は実際の証明書データによるもので、ブラウザキャッシュではありません。'],
  ['Đúng — đo ở điểm khách hàng chạm vào, đừng tin lời khẳng định.','正解 — 言葉でなく、利用者が触れる点で実測するのが鉄則です。'],
  ['Sai — giá chứng chỉ không liên quan; vấn đề nằm ở khâu gắn chứng chỉ sau gia hạn.','誤り — 価格は無関係。問題は更新後の装着工程にあります。'],
  ['Sai — bỏ HTTPS là chữa cháy bằng cách huỷ bỏ an toàn, không chấp nhận được.','誤り — HTTPS を捨てるのは安全を捨てることで、対処として認められません。']]),
TQ('aws','Networking','ネットワーク',
 'Sau một lần dọn dẹp tài nguyên, EC2 ở private subnet mất hẳn internet chiều ra. Kiểm tra đầu tiên?',
 'リソースの後片付けの後、プライベートサブネットの EC2 が外向きインターネットを失った。最初の確認は？',
 [['Gắn Elastic IP cho EC2','EC2 に Elastic IP を付ける'],
  ['Route table của private subnet: dòng 0.0.0.0/0 còn trỏ tới một NAT Gateway còn tồn tại không — NAT rất có thể đã bị xoá trong đợt dọn dẹp','プライベート側のルートテーブル：0.0.0.0/0 が実在する NAT ゲートウェイを向いているか — 後片付けで NAT が消えた可能性が高い'],
  ['Mở Security Group inbound 0.0.0.0/0','Security Group の inbound を 0.0.0.0/0 で開ける'],
  ['Chuyển instance sang public subnet','インスタンスをパブリックサブネットへ移す']],
 1,
 '“Sau khi dọn dẹp thì mất đường” → nghi ngay tài nguyên bị xoá oan: route còn đó nhưng NAT đích đã biến mất là kịch bản số 1.',
 '「片付けたら道が消えた」→ 誤って消されたリソースを疑います。ルートは残っているが宛先の NAT が消えているのが第1シナリオです。',
 [['Sai — gắn EIP biến máy private thành public, phá vỡ thiết kế bảo mật thay vì sửa route.','誤り — EIP を付けるとプライベートなマシンが公開され、セキュリティ設計を壊します。'],
  ['Đúng — kiểm tra mắt xích route → NAT trước khi đụng vào bất cứ thứ gì khác.','正解 — 他に触る前にルート→NAT の鎖を確認します。'],
  ['Sai — lỗi nằm ở chiều ra (outbound); mở inbound toàn internet vừa sai hướng vừa nguy hiểm.','誤り — 障害は外向き（outbound）。全開放の inbound は方向違いで危険です。'],
  ['Sai — chuyển subnet là thiết kế lại, không phải chẩn đoán; và phá vỡ vai trò của instance.','誤り — サブネット移動は再設計であって診断ではなく、台の役割も壊します。']]),
TQ('aws','Auto Scaling','Auto Scaling',
 'Giờ cao điểm, tải tăng rõ rệt nhưng ASG không thêm instance nào. Nhật ký nào phải đọc đầu tiên?',
 'ピーク時、負荷は明らかなのに ASG が1台も増やさない。最初に読むべき記録は？',
 [['Log ứng dụng trên từng instance','各インスタンスのアプリログ'],
  ['Activity history của ASG — ghi rõ từng lần thử scale và lý do thất bại (quota, capacity, launch template)','ASG の Activity history — スケール試行と失敗理由（クォータ、容量、起動テンプレート）が全部残っている'],
  ['Hoá đơn AWS tháng trước','先月の AWS 請求'],
  ['DNS log của Route 53','Route 53 の DNS ログ']],
 1,
 'ASG tự ghi lại mọi quyết định của nó trong Activity history — đọc nó trước khi phỏng đoán bất cứ nguyên nhân nào khác.',
 'ASG は自分の全判断を Activity history に記録しています。他を推測する前にまずそれを読むことです。',
 [['Sai — log ứng dụng không nói gì về quyết định của ASG.','誤り — アプリログは ASG の判断について何も語りません。'],
  ['Đúng — sự cố “câm lặng” của ASG hầu như luôn tự khai trong Activity history.','正解 — ASG のサイレント障害はほぼ必ず Activity history が自白しています。'],
  ['Sai — hoá đơn không chứa thông tin sự cố vận hành theo thời gian thực.','誤り — 請求書にリアルタイムの障害情報はありません。'],
  ['Sai — DNS không tham gia quyết định scale.','誤り — DNS はスケール判断に関与しません。']]),
TQ('gcp','Cloud Run','Cloud Run',
 'Revision mới của Cloud Run deploy lỗi: container không nhận traffic. Nguyên nhân số 1 cần kiểm tra ở code/container?',
 'Cloud Run の新リビジョンがデプロイ失敗：コンテナがトラフィックを受け取れない。コード/コンテナ側で最初に確認すべき第1原因は？',
 [['Container không có đủ RAM','コンテナのメモリ不足'],
  ['Container không nghe đúng cổng trong biến môi trường PORT (vẫn cố định cổng cũ hoặc chỉ nghe 127.0.0.1)','コンテナが環境変数 PORT の値で聴いていない（旧ポート固定、または 127.0.0.1 のみ）'],
  ['Tên service chứa ký tự đặc biệt','サービス名に特殊文字'],
  ['Region không hỗ trợ Cloud Run','そのリージョンが Cloud Run 未対応']],
 1,
 'Hợp đồng của Cloud Run: app phải nghe 0.0.0.0:$PORT. Mang app từ server thường sang mà giữ cổng cố định 3000/5000 là lỗi kinh điển nhất.',
 'Cloud Run の契約：アプリは 0.0.0.0:$PORT で聴くこと。通常サーバーから持ってきたアプリがポート3000/5000固定のまま、が最も古典的なミスです。',
 [['Sai — thiếu RAM thường gây OOM khi chạy, không phải lỗi nhận traffic ngay từ đầu; và phải đọc log mới biết.','誤り — メモリ不足は稼働中の OOM が主で、受け取り以前の失敗とは違います。まずログです。'],
  ['Đúng — kiểm tra PORT và địa chỉ nghe là bài học đầu tiên của Cloud Run.','正解 — PORT と待受アドレスの確認が Cloud Run の第一課です。'],
  ['Sai — tên service sai định dạng sẽ bị từ chối ngay từ lúc tạo service, không đợi tới revision.','誤り — 名前が不正ならサービス作成時点で弾かれます。'],
  ['Sai — nếu region không hỗ trợ thì không deploy được gì từ đầu.','誤り — 未対応リージョンでは最初から何もデプロイできません。']]),
TQ('gen','IAM','IAM',
 'Một đồng đội báo “đã cấp quyền rồi mà vẫn AccessDenied”. Khả năng nào nên kiểm tra trước cả việc cấp thêm quyền?',
 '同僚が「権限は付けたのに AccessDenied」と言う。追加付与の前に確認すべきことは？',
 [['Cấp quyền Administrator để chắc chắn','確実にするため Administrator を付ける'],
  ['Danh tính thật của phiên làm việc: có thể họ đang dùng nhầm profile / tài khoản / project so với nơi đã cấp quyền','セッションの実身元：権限を付けた先と違うプロファイル / アカウント / プロジェクトを使っている可能性'],
  ['Đợi 24 giờ cho quyền lan ra','権限の伝播に24時間待つ'],
  ['Tạo tài khoản mới','新しいアカウントを作る']],
 1,
 'Sai danh tính (nhầm profile/project) phổ biến hơn thiếu quyền thật; sts get-caller-identity / gcloud auth list trả lời trong vài giây.',
 '身元の取り違え（プロファイル/プロジェクト）は本当の権限不足より多い原因です。sts get-caller-identity / gcloud auth list で数秒で判明します。',
 [['Sai — cấp quyền quản trị bừa bãi là phản xạ nguy hiểm nhất trong vận hành IAM.','誤り — 管理者権限の乱発は IAM 運用で最も危険な反射です。'],
  ['Đúng — xác nhận “bạn đang là ai” trước khi sửa bất cứ policy nào.','正解 — ポリシーを触る前に「あなたは誰か」を確定させます。'],
  ['Sai — quyền IAM có độ trễ lan truyền ngắn (giây tới phút), không phải 24 giờ; chờ đợi mù quáng chỉ kéo dài sự cố.','誤り — IAM の伝播は秒〜分単位。24時間の盲目的な待機は障害を長引かせるだけです。'],
  ['Sai — tài khoản mới càng không có quyền nào và làm mất dấu vết điều tra.','誤り — 新規アカウントは権限ゼロで、調査の痕跡も失われます。']]),
TQ('aws','Vận hành','運用',
 'Một alarm đã chuyển sang ALARM nhưng không ai nhận thông báo qua SNS. Kiểm tra khả dĩ nhất?',
 'アラームは ALARM になったのに、SNS 経由で誰にも通知が届かない。最もあり得る確認先は？',
 [['Subscription của SNS topic — email có thể vẫn ở trạng thái chờ xác nhận (pending confirmation)','SNS トピックのサブスクリプション — メールが未確認（pending confirmation）のままの可能性'],
  ['Màu của biểu đồ CloudWatch','CloudWatch グラフの色'],
  ['Số lượng alarm trong tài khoản','アカウント内のアラーム総数'],
  ['Region của SNS topic phải ở us-east-1','SNS トピックは us-east-1 でなければならない']],
 0,
 'Chuỗi thông báo gãy hay nhất ở mắt xích cuối: email subscription chưa bấm link xác nhận thì SNS không bao giờ gửi được, dù alarm và topic đều đúng.',
 '通知チェーンが切れるのは最後の環が最多：メールサブスクリプションが確認リンク未クリックだと、アラームもトピックも正しくても SNS は送れません。',
 [['Đúng — “pending confirmation” là nguyên nhân kinh điển nhất của thông báo câm lặng.','正解 — 「pending confirmation」は無通知の最も古典的な原因です。'],
  ['Sai — hiển thị biểu đồ không ảnh hưởng đường đi của thông báo.','誤り — グラフの見た目は通知経路に無関係です。'],
  ['Sai — số lượng alarm không chặn việc gửi của một alarm cụ thể.','誤り — アラーム総数は個別の送信を妨げません。'],
  ['Sai — SNS hoạt động ở mọi region thương mại, không bắt buộc us-east-1.','誤り — SNS は全商用リージョンで動き、us-east-1 必須ではありません。']])
];
QB_TROUBLE.push(
TQ('k8s','Kubernetes','Kubernetes',
 'Pod bị giết lặp đi lặp lại và describe cho thấy Reason: OOMKilled. Hành động đúng?',
 'Pod が繰り返し殺され、describe の Reason が OOMKilled。正しい対処は？',
 [['Tăng số replica','レプリカ数を増やす'],
  ['Đối chiếu memory request/limit với mức dùng thật của app: app rò rỉ bộ nhớ thì sửa code, giới hạn đặt thấp hơn nhu cầu thật thì nâng limit có cân nhắc','メモリの request/limit とアプリの実使用を照合：リークならコードを直し、実需要より低く設定したなら検討の上で limit を上げる'],
  ['Xoá namespace','namespace を削除する'],
  ['Tắt liveness probe','ライブネスプローブを無効化する']],
 1,
 'OOMKilled nghĩa là container vượt memory limit và bị kernel giết. Việc cần làm là đo mức dùng thật rồi quyết định: sửa rò rỉ hay nâng giới hạn — không phải tăng replica để nhân bản vấn đề.',
 'OOMKilled はコンテナがメモリ上限を超えてカーネルに殺された状態。実使用を測って、リーク修正か上限見直しかを判断するのが筋で、レプリカを増やして問題を複製することではありません。',
 [['Sai — thêm replica là thêm bấy nhiêu pod cùng bị OOMKilled.','誤り — レプリカを増やせば OOMKilled の Pod が増えるだけです。'],
  ['Đúng — OOMKilled là bài toán dung lượng bộ nhớ, xử lý bằng số đo chứ không bằng phỏng đoán.','正解 — OOMKilled はメモリ容量の問題で、推測でなく実測で扱います。'],
  ['Sai — xoá namespace là phá huỷ toàn bộ workload, không liên quan chẩn đoán.','誤り — namespace 削除は全ワークロードの破壊で、診断とは無関係です。'],
  ['Sai — probe không gây OOMKilled; tắt probe chỉ che giấu triệu chứng khác.','誤り — プローブは OOMKilled の原因ではありません。無効化は別の症状を隠すだけです。']]),
TQ('k8s','Kubernetes','Kubernetes',
 'Pod kẹt ở trạng thái ImagePullBackOff sau khi deploy. Nguyên nhân thuộc nhóm nào?',
 'デプロイ後、Pod が ImagePullBackOff のまま。どの系統の原因か？',
 [['Node hết đĩa','ノードのディスク不足'],
  ['Kubernetes không kéo được image: sai tên/tag, registry private mà thiếu imagePullSecret, hoặc node không có đường mạng tới registry','Kubernetes がイメージを引けない：名前/タグ誤り、プライベートレジストリなのに imagePullSecret がない、ノードからレジストリへ到達できない'],
  ['Ứng dụng bên trong container bị lỗi cú pháp','コンテナ内アプリの構文エラー'],
  ['Thiếu memory limit','メモリ limit の未設定']],
 1,
 'ImagePullBackOff xảy ra trước khi container kịp chạy — vấn đề nằm ở khâu kéo image (định danh image, quyền registry, đường mạng), chưa liên quan gì tới code bên trong.',
 'ImagePullBackOff はコンテナが動く前に起きます — 問題はイメージ取得の層（イメージの指定、レジストリ権限、ネットワーク到達性）で、中のコードとは無関係です。',
 [['Sai — node hết đĩa thường sinh lỗi eviction/khởi động khác; describe pod sẽ nói rõ lỗi kéo image chứ không phải đĩa.','誤り — ディスク不足は通常 eviction 等の別形で出ます。describe にはイメージ取得エラーと明記されます。'],
  ['Đúng — đọc sự kiện trong kubectl describe pod: thông báo lỗi kéo image chỉ thẳng một trong ba nguyên nhân này.','正解 — kubectl describe pod のイベントが、この3原因のどれかを直接示します。'],
  ['Sai — lỗi trong container thuộc họ CrashLoopBackOff (image kéo được rồi, chạy mới chết).','誤り — コンテナ内部のエラーは CrashLoopBackOff 系（イメージは引けたが起動後に死ぬ）です。'],
  ['Sai — thiếu memory limit không chặn việc kéo image.','誤り — メモリ limit の未設定はイメージ取得を妨げません。']]),
TQ('gen','Quan sát hệ thống','オブザーバビリティ',
 'Sự cố lúc nửa đêm: người dùng báo “web chậm” nhưng CPU, RAM mọi máy đều bình thường. Loại dữ liệu quan sát nào nên xem tiếp?',
 '深夜の障害：ユーザーは「Web が遅い」と言うが、全マシンの CPU・RAM は正常。次に見るべき観測データは？',
 [['Chỉ xem lại metric CPU sau 1 giờ','1時間後に CPU メトリクスを見直す'],
  ['Logs và Traces: log lỗi/ghi chậm ở tầng ứng dụng và trace để biết thời gian đang chết ở khâu nào (app, DB hay dịch vụ ngoài)','ログとトレース：アプリ層のエラー/低速ログと、時間の死に場所（アプリ、DB、外部サービス）を追うトレース'],
  ['Tăng ngưỡng alarm lên để khỏi báo','アラーム閾値を上げて鳴らなくする'],
  ['Khởi động lại lần lượt từng máy','各マシンを順番に再起動する']],
 1,
 'Metric là số đo tổng hợp — nó nói “có chuyện” nhưng hiếm khi nói “ở đâu”. Logs cho chi tiết sự kiện, traces nối hành trình một request qua nhiều dịch vụ để tìm đúng khâu nghẽn: đó là bộ ba Observability.',
 'メトリクスは集約値で「何か起きている」は言えても「どこで」はほぼ言えません。ログが事象の詳細を、トレースが複数サービスを跨ぐ1リクエストの旅を示し、詰まり箇所を特定します。これがオブザーバビリティの3本柱です。',
 [['Sai — chờ đợi không thêm thông tin; “chậm mà tài nguyên rảnh” là chữ ký của nghẽn ở phụ thuộc (DB, API ngoài, khoá chờ).','誤り — 待っても情報は増えません。「遅いのに資源は暇」は依存先（DB、外部 API、ロック待ち）の詰まりのサインです。'],
  ['Đúng — chuyển từ Metrics sang Logs và Traces khi metric không giải thích được triệu chứng.','正解 — メトリクスで説明できない症状では、ログとトレースへ移るのが定石です。'],
  ['Sai — nâng ngưỡng alarm là làm hệ thống mù đi giữa một sự cố đang diễn ra.','誤り — 障害の最中に閾値を上げるのは監視を盲目にすることです。'],
  ['Sai — restart dây chuyền không có mục tiêu là cách phá bằng chứng nhanh nhất.','誤り — 無差別な順次再起動は証拠を消す最速の方法です。']]),
TQ('gen','Quy trình sự cố','インシデント対応',
 'Hệ thống production đang sập diện rộng, khách hàng bị ảnh hưởng. Theo quy trình xử lý sự cố chuẩn, ưu tiên nào đứng trước?',
 '本番が広範囲に停止し顧客へ影響中。標準的なインシデント対応で最優先は？',
 [['Tìm cho ra nguyên nhân gốc rễ rồi mới sửa','根本原因を突き止めてから直す'],
  ['Khắc phục để khôi phục dịch vụ trước (mitigation): rollback bản deploy gần nhất hoặc chuyển traffic sang hệ dự phòng; phân tích nguyên nhân gốc làm sau khi dịch vụ sống lại','まずサービス復旧（緩和）：直近デプロイのロールバックや予備系への切替。根本原因分析は復旧後'],
  ['Viết báo cáo sự cố chi tiết ngay','詳細な障害報告書を即書く'],
  ['Họp toàn công ty để phân công','全社会議で分担を決める']],
 1,
 'Trong sự cố đang diễn ra: Detection → Triage → Mitigation (khôi phục dịch vụ) → Verification → rồi mới RCA. Khách hàng cần hệ thống sống lại trước khi cần biết vì sao nó chết.',
 '進行中の障害では：検知 → トリアージ → 緩和（サービス復旧）→ 検証 → その後に RCA。顧客は「なぜ死んだか」より先に「生き返ること」を必要とします。',
 [['Sai — RCA trong lúc cháy nhà làm kéo dài downtime; nguyên nhân gốc để sau, có ghi chép hiện trường hỗ trợ.','誤り — 火事の最中の RCA は停止を長引かせます。根本原因は後、現場記録が支えます。'],
  ['Đúng — rollback/chuyển hướng là đòn bẩy khôi phục nhanh nhất và an toàn nhất khi chưa rõ nguyên nhân.','正解 — ロールバック/切替は、原因不明時に最も速く安全な復旧レバーです。'],
  ['Sai — báo cáo là việc sau sự cố; giữa sự cố chỉ cần ghi chép ngắn gọn theo thời gian (timeline).','誤り — 報告書は事後のもの。最中は時系列の短い記録で十分です。'],
  ['Sai — phân công phải có sẵn trong kế hoạch ứng phó (ai là Incident Commander), không họp hành khi đang cháy.','誤り — 分担は対応計画で事前に決まっているべき（インシデントコマンダー等）で、火事の最中に会議はしません。']]),
TQ('gen','Độ tin cậy','信頼性',
 'Một dịch vụ cam kết SLO 99,9% thời gian hoạt động mỗi tháng. Error Budget (ngân sách lỗi) tương ứng là bao nhiêu thời gian downtime?',
 '月間稼働率 SLO 99.9% のサービス。エラーバジェット（許容停止時間）はおよそどれだけか？',
 [['Khoảng 43 phút mỗi tháng','月あたり約43分'],
  ['Khoảng 4,3 giờ mỗi tháng','月あたり約4.3時間'],
  ['Bằng 0 — SLO 99,9% nghĩa là không được phép sập','ゼロ — 99.9% は停止禁止を意味する'],
  ['Khoảng 3 ngày mỗi tháng','月あたり約3日']],
 0,
 '0,1% của một tháng (~43.200 phút) ≈ 43 phút. Error Budget là lượng downtime “được phép tiêu” — còn ngân sách thì đội ngũ được phép mạo hiểm deploy nhanh, hết ngân sách thì đóng băng thay đổi để ổn định hệ thống.',
 '1か月（約43,200分）の0.1%は約43分。エラーバジェットは「使ってよい停止時間」で、残っている間は速いデプロイの冒険が許され、尽きたら変更を凍結して安定化に振ります。',
 [['Đúng — công thức: (100% − SLO) × tổng thời gian; 99,9% → ~43 phút/tháng, 99% → ~7,2 giờ.','正解 — 計算式は（100% − SLO）× 総時間。99.9% → 月約43分、99% → 約7.2時間です。'],
  ['Sai — 4,3 giờ tương ứng SLO khoảng 99% chứ không phải 99,9%.','誤り — 4.3時間は SLO 99% 相当で、99.9% ではありません。'],
  ['Sai — không hệ thống thật nào có ngân sách lỗi bằng 0; SLO 100% là không thể đạt và không ai cam kết.','誤り — 実システムにバジェット0は存在しません。SLO 100% は達成不可能で誰も約束しません。'],
  ['Sai — 3 ngày tương ứng khoảng 90%, thấp hơn rất xa.','誤り — 3日は約90%相当で、はるかに低い値です。']]),
TQ('aws','Sao lưu & DR','バックアップと DR',
 'Hệ thống yêu cầu: sau thảm hoạ, dữ liệu mất tối đa 5 phút và dịch vụ sống lại trong tối đa 1 giờ. Hai thông số này lần lượt là?',
 '要件：災害後、データ損失は最大5分、サービス復旧は最大1時間。この2つの指標は順に何か？',
 [['SLA và SLO','SLA と SLO'],
  ['RPO = 5 phút (điểm khôi phục), RTO = 1 giờ (thời gian khôi phục)','RPO = 5分（復旧時点）、RTO = 1時間（復旧時間）'],
  ['RTO = 5 phút, RPO = 1 giờ','RTO = 5分、RPO = 1時間'],
  ['MTBF và MTTR','MTBF と MTTR']],
 1,
 'RPO (Recovery Point Objective) đo bằng lượng dữ liệu — quay lui tối đa bao lâu; RTO (Recovery Time Objective) đo bằng thời gian chết — bao lâu thì sống lại. RPO quyết định tần suất backup/replication, RTO quyết định mức độ tự động hoá failover.',
 'RPO（Recovery Point Objective）はデータの巻き戻し量、RTO（Recovery Time Objective）は停止時間の長さ。RPO がバックアップ/複製の頻度を、RTO がフェイルオーバーの自動化レベルを決めます。',
 [['Sai — SLA/SLO là cam kết/mục tiêu mức dịch vụ nói chung, không phải hai thông số DR này.','誤り — SLA/SLO はサービス水準の約束/目標一般で、この2つの DR 指標ではありません。'],
  ['Đúng — nhớ theo câu hỏi: “mất dữ liệu bao nhiêu” → RPO; “chết bao lâu” → RTO.','正解 — 「データ損失はどれだけ」→ RPO、「停止はどれだけ」→ RTO、で覚えます。'],
  ['Sai — hoán đổi hai khái niệm: 5 phút gắn với dữ liệu (RPO), 1 giờ gắn với thời gian khôi phục (RTO).','誤り — 入れ替わっています：5分はデータ（RPO）、1時間は復旧時間（RTO）です。'],
  ['Sai — MTBF/MTTR là thống kê độ tin cậy của thiết bị, không phải mục tiêu thiết kế DR.','誤り — MTBF/MTTR は機器の信頼性統計で、DR の設計目標ではありません。']]),
TQ('gen','Hệ điều hành','OS',
 'Sau khi xoá một file log khổng lồ, dung lượng đĩa vẫn không giảm. Nguyên nhân quen thuộc?',
 '巨大なログファイルを削除したのに、ディスク使用量が減らない。お馴染みの原因は？',
 [['Phải restart máy thì dung lượng mới cập nhật','容量の反映には再起動が必要'],
  ['Tiến trình đang chạy vẫn giữ file đã xoá (deleted-but-open) — dung lượng chỉ được trả khi tiến trình đó kết thúc hoặc restart','実行中プロセスが削除済みファイルを開いたまま保持している（deleted-but-open）— プロセス終了/再起動まで容量は戻らない'],
  ['File chưa vào thùng rác','ファイルがゴミ箱に残っている'],
  ['Đĩa bị phân mảnh','ディスクの断片化']],
 1,
 'Trên Linux, xoá một file đang được mở chỉ gỡ tên khỏi thư mục; dữ liệu vẫn nằm đó cho tới khi tiến trình đóng file. lsof +L1 liệt kê đúng các file này; cách xử lý đúng là restart dịch vụ giữ file (hoặc truncate file về 0 thay vì xoá).',
 'Linux では、開かれているファイルの削除は名前を外すだけで、プロセスが閉じるまでデータは残ります。lsof +L1 で一覧でき、正しい扱いは保持サービスの再起動（または削除でなく truncate で0にする）です。',
 [['Sai — không cần restart cả máy; chỉ cần tiến trình giữ file đóng file (restart riêng dịch vụ đó là đủ).','誤り — マシン全体の再起動は不要。保持プロセスが閉じれば（そのサービスの再起動で）十分です。'],
  ['Đúng — đây là lý do “xoá rồi mà df không đổi” đứng đầu bảng các bí ẩn vận hành Linux.','正解 — 「消したのに df が変わらない」は Linux 運用の謎ランキング筆頭です。'],
  ['Sai — Linux server không có cơ chế thùng rác cho lệnh rm.','誤り — サーバーの rm にゴミ箱の仕組みはありません。'],
  ['Sai — phân mảnh ảnh hưởng hiệu năng, không giữ dung lượng của file đã xoá.','誤り — 断片化は性能の問題で、削除済みファイルの容量を保持しません。']]),
TQ('gcp','Giám sát','監視',
 'Trên Google Cloud, cần xem log của một Cloud Run revision cụ thể để chẩn đoán lỗi khởi động. Nguồn nào đúng?',
 'Google Cloud で、特定の Cloud Run リビジョンの起動エラーを調べる正しい情報源は？',
 [['Cloud Billing report','Cloud Billing レポート'],
  ['Cloud Logging với bộ lọc theo resource cloud_run_revision và nhãn revision_name của revision lỗi','Cloud Logging で resource の cloud_run_revision と、失敗した revision_name ラベルで絞り込む'],
  ['Nhật ký truy cập của Cloud DNS','Cloud DNS のアクセスログ'],
  ['Trang trạng thái Google Cloud chung','Google Cloud の全体ステータスページ']],
 1,
 'Log của Cloud Run nằm ở Cloud Logging, gắn nhãn theo service và revision — lọc đúng revision lỗi mới thấy thông điệp khởi động thật thay vì lẫn log của bản đang chạy tốt.',
 'Cloud Run のログは Cloud Logging にあり、サービスとリビジョンでラベル付けされます。失敗したリビジョンで絞ることで、正常版のログに埋もれず起動時の実メッセージが見えます。',
 [['Sai — báo cáo billing lo tiền, không chứa log kỹ thuật.','誤り — 請求レポートは金額用で、技術ログは含まれません。'],
  ['Đúng — “đúng revision, đúng log” là nguyên tắc chẩn đoán trên mọi nền tảng có phiên bản triển khai.','正解 — 「正しいリビジョンの、正しいログ」が、版本を持つ全プラットフォームの診断原則です。'],
  ['Sai — DNS log chỉ cho thấy phân giải tên, không có lỗi khởi động container.','誤り — DNS ログは名前解決のみで、コンテナの起動エラーはありません。'],
  ['Sai — trang trạng thái chỉ nói sự cố diện rộng của Google, không nói revision của bạn vì sao chết.','誤り — ステータスページは Google 全体の障害用で、あなたのリビジョンの死因は載りません。']]),
TQ('aws','Load Balancer','ロードバランサー',
 'ALB trả 503 thay vì 502. Diễn giải đúng nhất?',
 'ALB が502でなく503を返す。最も正しい解釈は？',
 [['Chứng chỉ hết hạn','証明書の期限切れ'],
  ['Không có target healthy nào để gửi request — khác 502 (có target nhưng phản hồi lỗi) và 504 (target phản hồi quá chậm)','送り先の healthy なターゲットが1つもない — 502（ターゲットはあるが応答が不正）や504（応答が遅すぎる）とは別'],
  ['Người dùng gõ sai URL','ユーザーの URL 入力ミス'],
  ['ALB bị quá tải phần cứng','ALB のハードウェア過負荷']],
 1,
 'Bộ ba lỗi của ALB cần thuộc lòng: 502 = target trả phản hồi hỏng/không hoàn tất; 503 = không còn target healthy; 504 = target không phản hồi trong thời gian cho phép (gateway timeout).',
 'ALB の3エラーは暗記必須：502＝ターゲット応答が不正/不完全、503＝healthy なターゲットなし、504＝制限時間内に応答なし（ゲートウェイタイムアウト）。',
 [['Sai — chứng chỉ hết hạn lỗi ở bước bắt tay TLS phía client, không sinh mã 503 từ ALB.','誤り — 証明書切れはクライアントの TLS ハンドシェイクで起き、ALB の503にはなりません。'],
  ['Đúng — thấy 503 là đi ngay vào target group xem vì sao mọi target đều unhealthy.','正解 — 503 を見たら即ターゲットグループで全台 unhealthy の理由を確認します。'],
  ['Sai — URL sai thuộc họ 404 (không tìm thấy tài nguyên), không phải 503.','誤り — URL ミスは404系で、503ではありません。'],
  ['Sai — ALB là dịch vụ quản lý tự scale; 503 từ ALB luôn nói về phía target, không phải bản thân ALB.','誤り — ALB は自前でスケールするマネージド型で、503 は常にターゲット側の話です。']]),
TQ('k8s','Kubernetes','Kubernetes',
 'Deployment mới rollout xong thì pod liên tục bị liveness probe giết và restart dù ứng dụng chỉ khởi động chậm (cần ~60 giây). Sửa đúng hướng?',
 '新デプロイの Pod が、アプリの起動が遅い（約60秒必要な）だけでライブネスプローブに殺され再起動し続ける。正しい方向の修正は？',
 [['Tăng số replica để bù','レプリカ数を増やして補う'],
  ['Dùng startup probe (hoặc nới initialDelaySeconds/failureThreshold của liveness) để app có thời gian khởi động; readiness mới lo việc nhận traffic','スタートアッププローブを使う（または liveness の initialDelaySeconds/failureThreshold を緩める）ことで起動時間を確保し、トラフィックの可否はレディネスに任せる'],
  ['Xoá hết probe cho khỏi bị giết','プローブを全部消して殺されないようにする'],
  ['Giảm memory limit','メモリ limit を下げる']],
 1,
 'Liveness probe quá hung hăng là án oan cho app khởi động chậm: startup probe sinh ra đúng cho việc này — nó bảo vệ giai đoạn khởi động, thành công rồi liveness mới bắt đầu làm việc.',
 'ライブネスが攻撃的すぎると、起動の遅いアプリが冤罪で殺されます。スタートアッププローブはまさにこのための仕組みで、起動フェーズを守り、成功後にライブネスが働き始めます。',
 [['Sai — thêm replica là thêm pod bị giết theo cùng một cách.','誤り — レプリカを増やせば同じ殺され方の Pod が増えます。'],
  ['Đúng — phân biệt đúng vai: startup cho lúc lên, readiness cho traffic, liveness cho lúc treo thật.','正解 — 役割分担が正解：startup は起動時、readiness はトラフィック、liveness は実ハング時。'],
  ['Sai — bỏ probe là bỏ cả lưới an toàn: pod treo thật sẽ không ai restart và vẫn nhận traffic nếu thiếu readiness.','誤り — プローブを消すと安全網まで消えます。本当に固まった Pod を誰も再起動しません。'],
  ['Sai — memory limit không liên quan thời gian khởi động (và giảm còn dễ sinh OOMKilled).','誤り — メモリ上限は起動時間と無関係で、下げれば OOMKilled が増えます。']]),
TQ('aws','Networking','ネットワーク',
 'Một route cụ thể 203.0.113.0/24 → VPN được thêm vào route table của private subnet để tới hệ đối tác, nhưng sau đó ứng dụng mất luôn khả năng gọi một API công cộng nằm đúng trong dải đó qua NAT. Đây là hệ quả của nguyên tắc nào?',
 'プライベートサブネットのルートテーブルに 203.0.113.0/24 → VPN（取引先向け）を追加したところ、その範囲内にある公開 API へ NAT 経由で呼べなくなった。どの原則の帰結か？',
 [['Security Group là stateful','Security Group のステートフル性'],
  ['Longest prefix match: route /24 cụ thể hơn thắng route mặc định 0.0.0.0/0 → NAT, nên traffic trong dải đó bị kéo sang VPN','最長プレフィックス一致：具体的な /24 が既定の 0.0.0.0/0 → NAT に勝ち、その範囲の通信が VPN へ引かれる'],
  ['DNS cache chưa hết hạn','DNS キャッシュの未失効'],
  ['NAT Gateway giới hạn băng thông','NAT ゲートウェイの帯域制限']],
 1,
 'Route cụ thể luôn thắng route mặc định, kể cả khi “cụ thể” đó vô tình nuốt cả những đích công cộng nằm chung dải — khi thêm route phải đối chiếu toàn bộ đích đang dùng trong dải.',
 '具体的なルートは常に既定ルートに勝ちます。その範囲にたまたま含まれる公開の宛先まで飲み込むため、ルート追加時は範囲内の実宛先を全部照合する必要があります。',
 [['Sai — stateful/stateless là chuyện của tường lửa, không quyết định đường đi của gói tin.','誤り — ステートフル性はファイアウォールの話で、経路決定には関与しません。'],
  ['Đúng — đây chính là longest prefix match “cắn ngược” người cấu hình thiếu đối chiếu.','正解 — 最長プレフィックス一致が、照合不足の設定者へ「噛み返した」形です。'],
  ['Sai — triệu chứng là mất đường đi tới một dải IP, không phải phân giải tên.','誤り — 症状は IP レンジへの経路喪失で、名前解決ではありません。'],
  ['Sai — băng thông NAT làm chậm chứ không làm traffic đổi hẳn sang đường VPN.','誤り — 帯域制限は遅くはしても、通信を VPN 経路へ切り替えたりはしません。']]),
TQ('gen','Di trú dữ liệu','データ',
 'Ứng dụng cần đọc một object trên S3 mã hoá bằng SSE-KMS và bị AccessDenied dù đã có s3:GetObject. Quyền còn thiếu rất có thể là?',
 'SSE-KMS で暗号化された S3 オブジェクトを読もうとして AccessDenied。s3:GetObject はある。不足している可能性が高い権限は？',
 [['s3:DeleteObject','s3:DeleteObject'],
  ['kms:Decrypt trên KMS key đã mã hoá object đó','そのオブジェクトを暗号化した KMS キーへの kms:Decrypt'],
  ['ec2:DescribeInstances','ec2:DescribeInstances'],
  ['s3:ListAllMyBuckets','s3:ListAllMyBuckets']],
 1,
 'Đọc object mã hoá SSE-KMS là hai thao tác lồng nhau: lấy object (S3) và giải mã (KMS). Thiếu vế thứ hai là nguyên nhân AccessDenied “khó hiểu” kinh điển.',
 'SSE-KMS オブジェクトの読み取りは2つの操作の入れ子です：取得（S3）と復号（KMS）。後者の不足が「不可解な」AccessDenied の古典的原因です。',
 [['Sai — quyền xoá không liên quan thao tác đọc, và cấp nó còn nguy hiểm.','誤り — 削除権限は読み取りと無関係で、付けること自体も危険です。'],
  ['Đúng — nhớ nguyên tắc: thấy mã hoá KMS là phải nghĩ ngay tới cặp quyền trên key.','正解 — 原則：KMS 暗号化を見たら、そのキーへの権限ペアを即思い出すこと。'],
  ['Sai — quyền EC2 hoàn toàn ngoài luồng đọc S3 này.','誤り — EC2 の権限はこの読み取りフローと無関係です。'],
  ['Sai — ListAllMyBuckets chỉ liệt kê tên bucket, không mở được nội dung object.','誤り — ListAllMyBuckets はバケット名の一覧だけで、中身は開けません。']]),
TQ('gcp','IAM','IAM',
 'Một user đã được cấp role ở cấp project nhưng vẫn không xem được log trong một thư mục (folder) khác của tổ chức. Giải thích đúng?',
 'プロジェクトレベルでロールを付与されたユーザーが、組織内の別フォルダのログを見られない。正しい説明は？',
 [['Role cần 24 giờ để kế thừa xuống','ロール継承には24時間かかる'],
  ['Quyền IAM của GCP chảy từ trên xuống trong hierarchy: cấp ở project A không cho quyền ở folder/project khác; phải cấp tại đúng tầng chứa tài nguyên (hoặc tầng cha của nó)','GCP の IAM 権限は階層を下方向に流れる：プロジェクト A への付与は別フォルダ/プロジェクトに効かない。リソースを含む層（またはその親）で付与が必要'],
  ['User phải đăng xuất 7 ngày','7日間のログアウトが必要'],
  ['Log chỉ xem được bởi tài khoản billing','ログは請求アカウントでのみ閲覧可能']],
 1,
 'Resource hierarchy của GCP là cây tổ chức → folder → project → resource; policy gắn ở nút nào chỉ có hiệu lực cho cây con của nút đó. Cấp “sai tầng” là lỗi IAM số 1 trên GCP.',
 'GCP のリソース階層は 組織 → フォルダ → プロジェクト → リソース の木で、ポリシーは付けたノードの部分木にのみ効きます。「付ける層の間違い」が GCP の IAM ミス第1位です。',
 [['Sai — kế thừa có hiệu lực gần như tức thì khi cấp đúng tầng; chờ đợi không sửa được việc cấp sai chỗ.','誤り — 正しい層なら継承はほぼ即時。待っても付け間違いは直りません。'],
  ['Đúng — luôn tự hỏi “quyền này gắn ở tầng nào, tài nguyên nằm trong cây con của nó không”.','正解 — 常に「この権限はどの層に付き、リソースはその部分木の中か」を問うこと。'],
  ['Sai — không có quy tắc đăng xuất nào như vậy trong IAM.','誤り — IAM にそのようなログアウト規則はありません。'],
  ['Sai — xem log cần role logging.viewer tương đương tại đúng phạm vi, không liên quan tài khoản billing.','誤り — ログ閲覧には正しい範囲での logging.viewer 等が必要で、請求アカウントとは無関係です。']]),
TQ('aws','Giám sát','監視',
 'Alarm chưa từng kêu lần nào trong 6 tháng dù hệ thống đã có 2 sự cố thật. Bài học vận hành rút ra?',
 'システムで実際に2回障害があったのに、アラームが6か月間一度も鳴らなかった。運用の教訓は？',
 [['Hệ thống giám sát càng ít kêu càng tốt','監視は鳴らないほど良い'],
  ['Alarm cũng phải được kiểm tra định kỳ như hệ thống chính: test bằng set-alarm-state, rà soát dimension/ngưỡng, và coi “không bao giờ kêu” là một dấu hiệu bất thường cần điều tra','アラームも本番系と同様に定期テストすべき：set-alarm-state で試験し、dimension/閾値を見直し、「決して鳴らない」を調査すべき異常サインとして扱う'],
  ['Nên xoá hết alarm để đỡ ồn','うるさいのでアラームを全部消す'],
  ['Chuyển toàn bộ thông báo sang kiểm tra thủ công mỗi tuần','全て週1回の手動確認に切り替える']],
 1,
 'Một alarm chưa từng được kiểm chứng là một alarm chưa chắc tồn tại: chuỗi metric → alarm → SNS → người nhận phải được test đầu-cuối định kỳ, y như diễn tập DR.',
 '一度も検証されていないアラームは、存在する保証がありません。メトリクス → アラーム → SNS → 受け手の鎖を定期的に一気通貫でテストすべきで、DR 演習と同じ考え方です。',
 [['Sai — im lặng có hai mặt: hệ thống khoẻ, hoặc hệ thống giám sát đã chết lặng lẽ. Không phân biệt được hai mặt là chưa làm vận hành.','誤り — 静けさには2つの顔があります：健全か、監視が静かに死んでいるか。見分けられなければ運用とは言えません。'],
  ['Đúng — “test cả cái chuông báo cháy” là nguyên tắc giám sát trưởng thành.','正解 — 「火災報知器自体をテストする」のが成熟した監視の原則です。'],
  ['Sai — xoá alarm sau sự cố câm lặng là phản ứng ngược hoàn toàn.','誤り — 無通知の障害の後にアラームを消すのは完全に逆の反応です。'],
  ['Sai — kiểm tra thủ công hằng tuần không bắt được sự cố lúc 3 giờ sáng; tự động hoá + test định kỳ mới là đáp án.','誤り — 週1の手動確認では午前3時の障害は捕まえられません。自動化＋定期テストが答えです。']]),
TQ('gen','Sao lưu & DR','バックアップと DR',
 'Chiến lược backup nào đáp ứng RPO = 0 đối với một database quan trọng?',
 '重要なデータベースで RPO = 0 を満たすバックアップ戦略は？',
 [['Snapshot mỗi giờ','1時間ごとのスナップショット'],
  ['Replication đồng bộ (synchronous) sang bản dự phòng: giao dịch chỉ được xác nhận khi đã ghi ở cả hai nơi nên không mất dữ liệu khi bản chính chết','同期レプリケーション：トランザクションは両方に書けて初めて確定するため、プライマリが死んでもデータは失われない'],
  ['Backup đầy đủ mỗi đêm','毎晩のフルバックアップ'],
  ['Export CSV mỗi tuần','週1回の CSV エクスポート']],
 1,
 'RPO = 0 nghĩa là không chấp nhận mất bất kỳ giao dịch nào đã xác nhận — chỉ replication đồng bộ làm được điều đó, đổi lại là độ trễ ghi cao hơn. Mọi lịch snapshot/backup theo chu kỳ đều có RPO > 0 theo đúng chu kỳ của nó.',
 'RPO = 0 は「確定済みトランザクションを1件も失わない」こと。満たせるのは同期レプリケーションのみで、代償は書き込み遅延の増加です。周期型のスナップショット/バックアップは、その周期分だけ RPO が必ず正になります。',
 [['Sai — snapshot mỗi giờ cho RPO tối đa 1 giờ (mất dữ liệu của giờ cuối).','誤り — 1時間ごとのスナップショットは最大1時間分のデータ損失（RPO 1時間）です。'],
  ['Đúng — đánh đổi ở đây là hiệu năng ghi; vì vậy RPO = 0 chỉ dành cho dữ liệu thật sự tối quan trọng.','正解 — 代償は書き込み性能。そのため RPO = 0 は本当に最重要のデータだけに使います。'],
  ['Sai — backup đêm cho RPO tới 24 giờ.','誤り — 毎晩のバックアップは RPO 最大24時間です。'],
  ['Sai — export tuần cho RPO tới 7 ngày, chỉ hợp lưu trữ/báo cáo.','誤り — 週次エクスポートは RPO 最大7日で、保管/レポート用です。']])
);

/* ================================================================
   A2 · TRANG FUNDAMENTALS — render + tiến độ localStorage
   ================================================================ */
var mainEl=document.querySelector('main');
var fundPage=document.createElement('section'); fundPage.id='fundPage'; fundPage.className='page-off';
fundPage.innerHTML='<div class="wrap"><div id="fundBody"></div></div>';
var troublePage=document.createElement('section'); troublePage.id='troublePage'; troublePage.className='page-off';
troublePage.innerHTML='<div class="wrap"><div id="tsBody"></div></div>';
if(mainEl){ mainEl.appendChild(fundPage); mainEl.appendChild(troublePage); }

var FKEY9='khoameow_fund_v1', FDONE9={};
try{ var __r9=localStorage.getItem(FKEY9); if(__r9) FDONE9=JSON.parse(__r9)||{}; }catch(e){ FDONE9={}; }
function saveFund9(){ try{ localStorage.setItem(FKEY9, JSON.stringify(FDONE9)); }catch(e){} }
function fundDoneCount(){ return CH.filter(function(c){ return FDONE9[c.id]; }).length; }
var openCh=null, openSc=null;

var fundBank=makeBank({
  hostId:'quizFund', prefix:'fq', bank:QB_FUND,
  tags:{gen:{label:['Nền tảng','基礎'],cls:'gen'}},
  filters:null,
  title:['🧠 Ngân hàng câu hỏi nền tảng — kiểm tra Level 0','🧠 基礎問題バンク — レベル0チェック'],
  intro:function(total,n){ return [
    'Mỗi phiên rút ngẫu nhiên '+n+' câu từ ngân hàng '+total+' câu (4 câu cho mỗi chương trong 10 chương). Trả lời xong hiện ngay đúng/sai kèm giải thích của cả 4 phương án — kể cả vì sao các đáp án sai lại sai. Làm đúng từ 8/10 trở lên trong một phiên là dấu hiệu bạn đã sẵn sàng rời Level 0 để vào học cloud.',
    '全'+total+'問（10章 × 各4問）から毎回ランダムに'+n+'問出題します。選ぶと正誤と4つの選択肢すべての解説（なぜ正しいか／なぜ間違いか）が表示されます。1セッションで 8/10 以上取れれば、レベル0を卒業してクラウドへ進む準備ができています。']; },
  sum:{ perfect:['Xuất sắc — nền tảng đã vững. Sang Flow Học Giai đoạn 1 (IAM, VPC, CLI) thôi.','満点です — 基礎は固まりました。学習フローのステージ1（IAM、VPC、CLI）へ進みましょう。'],
        good:['Khá vững. Đọc lại giải thích của các câu sai — mỗi đáp án sai đều gài một ngộ nhận cụ thể của người mới, nhận diện được chúng là đã thắng một nửa.','かなり安定しています。間違えた問題の解説を読み返しましょう。各誤答には初心者特有の誤解が仕込まれており、見抜ければ半分勝ちです。'],
        low:['Đừng nản — quay lại đúng chương ứng với câu sai ở phía trên, đọc mục “Điểm hay nhầm” rồi làm một phiên mới.','落ち込まずに — 間違えた問題に対応する章へ戻り、「よくある誤解」を読んでから新しいセッションへ。'] }
});
var troubleBank=makeBank({
  hostId:'quizTrouble', prefix:'tq', bank:QB_TROUBLE,
  tags:{aws:{label:['AWS','AWS'],cls:'aws'}, gcp:{label:['GCP','GCP'],cls:'gcp'},
        k8s:{label:['Kubernetes','Kubernetes'],cls:'k8s'}, gen:{label:['Chung','共通'],cls:'gen'}},
  filters:[['all',['Tất cả','すべて']],['aws',['AWS','AWS']],['gcp',['Google Cloud','Google Cloud']],['k8s',['Kubernetes','Kubernetes']]],
  title:['🧠 Ngân hàng câu hỏi sự cố — luyện phản xạ xử lý','🧠 障害対応 問題バンク — 対応の反射神経を鍛える'],
  intro:function(total,n){ return [
    'Mỗi phiên rút ngẫu nhiên '+n+' câu tình huống từ ngân hàng '+total+' câu: hệ thống đang gặp một sự cố cụ thể — bước kiểm tra đầu tiên đúng nhất là gì? Lọc theo AWS / Google Cloud / Kubernetes khi muốn luyện một mảng (câu “Chung” chỉ xuất hiện ở Tất cả). Trả lời xong hiện ngay giải thích của cả 4 phương án.',
    '全'+total+'問の状況問題から毎回ランダムに'+n+'問。「この障害で、最も正しい最初の確認は？」— AWS / Google Cloud / Kubernetes で絞り込みも可能です（「共通」の問題は「すべて」でのみ出題）。選ぶと4選択肢すべての解説が表示されます。']; },
  sum:{ perfect:['Phản xạ vận hành rất tốt — bạn đã nghĩ như một kỹ sư on-call thực thụ: quan sát trước, can thiệp sau.','運用の反射神経は上々です — 本物のオンコールエンジニアの思考（観察が先、介入は後）になっています。'],
        good:['Khá vững. Đọc lại giải thích các câu sai và mở tình huống tương ứng ở phía trên để xem quy trình xử lý đầy đủ 5 mục.','かなり安定しています。誤答の解説を読み返し、上の対応する事例で5項目の完全な手順を確認しましょう。'],
        low:['Hãy học theo cặp: mỗi câu sai đều có một tình huống đầy đủ ở phía trên trang này — đọc tình huống đó rồi làm lại phiên mới.','ペアで学びましょう：誤答にはこのページ上部に対応する完全な事例があります。それを読んでから新しいセッションへ。'] }
});

function fundDetailHTML(ch){
  return '<div class="dsec"><h3>'+ch.ic+' '+E(P(ch.t))+'</h3>'
   +'<h4>🎯 '+L('Mục tiêu','目標')+'</h4><p>'+E(P(ch.goal))+'</p>'
   +'<h4>📖 '+L('Nội dung chính','本編')+'</h4>'+P(ch.body)
   +'<h4>☁️ '+L('Ví dụ gắn với cloud','クラウドでの実例')+'</h4><p>'+E(P(ch.cloud))+'</p>'
   +'<h4>⚠️ '+L('Điểm hay nhầm','よくある誤解')+'</h4><ul>'+ch.miss.map(function(m){ return '<li>'+E(P(m))+'</li>'; }).join('')+'</ul>'
   +'<h4>➡️ '+L('Học tiếp','次に学ぶ')+'</h4><div class="flow-links">'+ch.links.map(function(x){ return '<a href="'+x[0]+'">'+E(JA()?x[2]:x[1])+'</a>'; }).join('')+'</div>'
   +'</div>';
}
function renderFundDetail(){
  var host=$('fundDetail'); if(!host) return;
  var ch=null; CH.forEach(function(c){ if(c.id===openCh) ch=c; });
  host.innerHTML=ch?fundDetailHTML(ch):'';
  fundPage.querySelectorAll('[data-fundcard]').forEach(function(card){
    card.classList.toggle('open', card.getAttribute('data-fundcard')===openCh);
    var hint=card.querySelector('.f9-open-hint');
    if(hint) hint.textContent=(card.getAttribute('data-fundcard')===openCh)?L('Thu gọn ▲','閉じる ▲'):L('Mở chi tiết ▼','詳細を開く ▼');
  });
}
function updateFundProgress(){
  var n=fundDoneCount();
  var pct=$('fundPct'); if(pct) pct.innerHTML=n+'<small>/'+CH.length+'</small>';
  var bar=$('fundBarFill'); if(bar) bar.style.width=(CH.length?n/CH.length*100:0)+'%';
}
function renderFund(){
  var n=fundDoneCount();
  var h='<div class="sec-head"><span class="sec-tag">'+L('Trang riêng · Level 0 — trước khi vào cloud','専用ページ · レベル0 — クラウドの前に')+'</span>'
   +'<h2>'+L('Nền tảng IT — IT Infrastructure Fundamentals','IT 基礎 — IT Infrastructure Fundamentals')+'</h2>'
   +'<p>'+L('Mười chương nền tảng mà người học cloud nào cũng cần trước khi đụng vào bất kỳ service nào: mạng, IP/CIDR, định tuyến, DNS, Linux, Windows Server, ảo hoá, database, scripting và Git. Mỗi chương gồm mục tiêu, nội dung chính (kèm bảng tra nhanh), một ví dụ gắn thẳng với cloud, các điểm hay nhầm và đường học tiếp. Học xong chương nào, tick “Đã học xong” ở chương đó — rồi tự kiểm chứng bằng ngân hàng 40 câu hỏi ở cuối trang thay vì chỉ tự tin suông.','クラウドのどのサービスに触る前にも必要な10章の基礎：ネットワーク、IP/CIDR、ルーティング、DNS、Linux、Windows Server、仮想化、データベース、スクリプト、Git。各章は「目標」「本編（早見表付き）」「クラウドでの実例」「よくある誤解」「次に学ぶ」で構成されます。章を終えたら「学習済み」にチェックし、最後の40問バンクで自己確認しましょう。')+'</p></div>';
  h+='<div class="f9-prog"><span class="fp-pct" id="fundPct">'+n+'<small>/'+CH.length+'</small></span>'
   +'<div class="f9-bar"><div id="fundBarFill" style="width:'+(CH.length?n/CH.length*100:0)+'%"></div></div>'
   +'<span class="fp-note">'+L('Đã hoàn thành '+n+'/'+CH.length+' chương — tiến độ được lưu trong trình duyệt này (localStorage). Đây là Giai đoạn 0 của Flow Học: xong trang này là vào thẳng Giai đoạn 1.','完了 '+n+'/'+CH.length+' 章 — 進捗はこのブラウザ（localStorage）に保存されます。ここは学習フローのステージ0で、終えればステージ1へ直行です。')+'</span></div>';
  h+='<div class="f9-grid">'+CH.map(function(ch,i){
    var done=!!FDONE9[ch.id];
    return '<div class="f9-card'+(done?' is-done':'')+'" data-fundcard="'+ch.id+'" role="button" tabindex="0" aria-expanded="'+(openCh===ch.id)+'">'
     +'<h3><span class="num">'+(i+1)+'</span>'+ch.ic+' '+E(P(ch.t))+'</h3>'
     +'<p>'+E(P(ch.goal))+'</p>'
     +'<span class="f9-meta"><label class="f9-check"><input type="checkbox" data-fundck="'+ch.id+'"'+(done?' checked':'')+' /><span>'+L('Đã học xong','学習済み')+'</span></label>'
     +'<span class="f9-open-hint">'+(openCh===ch.id?L('Thu gọn ▲','閉じる ▲'):L('Mở chi tiết ▼','詳細を開く ▼'))+'</span></span></div>';
  }).join('')+'</div>';
  h+='<div class="f9-detail" id="fundDetail"></div>';
  h+='<div class="diagram-card quiz-card" id="quizFund"></div>';
  $('fundBody').innerHTML=h;
  fundPage.querySelectorAll('[data-fundcard]').forEach(function(card){
    card.addEventListener('click',function(ev){
      if(ev.target&&ev.target.closest&&ev.target.closest('.f9-check')) return;
      var id=card.getAttribute('data-fundcard');
      openCh=(openCh===id)?null:id;
      card.setAttribute('aria-expanded', openCh===id?'true':'false');
      renderFundDetail();
      if(openCh){ var d=$('fundDetail'); if(d) d.scrollIntoView({block:'nearest'}); }
    });
    card.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); card.click(); } });
  });
  fundPage.querySelectorAll('[data-fundck]').forEach(function(ck){
    ck.addEventListener('change',function(){
      var id=ck.getAttribute('data-fundck');
      if(ck.checked) FDONE9[id]=true; else delete FDONE9[id];
      saveFund9();
      var card=fundPage.querySelector('[data-fundcard="'+id+'"]');
      if(card) card.classList.toggle('is-done', !!ck.checked);
      updateFundProgress();
      var note=fundPage.querySelector('.fp-note');
      if(note) note.textContent=L('Đã hoàn thành '+fundDoneCount()+'/'+CH.length+' chương — tiến độ được lưu trong trình duyệt này (localStorage). Đây là Giai đoạn 0 của Flow Học: xong trang này là vào thẳng Giai đoạn 1.','完了 '+fundDoneCount()+'/'+CH.length+' 章 — 進捗はこのブラウザ（localStorage）に保存されます。ここは学習フローのステージ0で、終えればステージ1へ直行です。');
    });
  });
  renderFundDetail();
  fundBank.render();
}

/* ================================================================
   C3 · TRANG TROUBLESHOOTING — render
   ================================================================ */
var TS_TAGS={aws:['AWS','aws'], gcp:['Google Cloud','gcp'], k8s:['Kubernetes','k8s'], gen:[JA()?'Chung':'Chung','gen']};
function tsTagOf(sc){ if(sc.tg==='aws') return ['AWS','aws']; if(sc.tg==='gcp') return ['Google Cloud','gcp']; if(sc.tg==='k8s') return ['Kubernetes','k8s']; return [L('Đa nền tảng','共通'),'gen']; }
function scDetailHTML(sc){
  var tag=tsTagOf(sc);
  return '<div class="dsec"><h3>'+sc.ic+' '+E(P(sc.t))+' <span class="f9-tag '+tag[1]+'">'+tag[0]+'</span></h3>'
   +'<h4>🔎 '+L('Triệu chứng','症状')+'</h4><p>'+E(P(sc.sym))+'</p>'
   +'<h4>🛠️ '+L('Quy trình xử lý','対応手順')+'</h4><ol>'+sc.steps.map(function(s){ return '<li>'+E(P(s))+'</li>'; }).join('')+'</ol>'
   +'<h4>🧬 '+L('Nguyên nhân gốc thường gặp','よくある根本原因')+'</h4><ul>'+sc.causes.map(function(s){ return '<li>'+E(P(s))+'</li>'; }).join('')+'</ul>'
   +'<h4>⌨️ '+L('Lệnh / công cụ kiểm tra','確認コマンド・ツール')+'</h4><div class="ts-cmd">'+E(sc.checks.join('\n'))+'</div>'
   +'<h4>🛡️ '+L('Phòng ngừa','予防')+'</h4><ul>'+sc.prevent.map(function(s){ return '<li>'+E(P(s))+'</li>'; }).join('')+'</ul>'
   +'</div>';
}
function renderTsDetail(){
  var host=$('tsDetail'); if(!host) return;
  var sc=null; SC.forEach(function(s){ if(s.id===openSc) sc=s; });
  host.innerHTML=sc?scDetailHTML(sc):'';
  troublePage.querySelectorAll('[data-sccard]').forEach(function(card){
    card.classList.toggle('open', card.getAttribute('data-sccard')===openSc);
    var hint=card.querySelector('.f9-open-hint');
    if(hint) hint.textContent=(card.getAttribute('data-sccard')===openSc)?L('Thu gọn ▲','閉じる ▲'):L('Mở quy trình ▼','手順を開く ▼');
  });
}
function renderTrouble(){
  var h='<div class="sec-head"><span class="sec-tag">'+L('Trang riêng · Cloud Operations — vận hành & xử lý sự cố','専用ページ · クラウド運用とトラブルシューティング')+'</span>'
   +'<h2>'+L('Vận hành & Xử lý sự cố — Cloud Operations & Troubleshooting','運用とトラブルシューティング — Cloud Operations & Troubleshooting')+'</h2>'
   +'<p>'+L('Biết deploy mới là nửa đầu của nghề cloud; nửa còn lại là giữ hệ thống sống và cứu nó đúng cách khi sự cố đến. Trang này gồm khung kiến thức vận hành cốt lõi, 14 tình huống sự cố thật (mỗi tình huống đủ 5 mục: triệu chứng → quy trình xử lý → nguyên nhân gốc → lệnh kiểm tra → phòng ngừa) và một ngân hàng 30 câu tình huống để luyện phản xạ “kiểm tra cái gì trước”.','デプロイできるのは仕事の半分。残り半分は、システムを生かし続け、障害時に正しく救うことです。本ページは運用の中核フレームワーク、14の実障害事例（症状 → 対応手順 → 根本原因 → 確認コマンド → 予防 の5項目完備）、そして「最初に何を確認するか」の反射を鍛える30問バンクで構成されます。')+'</p></div>';
  /* --- Dải khung kiến thức --- */
  h+='<div class="ts-strip">'
   +'<div class="ts-mini"><h3>👁️ '+L('Quan sát hệ thống — Observability','オブザーバビリティ — Observability')+'</h3>'
   +'<p>'+L('Ba trụ cột dữ liệu để “nhìn vào trong” một hệ thống đang chạy:','稼働中のシステムを「内側から見る」ための3本柱：')+'</p><ul>'
   +'<li><b>Metrics</b> — '+L('số đo định lượng theo thời gian (CPU, độ trễ, số request, tỷ lệ lỗi): rẻ, nhìn tổng quan, hợp để đặt alarm.','時系列の定量値（CPU、遅延、リクエスト数、エラー率）：安価で全体像が見え、アラーム向き。')+'</li>'
   +'<li><b>Logs</b> — '+L('nhật ký sự kiện có mốc thời gian của từng thành phần: chi tiết, đắt hơn, là nơi đọc “chuyện gì vừa xảy ra”.','各コンポーネントの時刻付きイベント記録：詳細で、「何が起きたか」を読む場所。')+'</li>'
   +'<li><b>Traces</b> — '+L('dấu vết một request đi qua nhiều dịch vụ: cho biết thời gian đang chết ở khâu nào.','複数サービスを跨ぐ1リクエストの追跡：時間がどこで死んでいるかを示す。')+'</li></ul>'
   +'<p>'+L('Quy tắc ghi nhớ: <b>metric cho biết “có chuyện”, log cho biết “chuyện gì”, trace cho biết “ở đâu”</b>. AWS có CloudWatch + X-Ray, GCP có Cloud Monitoring / Logging / Trace.','覚え方：<b>メトリクスは「何か起きた」、ログは「何が起きた」、トレースは「どこで」を教える</b>。AWS は CloudWatch ＋ X-Ray、GCP は Cloud Monitoring / Logging / Trace。')+'</p></div>'
   +'<div class="ts-mini"><h3>🚨 '+L('Quy trình xử lý sự cố — Incident Response','インシデント対応フロー')+'</h3><ol>'
   +'<li><b>'+L('Phát hiện (Detection)','検知（Detection）')+'</b> — '+L('alarm hoặc người dùng báo; ghi mốc thời gian đầu tiên.','アラームか利用者の申告。最初の時刻を記録。')+'</li>'
   +'<li><b>'+L('Phân loại (Triage)','切り分け（Triage）')+'</b> — '+L('mức độ nghiêm trọng, phạm vi ảnh hưởng, ai là người chỉ huy sự cố.','深刻度、影響範囲、指揮者を決定。')+'</li>'
   +'<li><b>'+L('Cô lập nguyên nhân (Isolation)','原因の切り分け（Isolation）')+'</b> — '+L('chia đôi không gian nguyên nhân bằng các kiểm tra rẻ và nhanh.','安く速い確認で原因空間を二分していく。')+'</li>'
   +'<li><b>'+L('Khắc phục (Mitigation)','緩和（Mitigation）')+'</b> — '+L('ưu tiên khôi phục dịch vụ: rollback, chuyển traffic, scale tạm — trước khi hiểu hết nguyên nhân.','原因を全部理解する前に、ロールバック・切替・一時的スケールでサービス復旧を優先。')+'</li>'
   +'<li><b>'+L('Kiểm chứng (Verification)','検証（Verification）')+'</b> — '+L('đo lại từ phía người dùng thật, không chỉ nhìn đèn xanh nội bộ.','内部の緑ランプでなく、実際の利用者側から再測定。')+'</li>'
   +'<li><b>RCA</b> — '+L('Root Cause Analysis, Phân tích nguyên nhân gốc: 5 Whys, dòng thời gian, và hành động phòng ngừa có chủ sở hữu + hạn hoàn thành.','根本原因分析：5 Whys、時系列、担当者と期限のある予防アクション。')+'</li></ol></div>'
   +'<div class="ts-mini"><h3>🎯 SLI / SLO / SLA / Error Budget</h3><ul>'
   +'<li><b>SLI</b> (Service Level Indicator — '+L('Chỉ số mức dịch vụ','サービスレベル指標')+'): '+L('con số đo thật chất lượng dịch vụ, vd tỷ lệ request thành công trong 30 ngày.','実測値。例：30日間のリクエスト成功率。')+'</li>'
   +'<li><b>SLO</b> (Service Level Objective — '+L('Mục tiêu mức dịch vụ','サービスレベル目標')+'): '+L('ngưỡng nội bộ đặt ra cho SLI, vd “SLI phải ≥ 99,9%”.','SLI への内部目標。例：「SLI は 99.9% 以上」。')+'</li>'
   +'<li><b>SLA</b> (Service Level Agreement — '+L('Cam kết mức dịch vụ','サービスレベル合意')+'): '+L('cam kết có ràng buộc với khách hàng, vi phạm là đền bù — luôn “dễ” hơn SLO để còn đệm an toàn.','顧客への契約上の約束。違反時は補償。安全マージンのため常に SLO より緩く設定。')+'</li>'
   +'<li><b>Error Budget</b> ('+L('Ngân sách lỗi','エラーバジェット')+'): '+L('100% − SLO = lượng lỗi “được phép tiêu”. Còn ngân sách → được deploy nhanh; hết ngân sách → đóng băng thay đổi, ưu tiên ổn định.','100% − SLO ＝「使ってよい」エラーの量。残っていれば速いデプロイ可、尽きたら変更凍結で安定優先。')+'</li></ul></div>'
   +'<div class="ts-mini"><h3>🛟 RTO / RPO — '+L('hai con số của khôi phục thảm hoạ','災害復旧の2つの数字')+'</h3>'
   +'<p><b>RTO</b> (Recovery Time Objective — '+L('Thời gian khôi phục mục tiêu','目標復旧時間')+'): '+L('hệ thống được phép “chết” bao lâu sau thảm hoạ (vd 1 giờ).','災害後にシステムが「死んでいてよい」上限時間（例：1時間）。')+'</p>'
   +'<p><b>RPO</b> (Recovery Point Objective — '+L('Điểm khôi phục mục tiêu','目標復旧時点')+'): '+L('được phép mất dữ liệu tới đâu, tính ngược từ lúc thảm hoạ (vd 5 phút → phải backup/replicate ít nhất mỗi 5 phút).','失ってよいデータの上限を、災害時点から遡って測る（例：5分 → 5分以内の頻度でバックアップ/複製が必要）。')+'</p>'
   +'<p>'+L('RTO/RPO quyết định toàn bộ chiến lược Backup & DR — phần này được đào sâu ở ','RTO/RPO はバックアップと DR 戦略全体を決めます。詳しくは')+'<a href="#/architect">'+L('phần Architect (HA/DR)','アーキテクト部（HA/DR）')+'</a>'+L(' với các mô hình từ Backup & Restore tới Multi-site Active-Active.','で、Backup & Restore から Multi-site Active-Active まで扱います。')+'</p></div>'
   +'</div>';
  /* --- 14 tình huống --- */
  h+='<div class="sec-head" style="margin-top:6px"><h2 style="font-size:22px">'+L('14 tình huống sự cố — bấm vào từng tình huống để mở đủ 5 mục','14の障害事例 — クリックで5項目すべてを開く')+'</h2>'
   +'<p>'+L('Thứ tự học gợi ý: đọc Triệu chứng, tự nhẩm quy trình của bạn trước, rồi mới mở ra đối chiếu — giống cách một kỹ sư on-call bị đánh thức lúc 3 giờ sáng phải làm.','推奨の学び方：症状を読み、自分の対応手順を頭の中で組み立ててから開いて照合する — 午前3時に叩き起こされたオンコールの実践そのものです。')+'</p></div>';
  h+='<div class="f9-grid">'+SC.map(function(sc){
    var tag=tsTagOf(sc);
    return '<div class="f9-card" data-sccard="'+sc.id+'" role="button" tabindex="0" aria-expanded="'+(openSc===sc.id)+'">'
     +'<h3>'+sc.ic+' '+E(P(sc.t))+'</h3>'
     +'<p>'+E(P(sc.sym))+'</p>'
     +'<span class="f9-meta"><span class="f9-tag '+tag[1]+'">'+tag[0]+'</span>'
     +'<span class="f9-open-hint">'+(openSc===sc.id?L('Thu gọn ▲','閉じる ▲'):L('Mở quy trình ▼','手順を開く ▼'))+'</span></span></div>';
  }).join('')+'</div>';
  h+='<div class="f9-detail" id="tsDetail"></div>';
  h+='<div class="diagram-card quiz-card" id="quizTrouble"></div>';
  $('tsBody').innerHTML=h;
  troublePage.querySelectorAll('[data-sccard]').forEach(function(card){
    card.addEventListener('click',function(){
      var id=card.getAttribute('data-sccard');
      openSc=(openSc===id)?null:id;
      card.setAttribute('aria-expanded', openSc===id?'true':'false');
      renderTsDetail();
      if(openSc){ var d=$('tsDetail'); if(d) d.scrollIntoView({block:'nearest'}); }
    });
    card.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); card.click(); } });
  });
  renderTsDetail();
  troubleBank.render();
}

/* ================================================================
   D · TÍCH HỢP — navbar 2 mục mới, hub cards, Flow Giai đoạn 0
   ================================================================ */
function makeNavLink9(href){
  var a=document.createElement('a'); a.href=href; a.setAttribute('data-route',href);
  a.addEventListener('click',function(){
    var g=a.closest('.nav-group');
    if(g){ g.classList.remove('open'); var b=g.querySelector('.nav-pillar'); if(b) b.setAttribute('aria-expanded','false'); }
  });
  return a;
}
var navLinkFund=null, navLinkTrouble=null;
try{
  var flowLink=document.querySelector('nav.top .nav-panel a[data-route="#/flow"]');
  var flowPanel=flowLink?flowLink.closest('.nav-panel'):null;
  if(flowPanel){ navLinkFund=makeNavLink9('#/fundamentals'); flowPanel.appendChild(navLinkFund); }
  var labsLink=document.querySelector('nav.top .nav-panel a[data-route="#/labs"]');
  var labsPanel=labsLink?labsLink.closest('.nav-panel'):null;
  if(labsPanel){ navLinkTrouble=makeNavLink9('#/troubleshooting'); labsPanel.appendChild(navLinkTrouble); }
  var hubGrid=document.querySelector('.hub-grid');
  if(hubGrid){
    var hc1=document.createElement('a'); hc1.className='hub-card'; hc1.href='#/fundamentals';
    hc1.innerHTML='<span class="hub-ic">🧱</span><b>Nền tảng IT — Level 0</b><p>10 chương trước khi vào cloud: mạng & OSI, IP/CIDR, routing, DNS, Linux, Windows Server & AD, ảo hoá, database, scripting, Git — mỗi chương có ví dụ gắn cloud, điểm hay nhầm, tick hoàn thành và ngân hàng 40 câu hỏi kiểm tra.</p>';
    hubGrid.appendChild(hc1);
    var hc2=document.createElement('a'); hc2.className='hub-card'; hc2.href='#/troubleshooting';
    hc2.innerHTML='<span class="hub-ic">🚨</span><b>Vận hành & Xử lý sự cố</b><p>Khung Observability, quy trình sự cố 6 bước, SLI/SLO/SLA/Error Budget, RTO/RPO — cùng 14 tình huống thật (EC2 CPU 100%, ALB 502, CrashLoopBackOff, S3 AccessDenied…) đủ 5 mục xử lý và ngân hàng 30 câu luyện phản xạ.</p>';
    hubGrid.appendChild(hc2);
  }
}catch(e){}
function navLabels9(){
  if(navLinkFund) navLinkFund.textContent=L('Nền tảng IT','IT 基礎');
  if(navLinkTrouble) navLinkTrouble.textContent=L('Xử lý sự cố','トラブルシューティング');
}
navLabels9();

/* Flow · Giai đoạn 0: gắn liên kết sang trang Fundamentals.
   Chỉ CHÈN một khối liên kết vào đầu giai đoạn 0 — không đụng
   dữ liệu FSTAGES/FN, không đánh số lại bất kỳ giai đoạn nào. */
function injectFlowLink(){
  try{
    var stages=document.querySelectorAll('#flowPage .flow-stage');
    if(!stages.length) return;
    var head=stages[0].querySelector('.flow-stage-head');
    if(!head||head.querySelector('#fundFlowLink')) return;
    var d=document.createElement('div'); d.className='flow-links'; d.id='fundFlowLink'; d.style.marginTop='10px';
    d.innerHTML='<a href="#/fundamentals">'+(JA()
      ?'📚 IT 基礎ページ — サービスに入る前に、10章の基礎（ネットワーク、Linux、DNS、Git…）を固める →'
      :'📚 Trang Nền tảng IT — học đủ 10 chương nền tảng (mạng, Linux, DNS, Git…) trước khi vào service →')+'</a>';
    head.appendChild(d);
  }catch(e){}
}

/* ================= ROUTER #/fundamentals · #/troubleshooting ================= */
var KNOWN9=['homeHub','services','labs','migration','diagrams','networking','du-an','architect','command','glossary','deploy','svcDetailPage','labDetailPage','comparePage','archLibPage','flowPage','pricingPage','decisionsPage','iacPage','fundPage','troublePage'];
function route9(){
  var h=location.hash||'#/';
  var mine=(h==='#/fundamentals')?'fundPage':((h==='#/troubleshooting')?'troublePage':null);
  if(mine){
    KNOWN9.forEach(function(id){ var el=$(id); if(el) el.classList.toggle('page-off', id!==mine); });
    var hero=document.querySelector('header.hero'); if(hero) hero.classList.add('page-off');
    document.querySelectorAll('nav.top a[data-route]').forEach(function(a){ a.classList.toggle('act', a.getAttribute('data-route')===h); });
    if(mine==='fundPage') renderFund(); else renderTrouble();
    window.scrollTo(0,0);
  }else{
    if(fundPage) fundPage.classList.add('page-off');
    if(troublePage) troublePage.classList.add('page-off');
    if(h==='#/flow') setTimeout(injectFlowLink,60);
  }
}
window.addEventListener('hashchange',route9);

/* Đổi ngôn ngữ: vẽ lại các khối của đợt này theo ngôn ngữ mới */
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      navLabels9();
      var h=location.hash||'#/';
      if(h==='#/fundamentals') renderFund();
      else if(h==='#/troubleshooting') renderTrouble();
      else if(h==='#/flow') injectFlowLink();
    },260);
  });
});

/* Số liệu cho nghiệm thu / gỡ lỗi */
window.U9={chapters:CH.length, fundBank:QB_FUND.length, scenarios:SC.length, troubleBank:QB_TROUBLE.length,
  fundDone:function(){ return fundDoneCount(); }};

renderFund();
renderTrouble();
injectFlowLink();
setTimeout(injectFlowLink,600);
route9();
})();
