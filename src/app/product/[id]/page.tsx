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
  _key?: string;
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
    return source?.asset?._ref ? builder.image(source.asset._ref).url() : '/placeholder-image.jpg';
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Error fetching product details:", errorMessage);
        setError(errorMessage);
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
    } catch {
      alert('Failed to submit review');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Product details */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          {product?.badge && (
            <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white px-3 py-1 rounded-full">
              {product.badge}
            </div>
          )}
          <Image
            src={urlFor(product?.image)}
            alt={product?.title || "Product Image"}
            width={400}
            height={400}
            unoptimized={true}
            className="w-full max-w-[500px] h-auto rounded-3xl shadow-lg mt-10"
          />
        </div>

        <div className="flex-1 mt-10 md:mt-28">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product?.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{product?.description}</p>
          <button
            onClick={() => alert(`${product?.title} added to cart!`)}
            disabled={!product?.inventory || product.inventory <= 0}
            className="mt-8 w-full md:w-auto px-8 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
        {product?.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review._key} className="border p-4 rounded-lg mb-4">
              <p className="font-semibold">{review.author}</p>
              <p className="text-sm text-yellow-500">Rating: {review.rating}⭐</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}

        {/* Add a Review */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Add Your Review</h3>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded mb-2"
            value={newReview.author}
            onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            className="w-full p-2 border rounded mb-2"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          />
          <textarea
            placeholder="Your Review"
            className="w-full p-2 border rounded mb-2"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <button
            onClick={handleReviewSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

