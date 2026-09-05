const finite = value => Number.isFinite(value);

function point(candidate){
  const coordinates = candidate?.coordinates || candidate?.position;
  const lat = candidate?.lat ?? coordinates?.lat ?? coordinates?.[0];
  const lng = candidate?.lng ?? coordinates?.lng ?? coordinates?.[1];
  return finite(lat) && finite(lng) && lat>=-90 && lat<=90 ? {lat,lng} : null;
}

function wrappedDelta(a,b){
  return ((a-b+540)%360)-180;
}

/** Return the nearest valid publisher id to a Leaflet center. */
export function nearestPublisherId(center,candidates){
  const origin=point(center);
  if(!origin || !Array.isArray(candidates)) return null;
  const seen=new Set(), lat0=origin.lat*Math.PI/180;
  let nearest=null, distance=Infinity;
  for(const candidate of candidates){
    const id=candidate?.id, target=point(candidate);
    if(id==null || seen.has(id) || !target) continue;
    seen.add(id);
    const lat=target.lat*Math.PI/180;
    const dLat=lat-lat0, dLng=wrappedDelta(target.lng,origin.lng)*Math.PI/180;
    const hav=Math.sin(dLat/2)**2+Math.cos(lat0)*Math.cos(lat)*Math.sin(dLng/2)**2;
    if(hav<distance){nearest=id;distance=hav;}
  }
  return nearest;
}

/** Keep map exploration selection in sync through Leaflet drag and inertia. */
export function wireMapDragSelection({map,candidates,onSelection,onSettled}){
  let dragging=false, cancelled=false;
  const select=()=>{
    if(cancelled || !dragging) return null;
    const id=nearestPublisherId(map.getCenter?.(),candidates);
    if(id!=null) onSelection?.(id);
    return id;
  };
  const start=()=>{cancelled=false;dragging=true;};
  const move=()=>select();
  const settled=()=>{
    if(cancelled || !dragging) return;
    const id=nearestPublisherId(map.getCenter?.(),candidates);
    if(id!=null) onSelection?.(id);
    onSettled?.(id);
    dragging=false;
  };
  map.on('dragstart',start); map.on('move',move); map.on('moveend',settled);
  return ()=>{cancelled=true;dragging=false;};
}
