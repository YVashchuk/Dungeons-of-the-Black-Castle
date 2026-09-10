#!/usr/bin/env node
// tts_pregenerate.js - render narration files with the OpenAI speech API for one language (V-03, group_88).
// Usage: OPENAI_API_KEY=sk-... node scripts/tts_pregenerate.js --lang ru [--voice onyx] [--model gpt-4o-mini-tts] [--from 1] [--to 1221] [--concurrency 3] [--dry] [--out <dir>]
// --out <dir>: write samples elsewhere (e.g. dist/audio_samples/ru-onyx-hd); the manifest is only updated for the default location.
// Output: dist/audio/<lang>/<N>.mp3 (+ preface.mp3, pregame.mp3) and dist/audio/manifest.json; existing files are skipped (resumable).
// The game plays these files without an API key when the manifest lists them; dist/audio is git-ignored by default.
const fs = require('fs'); const path = require('path');
const args = process.argv.slice(2); const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const LANG = opt('lang', 'ru'), VOICE = opt('voice', 'onyx'), MODEL = opt('model', 'gpt-4o-mini-tts'), FROM = Number(opt('from', 1)), TO = Number(opt('to', 1221)), CONC = Number(opt('concurrency', 3)), DRY = args.includes('--dry');
const KEY = process.env.OPENAI_API_KEY; if (!KEY && !DRY) { console.error('OPENAI_API_KEY is not set'); process.exit(1); }
const ROOT = path.join(__dirname, '..'); const src = fs.readFileSync(path.join(ROOT, 'src', 'locale.' + LANG + '.js'), 'utf8');
const L = JSON.parse(src.match(/const\s+LOCALE_[A-Z]{2}\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]);
const clean = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\(\s*\d{1,4}\s*\)/g, '').replace(/\s+/g, ' ').trim();
const jobs = []; for (let n = FROM; n <= TO; n++) { const p = L.p && L.p[String(n)]; if (p && p.t) jobs.push({ key: String(n), text: clean(p.t) }); }
if (L.preface) jobs.push({ key: 'preface', text: clean(L.preface) }); if (L.pregame) jobs.push({ key: 'pregame', text: clean(L.pregame) });
const OUT = opt('out', null); const outDir = OUT ? path.resolve(ROOT, OUT) : path.join(ROOT, 'dist', 'audio', LANG); fs.mkdirSync(outDir, { recursive: true });
const manPath = path.join(ROOT, 'dist', 'audio', 'manifest.json'); let manifest = {}; try { manifest = JSON.parse(fs.readFileSync(manPath, 'utf8')); } catch (e) {}
manifest[LANG] = manifest[LANG] || {};
const todo = jobs.filter(j => !fs.existsSync(path.join(outDir, j.key + '.mp3')));
const chars = todo.reduce((s, j) => s + j.text.length, 0);
console.log(LANG + ': ' + jobs.length + ' texts, ' + todo.length + ' to render, ' + chars + ' characters (' + (chars / 1e6).toFixed(2) + ' M) with ' + MODEL + '/' + VOICE);
if (DRY) process.exit(0);
const chunk = t => { const parts = t.match(/[^.!?\u2026]+[.!?\u2026]+["\u00bb)]?|[^.!?\u2026]+$/g) || [t]; const out = []; let buf = ''; for (const p of parts) { if ((buf + p).length > 3500 && buf.trim()) { out.push(buf.trim()); buf = p; } else buf += p; } if (buf.trim()) out.push(buf.trim()); return out; };
async function render(job) { const parts = chunk(job.text); const bufs = []; for (const input of parts) { const body = { model: MODEL, voice: VOICE, input, response_format: 'mp3' }; if (MODEL.startsWith('gpt-4o')) body.instructions = (L.ui && L.ui.ui_voice_style) || 'Read as a calm dark-fantasy narrator.'; const r = await fetch('https://api.openai.com/v1/audio/speech', { method: 'POST', headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(job.key + ': HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200)); bufs.push(Buffer.from(await r.arrayBuffer())); } fs.writeFileSync(path.join(outDir, job.key + '.mp3'), Buffer.concat(bufs)); manifest[LANG][job.key] = true; }
(async () => { let i = 0, done = 0, failed = 0; const manifestOn = !OUT; const worker = async () => { while (i < todo.length) { const job = todo[i++]; try { await render(job); done++; if (done % 10 === 0) { if (manifestOn) fs.writeFileSync(manPath, JSON.stringify(manifest)); console.log('  ' + done + '/' + todo.length); } } catch (e) { failed++; console.error('  FAIL ' + e.message); } } }; await Promise.all(Array.from({ length: Math.max(1, CONC) }, worker)); if (manifestOn) { for (const j of jobs) if (fs.existsSync(path.join(outDir, j.key + '.mp3'))) manifest[LANG][j.key] = true; fs.writeFileSync(manPath, JSON.stringify(manifest)); } console.log('done: ' + done + ' rendered, ' + failed + ' failed' + (manifestOn ? ', manifest ' + Object.keys(manifest[LANG]).length + ' entries -> ' + manPath : ', samples in ' + outDir)); })();
