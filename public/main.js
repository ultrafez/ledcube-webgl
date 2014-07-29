window.addEventListener('DOMContentLoaded', function() {
    var stats = new Stats();
    var container = document.getElementById('canvas-container');
    var display = new Cube(8, container, window, stats);
    var ws = new Net(display);

    container.appendChild(stats.domElement);
});