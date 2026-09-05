import fs from 'node:fs';
import path from 'node:path';
const text=v=>typeof v==='string'&&v.trim().length>0;
const hasBudget=r=>typeof r.budget?.amount==='number'&&Number.isFinite(r.budget.amount)&&text(r.budget.currency);
const hasProcess=r=>Array.isArray(r.processIds)&&r.processIds.some(text);
export function summarizeTrail(rows){
 const result={recordCount:rows.length,withBudget:0,withProcessId:0,withBoth:0,budgetOnly:0,processOnly:0,neither:0};
 for(const r of rows){const b=hasBudget(r),p=hasProcess(r);result.withBudget+=+b;result.withProcessId+=+p;result[b&&p?'withBoth':b?'budgetOnly':p?'processOnly':'neither']++;}
 return result;
}

export function buildStoryData(snapshot,checks=JSON.parse(fs.readFileSync(new URL('../data/story/source-checks.json',import.meta.url)))){
 const p=snapshot.publishers.find(p=>p.id==='zambia_ncc');
 if(!p||p.excluded||snapshot.snapshotId!==checks.snapshotId||p.sha256!==checks.packageSha256)throw Error('Refresh source checks before publishing this chapter.');
 const rows=snapshot.projects.filter(r=>r.sourceId===p.id),counts=summarizeTrail(rows);
 if(rows.length!==p.recordCount||counts.withBudget!==p.metricCounts[1]||counts.withProcessId!==p.metricCounts[2])throw Error('Story population does not reconcile with snapshot.');
 const records=rows.map(r=>({id:r.id,title:r.title,budget:r.budget,processIds:r.processIds.filter(text),updated:r.updated,source:r.source,category:hasBudget(r)&&hasProcess(r)?'withBoth':hasBudget(r)?'budgetOnly':hasProcess(r)?'processOnly':'neither'}));
 const featuredRecord=records.find(r=>r.id===checks.projectId);
 if(!featuredRecord||featuredRecord.title!==checks.title||!featuredRecord.processIds.includes(checks.processId)||featuredRecord.budget!==null)throw Error('Selected record no longer matches source checks.');
 const groups={both:[],idOnly:[],budgetOnly:[],neither:[]};
 const keys={withBoth:'both',processOnly:'idOnly',budgetOnly:'budgetOnly',neither:'neither'};
 records.forEach(r=>groups[keys[r.category]].push(r.id));
 return {format:'atlas-storyboard-v1',snapshotId:snapshot.snapshotId,generatedAt:snapshot.generatedAt,analysedAt:snapshot.generatedAt,metricVersion:snapshot.metricVersion,publisher:{id:p.id,name:p.name,recordCount:p.recordCount,publishedDate:p.publishedDate,loadedAt:p.loadedAt,retrievedAt:p.loadedAt,sourceUrl:p.sourceUrl,downloadUrl:p.downloadUrl},counts,groups,records,processIds:records.filter(r=>r.processIds.length).map(r=>r.id),featuredRecord,bulemu:featuredRecord,sourceCheck:checks,scope:'All 107 raw records in the NCC Zambia saved package. No sector or status filters. One publisher, not national coverage or a representative country comparison.',definitions:{budget:'A finite numeric project budget amount, including zero, and a non-empty currency.',process:'At least one non-empty contracting-process identifier. This does not test whether it resolves to an accessible record.',intersection:'Budget and identifier must occur in the same saved project record. Counts are presence checks, not verified spending or delivery.'}};
}
export function writeStoryData(input,output){
 const snapshot=typeof input==='string'?JSON.parse(fs.readFileSync(input)):input;
 const data=buildStoryData(snapshot);
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(data));return data;
}
