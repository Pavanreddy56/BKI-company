# Blue Kailash International - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from professional B2B platforms (Maersk, DHL Global Forwarding, Flexport) combined with modern SaaS aesthetics (Stripe, Linear) to create a trustworthy, international trade-focused experience.

## Core Design Principles
- **Trust & Professionalism**: Clean layouts, generous whitespace, professional imagery
- **Global Sophistication**: Modern international business aesthetic with cultural sensitivity
- **Clarity & Efficiency**: Clear information hierarchy, easy navigation for B2B users

## Brand Identity

**Colors** (as provided):
- Primary: Deep Indigo `#0B3D91`
- Accent: Teal `#1BA39C` 
- Highlight/CTA: Warm Gold `#D9A441`
- Neutral: Charcoal `#2B2B2B`
- Background: Off-White `#F7F9FB`
- Success: `#2E8540`, Danger: `#D64545`

**Typography**:
- Headings: Poppins (700/600 weight) - professional, modern
- Body: Inter (400/500 weight) - excellent readability
- Sizes: Hero h1 (text-5xl/text-6xl), Section h2 (text-3xl/text-4xl), h3 (text-2xl), body (text-base/text-lg)

## Layout System

**Spacing**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: `p-6` to `p-8`
- Section spacing: `py-16` to `py-24` (desktop), `py-12` (mobile)
- Card margins: `gap-6` to `gap-8`
- Container max-width: `max-w-7xl` for full sections, `max-w-6xl` for content

## Component Library

**Navigation**:
- Sticky header with white/light background, subtle shadow
- Logo (provided image) on left, navigation center, CTA buttons right
- Mobile: hamburger menu with slide-in drawer
- Include: Home, About, Services, Products, Track Shipment, Request Quote, Login

**Hero Section** (Home):
- Full-width with background: gradient overlay on professional logistics imagery (container ships, warehouse, cargo)
- Height: `min-h-[600px]` to `min-h-[700px]`
- Content: Logo + tagline + 2-line value prop + dual CTAs (Primary: "Request Quote", Secondary: "Track Shipment")
- Trust badge bar below hero: "Licensed Exporters • Transparent Pricing • 10+ Countries"
- CTAs on image: Use backdrop-blur-sm with semi-transparent backgrounds

**Cards**:
- White background, rounded-lg (8px), subtle shadow (`shadow-md`)
- Product cards: Image top, title, HS code badge, description, price/unit
- Service cards: Icon (teal), heading, 2-3 line description
- Shipment status cards: Timeline design with status indicators

**Forms**:
- Multi-step quote request: Progress indicator at top, one section per step
- Input fields: Outlined style, focus:ring-2 with teal accent
- File upload: Drag-drop zone with file type icons
- Labels: text-sm font-medium above inputs

**Buttons**:
- Primary: bg-indigo (#0B3D91), white text, rounded-md, px-6 py-3
- Secondary: border-indigo outline, indigo text
- CTA highlight: bg-gold (#D9A441), charcoal text
- All buttons: font-medium, smooth transitions

**Dashboards**:
- Sidebar navigation (left): User info at top, menu items with icons
- Main content area: Stats cards grid (4 columns), tables with filters, action buttons
- Client dashboard: Recent quotes, active shipments, invoice downloads
- Admin dashboard: Management tables with inline edit/delete, status dropdowns

**Data Display**:
- Tables: Striped rows, hover effects, sortable headers
- Tracking timeline: Vertical line with status dots, timestamps
- Invoice list: Document icon, number, date, download button
- Status badges: Colored pills (pending-yellow, in-transit-blue, delivered-green)

## Images

**Hero Section**:
- Large hero image: Professional logistics scene (cargo port, containers, or modern warehouse)
- Treatment: Gradient overlay (indigo to transparent) for text legibility
- Quality: High-resolution, professional photography

**Other Sections**:
- About page: Team photo or professional office/warehouse image
- Services: Icon-based (no large images, use illustrations or icons)
- Product catalog: Product photography (spices in bowls, textiles, handicrafts)
- Contact: Optional map embed or office building image

**Image placement**:
- Product grid: Consistent aspect ratio (4:3 or 1:1), object-cover
- Testimonials: Customer/partner company logos (if available)
- No decorative patterns - maintain professional aesthetic

## Page-Specific Layouts

**Home**: Hero → Trust indicators → 3-column services overview → Featured products (4-col grid) → CTA section → Footer

**Products**: Filter sidebar (left) → Product grid (3-4 columns) → Pagination

**Quote Request**: 4-step wizard with progress bar → Form sections → File upload → Summary & submit

**Tracking**: Centered search bar → Results: Timeline view with status updates → Document downloads

**Admin**: Sidebar + top bar → Dashboard stats (4-card grid) → Management tables → Modal forms for edit/create

**Client Dashboard**: Sidebar → Welcome card → 3-tab interface (Quotes/Shipments/Invoices) → Data tables

## Footer
Comprehensive 4-column layout:
- Column 1: Logo + tagline
- Column 2: Quick links (About, Services, Products)
- Column 3: Support (Contact, Track, FAQ)
- Column 4: Contact info + social links
- Bottom bar: Copyright, Privacy Policy, Terms

**Responsive**: Stack to single column on mobile with accordion sections