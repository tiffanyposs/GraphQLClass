# GraphQL

## Project Startup

### Mock Database

```
$ npm run json:server

```

You can access the root at `localhost:3000`.

You can go to these routes to see the data from the `db.json` file

JSON Server Project Homepage:

(http://localhost:3000/)[http://localhost:3000/]

Users data (which we created in `db.json`)

(http://localhost:3000/users)[http://localhost:3000/users]

Specific Users data (which we created in `db.json`)

(http://localhost:3000/users/23)[http://localhost:3000/users/23]

Company 2's users

(http://localhost:3000/companies/2/users)[http://localhost:3000/companies/2/users]

### Regular Server

In a separate terminal window

```
$ npm run dev

```

Get GraphQL interface:

(http://localhost:4000/graphql)[http://localhost:4000/graphql]

## What does GraphQL solve?

GraphQL solves for an issue caused in applications that have a lot of relational data. Endpoints become elaborate and hard to manage, GraphQL allows you to query exactly what you want using a `graph` structure.

A `graph` is a type of data structure in programming that has `nodes` and relations/`edges` between the nodes. GraphQL is just a bunch of `edges` between `nodes`.

### Classic example

If we want to create a RESTful api for a blog with CRUD, we would have to make all of these routes

* `/posts` - `POST` - Creates a new post
* `/posts` - `GET` - Gets all the posts
* `/posts/14` - `GET` - Gets post 14
* `/posts/15` - `PUT` - Updates post 15
* `/posts/18` - `DELETE` - Deletes post 18

If we added users we would need to add all of these routes

* `/users/23/posts` - `POST` - Create a post associated with user 23
* `/users/23/posts` - `GET` - Fetch all posts created by User 23
* `/users/23/posts/14` - `GET` - Fetch post 14 created by User 23
* `/users/23/posts/15` - `PUT` - Update post 15 create by User 23
* `/users/23/posts/18` - `DELETE` - Delete post 18 created by User 23

As we add nested data, this gets very complex

### Social Media Example

If there have a list of users on a page with the below information, if that data lived together in one table for users it would be challenging to get a list of all companies or all position etc.

#### Initial User Schema

**User**

* `id`
* `user_name`
* `position_name`
* `company_name`
* `image`

#### Better Overall Schema

**User**

* `id`
* `name`
* `image`
* `company_id`
* `position_id`

**Company**

* `id`
* `name`
* `description`

**Position**

* `id`
* `name`
* `description`

#### Routes

The nesting of the information becomes very deep with a lot of requests.

##### Option 1

This makes a lot of http requests to get all of the needed data.

* Current User - `/users/23`
  - Friend - `/users/23/friends`
    - Company - `/users/1/companies` (repeat once for each friend)
    - Position - `/users/1/positions` (repeat once for each friend)

##### Option 2

This has a lot of custom endpoints and you need to put data together.

* Current User - `/users/23`
  - Friend - `/users/23/friends`
    - Company - `/users/23/friends/companies` - get all the companies for all the friends
    - Position - `/users/23/friends/positions` - get all the positions for all of the friends

##### Option 3

Easier but breaks RESTful conventions and might send over way more data than needed.

* Current User - `/users/23`
  - Friend - `/users/23/friends_with_companies_and_positions` gets all of the friends with companies

### GraphQL example

* Get the user with id 23
* Find the friends associated
* Find the company of all the friends, but we only want the `name` property
* Find the position of all the friend, but we only want to `name` property

#### Example

```javascript

query {
  user(id: "23") {
    friends {
      company {
        name
      }
      position {
        name
      }
    }
  }
}

```

## How to use it

Query example

```
{
  user(id: "23") {
    id,
    firstName,
    age,
  }
}
```
