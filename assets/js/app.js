/* ============================================================
   app.js — Toàn bộ logic của trang
   I18N engine · Phân trang service · Logic luyện Command ·
   Hash routing (V2) · Engine thư viện sơ đồ (V3) · Flow học
   (V4) · Fix tràn menu. Thứ tự giữ đúng như bản 1 file gốc.
   ============================================================ */

    /* ================= I18N ENGINE ================= */
    window.LANG = 'vi';
    var __ORIG = new WeakMap();
    var __applying = false;
    function __skipNode(n){
      var p = n.parentElement;
      while(p){
        if(p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || p.tagName === 'PRE') return true;
        if(p.classList && (p.classList.contains('mono') || p.classList.contains('svc-ic'))) return true;
        p = p.parentElement;
      }
      return false;
    }
    function __walk(root, toJa){
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(n){ return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
      });
      var nodes = [], n;
      while((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function(node){
        if(__skipNode(node)) return;
        if(toJa){
          var raw = node.nodeValue, key = raw.trim();
          if(JAD[key]){
            if(!__ORIG.has(node)) __ORIG.set(node, raw);
            node.nodeValue = raw.replace(key, JAD[key]);
          }
        } else if(__ORIG.has(node)){
          node.nodeValue = __ORIG.get(node);
        }
      });
    }
    function __applyJA(){
      if(window.LANG !== 'ja' || __applying) return;
      __applying = true;
      __walk(document.body, true);
      __applying = false;
    }
    window.__applyJA = __applyJA;
    var __obs = new MutationObserver(function(muts){
      if(window.LANG !== 'ja' || __applying) return;
      muts.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node.nodeType === 1){ __applying = true; __walk(node, true); __applying = false; }
        });
      });
    });
    __obs.observe(document.body, {childList: true, subtree: true});
    function setLang(l){
      window.LANG = l;
      document.documentElement.lang = (l === 'ja') ? 'ja' : 'vi';
      document.getElementById('langVi').classList.toggle('on', l === 'vi');
      document.getElementById('langJa').classList.toggle('on', l === 'ja');
      document.title = (l === 'ja')
        ? 'AWS & Google Cloud 学習 — ラボ・移行・ネットワーキング'
        : 'Học AWS & Google Cloud — Labs, Migration & Networking';
      try { renderServices(); } catch(e){}
      try { renderLabs(); } catch(e){}
      if(l === 'ja'){ __applyJA(); }
      else { __walk(document.body, false); }
      var si = document.getElementById('svcSearch');
      if(si) si.placeholder = (l === 'ja') ? 'サービスを検索… 例：Bedrock、Transit Gateway、DMS、Kafka' : 'Tìm service… vd: Bedrock, Transit Gateway, DMS, Kafka';
    }
    document.getElementById('langVi').addEventListener('click', function(){ setLang('vi'); });
    document.getElementById('langJa').addEventListener('click', function(){ setLang('ja'); });

    /* ================= PHÂN TRANG DANH SÁCH SERVICE ================= */
    Object.assign(JAD, {'Lên đầu trang':'トップへ戻る'});
    state.page = 1; state.perPage = 24; state._sig = '';
    function pgLabels(){
      if(window.LANG === 'ja') return {prev:'‹ 前へ', next:'次へ ›', per:'表示件数', status:function(p,pages,a,b,t){ return pages + 'ページ中 ' + p + 'ページ目 — 全' + t + '件中 ' + a + '〜' + b + '件を表示'; }};
      return {prev:'‹ Trước', next:'Sau ›', per:'Mỗi trang', status:function(p,pages,a,b,t){ return 'Trang ' + p + ' / ' + pages + ' — hiển thị ' + a + '–' + b + ' trong tổng số ' + t + ' service'; }};
    }
    function pgList(p, pages){
      if(pages <= 7) return Array.from({length: pages}, function(_,i){ return i + 1; });
      var set = [1, 2, p - 1, p, p + 1, pages - 1, pages].filter(function(x){ return x >= 1 && x <= pages; });
      set = Array.from(new Set(set)).sort(function(a,b){ return a - b; });
      var out = [];
      set.forEach(function(x, i){ if(i > 0 && x - set[i-1] > 1) out.push('…'); out.push(x); });
      return out;
    }
    function pgHTML(total){
      var L = pgLabels();
      var pages = Math.max(1, Math.ceil(total / state.perPage));
      var a = total === 0 ? 0 : (state.page - 1) * state.perPage + 1;
      var b = Math.min(total, state.page * state.perPage);
      var h = '<span class="pg-status">' + L.status(state.page, pages, a, b, total) + '</span>';
      if(pages > 1){
        h += '<button type="button" class="pg-btn" onclick="__setPage(' + (state.page - 1) + ')"' + (state.page <= 1 ? ' disabled' : '') + '>' + L.prev + '</button>';
        pgList(state.page, pages).forEach(function(x){
          if(x === '…') h += '<span class="pg-dots">…</span>';
          else h += '<button type="button" class="pg-btn' + (x === state.page ? ' on' : '') + '" onclick="__setPage(' + x + ')">' + x + '</button>';
        });
        h += '<button type="button" class="pg-btn" onclick="__setPage(' + (state.page + 1) + ')"' + (state.page >= pages ? ' disabled' : '') + '>' + L.next + '</button>';
      }
      h += '<label class="pg-perpage">' + L.per + ' <select onchange="__setPerPage(this.value)" aria-label="Số service mỗi trang">'
        + [24, 48, 96].map(function(n){ return '<option value="' + n + '"' + (state.perPage === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>';
      return h;
    }
    window.__setPage = function(n){
      var pages = Math.max(1, Math.ceil((state._total || 0) / state.perPage));
      state.page = Math.min(Math.max(1, n), pages);
      renderServices();
      var sticky = document.querySelector('.svc-sticky');
      var off = 62 + (sticky ? sticky.offsetHeight : 120) + 12;
      var y = document.getElementById('pgTop').getBoundingClientRect().top + window.scrollY - off;
      window.scrollTo({top: y, behavior: 'smooth'});
    };
    window.__setPerPage = function(v){ state.perPage = +v; state.page = 1; renderServices(); };
    renderServices = function(){
      if(state.cloud === 'cmp'){
        svcGrid.style.display = 'none'; svcFilters.style.display = 'none';
        document.querySelector('.svc-search').style.display = 'none';
        document.getElementById('pgTop').style.display = 'none';
        document.getElementById('pgBottom').style.display = 'none';
        cmpView.hidden = false; svcCount.textContent = '';
        renderCompare(); if(window.__applyJA) window.__applyJA(); return;
      }
      svcGrid.style.display = ''; svcFilters.style.display = '';
      document.querySelector('.svc-search').style.display = '';
      document.getElementById('pgTop').style.display = '';
      document.getElementById('pgBottom').style.display = '';
      cmpView.hidden = true;
      renderFilters();
      var sig = [state.cloud, state.group, state.q, state.lvl, state.perPage].join('|');
      if(sig !== state._sig){ state._sig = sig; state.page = 1; }
      var cat = state.cloud === 'aws' ? AWS_CAT : GCP_CAT;
      var q = state.q.trim().toLowerCase();
      var items = [];
      cat.forEach(function(gr){
        if(state.group !== 'all' && state.group !== gr.g) return;
        gr.items.forEach(function(it){
          if(state.lvl !== 'all' && LVL[it[3]] !== state.lvl) return;
          if(q && (it[0] + ' ' + it[2] + ' ' + gr.g).toLowerCase().indexOf(q) === -1) return;
          items.push({gr: gr, it: it});
        });
      });
      var total = items.length;
      state._total = total;
      var pages = Math.max(1, Math.ceil(total / state.perPage));
      if(state.page > pages) state.page = pages;
      var slice = items.slice((state.page - 1) * state.perPage, state.page * state.perPage);
      var html = slice.map(function(x){
        var it = x.it, name = it[0], st = it[4];
        var core = COREMAP[state.cloud + '|' + name];
        return '<button type="button" class="svc-card mini' + (st && st[0] === 'dep' ? ' dep-card' : '') + '" data-name="' + esc(name) + '">'
          + '<span class="svc-name">' + sicon(state.cloud, x.gr.g, it[1], name, 38) + '</span>'
          + '<span class="cat">' + esc(x.gr.g) + '</span>'
          + '<h3>' + esc(name) + '</h3><p>' + esc(it[2]) + '</p>'
          + '<span class="badges">' + badgeHTML(st, !!core) + '<span class="badge lvl">' + LVL[it[3]] + '</span></span></button>';
      }).join('');
      svcGrid.innerHTML = html || '<div class="empty-note">Không tìm thấy service nào khớp bộ lọc. Thử xoá từ khoá tìm kiếm.</div>';
      svcCount.textContent = '';
      var pg = pgHTML(total);
      document.getElementById('pgTop').innerHTML = pg;
      document.getElementById('pgBottom').innerHTML = pg;
      svcGrid.querySelectorAll('.svc-card').forEach(function(card){
        card.addEventListener('click', function(){ openSvc(state.cloud, card.getAttribute('data-name')); });
      });
      if(window.__applyJA) window.__applyJA();
    };
    renderServices();
    /* Nút lên đầu trang */
    var toTopBtn = document.getElementById('toTop');
    window.addEventListener('scroll', function(){
      toTopBtn.classList.toggle('show', window.scrollY > 600);
    }, {passive: true});
    toTopBtn.addEventListener('click', function(){ window.scrollTo({top: 0, behavior: 'smooth'}); });

/* ================= LUYỆN COMMAND — LOGIC (dữ liệu EX/CHEAT/SHELLINTRO ở data-content.js) ================= */
    document.getElementById('cheatTable').innerHTML = '<tr><th style="width:20%">Tác vụ</th><th style="width:26%">Linux</th><th style="width:27%">AWS CLI</th><th>Google Cloud (gcloud)</th></tr>'
      + CHEAT.map(function(r){ return '<tr><td><b>' + r[0] + '</b></td><td class="mono" style="font-size:12.5px">' + esc(r[1]) + '</td><td class="mono" style="font-size:12.5px">' + esc(r[2]) + '</td><td class="mono" style="font-size:12.5px">' + esc(r[3]) + '</td></tr>'; }).join('');
    document.getElementById('shellIntroGrid').innerHTML = SHELLINTRO.map(function(c){ return netCard(c, c.t === 'Google Cloud Shell' ? 'gcp' : 'aws'); }).join('');

    /* ---- Logic luyện tập ---- */
    var cmdState = {list: [], idx: 0, score: 0, done: 0, solved: {}};
    function normCmd(s){ return s.trim().replace(/\s+/g, ' ').replace(/;$/, ''); }
    function cmdPool(){
      var tr = document.getElementById('cmdTrack').value;
      var lv = document.getElementById('cmdLevel').value;
      return EX.filter(function(e){ return e.tr === tr && (lv === 'all' || e.lv === +lv); });
    }
    function curEx(){ return cmdState.list[cmdState.idx % Math.max(1, cmdState.list.length)]; }
    function updateScore(){
      var total = EX.length;
      document.getElementById('cmdScoreText').textContent = (window.LANG === 'ja')
        ? 'スコア: ' + cmdState.score + ' · ' + cmdState.done + '/' + total + ' 問正解'
        : 'Điểm: ' + cmdState.score + ' · Đúng ' + cmdState.done + '/' + total + ' bài';
      document.getElementById('cmdProgress').style.width = (total ? (cmdState.done / total * 100) : 0) + '%';
    }
    function showEx(){
      cmdState.list = cmdPool();
      var fb = document.getElementById('exFeedback');
      fb.hidden = true; fb.className = 'ex-feedback';
      var mc = document.getElementById('exMc');
      mc.hidden = true; mc.innerHTML = '';
      document.getElementById('termLine').style.display = '';
      if(!cmdState.list.length){
        document.getElementById('exPrompt').textContent = 'Không có bài ở cấp độ này. Hãy chọn cấp độ khác.';
        document.getElementById('exPromptJa').textContent = '';
        document.getElementById('exLabLink').textContent = '';
        return;
      }
      var e = curEx();
      var lvName = ['Cơ bản','Trung cấp','Nâng cao'][e.lv];
      document.getElementById('termTitle').textContent = 'terminal — ' + ({linux:'Linux', aws:'AWS CloudShell', gcp:'Google Cloud Shell', scenario:'Troubleshooting'})[e.tr] + ' · ' + lvName + ' · Bài ' + (cmdState.idx % cmdState.list.length + 1) + '/' + cmdState.list.length;
      document.getElementById('exPrompt').textContent = e.q;
      document.getElementById('exPromptJa').textContent = e.ja;
      document.getElementById('exLabLink').innerHTML = 'Áp dụng trong: <b>' + esc(e.lab) + '</b> — xem Phần 2 (Labs) &amp; Phần 3 (Migration).';
      var input = document.getElementById('cmdInput');
      if(e.type === 'mc'){
        document.getElementById('termLine').style.display = 'none';
        mc.hidden = false;
        mc.innerHTML = e.options.map(function(o, i){
          return '<button type="button" data-mc="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>';
        }).join('');
        mc.querySelectorAll('button').forEach(function(b){
          b.addEventListener('click', function(){ answerMC(e, +b.getAttribute('data-mc'), b); });
        });
      } else {
        document.getElementById('termPs').textContent = e.ps;
        input.value = '';
        input.focus();
      }
      if(window.__applyJA) window.__applyJA();
    }
    function feedback(kind, html){
      var fb = document.getElementById('exFeedback');
      fb.hidden = false;
      fb.className = 'ex-feedback ' + kind;
      fb.innerHTML = html;
      if(window.__applyJA) window.__applyJA();
    }
    function markSolved(e, pts){
      var key = e.q;
      if(!cmdState.solved[key]){ cmdState.solved[key] = true; cmdState.done++; }
      cmdState.score += pts;
      updateScore();
    }
    function checkCmd(){
      var e = curEx();
      if(!e || e.type === 'mc') return;
      var v = normCmd(document.getElementById('cmdInput').value);
      if(!v){ feedback('hintbox', 'Hãy gõ một lệnh trước đã. Bấm “Gợi ý” nếu bí.'); return; }
      var ok = e.acc.some(function(a){ return normCmd(a) === v; });
      if(ok){
        markSolved(e, 10);
        feedback('ok', '<b>Chính xác! +10 điểm.</b><br />' + e.exp);
      } else {
        feedback('ng', '<b>Chưa đúng.</b> Hãy đối chiếu lại từng phần của lệnh (tên lệnh → đối tượng → cờ). Bấm “Gợi ý” để xem hướng đi, hoặc “Xem đáp án” nếu muốn học luôn đáp án chuẩn.');
      }
    }
    function answerMC(e, pick, btn){
      var wrap = document.getElementById('exMc');
      wrap.querySelectorAll('button').forEach(function(b){ b.disabled = true; });
      if(pick === e.correct){
        btn.classList.add('picked-ok');
        markSolved(e, 10);
        feedback('ok', '<b>Đúng quy trình! +10 điểm.</b><br />' + e.exp);
      } else {
        btn.classList.add('picked-ng');
        wrap.querySelectorAll('button')[e.correct].classList.add('picked-ok');
        feedback('ng', '<b>Chưa đúng — đáp án chuẩn đã được đánh dấu xanh.</b><br />' + e.exp);
      }
    }
    document.getElementById('btnCheck').addEventListener('click', checkCmd);
    document.getElementById('cmdInput').addEventListener('keydown', function(ev){ if(ev.key === 'Enter') checkCmd(); });
    document.getElementById('btnHint').addEventListener('click', function(){
      var e = curEx(); if(!e) return;
      if(e.type === 'mc'){ feedback('hintbox', '<b>Gợi ý:</b> nghĩ theo nguyên tắc “đo trước — sửa sau, đọc log trước khi restart”. Đáp án đúng luôn bắt đầu bằng lệnh kiểm tra, không phải hành động phá huỷ.'); }
      else feedback('hintbox', '<b>Gợi ý:</b> ' + esc(e.hint));
    });
    document.getElementById('btnAnswer').addEventListener('click', function(){
      var e = curEx(); if(!e) return;
      if(e.type === 'mc'){ feedback('hintbox', '<b>Đáp án:</b> phương án ' + String.fromCharCode(65 + e.correct) + '.<br />' + e.exp); }
      else feedback('hintbox', '<b>Đáp án chuẩn:</b> <code>' + esc(e.acc[0]) + '</code><br />' + e.exp);
    });
    document.getElementById('btnNext').addEventListener('click', function(){ cmdState.idx++; showEx(); });
    document.getElementById('cmdTrack').addEventListener('change', function(){ cmdState.idx = 0; showEx(); });
    document.getElementById('cmdLevel').addEventListener('change', function(){ cmdState.idx = 0; showEx(); });
    showEx(); updateScore();

/* ================= V2 · HASH ROUTING — NHIỀU TRANG RIÊNG ================= */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return (typeof esc==='function') ? esc(s) : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

/* ---- Home hub ---- */
var HUB=[
 ['#/services','🧩','Trang Services','Danh mục 340+ service AWS & GCP có icon riêng, phân trang 24/48/96, bấm từng service để mở trang chi tiết sâu.'],
 ['#/compare','⚖️','So sánh AWS ⇄ GCP','Bảng đối chiếu các cặp service tương đương: điểm giống, khác biệt quyết định và khi nào chọn bên nào.'],
 ['#/labs','🧪','Trang Labs','12 lab song song AWS ⇄ GCP — mỗi lab có trang chi tiết riêng: sơ đồ, từng bước kèm kết quả mẫu, lỗi hay gặp và cleanup.'],
 ['#/migration','🚚','Trang Migration','7 chiến lược 7R, 3 giai đoạn Assess → Mobilize → Migrate và 9 lab migration từ mọi môi trường, gồm cả cross-cloud.'],
 ['#/networking','🌐','Trang Networking & Sơ đồ','Đọc sơ đồ kiến trúc, VPC/CIDR, route, Transit Gateway, hybrid — đến cấp bậc thầy, kèm máy tính chia subnet.'],
 ['#/architect','🏛️','Trang Architect','Thiết kế dự án 6 bước, Terraform, Kubernetes (EKS ⇄ GKE), nền tảng công nghệ, framework kiến trúc và capstone.'],
 ['#/command','⌨️','Trang Luyện Command','Terminal giả lập Linux / AWS CLI / gcloud: 21 bài có điểm, gợi ý — và kết quả mẫu (output) hiện ngay dưới mỗi bài.'],
 ['#/glossary','🇯🇵','Thuật ngữ công ty Nhật & Deploy','Bảng thuật ngữ VN–JP–EN cho quy trình 要件定義→設計→構築→検証→リリース, kèm hướng dẫn deploy GitHub Pages.']
];
var hub=document.createElement('section'); hub.id='homeHub';
hub.innerHTML='<div class="wrap"><div class="sec-head"><span class="sec-tag">Trang chủ · Tổng quan & lộ trình</span><h2>Mỗi phần học là một trang riêng — chọn nơi bạn muốn vào</h2><p>Trang web không còn là một trang cuộn dài: mỗi mục dưới đây mở ra một <b>trang riêng có URL riêng</b> (copy link gửi được, bấm Back của trình duyệt quay lại đúng chỗ). Lộ trình gợi ý: Services → Labs → Migration → Networking → Architect → Luyện Command.</p></div>'
 +'<div class="road"><div><b>Bước 1 · Services</b><span>Hiểu từng service và cách chọn</span></div><div><b>Bước 2 · Labs</b><span>Làm tay từng bước song song 2 cloud</span></div><div><b>Bước 3 · Migration</b><span>Chuyển mọi môi trường lên cloud</span></div><div><b>Bước 4 · Networking</b><span>Làm chủ mạng cloud</span></div><div><b>Bước 5 · Architect</b><span>Terraform, K8s, thiết kế dự án</span></div><div><b>Bước 6 · Command</b><span>Luyện gõ lệnh đến thuộc</span></div></div>'
 +'<div class="hub-grid">'+HUB.map(function(x){return '<a class="hub-card" href="'+x[0]+'"><span class="hub-ic">'+x[1]+'</span><b>'+x[2]+'</b><p>'+x[3]+'</p></a>';}).join('')+'</div></div>';
document.querySelector('main').insertBefore(hub, document.querySelector('main').firstChild);

/* ---- Detail + compare page containers ---- */
var svcPage=document.createElement('section'); svcPage.id='svcDetailPage'; svcPage.innerHTML='<div class="wrap" id="svcDetailBody"></div>';
var labPage=document.createElement('section'); labPage.id='labDetailPage'; labPage.innerHTML='<div class="wrap" id="labDetailBody"></div>';
var cmpPage=document.createElement('section'); cmpPage.id='comparePage';
cmpPage.innerHTML='<div class="wrap"><div class="sec-head"><span class="sec-tag">Trang riêng · So sánh</span><h2>Đối chiếu AWS ⇄ Google Cloud</h2><p>Mỗi cặp service tương đương: điểm giống, khác biệt quyết định khi thiết kế, và gợi ý chọn bên nào. Bấm tên service để mở trang chi tiết của nó.</p></div><div id="cmpHost"></div></div>';
var main=document.querySelector('main');
main.appendChild(svcPage); main.appendChild(labPage); main.appendChild(cmpPage);
var cmpView=$('cmpView'); if(cmpView) $('cmpHost').appendChild(cmpView);

/* ---- Nav rewrite ---- */
var NAVMAP={'Services':'#/services','Labs thực hành':'#/labs','Migration':'#/migration','Sơ đồ':'#/diagrams','Networking':'#/networking','Dự án':'#/architect','Architect':'#/architect','Command':'#/command','Deploy':'#/glossary'};
document.querySelectorAll('nav.top a').forEach(function(a){
  if(a.classList.contains('brand')){ a.setAttribute('href','#/'); return; }
  var t=a.textContent.trim(); if(NAVMAP[t]) a.setAttribute('href',NAVMAP[t]); a.setAttribute('data-route',a.getAttribute('href'));
});
var langT=document.querySelector('.lang-toggle');
[['#/compare','So sánh'],['#/glossary','Thuật ngữ JP']].forEach(function(x){
  var a=document.createElement('a'); a.href=x[0]; a.textContent=x[1]; a.setAttribute('data-route',x[0]);
  langT.parentNode.insertBefore(a, langT);
});

/* ---- Page visibility ---- */
var PAGES={
 home:['TOP','homeHub'], services:['services'], compare:['comparePage'],
 labs:['labs'], migration:['migration'], networking:['diagrams','networking'], diagrams:['archLibPage'],
 architect:['du-an','architect'], command:['command'], glossary:['glossary','deploy'], flow:['flowPage'],
 svcDetail:['svcDetailPage'], labDetail:['labDetailPage']
};
var ALLIDS=['homeHub','services','labs','migration','diagrams','networking','du-an','architect','command','glossary','deploy','svcDetailPage','labDetailPage','comparePage','archLibPage','flowPage'];
function showPage(name){
  var show=PAGES[name]||PAGES.home;
  var hero=document.querySelector('header.hero');
  hero.classList.toggle('page-off', show.indexOf('TOP')===-1);
  ALLIDS.forEach(function(id){ var el=$(id); if(el) el.classList.toggle('page-off', show.indexOf(id)===-1); });
  document.querySelectorAll('nav.top a[data-route]').forEach(function(a){
    var r=a.getAttribute('data-route'); var on=false;
    if(name==='home'&&r==='#/') on=true;
    if(name!=='home'&&r==='#/'+name) on=true;
    if(name==='svcDetail'&&r==='#/services') on=true;
    if(name==='labDetail'&&(r==='#/labs'||r==='#/migration')) on=true;
    a.classList.toggle('act',on);
  });
  window.scrollTo(0,0);
  if(window.__applyJA) window.__applyJA();
}

/* ================= SERVICE DETAIL PAGE ================= */
var GINFO={
 'Compute':{feat:['Tài nguyên tính toán đàn hồi, scale theo nhu cầu','Tích hợp IAM/VPC/monitoring của cùng cloud','Nhiều mô hình mua: on-demand, cam kết giảm giá, spot/preemptible'],spec:[['Mô hình triển khai','Managed / serverless / IaaS tùy service — xem cấu hình mẫu bên dưới'],['Vùng khả dụng','Chạy multi-AZ/multi-zone để đạt HA; kiểm tra service có mặt ở region Tokyo chưa'],['Giới hạn scale','Quota theo tài khoản/region — xin tăng trước khi launch lớn']],sec:['Không mở cổng quản trị (22/3389) ra 0.0.0.0/0','Dùng role/service account thay access key tĩnh','Mã hoá dữ liệu khi lưu trữ và khi truyền (TLS)'],mon:['Theo dõi CPU/RAM/latency/error rate trên dashboard gốc của cloud','Đặt alarm ngân sách và alarm bất thường','Bật audit log cho mọi thao tác quản trị']},
 'Storage':{feat:['Độ bền dữ liệu cao theo thiết kế của nhà cung cấp','Phân lớp lưu trữ nóng/lạnh để tối ưu chi phí','Tích hợp lifecycle, versioning, replication'],spec:[['Độ bền / SLA','Kiểm tra trang SLA chính thức của service tại region sử dụng'],['Replication','Bật versioning + replication khi dữ liệu quan trọng'],['Truy cập','Ưu tiên private endpoint/VPC endpoint, chặn public mặc định']],sec:['Bật Block Public Access / uniform access — không để dữ liệu public','Mã hoá mặc định (SSE) + quản lý key bằng KMS khi nhạy cảm','IAM policy tối thiểu theo từng prefix/thư mục'],mon:['Theo dõi dung lượng theo lớp lưu trữ và chi phí request','Alarm khi có thao tác xoá hàng loạt','Audit log truy cập object']},
 'Database':{feat:['Managed: backup, patch, failover do nhà cung cấp vận hành','Scale đọc bằng replica; scale ghi theo kiến trúc service','Bảo mật mạng: chỉ truy cập từ subnet/VPC riêng'],spec:[['HA','Multi-AZ (AWS) / Regional HA (GCP) cho production'],['Backup','Automated backup + PITR; test restore định kỳ'],['Kết nối','Không public IP; dùng proxy/private endpoint']],sec:['Đặt DB ở private subnet, security group chỉ từ tầng app','Mã hoá at-rest + TLS khi kết nối','Tách user ứng dụng khỏi user quản trị, xoay mật khẩu bằng Secrets Manager'],mon:['Theo dõi connections, CPU, IOPS, replication lag','Alarm khi storage sắp đầy và khi failover xảy ra','Slow query log để tối ưu truy vấn']},
 '_def':{feat:['Service managed của cloud — nhà cung cấp vận hành hạ tầng bên dưới','Tích hợp sẵn IAM, logging, monitoring của cùng hệ sinh thái','Mở rộng theo nhu cầu, trả theo mức sử dụng thực tế'],spec:[['Region','Kiểm tra service đã GA tại region bạn dùng (ưu tiên Tokyo cho công ty Nhật)'],['Quota','Có quota mặc định theo tài khoản — xem mục Giới hạn'],['Tích hợp','Kết nối tốt nhất với các service cùng cloud qua mạng riêng']],sec:['Áp least-privilege cho mọi role/policy liên quan','Mã hoá dữ liệu nhạy cảm at-rest và in-transit','Bật audit log (CloudTrail / Audit Logs)'],mon:['Đưa metric/log của service về trung tâm giám sát (CloudWatch / Cloud Monitoring)','Đặt alarm lỗi và ngân sách','Review quyền truy cập định kỳ bằng công cụ analyzer']}
};
function ginfo(g){ return GINFO[g]||GINFO._def; }
function findSvc(cloud,name){
  var core=(typeof COREMAP!=='undefined')?COREMAP[cloud+'|'+name]:null;
  var cat=cloud==='aws'?AWS_CAT:GCP_CAT, item=null, group='';
  cat.forEach(function(gr){ gr.items.forEach(function(it){ if(it[0]===name){ item=it; group=gr.g; } }); });
  return {core:core,item:item,group:core?core.g:group};
}
var TFMAP={
'aws|Amazon EC2':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_instance" "app" {\n  ami                    = "ami-0abcdef1234567890"  # Amazon Linux 2023\n  instance_type          = "t3.micro"\n  subnet_id              = var.private_subnet_id\n  vpc_security_group_ids = [aws_security_group.app.id]\n  iam_instance_profile   = aws_iam_instance_profile.app.name\n  tags = { Name = "app-server", Project = "learning" }\n}',
'aws|AWS Lambda':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_lambda_function" "api" {\n  function_name = "api-fn"\n  runtime       = "python3.12"\n  handler       = "lambda_function.handler"\n  role          = aws_iam_role.lambda_exec.arn\n  filename      = "function.zip"\n  timeout       = 10\n  memory_size   = 512\n}',
'aws|Amazon S3':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_s3_bucket" "data" {\n  bucket = "my-data-lake-example"\n}\nresource "aws_s3_bucket_versioning" "data" {\n  bucket = aws_s3_bucket.data.id\n  versioning_configuration { status = "Enabled" }\n}\nresource "aws_s3_bucket_public_access_block" "data" {\n  bucket                  = aws_s3_bucket.data.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}',
'aws|Amazon RDS':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_db_instance" "prod" {\n  identifier           = "prod-db"\n  engine               = "postgres"\n  engine_version       = "16"\n  instance_class       = "db.t3.medium"\n  allocated_storage    = 100\n  multi_az             = true\n  storage_encrypted    = true\n  db_subnet_group_name = aws_db_subnet_group.data.name\n  username             = "admin"\n  password             = var.db_password  # lấy từ Secrets Manager/variable nhạy cảm\n  skip_final_snapshot  = false\n}',
'aws|Amazon DynamoDB':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_dynamodb_table" "orders" {\n  name         = "Orders"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "orderId"\n  attribute {\n    name = "orderId"\n    type = "S"\n  }\n  point_in_time_recovery { enabled = true }\n}',
'aws|Amazon VPC':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_vpc" "main" {\n  cidr_block           = "10.0.0.0/16"\n  enable_dns_hostnames = true\n  tags = { Name = "prod-vpc" }\n}\nresource "aws_subnet" "private_a" {\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.11.0/24"\n  availability_zone = "ap-northeast-1a"\n}\nresource "aws_internet_gateway" "main" { vpc_id = aws_vpc.main.id }',
'aws|AWS Transit Gateway':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_ec2_transit_gateway" "hub" {\n  description = "hub-tokyo"\n}\nresource "aws_ec2_transit_gateway_vpc_attachment" "app" {\n  transit_gateway_id = aws_ec2_transit_gateway.hub.id\n  vpc_id             = var.vpc_id\n  subnet_ids         = var.tgw_subnet_ids\n}',
'aws|Amazon CloudFront':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_cloudfront_distribution" "site" {\n  enabled             = true\n  default_root_object = "index.html"\n  origin {\n    domain_name = aws_s3_bucket.site.bucket_regional_domain_name\n    origin_id   = "s3-site"\n    s3_origin_config { origin_access_identity = aws_cloudfront_origin_access_identity.site.cloudfront_access_identity_path }\n  }\n  default_cache_behavior {\n    target_origin_id       = "s3-site"\n    viewer_protocol_policy = "redirect-to-https"\n    allowed_methods        = ["GET", "HEAD"]\n    cached_methods         = ["GET", "HEAD"]\n    forwarded_values { query_string = false  cookies { forward = "none" } }\n  }\n  restrictions { geo_restriction { restriction_type = "none" } }\n  viewer_certificate { cloudfront_default_certificate = true }\n}',
'aws|Elastic Load Balancing (ALB)':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_lb" "web" {\n  name               = "web-alb"\n  load_balancer_type = "application"\n  subnets            = var.public_subnet_ids\n  security_groups    = [aws_security_group.alb.id]\n}\nresource "aws_lb_listener" "https" {\n  load_balancer_arn = aws_lb.web.arn\n  port              = 443\n  protocol          = "HTTPS"\n  certificate_arn   = var.acm_certificate_arn\n  default_action {\n    type             = "forward"\n    target_group_arn = aws_lb_target_group.web.arn\n  }\n}',
'aws|Amazon Route 53':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_route53_zone" "main" {\n  name = "example.com"\n}\nresource "aws_route53_record" "www" {\n  zone_id = aws_route53_zone.main.zone_id\n  name    = "www"\n  type    = "A"\n  alias {\n    name                   = aws_lb.web.dns_name\n    zone_id                = aws_lb.web.zone_id\n    evaluate_target_health = true\n  }\n}',
'aws|AWS IAM':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_iam_role" "app" {\n  name = "app-role"\n  assume_role_policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{ Effect = "Allow", Action = "sts:AssumeRole",\n      Principal = { Service = "ec2.amazonaws.com" } }]\n  })\n}\nresource "aws_iam_role_policy" "read_bucket" {\n  role = aws_iam_role.app.id\n  policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{ Effect = "Allow",\n      Action   = ["s3:GetObject", "s3:ListBucket"],\n      Resource = ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"] }]\n  })\n}',
'aws|Amazon SQS':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_sqs_queue" "orders_dlq" { name = "order-queue-dlq" }\nresource "aws_sqs_queue" "orders" {\n  name                       = "order-queue"\n  visibility_timeout_seconds = 60\n  redrive_policy = jsonencode({\n    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn\n    maxReceiveCount     = 3\n  })\n}',
'aws|Amazon EventBridge':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_cloudwatch_event_rule" "nightly" {\n  name                = "nightly-report"\n  schedule_expression = "cron(0 15 * * ? *)"\n}\nresource "aws_cloudwatch_event_target" "report" {\n  rule = aws_cloudwatch_event_rule.nightly.name\n  arn  = aws_lambda_function.report.arn\n}',
'aws|Amazon CloudWatch':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_cloudwatch_metric_alarm" "high_cpu" {\n  alarm_name          = "high-cpu"\n  metric_name         = "CPUUtilization"\n  namespace           = "AWS/EC2"\n  statistic           = "Average"\n  period              = 300\n  threshold           = 80\n  comparison_operator = "GreaterThanThreshold"\n  evaluation_periods  = 2\n  alarm_actions       = [aws_sns_topic.alerts.arn]\n  dimensions          = { InstanceId = var.instance_id }\n}',
'aws|Amazon Athena':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_athena_database" "analytics" { name = "analytics"  bucket = aws_s3_bucket.query_results.id }\nresource "aws_athena_workgroup" "main" {\n  name = "analytics-wg"\n  configuration {\n    result_configuration { output_location = "s3://${aws_s3_bucket.query_results.id}/results/" }\n  }\n}',
'aws|Amazon SageMaker':'provider "aws" { region = "ap-northeast-1" }\n\nresource "aws_sagemaker_notebook_instance" "dev" {\n  name          = "ml-dev"\n  instance_type = "ml.t3.medium"\n  role_arn      = aws_iam_role.sagemaker.arn\n}',
'gcp|Compute Engine':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_compute_instance" "web" {\n  name         = "web-1"\n  machine_type = "e2-medium"\n  zone         = "asia-northeast1-a"\n  tags         = ["http-server"]\n  boot_disk { initialize_params { image = "debian-cloud/debian-12" } }\n  network_interface { network = "prod-net" }\n  service_account { email = google_service_account.web.email  scopes = ["cloud-platform"] }\n}',
'gcp|Cloud Run':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_cloud_run_v2_service" "api" {\n  name     = "api-service"\n  location = "asia-northeast1"\n  template {\n    scaling { min_instance_count = 0  max_instance_count = 20 }\n    containers {\n      image = "asia-northeast1-docker.pkg.dev/${var.project_id}/repo/api:v1"\n      resources { limits = { cpu = "1", memory = "512Mi" } }\n    }\n  }\n}',
'gcp|Google Kubernetes Engine (GKE)':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_container_cluster" "prod" {\n  name     = "prod-cluster"\n  location = "asia-northeast1"\n  enable_autopilot = true\n}',
'gcp|Cloud Storage':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_storage_bucket" "data" {\n  name                        = "my-data-lake-example"\n  location                    = "asia-northeast1"\n  uniform_bucket_level_access = true\n  versioning { enabled = true }\n}',
'gcp|Cloud SQL':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_sql_database_instance" "prod" {\n  name             = "prod-db"\n  database_version = "POSTGRES_15"\n  region           = "asia-northeast1"\n  settings {\n    tier              = "db-custom-2-7680"\n    availability_type = "REGIONAL"\n    backup_configuration { enabled = true  point_in_time_recovery_enabled = true }\n    ip_configuration { ipv4_enabled = false  private_network = var.vpc_id }\n  }\n  deletion_protection = true\n}',
'gcp|BigQuery':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_bigquery_dataset" "analytics" {\n  dataset_id = "analytics"\n  location   = "asia-northeast1"\n}\nresource "google_bigquery_table" "orders" {\n  dataset_id = google_bigquery_dataset.analytics.dataset_id\n  table_id   = "orders"\n  time_partitioning { type = "DAY"  field = "day" }\n}',
'gcp|Pub/Sub':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_pubsub_topic" "orders" { name = "order-events" }\nresource "google_pubsub_subscription" "orders" {\n  name                 = "order-sub"\n  topic                = google_pubsub_topic.orders.name\n  ack_deadline_seconds = 60\n  dead_letter_policy { dead_letter_topic = google_pubsub_topic.orders_dlq.id  max_delivery_attempts = 5 }\n}',
'gcp|Cloud VPC (Google Cloud)':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_compute_network" "prod" {\n  name                    = "prod-net"\n  auto_create_subnetworks = false\n}\nresource "google_compute_subnetwork" "tokyo_app" {\n  name                     = "tokyo-app"\n  ip_cidr_range            = "10.10.0.0/20"\n  region                   = "asia-northeast1"\n  network                  = google_compute_network.prod.id\n  private_ip_google_access = true\n}',
'gcp|Google Cloud IAM':'provider "google" { project = var.project_id  region = "asia-northeast1" }\n\nresource "google_service_account" "app" {\n  account_id   = "app-sa"\n  display_name = "Application service account"\n}\nresource "google_project_iam_member" "app_run" {\n  project = var.project_id\n  role    = "roles/run.developer"\n  member  = "serviceAccount:${google_service_account.app.email}"\n}\n# Ưu tiên Workload Identity cho GKE thay vì tải key JSON.'
};
function tfSnippet(cloud,name,group){
  var real=TFMAP[cloud+'|'+name];
  if(real) return '# Terraform — cấu hình thật cho '+name+' (điều chỉnh tên/ID theo dự án của bạn)\n'+real+'\n# Quy trình: terraform init && terraform plan (đọc kỹ diff) && terraform apply';
  var slug=name.toLowerCase().replace(/^(amazon|aws|google cloud)\s+/,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(cloud==='aws') return '# KHUNG MẪU Terraform cho '+name+' — đây là khung để bắt đầu, chưa phải cấu hình chạy ngay:\n# điền resource type thật của service này từ registry.terraform.io/providers/hashicorp/aws\nprovider "aws" { region = "ap-northeast-1" }\n\n# resource "aws_<loại-tài-nguyên>" "'+slug+'" { ... }\n# Sau đó: terraform init && terraform plan && terraform apply';
  return '# KHUNG MẪU Terraform cho '+name+' — đây là khung để bắt đầu, chưa phải cấu hình chạy ngay:\n# điền resource type thật của service này từ registry.terraform.io/providers/hashicorp/google\nprovider "google" { project = var.project_id  region = "asia-northeast1" }\n\n# resource "google_<loại-tài-nguyên>" "'+slug+'" { ... }\n# Sau đó: terraform init && terraform plan && terraform apply';
}
function svcDetailHTML(cloud,name){
  var f=findSvc(cloud,name); if(!f.item&&!f.core) return '<p>Không tìm thấy service.</p>';
  var core=f.core, item=f.item, group=f.group, gi=ginfo(group);
  var desc=core?core.d:item[2]; var lvl=core?core.lvl:item[3]; var st=item?item[4]:null;
  var glyph=core?core.gl:item[1];
  var feats=core?core.u.slice():gi.feat;
  var relLabs=[];
  if(typeof LABS!=='undefined') LABS.forEach(function(l,i){ if(l.svc.indexOf(name)>-1) relLabs.push(['#/lab/'+i,l.t]); });
  if(typeof MIGS!=='undefined') MIGS.forEach(function(m,i){ if(m.tool===name||m.to===name) relLabs.push(['#/miglab/'+i,m.t]); });
  var cli=core?core.cfg:('# Thao tác cơ bản qua '+(cloud==='aws'?'AWS CLI':'gcloud')+' — mở CloudShell/Cloud Shell và tra lệnh của service:\n'+(cloud==='aws'?('aws '+name.toLowerCase().replace(/^(amazon|aws)\s+/,'').replace(/[^a-z0-9]+/g,'')+' help') : ('gcloud '+name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' --help'))+'\n# Mọi thao tác tạo/sửa đều nên làm lại bằng Terraform ở bước sau để có IaC.');
  var h='<p class="crumb"><a href="#/services">← Trang Services</a> · '+(cloud==='aws'?'AWS':'Google Cloud')+' · '+E(group)+'</p>';
  h+='<div class="d-head">'+sicon(cloud,group,glyph,name,60)+'<div><span class="sub">'+(cloud==='aws'?'AWS':'Google Cloud')+' · '+E(group)+' · Cấp độ: '+LVL[lvl]+'</span><h2>'+E(name)+'</h2></div></div>';
  if(st&&st[0]==='dep') h+='<div class="ex-feedback ng" style="margin:14px 0">⚠ Trạng thái: '+E(st[1])+' — chỉ học để nhận biết khi gặp trong hệ thống cũ, không chọn cho dự án mới.</div>';
  if(st&&st[0]==='new') h+='<div class="ex-feedback ok" style="margin:14px 0">✦ Service mới (2025) thuộc thế hệ mới nhất của '+(cloud==='aws'?'AWS':'Google Cloud')+'.</div>';
  h+='<div class="d-actions"><a class="btn btn-o" href="#/labs">Làm lab liên quan</a><a class="btn btn-g" href="#/compare">So sánh AWS ⇄ GCP</a><a class="btn btn-g" href="#/command">Luyện command</a></div>';
  /* Overview + mini diagram */
  h+='<div class="dsec"><h3>1 · Tổng quan & cách hoạt động</h3><p>'+E(desc)+'</p>'
    +'<div class="flow-mini"><span class="fn">Người dùng / Ứng dụng</span><span class="fa">➜</span><span class="fn">'+sicon(cloud,group,glyph,name,22)+' '+E(name)+'</span><span class="fa">➜</span><span class="fn">Service liên quan trong '+E(group)+'</span><span class="fa">➜</span><span class="fn">Kết quả cho workload</span></div>'
    +'<p style="margin-top:10px">Cách đọc sơ đồ mini: request/dữ liệu đi vào '+E(name)+', service xử lý theo cấu hình bạn đặt (mục 4), phát log/metric ra hệ giám sát (mục 7) và thường kết hợp các service liên quan ở cuối trang để thành một kiến trúc hoàn chỉnh.</p>'
    +'<div class="jp-box"><b>日本語サマリー：</b>'+E(name)+' は '+(cloud==='aws'?'AWS':'Google Cloud')+' の「'+E(group)+'」分野のマネージドサービスです。要件定義では「何を解決するか」、基本設計では「どのサービスと組み合わせるか」、詳細設計では「パラメータと権限」を決めます。本番環境では監視と障害対応の手順まで含めて設計してください。</div></div>';
  /* Features */
  h+='<div class="dsec"><h3>2 · Tính năng chính</h3>'+(core?'':'<p style="border:1px dashed rgba(255,184,77,.6);border-radius:9px;padding:8px 12px"><b>Lưu ý:</b> mục này là hướng dẫn chung cho nhóm '+E(group)+' — hãy kiểm tra tính năng và giới hạn riêng của '+E(name)+' tại tài liệu chính thức trước khi thiết kế dự án thật.</p>')+'<ul>'+feats.map(function(x){return '<li>'+E(x)+'</li>';}).join('')+gi.feat.filter(function(x){return feats.indexOf(x)===-1;}).slice(0,2).map(function(x){return '<li>'+E(x)+'</li>';}).join('')+'</ul></div>';
  /* When to use / not */
  h+='<div class="dsec"><h3>3 · Khi nào dùng / khi nào không nên dùng</h3><h4>Nên dùng khi</h4><ul>'+(core?core.u.map(function(x){return '<li>'+E(x)+'</li>';}).join(''):'<li>'+E(desc)+'</li>')+'</ul><h4>Không nên dùng / cân nhắc thay thế khi</h4><p>'+(core?E(core.lim):'Bài toán nằm ngoài chuyên môn của service này (xem mục So sánh), hoặc workload quá nhỏ khiến chi phí vận hành managed service không tương xứng — hãy đối chiếu với service đơn giản hơn cùng nhóm ở cuối trang.')+'</p></div>';
  /* Specs */
  var specs=gi.spec.slice(); if(core) specs=[['Nhóm',group],['Cấp độ học',LVL[lvl]],['Cloud',cloud==='aws'?'Amazon Web Services':'Google Cloud Platform']].concat(specs);
  h+='<div class="dsec"><h3>4 · Bảng thông số & cấu hình quan trọng</h3>'+(core?'':'<p style="border:1px dashed rgba(255,184,77,.6);border-radius:9px;padding:8px 12px"><b>Lưu ý:</b> bảng dưới đây là thông số/hướng dẫn chung cho nhóm '+E(group)+', không phải thông số riêng đã kiểm chứng của '+E(name)+' — đối chiếu trang giới hạn (limits) chính thức của service khi làm dự án thật.</p>')+'<div class="sub-scroll"><table class="spec">'+specs.map(function(r){return '<tr><th>'+E(r[0])+'</th><td>'+E(r[1])+'</td></tr>';}).join('')+'</table></div></div>';
  /* Steps */
  h+='<div class="dsec"><h3>5 · Hướng dẫn cấu hình từng bước</h3>'
    +'<details class="dstep" open><summary>Cách A · Trên Console (để hiểu kiến trúc)</summary><ol><li>Mở '+(cloud==='aws'?'AWS Management Console':'Google Cloud Console')+', tìm <b>'+E(name)+'</b>, chọn region Tokyo (ap-northeast-1 / asia-northeast1).</li><li>Tạo tài nguyên với tên theo quy ước <span class="mono">dự-án-môi-trường-vai-trò</span>, gắn tag/label Project & Env ngay từ đầu.</li><li>Đặt cấu hình mạng: chỉ private khi có thể, security group/firewall tối thiểu.</li><li>Gắn quyền bằng role/service account riêng — không dùng quyền quản trị.</li><li>Bật logging/monitoring, kiểm tra kết quả ở mục 7 rồi mới bàn giao.</li></ol></details>'
    +'<details class="dstep" open><summary>Cách B · Bằng '+(cloud==='aws'?'AWS CLI (CloudShell)':'gcloud (Cloud Shell)')+'</summary><div class="code-wrap"><pre class="code">'+E(cli)+'</pre></div></details>'
    +'<details class="dstep"><summary>Cách C · Bằng Terraform (chuẩn Architect)</summary><div class="code-wrap"><pre class="code">'+E(tfSnippet(cloud,name,group))+'</pre></div><p>Quy trình chuẩn: <span class="mono">plan</span> → duyệt diff → <span class="mono">apply</span> → commit state an toàn (remote backend). Xem thêm ở <a href="#/architect">Trang Architect</a>.</p></details></div>';
  /* Pricing */
  h+='<div class="dsec"><h3>6 · Mô hình giá & ví dụ tính tiền</h3><p>'+(core?E(core.pr):'Trả theo mức sử dụng thực tế của service (dung lượng / request / thời gian chạy tùy loại). Không có chi phí cố định nếu service serverless; service dạng instance/VM tính theo giờ cấu hình đã chọn.')+'</p><div class="lab-out"><b>Ví dụ tính tiền (minh hoạ, số giả sử để luyện cách tính):</b> Chi phí tháng ≈ (mức dùng cơ bản × đơn giá của region) + (lưu lượng truyền ra × đơn giá egress) + (log/lưu trữ phụ trợ). Ví dụ workload nhỏ chạy liên tục ở mức cơ bản thường rơi vào nhóm chi phí “vài USD–vài chục USD/tháng”, còn workload production multi-AZ thì nhân đôi phần hạ tầng dự phòng. Luôn thay đơn giá thật tại '+(cloud==='aws'?'AWS Pricing Calculator':'Google Cloud Pricing Calculator')+' trước khi báo見積もり cho khách.</div></div>';
  /* Limits + security + monitoring */
  h+='<div class="dsec"><h3>7 · Giới hạn / quota · Bảo mật · Giám sát</h3>'+(core?'':'<p style="border:1px dashed rgba(255,184,77,.6);border-radius:9px;padding:8px 12px"><b>Lưu ý:</b> các khuyến nghị bảo mật/giám sát ở mục này áp dụng chung cho nhóm '+E(group)+'; giới hạn riêng của từng service xem tại tài liệu chính thức.</p>')+'<h4>Giới hạn & điểm cần nhớ</h4><p>'+(core?E(core.lim):'Chịu quota mặc định theo tài khoản/project và theo region; một số giới hạn tăng được bằng ticket hỗ trợ, một số là giới hạn cứng của kiến trúc. Kiểm tra trang giới hạn chính thức của service trước khi thiết kế tải lớn.')+'</p><h4>Bảo mật — best practice</h4><ul>'+gi.sec.map(function(x){return '<li>'+E(x)+'</li>';}).join('')+'</ul><h4>Monitoring & logging</h4><ul>'+gi.mon.map(function(x){return '<li>'+E(x)+'</li>';}).join('')+'</ul></div>';
  /* Errors + compare */
  h+='<div class="dsec"><h3>8 · Lỗi thường gặp & so sánh với service dễ nhầm</h3><h4>Lỗi thường gặp — kèm cách sửa</h4><p>'+(core?E(core.err):'Cấu hình mạng/quyền sai là nguyên nhân số 1: kiểm tra theo thứ tự Route → Firewall/Security Group → IAM → Log của service. Lỗi thứ hai là quên dọn tài nguyên sau khi test khiến chi phí tăng lặng lẽ.')+'</p><h4>So sánh</h4><p>'+(core?E(core.vs):'Mở <a href="#/compare">Trang So sánh AWS ⇄ GCP</a> để xem service tương đương phía cloud còn lại, và xem các service cùng nhóm ở cuối trang này để phân biệt ranh giới sử dụng trong cùng một cloud.')+'</p></div>';
  /* Related + labs + FAQ */
  h+='<div class="dsec"><h3>9 · Service liên quan & lab liên quan</h3><div id="svcRelHost"></div>'
    +(relLabs.length?'<h4>Lab liên quan</h4><ul>'+relLabs.map(function(x){return '<li><a href="'+x[0]+'">'+E(x[1])+'</a></li>';}).join('')+'</ul>':'<p>Chưa có lab gắn trực tiếp service này — hãy làm các lab cùng nhóm ở <a href="#/labs">Trang Labs</a>.</p>')
    +'<h4>FAQ ngắn</h4>'
    +'<div class="faq-item"><b>'+E(name)+' có nằm trong Free Tier không?</b><p>Tùy thời điểm và region — nhiều service có mức miễn phí cho tài khoản mới hoặc mức dùng nhỏ. Kiểm tra trang Free Tier chính thức của '+(cloud==='aws'?'AWS':'Google Cloud')+' trước khi thực hành và luôn đặt cảnh báo ngân sách.</p></div>'
    +'<div class="faq-item"><b>Học '+E(name)+' ở mức nào là đủ?</b><p>Service cốt lõi (nhãn Chi tiết sâu ở danh mục) cần thuộc lòng cấu hình và lỗi thường gặp; service còn lại nắm “giải quyết bài toán gì, đặt ở đâu trong kiến trúc” là đủ, học sâu khi dự án cần.</p></div>'
    +'<div class="faq-item"><b>Dùng '+E(name)+' ở công ty Nhật cần lưu ý gì?</b><p>Ghi tham số vào パラメータシート, thao tác trên 本番環境 phải có 構築手順書 và kế hoạch 切り戻し (rollback). Ưu tiên region Tokyo để giảm độ trễ và đáp ứng yêu cầu cư trú dữ liệu.</p></div></div>';
  return h;
}
function wireSvcRel(cloud,group,name){
  var host=$('svcRelHost'); if(!host||typeof relatedHTML!=='function') return;
  host.innerHTML=relatedHTML(cloud,group,name);
  host.querySelectorAll('[data-rel]').forEach(function(b){
    b.addEventListener('click',function(){ location.hash='#/service/'+cloud+'/'+encodeURIComponent(b.getAttribute('data-rel')); });
  });
}
window.__openSvcDetail=function(cloud,name){
  $('svcDetailBody').innerHTML=svcDetailHTML(cloud,name);
  wireSvcRel(cloud,findSvc(cloud,name).group,name);
  showPage('svcDetail');
  if(window.__applyJA) window.__applyJA();
};
window.openSvc=function(cloud,name){ location.hash='#/service/'+cloud+'/'+encodeURIComponent(name); };

/* ================= LAB DETAIL PAGE ================= */
function sampleForStep(txt, cloud){
  var t=txt.replace(/<[^>]+>/g,' ').toLowerCase();
  function o(lines, read){ return {o:lines, r:read}; }
  if(/create-vpc|networks create/.test(t)) return o(['$ '+(cloud==='aws'?'aws ec2 create-vpc --cidr-block 10.0.0.0/16':'gcloud compute networks create prod-net --subnet-mode=custom'),'{','  "Vpc": { "VpcId": "vpc-0abc1234", "CidrBlock": "10.0.0.0/16", "State": "available" }','}  (GCP: Created [https://www.googleapis.com/compute/v1/projects/PROJECT/global/networks/prod-net].)'],'Tài nguyên được tạo thành công và ở trạng thái available — ghi lại ID (vpc-…) để dùng cho các bước sau.');
  if(/subnet/.test(t)) return o(['SubnetId: subnet-0a1b2c  CidrBlock: 10.0.1.0/24  AvailabilityZone: ap-northeast-1a  State: available'],'Subnet đã sẵn sàng trong đúng AZ/region đã chọn — đối chiếu CIDR với bảng quy hoạch trước khi đi tiếp.');
  if(/internet gateway|igw/.test(t)) return o(['InternetGatewayId: igw-0abc1234  Attachments: [{ VpcId: vpc-0abc1234, State: available }]'],'IGW đã gắn vào VPC. Chưa có route trỏ tới IGW thì subnet vẫn chưa ra internet được.');
  if(/nat/.test(t)) return o(['NatGatewayId: nat-0abc1234  State: available  PublicIp: 203.0.113.10'],'NAT Gateway cần vài phút để sang available. Route private trỏ 0.0.0.0/0 → nat-… là bước tiếp theo.');
  if(/create-function|functions deploy|lambda/.test(t)) return o(['FunctionName: api-fn  State: Active  LastUpdateStatus: Successful','Function ARN: arn:aws:lambda:ap-northeast-1:123456789012:function:api-fn'],'Function ở trạng thái Active/Successful nghĩa là deploy xong — kiểm tra log lần chạy đầu tiên ngay.');
  if(/run deploy|cloud run/.test(t)) return o(['Deploying new service... done.','Service [api-service] revision [api-service-00001] has been deployed and is serving 100 percent of traffic.','Service URL: https://api-service-xxxxx-an.a.run.app'],'Có URL service nghĩa là deploy thành công. Mở URL kiểm tra, 403/404 thường do quyền invoker hoặc route của app.');
  if(/create-db-instance|sql instances create|rds|cloud sql/.test(t)) return o(['DBInstanceStatus: available  Endpoint: prod-db.xxxxx.ap-northeast-1.rds.amazonaws.com:5432','(GCP) Operation done. instance: prod-db  state: RUNNABLE'],'Database cần 5–15 phút mới available/RUNNABLE. Chỉ kết nối được từ mạng riêng đã cấu hình.');
  if(/terraform|plan|apply/.test(t)) return o(['Plan: 12 to add, 0 to change, 0 to destroy.','Apply complete! Resources: 12 added, 0 changed, 0 destroyed.'],'Đọc kỹ Plan trước Apply: số tài nguyên add/destroy phải khớp thiết kế. Destroy ngoài dự kiến = dừng lại kiểm tra.');
  if(/eksctl|container clusters|gke|eks|kubectl/.test(t)) return o(['NAME           STATUS   ROLES    VERSION','node-10-0-1    Ready    <none>   v1.29','node-10-0-2    Ready    <none>   v1.29'],'Mọi node Ready nghĩa là cluster khỏe. Chưa Ready sau 10 phút thì kiểm tra sự kiện bằng kubectl describe node.');
  if(/s3 sync|storage rsync|upload|sync/.test(t)) return o(['upload: ./dist/index.html to s3://my-bucket/index.html','upload: ./dist/app.js to s3://my-bucket/app.js','Total: 2 files, 184 KB transferred'],'Số file và dung lượng khớp nguồn là đạt. Kiểm tra lại bằng lệnh ls ở đích.');
  if(/create-repository|ecr|artifact registry|docker push|builds submit/.test(t)) return o(['Pushed image asia-northeast1-docker.pkg.dev/PROJECT/repo/app:v1','Digest: sha256:9f2c…e41a  Tag: v1'],'Có digest sha256 nghĩa là image đã lên registry — dùng digest/tag này trong bước deploy.');
  if(/curl|test|kiểm chứng|kiểm tra/.test(t)) return o(['$ curl -s https://example-app.internal/health','{"status":"ok","version":"1.0.0"}  HTTP 200'],'Trả HTTP 200 và nội dung đúng kỳ vọng là bằng chứng bước này hoàn thành (エビデンス cho tài liệu kiểm chứng).');
  if(/alarm|dashboard|monitoring|cloudwatch/.test(t)) return o(['AlarmName: high-cpu  State: OK  Metric: CPUUtilization > 80% (2 datapoints)'],'Alarm ở trạng thái OK và có hành động gắn kèm (SNS/notification channel) mới coi là xong.');
  return o(['✓ Hoàn thành — tài nguyên trả về trạng thái thành công (available / RUNNABLE / Active).','Ghi lại ID/tên tài nguyên vừa tạo vào bảng tham số (パラメータシート) để dùng cho bước sau và cho cleanup.'],'Đối chiếu tên/ID/region của tài nguyên vừa tạo với thiết kế trước khi sang bước tiếp theo — sai region là lỗi hay gặp nhất.');
}
window.__labDone={};
function labStepsHTML(steps, cloud, keyPrefix){
  return steps.map(function(s,i){
    var sm=sampleForStep(s,cloud);
    return '<details class="dstep"'+(i===0?' open':'')+'><summary>Bước '+(i+1)+' · '+(cloud==='aws'?'AWS':'Google Cloud')+'</summary><p>'+s+'</p>'
      +'<div class="sample-out"><div class="so-head">● ● ●  kết quả mẫu mong đợi — expected output</div><pre>'+E(sm.o.join('\n'))+'</pre><div class="so-read"><b>Cách kiểm chứng:</b> '+E(sm.r)+'</div></div></details>';
  }).join('');
}
function labDetailHTML(kind, idx){
  var isMig = kind==='mig'; var l = isMig?MIGS[idx]:LABS[idx]; if(!l) return '<p>Không tìm thấy lab.</p>';
  var title=l.t, goal=isMig?('Di chuyển: '+l.from+' → '+l.to+' bằng '+l.tool):l.goal;
  var svcList=isMig?[l.tool,l.to]:(l.svc||[]);
  var key=(isMig?'mig':'lab')+idx;
  var h='<p class="crumb"><a href="'+(isMig?'#/migration':'#/labs')+'">← '+(isMig?'Trang Migration':'Trang Labs')+'</a></p>';
  h+='<div class="d-head"><div><span class="sub">'+(isMig?'Lab Migration':'Lab thực hành')+' · ⏱ '+E(l.time||'60 phút')+(isMig?'':' · Mức độ: '+LVLLAB[l.lv])+'</span><h2>'+E(title)+'</h2></div></div>';
  h+='<div class="dsec"><h3>1 · Mục tiêu & kết quả đạt được</h3><p><b>Mục tiêu:</b> '+E(goal)+'</p><p><b>Kết quả cần đạt:</b> '+E(l.out||l.note)+'</p>'
    +'<div class="flow-mini">'+svcList.map(function(n,i){ return (i?'<span class="fa">➜</span>':'')+'<span class="fn">'+iconOf(n,22)+' '+E(n)+'</span>'; }).join('')+'</div>'
    +'<p style="margin-top:8px">Sơ đồ kiến trúc của lab: các service ở trên nối theo chiều mũi tên — làm xong mỗi bước, đối chiếu trạng thái thật với sơ đồ này.</p></div>';
  h+='<div class="dsec"><h3>2 · Điều kiện chuẩn bị</h3><ul>'
    +'<li><b>Tài khoản:</b> tài khoản AWS sandbox/Free Tier và Google Cloud project riêng cho học tập — không dùng tài khoản production.</li>'
    +'<li><b>Quyền:</b> quyền quản trị giới hạn trong phạm vi lab (AdministratorAccess ở sandbox AWS / roles/owner ở project học tập GCP), tắt sau khi học.</li>'
    +'<li><b>Công cụ:</b> trình duyệt mở sẵn AWS CloudShell và Google Cloud Shell (đã có sẵn aws CLI, gcloud, Terraform, kubectl).</li>'
    +'<li><b>Chi phí ước tính:</b> phần lớn lab ở mức Free Tier hoặc vài USD nếu dọn dẹp ngay; khoản dễ phát sinh nhất là NAT Gateway, database và load balancer chạy qua đêm.</li>'
    +'<li><b>Thời gian:</b> '+E(l.time||'60 phút')+' — cộng thêm 15 phút cho cleanup và ghi chép.</li></ul></div>';
  if(isMig){
    h+='<div class="dsec"><h3>3 · Các bước thực hiện</h3>'+l.steps.map(function(s,i){ var sm=sampleForStep(s,'aws'); return '<details class="dstep"'+(i===0?' open':'')+'><summary>Bước '+(i+1)+'</summary><p>'+E(s)+'</p><div class="sample-out"><div class="so-head">● ● ●  kết quả mẫu mong đợi</div><pre>'+E(sm.o.join('\n'))+'</pre><div class="so-read"><b>Cách kiểm chứng:</b> '+E(sm.r)+'</div></div></details>'; }).join('')+'</div>';
  } else {
    h+='<div class="dsec"><h3>3 · Các bước thực hiện — song song AWS ⇄ GCP</h3><h4>Phía AWS · aws CLI</h4>'+labStepsHTML(l.aws,'aws',key+'a')+'<h4>Phía Google Cloud · gcloud CLI</h4>'+labStepsHTML(l.gcp,'gcp',key+'g')+'</div>';
  }
  h+='<div class="dsec"><h3>4 · Lỗi hay gặp trong lab & cách xử lý</h3><ul>'
    +'<li><b>AccessDenied / PERMISSION_DENIED:</b> kiểm tra danh tính trước (<span class="mono">aws sts get-caller-identity</span> / <span class="mono">gcloud config get-value project</span>), rồi mới tới policy — sai project/region chiếm đa số ca.</li>'
    +'<li><b>Tạo tài nguyên “thành công” nhưng không kết nối được:</b> đi theo gói tin Route → Security Group/Firewall → NACL → DNS, đúng quy trình ở <a href="#/networking">Trang Networking</a>.</li>'
    +'<li><b>Lệnh chờ rất lâu / timeout:</b> database và cluster cần 5–15 phút; đừng huỷ giữa chừng — kiểm tra trạng thái bằng lệnh describe/list.</li>'
    +'<li><b>Chi phí tăng sau lab:</b> gần như luôn do quên NAT Gateway, DB hoặc LB — làm ngay mục 5.</li></ul></div>';
  h+='<div class="dsec"><h3>5 · Dọn dẹp tài nguyên (cleanup) — bắt buộc</h3><ol>'
    +'<li>Xoá tài nguyên tính tiền theo giờ trước: NAT Gateway, Load Balancer, database, cluster.</li>'
    +'<li>Xoá compute (VM/instance, function, service) và image/snapshot không còn dùng.</li>'
    +'<li>Xoá mạng theo thứ tự ngược lúc tạo: subnet → route table → VPC/network cuối cùng.</li>'
    +'<li>Kiểm tra lại bằng lệnh list của cả hai cloud và mục Billing: không còn tài nguyên lạ của lab này.</li></ol>'
    +'<h4>Checklist tự đánh dấu hoàn thành</h4><ul class="check-list" data-labkey="'+key+'">'
    +['Hoàn thành đủ các bước phía AWS','Hoàn thành đủ các bước phía '+(isMig?'cloud đích':'Google Cloud'),'Đối chiếu kết quả thật với từng khung “kết quả mẫu”','Đã xử lý/hiểu rõ các lỗi gặp trong lúc làm','Đã cleanup toàn bộ tài nguyên và kiểm tra Billing'].map(function(c,i){ return '<li><input type="checkbox" data-ck="'+key+'-'+i+'" '+(window.__labDone[key+'-'+i]?'checked':'')+' /><span>'+c+'</span></li>'; }).join('')+'</ul>'
    +'<p style="font-size:13px;color:var(--muted)">Checklist chỉ giữ trong phiên học hiện tại để bạn tự theo dõi tiến độ.</p></div>';
  return h;
}
window.__openLabDetail=function(kind,idx){
  $('labDetailBody').innerHTML=labDetailHTML(kind,idx);
  $('labDetailBody').querySelectorAll('input[type=checkbox][data-ck]').forEach(function(cb){
    cb.addEventListener('change',function(){ window.__labDone[cb.getAttribute('data-ck')]=cb.checked; cb.closest('li').classList.toggle('done',cb.checked); });
    if(cb.checked) cb.closest('li').classList.add('done');
  });
  showPage('labDetail');
  if(window.__applyJA) window.__applyJA();
};
/* Add detail buttons into lab / migration cards */
function filteredLabIdx(){
  var dom=$('labFilter')?$('labFilter').value:'all', lv=$('labLevel')?$('labLevel').value:'all', out=[];
  LABS.forEach(function(l,i){ if(dom!=='all'&&l.dom!==dom) return; if(lv!=='all'&&LVLLAB[l.lv]!==lv) return; out.push(i); });
  return out;
}
/* Xuất ra window để upgrade2.js (nạp sau, ngoài IIFE này) ánh xạ đúng
   chỉ số lab gốc khi gắn nhãn chi phí / nút đã-xong lên thẻ đã lọc.
   Trước đây hàm chỉ nằm trong IIFE nên bên ngoài không gọi được. */
window.__filteredLabIdx = filteredLabIdx;
window.filteredLabIdx = filteredLabIdx;
function decorateCards(){
  var lg=$('labGrid');
  if(lg){ var idxs=filteredLabIdx(); lg.querySelectorAll('.lab-card').forEach(function(card,pos){ if(card.querySelector('.lab-detail-btn')) return; var a=document.createElement('a'); a.className='lab-detail-btn'; a.href='#/lab/'+(idxs[pos]!==undefined?idxs[pos]:pos); a.textContent='Mở trang chi tiết lab →'; card.appendChild(a); }); }
  var mg=$('migGrid');
  if(mg){ mg.querySelectorAll('.lab-card').forEach(function(card,pos){ if(card.querySelector('.lab-detail-btn')) return; var a=document.createElement('a'); a.className='lab-detail-btn'; a.href='#/miglab/'+pos; a.textContent='Mở trang chi tiết lab →'; card.appendChild(a); }); }
}
new MutationObserver(function(){ decorateCards(); }).observe(document.querySelector('main'),{childList:true,subtree:true});
decorateCards();

/* ================= COMMAND — SAMPLE OUTPUTS ================= */
var EXOUT=[
 {o:'total 48\ndrwxr-xr-x  5 user user 4096 Nov  3 09:12 .\ndrwxr-xr-x 20 user user 4096 Nov  3 08:40 ..\n-rw-------  1 user user  212 Nov  2 21:03 .bash_history\ndrwxr-xr-x  2 user user 4096 Nov  3 09:12 project\n-rw-r--r--  1 user user  845 Nov  3 09:10 app.log',r:'Cột đầu là quyền (d = thư mục), tiếp theo là chủ sở hữu, dung lượng (byte) và ngày sửa. File bắt đầu bằng dấu chấm là file ẩn — chỉ hiện nhờ cờ -a.',rj:'先頭列が権限（dはディレクトリ）、続いて所有者、サイズ（バイト）、更新日時です。ドットで始まる隠しファイルは -a で表示されます。'},
 {o:'Filesystem      Size  Used Avail Use% Mounted on\n/dev/root        29G   24G  5.4G  82% /\ntmpfs           2.0G     0  2.0G   0% /dev/shm\n/dev/sdb1       100G   61G   39G  62% /data',r:'Cột Use% cho biết phân vùng nào sắp đầy; Mounted on là điểm gắn. Ở ví dụ này phân vùng gốc / đã dùng 82% — cần theo dõi.',rj:'Use% 列で満杯に近いパーティションが分かります。この例ではルート / が82%使用済みです。'},
 {o:'(lệnh chạy im lặng — không có output nghĩa là thành công)\n$ ls project/\ndocs  src',r:'mkdir thành công thường không in gì. Kiểm chứng bằng ls: thấy đủ src và docs là đạt.',rj:'mkdir は成功時に何も出力しません。ls で src と docs が見えれば完了です。'},
 {o:'(không có output — thành công)\n$ ls -l deploy.sh\n-rwxr-x--- 1 user user 512 Nov  3 09:20 deploy.sh',r:'Chuỗi -rwxr-x--- xác nhận đúng 750: owner rwx, group r-x, others không quyền.',rj:'-rwxr-x--- が 750 の確認です：所有者 rwx、グループ r-x、その他は権限なし。'},
 {o:'State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      4096   0.0.0.0:22          0.0.0.0:*  users:(("sshd",pid=812,fd=3))\nLISTEN 0      511    0.0.0.0:80          0.0.0.0:*  users:(("nginx",pid=1044,fd=6))\nLISTEN 0      511    [::]:80             [::]:*     users:(("nginx",pid=1044,fd=7))',r:'Mỗi dòng LISTEN là một cổng đang chờ kết nối; cột Process cho biết tiến trình nào chiếm cổng (cần sudo mới thấy của mọi user).',rj:'LISTEN の行が待受ポートです。Process 列で使用中プロセスが分かります。'},
 {o:'$ grep -c "ERROR" app.log\n137',r:'Output chỉ là một con số: 137 dòng chứa ERROR. Số này tự nó chưa nói lỗi gì — bước tiếp theo là grep ERROR app.log | tail để xem nội dung.',rj:'出力は数字のみ：ERROR を含む行が137行あります。次は内容確認です。'},
 {o:'2026/11/03 09:41:02 [error] 1044#1044: connect() failed (111: Connection refused) while connecting to upstream\n2026/11/03 09:41:05 [notice] 1044#1044: signal process started\n... (log mới tiếp tục chạy theo thời gian thực, Ctrl+C để thoát)',r:'tail -f giữ màn hình mở: dòng mới tự trôi vào. Đây là màn hình bạn nhìn trong lúc tái hiện lỗi để bắt đúng dòng error.',rj:'tail -f では新しい行が流れ続けます。エラー再現中に見る画面です。'},
 {o:'{\n    "UserId": "AIDACKCEVSQ6C2EXAMPLE",\n    "Account": "123456789012",\n    "Arn": "arn:aws:iam::123456789012:user/dev-taro"\n}',r:'Đọc 3 trường: Account = số tài khoản AWS, Arn = danh tính đầy đủ (user hay role), UserId = mã định danh. Mọi lỗi quyền đều bắt đầu bằng việc đối chiếu Arn này.',rj:'Account はAWSアカウント番号、Arn は完全な身份、UserId は識別子です。権限エラーはまず Arn の確認から。'},
 {o:'2025-10-21 14:03:11 my-data-lake\n2025-11-01 09:44:52 my-web-assets\n2026-01-15 18:22:07 backup-archive',r:'Mỗi dòng: ngày giờ tạo bucket + tên bucket. Không có bucket nào hiện ra nghĩa là tài khoản chưa có bucket ở mọi region.',rj:'各行は作成日時とバケット名です。'},
 {o:'upload: ./dist/index.html to s3://my-bucket/index.html\nupload: ./dist/assets/app.js to s3://my-bucket/assets/app.js\nupload: ./dist/assets/style.css to s3://my-bucket/assets/style.css',r:'Chỉ file thay đổi mới xuất hiện trong output — file không đổi bị bỏ qua lặng lẽ. Chạy lại lần hai ngay lập tức thường cho output trống.',rj:'変更されたファイルだけが表示されます。再実行で出力が空なら同期済みです。'},
 {o:'--------------------------\n|      DescribeInstances     |\n+----------------------------+\n|  i-0a1b2c3d4e5f67890       |\n|  i-0f9e8d7c6b5a43210       |\n+----------------------------+',r:'Dạng table vẽ khung ASCII với duy nhất cột InstanceId — nhờ --query đã lọc bỏ toàn bộ trường thừa của JSON gốc.',rj:'--query で絞ったため InstanceId 列だけの表になっています。'},
 {o:'https://my-bucket.s3.ap-northeast-1.amazonaws.com/file.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Expires=3600&X-Amz-Signature=9f2c...',r:'Toàn bộ output là một URL dài chứa chữ ký và thời hạn (X-Amz-Expires=3600 giây). Gửi URL này cho người nhận; hết hạn là tự vô hiệu.',rj:'出力全体が署名付きURLです。X-Amz-Expires=3600 が有効期間（秒）です。'},
 {o:'my-cloud-project',r:'Output chỉ một dòng: project ID đang hiệu lực. Mọi lệnh gcloud sau đó đều chạy trong project này nếu không chỉ định khác.',rj:'出力は1行：有効なプロジェクトIDです。'},
 {o:'NAME     ZONE               MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP     STATUS\nweb-1    asia-northeast1-a  e2-medium                  10.128.0.2   34.146.10.21    RUNNING\ndb-1     asia-northeast1-c  e2-standard-2              10.128.0.5                   RUNNING',r:'Bảng gồm tên VM, zone, loại máy, IP trong/ngoài và trạng thái. db-1 không có EXTERNAL_IP nghĩa là máy chỉ có IP nội bộ — đúng thiết kế private.',rj:'VM名、ゾーン、マシンタイプ、内部/外部IP、状態の表です。外部IPが空ならプライベート構成です。'},
 {o:'gs://my-data-lake/\ngs://my-web-assets/\ngs://backup-archive/',r:'Mỗi dòng một bucket với tiền tố gs:// — dùng nguyên dạng gs://tên-bucket làm đích cho các lệnh cp/rsync.',rj:'各行が gs:// 形式のバケットです。'},
 {o:'Fetching cluster endpoint and auth data.\nkubeconfig entry generated for prod.\n$ kubectl get nodes\nNAME                    STATUS   ROLES    AGE   VERSION\nnode-pool-1-a1b2        Ready    <none>   12d   v1.29',r:'Dòng “kubeconfig entry generated” là dấu hiệu thành công. Kiểm chứng ngay bằng kubectl get nodes — node Ready là cluster sẵn sàng.',rj:'kubeconfig entry generated が成功の印です。kubectl get nodes で確認します。'},
 {o:'Copying file://file.zip [Content-Type=application/octet-stream]...\n/ [1 files][  2.3 MiB/  2.3 MiB]',r:'Thanh tiến trình cho thấy dung lượng đã tải / tổng dung lượng; đạt 100% và quay về dấu nhắc là xong. Sao chép thư mục thì thêm cờ đệ quy, hoặc dùng rsync của gcloud storage.',rj:'進捗表示が 100% になれば完了です。'},
 {o:'$ df -h\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/root        29G   29G     0 100% /\n$ du -sh /var/log\n8.4G    /var/log',r:'Đây là output chẩn đoán của đáp án đúng: df xác nhận / đầy 100%, du chỉ ra /var/log chiếm 8.4G — thủ phạm là log, xử lý log trước, không reboot.',rj:'df で / が100%、du で /var/log が8.4G と判明。原因はログです。'},
 {o:'$ systemctl status nginx\n● nginx.service - A high performance web server\n   Active: failed (Result: exit-code) since Tue 2026-11-03 09:12:44 JST\n$ journalctl -u nginx -n 20\nnginx: [emerg] bind() to 0.0.0.0:443 failed (98: Address already in use)',r:'status cho biết service failed; journal chỉ rõ nguyên nhân: cổng 443 đã bị tiến trình khác chiếm. Đọc được dòng emerg này mới quyết định cách sửa.',rj:'status で failed、journal で原因（443ポート使用中）が分かります。'},
 {o:'$ kubectl get pods\nNAME                    READY   STATUS             RESTARTS   AGE\napi-7d9f8b6c5-x2abc     0/1     CrashLoopBackOff   7          18m\n$ kubectl logs api-7d9f8b6c5-x2abc --previous\nError: required env var DATABASE_URL is not set',r:'Log của container vừa crash nói thẳng nguyên nhân: thiếu biến môi trường DATABASE_URL ở bản deploy mới. Sửa config/secret rồi rollout lại.',rj:'前回コンテナのログで原因（DATABASE_URL 未設定）が判明します。'},
 {o:'$ aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-0abc\nRouteTable: rtb-0def — Routes: [ 10.0.0.0/16 → local ]   ← THIẾU route 0.0.0.0/0 → NAT\nSecurity Group outbound: tcp 443 → 0.0.0.0/0  ✓\nDNS: app.internal resolves to 10.0.11.25  ✓',r:'Output chẩn đoán cho thấy route table private chưa có đường ra NAT — đúng điểm nghẽn đầu tiên trong chuỗi Route → NAT → SG → NACL → DNS.',rj:'プライベートルートテーブルに NAT への経路がないことが判明します。'}
];
var exOutEl=document.createElement('div'); exOutEl.className='sample-out'; exOutEl.id='exOut'; exOutEl.style.marginTop='14px'; exOutEl.hidden=true;
var fbEl=$('exFeedback'); fbEl.parentNode.insertBefore(exOutEl, fbEl.nextSibling);
var lastSig='';
function renderExOut(){
  var e=(typeof curEx==='function')?curEx():null; if(!e) return;
  var idx=EX.indexOf(e); var rec=EXOUT[idx]; if(!rec) { exOutEl.hidden=true; return; }
  var ja=(window.LANG==='ja');
  exOutEl.innerHTML='<div class="so-head">● ● ●  '+(ja?'サンプル出力 — Kết quả mẫu (output)':'kết quả mẫu (output) — khi chạy lệnh đúng trên shell thật')+'</div><pre>'+E(rec.o)+'</pre><div class="so-read"><b>'+(ja?'読み方：':'Cách đọc output: ')+'</b>'+E(rec.r)+(rec.rj?'<br /><span style="color:#8fd8ef">'+E(rec.rj)+'</span>':'')+'</div>';
  exOutEl.hidden=false;
}
new MutationObserver(function(){
  var fb=$('exFeedback'); if(!fb) return;
  var sig=fb.innerHTML+'|'+fb.hidden;
  if(sig===lastSig) return; lastSig=sig;
  if(!fb.hidden && /(Chính xác|Đáp án|Đúng quy trình|phương án|正解|答え)/.test(fb.textContent)) renderExOut();
  else if(fb.hidden) exOutEl.hidden=true;
}).observe(fbEl,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
new MutationObserver(function(){ exOutEl.hidden=true; lastSig=''; }).observe($('exPrompt'),{childList:true,characterData:true,subtree:true});

/* ================= ROUTER ================= */
function parseRoute(){
  var h=location.hash||'#/';
  var m;
  if(h==='#/'||h===''||h==='#top'||h==='#') return {page:'home'};
  if((m=h.match(/^#\/service\/(aws|gcp)\/(.+)$/))) return {page:'svcDetail',cloud:m[1],name:decodeURIComponent(m[2])};
  if((m=h.match(/^#\/lab\/(\d+)$/))) return {page:'labDetail',kind:'lab',idx:+m[1]};
  if((m=h.match(/^#\/miglab\/(\d+)$/))) return {page:'labDetail',kind:'mig',idx:+m[1]};
  if((m=h.match(/^#\/(services|labs|migration|networking|architect|command|compare|glossary|diagrams|flow)$/))) return {page:m[1]};
  if((m=h.match(/^#\/(diagrams|du-an|deploy)$/))) return {page: m[1]==='deploy'?'glossary':(m[1]==='du-an'?'architect':'networking')};
  return {page:'home'};
}
function applyRoute(){
  var r=parseRoute();
  if(r.page==='svcDetail'){ window.__openSvcDetail(r.cloud,r.name); return; }
  if(r.page==='labDetail'){ window.__openLabDetail(r.kind,r.idx); return; }
  if(r.page==='compare'){
    showPage('compare');
    if(state.cloud!=='cmp'){ /* render compare table on demand */ try{ renderCompare(); }catch(e){} var cv=$('cmpView'); if(cv) cv.hidden=false; }
    if(window.__applyJA) window.__applyJA();
    return;
  }
  showPage(r.page);
}
window.addEventListener('hashchange',applyRoute);
/* Compare tab inside services -> go to compare page */
document.querySelectorAll('.ctab').forEach(function(t){
  t.addEventListener('click',function(ev){ if(t.getAttribute('data-cloud')==='cmp'){ ev.preventDefault(); ev.stopPropagation(); location.hash='#/compare'; } },true);
});
/* Old in-page anchor links in body content -> routes */
var ANCH={'#services':'#/services','#labs':'#/labs','#migration':'#/migration','#diagrams':'#/diagrams','#networking':'#/networking','#du-an':'#/architect','#architect':'#/architect','#command':'#/command','#glossary':'#/glossary','#deploy':'#/glossary','#top':'#/'};
document.querySelectorAll('main a[href^="#"], header.hero a[href^="#"]').forEach(function(a){
  var href=a.getAttribute('href'); if(ANCH[href]) a.setAttribute('href',ANCH[href]);
});
applyRoute();
})();


/* V3 · ENGINE THƯ VIỆN SƠ ĐỒ */
(function(){
"use strict";
var GRPS={A:'A · Dự án nhỏ — nền tảng',B:'B · Dự án vừa & lớn',C:'C · Migration',D:'D · Networking',
 Aj:'A · 小規模プロジェクト（基礎）',Bj:'B · 中〜大規模プロジェクト',Cj:'C · 移行（マイグレーション）',Dj:'D · ネットワーキング'};
var state={grp:'all',q:'',cloud:{}};
DG.forEach(function(d){ state.cloud[d.id]=(d.cloud==='gcp')?'gcp':'aws'; if(d.cloud==='multi') state.cloud[d.id]='multi'; });

var page=document.createElement('section'); page.id='archLibPage'; page.className='page-off';
document.querySelector('main').appendChild(page);

/* hub card on home */
var hubGrid=document.querySelector('.hub-grid');
if(hubGrid){ var a=document.createElement('a'); a.className='hub-card'; a.href='#/diagrams';
 a.innerHTML='<span class="hub-ic">🗺️</span><b>Thư viện Sơ đồ Architect</b><p>25 sơ đồ tự vẽ bằng SVG: dự án nhỏ → lớn, migration, networking — bản AWS & GCP, bấm từng node để xem giải thích, có phóng to và tải xuống.</p>';
 hubGrid.appendChild(a); }

function curVar(d){
  var k=state.cloud[d.id];
  if(d.variants[k]) return {key:k,v:d.variants[k]};
  var first=Object.keys(d.variants)[0]; return {key:first,v:d.variants[first]};
}
function svcExists(cloud,name){ try{ return !!NAME2I[name]; }catch(e){ return false; } }
function svcDesc(cloud,name){
  try{
    var f=findSvc(cloud,name);
    if(f.core) return f.core.d;
    if(f.item) return f.item[2]||'';
  }catch(e){}
  return '';
}
function stageHTML(d,zoom){
  var cv=curVar(d), nodes=cv.v.nodes, edges=cv.v.edges;
  var H=d.feat?640:560, W=1080;
  var paths='',packets='';
  edges.forEach(function(e,i){
    var a=nodes[e[0]],b=nodes[e[1]]; if(!a||!b) return;
    var id='w-'+d.id+'-'+cv.key+'-'+i+(zoom?'z':'');
    var mx=(a.x+b.x)/2, my=(a.y+b.y)/2, bend=(Math.abs(a.y-b.y)>40&&Math.abs(a.x-b.x)>40)?' Q '+mx+' '+a.y:' L';
    var dstr='M'+a.x+','+a.y+(bend===' L'?' L'+b.x+','+b.y:' Q '+((a.x+b.x)/2)+','+a.y+' '+b.x+','+b.y);
    paths+='<path id="'+id+'" d="'+dstr+'" stroke="#5b7ba6" stroke-width="2" fill="none" class="flow-line" marker-end="url(#dgAh)"/>';
    packets+='<circle r="4.5" fill="'+(i%2?'#2dd4bf':'#ff9900')+'" class="packet"><animateMotion dur="'+(2.4+(i%3)*0.7)+'s" begin="'+(i*0.45)+'s" repeatCount="indefinite"><mpath href="#'+id+'"/></animateMotion></circle>';
  });
  var svg='<svg class="wires" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="dgAh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7f93ad"/></marker></defs>'+paths+packets+'</svg>';
  var nh='';
  nodes.forEach(function(n,i){
    var left=(n.x/W*100).toFixed(2)+'%', top=(n.y/H*100).toFixed(2)+'%';
    var inner=n.actor?'<span class="actor-ic">'+n.actor+'</span>':iconOf(n.s,30);
    nh+='<button type="button" class="dg-node'+(n.actor?' actor':'')+'" data-dg="'+d.id+'" data-node="'+i+'" style="left:'+left+';top:'+top+'" aria-label="'+escS(n.l)+'">'
      +(n.num?'<span class="num">'+n.num+'</span>':'')+inner+'<span class="nl">'+escS(n.l)+'</span>'
      +((n.u||n.uj)?'<span class="nu">'+escS(L(n.u,n.uj))+'</span>':'')+'</button>';
  });
  return '<div class="dg-stage-wrap"><div class="dg-stage" style="aspect-ratio:'+W+'/'+H+'">'+svg+nh+'</div></div>';
}
function stepsHTML(d){
  var cv=curVar(d); var numbered=cv.v.nodes.filter(function(n){return n.num>0;}).slice().sort(function(a,b){return a.num-b.num;});
  if(!numbered.length) numbered=cv.v.nodes;
  return '<ol class="dg-steps">'+numbered.map(function(n){ return '<li><b>'+escS(n.l)+'</b>'+(n.u?' — '+escS(L(n.u,n.uj)):'')+'</li>'; }).join('')+'</ol>';
}
function cardHTML(d){
  var ja=window.LANG==='ja';
  var h='<article class="dg-card'+(d.feat?' feat':'')+'" id="dg-'+d.id+'">';
  h+='<div class="dg-top"><span class="dg-badge">'+(d.feat?(ja?'特集・描き直し':'Nổi bật · Vẽ lại'):(ja?'図':'Sơ đồ'))+'</span>'
    +'<span class="dg-badge grp">'+escS(L(GRPS[d.grp],GRPS[d.grp+'j']))+'</span>'
    +'<span class="dg-badge grp">'+(d.cloud==='both'?'AWS ⇄ GCP':(d.cloud==='multi'?'AWS + GCP':(d.cloud==='gcp'?'Google Cloud':'AWS')))+'</span></div>';
  h+='<h3>'+escS(L(d.t,d.tj))+'</h3><p class="dg-prob">'+escS(L(d.prob,d.probj))+'</p>';
  h+=stageHTML(d,false);
  h+='<div class="dg-tools">';
  if(d.cloud==='both'){ var cur=state.cloud[d.id];
    h+='<button type="button" class="chip'+(cur==='aws'?' on':'')+'" data-tgl="'+d.id+':aws">AWS</button><button type="button" class="chip'+(cur==='gcp'?' on':'')+'" data-tgl="'+d.id+':gcp">Google Cloud</button>'; }
  h+='<button type="button" class="dg-btn" data-zoom="'+d.id+'">🔍 '+(ja?'拡大':'Phóng to')+'</button>'
    +'<button type="button" class="dg-btn" data-dl="svg:'+d.id+'">⬇ SVG</button>'
    +'<button type="button" class="dg-btn" data-dl="png:'+d.id+'">⬇ PNG</button></div>';
  h+='<div class="dg-info" id="dginfo-'+d.id+'"></div>';
  h+='<h4 style="margin:16px 0 2px;font-size:14.5px;color:var(--orange-d)">'+(ja?'図の読み方（番号順）':'Đọc sơ đồ theo bước')+'</h4>'+stepsHTML(d);
  h+='<div class="dg-meta"><div><b>'+(ja?'なぜこの構成か':'Vì sao chọn kiến trúc này')+'</b>'+escS(L(d.why,d.whyj))+'</div>'
    +'<div><b>'+(ja?'実務・面接での要点':'Điểm cần nhớ khi thiết kế thật / phỏng vấn')+'</b>'+escS(L(d.rem,d.remj))+'</div></div>';
  if(d.lab) h+='<p class="dg-lab">🧪 '+(ja?'関連ラボ：':'Lab liên quan: ')+escS(d.lab)+' → <a href="#/labs">'+(ja?'ラボページへ':'mở trang Labs')+'</a></p>';
  if(d.feat) h+='<p class="dg-note">'+(ja?'注記：この図はAWSが公開したリファレンスアーキテクチャをもとに学習用に描き直したものです。':'Ghi chú: sơ đồ được vẽ lại để học tập dựa trên kiến trúc tham chiếu công bố của AWS.')+'</p>';
  h+='</article>';
  return h;
}
function renderLib(){
  var ja=window.LANG==='ja';
  var list=DG.filter(function(d){
    if(state.grp!=='all'&&d.grp!==state.grp) return false;
    if(state.q){ var q=state.q.toLowerCase(); if((d.t+' '+d.tj).toLowerCase().indexOf(q)===-1) return false; }
    return true;
  });
  var h='<div class="wrap"><div class="sec-head"><span class="sec-tag">'+(ja?'アーキテクチャ図ライブラリ':'Thư viện sơ đồ')+'</span>'
   +'<h2>'+(ja?'アーキテクト図ライブラリ — 小規模から大規模、移行、ネットワークまで':'Thư viện Sơ đồ Architect — dự án nhỏ đến lớn, migration, networking')+'</h2>'
   +'<p>'+(ja?'全ての図はこのサイトが自作したSVGです（外部画像ではありません）。データの流れがアニメーションし、各ノードをクリックすると説明とサービス詳細へのリンクが出ます。多くの図にはAWS版とGCP版の切替があります。':'Mọi sơ đồ đều do trang tự vẽ bằng SVG (không dùng ảnh ngoài): luồng dữ liệu chạy động, bấm vào từng node để xem giải thích và mở trang chi tiết service. Nhiều sơ đồ có nút chuyển AWS ⇄ GCP cho cùng một bài toán.')+'</p></div>'
   +'<div class="svc-search"><input id="dgSearch" type="search" placeholder="'+(ja?'図を検索… 例：RAG、移行、VPC':'Tìm sơ đồ… vd: RAG, migration, VPC, streaming')+'" value="'+escS(state.q)+'" aria-label="Tìm sơ đồ" /></div>'
   +'<div class="dg-filters">'
   +[['all',ja?'全て':'Tất cả'],['A',L(GRPS.A,GRPS.Aj)],['B',L(GRPS.B,GRPS.Bj)],['C',L(GRPS.C,GRPS.Cj)],['D',L(GRPS.D,GRPS.Dj)]].map(function(x){
      return '<button type="button" class="chip'+(state.grp===x[0]?' on':'')+'" data-grp="'+x[0]+'">'+escS(x[1])+'</button>'; }).join('')
   +'</div><div id="dgList">'
   +(list.length?list.map(cardHTML).join(''):'<p class="empty-note">'+(ja?'該当する図がありません。':'Không có sơ đồ nào khớp bộ lọc.')+'</p>')
   +'</div></div>';
  page.innerHTML=h; wireLib();
}
function wireLib(){
  page.querySelectorAll('[data-grp]').forEach(function(b){ b.addEventListener('click',function(){ state.grp=b.getAttribute('data-grp'); renderLib(); }); });
  var si=document.getElementById('dgSearch');
  if(si) si.addEventListener('input',function(){ state.q=si.value; var pos=si.selectionStart; renderLib(); var n=document.getElementById('dgSearch'); if(n){ n.focus(); try{n.setSelectionRange(pos,pos);}catch(e){} } });
  page.querySelectorAll('[data-tgl]').forEach(function(b){ b.addEventListener('click',function(){ var p=b.getAttribute('data-tgl').split(':'); state.cloud[p[0]]=p[1]; renderLib(); var el=document.getElementById('dg-'+p[0]); if(el) el.scrollIntoView({block:'start'}); }); });
  page.querySelectorAll('[data-zoom]').forEach(function(b){ b.addEventListener('click',function(){ openZoom(b.getAttribute('data-zoom')); }); });
  page.querySelectorAll('[data-dl]').forEach(function(b){ b.addEventListener('click',function(){ var p=b.getAttribute('data-dl').split(':'); downloadDiagram(p[0],p[1]); }); });
  page.querySelectorAll('.dg-node').forEach(function(b){ b.addEventListener('click',function(){ showNodeInfo(b.getAttribute('data-dg'),+b.getAttribute('data-node'),b); }); });
}
function showNodeInfo(did,idx,btn){
  var d=DG.filter(function(x){return x.id===did;})[0]; if(!d) return;
  var cv=curVar(d), n=cv.v.nodes[idx]; if(!n) return;
  var box=document.getElementById('dginfo-'+did); if(!box) return;
  page.querySelectorAll('.dg-node.sel').forEach(function(x){x.classList.remove('sel');}); if(btn) btn.classList.add('sel');
  var ja=window.LANG==='ja';
  var h='<b>'+escS(n.l)+'</b>';
  if(n.s){ var desc=svcDesc(n.c,n.s); if(desc) h+='<br>'+escS(desc); }
  else if(n.u){ h+='<br>'+escS(L(n.u,n.uj)); }
  if(n.s&&svcExists(n.c,n.s)) h+='<br><a class="go" href="#/service/'+n.c+'/'+encodeURIComponent(n.s)+'">'+(ja?'サービス詳細を開く →':'Mở trang chi tiết service →')+'</a>';
  else if(n.s) h+='<br><span style="font-size:12.5px;color:var(--muted)">'+escS(n.s)+'</span>';
  box.innerHTML=h; box.classList.add('show');
}
/* ---- Zoom ---- */
var zbk=document.createElement('div'); zbk.className='dg-zoom-bk';
zbk.innerHTML='<div class="dg-zoom-box"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b id="dgZoomTitle" style="color:#fff;font-size:17px"></b><button type="button" class="dg-btn" id="dgZoomClose">✕ Đóng / 閉じる</button></div><div id="dgZoomBody"></div></div>';
document.body.appendChild(zbk);
function openZoom(did){
  var d=DG.filter(function(x){return x.id===did;})[0]; if(!d) return;
  document.getElementById('dgZoomTitle').textContent=L(d.t,d.tj);
  document.getElementById('dgZoomBody').innerHTML=stageHTML(d,true);
  zbk.querySelectorAll('.dg-node').forEach(function(b){ b.addEventListener('click',function(){ zbk.classList.remove('open'); showNodeInfo(did,+b.getAttribute('data-node'),null); var el=document.getElementById('dg-'+did); if(el) el.scrollIntoView(); }); });
  zbk.classList.add('open');
}
document.getElementById('dgZoomClose').addEventListener('click',function(){ zbk.classList.remove('open'); });
zbk.addEventListener('click',function(e){ if(e.target===zbk) zbk.classList.remove('open'); });
/* ---- Export SVG / PNG ---- */
function buildSVG(d){
  var cv=curVar(d), nodes=cv.v.nodes, edges=cv.v.edges, H=d.feat?640:560, W=1080;
  var s='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">';
  s+='<rect width="'+W+'" height="'+H+'" fill="#060b16"/>';
  s+='<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7f93ad"/></marker></defs>';
  edges.forEach(function(e){ var a=nodes[e[0]],b=nodes[e[1]]; if(!a||!b)return;
    s+='<path d="M'+a.x+','+a.y+' Q '+((a.x+b.x)/2)+','+a.y+' '+b.x+','+b.y+'" stroke="#5b7ba6" stroke-width="2" fill="none" marker-end="url(#ah)"/>'; });
  nodes.forEach(function(n){
    var w=170,h=86,x=n.x-w/2,y=n.y-h/2;
    var col='#33507e', glyph='';
    try{ var m=NAME2I[n.s]; if(m){ col=(n.c==='gcp'?(GCP_GC[m.group]||'#4285F4'):(AWS_GC[m.group]||'#E07700')); glyph=GLYPHS[m.glyph]||''; } }catch(e){}
    s+='<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="#0d1730" stroke="#40649f" stroke-width="1.5"/>';
    if(n.num) s+='<circle cx="'+x+'" cy="'+y+'" r="11" fill="#2f7fd1"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff" font-family="sans-serif">'+n.num+'</text>';
    if(glyph) s+='<g transform="translate('+(n.x-13)+','+(y+10)+') scale(1.08)" fill="none" stroke="'+col+'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+glyph+'</g>';
    else s+='<text x="'+n.x+'" y="'+(y+30)+'" text-anchor="middle" font-size="20" fill="#fff">'+(n.actor||'⬢')+'</text>';
    s+='<text x="'+n.x+'" y="'+(y+58)+'" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#f2f6ff" font-family="sans-serif">'+escS(n.l.length>24?n.l.slice(0,23)+'…':n.l)+'</text>';
    s+='<text x="'+n.x+'" y="'+(y+76)+'" text-anchor="middle" font-size="10.5" fill="#8fa3c2" font-family="sans-serif">'+escS(n.s||'')+'</text></g>';
  });
  return s+'</svg>';
}
function downloadDiagram(kind,did){
  var d=DG.filter(function(x){return x.id===did;})[0]; if(!d) return;
  var svg=buildSVG(d);
  if(kind==='svg'){
    var b=new Blob([svg],{type:'image/svg+xml'}); trigger(URL.createObjectURL(b),'so-do-'+did+'.svg'); return;
  }
  var img=new Image();
  var url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  img.onload=function(){
    var cv2=document.createElement('canvas'); cv2.width=img.width*2; cv2.height=img.height*2;
    var ctx=cv2.getContext('2d'); ctx.scale(2,2); ctx.drawImage(img,0,0);
    trigger(cv2.toDataURL('image/png'),'so-do-'+did+'.png'); URL.revokeObjectURL(url);
  };
  img.src=url;
  function trigger(href,name){ var a=document.createElement('a'); a.href=href; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
}
/* ---- Render + language hook ---- */
renderLib();
document.getElementById('langVi').addEventListener('click',function(){ setTimeout(renderLib,0); });
document.getElementById('langJa').addEventListener('click',function(){ setTimeout(renderLib,0); });
if((location.hash||'')==='#/diagrams'){
  page.classList.remove('page-off');
  var hh=document.querySelector('header.hero'); if(hh) hh.classList.add('page-off');
  var hub=document.getElementById('homeHub'); if(hub) hub.classList.add('page-off');
}
})();

/* ================= V4 · FLOW HỌC — LỘ TRÌNH HỌC THEO THỨ TỰ ================= */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function L(vi,ja){ return (window.LANG==='ja'&&ja)?ja:vi; }
try{ if(typeof JAD!=='undefined') Object.assign(JAD,{
 'Flow Học':'学習フロー','Bắt đầu theo Flow học':'学習フローから始める',
 'Học trước':'先に学ぶ','Học tiếp theo':'次に学ぶ','Điều hướng học tập theo Flow':'学習フローによる学習ナビ',
 'Xem Flow học đầy đủ →':'学習フロー全体を見る →','Đã học xong':'学習済み'
}); }catch(e){}

/* ---------- Dữ liệu Flow: 9 giai đoạn (0–8), node chạy theo thứ tự ---------- */
/* sv: [[cloud, tên service],...] · lk: [[href, nhãn VI, nhãn JA],...] · pre: id node tiên quyết (mặc định = node liền trước) */
/* Dữ liệu FSTAGES + FN nằm ở assets/js/data-content.js (biến toàn cục) */
FN.forEach(function(n,i){ n.step=i+1; if(!n.pre) n.pre=(i===0?null:FN[i-1].id); });
var FBYID={}; FN.forEach(function(n){ FBYID[n.id]=n; });
function preChain(id){ var out=[],cur=FBYID[id],seen={}; while(cur&&cur.pre&&!seen[cur.pre]){ seen[cur.pre]=1; out.push(cur.pre); cur=FBYID[cur.pre]; } return out; }

/* ---------- Tiến độ: localStorage phía trình duyệt người dùng ---------- */
var FKEY='khoameow_flow_v1', FDONE={};
try{ var raw=localStorage.getItem(FKEY); if(raw) FDONE=JSON.parse(raw)||{}; }catch(e){ FDONE={}; }
function saveFlow(){ try{ localStorage.setItem(FKEY, JSON.stringify(FDONE)); }catch(e){} }
function isDone(id){ return !!FDONE[id]; }

/* ---------- Trang Flow ---------- */
var page=document.createElement('section'); page.id='flowPage'; page.className='page-off';
document.querySelector('main').appendChild(page);
var hubGrid=document.querySelector('.hub-grid');
if(hubGrid){ var hc=document.createElement('a'); hc.className='hub-card'; hc.href='#/flow';
 hc.innerHTML='<span class="hub-ic">🧭</span><b>Flow Học — học theo thứ tự</b><p>Lộ trình từng bước qua 8 giai đoạn: service nào học trước, service nào học sau, điều kiện tiên quyết, lab phải làm ở mỗi bước và ô đánh dấu tiến độ — cho người mới không bị ngợp giữa 340+ service.</p>';
 hubGrid.insertBefore(hc, hubGrid.firstChild); }

function svcChip(sv){
  var ic=''; try{ ic=iconOf(sv[1],24); }catch(e){}
  return '<a class="flow-svc" href="#/service/'+sv[0]+'/'+encodeURIComponent(sv[1])+'">'+ic+E(sv[1])+'</a>';
}
function nodeHTML(n){
  var ja=window.LANG==='ja';
  var aws=n.sv.filter(function(s){return s[0]==='aws';}), gcp=n.sv.filter(function(s){return s[0]==='gcp';});
  var svh='';
  if(n.sv.length){
    svh='<div class="flow-svcs">';
    if(aws.length&&gcp.length){
      svh+=aws.map(svcChip).join('')+'<span class="flow-pair">⇄</span>'+gcp.map(svcChip).join('');
    } else svh+=n.sv.map(svcChip).join('');
    svh+='</div>';
  }
  var h='<div class="flow-node'+(isDone(n.id)?' done':'')+'" id="flownode-'+n.id+'" data-node="'+n.id+'">';
  if(n.branch) h+='<span class="flow-branch-tag">'+(ja?'分岐 ':'Nhánh ')+n.branch+'</span>';
  h+='<div class="flow-node-top"><span class="flow-step">'+(ja?'ステップ ':'Bước ')+n.step+'</span>'
    +'<span class="flow-hrs">⏱ '+E(ja?n.hrs.replace('giờ','時間'):n.hrs)+'</span>'
    +'<label class="flow-check"><input type="checkbox" data-flowck="'+n.id+'"'+(isDone(n.id)?' checked':'')+' /><span>'+(ja?'学習済み':'Đã học xong')+'</span></label></div>';
  h+='<h4>'+E(L(n.t,n.tj))+'</h4>'+svh+'<p class="flow-why">'+E(L(n.why,n.wj))+'</p>';
  if(n.lk&&n.lk.length) h+='<div class="flow-links">'+n.lk.map(function(x){ return '<a href="'+x[0]+'">🧪 '+E(ja?x[2]:x[1])+'</a>'; }).join('')+'</div>';
  h+='<div class="flow-pre" data-flowpre="'+n.id+'" hidden></div>';
  h+='</div>';
  return h;
}
function planTables(){
  var ja=window.LANG==='ja';
  var p12=[
   ['1','Giai đoạn 0 · Nền tảng','Không có lab service — luyện Linux ở Phần Luyện Command mỗi ngày 20 phút'],
   ['2','Giai đoạn 1 · IAM, VPC, CLI','Lab 1 (VPC) · Lab 12 (bảo mật)'],
   ['3','Giai đoạn 2 · EC2, đĩa, S3','Lab 2 (web server) · Lab 3 (web tĩnh)'],
   ['4','Giai đoạn 3 · LB, ASG, DNS, CDN + mốc 3-tier','Ghép Lab 1 + 2 thành kiến trúc 3-tier, đối chiếu Sơ đồ 3-tier'],
   ['5','Giai đoạn 4 · Database','Lab 4 (DB managed) · phần DB của Lab 5'],
   ['6','Giai đoạn 5 · Serverless & sự kiện','Lab 5 (API serverless) · Lab 10 (sự kiện)'],
   ['7','Giai đoạn 6 · DevOps & IaC','Lab 6 (container) · Lab 7 (Terraform) · Lab 8 (CI/CD)'],
   ['8','Giai đoạn 7 · Dữ liệu & AI','Lab 11 (giám sát) + dựng mini data pipeline theo Sơ đồ streaming'],
   ['9–10','Giai đoạn 8 · Nhánh chuyên sâu đã chọn','Lab của nhánh: Architect → capstone; Networking → Lab 1 nâng cao; Security/DevOps → Lab 9 + 12'],
   ['11–12','Capstone & ôn tập','Hoàn thiện 1 dự án trọn vẹn ở Trang Architect, ôn lại các node chưa tự tin, làm lại các bài Luyện Command còn yếu']
  ];
  var p12j=[
   ['1','ステージ0 · 基礎','サービスラボなし — コマンド演習の Linux を毎日20分'],
   ['2','ステージ1 · IAM、VPC、CLI','ラボ1（VPC）・ラボ12（セキュリティ）'],
   ['3','ステージ2 · EC2、ディスク、S3','ラボ2（Webサーバー）・ラボ3（静的サイト）'],
   ['4','ステージ3 · LB、ASG、DNS、CDN＋3層の到達点','ラボ1＋2を3層構成に統合し、3層Web図と照合'],
   ['5','ステージ4 · データベース','ラボ4（マネージドDB）・ラボ5のDB部分'],
   ['6','ステージ5 · サーバーレスとイベント','ラボ5（サーバーレスAPI）・ラボ10（イベント）'],
   ['7','ステージ6 · DevOps と IaC','ラボ6（コンテナ）・ラボ7（Terraform）・ラボ8（CI/CD）'],
   ['8','ステージ7 · データとAI','ラボ11（監視）＋ストリーミング図で小さなパイプライン構築'],
   ['9–10','ステージ8 · 選択した専門分岐','分岐のラボ：アーキテクト→キャップストーン、ネットワーク→ラボ1応用、セキュリティ/DevOps→ラボ9＋12'],
   ['11–12','キャップストーンと復習','アーキテクトページのプロジェクトを1件完成させ、自信のないノードと弱いコマンド演習を復習']
  ];
  var p4=[
   ['1','Giai đoạn 0 (lướt phần đã biết) + Giai đoạn 1 + Giai đoạn 2','Lab 1 · Lab 2 · Lab 3 — làm liền tay, bỏ qua lý thuyết đã thạo'],
   ['2','Giai đoạn 3 + Giai đoạn 4','Mốc 3-tier trong 1 buổi · Lab 4 (DB)'],
   ['3','Giai đoạn 5 + Giai đoạn 6','Lab 5 · Lab 6 · Lab 7 · Lab 8 — ưu tiên Terraform'],
   ['4','Giai đoạn 7 + Giai đoạn 8 (1 nhánh) + capstone thu gọn','Lab 10 · Lab 11 + 1 sơ đồ capstone tự vẽ lại theo mẫu ở Thư viện Sơ đồ']
  ];
  var p4j=[
   ['1','ステージ0（既知は流す）＋ステージ1＋ステージ2','ラボ1・2・3 を一気に。既知の理論は飛ばす'],
   ['2','ステージ3＋ステージ4','3層の到達点を1セッションで ・ ラボ4（DB）'],
   ['3','ステージ5＋ステージ6','ラボ5・6・7・8 — Terraform を優先'],
   ['4','ステージ7＋ステージ8（1分岐）＋小型キャップストーン','ラボ10・11 ＋ 図ライブラリの例でキャップストーン図を1枚描く']
  ];
  function tbl(rows){ return '<div class="sub-scroll"><table class="cmp"><tr><th style="width:12%">'+(ja?'週':'Tuần')+'</th><th style="width:38%">'+(ja?'内容':'Nội dung')+'</th><th>'+(ja?'必須ラボ／成果物':'Lab / việc phải làm')+'</th></tr>'+rows.map(function(r){ return '<tr><td><b>'+E(r[0])+'</b></td><td>'+E(r[1])+'</td><td>'+E(r[2])+'</td></tr>'; }).join('')+'</table></div>'; }
  return '<div class="dsec"><h3>📅 '+(ja?'学習プランA · 標準12週間':'Kế hoạch A · Học chuẩn 12 tuần')+'</h3>'
   +'<p>'+(ja?'1日1〜2時間の想定です。週の前半で各ノードの理論とサービス詳細を読み、週の後半で表のラボを行います。週末はチェックを付け、詰まったノードだけを復習します。':'Thiết kế cho nhịp <b>mỗi ngày 1–2 giờ</b>: nửa đầu tuần đọc lý thuyết + trang chi tiết của các node, nửa cuối tuần làm lab trong bảng, cuối tuần đánh dấu hoàn thành và chỉ ôn lại node còn vướng.')+'</p>'
   +tbl(ja?p12j:p12)+'</div>'
   +'<div class="dsec"><h3>🚀 '+(ja?'学習プランB · 速習4週間（IT経験者向け）':'Kế hoạch B · Học tăng tốc 4 tuần (đã có nền IT)')+'</h3>'
   +'<p>'+(ja?'Linux とネットワークの実務経験がある方向けです。ステージ0は既知部分を流し、毎日2時間前後＋週末にラボをまとめて行う想定です。詰まったら、そのノードだけ標準プランの週に戻って深掘りしてください。':'Dành cho người đã làm IT (đã biết Linux/mạng): Giai đoạn 0 chỉ lướt phần đã biết, nhịp <b>mỗi ngày khoảng 2 giờ + cuối tuần dồn lab</b>. Node nào vướng thì quay lại đúng tuần của nó trong Kế hoạch 12 tuần để học kỹ.')+'</p>'
   +tbl(ja?p4j:p4)
   +'<p class="flow-plan-note">'+(ja?'どちらのプランでも、順序は下のフローそのものです。チェックした進捗はこのブラウザに保存されます。':'Ở cả hai kế hoạch, thứ tự học chính là Flow bên dưới — đánh dấu xong bước nào, tiến độ được lưu ngay trong trình duyệt này.')+'</p></div>';
}
function renderFlow(){
  var ja=window.LANG==='ja';
  var total=FN.length, done=FN.filter(function(n){return isDone(n.id);}).length;
  var pct=total?Math.round(done/total*100):0;
  var h='<div class="wrap"><div class="sec-head"><span class="sec-tag">'+(ja?'専用ページ · 学習フロー':'Trang riêng · Flow học')+'</span>'
   +'<h2>'+(ja?'学習フロー — どのサービスを先に、どれを後に学ぶか':'Flow học — học service nào trước, service nào sau')+'</h2>'
   +'<p>'+(ja?'340以上のサービスを前に途方に暮れないための順序表です。ステージ0から8までを順に進み、各ノードでサービス詳細と必須ラボを開き、終わったら「学習済み」にチェックを入れます。前提が未完了のノードには「先に学ぶべきもの」が表示されます（ロックはされません。あくまで推奨です）。':'Thứ tự chinh phục 340+ service mà không bị ngợp: đi lần lượt từ Giai đoạn 0 đến 8, mỗi node mở trang chi tiết service + lab phải làm, học xong thì tích “Đã học xong”. Node nào chưa xong phần tiên quyết sẽ hiện gợi ý “Nên học X trước” — chỉ khuyến nghị, không khoá cứng.')+'</p></div>';
  h+='<div class="flow-topbar"><div class="ft-row"><div class="ft-pct">'+pct+'<small>%</small></div>'
   +'<div class="flow-bar"><div id="flowBarFill" style="width:'+pct+'%"></div></div>'
   +'<button type="button" class="btn btn-o" id="flowNextBtn">'+(ja?'次に学ぶ →':'Học tiếp theo →')+'</button>'
   +'<button type="button" class="btn btn-g" id="flowResetBtn" style="color:var(--ink2)">'+(ja?'進捗をリセット':'Đặt lại tiến độ')+'</button></div>'
   +'<p class="ft-note" id="flowCountNote">'+(ja?('全'+total+'ステップ中 '+done+' 件完了 — 進捗はこのブラウザの localStorage に保存されます。'):('Đã hoàn thành '+done+' / '+total+' bước — tiến độ được lưu trong trình duyệt này (localStorage) để lần sau học tiếp đúng chỗ.'))+'</p></div>';
  h+=planTables();
  FSTAGES.forEach(function(st){
    var nodes=FN.filter(function(n){return n.st===st.n;});
    var sd=nodes.filter(function(n){return isDone(n.id);}).length;
    var sp=nodes.length?Math.round(sd/nodes.length*100):0;
    h+='<div class="flow-stage"><div class="flow-stage-head"><h3>'+E(ja?st.tj:st.t)+'</h3>'
      +'<span class="fs-prog" data-fsprog="'+st.n+'">'+sd+'/'+nodes.length+' · '+sp+'%</span><span class="fs-bar"><div data-fsbar="'+st.n+'" style="width:'+sp+'%"></div></span>'
      +'<p>'+E(ja?st.dj:st.d)+'</p></div>';
    if(st.n===8){
      h+='<div class="flow-branches">'+nodes.map(nodeHTML).join('')+'</div>';
    } else {
      h+=nodes.map(function(n,i){ return (i?'<div class="flow-arrow" aria-hidden="true">▼</div>':'')+nodeHTML(n); }).join('');
    }
    h+='</div>';
    if(st.n<8) h+='<div class="flow-arrow" aria-hidden="true" style="font-size:22px">⬇</div>';
  });
  h+='<div class="dsec"><h3>'+(ja?'フローの使い方':'Cách dùng Flow này')+'</h3><ul>'
   +'<li>'+(ja?'迷ったら常に「次に学ぶ →」ボタン：未完了の最初のステップへ案内します。':'Khi phân vân, cứ bấm nút “Học tiếp theo →” ở đầu trang — trang sẽ chỉ tới bước chưa hoàn thành tiếp theo đúng thứ tự.')+'</li>'
   +'<li>'+(ja?'各サービスチップはサービス詳細ページを開きます。詳細ページの先頭にも「先に学ぶ／次に学ぶ」ナビが出ます。':'Mỗi chip service mở thẳng trang chi tiết của service đó; trên đầu mỗi trang chi tiết cũng có khối “Học trước / Học tiếp theo” cùng hệ với Flow này.')+'</li>'
   +'<li>'+(ja?'ステージ8は3分岐ともステージ7の完了が前提です。主軸を1つ決めてから、残りを回すのがおすすめです。':'Giai đoạn 8: cả 3 nhánh đều lấy cuối Giai đoạn 7 làm tiên quyết — chọn 1 nhánh chính trước, hai nhánh còn lại học sau.')+'</li></ul></div>';
  h+='</div>';
  page.innerHTML=h;
  page.querySelectorAll('input[type=checkbox][data-flowck]').forEach(function(cb){
    cb.addEventListener('change',function(){
      var id=cb.getAttribute('data-flowck');
      if(cb.checked) FDONE[id]=1; else delete FDONE[id];
      saveFlow(); updateFlowUI();
      var card=document.getElementById('flownode-'+id); if(card) card.classList.toggle('done',cb.checked);
    });
  });
  var nb=$('flowNextBtn'); if(nb) nb.addEventListener('click',gotoNext);
  var rb=$('flowResetBtn'); if(rb) rb.addEventListener('click',function(){
    if(rb.getAttribute('data-arm')){ FDONE={}; saveFlow(); renderFlow(); window.scrollTo({top:0,behavior:'smooth'}); }
    else { rb.setAttribute('data-arm','1'); rb.textContent=(window.LANG==='ja'?'本当に消しますか？ もう一度押す':'Chắc chắn xoá? Bấm lại lần nữa'); setTimeout(function(){ rb.removeAttribute('data-arm'); rb.textContent=(window.LANG==='ja'?'進捗をリセット':'Đặt lại tiến độ'); },3500); }
  });
  updateFlowUI();
}
function renderFlowSoft(){ var rb=$('flowResetBtn'); if(rb&&!rb.getAttribute('data-arm')) rb.textContent=(window.LANG==='ja'?'進捗をリセット':'Đặt lại tiến độ'); }
function updateFlowUI(){
  var ja=window.LANG==='ja';
  var total=FN.length, done=FN.filter(function(n){return isDone(n.id);}).length;
  var pct=total?Math.round(done/total*100):0;
  var fill=$('flowBarFill'); if(fill) fill.style.width=pct+'%';
  var pctEl=page.querySelector('.ft-pct'); if(pctEl) pctEl.innerHTML=pct+'<small>%</small>';
  var note=$('flowCountNote'); if(note) note.textContent=ja?('全'+total+'ステップ中 '+done+' 件完了 — 進捗はこのブラウザの localStorage に保存されます。'):('Đã hoàn thành '+done+' / '+total+' bước — tiến độ được lưu trong trình duyệt này (localStorage) để lần sau học tiếp đúng chỗ.');
  FSTAGES.forEach(function(st){
    var nodes=FN.filter(function(n){return n.st===st.n;});
    var sd=nodes.filter(function(n){return isDone(n.id);}).length;
    var sp=nodes.length?Math.round(sd/nodes.length*100):0;
    var pe=page.querySelector('[data-fsprog="'+st.n+'"]'); if(pe) pe.textContent=sd+'/'+nodes.length+' · '+sp+'%';
    var be=page.querySelector('[data-fsbar="'+st.n+'"]'); if(be) be.style.width=sp+'%';
  });
  FN.forEach(function(n){
    var box=page.querySelector('[data-flowpre="'+n.id+'"]'); if(!box) return;
    if(isDone(n.id)){ box.hidden=true; return; }
    var missing=preChain(n.id).filter(function(pid){ return !isDone(pid); });
    if(!missing.length){ box.hidden=true; return; }
    var first=FBYID[missing[missing.length-1]];
    box.innerHTML='⚠ <b>'+(ja?'先に学ぶべきもの：':'Nên học trước: ')+'</b>'+E(ja?first.tj:first.t)+' — '+(ja?'前提ステップが未完了です（ロックはされません。先にそちらを終えると理解が速くなります）。':'bước tiên quyết chưa hoàn thành (không khoá — học trước bước này sẽ dễ vào hơn nhiều).');
    box.hidden=false;
  });
  var nb=$('flowNextBtn');
  if(nb){ var nxt=FN.filter(function(n){return !isDone(n.id);})[0];
    nb.textContent=nxt?((ja?'次に学ぶ → ステップ':'Học tiếp theo → Bước ')+nxt.step):(ja?'🎉 フロー完了！':'🎉 Đã hoàn thành toàn bộ Flow!');
  }
}
function gotoNext(){
  var nxt=FN.filter(function(n){return !isDone(n.id);})[0];
  if(!nxt) return;
  var el=document.getElementById('flownode-'+nxt.id); if(!el) return;
  el.scrollIntoView({behavior:'smooth',block:'center'});
  el.classList.add('flash'); setTimeout(function(){ el.classList.remove('flash'); },2200);
}
renderFlow();
document.getElementById('langVi').addEventListener('click',function(){ setTimeout(renderFlow,0); });
document.getElementById('langJa').addEventListener('click',function(){ setTimeout(renderFlow,0); });
if((location.hash||'')==='#/flow'){
  page.classList.remove('page-off');
  var hh=document.querySelector('header.hero'); if(hh) hh.classList.add('page-off');
  var hub=document.getElementById('homeHub'); if(hub) hub.classList.add('page-off');
}

/* ---------- Khối HỌC TRƯỚC / HỌC TIẾP THEO trên trang chi tiết service ---------- */
function svcNavFor(cloud,name){
  var myNode=null,myIdx=-1;
  FN.forEach(function(n,i){ n.sv.forEach(function(s){ if(s[0]===cloud&&s[1]===name&&myIdx===-1){ myNode=n; myIdx=i; } }); });
  if(myNode){
    var preSv=[],nextSv=[];
    if(myNode.pre){ var pn=FBYID[myNode.pre]; if(pn) preSv=pn.sv.slice(); }
    FN.forEach(function(n){ if(n.pre===myNode.id) nextSv=nextSv.concat(n.sv); });
    if(!nextSv.length&&myIdx+1<FN.length&&FN[myIdx+1].pre===myNode.id) nextSv=FN[myIdx+1].sv.slice();
    if(!nextSv.length&&myIdx+1<FN.length&&FN[myIdx+1].st!==8&&myNode.st!==8) nextSv=FN[myIdx+1].sv.slice();
    return {node:myNode,pre:preSv,next:nextSv.slice(0,6),inFlow:true};
  }
  /* Ngoài flow: gợi ý theo nhóm — service liền trước/liền sau trong cùng nhóm của danh mục */
  try{
    var cat=(cloud==='aws'&&typeof AWS_CAT!=='undefined')?AWS_CAT:((typeof GCP_CAT!=='undefined')?GCP_CAT:null);
    if(cat){
      for(var gi=0;gi<cat.length;gi++){
        var items=cat[gi].items;
        for(var ii=0;ii<items.length;ii++){
          if(items[ii][0]===name){
            var pre=[],next=[];
            if(ii>0) pre=[[cloud,items[ii-1][0]]];
            else if(gi>0) pre=[[cloud,cat[gi-1].items[cat[gi-1].items.length-1][0]]];
            if(ii<items.length-1) next=[[cloud,items[ii+1][0]]];
            else if(gi<cat.length-1) next=[[cloud,cat[gi+1].items[0][0]]];
            return {node:null,pre:pre,next:next,inFlow:false};
          }
        }
      }
    }
  }catch(e){}
  return null;
}
function chipLink(sv){
  var ic=''; try{ ic=iconOf(sv[1],22); }catch(e){}
  return '<a class="flow-svc" href="#/service/'+sv[0]+'/'+encodeURIComponent(sv[1])+'">'+ic+E(sv[1])+'</a>';
}
function injectSvcNav(){
  var host=$('svcDetailBody'); if(!host||!host.innerHTML) return;
  if(host.querySelector('[data-svcnav]')) return;
  var m=(location.hash||'').match(/^#\/service\/(aws|gcp)\/(.+)$/); if(!m) return;
  var cloud=m[1], name=decodeURIComponent(m[2]);
  var nav=svcNavFor(cloud,name); if(!nav) return;
  var ja=window.LANG==='ja';
  var h='<div class="dsec" data-svcnav="1"><h3>🧭 '+(ja?'学習フローによる学習ナビ':'Điều hướng học tập theo Flow')+'</h3>';
  if(nav.inFlow){
    h+='<p style="margin-top:0">'+E(name)+' '+(ja?('は学習フローの <b>ステージ'+nav.node.st+' · ステップ'+nav.node.step+'</b> にあります。'):('nằm ở <b>Giai đoạn '+nav.node.st+' · Bước '+nav.node.step+'</b> trong Flow học.'))+'</p>';
  } else {
    h+='<p style="margin-top:0">'+(ja?'このサービスはフローの本筋には含まれていません。下記は同じグループ内での推奨順序です。':'Service này chưa nằm trong trục chính của Flow — dưới đây là gợi ý thứ tự theo nhóm gần nhất trong danh mục.')+'</p>';
  }
  h+='<div class="svc-nav-cols"><div><h4>⬅ '+(ja?'先に学ぶ':'Học trước')+'</h4>'
    +(nav.pre.length?'<div class="flow-svcs">'+nav.pre.map(chipLink).join('')+'</div>':'<p>'+(ja?'前提なし — ここから始められます。':'Không có tiên quyết — bắt đầu ngay từ đây được.')+'</p>')
    +'</div><div><h4>'+(ja?'次に学ぶ':'Học tiếp theo')+' ➡</h4>'
    +(nav.next.length?'<div class="flow-svcs">'+nav.next.map(chipLink).join('')+'</div>':'<p>'+(ja?'これは分岐の到達点です。下のフロー全体で続きを確認してください。':'Đây là điểm cuối của một nhánh — xem toàn bộ Flow để chọn hướng đi tiếp.')+'</p>')
    +'</div></div>'
    +'<p style="margin:12px 0 0"><a href="#/flow" style="font-weight:800;color:var(--orange-d)">'+(ja?'学習フロー全体を見る →':'Xem Flow học đầy đủ →')+'</a></p></div>';
  var anchor=host.querySelector('.d-actions');
  if(anchor&&anchor.nextSibling) host.insertBefore(buildFrag(h),anchor.nextSibling);
  else if(anchor) host.appendChild(buildFrag(h));
  else host.insertBefore(buildFrag(h),host.firstChild);
  if(window.__applyJA) window.__applyJA();
}
function buildFrag(html){ var t=document.createElement('template'); t.innerHTML=html; return t.content.firstChild; }
var svcBody=$('svcDetailBody');
if(svcBody){ new MutationObserver(function(){ injectSvcNav(); }).observe(svcBody,{childList:true}); }
injectSvcNav();
window.addEventListener('hashchange',function(){ setTimeout(injectSvcNav,0); });
})();

/* ===== FIX tràn menu: mờ mép theo vị trí cuộn + tự đưa mục active vào tầm nhìn ===== */
(function(){
  var nav=document.querySelector('nav.top');
  var wrap=nav?nav.querySelector('.wrap'):null;
  if(!nav||!wrap) return;
  /* Gom mọi link vào vùng cuộn riêng; nút VI/JA ở ngoài vùng cuộn để luôn bấm được */
  var bar=document.createElement('div');
  bar.className='nav-scroll';
  var toggle=wrap.querySelector('.lang-toggle');
  Array.prototype.slice.call(wrap.querySelectorAll('a')).forEach(function(a){ bar.appendChild(a); });
  wrap.insertBefore(bar,toggle||null);
  var fadeL=document.createElement('div'); fadeL.className='nav-fade l'; fadeL.setAttribute('aria-hidden','true');
  var fadeR=document.createElement('div'); fadeR.className='nav-fade r'; fadeR.setAttribute('aria-hidden','true');
  wrap.appendChild(fadeL); wrap.appendChild(fadeR);
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fades(){
    var max=bar.scrollWidth-bar.clientWidth;
    nav.classList.toggle('can-l',bar.scrollLeft>4);
    nav.classList.toggle('can-r',max>1&&bar.scrollLeft<max-4);
    var wr=wrap.getBoundingClientRect(), sr=bar.getBoundingClientRect();
    fadeL.style.left=(sr.left-wr.left)+'px';
    fadeR.style.left=(sr.right-wr.left-46)+'px';
  }
  function showActive(){
    fades();
    if(bar.scrollWidth<=bar.clientWidth) return;
    var a=bar.querySelector('a.act');
    if(!a) return;
    var target=a.offsetLeft-14;
    var max=bar.scrollWidth-bar.clientWidth;
    if(target<0) target=0; if(target>max) target=max;
    if(Math.abs(bar.scrollLeft-target)>2){
      bar.scrollTo({left:target,behavior:reduce?'auto':'smooth'});
    }
  }
  bar.addEventListener('scroll',fades,{passive:true});
  window.addEventListener('resize',fades);
  window.addEventListener('hashchange',function(){ setTimeout(showActive,80); });
  window.addEventListener('load',function(){ setTimeout(showActive,80); });
  setTimeout(showActive,120);
  fades();
})();
