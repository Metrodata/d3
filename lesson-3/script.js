window.onload = function(){

let margin = {top: 20, right: 10, bottom: 20, left: 10},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

let x = d3.scaleLinear().range([0, width]),
	y = 25,
	z = d3.scaleOrdinal().range(["royalblue", "#aaa"]);

// let hierarchy = d3.partition().;

let partition = d3.partition()
		.size([width,height])
		.padding(0)

let svg = d3.select("body").append("svg:svg")
		.attr("width", width + margin.left + margin.right,)
		.attr("height", height + margin.top + margin.bottom)
		.append("svg:g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("./data.json",function(d){

	// console.log(d)
	_root = d3.hierarchy(d)
		.sum(function(d) { //什么意思
            return 1;
        })
        .sort(null); //什么意思
	// console.log()
	partition(_root)

	// console.log(nodes)

	console.log(_root.descendants())

	let graph = svg.selectAll("rect")
		.data(_root.descendants())
		.enter()
		.append("rect")
		.attr('stroke', 'black')
		.attr("x", function(d) { 
			console.log(d.y);
			return d.y; 
		})
        .attr("y", function(d) { return d.x; })
		.attr("width", function(d) { return d.y1 - d.y0; })
		.attr("height", function(d) { return d.x1 - d.x0; })

	// console.log(graph);
})





}