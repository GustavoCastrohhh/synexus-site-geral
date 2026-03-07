/**
 * form.js
 * Responsável por: submissão do formulário de contato, Enhanced Conversions (Google Ads),
 * disparo de evento de conversão e máscara de telefone.
 */

async function handleFormSubmit(event, formId) {
    event.preventDefault();

    var form = document.getElementById(formId);
    var successId = formId === 'heroForm' ? 'heroSuccess' : 'contactSuccess';
    var successMessage = document.getElementById(successId);
    var submitButton = form.querySelector('button[type="submit"]');

    // Disable button and show loading state
    var originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando...';

    // Collect form data and tracking parameters
    var formData = new FormData(form);
    var urlParams = new URLSearchParams(window.location.search);

    var data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        formSource: formId,
        timestamp: new Date().toISOString(),
        gclid: urlParams.get('gclid') || localStorage.getItem('gclid') || '',
        wbraid: urlParams.get('wbraid') || localStorage.getItem('wbraid') || '',
        gbraid: urlParams.get('gbraid') || localStorage.getItem('gbraid') || '',
        fbclid: urlParams.get('fbclid') || localStorage.getItem('fbclid') || '',
        utm_source: urlParams.get('utm_source') || localStorage.getItem('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || localStorage.getItem('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || localStorage.getItem('utm_campaign') || ''
    };

    try {
        // Send data to webhook using URL-encoded format to avoid CORS preflight
        var response = await fetch('https://n8n-editor.fdje1h.easypanel.host/webhook/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            // Enhanced Conversions — normalize phone
            var cleanPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
            if (cleanPhone && !cleanPhone.startsWith('55')) {
                cleanPhone = '55' + cleanPhone;
            }
            if (cleanPhone) {
                cleanPhone = '+' + cleanPhone;
            }

            // Enhanced Conversions — normalize name
            var firstName = '';
            var lastName = '';
            if (data.name) {
                var nameParts = data.name.trim().split(/\s+/);
                firstName = nameParts[0];
                if (nameParts.length > 1) {
                    lastName = nameParts.slice(1).join(' ');
                }
            }

            gtag('set', 'user_data', {
                "phone_number": cleanPhone,
                "address": {
                    "first_name": firstName,
                    "last_name": lastName
                }
            });

            // Report conversion to Google Ads
            gtag_report_conversion();

            successMessage.style.display = 'block';
            successMessage.innerHTML = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';

            form.reset();
        } else {
            throw new Error('Erro ao enviar formulário');
        }
    } catch (error) {
        console.error('Erro:', error);
        successMessage.style.display = 'block';
        successMessage.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        successMessage.innerHTML = '✗ Erro ao enviar. Tente novamente ou entre em contato diretamente.';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        setTimeout(function () {
            successMessage.style.display = 'none';
            successMessage.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }, 5000);
    }
}

// Phone mask
function applyPhoneMask(input) {
    var value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
        value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
    } else if (value.length > 2) {
        value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
    } else if (value.length > 0) {
        value = '(' + value;
    }

    input.value = value;
}

// Apply mask to all phone inputs
document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
        applyPhoneMask(input);
    });
});
