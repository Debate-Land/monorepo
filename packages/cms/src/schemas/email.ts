import {defineField, defineType} from 'sanity'

export default defineType({
  name: '_email',
  title: 'Email',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'subject'
    }
  }
})