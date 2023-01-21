[github-license-url]: /LICENSE
[action-docker-url]: https://github.com/open-workers/redis-fetch/actions/workflows/build.yml
[npm-package-url]: https://www.npmjs.com/@openworkers/redis-fetch
[redis-fetch-server-url]: https://github.com/open-workers/redis-fetch-server
[redis-fetch-server-commands-url]: https://github.com/open-workers/redis-fetch-server/blob/main/commands.ts

# Redis fetch

[![License](https://img.shields.io/github/license/maxx-t/nginx-jwt-module.svg)][github-license-url]
[![Build](https://img.shields.io/github/actions/workflow/status/open-workers/redis-fetch/build.yml?logo=deno&label=Package+build)][action-docker-url]
[![Npm package](https://img.shields.io/npm/v/@openworkers/redis-fetch.svg?logo=npm&logoColor=fff&label=NPM+package&color=blue)][npm-package-url]

A simple package that interfaces Redis with HTTP.

## Installation

```bash
npm install @openworkers/redis-fetch
```

## Usage

```typescript
import { createClient } from 'redis-fetch';

const redis = createClient('http://my-redis-fetch-server:port/command');

// Fetch a key from the Redis server
redis
  .get('my-key')
  .then((res) => console.log(res)) // prints "bar"
  .catch((err) => console.error(err));
```

## How does it work?

Redis fetch uses the a single http endpoint to send commands to the Redis-fetch server. The Redis-fetch server then sends the command to Redis and returns the result to the client.

You can communicate with the Redis-fetch server using any HTTP client. For example, using `fetch` in the browser:

```js
const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ command: 'get my-key' })
});
```

## Redis-fetch server

The [Redis-fetch server][redis-fetch-server-url] is a simple HTTP server.

## Limitations

- Authentication is not supported (yet) by this package nor the Redis-fetch server.
- Redis-fetch server only supports common Redis commands. See [Redis-fetch server supported commands][redis-fetch-server-commands-url] for more details. Theses commands are the most common ones and should be enough for most use cases. Some of them are still exposed by this package but will throw an error if used.

## Authors

This package is almost identical to [Deno's Redis driver](https://github.com/denodrivers/redis) so most of the credits go to [Redis driver contributors](https://github.com/denodrivers/redis/graphs/contributors).

## License

This package is licensed under the MIT License. See the [LICENSE][github-license-url] file for more details.
