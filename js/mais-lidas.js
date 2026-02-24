  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getDatabase, ref, child, get, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

  // SUAS CONFIGURAÇÕES (Copie do console do Firebase)
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

  // --- LÓGICA 1: CONTAR A VISITA ---
  // Usamos o título da página ou a URL como identificador
  const pageId = window.location.pathname.replace(/[/.]/g, "_") || "home";
  const pageTitle = document.title;
  const pageRef = ref(db, 'paginas/' + pageId);

  // Verifica se a página já existe e soma +1
  get(pageRef).then((snapshot) => {
    let views = 1;
    if (snapshot.exists()) {
      views = snapshot.val().views + 1;
    }
    update(pageRef, {
      titulo: pageTitle,
      url: window.location.href,
      views: views
    });
  });

  // --- LÓGICA 2: MOSTRAR AS 5 MAIS LIDAS ---
  const listaTop = query(ref(db, 'paginas'), orderByChild('views'), limitToLast(5));
  get(listaTop).then((snapshot) => {
    const container = document.getElementById('mais-lidas-lista');
    if (snapshot.exists() && container) {
      let html = '<div class="list-group">';
      const paginas = [];
      snapshot.forEach((childSnapshot) => {
        paginas.push(childSnapshot.val());
      });
      // Inverte para mostrar a maior primeiro
      paginas.reverse().forEach(p => {
        html += `<a href="${p.url}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  ${p.titulo}
                  <span class="badge bg-primary rounded-pill">${p.views}</span>
                 </a>`;
      });
      html += '</div>';
      container.innerHTML = html;
    }
  });
