const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const d=fs.readFileSync(REPO+'\\dist\\podzemelye-chyornogo-zamka-remake.html','utf8');
const snips=[
 ['legacy alt', 'alt="${t(\'illyustraciya\')}"'],
 ['take btn', 'takeItem(${i})">${t(\'vzyat\')}</button>'],
 ['drop title', 'title="${t(\'vybrosit\')}">\\uD83D\\uDDD1'],
 ['eat title', 'title="${t(\'syest\')} (+${item.stamina}${t(\'vyn\')})"'],
 ['riddle span', "t('neverno_ostalos')+'<span id=\"riddle-attempts\">'"],
 ['title alt', 'alt="${t(\'alt_title_lettering\')}">'],
 ['vmeshke', "t('v_meshke_lbl')+' ('+getBagUsed()"],
];
let ok=0,bad=0;
snips.forEach(([n,s])=>{ const c=d.split(s).length-1; if(c===1)ok++; else {bad++; console.log('FAIL '+n+' count='+c);} });
['vzyat_2','onload_this_classlist_add_loaded','title_vybrosit','title_sest','vyn_style_color_3c9','neverno_ostalos_popytok','alt_podzemelya_chernogo_zamka','"v_meshke"'].forEach(k=>{ if(d.includes(k)){bad++; console.log('FAIL removed key present: '+k);} else ok++; });
console.log('DIST REFACTOR CHECK: '+ok+' passed, '+bad+' failed');
