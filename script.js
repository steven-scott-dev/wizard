(function() {
  const steps = document.querySelectorAll('.step');
  const formSteps = document.querySelectorAll('.form-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const exportBtn = document.getElementById('exportBtn');
  const form = document.getElementById('wizard-form');

  let currentStep = 1;
  const totalSteps = steps.length;

  // Inputs
  const siteTitleInput = document.getElementById('siteTitle');
  const heroTextInput = document.getElementById('heroText');
  const primaryColorInput = document.getElementById('primaryColor');
  const ctaTextInput = document.getElementById('ctaText');

  // Preview elements
  const previewTitle = document.getElementById('previewTitle');
  const previewHeroText = document.getElementById('previewHeroText');
  const previewCtaBtn = document.getElementById('previewCtaBtn');
  const sitePreview = document.getElementById('sitePreview');

  // Update preview live
  function updatePreview() {
    previewTitle.textContent = siteTitleInput.value || 'Your Website Title';
    previewHeroText.textContent = heroTextInput.value || 'Your hero section text will appear here.';
    previewCtaBtn.textContent = ctaTextInput.value || 'Call to Action';
    sitePreview.style.setProperty('--primary-color', primaryColorInput.value);
  }

  // Show step
  function showStep(step) {
    currentStep = step;
    formSteps.forEach(fs => {
      fs.classList.toggle('active', parseInt(fs.dataset.step) === step);
    });
    steps.forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.step) === step);
      s.classList.toggle('completed', parseInt(s.dataset.step) < step);
    });
    prevBtn.disabled = step === 1;
    nextBtn.textContent = step === totalSteps ? 'Finish' : 'Next';
    nextBtn.disabled = false;
    updatePreview();
  }

  // Validate current step inputs
  function validateStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentFormStep.querySelectorAll('input[required], textarea[required]');
    for (const input of inputs) {
      if (!input.value.trim()) {
        input.focus();
        return false;
      }
    }
    return true;
  }

  // Next button click
  nextBtn.addEventListener('click', () => {
    if (!validateStep()) return;
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    } else {
      // Finish clicked on last step
      alert('You have completed the customization! Use the Export button to download your site.');
    }
  });

  // Prev button click
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

  // Step click (for accessibility)
  steps.forEach(stepEl => {
    stepEl.addEventListener('click', () => {
      const stepNum = parseInt(stepEl.dataset.step);
      if (stepNum <= currentStep + 1) { // Allow going back or current+1 step only
        if (stepNum > currentStep && !validateStep()) return;
        showStep(stepNum);
      }
    });
    stepEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stepEl.click();
      }
    });
  });

  // Update preview on input change
  [siteTitleInput, heroTextInput, primaryColorInput, ctaTextInput].forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  // Export button - generate a simple HTML file with the customized content
  exportBtn.addEventListener('click', () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${siteTitleInput.value}</title>
<style>
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0; padding: 0;
    background: #f9fafb;
    color: #334155;
    text-align: center;
    padding: 4rem 2rem;
  }
  h1 {
    color: ${primaryColorInput.value};
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: #64748b;
  }
  button {
    background: ${primaryColorInput.value};
    color: white;
    border: none;
    padding: 1rem 3rem;
    border-radius: 50px;
    font-size: 1.25rem;
    cursor: pointer;
    font-weight: 700;
    transition: background 0.3s ease;
  }
  button:hover {
    background: #2563eb;
  }
</style>
</head>
<body>
  <h1>${siteTitleInput.value}</h1>
  <p>${heroTextInput.value}</p>
  <button>${ctaTextInput.value}</button>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteTitleInput.value.replace(/\s+/g, '_').toLowerCase() || 'custom_website'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Initialize
  showStep(1);
  updatePreview();
})();