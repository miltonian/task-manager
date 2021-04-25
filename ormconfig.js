require('dotenv').config();

const settings = {
  development: [{
   "name": "default",
   "type": "postgres",
   "host": "127.0.0.1",
   "port": 5432,
   "username": "",
   "password": "",
   "database": "task-manager",
   "synchronize": false,
   "logging": ["error"],
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
   }}],
   test: [{
   "name": "default",
   "type": "postgres",
   "host": "127.0.0.1",
   "port": 5432,
   "username": "",
   "password": "",
   "database": "task-manager-test",
   "synchronize": true,
   "logging": ["error"],
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
   }
}]}

module.exports = settings[process.env.NODE_ENV] || settings.development;
