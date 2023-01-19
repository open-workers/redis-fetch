import type { RedisReply, RedisValue } from './protocol/types.ts';

interface RedisFetchResponse {
  error: boolean;
  result: string;
}

export interface CommandExecutor {
  exec(command: string, ...args: RedisValue[]): Promise<RedisReply>;
}

export class FetchCommandExecutor implements CommandExecutor {
  private readonly url: string;
  constructor(url: string) {
    this.url = url;
  }

  exec(command: string, ...args: RedisValue[]): Promise<RedisReply> {
    return this.sendCommand(command, args);
  }

  private sendCommand(command: string, args?: RedisValue[]) {
    const payload = { command: [command, ...(args?.map((a) => String(a)) ?? [])].join(' ') };

    console.log('->', JSON.stringify(payload));

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    return fetch(this.url, options)
      .then((res) => res.json())
      .then((json: RedisFetchResponse) => {
        if (json.error) {
          throw new Error(json.result);
        }

        return {
          value() {
            console.log('<-', JSON.stringify(json.result));
            return json.result;
          },
          string() {
            console.log('(string) <-', JSON.stringify(json.result));
            return String(json.result);
          },
          buffer() {
            const buf = new TextEncoder().encode(json.result);
            console.log(`(buffer) <- Uint8Array(${buf.length})`);
            return buf;
          }
        } as RedisReply;
      });
  }
}
