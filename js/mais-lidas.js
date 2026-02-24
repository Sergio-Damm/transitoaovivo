import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- LÓGICA 1: CONTAR A VISITA ---
const cleanUrl = window.location.origin + window.location.pathname;
let path = window.location.pathname;
if (path === "/" || path === "/index.html") {
    path = "home";
}
const pageId = path.replace(/[/.]/g, "_").replace(/^_+|_+$/g, "");
const pageTitle = document.title.split('|')[0].trim() || "Página Sem Título";
const pageRef = ref(db, 'paginas/' + pageId);

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

// --- LÓGICA 2: MOSTRAR AS 5 MAIS LIDAS (APENAS LINKS) ---
const container = document.getElementById('mais-lidas-lista');
if (container) {
    const listaTop = query(ref(db, 'paginas'), orderByChild('views'), limitToLast(10));

    get(listaTop).then((snapshot) => {
        if (snapshot.exists()) {
            let html = '<div class="list-group list-group-flush">';
            let paginas = [];
            
            snapshot.forEach((childSnapshot) => {
                paginas.push(childSnapshot.val());
            });

            paginas.reverse().slice(0, 5).forEach(p => {
                if(p.titulo && p.titulo !== "Bootstrap Example") {
                    html += `
                        <a href="${p.url}" class="list-group-item list-group-item-action border-0 py-2" style="font-size: 0.95rem;">
                            <i class="bi bi-chevron-right small me-2 text-primary"></i>${p.titulo}
                        </a>`;
                }
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
    });
}
