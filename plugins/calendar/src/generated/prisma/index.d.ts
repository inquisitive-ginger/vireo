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
 * Model Event
 *
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model EventAttendee
 *
 */
export type EventAttendee = $Result.DefaultSelection<Prisma.$EventAttendeePayload>
/**
 * Model EventException
 *
 */
export type EventException = $Result.DefaultSelection<Prisma.$EventExceptionPayload>
/**
 * Model ReminderLog
 *
 */
export type ReminderLog = $Result.DefaultSelection<Prisma.$ReminderLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Events
 * const events = await prisma.event.findMany()
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
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
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
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.eventAttendee`: Exposes CRUD operations for the **EventAttendee** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more EventAttendees
   * const eventAttendees = await prisma.eventAttendee.findMany()
   * ```
   */
  get eventAttendee(): Prisma.EventAttendeeDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.eventException`: Exposes CRUD operations for the **EventException** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more EventExceptions
   * const eventExceptions = await prisma.eventException.findMany()
   * ```
   */
  get eventException(): Prisma.EventExceptionDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.reminderLog`: Exposes CRUD operations for the **ReminderLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ReminderLogs
   * const reminderLogs = await prisma.reminderLog.findMany()
   * ```
   */
  get reminderLog(): Prisma.ReminderLogDelegate<ExtArgs, ClientOptions>
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
    Event: 'Event'
    EventAttendee: 'EventAttendee'
    EventException: 'EventException'
    ReminderLog: 'ReminderLog'
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
      modelProps: 'event' | 'eventAttendee' | 'eventException' | 'reminderLog'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      EventAttendee: {
        payload: Prisma.$EventAttendeePayload<ExtArgs>
        fields: Prisma.EventAttendeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventAttendeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventAttendeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          findFirst: {
            args: Prisma.EventAttendeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventAttendeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          findMany: {
            args: Prisma.EventAttendeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[]
          }
          create: {
            args: Prisma.EventAttendeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          createMany: {
            args: Prisma.EventAttendeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventAttendeeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[]
          }
          delete: {
            args: Prisma.EventAttendeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          update: {
            args: Prisma.EventAttendeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          deleteMany: {
            args: Prisma.EventAttendeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventAttendeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventAttendeeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>[]
          }
          upsert: {
            args: Prisma.EventAttendeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendeePayload>
          }
          aggregate: {
            args: Prisma.EventAttendeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventAttendee>
          }
          groupBy: {
            args: Prisma.EventAttendeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventAttendeeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventAttendeeCountArgs<ExtArgs>
            result: $Utils.Optional<EventAttendeeCountAggregateOutputType> | number
          }
        }
      }
      EventException: {
        payload: Prisma.$EventExceptionPayload<ExtArgs>
        fields: Prisma.EventExceptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventExceptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventExceptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          findFirst: {
            args: Prisma.EventExceptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventExceptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          findMany: {
            args: Prisma.EventExceptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>[]
          }
          create: {
            args: Prisma.EventExceptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          createMany: {
            args: Prisma.EventExceptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventExceptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>[]
          }
          delete: {
            args: Prisma.EventExceptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          update: {
            args: Prisma.EventExceptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          deleteMany: {
            args: Prisma.EventExceptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventExceptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventExceptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>[]
          }
          upsert: {
            args: Prisma.EventExceptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventExceptionPayload>
          }
          aggregate: {
            args: Prisma.EventExceptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventException>
          }
          groupBy: {
            args: Prisma.EventExceptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventExceptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventExceptionCountArgs<ExtArgs>
            result: $Utils.Optional<EventExceptionCountAggregateOutputType> | number
          }
        }
      }
      ReminderLog: {
        payload: Prisma.$ReminderLogPayload<ExtArgs>
        fields: Prisma.ReminderLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReminderLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReminderLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          findFirst: {
            args: Prisma.ReminderLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReminderLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          findMany: {
            args: Prisma.ReminderLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>[]
          }
          create: {
            args: Prisma.ReminderLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          createMany: {
            args: Prisma.ReminderLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReminderLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>[]
          }
          delete: {
            args: Prisma.ReminderLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          update: {
            args: Prisma.ReminderLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          deleteMany: {
            args: Prisma.ReminderLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReminderLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReminderLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>[]
          }
          upsert: {
            args: Prisma.ReminderLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderLogPayload>
          }
          aggregate: {
            args: Prisma.ReminderLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReminderLog>
          }
          groupBy: {
            args: Prisma.ReminderLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReminderLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReminderLogCountArgs<ExtArgs>
            result: $Utils.Optional<ReminderLogCountAggregateOutputType> | number
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
    event?: EventOmit
    eventAttendee?: EventAttendeeOmit
    eventException?: EventExceptionOmit
    reminderLog?: ReminderLogOmit
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
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    attendees: number
    exceptions: number
    reminders: number
  }

  export type EventCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendees?: boolean | EventCountOutputTypeCountAttendeesArgs
    exceptions?: boolean | EventCountOutputTypeCountExceptionsArgs
    reminders?: boolean | EventCountOutputTypeCountRemindersArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAttendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventAttendeeWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountExceptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventExceptionWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountRemindersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ReminderLogWhereInput
  }

  /**
   * Models
   */

  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    recurrenceDayOffsets: number | null
    reminderMinutes: number | null
  }

  export type EventSumAggregateOutputType = {
    recurrenceDayOffsets: number[]
    reminderMinutes: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdBy: string | null
    startsAt: Date | null
    endsAt: Date | null
    allDay: boolean | null
    location: string | null
    recurrence: string | null
    recurrenceUntil: Date | null
    isActivity: boolean | null
    status: string | null
    source: string | null
    reminderMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdBy: string | null
    startsAt: Date | null
    endsAt: Date | null
    allDay: boolean | null
    location: string | null
    recurrence: string | null
    recurrenceUntil: Date | null
    isActivity: boolean | null
    status: string | null
    source: string | null
    reminderMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    description: number
    createdBy: number
    startsAt: number
    endsAt: number
    allDay: number
    location: number
    recurrence: number
    recurrenceDayOffsets: number
    recurrenceUntil: number
    isActivity: number
    status: number
    source: number
    reminderMinutes: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type EventAvgAggregateInputType = {
    recurrenceDayOffsets?: true
    reminderMinutes?: true
  }

  export type EventSumAggregateInputType = {
    recurrenceDayOffsets?: true
    reminderMinutes?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdBy?: true
    startsAt?: true
    endsAt?: true
    allDay?: true
    location?: true
    recurrence?: true
    recurrenceUntil?: true
    isActivity?: true
    status?: true
    source?: true
    reminderMinutes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdBy?: true
    startsAt?: true
    endsAt?: true
    allDay?: true
    location?: true
    recurrence?: true
    recurrenceUntil?: true
    isActivity?: true
    status?: true
    source?: true
    reminderMinutes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdBy?: true
    startsAt?: true
    endsAt?: true
    allDay?: true
    location?: true
    recurrence?: true
    recurrenceDayOffsets?: true
    recurrenceUntil?: true
    isActivity?: true
    status?: true
    source?: true
    reminderMinutes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Events
     **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }

  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: EventWhereInput
      orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
      by: EventScalarFieldEnum[] | EventScalarFieldEnum
      having?: EventScalarWhereWithAggregatesInput
      take?: number
      skip?: number
      _count?: EventCountAggregateInputType | true
      _avg?: EventAvgAggregateInputType
      _sum?: EventSumAggregateInputType
      _min?: EventMinAggregateInputType
      _max?: EventMaxAggregateInputType
    }

  export type EventGroupByOutputType = {
    id: string
    title: string
    description: string | null
    createdBy: string
    startsAt: Date
    endsAt: Date | null
    allDay: boolean
    location: string | null
    recurrence: string | null
    recurrenceDayOffsets: number[]
    recurrenceUntil: Date | null
    isActivity: boolean
    status: string
    source: string
    reminderMinutes: number | null
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> & {
        [P in keyof T & keyof EventGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], EventGroupByOutputType[P]>
          : GetScalarType<T[P], EventGroupByOutputType[P]>
      }
    >
  >

  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        title?: boolean
        description?: boolean
        createdBy?: boolean
        startsAt?: boolean
        endsAt?: boolean
        allDay?: boolean
        location?: boolean
        recurrence?: boolean
        recurrenceDayOffsets?: boolean
        recurrenceUntil?: boolean
        isActivity?: boolean
        status?: boolean
        source?: boolean
        reminderMinutes?: boolean
        createdAt?: boolean
        updatedAt?: boolean
        attendees?: boolean | Event$attendeesArgs<ExtArgs>
        exceptions?: boolean | Event$exceptionsArgs<ExtArgs>
        reminders?: boolean | Event$remindersArgs<ExtArgs>
        _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['event']
    >

  export type EventSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      title?: boolean
      description?: boolean
      createdBy?: boolean
      startsAt?: boolean
      endsAt?: boolean
      allDay?: boolean
      location?: boolean
      recurrence?: boolean
      recurrenceDayOffsets?: boolean
      recurrenceUntil?: boolean
      isActivity?: boolean
      status?: boolean
      source?: boolean
      reminderMinutes?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['event']
  >

  export type EventSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      title?: boolean
      description?: boolean
      createdBy?: boolean
      startsAt?: boolean
      endsAt?: boolean
      allDay?: boolean
      location?: boolean
      recurrence?: boolean
      recurrenceDayOffsets?: boolean
      recurrenceUntil?: boolean
      isActivity?: boolean
      status?: boolean
      source?: boolean
      reminderMinutes?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['event']
  >

  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    createdBy?: boolean
    startsAt?: boolean
    endsAt?: boolean
    allDay?: boolean
    location?: boolean
    recurrence?: boolean
    recurrenceDayOffsets?: boolean
    recurrenceUntil?: boolean
    isActivity?: boolean
    status?: boolean
    source?: boolean
    reminderMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'title'
      | 'description'
      | 'createdBy'
      | 'startsAt'
      | 'endsAt'
      | 'allDay'
      | 'location'
      | 'recurrence'
      | 'recurrenceDayOffsets'
      | 'recurrenceUntil'
      | 'isActivity'
      | 'status'
      | 'source'
      | 'reminderMinutes'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['event']
    >
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendees?: boolean | Event$attendeesArgs<ExtArgs>
    exceptions?: boolean | Event$exceptionsArgs<ExtArgs>
    reminders?: boolean | Event$remindersArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}
  export type EventIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Event'
    objects: {
      attendees: Prisma.$EventAttendeePayload<ExtArgs>[]
      exceptions: Prisma.$EventExceptionPayload<ExtArgs>[]
      reminders: Prisma.$ReminderLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        title: string
        description: string | null
        createdBy: string
        startsAt: Date
        endsAt: Date | null
        allDay: boolean
        location: string | null
        recurrence: string | null
        recurrenceDayOffsets: number[]
        recurrenceUntil: Date | null
        isActivity: boolean
        status: string
        source: string
        reminderMinutes: number | null
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['event']
    >
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<
    Prisma.$EventPayload,
    S
  >

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    EventFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: EventCountAggregateInputType | true
  }

  export interface EventDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event']; meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(
      args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(
      args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     *
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EventFindManyArgs>(
      args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     *
     */
    create<T extends EventCreateArgs>(
      args: SelectSubset<T, EventCreateArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventCreateManyArgs>(
      args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     *
     */
    delete<T extends EventDeleteArgs>(
      args: SelectSubset<T, EventDeleteArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventUpdateArgs>(
      args: SelectSubset<T, EventUpdateArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventDeleteManyArgs>(
      args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventUpdateManyArgs>(
      args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
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
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(
      args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(
      args: SelectSubset<T, EventUpsertArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
     **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventAggregateArgs>(
      args: Subset<T, EventAggregateArgs>
    ): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
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
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Event model
     */
    readonly fields: EventFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    attendees<T extends Event$attendeesArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$attendeesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    exceptions<T extends Event$exceptionsArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$exceptionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    reminders<T extends Event$remindersArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$remindersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
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
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<'Event', 'String'>
    readonly title: FieldRef<'Event', 'String'>
    readonly description: FieldRef<'Event', 'String'>
    readonly createdBy: FieldRef<'Event', 'String'>
    readonly startsAt: FieldRef<'Event', 'DateTime'>
    readonly endsAt: FieldRef<'Event', 'DateTime'>
    readonly allDay: FieldRef<'Event', 'Boolean'>
    readonly location: FieldRef<'Event', 'String'>
    readonly recurrence: FieldRef<'Event', 'String'>
    readonly recurrenceDayOffsets: FieldRef<'Event', 'Int[]'>
    readonly recurrenceUntil: FieldRef<'Event', 'DateTime'>
    readonly isActivity: FieldRef<'Event', 'Boolean'>
    readonly status: FieldRef<'Event', 'String'>
    readonly source: FieldRef<'Event', 'String'>
    readonly reminderMinutes: FieldRef<'Event', 'Int'>
    readonly createdAt: FieldRef<'Event', 'DateTime'>
    readonly updatedAt: FieldRef<'Event', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Event
       */
      select?: EventSelect<ExtArgs> | null
      /**
       * Omit specific fields from the Event
       */
      omit?: EventOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: EventInclude<ExtArgs> | null
      /**
       * The data needed to create a Event.
       */
      data: XOR<EventCreateInput, EventUncheckedCreateInput>
    }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Event
       */
      select?: EventSelect<ExtArgs> | null
      /**
       * Omit specific fields from the Event
       */
      omit?: EventOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: EventInclude<ExtArgs> | null
      /**
       * The data needed to update a Event.
       */
      data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
      /**
       * Choose, which Event to update.
       */
      where: EventWhereUniqueInput
    }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Event
       */
      select?: EventSelect<ExtArgs> | null
      /**
       * Omit specific fields from the Event
       */
      omit?: EventOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: EventInclude<ExtArgs> | null
      /**
       * The filter to search for the Event to update in case it exists.
       */
      where: EventWhereUniqueInput
      /**
       * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
       */
      create: XOR<EventCreateInput, EventUncheckedCreateInput>
      /**
       * In case the Event was found with the provided `where` argument, update it with this data.
       */
      update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Event
       */
      select?: EventSelect<ExtArgs> | null
      /**
       * Omit specific fields from the Event
       */
      omit?: EventOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: EventInclude<ExtArgs> | null
      /**
       * Filter which Event to delete.
       */
      where: EventWhereUniqueInput
    }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.attendees
   */
  export type Event$attendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    where?: EventAttendeeWhereInput
    orderBy?: EventAttendeeOrderByWithRelationInput | EventAttendeeOrderByWithRelationInput[]
    cursor?: EventAttendeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[]
  }

  /**
   * Event.exceptions
   */
  export type Event$exceptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    where?: EventExceptionWhereInput
    orderBy?: EventExceptionOrderByWithRelationInput | EventExceptionOrderByWithRelationInput[]
    cursor?: EventExceptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventExceptionScalarFieldEnum | EventExceptionScalarFieldEnum[]
  }

  /**
   * Event.reminders
   */
  export type Event$remindersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    where?: ReminderLogWhereInput
    orderBy?: ReminderLogOrderByWithRelationInput | ReminderLogOrderByWithRelationInput[]
    cursor?: ReminderLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReminderLogScalarFieldEnum | ReminderLogScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Event
       */
      select?: EventSelect<ExtArgs> | null
      /**
       * Omit specific fields from the Event
       */
      omit?: EventOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: EventInclude<ExtArgs> | null
    }

  /**
   * Model EventAttendee
   */

  export type AggregateEventAttendee = {
    _count: EventAttendeeCountAggregateOutputType | null
    _min: EventAttendeeMinAggregateOutputType | null
    _max: EventAttendeeMaxAggregateOutputType | null
  }

  export type EventAttendeeMinAggregateOutputType = {
    eventId: string | null
    profileId: string | null
  }

  export type EventAttendeeMaxAggregateOutputType = {
    eventId: string | null
    profileId: string | null
  }

  export type EventAttendeeCountAggregateOutputType = {
    eventId: number
    profileId: number
    _all: number
  }

  export type EventAttendeeMinAggregateInputType = {
    eventId?: true
    profileId?: true
  }

  export type EventAttendeeMaxAggregateInputType = {
    eventId?: true
    profileId?: true
  }

  export type EventAttendeeCountAggregateInputType = {
    eventId?: true
    profileId?: true
    _all?: true
  }

  export type EventAttendeeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventAttendee to aggregate.
     */
    where?: EventAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?: EventAttendeeOrderByWithRelationInput | EventAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventAttendees
     **/
    _count?: true | EventAttendeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventAttendeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventAttendeeMaxAggregateInputType
  }

  export type GetEventAttendeeAggregateType<T extends EventAttendeeAggregateArgs> = {
    [P in keyof T & keyof AggregateEventAttendee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventAttendee[P]>
      : GetScalarType<T[P], AggregateEventAttendee[P]>
  }

  export type EventAttendeeGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventAttendeeWhereInput
    orderBy?: EventAttendeeOrderByWithAggregationInput | EventAttendeeOrderByWithAggregationInput[]
    by: EventAttendeeScalarFieldEnum[] | EventAttendeeScalarFieldEnum
    having?: EventAttendeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventAttendeeCountAggregateInputType | true
    _min?: EventAttendeeMinAggregateInputType
    _max?: EventAttendeeMaxAggregateInputType
  }

  export type EventAttendeeGroupByOutputType = {
    eventId: string
    profileId: string
    _count: EventAttendeeCountAggregateOutputType | null
    _min: EventAttendeeMinAggregateOutputType | null
    _max: EventAttendeeMaxAggregateOutputType | null
  }

  type GetEventAttendeeGroupByPayload<T extends EventAttendeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventAttendeeGroupByOutputType, T['by']> & {
        [P in keyof T & keyof EventAttendeeGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], EventAttendeeGroupByOutputType[P]>
          : GetScalarType<T[P], EventAttendeeGroupByOutputType[P]>
      }
    >
  >

  export type EventAttendeeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      profileId?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventAttendee']
  >

  export type EventAttendeeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      profileId?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventAttendee']
  >

  export type EventAttendeeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      profileId?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventAttendee']
  >

  export type EventAttendeeSelectScalar = {
    eventId?: boolean
    profileId?: boolean
  }

  export type EventAttendeeOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<'eventId' | 'profileId', ExtArgs['result']['eventAttendee']>
  export type EventAttendeeInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventAttendeeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventAttendeeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $EventAttendeePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'EventAttendee'
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        eventId: string
        profileId: string
      },
      ExtArgs['result']['eventAttendee']
    >
    composites: {}
  }

  type EventAttendeeGetPayload<S extends boolean | null | undefined | EventAttendeeDefaultArgs> =
    $Result.GetResult<Prisma.$EventAttendeePayload, S>

  type EventAttendeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventAttendeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventAttendeeCountAggregateInputType | true
    }

  export interface EventAttendeeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['EventAttendee']
      meta: { name: 'EventAttendee' }
    }
    /**
     * Find zero or one EventAttendee that matches the filter.
     * @param {EventAttendeeFindUniqueArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventAttendeeFindUniqueArgs>(
      args: SelectSubset<T, EventAttendeeFindUniqueArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one EventAttendee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventAttendeeFindUniqueOrThrowArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventAttendeeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventAttendeeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first EventAttendee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindFirstArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventAttendeeFindFirstArgs>(
      args?: SelectSubset<T, EventAttendeeFindFirstArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first EventAttendee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindFirstOrThrowArgs} args - Arguments to find a EventAttendee
     * @example
     * // Get one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventAttendeeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventAttendeeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more EventAttendees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventAttendees
     * const eventAttendees = await prisma.eventAttendee.findMany()
     *
     * // Get first 10 EventAttendees
     * const eventAttendees = await prisma.eventAttendee.findMany({ take: 10 })
     *
     * // Only select the `eventId`
     * const eventAttendeeWithEventIdOnly = await prisma.eventAttendee.findMany({ select: { eventId: true } })
     *
     */
    findMany<T extends EventAttendeeFindManyArgs>(
      args?: SelectSubset<T, EventAttendeeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a EventAttendee.
     * @param {EventAttendeeCreateArgs} args - Arguments to create a EventAttendee.
     * @example
     * // Create one EventAttendee
     * const EventAttendee = await prisma.eventAttendee.create({
     *   data: {
     *     // ... data to create a EventAttendee
     *   }
     * })
     *
     */
    create<T extends EventAttendeeCreateArgs>(
      args: SelectSubset<T, EventAttendeeCreateArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many EventAttendees.
     * @param {EventAttendeeCreateManyArgs} args - Arguments to create many EventAttendees.
     * @example
     * // Create many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventAttendeeCreateManyArgs>(
      args?: SelectSubset<T, EventAttendeeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventAttendees and returns the data saved in the database.
     * @param {EventAttendeeCreateManyAndReturnArgs} args - Arguments to create many EventAttendees.
     * @example
     * // Create many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many EventAttendees and only return the `eventId`
     * const eventAttendeeWithEventIdOnly = await prisma.eventAttendee.createManyAndReturn({
     *   select: { eventId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventAttendeeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventAttendeeCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a EventAttendee.
     * @param {EventAttendeeDeleteArgs} args - Arguments to delete one EventAttendee.
     * @example
     * // Delete one EventAttendee
     * const EventAttendee = await prisma.eventAttendee.delete({
     *   where: {
     *     // ... filter to delete one EventAttendee
     *   }
     * })
     *
     */
    delete<T extends EventAttendeeDeleteArgs>(
      args: SelectSubset<T, EventAttendeeDeleteArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one EventAttendee.
     * @param {EventAttendeeUpdateArgs} args - Arguments to update one EventAttendee.
     * @example
     * // Update one EventAttendee
     * const eventAttendee = await prisma.eventAttendee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventAttendeeUpdateArgs>(
      args: SelectSubset<T, EventAttendeeUpdateArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more EventAttendees.
     * @param {EventAttendeeDeleteManyArgs} args - Arguments to filter EventAttendees to delete.
     * @example
     * // Delete a few EventAttendees
     * const { count } = await prisma.eventAttendee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventAttendeeDeleteManyArgs>(
      args?: SelectSubset<T, EventAttendeeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventAttendeeUpdateManyArgs>(
      args: SelectSubset<T, EventAttendeeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAttendees and returns the data updated in the database.
     * @param {EventAttendeeUpdateManyAndReturnArgs} args - Arguments to update many EventAttendees.
     * @example
     * // Update many EventAttendees
     * const eventAttendee = await prisma.eventAttendee.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more EventAttendees and only return the `eventId`
     * const eventAttendeeWithEventIdOnly = await prisma.eventAttendee.updateManyAndReturn({
     *   select: { eventId: true },
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
    updateManyAndReturn<T extends EventAttendeeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, EventAttendeeUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventAttendeePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one EventAttendee.
     * @param {EventAttendeeUpsertArgs} args - Arguments to update or create a EventAttendee.
     * @example
     * // Update or create a EventAttendee
     * const eventAttendee = await prisma.eventAttendee.upsert({
     *   create: {
     *     // ... data to create a EventAttendee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventAttendee we want to update
     *   }
     * })
     */
    upsert<T extends EventAttendeeUpsertArgs>(
      args: SelectSubset<T, EventAttendeeUpsertArgs<ExtArgs>>
    ): Prisma__EventAttendeeClient<
      $Result.GetResult<Prisma.$EventAttendeePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of EventAttendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeCountArgs} args - Arguments to filter EventAttendees to count.
     * @example
     * // Count the number of EventAttendees
     * const count = await prisma.eventAttendee.count({
     *   where: {
     *     // ... the filter for the EventAttendees we want to count
     *   }
     * })
     **/
    count<T extends EventAttendeeCountArgs>(
      args?: Subset<T, EventAttendeeCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventAttendeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventAttendeeAggregateArgs>(
      args: Subset<T, EventAttendeeAggregateArgs>
    ): Prisma.PrismaPromise<GetEventAttendeeAggregateType<T>>

    /**
     * Group by EventAttendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendeeGroupByArgs} args - Group by arguments.
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
      T extends EventAttendeeGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventAttendeeGroupByArgs['orderBy'] }
        : { orderBy?: EventAttendeeGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, EventAttendeeGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetEventAttendeeGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the EventAttendee model
     */
    readonly fields: EventAttendeeFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventAttendee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventAttendeeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
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
   * Fields of the EventAttendee model
   */
  interface EventAttendeeFieldRefs {
    readonly eventId: FieldRef<'EventAttendee', 'String'>
    readonly profileId: FieldRef<'EventAttendee', 'String'>
  }

  // Custom InputTypes
  /**
   * EventAttendee findUnique
   */
  export type EventAttendeeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendee to fetch.
     */
    where: EventAttendeeWhereUniqueInput
  }

  /**
   * EventAttendee findUniqueOrThrow
   */
  export type EventAttendeeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendee to fetch.
     */
    where: EventAttendeeWhereUniqueInput
  }

  /**
   * EventAttendee findFirst
   */
  export type EventAttendeeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendee to fetch.
     */
    where?: EventAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?: EventAttendeeOrderByWithRelationInput | EventAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventAttendees.
     */
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[]
  }

  /**
   * EventAttendee findFirstOrThrow
   */
  export type EventAttendeeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendee to fetch.
     */
    where?: EventAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?: EventAttendeeOrderByWithRelationInput | EventAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventAttendees.
     */
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[]
  }

  /**
   * EventAttendee findMany
   */
  export type EventAttendeeFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendees to fetch.
     */
    where?: EventAttendeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventAttendees to fetch.
     */
    orderBy?: EventAttendeeOrderByWithRelationInput | EventAttendeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventAttendees.
     */
    cursor?: EventAttendeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventAttendees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventAttendees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventAttendees.
     */
    distinct?: EventAttendeeScalarFieldEnum | EventAttendeeScalarFieldEnum[]
  }

  /**
   * EventAttendee create
   */
  export type EventAttendeeCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * The data needed to create a EventAttendee.
     */
    data: XOR<EventAttendeeCreateInput, EventAttendeeUncheckedCreateInput>
  }

  /**
   * EventAttendee createMany
   */
  export type EventAttendeeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many EventAttendees.
     */
    data: EventAttendeeCreateManyInput | EventAttendeeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventAttendee createManyAndReturn
   */
  export type EventAttendeeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * The data used to create many EventAttendees.
     */
    data: EventAttendeeCreateManyInput | EventAttendeeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventAttendee update
   */
  export type EventAttendeeUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * The data needed to update a EventAttendee.
     */
    data: XOR<EventAttendeeUpdateInput, EventAttendeeUncheckedUpdateInput>
    /**
     * Choose, which EventAttendee to update.
     */
    where: EventAttendeeWhereUniqueInput
  }

  /**
   * EventAttendee updateMany
   */
  export type EventAttendeeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update EventAttendees.
     */
    data: XOR<EventAttendeeUpdateManyMutationInput, EventAttendeeUncheckedUpdateManyInput>
    /**
     * Filter which EventAttendees to update
     */
    where?: EventAttendeeWhereInput
    /**
     * Limit how many EventAttendees to update.
     */
    limit?: number
  }

  /**
   * EventAttendee updateManyAndReturn
   */
  export type EventAttendeeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * The data used to update EventAttendees.
     */
    data: XOR<EventAttendeeUpdateManyMutationInput, EventAttendeeUncheckedUpdateManyInput>
    /**
     * Filter which EventAttendees to update
     */
    where?: EventAttendeeWhereInput
    /**
     * Limit how many EventAttendees to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventAttendee upsert
   */
  export type EventAttendeeUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * The filter to search for the EventAttendee to update in case it exists.
     */
    where: EventAttendeeWhereUniqueInput
    /**
     * In case the EventAttendee found by the `where` argument doesn't exist, create a new EventAttendee with this data.
     */
    create: XOR<EventAttendeeCreateInput, EventAttendeeUncheckedCreateInput>
    /**
     * In case the EventAttendee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventAttendeeUpdateInput, EventAttendeeUncheckedUpdateInput>
  }

  /**
   * EventAttendee delete
   */
  export type EventAttendeeDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
    /**
     * Filter which EventAttendee to delete.
     */
    where: EventAttendeeWhereUniqueInput
  }

  /**
   * EventAttendee deleteMany
   */
  export type EventAttendeeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventAttendees to delete
     */
    where?: EventAttendeeWhereInput
    /**
     * Limit how many EventAttendees to delete.
     */
    limit?: number
  }

  /**
   * EventAttendee without action
   */
  export type EventAttendeeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventAttendee
     */
    select?: EventAttendeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendee
     */
    omit?: EventAttendeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendeeInclude<ExtArgs> | null
  }

  /**
   * Model EventException
   */

  export type AggregateEventException = {
    _count: EventExceptionCountAggregateOutputType | null
    _min: EventExceptionMinAggregateOutputType | null
    _max: EventExceptionMaxAggregateOutputType | null
  }

  export type EventExceptionMinAggregateOutputType = {
    eventId: string | null
    occurrenceDate: Date | null
    kind: string | null
    createdAt: Date | null
  }

  export type EventExceptionMaxAggregateOutputType = {
    eventId: string | null
    occurrenceDate: Date | null
    kind: string | null
    createdAt: Date | null
  }

  export type EventExceptionCountAggregateOutputType = {
    eventId: number
    occurrenceDate: number
    kind: number
    createdAt: number
    _all: number
  }

  export type EventExceptionMinAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    kind?: true
    createdAt?: true
  }

  export type EventExceptionMaxAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    kind?: true
    createdAt?: true
  }

  export type EventExceptionCountAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    kind?: true
    createdAt?: true
    _all?: true
  }

  export type EventExceptionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventException to aggregate.
     */
    where?: EventExceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventExceptions to fetch.
     */
    orderBy?: EventExceptionOrderByWithRelationInput | EventExceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventExceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventExceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventExceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventExceptions
     **/
    _count?: true | EventExceptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventExceptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventExceptionMaxAggregateInputType
  }

  export type GetEventExceptionAggregateType<T extends EventExceptionAggregateArgs> = {
    [P in keyof T & keyof AggregateEventException]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventException[P]>
      : GetScalarType<T[P], AggregateEventException[P]>
  }

  export type EventExceptionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventExceptionWhereInput
    orderBy?:
      | EventExceptionOrderByWithAggregationInput
      | EventExceptionOrderByWithAggregationInput[]
    by: EventExceptionScalarFieldEnum[] | EventExceptionScalarFieldEnum
    having?: EventExceptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventExceptionCountAggregateInputType | true
    _min?: EventExceptionMinAggregateInputType
    _max?: EventExceptionMaxAggregateInputType
  }

  export type EventExceptionGroupByOutputType = {
    eventId: string
    occurrenceDate: Date
    kind: string
    createdAt: Date
    _count: EventExceptionCountAggregateOutputType | null
    _min: EventExceptionMinAggregateOutputType | null
    _max: EventExceptionMaxAggregateOutputType | null
  }

  type GetEventExceptionGroupByPayload<T extends EventExceptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventExceptionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof EventExceptionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], EventExceptionGroupByOutputType[P]>
          : GetScalarType<T[P], EventExceptionGroupByOutputType[P]>
      }
    >
  >

  export type EventExceptionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      kind?: boolean
      createdAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventException']
  >

  export type EventExceptionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      kind?: boolean
      createdAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventException']
  >

  export type EventExceptionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      kind?: boolean
      createdAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['eventException']
  >

  export type EventExceptionSelectScalar = {
    eventId?: boolean
    occurrenceDate?: boolean
    kind?: boolean
    createdAt?: boolean
  }

  export type EventExceptionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'eventId' | 'occurrenceDate' | 'kind' | 'createdAt',
    ExtArgs['result']['eventException']
  >
  export type EventExceptionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventExceptionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventExceptionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $EventExceptionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'EventException'
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        eventId: string
        occurrenceDate: Date
        kind: string
        createdAt: Date
      },
      ExtArgs['result']['eventException']
    >
    composites: {}
  }

  type EventExceptionGetPayload<S extends boolean | null | undefined | EventExceptionDefaultArgs> =
    $Result.GetResult<Prisma.$EventExceptionPayload, S>

  type EventExceptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventExceptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventExceptionCountAggregateInputType | true
    }

  export interface EventExceptionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['EventException']
      meta: { name: 'EventException' }
    }
    /**
     * Find zero or one EventException that matches the filter.
     * @param {EventExceptionFindUniqueArgs} args - Arguments to find a EventException
     * @example
     * // Get one EventException
     * const eventException = await prisma.eventException.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventExceptionFindUniqueArgs>(
      args: SelectSubset<T, EventExceptionFindUniqueArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one EventException that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventExceptionFindUniqueOrThrowArgs} args - Arguments to find a EventException
     * @example
     * // Get one EventException
     * const eventException = await prisma.eventException.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventExceptionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventExceptionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first EventException that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionFindFirstArgs} args - Arguments to find a EventException
     * @example
     * // Get one EventException
     * const eventException = await prisma.eventException.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventExceptionFindFirstArgs>(
      args?: SelectSubset<T, EventExceptionFindFirstArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first EventException that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionFindFirstOrThrowArgs} args - Arguments to find a EventException
     * @example
     * // Get one EventException
     * const eventException = await prisma.eventException.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventExceptionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventExceptionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more EventExceptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventExceptions
     * const eventExceptions = await prisma.eventException.findMany()
     *
     * // Get first 10 EventExceptions
     * const eventExceptions = await prisma.eventException.findMany({ take: 10 })
     *
     * // Only select the `eventId`
     * const eventExceptionWithEventIdOnly = await prisma.eventException.findMany({ select: { eventId: true } })
     *
     */
    findMany<T extends EventExceptionFindManyArgs>(
      args?: SelectSubset<T, EventExceptionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a EventException.
     * @param {EventExceptionCreateArgs} args - Arguments to create a EventException.
     * @example
     * // Create one EventException
     * const EventException = await prisma.eventException.create({
     *   data: {
     *     // ... data to create a EventException
     *   }
     * })
     *
     */
    create<T extends EventExceptionCreateArgs>(
      args: SelectSubset<T, EventExceptionCreateArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many EventExceptions.
     * @param {EventExceptionCreateManyArgs} args - Arguments to create many EventExceptions.
     * @example
     * // Create many EventExceptions
     * const eventException = await prisma.eventException.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventExceptionCreateManyArgs>(
      args?: SelectSubset<T, EventExceptionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventExceptions and returns the data saved in the database.
     * @param {EventExceptionCreateManyAndReturnArgs} args - Arguments to create many EventExceptions.
     * @example
     * // Create many EventExceptions
     * const eventException = await prisma.eventException.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many EventExceptions and only return the `eventId`
     * const eventExceptionWithEventIdOnly = await prisma.eventException.createManyAndReturn({
     *   select: { eventId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventExceptionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventExceptionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a EventException.
     * @param {EventExceptionDeleteArgs} args - Arguments to delete one EventException.
     * @example
     * // Delete one EventException
     * const EventException = await prisma.eventException.delete({
     *   where: {
     *     // ... filter to delete one EventException
     *   }
     * })
     *
     */
    delete<T extends EventExceptionDeleteArgs>(
      args: SelectSubset<T, EventExceptionDeleteArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one EventException.
     * @param {EventExceptionUpdateArgs} args - Arguments to update one EventException.
     * @example
     * // Update one EventException
     * const eventException = await prisma.eventException.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventExceptionUpdateArgs>(
      args: SelectSubset<T, EventExceptionUpdateArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more EventExceptions.
     * @param {EventExceptionDeleteManyArgs} args - Arguments to filter EventExceptions to delete.
     * @example
     * // Delete a few EventExceptions
     * const { count } = await prisma.eventException.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventExceptionDeleteManyArgs>(
      args?: SelectSubset<T, EventExceptionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventExceptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventExceptions
     * const eventException = await prisma.eventException.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventExceptionUpdateManyArgs>(
      args: SelectSubset<T, EventExceptionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventExceptions and returns the data updated in the database.
     * @param {EventExceptionUpdateManyAndReturnArgs} args - Arguments to update many EventExceptions.
     * @example
     * // Update many EventExceptions
     * const eventException = await prisma.eventException.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more EventExceptions and only return the `eventId`
     * const eventExceptionWithEventIdOnly = await prisma.eventException.updateManyAndReturn({
     *   select: { eventId: true },
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
    updateManyAndReturn<T extends EventExceptionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, EventExceptionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EventExceptionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one EventException.
     * @param {EventExceptionUpsertArgs} args - Arguments to update or create a EventException.
     * @example
     * // Update or create a EventException
     * const eventException = await prisma.eventException.upsert({
     *   create: {
     *     // ... data to create a EventException
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventException we want to update
     *   }
     * })
     */
    upsert<T extends EventExceptionUpsertArgs>(
      args: SelectSubset<T, EventExceptionUpsertArgs<ExtArgs>>
    ): Prisma__EventExceptionClient<
      $Result.GetResult<Prisma.$EventExceptionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of EventExceptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionCountArgs} args - Arguments to filter EventExceptions to count.
     * @example
     * // Count the number of EventExceptions
     * const count = await prisma.eventException.count({
     *   where: {
     *     // ... the filter for the EventExceptions we want to count
     *   }
     * })
     **/
    count<T extends EventExceptionCountArgs>(
      args?: Subset<T, EventExceptionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventExceptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventException.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventExceptionAggregateArgs>(
      args: Subset<T, EventExceptionAggregateArgs>
    ): Prisma.PrismaPromise<GetEventExceptionAggregateType<T>>

    /**
     * Group by EventException.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventExceptionGroupByArgs} args - Group by arguments.
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
      T extends EventExceptionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventExceptionGroupByArgs['orderBy'] }
        : { orderBy?: EventExceptionGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, EventExceptionGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetEventExceptionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the EventException model
     */
    readonly fields: EventExceptionFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventException.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventExceptionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
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
   * Fields of the EventException model
   */
  interface EventExceptionFieldRefs {
    readonly eventId: FieldRef<'EventException', 'String'>
    readonly occurrenceDate: FieldRef<'EventException', 'DateTime'>
    readonly kind: FieldRef<'EventException', 'String'>
    readonly createdAt: FieldRef<'EventException', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * EventException findUnique
   */
  export type EventExceptionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter, which EventException to fetch.
     */
    where: EventExceptionWhereUniqueInput
  }

  /**
   * EventException findUniqueOrThrow
   */
  export type EventExceptionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter, which EventException to fetch.
     */
    where: EventExceptionWhereUniqueInput
  }

  /**
   * EventException findFirst
   */
  export type EventExceptionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter, which EventException to fetch.
     */
    where?: EventExceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventExceptions to fetch.
     */
    orderBy?: EventExceptionOrderByWithRelationInput | EventExceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventExceptions.
     */
    cursor?: EventExceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventExceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventExceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventExceptions.
     */
    distinct?: EventExceptionScalarFieldEnum | EventExceptionScalarFieldEnum[]
  }

  /**
   * EventException findFirstOrThrow
   */
  export type EventExceptionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter, which EventException to fetch.
     */
    where?: EventExceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventExceptions to fetch.
     */
    orderBy?: EventExceptionOrderByWithRelationInput | EventExceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventExceptions.
     */
    cursor?: EventExceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventExceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventExceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventExceptions.
     */
    distinct?: EventExceptionScalarFieldEnum | EventExceptionScalarFieldEnum[]
  }

  /**
   * EventException findMany
   */
  export type EventExceptionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter, which EventExceptions to fetch.
     */
    where?: EventExceptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventExceptions to fetch.
     */
    orderBy?: EventExceptionOrderByWithRelationInput | EventExceptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventExceptions.
     */
    cursor?: EventExceptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventExceptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventExceptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventExceptions.
     */
    distinct?: EventExceptionScalarFieldEnum | EventExceptionScalarFieldEnum[]
  }

  /**
   * EventException create
   */
  export type EventExceptionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * The data needed to create a EventException.
     */
    data: XOR<EventExceptionCreateInput, EventExceptionUncheckedCreateInput>
  }

  /**
   * EventException createMany
   */
  export type EventExceptionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many EventExceptions.
     */
    data: EventExceptionCreateManyInput | EventExceptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventException createManyAndReturn
   */
  export type EventExceptionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * The data used to create many EventExceptions.
     */
    data: EventExceptionCreateManyInput | EventExceptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventException update
   */
  export type EventExceptionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * The data needed to update a EventException.
     */
    data: XOR<EventExceptionUpdateInput, EventExceptionUncheckedUpdateInput>
    /**
     * Choose, which EventException to update.
     */
    where: EventExceptionWhereUniqueInput
  }

  /**
   * EventException updateMany
   */
  export type EventExceptionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update EventExceptions.
     */
    data: XOR<EventExceptionUpdateManyMutationInput, EventExceptionUncheckedUpdateManyInput>
    /**
     * Filter which EventExceptions to update
     */
    where?: EventExceptionWhereInput
    /**
     * Limit how many EventExceptions to update.
     */
    limit?: number
  }

  /**
   * EventException updateManyAndReturn
   */
  export type EventExceptionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * The data used to update EventExceptions.
     */
    data: XOR<EventExceptionUpdateManyMutationInput, EventExceptionUncheckedUpdateManyInput>
    /**
     * Filter which EventExceptions to update
     */
    where?: EventExceptionWhereInput
    /**
     * Limit how many EventExceptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventException upsert
   */
  export type EventExceptionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * The filter to search for the EventException to update in case it exists.
     */
    where: EventExceptionWhereUniqueInput
    /**
     * In case the EventException found by the `where` argument doesn't exist, create a new EventException with this data.
     */
    create: XOR<EventExceptionCreateInput, EventExceptionUncheckedCreateInput>
    /**
     * In case the EventException was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventExceptionUpdateInput, EventExceptionUncheckedUpdateInput>
  }

  /**
   * EventException delete
   */
  export type EventExceptionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
    /**
     * Filter which EventException to delete.
     */
    where: EventExceptionWhereUniqueInput
  }

  /**
   * EventException deleteMany
   */
  export type EventExceptionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EventExceptions to delete
     */
    where?: EventExceptionWhereInput
    /**
     * Limit how many EventExceptions to delete.
     */
    limit?: number
  }

  /**
   * EventException without action
   */
  export type EventExceptionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventException
     */
    select?: EventExceptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventException
     */
    omit?: EventExceptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventExceptionInclude<ExtArgs> | null
  }

  /**
   * Model ReminderLog
   */

  export type AggregateReminderLog = {
    _count: ReminderLogCountAggregateOutputType | null
    _min: ReminderLogMinAggregateOutputType | null
    _max: ReminderLogMaxAggregateOutputType | null
  }

  export type ReminderLogMinAggregateOutputType = {
    eventId: string | null
    occurrenceDate: Date | null
    firedAt: Date | null
  }

  export type ReminderLogMaxAggregateOutputType = {
    eventId: string | null
    occurrenceDate: Date | null
    firedAt: Date | null
  }

  export type ReminderLogCountAggregateOutputType = {
    eventId: number
    occurrenceDate: number
    firedAt: number
    _all: number
  }

  export type ReminderLogMinAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    firedAt?: true
  }

  export type ReminderLogMaxAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    firedAt?: true
  }

  export type ReminderLogCountAggregateInputType = {
    eventId?: true
    occurrenceDate?: true
    firedAt?: true
    _all?: true
  }

  export type ReminderLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ReminderLog to aggregate.
     */
    where?: ReminderLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReminderLogs to fetch.
     */
    orderBy?: ReminderLogOrderByWithRelationInput | ReminderLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ReminderLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReminderLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReminderLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ReminderLogs
     **/
    _count?: true | ReminderLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ReminderLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ReminderLogMaxAggregateInputType
  }

  export type GetReminderLogAggregateType<T extends ReminderLogAggregateArgs> = {
    [P in keyof T & keyof AggregateReminderLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReminderLog[P]>
      : GetScalarType<T[P], AggregateReminderLog[P]>
  }

  export type ReminderLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ReminderLogWhereInput
    orderBy?: ReminderLogOrderByWithAggregationInput | ReminderLogOrderByWithAggregationInput[]
    by: ReminderLogScalarFieldEnum[] | ReminderLogScalarFieldEnum
    having?: ReminderLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReminderLogCountAggregateInputType | true
    _min?: ReminderLogMinAggregateInputType
    _max?: ReminderLogMaxAggregateInputType
  }

  export type ReminderLogGroupByOutputType = {
    eventId: string
    occurrenceDate: Date
    firedAt: Date
    _count: ReminderLogCountAggregateOutputType | null
    _min: ReminderLogMinAggregateOutputType | null
    _max: ReminderLogMaxAggregateOutputType | null
  }

  type GetReminderLogGroupByPayload<T extends ReminderLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReminderLogGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ReminderLogGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ReminderLogGroupByOutputType[P]>
          : GetScalarType<T[P], ReminderLogGroupByOutputType[P]>
      }
    >
  >

  export type ReminderLogSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      firedAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['reminderLog']
  >

  export type ReminderLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      firedAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['reminderLog']
  >

  export type ReminderLogSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      eventId?: boolean
      occurrenceDate?: boolean
      firedAt?: boolean
      event?: boolean | EventDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['reminderLog']
  >

  export type ReminderLogSelectScalar = {
    eventId?: boolean
    occurrenceDate?: boolean
    firedAt?: boolean
  }

  export type ReminderLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<'eventId' | 'occurrenceDate' | 'firedAt', ExtArgs['result']['reminderLog']>
  export type ReminderLogInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type ReminderLogIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type ReminderLogIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $ReminderLogPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ReminderLog'
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        eventId: string
        occurrenceDate: Date
        firedAt: Date
      },
      ExtArgs['result']['reminderLog']
    >
    composites: {}
  }

  type ReminderLogGetPayload<S extends boolean | null | undefined | ReminderLogDefaultArgs> =
    $Result.GetResult<Prisma.$ReminderLogPayload, S>

  type ReminderLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReminderLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReminderLogCountAggregateInputType | true
    }

  export interface ReminderLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ReminderLog']
      meta: { name: 'ReminderLog' }
    }
    /**
     * Find zero or one ReminderLog that matches the filter.
     * @param {ReminderLogFindUniqueArgs} args - Arguments to find a ReminderLog
     * @example
     * // Get one ReminderLog
     * const reminderLog = await prisma.reminderLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReminderLogFindUniqueArgs>(
      args: SelectSubset<T, ReminderLogFindUniqueArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ReminderLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReminderLogFindUniqueOrThrowArgs} args - Arguments to find a ReminderLog
     * @example
     * // Get one ReminderLog
     * const reminderLog = await prisma.reminderLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReminderLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ReminderLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ReminderLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogFindFirstArgs} args - Arguments to find a ReminderLog
     * @example
     * // Get one ReminderLog
     * const reminderLog = await prisma.reminderLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReminderLogFindFirstArgs>(
      args?: SelectSubset<T, ReminderLogFindFirstArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ReminderLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogFindFirstOrThrowArgs} args - Arguments to find a ReminderLog
     * @example
     * // Get one ReminderLog
     * const reminderLog = await prisma.reminderLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReminderLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ReminderLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ReminderLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReminderLogs
     * const reminderLogs = await prisma.reminderLog.findMany()
     *
     * // Get first 10 ReminderLogs
     * const reminderLogs = await prisma.reminderLog.findMany({ take: 10 })
     *
     * // Only select the `eventId`
     * const reminderLogWithEventIdOnly = await prisma.reminderLog.findMany({ select: { eventId: true } })
     *
     */
    findMany<T extends ReminderLogFindManyArgs>(
      args?: SelectSubset<T, ReminderLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ReminderLog.
     * @param {ReminderLogCreateArgs} args - Arguments to create a ReminderLog.
     * @example
     * // Create one ReminderLog
     * const ReminderLog = await prisma.reminderLog.create({
     *   data: {
     *     // ... data to create a ReminderLog
     *   }
     * })
     *
     */
    create<T extends ReminderLogCreateArgs>(
      args: SelectSubset<T, ReminderLogCreateArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ReminderLogs.
     * @param {ReminderLogCreateManyArgs} args - Arguments to create many ReminderLogs.
     * @example
     * // Create many ReminderLogs
     * const reminderLog = await prisma.reminderLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ReminderLogCreateManyArgs>(
      args?: SelectSubset<T, ReminderLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReminderLogs and returns the data saved in the database.
     * @param {ReminderLogCreateManyAndReturnArgs} args - Arguments to create many ReminderLogs.
     * @example
     * // Create many ReminderLogs
     * const reminderLog = await prisma.reminderLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ReminderLogs and only return the `eventId`
     * const reminderLogWithEventIdOnly = await prisma.reminderLog.createManyAndReturn({
     *   select: { eventId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ReminderLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ReminderLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ReminderLog.
     * @param {ReminderLogDeleteArgs} args - Arguments to delete one ReminderLog.
     * @example
     * // Delete one ReminderLog
     * const ReminderLog = await prisma.reminderLog.delete({
     *   where: {
     *     // ... filter to delete one ReminderLog
     *   }
     * })
     *
     */
    delete<T extends ReminderLogDeleteArgs>(
      args: SelectSubset<T, ReminderLogDeleteArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ReminderLog.
     * @param {ReminderLogUpdateArgs} args - Arguments to update one ReminderLog.
     * @example
     * // Update one ReminderLog
     * const reminderLog = await prisma.reminderLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ReminderLogUpdateArgs>(
      args: SelectSubset<T, ReminderLogUpdateArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ReminderLogs.
     * @param {ReminderLogDeleteManyArgs} args - Arguments to filter ReminderLogs to delete.
     * @example
     * // Delete a few ReminderLogs
     * const { count } = await prisma.reminderLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ReminderLogDeleteManyArgs>(
      args?: SelectSubset<T, ReminderLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReminderLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReminderLogs
     * const reminderLog = await prisma.reminderLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ReminderLogUpdateManyArgs>(
      args: SelectSubset<T, ReminderLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReminderLogs and returns the data updated in the database.
     * @param {ReminderLogUpdateManyAndReturnArgs} args - Arguments to update many ReminderLogs.
     * @example
     * // Update many ReminderLogs
     * const reminderLog = await prisma.reminderLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ReminderLogs and only return the `eventId`
     * const reminderLogWithEventIdOnly = await prisma.reminderLog.updateManyAndReturn({
     *   select: { eventId: true },
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
    updateManyAndReturn<T extends ReminderLogUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ReminderLogUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ReminderLogPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ReminderLog.
     * @param {ReminderLogUpsertArgs} args - Arguments to update or create a ReminderLog.
     * @example
     * // Update or create a ReminderLog
     * const reminderLog = await prisma.reminderLog.upsert({
     *   create: {
     *     // ... data to create a ReminderLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReminderLog we want to update
     *   }
     * })
     */
    upsert<T extends ReminderLogUpsertArgs>(
      args: SelectSubset<T, ReminderLogUpsertArgs<ExtArgs>>
    ): Prisma__ReminderLogClient<
      $Result.GetResult<Prisma.$ReminderLogPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ReminderLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogCountArgs} args - Arguments to filter ReminderLogs to count.
     * @example
     * // Count the number of ReminderLogs
     * const count = await prisma.reminderLog.count({
     *   where: {
     *     // ... the filter for the ReminderLogs we want to count
     *   }
     * })
     **/
    count<T extends ReminderLogCountArgs>(
      args?: Subset<T, ReminderLogCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReminderLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReminderLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReminderLogAggregateArgs>(
      args: Subset<T, ReminderLogAggregateArgs>
    ): Prisma.PrismaPromise<GetReminderLogAggregateType<T>>

    /**
     * Group by ReminderLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderLogGroupByArgs} args - Group by arguments.
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
      T extends ReminderLogGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReminderLogGroupByArgs['orderBy'] }
        : { orderBy?: ReminderLogGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, ReminderLogGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetReminderLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ReminderLog model
     */
    readonly fields: ReminderLogFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReminderLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReminderLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
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
   * Fields of the ReminderLog model
   */
  interface ReminderLogFieldRefs {
    readonly eventId: FieldRef<'ReminderLog', 'String'>
    readonly occurrenceDate: FieldRef<'ReminderLog', 'DateTime'>
    readonly firedAt: FieldRef<'ReminderLog', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * ReminderLog findUnique
   */
  export type ReminderLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter, which ReminderLog to fetch.
     */
    where: ReminderLogWhereUniqueInput
  }

  /**
   * ReminderLog findUniqueOrThrow
   */
  export type ReminderLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter, which ReminderLog to fetch.
     */
    where: ReminderLogWhereUniqueInput
  }

  /**
   * ReminderLog findFirst
   */
  export type ReminderLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter, which ReminderLog to fetch.
     */
    where?: ReminderLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReminderLogs to fetch.
     */
    orderBy?: ReminderLogOrderByWithRelationInput | ReminderLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReminderLogs.
     */
    cursor?: ReminderLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReminderLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReminderLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReminderLogs.
     */
    distinct?: ReminderLogScalarFieldEnum | ReminderLogScalarFieldEnum[]
  }

  /**
   * ReminderLog findFirstOrThrow
   */
  export type ReminderLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter, which ReminderLog to fetch.
     */
    where?: ReminderLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReminderLogs to fetch.
     */
    orderBy?: ReminderLogOrderByWithRelationInput | ReminderLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReminderLogs.
     */
    cursor?: ReminderLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReminderLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReminderLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReminderLogs.
     */
    distinct?: ReminderLogScalarFieldEnum | ReminderLogScalarFieldEnum[]
  }

  /**
   * ReminderLog findMany
   */
  export type ReminderLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter, which ReminderLogs to fetch.
     */
    where?: ReminderLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReminderLogs to fetch.
     */
    orderBy?: ReminderLogOrderByWithRelationInput | ReminderLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ReminderLogs.
     */
    cursor?: ReminderLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReminderLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReminderLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReminderLogs.
     */
    distinct?: ReminderLogScalarFieldEnum | ReminderLogScalarFieldEnum[]
  }

  /**
   * ReminderLog create
   */
  export type ReminderLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ReminderLog.
     */
    data: XOR<ReminderLogCreateInput, ReminderLogUncheckedCreateInput>
  }

  /**
   * ReminderLog createMany
   */
  export type ReminderLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ReminderLogs.
     */
    data: ReminderLogCreateManyInput | ReminderLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReminderLog createManyAndReturn
   */
  export type ReminderLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * The data used to create many ReminderLogs.
     */
    data: ReminderLogCreateManyInput | ReminderLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReminderLog update
   */
  export type ReminderLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ReminderLog.
     */
    data: XOR<ReminderLogUpdateInput, ReminderLogUncheckedUpdateInput>
    /**
     * Choose, which ReminderLog to update.
     */
    where: ReminderLogWhereUniqueInput
  }

  /**
   * ReminderLog updateMany
   */
  export type ReminderLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ReminderLogs.
     */
    data: XOR<ReminderLogUpdateManyMutationInput, ReminderLogUncheckedUpdateManyInput>
    /**
     * Filter which ReminderLogs to update
     */
    where?: ReminderLogWhereInput
    /**
     * Limit how many ReminderLogs to update.
     */
    limit?: number
  }

  /**
   * ReminderLog updateManyAndReturn
   */
  export type ReminderLogUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * The data used to update ReminderLogs.
     */
    data: XOR<ReminderLogUpdateManyMutationInput, ReminderLogUncheckedUpdateManyInput>
    /**
     * Filter which ReminderLogs to update
     */
    where?: ReminderLogWhereInput
    /**
     * Limit how many ReminderLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReminderLog upsert
   */
  export type ReminderLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ReminderLog to update in case it exists.
     */
    where: ReminderLogWhereUniqueInput
    /**
     * In case the ReminderLog found by the `where` argument doesn't exist, create a new ReminderLog with this data.
     */
    create: XOR<ReminderLogCreateInput, ReminderLogUncheckedCreateInput>
    /**
     * In case the ReminderLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReminderLogUpdateInput, ReminderLogUncheckedUpdateInput>
  }

  /**
   * ReminderLog delete
   */
  export type ReminderLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
    /**
     * Filter which ReminderLog to delete.
     */
    where: ReminderLogWhereUniqueInput
  }

  /**
   * ReminderLog deleteMany
   */
  export type ReminderLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ReminderLogs to delete
     */
    where?: ReminderLogWhereInput
    /**
     * Limit how many ReminderLogs to delete.
     */
    limit?: number
  }

  /**
   * ReminderLog without action
   */
  export type ReminderLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ReminderLog
     */
    select?: ReminderLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReminderLog
     */
    omit?: ReminderLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderLogInclude<ExtArgs> | null
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

  export const EventScalarFieldEnum: {
    id: 'id'
    title: 'title'
    description: 'description'
    createdBy: 'createdBy'
    startsAt: 'startsAt'
    endsAt: 'endsAt'
    allDay: 'allDay'
    location: 'location'
    recurrence: 'recurrence'
    recurrenceDayOffsets: 'recurrenceDayOffsets'
    recurrenceUntil: 'recurrenceUntil'
    isActivity: 'isActivity'
    status: 'status'
    source: 'source'
    reminderMinutes: 'reminderMinutes'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type EventScalarFieldEnum =
    (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]

  export const EventAttendeeScalarFieldEnum: {
    eventId: 'eventId'
    profileId: 'profileId'
  }

  export type EventAttendeeScalarFieldEnum =
    (typeof EventAttendeeScalarFieldEnum)[keyof typeof EventAttendeeScalarFieldEnum]

  export const EventExceptionScalarFieldEnum: {
    eventId: 'eventId'
    occurrenceDate: 'occurrenceDate'
    kind: 'kind'
    createdAt: 'createdAt'
  }

  export type EventExceptionScalarFieldEnum =
    (typeof EventExceptionScalarFieldEnum)[keyof typeof EventExceptionScalarFieldEnum]

  export const ReminderLogScalarFieldEnum: {
    eventId: 'eventId'
    occurrenceDate: 'occurrenceDate'
    firedAt: 'firedAt'
  }

  export type ReminderLogScalarFieldEnum =
    (typeof ReminderLogScalarFieldEnum)[keyof typeof ReminderLogScalarFieldEnum]

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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

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

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: UuidFilter<'Event'> | string
    title?: StringFilter<'Event'> | string
    description?: StringNullableFilter<'Event'> | string | null
    createdBy?: UuidFilter<'Event'> | string
    startsAt?: DateTimeFilter<'Event'> | Date | string
    endsAt?: DateTimeNullableFilter<'Event'> | Date | string | null
    allDay?: BoolFilter<'Event'> | boolean
    location?: StringNullableFilter<'Event'> | string | null
    recurrence?: StringNullableFilter<'Event'> | string | null
    recurrenceDayOffsets?: IntNullableListFilter<'Event'>
    recurrenceUntil?: DateTimeNullableFilter<'Event'> | Date | string | null
    isActivity?: BoolFilter<'Event'> | boolean
    status?: StringFilter<'Event'> | string
    source?: StringFilter<'Event'> | string
    reminderMinutes?: IntNullableFilter<'Event'> | number | null
    createdAt?: DateTimeFilter<'Event'> | Date | string
    updatedAt?: DateTimeFilter<'Event'> | Date | string
    attendees?: EventAttendeeListRelationFilter
    exceptions?: EventExceptionListRelationFilter
    reminders?: ReminderLogListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrderInput | SortOrder
    allDay?: SortOrder
    location?: SortOrderInput | SortOrder
    recurrence?: SortOrderInput | SortOrder
    recurrenceDayOffsets?: SortOrder
    recurrenceUntil?: SortOrderInput | SortOrder
    isActivity?: SortOrder
    status?: SortOrder
    source?: SortOrder
    reminderMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    attendees?: EventAttendeeOrderByRelationAggregateInput
    exceptions?: EventExceptionOrderByRelationAggregateInput
    reminders?: ReminderLogOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: EventWhereInput | EventWhereInput[]
      OR?: EventWhereInput[]
      NOT?: EventWhereInput | EventWhereInput[]
      title?: StringFilter<'Event'> | string
      description?: StringNullableFilter<'Event'> | string | null
      createdBy?: UuidFilter<'Event'> | string
      startsAt?: DateTimeFilter<'Event'> | Date | string
      endsAt?: DateTimeNullableFilter<'Event'> | Date | string | null
      allDay?: BoolFilter<'Event'> | boolean
      location?: StringNullableFilter<'Event'> | string | null
      recurrence?: StringNullableFilter<'Event'> | string | null
      recurrenceDayOffsets?: IntNullableListFilter<'Event'>
      recurrenceUntil?: DateTimeNullableFilter<'Event'> | Date | string | null
      isActivity?: BoolFilter<'Event'> | boolean
      status?: StringFilter<'Event'> | string
      source?: StringFilter<'Event'> | string
      reminderMinutes?: IntNullableFilter<'Event'> | number | null
      createdAt?: DateTimeFilter<'Event'> | Date | string
      updatedAt?: DateTimeFilter<'Event'> | Date | string
      attendees?: EventAttendeeListRelationFilter
      exceptions?: EventExceptionListRelationFilter
      reminders?: ReminderLogListRelationFilter
    },
    'id'
  >

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrderInput | SortOrder
    allDay?: SortOrder
    location?: SortOrderInput | SortOrder
    recurrence?: SortOrderInput | SortOrder
    recurrenceDayOffsets?: SortOrder
    recurrenceUntil?: SortOrderInput | SortOrder
    isActivity?: SortOrder
    status?: SortOrder
    source?: SortOrder
    reminderMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<'Event'> | string
    title?: StringWithAggregatesFilter<'Event'> | string
    description?: StringNullableWithAggregatesFilter<'Event'> | string | null
    createdBy?: UuidWithAggregatesFilter<'Event'> | string
    startsAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string
    endsAt?: DateTimeNullableWithAggregatesFilter<'Event'> | Date | string | null
    allDay?: BoolWithAggregatesFilter<'Event'> | boolean
    location?: StringNullableWithAggregatesFilter<'Event'> | string | null
    recurrence?: StringNullableWithAggregatesFilter<'Event'> | string | null
    recurrenceDayOffsets?: IntNullableListFilter<'Event'>
    recurrenceUntil?: DateTimeNullableWithAggregatesFilter<'Event'> | Date | string | null
    isActivity?: BoolWithAggregatesFilter<'Event'> | boolean
    status?: StringWithAggregatesFilter<'Event'> | string
    source?: StringWithAggregatesFilter<'Event'> | string
    reminderMinutes?: IntNullableWithAggregatesFilter<'Event'> | number | null
    createdAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string
  }

  export type EventAttendeeWhereInput = {
    AND?: EventAttendeeWhereInput | EventAttendeeWhereInput[]
    OR?: EventAttendeeWhereInput[]
    NOT?: EventAttendeeWhereInput | EventAttendeeWhereInput[]
    eventId?: UuidFilter<'EventAttendee'> | string
    profileId?: UuidFilter<'EventAttendee'> | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }

  export type EventAttendeeOrderByWithRelationInput = {
    eventId?: SortOrder
    profileId?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type EventAttendeeWhereUniqueInput = Prisma.AtLeast<
    {
      eventId_profileId?: EventAttendeeEventIdProfileIdCompoundUniqueInput
      AND?: EventAttendeeWhereInput | EventAttendeeWhereInput[]
      OR?: EventAttendeeWhereInput[]
      NOT?: EventAttendeeWhereInput | EventAttendeeWhereInput[]
      eventId?: UuidFilter<'EventAttendee'> | string
      profileId?: UuidFilter<'EventAttendee'> | string
      event?: XOR<EventScalarRelationFilter, EventWhereInput>
    },
    'eventId_profileId'
  >

  export type EventAttendeeOrderByWithAggregationInput = {
    eventId?: SortOrder
    profileId?: SortOrder
    _count?: EventAttendeeCountOrderByAggregateInput
    _max?: EventAttendeeMaxOrderByAggregateInput
    _min?: EventAttendeeMinOrderByAggregateInput
  }

  export type EventAttendeeScalarWhereWithAggregatesInput = {
    AND?:
      | EventAttendeeScalarWhereWithAggregatesInput
      | EventAttendeeScalarWhereWithAggregatesInput[]
    OR?: EventAttendeeScalarWhereWithAggregatesInput[]
    NOT?:
      | EventAttendeeScalarWhereWithAggregatesInput
      | EventAttendeeScalarWhereWithAggregatesInput[]
    eventId?: UuidWithAggregatesFilter<'EventAttendee'> | string
    profileId?: UuidWithAggregatesFilter<'EventAttendee'> | string
  }

  export type EventExceptionWhereInput = {
    AND?: EventExceptionWhereInput | EventExceptionWhereInput[]
    OR?: EventExceptionWhereInput[]
    NOT?: EventExceptionWhereInput | EventExceptionWhereInput[]
    eventId?: UuidFilter<'EventException'> | string
    occurrenceDate?: DateTimeFilter<'EventException'> | Date | string
    kind?: StringFilter<'EventException'> | string
    createdAt?: DateTimeFilter<'EventException'> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }

  export type EventExceptionOrderByWithRelationInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type EventExceptionWhereUniqueInput = Prisma.AtLeast<
    {
      eventId_occurrenceDate?: EventExceptionEventIdOccurrenceDateCompoundUniqueInput
      AND?: EventExceptionWhereInput | EventExceptionWhereInput[]
      OR?: EventExceptionWhereInput[]
      NOT?: EventExceptionWhereInput | EventExceptionWhereInput[]
      eventId?: UuidFilter<'EventException'> | string
      occurrenceDate?: DateTimeFilter<'EventException'> | Date | string
      kind?: StringFilter<'EventException'> | string
      createdAt?: DateTimeFilter<'EventException'> | Date | string
      event?: XOR<EventScalarRelationFilter, EventWhereInput>
    },
    'eventId_occurrenceDate'
  >

  export type EventExceptionOrderByWithAggregationInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
    _count?: EventExceptionCountOrderByAggregateInput
    _max?: EventExceptionMaxOrderByAggregateInput
    _min?: EventExceptionMinOrderByAggregateInput
  }

  export type EventExceptionScalarWhereWithAggregatesInput = {
    AND?:
      | EventExceptionScalarWhereWithAggregatesInput
      | EventExceptionScalarWhereWithAggregatesInput[]
    OR?: EventExceptionScalarWhereWithAggregatesInput[]
    NOT?:
      | EventExceptionScalarWhereWithAggregatesInput
      | EventExceptionScalarWhereWithAggregatesInput[]
    eventId?: UuidWithAggregatesFilter<'EventException'> | string
    occurrenceDate?: DateTimeWithAggregatesFilter<'EventException'> | Date | string
    kind?: StringWithAggregatesFilter<'EventException'> | string
    createdAt?: DateTimeWithAggregatesFilter<'EventException'> | Date | string
  }

  export type ReminderLogWhereInput = {
    AND?: ReminderLogWhereInput | ReminderLogWhereInput[]
    OR?: ReminderLogWhereInput[]
    NOT?: ReminderLogWhereInput | ReminderLogWhereInput[]
    eventId?: UuidFilter<'ReminderLog'> | string
    occurrenceDate?: DateTimeFilter<'ReminderLog'> | Date | string
    firedAt?: DateTimeFilter<'ReminderLog'> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }

  export type ReminderLogOrderByWithRelationInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    firedAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type ReminderLogWhereUniqueInput = Prisma.AtLeast<
    {
      eventId_occurrenceDate?: ReminderLogEventIdOccurrenceDateCompoundUniqueInput
      AND?: ReminderLogWhereInput | ReminderLogWhereInput[]
      OR?: ReminderLogWhereInput[]
      NOT?: ReminderLogWhereInput | ReminderLogWhereInput[]
      eventId?: UuidFilter<'ReminderLog'> | string
      occurrenceDate?: DateTimeFilter<'ReminderLog'> | Date | string
      firedAt?: DateTimeFilter<'ReminderLog'> | Date | string
      event?: XOR<EventScalarRelationFilter, EventWhereInput>
    },
    'eventId_occurrenceDate'
  >

  export type ReminderLogOrderByWithAggregationInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    firedAt?: SortOrder
    _count?: ReminderLogCountOrderByAggregateInput
    _max?: ReminderLogMaxOrderByAggregateInput
    _min?: ReminderLogMinOrderByAggregateInput
  }

  export type ReminderLogScalarWhereWithAggregatesInput = {
    AND?: ReminderLogScalarWhereWithAggregatesInput | ReminderLogScalarWhereWithAggregatesInput[]
    OR?: ReminderLogScalarWhereWithAggregatesInput[]
    NOT?: ReminderLogScalarWhereWithAggregatesInput | ReminderLogScalarWhereWithAggregatesInput[]
    eventId?: UuidWithAggregatesFilter<'ReminderLog'> | string
    occurrenceDate?: DateTimeWithAggregatesFilter<'ReminderLog'> | Date | string
    firedAt?: DateTimeWithAggregatesFilter<'ReminderLog'> | Date | string
  }

  export type EventCreateInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeCreateNestedManyWithoutEventInput
    exceptions?: EventExceptionCreateNestedManyWithoutEventInput
    reminders?: ReminderLogCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeUncheckedCreateNestedManyWithoutEventInput
    exceptions?: EventExceptionUncheckedCreateNestedManyWithoutEventInput
    reminders?: ReminderLogUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUpdateManyWithoutEventNestedInput
    exceptions?: EventExceptionUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUncheckedUpdateManyWithoutEventNestedInput
    exceptions?: EventExceptionUncheckedUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendeeCreateInput = {
    profileId: string
    event: EventCreateNestedOneWithoutAttendeesInput
  }

  export type EventAttendeeUncheckedCreateInput = {
    eventId: string
    profileId: string
  }

  export type EventAttendeeUpdateInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    event?: EventUpdateOneRequiredWithoutAttendeesNestedInput
  }

  export type EventAttendeeUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventAttendeeCreateManyInput = {
    eventId: string
    profileId: string
  }

  export type EventAttendeeUpdateManyMutationInput = {
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventAttendeeUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventExceptionCreateInput = {
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
    event: EventCreateNestedOneWithoutExceptionsInput
  }

  export type EventExceptionUncheckedCreateInput = {
    eventId: string
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
  }

  export type EventExceptionUpdateInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutExceptionsNestedInput
  }

  export type EventExceptionUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventExceptionCreateManyInput = {
    eventId: string
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
  }

  export type EventExceptionUpdateManyMutationInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventExceptionUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogCreateInput = {
    occurrenceDate: Date | string
    firedAt?: Date | string
    event: EventCreateNestedOneWithoutRemindersInput
  }

  export type ReminderLogUncheckedCreateInput = {
    eventId: string
    occurrenceDate: Date | string
    firedAt?: Date | string
  }

  export type ReminderLogUpdateInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutRemindersNestedInput
  }

  export type ReminderLogUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogCreateManyInput = {
    eventId: string
    occurrenceDate: Date | string
    firedAt?: Date | string
  }

  export type ReminderLogUpdateManyMutationInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    has?: number | IntFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListIntFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type EventAttendeeListRelationFilter = {
    every?: EventAttendeeWhereInput
    some?: EventAttendeeWhereInput
    none?: EventAttendeeWhereInput
  }

  export type EventExceptionListRelationFilter = {
    every?: EventExceptionWhereInput
    some?: EventExceptionWhereInput
    none?: EventExceptionWhereInput
  }

  export type ReminderLogListRelationFilter = {
    every?: ReminderLogWhereInput
    some?: ReminderLogWhereInput
    none?: ReminderLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventAttendeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventExceptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReminderLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    allDay?: SortOrder
    location?: SortOrder
    recurrence?: SortOrder
    recurrenceDayOffsets?: SortOrder
    recurrenceUntil?: SortOrder
    isActivity?: SortOrder
    status?: SortOrder
    source?: SortOrder
    reminderMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    recurrenceDayOffsets?: SortOrder
    reminderMinutes?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    allDay?: SortOrder
    location?: SortOrder
    recurrence?: SortOrder
    recurrenceUntil?: SortOrder
    isActivity?: SortOrder
    status?: SortOrder
    source?: SortOrder
    reminderMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    allDay?: SortOrder
    location?: SortOrder
    recurrence?: SortOrder
    recurrenceUntil?: SortOrder
    isActivity?: SortOrder
    status?: SortOrder
    source?: SortOrder
    reminderMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    recurrenceDayOffsets?: SortOrder
    reminderMinutes?: SortOrder
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

  export type EventScalarRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type EventAttendeeEventIdProfileIdCompoundUniqueInput = {
    eventId: string
    profileId: string
  }

  export type EventAttendeeCountOrderByAggregateInput = {
    eventId?: SortOrder
    profileId?: SortOrder
  }

  export type EventAttendeeMaxOrderByAggregateInput = {
    eventId?: SortOrder
    profileId?: SortOrder
  }

  export type EventAttendeeMinOrderByAggregateInput = {
    eventId?: SortOrder
    profileId?: SortOrder
  }

  export type EventExceptionEventIdOccurrenceDateCompoundUniqueInput = {
    eventId: string
    occurrenceDate: Date | string
  }

  export type EventExceptionCountOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type EventExceptionMaxOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type EventExceptionMinOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type ReminderLogEventIdOccurrenceDateCompoundUniqueInput = {
    eventId: string
    occurrenceDate: Date | string
  }

  export type ReminderLogCountOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    firedAt?: SortOrder
  }

  export type ReminderLogMaxOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    firedAt?: SortOrder
  }

  export type ReminderLogMinOrderByAggregateInput = {
    eventId?: SortOrder
    occurrenceDate?: SortOrder
    firedAt?: SortOrder
  }

  export type EventCreaterecurrenceDayOffsetsInput = {
    set: number[]
  }

  export type EventAttendeeCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[]
    createMany?: EventAttendeeCreateManyEventInputEnvelope
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
  }

  export type EventExceptionCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<EventExceptionCreateWithoutEventInput, EventExceptionUncheckedCreateWithoutEventInput>
      | EventExceptionCreateWithoutEventInput[]
      | EventExceptionUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventExceptionCreateOrConnectWithoutEventInput
      | EventExceptionCreateOrConnectWithoutEventInput[]
    createMany?: EventExceptionCreateManyEventInputEnvelope
    connect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
  }

  export type ReminderLogCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
      | ReminderLogCreateWithoutEventInput[]
      | ReminderLogUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | ReminderLogCreateOrConnectWithoutEventInput
      | ReminderLogCreateOrConnectWithoutEventInput[]
    createMany?: ReminderLogCreateManyEventInputEnvelope
    connect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
  }

  export type EventAttendeeUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[]
    createMany?: EventAttendeeCreateManyEventInputEnvelope
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
  }

  export type EventExceptionUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<EventExceptionCreateWithoutEventInput, EventExceptionUncheckedCreateWithoutEventInput>
      | EventExceptionCreateWithoutEventInput[]
      | EventExceptionUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventExceptionCreateOrConnectWithoutEventInput
      | EventExceptionCreateOrConnectWithoutEventInput[]
    createMany?: EventExceptionCreateManyEventInputEnvelope
    connect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
  }

  export type ReminderLogUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
      | ReminderLogCreateWithoutEventInput[]
      | ReminderLogUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | ReminderLogCreateOrConnectWithoutEventInput
      | ReminderLogCreateOrConnectWithoutEventInput[]
    createMany?: ReminderLogCreateManyEventInputEnvelope
    connect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EventUpdaterecurrenceDayOffsetsInput = {
    set?: number[]
    push?: number | number[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EventAttendeeUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[]
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventAttendeeCreateManyEventInputEnvelope
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    disconnect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutEventInput
      | EventAttendeeUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[]
  }

  export type EventExceptionUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<EventExceptionCreateWithoutEventInput, EventExceptionUncheckedCreateWithoutEventInput>
      | EventExceptionCreateWithoutEventInput[]
      | EventExceptionUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventExceptionCreateOrConnectWithoutEventInput
      | EventExceptionCreateOrConnectWithoutEventInput[]
    upsert?:
      | EventExceptionUpsertWithWhereUniqueWithoutEventInput
      | EventExceptionUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventExceptionCreateManyEventInputEnvelope
    set?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    disconnect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    delete?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    connect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    update?:
      | EventExceptionUpdateWithWhereUniqueWithoutEventInput
      | EventExceptionUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | EventExceptionUpdateManyWithWhereWithoutEventInput
      | EventExceptionUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventExceptionScalarWhereInput | EventExceptionScalarWhereInput[]
  }

  export type ReminderLogUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
      | ReminderLogCreateWithoutEventInput[]
      | ReminderLogUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | ReminderLogCreateOrConnectWithoutEventInput
      | ReminderLogCreateOrConnectWithoutEventInput[]
    upsert?:
      | ReminderLogUpsertWithWhereUniqueWithoutEventInput
      | ReminderLogUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ReminderLogCreateManyEventInputEnvelope
    set?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    disconnect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    delete?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    connect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    update?:
      | ReminderLogUpdateWithWhereUniqueWithoutEventInput
      | ReminderLogUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | ReminderLogUpdateManyWithWhereWithoutEventInput
      | ReminderLogUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ReminderLogScalarWhereInput | ReminderLogScalarWhereInput[]
  }

  export type EventAttendeeUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
      | EventAttendeeCreateWithoutEventInput[]
      | EventAttendeeUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventAttendeeCreateOrConnectWithoutEventInput
      | EventAttendeeCreateOrConnectWithoutEventInput[]
    upsert?:
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput
      | EventAttendeeUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventAttendeeCreateManyEventInputEnvelope
    set?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    disconnect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    delete?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    connect?: EventAttendeeWhereUniqueInput | EventAttendeeWhereUniqueInput[]
    update?:
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput
      | EventAttendeeUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | EventAttendeeUpdateManyWithWhereWithoutEventInput
      | EventAttendeeUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[]
  }

  export type EventExceptionUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<EventExceptionCreateWithoutEventInput, EventExceptionUncheckedCreateWithoutEventInput>
      | EventExceptionCreateWithoutEventInput[]
      | EventExceptionUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | EventExceptionCreateOrConnectWithoutEventInput
      | EventExceptionCreateOrConnectWithoutEventInput[]
    upsert?:
      | EventExceptionUpsertWithWhereUniqueWithoutEventInput
      | EventExceptionUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventExceptionCreateManyEventInputEnvelope
    set?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    disconnect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    delete?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    connect?: EventExceptionWhereUniqueInput | EventExceptionWhereUniqueInput[]
    update?:
      | EventExceptionUpdateWithWhereUniqueWithoutEventInput
      | EventExceptionUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | EventExceptionUpdateManyWithWhereWithoutEventInput
      | EventExceptionUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventExceptionScalarWhereInput | EventExceptionScalarWhereInput[]
  }

  export type ReminderLogUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
      | ReminderLogCreateWithoutEventInput[]
      | ReminderLogUncheckedCreateWithoutEventInput[]
    connectOrCreate?:
      | ReminderLogCreateOrConnectWithoutEventInput
      | ReminderLogCreateOrConnectWithoutEventInput[]
    upsert?:
      | ReminderLogUpsertWithWhereUniqueWithoutEventInput
      | ReminderLogUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ReminderLogCreateManyEventInputEnvelope
    set?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    disconnect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    delete?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    connect?: ReminderLogWhereUniqueInput | ReminderLogWhereUniqueInput[]
    update?:
      | ReminderLogUpdateWithWhereUniqueWithoutEventInput
      | ReminderLogUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?:
      | ReminderLogUpdateManyWithWhereWithoutEventInput
      | ReminderLogUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ReminderLogScalarWhereInput | ReminderLogScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<EventCreateWithoutAttendeesInput, EventUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: EventCreateOrConnectWithoutAttendeesInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutAttendeesNestedInput = {
    create?: XOR<EventCreateWithoutAttendeesInput, EventUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: EventCreateOrConnectWithoutAttendeesInput
    upsert?: EventUpsertWithoutAttendeesInput
    connect?: EventWhereUniqueInput
    update?: XOR<
      XOR<EventUpdateToOneWithWhereWithoutAttendeesInput, EventUpdateWithoutAttendeesInput>,
      EventUncheckedUpdateWithoutAttendeesInput
    >
  }

  export type EventCreateNestedOneWithoutExceptionsInput = {
    create?: XOR<EventCreateWithoutExceptionsInput, EventUncheckedCreateWithoutExceptionsInput>
    connectOrCreate?: EventCreateOrConnectWithoutExceptionsInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutExceptionsNestedInput = {
    create?: XOR<EventCreateWithoutExceptionsInput, EventUncheckedCreateWithoutExceptionsInput>
    connectOrCreate?: EventCreateOrConnectWithoutExceptionsInput
    upsert?: EventUpsertWithoutExceptionsInput
    connect?: EventWhereUniqueInput
    update?: XOR<
      XOR<EventUpdateToOneWithWhereWithoutExceptionsInput, EventUpdateWithoutExceptionsInput>,
      EventUncheckedUpdateWithoutExceptionsInput
    >
  }

  export type EventCreateNestedOneWithoutRemindersInput = {
    create?: XOR<EventCreateWithoutRemindersInput, EventUncheckedCreateWithoutRemindersInput>
    connectOrCreate?: EventCreateOrConnectWithoutRemindersInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutRemindersNestedInput = {
    create?: XOR<EventCreateWithoutRemindersInput, EventUncheckedCreateWithoutRemindersInput>
    connectOrCreate?: EventCreateOrConnectWithoutRemindersInput
    upsert?: EventUpsertWithoutRemindersInput
    connect?: EventWhereUniqueInput
    update?: XOR<
      XOR<EventUpdateToOneWithWhereWithoutRemindersInput, EventUpdateWithoutRemindersInput>,
      EventUncheckedUpdateWithoutRemindersInput
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type EventAttendeeCreateWithoutEventInput = {
    profileId: string
  }

  export type EventAttendeeUncheckedCreateWithoutEventInput = {
    profileId: string
  }

  export type EventAttendeeCreateOrConnectWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput
    create: XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
  }

  export type EventAttendeeCreateManyEventInputEnvelope = {
    data: EventAttendeeCreateManyEventInput | EventAttendeeCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type EventExceptionCreateWithoutEventInput = {
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
  }

  export type EventExceptionUncheckedCreateWithoutEventInput = {
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
  }

  export type EventExceptionCreateOrConnectWithoutEventInput = {
    where: EventExceptionWhereUniqueInput
    create: XOR<
      EventExceptionCreateWithoutEventInput,
      EventExceptionUncheckedCreateWithoutEventInput
    >
  }

  export type EventExceptionCreateManyEventInputEnvelope = {
    data: EventExceptionCreateManyEventInput | EventExceptionCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type ReminderLogCreateWithoutEventInput = {
    occurrenceDate: Date | string
    firedAt?: Date | string
  }

  export type ReminderLogUncheckedCreateWithoutEventInput = {
    occurrenceDate: Date | string
    firedAt?: Date | string
  }

  export type ReminderLogCreateOrConnectWithoutEventInput = {
    where: ReminderLogWhereUniqueInput
    create: XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
  }

  export type ReminderLogCreateManyEventInputEnvelope = {
    data: ReminderLogCreateManyEventInput | ReminderLogCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type EventAttendeeUpsertWithWhereUniqueWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput
    update: XOR<EventAttendeeUpdateWithoutEventInput, EventAttendeeUncheckedUpdateWithoutEventInput>
    create: XOR<EventAttendeeCreateWithoutEventInput, EventAttendeeUncheckedCreateWithoutEventInput>
  }

  export type EventAttendeeUpdateWithWhereUniqueWithoutEventInput = {
    where: EventAttendeeWhereUniqueInput
    data: XOR<EventAttendeeUpdateWithoutEventInput, EventAttendeeUncheckedUpdateWithoutEventInput>
  }

  export type EventAttendeeUpdateManyWithWhereWithoutEventInput = {
    where: EventAttendeeScalarWhereInput
    data: XOR<
      EventAttendeeUpdateManyMutationInput,
      EventAttendeeUncheckedUpdateManyWithoutEventInput
    >
  }

  export type EventAttendeeScalarWhereInput = {
    AND?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[]
    OR?: EventAttendeeScalarWhereInput[]
    NOT?: EventAttendeeScalarWhereInput | EventAttendeeScalarWhereInput[]
    eventId?: UuidFilter<'EventAttendee'> | string
    profileId?: UuidFilter<'EventAttendee'> | string
  }

  export type EventExceptionUpsertWithWhereUniqueWithoutEventInput = {
    where: EventExceptionWhereUniqueInput
    update: XOR<
      EventExceptionUpdateWithoutEventInput,
      EventExceptionUncheckedUpdateWithoutEventInput
    >
    create: XOR<
      EventExceptionCreateWithoutEventInput,
      EventExceptionUncheckedCreateWithoutEventInput
    >
  }

  export type EventExceptionUpdateWithWhereUniqueWithoutEventInput = {
    where: EventExceptionWhereUniqueInput
    data: XOR<EventExceptionUpdateWithoutEventInput, EventExceptionUncheckedUpdateWithoutEventInput>
  }

  export type EventExceptionUpdateManyWithWhereWithoutEventInput = {
    where: EventExceptionScalarWhereInput
    data: XOR<
      EventExceptionUpdateManyMutationInput,
      EventExceptionUncheckedUpdateManyWithoutEventInput
    >
  }

  export type EventExceptionScalarWhereInput = {
    AND?: EventExceptionScalarWhereInput | EventExceptionScalarWhereInput[]
    OR?: EventExceptionScalarWhereInput[]
    NOT?: EventExceptionScalarWhereInput | EventExceptionScalarWhereInput[]
    eventId?: UuidFilter<'EventException'> | string
    occurrenceDate?: DateTimeFilter<'EventException'> | Date | string
    kind?: StringFilter<'EventException'> | string
    createdAt?: DateTimeFilter<'EventException'> | Date | string
  }

  export type ReminderLogUpsertWithWhereUniqueWithoutEventInput = {
    where: ReminderLogWhereUniqueInput
    update: XOR<ReminderLogUpdateWithoutEventInput, ReminderLogUncheckedUpdateWithoutEventInput>
    create: XOR<ReminderLogCreateWithoutEventInput, ReminderLogUncheckedCreateWithoutEventInput>
  }

  export type ReminderLogUpdateWithWhereUniqueWithoutEventInput = {
    where: ReminderLogWhereUniqueInput
    data: XOR<ReminderLogUpdateWithoutEventInput, ReminderLogUncheckedUpdateWithoutEventInput>
  }

  export type ReminderLogUpdateManyWithWhereWithoutEventInput = {
    where: ReminderLogScalarWhereInput
    data: XOR<ReminderLogUpdateManyMutationInput, ReminderLogUncheckedUpdateManyWithoutEventInput>
  }

  export type ReminderLogScalarWhereInput = {
    AND?: ReminderLogScalarWhereInput | ReminderLogScalarWhereInput[]
    OR?: ReminderLogScalarWhereInput[]
    NOT?: ReminderLogScalarWhereInput | ReminderLogScalarWhereInput[]
    eventId?: UuidFilter<'ReminderLog'> | string
    occurrenceDate?: DateTimeFilter<'ReminderLog'> | Date | string
    firedAt?: DateTimeFilter<'ReminderLog'> | Date | string
  }

  export type EventCreateWithoutAttendeesInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    exceptions?: EventExceptionCreateNestedManyWithoutEventInput
    reminders?: ReminderLogCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutAttendeesInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    exceptions?: EventExceptionUncheckedCreateNestedManyWithoutEventInput
    reminders?: ReminderLogUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutAttendeesInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutAttendeesInput, EventUncheckedCreateWithoutAttendeesInput>
  }

  export type EventUpsertWithoutAttendeesInput = {
    update: XOR<EventUpdateWithoutAttendeesInput, EventUncheckedUpdateWithoutAttendeesInput>
    create: XOR<EventCreateWithoutAttendeesInput, EventUncheckedCreateWithoutAttendeesInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutAttendeesInput, EventUncheckedUpdateWithoutAttendeesInput>
  }

  export type EventUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exceptions?: EventExceptionUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exceptions?: EventExceptionUncheckedUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutExceptionsInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeCreateNestedManyWithoutEventInput
    reminders?: ReminderLogCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutExceptionsInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeUncheckedCreateNestedManyWithoutEventInput
    reminders?: ReminderLogUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutExceptionsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutExceptionsInput, EventUncheckedCreateWithoutExceptionsInput>
  }

  export type EventUpsertWithoutExceptionsInput = {
    update: XOR<EventUpdateWithoutExceptionsInput, EventUncheckedUpdateWithoutExceptionsInput>
    create: XOR<EventCreateWithoutExceptionsInput, EventUncheckedCreateWithoutExceptionsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutExceptionsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutExceptionsInput, EventUncheckedUpdateWithoutExceptionsInput>
  }

  export type EventUpdateWithoutExceptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutExceptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUncheckedUpdateManyWithoutEventNestedInput
    reminders?: ReminderLogUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutRemindersInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeCreateNestedManyWithoutEventInput
    exceptions?: EventExceptionCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutRemindersInput = {
    id?: string
    title: string
    description?: string | null
    createdBy: string
    startsAt: Date | string
    endsAt?: Date | string | null
    allDay?: boolean
    location?: string | null
    recurrence?: string | null
    recurrenceDayOffsets?: EventCreaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: Date | string | null
    isActivity?: boolean
    status?: string
    source?: string
    reminderMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendees?: EventAttendeeUncheckedCreateNestedManyWithoutEventInput
    exceptions?: EventExceptionUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutRemindersInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutRemindersInput, EventUncheckedCreateWithoutRemindersInput>
  }

  export type EventUpsertWithoutRemindersInput = {
    update: XOR<EventUpdateWithoutRemindersInput, EventUncheckedUpdateWithoutRemindersInput>
    create: XOR<EventCreateWithoutRemindersInput, EventUncheckedCreateWithoutRemindersInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutRemindersInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutRemindersInput, EventUncheckedUpdateWithoutRemindersInput>
  }

  export type EventUpdateWithoutRemindersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUpdateManyWithoutEventNestedInput
    exceptions?: EventExceptionUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutRemindersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allDay?: BoolFieldUpdateOperationsInput | boolean
    location?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    recurrenceDayOffsets?: EventUpdaterecurrenceDayOffsetsInput | number[]
    recurrenceUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActivity?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    reminderMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendees?: EventAttendeeUncheckedUpdateManyWithoutEventNestedInput
    exceptions?: EventExceptionUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventAttendeeCreateManyEventInput = {
    profileId: string
  }

  export type EventExceptionCreateManyEventInput = {
    occurrenceDate: Date | string
    kind?: string
    createdAt?: Date | string
  }

  export type ReminderLogCreateManyEventInput = {
    occurrenceDate: Date | string
    firedAt?: Date | string
  }

  export type EventAttendeeUpdateWithoutEventInput = {
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventAttendeeUncheckedUpdateWithoutEventInput = {
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventAttendeeUncheckedUpdateManyWithoutEventInput = {
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type EventExceptionUpdateWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventExceptionUncheckedUpdateWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventExceptionUncheckedUpdateManyWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    kind?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogUpdateWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogUncheckedUpdateWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderLogUncheckedUpdateManyWithoutEventInput = {
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
