window.onload = function(){(function(){

let width = 800,
	height = 600;

let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform","translate(" + width/2 + "," + height/2 + ")");

let stratify = d3.stratify();

let force = d3.forceSimulation()
				.force("x",d3.forceX())
				.force("y",d3.forceY());

d3.queue()
	.defer(d3.json,"data.json")
	.await(function(error,data){
		if (error) throw error;
		console.log(data);

		_root = d3.hierarchy(data)
		console.log(_root)
		console.log(stratify(_root))


		let nodes = d3.selectAll(".node").data()

	});


})()}