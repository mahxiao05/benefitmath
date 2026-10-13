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
