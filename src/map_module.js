(function(){
  if(window.__BC_GAME_MAP_PATCH_V1__) return; window.__BC_GAME_MAP_PATCH_V1__=true;

  const BC_MAP_DEF = {"meta": {"name": "blackcastle_game_map_metadata_v1", "format": "json", "version": 1, "coordinate_space": "pixels", "chosen_format_reason": "JSON easiest for runtime JS, version control, fog-of-war state sync, and SVG/canvas rendering.", "notes": ["Это production-ready starter metadata для realtime карты.", "Карта разбита на слои: внешний мир, подходы к замку, внутренние уровни замка.", "На развилке показываются stub-сегменты непроверенных дорог, если узел уже открыт."]}, "layers": {"overworld": {"title": "vneshniy_mir", "width": 1600, "height": 1000, "theme": "forest"}, "castle_exterior": {"title": "podhody_k_zamku", "width": 1200, "height": 900, "theme": "castle"}, "castle_interior": {"title": "vnutrennie_urovni_zamka", "width": 1600, "height": 1200, "theme": "dungeon"}}, "nodes": [{"id": "ow_start_road", "layer": "overworld", "title": "startovaya_doroga", "kind": "crossroad", "x": 140, "y": 820, "paragraph_refs": [1, 14], "tags": ["road", "start"], "icon": "road"}, {"id": "ow_hill_fork", "layer": "overworld", "title": "razvilka_u_holma", "kind": "fork", "x": 260, "y": 720, "paragraph_refs": [14, 17], "tags": ["road", "fork"], "icon": "fork"}, {"id": "ow_merchant_hut", "layer": "overworld", "title": "lesnoy_torgovec", "kind": "house", "x": 430, "y": 630, "paragraph_refs": [132, 381], "tags": ["house", "merchant"], "icon": "house"}, {"id": "ow_speaking_cottage", "layer": "overworld", "title": "govoryaschiy_domik", "kind": "house", "x": 300, "y": 470, "paragraph_refs": [163, 284, 627], "tags": ["house", "magic"], "icon": "house"}, {"id": "ow_forest_crossroads", "layer": "overworld", "title": "lesnoy_perekrestok", "kind": "crossroad", "x": 520, "y": 500, "paragraph_refs": [80, 1203], "tags": ["road", "forest"], "icon": "crossroad"}, {"id": "ow_village_edge", "layer": "overworld", "title": "podstupy_k_derevne", "kind": "settlement", "x": 700, "y": 470, "paragraph_refs": [332, 340], "tags": ["village"], "icon": "village"}, {"id": "ow_tavern", "layer": "overworld", "title": "taverna", "kind": "house", "x": 770, "y": 410, "paragraph_refs": [333, 922], "tags": ["tavern", "merchant"], "icon": "house"}, {"id": "ow_marsh_path", "layer": "overworld", "title": "bolotnaya_tropa", "kind": "path", "x": 560, "y": 320, "paragraph_refs": [93, 130], "tags": ["marsh", "forest"], "icon": "path"}, {"id": "ow_river_left_bank", "layer": "overworld", "title": "levyy_bereg_reki", "kind": "riverbank", "x": 980, "y": 640, "paragraph_refs": [57, 72], "tags": ["river", "bank"], "icon": "water"}, {"id": "ow_island", "layer": "overworld", "title": "ostrov_posredi_reki", "kind": "landmark", "x": 1100, "y": 520, "paragraph_refs": [290, 582], "tags": ["island", "river"], "icon": "island"}, {"id": "ow_right_bank", "layer": "overworld", "title": "drugoy_bereg", "kind": "riverbank", "x": 1220, "y": 640, "paragraph_refs": [60, 601, 1217], "tags": ["river", "bank"], "icon": "water"}, {"id": "ow_ravine_bridge", "layer": "overworld", "title": "most_nad_ovragom", "kind": "bridge", "x": 1180, "y": 420, "paragraph_refs": [631], "tags": ["bridge", "road"], "icon": "bridge"}, {"id": "ow_castle_view", "layer": "overworld", "title": "pervyy_vid_na_chernyy_zamok", "kind": "landmark", "x": 1290, "y": 290, "paragraph_refs": [244, 250, 330], "tags": ["castle", "view"], "icon": "castle"}, {"id": "ow_gates_approach", "layer": "overworld", "title": "podhod_k_vorotam", "kind": "gate", "x": 1440, "y": 280, "paragraph_refs": [56, 205, 933, 1054], "tags": ["castle", "gates"], "icon": "gate"}, {"id": "ow_rock_detour", "layer": "overworld", "title": "skala_i_obhodnaya_tropa", "kind": "fork", "x": 860, "y": 760, "paragraph_refs": [122, 306, 412, 372, 311], "tags": ["rock", "fork"], "icon": "fork"}, {"id": "ow_palm_grove", "layer": "overworld", "title": "palmy_i_banany", "kind": "resource", "x": 930, "y": 860, "paragraph_refs": [75, 543], "tags": ["food", "palm"], "icon": "resource"}, {"id": "ce_gate_courtyard", "layer": "castle_exterior", "title": "vorota_i_karaul", "kind": "gate", "x": 170, "y": 470, "paragraph_refs": [1065, 1175, 1221], "tags": ["gates", "orcs"], "icon": "gate"}, {"id": "ce_guardhouse", "layer": "castle_exterior", "title": "storozhka", "kind": "house", "x": 370, "y": 350, "paragraph_refs": [588, 159, 752], "tags": ["guardhouse"], "icon": "house"}, {"id": "ce_central_yard", "layer": "castle_exterior", "title": "centralnyy_dvor", "kind": "yard", "x": 610, "y": 470, "paragraph_refs": [845], "tags": ["yard"], "icon": "yard"}, {"id": "ce_high_building", "layer": "castle_exterior", "title": "vysokoe_zdanie", "kind": "tower", "x": 870, "y": 250, "paragraph_refs": [145, 845], "tags": ["tower"], "icon": "tower"}, {"id": "ce_low_building", "layer": "castle_exterior", "title": "nizkoe_zdanie_sprava", "kind": "house", "x": 900, "y": 610, "paragraph_refs": [845], "tags": ["annex"], "icon": "house"}, {"id": "ce_river_wall", "layer": "castle_exterior", "title": "stena_u_reki", "kind": "wall", "x": 1020, "y": 780, "paragraph_refs": [845, 601], "tags": ["river", "wall"], "icon": "wall"}, {"id": "ci_grand_corridor", "layer": "castle_interior", "title": "bolshoy_koridor", "kind": "corridor", "x": 220, "y": 200, "paragraph_refs": [833, 1013, 1097], "tags": ["castle", "corridor"], "icon": "corridor"}, {"id": "ci_captain_room", "layer": "castle_interior", "title": "komnata_nachalnika_strazhi", "kind": "room", "x": 430, "y": 170, "paragraph_refs": [349, 754, 1046], "tags": ["captain"], "icon": "room"}, {"id": "ci_orc_hall", "layer": "castle_interior", "title": "zal_s_orkami", "kind": "room", "x": 670, "y": 180, "paragraph_refs": [43, 1003, 1065, 1177], "tags": ["orcs", "combat"], "icon": "room"}, {"id": "ci_lift_shaft", "layer": "castle_interior", "title": "lift_i_shahta", "kind": "vertical", "x": 920, "y": 170, "paragraph_refs": [980, 1040, 1068], "tags": ["lift", "stairs"], "icon": "vertical"}, {"id": "ci_library", "layer": "castle_interior", "title": "biblioteka", "kind": "room", "x": 470, "y": 390, "paragraph_refs": [324, 441, 1026], "tags": ["library"], "icon": "library"}, {"id": "ci_mirror_bedroom", "layer": "castle_interior", "title": "komnata_s_krovatyami_i_zerkalom", "kind": "room", "x": 770, "y": 390, "paragraph_refs": [1019, 1024, 1057], "tags": ["mirror", "beds"], "icon": "room"}, {"id": "ci_water_room", "layer": "castle_interior", "title": "komnata_s_kranami", "kind": "room", "x": 1030, "y": 430, "paragraph_refs": [1018, 1027, 1211], "tags": ["water"], "icon": "water"}, {"id": "ci_gambling_room", "layer": "castle_interior", "title": "igralnaya_komnata", "kind": "room", "x": 230, "y": 620, "paragraph_refs": [826, 1033, 1039, 1102, 1212], "tags": ["dice"], "icon": "room"}, {"id": "ci_cell_block", "layer": "castle_interior", "title": "tyuremnyy_blok", "kind": "room", "x": 510, "y": 690, "paragraph_refs": [1030, 1106], "tags": ["dungeon", "cells"], "icon": "room"}, {"id": "ci_secret_loot", "layer": "castle_interior", "title": "tayniki_i_kladovki", "kind": "room", "x": 780, "y": 690, "paragraph_refs": [1035, 1036, 1208], "tags": ["loot"], "icon": "treasure"}, {"id": "ci_princess_chamber", "layer": "castle_interior", "title": "pokoi_princessy", "kind": "room", "x": 1110, "y": 650, "paragraph_refs": [81, 1220], "tags": ["princess"], "icon": "princess"}, {"id": "ci_trap_corridors", "layer": "castle_interior", "title": "lovushki_dveri_drakon", "kind": "corridor", "x": 1310, "y": 390, "paragraph_refs": [1082, 1083, 1206, 1207, 440, 532, 437], "tags": ["trap"], "icon": "corridor"}, {"id": "ci_throne_and_mirror", "layer": "castle_interior", "title": "tron_shkaf_i_zerkalo", "kind": "room", "x": 1360, "y": 770, "paragraph_refs": [682, 741, 969, 1071], "tags": ["throne"], "icon": "throne"}], "edges": [{"id": "e_ow_1", "layer": "overworld", "from": "ow_start_road", "to": "ow_hill_fork", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_2", "layer": "overworld", "from": "ow_hill_fork", "to": "ow_merchant_hut", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_3", "layer": "overworld", "from": "ow_hill_fork", "to": "ow_speaking_cottage", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_4", "layer": "overworld", "from": "ow_merchant_hut", "to": "ow_forest_crossroads", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_5", "layer": "overworld", "from": "ow_speaking_cottage", "to": "ow_forest_crossroads", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_6", "layer": "overworld", "from": "ow_forest_crossroads", "to": "ow_village_edge", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_7", "layer": "overworld", "from": "ow_village_edge", "to": "ow_tavern", "type": "street", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_8", "layer": "overworld", "from": "ow_forest_crossroads", "to": "ow_marsh_path", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_9", "layer": "overworld", "from": "ow_village_edge", "to": "ow_river_left_bank", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_10", "layer": "overworld", "from": "ow_river_left_bank", "to": "ow_island", "type": "boat", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_11", "layer": "overworld", "from": "ow_island", "to": "ow_right_bank", "type": "boat", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_12", "layer": "overworld", "from": "ow_right_bank", "to": "ow_ravine_bridge", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_13", "layer": "overworld", "from": "ow_ravine_bridge", "to": "ow_castle_view", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_14", "layer": "overworld", "from": "ow_castle_view", "to": "ow_gates_approach", "type": "road", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_15", "layer": "overworld", "from": "ow_forest_crossroads", "to": "ow_rock_detour", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_16", "layer": "overworld", "from": "ow_rock_detour", "to": "ow_palm_grove", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ow_17", "layer": "overworld", "from": "ow_palm_grove", "to": "ow_right_bank", "type": "path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ce_1", "layer": "castle_exterior", "from": "ce_gate_courtyard", "to": "ce_guardhouse", "type": "yard_path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ce_2", "layer": "castle_exterior", "from": "ce_gate_courtyard", "to": "ce_central_yard", "type": "gate", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ce_3", "layer": "castle_exterior", "from": "ce_central_yard", "to": "ce_high_building", "type": "yard_path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ce_4", "layer": "castle_exterior", "from": "ce_central_yard", "to": "ce_low_building", "type": "yard_path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ce_5", "layer": "castle_exterior", "from": "ce_central_yard", "to": "ce_river_wall", "type": "yard_path", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_1", "layer": "castle_interior", "from": "ci_grand_corridor", "to": "ci_captain_room", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_2", "layer": "castle_interior", "from": "ci_captain_room", "to": "ci_orc_hall", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_3", "layer": "castle_interior", "from": "ci_orc_hall", "to": "ci_lift_shaft", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_4", "layer": "castle_interior", "from": "ci_captain_room", "to": "ci_library", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_5", "layer": "castle_interior", "from": "ci_orc_hall", "to": "ci_mirror_bedroom", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_6", "layer": "castle_interior", "from": "ci_lift_shaft", "to": "ci_water_room", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_7", "layer": "castle_interior", "from": "ci_grand_corridor", "to": "ci_gambling_room", "type": "stairs", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_8", "layer": "castle_interior", "from": "ci_library", "to": "ci_cell_block", "type": "corridor", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_9", "layer": "castle_interior", "from": "ci_mirror_bedroom", "to": "ci_secret_loot", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_10", "layer": "castle_interior", "from": "ci_water_room", "to": "ci_princess_chamber", "type": "corridor", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_11", "layer": "castle_interior", "from": "ci_mirror_bedroom", "to": "ci_trap_corridors", "type": "corridor", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}, {"id": "e_ci_12", "layer": "castle_interior", "from": "ci_trap_corridors", "to": "ci_throne_and_mirror", "type": "door", "bidirectional": true, "reveal_policy": "show_stub_from_discovered"}], "encounters": [{"id": "enc_wood_goblin", "title": "lesnoy_starik_goblin", "node_id": "ow_speaking_cottage", "kind": "enemy", "paragraph_refs": [50, 76, 79], "victory_icon": "gold_crossed_sabers"}, {"id": "enc_gate_guards", "title": "strazha_u_vorot", "node_id": "ow_gates_approach", "kind": "enemy", "paragraph_refs": [56, 205, 933, 1054], "victory_icon": "gold_crossed_sabers"}, {"id": "enc_orc_gatehall", "title": "orki_u_vorot_zamka", "node_id": "ce_gate_courtyard", "kind": "enemy", "paragraph_refs": [1065, 1175, 1221], "victory_icon": "gold_crossed_sabers"}, {"id": "enc_orc_hall", "title": "orki_v_zale", "node_id": "ci_orc_hall", "kind": "enemy", "paragraph_refs": [43, 1003, 1065, 1177], "victory_icon": "gold_crossed_sabers"}, {"id": "enc_princess_room", "title": "poslednyaya_strazha_pered_prince", "node_id": "ci_princess_chamber", "kind": "enemy", "paragraph_refs": [81], "victory_icon": "gold_crossed_sabers"}], "render_rules": {"fog_of_war": {"undiscovered_nodes_hidden": true, "discovered_nodes_visible": true, "traversed_edges_style": "solid_gold", "known_untraversed_exits_style": "short_dashed_stub", "victory_icon": "gold_crossed_sabers"}, "fullscreen_on_click": true, "zoom_enabled": true}};
  // Resolve display titles from LOCALE_RU.map (slug -> RU); slug kept in .titleKey for re-resolution / language switch.
(function(){ if(typeof LOCALE_RU==='undefined'||!LOCALE_RU.map) return; var R=function(o){ if(o&&typeof o.title==='string'){ o.titleKey=o.title; if(LOCALE_RU.map[o.title]!==undefined) o.title=LOCALE_RU.map[o.title]; } }; Object.values(BC_MAP_DEF.layers||{}).forEach(R); (BC_MAP_DEF.nodes||[]).forEach(R); (BC_MAP_DEF.encounters||[]).forEach(R); })();
const BC_MAP_STATE_TEMPLATE = {"meta": {"name": "blackcastle_game_map_state_template_v1", "version": 1}, "selected_layer": "overworld", "current_node": "ow_hill_fork", "discovered_nodes": ["ow_start_road", "ow_hill_fork", "ow_merchant_hut", "ow_speaking_cottage", "ow_forest_crossroads"], "traversed_edges": ["e_ow_1", "e_ow_2", "e_ow_3", "e_ow_4"], "victories": ["enc_wood_goblin"], "opened_layers": ["overworld"], "notes": "Пример состояния: игрок уже ходил от стартовой дороги к развилке, торговцу и говорящему Домику."};
  const MAP_NODE_BY_ID = Object.fromEntries(BC_MAP_DEF.nodes.map(n=>[n.id,n]));
  const MAP_PARAGRAPH_INDEX = {};
  BC_MAP_DEF.nodes.forEach(n => (n.paragraph_refs||[]).forEach(p => {
    const k=String(p); if(!MAP_PARAGRAPH_INDEX[k]) MAP_PARAGRAPH_INDEX[k]=[]; MAP_PARAGRAPH_INDEX[k].push(n.id);
  }));
  const MAP_EDGES_BY_NODE = {};
  BC_MAP_DEF.edges.forEach(e => {
    if(!MAP_EDGES_BY_NODE[e.from]) MAP_EDGES_BY_NODE[e.from]=[];
    if(!MAP_EDGES_BY_NODE[e.to]) MAP_EDGES_BY_NODE[e.to]=[];
    MAP_EDGES_BY_NODE[e.from].push(e);
    MAP_EDGES_BY_NODE[e.to].push(e);
  });
  const MAP_ENCOUNTERS_BY_SECTION = {};
  (BC_MAP_DEF.encounters||[]).forEach(enc => (enc.paragraph_refs||[]).forEach(p => {
    const k=String(p); if(!MAP_ENCOUNTERS_BY_SECTION[k]) MAP_ENCOUNTERS_BY_SECTION[k]=[]; MAP_ENCOUNTERS_BY_SECTION[k].push(enc.id);
  }));
  let gameMapZoom = 1;

  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
  
function ensureMapState(){
    if(!window.S) return null;
    if(!S.mapState) S.mapState = clone(BC_MAP_STATE_TEMPLATE);
    const ms = S.mapState;
    ms.discovered_nodes = Array.isArray(ms.discovered_nodes) ? ms.discovered_nodes : [];
    ms.traversed_edges = Array.isArray(ms.traversed_edges) ? ms.traversed_edges : [];
    ms.victories = Array.isArray(ms.victories) ? ms.victories : [];
    ms.opened_layers = Array.isArray(ms.opened_layers) ? ms.opened_layers : ['overworld'];
    ms.seen_edges = Array.isArray(ms.seen_edges) ? ms.seen_edges : [];
    if(!ms.selected_layer) ms.selected_layer = 'overworld';
    return ms;
  }

  function mapNodesForSection(sectionId){
    return (MAP_PARAGRAPH_INDEX[String(sectionId)]||[]).slice();
  }

  function findEdgeBetween(a,b){
    const edges = MAP_EDGES_BY_NODE[a] || [];
    return edges.find(e => (e.from===a && e.to===b) || (e.from===b && e.to===a)) || null;
  }

  function chooseSectionNode(sectionId, anchorNode){
    const ids = mapNodesForSection(sectionId);
    if(!ids.length) return null;
    if(ids.length===1) return ids[0];
    if(anchorNode && ids.includes(anchorNode)) return anchorNode;
    if(anchorNode){
      const connected = ids.filter(id => findEdgeBetween(anchorNode,id));
      if(connected.length===1) return connected[0];
      if(connected.length>1) return connected[0];
    }
    const ms = window.S && S.mapState ? S.mapState : null;
    if(ms && ms.current_node && ids.includes(ms.current_node)) return ms.current_node;
    return ids[0];
  }

  function addSeenEdge(edgeId){
    const ms = ensureMapState();
    if(ms && edgeId && !ms.seen_edges.includes(edgeId)) ms.seen_edges.push(edgeId);
  }

  function noteVisibleExitsForSection(sectionId, currentNode){
    if(!window.GD || !currentNode) return;
    const sec = GD[String(sectionId)];
    if(!sec || !Array.isArray(sec.choices)) return;
    sec.choices.forEach(ch=>{
      if(!ch || !ch.target) return;
      const targetNode = chooseSectionNode(ch.target, currentNode);
      if(!targetNode || targetNode===currentNode) return;
      const edge = findEdgeBetween(currentNode, targetNode);
      if(edge) addSeenEdge(edge.id);
    });
  }

  function syncMapProgress(sectionId, previousSection){
    if(!window.S) return;
    const ms = ensureMapState();
    const prevNode = previousSection ? chooseSectionNode(previousSection, ms.current_node) : ms.current_node;
    const currentNodes = mapNodesForSection(sectionId);
    currentNodes.forEach(id => {
      if(!ms.discovered_nodes.includes(id)) ms.discovered_nodes.push(id);
      const node = MAP_NODE_BY_ID[id];
      if(node && !ms.opened_layers.includes(node.layer)) ms.opened_layers.push(node.layer);
    });
    const currentNode = chooseSectionNode(sectionId, prevNode);
    if(currentNode) {
      ms.current_node = currentNode;
      const node = MAP_NODE_BY_ID[currentNode];
      if(node && node.layer) ms.selected_layer = node.layer;
    }
    if(previousSection && previousSection !== sectionId){
      if(prevNode && currentNode && prevNode !== currentNode){
        const edge = findEdgeBetween(prevNode, currentNode);
        if(edge && !ms.traversed_edges.includes(edge.id)) ms.traversed_edges.push(edge.id);
        if(edge) addSeenEdge(edge.id);
      }
    }
    noteVisibleExitsForSection(sectionId, currentNode);
  }

  function markMapVictoryForSection(sectionId){
    if(!window.S) return;
    const ms = ensureMapState();
    const encs = MAP_ENCOUNTERS_BY_SECTION[String(sectionId)] || [];
    encs.forEach(id => { if(!ms.victories.includes(id)) ms.victories.push(id); });
  }

  function iconFill(kind){
    return {
      crossroad:'#7f5f36', fork:'#7f5f36', house:'#8d4b32', village:'#8d4b32', riverbank:'#2f6e8d', landmark:'#4c6331',
      bridge:'#6f5b45', gate:'#444', resource:'#6a7c2d', yard:'#666', tower:'#444', wall:'#444', corridor:'#555',
      room:'#6e6761', vertical:'#555', water:'#2f6e8d', treasure:'#9a7b12', princess:'#a05b8c', throne:'#6d3f46',
      library:'#5d4e67', path:'#7f5f36', settlement:'#8d4b32'
    }[kind] || '#666';
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

  function updateMapTopbar(layer, nodes, discovered){
    const ms = ensureMapState();
    const status = document.getElementById('map-topbar-status');
    const layerPill = document.getElementById('map-topbar-layer');
    if(status){
      status.innerHTML = `${t('tekuschiy_uzel')}<b>${esc(MAP_NODE_BY_ID[ms.current_node]?.title || '—')}</b>${t('otkryto_uzlov')}<b>${nodes.filter(n=>discovered.has(n.id)).length}/${nodes.length}</b>`;
    }
    if(layerPill){
      layerPill.textContent = `${t('sloy')}${layer?.title || '—'}`;
    }
  }

  function renderMapSvg(targetId, mode){
    const svg = document.getElementById(targetId);
    if(!svg || !window.S) return;
    const ms = ensureMapState();
    const layerId = mode==='mini'
      ? (MAP_NODE_BY_ID[ms.current_node]?.layer || ms.selected_layer || 'overworld')
      : (document.getElementById('map-layer-select')?.value || ms.selected_layer || 'overworld');
    const layer = BC_MAP_DEF.layers[layerId]; if(!layer) return;
    if(mode!=='mini') ms.selected_layer = layerId;
    svg.setAttribute('viewBox', `0 0 ${layer.width} ${layer.height}`);
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    const nodes = BC_MAP_DEF.nodes.filter(n=>n.layer===layerId);
    const edges = BC_MAP_DEF.edges.filter(e=>e.layer===layerId);
    const discovered = new Set(ms.discovered_nodes);
    const traversed = new Set(ms.traversed_edges);
    const seen = new Set(ms.seen_edges || []);
    const victories = new Set(ms.victories);
    const nodeMap = Object.fromEntries(nodes.map(n=>[n.id,n]));
    const bg = layer.theme==='forest' ? '#2a3420' : layer.theme==='castle' ? '#2e2620' : '#252020';
    const defs = `
      <defs>
        <filter id="${targetId}-glow"><feGaussianBlur stdDeviation="${mode==='mini' ? 2.5 : 5}" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <pattern id="${targetId}-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(200,150,42,.06)" stroke-width="1"/>
        </pattern>
      </defs>`;
    let parts = [];
    parts.push(defs);
    parts.push(`<rect width="${layer.width}" height="${layer.height}" fill="${bg}"/>`);
    parts.push(`<rect width="${layer.width}" height="${layer.height}" fill="url(#${targetId}-grid)" opacity="0.8"/>`);
    parts.push(`<rect x="20" y="20" width="${layer.width-40}" height="${layer.height-40}" rx="22" fill="none" stroke="#8f6f3b" stroke-width="4"/>`);

    // Draw undiscovered skeleton (barely visible hints)
    edges.forEach(e=>{
      const a=nodeMap[e.from], b=nodeMap[e.to]; if(!a||!b) return;
      const bothUndisc = !discovered.has(a.id) && !discovered.has(b.id);
      if(bothUndisc) return; // hide edges where neither end is discovered
      if(traversed.has(e.id)) return; // will draw golden later
      if(seen.has(e.id)) return; // will draw stub later
      // Edge with one discovered end - show dimly
      if(discovered.has(a.id) || discovered.has(b.id)){
        parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#6a5a40" stroke-width="${mode==='mini'?3:4}" stroke-linecap="round" opacity="0.25"/>`);
      }
    });

    // Traversed edges (golden)
    edges.forEach(e=>{
      if(!traversed.has(e.id)) return;
      const a=nodeMap[e.from], b=nodeMap[e.to]; if(!a||!b) return;
      const sw = mode==='mini' ? 8 : 12;
      parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#d2aa2a" stroke-width="${sw}" stroke-linecap="round"/>`);
      parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#fff0a8" stroke-width="${mode==='mini'?3:5}" stroke-linecap="round" opacity="0.85"/>`);
    });

    // Seen but not traversed (stub)
    edges.forEach(e=>{
      if(traversed.has(e.id) || !seen.has(e.id)) return;
      const a=nodeMap[e.from], b=nodeMap[e.to]; if(!a||!b) return;
      const origin = discovered.has(a.id) ? a : discovered.has(b.id) ? b : null;
      const target = origin && origin.id===a.id ? b : origin ? a : null;
      if(!origin || !target) return;
      const dx=target.x-origin.x, dy=target.y-origin.y; const len=Math.max(1, Math.hypot(dx,dy));
      const stub = mode==='mini' ? 70 : 130;
      const x2 = origin.x + dx/len*stub, y2 = origin.y + dy/len*stub;
      parts.push(`<line x1="${origin.x}" y1="${origin.y}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#cdbb91" stroke-width="${mode==='mini'?5:8}" stroke-linecap="round" stroke-dasharray="14 10" opacity="0.9"/>`);
    });

    // Discovered nodes
    nodes.forEach(n=>{
      if(!discovered.has(n.id)) return;
      const current = ms.current_node===n.id;
      // Halo
      parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${mode==='mini'?32:48}" fill="rgba(200,150,42,.15)"/>`);
      if(current){
        parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${mode==='mini'?24:36}" fill="rgba(255,240,168,.35)" filter="url(#${targetId}-glow)"/>`);
        parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${mode==='mini'?28:42}" fill="none" stroke="#fff0a8" stroke-width="2" opacity="0.7"/>`);
      }
      const r = current ? (mode==='mini'?16:22) : (mode==='mini'?12:16);
      parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${iconFill(n.kind)}" stroke="${current?'#fff0a8':'#fff7e1'}" stroke-width="${mode==='mini'?2:3}"/>`);
      // Label — bigger and more readable
      if(mode!=='mini'){
        const fontSize = 32;
        const labelY = n.y - 34;
        parts.push(`<text x="${n.x}" y="${labelY}" font-size="${fontSize}" font-family="Georgia, serif" text-anchor="middle" fill="#f6efd7" stroke="#2c2418" stroke-width="5" stroke-linejoin="round" paint-order="stroke" font-weight="600">${esc(n.title)}</text>`);
      }
    });

    // Undiscovered nodes — show as faint silhouettes to hint at extent
    nodes.forEach(n=>{
      if(discovered.has(n.id)) return;
      // Only show if adjacent to a discovered node
      const adjacent = edges.some(e=>{
        if(e.from!==n.id && e.to!==n.id) return false;
        return discovered.has(e.from) || discovered.has(e.to);
      });
      if(!adjacent) return;
      parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${mode==='mini'?8:12}" fill="#4a3d28" stroke="#6a5a40" stroke-width="2" opacity="0.4"/>`);
      parts.push(`<text x="${n.x}" y="${n.y+4}" font-size="${mode==='mini'?14:20}" font-family="Georgia" fill="#8a7f6a" text-anchor="middle" opacity="0.6">?</text>`);
    });

    // Victory markers (crossed sabres)
    (BC_MAP_DEF.encounters||[]).forEach(enc=>{
      if(!victories.has(enc.id)) return;
      const n=nodeMap[enc.node_id]; if(!n || !discovered.has(n.id)) return;
      const y = n.y + (mode==='mini'?22:36);
      const sw = mode==='mini' ? 5 : 7;
      parts.push(`<g transform="translate(${n.x},${y})">
        <line x1="-14" y1="-14" x2="14" y2="14" stroke="#d2aa2a" stroke-width="${sw}" stroke-linecap="round"/>
        <line x1="-14" y1="14" x2="14" y2="-14" stroke="#d2aa2a" stroke-width="${sw}" stroke-linecap="round"/>
        <circle cx="-14" cy="-14" r="4" fill="#fff1a6"/>
        <circle cx="-14" cy="14" r="4" fill="#fff1a6"/>
        <circle cx="14" cy="-14" r="4" fill="#fff1a6"/>
        <circle cx="14" cy="14" r="4" fill="#fff1a6"/>
      </g>`);
    });

    svg.innerHTML = parts.join('');
    updateMapTopbar(layer, nodes, discovered);
    if(mode==='mini'){
      const meta=document.getElementById('map-mini-meta');
      if(meta) meta.innerHTML = `<div><b>${t('uzel')}</b> ${MAP_NODE_BY_ID[ms.current_node]?.title || '—'}</div><div><b>${t('otkryto')}</b> ${nodes.filter(n=>discovered.has(n.id)).length} / ${nodes.length}</div>`;
    } else {
      const note=document.getElementById('map-state-note');
      if(note) note.innerHTML = `<b>${t('sloy_2')}</b> ${layer.title}<br><b>${t('tekuschiy_uzel_2')}</b> ${MAP_NODE_BY_ID[ms.current_node]?.title || '—'}<br><b>${t('otkryto_uzlov_2')}</b> ${nodes.filter(n=>discovered.has(n.id)).length} / ${nodes.length}<br><small style="opacity:.7;margin-top:6px;display:block;line-height:1.4">${t('zoloto_proydennye_puti_punktir_u')}</small>`;
      svg.style.transform = `scale(${gameMapZoom})`;
      svg.style.transformOrigin = 'center center';
    }
  }

  function initMapUi(){
    const sel=document.getElementById('map-layer-select'); if(!sel || sel.options.length) return;
    Object.entries(BC_MAP_DEF.layers).forEach(([id,layer])=>{
      const opt=document.createElement('option'); opt.value=id; opt.textContent=layer.title; sel.appendChild(opt);
    });
    sel.onchange=()=>renderGameMap();
  }

  window.renderGameMap = function() {
    if(!window.S) return;
    initMapUi();
    const ms = ensureMapState();
    const sel=document.getElementById('map-layer-select');
    if(sel && !sel.value) sel.value = ms.selected_layer || 'overworld';
    renderMapSvg('game-map-svg','full');
    renderMapSvg('map-mini-svg','mini');
  };

  window.openMapModal = function(){
    if(!window.S) return;
    initMapUi();
    const ms=ensureMapState();
    const sel=document.getElementById('map-layer-select');
    if(sel) sel.value = MAP_NODE_BY_ID[ms.current_node]?.layer || ms.selected_layer || 'overworld';
    renderGameMap();
    document.getElementById('overlay-map').classList.add('on');
  };
  window.zoomGameMap = function(dir){ gameMapZoom = Math.max(0.65, Math.min(2.6, gameMapZoom + (dir>0?0.2:-0.2))); renderGameMap(); };
  window.resetGameMapView = function(){ gameMapZoom = 1; renderGameMap(); };
  window.toggleGameMapFullscreen = function(){ const el=document.getElementById('map-modal-stage'); if(!document.fullscreenElement) el.requestFullscreen?.(); else document.exitFullscreen?.(); };

window.bcRefreshMapLanguage = function(activeLocale){
    var A=(activeLocale&&activeLocale.map)?activeLocale.map:null;
    var F=(typeof LOCALE_RU!=='undefined'&&LOCALE_RU.map)?LOCALE_RU.map:null;
    var pick=function(key){ if(A&&A[key]!==undefined)return A[key]; if(F&&F[key]!==undefined)return F[key]; return key; };
    var R=function(o){ if(o&&o.titleKey!==undefined) o.title=pick(o.titleKey); };
    Object.values(BC_MAP_DEF.layers||{}).forEach(R);
    (BC_MAP_DEF.nodes||[]).forEach(R);
    (BC_MAP_DEF.encounters||[]).forEach(R);
    // group_82 CU-09: existing <option> labels of the layer select are re-localized too
    // (initMapUi returns early once the options exist).
    try{ var sel=document.getElementById('map-layer-select'); if(sel){ Array.prototype.forEach.call(sel.options,function(o){ var lyr=BC_MAP_DEF.layers&&BC_MAP_DEF.layers[o.value]; if(lyr&&lyr.title) o.textContent=lyr.title; }); } }catch(e){}
    try{ var ov=document.getElementById('overlay-map'); if(ov&&ov.classList.contains('on')&&window.S&&window.renderGameMap) window.renderGameMap(); }catch(e){}
  };
const oldInitState = window.initState;
  window.initState = function(n,sk,st,lu,sp){
    const s = oldInitState ? oldInitState(n,sk,st,lu,sp) : {name:n||t('geroy'),section:1,skill:sk,skillMax:sk,stamina:st,staminaMax:st,luck:lu,luckMax:lu,gold:15,flask:2,inventory:[],spells:sp,notes:'',visited:[],startTime:Date.now(),v:5};
    s.mapState = clone(BC_MAP_STATE_TEMPLATE);
    s.mapState.discovered_nodes = [];
    s.mapState.traversed_edges = [];
    s.mapState.victories = [];
    s.mapState.opened_layers = ['overworld'];
    s.mapState.seen_edges = [];
    s._mapLastSection = null;
    return s;
  };

  const oldLoadGame = window.loadGame;
  window.loadGame = function(){
    const s = oldLoadGame ? oldLoadGame() : null;
    if(s){
      if(!s.mapState) s.mapState = clone(BC_MAP_STATE_TEMPLATE);
      if(!Array.isArray(s.mapState.seen_edges)) s.mapState.seen_edges = [];
      if(!('v' in s) || s.v<7) s.v = 7;
      if(!s._mapLastSection) s._mapLastSection = null;
    }
    return s;
  };

  const oldSaveGame = window.saveGame;
  window.saveGame = function(){
    if(window.S){ ensureMapState(); S.v = 7; }
    return oldSaveGame ? oldSaveGame.apply(this, arguments) : null;
  };

  const oldImportSave = window.importSave;
  if(oldImportSave){
    window.importSave = function(e){
      const f=e && e.target && e.target.files ? e.target.files[0] : null;
      if(!f) return;
      f.text().then(rawText=>{
        try{
          const s=JSON.parse(rawText);
          if(![4,5,6,7].includes(s.v)){ alert(t('nesovmestimyy_format')); return; }
          if(s.v===4){ s.v=5; s.luckMax=s.luck; delete s.luckBoxes; }
          if(!s.mapState) s.mapState = clone(BC_MAP_STATE_TEMPLATE);
          if(!Array.isArray(s.mapState.discovered_nodes)) s.mapState.discovered_nodes = [];
          if(!Array.isArray(s.mapState.traversed_edges)) s.mapState.traversed_edges = [];
          if(!Array.isArray(s.mapState.victories)) s.mapState.victories = [];
          if(!Array.isArray(s.mapState.opened_layers)) s.mapState.opened_layers = ['overworld'];
          if(!Array.isArray(s.mapState.seen_edges)) s.mapState.seen_edges = [];
          s.v = 7;
          if(!s._mapLastSection) s._mapLastSection = null;
          window.S=s; saveGame(); showScr('game'); renderGame(); closeModal('overlay-menu');
        }catch(err){ alert(t('oshibka_zagruzki')); console.error(err); }
      });
      if(e && e.target) e.target.value='';
    }
  }

  const oldRenderGame = window.renderGame;
  window.renderGame = function(){
    const prev = window.S ? S._mapLastSection : null;
    const r = oldRenderGame ? oldRenderGame.apply(this, arguments) : undefined;
    if(window.S){
      ensureMapState();
      syncMapProgress(S.section, prev);
      S._mapLastSection = S.section;
      renderGameMap();
      if(typeof oldSaveGame === 'function') oldSaveGame();
    }
    return r;
  };

  const oldEndCombat = window.endCombat;
  window.endCombat = function(won){
    const result = oldEndCombat ? oldEndCombat.apply(this, arguments) : undefined;
    if(won && window.S){
      markMapVictoryForSection(S.section);
      renderGameMap();
      if(typeof oldSaveGame === 'function') oldSaveGame();
    }
    return result;
  };

  const oldShowScr = window.showScr;
  window.showScr = function(id){
    const r = oldShowScr ? oldShowScr.apply(this, arguments) : undefined;
    if(id==='game' && window.S) setTimeout(renderGameMap, 30);
    return r;
  };

  const oldInitVisualPolishV1 = window.initVisualPolishV1;
  window.initVisualPolishV1 = function(){
    if(oldInitVisualPolishV1) oldInitVisualPolishV1.apply(this, arguments);
    initMapUi();
    if(window.S) renderGameMap();
  };

  function __initMap(){
    initMapUi();
    if(window.S) renderGameMap();
    document.addEventListener('keydown', (ev) => {
      const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
      if(tag==='input' || tag==='textarea') return;
      // group_81 CA-17: physical key (layout-independent), only on the game screen, and
      // never over another open dialog (toggling the map itself stays allowed).
      const k=ev.key||''; const isM=(k.toLowerCase()==='m')||(ev.code==='KeyM'&&!/^[\x20-\x7e]$/.test(k)); // group_82 CU-10: letter first; physical key only for non-ASCII layouts (Cyrillic), so AZERTY keeps one shortcut
      if(isM && window.S && !ev.ctrlKey && !ev.altKey && !ev.metaKey){
        const sg=document.getElementById('scr-game'); if(!sg||!sg.classList.contains('on')) return;
        const open = document.getElementById('overlay-map')?.classList.contains('on');
        const top=(typeof _bcTopDialog==='function')?_bcTopDialog():null;
        if(top&&!open) return;
        if(open) closeModal('overlay-map'); else openMapModal();
      }
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', __initMap);
  } else {
    setTimeout(__initMap, 0);
  }
})();