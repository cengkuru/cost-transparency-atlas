import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeTrail} from '../scripts/story-data.mjs';

test('joint availability counts the same records, preserves zero, and reconciles all four cells',()=>{
 const rows=[
  {budget:{amount:0,currency:'UGX'},processIds:[' id ']},
  {budget:{amount:2,currency:' '},processIds:['id']},
  {budget:{amount:3,currency:'USD'},processIds:[' ']},
  {budget:{amount:'4',currency:'USD'},processIds:[]}
 ];
 assert.deepEqual(summarizeTrail(rows),{recordCount:4,withBudget:2,withProcessId:2,withBoth:1,budgetOnly:1,processOnly:1,neither:1});
});

test('published chapter is tied to the saved Zambia population and rejects stale source checks',async()=>{
 const {buildStoryData}=await import('../scripts/story-data.mjs');
 const fs=await import('node:fs');
 const snapshot=JSON.parse(fs.readFileSync(new URL('../data/generated/snapshot.json',import.meta.url)));
 const checks=JSON.parse(fs.readFileSync(new URL('../data/story/source-checks.json',import.meta.url)));
 const data=buildStoryData(snapshot,checks);
 assert.equal(data.publisher.id,'zambia_ncc');
 assert.deepEqual(data.counts,{recordCount:107,withBudget:81,withProcessId:13,withBoth:11,budgetOnly:70,processOnly:2,neither:24});
 assert.equal(data.records.length,107);
 assert.equal(new Set(data.records.map(r=>r.id)).size,107);
 assert.equal(data.featuredRecord.category,'processOnly');
 assert.equal(data.featuredRecord.id,checks.projectId);
 assert.equal(data.featuredRecord.budget,null);
 assert.equal(data.sourceCheck.sourceUrl,'https://getfit-zambia.org/solar');
 assert.throws(()=>buildStoryData(snapshot,{...checks,packageSha256:'wrong'}),/source checks/);
 assert.throws(()=>buildStoryData({...snapshot,snapshotId:'changed'},checks),/source checks/);
});
