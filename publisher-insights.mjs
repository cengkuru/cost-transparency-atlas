const text=value=>typeof value==='string'&&value.trim()?value.trim():null;
const amount=value=>typeof value==='number'&&Number.isFinite(value)?value:null;

export function countCompletedWithActiveProcesses(projects){
  let count=0;
  for(const project of Array.isArray(projects)?projects:[]){
    if(project?.status!=='completion'||!Array.isArray(project.contractingProcesses))continue;
    if(project.contractingProcesses.some(process=>process?.summary?.status==='active'||process?.summary?.status==='pre-award'))count++;
  }
  return count;
}

export function calculatePublisherInsights(publisher,projects){
  if(publisher?.excluded)return {available:false};
  const id=publisher?.id, rows=(Array.isArray(projects)?projects:[]).filter(row=>row?.sourceId===id);
  const ids=rows.map(row=>text(row.id)), counts=new Map();for(const value of ids.filter(Boolean))counts.set(value,(counts.get(value)||0)+1);
  const population={records:rows.length,distinctIds:counts.size,missingProjectIds:ids.filter(value=>!value).length,repeatedIdRows:ids.filter(Boolean).length-counts.size};
  const byCurrency=new Map();let usableRecords=0;
  for(const row of rows){const value=amount(row.budget?.amount),currency=text(row.budget?.currency);if(value===null||!currency)continue;usableRecords++;const entry=byCurrency.get(currency)||{currency,amount:0,records:0};entry.amount+=value;entry.records++;byCurrency.set(currency,entry);}
  const budgets={usableRecords,missingRecords:rows.length-usableRecords,byCurrency:[...byCurrency.values()].sort((a,b)=>a.currency.localeCompare(b.currency))};
  const sectorCounts=new Map(), stageCounts=new Map();let unstatedStages=0,multiSectorRecords=0;
  for(const row of rows){const sectors=[...new Set((Array.isArray(row.sector)?row.sector:[]).map(text).filter(Boolean))];if(sectors.length>1)multiSectorRecords++;for(const value of sectors)sectorCounts.set(value,(sectorCounts.get(value)||0)+1);const stage=text(row.status);if(stage&&!/^unstated$/i.test(stage))stageCounts.set(stage,(stageCounts.get(stage)||0)+1);else unstatedStages++;}
  const ranked=map=>[...map.entries()].map(([value,records])=>({value,records})).sort((a,b)=>b.records-a.records||(a.value<b.value?-1:a.value>b.value?1:0));
  const sectorValues=ranked(sectorCounts),stageValues=ranked(stageCounts);
  const sectors={top:sectorValues[0]||null,values:sectorValues,unstatedRecords:rows.filter(row=>![...new Set((Array.isArray(row.sector)?row.sector:[]).map(text).filter(Boolean))].length).length,multiSectorRecords};
  const stages={top:stageValues[0]||null,values:stageValues,unstatedRecords:unstatedStages};
  let projectsWithProcesses=0,processEntries=0;for(const row of rows){const value=Object.hasOwn(row,'processEntries')?(Number.isInteger(row.processEntries)&&row.processEntries>=0?row.processEntries:0):(Number.isInteger(row.contractingProcesses)&&row.contractingProcesses>=0?row.contractingProcesses:0);if(value>0)projectsWithProcesses++;processEntries+=value;}
  return {available:true,population,budgets,sectors,stages,contracting:{projectsWithProcesses,projectsWithoutProcesses:rows.length-projectsWithProcesses,processEntries}};
}
