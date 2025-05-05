// This file is processed and loaded automatically before your test files
// See: https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively, you can use CommonJS syntax:
// require('./commands')

// This hides the fetch/XHR requests in the command log
// Comment this out if you want to see API calls in your logs
const app = window.top;
if (app && app.document && app.document.head) {
  if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
  }
}