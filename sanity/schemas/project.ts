import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Project URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screenshot',
      title: 'Screenshot',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screenshotPosition',
      title: 'Screenshot Position',
      type: 'string',
      description: 'CSS object-position value (e.g., "center center", "top left")',
      initialValue: 'top center',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Full Stack', value: 'Full Stack' },
          { title: 'Front End', value: 'Front End' },
          { title: 'Back End', value: 'Back End' },
          { title: 'Design', value: 'Design' },
          { title: 'Project Management', value: 'Project Management' },
          { title: 'Herding', value: 'Herding' },
          { title: 'Milking', value: 'Milking' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tech',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company/Agency',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Only published projects appear on the site',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'screenshot',
      company: 'company',
    },
    prepare(selection) {
      const { title, company } = selection
      return {
        ...selection,
        subtitle: company,
      }
    },
  },
})