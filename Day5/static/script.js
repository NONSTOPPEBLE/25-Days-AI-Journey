function toggleHeader() {
  const header = document.getElementById('header');
  const toggleText = document.getElementById('toggleHeader');
  header.classList.toggle('collapsed');
  toggleText.textContent = header.classList.contains('collapsed') ? 'Show Header' : 'Hide Header';
}

function fetchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;

  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById('city').textContent = `City: ${data.city}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.temperature}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind_speed} m/s`;
    document.getElementById('description').textContent = `Description: ${data.description}`;
  });
}

// Initialize 3D Earth using external source (for Day 5 project)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/JamesTitus/three.js/master/examples/textures/earth.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
