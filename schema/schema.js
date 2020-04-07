const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

const API_ROOT = 'http://localhost:3000';

// what a company object looks like
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({ // create a closure to have access to UserType before it's defined
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    descriptions: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // tells GraphQL that this is a list of users
      resolve(parentValue, args) {
        return axios
          .get(`${API_ROOT}/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    },
  }),
});

// what a user object looks like
const UserType = new GraphQLObjectType({
  name: 'User', // usually the type, by convention capital
  fields: () => ({ // every single users will have these properties
    id: { type: GraphQLString }, // what type of data is it?
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType, // link company to the defined CompanyType
      resolve(parentValue, args) {
        // return company info based on the companyId from the user
        return axios
          .get(`${API_ROOT}/companies/${parentValue.companyId}`)
          .then(res => res.data);
      },
    },
  }),
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
    // USERS
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
    // END USERS
    // COMPANIES
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString,
        }
      },
      resolve(parentValue, args) {
        return axios
          .get(`${API_ROOT}/companies/${args.id}`)
          .then(res => res.data);
      }
    }
    // END COMPANIES
  },
});

// MUTATIONS - Add, update, delete
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // ADD USER
    addUser: {
      type: UserType, // refers to the type of data returned from the resolved function
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // must provide name
        age: { type: new GraphQLNonNull(GraphQLInt) }, // must provide age
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`${API_ROOT}/users`, {
            firstName,
            age
          })
          .then(res => res.data);
      }
    },
    // END ADD USER
    // DELETE USER
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`${API_ROOT}/users/${id}`)
          .then(res => res.data);
      }
    },
    // END DELETE USER

    // EDII USER
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`${API_ROOT}/users/${args.id}`, args)
          .then(res => res.data);
      }
    }
    // END EDII USER
  }
});
// END MUTATIONS

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
