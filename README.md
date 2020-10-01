# Server Opt

PostMan Documentation Link: https://documenter.getpostman.com/view/9425614/TVK77Lum

1. JavaScript(express)
2. Node Js(Platform)
3. MongoDB(Database)

## Project Structure

    |-config
        config.js
        custom-environment-variable.json
        default.json
        development.json
        production.json
    |-containers
        config.js
        database.js
        logging.js
        routes.js
        validate.js
    |-middleware
        admin.js
        async.js
        auth.js
        error.js
        logger.js
    |-models
        Contact.js
        Support.js
        Transaction.js
        User.js
        UserSession.js
    |-public
        readme.md
        readme.txt
    |-routes
        auth.js
        contact.js
        index.js
        support.js
        transaction.js
        users.js
    |-index.js
    .gitignore
    package.json
    package-lock.json
    README.md

## Dependencies

        "@hapi/joi": "^17.1.1",
        "bcrypt": "^5.0.0",
        "body-parser": "^1.19.0",
        "config": "^3.3.1",
        "cors": "^2.8.5",
        "debug": "^4.1.1",
        "dotenv": "^8.2.0",
        "express": "^4.17.1",
        "express-async-errors": "^3.1.1",
        "fawn": "^2.1.5",
        "helmet": "^3.23.3",
        "joi-objectid": "^3.0.1",
        "jsonwebtoken": "^8.5.1",
        "lodash": "^4.17.19",
        "mongoose": "^5.9.21",
        "morgan": "^1.10.0",
        "winston": "2.x",
        "winston-mongodb": "^3.0.0"

Run the following in your terminal to install all the dependencies

```shell
npm install
```

But if you wish to install them yourself, make sure to add the version e.g

```shell
npm install lodash@4.17.19
```

# Starting the Server

Run the following to start,

```shell
npm start
```

Run this to start the server with all development features

```shell
npm run start:dev
```

## Endpoints

0. http://localhost:3000/
1. http://localhost:3000/api/auth
2. http://localhost:3000/api/users
3. http://localhost:3000/api/contact
4. http://localhost:3000/api/support
5. http://localhost:3000/api/transactions

### 1. Landing Route ("http://localhost:3000/")

Request: NONE

Response: 

        {
            title: "Forbidden",
            message: "You attempted to access restricted content",
        }

### 2. Auth Route("https://api.igmrrf.com/auths")
