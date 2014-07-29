window.addEventListener('DOMContentLoaded', function() {
    var stats = new Stats();
    var container = document.getElementById('canvas-container');
    var display = new Cube(8, container, window, stats);
    var ws = new Net(display);

    container.appendChild(stats.domElement);

    // Setup controls
    var CubeControls = function() {
    	this.autoRotate = false;
    	this.rotateSpeed = 2.0;
    }

    var controls = new CubeControls();
    var gui = new dat.GUI();
    var autoRotate = gui.add(controls, 'autoRotate');
    var rotateSpeed = gui.add(controls, 'rotateSpeed', 0, 10);

    autoRotate.onChange(function (value) {
    	display.controls.autoRotate = value;
    });

    rotateSpeed.onChange(function (value) {
    	display.controls.autoRotateSpeed = value;
    });
});