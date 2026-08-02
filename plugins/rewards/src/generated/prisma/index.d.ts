
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LedgerEntry
 * 
 */
export type LedgerEntry = $Result.DefaultSelection<Prisma.$LedgerEntryPayload>
/**
 * Model Balance
 * 
 */
export type Balance = $Result.DefaultSelection<Prisma.$BalancePayload>
/**
 * Model PendingPayout
 * 
 */
export type PendingPayout = $Result.DefaultSelection<Prisma.$PendingPayoutPayload>
/**
 * Model Reward
 * 
 */
export type Reward = $Result.DefaultSelection<Prisma.$RewardPayload>
/**
 * Model PunchCardTemplate
 * 
 */
export type PunchCardTemplate = $Result.DefaultSelection<Prisma.$PunchCardTemplatePayload>
/**
 * Model PunchCard
 * 
 */
export type PunchCard = $Result.DefaultSelection<Prisma.$PunchCardPayload>
/**
 * Model Punch
 * 
 */
export type Punch = $Result.DefaultSelection<Prisma.$PunchPayload>
/**
 * Model Redemption
 * 
 */
export type Redemption = $Result.DefaultSelection<Prisma.$RedemptionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more LedgerEntries
 * const ledgerEntries = await prisma.ledgerEntry.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more LedgerEntries
   * const ledgerEntries = await prisma.ledgerEntry.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.ledgerEntry`: Exposes CRUD operations for the **LedgerEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LedgerEntries
    * const ledgerEntries = await prisma.ledgerEntry.findMany()
    * ```
    */
  get ledgerEntry(): Prisma.LedgerEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.balance`: Exposes CRUD operations for the **Balance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Balances
    * const balances = await prisma.balance.findMany()
    * ```
    */
  get balance(): Prisma.BalanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pendingPayout`: Exposes CRUD operations for the **PendingPayout** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingPayouts
    * const pendingPayouts = await prisma.pendingPayout.findMany()
    * ```
    */
  get pendingPayout(): Prisma.PendingPayoutDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reward`: Exposes CRUD operations for the **Reward** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rewards
    * const rewards = await prisma.reward.findMany()
    * ```
    */
  get reward(): Prisma.RewardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.punchCardTemplate`: Exposes CRUD operations for the **PunchCardTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PunchCardTemplates
    * const punchCardTemplates = await prisma.punchCardTemplate.findMany()
    * ```
    */
  get punchCardTemplate(): Prisma.PunchCardTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.punchCard`: Exposes CRUD operations for the **PunchCard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PunchCards
    * const punchCards = await prisma.punchCard.findMany()
    * ```
    */
  get punchCard(): Prisma.PunchCardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.punch`: Exposes CRUD operations for the **Punch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Punches
    * const punches = await prisma.punch.findMany()
    * ```
    */
  get punch(): Prisma.PunchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.redemption`: Exposes CRUD operations for the **Redemption** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Redemptions
    * const redemptions = await prisma.redemption.findMany()
    * ```
    */
  get redemption(): Prisma.RedemptionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LedgerEntry: 'LedgerEntry',
    Balance: 'Balance',
    PendingPayout: 'PendingPayout',
    Reward: 'Reward',
    PunchCardTemplate: 'PunchCardTemplate',
    PunchCard: 'PunchCard',
    Punch: 'Punch',
    Redemption: 'Redemption'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "ledgerEntry" | "balance" | "pendingPayout" | "reward" | "punchCardTemplate" | "punchCard" | "punch" | "redemption"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LedgerEntry: {
        payload: Prisma.$LedgerEntryPayload<ExtArgs>
        fields: Prisma.LedgerEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LedgerEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LedgerEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findFirst: {
            args: Prisma.LedgerEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LedgerEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findMany: {
            args: Prisma.LedgerEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          create: {
            args: Prisma.LedgerEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          createMany: {
            args: Prisma.LedgerEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LedgerEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          delete: {
            args: Prisma.LedgerEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          update: {
            args: Prisma.LedgerEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          deleteMany: {
            args: Prisma.LedgerEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LedgerEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LedgerEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          upsert: {
            args: Prisma.LedgerEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          aggregate: {
            args: Prisma.LedgerEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLedgerEntry>
          }
          groupBy: {
            args: Prisma.LedgerEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LedgerEntryCountArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryCountAggregateOutputType> | number
          }
        }
      }
      Balance: {
        payload: Prisma.$BalancePayload<ExtArgs>
        fields: Prisma.BalanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BalanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BalanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          findFirst: {
            args: Prisma.BalanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BalanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          findMany: {
            args: Prisma.BalanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>[]
          }
          create: {
            args: Prisma.BalanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          createMany: {
            args: Prisma.BalanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BalanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>[]
          }
          delete: {
            args: Prisma.BalanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          update: {
            args: Prisma.BalanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          deleteMany: {
            args: Prisma.BalanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BalanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BalanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>[]
          }
          upsert: {
            args: Prisma.BalanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BalancePayload>
          }
          aggregate: {
            args: Prisma.BalanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBalance>
          }
          groupBy: {
            args: Prisma.BalanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BalanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BalanceCountArgs<ExtArgs>
            result: $Utils.Optional<BalanceCountAggregateOutputType> | number
          }
        }
      }
      PendingPayout: {
        payload: Prisma.$PendingPayoutPayload<ExtArgs>
        fields: Prisma.PendingPayoutFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingPayoutFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingPayoutFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          findFirst: {
            args: Prisma.PendingPayoutFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingPayoutFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          findMany: {
            args: Prisma.PendingPayoutFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>[]
          }
          create: {
            args: Prisma.PendingPayoutCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          createMany: {
            args: Prisma.PendingPayoutCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingPayoutCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>[]
          }
          delete: {
            args: Prisma.PendingPayoutDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          update: {
            args: Prisma.PendingPayoutUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          deleteMany: {
            args: Prisma.PendingPayoutDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingPayoutUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PendingPayoutUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>[]
          }
          upsert: {
            args: Prisma.PendingPayoutUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingPayoutPayload>
          }
          aggregate: {
            args: Prisma.PendingPayoutAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingPayout>
          }
          groupBy: {
            args: Prisma.PendingPayoutGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingPayoutGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingPayoutCountArgs<ExtArgs>
            result: $Utils.Optional<PendingPayoutCountAggregateOutputType> | number
          }
        }
      }
      Reward: {
        payload: Prisma.$RewardPayload<ExtArgs>
        fields: Prisma.RewardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RewardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RewardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          findFirst: {
            args: Prisma.RewardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RewardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          findMany: {
            args: Prisma.RewardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>[]
          }
          create: {
            args: Prisma.RewardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          createMany: {
            args: Prisma.RewardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RewardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>[]
          }
          delete: {
            args: Prisma.RewardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          update: {
            args: Prisma.RewardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          deleteMany: {
            args: Prisma.RewardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RewardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RewardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>[]
          }
          upsert: {
            args: Prisma.RewardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardPayload>
          }
          aggregate: {
            args: Prisma.RewardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReward>
          }
          groupBy: {
            args: Prisma.RewardGroupByArgs<ExtArgs>
            result: $Utils.Optional<RewardGroupByOutputType>[]
          }
          count: {
            args: Prisma.RewardCountArgs<ExtArgs>
            result: $Utils.Optional<RewardCountAggregateOutputType> | number
          }
        }
      }
      PunchCardTemplate: {
        payload: Prisma.$PunchCardTemplatePayload<ExtArgs>
        fields: Prisma.PunchCardTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PunchCardTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PunchCardTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          findFirst: {
            args: Prisma.PunchCardTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PunchCardTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          findMany: {
            args: Prisma.PunchCardTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>[]
          }
          create: {
            args: Prisma.PunchCardTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          createMany: {
            args: Prisma.PunchCardTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PunchCardTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>[]
          }
          delete: {
            args: Prisma.PunchCardTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          update: {
            args: Prisma.PunchCardTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          deleteMany: {
            args: Prisma.PunchCardTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PunchCardTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PunchCardTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>[]
          }
          upsert: {
            args: Prisma.PunchCardTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardTemplatePayload>
          }
          aggregate: {
            args: Prisma.PunchCardTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePunchCardTemplate>
          }
          groupBy: {
            args: Prisma.PunchCardTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<PunchCardTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.PunchCardTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<PunchCardTemplateCountAggregateOutputType> | number
          }
        }
      }
      PunchCard: {
        payload: Prisma.$PunchCardPayload<ExtArgs>
        fields: Prisma.PunchCardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PunchCardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PunchCardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          findFirst: {
            args: Prisma.PunchCardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PunchCardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          findMany: {
            args: Prisma.PunchCardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>[]
          }
          create: {
            args: Prisma.PunchCardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          createMany: {
            args: Prisma.PunchCardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PunchCardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>[]
          }
          delete: {
            args: Prisma.PunchCardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          update: {
            args: Prisma.PunchCardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          deleteMany: {
            args: Prisma.PunchCardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PunchCardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PunchCardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>[]
          }
          upsert: {
            args: Prisma.PunchCardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchCardPayload>
          }
          aggregate: {
            args: Prisma.PunchCardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePunchCard>
          }
          groupBy: {
            args: Prisma.PunchCardGroupByArgs<ExtArgs>
            result: $Utils.Optional<PunchCardGroupByOutputType>[]
          }
          count: {
            args: Prisma.PunchCardCountArgs<ExtArgs>
            result: $Utils.Optional<PunchCardCountAggregateOutputType> | number
          }
        }
      }
      Punch: {
        payload: Prisma.$PunchPayload<ExtArgs>
        fields: Prisma.PunchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PunchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PunchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          findFirst: {
            args: Prisma.PunchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PunchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          findMany: {
            args: Prisma.PunchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>[]
          }
          create: {
            args: Prisma.PunchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          createMany: {
            args: Prisma.PunchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PunchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>[]
          }
          delete: {
            args: Prisma.PunchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          update: {
            args: Prisma.PunchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          deleteMany: {
            args: Prisma.PunchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PunchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PunchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>[]
          }
          upsert: {
            args: Prisma.PunchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PunchPayload>
          }
          aggregate: {
            args: Prisma.PunchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePunch>
          }
          groupBy: {
            args: Prisma.PunchGroupByArgs<ExtArgs>
            result: $Utils.Optional<PunchGroupByOutputType>[]
          }
          count: {
            args: Prisma.PunchCountArgs<ExtArgs>
            result: $Utils.Optional<PunchCountAggregateOutputType> | number
          }
        }
      }
      Redemption: {
        payload: Prisma.$RedemptionPayload<ExtArgs>
        fields: Prisma.RedemptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RedemptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RedemptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          findFirst: {
            args: Prisma.RedemptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RedemptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          findMany: {
            args: Prisma.RedemptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>[]
          }
          create: {
            args: Prisma.RedemptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          createMany: {
            args: Prisma.RedemptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RedemptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>[]
          }
          delete: {
            args: Prisma.RedemptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          update: {
            args: Prisma.RedemptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          deleteMany: {
            args: Prisma.RedemptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RedemptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RedemptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>[]
          }
          upsert: {
            args: Prisma.RedemptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionPayload>
          }
          aggregate: {
            args: Prisma.RedemptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRedemption>
          }
          groupBy: {
            args: Prisma.RedemptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RedemptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RedemptionCountArgs<ExtArgs>
            result: $Utils.Optional<RedemptionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    ledgerEntry?: LedgerEntryOmit
    balance?: BalanceOmit
    pendingPayout?: PendingPayoutOmit
    reward?: RewardOmit
    punchCardTemplate?: PunchCardTemplateOmit
    punchCard?: PunchCardOmit
    punch?: PunchOmit
    redemption?: RedemptionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RewardCountOutputType
   */

  export type RewardCountOutputType = {
    redemptions: number
  }

  export type RewardCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    redemptions?: boolean | RewardCountOutputTypeCountRedemptionsArgs
  }

  // Custom InputTypes
  /**
   * RewardCountOutputType without action
   */
  export type RewardCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardCountOutputType
     */
    select?: RewardCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RewardCountOutputType without action
   */
  export type RewardCountOutputTypeCountRedemptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RedemptionWhereInput
  }


  /**
   * Count Type PunchCardTemplateCountOutputType
   */

  export type PunchCardTemplateCountOutputType = {
    cards: number
  }

  export type PunchCardTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cards?: boolean | PunchCardTemplateCountOutputTypeCountCardsArgs
  }

  // Custom InputTypes
  /**
   * PunchCardTemplateCountOutputType without action
   */
  export type PunchCardTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplateCountOutputType
     */
    select?: PunchCardTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PunchCardTemplateCountOutputType without action
   */
  export type PunchCardTemplateCountOutputTypeCountCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PunchCardWhereInput
  }


  /**
   * Count Type PunchCardCountOutputType
   */

  export type PunchCardCountOutputType = {
    punches: number
  }

  export type PunchCardCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    punches?: boolean | PunchCardCountOutputTypeCountPunchesArgs
  }

  // Custom InputTypes
  /**
   * PunchCardCountOutputType without action
   */
  export type PunchCardCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardCountOutputType
     */
    select?: PunchCardCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PunchCardCountOutputType without action
   */
  export type PunchCardCountOutputTypeCountPunchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PunchWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LedgerEntry
   */

  export type AggregateLedgerEntry = {
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  export type LedgerEntryAvgAggregateOutputType = {
    delta: number | null
  }

  export type LedgerEntrySumAggregateOutputType = {
    delta: number | null
  }

  export type LedgerEntryMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    delta: number | null
    reason: string | null
    sourceType: string | null
    sourceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type LedgerEntryMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    delta: number | null
    reason: string | null
    sourceType: string | null
    sourceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type LedgerEntryCountAggregateOutputType = {
    id: number
    profileId: number
    delta: number
    reason: number
    sourceType: number
    sourceId: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type LedgerEntryAvgAggregateInputType = {
    delta?: true
  }

  export type LedgerEntrySumAggregateInputType = {
    delta?: true
  }

  export type LedgerEntryMinAggregateInputType = {
    id?: true
    profileId?: true
    delta?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type LedgerEntryMaxAggregateInputType = {
    id?: true
    profileId?: true
    delta?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type LedgerEntryCountAggregateInputType = {
    id?: true
    profileId?: true
    delta?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type LedgerEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntry to aggregate.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LedgerEntries
    **/
    _count?: true | LedgerEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LedgerEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LedgerEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LedgerEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type GetLedgerEntryAggregateType<T extends LedgerEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateLedgerEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLedgerEntry[P]>
      : GetScalarType<T[P], AggregateLedgerEntry[P]>
  }




  export type LedgerEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithAggregationInput | LedgerEntryOrderByWithAggregationInput[]
    by: LedgerEntryScalarFieldEnum[] | LedgerEntryScalarFieldEnum
    having?: LedgerEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LedgerEntryCountAggregateInputType | true
    _avg?: LedgerEntryAvgAggregateInputType
    _sum?: LedgerEntrySumAggregateInputType
    _min?: LedgerEntryMinAggregateInputType
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type LedgerEntryGroupByOutputType = {
    id: string
    profileId: string
    delta: number
    reason: string
    sourceType: string
    sourceId: string | null
    createdBy: string | null
    createdAt: Date
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  type GetLedgerEntryGroupByPayload<T extends LedgerEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LedgerEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LedgerEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
            : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
        }
      >
    >


  export type LedgerEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    delta?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    delta?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    delta?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectScalar = {
    id?: boolean
    profileId?: boolean
    delta?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type LedgerEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "delta" | "reason" | "sourceType" | "sourceId" | "createdBy" | "createdAt", ExtArgs["result"]["ledgerEntry"]>

  export type $LedgerEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LedgerEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      delta: number
      reason: string
      sourceType: string
      sourceId: string | null
      createdBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["ledgerEntry"]>
    composites: {}
  }

  type LedgerEntryGetPayload<S extends boolean | null | undefined | LedgerEntryDefaultArgs> = $Result.GetResult<Prisma.$LedgerEntryPayload, S>

  type LedgerEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LedgerEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LedgerEntryCountAggregateInputType | true
    }

  export interface LedgerEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LedgerEntry'], meta: { name: 'LedgerEntry' } }
    /**
     * Find zero or one LedgerEntry that matches the filter.
     * @param {LedgerEntryFindUniqueArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LedgerEntryFindUniqueArgs>(args: SelectSubset<T, LedgerEntryFindUniqueArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LedgerEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LedgerEntryFindUniqueOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LedgerEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, LedgerEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LedgerEntryFindFirstArgs>(args?: SelectSubset<T, LedgerEntryFindFirstArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LedgerEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, LedgerEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LedgerEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany()
     * 
     * // Get first 10 LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LedgerEntryFindManyArgs>(args?: SelectSubset<T, LedgerEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LedgerEntry.
     * @param {LedgerEntryCreateArgs} args - Arguments to create a LedgerEntry.
     * @example
     * // Create one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.create({
     *   data: {
     *     // ... data to create a LedgerEntry
     *   }
     * })
     * 
     */
    create<T extends LedgerEntryCreateArgs>(args: SelectSubset<T, LedgerEntryCreateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LedgerEntries.
     * @param {LedgerEntryCreateManyArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LedgerEntryCreateManyArgs>(args?: SelectSubset<T, LedgerEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LedgerEntries and returns the data saved in the database.
     * @param {LedgerEntryCreateManyAndReturnArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LedgerEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, LedgerEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LedgerEntry.
     * @param {LedgerEntryDeleteArgs} args - Arguments to delete one LedgerEntry.
     * @example
     * // Delete one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.delete({
     *   where: {
     *     // ... filter to delete one LedgerEntry
     *   }
     * })
     * 
     */
    delete<T extends LedgerEntryDeleteArgs>(args: SelectSubset<T, LedgerEntryDeleteArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LedgerEntry.
     * @param {LedgerEntryUpdateArgs} args - Arguments to update one LedgerEntry.
     * @example
     * // Update one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LedgerEntryUpdateArgs>(args: SelectSubset<T, LedgerEntryUpdateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LedgerEntries.
     * @param {LedgerEntryDeleteManyArgs} args - Arguments to filter LedgerEntries to delete.
     * @example
     * // Delete a few LedgerEntries
     * const { count } = await prisma.ledgerEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LedgerEntryDeleteManyArgs>(args?: SelectSubset<T, LedgerEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LedgerEntryUpdateManyArgs>(args: SelectSubset<T, LedgerEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries and returns the data updated in the database.
     * @param {LedgerEntryUpdateManyAndReturnArgs} args - Arguments to update many LedgerEntries.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LedgerEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, LedgerEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LedgerEntry.
     * @param {LedgerEntryUpsertArgs} args - Arguments to update or create a LedgerEntry.
     * @example
     * // Update or create a LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.upsert({
     *   create: {
     *     // ... data to create a LedgerEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LedgerEntry we want to update
     *   }
     * })
     */
    upsert<T extends LedgerEntryUpsertArgs>(args: SelectSubset<T, LedgerEntryUpsertArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryCountArgs} args - Arguments to filter LedgerEntries to count.
     * @example
     * // Count the number of LedgerEntries
     * const count = await prisma.ledgerEntry.count({
     *   where: {
     *     // ... the filter for the LedgerEntries we want to count
     *   }
     * })
    **/
    count<T extends LedgerEntryCountArgs>(
      args?: Subset<T, LedgerEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LedgerEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LedgerEntryAggregateArgs>(args: Subset<T, LedgerEntryAggregateArgs>): Prisma.PrismaPromise<GetLedgerEntryAggregateType<T>>

    /**
     * Group by LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LedgerEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LedgerEntryGroupByArgs['orderBy'] }
        : { orderBy?: LedgerEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LedgerEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLedgerEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LedgerEntry model
   */
  readonly fields: LedgerEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LedgerEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LedgerEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LedgerEntry model
   */
  interface LedgerEntryFieldRefs {
    readonly id: FieldRef<"LedgerEntry", 'String'>
    readonly profileId: FieldRef<"LedgerEntry", 'String'>
    readonly delta: FieldRef<"LedgerEntry", 'Int'>
    readonly reason: FieldRef<"LedgerEntry", 'String'>
    readonly sourceType: FieldRef<"LedgerEntry", 'String'>
    readonly sourceId: FieldRef<"LedgerEntry", 'String'>
    readonly createdBy: FieldRef<"LedgerEntry", 'String'>
    readonly createdAt: FieldRef<"LedgerEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LedgerEntry findUnique
   */
  export type LedgerEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findUniqueOrThrow
   */
  export type LedgerEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findFirst
   */
  export type LedgerEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findFirstOrThrow
   */
  export type LedgerEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findMany
   */
  export type LedgerEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter, which LedgerEntries to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry create
   */
  export type LedgerEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a LedgerEntry.
     */
    data: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
  }

  /**
   * LedgerEntry createMany
   */
  export type LedgerEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LedgerEntry createManyAndReturn
   */
  export type LedgerEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LedgerEntry update
   */
  export type LedgerEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a LedgerEntry.
     */
    data: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
    /**
     * Choose, which LedgerEntry to update.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry updateMany
   */
  export type LedgerEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
  }

  /**
   * LedgerEntry updateManyAndReturn
   */
  export type LedgerEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
  }

  /**
   * LedgerEntry upsert
   */
  export type LedgerEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the LedgerEntry to update in case it exists.
     */
    where: LedgerEntryWhereUniqueInput
    /**
     * In case the LedgerEntry found by the `where` argument doesn't exist, create a new LedgerEntry with this data.
     */
    create: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
    /**
     * In case the LedgerEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
  }

  /**
   * LedgerEntry delete
   */
  export type LedgerEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Filter which LedgerEntry to delete.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry deleteMany
   */
  export type LedgerEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntries to delete
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to delete.
     */
    limit?: number
  }

  /**
   * LedgerEntry without action
   */
  export type LedgerEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
  }


  /**
   * Model Balance
   */

  export type AggregateBalance = {
    _count: BalanceCountAggregateOutputType | null
    _avg: BalanceAvgAggregateOutputType | null
    _sum: BalanceSumAggregateOutputType | null
    _min: BalanceMinAggregateOutputType | null
    _max: BalanceMaxAggregateOutputType | null
  }

  export type BalanceAvgAggregateOutputType = {
    balance: number | null
  }

  export type BalanceSumAggregateOutputType = {
    balance: number | null
  }

  export type BalanceMinAggregateOutputType = {
    profileId: string | null
    balance: number | null
    updatedAt: Date | null
  }

  export type BalanceMaxAggregateOutputType = {
    profileId: string | null
    balance: number | null
    updatedAt: Date | null
  }

  export type BalanceCountAggregateOutputType = {
    profileId: number
    balance: number
    updatedAt: number
    _all: number
  }


  export type BalanceAvgAggregateInputType = {
    balance?: true
  }

  export type BalanceSumAggregateInputType = {
    balance?: true
  }

  export type BalanceMinAggregateInputType = {
    profileId?: true
    balance?: true
    updatedAt?: true
  }

  export type BalanceMaxAggregateInputType = {
    profileId?: true
    balance?: true
    updatedAt?: true
  }

  export type BalanceCountAggregateInputType = {
    profileId?: true
    balance?: true
    updatedAt?: true
    _all?: true
  }

  export type BalanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Balance to aggregate.
     */
    where?: BalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Balances to fetch.
     */
    orderBy?: BalanceOrderByWithRelationInput | BalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Balances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Balances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Balances
    **/
    _count?: true | BalanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BalanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BalanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BalanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BalanceMaxAggregateInputType
  }

  export type GetBalanceAggregateType<T extends BalanceAggregateArgs> = {
        [P in keyof T & keyof AggregateBalance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBalance[P]>
      : GetScalarType<T[P], AggregateBalance[P]>
  }




  export type BalanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BalanceWhereInput
    orderBy?: BalanceOrderByWithAggregationInput | BalanceOrderByWithAggregationInput[]
    by: BalanceScalarFieldEnum[] | BalanceScalarFieldEnum
    having?: BalanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BalanceCountAggregateInputType | true
    _avg?: BalanceAvgAggregateInputType
    _sum?: BalanceSumAggregateInputType
    _min?: BalanceMinAggregateInputType
    _max?: BalanceMaxAggregateInputType
  }

  export type BalanceGroupByOutputType = {
    profileId: string
    balance: number
    updatedAt: Date
    _count: BalanceCountAggregateOutputType | null
    _avg: BalanceAvgAggregateOutputType | null
    _sum: BalanceSumAggregateOutputType | null
    _min: BalanceMinAggregateOutputType | null
    _max: BalanceMaxAggregateOutputType | null
  }

  type GetBalanceGroupByPayload<T extends BalanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BalanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BalanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BalanceGroupByOutputType[P]>
            : GetScalarType<T[P], BalanceGroupByOutputType[P]>
        }
      >
    >


  export type BalanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["balance"]>

  export type BalanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["balance"]>

  export type BalanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["balance"]>

  export type BalanceSelectScalar = {
    profileId?: boolean
    balance?: boolean
    updatedAt?: boolean
  }

  export type BalanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"profileId" | "balance" | "updatedAt", ExtArgs["result"]["balance"]>

  export type $BalancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Balance"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      profileId: string
      balance: number
      updatedAt: Date
    }, ExtArgs["result"]["balance"]>
    composites: {}
  }

  type BalanceGetPayload<S extends boolean | null | undefined | BalanceDefaultArgs> = $Result.GetResult<Prisma.$BalancePayload, S>

  type BalanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BalanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BalanceCountAggregateInputType | true
    }

  export interface BalanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Balance'], meta: { name: 'Balance' } }
    /**
     * Find zero or one Balance that matches the filter.
     * @param {BalanceFindUniqueArgs} args - Arguments to find a Balance
     * @example
     * // Get one Balance
     * const balance = await prisma.balance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BalanceFindUniqueArgs>(args: SelectSubset<T, BalanceFindUniqueArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Balance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BalanceFindUniqueOrThrowArgs} args - Arguments to find a Balance
     * @example
     * // Get one Balance
     * const balance = await prisma.balance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BalanceFindUniqueOrThrowArgs>(args: SelectSubset<T, BalanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Balance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceFindFirstArgs} args - Arguments to find a Balance
     * @example
     * // Get one Balance
     * const balance = await prisma.balance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BalanceFindFirstArgs>(args?: SelectSubset<T, BalanceFindFirstArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Balance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceFindFirstOrThrowArgs} args - Arguments to find a Balance
     * @example
     * // Get one Balance
     * const balance = await prisma.balance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BalanceFindFirstOrThrowArgs>(args?: SelectSubset<T, BalanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Balances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Balances
     * const balances = await prisma.balance.findMany()
     * 
     * // Get first 10 Balances
     * const balances = await prisma.balance.findMany({ take: 10 })
     * 
     * // Only select the `profileId`
     * const balanceWithProfileIdOnly = await prisma.balance.findMany({ select: { profileId: true } })
     * 
     */
    findMany<T extends BalanceFindManyArgs>(args?: SelectSubset<T, BalanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Balance.
     * @param {BalanceCreateArgs} args - Arguments to create a Balance.
     * @example
     * // Create one Balance
     * const Balance = await prisma.balance.create({
     *   data: {
     *     // ... data to create a Balance
     *   }
     * })
     * 
     */
    create<T extends BalanceCreateArgs>(args: SelectSubset<T, BalanceCreateArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Balances.
     * @param {BalanceCreateManyArgs} args - Arguments to create many Balances.
     * @example
     * // Create many Balances
     * const balance = await prisma.balance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BalanceCreateManyArgs>(args?: SelectSubset<T, BalanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Balances and returns the data saved in the database.
     * @param {BalanceCreateManyAndReturnArgs} args - Arguments to create many Balances.
     * @example
     * // Create many Balances
     * const balance = await prisma.balance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Balances and only return the `profileId`
     * const balanceWithProfileIdOnly = await prisma.balance.createManyAndReturn({
     *   select: { profileId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BalanceCreateManyAndReturnArgs>(args?: SelectSubset<T, BalanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Balance.
     * @param {BalanceDeleteArgs} args - Arguments to delete one Balance.
     * @example
     * // Delete one Balance
     * const Balance = await prisma.balance.delete({
     *   where: {
     *     // ... filter to delete one Balance
     *   }
     * })
     * 
     */
    delete<T extends BalanceDeleteArgs>(args: SelectSubset<T, BalanceDeleteArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Balance.
     * @param {BalanceUpdateArgs} args - Arguments to update one Balance.
     * @example
     * // Update one Balance
     * const balance = await prisma.balance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BalanceUpdateArgs>(args: SelectSubset<T, BalanceUpdateArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Balances.
     * @param {BalanceDeleteManyArgs} args - Arguments to filter Balances to delete.
     * @example
     * // Delete a few Balances
     * const { count } = await prisma.balance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BalanceDeleteManyArgs>(args?: SelectSubset<T, BalanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Balances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Balances
     * const balance = await prisma.balance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BalanceUpdateManyArgs>(args: SelectSubset<T, BalanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Balances and returns the data updated in the database.
     * @param {BalanceUpdateManyAndReturnArgs} args - Arguments to update many Balances.
     * @example
     * // Update many Balances
     * const balance = await prisma.balance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Balances and only return the `profileId`
     * const balanceWithProfileIdOnly = await prisma.balance.updateManyAndReturn({
     *   select: { profileId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BalanceUpdateManyAndReturnArgs>(args: SelectSubset<T, BalanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Balance.
     * @param {BalanceUpsertArgs} args - Arguments to update or create a Balance.
     * @example
     * // Update or create a Balance
     * const balance = await prisma.balance.upsert({
     *   create: {
     *     // ... data to create a Balance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Balance we want to update
     *   }
     * })
     */
    upsert<T extends BalanceUpsertArgs>(args: SelectSubset<T, BalanceUpsertArgs<ExtArgs>>): Prisma__BalanceClient<$Result.GetResult<Prisma.$BalancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Balances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceCountArgs} args - Arguments to filter Balances to count.
     * @example
     * // Count the number of Balances
     * const count = await prisma.balance.count({
     *   where: {
     *     // ... the filter for the Balances we want to count
     *   }
     * })
    **/
    count<T extends BalanceCountArgs>(
      args?: Subset<T, BalanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BalanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Balance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BalanceAggregateArgs>(args: Subset<T, BalanceAggregateArgs>): Prisma.PrismaPromise<GetBalanceAggregateType<T>>

    /**
     * Group by Balance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BalanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BalanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BalanceGroupByArgs['orderBy'] }
        : { orderBy?: BalanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BalanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBalanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Balance model
   */
  readonly fields: BalanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Balance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BalanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Balance model
   */
  interface BalanceFieldRefs {
    readonly profileId: FieldRef<"Balance", 'String'>
    readonly balance: FieldRef<"Balance", 'Int'>
    readonly updatedAt: FieldRef<"Balance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Balance findUnique
   */
  export type BalanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter, which Balance to fetch.
     */
    where: BalanceWhereUniqueInput
  }

  /**
   * Balance findUniqueOrThrow
   */
  export type BalanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter, which Balance to fetch.
     */
    where: BalanceWhereUniqueInput
  }

  /**
   * Balance findFirst
   */
  export type BalanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter, which Balance to fetch.
     */
    where?: BalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Balances to fetch.
     */
    orderBy?: BalanceOrderByWithRelationInput | BalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Balances.
     */
    cursor?: BalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Balances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Balances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Balances.
     */
    distinct?: BalanceScalarFieldEnum | BalanceScalarFieldEnum[]
  }

  /**
   * Balance findFirstOrThrow
   */
  export type BalanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter, which Balance to fetch.
     */
    where?: BalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Balances to fetch.
     */
    orderBy?: BalanceOrderByWithRelationInput | BalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Balances.
     */
    cursor?: BalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Balances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Balances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Balances.
     */
    distinct?: BalanceScalarFieldEnum | BalanceScalarFieldEnum[]
  }

  /**
   * Balance findMany
   */
  export type BalanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter, which Balances to fetch.
     */
    where?: BalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Balances to fetch.
     */
    orderBy?: BalanceOrderByWithRelationInput | BalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Balances.
     */
    cursor?: BalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Balances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Balances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Balances.
     */
    distinct?: BalanceScalarFieldEnum | BalanceScalarFieldEnum[]
  }

  /**
   * Balance create
   */
  export type BalanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * The data needed to create a Balance.
     */
    data: XOR<BalanceCreateInput, BalanceUncheckedCreateInput>
  }

  /**
   * Balance createMany
   */
  export type BalanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Balances.
     */
    data: BalanceCreateManyInput | BalanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Balance createManyAndReturn
   */
  export type BalanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * The data used to create many Balances.
     */
    data: BalanceCreateManyInput | BalanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Balance update
   */
  export type BalanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * The data needed to update a Balance.
     */
    data: XOR<BalanceUpdateInput, BalanceUncheckedUpdateInput>
    /**
     * Choose, which Balance to update.
     */
    where: BalanceWhereUniqueInput
  }

  /**
   * Balance updateMany
   */
  export type BalanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Balances.
     */
    data: XOR<BalanceUpdateManyMutationInput, BalanceUncheckedUpdateManyInput>
    /**
     * Filter which Balances to update
     */
    where?: BalanceWhereInput
    /**
     * Limit how many Balances to update.
     */
    limit?: number
  }

  /**
   * Balance updateManyAndReturn
   */
  export type BalanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * The data used to update Balances.
     */
    data: XOR<BalanceUpdateManyMutationInput, BalanceUncheckedUpdateManyInput>
    /**
     * Filter which Balances to update
     */
    where?: BalanceWhereInput
    /**
     * Limit how many Balances to update.
     */
    limit?: number
  }

  /**
   * Balance upsert
   */
  export type BalanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * The filter to search for the Balance to update in case it exists.
     */
    where: BalanceWhereUniqueInput
    /**
     * In case the Balance found by the `where` argument doesn't exist, create a new Balance with this data.
     */
    create: XOR<BalanceCreateInput, BalanceUncheckedCreateInput>
    /**
     * In case the Balance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BalanceUpdateInput, BalanceUncheckedUpdateInput>
  }

  /**
   * Balance delete
   */
  export type BalanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
    /**
     * Filter which Balance to delete.
     */
    where: BalanceWhereUniqueInput
  }

  /**
   * Balance deleteMany
   */
  export type BalanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Balances to delete
     */
    where?: BalanceWhereInput
    /**
     * Limit how many Balances to delete.
     */
    limit?: number
  }

  /**
   * Balance without action
   */
  export type BalanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Balance
     */
    select?: BalanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Balance
     */
    omit?: BalanceOmit<ExtArgs> | null
  }


  /**
   * Model PendingPayout
   */

  export type AggregatePendingPayout = {
    _count: PendingPayoutCountAggregateOutputType | null
    _avg: PendingPayoutAvgAggregateOutputType | null
    _sum: PendingPayoutSumAggregateOutputType | null
    _min: PendingPayoutMinAggregateOutputType | null
    _max: PendingPayoutMaxAggregateOutputType | null
  }

  export type PendingPayoutAvgAggregateOutputType = {
    amount: number | null
  }

  export type PendingPayoutSumAggregateOutputType = {
    amount: number | null
  }

  export type PendingPayoutMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    amount: number | null
    reason: string | null
    sourceType: string | null
    sourceId: string | null
    status: string | null
    decidedBy: string | null
    decidedNote: string | null
    decidedAt: Date | null
    createdAt: Date | null
  }

  export type PendingPayoutMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    amount: number | null
    reason: string | null
    sourceType: string | null
    sourceId: string | null
    status: string | null
    decidedBy: string | null
    decidedNote: string | null
    decidedAt: Date | null
    createdAt: Date | null
  }

  export type PendingPayoutCountAggregateOutputType = {
    id: number
    profileId: number
    amount: number
    reason: number
    sourceType: number
    sourceId: number
    status: number
    decidedBy: number
    decidedNote: number
    decidedAt: number
    createdAt: number
    _all: number
  }


  export type PendingPayoutAvgAggregateInputType = {
    amount?: true
  }

  export type PendingPayoutSumAggregateInputType = {
    amount?: true
  }

  export type PendingPayoutMinAggregateInputType = {
    id?: true
    profileId?: true
    amount?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    status?: true
    decidedBy?: true
    decidedNote?: true
    decidedAt?: true
    createdAt?: true
  }

  export type PendingPayoutMaxAggregateInputType = {
    id?: true
    profileId?: true
    amount?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    status?: true
    decidedBy?: true
    decidedNote?: true
    decidedAt?: true
    createdAt?: true
  }

  export type PendingPayoutCountAggregateInputType = {
    id?: true
    profileId?: true
    amount?: true
    reason?: true
    sourceType?: true
    sourceId?: true
    status?: true
    decidedBy?: true
    decidedNote?: true
    decidedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PendingPayoutAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingPayout to aggregate.
     */
    where?: PendingPayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingPayouts to fetch.
     */
    orderBy?: PendingPayoutOrderByWithRelationInput | PendingPayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingPayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingPayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingPayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingPayouts
    **/
    _count?: true | PendingPayoutCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PendingPayoutAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PendingPayoutSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingPayoutMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingPayoutMaxAggregateInputType
  }

  export type GetPendingPayoutAggregateType<T extends PendingPayoutAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingPayout]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingPayout[P]>
      : GetScalarType<T[P], AggregatePendingPayout[P]>
  }




  export type PendingPayoutGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingPayoutWhereInput
    orderBy?: PendingPayoutOrderByWithAggregationInput | PendingPayoutOrderByWithAggregationInput[]
    by: PendingPayoutScalarFieldEnum[] | PendingPayoutScalarFieldEnum
    having?: PendingPayoutScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingPayoutCountAggregateInputType | true
    _avg?: PendingPayoutAvgAggregateInputType
    _sum?: PendingPayoutSumAggregateInputType
    _min?: PendingPayoutMinAggregateInputType
    _max?: PendingPayoutMaxAggregateInputType
  }

  export type PendingPayoutGroupByOutputType = {
    id: string
    profileId: string
    amount: number
    reason: string
    sourceType: string
    sourceId: string
    status: string
    decidedBy: string | null
    decidedNote: string | null
    decidedAt: Date | null
    createdAt: Date
    _count: PendingPayoutCountAggregateOutputType | null
    _avg: PendingPayoutAvgAggregateOutputType | null
    _sum: PendingPayoutSumAggregateOutputType | null
    _min: PendingPayoutMinAggregateOutputType | null
    _max: PendingPayoutMaxAggregateOutputType | null
  }

  type GetPendingPayoutGroupByPayload<T extends PendingPayoutGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingPayoutGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingPayoutGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingPayoutGroupByOutputType[P]>
            : GetScalarType<T[P], PendingPayoutGroupByOutputType[P]>
        }
      >
    >


  export type PendingPayoutSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    amount?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    decidedBy?: boolean
    decidedNote?: boolean
    decidedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingPayout"]>

  export type PendingPayoutSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    amount?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    decidedBy?: boolean
    decidedNote?: boolean
    decidedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingPayout"]>

  export type PendingPayoutSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    amount?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    decidedBy?: boolean
    decidedNote?: boolean
    decidedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingPayout"]>

  export type PendingPayoutSelectScalar = {
    id?: boolean
    profileId?: boolean
    amount?: boolean
    reason?: boolean
    sourceType?: boolean
    sourceId?: boolean
    status?: boolean
    decidedBy?: boolean
    decidedNote?: boolean
    decidedAt?: boolean
    createdAt?: boolean
  }

  export type PendingPayoutOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "amount" | "reason" | "sourceType" | "sourceId" | "status" | "decidedBy" | "decidedNote" | "decidedAt" | "createdAt", ExtArgs["result"]["pendingPayout"]>

  export type $PendingPayoutPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingPayout"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      amount: number
      reason: string
      sourceType: string
      sourceId: string
      status: string
      decidedBy: string | null
      decidedNote: string | null
      decidedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["pendingPayout"]>
    composites: {}
  }

  type PendingPayoutGetPayload<S extends boolean | null | undefined | PendingPayoutDefaultArgs> = $Result.GetResult<Prisma.$PendingPayoutPayload, S>

  type PendingPayoutCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PendingPayoutFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PendingPayoutCountAggregateInputType | true
    }

  export interface PendingPayoutDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingPayout'], meta: { name: 'PendingPayout' } }
    /**
     * Find zero or one PendingPayout that matches the filter.
     * @param {PendingPayoutFindUniqueArgs} args - Arguments to find a PendingPayout
     * @example
     * // Get one PendingPayout
     * const pendingPayout = await prisma.pendingPayout.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingPayoutFindUniqueArgs>(args: SelectSubset<T, PendingPayoutFindUniqueArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PendingPayout that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PendingPayoutFindUniqueOrThrowArgs} args - Arguments to find a PendingPayout
     * @example
     * // Get one PendingPayout
     * const pendingPayout = await prisma.pendingPayout.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingPayoutFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingPayoutFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingPayout that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutFindFirstArgs} args - Arguments to find a PendingPayout
     * @example
     * // Get one PendingPayout
     * const pendingPayout = await prisma.pendingPayout.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingPayoutFindFirstArgs>(args?: SelectSubset<T, PendingPayoutFindFirstArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingPayout that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutFindFirstOrThrowArgs} args - Arguments to find a PendingPayout
     * @example
     * // Get one PendingPayout
     * const pendingPayout = await prisma.pendingPayout.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingPayoutFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingPayoutFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PendingPayouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingPayouts
     * const pendingPayouts = await prisma.pendingPayout.findMany()
     * 
     * // Get first 10 PendingPayouts
     * const pendingPayouts = await prisma.pendingPayout.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingPayoutWithIdOnly = await prisma.pendingPayout.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingPayoutFindManyArgs>(args?: SelectSubset<T, PendingPayoutFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PendingPayout.
     * @param {PendingPayoutCreateArgs} args - Arguments to create a PendingPayout.
     * @example
     * // Create one PendingPayout
     * const PendingPayout = await prisma.pendingPayout.create({
     *   data: {
     *     // ... data to create a PendingPayout
     *   }
     * })
     * 
     */
    create<T extends PendingPayoutCreateArgs>(args: SelectSubset<T, PendingPayoutCreateArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PendingPayouts.
     * @param {PendingPayoutCreateManyArgs} args - Arguments to create many PendingPayouts.
     * @example
     * // Create many PendingPayouts
     * const pendingPayout = await prisma.pendingPayout.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingPayoutCreateManyArgs>(args?: SelectSubset<T, PendingPayoutCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingPayouts and returns the data saved in the database.
     * @param {PendingPayoutCreateManyAndReturnArgs} args - Arguments to create many PendingPayouts.
     * @example
     * // Create many PendingPayouts
     * const pendingPayout = await prisma.pendingPayout.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingPayouts and only return the `id`
     * const pendingPayoutWithIdOnly = await prisma.pendingPayout.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingPayoutCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingPayoutCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PendingPayout.
     * @param {PendingPayoutDeleteArgs} args - Arguments to delete one PendingPayout.
     * @example
     * // Delete one PendingPayout
     * const PendingPayout = await prisma.pendingPayout.delete({
     *   where: {
     *     // ... filter to delete one PendingPayout
     *   }
     * })
     * 
     */
    delete<T extends PendingPayoutDeleteArgs>(args: SelectSubset<T, PendingPayoutDeleteArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PendingPayout.
     * @param {PendingPayoutUpdateArgs} args - Arguments to update one PendingPayout.
     * @example
     * // Update one PendingPayout
     * const pendingPayout = await prisma.pendingPayout.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingPayoutUpdateArgs>(args: SelectSubset<T, PendingPayoutUpdateArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PendingPayouts.
     * @param {PendingPayoutDeleteManyArgs} args - Arguments to filter PendingPayouts to delete.
     * @example
     * // Delete a few PendingPayouts
     * const { count } = await prisma.pendingPayout.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingPayoutDeleteManyArgs>(args?: SelectSubset<T, PendingPayoutDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingPayouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingPayouts
     * const pendingPayout = await prisma.pendingPayout.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingPayoutUpdateManyArgs>(args: SelectSubset<T, PendingPayoutUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingPayouts and returns the data updated in the database.
     * @param {PendingPayoutUpdateManyAndReturnArgs} args - Arguments to update many PendingPayouts.
     * @example
     * // Update many PendingPayouts
     * const pendingPayout = await prisma.pendingPayout.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PendingPayouts and only return the `id`
     * const pendingPayoutWithIdOnly = await prisma.pendingPayout.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PendingPayoutUpdateManyAndReturnArgs>(args: SelectSubset<T, PendingPayoutUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PendingPayout.
     * @param {PendingPayoutUpsertArgs} args - Arguments to update or create a PendingPayout.
     * @example
     * // Update or create a PendingPayout
     * const pendingPayout = await prisma.pendingPayout.upsert({
     *   create: {
     *     // ... data to create a PendingPayout
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingPayout we want to update
     *   }
     * })
     */
    upsert<T extends PendingPayoutUpsertArgs>(args: SelectSubset<T, PendingPayoutUpsertArgs<ExtArgs>>): Prisma__PendingPayoutClient<$Result.GetResult<Prisma.$PendingPayoutPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PendingPayouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutCountArgs} args - Arguments to filter PendingPayouts to count.
     * @example
     * // Count the number of PendingPayouts
     * const count = await prisma.pendingPayout.count({
     *   where: {
     *     // ... the filter for the PendingPayouts we want to count
     *   }
     * })
    **/
    count<T extends PendingPayoutCountArgs>(
      args?: Subset<T, PendingPayoutCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingPayoutCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingPayout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PendingPayoutAggregateArgs>(args: Subset<T, PendingPayoutAggregateArgs>): Prisma.PrismaPromise<GetPendingPayoutAggregateType<T>>

    /**
     * Group by PendingPayout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingPayoutGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PendingPayoutGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingPayoutGroupByArgs['orderBy'] }
        : { orderBy?: PendingPayoutGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PendingPayoutGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingPayoutGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingPayout model
   */
  readonly fields: PendingPayoutFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingPayout.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingPayoutClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PendingPayout model
   */
  interface PendingPayoutFieldRefs {
    readonly id: FieldRef<"PendingPayout", 'String'>
    readonly profileId: FieldRef<"PendingPayout", 'String'>
    readonly amount: FieldRef<"PendingPayout", 'Int'>
    readonly reason: FieldRef<"PendingPayout", 'String'>
    readonly sourceType: FieldRef<"PendingPayout", 'String'>
    readonly sourceId: FieldRef<"PendingPayout", 'String'>
    readonly status: FieldRef<"PendingPayout", 'String'>
    readonly decidedBy: FieldRef<"PendingPayout", 'String'>
    readonly decidedNote: FieldRef<"PendingPayout", 'String'>
    readonly decidedAt: FieldRef<"PendingPayout", 'DateTime'>
    readonly createdAt: FieldRef<"PendingPayout", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PendingPayout findUnique
   */
  export type PendingPayoutFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter, which PendingPayout to fetch.
     */
    where: PendingPayoutWhereUniqueInput
  }

  /**
   * PendingPayout findUniqueOrThrow
   */
  export type PendingPayoutFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter, which PendingPayout to fetch.
     */
    where: PendingPayoutWhereUniqueInput
  }

  /**
   * PendingPayout findFirst
   */
  export type PendingPayoutFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter, which PendingPayout to fetch.
     */
    where?: PendingPayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingPayouts to fetch.
     */
    orderBy?: PendingPayoutOrderByWithRelationInput | PendingPayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingPayouts.
     */
    cursor?: PendingPayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingPayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingPayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingPayouts.
     */
    distinct?: PendingPayoutScalarFieldEnum | PendingPayoutScalarFieldEnum[]
  }

  /**
   * PendingPayout findFirstOrThrow
   */
  export type PendingPayoutFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter, which PendingPayout to fetch.
     */
    where?: PendingPayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingPayouts to fetch.
     */
    orderBy?: PendingPayoutOrderByWithRelationInput | PendingPayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingPayouts.
     */
    cursor?: PendingPayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingPayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingPayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingPayouts.
     */
    distinct?: PendingPayoutScalarFieldEnum | PendingPayoutScalarFieldEnum[]
  }

  /**
   * PendingPayout findMany
   */
  export type PendingPayoutFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter, which PendingPayouts to fetch.
     */
    where?: PendingPayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingPayouts to fetch.
     */
    orderBy?: PendingPayoutOrderByWithRelationInput | PendingPayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingPayouts.
     */
    cursor?: PendingPayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingPayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingPayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingPayouts.
     */
    distinct?: PendingPayoutScalarFieldEnum | PendingPayoutScalarFieldEnum[]
  }

  /**
   * PendingPayout create
   */
  export type PendingPayoutCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * The data needed to create a PendingPayout.
     */
    data: XOR<PendingPayoutCreateInput, PendingPayoutUncheckedCreateInput>
  }

  /**
   * PendingPayout createMany
   */
  export type PendingPayoutCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingPayouts.
     */
    data: PendingPayoutCreateManyInput | PendingPayoutCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PendingPayout createManyAndReturn
   */
  export type PendingPayoutCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * The data used to create many PendingPayouts.
     */
    data: PendingPayoutCreateManyInput | PendingPayoutCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PendingPayout update
   */
  export type PendingPayoutUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * The data needed to update a PendingPayout.
     */
    data: XOR<PendingPayoutUpdateInput, PendingPayoutUncheckedUpdateInput>
    /**
     * Choose, which PendingPayout to update.
     */
    where: PendingPayoutWhereUniqueInput
  }

  /**
   * PendingPayout updateMany
   */
  export type PendingPayoutUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingPayouts.
     */
    data: XOR<PendingPayoutUpdateManyMutationInput, PendingPayoutUncheckedUpdateManyInput>
    /**
     * Filter which PendingPayouts to update
     */
    where?: PendingPayoutWhereInput
    /**
     * Limit how many PendingPayouts to update.
     */
    limit?: number
  }

  /**
   * PendingPayout updateManyAndReturn
   */
  export type PendingPayoutUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * The data used to update PendingPayouts.
     */
    data: XOR<PendingPayoutUpdateManyMutationInput, PendingPayoutUncheckedUpdateManyInput>
    /**
     * Filter which PendingPayouts to update
     */
    where?: PendingPayoutWhereInput
    /**
     * Limit how many PendingPayouts to update.
     */
    limit?: number
  }

  /**
   * PendingPayout upsert
   */
  export type PendingPayoutUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * The filter to search for the PendingPayout to update in case it exists.
     */
    where: PendingPayoutWhereUniqueInput
    /**
     * In case the PendingPayout found by the `where` argument doesn't exist, create a new PendingPayout with this data.
     */
    create: XOR<PendingPayoutCreateInput, PendingPayoutUncheckedCreateInput>
    /**
     * In case the PendingPayout was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingPayoutUpdateInput, PendingPayoutUncheckedUpdateInput>
  }

  /**
   * PendingPayout delete
   */
  export type PendingPayoutDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
    /**
     * Filter which PendingPayout to delete.
     */
    where: PendingPayoutWhereUniqueInput
  }

  /**
   * PendingPayout deleteMany
   */
  export type PendingPayoutDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingPayouts to delete
     */
    where?: PendingPayoutWhereInput
    /**
     * Limit how many PendingPayouts to delete.
     */
    limit?: number
  }

  /**
   * PendingPayout without action
   */
  export type PendingPayoutDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingPayout
     */
    select?: PendingPayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingPayout
     */
    omit?: PendingPayoutOmit<ExtArgs> | null
  }


  /**
   * Model Reward
   */

  export type AggregateReward = {
    _count: RewardCountAggregateOutputType | null
    _avg: RewardAvgAggregateOutputType | null
    _sum: RewardSumAggregateOutputType | null
    _min: RewardMinAggregateOutputType | null
    _max: RewardMaxAggregateOutputType | null
  }

  export type RewardAvgAggregateOutputType = {
    cost: number | null
    stock: number | null
  }

  export type RewardSumAggregateOutputType = {
    cost: number | null
    stock: number | null
  }

  export type RewardMinAggregateOutputType = {
    id: string | null
    name: string | null
    emoji: string | null
    description: string | null
    cost: number | null
    requiresApproval: boolean | null
    stock: number | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type RewardMaxAggregateOutputType = {
    id: string | null
    name: string | null
    emoji: string | null
    description: string | null
    cost: number | null
    requiresApproval: boolean | null
    stock: number | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type RewardCountAggregateOutputType = {
    id: number
    name: number
    emoji: number
    description: number
    cost: number
    requiresApproval: number
    audience: number
    stock: number
    active: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type RewardAvgAggregateInputType = {
    cost?: true
    stock?: true
  }

  export type RewardSumAggregateInputType = {
    cost?: true
    stock?: true
  }

  export type RewardMinAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    description?: true
    cost?: true
    requiresApproval?: true
    stock?: true
    active?: true
    createdBy?: true
    createdAt?: true
  }

  export type RewardMaxAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    description?: true
    cost?: true
    requiresApproval?: true
    stock?: true
    active?: true
    createdBy?: true
    createdAt?: true
  }

  export type RewardCountAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    description?: true
    cost?: true
    requiresApproval?: true
    audience?: true
    stock?: true
    active?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type RewardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reward to aggregate.
     */
    where?: RewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rewards to fetch.
     */
    orderBy?: RewardOrderByWithRelationInput | RewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rewards
    **/
    _count?: true | RewardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RewardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RewardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RewardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RewardMaxAggregateInputType
  }

  export type GetRewardAggregateType<T extends RewardAggregateArgs> = {
        [P in keyof T & keyof AggregateReward]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReward[P]>
      : GetScalarType<T[P], AggregateReward[P]>
  }




  export type RewardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RewardWhereInput
    orderBy?: RewardOrderByWithAggregationInput | RewardOrderByWithAggregationInput[]
    by: RewardScalarFieldEnum[] | RewardScalarFieldEnum
    having?: RewardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RewardCountAggregateInputType | true
    _avg?: RewardAvgAggregateInputType
    _sum?: RewardSumAggregateInputType
    _min?: RewardMinAggregateInputType
    _max?: RewardMaxAggregateInputType
  }

  export type RewardGroupByOutputType = {
    id: string
    name: string
    emoji: string
    description: string | null
    cost: number
    requiresApproval: boolean
    audience: string[]
    stock: number | null
    active: boolean
    createdBy: string
    createdAt: Date
    _count: RewardCountAggregateOutputType | null
    _avg: RewardAvgAggregateOutputType | null
    _sum: RewardSumAggregateOutputType | null
    _min: RewardMinAggregateOutputType | null
    _max: RewardMaxAggregateOutputType | null
  }

  type GetRewardGroupByPayload<T extends RewardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RewardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RewardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RewardGroupByOutputType[P]>
            : GetScalarType<T[P], RewardGroupByOutputType[P]>
        }
      >
    >


  export type RewardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    description?: boolean
    cost?: boolean
    requiresApproval?: boolean
    audience?: boolean
    stock?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    redemptions?: boolean | Reward$redemptionsArgs<ExtArgs>
    _count?: boolean | RewardCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reward"]>

  export type RewardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    description?: boolean
    cost?: boolean
    requiresApproval?: boolean
    audience?: boolean
    stock?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reward"]>

  export type RewardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    description?: boolean
    cost?: boolean
    requiresApproval?: boolean
    audience?: boolean
    stock?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reward"]>

  export type RewardSelectScalar = {
    id?: boolean
    name?: boolean
    emoji?: boolean
    description?: boolean
    cost?: boolean
    requiresApproval?: boolean
    audience?: boolean
    stock?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type RewardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "emoji" | "description" | "cost" | "requiresApproval" | "audience" | "stock" | "active" | "createdBy" | "createdAt", ExtArgs["result"]["reward"]>
  export type RewardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    redemptions?: boolean | Reward$redemptionsArgs<ExtArgs>
    _count?: boolean | RewardCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RewardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RewardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RewardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reward"
    objects: {
      redemptions: Prisma.$RedemptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      emoji: string
      description: string | null
      cost: number
      requiresApproval: boolean
      audience: string[]
      stock: number | null
      active: boolean
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["reward"]>
    composites: {}
  }

  type RewardGetPayload<S extends boolean | null | undefined | RewardDefaultArgs> = $Result.GetResult<Prisma.$RewardPayload, S>

  type RewardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RewardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RewardCountAggregateInputType | true
    }

  export interface RewardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reward'], meta: { name: 'Reward' } }
    /**
     * Find zero or one Reward that matches the filter.
     * @param {RewardFindUniqueArgs} args - Arguments to find a Reward
     * @example
     * // Get one Reward
     * const reward = await prisma.reward.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RewardFindUniqueArgs>(args: SelectSubset<T, RewardFindUniqueArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reward that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RewardFindUniqueOrThrowArgs} args - Arguments to find a Reward
     * @example
     * // Get one Reward
     * const reward = await prisma.reward.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RewardFindUniqueOrThrowArgs>(args: SelectSubset<T, RewardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reward that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardFindFirstArgs} args - Arguments to find a Reward
     * @example
     * // Get one Reward
     * const reward = await prisma.reward.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RewardFindFirstArgs>(args?: SelectSubset<T, RewardFindFirstArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reward that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardFindFirstOrThrowArgs} args - Arguments to find a Reward
     * @example
     * // Get one Reward
     * const reward = await prisma.reward.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RewardFindFirstOrThrowArgs>(args?: SelectSubset<T, RewardFindFirstOrThrowArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rewards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rewards
     * const rewards = await prisma.reward.findMany()
     * 
     * // Get first 10 Rewards
     * const rewards = await prisma.reward.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rewardWithIdOnly = await prisma.reward.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RewardFindManyArgs>(args?: SelectSubset<T, RewardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reward.
     * @param {RewardCreateArgs} args - Arguments to create a Reward.
     * @example
     * // Create one Reward
     * const Reward = await prisma.reward.create({
     *   data: {
     *     // ... data to create a Reward
     *   }
     * })
     * 
     */
    create<T extends RewardCreateArgs>(args: SelectSubset<T, RewardCreateArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rewards.
     * @param {RewardCreateManyArgs} args - Arguments to create many Rewards.
     * @example
     * // Create many Rewards
     * const reward = await prisma.reward.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RewardCreateManyArgs>(args?: SelectSubset<T, RewardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rewards and returns the data saved in the database.
     * @param {RewardCreateManyAndReturnArgs} args - Arguments to create many Rewards.
     * @example
     * // Create many Rewards
     * const reward = await prisma.reward.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rewards and only return the `id`
     * const rewardWithIdOnly = await prisma.reward.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RewardCreateManyAndReturnArgs>(args?: SelectSubset<T, RewardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reward.
     * @param {RewardDeleteArgs} args - Arguments to delete one Reward.
     * @example
     * // Delete one Reward
     * const Reward = await prisma.reward.delete({
     *   where: {
     *     // ... filter to delete one Reward
     *   }
     * })
     * 
     */
    delete<T extends RewardDeleteArgs>(args: SelectSubset<T, RewardDeleteArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reward.
     * @param {RewardUpdateArgs} args - Arguments to update one Reward.
     * @example
     * // Update one Reward
     * const reward = await prisma.reward.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RewardUpdateArgs>(args: SelectSubset<T, RewardUpdateArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rewards.
     * @param {RewardDeleteManyArgs} args - Arguments to filter Rewards to delete.
     * @example
     * // Delete a few Rewards
     * const { count } = await prisma.reward.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RewardDeleteManyArgs>(args?: SelectSubset<T, RewardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rewards
     * const reward = await prisma.reward.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RewardUpdateManyArgs>(args: SelectSubset<T, RewardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rewards and returns the data updated in the database.
     * @param {RewardUpdateManyAndReturnArgs} args - Arguments to update many Rewards.
     * @example
     * // Update many Rewards
     * const reward = await prisma.reward.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rewards and only return the `id`
     * const rewardWithIdOnly = await prisma.reward.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RewardUpdateManyAndReturnArgs>(args: SelectSubset<T, RewardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reward.
     * @param {RewardUpsertArgs} args - Arguments to update or create a Reward.
     * @example
     * // Update or create a Reward
     * const reward = await prisma.reward.upsert({
     *   create: {
     *     // ... data to create a Reward
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reward we want to update
     *   }
     * })
     */
    upsert<T extends RewardUpsertArgs>(args: SelectSubset<T, RewardUpsertArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardCountArgs} args - Arguments to filter Rewards to count.
     * @example
     * // Count the number of Rewards
     * const count = await prisma.reward.count({
     *   where: {
     *     // ... the filter for the Rewards we want to count
     *   }
     * })
    **/
    count<T extends RewardCountArgs>(
      args?: Subset<T, RewardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RewardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RewardAggregateArgs>(args: Subset<T, RewardAggregateArgs>): Prisma.PrismaPromise<GetRewardAggregateType<T>>

    /**
     * Group by Reward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RewardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RewardGroupByArgs['orderBy'] }
        : { orderBy?: RewardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RewardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRewardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reward model
   */
  readonly fields: RewardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reward.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RewardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    redemptions<T extends Reward$redemptionsArgs<ExtArgs> = {}>(args?: Subset<T, Reward$redemptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reward model
   */
  interface RewardFieldRefs {
    readonly id: FieldRef<"Reward", 'String'>
    readonly name: FieldRef<"Reward", 'String'>
    readonly emoji: FieldRef<"Reward", 'String'>
    readonly description: FieldRef<"Reward", 'String'>
    readonly cost: FieldRef<"Reward", 'Int'>
    readonly requiresApproval: FieldRef<"Reward", 'Boolean'>
    readonly audience: FieldRef<"Reward", 'String[]'>
    readonly stock: FieldRef<"Reward", 'Int'>
    readonly active: FieldRef<"Reward", 'Boolean'>
    readonly createdBy: FieldRef<"Reward", 'String'>
    readonly createdAt: FieldRef<"Reward", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reward findUnique
   */
  export type RewardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter, which Reward to fetch.
     */
    where: RewardWhereUniqueInput
  }

  /**
   * Reward findUniqueOrThrow
   */
  export type RewardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter, which Reward to fetch.
     */
    where: RewardWhereUniqueInput
  }

  /**
   * Reward findFirst
   */
  export type RewardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter, which Reward to fetch.
     */
    where?: RewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rewards to fetch.
     */
    orderBy?: RewardOrderByWithRelationInput | RewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rewards.
     */
    cursor?: RewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rewards.
     */
    distinct?: RewardScalarFieldEnum | RewardScalarFieldEnum[]
  }

  /**
   * Reward findFirstOrThrow
   */
  export type RewardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter, which Reward to fetch.
     */
    where?: RewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rewards to fetch.
     */
    orderBy?: RewardOrderByWithRelationInput | RewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rewards.
     */
    cursor?: RewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rewards.
     */
    distinct?: RewardScalarFieldEnum | RewardScalarFieldEnum[]
  }

  /**
   * Reward findMany
   */
  export type RewardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter, which Rewards to fetch.
     */
    where?: RewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rewards to fetch.
     */
    orderBy?: RewardOrderByWithRelationInput | RewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rewards.
     */
    cursor?: RewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rewards.
     */
    distinct?: RewardScalarFieldEnum | RewardScalarFieldEnum[]
  }

  /**
   * Reward create
   */
  export type RewardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * The data needed to create a Reward.
     */
    data: XOR<RewardCreateInput, RewardUncheckedCreateInput>
  }

  /**
   * Reward createMany
   */
  export type RewardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rewards.
     */
    data: RewardCreateManyInput | RewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reward createManyAndReturn
   */
  export type RewardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * The data used to create many Rewards.
     */
    data: RewardCreateManyInput | RewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reward update
   */
  export type RewardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * The data needed to update a Reward.
     */
    data: XOR<RewardUpdateInput, RewardUncheckedUpdateInput>
    /**
     * Choose, which Reward to update.
     */
    where: RewardWhereUniqueInput
  }

  /**
   * Reward updateMany
   */
  export type RewardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rewards.
     */
    data: XOR<RewardUpdateManyMutationInput, RewardUncheckedUpdateManyInput>
    /**
     * Filter which Rewards to update
     */
    where?: RewardWhereInput
    /**
     * Limit how many Rewards to update.
     */
    limit?: number
  }

  /**
   * Reward updateManyAndReturn
   */
  export type RewardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * The data used to update Rewards.
     */
    data: XOR<RewardUpdateManyMutationInput, RewardUncheckedUpdateManyInput>
    /**
     * Filter which Rewards to update
     */
    where?: RewardWhereInput
    /**
     * Limit how many Rewards to update.
     */
    limit?: number
  }

  /**
   * Reward upsert
   */
  export type RewardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * The filter to search for the Reward to update in case it exists.
     */
    where: RewardWhereUniqueInput
    /**
     * In case the Reward found by the `where` argument doesn't exist, create a new Reward with this data.
     */
    create: XOR<RewardCreateInput, RewardUncheckedCreateInput>
    /**
     * In case the Reward was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RewardUpdateInput, RewardUncheckedUpdateInput>
  }

  /**
   * Reward delete
   */
  export type RewardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
    /**
     * Filter which Reward to delete.
     */
    where: RewardWhereUniqueInput
  }

  /**
   * Reward deleteMany
   */
  export type RewardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rewards to delete
     */
    where?: RewardWhereInput
    /**
     * Limit how many Rewards to delete.
     */
    limit?: number
  }

  /**
   * Reward.redemptions
   */
  export type Reward$redemptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    where?: RedemptionWhereInput
    orderBy?: RedemptionOrderByWithRelationInput | RedemptionOrderByWithRelationInput[]
    cursor?: RedemptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RedemptionScalarFieldEnum | RedemptionScalarFieldEnum[]
  }

  /**
   * Reward without action
   */
  export type RewardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: RewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reward
     */
    omit?: RewardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardInclude<ExtArgs> | null
  }


  /**
   * Model PunchCardTemplate
   */

  export type AggregatePunchCardTemplate = {
    _count: PunchCardTemplateCountAggregateOutputType | null
    _avg: PunchCardTemplateAvgAggregateOutputType | null
    _sum: PunchCardTemplateSumAggregateOutputType | null
    _min: PunchCardTemplateMinAggregateOutputType | null
    _max: PunchCardTemplateMaxAggregateOutputType | null
  }

  export type PunchCardTemplateAvgAggregateOutputType = {
    goal: number | null
    payoutCoins: number | null
  }

  export type PunchCardTemplateSumAggregateOutputType = {
    goal: number | null
    payoutCoins: number | null
  }

  export type PunchCardTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    glyph: string | null
    goal: number | null
    payoutKind: string | null
    payoutCoins: number | null
    active: boolean | null
  }

  export type PunchCardTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    glyph: string | null
    goal: number | null
    payoutKind: string | null
    payoutCoins: number | null
    active: boolean | null
  }

  export type PunchCardTemplateCountAggregateOutputType = {
    id: number
    name: number
    glyph: number
    goal: number
    payoutKind: number
    payoutCoins: number
    payoutOptionIds: number
    audience: number
    active: number
    _all: number
  }


  export type PunchCardTemplateAvgAggregateInputType = {
    goal?: true
    payoutCoins?: true
  }

  export type PunchCardTemplateSumAggregateInputType = {
    goal?: true
    payoutCoins?: true
  }

  export type PunchCardTemplateMinAggregateInputType = {
    id?: true
    name?: true
    glyph?: true
    goal?: true
    payoutKind?: true
    payoutCoins?: true
    active?: true
  }

  export type PunchCardTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    glyph?: true
    goal?: true
    payoutKind?: true
    payoutCoins?: true
    active?: true
  }

  export type PunchCardTemplateCountAggregateInputType = {
    id?: true
    name?: true
    glyph?: true
    goal?: true
    payoutKind?: true
    payoutCoins?: true
    payoutOptionIds?: true
    audience?: true
    active?: true
    _all?: true
  }

  export type PunchCardTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PunchCardTemplate to aggregate.
     */
    where?: PunchCardTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCardTemplates to fetch.
     */
    orderBy?: PunchCardTemplateOrderByWithRelationInput | PunchCardTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PunchCardTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCardTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCardTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PunchCardTemplates
    **/
    _count?: true | PunchCardTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PunchCardTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PunchCardTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PunchCardTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PunchCardTemplateMaxAggregateInputType
  }

  export type GetPunchCardTemplateAggregateType<T extends PunchCardTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregatePunchCardTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePunchCardTemplate[P]>
      : GetScalarType<T[P], AggregatePunchCardTemplate[P]>
  }




  export type PunchCardTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PunchCardTemplateWhereInput
    orderBy?: PunchCardTemplateOrderByWithAggregationInput | PunchCardTemplateOrderByWithAggregationInput[]
    by: PunchCardTemplateScalarFieldEnum[] | PunchCardTemplateScalarFieldEnum
    having?: PunchCardTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PunchCardTemplateCountAggregateInputType | true
    _avg?: PunchCardTemplateAvgAggregateInputType
    _sum?: PunchCardTemplateSumAggregateInputType
    _min?: PunchCardTemplateMinAggregateInputType
    _max?: PunchCardTemplateMaxAggregateInputType
  }

  export type PunchCardTemplateGroupByOutputType = {
    id: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins: number | null
    payoutOptionIds: string[]
    audience: string[]
    active: boolean
    _count: PunchCardTemplateCountAggregateOutputType | null
    _avg: PunchCardTemplateAvgAggregateOutputType | null
    _sum: PunchCardTemplateSumAggregateOutputType | null
    _min: PunchCardTemplateMinAggregateOutputType | null
    _max: PunchCardTemplateMaxAggregateOutputType | null
  }

  type GetPunchCardTemplateGroupByPayload<T extends PunchCardTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PunchCardTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PunchCardTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PunchCardTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], PunchCardTemplateGroupByOutputType[P]>
        }
      >
    >


  export type PunchCardTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    glyph?: boolean
    goal?: boolean
    payoutKind?: boolean
    payoutCoins?: boolean
    payoutOptionIds?: boolean
    audience?: boolean
    active?: boolean
    cards?: boolean | PunchCardTemplate$cardsArgs<ExtArgs>
    _count?: boolean | PunchCardTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punchCardTemplate"]>

  export type PunchCardTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    glyph?: boolean
    goal?: boolean
    payoutKind?: boolean
    payoutCoins?: boolean
    payoutOptionIds?: boolean
    audience?: boolean
    active?: boolean
  }, ExtArgs["result"]["punchCardTemplate"]>

  export type PunchCardTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    glyph?: boolean
    goal?: boolean
    payoutKind?: boolean
    payoutCoins?: boolean
    payoutOptionIds?: boolean
    audience?: boolean
    active?: boolean
  }, ExtArgs["result"]["punchCardTemplate"]>

  export type PunchCardTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    glyph?: boolean
    goal?: boolean
    payoutKind?: boolean
    payoutCoins?: boolean
    payoutOptionIds?: boolean
    audience?: boolean
    active?: boolean
  }

  export type PunchCardTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "glyph" | "goal" | "payoutKind" | "payoutCoins" | "payoutOptionIds" | "audience" | "active", ExtArgs["result"]["punchCardTemplate"]>
  export type PunchCardTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cards?: boolean | PunchCardTemplate$cardsArgs<ExtArgs>
    _count?: boolean | PunchCardTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PunchCardTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PunchCardTemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PunchCardTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PunchCardTemplate"
    objects: {
      cards: Prisma.$PunchCardPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      glyph: string
      goal: number
      payoutKind: string
      payoutCoins: number | null
      payoutOptionIds: string[]
      audience: string[]
      active: boolean
    }, ExtArgs["result"]["punchCardTemplate"]>
    composites: {}
  }

  type PunchCardTemplateGetPayload<S extends boolean | null | undefined | PunchCardTemplateDefaultArgs> = $Result.GetResult<Prisma.$PunchCardTemplatePayload, S>

  type PunchCardTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PunchCardTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PunchCardTemplateCountAggregateInputType | true
    }

  export interface PunchCardTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PunchCardTemplate'], meta: { name: 'PunchCardTemplate' } }
    /**
     * Find zero or one PunchCardTemplate that matches the filter.
     * @param {PunchCardTemplateFindUniqueArgs} args - Arguments to find a PunchCardTemplate
     * @example
     * // Get one PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PunchCardTemplateFindUniqueArgs>(args: SelectSubset<T, PunchCardTemplateFindUniqueArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PunchCardTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PunchCardTemplateFindUniqueOrThrowArgs} args - Arguments to find a PunchCardTemplate
     * @example
     * // Get one PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PunchCardTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, PunchCardTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PunchCardTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateFindFirstArgs} args - Arguments to find a PunchCardTemplate
     * @example
     * // Get one PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PunchCardTemplateFindFirstArgs>(args?: SelectSubset<T, PunchCardTemplateFindFirstArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PunchCardTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateFindFirstOrThrowArgs} args - Arguments to find a PunchCardTemplate
     * @example
     * // Get one PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PunchCardTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, PunchCardTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PunchCardTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PunchCardTemplates
     * const punchCardTemplates = await prisma.punchCardTemplate.findMany()
     * 
     * // Get first 10 PunchCardTemplates
     * const punchCardTemplates = await prisma.punchCardTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const punchCardTemplateWithIdOnly = await prisma.punchCardTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PunchCardTemplateFindManyArgs>(args?: SelectSubset<T, PunchCardTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PunchCardTemplate.
     * @param {PunchCardTemplateCreateArgs} args - Arguments to create a PunchCardTemplate.
     * @example
     * // Create one PunchCardTemplate
     * const PunchCardTemplate = await prisma.punchCardTemplate.create({
     *   data: {
     *     // ... data to create a PunchCardTemplate
     *   }
     * })
     * 
     */
    create<T extends PunchCardTemplateCreateArgs>(args: SelectSubset<T, PunchCardTemplateCreateArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PunchCardTemplates.
     * @param {PunchCardTemplateCreateManyArgs} args - Arguments to create many PunchCardTemplates.
     * @example
     * // Create many PunchCardTemplates
     * const punchCardTemplate = await prisma.punchCardTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PunchCardTemplateCreateManyArgs>(args?: SelectSubset<T, PunchCardTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PunchCardTemplates and returns the data saved in the database.
     * @param {PunchCardTemplateCreateManyAndReturnArgs} args - Arguments to create many PunchCardTemplates.
     * @example
     * // Create many PunchCardTemplates
     * const punchCardTemplate = await prisma.punchCardTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PunchCardTemplates and only return the `id`
     * const punchCardTemplateWithIdOnly = await prisma.punchCardTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PunchCardTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, PunchCardTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PunchCardTemplate.
     * @param {PunchCardTemplateDeleteArgs} args - Arguments to delete one PunchCardTemplate.
     * @example
     * // Delete one PunchCardTemplate
     * const PunchCardTemplate = await prisma.punchCardTemplate.delete({
     *   where: {
     *     // ... filter to delete one PunchCardTemplate
     *   }
     * })
     * 
     */
    delete<T extends PunchCardTemplateDeleteArgs>(args: SelectSubset<T, PunchCardTemplateDeleteArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PunchCardTemplate.
     * @param {PunchCardTemplateUpdateArgs} args - Arguments to update one PunchCardTemplate.
     * @example
     * // Update one PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PunchCardTemplateUpdateArgs>(args: SelectSubset<T, PunchCardTemplateUpdateArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PunchCardTemplates.
     * @param {PunchCardTemplateDeleteManyArgs} args - Arguments to filter PunchCardTemplates to delete.
     * @example
     * // Delete a few PunchCardTemplates
     * const { count } = await prisma.punchCardTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PunchCardTemplateDeleteManyArgs>(args?: SelectSubset<T, PunchCardTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PunchCardTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PunchCardTemplates
     * const punchCardTemplate = await prisma.punchCardTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PunchCardTemplateUpdateManyArgs>(args: SelectSubset<T, PunchCardTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PunchCardTemplates and returns the data updated in the database.
     * @param {PunchCardTemplateUpdateManyAndReturnArgs} args - Arguments to update many PunchCardTemplates.
     * @example
     * // Update many PunchCardTemplates
     * const punchCardTemplate = await prisma.punchCardTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PunchCardTemplates and only return the `id`
     * const punchCardTemplateWithIdOnly = await prisma.punchCardTemplate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PunchCardTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, PunchCardTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PunchCardTemplate.
     * @param {PunchCardTemplateUpsertArgs} args - Arguments to update or create a PunchCardTemplate.
     * @example
     * // Update or create a PunchCardTemplate
     * const punchCardTemplate = await prisma.punchCardTemplate.upsert({
     *   create: {
     *     // ... data to create a PunchCardTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PunchCardTemplate we want to update
     *   }
     * })
     */
    upsert<T extends PunchCardTemplateUpsertArgs>(args: SelectSubset<T, PunchCardTemplateUpsertArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PunchCardTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateCountArgs} args - Arguments to filter PunchCardTemplates to count.
     * @example
     * // Count the number of PunchCardTemplates
     * const count = await prisma.punchCardTemplate.count({
     *   where: {
     *     // ... the filter for the PunchCardTemplates we want to count
     *   }
     * })
    **/
    count<T extends PunchCardTemplateCountArgs>(
      args?: Subset<T, PunchCardTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PunchCardTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PunchCardTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PunchCardTemplateAggregateArgs>(args: Subset<T, PunchCardTemplateAggregateArgs>): Prisma.PrismaPromise<GetPunchCardTemplateAggregateType<T>>

    /**
     * Group by PunchCardTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PunchCardTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PunchCardTemplateGroupByArgs['orderBy'] }
        : { orderBy?: PunchCardTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PunchCardTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPunchCardTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PunchCardTemplate model
   */
  readonly fields: PunchCardTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PunchCardTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PunchCardTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cards<T extends PunchCardTemplate$cardsArgs<ExtArgs> = {}>(args?: Subset<T, PunchCardTemplate$cardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PunchCardTemplate model
   */
  interface PunchCardTemplateFieldRefs {
    readonly id: FieldRef<"PunchCardTemplate", 'String'>
    readonly name: FieldRef<"PunchCardTemplate", 'String'>
    readonly glyph: FieldRef<"PunchCardTemplate", 'String'>
    readonly goal: FieldRef<"PunchCardTemplate", 'Int'>
    readonly payoutKind: FieldRef<"PunchCardTemplate", 'String'>
    readonly payoutCoins: FieldRef<"PunchCardTemplate", 'Int'>
    readonly payoutOptionIds: FieldRef<"PunchCardTemplate", 'String[]'>
    readonly audience: FieldRef<"PunchCardTemplate", 'String[]'>
    readonly active: FieldRef<"PunchCardTemplate", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * PunchCardTemplate findUnique
   */
  export type PunchCardTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter, which PunchCardTemplate to fetch.
     */
    where: PunchCardTemplateWhereUniqueInput
  }

  /**
   * PunchCardTemplate findUniqueOrThrow
   */
  export type PunchCardTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter, which PunchCardTemplate to fetch.
     */
    where: PunchCardTemplateWhereUniqueInput
  }

  /**
   * PunchCardTemplate findFirst
   */
  export type PunchCardTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter, which PunchCardTemplate to fetch.
     */
    where?: PunchCardTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCardTemplates to fetch.
     */
    orderBy?: PunchCardTemplateOrderByWithRelationInput | PunchCardTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PunchCardTemplates.
     */
    cursor?: PunchCardTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCardTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCardTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCardTemplates.
     */
    distinct?: PunchCardTemplateScalarFieldEnum | PunchCardTemplateScalarFieldEnum[]
  }

  /**
   * PunchCardTemplate findFirstOrThrow
   */
  export type PunchCardTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter, which PunchCardTemplate to fetch.
     */
    where?: PunchCardTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCardTemplates to fetch.
     */
    orderBy?: PunchCardTemplateOrderByWithRelationInput | PunchCardTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PunchCardTemplates.
     */
    cursor?: PunchCardTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCardTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCardTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCardTemplates.
     */
    distinct?: PunchCardTemplateScalarFieldEnum | PunchCardTemplateScalarFieldEnum[]
  }

  /**
   * PunchCardTemplate findMany
   */
  export type PunchCardTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter, which PunchCardTemplates to fetch.
     */
    where?: PunchCardTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCardTemplates to fetch.
     */
    orderBy?: PunchCardTemplateOrderByWithRelationInput | PunchCardTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PunchCardTemplates.
     */
    cursor?: PunchCardTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCardTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCardTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCardTemplates.
     */
    distinct?: PunchCardTemplateScalarFieldEnum | PunchCardTemplateScalarFieldEnum[]
  }

  /**
   * PunchCardTemplate create
   */
  export type PunchCardTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a PunchCardTemplate.
     */
    data: XOR<PunchCardTemplateCreateInput, PunchCardTemplateUncheckedCreateInput>
  }

  /**
   * PunchCardTemplate createMany
   */
  export type PunchCardTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PunchCardTemplates.
     */
    data: PunchCardTemplateCreateManyInput | PunchCardTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PunchCardTemplate createManyAndReturn
   */
  export type PunchCardTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many PunchCardTemplates.
     */
    data: PunchCardTemplateCreateManyInput | PunchCardTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PunchCardTemplate update
   */
  export type PunchCardTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a PunchCardTemplate.
     */
    data: XOR<PunchCardTemplateUpdateInput, PunchCardTemplateUncheckedUpdateInput>
    /**
     * Choose, which PunchCardTemplate to update.
     */
    where: PunchCardTemplateWhereUniqueInput
  }

  /**
   * PunchCardTemplate updateMany
   */
  export type PunchCardTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PunchCardTemplates.
     */
    data: XOR<PunchCardTemplateUpdateManyMutationInput, PunchCardTemplateUncheckedUpdateManyInput>
    /**
     * Filter which PunchCardTemplates to update
     */
    where?: PunchCardTemplateWhereInput
    /**
     * Limit how many PunchCardTemplates to update.
     */
    limit?: number
  }

  /**
   * PunchCardTemplate updateManyAndReturn
   */
  export type PunchCardTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * The data used to update PunchCardTemplates.
     */
    data: XOR<PunchCardTemplateUpdateManyMutationInput, PunchCardTemplateUncheckedUpdateManyInput>
    /**
     * Filter which PunchCardTemplates to update
     */
    where?: PunchCardTemplateWhereInput
    /**
     * Limit how many PunchCardTemplates to update.
     */
    limit?: number
  }

  /**
   * PunchCardTemplate upsert
   */
  export type PunchCardTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the PunchCardTemplate to update in case it exists.
     */
    where: PunchCardTemplateWhereUniqueInput
    /**
     * In case the PunchCardTemplate found by the `where` argument doesn't exist, create a new PunchCardTemplate with this data.
     */
    create: XOR<PunchCardTemplateCreateInput, PunchCardTemplateUncheckedCreateInput>
    /**
     * In case the PunchCardTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PunchCardTemplateUpdateInput, PunchCardTemplateUncheckedUpdateInput>
  }

  /**
   * PunchCardTemplate delete
   */
  export type PunchCardTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
    /**
     * Filter which PunchCardTemplate to delete.
     */
    where: PunchCardTemplateWhereUniqueInput
  }

  /**
   * PunchCardTemplate deleteMany
   */
  export type PunchCardTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PunchCardTemplates to delete
     */
    where?: PunchCardTemplateWhereInput
    /**
     * Limit how many PunchCardTemplates to delete.
     */
    limit?: number
  }

  /**
   * PunchCardTemplate.cards
   */
  export type PunchCardTemplate$cardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    where?: PunchCardWhereInput
    orderBy?: PunchCardOrderByWithRelationInput | PunchCardOrderByWithRelationInput[]
    cursor?: PunchCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PunchCardScalarFieldEnum | PunchCardScalarFieldEnum[]
  }

  /**
   * PunchCardTemplate without action
   */
  export type PunchCardTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCardTemplate
     */
    select?: PunchCardTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCardTemplate
     */
    omit?: PunchCardTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardTemplateInclude<ExtArgs> | null
  }


  /**
   * Model PunchCard
   */

  export type AggregatePunchCard = {
    _count: PunchCardCountAggregateOutputType | null
    _avg: PunchCardAvgAggregateOutputType | null
    _sum: PunchCardSumAggregateOutputType | null
    _min: PunchCardMinAggregateOutputType | null
    _max: PunchCardMaxAggregateOutputType | null
  }

  export type PunchCardAvgAggregateOutputType = {
    count: number | null
  }

  export type PunchCardSumAggregateOutputType = {
    count: number | null
  }

  export type PunchCardMinAggregateOutputType = {
    id: string | null
    templateId: string | null
    profileId: string | null
    count: number | null
    chosenRewardId: string | null
    completedAt: Date | null
    prizeClaimedAt: Date | null
    createdAt: Date | null
  }

  export type PunchCardMaxAggregateOutputType = {
    id: string | null
    templateId: string | null
    profileId: string | null
    count: number | null
    chosenRewardId: string | null
    completedAt: Date | null
    prizeClaimedAt: Date | null
    createdAt: Date | null
  }

  export type PunchCardCountAggregateOutputType = {
    id: number
    templateId: number
    profileId: number
    count: number
    chosenRewardId: number
    completedAt: number
    prizeClaimedAt: number
    createdAt: number
    _all: number
  }


  export type PunchCardAvgAggregateInputType = {
    count?: true
  }

  export type PunchCardSumAggregateInputType = {
    count?: true
  }

  export type PunchCardMinAggregateInputType = {
    id?: true
    templateId?: true
    profileId?: true
    count?: true
    chosenRewardId?: true
    completedAt?: true
    prizeClaimedAt?: true
    createdAt?: true
  }

  export type PunchCardMaxAggregateInputType = {
    id?: true
    templateId?: true
    profileId?: true
    count?: true
    chosenRewardId?: true
    completedAt?: true
    prizeClaimedAt?: true
    createdAt?: true
  }

  export type PunchCardCountAggregateInputType = {
    id?: true
    templateId?: true
    profileId?: true
    count?: true
    chosenRewardId?: true
    completedAt?: true
    prizeClaimedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PunchCardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PunchCard to aggregate.
     */
    where?: PunchCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCards to fetch.
     */
    orderBy?: PunchCardOrderByWithRelationInput | PunchCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PunchCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PunchCards
    **/
    _count?: true | PunchCardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PunchCardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PunchCardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PunchCardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PunchCardMaxAggregateInputType
  }

  export type GetPunchCardAggregateType<T extends PunchCardAggregateArgs> = {
        [P in keyof T & keyof AggregatePunchCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePunchCard[P]>
      : GetScalarType<T[P], AggregatePunchCard[P]>
  }




  export type PunchCardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PunchCardWhereInput
    orderBy?: PunchCardOrderByWithAggregationInput | PunchCardOrderByWithAggregationInput[]
    by: PunchCardScalarFieldEnum[] | PunchCardScalarFieldEnum
    having?: PunchCardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PunchCardCountAggregateInputType | true
    _avg?: PunchCardAvgAggregateInputType
    _sum?: PunchCardSumAggregateInputType
    _min?: PunchCardMinAggregateInputType
    _max?: PunchCardMaxAggregateInputType
  }

  export type PunchCardGroupByOutputType = {
    id: string
    templateId: string
    profileId: string
    count: number
    chosenRewardId: string | null
    completedAt: Date | null
    prizeClaimedAt: Date | null
    createdAt: Date
    _count: PunchCardCountAggregateOutputType | null
    _avg: PunchCardAvgAggregateOutputType | null
    _sum: PunchCardSumAggregateOutputType | null
    _min: PunchCardMinAggregateOutputType | null
    _max: PunchCardMaxAggregateOutputType | null
  }

  type GetPunchCardGroupByPayload<T extends PunchCardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PunchCardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PunchCardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PunchCardGroupByOutputType[P]>
            : GetScalarType<T[P], PunchCardGroupByOutputType[P]>
        }
      >
    >


  export type PunchCardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    profileId?: boolean
    count?: boolean
    chosenRewardId?: boolean
    completedAt?: boolean
    prizeClaimedAt?: boolean
    createdAt?: boolean
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
    punches?: boolean | PunchCard$punchesArgs<ExtArgs>
    _count?: boolean | PunchCardCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punchCard"]>

  export type PunchCardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    profileId?: boolean
    count?: boolean
    chosenRewardId?: boolean
    completedAt?: boolean
    prizeClaimedAt?: boolean
    createdAt?: boolean
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punchCard"]>

  export type PunchCardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    profileId?: boolean
    count?: boolean
    chosenRewardId?: boolean
    completedAt?: boolean
    prizeClaimedAt?: boolean
    createdAt?: boolean
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punchCard"]>

  export type PunchCardSelectScalar = {
    id?: boolean
    templateId?: boolean
    profileId?: boolean
    count?: boolean
    chosenRewardId?: boolean
    completedAt?: boolean
    prizeClaimedAt?: boolean
    createdAt?: boolean
  }

  export type PunchCardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "templateId" | "profileId" | "count" | "chosenRewardId" | "completedAt" | "prizeClaimedAt" | "createdAt", ExtArgs["result"]["punchCard"]>
  export type PunchCardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
    punches?: boolean | PunchCard$punchesArgs<ExtArgs>
    _count?: boolean | PunchCardCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PunchCardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
  }
  export type PunchCardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | PunchCardTemplateDefaultArgs<ExtArgs>
  }

  export type $PunchCardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PunchCard"
    objects: {
      template: Prisma.$PunchCardTemplatePayload<ExtArgs>
      punches: Prisma.$PunchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      templateId: string
      profileId: string
      count: number
      chosenRewardId: string | null
      completedAt: Date | null
      prizeClaimedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["punchCard"]>
    composites: {}
  }

  type PunchCardGetPayload<S extends boolean | null | undefined | PunchCardDefaultArgs> = $Result.GetResult<Prisma.$PunchCardPayload, S>

  type PunchCardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PunchCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PunchCardCountAggregateInputType | true
    }

  export interface PunchCardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PunchCard'], meta: { name: 'PunchCard' } }
    /**
     * Find zero or one PunchCard that matches the filter.
     * @param {PunchCardFindUniqueArgs} args - Arguments to find a PunchCard
     * @example
     * // Get one PunchCard
     * const punchCard = await prisma.punchCard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PunchCardFindUniqueArgs>(args: SelectSubset<T, PunchCardFindUniqueArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PunchCard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PunchCardFindUniqueOrThrowArgs} args - Arguments to find a PunchCard
     * @example
     * // Get one PunchCard
     * const punchCard = await prisma.punchCard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PunchCardFindUniqueOrThrowArgs>(args: SelectSubset<T, PunchCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PunchCard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardFindFirstArgs} args - Arguments to find a PunchCard
     * @example
     * // Get one PunchCard
     * const punchCard = await prisma.punchCard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PunchCardFindFirstArgs>(args?: SelectSubset<T, PunchCardFindFirstArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PunchCard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardFindFirstOrThrowArgs} args - Arguments to find a PunchCard
     * @example
     * // Get one PunchCard
     * const punchCard = await prisma.punchCard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PunchCardFindFirstOrThrowArgs>(args?: SelectSubset<T, PunchCardFindFirstOrThrowArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PunchCards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PunchCards
     * const punchCards = await prisma.punchCard.findMany()
     * 
     * // Get first 10 PunchCards
     * const punchCards = await prisma.punchCard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const punchCardWithIdOnly = await prisma.punchCard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PunchCardFindManyArgs>(args?: SelectSubset<T, PunchCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PunchCard.
     * @param {PunchCardCreateArgs} args - Arguments to create a PunchCard.
     * @example
     * // Create one PunchCard
     * const PunchCard = await prisma.punchCard.create({
     *   data: {
     *     // ... data to create a PunchCard
     *   }
     * })
     * 
     */
    create<T extends PunchCardCreateArgs>(args: SelectSubset<T, PunchCardCreateArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PunchCards.
     * @param {PunchCardCreateManyArgs} args - Arguments to create many PunchCards.
     * @example
     * // Create many PunchCards
     * const punchCard = await prisma.punchCard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PunchCardCreateManyArgs>(args?: SelectSubset<T, PunchCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PunchCards and returns the data saved in the database.
     * @param {PunchCardCreateManyAndReturnArgs} args - Arguments to create many PunchCards.
     * @example
     * // Create many PunchCards
     * const punchCard = await prisma.punchCard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PunchCards and only return the `id`
     * const punchCardWithIdOnly = await prisma.punchCard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PunchCardCreateManyAndReturnArgs>(args?: SelectSubset<T, PunchCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PunchCard.
     * @param {PunchCardDeleteArgs} args - Arguments to delete one PunchCard.
     * @example
     * // Delete one PunchCard
     * const PunchCard = await prisma.punchCard.delete({
     *   where: {
     *     // ... filter to delete one PunchCard
     *   }
     * })
     * 
     */
    delete<T extends PunchCardDeleteArgs>(args: SelectSubset<T, PunchCardDeleteArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PunchCard.
     * @param {PunchCardUpdateArgs} args - Arguments to update one PunchCard.
     * @example
     * // Update one PunchCard
     * const punchCard = await prisma.punchCard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PunchCardUpdateArgs>(args: SelectSubset<T, PunchCardUpdateArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PunchCards.
     * @param {PunchCardDeleteManyArgs} args - Arguments to filter PunchCards to delete.
     * @example
     * // Delete a few PunchCards
     * const { count } = await prisma.punchCard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PunchCardDeleteManyArgs>(args?: SelectSubset<T, PunchCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PunchCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PunchCards
     * const punchCard = await prisma.punchCard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PunchCardUpdateManyArgs>(args: SelectSubset<T, PunchCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PunchCards and returns the data updated in the database.
     * @param {PunchCardUpdateManyAndReturnArgs} args - Arguments to update many PunchCards.
     * @example
     * // Update many PunchCards
     * const punchCard = await prisma.punchCard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PunchCards and only return the `id`
     * const punchCardWithIdOnly = await prisma.punchCard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PunchCardUpdateManyAndReturnArgs>(args: SelectSubset<T, PunchCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PunchCard.
     * @param {PunchCardUpsertArgs} args - Arguments to update or create a PunchCard.
     * @example
     * // Update or create a PunchCard
     * const punchCard = await prisma.punchCard.upsert({
     *   create: {
     *     // ... data to create a PunchCard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PunchCard we want to update
     *   }
     * })
     */
    upsert<T extends PunchCardUpsertArgs>(args: SelectSubset<T, PunchCardUpsertArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PunchCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardCountArgs} args - Arguments to filter PunchCards to count.
     * @example
     * // Count the number of PunchCards
     * const count = await prisma.punchCard.count({
     *   where: {
     *     // ... the filter for the PunchCards we want to count
     *   }
     * })
    **/
    count<T extends PunchCardCountArgs>(
      args?: Subset<T, PunchCardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PunchCardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PunchCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PunchCardAggregateArgs>(args: Subset<T, PunchCardAggregateArgs>): Prisma.PrismaPromise<GetPunchCardAggregateType<T>>

    /**
     * Group by PunchCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PunchCardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PunchCardGroupByArgs['orderBy'] }
        : { orderBy?: PunchCardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PunchCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPunchCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PunchCard model
   */
  readonly fields: PunchCardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PunchCard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PunchCardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends PunchCardTemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PunchCardTemplateDefaultArgs<ExtArgs>>): Prisma__PunchCardTemplateClient<$Result.GetResult<Prisma.$PunchCardTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    punches<T extends PunchCard$punchesArgs<ExtArgs> = {}>(args?: Subset<T, PunchCard$punchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PunchCard model
   */
  interface PunchCardFieldRefs {
    readonly id: FieldRef<"PunchCard", 'String'>
    readonly templateId: FieldRef<"PunchCard", 'String'>
    readonly profileId: FieldRef<"PunchCard", 'String'>
    readonly count: FieldRef<"PunchCard", 'Int'>
    readonly chosenRewardId: FieldRef<"PunchCard", 'String'>
    readonly completedAt: FieldRef<"PunchCard", 'DateTime'>
    readonly prizeClaimedAt: FieldRef<"PunchCard", 'DateTime'>
    readonly createdAt: FieldRef<"PunchCard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PunchCard findUnique
   */
  export type PunchCardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter, which PunchCard to fetch.
     */
    where: PunchCardWhereUniqueInput
  }

  /**
   * PunchCard findUniqueOrThrow
   */
  export type PunchCardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter, which PunchCard to fetch.
     */
    where: PunchCardWhereUniqueInput
  }

  /**
   * PunchCard findFirst
   */
  export type PunchCardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter, which PunchCard to fetch.
     */
    where?: PunchCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCards to fetch.
     */
    orderBy?: PunchCardOrderByWithRelationInput | PunchCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PunchCards.
     */
    cursor?: PunchCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCards.
     */
    distinct?: PunchCardScalarFieldEnum | PunchCardScalarFieldEnum[]
  }

  /**
   * PunchCard findFirstOrThrow
   */
  export type PunchCardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter, which PunchCard to fetch.
     */
    where?: PunchCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCards to fetch.
     */
    orderBy?: PunchCardOrderByWithRelationInput | PunchCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PunchCards.
     */
    cursor?: PunchCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCards.
     */
    distinct?: PunchCardScalarFieldEnum | PunchCardScalarFieldEnum[]
  }

  /**
   * PunchCard findMany
   */
  export type PunchCardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter, which PunchCards to fetch.
     */
    where?: PunchCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PunchCards to fetch.
     */
    orderBy?: PunchCardOrderByWithRelationInput | PunchCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PunchCards.
     */
    cursor?: PunchCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PunchCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PunchCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PunchCards.
     */
    distinct?: PunchCardScalarFieldEnum | PunchCardScalarFieldEnum[]
  }

  /**
   * PunchCard create
   */
  export type PunchCardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * The data needed to create a PunchCard.
     */
    data: XOR<PunchCardCreateInput, PunchCardUncheckedCreateInput>
  }

  /**
   * PunchCard createMany
   */
  export type PunchCardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PunchCards.
     */
    data: PunchCardCreateManyInput | PunchCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PunchCard createManyAndReturn
   */
  export type PunchCardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * The data used to create many PunchCards.
     */
    data: PunchCardCreateManyInput | PunchCardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PunchCard update
   */
  export type PunchCardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * The data needed to update a PunchCard.
     */
    data: XOR<PunchCardUpdateInput, PunchCardUncheckedUpdateInput>
    /**
     * Choose, which PunchCard to update.
     */
    where: PunchCardWhereUniqueInput
  }

  /**
   * PunchCard updateMany
   */
  export type PunchCardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PunchCards.
     */
    data: XOR<PunchCardUpdateManyMutationInput, PunchCardUncheckedUpdateManyInput>
    /**
     * Filter which PunchCards to update
     */
    where?: PunchCardWhereInput
    /**
     * Limit how many PunchCards to update.
     */
    limit?: number
  }

  /**
   * PunchCard updateManyAndReturn
   */
  export type PunchCardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * The data used to update PunchCards.
     */
    data: XOR<PunchCardUpdateManyMutationInput, PunchCardUncheckedUpdateManyInput>
    /**
     * Filter which PunchCards to update
     */
    where?: PunchCardWhereInput
    /**
     * Limit how many PunchCards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PunchCard upsert
   */
  export type PunchCardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * The filter to search for the PunchCard to update in case it exists.
     */
    where: PunchCardWhereUniqueInput
    /**
     * In case the PunchCard found by the `where` argument doesn't exist, create a new PunchCard with this data.
     */
    create: XOR<PunchCardCreateInput, PunchCardUncheckedCreateInput>
    /**
     * In case the PunchCard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PunchCardUpdateInput, PunchCardUncheckedUpdateInput>
  }

  /**
   * PunchCard delete
   */
  export type PunchCardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
    /**
     * Filter which PunchCard to delete.
     */
    where: PunchCardWhereUniqueInput
  }

  /**
   * PunchCard deleteMany
   */
  export type PunchCardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PunchCards to delete
     */
    where?: PunchCardWhereInput
    /**
     * Limit how many PunchCards to delete.
     */
    limit?: number
  }

  /**
   * PunchCard.punches
   */
  export type PunchCard$punchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    where?: PunchWhereInput
    orderBy?: PunchOrderByWithRelationInput | PunchOrderByWithRelationInput[]
    cursor?: PunchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PunchScalarFieldEnum | PunchScalarFieldEnum[]
  }

  /**
   * PunchCard without action
   */
  export type PunchCardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PunchCard
     */
    select?: PunchCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PunchCard
     */
    omit?: PunchCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchCardInclude<ExtArgs> | null
  }


  /**
   * Model Punch
   */

  export type AggregatePunch = {
    _count: PunchCountAggregateOutputType | null
    _min: PunchMinAggregateOutputType | null
    _max: PunchMaxAggregateOutputType | null
  }

  export type PunchMinAggregateOutputType = {
    id: string | null
    cardId: string | null
    sourceType: string | null
    sourceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type PunchMaxAggregateOutputType = {
    id: string | null
    cardId: string | null
    sourceType: string | null
    sourceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type PunchCountAggregateOutputType = {
    id: number
    cardId: number
    sourceType: number
    sourceId: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type PunchMinAggregateInputType = {
    id?: true
    cardId?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type PunchMaxAggregateInputType = {
    id?: true
    cardId?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type PunchCountAggregateInputType = {
    id?: true
    cardId?: true
    sourceType?: true
    sourceId?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type PunchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Punch to aggregate.
     */
    where?: PunchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Punches to fetch.
     */
    orderBy?: PunchOrderByWithRelationInput | PunchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PunchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Punches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Punches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Punches
    **/
    _count?: true | PunchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PunchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PunchMaxAggregateInputType
  }

  export type GetPunchAggregateType<T extends PunchAggregateArgs> = {
        [P in keyof T & keyof AggregatePunch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePunch[P]>
      : GetScalarType<T[P], AggregatePunch[P]>
  }




  export type PunchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PunchWhereInput
    orderBy?: PunchOrderByWithAggregationInput | PunchOrderByWithAggregationInput[]
    by: PunchScalarFieldEnum[] | PunchScalarFieldEnum
    having?: PunchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PunchCountAggregateInputType | true
    _min?: PunchMinAggregateInputType
    _max?: PunchMaxAggregateInputType
  }

  export type PunchGroupByOutputType = {
    id: string
    cardId: string
    sourceType: string
    sourceId: string | null
    createdBy: string
    createdAt: Date
    _count: PunchCountAggregateOutputType | null
    _min: PunchMinAggregateOutputType | null
    _max: PunchMaxAggregateOutputType | null
  }

  type GetPunchGroupByPayload<T extends PunchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PunchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PunchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PunchGroupByOutputType[P]>
            : GetScalarType<T[P], PunchGroupByOutputType[P]>
        }
      >
    >


  export type PunchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punch"]>

  export type PunchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punch"]>

  export type PunchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["punch"]>

  export type PunchSelectScalar = {
    id?: boolean
    cardId?: boolean
    sourceType?: boolean
    sourceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type PunchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cardId" | "sourceType" | "sourceId" | "createdBy" | "createdAt", ExtArgs["result"]["punch"]>
  export type PunchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }
  export type PunchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }
  export type PunchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    card?: boolean | PunchCardDefaultArgs<ExtArgs>
  }

  export type $PunchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Punch"
    objects: {
      card: Prisma.$PunchCardPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cardId: string
      sourceType: string
      sourceId: string | null
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["punch"]>
    composites: {}
  }

  type PunchGetPayload<S extends boolean | null | undefined | PunchDefaultArgs> = $Result.GetResult<Prisma.$PunchPayload, S>

  type PunchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PunchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PunchCountAggregateInputType | true
    }

  export interface PunchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Punch'], meta: { name: 'Punch' } }
    /**
     * Find zero or one Punch that matches the filter.
     * @param {PunchFindUniqueArgs} args - Arguments to find a Punch
     * @example
     * // Get one Punch
     * const punch = await prisma.punch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PunchFindUniqueArgs>(args: SelectSubset<T, PunchFindUniqueArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Punch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PunchFindUniqueOrThrowArgs} args - Arguments to find a Punch
     * @example
     * // Get one Punch
     * const punch = await prisma.punch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PunchFindUniqueOrThrowArgs>(args: SelectSubset<T, PunchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Punch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchFindFirstArgs} args - Arguments to find a Punch
     * @example
     * // Get one Punch
     * const punch = await prisma.punch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PunchFindFirstArgs>(args?: SelectSubset<T, PunchFindFirstArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Punch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchFindFirstOrThrowArgs} args - Arguments to find a Punch
     * @example
     * // Get one Punch
     * const punch = await prisma.punch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PunchFindFirstOrThrowArgs>(args?: SelectSubset<T, PunchFindFirstOrThrowArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Punches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Punches
     * const punches = await prisma.punch.findMany()
     * 
     * // Get first 10 Punches
     * const punches = await prisma.punch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const punchWithIdOnly = await prisma.punch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PunchFindManyArgs>(args?: SelectSubset<T, PunchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Punch.
     * @param {PunchCreateArgs} args - Arguments to create a Punch.
     * @example
     * // Create one Punch
     * const Punch = await prisma.punch.create({
     *   data: {
     *     // ... data to create a Punch
     *   }
     * })
     * 
     */
    create<T extends PunchCreateArgs>(args: SelectSubset<T, PunchCreateArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Punches.
     * @param {PunchCreateManyArgs} args - Arguments to create many Punches.
     * @example
     * // Create many Punches
     * const punch = await prisma.punch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PunchCreateManyArgs>(args?: SelectSubset<T, PunchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Punches and returns the data saved in the database.
     * @param {PunchCreateManyAndReturnArgs} args - Arguments to create many Punches.
     * @example
     * // Create many Punches
     * const punch = await prisma.punch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Punches and only return the `id`
     * const punchWithIdOnly = await prisma.punch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PunchCreateManyAndReturnArgs>(args?: SelectSubset<T, PunchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Punch.
     * @param {PunchDeleteArgs} args - Arguments to delete one Punch.
     * @example
     * // Delete one Punch
     * const Punch = await prisma.punch.delete({
     *   where: {
     *     // ... filter to delete one Punch
     *   }
     * })
     * 
     */
    delete<T extends PunchDeleteArgs>(args: SelectSubset<T, PunchDeleteArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Punch.
     * @param {PunchUpdateArgs} args - Arguments to update one Punch.
     * @example
     * // Update one Punch
     * const punch = await prisma.punch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PunchUpdateArgs>(args: SelectSubset<T, PunchUpdateArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Punches.
     * @param {PunchDeleteManyArgs} args - Arguments to filter Punches to delete.
     * @example
     * // Delete a few Punches
     * const { count } = await prisma.punch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PunchDeleteManyArgs>(args?: SelectSubset<T, PunchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Punches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Punches
     * const punch = await prisma.punch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PunchUpdateManyArgs>(args: SelectSubset<T, PunchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Punches and returns the data updated in the database.
     * @param {PunchUpdateManyAndReturnArgs} args - Arguments to update many Punches.
     * @example
     * // Update many Punches
     * const punch = await prisma.punch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Punches and only return the `id`
     * const punchWithIdOnly = await prisma.punch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PunchUpdateManyAndReturnArgs>(args: SelectSubset<T, PunchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Punch.
     * @param {PunchUpsertArgs} args - Arguments to update or create a Punch.
     * @example
     * // Update or create a Punch
     * const punch = await prisma.punch.upsert({
     *   create: {
     *     // ... data to create a Punch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Punch we want to update
     *   }
     * })
     */
    upsert<T extends PunchUpsertArgs>(args: SelectSubset<T, PunchUpsertArgs<ExtArgs>>): Prisma__PunchClient<$Result.GetResult<Prisma.$PunchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Punches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchCountArgs} args - Arguments to filter Punches to count.
     * @example
     * // Count the number of Punches
     * const count = await prisma.punch.count({
     *   where: {
     *     // ... the filter for the Punches we want to count
     *   }
     * })
    **/
    count<T extends PunchCountArgs>(
      args?: Subset<T, PunchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PunchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Punch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PunchAggregateArgs>(args: Subset<T, PunchAggregateArgs>): Prisma.PrismaPromise<GetPunchAggregateType<T>>

    /**
     * Group by Punch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PunchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PunchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PunchGroupByArgs['orderBy'] }
        : { orderBy?: PunchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PunchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPunchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Punch model
   */
  readonly fields: PunchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Punch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PunchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    card<T extends PunchCardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PunchCardDefaultArgs<ExtArgs>>): Prisma__PunchCardClient<$Result.GetResult<Prisma.$PunchCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Punch model
   */
  interface PunchFieldRefs {
    readonly id: FieldRef<"Punch", 'String'>
    readonly cardId: FieldRef<"Punch", 'String'>
    readonly sourceType: FieldRef<"Punch", 'String'>
    readonly sourceId: FieldRef<"Punch", 'String'>
    readonly createdBy: FieldRef<"Punch", 'String'>
    readonly createdAt: FieldRef<"Punch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Punch findUnique
   */
  export type PunchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter, which Punch to fetch.
     */
    where: PunchWhereUniqueInput
  }

  /**
   * Punch findUniqueOrThrow
   */
  export type PunchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter, which Punch to fetch.
     */
    where: PunchWhereUniqueInput
  }

  /**
   * Punch findFirst
   */
  export type PunchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter, which Punch to fetch.
     */
    where?: PunchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Punches to fetch.
     */
    orderBy?: PunchOrderByWithRelationInput | PunchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Punches.
     */
    cursor?: PunchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Punches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Punches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Punches.
     */
    distinct?: PunchScalarFieldEnum | PunchScalarFieldEnum[]
  }

  /**
   * Punch findFirstOrThrow
   */
  export type PunchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter, which Punch to fetch.
     */
    where?: PunchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Punches to fetch.
     */
    orderBy?: PunchOrderByWithRelationInput | PunchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Punches.
     */
    cursor?: PunchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Punches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Punches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Punches.
     */
    distinct?: PunchScalarFieldEnum | PunchScalarFieldEnum[]
  }

  /**
   * Punch findMany
   */
  export type PunchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter, which Punches to fetch.
     */
    where?: PunchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Punches to fetch.
     */
    orderBy?: PunchOrderByWithRelationInput | PunchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Punches.
     */
    cursor?: PunchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Punches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Punches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Punches.
     */
    distinct?: PunchScalarFieldEnum | PunchScalarFieldEnum[]
  }

  /**
   * Punch create
   */
  export type PunchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * The data needed to create a Punch.
     */
    data: XOR<PunchCreateInput, PunchUncheckedCreateInput>
  }

  /**
   * Punch createMany
   */
  export type PunchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Punches.
     */
    data: PunchCreateManyInput | PunchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Punch createManyAndReturn
   */
  export type PunchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * The data used to create many Punches.
     */
    data: PunchCreateManyInput | PunchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Punch update
   */
  export type PunchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * The data needed to update a Punch.
     */
    data: XOR<PunchUpdateInput, PunchUncheckedUpdateInput>
    /**
     * Choose, which Punch to update.
     */
    where: PunchWhereUniqueInput
  }

  /**
   * Punch updateMany
   */
  export type PunchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Punches.
     */
    data: XOR<PunchUpdateManyMutationInput, PunchUncheckedUpdateManyInput>
    /**
     * Filter which Punches to update
     */
    where?: PunchWhereInput
    /**
     * Limit how many Punches to update.
     */
    limit?: number
  }

  /**
   * Punch updateManyAndReturn
   */
  export type PunchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * The data used to update Punches.
     */
    data: XOR<PunchUpdateManyMutationInput, PunchUncheckedUpdateManyInput>
    /**
     * Filter which Punches to update
     */
    where?: PunchWhereInput
    /**
     * Limit how many Punches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Punch upsert
   */
  export type PunchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * The filter to search for the Punch to update in case it exists.
     */
    where: PunchWhereUniqueInput
    /**
     * In case the Punch found by the `where` argument doesn't exist, create a new Punch with this data.
     */
    create: XOR<PunchCreateInput, PunchUncheckedCreateInput>
    /**
     * In case the Punch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PunchUpdateInput, PunchUncheckedUpdateInput>
  }

  /**
   * Punch delete
   */
  export type PunchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
    /**
     * Filter which Punch to delete.
     */
    where: PunchWhereUniqueInput
  }

  /**
   * Punch deleteMany
   */
  export type PunchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Punches to delete
     */
    where?: PunchWhereInput
    /**
     * Limit how many Punches to delete.
     */
    limit?: number
  }

  /**
   * Punch without action
   */
  export type PunchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Punch
     */
    select?: PunchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Punch
     */
    omit?: PunchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PunchInclude<ExtArgs> | null
  }


  /**
   * Model Redemption
   */

  export type AggregateRedemption = {
    _count: RedemptionCountAggregateOutputType | null
    _avg: RedemptionAvgAggregateOutputType | null
    _sum: RedemptionSumAggregateOutputType | null
    _min: RedemptionMinAggregateOutputType | null
    _max: RedemptionMaxAggregateOutputType | null
  }

  export type RedemptionAvgAggregateOutputType = {
    cost: number | null
  }

  export type RedemptionSumAggregateOutputType = {
    cost: number | null
  }

  export type RedemptionMinAggregateOutputType = {
    id: string | null
    rewardId: string | null
    profileId: string | null
    cost: number | null
    status: string | null
    purchasedAt: Date | null
    useRequestedAt: Date | null
    usedAt: Date | null
    decidedBy: string | null
    decidedAt: Date | null
    decidedNote: string | null
  }

  export type RedemptionMaxAggregateOutputType = {
    id: string | null
    rewardId: string | null
    profileId: string | null
    cost: number | null
    status: string | null
    purchasedAt: Date | null
    useRequestedAt: Date | null
    usedAt: Date | null
    decidedBy: string | null
    decidedAt: Date | null
    decidedNote: string | null
  }

  export type RedemptionCountAggregateOutputType = {
    id: number
    rewardId: number
    profileId: number
    cost: number
    status: number
    purchasedAt: number
    useRequestedAt: number
    usedAt: number
    decidedBy: number
    decidedAt: number
    decidedNote: number
    _all: number
  }


  export type RedemptionAvgAggregateInputType = {
    cost?: true
  }

  export type RedemptionSumAggregateInputType = {
    cost?: true
  }

  export type RedemptionMinAggregateInputType = {
    id?: true
    rewardId?: true
    profileId?: true
    cost?: true
    status?: true
    purchasedAt?: true
    useRequestedAt?: true
    usedAt?: true
    decidedBy?: true
    decidedAt?: true
    decidedNote?: true
  }

  export type RedemptionMaxAggregateInputType = {
    id?: true
    rewardId?: true
    profileId?: true
    cost?: true
    status?: true
    purchasedAt?: true
    useRequestedAt?: true
    usedAt?: true
    decidedBy?: true
    decidedAt?: true
    decidedNote?: true
  }

  export type RedemptionCountAggregateInputType = {
    id?: true
    rewardId?: true
    profileId?: true
    cost?: true
    status?: true
    purchasedAt?: true
    useRequestedAt?: true
    usedAt?: true
    decidedBy?: true
    decidedAt?: true
    decidedNote?: true
    _all?: true
  }

  export type RedemptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Redemption to aggregate.
     */
    where?: RedemptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Redemptions to fetch.
     */
    orderBy?: RedemptionOrderByWithRelationInput | RedemptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RedemptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Redemptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Redemptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Redemptions
    **/
    _count?: true | RedemptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RedemptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RedemptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RedemptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RedemptionMaxAggregateInputType
  }

  export type GetRedemptionAggregateType<T extends RedemptionAggregateArgs> = {
        [P in keyof T & keyof AggregateRedemption]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRedemption[P]>
      : GetScalarType<T[P], AggregateRedemption[P]>
  }




  export type RedemptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RedemptionWhereInput
    orderBy?: RedemptionOrderByWithAggregationInput | RedemptionOrderByWithAggregationInput[]
    by: RedemptionScalarFieldEnum[] | RedemptionScalarFieldEnum
    having?: RedemptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RedemptionCountAggregateInputType | true
    _avg?: RedemptionAvgAggregateInputType
    _sum?: RedemptionSumAggregateInputType
    _min?: RedemptionMinAggregateInputType
    _max?: RedemptionMaxAggregateInputType
  }

  export type RedemptionGroupByOutputType = {
    id: string
    rewardId: string
    profileId: string
    cost: number
    status: string
    purchasedAt: Date
    useRequestedAt: Date | null
    usedAt: Date | null
    decidedBy: string | null
    decidedAt: Date | null
    decidedNote: string | null
    _count: RedemptionCountAggregateOutputType | null
    _avg: RedemptionAvgAggregateOutputType | null
    _sum: RedemptionSumAggregateOutputType | null
    _min: RedemptionMinAggregateOutputType | null
    _max: RedemptionMaxAggregateOutputType | null
  }

  type GetRedemptionGroupByPayload<T extends RedemptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RedemptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RedemptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RedemptionGroupByOutputType[P]>
            : GetScalarType<T[P], RedemptionGroupByOutputType[P]>
        }
      >
    >


  export type RedemptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rewardId?: boolean
    profileId?: boolean
    cost?: boolean
    status?: boolean
    purchasedAt?: boolean
    useRequestedAt?: boolean
    usedAt?: boolean
    decidedBy?: boolean
    decidedAt?: boolean
    decidedNote?: boolean
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["redemption"]>

  export type RedemptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rewardId?: boolean
    profileId?: boolean
    cost?: boolean
    status?: boolean
    purchasedAt?: boolean
    useRequestedAt?: boolean
    usedAt?: boolean
    decidedBy?: boolean
    decidedAt?: boolean
    decidedNote?: boolean
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["redemption"]>

  export type RedemptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rewardId?: boolean
    profileId?: boolean
    cost?: boolean
    status?: boolean
    purchasedAt?: boolean
    useRequestedAt?: boolean
    usedAt?: boolean
    decidedBy?: boolean
    decidedAt?: boolean
    decidedNote?: boolean
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["redemption"]>

  export type RedemptionSelectScalar = {
    id?: boolean
    rewardId?: boolean
    profileId?: boolean
    cost?: boolean
    status?: boolean
    purchasedAt?: boolean
    useRequestedAt?: boolean
    usedAt?: boolean
    decidedBy?: boolean
    decidedAt?: boolean
    decidedNote?: boolean
  }

  export type RedemptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rewardId" | "profileId" | "cost" | "status" | "purchasedAt" | "useRequestedAt" | "usedAt" | "decidedBy" | "decidedAt" | "decidedNote", ExtArgs["result"]["redemption"]>
  export type RedemptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }
  export type RedemptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }
  export type RedemptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reward?: boolean | RewardDefaultArgs<ExtArgs>
  }

  export type $RedemptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Redemption"
    objects: {
      reward: Prisma.$RewardPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rewardId: string
      profileId: string
      cost: number
      status: string
      purchasedAt: Date
      useRequestedAt: Date | null
      usedAt: Date | null
      decidedBy: string | null
      decidedAt: Date | null
      decidedNote: string | null
    }, ExtArgs["result"]["redemption"]>
    composites: {}
  }

  type RedemptionGetPayload<S extends boolean | null | undefined | RedemptionDefaultArgs> = $Result.GetResult<Prisma.$RedemptionPayload, S>

  type RedemptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RedemptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RedemptionCountAggregateInputType | true
    }

  export interface RedemptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Redemption'], meta: { name: 'Redemption' } }
    /**
     * Find zero or one Redemption that matches the filter.
     * @param {RedemptionFindUniqueArgs} args - Arguments to find a Redemption
     * @example
     * // Get one Redemption
     * const redemption = await prisma.redemption.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RedemptionFindUniqueArgs>(args: SelectSubset<T, RedemptionFindUniqueArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Redemption that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RedemptionFindUniqueOrThrowArgs} args - Arguments to find a Redemption
     * @example
     * // Get one Redemption
     * const redemption = await prisma.redemption.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RedemptionFindUniqueOrThrowArgs>(args: SelectSubset<T, RedemptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Redemption that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionFindFirstArgs} args - Arguments to find a Redemption
     * @example
     * // Get one Redemption
     * const redemption = await prisma.redemption.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RedemptionFindFirstArgs>(args?: SelectSubset<T, RedemptionFindFirstArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Redemption that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionFindFirstOrThrowArgs} args - Arguments to find a Redemption
     * @example
     * // Get one Redemption
     * const redemption = await prisma.redemption.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RedemptionFindFirstOrThrowArgs>(args?: SelectSubset<T, RedemptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Redemptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Redemptions
     * const redemptions = await prisma.redemption.findMany()
     * 
     * // Get first 10 Redemptions
     * const redemptions = await prisma.redemption.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const redemptionWithIdOnly = await prisma.redemption.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RedemptionFindManyArgs>(args?: SelectSubset<T, RedemptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Redemption.
     * @param {RedemptionCreateArgs} args - Arguments to create a Redemption.
     * @example
     * // Create one Redemption
     * const Redemption = await prisma.redemption.create({
     *   data: {
     *     // ... data to create a Redemption
     *   }
     * })
     * 
     */
    create<T extends RedemptionCreateArgs>(args: SelectSubset<T, RedemptionCreateArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Redemptions.
     * @param {RedemptionCreateManyArgs} args - Arguments to create many Redemptions.
     * @example
     * // Create many Redemptions
     * const redemption = await prisma.redemption.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RedemptionCreateManyArgs>(args?: SelectSubset<T, RedemptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Redemptions and returns the data saved in the database.
     * @param {RedemptionCreateManyAndReturnArgs} args - Arguments to create many Redemptions.
     * @example
     * // Create many Redemptions
     * const redemption = await prisma.redemption.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Redemptions and only return the `id`
     * const redemptionWithIdOnly = await prisma.redemption.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RedemptionCreateManyAndReturnArgs>(args?: SelectSubset<T, RedemptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Redemption.
     * @param {RedemptionDeleteArgs} args - Arguments to delete one Redemption.
     * @example
     * // Delete one Redemption
     * const Redemption = await prisma.redemption.delete({
     *   where: {
     *     // ... filter to delete one Redemption
     *   }
     * })
     * 
     */
    delete<T extends RedemptionDeleteArgs>(args: SelectSubset<T, RedemptionDeleteArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Redemption.
     * @param {RedemptionUpdateArgs} args - Arguments to update one Redemption.
     * @example
     * // Update one Redemption
     * const redemption = await prisma.redemption.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RedemptionUpdateArgs>(args: SelectSubset<T, RedemptionUpdateArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Redemptions.
     * @param {RedemptionDeleteManyArgs} args - Arguments to filter Redemptions to delete.
     * @example
     * // Delete a few Redemptions
     * const { count } = await prisma.redemption.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RedemptionDeleteManyArgs>(args?: SelectSubset<T, RedemptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Redemptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Redemptions
     * const redemption = await prisma.redemption.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RedemptionUpdateManyArgs>(args: SelectSubset<T, RedemptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Redemptions and returns the data updated in the database.
     * @param {RedemptionUpdateManyAndReturnArgs} args - Arguments to update many Redemptions.
     * @example
     * // Update many Redemptions
     * const redemption = await prisma.redemption.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Redemptions and only return the `id`
     * const redemptionWithIdOnly = await prisma.redemption.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RedemptionUpdateManyAndReturnArgs>(args: SelectSubset<T, RedemptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Redemption.
     * @param {RedemptionUpsertArgs} args - Arguments to update or create a Redemption.
     * @example
     * // Update or create a Redemption
     * const redemption = await prisma.redemption.upsert({
     *   create: {
     *     // ... data to create a Redemption
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Redemption we want to update
     *   }
     * })
     */
    upsert<T extends RedemptionUpsertArgs>(args: SelectSubset<T, RedemptionUpsertArgs<ExtArgs>>): Prisma__RedemptionClient<$Result.GetResult<Prisma.$RedemptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Redemptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCountArgs} args - Arguments to filter Redemptions to count.
     * @example
     * // Count the number of Redemptions
     * const count = await prisma.redemption.count({
     *   where: {
     *     // ... the filter for the Redemptions we want to count
     *   }
     * })
    **/
    count<T extends RedemptionCountArgs>(
      args?: Subset<T, RedemptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RedemptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Redemption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RedemptionAggregateArgs>(args: Subset<T, RedemptionAggregateArgs>): Prisma.PrismaPromise<GetRedemptionAggregateType<T>>

    /**
     * Group by Redemption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RedemptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RedemptionGroupByArgs['orderBy'] }
        : { orderBy?: RedemptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RedemptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRedemptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Redemption model
   */
  readonly fields: RedemptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Redemption.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RedemptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reward<T extends RewardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RewardDefaultArgs<ExtArgs>>): Prisma__RewardClient<$Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Redemption model
   */
  interface RedemptionFieldRefs {
    readonly id: FieldRef<"Redemption", 'String'>
    readonly rewardId: FieldRef<"Redemption", 'String'>
    readonly profileId: FieldRef<"Redemption", 'String'>
    readonly cost: FieldRef<"Redemption", 'Int'>
    readonly status: FieldRef<"Redemption", 'String'>
    readonly purchasedAt: FieldRef<"Redemption", 'DateTime'>
    readonly useRequestedAt: FieldRef<"Redemption", 'DateTime'>
    readonly usedAt: FieldRef<"Redemption", 'DateTime'>
    readonly decidedBy: FieldRef<"Redemption", 'String'>
    readonly decidedAt: FieldRef<"Redemption", 'DateTime'>
    readonly decidedNote: FieldRef<"Redemption", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Redemption findUnique
   */
  export type RedemptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter, which Redemption to fetch.
     */
    where: RedemptionWhereUniqueInput
  }

  /**
   * Redemption findUniqueOrThrow
   */
  export type RedemptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter, which Redemption to fetch.
     */
    where: RedemptionWhereUniqueInput
  }

  /**
   * Redemption findFirst
   */
  export type RedemptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter, which Redemption to fetch.
     */
    where?: RedemptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Redemptions to fetch.
     */
    orderBy?: RedemptionOrderByWithRelationInput | RedemptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Redemptions.
     */
    cursor?: RedemptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Redemptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Redemptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Redemptions.
     */
    distinct?: RedemptionScalarFieldEnum | RedemptionScalarFieldEnum[]
  }

  /**
   * Redemption findFirstOrThrow
   */
  export type RedemptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter, which Redemption to fetch.
     */
    where?: RedemptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Redemptions to fetch.
     */
    orderBy?: RedemptionOrderByWithRelationInput | RedemptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Redemptions.
     */
    cursor?: RedemptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Redemptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Redemptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Redemptions.
     */
    distinct?: RedemptionScalarFieldEnum | RedemptionScalarFieldEnum[]
  }

  /**
   * Redemption findMany
   */
  export type RedemptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter, which Redemptions to fetch.
     */
    where?: RedemptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Redemptions to fetch.
     */
    orderBy?: RedemptionOrderByWithRelationInput | RedemptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Redemptions.
     */
    cursor?: RedemptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Redemptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Redemptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Redemptions.
     */
    distinct?: RedemptionScalarFieldEnum | RedemptionScalarFieldEnum[]
  }

  /**
   * Redemption create
   */
  export type RedemptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Redemption.
     */
    data: XOR<RedemptionCreateInput, RedemptionUncheckedCreateInput>
  }

  /**
   * Redemption createMany
   */
  export type RedemptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Redemptions.
     */
    data: RedemptionCreateManyInput | RedemptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Redemption createManyAndReturn
   */
  export type RedemptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * The data used to create many Redemptions.
     */
    data: RedemptionCreateManyInput | RedemptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Redemption update
   */
  export type RedemptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Redemption.
     */
    data: XOR<RedemptionUpdateInput, RedemptionUncheckedUpdateInput>
    /**
     * Choose, which Redemption to update.
     */
    where: RedemptionWhereUniqueInput
  }

  /**
   * Redemption updateMany
   */
  export type RedemptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Redemptions.
     */
    data: XOR<RedemptionUpdateManyMutationInput, RedemptionUncheckedUpdateManyInput>
    /**
     * Filter which Redemptions to update
     */
    where?: RedemptionWhereInput
    /**
     * Limit how many Redemptions to update.
     */
    limit?: number
  }

  /**
   * Redemption updateManyAndReturn
   */
  export type RedemptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * The data used to update Redemptions.
     */
    data: XOR<RedemptionUpdateManyMutationInput, RedemptionUncheckedUpdateManyInput>
    /**
     * Filter which Redemptions to update
     */
    where?: RedemptionWhereInput
    /**
     * Limit how many Redemptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Redemption upsert
   */
  export type RedemptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Redemption to update in case it exists.
     */
    where: RedemptionWhereUniqueInput
    /**
     * In case the Redemption found by the `where` argument doesn't exist, create a new Redemption with this data.
     */
    create: XOR<RedemptionCreateInput, RedemptionUncheckedCreateInput>
    /**
     * In case the Redemption was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RedemptionUpdateInput, RedemptionUncheckedUpdateInput>
  }

  /**
   * Redemption delete
   */
  export type RedemptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
    /**
     * Filter which Redemption to delete.
     */
    where: RedemptionWhereUniqueInput
  }

  /**
   * Redemption deleteMany
   */
  export type RedemptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Redemptions to delete
     */
    where?: RedemptionWhereInput
    /**
     * Limit how many Redemptions to delete.
     */
    limit?: number
  }

  /**
   * Redemption without action
   */
  export type RedemptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Redemption
     */
    select?: RedemptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Redemption
     */
    omit?: RedemptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LedgerEntryScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    delta: 'delta',
    reason: 'reason',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type LedgerEntryScalarFieldEnum = (typeof LedgerEntryScalarFieldEnum)[keyof typeof LedgerEntryScalarFieldEnum]


  export const BalanceScalarFieldEnum: {
    profileId: 'profileId',
    balance: 'balance',
    updatedAt: 'updatedAt'
  };

  export type BalanceScalarFieldEnum = (typeof BalanceScalarFieldEnum)[keyof typeof BalanceScalarFieldEnum]


  export const PendingPayoutScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    amount: 'amount',
    reason: 'reason',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    status: 'status',
    decidedBy: 'decidedBy',
    decidedNote: 'decidedNote',
    decidedAt: 'decidedAt',
    createdAt: 'createdAt'
  };

  export type PendingPayoutScalarFieldEnum = (typeof PendingPayoutScalarFieldEnum)[keyof typeof PendingPayoutScalarFieldEnum]


  export const RewardScalarFieldEnum: {
    id: 'id',
    name: 'name',
    emoji: 'emoji',
    description: 'description',
    cost: 'cost',
    requiresApproval: 'requiresApproval',
    audience: 'audience',
    stock: 'stock',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type RewardScalarFieldEnum = (typeof RewardScalarFieldEnum)[keyof typeof RewardScalarFieldEnum]


  export const PunchCardTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    glyph: 'glyph',
    goal: 'goal',
    payoutKind: 'payoutKind',
    payoutCoins: 'payoutCoins',
    payoutOptionIds: 'payoutOptionIds',
    audience: 'audience',
    active: 'active'
  };

  export type PunchCardTemplateScalarFieldEnum = (typeof PunchCardTemplateScalarFieldEnum)[keyof typeof PunchCardTemplateScalarFieldEnum]


  export const PunchCardScalarFieldEnum: {
    id: 'id',
    templateId: 'templateId',
    profileId: 'profileId',
    count: 'count',
    chosenRewardId: 'chosenRewardId',
    completedAt: 'completedAt',
    prizeClaimedAt: 'prizeClaimedAt',
    createdAt: 'createdAt'
  };

  export type PunchCardScalarFieldEnum = (typeof PunchCardScalarFieldEnum)[keyof typeof PunchCardScalarFieldEnum]


  export const PunchScalarFieldEnum: {
    id: 'id',
    cardId: 'cardId',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type PunchScalarFieldEnum = (typeof PunchScalarFieldEnum)[keyof typeof PunchScalarFieldEnum]


  export const RedemptionScalarFieldEnum: {
    id: 'id',
    rewardId: 'rewardId',
    profileId: 'profileId',
    cost: 'cost',
    status: 'status',
    purchasedAt: 'purchasedAt',
    useRequestedAt: 'useRequestedAt',
    usedAt: 'usedAt',
    decidedBy: 'decidedBy',
    decidedAt: 'decidedAt',
    decidedNote: 'decidedNote'
  };

  export type RedemptionScalarFieldEnum = (typeof RedemptionScalarFieldEnum)[keyof typeof RedemptionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type LedgerEntryWhereInput = {
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    id?: UuidFilter<"LedgerEntry"> | string
    profileId?: UuidFilter<"LedgerEntry"> | string
    delta?: IntFilter<"LedgerEntry"> | number
    reason?: StringFilter<"LedgerEntry"> | string
    sourceType?: StringFilter<"LedgerEntry"> | string
    sourceId?: StringNullableFilter<"LedgerEntry"> | string | null
    createdBy?: UuidNullableFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
  }

  export type LedgerEntryOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceType_sourceId?: LedgerEntrySourceTypeSourceIdCompoundUniqueInput
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    profileId?: UuidFilter<"LedgerEntry"> | string
    delta?: IntFilter<"LedgerEntry"> | number
    reason?: StringFilter<"LedgerEntry"> | string
    sourceType?: StringFilter<"LedgerEntry"> | string
    sourceId?: StringNullableFilter<"LedgerEntry"> | string | null
    createdBy?: UuidNullableFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
  }, "id" | "sourceType_sourceId">

  export type LedgerEntryOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LedgerEntryCountOrderByAggregateInput
    _avg?: LedgerEntryAvgOrderByAggregateInput
    _max?: LedgerEntryMaxOrderByAggregateInput
    _min?: LedgerEntryMinOrderByAggregateInput
    _sum?: LedgerEntrySumOrderByAggregateInput
  }

  export type LedgerEntryScalarWhereWithAggregatesInput = {
    AND?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    OR?: LedgerEntryScalarWhereWithAggregatesInput[]
    NOT?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"LedgerEntry"> | string
    profileId?: UuidWithAggregatesFilter<"LedgerEntry"> | string
    delta?: IntWithAggregatesFilter<"LedgerEntry"> | number
    reason?: StringWithAggregatesFilter<"LedgerEntry"> | string
    sourceType?: StringWithAggregatesFilter<"LedgerEntry"> | string
    sourceId?: StringNullableWithAggregatesFilter<"LedgerEntry"> | string | null
    createdBy?: UuidNullableWithAggregatesFilter<"LedgerEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LedgerEntry"> | Date | string
  }

  export type BalanceWhereInput = {
    AND?: BalanceWhereInput | BalanceWhereInput[]
    OR?: BalanceWhereInput[]
    NOT?: BalanceWhereInput | BalanceWhereInput[]
    profileId?: UuidFilter<"Balance"> | string
    balance?: IntFilter<"Balance"> | number
    updatedAt?: DateTimeFilter<"Balance"> | Date | string
  }

  export type BalanceOrderByWithRelationInput = {
    profileId?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type BalanceWhereUniqueInput = Prisma.AtLeast<{
    profileId?: string
    AND?: BalanceWhereInput | BalanceWhereInput[]
    OR?: BalanceWhereInput[]
    NOT?: BalanceWhereInput | BalanceWhereInput[]
    balance?: IntFilter<"Balance"> | number
    updatedAt?: DateTimeFilter<"Balance"> | Date | string
  }, "profileId">

  export type BalanceOrderByWithAggregationInput = {
    profileId?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
    _count?: BalanceCountOrderByAggregateInput
    _avg?: BalanceAvgOrderByAggregateInput
    _max?: BalanceMaxOrderByAggregateInput
    _min?: BalanceMinOrderByAggregateInput
    _sum?: BalanceSumOrderByAggregateInput
  }

  export type BalanceScalarWhereWithAggregatesInput = {
    AND?: BalanceScalarWhereWithAggregatesInput | BalanceScalarWhereWithAggregatesInput[]
    OR?: BalanceScalarWhereWithAggregatesInput[]
    NOT?: BalanceScalarWhereWithAggregatesInput | BalanceScalarWhereWithAggregatesInput[]
    profileId?: UuidWithAggregatesFilter<"Balance"> | string
    balance?: IntWithAggregatesFilter<"Balance"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"Balance"> | Date | string
  }

  export type PendingPayoutWhereInput = {
    AND?: PendingPayoutWhereInput | PendingPayoutWhereInput[]
    OR?: PendingPayoutWhereInput[]
    NOT?: PendingPayoutWhereInput | PendingPayoutWhereInput[]
    id?: UuidFilter<"PendingPayout"> | string
    profileId?: UuidFilter<"PendingPayout"> | string
    amount?: IntFilter<"PendingPayout"> | number
    reason?: StringFilter<"PendingPayout"> | string
    sourceType?: StringFilter<"PendingPayout"> | string
    sourceId?: StringFilter<"PendingPayout"> | string
    status?: StringFilter<"PendingPayout"> | string
    decidedBy?: UuidNullableFilter<"PendingPayout"> | string | null
    decidedNote?: StringNullableFilter<"PendingPayout"> | string | null
    decidedAt?: DateTimeNullableFilter<"PendingPayout"> | Date | string | null
    createdAt?: DateTimeFilter<"PendingPayout"> | Date | string
  }

  export type PendingPayoutOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    amount?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    decidedBy?: SortOrderInput | SortOrder
    decidedNote?: SortOrderInput | SortOrder
    decidedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type PendingPayoutWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceType_sourceId?: PendingPayoutSourceTypeSourceIdCompoundUniqueInput
    AND?: PendingPayoutWhereInput | PendingPayoutWhereInput[]
    OR?: PendingPayoutWhereInput[]
    NOT?: PendingPayoutWhereInput | PendingPayoutWhereInput[]
    profileId?: UuidFilter<"PendingPayout"> | string
    amount?: IntFilter<"PendingPayout"> | number
    reason?: StringFilter<"PendingPayout"> | string
    sourceType?: StringFilter<"PendingPayout"> | string
    sourceId?: StringFilter<"PendingPayout"> | string
    status?: StringFilter<"PendingPayout"> | string
    decidedBy?: UuidNullableFilter<"PendingPayout"> | string | null
    decidedNote?: StringNullableFilter<"PendingPayout"> | string | null
    decidedAt?: DateTimeNullableFilter<"PendingPayout"> | Date | string | null
    createdAt?: DateTimeFilter<"PendingPayout"> | Date | string
  }, "id" | "sourceType_sourceId">

  export type PendingPayoutOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    amount?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    decidedBy?: SortOrderInput | SortOrder
    decidedNote?: SortOrderInput | SortOrder
    decidedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PendingPayoutCountOrderByAggregateInput
    _avg?: PendingPayoutAvgOrderByAggregateInput
    _max?: PendingPayoutMaxOrderByAggregateInput
    _min?: PendingPayoutMinOrderByAggregateInput
    _sum?: PendingPayoutSumOrderByAggregateInput
  }

  export type PendingPayoutScalarWhereWithAggregatesInput = {
    AND?: PendingPayoutScalarWhereWithAggregatesInput | PendingPayoutScalarWhereWithAggregatesInput[]
    OR?: PendingPayoutScalarWhereWithAggregatesInput[]
    NOT?: PendingPayoutScalarWhereWithAggregatesInput | PendingPayoutScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PendingPayout"> | string
    profileId?: UuidWithAggregatesFilter<"PendingPayout"> | string
    amount?: IntWithAggregatesFilter<"PendingPayout"> | number
    reason?: StringWithAggregatesFilter<"PendingPayout"> | string
    sourceType?: StringWithAggregatesFilter<"PendingPayout"> | string
    sourceId?: StringWithAggregatesFilter<"PendingPayout"> | string
    status?: StringWithAggregatesFilter<"PendingPayout"> | string
    decidedBy?: UuidNullableWithAggregatesFilter<"PendingPayout"> | string | null
    decidedNote?: StringNullableWithAggregatesFilter<"PendingPayout"> | string | null
    decidedAt?: DateTimeNullableWithAggregatesFilter<"PendingPayout"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PendingPayout"> | Date | string
  }

  export type RewardWhereInput = {
    AND?: RewardWhereInput | RewardWhereInput[]
    OR?: RewardWhereInput[]
    NOT?: RewardWhereInput | RewardWhereInput[]
    id?: UuidFilter<"Reward"> | string
    name?: StringFilter<"Reward"> | string
    emoji?: StringFilter<"Reward"> | string
    description?: StringNullableFilter<"Reward"> | string | null
    cost?: IntFilter<"Reward"> | number
    requiresApproval?: BoolFilter<"Reward"> | boolean
    audience?: StringNullableListFilter<"Reward">
    stock?: IntNullableFilter<"Reward"> | number | null
    active?: BoolFilter<"Reward"> | boolean
    createdBy?: UuidFilter<"Reward"> | string
    createdAt?: DateTimeFilter<"Reward"> | Date | string
    redemptions?: RedemptionListRelationFilter
  }

  export type RewardOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    description?: SortOrderInput | SortOrder
    cost?: SortOrder
    requiresApproval?: SortOrder
    audience?: SortOrder
    stock?: SortOrderInput | SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    redemptions?: RedemptionOrderByRelationAggregateInput
  }

  export type RewardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RewardWhereInput | RewardWhereInput[]
    OR?: RewardWhereInput[]
    NOT?: RewardWhereInput | RewardWhereInput[]
    name?: StringFilter<"Reward"> | string
    emoji?: StringFilter<"Reward"> | string
    description?: StringNullableFilter<"Reward"> | string | null
    cost?: IntFilter<"Reward"> | number
    requiresApproval?: BoolFilter<"Reward"> | boolean
    audience?: StringNullableListFilter<"Reward">
    stock?: IntNullableFilter<"Reward"> | number | null
    active?: BoolFilter<"Reward"> | boolean
    createdBy?: UuidFilter<"Reward"> | string
    createdAt?: DateTimeFilter<"Reward"> | Date | string
    redemptions?: RedemptionListRelationFilter
  }, "id">

  export type RewardOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    description?: SortOrderInput | SortOrder
    cost?: SortOrder
    requiresApproval?: SortOrder
    audience?: SortOrder
    stock?: SortOrderInput | SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: RewardCountOrderByAggregateInput
    _avg?: RewardAvgOrderByAggregateInput
    _max?: RewardMaxOrderByAggregateInput
    _min?: RewardMinOrderByAggregateInput
    _sum?: RewardSumOrderByAggregateInput
  }

  export type RewardScalarWhereWithAggregatesInput = {
    AND?: RewardScalarWhereWithAggregatesInput | RewardScalarWhereWithAggregatesInput[]
    OR?: RewardScalarWhereWithAggregatesInput[]
    NOT?: RewardScalarWhereWithAggregatesInput | RewardScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Reward"> | string
    name?: StringWithAggregatesFilter<"Reward"> | string
    emoji?: StringWithAggregatesFilter<"Reward"> | string
    description?: StringNullableWithAggregatesFilter<"Reward"> | string | null
    cost?: IntWithAggregatesFilter<"Reward"> | number
    requiresApproval?: BoolWithAggregatesFilter<"Reward"> | boolean
    audience?: StringNullableListFilter<"Reward">
    stock?: IntNullableWithAggregatesFilter<"Reward"> | number | null
    active?: BoolWithAggregatesFilter<"Reward"> | boolean
    createdBy?: UuidWithAggregatesFilter<"Reward"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Reward"> | Date | string
  }

  export type PunchCardTemplateWhereInput = {
    AND?: PunchCardTemplateWhereInput | PunchCardTemplateWhereInput[]
    OR?: PunchCardTemplateWhereInput[]
    NOT?: PunchCardTemplateWhereInput | PunchCardTemplateWhereInput[]
    id?: UuidFilter<"PunchCardTemplate"> | string
    name?: StringFilter<"PunchCardTemplate"> | string
    glyph?: StringFilter<"PunchCardTemplate"> | string
    goal?: IntFilter<"PunchCardTemplate"> | number
    payoutKind?: StringFilter<"PunchCardTemplate"> | string
    payoutCoins?: IntNullableFilter<"PunchCardTemplate"> | number | null
    payoutOptionIds?: StringNullableListFilter<"PunchCardTemplate">
    audience?: StringNullableListFilter<"PunchCardTemplate">
    active?: BoolFilter<"PunchCardTemplate"> | boolean
    cards?: PunchCardListRelationFilter
  }

  export type PunchCardTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    glyph?: SortOrder
    goal?: SortOrder
    payoutKind?: SortOrder
    payoutCoins?: SortOrderInput | SortOrder
    payoutOptionIds?: SortOrder
    audience?: SortOrder
    active?: SortOrder
    cards?: PunchCardOrderByRelationAggregateInput
  }

  export type PunchCardTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PunchCardTemplateWhereInput | PunchCardTemplateWhereInput[]
    OR?: PunchCardTemplateWhereInput[]
    NOT?: PunchCardTemplateWhereInput | PunchCardTemplateWhereInput[]
    name?: StringFilter<"PunchCardTemplate"> | string
    glyph?: StringFilter<"PunchCardTemplate"> | string
    goal?: IntFilter<"PunchCardTemplate"> | number
    payoutKind?: StringFilter<"PunchCardTemplate"> | string
    payoutCoins?: IntNullableFilter<"PunchCardTemplate"> | number | null
    payoutOptionIds?: StringNullableListFilter<"PunchCardTemplate">
    audience?: StringNullableListFilter<"PunchCardTemplate">
    active?: BoolFilter<"PunchCardTemplate"> | boolean
    cards?: PunchCardListRelationFilter
  }, "id">

  export type PunchCardTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    glyph?: SortOrder
    goal?: SortOrder
    payoutKind?: SortOrder
    payoutCoins?: SortOrderInput | SortOrder
    payoutOptionIds?: SortOrder
    audience?: SortOrder
    active?: SortOrder
    _count?: PunchCardTemplateCountOrderByAggregateInput
    _avg?: PunchCardTemplateAvgOrderByAggregateInput
    _max?: PunchCardTemplateMaxOrderByAggregateInput
    _min?: PunchCardTemplateMinOrderByAggregateInput
    _sum?: PunchCardTemplateSumOrderByAggregateInput
  }

  export type PunchCardTemplateScalarWhereWithAggregatesInput = {
    AND?: PunchCardTemplateScalarWhereWithAggregatesInput | PunchCardTemplateScalarWhereWithAggregatesInput[]
    OR?: PunchCardTemplateScalarWhereWithAggregatesInput[]
    NOT?: PunchCardTemplateScalarWhereWithAggregatesInput | PunchCardTemplateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PunchCardTemplate"> | string
    name?: StringWithAggregatesFilter<"PunchCardTemplate"> | string
    glyph?: StringWithAggregatesFilter<"PunchCardTemplate"> | string
    goal?: IntWithAggregatesFilter<"PunchCardTemplate"> | number
    payoutKind?: StringWithAggregatesFilter<"PunchCardTemplate"> | string
    payoutCoins?: IntNullableWithAggregatesFilter<"PunchCardTemplate"> | number | null
    payoutOptionIds?: StringNullableListFilter<"PunchCardTemplate">
    audience?: StringNullableListFilter<"PunchCardTemplate">
    active?: BoolWithAggregatesFilter<"PunchCardTemplate"> | boolean
  }

  export type PunchCardWhereInput = {
    AND?: PunchCardWhereInput | PunchCardWhereInput[]
    OR?: PunchCardWhereInput[]
    NOT?: PunchCardWhereInput | PunchCardWhereInput[]
    id?: UuidFilter<"PunchCard"> | string
    templateId?: UuidFilter<"PunchCard"> | string
    profileId?: UuidFilter<"PunchCard"> | string
    count?: IntFilter<"PunchCard"> | number
    chosenRewardId?: UuidNullableFilter<"PunchCard"> | string | null
    completedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    prizeClaimedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    createdAt?: DateTimeFilter<"PunchCard"> | Date | string
    template?: XOR<PunchCardTemplateScalarRelationFilter, PunchCardTemplateWhereInput>
    punches?: PunchListRelationFilter
  }

  export type PunchCardOrderByWithRelationInput = {
    id?: SortOrder
    templateId?: SortOrder
    profileId?: SortOrder
    count?: SortOrder
    chosenRewardId?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    prizeClaimedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    template?: PunchCardTemplateOrderByWithRelationInput
    punches?: PunchOrderByRelationAggregateInput
  }

  export type PunchCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PunchCardWhereInput | PunchCardWhereInput[]
    OR?: PunchCardWhereInput[]
    NOT?: PunchCardWhereInput | PunchCardWhereInput[]
    templateId?: UuidFilter<"PunchCard"> | string
    profileId?: UuidFilter<"PunchCard"> | string
    count?: IntFilter<"PunchCard"> | number
    chosenRewardId?: UuidNullableFilter<"PunchCard"> | string | null
    completedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    prizeClaimedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    createdAt?: DateTimeFilter<"PunchCard"> | Date | string
    template?: XOR<PunchCardTemplateScalarRelationFilter, PunchCardTemplateWhereInput>
    punches?: PunchListRelationFilter
  }, "id">

  export type PunchCardOrderByWithAggregationInput = {
    id?: SortOrder
    templateId?: SortOrder
    profileId?: SortOrder
    count?: SortOrder
    chosenRewardId?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    prizeClaimedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PunchCardCountOrderByAggregateInput
    _avg?: PunchCardAvgOrderByAggregateInput
    _max?: PunchCardMaxOrderByAggregateInput
    _min?: PunchCardMinOrderByAggregateInput
    _sum?: PunchCardSumOrderByAggregateInput
  }

  export type PunchCardScalarWhereWithAggregatesInput = {
    AND?: PunchCardScalarWhereWithAggregatesInput | PunchCardScalarWhereWithAggregatesInput[]
    OR?: PunchCardScalarWhereWithAggregatesInput[]
    NOT?: PunchCardScalarWhereWithAggregatesInput | PunchCardScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PunchCard"> | string
    templateId?: UuidWithAggregatesFilter<"PunchCard"> | string
    profileId?: UuidWithAggregatesFilter<"PunchCard"> | string
    count?: IntWithAggregatesFilter<"PunchCard"> | number
    chosenRewardId?: UuidNullableWithAggregatesFilter<"PunchCard"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"PunchCard"> | Date | string | null
    prizeClaimedAt?: DateTimeNullableWithAggregatesFilter<"PunchCard"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PunchCard"> | Date | string
  }

  export type PunchWhereInput = {
    AND?: PunchWhereInput | PunchWhereInput[]
    OR?: PunchWhereInput[]
    NOT?: PunchWhereInput | PunchWhereInput[]
    id?: UuidFilter<"Punch"> | string
    cardId?: UuidFilter<"Punch"> | string
    sourceType?: StringFilter<"Punch"> | string
    sourceId?: StringNullableFilter<"Punch"> | string | null
    createdBy?: UuidFilter<"Punch"> | string
    createdAt?: DateTimeFilter<"Punch"> | Date | string
    card?: XOR<PunchCardScalarRelationFilter, PunchCardWhereInput>
  }

  export type PunchOrderByWithRelationInput = {
    id?: SortOrder
    cardId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    card?: PunchCardOrderByWithRelationInput
  }

  export type PunchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceType_sourceId?: PunchSourceTypeSourceIdCompoundUniqueInput
    AND?: PunchWhereInput | PunchWhereInput[]
    OR?: PunchWhereInput[]
    NOT?: PunchWhereInput | PunchWhereInput[]
    cardId?: UuidFilter<"Punch"> | string
    sourceType?: StringFilter<"Punch"> | string
    sourceId?: StringNullableFilter<"Punch"> | string | null
    createdBy?: UuidFilter<"Punch"> | string
    createdAt?: DateTimeFilter<"Punch"> | Date | string
    card?: XOR<PunchCardScalarRelationFilter, PunchCardWhereInput>
  }, "id" | "sourceType_sourceId">

  export type PunchOrderByWithAggregationInput = {
    id?: SortOrder
    cardId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: PunchCountOrderByAggregateInput
    _max?: PunchMaxOrderByAggregateInput
    _min?: PunchMinOrderByAggregateInput
  }

  export type PunchScalarWhereWithAggregatesInput = {
    AND?: PunchScalarWhereWithAggregatesInput | PunchScalarWhereWithAggregatesInput[]
    OR?: PunchScalarWhereWithAggregatesInput[]
    NOT?: PunchScalarWhereWithAggregatesInput | PunchScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Punch"> | string
    cardId?: UuidWithAggregatesFilter<"Punch"> | string
    sourceType?: StringWithAggregatesFilter<"Punch"> | string
    sourceId?: StringNullableWithAggregatesFilter<"Punch"> | string | null
    createdBy?: UuidWithAggregatesFilter<"Punch"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Punch"> | Date | string
  }

  export type RedemptionWhereInput = {
    AND?: RedemptionWhereInput | RedemptionWhereInput[]
    OR?: RedemptionWhereInput[]
    NOT?: RedemptionWhereInput | RedemptionWhereInput[]
    id?: UuidFilter<"Redemption"> | string
    rewardId?: UuidFilter<"Redemption"> | string
    profileId?: UuidFilter<"Redemption"> | string
    cost?: IntFilter<"Redemption"> | number
    status?: StringFilter<"Redemption"> | string
    purchasedAt?: DateTimeFilter<"Redemption"> | Date | string
    useRequestedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    usedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedBy?: UuidNullableFilter<"Redemption"> | string | null
    decidedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedNote?: StringNullableFilter<"Redemption"> | string | null
    reward?: XOR<RewardScalarRelationFilter, RewardWhereInput>
  }

  export type RedemptionOrderByWithRelationInput = {
    id?: SortOrder
    rewardId?: SortOrder
    profileId?: SortOrder
    cost?: SortOrder
    status?: SortOrder
    purchasedAt?: SortOrder
    useRequestedAt?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
    decidedBy?: SortOrderInput | SortOrder
    decidedAt?: SortOrderInput | SortOrder
    decidedNote?: SortOrderInput | SortOrder
    reward?: RewardOrderByWithRelationInput
  }

  export type RedemptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RedemptionWhereInput | RedemptionWhereInput[]
    OR?: RedemptionWhereInput[]
    NOT?: RedemptionWhereInput | RedemptionWhereInput[]
    rewardId?: UuidFilter<"Redemption"> | string
    profileId?: UuidFilter<"Redemption"> | string
    cost?: IntFilter<"Redemption"> | number
    status?: StringFilter<"Redemption"> | string
    purchasedAt?: DateTimeFilter<"Redemption"> | Date | string
    useRequestedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    usedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedBy?: UuidNullableFilter<"Redemption"> | string | null
    decidedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedNote?: StringNullableFilter<"Redemption"> | string | null
    reward?: XOR<RewardScalarRelationFilter, RewardWhereInput>
  }, "id">

  export type RedemptionOrderByWithAggregationInput = {
    id?: SortOrder
    rewardId?: SortOrder
    profileId?: SortOrder
    cost?: SortOrder
    status?: SortOrder
    purchasedAt?: SortOrder
    useRequestedAt?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
    decidedBy?: SortOrderInput | SortOrder
    decidedAt?: SortOrderInput | SortOrder
    decidedNote?: SortOrderInput | SortOrder
    _count?: RedemptionCountOrderByAggregateInput
    _avg?: RedemptionAvgOrderByAggregateInput
    _max?: RedemptionMaxOrderByAggregateInput
    _min?: RedemptionMinOrderByAggregateInput
    _sum?: RedemptionSumOrderByAggregateInput
  }

  export type RedemptionScalarWhereWithAggregatesInput = {
    AND?: RedemptionScalarWhereWithAggregatesInput | RedemptionScalarWhereWithAggregatesInput[]
    OR?: RedemptionScalarWhereWithAggregatesInput[]
    NOT?: RedemptionScalarWhereWithAggregatesInput | RedemptionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Redemption"> | string
    rewardId?: UuidWithAggregatesFilter<"Redemption"> | string
    profileId?: UuidWithAggregatesFilter<"Redemption"> | string
    cost?: IntWithAggregatesFilter<"Redemption"> | number
    status?: StringWithAggregatesFilter<"Redemption"> | string
    purchasedAt?: DateTimeWithAggregatesFilter<"Redemption"> | Date | string
    useRequestedAt?: DateTimeNullableWithAggregatesFilter<"Redemption"> | Date | string | null
    usedAt?: DateTimeNullableWithAggregatesFilter<"Redemption"> | Date | string | null
    decidedBy?: UuidNullableWithAggregatesFilter<"Redemption"> | string | null
    decidedAt?: DateTimeNullableWithAggregatesFilter<"Redemption"> | Date | string | null
    decidedNote?: StringNullableWithAggregatesFilter<"Redemption"> | string | null
  }

  export type LedgerEntryCreateInput = {
    id?: string
    profileId: string
    delta: number
    reason: string
    sourceType: string
    sourceId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUncheckedCreateInput = {
    id?: string
    profileId: string
    delta: number
    reason: string
    sourceType: string
    sourceId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    delta?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    delta?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryCreateManyInput = {
    id?: string
    profileId: string
    delta: number
    reason: string
    sourceType: string
    sourceId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type LedgerEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    delta?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    delta?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BalanceCreateInput = {
    profileId: string
    balance?: number
    updatedAt?: Date | string
  }

  export type BalanceUncheckedCreateInput = {
    profileId: string
    balance?: number
    updatedAt?: Date | string
  }

  export type BalanceUpdateInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BalanceUncheckedUpdateInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BalanceCreateManyInput = {
    profileId: string
    balance?: number
    updatedAt?: Date | string
  }

  export type BalanceUpdateManyMutationInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BalanceUncheckedUpdateManyInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingPayoutCreateInput = {
    id?: string
    profileId: string
    amount: number
    reason: string
    sourceType: string
    sourceId: string
    status?: string
    decidedBy?: string | null
    decidedNote?: string | null
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PendingPayoutUncheckedCreateInput = {
    id?: string
    profileId: string
    amount: number
    reason: string
    sourceType: string
    sourceId: string
    status?: string
    decidedBy?: string | null
    decidedNote?: string | null
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PendingPayoutUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingPayoutUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingPayoutCreateManyInput = {
    id?: string
    profileId: string
    amount: number
    reason: string
    sourceType: string
    sourceId: string
    status?: string
    decidedBy?: string | null
    decidedNote?: string | null
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PendingPayoutUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingPayoutUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardCreateInput = {
    id?: string
    name: string
    emoji: string
    description?: string | null
    cost: number
    requiresApproval?: boolean
    audience?: RewardCreateaudienceInput | string[]
    stock?: number | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    redemptions?: RedemptionCreateNestedManyWithoutRewardInput
  }

  export type RewardUncheckedCreateInput = {
    id?: string
    name: string
    emoji: string
    description?: string | null
    cost: number
    requiresApproval?: boolean
    audience?: RewardCreateaudienceInput | string[]
    stock?: number | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    redemptions?: RedemptionUncheckedCreateNestedManyWithoutRewardInput
  }

  export type RewardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redemptions?: RedemptionUpdateManyWithoutRewardNestedInput
  }

  export type RewardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redemptions?: RedemptionUncheckedUpdateManyWithoutRewardNestedInput
  }

  export type RewardCreateManyInput = {
    id?: string
    name: string
    emoji: string
    description?: string | null
    cost: number
    requiresApproval?: boolean
    audience?: RewardCreateaudienceInput | string[]
    stock?: number | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type RewardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchCardTemplateCreateInput = {
    id?: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins?: number | null
    payoutOptionIds?: PunchCardTemplateCreatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateCreateaudienceInput | string[]
    active?: boolean
    cards?: PunchCardCreateNestedManyWithoutTemplateInput
  }

  export type PunchCardTemplateUncheckedCreateInput = {
    id?: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins?: number | null
    payoutOptionIds?: PunchCardTemplateCreatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateCreateaudienceInput | string[]
    active?: boolean
    cards?: PunchCardUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type PunchCardTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    cards?: PunchCardUpdateManyWithoutTemplateNestedInput
  }

  export type PunchCardTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    cards?: PunchCardUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type PunchCardTemplateCreateManyInput = {
    id?: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins?: number | null
    payoutOptionIds?: PunchCardTemplateCreatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateCreateaudienceInput | string[]
    active?: boolean
  }

  export type PunchCardTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PunchCardTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PunchCardCreateInput = {
    id?: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
    template: PunchCardTemplateCreateNestedOneWithoutCardsInput
    punches?: PunchCreateNestedManyWithoutCardInput
  }

  export type PunchCardUncheckedCreateInput = {
    id?: string
    templateId: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
    punches?: PunchUncheckedCreateNestedManyWithoutCardInput
  }

  export type PunchCardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: PunchCardTemplateUpdateOneRequiredWithoutCardsNestedInput
    punches?: PunchUpdateManyWithoutCardNestedInput
  }

  export type PunchCardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    punches?: PunchUncheckedUpdateManyWithoutCardNestedInput
  }

  export type PunchCardCreateManyInput = {
    id?: string
    templateId: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PunchCardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchCardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchCreateInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
    card: PunchCardCreateNestedOneWithoutPunchesInput
  }

  export type PunchUncheckedCreateInput = {
    id?: string
    cardId: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type PunchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    card?: PunchCardUpdateOneRequiredWithoutPunchesNestedInput
  }

  export type PunchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchCreateManyInput = {
    id?: string
    cardId: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type PunchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RedemptionCreateInput = {
    id?: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
    reward: RewardCreateNestedOneWithoutRedemptionsInput
  }

  export type RedemptionUncheckedCreateInput = {
    id?: string
    rewardId: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
  }

  export type RedemptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
    reward?: RewardUpdateOneRequiredWithoutRedemptionsNestedInput
  }

  export type RedemptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RedemptionCreateManyInput = {
    id?: string
    rewardId: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
  }

  export type RedemptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RedemptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LedgerEntrySourceTypeSourceIdCompoundUniqueInput = {
    sourceType: string
    sourceId: string
  }

  export type LedgerEntryCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntryAvgOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type LedgerEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntryMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type LedgerEntrySumOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BalanceCountOrderByAggregateInput = {
    profileId?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type BalanceAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type BalanceMaxOrderByAggregateInput = {
    profileId?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type BalanceMinOrderByAggregateInput = {
    profileId?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type BalanceSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PendingPayoutSourceTypeSourceIdCompoundUniqueInput = {
    sourceType: string
    sourceId: string
  }

  export type PendingPayoutCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    amount?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    decidedBy?: SortOrder
    decidedNote?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingPayoutAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PendingPayoutMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    amount?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    decidedBy?: SortOrder
    decidedNote?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingPayoutMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    amount?: SortOrder
    reason?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    decidedBy?: SortOrder
    decidedNote?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingPayoutSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type RedemptionListRelationFilter = {
    every?: RedemptionWhereInput
    some?: RedemptionWhereInput
    none?: RedemptionWhereInput
  }

  export type RedemptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RewardCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    requiresApproval?: SortOrder
    audience?: SortOrder
    stock?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RewardAvgOrderByAggregateInput = {
    cost?: SortOrder
    stock?: SortOrder
  }

  export type RewardMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    requiresApproval?: SortOrder
    stock?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RewardMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    requiresApproval?: SortOrder
    stock?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RewardSumOrderByAggregateInput = {
    cost?: SortOrder
    stock?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type PunchCardListRelationFilter = {
    every?: PunchCardWhereInput
    some?: PunchCardWhereInput
    none?: PunchCardWhereInput
  }

  export type PunchCardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PunchCardTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    glyph?: SortOrder
    goal?: SortOrder
    payoutKind?: SortOrder
    payoutCoins?: SortOrder
    payoutOptionIds?: SortOrder
    audience?: SortOrder
    active?: SortOrder
  }

  export type PunchCardTemplateAvgOrderByAggregateInput = {
    goal?: SortOrder
    payoutCoins?: SortOrder
  }

  export type PunchCardTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    glyph?: SortOrder
    goal?: SortOrder
    payoutKind?: SortOrder
    payoutCoins?: SortOrder
    active?: SortOrder
  }

  export type PunchCardTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    glyph?: SortOrder
    goal?: SortOrder
    payoutKind?: SortOrder
    payoutCoins?: SortOrder
    active?: SortOrder
  }

  export type PunchCardTemplateSumOrderByAggregateInput = {
    goal?: SortOrder
    payoutCoins?: SortOrder
  }

  export type PunchCardTemplateScalarRelationFilter = {
    is?: PunchCardTemplateWhereInput
    isNot?: PunchCardTemplateWhereInput
  }

  export type PunchListRelationFilter = {
    every?: PunchWhereInput
    some?: PunchWhereInput
    none?: PunchWhereInput
  }

  export type PunchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PunchCardCountOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    profileId?: SortOrder
    count?: SortOrder
    chosenRewardId?: SortOrder
    completedAt?: SortOrder
    prizeClaimedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PunchCardAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PunchCardMaxOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    profileId?: SortOrder
    count?: SortOrder
    chosenRewardId?: SortOrder
    completedAt?: SortOrder
    prizeClaimedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PunchCardMinOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    profileId?: SortOrder
    count?: SortOrder
    chosenRewardId?: SortOrder
    completedAt?: SortOrder
    prizeClaimedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PunchCardSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type PunchCardScalarRelationFilter = {
    is?: PunchCardWhereInput
    isNot?: PunchCardWhereInput
  }

  export type PunchSourceTypeSourceIdCompoundUniqueInput = {
    sourceType: string
    sourceId: string
  }

  export type PunchCountOrderByAggregateInput = {
    id?: SortOrder
    cardId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PunchMaxOrderByAggregateInput = {
    id?: SortOrder
    cardId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PunchMinOrderByAggregateInput = {
    id?: SortOrder
    cardId?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RewardScalarRelationFilter = {
    is?: RewardWhereInput
    isNot?: RewardWhereInput
  }

  export type RedemptionCountOrderByAggregateInput = {
    id?: SortOrder
    rewardId?: SortOrder
    profileId?: SortOrder
    cost?: SortOrder
    status?: SortOrder
    purchasedAt?: SortOrder
    useRequestedAt?: SortOrder
    usedAt?: SortOrder
    decidedBy?: SortOrder
    decidedAt?: SortOrder
    decidedNote?: SortOrder
  }

  export type RedemptionAvgOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type RedemptionMaxOrderByAggregateInput = {
    id?: SortOrder
    rewardId?: SortOrder
    profileId?: SortOrder
    cost?: SortOrder
    status?: SortOrder
    purchasedAt?: SortOrder
    useRequestedAt?: SortOrder
    usedAt?: SortOrder
    decidedBy?: SortOrder
    decidedAt?: SortOrder
    decidedNote?: SortOrder
  }

  export type RedemptionMinOrderByAggregateInput = {
    id?: SortOrder
    rewardId?: SortOrder
    profileId?: SortOrder
    cost?: SortOrder
    status?: SortOrder
    purchasedAt?: SortOrder
    useRequestedAt?: SortOrder
    usedAt?: SortOrder
    decidedBy?: SortOrder
    decidedAt?: SortOrder
    decidedNote?: SortOrder
  }

  export type RedemptionSumOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RewardCreateaudienceInput = {
    set: string[]
  }

  export type RedemptionCreateNestedManyWithoutRewardInput = {
    create?: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput> | RedemptionCreateWithoutRewardInput[] | RedemptionUncheckedCreateWithoutRewardInput[]
    connectOrCreate?: RedemptionCreateOrConnectWithoutRewardInput | RedemptionCreateOrConnectWithoutRewardInput[]
    createMany?: RedemptionCreateManyRewardInputEnvelope
    connect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
  }

  export type RedemptionUncheckedCreateNestedManyWithoutRewardInput = {
    create?: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput> | RedemptionCreateWithoutRewardInput[] | RedemptionUncheckedCreateWithoutRewardInput[]
    connectOrCreate?: RedemptionCreateOrConnectWithoutRewardInput | RedemptionCreateOrConnectWithoutRewardInput[]
    createMany?: RedemptionCreateManyRewardInputEnvelope
    connect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RewardUpdateaudienceInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RedemptionUpdateManyWithoutRewardNestedInput = {
    create?: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput> | RedemptionCreateWithoutRewardInput[] | RedemptionUncheckedCreateWithoutRewardInput[]
    connectOrCreate?: RedemptionCreateOrConnectWithoutRewardInput | RedemptionCreateOrConnectWithoutRewardInput[]
    upsert?: RedemptionUpsertWithWhereUniqueWithoutRewardInput | RedemptionUpsertWithWhereUniqueWithoutRewardInput[]
    createMany?: RedemptionCreateManyRewardInputEnvelope
    set?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    disconnect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    delete?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    connect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    update?: RedemptionUpdateWithWhereUniqueWithoutRewardInput | RedemptionUpdateWithWhereUniqueWithoutRewardInput[]
    updateMany?: RedemptionUpdateManyWithWhereWithoutRewardInput | RedemptionUpdateManyWithWhereWithoutRewardInput[]
    deleteMany?: RedemptionScalarWhereInput | RedemptionScalarWhereInput[]
  }

  export type RedemptionUncheckedUpdateManyWithoutRewardNestedInput = {
    create?: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput> | RedemptionCreateWithoutRewardInput[] | RedemptionUncheckedCreateWithoutRewardInput[]
    connectOrCreate?: RedemptionCreateOrConnectWithoutRewardInput | RedemptionCreateOrConnectWithoutRewardInput[]
    upsert?: RedemptionUpsertWithWhereUniqueWithoutRewardInput | RedemptionUpsertWithWhereUniqueWithoutRewardInput[]
    createMany?: RedemptionCreateManyRewardInputEnvelope
    set?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    disconnect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    delete?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    connect?: RedemptionWhereUniqueInput | RedemptionWhereUniqueInput[]
    update?: RedemptionUpdateWithWhereUniqueWithoutRewardInput | RedemptionUpdateWithWhereUniqueWithoutRewardInput[]
    updateMany?: RedemptionUpdateManyWithWhereWithoutRewardInput | RedemptionUpdateManyWithWhereWithoutRewardInput[]
    deleteMany?: RedemptionScalarWhereInput | RedemptionScalarWhereInput[]
  }

  export type PunchCardTemplateCreatepayoutOptionIdsInput = {
    set: string[]
  }

  export type PunchCardTemplateCreateaudienceInput = {
    set: string[]
  }

  export type PunchCardCreateNestedManyWithoutTemplateInput = {
    create?: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput> | PunchCardCreateWithoutTemplateInput[] | PunchCardUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PunchCardCreateOrConnectWithoutTemplateInput | PunchCardCreateOrConnectWithoutTemplateInput[]
    createMany?: PunchCardCreateManyTemplateInputEnvelope
    connect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
  }

  export type PunchCardUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput> | PunchCardCreateWithoutTemplateInput[] | PunchCardUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PunchCardCreateOrConnectWithoutTemplateInput | PunchCardCreateOrConnectWithoutTemplateInput[]
    createMany?: PunchCardCreateManyTemplateInputEnvelope
    connect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
  }

  export type PunchCardTemplateUpdatepayoutOptionIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PunchCardTemplateUpdateaudienceInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PunchCardUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput> | PunchCardCreateWithoutTemplateInput[] | PunchCardUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PunchCardCreateOrConnectWithoutTemplateInput | PunchCardCreateOrConnectWithoutTemplateInput[]
    upsert?: PunchCardUpsertWithWhereUniqueWithoutTemplateInput | PunchCardUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: PunchCardCreateManyTemplateInputEnvelope
    set?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    disconnect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    delete?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    connect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    update?: PunchCardUpdateWithWhereUniqueWithoutTemplateInput | PunchCardUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: PunchCardUpdateManyWithWhereWithoutTemplateInput | PunchCardUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: PunchCardScalarWhereInput | PunchCardScalarWhereInput[]
  }

  export type PunchCardUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput> | PunchCardCreateWithoutTemplateInput[] | PunchCardUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PunchCardCreateOrConnectWithoutTemplateInput | PunchCardCreateOrConnectWithoutTemplateInput[]
    upsert?: PunchCardUpsertWithWhereUniqueWithoutTemplateInput | PunchCardUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: PunchCardCreateManyTemplateInputEnvelope
    set?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    disconnect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    delete?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    connect?: PunchCardWhereUniqueInput | PunchCardWhereUniqueInput[]
    update?: PunchCardUpdateWithWhereUniqueWithoutTemplateInput | PunchCardUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: PunchCardUpdateManyWithWhereWithoutTemplateInput | PunchCardUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: PunchCardScalarWhereInput | PunchCardScalarWhereInput[]
  }

  export type PunchCardTemplateCreateNestedOneWithoutCardsInput = {
    create?: XOR<PunchCardTemplateCreateWithoutCardsInput, PunchCardTemplateUncheckedCreateWithoutCardsInput>
    connectOrCreate?: PunchCardTemplateCreateOrConnectWithoutCardsInput
    connect?: PunchCardTemplateWhereUniqueInput
  }

  export type PunchCreateNestedManyWithoutCardInput = {
    create?: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput> | PunchCreateWithoutCardInput[] | PunchUncheckedCreateWithoutCardInput[]
    connectOrCreate?: PunchCreateOrConnectWithoutCardInput | PunchCreateOrConnectWithoutCardInput[]
    createMany?: PunchCreateManyCardInputEnvelope
    connect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
  }

  export type PunchUncheckedCreateNestedManyWithoutCardInput = {
    create?: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput> | PunchCreateWithoutCardInput[] | PunchUncheckedCreateWithoutCardInput[]
    connectOrCreate?: PunchCreateOrConnectWithoutCardInput | PunchCreateOrConnectWithoutCardInput[]
    createMany?: PunchCreateManyCardInputEnvelope
    connect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
  }

  export type PunchCardTemplateUpdateOneRequiredWithoutCardsNestedInput = {
    create?: XOR<PunchCardTemplateCreateWithoutCardsInput, PunchCardTemplateUncheckedCreateWithoutCardsInput>
    connectOrCreate?: PunchCardTemplateCreateOrConnectWithoutCardsInput
    upsert?: PunchCardTemplateUpsertWithoutCardsInput
    connect?: PunchCardTemplateWhereUniqueInput
    update?: XOR<XOR<PunchCardTemplateUpdateToOneWithWhereWithoutCardsInput, PunchCardTemplateUpdateWithoutCardsInput>, PunchCardTemplateUncheckedUpdateWithoutCardsInput>
  }

  export type PunchUpdateManyWithoutCardNestedInput = {
    create?: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput> | PunchCreateWithoutCardInput[] | PunchUncheckedCreateWithoutCardInput[]
    connectOrCreate?: PunchCreateOrConnectWithoutCardInput | PunchCreateOrConnectWithoutCardInput[]
    upsert?: PunchUpsertWithWhereUniqueWithoutCardInput | PunchUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: PunchCreateManyCardInputEnvelope
    set?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    disconnect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    delete?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    connect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    update?: PunchUpdateWithWhereUniqueWithoutCardInput | PunchUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: PunchUpdateManyWithWhereWithoutCardInput | PunchUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: PunchScalarWhereInput | PunchScalarWhereInput[]
  }

  export type PunchUncheckedUpdateManyWithoutCardNestedInput = {
    create?: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput> | PunchCreateWithoutCardInput[] | PunchUncheckedCreateWithoutCardInput[]
    connectOrCreate?: PunchCreateOrConnectWithoutCardInput | PunchCreateOrConnectWithoutCardInput[]
    upsert?: PunchUpsertWithWhereUniqueWithoutCardInput | PunchUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: PunchCreateManyCardInputEnvelope
    set?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    disconnect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    delete?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    connect?: PunchWhereUniqueInput | PunchWhereUniqueInput[]
    update?: PunchUpdateWithWhereUniqueWithoutCardInput | PunchUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: PunchUpdateManyWithWhereWithoutCardInput | PunchUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: PunchScalarWhereInput | PunchScalarWhereInput[]
  }

  export type PunchCardCreateNestedOneWithoutPunchesInput = {
    create?: XOR<PunchCardCreateWithoutPunchesInput, PunchCardUncheckedCreateWithoutPunchesInput>
    connectOrCreate?: PunchCardCreateOrConnectWithoutPunchesInput
    connect?: PunchCardWhereUniqueInput
  }

  export type PunchCardUpdateOneRequiredWithoutPunchesNestedInput = {
    create?: XOR<PunchCardCreateWithoutPunchesInput, PunchCardUncheckedCreateWithoutPunchesInput>
    connectOrCreate?: PunchCardCreateOrConnectWithoutPunchesInput
    upsert?: PunchCardUpsertWithoutPunchesInput
    connect?: PunchCardWhereUniqueInput
    update?: XOR<XOR<PunchCardUpdateToOneWithWhereWithoutPunchesInput, PunchCardUpdateWithoutPunchesInput>, PunchCardUncheckedUpdateWithoutPunchesInput>
  }

  export type RewardCreateNestedOneWithoutRedemptionsInput = {
    create?: XOR<RewardCreateWithoutRedemptionsInput, RewardUncheckedCreateWithoutRedemptionsInput>
    connectOrCreate?: RewardCreateOrConnectWithoutRedemptionsInput
    connect?: RewardWhereUniqueInput
  }

  export type RewardUpdateOneRequiredWithoutRedemptionsNestedInput = {
    create?: XOR<RewardCreateWithoutRedemptionsInput, RewardUncheckedCreateWithoutRedemptionsInput>
    connectOrCreate?: RewardCreateOrConnectWithoutRedemptionsInput
    upsert?: RewardUpsertWithoutRedemptionsInput
    connect?: RewardWhereUniqueInput
    update?: XOR<XOR<RewardUpdateToOneWithWhereWithoutRedemptionsInput, RewardUpdateWithoutRedemptionsInput>, RewardUncheckedUpdateWithoutRedemptionsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type RedemptionCreateWithoutRewardInput = {
    id?: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
  }

  export type RedemptionUncheckedCreateWithoutRewardInput = {
    id?: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
  }

  export type RedemptionCreateOrConnectWithoutRewardInput = {
    where: RedemptionWhereUniqueInput
    create: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput>
  }

  export type RedemptionCreateManyRewardInputEnvelope = {
    data: RedemptionCreateManyRewardInput | RedemptionCreateManyRewardInput[]
    skipDuplicates?: boolean
  }

  export type RedemptionUpsertWithWhereUniqueWithoutRewardInput = {
    where: RedemptionWhereUniqueInput
    update: XOR<RedemptionUpdateWithoutRewardInput, RedemptionUncheckedUpdateWithoutRewardInput>
    create: XOR<RedemptionCreateWithoutRewardInput, RedemptionUncheckedCreateWithoutRewardInput>
  }

  export type RedemptionUpdateWithWhereUniqueWithoutRewardInput = {
    where: RedemptionWhereUniqueInput
    data: XOR<RedemptionUpdateWithoutRewardInput, RedemptionUncheckedUpdateWithoutRewardInput>
  }

  export type RedemptionUpdateManyWithWhereWithoutRewardInput = {
    where: RedemptionScalarWhereInput
    data: XOR<RedemptionUpdateManyMutationInput, RedemptionUncheckedUpdateManyWithoutRewardInput>
  }

  export type RedemptionScalarWhereInput = {
    AND?: RedemptionScalarWhereInput | RedemptionScalarWhereInput[]
    OR?: RedemptionScalarWhereInput[]
    NOT?: RedemptionScalarWhereInput | RedemptionScalarWhereInput[]
    id?: UuidFilter<"Redemption"> | string
    rewardId?: UuidFilter<"Redemption"> | string
    profileId?: UuidFilter<"Redemption"> | string
    cost?: IntFilter<"Redemption"> | number
    status?: StringFilter<"Redemption"> | string
    purchasedAt?: DateTimeFilter<"Redemption"> | Date | string
    useRequestedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    usedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedBy?: UuidNullableFilter<"Redemption"> | string | null
    decidedAt?: DateTimeNullableFilter<"Redemption"> | Date | string | null
    decidedNote?: StringNullableFilter<"Redemption"> | string | null
  }

  export type PunchCardCreateWithoutTemplateInput = {
    id?: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
    punches?: PunchCreateNestedManyWithoutCardInput
  }

  export type PunchCardUncheckedCreateWithoutTemplateInput = {
    id?: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
    punches?: PunchUncheckedCreateNestedManyWithoutCardInput
  }

  export type PunchCardCreateOrConnectWithoutTemplateInput = {
    where: PunchCardWhereUniqueInput
    create: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput>
  }

  export type PunchCardCreateManyTemplateInputEnvelope = {
    data: PunchCardCreateManyTemplateInput | PunchCardCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type PunchCardUpsertWithWhereUniqueWithoutTemplateInput = {
    where: PunchCardWhereUniqueInput
    update: XOR<PunchCardUpdateWithoutTemplateInput, PunchCardUncheckedUpdateWithoutTemplateInput>
    create: XOR<PunchCardCreateWithoutTemplateInput, PunchCardUncheckedCreateWithoutTemplateInput>
  }

  export type PunchCardUpdateWithWhereUniqueWithoutTemplateInput = {
    where: PunchCardWhereUniqueInput
    data: XOR<PunchCardUpdateWithoutTemplateInput, PunchCardUncheckedUpdateWithoutTemplateInput>
  }

  export type PunchCardUpdateManyWithWhereWithoutTemplateInput = {
    where: PunchCardScalarWhereInput
    data: XOR<PunchCardUpdateManyMutationInput, PunchCardUncheckedUpdateManyWithoutTemplateInput>
  }

  export type PunchCardScalarWhereInput = {
    AND?: PunchCardScalarWhereInput | PunchCardScalarWhereInput[]
    OR?: PunchCardScalarWhereInput[]
    NOT?: PunchCardScalarWhereInput | PunchCardScalarWhereInput[]
    id?: UuidFilter<"PunchCard"> | string
    templateId?: UuidFilter<"PunchCard"> | string
    profileId?: UuidFilter<"PunchCard"> | string
    count?: IntFilter<"PunchCard"> | number
    chosenRewardId?: UuidNullableFilter<"PunchCard"> | string | null
    completedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    prizeClaimedAt?: DateTimeNullableFilter<"PunchCard"> | Date | string | null
    createdAt?: DateTimeFilter<"PunchCard"> | Date | string
  }

  export type PunchCardTemplateCreateWithoutCardsInput = {
    id?: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins?: number | null
    payoutOptionIds?: PunchCardTemplateCreatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateCreateaudienceInput | string[]
    active?: boolean
  }

  export type PunchCardTemplateUncheckedCreateWithoutCardsInput = {
    id?: string
    name: string
    glyph: string
    goal: number
    payoutKind: string
    payoutCoins?: number | null
    payoutOptionIds?: PunchCardTemplateCreatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateCreateaudienceInput | string[]
    active?: boolean
  }

  export type PunchCardTemplateCreateOrConnectWithoutCardsInput = {
    where: PunchCardTemplateWhereUniqueInput
    create: XOR<PunchCardTemplateCreateWithoutCardsInput, PunchCardTemplateUncheckedCreateWithoutCardsInput>
  }

  export type PunchCreateWithoutCardInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type PunchUncheckedCreateWithoutCardInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type PunchCreateOrConnectWithoutCardInput = {
    where: PunchWhereUniqueInput
    create: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput>
  }

  export type PunchCreateManyCardInputEnvelope = {
    data: PunchCreateManyCardInput | PunchCreateManyCardInput[]
    skipDuplicates?: boolean
  }

  export type PunchCardTemplateUpsertWithoutCardsInput = {
    update: XOR<PunchCardTemplateUpdateWithoutCardsInput, PunchCardTemplateUncheckedUpdateWithoutCardsInput>
    create: XOR<PunchCardTemplateCreateWithoutCardsInput, PunchCardTemplateUncheckedCreateWithoutCardsInput>
    where?: PunchCardTemplateWhereInput
  }

  export type PunchCardTemplateUpdateToOneWithWhereWithoutCardsInput = {
    where?: PunchCardTemplateWhereInput
    data: XOR<PunchCardTemplateUpdateWithoutCardsInput, PunchCardTemplateUncheckedUpdateWithoutCardsInput>
  }

  export type PunchCardTemplateUpdateWithoutCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PunchCardTemplateUncheckedUpdateWithoutCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    glyph?: StringFieldUpdateOperationsInput | string
    goal?: IntFieldUpdateOperationsInput | number
    payoutKind?: StringFieldUpdateOperationsInput | string
    payoutCoins?: NullableIntFieldUpdateOperationsInput | number | null
    payoutOptionIds?: PunchCardTemplateUpdatepayoutOptionIdsInput | string[]
    audience?: PunchCardTemplateUpdateaudienceInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PunchUpsertWithWhereUniqueWithoutCardInput = {
    where: PunchWhereUniqueInput
    update: XOR<PunchUpdateWithoutCardInput, PunchUncheckedUpdateWithoutCardInput>
    create: XOR<PunchCreateWithoutCardInput, PunchUncheckedCreateWithoutCardInput>
  }

  export type PunchUpdateWithWhereUniqueWithoutCardInput = {
    where: PunchWhereUniqueInput
    data: XOR<PunchUpdateWithoutCardInput, PunchUncheckedUpdateWithoutCardInput>
  }

  export type PunchUpdateManyWithWhereWithoutCardInput = {
    where: PunchScalarWhereInput
    data: XOR<PunchUpdateManyMutationInput, PunchUncheckedUpdateManyWithoutCardInput>
  }

  export type PunchScalarWhereInput = {
    AND?: PunchScalarWhereInput | PunchScalarWhereInput[]
    OR?: PunchScalarWhereInput[]
    NOT?: PunchScalarWhereInput | PunchScalarWhereInput[]
    id?: UuidFilter<"Punch"> | string
    cardId?: UuidFilter<"Punch"> | string
    sourceType?: StringFilter<"Punch"> | string
    sourceId?: StringNullableFilter<"Punch"> | string | null
    createdBy?: UuidFilter<"Punch"> | string
    createdAt?: DateTimeFilter<"Punch"> | Date | string
  }

  export type PunchCardCreateWithoutPunchesInput = {
    id?: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
    template: PunchCardTemplateCreateNestedOneWithoutCardsInput
  }

  export type PunchCardUncheckedCreateWithoutPunchesInput = {
    id?: string
    templateId: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PunchCardCreateOrConnectWithoutPunchesInput = {
    where: PunchCardWhereUniqueInput
    create: XOR<PunchCardCreateWithoutPunchesInput, PunchCardUncheckedCreateWithoutPunchesInput>
  }

  export type PunchCardUpsertWithoutPunchesInput = {
    update: XOR<PunchCardUpdateWithoutPunchesInput, PunchCardUncheckedUpdateWithoutPunchesInput>
    create: XOR<PunchCardCreateWithoutPunchesInput, PunchCardUncheckedCreateWithoutPunchesInput>
    where?: PunchCardWhereInput
  }

  export type PunchCardUpdateToOneWithWhereWithoutPunchesInput = {
    where?: PunchCardWhereInput
    data: XOR<PunchCardUpdateWithoutPunchesInput, PunchCardUncheckedUpdateWithoutPunchesInput>
  }

  export type PunchCardUpdateWithoutPunchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: PunchCardTemplateUpdateOneRequiredWithoutCardsNestedInput
  }

  export type PunchCardUncheckedUpdateWithoutPunchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardCreateWithoutRedemptionsInput = {
    id?: string
    name: string
    emoji: string
    description?: string | null
    cost: number
    requiresApproval?: boolean
    audience?: RewardCreateaudienceInput | string[]
    stock?: number | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type RewardUncheckedCreateWithoutRedemptionsInput = {
    id?: string
    name: string
    emoji: string
    description?: string | null
    cost: number
    requiresApproval?: boolean
    audience?: RewardCreateaudienceInput | string[]
    stock?: number | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
  }

  export type RewardCreateOrConnectWithoutRedemptionsInput = {
    where: RewardWhereUniqueInput
    create: XOR<RewardCreateWithoutRedemptionsInput, RewardUncheckedCreateWithoutRedemptionsInput>
  }

  export type RewardUpsertWithoutRedemptionsInput = {
    update: XOR<RewardUpdateWithoutRedemptionsInput, RewardUncheckedUpdateWithoutRedemptionsInput>
    create: XOR<RewardCreateWithoutRedemptionsInput, RewardUncheckedCreateWithoutRedemptionsInput>
    where?: RewardWhereInput
  }

  export type RewardUpdateToOneWithWhereWithoutRedemptionsInput = {
    where?: RewardWhereInput
    data: XOR<RewardUpdateWithoutRedemptionsInput, RewardUncheckedUpdateWithoutRedemptionsInput>
  }

  export type RewardUpdateWithoutRedemptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardUncheckedUpdateWithoutRedemptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    requiresApproval?: BoolFieldUpdateOperationsInput | boolean
    audience?: RewardUpdateaudienceInput | string[]
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RedemptionCreateManyRewardInput = {
    id?: string
    profileId: string
    cost: number
    status?: string
    purchasedAt?: Date | string
    useRequestedAt?: Date | string | null
    usedAt?: Date | string | null
    decidedBy?: string | null
    decidedAt?: Date | string | null
    decidedNote?: string | null
  }

  export type RedemptionUpdateWithoutRewardInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RedemptionUncheckedUpdateWithoutRewardInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RedemptionUncheckedUpdateManyWithoutRewardInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    cost?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    useRequestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    decidedNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PunchCardCreateManyTemplateInput = {
    id?: string
    profileId: string
    count?: number
    chosenRewardId?: string | null
    completedAt?: Date | string | null
    prizeClaimedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PunchCardUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    punches?: PunchUpdateManyWithoutCardNestedInput
  }

  export type PunchCardUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    punches?: PunchUncheckedUpdateManyWithoutCardNestedInput
  }

  export type PunchCardUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    chosenRewardId?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prizeClaimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchCreateManyCardInput = {
    id?: string
    sourceType: string
    sourceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type PunchUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchUncheckedUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PunchUncheckedUpdateManyWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}