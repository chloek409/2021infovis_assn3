import React, { useState, useRef, useEffect } from "react";
import attr from '../data/attr.json';
import raw from '../data/raw.json';
import * as d3 from "d3";

import {tnc} from '../functions/tnc';
import {colormap} from '../functions/colormap';


const ProjectionView = (props) => {
   
    const attributeIdx = props.attrIndex;
    const attributeVec = props.attrVector;
    
    const width = 450;
    const height = 550;
    const margin = 20;
    const svgWidth = width + margin;
    const svgHeight = height + margin+10;
    const scatterplotSvg = useRef(null);


    const sortedByAttr = [];
    attr.forEach((d)=>sortedByAttr.push(new Array()));

    const rawData = raw;
    rawData.forEach(function(arr, i) {
        arr.forEach((d,i)=>sortedByAttr[i].push(d*0.19))
    })
    //sortedByAttr= [ [raw values of attr0],[raw values of attr1], ... ,[raw values of attr8]]
    
    const projected = [];
    const [projectedData, setProjectedData] = useState([]);
    rawData.forEach(function(d) {
        d[attributeIdx] = 0;
        projected.push(d);
    });
    console.log(projected)


    useEffect(()=>{
        const plotData = sortedByAttr[0];
        const plotData_X = plotData.map(x=>x*(attributeVec[0]-165)/330);
        const plotData_Y = plotData.map(y=>y*(attributeVec[1]-165)/330);

        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData_X, d=>d), d3.max(plotData_X, d=>d)])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData_Y, d=>d), d3.max(plotData_Y, d=>d)])
            .range([0,height]);

        const svg = d3.select(scatterplotSvg.current);
        svg.append('g')
            .selectAll('circle')
            .data(plotData)
            .join('circle')
            .classed('scatters', true)
            .attr('transform', `translate(${margin}, ${margin})`)
            .attr('r', 2)
            .attr('cx', d=>xScale(d))
            .attr('cy', d=>yScale(d))
            .attr('fill', 'white')
            .attr('stroke', "black");
        
    }, []);


    useEffect(()=>{
                
        const plotData = sortedByAttr[attributeIdx];
        const plotData_X = plotData.map(x=>x*(attributeVec[0]-165)/330);
        const plotData_Y = plotData.map(y=>y*(attributeVec[1]-165)/330);

        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData_X, d=>d), d3.max(plotData_X, d=>d)])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData_Y, d=>d), d3.max(plotData_Y, d=>d)])
            .range([0,height]);

        const svg = d3.select(scatterplotSvg.current);
        svg.selectAll('circle')
            .data(plotData)
            .join('circle')
            .transition()
            .attr('cx', d=>xScale(d))
            .attr('cy', d=>yScale(d))
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
                svg.selectAll('g')
                .append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('transform', `translate(100,100)`)
                .attr('stroke', "black");
            const dic = tnc(rawData, rawData);
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