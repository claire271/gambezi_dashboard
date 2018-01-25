////////////////////////////////////////////////////////////////////////////////
// UI variables
var tree_button_state = 'add';
var graph_secondary_update = null;

////////////////////////////////////////////////////////////////////////////////
// Initialize gambezi
var refresh_rate = 100;
//var gambezi = new Gambezi('pivision.local:5809');
var gambezi = new Gambezi('localhost:5809');
gambezi.set_refresh_rate(refresh_rate);
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
		if(tree_button_state == 'add') {
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
					let data_type = div.getAttribute('data_type');
					let type_label = document.createElement('b');
					type_label.innerHTML = data_type;
					menu.appendChild(type_label);

					let button = document.createElement('a');
					button.innerHTML = 'Remove';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						view.removeChild(div);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Input Number';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_input_number(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Output Number';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_output_number(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Input Boolean';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_input_boolean(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Output Boolean';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_output_boolean(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Input String';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_input_string(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Output String';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_output_string(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Log String';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_log_string(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Button';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_button(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

					button = document.createElement('a');
					button.innerHTML = 'Graph Number';
					button.onclick = function(event) {
						view.removeChild(menu);
						contents = clear_contents(gambeziNode, div, contents);
						create_graph_number(gambeziNode, div, contents);
					};
					menu.appendChild(document.createElement('br'));
					menu.appendChild(button);

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
		}
		else if(tree_button_state == 'graph') {
			// Update graph element
			if(graph_secondary_update != null) {
				graph_secondary_update(gambeziNode);
			}

			// Update state
			tree_button_state = 'add';
		}
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
	}, refresh_rate);
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
	}, refresh_rate);
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
	}, refresh_rate);
	contents.appendChild(field);
	div.setAttribute('data_type', 'output_string');
	div.setAttribute('timer_ident', ident);
}

function create_log_string(gambeziNode, div, contents) {
	let field = document.createElement('textarea');
	field.type = 'text';
	field.readOnly = true;
	field.rows = 1;
	field.value = '';
	gambeziNode.set_subscription(0);
	div.style.backgroundColor = '#DFDFFF';
	gambeziNode.on_update = function(node) {
		let atBottom = field.scrollTop == (field.scrollHeight - field.clientHeight);
		if(field.value == '') {
			field.value = gambeziNode.get_string();
		}
		else {
			field.value += '\n' + gambeziNode.get_string();
		}
		if(atBottom) {
			field.scrollTop = field.scrollHeight - field.clientHeight;
		}
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'log_string');
}

function create_button(gambeziNode, div, contents) {
	let field = document.createElement('button');
	field.innerHTML = 'Send';
	div.style.backgroundColor = '#DFFFDF';
	field.onclick = function(event) {
		gambeziNode.set_boolean(true);
	};
	contents.appendChild(field);
	div.setAttribute('data_type', 'button');
}

function create_graph_number(gambeziNode0, div, contents0) {
	// Parameters
	let margin_top = 50;
	let margin_left = 50;
	let margin_bottom = 50;
	let margin_right = 50;

	// Variables
	let gambeziNode1 = null;
	let buffer_length = 30 * 1000 / refresh_rate;
	let buffer0 = new Array(buffer_length);
	let buffer1 = new Array(buffer_length);
	let paused = false;
	let autoscale = true;
	let index = 0;
	let min_x = 0;
	let max_x = 30;
	let min_y = -10;
	let max_y = 10;

	// Create second header
	let header1 = document.createElement('div');
	header1.style.flex = '0 1 auto';
	header1.appendChild(document.createTextNode(''));

	// Create settings button
	let settings = document.createElement('a');
	settings.innerHTML = '&#9881;';
	settings.style.float = 'right';
	settings.style.cursor = 'pointer';
	settings.style.marginRight = '4px';
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
			let button = document.createElement('a');
			button.innerHTML = 'Select Node';
			button.onclick = function(event) {
				view.removeChild(menu);
				tree_button_state = 'graph';
				graph_secondary_update = function(gambeziNode) {
					gambeziNode1 = gambeziNode;
					graph_secondary_update = null;
					// Update header
					header1.removeChild(header1.firstChild);
					let subtitle = '';
					if(gambeziNode1 != null) {
						subtitle = gambeziNode1.get_string_key().join('/');
					}
					header1.insertBefore(document.createTextNode(subtitle), settings);
				};
			};
			menu.appendChild(button);

			let checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = paused;
			checkbox.onclick = function(event) {
				paused = checkbox.checked;
			};
			menu.appendChild(document.createElement('br'));
			let label = document.createElement('label');
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode('Paused'));
			menu.appendChild(label);

			checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = autoscale;
			checkbox.onclick = function(event) {
				autoscale = checkbox.checked;
			};
			menu.appendChild(document.createElement('br'));
			label = document.createElement('label');
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode('Autoscale'));
			menu.appendChild(label);

			//------------------------------------------------------------------------------
			// Add
			view.appendChild(menu);
		}
	};
	header1.appendChild(settings);

	// Create content area
	let contents1 = document.createElement('div');
	contents1.style.flex = '1 1 auto';

	// Add divs
	contents0.style.display = 'flex';
	contents0.style.flexFlow = 'column';
	contents0.appendChild(header1);
	contents0.appendChild(contents1);

	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	gambeziNode0.set_subscription(1);
	div.style.backgroundColor = '#DFDFFF';
	let ident = setInterval(function() {
		// Draw background
		let width = div.clientWidth;
		let height = div.clientHeight - div.firstChild.clientHeight;
		canvas.width = width;
		canvas.height = height;
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, width, height);

		// Draw other stuff if not paused
		if(!paused) {
			// Get new data
			buffer0[index] = gambeziNode0.get_double();
		}


	}, refresh_rate);
	contents1.appendChild(canvas);
	div.setAttribute('data_type', 'graph_number');
	div.setAttribute('timer_ident', ident);
}

////////////////////////////////////////////////////////////////////////////////
// Document click handler
document.onclick = function(event) {
	// Menu dismissal handler
	let element = document.querySelector('.view_menu');
	let is_link = event.target.tagName == 'A';
	let is_child_view_node = false;
	let target = event.target;
	while(target != null) {
		if(target.classList.contains('view_node')) {
			is_child_view_node = true;
		}
		target = target.parentElement;
	}
	if(!is_link || !is_child_view_node) {
		if(element != null && !element.contains(event.target)) {
			view.removeChild(element);
		}
	}

	// Selection dismissal handler
	if(!(event.target.tagName == 'BUTTON' && event.target.innerHTML == '+') &&
	   !(event.target.tagName == 'A' && event.target.innerHTML == 'Select Node')) {
		// Update graph element
		if(graph_secondary_update != null) {
			graph_secondary_update(null);
		}

		// Update state
		tree_button_state = 'add';
	}
}

////////////////////////////////////////////////////////////////////////////////
// Allow tree to be resized
interact('#tree')
.resizable({
	edges: { left: false, right: true, bottom: false, top: false },
})
.on('resizemove', function (event) {
	var target = event.target;
	document.querySelector('#tree').style.width = event.rect.width + 'px';
	document.querySelector('#view').style.width = 'calc(100% - ' + event.rect.width + 'px)';
});

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

