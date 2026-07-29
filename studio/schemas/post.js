export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) =>
        Rule.required().min(10).max(120).warning('Aim for 60–80 characters for best SEO.'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly identifier. Click "Generate" to auto-create from the title.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) =>
        Rule.required().custom((field) => {
          const value = field?.current
          if (!value) return true
          if (value.startsWith('/') || value.endsWith('/')) {
            return 'Remove leading or trailing slashes from the slug (use "my-post", not "/my-post").'
          }
          return true
        }),
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Required for accessibility and SEO. Describe the image in plain English.',
          validation: (Rule) => Rule.required().min(5),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption shown beneath the image.',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description:
        'Short summary shown on cards and used as the default meta description. Max 200 characters.',
      validation: (Rule) =>
        Rule.required()
          .min(40)
          .max(200)
          .error('Excerpt must be between 40 and 200 characters.'),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {name: 'caption', title: 'Caption', type: 'string'},
          ],
        },
        {type: 'contentTable'},
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description:
        'Overrides the post title in <title> and Open Graph tags. Keep under 60 characters so Google does not truncate it.',
      validation: (Rule) =>
        Rule.max(60).warning('Google truncates titles longer than 60 characters.'),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description:
        'Overrides the excerpt for <meta name="description"> and OG description. Keep under 160 characters.',
      validation: (Rule) =>
        Rule.max(160).warning('Google truncates descriptions longer than 160 characters.'),
    },
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published date, oldest',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'Not published',
        media,
      }
    },
  },
}
