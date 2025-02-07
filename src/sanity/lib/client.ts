import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const sanityClient = createClient({
  projectId: 'bkrzw7t0', 
  dataset: 'production',     
  apiVersion: '2023-01-01',    
  useCdn: true,                
});

export { sanityClient };
// Create an image URL builder
const builder = imageUrlBuilder(sanityClient);

// Function to get the image URL
const urlFor = (source: any) => builder.image(source).url();