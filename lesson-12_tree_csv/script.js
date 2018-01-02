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

d3.csv("data.csv", function(error, data) {
	if (error) throw error;

  let stratify = d3.stratify().id(function(d){return d.type}).parentId(function(d){return d.belongto})

  nodes = stratify(data).sum(function(d) { return d.size; });

  // console.log(data)

	let treeNodes = treemap(nodes);

	console.log(nodes);
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
					.attr("fill", function(d){
            if(!d.parent){
              return "red" 
            }else if(!d.children){
              return "steelblue"
            }else{
              return "green"
            }
          })
					.attr("cy",function(d){
						return d.x
					}).attr("cx",function(d){
						return d.y
					})
});

})()}