export const uid = (prefix='id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export const clone = value => JSON.parse(JSON.stringify(value));
export const normalize = value => String(value ?? '').trim().replace(/\s+/g,' ').toLocaleLowerCase('es');
export const safeFileName = value => String(value || 'diagrama').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-_]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'diagrama';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const timestamp = () => new Date().toISOString();
export const formatDate = value => { try { return new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)); } catch { return 'Fecha desconocida'; } };
export function downloadBlob(blob, filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function hexToRgba(hex,alpha=1){const raw=hex.replace('#','');const bigint=parseInt(raw.length===3?raw.split('').map(c=>c+c).join(''):raw,16);return `rgba(${(bigint>>16)&255},${(bigint>>8)&255},${bigint&255},${alpha})`;}

export const cycleLabels=cycles=>{const n={R:0,B:0};return (cycles||[]).map(c=>({...c,label:`${c.type}${++n[c.type]}`}));};
