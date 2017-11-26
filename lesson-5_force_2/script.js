window.onload = function(){

let width = 1000,
	height = 600;

let svg = d3.select("body")
			.append("svg")
			.attr("width",width)
			.attr("height",height);

let nodeData = [{'x':100,'y':100,'id':'Node'}];

let simulation = d3.forceSimulation(nodeData); //Initializing Simulation; nodes have been assigned

// Define the forces: method 1
// simulation.force("xAxis",d3.forceX().strength(5).x(width/2))
    // .force("yAxis",d3.forceY().strength(5).y(height/2));

// Define the forces: method 2
let xAxisForce = d3.forceX().strength(5).x(width/2);
let yAxisForce = d3.forceY().strength(5).y(height/2);

simulation.alphaDecay(0.01).force("xAxis",xAxisForce).force("yAxis",yAxisForce); //设置了alphaDecay()

//Define the node
let node = svg.selectAll("circle").data(nodeData)
    .enter().append("circle")
    .attr("r",30).attr("cx",width/2).attr("cy",height/2)
    .attr("fill","black").attr("opacity",0.5)
    .call(d3.drag()
    .on("start",dragstarted)
    .on("drag",dragged)
    .on("end",dragended));

simulation.on("tick",function(){
	node.attr("cx", function(d){ return d.x;})
		.attr("cy", function(d){ return d.y;})
});

function dragstarted(d){
	simulation.restart();
	simulation.alpha(1.0);
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d){
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d){
	d.fx = null;
	d.fy = null;
	simulation.alphaTarget(0.1);
}


}


