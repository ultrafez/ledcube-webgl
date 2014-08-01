window.addEventListener('DOMContentLoaded', function() {
    var stats = new Stats();
    var container = document.getElementById('canvas-container');
    var display = new Cube(8, container, window, stats);
    var ws = new Net(display);

    container.appendChild(stats.domElement);

    // Setup controls
    var CubeControls = function() {
        this.showFpsMeter = true;
        this.autoRotate = false;
        this.rotateSpeed = 2.0;
    }

    var controls = new CubeControls();
    var gui = new dat.GUI();
    var showFpsMeter = gui.add(controls, 'showFpsMeter');
    var autoRotate = gui.add(controls, 'autoRotate');
    var rotateSpeed = gui.add(controls, 'rotateSpeed', 0, 10);

    showFpsMeter.onChange(function (value) {
        stats.domElement.style.display = value ? 'block' : 'none';
    });

    autoRotate.onChange(function (value) {
        display.controls.autoRotate = value;
    });

    rotateSpeed.onChange(function (value) {
        display.controls.autoRotateSpeed = value;
    });
});