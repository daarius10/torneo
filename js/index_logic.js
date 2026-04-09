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

    // Rellenar Clasificación
    const tablaClas = document.querySelector('#tabla-clasificacion tbody');
    if (tablaClas) {
        tablaClas.innerHTML = equipos.map(e => `
            <tr>
                <td>${e.nombre}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
            </tr>
        `).join('');
    }

    // Rellenar Goleadores
    const tablaGoles = document.querySelector('#lista-goleadores');
    if (tablaGoles) {
        tablaGoles.innerHTML = equipos.length > 0 
            ? '<p style="color:#aaa; font-size:0.9rem;">Esperando resultados...</p>' 
            : '';
    }

    // Rellenar Calendario
    const contenedorPartidos = document.querySelector('#contenedor-partidos');
    if (contenedorPartidos) {
        if (partidos.length === 0) {
            contenedorPartidos.innerHTML = '<p style="text-align:center; color:#666;">Torneo no generado. Ve al Panel Admin.</p>';
        } else {
            contenedorPartidos.innerHTML = partidos.map(p => `
                <div style="background:#1a1a1a; margin:10px 0; padding:10px; border-radius:8px; border:1px solid #333; display:flex; justify-content:space-between;">
                    <span>${p.local}</span>
                    <b style="color:#00ff88">${p.gl} - ${p.gv}</b>
                    <span>${p.vis}</span>
                </div>
            `).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarTodo);
