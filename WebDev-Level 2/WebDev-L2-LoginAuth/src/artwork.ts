/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AuraAuth - Enchanted Celestial Artwork & SVG Assets
 * Rich, illustrated celestial bookplate aesthetic in Emerald & Champagne Gold.
 */

export const ICONS = {
  // Ornate celestial eye icon for show/hide password toggle
  eyeOrnate: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" class="text-[#D9B86C]" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer eye almond shape -->
      <path d="M2.5 12 C5 6.5 19 6.5 21.5 12 C19 17.5 5 17.5 2.5 12 Z" stroke="#D9B86C" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <!-- Inner celestial iris & pupil star -->
      <circle cx="12" cy="12" r="4.2" stroke="#1F6B5E" stroke-width="1.2" fill="#04201C"/>
      <!-- 4-point golden star pupil -->
      <path d="M12 9.5 L12.6 11.2 L14.5 12 L12.6 12.8 L12 14.5 L11.4 12.8 L9.5 12 L11.4 11.2 Z" fill="#F3E2A9"/>
      <!-- Small lash sparkle -->
      <circle cx="12" cy="4" r="1" fill="#EBC9BE"/>
    </svg>
  `,

  eyeOffOrnate: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" class="text-[#1F6B5E]" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 12 C5 6.5 19 6.5 21.5 12 C19 17.5 5 17.5 2.5 12 Z" stroke="#1F6B5E" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <circle cx="12" cy="12" r="4.2" stroke="#D9B86C" stroke-width="1" fill="#04201C"/>
      <!-- Closed curved lash -->
      <path d="M9 12.5 C10.5 14 13.5 14 15 12.5" stroke="#F3E2A9" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Diagonal celestial slash -->
      <line x1="3" y1="3" x2="21" y2="21" stroke="#D9B86C" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,

  user: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#D9B86C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,

  mail: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#D9B86C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="3"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  `,

  lock: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#D9B86C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `,

  check: `
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `,

  alert: `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="8" y2="12"/>
      <line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  `,

  shield: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D9B86C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  `,

  logout: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  `,

  flourishUnderline: `
    <svg viewBox="0 0 160 16" fill="none" class="w-36 h-3 mx-auto mt-1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 8 L55 8 M105 8 L150 8" stroke="#D9B86C" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="80" cy="8" r="3" fill="#D9B86C"/>
      <circle cx="70" cy="8" r="1.8" fill="#EBC9BE"/>
      <circle cx="90" cy="8" r="1.8" fill="#EBC9BE"/>
      <circle cx="62" cy="8" r="1" fill="#F3E2A9"/>
      <circle cx="98" cy="8" r="1" fill="#F3E2A9"/>
    </svg>
  `,
};

// ----------------------------------------------------------------------------
// FULL MAGICAL BACKGROUND SCENE
// ----------------------------------------------------------------------------
export function renderBackgroundScene(): string {
  return `
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden celestial-scene-bg select-none">
      <!-- Aurora Light Mist Blobs (Screen blend mode) -->
      <div class="aurora-mist-1"></div>
      <div class="aurora-mist-2"></div>

      <!-- Soft Radial Teal Glow Behind Card -->
      <div class="card-radial-glow"></div>

      <!-- Faint Constellations & Crescent Moon in Sky -->
      <svg class="absolute inset-0 w-full h-full opacity-40 parallax-back" xmlns="http://www.w3.org/2000/svg">
        <!-- Faint Large Sky Crescent Moon -->
        <path d="M1280 140 C1240 160 1220 220 1250 270 C1270 300 1310 320 1340 310 C1290 340 1230 320 1200 270 C1170 210 1190 140 1250 110 C1265 102 1280 100 1280 140 Z" fill="#F3E2A9" opacity="0.35" filter="blur(1px)"/>
        <!-- Constellation Cassiopeia / Lyra lines -->
        <g stroke="#D9B86C" stroke-width="0.8" opacity="0.6">
          <line x1="160" y1="120" x2="210" y2="160"/>
          <line x1="210" y1="160" x2="270" y2="140"/>
          <line x1="270" y1="140" x2="310" y2="190"/>
          <line x1="310" y1="190" x2="360" y2="170"/>
          <!-- Star nodes -->
          <circle cx="160" cy="120" r="2.5" fill="#FFFDF8"/>
          <circle cx="210" cy="160" r="2" fill="#F3E2A9"/>
          <circle cx="270" cy="140" r="2.2" fill="#FFFDF8"/>
          <circle cx="310" cy="190" r="2" fill="#EBC9BE"/>
          <circle cx="360" cy="170" r="2.5" fill="#F3E2A9"/>
        </g>
      </svg>

      <!-- 4+ Layered Flowing Paper-cut Curved Shapes (Forest & Jade depth with shadows) -->
      <svg class="absolute inset-0 w-full h-full parallax-mid" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="paperForest1" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0B3D36" stop-opacity="0.88"/>
            <stop offset="0.6" stop-color="#082A24" stop-opacity="0.95"/>
            <stop offset="1" stop-color="#031512" stop-opacity="0.98"/>
          </linearGradient>

          <linearGradient id="paperJade2" x1="1440" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F6B5E" stop-opacity="0.45"/>
            <stop offset="0.5" stop-color="#0E483F" stop-opacity="0.65"/>
            <stop offset="1" stop-color="#031512" stop-opacity="0.9"/>
          </linearGradient>

          <linearGradient id="paperForest3" x1="0" y1="900" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#09352F" stop-opacity="0.75"/>
            <stop offset="1" stop-color="#031512" stop-opacity="0.95"/>
          </linearGradient>

          <!-- Metallic Champagne Gold Ribbon Gradients with Specular Highlight -->
          <linearGradient id="goldRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFDF8"/>
            <stop offset="18%" stop-color="#F3E2A9"/>
            <stop offset="50%" stop-color="#D9B86C"/>
            <stop offset="80%" stop-color="#9E7D30"/>
            <stop offset="100%" stop-color="#F3E2A9"/>
          </linearGradient>

          <linearGradient id="goldRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F3E2A9"/>
            <stop offset="35%" stop-color="#D9B86C"/>
            <stop offset="75%" stop-color="#8F6E28"/>
            <stop offset="100%" stop-color="#FFFDF8"/>
          </linearGradient>

          <filter id="ribbonOuterGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <filter id="paperShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#010C0A" flood-opacity="0.85"/>
          </filter>
        </defs>

        <!-- Paper-cut Layer A (Deep Forest Wave) -->
        <path d="M-100,160 C320,10 620,340 1080,100 C1280,-10 1420,80 1540,150 L1540,900 L-100,900 Z" fill="url(#paperForest1)" filter="url(#paperShadow)"/>

        <!-- Paper-cut Layer B (Jade Mid-Tone Arc) -->
        <path d="M-80,480 C280,320 640,660 1120,420 C1320,320 1460,410 1540,460 L1540,900 L-80,900 Z" fill="url(#paperJade2)" filter="url(#paperShadow)"/>

        <!-- Paper-cut Layer C (Rising Crest) -->
        <path d="M-60,780 C360,560 820,860 1540,640 L1540,900 L-60,900 Z" fill="url(#paperForest3)" filter="url(#paperShadow)"/>

        <!-- 3 Glossy Champagne-Gold Ribbons with Outer Glow & Specular Highlight -->
        <!-- Ribbon 1: Dynamic Top Arch to Bottom -->
        <g class="ribbon-wave-1 ribbon-shimmer-sweep">
          <path d="M-80,120 C360,460 880,20 1540,640" stroke="url(#goldRibbon1)" stroke-width="18" stroke-linecap="round" opacity="0.32" filter="url(#ribbonOuterGlow)"/>
          <path d="M-80,120 C360,460 880,20 1540,640" stroke="url(#goldRibbon1)" stroke-width="7" stroke-linecap="round"/>
          <path d="M-76,118 C363,458 883,18 1543,638" stroke="#FFFDF8" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
        </g>

        <!-- Ribbon 2: Low Swelling Wave -->
        <g class="ribbon-wave-2 ribbon-shimmer-sweep opacity-85">
          <path d="M-60,640 C340,380 840,820 1540,450" stroke="url(#goldRibbon2)" stroke-width="14" stroke-linecap="round" filter="url(#ribbonOuterGlow)"/>
          <path d="M-60,640 C340,380 840,820 1540,450" stroke="url(#goldRibbon2)" stroke-width="5" stroke-linecap="round"/>
          <path d="M-57,638 C342,378 842,818 1542,448" stroke="#FFFDF8" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
        </g>

        <!-- Ribbon 3: Bottom Shimmer Accent -->
        <g class="ribbon-wave-1 opacity-75">
          <path d="M-40,860 C380,680 940,920 1520,780" stroke="url(#goldRibbon1)" stroke-width="8" stroke-linecap="round" filter="url(#ribbonOuterGlow)"/>
          <path d="M-40,860 C380,680 940,920 1520,780" stroke="#FFFDF8" stroke-width="1.5" stroke-linecap="round"/>
        </g>
      </svg>

      <!-- 60+ Twinkling Stars & Rising Fireflies (Mix of 4-point stars & dots) -->
      <div class="absolute inset-0 pointer-events-none parallax-front">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <!-- Rising glowing fireflies -->
          <circle cx="15%" cy="85%" r="2" fill="#F3E2A9" class="firefly-particle" style="animation-delay: 0s;"/>
          <circle cx="28%" cy="75%" r="1.8" fill="#EBC9BE" class="firefly-particle" style="animation-delay: 2.2s;"/>
          <circle cx="72%" cy="82%" r="2.2" fill="#F3E2A9" class="firefly-particle" style="animation-delay: 4.1s;"/>
          <circle cx="85%" cy="70%" r="1.6" fill="#FFFDF8" class="firefly-particle" style="animation-delay: 1.5s;"/>
          <circle cx="48%" cy="88%" r="1.8" fill="#F3E2A9" class="firefly-particle" style="animation-delay: 3.3s;"/>

          <!-- Twinkling Star Clusters -->
          <g class="star-twinkle-slow">
            <circle cx="6%" cy="14%" r="1.5" fill="#F3E2A9"/>
            <path d="M12% 24% L12.6% 26.5% L15% 27% L12.6% 27.5% L12% 30% L11.4% 27.5% L9% 27% L11.4% 26.5% Z" fill="#FFFDF8"/>
            <circle cx="22%" cy="10%" r="1.8" fill="#EBC9BE"/>
            <circle cx="34%" cy="18%" r="1.2" fill="#FFFDF8"/>
            <path d="M78% 14% L78.6% 16.5% L81% 17% L78.6% 17.5% L78% 20% L77.4% 17.5% L75% 17% L77.4% 16.5% Z" fill="#F3E2A9"/>
            <circle cx="88%" cy="22%" r="2" fill="#FFFDF8"/>
            <circle cx="94%" cy="12%" r="1.5" fill="#EBC9BE"/>
            <circle cx="8%" cy="65%" r="1.8" fill="#F3E2A9"/>
            <path d="M14% 78% L14.5% 80.5% L17% 81% L14.5% 81.5% L14% 84% L13.5% 81.5% L11% 81% L13.5% 80.5% Z" fill="#D9B86C"/>
            <circle cx="84%" cy="80%" r="1.8" fill="#F3E2A9"/>
          </g>

          <g class="star-twinkle-fast">
            <circle cx="18%" cy="18%" r="1.2" fill="#EBC9BE"/>
            <circle cx="26%" cy="32%" r="1.5" fill="#FFFDF8"/>
            <path d="M42% 12% L42.5% 14.5% L45% 15% L42.5% 15.5% L42% 18% L41.5% 15.5% L39% 15% L41.5% 14.5% Z" fill="#F3E2A9"/>
            <circle cx="68% " cy="8%" r="1.6" fill="#FFFDF8"/>
            <circle cx="74%" cy="28%" r="1.2" fill="#EBC9BE"/>
            <circle cx="91%" cy="38%" r="2" fill="#F3E2A9"/>
            <path d="M86% 68% L86.5% 70.5% L89% 71% L86.5% 71.5% L86% 74% L85.5% 71.5% L83% 71% L85.5% 70.5% Z" fill="#FFFDF8"/>
            <circle cx="76%" cy="88%" r="1.5" fill="#D9B86C"/>
          </g>
        </svg>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// LARGE ARCHED WINDOW (130% card width, perched birds, sunburst, stars, clouds)
// ----------------------------------------------------------------------------
export function renderLargeArchWindow(): string {
  return `
    <div class="relative w-[340px] sm:w-[540px] lg:w-[600px] h-[160px] sm:h-[190px] -mb-16 z-0 pointer-events-none select-none">
      <svg viewBox="0 0 600 220" fill="none" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="archSkyDeep" x1="300" y1="0" x2="300" y2="220" gradientUnits="userSpaceOnUse">
            <stop stop-color="#031512"/>
            <stop offset="0.5" stop-color="#082E27"/>
            <stop offset="1" stop-color="#0B3D36"/>
          </linearGradient>

          <linearGradient id="archGoldMoulding2" x1="0" y1="0" x2="600" y2="220" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFDF8"/>
            <stop offset="0.2" stop-color="#F3E2A9"/>
            <stop offset="0.55" stop-color="#D9B86C"/>
            <stop offset="0.85" stop-color="#9E7D30"/>
            <stop offset="1" stop-color="#F3E2A9"/>
          </linearGradient>

          <linearGradient id="archSunburst" x1="300" y1="180" x2="300" y2="20" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F3E2A9" stop-opacity="0.9"/>
            <stop offset="1" stop-color="#D9B86C" stop-opacity="0.08"/>
          </linearGradient>

          <linearGradient id="cloudSageGrad" x1="0" y1="0" x2="100" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F6B5E" stop-opacity="0.4"/>
            <stop offset="1" stop-color="#0B3D36" stop-opacity="0.6"/>
          </linearGradient>
        </defs>

        <!-- Outer Arch Moulding Frame with Crown Finial -->
        <path d="M300 12 C305 18 310 22 315 26 C430 32 540 95 560 220 L40 220 C60 95 170 32 285 26 C290 22 295 18 300 12 Z" fill="url(#archGoldMoulding2)" filter="drop-shadow(0 6px 16px rgba(0,0,0,0.5))"/>

        <!-- Inner Starry Night Sky Arch Window -->
        <path d="M300 24 C410 28 515 88 535 220 L65 220 C85 88 190 28 300 24 Z" fill="url(#archSkyDeep)" stroke="#1F6B5E" stroke-width="2"/>

        <!-- Soft Clouds in Sage/Jade along Arch Base -->
        <path d="M70 200 C90 170 140 175 160 195 C185 165 240 170 260 205 C290 175 340 170 370 200 C395 170 450 175 470 205 C495 180 535 190 540 215 L60 215 Z" fill="url(#cloudSageGrad)"/>

        <!-- Sunburst Rays in Champagne Gold -->
        <g stroke="url(#archSunburst)" stroke-width="1.4">
          <line x1="300" y1="180" x2="300" y2="35"/>
          <line x1="300" y1="180" x2="250" y2="45"/>
          <line x1="300" y1="180" x2="350" y2="45"/>
          <line x1="300" y1="180" x2="200" y2="65"/>
          <line x1="300" y1="180" x2="400" y2="65"/>
          <line x1="300" y1="180" x2="160" y2="95"/>
          <line x1="300" y1="180" x2="440" y2="95"/>
          <line x1="300" y1="180" x2="130" y2="135"/>
          <line x1="300" y1="180" x2="470" y2="135"/>
        </g>

        <!-- Golden Crescent Moon -->
        <path d="M322 52 C314 55 310 65 315 74 C320 81 329 84 334 82 C324 88 312 85 306 77 C299 69 302 57 311 50 C315 47 320 47 322 52 Z" fill="#F3E2A9" filter="drop-shadow(0 0 6px rgba(243,226,169,0.85))"/>

        <!-- Many Stars & 4-Point Sparkles -->
        <path d="M240 60 L242 65 L247 67 L242 69 L240 74 L238 69 L233 67 L238 65 Z" fill="#FFFDF8"/>
        <path d="M365 72 L366.5 76 L371 77.5 L366.5 79 L365 83 L363.5 79 L359 77.5 L363.5 76 Z" fill="#F3E2A9"/>
        <path d="M190 95 L191.5 98 L195 99.5 L191.5 101 L190 104 L188.5 101 L185 99.5 L188.5 98 Z" fill="#FFFDF8"/>
        <path d="M420 102 L421.5 105 L425 106.5 L421.5 108 L420 111 L418.5 108 L415 106.5 L418.5 105 Z" fill="#F3E2A9"/>
        <circle cx="275" cy="85" r="1.4" fill="#EBC9BE"/>
        <circle cx="340" cy="110" r="1.5" fill="#FFFDF8"/>
        <circle cx="220" cy="125" r="1.2" fill="#F3E2A9"/>
        <circle cx="390" cy="130" r="1.4" fill="#EBC9BE"/>

        <!-- TWO ILLUSTRATED PERCHED BIRDS / WINGS ON TOP CORNERS -->
        <!-- Left Perched Bird -->
        <g transform="translate(42, 60)">
          <path d="M40 30 C25 10 5 18 0 32 C15 34 26 30 32 38 C28 48 35 56 46 54 C54 52 60 42 58 35 Z" fill="#0B3D36" stroke="#D9B86C" stroke-width="1.4"/>
          <!-- Wing feathers -->
          <path d="M10 22 C18 16 30 18 36 28 M18 28 C26 24 35 26 40 34" stroke="#F3E2A9" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="4" cy="28" r="1.4" fill="#EBC9BE" stroke="#D9B86C" stroke-width="0.8"/>
        </g>
        <!-- Right Perched Bird (Mirrored) -->
        <g transform="translate(558, 60) scale(-1, 1)">
          <path d="M40 30 C25 10 5 18 0 32 C15 34 26 30 32 38 C28 48 35 56 46 54 C54 52 60 42 58 35 Z" fill="#0B3D36" stroke="#D9B86C" stroke-width="1.4"/>
          <path d="M10 22 C18 16 30 18 36 28 M18 28 C26 24 35 26 40 34" stroke="#F3E2A9" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="4" cy="28" r="1.4" fill="#EBC9BE" stroke="#D9B86C" stroke-width="0.8"/>
        </g>
      </svg>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// DENSE LUSH BOTANICAL CLUSTERS (FILLED petals & leaves with gradients & veins)
// ----------------------------------------------------------------------------
export function renderLushBotanicals(side: 'left' | 'right'): string {
  const isLeft = side === 'left';
  const positionClass = isLeft
    ? 'sway-botanical-left left-[-110px] lg:left-[-140px]'
    : 'sway-botanical-right right-[-110px] lg:right-[-140px] transform scale-x-[-1]';

  return `
    <div class="absolute top-[40px] ${positionClass} w-[130px] lg:w-[155px] h-[580px] pointer-events-none select-none hidden md:block z-30">
      <svg viewBox="0 0 155 580" fill="none" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="botanicalJadeGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stop-color="#288777"/>
            <stop offset="0.6" stop-color="#1F6B5E"/>
            <stop offset="1" stop-color="#0B3D36"/>
          </linearGradient>

          <linearGradient id="botanicalSageGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#CBE4D6"/>
            <stop offset="0.6" stop-color="#A9C9B8"/>
            <stop offset="1" stop-color="#1F6B5E"/>
          </linearGradient>

          <linearGradient id="blushPetalRich" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFF8F6"/>
            <stop offset="0.3" stop-color="#F5DDD6"/>
            <stop offset="0.75" stop-color="#EBC9BE"/>
            <stop offset="1" stop-color="#D9B86C"/>
          </linearGradient>

          <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#021411" flood-opacity="0.5"/>
          </filter>
        </defs>

        <!-- TOP: Curling Vines with Tiny Buds & Gold Dots -->
        <path d="M120 40 C90 10 50 25 70 70 C85 100 110 80 95 60 C80 40 60 65 50 95" stroke="#D9B86C" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="95" r="3.5" fill="#EBC9BE" stroke="#D9B86C" stroke-width="1.2"/>
        <circle cx="95" cy="60" r="2.5" fill="#F3E2A9"/>

        <!-- UPPER BOTANICALS: Dense Overlapping Jade Leaves with Veins -->
        <g filter="url(#leafShadow)">
          <!-- Leaf 1 (Filled Jade with Visible Veins) -->
          <path d="M115 80 C85 95 45 110 25 140 C40 150 70 145 95 130 C108 122 115 105 115 80 Z" fill="url(#botanicalJadeGrad)" stroke="#D9B86C" stroke-width="1.2"/>
          <path d="M115 80 C78 112 50 128 25 140 M95 105 L80 122 M75 118 L60 132 M55 128 L42 138" stroke="#F3E2A9" stroke-width="0.9" stroke-linecap="round"/>

          <!-- Leaf 2 (Filled Sage) -->
          <path d="M125 115 C95 135 60 160 45 195 C60 200 90 190 110 170 C122 158 126 140 125 115 Z" fill="url(#botanicalSageGrad)" stroke="#D9B86C" stroke-width="1.2"/>
          <path d="M125 115 C92 150 70 172 45 195 M105 145 L92 165 M85 160 L72 178" stroke="#0B3D36" stroke-width="0.9" stroke-linecap="round"/>
        </g>

        <!-- MID CLUSTER: BIG LAYERED LOTUS/ROSE FLOWER (FILLED PETALS WITH SOFT SHADOW) -->
        <g transform="translate(30, 205)" filter="url(#leafShadow)">
          <!-- Outer Jade Calyx Leaves -->
          <path d="M60 65 C35 80 15 70 0 50 C18 45 40 50 60 65 Z" fill="#1F6B5E" stroke="#D9B86C" stroke-width="1.2"/>
          <path d="M60 65 C85 80 105 70 120 50 C102 45 80 50 60 65 Z" fill="#1F6B5E" stroke="#D9B86C" stroke-width="1.2"/>

          <!-- Layer 1: Sage Petals -->
          <path d="M60 65 C35 55 20 35 28 12 C44 24 52 42 60 65 Z" fill="url(#botanicalSageGrad)" stroke="#D9B86C" stroke-width="1.2"/>
          <path d="M60 65 C85 55 100 35 92 12 C76 24 68 42 60 65 Z" fill="url(#botanicalSageGrad)" stroke="#D9B86C" stroke-width="1.2"/>

          <!-- Layer 2: Rich Blush-to-Ivory-to-Gold Petals -->
          <path d="M60 65 C45 48 38 25 50 6 C60 22 60 42 60 65 Z" fill="url(#blushPetalRich)" stroke="#D9B86C" stroke-width="1.4"/>
          <path d="M60 65 C75 48 82 25 70 6 C60 22 60 42 60 65 Z" fill="url(#blushPetalRich)" stroke="#D9B86C" stroke-width="1.4"/>

          <!-- Center Flower Heart Jewel & Sparkle Cluster -->
          <circle cx="60" cy="30" r="5" fill="#F3E2A9" stroke="#9E7D30" stroke-width="1.2"/>
          <circle cx="60" cy="30" r="2.2" fill="#EBC9BE"/>
          <!-- Micro floating gold dots -->
          <circle cx="42" cy="5" r="1.5" fill="#EBC9BE"/>
          <circle cx="78" cy="-2" r="1.8" fill="#F3E2A9"/>
        </g>

        <!-- LOWER BOTANICAL CASCADE: Layered Ferns & Rosebud Nodes -->
        <g filter="url(#leafShadow)">
          <!-- Fern Sweep -->
          <path d="M110 300 C80 330 45 370 25 420 C40 425 68 412 92 390 C108 375 112 350 110 300 Z" fill="url(#botanicalJadeGrad)" stroke="#D9B86C" stroke-width="1.2"/>
          <path d="M110 300 C75 345 52 382 25 420" stroke="#F3E2A9" stroke-width="1"/>

          <!-- Rosebud Node -->
          <g transform="translate(45, 430)">
            <path d="M30 30 C18 24 14 14 22 5 C30 12 30 22 30 30 Z" fill="url(#blushPetalRich)" stroke="#D9B86C" stroke-width="1.2"/>
            <path d="M30 30 C42 24 46 14 38 5 C30 12 30 22 30 30 Z" fill="url(#blushPetalRich)" stroke="#D9B86C" stroke-width="1.2"/>
            <circle cx="30" cy="18" r="2.5" fill="#F3E2A9"/>
          </g>

          <!-- Bottom Tendril with Hanging Gem -->
          <path d="M100 450 C80 475 55 510 75 545 C86 560 100 545 90 528 C80 510 65 520 60 550" stroke="#D9B86C" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          <circle cx="60" cy="550" r="3.5" fill="#EBC9BE" stroke="#D9B86C" stroke-width="1.2"/>
        </g>
      </svg>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// GLOWING CIRCULAR TOP EMBLEM WITH ROTATING RING & BURST SPARKLES
// ----------------------------------------------------------------------------
export function renderCelestialEmblem(): string {
  return `
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-30 select-none flex items-center justify-center">
      <!-- Outer Soft Glow Pulse -->
      <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D9B86C] via-[#F3E2A9] to-[#9E7D30] p-[2.5px] shadow-[0_0_35px_rgba(243,226,169,0.8),0_8px_24px_rgba(0,0,0,0.6)]">
        <div class="w-full h-full rounded-full bg-[#04201C] flex items-center justify-center relative overflow-hidden">
          
          <!-- Slowly Rotating Inner Concentric Ring with Sunburst Dots -->
          <svg viewBox="0 0 80 80" class="absolute inset-0 w-full h-full emblem-ring-rotate" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="#D9B86C" stroke-width="1" stroke-dasharray="3 3"/>
            <circle cx="40" cy="40" r="30" stroke="#F3E2A9" stroke-width="0.8"/>
            <circle cx="40" cy="6" r="1.5" fill="#EBC9BE"/>
            <circle cx="40" cy="74" r="1.5" fill="#EBC9BE"/>
            <circle cx="6" cy="40" r="1.5" fill="#EBC9BE"/>
            <circle cx="74" cy="40" r="1.5" fill="#EBC9BE"/>
          </svg>

          <!-- Central 8-Pointed Celestial Star with Glow -->
          <svg viewBox="0 0 60 60" class="w-11 h-11 text-[#D9B86C] relative z-10 emblem-sparkle-burst" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#starCenterGlow)">
              <path d="M30 10 L33 24 L47 20 L37 28.5 L46 39 L33 34.5 L30 48 L27 34.5 L14 39 L23 28.5 L13 20 L27 24 Z" fill="url(#emblemStarGrad)" stroke="#FFFDF8" stroke-width="0.8"/>
            </g>
            <circle cx="30" cy="30" r="3.2" fill="#FFFDF8"/>
            <defs>
              <linearGradient id="emblemStarGrad" x1="15" y1="10" x2="45" y2="48" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFDF8"/>
                <stop offset="0.4" stop-color="#F3E2A9"/>
                <stop offset="0.8" stop-color="#D9B86C"/>
                <stop offset="1" stop-color="#9E7D30"/>
              </linearGradient>
              <filter id="starCenterGlow" x="5" y="5" width="50" height="50" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#F3E2A9" flood-opacity="0.9"/>
              </filter>
            </defs>
          </svg>

        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// FAIRY LIGHTS STRING (Draped along the top edge of the card)
// ----------------------------------------------------------------------------
export function renderFairyLights(): string {
  return `
    <div class="absolute top-[8px] left-[35px] right-[35px] h-[20px] pointer-events-none select-none z-20 overflow-visible">
      <svg viewBox="0 0 400 24" fill="none" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <!-- Draped string curves -->
        <path d="M0 4 C50 18 100 18 150 6 C200 20 250 20 300 6 C350 18 380 16 400 4" stroke="#D9B86C" stroke-width="0.8" opacity="0.6"/>
        <!-- Fairy Light Glowing Dots -->
        <circle cx="50" cy="14" r="2.2" fill="#FFFDF8" class="fairy-light-dot" style="animation-delay: 0s;"/>
        <circle cx="100" cy="13" r="2" fill="#F3E2A9" class="fairy-light-dot" style="animation-delay: 0.8s;"/>
        <circle cx="150" cy="6" r="2.2" fill="#EBC9BE" class="fairy-light-dot" style="animation-delay: 1.5s;"/>
        <circle cx="200" cy="14" r="2.4" fill="#FFFDF8" class="fairy-light-dot" style="animation-delay: 0.3s;"/>
        <circle cx="250" cy="13" r="2" fill="#F3E2A9" class="fairy-light-dot" style="animation-delay: 1.1s;"/>
        <circle cx="300" cy="6" r="2.2" fill="#EBC9BE" class="fairy-light-dot" style="animation-delay: 1.9s;"/>
        <circle cx="350" cy="14" r="2" fill="#FFFDF8" class="fairy-light-dot" style="animation-delay: 0.5s;"/>
      </svg>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// SCALLOPED CORNER JEWELS & BOTTOM PENDANT
// ----------------------------------------------------------------------------
export function renderCornerJewels(): string {
  const jewelSvg = (transform = '') => `
    <svg viewBox="0 0 48 48" fill="none" class="w-full h-full ${transform}" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 24 C4 13 13 4 24 4" stroke="#D9B86C" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M8 24 C8 15 15 8 24 8" stroke="#1F6B5E" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="3.5" fill="#0B3D36" stroke="#D9B86C" stroke-width="1.4"/>
      <circle cx="12" cy="12" r="1.5" fill="#EBC9BE"/>
      <path d="M24 16 L25.2 19 L28 20 L25.2 21 L24 24 L22.8 21 L20 20 L22.8 19 Z" fill="#D9B86C"/>
    </svg>
  `;

  return `
    <div class="absolute top-[8px] left-[8px] w-12 h-12 pointer-events-none z-20">${jewelSvg()}</div>
    <div class="absolute top-[8px] right-[8px] w-12 h-12 pointer-events-none z-20">${jewelSvg('transform scale-x-[-1]')}</div>
    <div class="absolute bottom-[8px] left-[8px] w-12 h-12 pointer-events-none z-20">${jewelSvg('transform scale-y-[-1]')}</div>
    <div class="absolute bottom-[8px] right-[8px] w-12 h-12 pointer-events-none z-20">${jewelSvg('transform scale-[-1]')}</div>
  `;
}

export function renderBottomPendant(): string {
  return `
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none select-none">
      <svg viewBox="0 0 74 74" fill="none" class="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
        <!-- Diamond Shield with Double Border -->
        <path d="M37 6 L58 27 L37 50 L16 27 Z" fill="#FAF4E4" stroke="#D9B86C" stroke-width="2"/>
        <path d="M37 12 L52 27 L37 44 L22 27 Z" fill="#04201C" stroke="#1F6B5E" stroke-width="1.2"/>
        <!-- Glowing Crescent Moon -->
        <path d="M39 19 C35 21 34 26 36 31 C38 34 42 35 44 34 C40 37 34 36 31 32 C28 27 29 21 34 18 C36 17 38 17 39 19 Z" fill="#F3E2A9" filter="drop-shadow(0 0 4px rgba(243,226,169,0.9))"/>
        <!-- Hanging Leaf & Gem Cluster -->
        <path d="M37 50 L37 58" stroke="#D9B86C" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M37 58 C32 60 28 65 37 72 C46 65 42 60 37 58 Z" fill="#0B3D36" stroke="#D9B86C" stroke-width="1.4"/>
        <circle cx="37" cy="64" r="1.8" fill="#EBC9BE"/>
      </svg>
    </div>
  `;
}
