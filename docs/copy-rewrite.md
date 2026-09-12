# Kreebz Ltd — Site-Wide Copy Rewrite

**Direction (from interview):** Warm, personal, conversational standard English. Every page nudges one action — *reach out*. Four audiences (diaspora, Lagos HNWIs, owners, corporate). Differentiators to weave in: vetted listings only, diaspora-safe process, one principal contact, full-stack lifestyle. **No fabricated numbers or testimonials.** Make the jet visible.

**Global changes:**
- Kill corporate filler: "utmost," "paramount," "exacting," "orchestrate," "ecosystem" → plainer words.
- "Enquire" CTAs → warmer, clearer verbs ("Talk to us," "Start the conversation").
- "Principal" is a strong brand word — keep it, but use it where it *means* something (a named human who answers), not as decoration.
- Add a "PRIVATE JET" nav link + homepage feature section.

---

## 1. HOMEPAGE (`/`)

### Hero — `src/components/Hero.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `Exclusive Properties & Lifestyle Management · Lagos` | `Property, management & private aviation — Lagos` |
| Headline | `Own Prestige. We Manage the Rest.` | `Find the right property. Skip the hard part.` |
| CTA 1 | `Explore Bourdillon` | `Browse the portfolio` |
| CTA 2 | `Speak with a principal` | `Talk to a principal` |

**Rationale:** "Own Prestige" is clever but abstract — a first-time visitor can't tell what you *do*. The new line states the outcome plainly and the "skip the hard part" carries the managed-service promise in customer language. Eyebrow now names all three lines of business so the jet exists above the fold.

**Headline alternatives:**
- B: `The property you want. None of the work you don't.` — sharper contrast, more attitude
- C: `Your next home in Lagos — found, vetted, managed.` — most concrete, best for diaspora SEO

### Brand Statement — `src/components/BrandStatement.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `The Kreebz Philosophy` | `Why Kreebz` |
| Statement | `Curating the world's most extraordinary properties for a discerning few.` | `One call. One principal. Every detail of your property handled — from finding it to flying you home to it.` |

**Rationale:** The current line could belong to any luxury agency. The rewrite states the actual model — one accountable contact across the whole stack.

### Services — `src/components/Services.tsx`

| Element | Current | Proposed |
|---|---|---|
| Headline | `Our Services` | `Everything handled, end to end` |
| Body | `From pre-development through occupancy, we provide an extensive list of premium services…` | `Buying, selling, managing, or flying in — you deal with one team that knows your name, not a rotating cast of agents.` |
| Service 1 | `Buyers & Sellers` — `Access our exclusive off-market properties or list your premium asset with complete discretion.` | `Buy & Sell` — `Every listing is inspected and vetted before you see it. Selling? We place your property in front of qualified buyers, quietly.` |
| Service 2 | `Estate Owners` — `End-to-end facility management…` | `Property Management` — `Repairs, staff, compliance, tenants — handled before you have to ask.` |
| Service 3 | `Developers` — `Comprehensive advisory from feasibility…` | `Developers` — `From feasibility to launch, we market, sell, and manage what you build.` |
| Service 4 | `Residents` — `Support for current property residents.` | `Private Aviation` — `Charter light to heavy jets on your schedule — booked and confirmed through us.` |

**Rationale:** "Residents — support for current property residents" says nothing and hides the jet. Swapping the fourth card to aviation puts the jet on the homepage (your request) while residents are still covered by the concierge section below.

### NEW SECTION — Private Aviation feature (add between Services and Featured Project)

> **Eyebrow:** `Private Aviation`
> **Headline:** `Lagos to anywhere. On your schedule.`
> **Body:** `One-way charters, return trips, or a standing arrangement — tell us when and where, and we handle the aircraft, the paperwork, and the payment.`
> **CTA:** `See the fleet` → `/services/private-jet`

**Rationale:** The jet is currently buried under /services. A homepage feature section + nav link makes it a first-class offering and gives the "reach out" crowd a concrete reason to start a conversation.

### Featured Project — `src/components/FeaturedProject.tsx` + `src/data/bourdillon.ts`

| Element | Current | Proposed |
|---|---|---|
| Positioning | `A private residential development on Bourdillon Road, Ikoyi — designed, delivered, and managed under one principal.` | `A private residence on Bourdillon Road, Ikoyi — we designed it, we're building it, and we'll manage it after you move in.` |
| CTA 2 | `Request project information` | `Get the brochure` |

**Rationale:** Same meaning, plainer English, more concrete.

### Featured Properties — `src/components/FeaturedProperties.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `The Portfolio` | `The Portfolio` *(keep)* |
| Headline | `Curated Excellence` | `Every listing, personally vetted` |
| Card CTA | `View Residence` | `View this home` |
| Button | `View All Properties` | `See the full portfolio` |

**Rationale:** "Curated Excellence" is two buzzwords. The new headline makes the vetting claim — your strongest differentiator — the promise itself.

### How It Works — `src/components/HowItWorks.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `Choose Your Journey` | `Start here` |
| Headline | `How can we assist you today?` | `What do you need today?` |
| Buy | `Acquire exceptional properties off-market or from our curated portfolio.` | `Find a vetted home or investment — on-market or off-.` |
| Rent | `Lease premium residences with white-glove concierge support.` | `Rent a home that comes with a team behind it.` |
| Sell | `Discreetly market your asset to a qualified network of high-net-worth buyers.` | `Sell to qualified buyers without the public circus.` |
| Develop | `End-to-end advisory and management for ambitious luxury projects.` | `Build with a partner who markets, sells, and manages.` |
| Card CTA | `Explore` | `Start` |

### Testimonials — `src/components/Testimonials.tsx` ⚠️

**FLAG — verify before keeping.** Three named quotes ("Elena R.," "Jonathan K.," "Sarah O.") and you confirmed no proof assets are cleared for use. If these aren't real, attributable clients, replace with real ones or cut the section — fabricated testimonials are a legal and trust liability.

If verified: headline `Client Testimonials` → `What clients tell us`; eyebrow `Trusted by the best` → `In their words`.

### Brand Logos — `src/components/BrandLogos.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `Trusted Partnerships` | `Who we work with` |
| Headline | `Official Marketing & Facility Management Partners` | `Official partner to these developments` |
| Body | `We represent the most exclusive developments in Lagos, setting the standard for luxury real estate.` | `The names behind some of Lagos' most considered addresses trust us to market and manage them.` |

### Concierge CTA — `src/components/ConciergeCTA.tsx`

| Element | Current | Proposed |
|---|---|---|
| Headline | `Can't find what you're looking for?` | `Know exactly what you want?` |
| Body | `Our public portfolio represents only a selection…` | `Most of our best properties never get listed. Tell us what you're after and we'll source it — discreetly.` |
| CTA | `Request Matchmaking` | `Tell us what you need` |

**Rationale:** Flips a negative frame ("can't find") into a confident one and makes the off-market hook concrete.

### FAQ — `src/components/FAQ.tsx`

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `Clarity & Transparency` | `Straight answers` |
| A2 | `We guarantee a response within one business day. A dedicated principal is assigned…` | `Within one business day — from a named principal who stays on your file, not a shared inbox.` |
| A5 | `We partner with top-tier legal and financial institutions…` | `Every transaction goes through independent legal review and verified documentation before money moves. We can walk you through the exact checks before you commit.` |

**Add a new FAQ for the diaspora objection:**
> **Q:** `I'm abroad — how do I buy or manage property in Lagos safely?`
> **A:** `Most of our clients are. You get a named principal, verified documentation, and video walkthroughs before you commit a naira — and the same team manages the property after you buy.`

### Case Studies — `src/components/CaseStudies.tsx` ⚠️

**FLAG — same as testimonials.** "15% Below Market" and "40% Higher Retention" are specific numeric claims. Verify they're real or soften to: `Negotiated below market through developer relationships` / `Raised tenant retention and cut operating costs`.

If kept: headline `Case Studies` → `Recent work`; eyebrow `Proven Results` → `What we've done`; CTA `Discuss Your Needs` → `Talk it through with us`.

---

## 2. NAVIGATION — `src/components/Navigation.tsx`

- **Add `PRIVATE JET` link** → `/services/private-jet`, in the right-hand group before `CONCIERGE`.
- `ENQUIRE` button → **`TALK TO US`** (clearer, warmer, matches the "reach out" goal).
- Mobile menu primary links: add `PRIVATE JET` to `primaryLinks` array.

---

## 3. FOOTER — `src/components/Footer.tsx`

- Newsletter headline → `New listings, project updates, and the occasional insight — straight to your inbox.`
- Newsletter success → `You're on the list — talk soon.`
- `ADMIN PORTAL` link — consider removing from public footer (minor security/UX hygiene; the route stays at /admin).

---

## 4. PROPERTIES (`/properties`)

- Meta description → `Vetted homes and investments across Lagos — every listing inspected before you see it.`
- SearchBar headline `Luxury listings {status} in Lagos` → `Homes and investments {status} in Lagos` *(avoids the overclaimed "luxury")*
- Search placeholder → `Search by area, address, or property name`

---

## 5. SELL (`/sell`)

| Element | Current | Proposed |
|---|---|---|
| Headline | `List Your Asset` | `Sell without the noise` |
| Meta | `Discreetly market your premium asset…` | `Your property, shown to qualified buyers — not the whole internet.` |
| Step 1 headline | `Let's begin` | `Start here` |
| Step 1 body | `Your information is handled with the utmost confidentiality.` | `Everything you share stays between us.` |
| Step 2 headline | `About the Asset` | `Tell us about the property` |
| Submit | `Submit to Principals` | `Send it to a principal` |
| Success headline | `Inquiry Received` | `Got it — you're in.` |
| Success body | `Thank you for trusting Kreebz Ltd…` | `A principal will review your property and reach out within one business day.` |

**Rationale:** "Asset" is banker-speak; sellers think "my property." The new headline names the actual benefit (discretion) in their words.

---

## 6. MANAGEMENT (`/management`)

| Element | Current | Proposed |
|---|---|---|
| Title | `Living Perfected` | `Own it. We'll run it.` |
| Subtitle | `Your time is precious. We handle the operational complexity…` | `Repairs, staff, compliance, tenants — a named principal handles it all, and you get one number to call.` |
| Section | `Custodians of Your Legacy` | `Your property, kept to your standard` |
| Body 1 | `We understand that ultra-high-net-worth individuals have abundant wealth but scarce time. Kreebz positions itself as the solution to time poverty.` | `You didn't buy a second job. Managing a property shouldn't eat your week — that's our job.` |
| Body 2 | `We do not just clean and repair; we orchestrate a seamless luxury experience…` | `We don't just fix things. We keep your property ahead of problems — and report back before you have to ask.` |
| CTA headline | `Reclaim Your Time` | `Get your week back` |
| CTA body | `Let Kreebz handle the complexity…` | `Tell us about your property and we'll put together a management plan that fits.` |
| CTA button | `Request an Audit` | `Get a management plan` |

⚠️ Stat check: `24/7`, `100% Vetted Staff`, `<4h Response Time`, `NDA` — confirm these are commitments you actually make. `<4h` especially is a hard SLA; if it's aspirational, change to `Same day` or remove.

---

## 7. CONCIERGE (`/concierge`)

| Element | Current | Proposed |
|---|---|---|
| Title | `Luxury Beyond the Sale` | `More than property` |
| Subtitle | `Exclusive access, curated experiences, and private aviation…` | `Jets, off-market homes, reservations, contractors — if it touches your life or your property, ask us.` |
| Intro | `At Kreebz, we believe true luxury is the absence of friction…` | `The point of a concierge is simple: you ask once, it's done.` |
| Service 1 | `Private Aviation` — `Seamless global connectivity…` | `Private Aviation` — `Charter a jet on your schedule. We arrange the aircraft, handle the details, and confirm it end to end.` |
| Service 2 | `Property Matchmaking` — `Access our exclusive off-market inventory…` | `Off-Market Sourcing` — `The best properties never get listed. Tell us what you want; we'll find it.` |
| Service 3 | `Lifestyle Orchestration` — `From securing reservations…` | `Day-to-Day` — `Restaurants, events, contractors, staff — one message and it's handled.` |
| Service 4 | `Portfolio Management` — `Protecting your asset's value…` | `Ongoing Care` — `Maintenance, security, tenants — your property stays in shape without you chasing it.` |
| Card CTA | `Explore Service` | `Ask us about it` |

### Concierge FAB — `src/components/ConciergeUX.tsx`
- `How may we assist you today?` → `What can we handle for you?`
- Step 2 headline → `Leave your details — a real person gets back to you within one business day.`
- Step 3 body → `Done — your request is with the concierge team. Expect a reply within 24 hours.`

---

## 8. PARTNERSHIPS (`/partnerships`)

| Element | Current | Proposed |
|---|---|---|
| Title | `Your Competitive Advantage in Luxury Real Estate` | `Sell more. Manage better. Keep buyers for life.` |
| Subtitle | `We transform property developments into complete lifestyle brands…` | `We market, sell, and manage your development — so units move faster and residents stay happy long after handover.` |
| Section | `The Market Gap We Fill` | `Why developments stall` |
| Body | `Developers who only build and sell are becoming commoditised…` | `Build-and-sell leaves money and reputation on the table. The developers who win keep a relationship with buyers after handover — we run that for you.` |
| Pillars headline | `Three Integrated Pillars` | `One team, three jobs` |
| CTA headline | `Ready to Elevate Your Asset?` | `Let's talk about your project` |
| CTA body | `Partner with Kreebz to transform your architectural innovation…` | `Tell us what you're building and we'll show you how we'd sell and manage it.` |
| CTA button | `Discuss a Partnership` | `Start the conversation` |

---

## 9. ABOUT (`/about`)

| Element | Current | Proposed |
|---|---|---|
| Title | `Where Others Manage, We Represent` | `The team behind the standard` |
| Subtitle | `A principal-led practice built for owners who expect their standard held without exception.` | `We started Kreebz because owning property in Lagos was harder than it should be. So we built the team we wanted to call.` |
| Philosophy | `Kreebz Ltd is the official marketing and facility management company for the most prestigious developers…` | `We market developments, manage properties, arrange flights, and look after residents — one team, one phone number, one standard.` |
| CTA headline | `Your property deserves a principal.` | `Want a principal on your side?` |
| CTA button | `Begin the Conversation` | `Talk to us` |

**Rationale:** "Where others manage, we represent" is a strong differentiator line but works better as a sub-point than the page title — a human headline lands warmer. Alternative keeping it: subtitle becomes `One principal. Your standard. No exceptions.`

---

## 10. CONTACT (`/contact`)

| Element | Current | Proposed |
|---|---|---|
| Headline | `Your property deserves a principal.` | `Say hello — we actually reply.` |
| Response promise | `Response guaranteed within one business day` | `A real person replies within one business day` |
| Interest options | add `Private Jet Charter` to the list |
| Submit | `Send Inquiry` | `Send it over` |

**Rationale:** "Say hello" is disarming and sets the warm tone; the reply promise reinforces the trust objection.

---

## 11. PRIVATE JET (`/services/private-jet`)

| Element | Current | Proposed |
|---|---|---|
| Headline | `Fly Without Limits.` | `Your schedule. Your jet.` |
| Intro | `Bespoke private air travel arranged on your terms…` | `Tell us where and when. We arrange the aircraft, confirm the details, and you're wheels-up.` |
| Body | `Beyond property, Kreebz arranges private air travel on your terms…` | `One-way, return, or a regular route — pick the aircraft, pick the time, pay securely online. We handle everything else.` |
| Step 1 body | `Select the aircraft that suits your route and party size. Pricing is per hour of flight time.` | `Pick the jet that fits your route and party. You see the price before you commit — per flight hour, no surprises.` |
| Submit (logged in) | `Continue to Payment` | `Continue to secure payment` |

---

## 12. BOURDILLON (`/projects/bourdillon`)

Mostly solid already — it's specific, dated, and honest ("illustrative render," "subject to approval"). Keep that register; it's the most credible page on the site. Light touches only:

- CTA heading → `Get the Bourdillon brochure`
- CTA subheading → `We'll send the approved brochure and can set up a call or a site visit — whatever's easier.`
- Positioning (shared with homepage) → see §1.

---

## 13. MATCHMAKING (`/matchmaking`)

- Headline → `Tell us what you're after`
- Body → `A lot of our best properties never get listed. Share your requirements and a principal will put together a shortlist.`
- Submit → `Send my requirements`
- Success → `Got it — a principal will be in touch with options.`

---

## 14. THANK YOU (`/thank-you`)

- Headline → `Thanks — we've got it.`
- Body → `A principal will get back to you within one business day. If it's urgent, call us directly.`

---

## 15. METADATA / SEO (site-wide)

- Root title `Kreebz Ltd | Official Marketing & Facility Management` → `Kreebz | Property, Management & Private Aviation — Lagos`
- /services meta title → `Services | Kreebz Ltd` with description `Property sales and leasing, facility management, private jet charter, and concierge — one team in Lagos.`

---

## Open questions for you

1. **Testimonials & case-study numbers** — real or placeholder? If real, keep; if not, I'll pull the sections or rewrite around them.
2. **The `<4h` response-time stat** on /management — is that a real SLA?
3. **Phone/WhatsApp** — the sticky CTA offers both; is WhatsApp a channel you actively monitor? (If yes, worth naming it in copy: "Call or WhatsApp us.")
4. **Bourdillon pricing** — the FAQ dodges it. Do you want "price on request" or a range?
