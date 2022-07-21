# portal-galleries-sets-migration

Node.js scripts to migrate Europeana galleries from Contentful to the User Sets
API.

## Installation

Using Node 16:
```
npm install
```

## Configuration

Copy .env.example to .env and populate all variables.

## Usage

### Migrate galleries

To migrate galleries from Contentful to the Set API:
```
npm run gallery migrate
```

This will generate a log file at `./migrate.log` recording the slug from the
gallery and the equivalent Set URI.

### Clean sets

To delete all sets create by the `migrate` action, provided there is a
`./migrate.log` file to read from:
```
npm run gallery clean
```

## License

Licensed under the EUPL v1.2.

For full details, see [LICENSE.md](LICENSE.md).
