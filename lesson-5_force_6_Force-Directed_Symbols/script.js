window.onload = function(){

let margin = {
	top:30,
	bottom:30,
	left:30,
	right:30
},
	width = 960,
    height = 500,
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom;

let svg = d3.select("body")
		.append("svg")
		.attr("width",innerWidth)
		.attr("height",innerHeight)

let force = d3.forceSimulation()
		.force("link",d3.forceLink().id(function(d){
			return d.index
		}))
		// .force("charge", d3.forceManyBody().strength(-400))
		// .force("center", d3.forceCenter(innerWidth/2, innerHeight/2))
;

d3.json("data.json",function(error, data){
	if (error) throw error;
	console.log(data.children)


	let node = svg.append("g")
		.selectAll(".node")
		.data(data.children)
		.enter()
		.append("g")
		.attr("class", "node")
		.call(d3.drag().on("start", function(d) {
			if (!d3.event.active) force.alphaTarget(0.3).restart();//?
			d.fx = d.x;
			d.fy = d.y;
		})
		.on("drag", function(d) {
			// console.log(d3.event)
			d.fx = d3.event.x;
			d.fy = d3.event.y;
			// console.log(d)
		})
		.on("end", function(d) {
			if (!d3.event.active) force.alphaTarget(0);//?
			d.fx = null;
			d.fy = null;
		}));

	force.nodes(data.children)
})


}