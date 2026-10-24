import React from 'react';
import { useState, useEffect } from 'react';
import { programsApi, eventsApi, Program, Event } from '../lib/supabase';
import ProgramsHero from '../components/programs/ProgramsHero';
import UpcomingEvents from '../components/programs/UpcomingEvents';
import ProgramsList from '../components/programs/ProgramsList';
import ProgramsCTA from '../components/programs/ProgramsCTA';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, eventsData] = await Promise.all([
          programsApi.getActivePrograms(),
          eventsApi.getUpcomingEvents()
        ]);
        console.log('Programs loaded:', programsData);
        console.log('Events loaded:', eventsData);
        setPrograms(programsData);
        setUpcomingEvents(eventsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <ProgramsHero />
     
      <ProgramsList programs={programs} />
       <UpcomingEvents events={upcomingEvents} />
      <ProgramsCTA />
    </div>
  );
};

export default Programs;