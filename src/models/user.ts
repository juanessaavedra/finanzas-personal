/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  currency: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  currency: string;
}
