const express = require("express");

const app = express();
const PORT = 3001;

const persons = [
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

app.get("/info", (request, response) => {
  const info =
    `<div>Phonebook has info for ${persons.length} people </div>` +
    `<br /><div>${new Date()}</div>`;

  response.send(info);
});

app.listen(PORT, () => {
  console.log(`phonebook-backend listening on port ${PORT}`);
});
