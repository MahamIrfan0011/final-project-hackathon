import { defineType } from "sanity";

export const productSchema = defineType({
  name: "products",
  title: "Products",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Title",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      title: "Price without Discount",
      name: "priceWithoutDiscount",
      type: "number",
    },
    {
      name: "badge",
      title: "Badge",
      type: "string",
    },
    {
      name: "image",
      title: "Product Image",
      type: "image",
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "categories" }],
    },
    {
      name: "description",
      title: "Product Description",
      type: "text",
    },
    {
      name: "inventory",
      title: "Inventory Management",
      type: "number",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Featured", value: "featured" },
          {
            title: "Follow products and discounts on Instagram",
            value: "instagram",
          },
          { title: "Gallery", value: "gallery" },
        ],
      },
    },
    {
      name: 'duplicateProducts',
      title: 'Duplicate Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'products' }],
        }
      ],
    },
    // New Reviews field
    {
      name: "reviews",
      title: "Product Reviews",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule) => Rule.min(1).max(5),
            },
            {
              name: "comment",
              title: "Comment",
              type: "text",
            },
            {
              name: "author",
              title: "Author",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
});
