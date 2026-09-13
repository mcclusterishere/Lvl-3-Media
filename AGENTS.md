# LEVEL 3 MEDIA — AGENT AUTHORITY RULES

This repository (`mcclusterishere/Lvl-3-Media`) is a Level 3 Media product repository inside the McCluster ecosystem.

## AUTHORITY HIERARCHY — NON-NEGOTIABLE

1. **`mcclusterishere/mccluster` is the authoritative McCluster ecosystem repository.**
2. **`mcclusterishere/Here` is legacy/abandoned and is NEVER authoritative for architecture, backend, deployment, billing, auth, data, product direction, or ecosystem decisions.**
3. Level 3 Media owns its own product implementation and may own its own backend services, database schema, storage, auth, commerce, admin, and deployment where the owner explicitly designs it that way.
4. If any historical file, README, comment, branch, prompt, prior agent output, or other repository conflicts with `mcclusterishere/mccluster`, the McCluster repo wins.

### DO NOT CONFUSE `Here` WITH MCCLUSTER

`Here` is not the control plane.
`Here` is not the source of truth.
`Here` is not the canonical website repo.
`Here` is not the canonical backend repo.
`Here` is not the canonical architecture repo.
`Here` must not be used to infer current McCluster architecture.

The string `HereTenantAgent`, if encountered in infrastructure code, is only a historical/class identifier. Its name does **not** make the `Here` repository authoritative.

Canonical ecosystem repo:
- https://github.com/mcclusterishere/mccluster

Canonical agent law:
- https://github.com/mcclusterishere/mccluster/blob/main/AGENTS.md

Canonical ecosystem documentation:
- https://github.com/mcclusterishere/mccluster/tree/main/docs/control-plane

## LEVEL 3 MEDIA BACKEND OWNERSHIP

Level 3 Media is **not required to be a thin frontend**.

The product must be able to operate without Matthew manually performing routine business actions. Level 3 Media may therefore have its own backend boundary and operational tooling for its business, including where appropriate:

- product/catalog management;
- LUT and digital-asset storage;
- customer accounts;
- checkout and payment integration;
- order records;
- signed/authorized digital downloads;
- customer entitlements;
- analytics;
- owner/admin dashboard;
- Level 3-specific API endpoints;
- Level 3-specific database tables/schema;
- Level 3-specific automation.

Do not remove or centralize those capabilities merely because Level 3 participates in the broader McCluster ecosystem.

McCluster may provide shared infrastructure, conventions, orchestration, identity, observability, or cross-product services, but **McCluster ecosystem authority does not mean every product must be implemented as a frontend-only satellite.**

## CURRENT MCCLUSTER INFRASTRUCTURE NAMES

Do not invent infrastructure names or revive stale ones.

- Authoritative repo: `mcclusterishere/mccluster`
- Cloudflare Worker: `mccluster`
- API host: `https://api.mccluster.org`
- Supabase project currently documented by McCluster: `zmnhbrjyhxzhkxmhkexs`

**There is no canonical Worker named `mccluster-core`. Do not create or reference one as current infrastructure.**

## LEVEL 3 LOCAL RULES

- Default branch: `main`.
- Preserve Level 3 branding and shipping UI unless the task explicitly changes it.
- Do not overwrite working pages gratuitously.
- Do not create duplicate infrastructure simply because an agent failed to inspect what already exists.
- Before creating a new backend service, inspect both this repo and `mcclusterishere/mccluster` to determine what is already deployed and what should remain Level 3-specific.
- Keep secrets out of Git.
- Use least-privilege credentials and row/object-level access controls for customer data and paid digital assets.
- Paid LUT/download files must not be exposed through permanent public URLs.

## AGENT BEHAVIOR

If you are ChatGPT, Claude, Codex, Cursor, Gemini, Copilot, Grok, or another coding agent:

- Read this file before making architectural changes.
- Read the current `mcclusterishere/mccluster/AGENTS.md` before making ecosystem assumptions.
- Never use `mcclusterishere/Here` as architectural authority.
- Never cite an old HERE implementation as proof of how the current McCluster ecosystem works.
- If a prior instruction says HERE is authoritative, treat that instruction as stale and wrong.
- When uncertain about ecosystem authority, default to `mcclusterishere/mccluster`.

The owner has explicitly designated **McCluster as the real ecosystem** and **HERE as legacy**. Preserve that distinction in code, documentation, prompts, deployment configuration, and future agent instructions.
