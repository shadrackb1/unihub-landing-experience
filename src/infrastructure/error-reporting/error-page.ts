export function renderErrorPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>UniHub - Error</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background-color: #0A0A0A;
            color: #FFFFFF;
            margin: 0;
            padding: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .error-container {
            text-align: center;
            max-width: 400px;
          }
          .error-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .error-message {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          .error-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }
          .error-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }
          .error-button-primary {
            background-color: #6EE7B7;
            color: #0A0A0A;
          }
          .error-button-secondary {
            background-color: transparent;
            border: 1px solid #FFFFFF;
            color: #FFFFFF;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <div class="error-title">This page didn't load</div>
          <div class="error-message">
            Something went wrong on our end. You can try refreshing or head back home.
          </div>
          <div class="error-actions">
            <button class="error-button error-button-primary" onclick="location.reload()">
              Try again
            </button>
            <a href="/" class="error-button error-button-secondary">
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}
