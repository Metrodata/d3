window.onload = function(){

d3.select("body").append("svg").attr("width",600).attr("height",800)

let margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


let xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

let yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

var xAxis = d3.axisBottom(xScale)

var yAxis = d3.axisLeft(yScale)

}