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

    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM carregado, iniciando fetch...');
        fetch('https://transito-ao-vivo.onrender.com/transito')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.status);
                }
                console.log('Resposta recebida do Render');
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos:', data);
                document.getElementById('totalLentidao').innerText = data.total + " km de lentidão total";
                const regioesList = document.getElementById('regioes');
                regioesList.innerHTML = '<li class="list-group-item">Zona Norte: ' + data.regioes.norte + ' km</li>' +
                                       '<li class="list-group-item">Zona Oeste: ' + data.regioes.oeste + ' km</li>' +
                                       '<li class="list-group-item">Zona Centro: ' + data.regioes.centro + ' km</li>' +
                                       '<li class="list-group-item">Zona Leste: ' + data.regioes.leste + ' km</li>' +
                                       '<li class="list-group-item">Zona Sul: ' + data.regioes.sul + ' km</li>';
                document.getElementById('dataHora').innerText = "Atualizado em: " + data.dataHora;
                console.log('Card atualizado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
                document.getElementById('totalLentidao').innerText = "Erro ao carregar";
            });
        setInterval(function() {
            fetch('https://transito-ao-vivo.onrender.com/transito');
        }, 300000); // 5 minutos
    });
