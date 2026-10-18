// Browser acceptance and WCAG smoke tests for the standalone fictional demo.
// npm ci && npx playwright install chromium && npm run test:browser
// On Mac with preexisting Chromium: PW_CHROMIUM_EXECUTABLE=/path/to/chrome-headless-shell npm run test:browser
const assert=require("node:assert/strict");
const path=require("node:path");
const http=require("node:http");
const fs=require("node:fs");
const {chromium}=require("playwright");
const axePath=require.resolve("axe-core/axe.min.js");
const root=path.resolve(__dirname,"..");
let url;
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  const item=path.resolve(root,"."+pathname.replace(/\/$/,"/index.html"));
  if(!(item===root||item.startsWith(root+path.sep)))return res.writeHead(403).end();
  const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8"};
  fs.readFile(item,(error,body)=>{
   if(error)return res.writeHead(404).end();
   res.writeHead(200,{"content-type":types[path.extname(item)]||"application/octet-stream"});
   res.end(body);
  });
});
const TABS=["overview","inspection","evidence","estimate","materials","review"];
const browserOptions={headless:true};
if(process.env.PW_CHROMIUM_EXECUTABLE)browserOptions.executablePath=process.env.PW_CHROMIUM_EXECUTABLE;

async function check(){
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 url="http://127.0.0.1:"+server.address().port+"/";
 const browser=await chromium.launch(browserOptions);
 let checks=0,axeScans=0;
 try{
  for(const [name,viewport] of Object.entries({
    "iphone-se":{width:320,height:740},
    "iphone":{width:390,height:844},
    "tablet":{width:768,height:1024},
    "desktop":{width:1440,height:900}
  })){
   const page=await browser.newPage({viewport,deviceScaleFactor:1,bypassCSP:true});
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
   await page.goto(url,{waitUntil:"load"});
   assert.equal(await page.evaluate(()=>scrollY),0,name+" unexpected initial scroll");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+" horizontal overflow");
   assert.equal(await page.locator("[role=tab]").count(),6);
   assert.equal(await page.locator("input[type=password],input[type=email],form").count(),0);
   assert.equal(await page.locator("#residentialPlan").isVisible(),true);
   const dataset=await page.evaluate(()=>window.RGSmartInspectDemo.projects);
   assert.equal(dataset.residential.checkpoints.length,30);
   assert.equal(dataset.commercial.checkpoints.length,30);
   checks+=6;
   // The six-panel walkthrough works in order, without authentication.
   for(const next of ["inspection","evidence","estimate","materials","review","overview"]){
    await page.locator('.panel:not([hidden]) [data-next-tab="'+next+'"]') .click();
    assert.equal(await page.locator("#panel-"+next).isVisible(),true);
   }
   checks+=6;
   for(const project of ["residential","commercial"]){
    await page.locator(project==="residential"?"#resBtn":"#commBtn").click();
    await page.getByRole("tab",{name:"Overview"}).click();
    assert.equal(await page.locator(project==="residential"?"#residentialPlan":"#commercialPlan").isVisible(),true);
    assert.ok((await page.locator("#projectTitle").innerText()).toLowerCase().includes(project));
    await page.getByRole("tab",{name:"Inspection"}).click();
    assert.equal(await page.locator("#checkpointList details").count(),30);
    await page.locator('[data-filter="flag"]').click();
    assert.equal(await page.locator("#checkpointList details").count(),4);
    await page.locator('[data-filter="limit"]').click();
    assert.equal(await page.locator("#checkpointList details").count(),2);
    await page.locator('[data-filter="all"]').click();
    await page.locator("#inspectionSearch").fill(project==="residential"?"drip-edge":"seams");
    assert.ok(await page.locator("#checkpointList details").count()>0);
    await page.locator("#inspectionSearch").fill("");
    await page.getByRole("tab",{name:"Evidence"}).click();
    assert.equal(await page.locator("#evidenceGrid article").count(),6);
    await page.getByRole("tab",{name:"Visual proposal"}).click();
    assert.equal(await page.locator("#scopeList .scope-row").count(),5);
    await page.locator('#scopeList [data-show-evidence]').first().click();
    assert.equal(await page.locator("#evidenceGrid article").count(),1);
    await page.locator("#clearEvidence").click();
    assert.equal(await page.locator("#evidenceGrid article").count(),6);
    await page.getByRole("tab",{name:"Roof systems"}).click();
    assert.equal(await page.locator(project==="residential"?"#shingleMaterials":"#tpoMaterials").isVisible(),true);
    await page.getByRole("tab",{name:"Quality review"}).click();
    assert.equal(await page.locator("#qaGateList .qa-stage").count(),6);
    checks+=13;
   }
   // Deep-link, print, keyboard and browser history support.
   await page.goto(url+"?project=commercial&tab=estimate");
   assert.equal(await page.locator("#projectTitle").innerText(),"Commercial roof inspection");
   assert.equal(await page.locator("#panel-estimate").isVisible(),true);
   await page.evaluate(()=>{window.print=()=>window.__demoPrintCalled=true;});
   await page.locator("#printDemo").click();
   assert.equal(await page.evaluate(()=>window.__demoPrintCalled),true);
   assert.equal(await page.locator("#printReport li").count(),35);
   await page.emulateMedia({media:"print"});
   assert.equal(await page.locator("#printReport").evaluate(e=>getComputedStyle(e).display),"block");
   assert.equal(await page.locator("main").evaluate(e=>getComputedStyle(e).display),"none");
   await page.emulateMedia({media:"screen"});
   await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
   await page.getByRole("tab",{name:"Inspection"}).focus();
   await page.keyboard.press("ArrowRight");
   assert.equal(await page.locator("#tab-evidence").getAttribute("aria-selected"),"true");
   await page.locator("#resBtn").click();
   await page.goBack();
   assert.equal(await page.locator("#projectTitle").innerText(),"Commercial roof inspection");
   checks+=8;
   if(name==="iphone"||name==="desktop"){
    await page.goto(url);
    await page.addScriptTag({path:axePath});
    for(const project of ["residential","commercial"]){
     await page.locator(project==="residential"?"#resBtn":"#commBtn").click();
     for(const tab of TABS){
      await page.locator("#tab-"+tab).click();
      const violations=await page.evaluate(async()=>{
       const report=await axe.run(document,{
        runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}
       });
       return report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));
      });
      assert.deepEqual(violations,[],name+" "+project+" "+tab+" WCAG issues: "+JSON.stringify(violations));
      axeScans++;
     }
    }
   }
   assert.deepEqual(errors,[],name+" browser errors");
   await page.close();
   console.log("PASS "+name+" : inspection, proposal, evidence, roofing systems, QA, history, print, and responsive layout");
  }
  console.log("PASS "+checks+" interaction assertions and "+axeScans+" WCAG 2.1 AA accessibility scans");
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
check().catch(e=>{console.error("BROWSER QA FAILED",e.stack||e);process.exitCode=1;});
