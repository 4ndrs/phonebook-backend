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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const name = request.body.name;
  const number = request.body.number;

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.location(`/api/persons/${savedPerson.id}`);
      response.status(201).json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const info =
        `<div>Phonebook has info for ${persons.length} people </div>` +
        `<br /><div>${new Date()}</div>`;

      response.send(info);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`phonebook-backend listening on port ${PORT}`);
});
