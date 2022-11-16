const express = require("express");
const morgan = require("morgan");

const Person = require("./models/person.js");

const app = express();
const PORT = process.env.PORT || 3001;

const morugan = (tokens, request, response) => {
  const method = tokens.method(request, response);
  const url = tokens.url(request, response);
  const status = tokens.status(request, response);
  const contentLength = tokens.res(request, response, "content-length");
  const responseTime = tokens["response-time"](request, response);
  const data = method === "POST" ? JSON.stringify(request.body) : "";

  return [
    method,
    url,
    status,
    contentLength,
    "-",
    responseTime,
    "ms",
    data,
  ].join(" ");
};

app.use(morgan(morugan));
app.use(express.static("build"));
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
  Person.find({}).then((persons) => response.json(persons));
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

  persons = persons.filter((p) => p.id !== id);

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

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    response.location(`/api/persons/${savedPerson.id}`);
    response.status(201).json(person);
  });
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
