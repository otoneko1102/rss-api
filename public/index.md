# RSS API

Unofficial RSS feeds for various services.

## API URL

``` {.code-container}
%API_DOMAIN%
```

## Available endpoints

### Connpass User Events

Returns an RSS feed of events a user has signed up for on connpass.

::: description

Endpoint: `/api/connpass`  
Method: `GET`  
Param:

- `user<string>` - connpass Username

:::

``` {.code-container}
%API_DOMAIN%/api/connpass?user=example
```

### GitHub User Repositories

Returns an RSS feed based on a list of public repository for GitHub users.

::: description

Endpoint: `/api/github`  
Method: `GET`  
Param:

- `user<string>` - GitHub Username

:::

``` {.code-container}
%API_DOMAIN%/api/github?user=example
```

### NPM User Packages

Returns an RSS feed of a user's NPM packages.

::: description

Endpoint: `/api/npm`  
Method: `GET`  
Param:

- `user<string>` - NPM Username

:::

``` {.code-container}
%API_DOMAIN%/api/npm?user=example
```
