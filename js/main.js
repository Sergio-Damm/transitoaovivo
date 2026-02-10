// Cache-Control para versão
// const cacheBuster = Date.now();
// console.log('Main script loaded - v' + cacheBuster);

// --- 1. Adsense space control ---
document.addEventListener('DOMContentLoaded', function() {
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
        }
    });
});

// --- 2. back to top button ---
function updateFooterStyle() {
  const button = document.getElementById("btn-back-to-top");
  const footer = document.getElementById("my-footer");
  if (!button || !footer) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const footerOffset = footer.offsetTop;
  const winHeight = window.innerHeight;

  if (scrollTop + winHeight >= footerOffset) {
    button.classList.add("on-footer");
  } else {
    button.classList.remove("on-footer");
  }
}

function updateScrollStyle() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (scrollTop > 20) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", function () {
  updateFooterStyle();
  updateScrollStyle();
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("btn-back-to-top");
  if (!button) return;

  button.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Inicialização
  updateFooterStyle();
  updateScrollStyle();
});


// --- 3. imagens (fallback e delay de 5 segundos) ---
document.addEventListener('DOMContentLoaded', () => {
    const timeoutDuration = 5000;
    const placeholder = '';

    document.querySelectorAll('.img-fallback').forEach(img => {
        const originalSrc = img.getAttribute('data-src');
        if (!originalSrc) return;

        img.src = placeholder;
        const wrapper = img.closest('.img-wrapper');
        const iconWrapper = wrapper ? wrapper.querySelector('.img-fallback-icon') : null;

        if (iconWrapper) iconWrapper.style.display = 'none';

        const tempImg = new Image();
        const timeout = setTimeout(() => {
            cleanup();
            if (iconWrapper) {
                iconWrapper.style.display = 'flex';
                iconWrapper.style.opacity = '1';
            }
        }, timeoutDuration);

        const cleanup = () => {
            clearTimeout(timeout);
            tempImg.onload = tempImg.onerror = null;
        };

        tempImg.onload = () => {
            cleanup();
            img.src = originalSrc;
            img.classList.add('loaded');
            if (iconWrapper) {
                iconWrapper.style.display = 'none';
            }
        };

        tempImg.onerror = () => {
            cleanup();
            if (iconWrapper) {
                iconWrapper.style.display = 'flex';
                iconWrapper.style.opacity = '1';
            }
        };
        tempImg.src = originalSrc;
    });
});

// --- 4. videos (hls e mp4) ---
function toggleVideoStatus(videoElement, isError) {
    const wrapper = videoElement.closest('.img-wrapper');
    const iconWrapper = wrapper ? wrapper.querySelector('.img-fallback-icon') : null;
    
    if (isError) {
        if (iconWrapper) {
            iconWrapper.style.display = 'flex';
            iconWrapper.style.opacity = '1';
        }
    } else {
        videoElement.classList.add('loaded');
        if (iconWrapper) {
            iconWrapper.style.display = 'none';
        }
    }
}

function setupHlsCamera(videoElement, videoSrc) {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(() => {});
            toggleVideoStatus(videoElement, false);
        });
        hls.on(Hls.Events.ERROR, () => toggleVideoStatus(videoElement, true));
    } else if (videoElement.canPlayType('application/x-mpegURL')) {
        videoElement.src = videoSrc;
        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play().catch(() => {});
            toggleVideoStatus(videoElement, false);
        });
        videoElement.addEventListener('error', () => toggleVideoStatus(videoElement, true));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hlsCams = [
        { id: 'video1', url: 'https://34.104.32.249.nip.io/SP123-KM046/stream.m3u8' },
        { id: 'video2', url: 'https://34.104.32.249.nip.io/SP055-KM092/stream.m3u8' },
        { id: 'video3', url: 'https://34.104.32.249.nip.io/SP125-KM093B/stream.m3u8' },
        { id: 'video4', url: 'https://34.104.32.249.nip.io/SP055-KM211A/stream.m3u8' }
    ];
    hlsCams.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) setupHlsCamera(el, c.url);
    });

    document.querySelectorAll('video.video-fallback').forEach(v => {
        if (v.id.startsWith('video')) return;
        v.addEventListener('loadeddata', () => toggleVideoStatus(v, false));
        v.addEventListener('playing', () => toggleVideoStatus(v, false));
        v.addEventListener('error', () => toggleVideoStatus(v, true));
        v.play().catch(() => {});
    });
});

// --- 5. lentidao cetp-sp (render api) ---
async function atualizarCardLentidao(attempts = 3) {
    const totalLentidao = document.getElementById('totalLentidao');
    const regioes = document.getElementById('regioes');
    const dataHora = document.getElementById('dataHora');
    if (!totalLentidao) return;

    try {
        const response = await fetch('https://transito-ao-vivo.onrender.com/transito', { cache: 'no-store' });
        if (!response.ok) throw new Error('Erro');
        const data = await response.json();
        totalLentidao.innerText = data.total + " km de lentidão total";
        regioes.innerHTML = `<li class="list-group-item">Zona Norte: ${data.regioes.norte} km</li>
                             <li class="list-group-item">Zona Oeste: ${data.regioes.oeste} km</li>
                             <li class="list-group-item">Zona Centro: ${data.regioes.centro} km</li>
                             <li class="list-group-item">Zona Leste: ${data.regioes.leste} km</li>
                             <li class="list-group-item">Zona Sul: ${data.regioes.sul} km</li>`;
        dataHora.innerText = "Atualizado em: " + data.dataHora.replace("São Paulo, ", "");
    } catch (error) {
        if (attempts > 1) atualizarCardLentidao(attempts - 1);
        else totalLentidao.innerText = "Dados indisponíveis";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('totalLentidao')) {
        atualizarCardLentidao();
        setInterval(atualizarCardLentidao, 300000);
    }
});

// --- 6. feed de noticias (rss) ---
async function carregarFeed(config) {
    const lista = document.getElementById(config.listaId);
    const loading = document.getElementById(config.loadingId);
    if (!lista || !loading) return;

    lista.innerHTML = ''; 
    loading.style.display = 'block';

    const placeholders = {
        'AE': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NmNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BRTwvdGV4dD48L3N2Zz4=',
        'NM': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OTTwvdGV4dD48L3N2Zz4=',
        'ES': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2MwMDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FUzwvdGV4dD48L3N2Zz4='
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
        if (!res.ok) throw new Error('Erro na rede');

        const data = await res.json();
        if (data.status !== 'ok') throw new Error('Erro na API');

        let itens = data.items.filter(i => i.title && i.link);

        if (config.filtroPaywall) {
            itens = itens.filter(i => {
                const t = i.title.toLowerCase();
                return !t.includes('prêmio') && !t.includes('exclusivo') && !t.includes('assinante') && !t.includes('mobilidade 202');
            });
        }

        let htmlItens = []; 

        itens.slice(0, 6).forEach((item, index) => {
            let thumb = placeholder;
            
            if (item.enclosure?.link && item.enclosure.type?.includes('image')) {
                thumb = item.enclosure.link;
            } else if (item.thumbnail) {
                thumb = item.thumbnail;
            } else if (item.description) {
                const m = item.description.match(/src=["']([^"']+\.(jpe?g|png|gif|webp))["']/i);
                if (m) thumb = m[1];
            }

            const diff = Math.floor((Date.now() - new Date(item.pubDate || Date.now())) / 1000);
            const tempo = diff < 3600 ? Math.floor(Math.max(1, diff/60))+' min atrás' :
                          diff < 86400 ? Math.floor(diff/3600)+'h atrás' :
                          diff < 172800 ? 'ontem' : Math.floor(diff/86400)+' dias atrás';

            htmlItens.push(
                '<div class="col-12 col-md-6 col-lg-4 mx-auto mb-4">' +
                '<a href="'+item.link+'" target="_blank" rel="noopener" class="text-decoration-none text-dark">' +
                '<div class="card card-liftshadow border-light-subtle h-100">' +
                 '<img ' +
'alt="'+item.title.trim()+'" ' +
'src="'+thumb+'" ' +
'class="card-img-top" ' +
'loading="lazy" ' +
' decoding="async" ' +
' width="400" height="200" ' +
' style="height:200px;object-fit:cover;" ' +
'onerror="this.onerror=null; this.src=\''+placeholder+'\'">'
+
                '<div class="card-body d-flex flex-column">' +
                '<p class="card-title link-interno mb-2" style="font-weight:500;">'+item.title.trim()+'</p>' +
                '<p class="card-text mt-auto text-cerise" style="font-size:0.85rem;">'+config.nome+' • '+tempo+'</p>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</div>'
            );
        });

        lista.innerHTML = htmlItens.join('');

    } catch (error) {
        console.error("Erro no feed:", config.nome, error);
        lista.innerHTML = `<div class="col-12 text-center py-5 text-danger">${config.nome} indisponível no momento</div>`;
    } finally {
        loading.style.display = 'none';
    }
}

// --- Feed - execucao das chamadas ---
document.addEventListener('DOMContentLoaded', () => {
    // Autoesporte
    carregarFeed({
        listaId: 'lista1', 
        loadingId: 'loading1', 
        rss: 'https://pox.globo.com/rss/autoesporte/', 
        nome: 'Autoesporte', 
        letras: 'AE'
    });

    // NewsMotor
    carregarFeed({
        listaId: 'lista3', 
        loadingId: 'loading3', 
        rss: 'https://newsmotor.com.br/feed/', 
        nome: 'News Motor', 
        letras: 'NM'
    });

    // Estadao (Jornal do Carro)
    carregarFeed({
        listaId: 'lista5', 
        loadingId: 'loading5', 
        rss: 'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/jornal-do-carro/', 
        nome: 'Estadão', 
        letras: 'ES', 
        filtroPaywall: true
    });
});

// --- 7. cameras cet-sp (obfuscated) ---
if (document.querySelector('#cams220, #cams225, #cams184')) {
    (function() {
        var cams = [{id:'cams220',f:1},{id:'cams225',f:1},{id:'cams184',f:1}];
        function upd() {
            cams.forEach(c => {
                var img = document.getElementById(c.id);
                if (img) {
                    img.src = "https://cameras.cetsp.com.br/Cams/"+c.id.replace('cams','')+"/"+c.f+".jpg?"+new Date().getTime();
                    c.f = (c.f % 25) + 1;
                }
            });
        }
        setInterval(upd, 5000); upd();
    })();
}

// auto-refresh geral
setInterval(() => window.location.reload(), 300000);

// weather forecast
(async function () {
  const card = document.getElementById("weather-card");

  if (!card) return;

  const city = card.dataset.city;
  const lat = card.dataset.lat;
  const lon = card.dataset.lon;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=precipitation_probability&timezone=America%2FSao_Paulo`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temp = data.current.temperature_2m;
    const code = data.current.weather_code;
    const rainChance = data.hourly.precipitation_probability[0];
    const condition = getCondition(code);

    document.getElementById("weather-city").innerHTML =
      `Previsão do tempo — ${city}`;

    document.getElementById("weather-temp").innerHTML =
      `<strong>Temperatura</strong>: ${temp} °C`;

    document.getElementById("weather-condition").innerHTML =
      `<strong>Condição</strong>: ${condition}`;

    document.getElementById("weather-rain").innerHTML =
      `<strong>Chance de chuva</strong>: ${rainChance}%`;

  } catch (e) {
    console.error("Erro ao carregar previsão do tempo", e);
  }

  function getCondition(code) {
    if (code === 0) return "Céu limpo";
    if ([1, 2].includes(code)) return "Parcialmente nublado";
    if (code === 3) return "Nublado";
    if ([45, 48].includes(code)) return "Nevoeiro";
    if (code >= 51 && code <= 67) return "Chuva fraca";
    if (code >= 80 && code <= 82) return "Pancadas de chuva";
    if (code >= 95) return "Tempestade";
    return "Condição indefinida";
  }
})();

// botao compartilhar
  var shareButton = document.getElementById('shareButton');
  var feedback = document.getElementById('shareFeedback');

  shareButton.addEventListener('click', function () {
    var url = window.location.href;

    // Caso 1: Web Share API (mobile)
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url
      }).catch(function () {
        // usuário cancelou, segue fallback
      });
      return;
    }

    // Caso 2: fallback desktop – copiar link
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        feedback.classList.remove('visually-hidden');

        setTimeout(function () {
          feedback.classList.add('visually-hidden');
        }, 2500);
      }).catch(function () {
        prompt('Copie o link abaixo:', url);
      });
    } else {
      // Último recurso
      prompt('Copie o link abaixo:', url);
    }
  });
