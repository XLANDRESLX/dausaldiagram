import {DEFAULT_PROJECT} from './utils/constants.js';
import {clone,uid,timestamp} from './utils/helpers.js';
let project=DEFAULT_PROJECT();
const listeners=new Set();
export function getProject(){return project;}
export function setProject(next){const defaults=DEFAULT_PROJECT();const incoming=clone(next);project={...defaults,...incoming,settings:{...defaults.settings,...(incoming.settings||{})},id:incoming.id||uid('project'),updatedAt:timestamp()};emit('project');}
export function patchProject(patch){project={...project,...patch,updatedAt:timestamp()};emit('project');}
export function addVariable(data){const variable={id:uid('var'),name:data.name.trim(),description:data.description||'',type:data.type||'general',color:data.color||'#dceafe',size:data.size||128,x:data.x??null,y:data.y??null};project.variables.push(variable);touch('variables');return variable;}
export function updateVariable(id,patch){const v=project.variables.find(x=>x.id===id);if(!v)return false;Object.assign(v,patch);touch('variables');return true;}
export function updatePositions(positions){for(const v of project.variables){const p=positions[v.id];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){v.x=Math.round(p.x*100)/100;v.y=Math.round(p.y*100)/100;}}touch('positions');}
export function removeVariable(id){project.variables=project.variables.filter(x=>x.id!==id);project.relationships=project.relationships.filter(e=>e.source!==id&&e.target!==id);touch('variables');}
export function addRelationship(data){const edge={id:uid('rel'),source:data.source,target:data.target,polarity:data.polarity==='-'?'-':'+',description:data.description||'',delay:data.delay||'',color:data.color||(data.polarity==='-'?'#d66c73':'#249b7a'),width:data.width||2,lineStyle:data.lineStyle||'bezier',label:data.label||''};project.relationships.push(edge);touch('relationships');return edge;}
export function updateRelationship(id,patch){const e=project.relationships.find(x=>x.id===id);if(!e)return false;Object.assign(e,patch);touch('relationships');return true;}
export function removeRelationship(id){project.relationships=project.relationships.filter(x=>x.id!==id);touch('relationships');}
export function replaceGraph({variables,relationships,name,description,category}){project.variables=variables;project.relationships=relationships;if(name!==undefined)project.name=name;if(description!==undefined)project.description=description;if(category!==undefined)project.category=category;touch('graph');}
export function setCycles(cycles){project.cycles=cycles;emit('cycles');}
export function setSetting(key,value){project.settings={...project.settings,[key]:value};touch('settings');}
export function touch(reason='change'){project.updatedAt=timestamp();emit(reason);}
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
function emit(reason){for(const fn of listeners)fn(project,reason);}
export function snapshot(){return clone(project);}
