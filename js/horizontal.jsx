/* global React, Magnetic, Arrow, scrollToId */
const { useRef:zRef, useEffect:zEff, useState:zState } = React;

/* ============================================================
   HORIZONTAL STORYTELLING TRACK  (Direction 3A)
   A pinned section that translates a horizontal track as the user
   scrolls vertically. Eased interpolation, per-panel parallax depth,
   and a continuous edge-to-edge maroon→black gradient so panels blend
   seamlessly into one another.
   ============================================================ */

/* Continuous gradient stops — each panel paints from stop[i] → stop[i+1],
   so neighbouring panels share an edge colour = no hard breaks. */
const HZX_STOPS = [
  'oklch(0.315 0.108 27)', // deep maroon  (intro)
  'oklch(0.235 0.090 27)', // → services
  'oklch(0.150 0.052 28)', // → numbers (near-black maroon)
  'oklch(0.205 0.078 26)', // → story
  'oklch(0.140 0.048 29)', // → process
  'oklch(0.260 0.098 27)', // → lanes
  'oklch(0.120 0.040 29)', // outro edge
];
const panelBg = (i)=> `linear-gradient(100deg, ${HZX_STOPS[i]} 0%, ${HZX_STOPS[i+1]} 100%)`;

const hzIcon = {
  snow:'M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3',
  leaf:'M4 20c0-9 6-15 16-15 0 10-6 16-16 15zM4 20c4-6 8-9 12-11',
  temp:'M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z',
  route:'M6 6h8a4 4 0 0 1 0 8H10a4 4 0 0 0 0 8M6 6v0M18 18v0',
  monitor:'M3 5h18v12H3zM7 21h10M12 17v4M7 11l2.5-3 2.5 3 2.5-4L17 11',
  shield:'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4',
};
const Ic = ({d})=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>);

const SVC = [
  { ic:'snow',  t:'Refrigerated Freight', d:'Reefer trailers held at precise set-points — dock to dock, the cold chain never breaks.', tag:'Chilled · Frozen' },
  { ic:'leaf',  t:'Produce & Food-Grade',  d:'Fresh produce out of the Central Valley with food-safe handling shippers expect.', tag:'Farm to Receiver' },
  { ic:'temp',  t:'Multi-Temp & Frozen',   d:'Chilled and frozen commodities, equipment dialed in for the exact load you ship.', tag:'Set-Point Control' },
  { ic:'route', t:'Long-Haul & Regional',  d:'Lanes out of Turlock across California, the West Coast and over-the-road.', tag:'CA · West · OTR' },
  { ic:'monitor',t:'24/7 Temp Monitoring', d:'Continuous telematics and reefer logging — tracked, recorded, accountable.', tag:'Tracked & Logged' },
  { ic:'shield',t:'Dedicated Lanes',       d:'Consistent capacity for repeat freight, scheduled around your needs.', tag:'Repeat Capacity' },
];
const NUMS = [
  { n:2.9, dec:1, suf:'M', lbl:'Miles Since 2003', note:'Nearly three million, across the western U.S.' },
  { n:99,  dec:0, suf:'%', lbl:'On-Time', note:'Appointment-based freight' },
  { n:100, dec:0, suf:'%', lbl:'Temp-Monitored', note:'Continuous set-point logging' },
  { n:23,  dec:0, suf:'',  lbl:'Years Family-Run', note:'Turlock, California' },
];
const PROC = [
  { k:'01', t:'Quote', d:'Send your commodity, lanes and pickup window. Most rates come back same day.' },
  { k:'02', t:'Dispatch', d:'A reefer is assigned and pre-cooled to your exact set-point before loading.' },
  { k:'03', t:'Cold Load', d:'Product loaded fast and sealed — temperature locked from the first mile.' },
  { k:'04', t:'Monitored Transit', d:'Live telematics log the set-point continuously, the whole run.' },
  { k:'05', t:'On-Time Delivery', d:'Appointment-based delivery with a clean, documented cold chain.' },
];
const LANES = [
  { route:'Central Valley → Pacific NW', mi:'~1,150 mi', com:'Leafy greens & berries', note:'Set-point 34°F · two-day transit held to appointment.' },
  { route:'Turlock → Southern California', mi:'~310 mi', com:'Mixed produce', note:'Same-day regional reefer runs, daily capacity.' },
  { route:'CA → Mountain West', mi:'~900 mi', com:'Frozen & food-grade', note:'OTR lanes into UT · CO · ID, fully temp-logged.' },
];

function HorizontalShowcase(){
  const outerRef = zRef(null);
  const trackRef = zRef(null);
  const cueRef   = zRef(null);
  const barRef   = zRef(null);
  const tempRef  = zRef(null);
  const PANELS = 6;

  zEff(()=>{
    const outer = outerRef.current, track = trackRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mq = window.matchMedia('(min-width:721px)');
    let raf, curX = 0, wasActive = null;
    const actState = new Array(track.children.length).fill(false); // mirrors data-active, so we only touch the DOM on change

    /* Layout metrics are read once and cached — recomputed on resize, never inside the
       rAF loop. Reading offsetHeight / scrollWidth per frame forces a synchronous reflow
       that interleaves with our style writes; hoisting them keeps each frame write-only. */
    let vw = 1, total = 1, maxX = 0;
    const measure = ()=>{
      vw = window.innerWidth;
      total = Math.max(1, outer.offsetHeight - window.innerHeight);
      maxX  = Math.max(0, track.scrollWidth - vw);
    };
    measure();
    window.addEventListener('resize', measure, {passive:true});

    const active = ()=> mq.matches && !reduce;
    const panels = track.children;

    const tick = ()=>{
      if(active()){
        // single layout read per frame, taken before any writes (no read-after-write thrash)
        const p = Math.min(1, Math.max(0, (-outer.getBoundingClientRect().top)/total));
        const targetX = p * maxX;
        curX += (targetX - curX) * 0.085;          // eased trail
        if(Math.abs(targetX - curX) < 0.4) curX = targetX;
        track.style.transform = `translate3d(${ -curX.toFixed(2) }px,0,0)`;

        for(let i=0;i<panels.length;i++){
          const center = i*vw + vw/2;
          const n = Math.max(-1.3, Math.min(1.3, (center - curX - vw/2)/vw));
          const vis = Math.max(0, 1 - Math.abs(n));
          const st = panels[i].style;
          st.setProperty('--n', n.toFixed(3));
          st.setProperty('--vis', vis.toFixed(3));
          const act = Math.abs(n) < 0.42;
          if(act !== actState[i]){                 // only write the attribute when it flips
            actState[i] = act;
            if(act) panels[i].setAttribute('data-active','');
            else panels[i].removeAttribute('data-active');
          }
        }
        if(barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
        if(cueRef.current) cueRef.current.style.opacity = Math.max(0, 1 - p*5);
        wasActive = true;
      } else if(wasActive !== false){              // teardown runs once on the active→inactive flip
        track.style.transform = '';
        for(let i=0;i<panels.length;i++){
          panels[i].style.removeProperty('--n');
          panels[i].style.removeProperty('--vis');
          panels[i].setAttribute('data-active','');
          actState[i] = true;
        }
        wasActive = false;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', measure); };
  },[]);

  /* Bespoke detail — a live reefer set-point readout that drifts a few tenths around
     34°F, the way a real telematics gauge breathes. Pure textContent on a lazy timer
     (no rAF, no React re-render); holds steady at 34.0 under reduced-motion. */
  zEff(()=>{
    const el = tempRef.current; if(!el) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent = '34.0'; return; }
    let id;
    const drift = ()=>{
      el.textContent = (34 + (Math.random()*0.4 - 0.2)).toFixed(1);   // 33.8–34.2 °F
      id = setTimeout(drift, 1100 + Math.random()*1000);
    };
    drift();
    return ()=> clearTimeout(id);
  },[]);

  const Panel = ({i, kind, label, bg, children})=>(
    <article className={`hzx-panel hzx-${kind}`} data-screen-label={label} style={{ background:panelBg(i) }}>
      {bg}
      <div className="hzx-grain"></div>
      <div className="panel-inner">{children}</div>
      <div className="hzx-index"><span>{String(i+1).padStart(2,'0')}</span> / {String(PANELS).padStart(2,'0')}</div>
    </article>
  );

  return (
    <section className="hzx" ref={outerRef} style={{ '--panels':PANELS, height:`calc(${PANELS} * 100vh)` }}>
      <div className="hzx-sticky">
        <div className="hzx-track" ref={trackRef}>

          {/* 0 — INTRO */}
          <Panel i={0} kind="intro" label="3A · Intro">
            <div className="layer-back hzx-watermark">B</div>
            <div className="intro-mid layer-mid">
              <span className="hzx-eyebrow"><i></i>The Billing Trucking Story · Scroll to travel</span>
              <h2 className="hzx-h1">Cold freight,<br/><em>start to finish.</em></h2>
              <p className="hzx-lead">A journey through how a family-run reefer fleet out of Turlock moves the West's perishable freight — capability by capability, mile by mile.</p>
              <div className="hzx-scrollhint layer-fore"><span className="ln"></span>Keep Scrolling<Arrow/></div>
            </div>
          </Panel>

          {/* 1 — SERVICES */}
          <Panel i={1} kind="services" label="3A · Capabilities">
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i></i>Capabilities</span>
              <h2 className="hzx-h2">What we haul,<br/>and how.</h2>
              <p className="hzx-sub">Refrigerated freight is all we do — so we do it with the focus a perishable load deserves.</p>
            </div>
            <div className="svc-row layer-fore">
              {SVC.map((s,k)=>(
                <div className="hzx-svc" key={k} style={{ '--d':k }}>
                  <div className="ico"><Ic d={hzIcon[s.ic]}/></div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="tag">{s.tag}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* 2 — BY THE NUMBERS */}
          <Panel i={2} kind="numbers" label="3A · By The Numbers">
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i></i>By The Numbers</span>
              <h2 className="hzx-h2">Built on cold loads,<br/>delivered on time.</h2>
            </div>
            <div className="num-row layer-fore">
              {NUMS.map((s,k)=>(
                <div className="hzx-num" key={k} style={{ '--d':k }}>
                  <div className="big"><HzCount p={s}/><span className="u">{s.suf}</span></div>
                  <div className="lbl">{s.lbl}</div>
                  <div className="note">{s.note}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* 3 — OUR STORY */}
          <Panel i={3} kind="story" label="3A · Our Story" bg={
            <div className="story-vid">
              <div className="story-clip">
                <iframe src="https://player.vimeo.com/video/1200559877?background=1&amp;autoplay=1&amp;loop=1&amp;muted=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="BTruckingSectionVideo"></iframe>
              </div>
              <div className="imgtag"><b>USDOT 2207928</b> · MC 766110</div>
            </div>
          }>
            <div className="story-body layer-fore">
              <span className="hzx-eyebrow"><i></i>Our Story</span>
              <h2 className="hzx-h2">A Central Valley<br/>fleet, run like family.</h2>
              <p className="hzx-sub">Founded in <b>2003</b> in Turlock, California, we started with one promise: keep the cold chain intact and the freight on schedule. We've kept it ever since.</p>
              <p className="hzx-quote">"The temperature holds. <em>So does our word.</em>"</p>
              <div className="story-facts">
                <div><span className="k">Founded</span><span className="v">2003</span></div>
                <div><span className="k">Home Base</span><span className="v">Turlock</span></div>
                <div><span className="k">Specialty</span><span className="v">Reefer</span></div>
              </div>
            </div>
          </Panel>

          {/* 4 — PROCESS */}
          <Panel i={4} kind="process" label="3A · Process">
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i></i>How It Moves</span>
              <h2 className="hzx-h2">From quote<br/>to cold delivery.</h2>
              <p className="hzx-sub">Five disciplined steps — the same on every load, whether it's a single pallet or a full reefer.</p>
            </div>
            <div className="proc-row layer-fore">
              {PROC.map((s,k)=>(
                <div className="hzx-step" key={k} style={{ '--d':k }}>
                  <span className="k">{s.k}</span>
                  <span className="dot"></span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* 5 — SIGNATURE LANES */}
          <Panel i={5} kind="lanes" label="3A · Signature Lanes">
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i></i>Signature Lanes</span>
              <h2 className="hzx-h2">Freight we run,<br/>week in, week out.</h2>
              <p className="hzx-sub">Representative reefer lanes out of the Central Valley — the kind of dedicated, repeatable capacity we're built for.</p>
            </div>
            <div className="lane-row layer-fore">
              {LANES.map((l,k)=>(
                <div className="hzx-lane" key={k} style={{ '--d':k }}>
                  <div className="lane-top"><span className="mi">{l.mi}</span><span className="com">{l.com}</span></div>
                  <h3>{l.route}</h3>
                  <p>{l.note}</p>
                  <div className="lane-line"><span></span></div>
                </div>
              ))}
              <div className="hzx-lane lane-cta" style={{ '--d':3 }}>
                <h3>Have a lane of your own?</h3>
                <p>Tell us your commodity and route — we'll come back with capacity and a rate.</p>
                <Magnetic><button className="btn btn-primary" onClick={()=>scrollToId('contact')}>Request a Quote <Arrow/></button></Magnetic>
              </div>
            </div>
          </Panel>

        </div>

        {/* telematics readout + progress + cue chrome (outside the moving track) */}
        <div className="hzx-hud" aria-hidden="true">
          <span className="hzx-hud-dot"></span>
          <span className="hzx-hud-k">Reefer</span>
          <span className="hzx-hud-v"><b ref={tempRef}>34.0</b>°F</span>
        </div>
        <div className="hzx-progress">
          <div className="hzx-prog-track"><span ref={barRef}></span></div>
          <div className="hzx-prog-labels">
            {['Intro','Capabilities','Numbers','Story','Process','Lanes'].map((t,i)=>(
              <span key={i} className="lab">{t}</span>
            ))}
          </div>
        </div>
        <div className="hzx-cue" ref={cueRef}><span>Scroll to travel</span><i></i></div>
      </div>
    </section>
  );
}

/* CountUp that fires when its panel becomes active (horizontal viewport) */
function HzCount({ p }){
  const ref = zRef(null);
  const [v, setV] = zState(0);
  zEff(()=>{
    const el = ref.current; if(!el) return;
    const panel = el.closest('.hzx-panel');
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ setV(p.n); return; }
    let done = false;
    const run = ()=>{
      if(done) return; done = true;
      const start = Date.now(), dur = 1600, ease = x=>1-Math.pow(1-x,3);
      const step = ()=>{ const t=Math.min(1,(Date.now()-start)/dur); setV(p.n*ease(t)); if(t<1) requestAnimationFrame(step); else setV(p.n); };
      step();
    };
    const io = new IntersectionObserver(()=>{}, {});
    let raf;
    const watch = ()=>{ if(panel && panel.hasAttribute('data-active')) run(); else raf=requestAnimationFrame(watch); };
    raf = requestAnimationFrame(watch);
    return ()=>{ cancelAnimationFrame(raf); io.disconnect(); };
  },[]);
  return <span ref={ref}>{Number(v).toLocaleString('en-US',{minimumFractionDigits:p.dec,maximumFractionDigits:p.dec})}</span>;
}

Object.assign(window, { HorizontalShowcase });
