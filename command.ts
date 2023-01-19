import type {
  Binary,
  Bulk,
  BulkNil,
  BulkString,
  ConditionalArray,
  Integer,
  Raw,
  RedisValue,
  SimpleString
} from './protocol/types.ts';

export type ACLLogMode = 'RESET';
type BitopOperation = 'AND' | 'OR' | 'XOR' | 'NOT';

export interface BitfieldOpts {
  get?: { type: string; offset: number | string };
  set?: { type: string; offset: number | string; value: number };
  incrby?: { type: string; offset: number | string; increment: number };
}

export interface BitfieldWithOverflowOpts extends BitfieldOpts {
  overflow: 'WRAP' | 'SAT' | 'FAIL';
}

export type ClientCachingMode = 'YES' | 'NO';

export interface ClientKillOpts {
  addr?: string; // ip:port
  laddr?: string; // ip:port
  id?: number;
  type?: ClientType;
  user?: string;
  skipme?: 'YES' | 'NO';
}

export interface ClientListOpts {
  type?: ClientType;
  ids?: number[];
}

export type ClientPauseMode = 'WRITE' | 'ALL';

export interface ClientTrackingOpts {
  mode: 'ON' | 'OFF';
  redirect?: number;
  prefixes?: string[];
  bcast?: boolean;
  optIn?: boolean;
  optOut?: boolean;
  noLoop?: boolean;
}

export type ClientType = 'NORMAL' | 'MASTER' | 'REPLICA' | 'PUBSUB';
export type ClientUnblockingBehaviour = 'TIMEOUT' | 'ERROR';

export type ClusterFailoverMode = 'FORCE' | 'TAKEOVER';
export type ClusterResetMode = 'HARD' | 'SOFT';
export type ClusterSetSlotSubcommand = 'IMPORTING' | 'MIGRATING' | 'NODE' | 'STABLE';

export interface MigrateOpts {
  copy?: boolean;
  replace?: boolean;
  auth?: string;
  keys?: string[];
}

export interface RestoreOpts {
  replace?: boolean;
  absttl?: boolean;
  idletime?: number;
  freq?: number;
}

export interface StralgoOpts {
  idx?: boolean;
  len?: boolean;
  minmatchlen?: number;
  withmatchlen?: boolean;
}

export type StralgoAlgorithm = 'LCS';
export type StralgoTarget = 'KEYS' | 'STRINGS';

export interface SetOpts {
  ex?: number;
  px?: number;
  keepttl?: boolean;
}

export interface SetWithModeOpts extends SetOpts {
  mode: 'NX' | 'XX';
}

export interface GeoRadiusOpts {
  withCoord?: boolean;
  withDist?: boolean;
  withHash?: boolean;
  count?: number;
  sort?: 'ASC' | 'DESC';
  store?: string;
  storeDist?: string;
}

export type GeoUnit = 'm' | 'km' | 'ft' | 'mi';

export interface BaseScanOpts {
  pattern?: string;
  count?: number;
}

export interface ScanOpts extends BaseScanOpts {
  type?: string;
}

export type HScanOpts = BaseScanOpts;
export type SScanOpts = BaseScanOpts;
export type ZScanOpts = BaseScanOpts;

export interface ZAddOpts {
  mode?: 'NX' | 'XX';
  ch?: boolean;
}

export interface ZStoreOpts {
  aggregate?: 'SUM' | 'MIN' | 'MAX';
}

export type ZInterstoreOpts = ZStoreOpts;
export type ZUnionstoreOpts = ZStoreOpts;

export interface ZRangeOpts {
  withScore?: boolean;
}

export type ZInterOpts = {
  withScore?: boolean;
} & ZStoreOpts;

export interface ZRangeByLexOpts {
  limit?: { offset: number; count: number };
}

export interface ZRangeByScoreOpts {
  withScore?: boolean;
  limit?: { offset: number; count: number };
}

interface BaseLPosOpts {
  rank?: number;
  maxlen?: number;
}

export interface LPosOpts extends BaseLPosOpts {
  count?: null | undefined;
}

export interface LPosWithCountOpts extends BaseLPosOpts {
  count: number;
}

export type LInsertLocation = 'BEFORE' | 'AFTER';

export interface MemoryUsageOpts {
  samples?: number;
}

type RoleReply =
  | ['master', Integer, BulkString[][]]
  | ['slave', BulkString, Integer, BulkString, Integer]
  | ['sentinel', BulkString[]];

export type ScriptDebugMode = 'YES' | 'SYNC' | 'NO';

export interface SortOpts {
  by?: string;
  limit?: { offset: number; count: number };
  patterns?: string[];
  order?: 'ASC' | 'DESC';
  alpha?: boolean;
}

export interface SortWithDestinationOpts extends SortOpts {
  destination: string;
}

export type ShutdownMode = 'NOSAVE' | 'SAVE';

/**
 * Removed Connection, PubSub, Stream, Scripting, Transactions, Client, Cluster and Pipeline interfaces
 */
export interface RedisCommands {
  // Keys
  del(...keys: string[]): Promise<Integer>;
  dump(key: string): Promise<Binary | BulkNil>;
  exists(...keys: string[]): Promise<Integer>;
  expire(key: string, seconds: number): Promise<Integer>;
  expireat(key: string, timestamp: string): Promise<Integer>;
  keys(pattern: string): Promise<BulkString[]>;
  migrate(
    host: string,
    port: number | string,
    key: string,
    destination_db: string,
    timeout: number,
    opts?: MigrateOpts
  ): Promise<SimpleString>;
  move(key: string, db: string): Promise<Integer>;
  objectRefCount(key: string): Promise<Integer | BulkNil>;
  objectEncoding(key: string): Promise<Bulk>;
  objectIdletime(key: string): Promise<Integer | BulkNil>;
  objectFreq(key: string): Promise<Integer | BulkNil>;
  objectHelp(): Promise<BulkString[]>;
  persist(key: string): Promise<Integer>;
  pexpire(key: string, milliseconds: number): Promise<Integer>;
  pexpireat(key: string, milliseconds_timestamp: number): Promise<Integer>;
  pttl(key: string): Promise<Integer>;
  randomkey(): Promise<Bulk>;
  rename(key: string, newkey: string): Promise<SimpleString>;
  renamenx(key: string, newkey: string): Promise<Integer>;
  restore(key: string, ttl: number, serialized_value: Binary, opts?: RestoreOpts): Promise<SimpleString>;
  scan(cursor: number, opts?: ScanOpts): Promise<[BulkString, BulkString[]]>;
  sort(key: string, opts?: SortOpts): Promise<BulkString[]>;
  sort(key: string, opts?: SortWithDestinationOpts): Promise<Integer>;
  touch(...keys: string[]): Promise<Integer>;
  ttl(key: string): Promise<Integer>;
  type(key: string): Promise<SimpleString>;
  unlink(...keys: string[]): Promise<Integer>;
  wait(numreplicas: number, timeout: number): Promise<Integer>;

  // String
  append(key: string, value: RedisValue): Promise<Integer>;
  bitcount(key: string): Promise<Integer>;
  bitcount(key: string, start: number, end: number): Promise<Integer>;
  bitfield(key: string, opts?: BitfieldOpts): Promise<Integer[]>;
  bitfield(key: string, opts?: BitfieldWithOverflowOpts): Promise<(Integer | BulkNil)[]>;
  bitop(operation: BitopOperation, destkey: string, ...keys: string[]): Promise<Integer>;
  bitpos(key: string, bit: number, start?: number, end?: number): Promise<Integer>;
  decr(key: string): Promise<Integer>;
  decrby(key: string, decrement: number): Promise<Integer>;
  get(key: string): Promise<Bulk>;
  getbit(key: string, offset: number): Promise<Integer>;
  getrange(key: string, start: number, end: number): Promise<BulkString>;
  getset(key: string, value: RedisValue): Promise<Bulk>;
  incr(key: string): Promise<Integer>;
  incrby(key: string, increment: number): Promise<Integer>;
  incrbyfloat(key: string, increment: number): Promise<BulkString>;
  mget(...keys: string[]): Promise<Bulk[]>;
  mset(key: string, value: RedisValue): Promise<SimpleString>;
  mset(...key_values: [string, RedisValue][]): Promise<SimpleString>;
  mset(key_values: Record<string, RedisValue>): Promise<SimpleString>;
  msetnx(key: string, value: RedisValue): Promise<Integer>;
  msetnx(...key_values: [string, RedisValue][]): Promise<Integer>;
  msetnx(key_values: Record<string, RedisValue>): Promise<Integer>;
  psetex(key: string, milliseconds: number, value: RedisValue): Promise<SimpleString>;
  set(key: string, value: RedisValue, opts?: SetOpts): Promise<SimpleString>;
  set(key: string, value: RedisValue, opts?: SetWithModeOpts): Promise<SimpleString | BulkNil>;
  setbit(key: string, offset: number, value: RedisValue): Promise<Integer>;
  setex(key: string, seconds: number, value: RedisValue): Promise<SimpleString>;
  setnx(key: string, value: RedisValue): Promise<Integer>;
  setrange(key: string, offset: number, value: RedisValue): Promise<Integer>;

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

  stralgo(
    algorithm: StralgoAlgorithm,
    target: StralgoTarget,
    a: string,
    b: string,
    opts?: StralgoOpts
  ): Promise<
    | Bulk
    | Integer
    | [
        string, // `"matches"`
        Array<[[number, number], [number, number], number | undefined]>,
        string, // `"len"`
        Integer
      ]
  >;

  strlen(key: string): Promise<Integer>;

  // Geo
  geoadd(key: string, longitude: number, latitude: number, member: string): Promise<Integer>;
  geoadd(key: string, ...lng_lat_members: [number, number, string][]): Promise<Integer>;
  geoadd(key: string, member_lng_lats: Record<string, [number, number]>): Promise<Integer>;
  geohash(key: string, ...members: string[]): Promise<Bulk[]>;
  geopos(key: string, ...members: string[]): Promise<Array<[BulkString, BulkString] | BulkNil | []> | BulkNil>;
  geodist(key: string, member1: string, member2: string, unit?: 'm' | 'km' | 'ft' | 'mi'): Promise<Bulk>;
  // FIXME: Return type is too conditional
  georadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: GeoUnit,
    opts?: GeoRadiusOpts
  ): Promise<ConditionalArray>;
  // FIXME: Return type is too conditional
  georadiusbymember(
    key: string,
    member: string,
    radius: number,
    unit: GeoUnit,
    opts?: GeoRadiusOpts
  ): Promise<ConditionalArray>;

  // Hash
  hdel(key: string, ...fields: string[]): Promise<Integer>;
  hexists(key: string, field: string): Promise<Integer>;
  hget(key: string, field: string): Promise<Bulk>;
  hgetall(key: string): Promise<BulkString[]>;
  hincrby(key: string, field: string, increment: number): Promise<Integer>;
  hincrbyfloat(key: string, field: string, increment: number): Promise<BulkString>;
  hkeys(key: string): Promise<BulkString[]>;
  hlen(key: string): Promise<Integer>;
  hmget(key: string, ...fields: string[]): Promise<Bulk[]>;
  /**
   * @deprecated since 4.0.0, use hset
   */
  hmset(key: string, field: string, value: RedisValue): Promise<SimpleString>;
  /**
   * @deprecated since 4.0.0, use hset
   */
  hmset(key: string, ...field_values: [string, RedisValue][]): Promise<SimpleString>;
  /**
   * @deprecated since 4.0.0, use hset
   */
  hmset(key: string, field_values: Record<string, RedisValue>): Promise<SimpleString>;
  hscan(key: string, cursor: number, opts?: HScanOpts): Promise<[BulkString, BulkString[]]>;

  /**
   * @description Sets `field` in the hash to `value`.
   * @see https://redis.io/commands/hset
   */
  hset(key: string, field: string, value: RedisValue): Promise<Integer>;

  /**
   * @description Sets the field-value pairs specified by `fieldValues` to the hash stored at `key`.
   *   NOTE: Variadic form for `HSET` is supported only in Redis v4.0.0 or higher.
   */
  hset(key: string, ...fieldValues: [string, RedisValue][]): Promise<Integer>;

  /**
   * @description Sets the field-value pairs specified by `fieldValues` to the hash stored at `key`.
   *   NOTE: Variadic form for `HSET` is supported only in Redis v4.0.0 or higher.
   */
  hset(key: string, fieldValues: Record<string, RedisValue>): Promise<Integer>;
  hsetnx(key: string, field: string, value: RedisValue): Promise<Integer>;
  hstrlen(key: string, field: string): Promise<Integer>;
  hvals(key: string): Promise<BulkString[]>;

  // List
  blpop(timeout: number, ...keys: string[]): Promise<[BulkString, BulkString] | BulkNil>;
  brpop(timeout: number, ...keys: string[]): Promise<[BulkString, BulkString] | BulkNil>;
  brpoplpush(source: string, destination: string, timeout: number): Promise<Bulk>;
  lindex(key: string, index: number): Promise<Bulk>;
  linsert(key: string, loc: LInsertLocation, pivot: string, value: RedisValue): Promise<Integer>;
  llen(key: string): Promise<Integer>;
  lpop(key: string): Promise<Bulk>;

  /**
   * Returns the index of the first matching element inside a list.
   * If no match is found, this method returns `undefined`.
   */
  lpos(key: string, element: RedisValue, opts?: LPosOpts): Promise<Integer | BulkNil>;

  /**
   * Returns the indexes of the first N matching elements inside a list.
   * If no match is found. this method returns an empty array.
   *
   * @param opts.count Maximum length of the indices returned by this method
   */
  lpos(key: string, element: RedisValue, opts: LPosWithCountOpts): Promise<Integer[]>;

  lpush(key: string, ...elements: RedisValue[]): Promise<Integer>;
  lpushx(key: string, ...elements: RedisValue[]): Promise<Integer>;
  lrange(key: string, start: number, stop: number): Promise<BulkString[]>;
  lrem(key: string, count: number, element: RedisValue): Promise<Integer>;
  lset(key: string, index: number, element: RedisValue): Promise<SimpleString>;
  ltrim(key: string, start: number, stop: number): Promise<SimpleString>;
  rpop(key: string): Promise<Bulk>;
  rpoplpush(source: string, destination: string): Promise<Bulk>;
  rpush(key: string, ...elements: RedisValue[]): Promise<Integer>;
  rpushx(key: string, ...elements: RedisValue[]): Promise<Integer>;

  // HyperLogLog
  pfadd(key: string, ...elements: string[]): Promise<Integer>;
  pfcount(...keys: string[]): Promise<Integer>;
  pfmerge(destkey: string, ...sourcekeys: string[]): Promise<SimpleString>;

  // Set
  sadd(key: string, ...members: RedisValue[]): Promise<Integer>;
  scard(key: string): Promise<Integer>;
  sdiff(...keys: string[]): Promise<BulkString[]>;
  sdiffstore(destination: string, ...keys: string[]): Promise<Integer>;
  sinter(...keys: string[]): Promise<BulkString[]>;
  sinterstore(destination: string, ...keys: string[]): Promise<Integer>;
  sismember(key: string, member: RedisValue): Promise<Integer>;
  smembers(key: string): Promise<BulkString[]>;
  smove(source: string, destination: string, member: RedisValue): Promise<Integer>;
  spop(key: string): Promise<Bulk>;
  spop(key: string, count: number): Promise<BulkString[]>;
  srandmember(key: string): Promise<Bulk>;
  srandmember(key: string, count: number): Promise<BulkString[]>;
  srem(key: string, ...members: RedisValue[]): Promise<Integer>;
  sscan(key: string, cursor: number, opts?: SScanOpts): Promise<[BulkString, BulkString[]]>;
  sunion(...keys: string[]): Promise<BulkString[]>;
  sunionstore(destination: string, ...keys: string[]): Promise<Integer>;

  // SortedSet
  bzpopmin(timeout: number, ...keys: string[]): Promise<[BulkString, BulkString, BulkString] | BulkNil>;
  bzpopmax(timeout: number, ...keys: string[]): Promise<[BulkString, BulkString, BulkString] | BulkNil>;
  zadd(key: string, score: number, member: RedisValue, opts?: ZAddOpts): Promise<Integer>;
  zadd(key: string, score_members: [number, RedisValue][], opts?: ZAddOpts): Promise<Integer>;
  zadd(key: string, member_scores: Record<string | number, number>, opts?: ZAddOpts): Promise<Integer>;
  zaddIncr(key: string, score: number, member: RedisValue, opts?: ZAddOpts): Promise<Bulk>;
  zcard(key: string): Promise<Integer>;
  zcount(key: string, min: number, max: number): Promise<Integer>;
  zincrby(key: string, increment: number, member: RedisValue): Promise<BulkString>;
  zinter(keys: string[], opts?: ZInterOpts): Promise<Raw[]>;
  zinter(key_weights: [string, number][], opts?: ZInterOpts): Promise<Raw[]>;
  zinter(key_weights: Record<string, number>, opts?: ZInterOpts): Promise<Raw[]>;
  zinterstore(destination: string, keys: string[], opts?: ZInterstoreOpts): Promise<Integer>;
  zinterstore(destination: string, key_weights: [string, number][], opts?: ZInterstoreOpts): Promise<Integer>;
  zinterstore(destination: string, key_weights: Record<string, number>, opts?: ZInterstoreOpts): Promise<Integer>;
  zlexcount(key: string, min: string, max: string): Promise<Integer>;
  zpopmax(key: string, count?: number): Promise<BulkString[]>;
  zpopmin(key: string, count?: number): Promise<BulkString[]>;
  zrange(key: string, start: number, stop: number, opts?: ZRangeOpts): Promise<BulkString[]>;
  zrangebylex(key: string, min: string, max: string, opts?: ZRangeByLexOpts): Promise<BulkString[]>;
  zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    opts?: ZRangeByScoreOpts
  ): Promise<BulkString[]>;
  zrank(key: string, member: RedisValue): Promise<Integer | BulkNil>;
  zrem(key: string, ...members: RedisValue[]): Promise<Integer>;
  zremrangebylex(key: string, min: string, max: string): Promise<Integer>;
  zremrangebyrank(key: string, start: number, stop: number): Promise<Integer>;
  zremrangebyscore(key: string, min: number | string, max: number | string): Promise<Integer>;
  zrevrange(key: string, start: number, stop: number, opts?: ZRangeOpts): Promise<BulkString[]>;
  zrevrangebylex(key: string, max: string, min: string, opts?: ZRangeByLexOpts): Promise<BulkString[]>;
  zrevrangebyscore(
    key: string,
    max: number | string,
    min: number | string,
    opts?: ZRangeByScoreOpts
  ): Promise<BulkString[]>;
  zrevrank(key: string, member: RedisValue): Promise<Integer | BulkNil>;
  zscan(key: string, cursor: number, opts?: ZScanOpts): Promise<[BulkString, BulkString[]]>;
  zscore(key: string, member: RedisValue): Promise<Bulk>;
  zunionstore(destination: string, keys: string[], opts?: ZUnionstoreOpts): Promise<Integer>;
  zunionstore(destination: string, key_weights: [string, number][], opts?: ZUnionstoreOpts): Promise<Integer>;
  zunionstore(destination: string, key_weights: Record<string, number>, opts?: ZUnionstoreOpts): Promise<Integer>;

  // Server
  aclCat(categoryname?: string): Promise<BulkString[]>;
  aclDelUser(...usernames: string[]): Promise<Integer>;
  aclGenPass(bits?: number): Promise<BulkString>;
  aclGetUser(username: string): Promise<(BulkString | BulkString[])[]>;
  aclHelp(): Promise<BulkString[]>;
  aclList(): Promise<BulkString[]>;
  aclLoad(): Promise<SimpleString>;
  aclLog(count: number): Promise<BulkString[]>;
  aclLog(mode: ACLLogMode): Promise<SimpleString>;
  aclSave(): Promise<SimpleString>;
  aclSetUser(username: string, ...rules: string[]): Promise<SimpleString>;
  aclUsers(): Promise<BulkString[]>;
  aclWhoami(): Promise<BulkString>;
  bgrewriteaof(): Promise<SimpleString>;
  bgsave(): Promise<SimpleString>;
  command(): Promise<[BulkString, Integer, BulkString[], Integer, Integer, Integer][]>;
  commandCount(): Promise<Integer>;
  commandGetKeys(): Promise<BulkString[]>;
  commandInfo(
    ...command_names: string[]
  ): Promise<([BulkString, Integer, BulkString[], Integer, Integer, Integer] | BulkNil)[]>;
  configGet(parameter: string): Promise<BulkString[]>;
  configResetStat(): Promise<SimpleString>;
  configRewrite(): Promise<SimpleString>;
  configSet(parameter: string, value: string): Promise<SimpleString>;
  dbsize(): Promise<Integer>;
  debugObject(key: string): Promise<SimpleString>;
  debugSegfault(): Promise<SimpleString>;
  flushall(async?: boolean): Promise<SimpleString>;
  flushdb(async?: boolean): Promise<SimpleString>;
  info(section?: string): Promise<BulkString>;
  lastsave(): Promise<Integer>;
  memoryDoctor(): Promise<BulkString>;
  memoryHelp(): Promise<BulkString[]>;
  memoryMallocStats(): Promise<BulkString>;
  memoryPurge(): Promise<SimpleString>;
  memoryStats(): Promise<ConditionalArray>;
  memoryUsage(key: string, opts?: MemoryUsageOpts): Promise<Integer>;
  moduleList(): Promise<BulkString[]>;
  moduleLoad(path: string, ...args: string[]): Promise<SimpleString>;
  moduleUnload(name: string): Promise<SimpleString>;
  monitor(): void;
  replicaof(host: string, port: number): Promise<SimpleString>;
  replicaofNoOne(): Promise<SimpleString>;
  role(): Promise<RoleReply>;
  save(): Promise<SimpleString>;
  shutdown(mode?: ShutdownMode): Promise<SimpleString>;
  slaveof(host: string, port: number): Promise<SimpleString>;
  slaveofNoOne(): Promise<SimpleString>;
  slowlog(subcommand: string, ...args: string[]): Promise<ConditionalArray>;
  swapdb(index1: number, index2: number): Promise<SimpleString>;
  sync(): void;
  time(): Promise<[BulkString, BulkString]>;
}
