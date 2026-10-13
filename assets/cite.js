(function(){
  var S=window.BM_SOURCES||{},pop=null,from=null;
  function close(){if(pop){pop.remove();pop=null;if(from){from.setAttribute('aria-expanded','false');}}}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.cite');
    if(pop&&!e.target.closest('.citepop')&&a!==from)close();
    if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var s=S[a.getAttribute('data-cite')];if(!s)return;
    e.preventDefault();
    if(pop&&from===a){close();return;}
    close();from=a;a.setAttribute('aria-expanded','true');
    pop=document.createElement('div');pop.className='citepop';pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Source: '+s.t);
    pop.innerHTML='<button type="button" class="cp-x" aria-label="Close">×</button><span class="cp-o">'+esc(s.o)+'</span><span class="cp-t">'+esc(s.t)+'</span>'+
      (s.n?'<p class="cp-n">'+esc(s.n)+'</p>':'')+'<span class="cp-d">Checked '+esc(s.d||'')+'</span><a class="cp-go" href="'+esc(s.u)+'" target="_blank" rel="noopener">Open official source ↗</a>';
    document.body.appendChild(pop);
    var r=a.getBoundingClientRect(),w=pop.offsetWidth,x=Math.min(Math.max(12,r.left+window.scrollX),window.scrollX+document.documentElement.clientWidth-w-12);
    var y=r.bottom+window.scrollY+8;if(r.bottom+pop.offsetHeight+16>window.innerHeight&&r.top>pop.offsetHeight+16)y=r.top+window.scrollY-pop.offsetHeight-8;
    pop.style.left=x+'px';pop.style.top=y+'px';
    pop.querySelector('.cp-x').addEventListener('click',function(){var f=from;close();if(f)f.focus();});
    pop.querySelector('.cp-go').focus({preventScroll:true});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pop){var f=from;close();if(f)f.focus();}});
})();
