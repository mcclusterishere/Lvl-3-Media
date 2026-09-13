# LEVEL 3 MEDIA

Level 3 Media is a McCluster satellite product. The authoritative ecosystem repository is `mcclusterishere/mccluster`; the legacy `mcclusterishere/Here` repository is not authoritative.

## Public surfaces

- Website: `https://mcclusterishere.github.io/Lvl-3-Media/`
- Digital store: `https://mcclusterishere.github.io/Lvl-3-Media/shop.html`
- Owner Console: `https://mcclusterishere.github.io/Lvl-3-Media/dashboard.html`
- Secure post-purchase delivery: `download.html?session_id=...`

## Owner Console

The Level 3 owner can operate the business without McCluster administrator intervention after the one-time owner claim:

- create/use a canonical McCluster ecosystem account;
- choose a globally unique **McCluster ID** and sign in with McCluster ID + password;
- update the McCluster ID through the canonical McCluster identity contract;
- change the password;
- connect/finish the Level 3 Stripe payout account;
- choose and self-manage the Level 3 platform subscription;
- upload private digital products such as LUT packs and ZIP files;
- upload public product cover art;
- set title, slug, descriptions, version, price, and publish state;
- publish/unpublish/archive products;
- change prices;
- inspect orders, customers, gross revenue, and platform fees;
- issue refunds; full refunds revoke digital-download entitlements;
- manage store name, description, support email, terms, refund policy, and storefront availability.

A **McCluster ID is an ecosystem identity, not a Level 3-specific username**. The person chooses it and it is globally unique case-insensitively. Level 3 consumes the canonical McCluster identity; it does not create a competing identity namespace. Changing the public McCluster ID does not change the immutable person/account UUID or historical records.

Level 3's role is isolated to the Level 3 organization/app. It grants no authority over McCluster or any other satellite/customer ecosystem.

## Billing gate

Commerce is server-gated by the Level 3 platform subscription. The UI is not the security boundary.

Current plans:

| Plan | Monthly rent | McCluster share of Level 3 digital-product gross sales |
| --- | ---: | ---: |
| Standard | $33.00 | 0% |
| Hybrid | $16.50 | 50% |

If billing becomes inactive/canceled/unpaid, the public product query and checkout stop serving purchases. Existing business data remains stored.

The Hybrid revenue split is calculated server-side and passed to Stripe as an application fee. A browser cannot choose or override the fee.

## Payments and payouts

Level 3 uses its own Stripe connected account for product sales. The customer is buying Level 3's product; product checkout runs as a direct charge against the connected account. McCluster supplies the software/platform and, for the Hybrid plan, collects the configured application fee.

Platform rent is billed separately through McCluster's Stripe account with Stripe Billing. The owner can manage payment methods/cancellation through Stripe's Customer Portal.

## Digital fulfillment

Paid source files are stored in private Supabase Storage bucket `l3-product-files`. They are never published as permanent public URLs.

After Stripe confirms a paid Checkout Session:

1. the order is marked paid;
2. an entitlement is created;
3. `l3-download` verifies the paid session against the Level 3 connected account;
4. the function returns a short-lived signed storage URL (5 minutes);
5. download counts and security telemetry are recorded;
6. full refunds and disputes revoke the entitlement.

Public cover images use the separate `l3-public` bucket.

## McCluster / Supabase integration

Canonical Supabase project: `zmnhbrjyhxzhkxmhkexs`.

Level 3-specific database objects include:

- `l3_store_settings`
- `l3_products`
- `l3_orders`
- `l3_entitlements`
- `l3_download_events`
- `l3_owner_invites`
- `l3_activity`
- `l3_auth_attempts`

Level 3 also participates in canonical McCluster objects such as `m_people`, `m_auth_user_links`, `platform_profiles`, `platform_apps`, `platform_user_apps`, `orgs`, `org_members`, `org_stripe_accounts`, `platform_fee_policies`, and `stripe_events`.

`m_people.id` is the immutable ecosystem person key; `platform_profiles.mccluster_id` is the canonical human-facing McCluster identifier. The previous `cluster_id` name is retired.

The broader McCluster Network foundation is canonical in the McCluster repo (`docs/architecture/identity-network.md`) and uses `network_profiles`, `network_follows`, `network_posts`, `network_reactions`, and `network_activity`. Level 3 may publish approved activity into that network later, but it does not own the social graph.

Edge functions:

- `l3-login` — McCluster ID authentication bridge with rate limiting
- `l3-subscribe` — paid platform-plan Checkout
- `l3-portal` — Stripe Billing Portal
- `l3-connect-onboard` — Level 3 Stripe payout onboarding
- `l3-checkout` — server-priced product Checkout and plan fee enforcement
- `l3-download` — payment verification + signed fulfillment
- `l3-refund` — owner-authorized refunds and entitlement revocation
- canonical `stripe-webhook` — subscription, payment, payout-account, refund, dispute and entitlement lifecycle

## Security boundaries

- Paid source files are private.
- Row Level Security scopes owner/staff reads and writes to Level 3.
- Public products are readable only when published **and** the paid storefront is active.
- Owner billing fields are not writable from the browser.
- Connected Stripe account IDs and fee policy are resolved server-side.
- Stripe/Supabase service-role secrets exist only in server-side Edge Functions.
- McCluster ID login is rate-limited and never reveals the owner's underlying email address.
- Full refund/dispute events revoke delivery entitlement.

## Agent law

Read `AGENTS.md` before architectural work. `mcclusterishere/mccluster` is the ecosystem authority. `mcclusterishere/Here` is legacy and must never be treated as the source of truth.
