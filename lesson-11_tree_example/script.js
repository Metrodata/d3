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

let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

let sqrtScale = d3.scaleSqrt()

let treemap = d3.tree().size([innerHeight,innerWidth])

d3.json("data.json", function(error, data) {
	if (error) throw error;

  //  assigns the data to a hierarchy using parent-child relationships

	let nodes = d3.hierarchy(data, function(d) {
	    return d.next;
	});

	let treeNodes = treemap(nodes).count();

	// console.log(nodes);
	// console.log(treeNodes);

	let linkes = svg.selectAll('.link')
				.data(nodes.links())
				.enter()
				.append("g")
				.append('line')
				.attr("class",'link')
				.attr("stroke","rgb(200,200,200)")
				.attr('y1', function(d) {return d.source.x;})
				.attr('x1', function(d) {return d.source.y;})
				.attr('y2', function(d) {return d.target.x;})
				.attr('x2', function(d) {return d.target.y;});

	let circles = svg.selectAll(".node")
					.data(nodes.descendants())
					.enter()
					.append("g")
					.append("circle")
					.attr("class","node")
					.attr("r", function(d){
						return sqrtScale(d.value);
					})
					.attr("fill", "steelblue")
					.attr("cy",function(d){
						return d.x
					}).attr("cx",function(d){
						return d.y
					})



  // // maps the node data to the tree layout
  // nodes = treemap(nodes);

  // // append the svg object to the body of the page
  // // appends a 'group' element to 'svg'
  // // moves the 'group' element to the top left margin
  // var svg = d3.select("body").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom),
  //   g = svg.append("g")
  //     .attr("transform",
  //       "translate(" + margin.left + "," + margin.top + ")");

  // // adds the links between the nodes
  // var link = g.selectAll(".link")
  //   .data( nodes.descendants().slice(1))
  //   .enter().append("path")
  //   .attr("class", "link")
  //   .attr("d", function(d) {
  //      return "M" + d.y + "," + d.x
  //      + "C" + (d.y + d.parent.y) / 2 + "," + d.x
  //      + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
  //      + " " + d.parent.y + "," + d.parent.x;
  //      });

  // // adds each node as a group
  // var node = g.selectAll(".node")
  //   .data(nodes.descendants())
  //   .enter().append("g")
  //   .attr("class", function(d) { 
  //     return "node" + 
  //     (d.children ? " node--internal" : " node--leaf"); })
  //   .attr("transform", function(d) { 
  //     return "translate(" + d.y + "," + d.x + ")"; });

  // // adds the circle to the node
  // node.append("circle")
  //   .attr("r", 10);

  // // adds the text to the node
  // node.append("text")
  //   .attr("dy", ".35em")
  //   .attr("x", function(d) { return d.children ? -13 : 13; })
  //   .style("text-anchor", function(d) { 
  //   return d.children ? "end" : "start"; })
  //   .text(function(d) { return d.data.name; });

});

})()}