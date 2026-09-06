import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p));
test('road story stays traceable to its immutable publisher snapshot and source extract',()=>{
 const d=read('data/story/road-project.json'),s=read('data/generated/snapshots/atlas-56e8378e871df657e298.json');
 assert.equal(d.snapshotId,s.snapshotId);assert.equal(d.packageSha256,s.publishers.find(p=>p.id===d.publisherId).sha256);
 const p=d.project,e=d.provenance.fieldEvidence;
 assert.equal(p.id,e.id.value);assert.equal(p.process.id,e.processId.value);
 assert.match(e.title.value,/R762 Mocímboa da Praia-Palma/);assert.match(e.processTitle.value,/81 kms/);assert.equal(p.lengthKm,81);
 for(const k of ['budget','contractValue','projectStatus'])assert.deepEqual(p[k],e[k].value);
 assert.equal(p.plannedStart,e.plannedStart.value.slice(0,10));assert.equal(p.plannedEnd,e.plannedEnd.value.slice(0,10));assert.ok(p.plannedEnd>p.plannedStart);
 for(const k of Object.keys(p.organizations))assert.equal(p.organizations[k],e[k].value);
 assert.equal(p.process.status,e.processStatus.value);
 assert.match(e.description.value,/drenagem/);assert.match(e.description.value,/buracos/);assert.match(e.description.value,/sinalização/);
 assert.equal(p.reportedPayments.count,e.transactions.value.length);
 assert.equal(Math.round(p.reportedPayments.total*100),e.transactions.value.reduce((n,t)=>n+Math.round(t.value.amount*100),0));
 assert.equal(p.reportedPayments.lastDate,e.transactions.value.map(t=>t.date.slice(0,10)).sort().at(-1));
 assert.ok(Number.isFinite(p.budget.amount));assert.equal(p.budget.currency,'MZN');assert.equal(p.contractValue.currency,'MZN');
 assert.ok(d.provenance.boundaries.length>=5);assert.ok(d.provenance.sourceUrl.startsWith('https://'));
 for(const [key,f]of Object.entries(e)){assert.ok(f.path.startsWith('projects[0].'),key);assert.equal(d.provenance.fieldPaths[key],f.path);}
 assert.ok(!JSON.stringify(d).includes('@'));assert.ok(!JSON.stringify(d).includes('telephone'));
});
