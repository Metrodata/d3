window.onload = function(){(function(){
let m = {
	top: 20, 
	left: 40,
	bottom: 30,
	right: 20
},
    w = 960 - m.left - m.right,
    h = 500 - m.top - m.bottom;

let svg = d3.select("body").append("svg")
			.attr("width", w + m.left + m.right)
			.attr("height", h + m.top + m.bottom)
			.append("g")
			.attr("transform", "translate(" + m.left + "," + m.top + ")");
// let area = 


let tool = {
	parseTime : d3.timeParse("%d-%b-%y"),
	x : d3.scaleTime()
	    .rangeRound([0, w]),
    y : d3.scaleLinear()
	    .rangeRound([h, 0]),
}


d3.tsv("data.tsv", function(d) {

	d.date = tool.parseTime(d.date);
	d.close = +d.close;
	return d;

}, function(error, data) {
	if (error) throw error;

	tool.x.domain(d3.extent(data, function(d) { return d.date; }));
	tool.y.domain([0, d3.max(data, function(d) { return d.close; })]);

	let area = d3.area()
	    .x(function(d) { return tool.x(d.date); })
	    .y1(function(d) { return tool.y(d.close); })
	    .y0(function(d) { return tool.y(d.close/2); });



		svg.append("path")
	      .datum(data)
	      .attr("fill", "red")
	      .attr("d",area);

	let k = 1,
		n = data.length;
	let timer = d3.timer(function(){
		svg.append("path")
	      .datum(data)
	      .attr("fill", "steelblue")
	      .attr("d", function(d){
	      	return area(d.slice(0, k + 1));
	      });

		k+=1
		if( k>=n-1 ){
			timer.stop()
		}
	})

	svg.append("g")
	      .attr("transform", "translate(0," + h + ")")
	      .call(d3.axisBottom(tool.x));

	svg.append("g")
      .call(d3.axisLeft(tool.y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");


})






})()}