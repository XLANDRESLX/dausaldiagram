import test from 'node:test';
import assert from 'node:assert/strict';
import {detectFeedbackLoops} from '../assets/js/modules/feedback-loops.js';
const vars=['A','B','C','D'].map(id=>({id,name:id}));
const edge=(id,source,target,polarity='+')=>({id,source,target,polarity});
test('detecta un ciclo reforzador con signos positivos',()=>{const r=detectFeedbackLoops(vars,[edge('1','A','B'),edge('2','B','C'),edge('3','C','A')]);assert.equal(r.cycles.length,1);assert.equal(r.cycles[0].type,'R');});
test('detecta un ciclo compensador con un signo negativo',()=>{const r=detectFeedbackLoops(vars,[edge('1','A','B'),edge('2','B','C','-'),edge('3','C','A')]);assert.equal(r.cycles.length,1);assert.equal(r.cycles[0].type,'B');});
test('no repite el mismo ciclo por rotaciones',()=>{const r=detectFeedbackLoops(vars,[edge('1','A','B'),edge('2','B','C'),edge('3','C','A')]);assert.equal(r.cycles.length,1);});
test('enumera ciclos diferentes y limita la salida',()=>{const r=detectFeedbackLoops(vars,[edge('1','A','B'),edge('2','B','A'),edge('3','A','C'),edge('4','C','A')],{limit:1});assert.equal(r.cycles.length,1);assert.equal(r.truncated,true);});
test('reconoce un auto-bucle como ciclo simple',()=>{const r=detectFeedbackLoops(vars,[edge('1','A','A','-')]);assert.equal(r.cycles.length,1);assert.equal(r.cycles[0].type,'B');});

test('descarta regiones acíclicas sin enumerar caminos como ciclos',()=>{const many=Array.from({length:60},(_,i)=>({id:`N${i}`,name:`N${i}`}));const edges=[];for(let i=0;i<many.length;i++)for(let j=i+1;j<many.length;j++)edges.push(edge(`${i}-${j}`,`N${i}`,`N${j}`));const r=detectFeedbackLoops(many,edges);assert.equal(r.cycles.length,0);assert.equal(r.truncated,false);});
