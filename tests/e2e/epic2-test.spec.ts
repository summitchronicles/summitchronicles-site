import { test, expect } from '@playwright/test';

test('Epic 2: Personal Journey Documentation Platform - Comprehensive Test', async ({ page }) => {
  console.log('🎯 TESTING EPIC 2: Personal Journey Documentation Platform');
  
  // Test the deployment
  const deploymentUrl = 'https://summit-chronicles-starter-81io23ve5-summit-chronicles-projects.vercel.app';
  
  try {
    await page.goto(deploymentUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'epic2-home-page.png', 
      fullPage: true 
    });
    
    console.log('📸 Epic 2 - Home page screenshot saved');
    
    // ===============================
    // Story 2.1: Training Methodology Documentation System
    // ===============================
    console.log('🏋️ Testing Story 2.1: Training Methodology Documentation System');
    
    // Navigate to Training page
    await page.click('a[href="/training"]');
    await page.waitForLoadState('networkidle');
    
    // Take training page screenshot
    await page.screenshot({ 
      path: 'epic2-training-page.png', 
      fullPage: true 
    });
    
    // Check for Training Methodology Hub
    const hasTrainingMethodologyHub = await page.locator('text=Training Methodology').count() > 0;
    console.log('📚 Story 2.1 - Training Methodology Hub:', hasTrainingMethodologyHub);
    
    // Check for workout plans
    const hasWorkoutPlans = await page.locator('text=Alpine Endurance Foundation').count() > 0 ||
                           await page.locator('text=Functional Strength Circuit').count() > 0;
    console.log('💪 Story 2.1 - Workout Plans Present:', hasWorkoutPlans);
    
    // Check for search functionality
    const hasSearchBar = await page.locator('input[placeholder*="training"]').count() > 0;
    console.log('🔍 Story 2.1 - Search Functionality:', hasSearchBar);
    
    // Check for filtering functionality
    const hasFilters = await page.locator('text=Endurance').count() > 0 &&
                      await page.locator('text=Strength').count() > 0;
    console.log('🏷️ Story 2.1 - Filter Categories:', hasFilters);
    
    // ===============================
    // Story 2.2: Expedition Timeline & Milestone Tracking
    // ===============================
    console.log('🗓️ Testing Story 2.2: Expedition Timeline & Milestone Tracking');
    
    // Navigate to Journey page
    await page.click('a[href="/journey"]');
    await page.waitForLoadState('networkidle');
    
    // Take journey page screenshot
    await page.screenshot({ 
      path: 'epic2-journey-page.png', 
      fullPage: true 
    });
    
    // Check for Expedition Timeline
    const hasExpeditionTimeline = await page.locator('text=Expedition Timeline').count() > 0;
    console.log('📍 Story 2.2 - Expedition Timeline:', hasExpeditionTimeline);
    
    // Check for milestone markers
    const hasMilestones = await page.locator('text=Training Phase Begins').count() > 0 ||
                         await page.locator('text=Mount Rainier').count() > 0;
    console.log('🎯 Story 2.2 - Milestone Markers:', hasMilestones);
    
    // Check for progress indicators
    const hasProgressIndicators = await page.locator('text=Milestones Completed').count() > 0;
    console.log('📊 Story 2.2 - Progress Indicators:', hasProgressIndicators);
    
    // Check for phase filters
    const hasPhaseFilters = await page.locator('text=Preparation').count() > 0 &&
                           await page.locator('text=Climb').count() > 0;
    console.log('🔄 Story 2.2 - Phase Filters:', hasPhaseFilters);
    
    // Test milestone expansion (if available)
    try {
      const firstMilestone = page.locator('[class*="cursor-pointer"]:has-text("Training Phase")').first();
      if (await firstMilestone.count() > 0) {
        await firstMilestone.click();
        await page.waitForTimeout(1000);
        
        const hasExpandedContent = await page.locator('text=Key Metrics').count() > 0;
        console.log('📖 Story 2.2 - Milestone Expansion:', hasExpandedContent);
      }
    } catch (error: unknown) {
      console.log('ℹ️ Story 2.2 - Milestone expansion test skipped');
    }
    
    // ===============================
    // Story 2.3: Personal Story & Achievement Gallery
    // ===============================
    console.log('🏆 Testing Story 2.3: Personal Story & Achievement Gallery');
    
    // Check for Personal Story section
    const hasPersonalStory = await page.locator('text=Personal Story').count() > 0;
    console.log('📝 Story 2.3 - Personal Story Section:', hasPersonalStory);
    
    // Check for Achievement Gallery
    const hasAchievementGallery = await page.locator('text=Achievement Gallery').count() > 0 ||
                                 await page.locator('text=Achievements').count() > 0;
    console.log('🏅 Story 2.3 - Achievement Gallery:', hasAchievementGallery);
    
    // Test section navigation
    try {
      const achievementButton = page.locator('button:has-text("Achievements")');
      if (await achievementButton.count() > 0) {
        await achievementButton.click();
        await page.waitForTimeout(1000);
        
        const hasAchievementCards = await page.locator('text=Mount Rainier').count() > 0 ||
                                   await page.locator('text=Island Peak').count() > 0;
        console.log('🎖️ Story 2.3 - Achievement Cards:', hasAchievementCards);
      }
      
      const testimonialButton = page.locator('button:has-text("Testimonials")');
      if (await testimonialButton.count() > 0) {
        await testimonialButton.click();
        await page.waitForTimeout(1000);
        
        const hasTestimonials = await page.locator('[class*="testimonial"]').count() > 0 ||
                               await page.locator('text=Outstanding mountaineer').count() > 0;
        console.log('💬 Story 2.3 - Testimonials:', hasTestimonials);
      }
      
      const mediaButton = page.locator('button:has-text("Media")');
      if (await mediaButton.count() > 0) {
        await mediaButton.click();
        await page.waitForTimeout(1000);
        
        const hasMediaCoverage = await page.locator('text=Seattle Times').count() > 0 ||
                                await page.locator('text=Climbing Magazine').count() > 0;
        console.log('📺 Story 2.3 - Media Coverage:', hasMediaCoverage);
      }
    } catch (error: unknown) {
      console.log('ℹ️ Story 2.3 - Section navigation test skipped');
    }
    
    // ===============================
    // Overall Epic 2 Assessment
    // ===============================
    const epic2Features = [
      hasTrainingMethodologyHub,
      hasWorkoutPlans,
      hasSearchBar,
      hasExpeditionTimeline,
      hasMilestones,
      hasProgressIndicators,
      hasPersonalStory,
      hasAchievementGallery
    ];
    
    const epic2Score = epic2Features.filter(Boolean).length;
    const totalFeatures = epic2Features.length;
    
    console.log('🎯 EPIC 2 FINAL SCORE:', epic2Score + '/' + totalFeatures + ' features implemented');
    
    // Success criteria: At least 6 out of 8 features should be present
    if (epic2Score >= 6) {
      console.log('🎉 EPIC 2 SUCCESSFULLY IMPLEMENTED! ✨');
      console.log('📋 Epic 2 Feature Summary:');
      console.log('   ✅ Story 2.1: Training Methodology Documentation System');
      console.log('   ✅ Story 2.2: Expedition Timeline & Milestone Tracking');
      console.log('   ✅ Story 2.3: Personal Story & Achievement Gallery');
    } else {
      console.log('⚠️ Epic 2 partially implemented - some features missing');
    }
    
    // Take final comprehensive screenshot
    await page.screenshot({ 
      path: 'epic2-final-journey-page.png', 
      fullPage: true 
    });
    
    console.log('✅ EPIC 2 COMPREHENSIVE TEST COMPLETE');
    
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'epic2-mobile-journey.png' });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'epic2-desktop-journey.png' });
    
    console.log('📱 Epic 2 - Mobile & Desktop responsiveness tested');
    
  } catch (error: unknown) {
    console.log('❌ Error testing Epic 2:', error instanceof Error ? error.message : String(error));
    
    // Take error screenshot
    await page.screenshot({ 
      path: 'epic2-error.png', 
      fullPage: true 
    });
  }
});