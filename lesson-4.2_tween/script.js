window.onload = function(){

let timer = 2;

let width = 960,
	height = 700;

let canvas = d3.select("body").append("svg").attr("width",width).attr("height",height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let tau = 2 * Math.PI;

let arc = d3.arc()
    .innerRadius(180)
    .outerRadius(240)
    .startAngle(0);

// let pie = d3.pie()
//     .innerRadius(180)
//     .outerRadius(240)
//     .startAngle(0);

let background = canvas.append("path")
    .datum({endAngle: 0.627 * tau})
    .style("fill", "#ddd")
    .attr("d", arc);

let foreground = canvas.append("path")
    .datum({
    	endAngle: 0.127 * tau
    })
    // .style("fill", "orange")
    .attr("d", arc)
    .on("click",function(){
    	timer+=1;
    	console.log(timer);

    	foreground.transition()
		.duration(750)
		.attrTween("d", arcTween(0.01*timer * tau))
		.attrTween("fill",colorTween(0.06*timer));
    });

function arcTween(newAngle) {
	return function(d) {
		let interpolate = d3.interpolate(d.endAngle, newAngle);
		return function(t) {
			console.log(t)
			d.endAngle = interpolate(t);
			return arc(d);
	    };
	}
}

function colorTween(newColor) {
	return function() {
		let interpolate = d3.interpolate(this.getAttribute("fill"),"hsl(" + newColor * 360 + ",80%,50%)"); 
		return function(t) {
			console.log(t)
			return interpolate(t);
		};
	}
}

window.tween = arcTween;









// console.log(arcTween(0.6 * tau)(1)(3))




};