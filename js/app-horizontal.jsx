/* global React, ReactDOM, Nav, HeroStill, Marquee, HorizontalShowcase, Coverage, Contact, Footer */

/* ============================================================
   DIRECTION 3A — HORIZONTAL STORYTELLING EXPERIENCE
   Stillframe hero (unchanged) → marquee → pinned horizontal journey
   (Intro · Capabilities · Numbers · Story · Process · Lanes)
   → Coverage → Contact → Footer.
   ============================================================ */
function AppHorizontal(){
  return (
    <React.Fragment>
      <Nav lightHero={false}/>
      <HeroStill/>
      <Marquee dark={true} items={['Refrigerated Freight','Produce & Food-Grade','Temperature-Controlled','Turlock · California','Cold Chain, Handled','Since 2003']}/>
      <HorizontalShowcase/>
      <Coverage/>
      <Contact/>
      <Footer/>
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppHorizontal/>);
