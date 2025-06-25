document.addEventListener('DOMContentLoaded', function() {
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
});
