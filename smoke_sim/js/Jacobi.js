Jacobi = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.uniforms = {
        res : {type: 'v2' },
        x: { type: "t" },
        b: { type: "t" },
        alpha: {type:"f" },
        beta: {type:"f" }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'Jacobi' ).innerHTML,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NoBlending
    });
    this.quad = new THREE.Mesh(geometry, material);
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1);
    //this.camera.position.z = 2;
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
}

Jacobi.prototype.compute = function(renderer, x, b, alpha, beta, output) {
    this.uniforms.res.value = this.res;
    this.uniforms.x.value = x;
    this.uniforms.b.value = b;
    this.uniforms.alpha.value = alpha;
    this.uniforms.beta.value = beta;
    renderer.render(this.scene, this.camera, output, false);
}
