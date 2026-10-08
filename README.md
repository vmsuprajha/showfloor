# ShowFloor

A project expo gallery with a people's choice award. Visitors browse project cards, search them, and vote. Each registration number can vote only once, and this is checked on the server.

## Live links
- Website: https://showfloor-one.vercel.app
- Backend API: https://showfloor.onrender.com/api/projects

Note: the backend is on Render's free plan, so the first load after a quiet period can take up to 50 seconds.

## What works
- Gallery of project cards (image, title, team, description, components, tags, GitHub link)
- Search by title, team or tag
- Add a new project (title and team are required)
- Voting: one vote per registration number, checked on the server (returns an error if the number already voted)
- Live Top 3 board that refreshes every 3 seconds

## Not done yet
- Separate project detail page
- Tag filter dropdown (search covers tags for now)
- Permanent storage: data is kept in memory, so it resets when the server restarts
- Stretch goals (QR codes, image upload, voting deadline)

## Tech
- Frontend: React (Vite), in the `client` folder
- Backend: Node.js with Express, in the `server` folder

## Run it locally
1. Backend: `cd server`, then `npm install`, then `node index.js` (runs on port 3000)
2. Frontend: `cd client`, then `npm install`, then `npm run dev` (opens on localhost:5173)

## API
- GET /api/projects: list all projects
- POST /api/projects: add a project
- POST /api/votes: vote with { regNo, projectId }
- GET /api/votes/top: top 3 projects by votes

## How I used AI
I used Claude as a step-by-step mentor. It explained the setup (Node, Git, terminals), helped me fix errors with PowerShell, GitHub login and Render deployment, and provided the code for `server/index.js` and `client/src/App.jsx`. I ran and tested everything myself and went through each part to understand how it works, especially the one-vote check on the server.

Built by Suprajha
