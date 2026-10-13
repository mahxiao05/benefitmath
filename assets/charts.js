/* BenefitMath charts: small, dependency-free SVG/HTML charts that follow the page theme.
   Every chart is drawn from the same formula the calculator on the page uses, so the two always agree. */
(function(){
"use strict";
var CSS = ""
+ ".bmc{--c1:var(--accent);--c2:var(--info);--c3:#b07a1a;--c4:#8a5fa8;--c5:#b5543f;--c6:var(--muted)}"
+ ":root[data-theme=dark] .bmc{--c3:#e2b45c;--c4:#c39be0;--c5:#ec8f7b}"
+ ".bmc .head{padding-bottom:4px}"
+ ".bmc .body{gap:10px}"
+ ".bmc-plot{position:relative;width:100%;min-height:200px;touch-action:pan-y}"
+ ".bmc-plot svg{display:block;width:100%;height:auto;overflow:visible}"
+ ".bmc-plot text{font-family:var(--f-mono);font-size:11px;fill:var(--muted)}"
+ ".bmc-plot .bmc-band text{font-family:var(--f-body);font-size:11.5px;font-weight:600;fill:var(--muted)}"
+ ".bmc-plot .bmc-you text{font-family:var(--f-body);font-size:12px;font-weight:700;fill:var(--ink)}"
+ ".bmc-plot .bmc-mark text{font-family:var(--f-body);font-size:11px;font-weight:600;fill:var(--ink)}"
+ ".bmc-legend{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:13px;color:var(--muted);margin:0;padding:0;list-style:none}"
+ ".bmc-legend li{display:flex;align-items:center;gap:6px}"
+ ".bmc-legend i{width:12px;height:12px;border-radius:3px;display:inline-block;flex:none}"
+ ".bmc-legend i.ln{height:3px;border-radius:2px}"
+ ".bmc-read{margin:0;font-size:14px;min-height:1.5em;font-variant-numeric:tabular-nums}"
+ ".bmc-read b{font-family:var(--f-mono);font-weight:600}"
+ ".bmc-note{margin:0;font-size:13px;color:var(--muted)}"
+ ".bmc-bar{display:flex;width:100%;height:30px;border-radius:6px;overflow:hidden;background:var(--sunk)}"
+ ".bmc-bar span{display:block;height:100%;min-width:0;border-right:2px solid var(--surface)}"
+ ".bmc-bar span:last-child{border-right:0}"
+ ".bmc-rows{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:6px 12px;align-items:center;font-size:14px;margin:0}"
+ ".bmc-rows i{width:12px;height:12px;border-radius:3px;display:inline-block}"
+ ".bmc-rows .v{font-family:var(--f-mono);text-align:right;font-variant-numeric:tabular-nums}"
+ ".bmc-rows .p{font-family:var(--f-mono);text-align:right;color:var(--muted);font-size:12.5px;min-width:3.5em}"
+ ".bmc-rows .main{font-weight:700}";
function injectCSS(){
  if(document.getElementById("bmc-css"))return;
  var s=document.createElement("style");s.id="bmc-css";s.textContent=CSS;document.head.appendChild(s);
}
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
var money=function(n){return (n<0?"−":"")+"$"+Math.round(Math.abs(n)).toLocaleString("en-US");};
function short(n){
  var a=Math.abs(n),s=n<0?"−":"";
  if(a>=1e6)return s+"$"+(+(a/1e6).toFixed(1))+"M";
  if(a>=1000)return s+"$"+(+(a/1000).toFixed(a%1000===0?0:1))+"k";
  return s+"$"+Math.round(a);
}
function niceStep(range,count){
  var raw=range/Math.max(1,count),p=Math.pow(10,Math.floor(Math.log10(raw||1))),f=raw/p;
  return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;
}
function head(o){
  return '<div class="head"><div>'+(o.scope?'<div class="scope">'+esc(o.scope)+'</div>':'')+'<h3>'+esc(o.title)+'</h3></div></div>';
}

/* ---------- Curve chart ---------- */
var ro=("ResizeObserver" in window)?new ResizeObserver(function(es){es.forEach(function(e){var c=e.target.__bmc;if(c&&Math.abs(e.contentRect.width-c.w)>2)draw(c);});}):null;

function curve(el,o){
  injectCSS();
  if(!el)return;
  if(!o){if(ro&&el.__plot)ro.unobserve(el.__plot);el.__plot=null;el.innerHTML="";return;}
  var leg=(o.series||[]).map(function(s){return '<li><i'+(s.type==="line"?' class="ln"':'')+' style="background:'+s.color+'"></i>'+esc(s.name)+'</li>';}).join("");
  el.innerHTML='<article class="card bmc">'+head(o)+'<div class="body">'
    +(o.intro?'<p>'+o.intro+'</p>':'')
    +'<ul class="bmc-legend">'+leg+'</ul>'
    +'<div class="bmc-plot" role="img" aria-label="'+esc(o.alt||o.title)+'"></div>'
    +'<p class="bmc-read" aria-live="off"></p>'
    +(o.note?'<p class="bmc-note">'+o.note+'</p>':'')
    +'</div></article>';
  var plot=el.querySelector(".bmc-plot");
  var c={plot:plot,read:el.querySelector(".bmc-read"),o:o,w:0};
  plot.__bmc=c;
  if(ro&&el.__plot)ro.unobserve(el.__plot);
  el.__plot=plot;
  draw(c);
  if(ro)ro.observe(plot);
}

function draw(c){
  var o=c.o,plot=c.plot,W=Math.max(260,Math.round(plot.clientWidth||600));
  c.w=W;
  var H=W<480?220:250,M={l:W<480?44:54,r:16,t:22,b:30};
  var xs=o.xs,n=xs.length,x0=xs[0],x1=xs[n-1];
  var stacked=o.stacked!==false;
  // cumulative tops for stacked areas
  var areas=o.series.filter(function(s){return s.type!=="line";}),lines=o.series.filter(function(s){return s.type==="line";});
  var base=new Array(n).fill(0),layers=[];
  areas.forEach(function(s){var lo=base.slice(),hi=s.ys.map(function(y,i){return (stacked?lo[i]:0)+Math.max(0,y);});layers.push({s:s,lo:stacked?lo:new Array(n).fill(0),hi:hi});if(stacked)base=hi;});
  var ymax=o.yMax||0;
  layers.forEach(function(l){l.hi.forEach(function(v){if(v>ymax)ymax=v;});});
  lines.forEach(function(s){s.ys.forEach(function(v){if(v>ymax)ymax=v;});});
  if(ymax<=0)ymax=1;
  var ystep=niceStep(ymax,4);ymax=Math.ceil(ymax*1.06/ystep)*ystep;
  var X=function(v){return M.l+(v-x0)/(x1-x0||1)*(W-M.l-M.r);};
  var Y=function(v){return H-M.b-(v/ymax)*(H-M.t-M.b);};
  var f=o.yFmt||short,fx=o.xFmt||short;
  var g=[];
  // bands (phase labels)
  (o.bands||[]).forEach(function(b,i){
    var a=X(Math.max(x0,b.x0)),z=X(Math.min(x1,b.x1));if(z-a<2)return;
    g.push('<g class="bmc-band"><rect x="'+a+'" y="'+M.t+'" width="'+(z-a)+'" height="'+(H-M.t-M.b)+'" style="fill:'+(i%2?'transparent':'var(--sunk)')+'"/>'
      +(z-a>58?'<text x="'+(a+z)/2+'" y="'+(M.t-7)+'" text-anchor="middle">'+esc(b.label)+'</text>':'')+'</g>');
  });
  // grid + y ticks
  for(var v=0;v<=ymax+1e-9;v+=ystep){
    var yy=Y(v);
    g.push('<line x1="'+M.l+'" x2="'+(W-M.r)+'" y1="'+yy+'" y2="'+yy+'" style="stroke:var(--line);stroke-width:1'+(v?';stroke-dasharray:2 3':'')+'"/>');
    g.push('<text x="'+(M.l-8)+'" y="'+(yy+4)+'" text-anchor="end">'+esc(f(v))+'</text>');
  }
  // x ticks
  var xstep=niceStep(x1-x0,Math.max(3,Math.floor((W-M.l-M.r)/90)));
  for(var t=Math.ceil(x0/xstep)*xstep;t<=x1+1e-9;t+=xstep){
    g.push('<text x="'+X(t)+'" y="'+(H-M.b+18)+'" text-anchor="middle">'+esc(fx(t))+'</text>');
  }
  // areas
  layers.forEach(function(l){
    var d="M"+X(xs[0])+","+Y(l.hi[0]);
    for(var i=1;i<n;i++)d+="L"+X(xs[i])+","+Y(l.hi[i]);
    for(i=n-1;i>=0;i--)d+="L"+X(xs[i])+","+Y(l.lo[i]);
    g.push('<path d="'+d+'Z" style="fill:'+l.s.color+';fill-opacity:'+(l.s.opacity||.78)+'"/>');
    var top="M"+X(xs[0])+","+Y(l.hi[0]);for(i=1;i<n;i++)top+="L"+X(xs[i])+","+Y(l.hi[i]);
    g.push('<path d="'+top+'" style="fill:none;stroke:'+l.s.color+';stroke-width:1.5"/>');
  });
  lines.forEach(function(s){
    var d="M"+X(xs[0])+","+Y(s.ys[0]);for(var i=1;i<n;i++)d+="L"+X(xs[i])+","+Y(s.ys[i]);
    g.push('<path d="'+d+'" style="fill:none;stroke:'+s.color+';stroke-width:2.25;stroke-linejoin:round'+(s.dash?';stroke-dasharray:5 4':'')+'"/>');
  });
  // axis
  g.push('<line x1="'+M.l+'" x2="'+(W-M.r)+'" y1="'+Y(0)+'" y2="'+Y(0)+'" style="stroke:var(--ink);stroke-width:1"/>');
  // marks (e.g. "Medicaid may end")
  (o.marks||[]).forEach(function(m){
    if(m.x<x0||m.x>x1)return;var mx=X(m.x),right=mx>W*.62;
    g.push('<g class="bmc-mark"><line x1="'+mx+'" x2="'+mx+'" y1="'+M.t+'" y2="'+Y(0)+'" style="stroke:var(--no);stroke-width:1.5;stroke-dasharray:4 3"/>'
      +'<text x="'+(mx+(right?-5:5))+'" y="'+(M.t+12)+'" text-anchor="'+(right?'end':'start')+'" style="fill:var(--no)">'+esc(m.label)+'</text></g>');
  });
  // "you" marker
  if(o.you&&o.you.x>=x0&&o.you.x<=x1){
    var ux=X(o.you.x),uy=Y(o.you.y||0),right2=ux>W*.7;
    g.push('<g class="bmc-you"><line x1="'+ux+'" x2="'+ux+'" y1="'+uy+'" y2="'+Y(0)+'" style="stroke:var(--ink);stroke-width:1.25"/>'
      +'<circle cx="'+ux+'" cy="'+uy+'" r="5.5" style="fill:var(--surface);stroke:var(--ink);stroke-width:2.5"/>'
      +'<text x="'+(ux+(right2?-10:10))+'" y="'+Math.max(M.t+12,uy-10)+'" text-anchor="'+(right2?'end':'start')+'" style="paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round">'+esc(o.you.label||"You")+'</text></g>');
  }
  // hover rule
  g.push('<g class="bmc-hover" style="display:none"><line y1="'+M.t+'" y2="'+Y(0)+'" style="stroke:var(--muted);stroke-width:1"/></g>');
  g.push('<rect class="bmc-hit" x="'+M.l+'" y="'+M.t+'" width="'+(W-M.l-M.r)+'" height="'+(H-M.t-M.b)+'" style="fill:transparent;cursor:crosshair"/>');
  plot.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg">'+g.join("")+'</svg>';

  var readAt=function(i){return o.readout?o.readout(i):"";};
  var youI=o.you?nearest(xs,o.you.x):-1;
  c.read.innerHTML=youI>=0?readAt(youI):(o.hint||"Move along the chart to see the numbers at any income.");
  var svg=plot.querySelector("svg"),hv=svg.querySelector(".bmc-hover"),hl=hv.querySelector("line"),hit=svg.querySelector(".bmc-hit");
  var move=function(ev){
    var r=svg.getBoundingClientRect(),px=(ev.clientX-r.left)*(W/r.width);
    var xv=x0+(px-M.l)/(W-M.l-M.r)*(x1-x0),i=nearest(xs,xv);
    hl.setAttribute("x1",X(xs[i]));hl.setAttribute("x2",X(xs[i]));hv.style.display="";
    c.read.innerHTML=readAt(i);
  };
  var leave=function(){hv.style.display="none";c.read.innerHTML=youI>=0?readAt(youI):(o.hint||"");};
  hit.addEventListener("pointermove",move);hit.addEventListener("pointerdown",move);hit.addEventListener("pointerleave",leave);
}
function nearest(xs,v){var b=0,d=Infinity;for(var i=0;i<xs.length;i++){var e=Math.abs(xs[i]-v);if(e<d){d=e;b=i;}}return b;}

/* ---------- Stacked bar (where the money goes) ---------- */
function bar(el,o){
  injectCSS();
  if(!el)return;
  if(!o){el.innerHTML="";return;}
  var parts=o.parts.filter(function(p){return p.value>0.004;}),tot=parts.reduce(function(a,p){return a+p.value;},0);
  if(tot<=0){el.innerHTML="";return;}
  var fmt=o.fmt||money,pct=function(v){var p=v/tot*100;return (p<1&&p>0?"<1":Math.round(p))+"%";};
  var alt=o.title+": "+parts.map(function(p){return p.name+" "+fmt(p.value)+" ("+pct(p.value)+")";}).join(", ");
  el.innerHTML='<article class="card bmc">'+head(o)+'<div class="body">'
    +(o.intro?'<p>'+o.intro+'</p>':'')
    +'<div class="bmc-bar" role="img" aria-label="'+esc(alt)+'">'+parts.map(function(p){return '<span style="width:'+(p.value/tot*100)+'%;background:'+p.color+'" title="'+esc(p.name+": "+fmt(p.value))+'"></span>';}).join("")+'</div>'
    +'<div class="bmc-rows">'+parts.map(function(p){return '<i style="background:'+p.color+'"></i><span'+(p.main?' class="main"':'')+'>'+esc(p.name)+'</span><span class="v'+(p.main?' main':'')+'">'+fmt(p.value)+'</span><span class="p">'+pct(p.value)+'</span>';}).join("")+'</div>'
    +(o.note?'<p class="bmc-note">'+o.note+'</p>':'')
    +'</div></article>';
}

window.BMChart={curve:curve,bar:bar,money:money,short:short};
})();
