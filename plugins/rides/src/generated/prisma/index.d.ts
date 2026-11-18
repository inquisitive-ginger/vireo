/**
 * Client
 **/

import * as runtime from './runtime/client.js'
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model SchoolRun
 *
 */
export type SchoolRun = $Result.DefaultSelection<Prisma.$SchoolRunPayload>
/**
 * Model RunDriver
 *
 */
export type RunDriver = $Result.DefaultSelection<Prisma.$RunDriverPayload>
/**
 * Model RunSkip
 *
 */
export type RunSkip = $Result.DefaultSelection<Prisma.$RunSkipPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more SchoolRuns
 * const schoolRuns = await prisma.schoolRun.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
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
   * // Fetch zero or more SchoolRuns
   * const schoolRuns = await prisma.schoolRun.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>)
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void
  ): PrismaClient

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>

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
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>

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
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>

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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  ): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs
      }
    >
  >

  /**
   * `prisma.schoolRun`: Exposes CRUD operations for the **SchoolRun** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SchoolRuns
   * const schoolRuns = await prisma.schoolRun.findMany()
   * ```
   */
  get schoolRun(): Prisma.SchoolRunDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.runDriver`: Exposes CRUD operations for the **RunDriver** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more RunDrivers
   * const runDrivers = await prisma.runDriver.findMany()
   * ```
   */
  get runDriver(): Prisma.RunDriverDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.runSkip`: Exposes CRUD operations for the **RunSkip** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more RunSkips
   * const runSkips = await prisma.runSkip.findMany()
   * ```
   */
  get runSkip(): Prisma.RunSkipDelegate<ExtArgs, ClientOptions>
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
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

  export type Enumerable<T> = T | Array<T>

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
    [key in keyof T]: key extends keyof U ? T[key] : never
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & (T extends SelectAndInclude
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
  } & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
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

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I
  ) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K]
  } & {}

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>
      }
    >
  >

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K]
      } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K]
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

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

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>

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

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never
      }
    : never

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
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
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>

  export const ModelName: {
    SchoolRun: 'SchoolRun'
    RunDriver: 'RunDriver'
    RunSkip: 'RunSkip'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: 'schoolRun' | 'runDriver' | 'runSkip'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SchoolRun: {
        payload: Prisma.$SchoolRunPayload<ExtArgs>
        fields: Prisma.SchoolRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SchoolRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SchoolRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          findFirst: {
            args: Prisma.SchoolRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SchoolRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          findMany: {
            args: Prisma.SchoolRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>[]
          }
          create: {
            args: Prisma.SchoolRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          createMany: {
            args: Prisma.SchoolRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SchoolRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>[]
          }
          delete: {
            args: Prisma.SchoolRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          update: {
            args: Prisma.SchoolRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          deleteMany: {
            args: Prisma.SchoolRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SchoolRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SchoolRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>[]
          }
          upsert: {
            args: Prisma.SchoolRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchoolRunPayload>
          }
          aggregate: {
            args: Prisma.SchoolRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchoolRun>
          }
          groupBy: {
            args: Prisma.SchoolRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<SchoolRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.SchoolRunCountArgs<ExtArgs>
            result: $Utils.Optional<SchoolRunCountAggregateOutputType> | number
          }
        }
      }
      RunDriver: {
        payload: Prisma.$RunDriverPayload<ExtArgs>
        fields: Prisma.RunDriverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunDriverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunDriverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          findFirst: {
            args: Prisma.RunDriverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunDriverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          findMany: {
            args: Prisma.RunDriverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>[]
          }
          create: {
            args: Prisma.RunDriverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          createMany: {
            args: Prisma.RunDriverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunDriverCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>[]
          }
          delete: {
            args: Prisma.RunDriverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          update: {
            args: Prisma.RunDriverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          deleteMany: {
            args: Prisma.RunDriverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunDriverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunDriverUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>[]
          }
          upsert: {
            args: Prisma.RunDriverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunDriverPayload>
          }
          aggregate: {
            args: Prisma.RunDriverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunDriver>
          }
          groupBy: {
            args: Prisma.RunDriverGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunDriverGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunDriverCountArgs<ExtArgs>
            result: $Utils.Optional<RunDriverCountAggregateOutputType> | number
          }
        }
      }
      RunSkip: {
        payload: Prisma.$RunSkipPayload<ExtArgs>
        fields: Prisma.RunSkipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunSkipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunSkipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          findFirst: {
            args: Prisma.RunSkipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunSkipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          findMany: {
            args: Prisma.RunSkipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>[]
          }
          create: {
            args: Prisma.RunSkipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          createMany: {
            args: Prisma.RunSkipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunSkipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>[]
          }
          delete: {
            args: Prisma.RunSkipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          update: {
            args: Prisma.RunSkipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          deleteMany: {
            args: Prisma.RunSkipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunSkipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunSkipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>[]
          }
          upsert: {
            args: Prisma.RunSkipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunSkipPayload>
          }
          aggregate: {
            args: Prisma.RunSkipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunSkip>
          }
          groupBy: {
            args: Prisma.RunSkipGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunSkipGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunSkipCountArgs<ExtArgs>
            result: $Utils.Optional<RunSkipCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >
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
    schoolRun?: SchoolRunOmit
    runDriver?: RunDriverOmit
    runSkip?: RunSkipOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never

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
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined

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
   * Count Type SchoolRunCountOutputType
   */

  export type SchoolRunCountOutputType = {
    drivers: number
    skips: number
  }

  export type SchoolRunCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    drivers?: boolean | SchoolRunCountOutputTypeCountDriversArgs
    skips?: boolean | SchoolRunCountOutputTypeCountSkipsArgs
  }

  // Custom InputTypes
  /**
   * SchoolRunCountOutputType without action
   */
  export type SchoolRunCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRunCountOutputType
     */
    select?: SchoolRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SchoolRunCountOutputType without action
   */
  export type SchoolRunCountOutputTypeCountDriversArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RunDriverWhereInput
  }

  /**
   * SchoolRunCountOutputType without action
   */
  export type SchoolRunCountOutputTypeCountSkipsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RunSkipWhereInput
  }

  /**
   * Models
   */

  /**
   * Model SchoolRun
   */

  export type AggregateSchoolRun = {
    _count: SchoolRunCountAggregateOutputType | null
    _avg: SchoolRunAvgAggregateOutputType | null
    _sum: SchoolRunSumAggregateOutputType | null
    _min: SchoolRunMinAggregateOutputType | null
    _max: SchoolRunMaxAggregateOutputType | null
  }

  export type SchoolRunAvgAggregateOutputType = {
    weekday: number | null
    minutes: number | null
  }

  export type SchoolRunSumAggregateOutputType = {
    weekday: number | null
    minutes: number | null
  }

  export type SchoolRunMinAggregateOutputType = {
    id: string | null
    kidId: string | null
    weekday: number | null
    kind: string | null
    place: string | null
    minutes: number | null
    startsOn: Date | null
    endsOn: Date | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type SchoolRunMaxAggregateOutputType = {
    id: string | null
    kidId: string | null
    weekday: number | null
    kind: string | null
    place: string | null
    minutes: number | null
    startsOn: Date | null
    endsOn: Date | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type SchoolRunCountAggregateOutputType = {
    id: number
    kidId: number
    weekday: number
    kind: number
    place: number
    minutes: number
    startsOn: number
    endsOn: number
    createdBy: number
    createdAt: number
    _all: number
  }

  export type SchoolRunAvgAggregateInputType = {
    weekday?: true
    minutes?: true
  }

  export type SchoolRunSumAggregateInputType = {
    weekday?: true
    minutes?: true
  }

  export type SchoolRunMinAggregateInputType = {
    id?: true
    kidId?: true
    weekday?: true
    kind?: true
    place?: true
    minutes?: true
    startsOn?: true
    endsOn?: true
    createdBy?: true
    createdAt?: true
  }

  export type SchoolRunMaxAggregateInputType = {
    id?: true
    kidId?: true
    weekday?: true
    kind?: true
    place?: true
    minutes?: true
    startsOn?: true
    endsOn?: true
    createdBy?: true
    createdAt?: true
  }

  export type SchoolRunCountAggregateInputType = {
    id?: true
    kidId?: true
    weekday?: true
    kind?: true
    place?: true
    minutes?: true
    startsOn?: true
    endsOn?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type SchoolRunAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SchoolRun to aggregate.
     */
    where?: SchoolRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SchoolRuns to fetch.
     */
    orderBy?: SchoolRunOrderByWithRelationInput | SchoolRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SchoolRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SchoolRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SchoolRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SchoolRuns
     **/
    _count?: true | SchoolRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SchoolRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SchoolRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SchoolRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SchoolRunMaxAggregateInputType
  }

  export type GetSchoolRunAggregateType<T extends SchoolRunAggregateArgs> = {
    [P in keyof T & keyof AggregateSchoolRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchoolRun[P]>
      : GetScalarType<T[P], AggregateSchoolRun[P]>
  }

  export type SchoolRunGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SchoolRunWhereInput
    orderBy?: SchoolRunOrderByWithAggregationInput | SchoolRunOrderByWithAggregationInput[]
    by: SchoolRunScalarFieldEnum[] | SchoolRunScalarFieldEnum
    having?: SchoolRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SchoolRunCountAggregateInputType | true
    _avg?: SchoolRunAvgAggregateInputType
    _sum?: SchoolRunSumAggregateInputType
    _min?: SchoolRunMinAggregateInputType
    _max?: SchoolRunMaxAggregateInputType
  }

  export type SchoolRunGroupByOutputType = {
    id: string
    kidId: string
    weekday: number
    kind: string
    place: string | null
    minutes: number
    startsOn: Date
    endsOn: Date | null
    createdBy: string
    createdAt: Date
    _count: SchoolRunCountAggregateOutputType | null
    _avg: SchoolRunAvgAggregateOutputType | null
    _sum: SchoolRunSumAggregateOutputType | null
    _min: SchoolRunMinAggregateOutputType | null
    _max: SchoolRunMaxAggregateOutputType | null
  }

  type GetSchoolRunGroupByPayload<T extends SchoolRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SchoolRunGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SchoolRunGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SchoolRunGroupByOutputType[P]>
          : GetScalarType<T[P], SchoolRunGroupByOutputType[P]>
      }
    >
  >

  export type SchoolRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        kidId?: boolean
        weekday?: boolean
        kind?: boolean
        place?: boolean
        minutes?: boolean
        startsOn?: boolean
        endsOn?: boolean
        createdBy?: boolean
        createdAt?: boolean
        drivers?: boolean | SchoolRun$driversArgs<ExtArgs>
        skips?: boolean | SchoolRun$skipsArgs<ExtArgs>
        _count?: boolean | SchoolRunCountOutputTypeDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['schoolRun']
    >

  export type SchoolRunSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      kidId?: boolean
      weekday?: boolean
      kind?: boolean
      place?: boolean
      minutes?: boolean
      startsOn?: boolean
      endsOn?: boolean
      createdBy?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['schoolRun']
  >

  export type SchoolRunSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      kidId?: boolean
      weekday?: boolean
      kind?: boolean
      place?: boolean
      minutes?: boolean
      startsOn?: boolean
      endsOn?: boolean
      createdBy?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['schoolRun']
  >

  export type SchoolRunSelectScalar = {
    id?: boolean
    kidId?: boolean
    weekday?: boolean
    kind?: boolean
    place?: boolean
    minutes?: boolean
    startsOn?: boolean
    endsOn?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type SchoolRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'kidId'
      | 'weekday'
      | 'kind'
      | 'place'
      | 'minutes'
      | 'startsOn'
      | 'endsOn'
      | 'createdBy'
      | 'createdAt',
      ExtArgs['result']['schoolRun']
    >
  export type SchoolRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      drivers?: boolean | SchoolRun$driversArgs<ExtArgs>
      skips?: boolean | SchoolRun$skipsArgs<ExtArgs>
      _count?: boolean | SchoolRunCountOutputTypeDefaultArgs<ExtArgs>
    }
  export type SchoolRunIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}
  export type SchoolRunIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}

  export type $SchoolRunPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'SchoolRun'
    objects: {
      drivers: Prisma.$RunDriverPayload<ExtArgs>[]
      skips: Prisma.$RunSkipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        kidId: string
        weekday: number
        kind: string
        place: string | null
        minutes: number
        startsOn: Date
        endsOn: Date | null
        createdBy: string
        createdAt: Date
      },
      ExtArgs['result']['schoolRun']
    >
    composites: {}
  }

  type SchoolRunGetPayload<S extends boolean | null | undefined | SchoolRunDefaultArgs> =
    $Result.GetResult<Prisma.$SchoolRunPayload, S>

  type SchoolRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SchoolRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SchoolRunCountAggregateInputType | true
    }

  export interface SchoolRunDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['SchoolRun']
      meta: { name: 'SchoolRun' }
    }
    /**
     * Find zero or one SchoolRun that matches the filter.
     * @param {SchoolRunFindUniqueArgs} args - Arguments to find a SchoolRun
     * @example
     * // Get one SchoolRun
     * const schoolRun = await prisma.schoolRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SchoolRunFindUniqueArgs>(
      args: SelectSubset<T, SchoolRunFindUniqueArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one SchoolRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SchoolRunFindUniqueOrThrowArgs} args - Arguments to find a SchoolRun
     * @example
     * // Get one SchoolRun
     * const schoolRun = await prisma.schoolRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SchoolRunFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SchoolRunFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SchoolRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunFindFirstArgs} args - Arguments to find a SchoolRun
     * @example
     * // Get one SchoolRun
     * const schoolRun = await prisma.schoolRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SchoolRunFindFirstArgs>(
      args?: SelectSubset<T, SchoolRunFindFirstArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SchoolRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunFindFirstOrThrowArgs} args - Arguments to find a SchoolRun
     * @example
     * // Get one SchoolRun
     * const schoolRun = await prisma.schoolRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SchoolRunFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SchoolRunFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more SchoolRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SchoolRuns
     * const schoolRuns = await prisma.schoolRun.findMany()
     *
     * // Get first 10 SchoolRuns
     * const schoolRuns = await prisma.schoolRun.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const schoolRunWithIdOnly = await prisma.schoolRun.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SchoolRunFindManyArgs>(
      args?: SelectSubset<T, SchoolRunFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SchoolRunPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a SchoolRun.
     * @param {SchoolRunCreateArgs} args - Arguments to create a SchoolRun.
     * @example
     * // Create one SchoolRun
     * const SchoolRun = await prisma.schoolRun.create({
     *   data: {
     *     // ... data to create a SchoolRun
     *   }
     * })
     *
     */
    create<T extends SchoolRunCreateArgs>(
      args: SelectSubset<T, SchoolRunCreateArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<Prisma.$SchoolRunPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many SchoolRuns.
     * @param {SchoolRunCreateManyArgs} args - Arguments to create many SchoolRuns.
     * @example
     * // Create many SchoolRuns
     * const schoolRun = await prisma.schoolRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SchoolRunCreateManyArgs>(
      args?: SelectSubset<T, SchoolRunCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SchoolRuns and returns the data saved in the database.
     * @param {SchoolRunCreateManyAndReturnArgs} args - Arguments to create many SchoolRuns.
     * @example
     * // Create many SchoolRuns
     * const schoolRun = await prisma.schoolRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SchoolRuns and only return the `id`
     * const schoolRunWithIdOnly = await prisma.schoolRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SchoolRunCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SchoolRunCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a SchoolRun.
     * @param {SchoolRunDeleteArgs} args - Arguments to delete one SchoolRun.
     * @example
     * // Delete one SchoolRun
     * const SchoolRun = await prisma.schoolRun.delete({
     *   where: {
     *     // ... filter to delete one SchoolRun
     *   }
     * })
     *
     */
    delete<T extends SchoolRunDeleteArgs>(
      args: SelectSubset<T, SchoolRunDeleteArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<Prisma.$SchoolRunPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one SchoolRun.
     * @param {SchoolRunUpdateArgs} args - Arguments to update one SchoolRun.
     * @example
     * // Update one SchoolRun
     * const schoolRun = await prisma.schoolRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SchoolRunUpdateArgs>(
      args: SelectSubset<T, SchoolRunUpdateArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<Prisma.$SchoolRunPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more SchoolRuns.
     * @param {SchoolRunDeleteManyArgs} args - Arguments to filter SchoolRuns to delete.
     * @example
     * // Delete a few SchoolRuns
     * const { count } = await prisma.schoolRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SchoolRunDeleteManyArgs>(
      args?: SelectSubset<T, SchoolRunDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SchoolRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SchoolRuns
     * const schoolRun = await prisma.schoolRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SchoolRunUpdateManyArgs>(
      args: SelectSubset<T, SchoolRunUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SchoolRuns and returns the data updated in the database.
     * @param {SchoolRunUpdateManyAndReturnArgs} args - Arguments to update many SchoolRuns.
     * @example
     * // Update many SchoolRuns
     * const schoolRun = await prisma.schoolRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SchoolRuns and only return the `id`
     * const schoolRunWithIdOnly = await prisma.schoolRun.updateManyAndReturn({
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
    updateManyAndReturn<T extends SchoolRunUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SchoolRunUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SchoolRunPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one SchoolRun.
     * @param {SchoolRunUpsertArgs} args - Arguments to update or create a SchoolRun.
     * @example
     * // Update or create a SchoolRun
     * const schoolRun = await prisma.schoolRun.upsert({
     *   create: {
     *     // ... data to create a SchoolRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SchoolRun we want to update
     *   }
     * })
     */
    upsert<T extends SchoolRunUpsertArgs>(
      args: SelectSubset<T, SchoolRunUpsertArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      $Result.GetResult<Prisma.$SchoolRunPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of SchoolRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunCountArgs} args - Arguments to filter SchoolRuns to count.
     * @example
     * // Count the number of SchoolRuns
     * const count = await prisma.schoolRun.count({
     *   where: {
     *     // ... the filter for the SchoolRuns we want to count
     *   }
     * })
     **/
    count<T extends SchoolRunCountArgs>(
      args?: Subset<T, SchoolRunCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SchoolRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SchoolRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SchoolRunAggregateArgs>(
      args: Subset<T, SchoolRunAggregateArgs>
    ): Prisma.PrismaPromise<GetSchoolRunAggregateType<T>>

    /**
     * Group by SchoolRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SchoolRunGroupByArgs} args - Group by arguments.
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
      T extends SchoolRunGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SchoolRunGroupByArgs['orderBy'] }
        : { orderBy?: SchoolRunGroupByArgs['orderBy'] },
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
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
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
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SchoolRunGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetSchoolRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SchoolRun model
     */
    readonly fields: SchoolRunFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SchoolRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SchoolRunClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    drivers<T extends SchoolRun$driversArgs<ExtArgs> = {}>(
      args?: Subset<T, SchoolRun$driversArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >
    skips<T extends SchoolRun$skipsArgs<ExtArgs> = {}>(
      args?: Subset<T, SchoolRun$skipsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the SchoolRun model
   */
  interface SchoolRunFieldRefs {
    readonly id: FieldRef<'SchoolRun', 'String'>
    readonly kidId: FieldRef<'SchoolRun', 'String'>
    readonly weekday: FieldRef<'SchoolRun', 'Int'>
    readonly kind: FieldRef<'SchoolRun', 'String'>
    readonly place: FieldRef<'SchoolRun', 'String'>
    readonly minutes: FieldRef<'SchoolRun', 'Int'>
    readonly startsOn: FieldRef<'SchoolRun', 'DateTime'>
    readonly endsOn: FieldRef<'SchoolRun', 'DateTime'>
    readonly createdBy: FieldRef<'SchoolRun', 'String'>
    readonly createdAt: FieldRef<'SchoolRun', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * SchoolRun findUnique
   */
  export type SchoolRunFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter, which SchoolRun to fetch.
     */
    where: SchoolRunWhereUniqueInput
  }

  /**
   * SchoolRun findUniqueOrThrow
   */
  export type SchoolRunFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter, which SchoolRun to fetch.
     */
    where: SchoolRunWhereUniqueInput
  }

  /**
   * SchoolRun findFirst
   */
  export type SchoolRunFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter, which SchoolRun to fetch.
     */
    where?: SchoolRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SchoolRuns to fetch.
     */
    orderBy?: SchoolRunOrderByWithRelationInput | SchoolRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SchoolRuns.
     */
    cursor?: SchoolRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SchoolRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SchoolRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SchoolRuns.
     */
    distinct?: SchoolRunScalarFieldEnum | SchoolRunScalarFieldEnum[]
  }

  /**
   * SchoolRun findFirstOrThrow
   */
  export type SchoolRunFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter, which SchoolRun to fetch.
     */
    where?: SchoolRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SchoolRuns to fetch.
     */
    orderBy?: SchoolRunOrderByWithRelationInput | SchoolRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SchoolRuns.
     */
    cursor?: SchoolRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SchoolRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SchoolRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SchoolRuns.
     */
    distinct?: SchoolRunScalarFieldEnum | SchoolRunScalarFieldEnum[]
  }

  /**
   * SchoolRun findMany
   */
  export type SchoolRunFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter, which SchoolRuns to fetch.
     */
    where?: SchoolRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SchoolRuns to fetch.
     */
    orderBy?: SchoolRunOrderByWithRelationInput | SchoolRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SchoolRuns.
     */
    cursor?: SchoolRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SchoolRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SchoolRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SchoolRuns.
     */
    distinct?: SchoolRunScalarFieldEnum | SchoolRunScalarFieldEnum[]
  }

  /**
   * SchoolRun create
   */
  export type SchoolRunCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * The data needed to create a SchoolRun.
     */
    data: XOR<SchoolRunCreateInput, SchoolRunUncheckedCreateInput>
  }

  /**
   * SchoolRun createMany
   */
  export type SchoolRunCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many SchoolRuns.
     */
    data: SchoolRunCreateManyInput | SchoolRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SchoolRun createManyAndReturn
   */
  export type SchoolRunCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * The data used to create many SchoolRuns.
     */
    data: SchoolRunCreateManyInput | SchoolRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SchoolRun update
   */
  export type SchoolRunUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * The data needed to update a SchoolRun.
     */
    data: XOR<SchoolRunUpdateInput, SchoolRunUncheckedUpdateInput>
    /**
     * Choose, which SchoolRun to update.
     */
    where: SchoolRunWhereUniqueInput
  }

  /**
   * SchoolRun updateMany
   */
  export type SchoolRunUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update SchoolRuns.
     */
    data: XOR<SchoolRunUpdateManyMutationInput, SchoolRunUncheckedUpdateManyInput>
    /**
     * Filter which SchoolRuns to update
     */
    where?: SchoolRunWhereInput
    /**
     * Limit how many SchoolRuns to update.
     */
    limit?: number
  }

  /**
   * SchoolRun updateManyAndReturn
   */
  export type SchoolRunUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * The data used to update SchoolRuns.
     */
    data: XOR<SchoolRunUpdateManyMutationInput, SchoolRunUncheckedUpdateManyInput>
    /**
     * Filter which SchoolRuns to update
     */
    where?: SchoolRunWhereInput
    /**
     * Limit how many SchoolRuns to update.
     */
    limit?: number
  }

  /**
   * SchoolRun upsert
   */
  export type SchoolRunUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * The filter to search for the SchoolRun to update in case it exists.
     */
    where: SchoolRunWhereUniqueInput
    /**
     * In case the SchoolRun found by the `where` argument doesn't exist, create a new SchoolRun with this data.
     */
    create: XOR<SchoolRunCreateInput, SchoolRunUncheckedCreateInput>
    /**
     * In case the SchoolRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SchoolRunUpdateInput, SchoolRunUncheckedUpdateInput>
  }

  /**
   * SchoolRun delete
   */
  export type SchoolRunDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
    /**
     * Filter which SchoolRun to delete.
     */
    where: SchoolRunWhereUniqueInput
  }

  /**
   * SchoolRun deleteMany
   */
  export type SchoolRunDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SchoolRuns to delete
     */
    where?: SchoolRunWhereInput
    /**
     * Limit how many SchoolRuns to delete.
     */
    limit?: number
  }

  /**
   * SchoolRun.drivers
   */
  export type SchoolRun$driversArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    where?: RunDriverWhereInput
    orderBy?: RunDriverOrderByWithRelationInput | RunDriverOrderByWithRelationInput[]
    cursor?: RunDriverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunDriverScalarFieldEnum | RunDriverScalarFieldEnum[]
  }

  /**
   * SchoolRun.skips
   */
  export type SchoolRun$skipsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    where?: RunSkipWhereInput
    orderBy?: RunSkipOrderByWithRelationInput | RunSkipOrderByWithRelationInput[]
    cursor?: RunSkipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RunSkipScalarFieldEnum | RunSkipScalarFieldEnum[]
  }

  /**
   * SchoolRun without action
   */
  export type SchoolRunDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SchoolRun
     */
    select?: SchoolRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SchoolRun
     */
    omit?: SchoolRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SchoolRunInclude<ExtArgs> | null
  }

  /**
   * Model RunDriver
   */

  export type AggregateRunDriver = {
    _count: RunDriverCountAggregateOutputType | null
    _min: RunDriverMinAggregateOutputType | null
    _max: RunDriverMaxAggregateOutputType | null
  }

  export type RunDriverMinAggregateOutputType = {
    runId: string | null
    fromDate: Date | null
    driverId: string | null
    updatedBy: string | null
    updatedAt: Date | null
  }

  export type RunDriverMaxAggregateOutputType = {
    runId: string | null
    fromDate: Date | null
    driverId: string | null
    updatedBy: string | null
    updatedAt: Date | null
  }

  export type RunDriverCountAggregateOutputType = {
    runId: number
    fromDate: number
    driverId: number
    updatedBy: number
    updatedAt: number
    _all: number
  }

  export type RunDriverMinAggregateInputType = {
    runId?: true
    fromDate?: true
    driverId?: true
    updatedBy?: true
    updatedAt?: true
  }

  export type RunDriverMaxAggregateInputType = {
    runId?: true
    fromDate?: true
    driverId?: true
    updatedBy?: true
    updatedAt?: true
  }

  export type RunDriverCountAggregateInputType = {
    runId?: true
    fromDate?: true
    driverId?: true
    updatedBy?: true
    updatedAt?: true
    _all?: true
  }

  export type RunDriverAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RunDriver to aggregate.
     */
    where?: RunDriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunDrivers to fetch.
     */
    orderBy?: RunDriverOrderByWithRelationInput | RunDriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RunDriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunDrivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunDrivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RunDrivers
     **/
    _count?: true | RunDriverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RunDriverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RunDriverMaxAggregateInputType
  }

  export type GetRunDriverAggregateType<T extends RunDriverAggregateArgs> = {
    [P in keyof T & keyof AggregateRunDriver]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunDriver[P]>
      : GetScalarType<T[P], AggregateRunDriver[P]>
  }

  export type RunDriverGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RunDriverWhereInput
    orderBy?: RunDriverOrderByWithAggregationInput | RunDriverOrderByWithAggregationInput[]
    by: RunDriverScalarFieldEnum[] | RunDriverScalarFieldEnum
    having?: RunDriverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunDriverCountAggregateInputType | true
    _min?: RunDriverMinAggregateInputType
    _max?: RunDriverMaxAggregateInputType
  }

  export type RunDriverGroupByOutputType = {
    runId: string
    fromDate: Date
    driverId: string
    updatedBy: string
    updatedAt: Date
    _count: RunDriverCountAggregateOutputType | null
    _min: RunDriverMinAggregateOutputType | null
    _max: RunDriverMaxAggregateOutputType | null
  }

  type GetRunDriverGroupByPayload<T extends RunDriverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunDriverGroupByOutputType, T['by']> & {
        [P in keyof T & keyof RunDriverGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], RunDriverGroupByOutputType[P]>
          : GetScalarType<T[P], RunDriverGroupByOutputType[P]>
      }
    >
  >

  export type RunDriverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        runId?: boolean
        fromDate?: boolean
        driverId?: boolean
        updatedBy?: boolean
        updatedAt?: boolean
        run?: boolean | SchoolRunDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['runDriver']
    >

  export type RunDriverSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      runId?: boolean
      fromDate?: boolean
      driverId?: boolean
      updatedBy?: boolean
      updatedAt?: boolean
      run?: boolean | SchoolRunDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['runDriver']
  >

  export type RunDriverSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      runId?: boolean
      fromDate?: boolean
      driverId?: boolean
      updatedBy?: boolean
      updatedAt?: boolean
      run?: boolean | SchoolRunDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['runDriver']
  >

  export type RunDriverSelectScalar = {
    runId?: boolean
    fromDate?: boolean
    driverId?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
  }

  export type RunDriverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'runId' | 'fromDate' | 'driverId' | 'updatedBy' | 'updatedAt',
      ExtArgs['result']['runDriver']
    >
  export type RunDriverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      run?: boolean | SchoolRunDefaultArgs<ExtArgs>
    }
  export type RunDriverIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    run?: boolean | SchoolRunDefaultArgs<ExtArgs>
  }
  export type RunDriverIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    run?: boolean | SchoolRunDefaultArgs<ExtArgs>
  }

  export type $RunDriverPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'RunDriver'
    objects: {
      run: Prisma.$SchoolRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        runId: string
        fromDate: Date
        driverId: string
        updatedBy: string
        updatedAt: Date
      },
      ExtArgs['result']['runDriver']
    >
    composites: {}
  }

  type RunDriverGetPayload<S extends boolean | null | undefined | RunDriverDefaultArgs> =
    $Result.GetResult<Prisma.$RunDriverPayload, S>

  type RunDriverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunDriverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunDriverCountAggregateInputType | true
    }

  export interface RunDriverDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['RunDriver']
      meta: { name: 'RunDriver' }
    }
    /**
     * Find zero or one RunDriver that matches the filter.
     * @param {RunDriverFindUniqueArgs} args - Arguments to find a RunDriver
     * @example
     * // Get one RunDriver
     * const runDriver = await prisma.runDriver.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunDriverFindUniqueArgs>(
      args: SelectSubset<T, RunDriverFindUniqueArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one RunDriver that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunDriverFindUniqueOrThrowArgs} args - Arguments to find a RunDriver
     * @example
     * // Get one RunDriver
     * const runDriver = await prisma.runDriver.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunDriverFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RunDriverFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RunDriver that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverFindFirstArgs} args - Arguments to find a RunDriver
     * @example
     * // Get one RunDriver
     * const runDriver = await prisma.runDriver.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunDriverFindFirstArgs>(
      args?: SelectSubset<T, RunDriverFindFirstArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RunDriver that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverFindFirstOrThrowArgs} args - Arguments to find a RunDriver
     * @example
     * // Get one RunDriver
     * const runDriver = await prisma.runDriver.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunDriverFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RunDriverFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more RunDrivers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunDrivers
     * const runDrivers = await prisma.runDriver.findMany()
     *
     * // Get first 10 RunDrivers
     * const runDrivers = await prisma.runDriver.findMany({ take: 10 })
     *
     * // Only select the `runId`
     * const runDriverWithRunIdOnly = await prisma.runDriver.findMany({ select: { runId: true } })
     *
     */
    findMany<T extends RunDriverFindManyArgs>(
      args?: SelectSubset<T, RunDriverFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a RunDriver.
     * @param {RunDriverCreateArgs} args - Arguments to create a RunDriver.
     * @example
     * // Create one RunDriver
     * const RunDriver = await prisma.runDriver.create({
     *   data: {
     *     // ... data to create a RunDriver
     *   }
     * })
     *
     */
    create<T extends RunDriverCreateArgs>(
      args: SelectSubset<T, RunDriverCreateArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many RunDrivers.
     * @param {RunDriverCreateManyArgs} args - Arguments to create many RunDrivers.
     * @example
     * // Create many RunDrivers
     * const runDriver = await prisma.runDriver.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RunDriverCreateManyArgs>(
      args?: SelectSubset<T, RunDriverCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunDrivers and returns the data saved in the database.
     * @param {RunDriverCreateManyAndReturnArgs} args - Arguments to create many RunDrivers.
     * @example
     * // Create many RunDrivers
     * const runDriver = await prisma.runDriver.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RunDrivers and only return the `runId`
     * const runDriverWithRunIdOnly = await prisma.runDriver.createManyAndReturn({
     *   select: { runId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RunDriverCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RunDriverCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a RunDriver.
     * @param {RunDriverDeleteArgs} args - Arguments to delete one RunDriver.
     * @example
     * // Delete one RunDriver
     * const RunDriver = await prisma.runDriver.delete({
     *   where: {
     *     // ... filter to delete one RunDriver
     *   }
     * })
     *
     */
    delete<T extends RunDriverDeleteArgs>(
      args: SelectSubset<T, RunDriverDeleteArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one RunDriver.
     * @param {RunDriverUpdateArgs} args - Arguments to update one RunDriver.
     * @example
     * // Update one RunDriver
     * const runDriver = await prisma.runDriver.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RunDriverUpdateArgs>(
      args: SelectSubset<T, RunDriverUpdateArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more RunDrivers.
     * @param {RunDriverDeleteManyArgs} args - Arguments to filter RunDrivers to delete.
     * @example
     * // Delete a few RunDrivers
     * const { count } = await prisma.runDriver.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RunDriverDeleteManyArgs>(
      args?: SelectSubset<T, RunDriverDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunDrivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunDrivers
     * const runDriver = await prisma.runDriver.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RunDriverUpdateManyArgs>(
      args: SelectSubset<T, RunDriverUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunDrivers and returns the data updated in the database.
     * @param {RunDriverUpdateManyAndReturnArgs} args - Arguments to update many RunDrivers.
     * @example
     * // Update many RunDrivers
     * const runDriver = await prisma.runDriver.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RunDrivers and only return the `runId`
     * const runDriverWithRunIdOnly = await prisma.runDriver.updateManyAndReturn({
     *   select: { runId: true },
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
    updateManyAndReturn<T extends RunDriverUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RunDriverUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RunDriverPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one RunDriver.
     * @param {RunDriverUpsertArgs} args - Arguments to update or create a RunDriver.
     * @example
     * // Update or create a RunDriver
     * const runDriver = await prisma.runDriver.upsert({
     *   create: {
     *     // ... data to create a RunDriver
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunDriver we want to update
     *   }
     * })
     */
    upsert<T extends RunDriverUpsertArgs>(
      args: SelectSubset<T, RunDriverUpsertArgs<ExtArgs>>
    ): Prisma__RunDriverClient<
      $Result.GetResult<Prisma.$RunDriverPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of RunDrivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverCountArgs} args - Arguments to filter RunDrivers to count.
     * @example
     * // Count the number of RunDrivers
     * const count = await prisma.runDriver.count({
     *   where: {
     *     // ... the filter for the RunDrivers we want to count
     *   }
     * })
     **/
    count<T extends RunDriverCountArgs>(
      args?: Subset<T, RunDriverCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunDriverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunDriver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RunDriverAggregateArgs>(
      args: Subset<T, RunDriverAggregateArgs>
    ): Prisma.PrismaPromise<GetRunDriverAggregateType<T>>

    /**
     * Group by RunDriver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunDriverGroupByArgs} args - Group by arguments.
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
      T extends RunDriverGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunDriverGroupByArgs['orderBy'] }
        : { orderBy?: RunDriverGroupByArgs['orderBy'] },
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
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
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
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RunDriverGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetRunDriverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the RunDriver model
     */
    readonly fields: RunDriverFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunDriver.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunDriverClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    run<T extends SchoolRunDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, SchoolRunDefaultArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      | $Result.GetResult<
          Prisma.$SchoolRunPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the RunDriver model
   */
  interface RunDriverFieldRefs {
    readonly runId: FieldRef<'RunDriver', 'String'>
    readonly fromDate: FieldRef<'RunDriver', 'DateTime'>
    readonly driverId: FieldRef<'RunDriver', 'String'>
    readonly updatedBy: FieldRef<'RunDriver', 'String'>
    readonly updatedAt: FieldRef<'RunDriver', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * RunDriver findUnique
   */
  export type RunDriverFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter, which RunDriver to fetch.
     */
    where: RunDriverWhereUniqueInput
  }

  /**
   * RunDriver findUniqueOrThrow
   */
  export type RunDriverFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter, which RunDriver to fetch.
     */
    where: RunDriverWhereUniqueInput
  }

  /**
   * RunDriver findFirst
   */
  export type RunDriverFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter, which RunDriver to fetch.
     */
    where?: RunDriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunDrivers to fetch.
     */
    orderBy?: RunDriverOrderByWithRelationInput | RunDriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RunDrivers.
     */
    cursor?: RunDriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunDrivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunDrivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunDrivers.
     */
    distinct?: RunDriverScalarFieldEnum | RunDriverScalarFieldEnum[]
  }

  /**
   * RunDriver findFirstOrThrow
   */
  export type RunDriverFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter, which RunDriver to fetch.
     */
    where?: RunDriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunDrivers to fetch.
     */
    orderBy?: RunDriverOrderByWithRelationInput | RunDriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RunDrivers.
     */
    cursor?: RunDriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunDrivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunDrivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunDrivers.
     */
    distinct?: RunDriverScalarFieldEnum | RunDriverScalarFieldEnum[]
  }

  /**
   * RunDriver findMany
   */
  export type RunDriverFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter, which RunDrivers to fetch.
     */
    where?: RunDriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunDrivers to fetch.
     */
    orderBy?: RunDriverOrderByWithRelationInput | RunDriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RunDrivers.
     */
    cursor?: RunDriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunDrivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunDrivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunDrivers.
     */
    distinct?: RunDriverScalarFieldEnum | RunDriverScalarFieldEnum[]
  }

  /**
   * RunDriver create
   */
  export type RunDriverCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * The data needed to create a RunDriver.
     */
    data: XOR<RunDriverCreateInput, RunDriverUncheckedCreateInput>
  }

  /**
   * RunDriver createMany
   */
  export type RunDriverCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many RunDrivers.
     */
    data: RunDriverCreateManyInput | RunDriverCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RunDriver createManyAndReturn
   */
  export type RunDriverCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * The data used to create many RunDrivers.
     */
    data: RunDriverCreateManyInput | RunDriverCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunDriver update
   */
  export type RunDriverUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * The data needed to update a RunDriver.
     */
    data: XOR<RunDriverUpdateInput, RunDriverUncheckedUpdateInput>
    /**
     * Choose, which RunDriver to update.
     */
    where: RunDriverWhereUniqueInput
  }

  /**
   * RunDriver updateMany
   */
  export type RunDriverUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update RunDrivers.
     */
    data: XOR<RunDriverUpdateManyMutationInput, RunDriverUncheckedUpdateManyInput>
    /**
     * Filter which RunDrivers to update
     */
    where?: RunDriverWhereInput
    /**
     * Limit how many RunDrivers to update.
     */
    limit?: number
  }

  /**
   * RunDriver updateManyAndReturn
   */
  export type RunDriverUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * The data used to update RunDrivers.
     */
    data: XOR<RunDriverUpdateManyMutationInput, RunDriverUncheckedUpdateManyInput>
    /**
     * Filter which RunDrivers to update
     */
    where?: RunDriverWhereInput
    /**
     * Limit how many RunDrivers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunDriver upsert
   */
  export type RunDriverUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * The filter to search for the RunDriver to update in case it exists.
     */
    where: RunDriverWhereUniqueInput
    /**
     * In case the RunDriver found by the `where` argument doesn't exist, create a new RunDriver with this data.
     */
    create: XOR<RunDriverCreateInput, RunDriverUncheckedCreateInput>
    /**
     * In case the RunDriver was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunDriverUpdateInput, RunDriverUncheckedUpdateInput>
  }

  /**
   * RunDriver delete
   */
  export type RunDriverDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
    /**
     * Filter which RunDriver to delete.
     */
    where: RunDriverWhereUniqueInput
  }

  /**
   * RunDriver deleteMany
   */
  export type RunDriverDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RunDrivers to delete
     */
    where?: RunDriverWhereInput
    /**
     * Limit how many RunDrivers to delete.
     */
    limit?: number
  }

  /**
   * RunDriver without action
   */
  export type RunDriverDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunDriver
     */
    select?: RunDriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunDriver
     */
    omit?: RunDriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunDriverInclude<ExtArgs> | null
  }

  /**
   * Model RunSkip
   */

  export type AggregateRunSkip = {
    _count: RunSkipCountAggregateOutputType | null
    _min: RunSkipMinAggregateOutputType | null
    _max: RunSkipMaxAggregateOutputType | null
  }

  export type RunSkipMinAggregateOutputType = {
    runId: string | null
    date: Date | null
    updatedBy: string | null
  }

  export type RunSkipMaxAggregateOutputType = {
    runId: string | null
    date: Date | null
    updatedBy: string | null
  }

  export type RunSkipCountAggregateOutputType = {
    runId: number
    date: number
    updatedBy: number
    _all: number
  }

  export type RunSkipMinAggregateInputType = {
    runId?: true
    date?: true
    updatedBy?: true
  }

  export type RunSkipMaxAggregateInputType = {
    runId?: true
    date?: true
    updatedBy?: true
  }

  export type RunSkipCountAggregateInputType = {
    runId?: true
    date?: true
    updatedBy?: true
    _all?: true
  }

  export type RunSkipAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RunSkip to aggregate.
     */
    where?: RunSkipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunSkips to fetch.
     */
    orderBy?: RunSkipOrderByWithRelationInput | RunSkipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RunSkipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunSkips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunSkips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RunSkips
     **/
    _count?: true | RunSkipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RunSkipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RunSkipMaxAggregateInputType
  }

  export type GetRunSkipAggregateType<T extends RunSkipAggregateArgs> = {
    [P in keyof T & keyof AggregateRunSkip]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunSkip[P]>
      : GetScalarType<T[P], AggregateRunSkip[P]>
  }

  export type RunSkipGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RunSkipWhereInput
    orderBy?: RunSkipOrderByWithAggregationInput | RunSkipOrderByWithAggregationInput[]
    by: RunSkipScalarFieldEnum[] | RunSkipScalarFieldEnum
    having?: RunSkipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunSkipCountAggregateInputType | true
    _min?: RunSkipMinAggregateInputType
    _max?: RunSkipMaxAggregateInputType
  }

  export type RunSkipGroupByOutputType = {
    runId: string
    date: Date
    updatedBy: string
    _count: RunSkipCountAggregateOutputType | null
    _min: RunSkipMinAggregateOutputType | null
    _max: RunSkipMaxAggregateOutputType | null
  }

  type GetRunSkipGroupByPayload<T extends RunSkipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunSkipGroupByOutputType, T['by']> & {
        [P in keyof T & keyof RunSkipGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], RunSkipGroupByOutputType[P]>
          : GetScalarType<T[P], RunSkipGroupByOutputType[P]>
      }
    >
  >

  export type RunSkipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        runId?: boolean
        date?: boolean
        updatedBy?: boolean
        run?: boolean | SchoolRunDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['runSkip']
    >

  export type RunSkipSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      runId?: boolean
      date?: boolean
      updatedBy?: boolean
      run?: boolean | SchoolRunDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['runSkip']
  >

  export type RunSkipSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      runId?: boolean
      date?: boolean
      updatedBy?: boolean
      run?: boolean | SchoolRunDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['runSkip']
  >

  export type RunSkipSelectScalar = {
    runId?: boolean
    date?: boolean
    updatedBy?: boolean
  }

  export type RunSkipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<'runId' | 'date' | 'updatedBy', ExtArgs['result']['runSkip']>
  export type RunSkipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | SchoolRunDefaultArgs<ExtArgs>
  }
  export type RunSkipIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    run?: boolean | SchoolRunDefaultArgs<ExtArgs>
  }
  export type RunSkipIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    run?: boolean | SchoolRunDefaultArgs<ExtArgs>
  }

  export type $RunSkipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'RunSkip'
      objects: {
        run: Prisma.$SchoolRunPayload<ExtArgs>
      }
      scalars: $Extensions.GetPayloadResult<
        {
          runId: string
          date: Date
          updatedBy: string
        },
        ExtArgs['result']['runSkip']
      >
      composites: {}
    }

  type RunSkipGetPayload<S extends boolean | null | undefined | RunSkipDefaultArgs> =
    $Result.GetResult<Prisma.$RunSkipPayload, S>

  type RunSkipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    RunSkipFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: RunSkipCountAggregateInputType | true
  }

  export interface RunSkipDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RunSkip']; meta: { name: 'RunSkip' } }
    /**
     * Find zero or one RunSkip that matches the filter.
     * @param {RunSkipFindUniqueArgs} args - Arguments to find a RunSkip
     * @example
     * // Get one RunSkip
     * const runSkip = await prisma.runSkip.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunSkipFindUniqueArgs>(
      args: SelectSubset<T, RunSkipFindUniqueArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one RunSkip that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunSkipFindUniqueOrThrowArgs} args - Arguments to find a RunSkip
     * @example
     * // Get one RunSkip
     * const runSkip = await prisma.runSkip.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunSkipFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RunSkipFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RunSkip that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipFindFirstArgs} args - Arguments to find a RunSkip
     * @example
     * // Get one RunSkip
     * const runSkip = await prisma.runSkip.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunSkipFindFirstArgs>(
      args?: SelectSubset<T, RunSkipFindFirstArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RunSkip that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipFindFirstOrThrowArgs} args - Arguments to find a RunSkip
     * @example
     * // Get one RunSkip
     * const runSkip = await prisma.runSkip.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunSkipFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RunSkipFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more RunSkips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunSkips
     * const runSkips = await prisma.runSkip.findMany()
     *
     * // Get first 10 RunSkips
     * const runSkips = await prisma.runSkip.findMany({ take: 10 })
     *
     * // Only select the `runId`
     * const runSkipWithRunIdOnly = await prisma.runSkip.findMany({ select: { runId: true } })
     *
     */
    findMany<T extends RunSkipFindManyArgs>(
      args?: SelectSubset<T, RunSkipFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a RunSkip.
     * @param {RunSkipCreateArgs} args - Arguments to create a RunSkip.
     * @example
     * // Create one RunSkip
     * const RunSkip = await prisma.runSkip.create({
     *   data: {
     *     // ... data to create a RunSkip
     *   }
     * })
     *
     */
    create<T extends RunSkipCreateArgs>(
      args: SelectSubset<T, RunSkipCreateArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many RunSkips.
     * @param {RunSkipCreateManyArgs} args - Arguments to create many RunSkips.
     * @example
     * // Create many RunSkips
     * const runSkip = await prisma.runSkip.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RunSkipCreateManyArgs>(
      args?: SelectSubset<T, RunSkipCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunSkips and returns the data saved in the database.
     * @param {RunSkipCreateManyAndReturnArgs} args - Arguments to create many RunSkips.
     * @example
     * // Create many RunSkips
     * const runSkip = await prisma.runSkip.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RunSkips and only return the `runId`
     * const runSkipWithRunIdOnly = await prisma.runSkip.createManyAndReturn({
     *   select: { runId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RunSkipCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RunSkipCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RunSkipPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a RunSkip.
     * @param {RunSkipDeleteArgs} args - Arguments to delete one RunSkip.
     * @example
     * // Delete one RunSkip
     * const RunSkip = await prisma.runSkip.delete({
     *   where: {
     *     // ... filter to delete one RunSkip
     *   }
     * })
     *
     */
    delete<T extends RunSkipDeleteArgs>(
      args: SelectSubset<T, RunSkipDeleteArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one RunSkip.
     * @param {RunSkipUpdateArgs} args - Arguments to update one RunSkip.
     * @example
     * // Update one RunSkip
     * const runSkip = await prisma.runSkip.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RunSkipUpdateArgs>(
      args: SelectSubset<T, RunSkipUpdateArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more RunSkips.
     * @param {RunSkipDeleteManyArgs} args - Arguments to filter RunSkips to delete.
     * @example
     * // Delete a few RunSkips
     * const { count } = await prisma.runSkip.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RunSkipDeleteManyArgs>(
      args?: SelectSubset<T, RunSkipDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunSkips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunSkips
     * const runSkip = await prisma.runSkip.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RunSkipUpdateManyArgs>(
      args: SelectSubset<T, RunSkipUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunSkips and returns the data updated in the database.
     * @param {RunSkipUpdateManyAndReturnArgs} args - Arguments to update many RunSkips.
     * @example
     * // Update many RunSkips
     * const runSkip = await prisma.runSkip.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RunSkips and only return the `runId`
     * const runSkipWithRunIdOnly = await prisma.runSkip.updateManyAndReturn({
     *   select: { runId: true },
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
    updateManyAndReturn<T extends RunSkipUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RunSkipUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RunSkipPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one RunSkip.
     * @param {RunSkipUpsertArgs} args - Arguments to update or create a RunSkip.
     * @example
     * // Update or create a RunSkip
     * const runSkip = await prisma.runSkip.upsert({
     *   create: {
     *     // ... data to create a RunSkip
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunSkip we want to update
     *   }
     * })
     */
    upsert<T extends RunSkipUpsertArgs>(
      args: SelectSubset<T, RunSkipUpsertArgs<ExtArgs>>
    ): Prisma__RunSkipClient<
      $Result.GetResult<Prisma.$RunSkipPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of RunSkips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipCountArgs} args - Arguments to filter RunSkips to count.
     * @example
     * // Count the number of RunSkips
     * const count = await prisma.runSkip.count({
     *   where: {
     *     // ... the filter for the RunSkips we want to count
     *   }
     * })
     **/
    count<T extends RunSkipCountArgs>(
      args?: Subset<T, RunSkipCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunSkipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunSkip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RunSkipAggregateArgs>(
      args: Subset<T, RunSkipAggregateArgs>
    ): Prisma.PrismaPromise<GetRunSkipAggregateType<T>>

    /**
     * Group by RunSkip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunSkipGroupByArgs} args - Group by arguments.
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
      T extends RunSkipGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunSkipGroupByArgs['orderBy'] }
        : { orderBy?: RunSkipGroupByArgs['orderBy'] },
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
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
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
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RunSkipGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetRunSkipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the RunSkip model
     */
    readonly fields: RunSkipFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunSkip.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunSkipClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    run<T extends SchoolRunDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, SchoolRunDefaultArgs<ExtArgs>>
    ): Prisma__SchoolRunClient<
      | $Result.GetResult<
          Prisma.$SchoolRunPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the RunSkip model
   */
  interface RunSkipFieldRefs {
    readonly runId: FieldRef<'RunSkip', 'String'>
    readonly date: FieldRef<'RunSkip', 'DateTime'>
    readonly updatedBy: FieldRef<'RunSkip', 'String'>
  }

  // Custom InputTypes
  /**
   * RunSkip findUnique
   */
  export type RunSkipFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter, which RunSkip to fetch.
     */
    where: RunSkipWhereUniqueInput
  }

  /**
   * RunSkip findUniqueOrThrow
   */
  export type RunSkipFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter, which RunSkip to fetch.
     */
    where: RunSkipWhereUniqueInput
  }

  /**
   * RunSkip findFirst
   */
  export type RunSkipFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter, which RunSkip to fetch.
     */
    where?: RunSkipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunSkips to fetch.
     */
    orderBy?: RunSkipOrderByWithRelationInput | RunSkipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RunSkips.
     */
    cursor?: RunSkipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunSkips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunSkips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunSkips.
     */
    distinct?: RunSkipScalarFieldEnum | RunSkipScalarFieldEnum[]
  }

  /**
   * RunSkip findFirstOrThrow
   */
  export type RunSkipFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter, which RunSkip to fetch.
     */
    where?: RunSkipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunSkips to fetch.
     */
    orderBy?: RunSkipOrderByWithRelationInput | RunSkipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RunSkips.
     */
    cursor?: RunSkipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunSkips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunSkips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunSkips.
     */
    distinct?: RunSkipScalarFieldEnum | RunSkipScalarFieldEnum[]
  }

  /**
   * RunSkip findMany
   */
  export type RunSkipFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter, which RunSkips to fetch.
     */
    where?: RunSkipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RunSkips to fetch.
     */
    orderBy?: RunSkipOrderByWithRelationInput | RunSkipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RunSkips.
     */
    cursor?: RunSkipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RunSkips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RunSkips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RunSkips.
     */
    distinct?: RunSkipScalarFieldEnum | RunSkipScalarFieldEnum[]
  }

  /**
   * RunSkip create
   */
  export type RunSkipCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * The data needed to create a RunSkip.
     */
    data: XOR<RunSkipCreateInput, RunSkipUncheckedCreateInput>
  }

  /**
   * RunSkip createMany
   */
  export type RunSkipCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many RunSkips.
     */
    data: RunSkipCreateManyInput | RunSkipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RunSkip createManyAndReturn
   */
  export type RunSkipCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * The data used to create many RunSkips.
     */
    data: RunSkipCreateManyInput | RunSkipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunSkip update
   */
  export type RunSkipUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * The data needed to update a RunSkip.
     */
    data: XOR<RunSkipUpdateInput, RunSkipUncheckedUpdateInput>
    /**
     * Choose, which RunSkip to update.
     */
    where: RunSkipWhereUniqueInput
  }

  /**
   * RunSkip updateMany
   */
  export type RunSkipUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update RunSkips.
     */
    data: XOR<RunSkipUpdateManyMutationInput, RunSkipUncheckedUpdateManyInput>
    /**
     * Filter which RunSkips to update
     */
    where?: RunSkipWhereInput
    /**
     * Limit how many RunSkips to update.
     */
    limit?: number
  }

  /**
   * RunSkip updateManyAndReturn
   */
  export type RunSkipUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * The data used to update RunSkips.
     */
    data: XOR<RunSkipUpdateManyMutationInput, RunSkipUncheckedUpdateManyInput>
    /**
     * Filter which RunSkips to update
     */
    where?: RunSkipWhereInput
    /**
     * Limit how many RunSkips to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RunSkip upsert
   */
  export type RunSkipUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * The filter to search for the RunSkip to update in case it exists.
     */
    where: RunSkipWhereUniqueInput
    /**
     * In case the RunSkip found by the `where` argument doesn't exist, create a new RunSkip with this data.
     */
    create: XOR<RunSkipCreateInput, RunSkipUncheckedCreateInput>
    /**
     * In case the RunSkip was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunSkipUpdateInput, RunSkipUncheckedUpdateInput>
  }

  /**
   * RunSkip delete
   */
  export type RunSkipDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
    /**
     * Filter which RunSkip to delete.
     */
    where: RunSkipWhereUniqueInput
  }

  /**
   * RunSkip deleteMany
   */
  export type RunSkipDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which RunSkips to delete
     */
    where?: RunSkipWhereInput
    /**
     * Limit how many RunSkips to delete.
     */
    limit?: number
  }

  /**
   * RunSkip without action
   */
  export type RunSkipDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RunSkip
     */
    select?: RunSkipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunSkip
     */
    omit?: RunSkipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RunSkipInclude<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted'
    ReadCommitted: 'ReadCommitted'
    RepeatableRead: 'RepeatableRead'
    Serializable: 'Serializable'
  }

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

  export const SchoolRunScalarFieldEnum: {
    id: 'id'
    kidId: 'kidId'
    weekday: 'weekday'
    kind: 'kind'
    place: 'place'
    minutes: 'minutes'
    startsOn: 'startsOn'
    endsOn: 'endsOn'
    createdBy: 'createdBy'
    createdAt: 'createdAt'
  }

  export type SchoolRunScalarFieldEnum =
    (typeof SchoolRunScalarFieldEnum)[keyof typeof SchoolRunScalarFieldEnum]

  export const RunDriverScalarFieldEnum: {
    runId: 'runId'
    fromDate: 'fromDate'
    driverId: 'driverId'
    updatedBy: 'updatedBy'
    updatedAt: 'updatedAt'
  }

  export type RunDriverScalarFieldEnum =
    (typeof RunDriverScalarFieldEnum)[keyof typeof RunDriverScalarFieldEnum]

  export const RunSkipScalarFieldEnum: {
    runId: 'runId'
    date: 'date'
    updatedBy: 'updatedBy'
  }

  export type RunSkipScalarFieldEnum =
    (typeof RunSkipScalarFieldEnum)[keyof typeof RunSkipScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const QueryMode: {
    default: 'default'
    insensitive: 'insensitive'
  }

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

  export const NullsOrder: {
    first: 'first'
    last: 'last'
  }

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
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >

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

  export type SchoolRunWhereInput = {
    AND?: SchoolRunWhereInput | SchoolRunWhereInput[]
    OR?: SchoolRunWhereInput[]
    NOT?: SchoolRunWhereInput | SchoolRunWhereInput[]
    id?: UuidFilter<'SchoolRun'> | string
    kidId?: StringFilter<'SchoolRun'> | string
    weekday?: IntFilter<'SchoolRun'> | number
    kind?: StringFilter<'SchoolRun'> | string
    place?: StringNullableFilter<'SchoolRun'> | string | null
    minutes?: IntFilter<'SchoolRun'> | number
    startsOn?: DateTimeFilter<'SchoolRun'> | Date | string
    endsOn?: DateTimeNullableFilter<'SchoolRun'> | Date | string | null
    createdBy?: StringFilter<'SchoolRun'> | string
    createdAt?: DateTimeFilter<'SchoolRun'> | Date | string
    drivers?: RunDriverListRelationFilter
    skips?: RunSkipListRelationFilter
  }

  export type SchoolRunOrderByWithRelationInput = {
    id?: SortOrder
    kidId?: SortOrder
    weekday?: SortOrder
    kind?: SortOrder
    place?: SortOrderInput | SortOrder
    minutes?: SortOrder
    startsOn?: SortOrder
    endsOn?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    drivers?: RunDriverOrderByRelationAggregateInput
    skips?: RunSkipOrderByRelationAggregateInput
  }

  export type SchoolRunWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: SchoolRunWhereInput | SchoolRunWhereInput[]
      OR?: SchoolRunWhereInput[]
      NOT?: SchoolRunWhereInput | SchoolRunWhereInput[]
      kidId?: StringFilter<'SchoolRun'> | string
      weekday?: IntFilter<'SchoolRun'> | number
      kind?: StringFilter<'SchoolRun'> | string
      place?: StringNullableFilter<'SchoolRun'> | string | null
      minutes?: IntFilter<'SchoolRun'> | number
      startsOn?: DateTimeFilter<'SchoolRun'> | Date | string
      endsOn?: DateTimeNullableFilter<'SchoolRun'> | Date | string | null
      createdBy?: StringFilter<'SchoolRun'> | string
      createdAt?: DateTimeFilter<'SchoolRun'> | Date | string
      drivers?: RunDriverListRelationFilter
      skips?: RunSkipListRelationFilter
    },
    'id'
  >

  export type SchoolRunOrderByWithAggregationInput = {
    id?: SortOrder
    kidId?: SortOrder
    weekday?: SortOrder
    kind?: SortOrder
    place?: SortOrderInput | SortOrder
    minutes?: SortOrder
    startsOn?: SortOrder
    endsOn?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: SchoolRunCountOrderByAggregateInput
    _avg?: SchoolRunAvgOrderByAggregateInput
    _max?: SchoolRunMaxOrderByAggregateInput
    _min?: SchoolRunMinOrderByAggregateInput
    _sum?: SchoolRunSumOrderByAggregateInput
  }

  export type SchoolRunScalarWhereWithAggregatesInput = {
    AND?: SchoolRunScalarWhereWithAggregatesInput | SchoolRunScalarWhereWithAggregatesInput[]
    OR?: SchoolRunScalarWhereWithAggregatesInput[]
    NOT?: SchoolRunScalarWhereWithAggregatesInput | SchoolRunScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<'SchoolRun'> | string
    kidId?: StringWithAggregatesFilter<'SchoolRun'> | string
    weekday?: IntWithAggregatesFilter<'SchoolRun'> | number
    kind?: StringWithAggregatesFilter<'SchoolRun'> | string
    place?: StringNullableWithAggregatesFilter<'SchoolRun'> | string | null
    minutes?: IntWithAggregatesFilter<'SchoolRun'> | number
    startsOn?: DateTimeWithAggregatesFilter<'SchoolRun'> | Date | string
    endsOn?: DateTimeNullableWithAggregatesFilter<'SchoolRun'> | Date | string | null
    createdBy?: StringWithAggregatesFilter<'SchoolRun'> | string
    createdAt?: DateTimeWithAggregatesFilter<'SchoolRun'> | Date | string
  }

  export type RunDriverWhereInput = {
    AND?: RunDriverWhereInput | RunDriverWhereInput[]
    OR?: RunDriverWhereInput[]
    NOT?: RunDriverWhereInput | RunDriverWhereInput[]
    runId?: UuidFilter<'RunDriver'> | string
    fromDate?: DateTimeFilter<'RunDriver'> | Date | string
    driverId?: StringFilter<'RunDriver'> | string
    updatedBy?: StringFilter<'RunDriver'> | string
    updatedAt?: DateTimeFilter<'RunDriver'> | Date | string
    run?: XOR<SchoolRunScalarRelationFilter, SchoolRunWhereInput>
  }

  export type RunDriverOrderByWithRelationInput = {
    runId?: SortOrder
    fromDate?: SortOrder
    driverId?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
    run?: SchoolRunOrderByWithRelationInput
  }

  export type RunDriverWhereUniqueInput = Prisma.AtLeast<
    {
      runId_fromDate?: RunDriverRunIdFromDateCompoundUniqueInput
      AND?: RunDriverWhereInput | RunDriverWhereInput[]
      OR?: RunDriverWhereInput[]
      NOT?: RunDriverWhereInput | RunDriverWhereInput[]
      runId?: UuidFilter<'RunDriver'> | string
      fromDate?: DateTimeFilter<'RunDriver'> | Date | string
      driverId?: StringFilter<'RunDriver'> | string
      updatedBy?: StringFilter<'RunDriver'> | string
      updatedAt?: DateTimeFilter<'RunDriver'> | Date | string
      run?: XOR<SchoolRunScalarRelationFilter, SchoolRunWhereInput>
    },
    'runId_fromDate'
  >

  export type RunDriverOrderByWithAggregationInput = {
    runId?: SortOrder
    fromDate?: SortOrder
    driverId?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
    _count?: RunDriverCountOrderByAggregateInput
    _max?: RunDriverMaxOrderByAggregateInput
    _min?: RunDriverMinOrderByAggregateInput
  }

  export type RunDriverScalarWhereWithAggregatesInput = {
    AND?: RunDriverScalarWhereWithAggregatesInput | RunDriverScalarWhereWithAggregatesInput[]
    OR?: RunDriverScalarWhereWithAggregatesInput[]
    NOT?: RunDriverScalarWhereWithAggregatesInput | RunDriverScalarWhereWithAggregatesInput[]
    runId?: UuidWithAggregatesFilter<'RunDriver'> | string
    fromDate?: DateTimeWithAggregatesFilter<'RunDriver'> | Date | string
    driverId?: StringWithAggregatesFilter<'RunDriver'> | string
    updatedBy?: StringWithAggregatesFilter<'RunDriver'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'RunDriver'> | Date | string
  }

  export type RunSkipWhereInput = {
    AND?: RunSkipWhereInput | RunSkipWhereInput[]
    OR?: RunSkipWhereInput[]
    NOT?: RunSkipWhereInput | RunSkipWhereInput[]
    runId?: UuidFilter<'RunSkip'> | string
    date?: DateTimeFilter<'RunSkip'> | Date | string
    updatedBy?: StringFilter<'RunSkip'> | string
    run?: XOR<SchoolRunScalarRelationFilter, SchoolRunWhereInput>
  }

  export type RunSkipOrderByWithRelationInput = {
    runId?: SortOrder
    date?: SortOrder
    updatedBy?: SortOrder
    run?: SchoolRunOrderByWithRelationInput
  }

  export type RunSkipWhereUniqueInput = Prisma.AtLeast<
    {
      runId_date?: RunSkipRunIdDateCompoundUniqueInput
      AND?: RunSkipWhereInput | RunSkipWhereInput[]
      OR?: RunSkipWhereInput[]
      NOT?: RunSkipWhereInput | RunSkipWhereInput[]
      runId?: UuidFilter<'RunSkip'> | string
      date?: DateTimeFilter<'RunSkip'> | Date | string
      updatedBy?: StringFilter<'RunSkip'> | string
      run?: XOR<SchoolRunScalarRelationFilter, SchoolRunWhereInput>
    },
    'runId_date'
  >

  export type RunSkipOrderByWithAggregationInput = {
    runId?: SortOrder
    date?: SortOrder
    updatedBy?: SortOrder
    _count?: RunSkipCountOrderByAggregateInput
    _max?: RunSkipMaxOrderByAggregateInput
    _min?: RunSkipMinOrderByAggregateInput
  }

  export type RunSkipScalarWhereWithAggregatesInput = {
    AND?: RunSkipScalarWhereWithAggregatesInput | RunSkipScalarWhereWithAggregatesInput[]
    OR?: RunSkipScalarWhereWithAggregatesInput[]
    NOT?: RunSkipScalarWhereWithAggregatesInput | RunSkipScalarWhereWithAggregatesInput[]
    runId?: UuidWithAggregatesFilter<'RunSkip'> | string
    date?: DateTimeWithAggregatesFilter<'RunSkip'> | Date | string
    updatedBy?: StringWithAggregatesFilter<'RunSkip'> | string
  }

  export type SchoolRunCreateInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    drivers?: RunDriverCreateNestedManyWithoutRunInput
    skips?: RunSkipCreateNestedManyWithoutRunInput
  }

  export type SchoolRunUncheckedCreateInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    drivers?: RunDriverUncheckedCreateNestedManyWithoutRunInput
    skips?: RunSkipUncheckedCreateNestedManyWithoutRunInput
  }

  export type SchoolRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drivers?: RunDriverUpdateManyWithoutRunNestedInput
    skips?: RunSkipUpdateManyWithoutRunNestedInput
  }

  export type SchoolRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drivers?: RunDriverUncheckedUpdateManyWithoutRunNestedInput
    skips?: RunSkipUncheckedUpdateManyWithoutRunNestedInput
  }

  export type SchoolRunCreateManyInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type SchoolRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SchoolRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunDriverCreateInput = {
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
    run: SchoolRunCreateNestedOneWithoutDriversInput
  }

  export type RunDriverUncheckedCreateInput = {
    runId: string
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
  }

  export type RunDriverUpdateInput = {
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: SchoolRunUpdateOneRequiredWithoutDriversNestedInput
  }

  export type RunDriverUncheckedUpdateInput = {
    runId?: StringFieldUpdateOperationsInput | string
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunDriverCreateManyInput = {
    runId: string
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
  }

  export type RunDriverUpdateManyMutationInput = {
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunDriverUncheckedUpdateManyInput = {
    runId?: StringFieldUpdateOperationsInput | string
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunSkipCreateInput = {
    date: Date | string
    updatedBy: string
    run: SchoolRunCreateNestedOneWithoutSkipsInput
  }

  export type RunSkipUncheckedCreateInput = {
    runId: string
    date: Date | string
    updatedBy: string
  }

  export type RunSkipUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    run?: SchoolRunUpdateOneRequiredWithoutSkipsNestedInput
  }

  export type RunSkipUncheckedUpdateInput = {
    runId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
  }

  export type RunSkipCreateManyInput = {
    runId: string
    date: Date | string
    updatedBy: string
  }

  export type RunSkipUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
  }

  export type RunSkipUncheckedUpdateManyInput = {
    runId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
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

  export type RunDriverListRelationFilter = {
    every?: RunDriverWhereInput
    some?: RunDriverWhereInput
    none?: RunDriverWhereInput
  }

  export type RunSkipListRelationFilter = {
    every?: RunSkipWhereInput
    some?: RunSkipWhereInput
    none?: RunSkipWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RunDriverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RunSkipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SchoolRunCountOrderByAggregateInput = {
    id?: SortOrder
    kidId?: SortOrder
    weekday?: SortOrder
    kind?: SortOrder
    place?: SortOrder
    minutes?: SortOrder
    startsOn?: SortOrder
    endsOn?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type SchoolRunAvgOrderByAggregateInput = {
    weekday?: SortOrder
    minutes?: SortOrder
  }

  export type SchoolRunMaxOrderByAggregateInput = {
    id?: SortOrder
    kidId?: SortOrder
    weekday?: SortOrder
    kind?: SortOrder
    place?: SortOrder
    minutes?: SortOrder
    startsOn?: SortOrder
    endsOn?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type SchoolRunMinOrderByAggregateInput = {
    id?: SortOrder
    kidId?: SortOrder
    weekday?: SortOrder
    kind?: SortOrder
    place?: SortOrder
    minutes?: SortOrder
    startsOn?: SortOrder
    endsOn?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type SchoolRunSumOrderByAggregateInput = {
    weekday?: SortOrder
    minutes?: SortOrder
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

  export type SchoolRunScalarRelationFilter = {
    is?: SchoolRunWhereInput
    isNot?: SchoolRunWhereInput
  }

  export type RunDriverRunIdFromDateCompoundUniqueInput = {
    runId: string
    fromDate: Date | string
  }

  export type RunDriverCountOrderByAggregateInput = {
    runId?: SortOrder
    fromDate?: SortOrder
    driverId?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunDriverMaxOrderByAggregateInput = {
    runId?: SortOrder
    fromDate?: SortOrder
    driverId?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunDriverMinOrderByAggregateInput = {
    runId?: SortOrder
    fromDate?: SortOrder
    driverId?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }

  export type RunSkipRunIdDateCompoundUniqueInput = {
    runId: string
    date: Date | string
  }

  export type RunSkipCountOrderByAggregateInput = {
    runId?: SortOrder
    date?: SortOrder
    updatedBy?: SortOrder
  }

  export type RunSkipMaxOrderByAggregateInput = {
    runId?: SortOrder
    date?: SortOrder
    updatedBy?: SortOrder
  }

  export type RunSkipMinOrderByAggregateInput = {
    runId?: SortOrder
    date?: SortOrder
    updatedBy?: SortOrder
  }

  export type RunDriverCreateNestedManyWithoutRunInput = {
    create?:
      | XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
      | RunDriverCreateWithoutRunInput[]
      | RunDriverUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunDriverCreateOrConnectWithoutRunInput
      | RunDriverCreateOrConnectWithoutRunInput[]
    createMany?: RunDriverCreateManyRunInputEnvelope
    connect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
  }

  export type RunSkipCreateNestedManyWithoutRunInput = {
    create?:
      | XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
      | RunSkipCreateWithoutRunInput[]
      | RunSkipUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunSkipCreateOrConnectWithoutRunInput
      | RunSkipCreateOrConnectWithoutRunInput[]
    createMany?: RunSkipCreateManyRunInputEnvelope
    connect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
  }

  export type RunDriverUncheckedCreateNestedManyWithoutRunInput = {
    create?:
      | XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
      | RunDriverCreateWithoutRunInput[]
      | RunDriverUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunDriverCreateOrConnectWithoutRunInput
      | RunDriverCreateOrConnectWithoutRunInput[]
    createMany?: RunDriverCreateManyRunInputEnvelope
    connect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
  }

  export type RunSkipUncheckedCreateNestedManyWithoutRunInput = {
    create?:
      | XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
      | RunSkipCreateWithoutRunInput[]
      | RunSkipUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunSkipCreateOrConnectWithoutRunInput
      | RunSkipCreateOrConnectWithoutRunInput[]
    createMany?: RunSkipCreateManyRunInputEnvelope
    connect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
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

  export type RunDriverUpdateManyWithoutRunNestedInput = {
    create?:
      | XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
      | RunDriverCreateWithoutRunInput[]
      | RunDriverUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunDriverCreateOrConnectWithoutRunInput
      | RunDriverCreateOrConnectWithoutRunInput[]
    upsert?:
      | RunDriverUpsertWithWhereUniqueWithoutRunInput
      | RunDriverUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunDriverCreateManyRunInputEnvelope
    set?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    disconnect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    delete?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    connect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    update?:
      | RunDriverUpdateWithWhereUniqueWithoutRunInput
      | RunDriverUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?:
      | RunDriverUpdateManyWithWhereWithoutRunInput
      | RunDriverUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunDriverScalarWhereInput | RunDriverScalarWhereInput[]
  }

  export type RunSkipUpdateManyWithoutRunNestedInput = {
    create?:
      | XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
      | RunSkipCreateWithoutRunInput[]
      | RunSkipUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunSkipCreateOrConnectWithoutRunInput
      | RunSkipCreateOrConnectWithoutRunInput[]
    upsert?:
      | RunSkipUpsertWithWhereUniqueWithoutRunInput
      | RunSkipUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunSkipCreateManyRunInputEnvelope
    set?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    disconnect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    delete?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    connect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    update?:
      | RunSkipUpdateWithWhereUniqueWithoutRunInput
      | RunSkipUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?:
      | RunSkipUpdateManyWithWhereWithoutRunInput
      | RunSkipUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunSkipScalarWhereInput | RunSkipScalarWhereInput[]
  }

  export type RunDriverUncheckedUpdateManyWithoutRunNestedInput = {
    create?:
      | XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
      | RunDriverCreateWithoutRunInput[]
      | RunDriverUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunDriverCreateOrConnectWithoutRunInput
      | RunDriverCreateOrConnectWithoutRunInput[]
    upsert?:
      | RunDriverUpsertWithWhereUniqueWithoutRunInput
      | RunDriverUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunDriverCreateManyRunInputEnvelope
    set?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    disconnect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    delete?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    connect?: RunDriverWhereUniqueInput | RunDriverWhereUniqueInput[]
    update?:
      | RunDriverUpdateWithWhereUniqueWithoutRunInput
      | RunDriverUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?:
      | RunDriverUpdateManyWithWhereWithoutRunInput
      | RunDriverUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunDriverScalarWhereInput | RunDriverScalarWhereInput[]
  }

  export type RunSkipUncheckedUpdateManyWithoutRunNestedInput = {
    create?:
      | XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
      | RunSkipCreateWithoutRunInput[]
      | RunSkipUncheckedCreateWithoutRunInput[]
    connectOrCreate?:
      | RunSkipCreateOrConnectWithoutRunInput
      | RunSkipCreateOrConnectWithoutRunInput[]
    upsert?:
      | RunSkipUpsertWithWhereUniqueWithoutRunInput
      | RunSkipUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: RunSkipCreateManyRunInputEnvelope
    set?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    disconnect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    delete?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    connect?: RunSkipWhereUniqueInput | RunSkipWhereUniqueInput[]
    update?:
      | RunSkipUpdateWithWhereUniqueWithoutRunInput
      | RunSkipUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?:
      | RunSkipUpdateManyWithWhereWithoutRunInput
      | RunSkipUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: RunSkipScalarWhereInput | RunSkipScalarWhereInput[]
  }

  export type SchoolRunCreateNestedOneWithoutDriversInput = {
    create?: XOR<SchoolRunCreateWithoutDriversInput, SchoolRunUncheckedCreateWithoutDriversInput>
    connectOrCreate?: SchoolRunCreateOrConnectWithoutDriversInput
    connect?: SchoolRunWhereUniqueInput
  }

  export type SchoolRunUpdateOneRequiredWithoutDriversNestedInput = {
    create?: XOR<SchoolRunCreateWithoutDriversInput, SchoolRunUncheckedCreateWithoutDriversInput>
    connectOrCreate?: SchoolRunCreateOrConnectWithoutDriversInput
    upsert?: SchoolRunUpsertWithoutDriversInput
    connect?: SchoolRunWhereUniqueInput
    update?: XOR<
      XOR<SchoolRunUpdateToOneWithWhereWithoutDriversInput, SchoolRunUpdateWithoutDriversInput>,
      SchoolRunUncheckedUpdateWithoutDriversInput
    >
  }

  export type SchoolRunCreateNestedOneWithoutSkipsInput = {
    create?: XOR<SchoolRunCreateWithoutSkipsInput, SchoolRunUncheckedCreateWithoutSkipsInput>
    connectOrCreate?: SchoolRunCreateOrConnectWithoutSkipsInput
    connect?: SchoolRunWhereUniqueInput
  }

  export type SchoolRunUpdateOneRequiredWithoutSkipsNestedInput = {
    create?: XOR<SchoolRunCreateWithoutSkipsInput, SchoolRunUncheckedCreateWithoutSkipsInput>
    connectOrCreate?: SchoolRunCreateOrConnectWithoutSkipsInput
    upsert?: SchoolRunUpsertWithoutSkipsInput
    connect?: SchoolRunWhereUniqueInput
    update?: XOR<
      XOR<SchoolRunUpdateToOneWithWhereWithoutSkipsInput, SchoolRunUpdateWithoutSkipsInput>,
      SchoolRunUncheckedUpdateWithoutSkipsInput
    >
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

  export type RunDriverCreateWithoutRunInput = {
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
  }

  export type RunDriverUncheckedCreateWithoutRunInput = {
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
  }

  export type RunDriverCreateOrConnectWithoutRunInput = {
    where: RunDriverWhereUniqueInput
    create: XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
  }

  export type RunDriverCreateManyRunInputEnvelope = {
    data: RunDriverCreateManyRunInput | RunDriverCreateManyRunInput[]
    skipDuplicates?: boolean
  }

  export type RunSkipCreateWithoutRunInput = {
    date: Date | string
    updatedBy: string
  }

  export type RunSkipUncheckedCreateWithoutRunInput = {
    date: Date | string
    updatedBy: string
  }

  export type RunSkipCreateOrConnectWithoutRunInput = {
    where: RunSkipWhereUniqueInput
    create: XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
  }

  export type RunSkipCreateManyRunInputEnvelope = {
    data: RunSkipCreateManyRunInput | RunSkipCreateManyRunInput[]
    skipDuplicates?: boolean
  }

  export type RunDriverUpsertWithWhereUniqueWithoutRunInput = {
    where: RunDriverWhereUniqueInput
    update: XOR<RunDriverUpdateWithoutRunInput, RunDriverUncheckedUpdateWithoutRunInput>
    create: XOR<RunDriverCreateWithoutRunInput, RunDriverUncheckedCreateWithoutRunInput>
  }

  export type RunDriverUpdateWithWhereUniqueWithoutRunInput = {
    where: RunDriverWhereUniqueInput
    data: XOR<RunDriverUpdateWithoutRunInput, RunDriverUncheckedUpdateWithoutRunInput>
  }

  export type RunDriverUpdateManyWithWhereWithoutRunInput = {
    where: RunDriverScalarWhereInput
    data: XOR<RunDriverUpdateManyMutationInput, RunDriverUncheckedUpdateManyWithoutRunInput>
  }

  export type RunDriverScalarWhereInput = {
    AND?: RunDriverScalarWhereInput | RunDriverScalarWhereInput[]
    OR?: RunDriverScalarWhereInput[]
    NOT?: RunDriverScalarWhereInput | RunDriverScalarWhereInput[]
    runId?: UuidFilter<'RunDriver'> | string
    fromDate?: DateTimeFilter<'RunDriver'> | Date | string
    driverId?: StringFilter<'RunDriver'> | string
    updatedBy?: StringFilter<'RunDriver'> | string
    updatedAt?: DateTimeFilter<'RunDriver'> | Date | string
  }

  export type RunSkipUpsertWithWhereUniqueWithoutRunInput = {
    where: RunSkipWhereUniqueInput
    update: XOR<RunSkipUpdateWithoutRunInput, RunSkipUncheckedUpdateWithoutRunInput>
    create: XOR<RunSkipCreateWithoutRunInput, RunSkipUncheckedCreateWithoutRunInput>
  }

  export type RunSkipUpdateWithWhereUniqueWithoutRunInput = {
    where: RunSkipWhereUniqueInput
    data: XOR<RunSkipUpdateWithoutRunInput, RunSkipUncheckedUpdateWithoutRunInput>
  }

  export type RunSkipUpdateManyWithWhereWithoutRunInput = {
    where: RunSkipScalarWhereInput
    data: XOR<RunSkipUpdateManyMutationInput, RunSkipUncheckedUpdateManyWithoutRunInput>
  }

  export type RunSkipScalarWhereInput = {
    AND?: RunSkipScalarWhereInput | RunSkipScalarWhereInput[]
    OR?: RunSkipScalarWhereInput[]
    NOT?: RunSkipScalarWhereInput | RunSkipScalarWhereInput[]
    runId?: UuidFilter<'RunSkip'> | string
    date?: DateTimeFilter<'RunSkip'> | Date | string
    updatedBy?: StringFilter<'RunSkip'> | string
  }

  export type SchoolRunCreateWithoutDriversInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    skips?: RunSkipCreateNestedManyWithoutRunInput
  }

  export type SchoolRunUncheckedCreateWithoutDriversInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    skips?: RunSkipUncheckedCreateNestedManyWithoutRunInput
  }

  export type SchoolRunCreateOrConnectWithoutDriversInput = {
    where: SchoolRunWhereUniqueInput
    create: XOR<SchoolRunCreateWithoutDriversInput, SchoolRunUncheckedCreateWithoutDriversInput>
  }

  export type SchoolRunUpsertWithoutDriversInput = {
    update: XOR<SchoolRunUpdateWithoutDriversInput, SchoolRunUncheckedUpdateWithoutDriversInput>
    create: XOR<SchoolRunCreateWithoutDriversInput, SchoolRunUncheckedCreateWithoutDriversInput>
    where?: SchoolRunWhereInput
  }

  export type SchoolRunUpdateToOneWithWhereWithoutDriversInput = {
    where?: SchoolRunWhereInput
    data: XOR<SchoolRunUpdateWithoutDriversInput, SchoolRunUncheckedUpdateWithoutDriversInput>
  }

  export type SchoolRunUpdateWithoutDriversInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skips?: RunSkipUpdateManyWithoutRunNestedInput
  }

  export type SchoolRunUncheckedUpdateWithoutDriversInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skips?: RunSkipUncheckedUpdateManyWithoutRunNestedInput
  }

  export type SchoolRunCreateWithoutSkipsInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    drivers?: RunDriverCreateNestedManyWithoutRunInput
  }

  export type SchoolRunUncheckedCreateWithoutSkipsInput = {
    id?: string
    kidId: string
    weekday: number
    kind: string
    place?: string | null
    minutes: number
    startsOn: Date | string
    endsOn?: Date | string | null
    createdBy: string
    createdAt?: Date | string
    drivers?: RunDriverUncheckedCreateNestedManyWithoutRunInput
  }

  export type SchoolRunCreateOrConnectWithoutSkipsInput = {
    where: SchoolRunWhereUniqueInput
    create: XOR<SchoolRunCreateWithoutSkipsInput, SchoolRunUncheckedCreateWithoutSkipsInput>
  }

  export type SchoolRunUpsertWithoutSkipsInput = {
    update: XOR<SchoolRunUpdateWithoutSkipsInput, SchoolRunUncheckedUpdateWithoutSkipsInput>
    create: XOR<SchoolRunCreateWithoutSkipsInput, SchoolRunUncheckedCreateWithoutSkipsInput>
    where?: SchoolRunWhereInput
  }

  export type SchoolRunUpdateToOneWithWhereWithoutSkipsInput = {
    where?: SchoolRunWhereInput
    data: XOR<SchoolRunUpdateWithoutSkipsInput, SchoolRunUncheckedUpdateWithoutSkipsInput>
  }

  export type SchoolRunUpdateWithoutSkipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drivers?: RunDriverUpdateManyWithoutRunNestedInput
  }

  export type SchoolRunUncheckedUpdateWithoutSkipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidId?: StringFieldUpdateOperationsInput | string
    weekday?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    place?: NullableStringFieldUpdateOperationsInput | string | null
    minutes?: IntFieldUpdateOperationsInput | number
    startsOn?: DateTimeFieldUpdateOperationsInput | Date | string
    endsOn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drivers?: RunDriverUncheckedUpdateManyWithoutRunNestedInput
  }

  export type RunDriverCreateManyRunInput = {
    fromDate: Date | string
    driverId: string
    updatedBy: string
    updatedAt?: Date | string
  }

  export type RunSkipCreateManyRunInput = {
    date: Date | string
    updatedBy: string
  }

  export type RunDriverUpdateWithoutRunInput = {
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunDriverUncheckedUpdateWithoutRunInput = {
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunDriverUncheckedUpdateManyWithoutRunInput = {
    fromDate?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    updatedBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RunSkipUpdateWithoutRunInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
  }

  export type RunSkipUncheckedUpdateWithoutRunInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
  }

  export type RunSkipUncheckedUpdateManyWithoutRunInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: StringFieldUpdateOperationsInput | string
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
