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
