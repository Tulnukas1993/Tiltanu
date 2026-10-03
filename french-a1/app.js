async function loadLesson(){
  const [a,b]=await Promise.all([fetch('part1.html').then(r=>r.text()),fetch('part2.html').then(r=>r.text())]);
  document.getElementById('lesson').innerHTML=a+b;
function norm(s){
  return (s||'').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ");
}
function mark(el, good){
  el.classList.remove("correct","wrong");
  el.classList.add(good ? "correct" : "wrong");
}
function checkSection(btn){
  const sec = btn.closest('.section');
  sec.querySelectorAll('.question[data-answer]').forEach(q=>{
    const chosen = q.querySelector('input[type=radio]:checked');
    q.querySelectorAll('.opt').forEach(x=>x.classList.remove('correct','wrong'));
    const fb = q.querySelector('.feedback');
    if(!chosen){
      if(fb) fb.innerHTML = '<span class="no">Choisissez une réponse.</span>';
      return;
    }
    const good = chosen.value === q.dataset.answer;
    mark(chosen.closest('.opt'), good);
    if(!good){
      const corr = [...q.querySelectorAll('input[type=radio]')].find(x=>x.value===q.dataset.answer);
      if(corr) corr.closest('.opt').classList.add('correct');
    }
    if(fb) fb.innerHTML = good ? '<span class="ok">✓ Correct</span>' : '<span class="no">✗ À corriger</span>';
  });
  updateScore();
}
function checkParis(btn){
  const sec = btn.closest('.section');
  sec.querySelectorAll('.choice-line[data-answer]').forEach(q=>{
    const chosen = q.querySelector('input[type=radio]:checked');
    q.querySelectorAll('label').forEach(x=>x.classList.remove('correct','wrong'));
    if(!chosen) return;
    const good = chosen.value === q.dataset.answer;
    mark(chosen.closest('label'), good);
    if(!good){
      const corr = [...q.querySelectorAll('input[type=radio]')].find(x=>x.value===q.dataset.answer);
      if(corr) corr.closest('label').classList.add('correct');
    }
  });
  updateScore();
}
function checkSelects(btn){
  const sec = btn.closest('.section');
  sec.querySelectorAll('select.sel').forEach(s=>mark(s, s.value===s.dataset.answer));
  updateScore();
}
function checkOrders(btn){
  const sec = btn.closest('.section');
  sec.querySelectorAll('select.order').forEach(s=>mark(s, s.value===s.dataset.answer));
  updateScore();
}
function checkTexts(btn){
  const sec = btn.closest('.section');
  sec.querySelectorAll('input.txt').forEach(i=>{
    const ans=(i.dataset.answer||'').split('|').map(norm);
    mark(i, ans.includes(norm(i.value)));
  });
  updateScore();
}
function allAutoItems(){
  return [
    ...document.querySelectorAll('.question[data-answer]'),
    ...document.querySelectorAll('.choice-line[data-answer]'),
    ...document.querySelectorAll('select.sel'),
    ...document.querySelectorAll('select.order'),
    ...document.querySelectorAll('input.txt')
  ];
}
function itemCorrect(item){
  if(item.matches('.question[data-answer]') || item.matches('.choice-line[data-answer]')){
    const chosen=item.querySelector('input[type=radio]:checked');
    return !!chosen && chosen.value===item.dataset.answer;
  }
  if(item.matches('select')) return item.value===item.dataset.answer;
  if(item.matches('input.txt')){
    const ans=(item.dataset.answer||'').split('|').map(norm);
    return ans.includes(norm(item.value));
  }
  return false;
}
function updateScore(){
  const items=allAutoItems();
  const score=items.filter(itemCorrect).length;
  const total=items.length;
  document.getElementById('scoreTop').textContent=score;
  document.getElementById('totalTop').textContent=total;
  document.getElementById('scoreBottom').textContent=score;
  document.getElementById('totalBottom').textContent=total;
  document.getElementById('pct').textContent=total ? Math.round(score/total*100)+'%' : '0%';
}
function checkAll(){
  document.querySelectorAll('.section').forEach(sec=>{
    sec.querySelectorAll('.question[data-answer]').forEach(q=>{
      const chosen=q.querySelector('input[type=radio]:checked');
      q.querySelectorAll('.opt').forEach(x=>x.classList.remove('correct','wrong'));
      if(chosen){
        const good=chosen.value===q.dataset.answer;
        mark(chosen.closest('.opt'),good);
        if(!good){
          const corr=[...q.querySelectorAll('input[type=radio]')].find(x=>x.value===q.dataset.answer);
          if(corr) corr.closest('.opt').classList.add('correct');
        }
      }
    });
    sec.querySelectorAll('.choice-line[data-answer]').forEach(q=>{
      const chosen=q.querySelector('input[type=radio]:checked');
      q.querySelectorAll('label').forEach(x=>x.classList.remove('correct','wrong'));
      if(chosen){
        const good=chosen.value===q.dataset.answer;
        mark(chosen.closest('label'),good);
        if(!good){
          const corr=[...q.querySelectorAll('input[type=radio]')].find(x=>x.value===q.dataset.answer);
          if(corr) corr.closest('label').classList.add('correct');
        }
      }
    });
    sec.querySelectorAll('select.sel').forEach(s=>mark(s,s.value===s.dataset.answer));
    sec.querySelectorAll('select.order').forEach(s=>mark(s,s.value===s.dataset.answer));
    sec.querySelectorAll('input.txt').forEach(i=>{
      const ans=(i.dataset.answer||'').split('|').map(norm);
      mark(i,ans.includes(norm(i.value)));
    });
  });
  updateScore();
  window.scrollTo({top:0,behavior:'smooth'});
}
function resetAll(){
  document.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
  document.querySelectorAll('select').forEach(x=>x.value='');
  document.querySelectorAll('input.txt').forEach(x=>x.value='');
  document.querySelectorAll('textarea').forEach(x=>x.value='');
  document.querySelectorAll('.correct,.wrong').forEach(x=>x.classList.remove('correct','wrong'));
  document.querySelectorAll('.feedback').forEach(x=>x.textContent='');
  const wc=document.getElementById('wordCount');
  if(wc) wc.textContent='0';
  updateScore();
  window.scrollTo({top:0,behavior:'smooth'});
}
const writing=document.getElementById('writing');
if(writing){
  writing.addEventListener('input',e=>{
    const t=e.target.value.trim();
    document.getElementById('wordCount').textContent=t ? t.split(/\s+/).length : 0;
  });
}
updateScore();
}
loadLesson();