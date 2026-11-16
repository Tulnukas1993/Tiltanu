const routine=[
{w:'起床',art:'wake'},
{w:'上学',art:'school'},
{w:'上课',art:'class'},
{w:'放学',art:'leave'},
{w:'吃早饭',art:'breakfast'},
{w:'睡觉',art:'sleep'}
];
function routineSVG(type){
const base=`<svg viewBox="0 0 220 150">`;
if(type==='wake')return base+`<rect x="22" y="83" width="128" height="40" rx="12" fill="#8ab4f8"/><rect x="35" y="72" width="48" height="24" rx="10" fill="#fff"/><circle cx="162" cy="52" r="25" fill="#ffd46d"/><line x1="162" y1="15" x2="162" y2="3" stroke="#f1aa1d" stroke-width="5"/><path d="M160 86 q18-24 35 0" fill="none" stroke="#334b7d" stroke-width="6"/><circle cx="164" cy="69" r="12" fill="#f2b28b"/></svg>`;
if(type==='school')return base+`<rect x="118" y="33" width="78" height="88" rx="5" fill="#6aa8e8"/><polygon points="110,35 157,10 204,35" fill="#3058c7"/><rect x="145" y="77" width="24" height="44" fill="#fff"/><circle cx="57" cy="55" r="14" fill="#f2b28b"/><path d="M55 70 L49 112 M55 82 L28 96 M55 84 L84 97 M50 112 L34 136 M50 112 L69 136" stroke="#263b67" stroke-width="7" stroke-linecap="round"/><rect x="67" y="71" width="25" height="32" rx="4" fill="#f4c64f"/></svg>`;
if(type==='class')return base+`<rect x="18" y="25" width="92" height="58" rx="5" fill="#365da9"/><rect x="22" y="29" width="84" height="50" fill="#d9f0e4"/><circle cx="147" cy="43" r="13" fill="#f2b28b"/><path d="M147 58 V104 M147 70 L120 88 M147 72 L177 83" stroke="#273d67" stroke-width="7" stroke-linecap="round"/><rect x="118" y="102" width="66" height="10" rx="4" fill="#b7804d"/><rect x="127" y="112" width="6" height="26" fill="#80542f"/><rect x="170" y="112" width="6" height="26" fill="#80542f"/></svg>`;
if(type==='leave')return base+`<rect x="24" y="32" width="83" height="88" rx="5" fill="#6aa8e8"/><polygon points="16,34 65,10 115,34" fill="#3058c7"/><circle cx="153" cy="54" r="13" fill="#f2b28b"/><path d="M153 68 V109 M153 78 L126 94 M153 80 L183 93 M153 109 L137 135 M153 109 L173 134" stroke="#263b67" stroke-width="7" stroke-linecap="round"/><path d="M190 56 q18 15 0 30" fill="none" stroke="#58a06f" stroke-width="5"/><path d="M199 80 l-11 8 2-14z" fill="#58a06f"/></svg>`;
if(type==='breakfast')return base+`<ellipse cx="105" cy="94" rx="58" ry="23" fill="#eef2f7" stroke="#8fa2bf" stroke-width="3"/><circle cx="91" cy="87" r="20" fill="#fff"/><circle cx="91" cy="87" r="9" fill="#ffc94d"/><rect x="132" y="57" width="35" height="42" rx="6" fill="#6fb9db"/><path d="M167 67 q24 4 15 21 q-5 9-15 5" fill="none" stroke="#6fb9db" stroke-width="6"/><path d="M57 61 q14-20 28 0 M79 53 q14-20 28 0" fill="none" stroke="#c5cad4" stroke-width="4"/></svg>`;
return base+`<rect x="22" y="78" width="145" height="45" rx="12" fill="#7b8fd8"/><rect x="35" y="67" width="46" height="24" rx="10" fill="#fff"/><circle cx="72" cy="75" r="11" fill="#f2b28b"/><path d="M80 84 q45 1 64 28" fill="none" stroke="#34466d" stroke-width="9"/><path d="M172 28 q-20 4-21 24 q2 20 23 20 q-13-7-13-22 q0-14 11-22z" fill="#ffd766"/><circle cx="192" cy="28" r="3" fill="#ffd766"/><circle cx="203" cy="45" r="2.5" fill="#ffd766"/></svg>`;
}
function resetRoutine(){
const g=document.getElementById('routineGrid'),b=document.getElementById('routineBank');g.innerHTML='';b.innerHTML='';
routine.forEach((r,i)=>{const d=document.createElement('div');d.className='routine-card';d.innerHTML=`<div class="routine-art">${routineSVG(r.art)}</div><div class="dropword" data-answer="${r.w}">перетащи слово сюда</div>`;g.appendChild(d)});
shuffle(routine).forEach(r=>{const d=document.createElement('div');d.className='dragword';d.draggable=true;d.textContent=r.w;d.dataset.word=r.w;d.ondragstart=e=>e.dataTransfer.setData('text/plain',r.w);b.appendChild(d)});
document.querySelectorAll('.dropword,#routineBank').forEach(z=>{z.ondragover=e=>e.preventDefault();z.ondrop=e=>{e.preventDefault();const w=e.dataTransfer.getData('text/plain'),chip=[...document.querySelectorAll('.dragword')].find(x=>x.dataset.word===w);if(!chip)return;if(z.id==='routineBank'){z.appendChild(chip)}else{if(z.querySelector('.dragword'))b.appendChild(z.querySelector('.dragword'));z.textContent='';z.appendChild(chip)}}});
document.getElementById('routineFb').textContent='Перетащи все 6 слов.';
}
function checkRoutine(){
let n=0;document.querySelectorAll('.dropword').forEach(z=>{const chip=z.querySelector('.dragword'),ok=chip&&chip.dataset.word===z.dataset.answer;z.classList.toggle('ok',ok);if(ok)n++});
document.getElementById('routineFb').innerHTML=n===routine.length?'<span class="good">Все 6 изображений сопоставлены правильно!</span>':`<span class="bad">Правильно:</span> ${n}/${routine.length}`;
}
resetRoutine();
const datesQ=[
{id:'d1',py:'Jīntiān jǐ hào?',cn:'今天几号？'},
{id:'d2',py:'Jīntiān xīngqī jǐ?',cn:'今天星期几？'},
{id:'d3',py:'Xīngqīliù shì jǐ hào?',cn:'星期六是几号？'},
{id:'d4',py:'Jiǔyuè yī hào shì xīngqīwǔ ma?',cn:'九月一号是星期五吗？'},
{id:'d5',py:'Xīngqītiān shì èrshíqī hào ma?',cn:'星期天是二十七号吗？'}
];
const datesA=[
{id:'d2',py:'Jīntiān xīngqī’èr.',cn:'今天星期二。'},
{id:'d4',py:'Shì, jiǔyuè yī hào shì xīngqīwǔ.',cn:'是，九月一号是星期五。'},
{id:'d1',py:'Jīntiān sānyuè èr hào.',cn:'今天三月二号。'},
{id:'d3',py:'Xīngqīliù shì qīyuè wǔ hào.',cn:'星期六是七月五号。'},
{id:'d5',py:'Bú shì, xīngqītiān shì èrshíliù hào.',cn:'不是，星期天是二十六号。'}
];
const personalQ=[
{id:'p1',py:'Nǐ jiào shénme míngzi?',cn:'你叫什么名字？'},
{id:'p2',py:'Nǐ de shēngrì shì jǐ yuè jǐ hào?',cn:'你的生日是几月几号？'},
{id:'p3',py:'Nǐ jīnnián duō dà le?',cn:'你今年多大了？'},
{id:'p4',py:'Nǐ jiā yǒu jǐ kǒu rén?',cn:'你家有几口人？'},
{id:'p5',py:'Nǐ shì nǎ guó rén?',cn:'你是哪国人？'},
{id:'p6',py:'Nǐ māma gōngzuò ma?',cn:'你妈妈工作吗？'},
{id:'p7',py:'Nǐ bàba zuò shénme gōngzuò?',cn:'你爸爸做什么工作？'}
];
const personalA=[
{id:'p3',py:'Shí’èr suì.',cn:'十二岁。'},
{id:'p4',py:'Wǔ kǒu rén.',cn:'五口人。'},
{id:'p1',py:'Wǒ jiào Wáng Tiānyī.',cn:'我叫王天一。'},
{id:'p7',py:'Tā shì shāngrén.',cn:'他是商人。'},
{id:'p6',py:'Tā bù gōngzuò.',cn:'她不工作。'},
{id:'p2',py:'Sìyuè shíbā rì.',cn:'四月十八日。'},
{id:'p5',py:'Wǒ shì Zhōngguó rén.',cn:'我是中国人。'}
];
function initMatch(qEl,aEl,fbEl,questions,answers){
const qbox=document.getElementById(qEl),abox=document.getElementById(aEl),fb=document.getElementById(fbEl);qbox.innerHTML='';abox.innerHTML='';let selected=null,done=new Set();
questions.forEach((x,i)=>{const d=document.createElement('div');d.className='match-card';d.dataset.id=x.id;d.dataset.side='q';d.innerHTML=`<div class="num">${i+1}</div><div><div class="py">${x.py}</div><div class="cn">${x.cn}</div></div>`;qbox.appendChild(d)});
shuffle(answers).forEach((x,i)=>{const d=document.createElement('div');d.className='match-card';d.dataset.id=x.id;d.dataset.side='a';d.innerHTML=`<div class="num">${String.fromCharCode(97+i)}</div><div><div class="py">${x.py}</div><div class="cn">${x.cn}</div></div>`;abox.appendChild(d)});
function click(e){const c=e.target.closest('.match-card');if(!c||c.classList.contains('matched'))return;if(c.dataset.side==='q'){qbox.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));selected=c;c.classList.add('selected');return}if(!selected){fb.innerHTML='<span class="bad">Сначала выбери вопрос слева.</span>';return}if(selected.dataset.id===c.dataset.id){selected.classList.remove('selected');selected.classList.add('matched');c.classList.add('matched');done.add(c.dataset.id);fb.innerHTML=`<span class="good">Верно!</span> ${done.size}/${questions.length}`;selected=null}else{c.classList.add('selected');fb.innerHTML='<span class="bad">Не эта пара.</span>';setTimeout(()=>c.classList.remove('selected'),350)}}
qbox.onclick=click;abox.onclick=click;
}
initMatch('dateQuestions','dateAnswers','dateFb',datesQ,datesA);
initMatch('personalQuestions','personalAnswers','personalFb',personalQ,personalA);