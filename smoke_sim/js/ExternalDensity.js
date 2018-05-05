ExternalDensity = function(res) {
    var geometry = new THREE.PlaneBufferGeometry( 2 * (512 - 2) / 512, 2 * (256 - 2) / 256 );
    this.res = res;
    this.smokeSource = new THREE.Vector3(0,0,0);
    this.uniforms = {
        bufferTexture: { type: "t" },
        res : {type: 'v2' },
        smokeSource: {type:"v3" },
        color: {type:"v3" },
        radius: {type: 'f'}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        fragmentShader: document.getElementById( 'ExternalDensity' ).innerHTML,
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

ExternalDensity.prototype.compute = function(renderer, input, color, radius, output) {
    this.uniforms.bufferTexture.value = input;
    this.uniforms.res.value = this.res;
    this.uniforms.smokeSource.value = this.smokeSource;
    this.uniforms.color.value = new THREE.Vector3(color[0],color[1],color[2]);
    this.uniforms.radius.value = radius;
    renderer.render(this.scene, this.camera, output, false);
}