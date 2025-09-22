const fs = require('fs');
const path = require('path');

class SimpleSemanticMatcher {
  constructor() {
    // Mountaineering-focused keyword mapping
    this.keywordMap = {
      // Hero/Opening content
      "hero": [
        "introduction", "beginning", "started", "journey", "mountain", "challenge",
        "decision", "dream", "goal", "expedition", "adventure", "calling"
      ],

      // Problem/Struggle content
      "struggle": [
        "difficult", "failed", "challenge", "problem", "obstacle", "doubt",
        "fear", "anxiety", "setback", "crisis", "overwhelmed", "breaking"
      ],

      // Training/Preparation content
      "preparation": [
        "training", "preparation", "practice", "conditioning", "building",
        "studying", "planning", "methodology", "systematic", "discipline"
      ],

      // Solution/Breakthrough content
      "breakthrough": [
        "realized", "solution", "breakthrough", "clarity", "understood",
        "insight", "epiphany", "turning", "discovery", "revelation"
      ],

      // Achievement/Success content
      "climax": [
        "summit", "achievement", "success", "accomplished", "reached", "victory",
        "triumph", "peak", "pinnacle", "culmination", "finally"
      ],

      // Reflection/Wisdom content
      "reflection": [
        "learned", "reflection", "wisdom", "growth", "changed", "perspective",
        "meaning", "lesson", "understanding", "transformation", "insight"
      ]
    };

    // Image type scoring for auto-detection
    this.imageTypes = {
      "hero": ["hero", "wide", "panoramic", "landscape", "dramatic", "mountain"],
      "section": ["training", "preparation", "detail", "close", "action", "process"],
      "climax": ["summit", "achievement", "peak", "victory", "celebration", "view"],
      "reflection": ["contemplative", "quiet", "solitary", "peaceful", "horizon"]
    };
  }

  // Analyze section content and determine dominant theme
  analyzeSection(text) {
    const words = text.toLowerCase().split(/\s+/);
    const scores = {};

    // Calculate scores for each category
    Object.entries(this.keywordMap).forEach(([category, keywords]) => {
      scores[category] = keywords.filter(keyword =>
        words.some(word => word.includes(keyword) || keyword.includes(word))
      ).length;
    });

    // Return category with highest score, or 'narrative' as fallback
    const maxCategory = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b, 'narrative'
    );

    return scores[maxCategory] > 0 ? maxCategory : 'narrative';
  }

  // Extract sections from markdown content
  extractSections(content) {
    // Split by headers (# or ##)
    const sections = content.split(/^#{1,2}\s+/m).filter(section => section.trim());

    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n').trim();

      return {
        id: `section-${index}`,
        title: title,
        content: content,
        type: this.analyzeSection(content),
        pullQuote: this.extractPullQuote(content)
      };
    });
  }

  // Extract pull quotes (text in > blockquotes)
  extractPullQuote(text) {
    const quoteMatch = text.match(/^>\s*(.+)$/m);
    return quoteMatch ? quoteMatch[1].replace(/"/g, '') : null;
  }

  // Infer image type from filename and keywords
  inferImageType(filename, keywords = '') {
    const name = filename.toLowerCase();
    const keywordText = keywords.toLowerCase();

    for (const [type, indicators] of Object.entries(this.imageTypes)) {
      if (indicators.some(indicator =>
        name.includes(indicator) || keywordText.includes(indicator)
      )) {
        return type;
      }
    }

    return 'section'; // default fallback
  }

  // Match images to sections based on semantic analysis
  matchImages(sections, images) {
    const imageMap = new Map();

    // First pass: exact type matches
    sections.forEach(section => {
      const matchingImage = images.find(img =>
        img.type === section.type && !imageMap.has(img.file)
      );

      if (matchingImage) {
        imageMap.set(matchingImage.file, section.id);
        section.image = matchingImage;
      }
    });

    // Second pass: keyword matching for unmatched sections
    sections.filter(section => !section.image).forEach(section => {
      const matchingImage = images.find(img => {
        if (imageMap.has(img.file)) return false;

        const keywords = (img.keywords || '').toLowerCase().split(',').map(k => k.trim());
        return keywords.some(keyword =>
          section.content.toLowerCase().includes(keyword) ||
          section.title.toLowerCase().includes(keyword)
        );
      });

      if (matchingImage) {
        imageMap.set(matchingImage.file, section.id);
        section.image = matchingImage;
      }
    });

    // Third pass: distribute remaining images evenly
    const unmatched = sections.filter(section => !section.image);
    const unusedImages = images.filter(img => !imageMap.has(img.file));

    unmatched.forEach((section, index) => {
      if (unusedImages[index]) {
        section.image = unusedImages[index];
      }
    });

    return sections;
  }

  // Generate layout based on style
  generateLayout(style, sections, images, metadata) {
    const heroImage = images.find(img => img.type === 'hero') || images[0];
    const climaxImage = images.find(img => img.type === 'climax');

    if (style === 'cinematic') {
      return {
        type: 'cinematic',
        hero: {
          image: heroImage,
          fullScreen: true,
          overlay: 'gradient'
        },
        sections: sections.map(section => ({
          ...section,
          layout: section.type === 'climax' ? 'emphasis' : 'standard'
        })),
        climaxMoment: climaxImage ? {
          image: climaxImage,
          placement: 'section-break',
          size: 'large'
        } : null
      };
    }

    // Default to Red Bull style
    return {
      type: 'redbull',
      hero: {
        image: heroImage,
        height: '70vh',
        overlay: 'light'
      },
      sections: sections.map((section, index) => ({
        ...section,
        imagePosition: index % 2 === 0 ? 'right' : 'left',
        showImage: section.image && (index === 0 || index % 2 === 0),
        emphasis: section.type === 'climax' || section.type === 'breakthrough'
      }))
    };
  }
}

module.exports = SimpleSemanticMatcher;