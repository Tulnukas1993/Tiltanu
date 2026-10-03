
document.querySelectorAll('img[data-img]').forEach(function(img){
  var key = img.getAttribute('data-img');
  if (window.PLASTIC_IMAGES && window.PLASTIC_IMAGES[key]) {
    img.src = window.PLASTIC_IMAGES[key];
  }
});


let checked=0, correct=0;
const counted=new WeakSet();

function norm(s){return s.toLowerCase().trim().replace(/[’]/g,"'").replace(/\s+/g,' ')}
function count(el,ok){
  if(!counted.has(el)){counted.add(el);checked++;if(ok)correct++;}
  updateProgress();
}
function styleQ(el,ok){el.classList.remove('correct','wrong');el.classList.add(ok?'correct':'wrong')}
function updateProgress(){
  document.getElementById('progress').textContent='Checked: '+checked+' • Correct on first check: '+correct;
}
function markOpen(id,msg){
  const el=document.getElementById(id), fb=document.getElementById(id+'Fb');
  if(!el.value.trim()){fb.innerHTML='<span class="bad">Write something first.</span>';return;}
  fb.innerHTML='<span class="good">✓ '+msg+'</span>'; count(el,true);
}
function checkSelectGroup(id,btn){
  const area=document.getElementById(id); const sels=area.querySelectorAll('select[data-answer]');
  let good=0;
  sels.forEach(s=>{const ok=s.value===s.dataset.answer;styleQ(s.closest('.q')||s.closest('td')||s,ok);count(s,ok);if(ok)good++;});
  const fb=btn.parentElement.querySelector(':scope > .feedback') || btn.nextElementSibling;
  if(fb) fb.innerHTML=good===sels.length?'<span class="good">✓ All correct!</span>':'<span class="bad">'+good+' / '+sels.length+' correct.</span>';
}
function checkInputs(id,btn){
  const area=document.getElementById(id); const inputs=area.querySelectorAll('input[data-answer]');
  let good=0;
  inputs.forEach(inp=>{const ok=norm(inp.value)===norm(inp.dataset.answer);styleQ(inp.closest('.q')||inp.closest('td')||inp.parentElement,ok);count(inp,ok);if(ok)good++;});
  let fb=btn.parentElement.querySelector(':scope > .feedback');
  if(fb) fb.innerHTML=good===inputs.length?'<span class="good">✓ All correct!</span>':'<span class="bad">'+good+' / '+inputs.length+' correct.</span>';
}
function showAnswers(id){document.querySelectorAll('#'+id+' input[data-answer]').forEach(i=>i.value=i.dataset.answer)}
function checkKeywords(id,btn){
  const inputs=document.querySelectorAll('#'+id+' input[data-keywords]');let good=0;
  inputs.forEach(inp=>{
    const kws=inp.dataset.keywords.toLowerCase().split('|');
    const txt=inp.value.toLowerCase();
    const ok=kws.some(k=>txt.includes(k));
    styleQ(inp.closest('.q'),ok);count(inp,ok);if(ok)good++;
  });
  btn.parentElement.querySelector(':scope > .feedback').innerHTML='<span class="'+(good===inputs.length?'good':'bad')+'">'+good+' / '+inputs.length+' broadly correct.</span>';
}
function showGist(){
  const vals=[
    'A TV adventurer / travel presenter.',
    'Toothbrushes, combs, shoes, belts, mouldings, bicycle helmets, food packaging, water bottles, plastic bags.',
    'Hawaii, Britain, Dorset, South Wales, the Pacific Ocean, the North Atlantic, Bangladesh, Kenya and Modbury.',
    'Small plastic pellets used as raw material for making plastic products.'
  ];
  document.querySelectorAll('#gist input').forEach((i,n)=>i.value=vals[n]);
}
const tfData=[
  ['Hawaii is protected from rubbish because of its position in the Pacific Ocean.',false,'Rubbish from around the world still washes up there.'],
  ['Volunteers clear the nurdles from the beaches.',false,'The text says larger pieces can be collected, while tiny pellets are much harder to remove.'],
  ['The sea makes the nurdles smaller and smaller.',true,'The pounding of the sea reduces plastic fragments in size.'],
  ['By 2025, 600,000 tons of plastic rubbish will be polluting our seas.',false,'The text says about 150 million tons by 2025; 600,000 refers to plastic containers dumped overboard every day.'],
  ['Factories are reducing the amount of plastics they produce.',false,'The text says production has increased dramatically.'],
  ['There are three major ways that plastic is ruining our planet.',true,'It is ruining beaches, choking oceans and poisoning the food chain.'],
  ['Most of the plastic garbage is made up of plastic bags, bottles and packaging.',true,'The article identifies these as the main culprits.'],
  ['Bangladesh and Modbury have something in common.',true,'Both are mentioned as places that have taken strong action against plastic bags.']
];
document.getElementById('tf').innerHTML=tfData.map((x,i)=>`
<div class="q" data-answer="${x[1]}">
  <p><b>${i+1}.</b> ${x[0]}</p>
  <label class="option"><input type="radio" name="tf${i}" value="true"> True</label>
  <label class="option"><input type="radio" name="tf${i}" value="false"> False</label>
  <button onclick="checkTF(this, \`${x[2]}\`)">Check</button><div class="feedback"></div>
</div>`).join('');
function checkTF(btn,exp){
  const q=btn.closest('.q'), sel=q.querySelector('input:checked');
  if(!sel){q.querySelector('.feedback').textContent='Choose True or False.';return;}
  const ok=sel.value===q.dataset.answer;styleQ(q,ok);count(q,ok);
  q.querySelector('.feedback').innerHTML=(ok?'<span class="good">✓ Correct. </span>':'<span class="bad">✗ Not quite. </span>')+exp;
}
function checkRubbish(){
  const input=document.getElementById('rubbishWords');
  const words=['rubbish','garbage','litter','waste','debris'];
  const txt=input.value.toLowerCase();
  const found=words.filter(w=>txt.includes(w));
  const ok=found.length>=5;styleQ(input.closest('.q'),ok);count(input,ok);
  document.getElementById('rubbishFb').innerHTML=(ok?'<span class="good">✓ All five found.</span>':'<span class="bad">Found '+found.length+' / 5. Look for rubbish, garbage, litter, waste and debris.</span>');
}
