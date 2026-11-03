/* ============================================================
   icons.js — Hệ thống icon SVG cho từng service AWS / GCP
   (định nghĩa GLYPHS + iconOf; các glyph bổ sung của phần
   Architect nằm trong data-content.js như bản gốc).
   ============================================================ */

    /* ================= ICON SYSTEM =================
       AWS: ô vuông bo góc màu theo nhóm + glyph trắng (phong cách AWS Architecture Icons).
       Google Cloud: ô nền sáng viền mảnh + glyph màu (phong cách icon sản phẩm Google Cloud).
       Mỗi service có glyph riêng theo chức năng, vẽ bằng SVG inline — không hotlink. */
    var GLYPHS = {
      server:'<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
      lambda:'<text x="12" y="17" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor" stroke="none">λ</text>',
      box:'<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
      cube:'<path d="M12 2.7 20 7v10l-8 4.3L4 17V7l8-4.3Z"/><path d="M4 7l8 4.3L20 7M12 11.3V21"/>',
      db:'<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V12c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5"/><path d="M4 12v6.5c0 1.7 3.6 3 8 3s8-1.3 8-3V12"/>',
      table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',
      bucket:'<path d="M4 8 5.5 20a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L20 8"/><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M8.5 12.5c1 .6 2.2 1 3.5 1s2.5-.4 3.5-1"/>',
      disk:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
      ssd:'<rect x="4" y="7" width="16" height="10" rx="2"/><path d="M8 17v2M12 17v2M16 17v2M8 10.5h8"/>',
      archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V9"/><path d="M10 13h4"/>',
      globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z"/>',
      nodes:'<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.3 10.8 16.7 7M7.3 13.2l9.4 3.8"/>',
      hub:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="3.5" r="2"/><circle cx="12" cy="20.5" r="2"/><circle cx="3.5" cy="12" r="2"/><circle cx="20.5" cy="12" r="2"/><path d="M12 5.5v3.5M12 15v3.5M5.5 12H9M15 12h3.5"/>',
      route:'<circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="5" r="2.5"/><path d="M7.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h2.5" stroke-dasharray="3 2.4"/>',
      shield:'<path d="M12 3 5 5.8v5.4c0 4.6 3 7.9 7 9.3 4-1.4 7-4.7 7-9.3V5.8L12 3Z"/><path d="m9.2 11.6 2 2 3.6-3.8"/>',
      key:'<circle cx="8" cy="14" r="4.5"/><path d="m11.5 10.5 8-8M17 5l2.5 2.5M14 8l2 2"/>',
      lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4"/>',
      chart:'<path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/>',
      chartline:'<path d="M3 3v18h18"/><path d="m6 15 4-5 3.5 3L18 6"/><path d="M15.5 6H18v2.5"/>',
      cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
      bot:'<rect x="4" y="9" width="16" height="10" rx="2.5"/><path d="M12 9V5M12 5h.01"/><circle cx="9" cy="14" r=".6" fill="currentColor"/><circle cx="15" cy="14" r=".6" fill="currentColor"/><path d="M2.5 13v3M21.5 13v3"/>',
      spark:'<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z"/><path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
      doc:'<path d="M6 2.5h8L19 7.5v14H6v-19Z"/><path d="M13.5 2.5v5.5H19M9 13h6M9 16.5h6"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.6-4.6"/>',
      mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
      bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 3h-15L6 16Z"/><path d="M10 21a2.2 2.2 0 0 0 4 0"/>',
      layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.6 12.5 8.4 4.7 8.4-4.7M3.6 16.5 12 21.2l8.4-4.7"/>',
      waves:'<path d="M2 8c2.7 0 2.7 2.5 5.4 2.5S10.1 8 12.8 8s2.7 2.5 5.4 2.5S20.9 8 22 8"/><path d="M2 13c2.7 0 2.7 2.5 5.4 2.5s2.7-2.5 5.4-2.5 2.7 2.5 5.4 2.5 2.4-2 3.8-2.4"/><path d="M2 18c2.7 0 2.7 2.5 5.4 2.5s2.7-2.5 5.4-2.5 2.7 2.5 5.4 2.5 2.4-2 3.8-2.4"/>',
      flow:'<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M9 6h6a3 3 0 0 1 3 3v6M15 18H9a3 3 0 0 1-3-3V9"/>',
      gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
      code:'<path d="m8.5 8-4.5 4 4.5 4M15.5 8 20 12l-4.5 4M13.5 4.5l-3 15"/>',
      branch:'<circle cx="6" cy="5.5" r="2.5"/><circle cx="6" cy="18.5" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M6 8v8M18 9.5c0 4.5-6 3-9 5"/>',
      rocket:'<path d="M12 2.5c3 2 4.5 5.4 4.5 9L12 15l-4.5-3.5c0-3.6 1.5-7 4.5-9Z"/><circle cx="12" cy="8.5" r="1.8"/><path d="M7.5 12.5 5 18l3-.8M16.5 12.5 19 18l-3-.8M10.5 17.5c.3 1.8.8 3 1.5 4 .7-1 1.2-2.2 1.5-4"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
      pin:'<path d="M12 21.5S4.5 15.4 4.5 9.8a7.5 7.5 0 0 1 15 0c0 5.6-7.5 11.7-7.5 11.7Z"/><circle cx="12" cy="9.8" r="2.8"/>',
      video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
      image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 19 5.5-5.5 3 3L17 12l3 3.5"/>',
      mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5"/>',
      chat:'<path d="M21 12a8 8 0 0 1-8 8c-1.2 0-2.4-.3-3.4-.7L4 20.5l1.2-3.4A8 8 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14h4"/>',
      users:'<circle cx="9" cy="8.5" r="3.5"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8M17.8 15c2 .7 3.2 2.4 3.2 5"/>',
      atom:'<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
      heart:'<path d="M12 20.5S3.5 15.4 3.5 9.3A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.5 2.6c0 6.1-8.5 11.2-8.5 11.2Z"/><path d="M6.5 12h3l1.5-2.5 2 4 1.5-1.5h3"/>',
      cart:'<path d="M3 4h2.5l2.3 11.5a1.8 1.8 0 0 0 1.8 1.5h7.9a1.8 1.8 0 0 0 1.8-1.4L21 8H6"/><circle cx="10" cy="21" r="1.3"/><circle cx="17.5" cy="21" r="1.3"/>',
      chip:'<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 2.5V7M14 2.5V7M10 17v4.5M14 17v4.5M2.5 10H7M2.5 14H7M17 10h4.5M17 14h4.5"/><circle cx="12" cy="12" r="1.6"/>',
      desktop:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9.5 21h5M12 17v4"/>',
      mobile:'<rect x="7.5" y="2.5" width="9" height="19" rx="2.5"/><path d="M11 18.8h2"/>',
      swap:'<path d="M4 7.5h13M14 4l3.5 3.5L14 11M20 16.5H7M10 13l-3.5 3.5L10 20"/>',
      refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5"/>',
      sync:'<path d="M4 9a8 8 0 0 1 14.5-2.5L20 8M20 3.5V8h-4.5M20 15a8 8 0 0 1-14.5 2.5L4 16M4 20.5V16h4.5"/>',
      building:'<path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21M15 10h4a1.5 1.5 0 0 1 1.5 1.5V21M2.5 21h19"/><path d="M7.5 8h4M7.5 12h4M7.5 16h4"/>',
      filter:'<path d="M4 5h16l-6.2 7.2v5.3l-3.6 2v-7.3L4 5Z"/>',
      link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.54 4.54 0 0 0-6.4-6.4l-1.5 1.5"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.54 4.54 0 0 0 6.4 6.4l1.5-1.5"/>',
      scale:'<path d="M12 3v18M7 21h10M12 6 5.5 7.5M12 6l6.5 1.5"/><path d="M2.8 13 5.5 7.5 8.2 13a2.9 2.9 0 0 1-5.4 0ZM15.8 13l2.7-5.5 2.7 5.5a2.9 2.9 0 0 1-5.4 0Z"/>',
      list:'<path d="m4 6.5 1.2 1.2L7.5 5.5M4 12.5l1.2 1.2 2.3-2.2M4 18.5l1.2 1.2 2.3-2.2M11 6.5h9M11 12.5h9M11 18.5h9"/>',
      snow:'<path d="M12 2.5v19M4 7l16 10M20 7 4 17M12 2.5 9.5 5M12 2.5 14.5 5M12 21.5 9.5 19M12 21.5l2.5-2.5"/>',
      fire:'<path d="M12 2.8s5.5 5 5.5 10a5.5 5.5 0 0 1-11 0c0-2 1-3.7 2.2-5.2.4 1 1 1.7 1.8 2.2C10.3 7 11 4.8 12 2.8Z"/>',
      book:'<path d="M5 3.5h13A1.5 1.5 0 0 1 19.5 5v14A1.5 1.5 0 0 1 18 20.5H5z"/><path d="M5 17.5A1.5 1.5 0 0 1 6.5 16H19.5M9 7.5h6"/>',
      truck:'<path d="M2.5 6h12v10h-12zM14.5 10h4l3 3.2V16h-7"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
      eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
      wallet:'<path d="M3.5 7A2.5 2.5 0 0 1 6 4.5h12v3"/><rect x="3.5" y="7" width="17" height="12" rx="2.5"/><circle cx="16.8" cy="13" r="1.2" fill="currentColor" stroke="none"/>',
      phone:'<path d="M5 3.5h4l1.5 5L8 10.5a12.5 12.5 0 0 0 5.5 5.5l2-2.5 5 1.5v4a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5Z"/>',
      radio:'<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><path d="M8.8 15.2a4.5 4.5 0 0 1 0-6.4M15.2 8.8a4.5 4.5 0 0 1 0 6.4M6.2 17.8a8.5 8.5 0 0 1 0-11.6M17.8 6.2a8.5 8.5 0 0 1 0 11.6"/>',
      folder:'<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2.5h8A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-12Z"/>',
      zap:'<path d="M13 2.5 4.5 13.5H11L9.8 21.5l8.5-11H12l1-8Z"/>',
      target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
      wrench:'<path d="M14.8 6.2a4.3 4.3 0 0 1 5.7-4L17.8 5l1.2 2.7a4.3 4.3 0 0 1-5.9 5L7 18.8a2.05 2.05 0 0 1-2.9-2.9l6.1-6.1a4.3 4.3 0 0 0 4.6-3.6Z"/>',
      gauge:'<path d="M4 14a8 8 0 1 1 16 0"/><path d="M12 14l4.2-4.2"/><path d="M2.5 18.5h19"/>',
      twin:'<path d="M8 3.5h13v13H8z"/><path d="M3.5 8v12.5h13"/><path d="M12 8v3M12 14.5v.01M9 11.5h6"/>',
      graph:'<path d="M4 20V9M10 20V4M16 20v-9M21 20H3"/><path d="M4 6.5 10 5l6 4 4.5-3" opacity=".55"/>',
      grad:'<path d="m12 4.5 10 4.5-10 4.5L2 9l10-4.5Z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v5"/>',
      factory:'<path d="M3.5 21V10l5.5 3.2V10l5.5 3.2V5.5h6V21h-17Z"/><path d="M7.5 17.5h.01M12 17.5h.01M16.5 17.5h.01"/>',
      thermo:'<path d="M10 4a2 2 0 0 1 4 0v9.3a4.8 4.8 0 1 1-4 0V4Z"/><circle cx="12" cy="17.5" r="2"/>',
      satellite:'<path d="m13.5 10.5 3-3L21 12l-4.5 4.5-3-3z" transform="rotate(0 12 12)"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(-45 12 12)"/><path d="M6 3.5 10 7.5 7.5 10 3.5 6 6 3.5ZM14 17l2.5-2.5 4 4L18 21l-4-4ZM5 16a5.5 5.5 0 0 1 3-3M8.5 19.5a9 9 0 0 1 4.5-4.5"/>',
      stream:'<path d="M3 12h4l2-6 3.5 11 2.5-5h6"/>',
      warehouse:'<path d="M3 21V9.5L12 4l9 5.5V21"/><path d="M7 21v-7.5h10V21M7 17.5h10"/>',
      dna:'<path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-2 .8-3.5 2-4.7M17 21c0-2-.8-3.5-2-4.7M8.5 6.5h7M8 12h8M8.5 17.5h7"/>',
      scale2:'<path d="M12 4v16M5 20h14"/><path d="M12 4 6 8l-2 5a3.5 3.5 0 0 0 6 0L8 8M12 4l6 4 2 5a3.5 3.5 0 0 1-6 0l-2-5" opacity=".9"/>'
    };
    var LVL = ['Nền tảng','Trung cấp','Chuyên sâu'];
    var AWS_GC = {'Compute':'#E07700','Containers':'#E07700','Storage':'#3F8624','Database':'#2E6FDB','Migration & Transfer':'#3F8624','Networking & Content Delivery':'#8C4FFF','Developer Tools':'#E7157B','Management & Governance':'#E7157B','Security, Identity & Compliance':'#DD344C','Analytics':'#8C4FFF','Machine Learning':'#01A88D','Application Integration':'#E7157B','Front-end Web & Mobile':'#DD344C','Media Services':'#E8710A','Internet of Things':'#3F8624','End User Computing':'#E07700','Business Applications':'#527FFF','Specialized & Emerging':'#01A88D'};
    var GCP_GC = {'Compute':'#4285F4','Containers':'#4285F4','Storage':'#34A853','Databases':'#4285F4','Networking':'#9334E6','Developer Tools':'#EA4335','Management & DevOps':'#E8710A','Security & Identity':'#DD344C','Analytics':'#9334E6','AI & Machine Learning':'#01A88D','Application Integration':'#E7157B','Migration':'#3F8624','Media & Other':'#FBBC04'};
    function sicon(cloud, group, glyph, name, size){
      size = size || 36;
      var inner = GLYPHS[glyph] || GLYPHS.box;
      var gs = Math.round(size * 0.66);
      if(cloud === 'gcp'){
        var col = GCP_GC[group] || '#4285F4';
        return '<span class="svc-ic gcp" role="img" aria-label="Icon ' + name + '" title="' + name + '" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + gs + '" height="' + gs + '" viewBox="0 0 24 24" fill="none" stroke="' + col + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg></span>';
      }
      var bg = AWS_GC[group] || '#E07700';
      return '<span class="svc-ic" role="img" aria-label="Icon ' + name + '" title="' + name + '" style="width:' + size + 'px;height:' + size + 'px;background:' + bg + '"><svg width="' + gs + '" height="' + gs + '" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg></span>';
    }
    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
    /* status: null | ['new','Mới 2025'] | ['preview','Preview'] | ['dep','Ngừng / Maintenance'] */
