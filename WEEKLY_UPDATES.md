# Summit Chronicles - Weekly Development Updates

## Week 1: Why I'm Building This

I've started building SummitChronicles.com.
The goal is to make it my personal portfolio, but also a place where I can test ideas with AI, APIs, and data.

Here's what I'm starting with:
- Next.js + Vercel for the frontend and hosting
- Strava API for pulling in my training data
- OpenAI API to experiment with content automation
- Database layer (still deciding between Supabase and Postgres) for storing logs and structured data

The bigger vision is not just a website.
I want it to evolve into a working example of how to bring together:
- Frontend + backend in a clean way
- Real APIs that people actually use
- AI features that are practical, not hype
- Data that can scale from small personal logs to something more complex

I'll share weekly updates here — what worked, what broke, and what I learned.

👉 Next week: repo setup, first deployment, and the silly mistakes I made just trying to get the site live.

---

## Week 2: Setting Up Foundations

This week I moved from a blank page to connecting the first real pieces.

**Progress**
- Repo deployed on Vercel with a Next.js frontend.
- Connected the Strava API to start pulling in my activity data. The OAuth flow was painful — the access + refresh tokens took multiple retries before I got it right.
- Picked Supabase (Postgres) as the database. Easy setup, built-in auth, and it feels right for logging structured training data.
- Integrated the Cohere API instead of OpenAI. Main reason: Cohere offers a free tier, which makes it easier to test without worrying about costs. The plan is to use it for small things first — summarizing logs, drafting quick content, experimenting with text pipelines.

**Frustrations**
- The Strava callback kept failing because of a missing param. It took me way too long to realize the error was in my redirect URL.
- Database schema — I kept trying to design for the future (users, logs, sessions, analytics). In the end, I stripped it back to just the basics.
- Managing API keys between local and deployed versions was more annoying than I thought.

**Learnings**
- Don't chase the "perfect" schema in the beginning — working code matters more.
- OAuth always takes longer than planned.
- Choosing a free but good-enough LLM (Cohere) was the right call for now. I can always swap later if I need more capability.

---

## Week 3: Building Intelligence & Solving Real Problems

This week I shifted from basic setup to creating features that actually solve problems. The focus: turning my mountaineering experience into something useful for others.

**Major Progress**
- **Built a complete RAG (Retrieval Augmented Generation) system** using Ollama locally + Supabase vector storage. Zero monthly costs, but GPT-3.5 level responses.
- **Fixed core UX issues** that were blocking real usage: like/share buttons on blogs, collaborative sponsorship approach (removed scary fixed pricing), and working AI responses.
- **Implemented credibility-first homepage design** — showing achievements and experience before asking for partnerships. Much better conversion psychology.
- **Corrected positioning** from narrow "Seven Summits mountaineer" to authentic "multi-discipline adventurer" covering mountains, ultra marathons, and exploration.

**Technical Deep Dive**
- **Free AI Stack**: Ollama (llama3.1:8b) + nomic-embed-text for local processing, Supabase free tier for vector storage, Next.js API routes for orchestration.
- **Smart Fallbacks**: System gracefully handles offline scenarios and provides rule-based responses when RAG unavailable.
- **Performance**: 2-5 second response times, completely free to operate, scales to handle thousands of questions.

**Frustrations**
- **Model downloads**: 5GB+ for the LLM took patience, but worth it for cost savings.
- **Git issues**: Special characters in file paths caused deployment hiccups (classic edge case).
- **Content creation bottleneck**: The AI infrastructure is ready, but I need to write actual expedition knowledge to train it properly.

**Learnings**
- **Start with user problems, not tech features** — the sponsorship pricing was scaring people away, AI giving generic responses was useless.
- **Local AI is production-ready** — don't need expensive cloud APIs for everything. Ollama + good hardware = powerful results.
- **ADHD-friendly development** — breaking complex features into clear checklists made everything manageable.

**Next Week Preview**
Adding my actual Seven Summits knowledge to the AI system, tackling image personalization (replacing generic stock photos), and potentially exploring partnership tracking features.

The site is becoming less "portfolio" and more "working product" — exactly what I wanted.

---

## Week 4: When Everything Breaks, You Build It Better

The last week started with disaster and ended with the most systematic development process I've ever experienced.

**The Disaster**
Tuesday morning: Vercel deployment completely broken. TypeScript errors everywhere. Dependencies conflicting. After hours of debugging, I made the nuclear decision: delete everything and start from scratch.

**The Discovery**
While rebuilding, I discovered **BMAD (Business-Motivated Agile Development)** — an AI-powered framework for systematic product development. Instead of cowboy coding, I used BMAD to rebuild the entire strategy from the ground up.

**Tools That Saved My Sanity**
- **BMAD Framework**: AI-driven PRD creation, user story mapping, and strategic pivoting
- **Claude Code**: AI pair programming that actually understands context and business logic
- **GitHub Actions**: Automated CI/CD pipeline with quality gates
- **Playwright**: End-to-end testing that catches deployment issues before production
- **Vercel**: Edge deployment with automatic preview environments
- **Sentry**: Error monitoring that shows real user impact

**Strategic Pivot**
The rebuild forced me to question everything. BMAD helped identify what I was building and what are the different components I need to consider rather than just prompting my way into a site. It helped me go back to the basics: what am I building, who am I building it for, and what is the end goal?

**AI DevOps in Action**
- **Automated Evaluations**: Playwright tests that verify functionality across deployment pipeline
- **Quality Gates**: TypeScript, ESLint, and Prettier checks preventing broken deployments
- **Intelligent Monitoring**: Real-time error tracking and performance analytics
- **Self-Healing Architecture**: Graceful degradation when services are unavailable

**Production Reality Check**
The "simple" deployment turned into a 12-hour debugging marathon:
- Prettier formatting conflicts across 300+ files
- TypeScript compilation errors in production environment
- Playwright test port conflicts breaking CI pipeline
- Sentry CLI integration failures blocking releases

Each problem required systematic debugging, not just "try random fixes until it works."

**Technical Wins**
- **Complete expedition cost transparency**: $40K USD breakdown showing exactly where money goes
- **Payment integration**: UPI support for Indian market with secure verification
- **AI-powered content strategy**: RAG system providing mountaineering knowledge and training data set for future deployments
- **Production-grade architecture**: Monitoring, testing, and deployment automation

**The Learning**
Building software is 20% writing code, 80% systems thinking. BMAD taught me that rushed development creates technical debt that compounds exponentially. Better to rebuild thoughtfully than patch endlessly.

**Next Week Preview**
Switching from Razorpay to Patreon integration, adding real expedition knowledge to the AI system, and documenting this entire BMAD-driven process for others to learn from.

The expedition preparation continues: 30% physical training, 70% building systems that can handle the complexity of modern adventure logistics.