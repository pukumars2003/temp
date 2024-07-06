// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep the 3D object on a global variable so we can access it later
let object;
let mixer;

// Function to set model properties based on screen size
function setModelProperties() {
    if (window.innerWidth <= 768) { // Mobile
        object.scale.set(10, 10, 10); // Adjust scale for mobile
        object.position.set(0, -8, 0); // Adjust position for mobile
        camera.position.set(0, 0, 20); // Adjust camera position for mobile
    } else { // PC
        object.scale.set(15, 15, 15); // Adjust scale for PC
        object.position.set(0, -16, 0); // Adjust position for PC
        camera.position.set(0, 0, 25); // Adjust camera position for PC
    }
}

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    'models/wishes/scene.gltf', // Replace with your GLTF file path
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        setModelProperties(); // Set model properties based on screen size

        scene.add(object);

        // Create an animation mixer for the model
        mixer = new THREE.AnimationMixer(object);

        // Play the first animation clip
        if (gltf.animations.length > 0) {
            const clip = gltf.animations[0];
            const action = mixer.clipAction(clip);
            action.play();
        }
    },
    function (xhr) {
        // While it is loading, log the progress
        if (xhr.total > 0) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        } else {
            console.log('Loading...');
        }
    },
    function (error) {
        // If there is an error, log it
        console.error(error);
    }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Ensure crisp rendering on high-DPI devices

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(600, 600, 600); // Top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

// Render the scene
function animate() {
    requestAnimationFrame(animate);

    // Update the mixer for animation
    if (mixer) mixer.update(0.01);

    renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (object) setModelProperties(); // Update model properties on resize
});

// Add touch controls for mobile devices
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Start the 3D rendering
animate();
