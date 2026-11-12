export function applyLayout(cy,name='cose',onComplete=()=>{}){
 if(!cy||!cy.nodes().length)return;
 if(name==='manual'){onComplete(cy);return;}
 const eles=cy.elements().filter(e=>!e.data('isCycleMarker'));
 const options={name,animate:false,fit:true,padding:65};
 if(name==='cose')Object.assign(options,{randomize:true,idealEdgeLength:()=>210,nodeRepulsion:()=>900000,nodeOverlap:80,edgeElasticity:()=>100,gravity:.3,componentSpacing:140,numIter:1500,initialTemp:300,coolingFactor:.95,minTemp:1});
 if(name==='circle')Object.assign(options,{radius:undefined,startAngle:-Math.PI/2, sweep:Math.PI*2, clockwise:true,avoidOverlap:true,spacingFactor:1.3});
 if(name==='breadthfirst')Object.assign(options,{directed:true,spacingFactor:1.35,avoidOverlap:true,roots:eles.nodes().filter(n=>n.indegree()===0)});
 if(name==='concentric')Object.assign(options,{concentric:n=>n.degree(),levelWidth:()=>2,spacingFactor:1.25,avoidOverlap:true});
 const layout=eles.layout(options);layout.one('layoutstop',()=>onComplete(cy));layout.run();return layout;
}
