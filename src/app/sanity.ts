// sanity.js
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'your_project_id', // Your Sanity project ID
  dataset: 'production', // Dataset name
  useCdn: true,
});

export const fetchProducts = async () => {
  const query = `*[_type == "products"] {
    _id,
    name,
    price,
    description,
    slug,
    image
  }`;

  const products = await client.fetch(query);
  return products;
};
