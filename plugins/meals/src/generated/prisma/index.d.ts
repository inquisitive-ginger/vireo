
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
 * Model PlannedMeal
 * 
 */
export type PlannedMeal = $Result.DefaultSelection<Prisma.$PlannedMealPayload>
/**
 * Model DinnerNudgeLog
 * 
 */
export type DinnerNudgeLog = $Result.DefaultSelection<Prisma.$DinnerNudgeLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more PlannedMeals
 * const plannedMeals = await prisma.plannedMeal.findMany()
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
   * // Fetch zero or more PlannedMeals
   * const plannedMeals = await prisma.plannedMeal.findMany()
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
   * `prisma.plannedMeal`: Exposes CRUD operations for the **PlannedMeal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlannedMeals
    * const plannedMeals = await prisma.plannedMeal.findMany()
    * ```
    */
  get plannedMeal(): Prisma.PlannedMealDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dinnerNudgeLog`: Exposes CRUD operations for the **DinnerNudgeLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DinnerNudgeLogs
    * const dinnerNudgeLogs = await prisma.dinnerNudgeLog.findMany()
    * ```
    */
  get dinnerNudgeLog(): Prisma.DinnerNudgeLogDelegate<ExtArgs, ClientOptions>;
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
    PlannedMeal: 'PlannedMeal',
    DinnerNudgeLog: 'DinnerNudgeLog'
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
      modelProps: "plannedMeal" | "dinnerNudgeLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PlannedMeal: {
        payload: Prisma.$PlannedMealPayload<ExtArgs>
        fields: Prisma.PlannedMealFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlannedMealFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlannedMealFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          findFirst: {
            args: Prisma.PlannedMealFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlannedMealFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          findMany: {
            args: Prisma.PlannedMealFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>[]
          }
          create: {
            args: Prisma.PlannedMealCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          createMany: {
            args: Prisma.PlannedMealCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlannedMealCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>[]
          }
          delete: {
            args: Prisma.PlannedMealDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          update: {
            args: Prisma.PlannedMealUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          deleteMany: {
            args: Prisma.PlannedMealDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlannedMealUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlannedMealUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>[]
          }
          upsert: {
            args: Prisma.PlannedMealUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedMealPayload>
          }
          aggregate: {
            args: Prisma.PlannedMealAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlannedMeal>
          }
          groupBy: {
            args: Prisma.PlannedMealGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlannedMealGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlannedMealCountArgs<ExtArgs>
            result: $Utils.Optional<PlannedMealCountAggregateOutputType> | number
          }
        }
      }
      DinnerNudgeLog: {
        payload: Prisma.$DinnerNudgeLogPayload<ExtArgs>
        fields: Prisma.DinnerNudgeLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DinnerNudgeLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DinnerNudgeLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          findFirst: {
            args: Prisma.DinnerNudgeLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DinnerNudgeLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          findMany: {
            args: Prisma.DinnerNudgeLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>[]
          }
          create: {
            args: Prisma.DinnerNudgeLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          createMany: {
            args: Prisma.DinnerNudgeLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DinnerNudgeLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>[]
          }
          delete: {
            args: Prisma.DinnerNudgeLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          update: {
            args: Prisma.DinnerNudgeLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          deleteMany: {
            args: Prisma.DinnerNudgeLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DinnerNudgeLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DinnerNudgeLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>[]
          }
          upsert: {
            args: Prisma.DinnerNudgeLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DinnerNudgeLogPayload>
          }
          aggregate: {
            args: Prisma.DinnerNudgeLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDinnerNudgeLog>
          }
          groupBy: {
            args: Prisma.DinnerNudgeLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<DinnerNudgeLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.DinnerNudgeLogCountArgs<ExtArgs>
            result: $Utils.Optional<DinnerNudgeLogCountAggregateOutputType> | number
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
    plannedMeal?: PlannedMealOmit
    dinnerNudgeLog?: DinnerNudgeLogOmit
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
   * Count Type PlannedMealCountOutputType
   */

  export type PlannedMealCountOutputType = {
    nudges: number
  }

  export type PlannedMealCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nudges?: boolean | PlannedMealCountOutputTypeCountNudgesArgs
  }

  // Custom InputTypes
  /**
   * PlannedMealCountOutputType without action
   */
  export type PlannedMealCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMealCountOutputType
     */
    select?: PlannedMealCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlannedMealCountOutputType without action
   */
  export type PlannedMealCountOutputTypeCountNudgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DinnerNudgeLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PlannedMeal
   */

  export type AggregatePlannedMeal = {
    _count: PlannedMealCountAggregateOutputType | null
    _min: PlannedMealMinAggregateOutputType | null
    _max: PlannedMealMaxAggregateOutputType | null
  }

  export type PlannedMealMinAggregateOutputType = {
    id: string | null
    date: Date | null
    slot: string | null
    title: string | null
    sides: string | null
    kind: string | null
    ownerId: string | null
    notes: string | null
    tryBite: string | null
    needs: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlannedMealMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    slot: string | null
    title: string | null
    sides: string | null
    kind: string | null
    ownerId: string | null
    notes: string | null
    tryBite: string | null
    needs: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlannedMealCountAggregateOutputType = {
    id: number
    date: number
    slot: number
    title: number
    sides: number
    kind: number
    ownerId: number
    notes: number
    tryBite: number
    needs: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlannedMealMinAggregateInputType = {
    id?: true
    date?: true
    slot?: true
    title?: true
    sides?: true
    kind?: true
    ownerId?: true
    notes?: true
    tryBite?: true
    needs?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlannedMealMaxAggregateInputType = {
    id?: true
    date?: true
    slot?: true
    title?: true
    sides?: true
    kind?: true
    ownerId?: true
    notes?: true
    tryBite?: true
    needs?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlannedMealCountAggregateInputType = {
    id?: true
    date?: true
    slot?: true
    title?: true
    sides?: true
    kind?: true
    ownerId?: true
    notes?: true
    tryBite?: true
    needs?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlannedMealAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedMeal to aggregate.
     */
    where?: PlannedMealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedMeals to fetch.
     */
    orderBy?: PlannedMealOrderByWithRelationInput | PlannedMealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlannedMealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedMeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedMeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlannedMeals
    **/
    _count?: true | PlannedMealCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlannedMealMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlannedMealMaxAggregateInputType
  }

  export type GetPlannedMealAggregateType<T extends PlannedMealAggregateArgs> = {
        [P in keyof T & keyof AggregatePlannedMeal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlannedMeal[P]>
      : GetScalarType<T[P], AggregatePlannedMeal[P]>
  }




  export type PlannedMealGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlannedMealWhereInput
    orderBy?: PlannedMealOrderByWithAggregationInput | PlannedMealOrderByWithAggregationInput[]
    by: PlannedMealScalarFieldEnum[] | PlannedMealScalarFieldEnum
    having?: PlannedMealScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlannedMealCountAggregateInputType | true
    _min?: PlannedMealMinAggregateInputType
    _max?: PlannedMealMaxAggregateInputType
  }

  export type PlannedMealGroupByOutputType = {
    id: string
    date: Date
    slot: string
    title: string
    sides: string | null
    kind: string
    ownerId: string | null
    notes: string | null
    tryBite: string | null
    needs: string | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    _count: PlannedMealCountAggregateOutputType | null
    _min: PlannedMealMinAggregateOutputType | null
    _max: PlannedMealMaxAggregateOutputType | null
  }

  type GetPlannedMealGroupByPayload<T extends PlannedMealGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlannedMealGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlannedMealGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlannedMealGroupByOutputType[P]>
            : GetScalarType<T[P], PlannedMealGroupByOutputType[P]>
        }
      >
    >


  export type PlannedMealSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    slot?: boolean
    title?: boolean
    sides?: boolean
    kind?: boolean
    ownerId?: boolean
    notes?: boolean
    tryBite?: boolean
    needs?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nudges?: boolean | PlannedMeal$nudgesArgs<ExtArgs>
    _count?: boolean | PlannedMealCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedMeal"]>

  export type PlannedMealSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    slot?: boolean
    title?: boolean
    sides?: boolean
    kind?: boolean
    ownerId?: boolean
    notes?: boolean
    tryBite?: boolean
    needs?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["plannedMeal"]>

  export type PlannedMealSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    slot?: boolean
    title?: boolean
    sides?: boolean
    kind?: boolean
    ownerId?: boolean
    notes?: boolean
    tryBite?: boolean
    needs?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["plannedMeal"]>

  export type PlannedMealSelectScalar = {
    id?: boolean
    date?: boolean
    slot?: boolean
    title?: boolean
    sides?: boolean
    kind?: boolean
    ownerId?: boolean
    notes?: boolean
    tryBite?: boolean
    needs?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlannedMealOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "slot" | "title" | "sides" | "kind" | "ownerId" | "notes" | "tryBite" | "needs" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["plannedMeal"]>
  export type PlannedMealInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nudges?: boolean | PlannedMeal$nudgesArgs<ExtArgs>
    _count?: boolean | PlannedMealCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlannedMealIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PlannedMealIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlannedMealPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlannedMeal"
    objects: {
      nudges: Prisma.$DinnerNudgeLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      slot: string
      title: string
      sides: string | null
      kind: string
      ownerId: string | null
      notes: string | null
      tryBite: string | null
      needs: string | null
      createdBy: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["plannedMeal"]>
    composites: {}
  }

  type PlannedMealGetPayload<S extends boolean | null | undefined | PlannedMealDefaultArgs> = $Result.GetResult<Prisma.$PlannedMealPayload, S>

  type PlannedMealCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlannedMealFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlannedMealCountAggregateInputType | true
    }

  export interface PlannedMealDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlannedMeal'], meta: { name: 'PlannedMeal' } }
    /**
     * Find zero or one PlannedMeal that matches the filter.
     * @param {PlannedMealFindUniqueArgs} args - Arguments to find a PlannedMeal
     * @example
     * // Get one PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlannedMealFindUniqueArgs>(args: SelectSubset<T, PlannedMealFindUniqueArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlannedMeal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlannedMealFindUniqueOrThrowArgs} args - Arguments to find a PlannedMeal
     * @example
     * // Get one PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlannedMealFindUniqueOrThrowArgs>(args: SelectSubset<T, PlannedMealFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedMeal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealFindFirstArgs} args - Arguments to find a PlannedMeal
     * @example
     * // Get one PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlannedMealFindFirstArgs>(args?: SelectSubset<T, PlannedMealFindFirstArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedMeal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealFindFirstOrThrowArgs} args - Arguments to find a PlannedMeal
     * @example
     * // Get one PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlannedMealFindFirstOrThrowArgs>(args?: SelectSubset<T, PlannedMealFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlannedMeals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlannedMeals
     * const plannedMeals = await prisma.plannedMeal.findMany()
     * 
     * // Get first 10 PlannedMeals
     * const plannedMeals = await prisma.plannedMeal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const plannedMealWithIdOnly = await prisma.plannedMeal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlannedMealFindManyArgs>(args?: SelectSubset<T, PlannedMealFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlannedMeal.
     * @param {PlannedMealCreateArgs} args - Arguments to create a PlannedMeal.
     * @example
     * // Create one PlannedMeal
     * const PlannedMeal = await prisma.plannedMeal.create({
     *   data: {
     *     // ... data to create a PlannedMeal
     *   }
     * })
     * 
     */
    create<T extends PlannedMealCreateArgs>(args: SelectSubset<T, PlannedMealCreateArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlannedMeals.
     * @param {PlannedMealCreateManyArgs} args - Arguments to create many PlannedMeals.
     * @example
     * // Create many PlannedMeals
     * const plannedMeal = await prisma.plannedMeal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlannedMealCreateManyArgs>(args?: SelectSubset<T, PlannedMealCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlannedMeals and returns the data saved in the database.
     * @param {PlannedMealCreateManyAndReturnArgs} args - Arguments to create many PlannedMeals.
     * @example
     * // Create many PlannedMeals
     * const plannedMeal = await prisma.plannedMeal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlannedMeals and only return the `id`
     * const plannedMealWithIdOnly = await prisma.plannedMeal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlannedMealCreateManyAndReturnArgs>(args?: SelectSubset<T, PlannedMealCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlannedMeal.
     * @param {PlannedMealDeleteArgs} args - Arguments to delete one PlannedMeal.
     * @example
     * // Delete one PlannedMeal
     * const PlannedMeal = await prisma.plannedMeal.delete({
     *   where: {
     *     // ... filter to delete one PlannedMeal
     *   }
     * })
     * 
     */
    delete<T extends PlannedMealDeleteArgs>(args: SelectSubset<T, PlannedMealDeleteArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlannedMeal.
     * @param {PlannedMealUpdateArgs} args - Arguments to update one PlannedMeal.
     * @example
     * // Update one PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlannedMealUpdateArgs>(args: SelectSubset<T, PlannedMealUpdateArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlannedMeals.
     * @param {PlannedMealDeleteManyArgs} args - Arguments to filter PlannedMeals to delete.
     * @example
     * // Delete a few PlannedMeals
     * const { count } = await prisma.plannedMeal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlannedMealDeleteManyArgs>(args?: SelectSubset<T, PlannedMealDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedMeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlannedMeals
     * const plannedMeal = await prisma.plannedMeal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlannedMealUpdateManyArgs>(args: SelectSubset<T, PlannedMealUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedMeals and returns the data updated in the database.
     * @param {PlannedMealUpdateManyAndReturnArgs} args - Arguments to update many PlannedMeals.
     * @example
     * // Update many PlannedMeals
     * const plannedMeal = await prisma.plannedMeal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlannedMeals and only return the `id`
     * const plannedMealWithIdOnly = await prisma.plannedMeal.updateManyAndReturn({
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
    updateManyAndReturn<T extends PlannedMealUpdateManyAndReturnArgs>(args: SelectSubset<T, PlannedMealUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlannedMeal.
     * @param {PlannedMealUpsertArgs} args - Arguments to update or create a PlannedMeal.
     * @example
     * // Update or create a PlannedMeal
     * const plannedMeal = await prisma.plannedMeal.upsert({
     *   create: {
     *     // ... data to create a PlannedMeal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlannedMeal we want to update
     *   }
     * })
     */
    upsert<T extends PlannedMealUpsertArgs>(args: SelectSubset<T, PlannedMealUpsertArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlannedMeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealCountArgs} args - Arguments to filter PlannedMeals to count.
     * @example
     * // Count the number of PlannedMeals
     * const count = await prisma.plannedMeal.count({
     *   where: {
     *     // ... the filter for the PlannedMeals we want to count
     *   }
     * })
    **/
    count<T extends PlannedMealCountArgs>(
      args?: Subset<T, PlannedMealCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlannedMealCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlannedMeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlannedMealAggregateArgs>(args: Subset<T, PlannedMealAggregateArgs>): Prisma.PrismaPromise<GetPlannedMealAggregateType<T>>

    /**
     * Group by PlannedMeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedMealGroupByArgs} args - Group by arguments.
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
      T extends PlannedMealGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlannedMealGroupByArgs['orderBy'] }
        : { orderBy?: PlannedMealGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PlannedMealGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlannedMealGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlannedMeal model
   */
  readonly fields: PlannedMealFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlannedMeal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlannedMealClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    nudges<T extends PlannedMeal$nudgesArgs<ExtArgs> = {}>(args?: Subset<T, PlannedMeal$nudgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the PlannedMeal model
   */
  interface PlannedMealFieldRefs {
    readonly id: FieldRef<"PlannedMeal", 'String'>
    readonly date: FieldRef<"PlannedMeal", 'DateTime'>
    readonly slot: FieldRef<"PlannedMeal", 'String'>
    readonly title: FieldRef<"PlannedMeal", 'String'>
    readonly sides: FieldRef<"PlannedMeal", 'String'>
    readonly kind: FieldRef<"PlannedMeal", 'String'>
    readonly ownerId: FieldRef<"PlannedMeal", 'String'>
    readonly notes: FieldRef<"PlannedMeal", 'String'>
    readonly tryBite: FieldRef<"PlannedMeal", 'String'>
    readonly needs: FieldRef<"PlannedMeal", 'String'>
    readonly createdBy: FieldRef<"PlannedMeal", 'String'>
    readonly createdAt: FieldRef<"PlannedMeal", 'DateTime'>
    readonly updatedAt: FieldRef<"PlannedMeal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlannedMeal findUnique
   */
  export type PlannedMealFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter, which PlannedMeal to fetch.
     */
    where: PlannedMealWhereUniqueInput
  }

  /**
   * PlannedMeal findUniqueOrThrow
   */
  export type PlannedMealFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter, which PlannedMeal to fetch.
     */
    where: PlannedMealWhereUniqueInput
  }

  /**
   * PlannedMeal findFirst
   */
  export type PlannedMealFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter, which PlannedMeal to fetch.
     */
    where?: PlannedMealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedMeals to fetch.
     */
    orderBy?: PlannedMealOrderByWithRelationInput | PlannedMealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedMeals.
     */
    cursor?: PlannedMealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedMeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedMeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedMeals.
     */
    distinct?: PlannedMealScalarFieldEnum | PlannedMealScalarFieldEnum[]
  }

  /**
   * PlannedMeal findFirstOrThrow
   */
  export type PlannedMealFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter, which PlannedMeal to fetch.
     */
    where?: PlannedMealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedMeals to fetch.
     */
    orderBy?: PlannedMealOrderByWithRelationInput | PlannedMealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedMeals.
     */
    cursor?: PlannedMealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedMeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedMeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedMeals.
     */
    distinct?: PlannedMealScalarFieldEnum | PlannedMealScalarFieldEnum[]
  }

  /**
   * PlannedMeal findMany
   */
  export type PlannedMealFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter, which PlannedMeals to fetch.
     */
    where?: PlannedMealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedMeals to fetch.
     */
    orderBy?: PlannedMealOrderByWithRelationInput | PlannedMealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlannedMeals.
     */
    cursor?: PlannedMealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedMeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedMeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedMeals.
     */
    distinct?: PlannedMealScalarFieldEnum | PlannedMealScalarFieldEnum[]
  }

  /**
   * PlannedMeal create
   */
  export type PlannedMealCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * The data needed to create a PlannedMeal.
     */
    data: XOR<PlannedMealCreateInput, PlannedMealUncheckedCreateInput>
  }

  /**
   * PlannedMeal createMany
   */
  export type PlannedMealCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlannedMeals.
     */
    data: PlannedMealCreateManyInput | PlannedMealCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlannedMeal createManyAndReturn
   */
  export type PlannedMealCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * The data used to create many PlannedMeals.
     */
    data: PlannedMealCreateManyInput | PlannedMealCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlannedMeal update
   */
  export type PlannedMealUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * The data needed to update a PlannedMeal.
     */
    data: XOR<PlannedMealUpdateInput, PlannedMealUncheckedUpdateInput>
    /**
     * Choose, which PlannedMeal to update.
     */
    where: PlannedMealWhereUniqueInput
  }

  /**
   * PlannedMeal updateMany
   */
  export type PlannedMealUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlannedMeals.
     */
    data: XOR<PlannedMealUpdateManyMutationInput, PlannedMealUncheckedUpdateManyInput>
    /**
     * Filter which PlannedMeals to update
     */
    where?: PlannedMealWhereInput
    /**
     * Limit how many PlannedMeals to update.
     */
    limit?: number
  }

  /**
   * PlannedMeal updateManyAndReturn
   */
  export type PlannedMealUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * The data used to update PlannedMeals.
     */
    data: XOR<PlannedMealUpdateManyMutationInput, PlannedMealUncheckedUpdateManyInput>
    /**
     * Filter which PlannedMeals to update
     */
    where?: PlannedMealWhereInput
    /**
     * Limit how many PlannedMeals to update.
     */
    limit?: number
  }

  /**
   * PlannedMeal upsert
   */
  export type PlannedMealUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * The filter to search for the PlannedMeal to update in case it exists.
     */
    where: PlannedMealWhereUniqueInput
    /**
     * In case the PlannedMeal found by the `where` argument doesn't exist, create a new PlannedMeal with this data.
     */
    create: XOR<PlannedMealCreateInput, PlannedMealUncheckedCreateInput>
    /**
     * In case the PlannedMeal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlannedMealUpdateInput, PlannedMealUncheckedUpdateInput>
  }

  /**
   * PlannedMeal delete
   */
  export type PlannedMealDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
    /**
     * Filter which PlannedMeal to delete.
     */
    where: PlannedMealWhereUniqueInput
  }

  /**
   * PlannedMeal deleteMany
   */
  export type PlannedMealDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedMeals to delete
     */
    where?: PlannedMealWhereInput
    /**
     * Limit how many PlannedMeals to delete.
     */
    limit?: number
  }

  /**
   * PlannedMeal.nudges
   */
  export type PlannedMeal$nudgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    where?: DinnerNudgeLogWhereInput
    orderBy?: DinnerNudgeLogOrderByWithRelationInput | DinnerNudgeLogOrderByWithRelationInput[]
    cursor?: DinnerNudgeLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DinnerNudgeLogScalarFieldEnum | DinnerNudgeLogScalarFieldEnum[]
  }

  /**
   * PlannedMeal without action
   */
  export type PlannedMealDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedMeal
     */
    select?: PlannedMealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedMeal
     */
    omit?: PlannedMealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedMealInclude<ExtArgs> | null
  }


  /**
   * Model DinnerNudgeLog
   */

  export type AggregateDinnerNudgeLog = {
    _count: DinnerNudgeLogCountAggregateOutputType | null
    _min: DinnerNudgeLogMinAggregateOutputType | null
    _max: DinnerNudgeLogMaxAggregateOutputType | null
  }

  export type DinnerNudgeLogMinAggregateOutputType = {
    date: Date | null
    audience: string | null
    mealId: string | null
    firedAt: Date | null
  }

  export type DinnerNudgeLogMaxAggregateOutputType = {
    date: Date | null
    audience: string | null
    mealId: string | null
    firedAt: Date | null
  }

  export type DinnerNudgeLogCountAggregateOutputType = {
    date: number
    audience: number
    mealId: number
    firedAt: number
    _all: number
  }


  export type DinnerNudgeLogMinAggregateInputType = {
    date?: true
    audience?: true
    mealId?: true
    firedAt?: true
  }

  export type DinnerNudgeLogMaxAggregateInputType = {
    date?: true
    audience?: true
    mealId?: true
    firedAt?: true
  }

  export type DinnerNudgeLogCountAggregateInputType = {
    date?: true
    audience?: true
    mealId?: true
    firedAt?: true
    _all?: true
  }

  export type DinnerNudgeLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DinnerNudgeLog to aggregate.
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DinnerNudgeLogs to fetch.
     */
    orderBy?: DinnerNudgeLogOrderByWithRelationInput | DinnerNudgeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DinnerNudgeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DinnerNudgeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DinnerNudgeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DinnerNudgeLogs
    **/
    _count?: true | DinnerNudgeLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DinnerNudgeLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DinnerNudgeLogMaxAggregateInputType
  }

  export type GetDinnerNudgeLogAggregateType<T extends DinnerNudgeLogAggregateArgs> = {
        [P in keyof T & keyof AggregateDinnerNudgeLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDinnerNudgeLog[P]>
      : GetScalarType<T[P], AggregateDinnerNudgeLog[P]>
  }




  export type DinnerNudgeLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DinnerNudgeLogWhereInput
    orderBy?: DinnerNudgeLogOrderByWithAggregationInput | DinnerNudgeLogOrderByWithAggregationInput[]
    by: DinnerNudgeLogScalarFieldEnum[] | DinnerNudgeLogScalarFieldEnum
    having?: DinnerNudgeLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DinnerNudgeLogCountAggregateInputType | true
    _min?: DinnerNudgeLogMinAggregateInputType
    _max?: DinnerNudgeLogMaxAggregateInputType
  }

  export type DinnerNudgeLogGroupByOutputType = {
    date: Date
    audience: string
    mealId: string
    firedAt: Date
    _count: DinnerNudgeLogCountAggregateOutputType | null
    _min: DinnerNudgeLogMinAggregateOutputType | null
    _max: DinnerNudgeLogMaxAggregateOutputType | null
  }

  type GetDinnerNudgeLogGroupByPayload<T extends DinnerNudgeLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DinnerNudgeLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DinnerNudgeLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DinnerNudgeLogGroupByOutputType[P]>
            : GetScalarType<T[P], DinnerNudgeLogGroupByOutputType[P]>
        }
      >
    >


  export type DinnerNudgeLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectScalar = {
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
  }

  export type DinnerNudgeLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"date" | "audience" | "mealId" | "firedAt", ExtArgs["result"]["dinnerNudgeLog"]>
  export type DinnerNudgeLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }
  export type DinnerNudgeLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }
  export type DinnerNudgeLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meal?: boolean | PlannedMealDefaultArgs<ExtArgs>
  }

  export type $DinnerNudgeLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DinnerNudgeLog"
    objects: {
      meal: Prisma.$PlannedMealPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      date: Date
      audience: string
      mealId: string
      firedAt: Date
    }, ExtArgs["result"]["dinnerNudgeLog"]>
    composites: {}
  }

  type DinnerNudgeLogGetPayload<S extends boolean | null | undefined | DinnerNudgeLogDefaultArgs> = $Result.GetResult<Prisma.$DinnerNudgeLogPayload, S>

  type DinnerNudgeLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DinnerNudgeLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DinnerNudgeLogCountAggregateInputType | true
    }

  export interface DinnerNudgeLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DinnerNudgeLog'], meta: { name: 'DinnerNudgeLog' } }
    /**
     * Find zero or one DinnerNudgeLog that matches the filter.
     * @param {DinnerNudgeLogFindUniqueArgs} args - Arguments to find a DinnerNudgeLog
     * @example
     * // Get one DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DinnerNudgeLogFindUniqueArgs>(args: SelectSubset<T, DinnerNudgeLogFindUniqueArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DinnerNudgeLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DinnerNudgeLogFindUniqueOrThrowArgs} args - Arguments to find a DinnerNudgeLog
     * @example
     * // Get one DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DinnerNudgeLogFindUniqueOrThrowArgs>(args: SelectSubset<T, DinnerNudgeLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DinnerNudgeLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogFindFirstArgs} args - Arguments to find a DinnerNudgeLog
     * @example
     * // Get one DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DinnerNudgeLogFindFirstArgs>(args?: SelectSubset<T, DinnerNudgeLogFindFirstArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DinnerNudgeLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogFindFirstOrThrowArgs} args - Arguments to find a DinnerNudgeLog
     * @example
     * // Get one DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DinnerNudgeLogFindFirstOrThrowArgs>(args?: SelectSubset<T, DinnerNudgeLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DinnerNudgeLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DinnerNudgeLogs
     * const dinnerNudgeLogs = await prisma.dinnerNudgeLog.findMany()
     * 
     * // Get first 10 DinnerNudgeLogs
     * const dinnerNudgeLogs = await prisma.dinnerNudgeLog.findMany({ take: 10 })
     * 
     * // Only select the `date`
     * const dinnerNudgeLogWithDateOnly = await prisma.dinnerNudgeLog.findMany({ select: { date: true } })
     * 
     */
    findMany<T extends DinnerNudgeLogFindManyArgs>(args?: SelectSubset<T, DinnerNudgeLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DinnerNudgeLog.
     * @param {DinnerNudgeLogCreateArgs} args - Arguments to create a DinnerNudgeLog.
     * @example
     * // Create one DinnerNudgeLog
     * const DinnerNudgeLog = await prisma.dinnerNudgeLog.create({
     *   data: {
     *     // ... data to create a DinnerNudgeLog
     *   }
     * })
     * 
     */
    create<T extends DinnerNudgeLogCreateArgs>(args: SelectSubset<T, DinnerNudgeLogCreateArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DinnerNudgeLogs.
     * @param {DinnerNudgeLogCreateManyArgs} args - Arguments to create many DinnerNudgeLogs.
     * @example
     * // Create many DinnerNudgeLogs
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DinnerNudgeLogCreateManyArgs>(args?: SelectSubset<T, DinnerNudgeLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DinnerNudgeLogs and returns the data saved in the database.
     * @param {DinnerNudgeLogCreateManyAndReturnArgs} args - Arguments to create many DinnerNudgeLogs.
     * @example
     * // Create many DinnerNudgeLogs
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DinnerNudgeLogs and only return the `date`
     * const dinnerNudgeLogWithDateOnly = await prisma.dinnerNudgeLog.createManyAndReturn({
     *   select: { date: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DinnerNudgeLogCreateManyAndReturnArgs>(args?: SelectSubset<T, DinnerNudgeLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DinnerNudgeLog.
     * @param {DinnerNudgeLogDeleteArgs} args - Arguments to delete one DinnerNudgeLog.
     * @example
     * // Delete one DinnerNudgeLog
     * const DinnerNudgeLog = await prisma.dinnerNudgeLog.delete({
     *   where: {
     *     // ... filter to delete one DinnerNudgeLog
     *   }
     * })
     * 
     */
    delete<T extends DinnerNudgeLogDeleteArgs>(args: SelectSubset<T, DinnerNudgeLogDeleteArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DinnerNudgeLog.
     * @param {DinnerNudgeLogUpdateArgs} args - Arguments to update one DinnerNudgeLog.
     * @example
     * // Update one DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DinnerNudgeLogUpdateArgs>(args: SelectSubset<T, DinnerNudgeLogUpdateArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DinnerNudgeLogs.
     * @param {DinnerNudgeLogDeleteManyArgs} args - Arguments to filter DinnerNudgeLogs to delete.
     * @example
     * // Delete a few DinnerNudgeLogs
     * const { count } = await prisma.dinnerNudgeLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DinnerNudgeLogDeleteManyArgs>(args?: SelectSubset<T, DinnerNudgeLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DinnerNudgeLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DinnerNudgeLogs
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DinnerNudgeLogUpdateManyArgs>(args: SelectSubset<T, DinnerNudgeLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DinnerNudgeLogs and returns the data updated in the database.
     * @param {DinnerNudgeLogUpdateManyAndReturnArgs} args - Arguments to update many DinnerNudgeLogs.
     * @example
     * // Update many DinnerNudgeLogs
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DinnerNudgeLogs and only return the `date`
     * const dinnerNudgeLogWithDateOnly = await prisma.dinnerNudgeLog.updateManyAndReturn({
     *   select: { date: true },
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
    updateManyAndReturn<T extends DinnerNudgeLogUpdateManyAndReturnArgs>(args: SelectSubset<T, DinnerNudgeLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DinnerNudgeLog.
     * @param {DinnerNudgeLogUpsertArgs} args - Arguments to update or create a DinnerNudgeLog.
     * @example
     * // Update or create a DinnerNudgeLog
     * const dinnerNudgeLog = await prisma.dinnerNudgeLog.upsert({
     *   create: {
     *     // ... data to create a DinnerNudgeLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DinnerNudgeLog we want to update
     *   }
     * })
     */
    upsert<T extends DinnerNudgeLogUpsertArgs>(args: SelectSubset<T, DinnerNudgeLogUpsertArgs<ExtArgs>>): Prisma__DinnerNudgeLogClient<$Result.GetResult<Prisma.$DinnerNudgeLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DinnerNudgeLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogCountArgs} args - Arguments to filter DinnerNudgeLogs to count.
     * @example
     * // Count the number of DinnerNudgeLogs
     * const count = await prisma.dinnerNudgeLog.count({
     *   where: {
     *     // ... the filter for the DinnerNudgeLogs we want to count
     *   }
     * })
    **/
    count<T extends DinnerNudgeLogCountArgs>(
      args?: Subset<T, DinnerNudgeLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DinnerNudgeLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DinnerNudgeLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DinnerNudgeLogAggregateArgs>(args: Subset<T, DinnerNudgeLogAggregateArgs>): Prisma.PrismaPromise<GetDinnerNudgeLogAggregateType<T>>

    /**
     * Group by DinnerNudgeLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DinnerNudgeLogGroupByArgs} args - Group by arguments.
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
      T extends DinnerNudgeLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DinnerNudgeLogGroupByArgs['orderBy'] }
        : { orderBy?: DinnerNudgeLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DinnerNudgeLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDinnerNudgeLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DinnerNudgeLog model
   */
  readonly fields: DinnerNudgeLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DinnerNudgeLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DinnerNudgeLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meal<T extends PlannedMealDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlannedMealDefaultArgs<ExtArgs>>): Prisma__PlannedMealClient<$Result.GetResult<Prisma.$PlannedMealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DinnerNudgeLog model
   */
  interface DinnerNudgeLogFieldRefs {
    readonly date: FieldRef<"DinnerNudgeLog", 'DateTime'>
    readonly audience: FieldRef<"DinnerNudgeLog", 'String'>
    readonly mealId: FieldRef<"DinnerNudgeLog", 'String'>
    readonly firedAt: FieldRef<"DinnerNudgeLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DinnerNudgeLog findUnique
   */
  export type DinnerNudgeLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter, which DinnerNudgeLog to fetch.
     */
    where: DinnerNudgeLogWhereUniqueInput
  }

  /**
   * DinnerNudgeLog findUniqueOrThrow
   */
  export type DinnerNudgeLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter, which DinnerNudgeLog to fetch.
     */
    where: DinnerNudgeLogWhereUniqueInput
  }

  /**
   * DinnerNudgeLog findFirst
   */
  export type DinnerNudgeLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter, which DinnerNudgeLog to fetch.
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DinnerNudgeLogs to fetch.
     */
    orderBy?: DinnerNudgeLogOrderByWithRelationInput | DinnerNudgeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DinnerNudgeLogs.
     */
    cursor?: DinnerNudgeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DinnerNudgeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DinnerNudgeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DinnerNudgeLogs.
     */
    distinct?: DinnerNudgeLogScalarFieldEnum | DinnerNudgeLogScalarFieldEnum[]
  }

  /**
   * DinnerNudgeLog findFirstOrThrow
   */
  export type DinnerNudgeLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter, which DinnerNudgeLog to fetch.
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DinnerNudgeLogs to fetch.
     */
    orderBy?: DinnerNudgeLogOrderByWithRelationInput | DinnerNudgeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DinnerNudgeLogs.
     */
    cursor?: DinnerNudgeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DinnerNudgeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DinnerNudgeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DinnerNudgeLogs.
     */
    distinct?: DinnerNudgeLogScalarFieldEnum | DinnerNudgeLogScalarFieldEnum[]
  }

  /**
   * DinnerNudgeLog findMany
   */
  export type DinnerNudgeLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter, which DinnerNudgeLogs to fetch.
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DinnerNudgeLogs to fetch.
     */
    orderBy?: DinnerNudgeLogOrderByWithRelationInput | DinnerNudgeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DinnerNudgeLogs.
     */
    cursor?: DinnerNudgeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DinnerNudgeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DinnerNudgeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DinnerNudgeLogs.
     */
    distinct?: DinnerNudgeLogScalarFieldEnum | DinnerNudgeLogScalarFieldEnum[]
  }

  /**
   * DinnerNudgeLog create
   */
  export type DinnerNudgeLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * The data needed to create a DinnerNudgeLog.
     */
    data: XOR<DinnerNudgeLogCreateInput, DinnerNudgeLogUncheckedCreateInput>
  }

  /**
   * DinnerNudgeLog createMany
   */
  export type DinnerNudgeLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DinnerNudgeLogs.
     */
    data: DinnerNudgeLogCreateManyInput | DinnerNudgeLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DinnerNudgeLog createManyAndReturn
   */
  export type DinnerNudgeLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * The data used to create many DinnerNudgeLogs.
     */
    data: DinnerNudgeLogCreateManyInput | DinnerNudgeLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DinnerNudgeLog update
   */
  export type DinnerNudgeLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * The data needed to update a DinnerNudgeLog.
     */
    data: XOR<DinnerNudgeLogUpdateInput, DinnerNudgeLogUncheckedUpdateInput>
    /**
     * Choose, which DinnerNudgeLog to update.
     */
    where: DinnerNudgeLogWhereUniqueInput
  }

  /**
   * DinnerNudgeLog updateMany
   */
  export type DinnerNudgeLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DinnerNudgeLogs.
     */
    data: XOR<DinnerNudgeLogUpdateManyMutationInput, DinnerNudgeLogUncheckedUpdateManyInput>
    /**
     * Filter which DinnerNudgeLogs to update
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * Limit how many DinnerNudgeLogs to update.
     */
    limit?: number
  }

  /**
   * DinnerNudgeLog updateManyAndReturn
   */
  export type DinnerNudgeLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * The data used to update DinnerNudgeLogs.
     */
    data: XOR<DinnerNudgeLogUpdateManyMutationInput, DinnerNudgeLogUncheckedUpdateManyInput>
    /**
     * Filter which DinnerNudgeLogs to update
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * Limit how many DinnerNudgeLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DinnerNudgeLog upsert
   */
  export type DinnerNudgeLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * The filter to search for the DinnerNudgeLog to update in case it exists.
     */
    where: DinnerNudgeLogWhereUniqueInput
    /**
     * In case the DinnerNudgeLog found by the `where` argument doesn't exist, create a new DinnerNudgeLog with this data.
     */
    create: XOR<DinnerNudgeLogCreateInput, DinnerNudgeLogUncheckedCreateInput>
    /**
     * In case the DinnerNudgeLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DinnerNudgeLogUpdateInput, DinnerNudgeLogUncheckedUpdateInput>
  }

  /**
   * DinnerNudgeLog delete
   */
  export type DinnerNudgeLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
    /**
     * Filter which DinnerNudgeLog to delete.
     */
    where: DinnerNudgeLogWhereUniqueInput
  }

  /**
   * DinnerNudgeLog deleteMany
   */
  export type DinnerNudgeLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DinnerNudgeLogs to delete
     */
    where?: DinnerNudgeLogWhereInput
    /**
     * Limit how many DinnerNudgeLogs to delete.
     */
    limit?: number
  }

  /**
   * DinnerNudgeLog without action
   */
  export type DinnerNudgeLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DinnerNudgeLog
     */
    select?: DinnerNudgeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DinnerNudgeLog
     */
    omit?: DinnerNudgeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DinnerNudgeLogInclude<ExtArgs> | null
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


  export const PlannedMealScalarFieldEnum: {
    id: 'id',
    date: 'date',
    slot: 'slot',
    title: 'title',
    sides: 'sides',
    kind: 'kind',
    ownerId: 'ownerId',
    notes: 'notes',
    tryBite: 'tryBite',
    needs: 'needs',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlannedMealScalarFieldEnum = (typeof PlannedMealScalarFieldEnum)[keyof typeof PlannedMealScalarFieldEnum]


  export const DinnerNudgeLogScalarFieldEnum: {
    date: 'date',
    audience: 'audience',
    mealId: 'mealId',
    firedAt: 'firedAt'
  };

  export type DinnerNudgeLogScalarFieldEnum = (typeof DinnerNudgeLogScalarFieldEnum)[keyof typeof DinnerNudgeLogScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type PlannedMealWhereInput = {
    AND?: PlannedMealWhereInput | PlannedMealWhereInput[]
    OR?: PlannedMealWhereInput[]
    NOT?: PlannedMealWhereInput | PlannedMealWhereInput[]
    id?: UuidFilter<"PlannedMeal"> | string
    date?: DateTimeFilter<"PlannedMeal"> | Date | string
    slot?: StringFilter<"PlannedMeal"> | string
    title?: StringFilter<"PlannedMeal"> | string
    sides?: StringNullableFilter<"PlannedMeal"> | string | null
    kind?: StringFilter<"PlannedMeal"> | string
    ownerId?: UuidNullableFilter<"PlannedMeal"> | string | null
    notes?: StringNullableFilter<"PlannedMeal"> | string | null
    tryBite?: StringNullableFilter<"PlannedMeal"> | string | null
    needs?: StringNullableFilter<"PlannedMeal"> | string | null
    createdBy?: UuidFilter<"PlannedMeal"> | string
    createdAt?: DateTimeFilter<"PlannedMeal"> | Date | string
    updatedAt?: DateTimeFilter<"PlannedMeal"> | Date | string
    nudges?: DinnerNudgeLogListRelationFilter
  }

  export type PlannedMealOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    slot?: SortOrder
    title?: SortOrder
    sides?: SortOrderInput | SortOrder
    kind?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    tryBite?: SortOrderInput | SortOrder
    needs?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nudges?: DinnerNudgeLogOrderByRelationAggregateInput
  }

  export type PlannedMealWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date_slot?: PlannedMealDateSlotCompoundUniqueInput
    AND?: PlannedMealWhereInput | PlannedMealWhereInput[]
    OR?: PlannedMealWhereInput[]
    NOT?: PlannedMealWhereInput | PlannedMealWhereInput[]
    date?: DateTimeFilter<"PlannedMeal"> | Date | string
    slot?: StringFilter<"PlannedMeal"> | string
    title?: StringFilter<"PlannedMeal"> | string
    sides?: StringNullableFilter<"PlannedMeal"> | string | null
    kind?: StringFilter<"PlannedMeal"> | string
    ownerId?: UuidNullableFilter<"PlannedMeal"> | string | null
    notes?: StringNullableFilter<"PlannedMeal"> | string | null
    tryBite?: StringNullableFilter<"PlannedMeal"> | string | null
    needs?: StringNullableFilter<"PlannedMeal"> | string | null
    createdBy?: UuidFilter<"PlannedMeal"> | string
    createdAt?: DateTimeFilter<"PlannedMeal"> | Date | string
    updatedAt?: DateTimeFilter<"PlannedMeal"> | Date | string
    nudges?: DinnerNudgeLogListRelationFilter
  }, "id" | "date_slot">

  export type PlannedMealOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    slot?: SortOrder
    title?: SortOrder
    sides?: SortOrderInput | SortOrder
    kind?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    tryBite?: SortOrderInput | SortOrder
    needs?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlannedMealCountOrderByAggregateInput
    _max?: PlannedMealMaxOrderByAggregateInput
    _min?: PlannedMealMinOrderByAggregateInput
  }

  export type PlannedMealScalarWhereWithAggregatesInput = {
    AND?: PlannedMealScalarWhereWithAggregatesInput | PlannedMealScalarWhereWithAggregatesInput[]
    OR?: PlannedMealScalarWhereWithAggregatesInput[]
    NOT?: PlannedMealScalarWhereWithAggregatesInput | PlannedMealScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PlannedMeal"> | string
    date?: DateTimeWithAggregatesFilter<"PlannedMeal"> | Date | string
    slot?: StringWithAggregatesFilter<"PlannedMeal"> | string
    title?: StringWithAggregatesFilter<"PlannedMeal"> | string
    sides?: StringNullableWithAggregatesFilter<"PlannedMeal"> | string | null
    kind?: StringWithAggregatesFilter<"PlannedMeal"> | string
    ownerId?: UuidNullableWithAggregatesFilter<"PlannedMeal"> | string | null
    notes?: StringNullableWithAggregatesFilter<"PlannedMeal"> | string | null
    tryBite?: StringNullableWithAggregatesFilter<"PlannedMeal"> | string | null
    needs?: StringNullableWithAggregatesFilter<"PlannedMeal"> | string | null
    createdBy?: UuidWithAggregatesFilter<"PlannedMeal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PlannedMeal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PlannedMeal"> | Date | string
  }

  export type DinnerNudgeLogWhereInput = {
    AND?: DinnerNudgeLogWhereInput | DinnerNudgeLogWhereInput[]
    OR?: DinnerNudgeLogWhereInput[]
    NOT?: DinnerNudgeLogWhereInput | DinnerNudgeLogWhereInput[]
    date?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
    audience?: StringFilter<"DinnerNudgeLog"> | string
    mealId?: UuidFilter<"DinnerNudgeLog"> | string
    firedAt?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
    meal?: XOR<PlannedMealScalarRelationFilter, PlannedMealWhereInput>
  }

  export type DinnerNudgeLogOrderByWithRelationInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
    meal?: PlannedMealOrderByWithRelationInput
  }

  export type DinnerNudgeLogWhereUniqueInput = Prisma.AtLeast<{
    date_audience?: DinnerNudgeLogDateAudienceCompoundUniqueInput
    AND?: DinnerNudgeLogWhereInput | DinnerNudgeLogWhereInput[]
    OR?: DinnerNudgeLogWhereInput[]
    NOT?: DinnerNudgeLogWhereInput | DinnerNudgeLogWhereInput[]
    date?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
    audience?: StringFilter<"DinnerNudgeLog"> | string
    mealId?: UuidFilter<"DinnerNudgeLog"> | string
    firedAt?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
    meal?: XOR<PlannedMealScalarRelationFilter, PlannedMealWhereInput>
  }, "date_audience">

  export type DinnerNudgeLogOrderByWithAggregationInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
    _count?: DinnerNudgeLogCountOrderByAggregateInput
    _max?: DinnerNudgeLogMaxOrderByAggregateInput
    _min?: DinnerNudgeLogMinOrderByAggregateInput
  }

  export type DinnerNudgeLogScalarWhereWithAggregatesInput = {
    AND?: DinnerNudgeLogScalarWhereWithAggregatesInput | DinnerNudgeLogScalarWhereWithAggregatesInput[]
    OR?: DinnerNudgeLogScalarWhereWithAggregatesInput[]
    NOT?: DinnerNudgeLogScalarWhereWithAggregatesInput | DinnerNudgeLogScalarWhereWithAggregatesInput[]
    date?: DateTimeWithAggregatesFilter<"DinnerNudgeLog"> | Date | string
    audience?: StringWithAggregatesFilter<"DinnerNudgeLog"> | string
    mealId?: UuidWithAggregatesFilter<"DinnerNudgeLog"> | string
    firedAt?: DateTimeWithAggregatesFilter<"DinnerNudgeLog"> | Date | string
  }

  export type PlannedMealCreateInput = {
    id?: string
    date: Date | string
    slot?: string
    title: string
    sides?: string | null
    kind?: string
    ownerId?: string | null
    notes?: string | null
    tryBite?: string | null
    needs?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nudges?: DinnerNudgeLogCreateNestedManyWithoutMealInput
  }

  export type PlannedMealUncheckedCreateInput = {
    id?: string
    date: Date | string
    slot?: string
    title: string
    sides?: string | null
    kind?: string
    ownerId?: string | null
    notes?: string | null
    tryBite?: string | null
    needs?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nudges?: DinnerNudgeLogUncheckedCreateNestedManyWithoutMealInput
  }

  export type PlannedMealUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nudges?: DinnerNudgeLogUpdateManyWithoutMealNestedInput
  }

  export type PlannedMealUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nudges?: DinnerNudgeLogUncheckedUpdateManyWithoutMealNestedInput
  }

  export type PlannedMealCreateManyInput = {
    id?: string
    date: Date | string
    slot?: string
    title: string
    sides?: string | null
    kind?: string
    ownerId?: string | null
    notes?: string | null
    tryBite?: string | null
    needs?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlannedMealUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlannedMealUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogCreateInput = {
    date: Date | string
    audience: string
    firedAt?: Date | string
    meal: PlannedMealCreateNestedOneWithoutNudgesInput
  }

  export type DinnerNudgeLogUncheckedCreateInput = {
    date: Date | string
    audience: string
    mealId: string
    firedAt?: Date | string
  }

  export type DinnerNudgeLogUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meal?: PlannedMealUpdateOneRequiredWithoutNudgesNestedInput
  }

  export type DinnerNudgeLogUncheckedUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    mealId?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogCreateManyInput = {
    date: Date | string
    audience: string
    mealId: string
    firedAt?: Date | string
  }

  export type DinnerNudgeLogUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogUncheckedUpdateManyInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    mealId?: StringFieldUpdateOperationsInput | string
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

  export type DinnerNudgeLogListRelationFilter = {
    every?: DinnerNudgeLogWhereInput
    some?: DinnerNudgeLogWhereInput
    none?: DinnerNudgeLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DinnerNudgeLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlannedMealDateSlotCompoundUniqueInput = {
    date: Date | string
    slot: string
  }

  export type PlannedMealCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    slot?: SortOrder
    title?: SortOrder
    sides?: SortOrder
    kind?: SortOrder
    ownerId?: SortOrder
    notes?: SortOrder
    tryBite?: SortOrder
    needs?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlannedMealMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    slot?: SortOrder
    title?: SortOrder
    sides?: SortOrder
    kind?: SortOrder
    ownerId?: SortOrder
    notes?: SortOrder
    tryBite?: SortOrder
    needs?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlannedMealMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    slot?: SortOrder
    title?: SortOrder
    sides?: SortOrder
    kind?: SortOrder
    ownerId?: SortOrder
    notes?: SortOrder
    tryBite?: SortOrder
    needs?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type PlannedMealScalarRelationFilter = {
    is?: PlannedMealWhereInput
    isNot?: PlannedMealWhereInput
  }

  export type DinnerNudgeLogDateAudienceCompoundUniqueInput = {
    date: Date | string
    audience: string
  }

  export type DinnerNudgeLogCountOrderByAggregateInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
  }

  export type DinnerNudgeLogMaxOrderByAggregateInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
  }

  export type DinnerNudgeLogMinOrderByAggregateInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
  }

  export type DinnerNudgeLogCreateNestedManyWithoutMealInput = {
    create?: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput> | DinnerNudgeLogCreateWithoutMealInput[] | DinnerNudgeLogUncheckedCreateWithoutMealInput[]
    connectOrCreate?: DinnerNudgeLogCreateOrConnectWithoutMealInput | DinnerNudgeLogCreateOrConnectWithoutMealInput[]
    createMany?: DinnerNudgeLogCreateManyMealInputEnvelope
    connect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
  }

  export type DinnerNudgeLogUncheckedCreateNestedManyWithoutMealInput = {
    create?: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput> | DinnerNudgeLogCreateWithoutMealInput[] | DinnerNudgeLogUncheckedCreateWithoutMealInput[]
    connectOrCreate?: DinnerNudgeLogCreateOrConnectWithoutMealInput | DinnerNudgeLogCreateOrConnectWithoutMealInput[]
    createMany?: DinnerNudgeLogCreateManyMealInputEnvelope
    connect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DinnerNudgeLogUpdateManyWithoutMealNestedInput = {
    create?: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput> | DinnerNudgeLogCreateWithoutMealInput[] | DinnerNudgeLogUncheckedCreateWithoutMealInput[]
    connectOrCreate?: DinnerNudgeLogCreateOrConnectWithoutMealInput | DinnerNudgeLogCreateOrConnectWithoutMealInput[]
    upsert?: DinnerNudgeLogUpsertWithWhereUniqueWithoutMealInput | DinnerNudgeLogUpsertWithWhereUniqueWithoutMealInput[]
    createMany?: DinnerNudgeLogCreateManyMealInputEnvelope
    set?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    disconnect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    delete?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    connect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    update?: DinnerNudgeLogUpdateWithWhereUniqueWithoutMealInput | DinnerNudgeLogUpdateWithWhereUniqueWithoutMealInput[]
    updateMany?: DinnerNudgeLogUpdateManyWithWhereWithoutMealInput | DinnerNudgeLogUpdateManyWithWhereWithoutMealInput[]
    deleteMany?: DinnerNudgeLogScalarWhereInput | DinnerNudgeLogScalarWhereInput[]
  }

  export type DinnerNudgeLogUncheckedUpdateManyWithoutMealNestedInput = {
    create?: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput> | DinnerNudgeLogCreateWithoutMealInput[] | DinnerNudgeLogUncheckedCreateWithoutMealInput[]
    connectOrCreate?: DinnerNudgeLogCreateOrConnectWithoutMealInput | DinnerNudgeLogCreateOrConnectWithoutMealInput[]
    upsert?: DinnerNudgeLogUpsertWithWhereUniqueWithoutMealInput | DinnerNudgeLogUpsertWithWhereUniqueWithoutMealInput[]
    createMany?: DinnerNudgeLogCreateManyMealInputEnvelope
    set?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    disconnect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    delete?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    connect?: DinnerNudgeLogWhereUniqueInput | DinnerNudgeLogWhereUniqueInput[]
    update?: DinnerNudgeLogUpdateWithWhereUniqueWithoutMealInput | DinnerNudgeLogUpdateWithWhereUniqueWithoutMealInput[]
    updateMany?: DinnerNudgeLogUpdateManyWithWhereWithoutMealInput | DinnerNudgeLogUpdateManyWithWhereWithoutMealInput[]
    deleteMany?: DinnerNudgeLogScalarWhereInput | DinnerNudgeLogScalarWhereInput[]
  }

  export type PlannedMealCreateNestedOneWithoutNudgesInput = {
    create?: XOR<PlannedMealCreateWithoutNudgesInput, PlannedMealUncheckedCreateWithoutNudgesInput>
    connectOrCreate?: PlannedMealCreateOrConnectWithoutNudgesInput
    connect?: PlannedMealWhereUniqueInput
  }

  export type PlannedMealUpdateOneRequiredWithoutNudgesNestedInput = {
    create?: XOR<PlannedMealCreateWithoutNudgesInput, PlannedMealUncheckedCreateWithoutNudgesInput>
    connectOrCreate?: PlannedMealCreateOrConnectWithoutNudgesInput
    upsert?: PlannedMealUpsertWithoutNudgesInput
    connect?: PlannedMealWhereUniqueInput
    update?: XOR<XOR<PlannedMealUpdateToOneWithWhereWithoutNudgesInput, PlannedMealUpdateWithoutNudgesInput>, PlannedMealUncheckedUpdateWithoutNudgesInput>
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

  export type DinnerNudgeLogCreateWithoutMealInput = {
    date: Date | string
    audience: string
    firedAt?: Date | string
  }

  export type DinnerNudgeLogUncheckedCreateWithoutMealInput = {
    date: Date | string
    audience: string
    firedAt?: Date | string
  }

  export type DinnerNudgeLogCreateOrConnectWithoutMealInput = {
    where: DinnerNudgeLogWhereUniqueInput
    create: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput>
  }

  export type DinnerNudgeLogCreateManyMealInputEnvelope = {
    data: DinnerNudgeLogCreateManyMealInput | DinnerNudgeLogCreateManyMealInput[]
    skipDuplicates?: boolean
  }

  export type DinnerNudgeLogUpsertWithWhereUniqueWithoutMealInput = {
    where: DinnerNudgeLogWhereUniqueInput
    update: XOR<DinnerNudgeLogUpdateWithoutMealInput, DinnerNudgeLogUncheckedUpdateWithoutMealInput>
    create: XOR<DinnerNudgeLogCreateWithoutMealInput, DinnerNudgeLogUncheckedCreateWithoutMealInput>
  }

  export type DinnerNudgeLogUpdateWithWhereUniqueWithoutMealInput = {
    where: DinnerNudgeLogWhereUniqueInput
    data: XOR<DinnerNudgeLogUpdateWithoutMealInput, DinnerNudgeLogUncheckedUpdateWithoutMealInput>
  }

  export type DinnerNudgeLogUpdateManyWithWhereWithoutMealInput = {
    where: DinnerNudgeLogScalarWhereInput
    data: XOR<DinnerNudgeLogUpdateManyMutationInput, DinnerNudgeLogUncheckedUpdateManyWithoutMealInput>
  }

  export type DinnerNudgeLogScalarWhereInput = {
    AND?: DinnerNudgeLogScalarWhereInput | DinnerNudgeLogScalarWhereInput[]
    OR?: DinnerNudgeLogScalarWhereInput[]
    NOT?: DinnerNudgeLogScalarWhereInput | DinnerNudgeLogScalarWhereInput[]
    date?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
    audience?: StringFilter<"DinnerNudgeLog"> | string
    mealId?: UuidFilter<"DinnerNudgeLog"> | string
    firedAt?: DateTimeFilter<"DinnerNudgeLog"> | Date | string
  }

  export type PlannedMealCreateWithoutNudgesInput = {
    id?: string
    date: Date | string
    slot?: string
    title: string
    sides?: string | null
    kind?: string
    ownerId?: string | null
    notes?: string | null
    tryBite?: string | null
    needs?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlannedMealUncheckedCreateWithoutNudgesInput = {
    id?: string
    date: Date | string
    slot?: string
    title: string
    sides?: string | null
    kind?: string
    ownerId?: string | null
    notes?: string | null
    tryBite?: string | null
    needs?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlannedMealCreateOrConnectWithoutNudgesInput = {
    where: PlannedMealWhereUniqueInput
    create: XOR<PlannedMealCreateWithoutNudgesInput, PlannedMealUncheckedCreateWithoutNudgesInput>
  }

  export type PlannedMealUpsertWithoutNudgesInput = {
    update: XOR<PlannedMealUpdateWithoutNudgesInput, PlannedMealUncheckedUpdateWithoutNudgesInput>
    create: XOR<PlannedMealCreateWithoutNudgesInput, PlannedMealUncheckedCreateWithoutNudgesInput>
    where?: PlannedMealWhereInput
  }

  export type PlannedMealUpdateToOneWithWhereWithoutNudgesInput = {
    where?: PlannedMealWhereInput
    data: XOR<PlannedMealUpdateWithoutNudgesInput, PlannedMealUncheckedUpdateWithoutNudgesInput>
  }

  export type PlannedMealUpdateWithoutNudgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlannedMealUncheckedUpdateWithoutNudgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sides?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tryBite?: NullableStringFieldUpdateOperationsInput | string | null
    needs?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogCreateManyMealInput = {
    date: Date | string
    audience: string
    firedAt?: Date | string
  }

  export type DinnerNudgeLogUpdateWithoutMealInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogUncheckedUpdateWithoutMealInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogUncheckedUpdateManyWithoutMealInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
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