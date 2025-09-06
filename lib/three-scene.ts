import * as THREE from 'three';

export interface MountainSceneConfig {
  peaks: number;
  layers: number;
  fog: boolean;
  particles: boolean;
  animation: boolean;
}

export class MountainScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mountains: THREE.Group[] = [];
  private particles: THREE.Points | null = null;
  private animationId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;

  constructor(private container: HTMLElement, private config: MountainSceneConfig) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    
    this.init();
  }

  private init() {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.set(0, 5, 20);
    this.camera.lookAt(0, 0, 0);

    // Add lighting
    this.addLighting();

    // Create mountain layers
    this.createMountainLayers();

    // Add particles if enabled
    if (this.config.particles) {
      this.addParticles();
    }

    // Add fog if enabled
    if (this.config.fog) {
      this.addFog();
    }

    // Setup mouse interaction
    this.setupMouseInteraction();

    // Start animation if enabled
    if (this.config.animation) {
      this.animate();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private addLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x4a90e2, 0.3);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffeaa7, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point light for summit glow
    const pointLight = new THREE.PointLight(0x74b9ff, 0.5, 50);
    pointLight.position.set(0, 8, -5);
    this.scene.add(pointLight);
  }

  private createMountainLayers() {
    const colors = [
      0x2d3436, // Darkest (background)
      0x636e72, // Dark
      0x74b9ff, // Medium blue
      0xa29bfe, // Light purple
      0xfd79a8  // Light pink (summit)
    ];

    for (let layer = 0; layer < this.config.layers; layer++) {
      const mountainGroup = new THREE.Group();
      
      for (let peak = 0; peak < this.config.peaks; peak++) {
        const mountain = this.createMountainPeak(colors[layer % colors.length], layer);
        
        // Position peaks across the width
        mountain.position.x = (peak - this.config.peaks / 2) * 8;
        mountain.position.z = -layer * 5;
        
        mountainGroup.add(mountain);
      }
      
      this.mountains.push(mountainGroup);
      this.scene.add(mountainGroup);
    }
  }

  private createMountainPeak(color: number, layer: number): THREE.Mesh {
    const geometry = this.createMountainGeometry();
    const material = new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.8 - (layer * 0.1)
    });
    
    const mountain = new THREE.Mesh(geometry, material);
    mountain.receiveShadow = true;
    mountain.castShadow = true;
    
    // Random scale and rotation for variety
    const scale = 0.5 + Math.random() * 0.5;
    mountain.scale.set(scale, scale + Math.random() * 0.5, scale);
    mountain.rotation.y = Math.random() * Math.PI;
    
    return mountain;
  }

  private createMountainGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.ConeGeometry(
      2 + Math.random() * 2, // radius
      4 + Math.random() * 4, // height
      6 + Math.floor(Math.random() * 6), // segments
      1,
      false,
      0,
      Math.PI * 2
    );
    
    // Add some randomness to vertices for natural look
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * 0.3;     // x
      positions[i + 1] += (Math.random() - 0.5) * 0.2; // y
      positions[i + 2] += (Math.random() - 0.5) * 0.3; // z
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }

  private addParticles() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 100;     // x
      positions[i3 + 1] = Math.random() * 30;          // y
      positions[i3 + 2] = (Math.random() - 0.5) * 100; // z
      
      // Color (white to light blue)
      colors[i3] = 0.8 + Math.random() * 0.2;     // r
      colors[i3 + 1] = 0.9 + Math.random() * 0.1; // g
      colors[i3 + 2] = 1.0;                       // b
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private addFog() {
    this.scene.fog = new THREE.Fog(0x74b9ff, 10, 50);
  }

  private setupMouseInteraction() {
    this.container.addEventListener('mousemove', (event) => {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    const time = Date.now() * 0.0005;
    
    // Parallax camera movement based on mouse
    this.camera.position.x = this.mouseX * 2;
    this.camera.position.y = 5 + this.mouseY * 1;
    this.camera.lookAt(0, 0, 0);
    
    // Animate mountain layers
    this.mountains.forEach((mountain, index) => {
      mountain.rotation.y = Math.sin(time + index) * 0.01;
      mountain.position.y = Math.sin(time * 0.5 + index) * 0.2;
    });
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.y = time * 0.1;
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.01; // Move particles up
        
        // Reset particles that go too high
        if (positions[i] > 30) {
          positions[i] = 0;
        }
      }
      
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  private handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  public updateConfig(newConfig: Partial<MountainSceneConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Restart animation if needed
    if (newConfig.animation && !this.animationId) {
      this.animate();
    } else if (newConfig.animation === false && this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    this.scene.clear();
    this.renderer.dispose();
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}