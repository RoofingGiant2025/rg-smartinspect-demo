// Entirely synthetic, public demonstration content.
// No external services, CRM account data, images of real properties, or live estimates.
(function () {
  "use strict";
  const residentialNames = [
    "Shingle surface","Ridge cap condition","Starter course","Eave perimeter","Rake perimeter",
    "Drip-edge metal","Valley intersections","Step flashing","Counterflashing","Chimney transition",
    "Pipe boots","Wall transitions","Skylight flashing","Exposed fasteners","Sealant transitions",
    "Deck observations","Soffit intake","Attic exhaust","Attic moisture","Insulation clearance",
    "Gutter condition","Downspout routing","Fascia condition","Soffit condition","Hail impact indicators",
    "Wind uplift indicators","Nearby tree contact","Prior repairs","Interior water signs","Access and safety"
  ];
  const commercialNames = [
    "TPO field membrane","Heat-welded seams","Seam test locations","Roof perimeter","Termination bars",
    "Edge metal","Parapet coping","Coping joints","Base flashing","Corner patches",
    "Penetration collars","Pipe supports","HVAC curb flashing","Primary roof drains","Drain guards",
    "Ponding indicators","Scupper outlets","Overflow drainage","Walkway protection","Fastener reference",
    "Insulation conditions","Deck observations","Slope and flow","Vegetation/debris","Membrane punctures",
    "Previous patches","Roof access","Safety documentation","Roof maintenance records","Moisture investigation"
  ];
  const residentialGuidance = [
    "Note shingle tab condition, granule distribution, and surface irregularities without inferring their cause.",
    "Check individual caps, fastening exposures, and transitions at hips and ridges.",
    "Identify whether an actual starter course is visible; a sample cannot establish fastening.",
    "Document eave termination, gutter clearance and expected water-shedding direction.",
    "Document rake termination independently from eave details; metal overlap order may differ.",
    "Identify a formed perimeter metal profile, continuity, outward kick and manufacturer-specific sequencing.",
    "Record valley type, metal or membrane configuration, debris and visible water pathways.",
    "Look for roof-to-wall step flashing continuity rather than guessing concealed components.",
    "Note visible counterflashing at wall terminations and mortar or siding transitions.",
    "Record chimney cricket, corner and apron details if present; do not infer concealed work.",
    "Document pipe-boot material, seals, collars and deterioration for each roof penetration.",
    "Record intersecting wall flashing and kick-out transitions, if present.",
    "Examine skylight perimeter and head/sill flashing without attributing nearby stains.",
    "Map any exposed roof fasteners; verify location and whether they are intended.",
    "Record sealant-dependent joints and identify where proper flashing is required.",
    "Deck structure beneath roofing is not visible without safe access or removal.",
    "Check available eave intake area, obstructions and attic air pathways.",
    "Document actual exhaust type; do not combine incompatible ridge and turbine exhaust.",
    "Moisture or concealed deterioration cannot be confirmed without suitable access and methods.",
    "Verify ventilation clearance over insulation and applicable attic barriers.",
    "Observe gutter alignment, condition, debris and drainage rather than predicting performance.",
    "Record downspout presence, routing and discharge away from the building.",
    "Check fascia for visible staining, rot indications or fastener distress.",
    "Look for soffit damage or blocked intake openings.",
    "Map possible impact marks; appearance alone is not proof of a hail event.",
    "Record displaced tabs or uplift indicators and distinguish observed conditions from causation.",
    "Check for direct tree contact, hanging debris and blocked drainage paths.",
    "Locate repairs and note material transitions, without assuming quality or age.",
    "Document the position of sample interior marks and possible alternative causes.",
    "Record safe access limitations, fall hazards and any unchecked roof surfaces."
  ];
  const commercialGuidance = [
    "Document field TPO condition, patches, surfacing and visible distress by grid area.",
    "Identify heat-welded seam pathways and areas needing appropriate seam verification.",
    "Record selected seam test spots; tests in this demo were not performed.",
    "Document all roof edges and perimeter termination conditions.",
    "Look for visible termination bars, securement and appropriate protective covers.",
    "Identify the installed edge-metal configuration and any exposed attachment concerns.",
    "Record parapet coping coverage, movement and visible damage.",
    "Document corner and joint transitions in coping systems.",
    "Observe base-flashing height, securement and field terminations.",
    "Examine corner patches and welded overlaps at direction changes.",
    "Check collars and boots around pipe penetrations for continuity.",
    "Document pipe support movement, clearances and membrane contact.",
    "Inspect accessible HVAC curb flashing and corners; concealed details require review.",
    "Document primary drain condition and membrane-to-drain interfaces.",
    "Record drain guards, debris and accessibility.",
    "Identify ponding indicators; timing and drainage performance require field observation.",
    "Check scupper locations, routing and apron condition.",
    "Document overflow route, height and whether the system can be observed.",
    "Record walkway-pad placement and abrasion risk in traffic zones.",
    "Determine whether attachment details are exposed or require destructive review.",
    "Insulation layers and actual moisture content cannot be inferred from an intact membrane.",
    "Record any accessible deck evidence; avoid assumptions about concealed structure.",
    "Document observed directional slope and low points; this is not a drainage survey.",
    "Locate debris or vegetation that may obstruct roof movement or drains.",
    "Map visible punctures or tears with a referenced roof zone.",
    "Identify patches and membrane transitions without asserting warranty status.",
    "Document ladders, hatches and safe approaches; permit requirements are site specific.",
    "Record rooftop safety controls and unresolved fall-protection concerns.",
    "Review available maintenance records; none are provided in this fictional demo.",
    "No destructive moisture survey or laboratory sampling has been performed."
  ];
  const definitions = {
    residential: {
      title: "Residential roof inspection",
      subtitle: "Fictional Roof A · Dallas–Fort Worth example",
      type: "Architectural asphalt shingles",
      description: "Illustrative checkpoints for visible shingles, perimeter flashing, penetrations, ventilation, and access.",
      names: residentialNames,
      guidance: residentialGuidance,
      areas: ["Roof covering","Roof edges","Roof flashing","Deck & attic","Drainage & soffits","Weather & access"],
      flagged: [5,10,25,28],
      limited: [15,18],
      overrides: {
        5: {area:"East eave", observation:"Sample scenario: the edge-metal termination appears discontinuous at a fictional eave section.", next:"Verify the actual formed drip edge, deck/fascia interface and manufacturer-specific underlayment order.", evidence:["DEMO-PHOTO-003"]},
        10:{area:"Upper roof · penetration zone",observation:"Sample scenario: a pipe-boot collar appears weathered around one penetration.",next:"Confirm penetration size, boot condition and compatible flashing materials before writing a repair scope.",evidence:["DEMO-PHOTO-004","DEMO-PHOTO-005"]},
        25:{area:"Plane A · upper field",observation:"Sample scenario: several shingle tabs appear displaced or lifted.",next:"Document tab position and attachment condition; do not assign wind or insurance causation from an illustration.",evidence:["DEMO-PHOTO-001","DEMO-PHOTO-002"]},
        28:{area:"Fictional interior ceiling",observation:"Sample scenario: a ceiling mark is used to demonstrate a possible water-intrusion investigation.",next:"Determine whether moisture is current and trace its source before associating it with roof work.",evidence:["DEMO-PHOTO-006"]},
        15:{area:"Concealed deck",observation:"The sample deck is inaccessible beneath existing covering.",next:"Qualify safe access or inspect the deck during any separately authorized removal.",evidence:[]},
        18:{area:"Closed attic bay",observation:"No sample moisture reading or visual access to this attic bay is available.",next:"Record the limitation; request a qualified follow-up if relevant.",evidence:[]}
      },
      scope: [
        {title:"Evaluate displaced architectural shingles",quantity:"6 EA",checkpoint:25,source:["DEMO-PHOTO-001","DEMO-PHOTO-002"]},
        {title:"Inspect eave drip-edge configuration",quantity:"19 LF",checkpoint:5,source:["DEMO-PHOTO-003"]},
        {title:"Assess two roof pipe-flashing conditions",quantity:"2 EA",checkpoint:10,source:["DEMO-PHOTO-004","DEMO-PHOTO-005"]},
        {title:"Investigate an illustrative interior ceiling mark",quantity:"1 LOC",checkpoint:28,source:["DEMO-PHOTO-006"]},
        {title:"Document concealed decking as a limitation",quantity:"Review",checkpoint:15,source:[]}
      ],
      estimate: "Residential shingle evaluation · unpriced",
      evidence: [
        ["DEMO-PHOTO-001","Roof plane A","Example view for identifying displaced tabs",25],
        ["DEMO-PHOTO-002","Upper shingle field","Supplementary mock observation angle",25],
        ["DEMO-PHOTO-003","East eave","Illustrative drip-edge observation marker",5],
        ["DEMO-PHOTO-004","Upper roof penetration","Fictional pipe-boot overview",10],
        ["DEMO-PHOTO-005","Upper roof penetration","Fictional close-up reference slot",10],
        ["DEMO-PHOTO-006","Interior","Fictional ceiling-mark reference slot",28]
      ]
    },
    commercial: {
      title: "Commercial roof inspection",
      subtitle: "Fictional Roof B · Dallas–Fort Worth example",
      type: "TPO single-ply low-slope roof",
      description: "Illustrative checks for membrane seams, roof drains, equipment curbs, edge terminations, and safe access.",
      names: commercialNames,
      guidance: commercialGuidance,
      areas: ["Field membrane","Perimeter & parapets","Equipment & penetrations","Drainage systems","Substrates & access","Maintenance & investigation"],
      flagged: [1,12,15,24],
      limited: [20,29],
      overrides: {
        1:{area:"Grid N-2 · field seam",observation:"Sample scenario: a welded TPO seam is flagged for verification, not diagnosed as a failure.",next:"Qualified personnel should follow the selected manufacturer's appropriate seam-test procedure.",evidence:["DEMO-PHOTO-101","DEMO-PHOTO-102"]},
        12:{area:"HVAC curb C-1",observation:"Sample scenario: a curb corner appears to have an irregular termination.",next:"Verify compatible base flashing and curb details before planning remedial work.",evidence:["DEMO-PHOTO-103"]},
        15:{area:"Drainage zone D-1",observation:"Sample scenario: a low point is flagged for follow-up because drainage conditions are uncertain.",next:"Observe after rainfall or under suitable conditions and check drain/scupper routes.",evidence:["DEMO-PHOTO-104"]},
        24:{area:"Field membrane · Grid E-3",observation:"Sample scenario: a small surface opening is mapped as a possible membrane puncture.",next:"Confirm depth and approved patch method for the actual membrane system.",evidence:["DEMO-PHOTO-105","DEMO-PHOTO-106"]},
        20:{area:"Concealed roof insulation",observation:"Insulation beneath the intact membrane cannot be seen in this sample.",next:"Do not assert dry or wet insulation without a suitable authorized investigation.",evidence:[]},
        29:{area:"Inaccessible substrate",observation:"No test cuts, core samples or moisture survey were conducted.",next:"Record a limitation and obtain consent for appropriate testing when warranted.",evidence:[]}
      },
      scope: [
        {title:"Review three illustrative TPO seam locations",quantity:"3 LOC",checkpoint:1,source:["DEMO-PHOTO-101","DEMO-PHOTO-102"]},
        {title:"Assess HVAC curb flashing termination",quantity:"1 CURB",checkpoint:12,source:["DEMO-PHOTO-103"]},
        {title:"Investigate sample roof drainage concern",quantity:"1 LOC",checkpoint:15,source:["DEMO-PHOTO-104"]},
        {title:"Evaluate sample membrane puncture locations",quantity:"2 LOC",checkpoint:24,source:["DEMO-PHOTO-105","DEMO-PHOTO-106"]},
        {title:"Record insulation/moisture access limitations",quantity:"Review",checkpoint:20,source:[]}
      ],
      estimate: "Commercial TPO evaluation · unpriced",
      evidence: [
        ["DEMO-PHOTO-101","Field seam N-2","Fictional seam segment reference slot",1],
        ["DEMO-PHOTO-102","Field seam N-2","Supplementary seam mock reference slot",1],
        ["DEMO-PHOTO-103","Equipment curb C-1","Fictional curb termination reference slot",12],
        ["DEMO-PHOTO-104","Drain D-1","Fictional drainage low-point reference slot",15],
        ["DEMO-PHOTO-105","Membrane E-3","Fictional membrane opening reference slot",24],
        ["DEMO-PHOTO-106","Membrane E-3","Supplementary puncture reference slot",24]
      ]
    }
  };
  for (const [type,p] of Object.entries(definitions)) {
    const prefix=type==="residential"?"R":"C";
    p.checkpoints=p.names.map((name,index)=>{
      const override=p.overrides[index]||{};
      const status=p.flagged.includes(index)?"flag":p.limited.includes(index)?"limit":"ok";
      const group=Math.min(5,Math.floor(index/5));
      return {
        id:prefix+"-"+String(index+1).padStart(2,"0"),index,name,
        status,area:override.area||p.areas[group],
        observation:override.observation||(status==="ok"?
          "Demonstration checkpoint marked reviewed. No property-specific defect is asserted.": 
          "Fictional condition requiring additional investigation."),
        guidance:p.guidance[index],
        next:override.next||"On a real inspection, record current conditions and supporting photographs before closing this item.",
        evidence:override.evidence||[]
      };
    });
    p.counts={ok:p.checkpoints.filter(x=>x.status==="ok").length,
      flag:p.checkpoints.filter(x=>x.status==="flag").length,
      limit:p.checkpoints.filter(x=>x.status==="limit").length};
  }
  window.RGSmartInspectDemo={projects:definitions,manufacturers:{
    gaf:{
      title:"GAF · Timberline HDZ",
      underlay:"Deck-Armor · reference-only field protection",
      starter:"Pro-Start starter strips · selected model pending",
      status:"SOURCE REVIEW PENDING",
      rules:["Manufacturer's current installation guide controls product placement.","Eave and rake drip-edge details must be checked separately.","Ice/water protection is localized; it is not a duplicate full-field layer.","Ridge-vent compatibility and intake/exhaust design need independent review."],
      link:"https://www.gaf.com/"
    },
    owens:{
      title:"Owens Corning · Duration",
      underlay:"ProArmor · reference-only field protection",
      starter:"Starter Strip Plus · example accessory",
      status:"TECHNICAL REVIEW REQUIRED",
      rules:["Verify current Duration installation instructions for the selected edition.","Confirm actual starter-strip and hip/ridge compatibility.","Low-slope roofs require the documented special assembly.","No wind-rating, Class A or warranty eligibility is inferred."],
      link:"https://www.owenscorning.com/en-us/roofing"
    },
    malarkey:{
      title:"Malarkey · Vista AR",
      underlay:"Secure Start Plus · reference-only field protection",
      starter:"Smart Start · example accessory",
      status:"TECHNICAL SIGN-OFF PENDING",
      rules:["Manufacturer's laminate guide distinguishes eave and rake metal.","Smart Start is a perimeter component, not field underlayment.","Special eave protection is a separate localized detail.","Geometry still needs a qualified human construction review."],
      link:"https://www.malarkeyroofing.com/"
    },
    certainteed:{
      title:"CertainTeed · Landmark",
      underlay:"RoofRunner · reference-only field protection",
      starter:"SwiftStart · example accessory",
      status:"INSTALLER GUIDE REVIEW",
      rules:["Confirm the exact current Landmark application guide.","SwiftStart is a distinct starter product.","RoofRunner and localized ice protection must be specified correctly.","The complete system listing and warranty require written evidence."],
      link:"https://www.certainteed.com/"
    }
  }};
})();
