# Manual Namecheap cPanel deployment

This runbook deploys NegoTrack as a real Node.js application. It does **not**
upload files, change DNS, create a cPanel application, or start production
automatically. A person must review the release, transfer it, configure cPanel,
and approve the final start or restart.

## Deployment choice

Use the existing `output: "standalone"` build and start its generated
`server.js` from Namecheap's **Setup Node.js App** screen. This is the preferred
path because the project includes the dynamic `POST /api/waitlist` route;
NegoTrack cannot be deployed as a static export without removing that backend.

Next.js 16 requires Node.js `>=20.9.0`. Select Node.js 22 in cPanel unless the
account offers a different supported version that has already been validated.
The current Namecheap shared-hosting selector lists Node.js 20, 22, and 24.

## Before building

1. Confirm the production domain or subdomain is connected to the Namecheap
   hosting account and has working HTTPS.
2. Apply `supabase/migrations/20260804120000_create_waitlist_signups.sql` to the
   production Supabase project as described in `docs/waitlist-setup.md`.
3. Set `NEXT_PUBLIC_SITE_URL` in the Linux build environment to the exact public
   HTTPS origin, without a trailing slash. It is compiled into canonical,
   Open Graph, robots, and sitemap output and cannot be corrected later by only
   changing the cPanel runtime environment.
4. From a clean release checkout, run the manual release gates:

   ```bash
   npm ci
   npm run lint
   npm run typecheck
   npm run test:e2e
   npm run build
   ```

5. Stop if any gate fails. Do not use an old `.next` directory after a failed
   build.

### Build on Linux

Namecheap cPanel runs Linux. Build the standalone bundle in a compatible Linux
environment (for example WSL2, a Linux CI release job, or the cPanel Node.js
virtual environment) using the same Node.js major version selected in cPanel.
Do not upload a `.next/standalone` directory built with Windows dependencies;
native packages such as Sharp are platform-specific.

If the shared-hosting account does not have enough memory to build Next.js,
build in Linux elsewhere and upload only the release bundle. This is still a
manual deployment: the build job must not hold cPanel credentials or publish
the result.

## Create the standalone release bundle

After a successful Linux `npm run build`, the project's `postbuild` script
copies `public/` and `.next/static/` into the generated standalone directory.
Stage that self-contained directory:

```bash
rm -rf release
mkdir release
cp -a .next/standalone/. release/
(cd release && zip -r ../negotrack-standalone.zip .)
```

Inspect the archive before uploading. Its root must contain:

```text
server.js
package.json
node_modules/
public/
.next/
  server/
  static/
```

The archive must not contain `.env`, `.env.local`, source-control data, test
artifacts, or production credentials. Keep the ZIP and the build log as the
release record.

## Create the cPanel application

1. In **cPanel → File Manager**, create a versioned application directory
   outside `public_html`, for example `~/apps/negotrack-20260804-01`.
2. Upload `negotrack-standalone.zip` to that directory and extract it there.
   Enable **Show Hidden Files** and verify the extracted `.next` directory is
   present.
3. Open **cPanel → Setup Node.js App → Create Application** and use:

   | Setting | Value |
   | --- | --- |
   | Node.js version | `22` (or the validated compatible version) |
   | Application mode | `Production` |
   | Application root | the versioned directory, without `public_html` |
   | Application URL | the production domain at `/` |
   | Application startup file | `server.js` |

4. Do not click **Run NPM Install** for a complete standalone bundle. The traced
   runtime dependencies are already in its `node_modules` directory.
5. Add the environment variables below, then start the app. The generated
   server reads cPanel's assigned `PORT`; do not hard-code a public port.
   `HOSTNAME` defaults to `0.0.0.0` in the generated server and normally does
   not need to be added.

## Production environment variables

Configure secrets through **Setup Node.js App → Environment Variables**, not in
an uploaded `.env` file.

| Variable | Production value and handling |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required at build time and runtime. Exact canonical HTTPS origin, for example `https://www.negotrack.com`, with no trailing slash. The cPanel value must match the value used for `npm run build`. |
| `SUPABASE_URL` | Required. The production Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required. Server-only service-role key. Never prefix it with `NEXT_PUBLIC_` or expose it in browser code. |
| `RESEND_API_KEY` | Optional. Add only when confirmation email is enabled. |
| `WAITLIST_FROM_EMAIL` | Required when `RESEND_API_KEY` is set. Use a Resend-verified sender such as `NegoTrack <updates@example.com>`. |
| `WAITLIST_PRIVACY_NOTICE_VERSION` | Recommended. Currently `2026-08-04`; update it when the notice changes materially. |
| `WAITLIST_TRUST_PROXY_HEADERS` | Keep `false` by default. Set `true` only after Namecheap confirms its proxy overwrites the forwarded client-IP headers and direct access to the Node.js origin is blocked; otherwise callers can spoof those headers to evade client rate limits. |

Production intentionally fails closed with HTTP `503` if the two Supabase
variables are missing or invalid. Resend is optional, but its two variables
must be configured as a pair. Restart the cPanel application after any
environment-variable change.

`NEXT_PUBLIC_SITE_URL` is embedded during `npm run build`; changing it only in
cPanel will not rewrite an existing browser bundle or already generated route
metadata. Rebuild and redeploy whenever the canonical origin changes.

## Routing and direct refreshes

The Application URL must point at the domain root so Apache/Passenger forwards
all paths to Next.js, including API and localised routes. Do not add a static
single-page-app rewrite to `index.html`; it would bypass App Router routing and
break `/api/waitlist`.

After starting or restarting, directly request and refresh all of these URLs:

- `/` (must redirect to `/en-GB`);
- `/en-GB` and `/es-ES`;
- `/en-GB/privacy`;
- `/es-ES/guides`;
- `/_next/static/...` assets loaded by the page;
- the waiting-list form, with an approved production smoke-test address.

A direct refresh of a nested route must return the Next.js page, not the cPanel
404 page. If it does not:

1. confirm the cPanel Application URL is the domain root and the Application
   root contains `server.js`;
2. confirm `.next/server` and `.next/static` survived upload and extraction;
3. restart the application and inspect its cPanel error log;
4. check that the domain is assigned to the Node.js application rather than a
   separate static document root;
5. ask Namecheap Support to verify the Passenger mapping before adding custom
   `.htaccess` proxy rules.

## Manual release and rollback

For an update, build and upload a new versioned directory. Do not extract over
the running release. Stop the cPanel app, change its Application root to the new
directory, verify `server.js` and the environment variables, then start it and
run the smoke checks. Keep the previous release until the new one is accepted.

To roll back, stop the app, point its Application root back to the previous
versioned directory, restart it, and repeat the smoke checks. Database changes
need their own reviewed rollback plan; switching application files does not
undo a Supabase migration.

## `npm start` alternative

On a VPS or dedicated server with a process manager, the full source build can
be run with `npm run build` followed by `npm start`. That path requires the full
production `node_modules` tree and a reverse proxy. Namecheap's shared-hosting
**Setup Node.js App** asks for a JavaScript startup filename rather than an npm
command, so its generated standalone `server.js` is the clearer supported
entry point for this project.

## References

- [Namecheap: deploy a Next.js application in cPanel](https://www.namecheap.com/support/knowledgebase/article.aspx/10686/29/how-to-deploy-reactjs-vitejs-react-native-and-nextjs-applications-in-cpanel/)
- [Namecheap: work with Setup Node.js App](https://www.namecheap.com/support/knowledgebase/article.aspx/10047/2182/how-to-work-with-nodejs-app/)
- [Next.js: standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Next.js: self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
