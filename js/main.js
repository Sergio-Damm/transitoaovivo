// Cache-Control para forçar atualização rápida
const cacheBuster = Date.now();
console.log('main.js loaded - version: ' + cacheBuster);

// --- adsensespace ---
var adContainers = document.querySelectorAll('.ad-container-wrapper');

adContainers.forEach(function(adContainer) {
  var adIns = adContainer.querySelector('.adsbygoogle');
  if (adIns) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          var status = adIns.getAttribute('data-ad-status');
          if (status === 'filled') {
            adContainer.classList.add('py-5');
            observer.disconnect();
          } else if (status === 'unfilled' || status === 'timeout') {
            adContainer.classList.remove('py-5');
          }
        }
      });
    });
    observer.observe(adIns, { attributes: true, attributeFilter: ['data-ad-status'] });
    var initialStatus = adIns.getAttribute('data-ad-status');
    if (initialStatus === 'filled') {
      adContainer.classList.add('py-5');
      observer.disconnect();
    }
  }
});

// --- backtotop ---
function updateFooterStyle() {
  var button = document.getElementById('btn-back-to-top');
  var footer = document.getElementById('my-footer');
  if (!button || !footer) return;
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var footerOffset = footer.offsetTop;
  var winHeight = window.innerHeight;
  if (scrollTop + winHeight >= footerOffset) {
    button.classList.add('on-footer');
  } else {
    button.classList.remove('on-footer');
  }
}

function updateScrollStyle() {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  if (scrollTop > 20) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
}

window.onscroll = function() {
  updateFooterStyle();
  updateScrollStyle();
};

document.getElementById('btn-back-to-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateFooterStyle();
updateScrollStyle();

// --- imgloadingdelay ---
// Esta função controla o carregamento de imagens com timeout.
document.addEventListener('DOMContentLoaded', () => {
  const timeoutDuration = 5000; // Tempo máximo de espera: 5 segundos
  const transparentBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  document.querySelectorAll('.img-fallback').forEach(img => {
    // CORREÇÃO: Lê o atributo data-src corretamente (sem asteriscos)
    const originalSrc = img.getAttribute('data-src');

    if (!originalSrc) {
      console.warn('Elemento .img-fallback ignorado: falta o atributo data-src.');
      return;
    }

    // Inicializa um objeto Image para gerenciar o carregamento de forma programática.
    const tempImg = new Image();
    
    // Define o timeout ANTES de iniciar o carregamento.
    const timeout = setTimeout(() => {
      console.warn(`[TIMEOUT] - ${originalSrc}`);
      
      // Tenta interromper o carregamento do tempImg
      tempImg.src = transparentBase64; 
        
      // Aplica o fallback visual no elemento DOM: adiciona as classes de erro
      img.classList.add('timeout', 'error');
      img.classList.remove('loaded');

      // Mantém o elemento visível, mas com src transparente para o CSS funcionar
      img.src = transparentBase64; 
      // REMOVIDO: img.style.display = 'none';
    }, timeoutDuration);

    // Define a função de Carregamento Bem-Sucedido
    tempImg.onload = () => {
      clearTimeout(timeout); // Cancela o timeout
      img.src = originalSrc; // Transfere a URL carregada para o elemento DOM
      img.classList.add('loaded'); // O CSS fará a imagem aparecer (opacity: 1)
      img.classList.remove('timeout', 'error');
      console.log(`[SUCESSO] - ${originalSrc}`);
    };

    // Define a função de Erro de Carregamento
    tempImg.onerror = () => {
      clearTimeout(timeout); // Cancela o timeout
      console.error(`[ERRO] - ${originalSrc}`);
        
      // Aplica o fallback visual no elemento DOM
      img.classList.add('error');
      img.classList.remove('loaded', 'timeout');
      
      // Mantém o elemento visível, mas com src transparente
      img.src = transparentBase64; 
      // REMOVIDO: img.style.display = 'none';
    };

    // INICIA O CARREGAMENTO
    tempImg.src = originalSrc;
  });
});

// --- reloadpage ---
setTimeout(function() {
  window.location.reload(1);
}, 300000); // 5 minutos

// --- cet3 ---
var _0xxyz = ['getElementById', 'getTime', 'src', 'classList'];
(function() {
  var _0xcams = [
    { id: 'cams220', frame: 1 },
    { id: 'cams225', frame: 1 },
    { id: 'cams184', frame: 1 }
  ],
  _0xmax = 25;

  function _0xupd() {
    for (var _0xi = 0; _0xi < _0xcams.length; _0xi++) {
      var _0ximg = document[_0xxyz[0]](_0xcams[_0xi].id);
      if (!_0ximg) {
        console.warn('Elemento da câmera com ID "' + _0xcams[_0xi].id + '" não encontrado no HTML. Ignorando.');
        continue;
      }
      var _0xtime = new Date()[_0xxyz[1]](),
          _0xsrc = "https://cameras.cetsp.com.br/Cams/" +
                   _0xcams[_0xi].id.replace('cams', '') + "/" +
                   _0xcams[_0xi].frame + ".jpg?" + _0xtime + "&nocache=" + Math.random();
      _0ximg[_0xxyz[3]].remove('error');
      _0ximg[_0xxyz[2]] = _0xsrc;
      console.log("Tentando carregar " + _0xcams[_0xi].id + " - Frame: " + _0xcams[_0xi].frame + " - URL: " + _0xsrc);
      _0ximg.onerror = function() {
        this[_0xxyz[3]].add('error');
        console.log("Erro ao carregar: " + this.src);
      };
      _0ximg.onload = function() {
        if (this.naturalWidth === 0 || this.naturalHeight === 0) {
          this[_0xxyz[3]].add('error');
          console.log("Imagem inválida (vazia): " + this.src);
        } else {
          this[_0xxyz[3]].remove('error');
          console.log("Carregado com sucesso: " + this.src);
        }
      };
      _0xcams[_0xi].frame = (_0xcams[_0xi].frame % _0xmax) + 1;
    }
  }
  setInterval(_0xupd, 5000); // 5 segundos
  _0xupd();
})();

// --- total de lentidão CET-SP ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, iniciando fetch...');

  // Verificar se os elementos existem antes de acessá-los
  const totalLentidao = document.getElementById('totalLentidao');
  const regioes = document.getElementById('regioes');
  const dataHora = document.getElementById('dataHora');

  // Se algum elemento não existir, logar e sair
  if (!totalLentidao || !regioes || !dataHora) {
    console.warn('Um ou mais elementos (totalLentidao, regioes, dataHora) não foram encontrados na página.');
    return;
  }

  fetch('https://transito-ao-vivo.onrender.com/transito')
    .then(response => {
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      console.log('Resposta recebida do Render');
      return response.json();
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      totalLentidao.innerText = data.total + " km de lentidão total";
      regioes.innerHTML = '<li class="list-group-item">Zona Norte: ' + data.regioes.norte + ' km</li>' +
                          '<li class="list-group-item">Zona Oeste: ' + data.regioes.oeste + ' km</li>' +
                          '<li class="list-group-item">Zona Centro: ' + data.regioes.centro + ' km</li>' +
                          '<li class="list-group-item">Zona Leste: ' + data.regioes.leste + ' km</li>' +
                          '<li class="list-group-item">Zona Sul: ' + data.regioes.sul + ' km</li>';
      const novaDataHora = data.dataHora.replace("São Paulo, ", "");
      console.log('Texto após replace:', novaDataHora); // Novo log para verificar
      dataHora.innerText = "Atualizado em: " + novaDataHora;
      console.log('Card atualizado com sucesso');
    })
    .catch(error => {
      console.error('Erro ao carregar dados:', error);
      totalLentidao.innerText = "Dados indisponíveis";
      regioes.innerHTML = '<li class="list-group-item">Dados indisponíveis</li>';
      dataHora.innerText = "Atualizado em: -";
    });
});

// ==================== FUNÇÃO ÚNICA E TOTALMENTE PADRONIZADA ====================
// Serve para qualquer feed do planeta
// FUNÇÃO ÚNICA E AGORA 100% ESTÁVEL
async function carregarFeed(config) {
    const lista = document.getElementById(config.listaId);
    const loading = document.getElementById(config.loadingId);
    if (!lista || !loading) return;

    // Inicialização: Limpa a lista e mostra o loading
    lista.innerHTML = ''; 
    loading.style.display = 'block';

    // Placeholders fixos em base64 (100% seguros)
    const placeholders = {
        'AE': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NmNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BRTwvdGV4dD48L3N2Zz4=',
        'NM': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OTTwvdGV4dD48L3N2Zz4=',
        'ES': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2MwMDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FUzwvd2d0PjwvZz4='
    };
    const placeholder = placeholders[config.letras] || placeholders['AE'];

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8500);

        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.rss)}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw 1;

        const data = await res.json();
        if (data.status !== 'ok') throw 1;

        let itens = data.items.filter(i => i.title && i.link);

        if (config.filtroPaywall) {
            itens = itens.filter(i => {
                const t = i.title.toLowerCase();
                return !t.includes('prêmio') && !t.includes('exclusivo') && !t.includes('assinante') && !t.includes('mobilidade 202');
            });
        }

        // NOVO: Array para construir o HTML fora do DOM
        let htmlItens = []; 

        itens.slice(0, 6).forEach(item => {
            let thumb = placeholder;
            if (item.enclosure?.url && item.enclosure.type?.includes('image')) thumb = item.enclosure.url;
            else if (item.thumbnail) thumb = item.thumbnail;
            else if (item.description) {
                const m = item.description.match(/src=["']([^"']+\.(jpe?g|png|gif|webp))["']/i);
                if (m) thumb = m[1];
            }

            const diff = Math.floor((Date.now() - new Date(item.pubDate || Date.now()) + 10800000) / 1000);
            const tempo = diff < 3600 ? Math.floor(diff/60)+' min atrás' :
                            diff < 86400 ? Math.floor(diff/3600)+'h atrás' :
                            diff < 172800 ? 'ontem' : Math.floor(diff/86400)+' dias atrás';

            // Adiciona a string HTML ao array
            htmlItens.push(
                '<div class="col-md-6 col-lg-4">' +
                '<a href="'+item.link+'" target="_blank" rel="noopener" class="text-decoration-none text-dark">' +
                '<div class="card card-liftshadow border-light-subtle h-100">' +
                // CORREÇÃO: Uso de item.title.trim() no atributo alt
                '<img alt="'+item.title.trim()+'" src="'+thumb+'" class="card-img-top" loading="lazy" style="height:200px;object-fit:cover;" ' +
                        'onerror="this.onerror=null; this.src=\''+placeholder+'\'">' +
                '<div class="card-body d-flex flex-column">' +
                '<p class="card-title link-interno mb-2">'+item.title.trim()+'</p>' +
                '<p class="card-text mt-auto text-cerise">'+config.nome+' • '+tempo+'</p>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</div>'
            );
        });

        // OTIMIZAÇÃO: Injeta todo o HTML de uma só vez
        lista.innerHTML = htmlItens.join('');

    } catch {
        lista.innerHTML = `<div class="col-12 text-center py-5 text-danger">${config.nome} indisponível no momento</div>`;
    } finally {
        loading.style.display = 'none';
    }
}

// EXECUÇÃO E ATUALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
carregarFeed({listaId:'lista1', loadingId:'loading1', rss:'https://pox.globo.com/rss/autoesporte/', nome:'Autoesporte', letras:'AE'});
carregarFeed({listaId:'lista3', loadingId:'loading3', rss:'https://newsmotor.com.br/feed/', nome:'NewsMotor', letras:'NM'});
carregarFeed({listaId:'lista5', loadingId:'loading5', rss:'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/jornal-do-carro/', nome:'Estadão', letras:'ES', filtroPaywall:true});
});