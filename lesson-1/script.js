window.onload = function(){


let width = 960,
	height = 800;

let svg = d3.select("body")
			.append("svg")
			.attr("width",width)
			.attr("height",height);


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
			console.log(d.data)
		  	console.log(d.data.id)

	    if (id = d.data.id) {
	      var id, i = id.lastIndexOf(".");
	      d.id = id;
	      d.package = id.slice(0, i);
	      d.class = id.slice(i + 1);
	    }
	  });

	  console.log(_root)



// d3.csv("./data.csv", function(d) {
// 	d.value = +d.value
// 	if (d.value) return d;
// },function(error,data){
// 	if (error) throw error;

// 	let _root = d3.hierarchy({chilren:data})
// 		.sum(function(d) {
// 			return d.value; 
// 		})
// 		.each(function(d){
// 			if (id = d.data.id) {
// 	          var id, i = id.lastIndexOf(".");
// 	          d.id = id;
// 	          d.package = id.slice(0, i);
// 	          d.class = id.slice(i + 1);
// 	        }
// 		})

// 	console.log(_root)

	// let node = svg.selectAll(".node")

	// console.log(pack(_root).leaves())



})

}