import gsap from "gsap";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";

import * as THREE from "three";

const initPlanet = (): { scene: THREE.Scene } => {
  const canvas = document.querySelector(
    "canvas.planet-3D",
  ) as HTMLCanvasElement;

  // scene
  const scene = new THREE.Scene();

  // camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRation: window.devicePixelRatio,
  };

  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    1000,
  );
  camera.position.x = 0;
  camera.position.y = 0.1;
  camera.position.z = 19;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRation);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // texture
  const TL = new THREE.TextureLoader();
  const dayTexture = TL.load("./earth/day.jpg");
  const nightTexture = TL.load("./earth/night.jpg");
  const specularCloudsTexture = TL.load("./earth/specularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();

  dayTexture.anisotropy = baseAnisotropy;
  specularCloudsTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;

  // geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);

  // material
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
    },
    transparent: true,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);

  let sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.8);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);

  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earth);

  // animation loop
  gsap.ticker.add((time) => {
    earth.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRation = window.devicePixelRatio;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRation);
  });

  return { scene };
};

export default initPlanet;
