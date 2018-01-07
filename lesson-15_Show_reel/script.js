window.onload = function(){(function(){


let m = {
	top: 20, 
	left: 20,
	bottom: 30,
	right: 20
},
    w = 960 - m.left - m.right,
    h = 500 - m.top - m.bottom;

let x,
    y,
    duration = 1500,
    delay = 500;

let mainColor = d3.scaleOrdinal(d3.schemeCategory10);

// console.log(color)

let svg = d3.select("body").append("svg")
			.attr("width", w + m.left + m.right)
			.attr("height", h + m.top + m.bottom)
			.append("g")
			.attr("transform", "translate(" + m.left + "," + m.top + ")");

let stocks,
    symbols;

let line = d3.line()
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d.price); });

var axis = d3.line()
    .x(function(d) { return x(d.date); })
    .y(h);


d3.csv("data.csv", function(data) {
	let parse = d3.timeParse("%b %Y");

	// console.log(data)
	// console.log(d3.nest().key(function(d) { return d.symbol; }).entries(data)[0].values[0])
	// console.log(d3.nest().key(function(d) { return d.symbol; }).key(function(d) { return d.price; }).entries(data)[0].values[0].values)

	symbols = d3.nest()
	      .key(function(d) { return d.symbol; })
	      .entries(data);

	symbols.forEach(function(s) {
		// s.values.forEach(function(d) { 
		// 	d.date = parse(d.date); d.price = +d.price; 
		// });

		s.values.forEach(function(d) { 
			d.date = parse(d.date); 
			d.price = +d.price; 
		});

		s.maxPrice = d3.max(s.values, function(d) { return d.price; });
		s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
	});

	symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

	let g = svg.selectAll("g")
			.data(symbols)
			.enter()
			.append("g")
			.attr("class", "symbol");

	setTimeout(function lines(){
		// console.log("line")
		x = d3.scaleTime().range([0, w - 60]);
		y = d3.scaleLinear().range([h / 4 - 20, 0]);


		x.domain([
			d3.min(symbols, function(d) {
				return d.values[0].date; 
			}),
			d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
		]);

		let g = svg.selectAll(".symbol")
				.attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

	    g.each(function(d) {
	    	// console.log(d)
			let e = d3.select(this);

			e.append("path")
			.attr("class", "line");

			e.append("circle")
			.attr("r", 5)
			.style("fill", function(d) { return mainColor(d.key); })
			.style("stroke", "#000")
			.style("stroke-width", "2px");

			e.append("text")
			.attr("x", 12)
			.attr("dy", ".31em")
			.text(d.key);
		});

// d3.timer(function(t){
// 	console.log(t)
// 	return true
// })

		let k = 1,
			n = symbols[0].values.length;

		line.x(function(d){
			// console.log("line    ",d)
				return x(d.date)
			}).y(function(d){
				return y(d.price)
			}).curve(d3.curveLinear);

		let timer = d3.timer(function() {
			console.log("hi")

			g.each(function(d) {
				let e = d3.select(this);

				y.domain([0, d.maxPrice]);

				e.select("path")
					.attr("d", function(d) { 
						return line(d.values.slice(0, k + 1)); 
					});

				e.selectAll("circle, text")
					.data(function(d) { 
						// console.log(d)
						let result = [d.values[k], d.values[k]]
						// console.log(result[0] == result[1])
						return result; 

					}).attr("transform", function(d) { 
						// console.log(d)
						return "translate(" + x(d.date) + "," + y(d.price) + ")"; 
					});
			});

k+=1
if( k>=n-1 ){

			// g.each(function(d) {
			// 	let e = d3.select(this);

			// 	y.domain([0, d.maxPrice]);

			// 	e.select("path")
			// 		.attr("d", function(d) { 
			// 			return line(d.values.slice(0, n-1 + 1)); 
			// 		});

			// 	e.selectAll("circle, text")
			// 		.data(function(d) { 
			// 			// console.log(d)
			// 			let result = [d.values[n-1], d.values[n-1]]
			// 			console.log(result[0] == result[1])
			// 			return result; 

			// 		}).attr("transform", function(d) { 
			// 			console.log(d)
			// 			return "translate(" + x(d.date) + "," + y(d.price) + ")"; 
			// 		});
			// 	})



	setTimeout(function horizons() {
		  svg.insert("defs", ".symbol")
		    .append("clipPath")
		      .attr("id", "clip")
		    .append("rect")
		      .attr("width", w)
		      .attr("height", h / 4 - 20);

		  var color = d3.scaleOrdinal()
		      .range(["#c6dbef", "#9ecae1", "#6baed6"]);

		  var g = svg.selectAll(".symbol")
		      .attr("clip-path", "url(#clip)");

		  area
		      .y0(h / 4 - 20);

		  g.select("circle").transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
		      .remove();

		  g.select("text").transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")"; })
		      .attr("dy", "0em");

		  g.each(function(d) {
		    y.domain([0, d.maxPrice]);

		    d3.select(this).selectAll(".area")
		        .data(d3.range(3))
				.enter()
				.insert("path", ".line")
		        .attr("class", "area")
		        .attr("transform", function(d) { 
		        	console.log(d)
		        	return "translate(0," + (d * (h / 4 - 20)) + ")"; 
		        })
		        .attr("d", area(d.values))
		        .style("fill", function(d, i) { return color(i); })
		        .style("fill-opacity", 1e-6);

		    y.domain([0, d.maxPrice / 3]);

		    d3.select(this).selectAll(".line").transition()
		        .duration(duration)
		        .attr("d", line(d.values))
		        .style("stroke-opacity", 0);

		    d3.select(this).selectAll(".area").transition()
		        .duration(duration)
		        .style("fill-opacity", 1)
		        .attr("d", area(d.values))
		        .on("end", function() { 
		        	d3.select(this).style("fill-opacity", null); 
		        });

		  });

		  setTimeout(function areas() {
			  var g = svg.selectAll(".symbol");

			  axis
			      .y(h / 4 - 21);

			  g.select(".line")
			      .attr("d", function(d) { return axis(d.values); });

			  g.each(function(d) {
			    y.domain([0, d.maxPrice]);

			    d3.select(this).select(".line").transition()
			        .duration(duration)
			        .style("stroke-opacity", 1)
			        .on("end", function() { d3.select(this).style("stroke-opacity", null); });

			    d3.select(this).selectAll(".area")
			        .filter(function(d, i) { return i; })
			      .transition()
			        .duration(duration)
			        .style("fill-opacity", 1e-6)
			        .attr("d", area(d.values))
			        .remove();

			    d3.select(this).selectAll(".area")
			        .filter(function(d, i) { return !i; })
			      .transition()
			        .duration(duration)
			        .style("fill", mainColor(d.key))
			        .attr("d", area(d.values));
			  });

			  svg.select("defs").transition()
			      .duration(duration)
			      .remove();

			  g.transition()
			      .duration(duration)
			      .on("end", function() { d3.select(this).attr("clip-path", null); });



			}, duration);
		}, 500);



	// return true;
	timer.stop()
}

			// if ((k += 2) >= n - 1) {
			// draw(n - 1);
			// setTimeout(horizons, 500);
			// return true;
			// }
		});


// 		function draw(k) {
// 			g.each(function(d) {

// 			let e = d3.select(this);

// 			y.domain([0, d.maxPrice]);

// 			e.select("path")
// 				.attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

// 			e.selectAll("circle, text")
// 				.data(function(d) { return [d.values[k], d.values[k]]; })
// 				.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
// 			});
// 		}



	}, duration);

})


})()}