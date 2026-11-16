const shuffle=a=>[...a].sort(()=>Math.random()-.5);
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
b.classList.add('active'); document.getElementById(b.dataset.tab).classList.add('active');
});
const ws1=['爸爸','妈妈','秘书','电话','哪儿','不是','中国','美国','小姐','出生','什么','怎么样','哪国人','护士','经理','生日'];
const ws2=['今天','秘书','律师','老师','早上','中午','晚上','电话','学生','商人','现在','姐姐','妹妹','记者','兄弟姐妹','公司','工作','电话号码'];
const filler='我是你他她的了有几国人学工上中下早晚天日月年号生爸妈哥弟姐妹妹老师护士经理记者公司电话工作码什哪怎秘律商现吃睡起床课放红蓝白黑大小';
function buildWordSearch(words,size=12){
const board=Array.from({length:size},()=>Array(size).fill(''));
const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const placed=[];
const sorted=[...words].sort((a,b)=>b.length-a.length);
for(const word of sorted){
let ok=false;
for(let tries=0;tries<500&&!ok;tries++){
const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)];
const r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size);
const er=r+dr*(word.length-1),ec=c+dc*(word.length-1);
if(er<0||er>=size||ec<0||ec>=size) continue;
let can=true;
for(let i=0;i<word.length;i++){
const rr=r+dr*i,cc=c+dc*i;
if(board[rr][cc] && board[rr][cc]!==word[i]){can=false;break}
}
if(!can) continue;
const cells=[];
for(let i=0;i<word.length;i++){
const rr=r+dr*i,cc=c+dc*i;board[rr][cc]=word[i];cells.push(`${rr}-${cc}`);
}
placed.push({word,cells});ok=true;
}
}
const chars=[...filler];
for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!board[r][c])board[r][c]=chars[Math.floor(Math.random()*chars.length)];
return {board,placed,size};
}
function initWS(gridId,listId,fbId,words){
const data=buildWordSearch(words,12), grid=document.getElementById(gridId),list=document.getElementById(listId),found=new Set();
grid.style.gridTemplateColumns=`repeat(${data.size},1fr)`; grid.innerHTML='';list.innerHTML='';
data.board.forEach((row,r)=>row.forEach((ch,c)=>{
const d=document.createElement('div');d.className='ws-cell';d.textContent=ch;d.dataset.pos=`${r}-${c}`;grid.appendChild(d);
}));
words.forEach(w=>{const p=document.createElement('div');p.className='word-pill';p.dataset.word=w;p.textContent=w;list.appendChild(p)});
let down=false,start=null,current=[];
const clearDrag=()=>grid.querySelectorAll('.drag').forEach(x=>x.classList.remove('drag'));
function path(a,b){
const [r1,c1]=a.split('-').map(Number),[r2,c2]=b.split('-').map(Number);
const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
const len=Math.max(Math.abs(r2-r1),Math.abs(c2-c1))+1;
if(!((r1===r2)||(c1===c2)||(Math.abs(r2-r1)===Math.abs(c2-c1)))) return [];
const arr=[];for(let i=0;i<len;i++)arr.push(`${r1+dr*i}-${c1+dc*i}`);return arr;
}
grid.onpointerdown=e=>{const cell=e.target.closest('.ws-cell');if(!cell)return;down=true;start=cell.dataset.pos;current=[start];clearDrag();cell.classList.add('drag');cell.setPointerCapture?.(e.pointerId)};
grid.onpointermove=e=>{if(!down)return;const el=document.elementFromPoint(e.clientX,e.clientY);const cell=el?.closest?.('.ws-cell');if(!cell)return;const p=path(start,cell.dataset.pos);if(!p.length)return;current=p;clearDrag();p.forEach(pos=>grid.querySelector(`[data-pos="${pos}"]`)?.classList.add('drag'))};
const finish=()=>{if(!down)return;down=false;const key=current.join('|'),rev=[...current].reverse().join('|');const hit=data.placed.find(x=>x.cells.join('|')===key||x.cells.join('|')===rev);if(hit&&!found.has(hit.word)){found.add(hit.word);hit.cells.forEach(pos=>grid.querySelector(`[data-pos="${pos}"]`)?.classList.add('found'));list.querySelector(`[data-word="${hit.word}"]`)?.classList.add('done');document.getElementById(fbId).innerHTML=`<span class="good">Найдено:</span> ${hit.word} · ${found.size}/${words.length}`}else if(!hit){document.getElementById(fbId).innerHTML='<span class="bad">Это не слово из списка.</span>'}clearDrag()};
grid.onpointerup=finish;grid.onpointercancel=finish;
}
initWS('grid1','list1','fb1',ws1);
initWS('grid2','list2','fb2',ws2);
const clocks=[
{h:6,m:0,ans:'六点'},
{h:7,m:5,ans:'七点零五分'},
{h:1,m:15,ans:'一点一刻'},
{h:9,m:30,ans:'九点半'},
{h:11,m:45,ans:'十一点三刻'},
{h:2,m:20,ans:'两点二十分'},
{h:4,m:55,ans:'四点五十五分'}
];
let activeClock=0;
function clockSVG(h,m){
const cx=90,cy=90,r=70;
const hourA=((h%12)+m/60)*30*Math.PI/180, minA=m*6*Math.PI/180;
const hx=cx+Math.sin(hourA)*38,hy=cy-Math.cos(hourA)*38,mx=cx+Math.sin(minA)*54,my=cy-Math.cos(minA)*54;
let nums='';
for(let n=1;n<=12;n++){const a=n*30*Math.PI/180,x=cx+Math.sin(a)*58,y=cy-Math.cos(a)*58+5;nums+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="13" font-weight="800" fill="#244ba8">${n}</text>`}
return `<svg class="clock-svg" viewBox="0 0 180 180"><circle cx="90" cy="90" r="76" fill="#fbfdff" stroke="#2d5bd7" stroke-width="5"/><circle cx="90" cy="90" r="3.5" fill="#163d9e"/>${nums}<line x1="90" y1="90" x2="${hx}" y2="${hy}" stroke="#172d66" stroke-width="6" stroke-linecap="round"/><line x1="90" y1="90" x2="${mx}" y2="${my}" stroke="#e46b55" stroke-width="4" stroke-linecap="round"/></svg>`;
}
function renderClocks(){
const g=document.getElementById('clockGrid');g.innerHTML='';
clocks.forEach((c,i)=>{
const d=document.createElement('div');d.className='clock-card'+(i===activeClock?' active':'');d.dataset.i=i;
d.innerHTML=clockSVG(c.h,c.m)+`<div class="clock-answer" data-answer></div>`;
d.onclick=()=>{activeClock=i;renderClocks();document.getElementById('clockFb').textContent=`Выбраны часы №${i+1}. Собери ответ снизу.`};g.appendChild(d)
})
}
const hourTokens=['一点','两点','四点','六点','七点','九点','十一点'];
const minTokens=['','零五分','一刻','二十分','半','三刻','五十五分'];
const selections=clocks.map(()=>({h:'',m:''}));
function renderClockKeys(){
const hk=document.getElementById('hourKeys'),mk=document.getElementById('minuteKeys');hk.innerHTML='';mk.innerHTML='';
hourTokens.forEach(t=>{const b=document.createElement('button');b.className='ckey';b.textContent=t;b.onclick=()=>{selections[activeClock].h=t;updateClockAnswer()};hk.appendChild(b)});
minTokens.forEach(t=>{const b=document.createElement('button');b.className='ckey';b.textContent=t||'整点 / без минут';b.onclick=()=>{selections[activeClock].m=t;updateClockAnswer()};mk.appendChild(b)});
}
function updateClockAnswer(){const box=document.querySelector(`.clock-card[data-i="${activeClock}"] [data-answer]`);box.textContent=selections[activeClock].h+selections[activeClock].m;box.classList.remove('ok','no')}
function clearClock(){selections[activeClock]={h:'',m:''};updateClockAnswer()}
function checkClocks(){
let n=0;
clocks.forEach((c,i)=>{const card=document.querySelector(`.clock-card[data-i="${i}"]`),box=card.querySelector('[data-answer]'),v=selections[i].h+selections[i].m,ok=v===c.ans;box.classList.toggle('ok',ok);box.classList.toggle('no',!ok);if(ok)n++});
document.getElementById('clockFb').innerHTML=n===clocks.length?'<span class="good">Все часы записаны правильно!</span>':`<span class="bad">Правильно:</span> ${n}/${clocks.length}`;
}
renderClocks();renderClockKeys();
