import React, { useState } from 'react';
import { Building, Users, Heart } from 'lucide-react';
import { boardMembersApi, BoardMember } from '../../lib/supabase';

const TeamSection = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadBoardMembers = async () => {
      try {
        const data = await boardMembersApi.getActiveBoardMembers();
        setBoardMembers(data);
      } catch (error) {
        console.error('Failed to load board members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBoardMembers();
  }, []);

  const leadership = [
    {
      icon: Building,
      title: 'Board of Directors',
      description: 'Elected officers providing strategic oversight and governance',
      category: 'Executive Leadership',
      gradient: 'from-[#5d00c1] to-[#4a0096]'
    },
    {
      icon: Users,
      title: 'Program Leadership',
      description: 'Dedicated coordinators managing program delivery and community partnerships',
      category: 'Program Management',
      gradient: 'from-[#00c019] to-[#00a015]'
    },
    {
      icon: Heart,
      title: 'Community Volunteers',
      description: 'Passionate individuals committed to serving our community',
      category: 'Volunteer Network',
      gradient: 'from-[#00c019] to-[#00a015]'
    }
  ];

  if (loading) {
    return (
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-white relative overflow-hidden">  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Board of Directors Section */}
        <div className="mb-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Board of <span className="text-[#5d00c1]">Directors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated leaders who guide our organization's mission and 
              ensure accountability, transparency, and strategic direction.
            </p>
          </div>

          {/* Board Members Grid */}
          {boardMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100 overflow-hidden"
              >
                {/* Square Image */}
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={member.image_url || 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/logo%20image.png'}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/logo%20image.png';
                    }}
                  />
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5d00c1] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-[#00c019] mb-4">
                    {member.title}
                  </p>

                  {/* Decorative line */}
                  <div className="h-1 bg-gradient-to-r from-[#5d00c1] to-[#00c019] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Board Members</h3>
              <p className="text-gray-600">Board member information will be displayed here once added.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;