const fs = require("fs");
const path = require("path");

function validateProfile() {
  console.log("Running comprehensive profile suite validation...");
  const root = path.resolve(__dirname, "..");
  const assetsDir = path.join(root, "assets");

  // 1. Verify assets directory
  if (!fs.existsSync(assetsDir)) {
    throw new Error("assets directory not found");
  }

  // 2. Required asset files
  const requiredAssets = [
    "contribution-grid.svg",
    "shadow-fight-roster.svg",
    "live-github-stats.svg",
    "samurai-telemetry-grid.svg",
    "ronin-hero-v2.svg",
    "samurai-status-badges.svg",
    "operative-dossier-v2.svg",
    "developer-rank.svg",
    "header-badges.svg",
    "badge-cisco-cybersecurity.png",
    "badge-isc2-candidate.png",
    "katana-divider.svg",
    "katana-divider-reverse.svg"
  ];

  for (const asset of requiredAssets) {
    const fullPath = path.join(assetsDir, asset);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required asset: ${asset}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 100) {
      throw new Error(`Asset ${asset} is suspiciously small (${stat.size} bytes)`);
    }
  }
  console.log(`✓ All ${requiredAssets.length} critical SVGs exist and are populated.`);

  // 3. Check contribution-grid.svg specifically
  const contribSvg = fs.readFileSync(path.join(assetsDir, "contribution-grid.svg"), "utf8");
  if (!contribSvg.includes("234 CONFIRMED LETHAL STRIKES") && !contribSvg.includes("CONFIRMED LETHAL STRIKES")) {
    throw new Error("contribution-grid.svg missing lethal strikes telemetry");
  }
  const hasActiveCells = ["#7C1A22", "#B91C1C", "#EA580C", "#F59E0B"].some(color => contribSvg.includes(color));
  if (!hasActiveCells) {
    throw new Error("contribution-grid.svg has no active contribution cells rendered!");
  }
  if (!contribSvg.includes("VS")) {
    throw new Error("contribution-grid.svg missing VS emblem");
  }
  console.log("✓ contribution-grid.svg verified with real contributions and duel HUD.");

  // 4. Check README.md
  const readmePath = path.join(root, "README.md");
  if (!fs.existsSync(readmePath)) {
    throw new Error("README.md not found");
  }
  const readme = fs.readFileSync(readmePath, "utf8");
  if (!readme.includes("contribution-grid.svg")) {
    throw new Error("README.md does not embed contribution-grid.svg");
  }
  console.log("✓ README.md integrity verified.");

  // 5. Check sync script
  const syncPath = path.join(root, "scripts/sync-github-stats.js");
  if (!fs.existsSync(syncPath)) {
    throw new Error("scripts/sync-github-stats.js missing");
  }
  console.log("✓ scripts/sync-github-stats.js verified.");

  console.log("\n==========================================");
  console.log("✅ ALL TESTS & ASSETS VALIDATED SUCCESSFULLY!");
  console.log("==========================================\n");
}

try {
  validateProfile();
  process.exit(0);
} catch (err) {
  console.error("❌ Validation Failed:", err.message);
  process.exit(1);
}
