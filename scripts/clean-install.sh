#!/bin/bash

rm -rf node_modules **/*/node_modules
rm -rf **/*/dist
rm -rf **/*/.rollup.cache
rm -rf **/*/coverage
rm -rf **/*/prisma/generated
rm -rf .turbo **/*/.turbo
rm -f **/*/tsconfig.tsbuildinfo
pnpm store prune
pnpm install
