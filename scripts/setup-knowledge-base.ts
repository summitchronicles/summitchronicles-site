#!/usr/bin/env tsx

/**
 * Knowledge Base Setup Script
 * 
 * This script helps you populate the RAG knowledge base with your mountaineering content.
 * Run after setting up Supabase with the schema.sql file.
 * 
 * Usage:
 *   npx tsx scripts/setup-knowledge-base.ts
 */

// Load environment variables
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { insertKnowledge } from '../lib/supabase'
import { generateEmbedding } from '../lib/ollama'

// Knowledge entries based on Sunith Kumar's actual mountaineering experience
const knowledgeEntries = [
  {
    content: `I live and train in Hyderabad, India—a city at 568 meters and mostly flat. While I don't have access to high-altitude terrain, I simulate elevation with nearby boulder trails, gym-based incline treadmill hikes (12-15% incline), stair climbing in high-rise buildings (200+ floors per session), and weighted backpack training (8kg to 28kg progression). Training starts at 7 hours per week and builds to 18 hours as expeditions approach.

    I've had AMS twice. First on Stok Kangri (21,000 ft) with dizziness, intense nausea, and splitting headache. Second unexpectedly on Sandakphu (12,000 ft) with fever, body aches, and chills—proof that AMS can hit at lower altitudes too. Early symptoms I watch for: headache, nausea, loss of appetite, extreme fatigue, body aches, labored breathing, and feeling cold even in multiple layers.

    My response protocol: Under 13,000 feet - take Diamox and observe for 24 hours, descend if symptoms persist. Above 15,000 feet - descend immediately or rest until improvement. Always increase water and electrolyte intake aggressively. The mountain will wait - you have to earn your breath, one step at a time.`,
    category: 'expedition' as const,
    source: 'Altitude Training & AMS Experience - Hyderabad to Himalayas',
    metadata: {
      summits: ['Stok Kangri', 'Sandakphu'],
      difficulty: 'intermediate',
      tags: ['altitude', 'AMS', 'training', 'symptoms', 'hyderabad', 'simulation']
    }
  },
  {
    content: `My expedition packing system: Footwear ranges from double/triple boots for extreme cold to trail runners and camp booties. Multiple sock types for different conditions. Layering system: base layers (top/bottom), mid-layers, multiple insulation layers, softshell, hardshell, down jackets, down suit, rain jacket. Sleep system: sleeping bags (-5°C to -30°C depending on climb), pillow, insulated mat, backup mattress.

    Essential technical gear: headlamp, trekking poles, mittens and gloves of varying thickness, ice axes, crampons, climbing harness, figure 8, carabiners, jumar, quickdraws, ropes.

    Hard lessons learned: Poor layering choices, gear failures (broken crampons, torn boots, dead headlamps), missing essentials (chapstick, SPF, foot powder, proper hats) can ruin climbs. Trusted brands I rely on: Salewa/La Sportiva/Solomon/Scarpa (boots), Smartwool/Quechua (base layers), Arc'teryx/RAB/North Face (shells & insulation), Osprey (backpacks), Petzl/Black Diamond (crampons). Every piece of gear must earn its place and its weight.`,
    category: 'gear' as const,
    source: 'Equipment Systems - Lessons from Multiple Expeditions',
    metadata: {
      difficulty: 'intermediate',
      tags: ['gear', 'layering', 'boots', 'brands', 'packing', 'essentials']
    }
  },
  {
    content: `Fear is a construct—or at least, that's what I try to tell myself. I still have a fear of heights, and it hits me hard in high-exposure zones. I've had panic attacks, sweated through layers, felt like I was suffocating. But I keep coming back because these moments make me feel alive and honor the battles I've survived—including tuberculosis.

    When fear shows up, I use long conscious breaths, sometimes box breathing to bring heart rate down. I remind myself why I'm here: to climb all Seven Summits, to honor my TB survival, and to carry forward the memory of friends who died chasing their passion. I use visualization heavily—mentally mapping routes, visualizing summit pushes, fatigue, cold, triumph. I even run mental math on steps needed and time to checkpoints.

    Cold exposure training builds discomfort tolerance. With ADHD, structure is essential—everything becomes a checklist. Mountain mornings start with warm water, then cold, followed by two rounds of box breathing. Only after calming nerves do I unzip the tent. TB shaped how I view pain and challenge—nothing on a mountain compares to those hospital years. Every setback feels like a restart, not a dead end.`,
    category: 'mental' as const,
    source: 'Mental Game - Fear Management and TB Recovery Mindset',
    metadata: {
      difficulty: 'advanced',
      tags: ['fear', 'mental', 'TB', 'ADHD', 'visualization', 'cold-exposure', 'panic-attacks']
    }
  },
  {
    content: `My training is periodized based on expedition timeline. Base phase: 6-7 hours/week. Peak phase: 16-18 hours/week. I track all metrics using Garmin - volume, fatigue, training readiness, HRV, pulse ox, sleep score, fatigue ratio. Typical week mixes cardio (running, stair climbing, cycling), strength (lower body, anterior/posterior split), long hikes or tire dragging to simulate mountain load, plus dedicated mobility and core stability.

    TB to athlete transformation: Finished treatment weighing 48kg, couldn't walk 50 meters without losing breath, had zero functional strength. Took nearly two years to rebuild from broken body to baseline athlete. Had to relearn movement, rebuild trust in my body. Key insight: survival isn't about mass—it's about adaptation.

    Ultra marathon training pushes boundaries differently than gym sessions. For Tata Ultra, I ran close to 100km/week. It taught me one thing: just shut up and move. That mental wiring directly translates to high-altitude climbs. When above 6,000 meters and every breath burns, same principle: just move forward. Don't overthink, don't negotiate with the mountain. Training for ultras made me metabolically efficient, mentally tougher, and less afraid of long-duration discomfort.`,
    category: 'training' as const,
    source: 'Physical Training - TB Recovery to Ultra Marathons to Seven Summits',
    metadata: {
      difficulty: 'advanced',
      tags: ['training', 'periodization', 'TB-recovery', 'ultra-marathon', 'garmin', 'endurance', 'mental-toughness']
    }
  },
  {
    content: `Surviving tuberculosis shaped how I view every challenge on mountains. Nothing I've faced—no cold, altitude, or exhaustion—has compared to those years in and out of hospitals. Maybe that's trauma living in memory, but every setback now feels like a restart, not a dead end.

    I don't see myself as inspirational—I'm just extremely stubborn. My ADHD gives me tunnel vision with goals—I set them aggressively and chase relentlessly. I'm brutally hard on myself, always demanding more. Every climb proves I'm better than yesterday, not to the world, but to me.

    TB didn't just scar my lungs—it wired my brain to push further, feel deeper, and never take a breath for granted. When people ask about motivation, I think of that 48kg version of me who couldn't cross a room. Every step up a mountain is a middle finger to that hospital bed. The mountains remind me what it means to be alive.`,
    category: 'mental' as const,
    source: 'TB Recovery Journey - Hospital Bed to Seven Summits',
    metadata: {
      difficulty: 'personal',
      tags: ['TB', 'recovery', 'motivation', 'ADHD', 'survival', 'resilience', 'trauma']
    }
  }
]

async function setupKnowledgeBase() {
  console.log('🚀 Setting up knowledge base...')
  
  try {
    for (const entry of knowledgeEntries) {
      console.log(`📝 Processing: ${entry.source}`)
      
      // Generate embedding for the content
      const embedding = await generateEmbedding(entry.content)
      
      // Insert into knowledge base
      const result = await insertKnowledge(
        entry.content,
        entry.category,
        entry.source,
        embedding,
        entry.metadata
      )
      
      if (result.success) {
        console.log(`✅ Added: ${entry.source}`)
      } else {
        console.error(`❌ Failed: ${entry.source} - ${result.error}`)
      }
    }
    
    console.log('✨ Knowledge base setup complete!')
    console.log('\n🎯 Next steps:')
    console.log('1. Add your own expedition content to replace samples')
    console.log('2. Test the Ask Sunith feature on your website')
    console.log('3. Iterate and improve responses based on user feedback')
    
  } catch (error) {
    console.error('💥 Setup failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Ensure Ollama is running: ollama serve')
    console.log('2. Check Supabase environment variables')
    console.log('3. Verify schema.sql was applied to your Supabase database')
  }
}

// Run the setup
setupKnowledgeBase()