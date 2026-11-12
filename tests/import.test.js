import test from 'node:test';
import assert from 'node:assert/strict';
import {validateImportedProject} from '../assets/js/modules/import-manager.js';
test('normaliza un proyecto JSON importado y conserva coordenadas nulas',()=>{const p=validateImportedProject({name:'Prueba',variables:[{id:'a',name:'A',x:null,y:null},{id:'b',name:'B',x:10,y:20}],relationships:[{id:'e1',source:'a',target:'b',polarity:'−',lineStyle:'dashed'}]});assert.equal(p.variables[0].x,null);assert.equal(p.variables[1].x,10);assert.equal(p.relationships[0].polarity,'-');assert.equal(p.relationships[0].lineStyle,'dashed');});
test('rechaza referencias a variables inexistentes',()=>{assert.throws(()=>validateImportedProject({variables:[{id:'a',name:'A'}],relationships:[{source:'a',target:'missing'}]}),/variable inexistente/);});
test('rechaza identificadores repetidos de variables',()=>{assert.throws(()=>validateImportedProject({variables:[{id:'a',name:'A'},{id:'a',name:'B'}],relationships:[]}),/duplicado/);});
