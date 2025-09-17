import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
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
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email'
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url'
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        },
        {
          name: 'strava',
          title: 'Strava',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'url'
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar'
    }
  }
})