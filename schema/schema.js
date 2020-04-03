const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

const API_ROOT = 'http://localhost:3000';

// what a user object looks like
const UserType = new GraphQLObjectType({
  name: 'User', // usually the type, by convention capital
  fields: { // every single users will have these properties
    id: {
      type: GraphQLString, // what type of data is it?
    },
    firstName: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  }
});

// "Root Query" - in order for GraphQL to
// know where to start in our graph,
// it needs to know where to jump in (root query)

// you can lookup something called "user"
// which references the UserType,
// if you give me an id,
// I will give you an user with that id
// args: what is required to look up this user
// resolve: where we go into the database and find the actual data we are looking for
//   - parentValue (not used much)
//   - args reference the ones you set above
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString,
        }
      },
      resolve(parentValue, args) {
        // ping the endpoint to get the data
        return axios
          .get(`${API_ROOT}/users/${args.id}`)
          .then(res => res.data);
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
