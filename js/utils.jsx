/* global React */
const { useRef, useEffect, useState, useCallback } = React;

/* ---- Intersection-based reveal: adds .in when element enters viewport ---- */
function useInView(opts){
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ setSeen(true); io.unobserve(el); } });
    }, { threshold: (opts&&opts.threshold)||0.18, rootMargin:(opts&&opts.rootMargin)||'0px 0px -8% 0px' });
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return [ref, seen];
}

/* Reveal wrapper */
function Reveal({ children, className='', as='div', delay=0, variant='reveal', style={}, ...rest }){
  const [ref, seen] = useInView();
  const Tag = as;
  return (
    <Tag ref={ref} className={`${variant} ${seen?'in':''} ${className}`}
         style={{ transitionDelay: seen? `${delay}ms`:'0ms', ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* Staggered container: children animate in sequence */
function Stagger({ children, className='', step=90, as='div', ...rest }){
  const [ref, seen] = useInView({ threshold:0.12 });
  const Tag = as;
  const arr = React.Children.toArray(children);
  return (
    <Tag ref={ref} data-stagger className={`${seen?'in':''} ${className}`} {...rest}>
      {arr.map((c,i)=> React.cloneElement(c, {
        key:i,
        style:{ ...(c.props.style||{}), transitionDelay: seen?`${i*step}ms`:'0ms' }
      }))}
    </Tag>
  );
}

/* Magnetic hover for buttons */
function useMagnetic(strength=0.32){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if(window.matchMedia('(hover: none)').matches) return;
    const move = (e)=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
    };
    const leave = ()=>{ el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return ()=>{ el.removeEventListener('mousemove',move); el.removeEventListener('mouseleave',leave); };
  },[strength]);
  return ref;
}

function Magnetic({ children, className='', strength, ...rest }){
  const ref = useMagnetic(strength);
  return <span ref={ref} className={className} style={{ display:'inline-flex', transition:'transform .35s cubic-bezier(0.22,1,0.36,1)' }} {...rest}>{children}</span>;
}

/* smooth anchor scroll */
function scrollToId(id){
  const el = document.getElementById(id);
  if(el){ window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior:'smooth' }); }
}

const Arrow = ({size=16})=>(
  <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);

Object.assign(window, { useInView, Reveal, Stagger, useMagnetic, Magnetic, scrollToId, Arrow });
