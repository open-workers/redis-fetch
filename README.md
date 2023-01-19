# Redis fetch

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

The Redis-fetch server is a simple [NodeJS server]()

## Limitations

- Authentication is not supported (yet) by this package nor the Redis-fetch server.
- Redis-fetch server only supports common Redis commands. See [Redis-fetch server supported commands]() for more details. Theses commands are the most common ones and should be enough for most use cases. Some of them are still exposed by this package but will throw an error if used.

## Authors

This package is almost identical to [Deno's Redis driver](https://github.com/denodrivers/redis) so most of the credits go to [Redis driver contributors](https://github.com/denodrivers/redis/graphs/contributors).

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
