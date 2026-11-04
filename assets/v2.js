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

/* ---- Photos (Pexels license: free to use, no attribution required; we credit anyway).
   Placeholders: <div data-photo="mountain"></div>. To swap a photo, change its entry here.
   - file: our own WebP copies in assets/photos/ (made by scripts/add-photo.py). Preferred: fast, never breaks.
   - pexels: photo id, used straight from Pexels' image server until we have our own copy.
   Images load only when scrolled near (loading=lazy), have a fixed shape (no page jump),
   and if one fails to load its spot quietly disappears. ---- */
(function(){
  var d=document;
  var PHOTOS={
    mountain:{file:'mountain',pexels:'5409751',page:'https://www.pexels.com/photo/snow-capped-mountain-under-gray-clouds-5409751/',
      alt:'Mount Hood at sunset above a dark evergreen forest',cap:'Made for Oregon and Washington.',ratio:'3/1'},
    bills:{file:'bills',pexels:'6964105',page:'https://www.pexels.com/photo/couple-looking-at-their-bills-6964105/',
      alt:'A couple going over their bills and tax papers together at home',cap:'Have your W-2s and last year’s return handy and the numbers go fast.',ratio:'5/2'},
    family:{file:'helpers',pexels:'6646917',page:'https://www.pexels.com/photo/volunteers-handing-out-food-and-water-6646917/',
      alt:'Volunteers handing out food and water at a community table',cap:'Food banks, WIC offices and energy programs are there to help.',ratio:'5/2'},
    forest:{file:'forest',pexels:'1179229',page:'https://www.pexels.com/photo/aerial-view-of-evergreen-forest-1179229/',
      alt:'Looking down on a dense evergreen forest',ratio:'3/1'}
  };
  var es=d.documentElement.lang==='es',zh=/^zh/.test(d.documentElement.lang);
  var credit=es?'Foto: Pexels':zh?'图片：Pexels':'Photo: Pexels';
  function srcs(p){
    if(p.file)return {src:'assets/photos/'+p.file+'-1200.webp',set:'assets/photos/'+p.file+'-640.webp 640w, assets/photos/'+p.file+'-1200.webp 1200w'};
    var u='https://images.pexels.com/photos/'+p.pexels+'/pexels-photo-'+p.pexels+'.jpeg?auto=compress&cs=tinysrgb&w=';
    return {src:u+1200,set:u+640+' 640w, '+u+960+' 960w, '+u+1400+' 1400w'};
  }
  /* photo headers: <header class="phero" data-ph="name" data-pp="center 40%"> gets the photo behind its words */
  [].forEach.call(d.querySelectorAll('.phero[data-ph]'),function(h){
    var p=PHOTOS[h.getAttribute('data-ph')];if(!p||!p.file)return;
    var w=d.createElement('div');w.className='phbg';w.setAttribute('aria-hidden','true');
    var img=d.createElement('img');img.alt='';img.decoding='async';img.sizes='(max-width:760px) 100vw, 70vw';
    img.style.objectPosition=h.getAttribute('data-pp')||'center';
    img.srcset='assets/photos/'+p.file+'-640.webp 640w, assets/photos/'+p.file+'-1200.webp 1200w';img.src='assets/photos/'+p.file+'-1200.webp';
    img.addEventListener('load',function(){w.classList.add('in');});img.addEventListener('error',function(){w.remove();});
    w.appendChild(img);h.insertBefore(w,h.firstChild);
  });
  [].forEach.call(d.querySelectorAll('[data-photo]'),function(el){
    var p=PHOTOS[el.getAttribute('data-photo')];if(!p){el.remove();return;}
    var s=srcs(p),f=d.createElement('figure');f.className='photo '+(el.className||'');
    var cap=el.getAttribute('data-cap');if(cap===null)cap=es||zh?'':(p.cap||'');
    f.innerHTML='<div class="ph" style="aspect-ratio:'+p.ratio+'"><img alt="" loading="lazy" decoding="async" sizes="(max-width:1100px) 100vw, 1100px"></div>'+
      '<figcaption>'+(cap?'<span>'+cap+'</span>':'')+'<a href="'+p.page+'" target="_blank" rel="noopener">'+credit+'</a></figcaption>';
    var img=f.querySelector('img');img.alt=p.alt;img.srcset=s.set;img.src=s.src;
    img.addEventListener('error',function(){f.remove();});
    img.addEventListener('load',function(){f.classList.add('in');});
    el.replaceWith(f);
  });
})();
