import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'upcomingTool',
  title: 'Upcoming Tool',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'iconImage',
      title: 'Icon Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional tool icon. If not uploaded, the icon area will show as empty space.',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'Category tag, e.g. "#Design", "#Network"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first in the grid',
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
    select: { title: 'title', media: 'iconImage' },
    prepare({ title, media }) {
      return {
        title,
        subtitle: 'Coming Soon',
        media,
      };
    },
  },
});
