/**
 * tracking.js
 * Captura parâmetros de tracking do Google Ads, Facebook Ads e UTMs da URL
 * e os persiste no localStorage para uso posterior na submissão do formulário.
 */

document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var trackingParams = ['gclid', 'wbraid', 'gbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign'];

    trackingParams.forEach(function (param) {
        var val = urlParams.get(param);
        if (val) {
            localStorage.setItem(param, val);
        }
    });
});
