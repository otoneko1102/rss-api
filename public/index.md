# RSS API

Unofficial RSS feeds for various services.

## API URL


``` {.code-container}
%API_DOMAIN%
```

## Available endpoints

### GitHub User Repositories

Returns an RSS feed based on a list of public repository for GitHub users.

::: description

Endpoint `/api/github`  
Method:`GET`  
Param:
- `user<string>` - GitHub Username
- `language<string | null>` - Language Code

:::

### NPM User Packages

Returns an RSS feed of a user's NPM packages.

::: description

Endpoint: `/api/npm`  
Method: `GET`  
Param:
- `user<string>` - NPM Username
- `language<string | null>` - Language Code

:::
