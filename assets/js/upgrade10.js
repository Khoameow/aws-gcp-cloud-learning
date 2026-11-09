/* ============================================================
   upgrade10.js — MOBILE FIX 2026-11-09
   1) Chống kẹt cuộn: modal service (data-content.js) đặt
      body{overflow:hidden} khi mở; nếu đóng modal bằng đường
      khác ngoài nút ✕/bấm nền/Esc (vd: bấm service liên quan rồi
      chuyển trang), style này có thể sót lại và khoá cuộn toàn
      trang trên điện thoại. File này tự gỡ khoá mỗi khi đổi route
      nếu không còn lớp phủ nào đang mở.
   2) Nút "Xem lớn sơ đồ" cho sơ đồ service (.svcd-frame, bản gốc
      SVG 800px) và sơ đồ tĩnh (.diagram-card, SVG 1080px): trên
      mobile các sơ đồ này thu vừa màn hình nên chữ chỉ còn ~5-6px.
      Lớp xem lớn .mzoom (style ở cuối main.css) hiện sơ đồ ở bề
      ngang 720px trong khung cuộn riêng để đọc rõ từng node,
      đóng lại là trả cuộn trang về bình thường.
   Chỉ thêm nút trên màn hình hẹp (CSS ẩn nút ở ≥769px).
   ============================================================ */
(function(){
  function ja(){ return window.LANG==='ja'; }
  function L(vi,jaTxt){ return ja()?jaTxt:vi; }

  /* ---------- 1) Gỡ khoá cuộn sót lại ---------- */
  function unlockScrollIfStuck(){
    if(document.body.style.overflow!=='hidden') return;
    var modal=document.getElementById('modalBk');
    if(modal&&modal.classList.contains('open')) return;
    if(document.querySelector('.mzoom-bk.open,.dg-zoom-bk.open')) return;
    document.body.style.overflow='';
  }
  window.addEventListener('hashchange',function(){ setTimeout(unlockScrollIfStuck,80); });
  window.addEventListener('load',function(){ setTimeout(unlockScrollIfStuck,300); });

  /* ---------- 2) Lớp xem lớn sơ đồ ---------- */
  var bk=document.createElement('div');
  bk.className='mzoom-bk';
  bk.setAttribute('role','dialog');
  bk.setAttribute('aria-modal','true');
  bk.innerHTML='<div class="mzoom-head"><b class="mz-title"></b>'
    +'<button type="button" class="dg-btn mz-close" aria-label="Đóng">✕</button></div>'
    +'<div class="mzoom-scroll"><div class="mzoom-inner"></div></div>'
    +'<p class="mzoom-hint"></p>';
  document.body.appendChild(bk);
  var inner=bk.querySelector('.mzoom-inner');
  var scrollBox=bk.querySelector('.mzoom-scroll');

  function openMZoom(sourceSvg,title){
    if(!sourceSvg) return;
    inner.innerHTML='';
    var clone=sourceSvg.cloneNode(true);
    clone.removeAttribute('id');
    inner.appendChild(clone);
    bk.querySelector('.mz-title').textContent=title||L('Sơ đồ','図');
    bk.querySelector('.mzoom-hint').textContent=L('Vuốt ngang / dọc để xem từng phần của sơ đồ · bấm ✕ để đóng','左右・上下にスワイプして図の各部を確認 · ✕で閉じる');
    bk.classList.add('open');
    document.body.style.overflow='hidden';
    scrollBox.scrollLeft=0; scrollBox.scrollTop=0;
  }
  function closeMZoom(){
    bk.classList.remove('open');
    inner.innerHTML='';
    document.body.style.overflow='';
  }
  bk.querySelector('.mz-close').addEventListener('click',closeMZoom);
  bk.addEventListener('click',function(e){ if(e.target===bk) closeMZoom(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&bk.classList.contains('open')) closeMZoom(); });

  function addBtn(afterEl,getSvg,getTitle){
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='mzoom-btn';
    btn.textContent='⤢ '+L('Xem lớn sơ đồ','図を拡大');
    btn.addEventListener('click',function(){ openMZoom(getSvg(),getTitle()); });
    afterEl.parentNode.insertBefore(btn,afterEl.nextSibling);
  }

  function scan(){
    /* Sơ đồ ví dụ trên trang chi tiết service */
    document.querySelectorAll('.svcd-frame').forEach(function(fr){
      if(fr.getAttribute('data-mzoom')||bk.contains(fr)) return;
      fr.setAttribute('data-mzoom','1');
      var host=fr.closest('.svcd');
      addBtn(fr,
        function(){ return fr.querySelector('svg'); },
        function(){ var h=host?host.querySelector('h3'):null; return h?h.textContent.replace('🗺️','').trim():L('Sơ đồ ví dụ','例の図'); });
    });
    /* Sơ đồ tĩnh trong các thẻ .diagram-card (Networking, Kubernetes…) */
    document.querySelectorAll('.diagram-card').forEach(function(card){
      if(card.getAttribute('data-mzoom')||bk.contains(card)) return;
      var svg=card.querySelector('svg');
      if(!svg) return;
      card.setAttribute('data-mzoom','1');
      addBtn(svg,
        function(){ return card.querySelector('svg'); },
        function(){ var h=card.querySelector('h3'); return h?h.textContent.trim():L('Sơ đồ','図'); });
    });
    /* Gợi ý vuốt ngang cho sơ đồ thư viện (khung .dg-stage-wrap trên
       mobile là khung cuộn ngang kể từ MOBILE FIX 2 trong main.css) */
    document.querySelectorAll('.dg-stage-wrap').forEach(function(wr){
      if(wr.getAttribute('data-hint')||bk.contains(wr)||wr.closest('.dg-zoom-bk')) return;
      wr.setAttribute('data-hint','1');
      var hint=document.createElement('p');
      hint.className='dg-swipe-hint';
      hint.textContent='↔ '+L('Vuốt ngang để xem hết sơ đồ · hoặc bấm Phóng to','左右にスワイプで図全体を表示 · または「拡大」をタップ');
      wr.parentNode.insertBefore(hint,wr);
    });
  }

  var pending=false;
  function scanSoon(){
    if(pending) return;
    pending=true;
    setTimeout(function(){ pending=false; scan(); },250);
  }
  try{
    new MutationObserver(scanSoon).observe(document.body,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('hashchange',scanSoon);
  window.addEventListener('load',scanSoon);
  setTimeout(scan,400);
  /* Đổi ngôn ngữ: vẽ lại nhãn nút */
  ['langVi','langJa'].forEach(function(id){
    var b=document.getElementById(id);
    if(b) b.addEventListener('click',function(){
      setTimeout(function(){
        document.querySelectorAll('.mzoom-btn').forEach(function(x){ x.textContent='⤢ '+L('Xem lớn sơ đồ','図を拡大'); });
      },120);
    });
  });
})();
