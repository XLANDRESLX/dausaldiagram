/**
 * Enumerates simple directed cycles once. Tarjan SCC pruning keeps acyclic regions
 * out of the DFS, and the smallest vertex index is the canonical cycle start.
 */
export function detectFeedbackLoops(variables,relationships,{limit=250,maxDepth=variables.length}={}){
  const ids=variables.map(v=>v.id),index=new Map(ids.map((id,i)=>[id,i])),adj=ids.map(()=>[]);
  for(const edge of relationships){const a=index.get(edge.source),b=index.get(edge.target);if(a!==undefined&&b!==undefined)adj[a].push({to:b,edge});}
  // Strongly connected components (Tarjan).
  let nextIndex=0;const stack=[],onStack=new Set(),indices=new Array(ids.length).fill(-1),low=new Array(ids.length).fill(0),components=[];
  const strongConnect=v=>{indices[v]=low[v]=nextIndex++;stack.push(v);onStack.add(v);for(const item of adj[v]){const w=item.to;if(indices[w]===-1){strongConnect(w);low[v]=Math.min(low[v],low[w]);}else if(onStack.has(w))low[v]=Math.min(low[v],indices[w]);}if(low[v]===indices[v]){const component=[];let w;do{w=stack.pop();onStack.delete(w);component.push(w);}while(w!==v);components.push(component.sort((a,b)=>a-b));}};
  for(let v=0;v<ids.length;v++)if(indices[v]===-1)strongConnect(v);
  const cycles=[];let truncated=false;
  for(const component of components){if(truncated)break;const members=new Set(component);if(component.length===1&&!adj[component[0]].some(e=>e.to===component[0]))continue;
    for(const start of component){if(truncated)break;const visited=new Set([start]),pathNodes=[start],pathEdges=[];
      const dfs=current=>{if(cycles.length>=limit){truncated=true;return;}if(pathNodes.length>maxDepth)return;for(const item of adj[current]){if(!members.has(item.to))continue;if(item.to===start){const edges=[...pathEdges,item.edge],negatives=edges.filter(e=>e.polarity==='-').length;cycles.push({id:`cycle-${cycles.length+1}`,type:negatives%2===0?'R':'B',nodes:[...pathNodes.map(i=>ids[i])],edges:edges.map(e=>e.id),negativeCount:negatives,length:edges.length,variables:pathNodes.map(i=>variables[i]?.name||ids[i])});if(cycles.length>=limit){truncated=true;return;}continue;}if(item.to<start||visited.has(item.to))continue;visited.add(item.to);pathNodes.push(item.to);pathEdges.push(item.edge);dfs(item.to);pathEdges.pop();pathNodes.pop();visited.delete(item.to);if(truncated)return;}};
      dfs(start);
    }
  }
  return{cycles,truncated};
}
