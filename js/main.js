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
document.querySelectorAll('.img-fallback').forEach(img => {
  const originalSrc = img.src;
  const timeoutDuration = 3000;
  const tempImg = new Image();
  tempImg.src = originalSrc;
  const timeout = setTimeout(() => {
    img.classList.add('timeout');
    img.src = '';
    img.style.display = 'none';
  }, timeoutDuration);
  tempImg.onload = () => {
    clearTimeout(timeout);
    img.src = originalSrc;
    img.classList.add('loaded');
    img.classList.remove('timeout', 'error');
    img.style.display = 'block';
  };
  tempImg.onerror = () => {
    clearTimeout(timeout);
    img.classList.add('error');
    img.classList.remove('loaded', 'timeout');
    img.src = '';
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
    { id: 'cams64', frame: 1 },
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
