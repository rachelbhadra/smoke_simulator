var scene;
var camera;
var renderer;

//slabs
var velocity;
var density;
var pressure;
var temperature;
var diverge;

var drawTexture;

var plane;
var finalMaterial;
var quad;

//shaders
var advect;
var buoyancy;
var divergence;
var jacobi;
var externalVelocity;
var externalDensity;
var externalTemperature;
var subtractGradient;
var vorticity;
var draw;
var boundary;

var width;
var height;
var color = [0,0,0];
var res = new THREE.Vector2(512, 256);

var displaySettings = {
    Slab: "Density"
};
gui = new dat.GUI();
gui.add(displaySettings, "Slab", [
    "Density",
    "Velocity",
    "Temperature",
    "Vorticity",
    "Pressure",
    "Divergence"
]);

var pressureSettings = {
    Iterations: 20
};
var pressureFolder = gui.addFolder("Pressure");
    pressureFolder.add(pressureSettings, "Iterations", 0, 50, 1);

var tempSettings = {
    Smoke: 1.0
};
var tempFolder = gui.addFolder("Temperature");
    tempFolder.add(tempSettings, "Smoke", -1.0, 2.0, 0.05);

var vorticitySettings = {
    Curl: 0.2
};

var vorticityFolder = gui.addFolder("Vorticity");
    vorticityFolder.add(vorticitySettings, "Curl", 0, 1.0, 0.05);

var colorSettings = {
    Color: "Constant"
};
gui.add(colorSettings, "Color", [
    "Constant",
    "Cos-Function",
    "Velocity-Based"
]);

var radiusSettings = {
    Radius: 8.0
};

gui.add(radiusSettings, "Radius", 5.0, 20.0, 1.0);

var boundarySettings = {
    Boundaries: false
};
gui.add(boundarySettings, "Boundaries");

function scene_setup(){
    scene = new THREE.Scene();
    width = window.innerWidth;
    height = window.innerHeight;
    camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
}
window.onresize = resize;


function buffer_texture_setup(){

    advect = new Advect(res);
    externalVelocity = new ExternalVelocity(res);
    externalDensity = new ExternalDensity(res);
    externalTemperature = new ExternalTemperature(res);
    buoyancy = new Buoyancy(res);
    draw = new Draw(res);
    jacobi = new Jacobi(res);
    divergence = new Divergence(res);
    subtractGradient = new SubtractGradient(res);
    curl = new Curl(res);
    vorticityConf = new VorticityConf(res);
    boundary = new Boundary(res);

    // create slabs

    velocity = new Slab(res);
    density = new Slab(res);
    temperature = new Slab(res);
    pressure = new Slab(res);
    temperature = new Slab(res);
    diverge = new Slab(res);
    vorticity = new Slab(res);

    //drawTexture is what is actually being drawn

    drawTexture = new THREE.WebGLRenderTarget( res.x, res.y, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });

    plane = new THREE.PlaneBufferGeometry( 2, 2 );
    finalMaterial =  new THREE.MeshBasicMaterial({map: drawTexture});
    quad = new THREE.Mesh( plane, finalMaterial );
    scene.add(quad);
}

//Initialize the Threejs scene
scene_setup();

//Setup the frame buffer/texture we're going to be rendering to instead of the screen
buffer_texture_setup();

//Send position of smoke source with value
var mouseDown = false;
var timeStamp = null;
var lastX = null;
var lastY = null;
function UpdateMousePosition(X,Y){
    var currentTime = Date.now();
    var deltaTime = currentTime - timeStamp;


    externalVelocity.smokeSource.x = X * res.x / window.innerWidth;
    externalVelocity.smokeSource.y = Y * res.y / window.innerHeight;
    externalDensity.smokeSource.x = X * res.x / window.innerWidth;
    externalDensity.smokeSource.y = Y * res.y / window.innerHeight;
    externalTemperature.smokeSource.x = X * res.x / window.innerWidth;
    externalTemperature.smokeSource.y = Y * res.y / window.innerHeight;

    externalVelocity.sourceVelocity.x = Math.round((X-lastX) / deltaTime * 100);
    externalVelocity.sourceVelocity.y = Math.round((Y-lastY) / deltaTime * 100);

    timeStamp = currentTime;
    lastX = X;
    lastY = Y;

    if (timeStamp % 25 == 0) {
      color = [Math.cos(timeStamp)* 150, Math.cos(timeStamp) * Math.sin(timeStamp) * 150, 0];
    }
}
document.onmousemove = function(event){
    UpdateMousePosition(event.clientX, window.innerHeight - event.clientY)
}

document.onmousedown = function(event){
    mouseDown = true;
    timeStamp = Date.now();
    lastX = event.clientX;
    lastY = window.innerHeight - event.clientY;
    externalVelocity.smokeSource.z = 1.0;
    externalDensity.smokeSource.z = 1.0;

    externalTemperature.smokeSource.z = tempSettings.Smoke;

}
document.onmouseup = function(event){
    mouseDown = false;
    externalVelocity.smokeSource.z = 0;
    externalDensity.smokeSource.z = 0;
    externalTemperature.smokeSource.z = 0;
}


//Render everything!
function render() {

  advect.compute(renderer, velocity.read, velocity.read, 1.0, velocity.write);
  velocity.swap();

  advect.compute(renderer, velocity.read, density.read, 0.99, density.write);
  density.swap();

  advect.compute(renderer, velocity.read, temperature.read, 0.99, temperature.write);
  temperature.swap();

  buoyancy.compute(renderer, velocity.read, temperature.read, density.read, 0.0, velocity.write);
  velocity.swap();

  if (boundarySettings.Boundaries) {
    boundary.density();
    boundary.compute(renderer, density.read, density.write);
    density.swap();
    boundary.velocity();
    boundary.compute(renderer, velocity.read, velocity.write);
    velocity.swap();
  }


  //boundary.compute(renderer, velocity.read, velocity.write);
  //velocity.swap();

  externalVelocity.compute(renderer, velocity.read, radiusSettings.Radius, velocity.write);
  velocity.swap();

  //boundary.compute(renderer, velocity.read, velocity.write);
  //velocity.swap();

  let currColor = colorSettings.Color;

  if (currColor == "Constant") {
      color = [50,50,50];
      externalDensity.compute(renderer, density.read, color, radiusSettings.Radius, density.write);
  } else if (currColor == "Cos-Function") {
      externalDensity.compute(renderer, density.read, color, radiusSettings.Radius, density.write);
  } else if (currColor == "Velocity-Based") {
      externalVelocity.compute(renderer, density.read, radiusSettings.Radius, density.write);
  }
  density.swap();

  if (boundarySettings.Boundaries) {
    boundary.density();
    boundary.compute(renderer, density.read, density.write);
    density.swap();
    boundary.velocity();
    boundary.compute(renderer, velocity.read, velocity.write);
    velocity.swap();
  }

  externalTemperature.compute(renderer, temperature.read, 0.01, radiusSettings.Radius, temperature.write);
  temperature.swap();

  curl.compute(renderer, velocity.read, vorticity.write);
  vorticity.swap();

  if (boundarySettings.Boundary) {
    vorticityConf.compute(renderer, velocity.read, vorticity.read, vorticitySettings.Curl, 1.0, velocity.write);
  } else {
    vorticityConf.compute(renderer, velocity.read, vorticity.read, vorticitySettings.Curl, 0.0, velocity.write);
  }
  velocity.swap();

  divergence.compute(renderer, velocity.read, 1.0, 1.0, diverge.write);
  diverge.swap();

  renderer.clearTarget(pressure.read, true, false, false);
  for (var i = 0; i < pressureSettings.Iterations; i++) {
    jacobi.compute(renderer, pressure.read, diverge.read, -1.0, 4.0, pressure.write);
    pressure.swap();
    if (boundarySettings.Boundaries) {
      boundary.pressure();
      boundary.compute(renderer, pressure.read, pressure.write);
      pressure.swap();
    }
  }

  if (boundarySettings.Boundaries) {
    boundary.pressure();
    boundary.compute(renderer, pressure.read, pressure.write);
    pressure.swap();
  }

  subtractGradient.compute(renderer, velocity.read, pressure.read, 1.0, 1.0, velocity.write);
  velocity.swap()

  if (boundarySettings.Boundaries) {
    boundary.velocity();
    boundary.compute(renderer, velocity.read, velocity.write);
    velocity.swap();
  }

  var read;
  let currSlab = displaySettings.Slab;
  if (currSlab == "Density") {
      if (currColor == "Constant") {
        draw.setDisplay(new THREE.Vector3(0.0,0.0,0.0), new THREE.Vector3(1.0,0.2,0.8));
      } else {
        draw.displayNeg();
      }
      read = density.read;
  } else if (currSlab == "Velocity") {
      draw.displayNeg();
      read = velocity.read;
  } else if (currSlab == "Temperature") {
      draw.setDisplay(new THREE.Vector3(0.5,0.5,0.5), new THREE.Vector3(1.0,1.0,1.0));
      read = temperature.read;
  } else if (currSlab == "Vorticity") {
      draw.displayNeg();
      read = vorticity.read;
  } else if (currSlab == "Pressure") {
      draw.displayNeg();
      read = pressure.read;
  } else if (currSlab == "Divergence") {
      draw.displayNeg();
      read = diverge.read;
  }

  draw.compute(renderer, read, drawTexture);
  
  renderer.render( scene, camera );

  requestAnimationFrame( render );

}
render();
