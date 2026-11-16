/* BenefitMath "Food, health & family" engine (Nov 2026).
   One household, every program: SNAP, OHP / Apple Health, WIC, TANF cash help, child care help and energy help.
   The numbers are the same ones the single-program pages use (snap.html, health-coverage.html, the old
   family-help and child-care calculators). When a program's numbers change, update them here too. */
(function(){
"use strict";
var fpl=function(n){return 15960+5680*(n-1);};          /* 2026 HHS poverty guideline */

/* ---- SNAP, from October 1, 2026 (same table and formula as snap.html) ---- */
var R={MAX:[306,562,808,1023,1217,1463,1616,1841],MAX_ADD:225,STD:[217,217,217,229,268,308],
  NET:[1330,1804,2277,2750,3224,3697,4170,4644],NET_ADD:474,
  LIM:[2660,3607,4554,5500,6447,7394,8340,9287],LIM_ADD:947,
  CAP:769,MIN:25,ED_ASSET:4750,MED_FLOOR:35,
  UTIL:{OR:{heat:533,two:418,one:67,phone:84,none:0},WA:{heat:533,two:420,one:0,phone:60,none:0}}};
var byHH=function(arr,add,n){return n<=arr.length?arr[n-1]:arr[arr.length-1]+add*(n-arr.length);};
function snap(p){
  var n=p.hh,gross=p.earn+p.unearn,lim=byHH(R.LIM,R.LIM_ADD,n),netLim=byHH(R.NET,R.NET_ADD,n),maxA=byHH(R.MAX,R.MAX_ADD,n);
  var std=R.STD[Math.min(n,6)-1],earnDed=0.2*p.earn,medDed=p.ed?Math.max(0,p.med-R.MED_FLOOR):0;
  var adj=Math.max(0,gross-earnDed-std-medDed-p.care);
  var ua=R.UTIL[p.st][p.util]||0,shelter=p.rent+ua,half=adj/2,raw=Math.max(0,shelter-half);
  var excess=p.ed?raw:Math.min(raw,R.CAP),net=Math.max(0,adj-excess),thirty=Math.ceil(0.3*net);
  var ben=Math.max(0,maxA-thirty),path,elig;
  if(gross<lim){elig=true;path="under";}
  else if(p.ed&&net<=netLim&&p.res<=R.ED_ASSET){elig=true;path="ed";}
  else{elig=false;path="over";}
  if(elig&&n<=2&&ben<R.MIN&&net<=netLim)ben=R.MIN;
  if(!elig)ben=0;
  return {n:n,gross:gross,lim:lim,netLim:netLim,maxA:maxA,std:std,earnDed:earnDed,medDed:medDed,adj:adj,ua:ua,shelter:shelter,half:half,raw:raw,excess:excess,net:net,thirty:thirty,ben:ben,elig:elig,path:path,capped:!p.ed&&raw>R.CAP};
}

/* ---- Health coverage (same limits as health-coverage.html; that page also figures marketplace credits) ---- */
function health(p){
  var F=fpl(p.hh),mo=p.earn+p.unearn,pct=mo*12/F*100,adult=p.age>=19&&p.age<65,senior=p.age>=65;
  var medLim=1.38*F/12,br133=1.33*F/12,br200=2*F/12,path;
  if(senior)path="medicare";
  else if(!adult)path="kid";
  else if(mo<=medLim)path="medicaid";
  else if(p.st==="OR"&&mo>=br133&&mo<=br200)path="bridge";
  else path="market";
  var kl=p.st==="OR"?305:215,pl=p.st==="OR"?190:215;
  return {F:F,mo:mo,pct:pct,path:path,medLim:medLim,br133:br133,br200:br200,kidLim:kl,pregLim:pl,kidsOk:p.kids&&pct<=kl,pregOk:p.preg&&pct<=pl,
    chip:p.st==="WA"&&pct>215&&pct<=317?(pct<=265?"CHIP $20/mo per family":"CHIP $30/mo per family"):null};
}

/* ---- WIC, July 2026 to June 2027: 185% of poverty ---- */
function wic(p){var wl=29526+10508*(p.hh-1),annual=(p.earn+p.unearn)*12;return {wl:wl,annual:annual,ok:p.young&&annual<=wl,applies:p.young};}

/* ---- TANF ---- */
var PS=[450,570,706,833,959,1090,1258,1392,1529,1662],TLIM=[1400,1640,1912,2166,2418,2680,3016,3284,3558,3824];
function tanf(p){
  if(p.st!=="WA")return {st:"OR",applies:p.kids||p.preg};
  var i=Math.min(10,p.hh)-1,ps=PS[i],counted=Math.max(0,p.earn-500)/2,grant=Math.max(0,Math.floor(ps-counted-p.unearn));
  var ok=(p.kids||p.preg)&&p.earn<TLIM[i]&&grant>0;
  return {st:"WA",applies:p.kids||p.preg,ps:ps,counted:counted,lim:TLIM[i],amt:ok?grant:0,ok:ok,size:Math.min(10,p.hh)};
}

/* ---- Child care help ---- */
var WCCC={"1":[1207,2173,3018,3622,3923,5131],"2":[1578,2841,3947,4736,5131,6710],"3":[1950,3510,4875,5851,6338,8289],"4":[2321,4179,5804,6965,7546,9868],"5":[2693,4848,6733,8080,8753,11446],"6":[3064,5516,7662,9194,9960,13025],"7":[3134,5642,7836,9403,10187,13321],"8":[3204,5767,8010,9612,10413,13617]};
function care(p){
  var n=Math.min(8,Math.max(1,p.hh)),inc=p.earn+p.unearn;
  if(p.st==="OR"){var entry=2*fpl(n)/12,stay=2.5*fpl(n)/12,cap=0.07*inc;return {st:"OR",n:n,inc:inc,entry:entry,stay:stay,cap:cap,ok:inc<=(p.renew?stay:entry),applies:p.kids};}
  var b=WCCC[n],labels=["$0","$65","$90","$165","$215"],i=-1;
  for(var j=0;j<5;j++){if(inc<=b[j]){i=j;break;}}
  var ok=p.renew?inc<=b[4]:inc<=b[3];
  return {st:"WA",n:n,inc:inc,b:b,copay:i>=0?labels[i]:null,ok:ok,applies:p.kids};
}

function all(p){return {snap:snap(p),health:health(p),wic:wic(p),tanf:tanf(p),care:care(p)};}
window.BM_FHF={fpl:fpl,R:R,snap:snap,health:health,wic:wic,tanf:tanf,care:care,all:all};
})();
