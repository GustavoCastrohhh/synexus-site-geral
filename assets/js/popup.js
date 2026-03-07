/**
 * popup.js
 * Exit intent popup: dispara ao mover o mouse para fora da janela (desktop)
 * ou após 30 segundos em dispositivos touch. É exibido apenas uma vez por sessão.
 */

(function () {
    var STORAGE_KEY = 'synexus_exit_popup_shown';
    var overlay = document.getElementById('exitPopupOverlay');
    var closeBtn = document.getElementById('exitPopupClose');
    var dismissBtn = document.getElementById('exitPopupDismiss');

    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function showPopup() {
        if (sessionStorage.getItem(STORAGE_KEY)) return;
        overlay.classList.add('active');
        sessionStorage.setItem(STORAGE_KEY, '1');
        document.body.style.overflow = 'hidden';
    }

    window.closeExitPopup = function () {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeExitPopup);
    dismissBtn.addEventListener('click', closeExitPopup);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeExitPopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeExitPopup();
    });

    // Desktop: exit-intent via mouseout
    document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0) {
            showPopup();
        }
    });

    // Mobile: fallback after 30 seconds
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setTimeout(showPopup, 30000);
    }
})();
