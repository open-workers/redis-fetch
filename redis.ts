import type {
  ACLLogMode,
  BitfieldOpts,
  BitfieldWithOverflowOpts,
  ClientCachingMode,
  ClientKillOpts,
  ClientListOpts,
  ClientPauseMode,
  ClientTrackingOpts,
  ClientUnblockingBehaviour,
  ClusterFailoverMode,
  ClusterResetMode,
  ClusterSetSlotSubcommand,
  GeoRadiusOpts,
  GeoUnit,
  HScanOpts,
  LInsertLocation,
  LPosOpts,
  LPosWithCountOpts,
  MemoryUsageOpts,
  MigrateOpts,
  RestoreOpts,
  ScanOpts,
  ScriptDebugMode,
  SetOpts,
  SetWithModeOpts,
  ShutdownMode,
  SortOpts,
  SortWithDestinationOpts,
  SScanOpts,
  StralgoAlgorithm,
  StralgoOpts,
  StralgoTarget,
  ZAddOpts,
  ZInterOpts,
  ZInterstoreOpts,
  ZRangeByLexOpts,
  ZRangeByScoreOpts,
  ZRangeOpts,
  ZScanOpts,
  ZUnionstoreOpts
} from './command.ts';

import type {
  Binary,
  Bulk,
  BulkNil,
  BulkString,
  ConditionalArray,
  Integer,
  Raw,
  RedisReply,
  RedisValue,
  SimpleString
} from './protocol/types.ts';

import { RedisCommands } from './command.ts';
import { CommandExecutor } from './executor.ts';

export interface Redis extends RedisCommands {
  sendCommand(command: string, ...args: RedisValue[]): Promise<RedisReply>;
}

export class RedisImpl implements Redis {
  constructor(private readonly executor: CommandExecutor) {}

  sendCommand(command: string, ...args: RedisValue[]) {
    return this.executor.exec(command, ...args);
  }

  async execReply<T extends Raw = Raw>(command: string, ...args: RedisValue[]): Promise<T> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as T;
  }

  async execStatusReply(command: string, ...args: RedisValue[]): Promise<SimpleString> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as SimpleString;
  }

  async execIntegerReply(command: string, ...args: RedisValue[]): Promise<Integer> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as Integer;
  }

  async execBinaryReply(command: string, ...args: RedisValue[]): Promise<Binary | BulkNil> {
    const reply = await this.executor.exec(command, ...args);
    return reply.buffer();
  }

  async execBulkReply<T extends Bulk = Bulk>(command: string, ...args: RedisValue[]): Promise<T> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as T;
  }

  async execArrayReply<T extends Raw = Raw>(command: string, ...args: RedisValue[]): Promise<T[]> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as Array<T>;
  }

  async execIntegerOrNilReply(command: string, ...args: RedisValue[]): Promise<Integer | BulkNil> {
    const reply = await this.executor.exec(command, ...args);
    return reply.value() as Integer | BulkNil;
  }

  async execStatusOrNilReply(command: string, ...args: RedisValue[]): Promise<SimpleString | BulkNil> {
    const reply = await this.executor.exec(command, ...args);
    return reply.string() as SimpleString | BulkNil;
  }

  aclCat(categoryname?: string) {
    if (categoryname !== undefined) {
      return this.execArrayReply<BulkString>('ACL', 'CAT', categoryname);
    }
    return this.execArrayReply<BulkString>('ACL', 'CAT');
  }

  aclDelUser(...usernames: string[]) {
    return this.execIntegerReply('ACL', 'DELUSER', ...usernames);
  }

  aclGenPass(bits?: number) {
    if (bits !== undefined) {
      return this.execBulkReply<BulkString>('ACL', 'GENPASS', bits);
    }
    return this.execBulkReply<BulkString>('ACL', 'GENPASS');
  }

  aclGetUser(username: string) {
    return this.execArrayReply<BulkString | BulkString[]>('ACL', 'GETUSER', username);
  }

  aclHelp() {
    return this.execArrayReply<BulkString>('ACL', 'HELP');
  }

  aclList() {
    return this.execArrayReply<BulkString>('ACL', 'LIST');
  }

  aclLoad() {
    return this.execStatusReply('ACL', 'LOAD');
  }

  aclLog(count: number): Promise<BulkString[]>;
  aclLog(mode: ACLLogMode): Promise<SimpleString>;
  aclLog(param: number | ACLLogMode) {
    if (param === 'RESET') {
      return this.execStatusReply('ACL', 'LOG', 'RESET');
    }
    return this.execArrayReply<BulkString>('ACL', 'LOG', param);
  }

  aclSave() {
    return this.execStatusReply('ACL', 'SAVE');
  }

  aclSetUser(username: string, ...rules: string[]) {
    return this.execStatusReply('ACL', 'SETUSER', username, ...rules);
  }

  aclUsers() {
    return this.execArrayReply<BulkString>('ACL', 'USERS');
  }

  aclWhoami() {
    return this.execBulkReply<BulkString>('ACL', 'WHOAMI');
  }

  append(key: string, value: RedisValue) {
    return this.execIntegerReply('APPEND', key, value);
  }

  auth(param1: RedisValue, param2?: RedisValue) {
    if (param2 !== undefined) {
      return this.execStatusReply('AUTH', param1, param2);
    }
    return this.execStatusReply('AUTH', param1);
  }

  bgrewriteaof() {
    return this.execStatusReply('BGREWRITEAOF');
  }

  bgsave() {
    return this.execStatusReply('BGSAVE');
  }

  bitcount(key: string, start?: number, end?: number) {
    if (start !== undefined && end !== undefined) {
      return this.execIntegerReply('BITCOUNT', key, start, end);
    }
    return this.execIntegerReply('BITCOUNT', key);
  }

  bitfield(key: string, opts?: BitfieldOpts | BitfieldWithOverflowOpts) {
    const args: (number | string)[] = [key];
    if (opts?.get) {
      const { type, offset } = opts.get;
      args.push('GET', type, offset);
    }
    if (opts?.set) {
      const { type, offset, value } = opts.set;
      args.push('SET', type, offset, value);
    }
    if (opts?.incrby) {
      const { type, offset, increment } = opts.incrby;
      args.push('INCRBY', type, offset, increment);
    }
    if ((opts as BitfieldWithOverflowOpts)?.overflow) {
      args.push('OVERFLOW', (opts as BitfieldWithOverflowOpts).overflow);
    }
    return this.execArrayReply<Integer>('BITFIELD', ...args);
  }

  bitop(operation: string, destkey: string, ...keys: string[]) {
    return this.execIntegerReply('BITOP', operation, destkey, ...keys);
  }

  bitpos(key: string, bit: number, start?: number, end?: number) {
    if (start !== undefined && end !== undefined) {
      return this.execIntegerReply('BITPOS', key, bit, start, end);
    }
    if (start !== undefined) {
      return this.execIntegerReply('BITPOS', key, bit, start);
    }
    return this.execIntegerReply('BITPOS', key, bit);
  }

  blpop(timeout: number, ...keys: string[]) {
    return this.execArrayReply('BLPOP', ...keys, timeout) as Promise<[BulkString, BulkString] | BulkNil>;
  }

  brpop(timeout: number, ...keys: string[]) {
    return this.execArrayReply('BRPOP', ...keys, timeout) as Promise<[BulkString, BulkString] | BulkNil>;
  }

  brpoplpush(source: string, destination: string, timeout: number) {
    return this.execBulkReply('BRPOPLPUSH', source, destination, timeout);
  }

  bzpopmin(timeout: number, ...keys: string[]) {
    return this.execArrayReply('BZPOPMIN', ...keys, timeout) as Promise<[BulkString, BulkString, BulkString] | BulkNil>;
  }

  bzpopmax(timeout: number, ...keys: string[]) {
    return this.execArrayReply('BZPOPMAX', ...keys, timeout) as Promise<[BulkString, BulkString, BulkString] | BulkNil>;
  }

  clientCaching(mode: ClientCachingMode) {
    return this.execStatusReply('CLIENT', 'CACHING', mode);
  }

  clientGetName() {
    return this.execBulkReply('CLIENT', 'GETNAME');
  }

  clientGetRedir() {
    return this.execIntegerReply('CLIENT', 'GETREDIR');
  }

  clientID() {
    return this.execIntegerReply('CLIENT', 'ID');
  }

  clientInfo() {
    return this.execBulkReply('CLIENT', 'INFO');
  }

  clientKill(opts: ClientKillOpts) {
    const args: (string | number)[] = [];
    if (opts.addr) {
      args.push('ADDR', opts.addr);
    }
    if (opts.laddr) {
      args.push('LADDR', opts.laddr);
    }
    if (opts.id) {
      args.push('ID', opts.id);
    }
    if (opts.type) {
      args.push('TYPE', opts.type);
    }
    if (opts.user) {
      args.push('USER', opts.user);
    }
    if (opts.skipme) {
      args.push('SKIPME', opts.skipme);
    }
    return this.execIntegerReply('CLIENT', 'KILL', ...args);
  }

  clientList(opts?: ClientListOpts) {
    if (opts && opts.type && opts.ids) {
      throw new Error('only one of `type` or `ids` can be specified');
    }
    if (opts && opts.type) {
      return this.execBulkReply('CLIENT', 'LIST', 'TYPE', opts.type);
    }
    if (opts && opts.ids) {
      return this.execBulkReply('CLIENT', 'LIST', 'ID', ...opts.ids);
    }
    return this.execBulkReply('CLIENT', 'LIST');
  }

  clientPause(timeout: number, mode?: ClientPauseMode) {
    if (mode) {
      return this.execStatusReply('CLIENT', 'PAUSE', timeout, mode);
    }
    return this.execStatusReply('CLIENT', 'PAUSE', timeout);
  }

  clientSetName(connectionName: string) {
    return this.execStatusReply('CLIENT', 'SETNAME', connectionName);
  }

  clientTracking(opts: ClientTrackingOpts) {
    const args: (number | string)[] = [opts.mode];
    if (opts.redirect) {
      args.push('REDIRECT', opts.redirect);
    }
    if (opts.prefixes) {
      opts.prefixes.forEach((prefix) => {
        args.push('PREFIX');
        args.push(prefix);
      });
    }
    if (opts.bcast) {
      args.push('BCAST');
    }
    if (opts.optIn) {
      args.push('OPTIN');
    }
    if (opts.optOut) {
      args.push('OPTOUT');
    }
    if (opts.noLoop) {
      args.push('NOLOOP');
    }
    return this.execStatusReply('CLIENT', 'TRACKING', ...args);
  }

  clientTrackingInfo() {
    return this.execArrayReply('CLIENT', 'TRACKINGINFO');
  }

  clientUnblock(id: number, behaviour?: ClientUnblockingBehaviour): Promise<Integer> {
    if (behaviour) {
      return this.execIntegerReply('CLIENT', 'UNBLOCK', id, behaviour);
    }
    return this.execIntegerReply('CLIENT', 'UNBLOCK', id);
  }

  clientUnpause(): Promise<SimpleString> {
    return this.execStatusReply('CLIENT', 'UNPAUSE');
  }

  asking() {
    return this.execStatusReply('ASKING');
  }

  clusterAddSlots(...slots: number[]) {
    return this.execStatusReply('CLUSTER', 'ADDSLOTS', ...slots);
  }

  clusterCountFailureReports(nodeId: string) {
    return this.execIntegerReply('CLUSTER', 'COUNT-FAILURE-REPORTS', nodeId);
  }

  clusterCountKeysInSlot(slot: number) {
    return this.execIntegerReply('CLUSTER', 'COUNTKEYSINSLOT', slot);
  }

  clusterDelSlots(...slots: number[]) {
    return this.execStatusReply('CLUSTER', 'DELSLOTS', ...slots);
  }

  clusterFailover(mode?: ClusterFailoverMode) {
    if (mode) {
      return this.execStatusReply('CLUSTER', 'FAILOVER', mode);
    }
    return this.execStatusReply('CLUSTER', 'FAILOVER');
  }

  clusterFlushSlots() {
    return this.execStatusReply('CLUSTER', 'FLUSHSLOTS');
  }

  clusterForget(nodeId: string) {
    return this.execStatusReply('CLUSTER', 'FORGET', nodeId);
  }

  clusterGetKeysInSlot(slot: number, count: number) {
    return this.execArrayReply<BulkString>('CLUSTER', 'GETKEYSINSLOT', slot, count);
  }

  clusterInfo() {
    return this.execStatusReply('CLUSTER', 'INFO');
  }

  clusterKeySlot(key: string) {
    return this.execIntegerReply('CLUSTER', 'KEYSLOT', key);
  }

  clusterMeet(ip: string, port: number) {
    return this.execStatusReply('CLUSTER', 'MEET', ip, port);
  }

  clusterMyID() {
    return this.execStatusReply('CLUSTER', 'MYID');
  }

  clusterNodes() {
    return this.execBulkReply<BulkString>('CLUSTER', 'NODES');
  }

  clusterReplicas(nodeId: string) {
    return this.execArrayReply<BulkString>('CLUSTER', 'REPLICAS', nodeId);
  }

  clusterReplicate(nodeId: string) {
    return this.execStatusReply('CLUSTER', 'REPLICATE', nodeId);
  }

  clusterReset(mode?: ClusterResetMode) {
    if (mode) {
      return this.execStatusReply('CLUSTER', 'RESET', mode);
    }
    return this.execStatusReply('CLUSTER', 'RESET');
  }

  clusterSaveConfig() {
    return this.execStatusReply('CLUSTER', 'SAVECONFIG');
  }

  clusterSetSlot(slot: number, subcommand: ClusterSetSlotSubcommand, nodeId?: string) {
    if (nodeId !== undefined) {
      return this.execStatusReply('CLUSTER', 'SETSLOT', slot, subcommand, nodeId);
    }
    return this.execStatusReply('CLUSTER', 'SETSLOT', slot, subcommand);
  }

  clusterSlaves(nodeId: string) {
    return this.execArrayReply<BulkString>('CLUSTER', 'SLAVES', nodeId);
  }

  clusterSlots() {
    return this.execArrayReply('CLUSTER', 'SLOTS');
  }

  command() {
    return this.execArrayReply('COMMAND') as Promise<[BulkString, Integer, BulkString[], Integer, Integer, Integer][]>;
  }

  commandCount() {
    return this.execIntegerReply('COMMAND', 'COUNT');
  }

  commandGetKeys() {
    return this.execArrayReply<BulkString>('COMMAND', 'GETKEYS');
  }

  commandInfo(...commandNames: string[]) {
    return this.execArrayReply('COMMAND', 'INFO', ...commandNames) as Promise<
      ([BulkString, Integer, BulkString[], Integer, Integer, Integer] | BulkNil)[]
    >;
  }

  configGet(parameter: string) {
    return this.execArrayReply<BulkString>('CONFIG', 'GET', parameter);
  }

  configResetStat() {
    return this.execStatusReply('CONFIG', 'RESETSTAT');
  }

  configRewrite() {
    return this.execStatusReply('CONFIG', 'REWRITE');
  }

  configSet(parameter: string, value: string | number) {
    return this.execStatusReply('CONFIG', 'SET', parameter, value);
  }

  dbsize() {
    return this.execIntegerReply('DBSIZE');
  }

  debugObject(key: string) {
    return this.execStatusReply('DEBUG', 'OBJECT', key);
  }

  debugSegfault() {
    return this.execStatusReply('DEBUG', 'SEGFAULT');
  }

  decr(key: string) {
    return this.execIntegerReply('DECR', key);
  }

  decrby(key: string, decrement: number) {
    return this.execIntegerReply('DECRBY', key, decrement);
  }

  del(...keys: string[]) {
    return this.execIntegerReply('DEL', ...keys);
  }

  discard() {
    return this.execStatusReply('DISCARD');
  }

  dump(key: string) {
    return this.execBinaryReply('DUMP', key);
  }

  echo(message: RedisValue) {
    return this.execBulkReply<BulkString>('ECHO', message);
  }

  eval(script: string, keys: string[], args: string[]) {
    return this.execReply('EVAL', script, keys.length, ...keys, ...args);
  }

  evalsha(sha1: string, keys: string[], args: string[]) {
    return this.execReply('EVALSHA', sha1, keys.length, ...keys, ...args);
  }

  exec() {
    return this.execArrayReply('EXEC');
  }

  exists(...keys: string[]) {
    return this.execIntegerReply('EXISTS', ...keys);
  }

  expire(key: string, seconds: number) {
    return this.execIntegerReply('EXPIRE', key, seconds);
  }

  expireat(key: string, timestamp: string) {
    return this.execIntegerReply('EXPIREAT', key, timestamp);
  }

  flushall(async?: boolean) {
    if (async) {
      return this.execStatusReply('FLUSHALL', 'ASYNC');
    }
    return this.execStatusReply('FLUSHALL');
  }

  flushdb(async?: boolean) {
    if (async) {
      return this.execStatusReply('FLUSHDB', 'ASYNC');
    }
    return this.execStatusReply('FLUSHDB');
  }

  // deno-lint-ignore no-explicit-any
  geoadd(key: string, ...params: any[]) {
    const args: (string | number)[] = [key];
    if (Array.isArray(params[0])) {
      args.push(...params.flatMap((e) => e));
    } else if (typeof params[0] === 'object') {
      for (const [member, lnglat] of Object.entries(params[0])) {
        args.push(...(lnglat as [number, number]), member);
      }
    } else {
      args.push(...params);
    }
    return this.execIntegerReply('GEOADD', ...args);
  }

  geohash(key: string, ...members: string[]) {
    return this.execArrayReply<Bulk>('GEOHASH', key, ...members);
  }

  geopos(key: string, ...members: string[]) {
    return this.execArrayReply('GEOPOS', key, ...members) as Promise<([BulkString, BulkString] | BulkNil | [])[]>;
  }

  geodist(key: string, member1: string, member2: string, unit?: GeoUnit) {
    if (unit) {
      return this.execBulkReply('GEODIST', key, member1, member2, unit);
    }
    return this.execBulkReply('GEODIST', key, member1, member2);
  }

  georadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'm' | 'km' | 'ft' | 'mi',
    opts?: GeoRadiusOpts
  ) {
    const args = this.pushGeoRadiusOpts([key, longitude, latitude, radius, unit], opts);
    return this.execArrayReply('GEORADIUS', ...args);
  }

  georadiusbymember(key: string, member: string, radius: number, unit: GeoUnit, opts?: GeoRadiusOpts) {
    const args = this.pushGeoRadiusOpts([key, member, radius, unit], opts);
    return this.execArrayReply('GEORADIUSBYMEMBER', ...args);
  }

  private pushGeoRadiusOpts(args: (string | number)[], opts?: GeoRadiusOpts) {
    if (opts?.withCoord) {
      args.push('WITHCOORD');
    }
    if (opts?.withDist) {
      args.push('WITHDIST');
    }
    if (opts?.withHash) {
      args.push('WITHHASH');
    }
    if (opts?.count !== undefined) {
      args.push(opts.count);
    }
    if (opts?.sort) {
      args.push(opts.sort);
    }
    if (opts?.store !== undefined) {
      args.push(opts.store);
    }
    if (opts?.storeDist !== undefined) {
      args.push(opts.storeDist);
    }
    return args;
  }

  get(key: string) {
    return this.execBulkReply('GET', key);
  }

  getbit(key: string, offset: number) {
    return this.execIntegerReply('GETBIT', key, offset);
  }

  getrange(key: string, start: number, end: number) {
    return this.execBulkReply<BulkString>('GETRANGE', key, start, end);
  }

  getset(key: string, value: RedisValue) {
    return this.execBulkReply('GETSET', key, value);
  }

  hdel(key: string, ...fields: string[]) {
    return this.execIntegerReply('HDEL', key, ...fields);
  }

  hexists(key: string, field: string) {
    return this.execIntegerReply('HEXISTS', key, field);
  }

  hget(key: string, field: string) {
    return this.execBulkReply('HGET', key, field);
  }

  hgetall(key: string) {
    return this.execArrayReply<BulkString>('HGETALL', key);
  }

  hincrby(key: string, field: string, increment: number) {
    return this.execIntegerReply('HINCRBY', key, field, increment);
  }

  hincrbyfloat(key: string, field: string, increment: number) {
    return this.execBulkReply<BulkString>('HINCRBYFLOAT', key, field, increment);
  }

  hkeys(key: string) {
    return this.execArrayReply<BulkString>('HKEYS', key);
  }

  hlen(key: string) {
    return this.execIntegerReply('HLEN', key);
  }

  hmget(key: string, ...fields: string[]) {
    return this.execArrayReply<Bulk>('HMGET', key, ...fields);
  }

  // deno-lint-ignore no-explicit-any
  hmset(key: string, ...params: any[]) {
    const args = [key] as RedisValue[];
    if (Array.isArray(params[0])) {
      args.push(...params.flatMap((e) => e));
    } else if (typeof params[0] === 'object') {
      for (const [field, value] of Object.entries(params[0])) {
        args.push(field, value as RedisValue);
      }
    } else {
      args.push(...params);
    }
    return this.execStatusReply('HMSET', ...args);
  }

  // deno-lint-ignore no-explicit-any
  hset(key: string, ...params: any[]) {
    const args = [key] as RedisValue[];
    if (Array.isArray(params[0])) {
      args.push(...params.flatMap((e) => e));
    } else if (typeof params[0] === 'object') {
      for (const [field, value] of Object.entries(params[0])) {
        args.push(field, value as RedisValue);
      }
    } else {
      args.push(...params);
    }
    return this.execIntegerReply('HSET', ...args);
  }

  hsetnx(key: string, field: string, value: RedisValue) {
    return this.execIntegerReply('HSETNX', key, field, value);
  }

  hstrlen(key: string, field: string) {
    return this.execIntegerReply('HSTRLEN', key, field);
  }

  hvals(key: string) {
    return this.execArrayReply<BulkString>('HVALS', key);
  }

  incr(key: string) {
    return this.execIntegerReply('INCR', key);
  }

  incrby(key: string, increment: number) {
    return this.execIntegerReply('INCRBY', key, increment);
  }

  incrbyfloat(key: string, increment: number) {
    return this.execBulkReply<BulkString>('INCRBYFLOAT', key, increment);
  }

  info(section?: string) {
    if (section !== undefined) {
      return this.execStatusReply('INFO', section);
    }
    return this.execStatusReply('INFO');
  }

  keys(pattern: string) {
    return this.execArrayReply<BulkString>('KEYS', pattern);
  }

  lastsave() {
    return this.execIntegerReply('LASTSAVE');
  }

  lindex(key: string, index: number) {
    return this.execBulkReply('LINDEX', key, index);
  }

  linsert(key: string, loc: LInsertLocation, pivot: string, value: RedisValue) {
    return this.execIntegerReply('LINSERT', key, loc, pivot, value);
  }

  llen(key: string) {
    return this.execIntegerReply('LLEN', key);
  }

  lpop(key: string) {
    return this.execBulkReply('LPOP', key);
  }

  lpos(key: string, element: RedisValue, opts?: LPosOpts): Promise<Integer | BulkNil>;

  lpos(key: string, element: RedisValue, opts: LPosWithCountOpts): Promise<Integer[]>;

  lpos(key: string, element: RedisValue, opts?: LPosOpts | LPosWithCountOpts): Promise<Integer | BulkNil | Integer[]> {
    const args = [element];
    if (opts?.rank != null) {
      args.push('RANK', String(opts.rank));
    }

    if (opts?.count != null) {
      args.push('COUNT', String(opts.count));
    }

    if (opts?.maxlen != null) {
      args.push('MAXLEN', String(opts.maxlen));
    }

    return opts?.count == null
      ? this.execIntegerReply('LPOS', key, ...args)
      : this.execArrayReply<Integer>('LPOS', key, ...args);
  }

  lpush(key: string, ...elements: RedisValue[]) {
    return this.execIntegerReply('LPUSH', key, ...elements);
  }

  lpushx(key: string, ...elements: RedisValue[]) {
    return this.execIntegerReply('LPUSHX', key, ...elements);
  }

  lrange(key: string, start: number, stop: number) {
    return this.execArrayReply<BulkString>('LRANGE', key, start, stop);
  }

  lrem(key: string, count: number, element: string | number) {
    return this.execIntegerReply('LREM', key, count, element);
  }

  lset(key: string, index: number, element: string | number) {
    return this.execStatusReply('LSET', key, index, element);
  }

  ltrim(key: string, start: number, stop: number) {
    return this.execStatusReply('LTRIM', key, start, stop);
  }

  memoryDoctor() {
    return this.execBulkReply<BulkString>('MEMORY', 'DOCTOR');
  }

  memoryHelp() {
    return this.execArrayReply<BulkString>('MEMORY', 'HELP');
  }

  memoryMallocStats() {
    return this.execBulkReply<BulkString>('MEMORY', 'MALLOC', 'STATS');
  }

  memoryPurge() {
    return this.execStatusReply('MEMORY', 'PURGE');
  }

  memoryStats() {
    return this.execArrayReply('MEMORY', 'STATS');
  }

  memoryUsage(key: string, opts?: MemoryUsageOpts) {
    const args: (number | string)[] = [key];
    if (opts?.samples !== undefined) {
      args.push('SAMPLES', opts.samples);
    }
    return this.execIntegerReply('MEMORY', 'USAGE', ...args);
  }

  mget(...keys: string[]) {
    return this.execArrayReply<Bulk>('MGET', ...keys);
  }

  migrate(host: string, port: number, key: string, destinationDB: string, timeout: number, opts?: MigrateOpts) {
    const args = [host, port, key, destinationDB, timeout];
    if (opts?.copy) {
      args.push('COPY');
    }
    if (opts?.replace) {
      args.push('REPLACE');
    }
    if (opts?.auth !== undefined) {
      args.push('AUTH', opts.auth);
    }
    if (opts?.keys) {
      args.push('KEYS', ...opts.keys);
    }
    return this.execStatusReply('MIGRATE', ...args);
  }

  moduleList() {
    return this.execArrayReply<BulkString>('MODULE', 'LIST');
  }

  moduleLoad(path: string, ...args: string[]) {
    return this.execStatusReply('MODULE', 'LOAD', path, ...args);
  }

  moduleUnload(name: string) {
    return this.execStatusReply('MODULE', 'UNLOAD', name);
  }

  monitor() {
    throw new Error('not supported yet');
  }

  move(key: string, db: string) {
    return this.execIntegerReply('MOVE', key, db);
  }

  // deno-lint-ignore no-explicit-any
  mset(...params: any[]) {
    const args: RedisValue[] = [];
    if (Array.isArray(params[0])) {
      args.push(...params.flatMap((e) => e));
    } else if (typeof params[0] === 'object') {
      for (const [key, value] of Object.entries(params[0])) {
        args.push(key, value as RedisValue);
      }
    } else {
      args.push(...params);
    }
    return this.execStatusReply('MSET', ...args);
  }

  // deno-lint-ignore no-explicit-any
  msetnx(...params: any[]) {
    const args: RedisValue[] = [];
    if (Array.isArray(params[0])) {
      args.push(...params.flatMap((e) => e));
    } else if (typeof params[0] === 'object') {
      for (const [key, value] of Object.entries(params[0])) {
        args.push(key, value as RedisValue);
      }
    } else {
      args.push(...params);
    }
    return this.execIntegerReply('MSETNX', ...args);
  }

  multi() {
    return this.execStatusReply('MULTI');
  }

  objectEncoding(key: string) {
    return this.execBulkReply('OBJECT', 'ENCODING', key);
  }

  objectFreq(key: string) {
    return this.execIntegerOrNilReply('OBJECT', 'FREQ', key);
  }

  objectHelp() {
    return this.execArrayReply<BulkString>('OBJECT', 'HELP');
  }

  objectIdletime(key: string) {
    return this.execIntegerOrNilReply('OBJECT', 'IDLETIME', key);
  }

  objectRefCount(key: string) {
    return this.execIntegerOrNilReply('OBJECT', 'REFCOUNT', key);
  }

  persist(key: string) {
    return this.execIntegerReply('PERSIST', key);
  }

  pexpire(key: string, milliseconds: number) {
    return this.execIntegerReply('PEXPIRE', key, milliseconds);
  }

  pexpireat(key: string, millisecondsTimestamp: number) {
    return this.execIntegerReply('PEXPIREAT', key, millisecondsTimestamp);
  }

  pfadd(key: string, ...elements: string[]) {
    return this.execIntegerReply('PFADD', key, ...elements);
  }

  pfcount(...keys: string[]) {
    return this.execIntegerReply('PFCOUNT', ...keys);
  }

  pfmerge(destkey: string, ...sourcekeys: string[]) {
    return this.execStatusReply('PFMERGE', destkey, ...sourcekeys);
  }

  ping(message?: RedisValue) {
    if (message) {
      return this.execBulkReply<BulkString>('PING', message);
    }
    return this.execStatusReply('PING');
  }

  psetex(key: string, milliseconds: number, value: RedisValue) {
    return this.execStatusReply('PSETEX', key, milliseconds, value);
  }

  publish(channel: string, message: string) {
    return this.execIntegerReply('PUBLISH', channel, message);
  }

  pubsubChannels(pattern?: string) {
    if (pattern !== undefined) {
      return this.execArrayReply<BulkString>('PUBSUB', 'CHANNELS', pattern);
    }
    return this.execArrayReply<BulkString>('PUBSUB', 'CHANNELS');
  }

  pubsubNumpat() {
    return this.execIntegerReply('PUBSUB', 'NUMPAT');
  }

  pubsubNumsub(...channels: string[]) {
    return this.execArrayReply<BulkString | Integer>('PUBSUB', 'NUMSUB', ...channels);
  }

  pttl(key: string) {
    return this.execIntegerReply('PTTL', key);
  }

  randomkey() {
    return this.execBulkReply('RANDOMKEY');
  }

  readonly() {
    return this.execStatusReply('READONLY');
  }

  readwrite() {
    return this.execStatusReply('READWRITE');
  }

  rename(key: string, newkey: string) {
    return this.execStatusReply('RENAME', key, newkey);
  }

  renamenx(key: string, newkey: string) {
    return this.execIntegerReply('RENAMENX', key, newkey);
  }

  restore(key: string, ttl: number, serializedValue: Binary, opts?: RestoreOpts) {
    const args = [key, ttl, serializedValue];
    if (opts?.replace) {
      args.push('REPLACE');
    }
    if (opts?.absttl) {
      args.push('ABSTTL');
    }
    if (opts?.idletime !== undefined) {
      args.push('IDLETIME', opts.idletime);
    }
    if (opts?.freq !== undefined) {
      args.push('FREQ', opts.freq);
    }
    return this.execStatusReply('RESTORE', ...args);
  }

  role() {
    return this.execArrayReply('ROLE') as Promise<
      | ['master', Integer, BulkString[][]]
      | ['slave', BulkString, Integer, BulkString, Integer]
      | ['sentinel', BulkString[]]
    >;
  }

  rpop(key: string) {
    return this.execBulkReply('RPOP', key);
  }

  rpoplpush(source: string, destination: string) {
    return this.execBulkReply('RPOPLPUSH', source, destination);
  }

  rpush(key: string, ...elements: RedisValue[]) {
    return this.execIntegerReply('RPUSH', key, ...elements);
  }

  rpushx(key: string, ...elements: RedisValue[]) {
    return this.execIntegerReply('RPUSHX', key, ...elements);
  }

  sadd(key: string, ...members: string[]) {
    return this.execIntegerReply('SADD', key, ...members);
  }

  save() {
    return this.execStatusReply('SAVE');
  }

  scard(key: string) {
    return this.execIntegerReply('SCARD', key);
  }

  scriptDebug(mode: ScriptDebugMode) {
    return this.execStatusReply('SCRIPT', 'DEBUG', mode);
  }

  scriptExists(...sha1s: string[]) {
    return this.execArrayReply<Integer>('SCRIPT', 'EXISTS', ...sha1s);
  }

  scriptFlush() {
    return this.execStatusReply('SCRIPT', 'FLUSH');
  }

  scriptKill() {
    return this.execStatusReply('SCRIPT', 'KILL');
  }

  scriptLoad(script: string) {
    return this.execStatusReply('SCRIPT', 'LOAD', script);
  }

  sdiff(...keys: string[]) {
    return this.execArrayReply<BulkString>('SDIFF', ...keys);
  }

  sdiffstore(destination: string, ...keys: string[]) {
    return this.execIntegerReply('SDIFFSTORE', destination, ...keys);
  }

  select(index: number) {
    return this.execStatusReply('SELECT', index);
  }

  set(key: string, value: RedisValue, opts?: SetOpts): Promise<SimpleString>;
  set(key: string, value: RedisValue, opts?: SetWithModeOpts): Promise<SimpleString | BulkNil>;
  set(key: string, value: RedisValue, opts?: SetOpts | SetWithModeOpts) {
    const args: RedisValue[] = [key, value];
    if (opts?.ex !== undefined) {
      args.push('EX', opts.ex);
    } else if (opts?.px !== undefined) {
      args.push('PX', opts.px);
    }
    if (opts?.keepttl) {
      args.push('KEEPTTL');
    }
    if ((opts as SetWithModeOpts)?.mode) {
      args.push((opts as SetWithModeOpts).mode);
      return this.execStatusOrNilReply('SET', ...args);
    }
    return this.execStatusReply('SET', ...args);
  }

  setbit(key: string, offset: number, value: RedisValue) {
    return this.execIntegerReply('SETBIT', key, offset, value);
  }

  setex(key: string, seconds: number, value: RedisValue) {
    return this.execStatusReply('SETEX', key, seconds, value);
  }

  setnx(key: string, value: RedisValue) {
    return this.execIntegerReply('SETNX', key, value);
  }

  setrange(key: string, offset: number, value: RedisValue) {
    return this.execIntegerReply('SETRANGE', key, offset, value);
  }

  shutdown(mode?: ShutdownMode) {
    if (mode) {
      return this.execStatusReply('SHUTDOWN', mode);
    }
    return this.execStatusReply('SHUTDOWN');
  }

  sinter(...keys: string[]) {
    return this.execArrayReply<BulkString>('SINTER', ...keys);
  }

  sinterstore(destination: string, ...keys: string[]) {
    return this.execIntegerReply('SINTERSTORE', destination, ...keys);
  }

  sismember(key: string, member: string) {
    return this.execIntegerReply('SISMEMBER', key, member);
  }

  slaveof(host: string, port: number) {
    return this.execStatusReply('SLAVEOF', host, port);
  }

  slaveofNoOne() {
    return this.execStatusReply('SLAVEOF', 'NO ONE');
  }

  replicaof(host: string, port: number) {
    return this.execStatusReply('REPLICAOF', host, port);
  }

  replicaofNoOne() {
    return this.execStatusReply('REPLICAOF', 'NO ONE');
  }

  slowlog(subcommand: string, ...args: string[]) {
    return this.execArrayReply('SLOWLOG', subcommand, ...args);
  }

  smembers(key: string) {
    return this.execArrayReply<BulkString>('SMEMBERS', key);
  }

  smove(source: string, destination: string, member: string) {
    return this.execIntegerReply('SMOVE', source, destination, member);
  }

  sort(key: string, opts?: SortOpts): Promise<BulkString[]>;
  sort(key: string, opts?: SortWithDestinationOpts): Promise<Integer>;
  sort(key: string, opts?: SortOpts | SortWithDestinationOpts) {
    const args: (number | string)[] = [key];
    if (opts?.by !== undefined) {
      args.push('BY', opts.by);
    }
    if (opts?.limit) {
      args.push('LIMIT', opts.limit.offset, opts.limit.count);
    }
    if (opts?.patterns) {
      args.push('GET', ...opts.patterns);
    }
    if (opts?.order) {
      args.push(opts.order);
    }
    if (opts?.alpha) {
      args.push('ALPHA');
    }
    if ((opts as SortWithDestinationOpts)?.destination !== undefined) {
      args.push('STORE', (opts as SortWithDestinationOpts).destination);
      return this.execIntegerReply('SORT', ...args);
    }
    return this.execArrayReply<BulkString>('SORT', ...args);
  }

  spop(key: string): Promise<Bulk>;
  spop(key: string, count: number): Promise<BulkString[]>;
  spop(key: string, count?: number) {
    if (count !== undefined) {
      return this.execArrayReply<BulkString>('SPOP', key, count);
    }
    return this.execBulkReply('SPOP', key);
  }

  srandmember(key: string): Promise<Bulk>;
  srandmember(key: string, count: number): Promise<BulkString[]>;
  srandmember(key: string, count?: number) {
    if (count !== undefined) {
      return this.execArrayReply<BulkString>('SRANDMEMBER', key, count);
    }
    return this.execBulkReply('SRANDMEMBER', key);
  }

  srem(key: string, ...members: string[]) {
    return this.execIntegerReply('SREM', key, ...members);
  }

  stralgo(algorithm: StralgoAlgorithm, target: StralgoTarget, a: string, b: string): Promise<Bulk>;

  stralgo(
    algorithm: StralgoAlgorithm,
    target: StralgoTarget,
    a: string,
    b: string,
    opts?: { len: true }
  ): Promise<Integer>;

  stralgo(
    algorithm: StralgoAlgorithm,
    target: StralgoTarget,
    a: string,
    b: string,
    opts?: { idx: true }
  ): Promise<
    [
      string, //`"matches"`
      Array<[[number, number], [number, number]]>,
      string, // `"len"`
      Integer
    ]
  >;

  stralgo(
    algorithm: StralgoAlgorithm,
    target: StralgoTarget,
    a: string,
    b: string,
    opts?: { idx: true; withmatchlen: true }
  ): Promise<
    [
      string, // `"matches"`
      Array<[[number, number], [number, number], number]>,
      string, // `"len"`
      Integer
    ]
  >;

  stralgo(algorithm: StralgoAlgorithm, target: StralgoTarget, a: string, b: string, opts?: StralgoOpts) {
    const args: (number | string)[] = [];
    if (opts?.idx) {
      args.push('IDX');
    }
    if (opts?.len) {
      args.push('LEN');
    }
    if (opts?.withmatchlen) {
      args.push('WITHMATCHLEN');
    }
    if (opts?.minmatchlen) {
      args.push('MINMATCHLEN');
      args.push(opts.minmatchlen);
    }
    return this.execReply<Bulk | Integer | ConditionalArray>('STRALGO', algorithm, target, a, b, ...args);
  }

  strlen(key: string) {
    return this.execIntegerReply('STRLEN', key);
  }

  sunion(...keys: string[]) {
    return this.execArrayReply<BulkString>('SUNION', ...keys);
  }

  sunionstore(destination: string, ...keys: string[]) {
    return this.execIntegerReply('SUNIONSTORE', destination, ...keys);
  }

  swapdb(index1: number, index2: number) {
    return this.execStatusReply('SWAPDB', index1, index2);
  }

  sync() {
    throw new Error('not implemented');
  }

  time() {
    return this.execArrayReply('TIME') as Promise<[BulkString, BulkString]>;
  }

  touch(...keys: string[]) {
    return this.execIntegerReply('TOUCH', ...keys);
  }

  ttl(key: string) {
    return this.execIntegerReply('TTL', key);
  }

  type(key: string) {
    return this.execStatusReply('TYPE', key);
  }

  unlink(...keys: string[]) {
    return this.execIntegerReply('UNLINK', ...keys);
  }

  unwatch() {
    return this.execStatusReply('UNWATCH');
  }

  wait(numreplicas: number, timeout: number) {
    return this.execIntegerReply('WAIT', numreplicas, timeout);
  }

  watch(...keys: string[]) {
    return this.execStatusReply('WATCH', ...keys);
  }

  zadd(key: string, score: number, member: string, opts?: ZAddOpts): Promise<Integer>;
  zadd(key: string, scoreMembers: [number, string][], opts?: ZAddOpts): Promise<Integer>;
  zadd(key: string, memberScores: Record<string, number>, opts?: ZAddOpts): Promise<Integer>;
  zadd(
    key: string,
    param1: number | [number, string][] | Record<string, number>,
    param2?: string | ZAddOpts,
    opts?: ZAddOpts
  ) {
    const args: (string | number)[] = [key];
    if (Array.isArray(param1)) {
      this.pushZAddOpts(args, param2 as ZAddOpts);
      args.push(...param1.flatMap((e) => e));
      opts = param2 as ZAddOpts;
    } else if (typeof param1 === 'object') {
      this.pushZAddOpts(args, param2 as ZAddOpts);
      for (const [member, score] of Object.entries(param1)) {
        args.push(score as number, member);
      }
    } else {
      this.pushZAddOpts(args, opts);
      args.push(param1, param2 as string);
    }
    return this.execIntegerReply('ZADD', ...args);
  }

  private pushZAddOpts(args: (string | number)[], opts?: ZAddOpts): void {
    if (opts?.mode) {
      args.push(opts.mode);
    }
    if (opts?.ch) {
      args.push('CH');
    }
  }

  zaddIncr(key: string, score: number, member: string, opts?: ZAddOpts) {
    const args: (string | number)[] = [key];
    this.pushZAddOpts(args, opts);
    args.push('INCR', score, member);
    return this.execBulkReply('ZADD', ...args);
  }

  zcard(key: string) {
    return this.execIntegerReply('ZCARD', key);
  }

  zcount(key: string, min: number, max: number) {
    return this.execIntegerReply('ZCOUNT', key, min, max);
  }

  zincrby(key: string, increment: number, member: string) {
    return this.execBulkReply<BulkString>('ZINCRBY', key, increment, member);
  }

  zinter(keys: string[] | [string, number][] | Record<string, number>, opts?: ZInterOpts) {
    const args = this.pushZStoreArgs([], keys, opts);
    if (opts?.withScore) {
      args.push('WITHSCORES');
    }
    return this.execArrayReply('ZINTER', ...args);
  }

  zinterstore(
    destination: string,
    keys: string[] | [string, number][] | Record<string, number>,
    opts?: ZInterstoreOpts
  ) {
    const args = this.pushZStoreArgs([destination], keys, opts);
    return this.execIntegerReply('ZINTERSTORE', ...args);
  }

  zunionstore(
    destination: string,
    keys: string[] | [string, number][] | Record<string, number>,
    opts?: ZUnionstoreOpts
  ) {
    const args = this.pushZStoreArgs([destination], keys, opts);
    return this.execIntegerReply('ZUNIONSTORE', ...args);
  }

  private pushZStoreArgs(
    args: (number | string)[],
    keys: string[] | [string, number][] | Record<string, number>,
    opts?: ZInterstoreOpts | ZUnionstoreOpts
  ) {
    if (Array.isArray(keys)) {
      args.push(keys.length);
      if (Array.isArray(keys[0])) {
        keys = keys as [string, number][];
        args.push(...keys.map((e) => e[0]));
        args.push('WEIGHTS');
        args.push(...keys.map((e) => e[1]));
      } else {
        args.push(...(keys as string[]));
      }
    } else {
      args.push(Object.keys(keys).length);
      args.push(...Object.keys(keys));
      args.push('WEIGHTS');
      args.push(...Object.values(keys));
    }
    if (opts?.aggregate) {
      args.push('AGGREGATE', opts.aggregate);
    }
    return args;
  }

  zlexcount(key: string, min: string, max: string) {
    return this.execIntegerReply('ZLEXCOUNT', key, min, max);
  }

  zpopmax(key: string, count?: number) {
    if (count !== undefined) {
      return this.execArrayReply<BulkString>('ZPOPMAX', key, count);
    }
    return this.execArrayReply<BulkString>('ZPOPMAX', key);
  }

  zpopmin(key: string, count?: number) {
    if (count !== undefined) {
      return this.execArrayReply<BulkString>('ZPOPMIN', key, count);
    }
    return this.execArrayReply<BulkString>('ZPOPMIN', key);
  }

  zrange(key: string, start: number, stop: number, opts?: ZRangeOpts) {
    const args = this.pushZRangeOpts([key, start, stop], opts);
    return this.execArrayReply<BulkString>('ZRANGE', ...args);
  }

  zrangebylex(key: string, min: string, max: string, opts?: ZRangeByLexOpts) {
    const args = this.pushZRangeOpts([key, min, max], opts);
    return this.execArrayReply<BulkString>('ZRANGEBYLEX', ...args);
  }

  zrangebyscore(key: string, min: number | string, max: number | string, opts?: ZRangeByScoreOpts) {
    const args = this.pushZRangeOpts([key, min, max], opts);
    return this.execArrayReply<BulkString>('ZRANGEBYSCORE', ...args);
  }

  zrank(key: string, member: string) {
    return this.execIntegerOrNilReply('ZRANK', key, member);
  }

  zrem(key: string, ...members: string[]) {
    return this.execIntegerReply('ZREM', key, ...members);
  }

  zremrangebylex(key: string, min: string, max: string) {
    return this.execIntegerReply('ZREMRANGEBYLEX', key, min, max);
  }

  zremrangebyrank(key: string, start: number, stop: number) {
    return this.execIntegerReply('ZREMRANGEBYRANK', key, start, stop);
  }

  zremrangebyscore(key: string, min: number | string, max: number | string) {
    return this.execIntegerReply('ZREMRANGEBYSCORE', key, min, max);
  }

  zrevrange(key: string, start: number, stop: number, opts?: ZRangeOpts) {
    const args = this.pushZRangeOpts([key, start, stop], opts);
    return this.execArrayReply<BulkString>('ZREVRANGE', ...args);
  }

  zrevrangebylex(key: string, max: string, min: string, opts?: ZRangeByLexOpts) {
    const args = this.pushZRangeOpts([key, min, max], opts);
    return this.execArrayReply<BulkString>('ZREVRANGEBYLEX', ...args);
  }

  zrevrangebyscore(key: string, max: number, min: number, opts?: ZRangeByScoreOpts) {
    const args = this.pushZRangeOpts([key, max, min], opts);
    return this.execArrayReply<BulkString>('ZREVRANGEBYSCORE', ...args);
  }

  private pushZRangeOpts(args: (number | string)[], opts?: ZRangeOpts | ZRangeByLexOpts | ZRangeByScoreOpts) {
    if ((opts as ZRangeByScoreOpts)?.withScore) {
      args.push('WITHSCORES');
    }
    if ((opts as ZRangeByScoreOpts)?.limit) {
      args.push('LIMIT', (opts as ZRangeByScoreOpts).limit!.offset, (opts as ZRangeByScoreOpts).limit!.count);
    }
    return args;
  }

  zrevrank(key: string, member: string) {
    return this.execIntegerOrNilReply('ZREVRANK', key, member);
  }

  zscore(key: string, member: string) {
    return this.execBulkReply('ZSCORE', key, member);
  }

  scan(cursor: number, opts?: ScanOpts) {
    const args = this.pushScanOpts([cursor], opts);
    return this.execArrayReply('SCAN', ...args) as Promise<[BulkString, BulkString[]]>;
  }

  sscan(key: string, cursor: number, opts?: SScanOpts) {
    const args = this.pushScanOpts([key, cursor], opts);
    return this.execArrayReply('SSCAN', ...args) as Promise<[BulkString, BulkString[]]>;
  }

  hscan(key: string, cursor: number, opts?: HScanOpts) {
    const args = this.pushScanOpts([key, cursor], opts);
    return this.execArrayReply('HSCAN', ...args) as Promise<[BulkString, BulkString[]]>;
  }

  zscan(key: string, cursor: number, opts?: ZScanOpts) {
    const args = this.pushScanOpts([key, cursor], opts);
    return this.execArrayReply('ZSCAN', ...args) as Promise<[BulkString, BulkString[]]>;
  }

  private pushScanOpts(args: (number | string)[], opts?: ScanOpts | HScanOpts | ZScanOpts | SScanOpts) {
    if (opts?.pattern !== undefined) {
      args.push('MATCH', opts.pattern);
    }
    if (opts?.count !== undefined) {
      args.push('COUNT', opts.count);
    }
    if ((opts as ScanOpts)?.type !== undefined) {
      args.push('TYPE', (opts as ScanOpts).type!);
    }
    return args;
  }

  tx() {
    throw new Error('Not implemented');
  }

  pipeline() {
    throw new Error('Not implemented');
  }
}
