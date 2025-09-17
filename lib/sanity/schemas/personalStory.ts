import { defineField, defineType } from 'sanity';

export const personalStory = defineType({
  name: 'personalStory',
  title: 'Personal Story',
  type: 'document',
  icon: () => '📖',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(300),
      description: 'A brief summary that appears in story listings',
    }),
    defineField({
      name: 'content',
      title: 'Story Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
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
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'category',
      title: 'Story Category',
      type: 'string',
      options: {
        list: [
          { title: 'Origin Story', value: 'origin' },
          { title: 'Childhood', value: 'childhood' },
          { title: 'Early Adventures', value: 'early-adventures' },
          { title: 'Life Lessons', value: 'life-lessons' },
          { title: 'Challenges Overcome', value: 'challenges' },
          { title: 'Mentors & Influences', value: 'mentors' },
          { title: 'Personal Growth', value: 'growth' },
          { title: 'Family & Relationships', value: 'family' },
          { title: 'Career Journey', value: 'career' },
          { title: 'Philosophy & Values', value: 'philosophy' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeframe',
      title: 'Time Period',
      type: 'object',
      fields: [
        {
          name: 'era',
          title: 'Era/Period',
          type: 'string',
          description: 'e.g., "Early 2000s", "Childhood", "College Years"',
        },
        {
          name: 'specificDate',
          title: 'Specific Date',
          type: 'date',
          description: 'If the story happened on a specific date',
        },
        {
          name: 'ageRange',
          title: 'Age Range',
          type: 'string',
          description: 'e.g., "Age 8-12", "Early 20s"',
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Primary Location',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Location Name',
          type: 'string',
        },
        {
          name: 'significance',
          title: 'Why This Location Matters',
          type: 'text',
          rows: 2,
        },
      ],
    }),
    defineField({
      name: 'themes',
      title: 'Story Themes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Perseverance', value: 'perseverance' },
          { title: 'Family', value: 'family' },
          { title: 'Adventure', value: 'adventure' },
          { title: 'Fear & Courage', value: 'courage' },
          { title: 'Discovery', value: 'discovery' },
          { title: 'Failure & Learning', value: 'learning' },
          { title: 'Friendship', value: 'friendship' },
          { title: 'Nature Connection', value: 'nature' },
          { title: 'Self-Discovery', value: 'self-discovery' },
          { title: 'Inspiration', value: 'inspiration' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Story',
      type: 'boolean',
      initialValue: false,
      description: 'Highlight this story on the main stories page',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (for chronological ordering)',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'relatedStories',
      title: 'Related Stories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'personalStory' }] }],
      description: 'Link to other personal stories that connect to this one',
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
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      isPublished: 'isPublished',
      isFeatured: 'isFeatured',
      order: 'order',
      media: 'featuredImage',
    },
    prepare(selection) {
      const { category, isPublished, isFeatured, order } = selection;

      const categoryEmojis: Record<string, string> = {
        origin: '🌱',
        childhood: '👶',
        'early-adventures': '🏃‍♂️',
        'life-lessons': '💡',
        challenges: '💪',
        mentors: '👥',
        growth: '🌳',
        family: '👨‍👩‍👧‍👦',
        career: '💼',
        philosophy: '🤔',
      };

      const indicators = [];
      if (isFeatured) indicators.push('⭐');
      if (!isPublished) indicators.push('🔒');
      if (order !== undefined) indicators.push(`#${order}`);

      return {
        ...selection,
        subtitle: `${categoryEmojis[category] || '📖'} ${category} ${indicators.join(' ')}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Published Date, New',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
