window.onload = function(){


let width = 660,
	height = 500;

let canvas = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g");

let nodes = [].concat(
	d3.range(80).map(function() { return {type: "a"}; }),
	d3.range(160).map(function() { return {type: "b"}; })
);


let node = canvas.append("g")
		.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		.attr("r", 5)
		.attr("fill", function(d) { return d.type === "a" ? "brown" : "steelblue"; })
		.call(d3.drag()
		.on("start", function(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();//?
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
			// if (!d3.event.active) simulation.alphaTarget(0);//?
			d.fx = null;
			d.fy = null;
		}))

let simulation = d3.forceSimulation()
    .force("charge", d3.forceCollide().radius(5))
    .force("r", d3.forceRadial(function(d) { return d.type === "a" ? 100 : 200; }))
	// .force("center", d3.forceCenter(width/2, height/2));


// document.addEventListener("mousemove",function(event){
// 	console.log(event.clientX,"-",event.clientY)
// 	simulation.force("center", d3.forceCenter(event.clientX,event.clientY));
// })

simulation.nodes(nodes)

simulation.on("tick",function(){
	node.attr("cx", function(d){ return d.x;})
		.attr("cy", function(d){ return d.y;})
});

}




