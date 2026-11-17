const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Hero example tabs (Approve / Decline), with arrow-key support.
// ---------------------------------------------------------------------------
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// ---------------------------------------------------------------------------
// Expected-loss calculator: ECL = PD × LGD × EAD, compared with order revenue.
// Pure arithmetic, no model. Defaults match the hero example ($32.76).
// ---------------------------------------------------------------------------
const elForm = document.getElementById('elForm');

if (elForm) {
  const $ = (id) => document.getElementById(id);

  const render = () => {
    const f = elForm.elements;
    const pd = Number(f.pd.value) / 100;
    const lgd = Number(f.lgd.value) / 100;
    const ead = Number(f.ead.value);
    const fee = Number(f.fee.value) / 100;

    const ecl = pd * lgd * ead;
    const revenue = fee * ead;
    const net = revenue - ecl;
    const breakEvenFee = pd * lgd * 100;

    $('pdOut').textContent = `${Number(f.pd.value).toFixed(1)}%`;
    $('lgdOut').textContent = `${f.lgd.value}%`;
    $('eadOut').textContent = money(ead).replace('.00', '');
    $('feeOut').textContent = `${Number(f.fee.value).toFixed(1)}%`;

    $('elValue').textContent = money(ecl);
    $('elPct').textContent = `${breakEvenFee.toFixed(2)}%`;
    $('revValue').textContent = money(revenue);
    $('netValue').textContent = net < 0 ? `−${money(-net)}` : money(net);

    const verdict = $('elVerdict');
    if (net >= 0) {
      verdict.className = 'el-verdict ok';
      verdict.textContent = `Covered: revenue exceeds expected loss. Break-even fee for this risk is ${breakEvenFee.toFixed(2)}%.`;
    } else {
      verdict.className = 'el-verdict err';
      verdict.textContent = `Not covered: you need at least ${breakEvenFee.toFixed(2)}% on this order just to cover expected credit loss.`;
    }
  };

  elForm.addEventListener('input', render);
  elForm.addEventListener('submit', (e) => e.preventDefault());
  render();
}

// ---------------------------------------------------------------------------
// Backtest request form: submits to Formspree without leaving the page.
// Without JavaScript, the form still posts normally via its action attribute.
// ---------------------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.className = 'form-status ok';
        formStatus.textContent = "Thanks — we'll be in touch within one business day.";
      } else {
        const data = await response.json().catch(() => ({}));
        const detail = data.errors?.map((e) => e.message).join(', ');
        throw new Error(detail || `Request failed (${response.status})`);
      }
    } catch (error) {
      formStatus.className = 'form-status err';
      formStatus.textContent = `Sorry, that didn't go through: ${error.message}. Please try again.`;
    } finally {
      button.disabled = false;
    }
  });
}
