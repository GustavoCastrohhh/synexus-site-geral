/**
 * chatbot.js – Conversational form engine for abrirmei.html
 * All state is local. Integrates with form.js handleFormSubmit on completion.
 */

(function () {
    'use strict';

    // ── Configuration ────────────────────────────────────────────────────────
    const BOT_NAME = 'Assistente Synexus';
    const TYPING_DELAY_BASE = 700;  // ms before bot "types"
    const TYPING_DURATION = 900;  // ms the typing indicator shows
    const WA_NUMBER = '5554996095981';

    // Flow steps – each step defines a bot message, input type, and data key.
    const STEPS = [
        {
            key: null,
            message: 'Olá! 👋 Sou a Júlia, secretária virtual da <strong>Synexus Contabilidade</strong>. Vou te ajudar a abrir ou regularizar seu MEI com segurança. Bora começar?',
            type: 'choice',
            choices: ['Sim, vamos lá! 🚀', 'Tenho dúvidas primeiro 💬', 'Me preocupo com valores 💵'],
        },
        {
            key: 'name',
            message: 'Antes de eu te passar para nosso consultor, qual é o seu <strong>nome completo</strong>?',
            type: 'text',
            placeholder: 'Digite seu nome…',
            validate: v => v.trim().split(/\s+/).length >= 2 ? null : 'Por favor, informe nome e sobrenome.',
        },
        {
            key: 'situation',
            message: (data) => `Prazer, <strong>${first(data.name)}</strong>! Qual é a sua situação atual?`,
            type: 'choice',
            choices: ['Ainda não tenho CNPJ', 'Já tenho MEI, mas preciso de ajuda', 'Quero migrar do MEI para empresa'],
        },
        {
            key: 'activity',
            message: 'Qual área de atuação melhor descreve seu trabalho?',
            type: 'choice',
            choices: ['Comércio / Varejo', 'Serviços / Autônomo', 'Alimentação / Gastronomia', 'Outro / Não sei'],
        },
        {
            key: 'phone',
            message: (data) => `Perfeito! Agora preciso do seu <strong>WhatsApp</strong> para nosso consultor falar com você.`,
            type: 'tel',
            placeholder: '(00) 00000-0000',
            validate: v => v.replace(/\D/g, '').length >= 10 ? null : 'Informe um número válido com DDD.',
        },
    ];

    // ── State ─────────────────────────────────────────────────────────────────
    let currentStep = 0;
    let collectedData = {};
    let inputLocked = false;

    // ── DOM Refs ──────────────────────────────────────────────────────────────
    let messagesEl, inputAreaEl;

    // ── Helpers ───────────────────────────────────────────────────────────────
    function first(fullName) {
        return (fullName || '')
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase())
            .split(' ')[0];
    }

    function resolveMessage(step) {
        return typeof step.message === 'function' ? step.message(collectedData) : step.message;
    }

    function applyPhoneMask(input) {
        input.addEventListener('input', () => {
            let v = input.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6) {
                v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
            } else if (v.length > 2) {
                v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
            }
            input.value = v;
        });
    }

    // ── Bubble builders ───────────────────────────────────────────────────────
    function appendBubble(role, html, animate = true) {
        const wrap = document.createElement('div');
        wrap.className = `cb-bubble-wrap cb-${role}`;
        if (animate) wrap.classList.add('cb-enter');

        if (role === 'bot') {
            const avatar = document.createElement('img');
            avatar.src = 'https://d2v5dzlf3dactd.cloudfront.net/secretaria_virtual.jpg';
            avatar.alt = 'Júlia';
            avatar.className = 'cb-msg-avatar';
            wrap.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = 'cb-bubble';
        bubble.innerHTML = html;
        wrap.appendChild(bubble);
        messagesEl.appendChild(wrap);
        scrollBottom();

        if (animate) {
            requestAnimationFrame(() => {
                wrap.classList.remove('cb-enter');
                wrap.classList.add('cb-visible');
            });
        }
        return wrap;
    }

    function appendTypingIndicator() {
        const wrap = document.createElement('div');
        wrap.className = 'cb-bubble-wrap cb-bot cb-typing-wrap cb-enter';
        wrap.innerHTML = `<div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>`;
        messagesEl.appendChild(wrap);
        scrollBottom();
        requestAnimationFrame(() => {
            wrap.classList.remove('cb-enter');
            wrap.classList.add('cb-visible');
        });
        return wrap;
    }

    function scrollBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // ── Bot speak pipeline ────────────────────────────────────────────────────
    function botSpeak(html, callback) {
        inputLocked = true;
        setTimeout(() => {
            const typing = appendTypingIndicator();
            setTimeout(() => {
                typing.remove();
                appendBubble('bot', html);
                inputLocked = false;
                if (callback) callback();
            }, TYPING_DURATION);
        }, TYPING_DELAY_BASE);
    }

    // ── Step renderer ─────────────────────────────────────────────────────────
    function renderStep(index) {
        currentStep = index;
        const step = STEPS[index];
        if (!step) return;

        botSpeak(resolveMessage(step), () => {
            renderInput(step);
        });
    }

    function renderInput(step) {
        inputAreaEl.innerHTML = '';

        if (step.type === 'choice') {
            const grid = document.createElement('div');
            grid.className = 'cb-choices';
            step.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'cb-choice-btn';
                btn.textContent = choice;
                btn.addEventListener('click', () => handleChoice(step, choice));
                grid.appendChild(btn);
            });
            inputAreaEl.appendChild(grid);
        } else {
            const row = document.createElement('div');
            row.className = 'cb-input-row';

            const input = document.createElement('input');
            input.type = step.type === 'tel' ? 'tel' : 'text';
            input.placeholder = step.placeholder || '';
            input.className = 'cb-text-input';
            input.autocomplete = step.type === 'tel' ? 'tel' : 'name';

            if (step.type === 'tel') applyPhoneMask(input);

            const sendBtn = document.createElement('button');
            sendBtn.className = 'cb-send-btn';
            sendBtn.innerHTML = '→';
            sendBtn.type = 'button';

            const submit = () => {
                if (inputLocked) return;
                const val = input.value.trim();
                const err = step.validate ? step.validate(val) : null;
                if (err) {
                    showInputError(input, err);
                    return;
                }
                clearError(input);
                collectedData[step.key] = val;
                appendBubble('user', escapeHtml(val));
                inputAreaEl.innerHTML = '';
                advanceStep();
            };

            sendBtn.addEventListener('click', submit);
            input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

            row.appendChild(input);
            row.appendChild(sendBtn);
            inputAreaEl.appendChild(row);
            setTimeout(() => input.focus(), 100);
        }

        scrollBottom();
    }

    function handleChoice(step, choice) {
        if (inputLocked) return;
        // First step greeting branch
        if (step.key === null) {
            collectedData.start_choice = choice;
            if (choice.startsWith('Tenho dúvidas')) {
                appendBubble('user', escapeHtml(choice));
                inputAreaEl.innerHTML = '';
                botSpeak('Sem problemas! Nosso consultor vai tirar todas as suas dúvida. 😊', () => {
                    renderStep(1);
                });
                return;
            }
            if (choice.startsWith('Me preocupo com valores')) {
                appendBubble('user', escapeHtml(choice));
                inputAreaEl.innerHTML = '';
                botSpeak('Não se preocupe pois na Synexus nossa preocupação é te ajudar por um valor que irá caber no seu bolso, sabemos da realidade de quem é ou está querendo ser MEI. 💚', () => {
                    renderStep(1);
                });
                return;
            }
        }
        if (step.key !== null) collectedData[step.key] = choice;
        appendBubble('user', escapeHtml(choice));
        inputAreaEl.innerHTML = '';
        advanceStep();
    }

    function advanceStep() {
        const next = currentStep + 1;
        if (next < STEPS.length) {
            renderStep(next);
        } else {
            renderCompletion();
        }
    }

    // ── Completion ────────────────────────────────────────────────────────────
    function renderCompletion() {
        inputLocked = true;
        const phone = collectedData.phone || '';
        const name = collectedData.name || '';

        botSpeak(
            `✅ Perfeito, <strong>${first(name)}</strong>! Dados recebidos. Um especialista vai entrar em contato no WhatsApp <strong>${escapeHtml(phone)}</strong>. Você também pode nos chamar agora se prefirir clicando abaixo:`,
            () => {
                // Render WA button + hidden form submit
                const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    `Olá! Me chamo ${name}. Vim pelo site e quero ajuda para abrir/regularizar meu MEI. Meu WhatsApp é ${phone}.`
                )}`;

                const btnWrap = document.createElement('div');
                btnWrap.className = 'cb-completion';
                btnWrap.innerHTML = `
                    <a href="${wa}" target="_blank" rel="noopener noreferrer" class="cb-wa-btn" data-click-text="Chatbot - WhatsApp Final">
                        💬 Chamar no WhatsApp agora
                    </a>
                `;
                inputAreaEl.appendChild(btnWrap);
                scrollBottom();

                // Also fire the form submission silently for lead tracking
                submitLeadSilently(collectedData);
            }
        );
    }

    function submitLeadSilently(collectedData) {
        if (typeof window.submitLeadData === 'function') {
            let serviceName = "Abrir MEI (Chatbot)";
            if (collectedData.situation === 'Já tenho MEI, mas preciso de ajuda') {
                serviceName = "Consultoria MEI (Chatbot)";
            } else if (collectedData.situation === 'Quero migrar do MEI para empresa') {
                serviceName = "Migração MEI (Chatbot)";
            }

            const data = {
                name: collectedData.name || '',
                phone: collectedData.phone || '',
                situation: collectedData.situation || '',
                activity: collectedData.activity || '',
                start_choice: collectedData.start_choice || '',
                service: serviceName,
                formSource: "chatbot-silent"
            };

            // Dispara sem travar e não precisa mexer no DOM
            window.submitLeadData(data).catch(err => {
                console.error("Erro no envio do lead via chatbot:", err);
            });
        }
    }

    // ── Error helpers ─────────────────────────────────────────────────────────
    function showInputError(input, msg) {
        clearError(input);
        input.classList.add('cb-input-error');
        const row = input.parentElement;
        const err = document.createElement('p');
        err.className = 'cb-error-msg';
        err.textContent = msg;
        row.parentElement.appendChild(err);
    }

    function clearError(input) {
        input.classList.remove('cb-input-error');
        const existing = inputAreaEl.querySelector('.cb-error-msg');
        if (existing) existing.remove();
    }

    // ── Security ──────────────────────────────────────────────────────────────
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(str) {
        return String(str).replace(/"/g, '&quot;');
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
        messagesEl = document.getElementById('cbMessages');
        inputAreaEl = document.getElementById('cbInputArea');
        if (!messagesEl || !inputAreaEl) return;
        renderStep(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
