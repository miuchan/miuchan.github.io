import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.159/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('life-sphere');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x010510, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 9);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.minDistance = 6;
controls.maxDistance = 16;

const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 0.75);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xf8fafc, 0.65);
keyLight.position.set(6, 8, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.55);
rimLight.position.set(-6, -8, -10);
scene.add(rimLight);

const LAT_DIVS = 24;
const LON_DIVS = 48;
const CELL_COUNT = LAT_DIVS * LON_DIVS;
const NEIGHBOR_ANGLE = 0.24;
const STEP_INTERVAL = 460;
const RADIUS = 4.2;

const cells = new Uint8Array(CELL_COUNT);
const buffer = new Uint8Array(CELL_COUNT);

const positions = [];
const aliveColors = [];
const neighbourList = Array.from({ length: CELL_COUNT }, () => []);
const tmpColor = new THREE.Color();

for (let lat = 0; lat < LAT_DIVS; lat += 1) {
  const phi = Math.PI * ((lat + 0.5) / LAT_DIVS);
  const latRatio = lat / (LAT_DIVS - 1);
  for (let lon = 0; lon < LON_DIVS; lon += 1) {
    const theta = 2 * Math.PI * (lon / LON_DIVS);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    positions.push(new THREE.Vector3(x, y, z).multiplyScalar(RADIUS));

    tmpColor.setHSL(0.58 - latRatio * 0.3, 0.75, 0.52 + (0.18 * (1 - Math.abs(0.5 - latRatio) * 2)));
    aliveColors.push(tmpColor.clone());
  }
}

const unitPositions = positions.map((vec) => vec.clone().normalize());

for (let i = 0; i < CELL_COUNT; i += 1) {
  for (let j = i + 1; j < CELL_COUNT; j += 1) {
    const dot = THREE.MathUtils.clamp(unitPositions[i].dot(unitPositions[j]), -1, 1);
    const angle = Math.acos(dot);
    if (angle <= NEIGHBOR_ANGLE) {
      neighbourList[i].push(j);
      neighbourList[j].push(i);
    }
  }
}

const neighbourCounts = neighbourList.map((list) => list.length);
const minNeighbours = Math.min(...neighbourCounts);
const maxNeighbours = Math.max(...neighbourCounts);
const avgNeighbours = neighbourCounts.reduce((sum, count) => sum + count, 0) / neighbourCounts.length;
console.info('Sphere life neighbour stats', { minNeighbours, maxNeighbours, avgNeighbours: avgNeighbours.toFixed(2) });

const sphereGeometry = new THREE.SphereGeometry(0.18, 12, 12);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.2,
  roughness: 0.35,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  emissive: 0x082f49,
  emissiveIntensity: 0.35,
});

const instanced = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, CELL_COUNT);
instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(instanced);

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS - 0.08, 64, 32),
  new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.9,
    metalness: 0.05,
    opacity: 0.35,
    transparent: true,
    emissive: 0x020617,
    emissiveIntensity: 0.25,
  }),
);
scene.add(globe);

const identityQuaternion = new THREE.Quaternion();
const aliveScale = new THREE.Vector3(0.32, 0.32, 0.32);
const deadScale = new THREE.Vector3(0.0001, 0.0001, 0.0001);
const deadColor = new THREE.Color(0x0b1120);
const matrix = new THREE.Matrix4();

const generationLabel = document.querySelector('[data-generation]');
const populationLabel = document.querySelector('[data-population]');
const resetButton = document.querySelector('[data-reset]');

let generation = 0;
let population = 0;

function refreshInstances() {
  population = 0;
  for (let i = 0; i < CELL_COUNT; i += 1) {
    const alive = cells[i] === 1;
    const scale = alive ? aliveScale : deadScale;
    matrix.compose(positions[i], identityQuaternion, scale);
    instanced.setMatrixAt(i, matrix);
    instanced.setColorAt(i, alive ? aliveColors[i] : deadColor);
    if (alive) {
      population += 1;
    }
  }
  instanced.instanceMatrix.needsUpdate = true;
  instanced.instanceColor.needsUpdate = true;
}

function updateLabels() {
  if (generationLabel) {
    generationLabel.textContent = generation.toString();
  }
  if (populationLabel) {
    populationLabel.textContent = population.toString();
  }
}

function randomizeCells() {
  for (let i = 0; i < CELL_COUNT; i += 1) {
    cells[i] = Math.random() < 0.28 ? 1 : 0;
  }
  generation = 0;
  refreshInstances();
  updateLabels();
}

function stepLife() {
  let aliveCount = 0;
  for (let i = 0; i < CELL_COUNT; i += 1) {
    const neighbours = neighbourList[i];
    let sum = 0;
    for (let k = 0; k < neighbours.length; k += 1) {
      sum += cells[neighbours[k]];
    }
    const alive = cells[i] === 1;
    let next = 0;
    if (alive) {
      next = sum === 2 || sum === 3 ? 1 : 0;
    } else {
      next = sum === 3 ? 1 : 0;
    }
    buffer[i] = next;
    if (next === 1) {
      aliveCount += 1;
    }
  }

  cells.set(buffer);
  if (aliveCount === 0) {
    randomizeCells();
    return;
  }

  generation += 1;
  refreshInstances();
  updateLabels();
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

resetButton?.addEventListener('click', () => {
  randomizeCells();
});

window.addEventListener('resize', () => {
  resizeRenderer();
});

resizeRenderer();
randomizeCells();
requestAnimationFrame(animate);
