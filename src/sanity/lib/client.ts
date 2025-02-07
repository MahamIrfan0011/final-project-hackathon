import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const sanityClient = createClient({
  projectId: 'bkrzw7t0', 
  dataset: 'production',     
  apiVersion: '2023-01-01',    
  useCdn: true,                
});

export { sanityClient };

const builder = imageUrlBuilder(sanityClient);

// Only export if you're using this function elsewhere
export const urlFor = (source: SanityImageSource) => builder.image(source).url();