/* Geometría del laberinto y colisiones. */
export function oct(x,y,w,h,b){return [[x+b,y],[x+w-b,y],[x+w,y+b],[x+w,y+h-b],[x+w-b,y+h],[x+b,y+h],[x,y+h-b],[x,y+b]]}
export function pointInPoly(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){let a=p[i],b=p[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))inside=!inside;}return inside}
export function nearPoly(x,y,r,p){if(pointInPoly(x,y,p))return true;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));if(Math.hypot(x-(a[0]+t*dx),y-(a[1]+t*dy))<r)return true}return false}
