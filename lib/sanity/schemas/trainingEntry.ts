import { defineField, defineType } from 'sanity';

export const trainingEntry = defineType({
  name: 'trainingEntry',
  title: 'Training Entry',
  type: 'document',
  icon: () => '🏔️',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Training Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Training Type',
      type: 'string',
      options: {
        list: [
          { title: 'Cardiovascular Endurance', value: 'cardio' },
          { title: 'Strength Training', value: 'strength' },
          { title: 'Technical Skills', value: 'technical' },
          { title: 'Altitude Training', value: 'altitude' },
          { title: 'Hiking/Trekking', value: 'hiking' },
          { title: 'Climbing', value: 'climbing' },
          { title: 'Recovery', value: 'recovery' },
          { title: 'Cross Training', value: 'cross' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'intensity',
      title: 'Intensity Level',
      type: 'string',
      options: {
        list: [
          { title: 'Low (1-3)', value: 'low' },
          { title: 'Moderate (4-6)', value: 'moderate' },
          { title: 'High (7-8)', value: 'high' },
          { title: 'Maximum (9-10)', value: 'maximum' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'metrics',
      title: 'Performance Metrics',
      type: 'object',
      fields: [
        {
          name: 'distance',
          title: 'Distance (miles)',
          type: 'number',
        },
        {
          name: 'elevationGain',
          title: 'Elevation Gain (feet)',
          type: 'number',
        },
        {
          name: 'heartRateAvg',
          title: 'Average Heart Rate',
          type: 'number',
        },
        {
          name: 'heartRateMax',
          title: 'Maximum Heart Rate',
          type: 'number',
        },
        {
          name: 'calories',
          title: 'Calories Burned',
          type: 'number',
        },
        {
          name: 'weight',
          title: 'Pack Weight (lbs)',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Location Name',
          type: 'string',
        },
        {
          name: 'coordinates',
          title: 'GPS Coordinates',
          type: 'geopoint',
        },
        {
          name: 'weather',
          title: 'Weather Conditions',
          type: 'string',
        },
        {
          name: 'temperature',
          title: 'Temperature (°F)',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'goals',
      title: 'Training Goals',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'reflections',
      title: 'Post-Training Reflections',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photos',
      title: 'Training Photos',
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
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'stravaId',
      title: 'Strava Activity ID',
      type: 'string',
      description: 'Link to Strava activity for automatic data sync',
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
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
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      date: 'date',
      duration: 'duration',
    },
    prepare(selection) {
      const { type, date, duration } = selection;
      const typeLabels: Record<string, string> = {
        cardio: '🏃',
        strength: '💪',
        technical: '🧗',
        altitude: '⛰️',
        hiking: '🥾',
        climbing: '🧗‍♂️',
        recovery: '🧘',
        cross: '🏋️',
      };

      return {
        ...selection,
        subtitle: `${typeLabels[type] || '🏔️'} ${date} • ${duration}min`,
      };
    },
  },
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date, Old',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
});
