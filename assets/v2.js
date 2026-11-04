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
    var side=d.createElement('aside');side.className='gside';side.setAttribute('aria-label','On this page');
    var toc=d.createElement('div');toc.className='gtoc';toc.innerHTML='<p>On this page</p>';
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
      c.querySelector('span').textContent=s?s.textContent:'';var a=c.querySelector('a');a.href=calc.getAttribute('href');a.textContent='Open the calculator';side.appendChild(c);}
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
