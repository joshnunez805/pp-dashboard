import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE CONFIG ───────────────────────────────────────────────────────────
// Replace these two values with your own from https://supabase.com/dashboard/project/_/settings/api
const SUPABASE_URL  = "https://bfptwccdygdtsrzcrqhj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcHR3Y2NkeWdkdHNyemNycWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzY5MjIsImV4cCI6MjA4ODk1MjkyMn0.Uo2L_oFLBGDrA4V2Ywf-dh__n3Vbt9DqzHUl0T6-6Ro";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── PARTS MASTER ──────────────────────────────────────────────────────────────
const MASTER = [
  {id:"rtb8",      pn:"PP-RTB8@V1",         desc:"RTB-8 Relay Module",         cat:"Relay Modules",   qty:192,onOrder:0, inBuild:480,eta:"Wk Mar 24",p64:12,p128:24,note:"IN BUILD (Megatone+in-house)"},
  {id:"rio16",     pn:"PP-RIO16@V1",         desc:"RIO-16 Relay Module",        cat:"Relay Modules",   qty:76, onOrder:0, inBuild:212,eta:"Wk Mar 24",p64:4, p128:8, note:"IN BUILD"},
  {id:"rab16",     pn:"PP-RAB16@V1",         desc:"RAB-16 Relay Module",        cat:"Relay Modules",   qty:140,onOrder:0, inBuild:0,  eta:"—",p64:2,p128:0,note:"Sufficient"},
  {id:"prmb64",    pn:"PP-PRMB64@V1",        desc:"PRMB64 Motherboard",         cat:"Motherboards",    qty:50, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:0,note:""},
  {id:"prmb128",   pn:"PP-PRMB128@V1",       desc:"PRMB128 Motherboard",        cat:"Motherboards",    qty:11, onOrder:0, inBuild:0,  eta:"—",p64:0,p128:1,note:""},
  {id:"fp",        pn:"PP-FP@V1",            desc:"Front Panel Assembly",       cat:"Sub-Assemblies",  qty:9,  onOrder:0, inBuild:52, eta:"03/11",p64:1,p128:1,note:"ETA 03/11"},
  {id:"eth",       pn:"PP-ETH-1U@V1",        desc:"1U Ethernet Module",         cat:"Sub-Assemblies",  qty:17, onOrder:0, inBuild:44, eta:"Soon",p64:1,p128:1,note:"IN BUILD"},
  {id:"usb",       pn:"PP-USB-1U@V1",        desc:"1U USB Module",              cat:"Sub-Assemblies",  qty:49, onOrder:12,inBuild:0,  eta:"On order",p64:1,p128:1,note:"ON ORDER"},
  {id:"reg12v",    pn:"PP-12VREG@V1",        desc:"12V Regulator",              cat:"Sub-Assemblies",  qty:153,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"IN BUILD 03/09"},
  {id:"reg35v",    pn:"PP-3/5VREG@V1",       desc:"3/5V Regulator",             cat:"Sub-Assemblies",  qty:131,onOrder:0, inBuild:0,  eta:"—",p64:2,p128:2,note:"Sufficient"},
  {id:"ovp",       pn:"PP-OVP@V1",           desc:"Overvolt Protection Module", cat:"Sub-Assemblies",  qty:122,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"fpcbl64",   pn:"PP-FPCBL-64R@V1",     desc:"PP64R FP Cable Assembly",    cat:"Sub-Assemblies",  qty:46, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:0,note:"Short"},
  {id:"fpcbl128",  pn:"PP-FPCBL-128R@V1",    desc:"PP128R FP Cable Assembly",   cat:"Sub-Assemblies",  qty:36, onOrder:0, inBuild:0,  eta:"—",p64:0,p128:1,note:"Sufficient"},
  {id:"chas64bot", pn:"CHAS-PP-64R-BOT@V1",  desc:"PP64R Chassis Bottom",       cat:"Chassis",         qty:21, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:0,note:"Short"},
  {id:"chas128bot",pn:"CHAS-PP-128R-BOT@V1", desc:"PP128R Chassis Bottom",      cat:"Chassis",         qty:33, onOrder:0, inBuild:0,  eta:"—",p64:0,p128:1,note:"Sufficient"},
  {id:"fapnl",     pn:"FAPNL-PP-1U@V1",      desc:"1U Face Panel",              cat:"Chassis",         qty:150,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"pwr",       pn:"PWR-100W-USBC",        desc:"100W USB-C Power Supply",    cat:"Power & Compute", qty:26, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"No ETA"},
  {id:"sbc",       pn:"SBC-RPI-CM4101016",    desc:"RPi CM4 SBC",                cat:"Power & Compute", qty:25, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Long lead"},
  {id:"screw",     pn:"SCWJAK-4U40-4H8.1",   desc:"4-40 4.8mm Jack Screw",      cat:"Hardware",        qty:250,onOrder:0, inBuild:0,  eta:"—",p64:8,p128:8,note:"Critical short"},
  {id:"btry",      pn:"BTRY-CR1220",          desc:"CR1220 Battery",             cat:"Hardware",        qty:20, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Short"},
  {id:"neop",      pn:"PP-NEOP-T3/32-1W",    desc:"Neoprene Strip (ft)",        cat:"Hardware",        qty:50, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Short"},
  {id:"lbkt",      pn:"PP-L-440-BKT",        desc:"4-40 Short-L Bracket",       cat:"Hardware",        qty:100,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"~short"},
  {id:"plugeth",   pn:"PP-PLUG-ETH",          desc:"Eth Dust Plug",              cat:"Hardware",        qty:250,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"btryhldr",  pn:"PP-BTRY-HLDR",        desc:"Battery Holder",             cat:"Hardware",        qty:80, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"hdr2p",     pn:"PP-HDR-2P-PWR",       desc:"2P HDR R/A USB Power",       cat:"Hardware",        qty:120,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"jcab10p",   pn:"JCAB-10P2-150ML.1",   desc:"10P2 150mm Jumper Cable",    cat:"Hardware",        qty:80, onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"jcab4p",    pn:"JCAB-4P-4L25.1",      desc:"4P 4.25in Jumper Cable",     cat:"Hardware",        qty:115,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"litepipe",  pn:"LTPIPE-4D-12L7.1",    desc:"4mm Lite-Pipe",              cat:"Hardware",        qty:999,onOrder:0, inBuild:0,  eta:"Have tons",p64:1,p128:1,note:"Have tons"},
  {id:"pcbfpjak",  pn:"PCB-PP-FP-JAK@V1",    desc:"PCB FP 1/4in Jack Spacer",  cat:"PCBs",            qty:324,onOrder:0, inBuild:0,  eta:"—",p64:2,p128:2,note:"Sufficient"},
  {id:"pcbins",    pn:"PCB-PP-PRMB-INS@V1",  desc:"PRMB Insulator PCB",         cat:"PCBs",            qty:100,onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"Sufficient"},
  {id:"shipkit",   pn:"PP-SHIPKIT-1U@V1",     desc:"Ship-Kit 1U",                cat:"Shipping",        qty:0,  onOrder:0, inBuild:0,  eta:"—",p64:1,p128:1,note:"No ETA"},
  {id:"spcr64rtb", pn:"PP-SPCR-64/128R-RTB", desc:"64/128R RTB Spacer",         cat:"Hardware",        qty:180,onOrder:0, inBuild:0,  eta:"—",p64:2,p128:2,note:"Sufficient"},
];
const INIT_TARGETS={pp64:65,pp128:25};
const INIT_MIX={p64:10,p128:8};
const INIT_WEEKPLAN={};
const DEFAULT_LEAD_WEEKS={
  "Relay Modules":3,"Sub-Assemblies":2,"Motherboards":2,"Chassis":2,"PCBs":2,"Power & Compute":4,"Shipping":3,"Hardware":1,
};

// ── ENGINE ────────────────────────────────────────────────────────────────────
function buildableBoth(parts, mix){
  const p64=mix.p64||10, p128=mix.p128||8, total=p64+p128;
  if(total===0) return {pp64:0,pp128:0,total:0};
  // Binary search for max total units T, split by mix ratio
  let lo=0,hi=10000;
  while(lo<hi){
    const mid=Math.floor((lo+hi+1)/2);
    const n64=Math.floor(mid*p64/total),n128=mid-n64;
    let ok=true;
    for(const p of parts){if(p.p64*n64+p.p128*n128>p.qty){ok=false;break;}}
    if(ok)lo=mid;else hi=mid-1;
  }
  const n64=Math.floor(lo*p64/total),n128=lo-n64;
  return{pp64:n64,pp128:n128,total:lo};
}
function deductParts(parts,n64,n128){
  return parts.map(p=>{const u=p.p64*n64+p.p128*n128;return u?{...p,qty:Math.max(0,p.qty-u)}:p;});
}
function previewDeduct(parts,n64,n128){
  return parts.map(p=>{const u=p.p64*n64+p.p128*n128;if(!u)return null;const after=p.qty-u;return{...p,used:u,after,tight:after<0};}).filter(Boolean);
}
function parseEtaWeek(eta){const n=parseInt(eta);return(!isNaN(n)&&n>=1&&n<=20)?n:null;}
function calcSchedule(parts,mix,remP64,remP128,weekPlan={},startWeek=0){
  let inv=parts.map(p=>({...p}));const rows=[];let cP64=0,cP128=0;
  for(let w=0;w<20;w++){
    for(const p of inv){
      const ew=parseEtaWeek(p.eta);
      if(ew!==null&&w===ew-1){p.qty+=p.inBuild+p.onOrder;p.inBuild=0;p.onOrder=0;}
      else if(ew===null){if(w===2){p.qty+=Math.floor(p.inBuild*0.6);p.inBuild=Math.floor(p.inBuild*0.4);}else if(w===4){p.qty+=p.inBuild+p.onOrder;p.inBuild=0;p.onOrder=0;}}
    }
    const rP64=remP64-cP64,rP128=remP128-cP128;
    if(rP64<=0&&rP128<=0)break;
    const weekNum=startWeek+w+1;
    const wp=weekPlan[weekNum];
    const planP64=wp?.pp64!==undefined?wp.pp64:mix.p64;
    const planP128=wp?.pp128!==undefined?wp.pp128:mix.p128;
    let wP64=Math.min(planP64,Math.max(0,rP64)),wP128=Math.min(planP128,Math.max(0,rP128));
    let canP64=wP64,canP128=wP128;
    for(const p of inv){const need=p.p64*canP64+p.p128*canP128;if(need>p.qty&&need>0){const r=p.qty/need;canP64=Math.floor(canP64*r);canP128=Math.floor(canP128*r);}}
    for(const p of inv){const u=p.p64*canP64+p.p128*canP128;p.qty=Math.max(0,p.qty-u);}
    const blockers=[];
    for(const p of inv){const sn=p.p64*(wP64-canP64)+p.p128*(wP128-canP128);if(sn>0)blockers.push({desc:p.desc,short:sn});}
    cP64+=canP64;cP128+=canP128;
    rows.push({week:w+1,wP64,wP128,canP64,canP128,total:canP64+canP128,cum:cP64+cP128,cP64,cP128,blockers});
    if(cP64>=remP64&&cP128>=remP128)break;
  }
  return rows;
}

// ── UI PRIMITIVES ─────────────────────────────────────────────────────────────
const C={red:"#ef4444",amber:"#f59e0b",green:"#22c55e",blue:"#38bdf8",purple:"#a78bfa",teal:"#2dd4bf",grey:"#64748b"};
const S={
  app:{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#0a0e14",minHeight:"100vh",color:"#e2e8f0"},
  card:{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:8,padding:14,marginBottom:12},
  cT:{fontSize:11,letterSpacing:"0.14em",color:C.grey,textTransform:"uppercase",marginBottom:9,fontWeight:700},
};
const pill=(color,txt)=><span style={{display:"inline-block",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700,background:color+"22",color,border:`1px solid ${color}44`}}>{txt}</span>;
const mbar=(pct,color)=><div style={{background:"#1e2d3d",height:4,borderRadius:2,width:54,overflow:"hidden",marginTop:3}}><div style={{background:color,width:`${Math.min(pct,100)}%`,height:"100%"}}/></div>;
const TH=({ch,right})=><th style={{padding:"7px 9px",textAlign:right?"right":"left",fontSize:10,letterSpacing:"0.1em",color:C.grey,textTransform:"uppercase",borderBottom:"1px solid #1e2d3d",fontWeight:700,whiteSpace:"nowrap",background:"#0a0e14"}}>{ch}</th>;
const TD=({ch,right,s})=><td style={{padding:"6px 9px",borderBottom:"1px solid #0d1117",verticalAlign:"middle",textAlign:right?"right":"left",...s}}>{ch}</td>;

function QC({value,onChange,big}){
  const w=big?26:22,fs=big?15:13,iw=big?60:50;
  return <div style={{display:"flex",alignItems:"center",gap:3}}>
    <button onClick={()=>onChange(Math.max(0,value-1))} style={{background:"#ef444422",border:"1px solid #ef444444",color:C.red,borderRadius:3,width:w,height:w,cursor:"pointer",fontSize:fs,fontWeight:700}}>−</button>
    <input type="number" min="0" value={value} onChange={e=>onChange(Math.max(0,parseInt(e.target.value)||0))}
      style={{background:"#141c2a",border:"1px solid #1e3a5f",borderRadius:3,color:"#e2e8f0",padding:"2px 4px",fontSize:big?14:12,width:iw,textAlign:"center",fontFamily:"inherit",fontWeight:big?700:400}}/>
    <button onClick={()=>onChange(value+1)} style={{background:"#22c55e22",border:"1px solid #22c55e44",color:C.green,borderRadius:3,width:w,height:w,cursor:"pointer",fontSize:fs,fontWeight:700}}>+</button>
  </div>;
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({parts,targets,mix,buildLog}){
  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0);
  const bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const remP64=Math.max(0,targets.pp64-bP64),remP128=Math.max(0,targets.pp128-bP128);
  const tt=targets.pp64+targets.pp128,tb=bP64+bP128,pct=tt>0?Math.round(tb/tt*100):0;
  const sched=useMemo(()=>calcSchedule(parts,mix,remP64,remP128,{},0),[parts,mix,remP64,remP128]);
  const {pp64:nowP64,pp128:nowP128}=useMemo(()=>buildableBoth(parts,mix),[parts,mix]);
  const ew=sched.length>0?sched[sched.length-1].week:(remP64+remP128===0?0:"?");
  const blockers=parts.filter(p=>{const n=p.p64*remP64+p.p128*remP128;return n>0&&p.qty<n;})
    .sort((a,b)=>((b.p64*remP64+b.p128*remP128)-b.qty)-((a.p64*remP64+a.p128*remP128)-a.qty)).slice(0,6);

  return <div>
    <div style={{...S.card,padding:"12px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:11,color:C.grey,letterSpacing:"0.12em",textTransform:"uppercase"}}>Run Progress — {tb} / {tt} units</span>
        <span style={{fontSize:14,fontWeight:700,color:pct===100?C.green:C.amber}}>{pct}%</span>
      </div>
      <div style={{background:"#1e2d3d",height:10,borderRadius:5,overflow:"hidden"}}>
        <div style={{background:`linear-gradient(90deg,${C.teal},${C.green})`,width:`${pct}%`,height:"100%",borderRadius:5,transition:"width 0.5s"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:10}}>
        {[["PP64",bP64,targets.pp64,C.teal],["PP128",bP128,targets.pp128,C.blue]].map(([l,b,t,c])=>(
          <div key={l}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:10,color:C.grey}}>{l}</span>
              <span style={{fontSize:10,fontWeight:700,color:c}}>{b} built · {Math.max(0,t-b)} left</span>
            </div>
            <div style={{background:"#1e2d3d",height:5,borderRadius:3,overflow:"hidden"}}>
              <div style={{background:c,width:`${Math.min(b/t*100,100)}%`,height:"100%",transition:"width 0.5s"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
      {[
        {l:"Units Built",  v:tb,              sub:`PP64: ${bP64} · PP128: ${bP128}`,      color:C.teal, pct},
        {l:"Remaining",    v:remP64+remP128,  sub:`PP64: ${remP64} · PP128: ${remP128}`,  color:C.amber,pct:null},
        {l:"Buildable Now",v:nowP64+nowP128,  sub:`PP64: ${nowP64} · PP128: ${nowP128}`,  color:C.blue, pct:(nowP64+nowP128)/Math.max(remP64+remP128,1)*100},
        {l:"Est. Wks Left",v:remP64+remP128===0?"✓":ew,sub:`at ${mix.p64+mix.p128}/wk`,  color:typeof ew==="number"&&ew<=8?C.green:C.red,pct:null},
      ].map(s=>(
        <div key={s.l} style={{background:"#0d1117",border:`1px solid ${s.color}33`,borderRadius:8,padding:"14px 16px"}}>
          <div style={S.cT}>{s.l}</div>
          <div style={{fontSize:32,fontWeight:700,color:s.color,lineHeight:1}}>{s.v}</div>
          {s.pct!==null&&<div style={{background:"#1e2d3d",height:5,borderRadius:3,margin:"7px 0 4px"}}><div style={{background:s.color,width:`${Math.min(s.pct,100)}%`,height:"100%",borderRadius:3,transition:"width 0.4s"}}/></div>}
          <div style={{fontSize:10,color:C.grey,marginTop:s.pct!==null?0:7}}>{s.sub}</div>
        </div>
      ))}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={S.card}>
        <div style={S.cT}>Remaining Forecast</div>
        {remP64+remP128===0?<div style={{padding:24,textAlign:"center",color:C.green,fontSize:18,fontWeight:700}}>🎉 RUN COMPLETE</div>:
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr><TH ch="WK"/><TH ch="PP128"/><TH ch="PP64"/><TH ch="TOTAL"/><TH ch="CUM"/><TH ch="STATUS"/></tr></thead>
          <tbody>{sched.map((w,i)=>{const ok=w.canP64>=w.wP64&&w.canP128>=w.wP128,par=!ok&&w.total>0,sc=ok?C.green:par?C.amber:C.red;
            return <tr key={i} style={{background:i%2===0?"#0d1117":"#0a0e14"}}>
              <TD ch={<b style={{color:C.amber}}>W{w.week}</b>}/>
              <TD ch={<>{w.canP128}<span style={{color:"#1e2d3d"}}>/{w.wP128}</span></>}/>
              <TD ch={<>{w.canP64}<span style={{color:"#1e2d3d"}}>/{w.wP64}</span></>}/>
              <TD ch={<b style={{color:sc}}>{w.total}</b>}/>
              <TD ch={<span style={{color:C.blue}}>{w.cum}</span>}/>
              <TD ch={pill(sc,ok?"ON TRACK":par?"PARTIAL":"BLOCKED")}/>
            </tr>;
          })}</tbody>
        </table></div>}
      </div>
      <div style={S.card}>
        <div style={S.cT}>Top Blockers — Remaining Run</div>
        {blockers.length===0?<div style={{padding:20,textAlign:"center",color:C.green,fontSize:12}}>✓ No blocking parts</div>:
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr><TH ch="PART"/><TH ch="HAVE" right/><TH ch="NEED" right/><TH ch="GAP" right/><TH ch="ACTION"/></tr></thead>
          <tbody>{blockers.map((p,i)=>{const need=p.p64*remP64+p.p128*remP128,gap=need-p.qty,pip=p.inBuild+p.onOrder;
            return <tr key={p.id} style={{background:i%2===0?"#0d1117":"#0a0e14"}}>
              <TD ch={<><div style={{fontWeight:700}}>{p.desc}</div><div style={{fontSize:10,color:C.grey}}>{p.pn}</div></>}/>
              <TD ch={p.qty} right/><TD ch={need} right/>
              <TD ch={<b style={{color:C.red}}>-{gap}</b>} right/>
              <TD ch={pip>=gap?pill(C.amber,"IN BUILD"):pill(C.red,`ORDER ${gap-pip}`)}/>
            </tr>;
          })}</tbody>
        </table></div>}
      </div>
    </div>

    {buildLog.length>0&&<div style={S.card}>
      <div style={S.cT}>Recent Build Activity</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {[...buildLog].reverse().slice(0,8).map((e)=>(
          <div key={e.id} style={{background:"#141c2a",border:"1px solid #2dd4bf33",borderRadius:6,padding:"10px 14px",minWidth:155}}>
            <div style={{fontSize:10,color:C.grey,marginBottom:4}}>{e.date}{e.weekNum?` · W${e.weekNum}`:""}</div>
            <div style={{display:"flex",gap:10,fontWeight:700}}>
              {e.pp64>0&&<span style={{color:C.teal}}>{e.pp64} PP64</span>}
              {e.pp128>0&&<span style={{color:C.blue}}>{e.pp128} PP128</span>}
            </div>
            {e.note&&<div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>{e.note}</div>}
          </div>
        ))}
      </div>
    </div>}
  </div>;
}

// ── PRODUCTION ────────────────────────────────────────────────────────────────
function Production({parts,setParts,targets,setTargets,mix,setMix,buildLog,setBuildLog,weekPlan,setWeekPlan,saveAll}){
  const [iP64,setIP64]=useState(0),[iP128,setIP128]=useState(0);
  const [iDate,setIDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [iWeekNum,setIWeekNum]=useState(1);
  const [iNote,setINote]=useState("");
  const [showPrev,setShowPrev]=useState(false),[confirmed,setConfirmed]=useState(false);
  const [saving,setSaving]=useState(false);

  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0),bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const remP64=Math.max(0,targets.pp64-bP64),remP128=Math.max(0,targets.pp128-bP128);
  const maxActualWeek=buildLog.length>0?Math.max(...buildLog.map(e=>e.weekNum||1)):0;

  const actualByWeek=useMemo(()=>{
    const m={};
    for(const e of buildLog){const wn=e.weekNum||1;if(!m[wn])m[wn]={pp64:0,pp128:0,notes:[],dates:[]};m[wn].pp64+=e.pp64;m[wn].pp128+=e.pp128;if(e.note)m[wn].notes.push(e.note);if(e.date)m[wn].dates.push(e.date);}
    return m;
  },[buildLog]);

  const projSched=useMemo(()=>calcSchedule(parts,mix,remP64,remP128,weekPlan,maxActualWeek),[parts,mix,remP64,remP128,weekPlan,maxActualWeek]);
  const preview=useMemo(()=>previewDeduct(parts,iP64,iP128),[parts,iP64,iP128]);
  const conflict=preview.some(p=>p.tight);
  const total=iP64+iP128;

  let runCumP64=0,runCumP128=0;
  const actualRows=[];
  const sortedActualWeeks=[...new Set(buildLog.map(e=>e.weekNum||1))].sort((a,b)=>a-b);
  for(const wn of sortedActualWeeks){
    const a=actualByWeek[wn]||{pp64:0,pp128:0};
    runCumP64+=a.pp64;runCumP128+=a.pp128;
    actualRows.push({weekNum:wn,pp64:a.pp64,pp128:a.pp128,cumP64:runCumP64,cumP128:runCumP128,
      notes:(actualByWeek[wn]?.notes||[]).join("; "),dates:(actualByWeek[wn]?.dates||[])});
  }

  async function commit(){
    if(!total||saving)return;
    setSaving(true);
    const newParts=deductParts(parts,iP64,iP128);
    const entry={id:Date.now(),date:iDate,weekNum:iWeekNum,pp64:iP64,pp128:iP128,note:iNote};
    const newLog=[...buildLog,entry];
    setParts(newParts);
    setBuildLog(newLog);
    await saveAll(newParts,targets,mix,newLog,weekPlan);
    setIP64(0);setIP128(0);setINote("");setConfirmed(false);setShowPrev(false);
    setSaving(false);
  }

  async function undoLast(){
    if(!buildLog.length||!window.confirm("Undo last build? Parts will be restored."))return;
    const last=buildLog[buildLog.length-1];
    const newParts=parts.map(p=>{const r=p.p64*last.pp64+p.p128*last.pp128;return r?{...p,qty:p.qty+r}:p;});
    const newLog=buildLog.slice(0,-1);
    setParts(newParts);setBuildLog(newLog);
    await saveAll(newParts,targets,mix,newLog,weekPlan);
  }

  const inS={background:"#141c2a",border:"1px solid #1e3a5f",borderRadius:4,color:"#e2e8f0",padding:"6px 9px",fontSize:12,fontFamily:"inherit",width:"100%"};
  const btn=(c)=>({background:c+"22",border:`1px solid ${c}44`,color:c,borderRadius:4,padding:"7px 13px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700,letterSpacing:"0.08em"});

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <div style={{...S.card,border:"1px solid #2dd4bf55",background:"#080f0f"}}>
        <div style={{...S.cT,color:C.teal}}>✅ Log Completed Build</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C.grey,marginBottom:5,letterSpacing:"0.1em"}}>WHICH WEEK?</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[1,2,3,4,5,6,7,8].map(wn=>(
              <button key={wn} onClick={()=>setIWeekNum(wn)}
                style={{background:iWeekNum===wn?"#2dd4bf22":"#141c2a",border:`1px solid ${iWeekNum===wn?"#2dd4bf":"#1e3a5f"}`,
                  color:iWeekNum===wn?C.teal:C.grey,borderRadius:4,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                W{wn}{actualByWeek[wn]?" ✓":""}
              </button>
            ))}
          </div>
          {actualByWeek[iWeekNum]&&<div style={{fontSize:10,color:C.amber,marginTop:5}}>
            W{iWeekNum} already has {actualByWeek[iWeekNum].pp64} PP64 + {actualByWeek[iWeekNum].pp128} PP128 — this will add to it
          </div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[["PP64 BUILT",iP64,setIP64],["PP128 BUILT",iP128,setIP128]].map(([l,v,set])=>(
            <div key={l}><div style={{fontSize:10,color:C.grey,marginBottom:6,letterSpacing:"0.1em"}}>{l}</div><QC value={v} onChange={set} big/></div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:9}}>
          <div><div style={{fontSize:10,color:C.grey,marginBottom:3}}>DATE</div><input type="date" value={iDate} onChange={e=>setIDate(e.target.value)} style={inS}/></div>
          <div><div style={{fontSize:10,color:C.grey,marginBottom:3}}>NOTE (optional)</div><input placeholder="e.g. RTB8 batch in" value={iNote} onChange={e=>setINote(e.target.value)} style={inS}/></div>
        </div>
        {total>0&&<div style={{padding:"8px 11px",background:"#141c2a",borderRadius:5,marginBottom:10,border:`1px solid ${conflict?"#ef444433":"#2dd4bf33"}`}}>
          <div style={{fontSize:11,fontWeight:700,color:conflict?C.red:C.teal}}>
            {conflict?"⚠ Not enough stock":`✓ W${iWeekNum}: ${iP64>0?iP64+" PP64":""}${iP64>0&&iP128>0?" + ":""}${iP128>0?iP128+" PP128":""} = ${total} units`}
          </div>
          {conflict&&<div style={{fontSize:10,color:C.red,marginTop:3}}>{preview.filter(p=>p.tight).map(p=>`${p.desc}: have ${p.qty}, need ${p.used}`).join(" · ")}</div>}
        </div>}
        <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
          <button onClick={()=>setShowPrev(x=>!x)} disabled={!total} style={{...btn(C.blue),opacity:total?1:0.4}}>{showPrev?"HIDE":"PREVIEW PARTS"}</button>
          {!confirmed
            ?<button onClick={()=>setConfirmed(true)} disabled={!total||conflict} style={{...btn(C.teal),opacity:total&&!conflict?1:0.4}}>COMMIT BUILD</button>
            :<><button onClick={commit} disabled={saving} style={btn(C.green)}>{saving?"SAVING...":"✓ CONFIRM & DEDUCT"}</button>
              <button onClick={()=>setConfirmed(false)} style={btn(C.grey)}>CANCEL</button></>
          }
          {buildLog.length>0&&<button onClick={undoLast} style={{...btn(C.amber),marginLeft:"auto"}}>UNDO LAST</button>}
        </div>
        {showPrev&&total>0&&<div style={{marginTop:11,maxHeight:190,overflowY:"auto"}}>
          <div style={{fontSize:10,color:C.grey,marginBottom:5,letterSpacing:"0.1em"}}>PARTS TO BE CONSUMED</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr><TH ch="Part"/><TH ch="Uses" right/><TH ch="Stock" right/><TH ch="After" right/></tr></thead>
            <tbody>{preview.map((p,i)=>(
              <tr key={p.id} style={{background:p.tight?"#1a0808":i%2===0?"#0d1117":"#0a0e14"}}>
                <TD ch={p.desc}/><TD ch={<span style={{color:C.amber}}>-{p.used}</span>} right/>
                <TD ch={p.qty} right/><TD ch={<b style={{color:p.tight?C.red:C.green}}>{p.after}</b>} right/>
              </tr>
            ))}</tbody>
          </table>
        </div>}
      </div>

      <div>
        <div style={S.card}>
          <div style={S.cT}>Run Targets</div>
          <div style={{display:"flex",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
            {[["PP64","pp64",bP64],["PP128","pp128",bP128]].map(([l,k,b])=>(
              <div key={k}>
                <div style={{fontSize:10,color:C.grey,marginBottom:5}}>{l} TARGET</div>
                <QC value={targets[k]} onChange={async v=>{const t={...targets,[k]:v};setTargets(t);await saveAll(parts,t,mix,buildLog,weekPlan);}}/>
                <div style={{fontSize:10,marginTop:5}}><span style={{color:C.teal}}>Built: {b}</span><span style={{color:C.grey}}> · Left: {Math.max(0,targets[k]-b)}</span></div>
              </div>
            ))}
            <div style={{padding:"10px 14px",background:"#141c2a",borderRadius:6}}>
              <div style={{fontSize:10,color:C.grey}}>TOTAL</div>
              <div style={{fontSize:26,fontWeight:700,color:C.amber}}>{targets.pp64+targets.pp128}</div>
              <div style={{fontSize:10,color:C.teal}}>{bP64+bP128} built</div>
            </div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cT}>Weekly Mix Target</div>
          <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
            {[["PP64 / WK","p64"],["PP128 / WK","p128"]].map(([l,k])=>(
              <div key={k}>
                <div style={{fontSize:10,color:C.grey,marginBottom:5}}>{l}</div>
                <QC value={mix[k]} onChange={async v=>{const m={...mix,[k]:v};setMix(m);await saveAll(parts,targets,m,buildLog,weekPlan);}}/>
              </div>
            ))}
            <div style={{padding:"10px 14px",background:"#141c2a",borderRadius:6}}>
              <div style={{fontSize:10,color:C.grey}}>PER WEEK</div>
              <div style={{fontSize:26,fontWeight:700,color:(mix.p64+mix.p128)>=15?C.green:C.amber}}>{mix.p64+mix.p128}</div>
            </div>
          </div>
          <div style={{fontSize:10,color:C.grey,marginTop:8}}>↑ Default plan used for any week without a custom plan below</div>
        </div>
        <div style={{...S.card,border:"1px solid #a78bfa33",background:"#0a0810"}}>
          <div style={{...S.cT,color:C.purple}}>📅 Per-Week Build Plan</div>
          <div style={{fontSize:10,color:C.grey,marginBottom:10}}>Override the default mix for specific weeks. Blank = use default.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[1,2,3,4,5,6,7,8].map(wn=>{
              const wp=weekPlan[wn]||{};
              const hasCustom=wp.pp64!==undefined||wp.pp128!==undefined;
              const actual=actualByWeek[wn];
              return <div key={wn} style={{background:hasCustom?"#140d1a":"#0d1117",border:`1px solid ${hasCustom?"#a78bfa44":"#1e2d3d"}`,borderRadius:6,padding:"9px 10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <b style={{color:hasCustom?C.purple:C.grey,fontSize:12}}>W{wn}</b>
                  {actual&&<span style={{fontSize:9,color:C.teal}}>✓ {actual.pp64+actual.pp128} built</span>}
                  {hasCustom&&<button onClick={async()=>{const nw={...weekPlan};delete nw[wn];setWeekPlan(nw);await saveAll(parts,targets,mix,buildLog,nw);}} style={{background:"transparent",border:"none",color:C.grey,cursor:"pointer",fontSize:10,padding:"0 2px"}}>✕</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  {[["64",wp.pp64,"pp64"],["128",wp.pp128,"pp128"]].map(([l,v,k])=>(
                    <div key={k}>
                      <div style={{fontSize:9,color:C.grey,marginBottom:2}}>PP{l}</div>
                      <input type="number" min="0" placeholder={String(mix[k==="pp64"?"p64":"p128"])}
                        value={v??""} onChange={async e=>{
                          const nv=e.target.value===""?undefined:Math.max(0,parseInt(e.target.value)||0);
                          const nwp={...weekPlan,[wn]:{...(weekPlan[wn]||{}),pp64:k==="pp64"?nv:(weekPlan[wn]?.pp64),pp128:k==="pp128"?nv:(weekPlan[wn]?.pp128)}};
                          if(nwp[wn].pp64===undefined&&nwp[wn].pp128===undefined)delete nwp[wn];
                          setWeekPlan(nwp);await saveAll(parts,targets,mix,buildLog,nwp);
                        }}
                        style={{width:"100%",background:"#141c2a",border:`1px solid ${v!==undefined?"#a78bfa44":"#1e2d3d"}`,borderRadius:3,color:v!==undefined?C.purple:"#94a3b8",padding:"3px 4px",fontSize:11,fontFamily:"inherit",textAlign:"center"}}/>
                    </div>
                  ))}
                </div>
                {hasCustom&&<div style={{fontSize:9,color:C.purple,marginTop:4,textAlign:"center"}}>Plan: {wp.pp64??mix.p64}+{wp.pp128??mix.p128}={(wp.pp64??mix.p64)+(wp.pp128??mix.p128)}</div>}
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>

    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={S.cT}>Week-by-Week — Actual vs Plan</div>
        <div style={{display:"flex",gap:14,fontSize:10,color:C.grey}}>
          <span><span style={{color:C.teal}}>■</span> ACTUAL</span>
          <span><span style={{color:"#1e3a5f"}}>■</span> PROJECTION</span>
        </div>
      </div>
      {remP64+remP128===0&&actualRows.length===0
        ?<div style={{padding:24,textAlign:"center",color:C.green,fontSize:16,fontWeight:700}}>🎉 ALL UNITS BUILT</div>
        :<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>
            <TH ch="WK"/><TH ch="TYPE"/>
            <TH ch="PP64 PLAN" right/><TH ch="PP64 ACTUAL" right/>
            <TH ch="PP128 PLAN" right/><TH ch="PP128 ACTUAL" right/>
            <TH ch="WEEK TOTAL" right/><TH ch="CUM BUILT" right/>
            <TH ch="STATUS"/><TH ch="NOTES / BLOCKERS"/>
          </tr></thead>
          <tbody>
            {actualRows.map(row=>{
              const wp=weekPlan[row.weekNum];
              const planP64=wp?.pp64!==undefined?wp.pp64:mix.p64;
              const planP128=wp?.pp128!==undefined?wp.pp128:mix.p128;
              const wkTotal=row.pp64+row.pp128;
              const hitPlan=row.pp64>=planP64&&row.pp128>=planP128,partial=!hitPlan&&wkTotal>0;
              const sc=hitPlan?C.green:partial?C.amber:C.red;
              return <tr key={"a"+row.weekNum} style={{background:"#091209",borderLeft:`3px solid ${C.teal}`}}>
                <TD ch={<b style={{color:C.teal}}>W{row.weekNum}</b>}/>
                <TD ch={<span style={{fontSize:10,background:C.teal+"22",color:C.teal,padding:"2px 7px",borderRadius:10,fontWeight:700}}>ACTUAL</span>}/>
                <TD ch={<span style={{color:"#64748b"}}>{planP64}</span>} right/>
                <TD ch={<b style={{color:row.pp64>=planP64?C.green:row.pp64>0?C.amber:C.grey,fontSize:14}}>{row.pp64}</b>} right/>
                <TD ch={<span style={{color:"#64748b"}}>{planP128}</span>} right/>
                <TD ch={<b style={{color:row.pp128>=planP128?C.green:row.pp128>0?C.amber:C.grey,fontSize:14}}>{row.pp128}</b>} right/>
                <TD ch={<b style={{color:sc,fontSize:15}}>{wkTotal}</b>} right/>
                <TD ch={<span style={{color:C.teal,fontWeight:700}}>{row.cumP64+row.cumP128}</span>} right/>
                <TD ch={pill(sc,hitPlan?"ON PLAN":partial?"PARTIAL":"SHORT")}/>
                <TD ch={<div style={{fontSize:10}}>
                  {row.dates.length>0&&<div style={{color:C.grey,marginBottom:2}}>{[...new Set(row.dates)].join(", ")}</div>}
                  {row.notes&&<div style={{color:"#94a3b8"}}>{row.notes}</div>}
                </div>}/>
              </tr>;
            })}
            {projSched.map((w,i)=>{
              const weekNum=maxActualWeek+i+1,cumSoFar=bP64+bP128;
              const ok=w.canP64>=w.wP64&&w.canP128>=w.wP128,par=!ok&&w.total>0,sc=ok?C.green:par?C.amber:C.red;
              return <tr key={"p"+weekNum} style={{background:i%2===0?"#0d1117":"#0a0e14",borderLeft:"3px solid #1e2d3d",opacity:0.85}}>
                <TD ch={<b style={{color:C.amber}}>W{weekNum}</b>}/>
                <TD ch={<span style={{fontSize:10,background:"#1e2d3d",color:C.grey,padding:"2px 7px",borderRadius:10,fontWeight:700}}>PROJ</span>}/>
                <TD ch={<span style={{color:"#94a3b8"}}>{w.wP64}</span>} right/>
                <TD ch={<span style={{color:"#64748b"}}>—</span>} right/>
                <TD ch={<span style={{color:"#94a3b8"}}>{w.wP128}</span>} right/>
                <TD ch={<span style={{color:"#64748b"}}>—</span>} right/>
                <TD ch={<b style={{color:sc}}>{w.total}</b>} right/>
                <TD ch={<span style={{color:C.blue}}>{cumSoFar+w.cum}</span>} right/>
                <TD ch={pill(sc,ok?"ON TRACK":par?"PARTIAL":"BLOCKED")}/>
                <TD ch={<div style={{fontSize:10,color:C.red}}>
                  {w.blockers.slice(0,2).map((b,j)=><div key={j}>✕ {b.desc} (−{b.short})</div>)}
                  {w.blockers.length>2&&<div style={{color:C.grey}}>+{w.blockers.length-2} more</div>}
                </div>}/>
              </tr>;
            })}
          </tbody>
          {(bP64+bP128)>0&&<tfoot><tr style={{background:"#141c2a"}}>
            <TD ch={<b style={{color:C.amber}}>BUILT</b>} s={{colSpan:2}}/>
            <TD ch="" right/><TD ch={<b style={{color:C.teal,fontSize:14}}>{bP64}</b>} right/>
            <TD ch="" right/><TD ch={<b style={{color:C.blue,fontSize:14}}>{bP128}</b>} right/>
            <TD ch={<b style={{color:C.green,fontSize:15}}>{bP64+bP128}</b>} right/>
            <TD ch={<b style={{color:C.green}}>{bP64+bP128}/{targets.pp64+targets.pp128}</b>} right/>
            <TD ch={pill(bP64+bP128>=targets.pp64+targets.pp128?C.green:C.amber,`${Math.round((bP64+bP128)/(targets.pp64+targets.pp128)*100)}% done`)}/>
            <TD ch=""/>
          </tr></tfoot>}
        </table></div>
      }
    </div>
  </div>;
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
function Inventory({parts,setParts,targets,buildLog,saveAll,mix,weekPlan}){
  const [fc,setFc]=useState("ALL"),[s,setS]=useState("");
  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0),bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const remP64=Math.max(0,targets.pp64-bP64),remP128=Math.max(0,targets.pp128-bP128);
  const cats=["ALL",...new Set(parts.map(p=>p.cat))];
  const upd=async(id,f,v)=>{const np=parts.map(p=>p.id===id?{...p,[f]:v}:p);setParts(np);await saveAll(np,targets,mix,buildLog,weekPlan);};
  const vis=parts.filter(p=>(fc==="ALL"||p.cat===fc)&&(!s||p.pn.toLowerCase().includes(s.toLowerCase())||p.desc.toLowerCase().includes(s.toLowerCase())));
  const co=v=>v>=100?C.green:v>=50?C.amber:C.red;
  return <div>
    <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <input placeholder="Search..." value={s} onChange={e=>setS(e.target.value)}
        style={{background:"#141c2a",border:"1px solid #1e3a5f",borderRadius:4,color:"#e2e8f0",padding:"6px 10px",fontSize:12,width:200,fontFamily:"inherit"}}/>
      {cats.map(c=><button key={c} onClick={()=>setFc(c)}
        style={{background:fc===c?"#f59e0b22":"#0d1117",border:`1px solid ${fc===c?"#f59e0b44":"#1e2d3d"}`,
          color:fc===c?C.amber:C.grey,borderRadius:4,padding:"5px 10px",fontSize:10,cursor:"pointer",
          fontFamily:"inherit",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>{c}</button>)}
    </div>
    <div style={S.card}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr>
        <TH ch="Part #"/><TH ch="Description"/>
        <TH ch="On Hand"/><TH ch="In Build"/><TH ch="On Order"/><TH ch="ETA"/>
        <TH ch="Need 64" right/><TH ch="Need 128" right/><TH ch="Cov 64"/><TH ch="Cov 128"/><TH ch="Notes"/>
      </tr></thead>
      <tbody>{vis.map((p,i)=>{
        const n64=p.p64*remP64,n128=p.p128*remP128,eff=p.qty+p.inBuild+p.onOrder;
        const c64=n64?Math.min(100,Math.round(eff/n64*100)):null,c128=n128?Math.min(100,Math.round(eff/n128*100)):null;
        const short=(n64&&eff<n64)||(n128&&eff<n128);
        return <tr key={p.id} style={{background:short?"#150d0d":i%2===0?"#0d1117":"#0a0e14"}}>
          <TD ch={<span style={{fontSize:10,color:C.grey,whiteSpace:"nowrap"}}>{p.pn}</span>}/>
          <TD ch={<b style={{whiteSpace:"nowrap"}}>{p.desc}</b>}/>
          <TD ch={<QC value={p.qty}     onChange={v=>upd(p.id,"qty",v)}/>}/>
          <TD ch={<QC value={p.inBuild} onChange={v=>upd(p.id,"inBuild",v)}/>}/>
          <TD ch={<QC value={p.onOrder} onChange={v=>upd(p.id,"onOrder",v)}/>}/>
          <TD ch={<input value={p.eta} onChange={e=>upd(p.id,"eta",e.target.value)}
            style={{background:"#141c2a",border:"1px solid #1e3a5f",borderRadius:3,color:C.amber,padding:"2px 5px",fontSize:11,width:90,fontFamily:"inherit"}}/>}/>
          <TD ch={n64||"—"} right/><TD ch={n128||"—"} right/>
          <TD ch={c64!==null?<div><div style={{fontWeight:700,color:co(c64)}}>{c64}%</div>{mbar(c64,co(c64))}</div>:<span style={{color:"#1e2d3d"}}>—</span>}/>
          <TD ch={c128!==null?<div><div style={{fontWeight:700,color:co(c128)}}>{c128}%</div>{mbar(c128,co(c128))}</div>:<span style={{color:"#1e2d3d"}}>—</span>}/>
          <TD ch={<input value={p.note} onChange={e=>upd(p.id,"note",e.target.value)}
            style={{background:"transparent",border:"1px solid #1e2d3d",borderRadius:3,color:"#94a3b8",padding:"2px 5px",fontSize:10,width:115,fontFamily:"inherit"}}/>}/>
        </tr>;
      })}</tbody>
    </table></div></div>
  </div>;
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
function Orders({parts,targets,buildLog}){
  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0),bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const remP64=Math.max(0,targets.pp64-bP64),remP128=Math.max(0,targets.pp128-bP128);
  const items=parts.map(p=>{const needed=p.p64*remP64+p.p128*remP128;if(!needed)return null;const eff=p.qty+p.inBuild+p.onOrder;return{...p,needed,eff,short:needed-eff,shortNow:needed-p.qty};}).filter(Boolean);
  const urgent=items.filter(p=>p.short>0&&!p.inBuild&&!p.onOrder).sort((a,b)=>b.short-a.short);
  const inflight=items.filter(p=>p.short>0&&(p.inBuild||p.onOrder)).sort((a,b)=>b.short-a.short);
  const ok=items.filter(p=>p.short<=0);
  return <div>
    {urgent.length>0&&<div style={{...S.card,borderColor:"#ef444444",background:"#120a0a"}}>
      <div style={{...S.cT,color:C.red}}>🚨 ORDER / BUILD NOW ({urgent.length} items)</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr><TH ch="Part"/><TH ch="PN"/><TH ch="Have" right/><TH ch="Need" right/><TH ch="Short" right/><TH ch="Rec. Qty" right/><TH ch="Action"/></tr></thead>
        <tbody>{urgent.map((p,i)=><tr key={p.id} style={{background:i%2===0?"#150d0d":"#120a0a"}}>
          <TD ch={<b>{p.desc}</b>}/><TD ch={<span style={{fontSize:10,color:C.grey}}>{p.pn}</span>}/>
          <TD ch={p.qty} right/><TD ch={p.needed} right/>
          <TD ch={<b style={{color:C.red}}>-{p.shortNow}</b>} right/>
          <TD ch={<b style={{color:C.amber}}>{Math.ceil(p.shortNow*1.1)}</b>} right/>
          <TD ch={pill(C.red,"ORDER NOW")}/>
        </tr>)}</tbody>
      </table></div>
    </div>}
    {inflight.length>0&&<div style={{...S.card,borderColor:"#f59e0b44"}}>
      <div style={{...S.cT,color:C.amber}}>🔧 In Build / On Order — Confirm ETAs ({inflight.length} items)</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr><TH ch="Part"/><TH ch="Have" right/><TH ch="In Build" right/><TH ch="On Order" right/><TH ch="Pipeline" right/><TH ch="Still Short" right/><TH ch="ETA"/><TH ch="Status"/></tr></thead>
        <tbody>{inflight.map((p,i)=><tr key={p.id} style={{background:i%2===0?"#0d1117":"#0a0e14"}}>
          <TD ch={<><b>{p.desc}</b> <span style={{fontSize:10,color:C.grey}}>{p.pn}</span></>}/>
          <TD ch={p.qty} right/><TD ch={<span style={{color:C.blue}}>{p.inBuild}</span>} right/>
          <TD ch={<span style={{color:C.purple}}>{p.onOrder}</span>} right/>
          <TD ch={<b>{p.eff}</b>} right/>
          <TD ch={<b style={{color:p.short<=0?C.green:C.red}}>{p.short>0?`-${p.short}`:"✓"}</b>} right/>
          <TD ch={<span style={{color:C.amber,fontSize:11}}>{p.eta}</span>}/>
          <TD ch={pill(p.short>0?C.amber:C.green,p.short>0?"CONFIRM ETA":"COVERED")}/>
        </tr>)}</tbody>
      </table></div>
    </div>}
    <div style={S.card}>
      <div style={{...S.cT,color:C.green}}>✅ Sufficient ({ok.length} items)</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {ok.map(p=><div key={p.id} style={{background:"#0a1a0a",border:"1px solid #22c55e22",borderRadius:4,padding:"4px 10px",fontSize:10}}>
          <span style={{color:C.green}}>✓</span> <span style={{color:"#94a3b8"}}>{p.desc}</span> <span style={{color:C.green}}>{p.qty}/{p.needed}</span>
        </div>)}
      </div>
    </div>
  </div>;
}

// ── FORECAST ──────────────────────────────────────────────────────────────────
function Forecast({parts,targets,mix,buildLog,weekPlan,leadWeeks,setLeadWeeks,saveAll,allState}){
  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0),bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const remP64=Math.max(0,targets.pp64-bP64),remP128=Math.max(0,targets.pp128-bP128);
  const maxActualWeek=buildLog.length>0?Math.max(...buildLog.map(e=>e.weekNum||1)):0;

  const forecasts=useMemo(()=>{
    if(remP64+remP128===0)return[];
    let inv=parts.map(p=>({...p}));
    const runoutWeek={};
    for(let w=0;w<20;w++){
      const weekNum=maxActualWeek+w+1;
      for(const p of inv){
        const ew=parseEtaWeek(p.eta);
        if(ew!==null&&w===ew-1){p.qty+=p.inBuild+p.onOrder;p.inBuild=0;p.onOrder=0;}
        else if(ew===null){if(w===2){p.qty+=Math.floor(p.inBuild*0.6);p.inBuild=Math.floor(p.inBuild*0.4);}
          else if(w===4){p.qty+=p.inBuild+p.onOrder;p.inBuild=0;p.onOrder=0;}}
      }
      const plan=weekPlan[weekNum]||{pp64:mix.p64,pp128:mix.p128};
      const wP64=Math.min(plan.pp64,Math.max(0,remP64)),wP128=Math.min(plan.pp128,Math.max(0,remP128));
      for(const p of inv){
        if(runoutWeek[p.id]!==undefined)continue;
        const need=p.p64*wP64+p.p128*wP128;
        if(need>0&&p.qty<need&&!p.inBuild&&!p.onOrder) runoutWeek[p.id]=weekNum;
      }
      for(const p of inv){p.qty=Math.max(0,p.qty-(p.p64*wP64+p.p128*wP128));}
    }
    const rows=[];
    for(const p of parts){
      const cats=["Relay Modules","Sub-Assemblies","Motherboards","Chassis","PCBs","Power & Compute","Shipping"];
      if(!cats.includes(p.cat))continue;
      const needed=p.p64*remP64+p.p128*remP128;
      if(!needed)continue;
      const eff=p.qty+p.inBuild+p.onOrder;
      const lead=leadWeeks[p.cat]||2;
      const ro=runoutWeek[p.id];
      const startBy=ro?ro-lead:null;
      const weeksLeft=ro?ro-maxActualWeek:null;
      const hasPipeline=p.inBuild>0||p.onOrder>0;
      let urgency="ok";
      if(eff<needed&&!hasPipeline)urgency="critical";
      else if(startBy!==null&&startBy<=maxActualWeek+1&&!hasPipeline)urgency="urgent";
      else if(startBy!==null&&startBy<=maxActualWeek+2&&!hasPipeline)urgency="warn";
      else if(hasPipeline&&eff<needed)urgency="inflight";
      else if(eff>=needed)urgency="ok";
      rows.push({...p,needed,eff,lead,ro,startBy,weeksLeft,urgency,gap:needed-eff,hasPipeline});
    }
    return rows.sort((a,b)=>{
      const o={critical:0,urgent:1,warn:2,inflight:3,ok:4};
      return (o[a.urgency]??5)-(o[b.urgency]??5);
    });
  },[parts,mix,buildLog,weekPlan,remP64,remP128,maxActualWeek]);

  const critical=forecasts.filter(f=>f.urgency==="critical");
  const urgent=forecasts.filter(f=>f.urgency==="urgent");
  const warn=forecasts.filter(f=>f.urgency==="warn");
  const inflight=forecasts.filter(f=>f.urgency==="inflight");
  const ok=forecasts.filter(f=>f.urgency==="ok");

  const FRow=({f,bg})=>{
    const sc=f.urgency==="critical"?C.red:f.urgency==="urgent"?C.red:f.urgency==="warn"?C.amber:f.urgency==="inflight"?C.blue:C.green;
    return <tr style={{background:bg}}>
      <TD ch={<><b>{f.desc}</b><div style={{fontSize:10,color:C.grey}}>{f.pn}</div></>}/>
      <TD ch={<span style={{color:C.grey,fontSize:10}}>{f.cat}</span>}/>
      <TD ch={f.qty} right/>
      <TD ch={<span style={{color:f.hasPipeline?C.blue:C.grey}}>{f.inBuild||"—"}</span>} right/>
      <TD ch={f.needed} right/>
      <TD ch={<b style={{color:f.gap>0?C.red:C.green}}>{f.gap>0?`-${f.gap}`:"✓"}</b>} right/>
      <TD ch={<span style={{color:C.amber,fontSize:11}}>{f.lead}w</span>} right/>
      <TD ch={f.startBy?<b style={{color:sc}}>W{f.startBy}</b>:<span style={{color:C.grey}}>—</span>}/>
      <TD ch={f.ro?<span style={{color:C.grey}}>W{f.ro}</span>:<span style={{color:C.green}}>✓ OK</span>}/>
      <TD ch={
        f.urgency==="critical"?pill(C.red,"🚨 ORDER NOW"):
        f.urgency==="urgent"?pill(C.red,"⚠ START BUILD"):
        f.urgency==="warn"?pill(C.amber,"📅 PLAN SOON"):
        f.urgency==="inflight"?pill(C.blue,"🔧 IN PIPELINE"):
        pill(C.green,"✓ COVERED")
      }/>
    </tr>;
  };

  return <div>
    {critical.length>0&&<div style={{background:"#1a0808",border:"1px solid #ef444466",borderRadius:8,padding:"12px 16px",marginBottom:10}}>
      <div style={{fontWeight:700,color:C.red,fontSize:12,marginBottom:6}}>🚨 CRITICAL — {critical.length} sub-component{critical.length>1?"s":""} blocking production NOW</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{critical.map(f=><div key={f.id} style={{background:"#ef444418",border:"1px solid #ef444433",borderRadius:4,padding:"5px 10px",fontSize:11}}>
        <b style={{color:C.red}}>{f.desc}</b> <span style={{color:"#94a3b8"}}>needs {f.needed}, have {f.qty}</span>
        {f.startBy&&<span style={{color:C.red,marginLeft:6}}>Should have started W{f.startBy}</span>}
      </div>)}</div>
    </div>}
    {urgent.length>0&&<div style={{background:"#120e04",border:"1px solid #f59e0b44",borderRadius:8,padding:"12px 16px",marginBottom:10}}>
      <div style={{fontWeight:700,color:C.amber,fontSize:12,marginBottom:6}}>⚠ START BUILD THIS WEEK — {urgent.length} item{urgent.length>1?"s":""}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{urgent.map(f=><div key={f.id} style={{background:"#f59e0b18",border:"1px solid #f59e0b33",borderRadius:4,padding:"5px 10px",fontSize:11}}>
        <b style={{color:C.amber}}>{f.desc}</b> <span style={{color:"#94a3b8"}}>start by W{f.startBy} · {f.lead}wk lead</span>
      </div>)}</div>
    </div>}
    {warn.length>0&&<div style={{background:"#0d0e08",border:"1px solid #f59e0b22",borderRadius:8,padding:"10px 16px",marginBottom:10}}>
      <div style={{fontWeight:700,color:"#d97706",fontSize:11,marginBottom:5}}>📅 PLAN AHEAD — start in next 2 weeks</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{warn.map(f=><div key={f.id} style={{fontSize:11,color:"#94a3b8"}}>
        <b style={{color:"#d97706"}}>{f.desc}</b> by W{f.startBy}
      </div>)}</div>
    </div>}
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={S.cT}>Sub-Component Build Forecast</div>
        <div style={{fontSize:10,color:C.grey}}>Lead time = weeks needed before stock runs out</div>
      </div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>
          <TH ch="Part"/><TH ch="Category"/>
          <TH ch="Have" right/><TH ch="Building" right/><TH ch="Need" right/><TH ch="Gap" right/>
          <TH ch="Lead" right/><TH ch="Start By"/><TH ch="Runs Out"/>
          <TH ch="Status"/>
        </tr></thead>
        <tbody>
          {critical.map((f,i)=><FRow key={f.id} f={f} bg={i%2?"#150808":"#120606"}/>)}
          {urgent.map((f,i)=><FRow key={f.id} f={f} bg={i%2?"#130d04":"#110b02"}/>)}
          {warn.map((f,i)=><FRow key={f.id} f={f} bg={i%2?"#0d1117":"#0a0e14"}/>)}
          {inflight.map((f,i)=><FRow key={f.id} f={f} bg={i%2?"#080d14":"#060b12"}/>)}
          {ok.map((f,i)=><FRow key={f.id} f={f} bg={i%2?"#0d1117":"#0a0e14"}/>)}
        </tbody>
      </table></div>
    </div>
    <div style={{...S.card,background:"#080c10",border:"1px solid #1e2d3d"}}>
      <div style={S.cT}>Lead Time Reference — click to edit</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {Object.entries(leadWeeks).map(([cat,wks])=>(
          <div key={cat} style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"5px 10px",fontSize:11,display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:C.grey}}>{cat}:</span>
            <input type="number" min="1" max="20" value={wks}
              onChange={async e=>{
                const v=Math.max(1,parseInt(e.target.value)||1);
                const lw={...leadWeeks,[cat]:v};
                setLeadWeeks(lw);
                await saveAll(allState.parts,allState.targets,allState.mix,allState.buildLog,allState.weekPlan,lw);
              }}
              style={{background:"#141c2a",border:"1px solid #1e3a5f",borderRadius:3,color:C.amber,
                padding:"2px 4px",fontSize:11,width:36,textAlign:"center",fontFamily:"inherit",fontWeight:700}}/>
            <span style={{color:C.amber}}>w</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:C.grey,marginTop:8}}>Changes save instantly and sync to all teammates.</div>
    </div>
  </div>;
}

// ── APP ───────────────────────────────────────────────────────────────────────

// ── SUB-ASSEMBLY PLANNER ──────────────────────────────────────────────────────
function SubAssemblyPlanner({parts,targets,mix,buildLog,weekPlan,buffers,setBuffers,saveAll,allState}){
  const TOTAL_WEEKS=16;
  const SUB_CATS=["Sub-Assemblies","Relay Modules","Motherboards","Chassis","PCBs","Power & Compute"];
  const subParts=parts.filter(p=>SUB_CATS.includes(p.cat)&&(p.p64>0||p.p128>0));

  const bP64=buildLog.reduce((a,e)=>a+e.pp64,0);
  const bP128=buildLog.reduce((a,e)=>a+e.pp128,0);
  const maxActualWeek=buildLog.length>0?Math.max(...buildLog.map(e=>e.weekNum||1)):0;

  // Weekly demand per part from schedule
  const weeklyDemand=React.useMemo(()=>{
    const sched=calcSchedule(parts,mix,
      Math.max(0,targets.pp64-bP64),
      Math.max(0,targets.pp128-bP128),
      weekPlan,maxActualWeek);
    const demand={};
    subParts.forEach(p=>{
      demand[p.id]=[];
      let running=p.qty;
      for(let w=0;w<TOTAL_WEEKS;w++){
        const row=sched.find(r=>r.week===maxActualWeek+w+1);
        const used=row?(p.p64*(row.pp64||0)+p.p128*(row.pp128||0)):0;
        running=Math.max(0,running-used);
        demand[p.id].push({week:maxActualWeek+w+1,stockAfter:running,used});
      }
    });
    return demand;
  },[parts,mix,targets,buildLog,weekPlan]);

  // Compute run-out week and start-by week per part
  function getRunOut(partId){
    const d=weeklyDemand[partId]||[];
    for(let i=0;i<d.length;i++){if(d[i].stockAfter<=0)return d[i].week;}
    return null; // never runs out
  }

  const STATUS_COLORS={urgent:C.red,soon:C.amber,ok:C.green,never:"#2dd4bf"};

  return <div>
    <div style={{...S.card}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={S.cT}>Sub-Assembly Build Planner</div>
        <div style={{fontSize:10,color:C.grey}}>Set buffer weeks per part · calendar shows when to START building or ordering</div>
      </div>

      {/* Calendar grid */}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr>
              <th style={{textAlign:"left",padding:"6px 10px",color:C.grey,fontSize:10,letterSpacing:"0.1em",borderBottom:"1px solid #1e2d3d",minWidth:200}}>PART</th>
              <th style={{textAlign:"center",padding:"6px 8px",color:C.grey,fontSize:10,borderBottom:"1px solid #1e2d3d",minWidth:60}}>HAVE</th>
              <th style={{textAlign:"center",padding:"6px 8px",color:C.grey,fontSize:10,borderBottom:"1px solid #1e2d3d",minWidth:50}}>BUFFER</th>
              <th style={{textAlign:"center",padding:"6px 8px",color:C.grey,fontSize:10,borderBottom:"1px solid #1e2d3d",minWidth:80}}>START BY</th>
              <th style={{textAlign:"center",padding:"6px 8px",color:C.grey,fontSize:10,borderBottom:"1px solid #1e2d3d",minWidth:80}}>RUNS OUT</th>
              {Array.from({length:TOTAL_WEEKS},(_,i)=>(
                <th key={i} style={{textAlign:"center",padding:"4px 3px",color:C.grey,fontSize:9,borderBottom:"1px solid #1e2d3d",minWidth:32,letterSpacing:0}}>
                  W{maxActualWeek+i+1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subParts.map((p,idx)=>{
              const runOut=getRunOut(p.id);
              const buf=buffers[p.id]??2;
              const startBy=runOut?runOut-buf:null;
              const demand=weeklyDemand[p.id]||[];
              const status=!runOut?"never":startBy<=maxActualWeek+1?"urgent":startBy<=maxActualWeek+3?"soon":"ok";
              const statusColor=STATUS_COLORS[status];

              return <tr key={p.id} style={{background:idx%2?"#0d1117":"#0a0e14",borderBottom:"1px solid #1e2d3d11"}}>
                <td style={{padding:"8px 10px"}}>
                  <div style={{fontWeight:600,color:"#e2e8f0",fontSize:11}}>{p.desc}</div>
                  <div style={{fontSize:9,color:C.grey,marginTop:1}}>{p.pn}</div>
                </td>
                <td style={{textAlign:"center",padding:"8px 8px",color:C.teal,fontWeight:700}}>{p.qty}</td>
                <td style={{textAlign:"center",padding:"8px 4px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}>
                    <input type="number" min="0" max="12" value={buf}
                      onChange={e=>{
                        const v=Math.max(0,parseInt(e.target.value)||0);
                        const nb={...buffers,[p.id]:v};
                        setBuffers(nb);
                        saveAll(allState.parts,allState.targets,allState.mix,allState.buildLog,allState.weekPlan,allState.leadWeeks,nb);
                      }}
                      style={{width:32,textAlign:"center",background:"#141c2a",border:"1px solid #1e3a5f",
                        borderRadius:3,color:C.amber,padding:"2px 2px",fontSize:11,fontFamily:"inherit",fontWeight:700}}/>
                    <span style={{fontSize:9,color:C.grey}}>w</span>
                  </div>
                </td>
                <td style={{textAlign:"center",padding:"8px 8px"}}>
                  {startBy?<span style={{color:statusColor,fontWeight:700}}>W{startBy}</span>:<span style={{color:C.green}}>✓ OK</span>}
                </td>
                <td style={{textAlign:"center",padding:"8px 8px"}}>
                  {runOut?<span style={{color:C.red,fontWeight:700}}>W{runOut}</span>:<span style={{color:C.green}}>Never</span>}
                </td>
                {Array.from({length:TOTAL_WEEKS},(_,i)=>{
                  const wk=maxActualWeek+i+1;
                  const d=demand[i];
                  const isRunOut=runOut===wk;
                  const isStartBy=startBy===wk;
                  const isUrgentZone=startBy&&runOut&&wk>=startBy&&wk<runOut;
                  const isCovered=!runOut||wk<startBy;
                  let bg="transparent",label="";
                  if(isRunOut){bg=C.red+"44";label="⚠";}
                  else if(isStartBy){bg=C.amber+"55";label="▶";}
                  else if(isUrgentZone){bg=C.amber+"22";}
                  else if(isCovered){bg=C.green+"11";}
                  return <td key={i} style={{textAlign:"center",padding:"4px 2px",background:bg,position:"relative"}}>
                    {label&&<span style={{fontSize:10,fontWeight:700,color:isRunOut?C.red:C.amber}}>{label}</span>}
                    {!label&&d&&d.used>0&&<span style={{fontSize:8,color:"#2dd4bf55"}}>-{d.used}</span>}
                  </td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:16,marginTop:12,padding:"8px 0",borderTop:"1px solid #1e2d3d",flexWrap:"wrap"}}>
        {[
          {color:C.green+"22",label:"Covered — stock sufficient"},
          {color:C.amber+"55",label:"▶ Start building / ordering now"},
          {color:C.amber+"22",label:"Build window"},
          {color:C.red+"44",label:"⚠ Runs out this week"},
        ].map(({color,label})=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.grey}}>
            <div style={{width:16,height:12,background:color,borderRadius:2,border:"1px solid #1e2d3d"}}/>
            {label}
          </div>
        ))}
        <div style={{fontSize:10,color:C.grey,marginLeft:"auto"}}>Buffer = weeks before runout to trigger start · -N = parts consumed that week</div>
      </div>
    </div>
  </div>;
}

export default function App(){
  const [tab,setTab]              = useState("overview");
  const [parts,setParts]          = useState(MASTER);
  const [targets,setTargets]      = useState(INIT_TARGETS);
  const [mix,setMix]              = useState(INIT_MIX);
  const [weekPlan,setWeekPlan]    = useState(INIT_WEEKPLAN);
  const [buildLog,setBuildLog]    = useState([]);
  const [leadWeeks,setLeadWeeks]  = useState(DEFAULT_LEAD_WEEKS);
  const [buffers,setBuffers]      = useState({});
  const [loading,setLoading]      = useState(true);
  const [syncMsg,setSyncMsg]      = useState("");

  // ── Load all data from Supabase on mount ──
  useEffect(()=>{
    (async()=>{
      const{data,error}=await supabase.from("pp_data").select("key,value");
      if(!error&&data){
        const row=k=>data.find(r=>r.key===k)?.value;
        const p=row("pp-parts"),t=row("pp-targets"),m=row("pp-mix"),l=row("pp-log"),wp=row("pp-weekplan"),lw=row("pp-leadweeks"),buf=row("pp-buffers");
        if(p)setParts(p); if(t)setTargets(t); if(m)setMix(m); if(l)setBuildLog(l); if(wp)setWeekPlan(wp); if(lw)setLeadWeeks(lw); if(buf)setBuffers(buf);
      }
      setLoading(false);
    })();
  },[]);

  // ── Realtime subscription — instant sync across all teammates ──
  useEffect(()=>{
    const channel=supabase
      .channel("pp_data_changes")
      .on("postgres_changes",{event:"*",schema:"public",table:"pp_data"},payload=>{
        const{key,value}=payload.new||{};
        if(key==="pp-parts")     setParts(value);
        if(key==="pp-targets")   setTargets(value);
        if(key==="pp-mix")       setMix(value);
        if(key==="pp-log")       setBuildLog(value);
        if(key==="pp-weekplan")  setWeekPlan(value);
        if(key==="pp-leadweeks") setLeadWeeks(value);
        if(key==="pp-buffers")   setBuffers(value);
      })
      .subscribe();
    return()=>supabase.removeChannel(channel);
  },[]);

  // ── Save all state to Supabase ──
  const saveAll=useCallback(async(p,t,m,l,wp,lw,buf)=>{
    const rows=[
      {key:"pp-parts",    value:p},
      {key:"pp-targets",  value:t},
      {key:"pp-mix",      value:m},
      {key:"pp-log",      value:l},
      {key:"pp-weekplan", value:wp||{}},
      {key:"pp-leadweeks",value:lw||DEFAULT_LEAD_WEEKS},
      {key:"pp-buffers",  value:buf||{}},
    ];
    const{error}=await supabase.from("pp_data").upsert(rows,{onConflict:"key"});
    if(!error){setSyncMsg("✓ Synced");setTimeout(()=>setSyncMsg(""),2000);}
    else setSyncMsg("⚠ Sync failed");
  },[]);

  const reset=async()=>{
    if(!window.confirm("Reset ALL shared data for the whole team?"))return;
    setParts(MASTER);setTargets(INIT_TARGETS);setMix(INIT_MIX);setBuildLog([]);setWeekPlan({});setLeadWeeks(DEFAULT_LEAD_WEEKS);setBuffers({});
    await saveAll(MASTER,INIT_TARGETS,INIT_MIX,[],{},DEFAULT_LEAD_WEEKS,{});
  };

  const tb=buildLog.reduce((a,e)=>a+e.pp64+e.pp128,0);
  const tt=targets.pp64+targets.pp128,pct=Math.round(tb/tt*100)||0;
  const nowT=useMemo(()=>buildableBoth(parts,mix).total,[parts,mix]);

  const bP64_badge=buildLog.reduce((a,e)=>a+e.pp64,0),bP128_badge=buildLog.reduce((a,e)=>a+e.pp128,0);
  const critCount=parts.filter(p=>{
    const cats=["Relay Modules","Sub-Assemblies","Motherboards","Chassis","PCBs","Power & Compute","Shipping"];
    if(!cats.includes(p.cat))return false;
    const needed=p.p64*Math.max(0,targets.pp64-bP64_badge)+p.p128*Math.max(0,targets.pp128-bP128_badge);
    return needed>0&&(p.qty+p.inBuild+p.onOrder)<needed&&!p.inBuild&&!p.onOrder;
  }).length;

  const TABS=[["overview","📊 Overview"],["production","📅 Production"],["inventory","📦 Inventory"],["orders","⚡ Orders"],["forecast",`🔔 Forecast${critCount>0?` (${critCount})`:""}`],["planner","🗓 SA Planner"]];

  if(loading) return(
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",gap:16}}>
      <div style={{fontSize:16,color:C.amber,letterSpacing:"0.2em"}}>⚙ LOADING...</div>
      <div style={{fontSize:11,color:C.grey}}>Fetching shared team data</div>
    </div>
  );

  return <div style={S.app}>
    <div style={{background:"linear-gradient(135deg,#0a0e14,#141c2a)",borderBottom:"1px solid #1e3a5f",padding:"12px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:"0.15em",color:C.amber,textTransform:"uppercase"}}>⚙ PP Manufacturing Ops</div>
        <div style={{fontSize:10,color:C.grey,letterSpacing:"0.1em",marginTop:2}}>
          PP64 × {targets.pp64} · PP128 × {targets.pp128}
          <span style={{marginLeft:12,color:"#2dd4bf55"}}>● LIVE · shared with team · real-time sync</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:140}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.grey,marginBottom:3}}>
            <span style={{letterSpacing:"0.1em",textTransform:"uppercase"}}>Run Progress</span>
            <span style={{color:C.teal,fontWeight:700}}>{pct}%</span>
          </div>
          <div style={{background:"#1e2d3d",height:7,borderRadius:4,overflow:"hidden"}}>
            <div style={{background:`linear-gradient(90deg,${C.teal},${C.green})`,width:`${pct}%`,height:"100%",borderRadius:4,transition:"width 0.5s"}}/>
          </div>
          <div style={{fontSize:9,color:C.grey,marginTop:2}}>{tb} / {tt} built</div>
        </div>
        <div style={{width:1,height:36,background:"#1e2d3d"}}/>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:9,color:C.grey,letterSpacing:"0.1em",textTransform:"uppercase"}}>Buildable Now</div>
          <div style={{fontSize:20,fontWeight:700,color:nowT>=10?C.green:C.red,lineHeight:1.2}}>{nowT} <span style={{fontSize:10,color:C.grey}}>units</span></div>
        </div>
        <div style={{width:1,height:36,background:"#1e2d3d"}}/>
        {syncMsg&&<div style={{fontSize:11,color:C.teal,fontWeight:700,minWidth:80}}>{syncMsg}</div>}
        <button onClick={reset} style={{background:"#64748b22",border:"1px solid #64748b44",color:C.grey,borderRadius:4,padding:"7px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>RESET</button>
      </div>
    </div>

    <div style={{display:"flex",background:"#0d1117",borderBottom:"1px solid #1e2d3d",padding:"0 22px"}}>
      {TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)}
        style={{padding:"11px 17px",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
          cursor:"pointer",background:"none",border:"none",
          borderBottom:tab===k?`2px solid ${C.amber}`:"2px solid transparent",
          color:tab===k?C.amber:C.grey,transition:"color 0.15s",fontFamily:"inherit"}}>{l}</button>)}
    </div>

    <div style={{padding:"18px 22px",maxWidth:1440,margin:"0 auto"}}>
      {tab==="overview"   &&<Overview   parts={parts} targets={targets} mix={mix} buildLog={buildLog}/>}
      {tab==="production" &&<Production parts={parts} setParts={setParts} targets={targets} setTargets={setTargets} mix={mix} setMix={setMix} buildLog={buildLog} setBuildLog={setBuildLog} weekPlan={weekPlan} setWeekPlan={setWeekPlan} saveAll={saveAll}/>}
      {tab==="inventory"  &&<Inventory  parts={parts} setParts={setParts} targets={targets} buildLog={buildLog} saveAll={saveAll} mix={mix} weekPlan={weekPlan}/>}
      {tab==="orders"     &&<Orders     parts={parts} targets={targets} buildLog={buildLog}/>}
      {tab==="forecast"   &&<Forecast   parts={parts} targets={targets} mix={mix} buildLog={buildLog} weekPlan={weekPlan} leadWeeks={leadWeeks} setLeadWeeks={setLeadWeeks} saveAll={saveAll} allState={{parts,targets,mix,buildLog,weekPlan,leadWeeks}}/>}
      {tab==="planner"    &&<SubAssemblyPlanner parts={parts} targets={targets} mix={mix} buildLog={buildLog} weekPlan={weekPlan} buffers={buffers} setBuffers={setBuffers} saveAll={saveAll} allState={{parts,targets,mix,buildLog,weekPlan,leadWeeks,buffers}}/>}
    </div>
  </div>;
}
