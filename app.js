// Roofing Giant SmartInspect public demo controller.
// No network calls, forms, data storage, authentication, upload, or CRM mutations.
(function () {
  "use strict";
  const dataset=window.RGSmartInspectDemo;
  const $=id=>document.getElementById(id);
  const nodes=(query,root=document)=>Array.from(root.querySelectorAll(query));
  const make=(tag,className,text)=>{
    const item=document.createElement(tag);
    if(className)item.className=className;
    if(text!==undefined)item.textContent=String(text);
    return item;
  };
  const values=dataset?.projects||{};
  const manufacturers=dataset?.manufacturers||{};
  const TABS=["overview","inspection","evidence","estimate","materials","review"];
  const inputs=new URLSearchParams(location.search);
  const state={
    project:inputs.get("project") in values?inputs.get("project"):"residential",
    tab:TABS.includes(inputs.get("tab"))?inputs.get("tab"):"overview",
    filter:"all",
    brand:"gaf",
    query:"",
    evidenceId:null
  };
  const project=()=>values[state.project];
  const counts=p=>p.counts;
  const announce=message=>{$("demoAnnouncement").textContent=message;};
  const statusLabel={ok:"Reviewed (demo)",flag:"Needs follow-up",limit:"Inaccessible"};
  const statusBadge=(status,text)=>make("span","status "+status,text||statusLabel[status]);

  function syncLocation(push=false){
    const url=new URL(location.href);
    url.searchParams.set("project",state.project);
    url.searchParams.set("tab",state.tab);
    const route=url.pathname+url.search;
    const active=location.pathname+location.search;
    if(active!==route)history[push?"pushState":"replaceState"]({project:state.project,tab:state.tab},"",route);
  }
  function showTab(tab,{save=true,scroll=false,focus=false}={}){
    if(!TABS.includes(tab))return;
    state.tab=tab;
    nodes("[data-tab]").forEach(button=>{
      const selected=button.dataset.tab===tab;
      button.setAttribute("aria-selected",String(selected));
      button.tabIndex=selected?0:-1;
    });
    nodes(".panel").forEach(panel=>{panel.hidden=panel.id!=="panel-"+tab;});
    const tabButton=$("tab-"+tab);
    const nav=$("demoTabs");
    if(nav&&tabButton){
      const left=tabButton.offsetLeft-nav.offsetLeft;
      if(left<nav.scrollLeft||left+tabButton.offsetWidth>nav.scrollLeft+nav.clientWidth)
        nav.scrollLeft=Math.max(0,left-nav.clientWidth/4);
      if(focus)tabButton.focus({preventScroll:true});
    }
    if(save)syncLocation(true);
    if(scroll)$("workspace").scrollIntoView({block:"start",behavior:"smooth"});
  }
  function setProject(key,{save=true}={}){
    if(!(key in values))return;
    state.project=key;
    state.filter="all";state.query="";state.evidenceId=null;
    $("inspectionSearch").value="";
    nodes("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter==="all")));
    nodes("[data-project]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.project===key)));
    render();
    if(save)syncLocation(true);
    announce(project().title+" selected. All sample information is fictional.");
  }
  function render(){
    const p=project();
    $("projectTitle").textContent=p.title;
    $("projectSubtitle").textContent=p.subtitle;
    $("overviewType").textContent=p.type;
    $("overviewDescription").textContent=p.description;
    $("estimateTitle").textContent=p.estimate;
    $("overviewProjectType").textContent=state.project==="residential"?"Pitched-shingle roof":"Low-slope TPO roof";
    // SVG elements do not reliably reflect the HTML .hidden property in
    // WebKit/Chromium. Toggle the actual attribute for each roof plan.
    for(const [id,show] of [["residentialPlan",state.project==="residential"],["commercialPlan",state.project==="commercial"]]){
      if(show)$(id).removeAttribute("hidden");
      else $(id).setAttribute("hidden","");
    }
    const b=$("summaryBadges");b.replaceChildren(
      statusBadge("ok",counts(p).ok+" reviewed"),
      statusBadge("flag",counts(p).flag+" follow-up"),
      statusBadge("limit",counts(p).limit+" inaccessible")
    );
    $("inspectionCount").textContent=counts(p).ok+" reviewed · "+counts(p).flag+" follow-up · "+counts(p).limit+" inaccessible";
    $("inspectionProgress").style.width=(counts(p).ok/p.checkpoints.length*100)+"%";
    $("inspectionProgress").setAttribute("aria-valuenow",String(counts(p).ok));
    $("inspectionProgress").setAttribute("aria-valuemax",String(p.checkpoints.length));
    $("evidenceOverview").textContent=p.evidence.length+" fictional evidence reference slots";
    renderCheckpoints();renderEvidence();renderProposal();renderMaterials();renderQA();makePrintReport();
  }

  function makeCheckpoint(item){
    const card=make("details","checkpoint");
    card.dataset.checkpointIndex=String(item.index);
    card.id="checkpoint-"+item.id;
    const summary=make("summary");
    const icon=make("span","checkpoint-number",String(item.index+1).padStart(2,"0"));
    const title=make("span","checkpoint-heading",item.name);
    const badge=statusBadge(item.status);
    summary.append(icon,title,badge);
    card.append(summary);
    const main=make("div","checkpoint-body");
    const meta=make("p","tiny muted",item.id+" · "+item.area+" · FICTIONAL EXAMPLE");
    const observation=make("p","",item.observation);
    const note=make("p","",item.guidance);
    const next=make("p","",item.next);
    const evidence=make("div","checkpoint-actions");
    if(item.evidence.length){
      for(const id of item.evidence){
        const button=make("button","text-button","View "+id);
        button.type="button";button.dataset.showEvidence=id;
        evidence.append(button);
      }
    }else{
      evidence.append(make("small","muted","No sample evidence slot linked to this checkpoint."));
    }
    main.append(meta,make("h4","","Sample observation"),observation,
      make("h4","","What a real inspector should verify"),note,
      make("h4","","Next step / limitation"),next,evidence);
    card.append(main);
    return card;
  }
  function renderCheckpoints(){
    const p=project();
    const search=state.query.toLowerCase();
    const shown=p.checkpoints.filter(item=>
      (state.filter==="all"||item.status===state.filter)&&
      (!search||[item.name,item.id,item.area,item.observation,item.guidance].join(" ").toLowerCase().includes(search))
    );
    $("inspectionFilterCount").textContent=shown.length+" of "+p.checkpoints.length+" fictional checkpoints shown";
    const root=$("checkpointList");
    root.replaceChildren(...shown.map(makeCheckpoint));
    $("checkpointEmpty").hidden=shown.length!==0;
  }
  function selectCheckpoint(index){
    if(!Number.isInteger(index)||index<0||index>=project().checkpoints.length)return;
    state.filter="all";state.query="";
    $("inspectionSearch").value="";
    nodes("[data-filter]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.filter==="all")));
    renderCheckpoints();
    showTab("inspection",{save:true,scroll:true});
    const card=$("checkpoint-"+project().checkpoints[index].id);
    if(card){
      card.open=true;
      requestAnimationFrame(()=>card.scrollIntoView({block:"nearest",behavior:"smooth"}));
      card.querySelector("summary")?.focus({preventScroll:true});
      announce("Checkpoint "+(index+1)+" opened: "+project().checkpoints[index].name);
    }
  }

  function evidenceCard(item){
    const [id,area,label,checkpointIndex]=item;
    const c=make("article","evidence-card");
    const img=make("div","evidence-placeholder");
    img.setAttribute("aria-label","No real inspection photograph available");
    img.append(make("span","camera-icon","▣"),make("span","watermark","FICTIONAL PLACEHOLDER"));
    const details=make("div","evidence-info");
    details.append(make("span","kicker",id),make("h4","",area),make("p","muted tiny",label));
    const help=make("p","tiny muted","No photograph was captured or supplied. This ID exists only to demonstrate provenance links.");
    const button=make("button","text-button","Open linked checkpoint");
    button.type="button";button.dataset.inspect=String(checkpointIndex);
    details.append(help,button);
    c.append(img,details);
    return c;
  }
  function renderEvidence(){
    const p=project();
    const visible=state.evidenceId?p.evidence.filter(x=>x[0]===state.evidenceId):p.evidence;
    $("evidenceFilterStatus").textContent=state.evidenceId?
      "Viewing "+state.evidenceId+" · fictional placeholder only":"All "+p.evidence.length+" fictional reference slots";
    $("clearEvidence").hidden=!state.evidenceId;
    $("evidenceGrid").replaceChildren(...visible.map(evidenceCard));
  }
  function openEvidence(id){
    if(!project().evidence.some(x=>x[0]===id))return;
    state.evidenceId=id;
    renderEvidence();
    showTab("evidence",{save:true,scroll:true});
    announce("Showing "+id+". This is a fictional reference placeholder, not a photograph.");
  }

  function makeScopeRow(scope){
    const row=make("article","scope-row");
    const top=make("div","scope-top");
    const left=make("div");
    left.append(make("h4","",scope.title),make("p","muted tiny",
      "Origin: checkpoint "+(scope.checkpoint+1)+" · "+project().checkpoints[scope.checkpoint].name));
    top.append(left,make("span","qty",scope.quantity));
    const chips=make("div","scope-evidence");
    for(const id of scope.source){
      const b=make("button","text-button",id);
      b.type="button";b.dataset.showEvidence=id;
      chips.append(b);
    }
    if(!scope.source.length)chips.append(make("small","muted","No evidence — documented access limitation."));
    const inspect=make("button","text-button","Review source finding →");
    inspect.type="button";inspect.dataset.inspect=String(scope.checkpoint);
    chips.append(inspect);
    row.append(top,chips);
    return row;
  }
  function renderProposal(){
    const p=project();
    $("scopeCount").textContent=p.scope.length+" fictional work/limitation lines";
    $("scopeList").replaceChildren(...p.scope.map(makeScopeRow));
    $("proposalLimitations").textContent=p.counts.limit+" inspection areas inaccessible; "+p.counts.flag+
      " hypothetical findings await field verification.";
  }

  function renderMaterials(){
    const residential=state.project==="residential";
    $("shingleMaterials").hidden=!residential;
    $("tpoMaterials").hidden=residential;
    $("roofMaterialsLead").textContent=residential?
      "Explore example shingle-system families and the documentation gates that prevent incorrect roof-layer illustrations.":
      "TPO is a low-slope, single-ply commercial assembly. Asphalt-shingle starter and ridge-cap selections do not apply to this fictional roof.";
    if(residential)renderBrand();
  }
  function renderBrand(){
    const x=manufacturers[state.brand];
    nodes("[data-brand]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.brand===state.brand)));
    $("brandTitle").textContent=x.title;
    $("brandUnderlay").textContent=x.underlay;
    $("brandStarter").textContent=x.starter;
    $("brandStatus").textContent=x.status;
    $("brandRules").replaceChildren(...x.rules.map(s=>make("li","",s)));
    const link=$("brandSource");
    link.href=x.link;link.textContent="Open "+state.brand.toUpperCase()+" manufacturer website ↗";
  }
  function renderQA(){
    const p=project();
    $("qaSummary").textContent=p.counts.flag+" sample follow-up items and "+p.counts.limit+
      " inaccessible areas must be resolved before any real inspection could be finalized.";
    const stages=[
      ["Field safety & access","Actual site access, inspection notes and permissions must be verified.","pending"],
      ["Evidence completeness","Sample evidence IDs are placeholders; real images must be captured and bound.","pending"],
      ["Quantities & scope","Illustrative quantities require measurements and estimator confirmation.","pending"],
      ["Manufacturer documents","Product compatibility, geometry and current instructions require technical sign-off.","pending"],
      ["Independent review","A different authorized reviewer must examine the exact current report revision.","pending"],
      ["Customer release","Email, signature, quote acceptance and work orders are disabled here.","blocked"]
    ];
    const list=$("qaGateList");
    list.replaceChildren(...stages.map(([title,desc,status],i)=>{
      const item=make("div","qa-stage");
      item.append(make("span","qa-index",String(i+1).padStart(2,"0")));
      const left=make("div");
      left.append(make("b","",title),make("p","muted tiny",desc));
      item.append(left,make("span","status "+(status==="blocked"?"flag":"pending"),status==="blocked"?"NOT ENABLED":"PENDING"));
      return item;
    }));
  }
  function makePrintReport(){
    const p=project();
    const paper=$("printReport");
    paper.replaceChildren();
    paper.append(make("h1","","ROOFING GIANT · SMARTINSPECT FICTIONAL REPORT"),
      make("p","watermark-report","FICTIONAL DEMO · NOT AN INSPECTION · NOT A QUOTE"),
      make("h2","",p.title),
      make("p","",p.subtitle+" · "+p.type),
      make("p","",p.counts.ok+" reviewed (demo) · "+p.counts.flag+" follow-up · "+p.counts.limit+" inaccessible"),
      make("h2","","Sample scope (unpriced)"));
    const items=make("ol","print-list");
    for(const item of p.scope)items.append(make("li","",item.title+" — "+item.quantity+
      " — source checkpoint "+(item.checkpoint+1)+" — "+(item.source.join(", ")||"not photographed")));
    paper.append(items,make("h2","","30 fictional checkpoint results"));
    const checks=make("ol","print-list");
    for(const item of p.checkpoints)checks.append(make("li","",item.name+
      " ["+statusLabel[item.status]+"] · "+item.area+" — "+item.observation));
    paper.append(checks,make("h2","","Release requirements"),
      make("p","","Current manufacturer instructions, authentic property evidence, verified quantities, "+
        "qualified technical review, independent sign-off and customer authorization are required for real reports."),
      make("p","watermark-report","NO APPROVAL · NO WARRANTY · NO PRICING · NO LIVE CRM DATA"));
  }
  function printExample(){
    makePrintReport();
    document.body.classList.add("printing-sample");
    window.print();
  }
  window.addEventListener("afterprint",()=>document.body.classList.remove("printing-sample"));

  function onUrlChange(){
    const q=new URLSearchParams(location.search);
    const newProject=q.get("project") in values?q.get("project"):"residential";
    const newTab=TABS.includes(q.get("tab"))?q.get("tab"):"overview";
    if(state.project!==newProject)setProject(newProject,{save:false});
    showTab(newTab,{save:false});
  }
  function reset(){
    state.project="residential";state.brand="gaf";state.filter="all";state.query="";state.evidenceId=null;
    $("inspectionSearch").value="";
    setProject("residential",{save:false});
    showTab("overview",{save:true,scroll:true});
    announce("Demo reset to the fictional residential overview.");
  }
  function bind(){
    nodes("[data-tab]").forEach(button=>{
      button.addEventListener("click",()=>showTab(button.dataset.tab,{save:true}));
      button.addEventListener("keydown",event=>{
        const index=TABS.indexOf(button.dataset.tab);
        let selected;
        if(event.key==="ArrowRight")selected=TABS[(index+1)%TABS.length];
        else if(event.key==="ArrowLeft")selected=TABS[(index-1+TABS.length)%TABS.length];
        else if(event.key==="Home")selected=TABS[0];
        else if(event.key==="End")selected=TABS[TABS.length-1];
        else return;
        event.preventDefault();
        showTab(selected,{save:true,focus:true});
      });
    });
    nodes("[data-project]").forEach(b=>b.addEventListener("click",()=>setProject(b.dataset.project)));
    nodes("[data-brand]").forEach(b=>b.addEventListener("click",()=>{state.brand=b.dataset.brand;renderBrand();}));
    nodes("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
      state.filter=button.dataset.filter;
      nodes("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter===state.filter)));
      renderCheckpoints();
    }));
    $("inspectionSearch").addEventListener("input",event=>{
      state.query=event.target.value.trim();
      renderCheckpoints();
    });
    $("checkpointList").addEventListener("click",event=>{
      const button=event.target.closest("[data-show-evidence]");
      if(button)openEvidence(button.dataset.showEvidence);
    });
    $("scopeList").addEventListener("click",event=>{
      const evidence=event.target.closest("[data-show-evidence]");
      if(evidence)return openEvidence(evidence.dataset.showEvidence);
      const finding=event.target.closest("[data-inspect]");
      if(finding)return selectCheckpoint(Number(finding.dataset.inspect));
    });
    $("evidenceGrid").addEventListener("click",event=>{
      const button=event.target.closest("[data-inspect]");
      if(button)selectCheckpoint(Number(button.dataset.inspect));
    });
    $("clearEvidence").addEventListener("click",()=>{state.evidenceId=null;renderEvidence();});
    nodes("[data-next-tab]").forEach(button=>button.addEventListener("click",()=>
      showTab(button.dataset.nextTab,{save:true,scroll:true})));
    $("startDemo").addEventListener("click",()=>showTab("inspection",{save:true,scroll:true}));
    $("viewSample").addEventListener("click",()=>showTab("estimate",{save:true,scroll:true}));
    $("printDemo").addEventListener("click",printExample);
    $("resetDemo").addEventListener("click",reset);
    $("reviewFollowups").addEventListener("click",()=>{
      state.filter="flag";state.query="";$("inspectionSearch").value="";
      nodes("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter==="flag")));
      renderCheckpoints();
      showTab("inspection",{save:true,scroll:true});
    });
    $("reviewLimits").addEventListener("click",()=>{
      state.filter="limit";state.query="";$("inspectionSearch").value="";
      nodes("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter==="limit")));
      renderCheckpoints();
      showTab("inspection",{save:true,scroll:true});
    });
    window.addEventListener("popstate",onUrlChange);
  }
  function boot(){
    if(!dataset||!$("workspace")){
      const main=document.querySelector("main");
      if(main)main.prepend(make("p","note","The demonstration could not load; refresh this page."));
      return;
    }
    bind();
    setProject(state.project,{save:false});
    renderBrand();
    // IMPORTANT: never call scrollIntoView for the default tab on initial
    // load. Doing so shifts the mobile viewport and causes sticky-header overlap.
    showTab(state.tab,{save:false});
    syncLocation(false);
    announce("SmartInspect public demo ready. This is fictional data only.");
  }
  boot();
})();
