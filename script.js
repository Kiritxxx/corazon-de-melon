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

const renderer = new THREE.WebGLRenderer({ antialias: true }); // Añadido antialias para mejor calidad
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);
controlsWebGL.enableDamping = true; // Suaviza el movimiento de cámara

/* REFERENCIA AL TEXTO */
const textContainer = document.getElementById('text-container');

// Función que se ejecuta cuando el corazón termina de formarse
function onHeartFormed() {
  // Animación de aparición del texto con GSAP
  gsap.to(textContainer, {
    duration: 2,    // Tarda 2 segundos en aparecer
    opacity: 1,     // Se vuelve totalmente visible
    scale: 1,       // Vuelve a su tamaño original (efecto zoom suave)
    ease: "back.out(1.7)", // Efecto de rebote suave al final
    delay: 0.5      // Pequeño retraso tras formarse el corazón
  });
}

/* PARTICLES */
// Creamos la timeline principal
const tl = gsap.timeline({
  // quitamos repeat: -1 y yoyo: true para que se forme una vez y se quede quieto
  // permitiendo que aparezca el texto.
  onComplete: onHeartFormed // <--- AQUÍ ESTÁ LA CLAVE: Llama a la función al terminar
});

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];

// Reducimos un poco el paso (0.15 en vez de 0.1) para mejorar rendimiento, 
// compensado con partículas más grandes.
for (let i = 0; i < length; i += 0.15) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  
  // Dispersión inicial aleatoria
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
  
  // Animación de cada partícula hacia su posición en el corazón
  tl.from(vector, {
      x: 600 / 2, // Centro X del SVG
      y: -552 / 2, // Centro Y del SVG
      z: 0,
      ease: "power2.inOut",
      duration: gsap.utils.random(2, 5) // Duración aleatoria para efecto orgánico
    },
    i * 0.002 // El retraso crea el efecto de propagación
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
// Aumentado el tamaño a 4 para que se vea más denso
const material = new THREE.PointsMaterial( { color: 0xee5282, blending: THREE.AdditiveBlending, size: 4, transparent: true } );
const particles = new THREE.Points(geometry, material);

// Centrado del objeto de partículas en la escena
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

// Rotación suave automática de la escena
gsap.fromTo(scene.rotation, {
  y: -0.2
}, {
  y: 0.2,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut',
  duration: 6 // Más lento para no marear al leer
});

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  controlsWebGL.update(); // Necesario para enableDamping
  // Actualiza la geometría en cada frame con las nuevas posiciones de los vértices animados
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