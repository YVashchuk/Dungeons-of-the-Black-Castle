const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const d=fs.readFileSync(path.join(REPO,'dist','dungeons-of-the-black-castle.html'),'utf8');
const snips=[
 ['legacy alt', 'alt="${t(\'illyustraciya\')}"'],
 ['take btn', 'takeItem(${i})">${t(\'vzyat\')}</button>'],
 ['drop title', 'title="${t(\'vybrosit\')}">\\uD83D\\uDDD1', 2],
 ['eat title', 'title="${t(\'syest\')} (+${item.stamina}${t(\'vyn\')})"'],
 ['riddle span', "t('neverno_ostalos')+'<span id=\"riddle-attempts\">'"],
 ['title alt', 'alt="${t(\'alt_title_lettering\')}">'],
 ['vmeshke', "t('v_meshke_lbl')+' ('+getBagUsed()"],
 ['reading column + choices in flow (UI-11)', '.reader{max-width:72ch;margin:0 auto;', 1],
 ['choices title in flow (UI-11)', 'class="choices-title" data-i18n="ui_your_choice"', 1],
 ['hud bar (UI-03)', 'id="hud-bar"', 1],
 ['bottom sheet (UI-03)', 'id="overlay-sheet"', 1],
 ['mobile sheets controller (UI-03)', 'BC_MOBILE_SHEETS', 2],
 ['landscape sidebar range (UI-03/CA-11)', '@media (min-width: 701px) and (max-width: 960px) and (orientation: landscape)', 1],
 ['sidebar mini-map shown (CA-17)', 'class="map-section" id="sb-map">', 1],
 ['event-log panel dialog (CA-10)', 'id="event-log-panel" role="dialog"', 1],
 ['dialog open-order stack (UA-01)', 'var _bcDialogStack=[];', 1],
 ['inventory drop button (UA-02)', 'class="inv-remove" onclick="removeItem(${i})" aria-label=', 1],
 ['combat round status region (UA-03)', 'id="combat-round-status" role="status" aria-live="polite"', 1],
 ['hud emoji-free aria keys (UA-04)', 'data-i18n-aria="ui_aria_map"', 1],
 ['combat hp track styled (UI-02)', '.combat-hp-track{height:8px', 1],
 ['status pills styled (UI-02)', '.ce-status-pill.state-waiting{color:var(--gold2)', 1],
 ['art toggle wired (UI-02)', 'body.hide-inline-art .illustration-container{display:none', 1],
 ['spell counter chip present (UI-08)', 'id="spell-counter-chip"', 1],
 ['qty disabled styling (UI-08)', '.qty-btn:disabled{opacity', 1],
 ['tap token (UI-05)', '--tap:44px', 1],
 ['muted contrast bump (UI-05)', '--muted:#8a7a9e', 1],
 ['aria channel (UI-09)', "querySelectorAll('[data-i18n-aria]')", 1],
 ['autosave note (UI-10)', 'id="autosave-note"', 1],
 ['reduced motion (UI-10)', 'prefers-reduced-motion: reduce', 1],
 ['viewport-fit (UI-06)', 'viewport-fit=cover', 1],
 ['safe-area on fixed shell (UI-06)', '.scr,.modal-overlay{padding-top:var(--safe-top);', 1],
 ['title short-viewport rule (UI-06)', '#scr-title .t-content { margin: auto;', 1],
 ['focus ring (UI-04)', ':focus-visible{outline:2px solid var(--gold2)', 1],
 ['dialog roles (UI-04)', 'role="dialog" aria-modal="true"', 8],
 ['dialog controller (UI-04)', 'BC_A11Y_DIALOGS', 2],
 ['persistent live region (UI-04/CA-04)', 'id="bc-notif-live" role="status" aria-live="polite"', 1],
 ['keyboard-reachable import input (CA-07)', 'accept=".json" class="sr-only"', 1],
 ['combat status reset hook (CA-06)', 'window._bcCombatStatusReset=function', 1],
 ['forum cyrillic display (UI-07)', "font-family: 'Forum';", 1],
 ['font chain with Forum (UI-07)', "--font-ui:'Cinzel','Forum','Cormorant Garamond',serif", 1],
 ['menu heading regular weight (CU-08)', '.menu-content h2{font-family:var(--font-ui);color:var(--gold);font-weight:400;', 1],
 ['single M shortcut per layout (CU-10)', "const k=ev.key||''; const isM=(k.toLowerCase()==='m')||(ev.code==='KeyM'&&!/^[\\x20-\\x7e]$/.test(k));", 1],
];
let ok=0,bad=0;
snips.forEach(([n,s,exp])=>{ const e=exp||1; const c=d.split(s).length-1; if(c===e)ok++; else {bad++; console.log('FAIL '+n+' count='+c+' expected='+e);} });
['vzyat_2','onload_this_classlist_add_loaded','title_vybrosit','title_sest','vyn_style_color_3c9','neverno_ostalos_popytok','alt_podzemelya_chernogo_zamka','"v_meshke"','Veles Redone','Cyrillic Old Face'].forEach(k=>{ if(d.includes(k)){bad++; console.log('FAIL removed key present: '+k);} else ok++; });
// group_82 CU-07: the font license travels with the built artifact
try{ const ofl=fs.readFileSync(require('path').join(__dirname,'..','dist','OFL.txt'),'utf8'); if(ofl.includes('Cinzel Project Authors')&&ofl.includes('Cormorant Project Authors')&&ofl.includes('Reserved Font Name')&&ofl.includes('SIL OPEN FONT LICENSE')) ok++; else {bad++; console.log('FAIL dist/OFL.txt notices');} }catch(e){ bad++; console.log('FAIL dist/OFL.txt missing'); }
console.log('DIST REFACTOR CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
