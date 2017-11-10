window.onload = function(){


let width = 960,
	height = 800;

let svg = d3.select("body")
			.append("svg")
			.attr("id","canvas_1")
			.attr("width",width)
			.attr("height",height);

let svg_2 = d3.select("body")
			.append("svg")
			.attr("id","canvas_2")
			.attr("width",width)
			.attr("height",height);

let format = d3.format(",d");

let color = d3.scaleOrdinal(d3.schemeCategory20c);


let button = d3.select("button").on("click",function(){
	svg_2.append("circle").attr("r",20).attr("fill",function(){
		return color(document.getElementsByTagName('input')[0].value)
	}).attr("transform","translate(24,24)")
})

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
			console.log(d.package)
			return color(d.package); 
		});

})

}