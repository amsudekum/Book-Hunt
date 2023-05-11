const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema')
const db = require('./config/connection');
const authMiddleware = require('./auth');


const app = express();
const PORT = process.env.PORT || 3000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const context = {
      req,
      user: null
    };
    return authMiddleware(context);
  },
});

server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
