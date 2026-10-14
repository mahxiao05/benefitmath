/* BenefitMath shared script: theme toggle, Calculators menu, optional analytics. */
/* ANALYTICS: paste your ID to turn it on, e.g. plausible: "benefitmath.com" or ga4: "G-XXXXXXX". Empty = off. */
window.BM_ANALYTICS={plausible:"",ga4:""};
(function(){var A=window.BM_ANALYTICS||{},d=document,s;
 if(A.plausible){s=d.createElement('script');s.defer=true;s.setAttribute('data-domain',A.plausible);s.src='https://plausible.io/js/script.js';d.head.appendChild(s);}
 if(A.ga4){s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+A.ga4;d.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config',A.ga4);}
})();
(function(){
  var tb=document.querySelector('.themebtn'),R=document.documentElement;
  function eff(){var a=R.getAttribute('data-theme');return a||'light';}
  function label(){if(tb){var d=eff()==='dark';tb.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');}}
  if(tb){tb.addEventListener('click',function(){var n=eff()==='dark'?'light':'dark';R.setAttribute('data-theme',n);try{localStorage.setItem('bm-theme',n);}catch(e){}label();});label();}
})();
(function(){
  var site=document.querySelector('.site'),btn=site&&site.querySelector('.navbtn');
  if(!btn)return;
  function set(o){site.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');}
  btn.addEventListener('click',function(e){e.stopPropagation();set(!site.classList.contains('open'));});
  document.addEventListener('click',function(e){if(!site.contains(e.target))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&site.classList.contains('open')){set(false);btn.focus();}});
})();

/* ---- share / copy / print bar under calculator results ---- */
(function(){
  var sum=document.querySelector('.summary');if(!sum||document.querySelector('.sharebar'))return;
  var es=document.documentElement.lang==='es',canShare=!!navigator.share;
  var L=es?{share:'Compartir',link:'Copiar enlace',copy:'Copiar resultados',print:'Imprimir',ok:'¡Copiado!'}:{share:'Share',link:'Copy link',copy:'Copy results',print:'Print',ok:'Copied!'};
  var bar=document.createElement('div');bar.className='sharebar';
  bar.innerHTML='<button type="button" data-a="share">'+(canShare?L.share:L.link)+'</button>'+(document.getElementById('copy')?'':'<button type="button" data-a="copy">'+L.copy+'</button>')+'<button type="button" data-a="print">'+L.print+'</button>';
  sum.insertAdjacentElement('afterend',bar);
  var url=function(){return location.href.split('#')[0];};
  function text(){return sum.innerText.replace(/\n{2,}/g,'\n').trim()+'\n\n'+document.title.split(' | ')[0]+'\n'+url();}
  function flash(b){var o=b.textContent;b.textContent=L.ok;setTimeout(function(){b.textContent=o;},1600);}
  function copy(s,b){var fb=function(){var t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');flash(b);}catch(e){}t.remove();};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(function(){flash(b);},fb);}else fb();}
  bar.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var a=b.getAttribute('data-a');
    if(a==='share'){if(canShare){navigator.share({title:document.title,text:text(),url:url()}).catch(function(){});}else copy(url(),b);}
    else if(a==='copy')copy(text(),b);
    else if(a==='print')window.print();});
})();

/* ---- lighter pages: short FAQs, and fold extra sections on phones ---- */
(function(){
  var es=document.documentElement.lang==='es';
  /* FAQs: show the first 5, the rest behind a button (they stay in the page for search) */
  document.querySelectorAll('section.faq').forEach(function(sec){
    var items=[].slice.call(sec.querySelectorAll(':scope > details, :scope > div > details')).filter(function(d){return (d.parentNode===sec||d.parentNode.parentNode===sec)&&!/^\s*(Sources|Fuentes)/.test((d.querySelector('summary')||{}).textContent||'');});
    if(items.length<=5||sec.querySelector('.faqmore'))return;
    var extra=items.slice(5);extra.forEach(function(d){d.hidden=true;});
    var b=document.createElement('button');b.type='button';b.className='faqmore';
    var lab=function(open){return open?(es?'Menos preguntas':'Fewer questions'):(es?'Más preguntas ('+extra.length+')':'More questions ('+extra.length+')');};
    b.textContent=lab(false);b.setAttribute('aria-expanded','false');
    extra[extra.length-1].insertAdjacentElement('afterend',b);
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';extra.forEach(function(d){d.hidden=!o;});b.setAttribute('aria-expanded',String(o));b.textContent=lab(o);});
    /* opening a hidden FAQ from a link (#id) reveals it */
    if(location.hash){var t=sec.querySelector(location.hash);if(t&&t.hidden){b.click();}}
  });
  /* Phones: sections below the calculator open with a tap */
  var mq=window.matchMedia&&matchMedia('(max-width:760px)');
  if(!mq||!mq.matches||!document.getElementById('calculator'))return;
  var secs=[].slice.call(document.querySelectorAll('section.fsec, section.related, section#limits, section#arrive, section#stretch, section#state'));
  secs=secs.filter(function(s,i){return secs.indexOf(s)===i;});
  secs.forEach(function(s){
    var h=s.querySelector('h2');if(!h||s.classList.contains('fold'))return;
    var body=document.createElement('div');body.className='foldin';
    while(h.nextSibling)body.appendChild(h.nextSibling);
    s.appendChild(body);s.classList.add('fold');
    h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');
    var tog=function(open){s.classList.toggle('open',open);h.setAttribute('aria-expanded',String(open));};
    h.addEventListener('click',function(){tog(!s.classList.contains('open'));});
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog(!s.classList.contains('open'));}});
    s._open=function(){tog(true);};
  });
  function openHash(){var id=location.hash.slice(1);if(!id)return;var t=document.getElementById(id);if(t&&t._open)t._open();}
  window.addEventListener('hashchange',openHash);openHash();
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var t=document.getElementById(a.getAttribute('href').slice(1));if(t&&t._open)t._open();});
})();
/* Prefill a calculator from a link another calculator sends, e.g. or-vs-wa.html?sal=52000&fs=mfj.
   Keys are form field ids; checkboxes and radios take 1 or 0. Pages keep their canonical URL, so search engines see one page. */
(function(){
  var f=document.getElementById('f');if(!f||!location.search||!window.URLSearchParams)return;
  var hit=false;
  new URLSearchParams(location.search).forEach(function(v,k){
    var e=document.getElementById(k);if(!e||!f.contains(e)||!/^(INPUT|SELECT)$/.test(e.tagName))return;
    if(e.type==='checkbox'||e.type==='radio')e.checked=v==='1';
    else if(e.tagName==='SELECT'){if(![].some.call(e.options,function(o){return o.value===v;}))return;e.value=v;}
    else e.value=v;
    hit=true;
  });
  if(hit){var n=f.querySelector('.sample');if(n)n.hidden=true;f.dispatchEvent(new Event('change',{bubbles:true}));}
})();
