import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTextModel} from '../assets/js/modules/text-parser.js';
import {parseTableModel} from '../assets/js/modules/table-parser.js';
import {parseNaturalLanguage} from '../assets/js/modules/natural-language-parser.js';
test('interpreta texto con variables y relaciones',()=>{const p=parseTextModel('Nombre: Población\nVariables:\nPoblación\nNacimientos\nRelaciones:\nPoblación -> Nacimientos (+)\nNacimientos -> Población (+)');assert.equal(p.project.name,'Población');assert.equal(p.project.variables.length,2);assert.equal(p.project.relationships.length,2);});
test('normaliza duplicados de variables por mayúsculas y espacios',()=>{const p=parseTextModel('Variables:\nPoblación\n población  \nRelaciones:\nPoblación -> Población (+)');assert.equal(p.project.variables.length,1);});
test('parsea tabla separada por tabulaciones',()=>{const p=parseTableModel('Variable origen\tVariable destino\tPolaridad\nA\tB\t+\nB\tA\t-');assert.equal(p.project.variables.length,2);assert.equal(p.project.relationships.length,2);assert.equal(p.project.relationships[1].polarity,'-');});
test('infiere las tres relaciones de la descripción del ejemplo',()=>{const p=parseNaturalLanguage('La población aumenta cuando hay más nacimientos. Los decesos reducen la población. Una mayor población disminuye los recursos disponibles.');assert.equal(p.project.relationships.length,3);assert.equal(p.warnings.length,0);});
