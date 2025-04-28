document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const yearSpan = document.getElementById('year');
    const htmlElement = document.documentElement;

    // --- Dark Mode ---
    const applyDarkMode = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; // Sun icon for light mode switch
        } else {
            htmlElement.classList.remove('dark');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; // Moon icon for dark mode switch
        }
    };

    // Check localStorage for saved preference
    const savedDarkMode = localStorage.getItem('darkMode');
    // Check system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Initialize dark mode based on saved pref or system pref
    // Default to light mode if nothing is set
    let isDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : prefersDark;
    applyDarkMode(isDarkMode);


    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyDarkMode(isDarkMode);
        });
    }

    // Listen for system preference changes
     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only change if no explicit user preference is saved
        if (localStorage.getItem('darkMode') === null) {
            isDarkMode = e.matches;
            applyDarkMode(isDarkMode);
        }
    });


    // --- Footer Year ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- JSON Diff Logic (Placeholder) ---
    const compareBtn = document.getElementById('compareBtn');
    const jsonInput1 = document.getElementById('jsonInput1');
    const jsonInput2 = document.getElementById('jsonInput2');
    const diffOutput = document.getElementById('diffOutput');
    const copyDiffBtn = document.getElementById('copyDiffBtn');

    if (compareBtn && jsonInput1 && jsonInput2 && diffOutput) {
        compareBtn.addEventListener('click', () => {
            const jsonStr1 = jsonInput1.value.trim();
            const jsonStr2 = jsonInput2.value.trim();
            diffOutput.innerHTML = ''; // Clear previous results
            copyDiffBtn.classList.add('hidden'); // Hide copy button initially

            let obj1, obj2;

            try {
                obj1 = JSON.parse(jsonStr1);
            } catch (e) {
                diffOutput.innerHTML = '<p class="text-red-500">Error parsing JSON Input 1: ' + e.message + '</p>';
                return;
            }

            try {
                obj2 = JSON.parse(jsonStr2);
            } catch (e) {
                diffOutput.innerHTML = '<p class="text-red-500">Error parsing JSON Input 2: ' + e.message + '</p>';
                return;
            }

            // Call the recursive semantic diff function
            const diffResult = findJsonDiffRecursive(obj1, obj2);

            // Check if any differences were found (using the results object directly)
            if (Object.keys(diffResult.added).length === 0 && Object.keys(diffResult.removed).length === 0 && Object.keys(diffResult.changed).length === 0) {
                 // Use the display function even for "no differences" for consistency
                 displayDiff(diffResult, diffOutput);
                 // diffOutput.innerHTML = '<p class="text-green-500 dark:text-green-400">No differences found.</p>'; // Alternative direct message
            } else {
                displayDiff(diffResult, diffOutput);
                copyDiffBtn.classList.remove('hidden'); // Show copy button
            }
        });
    }

     if (copyDiffBtn && diffOutput) {
        copyDiffBtn.addEventListener('click', () => {
            // Copy the text content of the diff output
            navigator.clipboard.writeText(diffOutput.textContent || diffOutput.innerText)
                .then(() => {
                    // Optional: Show feedback to the user
                    const originalText = copyDiffBtn.textContent;
                    copyDiffBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyDiffBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy diff: ', err);
                    // Optional: Show error feedback
                     const originalText = copyDiffBtn.textContent;
                    copyDiffBtn.textContent = 'Copy Failed';
                    setTimeout(() => {
                        copyDiffBtn.textContent = originalText;
                    }, 1500);
                });
        });
    }

});

// --- Core Semantic JSON Diff Function ---
function findJsonDiffRecursive(obj1, obj2, path = '') {
    const added = {};
    const removed = {};
    const changed = {};

    const keys1 = new Set(Object.keys(obj1 ?? {}));
    const keys2 = new Set(Object.keys(obj2 ?? {}));
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];
        const type1 = typeof val1;
        const type2 = typeof val2;

        if (!keys2.has(key)) {
            removed[currentPath] = val1;
        } else if (!keys1.has(key)) {
            added[currentPath] = val2;
        } else if (type1 !== type2) {
            // Different types are considered a change
            changed[currentPath] = { from: val1, to: val2 };
        } else if (Array.isArray(val1) && Array.isArray(val2)) {
            // Basic array comparison: treat as changed if stringified versions differ.
            // A more sophisticated array diff (e.g., longest common subsequence)
            // could be implemented for finer-grained changes within arrays.
            if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                changed[currentPath] = { from: val1, to: val2 };
            }
        } else if (type1 === 'object' && val1 !== null && val2 !== null) {
            // Recursively compare nested objects
            const nestedDiff = findJsonDiffRecursive(val1, val2, currentPath);
            Object.assign(added, nestedDiff.added);
            Object.assign(removed, nestedDiff.removed);
            Object.assign(changed, nestedDiff.changed);
        } else if (val1 !== val2) {
            // Primitive values differ
            changed[currentPath] = { from: val1, to: val2 };
        }
    }

    return { added, removed, changed };
}


// --- Display Diff Function ---
function displayDiff(diffResult, outputElement) {
    let html = '<pre class="whitespace-pre-wrap break-words">'; // Use pre for formatting, ensure wrapping

    const formatValue = (value) => {
        // Indent nested objects/arrays for readability
        return JSON.stringify(value, null, 2);
    };

    const sections = {
        Removed: { data: diffResult.removed, class: 'diff-removed', prefix: '-' },
        Added: { data: diffResult.added, class: 'diff-added', prefix: '+' },
        Changed: { data: diffResult.changed, class: 'diff-changed', prefix: '~' }
    };

    let hasContent = false;

    for (const [title, section] of Object.entries(sections)) {
        if (Object.keys(section.data).length > 0) {
            hasContent = true;
            html += `<strong class="block mt-2 mb-1">${title}:</strong>\n`; // Add some spacing
            for (const key in section.data) {
                if (title === 'Changed') {
                    const change = section.data[key];
                    // Display changed values with clear 'from' and 'to'
                    html += `<span class="${section.class}">`;
                    html += `${section.prefix} ${key}:\n`;
                    html += `  - From: ${formatValue(change.from)}\n`;
                    html += `  + To:   ${formatValue(change.to)}`;
                    html += `</span>\n`;
                } else {
                    // Display added or removed values
                    html += `<span class="${section.class}">${section.prefix} ${key}: ${formatValue(section.data[key])}</span>\n`;
                }
            }
        }
    }

     if (!hasContent) {
         html += '<span class="text-green-500 dark:text-green-400">No differences found.</span>';
     }

    html += '</pre>';
    outputElement.innerHTML = html;
}
