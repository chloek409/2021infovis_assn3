import React, { useState, useRef, useEffect } from "react";
import attr from '../data/attr.json';
import raw from '../data/raw.json';
import * as d3 from "d3";

import {tnc} from '../functions/tnc';
import {colormap} from '../functions/colormap';


const ProjectionView = (props) => {
   
    const attributeIdx = props.attrIndex;
    const attributeVec = props.attrVector;
    console.log(attributeVec);
    const width = 450;
    const height = 550;
    const margin = 20;
    const svgWidth = width + margin;
    const svgHeight = height + margin+10;
    const scatterplotSvg = useRef(null);

    const divisor = Math.sqrt((attributeVec[0]*attributeVec[0] + attributeVec[1]*attributeVec[1]));
    const unitvec_x= Math.abs(attributeVec[0])/divisor;
    const unitvec_y = Math.abs(attributeVec[1])/divisor;
    console.log(unitvec_x, unitvec_y);
    const plotData = [];
    raw.forEach((arr, i)=> plotData.push([unitvec_x*d3.sum(arr), unitvec_y*d3.sum(arr)]) );
    
    const projected = [];
    const [projectedData, setProjectedData] = useState([]);
    raw.forEach(function(d) {
        d[attributeIdx] = 0;
        projected.push(d);
    });


    useEffect(()=>{

        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData, d=>d[0]), d3.max(plotData, d=>d[0])])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData, d=>d[1]), d3.max(plotData, d=>d[1])])
            .range([0,height]);

        const svg = d3.select(scatterplotSvg.current);
        svg.append('g')
            .selectAll('circle')
            .data(plotData)
            .join('circle')
            .classed('scatters', true)
            .attr('transform', `translate(${margin}, ${margin})`)
            .attr('r', 2)
            .attr('cx', d=>xScale(d[0]))
            .attr('cy', d=>yScale(d[1]))
            .attr('fill', 'white')
            .attr('stroke', "black");
        
    }, []);


    useEffect(()=>{
                
        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData, d=>d[0]), d3.max(plotData, d=>d[0])])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData, d=>d[1]), d3.max(plotData, d=>d[1])])
            .range([0,height]);

        const svg = d3.select(scatterplotSvg.current);
        svg.selectAll('circle')
            .data(plotData)
            .join('circle')
            .transition()
            .attr('cx', d=>xScale(d[0]))
            .attr('cy', d=>yScale(d[1]))
            .attr('fill', 'white')
            .attr('stroke', "black");

    }, [attributeIdx, attributeVec]);

    const [buttonClicked, setButtonClicked]=useState(false);
    
    const texts = ["Enable Checkviz!!", "Disable Checkviz!!"];
    const [buttonText, setButtonText]=useState(texts[0]);

    const svg = d3.select(scatterplotSvg.current);
    function handleOnClick() {
        if(!buttonClicked) {
            setButtonClicked(true);
            setButtonText(texts[1]);
            /* Enable Checkviz:
                1) tnc func로 각 data point에 대한 trustworthiness/continuity값을 구함.
                2) 각 data point의 trustworthiness/continuity값에 해당하는 color를 구함.
                3) data point의 Voronoi cell을 그리고, polygon 색상을 2)의 결과로 지정
            */

            let voronoi = d3.Delaunay
                .from(plotData, d => d[0], d => d[1])
                .voronoi([0, 0, width, height]);

            const mesh = svg.selectAll('what')
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("d", voronoi.render());
            
                const cell = svg.append("g")
                .attr("fill", "none")
                .attr("pointer-events", "all")
              .selectAll("path")
              .data(plotData)
              .join("path")
                .attr("d", (d, i) => voronoi.renderCell(i))

            const dic = tnc(raw, plotData);
            console.log(dic)

        }
        else {
            setButtonClicked(false);
            setButtonText(texts[0]);
            svg.selectAll('rect').remove();
        
        }
    }

	return (
        <div style={{display: "flex", flexDirection: "column" }} className="ProjectionView" >
            <svg ref={scatterplotSvg} width={svgWidth} height={svgHeight}></svg>
            <button type="button" style={{width: "150px", height: "40px"}} onClick={handleOnClick}>{buttonText}</button>
        </div>
	)
};

export default ProjectionView;