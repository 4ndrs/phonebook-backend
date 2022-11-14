const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  persons = persons.filter((p) => p.id !== id);

  console.log("deleted:", person);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const name = request.body.name;
  const number = request.body.number;

  if (!name || !number) {
    return response
      .status(400)
      .json({ error: "both name and number fields are required" });
  }

  if (persons.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
    return response.status(400).json({ error: "name must be unique" });
  }

  let id = 1;
  while (persons.find((p) => p.id === id)) {
    id = Math.floor(Math.random() * 10000);
  }

  const person = { ...request.body, id };
  console.log("created:", person);

  persons = [...persons, person];

  response.location(`/api/persons/${id}`);
  response.status(201).json(person);
});

app.get("/info", (request, response) => {
  const info =
    `<div>Phonebook has info for ${persons.length} people </div>` +
    `<br /><div>${new Date()}</div>`;

  response.send(info);
});

app.listen(PORT, () => {
  console.log(`phonebook-backend listening on port ${PORT}`);
});
