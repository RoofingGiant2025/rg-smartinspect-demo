import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const html=read("index.html"),css=read("styles.css"),app=read("app.js"),dataSource=read("data.js");
const fixtureWindow={};
vm.runInNewContext(dataSource,{window:fixtureWindow});
const data=fixtureWindow.RGSmartInspectDemo;
const projects=data.projects;

test("public site has six usable, keyboard-addressable sections",()=>{
 const tabs=["overview","inspection","evidence","estimate","materials","review"];
 for(const id of tabs){
  assert.match(html,new RegExp('id="tab-'+id+'"'));
  assert.match(html,new RegExp('id="panel-'+id+'"'));
  assert.match(html,new RegExp('data-tab="'+id+'"'));
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,"IDs must be unique for accessible labeling");
 const appTargets=[...app.matchAll(/\$\("([^"]+)"\)/g)].map(x=>x[1]);
 for(const id of appTargets)assert.ok(ids.includes(id),"missing DOM target "+id);
 assert.match(app,/ArrowRight/);assert.match(app,/ArrowLeft/);
 assert.match(app,/popstate/);assert.match(html,/skip-link/);
 assert.equal([...html.matchAll(/data-next-tab="[a-z]+"/g)].length,6,"every tab needs a guided next step");
});
test("both fictional projects contain 30 checkpoints with reconciled statuses",()=>{
 for(const [type,p] of Object.entries(projects)){
  assert.equal(p.names.length,30,type);
  assert.equal(p.guidance.length,30,type);
  assert.equal(p.checkpoints.length,30,type);
  assert.deepEqual([p.counts.ok,p.counts.flag,p.counts.limit],[24,4,2],type);
  const ids=p.checkpoints.map(x=>x.id);
  assert.equal(ids.length,new Set(ids).size,"unique checkpoint IDs");
  for(const check of p.checkpoints){
    assert.ok(check.name.length>4&&check.area.length>3&&check.guidance.length>15);
    assert.ok(check.observation.length>15&&check.next.length>15);
  }
 }
});
test("each sample scope line traces to a valid finding and evidence references",()=>{
 for(const [kind,p] of Object.entries(projects)){
  const evidenceIds=new Set(p.evidence.map(e=>e[0]));
  assert.equal(p.scope.length,5);
  assert.equal(evidenceIds.size,p.evidence.length,"unique sample evidence IDs");
  for(const proposal of p.scope){
   assert.ok(Number.isInteger(proposal.checkpoint));
   assert.ok(p.checkpoints[proposal.checkpoint]);
   assert.ok(proposal.quantity.length>0);
   const check=p.checkpoints[proposal.checkpoint];
   for(const id of proposal.source){
    assert.ok(evidenceIds.has(id),kind+" has unknown source "+id);
    assert.ok(check.evidence.includes(id),kind+" checkpoint evidence mismatch "+id);
   }
  }
  for(const evidence of p.evidence){
   assert.equal(evidence.length,4);
   assert.ok(p.checkpoints[evidence[3]].evidence.includes(evidence[0]));
  }
 }
});
test("commercial TPO is separated from residential shingle system decisions",()=>{
 assert.match(html,/commercialPlan/);
 assert.match(html,/TPO · thermoplastic single ply/);
 assert.match(html,/Do not apply asphalt-shingle drip-edge or starter-strip details to a TPO assembly/);
 assert.match(app,/tpoMaterials/);
 assert.equal(Object.keys(data.manufacturers).length,4);
 for(const m of Object.values(data.manufacturers)){
  assert.match(m.link,/^https:\/\//);
  assert.ok(m.rules.length>=4);
  assert.doesNotMatch(m.status,/APPROVED|CERTIFIED/);
 }
});
test("public demo cannot collect credentials or mutate CRM records",()=>{
 const source=[html,app,dataSource,css].join("\n");
 assert.doesNotMatch(html,/<form\b|<input[^>]+type=["']?(?:password|email|file)/i);
 assert.doesNotMatch(app,/\bfetch\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon/);
 assert.doesNotMatch(html,/trycloudflare\.com|CF_Authorization|Authorization:\s*Bearer|sk-proj-|ghp_/);
 assert.doesNotMatch(source,/\/member\/|centralblock\.com\/api|roofinggiant\.com\/api\/|\.submit\(/);
 assert.match(html,/FICTIONAL|fictional/i);
 assert.match(html,/not a real|not a completed|not a quote|not priced/i);
 assert.match(html,/noindex/);
});
test("printable fictional report and image safeguards are implemented",()=>{
 assert.match(html,/id="printReport"/);
 assert.match(app,/window\.print\(\)/);
 assert.match(app,/NO APPROVAL.*NO WARRANTY.*NO PRICING/);
 assert.match(html,/not real photographs/i);
 assert.match(html,/not approved roof assemblies/i);
 assert.match(css,/printing-sample/);
});
