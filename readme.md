# Online JSON Diff & Formatter Tool

A simple, fast, and secure web app to **Compare JSON Online** and **Format JSON**. This tool functions as both a **JSON Formatter/Validator/Beautifier** and a **JSON Diff Checker**. Built with Vanilla JS and TailwindCSS, it runs entirely in your browser.

## Project Status

This project implements the core features outlined below. It consists of two main pages:

-   `/index.html`: The **Online JSON Diff** tool. Use this page to **compare two JSON files online**.
-   `/formatter.html`: The **Online JSON Formatter** tool. Use this to format, validate, beautify, and minify JSON.

## Features Implemented

-   **Online JSON Formatter & Validator (`/formatter.html`)**:
    -   **Format & Beautify JSON**: Pretty-print raw or minified JSON for readability.
    -   **Validate JSON**: Checks for syntax errors and provides clear messages.
    -   **Minify JSON**: Compress JSON data by removing whitespace.
    -   Copy formatted/minified JSON to clipboard.
    -   Download formatted/minified JSON as a `.json` file.
    -   Option to auto-format JSON on paste.
-   **Online JSON Diff Tool (`/index.html`)**:
    -   **Compare JSON Online**: Paste two JSON objects to compare them semantically with this **JSON compare tool**.
    -   **Visual Difference Checker**: Visually highlights added, removed, and changed fields using color-coding.
    -   Copy diff results to clipboard.
-   **General**:
    -   Dark Mode toggle (manual toggle + respects system preference initially).
    -   Mobile Responsive design (basic responsiveness via Tailwind).
    -   Clean, minimal UI using TailwindCSS.
    -   Basic SEO meta tags and Schema markup included.
    -   Placeholder for future monetization upsell.
    -   Pure frontend application, no backend required.

## How to Run

This is a purely static web application. No build process or server is required.

1.  Clone or download the project files.
2.  Open the `index.html` file directly in your web browser (e.g., by double-clicking it or using `File > Open` in your browser).
3.  Navigate between the Diff tool (`index.html`) and the Formatter tool (`formatter.html`) using the links in the navigation bar.

## Technology Stack

-   **HTML**: Structure and content.
-   **CSS**: Custom styles for diff highlighting (`style.css`).
-   **TailwindCSS (via CDN)**: Utility-first CSS framework for styling and layout.
-   **Vanilla JavaScript**: For all client-side logic, including:
    -   JSON parsing, formatting, validation, minification.
    -   Semantic JSON diffing algorithm.
    -   DOM manipulation.
    -   Event handling (button clicks, paste, etc.).
    -   Dark mode toggling and persistence (localStorage).
    -   Clipboard interaction.
    -   File download generation.

---
