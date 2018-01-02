window.onload = function(){(function(){

let  margin = {
		top:30,
		bottom:30,
		left:30,
		right:30
	},
	width = 960,
    height = 500,
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom;

let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform","translate(" + width/2 + "," + height/2 + ")");

let scaleSqrt = d3.scalePow().exponent(0.21)

let simulation = d3.forceSimulation()
				.force("charge", d3.forceManyBody().strength(-20))
				.force("x",d3.forceX().strength(0.02))
				.force("y",d3.forceY().strength(0.02))
				.velocityDecay(0.02)
				.alphaDecay(0.02)
				.force("collide",d3.forceCollide(function(d){
						return scaleSqrt(d.value);
				}));

d3.json("data.json",function(error,data){
	if(error) throw error;

	let _root = d3.hierarchy(data).sum(function(d){
		return d.size;
	});

	console.log(_root.links());

	let linkes = svg.selectAll(".link")
					.append("g")
					.data(_root.links())
					.enter()
					.append('line')
					.attr("class",'link')
					.attr("stroke","rgb(200,200,200)")

	let nodes = svg.selectAll(".node")
					.append("g")
					.data(_root.descendants()) //填在simulation.nodes()
					.enter()
					.append("circle")
					.attr("class","node")
					.attr("fill",function(d){
						if(!d.parent){
							return "tomato"
						}else if(!d.children){
							return "steelblue"
						}else{
							return "orange"							
						}
					})
					.attr("r",function(d){
							return scaleSqrt(d.value);
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
					}));



	simulation.force("link",d3.forceLink().links(_root.links()).strength(1.5))
	

	//simulation.nodes()里一定要填 nodes 用的数据而不是nodes本身
	simulation.nodes(_root.descendants()).on("tick",function(){
		nodes.attr("cx",function(d){
			// console.log(d.x)
					return d.x;
				}).attr("cy",function(d){
					return d.y;
				})

		linkes.attr('x1', function(d) {
					console.log(d.source)
					return d.source.x;
				})
				.attr('y1', function(d) {return d.source.y;})
				.attr('x2', function(d) {return d.target.x;})
				.attr('y2', function(d) {return d.target.y;});
	})



})


})()}