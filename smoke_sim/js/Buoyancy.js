Buoyancy = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.uniforms = {
        res : {type: 'v2' },
        velocityField: { type: "t" },
        temperatureField: { type: "t" },
        densityField: { type: "t" },
        ambientTemperature: { type: "f" },
        sigma: { type: "f" },
        kappa: { type: "f" }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'Buoyancy' ).innerHTML,
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

Buoyancy.prototype.compute = function(renderer, velocityField, temperatureField, densityField, ambientTemperature, output) {
    this.uniforms.res.value = this.res;
    this.uniforms.velocityField.value = velocityField;
    this.uniforms.temperatureField.value = temperatureField;
    this.uniforms.densityField.value = densityField;
    this.uniforms.ambientTemperature.value = ambientTemperature;
    this.uniforms.sigma.value = 0.08;
    this.uniforms.kappa.value = 0.001;
    renderer.render(this.scene, this.camera, output, false);
}
