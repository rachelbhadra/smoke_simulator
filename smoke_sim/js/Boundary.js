
Boundary = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.xloffset = new THREE.Vector2(0.0, 0.0);
    this.xroffset = new THREE.Vector2(0.0, 0.0);
    this.yboffset = new THREE.Vector2(0.0, 0.0);
    this.ytoffset = new THREE.Vector2(0.0, 0.0);
    this.scaling = 0.0;
    this.dense = 1.0;

    this.res = res;
    this.uniforms = {
        read: { type: "t" },
        res : {type: 'v2' },
        scale: {type:"f" },
        xloffset: {type: "v2"},
        xroffset: {type: "v2"},
        yboffset: {type: "v2"},
        ytoffset: {type: "v2"},
        density: {type: "f"}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'Boundary' ).innerHTML,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NoBlending
    });
    this.quad = new THREE.Mesh(geometry, material);
    //this.line = new THREE.Line(geometry, material);
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    //this.camera.position.z = 2;
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
    //this.scene.add(this.line);
}

Boundary.prototype = {
    constructor: Boundary,
    compute: function(renderer, input, output) {
        this.uniforms.read.value = input;
        this.uniforms.res.value = this.res;
        this.uniforms.scale.value = this.scaling;
        this.uniforms.xloffset.value = this.xloffset;
        this.uniforms.xroffset.value = this.xroffset;
        this.uniforms.yboffset.value = this.yboffset;
        this.uniforms.ytoffset.value = this.ytoffset;
        this.uniforms.density.value = this.dense;
        renderer.render(this.scene, this.camera, output, false);
    },

    density: function() {
        this.xloffset.set(0.0, 0.0);
        this.xroffset.set(0.0, 0.0);
        this.yboffset.set(0.0, 0.0);
        this.ytoffset.set(0.0, 0.0);
        this.scaling = 1.0;
        this.dense = 1.0;
    },

    velocity: function() {
        this.xloffset.set(1.0, 0.0);
        this.xroffset.set(-1.0, 0.0);
        this.yboffset.set(0.0, 1.0);
        this.ytoffset.set(0.0, -1.0);
        this.scaling = -1.0;
        this.dense = 0.0;
    },

    pressure: function() {
        this.xloffset.set(1.0, 0.0);
        this.xroffset.set(-1.0, 0.0);
        this.yboffset.set(0.0, 1.0);
        this.ytoffset.set(0.0, -1.0);
        this.scaling = 1.0;
        this.dense = 0.0;
    }
}