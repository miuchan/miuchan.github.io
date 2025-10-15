import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.159/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('life-3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x020617, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(14, 14, 20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 32;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
keyLight.position.set(10, 16, 12);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xf472b6, 0.55);
rimLight.position.set(-12, -16, -10);
scene.add(rimLight);

const SIZE = 16;
const TOTAL_CELLS = SIZE * SIZE * SIZE;
const STEP_INTERVAL = 420;

const grid = new Uint8Array(TOTAL_CELLS);
const buffer = new Uint8Array(TOTAL_CELLS);

const positions = [];
const aliveColors = [];
const color = new THREE.Color();
const centerOffset = (SIZE - 1) / 2;
const spacing = 1.1;

for (let z = 0; z < SIZE; z += 1) {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const px = (x - centerOffset) * spacing;
      const py = (y - centerOffset) * spacing;
      const pz = (z - centerOffset) * spacing;
      positions.push(new THREE.Vector3(px, py, pz));

      const heightFactor = z / (SIZE - 1);
      color.setHSL(0.56 - heightFactor * 0.28, 0.75, 0.48 + heightFactor * 0.22);
      aliveColors.push(color.clone());
    }
  }
}

const baseGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.15,
  roughness: 0.45,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
});

const mesh = new THREE.InstancedMesh(baseGeometry, material, TOTAL_CELLS);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(mesh);

const identityQuaternion = new THREE.Quaternion();
const aliveScale = new THREE.Vector3(0.94, 0.94, 0.94);
const deadScale = new THREE.Vector3(0.0001, 0.0001, 0.0001);
const deadColor = new THREE.Color(0x0f172a);
const tempMatrix = new THREE.Matrix4();

const generationLabel = document.querySelector('[data-generation]');
const populationLabel = document.querySelector('[data-population]');
const randomButton = document.querySelector('[data-random]');

let generation = 0;
let population = 0;

function randomizeGrid() {
  for (let i = 0; i < TOTAL_CELLS; i += 1) {
    grid[i] = Math.random() < 0.22 ? 1 : 0;
  }
  generation = 0;
  refreshInstances();
  updateLabels();
}

function refreshInstances() {
  population = 0;
  for (let i = 0; i < TOTAL_CELLS; i += 1) {
    const alive = grid[i] === 1;
    const scale = alive ? aliveScale : deadScale;
    tempMatrix.compose(positions[i], identityQuaternion, scale);
    mesh.setMatrixAt(i, tempMatrix);
    mesh.setColorAt(i, alive ? aliveColors[i] : deadColor);
    if (alive) {
      population += 1;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor.needsUpdate = true;
}

function stepLife() {
  let aliveCount = 0;
  for (let z = 0; z < SIZE; z += 1) {
    const zOffset = z * SIZE * SIZE;
    for (let y = 0; y < SIZE; y += 1) {
      const yOffset = y * SIZE;
      for (let x = 0; x < SIZE; x += 1) {
        const idx = zOffset + yOffset + x;
        let neighbours = 0;
        for (let dz = -1; dz <= 1; dz += 1) {
          const nz = (z + dz + SIZE) % SIZE;
          const nzOffset = nz * SIZE * SIZE;
          for (let dy = -1; dy <= 1; dy += 1) {
            const ny = (y + dy + SIZE) % SIZE;
            const nyOffset = ny * SIZE;
            for (let dx = -1; dx <= 1; dx += 1) {
              if (dx === 0 && dy === 0 && dz === 0) continue;
              const nx = (x + dx + SIZE) % SIZE;
              neighbours += grid[nzOffset + nyOffset + nx];
            }
          }
        }
        const alive = grid[idx] === 1;
        let next = 0;
        if (alive) {
          next = neighbours === 4 || neighbours === 5 ? 1 : 0;
        } else {
          next = neighbours === 5 ? 1 : 0;
        }
        buffer[idx] = next;
        if (next === 1) {
          aliveCount += 1;
        }
      }
    }
  }

  grid.set(buffer);
  if (aliveCount === 0) {
    randomizeGrid();
    return;
  }

  generation += 1;
  refreshInstances();
  updateLabels();
}

function updateLabels() {
  if (generationLabel) {
    generationLabel.textContent = generation.toString();
  }
  if (populationLabel) {
    populationLabel.textContent = population.toString();
  }
}

function resizeRenderer() {
  const width = canvas.clientWidth || canvas.parentElement.clientWidth;
  const height = canvas.clientHeight || canvas.parentElement.clientHeight;
  if (width === 0 || height === 0) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

let lastStep = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);
  controls.update();

  if (timestamp - lastStep > STEP_INTERVAL) {
    stepLife();
    lastStep = timestamp;
  }

  renderer.render(scene, camera);
}

randomButton?.addEventListener('click', () => {
  randomizeGrid();
});

window.addEventListener('resize', () => {
  resizeRenderer();
});

resizeRenderer();
randomizeGrid();
requestAnimationFrame(animate);
