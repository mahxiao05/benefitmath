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

/* ---- "rules changed" email signup above the footer ---- */
/* EMAIL: paste your email provider's form address to turn the signup on, e.g. Buttondown:
   action: "https://buttondown.com/api/emails/embed-subscribe/YOURNAME" (field "email"),
   or Mailchimp's embedded-form action URL with field: "EMAIL". Empty action = hidden. */
window.BM_SIGNUP={action:"",field:"email"};
(function(){
  var C=window.BM_SIGNUP||{},ft=document.querySelector('footer');if(!C.action||!ft||document.querySelector('.signup'))return;
  var es=document.documentElement.lang==='es';
  var L=es?{h:'Avísame cuando cambien las reglas',p:'Un correo cuando cambien SNAP, los créditos tributarios o los beneficios de Oregon y Washington. Sin spam; cancele cuando quiera.',ph:'Su correo electrónico',b:'Suscribirme',ok:'¡Listo! Revise su correo para confirmar.'}
    :{h:'Get an email when the rules change',p:'One short email when SNAP, tax credits or Oregon and Washington benefits change. No spam; unsubscribe anytime.',ph:'Your email address',b:'Sign me up',ok:'Done! Check your inbox to confirm.'};
  var s=document.createElement('section');s.className='signup';s.setAttribute('aria-labelledby','su-h');
  s.innerHTML='<div><h2 id="su-h">'+L.h+'</h2><p>'+L.p+' <a href="privacy.html">'+(es?'Privacidad':'Privacy')+'</a></p></div>'+
    '<form method="post" target="_blank"><label class="vh" for="su-e">'+L.ph+'</label><input id="su-e" type="email" required autocomplete="email" placeholder="'+L.ph+'"><button type="submit">'+L.b+'</button></form><p class="su-ok" hidden>'+L.ok+'</p>';
  var f=s.querySelector('form'),i=s.querySelector('input');f.action=C.action;i.name=C.field||'email';
  f.addEventListener('submit',function(){setTimeout(function(){f.hidden=true;s.querySelector('.su-ok').hidden=false;},50);});
  ft.parentNode.insertBefore(s,ft);
})();

/* ---- site search: button in the top bar, keyword search over every page ----
   The index (assets/search-index.js) loads only when someone opens search.
   After adding or editing a page, rebuild it: python3 scripts/build-search-index.py */
(function(){
  var bar=document.querySelector('.site .site-r'),theme=bar&&bar.querySelector('.themebtn');if(!bar)return;
  var d=document,es=d.documentElement.lang==='es';
  var L=es?{btn:'Buscar',ph:'Buscar calculadoras y guías',none:'Sin resultados. Pruebe otra palabra, como "SNAP" o "reembolso".',hint:'Escriba una palabra, como SNAP, EITC o desempleo.',close:'Cerrar'}
    :{btn:'Search',ph:'Search calculators and guides',none:'No matches. Try another word, like "SNAP" or "refund".',hint:'Type a word, like SNAP, refund, EITC or unemployment.',close:'Close'};
  var b=d.createElement('button');b.type='button';b.className='themebtn searchbtn';b.setAttribute('aria-label',L.btn);b.title=L.btn+' (/)';
  b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.3 15.3 20.5 20.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  bar.insertBefore(b,theme||bar.firstChild);
  var box,inp,list,last,loading;
  /* other words people use for the same thing */
  var SYN={'food stamps':'snap','food stamp':'snap','ebt':'snap','cupones':'snap','estampillas':'snap','disability':'ssi ssdi','medicaid':'ohp apple health','obamacare':'marketplace','aca':'marketplace',
    'earned income':'eitc','ctc':'child tax credit','pfml':'paid leave','fmla':'paid leave','maternity':'paid leave','layoff':'unemployment','laid off':'unemployment','jobless':'unemployment','desempleo':'unemployment',
    'take home':'paycheck','salary':'paycheck','wages':'paycheck','refund':'refund reembolso','reembolso':'refund reembolso','social security':'ssi ssdi retirement cola','veteran':'va','daycare':'child care','gratuity':'tips','propinas':'tips'};
  var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9$%]+/g,' ').trim();};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var STOP=' a an and the of for to in on my i is it how what do does can with or de la el los las en y por para mi que como ';
  function load(cb){if(window.BM_SEARCH)return cb();if(loading)return;loading=1;var s=d.createElement('script');s.src='assets/search-index.js';s.onload=function(){(window.BM_SEARCH||[]).forEach(function(p){p.nt=norm(p.t);p.nh=norm(p.h);p.nd=norm(p.d);p.nb=norm(p.b);});cb();};s.onerror=function(){loading=0;};d.head.appendChild(s);}
  function search(q){
    var nq=' '+norm(q)+' ';Object.keys(SYN).forEach(function(k){if(nq.indexOf(' '+k+' ')>-1)nq+=' '+SYN[k]+' ';});
    var words=nq.split(' ').filter(function(w){return w&&STOP.indexOf(' '+w+' ')<0;});
    var typed=norm(q).split(' ').filter(function(w){return w&&STOP.indexOf(' '+w+' ')<0;});
    if(!typed.length)return [];
    var res=(window.BM_SEARCH||[]).map(function(p){
      var sc=0,hit=0;
      words.forEach(function(w){var m=0;
        if(p.nt.indexOf(w)>-1){sc+=8;m=1;} if(p.nh.indexOf(w)>-1){sc+=4;m=1;} if(p.nd.indexOf(w)>-1){sc+=3;m=1;}
        var n=p.nb.split(w).length-1;if(n){sc+=1+Math.min(n,6)*.4;m=1;}
        if(m&&typed.indexOf(w)>-1)hit++;});
      if(!sc)return null;
      if(hit===typed.length)sc+=10;           /* every typed word found */
      if(p.nt.indexOf(norm(q))>-1)sc+=10;      /* whole phrase in the title */
      if(p.l===(es?'es':'en'))sc+=3;
      if(/calculat|calculadora/.test(p.nt))sc+=3;  /* calculators first on a tie */
      return {p:p,s:sc,w:words,all:hit===typed.length};
    }).filter(Boolean);
    /* when some pages match every word, hide the ones that match only some */
    var r=res.some(function(x){return x.all;})?res.filter(function(x){return x.all;}):res;
    return r.sort(function(a,b){return b.s-a.s;}).slice(0,8);
  }
  function snip(p,ws){
    var fold=function(t){return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');};
    var t=p.d,at=-1;
    [p.d,p.b].some(function(src){var f=fold(src||'');return ws.some(function(w){var i=f.indexOf(w);if(i>-1){t=src;at=i;return true;}return false;});});
    if(at<0)return esc(p.d||p.b.slice(0,160));
    var st=t===p.d?0:Math.max(0,at-60),s=t===p.d?t:(st?'… ':'')+t.slice(st,st+170)+'…',h=esc(s);
    ws.forEach(function(w){if(w.length>2)h=h.replace(new RegExp('('+w.replace(/[$%]/g,'\\$&')+')','gi'),'<mark>$1</mark>');});
    return h;
  }
  function render(){
    var q=inp.value.trim();if(q===last)return;last=q;
    if(!q){list.innerHTML='<li class="sr-hint">'+L.hint+'</li>';return;}
    if(!window.BM_SEARCH){list.innerHTML='';return;}
    var r=search(q);
    list.innerHTML=r.length?r.map(function(x,i){return '<li><a href="'+esc(x.p.u)+'"'+(i?'':' class="sel"')+'><b>'+esc(x.p.t)+'</b><span>'+snip(x.p,x.w)+'</span></a></li>';}).join(''):'<li class="sr-hint">'+L.none+'</li>';
  }
  function open(){
    if(!box){
      box=d.createElement('div');box.className='srch';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label',L.btn);
      box.innerHTML='<div class="srch-in"><div class="srch-top"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.3 15.3 20.5 20.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg><input type="search" autocomplete="off" spellcheck="false" aria-label="'+L.ph+'" placeholder="'+L.ph+'"><button type="button" class="srch-x">'+L.close+'</button></div><ul class="srch-r" aria-live="polite"></ul></div>';
      d.body.appendChild(box);inp=box.querySelector('input');list=box.querySelector('ul');
      inp.addEventListener('input',function(){load(render);render();});
      box.addEventListener('click',function(e){if(e.target===box||e.target.closest('.srch-x'))close();});
      box.addEventListener('keydown',function(e){
        if(e.key==='Escape'){e.preventDefault();close();return;}
        var as=[].slice.call(list.querySelectorAll('a')),i=as.indexOf(list.querySelector('a.sel'));
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!as.length)return;e.preventDefault();if(i>-1)as[i].classList.remove('sel');i=(i+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as[i].classList.add('sel');as[i].scrollIntoView({block:'nearest'});}
        else if(e.key==='Enter'&&e.target===inp&&i>-1){e.preventDefault();location.href=as[i].getAttribute('href');}
        else if(e.key==='Tab'){var f=[inp,box.querySelector('.srch-x')].concat(as),k=f.indexOf(d.activeElement);if(e.shiftKey&&k<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&k===f.length-1){e.preventDefault();inp.focus();}}
      });
    }
    box.hidden=false;d.documentElement.classList.add('srch-open');b.setAttribute('aria-expanded','true');last=null;render();inp.focus();inp.select();load(function(){last=null;render();});
  }
  function close(){if(!box||box.hidden)return;box.hidden=true;d.documentElement.classList.remove('srch-open');b.setAttribute('aria-expanded','false');b.focus();}
  b.setAttribute('aria-expanded','false');b.addEventListener('click',open);
  d.addEventListener('keydown',function(e){var t=e.target,typing=/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable;
    if((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')){e.preventDefault();open();}});
})();
