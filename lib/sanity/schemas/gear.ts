import { defineField, defineType } from 'sanity';

export const gear = defineType({
  name: 'gear',
  title: 'Gear',
  type: 'document',
  icon: () => '🎒',
  fields: [
    defineField({
      name: 'name',
      title: 'Gear Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'Specific model name or number',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Backpacks & Bags', value: 'backpacks' },
          { title: 'Footwear', value: 'footwear' },
          { title: 'Clothing & Layers', value: 'clothing' },
          { title: 'Climbing Gear', value: 'climbing' },
          { title: 'Navigation & GPS', value: 'navigation' },
          { title: 'Safety & Emergency', value: 'safety' },
          { title: 'Shelter & Sleep', value: 'shelter' },
          { title: 'Cooking & Hydration', value: 'cooking' },
          { title: 'Electronics', value: 'electronics' },
          { title: 'Tools & Multi-tools', value: 'tools' },
          { title: 'Training Equipment', value: 'training' },
          { title: 'Weather Protection', value: 'weather' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50).max(1000),
      description: 'Detailed description of the gear and its features',
    }),
    defineField({
      name: 'photos',
      title: 'Product Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one photo is required'),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'review',
      title: 'Personal Review',
      type: 'object',
      fields: [
        {
          name: 'rating',
          title: 'Overall Rating',
          type: 'number',
          validation: (Rule) => Rule.required().min(1).max(5).precision(1),
          description: 'Rating from 1-5 stars',
        },
        {
          name: 'pros',
          title: 'Pros',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'What you like about this gear',
        },
        {
          name: 'cons',
          title: 'Cons',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'What could be improved',
        },
        {
          name: 'summary',
          title: 'Review Summary',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().min(50).max(500),
        },
        {
          name: 'wouldRecommend',
          title: 'Would Recommend',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'bestFor',
          title: 'Best For',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'What activities/conditions this gear excels in',
        },
      ],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        {
          name: 'weight',
          title: 'Weight',
          type: 'string',
          description: 'e.g., "2.5 lbs", "850g"',
        },
        {
          name: 'dimensions',
          title: 'Dimensions',
          type: 'string',
          description: 'e.g., "24 x 12 x 8 inches"',
        },
        {
          name: 'materials',
          title: 'Materials',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Primary materials used',
        },
        {
          name: 'capacity',
          title: 'Capacity/Volume',
          type: 'string',
          description: 'e.g., "65L", "500ml", "2-person"',
        },
        {
          name: 'temperatureRating',
          title: 'Temperature Rating',
          type: 'string',
          description: 'For sleeping bags, clothing, etc.',
        },
        {
          name: 'waterproof',
          title: 'Waterproof Rating',
          type: 'string',
          description: 'e.g., "10,000mm", "DWR coating"',
        },
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        {
          name: 'price',
          title: 'Current Price (USD)',
          type: 'number',
          description: 'Price in US dollars',
        },
        {
          name: 'priceRange',
          title: 'Price Range',
          type: 'string',
          options: {
            list: [
              { title: 'Budget ($0-50)', value: 'budget' },
              { title: 'Mid-range ($51-150)', value: 'mid-range' },
              { title: 'Premium ($151-300)', value: 'premium' },
              { title: 'Luxury ($300+)', value: 'luxury' },
            ],
          },
        },
        {
          name: 'valueRating',
          title: 'Value for Money',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(5).precision(1),
          description: 'How good is the value? (1-5 stars)',
        },
      ],
    }),
    defineField({
      name: 'affiliateLink',
      title: 'Affiliate/Purchase Link',
      type: 'url',
      description: 'Link where people can purchase this gear',
    }),
    defineField({
      name: 'whereToBuy',
      title: 'Where to Buy',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'retailer',
              title: 'Retailer',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'experienceWith',
      title: 'Experience With This Gear',
      type: 'object',
      fields: [
        {
          name: 'timeOwned',
          title: 'Time Owned',
          type: 'string',
          description: 'e.g., "2 years", "6 months"',
        },
        {
          name: 'milesUsed',
          title: 'Miles Used',
          type: 'number',
          description: 'Approximate miles this gear has seen',
        },
        {
          name: 'conditionsUsed',
          title: 'Conditions Used In',
          type: 'array',
          of: [{ type: 'string' }],
          description: "Weather/terrain conditions you've used this in",
        },
        {
          name: 'expeditions',
          title: 'Notable Expeditions',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Major trips where this gear was used',
        },
      ],
    }),
    defineField({
      name: 'alternatives',
      title: 'Similar/Alternative Gear',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gear' }] }],
      description: 'Other gear items that serve similar purposes',
    }),
    defineField({
      name: 'isRecommended',
      title: 'Recommended',
      type: 'boolean',
      initialValue: true,
      description: 'Do you recommend this gear to others?',
    }),
    defineField({
      name: 'isCurrentlyUsing',
      title: 'Currently Using',
      type: 'boolean',
      initialValue: true,
      description: 'Are you still actively using this gear?',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'relatedContent',
      title: 'Related Content',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'blogPost' }] },
        { type: 'reference', to: [{ type: 'expeditionUpdate' }] },
        { type: 'reference', to: [{ type: 'achievement' }] },
      ],
      description: 'Content where this gear is featured or mentioned',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      brand: 'brand',
      category: 'category',
      rating: 'review.rating',
      isRecommended: 'isRecommended',
      media: 'featuredImage',
    },
    prepare(selection) {
      const { brand, category, rating, isRecommended } = selection;

      const categoryEmojis: Record<string, string> = {
        backpacks: '🎒',
        footwear: '👢',
        clothing: '🧥',
        climbing: '🧗‍♂️',
        navigation: '🧭',
        safety: '🚨',
        shelter: '⛺',
        cooking: '🍳',
        electronics: '📱',
        tools: '🔧',
        training: '💪',
        weather: '☔',
      };

      const indicators = [];
      if (rating) indicators.push(`⭐${rating}`);
      if (isRecommended) indicators.push('✅');
      else indicators.push('❌');

      return {
        ...selection,
        subtitle: `${categoryEmojis[category] || '🎒'} ${brand} ${indicators.join(' ')}`,
      };
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Rating (High to Low)',
      name: 'ratingDesc',
      by: [{ field: 'review.rating', direction: 'desc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
});
