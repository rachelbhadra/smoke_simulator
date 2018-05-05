Advect = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.uniforms = {
        res : {type: 'v2' },
        velocityField: { type: "t" },
        advectionField: { type: "t" },
        dissipation: {type:"f" }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'Advect' ).innerHTML,
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

Advect.prototype.compute = function(renderer, velocityField, advectionField, dissipation, output) {
    this.uniforms.res.value = this.res;
    this.uniforms.velocityField.value = velocityField;
    this.uniforms.advectionField.value = advectionField;
    this.uniforms.dissipation.value = dissipation;
    renderer.render(this.scene, this.camera, output, false);
}
