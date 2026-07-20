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
 * Model Profile
 *
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model ProfileImage
 * The avatar photograph's bytes (ADR 042). Lives in Postgres rather than on disk so
 * that ADR 009's "backup and restore is a single operation" still holds — a household
 * is ≤ ~8 profiles × ~40KB, so the usual blobs-in-a-database objection doesn't apply.
 * `Profile.avatarUrl` holds `/api/profiles/:id/avatar?v={hash}`; the hash busts the
 * immutable cache when the photo changes.
 */
export type ProfileImage = $Result.DefaultSelection<Prisma.$ProfileImagePayload>
/**
 * Model PushSubscription
 *
 */
export type PushSubscription = $Result.DefaultSelection<Prisma.$PushSubscriptionPayload>
/**
 * Model Notification
 *
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model WidgetLayout
 *
 */
export type WidgetLayout = $Result.DefaultSelection<Prisma.$WidgetLayoutPayload>
/**
 * Model PermissionOverride
 *
 */
export type PermissionOverride = $Result.DefaultSelection<Prisma.$PermissionOverridePayload>
/**
 * Model SystemConfig
 *
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
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
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
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
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.profileImage`: Exposes CRUD operations for the **ProfileImage** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProfileImages
   * const profileImages = await prisma.profileImage.findMany()
   * ```
   */
  get profileImage(): Prisma.ProfileImageDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.pushSubscription`: Exposes CRUD operations for the **PushSubscription** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PushSubscriptions
   * const pushSubscriptions = await prisma.pushSubscription.findMany()
   * ```
   */
  get pushSubscription(): Prisma.PushSubscriptionDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Notifications
   * const notifications = await prisma.notification.findMany()
   * ```
   */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.widgetLayout`: Exposes CRUD operations for the **WidgetLayout** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more WidgetLayouts
   * const widgetLayouts = await prisma.widgetLayout.findMany()
   * ```
   */
  get widgetLayout(): Prisma.WidgetLayoutDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.permissionOverride`: Exposes CRUD operations for the **PermissionOverride** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PermissionOverrides
   * const permissionOverrides = await prisma.permissionOverride.findMany()
   * ```
   */
  get permissionOverride(): Prisma.PermissionOverrideDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SystemConfigs
   * const systemConfigs = await prisma.systemConfig.findMany()
   * ```
   */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>
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
    Profile: 'Profile'
    ProfileImage: 'ProfileImage'
    PushSubscription: 'PushSubscription'
    Notification: 'Notification'
    WidgetLayout: 'WidgetLayout'
    PermissionOverride: 'PermissionOverride'
    SystemConfig: 'SystemConfig'
    Session: 'Session'
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
      modelProps:
        | 'profile'
        | 'profileImage'
        | 'pushSubscription'
        | 'notification'
        | 'widgetLayout'
        | 'permissionOverride'
        | 'systemConfig'
        | 'session'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      ProfileImage: {
        payload: Prisma.$ProfileImagePayload<ExtArgs>
        fields: Prisma.ProfileImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          findFirst: {
            args: Prisma.ProfileImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          findMany: {
            args: Prisma.ProfileImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>[]
          }
          create: {
            args: Prisma.ProfileImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          createMany: {
            args: Prisma.ProfileImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>[]
          }
          delete: {
            args: Prisma.ProfileImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          update: {
            args: Prisma.ProfileImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          deleteMany: {
            args: Prisma.ProfileImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>[]
          }
          upsert: {
            args: Prisma.ProfileImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileImagePayload>
          }
          aggregate: {
            args: Prisma.ProfileImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileImage>
          }
          groupBy: {
            args: Prisma.ProfileImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileImageCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileImageCountAggregateOutputType> | number
          }
        }
      }
      PushSubscription: {
        payload: Prisma.$PushSubscriptionPayload<ExtArgs>
        fields: Prisma.PushSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PushSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.PushSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PushSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findMany: {
            args: Prisma.PushSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          create: {
            args: Prisma.PushSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          createMany: {
            args: Prisma.PushSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PushSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.PushSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          update: {
            args: Prisma.PushSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.PushSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PushSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PushSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.PushSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.PushSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePushSubscription>
          }
          groupBy: {
            args: Prisma.PushSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PushSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PushSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<PushSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      WidgetLayout: {
        payload: Prisma.$WidgetLayoutPayload<ExtArgs>
        fields: Prisma.WidgetLayoutFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WidgetLayoutFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WidgetLayoutFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          findFirst: {
            args: Prisma.WidgetLayoutFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WidgetLayoutFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          findMany: {
            args: Prisma.WidgetLayoutFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>[]
          }
          create: {
            args: Prisma.WidgetLayoutCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          createMany: {
            args: Prisma.WidgetLayoutCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WidgetLayoutCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>[]
          }
          delete: {
            args: Prisma.WidgetLayoutDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          update: {
            args: Prisma.WidgetLayoutUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          deleteMany: {
            args: Prisma.WidgetLayoutDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WidgetLayoutUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WidgetLayoutUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>[]
          }
          upsert: {
            args: Prisma.WidgetLayoutUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetLayoutPayload>
          }
          aggregate: {
            args: Prisma.WidgetLayoutAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWidgetLayout>
          }
          groupBy: {
            args: Prisma.WidgetLayoutGroupByArgs<ExtArgs>
            result: $Utils.Optional<WidgetLayoutGroupByOutputType>[]
          }
          count: {
            args: Prisma.WidgetLayoutCountArgs<ExtArgs>
            result: $Utils.Optional<WidgetLayoutCountAggregateOutputType> | number
          }
        }
      }
      PermissionOverride: {
        payload: Prisma.$PermissionOverridePayload<ExtArgs>
        fields: Prisma.PermissionOverrideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionOverrideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionOverrideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          findFirst: {
            args: Prisma.PermissionOverrideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionOverrideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          findMany: {
            args: Prisma.PermissionOverrideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>[]
          }
          create: {
            args: Prisma.PermissionOverrideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          createMany: {
            args: Prisma.PermissionOverrideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionOverrideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>[]
          }
          delete: {
            args: Prisma.PermissionOverrideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          update: {
            args: Prisma.PermissionOverrideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          deleteMany: {
            args: Prisma.PermissionOverrideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionOverrideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionOverrideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>[]
          }
          upsert: {
            args: Prisma.PermissionOverrideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionOverridePayload>
          }
          aggregate: {
            args: Prisma.PermissionOverrideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermissionOverride>
          }
          groupBy: {
            args: Prisma.PermissionOverrideGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionOverrideGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionOverrideCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionOverrideCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
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
    profile?: ProfileOmit
    profileImage?: ProfileImageOmit
    pushSubscription?: PushSubscriptionOmit
    notification?: NotificationOmit
    widgetLayout?: WidgetLayoutOmit
    permissionOverride?: PermissionOverrideOmit
    systemConfig?: SystemConfigOmit
    session?: SessionOmit
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
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    permissionOverrides: number
    grantedOverrides: number
    systemConfigs: number
    widgetLayouts: number
    notifications: number
    pushSubscriptions: number
  }

  export type ProfileCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    permissionOverrides?: boolean | ProfileCountOutputTypeCountPermissionOverridesArgs
    grantedOverrides?: boolean | ProfileCountOutputTypeCountGrantedOverridesArgs
    systemConfigs?: boolean | ProfileCountOutputTypeCountSystemConfigsArgs
    widgetLayouts?: boolean | ProfileCountOutputTypeCountWidgetLayoutsArgs
    notifications?: boolean | ProfileCountOutputTypeCountNotificationsArgs
    pushSubscriptions?: boolean | ProfileCountOutputTypeCountPushSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountPermissionOverridesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PermissionOverrideWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountGrantedOverridesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PermissionOverrideWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountSystemConfigsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SystemConfigWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountWidgetLayoutsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WidgetLayoutWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountNotificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountPushSubscriptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PushSubscriptionWhereInput
  }

  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    tier: number | null
  }

  export type ProfileSumAggregateOutputType = {
    tier: number | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    tier: number | null
    identityHue: string | null
    avatarUrl: string | null
    darkMode: boolean | null
    focusMode: boolean | null
    pushEnabled: boolean | null
    createdAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    tier: number | null
    identityHue: string | null
    avatarUrl: string | null
    darkMode: boolean | null
    focusMode: boolean | null
    pushEnabled: boolean | null
    createdAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    name: number
    tier: number
    identityHue: number
    avatarUrl: number
    darkMode: number
    focusMode: number
    pushEnabled: number
    createdAt: number
    _all: number
  }

  export type ProfileAvgAggregateInputType = {
    tier?: true
  }

  export type ProfileSumAggregateInputType = {
    tier?: true
  }

  export type ProfileMinAggregateInputType = {
    id?: true
    name?: true
    tier?: true
    identityHue?: true
    avatarUrl?: true
    darkMode?: true
    focusMode?: true
    pushEnabled?: true
    createdAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    name?: true
    tier?: true
    identityHue?: true
    avatarUrl?: true
    darkMode?: true
    focusMode?: true
    pushEnabled?: true
    createdAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    name?: true
    tier?: true
    identityHue?: true
    avatarUrl?: true
    darkMode?: true
    focusMode?: true
    pushEnabled?: true
    createdAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Profiles
     **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }

  export type ProfileGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    name: string
    tier: number
    identityHue: string | null
    avatarUrl: string | null
    darkMode: boolean | null
    focusMode: boolean | null
    pushEnabled: boolean
    createdAt: Date
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProfileGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
          : GetScalarType<T[P], ProfileGroupByOutputType[P]>
      }
    >
  >

  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        name?: boolean
        tier?: boolean
        identityHue?: boolean
        avatarUrl?: boolean
        darkMode?: boolean
        focusMode?: boolean
        pushEnabled?: boolean
        createdAt?: boolean
        permissionOverrides?: boolean | Profile$permissionOverridesArgs<ExtArgs>
        grantedOverrides?: boolean | Profile$grantedOverridesArgs<ExtArgs>
        systemConfigs?: boolean | Profile$systemConfigsArgs<ExtArgs>
        widgetLayouts?: boolean | Profile$widgetLayoutsArgs<ExtArgs>
        notifications?: boolean | Profile$notificationsArgs<ExtArgs>
        pushSubscriptions?: boolean | Profile$pushSubscriptionsArgs<ExtArgs>
        image?: boolean | Profile$imageArgs<ExtArgs>
        _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['profile']
    >

  export type ProfileSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      name?: boolean
      tier?: boolean
      identityHue?: boolean
      avatarUrl?: boolean
      darkMode?: boolean
      focusMode?: boolean
      pushEnabled?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['profile']
  >

  export type ProfileSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      name?: boolean
      tier?: boolean
      identityHue?: boolean
      avatarUrl?: boolean
      darkMode?: boolean
      focusMode?: boolean
      pushEnabled?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['profile']
  >

  export type ProfileSelectScalar = {
    id?: boolean
    name?: boolean
    tier?: boolean
    identityHue?: boolean
    avatarUrl?: boolean
    darkMode?: boolean
    focusMode?: boolean
    pushEnabled?: boolean
    createdAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'name'
      | 'tier'
      | 'identityHue'
      | 'avatarUrl'
      | 'darkMode'
      | 'focusMode'
      | 'pushEnabled'
      | 'createdAt',
      ExtArgs['result']['profile']
    >
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissionOverrides?: boolean | Profile$permissionOverridesArgs<ExtArgs>
    grantedOverrides?: boolean | Profile$grantedOverridesArgs<ExtArgs>
    systemConfigs?: boolean | Profile$systemConfigsArgs<ExtArgs>
    widgetLayouts?: boolean | Profile$widgetLayoutsArgs<ExtArgs>
    notifications?: boolean | Profile$notificationsArgs<ExtArgs>
    pushSubscriptions?: boolean | Profile$pushSubscriptionsArgs<ExtArgs>
    image?: boolean | Profile$imageArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}
  export type ProfileIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Profile'
      objects: {
        permissionOverrides: Prisma.$PermissionOverridePayload<ExtArgs>[]
        grantedOverrides: Prisma.$PermissionOverridePayload<ExtArgs>[]
        systemConfigs: Prisma.$SystemConfigPayload<ExtArgs>[]
        widgetLayouts: Prisma.$WidgetLayoutPayload<ExtArgs>[]
        notifications: Prisma.$NotificationPayload<ExtArgs>[]
        pushSubscriptions: Prisma.$PushSubscriptionPayload<ExtArgs>[]
        image: Prisma.$ProfileImagePayload<ExtArgs> | null
      }
      scalars: $Extensions.GetPayloadResult<
        {
          id: string
          name: string
          tier: number
          identityHue: string | null
          avatarUrl: string | null
          darkMode: boolean | null
          focusMode: boolean | null
          pushEnabled: boolean
          createdAt: Date
        },
        ExtArgs['result']['profile']
      >
      composites: {}
    }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> =
    $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    ProfileFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: ProfileCountAggregateInputType | true
  }

  export interface ProfileDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile']; meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(
      args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(
      args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     *
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProfileFindManyArgs>(
      args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     *
     */
    create<T extends ProfileCreateArgs>(
      args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProfileCreateManyArgs>(
      args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     *
     */
    delete<T extends ProfileDeleteArgs>(
      args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProfileUpdateArgs>(
      args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProfileDeleteManyArgs>(
      args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProfileUpdateManyArgs>(
      args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(
      args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
     **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileAggregateArgs>(
      args: Subset<T, ProfileAggregateArgs>
    ): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
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
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Profile model
     */
    readonly fields: ProfileFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    permissionOverrides<T extends Profile$permissionOverridesArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$permissionOverridesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PermissionOverridePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >
    grantedOverrides<T extends Profile$grantedOverridesArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$grantedOverridesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PermissionOverridePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >
    systemConfigs<T extends Profile$systemConfigsArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$systemConfigsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    widgetLayouts<T extends Profile$widgetLayoutsArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$widgetLayoutsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    notifications<T extends Profile$notificationsArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$notificationsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    pushSubscriptions<T extends Profile$pushSubscriptionsArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$pushSubscriptionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PushSubscriptionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >
    image<T extends Profile$imageArgs<ExtArgs> = {}>(
      args?: Subset<T, Profile$imageArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
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
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<'Profile', 'String'>
    readonly name: FieldRef<'Profile', 'String'>
    readonly tier: FieldRef<'Profile', 'Int'>
    readonly identityHue: FieldRef<'Profile', 'String'>
    readonly avatarUrl: FieldRef<'Profile', 'String'>
    readonly darkMode: FieldRef<'Profile', 'Boolean'>
    readonly focusMode: FieldRef<'Profile', 'Boolean'>
    readonly pushEnabled: FieldRef<'Profile', 'Boolean'>
    readonly createdAt: FieldRef<'Profile', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.permissionOverrides
   */
  export type Profile$permissionOverridesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    where?: PermissionOverrideWhereInput
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    cursor?: PermissionOverrideWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PermissionOverrideScalarFieldEnum | PermissionOverrideScalarFieldEnum[]
  }

  /**
   * Profile.grantedOverrides
   */
  export type Profile$grantedOverridesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    where?: PermissionOverrideWhereInput
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    cursor?: PermissionOverrideWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PermissionOverrideScalarFieldEnum | PermissionOverrideScalarFieldEnum[]
  }

  /**
   * Profile.systemConfigs
   */
  export type Profile$systemConfigsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    cursor?: SystemConfigWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * Profile.widgetLayouts
   */
  export type Profile$widgetLayoutsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    where?: WidgetLayoutWhereInput
    orderBy?: WidgetLayoutOrderByWithRelationInput | WidgetLayoutOrderByWithRelationInput[]
    cursor?: WidgetLayoutWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WidgetLayoutScalarFieldEnum | WidgetLayoutScalarFieldEnum[]
  }

  /**
   * Profile.notifications
   */
  export type Profile$notificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Profile.pushSubscriptions
   */
  export type Profile$pushSubscriptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    where?: PushSubscriptionWhereInput
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    cursor?: PushSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * Profile.image
   */
  export type Profile$imageArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    where?: ProfileImageWhereInput
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }

  /**
   * Model ProfileImage
   */

  export type AggregateProfileImage = {
    _count: ProfileImageCountAggregateOutputType | null
    _min: ProfileImageMinAggregateOutputType | null
    _max: ProfileImageMaxAggregateOutputType | null
  }

  export type ProfileImageMinAggregateOutputType = {
    profileId: string | null
    bytes: Bytes | null
    mimeType: string | null
    hash: string | null
    updatedAt: Date | null
  }

  export type ProfileImageMaxAggregateOutputType = {
    profileId: string | null
    bytes: Bytes | null
    mimeType: string | null
    hash: string | null
    updatedAt: Date | null
  }

  export type ProfileImageCountAggregateOutputType = {
    profileId: number
    bytes: number
    mimeType: number
    hash: number
    updatedAt: number
    _all: number
  }

  export type ProfileImageMinAggregateInputType = {
    profileId?: true
    bytes?: true
    mimeType?: true
    hash?: true
    updatedAt?: true
  }

  export type ProfileImageMaxAggregateInputType = {
    profileId?: true
    bytes?: true
    mimeType?: true
    hash?: true
    updatedAt?: true
  }

  export type ProfileImageCountAggregateInputType = {
    profileId?: true
    bytes?: true
    mimeType?: true
    hash?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileImageAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProfileImage to aggregate.
     */
    where?: ProfileImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProfileImages to fetch.
     */
    orderBy?: ProfileImageOrderByWithRelationInput | ProfileImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProfileImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProfileImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProfileImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProfileImages
     **/
    _count?: true | ProfileImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProfileImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProfileImageMaxAggregateInputType
  }

  export type GetProfileImageAggregateType<T extends ProfileImageAggregateArgs> = {
    [P in keyof T & keyof AggregateProfileImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileImage[P]>
      : GetScalarType<T[P], AggregateProfileImage[P]>
  }

  export type ProfileImageGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProfileImageWhereInput
    orderBy?: ProfileImageOrderByWithAggregationInput | ProfileImageOrderByWithAggregationInput[]
    by: ProfileImageScalarFieldEnum[] | ProfileImageScalarFieldEnum
    having?: ProfileImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileImageCountAggregateInputType | true
    _min?: ProfileImageMinAggregateInputType
    _max?: ProfileImageMaxAggregateInputType
  }

  export type ProfileImageGroupByOutputType = {
    profileId: string
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt: Date
    _count: ProfileImageCountAggregateOutputType | null
    _min: ProfileImageMinAggregateOutputType | null
    _max: ProfileImageMaxAggregateOutputType | null
  }

  type GetProfileImageGroupByPayload<T extends ProfileImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileImageGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProfileImageGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProfileImageGroupByOutputType[P]>
          : GetScalarType<T[P], ProfileImageGroupByOutputType[P]>
      }
    >
  >

  export type ProfileImageSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      profileId?: boolean
      bytes?: boolean
      mimeType?: boolean
      hash?: boolean
      updatedAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['profileImage']
  >

  export type ProfileImageSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      profileId?: boolean
      bytes?: boolean
      mimeType?: boolean
      hash?: boolean
      updatedAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['profileImage']
  >

  export type ProfileImageSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      profileId?: boolean
      bytes?: boolean
      mimeType?: boolean
      hash?: boolean
      updatedAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['profileImage']
  >

  export type ProfileImageSelectScalar = {
    profileId?: boolean
    bytes?: boolean
    mimeType?: boolean
    hash?: boolean
    updatedAt?: boolean
  }

  export type ProfileImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'profileId' | 'bytes' | 'mimeType' | 'hash' | 'updatedAt',
      ExtArgs['result']['profileImage']
    >
  export type ProfileImageInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ProfileImageIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ProfileImageIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $ProfileImagePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProfileImage'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        profileId: string
        bytes: Prisma.Bytes
        mimeType: string
        hash: string
        updatedAt: Date
      },
      ExtArgs['result']['profileImage']
    >
    composites: {}
  }

  type ProfileImageGetPayload<S extends boolean | null | undefined | ProfileImageDefaultArgs> =
    $Result.GetResult<Prisma.$ProfileImagePayload, S>

  type ProfileImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileImageCountAggregateInputType | true
    }

  export interface ProfileImageDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProfileImage']
      meta: { name: 'ProfileImage' }
    }
    /**
     * Find zero or one ProfileImage that matches the filter.
     * @param {ProfileImageFindUniqueArgs} args - Arguments to find a ProfileImage
     * @example
     * // Get one ProfileImage
     * const profileImage = await prisma.profileImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileImageFindUniqueArgs>(
      args: SelectSubset<T, ProfileImageFindUniqueArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProfileImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileImageFindUniqueOrThrowArgs} args - Arguments to find a ProfileImage
     * @example
     * // Get one ProfileImage
     * const profileImage = await prisma.profileImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileImageFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProfileImageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProfileImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageFindFirstArgs} args - Arguments to find a ProfileImage
     * @example
     * // Get one ProfileImage
     * const profileImage = await prisma.profileImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileImageFindFirstArgs>(
      args?: SelectSubset<T, ProfileImageFindFirstArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProfileImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageFindFirstOrThrowArgs} args - Arguments to find a ProfileImage
     * @example
     * // Get one ProfileImage
     * const profileImage = await prisma.profileImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileImageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProfileImageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProfileImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileImages
     * const profileImages = await prisma.profileImage.findMany()
     *
     * // Get first 10 ProfileImages
     * const profileImages = await prisma.profileImage.findMany({ take: 10 })
     *
     * // Only select the `profileId`
     * const profileImageWithProfileIdOnly = await prisma.profileImage.findMany({ select: { profileId: true } })
     *
     */
    findMany<T extends ProfileImageFindManyArgs>(
      args?: SelectSubset<T, ProfileImageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProfileImagePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProfileImage.
     * @param {ProfileImageCreateArgs} args - Arguments to create a ProfileImage.
     * @example
     * // Create one ProfileImage
     * const ProfileImage = await prisma.profileImage.create({
     *   data: {
     *     // ... data to create a ProfileImage
     *   }
     * })
     *
     */
    create<T extends ProfileImageCreateArgs>(
      args: SelectSubset<T, ProfileImageCreateArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<Prisma.$ProfileImagePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProfileImages.
     * @param {ProfileImageCreateManyArgs} args - Arguments to create many ProfileImages.
     * @example
     * // Create many ProfileImages
     * const profileImage = await prisma.profileImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProfileImageCreateManyArgs>(
      args?: SelectSubset<T, ProfileImageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileImages and returns the data saved in the database.
     * @param {ProfileImageCreateManyAndReturnArgs} args - Arguments to create many ProfileImages.
     * @example
     * // Create many ProfileImages
     * const profileImage = await prisma.profileImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProfileImages and only return the `profileId`
     * const profileImageWithProfileIdOnly = await prisma.profileImage.createManyAndReturn({
     *   select: { profileId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProfileImageCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProfileImageCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProfileImage.
     * @param {ProfileImageDeleteArgs} args - Arguments to delete one ProfileImage.
     * @example
     * // Delete one ProfileImage
     * const ProfileImage = await prisma.profileImage.delete({
     *   where: {
     *     // ... filter to delete one ProfileImage
     *   }
     * })
     *
     */
    delete<T extends ProfileImageDeleteArgs>(
      args: SelectSubset<T, ProfileImageDeleteArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<Prisma.$ProfileImagePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProfileImage.
     * @param {ProfileImageUpdateArgs} args - Arguments to update one ProfileImage.
     * @example
     * // Update one ProfileImage
     * const profileImage = await prisma.profileImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProfileImageUpdateArgs>(
      args: SelectSubset<T, ProfileImageUpdateArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<Prisma.$ProfileImagePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProfileImages.
     * @param {ProfileImageDeleteManyArgs} args - Arguments to filter ProfileImages to delete.
     * @example
     * // Delete a few ProfileImages
     * const { count } = await prisma.profileImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProfileImageDeleteManyArgs>(
      args?: SelectSubset<T, ProfileImageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileImages
     * const profileImage = await prisma.profileImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProfileImageUpdateManyArgs>(
      args: SelectSubset<T, ProfileImageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileImages and returns the data updated in the database.
     * @param {ProfileImageUpdateManyAndReturnArgs} args - Arguments to update many ProfileImages.
     * @example
     * // Update many ProfileImages
     * const profileImage = await prisma.profileImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProfileImages and only return the `profileId`
     * const profileImageWithProfileIdOnly = await prisma.profileImage.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProfileImageUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProfileImageUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfileImagePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProfileImage.
     * @param {ProfileImageUpsertArgs} args - Arguments to update or create a ProfileImage.
     * @example
     * // Update or create a ProfileImage
     * const profileImage = await prisma.profileImage.upsert({
     *   create: {
     *     // ... data to create a ProfileImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileImage we want to update
     *   }
     * })
     */
    upsert<T extends ProfileImageUpsertArgs>(
      args: SelectSubset<T, ProfileImageUpsertArgs<ExtArgs>>
    ): Prisma__ProfileImageClient<
      $Result.GetResult<Prisma.$ProfileImagePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProfileImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageCountArgs} args - Arguments to filter ProfileImages to count.
     * @example
     * // Count the number of ProfileImages
     * const count = await prisma.profileImage.count({
     *   where: {
     *     // ... the filter for the ProfileImages we want to count
     *   }
     * })
     **/
    count<T extends ProfileImageCountArgs>(
      args?: Subset<T, ProfileImageCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileImageAggregateArgs>(
      args: Subset<T, ProfileImageAggregateArgs>
    ): Prisma.PrismaPromise<GetProfileImageAggregateType<T>>

    /**
     * Group by ProfileImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileImageGroupByArgs} args - Group by arguments.
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
      T extends ProfileImageGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileImageGroupByArgs['orderBy'] }
        : { orderBy?: ProfileImageGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, ProfileImageGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProfileImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProfileImage model
     */
    readonly fields: ProfileImageFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileImageClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProfileDefaultArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      | $Result.GetResult<
          Prisma.$ProfilePayload<ExtArgs>,
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
   * Fields of the ProfileImage model
   */
  interface ProfileImageFieldRefs {
    readonly profileId: FieldRef<'ProfileImage', 'String'>
    readonly bytes: FieldRef<'ProfileImage', 'Bytes'>
    readonly mimeType: FieldRef<'ProfileImage', 'String'>
    readonly hash: FieldRef<'ProfileImage', 'String'>
    readonly updatedAt: FieldRef<'ProfileImage', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * ProfileImage findUnique
   */
  export type ProfileImageFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter, which ProfileImage to fetch.
     */
    where: ProfileImageWhereUniqueInput
  }

  /**
   * ProfileImage findUniqueOrThrow
   */
  export type ProfileImageFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter, which ProfileImage to fetch.
     */
    where: ProfileImageWhereUniqueInput
  }

  /**
   * ProfileImage findFirst
   */
  export type ProfileImageFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter, which ProfileImage to fetch.
     */
    where?: ProfileImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProfileImages to fetch.
     */
    orderBy?: ProfileImageOrderByWithRelationInput | ProfileImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProfileImages.
     */
    cursor?: ProfileImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProfileImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProfileImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProfileImages.
     */
    distinct?: ProfileImageScalarFieldEnum | ProfileImageScalarFieldEnum[]
  }

  /**
   * ProfileImage findFirstOrThrow
   */
  export type ProfileImageFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter, which ProfileImage to fetch.
     */
    where?: ProfileImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProfileImages to fetch.
     */
    orderBy?: ProfileImageOrderByWithRelationInput | ProfileImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProfileImages.
     */
    cursor?: ProfileImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProfileImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProfileImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProfileImages.
     */
    distinct?: ProfileImageScalarFieldEnum | ProfileImageScalarFieldEnum[]
  }

  /**
   * ProfileImage findMany
   */
  export type ProfileImageFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter, which ProfileImages to fetch.
     */
    where?: ProfileImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProfileImages to fetch.
     */
    orderBy?: ProfileImageOrderByWithRelationInput | ProfileImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProfileImages.
     */
    cursor?: ProfileImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProfileImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProfileImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProfileImages.
     */
    distinct?: ProfileImageScalarFieldEnum | ProfileImageScalarFieldEnum[]
  }

  /**
   * ProfileImage create
   */
  export type ProfileImageCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileImage.
     */
    data: XOR<ProfileImageCreateInput, ProfileImageUncheckedCreateInput>
  }

  /**
   * ProfileImage createMany
   */
  export type ProfileImageCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProfileImages.
     */
    data: ProfileImageCreateManyInput | ProfileImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileImage createManyAndReturn
   */
  export type ProfileImageCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * The data used to create many ProfileImages.
     */
    data: ProfileImageCreateManyInput | ProfileImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileImage update
   */
  export type ProfileImageUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileImage.
     */
    data: XOR<ProfileImageUpdateInput, ProfileImageUncheckedUpdateInput>
    /**
     * Choose, which ProfileImage to update.
     */
    where: ProfileImageWhereUniqueInput
  }

  /**
   * ProfileImage updateMany
   */
  export type ProfileImageUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProfileImages.
     */
    data: XOR<ProfileImageUpdateManyMutationInput, ProfileImageUncheckedUpdateManyInput>
    /**
     * Filter which ProfileImages to update
     */
    where?: ProfileImageWhereInput
    /**
     * Limit how many ProfileImages to update.
     */
    limit?: number
  }

  /**
   * ProfileImage updateManyAndReturn
   */
  export type ProfileImageUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * The data used to update ProfileImages.
     */
    data: XOR<ProfileImageUpdateManyMutationInput, ProfileImageUncheckedUpdateManyInput>
    /**
     * Filter which ProfileImages to update
     */
    where?: ProfileImageWhereInput
    /**
     * Limit how many ProfileImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileImage upsert
   */
  export type ProfileImageUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileImage to update in case it exists.
     */
    where: ProfileImageWhereUniqueInput
    /**
     * In case the ProfileImage found by the `where` argument doesn't exist, create a new ProfileImage with this data.
     */
    create: XOR<ProfileImageCreateInput, ProfileImageUncheckedCreateInput>
    /**
     * In case the ProfileImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileImageUpdateInput, ProfileImageUncheckedUpdateInput>
  }

  /**
   * ProfileImage delete
   */
  export type ProfileImageDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
    /**
     * Filter which ProfileImage to delete.
     */
    where: ProfileImageWhereUniqueInput
  }

  /**
   * ProfileImage deleteMany
   */
  export type ProfileImageDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProfileImages to delete
     */
    where?: ProfileImageWhereInput
    /**
     * Limit how many ProfileImages to delete.
     */
    limit?: number
  }

  /**
   * ProfileImage without action
   */
  export type ProfileImageDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProfileImage
     */
    select?: ProfileImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfileImage
     */
    omit?: ProfileImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileImageInclude<ExtArgs> | null
  }

  /**
   * Model PushSubscription
   */

  export type AggregatePushSubscription = {
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  export type PushSubscriptionMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    endpoint: string | null
    p256dhKey: string | null
    authKey: string | null
    createdAt: Date | null
  }

  export type PushSubscriptionMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    endpoint: string | null
    p256dhKey: string | null
    authKey: string | null
    createdAt: Date | null
  }

  export type PushSubscriptionCountAggregateOutputType = {
    id: number
    profileId: number
    endpoint: number
    p256dhKey: number
    authKey: number
    createdAt: number
    _all: number
  }

  export type PushSubscriptionMinAggregateInputType = {
    id?: true
    profileId?: true
    endpoint?: true
    p256dhKey?: true
    authKey?: true
    createdAt?: true
  }

  export type PushSubscriptionMaxAggregateInputType = {
    id?: true
    profileId?: true
    endpoint?: true
    p256dhKey?: true
    authKey?: true
    createdAt?: true
  }

  export type PushSubscriptionCountAggregateInputType = {
    id?: true
    profileId?: true
    endpoint?: true
    p256dhKey?: true
    authKey?: true
    createdAt?: true
    _all?: true
  }

  export type PushSubscriptionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PushSubscription to aggregate.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PushSubscriptions
     **/
    _count?: true | PushSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PushSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type GetPushSubscriptionAggregateType<T extends PushSubscriptionAggregateArgs> = {
    [P in keyof T & keyof AggregatePushSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePushSubscription[P]>
      : GetScalarType<T[P], AggregatePushSubscription[P]>
  }

  export type PushSubscriptionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PushSubscriptionWhereInput
    orderBy?:
      | PushSubscriptionOrderByWithAggregationInput
      | PushSubscriptionOrderByWithAggregationInput[]
    by: PushSubscriptionScalarFieldEnum[] | PushSubscriptionScalarFieldEnum
    having?: PushSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PushSubscriptionCountAggregateInputType | true
    _min?: PushSubscriptionMinAggregateInputType
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type PushSubscriptionGroupByOutputType = {
    id: string
    profileId: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt: Date
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  type GetPushSubscriptionGroupByPayload<T extends PushSubscriptionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PushSubscriptionGroupByOutputType, T['by']> & {
          [P in keyof T & keyof PushSubscriptionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
        }
      >
    >

  export type PushSubscriptionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      endpoint?: boolean
      p256dhKey?: boolean
      authKey?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['pushSubscription']
  >

  export type PushSubscriptionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      endpoint?: boolean
      p256dhKey?: boolean
      authKey?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['pushSubscription']
  >

  export type PushSubscriptionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      endpoint?: boolean
      p256dhKey?: boolean
      authKey?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['pushSubscription']
  >

  export type PushSubscriptionSelectScalar = {
    id?: boolean
    profileId?: boolean
    endpoint?: boolean
    p256dhKey?: boolean
    authKey?: boolean
    createdAt?: boolean
  }

  export type PushSubscriptionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'profileId' | 'endpoint' | 'p256dhKey' | 'authKey' | 'createdAt',
    ExtArgs['result']['pushSubscription']
  >
  export type PushSubscriptionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type PushSubscriptionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type PushSubscriptionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $PushSubscriptionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PushSubscription'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        profileId: string
        endpoint: string
        p256dhKey: string
        authKey: string
        createdAt: Date
      },
      ExtArgs['result']['pushSubscription']
    >
    composites: {}
  }

  type PushSubscriptionGetPayload<
    S extends boolean | null | undefined | PushSubscriptionDefaultArgs,
  > = $Result.GetResult<Prisma.$PushSubscriptionPayload, S>

  type PushSubscriptionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PushSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PushSubscriptionCountAggregateInputType | true
  }

  export interface PushSubscriptionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PushSubscription']
      meta: { name: 'PushSubscription' }
    }
    /**
     * Find zero or one PushSubscription that matches the filter.
     * @param {PushSubscriptionFindUniqueArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PushSubscriptionFindUniqueArgs>(
      args: SelectSubset<T, PushSubscriptionFindUniqueArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one PushSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PushSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PushSubscriptionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first PushSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PushSubscriptionFindFirstArgs>(
      args?: SelectSubset<T, PushSubscriptionFindFirstArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first PushSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PushSubscriptionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PushSubscriptionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more PushSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany()
     *
     * // Get first 10 PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PushSubscriptionFindManyArgs>(
      args?: SelectSubset<T, PushSubscriptionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a PushSubscription.
     * @param {PushSubscriptionCreateArgs} args - Arguments to create a PushSubscription.
     * @example
     * // Create one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.create({
     *   data: {
     *     // ... data to create a PushSubscription
     *   }
     * })
     *
     */
    create<T extends PushSubscriptionCreateArgs>(
      args: SelectSubset<T, PushSubscriptionCreateArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many PushSubscriptions.
     * @param {PushSubscriptionCreateManyArgs} args - Arguments to create many PushSubscriptions.
     * @example
     * // Create many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PushSubscriptionCreateManyArgs>(
      args?: SelectSubset<T, PushSubscriptionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PushSubscriptions and returns the data saved in the database.
     * @param {PushSubscriptionCreateManyAndReturnArgs} args - Arguments to create many PushSubscriptions.
     * @example
     * // Create many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PushSubscriptions and only return the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PushSubscriptionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PushSubscriptionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a PushSubscription.
     * @param {PushSubscriptionDeleteArgs} args - Arguments to delete one PushSubscription.
     * @example
     * // Delete one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.delete({
     *   where: {
     *     // ... filter to delete one PushSubscription
     *   }
     * })
     *
     */
    delete<T extends PushSubscriptionDeleteArgs>(
      args: SelectSubset<T, PushSubscriptionDeleteArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one PushSubscription.
     * @param {PushSubscriptionUpdateArgs} args - Arguments to update one PushSubscription.
     * @example
     * // Update one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PushSubscriptionUpdateArgs>(
      args: SelectSubset<T, PushSubscriptionUpdateArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more PushSubscriptions.
     * @param {PushSubscriptionDeleteManyArgs} args - Arguments to filter PushSubscriptions to delete.
     * @example
     * // Delete a few PushSubscriptions
     * const { count } = await prisma.pushSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PushSubscriptionDeleteManyArgs>(
      args?: SelectSubset<T, PushSubscriptionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PushSubscriptionUpdateManyArgs>(
      args: SelectSubset<T, PushSubscriptionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushSubscriptions and returns the data updated in the database.
     * @param {PushSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many PushSubscriptions.
     * @example
     * // Update many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PushSubscriptions and only return the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.updateManyAndReturn({
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
    updateManyAndReturn<T extends PushSubscriptionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PushSubscriptionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one PushSubscription.
     * @param {PushSubscriptionUpsertArgs} args - Arguments to update or create a PushSubscription.
     * @example
     * // Update or create a PushSubscription
     * const pushSubscription = await prisma.pushSubscription.upsert({
     *   create: {
     *     // ... data to create a PushSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PushSubscription we want to update
     *   }
     * })
     */
    upsert<T extends PushSubscriptionUpsertArgs>(
      args: SelectSubset<T, PushSubscriptionUpsertArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionCountArgs} args - Arguments to filter PushSubscriptions to count.
     * @example
     * // Count the number of PushSubscriptions
     * const count = await prisma.pushSubscription.count({
     *   where: {
     *     // ... the filter for the PushSubscriptions we want to count
     *   }
     * })
     **/
    count<T extends PushSubscriptionCountArgs>(
      args?: Subset<T, PushSubscriptionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PushSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PushSubscriptionAggregateArgs>(
      args: Subset<T, PushSubscriptionAggregateArgs>
    ): Prisma.PrismaPromise<GetPushSubscriptionAggregateType<T>>

    /**
     * Group by PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionGroupByArgs} args - Group by arguments.
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
      T extends PushSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PushSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: PushSubscriptionGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, PushSubscriptionGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetPushSubscriptionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the PushSubscription model
     */
    readonly fields: PushSubscriptionFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for PushSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PushSubscriptionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProfileDefaultArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      | $Result.GetResult<
          Prisma.$ProfilePayload<ExtArgs>,
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
   * Fields of the PushSubscription model
   */
  interface PushSubscriptionFieldRefs {
    readonly id: FieldRef<'PushSubscription', 'String'>
    readonly profileId: FieldRef<'PushSubscription', 'String'>
    readonly endpoint: FieldRef<'PushSubscription', 'String'>
    readonly p256dhKey: FieldRef<'PushSubscription', 'String'>
    readonly authKey: FieldRef<'PushSubscription', 'String'>
    readonly createdAt: FieldRef<'PushSubscription', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * PushSubscription findUnique
   */
  export type PushSubscriptionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findUniqueOrThrow
   */
  export type PushSubscriptionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findFirst
   */
  export type PushSubscriptionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findFirstOrThrow
   */
  export type PushSubscriptionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findMany
   */
  export type PushSubscriptionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscriptions to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription create
   */
  export type PushSubscriptionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a PushSubscription.
     */
    data: XOR<PushSubscriptionCreateInput, PushSubscriptionUncheckedCreateInput>
  }

  /**
   * PushSubscription createMany
   */
  export type PushSubscriptionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PushSubscriptions.
     */
    data: PushSubscriptionCreateManyInput | PushSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PushSubscription createManyAndReturn
   */
  export type PushSubscriptionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many PushSubscriptions.
     */
    data: PushSubscriptionCreateManyInput | PushSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PushSubscription update
   */
  export type PushSubscriptionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a PushSubscription.
     */
    data: XOR<PushSubscriptionUpdateInput, PushSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which PushSubscription to update.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription updateMany
   */
  export type PushSubscriptionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PushSubscriptions.
     */
    data: XOR<PushSubscriptionUpdateManyMutationInput, PushSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which PushSubscriptions to update
     */
    where?: PushSubscriptionWhereInput
    /**
     * Limit how many PushSubscriptions to update.
     */
    limit?: number
  }

  /**
   * PushSubscription updateManyAndReturn
   */
  export type PushSubscriptionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update PushSubscriptions.
     */
    data: XOR<PushSubscriptionUpdateManyMutationInput, PushSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which PushSubscriptions to update
     */
    where?: PushSubscriptionWhereInput
    /**
     * Limit how many PushSubscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PushSubscription upsert
   */
  export type PushSubscriptionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the PushSubscription to update in case it exists.
     */
    where: PushSubscriptionWhereUniqueInput
    /**
     * In case the PushSubscription found by the `where` argument doesn't exist, create a new PushSubscription with this data.
     */
    create: XOR<PushSubscriptionCreateInput, PushSubscriptionUncheckedCreateInput>
    /**
     * In case the PushSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PushSubscriptionUpdateInput, PushSubscriptionUncheckedUpdateInput>
  }

  /**
   * PushSubscription delete
   */
  export type PushSubscriptionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which PushSubscription to delete.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription deleteMany
   */
  export type PushSubscriptionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PushSubscriptions to delete
     */
    where?: PushSubscriptionWhereInput
    /**
     * Limit how many PushSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * PushSubscription without action
   */
  export type PushSubscriptionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushSubscription
     */
    omit?: PushSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
  }

  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    body: string | null
    variant: string | null
    priority: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    body: string | null
    variant: string | null
    priority: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    profileId: number
    title: number
    body: number
    variant: number
    priority: number
    isRead: number
    createdAt: number
    _all: number
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    body?: true
    variant?: true
    priority?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    body?: true
    variant?: true
    priority?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    body?: true
    variant?: true
    priority?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Notifications
     **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
    [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }

  export type NotificationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    profileId: string
    title: string
    body: string | null
    variant: string
    priority: string
    isRead: boolean
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> & {
        [P in keyof T & keyof NotificationGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
          : GetScalarType<T[P], NotificationGroupByOutputType[P]>
      }
    >
  >

  export type NotificationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      title?: boolean
      body?: boolean
      variant?: boolean
      priority?: boolean
      isRead?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['notification']
  >

  export type NotificationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      title?: boolean
      body?: boolean
      variant?: boolean
      priority?: boolean
      isRead?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['notification']
  >

  export type NotificationSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      title?: boolean
      body?: boolean
      variant?: boolean
      priority?: boolean
      isRead?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['notification']
  >

  export type NotificationSelectScalar = {
    id?: boolean
    profileId?: boolean
    title?: boolean
    body?: boolean
    variant?: boolean
    priority?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'profileId' | 'title' | 'body' | 'variant' | 'priority' | 'isRead' | 'createdAt',
      ExtArgs['result']['notification']
    >
  export type NotificationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Notification'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        profileId: string
        title: string
        body: string | null
        variant: string
        priority: string
        isRead: boolean
        createdAt: Date
      },
      ExtArgs['result']['notification']
    >
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> =
    $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Notification']
      meta: { name: 'Notification' }
    }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(
      args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(
      args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     *
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     *
     */
    findMany<T extends NotificationFindManyArgs>(
      args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     *
     */
    create<T extends NotificationCreateArgs>(
      args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends NotificationCreateManyArgs>(
      args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     *
     */
    delete<T extends NotificationDeleteArgs>(
      args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends NotificationUpdateArgs>(
      args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends NotificationDeleteManyArgs>(
      args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends NotificationUpdateManyArgs>(
      args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
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
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(
      args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(
      args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>
    ): Prisma__NotificationClient<
      $Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
     **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(
      args: Subset<T, NotificationAggregateArgs>
    ): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Notification model
     */
    readonly fields: NotificationFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProfileDefaultArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      | $Result.GetResult<
          Prisma.$ProfilePayload<ExtArgs>,
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
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<'Notification', 'String'>
    readonly profileId: FieldRef<'Notification', 'String'>
    readonly title: FieldRef<'Notification', 'String'>
    readonly body: FieldRef<'Notification', 'String'>
    readonly variant: FieldRef<'Notification', 'String'>
    readonly priority: FieldRef<'Notification', 'String'>
    readonly isRead: FieldRef<'Notification', 'Boolean'>
    readonly createdAt: FieldRef<'Notification', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }

  /**
   * Model WidgetLayout
   */

  export type AggregateWidgetLayout = {
    _count: WidgetLayoutCountAggregateOutputType | null
    _avg: WidgetLayoutAvgAggregateOutputType | null
    _sum: WidgetLayoutSumAggregateOutputType | null
    _min: WidgetLayoutMinAggregateOutputType | null
    _max: WidgetLayoutMaxAggregateOutputType | null
  }

  export type WidgetLayoutAvgAggregateOutputType = {
    x: number | null
    y: number | null
    w: number | null
    h: number | null
  }

  export type WidgetLayoutSumAggregateOutputType = {
    x: number | null
    y: number | null
    w: number | null
    h: number | null
  }

  export type WidgetLayoutMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    widgetId: string | null
    x: number | null
    y: number | null
    w: number | null
    h: number | null
  }

  export type WidgetLayoutMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    widgetId: string | null
    x: number | null
    y: number | null
    w: number | null
    h: number | null
  }

  export type WidgetLayoutCountAggregateOutputType = {
    id: number
    profileId: number
    widgetId: number
    x: number
    y: number
    w: number
    h: number
    _all: number
  }

  export type WidgetLayoutAvgAggregateInputType = {
    x?: true
    y?: true
    w?: true
    h?: true
  }

  export type WidgetLayoutSumAggregateInputType = {
    x?: true
    y?: true
    w?: true
    h?: true
  }

  export type WidgetLayoutMinAggregateInputType = {
    id?: true
    profileId?: true
    widgetId?: true
    x?: true
    y?: true
    w?: true
    h?: true
  }

  export type WidgetLayoutMaxAggregateInputType = {
    id?: true
    profileId?: true
    widgetId?: true
    x?: true
    y?: true
    w?: true
    h?: true
  }

  export type WidgetLayoutCountAggregateInputType = {
    id?: true
    profileId?: true
    widgetId?: true
    x?: true
    y?: true
    w?: true
    h?: true
    _all?: true
  }

  export type WidgetLayoutAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WidgetLayout to aggregate.
     */
    where?: WidgetLayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WidgetLayouts to fetch.
     */
    orderBy?: WidgetLayoutOrderByWithRelationInput | WidgetLayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: WidgetLayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WidgetLayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WidgetLayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned WidgetLayouts
     **/
    _count?: true | WidgetLayoutCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: WidgetLayoutAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: WidgetLayoutSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: WidgetLayoutMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: WidgetLayoutMaxAggregateInputType
  }

  export type GetWidgetLayoutAggregateType<T extends WidgetLayoutAggregateArgs> = {
    [P in keyof T & keyof AggregateWidgetLayout]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWidgetLayout[P]>
      : GetScalarType<T[P], AggregateWidgetLayout[P]>
  }

  export type WidgetLayoutGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WidgetLayoutWhereInput
    orderBy?: WidgetLayoutOrderByWithAggregationInput | WidgetLayoutOrderByWithAggregationInput[]
    by: WidgetLayoutScalarFieldEnum[] | WidgetLayoutScalarFieldEnum
    having?: WidgetLayoutScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WidgetLayoutCountAggregateInputType | true
    _avg?: WidgetLayoutAvgAggregateInputType
    _sum?: WidgetLayoutSumAggregateInputType
    _min?: WidgetLayoutMinAggregateInputType
    _max?: WidgetLayoutMaxAggregateInputType
  }

  export type WidgetLayoutGroupByOutputType = {
    id: string
    profileId: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
    _count: WidgetLayoutCountAggregateOutputType | null
    _avg: WidgetLayoutAvgAggregateOutputType | null
    _sum: WidgetLayoutSumAggregateOutputType | null
    _min: WidgetLayoutMinAggregateOutputType | null
    _max: WidgetLayoutMaxAggregateOutputType | null
  }

  type GetWidgetLayoutGroupByPayload<T extends WidgetLayoutGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WidgetLayoutGroupByOutputType, T['by']> & {
        [P in keyof T & keyof WidgetLayoutGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], WidgetLayoutGroupByOutputType[P]>
          : GetScalarType<T[P], WidgetLayoutGroupByOutputType[P]>
      }
    >
  >

  export type WidgetLayoutSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      widgetId?: boolean
      x?: boolean
      y?: boolean
      w?: boolean
      h?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['widgetLayout']
  >

  export type WidgetLayoutSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      widgetId?: boolean
      x?: boolean
      y?: boolean
      w?: boolean
      h?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['widgetLayout']
  >

  export type WidgetLayoutSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      widgetId?: boolean
      x?: boolean
      y?: boolean
      w?: boolean
      h?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['widgetLayout']
  >

  export type WidgetLayoutSelectScalar = {
    id?: boolean
    profileId?: boolean
    widgetId?: boolean
    x?: boolean
    y?: boolean
    w?: boolean
    h?: boolean
  }

  export type WidgetLayoutOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'profileId' | 'widgetId' | 'x' | 'y' | 'w' | 'h',
      ExtArgs['result']['widgetLayout']
    >
  export type WidgetLayoutInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type WidgetLayoutIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type WidgetLayoutIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $WidgetLayoutPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'WidgetLayout'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        profileId: string
        widgetId: string
        x: number
        y: number
        w: number
        h: number
      },
      ExtArgs['result']['widgetLayout']
    >
    composites: {}
  }

  type WidgetLayoutGetPayload<S extends boolean | null | undefined | WidgetLayoutDefaultArgs> =
    $Result.GetResult<Prisma.$WidgetLayoutPayload, S>

  type WidgetLayoutCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WidgetLayoutFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WidgetLayoutCountAggregateInputType | true
    }

  export interface WidgetLayoutDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['WidgetLayout']
      meta: { name: 'WidgetLayout' }
    }
    /**
     * Find zero or one WidgetLayout that matches the filter.
     * @param {WidgetLayoutFindUniqueArgs} args - Arguments to find a WidgetLayout
     * @example
     * // Get one WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WidgetLayoutFindUniqueArgs>(
      args: SelectSubset<T, WidgetLayoutFindUniqueArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one WidgetLayout that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WidgetLayoutFindUniqueOrThrowArgs} args - Arguments to find a WidgetLayout
     * @example
     * // Get one WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WidgetLayoutFindUniqueOrThrowArgs>(
      args: SelectSubset<T, WidgetLayoutFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first WidgetLayout that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutFindFirstArgs} args - Arguments to find a WidgetLayout
     * @example
     * // Get one WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WidgetLayoutFindFirstArgs>(
      args?: SelectSubset<T, WidgetLayoutFindFirstArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first WidgetLayout that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutFindFirstOrThrowArgs} args - Arguments to find a WidgetLayout
     * @example
     * // Get one WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WidgetLayoutFindFirstOrThrowArgs>(
      args?: SelectSubset<T, WidgetLayoutFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more WidgetLayouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WidgetLayouts
     * const widgetLayouts = await prisma.widgetLayout.findMany()
     *
     * // Get first 10 WidgetLayouts
     * const widgetLayouts = await prisma.widgetLayout.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const widgetLayoutWithIdOnly = await prisma.widgetLayout.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WidgetLayoutFindManyArgs>(
      args?: SelectSubset<T, WidgetLayoutFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a WidgetLayout.
     * @param {WidgetLayoutCreateArgs} args - Arguments to create a WidgetLayout.
     * @example
     * // Create one WidgetLayout
     * const WidgetLayout = await prisma.widgetLayout.create({
     *   data: {
     *     // ... data to create a WidgetLayout
     *   }
     * })
     *
     */
    create<T extends WidgetLayoutCreateArgs>(
      args: SelectSubset<T, WidgetLayoutCreateArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many WidgetLayouts.
     * @param {WidgetLayoutCreateManyArgs} args - Arguments to create many WidgetLayouts.
     * @example
     * // Create many WidgetLayouts
     * const widgetLayout = await prisma.widgetLayout.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WidgetLayoutCreateManyArgs>(
      args?: SelectSubset<T, WidgetLayoutCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WidgetLayouts and returns the data saved in the database.
     * @param {WidgetLayoutCreateManyAndReturnArgs} args - Arguments to create many WidgetLayouts.
     * @example
     * // Create many WidgetLayouts
     * const widgetLayout = await prisma.widgetLayout.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many WidgetLayouts and only return the `id`
     * const widgetLayoutWithIdOnly = await prisma.widgetLayout.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WidgetLayoutCreateManyAndReturnArgs>(
      args?: SelectSubset<T, WidgetLayoutCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a WidgetLayout.
     * @param {WidgetLayoutDeleteArgs} args - Arguments to delete one WidgetLayout.
     * @example
     * // Delete one WidgetLayout
     * const WidgetLayout = await prisma.widgetLayout.delete({
     *   where: {
     *     // ... filter to delete one WidgetLayout
     *   }
     * })
     *
     */
    delete<T extends WidgetLayoutDeleteArgs>(
      args: SelectSubset<T, WidgetLayoutDeleteArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one WidgetLayout.
     * @param {WidgetLayoutUpdateArgs} args - Arguments to update one WidgetLayout.
     * @example
     * // Update one WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WidgetLayoutUpdateArgs>(
      args: SelectSubset<T, WidgetLayoutUpdateArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more WidgetLayouts.
     * @param {WidgetLayoutDeleteManyArgs} args - Arguments to filter WidgetLayouts to delete.
     * @example
     * // Delete a few WidgetLayouts
     * const { count } = await prisma.widgetLayout.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WidgetLayoutDeleteManyArgs>(
      args?: SelectSubset<T, WidgetLayoutDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetLayouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WidgetLayouts
     * const widgetLayout = await prisma.widgetLayout.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WidgetLayoutUpdateManyArgs>(
      args: SelectSubset<T, WidgetLayoutUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetLayouts and returns the data updated in the database.
     * @param {WidgetLayoutUpdateManyAndReturnArgs} args - Arguments to update many WidgetLayouts.
     * @example
     * // Update many WidgetLayouts
     * const widgetLayout = await prisma.widgetLayout.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more WidgetLayouts and only return the `id`
     * const widgetLayoutWithIdOnly = await prisma.widgetLayout.updateManyAndReturn({
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
    updateManyAndReturn<T extends WidgetLayoutUpdateManyAndReturnArgs>(
      args: SelectSubset<T, WidgetLayoutUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$WidgetLayoutPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one WidgetLayout.
     * @param {WidgetLayoutUpsertArgs} args - Arguments to update or create a WidgetLayout.
     * @example
     * // Update or create a WidgetLayout
     * const widgetLayout = await prisma.widgetLayout.upsert({
     *   create: {
     *     // ... data to create a WidgetLayout
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WidgetLayout we want to update
     *   }
     * })
     */
    upsert<T extends WidgetLayoutUpsertArgs>(
      args: SelectSubset<T, WidgetLayoutUpsertArgs<ExtArgs>>
    ): Prisma__WidgetLayoutClient<
      $Result.GetResult<Prisma.$WidgetLayoutPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of WidgetLayouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutCountArgs} args - Arguments to filter WidgetLayouts to count.
     * @example
     * // Count the number of WidgetLayouts
     * const count = await prisma.widgetLayout.count({
     *   where: {
     *     // ... the filter for the WidgetLayouts we want to count
     *   }
     * })
     **/
    count<T extends WidgetLayoutCountArgs>(
      args?: Subset<T, WidgetLayoutCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WidgetLayoutCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WidgetLayout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WidgetLayoutAggregateArgs>(
      args: Subset<T, WidgetLayoutAggregateArgs>
    ): Prisma.PrismaPromise<GetWidgetLayoutAggregateType<T>>

    /**
     * Group by WidgetLayout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetLayoutGroupByArgs} args - Group by arguments.
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
      T extends WidgetLayoutGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WidgetLayoutGroupByArgs['orderBy'] }
        : { orderBy?: WidgetLayoutGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, WidgetLayoutGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetWidgetLayoutGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the WidgetLayout model
     */
    readonly fields: WidgetLayoutFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for WidgetLayout.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WidgetLayoutClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProfileDefaultArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      | $Result.GetResult<
          Prisma.$ProfilePayload<ExtArgs>,
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
   * Fields of the WidgetLayout model
   */
  interface WidgetLayoutFieldRefs {
    readonly id: FieldRef<'WidgetLayout', 'String'>
    readonly profileId: FieldRef<'WidgetLayout', 'String'>
    readonly widgetId: FieldRef<'WidgetLayout', 'String'>
    readonly x: FieldRef<'WidgetLayout', 'Int'>
    readonly y: FieldRef<'WidgetLayout', 'Int'>
    readonly w: FieldRef<'WidgetLayout', 'Int'>
    readonly h: FieldRef<'WidgetLayout', 'Int'>
  }

  // Custom InputTypes
  /**
   * WidgetLayout findUnique
   */
  export type WidgetLayoutFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter, which WidgetLayout to fetch.
     */
    where: WidgetLayoutWhereUniqueInput
  }

  /**
   * WidgetLayout findUniqueOrThrow
   */
  export type WidgetLayoutFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter, which WidgetLayout to fetch.
     */
    where: WidgetLayoutWhereUniqueInput
  }

  /**
   * WidgetLayout findFirst
   */
  export type WidgetLayoutFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter, which WidgetLayout to fetch.
     */
    where?: WidgetLayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WidgetLayouts to fetch.
     */
    orderBy?: WidgetLayoutOrderByWithRelationInput | WidgetLayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WidgetLayouts.
     */
    cursor?: WidgetLayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WidgetLayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WidgetLayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WidgetLayouts.
     */
    distinct?: WidgetLayoutScalarFieldEnum | WidgetLayoutScalarFieldEnum[]
  }

  /**
   * WidgetLayout findFirstOrThrow
   */
  export type WidgetLayoutFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter, which WidgetLayout to fetch.
     */
    where?: WidgetLayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WidgetLayouts to fetch.
     */
    orderBy?: WidgetLayoutOrderByWithRelationInput | WidgetLayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WidgetLayouts.
     */
    cursor?: WidgetLayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WidgetLayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WidgetLayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WidgetLayouts.
     */
    distinct?: WidgetLayoutScalarFieldEnum | WidgetLayoutScalarFieldEnum[]
  }

  /**
   * WidgetLayout findMany
   */
  export type WidgetLayoutFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter, which WidgetLayouts to fetch.
     */
    where?: WidgetLayoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WidgetLayouts to fetch.
     */
    orderBy?: WidgetLayoutOrderByWithRelationInput | WidgetLayoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing WidgetLayouts.
     */
    cursor?: WidgetLayoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WidgetLayouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WidgetLayouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WidgetLayouts.
     */
    distinct?: WidgetLayoutScalarFieldEnum | WidgetLayoutScalarFieldEnum[]
  }

  /**
   * WidgetLayout create
   */
  export type WidgetLayoutCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * The data needed to create a WidgetLayout.
     */
    data: XOR<WidgetLayoutCreateInput, WidgetLayoutUncheckedCreateInput>
  }

  /**
   * WidgetLayout createMany
   */
  export type WidgetLayoutCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many WidgetLayouts.
     */
    data: WidgetLayoutCreateManyInput | WidgetLayoutCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WidgetLayout createManyAndReturn
   */
  export type WidgetLayoutCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * The data used to create many WidgetLayouts.
     */
    data: WidgetLayoutCreateManyInput | WidgetLayoutCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WidgetLayout update
   */
  export type WidgetLayoutUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * The data needed to update a WidgetLayout.
     */
    data: XOR<WidgetLayoutUpdateInput, WidgetLayoutUncheckedUpdateInput>
    /**
     * Choose, which WidgetLayout to update.
     */
    where: WidgetLayoutWhereUniqueInput
  }

  /**
   * WidgetLayout updateMany
   */
  export type WidgetLayoutUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update WidgetLayouts.
     */
    data: XOR<WidgetLayoutUpdateManyMutationInput, WidgetLayoutUncheckedUpdateManyInput>
    /**
     * Filter which WidgetLayouts to update
     */
    where?: WidgetLayoutWhereInput
    /**
     * Limit how many WidgetLayouts to update.
     */
    limit?: number
  }

  /**
   * WidgetLayout updateManyAndReturn
   */
  export type WidgetLayoutUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * The data used to update WidgetLayouts.
     */
    data: XOR<WidgetLayoutUpdateManyMutationInput, WidgetLayoutUncheckedUpdateManyInput>
    /**
     * Filter which WidgetLayouts to update
     */
    where?: WidgetLayoutWhereInput
    /**
     * Limit how many WidgetLayouts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WidgetLayout upsert
   */
  export type WidgetLayoutUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * The filter to search for the WidgetLayout to update in case it exists.
     */
    where: WidgetLayoutWhereUniqueInput
    /**
     * In case the WidgetLayout found by the `where` argument doesn't exist, create a new WidgetLayout with this data.
     */
    create: XOR<WidgetLayoutCreateInput, WidgetLayoutUncheckedCreateInput>
    /**
     * In case the WidgetLayout was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WidgetLayoutUpdateInput, WidgetLayoutUncheckedUpdateInput>
  }

  /**
   * WidgetLayout delete
   */
  export type WidgetLayoutDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
    /**
     * Filter which WidgetLayout to delete.
     */
    where: WidgetLayoutWhereUniqueInput
  }

  /**
   * WidgetLayout deleteMany
   */
  export type WidgetLayoutDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WidgetLayouts to delete
     */
    where?: WidgetLayoutWhereInput
    /**
     * Limit how many WidgetLayouts to delete.
     */
    limit?: number
  }

  /**
   * WidgetLayout without action
   */
  export type WidgetLayoutDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WidgetLayout
     */
    select?: WidgetLayoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetLayout
     */
    omit?: WidgetLayoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WidgetLayoutInclude<ExtArgs> | null
  }

  /**
   * Model PermissionOverride
   */

  export type AggregatePermissionOverride = {
    _count: PermissionOverrideCountAggregateOutputType | null
    _min: PermissionOverrideMinAggregateOutputType | null
    _max: PermissionOverrideMaxAggregateOutputType | null
  }

  export type PermissionOverrideMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    action: string | null
    subject: string | null
    type: string | null
    grantedBy: string | null
    createdAt: Date | null
  }

  export type PermissionOverrideMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    action: string | null
    subject: string | null
    type: string | null
    grantedBy: string | null
    createdAt: Date | null
  }

  export type PermissionOverrideCountAggregateOutputType = {
    id: number
    profileId: number
    action: number
    subject: number
    type: number
    grantedBy: number
    createdAt: number
    _all: number
  }

  export type PermissionOverrideMinAggregateInputType = {
    id?: true
    profileId?: true
    action?: true
    subject?: true
    type?: true
    grantedBy?: true
    createdAt?: true
  }

  export type PermissionOverrideMaxAggregateInputType = {
    id?: true
    profileId?: true
    action?: true
    subject?: true
    type?: true
    grantedBy?: true
    createdAt?: true
  }

  export type PermissionOverrideCountAggregateInputType = {
    id?: true
    profileId?: true
    action?: true
    subject?: true
    type?: true
    grantedBy?: true
    createdAt?: true
    _all?: true
  }

  export type PermissionOverrideAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PermissionOverride to aggregate.
     */
    where?: PermissionOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PermissionOverrides to fetch.
     */
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PermissionOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PermissionOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PermissionOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PermissionOverrides
     **/
    _count?: true | PermissionOverrideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PermissionOverrideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PermissionOverrideMaxAggregateInputType
  }

  export type GetPermissionOverrideAggregateType<T extends PermissionOverrideAggregateArgs> = {
    [P in keyof T & keyof AggregatePermissionOverride]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermissionOverride[P]>
      : GetScalarType<T[P], AggregatePermissionOverride[P]>
  }

  export type PermissionOverrideGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PermissionOverrideWhereInput
    orderBy?:
      | PermissionOverrideOrderByWithAggregationInput
      | PermissionOverrideOrderByWithAggregationInput[]
    by: PermissionOverrideScalarFieldEnum[] | PermissionOverrideScalarFieldEnum
    having?: PermissionOverrideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionOverrideCountAggregateInputType | true
    _min?: PermissionOverrideMinAggregateInputType
    _max?: PermissionOverrideMaxAggregateInputType
  }

  export type PermissionOverrideGroupByOutputType = {
    id: string
    profileId: string
    action: string
    subject: string
    type: string
    grantedBy: string | null
    createdAt: Date
    _count: PermissionOverrideCountAggregateOutputType | null
    _min: PermissionOverrideMinAggregateOutputType | null
    _max: PermissionOverrideMaxAggregateOutputType | null
  }

  type GetPermissionOverrideGroupByPayload<T extends PermissionOverrideGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PermissionOverrideGroupByOutputType, T['by']> & {
          [P in keyof T & keyof PermissionOverrideGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionOverrideGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionOverrideGroupByOutputType[P]>
        }
      >
    >

  export type PermissionOverrideSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      action?: boolean
      subject?: boolean
      type?: boolean
      grantedBy?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
      grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
    },
    ExtArgs['result']['permissionOverride']
  >

  export type PermissionOverrideSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      action?: boolean
      subject?: boolean
      type?: boolean
      grantedBy?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
      grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
    },
    ExtArgs['result']['permissionOverride']
  >

  export type PermissionOverrideSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      profileId?: boolean
      action?: boolean
      subject?: boolean
      type?: boolean
      grantedBy?: boolean
      createdAt?: boolean
      profile?: boolean | ProfileDefaultArgs<ExtArgs>
      grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
    },
    ExtArgs['result']['permissionOverride']
  >

  export type PermissionOverrideSelectScalar = {
    id?: boolean
    profileId?: boolean
    action?: boolean
    subject?: boolean
    type?: boolean
    grantedBy?: boolean
    createdAt?: boolean
  }

  export type PermissionOverrideOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'profileId' | 'action' | 'subject' | 'type' | 'grantedBy' | 'createdAt',
    ExtArgs['result']['permissionOverride']
  >
  export type PermissionOverrideInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
  }
  export type PermissionOverrideIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
  }
  export type PermissionOverrideIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    grantor?: boolean | PermissionOverride$grantorArgs<ExtArgs>
  }

  export type $PermissionOverridePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PermissionOverride'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      grantor: Prisma.$ProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        profileId: string
        action: string
        subject: string
        type: string
        grantedBy: string | null
        createdAt: Date
      },
      ExtArgs['result']['permissionOverride']
    >
    composites: {}
  }

  type PermissionOverrideGetPayload<
    S extends boolean | null | undefined | PermissionOverrideDefaultArgs,
  > = $Result.GetResult<Prisma.$PermissionOverridePayload, S>

  type PermissionOverrideCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PermissionOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PermissionOverrideCountAggregateInputType | true
  }

  export interface PermissionOverrideDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PermissionOverride']
      meta: { name: 'PermissionOverride' }
    }
    /**
     * Find zero or one PermissionOverride that matches the filter.
     * @param {PermissionOverrideFindUniqueArgs} args - Arguments to find a PermissionOverride
     * @example
     * // Get one PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionOverrideFindUniqueArgs>(
      args: SelectSubset<T, PermissionOverrideFindUniqueArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one PermissionOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionOverrideFindUniqueOrThrowArgs} args - Arguments to find a PermissionOverride
     * @example
     * // Get one PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionOverrideFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PermissionOverrideFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first PermissionOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideFindFirstArgs} args - Arguments to find a PermissionOverride
     * @example
     * // Get one PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionOverrideFindFirstArgs>(
      args?: SelectSubset<T, PermissionOverrideFindFirstArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first PermissionOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideFindFirstOrThrowArgs} args - Arguments to find a PermissionOverride
     * @example
     * // Get one PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionOverrideFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PermissionOverrideFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more PermissionOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PermissionOverrides
     * const permissionOverrides = await prisma.permissionOverride.findMany()
     *
     * // Get first 10 PermissionOverrides
     * const permissionOverrides = await prisma.permissionOverride.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const permissionOverrideWithIdOnly = await prisma.permissionOverride.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PermissionOverrideFindManyArgs>(
      args?: SelectSubset<T, PermissionOverrideFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >

    /**
     * Create a PermissionOverride.
     * @param {PermissionOverrideCreateArgs} args - Arguments to create a PermissionOverride.
     * @example
     * // Create one PermissionOverride
     * const PermissionOverride = await prisma.permissionOverride.create({
     *   data: {
     *     // ... data to create a PermissionOverride
     *   }
     * })
     *
     */
    create<T extends PermissionOverrideCreateArgs>(
      args: SelectSubset<T, PermissionOverrideCreateArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<Prisma.$PermissionOverridePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many PermissionOverrides.
     * @param {PermissionOverrideCreateManyArgs} args - Arguments to create many PermissionOverrides.
     * @example
     * // Create many PermissionOverrides
     * const permissionOverride = await prisma.permissionOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PermissionOverrideCreateManyArgs>(
      args?: SelectSubset<T, PermissionOverrideCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PermissionOverrides and returns the data saved in the database.
     * @param {PermissionOverrideCreateManyAndReturnArgs} args - Arguments to create many PermissionOverrides.
     * @example
     * // Create many PermissionOverrides
     * const permissionOverride = await prisma.permissionOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PermissionOverrides and only return the `id`
     * const permissionOverrideWithIdOnly = await prisma.permissionOverride.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PermissionOverrideCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PermissionOverrideCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a PermissionOverride.
     * @param {PermissionOverrideDeleteArgs} args - Arguments to delete one PermissionOverride.
     * @example
     * // Delete one PermissionOverride
     * const PermissionOverride = await prisma.permissionOverride.delete({
     *   where: {
     *     // ... filter to delete one PermissionOverride
     *   }
     * })
     *
     */
    delete<T extends PermissionOverrideDeleteArgs>(
      args: SelectSubset<T, PermissionOverrideDeleteArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<Prisma.$PermissionOverridePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one PermissionOverride.
     * @param {PermissionOverrideUpdateArgs} args - Arguments to update one PermissionOverride.
     * @example
     * // Update one PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PermissionOverrideUpdateArgs>(
      args: SelectSubset<T, PermissionOverrideUpdateArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<Prisma.$PermissionOverridePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more PermissionOverrides.
     * @param {PermissionOverrideDeleteManyArgs} args - Arguments to filter PermissionOverrides to delete.
     * @example
     * // Delete a few PermissionOverrides
     * const { count } = await prisma.permissionOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PermissionOverrideDeleteManyArgs>(
      args?: SelectSubset<T, PermissionOverrideDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PermissionOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PermissionOverrides
     * const permissionOverride = await prisma.permissionOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PermissionOverrideUpdateManyArgs>(
      args: SelectSubset<T, PermissionOverrideUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PermissionOverrides and returns the data updated in the database.
     * @param {PermissionOverrideUpdateManyAndReturnArgs} args - Arguments to update many PermissionOverrides.
     * @example
     * // Update many PermissionOverrides
     * const permissionOverride = await prisma.permissionOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PermissionOverrides and only return the `id`
     * const permissionOverrideWithIdOnly = await prisma.permissionOverride.updateManyAndReturn({
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
    updateManyAndReturn<T extends PermissionOverrideUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PermissionOverrideUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PermissionOverridePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one PermissionOverride.
     * @param {PermissionOverrideUpsertArgs} args - Arguments to update or create a PermissionOverride.
     * @example
     * // Update or create a PermissionOverride
     * const permissionOverride = await prisma.permissionOverride.upsert({
     *   create: {
     *     // ... data to create a PermissionOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PermissionOverride we want to update
     *   }
     * })
     */
    upsert<T extends PermissionOverrideUpsertArgs>(
      args: SelectSubset<T, PermissionOverrideUpsertArgs<ExtArgs>>
    ): Prisma__PermissionOverrideClient<
      $Result.GetResult<Prisma.$PermissionOverridePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of PermissionOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideCountArgs} args - Arguments to filter PermissionOverrides to count.
     * @example
     * // Count the number of PermissionOverrides
     * const count = await prisma.permissionOverride.count({
     *   where: {
     *     // ... the filter for the PermissionOverrides we want to count
     *   }
     * })
     **/
    count<T extends PermissionOverrideCountArgs>(
      args?: Subset<T, PermissionOverrideCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionOverrideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PermissionOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PermissionOverrideAggregateArgs>(
      args: Subset<T, PermissionOverrideAggregateArgs>
    ): Prisma.PrismaPromise<GetPermissionOverrideAggregateType<T>>

    /**
     * Group by PermissionOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionOverrideGroupByArgs} args - Group by arguments.
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
      T extends PermissionOverrideGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionOverrideGroupByArgs['orderBy'] }
        : { orderBy?: PermissionOverrideGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, PermissionOverrideGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetPermissionOverrideGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the PermissionOverride model
     */
    readonly fields: PermissionOverrideFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for PermissionOverride.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionOverrideClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProfileDefaultArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      | $Result.GetResult<
          Prisma.$ProfilePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    grantor<T extends PermissionOverride$grantorArgs<ExtArgs> = {}>(
      args?: Subset<T, PermissionOverride$grantorArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
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
   * Fields of the PermissionOverride model
   */
  interface PermissionOverrideFieldRefs {
    readonly id: FieldRef<'PermissionOverride', 'String'>
    readonly profileId: FieldRef<'PermissionOverride', 'String'>
    readonly action: FieldRef<'PermissionOverride', 'String'>
    readonly subject: FieldRef<'PermissionOverride', 'String'>
    readonly type: FieldRef<'PermissionOverride', 'String'>
    readonly grantedBy: FieldRef<'PermissionOverride', 'String'>
    readonly createdAt: FieldRef<'PermissionOverride', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * PermissionOverride findUnique
   */
  export type PermissionOverrideFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter, which PermissionOverride to fetch.
     */
    where: PermissionOverrideWhereUniqueInput
  }

  /**
   * PermissionOverride findUniqueOrThrow
   */
  export type PermissionOverrideFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter, which PermissionOverride to fetch.
     */
    where: PermissionOverrideWhereUniqueInput
  }

  /**
   * PermissionOverride findFirst
   */
  export type PermissionOverrideFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter, which PermissionOverride to fetch.
     */
    where?: PermissionOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PermissionOverrides to fetch.
     */
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PermissionOverrides.
     */
    cursor?: PermissionOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PermissionOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PermissionOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PermissionOverrides.
     */
    distinct?: PermissionOverrideScalarFieldEnum | PermissionOverrideScalarFieldEnum[]
  }

  /**
   * PermissionOverride findFirstOrThrow
   */
  export type PermissionOverrideFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter, which PermissionOverride to fetch.
     */
    where?: PermissionOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PermissionOverrides to fetch.
     */
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PermissionOverrides.
     */
    cursor?: PermissionOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PermissionOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PermissionOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PermissionOverrides.
     */
    distinct?: PermissionOverrideScalarFieldEnum | PermissionOverrideScalarFieldEnum[]
  }

  /**
   * PermissionOverride findMany
   */
  export type PermissionOverrideFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter, which PermissionOverrides to fetch.
     */
    where?: PermissionOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PermissionOverrides to fetch.
     */
    orderBy?:
      | PermissionOverrideOrderByWithRelationInput
      | PermissionOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PermissionOverrides.
     */
    cursor?: PermissionOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PermissionOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PermissionOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PermissionOverrides.
     */
    distinct?: PermissionOverrideScalarFieldEnum | PermissionOverrideScalarFieldEnum[]
  }

  /**
   * PermissionOverride create
   */
  export type PermissionOverrideCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * The data needed to create a PermissionOverride.
     */
    data: XOR<PermissionOverrideCreateInput, PermissionOverrideUncheckedCreateInput>
  }

  /**
   * PermissionOverride createMany
   */
  export type PermissionOverrideCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PermissionOverrides.
     */
    data: PermissionOverrideCreateManyInput | PermissionOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PermissionOverride createManyAndReturn
   */
  export type PermissionOverrideCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * The data used to create many PermissionOverrides.
     */
    data: PermissionOverrideCreateManyInput | PermissionOverrideCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PermissionOverride update
   */
  export type PermissionOverrideUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * The data needed to update a PermissionOverride.
     */
    data: XOR<PermissionOverrideUpdateInput, PermissionOverrideUncheckedUpdateInput>
    /**
     * Choose, which PermissionOverride to update.
     */
    where: PermissionOverrideWhereUniqueInput
  }

  /**
   * PermissionOverride updateMany
   */
  export type PermissionOverrideUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PermissionOverrides.
     */
    data: XOR<PermissionOverrideUpdateManyMutationInput, PermissionOverrideUncheckedUpdateManyInput>
    /**
     * Filter which PermissionOverrides to update
     */
    where?: PermissionOverrideWhereInput
    /**
     * Limit how many PermissionOverrides to update.
     */
    limit?: number
  }

  /**
   * PermissionOverride updateManyAndReturn
   */
  export type PermissionOverrideUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * The data used to update PermissionOverrides.
     */
    data: XOR<PermissionOverrideUpdateManyMutationInput, PermissionOverrideUncheckedUpdateManyInput>
    /**
     * Filter which PermissionOverrides to update
     */
    where?: PermissionOverrideWhereInput
    /**
     * Limit how many PermissionOverrides to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PermissionOverride upsert
   */
  export type PermissionOverrideUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * The filter to search for the PermissionOverride to update in case it exists.
     */
    where: PermissionOverrideWhereUniqueInput
    /**
     * In case the PermissionOverride found by the `where` argument doesn't exist, create a new PermissionOverride with this data.
     */
    create: XOR<PermissionOverrideCreateInput, PermissionOverrideUncheckedCreateInput>
    /**
     * In case the PermissionOverride was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionOverrideUpdateInput, PermissionOverrideUncheckedUpdateInput>
  }

  /**
   * PermissionOverride delete
   */
  export type PermissionOverrideDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
    /**
     * Filter which PermissionOverride to delete.
     */
    where: PermissionOverrideWhereUniqueInput
  }

  /**
   * PermissionOverride deleteMany
   */
  export type PermissionOverrideDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PermissionOverrides to delete
     */
    where?: PermissionOverrideWhereInput
    /**
     * Limit how many PermissionOverrides to delete.
     */
    limit?: number
  }

  /**
   * PermissionOverride.grantor
   */
  export type PermissionOverride$grantorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * PermissionOverride without action
   */
  export type PermissionOverrideDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PermissionOverride
     */
    select?: PermissionOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PermissionOverride
     */
    omit?: PermissionOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionOverrideInclude<ExtArgs> | null
  }

  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigMinAggregateOutputType = {
    key: string | null
    updatedBy: string | null
    updatedAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    key: string | null
    updatedBy: string | null
    updatedAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    key: number
    value: number
    updatedBy: number
    updatedAt: number
    _all: number
  }

  export type SystemConfigMinAggregateInputType = {
    key?: true
    updatedBy?: true
    updatedAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    key?: true
    updatedBy?: true
    updatedAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    key?: true
    value?: true
    updatedBy?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SystemConfigs
     **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
    [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }

  export type SystemConfigGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    key: string
    value: JsonValue
    updatedBy: string | null
    updatedAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SystemConfigGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
          : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
      }
    >
  >

  export type SystemConfigSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      value?: boolean
      updatedBy?: boolean
      updatedAt?: boolean
      profile?: boolean | SystemConfig$profileArgs<ExtArgs>
    },
    ExtArgs['result']['systemConfig']
  >

  export type SystemConfigSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      value?: boolean
      updatedBy?: boolean
      updatedAt?: boolean
      profile?: boolean | SystemConfig$profileArgs<ExtArgs>
    },
    ExtArgs['result']['systemConfig']
  >

  export type SystemConfigSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      value?: boolean
      updatedBy?: boolean
      updatedAt?: boolean
      profile?: boolean | SystemConfig$profileArgs<ExtArgs>
    },
    ExtArgs['result']['systemConfig']
  >

  export type SystemConfigSelectScalar = {
    key?: boolean
    value?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
  }

  export type SystemConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'key' | 'value' | 'updatedBy' | 'updatedAt',
      ExtArgs['result']['systemConfig']
    >
  export type SystemConfigInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | SystemConfig$profileArgs<ExtArgs>
  }
  export type SystemConfigIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | SystemConfig$profileArgs<ExtArgs>
  }
  export type SystemConfigIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    profile?: boolean | SystemConfig$profileArgs<ExtArgs>
  }

  export type $SystemConfigPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'SystemConfig'
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<
      {
        key: string
        value: Prisma.JsonValue
        updatedBy: string | null
        updatedAt: Date
      },
      ExtArgs['result']['systemConfig']
    >
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> =
    $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig']
      meta: { name: 'SystemConfig' }
    }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(
      args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(
      args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     *
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     *
     * // Only select the `key`
     * const systemConfigWithKeyOnly = await prisma.systemConfig.findMany({ select: { key: true } })
     *
     */
    findMany<T extends SystemConfigFindManyArgs>(
      args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     *
     */
    create<T extends SystemConfigCreateArgs>(
      args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SystemConfigCreateManyArgs>(
      args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SystemConfigs and only return the `key`
     * const systemConfigWithKeyOnly = await prisma.systemConfig.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     *
     */
    delete<T extends SystemConfigDeleteArgs>(
      args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SystemConfigUpdateArgs>(
      args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(
      args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(
      args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs and returns the data updated in the database.
     * @param {SystemConfigUpdateManyAndReturnArgs} args - Arguments to update many SystemConfigs.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SystemConfigs and only return the `key`
     * const systemConfigWithKeyOnly = await prisma.systemConfig.updateManyAndReturn({
     *   select: { key: true },
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
    updateManyAndReturn<T extends SystemConfigUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SystemConfigUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SystemConfigPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(
      args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>
    ): Prisma__SystemConfigClient<
      $Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
     **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemConfigAggregateArgs>(
      args: Subset<T, SystemConfigAggregateArgs>
    ): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
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
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SystemConfig model
     */
    readonly fields: SystemConfigFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    profile<T extends SystemConfig$profileArgs<ExtArgs> = {}>(
      args?: Subset<T, SystemConfig$profileArgs<ExtArgs>>
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
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
   * Fields of the SystemConfig model
   */
  interface SystemConfigFieldRefs {
    readonly key: FieldRef<'SystemConfig', 'String'>
    readonly value: FieldRef<'SystemConfig', 'Json'>
    readonly updatedBy: FieldRef<'SystemConfig', 'String'>
    readonly updatedAt: FieldRef<'SystemConfig', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig updateManyAndReturn
   */
  export type SystemConfigUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to delete.
     */
    limit?: number
  }

  /**
   * SystemConfig.profile
   */
  export type SystemConfig$profileArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemConfigInclude<ExtArgs> | null
  }

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    sid: string | null
    expire: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    sid: string | null
    expire: Date | null
  }

  export type SessionCountAggregateOutputType = {
    sid: number
    sess: number
    expire: number
    _all: number
  }

  export type SessionMinAggregateInputType = {
    sid?: true
    expire?: true
  }

  export type SessionMaxAggregateInputType = {
    sid?: true
    expire?: true
  }

  export type SessionCountAggregateInputType = {
    sid?: true
    sess?: true
    expire?: true
    _all?: true
  }

  export type SessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Sessions
     **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
    [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }

  export type SessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    sid: string
    sess: JsonValue
    expire: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SessionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
          : GetScalarType<T[P], SessionGroupByOutputType[P]>
      }
    >
  >

  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        sid?: boolean
        sess?: boolean
        expire?: boolean
      },
      ExtArgs['result']['session']
    >

  export type SessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      sid?: boolean
      sess?: boolean
      expire?: boolean
    },
    ExtArgs['result']['session']
  >

  export type SessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      sid?: boolean
      sess?: boolean
      expire?: boolean
    },
    ExtArgs['result']['session']
  >

  export type SessionSelectScalar = {
    sid?: boolean
    sess?: boolean
    expire?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<'sid' | 'sess' | 'expire', ExtArgs['result']['session']>

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Session'
      objects: {}
      scalars: $Extensions.GetPayloadResult<
        {
          sid: string
          sess: Prisma.JsonValue
          expire: Date
        },
        ExtArgs['result']['session']
      >
      composites: {}
    }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> =
    $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SessionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: SessionCountAggregateInputType | true
  }

  export interface SessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session']; meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(
      args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(
      args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     *
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     *
     * // Only select the `sid`
     * const sessionWithSidOnly = await prisma.session.findMany({ select: { sid: true } })
     *
     */
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     *
     */
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sessions and only return the `sid`
     * const sessionWithSidOnly = await prisma.session.createManyAndReturn({
     *   select: { sid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     *
     */
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Sessions and only return the `sid`
     * const sessionWithSidOnly = await prisma.session.updateManyAndReturn({
     *   select: { sid: true },
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
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
     **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(
      args: Subset<T, SessionAggregateArgs>
    ): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
      args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Session model
     */
    readonly fields: SessionFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly sid: FieldRef<'Session', 'String'>
    readonly sess: FieldRef<'Session', 'Json'>
    readonly expire: FieldRef<'Session', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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

  export const ProfileScalarFieldEnum: {
    id: 'id'
    name: 'name'
    tier: 'tier'
    identityHue: 'identityHue'
    avatarUrl: 'avatarUrl'
    darkMode: 'darkMode'
    focusMode: 'focusMode'
    pushEnabled: 'pushEnabled'
    createdAt: 'createdAt'
  }

  export type ProfileScalarFieldEnum =
    (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]

  export const ProfileImageScalarFieldEnum: {
    profileId: 'profileId'
    bytes: 'bytes'
    mimeType: 'mimeType'
    hash: 'hash'
    updatedAt: 'updatedAt'
  }

  export type ProfileImageScalarFieldEnum =
    (typeof ProfileImageScalarFieldEnum)[keyof typeof ProfileImageScalarFieldEnum]

  export const PushSubscriptionScalarFieldEnum: {
    id: 'id'
    profileId: 'profileId'
    endpoint: 'endpoint'
    p256dhKey: 'p256dhKey'
    authKey: 'authKey'
    createdAt: 'createdAt'
  }

  export type PushSubscriptionScalarFieldEnum =
    (typeof PushSubscriptionScalarFieldEnum)[keyof typeof PushSubscriptionScalarFieldEnum]

  export const NotificationScalarFieldEnum: {
    id: 'id'
    profileId: 'profileId'
    title: 'title'
    body: 'body'
    variant: 'variant'
    priority: 'priority'
    isRead: 'isRead'
    createdAt: 'createdAt'
  }

  export type NotificationScalarFieldEnum =
    (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]

  export const WidgetLayoutScalarFieldEnum: {
    id: 'id'
    profileId: 'profileId'
    widgetId: 'widgetId'
    x: 'x'
    y: 'y'
    w: 'w'
    h: 'h'
  }

  export type WidgetLayoutScalarFieldEnum =
    (typeof WidgetLayoutScalarFieldEnum)[keyof typeof WidgetLayoutScalarFieldEnum]

  export const PermissionOverrideScalarFieldEnum: {
    id: 'id'
    profileId: 'profileId'
    action: 'action'
    subject: 'subject'
    type: 'type'
    grantedBy: 'grantedBy'
    createdAt: 'createdAt'
  }

  export type PermissionOverrideScalarFieldEnum =
    (typeof PermissionOverrideScalarFieldEnum)[keyof typeof PermissionOverrideScalarFieldEnum]

  export const SystemConfigScalarFieldEnum: {
    key: 'key'
    value: 'value'
    updatedBy: 'updatedBy'
    updatedAt: 'updatedAt'
  }

  export type SystemConfigScalarFieldEnum =
    (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]

  export const SessionScalarFieldEnum: {
    sid: 'sid'
    sess: 'sess'
    expire: 'expire'
  }

  export type SessionScalarFieldEnum =
    (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  }

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]

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

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull
    JsonNull: typeof JsonNull
    AnyNull: typeof AnyNull
  }

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]

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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>

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
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>

  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
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

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: StringFilter<'Profile'> | string
    name?: StringFilter<'Profile'> | string
    tier?: IntFilter<'Profile'> | number
    identityHue?: StringNullableFilter<'Profile'> | string | null
    avatarUrl?: StringNullableFilter<'Profile'> | string | null
    darkMode?: BoolNullableFilter<'Profile'> | boolean | null
    focusMode?: BoolNullableFilter<'Profile'> | boolean | null
    pushEnabled?: BoolFilter<'Profile'> | boolean
    createdAt?: DateTimeFilter<'Profile'> | Date | string
    permissionOverrides?: PermissionOverrideListRelationFilter
    grantedOverrides?: PermissionOverrideListRelationFilter
    systemConfigs?: SystemConfigListRelationFilter
    widgetLayouts?: WidgetLayoutListRelationFilter
    notifications?: NotificationListRelationFilter
    pushSubscriptions?: PushSubscriptionListRelationFilter
    image?: XOR<ProfileImageNullableScalarRelationFilter, ProfileImageWhereInput> | null
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    tier?: SortOrder
    identityHue?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    darkMode?: SortOrderInput | SortOrder
    focusMode?: SortOrderInput | SortOrder
    pushEnabled?: SortOrder
    createdAt?: SortOrder
    permissionOverrides?: PermissionOverrideOrderByRelationAggregateInput
    grantedOverrides?: PermissionOverrideOrderByRelationAggregateInput
    systemConfigs?: SystemConfigOrderByRelationAggregateInput
    widgetLayouts?: WidgetLayoutOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    pushSubscriptions?: PushSubscriptionOrderByRelationAggregateInput
    image?: ProfileImageOrderByWithRelationInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      identityHue?: string
      AND?: ProfileWhereInput | ProfileWhereInput[]
      OR?: ProfileWhereInput[]
      NOT?: ProfileWhereInput | ProfileWhereInput[]
      name?: StringFilter<'Profile'> | string
      tier?: IntFilter<'Profile'> | number
      avatarUrl?: StringNullableFilter<'Profile'> | string | null
      darkMode?: BoolNullableFilter<'Profile'> | boolean | null
      focusMode?: BoolNullableFilter<'Profile'> | boolean | null
      pushEnabled?: BoolFilter<'Profile'> | boolean
      createdAt?: DateTimeFilter<'Profile'> | Date | string
      permissionOverrides?: PermissionOverrideListRelationFilter
      grantedOverrides?: PermissionOverrideListRelationFilter
      systemConfigs?: SystemConfigListRelationFilter
      widgetLayouts?: WidgetLayoutListRelationFilter
      notifications?: NotificationListRelationFilter
      pushSubscriptions?: PushSubscriptionListRelationFilter
      image?: XOR<ProfileImageNullableScalarRelationFilter, ProfileImageWhereInput> | null
    },
    'id' | 'identityHue'
  >

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    tier?: SortOrder
    identityHue?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    darkMode?: SortOrderInput | SortOrder
    focusMode?: SortOrderInput | SortOrder
    pushEnabled?: SortOrder
    createdAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'Profile'> | string
    name?: StringWithAggregatesFilter<'Profile'> | string
    tier?: IntWithAggregatesFilter<'Profile'> | number
    identityHue?: StringNullableWithAggregatesFilter<'Profile'> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<'Profile'> | string | null
    darkMode?: BoolNullableWithAggregatesFilter<'Profile'> | boolean | null
    focusMode?: BoolNullableWithAggregatesFilter<'Profile'> | boolean | null
    pushEnabled?: BoolWithAggregatesFilter<'Profile'> | boolean
    createdAt?: DateTimeWithAggregatesFilter<'Profile'> | Date | string
  }

  export type ProfileImageWhereInput = {
    AND?: ProfileImageWhereInput | ProfileImageWhereInput[]
    OR?: ProfileImageWhereInput[]
    NOT?: ProfileImageWhereInput | ProfileImageWhereInput[]
    profileId?: StringFilter<'ProfileImage'> | string
    bytes?: BytesFilter<'ProfileImage'> | Bytes
    mimeType?: StringFilter<'ProfileImage'> | string
    hash?: StringFilter<'ProfileImage'> | string
    updatedAt?: DateTimeFilter<'ProfileImage'> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type ProfileImageOrderByWithRelationInput = {
    profileId?: SortOrder
    bytes?: SortOrder
    mimeType?: SortOrder
    hash?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type ProfileImageWhereUniqueInput = Prisma.AtLeast<
    {
      profileId?: string
      AND?: ProfileImageWhereInput | ProfileImageWhereInput[]
      OR?: ProfileImageWhereInput[]
      NOT?: ProfileImageWhereInput | ProfileImageWhereInput[]
      bytes?: BytesFilter<'ProfileImage'> | Bytes
      mimeType?: StringFilter<'ProfileImage'> | string
      hash?: StringFilter<'ProfileImage'> | string
      updatedAt?: DateTimeFilter<'ProfileImage'> | Date | string
      profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    },
    'profileId'
  >

  export type ProfileImageOrderByWithAggregationInput = {
    profileId?: SortOrder
    bytes?: SortOrder
    mimeType?: SortOrder
    hash?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileImageCountOrderByAggregateInput
    _max?: ProfileImageMaxOrderByAggregateInput
    _min?: ProfileImageMinOrderByAggregateInput
  }

  export type ProfileImageScalarWhereWithAggregatesInput = {
    AND?: ProfileImageScalarWhereWithAggregatesInput | ProfileImageScalarWhereWithAggregatesInput[]
    OR?: ProfileImageScalarWhereWithAggregatesInput[]
    NOT?: ProfileImageScalarWhereWithAggregatesInput | ProfileImageScalarWhereWithAggregatesInput[]
    profileId?: StringWithAggregatesFilter<'ProfileImage'> | string
    bytes?: BytesWithAggregatesFilter<'ProfileImage'> | Bytes
    mimeType?: StringWithAggregatesFilter<'ProfileImage'> | string
    hash?: StringWithAggregatesFilter<'ProfileImage'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'ProfileImage'> | Date | string
  }

  export type PushSubscriptionWhereInput = {
    AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    OR?: PushSubscriptionWhereInput[]
    NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    id?: StringFilter<'PushSubscription'> | string
    profileId?: StringFilter<'PushSubscription'> | string
    endpoint?: StringFilter<'PushSubscription'> | string
    p256dhKey?: StringFilter<'PushSubscription'> | string
    authKey?: StringFilter<'PushSubscription'> | string
    createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type PushSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    endpoint?: SortOrder
    p256dhKey?: SortOrder
    authKey?: SortOrder
    createdAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type PushSubscriptionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      endpoint?: string
      AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
      OR?: PushSubscriptionWhereInput[]
      NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
      profileId?: StringFilter<'PushSubscription'> | string
      p256dhKey?: StringFilter<'PushSubscription'> | string
      authKey?: StringFilter<'PushSubscription'> | string
      createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
      profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    },
    'id' | 'endpoint'
  >

  export type PushSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    endpoint?: SortOrder
    p256dhKey?: SortOrder
    authKey?: SortOrder
    createdAt?: SortOrder
    _count?: PushSubscriptionCountOrderByAggregateInput
    _max?: PushSubscriptionMaxOrderByAggregateInput
    _min?: PushSubscriptionMinOrderByAggregateInput
  }

  export type PushSubscriptionScalarWhereWithAggregatesInput = {
    AND?:
      | PushSubscriptionScalarWhereWithAggregatesInput
      | PushSubscriptionScalarWhereWithAggregatesInput[]
    OR?: PushSubscriptionScalarWhereWithAggregatesInput[]
    NOT?:
      | PushSubscriptionScalarWhereWithAggregatesInput
      | PushSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'PushSubscription'> | string
    profileId?: StringWithAggregatesFilter<'PushSubscription'> | string
    endpoint?: StringWithAggregatesFilter<'PushSubscription'> | string
    p256dhKey?: StringWithAggregatesFilter<'PushSubscription'> | string
    authKey?: StringWithAggregatesFilter<'PushSubscription'> | string
    createdAt?: DateTimeWithAggregatesFilter<'PushSubscription'> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<'Notification'> | string
    profileId?: StringFilter<'Notification'> | string
    title?: StringFilter<'Notification'> | string
    body?: StringNullableFilter<'Notification'> | string | null
    variant?: StringFilter<'Notification'> | string
    priority?: StringFilter<'Notification'> | string
    isRead?: BoolFilter<'Notification'> | boolean
    createdAt?: DateTimeFilter<'Notification'> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    body?: SortOrderInput | SortOrder
    variant?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: NotificationWhereInput | NotificationWhereInput[]
      OR?: NotificationWhereInput[]
      NOT?: NotificationWhereInput | NotificationWhereInput[]
      profileId?: StringFilter<'Notification'> | string
      title?: StringFilter<'Notification'> | string
      body?: StringNullableFilter<'Notification'> | string | null
      variant?: StringFilter<'Notification'> | string
      priority?: StringFilter<'Notification'> | string
      isRead?: BoolFilter<'Notification'> | boolean
      createdAt?: DateTimeFilter<'Notification'> | Date | string
      profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    },
    'id'
  >

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    body?: SortOrderInput | SortOrder
    variant?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'Notification'> | string
    profileId?: StringWithAggregatesFilter<'Notification'> | string
    title?: StringWithAggregatesFilter<'Notification'> | string
    body?: StringNullableWithAggregatesFilter<'Notification'> | string | null
    variant?: StringWithAggregatesFilter<'Notification'> | string
    priority?: StringWithAggregatesFilter<'Notification'> | string
    isRead?: BoolWithAggregatesFilter<'Notification'> | boolean
    createdAt?: DateTimeWithAggregatesFilter<'Notification'> | Date | string
  }

  export type WidgetLayoutWhereInput = {
    AND?: WidgetLayoutWhereInput | WidgetLayoutWhereInput[]
    OR?: WidgetLayoutWhereInput[]
    NOT?: WidgetLayoutWhereInput | WidgetLayoutWhereInput[]
    id?: StringFilter<'WidgetLayout'> | string
    profileId?: StringFilter<'WidgetLayout'> | string
    widgetId?: StringFilter<'WidgetLayout'> | string
    x?: IntFilter<'WidgetLayout'> | number
    y?: IntFilter<'WidgetLayout'> | number
    w?: IntFilter<'WidgetLayout'> | number
    h?: IntFilter<'WidgetLayout'> | number
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type WidgetLayoutOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    widgetId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type WidgetLayoutWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: WidgetLayoutWhereInput | WidgetLayoutWhereInput[]
      OR?: WidgetLayoutWhereInput[]
      NOT?: WidgetLayoutWhereInput | WidgetLayoutWhereInput[]
      profileId?: StringFilter<'WidgetLayout'> | string
      widgetId?: StringFilter<'WidgetLayout'> | string
      x?: IntFilter<'WidgetLayout'> | number
      y?: IntFilter<'WidgetLayout'> | number
      w?: IntFilter<'WidgetLayout'> | number
      h?: IntFilter<'WidgetLayout'> | number
      profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    },
    'id'
  >

  export type WidgetLayoutOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    widgetId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
    _count?: WidgetLayoutCountOrderByAggregateInput
    _avg?: WidgetLayoutAvgOrderByAggregateInput
    _max?: WidgetLayoutMaxOrderByAggregateInput
    _min?: WidgetLayoutMinOrderByAggregateInput
    _sum?: WidgetLayoutSumOrderByAggregateInput
  }

  export type WidgetLayoutScalarWhereWithAggregatesInput = {
    AND?: WidgetLayoutScalarWhereWithAggregatesInput | WidgetLayoutScalarWhereWithAggregatesInput[]
    OR?: WidgetLayoutScalarWhereWithAggregatesInput[]
    NOT?: WidgetLayoutScalarWhereWithAggregatesInput | WidgetLayoutScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'WidgetLayout'> | string
    profileId?: StringWithAggregatesFilter<'WidgetLayout'> | string
    widgetId?: StringWithAggregatesFilter<'WidgetLayout'> | string
    x?: IntWithAggregatesFilter<'WidgetLayout'> | number
    y?: IntWithAggregatesFilter<'WidgetLayout'> | number
    w?: IntWithAggregatesFilter<'WidgetLayout'> | number
    h?: IntWithAggregatesFilter<'WidgetLayout'> | number
  }

  export type PermissionOverrideWhereInput = {
    AND?: PermissionOverrideWhereInput | PermissionOverrideWhereInput[]
    OR?: PermissionOverrideWhereInput[]
    NOT?: PermissionOverrideWhereInput | PermissionOverrideWhereInput[]
    id?: StringFilter<'PermissionOverride'> | string
    profileId?: StringFilter<'PermissionOverride'> | string
    action?: StringFilter<'PermissionOverride'> | string
    subject?: StringFilter<'PermissionOverride'> | string
    type?: StringFilter<'PermissionOverride'> | string
    grantedBy?: StringNullableFilter<'PermissionOverride'> | string | null
    createdAt?: DateTimeFilter<'PermissionOverride'> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    grantor?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
  }

  export type PermissionOverrideOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    action?: SortOrder
    subject?: SortOrder
    type?: SortOrder
    grantedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    grantor?: ProfileOrderByWithRelationInput
  }

  export type PermissionOverrideWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: PermissionOverrideWhereInput | PermissionOverrideWhereInput[]
      OR?: PermissionOverrideWhereInput[]
      NOT?: PermissionOverrideWhereInput | PermissionOverrideWhereInput[]
      profileId?: StringFilter<'PermissionOverride'> | string
      action?: StringFilter<'PermissionOverride'> | string
      subject?: StringFilter<'PermissionOverride'> | string
      type?: StringFilter<'PermissionOverride'> | string
      grantedBy?: StringNullableFilter<'PermissionOverride'> | string | null
      createdAt?: DateTimeFilter<'PermissionOverride'> | Date | string
      profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
      grantor?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    },
    'id'
  >

  export type PermissionOverrideOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    action?: SortOrder
    subject?: SortOrder
    type?: SortOrder
    grantedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PermissionOverrideCountOrderByAggregateInput
    _max?: PermissionOverrideMaxOrderByAggregateInput
    _min?: PermissionOverrideMinOrderByAggregateInput
  }

  export type PermissionOverrideScalarWhereWithAggregatesInput = {
    AND?:
      | PermissionOverrideScalarWhereWithAggregatesInput
      | PermissionOverrideScalarWhereWithAggregatesInput[]
    OR?: PermissionOverrideScalarWhereWithAggregatesInput[]
    NOT?:
      | PermissionOverrideScalarWhereWithAggregatesInput
      | PermissionOverrideScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'PermissionOverride'> | string
    profileId?: StringWithAggregatesFilter<'PermissionOverride'> | string
    action?: StringWithAggregatesFilter<'PermissionOverride'> | string
    subject?: StringWithAggregatesFilter<'PermissionOverride'> | string
    type?: StringWithAggregatesFilter<'PermissionOverride'> | string
    grantedBy?: StringNullableWithAggregatesFilter<'PermissionOverride'> | string | null
    createdAt?: DateTimeWithAggregatesFilter<'PermissionOverride'> | Date | string
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    key?: StringFilter<'SystemConfig'> | string
    value?: JsonFilter<'SystemConfig'>
    updatedBy?: StringNullableFilter<'SystemConfig'> | string | null
    updatedAt?: DateTimeFilter<'SystemConfig'> | Date | string
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
  }

  export type SystemConfigOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<
    {
      key?: string
      AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
      OR?: SystemConfigWhereInput[]
      NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
      value?: JsonFilter<'SystemConfig'>
      updatedBy?: StringNullableFilter<'SystemConfig'> | string | null
      updatedAt?: DateTimeFilter<'SystemConfig'> | Date | string
      profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    },
    'key'
  >

  export type SystemConfigOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<'SystemConfig'> | string
    value?: JsonWithAggregatesFilter<'SystemConfig'>
    updatedBy?: StringNullableWithAggregatesFilter<'SystemConfig'> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<'SystemConfig'> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    sid?: StringFilter<'Session'> | string
    sess?: JsonFilter<'Session'>
    expire?: DateTimeFilter<'Session'> | Date | string
  }

  export type SessionOrderByWithRelationInput = {
    sid?: SortOrder
    sess?: SortOrder
    expire?: SortOrder
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<
    {
      sid?: string
      AND?: SessionWhereInput | SessionWhereInput[]
      OR?: SessionWhereInput[]
      NOT?: SessionWhereInput | SessionWhereInput[]
      sess?: JsonFilter<'Session'>
      expire?: DateTimeFilter<'Session'> | Date | string
    },
    'sid'
  >

  export type SessionOrderByWithAggregationInput = {
    sid?: SortOrder
    sess?: SortOrder
    expire?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    sid?: StringWithAggregatesFilter<'Session'> | string
    sess?: JsonWithAggregatesFilter<'Session'>
    expire?: DateTimeWithAggregatesFilter<'Session'> | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileImageCreateInput = {
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutImageInput
  }

  export type ProfileImageUncheckedCreateInput = {
    profileId: string
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt?: Date | string
  }

  export type ProfileImageUpdateInput = {
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutImageNestedInput
  }

  export type ProfileImageUncheckedUpdateInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileImageCreateManyInput = {
    profileId: string
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt?: Date | string
  }

  export type ProfileImageUpdateManyMutationInput = {
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileImageUncheckedUpdateManyInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionCreateInput = {
    id?: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
    profile: ProfileCreateNestedOneWithoutPushSubscriptionsInput
  }

  export type PushSubscriptionUncheckedCreateInput = {
    id?: string
    profileId: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutPushSubscriptionsNestedInput
  }

  export type PushSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionCreateManyInput = {
    id?: string
    profileId: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
    profile: ProfileCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    profileId: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    profileId: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetLayoutCreateInput = {
    id?: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
    profile: ProfileCreateNestedOneWithoutWidgetLayoutsInput
  }

  export type WidgetLayoutUncheckedCreateInput = {
    id?: string
    profileId: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
  }

  export type WidgetLayoutUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
    profile?: ProfileUpdateOneRequiredWithoutWidgetLayoutsNestedInput
  }

  export type WidgetLayoutUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type WidgetLayoutCreateManyInput = {
    id?: string
    profileId: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
  }

  export type WidgetLayoutUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type WidgetLayoutUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type PermissionOverrideCreateInput = {
    id?: string
    action: string
    subject: string
    type: string
    createdAt?: Date | string
    profile: ProfileCreateNestedOneWithoutPermissionOverridesInput
    grantor?: ProfileCreateNestedOneWithoutGrantedOverridesInput
  }

  export type PermissionOverrideUncheckedCreateInput = {
    id?: string
    profileId: string
    action: string
    subject: string
    type: string
    grantedBy?: string | null
    createdAt?: Date | string
  }

  export type PermissionOverrideUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutPermissionOverridesNestedInput
    grantor?: ProfileUpdateOneWithoutGrantedOverridesNestedInput
  }

  export type PermissionOverrideUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    grantedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionOverrideCreateManyInput = {
    id?: string
    profileId: string
    action: string
    subject: string
    type: string
    grantedBy?: string | null
    createdAt?: Date | string
  }

  export type PermissionOverrideUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionOverrideUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    grantedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    profile?: ProfileCreateNestedOneWithoutSystemConfigsInput
  }

  export type SystemConfigUncheckedCreateInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedBy?: string | null
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutSystemConfigsNestedInput
  }

  export type SystemConfigUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedBy?: string | null
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    sid: string
    sess: JsonNullValueInput | InputJsonValue
    expire: Date | string
  }

  export type SessionUncheckedCreateInput = {
    sid: string
    sess: JsonNullValueInput | InputJsonValue
    expire: Date | string
  }

  export type SessionUpdateInput = {
    sid?: StringFieldUpdateOperationsInput | string
    sess?: JsonNullValueInput | InputJsonValue
    expire?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateInput = {
    sid?: StringFieldUpdateOperationsInput | string
    sess?: JsonNullValueInput | InputJsonValue
    expire?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    sid: string
    sess: JsonNullValueInput | InputJsonValue
    expire: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    sid?: StringFieldUpdateOperationsInput | string
    sess?: JsonNullValueInput | InputJsonValue
    expire?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    sid?: StringFieldUpdateOperationsInput | string
    sess?: JsonNullValueInput | InputJsonValue
    expire?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type PermissionOverrideListRelationFilter = {
    every?: PermissionOverrideWhereInput
    some?: PermissionOverrideWhereInput
    none?: PermissionOverrideWhereInput
  }

  export type SystemConfigListRelationFilter = {
    every?: SystemConfigWhereInput
    some?: SystemConfigWhereInput
    none?: SystemConfigWhereInput
  }

  export type WidgetLayoutListRelationFilter = {
    every?: WidgetLayoutWhereInput
    some?: WidgetLayoutWhereInput
    none?: WidgetLayoutWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type PushSubscriptionListRelationFilter = {
    every?: PushSubscriptionWhereInput
    some?: PushSubscriptionWhereInput
    none?: PushSubscriptionWhereInput
  }

  export type ProfileImageNullableScalarRelationFilter = {
    is?: ProfileImageWhereInput | null
    isNot?: ProfileImageWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PermissionOverrideOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SystemConfigOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WidgetLayoutOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PushSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    tier?: SortOrder
    identityHue?: SortOrder
    avatarUrl?: SortOrder
    darkMode?: SortOrder
    focusMode?: SortOrder
    pushEnabled?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    tier?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    tier?: SortOrder
    identityHue?: SortOrder
    avatarUrl?: SortOrder
    darkMode?: SortOrder
    focusMode?: SortOrder
    pushEnabled?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    tier?: SortOrder
    identityHue?: SortOrder
    avatarUrl?: SortOrder
    darkMode?: SortOrder
    focusMode?: SortOrder
    pushEnabled?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    tier?: SortOrder
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type ProfileImageCountOrderByAggregateInput = {
    profileId?: SortOrder
    bytes?: SortOrder
    mimeType?: SortOrder
    hash?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileImageMaxOrderByAggregateInput = {
    profileId?: SortOrder
    bytes?: SortOrder
    mimeType?: SortOrder
    hash?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileImageMinOrderByAggregateInput = {
    profileId?: SortOrder
    bytes?: SortOrder
    mimeType?: SortOrder
    hash?: SortOrder
    updatedAt?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type PushSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    endpoint?: SortOrder
    p256dhKey?: SortOrder
    authKey?: SortOrder
    createdAt?: SortOrder
  }

  export type PushSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    endpoint?: SortOrder
    p256dhKey?: SortOrder
    authKey?: SortOrder
    createdAt?: SortOrder
  }

  export type PushSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    endpoint?: SortOrder
    p256dhKey?: SortOrder
    authKey?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    variant?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    variant?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    variant?: SortOrder
    priority?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type WidgetLayoutCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    widgetId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
  }

  export type WidgetLayoutAvgOrderByAggregateInput = {
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
  }

  export type WidgetLayoutMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    widgetId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
  }

  export type WidgetLayoutMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    widgetId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
  }

  export type WidgetLayoutSumOrderByAggregateInput = {
    x?: SortOrder
    y?: SortOrder
    w?: SortOrder
    h?: SortOrder
  }

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type PermissionOverrideCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    action?: SortOrder
    subject?: SortOrder
    type?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PermissionOverrideMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    action?: SortOrder
    subject?: SortOrder
    type?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PermissionOverrideMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    action?: SortOrder
    subject?: SortOrder
    type?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SystemConfigCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    key?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    key?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    sid?: SortOrder
    sess?: SortOrder
    expire?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    sid?: SortOrder
    expire?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    sid?: SortOrder
    expire?: SortOrder
  }

  export type PermissionOverrideCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutProfileInput,
          PermissionOverrideUncheckedCreateWithoutProfileInput
        >
      | PermissionOverrideCreateWithoutProfileInput[]
      | PermissionOverrideUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutProfileInput
      | PermissionOverrideCreateOrConnectWithoutProfileInput[]
    createMany?: PermissionOverrideCreateManyProfileInputEnvelope
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
  }

  export type PermissionOverrideCreateNestedManyWithoutGrantorInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutGrantorInput,
          PermissionOverrideUncheckedCreateWithoutGrantorInput
        >
      | PermissionOverrideCreateWithoutGrantorInput[]
      | PermissionOverrideUncheckedCreateWithoutGrantorInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutGrantorInput
      | PermissionOverrideCreateOrConnectWithoutGrantorInput[]
    createMany?: PermissionOverrideCreateManyGrantorInputEnvelope
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
  }

  export type SystemConfigCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<SystemConfigCreateWithoutProfileInput, SystemConfigUncheckedCreateWithoutProfileInput>
      | SystemConfigCreateWithoutProfileInput[]
      | SystemConfigUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | SystemConfigCreateOrConnectWithoutProfileInput
      | SystemConfigCreateOrConnectWithoutProfileInput[]
    createMany?: SystemConfigCreateManyProfileInputEnvelope
    connect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
  }

  export type WidgetLayoutCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<WidgetLayoutCreateWithoutProfileInput, WidgetLayoutUncheckedCreateWithoutProfileInput>
      | WidgetLayoutCreateWithoutProfileInput[]
      | WidgetLayoutUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | WidgetLayoutCreateOrConnectWithoutProfileInput
      | WidgetLayoutCreateOrConnectWithoutProfileInput[]
    createMany?: WidgetLayoutCreateManyProfileInputEnvelope
    connect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<NotificationCreateWithoutProfileInput, NotificationUncheckedCreateWithoutProfileInput>
      | NotificationCreateWithoutProfileInput[]
      | NotificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutProfileInput
      | NotificationCreateOrConnectWithoutProfileInput[]
    createMany?: NotificationCreateManyProfileInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PushSubscriptionCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutProfileInput,
          PushSubscriptionUncheckedCreateWithoutProfileInput
        >
      | PushSubscriptionCreateWithoutProfileInput[]
      | PushSubscriptionUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutProfileInput
      | PushSubscriptionCreateOrConnectWithoutProfileInput[]
    createMany?: PushSubscriptionCreateManyProfileInputEnvelope
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
  }

  export type ProfileImageCreateNestedOneWithoutProfileInput = {
    create?: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
    connectOrCreate?: ProfileImageCreateOrConnectWithoutProfileInput
    connect?: ProfileImageWhereUniqueInput
  }

  export type PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutProfileInput,
          PermissionOverrideUncheckedCreateWithoutProfileInput
        >
      | PermissionOverrideCreateWithoutProfileInput[]
      | PermissionOverrideUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutProfileInput
      | PermissionOverrideCreateOrConnectWithoutProfileInput[]
    createMany?: PermissionOverrideCreateManyProfileInputEnvelope
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
  }

  export type PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutGrantorInput,
          PermissionOverrideUncheckedCreateWithoutGrantorInput
        >
      | PermissionOverrideCreateWithoutGrantorInput[]
      | PermissionOverrideUncheckedCreateWithoutGrantorInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutGrantorInput
      | PermissionOverrideCreateOrConnectWithoutGrantorInput[]
    createMany?: PermissionOverrideCreateManyGrantorInputEnvelope
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
  }

  export type SystemConfigUncheckedCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<SystemConfigCreateWithoutProfileInput, SystemConfigUncheckedCreateWithoutProfileInput>
      | SystemConfigCreateWithoutProfileInput[]
      | SystemConfigUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | SystemConfigCreateOrConnectWithoutProfileInput
      | SystemConfigCreateOrConnectWithoutProfileInput[]
    createMany?: SystemConfigCreateManyProfileInputEnvelope
    connect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
  }

  export type WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<WidgetLayoutCreateWithoutProfileInput, WidgetLayoutUncheckedCreateWithoutProfileInput>
      | WidgetLayoutCreateWithoutProfileInput[]
      | WidgetLayoutUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | WidgetLayoutCreateOrConnectWithoutProfileInput
      | WidgetLayoutCreateOrConnectWithoutProfileInput[]
    createMany?: WidgetLayoutCreateManyProfileInputEnvelope
    connect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<NotificationCreateWithoutProfileInput, NotificationUncheckedCreateWithoutProfileInput>
      | NotificationCreateWithoutProfileInput[]
      | NotificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutProfileInput
      | NotificationCreateOrConnectWithoutProfileInput[]
    createMany?: NotificationCreateManyProfileInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutProfileInput,
          PushSubscriptionUncheckedCreateWithoutProfileInput
        >
      | PushSubscriptionCreateWithoutProfileInput[]
      | PushSubscriptionUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutProfileInput
      | PushSubscriptionCreateOrConnectWithoutProfileInput[]
    createMany?: PushSubscriptionCreateManyProfileInputEnvelope
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
  }

  export type ProfileImageUncheckedCreateNestedOneWithoutProfileInput = {
    create?: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
    connectOrCreate?: ProfileImageCreateOrConnectWithoutProfileInput
    connect?: ProfileImageWhereUniqueInput
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

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PermissionOverrideUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutProfileInput,
          PermissionOverrideUncheckedCreateWithoutProfileInput
        >
      | PermissionOverrideCreateWithoutProfileInput[]
      | PermissionOverrideUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutProfileInput
      | PermissionOverrideCreateOrConnectWithoutProfileInput[]
    upsert?:
      | PermissionOverrideUpsertWithWhereUniqueWithoutProfileInput
      | PermissionOverrideUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: PermissionOverrideCreateManyProfileInputEnvelope
    set?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    disconnect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    delete?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    update?:
      | PermissionOverrideUpdateWithWhereUniqueWithoutProfileInput
      | PermissionOverrideUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | PermissionOverrideUpdateManyWithWhereWithoutProfileInput
      | PermissionOverrideUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
  }

  export type PermissionOverrideUpdateManyWithoutGrantorNestedInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutGrantorInput,
          PermissionOverrideUncheckedCreateWithoutGrantorInput
        >
      | PermissionOverrideCreateWithoutGrantorInput[]
      | PermissionOverrideUncheckedCreateWithoutGrantorInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutGrantorInput
      | PermissionOverrideCreateOrConnectWithoutGrantorInput[]
    upsert?:
      | PermissionOverrideUpsertWithWhereUniqueWithoutGrantorInput
      | PermissionOverrideUpsertWithWhereUniqueWithoutGrantorInput[]
    createMany?: PermissionOverrideCreateManyGrantorInputEnvelope
    set?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    disconnect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    delete?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    update?:
      | PermissionOverrideUpdateWithWhereUniqueWithoutGrantorInput
      | PermissionOverrideUpdateWithWhereUniqueWithoutGrantorInput[]
    updateMany?:
      | PermissionOverrideUpdateManyWithWhereWithoutGrantorInput
      | PermissionOverrideUpdateManyWithWhereWithoutGrantorInput[]
    deleteMany?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
  }

  export type SystemConfigUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<SystemConfigCreateWithoutProfileInput, SystemConfigUncheckedCreateWithoutProfileInput>
      | SystemConfigCreateWithoutProfileInput[]
      | SystemConfigUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | SystemConfigCreateOrConnectWithoutProfileInput
      | SystemConfigCreateOrConnectWithoutProfileInput[]
    upsert?:
      | SystemConfigUpsertWithWhereUniqueWithoutProfileInput
      | SystemConfigUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SystemConfigCreateManyProfileInputEnvelope
    set?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    disconnect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    delete?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    connect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    update?:
      | SystemConfigUpdateWithWhereUniqueWithoutProfileInput
      | SystemConfigUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | SystemConfigUpdateManyWithWhereWithoutProfileInput
      | SystemConfigUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SystemConfigScalarWhereInput | SystemConfigScalarWhereInput[]
  }

  export type WidgetLayoutUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<WidgetLayoutCreateWithoutProfileInput, WidgetLayoutUncheckedCreateWithoutProfileInput>
      | WidgetLayoutCreateWithoutProfileInput[]
      | WidgetLayoutUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | WidgetLayoutCreateOrConnectWithoutProfileInput
      | WidgetLayoutCreateOrConnectWithoutProfileInput[]
    upsert?:
      | WidgetLayoutUpsertWithWhereUniqueWithoutProfileInput
      | WidgetLayoutUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: WidgetLayoutCreateManyProfileInputEnvelope
    set?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    disconnect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    delete?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    connect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    update?:
      | WidgetLayoutUpdateWithWhereUniqueWithoutProfileInput
      | WidgetLayoutUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | WidgetLayoutUpdateManyWithWhereWithoutProfileInput
      | WidgetLayoutUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: WidgetLayoutScalarWhereInput | WidgetLayoutScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<NotificationCreateWithoutProfileInput, NotificationUncheckedCreateWithoutProfileInput>
      | NotificationCreateWithoutProfileInput[]
      | NotificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutProfileInput
      | NotificationCreateOrConnectWithoutProfileInput[]
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutProfileInput
      | NotificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: NotificationCreateManyProfileInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?:
      | NotificationUpdateWithWhereUniqueWithoutProfileInput
      | NotificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutProfileInput
      | NotificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PushSubscriptionUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutProfileInput,
          PushSubscriptionUncheckedCreateWithoutProfileInput
        >
      | PushSubscriptionCreateWithoutProfileInput[]
      | PushSubscriptionUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutProfileInput
      | PushSubscriptionCreateOrConnectWithoutProfileInput[]
    upsert?:
      | PushSubscriptionUpsertWithWhereUniqueWithoutProfileInput
      | PushSubscriptionUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: PushSubscriptionCreateManyProfileInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    delete?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    update?:
      | PushSubscriptionUpdateWithWhereUniqueWithoutProfileInput
      | PushSubscriptionUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | PushSubscriptionUpdateManyWithWhereWithoutProfileInput
      | PushSubscriptionUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
  }

  export type ProfileImageUpdateOneWithoutProfileNestedInput = {
    create?: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
    connectOrCreate?: ProfileImageCreateOrConnectWithoutProfileInput
    upsert?: ProfileImageUpsertWithoutProfileInput
    disconnect?: ProfileImageWhereInput | boolean
    delete?: ProfileImageWhereInput | boolean
    connect?: ProfileImageWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileImageUpdateToOneWithWhereWithoutProfileInput,
        ProfileImageUpdateWithoutProfileInput
      >,
      ProfileImageUncheckedUpdateWithoutProfileInput
    >
  }

  export type PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutProfileInput,
          PermissionOverrideUncheckedCreateWithoutProfileInput
        >
      | PermissionOverrideCreateWithoutProfileInput[]
      | PermissionOverrideUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutProfileInput
      | PermissionOverrideCreateOrConnectWithoutProfileInput[]
    upsert?:
      | PermissionOverrideUpsertWithWhereUniqueWithoutProfileInput
      | PermissionOverrideUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: PermissionOverrideCreateManyProfileInputEnvelope
    set?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    disconnect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    delete?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    update?:
      | PermissionOverrideUpdateWithWhereUniqueWithoutProfileInput
      | PermissionOverrideUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | PermissionOverrideUpdateManyWithWhereWithoutProfileInput
      | PermissionOverrideUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
  }

  export type PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput = {
    create?:
      | XOR<
          PermissionOverrideCreateWithoutGrantorInput,
          PermissionOverrideUncheckedCreateWithoutGrantorInput
        >
      | PermissionOverrideCreateWithoutGrantorInput[]
      | PermissionOverrideUncheckedCreateWithoutGrantorInput[]
    connectOrCreate?:
      | PermissionOverrideCreateOrConnectWithoutGrantorInput
      | PermissionOverrideCreateOrConnectWithoutGrantorInput[]
    upsert?:
      | PermissionOverrideUpsertWithWhereUniqueWithoutGrantorInput
      | PermissionOverrideUpsertWithWhereUniqueWithoutGrantorInput[]
    createMany?: PermissionOverrideCreateManyGrantorInputEnvelope
    set?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    disconnect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    delete?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    connect?: PermissionOverrideWhereUniqueInput | PermissionOverrideWhereUniqueInput[]
    update?:
      | PermissionOverrideUpdateWithWhereUniqueWithoutGrantorInput
      | PermissionOverrideUpdateWithWhereUniqueWithoutGrantorInput[]
    updateMany?:
      | PermissionOverrideUpdateManyWithWhereWithoutGrantorInput
      | PermissionOverrideUpdateManyWithWhereWithoutGrantorInput[]
    deleteMany?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
  }

  export type SystemConfigUncheckedUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<SystemConfigCreateWithoutProfileInput, SystemConfigUncheckedCreateWithoutProfileInput>
      | SystemConfigCreateWithoutProfileInput[]
      | SystemConfigUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | SystemConfigCreateOrConnectWithoutProfileInput
      | SystemConfigCreateOrConnectWithoutProfileInput[]
    upsert?:
      | SystemConfigUpsertWithWhereUniqueWithoutProfileInput
      | SystemConfigUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SystemConfigCreateManyProfileInputEnvelope
    set?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    disconnect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    delete?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    connect?: SystemConfigWhereUniqueInput | SystemConfigWhereUniqueInput[]
    update?:
      | SystemConfigUpdateWithWhereUniqueWithoutProfileInput
      | SystemConfigUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | SystemConfigUpdateManyWithWhereWithoutProfileInput
      | SystemConfigUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SystemConfigScalarWhereInput | SystemConfigScalarWhereInput[]
  }

  export type WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<WidgetLayoutCreateWithoutProfileInput, WidgetLayoutUncheckedCreateWithoutProfileInput>
      | WidgetLayoutCreateWithoutProfileInput[]
      | WidgetLayoutUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | WidgetLayoutCreateOrConnectWithoutProfileInput
      | WidgetLayoutCreateOrConnectWithoutProfileInput[]
    upsert?:
      | WidgetLayoutUpsertWithWhereUniqueWithoutProfileInput
      | WidgetLayoutUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: WidgetLayoutCreateManyProfileInputEnvelope
    set?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    disconnect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    delete?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    connect?: WidgetLayoutWhereUniqueInput | WidgetLayoutWhereUniqueInput[]
    update?:
      | WidgetLayoutUpdateWithWhereUniqueWithoutProfileInput
      | WidgetLayoutUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | WidgetLayoutUpdateManyWithWhereWithoutProfileInput
      | WidgetLayoutUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: WidgetLayoutScalarWhereInput | WidgetLayoutScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<NotificationCreateWithoutProfileInput, NotificationUncheckedCreateWithoutProfileInput>
      | NotificationCreateWithoutProfileInput[]
      | NotificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutProfileInput
      | NotificationCreateOrConnectWithoutProfileInput[]
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutProfileInput
      | NotificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: NotificationCreateManyProfileInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?:
      | NotificationUpdateWithWhereUniqueWithoutProfileInput
      | NotificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutProfileInput
      | NotificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutProfileInput,
          PushSubscriptionUncheckedCreateWithoutProfileInput
        >
      | PushSubscriptionCreateWithoutProfileInput[]
      | PushSubscriptionUncheckedCreateWithoutProfileInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutProfileInput
      | PushSubscriptionCreateOrConnectWithoutProfileInput[]
    upsert?:
      | PushSubscriptionUpsertWithWhereUniqueWithoutProfileInput
      | PushSubscriptionUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: PushSubscriptionCreateManyProfileInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    delete?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    update?:
      | PushSubscriptionUpdateWithWhereUniqueWithoutProfileInput
      | PushSubscriptionUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?:
      | PushSubscriptionUpdateManyWithWhereWithoutProfileInput
      | PushSubscriptionUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
  }

  export type ProfileImageUncheckedUpdateOneWithoutProfileNestedInput = {
    create?: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
    connectOrCreate?: ProfileImageCreateOrConnectWithoutProfileInput
    upsert?: ProfileImageUpsertWithoutProfileInput
    disconnect?: ProfileImageWhereInput | boolean
    delete?: ProfileImageWhereInput | boolean
    connect?: ProfileImageWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileImageUpdateToOneWithWhereWithoutProfileInput,
        ProfileImageUpdateWithoutProfileInput
      >,
      ProfileImageUncheckedUpdateWithoutProfileInput
    >
  }

  export type ProfileCreateNestedOneWithoutImageInput = {
    create?: XOR<ProfileCreateWithoutImageInput, ProfileUncheckedCreateWithoutImageInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutImageInput
    connect?: ProfileWhereUniqueInput
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Bytes
  }

  export type ProfileUpdateOneRequiredWithoutImageNestedInput = {
    create?: XOR<ProfileCreateWithoutImageInput, ProfileUncheckedCreateWithoutImageInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutImageInput
    upsert?: ProfileUpsertWithoutImageInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<ProfileUpdateToOneWithWhereWithoutImageInput, ProfileUpdateWithoutImageInput>,
      ProfileUncheckedUpdateWithoutImageInput
    >
  }

  export type ProfileCreateNestedOneWithoutPushSubscriptionsInput = {
    create?: XOR<
      ProfileCreateWithoutPushSubscriptionsInput,
      ProfileUncheckedCreateWithoutPushSubscriptionsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutPushSubscriptionsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutPushSubscriptionsNestedInput = {
    create?: XOR<
      ProfileCreateWithoutPushSubscriptionsInput,
      ProfileUncheckedCreateWithoutPushSubscriptionsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutPushSubscriptionsInput
    upsert?: ProfileUpsertWithoutPushSubscriptionsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutPushSubscriptionsInput,
        ProfileUpdateWithoutPushSubscriptionsInput
      >,
      ProfileUncheckedUpdateWithoutPushSubscriptionsInput
    >
  }

  export type ProfileCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<
      ProfileCreateWithoutNotificationsInput,
      ProfileUncheckedCreateWithoutNotificationsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutNotificationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<
      ProfileCreateWithoutNotificationsInput,
      ProfileUncheckedCreateWithoutNotificationsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutNotificationsInput
    upsert?: ProfileUpsertWithoutNotificationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutNotificationsInput,
        ProfileUpdateWithoutNotificationsInput
      >,
      ProfileUncheckedUpdateWithoutNotificationsInput
    >
  }

  export type ProfileCreateNestedOneWithoutWidgetLayoutsInput = {
    create?: XOR<
      ProfileCreateWithoutWidgetLayoutsInput,
      ProfileUncheckedCreateWithoutWidgetLayoutsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutWidgetLayoutsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutWidgetLayoutsNestedInput = {
    create?: XOR<
      ProfileCreateWithoutWidgetLayoutsInput,
      ProfileUncheckedCreateWithoutWidgetLayoutsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutWidgetLayoutsInput
    upsert?: ProfileUpsertWithoutWidgetLayoutsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutWidgetLayoutsInput,
        ProfileUpdateWithoutWidgetLayoutsInput
      >,
      ProfileUncheckedUpdateWithoutWidgetLayoutsInput
    >
  }

  export type ProfileCreateNestedOneWithoutPermissionOverridesInput = {
    create?: XOR<
      ProfileCreateWithoutPermissionOverridesInput,
      ProfileUncheckedCreateWithoutPermissionOverridesInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutPermissionOverridesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutGrantedOverridesInput = {
    create?: XOR<
      ProfileCreateWithoutGrantedOverridesInput,
      ProfileUncheckedCreateWithoutGrantedOverridesInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutGrantedOverridesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutPermissionOverridesNestedInput = {
    create?: XOR<
      ProfileCreateWithoutPermissionOverridesInput,
      ProfileUncheckedCreateWithoutPermissionOverridesInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutPermissionOverridesInput
    upsert?: ProfileUpsertWithoutPermissionOverridesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutPermissionOverridesInput,
        ProfileUpdateWithoutPermissionOverridesInput
      >,
      ProfileUncheckedUpdateWithoutPermissionOverridesInput
    >
  }

  export type ProfileUpdateOneWithoutGrantedOverridesNestedInput = {
    create?: XOR<
      ProfileCreateWithoutGrantedOverridesInput,
      ProfileUncheckedCreateWithoutGrantedOverridesInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutGrantedOverridesInput
    upsert?: ProfileUpsertWithoutGrantedOverridesInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutGrantedOverridesInput,
        ProfileUpdateWithoutGrantedOverridesInput
      >,
      ProfileUncheckedUpdateWithoutGrantedOverridesInput
    >
  }

  export type ProfileCreateNestedOneWithoutSystemConfigsInput = {
    create?: XOR<
      ProfileCreateWithoutSystemConfigsInput,
      ProfileUncheckedCreateWithoutSystemConfigsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutSystemConfigsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneWithoutSystemConfigsNestedInput = {
    create?: XOR<
      ProfileCreateWithoutSystemConfigsInput,
      ProfileUncheckedCreateWithoutSystemConfigsInput
    >
    connectOrCreate?: ProfileCreateOrConnectWithoutSystemConfigsInput
    upsert?: ProfileUpsertWithoutSystemConfigsInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutSystemConfigsInput,
        ProfileUpdateWithoutSystemConfigsInput
      >,
      ProfileUncheckedUpdateWithoutSystemConfigsInput
    >
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PermissionOverrideCreateWithoutProfileInput = {
    id?: string
    action: string
    subject: string
    type: string
    createdAt?: Date | string
    grantor?: ProfileCreateNestedOneWithoutGrantedOverridesInput
  }

  export type PermissionOverrideUncheckedCreateWithoutProfileInput = {
    id?: string
    action: string
    subject: string
    type: string
    grantedBy?: string | null
    createdAt?: Date | string
  }

  export type PermissionOverrideCreateOrConnectWithoutProfileInput = {
    where: PermissionOverrideWhereUniqueInput
    create: XOR<
      PermissionOverrideCreateWithoutProfileInput,
      PermissionOverrideUncheckedCreateWithoutProfileInput
    >
  }

  export type PermissionOverrideCreateManyProfileInputEnvelope = {
    data: PermissionOverrideCreateManyProfileInput | PermissionOverrideCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type PermissionOverrideCreateWithoutGrantorInput = {
    id?: string
    action: string
    subject: string
    type: string
    createdAt?: Date | string
    profile: ProfileCreateNestedOneWithoutPermissionOverridesInput
  }

  export type PermissionOverrideUncheckedCreateWithoutGrantorInput = {
    id?: string
    profileId: string
    action: string
    subject: string
    type: string
    createdAt?: Date | string
  }

  export type PermissionOverrideCreateOrConnectWithoutGrantorInput = {
    where: PermissionOverrideWhereUniqueInput
    create: XOR<
      PermissionOverrideCreateWithoutGrantorInput,
      PermissionOverrideUncheckedCreateWithoutGrantorInput
    >
  }

  export type PermissionOverrideCreateManyGrantorInputEnvelope = {
    data: PermissionOverrideCreateManyGrantorInput | PermissionOverrideCreateManyGrantorInput[]
    skipDuplicates?: boolean
  }

  export type SystemConfigCreateWithoutProfileInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type SystemConfigUncheckedCreateWithoutProfileInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type SystemConfigCreateOrConnectWithoutProfileInput = {
    where: SystemConfigWhereUniqueInput
    create: XOR<
      SystemConfigCreateWithoutProfileInput,
      SystemConfigUncheckedCreateWithoutProfileInput
    >
  }

  export type SystemConfigCreateManyProfileInputEnvelope = {
    data: SystemConfigCreateManyProfileInput | SystemConfigCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type WidgetLayoutCreateWithoutProfileInput = {
    id?: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
  }

  export type WidgetLayoutUncheckedCreateWithoutProfileInput = {
    id?: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
  }

  export type WidgetLayoutCreateOrConnectWithoutProfileInput = {
    where: WidgetLayoutWhereUniqueInput
    create: XOR<
      WidgetLayoutCreateWithoutProfileInput,
      WidgetLayoutUncheckedCreateWithoutProfileInput
    >
  }

  export type WidgetLayoutCreateManyProfileInputEnvelope = {
    data: WidgetLayoutCreateManyProfileInput | WidgetLayoutCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutProfileInput = {
    id?: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutProfileInput = {
    id?: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutProfileInput = {
    where: NotificationWhereUniqueInput
    create: XOR<
      NotificationCreateWithoutProfileInput,
      NotificationUncheckedCreateWithoutProfileInput
    >
  }

  export type NotificationCreateManyProfileInputEnvelope = {
    data: NotificationCreateManyProfileInput | NotificationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type PushSubscriptionCreateWithoutProfileInput = {
    id?: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUncheckedCreateWithoutProfileInput = {
    id?: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
  }

  export type PushSubscriptionCreateOrConnectWithoutProfileInput = {
    where: PushSubscriptionWhereUniqueInput
    create: XOR<
      PushSubscriptionCreateWithoutProfileInput,
      PushSubscriptionUncheckedCreateWithoutProfileInput
    >
  }

  export type PushSubscriptionCreateManyProfileInputEnvelope = {
    data: PushSubscriptionCreateManyProfileInput | PushSubscriptionCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProfileImageCreateWithoutProfileInput = {
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt?: Date | string
  }

  export type ProfileImageUncheckedCreateWithoutProfileInput = {
    bytes: Bytes
    mimeType: string
    hash: string
    updatedAt?: Date | string
  }

  export type ProfileImageCreateOrConnectWithoutProfileInput = {
    where: ProfileImageWhereUniqueInput
    create: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
  }

  export type PermissionOverrideUpsertWithWhereUniqueWithoutProfileInput = {
    where: PermissionOverrideWhereUniqueInput
    update: XOR<
      PermissionOverrideUpdateWithoutProfileInput,
      PermissionOverrideUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      PermissionOverrideCreateWithoutProfileInput,
      PermissionOverrideUncheckedCreateWithoutProfileInput
    >
  }

  export type PermissionOverrideUpdateWithWhereUniqueWithoutProfileInput = {
    where: PermissionOverrideWhereUniqueInput
    data: XOR<
      PermissionOverrideUpdateWithoutProfileInput,
      PermissionOverrideUncheckedUpdateWithoutProfileInput
    >
  }

  export type PermissionOverrideUpdateManyWithWhereWithoutProfileInput = {
    where: PermissionOverrideScalarWhereInput
    data: XOR<
      PermissionOverrideUpdateManyMutationInput,
      PermissionOverrideUncheckedUpdateManyWithoutProfileInput
    >
  }

  export type PermissionOverrideScalarWhereInput = {
    AND?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
    OR?: PermissionOverrideScalarWhereInput[]
    NOT?: PermissionOverrideScalarWhereInput | PermissionOverrideScalarWhereInput[]
    id?: StringFilter<'PermissionOverride'> | string
    profileId?: StringFilter<'PermissionOverride'> | string
    action?: StringFilter<'PermissionOverride'> | string
    subject?: StringFilter<'PermissionOverride'> | string
    type?: StringFilter<'PermissionOverride'> | string
    grantedBy?: StringNullableFilter<'PermissionOverride'> | string | null
    createdAt?: DateTimeFilter<'PermissionOverride'> | Date | string
  }

  export type PermissionOverrideUpsertWithWhereUniqueWithoutGrantorInput = {
    where: PermissionOverrideWhereUniqueInput
    update: XOR<
      PermissionOverrideUpdateWithoutGrantorInput,
      PermissionOverrideUncheckedUpdateWithoutGrantorInput
    >
    create: XOR<
      PermissionOverrideCreateWithoutGrantorInput,
      PermissionOverrideUncheckedCreateWithoutGrantorInput
    >
  }

  export type PermissionOverrideUpdateWithWhereUniqueWithoutGrantorInput = {
    where: PermissionOverrideWhereUniqueInput
    data: XOR<
      PermissionOverrideUpdateWithoutGrantorInput,
      PermissionOverrideUncheckedUpdateWithoutGrantorInput
    >
  }

  export type PermissionOverrideUpdateManyWithWhereWithoutGrantorInput = {
    where: PermissionOverrideScalarWhereInput
    data: XOR<
      PermissionOverrideUpdateManyMutationInput,
      PermissionOverrideUncheckedUpdateManyWithoutGrantorInput
    >
  }

  export type SystemConfigUpsertWithWhereUniqueWithoutProfileInput = {
    where: SystemConfigWhereUniqueInput
    update: XOR<
      SystemConfigUpdateWithoutProfileInput,
      SystemConfigUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      SystemConfigCreateWithoutProfileInput,
      SystemConfigUncheckedCreateWithoutProfileInput
    >
  }

  export type SystemConfigUpdateWithWhereUniqueWithoutProfileInput = {
    where: SystemConfigWhereUniqueInput
    data: XOR<SystemConfigUpdateWithoutProfileInput, SystemConfigUncheckedUpdateWithoutProfileInput>
  }

  export type SystemConfigUpdateManyWithWhereWithoutProfileInput = {
    where: SystemConfigScalarWhereInput
    data: XOR<
      SystemConfigUpdateManyMutationInput,
      SystemConfigUncheckedUpdateManyWithoutProfileInput
    >
  }

  export type SystemConfigScalarWhereInput = {
    AND?: SystemConfigScalarWhereInput | SystemConfigScalarWhereInput[]
    OR?: SystemConfigScalarWhereInput[]
    NOT?: SystemConfigScalarWhereInput | SystemConfigScalarWhereInput[]
    key?: StringFilter<'SystemConfig'> | string
    value?: JsonFilter<'SystemConfig'>
    updatedBy?: StringNullableFilter<'SystemConfig'> | string | null
    updatedAt?: DateTimeFilter<'SystemConfig'> | Date | string
  }

  export type WidgetLayoutUpsertWithWhereUniqueWithoutProfileInput = {
    where: WidgetLayoutWhereUniqueInput
    update: XOR<
      WidgetLayoutUpdateWithoutProfileInput,
      WidgetLayoutUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      WidgetLayoutCreateWithoutProfileInput,
      WidgetLayoutUncheckedCreateWithoutProfileInput
    >
  }

  export type WidgetLayoutUpdateWithWhereUniqueWithoutProfileInput = {
    where: WidgetLayoutWhereUniqueInput
    data: XOR<WidgetLayoutUpdateWithoutProfileInput, WidgetLayoutUncheckedUpdateWithoutProfileInput>
  }

  export type WidgetLayoutUpdateManyWithWhereWithoutProfileInput = {
    where: WidgetLayoutScalarWhereInput
    data: XOR<
      WidgetLayoutUpdateManyMutationInput,
      WidgetLayoutUncheckedUpdateManyWithoutProfileInput
    >
  }

  export type WidgetLayoutScalarWhereInput = {
    AND?: WidgetLayoutScalarWhereInput | WidgetLayoutScalarWhereInput[]
    OR?: WidgetLayoutScalarWhereInput[]
    NOT?: WidgetLayoutScalarWhereInput | WidgetLayoutScalarWhereInput[]
    id?: StringFilter<'WidgetLayout'> | string
    profileId?: StringFilter<'WidgetLayout'> | string
    widgetId?: StringFilter<'WidgetLayout'> | string
    x?: IntFilter<'WidgetLayout'> | number
    y?: IntFilter<'WidgetLayout'> | number
    w?: IntFilter<'WidgetLayout'> | number
    h?: IntFilter<'WidgetLayout'> | number
  }

  export type NotificationUpsertWithWhereUniqueWithoutProfileInput = {
    where: NotificationWhereUniqueInput
    update: XOR<
      NotificationUpdateWithoutProfileInput,
      NotificationUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      NotificationCreateWithoutProfileInput,
      NotificationUncheckedCreateWithoutProfileInput
    >
  }

  export type NotificationUpdateWithWhereUniqueWithoutProfileInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutProfileInput, NotificationUncheckedUpdateWithoutProfileInput>
  }

  export type NotificationUpdateManyWithWhereWithoutProfileInput = {
    where: NotificationScalarWhereInput
    data: XOR<
      NotificationUpdateManyMutationInput,
      NotificationUncheckedUpdateManyWithoutProfileInput
    >
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<'Notification'> | string
    profileId?: StringFilter<'Notification'> | string
    title?: StringFilter<'Notification'> | string
    body?: StringNullableFilter<'Notification'> | string | null
    variant?: StringFilter<'Notification'> | string
    priority?: StringFilter<'Notification'> | string
    isRead?: BoolFilter<'Notification'> | boolean
    createdAt?: DateTimeFilter<'Notification'> | Date | string
  }

  export type PushSubscriptionUpsertWithWhereUniqueWithoutProfileInput = {
    where: PushSubscriptionWhereUniqueInput
    update: XOR<
      PushSubscriptionUpdateWithoutProfileInput,
      PushSubscriptionUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      PushSubscriptionCreateWithoutProfileInput,
      PushSubscriptionUncheckedCreateWithoutProfileInput
    >
  }

  export type PushSubscriptionUpdateWithWhereUniqueWithoutProfileInput = {
    where: PushSubscriptionWhereUniqueInput
    data: XOR<
      PushSubscriptionUpdateWithoutProfileInput,
      PushSubscriptionUncheckedUpdateWithoutProfileInput
    >
  }

  export type PushSubscriptionUpdateManyWithWhereWithoutProfileInput = {
    where: PushSubscriptionScalarWhereInput
    data: XOR<
      PushSubscriptionUpdateManyMutationInput,
      PushSubscriptionUncheckedUpdateManyWithoutProfileInput
    >
  }

  export type PushSubscriptionScalarWhereInput = {
    AND?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    OR?: PushSubscriptionScalarWhereInput[]
    NOT?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    id?: StringFilter<'PushSubscription'> | string
    profileId?: StringFilter<'PushSubscription'> | string
    endpoint?: StringFilter<'PushSubscription'> | string
    p256dhKey?: StringFilter<'PushSubscription'> | string
    authKey?: StringFilter<'PushSubscription'> | string
    createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
  }

  export type ProfileImageUpsertWithoutProfileInput = {
    update: XOR<
      ProfileImageUpdateWithoutProfileInput,
      ProfileImageUncheckedUpdateWithoutProfileInput
    >
    create: XOR<
      ProfileImageCreateWithoutProfileInput,
      ProfileImageUncheckedCreateWithoutProfileInput
    >
    where?: ProfileImageWhereInput
  }

  export type ProfileImageUpdateToOneWithWhereWithoutProfileInput = {
    where?: ProfileImageWhereInput
    data: XOR<ProfileImageUpdateWithoutProfileInput, ProfileImageUncheckedUpdateWithoutProfileInput>
  }

  export type ProfileImageUpdateWithoutProfileInput = {
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileImageUncheckedUpdateWithoutProfileInput = {
    bytes?: BytesFieldUpdateOperationsInput | Bytes
    mimeType?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateWithoutImageInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutImageInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutImageInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutImageInput, ProfileUncheckedCreateWithoutImageInput>
  }

  export type ProfileUpsertWithoutImageInput = {
    update: XOR<ProfileUpdateWithoutImageInput, ProfileUncheckedUpdateWithoutImageInput>
    create: XOR<ProfileCreateWithoutImageInput, ProfileUncheckedCreateWithoutImageInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutImageInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutImageInput, ProfileUncheckedUpdateWithoutImageInput>
  }

  export type ProfileUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutPushSubscriptionsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutPushSubscriptionsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutPushSubscriptionsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutPushSubscriptionsInput,
      ProfileUncheckedCreateWithoutPushSubscriptionsInput
    >
  }

  export type ProfileUpsertWithoutPushSubscriptionsInput = {
    update: XOR<
      ProfileUpdateWithoutPushSubscriptionsInput,
      ProfileUncheckedUpdateWithoutPushSubscriptionsInput
    >
    create: XOR<
      ProfileCreateWithoutPushSubscriptionsInput,
      ProfileUncheckedCreateWithoutPushSubscriptionsInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutPushSubscriptionsInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutPushSubscriptionsInput,
      ProfileUncheckedUpdateWithoutPushSubscriptionsInput
    >
  }

  export type ProfileUpdateWithoutPushSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutPushSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutNotificationsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutNotificationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutNotificationsInput,
      ProfileUncheckedCreateWithoutNotificationsInput
    >
  }

  export type ProfileUpsertWithoutNotificationsInput = {
    update: XOR<
      ProfileUpdateWithoutNotificationsInput,
      ProfileUncheckedUpdateWithoutNotificationsInput
    >
    create: XOR<
      ProfileCreateWithoutNotificationsInput,
      ProfileUncheckedCreateWithoutNotificationsInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutNotificationsInput,
      ProfileUncheckedUpdateWithoutNotificationsInput
    >
  }

  export type ProfileUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutWidgetLayoutsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutWidgetLayoutsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutWidgetLayoutsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutWidgetLayoutsInput,
      ProfileUncheckedCreateWithoutWidgetLayoutsInput
    >
  }

  export type ProfileUpsertWithoutWidgetLayoutsInput = {
    update: XOR<
      ProfileUpdateWithoutWidgetLayoutsInput,
      ProfileUncheckedUpdateWithoutWidgetLayoutsInput
    >
    create: XOR<
      ProfileCreateWithoutWidgetLayoutsInput,
      ProfileUncheckedCreateWithoutWidgetLayoutsInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutWidgetLayoutsInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutWidgetLayoutsInput,
      ProfileUncheckedUpdateWithoutWidgetLayoutsInput
    >
  }

  export type ProfileUpdateWithoutWidgetLayoutsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutWidgetLayoutsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutPermissionOverridesInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutPermissionOverridesInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutPermissionOverridesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutPermissionOverridesInput,
      ProfileUncheckedCreateWithoutPermissionOverridesInput
    >
  }

  export type ProfileCreateWithoutGrantedOverridesInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    systemConfigs?: SystemConfigCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutGrantedOverridesInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    systemConfigs?: SystemConfigUncheckedCreateNestedManyWithoutProfileInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutGrantedOverridesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutGrantedOverridesInput,
      ProfileUncheckedCreateWithoutGrantedOverridesInput
    >
  }

  export type ProfileUpsertWithoutPermissionOverridesInput = {
    update: XOR<
      ProfileUpdateWithoutPermissionOverridesInput,
      ProfileUncheckedUpdateWithoutPermissionOverridesInput
    >
    create: XOR<
      ProfileCreateWithoutPermissionOverridesInput,
      ProfileUncheckedCreateWithoutPermissionOverridesInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutPermissionOverridesInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutPermissionOverridesInput,
      ProfileUncheckedUpdateWithoutPermissionOverridesInput
    >
  }

  export type ProfileUpdateWithoutPermissionOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutPermissionOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUpsertWithoutGrantedOverridesInput = {
    update: XOR<
      ProfileUpdateWithoutGrantedOverridesInput,
      ProfileUncheckedUpdateWithoutGrantedOverridesInput
    >
    create: XOR<
      ProfileCreateWithoutGrantedOverridesInput,
      ProfileUncheckedCreateWithoutGrantedOverridesInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutGrantedOverridesInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutGrantedOverridesInput,
      ProfileUncheckedUpdateWithoutGrantedOverridesInput
    >
  }

  export type ProfileUpdateWithoutGrantedOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    systemConfigs?: SystemConfigUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutGrantedOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    systemConfigs?: SystemConfigUncheckedUpdateManyWithoutProfileNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutSystemConfigsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideCreateNestedManyWithoutGrantorInput
    widgetLayouts?: WidgetLayoutCreateNestedManyWithoutProfileInput
    notifications?: NotificationCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutProfileInput
    image?: ProfileImageCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutSystemConfigsInput = {
    id?: string
    name: string
    tier: number
    identityHue?: string | null
    avatarUrl?: string | null
    darkMode?: boolean | null
    focusMode?: boolean | null
    pushEnabled?: boolean
    createdAt?: Date | string
    permissionOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutProfileInput
    grantedOverrides?: PermissionOverrideUncheckedCreateNestedManyWithoutGrantorInput
    widgetLayouts?: WidgetLayoutUncheckedCreateNestedManyWithoutProfileInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutProfileInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutProfileInput
    image?: ProfileImageUncheckedCreateNestedOneWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutSystemConfigsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<
      ProfileCreateWithoutSystemConfigsInput,
      ProfileUncheckedCreateWithoutSystemConfigsInput
    >
  }

  export type ProfileUpsertWithoutSystemConfigsInput = {
    update: XOR<
      ProfileUpdateWithoutSystemConfigsInput,
      ProfileUncheckedUpdateWithoutSystemConfigsInput
    >
    create: XOR<
      ProfileCreateWithoutSystemConfigsInput,
      ProfileUncheckedCreateWithoutSystemConfigsInput
    >
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutSystemConfigsInput = {
    where?: ProfileWhereInput
    data: XOR<
      ProfileUpdateWithoutSystemConfigsInput,
      ProfileUncheckedUpdateWithoutSystemConfigsInput
    >
  }

  export type ProfileUpdateWithoutSystemConfigsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUpdateManyWithoutGrantorNestedInput
    widgetLayouts?: WidgetLayoutUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUpdateOneWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutSystemConfigsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tier?: IntFieldUpdateOperationsInput | number
    identityHue?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    darkMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    focusMode?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissionOverrides?: PermissionOverrideUncheckedUpdateManyWithoutProfileNestedInput
    grantedOverrides?: PermissionOverrideUncheckedUpdateManyWithoutGrantorNestedInput
    widgetLayouts?: WidgetLayoutUncheckedUpdateManyWithoutProfileNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutProfileNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutProfileNestedInput
    image?: ProfileImageUncheckedUpdateOneWithoutProfileNestedInput
  }

  export type PermissionOverrideCreateManyProfileInput = {
    id?: string
    action: string
    subject: string
    type: string
    grantedBy?: string | null
    createdAt?: Date | string
  }

  export type PermissionOverrideCreateManyGrantorInput = {
    id?: string
    profileId: string
    action: string
    subject: string
    type: string
    createdAt?: Date | string
  }

  export type SystemConfigCreateManyProfileInput = {
    key: string
    value: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type WidgetLayoutCreateManyProfileInput = {
    id?: string
    widgetId: string
    x: number
    y: number
    w: number
    h: number
  }

  export type NotificationCreateManyProfileInput = {
    id?: string
    title: string
    body?: string | null
    variant: string
    priority?: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type PushSubscriptionCreateManyProfileInput = {
    id?: string
    endpoint: string
    p256dhKey: string
    authKey: string
    createdAt?: Date | string
  }

  export type PermissionOverrideUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantor?: ProfileUpdateOneWithoutGrantedOverridesNestedInput
  }

  export type PermissionOverrideUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    grantedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionOverrideUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    grantedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionOverrideUpdateWithoutGrantorInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutPermissionOverridesNestedInput
  }

  export type PermissionOverrideUncheckedUpdateWithoutGrantorInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionOverrideUncheckedUpdateManyWithoutGrantorInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUpdateWithoutProfileInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateWithoutProfileInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyWithoutProfileInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetLayoutUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type WidgetLayoutUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type WidgetLayoutUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    widgetId?: StringFieldUpdateOperationsInput | string
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    w?: IntFieldUpdateOperationsInput | number
    h?: IntFieldUpdateOperationsInput | number
  }

  export type NotificationUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dhKey?: StringFieldUpdateOperationsInput | string
    authKey?: StringFieldUpdateOperationsInput | string
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
