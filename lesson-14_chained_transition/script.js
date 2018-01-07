window.onload = function(){(function(){

let whiteblue = d3.interpolateRgb("#eee", "steelblue"),
    blueorange = d3.interpolateRgb("steelblue", "orange"),
    orangewhite = d3.interpolateRgb("orange", "#eee");

let n = 1000;

console.log(d3.range(n))

d3.select("body").append("h2")

d3.select("body")
	.selectAll("div")
	.data(d3.range(n))
	.enter()
	.append("div")
	.style("width","10px")
	.style("height","10px")
	.style("margin","1px 0 0 1px")
	.style("float","left")
	.style("background","#eee")
	.style("display","inline-block")
	.transition()
    .delay(function(d, i) { 
    	d3.select("h2").style("font","sans-serif").text(i);
    	console.log(i)
    	return i/2 + Math.random() * n / 4; 
    })
    .ease(d3.easeLinear)
    .on("start", function repeat() {
        d3.active(this)
            .styleTween("background-color", function() { return whiteblue; })
          .transition()
            .delay(1000)
            .styleTween("background-color", function() { return blueorange; })
          .transition()
            .delay(1000)
            .styleTween("background-color", function() { return orangewhite; })
          .transition()
            .delay(n)
            .on("start", repeat);
      });

})()}