import {normalize,uid} from '../utils/helpers.js';
const cleanName=s=>String(s||'').trim().replace(/^[-•*\d.)\s]+/,'').replace(/["“”]/g,'').trim();
function polarityOf(s){const m=String(s).match(/[（(\[]\s*([+＋\-−–])\s*[)）\]]\s*$/);if(!m)return '+';return m[1]==='+'||m[1]==='＋'?'+':'-';}
function parseBlock(lines){let name='Modelo sin título',description='',category='General',section='',variables=[],relations=[],errors=[];for(let i=0;i<lines.length;i++){const raw=lines[i].trim();if(!raw)continue;const nm=raw.match(/^nombre\s*:\s*(.+)$/i);if(nm){name=nm[1].trim();continue;}if(/^variables\s*:?$/i.test(raw)){section='variables';continue;}if(/^relaciones(?:\s+causales)?\s*:?$/i.test(raw)){section='relations';continue;}const desc=raw.match(/^descripci[oó]n\s*:\s*(.+)$/i);if(desc){description=desc[1].trim();continue;}const cat=raw.match(/^categor[ií]a\s*:\s*(.+)$/i);if(cat){category=cat[1].trim();continue;}const relation=raw.match(/^(.+?)\s*(?:->|→|⟶|-->|=>)\s*(.+?)(?:\s*[（(\[]\s*([+＋\-−–])\s*[)）\]])?\s*$/);if(relation){const source=cleanName(relation[1]),target=cleanName(relation[2]),p=relation[3];if(!source||!target){errors.push(`Línea ${i+1}: relación incompleta.`);continue;}relations.push({source,target,polarity:p==='-'||p==='−'||p==='–'?'-':'+'});section='relations';continue;}if(section==='variables'){const v=cleanName(raw);if(v)variables.push(v);}else if(section==='relations'){errors.push(`Línea ${i+1}: no se reconoce «${raw}». Usa A -> B (+).`);}else{const v=cleanName(raw);if(v&&!/^(variables|relaciones)$/i.test(v))variables.push(v);}}
  const warnings=[],fold=v=>normalize(v).normalize('NFD').replace(/[\u0300-\u036f]/g,''),STOP=new Set(['de','del','la','el','los','las','por','en','y','a','un','una']),toks=v=>fold(v).split(' ').filter(t=>t&&!STOP.has(t)),declared=variables.slice();
  const resolve=name=>{if(!declared.length)return name;const exact=declared.find(d=>fold(d)===fold(name));if(exact)return exact;const t=toks(name);if(!t.length)return name;const c=declared.filter(d=>{const dt=toks(d);return t.every(x=>dt.includes(x));});if(c.length===1){const w=`«${name}» se interpretó como «${c[0]}».`;if(!warnings.includes(w))warnings.push(w);return c[0];}return name;};
  relations.forEach(r=>{r.source=resolve(r.source);r.target=resolve(r.target);});
  const all=[...variables,...relations.flatMap(r=>[r.source,r.target])],unique=new Map();for(const value of all){const key=normalize(value);if(key&&!unique.has(key))unique.set(key,value);}variables=[...unique.values()];const vars=variables.map(name=>({id:uid('var'),name,description:'',type:'general',color:'#dceafe',size:128,x:null,y:null}));const idByName=new Map(vars.map(v=>[normalize(v.name),v.id]));const edges=[];const seen=new Set();for(const r of relations){const key=`${normalize(r.source)}|${normalize(r.target)}|${r.polarity}`;if(seen.has(key))continue;seen.add(key);edges.push({id:uid('rel'),source:idByName.get(normalize(r.source)),target:idByName.get(normalize(r.target)),polarity:r.polarity,description:'',delay:'',color:r.polarity==='-'?'#d66c73':'#249b7a',width:2,lineStyle:'bezier',label:''});}if(!relations.length&&variables.length===0)errors.push('No se encontraron variables ni relaciones.');return{project:{name,description,category,variables:vars,relationships:edges},errors,warnings};}

const SEP=/^\s*([-=*_~]{3,})\s*$/,NAME=/^\s*nombre\s*:/i;
/** Acepta uno o varios modelos pegados juntos: ignora separadores (---) y el texto previo al primer «Nombre:». */
export function parseTextModel(text,index=0){
  const lines=String(text||'').split(/\r?\n/).filter(l=>!SEP.test(l));
  const starts=lines.map((l,i)=>NAME.test(l)?i:-1).filter(i=>i>=0);
  if(starts.length<2){const r=parseBlock(starts.length?lines.slice(starts[0]):lines);r.models=[];return r;}
  const blocks=starts.map((st,i)=>lines.slice(st,starts[i+1]??lines.length));
  const models=blocks.map(b=>b[0].replace(NAME,'').trim()||'Modelo');
  const i=Math.min(Math.max(0,index),blocks.length-1),r=parseBlock(blocks[i]);
  r.models=models;r.modelIndex=i;
  r.warnings=[`Se detectaron ${blocks.length} modelos; se mostrará uno a la vez.`,...r.warnings];
  return r;
}
