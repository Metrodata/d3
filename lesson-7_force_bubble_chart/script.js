window.onload = function(){
(function(){

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
		.append("g")
		.attr("transform","translate("+innerWidth/2+","+innerHeight/2+")")

let color = d3.scaleOrdinal(d3.schemeCategory10)

let simulation =  d3.forceSimulation()
					.force("x",d3.forceX().strength(0.02))
					.force("y",d3.forceY().strength(0.02))
					.velocityDecay(0.1)
					.alphaDecay(0.01)
					.force("collide",d3.forceCollide(function(d){
						return radiusScale(d.sales)+3;
					}).strength(0.8))

let radiusScale = d3.scaleSqrt()
					.domain([1,300])
					.range([5,50])

// let colorScale = d3.schemeCategory20()

d3.queue()
	.defer(d3.csv,"data.csv",function(d){
		// console.log(d)
		// d.id = d.name;
		d.sales = +d.sales;
		return d
	})
	.await(function(error, data){
		console.log(data);
		let circles = svg.selectAll(".bubble")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","bubble")
			.attr("r",function(d){
				return radiusScale(d.sales);
			})
			.attr("fill",function(d){
				return color(d.dacade)
			}).call(d3.drag().on("start",function(d){
    			d.fx = d.x;
				d.fy = d.y;
				simulation.alphaTarget(0.1);
				simulation.restart();
			}).on("drag",function(d){
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}).on("end",function(d){
				d.fx = null;
				d.fy = null;
				simulation.alphaTarget(0.1);
				simulation.restart();
			}))

		simulation.nodes(data)
			.on("tick",function(){
				circles.attr("cx",function(d){
					return d.x
				}).attr("cy",function(d){
					return d.y
				})
			})
	})

d3.select("#split").on("click",function(){
	simulation.force("x",d3.forceX(function(d){
					if(d.dacade == "pre-2000"){
						return -200;
					}else{
						return 200;
					}
				}).strength(0.02))
			.alphaTarget(0.1)
			.restart();
})

d3.select("#combine").on("click",function(){
	simulation.force("x",d3.forceX().strength(0.02))
			.alphaTarget(0.9)
			.restart();
})

})();
}












