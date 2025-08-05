# RSS API

Unofficial RSS feeds for various services.  
All endpoints are [here](https://rss.oto.im/).

## Nginx Example
```conf
server {
    listen 80;
    listen [::]:80;

    server_name %DOMAIN%;

    location / {
        proxy_pass http://localhost:%PORT%;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
