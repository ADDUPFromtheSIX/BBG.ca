import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 5,
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Project Detail",
      type: "string",
    }),
  ],
});
