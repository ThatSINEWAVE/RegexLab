document.addEventListener('DOMContentLoaded', () => {
    const presetRegexes = {
        email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        phone: '^\\+?\\d{10,14}$',
        url: '^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
        password: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$'
    };

    // Tab functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const tabToShow = header.dataset.tab;

            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            header.classList.add('active');
            document.getElementById(`${tabToShow}-tab`).classList.add('active');
        });
    });

    // Regex Testing Logic
    const regexPatternInput = document.getElementById('regex-pattern');
    const regexFlagsInput = document.getElementById('regex-flags');
    const testStringInput = document.getElementById('test-string');
    const testRegexBtn = document.getElementById('test-regex-btn');
    const validationErrorEl = document.getElementById('validation-error');
    const matchesContainer = document.getElementById('matches-container');
    const matchesList = document.getElementById('matches-list');
    const regexPresets = document.getElementById('regex-presets');

    regexPresets.addEventListener('change', (e) => {
        const selectedPreset = e.target.value;
        if (selectedPreset && presetRegexes[selectedPreset]) {
            regexPatternInput.value = presetRegexes[selectedPreset];
        }
    });

    testRegexBtn.addEventListener('click', () => {
        const pattern = regexPatternInput.value;
        const flags = regexFlagsInput.value;
        const testString = testStringInput.value;

        validationErrorEl.textContent = '';
        matchesList.innerHTML = '';
        matchesContainer.style.display = 'none';

        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];

            let match;
            const globalRegex = new RegExp(pattern, flags + 'g');

            while ((match = globalRegex.exec(testString)) !== null) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1)
                });
            }

            if (matches.length > 0) {
                matchesContainer.style.display = 'block';
                matches.forEach((matchItem, index) => {
                    const matchEl = document.createElement('div');
                    matchEl.classList.add('match-item');
                    matchEl.innerHTML = `
                        <strong>Match ${index + 1}:</strong>
                        ${matchItem.match}
                        <span style="color: #718096;">(index: ${matchItem.index})</span>
                    `;
                    matchesList.appendChild(matchEl);
                });
            }
        } catch (error) {
            validationErrorEl.textContent = error.message;
        }
    });

    // Regex Builder Logic
    const builderElements = {
        characterClasses: document.getElementById('character-classes'),
        quantifiers: document.getElementById('quantifiers'),
        anchorsGroups: document.getElementById('anchors-groups'),
        generatedRegex: document.getElementById('generated-regex'),
        copyRegexBtn: document.getElementById('copy-regex-btn')
    };

    const regexBuilderOptions = {
        characterClasses: {
            'Digit': '\\d',
            'Non-Digit': '\\D',
            'Word Character': '\\w',
            'Non-Word Character': '\\W',
            'Whitespace': '\\s',
            'Non-Whitespace': '\\S'
        },
        quantifiers: {
            'Zero or More': '*',
            'One or More': '+',
            'Zero or One': '?',
            'Exactly': '{n}',
            'At Least': '{n,}',
            'Between': '{n,m}'
        },
        anchorsGroups: {
            'Start of Line': '^',
            'End of Line': '$',
            'Word Boundary': '\\b',
            'Non-Word Boundary': '\\B'
        }
    };

    function populateBuilderOptions() {
        const categoryContainers = {
            'character-classes': builderElements.characterClasses,
            'quantifiers': builderElements.quantifiers,
            'anchors-groups': builderElements.anchorsGroups
        };

        Object.entries(regexBuilderOptions).forEach(([category, options]) => {
            const containerKey = category.replace(/([A-Z])/g, '-$1').toLowerCase();
            const container = categoryContainers[containerKey];

            if (container) {
                container.innerHTML = '';
                Object.entries(options).forEach(([label, value]) => {
                    const button = document.createElement('button');
                    button.classList.add('builder-option');
                    button.textContent = label;
                    button.dataset.value = value;
                    button.addEventListener('click', () => appendToRegex(value));
                    container.appendChild(button);
                });
            }
        });
    }

    function appendToRegex(value) {
        const currentRegex = builderElements.generatedRegex.value;
        builderElements.generatedRegex.value = currentRegex + value;
    }

    function initRegexBuilder() {
        populateBuilderOptions();

        // Custom character class builder
        const customCharClassBtn = document.getElementById('custom-char-class-btn');
        const customCharClassInput = document.getElementById('custom-char-class');

        customCharClassBtn.addEventListener('click', () => {
            const customClass = customCharClassInput.value.trim();
            if (customClass) {
                appendToRegex(`[${customClass}]`);
                customCharClassInput.value = '';
            }
        });

        // Repeater modal
        const repeatModal = document.getElementById('repeat-modal');
        const repeatInput = document.getElementById('repeat-input');
        const repeatConfirmBtn = document.getElementById('repeat-confirm');
        const showRepeatModalBtn = document.getElementById('show-repeat-modal');

        showRepeatModalBtn.addEventListener('click', () => {
            repeatModal.style.display = 'block';
        });

        repeatConfirmBtn.addEventListener('click', () => {
            const repeatValue = repeatInput.value.trim();
            if (repeatValue) {
                appendToRegex(`{${repeatValue}}`);
                repeatModal.style.display = 'none';
                repeatInput.value = '';
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === repeatModal) {
                repeatModal.style.display = 'none';
            }
        });

        // Copy regex button
        builderElements.copyRegexBtn.addEventListener('click', () => {
            const regexToCopy = builderElements.generatedRegex.value;
            navigator.clipboard.writeText(regexToCopy).then(() => {
                builderElements.copyRegexBtn.textContent = 'Copied!';
                setTimeout(() => {
                    builderElements.copyRegexBtn.textContent = 'Copy Regex';
                }, 2000);
            });
        });

        // Clear regex button
        const clearRegexBtn = document.getElementById('clear-regex-btn');
        clearRegexBtn.addEventListener('click', () => {
            builderElements.generatedRegex.value = '';
        });
    }

    // Initialize Regex Builder
    initRegexBuilder();
});