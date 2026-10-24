import React from 'react';
import HomeHero from '../components/home/HomeHero';
import Partners from '../components/Partners';
import MissionStatement from '../components/MissionStatement';
import RecentEvents from '../components/home/RecentEvents';
import OrganizationHighlight from '../components/home/OrganizationHighlight';
import Timeline from '../components/home/Timeline';
import DonationCTA from '../components/home/DonationCTA';

const Home = () => {
  return (
    <div>
      <HomeHero />
      <MissionStatement />
         <Timeline />
      <Partners />
      <RecentEvents />
      <OrganizationHighlight />
   
      <DonationCTA />
    </div>
  );
};

export default Home;