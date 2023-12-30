Config Simple
============================================================================================

This library presents a simple configuration system that works for both front-end and back-end services.

**Goals:**

1. We want our config definitions to be simple, readable and well-typed.
2. We want to consume config via a frozen `config` constant, like `config.my.value`, and we want the types to be
   readable and accurate;
3. We do not need/want to update or alter config at runtime (config updates should require an env var update and a
   reboot of the container);
4. We want to coerce certain config strings into other types in the app (e.g., "false" → false);
5. We want to allow certain configs to be undefined but require values for others;
6. We want to support certain secret stores (e.g., kubernetes) that provide secrets via files mounted into the
   container.
7. We want our system to work in both node and browser.

>
> **NOTE: See also [Config Node](https://github.com/wymp/config-node) ([pkg](https://www.npmjs.com/package/@wymp/config-node))
> for an alternative config system for node.**
>


## Usage

```ts
// src/config.ts
import { ConfigError, configValue, REQUIRED, validate, Validators } from "@wymp/config-simple";

// The `configValue` function returns any of the following:
//
// * the type indicated ("num" => number, "str" => string, "bool" => boolean, etc.)
// * undefined (if allowed)
// * An error string starting with ::ERROR::
//
// We use `configValue` to define/coerce our values

enum ENVS = {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}
const env = configValue('APP_ENV', REQUIRED, Validators.oneOf(Object.values(ENVS))) as ENVS | ConfigError;

const configDef = {
  env,

  // required number defaulting to 1234 coming from var/file PORT
  port: configValue("PORT", "num", 1234),

  db: {
    // non-required string (default undefined) coming from DATABASE_URL
    url: configValue(["DATABASE_URL", "OTHER_POSSIBLE_DB_URL"], "str"),
    // hard-coded; cannot change
    type: "postgres" as const,
    port: 5432,
  },

  services: {
    // non-required string
    myAuthServiceUrl: configValue("AUTH_SERVICE_URL", "str"),
    // non-required boolean defaulting to false
    stubAuthService: configValue("STUB_AUTH_SERVICE", "bool", false),
    // required number with no default
    somethingNonOptional: configValue("SOME_THING", "num", REQUIRED),
  },

  someOtherVal: configValue(
    "SOME_OTHER_THING",
    [
      Validators.requiredForEnv(env, [ENVS.STAGING, ENVS.PRODUCTION]),
      Validators.httpHost
    ]
  ),
}

// The type of configDef is now
// {
//   env: ENVS | ConfigError;
//   port: number | ConfigError;
//   db: {
//     url: string | undefined;
//     type: "postgres";
//     port: number;
//   };
//   services: {
//     myAuthServiceUrl: string | undefined;
//     stubAuthService: boolean | ConfigError;
//     somethingNonOptional: number | ConfigError;
//   },
//   someOtherVal: string | undefined | ConfigError
// }
//
// Now we run the config def through the validator to get the final config
//
// This throws an error if there are any `::ERROR::` values; otherwise, returns a frozen object with all types excluding
// the `::ERROR::${string}` template type.

export const config = validate(configDef);

// Alternatively, if we don't want to throw, we can do this:
const result = validate(configDef, "dont-throw");
if (result.t === "error") {
  console.error(`CONFIG ERRORS:\n\n  * ${result.errors.join("\n  * ")}`);
}

// NOTE: This config is typed as "clean" (without errors), but it may still have error strings. This can result in
// runtime issues (for example, trying to do math on a value that's supposed to be a number but really contains an error
// string). Use at your own risk.
export dirtyConfig = result.value;
```


### Usage With Weenie

This library is typically used to create an in-place, bespoke config object. Therefore, it's already sort of
Weenie-compatible out of the box.

Assuming the example above is in a file like `src/config.ts`, you would include it in your DI container like so:

```ts
// src/main.ts
import { config } from "./config";
import * as Weenie from "@wymp/weenie-framework";

const deps = Weenie.Weenie({ config })
  .and(Weenie.logger)
  .and(Weenie.mysql)
  .done(d => d);
```


### Usage With Environment-Specific Dot-Env Files

This library works well with a particular pattern of using dot-env files to modify config on a per-environment basis. To
facilitate this, you might add the following to the top of the `src/config.ts` file we were playing with in our example
above:

```ts
// src/config.ts
import { ConfigError, configValue, REQUIRED, validate, Validators } from "@wymp/config-simple";
import * as dotenv from "dotenv";

enum ENVS = {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}
const env = configValue('APP_ENV', ENVS.DEVELOPMENT, Validators.oneOf(Object.values(ENVS))) as ENVS | ConfigError;
[".env/local", `.env/${env}`].forEach(f => {
  if (existsSync(f)) {
    dotenv.config({ path: f });
  }
});

const configDef = {
  env,
  // ...
}
// ...
```

With this in place, you would then create the `.env` directory and populate it with files for each environment. For
example, you might have the following:

```sh
# .env/development
PORT=80
DATABASE_URL=postgres://postgres:5432/service-db
AUTH_SERVICE_URL=http://auth-service
STUB_AUTH_SERVICE=false
SOME_THING=2
SOME_OTHER_THING=http://other-thing
```

```sh
# .env/production
PORT=80
STUB_AUTH_SERVICE=false
```

etc...

This way, you can easily manage non-sensitive environment config as part of the codebase while still maintaining the
ability to easily override it with env vars should the need arise. Devs can also easily create a `.env/local` file to
override anything they may want to override locally.


### Usage In Front-End Codebases

Obviously front-end codebases don't have access to `process.env`. However, almost all modern systems provide _some_ way
of accessing `process.env` at build-time and using certain values to populate a simulated `process.env` object provided
at runtime. This often works via some sort of allowlist or prefix mechanism that signals to the build system which env
vars are ok to include in the app.

Because of this, you can still use this system on the front-end, provided your build system provides this sort of
`process.env` polyfill. Experiment to see what you have access to, and be ready to provide your own polyfill in the
event that your particular build system does not provide one.


### Usage As Deployment Prevalidation

It's often very useful to make sure your application has a valid config prior to deployment. You can fairly easily do
this with a script both front- and back-end that you run automatically pre-build (front-end) or pre-deploy (back-end).
For example, Heroku has a `release` stage that you can use for this, and Kubernetes has `init` containers that serve
a similar purpose.

In the simplest case, the script will simply execute the `src/config.ts` file, which should throw an error if you set it
up to throw. If you passed `dont-throw` to the `validate` function, then you should probe the result for validity and
throw from your prevalidation script if the config is invalid.


### Usage Tips and Tricks

Probably the most important piece of advice with this system is this:

**Only provide default values if the production value can safely be used as a default. If a given config key requires a
value and there is no production-safe default, use the `REQUIRED` symbol to mark the value required and then provide
env-specific overrides in the files under `.env/`**

This way, you will never deploy your production app with unsafe values, and if you implement deployment prevalidation as
indicated above, you will be unable to deploy your app with missing values. Thus, you can be fairly certain that if your
app has successfully deployed, it has a correct and sensible config.
