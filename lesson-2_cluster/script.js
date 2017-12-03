window.onload = function(){


let width = 960,
	height = 2000;

let svg = d3.select("body")
			.append("svg")
			.attr("id","canvas")
			.attr("width",width)
			.attr("height",height)

let g = svg.append("g").attr("transform", "translate(40,0)");

let stratify = d3.stratify()
    .parentId(function(d) {
    	// console.log(d)
    	// console.log(d.name.substring(0, d.name.lastIndexOf(".")))
    	return d.name.substring(0, d.name.lastIndexOf(".")); 
    })
    .id(function(d){
    	return d.name
    });


let scaleLinear = d3.scaleLinear().range([0,.001])

let colorScaleLinear = d3.scaleLinear().range(["red","royalblue"])

console.log(scaleLinear(1))




d3.csv("./data.csv", function(error, data) {
	if (error) throw error;

	let _root = stratify(data)

	d3.cluster().size([height, width - 160])(_root);

	console.log(_root)
	// console.log(cluster_root)


	console.log(_root.descendants().slice(1), "=========")
	console.log(_root.descendants())


	let link = g.selectAll(".link")
		.data(_root.descendants().slice(1))
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", function(d) {
			return "M" + d.y + "," + d.x
			    + "C" + (d.parent.y + 100) + "," + d.x
			    + " " + (d.parent.y + 100) + "," + d.parent.x
			    + " " + d.parent.y + "," + d.parent.x;
		})
		.attr("fill","none")
		.attr("stroke","#555");


	var node = g.selectAll(".node")
		.data(_root.descendants())
		.enter().append("g")
		.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		
	node.append("circle")
		.attr("r", function(d){
			return scaleLinear(d.data.value)
		})
		.attr("fill",function(d){
			return colorScaleLinear(scaleLinear(d.data.value))
		});
		
	node.append("text")
		.attr("dy", 3)
		.attr("x", function(d) { return d.children ? -8 : 8; })
		.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		.text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });


// console.log(node)

// .link {
//   fill: none;
//   stroke: #555;
//   stroke-opacity: 0.4;
//   stroke-width: 1.5px;
// }

});

}





