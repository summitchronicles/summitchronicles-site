import { defineField, defineType } from 'sanity'

export const expeditionUpdate = defineType({
  name: 'expeditionUpdate',
  title: 'Expedition Update',
  type: 'document',
  icon: () => '🏔️',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().min(10).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Update Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'expedition',
      title: 'Expedition',
      type: 'reference',
      to: [{ type: 'blogPost' }], // Reference to main expedition blog post
      description: 'Link to the main expedition blog post',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Update Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' }
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
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: 'Current Location',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Location Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'coordinates',
          title: 'GPS Coordinates',
          type: 'geopoint'
        },
        {
          name: 'altitude',
          title: 'Altitude (feet)',
          type: 'number'
        },
        {
          name: 'weather',
          title: 'Weather Conditions',
          type: 'string'
        },
        {
          name: 'temperature',
          title: 'Temperature (°F)',
          type: 'number'
        }
      ]
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
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
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'metrics',
      title: 'Daily Metrics',
      type: 'object',
      fields: [
        {
          name: 'distance',
          title: 'Distance Covered (miles)',
          type: 'number'
        },
        {
          name: 'elevation',
          title: 'Elevation Gained (feet)',
          type: 'number'
        },
        {
          name: 'weather',
          title: 'Weather Summary',
          type: 'string'
        },
        {
          name: 'visibility',
          title: 'Visibility',
          type: 'string',
          options: {
            list: [
              { title: 'Excellent', value: 'excellent' },
              { title: 'Good', value: 'good' },
              { title: 'Fair', value: 'fair' },
              { title: 'Poor', value: 'poor' },
              { title: 'Zero', value: 'zero' }
            ]
          }
        },
        {
          name: 'windSpeed',
          title: 'Wind Speed (mph)',
          type: 'number'
        },
        {
          name: 'teamMorale',
          title: 'Team Morale',
          type: 'string',
          options: {
            list: [
              { title: 'Excellent', value: 'excellent' },
              { title: 'Good', value: 'good' },
              { title: 'Fair', value: 'fair' },
              { title: 'Low', value: 'low' },
              { title: 'Critical', value: 'critical' }
            ]
          }
        }
      ]
    }),
    defineField({
      name: 'status',
      title: 'Expedition Status',
      type: 'string',
      options: {
        list: [
          { title: 'On Schedule', value: 'on-schedule' },
          { title: 'Ahead of Schedule', value: 'ahead' },
          { title: 'Behind Schedule', value: 'behind' },
          { title: 'Weather Hold', value: 'weather-hold' },
          { title: 'Rest Day', value: 'rest-day' },
          { title: 'Emergency', value: 'emergency' },
          { title: 'Completed', value: 'completed' },
          { title: 'Abandoned', value: 'abandoned' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Make this update visible to the public'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      status: 'status',
      location: 'location.name',
      isPublic: 'isPublic'
    },
    prepare(selection) {
      const { date, status, location, isPublic } = selection
      const statusEmojis: Record<string, string> = {
        'on-schedule': '✅',
        'ahead': '🚀',
        'behind': '⚠️',
        'weather-hold': '🌩️',
        'rest-day': '😴',
        'emergency': '🚨',
        'completed': '🏆',
        'abandoned': '❌'
      }
      
      const formattedDate = new Date(date).toLocaleDateString()
      
      return {
        ...selection,
        subtitle: `${statusEmojis[status] || '📍'} ${location || 'Unknown'} • ${formattedDate} ${isPublic ? '🌐' : '🔒'}`
      }
    }
  },
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Date, Old',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    }
  ]
})