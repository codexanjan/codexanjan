const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

async function fetchGitHubData(username, token) {
  const query = JSON.stringify({
    query: `
      query userInfo($login: String!) {
        user(login: $login) {
          pullRequests(first: 1) { totalCount }
          issues(first: 1) { totalCount }
          repositoriesContributedTo(first: 1) { totalCount }
          repositories(first: 100, ownerAffiliations: OWNER) {
            nodes { stargazerCount }
          }
          contributionsCollection {
            totalCommitContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                  weekday
                }
              }
            }
          }
        }
      }
    `,
    variables: { login: username }
  });

  return new Promise((resolve, reject) => {
    // If running locally and token not in env, try gh auth token
    let authHeader = token ? `Bearer ${token}` : "";
    if (!authHeader) {
      try {
        const ghToken = execSync("gh auth token", { stdio: ["pipe", "pipe", "ignore"] }).toString().trim();
        if (ghToken) authHeader = `Bearer ${ghToken}`;
      } catch (e) {
        // ignore
      }
    }

    if (!authHeader) {
      console.log("No GitHub token available, skipping remote fetch.");
      resolve(null);
      return;
    }

    const req = https.request(
      {
        hostname: "api.github.com",
        path: "/graphql",
        method: "POST",
        headers: {
          "User-Agent": "codexanjan-updater",
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(query)
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.errors) {
              console.error("GraphQL errors:", parsed.errors);
              resolve(null);
            } else {
              resolve(parsed.data?.user || null);
            }
          } catch (err) {
            console.error("JSON parse error:", err);
            resolve(null);
          }
        });
      }
    );

    req.on("error", (e) => {
      console.error("Request error:", e);
      resolve(null);
    });

    req.write(query);
    req.end();
  });
}

function generateContributionGridSvg(calendarData) {
  const totalContributions = calendarData?.totalContributions || 234;
  const weeks = calendarData?.weeks || [];

  const gridStartX = 168;
  const gridStartY = 166;
  const tileW = 9.2;
  const tileH = 9.2;
  const pitchX = 11.8;
  const pitchY = 12.0;

  let tilesXml = "";
  const emberPoints = [];

  const levelMap = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4
  };

  // If weeks are provided, use exactly 53 weeks
  // Each week has contributionDays (Sunday=0 to Saturday=6)
  // We map Monday=0 .. Sunday=6 to display cleanly
  const numWeeks = Math.min(weeks.length, 53);

  for (let c = 0; c < numWeeks; c++) {
    const week = weeks[c];
    const x = (gridStartX + c * pitchX).toFixed(1);

    // Days in week
    const days = week.contributionDays || [];
    for (const day of days) {
      const d = new Date(day.date + "T00:00:00Z");
      const dayOfWeek = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      const row = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0 .. Sun=6
      const y = (gridStartY + row * pitchY).toFixed(1);

      let lvl = 0;
      if (typeof day.contributionLevel === "string") {
        lvl = levelMap[day.contributionLevel] ?? 0;
      } else if (typeof day.contributionLevel === "number") {
        lvl = day.contributionLevel;
      } else if (day.contributionCount > 0) {
        if (day.contributionCount >= 20) lvl = 4;
        else if (day.contributionCount >= 10) lvl = 3;
        else if (day.contributionCount >= 5) lvl = 2;
        else lvl = 1;
      }

      let fill = "#101520";
      let stroke = "#1A2232";
      let filter = "";
      let cls = "";

      if (lvl === 1) {
        fill = "#7C1A22";
        stroke = "#B91C1C";
        cls = 'class="cell-ember"';
        emberPoints.push({ x: (parseFloat(x) + 4.6).toFixed(1), y: (parseFloat(y) + 4.6).toFixed(1), color: "#FF4500" });
      } else if (lvl === 2) {
        fill = "#B91C1C";
        stroke = "#EF4444";
        filter = 'filter="url(#shdEmberGlow)"';
        cls = 'class="cell-ember"';
        emberPoints.push({ x: (parseFloat(x) + 4.6).toFixed(1), y: (parseFloat(y) + 4.6).toFixed(1), color: "#FF6D00" });
      } else if (lvl === 3) {
        fill = "#EA580C";
        stroke = "#FB923C";
        filter = 'filter="url(#shdEmberGlow)"';
        cls = 'class="cell-overdrive"';
        emberPoints.push({ x: (parseFloat(x) + 4.6).toFixed(1), y: (parseFloat(y) + 4.6).toFixed(1), color: "#FFA500" });
      } else if (lvl >= 4) {
        fill = "#F59E0B";
        stroke = "#FDE047";
        filter = 'filter="url(#shdSolarGlow)"';
        cls = 'class="cell-overdrive"';
        emberPoints.push({ x: (parseFloat(x) + 4.6).toFixed(1), y: (parseFloat(y) + 4.6).toFixed(1), color: "#FFE082" });
      }

      tilesXml += `    <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="0.85" ${filter} ${cls} />\n`;
    }
  }

  // Month labels (OCT to SEP)
  const monthNames = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
  let monthsXml = "";
  for (let i = 0; i < 12; i++) {
    const colIdx = Math.round(i * (numWeeks / 12));
    const mx = (gridStartX + colIdx * pitchX).toFixed(1);
    monthsXml += `    <text x="${mx}" y="${gridStartY - 12}" font-size="8.5" font-weight="800" fill="#8892B0" font-family="'Courier New', Consolas, monospace" letter-spacing="1">${monthNames[i]}</text>\n`;
  }

  // Ember circles XML
  let embersXml = "";
  const sampledEmbers = emberPoints.slice(0, 36);
  sampledEmbers.forEach((pt, idx) => {
    const animClass = `ember-p${(idx % 3) + 1}`;
    embersXml += `    <circle cx="${pt.x}" cy="${pt.y}" r="${idx % 4 === 0 ? 2.5 : 1.6}" class="${animClass}" fill="${pt.color}" opacity="0.9" filter="url(#shdEmberGlow)" />\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- Background Gradient: Obsidian Carbon with Crimson Depth -->
    <linearGradient id="shdPatrolBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06080D" />
      <stop offset="35%" stop-color="#040507" />
      <stop offset="70%" stop-color="#0B0609" />
      <stop offset="100%" stop-color="#0A0C12" />
    </linearGradient>

    <!-- Glowing Katana Energy Slash Gradient -->
    <linearGradient id="shdSlashLaser" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF3038" stop-opacity="0" />
      <stop offset="25%" stop-color="#FF4500" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#FFF" stop-opacity="1" />
      <stop offset="75%" stop-color="#55E6FF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FF3038" stop-opacity="0" />
    </linearGradient>

    <!-- Center Radiant Combat Aura -->
    <radialGradient id="shdCenterCombatAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF3038" stop-opacity="0.32" />
      <stop offset="45%" stop-color="#FF4500" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#000" stop-opacity="0" />
    </radialGradient>

    <!-- Glowing VS Text Gradient -->
    <linearGradient id="vsTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF3038" />
      <stop offset="50%" stop-color="#FF6B00" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>

    <!-- Shadow Warrior Highlight Aura Gradient (Left) -->
    <radialGradient id="shadowHighlightAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F5D4" stop-opacity="0.5" />
      <stop offset="40%" stop-color="#00B4D8" stop-opacity="0.28" />
      <stop offset="75%" stop-color="#003566" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000" stop-opacity="0" />
    </radialGradient>

    <!-- Titan Demon Highlight Aura Gradient (Right) -->
    <radialGradient id="titanHighlightAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF003C" stop-opacity="0.5" />
      <stop offset="40%" stop-color="#FF5722" stop-opacity="0.28" />
      <stop offset="75%" stop-color="#5A1208" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000" stop-opacity="0" />
    </radialGradient>

    <!-- Katana Blade Glow Gradient -->
    <linearGradient id="katanaBladeGlow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F5D4" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#55E6FF" />
    </linearGradient>

    <!-- Titan Desolator Blade Gradient -->
    <linearGradient id="desolatorBladeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF003C" />
      <stop offset="50%" stop-color="#FF8C00" />
      <stop offset="100%" stop-color="#FFE600" />
    </linearGradient>

    <!-- Health Bar Gradients -->
    <linearGradient id="shadowHpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F5D4" />
      <stop offset="60%" stop-color="#00BBF9" />
      <stop offset="100%" stop-color="#55E6FF" />
    </linearGradient>

    <linearGradient id="titanHpGrad" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#FF3038" />
      <stop offset="50%" stop-color="#FF5722" />
      <stop offset="100%" stop-color="#FF8C00" />
    </linearGradient>

    <linearGradient id="shadowEnergyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7928CA" />
      <stop offset="50%" stop-color="#B800FF" />
      <stop offset="100%" stop-color="#00DFD8" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="shdEmberGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="shdSolarGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3.8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="laserBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="cyanHeroGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="titanFlameGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4.0" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="vsProminentGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5.0" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- Keyframe Animations -->
    <style>
      @keyframes slashLaserMove {
        0% { transform: translateX(-960px); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateX(960px); opacity: 0; }
      }
      @keyframes emberFloat1 {
        0% { transform: translateY(0px) scale(1); opacity: 0.8; }
        50% { transform: translateY(-7px) scale(1.3); opacity: 1; }
        100% { transform: translateY(-14px) scale(0.6); opacity: 0; }
      }
      @keyframes emberFloat2 {
        0% { transform: translateY(0px) scale(0.9); opacity: 0.7; }
        50% { transform: translateY(-9px) scale(1.4); opacity: 1; }
        100% { transform: translateY(-18px) scale(0.5); opacity: 0; }
      }
      @keyframes emberFloat3 {
        0% { transform: translateY(0px) scale(1); opacity: 0.9; }
        50% { transform: translateY(-8px) scale(1.2); opacity: 1; }
        100% { transform: translateY(-16px) scale(0.7); opacity: 0; }
      }
      @keyframes katanaPulse {
        0%, 100% { filter: drop-shadow(0 0 3px #00F5D4); opacity: 0.95; }
        50% { filter: drop-shadow(0 0 8px #55E6FF) drop-shadow(0 0 14px #00F5D4); opacity: 1; }
      }
      @keyframes titanAuraPulse {
        0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px #FF3038); }
        50% { opacity: 1; filter: drop-shadow(0 0 10px #FF5722) drop-shadow(0 0 18px #FF003C); }
      }
      @keyframes cellGlowPulse {
        0%, 100% { opacity: 0.88; }
        50% { opacity: 1; filter: drop-shadow(0 0 5px #F59E0B); }
      }
      @keyframes bgVsPulseProminent {
        0%, 100% { opacity: 0.78; transform: scale(1); }
        50% { opacity: 0.95; transform: scale(1.035); }
      }
      @keyframes outerLaserPerimeter {
        0% { stroke-dashoffset: 2760; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes beaconBlink {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes katanaShine {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; }
      }
      @keyframes desolatorShine {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; }
      }

      .slash-laser-line {
        animation: slashLaserMove 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .ember-p1 {
        animation: emberFloat1 2.2s ease-in infinite;
      }
      .ember-p2 {
        animation: emberFloat2 2.7s ease-in infinite 0.7s;
      }
      .ember-p3 {
        animation: emberFloat3 2.5s ease-in infinite 1.3s;
      }
      .hero-shadow-highlight {
        animation: katanaPulse 2.8s ease-in-out infinite;
      }
      .boss-titan-highlight {
        animation: titanAuraPulse 3.2s ease-in-out infinite;
      }
      .cell-overdrive {
        animation: cellGlowPulse 2.6s ease-in-out infinite;
      }
      .shd-outer-laser {
        stroke-dasharray: 120 400;
        animation: outerLaserPerimeter 8s linear infinite;
      }
      .beacon-active {
        animation: beaconBlink 1.4s ease-in-out infinite;
      }
      .katana-shine {
        animation: katanaShine 2.2s ease-in-out infinite;
      }
      .desolator-shine {
        animation: desolatorShine 2.5s ease-in-out infinite 0.6s;
      }
      .center-bg-vs-prominent {
        transform-origin: 480px 212px;
        animation: bgVsPulseProminent 3.5s ease-in-out infinite;
      }
    </style>
  </defs>

  <!-- Container Base Plate -->
  <rect width="960" height="420" rx="12" fill="url(#shdPatrolBg)" stroke="#161B25" stroke-width="1.6" />
  
  <!-- Outer Perimeter Animated Laser Trace -->
  <rect width="960" height="420" rx="12" fill="none" stroke="#FF4500" stroke-width="2" class="shd-outer-laser" opacity="0.9" />

  <!-- Tactical Corner Plasma Brackets -->
  <polygon points="12,12 36,12 12,36" fill="#FF4500" />
  <polygon points="948,12 924,12 948,36" fill="#FF4500" />
  <polygon points="12,408 36,408 12,384" fill="#FF4500" />
  <polygon points="948,408 924,408 948,384" fill="#FF4500" />

  <!-- Ambient Radiant Combat Glow Behind Center Grid -->
  <ellipse cx="480" cy="212" rx="340" ry="120" fill="url(#shdCenterCombatAura)" />

  <!-- ======================================================== -->
  <!-- BOLD, PROMINENT GLOWING "VS" LOGO BEHIND MIDDLE GRID     -->
  <!-- ======================================================== -->
  <g class="center-bg-vs-prominent" filter="url(#vsProminentGlow)">
    <!-- Radiant Combat Emblem Rings -->
    <circle cx="480" cy="212" r="120" fill="#0C0E16" fill-opacity="0.4" stroke="#FF3038" stroke-width="2.5" stroke-dasharray="8 6" />
    <circle cx="480" cy="212" r="92" fill="none" stroke="#FF5722" stroke-width="2" />
    <polygon points="480,95 585,155 585,269 480,329 375,269 375,155" fill="none" stroke="#FF3038" stroke-width="2" opacity="0.7" />

    <!-- Dual Crossed Katana Energy Blades (Prominent!) -->
    <line x1="360" y1="102" x2="600" y2="322" stroke="#FF4500" stroke-width="4.5" stroke-linecap="round" />
    <line x1="360" y1="102" x2="600" y2="322" stroke="#FFF" stroke-width="1.8" stroke-linecap="round" />
    <line x1="600" y1="102" x2="360" y2="322" stroke="#FF4500" stroke-width="4.5" stroke-linecap="round" />
    <line x1="600" y1="102" x2="360" y2="322" stroke="#FFF" stroke-width="1.8" stroke-linecap="round" />

    <!-- PROMINENT BOLD "VS" LOGO (Clearly visible through & around the grid!) -->
    <text x="480" y="254" text-anchor="middle" font-family="system-ui, -apple-system, 'Impact', sans-serif" font-size="120" font-weight="900" fill="url(#vsTextGrad)" stroke="#FF003C" stroke-width="2.5" letter-spacing="4">VS</text>
    <text x="480" y="142" text-anchor="middle" font-family="'Courier New', Consolas, monospace" font-size="11.5" font-weight="900" fill="#FFD700" letter-spacing="2">影の戦い // SHADOW FIGHT</text>
    <text x="480" y="292" text-anchor="middle" font-family="'Courier New', Consolas, monospace" font-size="9.5" font-weight="800" fill="#00F5D4" letter-spacing="1.5">ANNUAL CADENCE DUEL</text>
  </g>

  <!-- ======================================================== -->
  <!-- 01 // TOP TELEMETRY PROTOCOL HEADER (PERFECTLY VISIBLE)  -->
  <!-- ======================================================== -->
  <g transform="translate(38, 26)" font-family="'Courier New', Consolas, monospace">
    <!-- Red Indicator Triangle -->
    <polygon points="0,-4 8,-4 4,4" fill="#FF4500" />
    <text x="14" y="2" font-size="10.5" font-weight="900" fill="#FF4500" letter-spacing="1.5">影の戦い // SHADOW FIGHT PROTOCOL // ANNUAL COMBAT CADENCE</text>

    <!-- Status Beacon & Confirmed Lethal Strikes -->
    <circle cx="585" cy="-1" r="3.5" fill="#42FF9E" class="beacon-active" />
    <text x="884" y="2" text-anchor="end" font-size="9.5" font-weight="800" fill="#FFD700" letter-spacing="1.2">${totalContributions} CONFIRMED LETHAL STRIKES // OVERDRIVE</text>
    
    <line x1="0" y1="12" x2="884" y2="12" stroke="#1A202C" stroke-width="1.2" />
  </g>

  <!-- ======================================================== -->
  <!-- 02 // DUAL COMBAT HUD (CLEAN, ZERO CLIPPING)             -->
  <!-- ======================================================== -->
  <g transform="translate(38, 52)">
    <!-- LEFT: SHADOW FIGHTER HUD -->
    <g transform="translate(0, 0)" font-family="'Courier New', Consolas, monospace">
      <text x="0" y="10" font-size="11" font-weight="900" fill="#00F5D4" letter-spacing="1">影 // SHADOW</text>
      <text x="106" y="10" font-size="8.5" font-weight="700" fill="#8892B0">[DAN X MASTER]</text>
      <text x="390" y="10" text-anchor="end" font-size="9.5" font-weight="900" fill="#00F5D4">100% HP</text>

      <!-- Health Bar Container -->
      <rect x="0" y="15" width="390" height="12" rx="2" fill="#0C1018" stroke="#1E2838" stroke-width="1" />
      <rect x="2" y="17" width="386" height="8" rx="1.5" fill="url(#shadowHpGrad)" />

      <!-- Shadow Energy Meter (Full & Ready!) -->
      <text x="0" y="36" font-size="8" font-weight="800" fill="#B800FF" letter-spacing="1">SHADOW ENERGY: CHARGED ⚡</text>
      <rect x="155" y="29" width="235" height="7" rx="1.5" fill="#120A1E" stroke="#3A1C5A" stroke-width="0.8" />
      <rect x="156" y="30" width="233" height="5" rx="1" fill="url(#shadowEnergyGrad)" />
    </g>

    <!-- RIGHT: TITAN DEMON BOSS HUD -->
    <g transform="translate(494, 0)" font-family="'Courier New', Consolas, monospace">
      <text x="0" y="10" font-size="9.5" font-weight="900" fill="#FF5722">BOSS HP: ${totalContributions}/250</text>
      <text x="278" y="10" text-anchor="end" font-size="8.5" font-weight="700" fill="#8892B0">[DEMON OVERLORD]</text>
      <text x="390" y="10" text-anchor="end" font-size="11" font-weight="900" fill="#FF3038" letter-spacing="1">タイタン // TITAN</text>

      <!-- Health Bar Container -->
      <rect x="0" y="15" width="390" height="12" rx="2" fill="#0C1018" stroke="#1E2838" stroke-width="1" />
      <rect x="25" y="17" width="363" height="8" rx="1.5" fill="url(#titanHpGrad)" />

      <!-- Titan Desolator Charge -->
      <text x="0" y="36" font-size="8" font-weight="800" fill="#FF8C00" letter-spacing="1">DESOLATOR OVERDRIVE: 92%</text>
      <rect x="155" y="29" width="235" height="7" rx="1.5" fill="#1A0C08" stroke="#5A2412" stroke-width="0.8" />
      <rect x="156" y="30" width="215" height="5" rx="1" fill="#FF5722" />
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 03 // LEFT FIGHTER: SHADOW (HIGHLIGHTED HEROIC OPERATIVE) -->
  <!-- ======================================================== -->
  <g id="shadowHeroGroup" class="hero-shadow-highlight">
    <!-- Radiant Cyan Hero Aura Backlight -->
    <ellipse cx="85" cy="235" rx="65" ry="92" fill="url(#shadowHighlightAura)" />

    <!-- Ground Platform Ring & Cyan Chakra Glyphs -->
    <ellipse cx="85" cy="318" rx="55" ry="9" fill="#000" opacity="0.7" />
    <ellipse cx="85" cy="318" rx="46" ry="6" fill="#00F5D4" opacity="0.3" filter="url(#cyanHeroGlow)" />
    <circle cx="85" cy="318" r="30" fill="none" stroke="#00F5D4" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.65" />

    <!-- Energy Ripples at Feet -->
    <path d="M 45,316 Q 85,326 125,316" fill="none" stroke="#55E6FF" stroke-width="1.6" opacity="0.8" />

    <!-- HIGHLIGHTED SHADOW SILHOUETTE BODY -->
    <!-- Head & Flowing Cyber Ninja Headband -->
    <ellipse cx="82" cy="155" rx="15" ry="17" fill="#03070B" stroke="#00F5D4" stroke-width="1.6" filter="url(#cyanHeroGlow)" />
    <!-- Ninja Cowl Shadow Overlay -->
    <path d="M 68,155 C 68,142 96,142 96,155 C 96,168 68,168 68,155 Z" fill="#060C14" />
    
    <!-- FIERCE GLOWING CYAN VISOR / EYES -->
    <polygon points="76,152 92,151 91,156 75,157" fill="#00F5D4" filter="url(#cyanHeroGlow)" />
    <polygon points="78,152 90,151 89,155 77,156" fill="#FFFFFF" />

    <!-- Flowing Red Ninja Headband Tails (Windblown) -->
    <path d="M 69,152 C 55,145 42,150 30,146 C 40,154 52,156 68,156 Z" fill="#FF3038" filter="url(#shdEmberGlow)" />
    <path d="M 68,154 C 52,155 40,165 26,162 C 38,168 54,166 67,158 Z" fill="#FF5722" />

    <!-- Muscular Martial Torso & Cyber Gi Plate -->
    <path d="M 72,172 L 95,172 L 102,198 L 94,228 L 74,228 L 67,198 Z" fill="#03070B" stroke="#00F5D4" stroke-width="1.5" />
    <!-- Gi Lapels Crossed -->
    <line x1="72" y1="172" x2="88" y2="210" stroke="#00F5D4" stroke-width="1.2" opacity="0.8" />
    <line x1="95" y1="172" x2="78" y2="210" stroke="#00F5D4" stroke-width="1.2" opacity="0.8" />
    
    <!-- Red Martial Sash / Belt -->
    <rect x="73" y="222" width="22" height="7" rx="1.5" fill="#FF3038" stroke="#FF5722" stroke-width="0.8" />
    <path d="M 81,229 L 78,252 L 85,252 L 87,229 Z" fill="#FF3038" />

    <!-- Left Arm & Katana Grip (Two-Handed Kenjutsu Stance) -->
    <!-- Rear Arm -->
    <path d="M 70,178 L 54,196 L 62,204 L 74,188 Z" fill="#03070B" stroke="#00F5D4" stroke-width="1.2" />
    <!-- Forearm extending to hilt -->
    <path d="M 54,196 L 78,206 L 82,198 L 60,190 Z" fill="#040A12" stroke="#00F5D4" stroke-width="1.2" />

    <!-- Front Arm (Driving Blade) -->
    <path d="M 96,178 L 118,194 L 112,202 L 92,188 Z" fill="#03070B" stroke="#00F5D4" stroke-width="1.2" />
    <path d="M 118,194 L 128,204 L 122,210 L 110,200 Z" fill="#040A12" stroke="#00F5D4" stroke-width="1.2" />
    
    <!-- Cybernetic Gauntlets -->
    <circle cx="80" cy="204" r="3.8" fill="#00F5D4" filter="url(#cyanHeroGlow)" />
    <circle cx="125" cy="206" r="4.2" fill="#00F5D4" filter="url(#cyanHeroGlow)" />

    <!-- Tsuba & Grip -->
    <circle cx="127" cy="205" r="4.5" fill="#081018" stroke="#00F5D4" stroke-width="1.2" />
    <line x1="124" y1="200" x2="130" y2="210" stroke="#FF3038" stroke-width="2.2" />

    <!-- RADIANT KATANA BLADE (Bright White-Cyan Plasma Beam) -->
    <polygon points="128,204 184,174 187,177 130,207" fill="url(#katanaBladeGlow)" class="katana-shine" />
    <line x1="128" y1="203" x2="188" y2="173" stroke="#FFF" stroke-width="2.4" class="katana-shine" />
    <!-- Tip Spark & Energy Arc -->
    <circle cx="188" cy="173" r="3" fill="#FFF" filter="url(#cyanHeroGlow)" />
    <path d="M 130,204 Q 160,185 190,172" fill="none" stroke="#00F5D4" stroke-width="1.5" opacity="0.8" />

    <!-- Legs & Authentic Combat Stance (Cat / Horse Stance) -->
    <path d="M 73,236 L 99,236 L 95,250 L 75,250 Z" fill="#020406" stroke="#00F5D4" stroke-width="1.2" />
    <!-- Front Leg (Lunging) -->
    <path d="M 95,250 L 110,274 L 100,278 L 88,252 Z" fill="#020406" stroke="#00F5D4" stroke-width="1.2" />
    <path d="M 110,274 L 107,310 L 96,310 L 100,278 Z" fill="#040810" stroke="#00F5D4" stroke-width="1.2" />
    <path d="M 107,310 L 122,319 L 94,319 L 96,310 Z" fill="#081420" stroke="#00F5D4" stroke-width="1.2" />

    <!-- Rear Leg (Braced Anchor) -->
    <path d="M 75,250 L 58,272 L 50,268 L 68,248 Z" fill="#020406" stroke="#00F5D4" stroke-width="1.2" />
    <path d="M 58,272 L 40,308 L 32,304 L 50,268 Z" fill="#040810" stroke="#00F5D4" stroke-width="1.2" />
    <path d="M 40,308 L 26,318 L 50,318 L 45,308 Z" fill="#081420" stroke="#00F5D4" stroke-width="1.2" />

    <!-- Name Badge Below Shadow (Comfortably padded) -->
    <g transform="translate(30, 332)" font-family="'Courier New', Consolas, monospace">
      <rect x="0" y="0" width="118" height="26" rx="4" fill="#06101A" stroke="#00F5D4" stroke-width="1.2" filter="url(#cyanHeroGlow)" />
      <text x="59" y="13" text-anchor="middle" font-size="9.5" font-weight="900" fill="#00F5D4" letter-spacing="1">SHADOW // 影</text>
      <text x="59" y="22" text-anchor="middle" font-size="7.5" font-weight="800" fill="#FFF">HERO OPERATIVE</text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 04 // RIGHT FIGHTER: TITAN (HIGHLIGHTED DEMON OVERLORD)  -->
  <!-- ======================================================== -->
  <g id="titanBossGroup" class="boss-titan-highlight">
    <!-- Radiant Demon Boss Aura Backlight -->
    <ellipse cx="875" cy="235" rx="65" ry="95" fill="url(#titanHighlightAura)" />

    <!-- Ground Platform Ring & Molten Lava Cracks -->
    <ellipse cx="875" cy="318" rx="60" ry="10" fill="#000" opacity="0.75" />
    <ellipse cx="875" cy="318" rx="52" ry="7" fill="#FF003C" opacity="0.35" filter="url(#titanFlameGlow)" />
    <circle cx="875" cy="318" r="35" fill="none" stroke="#FF4500" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.7" />

    <!-- Molten Lava Crack Sparks at Feet -->
    <path d="M 830,316 C 842,308 856,322 870,311 C 885,305 900,320 916,313" fill="none" stroke="#FF5722" stroke-width="1.8" opacity="0.85" />

    <!-- HIGHLIGHTED TITAN SILHOUETTE BODY -->
    <!-- Curved Demonic Horns with Blazing Tips -->
    <path d="M 872,148 C 860,126 842,128 828,124 C 837,138 852,142 863,151 Z" fill="#060204" stroke="#FF3038" stroke-width="1.6" filter="url(#titanFlameGlow)" />
    <path d="M 884,148 C 896,126 914,128 928,124 C 919,138 904,142 893,151 Z" fill="#060204" stroke="#FF3038" stroke-width="1.6" filter="url(#titanFlameGlow)" />
    <circle cx="828" cy="124" r="2.8" fill="#FFE082" filter="url(#shdSolarGlow)" />
    <circle cx="928" cy="124" r="2.8" fill="#FFE082" filter="url(#shdSolarGlow)" />

    <!-- Armored Demon Kabuto Helm & Faceplate -->
    <path d="M 862,150 C 852,154 850,168 852,180 L 862,187 L 894,187 L 904,180 C 906,168 904,154 894,150 Z" fill="#040102" stroke="#FF3038" stroke-width="1.8" filter="url(#titanFlameGlow)" />
    
    <!-- FIERCE GLOWING DEMONIC RED/AMBER EYES -->
    <polygon points="864,165 874,164 873,168 863,169" fill="#FF003C" filter="url(#titanFlameGlow)" />
    <polygon points="866,165 872,164 872,167 866,168" fill="#FFE082" />
    <polygon points="882,164 892,165 893,169 883,168" fill="#FF003C" filter="url(#titanFlameGlow)" />
    <polygon points="884,164 890,165 890,168 884,167" fill="#FFE082" />

    <!-- Massive Spiked Cybernetic Shoulder Pauldrons -->
    <polygon points="854,178 824,168 828,198 856,206" fill="#0C0406" stroke="#FF5722" stroke-width="1.5" />
    <polygon points="902,178 932,168 928,198 900,206" fill="#0C0406" stroke="#FF5722" stroke-width="1.5" />

    <!-- Heavy Armored Cuirass & Chest -->
    <path d="M 856,186 L 900,186 L 906,214 L 896,240 L 860,240 L 850,214 Z" fill="#040102" stroke="#FF3038" stroke-width="1.6" />
    
    <!-- BLAZING SHADOW CORE REACTOR IN CHEST -->
    <circle cx="878" cy="210" r="8" fill="#FF003C" filter="url(#shdSolarGlow)" />
    <circle cx="878" cy="210" r="4.5" fill="#FF8C00" />
    <circle cx="878" cy="210" r="2.2" fill="#FFFFFF" />

    <!-- Armored Faulds & Tassets -->
    <rect x="856" y="238" width="44" height="9" rx="1.5" fill="#140608" stroke="#FF4500" stroke-width="1.2" />
    <polygon points="862,247 870,274 886,274 894,247" fill="#0A0305" stroke="#FF3038" stroke-width="1.2" />

    <!-- Left Arm: Wielding Colossal DESOLATOR GREATSWORD -->
    <path d="M 854,196 L 830,214 L 836,225 L 858,208 Z" fill="#040102" stroke="#FF3038" stroke-width="1.2" />
    <circle cx="828" cy="218" r="5" fill="#1C0A0E" stroke="#FF4500" stroke-width="1.4" />

    <!-- THE DESOLATOR GREATSWORD (Serrated Molten Greatblade) -->
    <rect x="820" y="220" width="18" height="5" rx="1.5" fill="#FF4500" />
    <polygon points="826,225 802,296 812,314 824,314 836,225" fill="url(#desolatorBladeGlow)" class="desolator-shine" />
    <line x1="826" y1="225" x2="812" y2="314" stroke="#FFF" stroke-width="2.2" class="desolator-shine" />
    <!-- Blazing Core Fuller Groove -->
    <line x1="828" y1="230" x2="816" y2="302" stroke="#FFE600" stroke-width="1.8" />
    <!-- Rising Flame Sparks Off Blade -->
    <circle cx="808" cy="270" r="2" fill="#FFE082" class="ember-p1" />
    <circle cx="816" cy="245" r="2.2" fill="#FF4500" class="ember-p2" />

    <!-- Right Arm: Heavy Spiked Gauntlet -->
    <path d="M 902,198 L 920,216 L 926,228 L 915,232 L 900,210 Z" fill="#040102" stroke="#FF3038" stroke-width="1.2" />
    <circle cx="922" cy="225" r="6" fill="#1A0609" stroke="#FF003C" stroke-width="1.4" />

    <!-- Heavy Armored Legs & Power Stance -->
    <!-- Front Leg -->
    <path d="M 862,246 L 848,276 L 856,282 L 872,248 Z" fill="#040102" stroke="#FF3038" stroke-width="1.4" />
    <path d="M 848,276 L 838,312 L 854,312 L 856,282 Z" fill="#0A0305" stroke="#FF3038" stroke-width="1.4" />
    <path d="M 838,312 L 822,321 L 854,321 L 854,312 Z" fill="#18060A" stroke="#FF5722" stroke-width="1.4" />

    <!-- Rear Leg -->
    <path d="M 892,246 L 908,276 L 900,282 L 884,248 Z" fill="#040102" stroke="#FF3038" stroke-width="1.4" />
    <path d="M 908,276 L 918,312 L 904,312 L 900,282 Z" fill="#0A0305" stroke="#FF3038" stroke-width="1.4" />
    <path d="M 918,312 L 932,321 L 902,321 L 904,312 Z" fill="#18060A" stroke="#FF5722" stroke-width="1.4" />

    <!-- Name Badge Below Titan (Comfortably padded) -->
    <g transform="translate(804, 332)" font-family="'Courier New', Consolas, monospace">
      <rect x="0" y="0" width="118" height="26" rx="4" fill="#18060A" stroke="#FF3038" stroke-width="1.2" filter="url(#titanFlameGlow)" />
      <text x="59" y="13" text-anchor="middle" font-size="9.5" font-weight="900" fill="#FF3038" letter-spacing="1">TITAN // タイタン</text>
      <text x="59" y="22" text-anchor="middle" font-size="7.5" font-weight="800" fill="#FFB703">FINAL OVERLORD</text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 05 // REAL GITHUB 53-WEEK CONTRIBUTION MATRIX            -->
  <!-- ======================================================== -->
  <!-- Month Labels -->
  <g>
${monthsXml}  </g>

  <!-- Day Labels (Left Column, perfectly aligned) -->
  <g font-family="'Courier New', Consolas, monospace" font-size="8" font-weight="700" fill="#8892B0" text-anchor="end">
    <text x="162" y="174">Mon</text>
    <text x="162" y="198">Wed</text>
    <text x="162" y="222">Fri</text>
    <text x="162" y="246">Sun</text>
  </g>

  <!-- Real Contribution Tile Matrix (53 Columns x 7 Rows) -->
  <g id="realContributionTiles">
${tilesXml}  </g>

  <!-- Animated Katana Slash Line Traversing the Grid -->
  <g opacity="0.85">
    <line x1="0" y1="212" x2="960" y2="212" stroke="url(#shdSlashLaser)" stroke-width="2.2" class="slash-laser-line" filter="url(#laserBeamGlow)" />
  </g>

  <!-- Floating Embers From Real Active & Overdrive Strike Cells -->
  <g>
${embersXml}  </g>

  <!-- ======================================================== -->
  <!-- 06 // BOTTOM TACTICAL WEAPON ARSENAL & MARTIAL LEGEND     -->
  <!-- ======================================================== -->
  <line x1="38" y1="368" x2="922" y2="368" stroke="#161B25" stroke-width="1.2" />

  <g transform="translate(38, 388)" font-family="'Courier New', Consolas, monospace" font-size="9">
    <!-- Primary Weapon Arsenal Badges -->
    <g transform="translate(0, 0)">
      <text x="0" y="8" fill="#8892B0" letter-spacing="1">⚔️ WEAPONS:</text>
      
      <!-- TS Badge -->
      <rect x="76" y="-3" width="34" height="15" rx="2" fill="#0C1320" stroke="#3178C6" stroke-width="0.8" />
      <text x="93" y="8" text-anchor="middle" fill="#55E6FF" font-weight="900" font-size="8.5">TS</text>

      <!-- JS Badge -->
      <rect x="116" y="-3" width="34" height="15" rx="2" fill="#1C1808" stroke="#FACC15" stroke-width="0.8" />
      <text x="133" y="8" text-anchor="middle" fill="#FFD600" font-weight="900" font-size="8.5">JS</text>

      <!-- PY Badge -->
      <rect x="156" y="-3" width="34" height="15" rx="2" fill="#0D1620" stroke="#3572A5" stroke-width="0.8" />
      <text x="173" y="8" text-anchor="middle" fill="#60A5FA" font-weight="900" font-size="8.5">PY</text>

      <!-- REACT Badge -->
      <rect x="196" y="-3" width="48" height="15" rx="2" fill="#0B1A24" stroke="#61DAFB" stroke-width="0.8" />
      <text x="220" y="8" text-anchor="middle" fill="#61DAFB" font-weight="900" font-size="8.5">REACT</text>

      <!-- NODE Badge -->
      <rect x="250" y="-3" width="44" height="15" rx="2" fill="#0A1812" stroke="#42FF9E" stroke-width="0.8" />
      <text x="272" y="8" text-anchor="middle" fill="#42FF9E" font-weight="900" font-size="8.5">NODE</text>

      <!-- DOCKER Badge -->
      <rect x="300" y="-3" width="50" height="15" rx="2" fill="#0A1422" stroke="#2496ED" stroke-width="0.8" />
      <text x="325" y="8" text-anchor="middle" fill="#2496ED" font-weight="900" font-size="8.5">DOCKER</text>

      <text x="360" y="8" fill="#55E6FF" font-weight="700">| SHADOW REIGN: ACTIVE</text>
    </g>

    <!-- Legend (5 Tiers of Martial Cadence, positioned cleanly on right) -->
    <g transform="translate(680, 0)">
      <text x="0" y="8" fill="#6A7280" font-weight="700" letter-spacing="1">LESS</text>
      <!-- Tier 0 -->
      <rect x="36" y="-1" width="10" height="10" rx="2" fill="#101520" stroke="#1A2232" stroke-width="0.8" />
      <!-- Tier 1 -->
      <rect x="52" y="-1" width="10" height="10" rx="2" fill="#7C1A22" stroke="#B91C1C" stroke-width="0.8" />
      <!-- Tier 2 -->
      <rect x="68" y="-1" width="10" height="10" rx="2" fill="#B91C1C" stroke="#EF4444" stroke-width="0.8" />
      <!-- Tier 3 -->
      <rect x="84" y="-1" width="10" height="10" rx="2" fill="#EA580C" stroke="#FB923C" stroke-width="0.8" filter="url(#shdEmberGlow)" />
      <!-- Tier 4 -->
      <rect x="100" y="-1" width="10" height="10" rx="2" fill="#F59E0B" stroke="#FDE047" stroke-width="0.9" filter="url(#shdSolarGlow)" />
      <text x="118" y="8" fill="#FFD700" font-weight="700" letter-spacing="1">CRITICAL</text>
    </g>
  </g>
</svg>`;
}

async function main() {
  const username = process.env.GH_USERNAME || "codexanjan";
  const token = process.env.GITHUB_TOKEN;

  console.log(`[sync-github-stats] Fetching live GitHub data for ${username}...`);
  const userData = await fetchGitHubData(username, token);

  const assetsDir = path.resolve(__dirname, "../assets");

  if (userData) {
    const stars = userData.repositories.nodes.reduce((acc, r) => acc + (r.stargazerCount || 0), 0);
    const commits = userData.contributionsCollection?.totalCommitContributions || 0;
    const prs = userData.pullRequests?.totalCount || 0;
    const issues = userData.issues?.totalCount || 0;
    const contribs = userData.repositoriesContributedTo?.totalCount || 0;
    const calendar = userData.contributionsCollection?.contributionCalendar;
    const totalCount = calendar?.totalContributions || commits;

    console.log(`[sync-github-stats] Live stats: Stars=${stars}, Commits=${commits}, PRs=${prs}, Issues=${issues}, TotalContribs=${totalCount}`);

    // Update live-github-stats.svg
    const statsPath = path.join(assetsDir, "live-github-stats.svg");
    if (fs.existsSync(statsPath)) {
      let c = fs.readFileSync(statsPath, "utf8");
      c = c.replace(/(Total Stars Earned:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${stars}$2`);
      c = c.replace(/(Total Commits \(2026\):<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${commits}$2`);
      c = c.replace(/(Total PRs:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${prs}$2`);
      c = c.replace(/(Total Issues:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${issues}$2`);
      c = c.replace(/(Contributed to \(last year\):<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${contribs}$2`);
      fs.writeFileSync(statsPath, c);
      console.log(`[sync-github-stats] Updated ${statsPath}`);
    }

    // Update samurai-telemetry-grid.svg
    const telemetryPath = path.join(assetsDir, "samurai-telemetry-grid.svg");
    if (fs.existsSync(telemetryPath)) {
      let c = fs.readFileSync(telemetryPath, "utf8");
      c = c.replace(/(Total Stars Earned:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${stars}$2`);
      c = c.replace(/(Total Commits \(2026\):<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${commits}$2`);
      c = c.replace(/(Total PRs:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${prs}$2`);
      c = c.replace(/(Total Issues:<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${issues}$2`);
      c = c.replace(/(Contributed to \(yr\):<\/text>\s*<text[^>]*>)\d+(<\/text>)/, `$1${contribs}$2`);
      fs.writeFileSync(telemetryPath, c);
      console.log(`[sync-github-stats] Updated ${telemetryPath}`);
    }

    // Generate contribution-grid.svg with live calendar
    if (calendar) {
      const contribPath = path.join(assetsDir, "contribution-grid.svg");
      const svg = generateContributionGridSvg(calendar);
      fs.writeFileSync(contribPath, svg);
      console.log(`[sync-github-stats] Generated ${contribPath} with ${totalCount} contributions!`);
    }
  } else {
    console.log("[sync-github-stats] Could not fetch live data, reading cached data if available...");
    // Fallback: if cached calendar exists or if we need to render from existing data
    const cacheFile = path.resolve(__dirname, "../scripts/cached-calendar.json");
    if (fs.existsSync(cacheFile)) {
      const calendar = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      const contribPath = path.join(assetsDir, "contribution-grid.svg");
      const svg = generateContributionGridSvg(calendar);
      fs.writeFileSync(contribPath, svg);
      console.log(`[sync-github-stats] Generated ${contribPath} from cache.`);
    }
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { fetchGitHubData, generateContributionGridSvg };
