import React, { useEffect, useRef } from "react";

const TOPOLOGY = [
  { id: "edge-left-router", type: "router", x: 0.06, y: 0.22, label: "ER" },
  { id: "edge-left-switch", type: "switch", x: 0.1, y: 0.48, label: "EDGE" },
  { id: "edge-left-fw", type: "firewall", x: 0.14, y: 0.68, label: "FW" },
  { id: "edge-left-log", type: "server", x: 0.08, y: 0.86, label: "LOG" },
  { id: "edge-left-host-a", type: "host", x: 0.03, y: 0.38, label: "P1" },
  { id: "edge-left-host-b", type: "host", x: 0.04, y: 0.62, label: "P2" },
  { id: "edge-left-host-c", type: "host", x: 0.16, y: 0.9, label: "P3" },
  { id: "gw-west", type: "router", x: 0.18, y: 0.7, label: "GW" },
  { id: "sw-west", type: "switch", x: 0.69, y: 0.52, label: "SW" },
  { id: "host-a", type: "host", x: 0.16, y: 0.36, label: "H1" },
  { id: "host-b", type: "host", x: 0.2, y: 0.62, label: "H2" },
  { id: "host-c", type: "host", x: 0.3, y: 0.55, label: "H3" },
  { id: "host-f", type: "host", x: 0.22, y: 0.8, label: "H6" },
  { id: "host-g", type: "host", x: 0.32, y: 0.22, label: "H7" },
  { id: "printer-a", type: "host", x: 0.34, y: 0.76, label: "PRN" },
  { id: "fw-core", type: "firewall", x: 0.92, y: 0.17, label: "FW" },
  { id: "rt-core-a", type: "router", x: 0.17, y: 0.18, label: "R1" },
  { id: "rt-core-b", type: "router", x: 0.58, y: 0.38, label: "R2" },
  { id: "sw-dmz", type: "switch", x: 0.58, y: 0.18, label: "DMZ" },
  { id: "top-sensor", type: "endpoint", x: 0.44, y: 0.12, label: "IDS" },
  { id: "top-relay", type: "router", x: 0.86, y: 0.08, label: "IX" },
  { id: "sw-east", type: "switch", x: 0.25, y: 0.63, label: "SW" },
  { id: "srv-api", type: "server", x: 0.76, y: 0.26, label: "API" },
  { id: "edge-right-switch", type: "switch", x: 0.94, y: 0.46, label: "EDGE" },
  { id: "edge-right-router", type: "router", x: 0.9, y: 0.22, label: "ER" },
  { id: "edge-right-host-a", type: "host", x: 0.96, y: 0.66, label: "P4" },
  { id: "srv-db", type: "server", x: 0.82, y: 0.66, label: "DB" },
  { id: "srv-web", type: "server", x: 0.68, y: 0.12, label: "WEB" },
  { id: "srv-cache", type: "server", x: 0.7, y: 0.82, label: "REDIS" },
  { id: "ai-llm", type: "endpoint", x: 0.56, y: 0.3, label: "LLM" },
  { id: "ai-rag", type: "endpoint", x: 0.54, y: 0.52, label: "RAG" },
  { id: "ai-vec", type: "endpoint", x: 0.64, y: 0.56, label: "VEC" },
  { id: "ai-gpu", type: "endpoint", x: 0.5, y: 0.18, label: "GPU" },
  { id: "ai-agent", type: "endpoint", x: 0.78, y: 0.44, label: "AGENT" },
  { id: "ai-stt", type: "host", x: 0.74, y: 0.1, label: "STT" },
  { id: "ai-tts", type: "host", x: 0.66, y: 0.34, label: "TTS" },
  { id: "host-d", type: "host", x: 0.66, y: 0.72, label: "H4" },
  { id: "host-e", type: "host", x: 0.92, y: 0.56, label: "H5" },
  { id: "host-h", type: "host", x: 0.88, y: 0.84, label: "H8" },
  { id: "host-i", type: "host", x: 0.82, y: 0.4, label: "H9" },
  { id: "iot-a", type: "host", x: 0.38, y: 0.88, label: "IoT" },
  { id: "iot-b", type: "host", x: 0.56, y: 0.72, label: "IoT" },
  { id: "siem", type: "endpoint", x: 0.48, y: 0.84, label: "SIEM" },
  { id: "bottom-switch", type: "switch", x: 0.42, y: 0.96, label: "OT" },
  { id: "bottom-host-a", type: "host", x: 0.28, y: 0.95, label: "CAM" },
  { id: "bottom-host-b", type: "host", x: 0.62, y: 0.95, label: "NAS" },
  { id: "crypto-btc", type: "endpoint", x: 0.82, y: 0.92, label: "BTC" },
  { id: "crypto-eth", type: "endpoint", x: 0.92, y: 0.92, label: "ETH" },
  { id: "crypto-wallet", type: "endpoint", x: 0.94, y: 0.76, label: "WALLET" },
  { id: "crypto-miner", type: "host", x: 0.5, y: 0.96, label: "MINER" },
  { id: "crypto-rpc", type: "server", x: 0.82, y: 0.8, label: "RPC" },
  { id: "crypto-dex", type: "server", x: 0.72, y: 0.94, label: "DEX" },
];

const LINKS = [
  ["edge-left-router", "gw-west"],
  ["edge-left-router", "edge-left-switch"],
  ["edge-left-switch", "edge-left-host-a"],
  ["edge-left-switch", "edge-left-host-b"],
  ["edge-left-switch", "edge-left-fw"],
  ["edge-left-fw", "edge-left-log"],
  ["edge-left-fw", "host-f"],
  ["edge-left-log", "bottom-switch"],
  ["edge-left-host-b", "host-a"],
  ["edge-left-host-c", "edge-left-fw"],
  ["gw-west", "sw-west"],
  ["sw-west", "host-a"],
  ["sw-west", "host-b"],
  ["sw-west", "host-c"],
  ["sw-west", "host-f"],
  ["sw-west", "host-g"],
  ["sw-west", "printer-a"],
  ["sw-west", "fw-core"],
  ["fw-core", "rt-core-a"],
  ["rt-core-a", "rt-core-b"],
  ["rt-core-b", "sw-dmz"],
  ["rt-core-b", "top-relay"],
  ["sw-dmz", "srv-web"],
  ["sw-dmz", "srv-api"],
  ["sw-dmz", "top-sensor"],
  ["top-sensor", "fw-core"],
  ["top-relay", "srv-api"],
  ["top-relay", "srv-web"],
  ["top-relay", "edge-right-router"],
  ["rt-core-a", "sw-east"],
  ["rt-core-b", "sw-east"],
  ["rt-core-b", "srv-api"],
  ["sw-dmz", "ai-gpu"],
  ["sw-dmz", "ai-llm"],
  ["srv-web", "ai-stt"],
  ["srv-api", "ai-agent"],
  ["srv-api", "ai-tts"],
  ["srv-api", "crypto-wallet"],
  ["ai-agent", "ai-llm"],
  ["ai-llm", "ai-rag"],
  ["ai-rag", "ai-vec"],
  ["ai-vec", "srv-db"],
  ["ai-rag", "srv-cache"],
  ["ai-gpu", "ai-llm"],
  ["edge-right-router", "srv-api"],
  ["edge-right-router", "edge-right-switch"],
  ["edge-right-switch", "host-e"],
  ["edge-right-switch", "edge-right-host-a"],
  ["edge-right-host-a", "srv-db"],
  ["sw-east", "srv-db"],
  ["sw-east", "srv-cache"],
  ["sw-east", "host-d"],
  ["sw-east", "host-e"],
  ["sw-east", "host-h"],
  ["sw-east", "host-i"],
  ["rt-core-a", "iot-a"],
  ["rt-core-a", "iot-b"],
  ["rt-core-a", "siem"],
  ["host-c", "iot-a"],
  ["iot-a", "printer-a"],
  ["iot-b", "host-d"],
  ["host-d", "siem"],
  ["srv-db", "siem"],
  ["srv-cache", "srv-db"],
  ["host-b", "host-c"],
  ["host-b", "host-f"],
  ["host-c", "printer-a"],
  ["host-f", "iot-a"],
  ["host-g", "fw-core"],
  ["host-d", "host-e"],
  ["host-e", "host-h"],
  ["host-d", "host-i"],
  ["host-h", "srv-cache"],
  ["bottom-switch", "iot-a"],
  ["bottom-switch", "siem"],
  ["bottom-switch", "bottom-host-a"],
  ["bottom-switch", "bottom-host-b"],
  ["bottom-host-b", "srv-cache"],
  ["bottom-switch", "crypto-miner"],
  ["bottom-host-b", "crypto-dex"],
  ["srv-cache", "crypto-dex"],
  ["crypto-dex", "crypto-rpc"],
  ["crypto-rpc", "crypto-btc"],
  ["crypto-rpc", "crypto-eth"],
  ["crypto-btc", "crypto-eth"],
  ["crypto-wallet", "crypto-rpc"],
  ["crypto-wallet", "edge-right-host-a"],
  ["crypto-miner", "crypto-btc"],
];

const ROUTES = [
  ["edge-left-host-a", "edge-left-switch", "edge-left-router", "gw-west", "sw-west", "fw-core", "rt-core-a", "siem"],
  ["edge-left-host-b", "edge-left-switch", "edge-left-fw", "edge-left-log"],
  ["edge-left-log", "edge-left-fw", "host-f", "iot-a", "bottom-switch", "bottom-host-a"],
  ["edge-left-host-c", "edge-left-fw", "host-f", "host-b"],
  ["host-a", "sw-west", "fw-core", "rt-core-a", "rt-core-b", "srv-api"],
  ["srv-api", "rt-core-b", "rt-core-a", "fw-core", "sw-west", "host-a"],
  ["host-b", "sw-west", "fw-core", "rt-core-a", "sw-east", "srv-db"],
  ["srv-db", "sw-east", "rt-core-a", "fw-core", "sw-west", "host-b"],
  ["host-c", "sw-west", "fw-core", "rt-core-a", "siem"],
  ["host-d", "sw-east", "rt-core-a", "siem"],
  ["host-g", "sw-west", "fw-core", "rt-core-a", "rt-core-b", "sw-dmz", "srv-web"],
  ["srv-web", "sw-dmz", "rt-core-b", "rt-core-a", "fw-core", "sw-west", "host-g"],
  ["ai-agent", "srv-api", "ai-llm", "ai-rag", "ai-vec", "srv-db"],
  ["ai-stt", "srv-web", "sw-dmz", "ai-gpu", "ai-llm", "ai-tts"],
  ["ai-llm", "ai-rag", "srv-cache", "srv-api", "ai-agent"],
  ["ai-rag", "ai-vec", "srv-db", "siem"],
  ["top-sensor", "sw-dmz", "rt-core-b", "top-relay", "edge-right-router", "edge-right-switch", "edge-right-host-a"],
  ["edge-right-host-a", "edge-right-switch", "edge-right-router", "top-relay", "srv-web"],
  ["host-a", "sw-west", "host-b"],
  ["host-b", "host-c", "iot-a"],
  ["host-b", "host-f"],
  ["host-c", "printer-a", "iot-a"],
  ["host-f", "iot-a", "rt-core-a", "iot-b", "host-d"],
  ["host-d", "host-e"],
  ["host-e", "host-h"],
  ["host-d", "host-i"],
  ["host-h", "srv-cache", "srv-db"],
  ["host-i", "sw-east", "srv-api"],
  ["bottom-host-a", "bottom-switch", "iot-a", "host-f", "edge-left-fw", "edge-left-log"],
  ["bottom-host-b", "bottom-switch", "siem", "srv-db", "srv-cache"],
  ["crypto-miner", "bottom-switch", "bottom-host-b", "crypto-dex", "crypto-rpc", "crypto-btc"],
  ["crypto-btc", "crypto-rpc", "crypto-eth"],
  ["crypto-wallet", "crypto-rpc", "crypto-dex", "srv-cache"],
  ["crypto-eth", "crypto-rpc", "crypto-wallet", "edge-right-host-a"],
  ["iot-b", "host-d", "host-e"],
  ["printer-a", "host-c", "host-b", "host-f"],
  ["host-c", "sw-west", "fw-core", "rt-core-a", "sw-east", "host-d"],
  ["gw-west", "sw-west", "fw-core", "rt-core-a", "rt-core-b", "sw-east", "host-e"],
  ["host-a", "sw-west", "fw-core", "rt-core-a", "sw-east", "host-h"],
  ["host-h", "host-e", "sw-east", "rt-core-a", "fw-core", "sw-west", "host-a"],
  ["srv-cache", "sw-east", "rt-core-a", "siem"],
  ["edge-left-host-a", "edge-left-switch", "edge-left-host-b"],
  ["edge-left-host-b", "host-a", "sw-west", "host-c", "printer-a"],
  ["edge-right-host-a", "srv-db", "srv-cache", "bottom-host-b"],
  ["crypto-dex", "srv-cache", "ai-rag", "ai-vec"],
  ["ai-agent", "srv-api", "crypto-wallet", "crypto-rpc"],
];

const ROLE_STYLE = {
  router: { color: "56,189,248", size: 18 },
  switch: { color: "45,212,191", size: 15 },
  server: { color: "96,165,250", size: 13 },
  host: { color: "148,163,184", size: 10 },
  firewall: { color: "190,170,90", size: 16 },
  endpoint: { color: "125,211,252", size: 8 },
};

const VIEWPORT_BLEED = 0.07;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const roundedRect = (context, x, y, width, height, radius) => {
  if (typeof context.roundRect === "function") {
    context.roundRect(x, y, width, height, radius);
    return;
  }

  const safeRadius = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
};

const getNodePosition = (node, width, height) => ({
  ...node,
  px: (node.x * (1 + VIEWPORT_BLEED * 2) - VIEWPORT_BLEED) * width,
  py: (node.y * (1 + VIEWPORT_BLEED * 2) - VIEWPORT_BLEED) * height,
});

const createPackets = () =>
  Array.from({ length: 42 }, (_, packetIndex) => ({
    route: ROUTES[packetIndex % ROUTES.length],
    progress: Math.random(),
    speed: 0.000035 + Math.random() * 0.00005,
    delay: Math.random() * 0.12,
    color:
      packetIndex % 5 === 0
        ? "190,170,90"
        : packetIndex % 3 === 0
          ? "45,212,191"
          : "56,189,248",
    size: packetIndex % 5 === 0 ? 2.3 : 1.8,
  }));

const drawBackground = (context, width, height) => {
  const gradient = context.createRadialGradient(
    width * 0.52,
    height * 0.45,
    0,
    width * 0.52,
    height * 0.45,
    Math.max(width, height) * 0.72,
  );
  gradient.addColorStop(0, "rgba(56,189,248,0.08)");
  gradient.addColorStop(0.42, "rgba(3,7,18,0.24)");
  gradient.addColorStop(1, "rgba(0,0,0,0.78)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.22;
  context.strokeStyle = "rgba(56,189,248,0.14)";
  context.lineWidth = 0.5;

  const gridSize = 72;
  for (let x = 0; x <= width; x += gridSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.restore();
};

const drawLinks = (context, positionedNodes, activeLinks) => {
  context.save();
  context.globalCompositeOperation = "lighter";

  for (const [fromId, toId] of LINKS) {
    const from = positionedNodes[fromId];
    const to = positionedNodes[toId];
    const linkKey = `${fromId}-${toId}`;
    const reverseKey = `${toId}-${fromId}`;
    const activity = Math.max(activeLinks[linkKey] || 0, activeLinks[reverseKey] || 0);
    const lineAlpha = 0.24 + activity * 0.42;
    const lineWidth = 0.9 + activity * 1.25;

    const gradient = context.createLinearGradient(from.px, from.py, to.px, to.py);
    gradient.addColorStop(0, `rgba(56,189,248,${lineAlpha * 0.42})`);
    gradient.addColorStop(0.5, `rgba(45,212,191,${lineAlpha * 0.74})`);
    gradient.addColorStop(1, `rgba(56,189,248,${lineAlpha * 0.42})`);

    context.beginPath();
    context.moveTo(from.px, from.py);
    context.lineTo(to.px, to.py);
    context.lineWidth = lineWidth;
    context.strokeStyle = gradient;
    context.shadowBlur = 3 + activity * 9;
    context.shadowColor = "rgba(56,189,248,0.32)";
    context.stroke();
  }

  context.restore();
};

const drawRouter = (context, node, size, color) => {
  context.save();
  context.translate(node.px, node.py);
  context.rotate(Math.PI / 4);
  context.fillStyle = `rgba(${color},0.16)`;
  context.strokeStyle = `rgba(${color},0.68)`;
  context.lineWidth = 1.4;
  context.beginPath();
  context.rect(-size * 0.58, -size * 0.58, size * 1.16, size * 1.16);
  context.fill();
  context.stroke();
  context.restore();
};

const drawSwitch = (context, node, size, color) => {
  context.fillStyle = `rgba(${color},0.14)`;
  context.strokeStyle = `rgba(${color},0.7)`;
  context.lineWidth = 1.6;
  context.beginPath();
  roundedRect(context, node.px - size, node.py - size * 0.45, size * 2, size * 0.9, 3);
  context.fill();
  context.stroke();

  for (let portIndex = -2; portIndex <= 2; portIndex += 1) {
    context.fillStyle = `rgba(${color},0.52)`;
    context.fillRect(node.px + portIndex * 5 - 1.2, node.py - 1.2, 2.4, 2.4);
  }
};

const drawServer = (context, node, size, color) => {
  context.fillStyle = `rgba(${color},0.08)`;
  context.strokeStyle = `rgba(${color},0.44)`;
  context.lineWidth = 1;
  context.beginPath();
  roundedRect(context, node.px - size * 0.58, node.py - size * 0.78, size * 1.16, size * 1.56, 2);
  context.fill();
  context.stroke();

  for (let bayIndex = -1; bayIndex <= 1; bayIndex += 1) {
    context.strokeStyle = `rgba(${color},0.18)`;
    context.beginPath();
    context.moveTo(node.px - size * 0.36, node.py + bayIndex * size * 0.32);
    context.lineTo(node.px + size * 0.36, node.py + bayIndex * size * 0.32);
    context.stroke();
  }
};

const drawHost = (context, node, size, color) => {
  context.fillStyle = `rgba(${color},0.62)`;
  context.beginPath();
  context.arc(node.px, node.py, size * 0.45, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = `rgba(${color},0.38)`;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(node.px, node.py, size * 0.9, 0, Math.PI * 2);
  context.stroke();
};

const drawFirewall = (context, node, size, color) => {
  context.fillStyle = `rgba(${color},0.13)`;
  context.strokeStyle = `rgba(${color},0.68)`;
  context.lineWidth = 1.6;
  context.beginPath();
  roundedRect(context, node.px - size * 0.8, node.py - size * 0.62, size * 1.6, size * 1.24, 3);
  context.fill();
  context.stroke();

  context.strokeStyle = `rgba(${color},0.28)`;
  for (let brickIndex = -1; brickIndex <= 1; brickIndex += 1) {
    context.beginPath();
    context.moveTo(node.px - size * 0.64, node.py + brickIndex * size * 0.32);
    context.lineTo(node.px + size * 0.64, node.py + brickIndex * size * 0.32);
    context.stroke();
  }
};

const drawEndpoint = (context, node, size, color) => {
  context.fillStyle = `rgba(${color},0.5)`;
  context.beginPath();
  context.arc(node.px, node.py, size * 0.34, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = `rgba(${color},0.24)`;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(node.px, node.py, size * 0.82, 0, Math.PI * 2);
  context.stroke();
};

const drawNodes = (context, positionedNodes, nodeActivity, elapsed) => {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.font = "9px JetBrains Mono, ui-monospace, monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (const node of Object.values(positionedNodes)) {
    const style = ROLE_STYLE[node.type] || ROLE_STYLE.host;
    const activity = nodeActivity[node.id] || 0;
    const pulse = 0.75 + Math.sin(elapsed * 0.004 + node.x * 12) * 0.15 + activity * 0.5;
    const color = style.color;
    const size = style.size * (1 + activity * 0.18);
    const glowRadius =
      size * (node.type === "host" || node.type === "endpoint" ? 2.2 : 3.1);

    const glow = context.createRadialGradient(node.px, node.py, 0, node.px, node.py, glowRadius);
    glow.addColorStop(0, `rgba(${color},${0.2 + activity * 0.24})`);
    glow.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(node.px, node.py, glowRadius * pulse, 0, Math.PI * 2);
    context.fill();

    if (node.type === "router") drawRouter(context, node, size, color);
    if (node.type === "switch") drawSwitch(context, node, size, color);
    if (node.type === "server") drawServer(context, node, size, color);
    if (node.type === "host") drawHost(context, node, size, color);
    if (node.type === "firewall") drawFirewall(context, node, size, color);
    if (node.type === "endpoint") drawEndpoint(context, node, size, color);

    const labelAlpha =
      node.type === "endpoint" ? 0.42 : node.type === "host" ? 0.46 : 0.58;
    context.fillStyle = `rgba(226,232,240,${labelAlpha})`;
    context.fillText(node.label, node.px, node.py + size + 10);
  }

  context.restore();
};

const getPacketPosition = (packet, positionedNodes, delta) => {
  packet.progress = (packet.progress + packet.speed * delta) % 1;

  const segmentCount = packet.route.length - 1;
  const scaledProgress = packet.progress * segmentCount;
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1);
  const localProgress = scaledProgress - segmentIndex;
  const fromId = packet.route[segmentIndex];
  const toId = packet.route[segmentIndex + 1];
  const from = positionedNodes[fromId];
  const to = positionedNodes[toId];

  return {
    x: from.px + (to.px - from.px) * localProgress,
    y: from.py + (to.py - from.py) * localProgress,
    fromId,
    toId,
    from,
    to,
    localProgress,
  };
};

const drawPackets = (context, packets, positionedNodes, delta, activeLinks, nodeActivity) => {
  context.save();
  context.globalCompositeOperation = "lighter";

  for (const packet of packets) {
    const position = getPacketPosition(packet, positionedNodes, delta);
    const color = packet.color;
    const trailLength = 0.12;
    const trailProgress = clamp(position.localProgress - trailLength, 0, 1);
    const trailX = position.from.px + (position.to.px - position.from.px) * trailProgress;
    const trailY = position.from.py + (position.to.py - position.from.py) * trailProgress;
    const linkKey = `${position.fromId}-${position.toId}`;

    activeLinks[linkKey] = Math.max(activeLinks[linkKey] || 0, 1 - Math.abs(position.localProgress - 0.5) * 1.4);
    nodeActivity[position.fromId] = Math.max(nodeActivity[position.fromId] || 0, 1 - position.localProgress);
    nodeActivity[position.toId] = Math.max(nodeActivity[position.toId] || 0, position.localProgress);

    const gradient = context.createLinearGradient(trailX, trailY, position.x, position.y);
    gradient.addColorStop(0, `rgba(${color},0)`);
    gradient.addColorStop(1, `rgba(${color},0.58)`);

    context.beginPath();
    context.moveTo(trailX, trailY);
    context.lineTo(position.x, position.y);
    context.lineWidth = packet.size;
    context.strokeStyle = gradient;
    context.shadowBlur = 9;
    context.shadowColor = `rgba(${color},0.38)`;
    context.stroke();

    context.beginPath();
    context.arc(position.x, position.y, packet.size * 1.65, 0, Math.PI * 2);
    context.fillStyle = `rgba(${color},0.6)`;
    context.fill();
  }

  context.restore();
};

const drawBroadcastSweep = (context, positionedNodes, elapsed) => {
  const switchNodes = [
    "sw-west",
    "sw-east",
    "edge-left-switch",
    "edge-right-switch",
    "bottom-switch",
  ].map((id) => positionedNodes[id]);

  context.save();
  context.globalCompositeOperation = "lighter";

  for (const [index, node] of switchNodes.entries()) {
    if (!node) continue;

    const wave = (elapsed * 0.00018 + index * 0.5) % 1;
    const radius = 24 + wave * 120;
    const alpha = (1 - wave) * 0.14;

    context.beginPath();
    context.arc(node.px, node.py, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(45,212,191,${alpha})`;
    context.lineWidth = 1;
    context.stroke();
  }

  context.restore();
};

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let positionedNodes = {};
    let packets = createPackets();
    let animationFrame = 0;
    let previousTimestamp = 0;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      positionedNodes = Object.fromEntries(
        TOPOLOGY.map((node) => [node.id, getNodePosition(node, width, height)]),
      );
      packets = createPackets();
    };

    const renderFrame = (timestamp = 0) => {
      const elapsed = reduceMotion ? 2400 : timestamp;
      const delta = reduceMotion ? 0 : Math.min(40, timestamp - previousTimestamp || 16);
      const activeLinks = {};
      const nodeActivity = {};

      previousTimestamp = timestamp;
      context.clearRect(0, 0, width, height);

      drawBackground(context, width, height);
      drawBroadcastSweep(context, positionedNodes, elapsed);
      drawPackets(context, packets, positionedNodes, delta, activeLinks, nodeActivity);
      drawLinks(context, positionedNodes, activeLinks);
      drawNodes(context, positionedNodes, nodeActivity, elapsed);

      if (!reduceMotion) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };

    resizeCanvas();
    renderFrame();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/24" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.22)_68%,rgba(0,0,0,0.82)_100%)]" />
    </div>
  );
}
