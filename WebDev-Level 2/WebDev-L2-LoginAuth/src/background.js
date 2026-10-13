/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * RAINY MISTY FOREST BACKGROUND WITH GLASS WINDOW & WATER DROPLETS
 * ============================================================================
 * 
 * Features:
 * - High-Performance Object Pooling for Rain Streaks, Water Droplets, and Ripples
 * - Adaptive Frame-Skipping / Delta-Time Governor for low-end devices
 * - Viscous Speed Decay & Exponential Opacity Decay on Surface Splash Ripples
 * - Coordinated Droplet Landing Spring & Splash Ripple Synchronization
 * - Graceful Pause/Resume on document.hidden (Visibility API)
 * - Accessibility (prefers-reduced-motion) & Responsive Screen Density
 */

export const RAIN_COUNT = 220;          // Total falling rain streaks (scaled on mobile)
export const DROPLET_COUNT = 34;       // Glass pane water droplets
export const MAX_RIPPLES = 32;         // Maximum concurrent surface impact ripples
export const RAIN_SPEED = 1.0;         // Rain velocity multiplier
export const BLUR_AMOUNT = 4;          // Frosted glass pane blur in pixels

// ----------------------------------------------------------------------------
// SVG ASSETS: MISTY PINE/FIR FOREST, DRIFTING FOG & LIGHT SHAFTS
// ----------------------------------------------------------------------------

export function renderRainyForestBackground() {
  return `
    <div id="rainyBackgroundContainer" class="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#031512]">
      <!-- LAYER 1: Base Gradient & Soft Teal Illumination Behind Card -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#031512] via-[#072520] to-[#0B3D36]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-radial from-[#1F6B5E]/20 via-[#0B3D36]/15 to-transparent blur-3xl pointer-events-none"></div>

      <!-- LAYER 2: 3-4 Layers of Tall Pine/Fir Forest Silhouettes in SVG with Drifting Fog -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="farForestGrad" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F6B5E" stop-opacity="0.35"/>
            <stop offset="0.6" stop-color="#0E483F" stop-opacity="0.5"/>
            <stop offset="1" stop-color="#05241F" stop-opacity="0.7"/>
          </linearGradient>

          <linearGradient id="midForestGrad" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#14564B" stop-opacity="0.6"/>
            <stop offset="0.5" stop-color="#0B3D36" stop-opacity="0.85"/>
            <stop offset="1" stop-color="#031A15" stop-opacity="0.95"/>
          </linearGradient>

          <linearGradient id="nearForestGrad" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0B3D36" stop-opacity="0.85"/>
            <stop offset="0.4" stop-color="#072B25" stop-opacity="0.95"/>
            <stop offset="1" stop-color="#021411" stop-opacity="1"/>
          </linearGradient>

          <linearGradient id="lightShaftGrad1" x1="200" y1="0" x2="500" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F3E2A9" stop-opacity="0.12"/>
            <stop offset="0.5" stop-color="#D9B86C" stop-opacity="0.05"/>
            <stop offset="1" stop-color="#F3E2A9" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="lightShaftGrad2" x1="900" y1="0" x2="1150" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F3E2A9" stop-opacity="0.1"/>
            <stop offset="0.6" stop-color="#A9C9B8" stop-opacity="0.04"/>
            <stop offset="1" stop-color="#F3E2A9" stop-opacity="0"/>
          </linearGradient>

          <filter id="farMistBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3.5"/>
          </filter>
          <filter id="fogBandBlur" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="16"/>
          </filter>
        </defs>

        <g filter="url(#farMistBlur)">
          <path d="M-40,900 L-40,460 L0,480 L35,420 L70,475 L110,410 L150,470 L195,395 L240,465 L285,415 L330,475 L380,390 L430,460 L480,405 L530,470 L580,400 L630,465 L680,390 L730,470 L780,415 L830,460 L880,385 L930,465 L980,405 L1030,470 L1080,390 L1130,460 L1180,410 L1230,475 L1280,395 L1330,460 L1380,410 L1430,470 L1480,900 Z" fill="url(#farForestGrad)"/>
        </g>

        <g class="fog-drift-slow" opacity="0.38">
          <ellipse cx="450" cy="510" rx="650" ry="65" fill="#A9C9B8" filter="url(#fogBandBlur)"/>
          <ellipse cx="1100" cy="540" rx="550" ry="55" fill="#1F6B5E" filter="url(#fogBandBlur)"/>
        </g>

        <polygon points="120,-20 380,-20 620,900 240,900" fill="url(#lightShaftGrad1)"/>
        <polygon points="840,-20 1060,-20 1280,900 950,900" fill="url(#lightShaftGrad2)"/>

        <path d="M-50,900 L-50,540 L-20,510 L5,570 L30,480 L60,560 L90,470 L120,550 L155,460 L190,540 L230,440 L270,530 L310,470 L350,550 L390,450 L430,530 L470,460 L510,540 L560,430 L610,530 L660,450 L710,540 L760,440 L810,530 L860,460 L910,550 L960,440 L1010,530 L1060,450 L1110,540 L1160,430 L1210,530 L1260,470 L1310,550 L1360,440 L1410,530 L1460,460 L1500,900 Z" fill="url(#midForestGrad)"/>

        <g class="fog-drift-reverse" opacity="0.45">
          <ellipse cx="720" cy="620" rx="750" ry="75" fill="#0E483F" filter="url(#fogBandBlur)"/>
          <ellipse cx="250" cy="640" rx="450" ry="60" fill="#A9C9B8" filter="url(#fogBandBlur)"/>
        </g>

        <path d="M-60,900 L-60,600 L-30,560 L0,640 L40,510 L80,620 L120,490 L160,610 L200,470 L240,600 L290,450 L340,590 L390,480 L440,610 L500,430 L560,590 L620,470 L680,600 L740,450 L800,590 L860,470 L920,610 L980,440 L1040,590 L1100,460 L1160,600 L1220,440 L1280,590 L1340,480 L1400,610 L1460,470 L1520,900 Z" fill="url(#nearForestGrad)"/>

        <g opacity="0.8">
          <circle cx="180" cy="520" r="3" fill="#F3E2A9" filter="drop-shadow(0 0 6px #F3E2A9)"/>
          <circle cx="360" cy="490" r="2.5" fill="#D9B86C" filter="drop-shadow(0 0 5px #D9B86C)"/>
          <circle cx="580" cy="530" r="3.5" fill="#F3E2A9" filter="drop-shadow(0 0 7px #F3E2A9)"/>
          <circle cx="890" cy="510" r="2.8" fill="#D9B86C" filter="drop-shadow(0 0 6px #D9B86C)"/>
          <circle cx="1120" cy="540" r="3.2" fill="#F3E2A9" filter="drop-shadow(0 0 7px #F3E2A9)"/>
          <circle cx="1320" cy="490" r="2" fill="#FFFDF8" filter="drop-shadow(0 0 4px #FFFDF8)"/>
        </g>
      </svg>

      <div class="absolute inset-0 frosted-glass-pane" style="backdrop-filter: blur(${BLUR_AMOUNT}px); -webkit-backdrop-filter: blur(${BLUR_AMOUNT}px);">
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FAF4E4]/[0.03] via-transparent to-transparent pointer-events-none"></div>
      </div>

      <canvas id="rainCanvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>
      <div class="absolute inset-0 bg-[#031512]/20 pointer-events-none"></div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// CANVAS ENGINE WITH OBJECT POOLING & ADAPTIVE FRAME SKIPPING
// ----------------------------------------------------------------------------

const MAX_TRAIL_POINTS = 10;

export function initRainyGlassEffect() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  let animFrameId = 0;
  let isPaused = false;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = window.innerWidth < 768;
  const activeRainCount = isMobile ? Math.floor(RAIN_COUNT * 0.45) : RAIN_COUNT;
  const activeDropletCount = isMobile ? Math.floor(DROPLET_COUNT * 0.5) : DROPLET_COUNT;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize, { passive: true });

  // POOL 1: Rain Streaks
  const rainStreakPool = new Array(activeRainCount);
  for (let i = 0; i < activeRainCount; i++) {
    const depth = Math.random() < 0.5 ? 0 : Math.random() < 0.8 ? 1 : 2;
    rainStreakPool[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      speed: (depth === 0 ? 8 + Math.random() * 5 : depth === 1 ? 14 + Math.random() * 6 : 20 + Math.random() * 8) * RAIN_SPEED,
      length: depth === 0 ? 10 + Math.random() * 6 : depth === 1 ? 18 + Math.random() * 8 : 28 + Math.random() * 12,
      width: depth === 0 ? 0.8 : depth === 1 ? 1.2 : 1.6,
      opacity: depth === 0 ? 0.2 + Math.random() * 0.15 : depth === 1 ? 0.35 + Math.random() * 0.2 : 0.55 + Math.random() * 0.3,
      impactY: height * 0.05 + Math.random() * height * 0.9,
      hasImpacted: false,
    };
  }

  // POOL 2: Impact Surface Splash Ripples
  const ripplePool = new Array(MAX_RIPPLES);
  for (let i = 0; i < MAX_RIPPLES; i++) {
    ripplePool[i] = {
      active: false,
      x: 0,
      y: 0,
      radius: 0,
      maxRadius: 0,
      speed: 0,
      speedDecay: 0.935,
      opacity: 0,
      opacityDecay: 0.925,
      hasGoldGlint: false,
    };
  }

  const spawnRipple = (x, y, hasGold = false, impactScale = 1.0) => {
    if (isReducedMotion) return;

    let targetRip = null;
    let minAlpha = 1.0;
    let fallbackIdx = 0;

    for (let i = 0; i < MAX_RIPPLES; i++) {
      const rip = ripplePool[i];
      if (!rip.active) {
        targetRip = rip;
        break;
      }
      if (rip.opacity < minAlpha) {
        minAlpha = rip.opacity;
        fallbackIdx = i;
      }
    }

    if (!targetRip) {
      targetRip = ripplePool[fallbackIdx];
    }

    targetRip.active = true;
    targetRip.x = x;
    targetRip.y = y;
    targetRip.radius = 1.2;
    targetRip.maxRadius = Math.min(22, (8 + Math.random() * 8) * impactScale);
    targetRip.speed = (0.85 + Math.random() * 0.35) * impactScale;
    targetRip.speedDecay = 0.935;
    targetRip.opacity = 0.85 + Math.random() * 0.15;
    targetRip.opacityDecay = 0.925;
    targetRip.hasGoldGlint = hasGold || Math.random() < 0.22;
  };

  // POOL 3: Glass Water Droplets
  const dropletPool = new Array(activeDropletCount + 6);
  for (let i = 0; i < dropletPool.length; i++) {
    const trails = new Array(MAX_TRAIL_POINTS);
    for (let t = 0; t < MAX_TRAIL_POINTS; t++) {
      trails[t] = { x: 0, y: 0, r: 0, alpha: 0, active: false };
    }
    dropletPool[i] = {
      active: i < activeDropletCount,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2 + Math.random() * 4.5,
      landingScale: 1.0,
      sliding: Math.random() < 0.35,
      slideSpeed: 0.3 + Math.random() * 1.2,
      hasGoldGlint: Math.random() < 0.22,
      trail: trails,
      trailHead: 0,
    };
  }

  const reseedDroplet = (d, customY, isLanding = true) => {
    const r = 2 + Math.random() * 4.5;
    const x = Math.random() * width;
    const y = customY !== undefined ? customY : Math.random() * height;
    const hasGold = Math.random() < 0.22;

    d.active = true;
    d.x = x;
    d.y = y;
    d.radius = r;
    d.landingScale = isLanding ? 0.25 : 1.0;
    d.sliding = Math.random() < 0.35;
    d.slideSpeed = 0.3 + Math.random() * 1.2;
    d.hasGoldGlint = hasGold;
    d.trailHead = 0;
    for (let t = 0; t < MAX_TRAIL_POINTS; t++) {
      d.trail[t].active = false;
    }

    if (isLanding) {
      spawnRipple(x, y, hasGold, Math.max(0.7, r / 3.5));
    }
  };

  let lastTimestamp = performance.now();

  const handleVisibilityChange = () => {
    if (document.hidden) {
      isPaused = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    } else {
      isPaused = false;
      lastTimestamp = performance.now();
      animFrameId = requestAnimationFrame(renderLoop);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const slantX = 1.6;
  let rollingRenderDuration = 0;
  let frameCounter = 0;
  let isLowEndMode = false;

  const renderLoop = (timestamp) => {
    if (isPaused) return;

    const elapsed = timestamp - lastTimestamp;
    if (elapsed < 14) {
      animFrameId = requestAnimationFrame(renderLoop);
      return;
    }

    lastTimestamp = timestamp;
    frameCounter++;

    const startTime = performance.now();
    ctx.clearRect(0, 0, width, height);

    // 1. Rain Streaks
    if (!isReducedMotion) {
      ctx.save();
      ctx.lineCap = 'round';

      for (let i = 0; i < rainStreakPool.length; i++) {
        const r = rainStreakPool[i];

        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + slantX * (r.length / 15), r.y + r.length);

        const strokeColor =
          r.depth === 2
            ? `rgba(255, 253, 248, ${r.opacity})`
            : r.depth === 1
            ? `rgba(243, 226, 169, ${r.opacity * 0.85})`
            : `rgba(169, 201, 184, ${r.opacity})`;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = r.width;
        ctx.stroke();

        r.x += slantX * (r.speed / 15);
        r.y += r.speed;

        if (r.depth >= 1 && !r.hasImpacted && r.y >= r.impactY) {
          if (r.depth === 2 || Math.random() < 0.2) {
            spawnRipple(r.x + slantX * (r.length / 15), r.impactY, r.depth === 2, r.depth === 2 ? 1.15 : 0.8);
          }
          r.hasImpacted = true;
        }

        if (r.y > height + 20) {
          r.y = -20 - Math.random() * 30;
          r.x = Math.random() * width;
          r.impactY = height * 0.05 + Math.random() * height * 0.9;
          r.hasImpacted = false;
        }
        if (r.x > width + 20) {
          r.x = -20;
        }
      }
      ctx.restore();
    }

    // 2. Droplets & Trails
    for (let i = 0; i < dropletPool.length; i++) {
      const d = dropletPool[i];
      if (!d.active) continue;

      if (d.landingScale < 1.0) {
        d.landingScale = Math.min(1.0, d.landingScale + 0.06);
      }
      const currentR = d.radius * d.landingScale;

      if (!isLowEndMode || frameCounter % 2 === 0) {
        ctx.save();
        for (let t = 0; t < MAX_TRAIL_POINTS; t++) {
          const pt = d.trail[t];
          if (pt.active) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(0.6, pt.r * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(169, 201, 184, ${pt.alpha * 0.2})`;
            ctx.fill();
            pt.alpha -= 0.003;
            if (pt.alpha <= 0.02) {
              pt.active = false;
            }
          }
        }
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(d.x + 0.8, d.y + 1.2, currentR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(2, 16, 14, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x, d.y, currentR, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(
        d.x - currentR * 0.25,
        d.y - currentR * 0.25,
        currentR * 0.1,
        d.x,
        d.y,
        currentR
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      grad.addColorStop(0.7, 'rgba(11, 61, 54, 0.1)');
      grad.addColorStop(1, 'rgba(4, 32, 28, 0.55)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(7, 43, 37, 0.45)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        d.x - currentR * 0.35,
        d.y - currentR * 0.35,
        currentR * 0.32,
        currentR * 0.2,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      if (d.hasGoldGlint) {
        ctx.beginPath();
        ctx.arc(d.x + currentR * 0.3, d.y + currentR * 0.3, currentR * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(243, 226, 169, 0.65)';
        ctx.fill();
      }
      ctx.restore();

      if (!isReducedMotion && d.sliding) {
        const trailPt = d.trail[d.trailHead];
        trailPt.x = d.x;
        trailPt.y = d.y;
        trailPt.r = currentR;
        trailPt.alpha = 0.8;
        trailPt.active = true;
        d.trailHead = (d.trailHead + 1) % MAX_TRAIL_POINTS;

        d.y += d.slideSpeed;
        d.x += (Math.random() - 0.5) * 0.3;

        for (let j = 0; j < dropletPool.length; j++) {
          if (i !== j) {
            const other = dropletPool[j];
            if (other.active) {
              const dist = Math.hypot(d.x - other.x, d.y - other.y);
              if (dist < d.radius + other.radius) {
                d.radius = Math.min(9, Math.sqrt(d.radius * d.radius + other.radius * other.radius));
                d.slideSpeed = Math.min(2.5, d.slideSpeed + 0.3);
                spawnRipple(d.x, d.y, true, 1.35);

                other.x = Math.random() * width;
                other.y = -10 - Math.random() * 20;
                other.radius = 2 + Math.random() * 3.5;
                other.landingScale = 1.0;
                for (let t = 0; t < MAX_TRAIL_POINTS; t++) {
                  other.trail[t].active = false;
                }
              }
            }
          }
        }

        if (d.y > height + 20) {
          d.x = Math.random() * width;
          d.y = -15 - Math.random() * 40;
          d.radius = 2 + Math.random() * 4;
          d.landingScale = 1.0;
          d.slideSpeed = 0.3 + Math.random() * 1.2;
          for (let t = 0; t < MAX_TRAIL_POINTS; t++) {
            d.trail[t].active = false;
          }
        }
      }
    }

    if (!isReducedMotion && Math.random() < 0.012) {
      for (let i = 0; i < dropletPool.length; i++) {
        if (!dropletPool[i].active) {
          reseedDroplet(dropletPool[i], undefined, true);
          break;
        }
      }
    }

    // 3. Surface Ripples
    ctx.save();
    for (let ripIdx = 0; ripIdx < MAX_RIPPLES; ripIdx++) {
      const rip = ripplePool[ripIdx];
      if (!rip.active) continue;

      rip.radius += rip.speed;
      rip.speed *= rip.speedDecay;
      rip.opacity *= rip.opacityDecay;

      if (rip.opacity <= 0.015 || rip.radius >= rip.maxRadius || rip.speed < 0.04) {
        rip.active = false;
        continue;
      }

      ctx.beginPath();
      ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.72, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 253, 248, ${rip.opacity * 0.65})`;
      ctx.lineWidth = Math.max(0.35, (rip.opacity / 0.85) * 1.4);
      ctx.stroke();

      if (!isLowEndMode && rip.radius > 2.5) {
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.radius * 0.54, rip.radius * 0.39, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rip.hasGoldGlint
          ? `rgba(243, 226, 169, ${rip.opacity * 0.55})`
          : `rgba(169, 201, 184, ${rip.opacity * 0.35})`;
        ctx.lineWidth = Math.max(0.25, (rip.opacity / 0.85) * 0.9);
        ctx.stroke();
      }

      if (rip.radius < 5 && rip.opacity > 0.35) {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0.4, (1 - rip.radius / 5) * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${rip.opacity * 0.85})`;
        ctx.fill();
      }
    }
    ctx.restore();

    // 4. Performance & Adaptive Throttling
    const duration = performance.now() - startTime;
    rollingRenderDuration = rollingRenderDuration * 0.9 + duration * 0.1;

    if (rollingRenderDuration > 15 && !isLowEndMode) {
      isLowEndMode = true;
    } else if (rollingRenderDuration < 9 && isLowEndMode) {
      isLowEndMode = false;
    }

    animFrameId = requestAnimationFrame(renderLoop);
  };

  animFrameId = requestAnimationFrame(renderLoop);

  return () => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = 0;
    }
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
