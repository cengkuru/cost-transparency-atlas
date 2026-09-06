import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveLens} from '../map-selection.mjs';

const candidates=[{id:'a',point:{x:0,y:0}},{id:'b',point:{x:3,y:4}},{id:'c',point:{x:10,y:0}}];
test('resolves nearest candidate inside and on positive radius boundary',()=>{
  assert.deepEqual(resolveLens({x:0,y:1},candidates,5),{id:'a',distance:1});
  assert.deepEqual(resolveLens({x:0,y:0},[{id:'b',point:{x:3,y:4}}],5),{id:'b',distance:5});
});
test('rejects outside, empty, invalid and nonpositive radius inputs',()=>{
  assert.equal(resolveLens({x:100,y:0},candidates,4.9),null);
  assert.equal(resolveLens({x:0,y:0},[],5),null);
  assert.equal(resolveLens({x:NaN,y:0},candidates,5),null);
  assert.equal(resolveLens({x:0,y:0},[{id:'bad',point:{x:Infinity,y:0}}],5),null);
  assert.equal(resolveLens({x:0,y:0},candidates,0),null);
});
test('stable order wins ties and moving lens or anchor resolves the new nearest',()=>{
  assert.deepEqual(resolveLens({x:1,y:0},[{id:'first',point:{x:0,y:0}},{id:'second',point:{x:2,y:0}}],2),{id:'first',distance:1});
  assert.equal(resolveLens({x:9,y:0},candidates,2)?.id,'c');
  assert.equal(resolveLens({x:0,y:0},[{id:'a',point:{x:8,y:0}},{id:'b',point:{x:1,y:0}}],2)?.id,'b');
});
test('empty or invalid inputs return null and clear stale selection',()=>{
  let selection=resolveLens({x:0,y:0},candidates,2);
  selection=resolveLens({x:0,y:0},[],2);
  assert.equal(selection,null);
});
