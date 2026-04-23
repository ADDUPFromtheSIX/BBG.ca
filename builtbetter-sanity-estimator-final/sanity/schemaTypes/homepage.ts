import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text", rows: 4 }),
    defineField({
      name: "heroBackgroundImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
          defineField({ name: "items", title: "Items", type: "array", of: [{ type: "string" }] }),
        ],
      }],
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "items", title: "Items", type: "array", of: [{ type: "string" }] }),
        ],
      }],
    }),
  ],
});
