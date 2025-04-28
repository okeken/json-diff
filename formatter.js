document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput')?.querySelector('code'); // Target the code element inside pre
    const outputPlaceholder = document.getElementById('outputPlaceholder');
    const validationError = document.getElementById('validationError');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const autoFormatCheckbox = document.getElementById('autoFormat');

    let currentFormattedJson = ''; // Store the latest valid formatted/minified JSON

    const displayOutput = (text, isError = false) => {
        if (jsonOutput && outputPlaceholder) {
             if (isError || !text) {
                jsonOutput.textContent = ''; // Clear output on error or empty
                outputPlaceholder.classList.remove('hidden'); // Show placeholder
                if (isError) {
                     validationError.textContent = text;
                     validationError.classList.remove('hidden');
                } else {
                     validationError.classList.add('hidden');
                }
                 currentFormattedJson = ''; // Reset stored JSON on error
            } else {
                jsonOutput.textContent = text;
                outputPlaceholder.classList.add('hidden'); // Hide placeholder
                validationError.classList.add('hidden'); // Hide error message
                currentFormattedJson = text; // Store the valid output
            }
        }
    };

    const processJson = (minify = false) => {
        const rawJson = jsonInput.value.trim();
        if (!rawJson) {
            displayOutput(''); // Clear output if input is empty
            return;
        }

        try {
            const jsonObj = JSON.parse(rawJson);
            const outputJson = minify
                ? JSON.stringify(jsonObj)
                : JSON.stringify(jsonObj, null, 4); // Pretty print with 4 spaces
            displayOutput(outputJson);
        } catch (e) {
            // Try to find the error position (basic approach)
            let errorMessage = `Invalid JSON: ${e.message}`;
             // JSON.parse errors often include position information in modern browsers
             // Example: "Unexpected token a in JSON at position 1"
             const match = e.message.match(/at position (\d+)/);
             if (match && match[1]) {
                 const position = parseInt(match[1], 10);
                 // Basic line/col calculation (might not be perfect for all cases)
                 const textBeforeError = rawJson.substring(0, position);
                 const lines = textBeforeError.split('\n');
                 const errorLine = lines.length;
                 const errorCol = lines[lines.length - 1].length + 1;
                 errorMessage += ` (around line ${errorLine}, column ${errorCol})`;
             }
            displayOutput(errorMessage, true);
        }
    };

    if (formatBtn) {
        formatBtn.addEventListener('click', () => processJson(false));
    }

    if (minifyBtn) {
        minifyBtn.addEventListener('click', () => processJson(true));
    }

    if (copyBtn && jsonOutput) {
        copyBtn.addEventListener('click', () => {
            if (!currentFormattedJson) {
                 // Maybe provide feedback that there's nothing to copy
                 console.warn("No valid JSON output to copy.");
                 return;
            }
            navigator.clipboard.writeText(currentFormattedJson)
                .then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                     const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copy Failed';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
                });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
             if (!currentFormattedJson) {
                 console.warn("No valid JSON output to download.");
                 // Optionally disable the button or show feedback
                 return;
             }
            const blob = new Blob([currentFormattedJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted.json'; // Filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up
        });
    }

     // Auto-format on paste
     if (jsonInput && autoFormatCheckbox) {
         // Load saved preference
         const savedAutoFormat = localStorage.getItem('autoFormat') === 'true';
         autoFormatCheckbox.checked = savedAutoFormat;

         jsonInput.addEventListener('paste', (event) => {
             if (autoFormatCheckbox.checked) {
                 // Prevent default paste to handle it manually
                 event.preventDefault();
                 const text = (event.clipboardData || window.clipboardData).getData('text');
                 jsonInput.value = text; // Set the value first
                 // Process after a short delay to allow the DOM to update if needed
                 setTimeout(() => processJson(false), 50);
             }
         });

         // Save preference when checkbox changes
         autoFormatCheckbox.addEventListener('change', () => {
             localStorage.setItem('autoFormat', autoFormatCheckbox.checked);
         });
     }

     // Initial state setup
     displayOutput(''); // Ensure output is clear initially

});
