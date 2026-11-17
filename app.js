const sampleOutput = {
  application_id: 'APP-20240101-0042',
  pd_estimate: 0.042,
  risk_grade: 'BBB',
  decision_recommendation: 'APPROVE',
  lgd_estimate: 0.24,
  ead_estimate: 18000,
  ecl_12_month: 183.6,
  ecl_lifetime: 229.5,
  governance: {
    model_id: 'PD-CONSUMER-001',
    model_version: '1.2.0',
    record_id: 'rec-123',
    regulatory_use: ['Basel IRB', 'CECL'],
    risk_tier: 'Moderate'
  },
  adverse_action_reasons: [
    'AA-01 — Credit score below target range',
    'AA-02 — Debt pressure is too high'
  ]
};

const outputBox = document.getElementById('outputBox');
if (outputBox) {
  outputBox.textContent = JSON.stringify(sampleOutput, null, 2);
}

// Demo-request form: submits to Formspree without leaving the page.
// Without JavaScript, the form still posts normally via its action attribute.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (contactForm.action.includes('YOUR_FORM_ID')) {
      formStatus.className = 'form-status err';
      formStatus.textContent = 'Form not configured yet — add your Formspree form ID in index.html.';
      return;
    }

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
