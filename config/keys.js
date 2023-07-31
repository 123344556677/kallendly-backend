const db = {
  username: "mfsoftinfo",
  password: "mfsoftinfo",
  database: "kallendly",
  cluster: "cluster0",
};

const uri = `mongodb+srv://${db.username}:${db.password}@${db.cluster}.7vsycle.mongodb.net/${db.database}?retryWrites=true&w=majority`;

module.exports = uri;
