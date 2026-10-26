const done = new Set();
function markDone(n){
  done.add(n);
  document.getElementById('scoreText').textContent=`Выполнено: ${done.size} / 4`;
  document.getElementById('progressBar').style.width=(done.size/4*100)+'%';
}
function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
document.querySelectorAll('.tab').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  };
});

/* TASK 1 */
const pinyinItems = [
  {w:'英国', base:['yingguo','ying guo'], tone:'yīngguó', opts:['yīngguó','yíngguó','yìngguó','yǐngguò']},
  {w:'喜欢', base:['xihuan','xi huan'], tone:'xǐhuan', opts:['xǐhuan','xīhuān','xìhuán','xíhuàn']},
  {w:'法语', base:['fayu','fa yu'], tone:'fǎyǔ', opts:['fǎyǔ','fáyù','fàyú','fāyǔ']},
  {w:'星期', base:['xingqi','xing qi'], tone:'xīngqī', opts:['xīngqī','xíngqì','xǐngqī','xìngqí']},
  {w:'生日', base:['shengri','sheng ri'], tone:'shēngrì', opts:['shēngrì','shéngrì','shèngrí','shěngri']},
  {w:'猫', base:['mao'], tone:'māo', opts:['māo','máo','mǎo','mào']},
  {w:'狗', base:['gou'], tone:'gǒu', opts:['gōu','góu','gǒu','gòu']},
  {w:'俄语', base:['eyu','e yu'], tone:'éyǔ', opts:['éyǔ','èyú','ěyù','ēyǔ']},
  {w:'名字', base:['mingzi','ming zi'], tone:'míngzi', opts:['míngzi','mǐngzǐ','mìngzì','mīngzi']},
  {w:'谢谢', base:['xiexie','xie xie'], tone:'xièxie', opts:['xièxie','xiěxiè','xiéxie','xiēxíe']}
];
function normBase(s){
  return (s||'').toLowerCase().trim().replace(/\s+/g,' ').replace(/ü/g,'u').replace(/v/g,'u');
}
function renderPinyin(){
  const grid=document.getElementById('pinyinGrid');
  grid.innerHTML='';
  pinyinItems.forEach((item,i)=>{
    const card=document.createElement('div');
    card.className='p-card';
    card.innerHTML=`<div class="hanzi">${item.w}</div>
      <input class="base-input" data-i="${i}" placeholder="без тонов, например xihuan" autocomplete="off">
      <div class="reveal-note">Сначала введи pinyin без тонов.</div>
      <div class="tone-step">
        <div class="small-label">Теперь выбери правильный вариант с тонами:</div>
        <div class="tone-options"></div>
      </div>`;
    const input=card.querySelector('.base-input');
    const note=card.querySelector('.reveal-note');
    const toneStep=card.querySelector('.tone-step');
    const opts=card.querySelector('.tone-options');

    function updateReveal(){
      const baseOk=item.base.map(normBase).includes(normBase(input.value));
      input.classList.toggle('correct',baseOk);
      input.classList.remove('wrong');
      if(baseOk){
        toneStep.classList.add('revealed');
        note.classList.add('ok');
        note.textContent='✓ Pinyin без тонов верный. Теперь выбери тоны.';
      }else{
        toneStep.classList.remove('revealed');
        note.classList.remove('ok');
        note.textContent=input.value.trim()
          ? 'Пока не совпадает. Проверь написание.'
          : 'Сначала введи pinyin без тонов.';
        card.dataset.chosen='';
        opts.querySelectorAll('.tone-btn').forEach(x=>x.classList.remove('selected','correct','wrong'));
      }
    }

    input.addEventListener('input',updateReveal);
    input.addEventListener('change',updateReveal);

    shuffle(item.opts).forEach(opt=>{
      const b=document.createElement('button');
      b.className='tone-btn';
      b.textContent=opt;
      b.onclick=()=>{
        opts.querySelectorAll('.tone-btn').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        card.dataset.chosen = opt;
      };
      opts.appendChild(b);
    });
    grid.appendChild(card);
  });
  const fb=document.getElementById('pinyinFb'); fb.className='feedback'; fb.textContent='Сделай обе части: ввод и выбор тона.';
}
function checkPinyin(){
  let good=0;
  document.querySelectorAll('.p-card').forEach((card,i)=>{
    const input=card.querySelector('.base-input');
    const baseOk=pinyinItems[i].base.map(normBase).includes(normBase(input.value));
    input.classList.toggle('correct',baseOk);
    input.classList.toggle('wrong',!baseOk);
    const toneStep=card.querySelector('.tone-step');
    if(baseOk) toneStep.classList.add('revealed');
    let toneOk=baseOk && card.dataset.chosen===pinyinItems[i].tone;
    card.querySelectorAll('.tone-btn').forEach(btn=>{
      btn.classList.remove('correct','wrong');
      if(baseOk && btn.textContent===pinyinItems[i].tone) btn.classList.add('correct');
      else if(baseOk && btn.classList.contains('selected') && !toneOk) btn.classList.add('wrong');
    });
    if(baseOk && toneOk) good++;
  });
  const fb=document.getElementById('pinyinFb');
  fb.className='feedback '+(good===pinyinItems.length?'ok':'bad');
  fb.textContent=good===pinyinItems.length ? '✓ Всё правильно!' : `Полностью правильно: ${good} / ${pinyinItems.length}`;
  if(good===pinyinItems.length) markDone(1);
}

/* TASK 2 */
const sentences = [
  '哥哥不会写汉字',
  '妹妹会说一点儿中文',
  '我的朋友喜欢读中文书',
  '这个汉字怎么读？'
];
let dragToken=null;
function makeToken(ch){
  const b=document.createElement('button');
  b.className='char-token'; b.textContent=ch; b.draggable=true;
  b.addEventListener('dragstart',()=>dragToken=b);
  b.onclick=()=>{
    const card=b.closest('.sentence-card');
    const bank=card.querySelector('.token-bank');
    const ans=card.querySelector('.answer-zone');
    if(b.parentElement===bank){ ans.appendChild(b); b.classList.add('answer'); }
    else { bank.appendChild(b); b.classList.remove('answer'); }
  };
  return b;
}
function enableDrop(zone){
  zone.addEventListener('dragover',e=>e.preventDefault());
  zone.addEventListener('drop',e=>{
    e.preventDefault();
    if(!dragToken) return;
    const target=e.target.closest('.char-token');
    if(target && target!==dragToken && target.parentElement===zone){
      const r=target.getBoundingClientRect();
      if(e.clientX < r.left + r.width/2) zone.insertBefore(dragToken,target);
      else zone.insertBefore(dragToken,target.nextSibling);
    }else{
      zone.appendChild(dragToken);
    }
    dragToken.classList.toggle('answer', zone.classList.contains('answer-zone'));
    dragToken=null;
  });
}
function renderSentences(){
  const wrap=document.getElementById('sentenceWrap');
  wrap.innerHTML='';
  sentences.forEach((s,i)=>{
    const card=document.createElement('div');
    card.className='sentence-card';
    card.innerHTML=`<h3>${i+1}. Собери предложение</h3><div class="token-bank"></div><div class="answer-zone"></div>`;
    const bank=card.querySelector('.token-bank');
    shuffle([...s]).forEach(ch=>bank.appendChild(makeToken(ch)));
    enableDrop(bank); enableDrop(card.querySelector('.answer-zone'));
    wrap.appendChild(card);
  });
  const fb=document.getElementById('sentenceFb'); fb.className='feedback'; fb.textContent='Собери все 4 предложения.';
}
function checkSentences(){
  let good=0;
  document.querySelectorAll('.sentence-card').forEach((card,i)=>{
    const current=[...card.querySelector('.answer-zone').children].map(x=>x.textContent).join('');
    const zone=card.querySelector('.answer-zone');
    const ok=current===sentences[i];
    zone.classList.toggle('correct',ok);
    zone.classList.toggle('wrong',!ok);
    if(ok) good++;
  });
  const fb=document.getElementById('sentenceFb');
  fb.className='feedback '+(good===sentences.length?'ok':'bad');
  fb.textContent=good===sentences.length ? '✓ Все предложения собраны правильно!' : `Правильно: ${good} / ${sentences.length}`;
  if(good===sentences.length) markDone(2);
}

/* TASK 3 */
const fillWords=['都','也','一半','出生','住','还是'];
let selectedWord=null;
function renderWordBank(){
  const bank=document.getElementById('wordBank');
  bank.innerHTML='';
  shuffle(fillWords).forEach(w=>{
    const chip=document.createElement('button');
    chip.className='word-chip'; chip.textContent=w; chip.draggable=true;
    chip.addEventListener('dragstart',()=>selectedWord=chip);
    chip.onclick=()=>{
      document.querySelectorAll('.word-chip').forEach(x=>x.classList.remove('active'));
      chip.classList.add('active');
      selectedWord=chip;
    };
    bank.appendChild(chip);
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.dropblank').forEach(blank=>{
    blank.addEventListener('dragover',e=>e.preventDefault());
    blank.addEventListener('drop',e=>{e.preventDefault(); placeWord(blank);});
    blank.addEventListener('click',()=>placeWord(blank));
  });
});
function placeWord(blank){
  if(!selectedWord || selectedWord.classList.contains('used')) return;
  if(blank.dataset.sourceWord){
    const prev=[...document.querySelectorAll('.word-chip')].find(x=>x.textContent===blank.dataset.sourceWord);
    if(prev) prev.classList.remove('used');
  }
  blank.textContent=selectedWord.textContent;
  blank.dataset.value=selectedWord.textContent;
  blank.dataset.sourceWord=selectedWord.textContent;
  selectedWord.classList.add('used');
  document.querySelectorAll('.word-chip').forEach(x=>x.classList.remove('active'));
  selectedWord=null;
}
function checkFill(){
  const blanks=[...document.querySelectorAll('.dropblank')];
  let good=0;
  blanks.forEach(b=>{
    const ok=b.dataset.value===b.dataset.answer;
    b.classList.toggle('correct',ok);
    b.classList.toggle('wrong',!ok);
    if(ok) good++;
  });
  const fb=document.getElementById('fillFb');
  fb.className='feedback '+(good===blanks.length?'ok':'bad');
  fb.textContent=good===blanks.length ? '✓ Все слова стоят правильно!' : `Правильно: ${good} / ${blanks.length}`;
  if(good===blanks.length) markDone(3);
}
function resetFill(){
  document.querySelectorAll('.dropblank').forEach(b=>{
    b.textContent='________';
    delete b.dataset.value;
    delete b.dataset.sourceWord;
    b.classList.remove('correct','wrong');
  });
  renderWordBank();
  const fb=document.getElementById('fillFb'); fb.className='feedback'; fb.textContent='Используй каждое слово один раз.';
}

/* TASK 4 */
const readingQs=[
  {q:'张心心今年多大了？', a:'十二岁', o:['十二岁','十四岁','十五岁']},
  {q:'小朱多大了？', a:'十四岁', o:['十二岁','十四岁','十六岁']},
  {q:'小朱有几个兄弟姐妹？', a:'两个哥哥', o:['一个哥哥','两个哥哥','两个姐姐']},
  {q:'小朱喜欢什么？', a:'喜欢学外语', o:['喜欢学外语','喜欢看电影','喜欢踢足球']},
  {q:'他会说什么语言？', a:'英语和一点儿汉语', o:['英语和一点儿汉语','法语和德语','英语和俄语']}
];
function renderQuestions(){
  const wrap=document.getElementById('questionsWrap');
  wrap.innerHTML='';
  readingQs.forEach((item,i)=>{
    const card=document.createElement('div'); card.className='q-card';
    card.innerHTML=`<div class="q-title">${i+1}. ${item.q}</div><div class="options"></div>`;
    const opts=card.querySelector('.options');
    item.o.forEach(opt=>{
      const b=document.createElement('button');
      b.className='option'; b.textContent=opt;
      b.onclick=()=>{
        opts.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        card.dataset.answer=opt;
      };
      opts.appendChild(b);
    });
    wrap.appendChild(card);
  });
  const fb=document.getElementById('readingFb'); fb.className='feedback'; fb.textContent='Ответь на 5 вопросов.';
}
function checkReading(){
  let good=0;
  document.querySelectorAll('.q-card').forEach((card,i)=>{
    card.querySelectorAll('.option').forEach(btn=>{
      btn.classList.remove('correct','wrong');
      if(btn.textContent===readingQs[i].a) btn.classList.add('correct');
      else if(btn.classList.contains('selected')) btn.classList.add('wrong');
    });
    if(card.dataset.answer===readingQs[i].a) good++;
  });
  const fb=document.getElementById('readingFb');
  fb.className='feedback '+(good===readingQs.length?'ok':'bad');
  fb.textContent=good===readingQs.length ? '✓ Все ответы правильные!' : `Правильно: ${good} / ${readingQs.length}`;
  if(good===readingQs.length) markDone(4);
}

/* init */
renderPinyin();
renderSentences();
renderWordBank();
renderQuestions();
