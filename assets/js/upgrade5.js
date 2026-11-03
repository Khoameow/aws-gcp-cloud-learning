/* ============================================================
   upgrade5.js — ĐỢT 4 · VIỆC 1 (+ BẢN CỨNG HOÁ SAU CHẨN ĐOÁN LIVE):
   Thay MỌI ô <select> gốc (popup trắng/xám của hệ điều hành lạc
   khỏi theme) bằng dropdown tự vẽ phong cách cyberpunk:
   nền tối, viền neon cyan, mục chọn nổi cam + dấu ✓, mở mượt,
   đóng khi bấm ra ngoài / Esc, hỗ trợ phím mũi tên + Enter,
   vùng chạm ≥44px. Ô <select> gốc vẫn ở trong DOM (bị ẩn) và
   vẫn là "nguồn sự thật": chọn ở dropdown → gán value cho
   select gốc → bắn sự kiện change → toàn bộ logic cũ (lọc
   Labs, chuyển bài Command, đổi số trang Services, máy tính
   CIDR…) chạy nguyên như trước. Select sinh động (ô "Mỗi trang"
   của thanh phân trang) được MutationObserver tự gắn.
   Nạp SAU upgrade4.js.

   CHẨN ĐOÁN LIVE (commit dc69ee9): file này ĐƯỢC phục vụ đúng
   trên Pages và trang IaC (upgrade6) chạy bình thường, nhưng ô
   Cấp độ ở #/command vẫn mở popup gốc. Trong bản dựng artifact,
   probe hiển thị xác nhận dropdown gắn đúng ở mọi đường vào
   (điều hướng SPA, tải thẳng #/command, desktop + mobile) —
   nên lỗi live nằm ở lớp áp dụng: hoặc CSS .cp-dd không tới
   được trang (select gắn class cp-native nhưng không rule nào
   ẩn nó → select gốc vẫn hiện và vẫn bấm mở popup gốc), hoặc
   một lỗi runtime ở một select làm enhanceAll dừng giữa chừng
   (forEach không có try/catch: 1 select lỗi = mọi select sau
   nó không bao giờ được gắn, và observer thử lại cũng chết ở
   đúng chỗ đó). Bản cứng hoá này xử cả hai:
   1) Mỗi select được gắn trong try/catch riêng — lỗi một ô
      không lây sang các ô còn lại.
   2) Tự kiểm tra CSS: thả một select.cp-native mẫu vào trang,
      đo computed width; nếu rule ẩn không có hiệu lực (CSS
      chưa tới / bị ghi đè) thì TỰ CHÍCH stylesheet dự phòng
      (đủ bộ rule .cp-dd) vào <head> — component tự đứng vững
      kể cả khi main.css lỗi thời hoặc thiếu khối ĐỢT 4.
   3) Khởi tạo không phụ thuộc thời điểm: chạy ngay nếu DOM đã
      sẵn sàng, chạy lại ở DOMContentLoaded và window load;
      MutationObserver chỉ gắn khi document.body tồn tại, và
      vòng lặp thử lại ngắn (6 lần × 400ms) bắt các select sinh
      muộn — không còn điểm chết "observer dựng trước body".
   Cờ kiểm chứng: window.__cpddCssFallback = true khi stylesheet
   dự phòng đã được chích (tức CSS chính KHÔNG có hiệu lực).
   ============================================================ */
(function(){
"use strict";
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

var openWrap=null;

function closeDD(wrap){
  if(!wrap) return;
  wrap.classList.remove('open');
  var btn=wrap.querySelector('.cp-dd-btn');
  if(btn) btn.setAttribute('aria-expanded','false');
  var list=wrap.querySelector('.cp-dd-list');
  if(list) list.hidden=true;
  if(openWrap===wrap) openWrap=null;
}
function closeAllDD(except){
  document.querySelectorAll('.cp-dd.open').forEach(function(w){ if(w!==except) closeDD(w); });
}

function buildOptions(wrap){
  var sel=wrap._sel, list=wrap.querySelector('.cp-dd-list');
  list.innerHTML='';
  Array.prototype.forEach.call(sel.options,function(op,i){
    var b=document.createElement('button');
    b.type='button'; b.className='cp-dd-opt'; b.setAttribute('role','option');
    b.setAttribute('data-i',i);
    b.innerHTML='<span class="cp-check" aria-hidden="true">✓</span><span class="cp-opt-t">'+E(op.textContent)+'</span>';
    b.addEventListener('click',function(){
      pickOption(wrap,i,true);
    });
    list.appendChild(b);
  });
  syncDD(wrap);
}
function syncDD(wrap){
  var sel=wrap._sel;
  var op=sel.options[sel.selectedIndex];
  var val=wrap.querySelector('.cp-dd-val');
  if(val) val.textContent=op?op.textContent:'';
  wrap.querySelectorAll('.cp-dd-opt').forEach(function(b){
    var on=(+b.getAttribute('data-i')===sel.selectedIndex);
    b.classList.toggle('sel',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
}
function pickOption(wrap,i,focusBtn){
  var sel=wrap._sel;
  var changed=(sel.selectedIndex!==i);
  sel.selectedIndex=i;
  syncDD(wrap);
  closeDD(wrap);
  if(changed) sel.dispatchEvent(new Event('change',{bubbles:true}));
  if(focusBtn){ var btn=wrap.querySelector('.cp-dd-btn'); if(btn) btn.focus(); }
}
function openDD(wrap){
  buildOptions(wrap); /* dựng lại nhãn theo ngôn ngữ hiện tại mỗi lần mở */
  closeAllDD(wrap);
  var list=wrap.querySelector('.cp-dd-list');
  list.hidden=false;
  wrap.classList.add('open');
  wrap.querySelector('.cp-dd-btn').setAttribute('aria-expanded','true');
  openWrap=wrap;
  var sel=wrap.querySelector('.cp-dd-opt.sel')||wrap.querySelector('.cp-dd-opt');
  if(sel) sel.focus();
}
function focusStep(wrap,dir){
  var opts=Array.prototype.slice.call(wrap.querySelectorAll('.cp-dd-opt'));
  if(!opts.length) return;
  var i=opts.indexOf(document.activeElement);
  var n=(i===-1)?(dir>0?0:opts.length-1):Math.min(opts.length-1,Math.max(0,i+dir));
  opts[n].focus();
}

function enhance(sel){
  if(!sel||sel.getAttribute('data-cpdd')) return;
  sel.setAttribute('data-cpdd','1');
  sel.classList.add('cp-native');
  sel.tabIndex=-1;
  var wrap=document.createElement('div');
  wrap.className='cp-dd';
  wrap._sel=sel;
  var aria=sel.getAttribute('aria-label')||'';
  wrap.innerHTML='<button type="button" class="cp-dd-btn" aria-haspopup="listbox" aria-expanded="false"'+(aria?' aria-label="'+E(aria)+'"':'')+'>'
    +'<span class="cp-dd-val"></span><span class="cp-dd-chev" aria-hidden="true">▾</span></button>'
    +'<div class="cp-dd-list" role="listbox" hidden></div>';
  if(sel.parentNode) sel.parentNode.insertBefore(wrap, sel.nextSibling);
  var btn=wrap.querySelector('.cp-dd-btn');
  btn.addEventListener('click',function(ev){
    ev.preventDefault(); ev.stopPropagation();
    if(wrap.classList.contains('open')) closeDD(wrap); else openDD(wrap);
  });
  btn.addEventListener('keydown',function(ev){
    if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ ev.preventDefault(); if(!wrap.classList.contains('open')) openDD(wrap); else focusStep(wrap,ev.key==='ArrowDown'?1:-1); }
    else if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); if(wrap.classList.contains('open')) closeDD(wrap); else openDD(wrap); }
    else if(ev.key==='Escape'){ closeDD(wrap); }
  });
  wrap.querySelector('.cp-dd-list').addEventListener('keydown',function(ev){
    if(ev.key==='ArrowDown'){ ev.preventDefault(); focusStep(wrap,1); }
    else if(ev.key==='ArrowUp'){ ev.preventDefault(); focusStep(wrap,-1); }
    else if(ev.key==='Home'){ ev.preventDefault(); var f=wrap.querySelector('.cp-dd-opt'); if(f) f.focus(); }
    else if(ev.key==='End'){ ev.preventDefault(); var all=wrap.querySelectorAll('.cp-dd-opt'); if(all.length) all[all.length-1].focus(); }
    else if(ev.key==='Escape'){ ev.preventDefault(); closeDD(wrap); btn.focus(); }
    else if(ev.key==='Tab'){ closeDD(wrap); }
  });
  sel.addEventListener('change',function(){ syncDD(wrap); });
  buildOptions(wrap);
}
function enhanceAll(root){
  /* try/catch TỪNG select: một ô lỗi không được phép chặn các ô còn lại */
  (root||document).querySelectorAll('select:not([data-cpdd])').forEach(function(sel){
    try{ enhance(sel); }catch(e){ try{ sel.removeAttribute('data-cpdd'); }catch(_){} }
  });
}

/* ---- Tự kiểm tra CSS: rule ẩn select gốc có thật sự hiệu lực? ----
   Nếu main.css chưa tới trang / thiếu khối ĐỢT 4 / bị ghi đè, select
   gắn class cp-native vẫn giữ kích thước tự nhiên → chích stylesheet
   dự phòng (bản sao đầy đủ của khối .cp-dd trong main.css).        */
var FALLBACK_CSS=[
'select.cp-native{position:absolute!important;width:1px!important;height:1px!important;min-height:0!important;opacity:0!important;pointer-events:none!important;border:0!important;padding:0!important;margin:0!important;overflow:hidden;clip:rect(0 0 0 0)}',
'.cp-dd{position:relative;display:inline-block;vertical-align:middle;text-align:left}',
'.cp-dd-btn{font:inherit;font-size:14px;font-weight:600;color:#e8f1ff;background:linear-gradient(160deg,rgba(17,27,50,.92),rgba(8,13,26,.97));border:1.5px solid rgba(34,211,238,.45);border-radius:10px;padding:9px 34px 9px 13px;min-height:44px;min-width:120px;width:100%;cursor:pointer;display:inline-flex;align-items:center;gap:8px;position:relative;transition:border-color .18s,box-shadow .18s;box-shadow:inset 0 0 14px rgba(34,211,238,.05)}',
'.cp-dd-btn:hover{border-color:#22d3ee;box-shadow:0 0 14px rgba(34,211,238,.25)}',
'.cp-dd-btn:focus-visible{outline:2px solid #ff9900;outline-offset:2px}',
'.cp-dd.open .cp-dd-btn{border-color:#ff9900;box-shadow:0 0 16px rgba(255,153,0,.35)}',
'.cp-dd-val{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.cp-dd-chev{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#22d3ee;font-size:11px;transition:transform .22s ease;pointer-events:none}',
'.cp-dd.open .cp-dd-chev{transform:translateY(-50%) rotate(180deg);color:#ff9900}',
'.cp-dd-list{position:absolute;top:calc(100% + 6px);left:0;min-width:100%;max-width:min(340px,92vw);max-height:300px;overflow-y:auto;z-index:300;background:linear-gradient(170deg,#0d1730,#070c17);border:1.5px solid rgba(34,211,238,.55);border-radius:12px;padding:5px;box-shadow:0 18px 44px rgba(0,0,0,.7),0 0 24px rgba(34,211,238,.18)}',
'.cp-dd-opt{font:inherit;font-size:14px;text-align:left;width:100%;display:flex;align-items:center;gap:9px;padding:10px 11px;min-height:44px;border:1px solid transparent;border-radius:8px;background:transparent;color:#b9c8e4;cursor:pointer}',
'.cp-dd-opt:hover,.cp-dd-opt:focus-visible{background:rgba(34,211,238,.12);color:#e8f1ff;outline:none}',
'.cp-dd-opt .cp-check{color:#ff9900;font-weight:800;width:15px;flex:none;opacity:0;text-shadow:0 0 8px rgba(255,153,0,.7)}',
'.cp-dd-opt.sel{color:#ffb84d;font-weight:700;background:rgba(255,153,0,.09)}',
'.cp-dd-opt.sel .cp-check{opacity:1}',
'.svc-search .cp-dd{flex:0 1 auto}',
'.lab-tools .cp-dd-btn{min-width:170px}',
'.calc .cp-dd{min-width:160px}',
'.calc .row .cp-dd{width:100%}',
'.cmd-controls .cp-dd{flex:0 1 auto}',
'.cmd-controls .cp-dd-btn{min-width:190px}',
'.pgbar .cp-dd-btn{min-height:38px;min-width:76px;padding:7px 30px 7px 11px;font-size:13px}',
'@media (max-width:768px){.cp-dd-btn{font-size:16px;min-height:48px}.svc-search .cp-dd{width:100%}.svc-search .cp-dd-btn{width:100%}.lab-tools .cp-dd{flex:1 1 150px}.lab-tools .cp-dd-btn{width:100%;min-width:0}.cmd-controls .cp-dd{flex:1 1 auto;min-width:0}.cmd-controls .cp-dd-btn{width:100%;min-width:0}.pgbar .cp-dd-btn{min-height:44px;font-size:14px}}'
].join('\n');
function cssIsLive(){
  try{
    var probe=document.createElement('select');
    probe.className='cp-native';
    probe.setAttribute('aria-hidden','true');
    probe.style.cssText='position:absolute;left:-9999px;top:0';
    document.body.appendChild(probe);
    var w=probe.getBoundingClientRect().width;
    var op=getComputedStyle(probe).opacity;
    document.body.removeChild(probe);
    return w<=2 && op==='0';
  }catch(e){ return true; } /* đo không được thì tin CSS chính, đừng chích bừa */
}
function ensureCss(){
  if(!document.body) return;
  if(cssIsLive()){ window.__cpddCssFallback=false; return; }
  if(!document.getElementById('cpdd-fallback-css')){
    var st=document.createElement('style');
    st.id='cpdd-fallback-css';
    st.textContent=FALLBACK_CSS;
    document.head.appendChild(st);
  }
  window.__cpddCssFallback=true;
}

document.addEventListener('click',function(e){
  if(openWrap&&(!e.target.closest||!e.target.closest('.cp-dd'))) closeDD(openWrap);
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&openWrap){ closeDD(openWrap); }
});

/* Select sinh động (thanh phân trang Services, trang IaC…) — tự gắn khi xuất hiện.
   Chỉ dựng observer khi body đã có; nếu chưa, init() bên dưới sẽ lo phần tĩnh
   và vòng thử lại bắt phần động — không còn chết cả gói vì observe(null). */
var pending=false;
function armObserver(){
  if(!document.body||armObserver.done) return;
  armObserver.done=true;
  try{
    new MutationObserver(function(){
      if(pending) return; pending=true;
      setTimeout(function(){ pending=false; try{ enhanceAll(document); }catch(e){} },30);
    }).observe(document.body,{childList:true,subtree:true});
  }catch(e){}
}

/* Đổi ngôn ngữ VI/JP: nhãn trong dropdown dựng lại từ <option> gốc */
['langVi','langJa'].forEach(function(id){
  var b=document.getElementById(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      document.querySelectorAll('.cp-dd').forEach(function(w){ try{ buildOptions(w); }catch(e){} });
    },160);
  });
});

var retries=0;
function init(){
  try{ ensureCss(); }catch(e){}
  try{ enhanceAll(document); }catch(e){}
  armObserver();
  /* Bắt các select sinh muộn sau lần chạy đầu (view dựng chậm, đổi route…) */
  if(retries<6){ retries++; setTimeout(init,400); }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}
window.addEventListener('load',function(){ try{ ensureCss(); enhanceAll(document); }catch(e){} });
window.__enhanceSelects=enhanceAll;
})();
