/* BenefitMath 2026 tax tables: one copy shared by the tax and paycheck calculators.
   When the IRS, Oregon or Washington publish new numbers, update them here and every page that loads this file follows. */
(function(){
"use strict";
/* Federal income tax, tax year 2026 (Rev. Proc. 2025-32) */
var FED={
  std:{single:16100,mfs:16100,hoh:24150,mfj:32200},
  add65:{single:2050,hoh:2050,mfs:1650,mfj:1650},
  br:{
    single:[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[Infinity,.37]],
    mfs:[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[384350,.35],[Infinity,.37]],
    mfj:[[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]],
    hoh:[[17700,.10],[67450,.12],[105700,.22],[201750,.24],[256200,.32],[640600,.35],[Infinity,.37]]
  }
};
function brTax(ti,br){var t=0,p=0;for(var i=0;i<br.length;i++){var top=br[i][0],r=br[i][1];if(ti>p)t+=(Math.min(ti,top)-p)*r;p=top;}return t;}
function fedTax(ti,fs){return brTax(ti,FED.br[fs]);}
function fedRate(ti,fs){var br=FED.br[fs];for(var i=0;i<br.length;i++){if(ti<=br[i][0])return br[i][1];}return .37;}
function stdDed(fs,n65){return FED.std[fs]+FED.add65[fs]*(n65||0);}

/* Payroll taxes and premiums, 2026 */
var PAY={
  ssb:184500, ss:.062, med:.0145, addMed:.009,
  orTransit:.001,          /* ORS 320.550 */
  orPfml:.006,             /* Paid Leave Oregon, employee share */
  waPfml:.0113*.7143,      /* WA PFML, employee share of 1.13% */
  waCares:.0058            /* WA Cares, no wage cap */
};

/* Oregon, 2026 */
var OR={
  std:{single:2910,mfj:5820}, ex:263, exLim:{single:100000,mfj:200000},
  br:{single:[[4550,.0475],[11400,.0675],[125000,.0875],[Infinity,.099]],mfj:[[9100,.0475],[22800,.0675],[250000,.0875],[Infinity,.099]]}
};
/* Most federal tax Oregon lets you subtract, phased out at higher income */
function orFedSubCap(inc,mar){
  var s=mar?[[250000,8750],[260000,7000],[270000,5250],[280000,3500],[290000,1750]]:[[125000,8750],[130000,7000],[135000,5250],[140000,3500],[145000,1750]];
  for(var i=0;i<s.length;i++)if(inc<s[i][0])return s[i][1];return 0;
}

/* The three new federal deductions for 2025 to 2028. Each is taken below the line, so none changes
   the income the others phase out on, and they add together. agi is income before any of them. */
var NEW={
  tips:function(o){
    var thr=o.fs==="mfj"?300000:150000, red=Math.max(0,(o.agi-thr)*0.10);
    var base=Math.min(o.tips,25000); if(o.se)base=Math.min(base,o.net);
    var ded=Math.max(0,base-red), why="";
    if(o.fs==="mfs"){ded=0;why="Married people must file jointly to take this deduction.";}
    else if(!o.ssn){ded=0;why="You need a Social Security number valid for work.";}
    else if(!o.job){ded=0;why="Only tips in jobs on the IRS list of occupations that customarily got tips by the end of 2024 qualify.";}
    return {ded:Math.round(ded),thr:thr,red:red,base:base,why:why};
  },
  overtime:function(o){
    var premium=o.otPay/3, thr=o.fs==="mfj"?300000:150000, cap=o.fs==="mfj"?25000:12500;
    var red=Math.max(0,(o.agi-thr)*0.10), limit=Math.max(0,cap-red);
    var ded=Math.min(premium,limit), why="";
    if(o.fs==="mfs"){ded=0;why="Married people must file jointly to take this deduction.";}
    else if(!o.ssn){ded=0;why="You need a Social Security number valid for work to take this deduction.";}
    else if(!o.flsa){ded=0;why="Only overtime that federal law requires counts: hours over 40 in a workweek. Daily overtime under state law, union-contract overtime and voluntary premiums don't qualify.";}
    return {ded:Math.round(ded),premium:premium,thr:thr,cap:cap,red:red,why:why};
  },
  senior:function(o){
    var thr=o.fs==="mfj"?150000:75000, red=Math.max(0,(o.agi-thr)*0.06), per=Math.max(0,6000-red);
    var ded=Math.round(per*o.n), why="";
    if(o.fs==="mfs"){ded=0;why="Married people must file jointly to take this deduction.";}
    else if(!o.ssn){ded=0;why="Each person claiming it needs a Social Security number valid for work.";}
    return {ded:ded,thr:thr,red:red,per:per,why:why};
  }
};

window.BM_TAX={FED:FED,PAY:PAY,OR:OR,NEW:NEW,brTax:brTax,fedTax:fedTax,fedRate:fedRate,stdDed:stdDed,orFedSubCap:orFedSubCap,
  FSN:{single:"Single",hoh:"Head of household",mfj:"Married filing jointly",mfs:"Married filing separately"}};
})();

/* All the new deductions together: tax with none of them vs. tax with every one entered.
   parts = [[label, deduction], ...]; fmt formats dollars. */
window.BM_TAX.combo=function(o){
  var T=window.BM_TAX, std=T.stdDed(o.fs,o.n65), ti0=Math.max(0,o.agi-std), total=0;
  o.parts.forEach(function(p){total+=p[1];});
  var ti1=Math.max(0,ti0-total), t0=Math.round(T.fedTax(ti0,o.fs)), t1=Math.round(T.fedTax(ti1,o.fs)), f=o.fmt;
  var rows=[["Your income (estimated AGI)",f(o.agi)],["− Standard deduction"+(o.n65?" with the extra for age 65":""),f(std)],["Tax without the new deductions",f(t0)]];
  o.parts.forEach(function(p){rows.push(["− "+p[0],f(p[1])]);});
  rows.push(["Tax with all of them",f(t1)],["Federal income tax saved",f(t0-t1),"total"]);
  var saved=t0-t1;
  /* Ready-made options for the page's card() */
  var card={t:"All your new deductions together",scope:"Tips, overtime and senior · tax year 2026",amt:f(saved),al:"saved",st:saved>0?"good":"info",
    chip:f(total)+" in new deductions",p:["Each deduction is figured on the same income, so they simply add up."],rows:rows};
  return {std:std,total:total,t0:t0,t1:t1,saved:saved,rows:rows,card:card};
};
