import React, { useState, useEffect } from 'react';

const MissionStatement = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const fullText = "Our mission is to provide a venue to promote programs and services to foster communications, build relationships, and form partnerships to empower the community.";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50); // Typing speed
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, fullText]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/20 to-[#5d00c1]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/20 to-[#00c019]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#5d00c1]/8 to-[#00c019]/8 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Text Content - 2/3 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl text-gray-900 mb-6 sm:mb-8 leading-[1.4] sm:leading-[1.5] lg:leading-[1.4]">
              <div className="min-h-[4em] sm:min-h-[5em] lg:min-h-[5em] leading-relaxed">
                <span className="whitespace-pre-wrap">
                  {(() => {
                    const phrases = [
                      { text: 'foster communications', start: fullText.indexOf('foster communications'), end: fullText.indexOf('foster communications') + 'foster communications'.length },
                      { text: 'build relationships', start: fullText.indexOf('build relationships'), end: fullText.indexOf('build relationships') + 'build relationships'.length },
                      { text: 'form partnerships', start: fullText.indexOf('form partnerships'), end: fullText.indexOf('form partnerships') + 'form partnerships'.length }
                    ];
                    
                    // Group consecutive characters for better highlighting
                    const result = [];
                    let currentGroup = '';
                    let isCurrentGroupHighlighted = false;
                    
                    for (let i = 0; i < displayText.length; i++) {
                      const char = displayText[i];
                      const isHighlighted = phrases.some(phrase => 
                        i >= phrase.start && i < phrase.end && displayText.length > phrase.start
                      );
                      
                      if (isHighlighted === isCurrentGroupHighlighted) {
                        // Same type, add to current group
                        currentGroup += char;
                      } else {
                        // Different type, finish current group and start new one
                        if (currentGroup) {
                          result.push(
                            <span 
                              key={result.length} 
                              className={isCurrentGroupHighlighted ? "bg-[#5d00c1] text-white px-1 rounded" : ""}
                            >
                              {currentGroup}
                            </span>
                          );
                        }
                        currentGroup = char;
                        isCurrentGroupHighlighted = isHighlighted;
                      }
                    }
                    
                    // Add the last group
                    if (currentGroup) {
                      result.push(
                        <span 
                          key={result.length} 
                          className={isCurrentGroupHighlighted ? "bg-[#5d00c1] text-white px-1 rounded" : ""}
                        >
                          {currentGroup}
                        </span>
                      );
                    }
                    
                    return result;
                  })()}
                </span>
                {!isComplete && <span className="animate-pulse text-[#5d00c1] ml-1">|</span>}
              </div>
            </h2>
          </div>
          
          {/* Layered Logo - 1/3 */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div className="relative group w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Base Logo Image - Static */} 
              <img 
                src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/logo%20image.png" 
                alt="SWIPE CE Logo Base" 
                className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg z-10"
              />
              
              {/* Text Logo Overlay - Rotating on Scroll */}
              <img 
                src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/logo%20text.png" 
                alt="SWIPE CE Logo Text" 
                className="absolute inset-0 w-full h-full object-contain drop-shadow-lg z-20 transition-transform duration-100 ease-out"
                style={{
                  transform: `rotate(${-scrollY * 0.2}deg)`
                }}
              />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5d00c1]/10 to-[#00c019]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;