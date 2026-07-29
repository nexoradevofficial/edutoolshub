/**
 * Insertable Portable Text block for comparison / pricing tables.
 * First row is the header; headerColor is a free hex value editors can change.
 */
import {ThLargeIcon} from '@sanity/icons'

export default {
  name: 'contentTable',
  title: 'Table',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    {
      name: 'headerColor',
      title: 'Header color',
      type: 'string',
      description:
        'Any hex color for the header row (e.g. #1e3a5f, #2563eb, #0d9488). Default matches the deep navy look.',
      initialValue: '#1e3a5f',
      validation: (Rule) =>
        Rule.required()
          .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            name: 'hex',
            invert: false,
          })
          .error('Enter a valid hex color like #1e3a5f'),
    },
    {
      name: 'headers',
      title: 'Column headers',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Left-to-right header labels (e.g. Pricing Model, Typical Range, Best For).',
      validation: (Rule) => Rule.required().min(1).error('Add at least one column header.'),
    },
    {
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
              description: 'One value per column, in the same order as the headers.',
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              const text = Array.isArray(cells) ? cells.filter(Boolean).join(' · ') : ''
              return {
                title: text || 'Empty row',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Add at least one data row.'),
    },
  ],
  preview: {
    select: {
      headers: 'headers',
      rows: 'rows',
      headerColor: 'headerColor',
    },
    prepare({headers, rows, headerColor}) {
      const cols = Array.isArray(headers) ? headers.length : 0
      const rowCount = Array.isArray(rows) ? rows.length : 0
      return {
        title: 'Table',
        subtitle: `${cols} column${cols === 1 ? '' : 's'} · ${rowCount} row${
          rowCount === 1 ? '' : 's'
        }${headerColor ? ` · ${headerColor}` : ''}`,
      }
    },
  },
}
