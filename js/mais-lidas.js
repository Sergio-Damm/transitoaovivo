import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, child, get, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. SUAS CONFIGURAÇÕES (Mantenha as suas aqui)
const firebaseConfig = {
  apiKey: "AIzaSyBWFgO92dBAzqMY3ms3qODbTCBWTfJIA4Q",
  authDomain: "transito-ao-vivo-web.firebaseapp.com",
  databaseURL: "https://transito-ao-vivo-web-default-rtdb.firebaseio.com/",
  projectId: "transito-ao-vivo-web",
  storageBucket: "transito-ao-vivo-web.firebasestorage.app",
  messagingSenderId: "786310431073",
  appId: "1:786310431073:web:515d5b18672a38b540c520"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- LÓGICA 1: CONTAR A VISITA (VERSÃO REVISADA) ---

// Filtra a URL para ignorar sujeiras como ?utm_source ou links externos de teste
const currentDomain = "transitoaovivo.com";
const isMainDomain = window.location.hostname.includes(currentDomain);

if (isMainDomain) {
    // Pega apenas a URL limpa (ex: https://transitoaovivo.com/index.html)
    const cleanUrl = window.location.origin + window.location.pathname;
    
    // Cria um ID simplificado para o banco (ex: _index_html)
    const pageId = window.location.pathname.replace(/[/.]/g, "_") || "home";
    const pageTitle = document.title;
    const pageRef = ref(db, 'paginas/' + pageId);

    // Soma +1 no contador do banco de dados
    get(pageRef).then((snapshot) => {
        let views = 1;
        if (snapshot.exists()) {
            views = (snapshot.val().views || 0) + 1;
        }
        update(pageRef, {
            titulo: pageTitle,
            url: cleanUrl,
            views: views
        });
    });
}

// --- LÓGICA 2: MOSTRAR AS 5 MAIS LIDAS NO CARD ---

const listaTop = query(ref(db, 'paginas'), orderByChild('views'), limitToLast(5));

get(listaTop).then((snapshot) => {
    const container = document.getElementById('mais-lidas-lista');
    if (snapshot.exists() && container) {
        let html = '<div class="list-group list-group-flush">';
        const paginas = [];
        
        snapshot.forEach((childSnapshot) => {
            paginas.push(childSnapshot.val());
        });

        // Ordena para que a maior apareça no topo
        paginas.reverse().forEach(p => {
            html += `
                <a href="${p.url}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div class="text-truncate" style="max-width: 80%;">${p.titulo}</div>
                    <span class="badge bg-primary rounded-pill">${p.views}</span>
                </a>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
});
