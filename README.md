# Allowlist Builder

Generate an allowlist of users (with their wallets connected on Farcaster) from the likes or comments on a specific cast.

## Technical Description

The project is made with `frames.js` framework. Neynar API and replicator DB are used to access Farcaster data, such as cast content, comments, and reactions.

## Running locally

1. Copy the `.env.sample` to `.env` and fill all variables
2. `yarn`
3. `yarn dev`
