import { defineField, defineType } from 'sanity';

export const mediaAsset = defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'file',
      title: 'Media File',
      type: 'file',
      options: {
        accept: '.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
          { title: 'Document', value: 'document' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for accessibility and SEO',
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      description: 'Brief description or context for the media',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for organizing and searching media',
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
          name: 'altitude',
          title: 'Altitude (feet)',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'dateCreated',
      title: 'Date Created',
      type: 'datetime',
      description: 'When the media was originally captured/created',
    }),
    defineField({
      name: 'dateUploaded',
      title: 'Date Uploaded',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer/Creator',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Person who created this media',
    }),
    defineField({
      name: 'equipment',
      title: 'Equipment Used',
      type: 'object',
      fields: [
        {
          name: 'camera',
          title: 'Camera',
          type: 'string',
        },
        {
          name: 'lens',
          title: 'Lens',
          type: 'string',
        },
        {
          name: 'settings',
          title: 'Camera Settings',
          type: 'string',
          description: 'e.g., ISO 400, f/2.8, 1/125s',
        },
      ],
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        {
          name: 'width',
          title: 'Width (pixels)',
          type: 'number',
        },
        {
          name: 'height',
          title: 'Height (pixels)',
          type: 'number',
        },
        {
          name: 'aspectRatio',
          title: 'Aspect Ratio',
          type: 'string',
          description: 'e.g., 16:9, 4:3, 1:1',
        },
      ],
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (MB)',
      type: 'number',
      description: 'File size in megabytes',
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Allow this media to be used publicly',
    }),
    defineField({
      name: 'isHighlight',
      title: 'Highlight',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as a featured/highlight media',
    }),
    defineField({
      name: 'usageRights',
      title: 'Usage Rights',
      type: 'string',
      options: {
        list: [
          { title: 'All Rights Reserved', value: 'all-rights' },
          { title: 'Creative Commons', value: 'cc' },
          { title: 'Public Domain', value: 'public' },
          { title: 'Editorial Use Only', value: 'editorial' },
          { title: 'Personal Use Only', value: 'personal' },
        ],
      },
      initialValue: 'all-rights',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'relatedContent',
      title: 'Related Content',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'blogPost' }] },
        { type: 'reference', to: [{ type: 'expeditionUpdate' }] },
        { type: 'reference', to: [{ type: 'trainingEntry' }] },
      ],
      description:
        'Link to related blog posts, expeditions, or training entries',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      fileType: 'fileType',
      isPublic: 'isPublic',
      isHighlight: 'isHighlight',
      media: 'file',
    },
    prepare(selection) {
      const { fileType, isPublic, isHighlight } = selection;
      const typeEmojis: Record<string, string> = {
        image: '📸',
        video: '🎥',
        audio: '🎵',
        document: '📄',
      };

      const highlights = [];
      if (isHighlight) highlights.push('⭐');
      if (!isPublic) highlights.push('🔒');

      return {
        ...selection,
        subtitle: `${typeEmojis[fileType] || '📎'} ${fileType} ${highlights.join(' ')}`,
      };
    },
  },
  orderings: [
    {
      title: 'Upload Date, New',
      name: 'uploadedDesc',
      by: [{ field: 'dateUploaded', direction: 'desc' }],
    },
    {
      title: 'Created Date, New',
      name: 'createdDesc',
      by: [{ field: 'dateCreated', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
