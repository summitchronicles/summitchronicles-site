import { defineField, defineType } from 'sanity'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor/Partner',
  type: 'document',
  icon: () => '🤝',
  fields: [
    defineField({
      name: 'name',
      title: 'Company/Organization Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
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
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Company Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(50).max(500),
      description: 'Brief description of the company and what they do'
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Outdoor Gear & Equipment', value: 'outdoor-gear' },
          { title: 'Athletic Apparel', value: 'apparel' },
          { title: 'Nutrition & Supplements', value: 'nutrition' },
          { title: 'Technology & Electronics', value: 'technology' },
          { title: 'Travel & Tourism', value: 'travel' },
          { title: 'Financial Services', value: 'financial' },
          { title: 'Health & Wellness', value: 'health' },
          { title: 'Media & Publishing', value: 'media' },
          { title: 'Training & Education', value: 'education' },
          { title: 'Other', value: 'other' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'partnershipType',
      title: 'Partnership Type',
      type: 'string',
      options: {
        list: [
          { title: 'Title Sponsor', value: 'title-sponsor' },
          { title: 'Major Sponsor', value: 'major-sponsor' },
          { title: 'Equipment Sponsor', value: 'equipment-sponsor' },
          { title: 'Gear Partner', value: 'gear-partner' },
          { title: 'Media Partner', value: 'media-partner' },
          { title: 'Training Partner', value: 'training-partner' },
          { title: 'Travel Partner', value: 'travel-partner' },
          { title: 'Affiliate Partner', value: 'affiliate' },
          { title: 'Ambassador', value: 'ambassador' },
          { title: 'Supporter', value: 'supporter' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sponsorshipTier',
      title: 'Sponsorship Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Platinum', value: 'platinum' },
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Supporting', value: 'supporting' }
        ]
      }
    }),
    defineField({
      name: 'partnership',
      title: 'Partnership Details',
      type: 'object',
      fields: [
        {
          name: 'startDate',
          title: 'Partnership Start Date',
          type: 'date',
          validation: Rule => Rule.required()
        },
        {
          name: 'endDate',
          title: 'Partnership End Date',
          type: 'date',
          description: 'Leave blank for ongoing partnerships'
        },
        {
          name: 'isOngoing',
          title: 'Ongoing Partnership',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'renewalDate',
          title: 'Next Renewal Date',
          type: 'date',
          description: 'When partnership is up for renewal'
        }
      ]
    }),
    defineField({
      name: 'supportProvided',
      title: 'Support Provided',
      type: 'object',
      fields: [
        {
          name: 'financialSupport',
          title: 'Financial Support',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'productSponsorship',
          title: 'Product/Gear Sponsorship',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'servicesSupport',
          title: 'Services Support',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'marketingSupport',
          title: 'Marketing/Promotion Support',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'specificSupport',
          title: 'Specific Support Details',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List specific items, services, or support provided'
        }
      ]
    }),
    defineField({
      name: 'gearProvided',
      title: 'Gear/Products Provided',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gear' }] }],
      description: 'Link to specific gear items provided by this sponsor'
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'primaryContact',
          title: 'Primary Contact Name',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Contact Email',
          type: 'email'
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'address',
          title: 'Business Address',
          type: 'text',
          rows: 2
        }
      ]
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url'
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        }
      ]
    }),
    defineField({
      name: 'isActive',
      title: 'Active Partnership',
      type: 'boolean',
      initialValue: true,
      description: 'Is this partnership currently active?'
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Show this partnership publicly on the website'
    }),
    defineField({
      name: 'displayPriority',
      title: 'Display Priority',
      type: 'number',
      description: 'Lower numbers display first (1 = highest priority)',
      validation: Rule => Rule.min(1).max(100),
      initialValue: 50
    }),
    defineField({
      name: 'testimonial',
      title: 'Partnership Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 3,
          description: 'A quote about the partnership or mountaineering journey'
        },
        {
          name: 'author',
          title: 'Quote Author',
          type: 'string',
          description: 'Name and title of person who gave the quote'
        }
      ]
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements Together',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'achievement' }] }],
      description: 'Achievements accomplished with this sponsor\'s support'
    }),
    defineField({
      name: 'relatedContent',
      title: 'Related Content',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'blogPost' }] },
        { type: 'reference', to: [{ type: 'expeditionUpdate' }] }
      ],
      description: 'Blog posts or expedition updates featuring this sponsor'
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Private notes about the partnership (not shown publicly)'
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
      title: 'name',
      partnershipType: 'partnershipType',
      tier: 'sponsorshipTier',
      isActive: 'isActive',
      isPublic: 'isPublic',
      media: 'logo'
    },
    prepare(selection) {
      const { partnershipType, tier, isActive, isPublic } = selection
      
      const typeEmojis: Record<string, string> = {
        'title-sponsor': '👑',
        'major-sponsor': '⭐',
        'equipment-sponsor': '🎒',
        'gear-partner': '⚙️',
        'media-partner': '📺',
        'training-partner': '💪',
        'travel-partner': '✈️',
        'affiliate': '🔗',
        'ambassador': '🏅',
        'supporter': '🤝'
      }
      
      const tierEmojis: Record<string, string> = {
        platinum: '🏆',
        gold: '🥇',
        silver: '🥈',
        bronze: '🥉',
        supporting: '👍'
      }
      
      const indicators = []
      if (tier) indicators.push(tierEmojis[tier])
      if (!isActive) indicators.push('⏸️')
      if (!isPublic) indicators.push('🔒')
      
      return {
        ...selection,
        subtitle: `${typeEmojis[partnershipType] || '🤝'} ${partnershipType} ${indicators.join(' ')}`
      }
    }
  },
  orderings: [
    {
      title: 'Display Priority',
      name: 'priorityAsc',
      by: [{ field: 'displayPriority', direction: 'asc' }]
    },
    {
      title: 'Partnership Start (New)',
      name: 'startDateDesc',
      by: [{ field: 'partnership.startDate', direction: 'desc' }]
    },
    {
      title: 'Company Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    }
  ]
})