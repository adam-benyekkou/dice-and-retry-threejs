import * as THREE from 'three';
import gsap from 'gsap';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Light pulsing parameters
const lightPulse = {
    ambient: {
        minIntensity: 3,
        maxIntensity: 7,
        speed: 0.3
    },
    points: {
        minIntensity: 70,
        maxIntensity: 130,
        speed: 0.5,
        phaseOffset: Math.PI / 2 // Creates a wave-like effect across lights
    }
};

// Dicerolling function
let diceModel;
let diceroll; // This will only be used if someone clicks Roll
let isRolling = false;
RectAreaLightUniformsLib.init();

function dicerolling() {
    // Prevent rapid clicking during animation
    if (isRolling) return;

    isRolling = true;
    diceroll = Math.floor(Math.random() * 6) + 1;
    console.log("Rolling dice: " + diceroll);

    if (diceModel) {
        // For position animations
        gsap.to(diceModel.position, {duration: 1, delay: 0.2, x: 3, y: 5});
        gsap.to(diceModel.position, {duration: 1, delay: 0.6, x: -4, y: 5});
        gsap.to(diceModel.position, {duration: 1, delay: 1.0, x: -3, y: 0});
        gsap.to(diceModel.position, {duration: 1, delay: 1.4, x: 0});

        // For rotation animations
        gsap.to(diceModel.rotation, {duration: 1, delay: 0.2, x: -Math.PI * 4});
        gsap.to(diceModel.rotation, {duration: 1, delay: 0.6, y: -Math.PI * 4});
        gsap.to(diceModel.rotation, {duration: 1, delay: 1.0, x: Math.PI * 4});

        // Final position based on roll result
        switch (diceroll) {
            case 1:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: 0, y: Math.PI / 2, z: 0});
                break;
            case 2:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: Math.PI / 2, y: -Math.PI / 2, z: 0});
                break;
            case 3:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: Math.PI, y: 0, z: Math.PI});
                break;
            case 4:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: 0, y: 0, z: 0});
                break;
            case 5:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: -Math.PI / 2, y: -Math.PI / 2, z: 0});
                break;
            case 6:
                gsap.to(diceModel.rotation, {duration: 1, delay: 1.4, x: 0, y: -Math.PI / 2, z: 0});
                break;
        }
        gsap.to(diceModel.scale, {duration: 1, delay: 1.8, x: 2.5, y: 2.5, z: 2.5});
        gsap.to(diceModel.scale, {duration: 1, delay: 2.2, x: 1, y: 1, z: 1});

        // Reset isRolling after animation completes
        setTimeout(() => {
            isRolling = false;
        }, 2500);
    }
}

const canvas = document.querySelector('canvas.webgl');

// Create roll button
const rollButton = document.createElement('button');
rollButton.textContent = 'Roll Dice';
rollButton.id = 'rollButton';
rollButton.style.position = 'absolute';
rollButton.style.bottom = '20px';
rollButton.style.left = '50%';
rollButton.style.transform = 'translateX(-50%)';
rollButton.style.zIndex = '10';
document.body.appendChild(rollButton);

// Add event listener
rollButton.addEventListener('click', dicerolling);

// Scene
const scene = new THREE.Scene()

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xa5e6ba, 5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xe0aaff, 1);
directionalLight.position.set(5, 5, 5);


scene.add(directionalLight);

// Top right point light
const pointLightTopRight = new THREE.PointLight(0xff00ff, 100, 10);
pointLightTopRight.position.set(12, 6.5, -2);
scene.add(pointLightTopRight);


// Top left point light
const pointLightTopLeft = new THREE.PointLight(0x00ffff, 100, 10);  // Cyan color
pointLightTopLeft.position.set(-11, 6, -2);
scene.add(pointLightTopLeft);


// Bottom left point light
const pointLightBottomLeft = new THREE.PointLight(0xffff00, 100, 10);  // Yellow color
pointLightBottomLeft.position.set(-11.5, -6, -2);
scene.add(pointLightBottomLeft);


// Bottom right point light
const pointLightBottomRight = new THREE.PointLight(0x00ff00, 100, 10);  // Green color
pointLightBottomRight.position.set(11.5, -6, -2);
scene.add(pointLightBottomRight);

//Add RectAreaLight
const purpleRectLight = new THREE.RectAreaLight(0x800080, 50, 5, 5);
purpleRectLight.position.set(0, 0, -2); // Position it behind the dice
purpleRectLight.lookAt(0, 0, 0); // Point it toward the center where the dice is
scene.add(purpleRectLight);

//File loader 3d
const loader = new GLTFLoader();

loader.load('/models/D6_Test.glb', function(gltf) {
    // Assign the loaded model to our variable
    diceModel = gltf.scene;

    // Add it to the scene
    scene.add(diceModel);

    // Set initial position and rotation, but don't animate
    diceModel.position.set(0, 0, 0);
    diceModel.rotation.set(0, Math.PI / 2, 0);
    diceModel.scale.set(1, 1, 1);

}, undefined, function(error) {
    console.error(error);
});

// Rolling surface;
const textureLoader = new THREE.TextureLoader()
const textureRollSurface = textureLoader.load(
    '/textures/rollSurfaceTexture.png',
    () =>
    {
        console.log('loading finished')
    },
    () =>
    {
        console.log('loading progressing')
    },
    () =>
    {
        console.log('loading error')
    }
)
textureRollSurface.colorSpace = THREE.SRGBColorSpace
const rollSurfaceGeometry = new THREE.PlaneGeometry(25, 18, 1)

const rollSurfaceMaterial = new THREE.MeshStandardMaterial({
    map: textureRollSurface,
    color: 0x9ac6c5,
    roughness: 0.6,
    metalness: 0.1
});
const rollSurface = new THREE.Mesh(rollSurfaceGeometry, rollSurfaceMaterial);
rollSurface.position.set(0,0, -3)
scene.add(rollSurface);
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
camera.position.y = 0
camera.position.x = 0
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate permanent
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Pulse ambient light (Cthulhu breathing effect)
    const ambientPulse = lightPulse.ambient.minIntensity +
        Math.sin(elapsedTime * lightPulse.ambient.speed) *
        ((lightPulse.ambient.maxIntensity - lightPulse.ambient.minIntensity) / 2);
    ambientLight.intensity = ambientPulse;

    // Pulse the four corner lights with offset phases to create a circling effect
    const basePulse = Math.sin(elapsedTime * lightPulse.points.speed);
    const pulseRange = (lightPulse.points.maxIntensity - lightPulse.points.minIntensity) / 2;
    const baseIntensity = lightPulse.points.minIntensity + pulseRange;

    pointLightTopRight.intensity = baseIntensity + basePulse * pulseRange;
    pointLightTopLeft.intensity = baseIntensity + Math.sin(elapsedTime * lightPulse.points.speed + lightPulse.points.phaseOffset) * pulseRange;
    pointLightBottomLeft.intensity = baseIntensity + Math.sin(elapsedTime * lightPulse.points.speed + 2 * lightPulse.points.phaseOffset) * pulseRange;
    pointLightBottomRight.intensity = baseIntensity + Math.sin(elapsedTime * lightPulse.points.speed + 3 * lightPulse.points.phaseOffset) * pulseRange;

    // Update controls

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()