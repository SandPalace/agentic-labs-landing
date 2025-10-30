(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,68752,e=>{"use strict";let t,i,n;var r=e.i(90072);class o extends r.Mesh{constructor(){super(o.Geometry,new r.MeshBasicMaterial({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;const e=new r.Vector3,t=new r.Vector3,i=new r.FramebufferTexture(16,16),n=new r.FramebufferTexture(16,16);let l=r.UnsignedByteType;const a=o.Geometry,u=new r.RawShaderMaterial({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),c=new r.RawShaderMaterial({uniforms:{map:{value:i},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),d=new r.Mesh(a,u),f=[],v=s.Shader,p=new r.RawShaderMaterial({name:v.name,uniforms:{map:{value:null},occlusionMap:{value:n},color:{value:new r.Color(0xffffff)},scale:{value:new r.Vector2},screenPosition:{value:new r.Vector3}},vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,blending:r.AdditiveBlending,transparent:!0,depthWrite:!1}),m=new r.Mesh(a,p);this.addElement=function(e){f.push(e)};const h=new r.Vector2,w=new r.Vector2,x=new r.Box2,y=new r.Vector4;this.onBeforeRender=function(o,s,v){o.getCurrentViewport(y);let g=o.getRenderTarget(),b=null!==g?g.texture.type:r.UnsignedByteType;l!==b&&(i.dispose(),n.dispose(),i.type=n.type=b,l=b);let M=y.w/y.z,P=y.z/2,S=y.w/2,V=16/y.w;if(h.set(V*M,V),x.min.set(y.x,y.y),x.max.set(y.x+(y.z-16),y.y+(y.w-16)),t.setFromMatrixPosition(this.matrixWorld),t.applyMatrix4(v.matrixWorldInverse),!(t.z>0)&&(e.copy(t).applyMatrix4(v.projectionMatrix),w.x=y.x+e.x*P+P-8,w.y=y.y+e.y*S+S-8,x.containsPoint(w))){o.copyFramebufferToTexture(i,w);let t=u.uniforms;t.scale.value=h,t.screenPosition.value=e,o.renderBufferDirect(v,null,a,u,d,null),o.copyFramebufferToTexture(n,w),(t=c.uniforms).scale.value=h,t.screenPosition.value=e,o.renderBufferDirect(v,null,a,c,d,null);let r=-(2*e.x),s=-(2*e.y);for(let t=0,i=f.length;t<i;t++){let i=f[t],n=p.uniforms;n.color.value.copy(i.color),n.map.value=i.texture,n.screenPosition.value.x=e.x+r*i.distance,n.screenPosition.value.y=e.y+s*i.distance,V=i.size/y.w;let l=y.w/y.z;n.scale.value.set(V*l,V),p.uniformsNeedUpdate=!0,o.renderBufferDirect(v,null,a,p,m,null)}}},this.dispose=function(){u.dispose(),c.dispose(),p.dispose(),i.dispose(),n.dispose();for(let e=0,t=f.length;e<t;e++)f[e].texture.dispose()}}}class s{constructor(e,t=1,i=0,n=new r.Color(0xffffff)){this.texture=e,this.size=t,this.distance=i,this.color=n}}s.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

		}`},t=new r.BufferGeometry,i=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),n=new r.InterleavedBuffer(i,5),t.setIndex([0,1,2,0,2,3]),t.setAttribute("position",new r.InterleavedBufferAttribute(n,3,0,!1)),t.setAttribute("uv",new r.InterleavedBufferAttribute(n,2,3,!1)),o.Geometry=t,e.s(["Lensflare",()=>o,"LensflareElement",()=>s])},5041,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(90072),r=e.i(8560),o=e.i(68752);function s(){let e=(0,i.useRef)(null),s=(0,i.useRef)(null),l=(0,i.useRef)(null),a=(0,i.useRef)(null),u=(0,i.useRef)(null);return(0,i.useEffect)(()=>{if(!e.current)return;let t=new n.Scene;t.background=new n.Color(0),t.fog=new n.Fog(0,3500,15e3),l.current=t;let i=new n.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,15e3);i.position.z=250,a.current=i;let c=new r.WebGLRenderer({antialias:!0,alpha:!0});c.setSize(window.innerWidth,window.innerHeight),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.current.appendChild(c.domElement),s.current=c;let d=new n.TextureLoader,f=d.load("/textures/lensflare/lensflare0.png"),v=d.load("/textures/lensflare/lensflare3.png"),p=new n.BoxGeometry(20,20,20);for(let e=0;e<1500;e++){let e=new n.MeshPhongMaterial({color:0xffffff,specular:0xffffff,shininess:50}),i=new n.Mesh(p,e);i.position.x=8e3*(2*Math.random()-1),i.position.y=8e3*(2*Math.random()-1),i.position.z=8e3*(2*Math.random()-1),i.rotation.x=Math.random()*Math.PI,i.rotation.y=Math.random()*Math.PI,i.rotation.z=Math.random()*Math.PI,i.matrixAutoUpdate=!1,i.updateMatrix(),t.add(i)}let m=new n.DirectionalLight(0xffffff,.15);function h(e,i,r,s,l,a){let u=new n.PointLight(0xffffff,1.5,2e3,0);u.color.setHSL(e,i,r),u.position.set(s,l,a),t.add(u);let c=new o.Lensflare;c.addElement(new o.LensflareElement(f,700,0,u.color)),c.addElement(new o.LensflareElement(v,60,.6)),c.addElement(new o.LensflareElement(v,70,.7)),c.addElement(new o.LensflareElement(v,120,.9)),c.addElement(new o.LensflareElement(v,70,1)),u.add(c)}m.position.set(0,-1,0).normalize(),m.color.setHSL(.1,.7,.5),t.add(m),h(.55,.9,.5,5e3,0,-1e3),h(.08,.8,.5,0,0,-1e3),h(.995,.5,.9,5e3,5e3,-1e3);let w=0,x=0,y=e=>{w=e.clientX-window.innerWidth/2,x=e.clientY-window.innerHeight/2};window.addEventListener("mousemove",y);let g=()=>{if(!a.current||!s.current)return;let e=window.innerWidth,t=window.innerHeight;a.current.aspect=e/t,a.current.updateProjectionMatrix(),s.current.setSize(e,t)};window.addEventListener("resize",g);let b=()=>{s.current&&l.current&&a.current&&(a.current.position.x+=(w-a.current.position.x)*.05,a.current.position.y+=(-x-a.current.position.y)*.05,a.current.lookAt(l.current.position),s.current.render(l.current,a.current),u.current=requestAnimationFrame(b))};return b(),()=>{window.removeEventListener("mousemove",y),window.removeEventListener("resize",g),u.current&&cancelAnimationFrame(u.current),e.current&&c.domElement&&e.current.removeChild(c.domElement),p.dispose(),c.dispose()}},[]),(0,t.jsx)("div",{ref:e,className:"w-full h-full bg-black"})}function l(){return(0,t.jsx)("main",{className:"w-screen h-screen",children:(0,t.jsx)(s,{})})}e.s(["default",()=>l],5041)}]);