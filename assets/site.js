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
  function label(){if(tb){var d=eff()==='dark';var lg=document.documentElement.lang||'';tb.setAttribute('aria-label',lg==='es'?(d?'Cambiar a modo claro':'Cambiar a modo oscuro'):/^zh/.test(lg)?(d?'切换到浅色模式':'切换到深色模式'):(d?'Switch to light mode':'Switch to dark mode'));}}
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
  var es=document.documentElement.lang==='es',zh=/^zh/.test(document.documentElement.lang),canShare=!!navigator.share;
  var L=es?{share:'Compartir',link:'Copiar enlace',copy:'Copiar resultados',print:'Imprimir',ok:'¡Copiado!'}:zh?{share:'分享',link:'复制链接',copy:'复制结果',print:'打印',ok:'已复制！'}:{share:'Share',link:'Copy link',copy:'Copy results',print:'Print',ok:'Copied!'};
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
    var items=[].slice.call(sec.querySelectorAll(':scope > details, :scope > div > details')).filter(function(d){return (d.parentNode===sec||d.parentNode.parentNode===sec)&&!/^\s*(Sources|Fuentes|资料来源|来源)/.test((d.querySelector('summary')||{}).textContent||'');});
    if(items.length<=5||sec.querySelector('.faqmore'))return;
    var extra=items.slice(5);extra.forEach(function(d){d.hidden=true;});
    var b=document.createElement('button');b.type='button';b.className='faqmore';
    var zh=/^zh/.test(document.documentElement.lang);var lab=function(open){return open?(es?'Menos preguntas':zh?'收起问题':'Fewer questions'):(es?'Más preguntas ('+extra.length+')':zh?'更多问题（'+extra.length+'）':'More questions ('+extra.length+')');};
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
/* ---- shared answers: numbers typed in one calculator fill in the others ----
   Saved only in this browser (localStorage "bm-profile"). Each page lists which of its fields map to a shared answer.
   Shared answers: st (or/wa), hh (household size), age, fs (filing status), kids (under 17), k19 (under 19),
   n65 (people 65+), earnY (yearly pay from work), incM (household income per month).
   To share a new field, add it to MAP under the page's name. Translated pages use the English page's entry. */
(function(){
  var f=document.getElementById('f')||document.getElementById('sf');if(!f)return;
  var KEY='bm-profile',d=document;
  var page=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'')||'index';
  page=({'calculadora-reembolso-impuestos':'tax-refund','zh-tax-refund':'tax-refund','calculadora-eitc':'eitc','zh-eitc':'eitc',
    'calculadora-credito-por-hijos':'child-tax-credit','zh-child-tax-credit':'child-tax-credit','calculadora-snap':'snap','zh-snap':'snap'})[page]||page;
  var has=function(v){return v!==undefined&&v!==null&&v!=='';};
  var num=function(v){return has(v)&&isFinite(+v)?+v:undefined;};
  var r=Math.round;
  /* field builders: in(P,val) turns shared answers into this field's value; out(v,val) turns the field's value into shared answers */
  function N(id,k,o){o=o||{};return {id:id,in:o.in||function(P){return num(P[k]);},out:o.out||function(v){var n=num(v);return n===undefined?null:obj(k,n);}};}
  function S(id,k,o){o=o||{};return {id:id,in:o.in||function(P){return has(P[k])?String(P[k]):undefined;},out:o.out||function(v){return has(v)?obj(k,v):null;}};}
  function R(ids,k){return {radio:ids,in:function(P){return P[k];},out:function(v){return v?obj(k,v):null;}};}
  function obj(k,v){var o={};o[k]=v;return o;}
  var ST=R({or:'st-or',wa:'st-wa'},'st');
  var kidsIn=function(P){return num(has(P.kids)?P.kids:P.k19);}, k19In=function(P){return num(has(P.k19)?P.k19:P.kids);};
  var eitcKids=S('kids','',{in:function(P){var k=k19In(P);return k===undefined?undefined:String(Math.min(3,k));},out:function(){return null;}});
  var yr=function(id){return N(id,'earnY');};
  var mo=function(id){return N(id,'earnY',{in:function(P){var n=num(P.earnY);return n===undefined?undefined:r(n/12);},out:function(v){var n=num(v);return n===undefined?null:{earnY:n*12};}});};
  var MAP={
    'index':[R({or:'s-or',wa:'s-wa'},'st'),N('s-hh','hh'),N('s-inc','incM'),N('s-age','age'),N('s-kids','k19',{in:k19In})],
    'tax-refund':[S('fs','fs'),S('n65','n65'),yr('earned'),
      N('kids','kids',{in:kidsIn,out:function(v,val){var n=num(v);return n===undefined?null:{kids:n,k19:n+(num(val('older'))||0)};}}),
      N('older','',{in:function(P){var a=num(P.k19),b=kidsIn(P);return a===undefined||b===undefined?undefined:Math.max(0,a-b);},out:function(v,val){var n=num(v);return n===undefined?null:{k19:n+(num(val('kids'))||0)};}})],
    'eitc':[S('fs','fs'),yr('earned'),eitcKids],
    'child-tax-credit':[S('fs','fs'),yr('earned'),N('kids','kids',{in:kidsIn})],
    'overtime':[S('fs','fs'),S('x65','n65')],
    'tips':[S('fs','fs'),S('x65','n65')],
    'senior-deduction':[S('fs','fs'),S('n65','n65',{in:function(P){var n=num(P.n65);return n>=1?String(Math.min(2,n)):undefined;}})],
    'state-credits':[ST,eitcKids,S('fs','fs',{in:function(P){return has(P.fs)?(P.fs==='mfj'?'j':'s'):undefined;},out:function(v){return v==='j'?{fs:'mfj'}:(load().fs==='mfj'?{fs:'single'}:null);}})],
    'paycheck':[ST,S('fs','fs'),N('gross','earnY',{in:function(P){var n=num(P.earnY),p=num(val('per'));return n===undefined||!p?undefined:r(n/p);},out:function(v){var n=num(v),p=num(val('per'));return n===undefined||!p?null:{earnY:r(n*p)};}})],
    'or-vs-wa':[S('fs','fs'),yr('sal')],
    'snap':[ST,S('hh','hh',{in:function(P){var n=num(P.hh);return n===undefined?undefined:String(Math.max(1,Math.min(10,n)));}}),mo('earn')],
    'benefits':[ST,N('hh','hh'),N('age','age'),mo('earned')],
    'health-coverage':[ST,N('hh','hh'),N('age','age'),N('inc','incM',{in:function(P){var n=num(P.incM);return n===undefined?undefined:r(n*12);},out:function(v){var n=num(v);return n===undefined?null:{incM:r(n/12)};}})],
    'child-care':[ST,N('hh','hh'),N('inc','incM')],
    'family-help':[ST,N('hh','hh'),mo('earn')],
    'ssi-ssdi-work':[ST,mo('earn')],
    'unemployment':[ST],
    'paid-leave':[ST,yr('yr')],
    'wa-cares':[yr('wages')],
    'tax-brackets':[S('fs','fs'),S('n65','n65'),yr('inc')],
    'w4-withholding':[S('fs','fs'),N('kids','kids',{in:kidsIn}),N('gross','earnY',{in:function(P){var n=num(P.earnY),p=num(val('per'));return n===undefined||!p?undefined:r(n/p);},out:function(v){var n=num(v),p=num(val('per'));return n===undefined||!p?null:{earnY:r(n*p)};}})],
    'self-employment-tax':[S('fs','fs')],
    'medicare-premiums':[S('fs','fs',{in:function(P){return has(P.fs)?(P.fs==='mfj'||P.fs==='mfs'?P.fs:'ind'):undefined;},out:function(v){return v==='ind'?(/^mf/.test(load().fs||'')?{fs:'single'}:null):{fs:v};}})]
  }[page];
  if(!MAP)return;
  function val(id){var e=d.getElementById(id);return e?e.value:undefined;}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{};}catch(e){return {};}}
  function store(P){try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}}
  function el(s){return s.radio?null:d.getElementById(s.id);}
  function get(s){if(s.radio){for(var k in s.radio){var e=d.getElementById(s.radio[k]);if(e&&e.checked)return k;}return undefined;}var e=el(s);return e?e.value:undefined;}
  function set(s,v){
    if(s.radio){var e=d.getElementById(s.radio[v]);if(!e||e.checked)return false;e.checked=true;return true;}
    var e=el(s);if(!e)return false;v=String(v);
    if(e.tagName==='SELECT'&&![].some.call(e.options,function(o){return o.value===v;}))return false;
    if(e.value===v||(num(e.value)!==undefined&&num(v)!==undefined&&Math.abs(num(e.value)-num(v))<1))return false;
    e.value=v;return true;
  }
  /* 1. fill in from shared answers (links with ?field=value, read after this, still win) */
  var P=load(),before=[],n=0;
  MAP.forEach(function(s){if(!s.radio&&!el(s))return;var v=s.in(P,val);if(v===undefined)return;var old=get(s);if(set(s,v)){before.push([s,old]);n++;}});
  if(n){
    var note=f.querySelector('.sample');if(note)note.hidden=true;
    f.dispatchEvent(new Event('change',{bubbles:true}));
    var lg=d.documentElement.lang||'',es=lg==='es',zh=/^zh/.test(lg);
    var L=es?{t:function(n){return 'Completamos '+n+(n>1?' respuestas':' respuesta')+' con lo que escribió en otras calculadoras.';},s:'Se guarda solo en este dispositivo.',u:'Deshacer'}
      :zh?{t:function(n){return '已用您在其他计算器中填写的内容填好 '+n+' 项。';},s:'只保存在本设备上。',u:'撤销'}
      :{t:function(n){return 'We filled in '+n+(n>1?' answers':' answer')+' from your other calculators.';},s:'Saved only on this device.',u:'Undo'};
    var bar=d.createElement('p');bar.className='prefill';bar.setAttribute('role','status');
    bar.innerHTML='<span>'+L.t(n)+' <small>'+L.s+'</small></span><button type="button">'+L.u+'</button>';
    bar.querySelector('button').addEventListener('click',function(){before.forEach(function(b){if(has(b[1]))set(b[0],b[1]);});f.dispatchEvent(new Event('change',{bubbles:true}));bar.remove();});
    f.insertBefore(bar,f.firstChild);
  }
  /* 2. when someone types here, update the shared answers */
  function onEdit(e){
    if(!e.target||e.target===f||!e.target.id)return;var id=e.target.id;
    MAP.forEach(function(s){
      var mine=s.radio?Object.keys(s.radio).some(function(k){return s.radio[k]===id;}):s.id===id;
      if(!mine)return;var P=load(),o=s.out(get(s),val);if(!o)return;
      for(var k in o)P[k]=o[k];store(P);
    });
    var b=f.querySelector('.prefill');if(b&&e.type==='change')b.remove();
  }
  f.addEventListener('input',onEdit);f.addEventListener('change',onEdit);
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
    :/^zh/.test(document.documentElement.lang)?{h:'规则变化时通知我',p:'SNAP、税收抵免或俄勒冈州和华盛顿州福利有变化时，我们发一封简短邮件。没有垃圾邮件，随时可退订。',ph:'您的电子邮箱',b:'订阅',ok:'完成！请查收邮件确认。'}
    :{h:'Get an email when the rules change',p:'One short email when SNAP, tax credits or Oregon and Washington benefits change. No spam; unsubscribe anytime.',ph:'Your email address',b:'Sign me up',ok:'Done! Check your inbox to confirm.'};
  var s=document.createElement('section');s.className='signup';s.setAttribute('aria-labelledby','su-h');
  s.innerHTML='<div><h2 id="su-h">'+L.h+'</h2><p>'+L.p+' <a href="privacy.html">'+(es?'Privacidad':/^zh/.test(document.documentElement.lang)?'隐私政策':'Privacy')+'</a></p></div>'+
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
  var d=document,es=d.documentElement.lang==='es',zh=/^zh/.test(d.documentElement.lang);
  var L=zh?{btn:'搜索',ph:'搜索计算器和指南',none:'没有结果。请换个词试试，比如“SNAP”或“退税”。',hint:'输入一个词，比如 SNAP、退税或 EITC。',close:'关闭'}:es?{btn:'Buscar',ph:'Buscar calculadoras y guías',none:'Sin resultados. Pruebe otra palabra, como "SNAP" o "reembolso".',hint:'Escriba una palabra, como SNAP, EITC o desempleo.',close:'Cerrar'}
    :{btn:'Search',ph:'Search calculators and guides',none:'No matches. Try another word, like "SNAP" or "refund".',hint:'Type a word, like SNAP, refund, EITC or unemployment.',close:'Close'};
  var b=d.createElement('button');b.type='button';b.className='themebtn searchbtn';b.setAttribute('aria-label',L.btn);b.title=L.btn+' (/)';
  b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.3 15.3 20.5 20.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  bar.insertBefore(b,theme||bar.firstChild);
  var box,inp,list,last,loading;
  /* other words people use for the same thing */
  var SYN={'food stamps':'snap','food stamp':'snap','ebt':'snap','cupones':'snap','estampillas':'snap','disability':'ssi ssdi','medicaid':'ohp apple health','obamacare':'marketplace','aca':'marketplace',
    'earned income':'eitc','ctc':'child tax credit','pfml':'paid leave','fmla':'paid leave','maternity':'paid leave','layoff':'unemployment','laid off':'unemployment','jobless':'unemployment','desempleo':'unemployment',
    'take home':'paycheck','salary':'paycheck','wages':'paycheck','refund':'refund reembolso','reembolso':'refund reembolso','social security':'ssi ssdi retirement cola','veteran':'va','daycare':'child care','gratuity':'tips','propinas':'tips',
    '粮食券':'snap','食品券':'snap','食物券':'snap','退税':'refund','儿童':'child tax credit','失业':'unemployment','医疗':'ohp apple health','残疾':'ssi ssdi'};
  var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9$%\u3400-\u9fff]+/g,' ').trim();};
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
      if(p.l===(es?'es':zh?'zh':'en'))sc+=3;
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

/* ---- calmer results: "Show the math" starts closed, and extra info cards fold into one "More about your result" box ----
   Nothing is removed. Cards with a dollar amount, the first chart, and "how to apply" / "you may also qualify" cards stay in view. */
(function(){
  var d=document;if(!window.MutationObserver||/benefits\.html$/.test(location.pathname))return;
  [].filter.call(d.querySelectorAll('.results'),function(b){return !b.parentNode.closest('.results');}).forEach(calm);
  function calm(box){
  var lg=d.documentElement.lang||'',es=lg==='es',zh=/^zh/.test(lg);
  var LBL=function(n){return es?'Más sobre su resultado ('+n+')':zh?'关于结果的更多信息（'+n+'）':'More about your result ('+n+')';};
  var KEEP=/apply|qualify|solicitar|calific|申请|符合/i, opened={}, moreOpen=false, busy=false;
  var title=function(c){var h=c.querySelector('h3');return h?h.textContent.trim():'';};
  function tidy(){
    if(busy)return;busy=true;
    /* math boxes: closed unless the visitor opened that one */
    var many=box.querySelectorAll('article.card').length>1;
    if(many)[].forEach.call(box.querySelectorAll('details.math'),function(m){var c=m.closest('article');var want=!!opened[c?title(c):''];if(m.open!==want)m.open=want;});
    /* fold extra info cards, per container */
    var parents=[];[].forEach.call(box.querySelectorAll('article.card'),function(c){var p=c.parentNode;if(p.classList.contains('morein'))p=p.parentNode.parentNode;if(parents.indexOf(p)<0)parents.push(p);});
    /* pages that already fold their own cards (like the disability page) are left as they are */
    if([].some.call(box.querySelectorAll('details:not(.morecards):not(.math) article.card'),function(){return true;}))return busy=false;
    parents.forEach(function(p){
      if(p.querySelector(':scope > details.morecards'))return;
      var chart=false,fold=[].filter.call(p.children,function(c){
        if(c.tagName!=='ARTICLE'||!c.classList.contains('card')||c.querySelector('.amt'))return false;
        if(KEEP.test(title(c)))return false;
        if(c.classList.contains('bmc')&&!chart){chart=true;return false;}
        return true;});
      if(fold.length<2)return;
      var det=d.createElement('details');det.className='morecards';det.open=moreOpen;
      det.innerHTML='<summary>'+LBL(fold.length)+'</summary><div class="morein"></div>';
      p.insertBefore(det,fold[0]);var inn=det.querySelector('.morein');fold.forEach(function(c){inn.appendChild(c);});
      det.addEventListener('toggle',function(){moreOpen=det.open;});
    });
    busy=false;
  }
  box.addEventListener('click',function(e){var s=e.target.closest&&e.target.closest('details.math > summary');if(!s)return;var c=s.closest('article');if(c)opened[title(c)]=!s.parentNode.open;});
  new MutationObserver(function(){if(!busy)tidy();}).observe(box,{childList:true,subtree:true});
  tidy();
  }
})();
