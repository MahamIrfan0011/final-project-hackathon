'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sanityClient } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

// Define interfaces
interface Review {
  rating: number;
  comment: string;
  author: string;
  _key?: string; // Optional for uniqueness
}

interface Product {
  title: string;
  description: string;
  price: number;
  priceWithoutDiscount?: number;
  discount?: number;
  inventory: number;
  image?: { asset: { _ref: string } };
  badge?: string;
  tags?: string[];
  reviews?: Review[];
}

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<Review>({ rating: 0, comment: '', author: '' });

  const builder = imageUrlBuilder(sanityClient);

  const urlFor = (source?: { asset: { _ref: string } }): string => {
    if (!source?.asset?._ref) {
      return '/placeholder-image.jpg';
    }
    return builder.image(source.asset._ref).url();
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const query = `*[_type == "products" && _id == $id][0]`;
        const result = await sanityClient.fetch(query, { id });

        if (result) {
          setProduct(result);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.author || newReview.rating === 0 || !newReview.comment) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const updatedReviews = [...(product?.reviews || []), { ...newReview, _key: Date.now().toString() }];

      setProduct((prev) => prev ? { ...prev, reviews: updatedReviews } : null);
      setNewReview({ rating: 0, comment: '', author: '' });

      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image with Badge */}
        <div className="flex-1 relative">
          {product?.badge && (
            <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white px-3 py-1 rounded-full">
              {product.badge}
            </div>
          )}
          {product?.image ? (
            <Image
              src={urlFor(product.image)}
              alt={product.title || "Product Image"}
              width={400}
              height={400}
              unoptimized={true}
              className="w-full max-w-[500px] h-auto rounded-3xl shadow-lg mt-10"
            />
          ) : (
            <div className="w-full max-w-[500px] h-[500px] rounded-3xl shadow-lg mt-10 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 mt-10 md:mt-28">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product?.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{product?.description}</p>

          {/* Price Section */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-bold text-gray-800">${product?.price?.toFixed(2)}</p>
            {product?.priceWithoutDiscount && (
              <p className="text-lg text-gray-400 line-through">${product.priceWithoutDiscount.toFixed(2)}</p>
            )}
            {product?.discount && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Inventory Status */}
          <div className="mb-6">
            <p className={`text-sm ${product?.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product?.inventory > 0 ? `${product.inventory} units in stock` : 'Out of stock'}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => alert(`${product?.title} added to cart!`)}
            disabled={!product?.inventory || product.inventory <= 0}
            className={`mt-8 w-full md:w-auto px-8 py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2
              ${product?.inventory > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Add to Cart
          </button>

          {/* Tags */}
          {product?.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
        <div className="mt-6">
          {product?.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={review._key || index} className="border-b py-4">
                <p className="text-gray-800 font-medium">{review.author}</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="text-gray-500 text-sm">({review.rating})</span>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Review Form */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Add a Review</h3>
          <input type="text" className="w-full p-3 border rounded-lg mt-2" value={newReview.author} placeholder="Your Name" onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} />
          <textarea className="w-full p-3 border rounded-lg mt-2" value={newReview.comment} placeholder="Comment" onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
          <button onClick={handleReviewSubmit} className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-lg">Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

