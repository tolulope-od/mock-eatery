# mock-eatery

REST API for a restaurant service

## API Documentation

https://documenter.getpostman.com/view/5955053/SVzw5gGq

## Tools

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

## Getting Started

**Development**

To clone and run this application locally, you'll need [Git](https://git-scm.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/tolulope-od/mock-eatery.git
```

This setup requires a MongoDB instance and a Redis database to get get started

Refer to the [.env.sample](.env.sample) file for the required environment variables to get the application up and running.

To install and run the application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Enter the project directory
$ cd mock-eatery

# Install dependencies
$ npm install

# Start the development server
$ npm run dev

```

When the development server is up and running (i.e displays a success message on your command line), you can test the server response by visiting the following endpoint using Postman:

`GET localhost:5000`

or with Curl:

`curl --location --request GET "localhost:5000"`

For a sample response from the server.

You can also seed your database with sample data which includes admin users, categories and recipes by running the following commands from your terminal:

```bash
# in the project directory
$ npm run seed:db
```

The user password will be what your set the environment variable `ADMIN_PASSWORD=` in your .env file to be

**Production**

This project is built using ES6 syntax so to build out the source code of this project into a browser-friendly and depolyable module on any server, the babel tooling has been setup and an npm script has been provided for that. Simply run the build script and deploy to the hosting platform of your choice

(Running the `npm start` script also creates a build and serves the app from the build folder)

```bash
# cd into project directory
$ cd mock-eatery/

# run build script
$ npm run build
```

## Author

- **Tolulope Odueke**
