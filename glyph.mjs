const NS = 'http://www.w3.org/2000/svg';
const CX = 300;
const CY = 300;
const ORIGIN = 80;
const END = 205;
const LABEL_RADIUS = 275;
const ANGLES = [-90, -18, 54, 126, 198];
const AXES = [
  ['title', 'Title'],
  ['budget', 'Budget'],
  ['process', 'Process link'],
  ['updated', 'Update date'],
  ['sector', 'Sector'],
];
const COLORS = { primary: '#D60000', compare: '#58707B', ink: '#2C4143', muted: '#58707B' };

const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
const point = (radius, degrees) => {
  const angle = degrees * Math.PI / 180;
  return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius };
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function axisValues(profile) {
 return AXES.map(([id,label],i)=>{const raw=profile?.axes?.[i],count=raw?.count,total=raw?.total;const valid=typeof count==='number'&&Number.isFinite(count)&&count>=0&&typeof total==='number'&&Number.isFinite(total)&&total>0&&count<=total;return {id,label,count:valid?count:null,total:valid?total:null}});
}

/** Return the intentionally small, stable data contract used by the glyph. */
export function normalizeDescriptor(profile) {
  const available = Boolean(profile?.available);
  return {
    id: String(profile?.id ?? ''),
    label: String(profile?.name ?? profile?.label ?? profile?.id ?? ''),
    available,
    recordCount: Number.isFinite(Number(profile?.recordCount)) ? Number(profile.recordCount) : 0,
    axes: available ? axisValues(profile) : AXES.map(([id, label]) => ({ id, label, count: null, total: null })),
  };
}

function series(descriptor) {
  return descriptor.axes.map((axis, i) => {
    const percent = axis.count == null || axis.total == null || axis.total <= 0
      ? null : clamp(axis.count / axis.total, 0, 1);
    const radius = percent == null ? null : ORIGIN + percent * (END - ORIGIN);
    return { axisId: axis.id, angle: ANGLES[i], count: axis.count, total: axis.total, percent, radius, point: radius == null ? null : point(radius, ANGLES[i]) };
  });
}

/** Pure geometry: no DOM, timing, or rendering state. */
export function calculateGlyphGeometry(profile, compare = null) {
  const primary = normalizeDescriptor(profile);
  const secondary = compare ? normalizeDescriptor(compare) : null;
  return {
    primary: series(primary),
    compare: secondary ? series(secondary) : null,
    available: primary.available,
    compareAvailable: Boolean(secondary?.available),
    center: { x: CX, y: CY, radius: 72 },
  };
}

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
  return el;
};
const textEl = (value, attrs = {}) => {
  const el = svgEl('text', attrs); el.textContent = value; return el;
};
const pct = value => value == null || !Number.isFinite(value) ? 'Unavailable' : value>0&&value<.001 ? '<0.1%' : `${(value*100).toFixed(value===0||value===1?0:1)}%`;
const readout = item => item.count == null ? 'Unavailable' : `${item.count}/${item.total} · ${pct(item.total>0&&item.count!=null?item.count/item.total:null)}`;

export function createGlyph(container, { onInspect } = {}) {
  if (!container || typeof container.appendChild !== 'function') throw new TypeError('A container element is required');
  const svg = svgEl('svg', { viewBox: '-40 -40 680 680', width: '100%', role: 'group', 'aria-label': 'Disclosure profile' });
  svg.style.display = 'block'; svg.style.maxWidth = '590px'; svg.style.margin = '0 auto'; svg.style.overflow = 'visible';
  const root = svgEl('g'); svg.appendChild(root); container.appendChild(svg);
  let frame = 0; let current = null; let focusIndex = -1;

  const clear = () => { while (root.firstChild) root.removeChild(root.firstChild); };
  const add = (el, parent = root) => { parent.appendChild(el); return el; };
  const describe = (descriptor, item) => `${descriptor.label}, ${item.label}: ${readout(item)}`;
  const animate = (from, to, paint) => {
    cancelAnimationFrame(frame);
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { paint(to, false); return; }
    const start = performance.now();
    const tick = now => { const t = clamp((now - start) / 600, 0, 1); const eased = t * (2 - t); paint(from.map((v, i) => v + (to[i] - v) * eased), t < 1); if (t < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
  };

  function draw(profile, compare, previous) {
    clear();
    const primary = normalizeDescriptor(profile); const secondary = primary.available && compare ? normalizeDescriptor(compare) : null;
    svg.setAttribute('aria-label', `${primary.label || 'Publisher'} disclosure profile`);
    const tracks = add(svgEl('g', { 'aria-hidden': 'true' }));
    ANGLES.forEach((angle, i) => {
      const outer = point(END, angle); const inner = point(ORIGIN, angle);
      add(svgEl('line', { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, stroke: '#D9E0E0', 'stroke-width': 2 }), tracks);
      for (let tick = 1; tick <= 4; tick++) { const p = point(ORIGIN + tick * (END - ORIGIN) / 4, angle); add(svgEl('circle', { cx: p.x, cy: p.y, r: 2, fill: '#B9C7C9' }), tracks); }
      if (primary.available) {
        const labelPoint = point(LABEL_RADIUS, angle);
        add(textEl(AXES[i][1], { x: labelPoint.x, y: labelPoint.y - 22, fill: COLORS.ink, 'font-size': 18, 'font-family': 'ui-sans-serif,system-ui,sans-serif', 'font-weight': 650, 'text-anchor': 'middle' }), tracks);
        add(textEl(primary.axes[i].count == null ? 'Unavailable' : pct(primary.axes[i].count / primary.axes[i].total)+(secondary?.available?' / '+pct(secondary.axes[i].count/secondary.axes[i].total):''), { x: labelPoint.x, y: labelPoint.y, fill: COLORS.ink, 'font-size': secondary?.available?22:28, 'font-family': 'Georgia,serif', 'text-anchor': 'middle' }), tracks);
        add(textEl(primary.axes[i].count == null ? '' : `${primary.axes[i].count}/${primary.axes[i].total}`+(secondary?.available?(secondary.axes[i].count==null?' · unavailable':` · ${secondary.axes[i].count}/${secondary.axes[i].total}`):''), { x: labelPoint.x, y: labelPoint.y + 19, fill: COLORS.muted, 'font-size': 14, 'font-family': 'ui-sans-serif,system-ui,sans-serif', 'text-anchor': 'middle' }), tracks);
      }
    });
    add(svgEl('circle', { cx: CX, cy: CY, r: 72, fill: 'none', stroke: '#D9E0E0', 'stroke-width': 1.5, 'stroke-dasharray': '3 5' }), tracks);
    const reveals={primary:[],compare:[]};
    const drawSeries = (descriptor, key, values, offset) => {
      if (!descriptor?.available) return;
      values.forEach((item, i) => {
        if (item.radius == null) return;
        const arm=add(svgEl('g',{transform:`translate(${CX} ${CY}) rotate(${ANGLES[i]}) translate(0 ${offset})`,'aria-hidden':'true'}));
        arm.style.pointerEvents='auto';arm.style.cursor='pointer';arm.addEventListener('click',()=>onInspect?.({publisherId:descriptor.id,axisId:item.axisId}));
        const clip=svgEl('clipPath',{id:`reveal-${key}-${i}`});
        const reveal=svgEl('rect',{x:ORIGIN,y:-16,width:Math.max(0,item.radius-ORIGIN),height:32});clip.appendChild(reveal);arm.appendChild(clip);reveals[key][i]=reveal;
        const filled=svgEl('g',{'clip-path':`url(#reveal-${key}-${i})`});
        for(let j=0;j<20;j++){const attrs={x:ORIGIN+j*6.25,y:-10,width:4.75,height:20,rx:2};arm.appendChild(svgEl('rect',{...attrs,fill:'#bdc9c333'}));filled.appendChild(svgEl('rect',{...attrs,fill:COLORS[key]}));}arm.appendChild(filled);
        const guide=svgEl('line',{x1:ORIGIN,y1:0,x2:item.radius,y2:0,stroke:'none','data-axis':item.axisId,'data-series':key});arm.appendChild(guide);
      });
    };
    const geo = calculateGlyphGeometry(profile, compare);
    drawSeries(primary, 'primary', geo.primary, secondary?.available?-14:0); drawSeries(secondary, 'compare', geo.compare || [], 14);
    if (!primary.available) add(textEl('Publication profile unavailable', { x: CX, y: CY + 125, fill: COLORS.ink, 'font-size': 15, 'font-family': 'ui-sans-serif,system-ui,sans-serif', 'text-anchor': 'middle', 'font-weight': 700 }));
    if (secondary && !secondary.available) add(textEl('Comparison unavailable', { x: CX, y: CY + 145, fill: COLORS.muted, 'font-size': 12, 'font-family': 'ui-sans-serif,system-ui,sans-serif', 'text-anchor': 'middle' }));
    const hit = add(svgEl('g', { role: 'group', 'aria-label': 'Inspect disclosure dimensions' }));
    primary.axes.forEach((axis, i) => {
      const p = point(LABEL_RADIUS, ANGLES[i]); const button = add(svgEl('circle', { cx: p.x, cy: p.y, r: 50, fill: 'transparent', tabindex: 0, role: 'button', 'aria-label': describe(primary, axis)+(secondary?'; '+describe(secondary,secondary.axes[i]):''), 'data-axis-id': axis.id }), hit);
      button.style.cursor = 'pointer'; button.addEventListener('mouseenter', () => button.setAttribute('fill', '#D6000018')); button.addEventListener('mouseleave', () => button.setAttribute('fill', 'transparent'));
      const inspect = () => onInspect?.({ publisherId: primary.id, axisId: axis.id });
      button.addEventListener('click', inspect); button.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inspect(); } });
    });
    cancelAnimationFrame(frame);
    const target={primary:geo.primary.map(x=>x.radius??ORIGIN),compare:geo.compare?geo.compare.map(x=>x.radius??ORIGIN):Array(5).fill(ORIGIN)};
    const from={primary:previous?.primary||target.primary.map(()=>ORIGIN),compare:previous?.compare?.length?previous.compare:target.compare.map(()=>ORIGIN)};
    current={primary,compare:secondary,geometry:geo,display:from};
    const paint=values=>{current.display={primary:values.slice(0,5),compare:values.slice(5)};for(const key of ['primary','compare'])current.display[key].forEach((radius,i)=>{reveals[key][i]?.setAttribute('width',Math.max(0,radius-ORIGIN));root.querySelector(`line[data-series="${key}"][data-axis="${AXES[i][0]}"]`)?.setAttribute('x2',radius)});};
    const start=[...from.primary,...from.compare],end=[...target.primary,...target.compare];paint(start);animate(start,end,paint);

  }
  return { update(profile, compare = null) { const previous = current?.display; draw(profile, compare, previous); }, destroy() { cancelAnimationFrame(frame); svg.remove(); current = null; } };
}

export { AXES };
