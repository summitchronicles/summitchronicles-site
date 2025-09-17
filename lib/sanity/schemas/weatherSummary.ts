import { defineType, defineField } from 'sanity';

export const weatherSummary = defineType({
  name: 'weatherSummary',
  title: 'Weather Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locations',
      title: 'Location Data',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Location Name',
              type: 'string',
            }),
            defineField({
              name: 'temperature',
              title: 'Temperature (°C)',
              type: 'number',
            }),
            defineField({
              name: 'conditions',
              title: 'Weather Conditions',
              type: 'string',
            }),
            defineField({
              name: 'climbingWindow',
              title: 'Climbing Window Open',
              type: 'boolean',
            }),
            defineField({
              name: 'avalancheRisk',
              title: 'Avalanche Risk',
              type: 'string',
              options: {
                list: [
                  { title: 'Low', value: 'low' },
                  { title: 'Moderate', value: 'moderate' },
                  { title: 'Considerable', value: 'considerable' },
                  { title: 'High', value: 'high' },
                  { title: 'Extreme', value: 'extreme' },
                ],
              },
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      timestamp: 'timestamp',
      locationCount: 'locations',
    },
    prepare({ timestamp, locationCount }) {
      return {
        title: `Weather Summary - ${new Date(timestamp).toLocaleDateString()}`,
        subtitle: `${locationCount?.length || 0} locations`,
      };
    },
  },
});
