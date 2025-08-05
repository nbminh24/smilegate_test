#!/bin/bash

# Install dependencies using Bun
bun install --frozen-lockfile

# Build the application
bun run build

# Create .output directory if it doesn't exist
mkdir -p .output/public

# Copy the build output to .output/public
cp -r .nuxt/dist/client/* .output/public/ 2>/dev/null || :

# Create a basic server.js for Vercel
echo '// Vercel serverless function
const { createServer } = require("http");
const { createServer: createHttpsServer } = require("https");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});' > .output/server.js

echo '{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": ".output/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}' > .output/config.json

# Make the script executable
chmod +x .output/server.js
