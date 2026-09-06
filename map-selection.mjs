const finitePoint=point=>point&&Number.isFinite(point.x)&&Number.isFinite(point.y);

/** Resolve the nearest finite anchor within a positive lens radius. */
export function resolveLens(lensPoint,candidates,radius){
  if(!finitePoint(lensPoint)||!Number.isFinite(radius)||radius<=0||!Array.isArray(candidates))return null;
  let result=null,best=Infinity;
  for(const candidate of candidates){
    if(!candidate||candidate.id==null||!finitePoint(candidate.point))continue;
    const dx=candidate.point.x-lensPoint.x,dy=candidate.point.y-lensPoint.y,distance=Math.hypot(dx,dy);
    if(!Number.isFinite(distance)||distance>radius||distance>=best)continue;
    best=distance;result={id:candidate.id,distance};
  }
  return result;
}
