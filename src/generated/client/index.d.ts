
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model State
 * 
 */
export type State = $Result.DefaultSelection<Prisma.$StatePayload>
/**
 * Model City
 * 
 */
export type City = $Result.DefaultSelection<Prisma.$CityPayload>
/**
 * Model Device
 * 
 */
export type Device = $Result.DefaultSelection<Prisma.$DevicePayload>
/**
 * Model DeviceTelemetry
 * 
 */
export type DeviceTelemetry = $Result.DefaultSelection<Prisma.$DeviceTelemetryPayload>
/**
 * Model UserAccess
 * 
 */
export type UserAccess = $Result.DefaultSelection<Prisma.$UserAccessPayload>
/**
 * Model Trap
 * 
 */
export type Trap = $Result.DefaultSelection<Prisma.$TrapPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model KronDevice
 * 
 */
export type KronDevice = $Result.DefaultSelection<Prisma.$KronDevicePayload>
/**
 * Model KronReading
 * 
 */
export type KronReading = $Result.DefaultSelection<Prisma.$KronReadingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.state`: Exposes CRUD operations for the **State** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more States
    * const states = await prisma.state.findMany()
    * ```
    */
  get state(): Prisma.StateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.city`: Exposes CRUD operations for the **City** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cities
    * const cities = await prisma.city.findMany()
    * ```
    */
  get city(): Prisma.CityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.device`: Exposes CRUD operations for the **Device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.DeviceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deviceTelemetry`: Exposes CRUD operations for the **DeviceTelemetry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeviceTelemetries
    * const deviceTelemetries = await prisma.deviceTelemetry.findMany()
    * ```
    */
  get deviceTelemetry(): Prisma.DeviceTelemetryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAccess`: Exposes CRUD operations for the **UserAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAccesses
    * const userAccesses = await prisma.userAccess.findMany()
    * ```
    */
  get userAccess(): Prisma.UserAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trap`: Exposes CRUD operations for the **Trap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Traps
    * const traps = await prisma.trap.findMany()
    * ```
    */
  get trap(): Prisma.TrapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kronDevice`: Exposes CRUD operations for the **KronDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KronDevices
    * const kronDevices = await prisma.kronDevice.findMany()
    * ```
    */
  get kronDevice(): Prisma.KronDeviceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kronReading`: Exposes CRUD operations for the **KronReading** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KronReadings
    * const kronReadings = await prisma.kronReading.findMany()
    * ```
    */
  get kronReading(): Prisma.KronReadingDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
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
    User: 'User',
    State: 'State',
    City: 'City',
    Device: 'Device',
    DeviceTelemetry: 'DeviceTelemetry',
    UserAccess: 'UserAccess',
    Trap: 'Trap',
    Company: 'Company',
    KronDevice: 'KronDevice',
    KronReading: 'KronReading'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "state" | "city" | "device" | "deviceTelemetry" | "userAccess" | "trap" | "company" | "kronDevice" | "kronReading"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      State: {
        payload: Prisma.$StatePayload<ExtArgs>
        fields: Prisma.StateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          findFirst: {
            args: Prisma.StateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          findMany: {
            args: Prisma.StateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          create: {
            args: Prisma.StateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          createMany: {
            args: Prisma.StateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          delete: {
            args: Prisma.StateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          update: {
            args: Prisma.StateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          deleteMany: {
            args: Prisma.StateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          upsert: {
            args: Prisma.StateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          aggregate: {
            args: Prisma.StateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateState>
          }
          groupBy: {
            args: Prisma.StateGroupByArgs<ExtArgs>
            result: $Utils.Optional<StateGroupByOutputType>[]
          }
          count: {
            args: Prisma.StateCountArgs<ExtArgs>
            result: $Utils.Optional<StateCountAggregateOutputType> | number
          }
        }
      }
      City: {
        payload: Prisma.$CityPayload<ExtArgs>
        fields: Prisma.CityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          findFirst: {
            args: Prisma.CityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          findMany: {
            args: Prisma.CityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>[]
          }
          create: {
            args: Prisma.CityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          createMany: {
            args: Prisma.CityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>[]
          }
          delete: {
            args: Prisma.CityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          update: {
            args: Prisma.CityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          deleteMany: {
            args: Prisma.CityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>[]
          }
          upsert: {
            args: Prisma.CityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          aggregate: {
            args: Prisma.CityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCity>
          }
          groupBy: {
            args: Prisma.CityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CityCountArgs<ExtArgs>
            result: $Utils.Optional<CityCountAggregateOutputType> | number
          }
        }
      }
      Device: {
        payload: Prisma.$DevicePayload<ExtArgs>
        fields: Prisma.DeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findFirst: {
            args: Prisma.DeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findMany: {
            args: Prisma.DeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          create: {
            args: Prisma.DeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          createMany: {
            args: Prisma.DeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          delete: {
            args: Prisma.DeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          update: {
            args: Prisma.DeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          deleteMany: {
            args: Prisma.DeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          upsert: {
            args: Prisma.DeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.DeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
          }
        }
      }
      DeviceTelemetry: {
        payload: Prisma.$DeviceTelemetryPayload<ExtArgs>
        fields: Prisma.DeviceTelemetryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceTelemetryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceTelemetryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          findFirst: {
            args: Prisma.DeviceTelemetryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceTelemetryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          findMany: {
            args: Prisma.DeviceTelemetryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>[]
          }
          create: {
            args: Prisma.DeviceTelemetryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          createMany: {
            args: Prisma.DeviceTelemetryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceTelemetryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>[]
          }
          delete: {
            args: Prisma.DeviceTelemetryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          update: {
            args: Prisma.DeviceTelemetryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          deleteMany: {
            args: Prisma.DeviceTelemetryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceTelemetryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceTelemetryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>[]
          }
          upsert: {
            args: Prisma.DeviceTelemetryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceTelemetryPayload>
          }
          aggregate: {
            args: Prisma.DeviceTelemetryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeviceTelemetry>
          }
          groupBy: {
            args: Prisma.DeviceTelemetryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceTelemetryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceTelemetryCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceTelemetryCountAggregateOutputType> | number
          }
        }
      }
      UserAccess: {
        payload: Prisma.$UserAccessPayload<ExtArgs>
        fields: Prisma.UserAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          findFirst: {
            args: Prisma.UserAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          findMany: {
            args: Prisma.UserAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>[]
          }
          create: {
            args: Prisma.UserAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          createMany: {
            args: Prisma.UserAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>[]
          }
          delete: {
            args: Prisma.UserAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          update: {
            args: Prisma.UserAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          deleteMany: {
            args: Prisma.UserAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAccessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>[]
          }
          upsert: {
            args: Prisma.UserAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccessPayload>
          }
          aggregate: {
            args: Prisma.UserAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAccess>
          }
          groupBy: {
            args: Prisma.UserAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAccessCountArgs<ExtArgs>
            result: $Utils.Optional<UserAccessCountAggregateOutputType> | number
          }
        }
      }
      Trap: {
        payload: Prisma.$TrapPayload<ExtArgs>
        fields: Prisma.TrapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          findFirst: {
            args: Prisma.TrapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          findMany: {
            args: Prisma.TrapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>[]
          }
          create: {
            args: Prisma.TrapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          createMany: {
            args: Prisma.TrapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>[]
          }
          delete: {
            args: Prisma.TrapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          update: {
            args: Prisma.TrapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          deleteMany: {
            args: Prisma.TrapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>[]
          }
          upsert: {
            args: Prisma.TrapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrapPayload>
          }
          aggregate: {
            args: Prisma.TrapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrap>
          }
          groupBy: {
            args: Prisma.TrapGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrapGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrapCountArgs<ExtArgs>
            result: $Utils.Optional<TrapCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      KronDevice: {
        payload: Prisma.$KronDevicePayload<ExtArgs>
        fields: Prisma.KronDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KronDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KronDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          findFirst: {
            args: Prisma.KronDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KronDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          findMany: {
            args: Prisma.KronDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>[]
          }
          create: {
            args: Prisma.KronDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          createMany: {
            args: Prisma.KronDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KronDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>[]
          }
          delete: {
            args: Prisma.KronDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          update: {
            args: Prisma.KronDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          deleteMany: {
            args: Prisma.KronDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KronDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KronDeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>[]
          }
          upsert: {
            args: Prisma.KronDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronDevicePayload>
          }
          aggregate: {
            args: Prisma.KronDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKronDevice>
          }
          groupBy: {
            args: Prisma.KronDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<KronDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.KronDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<KronDeviceCountAggregateOutputType> | number
          }
        }
      }
      KronReading: {
        payload: Prisma.$KronReadingPayload<ExtArgs>
        fields: Prisma.KronReadingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KronReadingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KronReadingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          findFirst: {
            args: Prisma.KronReadingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KronReadingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          findMany: {
            args: Prisma.KronReadingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>[]
          }
          create: {
            args: Prisma.KronReadingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          createMany: {
            args: Prisma.KronReadingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KronReadingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>[]
          }
          delete: {
            args: Prisma.KronReadingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          update: {
            args: Prisma.KronReadingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          deleteMany: {
            args: Prisma.KronReadingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KronReadingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KronReadingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>[]
          }
          upsert: {
            args: Prisma.KronReadingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KronReadingPayload>
          }
          aggregate: {
            args: Prisma.KronReadingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKronReading>
          }
          groupBy: {
            args: Prisma.KronReadingGroupByArgs<ExtArgs>
            result: $Utils.Optional<KronReadingGroupByOutputType>[]
          }
          count: {
            args: Prisma.KronReadingCountArgs<ExtArgs>
            result: $Utils.Optional<KronReadingCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    state?: StateOmit
    city?: CityOmit
    device?: DeviceOmit
    deviceTelemetry?: DeviceTelemetryOmit
    userAccess?: UserAccessOmit
    trap?: TrapOmit
    company?: CompanyOmit
    kronDevice?: KronDeviceOmit
    kronReading?: KronReadingOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    access: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    access?: boolean | UserCountOutputTypeCountAccessArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccessWhereInput
  }


  /**
   * Count Type StateCountOutputType
   */

  export type StateCountOutputType = {
    cities: number
  }

  export type StateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cities?: boolean | StateCountOutputTypeCountCitiesArgs
  }

  // Custom InputTypes
  /**
   * StateCountOutputType without action
   */
  export type StateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StateCountOutputType
     */
    select?: StateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StateCountOutputType without action
   */
  export type StateCountOutputTypeCountCitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CityWhereInput
  }


  /**
   * Count Type CityCountOutputType
   */

  export type CityCountOutputType = {
    devices: number
    kronDevices: number
    access: number
  }

  export type CityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    devices?: boolean | CityCountOutputTypeCountDevicesArgs
    kronDevices?: boolean | CityCountOutputTypeCountKronDevicesArgs
    access?: boolean | CityCountOutputTypeCountAccessArgs
  }

  // Custom InputTypes
  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CityCountOutputType
     */
    select?: CityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }

  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeCountKronDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KronDeviceWhereInput
  }

  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeCountAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccessWhereInput
  }


  /**
   * Count Type DeviceCountOutputType
   */

  export type DeviceCountOutputType = {
    traps: number
    telemetry: number
  }

  export type DeviceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    traps?: boolean | DeviceCountOutputTypeCountTrapsArgs
    telemetry?: boolean | DeviceCountOutputTypeCountTelemetryArgs
  }

  // Custom InputTypes
  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceCountOutputType
     */
    select?: DeviceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeCountTrapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrapWhereInput
  }

  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeCountTelemetryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceTelemetryWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    users: number
    devices: number
    kronDevices: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | CompanyCountOutputTypeCountUsersArgs
    devices?: boolean | CompanyCountOutputTypeCountDevicesArgs
    kronDevices?: boolean | CompanyCountOutputTypeCountKronDevicesArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountKronDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KronDeviceWhereInput
  }


  /**
   * Count Type KronDeviceCountOutputType
   */

  export type KronDeviceCountOutputType = {
    readings: number
  }

  export type KronDeviceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readings?: boolean | KronDeviceCountOutputTypeCountReadingsArgs
  }

  // Custom InputTypes
  /**
   * KronDeviceCountOutputType without action
   */
  export type KronDeviceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDeviceCountOutputType
     */
    select?: KronDeviceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KronDeviceCountOutputType without action
   */
  export type KronDeviceCountOutputTypeCountReadingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KronReadingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    passwordHash: string | null
    role: string | null
    company: string | null
    companyId: string | null
    phone: string | null
    email: string | null
    mustChangePassword: boolean | null
    canAccessInfo: boolean | null
    lastActive: Date | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    passwordHash: string | null
    role: string | null
    company: string | null
    companyId: string | null
    phone: string | null
    email: string | null
    mustChangePassword: boolean | null
    canAccessInfo: boolean | null
    lastActive: Date | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    username: number
    passwordHash: number
    role: number
    company: number
    companyId: number
    phone: number
    email: number
    mustChangePassword: number
    canAccessInfo: number
    lastActive: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    username?: true
    passwordHash?: true
    role?: true
    company?: true
    companyId?: true
    phone?: true
    email?: true
    mustChangePassword?: true
    canAccessInfo?: true
    lastActive?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    username?: true
    passwordHash?: true
    role?: true
    company?: true
    companyId?: true
    phone?: true
    email?: true
    mustChangePassword?: true
    canAccessInfo?: true
    lastActive?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    username?: true
    passwordHash?: true
    role?: true
    company?: true
    companyId?: true
    phone?: true
    email?: true
    mustChangePassword?: true
    canAccessInfo?: true
    lastActive?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    username: string
    passwordHash: string
    role: string
    company: string | null
    companyId: string | null
    phone: string | null
    email: string | null
    mustChangePassword: boolean
    canAccessInfo: boolean
    lastActive: Date | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    company?: boolean
    companyId?: boolean
    phone?: boolean
    email?: boolean
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: boolean
    createdAt?: boolean
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
    access?: boolean | User$accessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    company?: boolean
    companyId?: boolean
    phone?: boolean
    email?: boolean
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: boolean
    createdAt?: boolean
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    company?: boolean
    companyId?: boolean
    phone?: boolean
    email?: boolean
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: boolean
    createdAt?: boolean
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    company?: boolean
    companyId?: boolean
    phone?: boolean
    email?: boolean
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "username" | "passwordHash" | "role" | "company" | "companyId" | "phone" | "email" | "mustChangePassword" | "canAccessInfo" | "lastActive" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
    access?: boolean | User$accessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companyRef?: boolean | User$companyRefArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      companyRef: Prisma.$CompanyPayload<ExtArgs> | null
      access: Prisma.$UserAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      username: string
      passwordHash: string
      role: string
      company: string | null
      companyId: string | null
      phone: string | null
      email: string | null
      mustChangePassword: boolean
      canAccessInfo: boolean
      lastActive: Date | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    companyRef<T extends User$companyRefArgs<ExtArgs> = {}>(args?: Subset<T, User$companyRefArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    access<T extends User$accessArgs<ExtArgs> = {}>(args?: Subset<T, User$accessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly company: FieldRef<"User", 'String'>
    readonly companyId: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly mustChangePassword: FieldRef<"User", 'Boolean'>
    readonly canAccessInfo: FieldRef<"User", 'Boolean'>
    readonly lastActive: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.companyRef
   */
  export type User$companyRefArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * User.access
   */
  export type User$accessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    where?: UserAccessWhereInput
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    cursor?: UserAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAccessScalarFieldEnum | UserAccessScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model State
   */

  export type AggregateState = {
    _count: StateCountAggregateOutputType | null
    _min: StateMinAggregateOutputType | null
    _max: StateMaxAggregateOutputType | null
  }

  export type StateMinAggregateOutputType = {
    id: string | null
    name: string | null
    uf: string | null
    createdAt: Date | null
  }

  export type StateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    uf: string | null
    createdAt: Date | null
  }

  export type StateCountAggregateOutputType = {
    id: number
    name: number
    uf: number
    createdAt: number
    _all: number
  }


  export type StateMinAggregateInputType = {
    id?: true
    name?: true
    uf?: true
    createdAt?: true
  }

  export type StateMaxAggregateInputType = {
    id?: true
    name?: true
    uf?: true
    createdAt?: true
  }

  export type StateCountAggregateInputType = {
    id?: true
    name?: true
    uf?: true
    createdAt?: true
    _all?: true
  }

  export type StateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which State to aggregate.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned States
    **/
    _count?: true | StateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StateMaxAggregateInputType
  }

  export type GetStateAggregateType<T extends StateAggregateArgs> = {
        [P in keyof T & keyof AggregateState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateState[P]>
      : GetScalarType<T[P], AggregateState[P]>
  }




  export type StateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StateWhereInput
    orderBy?: StateOrderByWithAggregationInput | StateOrderByWithAggregationInput[]
    by: StateScalarFieldEnum[] | StateScalarFieldEnum
    having?: StateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StateCountAggregateInputType | true
    _min?: StateMinAggregateInputType
    _max?: StateMaxAggregateInputType
  }

  export type StateGroupByOutputType = {
    id: string
    name: string
    uf: string
    createdAt: Date
    _count: StateCountAggregateOutputType | null
    _min: StateMinAggregateOutputType | null
    _max: StateMaxAggregateOutputType | null
  }

  type GetStateGroupByPayload<T extends StateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StateGroupByOutputType[P]>
            : GetScalarType<T[P], StateGroupByOutputType[P]>
        }
      >
    >


  export type StateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    uf?: boolean
    createdAt?: boolean
    cities?: boolean | State$citiesArgs<ExtArgs>
    _count?: boolean | StateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["state"]>

  export type StateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    uf?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["state"]>

  export type StateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    uf?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["state"]>

  export type StateSelectScalar = {
    id?: boolean
    name?: boolean
    uf?: boolean
    createdAt?: boolean
  }

  export type StateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "uf" | "createdAt", ExtArgs["result"]["state"]>
  export type StateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cities?: boolean | State$citiesArgs<ExtArgs>
    _count?: boolean | StateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "State"
    objects: {
      cities: Prisma.$CityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      uf: string
      createdAt: Date
    }, ExtArgs["result"]["state"]>
    composites: {}
  }

  type StateGetPayload<S extends boolean | null | undefined | StateDefaultArgs> = $Result.GetResult<Prisma.$StatePayload, S>

  type StateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StateCountAggregateInputType | true
    }

  export interface StateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['State'], meta: { name: 'State' } }
    /**
     * Find zero or one State that matches the filter.
     * @param {StateFindUniqueArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StateFindUniqueArgs>(args: SelectSubset<T, StateFindUniqueArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one State that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StateFindUniqueOrThrowArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StateFindUniqueOrThrowArgs>(args: SelectSubset<T, StateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first State that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindFirstArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StateFindFirstArgs>(args?: SelectSubset<T, StateFindFirstArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first State that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindFirstOrThrowArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StateFindFirstOrThrowArgs>(args?: SelectSubset<T, StateFindFirstOrThrowArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more States that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all States
     * const states = await prisma.state.findMany()
     * 
     * // Get first 10 States
     * const states = await prisma.state.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stateWithIdOnly = await prisma.state.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StateFindManyArgs>(args?: SelectSubset<T, StateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a State.
     * @param {StateCreateArgs} args - Arguments to create a State.
     * @example
     * // Create one State
     * const State = await prisma.state.create({
     *   data: {
     *     // ... data to create a State
     *   }
     * })
     * 
     */
    create<T extends StateCreateArgs>(args: SelectSubset<T, StateCreateArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many States.
     * @param {StateCreateManyArgs} args - Arguments to create many States.
     * @example
     * // Create many States
     * const state = await prisma.state.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StateCreateManyArgs>(args?: SelectSubset<T, StateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many States and returns the data saved in the database.
     * @param {StateCreateManyAndReturnArgs} args - Arguments to create many States.
     * @example
     * // Create many States
     * const state = await prisma.state.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many States and only return the `id`
     * const stateWithIdOnly = await prisma.state.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StateCreateManyAndReturnArgs>(args?: SelectSubset<T, StateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a State.
     * @param {StateDeleteArgs} args - Arguments to delete one State.
     * @example
     * // Delete one State
     * const State = await prisma.state.delete({
     *   where: {
     *     // ... filter to delete one State
     *   }
     * })
     * 
     */
    delete<T extends StateDeleteArgs>(args: SelectSubset<T, StateDeleteArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one State.
     * @param {StateUpdateArgs} args - Arguments to update one State.
     * @example
     * // Update one State
     * const state = await prisma.state.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StateUpdateArgs>(args: SelectSubset<T, StateUpdateArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more States.
     * @param {StateDeleteManyArgs} args - Arguments to filter States to delete.
     * @example
     * // Delete a few States
     * const { count } = await prisma.state.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StateDeleteManyArgs>(args?: SelectSubset<T, StateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more States.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many States
     * const state = await prisma.state.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StateUpdateManyArgs>(args: SelectSubset<T, StateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more States and returns the data updated in the database.
     * @param {StateUpdateManyAndReturnArgs} args - Arguments to update many States.
     * @example
     * // Update many States
     * const state = await prisma.state.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more States and only return the `id`
     * const stateWithIdOnly = await prisma.state.updateManyAndReturn({
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
    updateManyAndReturn<T extends StateUpdateManyAndReturnArgs>(args: SelectSubset<T, StateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one State.
     * @param {StateUpsertArgs} args - Arguments to update or create a State.
     * @example
     * // Update or create a State
     * const state = await prisma.state.upsert({
     *   create: {
     *     // ... data to create a State
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the State we want to update
     *   }
     * })
     */
    upsert<T extends StateUpsertArgs>(args: SelectSubset<T, StateUpsertArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of States.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateCountArgs} args - Arguments to filter States to count.
     * @example
     * // Count the number of States
     * const count = await prisma.state.count({
     *   where: {
     *     // ... the filter for the States we want to count
     *   }
     * })
    **/
    count<T extends StateCountArgs>(
      args?: Subset<T, StateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a State.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StateAggregateArgs>(args: Subset<T, StateAggregateArgs>): Prisma.PrismaPromise<GetStateAggregateType<T>>

    /**
     * Group by State.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateGroupByArgs} args - Group by arguments.
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
      T extends StateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StateGroupByArgs['orderBy'] }
        : { orderBy?: StateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the State model
   */
  readonly fields: StateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for State.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cities<T extends State$citiesArgs<ExtArgs> = {}>(args?: Subset<T, State$citiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the State model
   */
  interface StateFieldRefs {
    readonly id: FieldRef<"State", 'String'>
    readonly name: FieldRef<"State", 'String'>
    readonly uf: FieldRef<"State", 'String'>
    readonly createdAt: FieldRef<"State", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * State findUnique
   */
  export type StateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State findUniqueOrThrow
   */
  export type StateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State findFirst
   */
  export type StateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of States.
     */
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State findFirstOrThrow
   */
  export type StateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of States.
     */
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State findMany
   */
  export type StateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter, which States to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State create
   */
  export type StateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * The data needed to create a State.
     */
    data: XOR<StateCreateInput, StateUncheckedCreateInput>
  }

  /**
   * State createMany
   */
  export type StateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many States.
     */
    data: StateCreateManyInput | StateCreateManyInput[]
  }

  /**
   * State createManyAndReturn
   */
  export type StateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data used to create many States.
     */
    data: StateCreateManyInput | StateCreateManyInput[]
  }

  /**
   * State update
   */
  export type StateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * The data needed to update a State.
     */
    data: XOR<StateUpdateInput, StateUncheckedUpdateInput>
    /**
     * Choose, which State to update.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State updateMany
   */
  export type StateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update States.
     */
    data: XOR<StateUpdateManyMutationInput, StateUncheckedUpdateManyInput>
    /**
     * Filter which States to update
     */
    where?: StateWhereInput
    /**
     * Limit how many States to update.
     */
    limit?: number
  }

  /**
   * State updateManyAndReturn
   */
  export type StateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data used to update States.
     */
    data: XOR<StateUpdateManyMutationInput, StateUncheckedUpdateManyInput>
    /**
     * Filter which States to update
     */
    where?: StateWhereInput
    /**
     * Limit how many States to update.
     */
    limit?: number
  }

  /**
   * State upsert
   */
  export type StateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * The filter to search for the State to update in case it exists.
     */
    where: StateWhereUniqueInput
    /**
     * In case the State found by the `where` argument doesn't exist, create a new State with this data.
     */
    create: XOR<StateCreateInput, StateUncheckedCreateInput>
    /**
     * In case the State was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StateUpdateInput, StateUncheckedUpdateInput>
  }

  /**
   * State delete
   */
  export type StateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
    /**
     * Filter which State to delete.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State deleteMany
   */
  export type StateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which States to delete
     */
    where?: StateWhereInput
    /**
     * Limit how many States to delete.
     */
    limit?: number
  }

  /**
   * State.cities
   */
  export type State$citiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    where?: CityWhereInput
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    cursor?: CityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * State without action
   */
  export type StateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StateInclude<ExtArgs> | null
  }


  /**
   * Model City
   */

  export type AggregateCity = {
    _count: CityCountAggregateOutputType | null
    _avg: CityAvgAggregateOutputType | null
    _sum: CitySumAggregateOutputType | null
    _min: CityMinAggregateOutputType | null
    _max: CityMaxAggregateOutputType | null
  }

  export type CityAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type CitySumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type CityMinAggregateOutputType = {
    id: string | null
    name: string | null
    stateId: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
  }

  export type CityMaxAggregateOutputType = {
    id: string | null
    name: string | null
    stateId: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
  }

  export type CityCountAggregateOutputType = {
    id: number
    name: number
    stateId: number
    address: number
    latitude: number
    longitude: number
    createdAt: number
    _all: number
  }


  export type CityAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CitySumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CityMinAggregateInputType = {
    id?: true
    name?: true
    stateId?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
  }

  export type CityMaxAggregateInputType = {
    id?: true
    name?: true
    stateId?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
  }

  export type CityCountAggregateInputType = {
    id?: true
    name?: true
    stateId?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    _all?: true
  }

  export type CityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which City to aggregate.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cities
    **/
    _count?: true | CityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CityMaxAggregateInputType
  }

  export type GetCityAggregateType<T extends CityAggregateArgs> = {
        [P in keyof T & keyof AggregateCity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCity[P]>
      : GetScalarType<T[P], AggregateCity[P]>
  }




  export type CityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CityWhereInput
    orderBy?: CityOrderByWithAggregationInput | CityOrderByWithAggregationInput[]
    by: CityScalarFieldEnum[] | CityScalarFieldEnum
    having?: CityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CityCountAggregateInputType | true
    _avg?: CityAvgAggregateInputType
    _sum?: CitySumAggregateInputType
    _min?: CityMinAggregateInputType
    _max?: CityMaxAggregateInputType
  }

  export type CityGroupByOutputType = {
    id: string
    name: string
    stateId: string
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date
    _count: CityCountAggregateOutputType | null
    _avg: CityAvgAggregateOutputType | null
    _sum: CitySumAggregateOutputType | null
    _min: CityMinAggregateOutputType | null
    _max: CityMaxAggregateOutputType | null
  }

  type GetCityGroupByPayload<T extends CityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CityGroupByOutputType[P]>
            : GetScalarType<T[P], CityGroupByOutputType[P]>
        }
      >
    >


  export type CitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stateId?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    state?: boolean | StateDefaultArgs<ExtArgs>
    devices?: boolean | City$devicesArgs<ExtArgs>
    kronDevices?: boolean | City$kronDevicesArgs<ExtArgs>
    access?: boolean | City$accessArgs<ExtArgs>
    _count?: boolean | CityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["city"]>

  export type CitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stateId?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    state?: boolean | StateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["city"]>

  export type CitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stateId?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    state?: boolean | StateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["city"]>

  export type CitySelectScalar = {
    id?: boolean
    name?: boolean
    stateId?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
  }

  export type CityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "stateId" | "address" | "latitude" | "longitude" | "createdAt", ExtArgs["result"]["city"]>
  export type CityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    state?: boolean | StateDefaultArgs<ExtArgs>
    devices?: boolean | City$devicesArgs<ExtArgs>
    kronDevices?: boolean | City$kronDevicesArgs<ExtArgs>
    access?: boolean | City$accessArgs<ExtArgs>
    _count?: boolean | CityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    state?: boolean | StateDefaultArgs<ExtArgs>
  }
  export type CityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    state?: boolean | StateDefaultArgs<ExtArgs>
  }

  export type $CityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "City"
    objects: {
      state: Prisma.$StatePayload<ExtArgs>
      devices: Prisma.$DevicePayload<ExtArgs>[]
      kronDevices: Prisma.$KronDevicePayload<ExtArgs>[]
      access: Prisma.$UserAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      stateId: string
      address: string | null
      latitude: number | null
      longitude: number | null
      createdAt: Date
    }, ExtArgs["result"]["city"]>
    composites: {}
  }

  type CityGetPayload<S extends boolean | null | undefined | CityDefaultArgs> = $Result.GetResult<Prisma.$CityPayload, S>

  type CityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CityCountAggregateInputType | true
    }

  export interface CityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['City'], meta: { name: 'City' } }
    /**
     * Find zero or one City that matches the filter.
     * @param {CityFindUniqueArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CityFindUniqueArgs>(args: SelectSubset<T, CityFindUniqueArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one City that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CityFindUniqueOrThrowArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CityFindUniqueOrThrowArgs>(args: SelectSubset<T, CityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first City that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindFirstArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CityFindFirstArgs>(args?: SelectSubset<T, CityFindFirstArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first City that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindFirstOrThrowArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CityFindFirstOrThrowArgs>(args?: SelectSubset<T, CityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cities
     * const cities = await prisma.city.findMany()
     * 
     * // Get first 10 Cities
     * const cities = await prisma.city.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cityWithIdOnly = await prisma.city.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CityFindManyArgs>(args?: SelectSubset<T, CityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a City.
     * @param {CityCreateArgs} args - Arguments to create a City.
     * @example
     * // Create one City
     * const City = await prisma.city.create({
     *   data: {
     *     // ... data to create a City
     *   }
     * })
     * 
     */
    create<T extends CityCreateArgs>(args: SelectSubset<T, CityCreateArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cities.
     * @param {CityCreateManyArgs} args - Arguments to create many Cities.
     * @example
     * // Create many Cities
     * const city = await prisma.city.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CityCreateManyArgs>(args?: SelectSubset<T, CityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cities and returns the data saved in the database.
     * @param {CityCreateManyAndReturnArgs} args - Arguments to create many Cities.
     * @example
     * // Create many Cities
     * const city = await prisma.city.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cities and only return the `id`
     * const cityWithIdOnly = await prisma.city.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CityCreateManyAndReturnArgs>(args?: SelectSubset<T, CityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a City.
     * @param {CityDeleteArgs} args - Arguments to delete one City.
     * @example
     * // Delete one City
     * const City = await prisma.city.delete({
     *   where: {
     *     // ... filter to delete one City
     *   }
     * })
     * 
     */
    delete<T extends CityDeleteArgs>(args: SelectSubset<T, CityDeleteArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one City.
     * @param {CityUpdateArgs} args - Arguments to update one City.
     * @example
     * // Update one City
     * const city = await prisma.city.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CityUpdateArgs>(args: SelectSubset<T, CityUpdateArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cities.
     * @param {CityDeleteManyArgs} args - Arguments to filter Cities to delete.
     * @example
     * // Delete a few Cities
     * const { count } = await prisma.city.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CityDeleteManyArgs>(args?: SelectSubset<T, CityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cities
     * const city = await prisma.city.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CityUpdateManyArgs>(args: SelectSubset<T, CityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cities and returns the data updated in the database.
     * @param {CityUpdateManyAndReturnArgs} args - Arguments to update many Cities.
     * @example
     * // Update many Cities
     * const city = await prisma.city.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cities and only return the `id`
     * const cityWithIdOnly = await prisma.city.updateManyAndReturn({
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
    updateManyAndReturn<T extends CityUpdateManyAndReturnArgs>(args: SelectSubset<T, CityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one City.
     * @param {CityUpsertArgs} args - Arguments to update or create a City.
     * @example
     * // Update or create a City
     * const city = await prisma.city.upsert({
     *   create: {
     *     // ... data to create a City
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the City we want to update
     *   }
     * })
     */
    upsert<T extends CityUpsertArgs>(args: SelectSubset<T, CityUpsertArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityCountArgs} args - Arguments to filter Cities to count.
     * @example
     * // Count the number of Cities
     * const count = await prisma.city.count({
     *   where: {
     *     // ... the filter for the Cities we want to count
     *   }
     * })
    **/
    count<T extends CityCountArgs>(
      args?: Subset<T, CityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a City.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CityAggregateArgs>(args: Subset<T, CityAggregateArgs>): Prisma.PrismaPromise<GetCityAggregateType<T>>

    /**
     * Group by City.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityGroupByArgs} args - Group by arguments.
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
      T extends CityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CityGroupByArgs['orderBy'] }
        : { orderBy?: CityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the City model
   */
  readonly fields: CityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for City.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    state<T extends StateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StateDefaultArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    devices<T extends City$devicesArgs<ExtArgs> = {}>(args?: Subset<T, City$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kronDevices<T extends City$kronDevicesArgs<ExtArgs> = {}>(args?: Subset<T, City$kronDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    access<T extends City$accessArgs<ExtArgs> = {}>(args?: Subset<T, City$accessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the City model
   */
  interface CityFieldRefs {
    readonly id: FieldRef<"City", 'String'>
    readonly name: FieldRef<"City", 'String'>
    readonly stateId: FieldRef<"City", 'String'>
    readonly address: FieldRef<"City", 'String'>
    readonly latitude: FieldRef<"City", 'Float'>
    readonly longitude: FieldRef<"City", 'Float'>
    readonly createdAt: FieldRef<"City", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * City findUnique
   */
  export type CityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City findUniqueOrThrow
   */
  export type CityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City findFirst
   */
  export type CityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cities.
     */
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City findFirstOrThrow
   */
  export type CityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cities.
     */
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City findMany
   */
  export type CityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which Cities to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City create
   */
  export type CityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The data needed to create a City.
     */
    data: XOR<CityCreateInput, CityUncheckedCreateInput>
  }

  /**
   * City createMany
   */
  export type CityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cities.
     */
    data: CityCreateManyInput | CityCreateManyInput[]
  }

  /**
   * City createManyAndReturn
   */
  export type CityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * The data used to create many Cities.
     */
    data: CityCreateManyInput | CityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * City update
   */
  export type CityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The data needed to update a City.
     */
    data: XOR<CityUpdateInput, CityUncheckedUpdateInput>
    /**
     * Choose, which City to update.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City updateMany
   */
  export type CityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cities.
     */
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyInput>
    /**
     * Filter which Cities to update
     */
    where?: CityWhereInput
    /**
     * Limit how many Cities to update.
     */
    limit?: number
  }

  /**
   * City updateManyAndReturn
   */
  export type CityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * The data used to update Cities.
     */
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyInput>
    /**
     * Filter which Cities to update
     */
    where?: CityWhereInput
    /**
     * Limit how many Cities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * City upsert
   */
  export type CityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The filter to search for the City to update in case it exists.
     */
    where: CityWhereUniqueInput
    /**
     * In case the City found by the `where` argument doesn't exist, create a new City with this data.
     */
    create: XOR<CityCreateInput, CityUncheckedCreateInput>
    /**
     * In case the City was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CityUpdateInput, CityUncheckedUpdateInput>
  }

  /**
   * City delete
   */
  export type CityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter which City to delete.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City deleteMany
   */
  export type CityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cities to delete
     */
    where?: CityWhereInput
    /**
     * Limit how many Cities to delete.
     */
    limit?: number
  }

  /**
   * City.devices
   */
  export type City$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * City.kronDevices
   */
  export type City$kronDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    where?: KronDeviceWhereInput
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    cursor?: KronDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KronDeviceScalarFieldEnum | KronDeviceScalarFieldEnum[]
  }

  /**
   * City.access
   */
  export type City$accessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    where?: UserAccessWhereInput
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    cursor?: UserAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAccessScalarFieldEnum | UserAccessScalarFieldEnum[]
  }

  /**
   * City without action
   */
  export type CityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
  }


  /**
   * Model Device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _avg: DeviceAvgAggregateOutputType | null
    _sum: DeviceSumAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type DeviceSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    name: string | null
    ip: string | null
    serial: string | null
    cityId: string | null
    lastSeen: Date | null
    hasAlarm: boolean | null
    lastSnmpData: string | null
    lastSnmpSync: Date | null
    status: string | null
    active: boolean | null
    syncError: string | null
    companyId: string | null
    vpnUsername: string | null
    vpnStatus: string | null
    vpnIp: string | null
    vpnLastSeen: Date | null
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ip: string | null
    serial: string | null
    cityId: string | null
    lastSeen: Date | null
    hasAlarm: boolean | null
    lastSnmpData: string | null
    lastSnmpSync: Date | null
    status: string | null
    active: boolean | null
    syncError: string | null
    companyId: string | null
    vpnUsername: string | null
    vpnStatus: string | null
    vpnIp: string | null
    vpnLastSeen: Date | null
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    name: number
    ip: number
    serial: number
    cityId: number
    lastSeen: number
    hasAlarm: number
    lastSnmpData: number
    lastSnmpSync: number
    status: number
    active: number
    syncError: number
    companyId: number
    vpnUsername: number
    vpnStatus: number
    vpnIp: number
    vpnLastSeen: number
    address: number
    latitude: number
    longitude: number
    createdAt: number
    _all: number
  }


  export type DeviceAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type DeviceSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type DeviceMinAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    serial?: true
    cityId?: true
    lastSeen?: true
    hasAlarm?: true
    lastSnmpData?: true
    lastSnmpSync?: true
    status?: true
    active?: true
    syncError?: true
    companyId?: true
    vpnUsername?: true
    vpnStatus?: true
    vpnIp?: true
    vpnLastSeen?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    serial?: true
    cityId?: true
    lastSeen?: true
    hasAlarm?: true
    lastSnmpData?: true
    lastSnmpSync?: true
    status?: true
    active?: true
    syncError?: true
    companyId?: true
    vpnUsername?: true
    vpnStatus?: true
    vpnIp?: true
    vpnLastSeen?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    serial?: true
    cityId?: true
    lastSeen?: true
    hasAlarm?: true
    lastSnmpData?: true
    lastSnmpSync?: true
    status?: true
    active?: true
    syncError?: true
    companyId?: true
    vpnUsername?: true
    vpnStatus?: true
    vpnIp?: true
    vpnLastSeen?: true
    address?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Device to aggregate.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeviceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeviceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type DeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithAggregationInput | DeviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: DeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _avg?: DeviceAvgAggregateInputType
    _sum?: DeviceSumAggregateInputType
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    name: string
    ip: string
    serial: string | null
    cityId: string
    lastSeen: Date
    hasAlarm: boolean
    lastSnmpData: string | null
    lastSnmpSync: Date | null
    status: string
    active: boolean
    syncError: string | null
    companyId: string | null
    vpnUsername: string | null
    vpnStatus: string
    vpnIp: string | null
    vpnLastSeen: Date | null
    address: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date
    _count: DeviceCountAggregateOutputType | null
    _avg: DeviceAvgAggregateOutputType | null
    _sum: DeviceSumAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends DeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type DeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    serial?: boolean
    cityId?: boolean
    lastSeen?: boolean
    hasAlarm?: boolean
    lastSnmpData?: boolean
    lastSnmpSync?: boolean
    status?: boolean
    active?: boolean
    syncError?: boolean
    companyId?: boolean
    vpnUsername?: boolean
    vpnStatus?: boolean
    vpnIp?: boolean
    vpnLastSeen?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    city?: boolean | CityDefaultArgs<ExtArgs>
    traps?: boolean | Device$trapsArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
    telemetry?: boolean | Device$telemetryArgs<ExtArgs>
    _count?: boolean | DeviceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    serial?: boolean
    cityId?: boolean
    lastSeen?: boolean
    hasAlarm?: boolean
    lastSnmpData?: boolean
    lastSnmpSync?: boolean
    status?: boolean
    active?: boolean
    syncError?: boolean
    companyId?: boolean
    vpnUsername?: boolean
    vpnStatus?: boolean
    vpnIp?: boolean
    vpnLastSeen?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    city?: boolean | CityDefaultArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    serial?: boolean
    cityId?: boolean
    lastSeen?: boolean
    hasAlarm?: boolean
    lastSnmpData?: boolean
    lastSnmpSync?: boolean
    status?: boolean
    active?: boolean
    syncError?: boolean
    companyId?: boolean
    vpnUsername?: boolean
    vpnStatus?: boolean
    vpnIp?: boolean
    vpnLastSeen?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    city?: boolean | CityDefaultArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectScalar = {
    id?: boolean
    name?: boolean
    ip?: boolean
    serial?: boolean
    cityId?: boolean
    lastSeen?: boolean
    hasAlarm?: boolean
    lastSnmpData?: boolean
    lastSnmpSync?: boolean
    status?: boolean
    active?: boolean
    syncError?: boolean
    companyId?: boolean
    vpnUsername?: boolean
    vpnStatus?: boolean
    vpnIp?: boolean
    vpnLastSeen?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
  }

  export type DeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "ip" | "serial" | "cityId" | "lastSeen" | "hasAlarm" | "lastSnmpData" | "lastSnmpSync" | "status" | "active" | "syncError" | "companyId" | "vpnUsername" | "vpnStatus" | "vpnIp" | "vpnLastSeen" | "address" | "latitude" | "longitude" | "createdAt", ExtArgs["result"]["device"]>
  export type DeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | CityDefaultArgs<ExtArgs>
    traps?: boolean | Device$trapsArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
    telemetry?: boolean | Device$telemetryArgs<ExtArgs>
    _count?: boolean | DeviceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | CityDefaultArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
  }
  export type DeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | CityDefaultArgs<ExtArgs>
    company?: boolean | Device$companyArgs<ExtArgs>
  }

  export type $DevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Device"
    objects: {
      city: Prisma.$CityPayload<ExtArgs>
      traps: Prisma.$TrapPayload<ExtArgs>[]
      company: Prisma.$CompanyPayload<ExtArgs> | null
      telemetry: Prisma.$DeviceTelemetryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ip: string
      serial: string | null
      cityId: string
      lastSeen: Date
      hasAlarm: boolean
      lastSnmpData: string | null
      lastSnmpSync: Date | null
      status: string
      active: boolean
      syncError: string | null
      companyId: string | null
      vpnUsername: string | null
      vpnStatus: string
      vpnIp: string | null
      vpnLastSeen: Date | null
      address: string | null
      latitude: number | null
      longitude: number | null
      createdAt: Date
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type DeviceGetPayload<S extends boolean | null | undefined | DeviceDefaultArgs> = $Result.GetResult<Prisma.$DevicePayload, S>

  type DeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface DeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Device'], meta: { name: 'Device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {DeviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceFindUniqueArgs>(args: SelectSubset<T, DeviceFindUniqueArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceFindFirstArgs>(args?: SelectSubset<T, DeviceFindFirstArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceFindManyArgs>(args?: SelectSubset<T, DeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Device.
     * @param {DeviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends DeviceCreateArgs>(args: SelectSubset<T, DeviceCreateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Devices.
     * @param {DeviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceCreateManyArgs>(args?: SelectSubset<T, DeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {DeviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Device.
     * @param {DeviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends DeviceDeleteArgs>(args: SelectSubset<T, DeviceDeleteArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Device.
     * @param {DeviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceUpdateArgs>(args: SelectSubset<T, DeviceUpdateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Devices.
     * @param {DeviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceDeleteManyArgs>(args?: SelectSubset<T, DeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceUpdateManyArgs>(args: SelectSubset<T, DeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices and returns the data updated in the database.
     * @param {DeviceUpdateManyAndReturnArgs} args - Arguments to update many Devices.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.updateManyAndReturn({
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
    updateManyAndReturn<T extends DeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Device.
     * @param {DeviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends DeviceUpsertArgs>(args: SelectSubset<T, DeviceUpsertArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends DeviceCountArgs>(
      args?: Subset<T, DeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceGroupByArgs} args - Group by arguments.
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
      T extends DeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceGroupByArgs['orderBy'] }
        : { orderBy?: DeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Device model
   */
  readonly fields: DeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    city<T extends CityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CityDefaultArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    traps<T extends Device$trapsArgs<ExtArgs> = {}>(args?: Subset<T, Device$trapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    company<T extends Device$companyArgs<ExtArgs> = {}>(args?: Subset<T, Device$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    telemetry<T extends Device$telemetryArgs<ExtArgs> = {}>(args?: Subset<T, Device$telemetryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Device model
   */
  interface DeviceFieldRefs {
    readonly id: FieldRef<"Device", 'String'>
    readonly name: FieldRef<"Device", 'String'>
    readonly ip: FieldRef<"Device", 'String'>
    readonly serial: FieldRef<"Device", 'String'>
    readonly cityId: FieldRef<"Device", 'String'>
    readonly lastSeen: FieldRef<"Device", 'DateTime'>
    readonly hasAlarm: FieldRef<"Device", 'Boolean'>
    readonly lastSnmpData: FieldRef<"Device", 'String'>
    readonly lastSnmpSync: FieldRef<"Device", 'DateTime'>
    readonly status: FieldRef<"Device", 'String'>
    readonly active: FieldRef<"Device", 'Boolean'>
    readonly syncError: FieldRef<"Device", 'String'>
    readonly companyId: FieldRef<"Device", 'String'>
    readonly vpnUsername: FieldRef<"Device", 'String'>
    readonly vpnStatus: FieldRef<"Device", 'String'>
    readonly vpnIp: FieldRef<"Device", 'String'>
    readonly vpnLastSeen: FieldRef<"Device", 'DateTime'>
    readonly address: FieldRef<"Device", 'String'>
    readonly latitude: FieldRef<"Device", 'Float'>
    readonly longitude: FieldRef<"Device", 'Float'>
    readonly createdAt: FieldRef<"Device", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Device findUnique
   */
  export type DeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findUniqueOrThrow
   */
  export type DeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findFirst
   */
  export type DeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findFirstOrThrow
   */
  export type DeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findMany
   */
  export type DeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Devices to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device create
   */
  export type DeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a Device.
     */
    data: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
  }

  /**
   * Device createMany
   */
  export type DeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
  }

  /**
   * Device createManyAndReturn
   */
  export type DeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device update
   */
  export type DeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a Device.
     */
    data: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
    /**
     * Choose, which Device to update.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device updateMany
   */
  export type DeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
  }

  /**
   * Device updateManyAndReturn
   */
  export type DeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device upsert
   */
  export type DeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the Device to update in case it exists.
     */
    where: DeviceWhereUniqueInput
    /**
     * In case the Device found by the `where` argument doesn't exist, create a new Device with this data.
     */
    create: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
    /**
     * In case the Device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
  }

  /**
   * Device delete
   */
  export type DeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter which Device to delete.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device deleteMany
   */
  export type DeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devices to delete
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to delete.
     */
    limit?: number
  }

  /**
   * Device.traps
   */
  export type Device$trapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    where?: TrapWhereInput
    orderBy?: TrapOrderByWithRelationInput | TrapOrderByWithRelationInput[]
    cursor?: TrapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrapScalarFieldEnum | TrapScalarFieldEnum[]
  }

  /**
   * Device.company
   */
  export type Device$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * Device.telemetry
   */
  export type Device$telemetryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    where?: DeviceTelemetryWhereInput
    orderBy?: DeviceTelemetryOrderByWithRelationInput | DeviceTelemetryOrderByWithRelationInput[]
    cursor?: DeviceTelemetryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceTelemetryScalarFieldEnum | DeviceTelemetryScalarFieldEnum[]
  }

  /**
   * Device without action
   */
  export type DeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
  }


  /**
   * Model DeviceTelemetry
   */

  export type AggregateDeviceTelemetry = {
    _count: DeviceTelemetryCountAggregateOutputType | null
    _min: DeviceTelemetryMinAggregateOutputType | null
    _max: DeviceTelemetryMaxAggregateOutputType | null
  }

  export type DeviceTelemetryMinAggregateOutputType = {
    id: string | null
    deviceId: string | null
    timestamp: Date | null
    hardware: string | null
    metrics: string | null
  }

  export type DeviceTelemetryMaxAggregateOutputType = {
    id: string | null
    deviceId: string | null
    timestamp: Date | null
    hardware: string | null
    metrics: string | null
  }

  export type DeviceTelemetryCountAggregateOutputType = {
    id: number
    deviceId: number
    timestamp: number
    hardware: number
    metrics: number
    _all: number
  }


  export type DeviceTelemetryMinAggregateInputType = {
    id?: true
    deviceId?: true
    timestamp?: true
    hardware?: true
    metrics?: true
  }

  export type DeviceTelemetryMaxAggregateInputType = {
    id?: true
    deviceId?: true
    timestamp?: true
    hardware?: true
    metrics?: true
  }

  export type DeviceTelemetryCountAggregateInputType = {
    id?: true
    deviceId?: true
    timestamp?: true
    hardware?: true
    metrics?: true
    _all?: true
  }

  export type DeviceTelemetryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeviceTelemetry to aggregate.
     */
    where?: DeviceTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceTelemetries to fetch.
     */
    orderBy?: DeviceTelemetryOrderByWithRelationInput | DeviceTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeviceTelemetries
    **/
    _count?: true | DeviceTelemetryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceTelemetryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceTelemetryMaxAggregateInputType
  }

  export type GetDeviceTelemetryAggregateType<T extends DeviceTelemetryAggregateArgs> = {
        [P in keyof T & keyof AggregateDeviceTelemetry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeviceTelemetry[P]>
      : GetScalarType<T[P], AggregateDeviceTelemetry[P]>
  }




  export type DeviceTelemetryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceTelemetryWhereInput
    orderBy?: DeviceTelemetryOrderByWithAggregationInput | DeviceTelemetryOrderByWithAggregationInput[]
    by: DeviceTelemetryScalarFieldEnum[] | DeviceTelemetryScalarFieldEnum
    having?: DeviceTelemetryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceTelemetryCountAggregateInputType | true
    _min?: DeviceTelemetryMinAggregateInputType
    _max?: DeviceTelemetryMaxAggregateInputType
  }

  export type DeviceTelemetryGroupByOutputType = {
    id: string
    deviceId: string
    timestamp: Date
    hardware: string
    metrics: string
    _count: DeviceTelemetryCountAggregateOutputType | null
    _min: DeviceTelemetryMinAggregateOutputType | null
    _max: DeviceTelemetryMaxAggregateOutputType | null
  }

  type GetDeviceTelemetryGroupByPayload<T extends DeviceTelemetryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceTelemetryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceTelemetryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceTelemetryGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceTelemetryGroupByOutputType[P]>
        }
      >
    >


  export type DeviceTelemetrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    timestamp?: boolean
    hardware?: boolean
    metrics?: boolean
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceTelemetry"]>

  export type DeviceTelemetrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    timestamp?: boolean
    hardware?: boolean
    metrics?: boolean
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceTelemetry"]>

  export type DeviceTelemetrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    timestamp?: boolean
    hardware?: boolean
    metrics?: boolean
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceTelemetry"]>

  export type DeviceTelemetrySelectScalar = {
    id?: boolean
    deviceId?: boolean
    timestamp?: boolean
    hardware?: boolean
    metrics?: boolean
  }

  export type DeviceTelemetryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deviceId" | "timestamp" | "hardware" | "metrics", ExtArgs["result"]["deviceTelemetry"]>
  export type DeviceTelemetryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }
  export type DeviceTelemetryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }
  export type DeviceTelemetryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | DeviceDefaultArgs<ExtArgs>
  }

  export type $DeviceTelemetryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeviceTelemetry"
    objects: {
      device: Prisma.$DevicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deviceId: string
      timestamp: Date
      hardware: string
      metrics: string
    }, ExtArgs["result"]["deviceTelemetry"]>
    composites: {}
  }

  type DeviceTelemetryGetPayload<S extends boolean | null | undefined | DeviceTelemetryDefaultArgs> = $Result.GetResult<Prisma.$DeviceTelemetryPayload, S>

  type DeviceTelemetryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceTelemetryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceTelemetryCountAggregateInputType | true
    }

  export interface DeviceTelemetryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeviceTelemetry'], meta: { name: 'DeviceTelemetry' } }
    /**
     * Find zero or one DeviceTelemetry that matches the filter.
     * @param {DeviceTelemetryFindUniqueArgs} args - Arguments to find a DeviceTelemetry
     * @example
     * // Get one DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceTelemetryFindUniqueArgs>(args: SelectSubset<T, DeviceTelemetryFindUniqueArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeviceTelemetry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceTelemetryFindUniqueOrThrowArgs} args - Arguments to find a DeviceTelemetry
     * @example
     * // Get one DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceTelemetryFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceTelemetryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeviceTelemetry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryFindFirstArgs} args - Arguments to find a DeviceTelemetry
     * @example
     * // Get one DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceTelemetryFindFirstArgs>(args?: SelectSubset<T, DeviceTelemetryFindFirstArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeviceTelemetry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryFindFirstOrThrowArgs} args - Arguments to find a DeviceTelemetry
     * @example
     * // Get one DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceTelemetryFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceTelemetryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeviceTelemetries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeviceTelemetries
     * const deviceTelemetries = await prisma.deviceTelemetry.findMany()
     * 
     * // Get first 10 DeviceTelemetries
     * const deviceTelemetries = await prisma.deviceTelemetry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceTelemetryWithIdOnly = await prisma.deviceTelemetry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceTelemetryFindManyArgs>(args?: SelectSubset<T, DeviceTelemetryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeviceTelemetry.
     * @param {DeviceTelemetryCreateArgs} args - Arguments to create a DeviceTelemetry.
     * @example
     * // Create one DeviceTelemetry
     * const DeviceTelemetry = await prisma.deviceTelemetry.create({
     *   data: {
     *     // ... data to create a DeviceTelemetry
     *   }
     * })
     * 
     */
    create<T extends DeviceTelemetryCreateArgs>(args: SelectSubset<T, DeviceTelemetryCreateArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeviceTelemetries.
     * @param {DeviceTelemetryCreateManyArgs} args - Arguments to create many DeviceTelemetries.
     * @example
     * // Create many DeviceTelemetries
     * const deviceTelemetry = await prisma.deviceTelemetry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceTelemetryCreateManyArgs>(args?: SelectSubset<T, DeviceTelemetryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeviceTelemetries and returns the data saved in the database.
     * @param {DeviceTelemetryCreateManyAndReturnArgs} args - Arguments to create many DeviceTelemetries.
     * @example
     * // Create many DeviceTelemetries
     * const deviceTelemetry = await prisma.deviceTelemetry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeviceTelemetries and only return the `id`
     * const deviceTelemetryWithIdOnly = await prisma.deviceTelemetry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceTelemetryCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceTelemetryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeviceTelemetry.
     * @param {DeviceTelemetryDeleteArgs} args - Arguments to delete one DeviceTelemetry.
     * @example
     * // Delete one DeviceTelemetry
     * const DeviceTelemetry = await prisma.deviceTelemetry.delete({
     *   where: {
     *     // ... filter to delete one DeviceTelemetry
     *   }
     * })
     * 
     */
    delete<T extends DeviceTelemetryDeleteArgs>(args: SelectSubset<T, DeviceTelemetryDeleteArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeviceTelemetry.
     * @param {DeviceTelemetryUpdateArgs} args - Arguments to update one DeviceTelemetry.
     * @example
     * // Update one DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceTelemetryUpdateArgs>(args: SelectSubset<T, DeviceTelemetryUpdateArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeviceTelemetries.
     * @param {DeviceTelemetryDeleteManyArgs} args - Arguments to filter DeviceTelemetries to delete.
     * @example
     * // Delete a few DeviceTelemetries
     * const { count } = await prisma.deviceTelemetry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceTelemetryDeleteManyArgs>(args?: SelectSubset<T, DeviceTelemetryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeviceTelemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeviceTelemetries
     * const deviceTelemetry = await prisma.deviceTelemetry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceTelemetryUpdateManyArgs>(args: SelectSubset<T, DeviceTelemetryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeviceTelemetries and returns the data updated in the database.
     * @param {DeviceTelemetryUpdateManyAndReturnArgs} args - Arguments to update many DeviceTelemetries.
     * @example
     * // Update many DeviceTelemetries
     * const deviceTelemetry = await prisma.deviceTelemetry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeviceTelemetries and only return the `id`
     * const deviceTelemetryWithIdOnly = await prisma.deviceTelemetry.updateManyAndReturn({
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
    updateManyAndReturn<T extends DeviceTelemetryUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceTelemetryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeviceTelemetry.
     * @param {DeviceTelemetryUpsertArgs} args - Arguments to update or create a DeviceTelemetry.
     * @example
     * // Update or create a DeviceTelemetry
     * const deviceTelemetry = await prisma.deviceTelemetry.upsert({
     *   create: {
     *     // ... data to create a DeviceTelemetry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeviceTelemetry we want to update
     *   }
     * })
     */
    upsert<T extends DeviceTelemetryUpsertArgs>(args: SelectSubset<T, DeviceTelemetryUpsertArgs<ExtArgs>>): Prisma__DeviceTelemetryClient<$Result.GetResult<Prisma.$DeviceTelemetryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeviceTelemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryCountArgs} args - Arguments to filter DeviceTelemetries to count.
     * @example
     * // Count the number of DeviceTelemetries
     * const count = await prisma.deviceTelemetry.count({
     *   where: {
     *     // ... the filter for the DeviceTelemetries we want to count
     *   }
     * })
    **/
    count<T extends DeviceTelemetryCountArgs>(
      args?: Subset<T, DeviceTelemetryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceTelemetryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeviceTelemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeviceTelemetryAggregateArgs>(args: Subset<T, DeviceTelemetryAggregateArgs>): Prisma.PrismaPromise<GetDeviceTelemetryAggregateType<T>>

    /**
     * Group by DeviceTelemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceTelemetryGroupByArgs} args - Group by arguments.
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
      T extends DeviceTelemetryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceTelemetryGroupByArgs['orderBy'] }
        : { orderBy?: DeviceTelemetryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DeviceTelemetryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceTelemetryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeviceTelemetry model
   */
  readonly fields: DeviceTelemetryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeviceTelemetry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceTelemetryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    device<T extends DeviceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeviceDefaultArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DeviceTelemetry model
   */
  interface DeviceTelemetryFieldRefs {
    readonly id: FieldRef<"DeviceTelemetry", 'String'>
    readonly deviceId: FieldRef<"DeviceTelemetry", 'String'>
    readonly timestamp: FieldRef<"DeviceTelemetry", 'DateTime'>
    readonly hardware: FieldRef<"DeviceTelemetry", 'String'>
    readonly metrics: FieldRef<"DeviceTelemetry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DeviceTelemetry findUnique
   */
  export type DeviceTelemetryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceTelemetry to fetch.
     */
    where: DeviceTelemetryWhereUniqueInput
  }

  /**
   * DeviceTelemetry findUniqueOrThrow
   */
  export type DeviceTelemetryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceTelemetry to fetch.
     */
    where: DeviceTelemetryWhereUniqueInput
  }

  /**
   * DeviceTelemetry findFirst
   */
  export type DeviceTelemetryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceTelemetry to fetch.
     */
    where?: DeviceTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceTelemetries to fetch.
     */
    orderBy?: DeviceTelemetryOrderByWithRelationInput | DeviceTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeviceTelemetries.
     */
    cursor?: DeviceTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeviceTelemetries.
     */
    distinct?: DeviceTelemetryScalarFieldEnum | DeviceTelemetryScalarFieldEnum[]
  }

  /**
   * DeviceTelemetry findFirstOrThrow
   */
  export type DeviceTelemetryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceTelemetry to fetch.
     */
    where?: DeviceTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceTelemetries to fetch.
     */
    orderBy?: DeviceTelemetryOrderByWithRelationInput | DeviceTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeviceTelemetries.
     */
    cursor?: DeviceTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeviceTelemetries.
     */
    distinct?: DeviceTelemetryScalarFieldEnum | DeviceTelemetryScalarFieldEnum[]
  }

  /**
   * DeviceTelemetry findMany
   */
  export type DeviceTelemetryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceTelemetries to fetch.
     */
    where?: DeviceTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceTelemetries to fetch.
     */
    orderBy?: DeviceTelemetryOrderByWithRelationInput | DeviceTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeviceTelemetries.
     */
    cursor?: DeviceTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceTelemetries.
     */
    skip?: number
    distinct?: DeviceTelemetryScalarFieldEnum | DeviceTelemetryScalarFieldEnum[]
  }

  /**
   * DeviceTelemetry create
   */
  export type DeviceTelemetryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * The data needed to create a DeviceTelemetry.
     */
    data: XOR<DeviceTelemetryCreateInput, DeviceTelemetryUncheckedCreateInput>
  }

  /**
   * DeviceTelemetry createMany
   */
  export type DeviceTelemetryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeviceTelemetries.
     */
    data: DeviceTelemetryCreateManyInput | DeviceTelemetryCreateManyInput[]
  }

  /**
   * DeviceTelemetry createManyAndReturn
   */
  export type DeviceTelemetryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * The data used to create many DeviceTelemetries.
     */
    data: DeviceTelemetryCreateManyInput | DeviceTelemetryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeviceTelemetry update
   */
  export type DeviceTelemetryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * The data needed to update a DeviceTelemetry.
     */
    data: XOR<DeviceTelemetryUpdateInput, DeviceTelemetryUncheckedUpdateInput>
    /**
     * Choose, which DeviceTelemetry to update.
     */
    where: DeviceTelemetryWhereUniqueInput
  }

  /**
   * DeviceTelemetry updateMany
   */
  export type DeviceTelemetryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeviceTelemetries.
     */
    data: XOR<DeviceTelemetryUpdateManyMutationInput, DeviceTelemetryUncheckedUpdateManyInput>
    /**
     * Filter which DeviceTelemetries to update
     */
    where?: DeviceTelemetryWhereInput
    /**
     * Limit how many DeviceTelemetries to update.
     */
    limit?: number
  }

  /**
   * DeviceTelemetry updateManyAndReturn
   */
  export type DeviceTelemetryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * The data used to update DeviceTelemetries.
     */
    data: XOR<DeviceTelemetryUpdateManyMutationInput, DeviceTelemetryUncheckedUpdateManyInput>
    /**
     * Filter which DeviceTelemetries to update
     */
    where?: DeviceTelemetryWhereInput
    /**
     * Limit how many DeviceTelemetries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeviceTelemetry upsert
   */
  export type DeviceTelemetryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * The filter to search for the DeviceTelemetry to update in case it exists.
     */
    where: DeviceTelemetryWhereUniqueInput
    /**
     * In case the DeviceTelemetry found by the `where` argument doesn't exist, create a new DeviceTelemetry with this data.
     */
    create: XOR<DeviceTelemetryCreateInput, DeviceTelemetryUncheckedCreateInput>
    /**
     * In case the DeviceTelemetry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceTelemetryUpdateInput, DeviceTelemetryUncheckedUpdateInput>
  }

  /**
   * DeviceTelemetry delete
   */
  export type DeviceTelemetryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
    /**
     * Filter which DeviceTelemetry to delete.
     */
    where: DeviceTelemetryWhereUniqueInput
  }

  /**
   * DeviceTelemetry deleteMany
   */
  export type DeviceTelemetryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeviceTelemetries to delete
     */
    where?: DeviceTelemetryWhereInput
    /**
     * Limit how many DeviceTelemetries to delete.
     */
    limit?: number
  }

  /**
   * DeviceTelemetry without action
   */
  export type DeviceTelemetryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceTelemetry
     */
    select?: DeviceTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceTelemetry
     */
    omit?: DeviceTelemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceTelemetryInclude<ExtArgs> | null
  }


  /**
   * Model UserAccess
   */

  export type AggregateUserAccess = {
    _count: UserAccessCountAggregateOutputType | null
    _min: UserAccessMinAggregateOutputType | null
    _max: UserAccessMaxAggregateOutputType | null
  }

  export type UserAccessMinAggregateOutputType = {
    userId: string | null
    cityId: string | null
    permission: string | null
  }

  export type UserAccessMaxAggregateOutputType = {
    userId: string | null
    cityId: string | null
    permission: string | null
  }

  export type UserAccessCountAggregateOutputType = {
    userId: number
    cityId: number
    permission: number
    _all: number
  }


  export type UserAccessMinAggregateInputType = {
    userId?: true
    cityId?: true
    permission?: true
  }

  export type UserAccessMaxAggregateInputType = {
    userId?: true
    cityId?: true
    permission?: true
  }

  export type UserAccessCountAggregateInputType = {
    userId?: true
    cityId?: true
    permission?: true
    _all?: true
  }

  export type UserAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccess to aggregate.
     */
    where?: UserAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccesses to fetch.
     */
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAccesses
    **/
    _count?: true | UserAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAccessMaxAggregateInputType
  }

  export type GetUserAccessAggregateType<T extends UserAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAccess[P]>
      : GetScalarType<T[P], AggregateUserAccess[P]>
  }




  export type UserAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccessWhereInput
    orderBy?: UserAccessOrderByWithAggregationInput | UserAccessOrderByWithAggregationInput[]
    by: UserAccessScalarFieldEnum[] | UserAccessScalarFieldEnum
    having?: UserAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAccessCountAggregateInputType | true
    _min?: UserAccessMinAggregateInputType
    _max?: UserAccessMaxAggregateInputType
  }

  export type UserAccessGroupByOutputType = {
    userId: string
    cityId: string
    permission: string
    _count: UserAccessCountAggregateOutputType | null
    _min: UserAccessMinAggregateOutputType | null
    _max: UserAccessMaxAggregateOutputType | null
  }

  type GetUserAccessGroupByPayload<T extends UserAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAccessGroupByOutputType[P]>
            : GetScalarType<T[P], UserAccessGroupByOutputType[P]>
        }
      >
    >


  export type UserAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    cityId?: boolean
    permission?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccess"]>

  export type UserAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    cityId?: boolean
    permission?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccess"]>

  export type UserAccessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    cityId?: boolean
    permission?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccess"]>

  export type UserAccessSelectScalar = {
    userId?: boolean
    cityId?: boolean
    permission?: boolean
  }

  export type UserAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "cityId" | "permission", ExtArgs["result"]["userAccess"]>
  export type UserAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }
  export type UserAccessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }
  export type UserAccessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    city?: boolean | CityDefaultArgs<ExtArgs>
  }

  export type $UserAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAccess"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      city: Prisma.$CityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      cityId: string
      permission: string
    }, ExtArgs["result"]["userAccess"]>
    composites: {}
  }

  type UserAccessGetPayload<S extends boolean | null | undefined | UserAccessDefaultArgs> = $Result.GetResult<Prisma.$UserAccessPayload, S>

  type UserAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAccessCountAggregateInputType | true
    }

  export interface UserAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAccess'], meta: { name: 'UserAccess' } }
    /**
     * Find zero or one UserAccess that matches the filter.
     * @param {UserAccessFindUniqueArgs} args - Arguments to find a UserAccess
     * @example
     * // Get one UserAccess
     * const userAccess = await prisma.userAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAccessFindUniqueArgs>(args: SelectSubset<T, UserAccessFindUniqueArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAccessFindUniqueOrThrowArgs} args - Arguments to find a UserAccess
     * @example
     * // Get one UserAccess
     * const userAccess = await prisma.userAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessFindFirstArgs} args - Arguments to find a UserAccess
     * @example
     * // Get one UserAccess
     * const userAccess = await prisma.userAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAccessFindFirstArgs>(args?: SelectSubset<T, UserAccessFindFirstArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessFindFirstOrThrowArgs} args - Arguments to find a UserAccess
     * @example
     * // Get one UserAccess
     * const userAccess = await prisma.userAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAccesses
     * const userAccesses = await prisma.userAccess.findMany()
     * 
     * // Get first 10 UserAccesses
     * const userAccesses = await prisma.userAccess.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userAccessWithUserIdOnly = await prisma.userAccess.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserAccessFindManyArgs>(args?: SelectSubset<T, UserAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAccess.
     * @param {UserAccessCreateArgs} args - Arguments to create a UserAccess.
     * @example
     * // Create one UserAccess
     * const UserAccess = await prisma.userAccess.create({
     *   data: {
     *     // ... data to create a UserAccess
     *   }
     * })
     * 
     */
    create<T extends UserAccessCreateArgs>(args: SelectSubset<T, UserAccessCreateArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAccesses.
     * @param {UserAccessCreateManyArgs} args - Arguments to create many UserAccesses.
     * @example
     * // Create many UserAccesses
     * const userAccess = await prisma.userAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAccessCreateManyArgs>(args?: SelectSubset<T, UserAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAccesses and returns the data saved in the database.
     * @param {UserAccessCreateManyAndReturnArgs} args - Arguments to create many UserAccesses.
     * @example
     * // Create many UserAccesses
     * const userAccess = await prisma.userAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAccesses and only return the `userId`
     * const userAccessWithUserIdOnly = await prisma.userAccess.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAccess.
     * @param {UserAccessDeleteArgs} args - Arguments to delete one UserAccess.
     * @example
     * // Delete one UserAccess
     * const UserAccess = await prisma.userAccess.delete({
     *   where: {
     *     // ... filter to delete one UserAccess
     *   }
     * })
     * 
     */
    delete<T extends UserAccessDeleteArgs>(args: SelectSubset<T, UserAccessDeleteArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAccess.
     * @param {UserAccessUpdateArgs} args - Arguments to update one UserAccess.
     * @example
     * // Update one UserAccess
     * const userAccess = await prisma.userAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAccessUpdateArgs>(args: SelectSubset<T, UserAccessUpdateArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAccesses.
     * @param {UserAccessDeleteManyArgs} args - Arguments to filter UserAccesses to delete.
     * @example
     * // Delete a few UserAccesses
     * const { count } = await prisma.userAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAccessDeleteManyArgs>(args?: SelectSubset<T, UserAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAccesses
     * const userAccess = await prisma.userAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAccessUpdateManyArgs>(args: SelectSubset<T, UserAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccesses and returns the data updated in the database.
     * @param {UserAccessUpdateManyAndReturnArgs} args - Arguments to update many UserAccesses.
     * @example
     * // Update many UserAccesses
     * const userAccess = await prisma.userAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAccesses and only return the `userId`
     * const userAccessWithUserIdOnly = await prisma.userAccess.updateManyAndReturn({
     *   select: { userId: true },
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
    updateManyAndReturn<T extends UserAccessUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAccess.
     * @param {UserAccessUpsertArgs} args - Arguments to update or create a UserAccess.
     * @example
     * // Update or create a UserAccess
     * const userAccess = await prisma.userAccess.upsert({
     *   create: {
     *     // ... data to create a UserAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAccess we want to update
     *   }
     * })
     */
    upsert<T extends UserAccessUpsertArgs>(args: SelectSubset<T, UserAccessUpsertArgs<ExtArgs>>): Prisma__UserAccessClient<$Result.GetResult<Prisma.$UserAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessCountArgs} args - Arguments to filter UserAccesses to count.
     * @example
     * // Count the number of UserAccesses
     * const count = await prisma.userAccess.count({
     *   where: {
     *     // ... the filter for the UserAccesses we want to count
     *   }
     * })
    **/
    count<T extends UserAccessCountArgs>(
      args?: Subset<T, UserAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAccessAggregateArgs>(args: Subset<T, UserAccessAggregateArgs>): Prisma.PrismaPromise<GetUserAccessAggregateType<T>>

    /**
     * Group by UserAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccessGroupByArgs} args - Group by arguments.
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
      T extends UserAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAccessGroupByArgs['orderBy'] }
        : { orderBy?: UserAccessGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAccess model
   */
  readonly fields: UserAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    city<T extends CityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CityDefaultArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserAccess model
   */
  interface UserAccessFieldRefs {
    readonly userId: FieldRef<"UserAccess", 'String'>
    readonly cityId: FieldRef<"UserAccess", 'String'>
    readonly permission: FieldRef<"UserAccess", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserAccess findUnique
   */
  export type UserAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserAccess to fetch.
     */
    where: UserAccessWhereUniqueInput
  }

  /**
   * UserAccess findUniqueOrThrow
   */
  export type UserAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserAccess to fetch.
     */
    where: UserAccessWhereUniqueInput
  }

  /**
   * UserAccess findFirst
   */
  export type UserAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserAccess to fetch.
     */
    where?: UserAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccesses to fetch.
     */
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccesses.
     */
    cursor?: UserAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccesses.
     */
    distinct?: UserAccessScalarFieldEnum | UserAccessScalarFieldEnum[]
  }

  /**
   * UserAccess findFirstOrThrow
   */
  export type UserAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserAccess to fetch.
     */
    where?: UserAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccesses to fetch.
     */
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccesses.
     */
    cursor?: UserAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccesses.
     */
    distinct?: UserAccessScalarFieldEnum | UserAccessScalarFieldEnum[]
  }

  /**
   * UserAccess findMany
   */
  export type UserAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserAccesses to fetch.
     */
    where?: UserAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccesses to fetch.
     */
    orderBy?: UserAccessOrderByWithRelationInput | UserAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAccesses.
     */
    cursor?: UserAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccesses.
     */
    skip?: number
    distinct?: UserAccessScalarFieldEnum | UserAccessScalarFieldEnum[]
  }

  /**
   * UserAccess create
   */
  export type UserAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAccess.
     */
    data: XOR<UserAccessCreateInput, UserAccessUncheckedCreateInput>
  }

  /**
   * UserAccess createMany
   */
  export type UserAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAccesses.
     */
    data: UserAccessCreateManyInput | UserAccessCreateManyInput[]
  }

  /**
   * UserAccess createManyAndReturn
   */
  export type UserAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * The data used to create many UserAccesses.
     */
    data: UserAccessCreateManyInput | UserAccessCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAccess update
   */
  export type UserAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAccess.
     */
    data: XOR<UserAccessUpdateInput, UserAccessUncheckedUpdateInput>
    /**
     * Choose, which UserAccess to update.
     */
    where: UserAccessWhereUniqueInput
  }

  /**
   * UserAccess updateMany
   */
  export type UserAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAccesses.
     */
    data: XOR<UserAccessUpdateManyMutationInput, UserAccessUncheckedUpdateManyInput>
    /**
     * Filter which UserAccesses to update
     */
    where?: UserAccessWhereInput
    /**
     * Limit how many UserAccesses to update.
     */
    limit?: number
  }

  /**
   * UserAccess updateManyAndReturn
   */
  export type UserAccessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * The data used to update UserAccesses.
     */
    data: XOR<UserAccessUpdateManyMutationInput, UserAccessUncheckedUpdateManyInput>
    /**
     * Filter which UserAccesses to update
     */
    where?: UserAccessWhereInput
    /**
     * Limit how many UserAccesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAccess upsert
   */
  export type UserAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAccess to update in case it exists.
     */
    where: UserAccessWhereUniqueInput
    /**
     * In case the UserAccess found by the `where` argument doesn't exist, create a new UserAccess with this data.
     */
    create: XOR<UserAccessCreateInput, UserAccessUncheckedCreateInput>
    /**
     * In case the UserAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAccessUpdateInput, UserAccessUncheckedUpdateInput>
  }

  /**
   * UserAccess delete
   */
  export type UserAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
    /**
     * Filter which UserAccess to delete.
     */
    where: UserAccessWhereUniqueInput
  }

  /**
   * UserAccess deleteMany
   */
  export type UserAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccesses to delete
     */
    where?: UserAccessWhereInput
    /**
     * Limit how many UserAccesses to delete.
     */
    limit?: number
  }

  /**
   * UserAccess without action
   */
  export type UserAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccess
     */
    select?: UserAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAccess
     */
    omit?: UserAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccessInclude<ExtArgs> | null
  }


  /**
   * Model Trap
   */

  export type AggregateTrap = {
    _count: TrapCountAggregateOutputType | null
    _avg: TrapAvgAggregateOutputType | null
    _sum: TrapSumAggregateOutputType | null
    _min: TrapMinAggregateOutputType | null
    _max: TrapMaxAggregateOutputType | null
  }

  export type TrapAvgAggregateOutputType = {
    severity: number | null
  }

  export type TrapSumAggregateOutputType = {
    severity: number | null
  }

  export type TrapMinAggregateOutputType = {
    id: string | null
    deviceId: string | null
    deviceSerial: string | null
    ctrlName: string | null
    severity: number | null
    oid: string | null
    alarmName: string | null
    description: string | null
    fullText: string | null
    timestamp: Date | null
    isCleared: boolean | null
  }

  export type TrapMaxAggregateOutputType = {
    id: string | null
    deviceId: string | null
    deviceSerial: string | null
    ctrlName: string | null
    severity: number | null
    oid: string | null
    alarmName: string | null
    description: string | null
    fullText: string | null
    timestamp: Date | null
    isCleared: boolean | null
  }

  export type TrapCountAggregateOutputType = {
    id: number
    deviceId: number
    deviceSerial: number
    ctrlName: number
    severity: number
    oid: number
    alarmName: number
    description: number
    fullText: number
    timestamp: number
    isCleared: number
    _all: number
  }


  export type TrapAvgAggregateInputType = {
    severity?: true
  }

  export type TrapSumAggregateInputType = {
    severity?: true
  }

  export type TrapMinAggregateInputType = {
    id?: true
    deviceId?: true
    deviceSerial?: true
    ctrlName?: true
    severity?: true
    oid?: true
    alarmName?: true
    description?: true
    fullText?: true
    timestamp?: true
    isCleared?: true
  }

  export type TrapMaxAggregateInputType = {
    id?: true
    deviceId?: true
    deviceSerial?: true
    ctrlName?: true
    severity?: true
    oid?: true
    alarmName?: true
    description?: true
    fullText?: true
    timestamp?: true
    isCleared?: true
  }

  export type TrapCountAggregateInputType = {
    id?: true
    deviceId?: true
    deviceSerial?: true
    ctrlName?: true
    severity?: true
    oid?: true
    alarmName?: true
    description?: true
    fullText?: true
    timestamp?: true
    isCleared?: true
    _all?: true
  }

  export type TrapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trap to aggregate.
     */
    where?: TrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Traps to fetch.
     */
    orderBy?: TrapOrderByWithRelationInput | TrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Traps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Traps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Traps
    **/
    _count?: true | TrapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrapMaxAggregateInputType
  }

  export type GetTrapAggregateType<T extends TrapAggregateArgs> = {
        [P in keyof T & keyof AggregateTrap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrap[P]>
      : GetScalarType<T[P], AggregateTrap[P]>
  }




  export type TrapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrapWhereInput
    orderBy?: TrapOrderByWithAggregationInput | TrapOrderByWithAggregationInput[]
    by: TrapScalarFieldEnum[] | TrapScalarFieldEnum
    having?: TrapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrapCountAggregateInputType | true
    _avg?: TrapAvgAggregateInputType
    _sum?: TrapSumAggregateInputType
    _min?: TrapMinAggregateInputType
    _max?: TrapMaxAggregateInputType
  }

  export type TrapGroupByOutputType = {
    id: string
    deviceId: string | null
    deviceSerial: string | null
    ctrlName: string | null
    severity: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp: Date
    isCleared: boolean
    _count: TrapCountAggregateOutputType | null
    _avg: TrapAvgAggregateOutputType | null
    _sum: TrapSumAggregateOutputType | null
    _min: TrapMinAggregateOutputType | null
    _max: TrapMaxAggregateOutputType | null
  }

  type GetTrapGroupByPayload<T extends TrapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrapGroupByOutputType[P]>
            : GetScalarType<T[P], TrapGroupByOutputType[P]>
        }
      >
    >


  export type TrapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    deviceSerial?: boolean
    ctrlName?: boolean
    severity?: boolean
    oid?: boolean
    alarmName?: boolean
    description?: boolean
    fullText?: boolean
    timestamp?: boolean
    isCleared?: boolean
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["trap"]>

  export type TrapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    deviceSerial?: boolean
    ctrlName?: boolean
    severity?: boolean
    oid?: boolean
    alarmName?: boolean
    description?: boolean
    fullText?: boolean
    timestamp?: boolean
    isCleared?: boolean
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["trap"]>

  export type TrapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceId?: boolean
    deviceSerial?: boolean
    ctrlName?: boolean
    severity?: boolean
    oid?: boolean
    alarmName?: boolean
    description?: boolean
    fullText?: boolean
    timestamp?: boolean
    isCleared?: boolean
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["trap"]>

  export type TrapSelectScalar = {
    id?: boolean
    deviceId?: boolean
    deviceSerial?: boolean
    ctrlName?: boolean
    severity?: boolean
    oid?: boolean
    alarmName?: boolean
    description?: boolean
    fullText?: boolean
    timestamp?: boolean
    isCleared?: boolean
  }

  export type TrapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deviceId" | "deviceSerial" | "ctrlName" | "severity" | "oid" | "alarmName" | "description" | "fullText" | "timestamp" | "isCleared", ExtArgs["result"]["trap"]>
  export type TrapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }
  export type TrapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }
  export type TrapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | Trap$deviceArgs<ExtArgs>
  }

  export type $TrapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trap"
    objects: {
      device: Prisma.$DevicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deviceId: string | null
      deviceSerial: string | null
      ctrlName: string | null
      severity: number
      oid: string
      alarmName: string
      description: string
      fullText: string
      timestamp: Date
      isCleared: boolean
    }, ExtArgs["result"]["trap"]>
    composites: {}
  }

  type TrapGetPayload<S extends boolean | null | undefined | TrapDefaultArgs> = $Result.GetResult<Prisma.$TrapPayload, S>

  type TrapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrapCountAggregateInputType | true
    }

  export interface TrapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trap'], meta: { name: 'Trap' } }
    /**
     * Find zero or one Trap that matches the filter.
     * @param {TrapFindUniqueArgs} args - Arguments to find a Trap
     * @example
     * // Get one Trap
     * const trap = await prisma.trap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrapFindUniqueArgs>(args: SelectSubset<T, TrapFindUniqueArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Trap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrapFindUniqueOrThrowArgs} args - Arguments to find a Trap
     * @example
     * // Get one Trap
     * const trap = await prisma.trap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrapFindUniqueOrThrowArgs>(args: SelectSubset<T, TrapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapFindFirstArgs} args - Arguments to find a Trap
     * @example
     * // Get one Trap
     * const trap = await prisma.trap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrapFindFirstArgs>(args?: SelectSubset<T, TrapFindFirstArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapFindFirstOrThrowArgs} args - Arguments to find a Trap
     * @example
     * // Get one Trap
     * const trap = await prisma.trap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrapFindFirstOrThrowArgs>(args?: SelectSubset<T, TrapFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Traps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Traps
     * const traps = await prisma.trap.findMany()
     * 
     * // Get first 10 Traps
     * const traps = await prisma.trap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trapWithIdOnly = await prisma.trap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrapFindManyArgs>(args?: SelectSubset<T, TrapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Trap.
     * @param {TrapCreateArgs} args - Arguments to create a Trap.
     * @example
     * // Create one Trap
     * const Trap = await prisma.trap.create({
     *   data: {
     *     // ... data to create a Trap
     *   }
     * })
     * 
     */
    create<T extends TrapCreateArgs>(args: SelectSubset<T, TrapCreateArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Traps.
     * @param {TrapCreateManyArgs} args - Arguments to create many Traps.
     * @example
     * // Create many Traps
     * const trap = await prisma.trap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrapCreateManyArgs>(args?: SelectSubset<T, TrapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Traps and returns the data saved in the database.
     * @param {TrapCreateManyAndReturnArgs} args - Arguments to create many Traps.
     * @example
     * // Create many Traps
     * const trap = await prisma.trap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Traps and only return the `id`
     * const trapWithIdOnly = await prisma.trap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrapCreateManyAndReturnArgs>(args?: SelectSubset<T, TrapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Trap.
     * @param {TrapDeleteArgs} args - Arguments to delete one Trap.
     * @example
     * // Delete one Trap
     * const Trap = await prisma.trap.delete({
     *   where: {
     *     // ... filter to delete one Trap
     *   }
     * })
     * 
     */
    delete<T extends TrapDeleteArgs>(args: SelectSubset<T, TrapDeleteArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Trap.
     * @param {TrapUpdateArgs} args - Arguments to update one Trap.
     * @example
     * // Update one Trap
     * const trap = await prisma.trap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrapUpdateArgs>(args: SelectSubset<T, TrapUpdateArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Traps.
     * @param {TrapDeleteManyArgs} args - Arguments to filter Traps to delete.
     * @example
     * // Delete a few Traps
     * const { count } = await prisma.trap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrapDeleteManyArgs>(args?: SelectSubset<T, TrapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Traps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Traps
     * const trap = await prisma.trap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrapUpdateManyArgs>(args: SelectSubset<T, TrapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Traps and returns the data updated in the database.
     * @param {TrapUpdateManyAndReturnArgs} args - Arguments to update many Traps.
     * @example
     * // Update many Traps
     * const trap = await prisma.trap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Traps and only return the `id`
     * const trapWithIdOnly = await prisma.trap.updateManyAndReturn({
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
    updateManyAndReturn<T extends TrapUpdateManyAndReturnArgs>(args: SelectSubset<T, TrapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Trap.
     * @param {TrapUpsertArgs} args - Arguments to update or create a Trap.
     * @example
     * // Update or create a Trap
     * const trap = await prisma.trap.upsert({
     *   create: {
     *     // ... data to create a Trap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trap we want to update
     *   }
     * })
     */
    upsert<T extends TrapUpsertArgs>(args: SelectSubset<T, TrapUpsertArgs<ExtArgs>>): Prisma__TrapClient<$Result.GetResult<Prisma.$TrapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Traps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapCountArgs} args - Arguments to filter Traps to count.
     * @example
     * // Count the number of Traps
     * const count = await prisma.trap.count({
     *   where: {
     *     // ... the filter for the Traps we want to count
     *   }
     * })
    **/
    count<T extends TrapCountArgs>(
      args?: Subset<T, TrapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TrapAggregateArgs>(args: Subset<T, TrapAggregateArgs>): Prisma.PrismaPromise<GetTrapAggregateType<T>>

    /**
     * Group by Trap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrapGroupByArgs} args - Group by arguments.
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
      T extends TrapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrapGroupByArgs['orderBy'] }
        : { orderBy?: TrapGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TrapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trap model
   */
  readonly fields: TrapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    device<T extends Trap$deviceArgs<ExtArgs> = {}>(args?: Subset<T, Trap$deviceArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Trap model
   */
  interface TrapFieldRefs {
    readonly id: FieldRef<"Trap", 'String'>
    readonly deviceId: FieldRef<"Trap", 'String'>
    readonly deviceSerial: FieldRef<"Trap", 'String'>
    readonly ctrlName: FieldRef<"Trap", 'String'>
    readonly severity: FieldRef<"Trap", 'Int'>
    readonly oid: FieldRef<"Trap", 'String'>
    readonly alarmName: FieldRef<"Trap", 'String'>
    readonly description: FieldRef<"Trap", 'String'>
    readonly fullText: FieldRef<"Trap", 'String'>
    readonly timestamp: FieldRef<"Trap", 'DateTime'>
    readonly isCleared: FieldRef<"Trap", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Trap findUnique
   */
  export type TrapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter, which Trap to fetch.
     */
    where: TrapWhereUniqueInput
  }

  /**
   * Trap findUniqueOrThrow
   */
  export type TrapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter, which Trap to fetch.
     */
    where: TrapWhereUniqueInput
  }

  /**
   * Trap findFirst
   */
  export type TrapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter, which Trap to fetch.
     */
    where?: TrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Traps to fetch.
     */
    orderBy?: TrapOrderByWithRelationInput | TrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Traps.
     */
    cursor?: TrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Traps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Traps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Traps.
     */
    distinct?: TrapScalarFieldEnum | TrapScalarFieldEnum[]
  }

  /**
   * Trap findFirstOrThrow
   */
  export type TrapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter, which Trap to fetch.
     */
    where?: TrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Traps to fetch.
     */
    orderBy?: TrapOrderByWithRelationInput | TrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Traps.
     */
    cursor?: TrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Traps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Traps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Traps.
     */
    distinct?: TrapScalarFieldEnum | TrapScalarFieldEnum[]
  }

  /**
   * Trap findMany
   */
  export type TrapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter, which Traps to fetch.
     */
    where?: TrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Traps to fetch.
     */
    orderBy?: TrapOrderByWithRelationInput | TrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Traps.
     */
    cursor?: TrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Traps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Traps.
     */
    skip?: number
    distinct?: TrapScalarFieldEnum | TrapScalarFieldEnum[]
  }

  /**
   * Trap create
   */
  export type TrapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * The data needed to create a Trap.
     */
    data: XOR<TrapCreateInput, TrapUncheckedCreateInput>
  }

  /**
   * Trap createMany
   */
  export type TrapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Traps.
     */
    data: TrapCreateManyInput | TrapCreateManyInput[]
  }

  /**
   * Trap createManyAndReturn
   */
  export type TrapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * The data used to create many Traps.
     */
    data: TrapCreateManyInput | TrapCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trap update
   */
  export type TrapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * The data needed to update a Trap.
     */
    data: XOR<TrapUpdateInput, TrapUncheckedUpdateInput>
    /**
     * Choose, which Trap to update.
     */
    where: TrapWhereUniqueInput
  }

  /**
   * Trap updateMany
   */
  export type TrapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Traps.
     */
    data: XOR<TrapUpdateManyMutationInput, TrapUncheckedUpdateManyInput>
    /**
     * Filter which Traps to update
     */
    where?: TrapWhereInput
    /**
     * Limit how many Traps to update.
     */
    limit?: number
  }

  /**
   * Trap updateManyAndReturn
   */
  export type TrapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * The data used to update Traps.
     */
    data: XOR<TrapUpdateManyMutationInput, TrapUncheckedUpdateManyInput>
    /**
     * Filter which Traps to update
     */
    where?: TrapWhereInput
    /**
     * Limit how many Traps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trap upsert
   */
  export type TrapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * The filter to search for the Trap to update in case it exists.
     */
    where: TrapWhereUniqueInput
    /**
     * In case the Trap found by the `where` argument doesn't exist, create a new Trap with this data.
     */
    create: XOR<TrapCreateInput, TrapUncheckedCreateInput>
    /**
     * In case the Trap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrapUpdateInput, TrapUncheckedUpdateInput>
  }

  /**
   * Trap delete
   */
  export type TrapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
    /**
     * Filter which Trap to delete.
     */
    where: TrapWhereUniqueInput
  }

  /**
   * Trap deleteMany
   */
  export type TrapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Traps to delete
     */
    where?: TrapWhereInput
    /**
     * Limit how many Traps to delete.
     */
    limit?: number
  }

  /**
   * Trap.device
   */
  export type Trap$deviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
  }

  /**
   * Trap without action
   */
  export type TrapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trap
     */
    select?: TrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trap
     */
    omit?: TrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrapInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    status: string | null
    paymentStatus: string | null
    dueDate: Date | null
    lastPaymentAt: Date | null
    blockedAt: Date | null
    createdAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    status: string | null
    paymentStatus: string | null
    dueDate: Date | null
    lastPaymentAt: Date | null
    blockedAt: Date | null
    createdAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    status: number
    paymentStatus: number
    dueDate: number
    lastPaymentAt: number
    blockedAt: number
    createdAt: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    paymentStatus?: true
    dueDate?: true
    lastPaymentAt?: true
    blockedAt?: true
    createdAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    paymentStatus?: true
    dueDate?: true
    lastPaymentAt?: true
    blockedAt?: true
    createdAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    paymentStatus?: true
    dueDate?: true
    lastPaymentAt?: true
    blockedAt?: true
    createdAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    status: string
    paymentStatus: string
    dueDate: Date | null
    lastPaymentAt: Date | null
    blockedAt: Date | null
    createdAt: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    paymentStatus?: boolean
    dueDate?: boolean
    lastPaymentAt?: boolean
    blockedAt?: boolean
    createdAt?: boolean
    users?: boolean | Company$usersArgs<ExtArgs>
    devices?: boolean | Company$devicesArgs<ExtArgs>
    kronDevices?: boolean | Company$kronDevicesArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    paymentStatus?: boolean
    dueDate?: boolean
    lastPaymentAt?: boolean
    blockedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    paymentStatus?: boolean
    dueDate?: boolean
    lastPaymentAt?: boolean
    blockedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    paymentStatus?: boolean
    dueDate?: boolean
    lastPaymentAt?: boolean
    blockedAt?: boolean
    createdAt?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "paymentStatus" | "dueDate" | "lastPaymentAt" | "blockedAt" | "createdAt", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Company$usersArgs<ExtArgs>
    devices?: boolean | Company$devicesArgs<ExtArgs>
    kronDevices?: boolean | Company$kronDevicesArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      devices: Prisma.$DevicePayload<ExtArgs>[]
      kronDevices: Prisma.$KronDevicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      status: string
      paymentStatus: string
      dueDate: Date | null
      lastPaymentAt: Date | null
      blockedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies and returns the data updated in the database.
     * @param {CompanyUpdateManyAndReturnArgs} args - Arguments to update many Companies.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.updateManyAndReturn({
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
    updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
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
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Company$usersArgs<ExtArgs> = {}>(args?: Subset<T, Company$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends Company$devicesArgs<ExtArgs> = {}>(args?: Subset<T, Company$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kronDevices<T extends Company$kronDevicesArgs<ExtArgs> = {}>(args?: Subset<T, Company$kronDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Company model
   */
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly status: FieldRef<"Company", 'String'>
    readonly paymentStatus: FieldRef<"Company", 'String'>
    readonly dueDate: FieldRef<"Company", 'DateTime'>
    readonly lastPaymentAt: FieldRef<"Company", 'DateTime'>
    readonly blockedAt: FieldRef<"Company", 'DateTime'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company updateManyAndReturn
   */
  export type CompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to delete.
     */
    limit?: number
  }

  /**
   * Company.users
   */
  export type Company$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Company.devices
   */
  export type Company$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Company.kronDevices
   */
  export type Company$kronDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    where?: KronDeviceWhereInput
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    cursor?: KronDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KronDeviceScalarFieldEnum | KronDeviceScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model KronDevice
   */

  export type AggregateKronDevice = {
    _count: KronDeviceCountAggregateOutputType | null
    _min: KronDeviceMinAggregateOutputType | null
    _max: KronDeviceMaxAggregateOutputType | null
  }

  export type KronDeviceMinAggregateOutputType = {
    id: string | null
    name: string | null
    serial: string | null
    mqttTopic: string | null
    location: string | null
    cityId: string | null
    companyId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KronDeviceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    serial: string | null
    mqttTopic: string | null
    location: string | null
    cityId: string | null
    companyId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KronDeviceCountAggregateOutputType = {
    id: number
    name: number
    serial: number
    mqttTopic: number
    location: number
    cityId: number
    companyId: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KronDeviceMinAggregateInputType = {
    id?: true
    name?: true
    serial?: true
    mqttTopic?: true
    location?: true
    cityId?: true
    companyId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KronDeviceMaxAggregateInputType = {
    id?: true
    name?: true
    serial?: true
    mqttTopic?: true
    location?: true
    cityId?: true
    companyId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KronDeviceCountAggregateInputType = {
    id?: true
    name?: true
    serial?: true
    mqttTopic?: true
    location?: true
    cityId?: true
    companyId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KronDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KronDevice to aggregate.
     */
    where?: KronDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronDevices to fetch.
     */
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KronDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KronDevices
    **/
    _count?: true | KronDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KronDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KronDeviceMaxAggregateInputType
  }

  export type GetKronDeviceAggregateType<T extends KronDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateKronDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKronDevice[P]>
      : GetScalarType<T[P], AggregateKronDevice[P]>
  }




  export type KronDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KronDeviceWhereInput
    orderBy?: KronDeviceOrderByWithAggregationInput | KronDeviceOrderByWithAggregationInput[]
    by: KronDeviceScalarFieldEnum[] | KronDeviceScalarFieldEnum
    having?: KronDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KronDeviceCountAggregateInputType | true
    _min?: KronDeviceMinAggregateInputType
    _max?: KronDeviceMaxAggregateInputType
  }

  export type KronDeviceGroupByOutputType = {
    id: string
    name: string
    serial: string
    mqttTopic: string
    location: string | null
    cityId: string | null
    companyId: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: KronDeviceCountAggregateOutputType | null
    _min: KronDeviceMinAggregateOutputType | null
    _max: KronDeviceMaxAggregateOutputType | null
  }

  type GetKronDeviceGroupByPayload<T extends KronDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KronDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KronDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KronDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], KronDeviceGroupByOutputType[P]>
        }
      >
    >


  export type KronDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    serial?: boolean
    mqttTopic?: boolean
    location?: boolean
    cityId?: boolean
    companyId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
    readings?: boolean | KronDevice$readingsArgs<ExtArgs>
    _count?: boolean | KronDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kronDevice"]>

  export type KronDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    serial?: boolean
    mqttTopic?: boolean
    location?: boolean
    cityId?: boolean
    companyId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
  }, ExtArgs["result"]["kronDevice"]>

  export type KronDeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    serial?: boolean
    mqttTopic?: boolean
    location?: boolean
    cityId?: boolean
    companyId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
  }, ExtArgs["result"]["kronDevice"]>

  export type KronDeviceSelectScalar = {
    id?: boolean
    name?: boolean
    serial?: boolean
    mqttTopic?: boolean
    location?: boolean
    cityId?: boolean
    companyId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KronDeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "serial" | "mqttTopic" | "location" | "cityId" | "companyId" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["kronDevice"]>
  export type KronDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
    readings?: boolean | KronDevice$readingsArgs<ExtArgs>
    _count?: boolean | KronDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KronDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
  }
  export type KronDeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | KronDevice$cityArgs<ExtArgs>
    company?: boolean | KronDevice$companyArgs<ExtArgs>
  }

  export type $KronDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KronDevice"
    objects: {
      city: Prisma.$CityPayload<ExtArgs> | null
      company: Prisma.$CompanyPayload<ExtArgs> | null
      readings: Prisma.$KronReadingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      serial: string
      mqttTopic: string
      location: string | null
      cityId: string | null
      companyId: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kronDevice"]>
    composites: {}
  }

  type KronDeviceGetPayload<S extends boolean | null | undefined | KronDeviceDefaultArgs> = $Result.GetResult<Prisma.$KronDevicePayload, S>

  type KronDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KronDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KronDeviceCountAggregateInputType | true
    }

  export interface KronDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KronDevice'], meta: { name: 'KronDevice' } }
    /**
     * Find zero or one KronDevice that matches the filter.
     * @param {KronDeviceFindUniqueArgs} args - Arguments to find a KronDevice
     * @example
     * // Get one KronDevice
     * const kronDevice = await prisma.kronDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KronDeviceFindUniqueArgs>(args: SelectSubset<T, KronDeviceFindUniqueArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KronDevice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KronDeviceFindUniqueOrThrowArgs} args - Arguments to find a KronDevice
     * @example
     * // Get one KronDevice
     * const kronDevice = await prisma.kronDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KronDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, KronDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KronDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceFindFirstArgs} args - Arguments to find a KronDevice
     * @example
     * // Get one KronDevice
     * const kronDevice = await prisma.kronDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KronDeviceFindFirstArgs>(args?: SelectSubset<T, KronDeviceFindFirstArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KronDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceFindFirstOrThrowArgs} args - Arguments to find a KronDevice
     * @example
     * // Get one KronDevice
     * const kronDevice = await prisma.kronDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KronDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, KronDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KronDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KronDevices
     * const kronDevices = await prisma.kronDevice.findMany()
     * 
     * // Get first 10 KronDevices
     * const kronDevices = await prisma.kronDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kronDeviceWithIdOnly = await prisma.kronDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KronDeviceFindManyArgs>(args?: SelectSubset<T, KronDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KronDevice.
     * @param {KronDeviceCreateArgs} args - Arguments to create a KronDevice.
     * @example
     * // Create one KronDevice
     * const KronDevice = await prisma.kronDevice.create({
     *   data: {
     *     // ... data to create a KronDevice
     *   }
     * })
     * 
     */
    create<T extends KronDeviceCreateArgs>(args: SelectSubset<T, KronDeviceCreateArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KronDevices.
     * @param {KronDeviceCreateManyArgs} args - Arguments to create many KronDevices.
     * @example
     * // Create many KronDevices
     * const kronDevice = await prisma.kronDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KronDeviceCreateManyArgs>(args?: SelectSubset<T, KronDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KronDevices and returns the data saved in the database.
     * @param {KronDeviceCreateManyAndReturnArgs} args - Arguments to create many KronDevices.
     * @example
     * // Create many KronDevices
     * const kronDevice = await prisma.kronDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KronDevices and only return the `id`
     * const kronDeviceWithIdOnly = await prisma.kronDevice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KronDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, KronDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KronDevice.
     * @param {KronDeviceDeleteArgs} args - Arguments to delete one KronDevice.
     * @example
     * // Delete one KronDevice
     * const KronDevice = await prisma.kronDevice.delete({
     *   where: {
     *     // ... filter to delete one KronDevice
     *   }
     * })
     * 
     */
    delete<T extends KronDeviceDeleteArgs>(args: SelectSubset<T, KronDeviceDeleteArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KronDevice.
     * @param {KronDeviceUpdateArgs} args - Arguments to update one KronDevice.
     * @example
     * // Update one KronDevice
     * const kronDevice = await prisma.kronDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KronDeviceUpdateArgs>(args: SelectSubset<T, KronDeviceUpdateArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KronDevices.
     * @param {KronDeviceDeleteManyArgs} args - Arguments to filter KronDevices to delete.
     * @example
     * // Delete a few KronDevices
     * const { count } = await prisma.kronDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KronDeviceDeleteManyArgs>(args?: SelectSubset<T, KronDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KronDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KronDevices
     * const kronDevice = await prisma.kronDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KronDeviceUpdateManyArgs>(args: SelectSubset<T, KronDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KronDevices and returns the data updated in the database.
     * @param {KronDeviceUpdateManyAndReturnArgs} args - Arguments to update many KronDevices.
     * @example
     * // Update many KronDevices
     * const kronDevice = await prisma.kronDevice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KronDevices and only return the `id`
     * const kronDeviceWithIdOnly = await prisma.kronDevice.updateManyAndReturn({
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
    updateManyAndReturn<T extends KronDeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, KronDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KronDevice.
     * @param {KronDeviceUpsertArgs} args - Arguments to update or create a KronDevice.
     * @example
     * // Update or create a KronDevice
     * const kronDevice = await prisma.kronDevice.upsert({
     *   create: {
     *     // ... data to create a KronDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KronDevice we want to update
     *   }
     * })
     */
    upsert<T extends KronDeviceUpsertArgs>(args: SelectSubset<T, KronDeviceUpsertArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KronDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceCountArgs} args - Arguments to filter KronDevices to count.
     * @example
     * // Count the number of KronDevices
     * const count = await prisma.kronDevice.count({
     *   where: {
     *     // ... the filter for the KronDevices we want to count
     *   }
     * })
    **/
    count<T extends KronDeviceCountArgs>(
      args?: Subset<T, KronDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KronDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KronDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KronDeviceAggregateArgs>(args: Subset<T, KronDeviceAggregateArgs>): Prisma.PrismaPromise<GetKronDeviceAggregateType<T>>

    /**
     * Group by KronDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronDeviceGroupByArgs} args - Group by arguments.
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
      T extends KronDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KronDeviceGroupByArgs['orderBy'] }
        : { orderBy?: KronDeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KronDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKronDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KronDevice model
   */
  readonly fields: KronDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KronDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KronDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    city<T extends KronDevice$cityArgs<ExtArgs> = {}>(args?: Subset<T, KronDevice$cityArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    company<T extends KronDevice$companyArgs<ExtArgs> = {}>(args?: Subset<T, KronDevice$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    readings<T extends KronDevice$readingsArgs<ExtArgs> = {}>(args?: Subset<T, KronDevice$readingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the KronDevice model
   */
  interface KronDeviceFieldRefs {
    readonly id: FieldRef<"KronDevice", 'String'>
    readonly name: FieldRef<"KronDevice", 'String'>
    readonly serial: FieldRef<"KronDevice", 'String'>
    readonly mqttTopic: FieldRef<"KronDevice", 'String'>
    readonly location: FieldRef<"KronDevice", 'String'>
    readonly cityId: FieldRef<"KronDevice", 'String'>
    readonly companyId: FieldRef<"KronDevice", 'String'>
    readonly active: FieldRef<"KronDevice", 'Boolean'>
    readonly createdAt: FieldRef<"KronDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"KronDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KronDevice findUnique
   */
  export type KronDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter, which KronDevice to fetch.
     */
    where: KronDeviceWhereUniqueInput
  }

  /**
   * KronDevice findUniqueOrThrow
   */
  export type KronDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter, which KronDevice to fetch.
     */
    where: KronDeviceWhereUniqueInput
  }

  /**
   * KronDevice findFirst
   */
  export type KronDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter, which KronDevice to fetch.
     */
    where?: KronDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronDevices to fetch.
     */
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KronDevices.
     */
    cursor?: KronDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KronDevices.
     */
    distinct?: KronDeviceScalarFieldEnum | KronDeviceScalarFieldEnum[]
  }

  /**
   * KronDevice findFirstOrThrow
   */
  export type KronDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter, which KronDevice to fetch.
     */
    where?: KronDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronDevices to fetch.
     */
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KronDevices.
     */
    cursor?: KronDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KronDevices.
     */
    distinct?: KronDeviceScalarFieldEnum | KronDeviceScalarFieldEnum[]
  }

  /**
   * KronDevice findMany
   */
  export type KronDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter, which KronDevices to fetch.
     */
    where?: KronDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronDevices to fetch.
     */
    orderBy?: KronDeviceOrderByWithRelationInput | KronDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KronDevices.
     */
    cursor?: KronDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronDevices.
     */
    skip?: number
    distinct?: KronDeviceScalarFieldEnum | KronDeviceScalarFieldEnum[]
  }

  /**
   * KronDevice create
   */
  export type KronDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a KronDevice.
     */
    data: XOR<KronDeviceCreateInput, KronDeviceUncheckedCreateInput>
  }

  /**
   * KronDevice createMany
   */
  export type KronDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KronDevices.
     */
    data: KronDeviceCreateManyInput | KronDeviceCreateManyInput[]
  }

  /**
   * KronDevice createManyAndReturn
   */
  export type KronDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * The data used to create many KronDevices.
     */
    data: KronDeviceCreateManyInput | KronDeviceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KronDevice update
   */
  export type KronDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a KronDevice.
     */
    data: XOR<KronDeviceUpdateInput, KronDeviceUncheckedUpdateInput>
    /**
     * Choose, which KronDevice to update.
     */
    where: KronDeviceWhereUniqueInput
  }

  /**
   * KronDevice updateMany
   */
  export type KronDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KronDevices.
     */
    data: XOR<KronDeviceUpdateManyMutationInput, KronDeviceUncheckedUpdateManyInput>
    /**
     * Filter which KronDevices to update
     */
    where?: KronDeviceWhereInput
    /**
     * Limit how many KronDevices to update.
     */
    limit?: number
  }

  /**
   * KronDevice updateManyAndReturn
   */
  export type KronDeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * The data used to update KronDevices.
     */
    data: XOR<KronDeviceUpdateManyMutationInput, KronDeviceUncheckedUpdateManyInput>
    /**
     * Filter which KronDevices to update
     */
    where?: KronDeviceWhereInput
    /**
     * Limit how many KronDevices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KronDevice upsert
   */
  export type KronDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the KronDevice to update in case it exists.
     */
    where: KronDeviceWhereUniqueInput
    /**
     * In case the KronDevice found by the `where` argument doesn't exist, create a new KronDevice with this data.
     */
    create: XOR<KronDeviceCreateInput, KronDeviceUncheckedCreateInput>
    /**
     * In case the KronDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KronDeviceUpdateInput, KronDeviceUncheckedUpdateInput>
  }

  /**
   * KronDevice delete
   */
  export type KronDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
    /**
     * Filter which KronDevice to delete.
     */
    where: KronDeviceWhereUniqueInput
  }

  /**
   * KronDevice deleteMany
   */
  export type KronDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KronDevices to delete
     */
    where?: KronDeviceWhereInput
    /**
     * Limit how many KronDevices to delete.
     */
    limit?: number
  }

  /**
   * KronDevice.city
   */
  export type KronDevice$cityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the City
     */
    omit?: CityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    where?: CityWhereInput
  }

  /**
   * KronDevice.company
   */
  export type KronDevice$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * KronDevice.readings
   */
  export type KronDevice$readingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    where?: KronReadingWhereInput
    orderBy?: KronReadingOrderByWithRelationInput | KronReadingOrderByWithRelationInput[]
    cursor?: KronReadingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KronReadingScalarFieldEnum | KronReadingScalarFieldEnum[]
  }

  /**
   * KronDevice without action
   */
  export type KronDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronDevice
     */
    select?: KronDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronDevice
     */
    omit?: KronDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronDeviceInclude<ExtArgs> | null
  }


  /**
   * Model KronReading
   */

  export type AggregateKronReading = {
    _count: KronReadingCountAggregateOutputType | null
    _avg: KronReadingAvgAggregateOutputType | null
    _sum: KronReadingSumAggregateOutputType | null
    _min: KronReadingMinAggregateOutputType | null
    _max: KronReadingMaxAggregateOutputType | null
  }

  export type KronReadingAvgAggregateOutputType = {
    voltageA: number | null
    voltageB: number | null
    voltageC: number | null
    currentI1: number | null
    currentI2: number | null
    currentI3: number | null
    activePowerTotal: number | null
    powerFactor1: number | null
    powerFactor2: number | null
    powerFactor3: number | null
    energyActivePos: number | null
    energyActiveNeg: number | null
  }

  export type KronReadingSumAggregateOutputType = {
    voltageA: number | null
    voltageB: number | null
    voltageC: number | null
    currentI1: number | null
    currentI2: number | null
    currentI3: number | null
    activePowerTotal: number | null
    powerFactor1: number | null
    powerFactor2: number | null
    powerFactor3: number | null
    energyActivePos: number | null
    energyActiveNeg: number | null
  }

  export type KronReadingMinAggregateOutputType = {
    id: string | null
    kronDeviceId: string | null
    receivedAt: Date | null
    voltageA: number | null
    voltageB: number | null
    voltageC: number | null
    currentI1: number | null
    currentI2: number | null
    currentI3: number | null
    activePowerTotal: number | null
    powerFactor1: number | null
    powerFactor2: number | null
    powerFactor3: number | null
    energyActivePos: number | null
    energyActiveNeg: number | null
    rawPayload: string | null
  }

  export type KronReadingMaxAggregateOutputType = {
    id: string | null
    kronDeviceId: string | null
    receivedAt: Date | null
    voltageA: number | null
    voltageB: number | null
    voltageC: number | null
    currentI1: number | null
    currentI2: number | null
    currentI3: number | null
    activePowerTotal: number | null
    powerFactor1: number | null
    powerFactor2: number | null
    powerFactor3: number | null
    energyActivePos: number | null
    energyActiveNeg: number | null
    rawPayload: string | null
  }

  export type KronReadingCountAggregateOutputType = {
    id: number
    kronDeviceId: number
    receivedAt: number
    voltageA: number
    voltageB: number
    voltageC: number
    currentI1: number
    currentI2: number
    currentI3: number
    activePowerTotal: number
    powerFactor1: number
    powerFactor2: number
    powerFactor3: number
    energyActivePos: number
    energyActiveNeg: number
    rawPayload: number
    _all: number
  }


  export type KronReadingAvgAggregateInputType = {
    voltageA?: true
    voltageB?: true
    voltageC?: true
    currentI1?: true
    currentI2?: true
    currentI3?: true
    activePowerTotal?: true
    powerFactor1?: true
    powerFactor2?: true
    powerFactor3?: true
    energyActivePos?: true
    energyActiveNeg?: true
  }

  export type KronReadingSumAggregateInputType = {
    voltageA?: true
    voltageB?: true
    voltageC?: true
    currentI1?: true
    currentI2?: true
    currentI3?: true
    activePowerTotal?: true
    powerFactor1?: true
    powerFactor2?: true
    powerFactor3?: true
    energyActivePos?: true
    energyActiveNeg?: true
  }

  export type KronReadingMinAggregateInputType = {
    id?: true
    kronDeviceId?: true
    receivedAt?: true
    voltageA?: true
    voltageB?: true
    voltageC?: true
    currentI1?: true
    currentI2?: true
    currentI3?: true
    activePowerTotal?: true
    powerFactor1?: true
    powerFactor2?: true
    powerFactor3?: true
    energyActivePos?: true
    energyActiveNeg?: true
    rawPayload?: true
  }

  export type KronReadingMaxAggregateInputType = {
    id?: true
    kronDeviceId?: true
    receivedAt?: true
    voltageA?: true
    voltageB?: true
    voltageC?: true
    currentI1?: true
    currentI2?: true
    currentI3?: true
    activePowerTotal?: true
    powerFactor1?: true
    powerFactor2?: true
    powerFactor3?: true
    energyActivePos?: true
    energyActiveNeg?: true
    rawPayload?: true
  }

  export type KronReadingCountAggregateInputType = {
    id?: true
    kronDeviceId?: true
    receivedAt?: true
    voltageA?: true
    voltageB?: true
    voltageC?: true
    currentI1?: true
    currentI2?: true
    currentI3?: true
    activePowerTotal?: true
    powerFactor1?: true
    powerFactor2?: true
    powerFactor3?: true
    energyActivePos?: true
    energyActiveNeg?: true
    rawPayload?: true
    _all?: true
  }

  export type KronReadingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KronReading to aggregate.
     */
    where?: KronReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronReadings to fetch.
     */
    orderBy?: KronReadingOrderByWithRelationInput | KronReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KronReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KronReadings
    **/
    _count?: true | KronReadingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KronReadingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KronReadingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KronReadingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KronReadingMaxAggregateInputType
  }

  export type GetKronReadingAggregateType<T extends KronReadingAggregateArgs> = {
        [P in keyof T & keyof AggregateKronReading]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKronReading[P]>
      : GetScalarType<T[P], AggregateKronReading[P]>
  }




  export type KronReadingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KronReadingWhereInput
    orderBy?: KronReadingOrderByWithAggregationInput | KronReadingOrderByWithAggregationInput[]
    by: KronReadingScalarFieldEnum[] | KronReadingScalarFieldEnum
    having?: KronReadingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KronReadingCountAggregateInputType | true
    _avg?: KronReadingAvgAggregateInputType
    _sum?: KronReadingSumAggregateInputType
    _min?: KronReadingMinAggregateInputType
    _max?: KronReadingMaxAggregateInputType
  }

  export type KronReadingGroupByOutputType = {
    id: string
    kronDeviceId: string
    receivedAt: Date
    voltageA: number | null
    voltageB: number | null
    voltageC: number | null
    currentI1: number | null
    currentI2: number | null
    currentI3: number | null
    activePowerTotal: number | null
    powerFactor1: number | null
    powerFactor2: number | null
    powerFactor3: number | null
    energyActivePos: number | null
    energyActiveNeg: number | null
    rawPayload: string | null
    _count: KronReadingCountAggregateOutputType | null
    _avg: KronReadingAvgAggregateOutputType | null
    _sum: KronReadingSumAggregateOutputType | null
    _min: KronReadingMinAggregateOutputType | null
    _max: KronReadingMaxAggregateOutputType | null
  }

  type GetKronReadingGroupByPayload<T extends KronReadingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KronReadingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KronReadingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KronReadingGroupByOutputType[P]>
            : GetScalarType<T[P], KronReadingGroupByOutputType[P]>
        }
      >
    >


  export type KronReadingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kronDeviceId?: boolean
    receivedAt?: boolean
    voltageA?: boolean
    voltageB?: boolean
    voltageC?: boolean
    currentI1?: boolean
    currentI2?: boolean
    currentI3?: boolean
    activePowerTotal?: boolean
    powerFactor1?: boolean
    powerFactor2?: boolean
    powerFactor3?: boolean
    energyActivePos?: boolean
    energyActiveNeg?: boolean
    rawPayload?: boolean
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kronReading"]>

  export type KronReadingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kronDeviceId?: boolean
    receivedAt?: boolean
    voltageA?: boolean
    voltageB?: boolean
    voltageC?: boolean
    currentI1?: boolean
    currentI2?: boolean
    currentI3?: boolean
    activePowerTotal?: boolean
    powerFactor1?: boolean
    powerFactor2?: boolean
    powerFactor3?: boolean
    energyActivePos?: boolean
    energyActiveNeg?: boolean
    rawPayload?: boolean
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kronReading"]>

  export type KronReadingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kronDeviceId?: boolean
    receivedAt?: boolean
    voltageA?: boolean
    voltageB?: boolean
    voltageC?: boolean
    currentI1?: boolean
    currentI2?: boolean
    currentI3?: boolean
    activePowerTotal?: boolean
    powerFactor1?: boolean
    powerFactor2?: boolean
    powerFactor3?: boolean
    energyActivePos?: boolean
    energyActiveNeg?: boolean
    rawPayload?: boolean
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kronReading"]>

  export type KronReadingSelectScalar = {
    id?: boolean
    kronDeviceId?: boolean
    receivedAt?: boolean
    voltageA?: boolean
    voltageB?: boolean
    voltageC?: boolean
    currentI1?: boolean
    currentI2?: boolean
    currentI3?: boolean
    activePowerTotal?: boolean
    powerFactor1?: boolean
    powerFactor2?: boolean
    powerFactor3?: boolean
    energyActivePos?: boolean
    energyActiveNeg?: boolean
    rawPayload?: boolean
  }

  export type KronReadingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kronDeviceId" | "receivedAt" | "voltageA" | "voltageB" | "voltageC" | "currentI1" | "currentI2" | "currentI3" | "activePowerTotal" | "powerFactor1" | "powerFactor2" | "powerFactor3" | "energyActivePos" | "energyActiveNeg" | "rawPayload", ExtArgs["result"]["kronReading"]>
  export type KronReadingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }
  export type KronReadingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }
  export type KronReadingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | KronDeviceDefaultArgs<ExtArgs>
  }

  export type $KronReadingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KronReading"
    objects: {
      device: Prisma.$KronDevicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kronDeviceId: string
      receivedAt: Date
      voltageA: number | null
      voltageB: number | null
      voltageC: number | null
      currentI1: number | null
      currentI2: number | null
      currentI3: number | null
      activePowerTotal: number | null
      powerFactor1: number | null
      powerFactor2: number | null
      powerFactor3: number | null
      energyActivePos: number | null
      energyActiveNeg: number | null
      rawPayload: string | null
    }, ExtArgs["result"]["kronReading"]>
    composites: {}
  }

  type KronReadingGetPayload<S extends boolean | null | undefined | KronReadingDefaultArgs> = $Result.GetResult<Prisma.$KronReadingPayload, S>

  type KronReadingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KronReadingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KronReadingCountAggregateInputType | true
    }

  export interface KronReadingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KronReading'], meta: { name: 'KronReading' } }
    /**
     * Find zero or one KronReading that matches the filter.
     * @param {KronReadingFindUniqueArgs} args - Arguments to find a KronReading
     * @example
     * // Get one KronReading
     * const kronReading = await prisma.kronReading.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KronReadingFindUniqueArgs>(args: SelectSubset<T, KronReadingFindUniqueArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KronReading that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KronReadingFindUniqueOrThrowArgs} args - Arguments to find a KronReading
     * @example
     * // Get one KronReading
     * const kronReading = await prisma.kronReading.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KronReadingFindUniqueOrThrowArgs>(args: SelectSubset<T, KronReadingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KronReading that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingFindFirstArgs} args - Arguments to find a KronReading
     * @example
     * // Get one KronReading
     * const kronReading = await prisma.kronReading.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KronReadingFindFirstArgs>(args?: SelectSubset<T, KronReadingFindFirstArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KronReading that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingFindFirstOrThrowArgs} args - Arguments to find a KronReading
     * @example
     * // Get one KronReading
     * const kronReading = await prisma.kronReading.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KronReadingFindFirstOrThrowArgs>(args?: SelectSubset<T, KronReadingFindFirstOrThrowArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KronReadings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KronReadings
     * const kronReadings = await prisma.kronReading.findMany()
     * 
     * // Get first 10 KronReadings
     * const kronReadings = await prisma.kronReading.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kronReadingWithIdOnly = await prisma.kronReading.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KronReadingFindManyArgs>(args?: SelectSubset<T, KronReadingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KronReading.
     * @param {KronReadingCreateArgs} args - Arguments to create a KronReading.
     * @example
     * // Create one KronReading
     * const KronReading = await prisma.kronReading.create({
     *   data: {
     *     // ... data to create a KronReading
     *   }
     * })
     * 
     */
    create<T extends KronReadingCreateArgs>(args: SelectSubset<T, KronReadingCreateArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KronReadings.
     * @param {KronReadingCreateManyArgs} args - Arguments to create many KronReadings.
     * @example
     * // Create many KronReadings
     * const kronReading = await prisma.kronReading.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KronReadingCreateManyArgs>(args?: SelectSubset<T, KronReadingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KronReadings and returns the data saved in the database.
     * @param {KronReadingCreateManyAndReturnArgs} args - Arguments to create many KronReadings.
     * @example
     * // Create many KronReadings
     * const kronReading = await prisma.kronReading.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KronReadings and only return the `id`
     * const kronReadingWithIdOnly = await prisma.kronReading.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KronReadingCreateManyAndReturnArgs>(args?: SelectSubset<T, KronReadingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KronReading.
     * @param {KronReadingDeleteArgs} args - Arguments to delete one KronReading.
     * @example
     * // Delete one KronReading
     * const KronReading = await prisma.kronReading.delete({
     *   where: {
     *     // ... filter to delete one KronReading
     *   }
     * })
     * 
     */
    delete<T extends KronReadingDeleteArgs>(args: SelectSubset<T, KronReadingDeleteArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KronReading.
     * @param {KronReadingUpdateArgs} args - Arguments to update one KronReading.
     * @example
     * // Update one KronReading
     * const kronReading = await prisma.kronReading.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KronReadingUpdateArgs>(args: SelectSubset<T, KronReadingUpdateArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KronReadings.
     * @param {KronReadingDeleteManyArgs} args - Arguments to filter KronReadings to delete.
     * @example
     * // Delete a few KronReadings
     * const { count } = await prisma.kronReading.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KronReadingDeleteManyArgs>(args?: SelectSubset<T, KronReadingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KronReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KronReadings
     * const kronReading = await prisma.kronReading.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KronReadingUpdateManyArgs>(args: SelectSubset<T, KronReadingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KronReadings and returns the data updated in the database.
     * @param {KronReadingUpdateManyAndReturnArgs} args - Arguments to update many KronReadings.
     * @example
     * // Update many KronReadings
     * const kronReading = await prisma.kronReading.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KronReadings and only return the `id`
     * const kronReadingWithIdOnly = await prisma.kronReading.updateManyAndReturn({
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
    updateManyAndReturn<T extends KronReadingUpdateManyAndReturnArgs>(args: SelectSubset<T, KronReadingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KronReading.
     * @param {KronReadingUpsertArgs} args - Arguments to update or create a KronReading.
     * @example
     * // Update or create a KronReading
     * const kronReading = await prisma.kronReading.upsert({
     *   create: {
     *     // ... data to create a KronReading
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KronReading we want to update
     *   }
     * })
     */
    upsert<T extends KronReadingUpsertArgs>(args: SelectSubset<T, KronReadingUpsertArgs<ExtArgs>>): Prisma__KronReadingClient<$Result.GetResult<Prisma.$KronReadingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KronReadings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingCountArgs} args - Arguments to filter KronReadings to count.
     * @example
     * // Count the number of KronReadings
     * const count = await prisma.kronReading.count({
     *   where: {
     *     // ... the filter for the KronReadings we want to count
     *   }
     * })
    **/
    count<T extends KronReadingCountArgs>(
      args?: Subset<T, KronReadingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KronReadingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KronReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KronReadingAggregateArgs>(args: Subset<T, KronReadingAggregateArgs>): Prisma.PrismaPromise<GetKronReadingAggregateType<T>>

    /**
     * Group by KronReading.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KronReadingGroupByArgs} args - Group by arguments.
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
      T extends KronReadingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KronReadingGroupByArgs['orderBy'] }
        : { orderBy?: KronReadingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KronReadingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKronReadingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KronReading model
   */
  readonly fields: KronReadingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KronReading.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KronReadingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    device<T extends KronDeviceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KronDeviceDefaultArgs<ExtArgs>>): Prisma__KronDeviceClient<$Result.GetResult<Prisma.$KronDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the KronReading model
   */
  interface KronReadingFieldRefs {
    readonly id: FieldRef<"KronReading", 'String'>
    readonly kronDeviceId: FieldRef<"KronReading", 'String'>
    readonly receivedAt: FieldRef<"KronReading", 'DateTime'>
    readonly voltageA: FieldRef<"KronReading", 'Float'>
    readonly voltageB: FieldRef<"KronReading", 'Float'>
    readonly voltageC: FieldRef<"KronReading", 'Float'>
    readonly currentI1: FieldRef<"KronReading", 'Float'>
    readonly currentI2: FieldRef<"KronReading", 'Float'>
    readonly currentI3: FieldRef<"KronReading", 'Float'>
    readonly activePowerTotal: FieldRef<"KronReading", 'Float'>
    readonly powerFactor1: FieldRef<"KronReading", 'Float'>
    readonly powerFactor2: FieldRef<"KronReading", 'Float'>
    readonly powerFactor3: FieldRef<"KronReading", 'Float'>
    readonly energyActivePos: FieldRef<"KronReading", 'Float'>
    readonly energyActiveNeg: FieldRef<"KronReading", 'Float'>
    readonly rawPayload: FieldRef<"KronReading", 'String'>
  }
    

  // Custom InputTypes
  /**
   * KronReading findUnique
   */
  export type KronReadingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter, which KronReading to fetch.
     */
    where: KronReadingWhereUniqueInput
  }

  /**
   * KronReading findUniqueOrThrow
   */
  export type KronReadingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter, which KronReading to fetch.
     */
    where: KronReadingWhereUniqueInput
  }

  /**
   * KronReading findFirst
   */
  export type KronReadingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter, which KronReading to fetch.
     */
    where?: KronReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronReadings to fetch.
     */
    orderBy?: KronReadingOrderByWithRelationInput | KronReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KronReadings.
     */
    cursor?: KronReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KronReadings.
     */
    distinct?: KronReadingScalarFieldEnum | KronReadingScalarFieldEnum[]
  }

  /**
   * KronReading findFirstOrThrow
   */
  export type KronReadingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter, which KronReading to fetch.
     */
    where?: KronReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronReadings to fetch.
     */
    orderBy?: KronReadingOrderByWithRelationInput | KronReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KronReadings.
     */
    cursor?: KronReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronReadings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KronReadings.
     */
    distinct?: KronReadingScalarFieldEnum | KronReadingScalarFieldEnum[]
  }

  /**
   * KronReading findMany
   */
  export type KronReadingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter, which KronReadings to fetch.
     */
    where?: KronReadingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KronReadings to fetch.
     */
    orderBy?: KronReadingOrderByWithRelationInput | KronReadingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KronReadings.
     */
    cursor?: KronReadingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KronReadings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KronReadings.
     */
    skip?: number
    distinct?: KronReadingScalarFieldEnum | KronReadingScalarFieldEnum[]
  }

  /**
   * KronReading create
   */
  export type KronReadingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * The data needed to create a KronReading.
     */
    data: XOR<KronReadingCreateInput, KronReadingUncheckedCreateInput>
  }

  /**
   * KronReading createMany
   */
  export type KronReadingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KronReadings.
     */
    data: KronReadingCreateManyInput | KronReadingCreateManyInput[]
  }

  /**
   * KronReading createManyAndReturn
   */
  export type KronReadingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * The data used to create many KronReadings.
     */
    data: KronReadingCreateManyInput | KronReadingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KronReading update
   */
  export type KronReadingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * The data needed to update a KronReading.
     */
    data: XOR<KronReadingUpdateInput, KronReadingUncheckedUpdateInput>
    /**
     * Choose, which KronReading to update.
     */
    where: KronReadingWhereUniqueInput
  }

  /**
   * KronReading updateMany
   */
  export type KronReadingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KronReadings.
     */
    data: XOR<KronReadingUpdateManyMutationInput, KronReadingUncheckedUpdateManyInput>
    /**
     * Filter which KronReadings to update
     */
    where?: KronReadingWhereInput
    /**
     * Limit how many KronReadings to update.
     */
    limit?: number
  }

  /**
   * KronReading updateManyAndReturn
   */
  export type KronReadingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * The data used to update KronReadings.
     */
    data: XOR<KronReadingUpdateManyMutationInput, KronReadingUncheckedUpdateManyInput>
    /**
     * Filter which KronReadings to update
     */
    where?: KronReadingWhereInput
    /**
     * Limit how many KronReadings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KronReading upsert
   */
  export type KronReadingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * The filter to search for the KronReading to update in case it exists.
     */
    where: KronReadingWhereUniqueInput
    /**
     * In case the KronReading found by the `where` argument doesn't exist, create a new KronReading with this data.
     */
    create: XOR<KronReadingCreateInput, KronReadingUncheckedCreateInput>
    /**
     * In case the KronReading was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KronReadingUpdateInput, KronReadingUncheckedUpdateInput>
  }

  /**
   * KronReading delete
   */
  export type KronReadingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
    /**
     * Filter which KronReading to delete.
     */
    where: KronReadingWhereUniqueInput
  }

  /**
   * KronReading deleteMany
   */
  export type KronReadingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KronReadings to delete
     */
    where?: KronReadingWhereInput
    /**
     * Limit how many KronReadings to delete.
     */
    limit?: number
  }

  /**
   * KronReading without action
   */
  export type KronReadingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KronReading
     */
    select?: KronReadingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KronReading
     */
    omit?: KronReadingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KronReadingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    username: 'username',
    passwordHash: 'passwordHash',
    role: 'role',
    company: 'company',
    companyId: 'companyId',
    phone: 'phone',
    email: 'email',
    mustChangePassword: 'mustChangePassword',
    canAccessInfo: 'canAccessInfo',
    lastActive: 'lastActive',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    uf: 'uf',
    createdAt: 'createdAt'
  };

  export type StateScalarFieldEnum = (typeof StateScalarFieldEnum)[keyof typeof StateScalarFieldEnum]


  export const CityScalarFieldEnum: {
    id: 'id',
    name: 'name',
    stateId: 'stateId',
    address: 'address',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt'
  };

  export type CityScalarFieldEnum = (typeof CityScalarFieldEnum)[keyof typeof CityScalarFieldEnum]


  export const DeviceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ip: 'ip',
    serial: 'serial',
    cityId: 'cityId',
    lastSeen: 'lastSeen',
    hasAlarm: 'hasAlarm',
    lastSnmpData: 'lastSnmpData',
    lastSnmpSync: 'lastSnmpSync',
    status: 'status',
    active: 'active',
    syncError: 'syncError',
    companyId: 'companyId',
    vpnUsername: 'vpnUsername',
    vpnStatus: 'vpnStatus',
    vpnIp: 'vpnIp',
    vpnLastSeen: 'vpnLastSeen',
    address: 'address',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const DeviceTelemetryScalarFieldEnum: {
    id: 'id',
    deviceId: 'deviceId',
    timestamp: 'timestamp',
    hardware: 'hardware',
    metrics: 'metrics'
  };

  export type DeviceTelemetryScalarFieldEnum = (typeof DeviceTelemetryScalarFieldEnum)[keyof typeof DeviceTelemetryScalarFieldEnum]


  export const UserAccessScalarFieldEnum: {
    userId: 'userId',
    cityId: 'cityId',
    permission: 'permission'
  };

  export type UserAccessScalarFieldEnum = (typeof UserAccessScalarFieldEnum)[keyof typeof UserAccessScalarFieldEnum]


  export const TrapScalarFieldEnum: {
    id: 'id',
    deviceId: 'deviceId',
    deviceSerial: 'deviceSerial',
    ctrlName: 'ctrlName',
    severity: 'severity',
    oid: 'oid',
    alarmName: 'alarmName',
    description: 'description',
    fullText: 'fullText',
    timestamp: 'timestamp',
    isCleared: 'isCleared'
  };

  export type TrapScalarFieldEnum = (typeof TrapScalarFieldEnum)[keyof typeof TrapScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    paymentStatus: 'paymentStatus',
    dueDate: 'dueDate',
    lastPaymentAt: 'lastPaymentAt',
    blockedAt: 'blockedAt',
    createdAt: 'createdAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const KronDeviceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    serial: 'serial',
    mqttTopic: 'mqttTopic',
    location: 'location',
    cityId: 'cityId',
    companyId: 'companyId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KronDeviceScalarFieldEnum = (typeof KronDeviceScalarFieldEnum)[keyof typeof KronDeviceScalarFieldEnum]


  export const KronReadingScalarFieldEnum: {
    id: 'id',
    kronDeviceId: 'kronDeviceId',
    receivedAt: 'receivedAt',
    voltageA: 'voltageA',
    voltageB: 'voltageB',
    voltageC: 'voltageC',
    currentI1: 'currentI1',
    currentI2: 'currentI2',
    currentI3: 'currentI3',
    activePowerTotal: 'activePowerTotal',
    powerFactor1: 'powerFactor1',
    powerFactor2: 'powerFactor2',
    powerFactor3: 'powerFactor3',
    energyActivePos: 'energyActivePos',
    energyActiveNeg: 'energyActiveNeg',
    rawPayload: 'rawPayload'
  };

  export type KronReadingScalarFieldEnum = (typeof KronReadingScalarFieldEnum)[keyof typeof KronReadingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    company?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    mustChangePassword?: BoolFilter<"User"> | boolean
    canAccessInfo?: BoolFilter<"User"> | boolean
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    companyRef?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    access?: UserAccessListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    company?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    mustChangePassword?: SortOrder
    canAccessInfo?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    companyRef?: CompanyOrderByWithRelationInput
    access?: UserAccessOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    company?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    mustChangePassword?: BoolFilter<"User"> | boolean
    canAccessInfo?: BoolFilter<"User"> | boolean
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    companyRef?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    access?: UserAccessListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    company?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    mustChangePassword?: SortOrder
    canAccessInfo?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    company?: StringNullableWithAggregatesFilter<"User"> | string | null
    companyId?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    mustChangePassword?: BoolWithAggregatesFilter<"User"> | boolean
    canAccessInfo?: BoolWithAggregatesFilter<"User"> | boolean
    lastActive?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StateWhereInput = {
    AND?: StateWhereInput | StateWhereInput[]
    OR?: StateWhereInput[]
    NOT?: StateWhereInput | StateWhereInput[]
    id?: StringFilter<"State"> | string
    name?: StringFilter<"State"> | string
    uf?: StringFilter<"State"> | string
    createdAt?: DateTimeFilter<"State"> | Date | string
    cities?: CityListRelationFilter
  }

  export type StateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    uf?: SortOrder
    createdAt?: SortOrder
    cities?: CityOrderByRelationAggregateInput
  }

  export type StateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    uf?: string
    AND?: StateWhereInput | StateWhereInput[]
    OR?: StateWhereInput[]
    NOT?: StateWhereInput | StateWhereInput[]
    createdAt?: DateTimeFilter<"State"> | Date | string
    cities?: CityListRelationFilter
  }, "id" | "name" | "uf">

  export type StateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    uf?: SortOrder
    createdAt?: SortOrder
    _count?: StateCountOrderByAggregateInput
    _max?: StateMaxOrderByAggregateInput
    _min?: StateMinOrderByAggregateInput
  }

  export type StateScalarWhereWithAggregatesInput = {
    AND?: StateScalarWhereWithAggregatesInput | StateScalarWhereWithAggregatesInput[]
    OR?: StateScalarWhereWithAggregatesInput[]
    NOT?: StateScalarWhereWithAggregatesInput | StateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"State"> | string
    name?: StringWithAggregatesFilter<"State"> | string
    uf?: StringWithAggregatesFilter<"State"> | string
    createdAt?: DateTimeWithAggregatesFilter<"State"> | Date | string
  }

  export type CityWhereInput = {
    AND?: CityWhereInput | CityWhereInput[]
    OR?: CityWhereInput[]
    NOT?: CityWhereInput | CityWhereInput[]
    id?: StringFilter<"City"> | string
    name?: StringFilter<"City"> | string
    stateId?: StringFilter<"City"> | string
    address?: StringNullableFilter<"City"> | string | null
    latitude?: FloatNullableFilter<"City"> | number | null
    longitude?: FloatNullableFilter<"City"> | number | null
    createdAt?: DateTimeFilter<"City"> | Date | string
    state?: XOR<StateScalarRelationFilter, StateWhereInput>
    devices?: DeviceListRelationFilter
    kronDevices?: KronDeviceListRelationFilter
    access?: UserAccessListRelationFilter
  }

  export type CityOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    stateId?: SortOrder
    address?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    state?: StateOrderByWithRelationInput
    devices?: DeviceOrderByRelationAggregateInput
    kronDevices?: KronDeviceOrderByRelationAggregateInput
    access?: UserAccessOrderByRelationAggregateInput
  }

  export type CityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_stateId?: CityNameStateIdCompoundUniqueInput
    AND?: CityWhereInput | CityWhereInput[]
    OR?: CityWhereInput[]
    NOT?: CityWhereInput | CityWhereInput[]
    name?: StringFilter<"City"> | string
    stateId?: StringFilter<"City"> | string
    address?: StringNullableFilter<"City"> | string | null
    latitude?: FloatNullableFilter<"City"> | number | null
    longitude?: FloatNullableFilter<"City"> | number | null
    createdAt?: DateTimeFilter<"City"> | Date | string
    state?: XOR<StateScalarRelationFilter, StateWhereInput>
    devices?: DeviceListRelationFilter
    kronDevices?: KronDeviceListRelationFilter
    access?: UserAccessListRelationFilter
  }, "id" | "name_stateId">

  export type CityOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    stateId?: SortOrder
    address?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CityCountOrderByAggregateInput
    _avg?: CityAvgOrderByAggregateInput
    _max?: CityMaxOrderByAggregateInput
    _min?: CityMinOrderByAggregateInput
    _sum?: CitySumOrderByAggregateInput
  }

  export type CityScalarWhereWithAggregatesInput = {
    AND?: CityScalarWhereWithAggregatesInput | CityScalarWhereWithAggregatesInput[]
    OR?: CityScalarWhereWithAggregatesInput[]
    NOT?: CityScalarWhereWithAggregatesInput | CityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"City"> | string
    name?: StringWithAggregatesFilter<"City"> | string
    stateId?: StringWithAggregatesFilter<"City"> | string
    address?: StringNullableWithAggregatesFilter<"City"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"City"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"City"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"City"> | Date | string
  }

  export type DeviceWhereInput = {
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    id?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    ip?: StringFilter<"Device"> | string
    serial?: StringNullableFilter<"Device"> | string | null
    cityId?: StringFilter<"Device"> | string
    lastSeen?: DateTimeFilter<"Device"> | Date | string
    hasAlarm?: BoolFilter<"Device"> | boolean
    lastSnmpData?: StringNullableFilter<"Device"> | string | null
    lastSnmpSync?: DateTimeNullableFilter<"Device"> | Date | string | null
    status?: StringFilter<"Device"> | string
    active?: BoolFilter<"Device"> | boolean
    syncError?: StringNullableFilter<"Device"> | string | null
    companyId?: StringNullableFilter<"Device"> | string | null
    vpnUsername?: StringNullableFilter<"Device"> | string | null
    vpnStatus?: StringFilter<"Device"> | string
    vpnIp?: StringNullableFilter<"Device"> | string | null
    vpnLastSeen?: DateTimeNullableFilter<"Device"> | Date | string | null
    address?: StringNullableFilter<"Device"> | string | null
    latitude?: FloatNullableFilter<"Device"> | number | null
    longitude?: FloatNullableFilter<"Device"> | number | null
    createdAt?: DateTimeFilter<"Device"> | Date | string
    city?: XOR<CityScalarRelationFilter, CityWhereInput>
    traps?: TrapListRelationFilter
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    telemetry?: DeviceTelemetryListRelationFilter
  }

  export type DeviceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    serial?: SortOrderInput | SortOrder
    cityId?: SortOrder
    lastSeen?: SortOrder
    hasAlarm?: SortOrder
    lastSnmpData?: SortOrderInput | SortOrder
    lastSnmpSync?: SortOrderInput | SortOrder
    status?: SortOrder
    active?: SortOrder
    syncError?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    vpnUsername?: SortOrderInput | SortOrder
    vpnStatus?: SortOrder
    vpnIp?: SortOrderInput | SortOrder
    vpnLastSeen?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    city?: CityOrderByWithRelationInput
    traps?: TrapOrderByRelationAggregateInput
    company?: CompanyOrderByWithRelationInput
    telemetry?: DeviceTelemetryOrderByRelationAggregateInput
  }

  export type DeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ip?: string
    serial?: string
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    name?: StringFilter<"Device"> | string
    cityId?: StringFilter<"Device"> | string
    lastSeen?: DateTimeFilter<"Device"> | Date | string
    hasAlarm?: BoolFilter<"Device"> | boolean
    lastSnmpData?: StringNullableFilter<"Device"> | string | null
    lastSnmpSync?: DateTimeNullableFilter<"Device"> | Date | string | null
    status?: StringFilter<"Device"> | string
    active?: BoolFilter<"Device"> | boolean
    syncError?: StringNullableFilter<"Device"> | string | null
    companyId?: StringNullableFilter<"Device"> | string | null
    vpnUsername?: StringNullableFilter<"Device"> | string | null
    vpnStatus?: StringFilter<"Device"> | string
    vpnIp?: StringNullableFilter<"Device"> | string | null
    vpnLastSeen?: DateTimeNullableFilter<"Device"> | Date | string | null
    address?: StringNullableFilter<"Device"> | string | null
    latitude?: FloatNullableFilter<"Device"> | number | null
    longitude?: FloatNullableFilter<"Device"> | number | null
    createdAt?: DateTimeFilter<"Device"> | Date | string
    city?: XOR<CityScalarRelationFilter, CityWhereInput>
    traps?: TrapListRelationFilter
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    telemetry?: DeviceTelemetryListRelationFilter
  }, "id" | "ip" | "serial">

  export type DeviceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    serial?: SortOrderInput | SortOrder
    cityId?: SortOrder
    lastSeen?: SortOrder
    hasAlarm?: SortOrder
    lastSnmpData?: SortOrderInput | SortOrder
    lastSnmpSync?: SortOrderInput | SortOrder
    status?: SortOrder
    active?: SortOrder
    syncError?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    vpnUsername?: SortOrderInput | SortOrder
    vpnStatus?: SortOrder
    vpnIp?: SortOrderInput | SortOrder
    vpnLastSeen?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DeviceCountOrderByAggregateInput
    _avg?: DeviceAvgOrderByAggregateInput
    _max?: DeviceMaxOrderByAggregateInput
    _min?: DeviceMinOrderByAggregateInput
    _sum?: DeviceSumOrderByAggregateInput
  }

  export type DeviceScalarWhereWithAggregatesInput = {
    AND?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    OR?: DeviceScalarWhereWithAggregatesInput[]
    NOT?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Device"> | string
    name?: StringWithAggregatesFilter<"Device"> | string
    ip?: StringWithAggregatesFilter<"Device"> | string
    serial?: StringNullableWithAggregatesFilter<"Device"> | string | null
    cityId?: StringWithAggregatesFilter<"Device"> | string
    lastSeen?: DateTimeWithAggregatesFilter<"Device"> | Date | string
    hasAlarm?: BoolWithAggregatesFilter<"Device"> | boolean
    lastSnmpData?: StringNullableWithAggregatesFilter<"Device"> | string | null
    lastSnmpSync?: DateTimeNullableWithAggregatesFilter<"Device"> | Date | string | null
    status?: StringWithAggregatesFilter<"Device"> | string
    active?: BoolWithAggregatesFilter<"Device"> | boolean
    syncError?: StringNullableWithAggregatesFilter<"Device"> | string | null
    companyId?: StringNullableWithAggregatesFilter<"Device"> | string | null
    vpnUsername?: StringNullableWithAggregatesFilter<"Device"> | string | null
    vpnStatus?: StringWithAggregatesFilter<"Device"> | string
    vpnIp?: StringNullableWithAggregatesFilter<"Device"> | string | null
    vpnLastSeen?: DateTimeNullableWithAggregatesFilter<"Device"> | Date | string | null
    address?: StringNullableWithAggregatesFilter<"Device"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"Device"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Device"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Device"> | Date | string
  }

  export type DeviceTelemetryWhereInput = {
    AND?: DeviceTelemetryWhereInput | DeviceTelemetryWhereInput[]
    OR?: DeviceTelemetryWhereInput[]
    NOT?: DeviceTelemetryWhereInput | DeviceTelemetryWhereInput[]
    id?: StringFilter<"DeviceTelemetry"> | string
    deviceId?: StringFilter<"DeviceTelemetry"> | string
    timestamp?: DateTimeFilter<"DeviceTelemetry"> | Date | string
    hardware?: StringFilter<"DeviceTelemetry"> | string
    metrics?: StringFilter<"DeviceTelemetry"> | string
    device?: XOR<DeviceScalarRelationFilter, DeviceWhereInput>
  }

  export type DeviceTelemetryOrderByWithRelationInput = {
    id?: SortOrder
    deviceId?: SortOrder
    timestamp?: SortOrder
    hardware?: SortOrder
    metrics?: SortOrder
    device?: DeviceOrderByWithRelationInput
  }

  export type DeviceTelemetryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeviceTelemetryWhereInput | DeviceTelemetryWhereInput[]
    OR?: DeviceTelemetryWhereInput[]
    NOT?: DeviceTelemetryWhereInput | DeviceTelemetryWhereInput[]
    deviceId?: StringFilter<"DeviceTelemetry"> | string
    timestamp?: DateTimeFilter<"DeviceTelemetry"> | Date | string
    hardware?: StringFilter<"DeviceTelemetry"> | string
    metrics?: StringFilter<"DeviceTelemetry"> | string
    device?: XOR<DeviceScalarRelationFilter, DeviceWhereInput>
  }, "id">

  export type DeviceTelemetryOrderByWithAggregationInput = {
    id?: SortOrder
    deviceId?: SortOrder
    timestamp?: SortOrder
    hardware?: SortOrder
    metrics?: SortOrder
    _count?: DeviceTelemetryCountOrderByAggregateInput
    _max?: DeviceTelemetryMaxOrderByAggregateInput
    _min?: DeviceTelemetryMinOrderByAggregateInput
  }

  export type DeviceTelemetryScalarWhereWithAggregatesInput = {
    AND?: DeviceTelemetryScalarWhereWithAggregatesInput | DeviceTelemetryScalarWhereWithAggregatesInput[]
    OR?: DeviceTelemetryScalarWhereWithAggregatesInput[]
    NOT?: DeviceTelemetryScalarWhereWithAggregatesInput | DeviceTelemetryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeviceTelemetry"> | string
    deviceId?: StringWithAggregatesFilter<"DeviceTelemetry"> | string
    timestamp?: DateTimeWithAggregatesFilter<"DeviceTelemetry"> | Date | string
    hardware?: StringWithAggregatesFilter<"DeviceTelemetry"> | string
    metrics?: StringWithAggregatesFilter<"DeviceTelemetry"> | string
  }

  export type UserAccessWhereInput = {
    AND?: UserAccessWhereInput | UserAccessWhereInput[]
    OR?: UserAccessWhereInput[]
    NOT?: UserAccessWhereInput | UserAccessWhereInput[]
    userId?: StringFilter<"UserAccess"> | string
    cityId?: StringFilter<"UserAccess"> | string
    permission?: StringFilter<"UserAccess"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    city?: XOR<CityScalarRelationFilter, CityWhereInput>
  }

  export type UserAccessOrderByWithRelationInput = {
    userId?: SortOrder
    cityId?: SortOrder
    permission?: SortOrder
    user?: UserOrderByWithRelationInput
    city?: CityOrderByWithRelationInput
  }

  export type UserAccessWhereUniqueInput = Prisma.AtLeast<{
    userId_cityId?: UserAccessUserIdCityIdCompoundUniqueInput
    AND?: UserAccessWhereInput | UserAccessWhereInput[]
    OR?: UserAccessWhereInput[]
    NOT?: UserAccessWhereInput | UserAccessWhereInput[]
    userId?: StringFilter<"UserAccess"> | string
    cityId?: StringFilter<"UserAccess"> | string
    permission?: StringFilter<"UserAccess"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    city?: XOR<CityScalarRelationFilter, CityWhereInput>
  }, "userId_cityId">

  export type UserAccessOrderByWithAggregationInput = {
    userId?: SortOrder
    cityId?: SortOrder
    permission?: SortOrder
    _count?: UserAccessCountOrderByAggregateInput
    _max?: UserAccessMaxOrderByAggregateInput
    _min?: UserAccessMinOrderByAggregateInput
  }

  export type UserAccessScalarWhereWithAggregatesInput = {
    AND?: UserAccessScalarWhereWithAggregatesInput | UserAccessScalarWhereWithAggregatesInput[]
    OR?: UserAccessScalarWhereWithAggregatesInput[]
    NOT?: UserAccessScalarWhereWithAggregatesInput | UserAccessScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"UserAccess"> | string
    cityId?: StringWithAggregatesFilter<"UserAccess"> | string
    permission?: StringWithAggregatesFilter<"UserAccess"> | string
  }

  export type TrapWhereInput = {
    AND?: TrapWhereInput | TrapWhereInput[]
    OR?: TrapWhereInput[]
    NOT?: TrapWhereInput | TrapWhereInput[]
    id?: StringFilter<"Trap"> | string
    deviceId?: StringNullableFilter<"Trap"> | string | null
    deviceSerial?: StringNullableFilter<"Trap"> | string | null
    ctrlName?: StringNullableFilter<"Trap"> | string | null
    severity?: IntFilter<"Trap"> | number
    oid?: StringFilter<"Trap"> | string
    alarmName?: StringFilter<"Trap"> | string
    description?: StringFilter<"Trap"> | string
    fullText?: StringFilter<"Trap"> | string
    timestamp?: DateTimeFilter<"Trap"> | Date | string
    isCleared?: BoolFilter<"Trap"> | boolean
    device?: XOR<DeviceNullableScalarRelationFilter, DeviceWhereInput> | null
  }

  export type TrapOrderByWithRelationInput = {
    id?: SortOrder
    deviceId?: SortOrderInput | SortOrder
    deviceSerial?: SortOrderInput | SortOrder
    ctrlName?: SortOrderInput | SortOrder
    severity?: SortOrder
    oid?: SortOrder
    alarmName?: SortOrder
    description?: SortOrder
    fullText?: SortOrder
    timestamp?: SortOrder
    isCleared?: SortOrder
    device?: DeviceOrderByWithRelationInput
  }

  export type TrapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrapWhereInput | TrapWhereInput[]
    OR?: TrapWhereInput[]
    NOT?: TrapWhereInput | TrapWhereInput[]
    deviceId?: StringNullableFilter<"Trap"> | string | null
    deviceSerial?: StringNullableFilter<"Trap"> | string | null
    ctrlName?: StringNullableFilter<"Trap"> | string | null
    severity?: IntFilter<"Trap"> | number
    oid?: StringFilter<"Trap"> | string
    alarmName?: StringFilter<"Trap"> | string
    description?: StringFilter<"Trap"> | string
    fullText?: StringFilter<"Trap"> | string
    timestamp?: DateTimeFilter<"Trap"> | Date | string
    isCleared?: BoolFilter<"Trap"> | boolean
    device?: XOR<DeviceNullableScalarRelationFilter, DeviceWhereInput> | null
  }, "id">

  export type TrapOrderByWithAggregationInput = {
    id?: SortOrder
    deviceId?: SortOrderInput | SortOrder
    deviceSerial?: SortOrderInput | SortOrder
    ctrlName?: SortOrderInput | SortOrder
    severity?: SortOrder
    oid?: SortOrder
    alarmName?: SortOrder
    description?: SortOrder
    fullText?: SortOrder
    timestamp?: SortOrder
    isCleared?: SortOrder
    _count?: TrapCountOrderByAggregateInput
    _avg?: TrapAvgOrderByAggregateInput
    _max?: TrapMaxOrderByAggregateInput
    _min?: TrapMinOrderByAggregateInput
    _sum?: TrapSumOrderByAggregateInput
  }

  export type TrapScalarWhereWithAggregatesInput = {
    AND?: TrapScalarWhereWithAggregatesInput | TrapScalarWhereWithAggregatesInput[]
    OR?: TrapScalarWhereWithAggregatesInput[]
    NOT?: TrapScalarWhereWithAggregatesInput | TrapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Trap"> | string
    deviceId?: StringNullableWithAggregatesFilter<"Trap"> | string | null
    deviceSerial?: StringNullableWithAggregatesFilter<"Trap"> | string | null
    ctrlName?: StringNullableWithAggregatesFilter<"Trap"> | string | null
    severity?: IntWithAggregatesFilter<"Trap"> | number
    oid?: StringWithAggregatesFilter<"Trap"> | string
    alarmName?: StringWithAggregatesFilter<"Trap"> | string
    description?: StringWithAggregatesFilter<"Trap"> | string
    fullText?: StringWithAggregatesFilter<"Trap"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Trap"> | Date | string
    isCleared?: BoolWithAggregatesFilter<"Trap"> | boolean
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    status?: StringFilter<"Company"> | string
    paymentStatus?: StringFilter<"Company"> | string
    dueDate?: DateTimeNullableFilter<"Company"> | Date | string | null
    lastPaymentAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    blockedAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    users?: UserListRelationFilter
    devices?: DeviceListRelationFilter
    kronDevices?: KronDeviceListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    paymentStatus?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    lastPaymentAt?: SortOrderInput | SortOrder
    blockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    devices?: DeviceOrderByRelationAggregateInput
    kronDevices?: KronDeviceOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    status?: StringFilter<"Company"> | string
    paymentStatus?: StringFilter<"Company"> | string
    dueDate?: DateTimeNullableFilter<"Company"> | Date | string | null
    lastPaymentAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    blockedAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    users?: UserListRelationFilter
    devices?: DeviceListRelationFilter
    kronDevices?: KronDeviceListRelationFilter
  }, "id" | "name">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    paymentStatus?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    lastPaymentAt?: SortOrderInput | SortOrder
    blockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    status?: StringWithAggregatesFilter<"Company"> | string
    paymentStatus?: StringWithAggregatesFilter<"Company"> | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"Company"> | Date | string | null
    lastPaymentAt?: DateTimeNullableWithAggregatesFilter<"Company"> | Date | string | null
    blockedAt?: DateTimeNullableWithAggregatesFilter<"Company"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type KronDeviceWhereInput = {
    AND?: KronDeviceWhereInput | KronDeviceWhereInput[]
    OR?: KronDeviceWhereInput[]
    NOT?: KronDeviceWhereInput | KronDeviceWhereInput[]
    id?: StringFilter<"KronDevice"> | string
    name?: StringFilter<"KronDevice"> | string
    serial?: StringFilter<"KronDevice"> | string
    mqttTopic?: StringFilter<"KronDevice"> | string
    location?: StringNullableFilter<"KronDevice"> | string | null
    cityId?: StringNullableFilter<"KronDevice"> | string | null
    companyId?: StringNullableFilter<"KronDevice"> | string | null
    active?: BoolFilter<"KronDevice"> | boolean
    createdAt?: DateTimeFilter<"KronDevice"> | Date | string
    updatedAt?: DateTimeFilter<"KronDevice"> | Date | string
    city?: XOR<CityNullableScalarRelationFilter, CityWhereInput> | null
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    readings?: KronReadingListRelationFilter
  }

  export type KronDeviceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    serial?: SortOrder
    mqttTopic?: SortOrder
    location?: SortOrderInput | SortOrder
    cityId?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    city?: CityOrderByWithRelationInput
    company?: CompanyOrderByWithRelationInput
    readings?: KronReadingOrderByRelationAggregateInput
  }

  export type KronDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serial?: string
    AND?: KronDeviceWhereInput | KronDeviceWhereInput[]
    OR?: KronDeviceWhereInput[]
    NOT?: KronDeviceWhereInput | KronDeviceWhereInput[]
    name?: StringFilter<"KronDevice"> | string
    mqttTopic?: StringFilter<"KronDevice"> | string
    location?: StringNullableFilter<"KronDevice"> | string | null
    cityId?: StringNullableFilter<"KronDevice"> | string | null
    companyId?: StringNullableFilter<"KronDevice"> | string | null
    active?: BoolFilter<"KronDevice"> | boolean
    createdAt?: DateTimeFilter<"KronDevice"> | Date | string
    updatedAt?: DateTimeFilter<"KronDevice"> | Date | string
    city?: XOR<CityNullableScalarRelationFilter, CityWhereInput> | null
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    readings?: KronReadingListRelationFilter
  }, "id" | "serial">

  export type KronDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    serial?: SortOrder
    mqttTopic?: SortOrder
    location?: SortOrderInput | SortOrder
    cityId?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KronDeviceCountOrderByAggregateInput
    _max?: KronDeviceMaxOrderByAggregateInput
    _min?: KronDeviceMinOrderByAggregateInput
  }

  export type KronDeviceScalarWhereWithAggregatesInput = {
    AND?: KronDeviceScalarWhereWithAggregatesInput | KronDeviceScalarWhereWithAggregatesInput[]
    OR?: KronDeviceScalarWhereWithAggregatesInput[]
    NOT?: KronDeviceScalarWhereWithAggregatesInput | KronDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KronDevice"> | string
    name?: StringWithAggregatesFilter<"KronDevice"> | string
    serial?: StringWithAggregatesFilter<"KronDevice"> | string
    mqttTopic?: StringWithAggregatesFilter<"KronDevice"> | string
    location?: StringNullableWithAggregatesFilter<"KronDevice"> | string | null
    cityId?: StringNullableWithAggregatesFilter<"KronDevice"> | string | null
    companyId?: StringNullableWithAggregatesFilter<"KronDevice"> | string | null
    active?: BoolWithAggregatesFilter<"KronDevice"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"KronDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KronDevice"> | Date | string
  }

  export type KronReadingWhereInput = {
    AND?: KronReadingWhereInput | KronReadingWhereInput[]
    OR?: KronReadingWhereInput[]
    NOT?: KronReadingWhereInput | KronReadingWhereInput[]
    id?: StringFilter<"KronReading"> | string
    kronDeviceId?: StringFilter<"KronReading"> | string
    receivedAt?: DateTimeFilter<"KronReading"> | Date | string
    voltageA?: FloatNullableFilter<"KronReading"> | number | null
    voltageB?: FloatNullableFilter<"KronReading"> | number | null
    voltageC?: FloatNullableFilter<"KronReading"> | number | null
    currentI1?: FloatNullableFilter<"KronReading"> | number | null
    currentI2?: FloatNullableFilter<"KronReading"> | number | null
    currentI3?: FloatNullableFilter<"KronReading"> | number | null
    activePowerTotal?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor1?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor2?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor3?: FloatNullableFilter<"KronReading"> | number | null
    energyActivePos?: FloatNullableFilter<"KronReading"> | number | null
    energyActiveNeg?: FloatNullableFilter<"KronReading"> | number | null
    rawPayload?: StringNullableFilter<"KronReading"> | string | null
    device?: XOR<KronDeviceScalarRelationFilter, KronDeviceWhereInput>
  }

  export type KronReadingOrderByWithRelationInput = {
    id?: SortOrder
    kronDeviceId?: SortOrder
    receivedAt?: SortOrder
    voltageA?: SortOrderInput | SortOrder
    voltageB?: SortOrderInput | SortOrder
    voltageC?: SortOrderInput | SortOrder
    currentI1?: SortOrderInput | SortOrder
    currentI2?: SortOrderInput | SortOrder
    currentI3?: SortOrderInput | SortOrder
    activePowerTotal?: SortOrderInput | SortOrder
    powerFactor1?: SortOrderInput | SortOrder
    powerFactor2?: SortOrderInput | SortOrder
    powerFactor3?: SortOrderInput | SortOrder
    energyActivePos?: SortOrderInput | SortOrder
    energyActiveNeg?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    device?: KronDeviceOrderByWithRelationInput
  }

  export type KronReadingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KronReadingWhereInput | KronReadingWhereInput[]
    OR?: KronReadingWhereInput[]
    NOT?: KronReadingWhereInput | KronReadingWhereInput[]
    kronDeviceId?: StringFilter<"KronReading"> | string
    receivedAt?: DateTimeFilter<"KronReading"> | Date | string
    voltageA?: FloatNullableFilter<"KronReading"> | number | null
    voltageB?: FloatNullableFilter<"KronReading"> | number | null
    voltageC?: FloatNullableFilter<"KronReading"> | number | null
    currentI1?: FloatNullableFilter<"KronReading"> | number | null
    currentI2?: FloatNullableFilter<"KronReading"> | number | null
    currentI3?: FloatNullableFilter<"KronReading"> | number | null
    activePowerTotal?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor1?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor2?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor3?: FloatNullableFilter<"KronReading"> | number | null
    energyActivePos?: FloatNullableFilter<"KronReading"> | number | null
    energyActiveNeg?: FloatNullableFilter<"KronReading"> | number | null
    rawPayload?: StringNullableFilter<"KronReading"> | string | null
    device?: XOR<KronDeviceScalarRelationFilter, KronDeviceWhereInput>
  }, "id">

  export type KronReadingOrderByWithAggregationInput = {
    id?: SortOrder
    kronDeviceId?: SortOrder
    receivedAt?: SortOrder
    voltageA?: SortOrderInput | SortOrder
    voltageB?: SortOrderInput | SortOrder
    voltageC?: SortOrderInput | SortOrder
    currentI1?: SortOrderInput | SortOrder
    currentI2?: SortOrderInput | SortOrder
    currentI3?: SortOrderInput | SortOrder
    activePowerTotal?: SortOrderInput | SortOrder
    powerFactor1?: SortOrderInput | SortOrder
    powerFactor2?: SortOrderInput | SortOrder
    powerFactor3?: SortOrderInput | SortOrder
    energyActivePos?: SortOrderInput | SortOrder
    energyActiveNeg?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    _count?: KronReadingCountOrderByAggregateInput
    _avg?: KronReadingAvgOrderByAggregateInput
    _max?: KronReadingMaxOrderByAggregateInput
    _min?: KronReadingMinOrderByAggregateInput
    _sum?: KronReadingSumOrderByAggregateInput
  }

  export type KronReadingScalarWhereWithAggregatesInput = {
    AND?: KronReadingScalarWhereWithAggregatesInput | KronReadingScalarWhereWithAggregatesInput[]
    OR?: KronReadingScalarWhereWithAggregatesInput[]
    NOT?: KronReadingScalarWhereWithAggregatesInput | KronReadingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KronReading"> | string
    kronDeviceId?: StringWithAggregatesFilter<"KronReading"> | string
    receivedAt?: DateTimeWithAggregatesFilter<"KronReading"> | Date | string
    voltageA?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    voltageB?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    voltageC?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    currentI1?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    currentI2?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    currentI3?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    activePowerTotal?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    powerFactor1?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    powerFactor2?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    powerFactor3?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    energyActivePos?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    energyActiveNeg?: FloatNullableWithAggregatesFilter<"KronReading"> | number | null
    rawPayload?: StringNullableWithAggregatesFilter<"KronReading"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    companyRef?: CompanyCreateNestedOneWithoutUsersInput
    access?: UserAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    companyId?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    access?: UserAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyRef?: CompanyUpdateOneWithoutUsersNestedInput
    access?: UserAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    access?: UserAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    companyId?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StateCreateInput = {
    id?: string
    name: string
    uf: string
    createdAt?: Date | string
    cities?: CityCreateNestedManyWithoutStateInput
  }

  export type StateUncheckedCreateInput = {
    id?: string
    name: string
    uf: string
    createdAt?: Date | string
    cities?: CityUncheckedCreateNestedManyWithoutStateInput
  }

  export type StateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: CityUpdateManyWithoutStateNestedInput
  }

  export type StateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: CityUncheckedUpdateManyWithoutStateNestedInput
  }

  export type StateCreateManyInput = {
    id?: string
    name: string
    uf: string
    createdAt?: Date | string
  }

  export type StateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CityCreateInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    state: StateCreateNestedOneWithoutCitiesInput
    devices?: DeviceCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCityInput
    access?: UserAccessCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateInput = {
    id?: string
    name: string
    stateId: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    devices?: DeviceUncheckedCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCityInput
    access?: UserAccessUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    state?: StateUpdateOneRequiredWithoutCitiesNestedInput
    devices?: DeviceUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCityNestedInput
    access?: UserAccessUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stateId?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUncheckedUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCityNestedInput
    access?: UserAccessUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CityCreateManyInput = {
    id?: string
    name: string
    stateId: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
  }

  export type CityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stateId?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    city: CityCreateNestedOneWithoutDevicesInput
    traps?: TrapCreateNestedManyWithoutDeviceInput
    company?: CompanyCreateNestedOneWithoutDevicesInput
    telemetry?: DeviceTelemetryCreateNestedManyWithoutDeviceInput
  }

  export type DeviceUncheckedCreateInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    traps?: TrapUncheckedCreateNestedManyWithoutDeviceInput
    telemetry?: DeviceTelemetryUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneRequiredWithoutDevicesNestedInput
    traps?: TrapUpdateManyWithoutDeviceNestedInput
    company?: CompanyUpdateOneWithoutDevicesNestedInput
    telemetry?: DeviceTelemetryUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    traps?: TrapUncheckedUpdateManyWithoutDeviceNestedInput
    telemetry?: DeviceTelemetryUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceCreateManyInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
  }

  export type DeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceTelemetryCreateInput = {
    id?: string
    timestamp?: Date | string
    hardware: string
    metrics: string
    device: DeviceCreateNestedOneWithoutTelemetryInput
  }

  export type DeviceTelemetryUncheckedCreateInput = {
    id?: string
    deviceId: string
    timestamp?: Date | string
    hardware: string
    metrics: string
  }

  export type DeviceTelemetryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
    device?: DeviceUpdateOneRequiredWithoutTelemetryNestedInput
  }

  export type DeviceTelemetryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type DeviceTelemetryCreateManyInput = {
    id?: string
    deviceId: string
    timestamp?: Date | string
    hardware: string
    metrics: string
  }

  export type DeviceTelemetryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type DeviceTelemetryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type UserAccessCreateInput = {
    permission?: string
    user: UserCreateNestedOneWithoutAccessInput
    city: CityCreateNestedOneWithoutAccessInput
  }

  export type UserAccessUncheckedCreateInput = {
    userId: string
    cityId: string
    permission?: string
  }

  export type UserAccessUpdateInput = {
    permission?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutAccessNestedInput
    city?: CityUpdateOneRequiredWithoutAccessNestedInput
  }

  export type UserAccessUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    cityId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type UserAccessCreateManyInput = {
    userId: string
    cityId: string
    permission?: string
  }

  export type UserAccessUpdateManyMutationInput = {
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type UserAccessUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    cityId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type TrapCreateInput = {
    id?: string
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
    device?: DeviceCreateNestedOneWithoutTrapsInput
  }

  export type TrapUncheckedCreateInput = {
    id?: string
    deviceId?: string | null
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
  }

  export type TrapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
    device?: DeviceUpdateOneWithoutTrapsNestedInput
  }

  export type TrapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TrapCreateManyInput = {
    id?: string
    deviceId?: string | null
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
  }

  export type TrapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TrapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CompanyCreateInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyRefInput
    devices?: DeviceCreateNestedManyWithoutCompanyInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyRefInput
    devices?: DeviceUncheckedCreateNestedManyWithoutCompanyInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyRefNestedInput
    devices?: DeviceUpdateManyWithoutCompanyNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyRefNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutCompanyNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronDeviceCreateInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutKronDevicesInput
    company?: CompanyCreateNestedOneWithoutKronDevicesInput
    readings?: KronReadingCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceUncheckedCreateInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    cityId?: string | null
    companyId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    readings?: KronReadingUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutKronDevicesNestedInput
    company?: CompanyUpdateOneWithoutKronDevicesNestedInput
    readings?: KronReadingUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readings?: KronReadingUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceCreateManyInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    cityId?: string | null
    companyId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KronDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronReadingCreateInput = {
    id?: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
    device: KronDeviceCreateNestedOneWithoutReadingsInput
  }

  export type KronReadingUncheckedCreateInput = {
    id?: string
    kronDeviceId: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
  }

  export type KronReadingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    device?: KronDeviceUpdateOneRequiredWithoutReadingsNestedInput
  }

  export type KronReadingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kronDeviceId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KronReadingCreateManyInput = {
    id?: string
    kronDeviceId: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
  }

  export type KronReadingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KronReadingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kronDeviceId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CompanyNullableScalarRelationFilter = {
    is?: CompanyWhereInput | null
    isNot?: CompanyWhereInput | null
  }

  export type UserAccessListRelationFilter = {
    every?: UserAccessWhereInput
    some?: UserAccessWhereInput
    none?: UserAccessWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserAccessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    company?: SortOrder
    companyId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    mustChangePassword?: SortOrder
    canAccessInfo?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    company?: SortOrder
    companyId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    mustChangePassword?: SortOrder
    canAccessInfo?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    company?: SortOrder
    companyId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    mustChangePassword?: SortOrder
    canAccessInfo?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CityListRelationFilter = {
    every?: CityWhereInput
    some?: CityWhereInput
    none?: CityWhereInput
  }

  export type CityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uf?: SortOrder
    createdAt?: SortOrder
  }

  export type StateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uf?: SortOrder
    createdAt?: SortOrder
  }

  export type StateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uf?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StateScalarRelationFilter = {
    is?: StateWhereInput
    isNot?: StateWhereInput
  }

  export type DeviceListRelationFilter = {
    every?: DeviceWhereInput
    some?: DeviceWhereInput
    none?: DeviceWhereInput
  }

  export type KronDeviceListRelationFilter = {
    every?: KronDeviceWhereInput
    some?: KronDeviceWhereInput
    none?: KronDeviceWhereInput
  }

  export type DeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KronDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CityNameStateIdCompoundUniqueInput = {
    name: string
    stateId: string
  }

  export type CityCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stateId?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type CityAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type CityMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stateId?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type CityMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stateId?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type CitySumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type CityScalarRelationFilter = {
    is?: CityWhereInput
    isNot?: CityWhereInput
  }

  export type TrapListRelationFilter = {
    every?: TrapWhereInput
    some?: TrapWhereInput
    none?: TrapWhereInput
  }

  export type DeviceTelemetryListRelationFilter = {
    every?: DeviceTelemetryWhereInput
    some?: DeviceTelemetryWhereInput
    none?: DeviceTelemetryWhereInput
  }

  export type TrapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceTelemetryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    serial?: SortOrder
    cityId?: SortOrder
    lastSeen?: SortOrder
    hasAlarm?: SortOrder
    lastSnmpData?: SortOrder
    lastSnmpSync?: SortOrder
    status?: SortOrder
    active?: SortOrder
    syncError?: SortOrder
    companyId?: SortOrder
    vpnUsername?: SortOrder
    vpnStatus?: SortOrder
    vpnIp?: SortOrder
    vpnLastSeen?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type DeviceAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type DeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    serial?: SortOrder
    cityId?: SortOrder
    lastSeen?: SortOrder
    hasAlarm?: SortOrder
    lastSnmpData?: SortOrder
    lastSnmpSync?: SortOrder
    status?: SortOrder
    active?: SortOrder
    syncError?: SortOrder
    companyId?: SortOrder
    vpnUsername?: SortOrder
    vpnStatus?: SortOrder
    vpnIp?: SortOrder
    vpnLastSeen?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type DeviceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    serial?: SortOrder
    cityId?: SortOrder
    lastSeen?: SortOrder
    hasAlarm?: SortOrder
    lastSnmpData?: SortOrder
    lastSnmpSync?: SortOrder
    status?: SortOrder
    active?: SortOrder
    syncError?: SortOrder
    companyId?: SortOrder
    vpnUsername?: SortOrder
    vpnStatus?: SortOrder
    vpnIp?: SortOrder
    vpnLastSeen?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
  }

  export type DeviceSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type DeviceScalarRelationFilter = {
    is?: DeviceWhereInput
    isNot?: DeviceWhereInput
  }

  export type DeviceTelemetryCountOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    timestamp?: SortOrder
    hardware?: SortOrder
    metrics?: SortOrder
  }

  export type DeviceTelemetryMaxOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    timestamp?: SortOrder
    hardware?: SortOrder
    metrics?: SortOrder
  }

  export type DeviceTelemetryMinOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    timestamp?: SortOrder
    hardware?: SortOrder
    metrics?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserAccessUserIdCityIdCompoundUniqueInput = {
    userId: string
    cityId: string
  }

  export type UserAccessCountOrderByAggregateInput = {
    userId?: SortOrder
    cityId?: SortOrder
    permission?: SortOrder
  }

  export type UserAccessMaxOrderByAggregateInput = {
    userId?: SortOrder
    cityId?: SortOrder
    permission?: SortOrder
  }

  export type UserAccessMinOrderByAggregateInput = {
    userId?: SortOrder
    cityId?: SortOrder
    permission?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DeviceNullableScalarRelationFilter = {
    is?: DeviceWhereInput | null
    isNot?: DeviceWhereInput | null
  }

  export type TrapCountOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    deviceSerial?: SortOrder
    ctrlName?: SortOrder
    severity?: SortOrder
    oid?: SortOrder
    alarmName?: SortOrder
    description?: SortOrder
    fullText?: SortOrder
    timestamp?: SortOrder
    isCleared?: SortOrder
  }

  export type TrapAvgOrderByAggregateInput = {
    severity?: SortOrder
  }

  export type TrapMaxOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    deviceSerial?: SortOrder
    ctrlName?: SortOrder
    severity?: SortOrder
    oid?: SortOrder
    alarmName?: SortOrder
    description?: SortOrder
    fullText?: SortOrder
    timestamp?: SortOrder
    isCleared?: SortOrder
  }

  export type TrapMinOrderByAggregateInput = {
    id?: SortOrder
    deviceId?: SortOrder
    deviceSerial?: SortOrder
    ctrlName?: SortOrder
    severity?: SortOrder
    oid?: SortOrder
    alarmName?: SortOrder
    description?: SortOrder
    fullText?: SortOrder
    timestamp?: SortOrder
    isCleared?: SortOrder
  }

  export type TrapSumOrderByAggregateInput = {
    severity?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    paymentStatus?: SortOrder
    dueDate?: SortOrder
    lastPaymentAt?: SortOrder
    blockedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    paymentStatus?: SortOrder
    dueDate?: SortOrder
    lastPaymentAt?: SortOrder
    blockedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    paymentStatus?: SortOrder
    dueDate?: SortOrder
    lastPaymentAt?: SortOrder
    blockedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CityNullableScalarRelationFilter = {
    is?: CityWhereInput | null
    isNot?: CityWhereInput | null
  }

  export type KronReadingListRelationFilter = {
    every?: KronReadingWhereInput
    some?: KronReadingWhereInput
    none?: KronReadingWhereInput
  }

  export type KronReadingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KronDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    serial?: SortOrder
    mqttTopic?: SortOrder
    location?: SortOrder
    cityId?: SortOrder
    companyId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KronDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    serial?: SortOrder
    mqttTopic?: SortOrder
    location?: SortOrder
    cityId?: SortOrder
    companyId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KronDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    serial?: SortOrder
    mqttTopic?: SortOrder
    location?: SortOrder
    cityId?: SortOrder
    companyId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KronDeviceScalarRelationFilter = {
    is?: KronDeviceWhereInput
    isNot?: KronDeviceWhereInput
  }

  export type KronReadingCountOrderByAggregateInput = {
    id?: SortOrder
    kronDeviceId?: SortOrder
    receivedAt?: SortOrder
    voltageA?: SortOrder
    voltageB?: SortOrder
    voltageC?: SortOrder
    currentI1?: SortOrder
    currentI2?: SortOrder
    currentI3?: SortOrder
    activePowerTotal?: SortOrder
    powerFactor1?: SortOrder
    powerFactor2?: SortOrder
    powerFactor3?: SortOrder
    energyActivePos?: SortOrder
    energyActiveNeg?: SortOrder
    rawPayload?: SortOrder
  }

  export type KronReadingAvgOrderByAggregateInput = {
    voltageA?: SortOrder
    voltageB?: SortOrder
    voltageC?: SortOrder
    currentI1?: SortOrder
    currentI2?: SortOrder
    currentI3?: SortOrder
    activePowerTotal?: SortOrder
    powerFactor1?: SortOrder
    powerFactor2?: SortOrder
    powerFactor3?: SortOrder
    energyActivePos?: SortOrder
    energyActiveNeg?: SortOrder
  }

  export type KronReadingMaxOrderByAggregateInput = {
    id?: SortOrder
    kronDeviceId?: SortOrder
    receivedAt?: SortOrder
    voltageA?: SortOrder
    voltageB?: SortOrder
    voltageC?: SortOrder
    currentI1?: SortOrder
    currentI2?: SortOrder
    currentI3?: SortOrder
    activePowerTotal?: SortOrder
    powerFactor1?: SortOrder
    powerFactor2?: SortOrder
    powerFactor3?: SortOrder
    energyActivePos?: SortOrder
    energyActiveNeg?: SortOrder
    rawPayload?: SortOrder
  }

  export type KronReadingMinOrderByAggregateInput = {
    id?: SortOrder
    kronDeviceId?: SortOrder
    receivedAt?: SortOrder
    voltageA?: SortOrder
    voltageB?: SortOrder
    voltageC?: SortOrder
    currentI1?: SortOrder
    currentI2?: SortOrder
    currentI3?: SortOrder
    activePowerTotal?: SortOrder
    powerFactor1?: SortOrder
    powerFactor2?: SortOrder
    powerFactor3?: SortOrder
    energyActivePos?: SortOrder
    energyActiveNeg?: SortOrder
    rawPayload?: SortOrder
  }

  export type KronReadingSumOrderByAggregateInput = {
    voltageA?: SortOrder
    voltageB?: SortOrder
    voltageC?: SortOrder
    currentI1?: SortOrder
    currentI2?: SortOrder
    currentI3?: SortOrder
    activePowerTotal?: SortOrder
    powerFactor1?: SortOrder
    powerFactor2?: SortOrder
    powerFactor3?: SortOrder
    energyActivePos?: SortOrder
    energyActiveNeg?: SortOrder
  }

  export type CompanyCreateNestedOneWithoutUsersInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    connect?: CompanyWhereUniqueInput
  }

  export type UserAccessCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput> | UserAccessCreateWithoutUserInput[] | UserAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutUserInput | UserAccessCreateOrConnectWithoutUserInput[]
    createMany?: UserAccessCreateManyUserInputEnvelope
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
  }

  export type UserAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput> | UserAccessCreateWithoutUserInput[] | UserAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutUserInput | UserAccessCreateOrConnectWithoutUserInput[]
    createMany?: UserAccessCreateManyUserInputEnvelope
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CompanyUpdateOneWithoutUsersNestedInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    upsert?: CompanyUpsertWithoutUsersInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutUsersInput, CompanyUpdateWithoutUsersInput>, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type UserAccessUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput> | UserAccessCreateWithoutUserInput[] | UserAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutUserInput | UserAccessCreateOrConnectWithoutUserInput[]
    upsert?: UserAccessUpsertWithWhereUniqueWithoutUserInput | UserAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAccessCreateManyUserInputEnvelope
    set?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    disconnect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    delete?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    update?: UserAccessUpdateWithWhereUniqueWithoutUserInput | UserAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAccessUpdateManyWithWhereWithoutUserInput | UserAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
  }

  export type UserAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput> | UserAccessCreateWithoutUserInput[] | UserAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutUserInput | UserAccessCreateOrConnectWithoutUserInput[]
    upsert?: UserAccessUpsertWithWhereUniqueWithoutUserInput | UserAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAccessCreateManyUserInputEnvelope
    set?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    disconnect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    delete?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    update?: UserAccessUpdateWithWhereUniqueWithoutUserInput | UserAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAccessUpdateManyWithWhereWithoutUserInput | UserAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
  }

  export type CityCreateNestedManyWithoutStateInput = {
    create?: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput> | CityCreateWithoutStateInput[] | CityUncheckedCreateWithoutStateInput[]
    connectOrCreate?: CityCreateOrConnectWithoutStateInput | CityCreateOrConnectWithoutStateInput[]
    createMany?: CityCreateManyStateInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type CityUncheckedCreateNestedManyWithoutStateInput = {
    create?: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput> | CityCreateWithoutStateInput[] | CityUncheckedCreateWithoutStateInput[]
    connectOrCreate?: CityCreateOrConnectWithoutStateInput | CityCreateOrConnectWithoutStateInput[]
    createMany?: CityCreateManyStateInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type CityUpdateManyWithoutStateNestedInput = {
    create?: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput> | CityCreateWithoutStateInput[] | CityUncheckedCreateWithoutStateInput[]
    connectOrCreate?: CityCreateOrConnectWithoutStateInput | CityCreateOrConnectWithoutStateInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutStateInput | CityUpsertWithWhereUniqueWithoutStateInput[]
    createMany?: CityCreateManyStateInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutStateInput | CityUpdateWithWhereUniqueWithoutStateInput[]
    updateMany?: CityUpdateManyWithWhereWithoutStateInput | CityUpdateManyWithWhereWithoutStateInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type CityUncheckedUpdateManyWithoutStateNestedInput = {
    create?: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput> | CityCreateWithoutStateInput[] | CityUncheckedCreateWithoutStateInput[]
    connectOrCreate?: CityCreateOrConnectWithoutStateInput | CityCreateOrConnectWithoutStateInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutStateInput | CityUpsertWithWhereUniqueWithoutStateInput[]
    createMany?: CityCreateManyStateInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutStateInput | CityUpdateWithWhereUniqueWithoutStateInput[]
    updateMany?: CityUpdateManyWithWhereWithoutStateInput | CityUpdateManyWithWhereWithoutStateInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type StateCreateNestedOneWithoutCitiesInput = {
    create?: XOR<StateCreateWithoutCitiesInput, StateUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: StateCreateOrConnectWithoutCitiesInput
    connect?: StateWhereUniqueInput
  }

  export type DeviceCreateNestedManyWithoutCityInput = {
    create?: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput> | DeviceCreateWithoutCityInput[] | DeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCityInput | DeviceCreateOrConnectWithoutCityInput[]
    createMany?: DeviceCreateManyCityInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type KronDeviceCreateNestedManyWithoutCityInput = {
    create?: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput> | KronDeviceCreateWithoutCityInput[] | KronDeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCityInput | KronDeviceCreateOrConnectWithoutCityInput[]
    createMany?: KronDeviceCreateManyCityInputEnvelope
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
  }

  export type UserAccessCreateNestedManyWithoutCityInput = {
    create?: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput> | UserAccessCreateWithoutCityInput[] | UserAccessUncheckedCreateWithoutCityInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutCityInput | UserAccessCreateOrConnectWithoutCityInput[]
    createMany?: UserAccessCreateManyCityInputEnvelope
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutCityInput = {
    create?: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput> | DeviceCreateWithoutCityInput[] | DeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCityInput | DeviceCreateOrConnectWithoutCityInput[]
    createMany?: DeviceCreateManyCityInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type KronDeviceUncheckedCreateNestedManyWithoutCityInput = {
    create?: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput> | KronDeviceCreateWithoutCityInput[] | KronDeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCityInput | KronDeviceCreateOrConnectWithoutCityInput[]
    createMany?: KronDeviceCreateManyCityInputEnvelope
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
  }

  export type UserAccessUncheckedCreateNestedManyWithoutCityInput = {
    create?: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput> | UserAccessCreateWithoutCityInput[] | UserAccessUncheckedCreateWithoutCityInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutCityInput | UserAccessCreateOrConnectWithoutCityInput[]
    createMany?: UserAccessCreateManyCityInputEnvelope
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StateUpdateOneRequiredWithoutCitiesNestedInput = {
    create?: XOR<StateCreateWithoutCitiesInput, StateUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: StateCreateOrConnectWithoutCitiesInput
    upsert?: StateUpsertWithoutCitiesInput
    connect?: StateWhereUniqueInput
    update?: XOR<XOR<StateUpdateToOneWithWhereWithoutCitiesInput, StateUpdateWithoutCitiesInput>, StateUncheckedUpdateWithoutCitiesInput>
  }

  export type DeviceUpdateManyWithoutCityNestedInput = {
    create?: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput> | DeviceCreateWithoutCityInput[] | DeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCityInput | DeviceCreateOrConnectWithoutCityInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutCityInput | DeviceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: DeviceCreateManyCityInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutCityInput | DeviceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutCityInput | DeviceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type KronDeviceUpdateManyWithoutCityNestedInput = {
    create?: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput> | KronDeviceCreateWithoutCityInput[] | KronDeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCityInput | KronDeviceCreateOrConnectWithoutCityInput[]
    upsert?: KronDeviceUpsertWithWhereUniqueWithoutCityInput | KronDeviceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: KronDeviceCreateManyCityInputEnvelope
    set?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    disconnect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    delete?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    update?: KronDeviceUpdateWithWhereUniqueWithoutCityInput | KronDeviceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: KronDeviceUpdateManyWithWhereWithoutCityInput | KronDeviceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
  }

  export type UserAccessUpdateManyWithoutCityNestedInput = {
    create?: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput> | UserAccessCreateWithoutCityInput[] | UserAccessUncheckedCreateWithoutCityInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutCityInput | UserAccessCreateOrConnectWithoutCityInput[]
    upsert?: UserAccessUpsertWithWhereUniqueWithoutCityInput | UserAccessUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: UserAccessCreateManyCityInputEnvelope
    set?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    disconnect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    delete?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    update?: UserAccessUpdateWithWhereUniqueWithoutCityInput | UserAccessUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: UserAccessUpdateManyWithWhereWithoutCityInput | UserAccessUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutCityNestedInput = {
    create?: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput> | DeviceCreateWithoutCityInput[] | DeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCityInput | DeviceCreateOrConnectWithoutCityInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutCityInput | DeviceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: DeviceCreateManyCityInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutCityInput | DeviceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutCityInput | DeviceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type KronDeviceUncheckedUpdateManyWithoutCityNestedInput = {
    create?: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput> | KronDeviceCreateWithoutCityInput[] | KronDeviceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCityInput | KronDeviceCreateOrConnectWithoutCityInput[]
    upsert?: KronDeviceUpsertWithWhereUniqueWithoutCityInput | KronDeviceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: KronDeviceCreateManyCityInputEnvelope
    set?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    disconnect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    delete?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    update?: KronDeviceUpdateWithWhereUniqueWithoutCityInput | KronDeviceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: KronDeviceUpdateManyWithWhereWithoutCityInput | KronDeviceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
  }

  export type UserAccessUncheckedUpdateManyWithoutCityNestedInput = {
    create?: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput> | UserAccessCreateWithoutCityInput[] | UserAccessUncheckedCreateWithoutCityInput[]
    connectOrCreate?: UserAccessCreateOrConnectWithoutCityInput | UserAccessCreateOrConnectWithoutCityInput[]
    upsert?: UserAccessUpsertWithWhereUniqueWithoutCityInput | UserAccessUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: UserAccessCreateManyCityInputEnvelope
    set?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    disconnect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    delete?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    connect?: UserAccessWhereUniqueInput | UserAccessWhereUniqueInput[]
    update?: UserAccessUpdateWithWhereUniqueWithoutCityInput | UserAccessUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: UserAccessUpdateManyWithWhereWithoutCityInput | UserAccessUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
  }

  export type CityCreateNestedOneWithoutDevicesInput = {
    create?: XOR<CityCreateWithoutDevicesInput, CityUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: CityCreateOrConnectWithoutDevicesInput
    connect?: CityWhereUniqueInput
  }

  export type TrapCreateNestedManyWithoutDeviceInput = {
    create?: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput> | TrapCreateWithoutDeviceInput[] | TrapUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: TrapCreateOrConnectWithoutDeviceInput | TrapCreateOrConnectWithoutDeviceInput[]
    createMany?: TrapCreateManyDeviceInputEnvelope
    connect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
  }

  export type CompanyCreateNestedOneWithoutDevicesInput = {
    create?: XOR<CompanyCreateWithoutDevicesInput, CompanyUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutDevicesInput
    connect?: CompanyWhereUniqueInput
  }

  export type DeviceTelemetryCreateNestedManyWithoutDeviceInput = {
    create?: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput> | DeviceTelemetryCreateWithoutDeviceInput[] | DeviceTelemetryUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: DeviceTelemetryCreateOrConnectWithoutDeviceInput | DeviceTelemetryCreateOrConnectWithoutDeviceInput[]
    createMany?: DeviceTelemetryCreateManyDeviceInputEnvelope
    connect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
  }

  export type TrapUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput> | TrapCreateWithoutDeviceInput[] | TrapUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: TrapCreateOrConnectWithoutDeviceInput | TrapCreateOrConnectWithoutDeviceInput[]
    createMany?: TrapCreateManyDeviceInputEnvelope
    connect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
  }

  export type DeviceTelemetryUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput> | DeviceTelemetryCreateWithoutDeviceInput[] | DeviceTelemetryUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: DeviceTelemetryCreateOrConnectWithoutDeviceInput | DeviceTelemetryCreateOrConnectWithoutDeviceInput[]
    createMany?: DeviceTelemetryCreateManyDeviceInputEnvelope
    connect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
  }

  export type CityUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<CityCreateWithoutDevicesInput, CityUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: CityCreateOrConnectWithoutDevicesInput
    upsert?: CityUpsertWithoutDevicesInput
    connect?: CityWhereUniqueInput
    update?: XOR<XOR<CityUpdateToOneWithWhereWithoutDevicesInput, CityUpdateWithoutDevicesInput>, CityUncheckedUpdateWithoutDevicesInput>
  }

  export type TrapUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput> | TrapCreateWithoutDeviceInput[] | TrapUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: TrapCreateOrConnectWithoutDeviceInput | TrapCreateOrConnectWithoutDeviceInput[]
    upsert?: TrapUpsertWithWhereUniqueWithoutDeviceInput | TrapUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: TrapCreateManyDeviceInputEnvelope
    set?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    disconnect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    delete?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    connect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    update?: TrapUpdateWithWhereUniqueWithoutDeviceInput | TrapUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: TrapUpdateManyWithWhereWithoutDeviceInput | TrapUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: TrapScalarWhereInput | TrapScalarWhereInput[]
  }

  export type CompanyUpdateOneWithoutDevicesNestedInput = {
    create?: XOR<CompanyCreateWithoutDevicesInput, CompanyUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutDevicesInput
    upsert?: CompanyUpsertWithoutDevicesInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutDevicesInput, CompanyUpdateWithoutDevicesInput>, CompanyUncheckedUpdateWithoutDevicesInput>
  }

  export type DeviceTelemetryUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput> | DeviceTelemetryCreateWithoutDeviceInput[] | DeviceTelemetryUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: DeviceTelemetryCreateOrConnectWithoutDeviceInput | DeviceTelemetryCreateOrConnectWithoutDeviceInput[]
    upsert?: DeviceTelemetryUpsertWithWhereUniqueWithoutDeviceInput | DeviceTelemetryUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: DeviceTelemetryCreateManyDeviceInputEnvelope
    set?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    disconnect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    delete?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    connect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    update?: DeviceTelemetryUpdateWithWhereUniqueWithoutDeviceInput | DeviceTelemetryUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: DeviceTelemetryUpdateManyWithWhereWithoutDeviceInput | DeviceTelemetryUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: DeviceTelemetryScalarWhereInput | DeviceTelemetryScalarWhereInput[]
  }

  export type TrapUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput> | TrapCreateWithoutDeviceInput[] | TrapUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: TrapCreateOrConnectWithoutDeviceInput | TrapCreateOrConnectWithoutDeviceInput[]
    upsert?: TrapUpsertWithWhereUniqueWithoutDeviceInput | TrapUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: TrapCreateManyDeviceInputEnvelope
    set?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    disconnect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    delete?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    connect?: TrapWhereUniqueInput | TrapWhereUniqueInput[]
    update?: TrapUpdateWithWhereUniqueWithoutDeviceInput | TrapUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: TrapUpdateManyWithWhereWithoutDeviceInput | TrapUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: TrapScalarWhereInput | TrapScalarWhereInput[]
  }

  export type DeviceTelemetryUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput> | DeviceTelemetryCreateWithoutDeviceInput[] | DeviceTelemetryUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: DeviceTelemetryCreateOrConnectWithoutDeviceInput | DeviceTelemetryCreateOrConnectWithoutDeviceInput[]
    upsert?: DeviceTelemetryUpsertWithWhereUniqueWithoutDeviceInput | DeviceTelemetryUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: DeviceTelemetryCreateManyDeviceInputEnvelope
    set?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    disconnect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    delete?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    connect?: DeviceTelemetryWhereUniqueInput | DeviceTelemetryWhereUniqueInput[]
    update?: DeviceTelemetryUpdateWithWhereUniqueWithoutDeviceInput | DeviceTelemetryUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: DeviceTelemetryUpdateManyWithWhereWithoutDeviceInput | DeviceTelemetryUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: DeviceTelemetryScalarWhereInput | DeviceTelemetryScalarWhereInput[]
  }

  export type DeviceCreateNestedOneWithoutTelemetryInput = {
    create?: XOR<DeviceCreateWithoutTelemetryInput, DeviceUncheckedCreateWithoutTelemetryInput>
    connectOrCreate?: DeviceCreateOrConnectWithoutTelemetryInput
    connect?: DeviceWhereUniqueInput
  }

  export type DeviceUpdateOneRequiredWithoutTelemetryNestedInput = {
    create?: XOR<DeviceCreateWithoutTelemetryInput, DeviceUncheckedCreateWithoutTelemetryInput>
    connectOrCreate?: DeviceCreateOrConnectWithoutTelemetryInput
    upsert?: DeviceUpsertWithoutTelemetryInput
    connect?: DeviceWhereUniqueInput
    update?: XOR<XOR<DeviceUpdateToOneWithWhereWithoutTelemetryInput, DeviceUpdateWithoutTelemetryInput>, DeviceUncheckedUpdateWithoutTelemetryInput>
  }

  export type UserCreateNestedOneWithoutAccessInput = {
    create?: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessInput
    connect?: UserWhereUniqueInput
  }

  export type CityCreateNestedOneWithoutAccessInput = {
    create?: XOR<CityCreateWithoutAccessInput, CityUncheckedCreateWithoutAccessInput>
    connectOrCreate?: CityCreateOrConnectWithoutAccessInput
    connect?: CityWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccessNestedInput = {
    create?: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccessInput
    upsert?: UserUpsertWithoutAccessInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccessInput, UserUpdateWithoutAccessInput>, UserUncheckedUpdateWithoutAccessInput>
  }

  export type CityUpdateOneRequiredWithoutAccessNestedInput = {
    create?: XOR<CityCreateWithoutAccessInput, CityUncheckedCreateWithoutAccessInput>
    connectOrCreate?: CityCreateOrConnectWithoutAccessInput
    upsert?: CityUpsertWithoutAccessInput
    connect?: CityWhereUniqueInput
    update?: XOR<XOR<CityUpdateToOneWithWhereWithoutAccessInput, CityUpdateWithoutAccessInput>, CityUncheckedUpdateWithoutAccessInput>
  }

  export type DeviceCreateNestedOneWithoutTrapsInput = {
    create?: XOR<DeviceCreateWithoutTrapsInput, DeviceUncheckedCreateWithoutTrapsInput>
    connectOrCreate?: DeviceCreateOrConnectWithoutTrapsInput
    connect?: DeviceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DeviceUpdateOneWithoutTrapsNestedInput = {
    create?: XOR<DeviceCreateWithoutTrapsInput, DeviceUncheckedCreateWithoutTrapsInput>
    connectOrCreate?: DeviceCreateOrConnectWithoutTrapsInput
    upsert?: DeviceUpsertWithoutTrapsInput
    disconnect?: DeviceWhereInput | boolean
    delete?: DeviceWhereInput | boolean
    connect?: DeviceWhereUniqueInput
    update?: XOR<XOR<DeviceUpdateToOneWithWhereWithoutTrapsInput, DeviceUpdateWithoutTrapsInput>, DeviceUncheckedUpdateWithoutTrapsInput>
  }

  export type UserCreateNestedManyWithoutCompanyRefInput = {
    create?: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput> | UserCreateWithoutCompanyRefInput[] | UserUncheckedCreateWithoutCompanyRefInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyRefInput | UserCreateOrConnectWithoutCompanyRefInput[]
    createMany?: UserCreateManyCompanyRefInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DeviceCreateNestedManyWithoutCompanyInput = {
    create?: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput> | DeviceCreateWithoutCompanyInput[] | DeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCompanyInput | DeviceCreateOrConnectWithoutCompanyInput[]
    createMany?: DeviceCreateManyCompanyInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type KronDeviceCreateNestedManyWithoutCompanyInput = {
    create?: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput> | KronDeviceCreateWithoutCompanyInput[] | KronDeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCompanyInput | KronDeviceCreateOrConnectWithoutCompanyInput[]
    createMany?: KronDeviceCreateManyCompanyInputEnvelope
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutCompanyRefInput = {
    create?: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput> | UserCreateWithoutCompanyRefInput[] | UserUncheckedCreateWithoutCompanyRefInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyRefInput | UserCreateOrConnectWithoutCompanyRefInput[]
    createMany?: UserCreateManyCompanyRefInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput> | DeviceCreateWithoutCompanyInput[] | DeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCompanyInput | DeviceCreateOrConnectWithoutCompanyInput[]
    createMany?: DeviceCreateManyCompanyInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type KronDeviceUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput> | KronDeviceCreateWithoutCompanyInput[] | KronDeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCompanyInput | KronDeviceCreateOrConnectWithoutCompanyInput[]
    createMany?: KronDeviceCreateManyCompanyInputEnvelope
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutCompanyRefNestedInput = {
    create?: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput> | UserCreateWithoutCompanyRefInput[] | UserUncheckedCreateWithoutCompanyRefInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyRefInput | UserCreateOrConnectWithoutCompanyRefInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyRefInput | UserUpsertWithWhereUniqueWithoutCompanyRefInput[]
    createMany?: UserCreateManyCompanyRefInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyRefInput | UserUpdateWithWhereUniqueWithoutCompanyRefInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyRefInput | UserUpdateManyWithWhereWithoutCompanyRefInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DeviceUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput> | DeviceCreateWithoutCompanyInput[] | DeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCompanyInput | DeviceCreateOrConnectWithoutCompanyInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutCompanyInput | DeviceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: DeviceCreateManyCompanyInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutCompanyInput | DeviceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutCompanyInput | DeviceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type KronDeviceUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput> | KronDeviceCreateWithoutCompanyInput[] | KronDeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCompanyInput | KronDeviceCreateOrConnectWithoutCompanyInput[]
    upsert?: KronDeviceUpsertWithWhereUniqueWithoutCompanyInput | KronDeviceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: KronDeviceCreateManyCompanyInputEnvelope
    set?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    disconnect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    delete?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    update?: KronDeviceUpdateWithWhereUniqueWithoutCompanyInput | KronDeviceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: KronDeviceUpdateManyWithWhereWithoutCompanyInput | KronDeviceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutCompanyRefNestedInput = {
    create?: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput> | UserCreateWithoutCompanyRefInput[] | UserUncheckedCreateWithoutCompanyRefInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyRefInput | UserCreateOrConnectWithoutCompanyRefInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyRefInput | UserUpsertWithWhereUniqueWithoutCompanyRefInput[]
    createMany?: UserCreateManyCompanyRefInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyRefInput | UserUpdateWithWhereUniqueWithoutCompanyRefInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyRefInput | UserUpdateManyWithWhereWithoutCompanyRefInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput> | DeviceCreateWithoutCompanyInput[] | DeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutCompanyInput | DeviceCreateOrConnectWithoutCompanyInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutCompanyInput | DeviceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: DeviceCreateManyCompanyInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutCompanyInput | DeviceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutCompanyInput | DeviceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type KronDeviceUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput> | KronDeviceCreateWithoutCompanyInput[] | KronDeviceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: KronDeviceCreateOrConnectWithoutCompanyInput | KronDeviceCreateOrConnectWithoutCompanyInput[]
    upsert?: KronDeviceUpsertWithWhereUniqueWithoutCompanyInput | KronDeviceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: KronDeviceCreateManyCompanyInputEnvelope
    set?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    disconnect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    delete?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    connect?: KronDeviceWhereUniqueInput | KronDeviceWhereUniqueInput[]
    update?: KronDeviceUpdateWithWhereUniqueWithoutCompanyInput | KronDeviceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: KronDeviceUpdateManyWithWhereWithoutCompanyInput | KronDeviceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
  }

  export type CityCreateNestedOneWithoutKronDevicesInput = {
    create?: XOR<CityCreateWithoutKronDevicesInput, CityUncheckedCreateWithoutKronDevicesInput>
    connectOrCreate?: CityCreateOrConnectWithoutKronDevicesInput
    connect?: CityWhereUniqueInput
  }

  export type CompanyCreateNestedOneWithoutKronDevicesInput = {
    create?: XOR<CompanyCreateWithoutKronDevicesInput, CompanyUncheckedCreateWithoutKronDevicesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutKronDevicesInput
    connect?: CompanyWhereUniqueInput
  }

  export type KronReadingCreateNestedManyWithoutDeviceInput = {
    create?: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput> | KronReadingCreateWithoutDeviceInput[] | KronReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: KronReadingCreateOrConnectWithoutDeviceInput | KronReadingCreateOrConnectWithoutDeviceInput[]
    createMany?: KronReadingCreateManyDeviceInputEnvelope
    connect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
  }

  export type KronReadingUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput> | KronReadingCreateWithoutDeviceInput[] | KronReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: KronReadingCreateOrConnectWithoutDeviceInput | KronReadingCreateOrConnectWithoutDeviceInput[]
    createMany?: KronReadingCreateManyDeviceInputEnvelope
    connect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
  }

  export type CityUpdateOneWithoutKronDevicesNestedInput = {
    create?: XOR<CityCreateWithoutKronDevicesInput, CityUncheckedCreateWithoutKronDevicesInput>
    connectOrCreate?: CityCreateOrConnectWithoutKronDevicesInput
    upsert?: CityUpsertWithoutKronDevicesInput
    disconnect?: CityWhereInput | boolean
    delete?: CityWhereInput | boolean
    connect?: CityWhereUniqueInput
    update?: XOR<XOR<CityUpdateToOneWithWhereWithoutKronDevicesInput, CityUpdateWithoutKronDevicesInput>, CityUncheckedUpdateWithoutKronDevicesInput>
  }

  export type CompanyUpdateOneWithoutKronDevicesNestedInput = {
    create?: XOR<CompanyCreateWithoutKronDevicesInput, CompanyUncheckedCreateWithoutKronDevicesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutKronDevicesInput
    upsert?: CompanyUpsertWithoutKronDevicesInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutKronDevicesInput, CompanyUpdateWithoutKronDevicesInput>, CompanyUncheckedUpdateWithoutKronDevicesInput>
  }

  export type KronReadingUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput> | KronReadingCreateWithoutDeviceInput[] | KronReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: KronReadingCreateOrConnectWithoutDeviceInput | KronReadingCreateOrConnectWithoutDeviceInput[]
    upsert?: KronReadingUpsertWithWhereUniqueWithoutDeviceInput | KronReadingUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: KronReadingCreateManyDeviceInputEnvelope
    set?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    disconnect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    delete?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    connect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    update?: KronReadingUpdateWithWhereUniqueWithoutDeviceInput | KronReadingUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: KronReadingUpdateManyWithWhereWithoutDeviceInput | KronReadingUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: KronReadingScalarWhereInput | KronReadingScalarWhereInput[]
  }

  export type KronReadingUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput> | KronReadingCreateWithoutDeviceInput[] | KronReadingUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: KronReadingCreateOrConnectWithoutDeviceInput | KronReadingCreateOrConnectWithoutDeviceInput[]
    upsert?: KronReadingUpsertWithWhereUniqueWithoutDeviceInput | KronReadingUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: KronReadingCreateManyDeviceInputEnvelope
    set?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    disconnect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    delete?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    connect?: KronReadingWhereUniqueInput | KronReadingWhereUniqueInput[]
    update?: KronReadingUpdateWithWhereUniqueWithoutDeviceInput | KronReadingUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: KronReadingUpdateManyWithWhereWithoutDeviceInput | KronReadingUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: KronReadingScalarWhereInput | KronReadingScalarWhereInput[]
  }

  export type KronDeviceCreateNestedOneWithoutReadingsInput = {
    create?: XOR<KronDeviceCreateWithoutReadingsInput, KronDeviceUncheckedCreateWithoutReadingsInput>
    connectOrCreate?: KronDeviceCreateOrConnectWithoutReadingsInput
    connect?: KronDeviceWhereUniqueInput
  }

  export type KronDeviceUpdateOneRequiredWithoutReadingsNestedInput = {
    create?: XOR<KronDeviceCreateWithoutReadingsInput, KronDeviceUncheckedCreateWithoutReadingsInput>
    connectOrCreate?: KronDeviceCreateOrConnectWithoutReadingsInput
    upsert?: KronDeviceUpsertWithoutReadingsInput
    connect?: KronDeviceWhereUniqueInput
    update?: XOR<XOR<KronDeviceUpdateToOneWithWhereWithoutReadingsInput, KronDeviceUpdateWithoutReadingsInput>, KronDeviceUncheckedUpdateWithoutReadingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CompanyCreateWithoutUsersInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    devices?: DeviceCreateNestedManyWithoutCompanyInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    devices?: DeviceUncheckedCreateNestedManyWithoutCompanyInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutUsersInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
  }

  export type UserAccessCreateWithoutUserInput = {
    permission?: string
    city: CityCreateNestedOneWithoutAccessInput
  }

  export type UserAccessUncheckedCreateWithoutUserInput = {
    cityId: string
    permission?: string
  }

  export type UserAccessCreateOrConnectWithoutUserInput = {
    where: UserAccessWhereUniqueInput
    create: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput>
  }

  export type UserAccessCreateManyUserInputEnvelope = {
    data: UserAccessCreateManyUserInput | UserAccessCreateManyUserInput[]
  }

  export type CompanyUpsertWithoutUsersInput = {
    update: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutUsersInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type CompanyUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUpdateManyWithoutCompanyNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUncheckedUpdateManyWithoutCompanyNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type UserAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAccessWhereUniqueInput
    update: XOR<UserAccessUpdateWithoutUserInput, UserAccessUncheckedUpdateWithoutUserInput>
    create: XOR<UserAccessCreateWithoutUserInput, UserAccessUncheckedCreateWithoutUserInput>
  }

  export type UserAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAccessWhereUniqueInput
    data: XOR<UserAccessUpdateWithoutUserInput, UserAccessUncheckedUpdateWithoutUserInput>
  }

  export type UserAccessUpdateManyWithWhereWithoutUserInput = {
    where: UserAccessScalarWhereInput
    data: XOR<UserAccessUpdateManyMutationInput, UserAccessUncheckedUpdateManyWithoutUserInput>
  }

  export type UserAccessScalarWhereInput = {
    AND?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
    OR?: UserAccessScalarWhereInput[]
    NOT?: UserAccessScalarWhereInput | UserAccessScalarWhereInput[]
    userId?: StringFilter<"UserAccess"> | string
    cityId?: StringFilter<"UserAccess"> | string
    permission?: StringFilter<"UserAccess"> | string
  }

  export type CityCreateWithoutStateInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    devices?: DeviceCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCityInput
    access?: UserAccessCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutStateInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    devices?: DeviceUncheckedCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCityInput
    access?: UserAccessUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutStateInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput>
  }

  export type CityCreateManyStateInputEnvelope = {
    data: CityCreateManyStateInput | CityCreateManyStateInput[]
  }

  export type CityUpsertWithWhereUniqueWithoutStateInput = {
    where: CityWhereUniqueInput
    update: XOR<CityUpdateWithoutStateInput, CityUncheckedUpdateWithoutStateInput>
    create: XOR<CityCreateWithoutStateInput, CityUncheckedCreateWithoutStateInput>
  }

  export type CityUpdateWithWhereUniqueWithoutStateInput = {
    where: CityWhereUniqueInput
    data: XOR<CityUpdateWithoutStateInput, CityUncheckedUpdateWithoutStateInput>
  }

  export type CityUpdateManyWithWhereWithoutStateInput = {
    where: CityScalarWhereInput
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyWithoutStateInput>
  }

  export type CityScalarWhereInput = {
    AND?: CityScalarWhereInput | CityScalarWhereInput[]
    OR?: CityScalarWhereInput[]
    NOT?: CityScalarWhereInput | CityScalarWhereInput[]
    id?: StringFilter<"City"> | string
    name?: StringFilter<"City"> | string
    stateId?: StringFilter<"City"> | string
    address?: StringNullableFilter<"City"> | string | null
    latitude?: FloatNullableFilter<"City"> | number | null
    longitude?: FloatNullableFilter<"City"> | number | null
    createdAt?: DateTimeFilter<"City"> | Date | string
  }

  export type StateCreateWithoutCitiesInput = {
    id?: string
    name: string
    uf: string
    createdAt?: Date | string
  }

  export type StateUncheckedCreateWithoutCitiesInput = {
    id?: string
    name: string
    uf: string
    createdAt?: Date | string
  }

  export type StateCreateOrConnectWithoutCitiesInput = {
    where: StateWhereUniqueInput
    create: XOR<StateCreateWithoutCitiesInput, StateUncheckedCreateWithoutCitiesInput>
  }

  export type DeviceCreateWithoutCityInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    traps?: TrapCreateNestedManyWithoutDeviceInput
    company?: CompanyCreateNestedOneWithoutDevicesInput
    telemetry?: DeviceTelemetryCreateNestedManyWithoutDeviceInput
  }

  export type DeviceUncheckedCreateWithoutCityInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    traps?: TrapUncheckedCreateNestedManyWithoutDeviceInput
    telemetry?: DeviceTelemetryUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceCreateOrConnectWithoutCityInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput>
  }

  export type DeviceCreateManyCityInputEnvelope = {
    data: DeviceCreateManyCityInput | DeviceCreateManyCityInput[]
  }

  export type KronDeviceCreateWithoutCityInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    company?: CompanyCreateNestedOneWithoutKronDevicesInput
    readings?: KronReadingCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceUncheckedCreateWithoutCityInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    companyId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    readings?: KronReadingUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceCreateOrConnectWithoutCityInput = {
    where: KronDeviceWhereUniqueInput
    create: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput>
  }

  export type KronDeviceCreateManyCityInputEnvelope = {
    data: KronDeviceCreateManyCityInput | KronDeviceCreateManyCityInput[]
  }

  export type UserAccessCreateWithoutCityInput = {
    permission?: string
    user: UserCreateNestedOneWithoutAccessInput
  }

  export type UserAccessUncheckedCreateWithoutCityInput = {
    userId: string
    permission?: string
  }

  export type UserAccessCreateOrConnectWithoutCityInput = {
    where: UserAccessWhereUniqueInput
    create: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput>
  }

  export type UserAccessCreateManyCityInputEnvelope = {
    data: UserAccessCreateManyCityInput | UserAccessCreateManyCityInput[]
  }

  export type StateUpsertWithoutCitiesInput = {
    update: XOR<StateUpdateWithoutCitiesInput, StateUncheckedUpdateWithoutCitiesInput>
    create: XOR<StateCreateWithoutCitiesInput, StateUncheckedCreateWithoutCitiesInput>
    where?: StateWhereInput
  }

  export type StateUpdateToOneWithWhereWithoutCitiesInput = {
    where?: StateWhereInput
    data: XOR<StateUpdateWithoutCitiesInput, StateUncheckedUpdateWithoutCitiesInput>
  }

  export type StateUpdateWithoutCitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StateUncheckedUpdateWithoutCitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutCityInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutCityInput, DeviceUncheckedUpdateWithoutCityInput>
    create: XOR<DeviceCreateWithoutCityInput, DeviceUncheckedCreateWithoutCityInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutCityInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutCityInput, DeviceUncheckedUpdateWithoutCityInput>
  }

  export type DeviceUpdateManyWithWhereWithoutCityInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutCityInput>
  }

  export type DeviceScalarWhereInput = {
    AND?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    OR?: DeviceScalarWhereInput[]
    NOT?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    id?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    ip?: StringFilter<"Device"> | string
    serial?: StringNullableFilter<"Device"> | string | null
    cityId?: StringFilter<"Device"> | string
    lastSeen?: DateTimeFilter<"Device"> | Date | string
    hasAlarm?: BoolFilter<"Device"> | boolean
    lastSnmpData?: StringNullableFilter<"Device"> | string | null
    lastSnmpSync?: DateTimeNullableFilter<"Device"> | Date | string | null
    status?: StringFilter<"Device"> | string
    active?: BoolFilter<"Device"> | boolean
    syncError?: StringNullableFilter<"Device"> | string | null
    companyId?: StringNullableFilter<"Device"> | string | null
    vpnUsername?: StringNullableFilter<"Device"> | string | null
    vpnStatus?: StringFilter<"Device"> | string
    vpnIp?: StringNullableFilter<"Device"> | string | null
    vpnLastSeen?: DateTimeNullableFilter<"Device"> | Date | string | null
    address?: StringNullableFilter<"Device"> | string | null
    latitude?: FloatNullableFilter<"Device"> | number | null
    longitude?: FloatNullableFilter<"Device"> | number | null
    createdAt?: DateTimeFilter<"Device"> | Date | string
  }

  export type KronDeviceUpsertWithWhereUniqueWithoutCityInput = {
    where: KronDeviceWhereUniqueInput
    update: XOR<KronDeviceUpdateWithoutCityInput, KronDeviceUncheckedUpdateWithoutCityInput>
    create: XOR<KronDeviceCreateWithoutCityInput, KronDeviceUncheckedCreateWithoutCityInput>
  }

  export type KronDeviceUpdateWithWhereUniqueWithoutCityInput = {
    where: KronDeviceWhereUniqueInput
    data: XOR<KronDeviceUpdateWithoutCityInput, KronDeviceUncheckedUpdateWithoutCityInput>
  }

  export type KronDeviceUpdateManyWithWhereWithoutCityInput = {
    where: KronDeviceScalarWhereInput
    data: XOR<KronDeviceUpdateManyMutationInput, KronDeviceUncheckedUpdateManyWithoutCityInput>
  }

  export type KronDeviceScalarWhereInput = {
    AND?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
    OR?: KronDeviceScalarWhereInput[]
    NOT?: KronDeviceScalarWhereInput | KronDeviceScalarWhereInput[]
    id?: StringFilter<"KronDevice"> | string
    name?: StringFilter<"KronDevice"> | string
    serial?: StringFilter<"KronDevice"> | string
    mqttTopic?: StringFilter<"KronDevice"> | string
    location?: StringNullableFilter<"KronDevice"> | string | null
    cityId?: StringNullableFilter<"KronDevice"> | string | null
    companyId?: StringNullableFilter<"KronDevice"> | string | null
    active?: BoolFilter<"KronDevice"> | boolean
    createdAt?: DateTimeFilter<"KronDevice"> | Date | string
    updatedAt?: DateTimeFilter<"KronDevice"> | Date | string
  }

  export type UserAccessUpsertWithWhereUniqueWithoutCityInput = {
    where: UserAccessWhereUniqueInput
    update: XOR<UserAccessUpdateWithoutCityInput, UserAccessUncheckedUpdateWithoutCityInput>
    create: XOR<UserAccessCreateWithoutCityInput, UserAccessUncheckedCreateWithoutCityInput>
  }

  export type UserAccessUpdateWithWhereUniqueWithoutCityInput = {
    where: UserAccessWhereUniqueInput
    data: XOR<UserAccessUpdateWithoutCityInput, UserAccessUncheckedUpdateWithoutCityInput>
  }

  export type UserAccessUpdateManyWithWhereWithoutCityInput = {
    where: UserAccessScalarWhereInput
    data: XOR<UserAccessUpdateManyMutationInput, UserAccessUncheckedUpdateManyWithoutCityInput>
  }

  export type CityCreateWithoutDevicesInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    state: StateCreateNestedOneWithoutCitiesInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCityInput
    access?: UserAccessCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutDevicesInput = {
    id?: string
    name: string
    stateId: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCityInput
    access?: UserAccessUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutDevicesInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutDevicesInput, CityUncheckedCreateWithoutDevicesInput>
  }

  export type TrapCreateWithoutDeviceInput = {
    id?: string
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
  }

  export type TrapUncheckedCreateWithoutDeviceInput = {
    id?: string
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
  }

  export type TrapCreateOrConnectWithoutDeviceInput = {
    where: TrapWhereUniqueInput
    create: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput>
  }

  export type TrapCreateManyDeviceInputEnvelope = {
    data: TrapCreateManyDeviceInput | TrapCreateManyDeviceInput[]
  }

  export type CompanyCreateWithoutDevicesInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyRefInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutDevicesInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyRefInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutDevicesInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutDevicesInput, CompanyUncheckedCreateWithoutDevicesInput>
  }

  export type DeviceTelemetryCreateWithoutDeviceInput = {
    id?: string
    timestamp?: Date | string
    hardware: string
    metrics: string
  }

  export type DeviceTelemetryUncheckedCreateWithoutDeviceInput = {
    id?: string
    timestamp?: Date | string
    hardware: string
    metrics: string
  }

  export type DeviceTelemetryCreateOrConnectWithoutDeviceInput = {
    where: DeviceTelemetryWhereUniqueInput
    create: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput>
  }

  export type DeviceTelemetryCreateManyDeviceInputEnvelope = {
    data: DeviceTelemetryCreateManyDeviceInput | DeviceTelemetryCreateManyDeviceInput[]
  }

  export type CityUpsertWithoutDevicesInput = {
    update: XOR<CityUpdateWithoutDevicesInput, CityUncheckedUpdateWithoutDevicesInput>
    create: XOR<CityCreateWithoutDevicesInput, CityUncheckedCreateWithoutDevicesInput>
    where?: CityWhereInput
  }

  export type CityUpdateToOneWithWhereWithoutDevicesInput = {
    where?: CityWhereInput
    data: XOR<CityUpdateWithoutDevicesInput, CityUncheckedUpdateWithoutDevicesInput>
  }

  export type CityUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    state?: StateUpdateOneRequiredWithoutCitiesNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCityNestedInput
    access?: UserAccessUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stateId?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCityNestedInput
    access?: UserAccessUncheckedUpdateManyWithoutCityNestedInput
  }

  export type TrapUpsertWithWhereUniqueWithoutDeviceInput = {
    where: TrapWhereUniqueInput
    update: XOR<TrapUpdateWithoutDeviceInput, TrapUncheckedUpdateWithoutDeviceInput>
    create: XOR<TrapCreateWithoutDeviceInput, TrapUncheckedCreateWithoutDeviceInput>
  }

  export type TrapUpdateWithWhereUniqueWithoutDeviceInput = {
    where: TrapWhereUniqueInput
    data: XOR<TrapUpdateWithoutDeviceInput, TrapUncheckedUpdateWithoutDeviceInput>
  }

  export type TrapUpdateManyWithWhereWithoutDeviceInput = {
    where: TrapScalarWhereInput
    data: XOR<TrapUpdateManyMutationInput, TrapUncheckedUpdateManyWithoutDeviceInput>
  }

  export type TrapScalarWhereInput = {
    AND?: TrapScalarWhereInput | TrapScalarWhereInput[]
    OR?: TrapScalarWhereInput[]
    NOT?: TrapScalarWhereInput | TrapScalarWhereInput[]
    id?: StringFilter<"Trap"> | string
    deviceId?: StringNullableFilter<"Trap"> | string | null
    deviceSerial?: StringNullableFilter<"Trap"> | string | null
    ctrlName?: StringNullableFilter<"Trap"> | string | null
    severity?: IntFilter<"Trap"> | number
    oid?: StringFilter<"Trap"> | string
    alarmName?: StringFilter<"Trap"> | string
    description?: StringFilter<"Trap"> | string
    fullText?: StringFilter<"Trap"> | string
    timestamp?: DateTimeFilter<"Trap"> | Date | string
    isCleared?: BoolFilter<"Trap"> | boolean
  }

  export type CompanyUpsertWithoutDevicesInput = {
    update: XOR<CompanyUpdateWithoutDevicesInput, CompanyUncheckedUpdateWithoutDevicesInput>
    create: XOR<CompanyCreateWithoutDevicesInput, CompanyUncheckedCreateWithoutDevicesInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutDevicesInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutDevicesInput, CompanyUncheckedUpdateWithoutDevicesInput>
  }

  export type CompanyUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyRefNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyRefNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type DeviceTelemetryUpsertWithWhereUniqueWithoutDeviceInput = {
    where: DeviceTelemetryWhereUniqueInput
    update: XOR<DeviceTelemetryUpdateWithoutDeviceInput, DeviceTelemetryUncheckedUpdateWithoutDeviceInput>
    create: XOR<DeviceTelemetryCreateWithoutDeviceInput, DeviceTelemetryUncheckedCreateWithoutDeviceInput>
  }

  export type DeviceTelemetryUpdateWithWhereUniqueWithoutDeviceInput = {
    where: DeviceTelemetryWhereUniqueInput
    data: XOR<DeviceTelemetryUpdateWithoutDeviceInput, DeviceTelemetryUncheckedUpdateWithoutDeviceInput>
  }

  export type DeviceTelemetryUpdateManyWithWhereWithoutDeviceInput = {
    where: DeviceTelemetryScalarWhereInput
    data: XOR<DeviceTelemetryUpdateManyMutationInput, DeviceTelemetryUncheckedUpdateManyWithoutDeviceInput>
  }

  export type DeviceTelemetryScalarWhereInput = {
    AND?: DeviceTelemetryScalarWhereInput | DeviceTelemetryScalarWhereInput[]
    OR?: DeviceTelemetryScalarWhereInput[]
    NOT?: DeviceTelemetryScalarWhereInput | DeviceTelemetryScalarWhereInput[]
    id?: StringFilter<"DeviceTelemetry"> | string
    deviceId?: StringFilter<"DeviceTelemetry"> | string
    timestamp?: DateTimeFilter<"DeviceTelemetry"> | Date | string
    hardware?: StringFilter<"DeviceTelemetry"> | string
    metrics?: StringFilter<"DeviceTelemetry"> | string
  }

  export type DeviceCreateWithoutTelemetryInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    city: CityCreateNestedOneWithoutDevicesInput
    traps?: TrapCreateNestedManyWithoutDeviceInput
    company?: CompanyCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateWithoutTelemetryInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    traps?: TrapUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceCreateOrConnectWithoutTelemetryInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutTelemetryInput, DeviceUncheckedCreateWithoutTelemetryInput>
  }

  export type DeviceUpsertWithoutTelemetryInput = {
    update: XOR<DeviceUpdateWithoutTelemetryInput, DeviceUncheckedUpdateWithoutTelemetryInput>
    create: XOR<DeviceCreateWithoutTelemetryInput, DeviceUncheckedCreateWithoutTelemetryInput>
    where?: DeviceWhereInput
  }

  export type DeviceUpdateToOneWithWhereWithoutTelemetryInput = {
    where?: DeviceWhereInput
    data: XOR<DeviceUpdateWithoutTelemetryInput, DeviceUncheckedUpdateWithoutTelemetryInput>
  }

  export type DeviceUpdateWithoutTelemetryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneRequiredWithoutDevicesNestedInput
    traps?: TrapUpdateManyWithoutDeviceNestedInput
    company?: CompanyUpdateOneWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateWithoutTelemetryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    traps?: TrapUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type UserCreateWithoutAccessInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    companyRef?: CompanyCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutAccessInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    companyId?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutAccessInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
  }

  export type CityCreateWithoutAccessInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    state: StateCreateNestedOneWithoutCitiesInput
    devices?: DeviceCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutAccessInput = {
    id?: string
    name: string
    stateId: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    devices?: DeviceUncheckedCreateNestedManyWithoutCityInput
    kronDevices?: KronDeviceUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutAccessInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutAccessInput, CityUncheckedCreateWithoutAccessInput>
  }

  export type UserUpsertWithoutAccessInput = {
    update: XOR<UserUpdateWithoutAccessInput, UserUncheckedUpdateWithoutAccessInput>
    create: XOR<UserCreateWithoutAccessInput, UserUncheckedCreateWithoutAccessInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccessInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccessInput, UserUncheckedUpdateWithoutAccessInput>
  }

  export type UserUpdateWithoutAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyRef?: CompanyUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CityUpsertWithoutAccessInput = {
    update: XOR<CityUpdateWithoutAccessInput, CityUncheckedUpdateWithoutAccessInput>
    create: XOR<CityCreateWithoutAccessInput, CityUncheckedCreateWithoutAccessInput>
    where?: CityWhereInput
  }

  export type CityUpdateToOneWithWhereWithoutAccessInput = {
    where?: CityWhereInput
    data: XOR<CityUpdateWithoutAccessInput, CityUncheckedUpdateWithoutAccessInput>
  }

  export type CityUpdateWithoutAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    state?: StateUpdateOneRequiredWithoutCitiesNestedInput
    devices?: DeviceUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stateId?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUncheckedUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCityNestedInput
  }

  export type DeviceCreateWithoutTrapsInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    city: CityCreateNestedOneWithoutDevicesInput
    company?: CompanyCreateNestedOneWithoutDevicesInput
    telemetry?: DeviceTelemetryCreateNestedManyWithoutDeviceInput
  }

  export type DeviceUncheckedCreateWithoutTrapsInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    telemetry?: DeviceTelemetryUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceCreateOrConnectWithoutTrapsInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutTrapsInput, DeviceUncheckedCreateWithoutTrapsInput>
  }

  export type DeviceUpsertWithoutTrapsInput = {
    update: XOR<DeviceUpdateWithoutTrapsInput, DeviceUncheckedUpdateWithoutTrapsInput>
    create: XOR<DeviceCreateWithoutTrapsInput, DeviceUncheckedCreateWithoutTrapsInput>
    where?: DeviceWhereInput
  }

  export type DeviceUpdateToOneWithWhereWithoutTrapsInput = {
    where?: DeviceWhereInput
    data: XOR<DeviceUpdateWithoutTrapsInput, DeviceUncheckedUpdateWithoutTrapsInput>
  }

  export type DeviceUpdateWithoutTrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneRequiredWithoutDevicesNestedInput
    company?: CompanyUpdateOneWithoutDevicesNestedInput
    telemetry?: DeviceTelemetryUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateWithoutTrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    telemetry?: DeviceTelemetryUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type UserCreateWithoutCompanyRefInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    access?: UserAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompanyRefInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
    access?: UserAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompanyRefInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput>
  }

  export type UserCreateManyCompanyRefInputEnvelope = {
    data: UserCreateManyCompanyRefInput | UserCreateManyCompanyRefInput[]
  }

  export type DeviceCreateWithoutCompanyInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    city: CityCreateNestedOneWithoutDevicesInput
    traps?: TrapCreateNestedManyWithoutDeviceInput
    telemetry?: DeviceTelemetryCreateNestedManyWithoutDeviceInput
  }

  export type DeviceUncheckedCreateWithoutCompanyInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    traps?: TrapUncheckedCreateNestedManyWithoutDeviceInput
    telemetry?: DeviceTelemetryUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceCreateOrConnectWithoutCompanyInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput>
  }

  export type DeviceCreateManyCompanyInputEnvelope = {
    data: DeviceCreateManyCompanyInput | DeviceCreateManyCompanyInput[]
  }

  export type KronDeviceCreateWithoutCompanyInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutKronDevicesInput
    readings?: KronReadingCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceUncheckedCreateWithoutCompanyInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    cityId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    readings?: KronReadingUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type KronDeviceCreateOrConnectWithoutCompanyInput = {
    where: KronDeviceWhereUniqueInput
    create: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput>
  }

  export type KronDeviceCreateManyCompanyInputEnvelope = {
    data: KronDeviceCreateManyCompanyInput | KronDeviceCreateManyCompanyInput[]
  }

  export type UserUpsertWithWhereUniqueWithoutCompanyRefInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutCompanyRefInput, UserUncheckedUpdateWithoutCompanyRefInput>
    create: XOR<UserCreateWithoutCompanyRefInput, UserUncheckedCreateWithoutCompanyRefInput>
  }

  export type UserUpdateWithWhereUniqueWithoutCompanyRefInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutCompanyRefInput, UserUncheckedUpdateWithoutCompanyRefInput>
  }

  export type UserUpdateManyWithWhereWithoutCompanyRefInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutCompanyRefInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    company?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    mustChangePassword?: BoolFilter<"User"> | boolean
    canAccessInfo?: BoolFilter<"User"> | boolean
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutCompanyInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutCompanyInput, DeviceUncheckedUpdateWithoutCompanyInput>
    create: XOR<DeviceCreateWithoutCompanyInput, DeviceUncheckedCreateWithoutCompanyInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutCompanyInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutCompanyInput, DeviceUncheckedUpdateWithoutCompanyInput>
  }

  export type DeviceUpdateManyWithWhereWithoutCompanyInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutCompanyInput>
  }

  export type KronDeviceUpsertWithWhereUniqueWithoutCompanyInput = {
    where: KronDeviceWhereUniqueInput
    update: XOR<KronDeviceUpdateWithoutCompanyInput, KronDeviceUncheckedUpdateWithoutCompanyInput>
    create: XOR<KronDeviceCreateWithoutCompanyInput, KronDeviceUncheckedCreateWithoutCompanyInput>
  }

  export type KronDeviceUpdateWithWhereUniqueWithoutCompanyInput = {
    where: KronDeviceWhereUniqueInput
    data: XOR<KronDeviceUpdateWithoutCompanyInput, KronDeviceUncheckedUpdateWithoutCompanyInput>
  }

  export type KronDeviceUpdateManyWithWhereWithoutCompanyInput = {
    where: KronDeviceScalarWhereInput
    data: XOR<KronDeviceUpdateManyMutationInput, KronDeviceUncheckedUpdateManyWithoutCompanyInput>
  }

  export type CityCreateWithoutKronDevicesInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    state: StateCreateNestedOneWithoutCitiesInput
    devices?: DeviceCreateNestedManyWithoutCityInput
    access?: UserAccessCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutKronDevicesInput = {
    id?: string
    name: string
    stateId: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    devices?: DeviceUncheckedCreateNestedManyWithoutCityInput
    access?: UserAccessUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutKronDevicesInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutKronDevicesInput, CityUncheckedCreateWithoutKronDevicesInput>
  }

  export type CompanyCreateWithoutKronDevicesInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyRefInput
    devices?: DeviceCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutKronDevicesInput = {
    id?: string
    name: string
    status?: string
    paymentStatus?: string
    dueDate?: Date | string | null
    lastPaymentAt?: Date | string | null
    blockedAt?: Date | string | null
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyRefInput
    devices?: DeviceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutKronDevicesInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutKronDevicesInput, CompanyUncheckedCreateWithoutKronDevicesInput>
  }

  export type KronReadingCreateWithoutDeviceInput = {
    id?: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
  }

  export type KronReadingUncheckedCreateWithoutDeviceInput = {
    id?: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
  }

  export type KronReadingCreateOrConnectWithoutDeviceInput = {
    where: KronReadingWhereUniqueInput
    create: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput>
  }

  export type KronReadingCreateManyDeviceInputEnvelope = {
    data: KronReadingCreateManyDeviceInput | KronReadingCreateManyDeviceInput[]
  }

  export type CityUpsertWithoutKronDevicesInput = {
    update: XOR<CityUpdateWithoutKronDevicesInput, CityUncheckedUpdateWithoutKronDevicesInput>
    create: XOR<CityCreateWithoutKronDevicesInput, CityUncheckedCreateWithoutKronDevicesInput>
    where?: CityWhereInput
  }

  export type CityUpdateToOneWithWhereWithoutKronDevicesInput = {
    where?: CityWhereInput
    data: XOR<CityUpdateWithoutKronDevicesInput, CityUncheckedUpdateWithoutKronDevicesInput>
  }

  export type CityUpdateWithoutKronDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    state?: StateUpdateOneRequiredWithoutCitiesNestedInput
    devices?: DeviceUpdateManyWithoutCityNestedInput
    access?: UserAccessUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutKronDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stateId?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUncheckedUpdateManyWithoutCityNestedInput
    access?: UserAccessUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CompanyUpsertWithoutKronDevicesInput = {
    update: XOR<CompanyUpdateWithoutKronDevicesInput, CompanyUncheckedUpdateWithoutKronDevicesInput>
    create: XOR<CompanyCreateWithoutKronDevicesInput, CompanyUncheckedCreateWithoutKronDevicesInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutKronDevicesInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutKronDevicesInput, CompanyUncheckedUpdateWithoutKronDevicesInput>
  }

  export type CompanyUpdateWithoutKronDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyRefNestedInput
    devices?: DeviceUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutKronDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    paymentStatus?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyRefNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type KronReadingUpsertWithWhereUniqueWithoutDeviceInput = {
    where: KronReadingWhereUniqueInput
    update: XOR<KronReadingUpdateWithoutDeviceInput, KronReadingUncheckedUpdateWithoutDeviceInput>
    create: XOR<KronReadingCreateWithoutDeviceInput, KronReadingUncheckedCreateWithoutDeviceInput>
  }

  export type KronReadingUpdateWithWhereUniqueWithoutDeviceInput = {
    where: KronReadingWhereUniqueInput
    data: XOR<KronReadingUpdateWithoutDeviceInput, KronReadingUncheckedUpdateWithoutDeviceInput>
  }

  export type KronReadingUpdateManyWithWhereWithoutDeviceInput = {
    where: KronReadingScalarWhereInput
    data: XOR<KronReadingUpdateManyMutationInput, KronReadingUncheckedUpdateManyWithoutDeviceInput>
  }

  export type KronReadingScalarWhereInput = {
    AND?: KronReadingScalarWhereInput | KronReadingScalarWhereInput[]
    OR?: KronReadingScalarWhereInput[]
    NOT?: KronReadingScalarWhereInput | KronReadingScalarWhereInput[]
    id?: StringFilter<"KronReading"> | string
    kronDeviceId?: StringFilter<"KronReading"> | string
    receivedAt?: DateTimeFilter<"KronReading"> | Date | string
    voltageA?: FloatNullableFilter<"KronReading"> | number | null
    voltageB?: FloatNullableFilter<"KronReading"> | number | null
    voltageC?: FloatNullableFilter<"KronReading"> | number | null
    currentI1?: FloatNullableFilter<"KronReading"> | number | null
    currentI2?: FloatNullableFilter<"KronReading"> | number | null
    currentI3?: FloatNullableFilter<"KronReading"> | number | null
    activePowerTotal?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor1?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor2?: FloatNullableFilter<"KronReading"> | number | null
    powerFactor3?: FloatNullableFilter<"KronReading"> | number | null
    energyActivePos?: FloatNullableFilter<"KronReading"> | number | null
    energyActiveNeg?: FloatNullableFilter<"KronReading"> | number | null
    rawPayload?: StringNullableFilter<"KronReading"> | string | null
  }

  export type KronDeviceCreateWithoutReadingsInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutKronDevicesInput
    company?: CompanyCreateNestedOneWithoutKronDevicesInput
  }

  export type KronDeviceUncheckedCreateWithoutReadingsInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    cityId?: string | null
    companyId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KronDeviceCreateOrConnectWithoutReadingsInput = {
    where: KronDeviceWhereUniqueInput
    create: XOR<KronDeviceCreateWithoutReadingsInput, KronDeviceUncheckedCreateWithoutReadingsInput>
  }

  export type KronDeviceUpsertWithoutReadingsInput = {
    update: XOR<KronDeviceUpdateWithoutReadingsInput, KronDeviceUncheckedUpdateWithoutReadingsInput>
    create: XOR<KronDeviceCreateWithoutReadingsInput, KronDeviceUncheckedCreateWithoutReadingsInput>
    where?: KronDeviceWhereInput
  }

  export type KronDeviceUpdateToOneWithWhereWithoutReadingsInput = {
    where?: KronDeviceWhereInput
    data: XOR<KronDeviceUpdateWithoutReadingsInput, KronDeviceUncheckedUpdateWithoutReadingsInput>
  }

  export type KronDeviceUpdateWithoutReadingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutKronDevicesNestedInput
    company?: CompanyUpdateOneWithoutKronDevicesNestedInput
  }

  export type KronDeviceUncheckedUpdateWithoutReadingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccessCreateManyUserInput = {
    cityId: string
    permission?: string
  }

  export type UserAccessUpdateWithoutUserInput = {
    permission?: StringFieldUpdateOperationsInput | string
    city?: CityUpdateOneRequiredWithoutAccessNestedInput
  }

  export type UserAccessUncheckedUpdateWithoutUserInput = {
    cityId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type UserAccessUncheckedUpdateManyWithoutUserInput = {
    cityId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type CityCreateManyStateInput = {
    id?: string
    name: string
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
  }

  export type CityUpdateWithoutStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUpdateManyWithoutCityNestedInput
    access?: UserAccessUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceUncheckedUpdateManyWithoutCityNestedInput
    kronDevices?: KronDeviceUncheckedUpdateManyWithoutCityNestedInput
    access?: UserAccessUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateManyWithoutStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateManyCityInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    companyId?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
  }

  export type KronDeviceCreateManyCityInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    companyId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAccessCreateManyCityInput = {
    userId: string
    permission?: string
  }

  export type DeviceUpdateWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    traps?: TrapUpdateManyWithoutDeviceNestedInput
    company?: CompanyUpdateOneWithoutDevicesNestedInput
    telemetry?: DeviceTelemetryUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    traps?: TrapUncheckedUpdateManyWithoutDeviceNestedInput
    telemetry?: DeviceTelemetryUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateManyWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronDeviceUpdateWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutKronDevicesNestedInput
    readings?: KronReadingUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceUncheckedUpdateWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readings?: KronReadingUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceUncheckedUpdateManyWithoutCityInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccessUpdateWithoutCityInput = {
    permission?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutAccessNestedInput
  }

  export type UserAccessUncheckedUpdateWithoutCityInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type UserAccessUncheckedUpdateManyWithoutCityInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type TrapCreateManyDeviceInput = {
    id?: string
    deviceSerial?: string | null
    ctrlName?: string | null
    severity?: number
    oid: string
    alarmName: string
    description: string
    fullText: string
    timestamp?: Date | string
    isCleared?: boolean
  }

  export type DeviceTelemetryCreateManyDeviceInput = {
    id?: string
    timestamp?: Date | string
    hardware: string
    metrics: string
  }

  export type TrapUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TrapUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TrapUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceSerial?: NullableStringFieldUpdateOperationsInput | string | null
    ctrlName?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    oid?: StringFieldUpdateOperationsInput | string
    alarmName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    isCleared?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DeviceTelemetryUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type DeviceTelemetryUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type DeviceTelemetryUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    hardware?: StringFieldUpdateOperationsInput | string
    metrics?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyCompanyRefInput = {
    id?: string
    name: string
    username: string
    passwordHash: string
    role?: string
    company?: string | null
    phone?: string | null
    email?: string | null
    mustChangePassword?: boolean
    canAccessInfo?: boolean
    lastActive?: Date | string | null
    createdAt?: Date | string
  }

  export type DeviceCreateManyCompanyInput = {
    id?: string
    name: string
    ip: string
    serial?: string | null
    cityId: string
    lastSeen?: Date | string
    hasAlarm?: boolean
    lastSnmpData?: string | null
    lastSnmpSync?: Date | string | null
    status?: string
    active?: boolean
    syncError?: string | null
    vpnUsername?: string | null
    vpnStatus?: string
    vpnIp?: string | null
    vpnLastSeen?: Date | string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
  }

  export type KronDeviceCreateManyCompanyInput = {
    id?: string
    name: string
    serial: string
    mqttTopic: string
    location?: string | null
    cityId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutCompanyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    access?: UserAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    access?: UserAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutCompanyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    canAccessInfo?: BoolFieldUpdateOperationsInput | boolean
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneRequiredWithoutDevicesNestedInput
    traps?: TrapUpdateManyWithoutDeviceNestedInput
    telemetry?: DeviceTelemetryUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    traps?: TrapUncheckedUpdateManyWithoutDeviceNestedInput
    telemetry?: DeviceTelemetryUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    serial?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    hasAlarm?: BoolFieldUpdateOperationsInput | boolean
    lastSnmpData?: NullableStringFieldUpdateOperationsInput | string | null
    lastSnmpSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    syncError?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUsername?: NullableStringFieldUpdateOperationsInput | string | null
    vpnStatus?: StringFieldUpdateOperationsInput | string
    vpnIp?: NullableStringFieldUpdateOperationsInput | string | null
    vpnLastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronDeviceUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutKronDevicesNestedInput
    readings?: KronReadingUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readings?: KronReadingUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type KronDeviceUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serial?: StringFieldUpdateOperationsInput | string
    mqttTopic?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KronReadingCreateManyDeviceInput = {
    id?: string
    receivedAt?: Date | string
    voltageA?: number | null
    voltageB?: number | null
    voltageC?: number | null
    currentI1?: number | null
    currentI2?: number | null
    currentI3?: number | null
    activePowerTotal?: number | null
    powerFactor1?: number | null
    powerFactor2?: number | null
    powerFactor3?: number | null
    energyActivePos?: number | null
    energyActiveNeg?: number | null
    rawPayload?: string | null
  }

  export type KronReadingUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KronReadingUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KronReadingUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voltageA?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageB?: NullableFloatFieldUpdateOperationsInput | number | null
    voltageC?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI1?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI2?: NullableFloatFieldUpdateOperationsInput | number | null
    currentI3?: NullableFloatFieldUpdateOperationsInput | number | null
    activePowerTotal?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor1?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor2?: NullableFloatFieldUpdateOperationsInput | number | null
    powerFactor3?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActivePos?: NullableFloatFieldUpdateOperationsInput | number | null
    energyActiveNeg?: NullableFloatFieldUpdateOperationsInput | number | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
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