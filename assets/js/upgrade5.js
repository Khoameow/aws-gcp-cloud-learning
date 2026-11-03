/* ============================================================
   upgrade5.js — ĐỢT 4 · VIỆC 1:
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
  (root||document).querySelectorAll('select:not([data-cpdd])').forEach(enhance);
}

document.addEventListener('click',function(e){
  if(openWrap&&(!e.target.closest||!e.target.closest('.cp-dd'))) closeDD(openWrap);
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&openWrap){ closeDD(openWrap); }
});

/* Select sinh động (thanh phân trang Services, trang IaC…) — tự gắn khi xuất hiện */
var pending=false;
new MutationObserver(function(){
  if(pending) return; pending=true;
  setTimeout(function(){ pending=false; try{ enhanceAll(document); }catch(e){} },30);
}).observe(document.body,{childList:true,subtree:true});

/* Đổi ngôn ngữ VI/JP: nhãn trong dropdown dựng lại từ <option> gốc */
['langVi','langJa'].forEach(function(id){
  var b=document.getElementById(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){
      document.querySelectorAll('.cp-dd').forEach(function(w){ try{ buildOptions(w); }catch(e){} });
    },160);
  });
});

enhanceAll(document);
window.__enhanceSelects=enhanceAll;
})();
