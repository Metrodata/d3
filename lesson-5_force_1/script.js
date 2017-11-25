window.onload = function(){

let width = 960,
	height = 700;

let canvas = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g");

let simulation_1 = d3.forceSimulation()
					.force("linkss", d3.forceLink().id(function(d) { 
						console.log("linkss    ",d)
						return d.name; 
					}))//?
					.force("charge", d3.forceManyBody().strength(-30))//?
					.force("center", d3.forceCenter(width/2, height/2));//设置到中心


let simulation_2 = d3.forceSimulation()


let color = d3.scaleOrdinal(d3.schemeCategory20);

console.log(simulation_1)
console.log(simulation_2)


d3.json("./data.json", function(error, data){
	if (error) throw error;


	simulation_1.nodes(data.nodes)
		.on("tick",function(){
			link.attr("x1", function(d) { 
				// console.log(d)
				return d.source.x;
			})
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });

		    node.attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; })
		})


	simulation_1.force("linkss")
		.links(data.links)


		// .force("change");//?

	let link = canvas.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(data.links)
		.enter()
		.append("line")
		.attr("stroke-width", function(d) { return Math.sqrt(d.value); })
		.attr("stroke","#999")
		.attr("opacity",.4);

	let node = canvas.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(data.nodes)
		.enter()
		.append("circle")
		.attr("r", 6)
		.attr("fill", function(d) { return color(d.group) });

	node.append("title")
		.text(function(d) { return d.id; });


	// console.log(node)

	d3.drag()
		.on("start", function(d) {
			if (!d3.event.active) simulation_1.alphaTarget(0.3).restart();//?
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
			if (!d3.event.active) simulation_1.alphaTarget(0);//?
			d.fx = null;
			d.fy = null;
		})(node)


})




}