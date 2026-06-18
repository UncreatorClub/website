// Smooth scroll implementation or interaction effects
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Simple scroll observer for nav shadow
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 20) {
        nav.classList.add('shadow-xl', 'bg-background');
        nav.classList.remove('bg-background/80');
    } else {
        nav.classList.remove('shadow-xl', 'bg-background');
        nav.classList.add('bg-background/80');
    }
});

// ==========================================
// ONBOARDING SIGNUP MODAL SYSTEM
// ==========================================

let modalState = {
    isOpen: false,
    currentFlow: null, // 'brand', 'creator', or 'select'
    currentStep: 0,    // 0 is selection screen
    data: {}
};

// Start flows
window.openSignupModal = function(flowType = 'select') {
    modalState.isOpen = true;
    modalState.currentFlow = flowType;
    modalState.currentStep = flowType === 'select' ? 0 : 1;
    modalState.data = {};
    
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        renderStep();
    }
};

window.closeModal = function() {
    modalState.isOpen = false;
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
};

window.prevStep = function() {
    if (modalState.currentStep > 1) {
        saveCurrentStepData();
        modalState.currentStep--;
        renderStep();
    } else if (modalState.currentStep === 1 && modalState.currentFlow !== 'select') {
        // Go back to selection screen
        saveCurrentStepData();
        modalState.currentFlow = 'select';
        modalState.currentStep = 0;
        renderStep();
    }
};

window.nextStep = function() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        const totalSteps = 6;
        if (modalState.currentStep === 0) {
            const selectedFlow = document.querySelector('input[name="persona-select"]:checked');
            if (selectedFlow) {
                modalState.currentFlow = selectedFlow.value;
                modalState.currentStep = 1;
                renderStep();
            }
        } else if (modalState.currentStep < totalSteps) {
            modalState.currentStep++;
            renderStep();
        } else {
            // Submit data
            submitOnboardingData();
        }
    }
};

// Render content of current step
function renderStep() {
    const contentContainer = document.getElementById('modal-content');
    const progress = document.getElementById('modal-progress');
    const stepIndicator = document.getElementById('modal-step-indicator');
    const backBtn = document.getElementById('modal-back-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    
    if (!contentContainer) return;
    
    // Set progress bar & step title
    const totalSteps = 6;
    if (modalState.currentStep === 0) {
        progress.style.width = '0%';
        stepIndicator.innerText = 'PATH SELECTION';
        backBtn.style.display = 'none';
        nextBtn.innerHTML = 'Continue <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
    } else {
        const percent = (modalState.currentStep / totalSteps) * 100;
        progress.style.width = `${percent}%`;
        stepIndicator.innerText = `STEP ${modalState.currentStep} OF ${totalSteps}`;
        backBtn.style.display = 'flex';
        nextBtn.innerHTML = modalState.currentStep === totalSteps ? 'Submit Application' : 'Continue <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
    }
    
    // Generate HTML based on step
    let html = '';
    
    if (modalState.currentStep === 0) {
        html = `
            <div class="space-y-6 transition-opacity duration-300">
                <div class="text-center space-y-2">
                    <h3 class="font-display-lg text-headline-lg leading-tight">Welcome to Uncreator.Club</h3>
                    <p class="font-body-md text-on-surface-variant">Tell us who you are so we can build the right bridge.</p>
                </div>
                <div class="grid sm:grid-cols-2 gap-4 pt-4">
                    <label class="cursor-pointer">
                        <input type="radio" name="persona-select" value="brand" class="editorial-radio" checked>
                        <div class="editorial-select-card flex-col items-start gap-2 p-6 h-full text-left">
                            <span class="radio-icon mb-2"></span>
                            <span class="font-display-lg text-headline-md italic text-primary">I am a Brand / Founder</span>
                            <span class="font-body-md text-body-md text-on-surface-variant">I want to decode consumer perception, measure growth, and activate creators.</span>
                        </div>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="persona-select" value="creator" class="editorial-radio">
                        <div class="editorial-select-card flex-col items-start gap-2 p-6 h-full text-left">
                            <span class="radio-icon mb-2"></span>
                            <span class="font-display-lg text-headline-md italic text-secondary">I am a Creator</span>
                            <span class="font-body-md text-body-md text-on-surface-variant">I want to track campaign trends, share perspectives, and partner with cultural brands.</span>
                        </div>
                    </label>
                </div>
            </div>
        `;
    } else if (modalState.currentFlow === 'brand') {
        html = getBrandStepHtml(modalState.currentStep);
    } else if (modalState.currentFlow === 'creator') {
        html = getCreatorStepHtml(modalState.currentStep);
    }
    
    contentContainer.innerHTML = html;
}

// Brand Form HTML templates
function getBrandStepHtml(step) {
    const saved = modalState.data;
    switch(step) {
        case 1:
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">Let's understand what you're building.</h3>
                        <p class="font-body-md text-on-surface-variant">We design narratives for founders, small brands, and homegrown businesses.</p>
                    </div>
                    <div id="validation-error" class="hidden text-error font-body-md text-body-md">Please fill in all required fields.</div>
                    <div class="space-y-4">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Brand Name *</label>
                            <input type="text" id="brandName" value="${saved.brandName || ''}" class="editorial-input" placeholder="e.g. Alabaster Essentials">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Website *</label>
                            <input type="text" id="brandWebsite" value="${saved.brandWebsite || ''}" class="editorial-input" placeholder="e.g. alabaster.co">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Your Name *</label>
                            <input type="text" id="brandOwnerName" value="${saved.brandOwnerName || ''}" class="editorial-input" placeholder="e.g. Sarah Clay">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Email Address *</label>
                            <input type="email" id="brandOwnerEmail" value="${saved.brandOwnerEmail || ''}" class="editorial-input" placeholder="e.g. sarah@alabaster.co">
                        </div>
                    </div>
                </div>
            `;
        case 2:
            const cat = saved.brandCategory || 'Beauty';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">What category are you in?</h3>
                        <p class="font-body-md text-on-surface-variant">Choose the segment that best represents your core product.</p>
                    </div>
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Brand Category</label>
                        <select id="brandCategory" class="editorial-input">
                            <option value="Beauty" ${cat === 'Beauty' ? 'selected' : ''}>Beauty</option>
                            <option value="Wellness" ${cat === 'Wellness' ? 'selected' : ''}>Wellness</option>
                            <option value="Fashion" ${cat === 'Fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="Food & Beverage" ${cat === 'Food & Beverage' ? 'selected' : ''}>Food & Beverage</option>
                            <option value="Lifestyle" ${cat === 'Lifestyle' ? 'selected' : ''}>Lifestyle</option>
                            <option value="Home" ${cat === 'Home' ? 'selected' : ''}>Home</option>
                            <option value="Other" ${cat === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
            `;
        case 3:
            const challenges = saved.challenges || [];
            const isChecked = (val) => challenges.includes(val) ? 'checked' : '';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">What challenge are you trying to solve?</h3>
                        <p class="font-body-md text-on-surface-variant">Select all that apply. This tells us what you actually care about building.</p>
                    </div>
                    <div id="validation-error" class="hidden text-error font-body-md text-body-md">Please select at least one challenge.</div>
                    <div class="grid sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="More awareness" ${isChecked('More awareness')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>More awareness</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="More trust" ${isChecked('More trust')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>More trust</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="More content" ${isChecked('More content')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>More content</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="Product launch" ${isChecked('Product launch')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Product launch</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="Community building" ${isChecked('Community building')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Community building</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="Understanding customer perception" ${isChecked('Understanding customer perception')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Understanding perception</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="Creator partnerships" ${isChecked('Creator partnerships')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Creator partnerships</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="challenge" value="Other" ${isChecked('Other')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Other</div>
                        </label>
                    </div>
                </div>
            `;
        case 4:
            const statement = saved.statement || 'Customers don\'t know us';
            const isStatementChecked = (val) => statement === val ? 'checked' : '';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">Which statement feels most true today?</h3>
                        <p class="font-body-md text-on-surface-variant">Be honest. This question is worth more than 20 default CRM fields.</p>
                    </div>
                    <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                        <label class="cursor-pointer block">
                            <input type="radio" name="statement" value="Customers don't know us" ${isStatementChecked("Customers don't know us")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>Customers don't know us</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="statement" value="Customers know us but don't trust us" ${isStatementChecked("Customers know us but don't trust us")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>Customers know us but don't trust us</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="statement" value="Customers like us but don't buy" ${isStatementChecked("Customers like us but don't buy")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>Customers like us but don't buy</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="statement" value="We don't know what customers think" ${isStatementChecked("We don't know what customers think")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>We don't know what customers think</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="statement" value="We're launching something new" ${isStatementChecked("We're launching something new")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>We're launching something new</div>
                        </label>
                    </div>
                </div>
            `;
        case 5:
            const method = saved.bookingMethod || 'Book Discovery Call';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">Let's uncover what's shaping perception around your brand.</h3>
                        <p class="font-body-md text-on-surface-variant">We align brand narratives with consumer perception. Choose how you want to start.</p>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                        <label class="cursor-pointer">
                            <input type="radio" name="bookingMethod" value="Book Discovery Call" ${method === 'Book Discovery Call' ? 'checked' : ''} class="editorial-radio">
                            <div class="editorial-select-card flex-col items-start gap-2 p-6 h-full text-left">
                                <span class="radio-icon mb-2"></span>
                                <span class="font-body-lg text-body-lg font-semibold text-primary">Book Discovery Call</span>
                                <span class="text-xs text-on-surface-variant">Schedule a 15-minute briefing session directly with our strategy lead.</span>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="bookingMethod" value="Join Waitlist" ${method === 'Join Waitlist' ? 'checked' : ''} class="editorial-radio">
                            <div class="editorial-select-card flex-col items-start gap-2 p-6 h-full text-left">
                                <span class="radio-icon mb-2"></span>
                                <span class="font-body-lg text-body-lg font-semibold text-secondary">Join Waitlist</span>
                                <span class="text-xs text-on-surface-variant">Submit details and join our queue. We review and admit batches weekly.</span>
                            </div>
                        </label>
                    </div>
                </div>
            `;
        case 6:
            const ref = saved.referrer || 'Instagram';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">How did you hear about us?</h3>
                        <p class="font-body-md text-on-surface-variant">Help us map how our own community commerce ecosystem flows.</p>
                    </div>
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Referral Source</label>
                        <select id="referrer" class="editorial-input">
                            <option value="Instagram" ${ref === 'Instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="LinkedIn" ${ref === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                            <option value="Friend" ${ref === 'Friend' ? 'selected' : ''}>Friend</option>
                            <option value="Creator" ${ref === 'Creator' ? 'selected' : ''}>Creator</option>
                            <option value="Brand Founder" ${ref === 'Brand Founder' ? 'selected' : ''}>Brand Founder</option>
                            <option value="Event" ${ref === 'Event' ? 'selected' : ''}>Event</option>
                            <option value="Other" ${ref === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
            `;
    }
}

// Creator Form HTML templates
function getCreatorStepHtml(step) {
    const saved = modalState.data;
    switch(step) {
        case 1:
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">Tell us about your world.</h3>
                        <p class="font-body-md text-on-surface-variant">We prioritize your community and unique perspective before raw numbers.</p>
                    </div>
                    <div id="validation-error" class="hidden text-error font-body-md text-body-md">Please fill in all required fields.</div>
                    <div class="space-y-4">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Your Name *</label>
                            <input type="text" id="creatorName" value="${saved.creatorName || ''}" class="editorial-input" placeholder="e.g. Sarah Clay">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Email Address *</label>
                            <input type="email" id="creatorEmail" value="${saved.creatorEmail || ''}" class="editorial-input" placeholder="e.g. sarah@creators.co">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Instagram Handle *</label>
                            <input type="text" id="creatorInstagram" value="${saved.creatorInstagram || ''}" class="editorial-input" placeholder="e.g. @sarah_clay">
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">City *</label>
                            <input type="text" id="creatorCity" value="${saved.creatorCity || ''}" class="editorial-input" placeholder="e.g. New York">
                        </div>
                    </div>
                </div>
            `;
        case 2:
            const categories = saved.creatorCategories || [];
            const isChecked = (val) => categories.includes(val) ? 'checked' : '';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">What do you create around?</h3>
                        <p class="font-body-md text-on-surface-variant">Select all topics that align naturally with your voice.</p>
                    </div>
                    <div id="validation-error" class="hidden text-error font-body-md text-body-md">Please select at least one topic.</div>
                    <div class="grid sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Beauty" ${isChecked('Beauty')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Beauty</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Wellness" ${isChecked('Wellness')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Wellness</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Fashion" ${isChecked('Fashion')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Fashion</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Food" ${isChecked('Food')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Food</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Lifestyle" ${isChecked('Lifestyle')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Lifestyle</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Parenting" ${isChecked('Parenting')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Parenting</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Tech" ${isChecked('Tech')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Tech</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorCategory" value="Other" ${isChecked('Other')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Other</div>
                        </label>
                    </div>
                </div>
            `;
        case 3:
            const desc = saved.creatorDescription || 'I love discovering products early';
            const isDescChecked = (val) => desc === val ? 'checked' : '';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">Which best describes you?</h3>
                        <p class="font-body-md text-on-surface-variant">We align identity. Choose the statement that resonates best.</p>
                    </div>
                    <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="I love discovering products early" ${isDescChecked("I love discovering products early")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>I love discovering products early</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="I enjoy reviewing products" ${isDescChecked("I enjoy reviewing products")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>I enjoy reviewing products</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="I love sharing opinions" ${isDescChecked("I love sharing opinions")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>I love sharing opinions</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="I build communities" ${isDescChecked("I build communities")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>I build communities</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="I influence purchase decisions" ${isDescChecked("I influence purchase decisions")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>I influence purchase decisions</div>
                        </label>
                        <label class="cursor-pointer block">
                            <input type="radio" name="creatorDescription" value="A mix of all of these" ${isDescChecked("A mix of all of these")} class="editorial-radio">
                            <div class="editorial-select-card p-4 text-left"><span class="radio-icon"></span>A mix of all of these</div>
                        </label>
                    </div>
                </div>
            `;
        case 4:
            const interests = saved.creatorInterests || [];
            const isInterestChecked = (val) => interests.includes(val) ? 'checked' : '';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">What excites you most?</h3>
                        <p class="font-body-md text-on-surface-variant">Select all. This helps match you with compatible brand projects.</p>
                    </div>
                    <div id="validation-error" class="hidden text-error font-body-md text-body-md">Please select at least one area.</div>
                    <div class="grid sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="Brand collaborations" ${isInterestChecked('Brand collaborations')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Brand collaborations</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="Product testing" ${isInterestChecked('Product testing')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Product testing</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="Community events" ${isInterestChecked('Community events')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Community events</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="Creator networking" ${isInterestChecked('Creator networking')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Creator networking</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="Feedback circles" ${isInterestChecked('Feedback circles')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>Feedback circles</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" name="creatorInterest" value="UGC opportunities" ${isInterestChecked('UGC opportunities')} class="editorial-checkbox">
                            <div class="editorial-select-card p-4 text-left"><span class="checkbox-icon"></span>UGC opportunities</div>
                        </label>
                    </div>
                </div>
            `;
        case 5:
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">How large is your community?</h3>
                        <p class="font-body-md text-on-surface-variant">Optional. We value unique perspective before reach.</p>
                    </div>
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Instagram Followers (Optional)</label>
                        <input type="text" id="creatorFollowers" value="${saved.creatorFollowers || ''}" class="editorial-input" placeholder="e.g. 5,400">
                    </div>
                </div>
            `;
        case 6:
            const ref = saved.referrer || 'Instagram';
            return `
                <div class="space-y-6">
                    <div>
                        <h3 class="font-display-lg text-headline-lg italic leading-tight">How did you hear about us?</h3>
                        <p class="font-body-md text-on-surface-variant">Help us track community commerce loops.</p>
                    </div>
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant block mb-1">Referral Source</label>
                        <select id="referrer" class="editorial-input">
                            <option value="Instagram" ${ref === 'Instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="LinkedIn" ${ref === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                            <option value="Friend" ${ref === 'Friend' ? 'selected' : ''}>Friend</option>
                            <option value="Creator" ${ref === 'Creator' ? 'selected' : ''}>Creator</option>
                            <option value="Brand Founder" ${ref === 'Brand Founder' ? 'selected' : ''}>Brand Founder</option>
                            <option value="Event" ${ref === 'Event' ? 'selected' : ''}>Event</option>
                            <option value="Other" ${ref === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
            `;
    }
}

// Validation logic for active step
function validateCurrentStep() {
    const errorMsg = document.getElementById('validation-error');
    if (errorMsg) errorMsg.classList.add('hidden');
    
    if (modalState.currentStep === 0) {
        return document.querySelector('input[name="persona-select"]:checked') !== null;
    }
    
    if (modalState.currentFlow === 'brand') {
        if (modalState.currentStep === 1) {
            const name = document.getElementById('brandName')?.value.trim();
            const web = document.getElementById('brandWebsite')?.value.trim();
            const oName = document.getElementById('brandOwnerName')?.value.trim();
            const email = document.getElementById('brandOwnerEmail')?.value.trim();
            
            if (!name || !web || !oName || !email) {
                if (errorMsg) errorMsg.classList.remove('hidden');
                return false;
            }
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (errorMsg) {
                    errorMsg.innerText = 'Please enter a valid email address.';
                    errorMsg.classList.remove('hidden');
                }
                return false;
            }
        }
        if (modalState.currentStep === 3) {
            const checked = document.querySelectorAll('input[name="challenge"]:checked');
            if (checked.length === 0) {
                if (errorMsg) errorMsg.classList.remove('hidden');
                return false;
            }
        }
    } else if (modalState.currentFlow === 'creator') {
        if (modalState.currentStep === 1) {
            const name = document.getElementById('creatorName')?.value.trim();
            const email = document.getElementById('creatorEmail')?.value.trim();
            const ig = document.getElementById('creatorInstagram')?.value.trim();
            const city = document.getElementById('creatorCity')?.value.trim();
            
            if (!name || !email || !ig || !city) {
                if (errorMsg) errorMsg.classList.remove('hidden');
                return false;
            }
            // Email regex check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (errorMsg) {
                    errorMsg.innerText = 'Please enter a valid email address.';
                    errorMsg.classList.remove('hidden');
                }
                return false;
            }
        }
        if (modalState.currentStep === 2) {
            const checked = document.querySelectorAll('input[name="creatorCategory"]:checked');
            if (checked.length === 0) {
                if (errorMsg) errorMsg.classList.remove('hidden');
                return false;
            }
        }
        if (modalState.currentStep === 4) {
            const checked = document.querySelectorAll('input[name="creatorInterest"]:checked');
            if (checked.length === 0) {
                if (errorMsg) errorMsg.classList.remove('hidden');
                return false;
            }
        }
    }
    
    return true;
}

// Save data from current step controls into state.data
function saveCurrentStepData() {
    if (modalState.currentStep === 0) return;
    
    if (modalState.currentFlow === 'brand') {
        if (modalState.currentStep === 1) {
            modalState.data.brandName = document.getElementById('brandName')?.value.trim();
            modalState.data.brandWebsite = document.getElementById('brandWebsite')?.value.trim();
            modalState.data.brandOwnerName = document.getElementById('brandOwnerName')?.value.trim();
            modalState.data.brandOwnerEmail = document.getElementById('brandOwnerEmail')?.value.trim();
        }
        if (modalState.currentStep === 2) {
            modalState.data.brandCategory = document.getElementById('brandCategory')?.value;
        }
        if (modalState.currentStep === 3) {
            const checked = document.querySelectorAll('input[name="challenge"]:checked');
            modalState.data.challenges = Array.from(checked).map(el => el.value);
        }
        if (modalState.currentStep === 4) {
            const selected = document.querySelector('input[name="statement"]:checked');
            modalState.data.statement = selected ? selected.value : '';
        }
        if (modalState.currentStep === 5) {
            const selected = document.querySelector('input[name="bookingMethod"]:checked');
            modalState.data.bookingMethod = selected ? selected.value : '';
        }
        if (modalState.currentStep === 6) {
            modalState.data.referrer = document.getElementById('referrer')?.value;
        }
    } else if (modalState.currentFlow === 'creator') {
        if (modalState.currentStep === 1) {
            modalState.data.creatorName = document.getElementById('creatorName')?.value.trim();
            modalState.data.creatorEmail = document.getElementById('creatorEmail')?.value.trim();
            modalState.data.creatorInstagram = document.getElementById('creatorInstagram')?.value.trim();
            modalState.data.creatorCity = document.getElementById('creatorCity')?.value.trim();
        }
        if (modalState.currentStep === 2) {
            const checked = document.querySelectorAll('input[name="creatorCategory"]:checked');
            modalState.data.creatorCategories = Array.from(checked).map(el => el.value);
        }
        if (modalState.currentStep === 3) {
            const selected = document.querySelector('input[name="creatorDescription"]:checked');
            modalState.data.creatorDescription = selected ? selected.value : '';
        }
        if (modalState.currentStep === 4) {
            const checked = document.querySelectorAll('input[name="creatorInterest"]:checked');
            modalState.data.creatorInterests = Array.from(checked).map(el => el.value);
        }
        if (modalState.currentStep === 5) {
            modalState.data.creatorFollowers = document.getElementById('creatorFollowers')?.value.trim();
        }
        if (modalState.currentStep === 6) {
            modalState.data.referrer = document.getElementById('referrer')?.value;
        }
    }
}

// Final Submission
function submitOnboardingData() {
    saveCurrentStepData();
    console.log('Onboarding data submitted:', modalState.data);
    
    // Hide progress bar & navigation buttons, show success markup
    const progress = document.getElementById('modal-progress');
    const stepIndicator = document.getElementById('modal-step-indicator');
    const contentContainer = document.getElementById('modal-content');
    const footerNav = contentContainer.nextElementSibling;
    
    if (progress) progress.style.width = '100%';
    if (stepIndicator) stepIndicator.style.display = 'none';
    if (footerNav) footerNav.style.display = 'none';
    
    let html = '';
    if (modalState.currentFlow === 'brand') {
        html = `
            <div class="text-center py-12 space-y-6">
                <span class="material-symbols-outlined text-[64px] text-primary">check_circle</span>
                <div class="space-y-2">
                    <h3 class="font-display-lg text-headline-lg italic">Thank you, Founder.</h3>
                    <p class="font-body-md text-on-surface-variant max-w-sm mx-auto">
                        We have recorded your answers. Our strategists will review your brand perception signals and contact you within 24 hours.
                    </p>
                </div>
                <div class="pt-4">
                    <button onclick="closeModal()" class="bg-primary text-on-primary px-8 py-3 rounded-lg font-body-md text-body-md font-semibold hover:opacity-90 transition-all shadow-editorial">
                        Return to Homepage
                    </button>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="text-center py-12 space-y-6">
                <span class="material-symbols-outlined text-[64px] text-secondary">check_circle</span>
                <div class="space-y-2">
                    <h3 class="font-display-lg text-headline-lg italic">Welcome to the Circle.</h3>
                    <p class="font-body-md text-on-surface-variant max-w-sm mx-auto">
                        Your application is received. We evaluate perspective and identity before reach. We'll be in touch as soon as we match you with a brand shaping culture.
                    </p>
                </div>
                <div class="pt-4">
                    <button onclick="closeModal()" class="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-body-md text-body-md font-semibold hover:opacity-90 transition-all shadow-editorial">
                        Return to Homepage
                    </button>
                </div>
            </div>
        `;
    }
    
    if (contentContainer) contentContainer.innerHTML = html;
}
