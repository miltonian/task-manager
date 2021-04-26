## Steps to run this project:

1. In Postgres, create 2 databases with the names...

- task-manager
- task-manager-test

2. Run `yarn` command
3. Setup database settings inside `ormconfig.js` file
4. Run `yarn typeorm migration:run` command inside the root directory
5. Run `yarn dev` command inside the root directory
6. Cd into the website/ directory and run `yarn start`

7. CREATE .env file and generate random alphanumeric value for the environment variable JWT_TOKEN

- e.g. JWT_TOKEN=asdf

### Testing

- To test this project's api, run `yarn test` command inside the root directory
- To test this project's react website, cd into the website/ directory and run `yarn test` command inside the root directory
- To reset snapshots, run yarn test -u
