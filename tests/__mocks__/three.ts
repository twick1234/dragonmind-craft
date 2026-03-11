// Minimal Three.js mock for Jest tests
class Vector3 {
  x: number; y: number; z: number;
  constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}
  set(x:number,y:number,z:number){this.x=x;this.y=y;this.z=z;return this;}
  add(v:Vector3){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}
  sub(v:Vector3){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}
  copy(v:Vector3){this.x=v.x;this.y=v.y;this.z=v.z;return this;}
  clone(){return new Vector3(this.x,this.y,this.z);}
  normalize(){const l=this.length();if(l>0){this.x/=l;this.y/=l;this.z/=l;}return this;}
  length(){return Math.sqrt(this.x**2+this.y**2+this.z**2);}
  lengthSq(){return this.x**2+this.y**2+this.z**2;}
  distanceTo(v:Vector3){return Math.sqrt((this.x-v.x)**2+(this.y-v.y)**2+(this.z-v.z)**2);}
  multiplyScalar(s:number){this.x*=s;this.y*=s;this.z*=s;return this;}
  equals(v:Vector3){return this.x===v.x&&this.y===v.y&&this.z===v.z;}
}

class Color { setHex(_h:number){return this;} lerpColors(_a:any,_b:any,_t:number){return this;} lerp(_c:any,_t:number){return this;} copy(_c:any){return this;} }
class Euler { constructor(public x=0,public y=0,public z=0,public order='XYZ'){} }
class Quaternion { setFromEuler(_e:any){return this;} }
class BoxGeometry { constructor(_w?:number,_h?:number,_d?:number){} }
class EdgesGeometry { constructor(_g?:any){} }
class BufferGeometry { setAttribute(){}; setIndex(){}; computeBoundingSphere(){}; dispose(){} }
class Float32BufferAttribute { constructor(_a:any,_s:number){} }
class Mesh { position=new Vector3(); rotation={x:0,y:0,z:0}; castShadow=false; receiveShadow=false; geometry={dispose:()=>{}}; material={}; clone(){return new Mesh();} traverse(_f:any){} }
class LineSegments { position=new Vector3(); visible=false; rotation={y:0}; }
class Group { position=new Vector3(); rotation={y:0}; add(){}; remove(){}; traverse(_f:any){} }
class Scene { children:any[]=[]; add(_o:any){}; remove(_o:any){}; fog:any=null; background:any=null; }
class PerspectiveCamera { position=new Vector3(); quaternion=new Quaternion(); fov=75; aspect=1; near=0.01; far=1000; updateProjectionMatrix(){}; getWorldDirection(t:Vector3){t.set(0,0,-1);return t;} }
class AmbientLight { intensity=1; }
class DirectionalLight { intensity=1; position=new Vector3(); color=new Color(); shadow={mapSize:{width:1024,height:1024},camera:{near:0.5,far:500,left:-100,right:100,top:100,bottom:-100}}; castShadow=false; }
class WebGLRenderer { setPixelRatio(){}; setSize(){}; render(){}; shadowMap={enabled:false,type:0}; dispose(){}; }
class MeshLambertMaterial { color=new Color(); transparent=false; opacity=1; side=0; depthWrite=true; vertexColors=false; emissive=new Color(); }
class LineBasicMaterial { color=new Color(); linewidth=1; }
class CanvasTexture { magFilter=0; minFilter=0; }
class Fog { color=new Color(); constructor(public _c:any,public near:number,public far:number){} }

const NearestFilter = 1006;
const DoubleSide = 2;
const PCFSoftShadowMap = 2;

export { Vector3, Color, Euler, Quaternion, BoxGeometry, EdgesGeometry, BufferGeometry, Float32BufferAttribute, Mesh, LineSegments, Group, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, WebGLRenderer, MeshLambertMaterial, LineBasicMaterial, CanvasTexture, Fog, NearestFilter, DoubleSide, PCFSoftShadowMap };
