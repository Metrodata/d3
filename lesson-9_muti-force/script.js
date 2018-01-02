window.onload = function(){(function(){


let margin = {
	top:30,
	bottom:30,
	left:30,
	right:30
},
	width = 960,
    height = 500,
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom,
	maxRadius = 20,
	n = 30,
	m = 12;

let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform","translate("+ margin.top +","+ margin.left +")").append("g").attr("transform","translate("+ innerWidth/2 +","+ innerHeight/2 +")");

let color = d3.scaleSequential(d3.interpolateRainbow).domain([0,m])

let x = d3.scalePoint().domain(d3.range(m)).range([0, width], 1);

let quadtree = d3.quadtree();

let nodes = d3.range(n).map(function(){
	let i = Math.floor(Math.random() * m),
		v = (i + 1) / m * - Math.log(Math.random());

	return {
		radius: Math.sqrt(v) * maxRadius,
		color: color(i),
		cx: x(i),
		cy: height / 2
	};
})


let simulation = d3.forceSimulation()
				.velocityDecay(0.03)
				.alphaDecay(0.03)
				.force('charge', d3.forceManyBody().strength(5))
				.force("gravityX",d3.forceX().strength(0.005))
				.force("gravityY",d3.forceY().strength(0.005))
				.force("collide",d3.forceCollide(function(d){
					return d.radius+1;
				}))


let circles = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", function(d) { return d.radius; })
    .attr("fill", function(d) { return d.color; })
    .call(d3.drag()
    		.on("start",function(d){
				simulation.alphaTarget(0.1);
				simulation.restart();
    			d.fx = d.x;
				d.fy = d.y;
    		}).on("drag",function(d){
    			// console.log(d)
    			d.fx = d3.event.x;
				d.fy = d3.event.y;
    		}).on("end",function(d){
				d.fx = null;
				d.fy = null;
				simulation.alphaTarget(0.1);
				simulation.restart();
    		}));

simulation.nodes(nodes).on("tick",function(){
	circles.attr("cx",function(d){
		return d.x
	}).attr("cy",function(d){
		return d.y
	})
})


})()}