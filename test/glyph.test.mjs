import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateGlyphGeometry} from '../glyph.mjs';
const profile=counts=>({id:'fixture',label:'Fixture',available:true,recordCount:100,axes:counts.map(count=>({count,total:100}))});
test('radial geometry preserves zero, halfway and full percentages on the same scale',()=>{const g=calculateGlyphGeometry(profile([0,50,100,25,75]));assert.deepEqual(g.primary.map(a=>a.radius),[80,142.5,205,111.25,173.75]);});
test('missing, string, boolean and invalid counts stay unavailable instead of becoming zero',()=>{const g=calculateGlyphGeometry(profile([null,'',false,-1,101]));assert.deepEqual(g.primary.map(a=>a.radius),Array(5).fill(null));});
test('publisher comparisons use independent denominators and exclusions remain unavailable',()=>{const a=profile([18,18,0,18,18]);a.axes.forEach(x=>x.total=18);const b=profile([107,81,13,107,107]);b.axes.forEach(x=>x.total=107);const g=calculateGlyphGeometry(a,b);assert.equal(g.primary[1].percent,1);assert.ok(Math.abs(g.compare[1].percent-81/107)<1e-12);b.available=false;assert.deepEqual(calculateGlyphGeometry(a,b).compare.map(x=>x.radius),Array(5).fill(null));});
