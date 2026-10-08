import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyForm = { title: "", team: "", tags: "", image: "", description: "", components: "", github: "" };

const fields = [
  ["title", "Title *"],
  ["team", "Team name *"],
  ["tags", "Tags, separated by commas (e.g. arduino, line-follower)"],
  ["image", "Image link (optional)"],
  ["description", "What does it do?"],
  ["components", "Components used"],
  ["github", "GitHub link"],
];

const box = { display: "block", width: "100%", padding: 8, marginBottom: 8 };

function App() {
  const [projects, setProjects] = useState([]);
  const [top, setTop] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [regNo, setRegNo] = useState("");
  const [message, setMessage] = useState("");

  async function loadProjects() {
    const res = await fetch(API + "/api/projects");
    setProjects(await res.json());
  }

  async function loadTop() {
    const res = await fetch(API + "/api/votes/top");
    setTop(await res.json());
  }

  useEffect(() => {
    loadProjects();
    loadTop();
    const timer = setInterval(loadTop, 3000);
    return () => clearInterval(timer);
  }, []);

  async function addProject(e) {
    e.preventDefault();
    const res = await fetch(API + "/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter((t) => t),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setForm(emptyForm);
    setMessage("Project added!");
    loadProjects();
    loadTop();
  }

  async function vote(projectId) {
    if (!regNo) {
      setMessage("Enter your registration number first");
      return;
    }
    const res = await fetch(API + "/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regNo, projectId }),
    });
    const data = await res.json();
    setMessage(res.ok ? data.message : data.error);
    loadTop();
  }

  const shown = projects.filter((p) => {
    const text = (p.title + " " + p.team + " " + p.tags.join(" ")).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, textAlign: "left" }}>
      <h1>ShowFloor</h1>
      <p>Browse the expo projects and vote for your favourite. One vote per registration number.</p>

      {message && <p><strong>{message}</strong></p>}

      <h2>Top 3 (live)</h2>
      <ol>
        {top.map((p) => (
          <li key={p.id}>{p.title} ({p.team}): {p.votes} votes</li>
        ))}
      </ol>

      <h2>Your registration number</h2>
      <input style={box} placeholder="e.g. 24BCE1234" value={regNo} onChange={(e) => setRegNo(e.target.value)} />

      <h2>Projects</h2>
      <input style={box} placeholder="Search by title, team or tag" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {shown.map((p) => (
          <div key={p.id} style={{ border: "1px solid #888", borderRadius: 8, padding: 12 }}>
            {p.image && <img src={p.image} alt={p.title} style={{ width: "100%" }} />}
            <h3>{p.title}</h3>
            <p>Team: {p.team}</p>
            <p>{p.description}</p>
            <p>Components: {p.components}</p>
            <p>Tags: {p.tags.join(", ")}</p>
            {p.github && <p><a href={p.github} target="_blank">GitHub</a></p>}
            <button onClick={() => vote(p.id)}>Vote for this</button>
          </div>
        ))}
      </div>

      <h2>Add a project</h2>
      <form onSubmit={addProject}>
        {fields.map(([name, label]) => (
          <input
            key={name}
            style={box}
            placeholder={label}
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          />
        ))}
        <button type="submit">Add project</button>
      </form>
    </div>
  );
}

export default App;