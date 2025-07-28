const introStep = document.getElementById('introStep');
const modularSectionsStep = document.getElementById('modularSectionsStep');
const wizardContainer = document.getElementById('wizardContainer');
const knowWhatIWantBtn = document.getElementById('knowWhatIWantBtn');
const helpMeDecideBtn = document.getElementById('helpMeDecideBtn');
const modularBackBtn = document.getElementById('modularBackBtn');
const modularNextBtn = document.getElementById('modularNextBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const exportBtn = document.getElementById('exportBtn');

let userFlow = null; // 'modular' or 'guided'
let selectedSections = new Set();

knowWhatIWantBtn.addEventListener('click', () => {
  userFlow = 'modular';
  introStep.style.display = 'none';
  modularSectionsStep.style.display = 'block';
  wizardContainer.style.display = 'none';
  if (nextBtn) nextBtn.disabled = true;
});

helpMeDecideBtn.addEventListener('click', () => {
  userFlow = 'guided';
  introStep.style.display = 'none';
  modularSectionsStep.style.display = 'none';
  wizardContainer.style.display = 'block';
  showStep(3); // Start at step 3 for guided flow
  if (nextBtn) nextBtn.disabled = false;
});

modularBackBtn.addEventListener('click', () => {
  modularSectionsStep.style.display = 'none';
  introStep.style.display = 'block';
  userFlow = null;
  if (nextBtn) nextBtn.disabled = true;
});

modularNextBtn.addEventListener('click', () => {
  selectedSections.clear();
  document.querySelectorAll('#modularSectionsStep input[type="checkbox"]:checked').forEach(cb => {
    selectedSections.add(cb.value);
  });

  if (selectedSections.size === 0) {
    alert('Please select at least one section to continue.');
    return;
  }

  modularSectionsStep.style.display = 'none';
  wizardContainer.style.display = 'block';
  showStep(3); // Start wizard at step 3

  // For debugging
  console.log('Selected sections:', Array.from(selectedSections));
});

(function() {
  const steps = Array.from(document.querySelectorAll('.form-step')).filter(fs => fs.dataset.step);
  let currentStep = 1;
  const totalSteps = steps.length;

  // Inputs
  const siteTitleInput = document.getElementById('siteTitle');
  const heroTextInput = document.getElementById('heroText');
  const primaryColorInput = document.getElementById('primaryColor');
  const ctaTextInput = document.getElementById('ctaText');

  // Preview elements (if you add preview UI)
  // const previewTitle = document.getElementById('previewTitle');
  // const previewHeroText = document.getElementById('previewHeroText');
  // const previewCtaBtn = document.getElementById('previewCtaBtn');
  // const sitePreview = document.getElementById('sitePreview');

  function updatePreview() {
    // Implement preview updates if you have preview elements
  }

  function showStep(step) {
    currentStep = step;

    // Hide all steps first
    steps.forEach(fs => {
      fs.style.display = 'none';
      fs.classList.remove('active');
    });

    // Find the step element
    const stepEl = steps.find(fs => parseInt(fs.dataset.step) === step);

    // If modular flow, skip steps not in selectedSections
    if (userFlow === 'modular' && stepEl) {
      const section = stepEl.dataset.section;
      // Show step only if section is selected or if no section attribute (like review step)
      if (section && !selectedSections.has(section)) {
        // Skip this step, go to next
        const nextStep = step + 1;
        if (nextStep <= totalSteps) {
          showStep(nextStep);
          return;
        }
      }
    }

    if (stepEl) {
      stepEl.style.display = 'block';
      stepEl.classList.add('active');
    }

    // Enable/disable prev button
    if (prevBtn) prevBtn.disabled = step === 3; // can't go back before step 3 in wizard

    // Change next button text on last step
    if (nextBtn) nextBtn.textContent = (step === totalSteps) ? 'Finish' : 'Next';

    if (nextBtn) nextBtn.disabled = false;

    updatePreview();
  }

  function validateStep() {
    const currentFormStep = steps.find(fs => parseInt(fs.dataset.step) === currentStep);
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

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (userFlow === 'modular' && currentStep === 2) {
        // This case handled by modularNextBtn, so disable Next here
        return;
      }

      if (!validateStep()) return;

      const nextStep = currentStep + 1;

      if (nextStep > totalSteps) {
        alert('You have completed the customization! Use the Export button to download your site.');
        return;
      }

      showStep(nextStep);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevStep = currentStep - 1;

      if (prevStep < 3) {
        // If modular flow, go back to modular selection or intro
        if (userFlow === 'modular') {
          wizardContainer.style.display = 'none';
          modularSectionsStep.style.display = 'block';
          currentStep = 2;
          if (nextBtn) nextBtn.disabled = true;
        } else {
          // Guided flow goes back to intro
          wizardContainer.style.display = 'none';
          introStep.style.display = 'block';
          currentStep = 1;
          if (nextBtn) nextBtn.disabled = true;
        }
        return;
      }

      showStep(prevStep);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      // Build HTML content dynamically based on selectedSections and inputs
      // For simplicity, export all inputs here

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
  }

  // Initialize wizard to show intro step
  // (Already visible by default in HTML)
})();