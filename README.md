# COSC 4351 Project: Habib/Le/Bartholome

Semester project for COSC 4351 with Dr. Singh at the University of Houston, Spring 2020.

Group members:
- Mohammad Habib
- Duy Le
- Travis Bartholome

## Project guidelines

See [project.txt](./project.txt).

## Downloading and installing dependencies

1. Download and install the Node and NPM LTS for your platform from https://nodejs.org/en/download/.
2. In your terminal, cd to this project directory and run `npm i` to install the JS dependencies.

## Running the server

In the root directory of this project (in your terminal), run `npm run dev` to
run the app in development mode (using nodemon for automatic server restart on
code changes).

Run `npm start` to start the app without nodemon (used by deployment).

## Testing

Run tests using `npm test`.

Testing is done with Jest: https://jestjs.io/en/

## Configuring the project

Create a file named `.env` in the project root directory.
This file will contain information that shouldn't be committed to version control
(database credentials, API keys, etc.).

Within that file, write the following information, replacing the values of each property
with the appropriate value:

```
DB_NAME=your_db_name
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_db_password
```
