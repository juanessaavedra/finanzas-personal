import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/constants';

/**
 * Supabase service for backend communication
 */
class SupabaseService {
  private static instance: SupabaseClient | null = null;

  /**
   * Initialize Supabase client
   */
  static initialize(): SupabaseClient {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error(
        'Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file'
      );
    }

    if (!this.instance) {
      this.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    }

    return this.instance;
  }

  /**
   * Get Supabase client instance
   */
  static getClient(): SupabaseClient {
    if (!this.instance) {
      return this.initialize();
    }
    return this.instance;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const client = this.getClient();
    const { data } = await client.auth.getUser();
    return data.user;
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<Session | null> {
    const client = this.getClient();
    const { data } = await client.auth.getSession();
    return data.session;
  }

  /**
   * Get current user ID
   */
  static async getCurrentUserId(): Promise<string | null> {
    const session = await this.getCurrentSession();
    return session?.user?.id ?? null;
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    const client = this.getClient();
    await client.auth.signOut();
  }
}

// Initialize on module load
const supabase = SupabaseService.initialize();

export { supabase, SupabaseService };
export type { User, Session };
