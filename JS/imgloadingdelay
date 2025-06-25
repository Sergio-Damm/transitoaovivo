  document.querySelectorAll('.img-fallback').forEach(img => {
    const originalSrc = img.src; // Salva a URL original
    const timeoutDuration = 3000; // 3 segundos

    // Cria uma imagem temporária para pré-carregar
    const tempImg = new Image();
    tempImg.src = originalSrc;

    // Define o timeout
    const timeout = setTimeout(() => {
      img.classList.add('timeout');
      img.src = ''; // Define como vazio para parar o carregamento
      img.style.display = 'none'; // Esconde a imagem visivelmente
    }, timeoutDuration);

    // Quando a imagem temporária carrega
    tempImg.onload = () => {
      clearTimeout(timeout);
      img.src = originalSrc; // Aplica a URL original
      img.classList.add('loaded');
      img.classList.remove('timeout', 'error');
      img.style.display = 'block'; // Garante que a imagem seja visível
    };

    // Quando a imagem temporária falha
    tempImg.onerror = () => {
      clearTimeout(timeout);
      img.classList.add('error');
      img.classList.remove('loaded', 'timeout');
      img.src = ''; // Remove a URL para evitar mais tentativas
      img.style.display = 'none';
    };
  });
