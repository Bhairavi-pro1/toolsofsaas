import { defineField, defineType } from 'sanity';
import { OrderInput } from '../components/OrderInput';

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
      description: 'Lower numbers appear first in the grid (e.g., 0, 1, 2, ...)',
      components: {
        input: OrderInput,
      },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (value === undefined || value === null) return true;
          const client = context.getClient({ apiVersion: '2024-01-01' });
          const id = (context.document?._id || '').replace(/^drafts\./, '');
          const docType = context.document?._type || 'upcomingTool';

          const duplicates = await client.fetch(
            `*[_type == $docType && !(_id in [$id, "drafts." + $id]) && order == $value]{ title, order }`,
            { docType, id, value }
          );

          if (duplicates && duplicates.length > 0) {
            const first = duplicates[0];
            return `Warning: Order ${value} is already assigned to "${first.title || 'another upcoming tool'}".`;
          }
          return true;
        }).warning(),
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
