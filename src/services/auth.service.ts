import { supabase } from './supabase';
import { User } from '@/models';
import { MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_DURATION } from '@/config/constants';

/**
 * Rate limiting storage
 */
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

/**
 * Authentication service
 */
export class AuthService {
  /**
   * Sanitize email to prevent injection
   */
  private static sanitizeEmail(email: string): string {
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase().trim();
  }

  /**
   * Check if email is rate limited
   */
  private static isRateLimited(email: string): boolean {
    const attempt = loginAttempts.get(email);
    if (!attempt) return false;

    const now = Date.now();

    // Check if locked
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      const remainingMinutes = Math.ceil((attempt.lockedUntil - now) / 60000);
      throw new Error(
        `Demasiados intentos fallidos. Intente de nuevo en ${remainingMinutes} minuto(s).`
      );
    }

    // Reset if lockout expired
    if (attempt.lockedUntil && now >= attempt.lockedUntil) {
      loginAttempts.delete(email);
      return false;
    }

    return false;
  }

  /**
   * Record failed login attempt
   */
  private static recordFailedAttempt(email: string): void {
    const now = Date.now();
    const attempt = loginAttempts.get(email) || { count: 0, lastAttempt: now };

    attempt.count += 1;
    attempt.lastAttempt = now;

    // Lock account if max attempts reached
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.lockedUntil = now + LOGIN_LOCKOUT_DURATION;
      loginAttempts.set(email, attempt);
      throw new Error(
        `Demasiados intentos fallidos. Cuenta bloqueada por ${LOGIN_LOCKOUT_DURATION / 60000} minutos.`
      );
    }

    loginAttempts.set(email, attempt);
  }

  /**
   * Clear failed attempts on successful login
   */
  private static clearFailedAttempts(email: string): void {
    loginAttempts.delete(email);
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      // Sanitize and validate email
      const sanitizedEmail = this.sanitizeEmail(email);

      // Check rate limiting
      this.isRateLimited(sanitizedEmail);

      // Validate password
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        this.recordFailedAttempt(sanitizedEmail);
        throw new Error('Credenciales inválidas');
      }

      if (!data.user) {
        throw new Error('Error al iniciar sesión');
      }

      // Clear failed attempts on success
      this.clearFailedAttempts(sanitizedEmail);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Error al cargar el perfil del usuario');
      }

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        currency: profile.currency || 'COP',
        createdAt: new Date(profile.created_at),
        updatedAt: profile.updated_at ? new Date(profile.updated_at) : undefined,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Error al cerrar sesión');
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      currency: profile.currency || 'COP',
      createdAt: new Date(profile.created_at),
      updatedAt: profile.updated_at ? new Date(profile.updated_at) : undefined,
    };
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(
    callback: (user: User | null) => void
  ): { unsubscribe: () => void } {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  }
}
