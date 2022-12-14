const mongoose = require("mongoose");

require("dotenv").config({ path: "./.env.local" });

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    validate: {
      validator: function (v) {
        return new Promise((resolve, reject) =>
          this.constructor.find({ name: v }).then((results) => {
            if (results.length > 0) {
              reject(new Error(`${v} already exists in the database`));
            }
            resolve();
          })
        );
      },
    },
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{6,}$|^\d{8,}$/.test(v),
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
