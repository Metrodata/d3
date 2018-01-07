window.onload = function(){(function(){
let m = {
	top: 20, 
	left: 30,
	bottom: 30,
	right: 40
},
    w = 960 - m.left - m.right,
    h = 500 - m.top - m.bottom;

let svg = d3.select("body").append("svg")
			.attr("width", w + m.left + m.right)
			.attr("height", h + m.top + m.bottom)
			.append("g")
			.attr("transform", "translate(" + m.left + "," + m.top + ")");




let toolFunction = {
	color : d3.scaleOrdinal(d3.schemeCategory10),
	parse : d3.timeParse("%b %Y"),
	x : d3.scaleTime().range([0, w - 60]),
	y : d3.scaleLinear().range([h / 4 - 20,0]),	
	line : d3.line().x(function(d){
			// console.log("line    ",d)
				return toolFunction.x(d.date)
			}).y(function(d){
				return toolFunction.y(d.price)
			}).curve(d3.curveLinear),
	area : d3.area().x(function(d){
			// console.log("line    ",d)
				return toolFunction.x(d.date)
			}).y0(function(d){
				return toolFunction.y(d.price)
			}).curve(d3.curveLinear),
}



//加载数据
d3.csv("data.csv",function(error,data){
if (error) throw error;

//处理数据
data = d3.nest()
		.key(function(d){
			return d.symbol;
		}).entries(data);

//计算最大值，格式化时间价格
data.forEach(function(s) {
		s.values.forEach(function(d) { 
			d.date = toolFunction.parse(d.date); 
			d.price = +d.price; 
		});

		s.maxPrice = d3.max(s.values, function(d) { 
				return d.price; 
			});
		s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
	});
data.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

// 公司分组
let g = svg.selectAll("g")
	.data(data)
	.enter()
	.append("g")
	.attr("transform",function(d,i){
		return "translate(0,"+ i*100 +")";
	})
	.attr("class", "symbol");



// 设置时间比例尺
toolFunction.x.domain([
			d3.min(data, function(d) {
				return d.values[0].date; 
			}),
			d3.max(data, function(d) { 
				return d.values[d.values.length - 1].date; 
			})
		]);
// 设置价格比例尺_1
toolFunction.y.domain([0,d3.max(data,function(companyData){
			return companyData.maxPrice
		})]);

toolFunction.area.y1(toolFunction.y(0))

// 处理每一个公司的数据
g.each(function(d){
	let element = d3.select(this);


	element.append("path")
			.attr("class", "area");

	element.append("path")
			.attr("class", "line");

	element.append("circle")
			.attr("r", 5)
			.style("fill", function(d) { 
				return toolFunction.color(d.key); 
			}).style("stroke", "#000")
			.style("stroke-width", "2px");

	element.append("text")
			.attr("x", 12)
			.attr("dy", ".31em")
			.style("font-family", "Helvetica Neue, Helvetica")

	let k = 1,
		n = data[0].values.length;

	// 开始动画
	let timer = d3.timer(function() {
		g.each(function(d) {

			let element = d3.select(this);

			// 设置价格比例尺_2
			// toolFunction.y.domain([0, d.maxPrice]);

			element.select(".area")
					.attr("stroke","none")
					.attr("fill",function(d){
						return toolFunction.color(d.key)
					})
					.attr("d", function(d) { 
						return toolFunction.area(d.values.slice(0, k + 1)); //从0开始增加数据，并覆盖之前的线图
					});

			element.select(".line")
					.attr("stroke","#000")
					.attr("fill","none")
					.attr("stroke-width", "2px")
					.attr("d", function(d) { 
						return toolFunction.line(d.values.slice(0, k + 1)); //从0开始增加数据，并覆盖之前的线图
					});


			element.selectAll("circle")
					.data(function(d) { 
						return [d.values[k]]
					}).attr("transform", function(d) { 
						return "translate(" + toolFunction.x(d.date) + "," + toolFunction.y(d.price) + ")"; 
					});


			element.selectAll("text")
					.text(function(d){
						return d.key + " " + d.values[k].price
					})
					.attr("transform", function(d) { 
						return "translate(" + toolFunction.x(d.values[k].date) + "," + toolFunction.y(d.values[k].price) + ")"; 
					});

		})

	k+=1
	if( k>=n-1 ){
		timer.stop()
	}
	})
	
})



});
})()}