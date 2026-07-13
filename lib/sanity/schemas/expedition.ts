import { defineField, defineType } from 'sanity';

export const expedition = defineType({
  name: 'expedition',
  title: 'Expedition',
  type: 'document',
  icon: () => 'EXP',
  fields: [
    defineField({
      name: 'name',
      title: 'Expedition name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mountain',
      title: 'Mountain or route',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'elevationFeet',
      title: 'Elevation (feet)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
    }),
    defineField({
      name: 'displayDate',
      title: 'Display date',
      type: 'string',
      description:
        'Use when the exact date is unknown, for example Spring 2028.',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1900).max(2200),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Planned', value: 'planned' },
          { title: 'In preparation', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(40).max(500),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'legacyImagePath',
      title: 'Existing site image path',
      type: 'string',
      description:
        'Migration bridge used until this image is uploaded to Sanity.',
      readOnly: true,
    }),
    defineField({
      name: 'isSevenSummit',
      title: 'Seven Summits objective',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'stats',
      title: 'Verified expedition statistics',
      type: 'object',
      fields: [
        defineField({ name: 'duration', title: 'Duration', type: 'string' }),
        defineField({
          name: 'difficulty',
          title: 'Difficulty',
          type: 'string',
        }),
        defineField({
          name: 'temperature',
          title: 'Observed temperature',
          type: 'string',
          description: 'Only enter a value supported by expedition records.',
        }),
      ],
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'displayDate',
      media: 'coverImage',
    },
  },
});
