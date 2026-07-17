(() => {
  const dialog = document.querySelector('#join-dialog');
  const form = document.querySelector('#interest-form');
  if (!dialog || !form) return;

  const success = dialog.querySelector('.success');
  const submitButton = form.querySelector('[type="submit"]');
  const nextButton = form.querySelector('[data-form-next]');
  const backButton = form.querySelector('[data-form-back]');
  const formStatus = form.querySelector('.form-status');
  const progressLabel = form.querySelector('[data-progress-label]');
  const progressBar = form.querySelector('[data-progress-bar]');
  const totalSteps = 6;
  const formEndpoint = 'https://uncreator-club-form.sunnykrgupta.workers.dev/submit';
  let currentStep = 1;
  let creatorLinkCount = 1;

  const activePersona = () => form.elements.persona.value;
  const activeFlow = () => form.querySelector(`[data-registration-flow="${activePersona()}"]`);
  const activeStep = () => activeFlow().querySelector(`[data-form-step="${currentStep}"]`);

  const updateView = () => {
    const persona = activePersona();
    form.querySelectorAll('[data-registration-flow]').forEach(flow => {
      const active = flow.dataset.registrationFlow === persona;
      flow.hidden = !active;
      flow.querySelectorAll('input, select, textarea').forEach(control => { control.disabled = !active; });
    });
    activeFlow().querySelectorAll('[data-form-step]').forEach(step => {
      step.hidden = Number(step.dataset.formStep) !== currentStep;
    });
    progressLabel.textContent = `${persona} · ${currentStep} of ${totalSteps}`;
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    backButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === totalSteps;
    submitButton.hidden = currentStep !== totalSteps;
    formStatus.textContent = '';
  };

  const validateCurrentStep = () => {
    const step = activeStep();
    const controls = [...step.querySelectorAll('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')];
    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }

    for (const group of step.querySelectorAll('[data-required-group]')) {
      const error = group.parentElement.querySelector('.group-error');
      const checked = group.querySelector('input:checked');
      if (!checked) {
        error.textContent = 'Choose at least one option to continue.';
        group.querySelector('input')?.focus();
        return false;
      }
      error.textContent = '';
    }
    return true;
  };

  const setPersona = persona => {
    form.elements.persona.value = persona;
    form.querySelectorAll('[data-persona]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.persona === persona));
    });
    currentStep = 1;
    updateView();
  };

  const resetCreatorLinks = () => {
    const rows = [...form.querySelectorAll('[data-creator-links] .link-row')];
    rows.slice(1).forEach(row => row.remove());
    creatorLinkCount = 1;
  };

  const openDialog = event => {
    form.style.display = '';
    success.style.display = 'none';
    submitButton.disabled = false;
    setPersona(event?.currentTarget?.dataset?.persona || activePersona() || 'Creator');
    dialog.showModal();
  };

  document.querySelectorAll('.js-open-dialog').forEach(button => button.addEventListener('click', openDialog));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.dialog-done').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  form.querySelectorAll('[data-persona]').forEach(button => {
    button.addEventListener('click', () => setPersona(button.dataset.persona));
  });

  form.querySelector('[data-add-creator-link]').addEventListener('click', () => {
    creatorLinkCount += 1;
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `<div class="field"><label for="creator-link-${creatorLinkCount}">Creator link</label><input id="creator-link-${creatorLinkCount}" name="creatorLinks" type="url" inputmode="url" placeholder="https://"></div><button class="remove-link" type="button" aria-label="Remove creator link">Remove</button>`;
    form.querySelector('[data-creator-links]').append(row);
    row.querySelector('input').focus();
  });

  form.querySelector('[data-creator-links]').addEventListener('click', event => {
    const removeButton = event.target.closest('.remove-link');
    if (removeButton) removeButton.closest('.link-row').remove();
  });

  nextButton.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    currentStep = Math.min(totalSteps, currentStep + 1);
    updateView();
    activeStep().querySelector('h3')?.focus({ preventScroll: true });
  });

  backButton.addEventListener('click', () => {
    currentStep = Math.max(1, currentStep - 1);
    updateView();
  });

  form.addEventListener('change', event => {
    const group = event.target.closest('[data-required-group]');
    if (group && group.querySelector('input:checked')) {
      group.parentElement.querySelector('.group-error').textContent = '';
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validateCurrentStep() || !form.reportValidity()) return;
    submitButton.disabled = true;
    formStatus.textContent = 'Saving your registration…';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    ['brandChallenges', 'creatorTopics', 'creatorInterests', 'creatorLinks'].forEach(name => {
      const values = formData.getAll(name).map(value => value.trim()).filter(Boolean);
      if (values.length) payload[name] = values;
    });

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again.');

      form.reset();
      resetCreatorLinks();
      setPersona('Creator');
      form.style.display = 'none';
      success.style.display = 'block';
    } catch (error) {
      formStatus.textContent = error.message || 'We could not save your registration. Please try again.';
      submitButton.disabled = false;
    }
  });

  updateView();
})();
