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

// Inicialização ao carregar a página
updateFooterStyle();
updateScrollStyle();