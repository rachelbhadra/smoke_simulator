Divergence = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.uniforms = {
        res : {type: 'v2' },
        u: { type: "t" },
        dx: {type:"f" },
        dy: {type:"f" }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'Divergence' ).innerHTML,
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

Divergence.prototype.compute = function(renderer, u, dx, dy, output) {
    this.uniforms.res.value = this.res;
    this.uniforms.u.value = u;
    this.uniforms.dx.value = dx;
    this.uniforms.dy.value = dy;
    renderer.render(this.scene, this.camera, output, false);
}
