#!/bin/bash
set -e

# Install dependencies first
bun install

# Now, run the build command
bun run build

echo "Build completed successfully!"
