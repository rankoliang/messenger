# Messenger

A one-to-one realtime chat app.

## Initial Setup

Create the PostgreSQL database (these instructions may need to be adapted for your operating system):

```
psql
CREATE DATABASE messenger;
\q
```

Update db.js to connect with your local PostgreSQL set up. The [Sequelize documentation](https://sequelize.org/master/manual/getting-started.html) can help with this.

Create a .env file in the server directory and add your session secret (this can be any string):

```
SESSION_SECRET = "your session secret"
```

In the server folder, install dependencies and then seed the database:

```
cd server
npm install
npm run seed
```

In the client folder, install dependencies:

```
cd client
npm install
```

### Running the Application Locally

In one terminal, start the front end:

```
cd client
npm start
```

In a separate terminal, start the back end:

```
cd server
npm run dev
```

### Running tests

To run the tests for the client, run:

```
cd client
npm run test
```

To run the test for the server, run:

```
cd server
npm run test
```

## Improvements

Some improvements that could be done to the application

- Normalize the redux store
  - Currently, in order to access a specific conversation or message, one would have to iterate through all of the conversations to modify it.
  - It would be easier to develop and better for performance if a conversation with a specific id could be accessed directly.
- Sockets should emit only directly to the recipient of the message
  - When you send a message, it is broadcasted to anyone connected, which could mean that personal information could be leaked.
