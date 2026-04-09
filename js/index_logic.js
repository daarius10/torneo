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

function cargarTodo() {
    const equipos = obtenerDatos(DB_KEY);
    const partidos = obtenerDatos(MATCH_KEY);

    // 1. Rellenar Clasificación con Lógica Real
    const tablaClas = document.querySelector('#tabla-clasificacion tbody');
    if (tablaClas) {
        // Inicializamos estadísticas para cada equipo
        let stats = equipos.map(e => ({ nombre: e.nombre, pj: 0, dg: 0, pts: 0 }));

        // Procesamos los partidos jugados
        partidos.forEach(p => {
            if (p.jugado) {
                let loc = stats.find(s => s.nombre === p.local);
                let vis = stats.find(s => s.nombre === p.vis);
                if (loc && vis) {
                    loc.pj++; vis.pj++;
                    loc.dg += (p.gl - p.gv);
                    vis.dg += (p.gv - p.gl);
                    if (p.gl > p.gv) loc.pts += 3;
                    else if (p.gl < p.gv) vis.pts += 3;
                    else { loc.pts += 1; vis.pts += 1; }
                }
            }
        });

        // Ordenar por puntos y luego por diferencia de goles
        stats.sort((a, b) => b.pts - a.pts || b.dg - a.dg);

        tablaClas.innerHTML = stats.map(s => `
            <tr>
                <td>${s.nombre}</td>
                <td>${s.pj}</td>
                <td>${s.dg}</td>
                <td class="pts">${s.pts}</td>
            </tr>
        `).join('');
    }

    // 2. Rellenar Goleadores
    const tablaGoles = document.querySelector('#lista-goleadores');
    if (tablaGoles) {
        tablaGoles.innerHTML = '<p style="color:#888; font-size:0.85rem;">Esperando resultados del admin...</p>';
    }

    // 3. Rellenar Calendario
    const contenedorPartidos = document.querySelector('#contenedor-partidos');
    if (contenedorPartidos) {
        if (partidos.length === 0) {
            contenedorPartidos.innerHTML = '<p style="text-align:center; color:#666; font-size:13px;">Torneo no generado. Ve al Panel Admin.</p>';
        } else {
            contenedorPartidos.innerHTML = partidos.map(p => `
                <div class="match-card">
                    <span class="team-n">${p.local}</span>
                    <span class="score">${p.gl} - ${p.gv}</span>
                    <span class="team-n" style="text-align:right;">${p.vis}</span>
                </div>
            `).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarTodo);
