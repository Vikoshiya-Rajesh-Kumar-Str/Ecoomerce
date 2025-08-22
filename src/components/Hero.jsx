// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Zap, Shield, Truck, Award, Home } from 'lucide-react';
// // {Hero section}
// const Hero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     {
//       id: 1,
//       title: "Premium LED Lighting Solutions",
//       subtitle: "Illuminate your space with energy-efficient LED lights",
//       description: "Discover our range of smart LED bulbs, strip lights, and fixtures. Save up to 80% on electricity bills with our premium lighting collection.",
//       image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1920",
//       cta1: "Shop LED Lights",
//       cta2: "View Collection",
//       accent: "from-blue-600 to-purple-600"
//     },
//     {
//       id: 2,
//       title: "Smart Switches & Controls",
//       subtitle: "Modern electrical switches for smart homes",
//       description: "Upgrade to smart switches with WiFi control, dimming features, and energy monitoring. Compatible with Alexa and Google Home.",
//       image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920",
//       cta1: "Shop Switches",
//       cta2: "Smart Home Kit",
//       accent: "from-green-600 to-teal-600"
//     },
//     {
//       id: 3,
//       title: "Industrial Grade Wiring",
//       subtitle: "Professional electrical cables & wires",
//       description: "Heavy-duty electrical wires and cables for residential and commercial projects. ISI certified with lifetime warranty.",
//       image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1920",
//       cta1: "Shop Cables",
//       cta2: "Bulk Orders",
//       accent: "from-orange-600 to-red-600"
//     },
//     {
//       id: 4,
//       title: "Complete Electrical Solutions",
//       subtitle: "Everything you need for electrical projects",
//       description: "From panels and MCBs to sockets and plugs. Get professional-grade electrical components with expert support and fast delivery.",
//       image: "https://images.pexels.com/photos/8293711/pexels-photo-8293711.jpeg?auto=compress&cs=tinysrgb&w=1920",
//       cta1: "View All Products",
//       cta2: "Get Quote",
//       accent: "from-indigo-600 to-blue-600"
//     }
//   ];

//   // Auto slide functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 8000); // 8 seconds

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <section className="relative h-screen overflow-hidden">
//       {/* Slides */}
//       <div className="relative w-full h-full">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
//               index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
//             }`}
//             style={{
//               backgroundImage: `url('${slide.image}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               backgroundRepeat: 'no-repeat'
//             }}
//           >
//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black/50"></div>
            
//             {/* Gradient Overlay */}
//             <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-20`}></div>
            
//             {/* Content */}
//             <div className="relative h-full flex items-start pt-24">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//                 <div className="max-w-3xl">
                  
                  
//                   <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-white mb-6 animate-fade-in">
//                     {slide.title}
//                   </h1>
                  
//                   <p className="text-xl sm:text-2xl text-blue-100 mb-4 font-medium">
//                     {slide.subtitle}
//                   </p>
                  
//                   <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
//                     {slide.description}
//                   </p>
                  
//                   <div className="flex flex-wrap gap-4 mb-8">
//                     <button className={`px-8 py-4 bg-gradient-to-r ${slide.accent} text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
//                       {slide.cta1}
//                     </button>
//                     <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
//                       {slide.cta2}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-r-full transition-all duration-300 hover:scale-110 z-10"
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </button>
      
//       <button
//         onClick={nextSlide}
//         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-l-full transition-all duration-300 hover:scale-110 z-10"
//       >
//         <ChevronRight className="w-4 h-4" />
//       </button>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//               index === currentSlide 
//                 ? 'bg-white scale-125' 
//                 : 'bg-white/50 hover:bg-white/70'
//             }`}
//           />
//         ))}
//       </div>

//       {/* Progress Bar */}
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
//         <div 
//           className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-4000 ease-linear"
//           style={{
//             width: `${((currentSlide + 1) / slides.length) * 100}%`
//           }}
//         />
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute top-20 right-20 animate-bounce opacity-20">
//         <Zap className="w-16 h-16 text-yellow-300" />
//       </div>
//       <div className="absolute bottom-32 left-20 animate-pulse opacity-10">
//         <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
//       </div>
//     </section>
//   );
// };

// export default Hero;