window.onload = function(){


let margin = {
	top:30,
	bottom:30,
	left:30,
	right:30
},
	width = 1000,
	height = 800,
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom;


let color = d3.scaleOrdinal(d3.schemeCategory20);

let svg = d3.select("body").append("svg").attr("width",innerWidth).attr("height",innerHeight)

let radius = d3.scaleSqrt()
    .range([0, 6]);

let force = d3.forceSimulation().force("link",d3.forceLink().id(function(d){
			return d.index
		}).distance(function(d) { 
			return radius(d.source.size) + radius(d.target.size) + 20;
		}))
		.force("charge", d3.forceManyBody().strength(-400))
		.force("center", d3.forceCenter(innerWidth/2, innerHeight/2))


d3.json("data.json",function(error,data) {

	if (error) throw error;

	let link = svg.append("g")
		.attr("class", "link")
		.selectAll("line")
		.data(data.links)
		.enter()
		.append("g")
		.append("line")
		.attr("stroke","#999")
		.style("stroke-width", function(d) { 
			return (d.bond * 2 - 1) * 2 + "px"; 
		});
		
	link.filter(function(d) {
			return d.bond > 1; 
		}).append("line")
		.attr("class", "separator");


	let node = svg.append("g").selectAll(".node")
		.data(data.nodes)
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


	force.nodes(data.nodes)
		.on("tick",function(){
			node.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")"; 
			})


			link.attr("x1", function(d) { 
				return d.source.x; 
			})
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
		})

	force.force("link").links(data.links)


	node.append("circle")
		.attr("r", function(d) { return radius(d.size); })
		.style("fill", function(d) { return color(d.atom); });

	node.append("text")
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.text(function(d) { return d.atom; });


})


}