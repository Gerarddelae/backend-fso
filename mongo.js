const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.ypxo6ve.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
  return;
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

person.save().then((result) => {
  console.log("person saved!");
  mongoose.connection.close();
});
