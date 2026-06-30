# RSS API

Unofficial RSS feeds for various services.

## API URL

``` {.code-container}
%API_DOMAIN%
```

## Available endpoints

### Connpass User Events

Returns an RSS feed of events a user has signed up for on connpass.

#### API URL for connpass

``` {.code-container}
%API_DOMAIN%/api/connpass?user=
```

::: description

Endpoint: `/api/connpass`  
Method: `GET`  
Param:

- `user<string>` - connpass Username

:::

### GitHub User Repositories

Returns an RSS feed based on a list of public repository for GitHub users.

#### API URL for GitHub

``` {.code-container}
%API_DOMAIN%/api/github?user=
```

::: description

Endpoint: `/api/github`  
Method: `GET`  
Param:

- `user<string>` - GitHub Username

:::

### X (Twitter) User Tweets

Returns an RSS feed of a user's tweets via FxTwitter.

#### API URL for X (Twitter)

``` {.code-container}
%API_DOMAIN%/api/twitter?user=
```

::: description

Endpoint: `/api/twitter`  
Method: `GET`  
Param:

- `user<string>` - X (Twitter) Username
- `count<number>` - Number of items to fetch (1–100, default: 90)
- `with_replies<0|1>` - Include replies (default: 0)
- `safe<0|1>` - Hide sensitive content (default: 0)
- `lang<string>` - Translate tweets to this language code (e.g. `ja`, `en`)
- `media<0|1>` - Return media posts only (default: 0)

:::

### NPM User Packages

Returns an RSS feed of a user's NPM packages.

#### API URL for NPM

``` {.code-container}
%API_DOMAIN%/api/npm?user=
```

::: description

Endpoint: `/api/npm`  
Method: `GET`  
Param:

- `user<string>` - NPM Username

:::
