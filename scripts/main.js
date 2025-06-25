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