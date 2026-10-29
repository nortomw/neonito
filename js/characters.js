/* Dibujado de personajes y monumentos. */
export function createCharacters(ctx){
function glow(c,b){ctx.shadowColor=c;ctx.shadowBlur=b}
function drawHeart(x,y,time){ctx.save();ctx.translate(x,y);const scale=1+Math.sin(time*5.6)*.055;ctx.scale(scale,scale);glow('#ff416b',22);ctx.fillStyle='#fb4766';ctx.beginPath();ctx.moveTo(0,16);ctx.bezierCurveTo(-6,10,-20,-1,-18,-10);ctx.bezierCurveTo(-16,-22,-3,-20,0,-12);ctx.bezierCurveTo(7,-24,19,-19,19,-8);ctx.bezierCurveTo(20,1,7,13,0,16);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#ffe8ec';ctx.beginPath();ctx.arc(-6,-8,2.3,0,7);ctx.arc(6,-8,2.3,0,7);ctx.fill();ctx.strokeStyle='#361021';ctx.lineWidth=2.7;ctx.beginPath();ctx.arc(0,-1,4,0,Math.PI);ctx.stroke();ctx.restore()}
function drawSagrada(x,y){
 ctx.save();ctx.translate(x,y);ctx.lineJoin='round';
 const stone='#ffd79c',dark='#986c72';
 ctx.shadowColor='#ffca80';ctx.shadowBlur=15;
 ctx.fillStyle=stone;ctx.beginPath();
 ctx.moveTo(-49,23);ctx.lineTo(-49,-6);ctx.lineTo(-39,-6);ctx.lineTo(-39,-37);
 ctx.lineTo(-33,-58);ctx.lineTo(-27,-37);ctx.lineTo(-27,-6);
 ctx.lineTo(-20,-6);ctx.lineTo(-20,-52);ctx.lineTo(-13,-78);ctx.lineTo(-6,-52);
 ctx.lineTo(-6,-10);ctx.lineTo(6,-10);ctx.lineTo(6,-52);
 ctx.lineTo(13,-78);ctx.lineTo(20,-52);ctx.lineTo(20,-6);
 ctx.lineTo(27,-6);ctx.lineTo(27,-37);ctx.lineTo(33,-58);
 ctx.lineTo(39,-37);ctx.lineTo(39,-6);ctx.lineTo(49,-6);
 ctx.lineTo(49,23);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle=dark;
 for(const tx of [-33,-13,13,33]){ctx.beginPath();ctx.arc(tx,tx===-13||tx===13?-29:-17,3,0,Math.PI*2);ctx.fill()}
 for(const tx of [-35,-21,-7,7,21,35]){ctx.fillRect(tx-2,1,4,10)}
 ctx.fillStyle='#1f3b48';ctx.beginPath();ctx.arc(0,23,11,Math.PI,0);ctx.lineTo(11,23);ctx.fill();
 // Torre central de Jesucristo, coronada por una cruz de cuatro brazos.
 ctx.fillStyle='#f9deb1';ctx.shadowColor='#ffe7a6';ctx.shadowBlur=9;
 ctx.beginPath();ctx.moveTo(-8,-15);ctx.lineTo(-8,-79);ctx.lineTo(-5,-94);
 ctx.lineTo(5,-94);ctx.lineTo(8,-79);ctx.lineTo(8,-15);ctx.closePath();ctx.fill();
 ctx.shadowBlur=0;ctx.fillStyle='#a87975';
 for(const yy of [-72,-58,-44,-30]){ctx.beginPath();ctx.arc(0,yy,2.4,0,Math.PI*2);ctx.fill()}
 ctx.strokeStyle='#fff4ca';ctx.lineWidth=5;ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(0,-115);ctx.lineTo(0,-93);ctx.moveTo(-10,-105);ctx.lineTo(10,-105);ctx.stroke();
 // Torre de la Virgen María y estrella brillante de ocho puntas.
 ctx.fillStyle='#e5d2c9';ctx.beginPath();ctx.moveTo(23,-13);ctx.lineTo(23,-65);
 ctx.lineTo(27,-81);ctx.lineTo(35,-81);ctx.lineTo(39,-65);ctx.lineTo(39,-13);ctx.closePath();ctx.fill();
 ctx.save();ctx.translate(31,-89);ctx.shadowColor='#86ddff';ctx.shadowBlur=15;
 ctx.fillStyle='#bcf0ff';ctx.beginPath();
 for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,r=i%2===0?13:4.7;
 const xx=Math.cos(a)*r,yy=Math.sin(a)*r;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}
 ctx.closePath();ctx.fill();ctx.restore();
 ctx.restore()
}
function drawDemon(d,time){ctx.save();ctx.translate(d.x,d.y);ctx.translate(0,Math.sin(time*3+d.x)*2);glow(d.color,16);ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-12,-10);ctx.lineTo(-12,-22);ctx.lineTo(-3,-13);ctx.moveTo(12,-10);ctx.lineTo(12,-22);ctx.lineTo(3,-13);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-5,-1,3.3,0,7);ctx.arc(5,-1,3.3,0,7);ctx.fill();ctx.fillStyle='#10142e';ctx.beginPath();ctx.arc(-4,-1,1.5,0,7);ctx.arc(6,-1,1.5,0,7);ctx.fill();ctx.restore()}

return {drawHeart,drawSagrada,drawDemon};
}
