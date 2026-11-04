/* BenefitMath v2 (demo): small layout helpers. Load after site.js. Nothing is removed from the page. */
(function(){
  var d=document;
  /* header: thin line + shadow once the page scrolls */
  var hdr=d.querySelector('.site');
  if(hdr){var on=function(){hdr.classList.toggle('scrolled',window.scrollY>8);};on();window.addEventListener('scroll',on,{passive:true});}

  /* mark the current page in the top links */
  var here=location.pathname.split('/').pop()||'index.html';
  [].forEach.call(d.querySelectorAll('.navlinks a'),function(a){if(a.getAttribute('href')===here)a.setAttribute('aria-current','page');});

  /* any [data-open-search] opens the site search (the button site.js adds to the header) */
  d.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-open-search]');if(!t)return;
    var b=d.querySelector('.searchbtn');if(b){e.preventDefault();b.click();}});

  /* guides: "On this page" moves to a sticky side column, with a reading bar */
  var jump=d.querySelector('.gjump'),secs=[].slice.call(d.querySelectorAll('.gsec'));
  if(jump&&secs.length){
    var lay=d.createElement('div');lay.className='glayout';
    var main=d.createElement('div');main.className='gmain';
    var side=d.createElement('aside');side.className='gside';side.setAttribute('aria-label',(document.documentElement.lang==='es')?'En esta página':'On this page');
    var toc=d.createElement('div');toc.className='gtoc';var LG=document.documentElement.lang||'',ES=LG==='es',ZH=/^zh/.test(LG);toc.innerHTML='<p>'+(ES?'En esta página':ZH?'本页内容':'On this page')+'</p>';
    jump.parentNode.insertBefore(lay,jump);
    toc.appendChild(jump);side.appendChild(toc);
    /* move everything between the jump links and the sources box into the main column */
    var n=lay.nextSibling,stop=d.querySelector('.gsrc');stop=stop&&stop.closest('section');
    while(n&&n!==stop&&n.tagName!=='FOOTER'){var nx=n.nextSibling;main.appendChild(n);n=nx;}
    lay.appendChild(main);lay.appendChild(side);
    /* side call-to-action: the first related calculator */
    var calc=[].filter.call(d.querySelectorAll('.rel a'),function(a){return !/^guide-/.test(a.getAttribute('href'));})[0];
    if(calc){var c=d.createElement('div');c.className='gcta';
      var t=calc.querySelector('b'),s=calc.querySelector('span');
      c.innerHTML='<b></b><span></span><a></a>';c.querySelector('b').textContent=(t?t.textContent:'Calculator').replace(/\s*→\s*$/,'');
      c.querySelector('span').textContent=s?s.textContent:'';var a=c.querySelector('a');a.href=calc.getAttribute('href');a.textContent=ES?'Abrir la calculadora':ZH?'打开计算器':'Open the calculator';side.appendChild(c);}
    /* reading bar + highlight the section in view */
    var bar=d.createElement('div');bar.className='gread-bar';bar.setAttribute('aria-hidden','true');d.body.appendChild(bar);
    var links=[].slice.call(jump.querySelectorAll('a'));
    var tick=function(){
      var h=d.documentElement,max=h.scrollHeight-h.clientHeight;bar.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';
      var cur=null;secs.forEach(function(s){if(s.getBoundingClientRect().top<140)cur=s.id;});
      links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur);});
    };
    tick();window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);
  }
})();

/* ---- trail touches: original NW drawings (mountains, firs, a trail sign), colored by the theme ---- */
(function(){
  var d=document,NS='http://www.w3.org/2000/svg';
  function tree(x,y,s,c){s=s||1;var p=function(a,b){return (x+a*s).toFixed(1)+','+(y+b*s).toFixed(1);};
    return '<g class="'+(c||'tree')+'"><polygon points="'+[p(0,-34),p(-8,-20),p(-4,-20),p(-11,-9),p(-6,-9),p(-14,2),p(14,2),p(6,-9),p(11,-9),p(4,-20),p(8,-20)].join(' ')+'"/><rect x="'+(x-1.6*s).toFixed(1)+'" y="'+(y+2*s).toFixed(1)+'" width="'+(3.2*s).toFixed(1)+'" height="'+(5*s).toFixed(1)+'"/></g>';}
  function svg(vb,body,fit,cls){return '<svg class="art '+(cls||'')+'" viewBox="'+vb+'" preserveAspectRatio="'+(fit||'xMidYMax slice')+'" role="img" aria-hidden="true" focusable="false">'+body+'</svg>';}
  var ART={
    scene:function(sign){return svg('0 0 640 220',
      '<circle class="sun" cx="486" cy="62" r="30"/>'+
      '<path class="far" d="M0 140 L60 104 L110 126 L170 88 L230 120 L290 94 L340 118 L400 84 L460 116 L520 92 L580 120 L640 98 V220 H0Z"/>'+
      '<path class="peak" d="M206 168 L330 46 L454 168Z"/>'+
      '<path class="snow" d="M330 46 L299 77 L311 74 L321 84 L333 72 L345 82 L356 74 L362 78Z"/>'+
      '<path class="mid" d="M0 178 C80 150 150 160 220 170 C300 182 380 150 460 158 C540 166 600 154 640 160 V220 H0Z"/>'+
      '<path class="near" d="M0 200 C120 186 220 192 320 198 C430 204 540 186 640 194 V220 H0Z"/>'+
      '<path class="path" stroke-width="7" d="M296 222 C318 210 352 208 344 199 C336 191 302 192 318 184 C330 178 360 180 372 175"/>'+
      tree(36,200,.9)+tree(64,196,1.25,'tree2')+tree(96,201,1.05)+tree(128,192,.75,'tree2')+tree(470,186,.7,'tree2')+tree(512,194,1)+tree(546,199,1.35,'tree2')+tree(584,196,1.05)+tree(614,201,1.2,'tree2')+
      (sign?'<rect class="wood" x="392" y="160" width="4" height="34" rx="1"/><path class="sign" d="M396 158 h52 l8 8 l-8 8 h-52z"/><text class="signt" x="402" y="170">'+sign+'</text><path class="sign" d="M392 178 h-40 l-8 7 l8 7 h40z"/>':''));},
    ridge:function(){return '<svg class="ridge art" viewBox="0 0 1200 56" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="far" d="M0 56 V34 L80 20 L140 31 L230 10 L300 27 L380 16 L470 33 L560 12 L640 29 L720 18 L820 35 L900 14 L980 28 L1060 20 L1140 32 L1200 24 V56Z"/><path class="mid" d="M0 56 V44 C150 34 260 40 400 45 C560 50 700 36 860 41 C1000 46 1100 38 1200 42 V56Z"/></svg>';},
    trailhead:function(sign){sign=sign||'Trailhead';return svg('0 0 230 150',
      '<circle class="sun" cx="170" cy="40" r="20"/>'+
      '<path class="far" d="M0 104 L40 76 L72 92 L112 60 L150 88 L190 66 L230 84 V150 H0Z"/>'+
      '<path class="peak" d="M70 118 L128 50 L186 118Z"/><path class="snow" d="M128 50 L114 66 L120 64 L126 70 L132 63 L138 69 L142 65Z"/>'+
      '<path class="mid" d="M0 126 C60 112 120 120 170 122 C200 123 215 118 230 120 V150 H0Z"/>'+
      '<path class="path" stroke-width="5" d="M100 152 C112 144 132 142 126 136 C120 131 104 131 112 126"/>'+
      tree(22,136,.9)+tree(44,132,1.2,'tree2')+tree(196,132,1.1,'tree2')+tree(216,137,.85)+
      '<rect class="wood" x="150" y="104" width="3.5" height="30" rx="1"/><path class="sign" d="M153 104 h60 l7 7 l-7 7 h-60z"/><text class="signt" x="158" y="115">'+sign+'</text>','xMidYMid meet','');}
  };
  /* placeholders: <div data-art="scene" data-sign="Apr 15"></div> */
  [].forEach.call(d.querySelectorAll('[data-art]'),function(el){var k=el.getAttribute('data-art');if(ART[k])el.outerHTML=ART[k](el.getAttribute('data-sign'));});
  /* ridge above the footer */
  var ft=d.querySelector('footer');if(ft&&!d.querySelector('.ridge'))ft.insertAdjacentHTML('beforebegin',ART.ridge());
  /* guides: trailhead drawing beside the title */
  /* calculators and guides: a small trailhead drawing beside the title */
  var gh=d.querySelector('header.ghead, header.top');
  if(gh&&!gh.querySelector('.gart')&&gh.querySelector('h1')){var es=d.documentElement.lang==='es',zh=/^zh/.test(d.documentElement.lang);
    var sign=gh.classList.contains('ghead')?(es?'Sendero':zh?'步道':'Trailhead'):(es?'Empiece':zh?'从这里开始':'Start here');
    gh.classList.add('has-art');gh.insertAdjacentHTML('afterbegin','<div class="gart">'+ART.trailhead(sign)+'</div>');}
})();

/* ---- "Your summary": after someone types their own numbers, keep this page's headline result
   (only in this browser, localStorage "bm-results") so summary.html can list every result in one place ---- */
(function(){
  var d=document,f=d.getElementById('f'),sum=d.getElementById('sum');if(!f||!sum||!window.MutationObserver)return;
  var lg=d.documentElement.lang||'',es=lg==='es',zh=/^zh/.test(lg),mine=false,link=null;
  var page=location.pathname.split('/').pop()||'index.html';
  function save(){
    var tots=[].slice.call(sum.querySelectorAll('.tot')),h1=d.querySelector('h1');
    var tot=tots.filter(function(t){var x=t.querySelector('b');return x&&/[$¥]/.test(x.textContent);})[0]||tots[0];if(!tot||!h1)return;
    var b=tot.querySelector('b'),l=tot.querySelector('span'),h=sum.querySelector('h2'),p=sum.querySelector(':scope>p');
    var all={};try{all=JSON.parse(localStorage.getItem('bm-results')||'{}')||{};}catch(e){}
    all[page]={t:h1.textContent.trim(),h:h?h.textContent.trim():'',v:b?b.textContent.trim():'',l:l?l.textContent.trim():'',s:p?p.textContent.trim().slice(0,220):'',at:Date.now()};
    try{localStorage.setItem('bm-results',JSON.stringify(all));}catch(e){return;}
    if(!link){link=d.createElement('a');link.className='tosum';link.href='summary.html';
      link.textContent=es?'Guardado en su resumen →':zh?'已保存到您的摘要 →':'Saved to your summary →';sum.insertAdjacentElement('afterend',link);}
  }
  f.addEventListener('input',function(e){if(e.isTrusted){mine=true;setTimeout(save,60);}});
  f.addEventListener('change',function(e){if(e.isTrusted){mine=true;setTimeout(save,60);}});
  var reset=d.getElementById('reset');if(reset)reset.addEventListener('click',function(){mine=false;});
  new MutationObserver(function(){if(mine)save();}).observe(sum,{childList:true,subtree:true});
})();
