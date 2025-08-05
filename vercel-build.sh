#!/bin/bash
set -e

# The Nuxt build command with the Vercel preset will automatically generate the correct output.
# All we need to do is run the build.
bun run build

echo "Build completed successfully!"
