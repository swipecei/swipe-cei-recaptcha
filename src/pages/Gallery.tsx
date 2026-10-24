import React, { useState } from 'react';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Grid, Calendar, Users, Heart } from 'lucide-react';
import { galleryApi, GalleryImage } from '../lib/supabase';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Load images from database
    loadImages();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadImages = async () => {
    try {
      const data = await galleryApi.getActiveImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Photos', count: images.length },
    { id: 'events', name: 'Events', count: images.filter(img => img.category === 'events').length },
    { id: 'community', name: 'Community', count: images.filter(img => img.category === 'community').length },
    { id: 'youth', name: 'Youth', count: images.filter(img => img.category === 'youth').length },
    { id: 'women', name: 'Women', count: images.filter(img => img.category === 'women').length },
    { id: 'elderly', name: 'Elderly', count: images.filter(img => img.category === 'elderly').length }
  ];

  const filteredImages = currentCategory === 'all' 
    ? images 
    : images.filter(img => img.category === currentCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = selectedImage;
    const maxIndex = filteredImages.length - 1;
    
    if (direction === 'prev') {
      setSelectedImage(currentIndex > 0 ? currentIndex - 1 : maxIndex);
    } else {
      setSelectedImage(currentIndex < maxIndex ? currentIndex + 1 : 0);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//y.jpg" 
            alt="Community gallery and memories" 
            className="w-full h-[120%] object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center h-full py-8 lg:py-12">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
                <Grid className="mr-2" size={16} />
                Community Gallery
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                Moments of
                <span className="block text-[#00c019] mt-2">
                  Impact & Connection
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 lg:mb-6 leading-relaxed max-w-2xl mx-auto">
                Capturing the essence of transformation, community spirit, and the beautiful 
                connections that define our journey together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentCategory === category.id
                    ? 'bg-gradient-to-r from-[#5d00c1] to-[#00c019] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#5d00c1]/30'
                }`}
              >
                <span className="relative z-10 flex items-center">
                  {category.name}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    currentCategory === category.id 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </span>
                {currentCategory !== category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5d00c1] to-[#00c019] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                )}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer bg-white"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg mb-2">{image.title}</h3>
                    <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium capitalize">
                      {image.category}
                    </span>
                  </div>
                </div>
                
                {/* Hover icon */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <ImageIcon className="text-white" size={20} />
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {selectedImage !== null && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="relative max-w-6xl max-h-full">
                <img
                  src={filteredImages[selectedImage].image_url}
                  alt={filteredImages[selectedImage].alt_text}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
                
                {/* Image info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{filteredImages[selectedImage].title}</h3>
                  <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium capitalize">
                    {filteredImages[selectedImage].category}
                  </span>
                </div>
                
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 p-3 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-white hover:bg-opacity-70 transition-all duration-300"
                >
                  <X size={24} />
                </button>
                
                {/* Navigation buttons */}
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-white hover:bg-opacity-70 transition-all duration-300"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-white hover:bg-opacity-70 transition-all duration-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;