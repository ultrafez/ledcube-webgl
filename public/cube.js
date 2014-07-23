var NODE_WIDTH = 1;
var NODE_SPACING = 5;
var BASE_OPACITY = 0.3;
var BASE_COLOR = 0.3;
var BASE_COLOR_HEX = 0x4C4C4C;

/**
 * Represents a rendered 3D cube simulation, the data it displays, and the canvas it displays the simulation on.
 *
 * @param int size The number of lights to have in each dimension of the cube.
 * @param DOMNode containerElem A DOM element that will contain the <canvas> used to render the simulation
 */
var Cube = function(size, containerElem, theWindow) {
    this.size = size;
    this.container = containerElem;

    this.nodes = [];
    for (x=0; x<size; x++) {
        this.nodes[x] = [];
        for (y=0; y<size; y++) {
            this.nodes[x][y] = [];
        }
    }

    this._setupScene();

    var geometry = new THREE.BoxGeometry(NODE_WIDTH, NODE_WIDTH, NODE_WIDTH);

    for (x=0; x<size; x++) {
        for (y=0; y<size; y++) {
            for (z=0; z<size; z++) {
                var material = new THREE.MeshBasicMaterial({color: BASE_COLOR_HEX});
                material.transparent = true;
                material.opacity = BASE_OPACITY;
                var newCube = new THREE.Mesh(geometry, material);
                // OpenGL coordinates are different to cube coordinates, so the next few lines translate the coords
                newCube.position.x = (x * NODE_SPACING) - ((size-1) * NODE_SPACING / 2);
                newCube.position.y = (z * NODE_SPACING) - ((size-1) * NODE_SPACING / 2);
                newCube.position.z = ((size-1) * NODE_SPACING / 2) - (y * NODE_SPACING);
                this.nodes[x][y][z] = newCube;
                this.scene.add(newCube);
            }
        }
    }

    theWindow.addEventListener('resize', this.onResize.bind(this), false);

    this._render();
}

/**
 * Set up the environment for the objects to be created in, such as the scene, camera, renderer and controls.
 */
Cube.prototype._setupScene = function() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.z = this.size * NODE_SPACING * 1.2;
    this.scene.add(this.camera);

    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.noPan = true;
    this.controls.damping = 0.2;
}

Cube.prototype._render = function() {
    // this.controls.rotateLeft(0.005);
    // this.controls.update();

    requestAnimationFrame(this._render.bind(this));
    this.renderer.render(this.scene, this.camera);
}

/**
 * Update the size and viewport of the 3D view. Call when the size of the parent containing element changes.
 */
Cube.prototype.onResize = function() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
}

/**
 * Set the specified coordinate to the specified colour. Interpolates between the "off" colour/opacity and
 * the specified new colour. Opacity of the LED is set based on the maximum of the R, G, B channels.
 */
Cube.prototype.setPixelColor = function(x, y, z, r, g, b) {
    r = r/255;
    g = g/255;
    b = b/255;
    var opacity = Math.max(r, g, b);

    var lerpFrom = (1-opacity)*BASE_OPACITY;
    var newR = interpolate(lerpFrom, 1, r);
    var newG = interpolate(lerpFrom, 1, g);
    var newB = interpolate(lerpFrom, 1, b);
    this.nodes[x][y][z].material.color.setRGB(newR, newG, newB);
    this.nodes[x][y][z].material.opacity = BASE_OPACITY + ((1-BASE_OPACITY) * opacity);
}

/**
 * Amount should be between 0 and 1
 */
function interpolate(from, to, amount) {
    return from + (to - from) * amount;
}