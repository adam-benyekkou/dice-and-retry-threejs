import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Dicerolling function
let diceModel;
let diceroll; // This will only be used if someone clicks Roll
let isRolling = false;

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
const ambientLight = new THREE.AmbientLight(0xa5e6ba, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xe0aaff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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

const rollSurfaceMaterial = new THREE.MeshBasicMaterial({ map: textureRollSurface, color: 0x9ac6c5 });
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

    // Update controls

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()