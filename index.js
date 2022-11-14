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
  let id = 1;
  while (persons.find((p) => p.id === id)) {
    id = Math.floor(Math.random() * 10000);
  }

  const person = { id, ...request.body };
  console.log("created:", person);

  persons = [...persons, person];

  response.status(201).end();
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
