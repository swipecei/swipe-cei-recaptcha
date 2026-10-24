import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Filter, Grid } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentCategory, setCurrentCategory] = useState('all');

  const images = [
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//a.jpg', category: 'events', title: 'Community Gathering' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//b.jpg', category: 'community', title: 'Neighborhood Outreach' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//c.jpg', category: 'youth', title: 'Youth Leadership Workshop' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//d.jpg', category: 'events', title: 'Annual Celebration' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//e.jpg', category: 'community', title: 'Community Service Day' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//f.jpg', category: 'women', title: 'Women Empowerment Summit' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//g.jpg', category: 'events', title: 'Health Fair' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//h.jpg', category: 'elderly', title: 'Senior Appreciation' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//i.jpg', category: 'community', title: 'Food Drive Initiative' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//j.jpg', category: 'youth', title: 'Mentorship Program' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//k.jpg', category: 'events', title: 'Fundraising Gala' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//l.jpg', category: 'women', title: 'Professional Development' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//m.jpg', category: 'community', title: 'Volunteer Training' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//n.jpg', category: 'elderly', title: 'Senior Social Hour' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//o.jpg', category: 'events', title: 'Community Festival' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//p.jpg', category: 'youth', title: 'Skills Workshop' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//q.jpg', category: 'community', title: 'Neighborhood Cleanup' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//r.jpg', category: 'women', title: 'Leadership Circle' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//s.jpg', category: 'events', title: 'Holiday Celebration' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//t.jpg', category: 'elderly', title: 'Wellness Program' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//u.jpg', category: 'community', title: 'Resource Fair' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//v.jpg', category: 'youth', title: 'Career Guidance' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//w.jpg', category: 'events', title: 'Awards Ceremony' },
    { url: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//x.jpg', category: 'women', title: 'Networking Event' }
  ];

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

  return (
    <section id="gallery" className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-[#00c019]/10 rounded-full text-[#00c019] text-sm font-semibold mb-6">
            <Grid className="mr-2" size={16} />
            Community Gallery
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Moments of
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">
              Impact & Connection
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Capturing the essence of transformation, community spirit, and the beautiful 
            connections that define our journey together.
          </p>
        </div>

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
                  src={image.url}
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
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
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
  );
};

export default Gallery;