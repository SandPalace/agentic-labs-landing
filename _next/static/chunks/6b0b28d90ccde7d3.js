(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,68752,e=>{"use strict";let r,t,o;var i=e.i(90072);class n extends i.Mesh{constructor(){super(n.Geometry,new i.MeshBasicMaterial({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;const e=new i.Vector3,r=new i.Vector3,t=new i.FramebufferTexture(16,16),o=new i.FramebufferTexture(16,16);let l=i.UnsignedByteType;const s=n.Geometry,c=new i.RawShaderMaterial({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),u=new i.RawShaderMaterial({uniforms:{map:{value:t},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),d=new i.Mesh(s,c),f=[],v=a.Shader,m=new i.RawShaderMaterial({name:v.name,uniforms:{map:{value:null},occlusionMap:{value:o},color:{value:new i.Color(0xffffff)},scale:{value:new i.Vector2},screenPosition:{value:new i.Vector3}},vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,blending:i.AdditiveBlending,transparent:!0,depthWrite:!1}),p=new i.Mesh(s,m);this.addElement=function(e){f.push(e)};const w=new i.Vector2,h=new i.Vector2,y=new i.Box2,x=new i.Vector4;this.onBeforeRender=function(n,a,v){n.getCurrentViewport(x);let g=n.getRenderTarget(),b=null!==g?g.texture.type:i.UnsignedByteType;l!==b&&(t.dispose(),o.dispose(),t.type=o.type=b,l=b);let M=x.w/x.z,P=x.z/2,S=x.w/2,T=16/x.w;if(w.set(T*M,T),y.min.set(x.x,x.y),y.max.set(x.x+(x.z-16),x.y+(x.w-16)),r.setFromMatrixPosition(this.matrixWorld),r.applyMatrix4(v.matrixWorldInverse),!(r.z>0)&&(e.copy(r).applyMatrix4(v.projectionMatrix),h.x=x.x+e.x*P+P-8,h.y=x.y+e.y*S+S-8,y.containsPoint(h))){n.copyFramebufferToTexture(t,h);let r=c.uniforms;r.scale.value=w,r.screenPosition.value=e,n.renderBufferDirect(v,null,s,c,d,null),n.copyFramebufferToTexture(o,h),(r=u.uniforms).scale.value=w,r.screenPosition.value=e,n.renderBufferDirect(v,null,s,u,d,null);let i=-(2*e.x),a=-(2*e.y);for(let r=0,t=f.length;r<t;r++){let t=f[r],o=m.uniforms;o.color.value.copy(t.color),o.map.value=t.texture,o.screenPosition.value.x=e.x+i*t.distance,o.screenPosition.value.y=e.y+a*t.distance,T=t.size/x.w;let l=x.w/x.z;o.scale.value.set(T*l,T),m.uniformsNeedUpdate=!0,n.renderBufferDirect(v,null,s,m,p,null)}}},this.dispose=function(){c.dispose(),u.dispose(),m.dispose(),t.dispose(),o.dispose();for(let e=0,r=f.length;e<r;e++)f[e].texture.dispose()}}}class a{constructor(e,r=1,t=0,o=new i.Color(0xffffff)){this.texture=e,this.size=r,this.distance=t,this.color=o}}a.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`},r=new i.BufferGeometry,t=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),o=new i.InterleavedBuffer(t,5),r.setIndex([0,1,2,0,2,3]),r.setAttribute("position",new i.InterleavedBufferAttribute(o,3,0,!1)),r.setAttribute("uv",new i.InterleavedBufferAttribute(o,2,3,!1)),n.Geometry=r,e.s(["Lensflare",()=>n,"LensflareElement",()=>a])},27188,e=>{"use strict";var r=e.i(43476),t=e.i(71645),o=e.i(90072),i=e.i(8560),n=e.i(68752);let a={waterTransparent:{name:"Water Transparent",color0:[.95,.97,1],color1:[.85,.88,.92]},purple:{name:"Purple",color0:[.1765,.1255,.2275],color1:[.4118,.4118,.4157]},blueGradient:{name:"Blue Gradient",color0:[.2,.4,.9],color1:[0,.1,.4]},redGradient:{name:"Red Gradient",color0:[.9,.2,.2],color1:[.4,0,0]},pinkGradient:{name:"Pink Gradient",color0:[1,.4,.7],color1:[.5,0,.3]},orangeGradient:{name:"Orange Gradient",color0:[1,.6,.2],color1:[.5,.2,0]},magentaGradient:{name:"Magenta Gradient",color0:[.9,.2,.9],color1:[.4,0,.4]},emeraldGradient:{name:"Emerald Gradient",color0:[.2,.9,.6],color1:[0,.4,.3]},cyanGradient:{name:"Cyan Gradient",color0:[.2,.8,.9],color1:[0,.3,.4]},yellowGradient:{name:"Yellow Gradient",color0:[1,.9,.2],color1:[.5,.4,0]}},l=`
attribute vec3 position;
varying vec2 vTexCoord;

void main() {
    vTexCoord = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1.0);
}
`,s=`
precision mediump float;

const float EPS = 1e-4;
const int ITR = 32;
const int TRAIL_LENGTH = 15;
const int STATIC_BUBBLES = 20;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointerTrail[TRAIL_LENGTH];
uniform vec3 uCameraPosition;
uniform mat4 uProjectionMatrixInverse;
uniform mat4 uCameraMatrixWorld;
uniform vec3 uStaticBubbles[STATIC_BUBBLES]; // x, y, radius
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform float uMainBallRadius; // Dynamic radius for main ball

varying vec2 vTexCoord;

// Camera Params
vec3 origin = vec3(0.0, 0.0, 1.0);
vec3 lookAt = vec3(0.0, 0.0, 0.0);
vec3 cDir = normalize(lookAt - origin);
vec3 cUp = vec3(0.0, 1.0, 0.0);
vec3 cSide = cross(cDir, cUp);

vec3 translate(vec3 p, vec3 t) {
    return p - t;
}

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a000 = rnd3D(i);
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

    vec3 u = f * f * (3.0 - 2.0 * f);

    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

    return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

float map(vec3 p) {
    float baseRadius = uMainBallRadius; // Use dynamic radius
    float radius = baseRadius;
    float k = 7.0;
    float d = 1e5;

    // Main bubble trail
    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);

        // uPointerTrail contains world space coordinates
        vec2 ballWorldPos = uPointerTrail[i];

        // Calculate trail radius with minimum size to prevent negative values
        float trailRadius = max(radius - (baseRadius * 0.05 * fi), 0.01);

        float sphere = sdSphere(
            translate(p, vec3(ballWorldPos, 0.0)),
            trailRadius
        );

        d = smoothMin(d, sphere, k);
    }

    // Static bubbles
    for (int i = 0; i < STATIC_BUBBLES; i++) {
        vec3 bubbleData = uStaticBubbles[i];
        vec2 bubblePos = bubbleData.xy;
        float bubbleRadius = bubbleData.z;

        float sphere = sdSphere(
            translate(p, vec3(bubblePos, 0.0)),
            bubbleRadius
        );

        d = smoothMin(d, sphere, k);
    }

    return d;
}

vec3 generateNormal(vec3 p) {
    return normalize(vec3(
        map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
        map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
        map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
    ));
}

vec3 dropletColor(vec3 normal, vec3 rayDir) {
    vec3 reflectDir = reflect(rayDir, normal);

    float noisePosTime = noise3D(reflectDir * 2.0 + uTime);
    float noiseNegTime = noise3D(reflectDir * 2.0 - uTime);

    // Use uniform colors passed from JavaScript
    vec3 _color0 = uColor0 * noisePosTime;
    vec3 _color1 = uColor1 * noiseNegTime;

    float intensity = 2.3;
    vec3 color = (_color0 + _color1) * intensity;

    return color;
}

void main() {
    // Reconstruct normalized device coordinates for this fragment
    vec2 ndc = vTexCoord * 2.0 - 1.0;

    // Mimic THREE.Vector3.unproject(camera) to match Three.js exactly
    vec4 clipPosition = vec4(ndc, 0.5, 1.0);
    vec4 viewPosition = uProjectionMatrixInverse * clipPosition;
    viewPosition /= viewPosition.w;

    vec4 worldPosition = uCameraMatrixWorld * viewPosition;
    vec3 rayDir = normalize(worldPosition.xyz - uCameraPosition);

    // Now ray march from camera to find metaballs
    vec3 ray = uCameraPosition;
    float dist = 0.0;

    for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDir * dist;
        if (dist < EPS) break;
        if (ray.z < -0.5) break;
    }

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    if (dist < EPS) {
        vec3 normal = generateNormal(ray);
        color = dropletColor(normal, rayDir);

        // Create water-like transparency with subtle opacity
        // More transparent in the center, slightly more opaque at edges
        float fresnel = pow(1.0 - abs(dot(normal, -rayDir)), 2.0);
        alpha = 0.15 + fresnel * 0.25; // Range from 0.15 to 0.4 opacity (very subtle)
    }

    vec3 finalColor = pow(color, vec3(7.0));
    gl_FragColor = vec4(finalColor, alpha);
}
`;function c({className:e="",showUI:c=!0,showDebugVisuals:u=!0,onPositionUpdate:d}){let f=(0,t.useRef)(null),v=(0,t.useRef)(null),m=(0,t.useRef)(null),p=(0,t.useRef)(null),w=(0,t.useRef)(null),h=(0,t.useRef)(null),y=(0,t.useRef)(Array.from({length:15},()=>new o.Vector2(0,0))),[x,g]=(0,t.useState)("waterTransparent"),b=(0,t.useRef)(Array.from({length:20},()=>new o.Vector3((Math.random()-.5)*12,(Math.random()-.5)*12-6,.15+.25*Math.random()))),M=(0,t.useRef)(Array.from({length:20},()=>.002+.006*Math.random())),P=(0,t.useRef)(.03),S=(0,t.useRef)(new Set),T=(0,t.useRef)(0),C=(0,t.useRef)(0),R=(0,t.useRef)(window.innerWidth/2),D=(0,t.useRef)(window.innerHeight/2);return(0,t.useEffect)(()=>{if(!f.current)return;let e=new o.Scene;m.current=e,new o.TextureLoader().load("/images360/AdobeStock_59140782.jpeg",r=>{console.log("Panoramic texture loaded successfully",r),r.mapping=o.EquirectangularReflectionMapping,r.colorSpace=o.SRGBColorSpace,e.background=r,console.log("Panoramic background set to scene")},e=>{e.total>0&&console.log("Loading panorama:",(e.loaded/e.total*100).toFixed(2)+"%")},r=>{console.error("Error loading panoramic texture:",r),e.background=new o.Color(1710618)});let r=new o.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.z=5,r.updateProjectionMatrix(),r.updateMatrixWorld(!0),p.current=r;let t=new i.WebGLRenderer({antialias:!0,alpha:!0});t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.autoClear=!1,f.current.appendChild(t.domElement),v.current=t;let c=a[x];console.log("Initial main ball radius:",P.current);let g={uResolution:{value:new o.Vector2(window.innerWidth,window.innerHeight)},uTime:{value:0},uPointerTrail:{value:y.current},uCameraPosition:{value:r.position.clone()},uProjectionMatrixInverse:{value:r.projectionMatrixInverse.clone()},uCameraMatrixWorld:{value:r.matrixWorld.clone()},uStaticBubbles:{value:b.current},uColor0:{value:new o.Vector3(...c.color0)},uColor1:{value:new o.Vector3(...c.color1)},uMainBallRadius:{value:P.current}},z=new o.RawShaderMaterial({vertexShader:l,fragmentShader:s,uniforms:g,transparent:!0});w.current=z;let E=new o.PlaneGeometry(2,2),L=new o.Mesh(E,z);if(L.position.z=.1,L.renderOrder=1,e.add(L),u){let r=new o.PlaneGeometry(20,20),t=new o.MeshBasicMaterial({color:6710886,transparent:!0,opacity:.3,side:o.DoubleSide,wireframe:!1}),i=new o.Mesh(r,t);i.position.z=0,e.add(i);let n=new o.EdgesGeometry(r),a=new o.LineBasicMaterial({color:0xffff00,linewidth:3}),l=new o.LineSegments(n,a);l.position.z=0,e.add(l);let s=new o.PlaneGeometry(20,20),c=new o.MeshStandardMaterial({color:2236962,roughness:.8,metalness:.2,side:o.DoubleSide}),u=new o.Mesh(s,c);u.rotation.x=-Math.PI/2,u.position.y=-2,e.add(u);let d=new o.PlaneGeometry(20,20),f=new o.MeshStandardMaterial({color:1710618,roughness:.9,metalness:.1}),v=new o.Mesh(d,f);v.position.z=-10,v.position.y=5,e.add(v);let m=new o.AmbientLight(0xffffff,.8);e.add(m);let p=new o.DirectionalLight(0xffffff,1.2);p.position.set(5,10,5),e.add(p);let w=new o.PointLight(0xff4444,1);w.position.set(-5,3,2),e.add(w);let h=new o.PointLight(4474111,1);h.position.set(5,3,2),e.add(h);let y=new o.DirectionalLight(0xffffff,.8);y.position.set(0,0,10),e.add(y);let x=new o.GridHelper(20,20,4473924,2236962);x.position.y=-2,e.add(x);let g=new o.AxesHelper(5);e.add(g);let b=new o.BufferGeometry().setFromPoints([new o.Vector3(-20,0,0),new o.Vector3(20,0,0)]),M=new o.Line(b,new o.LineBasicMaterial({color:0xff0000}));M.position.z=.01,e.add(M);let P=new o.BufferGeometry().setFromPoints([new o.Vector3(0,-20,0),new o.Vector3(0,20,0)]),S=new o.Line(P,new o.LineBasicMaterial({color:65280}));S.position.z=.01,e.add(S);let T=new o.BufferGeometry().setFromPoints([new o.Vector3(0,0,-20),new o.Vector3(0,0,20)]),C=new o.Line(T,new o.LineBasicMaterial({color:255}));e.add(C);let R=new o.GridHelper(20,20,0xffff00,6710886);R.rotation.x=Math.PI/2,R.position.z=.02,e.add(R)}let B=new o.TextureLoader,k=B.load("/textures/lensflare/lensflare0.png"),V=B.load("/textures/lensflare/lensflare3.png");function G(r,t,i,a,l,s){let c=new o.PointLight(0xffffff,1.5,2e3,0);c.color.setHSL(r,t,i),c.position.set(a,l,s),e.add(c);let u=new n.Lensflare;u.addElement(new n.LensflareElement(k,700,0,c.color)),u.addElement(new n.LensflareElement(V,60,.6)),u.addElement(new n.LensflareElement(V,70,.7)),u.addElement(new n.LensflareElement(V,120,.9)),u.addElement(new n.LensflareElement(V,70,1)),c.add(u)}G(.55,.9,.5,5e3,0,-1e3),G(.08,.8,.5,0,0,-1e3),G(.995,.5,.9,5e3,5e3,-1e3);let A=e=>{if(!p.current)return;T.current=(e.clientX-R.current)*.5,C.current=(e.clientY-D.current)*.5;let r=new o.Vector2;r.x=e.clientX/window.innerWidth*2-1,r.y=-(2*(e.clientY/window.innerHeight))+1;let t=new o.Vector3(r.x,r.y,.5);t.unproject(p.current);let i=t.sub(p.current.position).normalize(),n=-p.current.position.z/i.z,a=p.current.position.clone().add(i.multiplyScalar(n)),l=a.x,s=a.y;d&&d({mouseX:e.clientX,mouseY:e.clientY,shaderX:l,shaderY:s});for(let e=y.current.length-1;e>0;e--)y.current[e].copy(y.current[e-1]);y.current[0].set(l,s)};window.addEventListener("mousemove",A);let W=()=>{if(!p.current)return;let e=window.innerWidth,r=window.innerHeight;R.current=e/2,D.current=r/2,p.current.aspect=e/r,p.current.updateProjectionMatrix(),p.current.updateMatrixWorld(!0),t.setSize(e,r),g.uResolution.value.set(e,r),g.uProjectionMatrixInverse.value.copy(p.current.projectionMatrixInverse),g.uCameraMatrixWorld.value.copy(p.current.matrixWorld),g.uCameraPosition.value.copy(p.current.position)};window.addEventListener("resize",W);let I=Date.now(),j=()=>{let o=(Date.now()-I)*.001;if(g.uTime.value=o,p.current){let t=.01*T.current,o=-(.01*C.current);r.position.x+=(t-r.position.x)*.05,r.position.y+=(o-r.position.y)*.05,r.position.z=5,r.lookAt(e.position),r.updateMatrixWorld(!0),g.uCameraPosition.value.copy(r.position),g.uCameraMatrixWorld.value.copy(r.matrixWorld)}g.uMainBallRadius.value=P.current;let i=y.current[0],n=P.current;for(let e=0;e<b.current.length;e++){let r=b.current[e],t=M.current[e],o=r.x-i.x,a=r.y-i.y,l=Math.sqrt(o*o+a*a),s=r.z;if(l<n+s){S.current.has(e)||(P.current=Math.min(1.05*P.current,1.5),r.z=Math.max(.95*s,.05),r.z<.1&&(r.x=(Math.random()-.5)*12,r.y=-6,r.z=.15+.25*Math.random(),M.current[e]=.002+.006*Math.random()),S.current.add(e),setTimeout(()=>{S.current.delete(e)},2e3));let t=Math.atan2(a,o);r.x+=.05*Math.cos(t),r.y+=.05*Math.sin(t),M.current[e]=Math.min(1.5*M.current[e],.02)}r.y+=t,r.y>6&&(r.x=(Math.random()-.5)*12,r.y=-6,r.z=.15+.25*Math.random(),M.current[e]=.002+.006*Math.random())}t.clear(),t.render(e,r),h.current=requestAnimationFrame(j)};return j(),()=>{window.removeEventListener("mousemove",A),window.removeEventListener("resize",W),h.current&&cancelAnimationFrame(h.current),f.current&&t.domElement&&f.current.removeChild(t.domElement),E.dispose(),z.dispose(),t.dispose()}},[]),(0,t.useEffect)(()=>{if(w.current){let e=a[x];w.current.uniforms.uColor0.value.set(...e.color0),w.current.uniforms.uColor1.value.set(...e.color1)}},[x]),(0,r.jsxs)("div",{className:"relative w-full h-full",children:[(0,r.jsx)("div",{ref:f,className:`w-full h-full bg-black ${e}`,style:{touchAction:"none"}}),c&&(0,r.jsx)("div",{className:"absolute top-4 right-4 z-10",children:(0,r.jsx)("select",{value:x,onChange:e=>g(e.target.value),className:"px-4 py-2 bg-black/70 backdrop-blur-sm text-white border border-white/30 rounded-lg cursor-pointer hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50",children:Object.entries(a).map(([e,t])=>(0,r.jsx)("option",{value:e,className:"bg-black text-white",children:t.name},e))})})]})}e.s(["default",()=>c])},43531,e=>{e.n(e.i(27188))}]);