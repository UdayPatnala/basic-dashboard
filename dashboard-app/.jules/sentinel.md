## 2024-05-24 - [Hardcoded secrets]
**Vulnerability:** Found hardcoded access codes (`"9703660750", "8639481969"`) in `App.js`.
**Learning:** Hardcoded access codes in a React component expose them to any user who visits the page, as React code is executed client-side.
**Prevention:** Avoid storing hardcoded secrets in the front-end code. Use environment variables (which also shouldn't hold sensitive secrets if bundled to client) or rely on a backend service for authentication. For now, we will replace the hardcoded secrets with environment variables to prevent them from being committed into the source tree.
