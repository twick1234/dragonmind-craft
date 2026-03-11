export interface KeyState {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  inventory: boolean;
  drop: boolean;
  attack: boolean;
  place: boolean;
}

export class InputManager {
  keys: KeyState = {
    forward:false, back:false, left:false, right:false,
    jump:false, sprint:false, inventory:false, drop:false,
    attack:false, place:false,
  };
  mouseDX = 0;
  mouseDY = 0;
  scrollDelta = 0;
  hotbarKey: number | null = null;
  locked = false;
  private canvas: HTMLElement;

  onMouseMove?: (dx: number, dy: number) => void;
  onAttack?: () => void;
  onPlace?: () => void;
  onScroll?: (delta: number) => void;
  onHotbar?: (index: number) => void;
  onInventory?: () => void;
  onPause?: () => void;
  onFullscreen?: () => void;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.initListeners();
  }

  private initListeners(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    this.canvas.addEventListener('click', this.requestPointerLock.bind(this));
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
    document.addEventListener('mousemove', this.onMouseMoveRaw.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('wheel', this.onWheel.bind(this), { passive: true });
  }

  requestPointerLock(): void {
    this.canvas.requestPointerLock();
  }

  exitPointerLock(): void {
    document.exitPointerLock();
  }

  private onPointerLockChange(): void {
    this.locked = document.pointerLockElement === this.canvas;
  }

  private onMouseMoveRaw(e: MouseEvent): void {
    if (!this.locked) return;
    this.mouseDX += e.movementX;
    this.mouseDY += e.movementY;
    this.onMouseMove?.(e.movementX, e.movementY);
  }

  private onMouseDown(e: MouseEvent): void {
    if (!this.locked) return;
    if (e.button === 0) { this.keys.attack = true; this.onAttack?.(); }
    if (e.button === 2) { this.keys.place = true; this.onPlace?.(); }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 0) this.keys.attack = false;
    if (e.button === 2) this.keys.place = false;
  }

  private onWheel(e: WheelEvent): void {
    const delta = e.deltaY > 0 ? 1 : -1;
    this.onScroll?.(delta);
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.applyKey(e.code, true);
    // Number keys for hotbar
    if (e.code.startsWith('Digit')) {
      const n = parseInt(e.code.slice(5));
      if (n >= 1 && n <= 9) this.onHotbar?.(n - 1);
    }
    if (e.code === 'KeyE') this.onInventory?.();
    if (e.code === 'Escape') this.onPause?.();
    if (e.code === 'F11') this.onFullscreen?.();
    e.preventDefault?.();
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.applyKey(e.code, false);
  }

  private applyKey(code: string, pressed: boolean): void {
    const map: Record<string, keyof KeyState> = {
      'KeyW':'forward', 'ArrowUp':'forward',
      'KeyS':'back', 'ArrowDown':'back',
      'KeyA':'left', 'ArrowLeft':'left',
      'KeyD':'right', 'ArrowRight':'right',
      'Space':'jump',
      'ShiftLeft':'sprint', 'ShiftRight':'sprint',
      'KeyQ':'drop',
    };
    const action = map[code];
    if (action) this.keys[action] = pressed;
  }

  consumeScroll(): number {
    const d = this.scrollDelta;
    this.scrollDelta = 0;
    return d;
  }

  destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}
