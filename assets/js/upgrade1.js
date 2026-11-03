/* ============================================================
   upgrade1.js — ĐỢT 1 (theo bản đánh giá Gemini):
   1 · Số liệu hero = số thật tính từ dữ liệu, hiện ngay, không đếm từ 0
   2 · Navbar gom 4 trụ cột có dropdown (click/chạm)
   3 · Onboarding chọn mục tiêu (lưu localStorage)
   4 · Khối "Nói dễ hiểu" (TL;DR + ẩn dụ) trên trang chi tiết service
       + khung ẩn dụ ở trang Networking
   5 · Mini-quiz cuối trang Networking & Migration (song ngữ VI/JP)
   Nạp SAU app.js — chỉ bổ sung, không sửa hành vi cũ.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function L(vi,ja){ return (window.LANG==='ja'&&ja)?ja:vi; }

/* ================= 1 · SỐ LIỆU HERO = SỐ THẬT TỪ DỮ LIỆU ================= */
try{
  var svcTotal=0;
  [AWS_CAT,GCP_CAT].forEach(function(cat){ cat.forEach(function(g){ svcTotal+=g.items.length; }); });
  var el;
  el=$('statSvc'); if(el) el.textContent=svcTotal;                                   /* 226 AWS + 132 GCP = 358 */
  el=$('statLabs'); if(el&&typeof LABS!=='undefined'&&typeof MIGS!=='undefined') el.textContent=(LABS.length+MIGS.length); /* 12 + 9 = 21 */
  el=$('statNet'); if(el&&typeof NET!=='undefined'&&typeof GCPNET!=='undefined') el.textContent=(NET.length+GCPNET.length); /* 10 + 6 = 16 */
}catch(e){}

/* ================= 2 · NAVBAR 4 TRỤ CỘT (DROPDOWN) ================= */
var navGroups=[];
try{
  var bar=document.querySelector('nav.top .nav-scroll');
  if(bar){
    var PILLARS=[
      {t:'Lộ trình & Nền tảng', tj:'学習パスと基礎',       texts:['Flow Học','Services','Networking']},
      {t:'Kiến trúc & Thiết kế', tj:'アーキテクチャと設計', texts:['Sơ đồ','Architect','Migration']},
      {t:'Thực hành & Triển khai', tj:'実践とデプロイ',     texts:['Labs thực hành','Dự án','Deploy']},
      {t:'Tra cứu nhanh', tj:'クイックリファレンス',        texts:['Command','So sánh','Thuật ngữ JP']}
    ];
    var byText={};
    Array.prototype.slice.call(bar.querySelectorAll('a')).forEach(function(a){
      if(!a.classList.contains('brand')) byText[a.textContent.trim()]=a;
    });
    function closeNavGroups(except){
      navGroups.forEach(function(x){
        if(x.g===except) return;
        x.g.classList.remove('open'); if(x.panel) x.panel.classList.remove('open');
        x.btn.setAttribute('aria-expanded','false');
      });
    }
    PILLARS.forEach(function(def){
      var g=document.createElement('div'); g.className='nav-group';
      var btn=document.createElement('button');
      btn.type='button'; btn.className='nav-pillar';
      btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-haspopup','true');
      btn.innerHTML='<span class="np-t"></span><span class="np-caret" aria-hidden="true">▾</span>';
      var panel=document.createElement('div'); panel.className='nav-panel';
      def.texts.forEach(function(t){ var a=byText[t]; if(a) panel.appendChild(a); });
      panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ closeNavGroups(null); g.classList.remove('open'); panel.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }); });
      /* Uỷ quyền: link do các đợt sau (Pricing, Cây quyết định, IaC…) chèn vào panel
         cũng đóng menu khi bấm — handler của chúng tìm .nav-group không còn trúng
         vì panel đã rời khỏi group (xem dưới), nên đóng tập trung tại đây. */
      panel.addEventListener('click',function(e){ if(e.target&&e.target.closest&&e.target.closest('a')) closeNavGroups(null); });
      btn.addEventListener('click',function(ev){
        ev.stopPropagation();
        var willOpen=!g.classList.contains('open');
        closeNavGroups(g);
        g.classList.toggle('open',willOpen);
        panel.classList.toggle('open',willOpen);
        btn.setAttribute('aria-expanded',willOpen?'true':'false');
        if(willOpen&&window.innerWidth>=1024){
          var r=btn.getBoundingClientRect();
          panel.style.left=Math.max(8,Math.min(r.left,window.innerWidth-268))+'px';
        }
      });
      g.appendChild(btn); bar.appendChild(g);
      /* FIX TRIỆT ĐỂ (chẩn đoán lại lỗi dropdown không bấm được): panel KHÔNG nằm
         trong .nav-group/.nav-scroll nữa. .nav-scroll là vùng cuộn ngang
         (overflow-x:auto + overflow-y:hidden, cao 56px) và nav.top có
         backdrop-filter — tổ tiên tạo containing block cho position:fixed —
         nên panel bị vùng cuộn giữ trong stacking/hit-test của thanh nav và
         bị nội dung trang (z-index:1 ở gốc) đè hit-test trên trang live.
         Đưa panel thành con trực tiếp của nav.top: giữa panel và containing
         block không còn phần tử cuộn/overflow nào, hit-test sạch hoàn toàn.
         Các đợt sau vẫn tìm thấy panel qua 'nav.top .nav-panel' như cũ. */
      var navEl=document.querySelector('nav.top');
      if(navEl) navEl.appendChild(panel); else g.appendChild(panel);
      navGroups.push({g:g,btn:btn,panel:panel,def:def});
    });
    document.addEventListener('click',function(e){ if(!e.target.closest||(!e.target.closest('.nav-group')&&!e.target.closest('.nav-panel'))) closeNavGroups(null); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeNavGroups(null); });
    window.addEventListener('resize',function(){ closeNavGroups(null); });
  }
}catch(e){}
function navLang(){
  navGroups.forEach(function(x){
    var s=x.btn.querySelector('.np-t'); if(s) s.textContent=L(x.def.t,x.def.tj);
  });
  markActivePillar();
}
function markActivePillar(){
  navGroups.forEach(function(x){
    var on=!!x.panel.querySelector('a.act');
    x.g.classList.toggle('has-act',on); x.btn.classList.toggle('has-act',on);
  });
}
window.addEventListener('hashchange',function(){ setTimeout(markActivePillar,140); });
setTimeout(markActivePillar,350);

/* ================= 3 · ONBOARDING CHỌN MỤC TIÊU ================= */
var GOALS=[
 {id:'new', icon:'🌱', t:'Người mới hoàn toàn', tj:'完全な初心者',
  d:'Chưa từng dùng cloud. Đi theo Flow Học từ Giai đoạn 0: nền tảng → IAM/VPC → những service cốt lõi đầu tiên, đúng thứ tự, không ngợp.',
  dj:'クラウド未経験の方。学習フローのステージ0から順に：基礎 → IAM/VPC → 最初のコアサービスへ。順序通りで迷いません。',
  links:[['#/flow','Bắt đầu Flow Học · Kế hoạch A','学習フローを始める · プランA']]},
 {id:'exam', icon:'🎓', t:'Ôn thi SAA-C03 / ACE', tj:'SAA-C03 / ACE 試験対策',
  d:'Đã có nền, cần hệ thống hoá theo lộ trình chứng chỉ song song AWS ⇄ GCP và luyện đúng các mảng hay ra đề.',
  dj:'基礎がある方向け。AWS ⇄ GCP 並行の資格ロードマップで体系化し、出題範囲を重点的に固めます。',
  links:[['#/architect','Lộ trình chứng chỉ (Architect)','資格ロードマップ（アーキテクト）'],['#/flow','Flow Học để lấp lỗ hổng','弱点補強の学習フロー']]},
 {id:'aws2gcp', icon:'🔀', t:'Đã biết AWS, muốn học GCP', tj:'AWS経験者 → GCPを学ぶ',
  d:'Học theo kiểu đối chiếu: mỗi khái niệm AWS bạn đã biết sẽ được ánh xạ sang GCP, kèm khác biệt quyết định (VPC regional ⇄ global…).',
  dj:'対照で学ぶ形式：既知の AWS の概念を GCP に対応付け、決定的な違い（VPC の regional ⇄ global など）を押さえます。',
  links:[['#/compare','Bảng So sánh AWS ⇄ GCP','AWS ⇄ GCP 比較表'],['#/flow','Flow Học song song 2 cloud','2クラウド並行の学習フロー']]},
 {id:'pro', icon:'🚀', t:'Đã có kinh nghiệm, muốn chuyên sâu', tj:'経験者 · さらに深く',
  d:'Đi thẳng vào Networking nâng cao (Transit Gateway, hybrid, multi-VPC) và tư duy Architect: thiết kế dự án, Well-Architected, FinOps.',
  dj:'高度なネットワーキング（Transit Gateway、ハイブリッド、マルチVPC）とアーキテクト思考（設計、Well-Architected、FinOps）へ直行します。',
  links:[['#/networking','Networking nâng cao','高度なネットワーキング'],['#/architect','Trang Architect','アーキテクトページ']]}
];
var GKEY='khoameow_goal_v1', onboardOpen=false;
function getGoal(){ try{ return localStorage.getItem(GKEY); }catch(e){ return null; } }
function setGoal(id){ try{ if(id) localStorage.setItem(GKEY,id); else localStorage.removeItem(GKEY); }catch(e){} }
var obHost=null;
function renderOnboard(){
  if(!obHost) return;
  var ja=window.LANG==='ja';
  var saved=GOALS.filter(function(x){ return x.id===getGoal(); })[0];
  if(saved&&!onboardOpen){
    obHost.innerHTML='<div class="ob-strip"><span class="ob-strip-t">🎯 '+(ja?'現在の目標：':'Đang theo mục tiêu: ')+'<b>'+E(ja?saved.tj:saved.t)+'</b></span>'
      +'<a class="btn btn-o" href="'+saved.links[0][0]+'">'+(ja?'続ける →':'Tiếp tục →')+'</a>'
      +'<button type="button" class="btn btn-g" id="goalChange">'+(ja?'目標を変更':'Đổi mục tiêu')+'</button></div>';
    var cb=$('goalChange');
    if(cb) cb.addEventListener('click',function(){ onboardOpen=true; renderOnboard(); });
    return;
  }
  var h='<div class="onboard"><h3>🧭 '+(ja?'あなたは今どこにいますか？ 正しい場所から始めましょう':'Bạn đang ở đâu? Chọn để bắt đầu đúng chỗ')+'</h3>'
    +'<p class="ob-sub">'+(ja?'340以上のサービスの前に、まず目標を選んでください。選択はこのブラウザに保存され、次回は「続き」バナーが出ます。':'Trước khi đối mặt với 340+ service, hãy chọn mục tiêu của bạn. Lựa chọn được lưu trên trình duyệt này — lần sau vào trang sẽ có dải “Tiếp tục” đúng chỗ bạn đang học.')+'</p>'
    +'<div class="ob-grid">'
    +GOALS.map(function(g){
      return '<div class="ob-card"><span class="ob-ic">'+g.icon+'</span><b>'+E(ja?g.tj:g.t)+'</b><p>'+E(ja?g.dj:g.d)+'</p>'
        +'<span class="ob-links">'+g.links.map(function(lk,i){
          return '<a class="'+(i===0?'btn btn-o':'btn btn-g')+'" href="'+lk[0]+'" data-goal="'+g.id+'">'+E(ja?lk[2]:lk[1])+'</a>';
        }).join('')+'</span></div>';
    }).join('')
    +'</div></div>';
  obHost.innerHTML=h;
  obHost.querySelectorAll('[data-goal]').forEach(function(a){
    a.addEventListener('click',function(){ setGoal(a.getAttribute('data-goal')); onboardOpen=false; });
  });
}
try{
  var hub=$('homeHub');
  if(hub){
    var wrap=hub.querySelector('.wrap');
    obHost=document.createElement('div'); obHost.id='onboardHost';
    wrap.insertBefore(obHost,wrap.firstChild);
    renderOnboard();
  }
}catch(e){}

/* ================= 4 · KHỐI "NÓI DỄ HIỂU" (TL;DR) ================= */
/* key: 'cloud|Tên service' → [ẩn dụ VI, ẩn dụ JP] — chỉ viết cho service cốt lõi & hay nhầm */
var ANALOG={
'aws|Amazon EC2':['Thuê một phòng máy riêng trong trung tâm dữ liệu của AWS: bạn chọn cấu hình, cài gì tùy ý, trả tiền theo thời gian thuê — tắt máy là gần như hết phí compute.','AWSのデータセンターに専用のマシン室を借りるイメージ：構成は自由、課金は利用時間分。止めれば計算料金はほぼ止まります。'],
'aws|AWS Lambda':['Thuê đầu bếp theo món: chỉ khi có khách gọi món (sự kiện) đầu bếp mới xuất hiện, nấu xong là về — không khách thì không tốn tiền nuôi bếp.','注文ごとに呼ぶ料理人：イベントがある時だけ現れて調理し、終われば帰ります。客がいなければ費用ゼロです。'],
'aws|Amazon S3':['Một kho chứa đồ gần như vô hạn, mỗi món đồ có một địa chỉ web riêng: bỏ vào bao nhiêu cũng được, lấy ra bằng link, kho tự giữ nhiều bản sao nên rất khó mất đồ.','ほぼ無限の倉庫。各アイテムに専用URLがあり、リンクで取り出せます。複数コピーを自動保持するので紛失しにくい設計です。'],
'aws|Amazon VPC':['Một khu đất có hàng rào riêng trong “thành phố” (Region) của AWS: bạn tự chia lô (subnet), mở cổng (gateway) và đặt lớp bảo vệ (security group) theo ý mình.','AWSの「都市」（リージョン）の中の、柵で囲まれた自分の土地：区画（サブネット）、出入口（ゲートウェイ）、警備（セキュリティグループ）を自分で決めます。'],
'aws|AWS IAM':['Phòng nhân sự kiêm bảo vệ của tòa nhà cloud: cấp “thẻ ra vào” (role/policy) ghi rõ từng người được vào phòng nào, được bấm nút gì.','クラウドビルの人事兼警備室：誰がどの部屋に入り、何を操作できるかを書いた「入館カード」（ロール/ポリシー）を発行します。'],
'aws|Amazon RDS':['Thuê quản gia trông kho dữ liệu: sao lưu, vá lỗi, dựng bản dự phòng là việc của quản gia — bạn chỉ lo đọc/ghi dữ liệu.','データ倉庫の管理人を雇うイメージ：バックアップ、パッチ、予備機の用意は管理人任せ。あなたは読み書きに集中できます。'],
'aws|Amazon DynamoDB':['Cuốn sổ tra cứu thần tốc theo mã số: đưa mã (key) là lấy đúng món trong vài mili-giây, sổ tự phình ra hàng triệu trang mà tra vẫn nhanh.','番号で引く超高速の台帳：キーを見せれば数ミリ秒で該当データが出てきます。何百万ページに増えても速さは落ちません。'],
'aws|Amazon CloudFront':['Chuỗi quầy giao hàng đặt ngay khu dân cư (điểm edge): hàng để sẵn gần khách nên giao rất nhanh; quầy hết hàng mới chạy về kho gốc (origin) lấy.','住宅地のそばに置かれた配送カウンター（エッジ）：在庫が近くて速い。切れた時だけ本倉庫（オリジン）へ取りに行きます。'],
'aws|Elastic Load Balancing (ALB)':['Nhân viên điều phối ở cửa nhà hàng: khách đến được chia đều vào các bàn (server) còn trống, bàn nào “ốm” (unhealthy) thì không dẫn khách vào nữa.','レストランの入口の案内係：来客を空いているテーブル（サーバー）へ均等に案内し、不調なテーブルには案内しません。'],
'aws|Amazon ECS':['Quản đốc điều phối container lên tàu (server): bạn khai báo cần mấy container, chạy ở đâu — quản đốc tự xếp và luôn giữ đúng số lượng đó.','船（サーバー）へのコンテナ積み込みを仕切る現場監督：必要な数と置き場所を宣言すれば、監督が積んで数を維持します。'],
'aws|Amazon EKS':['Cũng là quản đốc container nhưng theo chuẩn Kubernetes quốc tế: mang “sơ đồ xếp hàng” (manifest/Helm) từ hãng tàu khác sang vẫn dùng được.','国際標準 Kubernetes 式の現場監督：他社の「積み付け図」（マニフェスト/Helm）を持ち込んでもそのまま使えます。'],
'aws|AWS Fargate':['Gửi container đi mà không cần thuê tàu: chỉ khai báo kích thước container, AWS tự lo phần tàu (server) bên dưới.','船を借りずにコンテナだけ送る方式：コンテナのサイズを宣言すれば、船（サーバー）側は AWS が用意します。'],
'aws|Amazon SQS':['Hàng đợi lấy số thứ tự ở quán trà sữa: 1.000 khách gọi món cùng lúc thì xếp hàng theo số, quầy pha chế (server) cứ thong thả làm từng ly mà không sập.','タピオカ店の番号札の列：1,000人が同時に注文しても番号順に並び、カウンター（サーバー）は落ち着いて1杯ずつ作れます。'],
'aws|Amazon SNS':['Hệ thống loa phát thanh của tòa nhà: một thông báo phát một lần, mọi phòng đã đăng ký nghe (email, SMS, Lambda, SQS…) đều nhận ngay.','ビルの放送設備：1回アナウンスすれば、登録した全ての部屋（メール、SMS、Lambda、SQS等）が即座に受け取ります。'],
'aws|Amazon Route 53':['Tổng đài danh bạ thông minh: khách hỏi “quán ở đâu” thì chỉ chi nhánh gần nhất và đang khỏe nhất; chi nhánh sập thì tự chỉ sang nơi khác.','賢い電話帳案内：最寄りで正常な支店を案内し、支店が落ちていれば自動で別支店へ誘導します。'],
'aws|Amazon CloudWatch':['Hệ thống camera + đồng hồ đo + chuông báo của tòa nhà: ghi lại mọi chỉ số và nhật ký, thấy bất thường là hú chuông (alarm) gọi người trực.','ビルのカメラ＋計測器＋警報ベル：全ての指標とログを記録し、異常があればベル（アラーム）で当番を呼びます。'],
'aws|AWS Transit Gateway':['Sân bay trung chuyển (hub): thay vì mỗi thành phố (VPC) phải mở đường bay thẳng tới mọi thành phố khác, tất cả nối qua một sân bay trung tâm.','ハブ空港：各都市（VPC）が互いに直行便を持つ代わりに、中央の空港を経由して全てがつながります。'],
'aws|Amazon EventBridge':['Trạm trung chuyển sự kiện: mọi “chuyện vừa xảy ra” (đơn hàng mới, file mới…) được trạm phân loại và chuyển đúng tới nơi đã đăng ký nhận.','イベントの仕分けターミナル：発生した出来事（新規注文、新規ファイル等）を分類し、登録済みの宛先へ正確に配送します。'],
'aws|Amazon Aurora':['Kho dữ liệu tự nhân bản trong cùng khu vực: bản chính và nhiều bản sao đọc luôn đồng bộ, bản chính hỏng thì bản sao lên thay gần như ngay lập tức.','同一エリア内で自動複製されるデータ倉庫：本体と読み取りコピーが常時同期し、本体障害時はコピーがほぼ即座に昇格します。'],
'aws|Amazon API Gateway':['Quầy lễ tân kiêm soát vé trước cửa nhà hàng: kiểm tra vé (API key/token), đếm khách, chặn quá tải — xong mới cho khách vào gặp bếp (backend).','入口の受付兼チケット確認：券（APIキー/トークン）確認、人数制限、過負荷防止をしてから厨房（バックエンド）へ通します。'],
'gcp|Compute Engine':['Thuê một phòng máy riêng trong trung tâm dữ liệu của Google: chọn cấu hình, cài gì tùy ý, trả theo thời gian dùng — và được giảm giá tự động khi chạy lâu (Sustained Use).','Googleのデータセンターに専用マシン室を借りるイメージ：構成自由、課金は利用時間分。長く使うと自動割引（継続利用割引）が効きます。'],
'gcp|Cloud Storage':['Kho chứa đồ gần như vô hạn kiểu Google: mỗi món đồ có địa chỉ riêng, lấy ra bằng link, kho tự giữ nhiều bản sao chống mất mát.','Google式のほぼ無限の倉庫：各アイテムに専用アドレスがあり、リンクで取得。複数コピーで紛失に強い設計です。'],
'gcp|Cloud VPC (Google Cloud)':['Một mạng nội bộ xuyên quốc gia dùng chung cho mọi chi nhánh: dựng một lần, chi nhánh ở Tokyo hay Mỹ đều là “phòng ban” trong cùng một mạng — phòng ban (subnet) mới phân theo region.','全支店共通の国際的な社内ネットワーク：1回作れば東京も米国も同じネットワーク内の「部署」。部署（サブネット）だけがリージョン単位です。'],
'gcp|Google Cloud IAM':['Sổ phân quyền theo sơ đồ tổ chức: quyền cấp ở cấp công ty/thư mục sẽ “chảy xuống” các dự án con — cấp trên cho gì, cấp dưới được hưởng nấy.','組織図に沿った権限台帳：会社/フォルダ階層で与えた権限は配下のプロジェクトへ継承されます。'],
'gcp|Cloud Run':['Thuê mặt bằng pop-up: có khách (request) thì quán tự mở và nới rộng, hết khách thì đóng hẳn về 0 — không phải thuê mặt bằng cả tháng (server).','ポップアップ店舗：客（リクエスト）が来れば自動で開店・拡張し、いなければ完全に閉じてゼロになります。常設（サーバー）の家賃は不要です。'],
'gcp|Cloud SQL':['Quản gia trông kho dữ liệu quan hệ phía Google: sao lưu, dự phòng theo region, vá lỗi — Google lo, bạn chỉ đọc/ghi.','Google側のデータ倉庫の管理人：バックアップ、リージョン冗長、パッチは Google 任せ。あなたは読み書きに集中できます。'],
'gcp|BigQuery':['Thuê siêu máy tính phân tích theo từng câu hỏi: bạn chỉ nộp câu SQL và dữ liệu, Google huy động cả đội quân máy quét hàng TB rồi trả kết quả — không cần dựng kho máy riêng.','質問ごとに借りる分析スーパーコンピュータ：SQLとデータを渡せば Google が大量のマシンでTB級データを走査して結果を返します。自前の設備は不要です。'],
'gcp|Pub/Sub':['Quầy “lấy số + phát thanh” gộp làm một: người gửi cứ gửi, người nhận lấy theo nhịp của mình — giờ cao điểm hệ thống không sập, một tin có thể tới nhiều nơi nhận cùng lúc.','番号札と放送を兼ねた窓口：送信側は送るだけ、受信側は自分のペースで受け取ります。ピークでも落ちず、1件を複数宛先へ届けられます。'],
'gcp|Google Kubernetes Engine (GKE)':['Quản đốc container ở “quê hương của Kubernetes”: Google là nơi sinh ra chuẩn này, và chế độ Autopilot lo gần như toàn bộ phần tàu bè (node).','Kubernetes の生まれ故郷の現場監督：Google 発祥の標準で、Autopilot なら船（ノード）側もほぼ全て任せられます。'],
'gcp|Cloud Load Balancing':['Một số điện thoại tổng đài duy nhất cho cả nước: khách ở đâu gọi vào cũng tự nối tới chi nhánh gần nhất đang khỏe (một IP anycast toàn cầu).','全国共通の代表電話番号：どこからかけても最寄りの正常な支店へ自動接続します（グローバル anycast IP 1つ）。'],
'gcp|Cloud DNS':['Danh bạ địa chỉ chạy trên mạng anycast của Google: tra cứu nhanh ở mọi nơi, sửa một record là cập nhật trên toàn cầu.','Googleの anycast 網で動く住所録：世界中どこでも高速に引け、レコード修正は全世界へ反映されます。'],
'gcp|Cloud Monitoring':['Phòng điều hành trung tâm: gom chỉ số, nhật ký và cảnh báo của mọi dịch vụ về một màn hình để trực vận hành.','中央管制室：全サービスの指標・ログ・アラートを1つの画面に集約して監視します。'],
'gcp|Cloud NAT':['Lễ tân chung của cả tòa nhà theo từng khu vực (region): người trong nhà liên hệ ra ngoài qua lễ tân nên không cần số máy riêng (IP public), khách ngoài không tự gọi vào được.','リージョン単位のビル共通受付：内側からは受付経由で外へ出るため個別の外線番号（公開IP）は不要で、外からは勝手に入れません。']
};
function findItem(cloud,name){
  var cat=cloud==='aws'?AWS_CAT:GCP_CAT, found=null, group='';
  cat.forEach(function(gr){ gr.items.forEach(function(it){ if(it[0]===name){ found=it; group=gr.g; } }); });
  return {item:found, group:group};
}
function tldrHTML(cloud,name){
  var ja=window.LANG==='ja';
  var core=(typeof COREMAP!=='undefined')?COREMAP[cloud+'|'+name]:null;
  var f=findItem(cloud,name);
  var ana=ANALOG[cloud+'|'+name];
  var what=ana?(ja?ana[1]:ana[0]):(core?core.d:(f.item?f.item[2]:''));
  var use=core?core.u.slice(0,2):[ ja?'このサービスの本来の守備範囲に合う課題のときに使います（詳細は下の第3節で確認）。':'Khi bài toán của bạn đúng chức năng này trong nhóm '+(f.group||'')+' — đối chiếu chi tiết ở mục 3 ngay dưới.'];
  var not=core?core.lim:(ja?'守備範囲外の課題、または小さすぎるワークロードでマネージドサービスの運用コストが見合わない場合。このページ末尾の比較・関連サービスを確認してください。':'Bài toán nằm ngoài chuyên môn của service này, hoặc workload quá nhỏ khiến chi phí vận hành managed service không tương xứng — xem mục So sánh và Service liên quan ở cuối trang.');
  return '<h3>💡 '+(ja?'かみ砕いて言うと（TL;DR）':'Nói dễ hiểu — TL;DR cho người mới')+'</h3>'
    +'<p class="tldr-what"><b>'+(ja?'日常のことばで言うと：':'Nó là gì (đời thường): ')+'</b>'+E(what)+'</p>'
    +'<ul><li><b>'+(ja?'使う場面：':'Dùng khi: ')+'</b>'+use.map(function(x){ return E(x); }).join(' · ')+'</li>'
    +'<li><b>'+(ja?'使わない場面：':'Không dùng khi: ')+'</b>'+E(not)+'</li></ul>';
}
var tldrState={cloud:null,name:null};
function injectTldr(){
  var host=$('svcDetailBody'); if(!host||!host.innerHTML) return;
  var m=(location.hash||'').match(/^#\/service\/(aws|gcp)\/(.+)$/); if(!m) return;
  var cloud=m[1], name=decodeURIComponent(m[2]);
  var old=host.querySelector('[data-tldr]');
  if(old){
    if(tldrState.cloud===cloud&&tldrState.name===name&&old.getAttribute('data-lang')===window.LANG) return;
    old.innerHTML=tldrHTML(cloud,name); old.setAttribute('data-lang',window.LANG); tldrState={cloud:cloud,name:name}; return;
  }
  var div=document.createElement('div');
  div.className='dsec tldr'; div.setAttribute('data-tldr','1'); div.setAttribute('data-lang',window.LANG);
  div.innerHTML=tldrHTML(cloud,name);
  tldrState={cloud:cloud,name:name};
  var nav=host.querySelector('[data-svcnav]'), act=host.querySelector('.d-actions');
  if(nav&&nav.nextSibling) host.insertBefore(div,nav.nextSibling);
  else if(nav) host.appendChild(div);
  else if(act&&act.nextSibling) host.insertBefore(div,act.nextSibling);
  else if(act) host.appendChild(div);
  else host.insertBefore(div,host.firstChild);
}
try{
  var svcBodyEl=$('svcDetailBody');
  if(svcBodyEl) new MutationObserver(function(){ injectTldr(); }).observe(svcBodyEl,{childList:true});
  window.addEventListener('hashchange',function(){ setTimeout(injectTldr,30); });
  setTimeout(injectTldr,60);
}catch(e){}

/* ---- Khung ẩn dụ ở trang Networking ---- */
var NET_ANA=[
 {ic:'🏦', t:'VPC của AWS — “mỗi chi nhánh ngân hàng ở một thành phố có mạng nội bộ riêng”', tj:'AWS の VPC —「都市ごとに社内ネットワークを持つ銀行支店」',
  d:'Một VPC chỉ sống trong 1 Region. Sang Region khác là phải dựng “chi nhánh” (VPC) mới rồi nối hai mạng lại bằng peering/Transit Gateway.', dj:'1つの VPC は1リージョンの中だけにあります。他リージョンは新しい「支店」（VPC）を作り、ピアリング/Transit Gateway でつなぎます。',
  k:'Kỹ thuật: VPC = tài nguyên Regional, subnet gắn theo AZ.', kj:'技術点：VPC はリージョン単位、サブネットは AZ 単位。'},
 {ic:'🌏', t:'VPC của GCP — “một mạng nội bộ xuyên quốc gia dùng chung cho mọi chi nhánh”', tj:'GCP の VPC —「全支店共通の国際社内ネットワーク」',
  d:'Một VPC phủ mọi Region trên toàn cầu. “Phòng ban” (subnet) mới là thứ nằm ở từng Region — thêm chi nhánh mới chỉ là thêm subnet.', dj:'1つの VPC が全リージョンを覆います。「部署」（サブネット）だけが各リージョンに置かれ、支店追加はサブネット追加で済みます。',
  k:'Kỹ thuật: VPC = tài nguyên Global, subnet mang tính Regional.', kj:'技術点：VPC はグローバル、サブネットはリージョン単位。'},
 {ic:'🚪', t:'NAT Gateway — “lễ tân khách sạn”', tj:'NAT Gateway —「ホテルの受付」',
  d:'Người trong nhà (private subnet) muốn liên hệ ra ngoài thì đi qua lễ tân: lễ tân ghi tên mình (IP public) khi gọi ra. Khách lạ ngoài đường không thể tự đi lên phòng.', dj:'宿泊客（プライベートサブネット）が外へ連絡する時は受付を通ります。受付が自分の名前（公開IP）で取り次ぐため、外の他人が勝手に部屋へは行けません。',
  k:'Kỹ thuật: NAT chỉ phục vụ chiều ra (outbound), không nhận kết nối khởi tạo từ internet; đặt 1 NAT/AZ (AWS) hoặc Cloud NAT theo region (GCP).', kj:'技術点：NAT は外向き専用で、インターネットからの新規接続は受けません。AWS は AZ ごと、GCP はリージョン単位（Cloud NAT）。'},
 {ic:'🛫', t:'Transit Gateway — “sân bay trung chuyển (hub)”', tj:'Transit Gateway —「ハブ空港」',
  d:'Thay vì mỗi thành phố (VPC) mở đường bay thẳng tới mọi thành phố khác, tất cả bay qua một sân bay trung tâm: thêm thành phố mới chỉ cần một đường nối về hub.', dj:'各都市（VPC）が互いに直行便を持つ代わりに、中央の空港経由でつなぎます。都市の追加はハブへの1路線で済みます。',
  k:'Kỹ thuật: mô hình hub-and-spoke; đối tác phía GCP là Network Connectivity Center. VPC Peering thì 1–1 và không transitive.', kj:'技術点：ハブ＆スポーク型。GCP 側の対応は Network Connectivity Center。VPC ピアリングは 1対1 で推移的ではありません。'},
 {ic:'🔌', t:'PrivateLink / Private Service Connect — “đường dây nội bộ giữa hai tòa nhà”', tj:'PrivateLink / Private Service Connect —「建物同士の内線」',
  d:'Muốn dùng dịch vụ của tòa nhà bên (VPC khác hoặc API của cloud) thì kéo một đường dây nội bộ vào ngay trong nhà mình (endpoint) — nói chuyện qua dây riêng, không bước ra đường công cộng (internet).', dj:'隣のビル（別VPCやクラウドAPI）のサービスを使いたい時、自ビル内に内線（エンドポイント）を引いて話します。公道（インターネット）には出ません。',
  k:'Kỹ thuật: endpoint nằm trong VPC của bạn, traffic đi trên mạng backbone của cloud; AWS là PrivateLink, GCP là Private Service Connect.', kj:'技術点：エンドポイントは自分の VPC 内に置かれ、通信はクラウドのバックボーンを通ります。AWS は PrivateLink、GCP は Private Service Connect。'}
];
function renderNetAnalogy(){
  var sec=$('networking'); if(!sec) return;
  var ja=window.LANG==='ja';
  var host=$('netAnalogy');
  if(!host){
    host=document.createElement('div');
    host.className='diagram-card'; host.id='netAnalogy';
    var target=null;
    sec.querySelectorAll('h3').forEach(function(h){ if(h.textContent.indexOf('Networking trên Google Cloud')>-1) target=h; });
    if(target) target.parentNode.insertBefore(host,target);
    else sec.querySelector('.wrap').appendChild(host);
  }
  host.innerHTML='<h3>🗣️ '+(ja?'覚えやすい比喩 — まずイメージ、次に技術':'Ẩn dụ dễ nhớ — hình dung trước, kỹ thuật sau')+'</h3>'
    +'<p>'+(ja?'難しい概念は日常の比喩で掴み、その下の「技術点」で正確な定義に戻します。特に VPC の AWS ⇄ GCP の違いは全ての起点です。':'Các khái niệm khó được “dịch” sang hình ảnh đời thường trước, rồi chốt lại bằng điểm kỹ thuật chính xác ngay bên dưới. Đặc biệt hãy thuộc khác biệt VPC giữa hai hãng — nó là gốc của mọi khác biệt networking còn lại.')+'</p>'
    +'<div class="ana-grid">'+NET_ANA.map(function(x){
      return '<div class="ana-item"><span class="ana-ic">'+x.ic+'</span><b>'+E(ja?x.tj:x.t)+'</b><p>'+E(ja?x.dj:x.d)+'</p><p class="ana-k">'+E(ja?x.kj:x.k)+'</p></div>';
    }).join('')+'</div>';
}
try{ renderNetAnalogy(); }catch(e){}

/* ================= 5 · MINI-QUIZ (ACTIVE RECALL) ================= */
var QUIZ_NET=[
 {q:'Một EC2 nằm ở private subnet cần tải bản vá từ internet, nhưng tuyệt đối không cho internet khởi tạo kết nối vào máy. Thiết kế đúng là gì?',
  qj:'プライベートサブネットの EC2 がインターネットからパッチを取得する必要があるが、インターネットからの新規接続は絶対に許可しない。正しい設計は？',
  o:[['Gắn Elastic IP cho EC2 và mở route qua Internet Gateway','EC2 に Elastic IP を付け、Internet Gateway 経由のルートを開く'],
     ['Đặt NAT Gateway ở public subnet, route table của private subnet trỏ 0.0.0.0/0 → NAT','パブリックサブネットに NAT Gateway を置き、プライベート側のルートテーブルで 0.0.0.0/0 → NAT とする'],
     ['Dựng VPC Peering tới một VPC có internet','インターネットのある VPC へ VPC ピアリングする'],
     ['Tạo Gateway Endpoint cho S3','S3 用のゲートウェイ エンドポイントを作る']],
  c:1,
  e:'NAT Gateway phục vụ đúng mẫu này: chiều ra (outbound) từ private subnet qua NAT ở public subnet, còn internet không khởi tạo được kết nối vào. Gắn Elastic IP + IGW sẽ biến máy thành public — sai yêu cầu.',
  ej:'NAT Gateway がこの要件そのものです：外向きは NAT 経由で出られ、インターネットからの新規接続は入ってきません。Elastic IP + IGW はマシンを公開してしまうため誤りです。'},
 {q:'Ứng dụng trong private subnet gọi Amazon S3 với lưu lượng rất lớn. Cách nào giúp traffic không đi qua NAT Gateway (giảm phí) và không ra internet công cộng?',
  qj:'プライベートサブネットのアプリが Amazon S3 を大量に呼ぶ。NAT Gateway 経由（課金）を避け、公共インターネットにも出さない方法は？',
  o:[['Interface Endpoint cho mọi service','全サービスにインターフェース エンドポイント'],
     ['Gateway Endpoint cho S3 — miễn phí, cấu hình bằng route table','S3 用ゲートウェイ エンドポイント（無料、ルートテーブルで設定）'],
     ['Dựng Direct Connect về on-prem rồi đi vòng','Direct Connect でオンプレミス経由にする'],
     ['Chuyển ứng dụng sang public subnet','アプリをパブリックサブネットへ移す']],
  c:1,
  e:'Theo đúng nội dung đã học: Gateway Endpoint dành cho S3 và DynamoDB, miễn phí và gắn qua route table. Interface Endpoint (PrivateLink) dành cho hầu hết service còn lại và có tính phí theo giờ/GB.',
  ej:'学習内容の通り、ゲートウェイ エンドポイントは S3 と DynamoDB 用で無料、ルートテーブルで設定します。インターフェース エンドポイント（PrivateLink）は他の多くのサービス用で時間/GB課金です。'},
 {q:'Công ty có 15 VPC và cả on-prem cùng cần kết nối, đồng thời phải tách route prod riêng dev. Nên chọn kiến trúc nào?',
  qj:'VPC が15個あり、オンプレミスとも接続が必要で、本番と開発のルート分離もしたい。選ぶべき構成は？',
  o:[['VPC Peering nối full-mesh từng cặp một','VPC ピアリングで全ペアをメッシュ接続'],
     ['Transit Gateway làm hub trung tâm, nhiều route table để phân đoạn','Transit Gateway を中央ハブにし、複数ルートテーブルで分離'],
     ['Mỗi VPC dựng một NAT Gateway riêng là đủ','各 VPC に NAT Gateway を置けばよい'],
     ['Gộp hết 15 VPC thành 1 VPC duy nhất','15個の VPC を1個に統合する']],
  c:1,
  e:'Quy tắc bậc thầy trong bài: ≤3 VPC thì peering; nhiều VPC/account hoặc có on-prem chung thì Transit Gateway ngay từ đầu. Peering không transitive nên full-mesh 15 VPC là “nợ kỹ thuật” và không phân đoạn được.',
  ej:'本文の原則通り、VPC が3個以下ならピアリング、多数の VPC/アカウントやオンプレミス共有があるなら最初から Transit Gateway です。ピアリングは推移的でなく、15個のメッシュは技術的負債になります。'},
 {q:'Bạn đã mở NACL inbound cho cổng 443 nhưng quên mất dải ephemeral port (1024–65535). Hiện tượng đúng nhất là gì?',
  qj:'NACL のインバウンドで 443 を開けたが、エフェメラルポート（1024–65535）を忘れた。最も正しい現象は？',
  o:[['Không sao — Security Group sẽ tự bù phần còn thiếu','問題ない — セキュリティグループが補ってくれる'],
     ['Traffic trả về bị chặn, kết nối hỏng — vì NACL là stateless, phải mở cả hai chiều','戻りの通信が遮断され接続が成立しない — NACL はステートレスで双方向の許可が必要'],
     ['Chỉ làm kết nối chậm hơn một chút','少し遅くなるだけ'],
     ['NACL tự học và mở ephemeral port sau vài phút','NACL が数分後に自動でエフェメラルポートを開ける']],
  c:1,
  e:'NACL là stateless: chiều đi và chiều về là hai rule độc lập. Quên ephemeral port ở chiều trả về là lỗi kinh điển khiến “đã mở cổng mà vẫn không thông”. Security Group thì stateful nên không gặp lỗi này.',
  ej:'NACL はステートレスで、行きと戻りは独立したルールです。戻りのエフェメラルポート忘れは「開けたのに通らない」典型例です。セキュリティグループはステートフルなのでこの問題は起きません。'},
 {q:'Hệ thống hybrid đã có Direct Connect (DX) làm đường chính. Cần failover tự động khi đường DX đứt — mẫu chuẩn doanh nghiệp là gì?',
  qj:'ハイブリッド構成で Direct Connect（DX）が主回線。DX 断線時に自動フェイルオーバーさせる企業標準のパターンは？',
  o:[['Thêm một NAT Gateway dự phòng','予備の NAT Gateway を追加'],
     ['VPN làm đường dự phòng, cả DX và VPN cùng chạy BGP qua DX Gateway/Transit Gateway','VPN を予備回線にし、DX と VPN の両方で BGP を回し DX Gateway/Transit Gateway 経由にする'],
     ['Dùng Route 53 đổi DNS sang region khác','Route 53 で別リージョンへ DNS 切替'],
     ['Tăng băng thông DX lên gấp đôi','DX の帯域を2倍にする']],
  c:1,
  e:'Đúng mẫu đã dạy: DX chính + VPN backup, cả hai chạy BGP, failover tự động theo AS-PATH/preference. Tăng băng thông không giúp khi đường truyền đứt hẳn.',
  ej:'本文のパターン通り：DX を主、VPN を予備にし、両方で BGP を回すことで AS-PATH/優先度により自動フェイルオーバーします。帯域増強は回線断には効きません。'},
 {q:'Workload cần load balancer ở lớp 4 với IP tĩnh, độ trễ cực thấp và TLS passthrough (không giải mã tại LB). Chọn loại nào phía AWS?',
  qj:'レイヤー4で静的IP、超低遅延、TLS パススルー（LB で復号しない）が必要な場合、AWS で選ぶのは？',
  o:[['ALB (Application Load Balancer) — lớp 7','ALB（アプリケーションレイヤー7）'],
     ['NLB (Network Load Balancer) — lớp 4','NLB（ネットワーク、レイヤー4）'],
     ['CloudFront','CloudFront'],
     ['Gateway Endpoint','ゲートウェイ エンドポイント']],
  c:1,
  e:'NLB là load balancer lớp 4: IP tĩnh, latency cực thấp, TLS passthrough. ALB là lớp 7 — route theo host/path/header và thường terminate TLS tại LB.',
  ej:'NLB はレイヤー4：静的IP、超低遅延、TLS パススルー対応です。ALB はレイヤー7 でホスト/パス振り分けと TLS 終端が中心です。'}
];
var QUIZ_MIG=[
 {q:'Ban giám đốc muốn thoát data center càng nhanh càng tốt, ứng dụng giữ nguyên gần như không sửa. Chiến lược 7R và công cụ AWS phù hợp nhất?',
  qj:'経営層はデータセンターから最速で退出したい。アプリはほぼ無改修で移す。最適な 7R 戦略と AWS ツールは？',
  o:[['Refactor — viết lại cloud-native','Refactor — クラウドネイティブに書き直す'],
     ['Rehost (lift & shift) — bằng AWS Application Migration Service (MGN)','Rehost（リフト＆シフト）— AWS Application Migration Service（MGN）'],
     ['Repurchase — mua SaaS thay thế','Repurchase — SaaS に買い替える'],
     ['Retain — giữ lại on-prem','Retain — オンプレミスに残す']],
  c:1,
  e:'Rehost là “lift & shift nguyên trạng” — nhanh nhất, ít thay đổi nhất, công cụ chuẩn là MGN (replicate liên tục rồi cutover). Refactor cho giá trị dài hạn cao nhất nhưng tốn kém và chậm nhất, ngược yêu cầu.',
  ej:'Rehost は「現状のまま移す」戦略で最速・最小変更、標準ツールは MGN（継続レプリケーション後に切り替え）です。Refactor は長期的価値は高い反面、最も時間とコストがかかります。',
  x:[['Sai — viết lại cloud-native tốn nhiều tháng và thay đổi gần như toàn bộ ứng dụng, ngược hẳn yêu cầu “thoát càng nhanh càng tốt, gần như không sửa”.','誤り — クラウドネイティブへの書き直しは数か月単位でアプリ全体が変わり、「最速・ほぼ無改修」の要件と正反対です。'],
     ['Đúng — Rehost giữ nguyên trạng ứng dụng; MGN replicate liên tục rồi cutover nên nhanh nhất và ít thay đổi nhất.','正解 — Rehost はアプリを現状のまま移し、MGN の継続レプリケーションと切り替えで最速・最小変更です。'],
     ['Sai — Repurchase nghĩa là bỏ ứng dụng hiện tại để mua SaaS thay thế, thay cả quy trình nghiệp vụ, không còn là “giữ nguyên ứng dụng”.','誤り — Repurchase は現行アプリを捨てて SaaS に替えるため業務プロセスまで変わり、「そのまま移す」にはなりません。'],
     ['Sai — Retain là giữ lại on-prem, tức không thoát được data center, trái thẳng mục tiêu chính của ban giám đốc.','誤り — Retain はオンプレミスに残すことであり、データセンター退出という経営層の目的に反します。']]},
 {q:'Khảo sát danh mục (Assess) cho thấy khoảng 15% hệ thống không còn ai dùng hoặc trùng lặp chức năng. Xử lý đúng theo 7R?',
  qj:'棚卸し（Assess）の結果、約15%のシステムが未使用または機能重複だった。7R での正しい扱いは？',
  o:[['Cứ Rehost toàn bộ lên cloud cho đồng bộ','全部まとめて Rehost する'],
     ['Retire — tắt hẳn các hệ thống đó','Retire — そのシステムを廃止する'],
     ['Retain — giữ lại vô thời hạn','Retain — 無期限に残す'],
     ['Repurchase — mua bản mới thay thế','Repurchase — 新製品に買い替える']],
  c:1,
  e:'Đó chính là Retire: tắt hẳn hệ thống trùng lặp/không còn dùng — theo tài liệu AWS, nhóm này thường chiếm 10–20% danh mục và loại bỏ chúng giúp tiết kiệm ngay trước khi di chuyển.',
  ej:'それが Retire です：重複・未使用システムを廃止します。AWS の資料でもこの層は全体の10〜20%程度を占め、移行前に除くことで即座に節約できます。',
  x:[['Sai — Rehost cả hệ thống đã chết lên cloud chỉ biến chi phí on-prem thành chi phí cloud, không giải quyết được phần lãng phí.','誤り — 死んだシステムまで Rehost するとオンプレのコストがクラウドのコストに化けるだけで、無駄は消えません。'],
     ['Đúng — hệ thống không còn dùng hoặc trùng lặp thì xử lý đúng theo 7R là Retire: tắt hẳn, thường chiếm 10–20% danh mục.','正解 — 未使用・重複システムの 7R は Retire（廃止）。全体の10〜20%を占めるのが通例です。'],
     ['Sai — Retain chỉ dành cho hệ thống còn lý do giữ tạm (mới nâng cấp, ràng buộc pháp lý); giữ vô thời hạn hệ không ai dùng không phải Retain mà là bỏ mặc.','誤り — Retain は「直近の更改済み」「法的制約」など一時的に残す理由がある場合用で、誰も使わないシステムの無期限放置ではありません。'],
     ['Sai — Repurchase là mua giải pháp thay thế cho nhu cầu còn tồn tại; ở đây nhu cầu đã không còn nên không có gì để “mua thay”.','誤り — Repurchase は需要が残っている場合の置き換え策。需要自体が消えたシステムに買うものはありません。']]},
 {q:'Chuyển Oracle on-prem sang Amazon Aurora PostgreSQL (đổi cả engine). Cặp công cụ và chiến lược đúng?',
  qj:'オンプレミスの Oracle を Amazon Aurora PostgreSQL へ（エンジンも変更）。正しいツールの組み合わせと戦略は？',
  o:[['MGN chuyển server là đủ','MGN でサーバーを移せば十分'],
     ['SCT đổi schema + DMS full load & CDC — chiến lược Replatform','SCT でスキーマ変換 + DMS でフルロード＆CDC — 戦略は Replatform'],
     ['DataSync đồng bộ file','DataSync でファイル同期'],
     ['Storage Transfer Service','Storage Transfer Service']],
  c:1,
  e:'Đổi engine là bài toán hai lớp: SCT chuyển đổi schema/đối tượng (tự động ~70–90%, PL/SQL phải sửa tay), DMS làm full load + CDC để downtime gần 0. Đây là mẫu Replatform kinh điển — động lực lớn nhất là thoát license Oracle.',
  ej:'エンジン変更は2層の課題です：SCT でスキーマ変換（自動70〜90%、PL/SQL は手修正）、DMS でフルロード＋CDC によりダウンタイム最小化。これは Replatform の典型で、最大の動機は Oracle ライセンスからの脱却です。',
  x:[['Sai — MGN chuyển server ở tầng hệ điều hành/khối dữ liệu (block), không chuyển đổi được engine database từ Oracle sang PostgreSQL.','誤り — MGN は OS/ブロック層のサーバー移行であり、Oracle から PostgreSQL へのエンジン変換はできません。'],
     ['Đúng — đổi engine là bài toán hai lớp: SCT chuyển schema/đối tượng, DMS full load + CDC đồng bộ liên tục. Đây là mẫu Replatform kinh điển.','正解 — エンジン変更は2層の課題：SCT でスキーマ変換、DMS でフルロード＋CDC。これは Replatform の典型です。'],
     ['Sai — DataSync đồng bộ file/object giữa các hệ lưu trữ, không chuyển schema và không replicate giao dịch của database.','誤り — DataSync はストレージ間のファイル同期専用で、スキーマ変換も DB トランザクション複製も行いません。'],
     ['Sai — Storage Transfer Service là dịch vụ của Google Cloud (chuyển dữ liệu vào GCP), không phải công cụ cho bài toán chuyển sang Aurora.','誤り — Storage Transfer Service は Google Cloud 側の転送サービスで、Aurora への移行ツールではありません。']]},
 {q:'Thứ tự đúng của quy trình migration chuẩn 3 giai đoạn là?',
  qj:'標準的な移行プロセス3フェーズの正しい順序は？',
  o:[['Migrate → Assess → Mobilize','Migrate → Assess → Mobilize'],
     ['Assess → Mobilize → Migrate & Modernize','Assess → Mobilize → Migrate & Modernize'],
     ['Mobilize → Migrate → Assess','Mobilize → Migrate → Assess'],
     ['Assess → Migrate → Mobilize','Assess → Migrate → Mobilize']],
  c:1,
  e:'Assess (đánh giá danh mục & phụ thuộc, phân loại 7R) → Mobilize (dựng Landing Zone: tài khoản, mạng, bảo mật, logging) → Migrate & Modernize (chuyển theo wave). Bỏ qua hai giai đoạn đầu rồi nhảy vào chuyển server là nguyên nhân thất bại phổ biến nhất.',
  ej:'Assess（棚卸しと依存関係、7R 分類）→ Mobilize（ランディングゾーン構築：アカウント、ネットワーク、セキュリティ、ログ）→ Migrate & Modernize（ウェーブ移行）の順です。最初の2段階を飛ばすのが失敗の最大要因です。',
  x:[['Sai — chuyển server trước khi đánh giá là mù bản đồ phụ thuộc, và chưa có Landing Zone thì không có nền tài khoản/mạng/bảo mật để hạ cánh.','誤り — 評価前に移すと依存関係が見えず、ランディングゾーンがなければ受け皿のアカウント/ネットワーク/セキュリティ基盤がありません。'],
     ['Đúng — Assess (đánh giá & phân loại 7R) → Mobilize (dựng Landing Zone) → Migrate & Modernize (chuyển theo wave) là thứ tự chuẩn.','正解 — Assess（棚卸しと 7R 分類）→ Mobilize（ランディングゾーン構築）→ Migrate & Modernize（ウェーブ移行）が標準順序です。'],
     ['Sai — dựng nền (Mobilize) trước khi biết danh mục và yêu cầu thật (Assess) dễ xây sai quy mô và phải làm lại.','誤り — Assess 前の Mobilize は棚卸しも要件も分からないまま基盤を作るため、規模を誤りやすく手戻りします。'],
     ['Sai — xen Migrate vào giữa khiến workload phải hạ cánh khi Landing Zone chưa hoàn thiện, rủi ro bảo mật và vận hành.','誤り — 途中に Migrate を挟むと、ランディングゾーン未完成のままワークロードを受け入れることになり、セキュリティと運用のリスクになります。']]},
 {q:'Khi cutover database bằng DMS, cách làm an toàn nhất để downtime ngắn nhất?',
  qj:'DMS でデータベースを切り替える際、ダウンタイムを最短にする最も安全な方法は？',
  o:[['Dừng hệ thống nguồn cả ngày rồi sao chép tay','ソースを丸1日止めて手作業コピー'],
     ['Full load trước, bật CDC đồng bộ liên tục, chờ replication lag về ~0 rồi đổi connection string trong cửa sổ ngắn','先にフルロードし、CDC で継続同期、レプリケーション遅延がほぼ0になってから短い窓で接続文字列を切り替える'],
     ['Xoá database đích rồi tạo lại từ đầu','移行先 DB を削除して作り直す'],
     ['Chỉ full load một lần, không cần CDC','フルロード1回のみで CDC は不要']],
  c:1,
  e:'Đúng quy trình trong lab migration DB: full load dữ liệu lịch sử → CDC bắt kịp thay đổi liên tục → kiểm chứng dữ liệu → cutover khi lag về 0 trong cửa sổ ghi dừng ngắn. Chỉ full load một lần sẽ mất mọi thay đổi phát sinh sau đó.',
  ej:'DB 移行ラボの手順通り：履歴データのフルロード → CDC で変更を継続同期 → データ検証 → 遅延ゼロの短い停止窓で切り替え。フルロードのみではその後の変更が失われます。',
  x:[['Sai — dừng nguồn cả ngày tạo downtime rất dài, và sao chép tay dễ sai lệch dữ liệu, khó kiểm chứng toàn vẹn.','誤り — ソースを丸1日止めるとダウンタイムが長く、手作業コピーは不整合が起きやすく完全性の検証も困難です。'],
     ['Đúng — full load dữ liệu lịch sử trước, CDC bắt kịp mọi thay đổi liên tục, chờ lag về ~0 rồi mới đổi connection string trong cửa sổ dừng ghi ngắn.','正解 — 先に履歴データをフルロードし、CDC で変更を継続同期、遅延がほぼ0になってから短い停止窓で接続文字列を切り替えます。'],
     ['Sai — xoá database đích rồi tạo lại phá vỡ chính dữ liệu đã đồng bộ được và không rút ngắn downtime chút nào.','誤り — 移行先 DB を削除して作り直すのは同期済みデータを壊すだけで、ダウンタイム短縮にはなりません。'],
     ['Sai — chỉ full load một lần sẽ bỏ mất mọi thay đổi phát sinh trên nguồn sau thời điểm chụp dữ liệu.','誤り — フルロード1回のみでは、データ取得後にソースで発生した変更がすべて失われます。']]},
 {q:'Chuyển hệ thống đang phục vụ người dùng thật từ AWS sang GCP. Cách chuyển traffic nào giảm rủi ro nhất?',
  qj:'実ユーザーが使っているシステムを AWS から GCP へ移行。トラフィック切替で最もリスクが低い方法は？',
  o:[['Đổi DNS trỏ 100% sang hệ mới ngay lập tức','DNS を即座に100%新システムへ向ける'],
     ['Hạ TTL xuống thấp trước 24–48 giờ, rồi chuyển dần theo trọng số 10% → 50% → 100%','24〜48時間前に TTL を下げ、10% → 50% → 100% と重み付きで段階的に移す'],
     ['Tắt hệ thống cũ trước rồi mới bật hệ mới','旧システムを先に止めてから新システムを起動'],
     ['Không cần kiểm chứng, chuyển xong tính sau','検証なしで移してから考える']],
  c:1,
  e:'Đúng mẫu cross-cloud trong bài: hạ TTL DNS trước 24–48 giờ và dùng weighted routing chuyển dần 10% → 50% → 100%, theo dõi song song rồi mới tắt phía cũ. Đổi 100% ngay khiến rollback gần như không thể.',
  ej:'本文のクロスクラウドパターン通り：24〜48時間前に TTL を下げ、重み付きルーティングで10%→50%→100%と段階移行し、並行監視してから旧側を停止します。即時100%切替はロールバックが困難です。',
  x:[['Sai — dồn 100% traffic sang hệ mới ngay lập tức khiến mọi lỗi của hệ mới đánh trúng toàn bộ người dùng, và rollback gần như không thể khi dữ liệu đã lệch.','誤り — 即座に100%を新システムへ向けると新側の不具合が全ユーザーに直撃し、データがずれた後のロールバックはほぼ不可能です。'],
     ['Đúng — hạ TTL trước 24–48 giờ rồi chuyển dần theo trọng số 10% → 50% → 100% giúp quan sát song song và quay lui dễ dàng ở mỗi bước.','正解 — 24〜48時間前に TTL を下げ、10% → 50% → 100% と段階的に移すことで並行監視と切り戻しが可能になります。'],
     ['Sai — tắt hệ thống cũ trước khi hệ mới nhận traffic tạo khoảng trống dịch vụ và tự cắt đường lui nếu hệ mới có vấn đề.','誤り — 新側が受ける前に旧側を止めるとサービス空白が生まれ、問題時の切り戻し先もなくなります。'],
     ['Sai — bỏ qua kiểm chứng dữ liệu và chức năng trước cutover là nguyên nhân hàng đầu của sự cố ngay sau khi chuyển đổi.','誤り — 切り替え前のデータ・機能検証を省くことは、移行直後トラブルの最大要因です。']]}
];
var quizState={net:{},mig:{}};
function quizHTML(kind){
  var ja=window.LANG==='ja';
  var data=kind==='net'?QUIZ_NET:QUIZ_MIG;
  var st=quizState[kind];
  var done=Object.keys(st).length;
  var score=data.reduce(function(a,qq,i){ return a+((st[i]===qq.c)?1:0); },0);
  var h='<div class="quiz-head"><span class="quiz-score">'+(ja?'スコア：':'Điểm: ')+score+'/'+data.length+(done?(' · '+(ja?'回答済み ':'Đã trả lời ')+done+'/'+data.length):'')+'</span>'
    +'<button type="button" class="dg-btn" data-quiz-reset="'+kind+'">'+(ja?'最初からやり直す':'Làm lại từ đầu')+'</button></div>';
  h+=data.map(function(qq,i){
    var picked=st[i];
    var s='<div class="quiz-q"><p class="quiz-qt"><b>'+(ja?'問':'Câu')+' '+(i+1)+'.</b> '+E(ja?qq.qj:qq.q)+'</p><div class="quiz-opts">'
      +qq.o.map(function(o,j){
        var cls='';
        if(picked!==undefined){ if(j===qq.c) cls=' q-ok'; else if(j===picked) cls=' q-ng'; }
        return '<button type="button" class="'+cls.trim()+'" data-quiz="'+kind+':'+i+':'+j+'"'+(picked!==undefined?' disabled':'')+'>'+String.fromCharCode(65+j)+'. '+E(ja?o[1]:o[0])+'</button>';
      }).join('')+'</div>';
    if(picked!==undefined){
      s+='<div class="ex-feedback '+(picked===qq.c?'ok':'ng')+'">'+(picked===qq.c?('<b>'+(ja?'正解！':'Đúng!')+'</b> '):('<b>'+(ja?'不正解 — 正解は緑の選択肢です。':'Chưa đúng — đáp án đúng là phương án màu xanh.')+'</b> '))+E(ja?qq.ej:qq.e)+'</div>';
      if(qq.x){
        s+='<div class="qb-whys"><p class="qb-whys-t">'+(ja?'各選択肢の解説：':'Giải thích từng phương án:')+'</p>'+qq.o.map(function(o,j){
          var mark=j===qq.c?'✓':(j===picked?'✗':'·');
          var cls=j===qq.c?'w-ok':(j===picked?'w-ng':'w-no');
          return '<div class="qb-why '+cls+'"><span class="qb-wm" aria-hidden="true">'+mark+'</span><div><b>'+String.fromCharCode(65+j)+'.</b> '+E(ja?o[1]:o[0])+'<span class="qb-wx">'+E(ja?qq.x[j][1]:qq.x[j][0])+'</span></div></div>';
        }).join('')+'</div>';
      }
    }
    return s+'</div>';
  }).join('');
  return h;
}
function renderQuizzes(){
  ['net','mig'].forEach(function(kind){
    var host=$(kind==='net'?'quizNet':'quizMig');
    if(!host) return;
    host.innerHTML='<h3>🧠 '+(window.LANG==='ja'
      ?(kind==='net'?'ミニクイズ — ネットワーキング理解度チェック':'ミニクイズ — 移行理解度チェック')
      :(kind==='net'?'Mini-Quiz — kiểm tra nhanh Networking':'Mini-Quiz — kiểm tra nhanh Migration'))+'</h3>'
      +'<p>'+(window.LANG==='ja'
        ?'状況問題です。選ぶとすぐに正誤と解説が出ます。このページで学んだ内容だけで解けます。'
        :'Câu hỏi tình huống bám sát đúng nội dung vừa học ở trang này. Bấm chọn là biết ngay đúng/sai kèm giải thích — đọc xong mà làm sai câu nào thì quay lại đúng mục đó đọc lại.')+'</p>'
      +quizHTML(kind);
    host.querySelectorAll('[data-quiz]').forEach(function(b){
      b.addEventListener('click',function(){
        var p=b.getAttribute('data-quiz').split(':');
        quizState[p[0]][+p[1]]=+p[2];
        renderQuizzes();
        var hh=$(p[0]==='net'?'quizNet':'quizMig');
        if(hh){ var qs=hh.querySelectorAll('.quiz-q'); var el=qs[+p[1]]; if(el) el.scrollIntoView({block:'nearest'}); }
      });
    });
    var rs=host.querySelector('[data-quiz-reset]');
    if(rs) rs.addEventListener('click',function(){ quizState[kind]={}; renderQuizzes(); });
  });
}
try{
  [['networking','quizNet'],['migration','quizMig']].forEach(function(pair){
    var sec=$(pair[0]); if(!sec) return;
    var card=document.createElement('div');
    card.className='diagram-card quiz-card'; card.id=pair[1];
    sec.querySelector('.wrap').appendChild(card);
  });
  renderQuizzes();
}catch(e){}

/* ---- Đổi ngôn ngữ: vẽ lại các khối Đợt 1 theo ngôn ngữ mới ---- */
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      try{ navLang(); }catch(e){}
      try{ renderOnboard(); }catch(e){}
      try{ renderNetAnalogy(); }catch(e){}
      try{ renderQuizzes(); }catch(e){}
      try{ tldrState={cloud:null,name:null}; injectTldr(); }catch(e){}
    },70);
  });
});
try{ navLang(); }catch(e){}
})();
