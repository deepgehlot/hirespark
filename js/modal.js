document.addEventListener('DOMContentLoaded', function() {
    // --- Variables ---
    const modal = document.getElementById('templateModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const progressBar = document.getElementById('progressBar');
    const form = document.getElementById('resumeForm');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // --- Initialization ---
    initModalTriggers();
    updateProgress();

    // --- Event Listeners ---
    
    // Close Modal
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Navigation
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            // Final Step - Submit
            if (validateStep(currentStep)) {
                submitForm();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // File Uploads
    setupFileUpload('resumeUploadZone', 'resumeFile', 'resumeFileName');
    setupFileUpload('photoUploadZone', 'photoFile', 'photoFileName');

    // Selection Logic
    setupMultiSelect('emphasisOptions', 'emphasisInput');
    setupMultiSelect('excludeOptions', 'excludedSectionsInput');
    setupRadioGroup('eduPosOptions', 'eduPosInput');
    setupRadioGroup('expOrderOptions', 'expOrderInput');
    setupStyleSelection();


    // --- Functions ---

    function initModalTriggers() {
        // Find triggers (buttons that say "Use Template" or generic class)
        // Adjust selectors based on your actual site structure
        const buttons = document.querySelectorAll('a, button');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('use template')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal();
                });
            }
        });
    }

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showStep(step) {
        steps.forEach(s => {
            s.classList.remove('active');
            if (parseInt(s.dataset.step) === step) {
                s.classList.add('active');
            }
        });

        // Update Buttons
        if (step === 1) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        if (step === totalSteps) {
            nextBtn.textContent = 'Create My Resume';
            nextBtn.classList.add('btn-finish'); 
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.classList.remove('btn-finish');
        }

        updateProgress();
    }

    function updateProgress() {
        const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    function validateStep(step) {
        // Basic validation - check generic inputs in current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required], textarea[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = '#ff4444';
                // Reset color on input
                input.addEventListener('input', () => input.style.borderColor = '#333', {once: true});
            }
        });

        if (!valid) {
            // Optional: Show error toast/message
            // alert('Please fill in all required fields.'); 
        }
        
        return valid; // For now default to true to allow easy testing, implement strict later if needed
    }

    // --- Helper Components ---

    function setupFileUpload(zoneId, inputName, nameDisplayId) {
        const zone = document.getElementById(zoneId);
        const input = zone.querySelector('input[type="file"]');
        const nameDisplay = document.getElementById(nameDisplayId);

        zone.addEventListener('click', () => input.click());

        input.addEventListener('change', () => {
            if (input.files && input.files[0]) {
                nameDisplay.textContent = input.files[0].name;
                zone.style.borderColor = '#4a6fdc';
                zone.style.background = 'rgba(74, 111, 220, 0.1)';
            }
        });

        // Drag and drop events
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#4a6fdc';
            zone.style.background = 'rgba(74, 111, 220, 0.1)';
        });

        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#444';
            zone.style.background = 'transparent';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#444';
            zone.style.background = 'transparent';
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                input.files = e.dataTransfer.files;
                nameDisplay.textContent = input.files[0].name;
                zone.style.borderColor = '#4a6fdc';
                zone.style.background = 'rgba(74, 111, 220, 0.1)';
            }
        });
    }

    function setupMultiSelect(containerId, inputId) {
        const container = document.getElementById(containerId);
        const input = document.getElementById(inputId);
        if (!container) return;

        const buttons = container.querySelectorAll('.selection-btn');
        let selectedValues = [];

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    selectedValues = selectedValues.filter(v => v !== value);
                } else {
                    btn.classList.add('active');
                    selectedValues.push(value);
                }
                
                input.value = JSON.stringify(selectedValues);
            });
        });
    }

    function setupRadioGroup(groupId, inputId) {
        const group = document.getElementById(groupId);
        const input = document.getElementById(inputId);
        if (!group) return;

        const options = group.querySelectorAll('.radio-option');

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                // Deselect others
                options.forEach(o => o.classList.remove('active'));
                
                // Select this
                opt.classList.add('active');
                input.value = opt.dataset.value;
            });
        });
    }

    function setupStyleSelection() {
        const container = document.getElementById('styleOptions');
        if (!container) return;
        
        const cards = container.querySelectorAll('.style-card');
        const input = document.getElementById('selectedStyleInput');
        const previewArea = document.querySelector('.resume-preview');

        // Path to images
        const imagePaths = {
            'purple-modern': 'img/resume_samples/purple-modern.jpg',
            'modern-corporate': 'img/resume_samples/modern-corporate.jpg',
            'yellow-modern': 'img/resume_samples/yellow-modern.jpg'
        };

        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const style = card.dataset.value;
                input.value = style;

                // Update Preview with Image
                if (imagePaths[style]) {
                     previewArea.innerHTML = `<img src="${imagePaths[style]}" alt="${style} preview" class="preview-img">`;
                }
            });
        });
        
        // specific fix: trigger click on the first one or loaded one if exists, or just leave blank until clicked
        // Optional: Select first one by default
        // cards[0].click();
    }

    function submitForm() {
        // Gather all data
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to JSON object
        formData.forEach((value, key) => {
             data[key] = value;
        });

        // Add multi-select values explicitly if needed (though hidden inputs handle it)
        
        console.log('Form Submitted!', data);
        
        // Future Integration: Send 'data' to Google Sheets API / Email Service
        
        alert('Resume Data Collected! (Check Console for JSON output)');
        closeModal();
    }
});
