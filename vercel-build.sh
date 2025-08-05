#!/bin/bash
set -e

# Install Bun if not already installed
if ! command -v bun &> /dev/null; then
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

# Install dependencies using Bun
echo "Installing dependencies..."
# First install without --frozen-lockfile to ensure lockfile is up to date
bun install --no-save

# Build the application
echo "Building application..."
bun run build

# Create .output directory structure
mkdir -p .output/public

# Copy the build output to .output/public
if [ -d ".nuxt/dist/client" ]; then
    echo "Copying Nuxt client files..."
    cp -r .nuxt/dist/client/* .output/public/
fi

# Create a basic server.js for Vercel
echo '// Vercel serverless function
const { createServer } = require("node:http");
const { parse } = require("node:url");
const { mkdir, readFile } = require("node:fs/promises");
const { join, extname } = require("node:path");

const PORT = process.env.PORT || 3000;

// Simple file server for static files
async function handleStatic(req, res) {
    try {
        const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
        const filePath = join(__dirname, "./public", pathname === "/" ? "index.html" : pathname);
        const ext = extname(filePath).toLowerCase();
        
        const mimeTypes = {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
            ".woff": "application/font-woff",
            ".ttf": "application/font-ttf",
            ".eot": "application/vnd.ms-fontobject",
            ".otf": "application/font-otf",
            ".wasm": "application/wasm"
        };

        const contentType = mimeTypes[ext] || "application/octet-stream";
        const content = await readFile(filePath);
        
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") {
            res.writeHead(404);
            res.end("Not found");
        } else {
            res.writeHead(500);
            res.end(`Server Error: ${error.code}`);
        }
    }
}

// Create server
const server = createServer((req, res) => {
    // Handle API routes
    if (req.url.startsWith("/api/")) {
        // API routes are handled by Vercel serverless functions
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "API route" }));
        return;
    }
    
    // Handle static files
    handleStatic(req, res);
});

// Start server
server.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});' > .output/server.js

# Make the script executable
chmod +x .output/server.js

# Create a simple vercel.json in the output directory
echo '{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api" },
    { "src": "/(.*)", "dest": "/" }
  ]
}' > .output/vercel.json

echo "Build completed successfully!"
