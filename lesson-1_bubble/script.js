window.onload = function(){


let width = 960,
	height = 800;

let svg = d3.select("body")
			.append("svg")
			.attr("id","canvas_1")
			.attr("width",width)
			.attr("height",height)
			.attr("font-family","sans-serif")
			.attr("font-size",10)
			.attr("text-anchor","middle");


let format = d3.format(",d");

let color = d3.scaleOrdinal(d3.schemeCategory20c);

let pack = d3.pack()
    .size([width, height])
    .padding(1.5);

d3.csv("./data.csv", function(d) {
	d.value = +d.value;
	if (d.value) return d;
}, function(error, data) {
	if (error) throw error;

	let _root = d3.hierarchy({children: data})
	  .sum(function(d) { return d.value; })
	  .each(function(d) {
			// console.log(d.data)
			//console.log(d.data.id)
			let id = d.data.id

			if(id){
				let i = id.lastIndexOf(".");
			    d.id = id;
			    d.package = id.slice(0, i);
			    d.class = id.slice(i + 1);
			}
	  });

	let node = svg.selectAll(".node")
		.data(pack(_root).leaves())
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.append("circle")
		.attr("id", function(d) { return d.id; })
		.attr("r", function(d) { return d.r; })
		.style("fill", function(d) {
			console.log(d)
			return color(d.package); 
		});

	node.append("clipPath")
		.attr("id", function(d) { return "clip-" + d.id; })
		.append("use")
		.attr("href", function(d) { return "#" + d.id; });

	node.append("text")
		.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
		.selectAll("tspan")
		.data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
		.enter().append("tspan")
		.attr("x", 0)
		.attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
		.text(function(d) { return d; });

	node.append("title")
		.text(function(d) { return d.id + "\n" + format(d.value); });
})

}