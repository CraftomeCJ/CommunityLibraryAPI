const { faker } = require("@faker-js/faker");

function makeRow(i) {
  const title = faker.company.catchPhrase();
  const author = faker.person.fullName();
  const availability = Math.random() < 0.8 ? "Y" : "N";
  return `INSERT INTO Books (title, author, availability) VALUES (${s(title)}, ${s(author)}, '${availability}');`;
}
function s(val) {
  return "'" + val.replace(/'/g, "''") + "'";
}

const total = 2000;
console.log("-- Generated book seed data");
for (let i = 0; i < total; i++) {
  console.log(makeRow(i));
}
