data = new ArrayBuffer(5)
dataView = new Uint8Array(data)
for(var i = 0;i < 5;i++) { dataView[i] = i; }

gambezi = new Gambezi("localhost:7709", true);
//gambezi.set_refresh_rate(1000);
gambezi.on_close = function() { console.log("RECONNECT"); };

gambezi.set_refresh_rate(1000);
a = gambezi.register_key(['a']);
a.update_subscription(0x0001);
a.set_float(12.2);
b = gambezi.register_key(['b']);
b.update_subscription(0x0000);
c = gambezi.register_key(['test1', 'test2', 'test3']);

a.on_update = function(node) {
	//console.log(node.get_name());
	//console.log(new Uint8Array(node.get_data()));
	console.log(node.get_float());
	//console.log(node.get_boolean());
};
gambezi.on_error = console.log;

//setInterval(gambezi.open_connection, 5000);

/*
setInterval(function() {
	a.set_float(13.6);
	b.set_float(12.4);
}, 1);

setTimeout(function() {
	//location.reload();
}, 100)

*/
