// // ProductGrid.jsx
// import React, { useState } from 'react';
// import ProductCard from './ProductCard';
// import ProductDetailsModal from './ProductDetailsModal';

// const ProductGrid = ({
//   products,
//   onAddToCart,
//   onAddToWishlist,
//   title = 'Featured Products',
//   favorites = []
// }) => {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   if (products.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500 text-lg">No products found matching your search.</p>
//       </div>
//     );
//   }

//   return (
//     <section id="products" className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
//           <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product, index) => (
//             <div
//               key={`${product['product-title']}-${index}`}
//               onClick={() => setSelectedProduct(product)}
//               className="cursor-pointer"
//             >
//               <ProductCard
//                 product={product}
//                 onAddToCart={onAddToCart}
//                 onAddToWishlist={onAddToWishlist}
//                 isFavorite={favorites.some((fav) => fav['product-title'] === product['product-title'])}
//                 onOpenDetails={(p) => setSelectedProduct(p)}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       <ProductDetailsModal
//         product={selectedProduct}
//         onClose={() => setSelectedProduct(null)}
//         onAddToCart={onAddToCart}
//       />
//     </section>
//   );
// };

// export default ProductGrid;