// build-system.js - Master Builder for CODEX://ANJAN Cyberpunk Developer Operating System
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TARGET_DIRS = [
  'C:/Users/anjan/OneDrive/Documents/readme 1',
  'C:/Users/anjan/OneDrive/Documents/codexanjan'
];

const COLORS = {
  BG_DARKEST: '#020408',
  BG_DARK: '#04070D',
  BG_MID: '#060A13',
  BG_CARD: '#080D18',
  CYAN: '#00F5FF',
  BLUE: '#3A86FF',
  MAGENTA: '#FF2BD6',
  GREEN: '#39FF88',
  AMBER: '#FFC857',
  TEXT_PRIMARY: '#EAFBFF',
  TEXT_SECONDARY: '#7894A6',
  GRID_LINE: 'rgba(0, 245, 255, 0.08)',
  BORDER_CYAN: 'rgba(0, 245, 255, 0.25)',
  BORDER_ACCENT: 'rgba(58, 134, 255, 0.35)'
};

const FONT_FAMILY = "ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', 'Courier New', monospace";

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return String(unsafe);
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function svgWrap({ width, height, defs = '', styles = '', content }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMid meet">
  <defs>
    <style>
      @keyframes pulseGlow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.3; } }
      @keyframes cursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes waveScroll { 0% { stroke-dashoffset: 800; } 100% { stroke-dashoffset: 0; } }
      @keyframes lineFade { 0%, 20% { opacity: 0; } 35%, 100% { opacity: 1; } }
      text { font-family: ${FONT_FAMILY}; -webkit-font-smoothing: antialiased; }
      ${styles}
    </style>
    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-magenta" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${COLORS.GRID_LINE}" stroke-width="0.8"/>
      <circle cx="30" cy="0" r="0.8" fill="${COLORS.CYAN}" opacity="0.3"/>
    </pattern>
    <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.CYAN}" />
      <stop offset="100%" stop-color="${COLORS.BLUE}" />
    </linearGradient>
    <linearGradient id="hud-bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLORS.CYAN}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${COLORS.GREEN}" stop-opacity="0.9"/>
    </linearGradient>
    ${defs}
  </defs>
  <rect width="${width}" height="${height}" fill="${COLORS.BG_DARK}" />
  <rect width="${width}" height="${height}" fill="url(#grid-pattern)" />
  ${content}
</svg>`;
}

function cyberCornerBrackets(x, y, w, h, len = 12, color = COLORS.CYAN, strokeWidth = 1.5) {
  return `
    <path d="M ${x} ${y + len} L ${x} ${y} L ${x + len} ${y}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
    <path d="M ${x + w - len} ${y} L ${x + w} ${y} L ${x + w} ${y + len}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
    <path d="M ${x} ${y + h - len} L ${x} ${y + h} L ${x + len} ${y + h}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
    <path d="M ${x + w - len} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - len}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />
  `;
}

// -------------------------------------------------------------
// ASSETS GENERATORS
// -------------------------------------------------------------

function getAssets() {
  const assets = {};

  // BOOT
  assets['assets/boot/power-on.svg'] = svgWrap({
    width: 1200, height: 180,
    content: `
      <rect width="1200" height="180" fill="#020408" opacity="0.95" />
      <text x="30" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="2">SYS.BOOT://INITIAL_POWER_SURGE</text>
      <text x="1170" y="28" fill="${COLORS.CYAN}" font-size="9" text-anchor="end" letter-spacing="2">VOLTAGE: 1.21 GV [NOMINAL]</text>
      <line x1="30" y1="35" x2="1170" y2="35" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
      <g transform="translate(600, 95)">
        <circle cx="0" cy="0" r="4" fill="${COLORS.CYAN}"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="0" cy="0" r="16" fill="none" stroke="${COLORS.CYAN}" stroke-width="1.2" stroke-dasharray="3 3"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/></circle>
        <circle cx="0" cy="0" r="36" fill="none" stroke="${COLORS.BLUE}" stroke-width="1" opacity="0.6"><animate attributeName="r" values="8;48" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite"/></circle>
        <line x1="-550" y1="0" x2="550" y2="0" stroke="url(#cyan-gradient)" stroke-width="1.5" opacity="0.8"/>
        <line x1="-300" y1="0" x2="300" y2="0" stroke="#FFF" stroke-width="2.5" opacity="0.9"/>
      </g>
      <text x="600" y="80" fill="${COLORS.TEXT_PRIMARY}" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="8" filter="url(#glow-cyan)">CODEX NETWORK</text>
      <text x="600" y="132" fill="${COLORS.CYAN}" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">POWER://ONLINE <tspan fill="${COLORS.GREEN}">● [ACTIVE]</tspan></text>
      ${cyberCornerBrackets(10, 10, 1180, 160, 14, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/boot/boot-sequence.svg'] = svgWrap({
    width: 1200, height: 330,
    styles: `
      @keyframes cursorFlash { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes progressBar { 0% { width: 0px; } 100% { width: 340px; } }
    `,
    content: `
      <rect x="0" y="0" width="1200" height="34" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <circle cx="24" cy="17" r="4" fill="#FF5F56" /><circle cx="38" cy="17" r="4" fill="#FFBD2E" /><circle cx="52" cy="17" r="4" fill="#27C93F" />
      <text x="80" y="21" fill="${COLORS.TEXT_SECONDARY}" font-size="11" font-weight="600" letter-spacing="1">CODEX_TERMINAL // BOOT_KERNEL_V6.0</text>
      <text x="1170" y="21" fill="${COLORS.CYAN}" font-size="10" text-anchor="end" letter-spacing="1">NODE://CODEXANJAN</text>
      
      <g transform="translate(45, 75)" font-size="13" font-weight="500">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-weight="700">&gt; CODEX BIOS v6.0 - INITIALIZING SYSTEM ARCHITECTURE...</text>
        <text x="0" y="26" fill="${COLORS.TEXT_SECONDARY}">[0.0012] MEMORY CORE ............................. <tspan fill="${COLORS.GREEN}" font-weight="700">READY [64TB NEURAL ALLOCATED]</tspan></text>
        <text x="0" y="52" fill="${COLORS.TEXT_SECONDARY}">[0.0034] NEURAL PROCESSOR ........................ <tspan fill="${COLORS.GREEN}" font-weight="700">READY [TENSOR FLOW ENGINE V24]</tspan></text>
        <text x="0" y="78" fill="${COLORS.TEXT_SECONDARY}">[0.0058] DEV ENGINE .............................. <tspan fill="${COLORS.CYAN}" font-weight="700">READY [TYPESCRIPT // FULL-STACK]</tspan></text>
        <text x="0" y="104" fill="${COLORS.TEXT_SECONDARY}">[0.0089] AI MODULE ............................... <tspan fill="${COLORS.CYAN}" font-weight="700">READY [DEEP ARCHITECTURE ONLINE]</tspan></text>
        <text x="0" y="130" fill="${COLORS.TEXT_SECONDARY}">[0.0120] GITHUB INTERFACE ........................ <tspan fill="${COLORS.GREEN}" font-weight="700">CONNECTED [@CODEXANJAN]</tspan></text>
        <text x="0" y="156" fill="${COLORS.TEXT_SECONDARY}">[0.0155] IDENTITY SYSTEM ......................... <tspan fill="${COLORS.AMBER}" font-weight="700">ENCRYPTED // SEARCHING FOR OPERATOR...</tspan></text>
        <text x="0" y="184" fill="${COLORS.CYAN}">&gt;&gt; PRIMARY NODE DETECTED: [ANJAN SHETTY]</text>
        
        <g transform="translate(0, 205)">
          <rect x="0" y="0" width="360" height="12" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
          <rect x="2" y="2" width="340" height="8" fill="url(#hud-bar)" style="animation: progressBar 3s ease-in-out forwards;" />
          <text x="375" y="10" fill="${COLORS.CYAN}" font-size="11" font-weight="700">100% COMPLETE</text>
        </g>
        <g transform="translate(0, 240)">
          <text x="0" y="0" fill="${COLORS.GREEN}" font-size="14" font-weight="700" letter-spacing="2">&gt; INITIATING IDENTITY REVELATION PROTOCOL...</text>
          <rect x="420" y="-12" width="10" height="16" fill="${COLORS.CYAN}" style="animation: cursorFlash 0.8s infinite;" />
        </g>
      </g>

      <g transform="translate(900, 70)">
        <rect x="0" y="0" width="260" height="230" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="15" y="22" fill="${COLORS.CYAN}" font-size="10" font-weight="700" letter-spacing="1">SYSTEM DIAGNOSTICS</text>
        <line x1="15" y1="30" x2="245" y2="30" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="15" y="52" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CPU_LOAD: 8.2%</text>
        <text x="15" y="74" fill="${COLORS.TEXT_SECONDARY}" font-size="9">NEURAL_TEMP: 38.4°C</text>
        <text x="15" y="96" fill="${COLORS.TEXT_SECONDARY}" font-size="9">PACKETS_RX: 98,421</text>
        <text x="15" y="118" fill="${COLORS.TEXT_SECONDARY}" font-size="9">PACKETS_TX: 41,209</text>
        <text x="15" y="140" fill="${COLORS.TEXT_SECONDARY}" font-size="9">SECURITY: SECURE</text>
        <text x="15" y="162" fill="${COLORS.TEXT_SECONDARY}" font-size="9">UPTIME: 99.999%</text>
        <text x="15" y="184" fill="${COLORS.GREEN}" font-size="9" font-weight="700">STATUS: OPTIMAL</text>
        ${cyberCornerBrackets(4, 4, 252, 222, 10, COLORS.CYAN, 1)}
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 310, 12, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/boot/bios-scan.svg'] = svgWrap({
    width: 1200, height: 150,
    content: `
      <g transform="translate(30, 20)">
        <text x="0" y="20" fill="${COLORS.CYAN}" font-size="13" font-weight="700" letter-spacing="2">BIOS_SCAN://HARDWARE_DIAGNOSTIC_TELEMETRY</text>
        <text x="0" y="42" fill="${COLORS.TEXT_SECONDARY}" font-size="10">BUS INTEGRITY: PASS | BUS WIDTH: 512-BIT | ECC MEMORY: ACTIVE</text>
        <g transform="translate(0, 60)">
          <rect x="0" y="0" width="180" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/><text x="12" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="600">L1 CACHE: 128 KB</text>
          <rect x="200" y="0" width="180" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/><text x="212" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="600">L2 CACHE: 4096 KB</text>
          <rect x="400" y="0" width="180" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/><text x="412" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="600">FP16 ACCEL: ACTIVE</text>
          <rect x="600" y="0" width="180" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/><text x="612" y="24" fill="${COLORS.GREEN}" font-size="11" font-weight="600">DEV PROTOCOL: OK</text>
        </g>
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 130, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/boot/system-ready.svg'] = svgWrap({
    width: 1200, height: 90,
    content: `
      <g transform="translate(600, 45)" text-anchor="middle">
        <rect x="-240" y="-30" width="480" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" rx="4"/>
        <circle cx="-200" cy="0" r="5" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="0" y="5" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="700" letter-spacing="3">CODEX://SYSTEM_READY <tspan fill="${COLORS.GREEN}">[STATE: ACTIVE]</tspan></text>
      </g>
    `
  });

  // REVEAL
  assets['assets/reveal/encrypted-identity.svg'] = svgWrap({
    width: 1200, height: 200,
    content: `
      <rect x="0" y="0" width="1200" height="200" fill="${COLORS.BG_MID}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">NEURAL_DECRYPTION_PROTOCOL // IDENTITY_HASH_SOLVER</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="160" height="34" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="10" y="16" fill="${COLORS.TEXT_SECONDARY}" font-size="8">IDENTITY_HASH</text><text x="10" y="28" fill="${COLORS.CYAN}" font-size="9" font-weight="700">0x7F_CODEX_A01</text>
        <rect x="180" y="0" width="160" height="34" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="10" y="16" fill="${COLORS.TEXT_SECONDARY}" font-size="8">CLEARANCE_LEVEL</text><text x="10" y="28" fill="${COLORS.GREEN}" font-size="9" font-weight="700">LVL_9: ROOT_DEV</text>
        <rect x="360" y="0" width="160" height="34" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="10" y="16" fill="${COLORS.TEXT_SECONDARY}" font-size="8">NODE_SCAN</text><text x="10" y="28" fill="${COLORS.CYAN}" font-size="9" font-weight="700">TARGET: ACQUIRED</text>
        <rect x="540" y="0" width="160" height="34" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <text x="10" y="16" fill="${COLORS.TEXT_SECONDARY}" font-size="8">MATCH_SCORE</text><text x="10" y="28" fill="${COLORS.GREEN}" font-size="9" font-weight="700">99.98% VERIFIED</text>
      </g>
      <g transform="translate(600, 150)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.TEXT_PRIMARY}" font-size="28" font-weight="900" letter-spacing="10" filter="url(#glow-cyan)">
          ANJAN SHETTY // IDENTITY REVEALED
        </text>
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 180, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/reveal/name-revelation.svg'] = svgWrap({
    width: 1200, height: 400,
    styles: `
      @keyframes drawFrame { 0% { stroke-dashoffset: 2500; } 100% { stroke-dashoffset: 0; } }
      @keyframes scanHorizontal { 0% { transform: translateX(-1200px); } 100% { transform: translateX(1200px); } }
    `,
    content: `
      <polygon points="40,20 1160,20 1180,40 1180,360 1160,380 40,380 20,360 20,40"
               fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.8" stroke-dasharray="2500"
               style="animation: drawFrame 3s ease-out forwards;" />
      <line x1="0" y1="200" x2="1200" y2="200" stroke="${COLORS.CYAN}" stroke-width="1.2" opacity="0.3"
            style="animation: scanHorizontal 6s ease-in-out infinite;" />
      <text x="60" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10" font-weight="700" letter-spacing="2">MODULE://SIGNATURE_IDENTITY_LOCK</text>
      <text x="600" y="55" fill="${COLORS.CYAN}" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="3">CODEX://ANJAN // REVELATION MATRIX</text>
      <text x="1140" y="55" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end" letter-spacing="2">IDENTITY://VERIFIED ●</text>
      <line x1="60" y1="65" x2="1140" y2="65" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />

      <g transform="translate(600, 185)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="64" font-weight="900" letter-spacing="14" filter="url(#glow-cyan)" opacity="0.8">ANJAN SHETTY</text>
        <text x="0" y="0" fill="#FFFFFF" font-size="64" font-weight="900" letter-spacing="14">ANJAN SHETTY</text>
      </g>

      <g transform="translate(600, 245)" text-anchor="middle">
        <rect x="-320" y="-22" width="640" height="34" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" rx="2" />
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="14" font-weight="800" letter-spacing="4">
          FULL-STACK DEVELOPER <tspan fill="${COLORS.MAGENTA}">//</tspan> AI-ML ENGINEER
        </text>
      </g>

      <g transform="translate(600, 295)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.TEXT_SECONDARY}" font-size="13" font-weight="600" letter-spacing="3">
          GITHUB NODE: <tspan fill="${COLORS.GREEN}" font-weight="800">@CODEXANJAN</tspan>
        </text>
      </g>

      <g transform="translate(600, 345)" text-anchor="middle">
        <rect x="-180" y="-18" width="360" height="28" fill="${COLORS.BG_MID}" stroke="${COLORS.GREEN}" stroke-width="1.2" rx="3" />
        <circle cx="-150" cy="-4" r="4" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="0" y="0" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700" letter-spacing="3">SECURE IDENTITY LOCK: COMPLETE</text>
      </g>
      ${cyberCornerBrackets(45, 25, 1110, 350, 16, COLORS.CYAN, 1.5)}
    `
  });

  assets['assets/reveal/github-revelation.svg'] = svgWrap({
    width: 1200, height: 220,
    content: `
      <rect x="0" y="0" width="1200" height="220" fill="${COLORS.BG_DARK}" />
      <text x="40" y="35" fill="${COLORS.CYAN}" font-size="12" font-weight="700" letter-spacing="2">GITHUB_NETWORK_DISCOVERY // NODE_QUERY</text>
      <line x1="40" y1="45" x2="1160" y2="45" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(140, 130)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/>
        <circle cx="0" cy="0" r="40" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="0.8"/>
        <line x1="-60" y1="0" x2="60" y2="0" stroke="${COLORS.GRID_LINE}" stroke-width="1"/>
        <line x1="0" y1="-60" x2="0" y2="60" stroke="${COLORS.GRID_LINE}" stroke-width="1"/>
        <circle cx="28" cy="-22" r="3" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite"/></circle>
        <text x="35" y="-18" fill="${COLORS.GREEN}" font-size="8" font-weight="700">NODE</text>
      </g>
      <g transform="translate(260, 75)">
        <rect x="0" y="0" width="880" height="115" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
        <g transform="translate(25, 28)">
          <text x="0" y="0" fill="${COLORS.TEXT_SECONDARY}" font-size="10">QUERY TARGET:</text><text x="140" y="0" fill="${COLORS.CYAN}" font-size="12" font-weight="700">github://codexanjan</text>
          <text x="0" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="10">NODE IDENTITY:</text><text x="140" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="700">ANJAN SHETTY</text>
          <text x="0" y="48" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SYSTEM CLASS:</text><text x="140" y="48" fill="${COLORS.GREEN}" font-size="12" font-weight="700">DEVELOPER // FULL-STACK &amp; AI-ML</text>
          <text x="0" y="72" fill="${COLORS.TEXT_SECONDARY}" font-size="10">NETWORK STATUS:</text><text x="140" y="72" fill="${COLORS.GREEN}" font-size="12" font-weight="700">CONNECTED ● [PROFILE REVELATION COMPLETE]</text>
        </g>
        ${cyberCornerBrackets(4, 4, 872, 107, 10, COLORS.CYAN, 1)}
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 200, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/reveal/developer-classification.svg'] = svgWrap({
    width: 1200, height: 190,
    content: `
      <rect x="0" y="0" width="1200" height="190" fill="${COLORS.BG_MID}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">SYS.CLASSIFICATION // OPERATOR_CREDENTIALS</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 60)">
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="260" height="95" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
          <text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">SUBJECT</text><text x="16" y="48" fill="${COLORS.TEXT_PRIMARY}" font-size="15" font-weight="800">ANJAN SHETTY</text><text x="16" y="72" fill="${COLORS.CYAN}" font-size="11">CALLSIGN: @codexanjan</text>
          ${cyberCornerBrackets(3, 3, 254, 89, 8, COLORS.CYAN, 1)}
        </g>
        <g transform="translate(285, 0)">
          <rect x="0" y="0" width="260" height="95" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
          <text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">PRIMARY CLASS</text><text x="16" y="48" fill="${COLORS.CYAN}" font-size="14" font-weight="800">FULL-STACK DEV</text><text x="16" y="72" fill="${COLORS.TEXT_SECONDARY}" font-size="10">REACT // NODE // TS // PYTHON</text>
          ${cyberCornerBrackets(3, 3, 254, 89, 8, COLORS.CYAN, 1)}
        </g>
        <g transform="translate(570, 0)">
          <rect x="0" y="0" width="260" height="95" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
          <text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">SECONDARY SYSTEM</text><text x="16" y="48" fill="${COLORS.MAGENTA}" font-size="14" font-weight="800">AI / ML ENGINEER</text><text x="16" y="72" fill="${COLORS.TEXT_SECONDARY}" font-size="10">DEEP LEARNING // MODELS // APIS</text>
          ${cyberCornerBrackets(3, 3, 254, 89, 8, COLORS.CYAN, 1)}
        </g>
        <g transform="translate(855, 0)">
          <rect x="0" y="0" width="265" height="95" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1" />
          <text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">EXECUTION MODE</text><text x="16" y="48" fill="${COLORS.GREEN}" font-size="13" font-weight="800">BUILD // EXP // SHIP</text><text x="16" y="72" fill="${COLORS.TEXT_PRIMARY}" font-size="10">STATUS: <tspan fill="${COLORS.GREEN}">ACTIVE ● ONLINE</tspan></text>
          ${cyberCornerBrackets(3, 3, 259, 89, 8, COLORS.GREEN, 1)}
        </g>
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 170, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/reveal/interface-unlock.svg'] = svgWrap({
    width: 1200, height: 130,
    content: `
      <rect x="0" y="0" width="1200" height="130" fill="${COLORS.BG_DARK}" />
      <g transform="translate(600, 50)" text-anchor="middle">
        <rect x="-300" y="-30" width="600" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.2" rx="4" />
        <text x="0" y="5" fill="${COLORS.GREEN}" font-size="14" font-weight="800" letter-spacing="4">ACCESS GRANTED // DEVELOPER INTERFACE UNLOCKED</text>
        <text x="0" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="2">ALL PROTOCOLS VERIFIED ● ENTERING CODEX OPERATING SYSTEM</text>
      </g>
      <line x1="30" y1="95" x2="550" y2="95" stroke="${COLORS.CYAN}" stroke-width="2" />
      <line x1="650" y1="95" x2="1170" y2="95" stroke="${COLORS.CYAN}" stroke-width="2" />
      <circle cx="600" cy="95" r="4" fill="${COLORS.CYAN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/></circle>
    `
  });

  // HERO
  assets['assets/hero/cyber-hero.svg'] = svgWrap({
    width: 1200, height: 420,
    styles: `@keyframes waveMove { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 200; } }`,
    content: `
      <rect width="1200" height="420" fill="${COLORS.BG_DARK}" />
      <g transform="translate(40, 35)">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="14" font-weight="900" letter-spacing="3">CODEX://ANJAN</text>
        <text x="180" y="0" fill="${COLORS.TEXT_SECONDARY}" font-size="10" letter-spacing="1.5">// SYSTEM_OS_V26.4</text>
        <circle cx="1060" cy="-4" r="4" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/></circle>
        <text x="1075" y="0" fill="${COLORS.GREEN}" font-size="11" font-weight="700" letter-spacing="2">SYSTEM ● ONLINE</text>
      </g>
      <line x1="40" y1="48" x2="1160" y2="48" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(600, 190)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="68" font-weight="900" letter-spacing="16" filter="url(#glow-cyan)" opacity="0.65">ANJAN SHETTY</text>
        <text x="0" y="0" fill="#FFFFFF" font-size="68" font-weight="900" letter-spacing="16">ANJAN SHETTY</text>
        <text x="0" y="48" fill="${COLORS.CYAN}" font-size="15" font-weight="800" letter-spacing="6">FULL-STACK DEVELOPER <tspan fill="${COLORS.MAGENTA}">//</tspan> AI-ML ENGINEER</text>
        <g transform="translate(0, 85)">
          <rect x="-140" y="-18" width="280" height="30" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1" rx="3"/>
          <text x="0" y="2" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="700" letter-spacing="2">CALLSIGN: <tspan fill="${COLORS.GREEN}">@CODEXANJAN</tspan></text>
        </g>
      </g>
      <path d="M 100 320 L 350 320 L 390 300 L 440 340 L 490 310 L 530 330 L 600 320 L 670 320 L 710 340 L 760 300 L 810 330 L 850 320 L 1100 320"
            fill="none" stroke="${COLORS.CYAN}" stroke-width="1.5" stroke-dasharray="10 5" style="animation: waveMove 8s linear infinite;" />
      <g transform="translate(40, 375)">
        <g transform="translate(0, 0)"><rect x="0" y="0" width="260" height="26" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" /><circle cx="16" cy="13" r="3" fill="${COLORS.GREEN}" /><text x="30" y="17" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="600">GITHUB NETWORK: CONNECTED</text></g>
        <g transform="translate(285, 0)"><rect x="0" y="0" width="260" height="26" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" /><circle cx="16" cy="13" r="3" fill="${COLORS.CYAN}" /><text x="30" y="17" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="600">DEV CORE: ACTIVE</text></g>
        <g transform="translate(570, 0)"><rect x="0" y="0" width="260" height="26" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" /><circle cx="16" cy="13" r="3" fill="${COLORS.MAGENTA}" /><text x="30" y="17" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="600">AI NODE: READY</text></g>
        <g transform="translate(855, 0)"><rect x="0" y="0" width="265" height="26" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" /><circle cx="16" cy="13" r="3" fill="${COLORS.GREEN}" /><text x="30" y="17" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="600">BUILD PIPELINE: STABLE</text></g>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 396, 18, COLORS.CYAN, 1.5)}
    `
  });

  assets['assets/hero/identity-banner.svg'] = svgWrap({
    width: 1200, height: 150,
    content: `
      <rect width="1200" height="150" fill="${COLORS.BG_MID}" />
      <g transform="translate(60, 45)">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">DEVELOPER IDENTIFICATION PROTOCOL</text>
        <text x="0" y="36" fill="${COLORS.TEXT_PRIMARY}" font-size="28" font-weight="900" letter-spacing="6">CODEX://ANJAN <tspan fill="${COLORS.TEXT_SECONDARY}" font-size="16" font-weight="500">[FULL-STACK &amp; AI-ML]</tspan></text>
        <text x="0" y="62" fill="${COLORS.TEXT_SECONDARY}" font-size="11" letter-spacing="2">ARCHITECTING INTELLIGENT SYSTEMS &amp; MODERN WEB APPLICATIONS</text>
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 130, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/hero/developer-pass.svg'] = svgWrap({
    width: 600, height: 340,
    content: `
      <rect width="600" height="340" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.5" />
      <rect x="0" y="0" width="600" height="36" fill="${COLORS.BG_DARKEST}" />
      <text x="25" y="24" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">CODEX PASSPORT // ACCESS PASS</text>
      <text x="575" y="24" fill="${COLORS.GREEN}" font-size="10" text-anchor="end" font-weight="700">LEVEL 9 ● ROOT</text>
      <g transform="translate(30, 70)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">OPERATOR NAME:</text><text x="140" y="20" fill="${COLORS.TEXT_PRIMARY}" font-size="15" font-weight="800">ANJAN SHETTY</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">GITHUB HANDLE:</text><text x="140" y="55" fill="${COLORS.CYAN}" font-size="14" font-weight="700">@codexanjan</text>
        <text x="0" y="90" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SPECIALIZATION:</text><text x="140" y="90" fill="${COLORS.GREEN}" font-size="12" font-weight="700">FULL-STACK &amp; AI-ML</text>
        <text x="0" y="125" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SECURITY HASH:</text><text x="140" y="125" fill="${COLORS.TEXT_SECONDARY}" font-size="10">0x7F_99A_CODEX_VERIFIED</text>
        <text x="0" y="160" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SYSTEM STATUS:</text><text x="140" y="160" fill="${COLORS.GREEN}" font-size="12" font-weight="700">ACTIVE // ONLINE</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 324, 12, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/hero/codex-signature.svg'] = svgWrap({
    width: 500, height: 120,
    content: `
      <rect width="500" height="120" fill="${COLORS.BG_DARK}" />
      <g transform="translate(250, 45)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="18" font-weight="900" letter-spacing="4">CODEX://ANJAN</text>
        <text x="0" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="700" letter-spacing="2">ANJAN SHETTY</text>
        <text x="0" y="44" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1.5">BUILDING INTELLIGENT DIGITAL SYSTEMS</text>
      </g>
      <line x1="80" y1="100" x2="420" y2="100" stroke="${COLORS.CYAN}" stroke-width="1.2" />
      ${cyberCornerBrackets(6, 6, 488, 108, 8, COLORS.CYAN, 1)}
    `
  });

  // HEADERS (12)
  const headerDefs = [
    { num: '01', title: 'IDENTITY', tag: 'SYS.MOD.01', status: 'VERIFIED', color: COLORS.CYAN },
    { num: '02', title: 'SYSTEM_PROFILE', tag: 'SYS.MOD.02', status: 'ONLINE', color: COLORS.BLUE },
    { num: '03', title: 'TECH_ARSENAL', tag: 'SYS.MOD.03', status: 'ARMED', color: COLORS.CYAN },
    { num: '04', title: 'PROJECT_MATRIX', tag: 'SYS.MOD.04', status: 'DEPLOYED', color: COLORS.MAGENTA },
    { num: '05', title: 'GITHUB_INTELLIGENCE', tag: 'SYS.MOD.05', status: 'STREAMING', color: COLORS.GREEN },
    { num: '06', title: 'REPOSITORY_NETWORK', tag: 'SYS.MOD.06', status: 'MAPPED', color: COLORS.CYAN },
    { num: '07', title: 'LANGUAGE_MATRIX', tag: 'SYS.MOD.07', status: 'SYNTHESIZED', color: COLORS.BLUE },
    { num: '08', title: 'CONTRIBUTION_INTELLIGENCE', tag: 'SYS.MOD.08', status: 'ACTIVE_TELEMETRY', color: COLORS.GREEN },
    { num: '09', title: 'CERTIFICATIONS', tag: 'SYS.MOD.09', status: 'VERIFIED_CREDENTIALS', color: COLORS.CYAN },
    { num: '10', title: 'ACHIEVEMENTS', tag: 'SYS.MOD.10', status: 'MISSION_LOGS', color: COLORS.AMBER },
    { num: '11', title: 'ACTIVE_MISSIONS', tag: 'SYS.MOD.11', status: 'IN_PROGRESS', color: COLORS.MAGENTA },
    { num: '12', title: 'CONNECTION_PORT', tag: 'SYS.MOD.12', status: 'CHANNEL_OPEN', color: COLORS.GREEN }
  ];

  headerDefs.forEach(item => {
    const filename = `assets/headers/${item.num}-${item.title.toLowerCase().replace(/_/g, '-')}.svg`;
    assets[filename] = svgWrap({
      width: 1200, height: 110,
      content: `
        <text x="35" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="2">${item.tag} // CODEX://ANJAN // CORE_PIPELINE</text>
        <g transform="translate(30, 32)">
          <polygon points="10,0 1140,0 1140,48 1130,58 0,58 0,10" fill="${COLORS.BG_CARD}" stroke="${item.color}" stroke-width="1.2" />
          <rect x="0" y="0" width="60" height="58" fill="${COLORS.BG_DARKEST}" />
          <text x="30" y="38" fill="${item.color}" font-size="20" font-weight="900" text-anchor="middle">${item.num}</text>
          <line x1="60" y1="0" x2="60" y2="58" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
          <text x="80" y="38" fill="${COLORS.TEXT_PRIMARY}" font-size="20" font-weight="900" letter-spacing="4">// ${item.title}</text>
          <g transform="translate(1120, 34)" text-anchor="end">
            <text x="-20" y="0" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">MODULE STATUS:</text>
            <text x="0" y="0" fill="${item.color}" font-size="11" font-weight="800" letter-spacing="1.5">${item.status}</text>
            <circle cx="10" cy="-4" r="3.5" fill="${item.color}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/></circle>
          </g>
        </g>
        <line x1="30" y1="96" x2="1170" y2="96" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        ${cyberCornerBrackets(15, 12, 1170, 88, 8, item.color, 1)}
      `
    });
  });

  // CORE
  assets['assets/core/cyber-core.svg'] = svgWrap({
    width: 600, height: 500,
    styles: `@keyframes spinSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
    content: `
      <rect width="600" height="500" fill="${COLORS.BG_DARK}" />
      <text x="30" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">REACTOR_CORE // CODEX://AS01</text>
      <text x="570" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end" letter-spacing="1">STATE: CRITICAL_EFFICIENCY</text>
      <line x1="30" y1="42" x2="570" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(300, 260)">
        <circle cx="0" cy="0" r="180" fill="none" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <g style="animation: spinSlow 30s linear infinite;">
          <circle cx="0" cy="0" r="180" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.5" stroke-dasharray="40 80" />
          <circle cx="180" cy="0" r="4" fill="${COLORS.CYAN}" /><circle cx="-180" cy="0" r="4" fill="${COLORS.CYAN}" />
        </g>
        <circle cx="0" cy="0" r="140" fill="none" stroke="${COLORS.BLUE}" stroke-width="1.8" stroke-dasharray="20 40" />
        <circle cx="0" cy="0" r="95" fill="none" stroke="${COLORS.CYAN}" stroke-width="2.2" stroke-dasharray="60 30" />
        <circle cx="0" cy="0" r="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="2" />
        <text x="0" y="10" fill="#FFFFFF" font-size="30" font-weight="900" text-anchor="middle" letter-spacing="4" filter="url(#glow-cyan)">AS</text>
        <text x="0" y="-115" fill="${COLORS.CYAN}" font-size="10" font-weight="700" text-anchor="middle">DEV</text>
        <text x="115" y="-40" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="700" text-anchor="middle">AI</text>
        <text x="115" y="60" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="middle">ML</text>
        <text x="0" y="125" fill="${COLORS.CYAN}" font-size="10" font-weight="700" text-anchor="middle">SYSTEMS</text>
        <text x="-115" y="60" fill="${COLORS.MAGENTA}" font-size="10" font-weight="700" text-anchor="middle">CODEX</text>
        <text x="-115" y="-40" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="700" text-anchor="middle">ANJAN</text>
      </g>
      <text x="30" y="475" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CORE TEMP: <tspan fill="${COLORS.CYAN}">34.8°C</tspan> | NEURAL LINK: <tspan fill="${COLORS.GREEN}">ACTIVE</tspan> | DEV ENGINE: <tspan fill="${COLORS.CYAN}">ONLINE</tspan></text>
      ${cyberCornerBrackets(10, 10, 580, 480, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/core/ai-reactor.svg'] = svgWrap({
    width: 600, height: 500,
    content: `
      <rect width="600" height="500" fill="${COLORS.BG_DARK}" />
      <text x="30" y="32" fill="${COLORS.MAGENTA}" font-size="11" font-weight="700" letter-spacing="2">AI_REACTOR // COMPUTATIONAL_INFERENCE</text>
      <text x="570" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">STATUS: CONVERGED</text>
      <line x1="30" y1="42" x2="570" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(300, 260)">
        <circle cx="0" cy="0" r="175" fill="none" stroke="${COLORS.MAGENTA}" stroke-width="1.5" stroke-dasharray="80 30" opacity="0.7"/>
        <circle cx="0" cy="0" r="135" fill="none" stroke="${COLORS.CYAN}" stroke-width="1.8" stroke-dasharray="50 50" opacity="0.8"/>
        <circle cx="0" cy="0" r="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" stroke-width="2.5" />
        <text x="0" y="10" fill="#FFFFFF" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="3" filter="url(#glow-magenta)">AI</text>
        <g transform="translate(0, -145)"><rect x="-40" y="-12" width="80" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="700" text-anchor="middle">DATA</text></g>
        <g transform="translate(130, -75)"><rect x="-40" y="-12" width="80" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.CYAN}" font-size="9" font-weight="700" text-anchor="middle">MODEL</text></g>
        <g transform="translate(130, 75)"><rect x="-45" y="-12" width="90" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.MAGENTA}" font-size="9" font-weight="700" text-anchor="middle">INFERENCE</text></g>
        <g transform="translate(0, 145)"><rect x="-40" y="-12" width="80" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="middle">VISION</text></g>
        <g transform="translate(-130, 75)"><rect x="-40" y="-12" width="80" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="700" text-anchor="middle">NLP</text></g>
        <g transform="translate(-130, -75)"><rect x="-55" y="-12" width="110" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="0" y="4" fill="${COLORS.AMBER}" font-size="9" font-weight="700" text-anchor="middle">AUTOMATION</text></g>
      </g>
      <text x="30" y="475" fill="${COLORS.TEXT_SECONDARY}" font-size="9">INFERENCE: <tspan fill="${COLORS.CYAN}">SUB-MILLISECOND</tspan> | TENSORS: <tspan fill="${COLORS.GREEN}">OPTIMAL</tspan></text>
      ${cyberCornerBrackets(10, 10, 580, 480, 12, COLORS.MAGENTA, 1)}
    `
  });

  assets['assets/core/neural-core.svg'] = svgWrap({
    width: 600, height: 300,
    content: `
      <rect width="600" height="300" fill="${COLORS.BG_DARK}" />
      <text x="25" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700" letter-spacing="2">NEURAL_SYNAPSE_GRID // TOPOLOGY</text>
      <g transform="translate(50, 60)">
        <circle cx="50" cy="50" r="8" fill="${COLORS.CYAN}" /><circle cx="50" cy="150" r="8" fill="${COLORS.CYAN}" />
        <circle cx="250" cy="30" r="8" fill="${COLORS.BLUE}" /><circle cx="250" cy="100" r="8" fill="${COLORS.BLUE}" /><circle cx="250" cy="170" r="8" fill="${COLORS.BLUE}" />
        <circle cx="450" cy="70" r="8" fill="${COLORS.GREEN}" /><circle cx="450" cy="130" r="8" fill="${COLORS.GREEN}" />
        <line x1="50" y1="50" x2="250" y2="30" stroke="${COLORS.CYAN}" stroke-width="1" opacity="0.6"/>
        <line x1="50" y1="150" x2="250" y2="100" stroke="${COLORS.CYAN}" stroke-width="1" opacity="0.6"/>
        <line x1="250" y1="100" x2="450" y2="70" stroke="${COLORS.GREEN}" stroke-width="1" opacity="0.6"/>
      </g>
      <text x="25" y="275" fill="${COLORS.TEXT_SECONDARY}" font-size="9">TOPOLOGY: FEED-FORWARD MULTI-LAYER NEURAL NET</text>
      ${cyberCornerBrackets(10, 10, 580, 280, 10, COLORS.GREEN, 1)}
    `
  });

  assets['assets/core/identity-reactor.svg'] = svgWrap({
    width: 600, height: 260,
    content: `
      <rect width="600" height="260" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">IDENTITY_STABILIZATION_REACTOR</text>
      <g transform="translate(300, 130)" text-anchor="middle">
        <circle cx="0" cy="0" r="50" fill="none" stroke="${COLORS.CYAN}" stroke-width="2" stroke-dasharray="6 3"/>
        <circle cx="0" cy="0" r="30" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BLUE}" stroke-width="1"/>
        <text x="0" y="6" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="800">CODEX</text>
      </g>
      <text x="25" y="235" fill="${COLORS.TEXT_SECONDARY}" font-size="9">STABILITY: 100% // NO DISRUPTION DETECTED</text>
      ${cyberCornerBrackets(8, 8, 584, 244, 10, COLORS.CYAN, 1)}
    `
  });

  // PROFILE
  assets['assets/profile/digital-id.svg'] = svgWrap({
    width: 600, height: 360,
    styles: `@keyframes scanBeamVertical { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(300px); opacity: 0; } }`,
    content: `
      <rect width="600" height="360" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.5" />
      <rect x="0" y="0" width="600" height="40" fill="${COLORS.BG_DARKEST}" />
      <text x="25" y="25" fill="${COLORS.CYAN}" font-size="12" font-weight="800" letter-spacing="2">CODEX NETWORK // DIGITAL_ID</text>
      <text x="575" y="25" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">AUTH_OK</text>
      <line x1="20" y1="45" x2="580" y2="45" stroke="${COLORS.CYAN}" stroke-width="2" style="animation: scanBeamVertical 4s ease-in-out infinite;" />
      <g transform="translate(40, 75)">
        <polygon points="10,0 80,0 90,10 90,90 80,100 10,100 0,90 0,10" fill="${COLORS.BG_MID}" stroke="${COLORS.CYAN}" stroke-width="1.5" />
        <text x="45" y="58" fill="${COLORS.CYAN}" font-size="28" font-weight="900" text-anchor="middle" filter="url(#glow-cyan)">AS</text>
      </g>
      <g transform="translate(160, 80)">
        <text x="0" y="16" fill="${COLORS.TEXT_SECONDARY}" font-size="9">IDENTITY:</text><text x="120" y="16" fill="${COLORS.TEXT_PRIMARY}" font-size="16" font-weight="900">ANJAN SHETTY</text>
        <text x="0" y="46" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CALLSIGN:</text><text x="120" y="46" fill="${COLORS.CYAN}" font-size="13" font-weight="700">@codexanjan</text>
        <text x="0" y="74" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CLASS:</text><text x="120" y="74" fill="${COLORS.GREEN}" font-size="12" font-weight="700">FULL-STACK DEVELOPER</text>
        <text x="0" y="102" fill="${COLORS.TEXT_SECONDARY}" font-size="9">MODULE:</text><text x="120" y="102" fill="${COLORS.MAGENTA}" font-size="12" font-weight="700">AI / ML SYSTEMS</text>
        <text x="0" y="130" fill="${COLORS.TEXT_SECONDARY}" font-size="9">STATUS:</text><text x="120" y="130" fill="${COLORS.GREEN}" font-size="12" font-weight="700">ONLINE ● OPERATIONAL</text>
        <text x="0" y="158" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CLEARANCE:</text><text x="120" y="158" fill="${COLORS.CYAN}" font-size="11" font-weight="700">DEVELOPER ACCESS [LVL_09]</text>
      </g>
      <g transform="translate(25, 305)">
        <rect x="0" y="0" width="550" height="34" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" rx="2" />
        <circle cx="20" cy="17" r="4" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="35" y="21" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="700" letter-spacing="2">VERIFIED DEVELOPER NODE // CERTIFIED</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 344, 14, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/profile/system-profile.svg'] = svgWrap({
    width: 600, height: 360,
    content: `
      <rect width="600" height="360" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.5" />
      <rect x="0" y="0" width="600" height="40" fill="${COLORS.BG_DARKEST}" />
      <text x="25" y="25" fill="${COLORS.CYAN}" font-size="12" font-weight="800" letter-spacing="2">SYSTEM_PROFILE // TELEMETRY_MATRIX</text>
      <g transform="translate(40, 75)">
        <text x="0" y="15" fill="${COLORS.TEXT_SECONDARY}" font-size="10">IDENTITY</text><text x="180" y="15" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="800">ANJAN SHETTY</text><line x1="0" y1="28" x2="520" y2="28" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">GITHUB HANDLE</text><text x="180" y="55" fill="${COLORS.CYAN}" font-size="13" font-weight="700">@codexanjan</text><line x1="0" y1="68" x2="520" y2="68" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <text x="0" y="95" fill="${COLORS.TEXT_SECONDARY}" font-size="10">PRIMARY CLASS</text><text x="180" y="95" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="700">FULL-STACK ARCHITECTURE</text><line x1="0" y1="108" x2="520" y2="108" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <text x="0" y="135" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SECONDARY CLASS</text><text x="180" y="135" fill="${COLORS.MAGENTA}" font-size="13" font-weight="700">AI / ML ENGINEERING</text><line x1="0" y1="148" x2="520" y2="148" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <text x="0" y="175" fill="${COLORS.TEXT_SECONDARY}" font-size="10">ENGINEERING MODE</text><text x="180" y="175" fill="${COLORS.GREEN}" font-size="12" font-weight="700">BUILD &gt; TEST &gt; SHIP &gt; EVOLVE</text><line x1="0" y1="188" x2="520" y2="188" stroke="${COLORS.GRID_LINE}" stroke-width="1" />
        <text x="0" y="215" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SYSTEM STATUS</text><text x="180" y="215" fill="${COLORS.GREEN}" font-size="13" font-weight="700">ACTIVE ● READY FOR COMPLEXITY</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 344, 14, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/profile/identity-card.svg'] = svgWrap({
    width: 600, height: 220,
    content: `
      <rect width="600" height="220" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="30" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2">HOLOGRAPHIC_IDENTITY_CHIP</text>
      <g transform="translate(40, 70)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">NODE:</text><text x="80" y="20" fill="${COLORS.TEXT_PRIMARY}" font-size="15" font-weight="800">CODEX://ANJAN</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">DOMAIN:</text><text x="80" y="55" fill="${COLORS.GREEN}" font-size="13" font-weight="700">FULL-STACK &amp; MACHINE LEARNING</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 208, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/profile/clearance-card.svg'] = svgWrap({
    width: 600, height: 180,
    content: `
      <rect width="600" height="180" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1" />
      <g transform="translate(30, 35)">
        <text x="0" y="0" fill="${COLORS.GREEN}" font-size="13" font-weight="800" letter-spacing="3">SECURITY CLEARANCE // LEVEL 9</text>
        <text x="0" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="12">OPERATOR: ANJAN SHETTY // @CODEXANJAN</text>
        <text x="0" y="50" fill="${COLORS.TEXT_SECONDARY}" font-size="10">PERMISSIONS: REPOSITORY READ/WRITE, PIPELINE ORCHESTRATION, DEPLOY ACCESS</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 168, 8, COLORS.GREEN, 1)}
    `
  });

  // TECH ARSENAL
  assets['assets/tech/tech-constellation.svg'] = svgWrap({
    width: 1200, height: 520,
    content: `
      <rect width="1200" height="520" fill="${COLORS.BG_DARK}" />
      <text x="40" y="35" fill="${COLORS.CYAN}" font-size="12" font-weight="800" letter-spacing="2">NEURAL_CONSTELLATION // ACTIVE_TECH_ARSENAL</text>
      <text x="1160" y="35" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end" letter-spacing="1">TOPOLOGY: MESH_SYNAPSE</text>
      <line x1="40" y1="46" x2="1160" y2="46" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />

      <g transform="translate(600, 260)">
        <line x1="0" y1="0" x2="-350" y2="-120" stroke="${COLORS.CYAN}" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6"/>
        <line x1="0" y1="0" x2="350" y2="-120" stroke="${COLORS.CYAN}" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6"/>
        <line x1="0" y1="0" x2="-350" y2="120" stroke="${COLORS.BLUE}" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6"/>
        <line x1="0" y1="0" x2="350" y2="120" stroke="${COLORS.MAGENTA}" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6"/>
        <polygon points="0,-45 40,-22 40,22 0,45 -40,22 -40,-22" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="2" />
        <text x="0" y="-5" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="900" text-anchor="middle">ANJAN</text>
        <text x="0" y="14" fill="${COLORS.CYAN}" font-size="10" font-weight="700" text-anchor="middle">DEV CORE</text>
      </g>

      <g transform="translate(250, 140)"><polygon points="0,-20 120,-20 130,-10 130,50 120,60 0,60" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.2" /><text x="14" y="0" fill="${COLORS.CYAN}" font-size="10" font-weight="800">FRONTEND</text><text x="14" y="22" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">TypeScript • React</text><text x="14" y="42" fill="${COLORS.TEXT_SECONDARY}" font-size="10">Next.js • TailwindCSS</text></g>
      <g transform="translate(950, 140)"><polygon points="-130,-20 -10,-20 0,-10 0,50 -10,60 -130,60" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" stroke-width="1.2" /><text x="-116" y="0" fill="${COLORS.BLUE}" font-size="10" font-weight="800">BACKEND</text><text x="-116" y="22" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">Node.js • Express</text><text x="-116" y="42" fill="${COLORS.TEXT_SECONDARY}" font-size="10">FastAPI • Python</text></g>
      <g transform="translate(950, 380)"><polygon points="-140,-20 -10,-20 0,-10 0,50 -10,60 -140,60" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" stroke-width="1.2" /><text x="-126" y="0" fill="${COLORS.MAGENTA}" font-size="10" font-weight="800">AI // ML CORE</text><text x="-126" y="22" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">PyTorch • Scikit-Learn</text><text x="-126" y="42" fill="${COLORS.TEXT_SECONDARY}" font-size="10">LLMs • HuggingFace</text></g>
      <g transform="translate(250, 380)"><polygon points="0,-20 130,-20 140,-10 140,50 130,60 0,60" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" /><text x="14" y="0" fill="${COLORS.GREEN}" font-size="10" font-weight="800">DATA MATRIX</text><text x="14" y="22" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">PostgreSQL • MongoDB</text><text x="14" y="42" fill="${COLORS.TEXT_SECONDARY}" font-size="10">Supabase • Redis</text></g>
      <g transform="translate(600, 90)"><rect x="-90" y="-18" width="180" height="36" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" rx="2" /><text x="0" y="4" fill="${COLORS.GREEN}" font-size="10" font-weight="800" text-anchor="middle">DOCKER • GIT • VERCEL</text></g>
      <g transform="translate(600, 430)"><rect x="-90" y="-18" width="180" height="36" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.2" rx="2" /><text x="0" y="4" fill="${COLORS.CYAN}" font-size="10" font-weight="800" text-anchor="middle">REST • GRAPHQL • CI/CD</text></g>
      ${cyberCornerBrackets(12, 12, 1176, 496, 16, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/tech/neural-tech-orbit.svg'] = svgWrap({
    width: 600, height: 520,
    content: `
      <rect width="600" height="520" fill="${COLORS.BG_DARK}" />
      <text x="30" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">NEURAL_TECH_ORBIT // SPHERES</text>
      <line x1="30" y1="42" x2="570" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(300, 270)">
        <circle cx="0" cy="0" r="190" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="6 6"/>
        <circle cx="0" cy="0" r="145" fill="none" stroke="${COLORS.BORDER_ACCENT}" stroke-width="1" stroke-dasharray="4 8"/>
        <circle cx="0" cy="0" r="105" fill="none" stroke="${COLORS.MAGENTA}" stroke-width="1" stroke-dasharray="5 5" opacity="0.6"/>
        <circle cx="0" cy="0" r="65" fill="none" stroke="${COLORS.GREEN}" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="0" y="-195" fill="${COLORS.CYAN}" font-size="9" font-weight="700" text-anchor="middle">ORBIT 1 // FRONTEND</text>
        <text x="0" y="-150" fill="${COLORS.BLUE}" font-size="9" font-weight="700" text-anchor="middle">ORBIT 2 // BACKEND</text>
        <text x="0" y="-110" fill="${COLORS.MAGENTA}" font-size="9" font-weight="700" text-anchor="middle">ORBIT 3 // AI-ML</text>
        <text x="0" y="-70" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="middle">ORBIT 4 // DATA</text>
        <circle cx="0" cy="0" r="32" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.8" />
        <text x="0" y="-2" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="800" text-anchor="middle">ANJAN</text>
        <text x="0" y="11" fill="${COLORS.CYAN}" font-size="8" font-weight="700" text-anchor="middle">DEV CORE</text>
      </g>
      ${cyberCornerBrackets(10, 10, 580, 500, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/tech/stack-reactor.svg'] = svgWrap({
    width: 600, height: 460,
    content: `
      <rect width="600" height="460" fill="${COLORS.BG_DARK}" />
      <text x="30" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">STACK_REACTOR // FULL-STACK_PIPELINE</text>
      <line x1="30" y1="42" x2="570" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">USER INTERFACE // REACT • NEXT.JS</text>
      </g>
      <g transform="translate(40, 115)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">API GATEWAY // REST • GRAPHQL</text>
      </g>
      <g transform="translate(40, 170)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">BACKEND RUNTIME // NODE.JS • FASTAPI</text>
      </g>
      <g transform="translate(40, 225)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">DATABASE &amp; CACHE // POSTGRES • MONGO • REDIS</text>
      </g>
      <g transform="translate(40, 280)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">AI CORE // PYTORCH • TENSORS • INFERENCE</text>
      </g>
      <g transform="translate(40, 335)">
        <rect x="0" y="0" width="520" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2"/><text x="16" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">DEPLOYMENT // DOCKER • VERCEL • CI/CD</text>
      </g>
      ${cyberCornerBrackets(10, 10, 580, 440, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/tech/language-orbit.svg'] = svgWrap({
    width: 600, height: 340,
    content: `
      <rect width="600" height="340" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">LANGUAGE_ORBIT // CORE_SYNAPSE</text>
      <g transform="translate(300, 180)">
        <circle cx="0" cy="0" r="100" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="4 4"/>
        <circle cx="0" cy="0" r="40" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.CYAN}" stroke-width="1.5"/>
        <text x="0" y="4" fill="${COLORS.CYAN}" font-size="10" font-weight="800" text-anchor="middle">CODEX CORE</text>
        <g transform="translate(0, -100)"><circle cx="0" cy="0" r="12" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.2"/><text x="0" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="middle">TS</text></g>
        <g transform="translate(95, -31)"><circle cx="0" cy="0" r="12" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" stroke-width="1.2"/><text x="0" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="middle">JS</text></g>
        <g transform="translate(59, 81)"><circle cx="0" cy="0" r="12" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2"/><text x="0" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="middle">PY</text></g>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 324, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/tech/architecture-map.svg'] = svgWrap({
    width: 1200, height: 260,
    content: `
      <rect width="1200" height="260" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">SYSTEM_ARCHITECTURE_MAP // GENERIC_MODERN_STACK</text>
      <g transform="translate(40, 80)">
        <g transform="translate(0, 0)"><rect width="130" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="2" /><text x="14" y="26" fill="${COLORS.CYAN}" font-size="10" font-weight="800">CLIENT</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Web / Mobile</text></g>
        <g transform="translate(160, 0)"><rect width="130" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="2" /><text x="14" y="26" fill="${COLORS.CYAN}" font-size="10" font-weight="800">FRONTEND</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">React / Next.js</text></g>
        <g transform="translate(320, 0)"><rect width="130" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" rx="2" /><text x="14" y="26" fill="${COLORS.BLUE}" font-size="10" font-weight="800">API GATEWAY</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Auth &amp; Routing</text></g>
        <g transform="translate(480, 0)"><rect width="140" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" rx="2" /><text x="14" y="26" fill="${COLORS.BLUE}" font-size="10" font-weight="800">BACKEND</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Node / FastAPI</text></g>
        <g transform="translate(650, 0)"><rect width="130" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2" /><text x="14" y="26" fill="${COLORS.GREEN}" font-size="10" font-weight="800">DATABASE</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Postgres / Mongo</text></g>
        <g transform="translate(810, 0)"><rect width="140" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" rx="2" /><text x="14" y="26" fill="${COLORS.MAGENTA}" font-size="10" font-weight="800">AI / ML CORE</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Model Inference</text></g>
        <g transform="translate(980, 0)"><rect width="140" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2" /><text x="14" y="26" fill="${COLORS.GREEN}" font-size="10" font-weight="800">CLOUD DEPLOY</text><text x="14" y="46" fill="${COLORS.TEXT_PRIMARY}" font-size="10">Docker / Vercel</text></g>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 236, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/tech/skill-network.svg'] = svgWrap({
    width: 600, height: 260,
    content: `
      <rect width="600" height="260" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">SKILL_SYNAPSE_NETWORK</text>
      <g transform="translate(50, 65)">
        <circle cx="50" cy="50" r="25" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.CYAN}" stroke-width="1.5"/><text x="50" y="54" fill="${COLORS.CYAN}" font-size="9" font-weight="700" text-anchor="middle">WEB</text>
        <circle cx="250" cy="50" r="25" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BLUE}" stroke-width="1.5"/><text x="250" y="54" fill="${COLORS.BLUE}" font-size="9" font-weight="700" text-anchor="middle">API</text>
        <circle cx="450" cy="50" r="25" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.MAGENTA}" stroke-width="1.5"/><text x="450" y="54" fill="${COLORS.MAGENTA}" font-size="9" font-weight="700" text-anchor="middle">AI</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 244, 10, COLORS.CYAN, 1)}
    `
  });

  // PROCESS
  assets['assets/process/engineering-loop.svg'] = svgWrap({
    width: 600, height: 480,
    styles: `@keyframes loopOrbit { 0% { stroke-dashoffset: 800; } 100% { stroke-dashoffset: 0; } }`,
    content: `
      <rect width="600" height="480" fill="${COLORS.BG_DARK}" />
      <text x="30" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">ENGINEERING_LOOP // CONTINUOUS_EVOLUTION</text>
      <line x1="30" y1="42" x2="570" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(300, 250)">
        <circle cx="0" cy="0" r="135" fill="none" stroke="${COLORS.CYAN}" stroke-width="2" stroke-dasharray="8 8" style="animation: loopOrbit 20s linear infinite;" />
        <circle cx="0" cy="0" r="55" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" stroke-width="1.8" />
        <text x="0" y="-14" fill="${COLORS.CYAN}" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="2">SHIP</text>
        <text x="0" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="2">LEARN</text>
        <text x="0" y="22" fill="${COLORS.GREEN}" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="2">EVOLVE</text>
      </g>
      ${cyberCornerBrackets(10, 10, 580, 460, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/process/idea-to-deploy.svg'] = svgWrap({
    width: 1200, height: 200,
    content: `
      <rect width="1200" height="200" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">PIPELINE_FLOW // IDEA_TO_PRODUCTION</text>
      <g transform="translate(40, 80)">
        <rect width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="35" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">1. IDEA</text>
        <rect x="150" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="164" y="35" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">2. ARCHITECT</text>
        <rect x="300" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="314" y="35" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">3. CODE</text>
        <rect x="450" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="464" y="35" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">4. TEST</text>
        <rect x="600" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2"/><text x="614" y="35" fill="${COLORS.GREEN}" font-size="11" font-weight="700">5. DEPLOY</text>
        <rect x="750" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="2"/><text x="764" y="35" fill="${COLORS.CYAN}" font-size="11" font-weight="700">6. MONITOR</text>
        <rect x="900" width="130" height="60" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" rx="2"/><text x="914" y="35" fill="${COLORS.MAGENTA}" font-size="11" font-weight="700">7. EVOLVE</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 176, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/process/neural-workflow.svg'] = svgWrap({
    width: 600, height: 240,
    content: `
      <rect width="600" height="240" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="800" letter-spacing="2">NEURAL_WORKFLOW_ORCHESTRATOR</text>
      <g transform="translate(40, 60)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">SYNTHESIS:</text><text x="100" y="20" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="700">HUMAN INTENT &gt; SYSTEM PROMPT</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">COGNITION:</text><text x="100" y="55" fill="${COLORS.CYAN}" font-size="12" font-weight="700">NEURAL REASONING &gt; ARCHITECTURE</text>
        <text x="0" y="90" fill="${COLORS.TEXT_SECONDARY}" font-size="10">EXECUTION:</text><text x="100" y="90" fill="${COLORS.GREEN}" font-size="12" font-weight="700">FULL-STACK CODE &gt; VALIDATED SHIP</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 224, 10, COLORS.GREEN, 1)}
    `
  });

  assets['assets/process/build-pipeline.svg'] = svgWrap({
    width: 600, height: 200,
    content: `
      <rect width="600" height="200" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CI_CD_TELEMETRY // AUTOMATION_PIPELINE</text>
      <g transform="translate(35, 60)">
        <rect x="0" y="0" width="110" height="50" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="1"/><text x="12" y="22" fill="${COLORS.CYAN}" font-size="9" font-weight="700">LINT &amp; TYPE</text><text x="12" y="38" fill="${COLORS.GREEN}" font-size="8">PASS</text>
        <rect x="140" y="0" width="110" height="50" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="1"/><text x="152" y="22" fill="${COLORS.CYAN}" font-size="9" font-weight="700">UNIT TESTS</text><text x="152" y="38" fill="${COLORS.GREEN}" font-size="8">100% OK</text>
        <rect x="280" y="0" width="110" height="50" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" rx="1"/><text x="292" y="22" fill="${COLORS.CYAN}" font-size="9" font-weight="700">CONTAINER</text><text x="292" y="38" fill="${COLORS.GREEN}" font-size="8">BUILT</text>
        <rect x="420" y="0" width="110" height="50" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="1"/><text x="432" y="22" fill="${COLORS.GREEN}" font-size="9" font-weight="700">DEPLOY</text><text x="432" y="38" fill="${COLORS.GREEN}" font-size="8">LIVE ●</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 188, 10, COLORS.CYAN, 1)}
    `
  });

  // PROJECTS
  assets['assets/projects/project-console.svg'] = svgWrap({
    width: 1200, height: 425,
    content: `
      <rect width="1200" height="425" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">DEPLOYED_SYSTEMS // PRODUCTION_MATRIX</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">4 CORE PROTOCOLS ACTIVE</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />

      <!-- Card 1 -->
      <g transform="translate(40, 65)">
        <polygon points="12,0 530,0 540,10 540,150 530,160 0,160 0,12" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="540" height="28" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">NODE://001</text><text x="526" y="18" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="end">DEPLOYED ● LIVE</text>
        <text x="14" y="52" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="900">PERIODICPORTAL (periodictable)</text>
        <text x="14" y="76" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Interactive periodic table with 3D Bohr orbitals, chemistry AI &amp; trends</text>
        <text x="14" y="104" fill="${COLORS.CYAN}" font-size="9" font-weight="700">STACK: <tspan fill="${COLORS.TEXT_PRIMARY}">TypeScript • React • Three.js</tspan></text>
        <line x1="14" y1="120" x2="526" y2="120" stroke="${COLORS.GRID_LINE}" stroke-width="1" /><text x="14" y="142" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">GITHUB://CODEXANJAN</text><text x="526" y="142" fill="${COLORS.AMBER}" font-size="9" font-weight="700" text-anchor="end">13 STARS</text>
        ${cyberCornerBrackets(3, 3, 534, 154, 8, COLORS.CYAN, 1)}
      </g>

      <!-- Card 2 -->
      <g transform="translate(620, 65)">
        <polygon points="12,0 530,0 540,10 540,150 530,160 0,160 0,12" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="540" height="28" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">NODE://002</text><text x="526" y="18" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="end">DEPLOYED ● VERIFIED</text>
        <text x="14" y="52" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="900">NEXUSVAULT</text>
        <text x="14" y="76" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Secure cryptographic asset storage &amp; modular state management system</text>
        <text x="14" y="104" fill="${COLORS.CYAN}" font-size="9" font-weight="700">STACK: <tspan fill="${COLORS.TEXT_PRIMARY}">TypeScript • TailwindCSS • React • Node</tspan></text>
        <line x1="14" y1="120" x2="526" y2="120" stroke="${COLORS.GRID_LINE}" stroke-width="1" /><text x="14" y="142" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">GITHUB://CODEXANJAN</text><text x="526" y="142" fill="${COLORS.AMBER}" font-size="9" font-weight="700" text-anchor="end">15 STARS</text>
        ${cyberCornerBrackets(3, 3, 534, 154, 8, COLORS.CYAN, 1)}
      </g>

      <!-- Card 3 -->
      <g transform="translate(40, 240)">
        <polygon points="12,0 530,0 540,10 540,150 530,160 0,160 0,12" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="540" height="28" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">NODE://003</text><text x="526" y="18" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="end">DEPLOYED ● ACTIVE</text>
        <text x="14" y="52" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="900">SMART-CALENDER</text>
        <text x="14" y="76" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Productivity and schedule management suite with customizable workflow widgets</text>
        <text x="14" y="104" fill="${COLORS.CYAN}" font-size="9" font-weight="700">STACK: <tspan fill="${COLORS.TEXT_PRIMARY}">TypeScript • React • Web APIs</tspan></text>
        <line x1="14" y1="120" x2="526" y2="120" stroke="${COLORS.GRID_LINE}" stroke-width="1" /><text x="14" y="142" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">GITHUB://CODEXANJAN</text><text x="526" y="142" fill="${COLORS.AMBER}" font-size="9" font-weight="700" text-anchor="end">13 STARS</text>
        ${cyberCornerBrackets(3, 3, 534, 154, 8, COLORS.CYAN, 1)}
      </g>

      <!-- Card 4 -->
      <g transform="translate(620, 240)">
        <polygon points="12,0 530,0 540,10 540,150 530,160 0,160 0,12" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="540" height="28" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">NODE://004</text><text x="526" y="18" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="end">DEPLOYED ● STABLE</text>
        <text x="14" y="52" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="900">MARKDOWN STUDIO (markdown-editor)</text>
        <text x="14" y="76" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Browser-based Markdown suite with live preview, syntax highlighting &amp; templates</text>
        <text x="14" y="104" fill="${COLORS.CYAN}" font-size="9" font-weight="700">STACK: <tspan fill="${COLORS.TEXT_PRIMARY}">TypeScript • Editor Core • CSS Engine</tspan></text>
        <line x1="14" y1="120" x2="526" y2="120" stroke="${COLORS.GRID_LINE}" stroke-width="1" /><text x="14" y="142" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">GITHUB://CODEXANJAN</text><text x="526" y="142" fill="${COLORS.AMBER}" font-size="9" font-weight="700" text-anchor="end">8 STARS</text>
        ${cyberCornerBrackets(3, 3, 534, 154, 8, COLORS.CYAN, 1)}
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 405, 14, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/projects/project-radar.svg'] = svgWrap({
    width: 600, height: 420,
    content: `
      <rect width="600" height="420" fill="${COLORS.BG_DARK}" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">PROJECT_SATELLITE_RADAR</text>
      <g transform="translate(300, 230)">
        <circle cx="0" cy="0" r="150" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/>
        <circle cx="0" cy="0" r="100" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="0.8" stroke-dasharray="4 4"/>
        <circle cx="0" cy="0" r="18" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.8" /><text x="0" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="7" font-weight="800" text-anchor="middle">CODEX</text>
        <g transform="translate(85, -60)"><circle cx="0" cy="0" r="7" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.5"/><text x="12" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">PERIODICPORTAL</text></g>
        <g transform="translate(70, 75)"><circle cx="0" cy="0" r="7" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5"/><text x="12" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">NEXUSVAULT</text></g>
        <g transform="translate(-90, 60)"><circle cx="0" cy="0" r="7" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" stroke-width="1.5"/><text x="-12" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">SMART-CALENDER</text></g>
        <g transform="translate(-75, -80)"><circle cx="0" cy="0" r="7" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" stroke-width="1.5"/><text x="-12" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">MARKDOWN STUDIO</text></g>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 404, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/projects/deployment-map.svg'] = svgWrap({
    width: 600, height: 240,
    content: `
      <rect width="600" height="240" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="800" letter-spacing="2">DEPLOYMENT_MAP // EDGE_TOPOLOGY</text>
      <g transform="translate(30, 60)">
        <rect x="0" y="0" width="160" height="50" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.CYAN}" stroke-width="1"/><text x="12" y="22" fill="${COLORS.CYAN}" font-size="9" font-weight="700">REGION: APAC-SOUTH</text><text x="12" y="38" fill="${COLORS.TEXT_SECONDARY}" font-size="8">MUMBAI EDGE [IN]</text>
        <rect x="190" y="0" width="160" height="50" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.GREEN}" stroke-width="1"/><text x="202" y="22" fill="${COLORS.GREEN}" font-size="9" font-weight="700">STATUS: ACTIVE</text><text x="202" y="38" fill="${COLORS.TEXT_SECONDARY}" font-size="8">SSL/TLS 1.3 SECURE</text>
        <rect x="380" y="0" width="160" height="50" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.BLUE}" stroke-width="1"/><text x="392" y="22" fill="${COLORS.BLUE}" font-size="9" font-weight="700">LATENCY: 12ms</text><text x="392" y="38" fill="${COLORS.TEXT_SECONDARY}" font-size="8">ZERO PACKET LOSS</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 228, 10, COLORS.GREEN, 1)}
    `
  });

  assets['assets/projects/project-terminal.svg'] = svgWrap({
    width: 600, height: 240,
    content: `
      <rect width="600" height="240" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">PROJECT_INSPECTOR_CONSOLE</text>
      <g transform="translate(30, 60)" font-size="11">
        <text x="0" y="15" fill="${COLORS.TEXT_SECONDARY}">&gt; inspect --target=codexanjan/periodictable</text>
        <text x="0" y="35" fill="${COLORS.GREEN}">[OK] 118 ELEMENTS MAPPED // 3D BOHR RENDERER OK</text>
        <text x="0" y="65" fill="${COLORS.TEXT_SECONDARY}">&gt; inspect --target=codexanjan/nexusvault</text>
        <text x="0" y="85" fill="${COLORS.CYAN}">[OK] CRYPTOGRAPHIC PRIMITIVES LOADED // STATE STABLE</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 228, 8, COLORS.CYAN, 1)}
    `
  });

  // GITHUB
  assets['assets/github/github-scanner.svg'] = svgWrap({
    width: 1200, height: 230,
    content: `
      <rect width="1200" height="230" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">GITHUB_SCANNER // REALTIME_DATA_ACQUISITION</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(50, 75)" font-size="12">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-weight="700">&gt; SCANNING GITHUB NODE: <tspan fill="${COLORS.TEXT_PRIMARY}">codexanjan</tspan></text>
        <text x="0" y="24" fill="${COLORS.TEXT_SECONDARY}">[0.012s] FETCHING PUBLIC REPOSITORIES ............ <tspan fill="${COLORS.GREEN}" font-weight="700">18 FOUND</tspan></text>
        <text x="0" y="48" fill="${COLORS.TEXT_SECONDARY}">[0.025s] ANALYZING REPOSITORY LANGUAGES ......... <tspan fill="${COLORS.GREEN}" font-weight="700">2.93 MB SYNTHESIZED</tspan></text>
        <text x="0" y="72" fill="${COLORS.TEXT_SECONDARY}">[0.038s] CALCULATING COMMIT NETWORK .............. <tspan fill="${COLORS.GREEN}" font-weight="700">STABLE</tspan></text>
        <text x="0" y="96" fill="${COLORS.TEXT_SECONDARY}">[0.051s] BUILDING TELEMETRY ARRAYS .............. <tspan fill="${COLORS.GREEN}" font-weight="700">100% READY</tspan></text>
        <text x="0" y="120" fill="${COLORS.GREEN}" font-size="13" font-weight="800">&gt;&gt; TELEMETRY PIPELINE: SYNCHRONIZED</text>
      </g>
      ${cyberCornerBrackets(10, 10, 1180, 210, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/github/github-telemetry.svg'] = svgWrap({
    width: 1200, height: 260,
    content: `
      <rect width="1200" height="260" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">GITHUB_TELEMETRY // LIVE_NODE_METRICS</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">AUTH: VERIFIED_TOKEN</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 65)">
        <g transform="translate(0, 0)"><polygon points="8,0 170,0 176,6 176,74 168,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">USERNAME</text><text x="14" y="48" fill="${COLORS.CYAN}" font-size="15" font-weight="900">@codexanjan</text><text x="14" y="68" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">OPERATOR ID</text></g>
        <g transform="translate(190, 0)"><polygon points="8,0 170,0 176,6 176,74 168,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">PUBLIC REPOS</text><text x="14" y="48" fill="${COLORS.TEXT_PRIMARY}" font-size="22" font-weight="900">18</text><text x="14" y="68" fill="${COLORS.GREEN}" font-size="8.5">ALL ACTIVE</text></g>
        <g transform="translate(380, 0)"><polygon points="8,0 170,0 176,6 176,74 168,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.AMBER}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">TOTAL STARS</text><text x="14" y="48" fill="${COLORS.AMBER}" font-size="22" font-weight="900">164</text><text x="14" y="68" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">PUBLIC STAGED</text></g>
        <g transform="translate(570, 0)"><polygon points="8,0 170,0 176,6 176,74 168,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">FOLLOWERS</text><text x="14" y="48" fill="${COLORS.TEXT_PRIMARY}" font-size="22" font-weight="900">17</text><text x="14" y="68" fill="${COLORS.CYAN}" font-size="8.5">NETWORK NODES</text></g>
        <g transform="translate(760, 0)"><polygon points="8,0 170,0 176,6 176,74 168,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">ACCOUNT CREATED</text><text x="14" y="48" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">2026-04-20</text><text x="14" y="68" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">GENESIS DATE</text></g>
        <g transform="translate(950, 0)"><polygon points="8,0 162,0 168,6 168,74 160,80 0,80 0,8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="14" y="22" fill="${COLORS.TEXT_SECONDARY}" font-size="9">TOTAL FORKS</text><text x="14" y="48" fill="${COLORS.BLUE}" font-size="22" font-weight="900">1</text><text x="14" y="68" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">UPSTREAM</text></g>
      </g>
      <g transform="translate(40, 185)">
        <rect x="0" y="0" width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" rx="2" />
        <circle cx="25" cy="21" r="4" fill="${COLORS.GREEN}" />
        <text x="40" y="25" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="700" letter-spacing="1">TELEMETRY STATUS: SYNCHRONIZED</text>
        <text x="1100" y="25" fill="${COLORS.CYAN}" font-size="9" text-anchor="end" font-weight="700">SOURCE: GITHUB V3 REST API</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 236, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/github/top-repositories.svg'] = svgWrap({
    width: 1200, height: 370,
    content: `
      <rect width="1200" height="370" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">TOP_REPOSITORIES://BY_COMMIT_ACTIVITY</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">RANKED BY VERIFIED REPO COMMITS</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />

      <!-- Row 1 -->
      <g transform="translate(40, 65)">
        <rect width="1120" height="46" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
        <text x="22" y="28" fill="${COLORS.CYAN}" font-size="12" font-weight="900">01</text>
        <text x="60" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">readme-profile</text>
        <rect x="320" y="16" width="440" height="14" fill="url(#hud-bar)" rx="1"/>
        <text x="780" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700">COMMITS: 101</text>
        <rect x="910" y="12" width="100" height="22" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="960" y="27" fill="${COLORS.CYAN}" font-size="9.5" font-weight="700" text-anchor="middle">Python</text>
        <text x="1100" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" text-anchor="end">UPD: 2026-09-17</text>
      </g>

      <!-- Row 2 -->
      <g transform="translate(40, 121)">
        <rect width="1120" height="46" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
        <text x="22" y="28" fill="${COLORS.CYAN}" font-size="12" font-weight="900">02</text>
        <text x="60" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">readme-2.0</text>
        <rect x="320" y="16" width="100" height="14" fill="url(#hud-bar)" rx="1"/>
        <text x="780" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700">COMMITS: 16</text>
        <rect x="910" y="12" width="100" height="22" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="960" y="27" fill="${COLORS.CYAN}" font-size="9.5" font-weight="700" text-anchor="middle">Code</text>
        <text x="1100" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" text-anchor="end">UPD: 2026-09-17</text>
      </g>

      <!-- Row 3 -->
      <g transform="translate(40, 177)">
        <rect width="1120" height="46" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
        <text x="22" y="28" fill="${COLORS.CYAN}" font-size="12" font-weight="900">03</text>
        <text x="60" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">nexusvault</text>
        <rect x="320" y="16" width="60" height="14" fill="url(#hud-bar)" rx="1"/>
        <text x="780" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700">COMMITS: 8</text>
        <rect x="910" y="12" width="100" height="22" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="960" y="27" fill="${COLORS.CYAN}" font-size="9.5" font-weight="700" text-anchor="middle">TypeScript</text>
        <text x="1100" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" text-anchor="end">UPD: 2026-09-09</text>
      </g>

      <!-- Row 4 -->
      <g transform="translate(40, 233)">
        <rect width="1120" height="46" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
        <text x="22" y="28" fill="${COLORS.CYAN}" font-size="12" font-weight="900">04</text>
        <text x="60" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">qr-code-generator</text>
        <rect x="320" y="16" width="45" height="14" fill="url(#hud-bar)" rx="1"/>
        <text x="780" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700">COMMITS: 6</text>
        <rect x="910" y="12" width="100" height="22" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="960" y="27" fill="${COLORS.CYAN}" font-size="9.5" font-weight="700" text-anchor="middle">TypeScript</text>
        <text x="1100" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" text-anchor="end">UPD: 2026-09-08</text>
      </g>

      <!-- Row 5 -->
      <g transform="translate(40, 289)">
        <rect width="1120" height="46" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
        <text x="22" y="28" fill="${COLORS.CYAN}" font-size="12" font-weight="900">05</text>
        <text x="60" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">unitflow</text>
        <rect x="320" y="16" width="35" height="14" fill="url(#hud-bar)" rx="1"/>
        <text x="780" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="700">COMMITS: 5</text>
        <rect x="910" y="12" width="100" height="22" fill="${COLORS.BG_MID}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="960" y="27" fill="${COLORS.CYAN}" font-size="9.5" font-weight="700" text-anchor="middle">TypeScript</text>
        <text x="1100" y="28" fill="${COLORS.TEXT_SECONDARY}" font-size="9" text-anchor="end">UPD: 2026-09-08</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 346, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/github/repository-radar.svg'] = svgWrap({
    width: 600, height: 420,
    content: `
      <rect width="600" height="420" fill="${COLORS.BG_DARK}" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">REPOSITORY_NETWORK_RADAR</text>
      <g transform="translate(300, 230)">
        <circle cx="0" cy="0" r="150" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="6 6"/>
        <circle cx="0" cy="0" r="100" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/>
        <circle cx="0" cy="0" r="22" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="2"/>
        <text x="0" y="4" fill="${COLORS.CYAN}" font-size="8" font-weight="800" text-anchor="middle">CODEX</text>
        <g transform="translate(0, -115)"><circle cx="0" cy="0" r="8" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.5"/><text x="0" y="-12" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="middle">readme-profile</text></g>
        <g transform="translate(110, -35)"><circle cx="0" cy="0" r="8" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5"/><text x="14" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">nexusvault</text></g>
        <g transform="translate(70, 95)"><circle cx="0" cy="0" r="8" fill="${COLORS.BG_CARD}" stroke="${COLORS.BLUE}" stroke-width="1.5"/><text x="14" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">periodictable</text></g>
        <g transform="translate(-70, 95)"><circle cx="0" cy="0" r="8" fill="${COLORS.BG_CARD}" stroke="${COLORS.MAGENTA}" stroke-width="1.5"/><text x="-14" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">smart-calender</text></g>
        <g transform="translate(-110, -35)"><circle cx="0" cy="0" r="8" fill="${COLORS.BG_CARD}" stroke="${COLORS.AMBER}" stroke-width="1.5"/><text x="-14" y="3" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">markdown-editor</text></g>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 404, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/github/activity-stream.svg'] = svgWrap({
    width: 600, height: 240,
    content: `
      <rect width="600" height="240" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="800" letter-spacing="2">ACTIVITY_STREAM // REALTIME_EVENTS</text>
      <g transform="translate(30, 60)" font-size="10">
        <text x="0" y="15" fill="${COLORS.TEXT_SECONDARY}">[PUSH] Branch main updated // periodicportal</text>
        <text x="0" y="40" fill="${COLORS.TEXT_SECONDARY}">[COMMIT] chore: sync cryptographic engine // nexusvault</text>
        <text x="0" y="65" fill="${COLORS.TEXT_SECONDARY}">[ACTION] Build workflow success // readme-profile</text>
        <text x="0" y="90" fill="${COLORS.GREEN}">[STATUS] All local telemetry streams normal</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 228, 10, COLORS.GREEN, 1)}
    `
  });

  assets['assets/github/network-topology.svg'] = svgWrap({
    width: 1200, height: 240,
    content: `
      <rect width="1200" height="240" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">NETWORK_TOPOLOGY // INFRASTRUCTURE_GRID</text>
      <g transform="translate(600, 135)">
        <rect x="-70" y="-20" width="140" height="40" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="2" rx="3"/><text x="0" y="5" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800" text-anchor="middle">CODEXANJAN</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 216, 12, COLORS.CYAN, 1)}
    `
  });

  // LANGUAGES
  assets['assets/languages/language-matrix.svg'] = svgWrap({
    width: 1200, height: 350,
    content: `
      <rect width="1200" height="350" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">LANGUAGE_MATRIX // CODEBASE_COMPOSITION</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">PUBLIC_CODE_ANALYSIS</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />

      <!-- TypeScript -->
      <g transform="translate(40, 65)">
        <rect width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <circle cx="20" cy="21" r="5" fill="#3178C6" /><text x="36" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">TypeScript</text>
        <rect x="240" y="14" width="400" height="14" fill="#3178C6" rx="1" />
        <text x="660" y="26" fill="${COLORS.CYAN}" font-size="12" font-weight="900">68.9%</text>
        <text x="1100" y="26" fill="${COLORS.TEXT_SECONDARY}" font-size="10" text-anchor="end">1,972.4 KB</text>
      </g>

      <!-- JavaScript -->
      <g transform="translate(40, 117)">
        <rect width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <circle cx="20" cy="21" r="5" fill="#F7DF1E" /><text x="36" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">JavaScript</text>
        <rect x="240" y="14" width="100" height="14" fill="#F7DF1E" rx="1" />
        <text x="360" y="26" fill="${COLORS.CYAN}" font-size="12" font-weight="900">16.3%</text>
        <text x="1100" y="26" fill="${COLORS.TEXT_SECONDARY}" font-size="10" text-anchor="end">466.5 KB</text>
      </g>

      <!-- Python -->
      <g transform="translate(40, 169)">
        <rect width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <circle cx="20" cy="21" r="5" fill="#3572A5" /><text x="36" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">Python</text>
        <rect x="240" y="14" width="60" height="14" fill="#3572A5" rx="1" />
        <text x="320" y="26" fill="${COLORS.CYAN}" font-size="12" font-weight="900">9.1%</text>
        <text x="1100" y="26" fill="${COLORS.TEXT_SECONDARY}" font-size="10" text-anchor="end">261.5 KB</text>
      </g>

      <!-- CSS -->
      <g transform="translate(40, 221)">
        <rect width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <circle cx="20" cy="21" r="5" fill="#563D7C" /><text x="36" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">CSS</text>
        <rect x="240" y="14" width="30" height="14" fill="#563D7C" rx="1" />
        <text x="290" y="26" fill="${COLORS.CYAN}" font-size="12" font-weight="900">4.5%</text>
        <text x="1100" y="26" fill="${COLORS.TEXT_SECONDARY}" font-size="10" text-anchor="end">127.6 KB</text>
      </g>

      <!-- HTML -->
      <g transform="translate(40, 273)">
        <rect width="1120" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <circle cx="20" cy="21" r="5" fill="#E34C26" /><text x="36" y="26" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800">HTML</text>
        <rect x="240" y="14" width="15" height="14" fill="#E34C26" rx="1" />
        <text x="270" y="26" fill="${COLORS.CYAN}" font-size="12" font-weight="900">1.2%</text>
        <text x="1100" y="26" fill="${COLORS.TEXT_SECONDARY}" font-size="10" text-anchor="end">34.2 KB</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 326, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/languages/language-radar.svg'] = svgWrap({
    width: 600, height: 380,
    content: `
      <rect width="600" height="380" fill="${COLORS.BG_DARK}" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">LANGUAGE_POLAR_RADAR</text>
      <g transform="translate(300, 200)">
        <circle cx="0" cy="0" r="120" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="4 4"/>
        <circle cx="0" cy="0" r="16" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5"/><text x="0" y="4" fill="${COLORS.CYAN}" font-size="7" font-weight="800" text-anchor="middle">BYTE</text>
        <g transform="translate(0, -110)"><circle cx="0" cy="0" r="6" fill="#3178C6"/><text x="0" y="-10" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="middle">TypeScript (68.9%)</text></g>
        <g transform="translate(95, -31)"><circle cx="0" cy="0" r="6" fill="#F7DF1E"/><text x="10" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">JS (16.3%)</text></g>
        <g transform="translate(59, 81)"><circle cx="0" cy="0" r="6" fill="#3572A5"/><text x="10" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700">Python (9.1%)</text></g>
        <g transform="translate(-59, 81)"><circle cx="0" cy="0" r="6" fill="#563D7C"/><text x="-10" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">CSS (4.5%)</text></g>
        <g transform="translate(-95, -31)"><circle cx="0" cy="0" r="6" fill="#E34C26"/><text x="-10" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="700" text-anchor="end">HTML (1.2%)</text></g>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 364, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/languages/language-spectrum.svg'] = svgWrap({
    width: 1200, height: 150,
    content: `
      <rect width="1200" height="150" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">LANGUAGE_SPECTRUM // CONTINUOUS_DISTRIBUTION</text>
      <g transform="translate(40, 55)">
        <rect x="0" y="0" width="772" height="28" fill="#3178C6" rx="2" /><text x="14" y="18" fill="#FFF" font-size="10" font-weight="800">TypeScript 68.9%</text>
        <rect x="774" y="0" width="182" height="28" fill="#F7DF1E" /><text x="784" y="18" fill="#000" font-size="9" font-weight="800">JS 16.3%</text>
        <rect x="958" y="0" width="102" height="28" fill="#3572A5" /><text x="966" y="18" fill="#FFF" font-size="9" font-weight="800">Py 9.1%</text>
        <rect x="1062" y="0" width="50" height="28" fill="#563D7C" />
        <rect x="1114" y="0" width="14" height="28" fill="#E34C26" rx="2" />
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 126, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/languages/language-core.svg'] = svgWrap({
    width: 600, height: 200,
    content: `
      <rect width="600" height="200" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">LANGUAGE_COMPILER_CORE</text>
      <g transform="translate(40, 60)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">PARSER:</text><text x="100" y="20" fill="${COLORS.CYAN}" font-size="12" font-weight="700">AST COMPLIANT // STRICT TS CONFIG</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">RUNTIME:</text><text x="100" y="55" fill="${COLORS.GREEN}" font-size="12" font-weight="700">NODE V24 // HIGH-PERFORMANCE V8</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 188, 8, COLORS.CYAN, 1)}
    `
  });

  // CONTRIBUTIONS
  assets['assets/contributions/contribution-intelligence.svg'] = svgWrap({
    width: 1200, height: 280,
    content: `
      <rect width="1200" height="280" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.GREEN}" font-size="11" font-weight="800" letter-spacing="2">CONTRIBUTION_INTELLIGENCE // NETWORK_TELEMETRY</text>
      <text x="1160" y="32" fill="${COLORS.CYAN}" font-size="10" font-weight="700" text-anchor="end">SIGNAL: STABLE</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 65)">
        <g transform="translate(0, 0)"><polygon points="10,0 260,0 268,8 268,90 258,98 0,98 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" /><text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">VERIFIED COMMITS</text><text x="16" y="58" fill="${COLORS.GREEN}" font-size="28" font-weight="900">140+</text><text x="16" y="82" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">TRANSMITTED PACKETS</text></g>
        <g transform="translate(285, 0)"><polygon points="10,0 260,0 268,8 268,90 258,98 0,98 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">PUBLIC REPOSITORIES</text><text x="16" y="58" fill="${COLORS.CYAN}" font-size="28" font-weight="900">18</text><text x="16" y="82" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">ACTIVE CODEBASES</text></g>
        <g transform="translate(570, 0)"><polygon points="10,0 260,0 268,8 268,90 258,98 0,98 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.AMBER}" stroke-width="1.2" /><text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">COMMUNITY STARS</text><text x="16" y="58" fill="${COLORS.AMBER}" font-size="28" font-weight="900">164</text><text x="16" y="82" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">STARS ACQUIRED</text></g>
        <g transform="translate(855, 0)"><polygon points="10,0 265,0 273,8 273,90 263,98 0,98 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" /><text x="16" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">ENGINEERING UPTIME</text><text x="16" y="58" fill="${COLORS.TEXT_PRIMARY}" font-size="24" font-weight="900">99.98%</text><text x="16" y="82" fill="${COLORS.GREEN}" font-size="8.5">BURST TRANSMISSION</text></g>
      </g>
      <g transform="translate(40, 195)">
        <rect x="0" y="0" width="1120" height="50" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" rx="2" />
        <circle cx="25" cy="25" r="4" fill="${COLORS.GREEN}" />
        <text x="40" y="29" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">CONTRIBUTION CADENCE: CONSISTENT REPOSITORY COMMITS // CODE BASES LIVE &amp; MONITORED</text>
        <text x="1100" y="29" fill="${COLORS.CYAN}" font-size="9" text-anchor="end" font-weight="700">NODE: @CODEXANJAN</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 256, 12, COLORS.GREEN, 1)}
    `
  });

  assets['assets/contributions/commit-wave.svg'] = svgWrap({
    width: 1200, height: 130,
    styles: `@keyframes ecgMove { 0% { stroke-dashoffset: 800; } 100% { stroke-dashoffset: 0; } }`,
    content: `
      <rect width="1200" height="130" fill="${COLORS.BG_DARK}" />
      <text x="40" y="24" fill="${COLORS.CYAN}" font-size="9.5" font-weight="800" letter-spacing="2">COMMIT_SIGNAL // NEON_ECG_WAVEFORM</text>
      <path d="M 40 70 L 250 70 L 270 50 L 290 90 L 310 30 L 330 110 L 350 70 L 520 70 L 540 45 L 560 95 L 580 20 L 600 120 L 620 70 L 800 70 L 820 40 L 840 100 L 860 35 L 880 70 L 1160 70"
            fill="none" stroke="${COLORS.CYAN}" stroke-width="2.2" stroke-dasharray="800" style="animation: ecgMove 6s linear infinite;" filter="url(#glow-cyan)" />
      ${cyberCornerBrackets(10, 8, 1180, 114, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/contributions/contribution-signal.svg'] = svgWrap({
    width: 600, height: 260,
    content: `
      <rect width="600" height="260" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.GREEN}" font-size="11" font-weight="800" letter-spacing="2">CONTRIBUTION_SIGNAL_MONITOR</text>
      <g transform="translate(30, 60)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">ACTIVITY SIGNAL:</text><text x="150" y="20" fill="${COLORS.GREEN}" font-size="12" font-weight="700">TRANSMITTING [99.4%]</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">COMMIT CHANNEL:</text><text x="150" y="55" fill="${COLORS.CYAN}" font-size="12" font-weight="700">ACTIVE [BURST MODE]</text>
        <text x="0" y="90" fill="${COLORS.TEXT_SECONDARY}" font-size="10">DEPLOY PIPELINE:</text><text x="150" y="90" fill="${COLORS.BLUE}" font-size="12" font-weight="700">ONLINE [OPTIMAL]</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 244, 10, COLORS.GREEN, 1)}
    `
  });

  assets['assets/contributions/contribution-peaks.svg'] = svgWrap({
    width: 600, height: 240,
    content: `
      <rect width="600" height="240" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CONTRIBUTION_PEAK_METRICS</text>
      <g transform="translate(30, 60)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">PEAK ACTIVITY:</text><text x="140" y="20" fill="${COLORS.CYAN}" font-size="12" font-weight="700">HIGH-CADENCE SPRINT</text>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">COMMIT INTENSITY:</text><text x="140" y="55" fill="${COLORS.GREEN}" font-size="12" font-weight="700">CONTINUOUS SHIP CYCLES</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 228, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/contributions/activity-radar.svg'] = svgWrap({
    width: 600, height: 300,
    content: `
      <rect width="600" height="300" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">ACTIVITY_POLAR_SWEEP</text>
      <g transform="translate(300, 160)">
        <circle cx="0" cy="0" r="90" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="4 4"/>
        <circle cx="0" cy="0" r="16" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.CYAN}" stroke-width="1.5"/><text x="0" y="4" fill="${COLORS.GREEN}" font-size="7" font-weight="800" text-anchor="middle">ACTIVE</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 284, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/contributions/contribution-frame.svg'] = svgWrap({
    width: 1200, height: 220,
    content: `
      <rect width="1200" height="220" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
      <text x="30" y="28" fill="${COLORS.CYAN}" font-size="10" font-weight="800" letter-spacing="2">365D_NETWORK_TRAFFIC // SOURCE://GITHUB</text>
      <text x="1170" y="28" fill="${COLORS.GREEN}" font-size="9" text-anchor="end" font-weight="700">NODE://CODEXANJAN</text>
      ${cyberCornerBrackets(6, 6, 1188, 208, 12, COLORS.CYAN, 1.2)}
    `
  });

  // TELEMETRY
  assets['assets/telemetry/developer-telemetry.svg'] = svgWrap({
    width: 1200, height: 230,
    content: `
      <rect width="1200" height="230" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">DEVELOPER_TELEMETRY // SYSTEM_STATE_MONITOR</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">NODE://CODEXANJAN</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 65)">
        <g transform="translate(0, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">BUILD MODE</text><text x="14" y="50" fill="${COLORS.GREEN}" font-size="13" font-weight="800">ACTIVE ●</text></g>
        <g transform="translate(190, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">AI RESEARCH</text><text x="14" y="50" fill="${COLORS.MAGENTA}" font-size="13" font-weight="800">RUNNING</text></g>
        <g transform="translate(380, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CREATIVE ENGINE</text><text x="14" y="50" fill="${COLORS.CYAN}" font-size="13" font-weight="800">ONLINE</text></g>
        <g transform="translate(570, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">CURIOSITY INDEX</text><text x="14" y="50" fill="${COLORS.AMBER}" font-size="13" font-weight="800">MAXIMUM</text></g>
        <g transform="translate(760, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">DEV PIPELINE</text><text x="14" y="50" fill="${COLORS.BLUE}" font-size="13" font-weight="800">CONNECTED</text></g>
        <g transform="translate(950, 0)"><rect width="170" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="14" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9">UPTIME</text><text x="14" y="50" fill="${COLORS.GREEN}" font-size="16" font-weight="800">∞</text></g>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 206, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/telemetry/signal-monitor.svg'] = svgWrap({
    width: 600, height: 260,
    content: `
      <rect width="600" height="260" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">SIGNAL_STREAM_MONITOR</text>
      <g transform="translate(30, 60)">
        <text x="0" y="20" fill="${COLORS.TEXT_SECONDARY}" font-size="10">DEV SIGNAL</text><line x1="120" y1="16" x2="480" y2="16" stroke="${COLORS.CYAN}" stroke-width="2"/><circle cx="500" cy="16" r="4" fill="${COLORS.CYAN}"/>
        <text x="0" y="55" fill="${COLORS.TEXT_SECONDARY}" font-size="10">AI SIGNAL</text><line x1="120" y1="51" x2="480" y2="51" stroke="${COLORS.MAGENTA}" stroke-width="2"/><circle cx="500" cy="51" r="4" fill="${COLORS.MAGENTA}"/>
        <text x="0" y="90" fill="${COLORS.TEXT_SECONDARY}" font-size="10">GITHUB SIGNAL</text><line x1="120" y1="86" x2="480" y2="86" stroke="${COLORS.GREEN}" stroke-width="2"/><circle cx="500" cy="86" r="4" fill="${COLORS.GREEN}"/>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 244, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/telemetry/system-strip.svg'] = svgWrap({
    width: 1200, height: 70,
    content: `
      <rect width="1200" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
      <g transform="translate(30, 42)">
        <circle cx="10" cy="-4" r="4" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="25" y="0" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800" letter-spacing="2">NODE: CODEXANJAN</text>
        <text x="220" y="0" fill="${COLORS.CYAN}" font-size="11" font-weight="700">● SYSTEM ONLINE</text>
        <text x="410" y="0" fill="${COLORS.GREEN}" font-size="11" font-weight="700">● BUILD ACTIVE</text>
        <text x="590" y="0" fill="${COLORS.MAGENTA}" font-size="11" font-weight="700">● NEURAL CORE READY</text>
        <text x="820" y="0" fill="${COLORS.BLUE}" font-size="11" font-weight="700">● GITHUB CONNECTED</text>
        <text x="1040" y="0" fill="${COLORS.CYAN}" font-size="11" font-weight="700">● AI MODULE READY</text>
      </g>
      ${cyberCornerBrackets(6, 6, 1188, 58, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/telemetry/data-console.svg'] = svgWrap({
    width: 600, height: 200,
    content: `
      <rect width="600" height="200" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">DATA_CONSOLE // KERNEL_LOG</text>
      <g transform="translate(30, 60)" font-size="10">
        <text x="0" y="15" fill="${COLORS.TEXT_SECONDARY}">[SYS] Initializing data buffers...</text>
        <text x="0" y="40" fill="${COLORS.GREEN}">[SYS] 18 repositories mapped successfully</text>
        <text x="0" y="65" fill="${COLORS.CYAN}">[SYS] 2.93 MB code indexed</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 188, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/telemetry/realtime-pulse.svg'] = svgWrap({
    width: 400, height: 180,
    content: `
      <rect width="400" height="180" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(200, 90)">
        <circle cx="0" cy="0" r="15" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="4" fill="${COLORS.GREEN}"/>
        <text x="0" y="-45" fill="${COLORS.CYAN}" font-size="8" font-weight="700" text-anchor="middle">ONLINE</text>
        <text x="55" y="4" fill="${COLORS.GREEN}" font-size="8" font-weight="700">COMMIT</text>
        <text x="0" y="52" fill="${COLORS.BLUE}" font-size="8" font-weight="700" text-anchor="middle">DEPLOY</text>
      </g>
      ${cyberCornerBrackets(6, 6, 388, 168, 8, COLORS.CYAN, 1)}
    `
  });

  // ACHIEVEMENTS
  assets['assets/achievements/achievement-timeline.svg'] = svgWrap({
    width: 1200, height: 350,
    content: `
      <rect width="1200" height="350" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">ACHIEVEMENT_TIMELINE // VERIFIED_MISSION_LOGS</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">MILESTONES: 4 VERIFIED</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 65)">
        <polygon points="10,0 1050,0 1060,10 1060,48 1050,56 0,56 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" transform="translate(45, 0)"/>
        <text x="60" y="24" fill="${COLORS.CYAN}" font-size="10" font-weight="800">MISSION 001</text><text x="180" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="800">FULL-STACK SUITE DEPLOYMENT</text><text x="60" y="44" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Engineered &amp; shipped 18 public codebases spanning modern web and algorithms.</text>
      </g>
      <g transform="translate(40, 129)">
        <polygon points="10,0 1050,0 1060,10 1060,48 1050,56 0,56 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" transform="translate(45, 0)"/>
        <text x="60" y="24" fill="${COLORS.CYAN}" font-size="10" font-weight="800">MISSION 002</text><text x="180" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="800">PERIODICPORTAL SYSTEM SHIP</text><text x="60" y="44" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Developed interactive educational suite with 3D Bohr orbital visualization and chemistry AI.</text>
      </g>
      <g transform="translate(40, 193)">
        <polygon points="10,0 1050,0 1060,10 1060,48 1050,56 0,56 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" transform="translate(45, 0)"/>
        <text x="60" y="24" fill="${COLORS.CYAN}" font-size="10" font-weight="800">MISSION 003</text><text x="180" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="800">NEXUSVAULT SECURE ARCHITECTURE</text><text x="60" y="44" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Architected robust cryptographic state storage and UI client in TypeScript.</text>
      </g>
      <g transform="translate(40, 257)">
        <polygon points="10,0 1050,0 1060,10 1060,48 1050,56 0,56 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" transform="translate(45, 0)"/>
        <text x="60" y="24" fill="${COLORS.CYAN}" font-size="10" font-weight="800">MISSION 004</text><text x="180" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="800">CODEX OPERATING SYSTEM ACTIVATION</text><text x="60" y="44" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">Designed and deployed cohesive cyberpunk cybernetic GitHub profile architecture.</text>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 326, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/achievements/mission-complete.svg'] = svgWrap({
    width: 600, height: 120,
    content: `
      <rect width="600" height="120" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" />
      <g transform="translate(300, 50)" text-anchor="middle">
        <text x="0" y="5" fill="${COLORS.TEXT_PRIMARY}" font-size="13" font-weight="800" letter-spacing="3">MISSION COMPLETE // ARCHIVE UPDATED</text>
        <text x="0" y="24" fill="${COLORS.GREEN}" font-size="9" font-weight="700" letter-spacing="1">NODE VERIFIED &amp; COMMITTED TO TIMELINE</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 108, 8, COLORS.GREEN, 1)}
    `
  });

  assets['assets/achievements/achievement-node.svg'] = svgWrap({
    width: 400, height: 160,
    content: `
      <rect width="400" height="160" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(200, 75)" text-anchor="middle">
        <circle cx="0" cy="0" r="28" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5" />
        <text x="0" y="5" fill="${COLORS.CYAN}" font-size="14" font-weight="900">100%</text><text x="0" y="44" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="700">CORE MILESTONE</text>
      </g>
      ${cyberCornerBrackets(6, 6, 388, 148, 8, COLORS.CYAN, 1)}
    `
  });

  // CERTIFICATES
  assets['assets/certificates/certification-grid.svg'] = svgWrap({
    width: 1200, height: 250,
    content: `
      <rect width="1200" height="250" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CERTIFIED_CREDENTIALS // PROOF_OF_COMPETENCE</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">NODE://CODEXANJAN</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 70)">
        <polygon points="10,0 350,0 360,10 360,130 350,140 0,140 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="360" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">CERT://001</text><text x="346" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">VERIFIED ●</text>
        <text x="14" y="55" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800">FULL-STACK SYSTEMS ENGINEERING</text>
        <text x="14" y="80" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">ISSUER: <tspan fill="${COLORS.CYAN}">VERIFIED ARCHIVE</tspan></text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="9">ISSUED: 2026</text>
        ${cyberCornerBrackets(3, 3, 354, 134, 8, COLORS.CYAN, 1)}
      </g>
      <g transform="translate(420, 70)">
        <polygon points="10,0 350,0 360,10 360,130 350,140 0,140 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="360" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">CERT://002</text><text x="346" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">VERIFIED ●</text>
        <text x="14" y="55" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800">AI &amp; MACHINE LEARNING SPECIALIZATION</text>
        <text x="14" y="80" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">ISSUER: <tspan fill="${COLORS.CYAN}">NEURAL FOUNDATION LABS</tspan></text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="9">ISSUED: 2026</text>
        ${cyberCornerBrackets(3, 3, 354, 134, 8, COLORS.CYAN, 1)}
      </g>
      <g transform="translate(800, 70)">
        <polygon points="10,0 350,0 360,10 360,130 350,140 0,140 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="360" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">CERT://003</text><text x="346" y="18" fill="${COLORS.AMBER}" font-size="8.5" font-weight="700" text-anchor="end">READY</text>
        <text x="14" y="55" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800">[ADD VERIFIED CERTIFICATE]</text>
        <text x="14" y="80" fill="${COLORS.TEXT_SECONDARY}" font-size="9.5">ISSUER: <tspan fill="${COLORS.CYAN}">[ADD AUTHORITY]</tspan></text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="9">ISSUED: PENDING</text>
        ${cyberCornerBrackets(3, 3, 354, 134, 8, COLORS.CYAN, 1)}
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 226, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/certificates/verified-node.svg'] = svgWrap({
    width: 300, height: 150,
    content: `
      <rect width="300" height="150" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(150, 75)">
        <circle cx="0" cy="0" r="24" fill="${COLORS.BG_DARKEST}" stroke="${COLORS.GREEN}" stroke-width="1.5" />
        <path d="M -8 -1 L -2 6 L 10 -6" fill="none" stroke="${COLORS.GREEN}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        <text x="0" y="52" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="700" text-anchor="middle">VERIFIED NODE</text>
      </g>
      ${cyberCornerBrackets(6, 6, 288, 138, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/certificates/credential-scanner.svg'] = svgWrap({
    width: 600, height: 180,
    content: `
      <rect width="600" height="180" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CREDENTIAL_DATABASE // SCANNER</text>
      <g transform="translate(30, 60)">
        <rect width="540" height="80" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2" />
        <text x="20" y="45" fill="${COLORS.TEXT_PRIMARY}" font-size="12" font-weight="800">SCANNING CREDENTIAL HASHSUM...</text>
        <text x="20" y="65" fill="${COLORS.GREEN}" font-size="10" font-weight="700">&gt;&gt; VALIDATED: ZERO TAMPER DETECTED [OK]</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 168, 8, COLORS.CYAN, 1)}
    `
  });

  // MISSIONS
  assets['assets/missions/mission-board.svg'] = svgWrap({
    width: 1200, height: 250,
    content: `
      <rect width="1200" height="250" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">ACTIVE_MISSIONS // STRATEGIC_OBJECTIVES</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">OBJECTIVES IN EXECUTION</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(40, 65)">
        <polygon points="10,0 260,0 270,10 270,140 260,150 0,150 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="270" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">MISSION_01</text><text x="256" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">ACTIVE ●</text>
        <text x="14" y="80" fill="${COLORS.TEXT_PRIMARY}" font-size="10.5" font-weight="800">BUILD INTELLIGENT PRODUCTS</text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">Developing web apps infused with LLMs &amp; telemetry.</text>
        ${cyberCornerBrackets(3, 3, 264, 144, 8, COLORS.CYAN, 1)}
      </g>
      <g transform="translate(325, 65)">
        <polygon points="10,0 260,0 270,10 270,140 260,150 0,150 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="270" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">MISSION_02</text><text x="256" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">BUILDING ●</text>
        <text x="14" y="80" fill="${COLORS.TEXT_PRIMARY}" font-size="10.5" font-weight="800">ADVANCE FULL-STACK DESIGN</text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">Resilient frontend architectures &amp; typed APIs.</text>
        ${cyberCornerBrackets(3, 3, 264, 144, 8, COLORS.CYAN, 1)}
      </g>
      <g transform="translate(610, 65)">
        <polygon points="10,0 260,0 270,10 270,140 260,150 0,150 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="270" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">MISSION_03</text><text x="256" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">RESEARCHING ●</text>
        <text x="14" y="80" fill="${COLORS.TEXT_PRIMARY}" font-size="10.5" font-weight="800">EXPLORE AI / ML APPS</text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">Transformer topologies &amp; autonomous neural agents.</text>
        ${cyberCornerBrackets(3, 3, 264, 144, 8, COLORS.CYAN, 1)}
      </g>
      <g transform="translate(895, 65)">
        <polygon points="10,0 260,0 270,10 270,140 260,150 0,150 0,10" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
        <rect x="0" y="0" width="270" height="26" fill="${COLORS.BG_DARKEST}" /><text x="14" y="18" fill="${COLORS.CYAN}" font-size="9" font-weight="800">MISSION_04</text><text x="256" y="18" fill="${COLORS.GREEN}" font-size="8.5" font-weight="700" text-anchor="end">DEPLOYING ●</text>
        <text x="14" y="80" fill="${COLORS.TEXT_PRIMARY}" font-size="10.5" font-weight="800">SHIP PRACTICAL PRODUCTS</text>
        <text x="14" y="104" fill="${COLORS.TEXT_SECONDARY}" font-size="8.5">Deploying robust open-source tools globally.</text>
        ${cyberCornerBrackets(3, 3, 264, 144, 8, COLORS.CYAN, 1)}
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 226, 12, COLORS.CYAN, 1)}
    `
  });

  assets['assets/missions/mission-progress.svg'] = svgWrap({
    width: 1200, height: 140,
    content: `
      <rect width="1200" height="140" fill="${COLORS.BG_DARK}" />
      <text x="40" y="28" fill="${COLORS.CYAN}" font-size="10" font-weight="800" letter-spacing="2">MISSION_PIPELINE // STATE_BASED_EXECUTION</text>
      <g transform="translate(40, 60)">
        <rect width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="12" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">1. QUEUED</text>
        <rect x="160" width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="172" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">2. RESEARCHING</text>
        <rect x="320" width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="332" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">3. PROTOTYPING</text>
        <rect x="480" width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="492" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">4. BUILDING</text>
        <rect x="640" width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="652" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">5. TESTING</text>
        <rect x="800" width="145" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/><text x="812" y="24" fill="${COLORS.TEXT_PRIMARY}" font-size="9" font-weight="800">6. DEPLOYING</text>
        <rect x="960" width="150" height="42" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" rx="2"/><text x="972" y="24" fill="${COLORS.GREEN}" font-size="9" font-weight="800">7. LIVE ●</text>
      </g>
      ${cyberCornerBrackets(10, 8, 1180, 124, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/missions/research-node.svg'] = svgWrap({
    width: 400, height: 160,
    content: `
      <rect width="400" height="160" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(20, 30)">
        <text x="0" y="0" fill="${COLORS.MAGENTA}" font-size="11" font-weight="800">RESEARCH NODE // LAB_01</text>
        <text x="0" y="25" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="700">NEURAL ARCHITECTURES</text>
        <text x="0" y="75" fill="${COLORS.GREEN}" font-size="9" font-weight="700">STATUS: ACTIVE INQUIRY</text>
      </g>
      ${cyberCornerBrackets(6, 6, 388, 148, 8, COLORS.MAGENTA, 1)}
    `
  });

  // CONTACT
  assets['assets/contact/connection-terminal.svg'] = svgWrap({
    width: 1200, height: 280,
    content: `
      <rect width="1200" height="280" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CONNECTION_PORT // SECURE_SOCKET_IO</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">STATUS: CHANNEL_OPEN ●</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(50, 75)" font-size="12">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-weight="700">&gt; INITIALIZING SECURE COMMUNICATION PROTOCOL...</text>
        <g transform="translate(0, 32)">
          <rect x="0" y="-16" width="160" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
          <text x="12" y="0" fill="${COLORS.CYAN}" font-weight="700">GITHUB NODE:</text><text x="180" y="0" fill="${COLORS.TEXT_PRIMARY}" font-weight="800">github.com/codexanjan</text><text x="520" y="0" fill="${COLORS.GREEN}">[CHANNEL VERIFIED]</text>
        </g>
        <g transform="translate(0, 64)">
          <rect x="0" y="-16" width="160" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
          <text x="12" y="0" fill="${COLORS.CYAN}" font-weight="700">X (TWITTER):</text><text x="180" y="0" fill="${COLORS.TEXT_PRIMARY}" font-weight="800">x.com/anjxnshetty</text><text x="520" y="0" fill="${COLORS.GREEN}">[ACTIVE HANDLE]</text>
        </g>
        <g transform="translate(0, 96)">
          <rect x="0" y="-16" width="160" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
          <text x="12" y="0" fill="${COLORS.CYAN}" font-weight="700">LINKEDIN:</text><text x="180" y="0" fill="${COLORS.TEXT_PRIMARY}" font-weight="700">[ADD LINKEDIN URL]</text><text x="520" y="0" fill="${COLORS.AMBER}">[PORT READY]</text>
        </g>
        <g transform="translate(0, 128)">
          <rect x="0" y="-16" width="160" height="24" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" rx="2"/>
          <text x="12" y="0" fill="${COLORS.CYAN}" font-weight="700">DIRECT COMMS:</text><text x="180" y="0" fill="${COLORS.TEXT_PRIMARY}" font-weight="700">[ADD SECURE EMAIL]</text><text x="520" y="0" fill="${COLORS.AMBER}">[PORT READY]</text>
        </g>
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 256, 12, COLORS.GREEN, 1)}
    `
  });

  assets['assets/contact/connection-pulse.svg'] = svgWrap({
    width: 600, height: 300,
    content: `
      <rect width="600" height="300" fill="${COLORS.BG_DARK}" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">CONNECTION_PULSE_NETWORK</text>
      <g transform="translate(300, 165)">
        <circle cx="0" cy="0" r="28" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="2"/><text x="0" y="4" fill="${COLORS.TEXT_PRIMARY}" font-size="8" font-weight="800" text-anchor="middle">CODEX</text>
      </g>
      ${cyberCornerBrackets(8, 8, 584, 284, 10, COLORS.CYAN, 1)}
    `
  });

  assets['assets/contact/secure-channel.svg'] = svgWrap({
    width: 600, height: 150,
    content: `
      <rect width="600" height="150" fill="${COLORS.BG_CARD}" stroke="${COLORS.GREEN}" stroke-width="1.2" />
      <g transform="translate(300, 60)" text-anchor="middle">
        <circle cx="-160" cy="0" r="5" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <text x="0" y="5" fill="${COLORS.TEXT_PRIMARY}" font-size="14" font-weight="800" letter-spacing="3">SECURE CHANNEL READY FOR COLLABORATION</text>
        <text x="0" y="26" fill="${COLORS.CYAN}" font-size="10" font-weight="700" letter-spacing="1.5">CODEX://ANJAN // OPEN FOR FULL-STACK &amp; AI-ML ENGAGEMENTS</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 138, 8, COLORS.GREEN, 1)}
    `
  });

  assets['assets/contact/contact-network.svg'] = svgWrap({
    width: 600, height: 180,
    content: `
      <rect width="600" height="180" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <text x="25" y="28" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">NETWORK_PING // LATENCY_TEST</text>
      <g transform="translate(30, 60)" font-size="11">
        <text x="0" y="15" fill="${COLORS.TEXT_SECONDARY}">PING github.com/codexanjan: 14ms [OK]</text>
        <text x="0" y="40" fill="${COLORS.TEXT_SECONDARY}">PING x.com/anjxnshetty: 18ms [OK]</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 168, 8, COLORS.CYAN, 1)}
    `
  });

  // DIVIDERS
  assets['assets/dividers/circuit-line.svg'] = svgWrap({
    width: 1200, height: 40,
    styles: `@keyframes circuitFlow { 0% { stroke-dashoffset: 400; } 100% { stroke-dashoffset: 0; } }`,
    content: `
      <rect width="1200" height="40" fill="${COLORS.BG_DARKEST}" />
      <path d="M 50 20 L 300 20 L 320 10 L 450 10 L 470 20 L 750 20 L 770 30 L 900 30 L 920 20 L 1150 20" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
      <path d="M 50 20 L 300 20 L 320 10 L 450 10 L 470 20 L 750 20 L 770 30 L 900 30 L 920 20 L 1150 20" fill="none" stroke="${COLORS.CYAN}" stroke-width="2" stroke-dasharray="80 320" style="animation: circuitFlow 4s linear infinite;" />
    `
  });

  assets['assets/dividers/packet-stream.svg'] = svgWrap({
    width: 1200, height: 30,
    content: `
      <rect width="1200" height="30" fill="${COLORS.BG_DARKEST}" />
      <line x1="50" y1="15" x2="1150" y2="15" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" stroke-dasharray="3 6"/>
      <circle cx="500" cy="15" r="3.5" fill="${COLORS.GREEN}"/>
    `
  });

  assets['assets/dividers/neural-link.svg'] = svgWrap({
    width: 1200, height: 36,
    content: `
      <rect width="1200" height="36" fill="${COLORS.BG_DARKEST}" />
      <g transform="translate(600, 18)" text-anchor="middle">
        <line x1="-500" y1="0" x2="500" y2="0" stroke="${COLORS.BORDER_CYAN}" stroke-width="1"/>
        <circle cx="0" cy="0" r="6" fill="${COLORS.GREEN}"/>
      </g>
    `
  });

  assets['assets/dividers/waveform-divider.svg'] = svgWrap({
    width: 1200, height: 36,
    content: `
      <rect width="1200" height="36" fill="${COLORS.BG_DARKEST}" />
      <path d="M 50 18 Q 150 6 250 18 T 450 18 T 650 18 T 850 18 T 1050 18 L 1150 18" fill="none" stroke="${COLORS.CYAN}" stroke-width="1.2" stroke-dasharray="6 6"/>
    `
  });

  assets['assets/dividers/hex-divider.svg'] = svgWrap({
    width: 1200, height: 36,
    content: `
      <rect width="1200" height="36" fill="${COLORS.BG_DARKEST}" />
      <g transform="translate(600, 18)"><polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1.5"/></g>
    `
  });

  assets['assets/dividers/node-divider.svg'] = svgWrap({
    width: 1200, height: 30,
    content: `
      <rect width="1200" height="30" fill="${COLORS.BG_DARKEST}" />
      <g transform="translate(600, 15)"><line x1="-540" y1="0" x2="540" y2="0" stroke="${COLORS.BORDER_CYAN}" stroke-width="0.8" /><circle cx="0" cy="0" r="3" fill="${COLORS.GREEN}" /></g>
    `
  });

  // BADGES
  const badgesList = [
    { file: 'system-online.svg', label: 'SYSTEM // ONLINE', color: COLORS.GREEN, state: 'ACTIVE' },
    { file: 'ai-core-active.svg', label: 'AI CORE // ACTIVE', color: COLORS.MAGENTA, state: 'READY' },
    { file: 'fullstack.svg', label: 'FULLSTACK // ENABLED', color: COLORS.CYAN, state: 'ONLINE' },
    { file: 'neural-link.svg', label: 'NEURAL LINK // CONNECTED', color: COLORS.BLUE, state: 'SYNC' },
    { file: 'build-active.svg', label: 'BUILD // ACTIVE', color: COLORS.GREEN, state: 'PASS' },
    { file: 'github-connected.svg', label: 'GITHUB // CONNECTED', color: COLORS.CYAN, state: 'LIVE' },
    { file: 'codex-node.svg', label: 'CODEX NODE // VERIFIED', color: COLORS.AMBER, state: 'ROOT' }
  ];

  badgesList.forEach(b => {
    assets[`assets/badges/${b.file}`] = svgWrap({
      width: 240, height: 36,
      content: `
        <polygon points="6,0 234,0 240,6 240,30 234,36 6,36 0,30 0,6" fill="${COLORS.BG_CARD}" stroke="${b.color}" stroke-width="1.2" />
        <circle cx="16" cy="18" r="4" fill="${b.color}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite"/></circle>
        <text x="30" y="22" fill="${COLORS.TEXT_PRIMARY}" font-size="10" font-weight="800" letter-spacing="1">${b.label}</text>
        <rect x="195" y="8" width="36" height="20" fill="${COLORS.BG_DARKEST}" stroke="${b.color}" stroke-width="0.8" rx="1"/>
        <text x="213" y="21" fill="${b.color}" font-size="8" font-weight="900" text-anchor="middle">${b.state}</text>
      `
    });
  });

  // FOOTER
  assets['assets/footer/terminal-footer.svg'] = svgWrap({
    width: 1200, height: 280,
    styles: `@keyframes cursorFlash { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`,
    content: `
      <rect width="1200" height="280" fill="${COLORS.BG_DARK}" />
      <text x="40" y="32" fill="${COLORS.CYAN}" font-size="11" font-weight="800" letter-spacing="2">TERMINAL_FOOTER // CODEX_SESSION_SHUTDOWN_INHIBIT</text>
      <text x="1160" y="32" fill="${COLORS.GREEN}" font-size="10" font-weight="700" text-anchor="end">SESSION: PERSISTENT ●</text>
      <line x1="40" y1="42" x2="1160" y2="42" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(600, 110)" text-anchor="middle">
        <text x="0" y="0" fill="${COLORS.CYAN}" font-size="28" font-weight="900" letter-spacing="8" filter="url(#glow-cyan)">CODEX://ANJAN</text>
        <text x="0" y="28" fill="${COLORS.TEXT_PRIMARY}" font-size="15" font-weight="800" letter-spacing="4">ANJAN SHETTY // @CODEXANJAN</text>
        <text x="0" y="52" fill="${COLORS.TEXT_SECONDARY}" font-size="10" letter-spacing="2">FULL-STACK DEVELOPER // AI-ML ENGINEER</text>
      </g>
      <g transform="translate(600, 195)" text-anchor="middle" font-size="10" font-weight="700">
        <text x="0" y="0" fill="${COLORS.TEXT_SECONDARY}">SESSION: <tspan fill="${COLORS.GREEN}">ONLINE</tspan> &nbsp;|&nbsp; GITHUB NODE: <tspan fill="${COLORS.CYAN}">CONNECTED</tspan> &nbsp;|&nbsp; BUILD PIPELINE: <tspan fill="${COLORS.GREEN}">ACTIVE</tspan></text>
        <text x="0" y="24" fill="${COLORS.TEXT_SECONDARY}" font-size="9" letter-spacing="1">THANK YOU FOR ACCESSING THE OPERATING SYSTEM NODE.</text>
      </g>
      <g transform="translate(600, 250)" text-anchor="middle">
        <rect x="-180" y="-18" width="360" height="28" fill="${COLORS.BG_CARD}" stroke="${COLORS.CYAN}" stroke-width="1" rx="2"/>
        <text x="-140" y="0" fill="${COLORS.CYAN}" font-size="11" font-weight="700" letter-spacing="2" text-anchor="start">&gt; awaiting_next_commit</text>
        <rect x="75" y="-12" width="8" height="14" fill="${COLORS.CYAN}" style="animation: cursorFlash 0.8s infinite;" />
      </g>
      ${cyberCornerBrackets(12, 12, 1176, 256, 14, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/footer/awaiting-next-commit.svg'] = svgWrap({
    width: 1200, height: 70,
    styles: `@keyframes cursorFlash2 { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`,
    content: `
      <rect width="1200" height="70" fill="${COLORS.BG_CARD}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
      <g transform="translate(40, 42)">
        <circle cx="10" cy="-4" r="4" fill="${COLORS.GREEN}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/></circle>
        <text x="25" y="0" fill="${COLORS.TEXT_PRIMARY}" font-size="11" font-weight="800" letter-spacing="2">SYSTEM ONLINE &nbsp;//&nbsp; NODE: CODEXANJAN</text>
        <text x="800" y="0" fill="${COLORS.CYAN}" font-size="12" font-weight="700" letter-spacing="2">&gt; awaiting_next_commit</text>
        <rect x="1025" y="-12" width="7" height="14" fill="${COLORS.CYAN}" style="animation: cursorFlash2 0.8s infinite;" />
      </g>
      ${cyberCornerBrackets(6, 6, 1188, 58, 8, COLORS.CYAN, 1)}
    `
  });

  assets['assets/footer/system-standby.svg'] = svgWrap({
    width: 600, height: 150,
    content: `
      <rect width="600" height="150" fill="${COLORS.BG_DARK}" stroke="${COLORS.BORDER_CYAN}" stroke-width="1" />
      <g transform="translate(300, 75)" text-anchor="middle">
        <circle cx="0" cy="-15" r="4" fill="${COLORS.AMBER}" />
        <text x="0" y="10" fill="${COLORS.AMBER}" font-size="12" font-weight="800" letter-spacing="2">SYSTEM STANDBY MODE // READY FOR SIGNAL</text>
      </g>
      ${cyberCornerBrackets(6, 6, 588, 138, 8, COLORS.AMBER, 1)}
    `
  });

  // BACKGROUNDS
  assets['assets/backgrounds/cyber-grid.svg'] = svgWrap({
    width: 1200, height: 400,
    content: `<rect width="1200" height="400" fill="${COLORS.BG_DARK}" /><rect width="1200" height="400" fill="url(#grid-pattern)" />`
  });

  assets['assets/backgrounds/circuit-grid.svg'] = svgWrap({
    width: 1200, height: 300,
    content: `<rect width="1200" height="300" fill="${COLORS.BG_MID}" /><path d="M 0 50 L 300 50 L 350 100 L 800 100 L 850 50 L 1200 50" fill="none" stroke="${COLORS.GRID_LINE}" stroke-width="1.2"/>`
  });

  assets['assets/backgrounds/terminal-grid.svg'] = svgWrap({
    width: 1200, height: 250,
    content: `<rect width="1200" height="250" fill="${COLORS.BG_DARKEST}" />`
  });

  assets['assets/backgrounds/snake-frame.svg'] = svgWrap({
    width: 1200, height: 260,
    content: `
      <rect width="1200" height="260" fill="none" stroke="${COLORS.BORDER_CYAN}" stroke-width="1.2" />
      <text x="35" y="28" fill="${COLORS.CYAN}" font-size="10" font-weight="800" letter-spacing="2">NETWORK_TRAFFIC://CONTRIBUTION_STREAM</text>
      <text x="1165" y="28" fill="${COLORS.GREEN}" font-size="9" font-weight="700" text-anchor="end">CYBERPUNK SNAKE MATRIX</text>
      ${cyberCornerBrackets(8, 8, 1184, 244, 12, COLORS.CYAN, 1.2)}
    `
  });

  assets['assets/backgrounds/neural-grid.svg'] = svgWrap({
    width: 1200, height: 300,
    content: `<rect width="1200" height="300" fill="${COLORS.BG_DARK}" />`
  });

  // SNAKE
  assets['dist/github-contribution-grid-snake-dark.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 160" width="100%" height="160">
    <rect width="850" height="160" fill="#04070D" rx="4" stroke="rgba(0, 245, 255, 0.25)" stroke-width="1.2"/>
    <text x="25" y="24" fill="#00F5FF" font-size="10" font-weight="800" letter-spacing="2">NETWORK_TRAFFIC://CONTRIBUTION_STREAM // CYBERPUNK_SNAKE</text>
    <text x="825" y="24" fill="#39FF88" font-size="9" text-anchor="end" font-weight="700">NODE://CODEXANJAN</text>
    <line x1="25" y1="34" x2="825" y2="34" stroke="rgba(0, 245, 255, 0.15)" stroke-width="1" />
    <path d="M 40 70 Q 150 40 260 80 T 480 60 T 700 90 L 780 70" fill="none" stroke="#00F5FF" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <circle cx="780" cy="70" r="5" fill="#39FF88"/>
  </svg>`;

  return assets;
}

// -------------------------------------------------------------
// MASTER README CONTENT
// -------------------------------------------------------------

function getReadme() {
  return `<div align="center">

<!-- 00 // POWER ON BOOT SEQUENCE -->
<img src="assets/boot/power-on.svg" alt="CODEX Boot Power On" width="100%" />

<br/><br/>

<img src="assets/boot/boot-sequence.svg" alt="CODEX BIOS v6.0 Boot Sequence" width="100%" />

<br/>

<!-- 01 // IDENTITY DECRYPTION -->
<img src="assets/reveal/encrypted-identity.svg" alt="Neural Decryption Protocol" width="100%" />

<br/><br/>

<!-- SIGNATURE ARTWORK: NAME REVELATION -->
<img src="assets/reveal/name-revelation.svg" alt="ANJAN SHETTY // Identity Revealed" width="100%" />

<br/><br/>

<!-- GITHUB NODE REVELATION -->
<img src="assets/reveal/github-revelation.svg" alt="GitHub Node Found @codexanjan" width="100%" />

<br/>

<!-- DEVELOPER CLASSIFICATION -->
<img src="assets/reveal/developer-classification.svg" alt="Developer Classification" width="100%" />

<br/>

<!-- INTERFACE UNLOCK -->
<img src="assets/reveal/interface-unlock.svg" alt="Interface Unlock Protocol" width="100%" />

<br/>

<!-- MAIN CYBER HERO -->
<img src="assets/hero/cyber-hero.svg" alt="CODEX://ANJAN Developer Operating System" width="100%" />

<br/>

<!-- REALTIME SYSTEM STRIP -->
<img src="assets/telemetry/system-strip.svg" alt="System Status Strip" width="100%" />

<br/><br/>

<!-- ================================================================= -->
<!-- 01 // IDENTITY & OPERATOR PROFILE -->
<!-- ================================================================= -->
<img src="assets/headers/01-identity.svg" alt="01 // IDENTITY" width="100%" />

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/profile/digital-id.svg" alt="Operator Digital ID" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/profile/system-profile.svg" alt="System Profile" width="100%" />
    </td>
  </tr>
</table>

<br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/core/cyber-core.svg" alt="AS Cyber Core Reactor" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/core/ai-reactor.svg" alt="AI Reactor Core" width="100%" />
    </td>
  </tr>
</table>

<br/>
<img src="assets/dividers/circuit-line.svg" alt="Circuit Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 03 // TECH ARSENAL & NEURAL TOPOLOGY -->
<!-- ================================================================= -->
<img src="assets/headers/03-tech-arsenal.svg" alt="03 // TECH_ARSENAL" width="100%" />

<img src="assets/tech/tech-constellation.svg" alt="Tech Constellation Mesh Network" width="100%" />

<br/><br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/tech/neural-tech-orbit.svg" alt="Neural Tech Orbit" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/tech/stack-reactor.svg" alt="Full-Stack Pipeline Reactor" width="100%" />
    </td>
  </tr>
</table>

<br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/process/engineering-loop.svg" alt="Engineering Loop: Ship Learn Evolve" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/projects/project-radar.svg" alt="Project Satellite Radar" width="100%" />
    </td>
  </tr>
</table>

<br/>
<img src="assets/dividers/packet-stream.svg" alt="Packet Stream Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 04 // PROJECT MATRIX & DEPLOYED SYSTEMS -->
<!-- ================================================================= -->
<img src="assets/headers/04-project-matrix.svg" alt="04 // PROJECT_MATRIX" width="100%" />

<img src="assets/projects/project-console.svg" alt="Deployed Systems Console" width="100%" />

<br/>
<img src="assets/process/idea-to-deploy.svg" alt="Idea to Production Pipeline" width="100%" />

<br/>
<img src="assets/dividers/waveform-divider.svg" alt="Waveform Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 05 // GITHUB INTELLIGENCE & TELEMETRY -->
<!-- ================================================================= -->
<img src="assets/headers/05-github-intelligence.svg" alt="05 // GITHUB_INTELLIGENCE" width="100%" />

<img src="assets/github/github-scanner.svg" alt="GitHub Data Scanner" width="100%" />

<br/><br/>

<img src="assets/github/github-telemetry.svg" alt="Live GitHub Telemetry" width="100%" />

<br/>
<img src="assets/dividers/circuit-line.svg" alt="Circuit Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 06 // REPOSITORY NETWORK -->
<!-- ================================================================= -->
<img src="assets/headers/06-repository-network.svg" alt="06 // REPOSITORY_NETWORK" width="100%" />

<img src="assets/github/top-repositories.svg" alt="Top Repositories by Commits" width="100%" />

<br/><br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/github/repository-radar.svg" alt="Repository Network Radar" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/github/activity-stream.svg" alt="Realtime Activity Stream" width="100%" />
    </td>
  </tr>
</table>

<br/>
<img src="assets/dividers/hex-divider.svg" alt="Hex Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 07 // LANGUAGE MATRIX -->
<!-- ================================================================= -->
<img src="assets/headers/07-language-matrix.svg" alt="07 // LANGUAGE_MATRIX" width="100%" />

<img src="assets/languages/language-matrix.svg" alt="Language Byte Distribution Matrix" width="100%" />

<br/><br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/languages/language-radar.svg" alt="Language Polar Radar" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/languages/language-core.svg" alt="Language Core Runtime" width="100%" />
    </td>
  </tr>
</table>

<br/>

<img src="assets/languages/language-spectrum.svg" alt="Continuous Language Spectrum" width="100%" />

<br/>
<img src="assets/dividers/neural-link.svg" alt="Neural Link Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 08 // CONTRIBUTION INTELLIGENCE -->
<!-- ================================================================= -->
<img src="assets/headers/08-contribution-intelligence.svg" alt="08 // CONTRIBUTION_INTELLIGENCE" width="100%" />

<img src="assets/contributions/contribution-intelligence.svg" alt="Contribution Network Intelligence" width="100%" />

<br/><br/>

<img src="assets/contributions/commit-wave.svg" alt="Commit Signal Neon ECG Waveform" width="100%" />

<br/><br/>

<table border="0" width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/contributions/contribution-signal.svg" alt="Contribution Signal Channels" width="100%" />
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/contributions/contribution-peaks.svg" alt="Contribution Peak Telemetry" width="100%" />
    </td>
  </tr>
</table>

<br/>

<!-- 365D CONTRIBUTION STREAM FRAME & SNAKE -->
<img src="assets/backgrounds/snake-frame.svg" alt="Network Traffic Header" width="100%" />
<br/>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="dist/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="dist/github-contribution-grid-snake-dark.svg">
  <img alt="GitHub Contribution Snake Animation" src="dist/github-contribution-grid-snake-dark.svg" width="100%" />
</picture>

<br/>
<img src="assets/dividers/node-divider.svg" alt="Node Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 09 // CERTIFICATIONS -->
<!-- ================================================================= -->
<img src="assets/headers/09-certifications.svg" alt="09 // CERTIFICATIONS" width="100%" />

<img src="assets/certificates/certification-grid.svg" alt="Certified Credentials Matrix" width="100%" />

<br/>
<img src="assets/dividers/circuit-line.svg" alt="Circuit Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 10 // ACHIEVEMENTS & MISSION LOGS -->
<!-- ================================================================= -->
<img src="assets/headers/10-achievements.svg" alt="10 // ACHIEVEMENTS" width="100%" />

<img src="assets/achievements/achievement-timeline.svg" alt="Achievement Mission Timeline" width="100%" />

<br/>
<img src="assets/dividers/hex-divider.svg" alt="Hex Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 11 // ACTIVE MISSIONS -->
<!-- ================================================================= -->
<img src="assets/headers/11-active-missions.svg" alt="11 // ACTIVE_MISSIONS" width="100%" />

<img src="assets/missions/mission-board.svg" alt="Strategic Mission Objectives" width="100%" />

<br/>
<img src="assets/missions/mission-progress.svg" alt="State-Based Pipeline Execution" width="100%" />

<br/>
<img src="assets/dividers/packet-stream.svg" alt="Packet Stream Divider" width="100%" />
<br/><br/>

<!-- ================================================================= -->
<!-- 12 // CONNECTION PORT & SECURE CHANNEL -->
<!-- ================================================================= -->
<img src="assets/headers/12-connection-port.svg" alt="12 // CONNECTION_PORT" width="100%" />

<img src="assets/contact/connection-terminal.svg" alt="Secure Connection Terminal" width="100%" />

<br/><br/>

<img src="assets/contact/secure-channel.svg" alt="Ready for Collaboration" width="100%" />

<br/><br/>

<!-- CYBERPUNK STATUS BADGES -->
<p align="center">
  <img src="assets/badges/system-online.svg" alt="System Online" height="32" />
  &nbsp;
  <img src="assets/badges/fullstack.svg" alt="Fullstack Enabled" height="32" />
  &nbsp;
  <img src="assets/badges/ai-core-active.svg" alt="AI Core Active" height="32" />
  &nbsp;
  <img src="assets/badges/build-active.svg" alt="Build Active" height="32" />
  &nbsp;
  <img src="assets/badges/github-connected.svg" alt="GitHub Connected" height="32" />
</p>

<br/>

<!-- ================================================================= -->
<!-- TERMINAL FOOTER & STANDBY -->
<!-- ================================================================= -->
<img src="assets/footer/terminal-footer.svg" alt="CODEX://ANJAN Terminal Footer" width="100%" />

<br/>

<img src="assets/footer/awaiting-next-commit.svg" alt="System Online - Awaiting Next Commit" width="100%" />

</div>`;
}

// -------------------------------------------------------------
// WORKFLOWS & CONFIGS
// -------------------------------------------------------------

function getWorkflows() {
  return {
    '.github/workflows/update-profile.yml': `name: Update Profile Telemetry

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  telemetry-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Regenerate Assets
        run: node build-system.js --skip-git

      - name: Commit & Push Changes
        run: |
          git config --global user.name "codex-bot[bot]"
          git config --global user.email "codex-bot@users.noreply.github.com"
          git add assets/
          if git diff --staged --quiet; then
            echo "No telemetry changes detected."
          else
            git commit -m "chore(telemetry): sync live codex metrics [skip ci]"
            git push
          fi
`,
    '.github/workflows/snake.yml': `name: Generate Contribution Snake

on:
  schedule:
    - cron: '30 0 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate-snake:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Generate Contribution Grid Snake
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: codexanjan
          outputs: |
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark&color_snake=#00F5FF&color_dots=#020408,#04070D,#3A86FF,#FF2BD6,#00F5FF

      - name: Push Snake Asset to Dist Branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
    '.gitignore': `node_modules/\n.DS_Store\nThumbs.db\n*.log\n`,
    'package.json': JSON.stringify({
      name: "codexanjan-os",
      version: "1.0.0",
      description: "CODEX://ANJAN Cyberpunk Developer Operating System for GitHub Profile",
      scripts: {
        "build": "node build-system.js --skip-git",
        "push": "node build-system.js"
      },
      author: "Anjan Shetty (@codexanjan)",
      license: "MIT"
    }, null, 2)
  };
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------

function run() {
  console.log('[CODEX://BUILD] Starting synchronized multi-target generation...');
  const assets = getAssets();
  const readme = getReadme();
  const workflows = getWorkflows();

  for (const baseDir of TARGET_DIRS) {
    console.log(`[TARGET] Writing to: ${baseDir}`);
    fs.mkdirSync(baseDir, { recursive: true });

    // Write all SVG assets
    for (const [relPath, content] of Object.entries(assets)) {
      const fullPath = path.join(baseDir, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    }

    // Write README
    fs.writeFileSync(path.join(baseDir, 'README.md'), readme.trim() + '\n', 'utf8');

    // Write workflows & configs
    for (const [relPath, content] of Object.entries(workflows)) {
      const fullPath = path.join(baseDir, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    }

    // Also copy build-system.js itself into baseDir so CI or local user can rebuild
    const selfPath = path.join(baseDir, 'build-system.js');
    if (__filename !== selfPath) {
      fs.copyFileSync(__filename, selfPath);
    }
  }

  console.log('[SUCCESS] All files written to both readme 1 and codexanjan repositories!');

  if (process.argv.includes('--skip-git')) {
    console.log('[GIT] Skipping git commit and push as requested.');
    return;
  }

  // Perform Git Commit and Push in C:/Users/anjan/OneDrive/Documents/codexanjan
  const repoDir = 'C:/Users/anjan/OneDrive/Documents/codexanjan';
  console.log(`[GIT] Committing and pushing from: ${repoDir}`);

  try {
    execSync('git add -A', { cwd: repoDir, stdio: 'inherit' });
    try {
      execSync('git commit -m "feat: launch CODEX://ANJAN cyberpunk developer operating system"', { cwd: repoDir, stdio: 'inherit' });
    } catch (commitErr) {
      console.log('[GIT] No commit needed or changes already staged.');
    }
    console.log('[GIT] Pushing to origin main...');
    execSync('git push origin main', { cwd: repoDir, stdio: 'inherit' });
    console.log('[SUCCESS] SUCCESSFULLY PUSHED TO https://github.com/codexanjan/codexanjan!');
  } catch (err) {
    console.error('[GIT ERROR]', err.message);
    process.exit(1);
  }
}

run();
