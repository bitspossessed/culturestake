# CultureStake

CultureStake is a web-based voting system for cultural decision making and investment.

## Requirements

* NodeJS environment
* PostgreSQL database

## Usage

```
// Install dependencies
npm install

// Copy .env file for local development
cp .env.example .env

// Seed and migrate database
npm run db:migrate
npm run db:seed

// Run tests
npm run test
npm run test:watch

// Check code formatting
npm run lint

// Start local server and watch changes
npm run server:watch
npm run client:watch

// Build for production
npm run build

// Run production server
npm start
```

## Credits

CultureStake is a [Furtherfield](https://www.furtherfield.org/) / [DECAL](http://www.decal.is/) initiative.

## License

GNU Affero General Public License v3.0 `AGPL-3.0`
