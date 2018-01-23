////////////////////////////////////////////////////////////////////////////////
// Initialize gambezi
//var gambezi = new Gambezi('pivision.local:5809');
var gambezi = new Gambezi('localhost:5809');
gambezi.set_refresh_rate(100);
gambezi.set_default_subscription(1);

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
// Tree structure creation
function DataNode(gambeziNode, parentDiv) {
	this.gambeziNode = gambeziNode;
	this.children = [];

	//==============================================================================
	// Create divs
	this.parentDiv = parentDiv;
	this.div = document.createElement('div');
	this.div.classList.add('tree_node');
	this.childDiv = document.createElement('div');

	//==============================================================================
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

	//==============================================================================
	// Add handler
	add.onclick = function(event) {
		// Create div
		let div = document.createElement('div');
		div.classList.add('view_node');
		div.style.width = grid_size * 6 + 'px';
		div.style.height = grid_size * 2 + 'px';

		// Create header
		let header = document.createElement('div');
		let settings = document.createElement('a');
		settings.innerHTML = '&#9881;';
		settings.onclick = function(event) {
			// Remove old menu
			let element = document.querySelector('.view_menu');
			if(element != null && !element.contains(event.target)) {
				view.removeChild(element);
			}

			// Create if necessary
			if(document.querySelector('.view_menu') == null) {
				//------------------------------------------------------------------------------
				// Create context menu
				let menu = document.createElement('div');
				menu.classList.add('view_menu');
				menu.style.left = event.clientX - view.offsetLeft;
				menu.style.top = event.clientY - view.offsetTop;

				//------------------------------------------------------------------------------
				// Create buttons
				let remove = document.createElement('a');
				remove.innerHTML = 'Remove';
				remove.onclick = function(event) {
					view.removeChild(menu);
					contents = clear_contents(gambeziNode, div, contents);
					view.removeChild(div);
				};
				menu.appendChild(remove);

				//------------------------------------------------------------------------------
				// Change data type buttons
				let data_type = div.getAttribute('data_type');
				if(data_type != 'input_number') {
					let button = document.createElement('a');
					button.innerHTML = 'Input Number';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
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
						contents = clear_contents(gambeziNode, div, contents);
						create_output_number(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);
				}
				if(data_type != 'input_boolean') {
					let button = document.createElement('a');
					button.innerHTML = 'Input Boolean';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_input_boolean(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);
				}
				if(data_type != 'output_boolean') {
					let button = document.createElement('a');
					button.innerHTML = 'Output Boolean';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_output_boolean(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);
				}
				if(data_type != 'input_string') {
					let button = document.createElement('a');
					button.innerHTML = 'Input String';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_input_string(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);
				}
				if(data_type != 'output_string') {
					let button = document.createElement('a');
					button.innerHTML = 'Output String';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_output_string(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);
				}

				//------------------------------------------------------------------------------
				// Add
				view.appendChild(menu);
			}
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

	//==============================================================================
	// Add all children
	this.div.appendChild(expand);
	this.div.appendChild(document.createTextNode(gambeziNode.get_name()));
	this.div.appendChild(add);
	this.div.appendChild(this.childDiv);

	//==============================================================================
	// Add if not the root node
	if(parentDiv != null) {
		parentDiv.appendChild(this.div);
	}
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
// Method for clearing an input output view
function clear_contents(gambeziNode, div, contents) {
	// Remove all children
	clearTimeout(div.getAttribute('timer_ident'));
	contents.parentElement.removeChild(contents);
	contents = document.createElement('div');
	div.appendChild(contents);
	return contents;
}

////////////////////////////////////////////////////////////////////////////////
// Input output generation methods
function create_input_number(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'text';
	field.value = gambeziNode.get_double();
	div.style.backgroundColor = '#DFFFDF';
	field.onchange = function(event) {
		gambeziNode.set_double(field.value);
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'input_number');
}

function create_output_number(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'text';
	field.readOnly = true;
	gambeziNode.set_subscription(1);
	div.style.backgroundColor = '#DFDFFF';
	let ident = setInterval(function() {
		field.value = gambeziNode.get_double();
	}, 100);
	contents.appendChild(field);
	div.setAttribute('data_type', 'output_number');
	div.setAttribute('timer_ident', ident);
}

function create_input_boolean(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'checkbox';
	field.checked = gambeziNode.get_boolean();
	contents.style.backgroundColor = field.checked ? '#00FF00' : '#FF0000';
	div.style.backgroundColor = '#DFFFDF';
	field.onchange = function(event) {
		gambeziNode.set_boolean(field.checked);
		contents.style.backgroundColor = field.checked ? '#00FF00' : '#FF0000';
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'input_boolean');
}

function create_output_boolean(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'checkbox';
	field.disabled = true;
	gambeziNode.set_subscription(1);
	div.style.backgroundColor = '#DFDFFF';
	let ident = setInterval(function() {
		field.checked = gambeziNode.get_boolean();
		contents.style.backgroundColor = field.checked ? '#00FF00' : '#FF0000';
	}, 100);
	contents.appendChild(field);
	div.setAttribute('data_type', 'output_boolean');
	div.setAttribute('timer_ident', ident);
}

function create_input_string(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'text';
	field.value = gambeziNode.get_string();
	div.style.backgroundColor = '#DFFFDF';
	field.onchange = function(event) {
		gambeziNode.set_string(field.value);
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'input_string');
}

function create_output_string(gambeziNode, div, contents) {
	let field = document.createElement('input');
	field.type = 'text';
	field.readOnly = true;
	gambeziNode.set_subscription(1);
	div.style.backgroundColor = '#DFDFFF';
	let ident = setInterval(function() {
		field.value = gambeziNode.get_string();
	}, 100);
	contents.appendChild(field);
	div.setAttribute('data_type', 'output_string');
	div.setAttribute('timer_ident', ident);
}

////////////////////////////////////////////////////////////////////////////////
// Menu dismissal handler
document.onclick = function(event) {
	let element = document.querySelector('.view_menu');
	if(event.target.parentElement.parentElement != null &&
	   !event.target.parentElement.parentElement.classList.contains('view_node')) {
		if(element != null && !element.contains(event.target)) {
			view.removeChild(element);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
// Create draggable interface
var grid_size = 25;
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
		min: { width: grid_size * 2, height: grid_size * 2 },
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
