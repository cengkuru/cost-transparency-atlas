import test from 'node:test';
import assert from 'node:assert/strict';
import {calculatePublisherInsights,countCompletedWithActiveProcesses} from '../publisher-insights.mjs';

const publisher={id:'ghana_cost_sekondi_takoradi',recordCount:87,excluded:false};
const projects=[
 {sourceId:publisher.id,id:'a',budget:{amount:0,currency:' GHS '},sector:['education',' water ','education'],status:'completion',processEntries:2,contractingProcesses:9},
 {sourceId:publisher.id,id:'a',budget:{amount:'bad',currency:'USD'},sector:['education'],status:'',processEntries:1},
 {sourceId:publisher.id,id:'b',budget:{amount:5,currency:'USD'},sector:['health'],status:'preparation',contractingProcesses:2},
 {sourceId:'other',id:'x',budget:{amount:99,currency:'USD'},sector:['other'],status:'completion'}
];

test('population IDs reconcile and exact publisher filter excludes other sources',()=>{
 const x=calculatePublisherInsights(publisher,projects);assert.equal(x.population.records,3);assert.equal(x.population.distinctIds,2);assert.equal(x.population.repeatedIdRows,1);assert.equal(x.population.missingProjectIds,0);
});
test('budgets preserve zero, reject invalid values, split currencies deterministically',()=>{
 const b=calculatePublisherInsights(publisher,projects).budgets;assert.equal(b.usableRecords,2);assert.equal(b.missingRecords,1);assert.deepEqual(b.byCurrency,[{currency:'GHS',amount:0,records:1},{currency:'USD',amount:5,records:1}]);
});
test('sectors dedupe within rows and ties sort lexically; stages count unstated',()=>{
 const x=calculatePublisherInsights(publisher,projects);assert.deepEqual(x.sectors.values,[{value:'education',records:2},{value:'health',records:1},{value:'water',records:1}]);assert.equal(x.sectors.multiSectorRecords,1);assert.equal(x.stages.unstatedRecords,1);assert.equal(x.stages.top.value,'completion');
});
test('process entries use strict entry count with contracting fallback',()=>{
 const c=calculatePublisherInsights(publisher,projects).contracting;assert.equal(c.projectsWithProcesses,3);assert.equal(c.projectsWithoutProcesses,0);assert.equal(c.processEntries,5);
});
test('excluded publishers expose no calculated values',()=>{const x=calculatePublisherInsights({...publisher,excluded:true},projects);assert.deepEqual(x,{available:false});});
test('whitespace IDs, literal Unstated status, invalid process entries and numeric budget strings are unavailable',()=>{
 const x=calculatePublisherInsights(publisher,[{sourceId:publisher.id,id:'  ',status:'Unstated',budget:{amount:'5',currency:'USD'},processEntries:-1},{sourceId:publisher.id,id:'z',status:'  ',budget:{amount:NaN,currency:' '},processEntries:'2'},{sourceId:publisher.id,id:'y',status:'completion',budget:{amount:Infinity,currency:'USD'}}]);
 assert.equal(x.population.missingProjectIds,1);assert.equal(x.budgets.usableRecords,0);assert.equal(x.stages.unstatedRecords,2);assert.equal(x.contracting.processEntries,0);
});
test('fixed Ghana population preserves 87 rows, distinct IDs, education, completion and zero budgets',()=>{
 const rows=Array.from({length:87},(_,i)=>({sourceId:publisher.id,id:`g-${i}`,sector:['education'],status:'completion',budget:{amount:0,currency:'GHS'}}));
 const x=calculatePublisherInsights(publisher,rows);assert.equal(x.population.records,87);assert.equal(x.population.distinctIds,87);assert.equal(x.sectors.values[0].records,87);assert.equal(x.stages.values[0].records,87);assert.equal(x.budgets.byCurrency[0].amount,0);
});
test('counts completed projects with active or pre-award processes once',()=>{
 const projects=[
  {status:'completion',contractingProcesses:[{summary:{status:'active'}},{summary:{status:'pre-award'}}]},
  {status:'completion',contractingProcesses:[{summary:{status:'closed'}}]},
  {status:'implementation',contractingProcesses:[{summary:{status:'active'}}]},
  {status:'completion',contractingProcesses:[{summary:{status:'active'}},{summary:{status:'active'}}]},
  {status:'completion',contractingProcesses:null},{status:'completion'}
 ];
 assert.equal(countCompletedWithActiveProcesses(projects),2);
});
