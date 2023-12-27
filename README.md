# Summary

This repository is the Backend REST API for the auth functionality.

# Setting up

In order to set up the project locally, some actions need to be done. The following subsections contain pre-requirements and local setup steps.

## Pre-requirements

1. Make sure that your Node version is >= `18.0.0`.
   You can check your Node version in your terminal by running `node -v`. To change your Node version you can use `nvm` [Node Version Manager](https://github.com/nvm-sh/nvm).
2. Check if you have PostgreSQL >= 15 server up and running on your workstation. If not, you can download it [here](https://www.postgresql.org/download/).
    - Additionally, install [DBeaver](https://dbeaver.io/) database tool or whatever you want to work with the database.

## Docker compose local setup

1. Make sure that you have up-to-date docker engine ([Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Rancher Desktop](https://rancherdesktop.io/))
2. Clone the repository to your local machine
3. Create a copy of the `.env.example` file and rename it to `.env`
4. Fill all the empty `.env` fields with your valid credentials
5. Run `docker compose up` and wait until you see `"Nest application successfully started"`
6. Check that everything is working just fine
    1. Go to http://localhost:{$APPLICATION_PORT}/api/swagger and check that API is responding on calls
    3. Try to connect to the container database with UI (e.g. pgadmin or dbeaver). <br>Use `localhost:{TYPEORM_PORT}` and the database credentials from `.env` file

## Step-by-step local setup

1. Clone the repository to your local machine
2. Switch to `master` branch `git checkout master`
3. Install the dependencies using `npm ci`
4. Create a copy of the `.env.example` file and rename it to `.env`
5. Fill all the empty fields with your DB user credentials
6. Set up the database
    1. Run migrations `npm run migration:run`
    2. Run data seeds `npm run seed:run`
7. Start the application `npm run start:dev`
8. Visit swagger documentation `http://localhost:{port}/api/documentation`
9. Run tests `npm run test:e2e`