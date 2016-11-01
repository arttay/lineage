this.treeData = [{
	    "name": "Home",
	    "parent": "null"
	  }];




var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 1175 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
	
var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select(".treeRoot").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = this.treeData[0];
root.x0 = height / 2;
root.y0 = 0;
  
update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("width", 100)
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
	let className = d.name.split(" ")[0]
	$("." + className.toLowerCase()).text(d.name)
	
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}




$(".navLink").on("click", (e) => {
	let linkText 		= $(e.target).text();
	let baseLinkText 	= $(e.target).text().split(" ")[0];
	let linkTextNumber 	= parseInt($(e.target).text().split(" ")[1]);
	let parent 			= e.target.dataset.parent || linkText;
	let newLinkName 	= baseLinkText + " " + (linkTextNumber + 1);
	
	if(this.treeData[0].children === undefined) {
		$(e.target).text(newLinkName);

		this.treeData[0].children = [];
		this.treeData[0].children.push({
			name: newLinkName,
			parent: "Home"
		})

		$(".navLink").each((key, item) => {
			item.dataset.parent = newLinkName;
		});

	} else {
		//$(".navLink").each((key, item) => { item.dataset.parent = newLinkName; });
		e.target.dataset.parent = newLinkName;
		
		$(e.target).text(newLinkName);
		
		createDataStructure(this.treeData[0], parent, newLinkName, e)
	}

	update(root)

});



function createDataStructure (dataStructure, itemName, newName, e) {
	/*
		dataStructure 	= treedata || item obj in loop
		itemName 		= parent item
		newName 		= item to find in datastructure
		e 				= event info
	*/
	let arr = dataStructure.children;
	arr.forEach((item) => {

		if (item.children === undefined) {
			if (item.name === itemName) {
				if (!findItem(arr, newName)) {




					item.children = [];
					item.children.push({
					    "name": newName,
					    "parent": item.parent.name
					});

				}
			} else {
										console.log({
			itemdotname: item.name,
			parent: itemName,
			item: item,
			itemParentName: item.parent.name
		});
				//if (!findItem(arr, newName)) {
					dataStructure.children.push({
						"name": newName,
						"parent": item.parent.name
					});
				//}
			}
		} else {
			
			createDataStructure(item, itemName, newName, e);
		}
	});
}

function findItem (arr, newName) {
	return arr.reduce((prev, item) => {
		if (item.hasOwnProperty("children")) if (findItem(item.children, newName)) prev = true;
		if (item.name === newName) prev = true;
		return prev;
	}, false);
}















