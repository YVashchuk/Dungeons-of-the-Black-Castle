const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const d=fs.readFileSync(path.join(REPO,'dist','podzemelye-chyornogo-zamka-remake.html'),'utf8');
const snips=[
 ['legacy alt', 'alt="${t(\'illyustraciya\')}"'],
 ['take btn', 'takeItem(${i})">${t(\'vzyat\')}</button>'],
 ['drop title', 'title="${t(\'vybrosit\')}">\\uD83D\\uDDD1', 2],
 ['eat title', 'title="${t(\'syest\')} (+${item.stamina}${t(\'vyn\')})"'],
 ['riddle span', "t('neverno_ostalos')+'<span id=\"riddle-attempts\">'"],
 ['title alt', 'alt="${t(\'alt_title_lettering\')}">'],
 ['vmeshke', "t('v_meshke_lbl')+' ('+getBagUsed()"],
 ['choices scroll cap (UI-01)', 'max-height:52dvh;overscroll-behavior:contain', 1],
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
 ['dialog roles (UI-04)', 'role="dialog" aria-modal="true"', 7],
 ['dialog controller (UI-04)', 'BC_A11Y_DIALOGS', 2],
 ['notification live region (UI-04)', "el.setAttribute('aria-live','polite')", 1],
];
let ok=0,bad=0;
snips.forEach(([n,s,exp])=>{ const e=exp||1; const c=d.split(s).length-1; if(c===e)ok++; else {bad++; console.log('FAIL '+n+' count='+c+' expected='+e);} });
['vzyat_2','onload_this_classlist_add_loaded','title_vybrosit','title_sest','vyn_style_color_3c9','neverno_ostalos_popytok','alt_podzemelya_chernogo_zamka','"v_meshke"'].forEach(k=>{ if(d.includes(k)){bad++; console.log('FAIL removed key present: '+k);} else ok++; });
console.log('DIST REFACTOR CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
