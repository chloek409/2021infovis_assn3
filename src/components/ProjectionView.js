import React, { useState, useRef, useEffect } from "react";
import attr from '../data/attr.json';
import raw from '../data/raw.json';
import * as d3 from "d3";

import {tnc} from '../functions/tnc';
import {colormap} from '../functions/colormap';


const ProjectionView = (props) => {
   
    const attributeIdx = props.attrIndex;
    const attributeVec = props.attrVector;
    
    const width = 500;
    const height = 600;
    const margin = 20;
    const svgWidth = width + margin;
    const svgHeight = height + margin;

    const sortedByAttr = [];
    attr.forEach((d)=>sortedByAttr.push(new Array()));
    console.log(sortedByAttr);

    const scatterplotSvg = useRef(null);
    const rawData = raw;
    rawData.forEach(function(arr, i) {
        arr.forEach((d,i)=>sortedByAttr[i].push(d))
    })
    console.log(sortedByAttr);


    useEffect(()=>{
        const plotData = sortedByAttr[0];
        const plotData_X = plotData.map(x=>x*4);
        console.log(plotData_X)
        const plotData_Y = plotData.map(x=>x*1);

        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData_X, d=>d), d3.max(plotData_X, d=>d)])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData_Y, d=>d), d3.max(plotData_Y, d=>d)])
            .range([0,height]);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        const svg = d3.select(scatterplotSvg.current);

        svg.append('g')
            .selectAll('circle')
            .data(plotData)
            .join('circle')
            .classed('scatters', true)
            .attr('r', 2)
            .attr('cx', d=>xScale(d))
            .attr('cy', d=>yScale(d))
            .attr('fill', 'white')
            .attr('stroke', "black");
        
    }, []);


    useEffect(()=>{
                
        const plotData = sortedByAttr[attributeIdx];
        const plotData_X = plotData.map(x=>x*4);
        console.log(plotData_X);
        const plotData_Y = plotData.map(x=>x*1);

        let xScale = d3.scaleLinear().domain(
            [d3.min(plotData_X, d=>d), d3.max(plotData_X, d=>d)])
            .range([0,width]);

        let yScale = d3.scaleLinear().domain(
            [d3.min(plotData_Y, d=>d), d3.max(plotData_Y, d=>d)])
            .range([0,height]);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        const svg = d3.select(scatterplotSvg.current);
        // svg.append('g').attr('transform', `translate(${props.margin}, ${svgHeight-props.margin})`).classed("xAxis", true).call(xAxis);
        // svg.append('g').attr('transform', `translate(${props.margin}, ${props.margin})`).classed("yAxis", true).call(yAxis);

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

    function handleOnClick() {
        if(!buttonClicked) {
            setButtonClicked(true);
            setButtonText(texts[1]);
            const dic = tnc(raw, raw);
            console.log(dic)
            // console.log(colormap(dic.trust, dic.conti));

        }
        else {
            setButtonClicked(false);
            setButtonText(texts[0]);
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