import { defineField, defineType } from 'sanity';
import { OrderInput } from '../components/OrderInput';

export default defineType({
  name: 'tool',
  title: 'Tool',
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
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Badge text, e.g. "Free", "Pro", "New"',
      initialValue: 'Free',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'Category tag, e.g. "#SocialMedia", "#Productivity"',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Link to the tool. Can be external (e.g., https://example.com) or internal (e.g., /tools/random-team-generator)',
    }),
    defineField({
      name: 'author',
      title: 'Author / Provider Name',
      type: 'string',
      description: 'e.g. "API Dojo", "HarvestAPI", "Apify", or "Tools of SaaS"',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author Avatar',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional creator avatar. If not uploaded, no avatar will be displayed.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Handle',
      type: 'string',
      description: 'Optional subheader or handle, e.g. "apidojo/tweet-scraper"',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Type',
      type: 'string',
      description: 'e.g. "Free", "Freemium", "Paid", "Free Trial"',
    }),
    defineField({
      name: 'features',
      title: 'Key Features / Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of top features for the detail page',
    }),
    defineField({
      name: 'platform',
      title: 'Platform Type',
      type: 'string',
      initialValue: 'Web Application',
      description: 'e.g. "Web Application", "Chrome Extension", "Cloud SaaS"',
    }),
    defineField({
      name: 'accessType',
      title: 'Access Type',
      type: 'string',
      initialValue: 'Direct Web App (No Download)',
      description: 'e.g. "Direct Web App (No Download)", "Instant Web Access", "Cloud-Based"',
    }),
    defineField({
      name: 'accountRequirement',
      title: 'Account / Login Requirement',
      type: 'string',
      initialValue: 'Instant Access / No Login',
      description: 'e.g. "Instant Access / No Login", "Free Sign-up Required", "No Credit Card Needed"',
    }),
    defineField({
      name: 'officialDomain',
      title: 'Official Domain Name',
      type: 'string',
      description: 'Optional custom domain display (e.g. "errorfixer.toolsofsaas.com"). If empty, extracted automatically from URL.',
    }),
    defineField({
      name: 'verificationStatus',
      title: 'Verification Status',
      type: 'string',
      initialValue: '✓ Curated & Safe',
      description: 'e.g. "✓ Curated & Safe", "Verified Partner", "Community Tested"',
    }),
    defineField({
      name: 'body',
      title: 'Detailed Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for accessibility and SEO',
            },
          ],
        },
      ],
      description: 'Rich-text overview with headings, paragraphs, bullet points, formatting, and screenshots.',
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
          const docType = context.document?._type || 'tool';

          const duplicates = await client.fetch(
            `*[_type == $docType && !(_id in [$id, "drafts." + $id]) && order == $value]{ title, order }`,
            { docType, id, value }
          );

          if (duplicates && duplicates.length > 0) {
            const first = duplicates[0];
            return `Warning: Order ${value} is already assigned to "${first.title || 'another tool'}".`;
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
    select: { title: 'title', subtitle: 'badge', media: 'iconImage' },
  },
});
