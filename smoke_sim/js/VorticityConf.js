VorticityConf = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.uniforms = {
        res : {type: 'v2' },
        velocityField: { type: "t" },
        curlField: { type: "t" },
        dt: { type: "f" },
        eps: { type: "f" },
        dx: { type: "f" },
        dy: { type: "f" },
        weight: { type: "f" },
        boundary: { type: "f"}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'VorticityConf' ).innerHTML,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NoBlending
    });
    this.quad = new THREE.Mesh(geometry, material);
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    //this.camera.position.z = 2;
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
}

VorticityConf.prototype.compute = function(renderer, velocityField, curlField, weight, bound, output) {
    this.uniforms.res.value = this.res;
    this.uniforms.velocityField.value = velocityField;
    this.uniforms.curlField.value = curlField;

    this.uniforms.eps.value = 0.01;

    this.uniforms.dt.value = 1.0;

    this.uniforms.dx.value = 1.0;
    this.uniforms.dy.value = 1.0;
    this.uniforms.weight.value = weight;
    this.uniforms.boundary.value = bound;

    renderer.render(this.scene, this.camera, output, false);
}