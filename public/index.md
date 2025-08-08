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
%API_DOMAIN%/api/github?user=example
```

::: description

Endpoint: `/api/github`  
Method: `GET`  
Param:

- `user<string>` - GitHub Username

:::

### NPM User Packages

Returns an RSS feed of a user's NPM packages.

#### API URL for NPM

``` {.code-container}
%API_DOMAIN%/api/npm?user=example
```

::: description

Endpoint: `/api/npm`  
Method: `GET`  
Param:

- `user<string>` - NPM Username

:::
