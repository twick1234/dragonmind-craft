import * as THREE from 'three';
import { FOV, NEAR_PLANE, FAR_PLANE } from '../utils/Constants';

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  ambientLight: THREE.AmbientLight;
  sunLight: THREE.DirectionalLight;
  fogColor = new THREE.Color(0xc0d8ff);

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // pixel art feel
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(this.fogColor, 80, 256);
    this.scene.background = this.fogColor;

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.0);
    this.sunLight.position.set(100, 150, 100);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 500;
    this.sunLight.shadow.camera.left = -200;
    this.sunLight.shadow.camera.right = 200;
    this.sunLight.shadow.camera.top = 200;
    this.sunLight.shadow.camera.bottom = -200;
    this.scene.add(this.sunLight);

    window.addEventListener('resize', this.onResize.bind(this));
  }

  updateDayNight(timeOfDay: number): void {
    // timeOfDay: 0-1 (0=midnight, 0.25=dawn, 0.5=noon, 0.75=dusk)
    const noon = Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2);
    const sunAngle = timeOfDay * Math.PI * 2;

    this.sunLight.position.set(
      Math.sin(sunAngle) * 200,
      Math.cos(sunAngle) * 200,
      100
    );

    const dayFactor = Math.max(0, noon);
    const nightFactor = Math.max(0, -noon);

    // Sky color
    const daySky = new THREE.Color(0x7ab4f5);
    const nightSky = new THREE.Color(0x0a0a20);
    const sunsetSky = new THREE.Color(0xff7733);
    const isSetRise = Math.abs(noon) < 0.3;

    let skyColor: THREE.Color;
    if (isSetRise) {
      skyColor = new THREE.Color().lerpColors(sunsetSky, dayFactor > 0 ? daySky : nightSky, Math.abs(noon) / 0.3);
    } else {
      skyColor = new THREE.Color().lerpColors(nightSky, daySky, dayFactor);
    }

    this.scene.background = skyColor;
    this.fogColor.copy(skyColor).lerp(new THREE.Color(0xffffff), 0.3);
    (this.scene.fog as THREE.Fog).color = this.fogColor;

    // Light intensity
    this.sunLight.intensity = Math.max(0, noon) * 1.2;
    this.sunLight.color.setHex(timeOfDay < 0.5 ? 0xffeedd : 0xff8833);
    this.ambientLight.intensity = 0.1 + dayFactor * 0.5;
  }

  render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  onResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
