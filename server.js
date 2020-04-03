const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const PORT = 4000;

// whenever graphql is in the route
// use this middleware
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true, // show the interface at the route
}));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
