window.addEventListener('DOMContentLoaded', function() {
	var display = new Cube(8, document.getElementById('canvas-container'), window);
	var ws = new Net(display);
});