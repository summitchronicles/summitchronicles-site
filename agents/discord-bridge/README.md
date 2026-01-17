# Discord-First Workflow Guide

## 🎯 Complete Blog Management from Discord

Everything you need can be done from Discord - no dashboard required!

---

## 🚀 Quick Start

### 1. Start the Discord Bot
```bash
npx ts-node agents/discord-bridge/index.ts
```

### 2. Available Commands

#### Generate Research Blog
```
!research
```
What it does:
- Brainstorms trending mountaineering topics (Ollama)
- Drafts full blog post (Ollama)
- Generates image (Gemini - waits up to 5min if rate limited)
- Sends you an interactive message with buttons:
  - 👁️ View Draft - Preview the content
  - ✅ Approve & Publish - Make it live
  - 🗑️ Delete - Discard

#### Save a Note
```
!note Just sent Everest South Col! Hands are shredded.
```
Saves note to `content/incoming-notes/` for later processing.

#### Upload Note File
Upload any `.txt` file - bot auto-saves it.

#### Process Notes into Blogs
```
!process
```
Converts all pending notes into blog posts.

#### List All Drafts
```
!list
```
Shows all blog drafts awaiting review.

#### Get Help
```
!help
```
Shows command reference.

---

## 📊 Complete Workflow Examples

### Scenario 1: Auto-Research Blog
```
YOU (Discord)                    BOT RESPONSE                          ACTION
──────────────                   ────────────                          ──────

!research                    →   🔬 Starting Research Agent...
                                 ⏳ Step 1/3: Brainstorming...
                                 (5 sec later)
                                 ✅ Step 1/3: Complete
                                 ⏳ Step 2/3: Drafting...
                                 (15 sec later)
                                 ✅ Step 2/3: Complete
                                 ⏳ Step 3/3: Generating image...
                                 (60 sec later)

                                 ✅ Research Complete!

                                 📝 New Blog Draft Ready!
                                 Title: "Winter Alpinism Trends"

                                 [👁️ View]  [✅ Approve]  [🗑️ Delete]

Click 👁️ View            →   Shows markdown preview in Discord

Click ✅ Approve          →   ✅ Blog Approved!
                                 🔗 Live at: localhost:3000/blog
                                 (Production: Triggers Vercel deploy)
```

### Scenario 2: Note → Blog
```
!note Crazy day on K2.      →   ✅ Note saved! Run !process
Wind was 80mph.

!process                     →   🔄 Processing 1 note(s)...
                                 (Agent runs)
                                 ✅ Processed! Check !list

!list                        →   📚 Blog Drafts
                                 1. 2026-01-15-crazy-day-k2.md
                                 !approve 2026-01-15-crazy-day-k2.md
```

---

## 🔧 Discord Bot Setup

### Prerequisites
1. Discord account
2. Server with admin access

### Steps

#### 1. Create Bot
- Go to https://discord.com/developers/applications
- Click "New Application"
- Go to "Bot" tab → "Add Bot"
- **CRITICAL**: Enable "MESSAGE CONTENT INTENT"
- Copy bot token

#### 2. Invite Bot
- Go to "OAuth2" → "URL Generator"
- Select scopes: `bot`, `applications.commands`
- Select permissions:
  - Send Messages
  - Read Messages/View Channels
  - Use Slash Commands
- Copy URL and open in browser
- Select your server

#### 3. Get Channel ID
- Enable Developer Mode (Discord Settings → Advanced)
- Right-click your target channel → Copy ID

#### 4. Configure Environment
Add to `.env.local`:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
```

#### 5. Install Dependencies
```bash
npm install discord.js
```

#### 6. Run Bot
```bash
# Terminal 1: Discord Bot
npx ts-node agents/discord-bridge/index.ts

# Terminal 2: Web Dashboard (optional)
npm run dev
```

---

## 🎨 Interactive Features

### Button Actions
When a blog is drafted, you get interactive buttons:

- **👁️ View Draft**: Shows the markdown content in Discord (first 1500 chars)
- **✅ Approve & Publish**: Marks the blog as published (ready for deployment)
- **🗑️ Delete**: Removes the draft file

### Real-Time Status
The bot shows live progress:
```
🔬 Starting Research Agent...
✅ Step 1/3: Brainstorming complete
⏳ Step 2/3: Drafting blog post...
```

---

## 🆚 Discord vs Dashboard

### Discord (Recommended)
✅ All-in-one interface
✅ Mobile-friendly
✅ Real-time notifications
✅ Interactive approval
✅ Works anywhere

### Dashboard (http://localhost:3000/dashboard)
✅ Visual overview
✅ Bulk operations
✅ Detailed stats
✅ Direct preview

**Bottom Line**: Use Discord for daily ops, Dashboard for analytics.

---

## 🔄 Automation Options

### Option 1: Manual Triggers (Discord)
You run `!research` when you want a blog.

### Option 2: Scheduled (Cron)
Bot auto-runs and notifies you:
```bash
# Add to crontab
0 9 * * 1 curl http://localhost:3000/api/agents/researcher -H "Authorization: Bearer dev-secret" -X POST && echo "!research" | your-discord-webhook
```

### Option 3: Event-Driven
- Dropbox file → Trigger !process
- GitHub issue → Trigger !research with topic
- Calendar event → Auto-post

---

## 📱 Mobile Workflow

Since Discord works on mobile, you can:
1. Be on a climb
2. Voice dictate note to Discord
3. Bot saves it
4. Later: `!process` from phone
5. Approve draft with emoji button
6. Blog goes live

**All without touching a computer.**

---

## 🚨 Troubleshooting

**Bot not responding?**
- Check `DISCORD_BOT_TOKEN` is set
- Verify MESSAGE_CONTENT intent is enabled
- Ensure bot has channel permissions

**!research stuck on "Generating image"?**
- Normal! Gemini rate limits = 60s wait
- Agent retries up to 5 times
- If it fails, you'll see error message

**Drafts not appearing?**
- Check `content/blog/` directory
- Run `!list` to see all drafts
- Check bot console for errors

---

## 🎯 What You Asked For

> "Can everything be done from Discord?"

**YES!**

1. ✅ Run research agent → Receive blog link → Review → Sign off → Publish
2. ✅ Add field notes → Trigger agent → Convert to blog → Add images → Sign off

**All from Discord, zero dashboard required.**

The dashboard is just a bonus for analytics.
