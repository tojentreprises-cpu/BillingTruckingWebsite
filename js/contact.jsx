/* global React, Reveal, Magnetic, Arrow */
const { useState:cState } = React;

/* ---------- CONTACT ---------- */
function Contact(){
  const [f, setF] = cState({ name:'', company:'', email:'', phone:'', type:'', pickup:'', delivery:'', details:'' });
  const [errs, setErrs] = cState({});
  const [sent, setSent] = cState(false);
  const set = (k)=> (e)=> setF(s=>({...s,[k]:e.target.value}));
  const validate = ()=>{
    const er = {};
    if(!f.name.trim()) er.name = 'Please enter your name';
    if(!f.email.trim()) er.email = 'Please enter your email';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = 'Enter a valid email';
    if(!f.type) er.type = 'Select a freight type';
    setErrs(er);
    return Object.keys(er).length===0;
  };
  const submit = (e)=>{ e.preventDefault(); if(validate()) setSent(true); };

  return (
    <section className="block" id="contact" data-screen-label="Contact">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow"><i className="tick"></i>Get In Touch</span>
            <Reveal as="h2" className="sec-title">Have a cold load<br/>that needs moving?</Reveal>
          </div>
          <Reveal className="sec-lead" delay={120}>Tell us about your freight and lanes. We'll get back to you with capacity and a rate — usually same day.</Reveal>
        </div>
        <div className="contact">
          <Reveal className="info">
            <div className="line"><div className="k">Phone</div><div className="v"><a href="tel:+12096788432">+1 (209) 678-8432</a><small>Dispatch &amp; quotes</small></div></div>
            <div className="line"><div className="k">Email</div><div className="v"><a href="mailto:billingtrucking@yahoo.com">billingtrucking@yahoo.com</a><small>We reply same business day</small></div></div>
            <div className="line"><div className="k">Based In</div><div className="v">Turlock, California<small>Serving the Central Valley &amp; the West</small></div></div>
            <div className="line"><div className="k">Registration</div><div className="v" style={{fontSize:18}}>USDOT 2207928<small>MC 766110 · CA 561164</small></div></div>
            <div className="cal">
              <div className="ic"><svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4M8 14h3"/></svg></div>
              <div className="t"><b>Prefer to book a call?</b><span>Calendly scheduling — link goes here.</span></div>
            </div>
          </Reveal>

          <Reveal className="form" delay={100}>
            {sent ? (
              <div className="form-success">
                <div className="check"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>
                <h3>Quote request sent.</h3>
                <p>Thanks, {f.name.split(' ')[0]||'there'}. We'll be in touch shortly about your {f.type? f.type.toLowerCase():'freight'}.</p>
                <button className="btn btn-ghost" style={{marginTop:24}} onClick={()=>{setSent(false);setF({name:'',company:'',email:'',phone:'',type:'',pickup:'',delivery:'',details:''});}}>Send another</button>
              </div>
            ) : (
            <form onSubmit={submit} noValidate>
              <div className="grid2">
                <div className={`field ${errs.name?'err':''}`}>
                  <label>Name *</label>
                  <input value={f.name} onChange={set('name')} placeholder="Jane Doe"/>
                  {errs.name && <div className="msg">{errs.name}</div>}
                </div>
                <div className="field">
                  <label>Company</label>
                  <input value={f.company} onChange={set('company')} placeholder="Acme Produce Co."/>
                </div>
              </div>
              <div className="grid2">
                <div className={`field ${errs.email?'err':''}`}>
                  <label>Email *</label>
                  <input type="email" value={f.email} onChange={set('email')} placeholder="jane@company.com"/>
                  {errs.email && <div className="msg">{errs.email}</div>}
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input value={f.phone} onChange={set('phone')} placeholder="(209) 555-0123"/>
                </div>
              </div>
              <div className={`field ${errs.type?'err':''}`}>
                <label>Freight Type *</label>
                <select value={f.type} onChange={set('type')}>
                  <option value="">Select freight type…</option>
                  <option>Refrigerated / Chilled</option>
                  <option>Frozen</option>
                  <option>Produce / Food-Grade</option>
                  <option>Multi-Temp</option>
                  <option>Other</option>
                </select>
                {errs.type && <div className="msg">{errs.type}</div>}
              </div>
              <div className="grid2">
                <div className="field"><label>Pickup</label><input value={f.pickup} onChange={set('pickup')} placeholder="Turlock, CA"/></div>
                <div className="field"><label>Delivery</label><input value={f.delivery} onChange={set('delivery')} placeholder="Seattle, WA"/></div>
              </div>
              <div className="field">
                <label>Load Details</label>
                <textarea value={f.details} onChange={set('details')} placeholder="Commodity, set-point temperature, weight, pickup window…"></textarea>
              </div>
              <Magnetic strength={0.18}><button type="submit" className="btn btn-primary submit">Send Quote Request <Arrow/></button></Magnetic>
            </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer({ onCycleHero }){
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="wrap">
        <div className="top">
          <div className="fbrand">
            <div className="mark">Billing<br/><b>Trucking Inc.</b></div>
            <p className="tl">Temperature-controlled freight out of Turlock, California. Produce, perishables and food-grade loads — hauled with the discipline a cold chain demands.</p>
          </div>
          <div className="reg">
            <div className="col">
              <h4>Sections</h4>
              <a onClick={()=>scrollToId('services')}>Capabilities</a>
              <a onClick={()=>scrollToId('about')}>Our Story</a>
              <a onClick={()=>scrollToId('coverage')}>Coverage</a>
              <a onClick={()=>scrollToId('contact')}>Request a Quote</a>
            </div>
            <div className="col">
              <h4>Contact</h4>
              <a href="tel:+12096788432">+1 (209) 678-8432</a>
              <a href="mailto:billingtrucking@yahoo.com">billingtrucking@yahoo.com</a>
              <p>Turlock, California</p>
            </div>
            <div className="col">
              <h4>Registration</h4>
              <p>USDOT 2207928</p>
              <p>MC 766110</p>
              <p>CA 561164</p>
            </div>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} Billing Trucking Inc. · All rights reserved</span>
          <span>Turlock, CA · Refrigerated Freight · Est. 2003</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Contact, Footer });
