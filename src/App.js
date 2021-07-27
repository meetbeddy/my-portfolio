import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/layouts/NavBar";
import SideNav from "./components/layouts/SideNav";
import HomePage from "./components/pages/home/HomePage";
import Contact from "./components/pages/contact/Contact";
import About from "./components/pages/about/About";
import Work from "./components/pages/work/Work";
import Skills from "./components/pages/skills/Skills";
import * as THREE from "three";

function App() {
  const [isMobile, setIsmobile] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const threeRef = ref.current;
    let isMounted = false;
    const detect = () => {
      if (!isMounted) {
        setIsmobile(
          !!navigator.maxTouchPoints && window.PointerEvent ? true : false
        );
      }
    };
    // window.addEventListener("resize", detect);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("gray"), 0.01);
    ref.current.appendChild(renderer.domElement);

    // const textureLoader = new THREE.TextureLoader();
    // //  const normalTexture = textureLoader.load(NormalMap1);
    // //  const particleStar = textureLoader.load(star);

    const box = new THREE.BoxBufferGeometry(2, 3, 65);
    const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
    const boxMaterial = new THREE.MeshBasicMaterial();
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    // material.normalMap = normalTexture;
    material.color = new THREE.Color(0x292929);

    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    camera.position.x = -1;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);

    //lights
    const pointLight = new THREE.PointLight(0xffffff, 0.7);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    // pointLight.intensity = 2;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff0000, 5);
    pointLight2.position.x = -1.86;
    pointLight2.position.y = 1;
    pointLight2.position.z = -1.65;
    // pointLight2.intensity = 5;
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xe1fff, 1);
    pointLight3.position.x = 2.13;
    pointLight3.position.y = 1;
    pointLight3.position.z = 0.65;
    // pointLight3.intensity = 1;
    scene.add(pointLight3);

    //resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      detect();
    });

    document.addEventListener("mousemove", onDocumentMouseMove);
    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    const windowhalfx = window.innerWidth / 2;
    const windowhalfy = window.innerHeight / 2;

    function onDocumentMouseMove(e) {
      mouseX = e.clientX - windowhalfx;
      mouseY = e.clientX - windowhalfy;
    }

    //animate
    const clock = new THREE.Clock();
    var animate = function () {
      targetX = mouseX * 0.01;
      targetY = mouseY * 0.01;

      const elapsedTime = clock.getElapsedTime();

      sphere.rotation.x = 0.5 * (targetY - sphere.rotation.x);
      sphere.rotation.y = 0.5 * (targetX - sphere.rotation.y);
      sphere.rotation.z += -0.5 * (targetY - sphere.rotation.x);
      sphere.rotation.z = 0.5 * elapsedTime;

      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      threeRef.removeChild(renderer.domElement);
      isMounted = true;
    };
  }, []);

  return (
    <div ref={ref} className="App">
      {isMobile ? <NavBar /> : <SideNav />}

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={About} />
        <Route
          exact
          path="/contact"
          component={Contact}
          exit={{ opacity: 0 }}
        />
        <Route exact path="/skills" component={Skills} />
        <Route exact path="/works" component={Work} />
      </Switch>
    </div>
  );
}

export default App;
