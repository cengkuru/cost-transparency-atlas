import test from 'node:test';
import assert from 'node:assert/strict';
import {nearestPublisherId,wireMapDragSelection} from '../map-selection.mjs';

function adapter(){
  const handlers=new Map();
  let center={lat:0,lng:0};
  return {map:{on(type,fn){handlers.set(type,fn);},getCenter(){return center;}},setCenter(next){center=next;},emit(type){handlers.get(type)?.();},handlers};
}

test('drag selection follows drag lifecycle and settles after inertia',()=>{
  const {map,emit,setCenter}=adapter(), selected=[], settled=[];
  wireMapDragSelection({map,candidates:[{id:'a',lat:0,lng:0},{id:'b',lat:0,lng:20}],onSelection:id=>selected.push(id),onSettled:id=>settled.push(id)});
  emit('move');
  assert.deepEqual(selected,[]);
  emit('dragstart'); emit('move'); setCenter({lat:0,lng:20}); emit('move'); emit('dragend');
  assert.deepEqual(selected,['a','b']);
  assert.deepEqual(settled,[]);
  emit('moveend');
  assert.deepEqual(selected,['a','b','b']);
  assert.deepEqual(settled,['b']);
});

test('nearest selection wraps longitude, ignores invalid candidates and keeps first duplicate',()=>{
  assert.equal(nearestPublisherId({lat:0,lng:179.8},[
    {id:'bad',lat:NaN,lng:0},{id:'west',lat:0,lng:-179.9},{id:'east',lat:0,lng:179.9},
    {id:'east',lat:0,lng:0}
  ]),'east');
  assert.equal(nearestPublisherId({lat:0,lng:0},[{id:'a',lat:0,lng:1},{id:'a',lat:0,lng:0}]),'a');
  assert.equal(nearestPublisherId({lat:0,lng:0},[{id:'bad',lat:null,lng:0},{id:'bad2',lat:91,lng:0}]),null);
});

test('cancel prevents late inertia selection',()=>{
  const {map,emit}=adapter(), selected=[], settled=[];
  const cancel=wireMapDragSelection({map,candidates:[{id:'a',lat:0,lng:0}],onSelection:id=>selected.push(id),onSettled:id=>settled.push(id)});
  emit('dragstart'); cancel(); emit('move'); emit('moveend');
  assert.deepEqual(selected,[]); assert.deepEqual(settled,[]);
});
