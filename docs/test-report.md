# End-to-end QA report

**Date:** 4 August 2026  
**Status:** PASS for the scoped browser suite  
**Final result:** 25 passed, 0 failed (21.2 seconds)

## Environment

- Next.js development server already running at `http://localhost:3000`;
- Node.js `v24.18.0`;
- Playwright `1.62.1` using the installed Google Chrome channel;
- Windows local test host;
- four Playwright workers.

The committed Playwright configuration normally starts an isolated server at
`http://127.0.0.1:3107`. Because another Next.js process already held this
workspace's development lock, the final run used `PLAYWRIGHT_BASE_URL` to reuse
the existing `localhost:3000` server. No process was stopped or replaced.

## Commands and results

```powershell
npm.cmd run typecheck
# PASS: tsc --noEmit

$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:PLAYWRIGHT_BROWSER_CHANNEL='chrome'
npm.cmd run test:e2e
# PASS: 25 passed (21.2s)

npm.cmd run build
# PASS: 26 static pages generated; dynamic /api/waitlist retained

$env:PORT='3200'
npm.cmd start
# PASS: standalone server returned 200 for en-GB, es-ES, a direct nested
# route, and a generated CSS asset; the smoke-test process was then stopped
```

On failure, traces and screenshots are retained under `test-results/`; the HTML
report is generated under `playwright-report/`. Both directories are ignored by
Git. Video is optional and can be enabled with `PLAYWRIGHT_VIDEO=1` when the
Playwright FFmpeg bundle is installed.

## Coverage

| Area | Result | Assertions |
| --- | --- | --- |
| Localised homepages | PASS | `/en-GB` and `/es-ES` return 200, render the correct H1, title, main content, waitlist form, and document language. |
| Routing | PASS | `/` redirects to `/en-GB`; direct loads and hard refreshes of `/en-GB/privacy` and `/es-ES/guides` return 200. |
| Mobile navigation | PASS | Opens at 390px, exposes dialog state, moves focus into the modal, locks body scroll, closes on Escape, and restores opener focus. |
| Locale switch | PASS | Changes route, `html[lang]`, translated H1, and reverse-language control. |
| Feature tabs | PASS | Filters cards and supports Arrow, Home, and End roving-keyboard selection. |
| Simulated scan | PASS | Valid URL enters progress, reaches the demonstration result, and resets. |
| Comparison control | PASS | Range input responds to ArrowRight, Home, and End and updates accessible value text. |
| Reduced motion | PASS | Media preference is honoured, smooth scrolling is disabled, and the scan completes without a timed sequence. |
| Waitlist client validation | PASS | Invalid email and missing privacy consent show local errors, focus the email field, and do not call the API. |
| Waitlist success and duplicate | PASS | Mocked `201 registered` and `200 already_registered` responses render the correct local states. |
| Attribution payload | PASS | Email normalisation, referral URL, referral code, and all five UTM fields are captured in the mocked POST body. |
| Runtime errors | PASS | Both localised homepages render and scroll to the waitlist without browser console errors or uncaught page errors. |
| Horizontal overflow | PASS | Both locales stay within the page viewport at 375, 430, 768, 1024, and 1440px (1px fractional-layout tolerance). |

## Finding closed during QA

The first hydrated run found that opening the mobile modal could leave focus on
the menu opener. The navigation now mounts an animated modal surface, moves
focus to its explicit close control, traps focus, and returns focus on Escape.
The regression test passes consistently.

## Boundaries and remaining release checks

- Waitlist success and duplicate tests mock `/api/waitlist`; they do not contact
  production Supabase or Resend and do not validate email delivery.
- Browser automation used the development server. A separate Windows
  standalone-server smoke test passed, but the bundle has not yet run behind
  Namecheap's Linux Apache/Passenger layer.
- Performance budgets, visual-regression baselines, cross-browser engines, and
  automated axe scans are outside this initial suite.
- Before release, follow `docs/namecheap-deployment.md`, build the standalone
  artifact on compatible Linux, and repeat the listed production smoke tests.

No deployment, upload, DNS change, or external production write was performed.
