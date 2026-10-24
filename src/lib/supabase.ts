import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  dietary_restrictions?: string;
  medical_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  registration_date: string;
  status: 'registered' | 'cancelled' | 'attended' | 'no_show';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  event?: Event;
  user?: User;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  type: 'general' | 'volunteer' | 'programs' | 'partnership';
  status: 'new' | 'read' | 'resolved' | 'archived';
  user_agent?: string;
  ip_address?: string;
  recaptcha_score?: number;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  unsubscribe_token: string;
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface CommunityPartner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Event interface
export interface Event {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  detailed_description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  location: string;
  category: string;
  hero_image?: string;
  features: string[];
  schedule: Array<{
    time: string;
    activity: string;
  }>;
  partners_ids: string[];
  registration_required: boolean;
  registration_cost: string;
  registration_deadline?: string;
  walk_ins_welcome: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Program interface
export interface Program {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  detailed_description?: string;
  icon: string;
  gradient: string;
  hero_image?: string;
  target_audience?: string;
  duration?: string;
  location: string;
  features: string[];
  outcomes: string[];
  testimonials: Array<{
    quote: string;
    author: string;
  }>;
  upcoming_events: Array<{
    title: string;
    date: string;
    time: string;
    description: string;
  }>;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Board Member interface
export interface BoardMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Community Partners API functions
export const communityPartnersApi = {
  // Get all active partners for public display
  async getActivePartners(): Promise<CommunityPartner[]> {
    const { data, error } = await supabase
      .from('community_partners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get all partners for admin (including inactive)
  async getAllPartners(): Promise<CommunityPartner[]> {
    const { data, error } = await supabase
      .from('community_partners')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get partners by IDs
  async getPartnersByIds(ids: string[]): Promise<CommunityPartner[]> {
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase
      .from('community_partners')
      .select('*')
      .in('name', ids)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create new partner
  async createPartner(partner: Omit<CommunityPartner, 'id' | 'created_at' | 'updated_at'>): Promise<CommunityPartner> {
    const { data, error } = await supabase
      .from('community_partners')
      .insert([partner])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update partner
  async updatePartner(id: string, updates: Partial<CommunityPartner>): Promise<CommunityPartner> {
    const { data, error } = await supabase
      .from('community_partners')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete partner
  async deletePartner(id: string): Promise<void> {
    const { error } = await supabase
      .from('community_partners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Board Members API functions
export const boardMembersApi = {
  // Get all active board members for public display
  async getActiveBoardMembers(): Promise<BoardMember[]> {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get all board members for admin (including inactive)
  async getAllBoardMembers(): Promise<BoardMember[]> {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create new board member
  async createBoardMember(member: Omit<BoardMember, 'id' | 'created_at' | 'updated_at'>): Promise<BoardMember> {
    const { data, error } = await supabase
      .from('board_members')
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update board member
  async updateBoardMember(id: string, updates: Partial<BoardMember>): Promise<BoardMember> {
    const { data, error } = await supabase
      .from('board_members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete board member
  async deleteBoardMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('board_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Events API functions
export const eventsApi = {
  // Get all active events for public display
  async getActiveEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching active events:', error);
      throw error;
    }
    
    console.log('Fetched active events:', data);
    return data || [];
  },

  // Get upcoming events (future dates only)
  async getUpcomingEvents(): Promise<Event[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const todayString = today.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('event_date', todayString)
      .order('event_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
    
    console.log('Fetched upcoming events:', data);
    return data || [];
  },

  // Get event by slug
  async getEventBySlug(slug: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Get all events for admin (including inactive)
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create new event
  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update event
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Gallery API functions
export const galleryApi = {
  // Get all active images for public gallery
  async getActiveImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get all images for admin (including inactive)
  async getAllImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create new image
  async createImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update image
  async updateImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from('gallery_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete image
  async deleteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return publicUrl;
  }
};

// Programs API functions
export const programsApi = {
  // Get all active programs for public display
  async getActivePrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get program by slug
  async getProgramBySlug(slug: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Get all programs for admin (including inactive)
  async getAllPrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create new program
  async createProgram(program: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<Program> {
    const { data, error } = await supabase
      .from('programs')
      .insert([program])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update program
  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase
      .from('programs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete program
  async deleteProgram(id: string): Promise<void> {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Authentication functions
export const authApi = {
  async signUp(email: string, password: string, userData: { first_name: string; last_name: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return userProfile?.is_admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  async manageAdminPrivileges(userId: string, action: 'grant' | 'revoke'): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return {
          success: false,
          message: 'Not authenticated',
          error: 'Not authenticated',
        };
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/manage-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId, action }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to update admin privileges',
          error: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Error managing admin privileges:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
};

// User management functions
export const userApi = {
  async getCurrentUserProfile(): Promise<User | null> {
    // First get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Remove id from updates if present (shouldn't be updated)
    const { id, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from('users')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUserProfile(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Event registration functions
export const registrationApi = {
  async registerForEvent(eventId: string, notes?: string): Promise<EventRegistration> {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        notes
      }])
      .select(`
        *,
        event:events(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserRegistrations(): Promise<EventRegistration[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        event:events(*)
      `)
      .order('registration_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async cancelRegistration(registrationId: string): Promise<void> {
    const { error } = await supabase
      .from('event_registrations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', registrationId);
    
    if (error) throw error;
  },

  async checkUserRegistration(eventId: string): Promise<EventRegistration | null> {
    // Check if user is authenticated first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .eq('status', 'registered')
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    return data;
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        user:users(*)
      `)
      .eq('event_id', eventId)
      .order('registration_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

export const contactApi = {
  async submitContactForm(formData: {
    name: string;
    email: string;
    message: string;
    type: 'general' | 'volunteer' | 'programs' | 'partnership';
    recaptchaToken: string;
  }): Promise<{ success: boolean; message: string; submissionId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to submit contact form',
          error: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
        submissionId: data.submissionId,
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/newsletter-subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to subscribe to newsletter',
          error: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateContactSubmissionStatus(
    id: string,
    status: 'new' | 'read' | 'resolved' | 'archived'
  ): Promise<ContactSubmission> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};