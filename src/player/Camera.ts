import * as THREE from 'three';
import { FOV, NEAR_PLANE, FAR_PLANE } from '../utils/Constants';

export class Camera {
  camera: THREE.PerspectiveCamera;
  yaw = 0;
  pitch = 0;
  sensitivity = 0.002;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, NEAR_PLANE, FAR_PLANE);
  }

  onMouseMove(dx: number, dy: number): void {
    this.yaw -= dx * this.sensitivity;
    this.pitch -= dy * this.sensitivity;
    this.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.pitch));
    this.updateRotation();
  }

  private updateRotation(): void {
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }

  setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  getDirection(): THREE.Vector3 {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    return dir;
  }

  getForwardXZ(): THREE.Vector3 {
    const dir = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    return dir.normalize();
  }

  getRightXZ(): THREE.Vector3 {
    const dir = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    return dir.normalize();
  }

  onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setFOV(fov: number): void {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }
}
