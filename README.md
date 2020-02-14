# CultureStake

CultureStake is a web-based voting and connection system for decentralised cultural decision making and investment.

Using quadratic voting on the blockchain, CultureStake’s playful front-end interface allows everyone to vote on the types of cultural activity they would like to see in their locality.

CultureStake democratises arts commissioning by providing communities and artists with a way to make cultural decisions together. It does this by giving communities a bigger say in the activities provided in their area, and by connecting artists and cultural organisations to better information about what is meaningful in different localities.

## Requirements

* NodeJS environment
* PostgreSQL database

## Usage

```
// Install dependencies
npm install

// Copy .env file for local development and testing
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
