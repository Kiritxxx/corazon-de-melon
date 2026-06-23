console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);
controlsWebGL.enableDamping = true; 

/* REFERENCIA AL TEXTO */
const textContainer = document.getElementById('text-container');

function onHeartFormed() {
  gsap.to(textContainer, {
    duration: 2,    
    opacity: 1,     
    scale: 1,       
    ease: "back.out(1.7)", 
    delay: 0.5      
  });
}

/* PARTICLES */
const tl = gsap.timeline({
  onComplete: onHeartFormed 
});

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];

for (let i = 0; i < length; i += 0.15) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
  
  tl.from(vector, {
      x: 600 / 2, 
      y: -552 / 2, 
      z: 0,
      ease: "power2.inOut",
      duration: gsap.utils.random(2, 5) 
    },
    i * 0.002 
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

// ¡AQUÍ ESTÁ EL CAMBIO PRINCIPAL EN 3D! 
// El color hexadecimal ahora es morado: 0x8a2be2
const material = new THREE.PointsMaterial( { color: 0x8a2be2, blending: THREE.AdditiveBlending, size: 4, transparent: true } );
const particles = new THREE.Points(geometry, material);

particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

gsap.fromTo(scene.rotation, {
  y: -0.2
}, {
  y: 0.2,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut',
  duration: 6 
});

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  controlsWebGL.update(); 
  geometry.setFromPoints(vertices);
  renderer.render(scene, camera);
}

/* EVENTS */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

requestAnimationFrame(render);

requestAnimationFrame(render);
