export const APP_NAME='CausalDiagram Studio';
export const DEFAULT_PROJECT=()=>({id:null,name:'Modelo sin título',description:'',category:'General',variables:[],relationships:[],settings:{layout:'cose',grid:true,showCycleLabels:true,maxCycles:250,background:'#ffffff'},cycles:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
export const VARIABLE_TYPES={general:'General',stock:'Nivel / Stock',flow:'Flujo',auxiliary:'Auxiliar',external:'Factor externo'};
export const COLORS={positive:'#249b7a',negative:'#d66c73',reinforcing:'#1a9b78',balancing:'#4d78cf'};
export const MAX_CYCLES=250;
