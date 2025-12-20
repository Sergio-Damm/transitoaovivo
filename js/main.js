// Cache-Control para versão
const cacheBuster = Date.now();
console.log('Main script loaded - v' + cacheBuster);

// --- 1. ADSENSE SPACE CONTROL ---
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

// --- 2. BACK TO TOP BUTTON ---
function updateScrollEffects() {
    var button = document.getElementById('btn-back-to-top');
    var footer = document.getElementById('my-footer');
    if (!button) return;
    
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 20) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }

    if (footer && (scrollTop + window.innerHeight >= footer.offsetTop)) {
        button.classList.add('on-footer');
    } else {
        button.classList.remove('on-footer');
    }
}

window.onscroll = updateScrollEffects;
document.getElementById('btn-back-to-top')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 3. IMAGENS (FALLBACK E DELAY DE 5 SEG) ---
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
            if (iconWrapper) iconWrapper.style.display = 'none';
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

// --- 4. VÍDEOS (HLS E MP4) ---
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
        if (iconWrapper) iconWrapper.style.display = 'none';
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
        { id: 'video2', url: 'https://34.104.32.249.nip.io/SP125-KM014/stream.m3u8' },
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
        v.addEventListener('error', () => toggleVideoStatus(v, true));
        v.play().catch(() => {});
    });
});

// --- 5. LENTIDÃO CET-SP (RENDER API) ---
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

// --- 6. FEED DE NOTÍCIAS (RSS) ---
async function carregarFeed(config) {
    const lista = document.getElementById(config.listaId);
    const loading = document.getElementById(config.loadingId);
    if (!lista || !loading) return;
    lista.innerHTML = ''; loading.style.display = 'block';

    const placeholders = {
        'AE': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NmNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BRTwvdGV4dD48L3N2Zz4=',
        'NM': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA2NDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OTTwvdGV4dD48L3N2Zz4=',
        'ES': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2MwMDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FUzwvdGV4dD48L3N2Zz4='
    };
    const placeholder = placeholders[config.letras] || placeholders['AE'];

    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.rss)}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.status !== 'ok') throw 1;
        let htmlItens = [];
        data.items.slice(0, 6).forEach(item => {
            let thumb = item.thumbnail || placeholder;
            htmlItens.push(`<div class="col-md-6 col-lg-4">
                <a href="${item.link}" target="_blank" rel="noopener" class="text-decoration-none text-dark">
                <div class="card card-liftshadow border-light-subtle h-100">
                <img alt="${item.title}" src="${thumb}" class="card-img-top" style="height:200px;object-fit:cover;" onerror="this.src='${placeholder}'">
                <div class="card-body d-flex flex-column">
                <p class="card-title link-interno mb-2">${item.title}</p>
                <p class="card-text mt-auto text-cerise">${config.nome}</p>
                </div></div></a></div>`);
        });
        lista.innerHTML = htmlItens.join('');
    } catch {
        lista.innerHTML = `<div class="col-12 text-center py-5">${config.nome} indisponível</div>`;
    } finally { loading.style.display = 'none'; }
}
document.addEventListener('DOMContentLoaded', () => {
    carregarFeed({listaId:'lista1', loadingId:'loading1', rss:'https://pox.globo.com/rss/autoesporte/', nome:'Autoesporte', letras:'AE'});
    carregarFeed({listaId:'lista3', loadingId:'loading3', rss:'https://newsmotor.com.br/feed/', nome:'NewsMotor', letras:'NM'});
    carregarFeed({listaId:'lista5', loadingId:'loading5', rss:'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/jornal-do-carro/', nome:'Estadão', letras:'ES'});
});

// --- 7. CÂMERAS CET-SP (OBFUSCATED) ---
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

// Auto-refresh geral
setInterval(() => window.location.reload(), 300000);