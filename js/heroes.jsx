/* global React, Magnetic, Arrow, scrollToId */
const { useRef:hRef, useEffect:hEff } = React;

/* ============================================================
   FULL-BLEED STILLFRAME HERO
   ============================================================ */
function HeroStill(){
  const bgRef = hRef(null);
  hEff(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = ()=>{ if(bgRef.current) bgRef.current.style.transform = `scale(1.08) translateY(${window.pageYOffset*0.18}px)`; };
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=>window.removeEventListener('scroll', onScroll);
  },[]);
  return (
    <section className="hero-still" data-screen-label="Hero · Full-bleed Still">
      <div className="bg" ref={bgRef}><img src="assets/fleet-wide.jpg" alt="Billing Trucking refrigerated fleet"/></div>
      <div className="grad"></div>
      <div className="grad-b"></div>
      <div className="still-content">
        <span className="eyebrow hero-text-eyebrow"><i className="tick"></i>Refrigerated &amp; Produce Freight · Turlock, CA</span>
        <h1>Moving the <span className="em">West's</span> cold freight.</h1>
        <p className="still-sub">Temperature-controlled trucking out of California's Central Valley. Produce, perishables and food-grade loads, hauled with the discipline a cold chain demands.</p>
        <div className="still-cta">
          <Magnetic><button className="btn btn-primary" onClick={()=>scrollToId('contact')}>Request a Quote <Arrow/></button></Magnetic>
          <Magnetic><button className="btn btn-ghost on-dark" onClick={()=>scrollToId('services')}>Our Capabilities</button></Magnetic>
        </div>
      </div>
      <div className="scroll-cue"><div className="mouse"></div><div className="t">Scroll</div></div>
    </section>
  );
}

Object.assign(window, { HeroStill });
