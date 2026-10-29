import {MAPH,MAX_LIVES,DEMON_COLORS} from "./config.js";
import {oct,pointInPoly,nearPoly} from "./geometry.js";
import {createCharacters} from "./characters.js";

(()=>{
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d'),W=672,H=600,T=32;const colors=DEMON_COLORS;
let hasBook=false,bookShared=false,bookExchanged=false,activeSocial=null,socialSafe=0,angelCooldown=0,friendship=0,friendActions=new Set();const library={x:235,y:1135},friends=[{x:235,y:1520,color:'#b98aff',name:'LUMA'},{x:440,y:470,color:'#ffb868',name:'SOL'},{x:440,y:1300,color:'#76e6b0',name:'NILO'}],angels=[{x:350,y:735},{x:350,y:1640}];
let walls=[],shelters=[],dots=[],rewards=[],demons=[],hero,hasKey=false,score=0,lives=3,energy=100,velocity=4,running=false,paused=true,ended=false,cam=0,frame=0,last=0,restTime=0,invincible=0,toastTime=0,down=Object.create(null),direction={x:0,y:1},shops=[],activeShop=null,shopOpened=false;
function glow(color,blur){ctx.shadowColor=color;ctx.shadowBlur=blur}
function path(poly){ctx.beginPath();poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath()}
const home={x:336,y:82},keySpot={x:239,y:2010},seaStart=2070;
const church={x:242,y:880,w:188,h:188,type:'church'},parkLeft={x:40,y:880,w:170,h:188,type:'park'},parkRight={x:462,y:880,w:170,h:188,type:'park'};
function build(){friendship=0;friendActions=new Set();socialSafe=0;angelCooldown=0;hasBook=false;bookShared=false;bookExchanged=false;activeSocial=null;shops=[{x:235,y:470,icon:'☕',name:'CAFETERÍA',items:[['☕ Café',40],['💧 Agua',20]],used:false},{x:440,y:675,icon:'🍎',name:'FRUTERÍA',items:[['🍎 Manzana',15],['🍌 Plátano',15]],used:false},{x:235,y:1300,icon:'🥪',name:'BAR',items:[['🥪 Bocadillo',60],['💧 Agua',20]],used:false}];activeShop=null;shopOpened=false;$('shopBox').style.display='none';$('shopEnter').style.display='none';hasKey=false;walls=[];shelters=[{...parkLeft,poly:oct(parkLeft.x,parkLeft.y,parkLeft.w,parkLeft.h,25)},{...church,poly:oct(church.x,church.y,church.w,church.h,23)},{...parkRight,poly:oct(parkRight.x,parkRight.y,parkRight.w,parkRight.h,25)}];
 for(let row=0;row<9;row++)for(let col=0;col<3;col++){
  const x=55+col*209,y=190+row*205,w=160,h=154;
  const collides=shelters.some(s=>x<s.x+s.w&&x+w>s.x&&y<s.y+s.h&&y+h>s.y);
  if(!collides)walls.push({poly:oct(x,y,w,h,25),x,y,w,h,kind:'block'});
 }
 dots=[];rewards=[];
 for(let y=65;y<MAPH-55;y+=35)for(let x=25;x<W-20;x+=35){if(y>=seaStart||isWall(x,y,13)||shelterAt(x,y)||(Math.hypot(x-home.x,y-home.y)<40||Math.hypot(x-keySpot.x,y-keySpot.y)<30))continue;if(Math.random()<.68)dots.push({x,y})}
 const rewardSeeds=[[336,150,'🍎',100],[520,430,'🥚',150],[130,660,'☕',200],[336,1180,'💧',250],[548,1260,'🍎',100],[356,1470,'🥚',150],[104,1700,'💧',250],[544,1990,'☕',200]];
 for(let [x,y,icon,value] of rewardSeeds){if(y<seaStart&&!isWall(x,y,16)&&!shelterAt(x,y))rewards.push({x,y,icon,value,taken:false});}
 hero={x:336,y:139,r:14};direction={x:0,y:1};demons=[{x:115,y:450,color:colors[0],dx:0,dy:1},{x:560,y:715,color:colors[1],dx:-1,dy:0},{x:140,y:1400,color:colors[2],dx:0,dy:-1}];cam=0;restTime=0;invincible=0;energy=100;hud();}
function isWall(x,y,r=12){if(x<r+7||x>W-r-7||y<r+7||y>MAPH-r-7)return true;return walls.some(w=>nearPoly(x,y,r,w.poly))}
function shelterAt(x,y){return shelters.find(s=>pointInPoly(x,y,s.poly))}
function inSea(x,y){return y>=seaStart&&y<MAPH-15}
function safe(x,y){return !!shelterAt(x,y)||inSea(x,y)}
function hud(){$('friendship').textContent=friendship+' ♥';$('energy').textContent=Math.round(energy)+'%';$('points').textContent=String(score).padStart(5,'0');$('lives').textContent=Array.from({length:lives},()=> '♥').join(' ')||'—'}
function message(t){const el=$('toast');el.textContent=t;el.classList.add('show');toastTime=performance.now()+2200}
function overlay(title,desc,btn){paused=true;$('overlay').style.display='flex';$('overlayTitle').innerHTML=title;$('overlayDescription').textContent=desc;$('play').textContent=btn}
function go(){shopOpened=false;$('shopBox').style.display='none';if(ended){score=0;lives=MAX_LIVES;ended=false;build()}running=true;paused=false;$('overlay').style.display='none'}
function reset(){shopOpened=false;score=0;lives=MAX_LIVES;ended=false;running=false;build();overlay('NEONITO <span style="color:#ff658d">♥</span>','Visita la biblioteca, conoce otros corazones, comparte o intercambia libros, encuentra la llave y vuelve a casa.','EMPEZAR ↗')}
function move(e,x,y,r=14){if(!isWall(e.x+x,e.y,r))e.x+=x;if(!isWall(e.x,e.y+y,r))e.y+=y}
function update(dt){if(paused||shopOpened)return;let vx=0,vy=0;if(down.left||down.a)vx--;if(down.right||down.d)vx++;if(down.up||down.w)vy--;if(down.down||down.s)vy++;if(vx||vy){const n=Math.hypot(vx,vy);direction={x:vx/n,y:vy/n};}else if(!down.touch){vx=0;vy=0}
 if(down.touch){vx=direction.x;vy=direction.y}const n=Math.hypot(vx,vy)||1,moveSpeed=(72+velocity*21)*(0.65+0.35*energy/100)*dt;move(hero,vx/n*moveSpeed,vy/n*moveSpeed);
 const swimming=inSea(hero.x,hero.y);if(swimming){const before=energy;energy=Math.min(100,energy+28*dt);if(before<99.5&&energy>=99.5)message('🌊 ¡Baño revitalizante! Energía al 100%.')}else if(vx||vy){energy=Math.max(10,energy-1.15*dt)}
 activeShop=shops.find(s=>Math.hypot(hero.x-s.x,hero.y-s.y)<42)||null;
 activeSocial=Math.hypot(hero.x-library.x,hero.y-library.y)<47?'library':(friends.find(f=>Math.hypot(hero.x-f.x,hero.y-f.y)<47)?.name||null);
 $('shopEnter').style.display=activeSocial||activeShop?'block':'none';$('shopEnter').textContent=activeSocial?(activeSocial==='library'?'VISITAR BIBLIOTECA · E':'SALUDAR A '+activeSocial+' · E'):(activeShop?'ENTRAR EN '+activeShop.name+' · E':'');
 socialSafe=Math.max(0,socialSafe-dt);angelCooldown=Math.max(0,angelCooldown-dt);for(const a of angels){if(Math.hypot(hero.x-a.x,hero.y-a.y)<31&&angelCooldown<=0){energy=Math.min(100,energy+35);angelCooldown=22;message('😇 Un angelito te da +35 de energía')}}
 const refuge=shelterAt(hero.x,hero.y);if(refuge){if(refuge.type==='church'&&lives<MAX_LIVES){lives=MAX_LIVES;hud();message('🏛️ Sagrada Família: ¡vidas recuperadas!')}if(refuge.type==='park'){restTime+=dt;if(restTime>7&&lives<MAX_LIVES){lives++;hud();restTime=0;message('🌳 Has descansado: +1 vida')}}}else restTime=0;
 if(!hasKey&&Math.hypot(hero.x-keySpot.x,hero.y-keySpot.y)<24){hasKey=true;score+=300;message('🗝️ ¡Llave encontrada! Regresa a casa.');hud()}
 if(hasKey&&Math.hypot(hero.x-home.x,hero.y-home.y)<38){score+=500;ended=true;hud();overlay('¡EN CASA! 🏠','¡Has encontrado la llave y vuelto a casa! Puntuación: '+score+' puntos.','OTRA PARTIDA ↗');return}
 dots=dots.filter(d=>{if(Math.hypot(hero.x-d.x,hero.y-d.y)<18){score+=10;return false}return true});
 rewards.forEach(p=>{if(!p.taken&&Math.hypot(hero.x-p.x,hero.y-p.y)<25){p.taken=true;score+=p.value;message(p.icon+' Premio: +'+p.value+' puntos')}});hud();
 demons.forEach((d,i)=>{const dist=Math.hypot(hero.x-d.x,hero.y-d.y),target=dist>450?{x:336+Math.sin(frame/80+i)*220,y:hero.y+220}:hero;
 let ux=(target.x-d.x)/(dist||1),uy=(target.y-d.y)/(dist||1);if(safe(hero.x,hero.y)||socialSafe>0){ux=Math.cos(frame/45+i*2);uy=Math.sin(frame/45+i*2)};
 const sp=(40+velocity*12)*dt,opts=[[ux,uy],[d.dx,d.dy],[-uy,ux],[uy,-ux],[-ux,-uy]];
 let chosen=null;for(const [dx,dy]of opts){let nx=d.x+dx*sp,ny=d.y+dy*sp;if(!isWall(nx,ny,14)&&!shelters.some(s=>nearPoly(nx,ny,14,s.poly))&&!inSea(nx,ny)&&!(socialSafe>0&&Math.hypot(nx-hero.x,ny-hero.y)<170)){chosen=[dx,dy];break}}if(chosen){d.dx=chosen[0];d.dy=chosen[1];move(d,d.dx*sp,d.dy*sp)}
 if(Math.hypot(hero.x-d.x,hero.y-d.y)<26&&!safe(hero.x,hero.y)&&socialSafe<=0&&invincible<=0){lives--;invincible=2.6;hud();message('💔 ¡Un demonio te ha alcanzado!');if(lives<=0){ended=true;overlay('FIN DEL RECORRIDO','Has conseguido '+score+' puntos. Vuelve a explorar el laberinto.','REINICIAR ↗')}}});
 if(invincible>0)invincible-=dt;
 // No existe meta en el extremo del mapa: la victoria exige la llave y volver a casa.
 cam+=((Math.max(0,Math.min(MAPH-H,hero.y-H*.38)))-cam)*Math.min(1,dt*5);
}
const {drawHeart,drawSagrada,drawDemon}=createCharacters(ctx);
function draw(t){const time=t/1000;ctx.clearRect(0,0,W,H);const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0a142c');bg.addColorStop(1,'#0a1025');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(0,-cam);
 for(let y=Math.floor(cam/64)*64;y<cam+H+64;y+=64){ctx.strokeStyle='#ffffff07';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 ctx.lineWidth=1;ctx.strokeStyle='#153a60';for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,cam);ctx.lineTo(x,cam+H);ctx.stroke()}
 // El Mediterráneo: costa tranquila al final del recorrido, con oleaje muy sutil.
 ctx.save();const water=ctx.createLinearGradient(0,seaStart,0,MAPH);water.addColorStop(0,'#237a93');water.addColorStop(0.4,'#125d88');water.addColorStop(1,'#103c76');ctx.fillStyle=water;ctx.fillRect(0,seaStart,W,MAPH-seaStart);ctx.strokeStyle='#8debed';ctx.lineWidth=4;ctx.beginPath();for(let x=0;x<=W;x+=4){const yy=seaStart+Math.sin(x*.018+time*.9)*3; x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke();ctx.strokeStyle='#8ddfe35f';ctx.lineWidth=2;for(let j=0;j<3;j++){ctx.beginPath();for(let x=25;x<W-25;x+=5){let y=seaStart+35+j*28+Math.sin(x*.022+time*.7+j)*5;x===25?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.stroke()}ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillStyle='#e3ffff';ctx.fillText('MAR MEDITERRÁNEO',W/2,seaStart+28);ctx.font='12px system-ui';ctx.fillText('🌊 BAÑO · RECUPERA ENERGÍA',W/2,seaStart+52);ctx.restore();
 walls.forEach(w=>{if(w.y!==undefined&&(w.y+w.h<cam-20||w.y>cam+H+20))return;path(w.poly);ctx.fillStyle='#111c39';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#397fee';glow('#3674df',9);ctx.stroke();ctx.shadowBlur=0});
 shelters.forEach(s=>{if(s.y>cam+H+40||s.y+s.h<cam-40)return;path(s.poly);ctx.fillStyle=s.type==='church'?'#243f50':'#113e35';ctx.fill();ctx.strokeStyle=s.type==='church'?'#ffcf86':'#65dfa1';ctx.lineWidth=4;glow(ctx.strokeStyle,12);ctx.stroke();ctx.shadowBlur=0;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 14px system-ui';ctx.fillStyle='#f6e5bb';if(s.type==='church'){
 drawSagrada(s.x+s.w/2,s.y+s.h/2-23);ctx.font='bold 13px system-ui';ctx.fillText('SAGRADA FAMÍLIA',s.x+s.w/2,s.y+s.h/2+30);ctx.font='11px system-ui';ctx.fillText('♥ RECARGAR VIDAS',s.x+s.w/2,s.y+s.h/2+51);
 }else{ctx.font='45px serif';ctx.fillText('🌳',s.x+s.w/2,s.y+s.h/2-25);ctx.font='bold 15px system-ui';ctx.fillStyle='#acf5c5';ctx.fillText('PARQUE',s.x+s.w/2,s.y+s.h/2+24);ctx.font='11px system-ui';ctx.fillText('ZONA SEGURA',s.x+s.w/2,s.y+s.h/2+44)}});
 shops.forEach(s=>{if(s.y<cam-60||s.y>cam+H+60)return;ctx.save();const selected=activeShop===s;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#13384a';ctx.strokeStyle=selected?'#ffe4a1':'#5bcae3';ctx.lineWidth=2;glow(ctx.strokeStyle,selected?17:7);ctx.beginPath();ctx.roundRect(s.x-19,s.y-19,38,38,9);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.font='24px "Segoe UI Emoji","Apple Color Emoji",sans-serif';ctx.fillText(s.icon,s.x,s.y);ctx.font='bold 10px system-ui';ctx.fillStyle='#dbf9ff';ctx.fillText(s.name,s.x,s.y+29);ctx.restore()});
 // Biblioteca y personaje amistoso: dos encuentros opcionales.
 for(const obj of [{...library,emoji:'📚',label:hasBook?'BIBLIOTECA · LIBRO PRESTADO':'BIBLIOTECA'}]){
 if(obj.y<cam-65||obj.y>cam+H+65)continue;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#252b53';ctx.strokeStyle='#d9afff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(obj.x,obj.y,25,0,7);ctx.fill();ctx.stroke();ctx.font='30px "Segoe UI Emoji","Apple Color Emoji",sans-serif';ctx.fillText(obj.emoji,obj.x,obj.y);ctx.fillStyle='#edd8ff';ctx.font='bold 11px system-ui';ctx.fillText(obj.label,obj.x,obj.y+37)
 }
 // Casa y llave se dibujan sobre el mapa.
 if(home.y>cam-60&&home.y<cam+H+60){ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='37px serif';ctx.fillText('🏠',home.x,home.y);ctx.font='bold 12px system-ui';ctx.fillStyle='#a6f4ff';ctx.fillText(hasKey?'VUELVE A CASA':'CASA · CERRADA',home.x,home.y+34)}
 if(!hasKey&&keySpot.y>cam-40&&keySpot.y<cam+H+40){ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='32px serif';glow('#ffd778',12);ctx.fillText('🗝️',keySpot.x,keySpot.y+Math.sin(time*3)*4);ctx.shadowBlur=0}
 dots.forEach(p=>{if(p.y<cam-15||p.y>cam+H+15)return;ctx.fillStyle='#b6cdf9';glow('#4b9cff',4);ctx.beginPath();ctx.arc(p.x,p.y,2.6,0,7);ctx.fill();ctx.shadowBlur=0});
 rewards.forEach(p=>{if(p.taken||p.y<cam-30||p.y>cam+H+30)return;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='25px "Segoe UI Emoji","Apple Color Emoji",sans-serif';ctx.fillText(p.icon,p.x,p.y+Math.sin(time*2+p.x)*3)});
 friends.forEach(f=>{if(f.y<cam-45||f.y>cam+H+45)return;ctx.save();ctx.translate(f.x,f.y);const z=1+Math.sin(time*4+f.x)*.04;ctx.scale(z,z);ctx.fillStyle=f.color;glow(f.color,13);ctx.beginPath();ctx.moveTo(0,13);ctx.bezierCurveTo(-7,8,-17,-2,-13,-10);ctx.bezierCurveTo(-9,-17,-2,-15,0,-9);ctx.bezierCurveTo(4,-17,14,-17,15,-8);ctx.bezierCurveTo(17,0,8,9,0,13);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#18213b';ctx.beginPath();ctx.arc(-4,-5,1.6,0,7);ctx.arc(5,-5,1.6,0,7);ctx.fill();ctx.restore();ctx.font='bold 11px system-ui';ctx.fillStyle=f.color;ctx.textAlign='center';ctx.fillText(f.name,f.x,f.y+27)});
 angels.forEach(a=>{if(a.y<cam-45||a.y>cam+H+45)return;ctx.save();ctx.translate(a.x,a.y+Math.sin(time*2+a.x)*3);ctx.font='29px serif';ctx.textAlign='center';glow('#fff4b8',15);ctx.fillText('😇',0,0);ctx.shadowBlur=0;ctx.font='bold 10px system-ui';ctx.fillStyle='#fff1be';ctx.fillText('ENERGÍA',0,19);ctx.restore()});
 demons.forEach(d=>{if(d.y>cam-40&&d.y<cam+H+40)drawDemon(d,time)});if(invincible<=0||Math.floor(time*8)%2===0)drawHeart(hero.x,hero.y,time);
 ctx.restore();ctx.fillStyle='#a0beeb';ctx.font='bold 11px system-ui';ctx.fillText((hasKey?'↑ REGRESA A CASA 🗝️':'↓ ENCUENTRA LA LLAVE 🗝️'),12,H-16);
 if(!paused&&!shopOpened){update(Math.min(.045,Math.max(0,(t-last)/1000)||.016))}last=t;if(toastTime&&performance.now()>toastTime){$('toast').classList.remove('show');toastTime=0}frame++;requestAnimationFrame(draw)}
 function enterShop(){if((!activeShop&&!activeSocial)||paused||shopOpened)return;shopOpened=true;down.touch=false;Object.keys(down).forEach(k=>down[k]=false);if(activeSocial){const visit=activeSocial;const isLibrary=visit==='library';$('shopIcon').textContent=isLibrary?'📚':'💗';$('shopTitle').textContent=isLibrary?'BIBLIOTECA DEL BARRIO':visit+' · AMISTAD';$('shopChoices').replaceChildren();
 const addChoice=(title,fn)=>{let b=document.createElement('button');b.className='btn primary';b.textContent=title;b.addEventListener('click',()=>{fn();hud();shopOpened=false;$('shopBox').style.display='none';activeSocial=null;$('shopEnter').style.display='none'});$('shopChoices').append(b)};
 if(isLibrary){$('shopDescription').textContent=hasBook?'Ya llevas un libro contigo. ¡Puedes compartirlo o intercambiarlo con otros corazones!':'Aquí los libros se prestan gratuitamente. Elige uno para llevarte.';if(!hasBook)addChoice('📖 Llevarme un libro · GRATIS',()=>{hasBook=true;message('📖 ¡Libro prestado! Busca a otros corazones para compartirlo.')});}
 else{$('shopDescription').textContent='La amistad no tiene precio. Invitar cuesta puntos, pero es un gesto de generosidad que fortalece el vínculo. Mientras socializamos, los demonios se alejan.';socialSafe=18;
 const friendKey=visit;
 const socialAction=(type,label,cost,friendGain,energyGain,after)=>{const id=friendKey+':'+type;if(friendActions.has(id))return;if(cost>score)return;addChoice(label,()=>{if(cost>score||friendActions.has(id))return;score-=cost;friendship+=friendGain;energy=Math.min(100,energy+energyGain);friendActions.add(id);socialSafe=25;if(after)after();message('💞 Amistad +'+friendGain+' · '+(cost?'−'+cost+' puntos':'compartir')+' · demonios lejos')})};
 socialAction('charlar','❤️ Conversar · +10 amistad',0,10,10);
 socialAction('agua','💧 Invitar agua · −20 puntos · +35 amistad',20,35,15);
 socialAction('cafe','☕ Invitar café · −40 puntos · +60 amistad',40,60,20);
 socialAction('bocadillo','🥪 Invitar bocadillo · −60 puntos · +90 amistad',60,90,25);
 if(hasBook&&!bookShared&&!bookExchanged){socialAction('lectura','📖 Compartir lectura · +20 amistad',0,20,30,()=>{bookShared=true});socialAction('intercambio','🔄 Intercambiar libro · +25 amistad',0,25,30,()=>{bookExchanged=true;hasBook=false})}}
 $('shopBox').style.display='flex';$('shopEnter').style.display='none';return}
 const s=activeShop;$('shopIcon').textContent=s.icon;$('shopTitle').textContent=s.name;$('shopDescription').textContent=s.used?'Ya has disfrutado de esta parada. Puedes descansar aquí un momento.':'Compra con los puntos recogidos. Los demonios te esperan fuera.';$('shopChoices').replaceChildren();if(!s.used){s.items.forEach(([name,points])=>{const b=document.createElement('button');b.className='btn primary';b.textContent=name+' · '+points+' puntos';b.disabled=score<points;b.addEventListener('click',()=>{if(score<points)return;s.used=true;score-=points;lives=Math.min(MAX_LIVES,lives+1);hud();message(name+' · −'+points+' puntos · ♥ +1');$('shopBox').style.display='none';shopOpened=false;$('shopEnter').style.display='none';activeShop=null});$('shopChoices').append(b)})}$('shopBox').style.display='flex';$('shopEnter').style.display='none'}
 $('shopEnter').addEventListener('click',enterShop);$('shopClose').addEventListener('click',()=>{shopOpened=false;$('shopBox').style.display='none'});
 $('velocity').addEventListener('input',e=>{velocity=+e.target.value;$('velocityText').textContent=velocity+'/10'});$('play').addEventListener('click',go);$('restart').addEventListener('click',reset);$('visit').addEventListener('click',()=>{if(ended){score=0;lives=MAX_LIVES;ended=false;build()}hero.x=336;hero.y=815;cam=Math.max(0,hero.y-150);running=true;paused=false;$('overlay').style.display='none';message('🏙️ ¡Bienvenida al Eixample!')});
 window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='escape'&&shopOpened){shopOpened=false;$('shopBox').style.display='none';return}if(k==='e'&&!e.repeat){enterShop();return}if(shopOpened)return;if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k)){if(document.activeElement?.tagName==='INPUT')return;e.preventDefault();down[k.replace('arrow','')]=true}});window.addEventListener('keyup',e=>down[e.key.toLowerCase().replace('arrow','')]=false);
 const dd={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
 const joy=$('joystick'),knob=$('joyKnob');let joyPointer=null,buttonPointer=null;
 function stopTouch(){down.touch=false;direction={x:0,y:0};knob.style.transform='translate(0px,0px)'}
 function setMode(m){stopTouch();const j=m==='joystick';joy.hidden=!j;$('dpad').hidden=j;$('useJoystick').setAttribute('aria-pressed',String(j));$('useButtons').setAttribute('aria-pressed',String(!j))}
 $('useJoystick').addEventListener('click',()=>setMode('joystick'));
 $('useButtons').addEventListener('click',()=>setMode('buttons'));
 function moveStick(e){const rect=joy.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy),limit=rect.width*.30,deadzone=rect.width*.075;
  if(d<deadzone){stopTouch();return}const f=Math.min(d,limit)/d;knob.style.transform=`translate(${dx*f}px,${dy*f}px)`;
  direction={x:dx/d,y:dy/d};down.touch=true;
 }
 joy.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);moveStick(e)});
 joy.addEventListener('pointermove',e=>{if(joyPointer===e.pointerId){e.preventDefault();moveStick(e)}});
 function endJoy(e){if(joyPointer===e.pointerId){joyPointer=null;stopTouch()}}
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>joy.addEventListener(t,endJoy));
 document.querySelectorAll('[data-d]').forEach(b=>{
  b.addEventListener('pointerdown',e=>{e.preventDefault();buttonPointer=e.pointerId;b.setPointerCapture(e.pointerId);const [x,y]=dd[b.dataset.d];direction={x,y};down.touch=true});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,e=>{if(buttonPointer===e.pointerId){buttonPointer=null;stopTouch()}}));
 });
 // Swipe remains an optional quick nudge on the canvas.
 let swipe=null,swipeTimer=null;
 canvas.addEventListener('touchstart',e=>{if(e.touches.length===1)swipe=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
 canvas.addEventListener('touchend',e=>{if(!swipe)return;let dx=e.changedTouches[0].clientX-swipe[0],dy=e.changedTouches[0].clientY-swipe[1];swipe=null;if(Math.hypot(dx,dy)<24||joyPointer!==null||buttonPointer!==null)return;
  direction=Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)};down.touch=true;clearTimeout(swipeTimer);swipeTimer=setTimeout(stopTouch,260)
 },{passive:true});
 window.addEventListener('blur',stopTouch);
 build();requestAnimationFrame(draw);
})();
