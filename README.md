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
2. Download the Postgres binary for your platform from https://www.postgresql.org/download/.
   1. It might be helpful to use the installation tutorial at https://www.postgresqltutorial.com/install-postgresql/
3. In your terminal, cd to this project directory and run `npm i` to install the JS dependencies.

## Running the server

In the root directory of this project (in your terminal), run `npm start`.

## Testing

Run tests using `npm test`.

Testing is done with Jest: https://jestjs.io/en/

## Setting up the dummy/demo database

Once you've downloaded Postgres, search for `psql` in the Start menu (if on Windows)
and run the "SQL Shell (psql)" program.

Log in using the default options and the password you created during the installation.

Replace the path placeholder in the last command (the `\copy` one) in [db/setup.sql](./db/setup.sql)
with the absolute path to this project root directory.
If you're on Windows, either use forward slashes in the path or make sure that each backslash
is escaped/doubled (e.g., `C:\\path\\to\\file`).
So at the end, your path should look something like `'C:/project_path/db/products-dummy-data.csv'`.

Note: don't commit this change to Git! Just undo it once you're finished,
or discard your changes to the setup.sql file before committing.

Then, run the command below in the psql terminal.
Again, make sure the file path is formatted as described above.

```
\i 'ABSOLUTE_PATH_TO_PROJECT_ROOT/db/setup.sql';
```

After this, test the data load by running `SELECT * FROM products;` in the psql
terminal; you should see the dummy data displayed as a result.
That means the database should be ready to use!
