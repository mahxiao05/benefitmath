/* BenefitMath "Ways to file" box on tax calculators: free options always, paid partner offers when set. */
/* PARTNERS: after an affiliate program approves the site, paste its tracking link into url.
   Empty url = that offer stays hidden. Every paid link is labeled and marked rel="sponsored". */
window.BM_PARTNERS=[
  {name:"FreeTaxUSA",url:"",en:"Free federal return, low-cost state return.",es:"Declaración federal gratis, estatal a bajo costo."},
  {name:"TurboTax",url:"",en:"Guided software with live expert help as an add-on.",es:"Programa guiado, con ayuda de un experto por un costo extra."},
  {name:"H&R Block",url:"",en:"File online or with a tax pro at an office.",es:"Declare en línea o con un preparador en una oficina."}
];
(function(){
  var boxes=document.querySelectorAll("[data-filebox]");if(!boxes.length)return;
  var es=document.documentElement.lang==="es";
  var L=es?{h:"Cómo declarar sus impuestos",free:"Gratis",ff:"IRS Free File",ffd:"Programa guiado gratis si su ingreso bruto ajustado es de $89,000 o menos.",
      vita:"Ayuda gratis (VITA)",vitad:"Voluntarios certificados preparan su declaración si tiene ingresos moderados.",more:"Ver todas las opciones gratis (en inglés)",paid:"Programas de pago",
      disc:"Enlaces de socios: podemos recibir una comisión si los usa. No cambia nuestros cálculos.",guide:"guide-free-tax-filing-or-wa.html"}
    :{h:"Ways to file your return",free:"Free",ff:"IRS Free File",ffd:"Free guided software if your adjusted gross income is $89,000 or less.",
      vita:"Free help (VITA)",vitad:"Certified volunteers prepare your return if you have moderate income.",more:"See every free option",paid:"Paid software",
      disc:"Partner links: we may earn a commission if you use them. It doesn't change our math.",guide:"guide-free-tax-filing-or-wa.html"};
  var P=(window.BM_PARTNERS||[]).filter(function(p){return p.url;});
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  var h='<h3>'+L.h+'</h3><div class="fb-list">'+
    '<a class="fb-item" href="https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" target="_blank" rel="noopener"><b>'+L.ff+'</b><span>'+L.ffd+'</span><em>'+L.free+'</em></a>'+
    '<a class="fb-item" href="https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers" target="_blank" rel="noopener"><b>'+L.vita+'</b><span>'+L.vitad+'</span><em>'+L.free+'</em></a>';
  P.forEach(function(p){h+='<a class="fb-item paid" href="'+esc(p.url)+'" target="_blank" rel="sponsored noopener"><b>'+esc(p.name)+'</b><span>'+esc(es?p.es:p.en)+'</span><em>'+L.paid+'</em></a>';});
  h+='</div><p class="fb-foot"><a href="'+L.guide+'">'+L.more+'</a>'+(P.length?' · '+L.disc:'')+'</p>';
  boxes.forEach(function(b){b.innerHTML=h;b.classList.add("on");});
})();
