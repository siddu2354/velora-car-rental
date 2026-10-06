import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ======================================================
// SCENE
// ======================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);


// ======================================================
// CAMERA
// ======================================================

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 2.8, 7);

camera.lookAt(0, 0.7, 0);


// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

// Updated Three.js shadow setting
renderer.shadowMap.type =
  THREE.PCFShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

document.body.appendChild(
  renderer.domElement
);


// ======================================================
// ROAD
// ======================================================

const roadGeometry =
  new THREE.PlaneGeometry(
    8.5,
    70
  );

const roadMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.15,
    transparent: true,
    opacity: 1
  });

const road =
  new THREE.Mesh(
    roadGeometry,
    roadMaterial
  );

road.rotation.x =
  -Math.PI / 2;

road.position.y =
  -0.05;

road.position.z =
  -18;

road.receiveShadow = true;

scene.add(road);


// ======================================================
// ROAD CENTER LINES
// ======================================================

const lineMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1
  });

const roadLines = [];

for (
  let z = -49;
  z < 17;
  z += 4
) {

  const lineGeometry =
    new THREE.PlaneGeometry(
      0.11,
      1.6
    );

  const line =
    new THREE.Mesh(
      lineGeometry,
      lineMaterial
    );

  line.rotation.x =
    -Math.PI / 2;

  line.position.set(
    0,
    0.01,
    z
  );

  scene.add(line);

  roadLines.push({
    mesh: line,
    originalZ: z
  });

}


// ======================================================
// LIGHTING
// ======================================================

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    1.2
  );

scene.add(
  ambientLight
);


const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );

keyLight.position.set(
  4,
  6,
  6
);

keyLight.castShadow = true;

scene.add(
  keyLight
);


// ======================================================
// RED LIGHT
// ======================================================

const redLight =
  new THREE.PointLight(
    0xff0000,
    5,
    7
  );

redLight.position.set(
  0,
  1,
  2
);

scene.add(
  redLight
);


// ======================================================
// CAR
// ======================================================

let car = null;

const CAR_START_Z = 2.5;

const DRIVE_DISTANCE = 25;


// ======================================================
// LOAD CAR
// ======================================================

const loader =
  new GLTFLoader();

loader.load(

  '/car.glb',

  (gltf) => {

    car = gltf.scene;

    console.log(
      'CAR LOADED:',
      car
    );


    car.traverse(
      (object) => {

        if (!object.isMesh) {
          return;
        }

        object.castShadow = true;

        object.receiveShadow = true;


        if (!object.material) {
          return;
        }


        const materials =
          Array.isArray(object.material)
            ? object.material
            : [object.material];


        materials.forEach(
          (material) => {

            const mat =
              material.clone();

            mat.transparent = true;

            mat.opacity = 1;


            // ==========================================
            // RED BODY
            // ==========================================

            if (mat.color) {

              const r =
                mat.color.r;

              const g =
                mat.color.g;

              const b =
                mat.color.b;


              if (
                r > 0.45 &&
                g > 0.30 &&
                b < 0.35
              ) {

                mat.color.set(
                  0xb00000
                );

                mat.metalness =
                  0.8;

                mat.roughness =
                  0.2;

              }

            }


            // ==========================================
            // BLACK PARTS
            // ==========================================

            if (mat.color) {

              const brightness =
                mat.color.r +
                mat.color.g +
                mat.color.b;


              if (
                brightness < 0.35
              ) {

                mat.color.set(
                  0x050505
                );

                mat.metalness =
                  0.75;

                mat.roughness =
                  0.28;

              }

            }


            object.material =
              mat;

          }
        );

      }
    );


    // ================================================
    // SCALE
    // ================================================

    const box =
      new THREE.Box3()
        .setFromObject(car);

    const size =
      new THREE.Vector3();

    box.getSize(size);


    const largestDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      );


    const targetSize = 4;


    const scale =
      targetSize /
      largestDimension;


    car.scale.setScalar(
      scale
    );


    // ================================================
    // CENTER
    // ================================================

    const centeredBox =
      new THREE.Box3()
        .setFromObject(car);

    const center =
      new THREE.Vector3();

    centeredBox.getCenter(
      center
    );


    car.position.x -=
      center.x;

    car.position.z -=
      center.z;


    // ================================================
    // START POSITION
    // ================================================

    car.position.y =
      0;

    car.position.z =
      CAR_START_Z;


    car.rotation.y =
      Math.PI;


    scene.add(
      car
    );


    console.log(
      'CAR READY'
    );

  },


  undefined,


  (error) => {

    console.error(
      'CAR FAILED TO LOAD:',
      error
    );

  }

);


// ======================================================
// SCROLL
// ======================================================

let targetScroll = 0;

let smoothScroll = 0;


window.addEventListener(
  'scroll',
  () => {

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;


    if (maxScroll <= 0) {
      return;
    }


    targetScroll =
      window.scrollY /
      maxScroll;

  },
  {
    passive: true
  }
);


// ======================================================
// CAR OPACITY
// ======================================================

function setCarOpacity(opacity) {

  if (!car) {
    return;
  }


  car.traverse(
    (object) => {

      if (
        !object.isMesh ||
        !object.material
      ) {
        return;
      }


      const materials =
        Array.isArray(object.material)
          ? object.material
          : [object.material];


      materials.forEach(
        (material) => {

          material.transparent =
            true;

          material.opacity =
            opacity;

        }
      );

    }
  );

}


// ======================================================
// EASING
// ======================================================

function smoothEase(value) {

  return (
    value *
    value *
    (
      3 -
      2 * value
    )
  );

}


// ======================================================
// ANIMATION
// ======================================================

function animate() {

  requestAnimationFrame(
    animate
  );


  // ==================================================
  // SMOOTH SCROLL
  // ==================================================

  smoothScroll +=
    (
      targetScroll -
      smoothScroll
    ) * 0.055;


  // ==================================================
  // CAR DRIVE
  // ==================================================

  let driveProgress =
    smoothScroll / 0.68;


  driveProgress =
    Math.max(
      0,
      Math.min(
        driveProgress,
        1
      )
    );


  const easedDrive =
    smoothEase(
      driveProgress
    );


  // ==================================================
  // CAR MOVEMENT
  // ==================================================

  if (car) {

    car.position.z =
      CAR_START_Z -
      (
        easedDrive *
        DRIVE_DISTANCE
      );

  }


  // ==================================================
  // ROAD LINES
  // ==================================================

  roadLines.forEach(
    (lineData) => {

      const roadMove =
        easedDrive *
        DRIVE_DISTANCE;


      let newZ =
        lineData.originalZ -
        roadMove;


      const ROAD_FRONT = 16;

      const ROAD_BACK = -52;

      const ROAD_LENGTH =
        ROAD_FRONT -
        ROAD_BACK;


      while (
        newZ >
        ROAD_FRONT
      ) {

        newZ -=
          ROAD_LENGTH;

      }


      while (
        newZ <
        ROAD_BACK
      ) {

        newZ +=
          ROAD_LENGTH;

      }


      lineData.mesh.position.z =
        newZ;

    }
  );


  // ==================================================
  // ROAD + CAR FADE
  // ==================================================

  let fadeProgress =
    (
      smoothScroll -
      0.68
    ) / 0.07;


  fadeProgress =
    Math.max(
      0,
      Math.min(
        fadeProgress,
        1
      )
    );


  const fadeEase =
    smoothEase(
      fadeProgress
    );


  const visibility =
    1 -
    fadeEase;


  roadMaterial.opacity =
    visibility;

  lineMaterial.opacity =
    visibility;

  setCarOpacity(
    visibility
  );


  // ==================================================
  // VELORA TITLE
  // ==================================================

  const title =
    document.getElementById(
      'hero-title'
    );


  console.log(
    'TITLE ELEMENT:',
    title
  );


  if (title) {

    let titleProgress =
      (
        smoothScroll -
        0.69
      ) / 0.10;


    titleProgress =
      Math.max(
        0,
        Math.min(
          titleProgress,
          1
        )
      );


    const titleEase =
      smoothEase(
        titleProgress
      );


    title.style.opacity =
      titleEase;


    title.style.transform =
      `translate(-50%, ${
        30 -
        titleEase * 30
      }px)`;

  }


  // ==================================================
  // REGISTER BUTTON
  // ==================================================

  const registerButton =
    document.getElementById(
      'register-button'
    );


  console.log(
    'REGISTER BUTTON:',
    registerButton
  );


  if (registerButton) {

    let buttonProgress =
      (
        smoothScroll -
        0.72
      ) / 0.10;


    buttonProgress =
      Math.max(
        0,
        Math.min(
          buttonProgress,
          1
        )
      );


    const buttonEase =
      smoothEase(
        buttonProgress
      );


    registerButton.style.opacity =
      buttonEase;


    registerButton.style.transform =
      `translate(-50%, ${
        20 -
        buttonEase * 20
      }px)`;


    registerButton.style.pointerEvents =
      buttonEase > 0.05
        ? 'auto'
        : 'none';

  }


  // ==================================================
  // RENDER
  // ==================================================

  renderer.render(
    scene,
    camera
  );

}


// ======================================================
// START
// ======================================================

animate();


// ======================================================
// RESPONSIVE
// ======================================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);