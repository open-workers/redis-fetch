import { FetchCommandExecutor } from './executor.ts';
import { RedisImpl, Redis } from './redis.ts';

export function createClient(url: string): Redis {
  const executor = new FetchCommandExecutor(url);

  return new RedisImpl(executor);
}
