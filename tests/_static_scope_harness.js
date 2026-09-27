// _static_scope_harness.js - static checks over the shipped sources (group_99, 2026-09-27).
// Catches what the behavioural harnesses cannot: identifiers used but never declared, implicit globals
// (e.g. a `//` comment that swallowed a declaration), inline handlers calling missing functions, dead
// top-level functions, i18n keys used but missing (and ui keys nobody uses), element ids looked up but
// never defined, and debug leftovers. Runs from a bare archive (vendored acorn fallback).
let acorn; try { acorn = require('acorn'); } catch (e) { acorn = require('./vendor/acorn.js'); }
const fs = require('fs'), path = require('path');
const REPO = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(REPO, f), 'utf8');
let pass = 0, fail = 0; const ck = (d, c, info) => { if (c) pass++; else { fail++; console.log('  FAIL: ' + d + (info ? ' -> ' + info : '')); } };

const srcFiles = fs.readdirSync(path.join(REPO, 'src')).filter(f => f.endsWith('.js')).map(f => 'src/' + f);
const codeFiles = srcFiles.filter(f => !/locale\.|game_structure/.test(f));
const shell = rd('src/game_shell_top.html');
const allCode = codeFiles.map(rd).join('\n') + '\n' + shell;
const RU = JSON.parse(rd('src/locale.ru.js').match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);

const KNOWN = new Set(('window document localStorage sessionStorage console Math JSON Object Array String Number Boolean Date RegExp Error TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError Promise Set Map WeakMap WeakSet WeakRef Symbol BigInt parseInt parseFloat isNaN isFinite setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame requestIdleCallback navigator location history fetch Response Request Headers URL URLSearchParams Blob File FileReader Audio Image HTMLElement HTMLMediaElement HTMLSelectElement HTMLInputElement HTMLButtonElement Event CustomEvent KeyboardEvent MouseEvent PointerEvent TouchEvent FocusEvent InputEvent MutationObserver ResizeObserver IntersectionObserver getComputedStyle matchMedia alert confirm prompt atob btoa encodeURIComponent decodeURIComponent encodeURI decodeURI escape unescape performance crypto caches speechSynthesis SpeechSynthesisUtterance AudioContext webkitAudioContext Intl Reflect Proxy globalThis undefined NaN Infinity arguments structuredClone queueMicrotask DOMParser XMLSerializer TextEncoder TextDecoder AbortController Node NodeList Element SVGElement screen devicePixelRatio innerWidth innerHeight scrollX scrollY open close print CSS visualViewport indexedDB BroadcastChannel Worker Notification getSelection DocumentFragment Range Text Comment Option FormData ArrayBuffer Uint8Array Uint8ClampedArray Int8Array Uint16Array Int16Array Uint32Array Int32Array Float32Array Float64Array DataView eval self top parent frames opener event name length status origin isSecureContext').split(/\s+/));
const KEYWORDS = new Set(['if', 'return', 'this', 'event', 'typeof', 'void', 'new', 'function', 'var', 'let', 'const']);

const declared = new Set(), assigned = new Set(), refs = [], topFns = {};
function addP(p) { if (!p) return; if (p.type === 'Identifier') declared.add(p.name); else if (p.type === 'ObjectPattern') p.properties.forEach(q => addP(q.type === 'RestElement' ? q.argument : q.value)); else if (p.type === 'ArrayPattern') p.elements.forEach(addP); else if (p.type === 'RestElement') addP(p.argument); else if (p.type === 'AssignmentPattern') addP(p.left); }
function walk(n, parent, key, file) {
  if (!n || typeof n.type !== 'string') return;
  switch (n.type) {
    case 'VariableDeclarator': addP(n.id); break;
    case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': if (n.id) declared.add(n.id.name); n.params.forEach(addP); break;
    case 'ClassDeclaration': case 'ClassExpression': if (n.id) declared.add(n.id.name); break;
    case 'CatchClause': addP(n.param); break;
    case 'AssignmentExpression': { const l = n.left; if (l.type === 'MemberExpression' && !l.computed && l.object.type === 'Identifier' && ['window', 'globalThis', 'self'].includes(l.object.name) && l.property.type === 'Identifier') declared.add(l.property.name); if (l.type === 'Identifier') assigned.add(l.name); break; }
    case 'Identifier': { const skip = parent && ((parent.type === 'MemberExpression' && key === 'property' && !parent.computed) || (['Property', 'MethodDefinition', 'PropertyDefinition'].includes(parent.type) && key === 'key' && !parent.computed) || ['LabeledStatement', 'BreakStatement', 'ContinueStatement'].includes(parent.type)); if (!skip) refs.push({ name: n.name, at: file + ':' + (n.loc ? n.loc.start.line : 0) }); break; }
  }
  for (const k in n) { if (k === 'type' || k === 'loc' || k === 'start' || k === 'end' || k === 'range') continue; const v = n[k]; if (Array.isArray(v)) v.forEach(x => { if (x && typeof x.type === 'string') walk(x, n, k, file); }); else if (v && typeof v.type === 'string') walk(v, n, k, file); }
}
const units = srcFiles.map(f => ({ file: f, code: rd(f) }));
[...shell.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].forEach((m, i) => units.push({ file: 'shell#' + i, code: m[1] }));
let parseErr = [];
for (const u of units) { let ast; try { ast = acorn.parse(u.code, { ecmaVersion: 'latest', sourceType: 'script', locations: true, allowReturnOutsideFunction: true }); } catch (e) { parseErr.push(u.file + ': ' + e.message); continue; } const tops = {}; ast.body.forEach(b => { if (b.type === 'FunctionDeclaration') tops[b.id.name] = (tops[b.id.name] || 0) + 1; }); topFns[u.file] = tops; walk(ast, null, null, u.file); }
ck('every source file parses', parseErr.length === 0, parseErr.join('; '));

const und = {}; for (const r of refs) { if (declared.has(r.name) || KNOWN.has(r.name)) continue; (und[r.name] = und[r.name] || []).push(r.at); }
const never = Object.keys(und).filter(n => !assigned.has(n)), implicit = Object.keys(und).filter(n => assigned.has(n));
ck('no identifier is used without a declaration (browser globals excepted)', never.length === 0, never.map(n => n + ' @' + und[n][0]).join('; '));
ck('no implicit globals (assigned but never declared - e.g. a declaration swallowed by a // comment)', implicit.length === 0, implicit.map(n => n + ' @' + und[n][0]).join('; '));

const handlers = [...new Set([...allCode.matchAll(/\bon[a-z]+="\s*(?:return\s+)?([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]))].filter(n => !KEYWORDS.has(n));
const badH = handlers.filter(n => !declared.has(n) && !KNOWN.has(n));
ck('inline on*= handlers call declared functions', badH.length === 0, badH.join(', '));

const dupTop = []; for (const f in topFns) for (const [k, v] of Object.entries(topFns[f])) if (v > 1) dupTop.push(f + ':' + k + ' x' + v);
ck('no top-level function is declared twice in one file', dupTop.length === 0, dupTop.join(', '));

const deadFns = []; for (const f of ['src/game_logic.js', 'src/map_module.js']) for (const name of Object.keys(topFns[f] || {})) { const n = (allCode.match(new RegExp('\\b' + name.replace(/\$/g, '\\$') + '\\b', 'g')) || []).length; if (n <= 1) deadFns.push(f.replace('src/', '') + ':' + name); }
ck('no dead top-level functions in the engine and the map module', deadFns.length === 0, deadFns.join(', '));

const tKeys = new Set([...allCode.matchAll(/\bt\(\s*(['"])([A-Za-z0-9_]+)\1/g)].map(m => m[2]));
const attrKeys = new Set([...allCode.matchAll(/data-i18n(?:-aria|-title|-placeholder)?="([A-Za-z0-9_]+)"/g)].map(m => m[1]));
const missing = [...new Set([...tKeys, ...attrKeys])].filter(k => !(k in RU.ui));
ck('every t() / data-i18n key exists in LOCALE_RU.ui', missing.length === 0, missing.join(', '));
const unusedUi = Object.keys(RU.ui).filter(k => !attrKeys.has(k) && !new RegExp("['\"`]" + k + "['\"`]").test(allCode));
ck('every LOCALE_RU.ui key is used by the code or the shell', unusedUi.length === 0, unusedUi.join(', '));

const usedIds = new Set([...allCode.matchAll(/getElementById\(\s*['"]([A-Za-z0-9_-]+)['"]\s*\)/g)].map(m => m[1]).concat([...allCode.matchAll(/querySelector(?:All)?\(\s*['"]#([A-Za-z0-9_-]+)/g)].map(m => m[1])));
const defIds = new Set([...allCode.matchAll(/\bid=\\?["']([A-Za-z0-9_-]+)\\?["']/g)].map(m => m[1]).concat([...allCode.matchAll(/\.id\s*=\s*['"]([A-Za-z0-9_-]+)['"]/g)].map(m => m[1])).concat([...allCode.matchAll(/setAttribute\(\s*['"]id['"]\s*,\s*['"]([A-Za-z0-9_-]+)['"]/g)].map(m => m[1])));
const idMiss = [...usedIds].filter(i => !defIds.has(i));
ck('every element id looked up is defined in the shell or the code', idMiss.length === 0, idMiss.join(', '));

const dbg = []; for (const f of codeFiles) rd(f).split(/\r?\n/).forEach((l, i) => { if (/\bconsole\.log\(|\bdebugger\b/.test(l)) dbg.push(f + ':' + (i + 1)); });
ck('no console.log / debugger in shipped code', dbg.length === 0, dbg.join(', '));

console.log('STATIC-SCOPE HARNESS: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
