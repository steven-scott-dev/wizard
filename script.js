// ...existing code...

const introStep = document.getElementById('introStep');
const wizardContainer = document.getElementById('wizardContainer');
const knowWhatIWantBtn = document.getElementById('knowWhatIWantBtn');
const helpMeDecideBtn = document.getElementById('helpMeDecideBtn');

let userFlow = null; // 'modular' or 'guided'

// When user clicks "I know what I want"
if (knowWhatIWantBtn) {
  knowWhatIWantBtn.addEventListener('click', () => {
    userFlow = 'modular';
    introStep.style.display = 'none';
    wizardContainer.style.display = '';
    showStep(1); // Start at first wizard step
  });
}

// When user clicks "Help me decide"
if (helpMeDecideBtn) {
  helpMeDecideBtn.addEventListener('click', () => {
    userFlow = 'guided';
    introStep.style.display = 'none';
    wizardContainer.style.display = '';
    showStep(1); // Or showStep(1) if you want to start at the same step
  });
}

// ...rest of your wizard logic...

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

  // Intro step branching
  const knowWhatIWantBtn = document.getElementById('knowWhatIWantBtn');
  const helpMeDecideBtn = document.getElementById('helpMeDecideBtn');
  let userFlow = null; // 'modular' or 'guided'

  // Disable Next button on intro step until user chooses
  if (currentStep === 1) nextBtn.disabled = true;

  // When user clicks "I know what I want"
  if (knowWhatIWantBtn) {
    knowWhatIWantBtn.addEventListener('click', () => {
      userFlow = 'modular';
      nextBtn.disabled = false;
      knowWhatIWantBtn.style.backgroundColor = '#2563eb';
      helpMeDecideBtn.style.backgroundColor = '';
    });
  }

  // When user clicks "Help me decide"
  if (helpMeDecideBtn) {
    helpMeDecideBtn.addEventListener('click', () => {
      userFlow = 'guided';
      nextBtn.disabled = false;
      helpMeDecideBtn.style.backgroundColor = '#2563eb';
      knowWhatIWantBtn.style.backgroundColor = '';
    });
  }

  // Update preview live
  function updatePreview() {
    if (previewTitle) previewTitle.textContent = siteTitleInput.value || 'Your Website Title';
    if (previewHeroText) previewHeroText.textContent = heroTextInput.value || 'Your hero section text will appear here.';
    if (previewCtaBtn) previewCtaBtn.textContent = ctaTextInput.value || 'Call to Action';
    if (sitePreview) sitePreview.style.setProperty('--primary-color', primaryColorInput.value);
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
    // On intro step, require user to pick a flow before enabling Next
    if (step === 1) {
      nextBtn.disabled = !userFlow;
    } else {
      nextBtn.disabled = false;
    }
    updatePreview();
  }

  // Validate current step inputs
  function validateStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentFormStep) return true;
    const inputs = currentFormStep.querySelectorAll('input[required], textarea[required]');
    for (const input of inputs) {
      if (!input.value.trim()) {
        input.focus();
        return false;
      }
    }
    return true;
  }

  // Override nextBtn click to branch based on userFlow on step 1
  nextBtn.addEventListener('click', () => {
    if (currentStep === 1) {
      if (!userFlow) {
        alert('Please select an option to continue.');
        return;
      }
      // Both flows currently go to step 2; adjust as needed for your flow
      showStep(2);
    } else {
      // Existing next button logic for other steps
      if (!validateStep()) return;
      if (currentStep < totalSteps) {
        showStep(currentStep + 1);
      } else {
        alert('You have completed the customization! Use the Export button to download your site.');
      }
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
    if (input) input.addEventListener('input', updatePreview);
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
  }); })