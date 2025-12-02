import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background-color", "transparent");

    // Generate random nodes
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      r: Math.random() * 3 + 2,
      x: Math.random() * width,
      y: Math.random() * height
    }));

    // Generate random links
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
        const targets = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < targets; j++) {
            const target = Math.floor(Math.random() * nodes.length);
            if (target !== i) {
                links.push({ source: nodes[i], target: nodes[target] });
            }
        }
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(10));

    const link = svg.append("g")
      .attr("stroke", "#00f3ff")
      .attr("stroke-opacity", 0.3)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr("stroke", "#00f3ff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.r)
      .attr("fill", "#050a14");

    // Pulsing effect helper
    const pulse = () => {
        node.transition()
            .duration(2000)
            .attr("r", (d) => d.r * 1.5)
            .attr("stroke-opacity", 0.8)
            .transition()
            .duration(2000)
            .attr("r", (d) => d.r)
            .attr("stroke-opacity", 1)
            .on("end", pulse);
    };
    pulse();

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    // Interaction
    const drag = (sim: any) => {
        function dragstarted(event: any) {
            if (!event.active) sim.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) sim.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    node.call(drag(simulation) as any);

    return () => {
        simulation.stop();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 border-l border-blue-term/20 bg-black/40">
        <h2 className="text-blue-term font-mono text-lg font-bold border-b border-blue-term/50 pb-2">NODE TOPOLOGY</h2>
        <div className="flex-1 w-full h-full relative overflow-hidden">
            <svg ref={svgRef} className="w-full h-full absolute inset-0" />
        </div>
        <div className="mt-2 text-xs font-mono text-blue-term/60">
            STATUS: MAPPING NODES...
        </div>
    </div>
  );
};

export default NetworkMap;