# Metaball Scene Implementation

## Overview

This implementation creates interactive, droplet-like metaballs using Three.js and GLSL shaders, based on the tutorial from [the article](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/).

## File Structure

```
components/
  └── MetaballScene.tsx       # Main metaball scene component

app/[locale]/metaballs/
  └── page.tsx                # Test/demo page for the metaball scene
```

## Component: MetaballScene.tsx

### Key Features

1. **Ray Marching Renderer**
   - Uses signed distance functions (SDF) to render 3D spheres
   - Implements efficient ray marching algorithm in fragment shader
   - 32 iterations for high quality rendering

2. **Metaball Effect**
   - `smoothMin()` function blends multiple spheres organically
   - Creates seamless, fluid-like connections between objects
   - Adjustable smoothness parameter (`k = 7.0`)

3. **3D Value Noise**
   - Trilinear interpolation for smooth 3D noise
   - Applied to reflection vectors for realistic droplet texture
   - Time-based animation for dynamic surface appearance

4. **Mouse Trail Tracking**
   - Tracks 15 positions of mouse movement
   - Creates stretchy, elastic motion effect
   - Spheres decrease in size along the trail

5. **Glass-like Appearance**
   - Post-processing with `pow(color, 7.0)` for highlights
   - Noise-based surface distortion
   - Reflection-based coloring

## Technical Implementation

### Shader Pipeline

```glsl
1. Screen Space → Ray Setup
   - Normalize screen coordinates
   - Set up orthographic camera

2. Ray Marching Loop
   - Calculate distance to nearest surface
   - March ray forward by that distance
   - Repeat until hit or max iterations

3. Surface Detection
   - Hit detection with threshold (EPS = 1e-4)
   - Normal calculation using gradient

4. Shading
   - Apply noise-based droplet coloring
   - Post-process for glass-like effect
```

### Distance Field Function

The `map()` function defines the scene:

```glsl
float map(vec3 p) {
    // Create spheres along mouse trail
    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float sphere = sdSphere(translate(p, position), radius);
        d = smoothMin(d, sphere, k);
    }
    return d;
}
```

### Smooth Blending

The `smoothMin()` function creates organic blending:

```glsl
float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}
```

- Higher `k` = sharper transition
- Lower `k` = smoother, more gradual merging

## Usage

### Basic Usage

```tsx
import MetaballScene from '@/components/MetaballScene';

<MetaballScene onLoaded={() => console.log('Scene ready!')} />
```

### Test Page

Visit `/metaballs` (or `/en/metaballs`, `/es/metaballs`) to see the interactive demo.

## Performance Considerations

1. **Ray Marching Iterations**
   - Current: 32 iterations (`ITR = 32`)
   - Increase for better quality (higher cost)
   - Decrease for better performance

2. **Trail Length**
   - Current: 15 positions
   - More positions = smoother trail but higher cost
   - Adjust `TRAIL_LENGTH` constant

3. **Shader Complexity**
   - Each sphere adds computational cost
   - Noise calculations are moderately expensive
   - Consider reducing for mobile devices

## Customization

### Colors

Modify the droplet color in the shader:

```glsl
vec3 _color0 = vec3(0.1765, 0.1255, 0.2275); // Dark purple
vec3 _color1 = vec3(0.4118, 0.4118, 0.4157); // Light gray
```

### Sphere Sizes

Adjust the base radius for different effects:

```glsl
float baseRadius = 8e-3;  // Smaller = tighter spheres
```

### Smoothness

Change the blending smoothness:

```glsl
float k = 7.0;  // Higher = sharper edges
```

### Glass Effect

Adjust the post-processing power:

```glsl
vec3 finalColor = pow(color, vec3(7.0));  // Higher = more contrast
```

## Integration with Landing Page

To use this scene in your landing page instead of the bubble scene:

1. **Option 1: Replace in page.tsx**

```tsx
// In app/[locale]/page.tsx
const MetaballScene = dynamic(() => import('@/components/MetaballScene'), {
  ssr: false,
  // ... loading component
});

// Use instead of StereoScene
<MetaballScene scrollProgress={scrollProgress} onLoaded={() => setSceneLoaded(true)} />
```

2. **Option 2: Create Toggle**

Add a toggle to switch between scenes dynamically.

## Browser Compatibility

- ✅ Chrome/Edge (tested)
- ✅ Firefox (WebGL 2.0)
- ✅ Safari (WebGL support required)
- ⚠️ Mobile browsers (may need performance optimization)

## Troubleshooting

### Scene not rendering
- Check WebGL support in browser
- Open console for shader compilation errors
- Verify Three.js is properly installed

### Performance issues
- Reduce `ITR` iterations
- Decrease `TRAIL_LENGTH`
- Simplify noise calculations

### Mouse trail not smooth
- Increase `TRAIL_LENGTH` for smoother motion
- Adjust trail update logic in `handleMouseMove`

## References

- Original Tutorial: [Codrops - Interactive Metaballs](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/)
- Inigo Quilez SDFs: [https://iquilezles.org/articles/distfunctions/](https://iquilezles.org/articles/distfunctions/)
- The Book of Shaders - Noise: [https://thebookofshaders.com/11/](https://thebookofshaders.com/11/)
- Ray Marching Guide: [https://www.shadertoy.com/](https://www.shadertoy.com/)

## License

This implementation is based on the Codrops tutorial and is provided for educational purposes.
