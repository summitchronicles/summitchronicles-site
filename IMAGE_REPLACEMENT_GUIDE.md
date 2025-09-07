# Personal Expedition Image Replacement Guide

This document outlines all the locations where stock Unsplash images need to be replaced with personal expedition photos to make the portfolio authentic.

## Current Issues
- All mountain/expedition images are stock photos from Unsplash
- Profile photos are placeholder images
- Expedition galleries use generic mountain photos instead of actual summit photos
- Training photos don't show real personal training activities

## Image Replacement Locations

### 1. Hero Section (`app/components/hero/EnhancedModernHero.tsx`)
**Lines 44-48**: Expedition preview images
```typescript
const expeditionPreviews: ExpeditionPreview[] = [
  { id: '1', title: 'Mount Everest', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', status: 'upcoming', elevation: '8,849m' },
  { id: '2', title: 'Kilimanjaro', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300', status: 'completed', elevation: '5,895m' },
  { id: '3', title: 'Aconcagua', image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=300', status: 'completed', elevation: '6,962m' },
];
```

**Recommended replacements:**
- Replace with actual summit photos from completed expeditions
- Add personal photos from base camps, climbing moments
- Include gear setup photos, team photos

### 2. Seven Summits Tracker (`app/components/sections/EnhancedSevenSummitsTracker.tsx`)
**Lines 50-175**: Complete summit data with images and galleries
```typescript
// Each summit has:
image: "https://images.unsplash.com/photo-...?w=400"
gallery: [
  "https://images.unsplash.com/photo-...?w=300",
  "https://images.unsplash.com/photo-...?w=300",
  "https://images.unsplash.com/photo-...?w=300"
]
```

**Recommended replacements:**
- **Mount Elbrus**: Personal summit photos, route photos, team photos
- **Mount Kilimanjaro**: Uhuru Peak summit photo, different climate zone photos
- **Aconcagua**: High camp photos, summit attempt photos, weather challenges
- **Planned expeditions**: Training photos, gear preparation, route research

### 3. Expedition Timeline (`app/components/sections/ExpeditionTimeline.tsx`)
**Various lines**: Timeline expedition images

### 4. Modern Content Section (`app/components/sections/ModernContent.tsx`)
**Various lines**: Blog post and content images

### 5. Other Pages
- `app/expeditions/page.tsx`
- `app/gear/page.tsx`
- `app/components/hero/HeroSection.tsx`

## Recommended Image Categories

### Personal Expedition Photos Needed:
1. **Summit Photos**: 
   - Personal photos at each completed summit
   - GPS coordinates and elevation markers visible
   - Personal achievement moments

2. **Journey Photos**:
   - Base camp setups
   - Climbing action shots
   - Weather challenges
   - Team interactions

3. **Training Photos**:
   - Real training activities
   - Gym workouts focused on mountaineering
   - Outdoor training hikes
   - Gear testing

4. **Gear Photos**:
   - Personal gear layouts
   - Equipment in use during expeditions
   - Gear testing and preparation

5. **Profile Photos**:
   - Professional mountaineering portraits
   - Action shots during climbs
   - Training facility photos

## Implementation Steps

1. **Create an images directory structure:**
```
public/images/
├── expeditions/
│   ├── elbrus/
│   ├── kilimanjaro/
│   ├── aconcagua/
│   └── planned/
├── training/
├── gear/
├── profile/
└── misc/
```

2. **Update image references in components:**
   - Replace Unsplash URLs with `/images/[category]/[specific-image].jpg`
   - Ensure proper alt text descriptions
   - Add image optimization with Next.js Image component

3. **Add image metadata:**
   - Include expedition dates
   - GPS coordinates where possible
   - Brief descriptions for accessibility

## Benefits of Using Personal Images

1. **Authenticity**: Real expedition photos build trust and credibility
2. **Storytelling**: Personal photos tell your unique mountaineering story  
3. **SEO**: Original images improve search engine optimization
4. **Engagement**: Personal photos create stronger emotional connections
5. **Portfolio Value**: Real expedition photos demonstrate actual achievements

## Technical Notes

- All images should be optimized for web (compressed but high quality)
- Use Next.js Image component for automatic optimization
- Consider using WebP format for better compression
- Maintain aspect ratios consistent with current placeholder dimensions
- Add proper alt text for accessibility

## Priority Order

1. **High Priority**: Summit photos, major expedition moments
2. **Medium Priority**: Training photos, gear photos
3. **Low Priority**: Miscellaneous travel/preparation photos

---

**Note**: This portfolio currently uses stock images as placeholders. Replacing them with authentic personal expedition photos will significantly enhance the credibility and impact of the mountaineering portfolio.