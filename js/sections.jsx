/* global React, Reveal, Stagger, Magnetic, Arrow, scrollToId */
const { useState:sState, useEffect:sEff, useRef:sRef } = React;

/* ---------- NAV ---------- */
function Nav({ lightHero }){
  const [solid, setSolid] = sState(false);
  const [open, setOpen] = sState(false);
  sEff(()=>{
    const onScroll = ()=> setSolid(window.pageYOffset > 48);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    return ()=>window.removeEventListener('scroll', onScroll);
  },[]);
  const cls = `nav ${solid?'solid':''} ${(!solid&&lightHero)?'on-light':''}`;
  const links = [['Services','services'],['Fleet & Story','about'],['Coverage','coverage'],['Contact','contact']];
  return (
    <header className={cls}>
      <div className="brand" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{cursor:'pointer'}}>
        <div className="mark">Billing<br/><b>Trucking</b></div>
        <div className="divider"></div>
        <div className="sub">TURLOCK, CA<br/>EST. 2003</div>
      </div>
      <nav className="navlinks">
        {links.map(([t,id])=> <a key={id} onClick={()=>scrollToId(id)}>{t}</a>)}
      </nav>
      <Magnetic><button className="nav-cta" onClick={()=>scrollToId('contact')}>Request a Quote <Arrow size={14}/></button></Magnetic>
      <button className="nav-burger" onClick={()=>setOpen(o=>!o)} aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={open?'M6 6l12 12M6 18L18 6':'M4 7h16M4 12h16M4 17h16'}/></svg>
      </button>
      {open && (
        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'var(--paper)',borderTop:'1px solid var(--line)',padding:'12px var(--pad) 24px',display:'flex',flexDirection:'column',gap:4,boxShadow:'0 30px 50px -30px rgba(0,0,0,.4)'}}>
          {links.map(([t,id])=> <a key={id} onClick={()=>{scrollToId(id);setOpen(false);}} style={{color:'var(--ink)',padding:'14px 0',fontWeight:700,borderBottom:'1px solid var(--line)'}}>{t}</a>)}
          <button className="btn btn-primary" style={{marginTop:16,justifyContent:'center'}} onClick={()=>{scrollToId('contact');setOpen(false);}}>Request a Quote <Arrow/></button>
        </div>
      )}
    </header>
  );
}

/* ---------- MARQUEE ---------- */
function Marquee({ items, dark=true }){
  const row = (
    <span className="track">
      {[...items,...items].map((t,i)=>(
        <span className="item" key={i}>{t}<span className="dot"></span></span>
      ))}
    </span>
  );
  return <div className={`marquee ${dark?'on-dark':'on-light'}`}>{row}</div>;
}

/* ---------- COVERAGE ---------- */
function Coverage(){
  /* --- portrait map of the western U.S., built from real lon/lat,
     projected (equirectangular w/ latitude correction) so CA, OR, NV & AZ
     sit in their true geographic positions and orientations. --- */
  const VB_W = 480, VB_H = 600, PAD = 30;
  const lonMin = -124.7, lonMax = -108.9, latMin = 31.0, latMax = 46.5;
  const latMid = (latMin + latMax) / 2;
  const kx = Math.cos(latMid * Math.PI / 180);
  const spanX = (lonMax - lonMin) * kx, spanY = (latMax - latMin);
  const s = Math.min((VB_W - 2*PAD) / spanX, (VB_H - 2*PAD) / spanY);
  const offX = PAD + ((VB_W - 2*PAD) - spanX*s) / 2;
  const offY = PAD + ((VB_H - 2*PAD) - spanY*s) / 2;
  const P = (lon, lat) => [ offX + (lon - lonMin)*kx*s, offY + (latMax - lat)*s ];
  const poly = (pts) => pts.map((p,i)=>{ const [x,y]=P(p[0],p[1]); return `${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ') + ' Z';

  const CA = [
    [-124.21,42.00],[-120.00,42.00],[-120.00,39.00],[-114.63,35.00],[-114.47,34.72],
    [-114.14,34.30],[-114.34,34.03],[-114.50,33.00],[-114.62,32.74],[-117.13,32.53],
    [-117.32,33.20],[-118.19,33.74],[-118.94,34.03],[-120.47,34.45],[-120.64,34.90],
    [-121.88,36.60],[-122.40,37.00],[-122.51,37.78],[-123.00,38.30],[-123.72,38.91],
    [-124.36,40.44],[-124.11,41.00],[-124.21,42.00]
  ];
  const OR = [
    [-124.21,42.00],[-117.03,42.00],[-117.03,43.80],[-116.90,44.30],[-117.23,44.43],
    [-117.05,45.00],[-116.92,45.60],[-117.03,46.00],[-118.99,45.93],[-119.62,45.91],
    [-120.21,45.73],[-121.18,45.71],[-122.24,45.55],[-122.81,45.66],[-123.21,46.15],
    [-123.96,46.26],[-124.07,45.00],[-124.41,43.80],[-124.55,42.84]
  ];
  const NV = [
    [-120.00,42.00],[-114.04,42.00],[-114.04,37.00],[-114.63,36.14],[-114.74,35.12],
    [-114.63,35.00],[-120.00,39.00]
  ];
  const AZ = [
    [-114.63,35.00],[-114.74,35.12],[-114.63,36.14],[-114.04,36.19],[-114.04,37.00],
    [-109.05,37.00],[-109.05,31.33],[-111.07,31.33],[-114.81,32.49],[-114.62,32.74],
    [-114.50,33.00],[-114.34,34.03],[-114.14,34.30],[-114.47,34.72]
  ];
  const states = [
    { id:'CA', d:poly(CA) }, { id:'OR', d:poly(OR) },
    { id:'NV', d:poly(NV) }, { id:'AZ', d:poly(AZ) },
  ];

  const hub = (()=>{ const [x,y]=P(-120.85,37.49); return {x,y}; })();
  const dests = [
    { lon:-121.49, lat:38.58, n:'Sacramento',  s:'CA', anchor:'start', dx:11,  dy:4  },
    { lon:-118.24, lat:34.05, n:'Los Angeles', s:'CA', anchor:'start', dx:11,  dy:4  },
    { lon:-112.07, lat:33.45, n:'Phoenix',     s:'AZ', anchor:'end',   dx:-11, dy:4  },
    { lon:-115.14, lat:36.17, n:'Las Vegas',   s:'NV', anchor:'start', dx:11,  dy:4  },
    { lon:-122.68, lat:45.52, n:'Portland',    s:'OR', anchor:'start', dx:11,  dy:4  },
  ].map(d=>{ const [x,y]=P(d.lon,d.lat); return {...d,x,y}; });

  const lane = (a,b)=>{
    const mx=(a.x+b.x)/2, my=(a.y+b.y)/2, dx=b.x-a.x, dy=b.y-a.y;
    const len=Math.hypot(dx,dy)||1, bend=len*0.13;
    const cx=mx + (-dy/len)*bend, cy=my + (dx/len)*bend;
    return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  };

  const rows = [
    ['California','Sacramento · Los Angeles · Turlock HQ'],
    ['Arizona','Phoenix'],
    ['Nevada','Las Vegas'],
    ['Oregon','Portland'],
  ];
  return (
    <section className="block on-ink" id="coverage" data-screen-label="Coverage">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow"><i className="tick"></i>Coverage</span>
            <Reveal as="h2" className="sec-title">From Turlock,<br/>across the West.</Reveal>
          </div>
          <Reveal className="sec-lead" delay={120}>Our home base sits in California's Central Valley — the produce engine of the country. From there, we run cold freight across California, up to Oregon, and out through Nevada and Arizona to wherever your load needs to land.</Reveal>
        </div>
        <div className="cov">
          <Reveal className="lanes">
            <div className="grid-bg"></div>
            <svg className="cov-map" viewBox="0 0 480 600" aria-label="Coverage map: Turlock hub serving California, Oregon, Nevada and Arizona — Sacramento, Los Angeles, Portland, Las Vegas and Phoenix.">
              <defs>
                <linearGradient id="covFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--maroon-2)" stopOpacity="0.30"/>
                  <stop offset="1" stopColor="var(--maroon-ink)" stopOpacity="0.16"/>
                </linearGradient>
                <filter id="covGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="var(--maroon-3)" floodOpacity="0.35"/>
                </filter>
              </defs>
              <g filter="url(#covGlow)">
                {states.map(st=>(<path key={st.id} className="cov-state" d={st.d} fill="url(#covFill)"/>))}
              </g>
              {dests.map((d,i)=>(<path key={'l'+i} className={`lane-line ${i%2?'dim':''}`} d={lane(hub,d)}/>))}
              {dests.map((d,i)=>(
                <g key={'d'+i}>
                  <circle className="dest-halo" cx={d.x} cy={d.y} r="9"/>
                  <circle className="dest-dot" cx={d.x} cy={d.y} r="4.5"/>
                  <text x={d.x+d.dx} y={d.y+d.dy} textAnchor={d.anchor} fill="rgba(255,255,255,.82)" style={{font:'400 12.5px var(--font-mono)',letterSpacing:'.05em'}}>{d.n}</text>
                </g>
              ))}
              <circle className="lane-pulse" cx={hub.x} cy={hub.y} r="22"><animate attributeName="r" values="14;32;14" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".55;0;.55" dur="3s" repeatCount="indefinite"/></circle>
              <circle className="hub-dot" cx={hub.x} cy={hub.y} r="7.5"/>
              <text x={hub.x+13} y={hub.y-3} fill="#fff" style={{font:'800 15px var(--font-display)',textTransform:'uppercase'}}>Turlock</text>
              <text x={hub.x+13} y={hub.y+13} fill="var(--maroon-3)" style={{font:'400 10.5px var(--font-mono)',letterSpacing:'.14em'}}>HOME BASE</text>
              <text x="30" y="582" fill="rgba(255,255,255,.34)" style={{font:'400 10px var(--font-mono)',letterSpacing:'.22em'}}>WESTERN U.S. · SERVICE MAP</text>
            </svg>
          </Reveal>
          <Stagger className="cov-list" step={90}>
            {rows.map((r,i)=>(
              <div className="row" key={i}>
                <div className="name">{r[0]}</div>
                <div className="meta">{r[1]}</div>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Marquee, Coverage });
