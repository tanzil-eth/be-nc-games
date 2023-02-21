# Northcoders House of Games API

## Background

This project is a RESTful API for NC-Games - a games review site. The API will be used to serve data to a front end application found at https://github.com/tanzil-eth/fe-nc-games. The API has been built using Node.js and Express.js, as well as the data being stored in a PostgreSQL database.

## Setting Up

After cloning the repository, you will need to install the dependencies that allow this API to function. To do this, run the following command in the terminal:

    npm install

After this, you will need to create new .env file in the root directory of the project. Thiswill contain the database connection details. The .env file should contain the following, with 'DATABASE-NAME' being changed to the name of the database found in the db folder.:

    PGDATABASE=DATABASE-NAME

Finally, you will need to setup and seed the database. To do this, run the following commands in the terminal:

    npm run setup-dbs

    npm run seed
