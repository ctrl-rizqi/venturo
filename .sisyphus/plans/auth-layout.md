## Goal

Create a dedicated layout for `src/routes/auth/` that feels distinct from the main marketing pages while staying within the app's existing visual language.

## Read Code

- `src/routes/auth/_layout.tsx` is a placeholder route file for `/auth`.
- `src/routes/auth/index.tsx` is a placeholder route file for `/auth/`.
- `src/routes/__root.tsx` renders the global `Header` and `Footer` around all routes.
- `src/styles.css` already defines the design tokens, surfaces, typography, and animation styles used by the rest of the app.
- `src/routeTree.gen.ts` currently maps both auth files under the root route, so the implementation must be verified with build and diagnostics after editing.

## Proposed Changes

1. Update `src/routes/auth/_layout.tsx` to render an auth-specific shell for the `/auth` area using existing design tokens and route nesting primitives.
2. Update `src/routes/auth/index.tsx` so the auth page content fits naturally inside that shell and no longer uses placeholder starter content.
3. Keep the root route unchanged unless verification proves the auth layout does not render as intended.

## Constraints

- Scope is layout only; do not add auth logic, forms, validation, or API behavior.
- Reuse the current sea/lagoon visual system instead of introducing a separate theme.
- Keep the change low-risk and localized to the auth route files if possible.

## Verification

1. Run `lsp_diagnostics` on changed files and require zero new errors.
2. Run `pnpm build` to ensure the route structure and components compile.
3. If route generation updates tracked files, keep those generated changes.

## Risks

- The auth route/layout relationship may require `Outlet` and a build-generated route tree update to behave correctly.
- If `/auth` and `/auth/` do not compose as expected, root shell behavior may need a follow-up change.
