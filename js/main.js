// --- adsensespace ---
var adContainers = document.querySelectorAll('.ad-container-wrapper');

adContainers.forEach(function(adContainer) {
    var adIns = adContainer.querySelector('.adsbygoogle');

    if (adIns) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'data-ad-status') {
                        var status = adIns.getAttribute('data-ad-status');

                        if (status === 'filled') {
                            adContainer.classList.add('py-5');
                            observer.disconnect();
                        } else if (status === 'unfilled' || status === 'timeout') {
                            adContainer.classList.remove('py-5');
                        }
                    }
                }
            });
        });

        observer.observe(adIns, {
            attributes: true,
            attributeFilter: ['data-ad-status']
        });

        var initialStatus = adIns.getAttribute('data-ad-status');
        if (initialStatus === 'filled') {
            adContainer.classList.add('py-5');
            observer.disconnect();
        }
    }
});

// --- backtotop ---
function updateFooterStyle() {
  var button = document.getElementById("btn-back-to-top");
  var footer = document.getElementById("my-footer");

  if (!button || !footer) return;

  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var footerOffset = footer.offsetTop;
  var winHeight = window.innerHeight;

  if (scrollTop + winHeight >= footerOffset) {
    button.classList.add("on-footer");
  } else {
    button.classList.remove("on-footer");
  }
}

function updateScrollStyle() {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  if (scrollTop > 20) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
}

// Event listeners para scroll e clique
window.onscroll = function () {
  updateFooterStyle();
  updateScrollStyle();
};

document.getElementById("btn-back-to-top").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Chamadas iniciais para definir o estilo ao carregar a página
updateFooterStyle();
updateScrollStyle();

// --- imgloadingdelay ---
document.querySelectorAll('.img-fallback').forEach(img => {
  const originalSrc = img.src; // Salva a URL original
  const timeoutDuration = 3000; // 3 segundos

  const tempImg = new Image();
  tempImg.src = originalSrc;

  const timeout = setTimeout(() => {
    img.classList.add('timeout');
    img.src = ''; // Define como vazio para parar o carregamento
    img.style.display = 'none'; // Esconde a imagem visivelmente
  }, timeoutDuration);

  tempImg.onload = () => {
    clearTimeout(timeout);
    img.src = originalSrc; // Aplica a URL original
    img.classList.add('loaded');
    img.classList.remove('timeout', 'error');
    img.style.display = 'block'; // Garante que a imagem seja visível
  };

  tempImg.onerror = () => {
    clearTimeout(timeout);
    img.classList.add('error');
    img.classList.remove('loaded', 'timeout');
    img.src = ''; // Remove a URL para evitar mais tentativas
    img.style.display = 'none';
  };
});

// --- reloadpage ---
setTimeout(function() {
  window.location.reload(1);
}, 300000); // 5 minutos

// --- cet3 ---
var _0xxyz = ['getElementById', 'getTime', 'src', 'classList'];

(function() {
    var _0xcams = [
        { id: 'cams31', frame: 1 },
        { id: 'cams164', frame: 1 },
        { id: 'cams184', frame: 1 }
    ],
    _0xmax = 25;

    function _0xupd() {
        for (var _0xi = 0; _0xi < _0xcams.length; _0xi++) {
            var _0ximg = document[_0xxyz[0]](_0xcams[_0xi].id);
            
            // --- INÍCIO DA CORREÇÃO ---
            // Verifica se o elemento da câmera existe antes de tentar manipulá-lo
            if (!_0ximg) { 
                console.warn('Elemento da câmera com ID "' + _0xcams[_0xi].id + '" não encontrado no HTML. Ignorando.');
                continue; // Pula para a próxima câmera no loop
            }
            // --- FIM DA CORREÇÃO ---

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

            // Incrementa o frame
            _0xcams[_0xi].frame = (_0xcams[_0xi].frame % _0xmax) + 1;
        }
    }

    // Atualiza a cada 1 segundos
    setInterval(_0xupd, 1000);
    _0xupd(); // Chama na inicialização
})();

// _js/main.js

// Função principal para atualizar os dados de trânsito
function atualizarDadosTransito() {
    // --- Tenta atualizar dados da CET-SP ---
    // Verifica se o elemento 'totalLentidao' existe na página atual
    const totalLentidaoElem = document.getElementById('totalLentidao');
    if (totalLentidaoElem) {
        fetch('/assets/data/trafego_cetsp.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição CET-SP: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                totalLentidaoElem.innerText = data.total + " km de lentidão total";
                const regioesList = document.getElementById('regioes');
                if (regioesList) { // Garante que o elemento existe
                    regioesList.innerHTML = '<li class="list-group-item">Zona Norte: ' + data.regioes.norte + ' km</li>' +
                                            '<li class="list-group-item">Zona Oeste: ' + data.regioes.oeste + ' km</li>' +
                                            '<li class="list-group-item">Zona Centro: ' + data.regioes.centro + ' km</li>' +
                                            '<li class="list-group-item">Zona Leste: ' + data.regioes.leste + ' km</li>' +
                                            '<li class="list-group-item">Zona Sul: ' + data.regioes.sul + ' km</li>';
                }
                const dataHoraElem = document.getElementById('dataHora');
                if (dataHoraElem) { // Garante que o elemento existe
                    dataHoraElem.innerText = "Consulta feita ao site da CET-SP em: " + data.dataHora;
                }
                console.log('Card CET-SP atualizado com sucesso.');
            })
            .catch(error => {
                console.error('Erro ao carregar dados da CET-SP:', error);
                if (totalLentidaoElem) totalLentidaoElem.innerText = "Erro ao carregar CET";
                const dataHoraElem = document.getElementById('dataHora');
                if (dataHoraElem) dataHoraElem.innerText = "Erro.";
            });
    }

    // --- Tenta atualizar dados da Artesp ---
    // Verifica se o elemento 'totalRodoviasInfo' existe na página atual
    const totalRodoviasInfoElem = document.getElementById('totalRodoviasInfo');
    if (totalRodoviasInfoElem) {
        fetch('/assets/data/trafego_artesp.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição Artesp: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // ATENÇÃO: Conteúdo de teste para Artesp.
                // Será ajustado com o scraping real para listar as rodovias.
                totalRodoviasInfoElem.innerText = "Dados de Rodovias disponíveis (teste).";
                const rodoviasList = document.getElementById('rodoviasList');
                if (rodoviasList) { // Garante que o elemento existe
                    rodoviasList.innerHTML = '<li class="list-group-item">Verifique o JSON para detalhes.</li>';
                }
                const dataHoraArtespElem = document.getElementById('dataHoraArtesp');
                if (dataHoraArtespElem) { // Garante que o elemento existe
                    dataHoraArtespElem.innerText = "Consulta feita ao site da CET-SP em: " + data.dataHora;
                }
                console.log('Card Artesp atualizado com sucesso.');
            })
            .catch(error => {
                console.error('Erro ao carregar dados da Artesp:', error);
                if (totalRodoviasInfoElem) totalRodoviasInfoElem.innerText = "Erro ao carregar Artesp";
                const dataHoraArtespElem = document.getElementById('dataHoraArtesp');
                if (dataHoraArtespElem) dataHoraArtespElem.innerText = "Erro.";
            });
    }
}

// Garante que o script só roda depois que a página HTML está totalmente carregada
document.addEventListener('DOMContentLoaded', function() {
    atualizarDadosTransito(); // Chama na inicialização
    setInterval(atualizarDadosTransito, 300000); // Atualiza a cada 5 minutos (300000 ms)
});