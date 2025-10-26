'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import to avoid SSR issues with Three.js
const Metaballs = dynamic(() => import('@/components/Metaballs'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse flex items-center justify-center">
      <p className="text-white text-lg">Loading Metaballs...</p>
    </div>
  ),
});

export default function MetaballsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState({
    mouseX: 0,
    mouseY: 0,
    shaderX: 0,
    shaderY: 0,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full min-h-[300vh] bg-black">
      {/* Fixed canvas container */}
      <div className="fixed inset-0 w-full h-screen">
        {isLoaded && <Metaballs onPositionUpdate={setPosition} />}
      </div>

      {/* Back button */}
      <div className="fixed top-4 left-4 z-10">
        <Link
          href="/"
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
        >
          ← Back
        </Link>
      </div>

      {/* Scrollable content overlay */}
      <div className="relative z-10 pointer-events-none">
        <div className="container mx-auto px-6 py-20 max-w-4xl">
          {/* Hero Section */}
          <div className="min-h-screen flex flex-col justify-center items-center text-center pointer-events-auto">
            <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Metaballs with Scroll Parallax
            </h1>
            <p className="text-2xl text-white/90 mb-8 backdrop-blur-sm bg-black/30 p-6 rounded-2xl max-w-2xl">
              Move your mouse to interact with the metaballs.
              Scroll down to see the parallax effect on the floating bubbles.
            </p>
            <div className="text-white/60 text-lg animate-bounce">
              ↓ Scroll Down ↓
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-16 pointer-events-auto">
            <section className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-4">The Art of Fluid Motion</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-4">Interactive Experience</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-4">Parallax Depth Effect</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Massa tincidunt dui ut ornare lectus sit amet est placerat. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-4">Ray Marching Technology</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 mb-20">
              <h2 className="text-4xl font-bold text-white mb-4">Endless Possibilities</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo.
              </p>

              {/* Back to top */}
              <div className="text-center pt-8 border-t border-white/20">
                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  ← Back to Home
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="fixed bottom-4 left-4 z-20 flex flex-col gap-3 pointer-events-auto">
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <p className="text-white/70 text-sm text-center">
            Ray Marching + GLSL Shaders + Three.js
          </p>
        </div>

        {/* Position Debug Info */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
            <div className="text-white/50">Mouse Position:</div>
            <div className="text-white text-right">
              ({position.mouseX.toFixed(0)}, {position.mouseY.toFixed(0)})
            </div>

            <div className="text-white/50">Shader Position:</div>
            <div className="text-white text-right">
              ({position.shaderX.toFixed(3)}, {position.shaderY.toFixed(3)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
