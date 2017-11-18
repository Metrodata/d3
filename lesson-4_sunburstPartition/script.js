window.onload = function(){

let margin = {top: 20, right: 20, bottom: 20, left: 20},
	outerWidth = 960,
	outerHeight = 700,
	width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom,
    radius = (Math.min(width, height) / 2) - 10;

let canvas = d3.select("body")
			.append("svg")
			.attr("width",outerWidth)
			.attr("height",outerHeight)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

let format = d3.format(",d");
let color = d3.scaleOrdinal(d3.schemeCategory20);

let partition = d3.partition();

let x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

let y = d3.scaleLinear()
    .range([0, radius]);

let arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });




d3.csv("./flare.csv", function(error, data){
	if (error) throw error;

	let _root = d3.stratify().id(function(d){
		return d.name;
	}).parentId(function(d){
		return d.name.substring(0, d.name.lastIndexOf("."));
	})(data).sum(function(d) { 
		return d.number; 
	});

	partition(_root)
	console.log(_root)

	canvas.selectAll("path")
	.data(_root.descendants())
	.enter()
	.append("path")
	.attr("d",
		d3.arc()
		    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		    .outerRadius(function(d) { return Math.max(0, y(d.y1)); })
    )
	.style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
	.on("click", function(d){
		canvas.transition()
			.duration(750)
			.tween()

	})
	.append("title")
	.text(function(d) { return d.id + "\n" + format(d.value); });
})





}