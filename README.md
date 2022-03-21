# Unsubscribe  app

You need to add the following env variables in order to work.

The default database is MySQL and MongoDB is an alternative to practice and test.

## APP VARIABLES

- APP_HOST="app_host"
- IMAGES_HOST="images_host"
- CAPTCHA_PRIVATE_KEY="captcha_private_key"

## DATABASE VARIABLE FOR UNSUBSCRIBE ENDPOINT WITH PRISMA ORM

- DATABASE_URL="mysql_database_url"

## SERVERLESS-MYSQL PACKAGE VARIALBE FOR SYNC ENDPOINT

Our host has performance issues and blocks connections to Lamba functions from Vercel using Prisma. With the endpoint sync we can add the new emails added in the production database. Work in Progress.. Looking for a solution so that our host does not block Vercel connections.

- MYSQL_HOST="database_host"
- MYSQL_PORT="3306"
- MYSQL_DATABASE="database_name"
- MYSQL_USERNAME="database_user"
- MYSQL_PASSWORD="database_password"