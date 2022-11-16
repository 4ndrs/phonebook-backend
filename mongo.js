const mongoose = require("mongoose");

require("dotenv").config({ path: "./.env.local" });

const printUsage = () => {
  console.log(
    "Usage: node mongo.js <password>\n" +
      "       node mongo.js <password> <person name> <person number>"
  );
};

const argc = process.argv.length;
if (argc < 3 || (argc < 5 && argc !== 3)) {
  console.log("Not enough arguments");
  printUsage();

  process.exit(1);
}

const password = process.argv[2];
const url = process.env.DB_URL.replace("<password>", password);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then(() => {
    if (argc === 3) {
      return Person.find({});
    }

    const name = process.argv[3];
    const number = process.argv[4];

    return new Person({
      name,
      number,
    })
      .save()
      .then(() => console.log(`added ${name} number ${number} to phonebook`));
  })
  .then((persons) => {
    if (persons) {
      console.log("phonebook:");
      persons.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
    }

    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
