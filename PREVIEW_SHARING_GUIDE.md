# iFarm Preview Sharing Guide

## Recommended method

For a temporary, access-restricted review, serve the production build locally and, only after explicit approval, expose that loopback-only preview through a Cloudflare Quick Tunnel with an email allow-list.

The current Cloudflare `cloudflared` supports email-restricted Quick Tunnels with one-time PIN authentication. Quick Tunnel URLs are temporary and stop working when the `cloudflared` process stops. See [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) and [Cloudflare's protected Quick Tunnel announcement](https://developers.cloudflare.com/changelog/post/2026-10-02-protected-quick-tunnels/).

This guide documents the setup only. **No tunnel was created, no external URL was generated, and no site was deployed.**

## Requirements

- Install or update `cloudflared` from Cloudflare's official instructions.
- Use a recent version that supports `--allowed-mail`.
- Have the testers' email addresses in advance.
- Obtain explicit approval before starting the tunnel or sharing its URL.

The app itself does not require a public domain for a Quick Tunnel. A named tunnel with Cloudflare Access is an option for recurring reviews, but it requires an account and a domain managed through Cloudflare; Access can allow only explicitly listed emails. See [Cloudflare Access self-hosted applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/).

## Start the production preview

In Terminal 1, from the project root:

```sh
npm --prefix apps/web run build
npm --prefix apps/web run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

The preview listens only on the local machine at `http://127.0.0.1:4173`. Keep this terminal running.

## Start an email-restricted temporary tunnel

After explicit approval, run in Terminal 2:

```sh
cloudflared tunnel --url http://127.0.0.1:4173 --allowed-mail 'tester1@example.com,tester2@example.com'
```

Replace the example addresses with the exact tester emails. `cloudflared` prints the temporary HTTPS URL. Share it only with the allow-listed testers. They authenticate with a one-time PIN sent by email. Confirm that the installed `cloudflared` supports `--allowed-mail` before sharing; an unrestricted Quick Tunnel URL can be accessed by anyone who obtains it.

## Stop and revoke the preview

Press `Ctrl+C` in the `cloudflared` terminal. This closes the external route and the temporary URL stops working. Also press `Ctrl+C` in the Vite preview terminal. No DNS record, persistent tunnel, remote, or deployment is created by this Quick Tunnel command.

## Security and tester scope

- The Vite development server now binds to `127.0.0.1` by default. Do not tunnel the development server.
- The production preview serves the built frontend, not the source tree or development endpoints. Vite source maps are not enabled in the current build configuration.
- A tunnel still makes the preview externally reachable; email gating reduces access but does not make the URL private to its recipients if they share it or their authenticated session.
- Anything shipped in the production bundle or public assets can be viewed or downloaded by an authorized tester. Do not place secrets or private data in the frontend build.
- The sign-in and interest/contact forms are frontend-only and do not save or send submissions. Testers should use sample data and must not enter real credentials or sensitive farm information.
- Testers can view and interact with the rendered frontend, switch languages, use navigation, and exercise client-side form validation. They cannot access the local filesystem, backend services, or production data through this preview.
- This is a temporary preview, not production hosting. For repeated access, configure a named tunnel and a Cloudflare Access application with an explicit Allow policy for tester emails; never use an unrestricted public route for private review.
