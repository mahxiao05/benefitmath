/* BenefitMath ad spots: one config for every page. */
/* AD SPOTS: after AdSense approves the site, create a "Display ad" unit for each spot below (AdSense > Ads > By ad unit)
   and paste its data-ad-slot number between the quotes. Empty quotes = that spot stays hidden. */
window.BM_ADS={client:"ca-pub-7867146450299069",slots:{home:"",mid:"",infeed:"","infeed-va":"",bottom:""}};
(function(){var c=window.BM_ADS;document.querySelectorAll(".ad-slot .ad-box[data-ad-slot]").forEach(function(box){var id=c.slots[box.getAttribute("data-ad-slot")];if(!id)return;var slot=box.closest(".ad-slot"),ins=document.createElement("ins");ins.className="adsbygoogle";ins.style.display="block";ins.setAttribute("data-ad-client",c.client);ins.setAttribute("data-ad-slot",id);ins.setAttribute("data-ad-format","auto");ins.setAttribute("data-full-width-responsive","true");box.replaceWith(ins);slot.classList.add("on");try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}});})();
