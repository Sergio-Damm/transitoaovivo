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

// ==================== AUTOESPORTE (layout seu + blindado) ====================
async function carregarAutoesporte() {
  const lista = document.getElementById('lista1');
  const loading = document.getElementById('loading1');
  if (!lista || !loading) return; // não quebra se bloco comentado

  lista.innerHTML = '';
  loading.style.display = 'block';

  // Placeholder em base64 → nunca falha, nunca dá erro no console
  const placeholderAE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NmNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BRTwvdGV4dD48L3N2Zz4=';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://pox.globo.com/rss/autoesporte/', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw 'erro';
    const data = await res.json();
    if (data.status !== 'ok') throw 'erro';

    data.items.slice(0, 6).forEach(item => {
      let fonte = 'Autoesporte';
      let thumb = placeholderAE;

      if (item.enclosure && item.enclosure.url) thumb = item.enclosure.url;
      else if (item.thumbnail) thumb = item.thumbnail;
      else if (item.description) {
        const desc = item.description;
        const start = desc.indexOf('src="') !== -1 ? desc.indexOf('src="') + 5 : desc.indexOf("src='") + 5;
        if (start > 5) {
          const end = desc.indexOf(desc.charAt(desc.indexOf('src') + 4), start);
          if (end > start) {
            const url = desc.substring(start, end);
            if (/\.(jpe?g|png|gif|webp)/i.test(url)) thumb = url;
          }
        }
      }

      const diff = Math.floor((Date.now() - new Date(item.pubDate) + 10800000) / 1000);
      const tempo = diff < 3600 ? Math.floor(diff/60)+' min atrás' :
                    diff < 86400 ? Math.floor(diff/3600)+'h atrás' :
                    diff < 172800 ? 'ontem' : Math.floor(diff/86400)+' dias atrás';

      const card =
        '<div class="col-md-6 col-lg-4">' +
          '<a href="' + item.link + '" target="_blank" rel="noopener" class="text-decoration-none text-dark">' +
            '<div class="card card-liftshadow border-light-subtle h-100">' +
              '<img src="' + thumb + '" class="card-img-top" style="height:200px;object-fit:cover;" ' +
                   'onerror="this.onerror=null; this.src=\'' + placeholderAE + '\'">' +
              '<div class="card-body d-flex flex-column">' +
                '<p class="card-title link-interno mb-2">' + item.title.trim() + '</p>' +
                '<p class="card-text mt-auto text-cerise">' + fonte + ' • ' + tempo + '</p>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</div>';

      lista.innerHTML += card;
    });
  } catch (e) {
    lista.innerHTML = '<div class="col-12 text-center py-5 text-danger">Autoesporte indisponível</div>';
  }
  loading.style.display = 'none';
}

// ==================== NEWSMOTOR (layout seu + blindado) ====================
async function carregarNewsMotor() {
  const lista = document.getElementById('lista3');
  const loading = document.getElementById('loading3');
  if (!lista || !loading) return;

  lista.innerHTML = '';
  loading.style.display = 'block';

  const placeholderNM = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OTTwvdGV4dD48L3N2Zz4=';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://newsmotor.com.br/feed/', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw 'erro';
    const data = await res.json();
    if (data.status !== 'ok') throw 'erro';

    data.items.slice(0, 6).forEach(item => {
      let fonte = 'NewsMotor';
      let thumb = placeholderNM;

      if (item.description) {
        const desc = item.description;
        const start = desc.indexOf('src="') !== -1 ? desc.indexOf('src="') + 5 : desc.indexOf("src='") + 5;
        if (start > 5) {
          const end = desc.indexOf(desc.charAt(desc.indexOf('src') + 4), start);
          if (end > start) {
            const url = desc.substring(start, end);
            if (/\.(jpe?g|png|gif|webp)/i.test(url)) thumb = url;
          }
        }
      }

      const diff = Math.floor((Date.now() - new Date(item.pubDate || Date.now()) + 10800000) / 1000);
      const tempo = diff < 3600 ? Math.floor(diff/60)+' min atrás' :
                    diff < 86400 ? Math.floor(diff/3600)+'h atrás' :
                    diff < 172800 ? 'ontem' : Math.floor(diff/86400)+' dias atrás';

      const card =
        '<div class="col-md-6 col-lg-4">' +
          '<a href="' + item.link + '" target="_blank" rel="noopener" class="text-decoration-none text-dark">' +
            '<div class="card card-liftshadow border-light-subtle h-100">' +
              '<img src="' + thumb + '" class="card-img-top" style="height:200px;object-fit:cover;" ' +
                   'onerror="this.onerror=null; this.src=\'' + placeholderNM + '\'">' +
              '<div class="card-body d-flex flex-column">' +
                '<p class="card-title link-interno mb-2">' + item.title.trim() + '</p>' +
                '<p class="card-text mt-auto text-cerise">' + fonte + ' • ' + tempo + '</p>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</div>';

      lista.innerHTML += card;
    });
  } catch (e) {
    lista.innerHTML = '<div class="col-12 text-center py-5 text-danger">NewsMotor indisponível</div>';
  }
  loading.style.display = 'none';
}

// ==================== ESTADÃO CARROS (mantive seu layout exato + melhorias) ====================
async function carregarEstadao() {
  const lista = document.getElementById('lista5');
  const loading = document.getElementById('loading5');
  if (!lista || !loading) return;

  lista.innerHTML = '';
  loading.style.display = 'block';

  const placeholderES = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2MwMDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FUzwvdGV4dD48L3N2Zz4=';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/jornal-do-carro/', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw 'erro';
    const data = await res.json();
    if (data.status !== 'ok') throw 'erro';

    let itens = data.items.slice(0,15).filter(item => {
      const t = item.title.toLowerCase();
      return !t.includes('prêmio') && !t.includes('exclusivo') && !t.includes('assinante') && !t.includes('mobilidade 202');
    }).slice(0,6);

    itens.forEach(item => {
      let fonte = 'Estadão';
      let thumb = placeholderES;

      if (item.enclosure?.url && item.enclosure.type?.includes('image')) {
        thumb = item.enclosure.url;
      } else if (item.description) {
        const d = item.description;
        const s = d.indexOf('src="') !== -1 ? d.indexOf('src="')+5 : d.indexOf("src='")+5;
        if (s > 5) {
          const e = d.indexOf(d.charAt(d.indexOf('src')+4), s);
          if (e > s) {
            const u = d.substring(s,e);
            if (/\.(jpe?g|png|gif|webp)/i.test(u)) thumb = u;
          }
        }
      }

      const diff = Math.floor((Date.now() - new Date(item.pubDate) + 10800000) / 1000);
      const tempo = diff < 3600 ? Math.floor(diff/60)+' min atrás' :
                    diff < 86400 ? Math.floor(diff/3600)+'h atrás' :
                    diff < 172800 ? 'ontem' : Math.floor(diff/86400)+' dias atrás';

      const card = 
        '<div class="col-md-6 col-lg-4">'+
          '<a href="'+item.link+'" target="_blank" rel="noopener" class="text-decoration-none text-dark">'+
            '<div class="card card-liftshadow border-light-subtle h-100">'+
              '<img src="'+thumb+'" class="card-img-top" loading="lazy" style="height:200px;object-fit:cover;" '+
                   'onerror="setTimeout(()=>{this.src=\''+placeholderES+'\'},1500); this.onerror=null;">'+
              '<div class="card-body d-flex flex-column">'+
                '<p class="card-title link-interno mb-2">'+item.title.trim()+'</p>'+
                '<p class="card-text mt-auto text-cerise">'+fonte+' • '+tempo+'</p>'+
              '</div>'+
            '</div>'+
          '</a>'+
        '</div>';

      lista.innerHTML += card;
    });

  } catch(e) {
    lista.innerHTML = '<div class="col-12 text-center py-5 text-danger">Estadão indisponível no momento</div>';
  }
  loading.style.display = 'none';
}

// ==================== EXECUÇÃO SEGURA ====================
document.addEventListener('DOMContentLoaded', () => {
  carregarAutoesporte();
  carregarNewsMotor();
  if (document.getElementById('lista5')) carregarEstadao();

  setInterval(carregarAutoesporte, 300000);
  setInterval(carregarNewsMotor, 300000);
  if (document.getElementById('lista5')) setInterval(carregarEstadao, 300000);
});