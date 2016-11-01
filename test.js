


let lineage = {
	treeData:[{
	    "name": "Home",
	    "parent": "null"
	  }],
	margin: function () {
		return {
			top: 20,
			right: 120,
			bottom: 20,
			left: 120
		}
	},
	width: function () {
		return 960 - this.margin().right - this.margin().left;
	},
	height: function () {
		return 500 - this.margin().top - this.margin().bottom;
	},
	tree: function () {
		return this.createTree();
	},
	
	diagonal: function () {
		return this.createDiagonal();
	},
	
	svg: function () {
		return this.createSvg();
	},
	

	init: function () {
		let data = this.get("newTabInfo");

		if (data !== null && data !== undefined) {
			this.treeData = JSON.parse(data);
		}

		this.createLineage();
		this.listeners();
	},

	listeners: function () {
		$(".navLink").on('click', (e) => {
			e.preventDefault();
			let linkText 	= $(e.target).text();
			let baseText 	= $(e.target).text().split(" ")[0];
			let linkNumber 	= parseInt(linkText.split(" ")[1]);
			let newLinkText = baseText + " " + (linkNumber + 1);
			let parent 		= e.target.dataset.parent || linkText;

			$(e.target).text(newLinkText);
				$(".navLink").each((key, item) => {
					item.dataset.parent = linkText;
				});

			if (this.treeData[0].children === undefined) {
				this.treeData[0].children = [];
				this.treeData[0].children.push({
					"name": linkText
				});
			} else {
				createDataStructure(this.treeData[0], parent, linkText, e);
			}

			this.set("newTabInfo", JSON.stringify(this.treeData));

			window.open("link.html");

			this.update(root);
			
		});
	},
	set: function (key, value) {
		sessionStorage.setItem(key, value);
	},
	get: function (key) {
		return sessionStorage.getItem(key);
	},

	createTree: function () {
		return d3.layout.tree()
			.size([this.height(), this.width()]);
	},

	createDiagonal: function () {
		return d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });
	},

	createSvg: function () {
		return d3.select(".treeRoot").append("svg")
			.attr("width", this.width() + this.margin().right + this.margin().left)
			.attr("height", this.height() + this.margin().top + this.margin().bottom)
		  .append("g")
			.attr("transform", "translate(" + this.margin().left + "," + this.margin().top + ")");
	},
	
	createLineage: function () {
		var self = this;			
		var i = 0,
			duration = 750,
			root;

		var tree		= this.tree();
		var diagonal 	= this.diagonal();
		var svg 		= this.svg();

		root = this.treeData[0];
		root.x0 = this.height() / 2;
		root.y0 = 0;
		this.root = root;
		  
		this.update(root);

		d3.select(this.frameElement).style("height", "500px");
/*
		function update(source) {

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
			  links = tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

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
*/

	},
	
	click: function (d) {
		  if (d.children) {
			d._children = d.children;
			d.children = null;
		  } else {
			d.children = d._children;
			d._children = null;
		  }
		  this.update(d);
	},

	update: function (source) {
				  // Compute the new tree layout.
		  var nodes = this.tree().nodes(this.root).reverse(),
			  links = this.tree().links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node =  this.svg().selectAll("g.node")
			  .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			  .on("click", this.click);

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
		  var link = this.svg().selectAll("path.link")
			  .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
			  .attr("class", "link")
			  .attr("d", (d) => {
				var o = {x: source.x0, y: source.y0};
				return this.diagonal({source: o, target: o});
			  });

		  // Transition links to their new position.
		  link.transition()
			  .duration(duration)
			  .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
			  .duration(duration)
			  .attr("d", (d) => {
				var o = {x: source.x, y: source.y};
				return this.diagonal({source: o, target: o});
			  })
			  .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		  });
	}
};

lineage.init();
