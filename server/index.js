const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Our storage: two lists kept in memory
let projects = [];
let votes = []; // each vote looks like { regNo, projectId }

// 1. Send all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// 2. Add a new project
app.post("/api/projects", (req, res) => {
  const { title, team, tags, image, description, components, github } = req.body;

  if (!title || !team) {
    return res.status(400).json({ error: "Title and team are required" });
  }

  const project = {
    id: String(Date.now()),
    title,
    team,
    tags: tags || [],
    image: image || "",
    description: description || "",
    components: components || "",
    github: github || "",
  };
  projects.push(project);
  res.status(201).json(project);
});

// 3. Vote: KEY CHALLENGE, one vote per registration number
app.post("/api/votes", (req, res) => {
  const { regNo, projectId } = req.body;

  if (!regNo || !projectId) {
    return res.status(400).json({ error: "Registration number and project are required" });
  }

  if (!projects.find((p) => p.id === projectId)) {
    return res.status(404).json({ error: "Project not found" });
  }

  const cleanRegNo = String(regNo).trim().toUpperCase();
  const alreadyVoted = votes.find((v) => v.regNo === cleanRegNo);

  if (alreadyVoted) {
    return res.status(409).json({ error: "This registration number has already voted" });
  }

  votes.push({ regNo: cleanRegNo, projectId });
  res.status(201).json({ message: "Vote counted!" });
});

// 4. Top 3 projects by number of votes
app.get("/api/votes/top", (req, res) => {
  const ranked = projects.map((p) => ({
    id: p.id,
    title: p.title,
    team: p.team,
    votes: votes.filter((v) => v.projectId === p.id).length,
  }));
  ranked.sort((a, b) => b.votes - a.votes);
  res.json(ranked.slice(0, 3));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));