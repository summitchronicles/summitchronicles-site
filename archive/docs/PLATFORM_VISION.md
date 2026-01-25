# Summit Chronicles: The Platform Vision

To evolve from a **Content Site** (You broadcasting) to a **Platform** (Others building/participating), we must expose "Primitives" that stakeholders can use.

## The Core Concept: "SummitOS"
Summit Chronicles isn't just a blog; it is a **Real-Time Operating System for an Expedition**. We expose the state of the climb via APIs, Widgets, and Assets that others can consume.

---

## 1. The Sponsor Platform: "Proof of Performance"
**The Problem:** Sponsors currently get a logo on a jacket and a "Thank you" post. They want *active* association with the struggle and triumph.
**The Solution:** Embeddable Live Context.

### Feature: The "Pulse Widget" (Embeddable SDK)
*   **What:** A lightweight JavaScript widget that The North Face or Garmin can embed on *their* homepage.
*   **Data:** "Sunith is currently at 6,500m. Heart Rate: 135bpm. Temperature: -15°C."
*   **The Hook:** It links back to Summit Chronicles but lives on their high-traffic site.
*   **Tech Stack:**
    *   **Vercel Edge Functions:** To handle high-concurrency requests from sponsor sites.
    *   **Public API Route:** `/api/v1/live-status` (CORS enabled for sponsor domains).

### Feature: Contextual Product Placement
*   **What:** Dynamic association of gear with conditions.
*   **Logic:**
    *   If `Temperature` < -10°C → UI highlights the Down Suit.
    *   If `Ascent Rate` > 500m/hr → UI highlights the Energy Gels.
*   **Tech:** A "Gear State" mapping in your database that correlates metrics to equipment.

---

## 2. The Marketer/Creator Platform: "Asset Velocity"
**The Problem:** Marketers need content *now*. Waiting for you to upload a Google Drive folder is too slow.
**The Solution:** An Automated Media API.

### Feature: The "Live Media Bank"
*   **What:** A dedicated `/media` portal where approved marketers can grab assets.
*   **The AI Twist:**
    *   Use **Antigravity/AI** to auto-caption images: "Sunith crossing the Khumbu Icefall."
    *   Auto-generate "Social Cards" with overlay metrics (e.g., a photo of you with your heart rate stamped on it).
*   **Tech:**
    *   **Cloudinary/Replicate:** For on-the-fly image transformation and overlays.
    *   **Webhook notifications:** Slack msg to marketers: "New high-res summit photo available."

### Feature: Affiliate Intelligence
*   **What:** Instead of generic links, provide *contextual* affiliate data.
*   **Data:** "This exact jacket kept me warm at Camp 3." -> [Link]
*   **Tech:** Track clicks via a custom redirector `/go/jacket` to show sponsors real conversion data from the mountain.

---

## 3. The Fan Platform: "Participatory Mountaineering"
**The Problem:** Fans are passive observers. They want to feel like "Virtual Sherpas."
**The Solution:** Gamification & Interaction.

### Feature: "Basecamp" (User Accounts)
*   **What:** Fans sign in to unlock "Deep Telemetry."
*   **Value:**
    *   **Free:** Read the blog.
    *   **Basecamp Member (Login):** See the 10-minute granular heart rate graph, view the raw GPS trace, receive "Emergency/Summit Push" SMS alerts.
*   **Tech:** **NextAuth.js** (Social Login).

### Feature: The "Cheer" Protocol (Haptic/Visual Feedback)
*   **What:** Fans can click "Send Strength" (limited to 1 per hour).
*   **Feedback:** You (or your base camp team) see a "Energy Bar" filling up on a dashboard.
*   **Tech:** Real-time WebSockets (Pusher or Supabase Realtime).

---

## Architectural Roadmap

### Phase 1: The Headless Kernel (Weeks 1-2)
*   [ ] **Standardize the Data Layer:** Ensure Garmin/Intervals.icu data flows into a normalized Postgres schema (`tbl_telemetry`).
*   [ ] **Public API Construction:** Build `/api/v1/` routes for external consumption.
*   [ ] **API Key Management:** Simple auth for Sponsors to access the API.

### Phase 2: The Widget Engine (Weeks 3-4)
*   [ ] **Embeddable React Component:** Create a standalone widget build (using Micro-frontends or just an iframe) for sponsors.
*   [ ] **Sponsor Portal:** A simple page where generic brand managers can copy-paste the embed code.

### Phase 3: The Engagement Layer (Month 2)
*   [ ] **NextAuth Integration:** Enable user login.
*   [ ] **Notifications System:** Email/SMS triggers for "Summit Push" events.

---

## The "Killer Feature": The Summit Oracle
**Idea:** A specialized AI Agent trained *only* on your expedition logs.
*   **Sponsor Value:** "Ask the Summit AI: What gear is Sunith using right now?"
*   **Fan Value:** "Ask the Summit AI: How is the weather compared to yesterday?"
*   **Implementation:** Your current `researcher` agent, but exposed via a chat interface to the public.
