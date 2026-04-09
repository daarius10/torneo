const DB_KEY = 'liga_maestros_v11';
const MATCH_KEY = 'partidos_maestros_v11';

const DATOS_EQUIPOS_PRO = '[{"id":1,"nombre":"Soldados de Trump","jugadores":["Trump A","Trump B"]},{"id":2,"nombre":"Maduros","jugadores":["Maduro A","Maduro B"]},{"id":3,"nombre":"Correcciones","jugadores":["Corrector A","Corrector B"]},{"id":4,"nombre":"Butaneros","jugadores":["Butanero A","Butanero B"]}]';

function obtenerDatos(key) {
    const local = localStorage.getItem(key);
    if (local && local !== "[]") return JSON.parse(local);
    if (key === DB_KEY) {
        localStorage.setItem(key, DATOS_EQUIPOS_PRO);
        return JSON.parse(DATOS_EQUIPOS_PRO);
    }
    return [];
}

function entrar() {
    const pass = document.getElementById('passInput').value;
    if(pass === 'darius') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('panel').style.display = 'block';
        renderAdmin();
    } else { 
        alert('Clave incorrecta'); 
    }
}

function renderAdmin() {
    const eq = obtenerDatos(DB_KEY);
    const par = obtenerDatos(MATCH_KEY);
    
    const lista = document.getElementById('lista-equipos-admin');
    if(lista) {
        lista.innerHTML = "<h3>EQUIPOS CARGADOS</h3>" + eq.map(e => `
            <div style="background:#222; padding:15px; margin:10px 0; border-radius:8px; border:1px solid #333;">
                <b style="color:#00ff88; font-size:1.2rem;">${e.nombre}</b>
                <div style="margin-top:5px; color:#aaa;">${e.jugadores.join(', ')}</div>
            </div>
        `).join('');
    }

    const partidosDiv = document.getElementById('partidos-admin');
    if(partidosDiv && par.length > 0) {
        partidosDiv.innerHTML = par.map((p, i) => `
            <div style="background:#1a1a1a; padding:15px; margin:10px 0; border-radius:8px; border:1px solid #444;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${p.local}</span>
                    <input type="number" id="l-${i}" value="${p.gl}" style="width:40px; text-align:center;">
                    <span>-</span>
                    <input type="number" id="v-${i}" value="${p.gv}" style="width:40px; text-align:center;">
                    <span>${p.vis}</span>
                </div>
                <button onclick="guardarResultado(${i})" style="margin-top:10px; width:100%; padding:5px; background:#00ff88; color:#000; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">GUARDAR RESULTADO</button>
            </div>
        `).join('');
    }
}

function addEquipo() {
    const nombre = document.getElementById('nameE').value.trim();
    const jugadores = document.getElementById('playersE').value.split(',').map(j => j.trim()).filter(j => j !== "");
    if(!nombre || jugadores.length === 0) return;
    let eq = obtenerDatos(DB_KEY);
    eq.push({ id: Date.now(), nombre, jugadores });
    localStorage.setItem(DB_KEY, JSON.stringify(eq));
    document.getElementById('nameE').value = ""; 
    document.getElementById('playersE').value = "";
    renderAdmin();
}

function generarTorneo() {
    let eq = obtenerDatos(DB_KEY);
    if(eq.length < 2) return alert("Mínimo 2 equipos");
    let nombres = eq.map(e => e.nombre);
    if (nombres.length % 2 !== 0) nombres.push("DESCANSA");
    const numEquipos = nombres.length;
    const numJornadas = numEquipos - 1;
    const partidosPorJornada = numEquipos / 2;
    let partidos = [];
    for (let j = 0; j < numJornadas; j++) {
        for (let p = 0; p < partidosPorJornada; p++) {
            let local = nombres[p];
            let visitante = nombres[numEquipos - 1 - p];
            if (local !== "DESCANSA" && visitante !== "DESCANSA") {
                partidos.push({ jornada: j + 1, local, vis: visitante, gl: 0, gv: 0, jugado: false });
            }
        }
        nombres.splice(1, 0, nombres.pop());
    }
    localStorage.setItem(MATCH_KEY, JSON.stringify(partidos));
    alert("Torneo generado con éxito");
    renderAdmin();
}

function guardarResultado(idx) {
    let partidos = obtenerDatos(MATCH_KEY);
    partidos[idx].gl = parseInt(document.getElementById(`l-${idx}`).value) || 0;
    partidos[idx].gv = parseInt(document.getElementById(`v-${idx}`).value) || 0;
    partidos[idx].jugado = true;
    localStorage.setItem(MATCH_KEY, JSON.stringify(partidos));
    alert("Resultado actualizado");
    renderAdmin();
}
