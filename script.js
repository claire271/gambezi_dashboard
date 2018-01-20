////////////////////////////////////////////////////////////////////////////////
// Initialize gambezi
//var gambezi = new Gambezi('pivision.local:5809');
var gambezi = new Gambezi('localhost:5809');

// Initialize root node
var rootNode = new DataNode(gambezi.get_root_node(), null);
var rootDiv = document.querySelector('#tree');

// Update tree
setInterval(function() {
	gambezi.get_root_node().request_all_children();
	setTimeout(function() {
		rootNode.buildTree();
	}, 100);
}, 1000);

// Initialize view
var view = document.querySelector('#view');

////////////////////////////////////////////////////////////////////////////////
// Tree structure
function DataNode(gambeziNode, parentDiv) {
	this.gambeziNode = gambeziNode;
	this.children = [];

	// Create divs
	this.parentDiv = parentDiv;
	this.div = document.createElement('div');
	this.div.classList.add('tree_node');
	this.childDiv = document.createElement('div');

	// Create controls
	let expand = document.createElement('button');
	expand.innerHTML = '&gt;';
	expand.onclick = function(event) {
		if(expand.innerHTML == '&gt;') {
			expand.innerHTML = 'v';
			this.childDiv.style.display = 'block';
		}
		else {
			expand.innerHTML = '&gt;';
			this.childDiv.style.display = 'none';
		}
	}.bind(this);
	let add = document.createElement('button');
	add.innerHTML = '+';

	// Add handler
	add.onclick = function(event) {
		// Create div
		let div = document.createElement('div');
		div.classList.add('view_node');
		div.style.width = grid_size * 3 + 'px';
		div.style.height = grid_size * 1 + 'px';

		// Create header
		let header = document.createElement('div');
		let settings = document.createElement('a');
		settings.innerHTML = '&#9881;';
		settings.onclick = function(event) {
			// Create context menu
			let menu = document.createElement('div');
			menu.classList.add('view_menu');
			menu.style.left = event.clientX - view.offsetLeft;
			menu.style.top = event.clientY - view.offsetTop;

			// Create buttons
			let close = document.createElement('a');
			close.innerHTML = 'Close';
			close.onclick = function(event) {
				view.removeChild(menu);
			};
			let remove = document.createElement('a');
			remove.innerHTML = 'Remove';
			remove.onclick = function(event) {
				view.removeChild(menu);
				clear_contents(gambeziNode, div, contents);
				view.removeChild(div);
			};

			// Add
			menu.appendChild(close);
			menu.appendChild(document.createElement('br'));
			menu.appendChild(remove);

			// Change data type buttons
			let data_type = div.getAttribute('data_type');
			if(data_type != 'input_number') {
				let button = document.createElement('a');
				button.innerHTML = 'Input Number';
				button.onclick = function(event) {
					view.removeChild(menu);
					clear_contents(gambeziNode, div, contents);
					create_input_number(gambeziNode, div, contents);
				};
				menu.appendChild(document.createElement('br'));
				menu.appendChild(button);
			}
			if(data_type != 'output_number') {
				let button = document.createElement('a');
				button.innerHTML = 'Output Number';
				button.onclick = function(event) {
					view.removeChild(menu);
					clear_contents(gambeziNode, div, contents);
					create_output_number(gambeziNode, div, contents);
				};
				menu.appendChild(document.createElement('br'));
				menu.appendChild(button);
			}

			// Add
			view.appendChild(menu);
		};
		header.appendChild(document.createTextNode(gambeziNode.get_string_key().join('/')));
		header.appendChild(settings);
		
		// Create contents
		let contents = document.createElement('div');
		create_output_number(gambeziNode, div, contents);

		// Add 
		div.appendChild(header);
		div.appendChild(contents);
		view.appendChild(div);
	}.bind(this);

	// Add all children
	this.div.appendChild(expand);
	this.div.appendChild(document.createTextNode(gambeziNode.get_name()));
	this.div.appendChild(add);
	this.div.appendChild(this.childDiv);

	// Add if not the root node
	if(parentDiv != null) {
		parentDiv.appendChild(this.div);
	}
}

function clear_contents(gambeziNode, div, contents) {
	// Remove all children
	while(contents.firstChild) contents.removeChild(contents.firstChild);
	clearTimeout(div.getAttribute('timer_ident'));
}

function create_input_number(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.onchange = function(event) {
		gambeziNode.set_double(field.value);
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'input_number');
}

function create_output_number(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.readOnly = true;
	let ident = setInterval(function() {
		field.value = gambeziNode.get_double();
	}, 100);
	contents.appendChild(field);
	div.setAttribute('data_type', 'output_number');
	div.setAttribute('timer_ident', ident);
}

DataNode.prototype.buildTree = function() {
	// Add new children if the number has changed
	let gambeziChildren = this.gambeziNode.get_children();
	if(gambeziChildren.length > this.children.length) {
		for(let i = this.children.length;i < gambeziChildren.length;i++) {
			let child = new DataNode(gambeziChildren[i], (this.parentDiv == null) ? rootDiv : this.childDiv);
			this.children.push(child);
		}
	}
	
	// Check children recursively
	for(let child of this.children) {
		child.buildTree();
	}
}

////////////////////////////////////////////////////////////////////////////////
// Create draggable interface
var grid_size = 50;
interact('.view_node')
.draggable({
	snap: {
		range: Infinity,
		relativePoints: [ { x: 0, y: 0 } ]
	},
	restrict: {
		restriction: "parent",
		elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	},

	onmove: dragMoveListener,
})
.resizable({
	edges: { left: false, right: true, bottom: true, top: false },

	// keep the edges inside the parent
	restrictEdges: {
		outer: 'parent',
		endOnly: false,
	},

	// minimum size
	restrictSize: {
		min: { width: grid_size, height: grid_size },
	},
})
.on('resizemove', function (event) {
	var target = event.target;
	target.style.width  = Math.round(event.rect.width / grid_size) * grid_size + 'px';
	target.style.height = Math.round(event.rect.height / grid_size) * grid_size + 'px';
});
function dragMoveListener (event) {
	var target = event.target;
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.left = Math.round(x / grid_size) * grid_size + 'px';
	target.style.top  = Math.round(y / grid_size) * grid_size + 'px';

	// update the posiion attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}
window.dragMoveListener = dragMoveListener;
