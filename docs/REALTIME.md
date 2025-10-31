# Realtime / Broadcasting Guide

This document explains how to enable and test real-time messaging and queued broadcasts for SafeTalk locally and on Render.

## Recommended env vars
Set the following environment variables in your hosting provider (Render dashboard or `render.yaml`) or in your local `.env` when testing with Pusher/laravel-websockets.

- BROADCAST_DRIVER=pusher
- PUSHER_APP_ID=your_pusher_app_id
- PUSHER_APP_KEY=your_pusher_app_key
- PUSHER_APP_SECRET=your_pusher_app_secret
- PUSHER_APP_CLUSTER=your_pusher_cluster (optional)

For the front-end (Vite), set matching VITE_ variables so Echo initializes in the browser:

- VITE_PUSHER_APP_KEY=your_pusher_app_key
- VITE_PUSHER_APP_CLUSTER=your_pusher_cluster
- VITE_PUSHER_HOST=your_host (if using a self-hosted websocket server)
- VITE_PUSHER_PORT=6001 (example)
- VITE_PUSHER_FORCE_TLS=false (or true for TLS)

Note: If you use Pusher as a hosted provider, use their provided credentials and set `VITE_PUSHER_FORCE_TLS=true`.

## Running locally with laravel-websockets (development)
1. Install the package if you don't already have it:

   composer require beyondcode/laravel-websockets --dev

2. Publish the config and migrations and run migrations:

   php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
   php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"
   php artisan migrate

3. Update `.env` for local testing:

   BROADCAST_DRIVER=pusher
   PUSHER_APP_ID=local
   PUSHER_APP_KEY=local
   PUSHER_APP_SECRET=local
   PUSHER_APP_CLUSTER=mt1

   VITE_PUSHER_APP_KEY=local
   VITE_PUSHER_APP_CLUSTER=mt1
   VITE_PUSHER_HOST=127.0.0.1
   VITE_PUSHER_PORT=6001
   VITE_PUSHER_FORCE_TLS=false

4. Start laravel-websockets in a terminal:

   php artisan websockets:serve

5. Start the Laravel dev server and Vite in parallel (two terminals):

   # Terminal 1
   php artisan serve --host=127.0.0.1 --port=8000

   # Terminal 2
   npm run dev

6. Open two browsers (or an incognito window) and log in as two different users. Verify:
   - Starting a conversation from search creates a new session and it appears in the conversation list.
   - Sending messages updates both sides in real-time.
   - Opening the conversation marks messages read and clears unread counts.

## Enabling queued broadcasts in production (Render)
If you mark events as `ShouldQueue` (the codebase already does this for some events), you must run a queue worker in production.

1. Add/enable a worker service on Render (or other host) to run:

   php artisan queue:work --sleep=3 --tries=3

2. Ensure the following env vars are set (Render dashboard or `render.yaml`):

- QUEUE_CONNECTION=database (or redis if you use Redis)
- DB_CONNECTION=postgres (or your chosen DB)
- BROADCAST_DRIVER=pusher
- PUSHER_APP_ID / PUSHER_APP_KEY / PUSHER_APP_SECRET / PUSHER_APP_CLUSTER
- VITE_PUSHER_* matching values for client

3. If using `database` queue driver, you must run migrations and ensure the `jobs` table exists.

## render.yaml hints
- `render.yaml` in this repo already contains recommended env var names and a commented `worker` service example. To enable the worker, uncomment the worker block and set env vars appropriately.

## Troubleshooting
- If Echo isn't initialized in the browser, ensure `VITE_PUSHER_APP_KEY` is set and Vite has been rebuilt.
- If broadcasts are not delivered in production, check `queue:failed` and worker logs.
- If you use a self-hosted websockets server, ensure `VITE_PUSHER_HOST`/`PORT` and `VITE_PUSHER_FORCE_TLS` are consistent with the server.

## Next steps
- (Optional) Add an E2E test harness (Cypress/Playwright) to automate the browser smoke tests.
- (Optional) Configure Redis on Render for lower-latency pub/sub and queue handling.

If you want, I can:
- Uncomment and configure the worker in `render.yaml` for you (requires confirmation).
- Run a local websockets demo using `laravel-websockets` and exercise the flows end-to-end.
- Create an integration test for read-receipts and queued broadcasts.

## Alternative: laravel-echo-server (Node) + Redis

If `beyondcode/laravel-websockets` isn't installable for your PHP/Laravel versions, an alternative is `laravel-echo-server` (Node) which listens to Redis pub/sub and serves socket.io connections.

Quick setup:

1. Start Redis (Docker recommended):

```powershell
docker run -d --name redis -p 6379:6379 redis:7
```

2. Install `laravel-echo-server` (globally or dev dep):

```powershell
# global
npm install -g laravel-echo-server
# or dev dependency
npm install --save-dev laravel-echo-server
```

3. The repo includes a `laravel-echo-server.json` configured for local development. Start it with:

```powershell
npm run echo-server
# or if installed globally:
laravel-echo-server start
```

4. Ensure Laravel uses Redis for broadcasting (or publishes to Redis) so the echo server can receive events. Typical settings in `.env` for this flow:

```
BROADCAST_DRIVER=redis
QUEUE_CONNECTION=database
REDIS_HOST=127.0.0.1
```

5. Configure Vite client envs so the browser connects to the echo server (already present in `.env` placeholders):

```
VITE_ECHO_DRIVER=socket
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_FORCE_TLS=false
```

6. Start Laravel and Vite and open two browsers to test real-time messaging.

Notes:
- `laravel-echo-server` expects Redis to be available and that Laravel broadcasts to Redis. Adjust `config/broadcasting.php` accordingly.
- This approach avoids modifying PHP composer dependencies and is a practical local dev setup.
