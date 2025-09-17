import { defineField, defineType } from 'sanity'

export const achievement = defineType({
  name: 'achievement',
  title: 'Achievement',
  type: 'document',
  icon: () => '🏆',
  fields: [
    defineField({
      name: 'title',
      title: 'Achievement Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(100)
    }),
    defineField({
      name: 'date',
      title: 'Achievement Date',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Achievement Type',
      type: 'string',
      options: {
        list: [
          { title: 'Summit', value: 'summit' },
          { title: 'Race/Competition', value: 'race' },
          { title: 'Certification', value: 'certification' },
          { title: 'Personal Best', value: 'personal-best' },
          { title: 'Expedition Complete', value: 'expedition' },
          { title: 'Skills Milestone', value: 'skills' },
          { title: 'Endurance Challenge', value: 'endurance' },
          { title: 'First Ascent', value: 'first-ascent' },
          { title: 'Speed Record', value: 'speed-record' },
          { title: 'Rescue/Volunteer', value: 'rescue' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(50).max(500),
      description: 'Detailed description of the achievement'
    }),
    defineField({
      name: 'significance',
      title: 'Why This Matters',
      type: 'text',
      rows: 3,
      description: 'Personal significance and what this achievement means to you'
    }),
    defineField({
      name: 'photos',
      title: 'Achievement Photos',
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'metrics',
      title: 'Achievement Metrics',
      type: 'object',
      fields: [
        {
          name: 'elevation',
          title: 'Peak Elevation (feet)',
          type: 'number'
        },
        {
          name: 'distance',
          title: 'Distance (miles)',
          type: 'number'
        },
        {
          name: 'duration',
          title: 'Duration',
          type: 'string',
          description: 'e.g., "3 days", "5 hours 30 minutes"'
        },
        {
          name: 'difficulty',
          title: 'Difficulty Rating',
          type: 'string',
          options: {
            list: [
              { title: 'Beginner', value: 'beginner' },
              { title: 'Intermediate', value: 'intermediate' },
              { title: 'Advanced', value: 'advanced' },
              { title: 'Expert', value: 'expert' },
              { title: 'Elite', value: 'elite' }
            ]
          }
        },
        {
          name: 'weatherConditions',
          title: 'Weather Conditions',
          type: 'string'
        },
        {
          name: 'teamSize',
          title: 'Team Size',
          type: 'number',
          description: 'Number of people involved'
        }
      ]
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
          validation: Rule => Rule.required()
        },
        {
          name: 'coordinates',
          title: 'GPS Coordinates',
          type: 'geopoint'
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string'
        },
        {
          name: 'region',
          title: 'State/Province/Region',
          type: 'string'
        },
        {
          name: 'mountainRange',
          title: 'Mountain Range',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'certification',
      title: 'Certification Details',
      type: 'object',
      fields: [
        {
          name: 'organization',
          title: 'Certifying Organization',
          type: 'string'
        },
        {
          name: 'certificateNumber',
          title: 'Certificate Number',
          type: 'string'
        },
        {
          name: 'validUntil',
          title: 'Valid Until',
          type: 'date'
        },
        {
          name: 'level',
          title: 'Certification Level',
          type: 'string'
        }
      ],
      hidden: ({document}) => document?.type !== 'certification'
    }),
    defineField({
      name: 'raceResults',
      title: 'Race Results',
      type: 'object',
      fields: [
        {
          name: 'placement',
          title: 'Overall Placement',
          type: 'number'
        },
        {
          name: 'categoryPlacement',
          title: 'Category Placement',
          type: 'number'
        },
        {
          name: 'category',
          title: 'Category',
          type: 'string',
          description: 'e.g., "Men 30-39", "Elite Women"'
        },
        {
          name: 'finishTime',
          title: 'Finish Time',
          type: 'string',
          description: 'e.g., "2:45:30"'
        },
        {
          name: 'totalParticipants',
          title: 'Total Participants',
          type: 'number'
        }
      ],
      hidden: ({document}) => document?.type !== 'race'
    }),
    defineField({
      name: 'gear',
      title: 'Key Gear Used',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gear' }] }],
      description: 'Reference gear items that were crucial for this achievement'
    }),
    defineField({
      name: 'challenges',
      title: 'Challenges Overcome',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of specific challenges faced and overcome'
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string'
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'relatedContent',
      title: 'Related Content',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'blogPost' }] },
        { type: 'reference', to: [{ type: 'expeditionUpdate' }] },
        { type: 'reference', to: [{ type: 'trainingEntry' }] }
      ],
      description: 'Link to blog posts, expeditions, or training that relate to this achievement'
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Show this achievement publicly'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Achievement',
      type: 'boolean',
      initialValue: false,
      description: 'Highlight this achievement on main pages'
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
      type: 'type',
      date: 'date',
      location: 'location.name',
      isPublic: 'isPublic',
      isFeatured: 'isFeatured',
      media: 'featuredImage'
    },
    prepare(selection) {
      const { type, date, location, isPublic, isFeatured } = selection
      
      const typeEmojis: Record<string, string> = {
        summit: '🏔️',
        race: '🏃‍♂️',
        certification: '📜',
        'personal-best': '🎯',
        expedition: '🗺️',
        skills: '🧗‍♂️',
        endurance: '💪',
        'first-ascent': '🥇',
        'speed-record': '⚡',
        rescue: '🚑'
      }
      
      const indicators = []
      if (isFeatured) indicators.push('⭐')
      if (!isPublic) indicators.push('🔒')
      
      const formattedDate = new Date(date).toLocaleDateString()
      
      return {
        ...selection,
        subtitle: `${typeEmojis[type] || '🏆'} ${location || 'Location TBD'} • ${formattedDate} ${indicators.join(' ')}`
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
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})