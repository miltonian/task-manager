## Steps to run this project:

1. In Postgres, create 2 databases, password can be blank, with the following names...

- task-manager
- task-manager-test

2. Run `yarn` command
3. Setup database settings inside `ormconfig.js` file
4. Run `yarn typeorm migration:run` command inside the root directory
5. Run `yarn dev` command inside the root directory
6. Cd into the website/ directory and run `yarn start`

### Testing

- To test this project's api, run `yarn test` command inside the root directory
- To test this project's react website, cd into the website/ directory and run `yarn test` command inside the root directory
- To reset snapshots, run yarn test -u
