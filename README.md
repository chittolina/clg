# clg - Stack Overflow Brazilian Users Listing

This project consists in a Stack Overflow Brazilian Users listing, ordered by last access date. It was setup using [@chittolina/fsts](https://github.com/chittolina/fsts) boilerplate (which was created yesterday to try a little of TypeScript).

You can find the current development state following this README, on the **Roadmap** section.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

In order to correctly use the application please make sure you have these two
working fine before we can get started:

- [Node.js 10+](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/)
- [MongoDB 4.0+](https://www.mongodb.com/download-center/community)

## Installing the dependencies

```
yarn install
```

## Starting development server

### Server side

In order to start a development server, run (make sure your mongodb is running):

```
yarn dev:api
```

This will start the API at `http://localhost:3000`. You can open up a browser and try the following URL to see the API working:

- `http://localhost:3000/user`

### Client side

In order to serve the client files, run (for now it will be only a sample):

```
yarn dev:client
```

This will serve the files at `http://localhost:1234`

## Building for production

```
yarn build:api
```

This will output the API generated files under `dist/api`.

```
yarn build:client
```

This will output the client generated files under `dist/client`.

## Testing

```
yarn test
```

> **NOTE**:
> This will currently run tests for server side only.

## Roadmap

- [x] Create API StackOverflow service
- [x] Create API User listing
- [x] Create API initial tests
- [ ] Add Client part of the project
- [ ] Add Client initial tests

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
