window.onload = function(){

let width = 660,
	height = 500,
    margin = {top: 20, right: 20, bottom: 30, left: 50}
    innerWidth = width-margin.right-margin.left
    innerHeight = height-margin.top-margin.bottom;



let canvas = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


let parseTime = d3.timeParse("%d-%b-%y");

let x = d3.scaleTime()
			.rangeRound([0, innerWidth]);

let y = d3.scaleLinear()
			.rangeRound([innerHeight, 0]);

let line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

d3.tsv("./data.tsv",function(d){

	d.date = parseTime(d.date);
	d.close = +d.close;
	return d

}, function(error,data) {
	if (error) throw error;

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain(d3.extent(data, function(d) { return d.close; }));
	// console.log(data)
	canvas.append("g")
		.attr("transform", "translate(0," + innerHeight + ")")
		.call(d3.axisBottom(x))


	canvas.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Price ($)");

	canvas.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", line);



})

// }, function(error, data) {
//   if (error) throw error;

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain(d3.extent(data, function(d) { return d.close; }));

//   g.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x))
//     .select(".domain")
//       .remove();

//   g.append("g")
//       .call(d3.axisLeft(y))
//     .append("text")
//       .attr("fill", "#000")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", "0.71em")
//       .attr("text-anchor", "end")
//       .text("Price ($)");

//   g.append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-linejoin", "round")
//       .attr("stroke-linecap", "round")
//       .attr("stroke-width", 1.5)
//       .attr("d", line);
// });


}