# 🚨 Disaster Recovery Plan

## Summit Chronicles Database Backup & Recovery System

### 🎯 **Overview**

Comprehensive backup and disaster recovery system for Summit Chronicles production database, ensuring 24/7 availability and data protection.

## 📊 **Backup Strategy**

### **Automated Backups** ✅
- **Daily Incremental**: Every day at 2:00 AM UTC
- **Manual Full Backup**: Available via admin dashboard and CLI
- **Critical Data Priority**: Blog posts, knowledge base, Strava data
- **Retention**: 30 days of backup history

### **Backup Types**

#### **1. Incremental Backups** (Daily)
- **Schedule**: 2:00 AM UTC daily via Vercel Cron
- **Scope**: Only changed/new records since last backup
- **Size**: ~50KB - 2MB typical
- **Tables**: All tables with timestamp fields
- **Retention**: 30 days

#### **2. Full Backups** (On-Demand)
- **Trigger**: Manual via admin dashboard or CLI
- **Scope**: Complete database snapshot
- **Size**: 10-50MB typical
- **Tables**: All critical and analytics tables
- **Use Cases**: Pre-deployment, major updates, monthly archives

#### **3. Critical-Only Backups** (Emergency)
- **Scope**: Business-critical data only
- **Tables**: `blog_posts`, `knowledge_base`, `strava_activities`, etc.
- **Speed**: 10x faster than full backup
- **Use Cases**: Emergency situations, rapid recovery needs

## 🗂️ **Protected Data Tables**

### **Critical Business Data** (Priority 1)
```sql
-- Core content and functionality
blog_posts              -- Published articles and content
blog_categories         -- Content categorization
blog_tags              -- Content tagging system
blog_post_tags         -- Tag relationships
blog_media             -- Uploaded images and files

-- AI Knowledge Base (RAG System)
knowledge_base         -- Vectorized content for AI
document_chunks        -- Processed text chunks

-- Strava Integration
strava_activities      -- Training data
strava_tokens         -- API authentication
```

### **Important Analytics Data** (Priority 2)
```sql
-- User behavior tracking
analytics_sessions      -- User session data
analytics_page_views   -- Page visit analytics
analytics_events       -- Custom event tracking
analytics_ai_interactions -- Ask Sunith usage

-- System monitoring
error_logs            -- Application error tracking
backup_logs           -- Backup operation history
```

## 🛠️ **Backup Operations**

### **Manual Backup Commands**

#### **Full Backup**
```bash
# CLI method
npx tsx scripts/database-backup.ts

# API method (admin authenticated)
curl -X POST https://summitchronicles.com/api/backup/database?type=full \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

#### **Incremental Backup**
```bash
# CLI method
npx tsx scripts/database-backup.ts --type=incremental

# API method
curl -X POST https://summitchronicles.com/api/backup/database?type=incremental \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

#### **Critical Data Only**
```bash
# Emergency fast backup
curl -X POST https://summitchronicles.com/api/backup/database?type=full&critical=true \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

### **Backup Verification**
```bash
# Test backup integrity
npx tsx scripts/database-backup.ts --test=./backups/backup-full-2025-01-01.json

# Check backup status
curl https://summitchronicles.com/api/backup/database
```

## 🚨 **Disaster Recovery Procedures**

### **Scenario 1: Complete Database Loss**

**Recovery Time**: 15-30 minutes

1. **Immediate Actions**:
   ```bash
   # 1. Assess damage and switch to maintenance mode
   # 2. Locate most recent full backup
   ls -la ./backups/backup-full-*.json | tail -5
   
   # 3. Test backup integrity
   npx tsx scripts/database-backup.ts --test=./backups/backup-full-YYYY-MM-DD.json
   ```

2. **Database Restoration**:
   ```bash
   # 4. Restore from full backup
   npx tsx scripts/database-backup.ts --restore=./backups/backup-full-YYYY-MM-DD.json
   
   # 5. Apply incremental backups (if available)
   npx tsx scripts/database-backup.ts --restore=./backups/backup-incremental-YYYY-MM-DD.json
   ```

3. **Verification & Resume**:
   ```bash
   # 6. Verify data integrity
   # Check critical tables have expected record counts
   # Test site functionality (blog posts, AI system, Strava data)
   
   # 7. Resume normal operations
   # Remove maintenance mode
   # Monitor error logs for issues
   ```

### **Scenario 2: Partial Data Corruption**

**Recovery Time**: 5-15 minutes

1. **Identify affected tables**
2. **Restore specific table data from backup**
3. **Verify data consistency**
4. **Test affected functionality**

### **Scenario 3: Recent Data Loss (< 24 hours)**

**Recovery Time**: 2-5 minutes

1. **Use most recent incremental backup**
2. **Apply to current database**
3. **Verify only recent changes restored**

## ⚡ **Emergency Contacts & Procedures**

### **Emergency Response Team**
- **Primary**: Sunith Kumar (Owner)
- **Technical**: Admin team with owner-level access
- **Escalation**: Supabase support (if infrastructure issue)

### **Emergency Procedures**

#### **Step 1: Damage Assessment** (2-5 minutes)
- Check Supabase dashboard for database status
- Verify which tables/data are affected
- Determine if it's partial or complete data loss
- Check error monitoring dashboard for root cause

#### **Step 2: Communication** (Immediate)
- Activate maintenance mode if necessary
- Post status update on social media if widespread impact
- Notify team via emergency channels

#### **Step 3: Recovery Execution** (5-30 minutes)
- Execute appropriate recovery procedure based on scenario
- Follow checklist above for chosen recovery method
- Document all actions taken for post-incident review

#### **Step 4: Verification & Monitoring** (15-60 minutes)
- Comprehensive functionality testing
- Monitor error rates and user reports
- Verify all systems operational
- Clear maintenance mode

#### **Step 5: Post-Incident** (24-48 hours)
- Document incident timeline and root cause
- Review and improve backup/recovery procedures
- Implement preventive measures if needed

## 📋 **Recovery Checklist**

### **Pre-Recovery Verification**
- [ ] Identify scope of data loss
- [ ] Locate appropriate backup files
- [ ] Test backup file integrity
- [ ] Estimate recovery time window
- [ ] Notify relevant stakeholders

### **During Recovery**
- [ ] Set maintenance mode (if needed)
- [ ] Execute recovery procedure
- [ ] Monitor recovery progress
- [ ] Document any issues encountered

### **Post-Recovery Verification**
- [ ] Verify blog posts are accessible
- [ ] Test Ask Sunith AI functionality
- [ ] Check Strava data integration
- [ ] Verify admin dashboard access
- [ ] Test user analytics tracking
- [ ] Monitor error logs for anomalies
- [ ] Remove maintenance mode
- [ ] Post all-clear communication

## 🔧 **Backup System Administration**

### **Environment Variables Required**
```bash
# Database access
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Backup authentication  
CRON_SECRET=your-cron-secret

# Error monitoring
LOG_WEBHOOK_URL=your-monitoring-webhook
```

### **Monitoring & Alerts**

#### **Backup Success Monitoring**
- Daily backup completion logs
- Backup size and duration tracking
- Failed backup immediate alerts

#### **Data Integrity Checks**
- Regular backup file verification
- Cross-reference with live data
- Automated integrity testing

### **Storage Considerations**

#### **Current Storage**
- **Local**: Development and testing backups
- **Supabase**: Backup logs and metadata
- **Future**: Cloud storage (S3, Google Cloud) for production backups

#### **Capacity Planning**
- Current database size: ~50MB
- Growth rate: ~10MB/month
- Backup storage needed: ~1.5GB/year (with compression)

---

## 🚀 **Testing & Validation**

### **Monthly Backup Drill**
1. Create test restore environment
2. Restore from random recent backup
3. Verify all functionality works
4. Document any issues or improvements needed

### **Quarterly Full Recovery Test**
1. Complete disaster simulation
2. Full recovery procedure execution
3. Performance impact assessment
4. Update procedures based on lessons learned

---

**Recovery Philosophy**: *"Fast recovery beats perfect backups. Every minute of downtime impacts users, but every day without backups risks everything."*

This disaster recovery plan ensures Summit Chronicles can recover from any data loss scenario within 30 minutes while maintaining data integrity and minimal user impact.