import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title for internal reference',
    }),
    defineField({
      name: 'mainText',
      title: 'Main Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'italicText',
      title: 'Italic Text',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
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
      mainText: 'mainText',
    },
    prepare(selection) {
      const { title, mainText } = selection
      return {
        title: title || mainText.substring(0, 50),
        subtitle: mainText.substring(0, 100),
      }
    },
  },
})