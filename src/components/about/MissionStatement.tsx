import React, { useState, useEffect } from 'react';
import { Target, Users, Building, Heart, BookOpen, Lightbulb } from 'lucide-react';

const MissionStatement = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const phrases = [
    'Purpose & Partnership',
    'Community & Care',
    'Strength & Excellence',
    'Unity & Understanding'
  ]; 
  
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;
    
    const timer = setTimeout(() => {
      if (!isDeleting && currentIndex < currentPhrase.length) {
        setDisplayText(currentPhrase.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else if (isDeleting && currentIndex > 0) {
        setDisplayText(currentPhrase.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      } else if (!isDeleting && currentIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentIndex === 0) {
        setIsDeleting(false);
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, currentPhraseIndex, phrases]);

  const visionPoints = [
    {
      icon: Users,
      title: 'Comprehensive Mentoring',
      description: 'Provide mentoring to adolescent girls, boys, single parents, married couples, senior citizens, and displaced persons from society'
    },
    {
      icon: Building,
      title: 'Workforce Development',
      description: 'Partner with community entities to provide information and resources to increase job readiness, job retention, job skills and on-the-job work ethics'
    },
    {
      icon: Heart,
      title: 'Family Strengthening',
      description: 'Strengthen family support systems by providing activities and educational programs including tutoring/coaching, reading, science, technology, engineering & mathematics (STEM), social etiquette classes, character development, and life skills training'
    },
    {
      icon: BookOpen,
      title: 'Community Enrichment',
      description: 'Provide enrichment programs for seniors, children, adults, and adolescents at risk youth, including healthy eating/exercising, gang/violence prevention, human trafficking awareness, and domestic violence education'
    },
    {
      icon: Target,
      title: 'Strategic Partnerships',
      description: 'Become a liaison between the healthcare industry, businesses, educational agencies and professional organizations to empower the community and enhance standards of living'
    },
    {
      icon: Lightbulb,
      title: 'Skills Development',
      description: 'Provide training and classes including gardening, healthcare/nutrition, computer/technology training, computer literacy, prenatal and parenting skills, and financial management'
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#5d00c1]/3 to-[#00c019]/3 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5d00c1]/10 to-[#00c019]/10 rounded-full text-[#5d00c1] text-sm font-semibold mb-6 border border-[#5d00c1]/20">
            <Target className="mr-2" size={16} />
            Our Mission & Vision
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Empowering Communities Through
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent mt-2 min-h-[1.2em]">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h2>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mission Content */}
          </div>
          
          <div className="text-center">
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Our mission is to provide a venue to promote programs and services to foster communications, build relationships, and form partnerships to empower the community.
            </p> 
          </div>
        </div>
      </div>
    </section>
  );
};
export default MissionStatement;
  