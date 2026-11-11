/* BenefitMath look "A · Step by step" (Nov 2026).
   1. Homepage topic picker: tapping a topic shows its calculators (without JavaScript every topic shows).
   2. Step-by-step calculators: on phones, a calculator with two or more sections shows one section at a time,
      with Back / Next and a progress bar. "Show all questions" switches back to the full form (remembered).
      Nothing is removed: every field is still there, the results still update as you type. */
(function(){
"use strict";
var d=document;
function ready(f){if(d.readyState!=="loading")f();else d.addEventListener("DOMContentLoaded",f);}

/* ---------- 1. topic picker ---------- */
function topics(){
  var pick=d.querySelector(".tpick");if(!pick)return;
  var btns=[].slice.call(pick.querySelectorAll(".tbtn")), host=d.documentElement;
  host.classList.add("js-tp");
  function show(id,focus){
    btns.forEach(function(b){var on=b.getAttribute("aria-controls")===id;b.setAttribute("aria-pressed",on?"true":"false");
      var p=d.getElementById(b.getAttribute("aria-controls"));if(p)p.hidden=!on;});
    try{sessionStorage.setItem("bm-topic",id);}catch(e){}
    if(focus){var p=d.getElementById(id);if(p&&p.getBoundingClientRect().top>innerHeight-80)p.scrollIntoView({behavior:"smooth",block:"nearest"});}
  }
  var start=btns[0].getAttribute("aria-controls");
  try{var s=sessionStorage.getItem("bm-topic");if(s&&d.getElementById(s))start=s;}catch(e){}
  btns.forEach(function(b){b.addEventListener("click",function(){show(b.getAttribute("aria-controls"),true);});});
  show(start,false);
}

/* ---------- 2. step-by-step calculators ---------- */
var L={en:{step:"Step {n} of {t}",next:"Next",back:"Back",done:"See my result",all:"Show all questions",one:"One section at a time"},
       es:{step:"Paso {n} de {t}",next:"Siguiente",back:"Atrás",done:"Ver mi resultado",all:"Ver todas las preguntas",one:"Una sección a la vez"},
       zh:{step:"第 {n} 步，共 {t} 步",next:"下一步",back:"上一步",done:"查看结果",all:"显示全部问题",one:"一次一部分"}};
var lang=(d.documentElement.lang||"en").slice(0,2), T=L[lang]||L.en;
var mq=window.matchMedia("(max-width:760px)"), KEY="bm-steps";
function pref(){try{return localStorage.getItem(KEY)!=="all";}catch(e){return true;}}
function setPref(on){try{localStorage.setItem(KEY,on?"steps":"all");}catch(e){}}

function stepify(form){
  var nav=d.createElement("div"),btns=d.createElement("div"),i=0;
  nav.className="stepnav";
  nav.innerHTML='<div class="st-top"><span class="st-lbl" aria-live="polite"></span><button type="button" class="st-mode"></button></div><div class="st-bar" aria-hidden="true"><i></i></div>';
  btns.className="stepbtns";
  btns.innerHTML='<button type="button" class="st-back"></button><button type="button" class="st-next"></button>';
  form.insertBefore(nav,form.firstChild);
  var after=null,kids=[].slice.call(form.children);
  for(var k=kids.length-1;k>=0;k--){if(kids[k].tagName==="FIELDSET"){after=kids[k];break;}}
  if(after)after.parentNode.insertBefore(btns,after.nextSibling);
  var back=btns.querySelector(".st-back"),next=btns.querySelector(".st-next"),mode=nav.querySelector(".st-mode"),lbl=nav.querySelector(".st-lbl"),bar=nav.querySelector(".st-bar i");
  back.textContent=T.back;
  function sets(){return [].slice.call(form.children).filter(function(f){return f.tagName==="FIELDSET"&&!f.hidden;});}
  function on(){return mq.matches&&pref()&&sets().length>1;}
  function render(){
    var all=[].slice.call(form.children).filter(function(f){return f.tagName==="FIELDSET";}), vis=sets(), stepping=on();
    form.classList.toggle("is-steps",stepping);
    nav.hidden=!mq.matches||vis.length<2; btns.hidden=!stepping;
    mode.textContent=stepping?T.all:T.one;
    all.forEach(function(f){f.classList.remove("st-off");});
    if(!stepping){lbl.textContent="";bar.parentNode.hidden=true;return;}
    bar.parentNode.hidden=false;
    if(i>vis.length-1)i=vis.length-1;
    vis.forEach(function(f,n){if(n!==i)f.classList.add("st-off");});
    var lg=vis[i].querySelector("legend");
    lbl.textContent=T.step.replace("{n}",i+1).replace("{t}",vis.length)+(lg?" · "+lg.textContent.trim():"");
    bar.style.width=Math.round((i+1)/vis.length*100)+"%";
    back.disabled=i===0; next.textContent=i===vis.length-1?T.done:T.next;
  }
  function go(n){
    i=n;render();
    var top=form.getBoundingClientRect().top;
    if(top<0||top>innerHeight*.5)window.scrollTo({top:scrollY+top-76,behavior:"smooth"});
    var f=sets()[i],first=f&&f.querySelector("input:not([type=hidden]),select");
    if(f&&first&&!/radio|checkbox/.test(first.type))setTimeout(function(){try{first.focus({preventScroll:true});}catch(e){}},220);
  }
  next.addEventListener("click",function(){
    var vis=sets();
    if(i<vis.length-1){go(i+1);return;}
    var res=d.getElementById("sum")||(form.parentNode&&form.parentNode.querySelector(".results"));
    if(res)window.scrollTo({top:scrollY+res.getBoundingClientRect().top-76,behavior:"smooth"});
  });
  back.addEventListener("click",function(){if(i>0)go(i-1);});
  mode.addEventListener("click",function(){setPref(!on());i=0;render();});
  /* fields that show or hide whole sections (e.g. state choice) change the step count */
  form.addEventListener("change",function(){setTimeout(render,0);});
  if(mq.addEventListener)mq.addEventListener("change",render);else if(mq.addListener)mq.addListener(render);
  render();
}
function steps(){
  [].slice.call(d.querySelectorAll("form.panel")).forEach(function(f){
    var n=[].slice.call(f.children).filter(function(c){return c.tagName==="FIELDSET";}).length;
    if(n>1)stepify(f);
  });
}

/* ---------- 3. simpler pages ---------- */
var SC={en:"What this covers",es:"Qué cubre",zh:"适用范围"};
function simplify(){
  /* the "this is a federal tool for…" box folds behind one line */
  [].slice.call(d.querySelectorAll("header .scopebox")).forEach(function(b){
    var det=d.createElement("details"),s=d.createElement("summary"),p=d.createElement("p");
    det.className="scopefold";s.textContent=SC[lang]||SC.en;p.innerHTML=b.innerHTML;det.appendChild(s);det.appendChild(p);b.replaceWith(det);
  });
  /* dark-mode switch moves into the Calculators menu */
  var tb=d.querySelector('.site .themebtn[title="Light or dark mode"]'),ml=d.querySelector(".mega-foot .mlinks");
  if(tb&&ml){var c=tb.cloneNode(true);ml.appendChild(c);c.addEventListener("click",function(){tb.click();});}
}
function openQuiz(){var f=d.getElementById("scr-fold");if(!f)return;function o(){if(location.hash==="#screener"||location.hash==="#scr-fold"){f.open=true;}}o();addEventListener("hashchange",o);
  [].slice.call(d.querySelectorAll('a[href$="#screener"]')).forEach(function(a){a.addEventListener("click",function(){f.open=true;});});}
ready(function(){topics();steps();simplify();openQuiz();});
})();
