// Regenerate frozen supplementary evidence from locally cached, hash-verified sources.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import {countCompletedWithActiveProcesses} from '../publisher-insights.mjs';
const snapshot=JSON.parse(fs.readFileSync('data/generated/snapshot.json'));
const evidence={snapshotId:snapshot.snapshotId,verifiedAt:new Date().toISOString().slice(0,10),method:'Count contractingProcesses entries by summary.tender.procurementMethod. Missing or blank methods remain Unstated. No inference of actual competition.',stageMethod:'Count each project record once when project.status is exactly completion and at least one contractingProcesses[].summary.status is exactly active or pre-award. No case folding or interpretation of other values. This compares two reporting levels; it does not establish a delivery problem.',generator:'scripts/procurement-evidence.mjs',publishers:{}};
async function* projects(file,ndjson){
 if(ndjson){const lines=createInterface({input:fs.createReadStream(file),crlfDelay:Infinity});for await(const line of lines)if(line.trim())yield JSON.parse(line);}
 else yield* JSON.parse(fs.readFileSync(file)).projects;
}
for(const p of snapshot.publishers){
 if(p.excluded)continue;
 let file=`data/raw/${p.id}.json`;const ndjson=!fs.existsSync(file);if(ndjson)file=`data/raw/${p.id}.ndjson`;
 const hash=createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);
 assert.equal(hash.digest('hex'),ndjson?p.derivedSha256:p.sha256,`Source hash mismatch: ${p.id}`);
 let records=0,processEntries=0,completedProjectsWithActiveProcesses=0;const methods={};
 for await(const project of projects(file,ndjson)){
  records++;completedProjectsWithActiveProcesses+=countCompletedWithActiveProcesses([project]);
  for(const c of Array.isArray(project.contractingProcesses)?project.contractingProcesses:[]){const value=c?.summary?.tender?.procurementMethod;const method=typeof value==='string'&&value.trim()?value.trim():'Unstated';methods[method]=(methods[method]||0)+1;processEntries++;}
 }
 assert.equal(records,p.recordCount,`Record count mismatch: ${p.id}`);assert.equal(processEntries,p.processEntries,`Process count mismatch: ${p.id}`);
 evidence.publishers[p.id]={sourceSha256:p.sha256,derivedSha256:p.derivedSha256??null,sourceUrl:p.downloadUrl,publishedDate:p.publishedDate,records,processEntries,methods:Object.fromEntries(Object.entries(methods).sort(([a],[b])=>a<b?-1:a>b?1:0)),completedProjectsWithActiveProcesses};
}
fs.writeFileSync('data/procurement-evidence.json',JSON.stringify(evidence,null,2)+'\n');
console.log(`Verified and regenerated supplementary evidence for ${Object.keys(evidence.publishers).length} licensed publishers.`);
