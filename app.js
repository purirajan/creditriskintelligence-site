// ---------------------------------------------------------------------------
// Interactive demo: a small illustrative scoring model that runs in the browser.
// It is NOT the production model and sends no data anywhere. Defaults are tuned
// to reproduce the hero example: PD 4.2%, Grade B, expected loss $32.76.
// ---------------------------------------------------------------------------
const POLICY = { minScore: 560, maxDti: 0.5, maxMissed: 3, approvePd: 0.06, reviewPd: 0.15 };
const LOSS_IF_DEFAULT = 0.65; // unsecured BNPL
const BASE_LOG_ODDS = Math.log(0.042 / 0.958); // PD at the default applicant

const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function grade(pd) {
  if (pd < 0.02) return 'A';
  if (pd < 0.06) return 'B';
  if (pd < 0.12) return 'C';
  if (pd < 0.25) return 'D';
  return 'E';
}

function assess({ score, dti, missed, amount, verified }) {
  const z =
    BASE_LOG_ODDS -
    0.012 * (score - 680) +
    5 * (dti - 0.35) +
    0.55 * missed +
    (verified ? 0 : 0.6);
  const pd = 1 / (1 + Math.exp(-z));

  // Hard policy rules first, then the risk-based decision.
  const ruleBreaks = [];
  if (score < POLICY.minScore) ruleBreaks.push(`Credit score below policy minimum (${POLICY.minScore})`);
  if (dti > POLICY.maxDti) ruleBreaks.push(`Debt-to-income above policy limit (${POLICY.maxDti * 100}%)`);
  if (missed > POLICY.maxMissed) ruleBreaks.push(`More than ${POLICY.maxMissed} missed payments`);

  let decision = 'APPROVE';
  if (ruleBreaks.length || pd >= POLICY.reviewPd) decision = 'DECLINE';
  else if (pd >= POLICY.approvePd) decision = 'REVIEW';

  const reasons = ruleBreaks.map((text) => ({ text, kind: 'neg' }));
  const dtiPct = Math.round(dti * 100);
  if (score >= 720) reasons.push({ text: `Strong credit score (${score})`, kind: 'pos' });
  else if (score < 640 && score >= POLICY.minScore)
    reasons.push({ text: `Credit score below target range (${score})`, kind: 'neg' });
  if (missed === 0) reasons.push({ text: 'No missed payments in the last 2 years', kind: 'pos' });
  else if (missed <= POLICY.maxMissed)
    reasons.push({ text: `${missed} missed payment${missed > 1 ? 's' : ''} in the last 2 years`, kind: 'neg' });
  reasons.push(verified ? { text: 'Income verified', kind: 'pos' } : { text: 'Income not verified', kind: 'neg' });
  if (dti <= 0.3) reasons.push({ text: `Low debt-to-income (${dtiPct}%)`, kind: 'pos' });
  else if (dti <= POLICY.maxDti)
    reasons.push({ text: `Debt-to-income at ${dtiPct}% (policy limit ${POLICY.maxDti * 100}%)`, kind: 'neg' });

  return { pd, grade: grade(pd), decision, expectedLoss: pd * LOSS_IF_DEFAULT * amount, reasons: reasons.slice(0, 4) };
}

const demoForm = document.getElementById('demoForm');
if (demoForm) {
  const el = (id) => document.getElementById(id);

  const render = () => {
    const f = demoForm.elements;
    const input = {
      score: Number(f.score.value),
      dti: Number(f.dti.value) / 100,
      missed: Number(f.delq.value),
      amount: Number(f.amount.value),
      verified: f.verified.checked
    };

    el('scoreOut').textContent = input.score;
    el('dtiOut').textContent = `${f.dti.value}%`;
    el('delqOut').textContent = input.missed;
    el('amountOut').textContent = money(input.amount).replace('.00', '');

    const r = assess(input);
    const badge = el('demoBadge');
    badge.textContent = r.decision;
    badge.className = `badge badge-${r.decision.toLowerCase()}`;
    el('demoGrade').textContent = `Grade ${r.grade}`;
    el('demoPd').textContent = `${(r.pd * 100).toFixed(1)}%`;
    el('demoEl').textContent = money(r.expectedLoss);

    const list = el('demoReasons');
    list.replaceChildren(
      ...r.reasons.map(({ text, kind }) => {
        const li = document.createElement('li');
        li.className = kind;
        li.textContent = text;
        return li;
      })
    );
  };

  demoForm.addEventListener('input', render);
  demoForm.addEventListener('submit', (e) => e.preventDefault());
  render();
}

// ---------------------------------------------------------------------------
// Design-partner form: submits to Formspree without leaving the page.
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
