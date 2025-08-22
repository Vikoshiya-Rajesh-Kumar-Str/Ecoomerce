// import React, { useRef, useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const defaultCategories = [
//   {
//     id: 'switches',
//     name: 'Switches & Sockets',
//     image:
//       'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   },
//   {
//     id: 'lighting',
//     name: 'LED Lighting',
//     image:
//       'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   },
//   {
//     id: 'wiring',
//     name: 'Wires & Cables',
//     image:
//       'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   },
//   {
//     id: 'protection',
//     name: 'Circuit Protection',
//     image:
//       'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   },
//   {
//     id: 'home',
//     name: 'Home Automation',
//     image:
//       'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   },
//   {
//     id: 'industrial',
//     name: 'Industrial Equipment',
//     image:
//       'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
//     productCount: 0
//   }
// ];

// const Categories = ({ onCategorySelect, categories = defaultCategories }) => {
//   const scrollContainer = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   const checkScrollButtons = () => {
//     if (scrollContainer.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
//     }
//   };

//   useEffect(() => {
//     checkScrollButtons();
//     const container = scrollContainer.current;
//     if (container) {
//       container.addEventListener('scroll', checkScrollButtons);
//       return () => container.removeEventListener('scroll', checkScrollButtons);
//     }
//   }, [categories]);

//   const scrollLeft = () => {
//     if (scrollContainer.current) {
//       scrollContainer.current.scrollBy({
//         left: -280, // Width of one card
//         behavior: 'smooth'
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainer.current) {
//       scrollContainer.current.scrollBy({
//         left: 280, // Width of one card
//         behavior: 'smooth'
//       });
//     }
//   };

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Explore our comprehensive range of electrical products organized by category
//           </p>
//         </div>

//         <div className="relative">
//           {/* Left Arrow */}
//           {canScrollLeft && (
//             <button
//               onClick={scrollLeft}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:scale-110"
//               aria-label="Scroll left"
//             >
//               <ChevronLeft className="w-6 h-6 text-gray-700" />
//             </button>
//           )}

//           {/* Right Arrow */}
//           {canScrollRight && (
//             <button
//               onClick={scrollRight}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:scale-110"
//               aria-label="Scroll right"
//             >
//               <ChevronRight className="w-6 h-6 text-gray-700" />
//             </button>
//           )}

//           {/* Desktop: Horizontal Scrollable Container */}
//           <div className="hidden md:block">
//             <div
//               ref={scrollContainer}
//               className="flex overflow-x-auto scrollbar-hide gap-6 px-12 py-4"
//               style={{
//                 scrollbarWidth: 'none',
//                 msOverflowStyle: 'none',
//               }}
//             >
//               {categories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => onCategorySelect(category.name)}
//                   className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 flex-shrink-0 overflow-hidden"
//                   style={{ width: '280px', height: '220px' }}
//                 >
//                   <div className="relative h-32 overflow-hidden">
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
//                   </div>
//                   <div className="p-6 text-center">
//                     <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-blue-900 transition-colors">
//                       {category.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 font-medium">
//                       {category.productCount} products
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Mobile: 4 Grid Layout */}
//           <div className="md:hidden grid grid-cols-2 gap-4">
//             {categories.slice(0, 4).map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => onCategorySelect(category.name)}
//                 className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
//               >
//                 <div className="relative h-24 overflow-hidden">
//                   <img
//                     src={category.image}
//                     alt={category.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
//                 </div>
//                 <div className="p-4 text-center">
//                   <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight group-hover:text-blue-900 transition-colors">
//                     {category.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 font-medium">
//                     {category.productCount} products
//                   </p>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

      
//     </section>
//   );
// };

// export default Categories;