window.onload = function(){

let margin = {top: 20, right: 20, bottom: 20, left: 20},
	outerWidth = 960,
	outerHeight = 6000,
	width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

let svg = d3.select("body").append("svg").attr("width",outerWidth).attr("height",outerHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let color = d3.scaleOrdinal(d3.schemeCategory10);

let format = d3.format(",d");

d3.csv("./flare.csv", function(error, data){
	if (error) throw error;
	let stratify = d3.stratify().id(function(d) {return d.name;}).parentId(function(d) { return d.name.substring(0, d.name.lastIndexOf(".")); });

	let _root = stratify(data).sum(function(d) { return d.number; });


	let _root_sort = _root.sort(function(a, b) { return b.height - a.height || b.value - a.value; })


	let partition = d3.partition()
	    .size([height, width])
	    .padding(1)

	let descendants = _root_sort.descendants()

    partition(_root_sort);

	console.log("descendants  ",descendants)

	console.log("partition  ",_root)

	let cell = svg
	    .selectAll(".node")
	    .data(descendants)
	    .enter()
	    .append("g")
	    .attr("class", function(d) { 
	    	return "node" + (d.children ? " node--internal" : " node--leaf"); 
	    })
	    .attr("transform", function(d) { 
	    	return "translate(" + d.y0 + "," + d.x0 + ")"; 
	    });

    cell.append("rect")
	    .attr("id", function(d) { return "rect-" + d.id; })
	    .attr("width", function(d) { return d.y1 - d.y0; })
	    .attr("height", function(d) { return d.x1 - d.x0; })	    
	    .filter(function(d) { return !d.children; })
	    .style("fill", function(d) { 
	    	while (d.depth > 1) {
	    		d = d.parent
	    	}; 
	    	return color(d.id); 
	    });


	cell.append("clipPath")
		.attr("id", function(d) { return "clip-" + d.id; })
	    .append("use")
	    .attr("xlink:href", function(d) { return "#rect-" + d.id + ""; });

	cell.append("text")
		.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
		.attr("x", 4)
		.selectAll("tspan")
		.data(function(d) { 
			return [d.id.substring(d.id.lastIndexOf(".") + 1), " " + format(d.value)]; 
		})
		.enter()
		.append("tspan")
		.attr("y", 13)
		.text(function(d) { return d; });

	cell.append("title")
		.text(function(d) { return d.id + "\n" + format(d.value); });

})
















}