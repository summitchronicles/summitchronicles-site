# Quick Reference Card

## ⚡ Quick Commands

### Check Current Status
```bash
# View training statistics
node scripts/view-training-stats.mjs

# Check database
node scripts/verify-database.mjs

# Check Garmin connection
curl http://localhost:3000/api/garmin/sync | jq
```

### Setup Garmin (2 Steps)
```bash
# 1. Copy SQL to clipboard
cat lib/database/garmin-tokens-schema.sql | pbcopy

# 2. Paste in Supabase
open "https://supabase.com/dashboard/project/nvoljnojiondyjhxwkqq/sql/new"
```

### Sync Garmin Data
```bash
# Manual sync (after connecting)
curl -X POST http://localhost:3000/api/garmin/sync \
  -H "Content-Type: application/json" \
  -d '{"limit": 100}'
```

### Test AI
```bash
# Ask AI about training
curl -X POST http://localhost:3000/api/ai/ask-enhanced \
  -H "Content-Type: application/json" \
  -d '{"question": "What did I do this week?"}' | jq
```

---

## 📊 Current Data

- **Historical**: 513 workouts (Excel)
- **Garmin**: 0 (needs connection)
- **Sources**: 3 Excel sheets uploaded
- **Date Range**: Feb 2024 - Sep 2025

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/nvoljnojiondyjhxwkqq
- **Training Page**: http://localhost:3000/training
- **Realtime Page**: http://localhost:3000/training/realtime

---

## 📝 File Locations

### Documentation
- `COMPLETE_SUMMARY.md` - Full summary
- `GARMIN_SETUP_STATUS.md` - Setup details
- `GARMIN_INTEGRATION_PLAN.md` - Integration plan
- `DATABASE_SETUP.md` - Database guide

### Code
- `lib/integrations/garmin-oauth.ts` - OAuth
- `lib/integrations/garmin-api.ts` - API client
- `lib/training/unified-workouts.ts` - Unified data
- `app/api/garmin/sync/route.ts` - Sync endpoint

### Scripts
- `scripts/view-training-stats.mjs` - View stats
- `scripts/verify-database.mjs` - Verify DB
- `scripts/upload-all-sheets.mjs` - Upload Excel

---

## 🎯 Next Steps

1. [ ] Execute `lib/database/garmin-tokens-schema.sql` in Supabase
2. [ ] Connect Garmin account via UI or OAuth
3. [ ] Run sync: `POST /api/garmin/sync`
4. [ ] Test AI: Ask about recent training

---

## 💬 Example AI Questions

**After Garmin Connected:**
- "What did I do this week?"
- "How's my training volume?"
- "Compare this month to last month"
- "Am I ready for Everest 2027?"
- "What should I focus on next?"

**AI Will Include:**
- Historical data (513 workouts)
- Recent Garmin activities
- Heart rate zones
- Training stress scores
- Personalized insights

---

## 🚨 Troubleshooting

### Garmin Not Connecting
- Check OAuth credentials in `.env.local`
- Garmin uses OAuth 1.0a (may need oauth-1.0a package)

### Sync Returns 0
- Check Garmin tokens in database
- Verify token not expired
- Check Garmin API permissions

### AI Not Seeing Data
- Verify workouts in `historical_workouts` table
- Check `garmin_workouts` table
- Test unified query: `getUnifiedWorkouts()`

---

## 📦 Commit Status

Latest commit: `feat: Complete Garmin integration with unified workout data for AI`

**Files Added**: 20
**Lines Changed**: 2,436

**Ready to push!**
