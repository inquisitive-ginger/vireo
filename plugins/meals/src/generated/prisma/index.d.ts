
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
 * Model GroceryItem
 * 
 */
export type GroceryItem = $Result.DefaultSelection<Prisma.$GroceryItemPayload>
/**
 * Model GroceryList
 * 
 */
export type GroceryList = $Result.DefaultSelection<Prisma.$GroceryListPayload>
/**
 * Model GroceryEntry
 * 
 */
export type GroceryEntry = $Result.DefaultSelection<Prisma.$GroceryEntryPayload>
/**
 * Model GroceryAisleOverride
 * 
 */
export type GroceryAisleOverride = $Result.DefaultSelection<Prisma.$GroceryAisleOverridePayload>

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

  /**
   * `prisma.groceryItem`: Exposes CRUD operations for the **GroceryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroceryItems
    * const groceryItems = await prisma.groceryItem.findMany()
    * ```
    */
  get groceryItem(): Prisma.GroceryItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groceryList`: Exposes CRUD operations for the **GroceryList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroceryLists
    * const groceryLists = await prisma.groceryList.findMany()
    * ```
    */
  get groceryList(): Prisma.GroceryListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groceryEntry`: Exposes CRUD operations for the **GroceryEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroceryEntries
    * const groceryEntries = await prisma.groceryEntry.findMany()
    * ```
    */
  get groceryEntry(): Prisma.GroceryEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groceryAisleOverride`: Exposes CRUD operations for the **GroceryAisleOverride** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroceryAisleOverrides
    * const groceryAisleOverrides = await prisma.groceryAisleOverride.findMany()
    * ```
    */
  get groceryAisleOverride(): Prisma.GroceryAisleOverrideDelegate<ExtArgs, ClientOptions>;
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
    DinnerNudgeLog: 'DinnerNudgeLog',
    GroceryItem: 'GroceryItem',
    GroceryList: 'GroceryList',
    GroceryEntry: 'GroceryEntry',
    GroceryAisleOverride: 'GroceryAisleOverride'
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
      modelProps: "plannedMeal" | "dinnerNudgeLog" | "groceryItem" | "groceryList" | "groceryEntry" | "groceryAisleOverride"
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
      GroceryItem: {
        payload: Prisma.$GroceryItemPayload<ExtArgs>
        fields: Prisma.GroceryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroceryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroceryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          findFirst: {
            args: Prisma.GroceryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroceryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          findMany: {
            args: Prisma.GroceryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>[]
          }
          create: {
            args: Prisma.GroceryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          createMany: {
            args: Prisma.GroceryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroceryItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>[]
          }
          delete: {
            args: Prisma.GroceryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          update: {
            args: Prisma.GroceryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          deleteMany: {
            args: Prisma.GroceryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroceryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroceryItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>[]
          }
          upsert: {
            args: Prisma.GroceryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryItemPayload>
          }
          aggregate: {
            args: Prisma.GroceryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroceryItem>
          }
          groupBy: {
            args: Prisma.GroceryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroceryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroceryItemCountArgs<ExtArgs>
            result: $Utils.Optional<GroceryItemCountAggregateOutputType> | number
          }
        }
      }
      GroceryList: {
        payload: Prisma.$GroceryListPayload<ExtArgs>
        fields: Prisma.GroceryListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroceryListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroceryListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          findFirst: {
            args: Prisma.GroceryListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroceryListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          findMany: {
            args: Prisma.GroceryListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>[]
          }
          create: {
            args: Prisma.GroceryListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          createMany: {
            args: Prisma.GroceryListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroceryListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>[]
          }
          delete: {
            args: Prisma.GroceryListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          update: {
            args: Prisma.GroceryListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          deleteMany: {
            args: Prisma.GroceryListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroceryListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroceryListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>[]
          }
          upsert: {
            args: Prisma.GroceryListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryListPayload>
          }
          aggregate: {
            args: Prisma.GroceryListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroceryList>
          }
          groupBy: {
            args: Prisma.GroceryListGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroceryListGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroceryListCountArgs<ExtArgs>
            result: $Utils.Optional<GroceryListCountAggregateOutputType> | number
          }
        }
      }
      GroceryEntry: {
        payload: Prisma.$GroceryEntryPayload<ExtArgs>
        fields: Prisma.GroceryEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroceryEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroceryEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          findFirst: {
            args: Prisma.GroceryEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroceryEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          findMany: {
            args: Prisma.GroceryEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>[]
          }
          create: {
            args: Prisma.GroceryEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          createMany: {
            args: Prisma.GroceryEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroceryEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>[]
          }
          delete: {
            args: Prisma.GroceryEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          update: {
            args: Prisma.GroceryEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          deleteMany: {
            args: Prisma.GroceryEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroceryEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroceryEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>[]
          }
          upsert: {
            args: Prisma.GroceryEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryEntryPayload>
          }
          aggregate: {
            args: Prisma.GroceryEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroceryEntry>
          }
          groupBy: {
            args: Prisma.GroceryEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroceryEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroceryEntryCountArgs<ExtArgs>
            result: $Utils.Optional<GroceryEntryCountAggregateOutputType> | number
          }
        }
      }
      GroceryAisleOverride: {
        payload: Prisma.$GroceryAisleOverridePayload<ExtArgs>
        fields: Prisma.GroceryAisleOverrideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroceryAisleOverrideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroceryAisleOverrideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          findFirst: {
            args: Prisma.GroceryAisleOverrideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroceryAisleOverrideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          findMany: {
            args: Prisma.GroceryAisleOverrideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>[]
          }
          create: {
            args: Prisma.GroceryAisleOverrideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          createMany: {
            args: Prisma.GroceryAisleOverrideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroceryAisleOverrideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>[]
          }
          delete: {
            args: Prisma.GroceryAisleOverrideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          update: {
            args: Prisma.GroceryAisleOverrideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          deleteMany: {
            args: Prisma.GroceryAisleOverrideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroceryAisleOverrideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroceryAisleOverrideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>[]
          }
          upsert: {
            args: Prisma.GroceryAisleOverrideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroceryAisleOverridePayload>
          }
          aggregate: {
            args: Prisma.GroceryAisleOverrideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroceryAisleOverride>
          }
          groupBy: {
            args: Prisma.GroceryAisleOverrideGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroceryAisleOverrideGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroceryAisleOverrideCountArgs<ExtArgs>
            result: $Utils.Optional<GroceryAisleOverrideCountAggregateOutputType> | number
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
    groceryItem?: GroceryItemOmit
    groceryList?: GroceryListOmit
    groceryEntry?: GroceryEntryOmit
    groceryAisleOverride?: GroceryAisleOverrideOmit
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
   * Count Type GroceryListCountOutputType
   */

  export type GroceryListCountOutputType = {
    items: number
  }

  export type GroceryListCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | GroceryListCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * GroceryListCountOutputType without action
   */
  export type GroceryListCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryListCountOutputType
     */
    select?: GroceryListCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GroceryListCountOutputType without action
   */
  export type GroceryListCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroceryItemWhereInput
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

  export type $PlannedMealPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlannedMeal"
    objects: {}
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
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
  }, ExtArgs["result"]["dinnerNudgeLog"]>

  export type DinnerNudgeLogSelectScalar = {
    date?: boolean
    audience?: boolean
    mealId?: boolean
    firedAt?: boolean
  }

  export type DinnerNudgeLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"date" | "audience" | "mealId" | "firedAt", ExtArgs["result"]["dinnerNudgeLog"]>

  export type $DinnerNudgeLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DinnerNudgeLog"
    objects: {}
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
  }


  /**
   * Model GroceryItem
   */

  export type AggregateGroceryItem = {
    _count: GroceryItemCountAggregateOutputType | null
    _min: GroceryItemMinAggregateOutputType | null
    _max: GroceryItemMaxAggregateOutputType | null
  }

  export type GroceryItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    quantity: string | null
    status: string | null
    sourceType: string | null
    sourceId: string | null
    addedBy: string | null
    addedAt: Date | null
    gotBy: string | null
    gotAt: Date | null
    listId: string | null
  }

  export type GroceryItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    quantity: string | null
    status: string | null
    sourceType: string | null
    sourceId: string | null
    addedBy: string | null
    addedAt: Date | null
    gotBy: string | null
    gotAt: Date | null
    listId: string | null
  }

  export type GroceryItemCountAggregateOutputType = {
    id: number
    name: number
    category: number
    quantity: number
    status: number
    sourceType: number
    sourceId: number
    addedBy: number
    addedAt: number
    gotBy: number
    gotAt: number
    listId: number
    _all: number
  }


  export type GroceryItemMinAggregateInputType = {
    id?: true
    name?: true
    category?: true
    quantity?: true
    status?: true
    sourceType?: true
    sourceId?: true
    addedBy?: true
    addedAt?: true
    gotBy?: true
    gotAt?: true
    listId?: true
  }

  export type GroceryItemMaxAggregateInputType = {
    id?: true
    name?: true
    category?: true
    quantity?: true
    status?: true
    sourceType?: true
    sourceId?: true
    addedBy?: true
    addedAt?: true
    gotBy?: true
    gotAt?: true
    listId?: true
  }

  export type GroceryItemCountAggregateInputType = {
    id?: true
    name?: true
    category?: true
    quantity?: true
    status?: true
    sourceType?: true
    sourceId?: true
    addedBy?: true
    addedAt?: true
    gotBy?: true
    gotAt?: true
    listId?: true
    _all?: true
  }

  export type GroceryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryItem to aggregate.
     */
    where?: GroceryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryItems to fetch.
     */
    orderBy?: GroceryItemOrderByWithRelationInput | GroceryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroceryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroceryItems
    **/
    _count?: true | GroceryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroceryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroceryItemMaxAggregateInputType
  }

  export type GetGroceryItemAggregateType<T extends GroceryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateGroceryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroceryItem[P]>
      : GetScalarType<T[P], AggregateGroceryItem[P]>
  }




  export type GroceryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroceryItemWhereInput
    orderBy?: GroceryItemOrderByWithAggregationInput | GroceryItemOrderByWithAggregationInput[]
    by: GroceryItemScalarFieldEnum[] | GroceryItemScalarFieldEnum
    having?: GroceryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroceryItemCountAggregateInputType | true
    _min?: GroceryItemMinAggregateInputType
    _max?: GroceryItemMaxAggregateInputType
  }

  export type GroceryItemGroupByOutputType = {
    id: string
    name: string
    category: string
    quantity: string | null
    status: string
    sourceType: string
    sourceId: string | null
    addedBy: string
    addedAt: Date
    gotBy: string | null
    gotAt: Date | null
    listId: string
    _count: GroceryItemCountAggregateOutputType | null
    _min: GroceryItemMinAggregateOutputType | null
    _max: GroceryItemMaxAggregateOutputType | null
  }

  type GetGroceryItemGroupByPayload<T extends GroceryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroceryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroceryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroceryItemGroupByOutputType[P]>
            : GetScalarType<T[P], GroceryItemGroupByOutputType[P]>
        }
      >
    >


  export type GroceryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    quantity?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    addedBy?: boolean
    addedAt?: boolean
    gotBy?: boolean
    gotAt?: boolean
    listId?: boolean
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groceryItem"]>

  export type GroceryItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    quantity?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    addedBy?: boolean
    addedAt?: boolean
    gotBy?: boolean
    gotAt?: boolean
    listId?: boolean
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groceryItem"]>

  export type GroceryItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    quantity?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    addedBy?: boolean
    addedAt?: boolean
    gotBy?: boolean
    gotAt?: boolean
    listId?: boolean
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groceryItem"]>

  export type GroceryItemSelectScalar = {
    id?: boolean
    name?: boolean
    category?: boolean
    quantity?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    addedBy?: boolean
    addedAt?: boolean
    gotBy?: boolean
    gotAt?: boolean
    listId?: boolean
  }

  export type GroceryItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "category" | "quantity" | "status" | "sourceType" | "sourceId" | "addedBy" | "addedAt" | "gotBy" | "gotAt" | "listId", ExtArgs["result"]["groceryItem"]>
  export type GroceryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }
  export type GroceryItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }
  export type GroceryItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    list?: boolean | GroceryListDefaultArgs<ExtArgs>
  }

  export type $GroceryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroceryItem"
    objects: {
      list: Prisma.$GroceryListPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      category: string
      quantity: string | null
      status: string
      sourceType: string
      sourceId: string | null
      addedBy: string
      addedAt: Date
      gotBy: string | null
      gotAt: Date | null
      listId: string
    }, ExtArgs["result"]["groceryItem"]>
    composites: {}
  }

  type GroceryItemGetPayload<S extends boolean | null | undefined | GroceryItemDefaultArgs> = $Result.GetResult<Prisma.$GroceryItemPayload, S>

  type GroceryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroceryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroceryItemCountAggregateInputType | true
    }

  export interface GroceryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroceryItem'], meta: { name: 'GroceryItem' } }
    /**
     * Find zero or one GroceryItem that matches the filter.
     * @param {GroceryItemFindUniqueArgs} args - Arguments to find a GroceryItem
     * @example
     * // Get one GroceryItem
     * const groceryItem = await prisma.groceryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroceryItemFindUniqueArgs>(args: SelectSubset<T, GroceryItemFindUniqueArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroceryItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroceryItemFindUniqueOrThrowArgs} args - Arguments to find a GroceryItem
     * @example
     * // Get one GroceryItem
     * const groceryItem = await prisma.groceryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroceryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, GroceryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemFindFirstArgs} args - Arguments to find a GroceryItem
     * @example
     * // Get one GroceryItem
     * const groceryItem = await prisma.groceryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroceryItemFindFirstArgs>(args?: SelectSubset<T, GroceryItemFindFirstArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemFindFirstOrThrowArgs} args - Arguments to find a GroceryItem
     * @example
     * // Get one GroceryItem
     * const groceryItem = await prisma.groceryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroceryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, GroceryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroceryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroceryItems
     * const groceryItems = await prisma.groceryItem.findMany()
     * 
     * // Get first 10 GroceryItems
     * const groceryItems = await prisma.groceryItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groceryItemWithIdOnly = await prisma.groceryItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroceryItemFindManyArgs>(args?: SelectSubset<T, GroceryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroceryItem.
     * @param {GroceryItemCreateArgs} args - Arguments to create a GroceryItem.
     * @example
     * // Create one GroceryItem
     * const GroceryItem = await prisma.groceryItem.create({
     *   data: {
     *     // ... data to create a GroceryItem
     *   }
     * })
     * 
     */
    create<T extends GroceryItemCreateArgs>(args: SelectSubset<T, GroceryItemCreateArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroceryItems.
     * @param {GroceryItemCreateManyArgs} args - Arguments to create many GroceryItems.
     * @example
     * // Create many GroceryItems
     * const groceryItem = await prisma.groceryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroceryItemCreateManyArgs>(args?: SelectSubset<T, GroceryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroceryItems and returns the data saved in the database.
     * @param {GroceryItemCreateManyAndReturnArgs} args - Arguments to create many GroceryItems.
     * @example
     * // Create many GroceryItems
     * const groceryItem = await prisma.groceryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroceryItems and only return the `id`
     * const groceryItemWithIdOnly = await prisma.groceryItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroceryItemCreateManyAndReturnArgs>(args?: SelectSubset<T, GroceryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroceryItem.
     * @param {GroceryItemDeleteArgs} args - Arguments to delete one GroceryItem.
     * @example
     * // Delete one GroceryItem
     * const GroceryItem = await prisma.groceryItem.delete({
     *   where: {
     *     // ... filter to delete one GroceryItem
     *   }
     * })
     * 
     */
    delete<T extends GroceryItemDeleteArgs>(args: SelectSubset<T, GroceryItemDeleteArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroceryItem.
     * @param {GroceryItemUpdateArgs} args - Arguments to update one GroceryItem.
     * @example
     * // Update one GroceryItem
     * const groceryItem = await prisma.groceryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroceryItemUpdateArgs>(args: SelectSubset<T, GroceryItemUpdateArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroceryItems.
     * @param {GroceryItemDeleteManyArgs} args - Arguments to filter GroceryItems to delete.
     * @example
     * // Delete a few GroceryItems
     * const { count } = await prisma.groceryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroceryItemDeleteManyArgs>(args?: SelectSubset<T, GroceryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroceryItems
     * const groceryItem = await prisma.groceryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroceryItemUpdateManyArgs>(args: SelectSubset<T, GroceryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryItems and returns the data updated in the database.
     * @param {GroceryItemUpdateManyAndReturnArgs} args - Arguments to update many GroceryItems.
     * @example
     * // Update many GroceryItems
     * const groceryItem = await prisma.groceryItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroceryItems and only return the `id`
     * const groceryItemWithIdOnly = await prisma.groceryItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends GroceryItemUpdateManyAndReturnArgs>(args: SelectSubset<T, GroceryItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroceryItem.
     * @param {GroceryItemUpsertArgs} args - Arguments to update or create a GroceryItem.
     * @example
     * // Update or create a GroceryItem
     * const groceryItem = await prisma.groceryItem.upsert({
     *   create: {
     *     // ... data to create a GroceryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroceryItem we want to update
     *   }
     * })
     */
    upsert<T extends GroceryItemUpsertArgs>(args: SelectSubset<T, GroceryItemUpsertArgs<ExtArgs>>): Prisma__GroceryItemClient<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroceryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemCountArgs} args - Arguments to filter GroceryItems to count.
     * @example
     * // Count the number of GroceryItems
     * const count = await prisma.groceryItem.count({
     *   where: {
     *     // ... the filter for the GroceryItems we want to count
     *   }
     * })
    **/
    count<T extends GroceryItemCountArgs>(
      args?: Subset<T, GroceryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroceryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroceryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroceryItemAggregateArgs>(args: Subset<T, GroceryItemAggregateArgs>): Prisma.PrismaPromise<GetGroceryItemAggregateType<T>>

    /**
     * Group by GroceryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryItemGroupByArgs} args - Group by arguments.
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
      T extends GroceryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroceryItemGroupByArgs['orderBy'] }
        : { orderBy?: GroceryItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroceryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroceryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroceryItem model
   */
  readonly fields: GroceryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroceryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroceryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    list<T extends GroceryListDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GroceryListDefaultArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the GroceryItem model
   */
  interface GroceryItemFieldRefs {
    readonly id: FieldRef<"GroceryItem", 'String'>
    readonly name: FieldRef<"GroceryItem", 'String'>
    readonly category: FieldRef<"GroceryItem", 'String'>
    readonly quantity: FieldRef<"GroceryItem", 'String'>
    readonly status: FieldRef<"GroceryItem", 'String'>
    readonly sourceType: FieldRef<"GroceryItem", 'String'>
    readonly sourceId: FieldRef<"GroceryItem", 'String'>
    readonly addedBy: FieldRef<"GroceryItem", 'String'>
    readonly addedAt: FieldRef<"GroceryItem", 'DateTime'>
    readonly gotBy: FieldRef<"GroceryItem", 'String'>
    readonly gotAt: FieldRef<"GroceryItem", 'DateTime'>
    readonly listId: FieldRef<"GroceryItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GroceryItem findUnique
   */
  export type GroceryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter, which GroceryItem to fetch.
     */
    where: GroceryItemWhereUniqueInput
  }

  /**
   * GroceryItem findUniqueOrThrow
   */
  export type GroceryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter, which GroceryItem to fetch.
     */
    where: GroceryItemWhereUniqueInput
  }

  /**
   * GroceryItem findFirst
   */
  export type GroceryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter, which GroceryItem to fetch.
     */
    where?: GroceryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryItems to fetch.
     */
    orderBy?: GroceryItemOrderByWithRelationInput | GroceryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryItems.
     */
    cursor?: GroceryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryItems.
     */
    distinct?: GroceryItemScalarFieldEnum | GroceryItemScalarFieldEnum[]
  }

  /**
   * GroceryItem findFirstOrThrow
   */
  export type GroceryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter, which GroceryItem to fetch.
     */
    where?: GroceryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryItems to fetch.
     */
    orderBy?: GroceryItemOrderByWithRelationInput | GroceryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryItems.
     */
    cursor?: GroceryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryItems.
     */
    distinct?: GroceryItemScalarFieldEnum | GroceryItemScalarFieldEnum[]
  }

  /**
   * GroceryItem findMany
   */
  export type GroceryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter, which GroceryItems to fetch.
     */
    where?: GroceryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryItems to fetch.
     */
    orderBy?: GroceryItemOrderByWithRelationInput | GroceryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroceryItems.
     */
    cursor?: GroceryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryItems.
     */
    distinct?: GroceryItemScalarFieldEnum | GroceryItemScalarFieldEnum[]
  }

  /**
   * GroceryItem create
   */
  export type GroceryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a GroceryItem.
     */
    data: XOR<GroceryItemCreateInput, GroceryItemUncheckedCreateInput>
  }

  /**
   * GroceryItem createMany
   */
  export type GroceryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroceryItems.
     */
    data: GroceryItemCreateManyInput | GroceryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryItem createManyAndReturn
   */
  export type GroceryItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * The data used to create many GroceryItems.
     */
    data: GroceryItemCreateManyInput | GroceryItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroceryItem update
   */
  export type GroceryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a GroceryItem.
     */
    data: XOR<GroceryItemUpdateInput, GroceryItemUncheckedUpdateInput>
    /**
     * Choose, which GroceryItem to update.
     */
    where: GroceryItemWhereUniqueInput
  }

  /**
   * GroceryItem updateMany
   */
  export type GroceryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroceryItems.
     */
    data: XOR<GroceryItemUpdateManyMutationInput, GroceryItemUncheckedUpdateManyInput>
    /**
     * Filter which GroceryItems to update
     */
    where?: GroceryItemWhereInput
    /**
     * Limit how many GroceryItems to update.
     */
    limit?: number
  }

  /**
   * GroceryItem updateManyAndReturn
   */
  export type GroceryItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * The data used to update GroceryItems.
     */
    data: XOR<GroceryItemUpdateManyMutationInput, GroceryItemUncheckedUpdateManyInput>
    /**
     * Filter which GroceryItems to update
     */
    where?: GroceryItemWhereInput
    /**
     * Limit how many GroceryItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroceryItem upsert
   */
  export type GroceryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the GroceryItem to update in case it exists.
     */
    where: GroceryItemWhereUniqueInput
    /**
     * In case the GroceryItem found by the `where` argument doesn't exist, create a new GroceryItem with this data.
     */
    create: XOR<GroceryItemCreateInput, GroceryItemUncheckedCreateInput>
    /**
     * In case the GroceryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroceryItemUpdateInput, GroceryItemUncheckedUpdateInput>
  }

  /**
   * GroceryItem delete
   */
  export type GroceryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    /**
     * Filter which GroceryItem to delete.
     */
    where: GroceryItemWhereUniqueInput
  }

  /**
   * GroceryItem deleteMany
   */
  export type GroceryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryItems to delete
     */
    where?: GroceryItemWhereInput
    /**
     * Limit how many GroceryItems to delete.
     */
    limit?: number
  }

  /**
   * GroceryItem without action
   */
  export type GroceryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
  }


  /**
   * Model GroceryList
   */

  export type AggregateGroceryList = {
    _count: GroceryListCountAggregateOutputType | null
    _avg: GroceryListAvgAggregateOutputType | null
    _sum: GroceryListSumAggregateOutputType | null
    _min: GroceryListMinAggregateOutputType | null
    _max: GroceryListMaxAggregateOutputType | null
  }

  export type GroceryListAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type GroceryListSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type GroceryListMinAggregateOutputType = {
    id: string | null
    name: string | null
    kind: string | null
    groupByAisle: boolean | null
    sortOrder: number | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type GroceryListMaxAggregateOutputType = {
    id: string | null
    name: string | null
    kind: string | null
    groupByAisle: boolean | null
    sortOrder: number | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type GroceryListCountAggregateOutputType = {
    id: number
    name: number
    kind: number
    groupByAisle: number
    sortOrder: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type GroceryListAvgAggregateInputType = {
    sortOrder?: true
  }

  export type GroceryListSumAggregateInputType = {
    sortOrder?: true
  }

  export type GroceryListMinAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    groupByAisle?: true
    sortOrder?: true
    createdBy?: true
    createdAt?: true
  }

  export type GroceryListMaxAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    groupByAisle?: true
    sortOrder?: true
    createdBy?: true
    createdAt?: true
  }

  export type GroceryListCountAggregateInputType = {
    id?: true
    name?: true
    kind?: true
    groupByAisle?: true
    sortOrder?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type GroceryListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryList to aggregate.
     */
    where?: GroceryListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryLists to fetch.
     */
    orderBy?: GroceryListOrderByWithRelationInput | GroceryListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroceryListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroceryLists
    **/
    _count?: true | GroceryListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroceryListAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroceryListSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroceryListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroceryListMaxAggregateInputType
  }

  export type GetGroceryListAggregateType<T extends GroceryListAggregateArgs> = {
        [P in keyof T & keyof AggregateGroceryList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroceryList[P]>
      : GetScalarType<T[P], AggregateGroceryList[P]>
  }




  export type GroceryListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroceryListWhereInput
    orderBy?: GroceryListOrderByWithAggregationInput | GroceryListOrderByWithAggregationInput[]
    by: GroceryListScalarFieldEnum[] | GroceryListScalarFieldEnum
    having?: GroceryListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroceryListCountAggregateInputType | true
    _avg?: GroceryListAvgAggregateInputType
    _sum?: GroceryListSumAggregateInputType
    _min?: GroceryListMinAggregateInputType
    _max?: GroceryListMaxAggregateInputType
  }

  export type GroceryListGroupByOutputType = {
    id: string
    name: string
    kind: string
    groupByAisle: boolean
    sortOrder: number
    createdBy: string | null
    createdAt: Date
    _count: GroceryListCountAggregateOutputType | null
    _avg: GroceryListAvgAggregateOutputType | null
    _sum: GroceryListSumAggregateOutputType | null
    _min: GroceryListMinAggregateOutputType | null
    _max: GroceryListMaxAggregateOutputType | null
  }

  type GetGroceryListGroupByPayload<T extends GroceryListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroceryListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroceryListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroceryListGroupByOutputType[P]>
            : GetScalarType<T[P], GroceryListGroupByOutputType[P]>
        }
      >
    >


  export type GroceryListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    groupByAisle?: boolean
    sortOrder?: boolean
    createdBy?: boolean
    createdAt?: boolean
    items?: boolean | GroceryList$itemsArgs<ExtArgs>
    _count?: boolean | GroceryListCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groceryList"]>

  export type GroceryListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    groupByAisle?: boolean
    sortOrder?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["groceryList"]>

  export type GroceryListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kind?: boolean
    groupByAisle?: boolean
    sortOrder?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["groceryList"]>

  export type GroceryListSelectScalar = {
    id?: boolean
    name?: boolean
    kind?: boolean
    groupByAisle?: boolean
    sortOrder?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type GroceryListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "kind" | "groupByAisle" | "sortOrder" | "createdBy" | "createdAt", ExtArgs["result"]["groceryList"]>
  export type GroceryListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | GroceryList$itemsArgs<ExtArgs>
    _count?: boolean | GroceryListCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GroceryListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GroceryListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GroceryListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroceryList"
    objects: {
      items: Prisma.$GroceryItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      kind: string
      groupByAisle: boolean
      sortOrder: number
      createdBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["groceryList"]>
    composites: {}
  }

  type GroceryListGetPayload<S extends boolean | null | undefined | GroceryListDefaultArgs> = $Result.GetResult<Prisma.$GroceryListPayload, S>

  type GroceryListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroceryListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroceryListCountAggregateInputType | true
    }

  export interface GroceryListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroceryList'], meta: { name: 'GroceryList' } }
    /**
     * Find zero or one GroceryList that matches the filter.
     * @param {GroceryListFindUniqueArgs} args - Arguments to find a GroceryList
     * @example
     * // Get one GroceryList
     * const groceryList = await prisma.groceryList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroceryListFindUniqueArgs>(args: SelectSubset<T, GroceryListFindUniqueArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroceryList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroceryListFindUniqueOrThrowArgs} args - Arguments to find a GroceryList
     * @example
     * // Get one GroceryList
     * const groceryList = await prisma.groceryList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroceryListFindUniqueOrThrowArgs>(args: SelectSubset<T, GroceryListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListFindFirstArgs} args - Arguments to find a GroceryList
     * @example
     * // Get one GroceryList
     * const groceryList = await prisma.groceryList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroceryListFindFirstArgs>(args?: SelectSubset<T, GroceryListFindFirstArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListFindFirstOrThrowArgs} args - Arguments to find a GroceryList
     * @example
     * // Get one GroceryList
     * const groceryList = await prisma.groceryList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroceryListFindFirstOrThrowArgs>(args?: SelectSubset<T, GroceryListFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroceryLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroceryLists
     * const groceryLists = await prisma.groceryList.findMany()
     * 
     * // Get first 10 GroceryLists
     * const groceryLists = await prisma.groceryList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groceryListWithIdOnly = await prisma.groceryList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroceryListFindManyArgs>(args?: SelectSubset<T, GroceryListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroceryList.
     * @param {GroceryListCreateArgs} args - Arguments to create a GroceryList.
     * @example
     * // Create one GroceryList
     * const GroceryList = await prisma.groceryList.create({
     *   data: {
     *     // ... data to create a GroceryList
     *   }
     * })
     * 
     */
    create<T extends GroceryListCreateArgs>(args: SelectSubset<T, GroceryListCreateArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroceryLists.
     * @param {GroceryListCreateManyArgs} args - Arguments to create many GroceryLists.
     * @example
     * // Create many GroceryLists
     * const groceryList = await prisma.groceryList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroceryListCreateManyArgs>(args?: SelectSubset<T, GroceryListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroceryLists and returns the data saved in the database.
     * @param {GroceryListCreateManyAndReturnArgs} args - Arguments to create many GroceryLists.
     * @example
     * // Create many GroceryLists
     * const groceryList = await prisma.groceryList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroceryLists and only return the `id`
     * const groceryListWithIdOnly = await prisma.groceryList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroceryListCreateManyAndReturnArgs>(args?: SelectSubset<T, GroceryListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroceryList.
     * @param {GroceryListDeleteArgs} args - Arguments to delete one GroceryList.
     * @example
     * // Delete one GroceryList
     * const GroceryList = await prisma.groceryList.delete({
     *   where: {
     *     // ... filter to delete one GroceryList
     *   }
     * })
     * 
     */
    delete<T extends GroceryListDeleteArgs>(args: SelectSubset<T, GroceryListDeleteArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroceryList.
     * @param {GroceryListUpdateArgs} args - Arguments to update one GroceryList.
     * @example
     * // Update one GroceryList
     * const groceryList = await prisma.groceryList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroceryListUpdateArgs>(args: SelectSubset<T, GroceryListUpdateArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroceryLists.
     * @param {GroceryListDeleteManyArgs} args - Arguments to filter GroceryLists to delete.
     * @example
     * // Delete a few GroceryLists
     * const { count } = await prisma.groceryList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroceryListDeleteManyArgs>(args?: SelectSubset<T, GroceryListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroceryLists
     * const groceryList = await prisma.groceryList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroceryListUpdateManyArgs>(args: SelectSubset<T, GroceryListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryLists and returns the data updated in the database.
     * @param {GroceryListUpdateManyAndReturnArgs} args - Arguments to update many GroceryLists.
     * @example
     * // Update many GroceryLists
     * const groceryList = await prisma.groceryList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroceryLists and only return the `id`
     * const groceryListWithIdOnly = await prisma.groceryList.updateManyAndReturn({
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
    updateManyAndReturn<T extends GroceryListUpdateManyAndReturnArgs>(args: SelectSubset<T, GroceryListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroceryList.
     * @param {GroceryListUpsertArgs} args - Arguments to update or create a GroceryList.
     * @example
     * // Update or create a GroceryList
     * const groceryList = await prisma.groceryList.upsert({
     *   create: {
     *     // ... data to create a GroceryList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroceryList we want to update
     *   }
     * })
     */
    upsert<T extends GroceryListUpsertArgs>(args: SelectSubset<T, GroceryListUpsertArgs<ExtArgs>>): Prisma__GroceryListClient<$Result.GetResult<Prisma.$GroceryListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroceryLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListCountArgs} args - Arguments to filter GroceryLists to count.
     * @example
     * // Count the number of GroceryLists
     * const count = await prisma.groceryList.count({
     *   where: {
     *     // ... the filter for the GroceryLists we want to count
     *   }
     * })
    **/
    count<T extends GroceryListCountArgs>(
      args?: Subset<T, GroceryListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroceryListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroceryList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroceryListAggregateArgs>(args: Subset<T, GroceryListAggregateArgs>): Prisma.PrismaPromise<GetGroceryListAggregateType<T>>

    /**
     * Group by GroceryList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryListGroupByArgs} args - Group by arguments.
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
      T extends GroceryListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroceryListGroupByArgs['orderBy'] }
        : { orderBy?: GroceryListGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroceryListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroceryListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroceryList model
   */
  readonly fields: GroceryListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroceryList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroceryListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends GroceryList$itemsArgs<ExtArgs> = {}>(args?: Subset<T, GroceryList$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the GroceryList model
   */
  interface GroceryListFieldRefs {
    readonly id: FieldRef<"GroceryList", 'String'>
    readonly name: FieldRef<"GroceryList", 'String'>
    readonly kind: FieldRef<"GroceryList", 'String'>
    readonly groupByAisle: FieldRef<"GroceryList", 'Boolean'>
    readonly sortOrder: FieldRef<"GroceryList", 'Int'>
    readonly createdBy: FieldRef<"GroceryList", 'String'>
    readonly createdAt: FieldRef<"GroceryList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroceryList findUnique
   */
  export type GroceryListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter, which GroceryList to fetch.
     */
    where: GroceryListWhereUniqueInput
  }

  /**
   * GroceryList findUniqueOrThrow
   */
  export type GroceryListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter, which GroceryList to fetch.
     */
    where: GroceryListWhereUniqueInput
  }

  /**
   * GroceryList findFirst
   */
  export type GroceryListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter, which GroceryList to fetch.
     */
    where?: GroceryListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryLists to fetch.
     */
    orderBy?: GroceryListOrderByWithRelationInput | GroceryListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryLists.
     */
    cursor?: GroceryListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryLists.
     */
    distinct?: GroceryListScalarFieldEnum | GroceryListScalarFieldEnum[]
  }

  /**
   * GroceryList findFirstOrThrow
   */
  export type GroceryListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter, which GroceryList to fetch.
     */
    where?: GroceryListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryLists to fetch.
     */
    orderBy?: GroceryListOrderByWithRelationInput | GroceryListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryLists.
     */
    cursor?: GroceryListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryLists.
     */
    distinct?: GroceryListScalarFieldEnum | GroceryListScalarFieldEnum[]
  }

  /**
   * GroceryList findMany
   */
  export type GroceryListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter, which GroceryLists to fetch.
     */
    where?: GroceryListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryLists to fetch.
     */
    orderBy?: GroceryListOrderByWithRelationInput | GroceryListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroceryLists.
     */
    cursor?: GroceryListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryLists.
     */
    distinct?: GroceryListScalarFieldEnum | GroceryListScalarFieldEnum[]
  }

  /**
   * GroceryList create
   */
  export type GroceryListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * The data needed to create a GroceryList.
     */
    data: XOR<GroceryListCreateInput, GroceryListUncheckedCreateInput>
  }

  /**
   * GroceryList createMany
   */
  export type GroceryListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroceryLists.
     */
    data: GroceryListCreateManyInput | GroceryListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryList createManyAndReturn
   */
  export type GroceryListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * The data used to create many GroceryLists.
     */
    data: GroceryListCreateManyInput | GroceryListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryList update
   */
  export type GroceryListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * The data needed to update a GroceryList.
     */
    data: XOR<GroceryListUpdateInput, GroceryListUncheckedUpdateInput>
    /**
     * Choose, which GroceryList to update.
     */
    where: GroceryListWhereUniqueInput
  }

  /**
   * GroceryList updateMany
   */
  export type GroceryListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroceryLists.
     */
    data: XOR<GroceryListUpdateManyMutationInput, GroceryListUncheckedUpdateManyInput>
    /**
     * Filter which GroceryLists to update
     */
    where?: GroceryListWhereInput
    /**
     * Limit how many GroceryLists to update.
     */
    limit?: number
  }

  /**
   * GroceryList updateManyAndReturn
   */
  export type GroceryListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * The data used to update GroceryLists.
     */
    data: XOR<GroceryListUpdateManyMutationInput, GroceryListUncheckedUpdateManyInput>
    /**
     * Filter which GroceryLists to update
     */
    where?: GroceryListWhereInput
    /**
     * Limit how many GroceryLists to update.
     */
    limit?: number
  }

  /**
   * GroceryList upsert
   */
  export type GroceryListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * The filter to search for the GroceryList to update in case it exists.
     */
    where: GroceryListWhereUniqueInput
    /**
     * In case the GroceryList found by the `where` argument doesn't exist, create a new GroceryList with this data.
     */
    create: XOR<GroceryListCreateInput, GroceryListUncheckedCreateInput>
    /**
     * In case the GroceryList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroceryListUpdateInput, GroceryListUncheckedUpdateInput>
  }

  /**
   * GroceryList delete
   */
  export type GroceryListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
    /**
     * Filter which GroceryList to delete.
     */
    where: GroceryListWhereUniqueInput
  }

  /**
   * GroceryList deleteMany
   */
  export type GroceryListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryLists to delete
     */
    where?: GroceryListWhereInput
    /**
     * Limit how many GroceryLists to delete.
     */
    limit?: number
  }

  /**
   * GroceryList.items
   */
  export type GroceryList$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryItem
     */
    select?: GroceryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryItem
     */
    omit?: GroceryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryItemInclude<ExtArgs> | null
    where?: GroceryItemWhereInput
    orderBy?: GroceryItemOrderByWithRelationInput | GroceryItemOrderByWithRelationInput[]
    cursor?: GroceryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroceryItemScalarFieldEnum | GroceryItemScalarFieldEnum[]
  }

  /**
   * GroceryList without action
   */
  export type GroceryListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryList
     */
    select?: GroceryListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryList
     */
    omit?: GroceryListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroceryListInclude<ExtArgs> | null
  }


  /**
   * Model GroceryEntry
   */

  export type AggregateGroceryEntry = {
    _count: GroceryEntryCountAggregateOutputType | null
    _min: GroceryEntryMinAggregateOutputType | null
    _max: GroceryEntryMaxAggregateOutputType | null
  }

  export type GroceryEntryMinAggregateOutputType = {
    id: string | null
    normalizedName: string | null
    name: string | null
    lastAddedAt: Date | null
  }

  export type GroceryEntryMaxAggregateOutputType = {
    id: string | null
    normalizedName: string | null
    name: string | null
    lastAddedAt: Date | null
  }

  export type GroceryEntryCountAggregateOutputType = {
    id: number
    normalizedName: number
    name: number
    lastAddedAt: number
    _all: number
  }


  export type GroceryEntryMinAggregateInputType = {
    id?: true
    normalizedName?: true
    name?: true
    lastAddedAt?: true
  }

  export type GroceryEntryMaxAggregateInputType = {
    id?: true
    normalizedName?: true
    name?: true
    lastAddedAt?: true
  }

  export type GroceryEntryCountAggregateInputType = {
    id?: true
    normalizedName?: true
    name?: true
    lastAddedAt?: true
    _all?: true
  }

  export type GroceryEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryEntry to aggregate.
     */
    where?: GroceryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryEntries to fetch.
     */
    orderBy?: GroceryEntryOrderByWithRelationInput | GroceryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroceryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroceryEntries
    **/
    _count?: true | GroceryEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroceryEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroceryEntryMaxAggregateInputType
  }

  export type GetGroceryEntryAggregateType<T extends GroceryEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateGroceryEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroceryEntry[P]>
      : GetScalarType<T[P], AggregateGroceryEntry[P]>
  }




  export type GroceryEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroceryEntryWhereInput
    orderBy?: GroceryEntryOrderByWithAggregationInput | GroceryEntryOrderByWithAggregationInput[]
    by: GroceryEntryScalarFieldEnum[] | GroceryEntryScalarFieldEnum
    having?: GroceryEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroceryEntryCountAggregateInputType | true
    _min?: GroceryEntryMinAggregateInputType
    _max?: GroceryEntryMaxAggregateInputType
  }

  export type GroceryEntryGroupByOutputType = {
    id: string
    normalizedName: string
    name: string
    lastAddedAt: Date
    _count: GroceryEntryCountAggregateOutputType | null
    _min: GroceryEntryMinAggregateOutputType | null
    _max: GroceryEntryMaxAggregateOutputType | null
  }

  type GetGroceryEntryGroupByPayload<T extends GroceryEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroceryEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroceryEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroceryEntryGroupByOutputType[P]>
            : GetScalarType<T[P], GroceryEntryGroupByOutputType[P]>
        }
      >
    >


  export type GroceryEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    name?: boolean
    lastAddedAt?: boolean
  }, ExtArgs["result"]["groceryEntry"]>

  export type GroceryEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    name?: boolean
    lastAddedAt?: boolean
  }, ExtArgs["result"]["groceryEntry"]>

  export type GroceryEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    name?: boolean
    lastAddedAt?: boolean
  }, ExtArgs["result"]["groceryEntry"]>

  export type GroceryEntrySelectScalar = {
    id?: boolean
    normalizedName?: boolean
    name?: boolean
    lastAddedAt?: boolean
  }

  export type GroceryEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "normalizedName" | "name" | "lastAddedAt", ExtArgs["result"]["groceryEntry"]>

  export type $GroceryEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroceryEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      normalizedName: string
      name: string
      lastAddedAt: Date
    }, ExtArgs["result"]["groceryEntry"]>
    composites: {}
  }

  type GroceryEntryGetPayload<S extends boolean | null | undefined | GroceryEntryDefaultArgs> = $Result.GetResult<Prisma.$GroceryEntryPayload, S>

  type GroceryEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroceryEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroceryEntryCountAggregateInputType | true
    }

  export interface GroceryEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroceryEntry'], meta: { name: 'GroceryEntry' } }
    /**
     * Find zero or one GroceryEntry that matches the filter.
     * @param {GroceryEntryFindUniqueArgs} args - Arguments to find a GroceryEntry
     * @example
     * // Get one GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroceryEntryFindUniqueArgs>(args: SelectSubset<T, GroceryEntryFindUniqueArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroceryEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroceryEntryFindUniqueOrThrowArgs} args - Arguments to find a GroceryEntry
     * @example
     * // Get one GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroceryEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, GroceryEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryFindFirstArgs} args - Arguments to find a GroceryEntry
     * @example
     * // Get one GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroceryEntryFindFirstArgs>(args?: SelectSubset<T, GroceryEntryFindFirstArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryFindFirstOrThrowArgs} args - Arguments to find a GroceryEntry
     * @example
     * // Get one GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroceryEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, GroceryEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroceryEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroceryEntries
     * const groceryEntries = await prisma.groceryEntry.findMany()
     * 
     * // Get first 10 GroceryEntries
     * const groceryEntries = await prisma.groceryEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groceryEntryWithIdOnly = await prisma.groceryEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroceryEntryFindManyArgs>(args?: SelectSubset<T, GroceryEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroceryEntry.
     * @param {GroceryEntryCreateArgs} args - Arguments to create a GroceryEntry.
     * @example
     * // Create one GroceryEntry
     * const GroceryEntry = await prisma.groceryEntry.create({
     *   data: {
     *     // ... data to create a GroceryEntry
     *   }
     * })
     * 
     */
    create<T extends GroceryEntryCreateArgs>(args: SelectSubset<T, GroceryEntryCreateArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroceryEntries.
     * @param {GroceryEntryCreateManyArgs} args - Arguments to create many GroceryEntries.
     * @example
     * // Create many GroceryEntries
     * const groceryEntry = await prisma.groceryEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroceryEntryCreateManyArgs>(args?: SelectSubset<T, GroceryEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroceryEntries and returns the data saved in the database.
     * @param {GroceryEntryCreateManyAndReturnArgs} args - Arguments to create many GroceryEntries.
     * @example
     * // Create many GroceryEntries
     * const groceryEntry = await prisma.groceryEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroceryEntries and only return the `id`
     * const groceryEntryWithIdOnly = await prisma.groceryEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroceryEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, GroceryEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroceryEntry.
     * @param {GroceryEntryDeleteArgs} args - Arguments to delete one GroceryEntry.
     * @example
     * // Delete one GroceryEntry
     * const GroceryEntry = await prisma.groceryEntry.delete({
     *   where: {
     *     // ... filter to delete one GroceryEntry
     *   }
     * })
     * 
     */
    delete<T extends GroceryEntryDeleteArgs>(args: SelectSubset<T, GroceryEntryDeleteArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroceryEntry.
     * @param {GroceryEntryUpdateArgs} args - Arguments to update one GroceryEntry.
     * @example
     * // Update one GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroceryEntryUpdateArgs>(args: SelectSubset<T, GroceryEntryUpdateArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroceryEntries.
     * @param {GroceryEntryDeleteManyArgs} args - Arguments to filter GroceryEntries to delete.
     * @example
     * // Delete a few GroceryEntries
     * const { count } = await prisma.groceryEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroceryEntryDeleteManyArgs>(args?: SelectSubset<T, GroceryEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroceryEntries
     * const groceryEntry = await prisma.groceryEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroceryEntryUpdateManyArgs>(args: SelectSubset<T, GroceryEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryEntries and returns the data updated in the database.
     * @param {GroceryEntryUpdateManyAndReturnArgs} args - Arguments to update many GroceryEntries.
     * @example
     * // Update many GroceryEntries
     * const groceryEntry = await prisma.groceryEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroceryEntries and only return the `id`
     * const groceryEntryWithIdOnly = await prisma.groceryEntry.updateManyAndReturn({
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
    updateManyAndReturn<T extends GroceryEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, GroceryEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroceryEntry.
     * @param {GroceryEntryUpsertArgs} args - Arguments to update or create a GroceryEntry.
     * @example
     * // Update or create a GroceryEntry
     * const groceryEntry = await prisma.groceryEntry.upsert({
     *   create: {
     *     // ... data to create a GroceryEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroceryEntry we want to update
     *   }
     * })
     */
    upsert<T extends GroceryEntryUpsertArgs>(args: SelectSubset<T, GroceryEntryUpsertArgs<ExtArgs>>): Prisma__GroceryEntryClient<$Result.GetResult<Prisma.$GroceryEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroceryEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryCountArgs} args - Arguments to filter GroceryEntries to count.
     * @example
     * // Count the number of GroceryEntries
     * const count = await prisma.groceryEntry.count({
     *   where: {
     *     // ... the filter for the GroceryEntries we want to count
     *   }
     * })
    **/
    count<T extends GroceryEntryCountArgs>(
      args?: Subset<T, GroceryEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroceryEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroceryEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroceryEntryAggregateArgs>(args: Subset<T, GroceryEntryAggregateArgs>): Prisma.PrismaPromise<GetGroceryEntryAggregateType<T>>

    /**
     * Group by GroceryEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryEntryGroupByArgs} args - Group by arguments.
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
      T extends GroceryEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroceryEntryGroupByArgs['orderBy'] }
        : { orderBy?: GroceryEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroceryEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroceryEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroceryEntry model
   */
  readonly fields: GroceryEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroceryEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroceryEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GroceryEntry model
   */
  interface GroceryEntryFieldRefs {
    readonly id: FieldRef<"GroceryEntry", 'String'>
    readonly normalizedName: FieldRef<"GroceryEntry", 'String'>
    readonly name: FieldRef<"GroceryEntry", 'String'>
    readonly lastAddedAt: FieldRef<"GroceryEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroceryEntry findUnique
   */
  export type GroceryEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter, which GroceryEntry to fetch.
     */
    where: GroceryEntryWhereUniqueInput
  }

  /**
   * GroceryEntry findUniqueOrThrow
   */
  export type GroceryEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter, which GroceryEntry to fetch.
     */
    where: GroceryEntryWhereUniqueInput
  }

  /**
   * GroceryEntry findFirst
   */
  export type GroceryEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter, which GroceryEntry to fetch.
     */
    where?: GroceryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryEntries to fetch.
     */
    orderBy?: GroceryEntryOrderByWithRelationInput | GroceryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryEntries.
     */
    cursor?: GroceryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryEntries.
     */
    distinct?: GroceryEntryScalarFieldEnum | GroceryEntryScalarFieldEnum[]
  }

  /**
   * GroceryEntry findFirstOrThrow
   */
  export type GroceryEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter, which GroceryEntry to fetch.
     */
    where?: GroceryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryEntries to fetch.
     */
    orderBy?: GroceryEntryOrderByWithRelationInput | GroceryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryEntries.
     */
    cursor?: GroceryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryEntries.
     */
    distinct?: GroceryEntryScalarFieldEnum | GroceryEntryScalarFieldEnum[]
  }

  /**
   * GroceryEntry findMany
   */
  export type GroceryEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter, which GroceryEntries to fetch.
     */
    where?: GroceryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryEntries to fetch.
     */
    orderBy?: GroceryEntryOrderByWithRelationInput | GroceryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroceryEntries.
     */
    cursor?: GroceryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryEntries.
     */
    distinct?: GroceryEntryScalarFieldEnum | GroceryEntryScalarFieldEnum[]
  }

  /**
   * GroceryEntry create
   */
  export type GroceryEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a GroceryEntry.
     */
    data: XOR<GroceryEntryCreateInput, GroceryEntryUncheckedCreateInput>
  }

  /**
   * GroceryEntry createMany
   */
  export type GroceryEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroceryEntries.
     */
    data: GroceryEntryCreateManyInput | GroceryEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryEntry createManyAndReturn
   */
  export type GroceryEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * The data used to create many GroceryEntries.
     */
    data: GroceryEntryCreateManyInput | GroceryEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryEntry update
   */
  export type GroceryEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a GroceryEntry.
     */
    data: XOR<GroceryEntryUpdateInput, GroceryEntryUncheckedUpdateInput>
    /**
     * Choose, which GroceryEntry to update.
     */
    where: GroceryEntryWhereUniqueInput
  }

  /**
   * GroceryEntry updateMany
   */
  export type GroceryEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroceryEntries.
     */
    data: XOR<GroceryEntryUpdateManyMutationInput, GroceryEntryUncheckedUpdateManyInput>
    /**
     * Filter which GroceryEntries to update
     */
    where?: GroceryEntryWhereInput
    /**
     * Limit how many GroceryEntries to update.
     */
    limit?: number
  }

  /**
   * GroceryEntry updateManyAndReturn
   */
  export type GroceryEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * The data used to update GroceryEntries.
     */
    data: XOR<GroceryEntryUpdateManyMutationInput, GroceryEntryUncheckedUpdateManyInput>
    /**
     * Filter which GroceryEntries to update
     */
    where?: GroceryEntryWhereInput
    /**
     * Limit how many GroceryEntries to update.
     */
    limit?: number
  }

  /**
   * GroceryEntry upsert
   */
  export type GroceryEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the GroceryEntry to update in case it exists.
     */
    where: GroceryEntryWhereUniqueInput
    /**
     * In case the GroceryEntry found by the `where` argument doesn't exist, create a new GroceryEntry with this data.
     */
    create: XOR<GroceryEntryCreateInput, GroceryEntryUncheckedCreateInput>
    /**
     * In case the GroceryEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroceryEntryUpdateInput, GroceryEntryUncheckedUpdateInput>
  }

  /**
   * GroceryEntry delete
   */
  export type GroceryEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
    /**
     * Filter which GroceryEntry to delete.
     */
    where: GroceryEntryWhereUniqueInput
  }

  /**
   * GroceryEntry deleteMany
   */
  export type GroceryEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryEntries to delete
     */
    where?: GroceryEntryWhereInput
    /**
     * Limit how many GroceryEntries to delete.
     */
    limit?: number
  }

  /**
   * GroceryEntry without action
   */
  export type GroceryEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryEntry
     */
    select?: GroceryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryEntry
     */
    omit?: GroceryEntryOmit<ExtArgs> | null
  }


  /**
   * Model GroceryAisleOverride
   */

  export type AggregateGroceryAisleOverride = {
    _count: GroceryAisleOverrideCountAggregateOutputType | null
    _min: GroceryAisleOverrideMinAggregateOutputType | null
    _max: GroceryAisleOverrideMaxAggregateOutputType | null
  }

  export type GroceryAisleOverrideMinAggregateOutputType = {
    id: string | null
    normalizedName: string | null
    category: string | null
    updatedAt: Date | null
  }

  export type GroceryAisleOverrideMaxAggregateOutputType = {
    id: string | null
    normalizedName: string | null
    category: string | null
    updatedAt: Date | null
  }

  export type GroceryAisleOverrideCountAggregateOutputType = {
    id: number
    normalizedName: number
    category: number
    updatedAt: number
    _all: number
  }


  export type GroceryAisleOverrideMinAggregateInputType = {
    id?: true
    normalizedName?: true
    category?: true
    updatedAt?: true
  }

  export type GroceryAisleOverrideMaxAggregateInputType = {
    id?: true
    normalizedName?: true
    category?: true
    updatedAt?: true
  }

  export type GroceryAisleOverrideCountAggregateInputType = {
    id?: true
    normalizedName?: true
    category?: true
    updatedAt?: true
    _all?: true
  }

  export type GroceryAisleOverrideAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryAisleOverride to aggregate.
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryAisleOverrides to fetch.
     */
    orderBy?: GroceryAisleOverrideOrderByWithRelationInput | GroceryAisleOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroceryAisleOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryAisleOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryAisleOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroceryAisleOverrides
    **/
    _count?: true | GroceryAisleOverrideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroceryAisleOverrideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroceryAisleOverrideMaxAggregateInputType
  }

  export type GetGroceryAisleOverrideAggregateType<T extends GroceryAisleOverrideAggregateArgs> = {
        [P in keyof T & keyof AggregateGroceryAisleOverride]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroceryAisleOverride[P]>
      : GetScalarType<T[P], AggregateGroceryAisleOverride[P]>
  }




  export type GroceryAisleOverrideGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroceryAisleOverrideWhereInput
    orderBy?: GroceryAisleOverrideOrderByWithAggregationInput | GroceryAisleOverrideOrderByWithAggregationInput[]
    by: GroceryAisleOverrideScalarFieldEnum[] | GroceryAisleOverrideScalarFieldEnum
    having?: GroceryAisleOverrideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroceryAisleOverrideCountAggregateInputType | true
    _min?: GroceryAisleOverrideMinAggregateInputType
    _max?: GroceryAisleOverrideMaxAggregateInputType
  }

  export type GroceryAisleOverrideGroupByOutputType = {
    id: string
    normalizedName: string
    category: string
    updatedAt: Date
    _count: GroceryAisleOverrideCountAggregateOutputType | null
    _min: GroceryAisleOverrideMinAggregateOutputType | null
    _max: GroceryAisleOverrideMaxAggregateOutputType | null
  }

  type GetGroceryAisleOverrideGroupByPayload<T extends GroceryAisleOverrideGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroceryAisleOverrideGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroceryAisleOverrideGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroceryAisleOverrideGroupByOutputType[P]>
            : GetScalarType<T[P], GroceryAisleOverrideGroupByOutputType[P]>
        }
      >
    >


  export type GroceryAisleOverrideSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    category?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groceryAisleOverride"]>

  export type GroceryAisleOverrideSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    category?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groceryAisleOverride"]>

  export type GroceryAisleOverrideSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    normalizedName?: boolean
    category?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groceryAisleOverride"]>

  export type GroceryAisleOverrideSelectScalar = {
    id?: boolean
    normalizedName?: boolean
    category?: boolean
    updatedAt?: boolean
  }

  export type GroceryAisleOverrideOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "normalizedName" | "category" | "updatedAt", ExtArgs["result"]["groceryAisleOverride"]>

  export type $GroceryAisleOverridePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroceryAisleOverride"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      normalizedName: string
      category: string
      updatedAt: Date
    }, ExtArgs["result"]["groceryAisleOverride"]>
    composites: {}
  }

  type GroceryAisleOverrideGetPayload<S extends boolean | null | undefined | GroceryAisleOverrideDefaultArgs> = $Result.GetResult<Prisma.$GroceryAisleOverridePayload, S>

  type GroceryAisleOverrideCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroceryAisleOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroceryAisleOverrideCountAggregateInputType | true
    }

  export interface GroceryAisleOverrideDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroceryAisleOverride'], meta: { name: 'GroceryAisleOverride' } }
    /**
     * Find zero or one GroceryAisleOverride that matches the filter.
     * @param {GroceryAisleOverrideFindUniqueArgs} args - Arguments to find a GroceryAisleOverride
     * @example
     * // Get one GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroceryAisleOverrideFindUniqueArgs>(args: SelectSubset<T, GroceryAisleOverrideFindUniqueArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroceryAisleOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroceryAisleOverrideFindUniqueOrThrowArgs} args - Arguments to find a GroceryAisleOverride
     * @example
     * // Get one GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroceryAisleOverrideFindUniqueOrThrowArgs>(args: SelectSubset<T, GroceryAisleOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryAisleOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideFindFirstArgs} args - Arguments to find a GroceryAisleOverride
     * @example
     * // Get one GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroceryAisleOverrideFindFirstArgs>(args?: SelectSubset<T, GroceryAisleOverrideFindFirstArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroceryAisleOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideFindFirstOrThrowArgs} args - Arguments to find a GroceryAisleOverride
     * @example
     * // Get one GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroceryAisleOverrideFindFirstOrThrowArgs>(args?: SelectSubset<T, GroceryAisleOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroceryAisleOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroceryAisleOverrides
     * const groceryAisleOverrides = await prisma.groceryAisleOverride.findMany()
     * 
     * // Get first 10 GroceryAisleOverrides
     * const groceryAisleOverrides = await prisma.groceryAisleOverride.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groceryAisleOverrideWithIdOnly = await prisma.groceryAisleOverride.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroceryAisleOverrideFindManyArgs>(args?: SelectSubset<T, GroceryAisleOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroceryAisleOverride.
     * @param {GroceryAisleOverrideCreateArgs} args - Arguments to create a GroceryAisleOverride.
     * @example
     * // Create one GroceryAisleOverride
     * const GroceryAisleOverride = await prisma.groceryAisleOverride.create({
     *   data: {
     *     // ... data to create a GroceryAisleOverride
     *   }
     * })
     * 
     */
    create<T extends GroceryAisleOverrideCreateArgs>(args: SelectSubset<T, GroceryAisleOverrideCreateArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroceryAisleOverrides.
     * @param {GroceryAisleOverrideCreateManyArgs} args - Arguments to create many GroceryAisleOverrides.
     * @example
     * // Create many GroceryAisleOverrides
     * const groceryAisleOverride = await prisma.groceryAisleOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroceryAisleOverrideCreateManyArgs>(args?: SelectSubset<T, GroceryAisleOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroceryAisleOverrides and returns the data saved in the database.
     * @param {GroceryAisleOverrideCreateManyAndReturnArgs} args - Arguments to create many GroceryAisleOverrides.
     * @example
     * // Create many GroceryAisleOverrides
     * const groceryAisleOverride = await prisma.groceryAisleOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroceryAisleOverrides and only return the `id`
     * const groceryAisleOverrideWithIdOnly = await prisma.groceryAisleOverride.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroceryAisleOverrideCreateManyAndReturnArgs>(args?: SelectSubset<T, GroceryAisleOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroceryAisleOverride.
     * @param {GroceryAisleOverrideDeleteArgs} args - Arguments to delete one GroceryAisleOverride.
     * @example
     * // Delete one GroceryAisleOverride
     * const GroceryAisleOverride = await prisma.groceryAisleOverride.delete({
     *   where: {
     *     // ... filter to delete one GroceryAisleOverride
     *   }
     * })
     * 
     */
    delete<T extends GroceryAisleOverrideDeleteArgs>(args: SelectSubset<T, GroceryAisleOverrideDeleteArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroceryAisleOverride.
     * @param {GroceryAisleOverrideUpdateArgs} args - Arguments to update one GroceryAisleOverride.
     * @example
     * // Update one GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroceryAisleOverrideUpdateArgs>(args: SelectSubset<T, GroceryAisleOverrideUpdateArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroceryAisleOverrides.
     * @param {GroceryAisleOverrideDeleteManyArgs} args - Arguments to filter GroceryAisleOverrides to delete.
     * @example
     * // Delete a few GroceryAisleOverrides
     * const { count } = await prisma.groceryAisleOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroceryAisleOverrideDeleteManyArgs>(args?: SelectSubset<T, GroceryAisleOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryAisleOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroceryAisleOverrides
     * const groceryAisleOverride = await prisma.groceryAisleOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroceryAisleOverrideUpdateManyArgs>(args: SelectSubset<T, GroceryAisleOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroceryAisleOverrides and returns the data updated in the database.
     * @param {GroceryAisleOverrideUpdateManyAndReturnArgs} args - Arguments to update many GroceryAisleOverrides.
     * @example
     * // Update many GroceryAisleOverrides
     * const groceryAisleOverride = await prisma.groceryAisleOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroceryAisleOverrides and only return the `id`
     * const groceryAisleOverrideWithIdOnly = await prisma.groceryAisleOverride.updateManyAndReturn({
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
    updateManyAndReturn<T extends GroceryAisleOverrideUpdateManyAndReturnArgs>(args: SelectSubset<T, GroceryAisleOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroceryAisleOverride.
     * @param {GroceryAisleOverrideUpsertArgs} args - Arguments to update or create a GroceryAisleOverride.
     * @example
     * // Update or create a GroceryAisleOverride
     * const groceryAisleOverride = await prisma.groceryAisleOverride.upsert({
     *   create: {
     *     // ... data to create a GroceryAisleOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroceryAisleOverride we want to update
     *   }
     * })
     */
    upsert<T extends GroceryAisleOverrideUpsertArgs>(args: SelectSubset<T, GroceryAisleOverrideUpsertArgs<ExtArgs>>): Prisma__GroceryAisleOverrideClient<$Result.GetResult<Prisma.$GroceryAisleOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroceryAisleOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideCountArgs} args - Arguments to filter GroceryAisleOverrides to count.
     * @example
     * // Count the number of GroceryAisleOverrides
     * const count = await prisma.groceryAisleOverride.count({
     *   where: {
     *     // ... the filter for the GroceryAisleOverrides we want to count
     *   }
     * })
    **/
    count<T extends GroceryAisleOverrideCountArgs>(
      args?: Subset<T, GroceryAisleOverrideCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroceryAisleOverrideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroceryAisleOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroceryAisleOverrideAggregateArgs>(args: Subset<T, GroceryAisleOverrideAggregateArgs>): Prisma.PrismaPromise<GetGroceryAisleOverrideAggregateType<T>>

    /**
     * Group by GroceryAisleOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroceryAisleOverrideGroupByArgs} args - Group by arguments.
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
      T extends GroceryAisleOverrideGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroceryAisleOverrideGroupByArgs['orderBy'] }
        : { orderBy?: GroceryAisleOverrideGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroceryAisleOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroceryAisleOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroceryAisleOverride model
   */
  readonly fields: GroceryAisleOverrideFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroceryAisleOverride.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroceryAisleOverrideClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GroceryAisleOverride model
   */
  interface GroceryAisleOverrideFieldRefs {
    readonly id: FieldRef<"GroceryAisleOverride", 'String'>
    readonly normalizedName: FieldRef<"GroceryAisleOverride", 'String'>
    readonly category: FieldRef<"GroceryAisleOverride", 'String'>
    readonly updatedAt: FieldRef<"GroceryAisleOverride", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroceryAisleOverride findUnique
   */
  export type GroceryAisleOverrideFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter, which GroceryAisleOverride to fetch.
     */
    where: GroceryAisleOverrideWhereUniqueInput
  }

  /**
   * GroceryAisleOverride findUniqueOrThrow
   */
  export type GroceryAisleOverrideFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter, which GroceryAisleOverride to fetch.
     */
    where: GroceryAisleOverrideWhereUniqueInput
  }

  /**
   * GroceryAisleOverride findFirst
   */
  export type GroceryAisleOverrideFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter, which GroceryAisleOverride to fetch.
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryAisleOverrides to fetch.
     */
    orderBy?: GroceryAisleOverrideOrderByWithRelationInput | GroceryAisleOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryAisleOverrides.
     */
    cursor?: GroceryAisleOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryAisleOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryAisleOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryAisleOverrides.
     */
    distinct?: GroceryAisleOverrideScalarFieldEnum | GroceryAisleOverrideScalarFieldEnum[]
  }

  /**
   * GroceryAisleOverride findFirstOrThrow
   */
  export type GroceryAisleOverrideFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter, which GroceryAisleOverride to fetch.
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryAisleOverrides to fetch.
     */
    orderBy?: GroceryAisleOverrideOrderByWithRelationInput | GroceryAisleOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroceryAisleOverrides.
     */
    cursor?: GroceryAisleOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryAisleOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryAisleOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryAisleOverrides.
     */
    distinct?: GroceryAisleOverrideScalarFieldEnum | GroceryAisleOverrideScalarFieldEnum[]
  }

  /**
   * GroceryAisleOverride findMany
   */
  export type GroceryAisleOverrideFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter, which GroceryAisleOverrides to fetch.
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroceryAisleOverrides to fetch.
     */
    orderBy?: GroceryAisleOverrideOrderByWithRelationInput | GroceryAisleOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroceryAisleOverrides.
     */
    cursor?: GroceryAisleOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroceryAisleOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroceryAisleOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroceryAisleOverrides.
     */
    distinct?: GroceryAisleOverrideScalarFieldEnum | GroceryAisleOverrideScalarFieldEnum[]
  }

  /**
   * GroceryAisleOverride create
   */
  export type GroceryAisleOverrideCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * The data needed to create a GroceryAisleOverride.
     */
    data: XOR<GroceryAisleOverrideCreateInput, GroceryAisleOverrideUncheckedCreateInput>
  }

  /**
   * GroceryAisleOverride createMany
   */
  export type GroceryAisleOverrideCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroceryAisleOverrides.
     */
    data: GroceryAisleOverrideCreateManyInput | GroceryAisleOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryAisleOverride createManyAndReturn
   */
  export type GroceryAisleOverrideCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * The data used to create many GroceryAisleOverrides.
     */
    data: GroceryAisleOverrideCreateManyInput | GroceryAisleOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroceryAisleOverride update
   */
  export type GroceryAisleOverrideUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * The data needed to update a GroceryAisleOverride.
     */
    data: XOR<GroceryAisleOverrideUpdateInput, GroceryAisleOverrideUncheckedUpdateInput>
    /**
     * Choose, which GroceryAisleOverride to update.
     */
    where: GroceryAisleOverrideWhereUniqueInput
  }

  /**
   * GroceryAisleOverride updateMany
   */
  export type GroceryAisleOverrideUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroceryAisleOverrides.
     */
    data: XOR<GroceryAisleOverrideUpdateManyMutationInput, GroceryAisleOverrideUncheckedUpdateManyInput>
    /**
     * Filter which GroceryAisleOverrides to update
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * Limit how many GroceryAisleOverrides to update.
     */
    limit?: number
  }

  /**
   * GroceryAisleOverride updateManyAndReturn
   */
  export type GroceryAisleOverrideUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * The data used to update GroceryAisleOverrides.
     */
    data: XOR<GroceryAisleOverrideUpdateManyMutationInput, GroceryAisleOverrideUncheckedUpdateManyInput>
    /**
     * Filter which GroceryAisleOverrides to update
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * Limit how many GroceryAisleOverrides to update.
     */
    limit?: number
  }

  /**
   * GroceryAisleOverride upsert
   */
  export type GroceryAisleOverrideUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * The filter to search for the GroceryAisleOverride to update in case it exists.
     */
    where: GroceryAisleOverrideWhereUniqueInput
    /**
     * In case the GroceryAisleOverride found by the `where` argument doesn't exist, create a new GroceryAisleOverride with this data.
     */
    create: XOR<GroceryAisleOverrideCreateInput, GroceryAisleOverrideUncheckedCreateInput>
    /**
     * In case the GroceryAisleOverride was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroceryAisleOverrideUpdateInput, GroceryAisleOverrideUncheckedUpdateInput>
  }

  /**
   * GroceryAisleOverride delete
   */
  export type GroceryAisleOverrideDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
    /**
     * Filter which GroceryAisleOverride to delete.
     */
    where: GroceryAisleOverrideWhereUniqueInput
  }

  /**
   * GroceryAisleOverride deleteMany
   */
  export type GroceryAisleOverrideDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroceryAisleOverrides to delete
     */
    where?: GroceryAisleOverrideWhereInput
    /**
     * Limit how many GroceryAisleOverrides to delete.
     */
    limit?: number
  }

  /**
   * GroceryAisleOverride without action
   */
  export type GroceryAisleOverrideDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroceryAisleOverride
     */
    select?: GroceryAisleOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroceryAisleOverride
     */
    omit?: GroceryAisleOverrideOmit<ExtArgs> | null
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


  export const GroceryItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    category: 'category',
    quantity: 'quantity',
    status: 'status',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    addedBy: 'addedBy',
    addedAt: 'addedAt',
    gotBy: 'gotBy',
    gotAt: 'gotAt',
    listId: 'listId'
  };

  export type GroceryItemScalarFieldEnum = (typeof GroceryItemScalarFieldEnum)[keyof typeof GroceryItemScalarFieldEnum]


  export const GroceryListScalarFieldEnum: {
    id: 'id',
    name: 'name',
    kind: 'kind',
    groupByAisle: 'groupByAisle',
    sortOrder: 'sortOrder',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type GroceryListScalarFieldEnum = (typeof GroceryListScalarFieldEnum)[keyof typeof GroceryListScalarFieldEnum]


  export const GroceryEntryScalarFieldEnum: {
    id: 'id',
    normalizedName: 'normalizedName',
    name: 'name',
    lastAddedAt: 'lastAddedAt'
  };

  export type GroceryEntryScalarFieldEnum = (typeof GroceryEntryScalarFieldEnum)[keyof typeof GroceryEntryScalarFieldEnum]


  export const GroceryAisleOverrideScalarFieldEnum: {
    id: 'id',
    normalizedName: 'normalizedName',
    category: 'category',
    updatedAt: 'updatedAt'
  };

  export type GroceryAisleOverrideScalarFieldEnum = (typeof GroceryAisleOverrideScalarFieldEnum)[keyof typeof GroceryAisleOverrideScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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
  }

  export type DinnerNudgeLogOrderByWithRelationInput = {
    date?: SortOrder
    audience?: SortOrder
    mealId?: SortOrder
    firedAt?: SortOrder
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

  export type GroceryItemWhereInput = {
    AND?: GroceryItemWhereInput | GroceryItemWhereInput[]
    OR?: GroceryItemWhereInput[]
    NOT?: GroceryItemWhereInput | GroceryItemWhereInput[]
    id?: UuidFilter<"GroceryItem"> | string
    name?: StringFilter<"GroceryItem"> | string
    category?: StringFilter<"GroceryItem"> | string
    quantity?: StringNullableFilter<"GroceryItem"> | string | null
    status?: StringFilter<"GroceryItem"> | string
    sourceType?: StringFilter<"GroceryItem"> | string
    sourceId?: StringNullableFilter<"GroceryItem"> | string | null
    addedBy?: UuidFilter<"GroceryItem"> | string
    addedAt?: DateTimeFilter<"GroceryItem"> | Date | string
    gotBy?: UuidNullableFilter<"GroceryItem"> | string | null
    gotAt?: DateTimeNullableFilter<"GroceryItem"> | Date | string | null
    listId?: UuidFilter<"GroceryItem"> | string
    list?: XOR<GroceryListScalarRelationFilter, GroceryListWhereInput>
  }

  export type GroceryItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    quantity?: SortOrderInput | SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    gotBy?: SortOrderInput | SortOrder
    gotAt?: SortOrderInput | SortOrder
    listId?: SortOrder
    list?: GroceryListOrderByWithRelationInput
  }

  export type GroceryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroceryItemWhereInput | GroceryItemWhereInput[]
    OR?: GroceryItemWhereInput[]
    NOT?: GroceryItemWhereInput | GroceryItemWhereInput[]
    name?: StringFilter<"GroceryItem"> | string
    category?: StringFilter<"GroceryItem"> | string
    quantity?: StringNullableFilter<"GroceryItem"> | string | null
    status?: StringFilter<"GroceryItem"> | string
    sourceType?: StringFilter<"GroceryItem"> | string
    sourceId?: StringNullableFilter<"GroceryItem"> | string | null
    addedBy?: UuidFilter<"GroceryItem"> | string
    addedAt?: DateTimeFilter<"GroceryItem"> | Date | string
    gotBy?: UuidNullableFilter<"GroceryItem"> | string | null
    gotAt?: DateTimeNullableFilter<"GroceryItem"> | Date | string | null
    listId?: UuidFilter<"GroceryItem"> | string
    list?: XOR<GroceryListScalarRelationFilter, GroceryListWhereInput>
  }, "id">

  export type GroceryItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    quantity?: SortOrderInput | SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    gotBy?: SortOrderInput | SortOrder
    gotAt?: SortOrderInput | SortOrder
    listId?: SortOrder
    _count?: GroceryItemCountOrderByAggregateInput
    _max?: GroceryItemMaxOrderByAggregateInput
    _min?: GroceryItemMinOrderByAggregateInput
  }

  export type GroceryItemScalarWhereWithAggregatesInput = {
    AND?: GroceryItemScalarWhereWithAggregatesInput | GroceryItemScalarWhereWithAggregatesInput[]
    OR?: GroceryItemScalarWhereWithAggregatesInput[]
    NOT?: GroceryItemScalarWhereWithAggregatesInput | GroceryItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GroceryItem"> | string
    name?: StringWithAggregatesFilter<"GroceryItem"> | string
    category?: StringWithAggregatesFilter<"GroceryItem"> | string
    quantity?: StringNullableWithAggregatesFilter<"GroceryItem"> | string | null
    status?: StringWithAggregatesFilter<"GroceryItem"> | string
    sourceType?: StringWithAggregatesFilter<"GroceryItem"> | string
    sourceId?: StringNullableWithAggregatesFilter<"GroceryItem"> | string | null
    addedBy?: UuidWithAggregatesFilter<"GroceryItem"> | string
    addedAt?: DateTimeWithAggregatesFilter<"GroceryItem"> | Date | string
    gotBy?: UuidNullableWithAggregatesFilter<"GroceryItem"> | string | null
    gotAt?: DateTimeNullableWithAggregatesFilter<"GroceryItem"> | Date | string | null
    listId?: UuidWithAggregatesFilter<"GroceryItem"> | string
  }

  export type GroceryListWhereInput = {
    AND?: GroceryListWhereInput | GroceryListWhereInput[]
    OR?: GroceryListWhereInput[]
    NOT?: GroceryListWhereInput | GroceryListWhereInput[]
    id?: UuidFilter<"GroceryList"> | string
    name?: StringFilter<"GroceryList"> | string
    kind?: StringFilter<"GroceryList"> | string
    groupByAisle?: BoolFilter<"GroceryList"> | boolean
    sortOrder?: IntFilter<"GroceryList"> | number
    createdBy?: UuidNullableFilter<"GroceryList"> | string | null
    createdAt?: DateTimeFilter<"GroceryList"> | Date | string
    items?: GroceryItemListRelationFilter
  }

  export type GroceryListOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    groupByAisle?: SortOrder
    sortOrder?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    items?: GroceryItemOrderByRelationAggregateInput
  }

  export type GroceryListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroceryListWhereInput | GroceryListWhereInput[]
    OR?: GroceryListWhereInput[]
    NOT?: GroceryListWhereInput | GroceryListWhereInput[]
    name?: StringFilter<"GroceryList"> | string
    kind?: StringFilter<"GroceryList"> | string
    groupByAisle?: BoolFilter<"GroceryList"> | boolean
    sortOrder?: IntFilter<"GroceryList"> | number
    createdBy?: UuidNullableFilter<"GroceryList"> | string | null
    createdAt?: DateTimeFilter<"GroceryList"> | Date | string
    items?: GroceryItemListRelationFilter
  }, "id">

  export type GroceryListOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    groupByAisle?: SortOrder
    sortOrder?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GroceryListCountOrderByAggregateInput
    _avg?: GroceryListAvgOrderByAggregateInput
    _max?: GroceryListMaxOrderByAggregateInput
    _min?: GroceryListMinOrderByAggregateInput
    _sum?: GroceryListSumOrderByAggregateInput
  }

  export type GroceryListScalarWhereWithAggregatesInput = {
    AND?: GroceryListScalarWhereWithAggregatesInput | GroceryListScalarWhereWithAggregatesInput[]
    OR?: GroceryListScalarWhereWithAggregatesInput[]
    NOT?: GroceryListScalarWhereWithAggregatesInput | GroceryListScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GroceryList"> | string
    name?: StringWithAggregatesFilter<"GroceryList"> | string
    kind?: StringWithAggregatesFilter<"GroceryList"> | string
    groupByAisle?: BoolWithAggregatesFilter<"GroceryList"> | boolean
    sortOrder?: IntWithAggregatesFilter<"GroceryList"> | number
    createdBy?: UuidNullableWithAggregatesFilter<"GroceryList"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GroceryList"> | Date | string
  }

  export type GroceryEntryWhereInput = {
    AND?: GroceryEntryWhereInput | GroceryEntryWhereInput[]
    OR?: GroceryEntryWhereInput[]
    NOT?: GroceryEntryWhereInput | GroceryEntryWhereInput[]
    id?: UuidFilter<"GroceryEntry"> | string
    normalizedName?: StringFilter<"GroceryEntry"> | string
    name?: StringFilter<"GroceryEntry"> | string
    lastAddedAt?: DateTimeFilter<"GroceryEntry"> | Date | string
  }

  export type GroceryEntryOrderByWithRelationInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    name?: SortOrder
    lastAddedAt?: SortOrder
  }

  export type GroceryEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    normalizedName?: string
    AND?: GroceryEntryWhereInput | GroceryEntryWhereInput[]
    OR?: GroceryEntryWhereInput[]
    NOT?: GroceryEntryWhereInput | GroceryEntryWhereInput[]
    name?: StringFilter<"GroceryEntry"> | string
    lastAddedAt?: DateTimeFilter<"GroceryEntry"> | Date | string
  }, "id" | "normalizedName">

  export type GroceryEntryOrderByWithAggregationInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    name?: SortOrder
    lastAddedAt?: SortOrder
    _count?: GroceryEntryCountOrderByAggregateInput
    _max?: GroceryEntryMaxOrderByAggregateInput
    _min?: GroceryEntryMinOrderByAggregateInput
  }

  export type GroceryEntryScalarWhereWithAggregatesInput = {
    AND?: GroceryEntryScalarWhereWithAggregatesInput | GroceryEntryScalarWhereWithAggregatesInput[]
    OR?: GroceryEntryScalarWhereWithAggregatesInput[]
    NOT?: GroceryEntryScalarWhereWithAggregatesInput | GroceryEntryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GroceryEntry"> | string
    normalizedName?: StringWithAggregatesFilter<"GroceryEntry"> | string
    name?: StringWithAggregatesFilter<"GroceryEntry"> | string
    lastAddedAt?: DateTimeWithAggregatesFilter<"GroceryEntry"> | Date | string
  }

  export type GroceryAisleOverrideWhereInput = {
    AND?: GroceryAisleOverrideWhereInput | GroceryAisleOverrideWhereInput[]
    OR?: GroceryAisleOverrideWhereInput[]
    NOT?: GroceryAisleOverrideWhereInput | GroceryAisleOverrideWhereInput[]
    id?: UuidFilter<"GroceryAisleOverride"> | string
    normalizedName?: StringFilter<"GroceryAisleOverride"> | string
    category?: StringFilter<"GroceryAisleOverride"> | string
    updatedAt?: DateTimeFilter<"GroceryAisleOverride"> | Date | string
  }

  export type GroceryAisleOverrideOrderByWithRelationInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    category?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroceryAisleOverrideWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    normalizedName?: string
    AND?: GroceryAisleOverrideWhereInput | GroceryAisleOverrideWhereInput[]
    OR?: GroceryAisleOverrideWhereInput[]
    NOT?: GroceryAisleOverrideWhereInput | GroceryAisleOverrideWhereInput[]
    category?: StringFilter<"GroceryAisleOverride"> | string
    updatedAt?: DateTimeFilter<"GroceryAisleOverride"> | Date | string
  }, "id" | "normalizedName">

  export type GroceryAisleOverrideOrderByWithAggregationInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    category?: SortOrder
    updatedAt?: SortOrder
    _count?: GroceryAisleOverrideCountOrderByAggregateInput
    _max?: GroceryAisleOverrideMaxOrderByAggregateInput
    _min?: GroceryAisleOverrideMinOrderByAggregateInput
  }

  export type GroceryAisleOverrideScalarWhereWithAggregatesInput = {
    AND?: GroceryAisleOverrideScalarWhereWithAggregatesInput | GroceryAisleOverrideScalarWhereWithAggregatesInput[]
    OR?: GroceryAisleOverrideScalarWhereWithAggregatesInput[]
    NOT?: GroceryAisleOverrideScalarWhereWithAggregatesInput | GroceryAisleOverrideScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GroceryAisleOverride"> | string
    normalizedName?: StringWithAggregatesFilter<"GroceryAisleOverride"> | string
    category?: StringWithAggregatesFilter<"GroceryAisleOverride"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"GroceryAisleOverride"> | Date | string
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
    mealId: string
    firedAt?: Date | string
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
    mealId?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    mealId?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DinnerNudgeLogUncheckedUpdateManyInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: StringFieldUpdateOperationsInput | string
    mealId?: StringFieldUpdateOperationsInput | string
    firedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryItemCreateInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
    list: GroceryListCreateNestedOneWithoutItemsInput
  }

  export type GroceryItemUncheckedCreateInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
    listId: string
  }

  export type GroceryItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    list?: GroceryListUpdateOneRequiredWithoutItemsNestedInput
  }

  export type GroceryItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listId?: StringFieldUpdateOperationsInput | string
  }

  export type GroceryItemCreateManyInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
    listId: string
  }

  export type GroceryItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroceryItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listId?: StringFieldUpdateOperationsInput | string
  }

  export type GroceryListCreateInput = {
    id?: string
    name: string
    kind: string
    groupByAisle?: boolean
    sortOrder?: number
    createdBy?: string | null
    createdAt?: Date | string
    items?: GroceryItemCreateNestedManyWithoutListInput
  }

  export type GroceryListUncheckedCreateInput = {
    id?: string
    name: string
    kind: string
    groupByAisle?: boolean
    sortOrder?: number
    createdBy?: string | null
    createdAt?: Date | string
    items?: GroceryItemUncheckedCreateNestedManyWithoutListInput
  }

  export type GroceryListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: GroceryItemUpdateManyWithoutListNestedInput
  }

  export type GroceryListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: GroceryItemUncheckedUpdateManyWithoutListNestedInput
  }

  export type GroceryListCreateManyInput = {
    id?: string
    name: string
    kind: string
    groupByAisle?: boolean
    sortOrder?: number
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type GroceryListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryEntryCreateInput = {
    id?: string
    normalizedName: string
    name: string
    lastAddedAt?: Date | string
  }

  export type GroceryEntryUncheckedCreateInput = {
    id?: string
    normalizedName: string
    name: string
    lastAddedAt?: Date | string
  }

  export type GroceryEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastAddedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastAddedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryEntryCreateManyInput = {
    id?: string
    normalizedName: string
    name: string
    lastAddedAt?: Date | string
  }

  export type GroceryEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastAddedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastAddedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryAisleOverrideCreateInput = {
    id?: string
    normalizedName: string
    category: string
    updatedAt?: Date | string
  }

  export type GroceryAisleOverrideUncheckedCreateInput = {
    id?: string
    normalizedName: string
    category: string
    updatedAt?: Date | string
  }

  export type GroceryAisleOverrideUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryAisleOverrideUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryAisleOverrideCreateManyInput = {
    id?: string
    normalizedName: string
    category: string
    updatedAt?: Date | string
  }

  export type GroceryAisleOverrideUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryAisleOverrideUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    normalizedName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
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

  export type GroceryListScalarRelationFilter = {
    is?: GroceryListWhereInput
    isNot?: GroceryListWhereInput
  }

  export type GroceryItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    gotBy?: SortOrder
    gotAt?: SortOrder
    listId?: SortOrder
  }

  export type GroceryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    gotBy?: SortOrder
    gotAt?: SortOrder
    listId?: SortOrder
  }

  export type GroceryItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    gotBy?: SortOrder
    gotAt?: SortOrder
    listId?: SortOrder
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

  export type GroceryItemListRelationFilter = {
    every?: GroceryItemWhereInput
    some?: GroceryItemWhereInput
    none?: GroceryItemWhereInput
  }

  export type GroceryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GroceryListCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    groupByAisle?: SortOrder
    sortOrder?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type GroceryListAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type GroceryListMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    groupByAisle?: SortOrder
    sortOrder?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type GroceryListMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    groupByAisle?: SortOrder
    sortOrder?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type GroceryListSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type GroceryEntryCountOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    name?: SortOrder
    lastAddedAt?: SortOrder
  }

  export type GroceryEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    name?: SortOrder
    lastAddedAt?: SortOrder
  }

  export type GroceryEntryMinOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    name?: SortOrder
    lastAddedAt?: SortOrder
  }

  export type GroceryAisleOverrideCountOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    category?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroceryAisleOverrideMaxOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    category?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroceryAisleOverrideMinOrderByAggregateInput = {
    id?: SortOrder
    normalizedName?: SortOrder
    category?: SortOrder
    updatedAt?: SortOrder
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

  export type GroceryListCreateNestedOneWithoutItemsInput = {
    create?: XOR<GroceryListCreateWithoutItemsInput, GroceryListUncheckedCreateWithoutItemsInput>
    connectOrCreate?: GroceryListCreateOrConnectWithoutItemsInput
    connect?: GroceryListWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type GroceryListUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<GroceryListCreateWithoutItemsInput, GroceryListUncheckedCreateWithoutItemsInput>
    connectOrCreate?: GroceryListCreateOrConnectWithoutItemsInput
    upsert?: GroceryListUpsertWithoutItemsInput
    connect?: GroceryListWhereUniqueInput
    update?: XOR<XOR<GroceryListUpdateToOneWithWhereWithoutItemsInput, GroceryListUpdateWithoutItemsInput>, GroceryListUncheckedUpdateWithoutItemsInput>
  }

  export type GroceryItemCreateNestedManyWithoutListInput = {
    create?: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput> | GroceryItemCreateWithoutListInput[] | GroceryItemUncheckedCreateWithoutListInput[]
    connectOrCreate?: GroceryItemCreateOrConnectWithoutListInput | GroceryItemCreateOrConnectWithoutListInput[]
    createMany?: GroceryItemCreateManyListInputEnvelope
    connect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
  }

  export type GroceryItemUncheckedCreateNestedManyWithoutListInput = {
    create?: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput> | GroceryItemCreateWithoutListInput[] | GroceryItemUncheckedCreateWithoutListInput[]
    connectOrCreate?: GroceryItemCreateOrConnectWithoutListInput | GroceryItemCreateOrConnectWithoutListInput[]
    createMany?: GroceryItemCreateManyListInputEnvelope
    connect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GroceryItemUpdateManyWithoutListNestedInput = {
    create?: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput> | GroceryItemCreateWithoutListInput[] | GroceryItemUncheckedCreateWithoutListInput[]
    connectOrCreate?: GroceryItemCreateOrConnectWithoutListInput | GroceryItemCreateOrConnectWithoutListInput[]
    upsert?: GroceryItemUpsertWithWhereUniqueWithoutListInput | GroceryItemUpsertWithWhereUniqueWithoutListInput[]
    createMany?: GroceryItemCreateManyListInputEnvelope
    set?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    disconnect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    delete?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    connect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    update?: GroceryItemUpdateWithWhereUniqueWithoutListInput | GroceryItemUpdateWithWhereUniqueWithoutListInput[]
    updateMany?: GroceryItemUpdateManyWithWhereWithoutListInput | GroceryItemUpdateManyWithWhereWithoutListInput[]
    deleteMany?: GroceryItemScalarWhereInput | GroceryItemScalarWhereInput[]
  }

  export type GroceryItemUncheckedUpdateManyWithoutListNestedInput = {
    create?: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput> | GroceryItemCreateWithoutListInput[] | GroceryItemUncheckedCreateWithoutListInput[]
    connectOrCreate?: GroceryItemCreateOrConnectWithoutListInput | GroceryItemCreateOrConnectWithoutListInput[]
    upsert?: GroceryItemUpsertWithWhereUniqueWithoutListInput | GroceryItemUpsertWithWhereUniqueWithoutListInput[]
    createMany?: GroceryItemCreateManyListInputEnvelope
    set?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    disconnect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    delete?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    connect?: GroceryItemWhereUniqueInput | GroceryItemWhereUniqueInput[]
    update?: GroceryItemUpdateWithWhereUniqueWithoutListInput | GroceryItemUpdateWithWhereUniqueWithoutListInput[]
    updateMany?: GroceryItemUpdateManyWithWhereWithoutListInput | GroceryItemUpdateManyWithWhereWithoutListInput[]
    deleteMany?: GroceryItemScalarWhereInput | GroceryItemScalarWhereInput[]
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

  export type GroceryListCreateWithoutItemsInput = {
    id?: string
    name: string
    kind: string
    groupByAisle?: boolean
    sortOrder?: number
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type GroceryListUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    kind: string
    groupByAisle?: boolean
    sortOrder?: number
    createdBy?: string | null
    createdAt?: Date | string
  }

  export type GroceryListCreateOrConnectWithoutItemsInput = {
    where: GroceryListWhereUniqueInput
    create: XOR<GroceryListCreateWithoutItemsInput, GroceryListUncheckedCreateWithoutItemsInput>
  }

  export type GroceryListUpsertWithoutItemsInput = {
    update: XOR<GroceryListUpdateWithoutItemsInput, GroceryListUncheckedUpdateWithoutItemsInput>
    create: XOR<GroceryListCreateWithoutItemsInput, GroceryListUncheckedCreateWithoutItemsInput>
    where?: GroceryListWhereInput
  }

  export type GroceryListUpdateToOneWithWhereWithoutItemsInput = {
    where?: GroceryListWhereInput
    data: XOR<GroceryListUpdateWithoutItemsInput, GroceryListUncheckedUpdateWithoutItemsInput>
  }

  export type GroceryListUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryListUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    groupByAisle?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroceryItemCreateWithoutListInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
  }

  export type GroceryItemUncheckedCreateWithoutListInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
  }

  export type GroceryItemCreateOrConnectWithoutListInput = {
    where: GroceryItemWhereUniqueInput
    create: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput>
  }

  export type GroceryItemCreateManyListInputEnvelope = {
    data: GroceryItemCreateManyListInput | GroceryItemCreateManyListInput[]
    skipDuplicates?: boolean
  }

  export type GroceryItemUpsertWithWhereUniqueWithoutListInput = {
    where: GroceryItemWhereUniqueInput
    update: XOR<GroceryItemUpdateWithoutListInput, GroceryItemUncheckedUpdateWithoutListInput>
    create: XOR<GroceryItemCreateWithoutListInput, GroceryItemUncheckedCreateWithoutListInput>
  }

  export type GroceryItemUpdateWithWhereUniqueWithoutListInput = {
    where: GroceryItemWhereUniqueInput
    data: XOR<GroceryItemUpdateWithoutListInput, GroceryItemUncheckedUpdateWithoutListInput>
  }

  export type GroceryItemUpdateManyWithWhereWithoutListInput = {
    where: GroceryItemScalarWhereInput
    data: XOR<GroceryItemUpdateManyMutationInput, GroceryItemUncheckedUpdateManyWithoutListInput>
  }

  export type GroceryItemScalarWhereInput = {
    AND?: GroceryItemScalarWhereInput | GroceryItemScalarWhereInput[]
    OR?: GroceryItemScalarWhereInput[]
    NOT?: GroceryItemScalarWhereInput | GroceryItemScalarWhereInput[]
    id?: UuidFilter<"GroceryItem"> | string
    name?: StringFilter<"GroceryItem"> | string
    category?: StringFilter<"GroceryItem"> | string
    quantity?: StringNullableFilter<"GroceryItem"> | string | null
    status?: StringFilter<"GroceryItem"> | string
    sourceType?: StringFilter<"GroceryItem"> | string
    sourceId?: StringNullableFilter<"GroceryItem"> | string | null
    addedBy?: UuidFilter<"GroceryItem"> | string
    addedAt?: DateTimeFilter<"GroceryItem"> | Date | string
    gotBy?: UuidNullableFilter<"GroceryItem"> | string | null
    gotAt?: DateTimeNullableFilter<"GroceryItem"> | Date | string | null
    listId?: UuidFilter<"GroceryItem"> | string
  }

  export type GroceryItemCreateManyListInput = {
    id?: string
    name: string
    category: string
    quantity?: string | null
    status?: string
    sourceType: string
    sourceId?: string | null
    addedBy: string
    addedAt?: Date | string
    gotBy?: string | null
    gotAt?: Date | string | null
  }

  export type GroceryItemUpdateWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroceryItemUncheckedUpdateWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GroceryItemUncheckedUpdateManyWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    addedBy?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gotBy?: NullableStringFieldUpdateOperationsInput | string | null
    gotAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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