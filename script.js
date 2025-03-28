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

    // Regex testing logic
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
});