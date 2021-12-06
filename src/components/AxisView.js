import React, { useState, useRef, useEffect } from "react";
import attr from '../data/attr.json';
import * as d3 from "d3";

import ProjectionView from "./ProjectionView";

const AxisView = (props) => {

    const plotStyle = {
        display: "flex",
        marginTop: "20px",
        marginLeft: "10px"
    }
    
    const width = 300;
    const height = 550;
    const margin = 30;
    const svgWidth = width + margin;
    const svgHeight = height + margin;
    const radius = 90;
    const legendViewEdge = 160;

    const axisViewSvg = useRef(null);
    
    const [attrIdx, setAttrIdx] = useState(0);
    const [attrVec, setAttrVec] = useState([svgWidth/2+radius*Math.cos(0), svgWidth/2 + radius*Math.sin(0)]);

    function degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    // var angularScale = d3.scale.linear().range([0,360]).domain([0,total]);

    useEffect(()=>{
        const svg = d3.select(axisViewSvg.current);

        svg.append("circle")
            .classed('ring', true)
            .attr("transform", `translate(${svgWidth/2}, ${svgWidth/2})`)
            .attr('r', radius)
            .attr('stroke', '#767474')
            .style("stroke-dasharray", ("3,1"))
            .attr('fill', 'white');

        let angle = degrees_to_radians(360/attr.length);
        const lines = attr.forEach((d,i)=>svg.append('line')
                                .attr('class', 'circledAxis'+i)
                                .classed('axis', true)
                                .style("stroke", "black")
                                .attr("x1", svgWidth/2)
                                .attr("y1", svgWidth/2)
                                .attr("x2", svgWidth/2 + radius*Math.cos(i*angle))
                                .attr("y2", svgWidth/2 + radius*Math.sin(i*angle))
                                )

        const circles = attr.forEach((d,i)=>svg.append('circle')
                                .attr('class', 'circledAxis'+i)
                                .classed('axis', true)
                                .style("stroke", "black")
                                .attr("r", 5)
                                .attr("cx", svgWidth/2 + radius*Math.cos(i*angle))
                                .attr("cy", svgWidth/2 + radius*Math.sin(i*angle))
                                .on("mouseenter", (data, idx) => {
                                                        svg.selectAll('.circledAxis'+i)
                                                        .style('fill', 'red')
                                                        .style("stroke", 'red');

                                                        svg.selectAll('.circledAxisText'+i)
                                                        .style('fill', 'red');
                                                    }
                                )
                                .on("mouseleave", (data, idx) => {
                                                        svg.selectAll('.circledAxis'+i)
                                                        .style('fill', 'black')
                                                        .style("stroke", 'black');

                                                        svg.selectAll('.circledAxisText'+i)
                                                        .style('fill', 'black');
                                                    }
                                )
                            )

        for(let i=0; i<attr.length; i++) {
            if(i < attr.length/4 || i > attr.length*3/4) {
                svg.append('text')
                            .attr('class', 'circledAxisText'+i)
                            .classed('axis', true)
                            .attr('transform', `translate(${svgWidth/2 + radius*Math.cos(i*angle)+margin}, ${svgWidth/2 + radius*Math.sin(i*angle)})`)
                            .text(attr[i])
            }
            else {
                svg.append('text')
                            .attr('class', 'circledAxisText'+i)
                            .classed('axis', true)
                            .attr('transform', `translate(${svgWidth/3+radius*Math.cos(i*angle)-margin/2}, ${svgWidth/2 + radius*Math.sin(i*angle)})`)
                            .text(attr[i])
            }
        }
        svg.selectAll('.axis').attr('font-size', 12).attr('font-family', 'Times New Roman');
        
        const legendView = svg.append("rect")
                            .classed('legendView', true)
                            .attr("transform", `translate(${margin}, ${svgHeight-legendViewEdge})`)
                            .attr('width', legendViewEdge)
                            .attr('height', legendViewEdge)
                            .attr('stroke', '#767474');
        
        const space=10;
        svg.append("text")
                .attr("transform", `translate(${margin}, ${svgHeight-legendViewEdge+space})`)
                .classed('legendText', true)
                .text("Missing Neighbors")
        svg.append("text")
                .attr("transform", `translate(${svgWidth/2}, ${svgHeight-legendViewEdge+space})`)
                .classed('legendText', true)
                .text("Both")
        svg.append("text")
                .attr("transform", `translate(${svgWidth/3}, ${svgHeight-space})`)
                .classed('legendText', true)
                .text("False Neighbors")
        svg.append("text")
                .attr("transform", `translate(${3*space}, ${svgHeight-space})`)
                .classed('legendText', true)
                .text("No Distortions");
        svg.selectAll('.legendText').attr('font-size', 11);
                
        
        /* Enable mouse drag. */
        const drag = d3.drag()
               .on("start", function(event, d){d3.select(this).raise().classed("active", true);})
               .on("drag", dragged)
               .on("end",  function(event, d) {d3.select(this).classed("active", false);
                                                setAttrVec([event.x, event.y])} );


        function dragged(event, d) {
            d3.selectAll('.moved').remove();

            d3.select(this).raise().classed("active", true);
            var x = event.x-svgWidth/2;
            var y = event.y-svgWidth/2;
            var newAngle = Math.atan2( y , x ) * 180 / Math.PI ; //radian to degree
  	        // if(newAngle<0) newAngle = 360 + newAngle;
            console.log(newAngle)
            d3.select(this)
                            .attr('transform', `translate(0, 0)`).attr("cx", event.x).attr("cy", event.y)
                            .classed('moved', true);

            let lineClass = String(d3.select(this).attr('class'));
            lineClass = lineClass.split(' ')[0];

            d3.select('line.'+lineClass).attr('transform', `rotate(${newAngle})`)
            .attr('transform', `translate(0, 0)`).attr("x2", event.x).attr("y2",event.y);
            setAttrIdx(Number(lineClass.substr(-1)));
        } 

        svg.selectAll('.axis').call(drag);


    })



	return (
    <div style={plotStyle} >
        <ProjectionView attrTypes={attr} attrIndex={attrIdx} attrVector={attrVec}/>
        <svg ref={axisViewSvg} width={svgWidth} height={svgHeight}></svg>
    </div>
	)
};

export default AxisView;
