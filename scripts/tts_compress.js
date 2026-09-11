#!/usr/bin/env node
// tts_compress.js - transcode the narration pack from the OpenAI mp3 masters (128 kbps) to AAC-LC mono for publishing (V-05, group_88).
// Usage: node scripts/tts_compress.js [--lang ru,en,fr,uk] [--kbps 48] [--concurrency 4] [--ffmpeg <path>]
// Masters are moved to _handoff/audio_master/<lang>/ (git-ignored); dist/audio/<lang>/<N>.m4a is written; manifest gets "ext":"m4a".
const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const args = process.argv.slice(2); const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const LANGS = opt('lang', 'ru,en,fr,uk').split(','), KBPS = Number(opt('kbps', 48)), CONC = Number(opt('concurrency', 4));
const ROOT = path.join(__dirname, '..');
function findFfmpeg() { const given = opt('ffmpeg', process.env.FFMPEG); if (given && fs.existsSync(given)) return given; const local = path.join(ROOT, '_handoff', 'tools', 'ffmpeg'); if (fs.existsSync(local)) { const stack = [local]; while (stack.length) { const d = stack.pop(); for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) stack.push(p); else if (f.toLowerCase() === 'ffmpeg.exe' || f === 'ffmpeg') return p; } } } return 'ffmpeg'; }
const FFMPEG = findFfmpeg(); console.log('ffmpeg: ' + FFMPEG + ' | AAC ' + KBPS + ' kbps mono 32 kHz | concurrency ' + CONC);
const manPath = path.join(ROOT, 'dist', 'audio', 'manifest.json'); let manifest = {}; try { manifest = JSON.parse(fs.readFileSync(manPath, 'utf8')); } catch (e) {}
function encode(src, dst) { return new Promise((res, rej) => { const p = spawn(FFMPEG, ['-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '32000', '-c:a', 'aac', '-b:a', KBPS + 'k', '-movflags', '+faststart', dst], { stdio: ['ignore', 'ignore', 'pipe'] }); let err = ''; p.stderr.on('data', d => { err += d; }); p.on('close', c => c === 0 ? res() : rej(new Error(err.trim() || ('exit ' + c)))); p.on('error', rej); }); }
(async () => {
  for (const L of LANGS) {
    const dir = path.join(ROOT, 'dist', 'audio', L); if (!fs.existsSync(dir)) { console.log(L + ': no folder'); continue; }
    const masterDir = path.join(ROOT, '_handoff', 'audio_master', L); fs.mkdirSync(masterDir, { recursive: true });
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));
    let i = 0, done = 0, failed = 0; const t0 = Date.now();
    const worker = async () => { while (i < files.length) { const f = files[i++]; const key = f.replace(/\.mp3$/, ''); const src = path.join(dir, f), dst = path.join(dir, key + '.m4a'); try { if (!fs.existsSync(dst) || fs.statSync(dst).size === 0) await encode(src, dst); fs.renameSync(src, path.join(masterDir, f)); done++; if (done % 100 === 0) console.log('  ' + L + ' ' + done + '/' + files.length); } catch (e) { failed++; console.error('  FAIL ' + L + '/' + f + ': ' + String(e.message).slice(0, 120)); } } };
    await Promise.all(Array.from({ length: Math.max(1, CONC) }, worker));
    const m4a = fs.readdirSync(dir).filter(f => f.endsWith('.m4a')); const size = m4a.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
    manifest[L] = manifest[L] || {}; for (const f of m4a) manifest[L][f.replace(/\.m4a$/, '')] = true; manifest.ext = 'm4a'; fs.writeFileSync(manPath, JSON.stringify(manifest));
    console.log(L + ': ' + done + ' encoded, ' + failed + ' failed, ' + m4a.length + ' m4a files, ' + (size / 1048576).toFixed(1) + ' MB, ' + Math.round((Date.now() - t0) / 1000) + ' s');
  }
  console.log('manifest ext=' + manifest.ext + ' -> ' + manPath);
})();
