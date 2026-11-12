import test from 'node:test';
import assert from 'node:assert/strict';
import {validateGraph} from '../assets/js/modules/validation.js';
test('valida relaciones con variables existentes',()=>{const r=validateGraph([{id:'a',name:'A'},{id:'b',name:'B'}],[{id:'x',source:'a',target:'b',polarity:'+'}]);assert.equal(r.valid,true);});
test('detecta referencias rotas',()=>{const r=validateGraph([{id:'a',name:'A'}],[{id:'x',source:'a',target:'b',polarity:'+'}]);assert.equal(r.valid,false);});
