import { Env } from '../types';

export { SSHSessionDO } from './durable-object';

const HTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>CloudSSH</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#131313",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#bbccb0",
        "outline": "#86957d",
        "outline-variant": "#3c4b36",
        "primary-container": "#4af626",
        "on-primary-fixed": "#022100",
        "surface": "#131313",
        "surface-variant": "#353534",
        "secondary-container": "#14d1ff",
        "secondary-fixed": "#b7eaff",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "surface-container-lowest": "#0e0e0e"
      },
      fontFamily: {
        "body": ["JetBrains Mono"],
        "headline": ["JetBrains Mono"],
        "label": ["JetBrains Mono"],
        "code": ["JetBrains Mono"]
      }
    }
  }
}
<\/script>
<style>
body { background-color: #0a0a0a; color: #4af626; }
.scanlines {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
  background-size: 100% 4px;
  pointer-events: none; z-index: 50;
}
.flicker {
  animation: flicker 0.15s infinite;
  pointer-events: none; position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(74, 246, 38, 0.02); z-index: 49;
}
@keyframes flicker { 0% { opacity: 0.8; } 50% { opacity: 1; } 100% { opacity: 0.9; } }
.terminal-input {
  background: transparent; border: none;
  border-bottom: 1px solid #3c4b36; color: #4af626;
  font-family: 'JetBrains Mono', monospace;
  padding: 8px 0; width: 100%; outline: none;
  transition: border-color 0.2s;
}
.terminal-input:focus { border-bottom: 1px solid #4af626; box-shadow: none; }
.terminal-input::placeholder { color: #3c4b36; }
.blinking-cursor::after {
  content: '\\2588'; color: #14d1ff;
  animation: blink 1s step-end infinite;
  margin-left: 4px; font-size: 0.9em;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.cyber-box { background-color: #121212; border: 1px solid #1f1f1f; }
.cyber-button {
  border: 1px solid #4af626; color: #4af626;
  transition: all 0.2s ease; position: relative; overflow: hidden;
}
.cyber-button:hover { background-color: #4af626; color: #0a0a0a; }
.cursor-blink { animation: blink 1s step-end infinite; }
.scanline {
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
  background-size: 100% 4px;
}
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(28, 27, 27, 0.5); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(60, 75, 54, 0.8); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(134, 149, 125, 0.8); }
</style>
</head>
<body class="min-h-screen font-body text-sm overflow-hidden">

<!-- Login Page -->
<div id="auth-section" class="min-h-screen flex items-center justify-center p-6 relative">
  <div class="scanlines"></div>
  <div class="flicker"></div>
  <main class="w-full max-w-md relative z-10">
    <div class="mb-8 text-center">
      <div class="text-3xl font-bold text-[#4af626] tracking-tighter mb-2">CloudSSH<span class="blinking-cursor"></span></div>
    </div>
    <div class="cyber-box p-6 shadow-2xl relative">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4af626] to-transparent opacity-50"></div>
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-[#3c4b36]">
        <span class="text-xs font-bold tracking-[0.1em] text-[#14d1ff]">CONNECTION_PARAMETERS</span>
        <span class="material-symbols-outlined text-[#14d1ff]" style="font-variation-settings: 'FILL' 0;">terminal</span>
      </div>
      <form class="space-y-6" id="connection-form">
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-3">
            <label class="block text-xs font-bold tracking-[0.1em] text-[#bbccb0] mb-2">HOST_ADDRESS</label>
            <div class="flex items-center">
              <span class="text-[#bbccb0] mr-2">&gt;</span>
              <input id="host" class="terminal-input text-[13px]" placeholder="192.168.1.1" type="text" required>
            </div>
          </div>
          <div class="col-span-1">
            <label class="block text-xs font-bold tracking-[0.1em] text-[#bbccb0] mb-2">PORT</label>
            <div class="flex items-center">
              <span class="text-[#bbccb0] mr-2">:</span>
              <input id="port" class="terminal-input text-[13px]" placeholder="22" type="text" value="22">
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold tracking-[0.1em] text-[#bbccb0] mb-2">AUTH_USER</label>
          <div class="flex items-center">
            <span class="material-symbols-outlined text-[#bbccb0] mr-2" style="font-size: 16px;">person</span>
            <input id="username" class="terminal-input text-[13px]" placeholder="admin" type="text" required>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold tracking-[0.1em] text-[#bbccb0] mb-2">AUTH_KEY</label>
          <div class="flex items-center">
            <span class="material-symbols-outlined text-[#bbccb0] mr-2" style="font-size: 16px;">key</span>
            <input id="password" class="terminal-input text-[13px]" placeholder="••••••••" type="password" required>
          </div>
        </div>
        <div class="pt-6">
          <button id="connect-btn" class="cyber-button w-full py-3 px-4 text-xs font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 bg-[#4af626] text-[#022100]" type="button">
            <span class="material-symbols-outlined" style="font-size: 18px;">power_settings_new</span>
            Execute_Connection
          </button>
        </div>
        <div class="flex justify-between items-center mt-4">
          <span id="status-text" class="text-[13px] text-[#bbccb0] flex items-center gap-1">
            <span class="w-2 h-2 bg-[#353534] inline-block"></span> STATUS: OFFLINE
          </span>
        </div>
      </form>
    </div>
    <div class="mt-8 text-center text-[13px] text-[#bbccb0] opacity-60">SYSTEM READY. WAITING FOR INPUT.</div>
    <div class="mt-4 text-center">
      <a href="https://github.com/newbietan/CloudSSH" class="text-[13px] text-[#4af626] opacity-60 hover:opacity-100 transition-colors tracking-widest uppercase">[ GitHub Open Source ]</a>
    </div>
  </main>
</div>

<!-- Terminal Page -->
<div id="terminal-section" class="hidden h-screen flex-col bg-background text-on-surface">
  <!-- TopAppBar -->
  <header class="flex justify-between items-center w-full px-6 h-16 bg-background border-b border-outline-variant z-50">
    <div class="flex items-center gap-6">
      <h1 class="text-2xl font-bold text-primary-container tracking-tighter cursor-pointer">CloudSSH</h1>
    </div>
    <div class="flex items-center gap-4 text-primary-container">
      <button id="disconnect-btn" class="hover:opacity-80 transition-opacity cursor-pointer p-1 flex items-center justify-center">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">power_settings_new</span>
      </button>
    </div>
  </header>

  <!-- Main Terminal -->
  <main class="flex-1 p-6 pb-14 relative bg-surface-container-lowest overflow-hidden">
    <div class="absolute inset-0 scanline pointer-events-none z-10 opacity-30"></div>
    <div id="terminal-wrapper" class="h-full w-full border border-outline-variant bg-[#0a0a0a] p-4 overflow-hidden font-code text-[13px] text-primary-container relative z-0 flex flex-col">
      <!-- Status Bar -->
      <div class="flex justify-between items-center border-b border-surface-variant pb-2 mb-4 text-on-surface-variant opacity-80 text-[11px]">
        <div class="flex gap-6">
          <span id="term-status" class="flex items-center gap-1"><div class="w-2 h-2 bg-primary-container"></div> Connected</span>
          <span id="term-host">Host: -</span>
          <span id="term-user">User: -</span>
          <span id="term-port">Port: -</span>
        </div>
        <div>
          <span id="term-info"></span>
        </div>
      </div>
      <!-- Terminal Output -->
      <div id="terminal-container" class="flex-1 overflow-hidden"></div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="fixed bottom-0 left-0 w-full px-6 py-2 flex justify-between items-center z-50 bg-background/80 backdrop-blur-md border-t border-outline-variant text-xs h-12">
    <div class="text-secondary-container opacity-60">© 2024 CLOUD_SSH_TERMINAL - https://github.com/newbietan/CloudSSH</div>
    <div class="flex gap-4">
      <a class="text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity" href="https://github.com/newbietan/CloudSSH">Documentation</a>
    </div>
  </footer>
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.min.css">
<script src="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@0.11.0/lib/addon-web-links.min.js"><\/script>
<script>
let term, ws;
document.getElementById('connect-btn').addEventListener('click', connect);
document.getElementById('disconnect-btn').addEventListener('click', disconnect);
document.getElementById('connection-form').addEventListener('keypress', (e) => { if (e.key === 'Enter') connect(); });

function connect() {
  const host = document.getElementById('host').value;
  const port = document.getElementById('port').value || '22';
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (!host || !user || !pass) { alert('Please fill all fields'); return; }
  
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('terminal-section').classList.remove('hidden');
  document.getElementById('terminal-section').classList.add('flex');
  document.getElementById('term-host').textContent = 'Host: ' + host;
  document.getElementById('term-user').textContent = 'User: ' + user;
  document.getElementById('term-port').textContent = 'Port: ' + port;
  
  term = new Terminal({ 
    cursorBlink: true, fontSize: 14, 
    fontFamily: '"JetBrains Mono", monospace', 
    theme: { background: '#0a0a0a', foreground: '#4af626', cursor: '#14d1ff' },
    scrollback: 10000
  });
  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon.WebLinksAddon());
  term.open(document.getElementById('terminal-container'));
  fitAddon.fit();
  window.addEventListener('resize', () => fitAddon.fit());
  
  term.writeln('\\x1b[1;33m[*] Connecting...\\x1b[0m');
  const wsUrl = 'wss://' + window.location.host + '/api/ssh';
  ws = new WebSocket(wsUrl);
  ws.onopen = () => { 
    term.writeln('\\x1b[32m[+] WebSocket connected, sending credentials...\\x1b[0m'); 
    // 通过 WebSocket 消息发送凭据（不在 URL 中）
    ws.send(JSON.stringify({ host, port: parseInt(port), username: user, password: pass }));
  };
  ws.onmessage = (e) => {
    if (typeof e.data === 'string') {
      try { const m = JSON.parse(e.data); if (m.type === 'status') term.writeln('\\x1b[32m[*] ' + m.message + '\\x1b[0m'); else if (m.type === 'error') term.writeln('\\x1b[31m[!] ' + m.message + '\\x1b[0m'); } catch { term.write(e.data); }
    } else {
      const r = new FileReader(); r.onload = () => term.write(new Uint8Array(r.result)); r.readAsArrayBuffer(e.data);
    }
  };
  ws.onclose = (e) => { 
    term.writeln('\\x1b[33m[*] Connection closed (code=' + e.code + ')\\x1b[0m'); 
    document.getElementById('term-status').innerHTML = '<div class="w-2 h-2 bg-red-500"></div> Disconnected';
  };
  ws.onerror = () => term.writeln('\\x1b[31m[!] Connection error\\x1b[0m');
  term.onData((d) => { if (ws?.readyState === 1) ws.send(d); });
  term.onResize(({cols, rows}) => { if (ws?.readyState === 1) ws.send(JSON.stringify({type:'resize',cols,rows})); });
}

function disconnect() {
  ws?.close(); ws = null; term?.dispose();
  document.getElementById('terminal-section').classList.add('hidden');
  document.getElementById('terminal-section').classList.remove('flex');
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('status-text').innerHTML = '<span class="w-2 h-2 bg-[#353534] inline-block"></span> STATUS: OFFLINE';
}
<\/script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/ssh') {
      return handleSSHConnection(request, env);
    }

    if (url.pathname === '/api/health') {
      return Response.json({ status: 'ok', timestamp: Date.now() });
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  },
};

async function handleSSHConnection(request: Request, env: Env): Promise<Response> {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return Response.json(
      { error: 'Expected WebSocket upgrade' },
      { status: 426 }
    );
  }

  // 不再从 URL 传递凭据，DO 会等待 WebSocket 消息
  const doId = env.SSH_SESSION.idFromName(`session:${Date.now()}:${Math.random()}`);
  const stub = env.SSH_SESSION.get(doId);

  return stub.fetch(request);
}
