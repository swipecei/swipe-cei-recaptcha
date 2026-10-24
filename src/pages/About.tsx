import React from 'react';
import AboutHero from '../components/about/AboutHero';
import LegalFoundation from '../components/about/LegalFoundation';
import MissionStatement from '../components/about/MissionStatement';
import VisionStatement from '../components/about/VisionStatement';
import CoreValues from '../components/about/CoreValues';
import ImpactStatistics from '../components/about/ImpactStatistics';
import TeamSection from '../components/about/TeamSection';
import ImpactAreas from '../components/ImpactAreas';


const About = () => {
  return (
    <div className="pt-24">
      <AboutHero />
    
      <MissionStatement /> 
       <ImpactAreas />
      <VisionStatement />

      <TeamSection />
    </div>
  );
};

export default About;