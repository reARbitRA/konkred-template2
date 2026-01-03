
import { User, AuthResult } from '../types';
import { MOCK_USER } from '../constants';

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  private userKey = 'konkred_user_session';

  async login(email: string, password: string): Promise<AuthResult> {
    await delay(1200); // Simulate network latency

    // Simple mock validation
    if (password.length < 3) {
      return { success: false, error: 'Invalid credentials. Access Key too short.' };
    }

    // In a real app, we'd verify credentials here.
    // For Phase 1, we return the MOCK_USER attached to the email entered
    const user: User = {
        ...MOCK_USER,
        email: email,
        name: email.split('@')[0] || 'Architect'
    };

    this.persistUser(user);
    return { success: true, user };
  }

  async logout(): Promise<void> {
    await delay(500);
    localStorage.removeItem(this.userKey);
  }

  async getCurrentSession(): Promise<User | null> {
    await delay(300);
    const stored = localStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) : null;
  }

  private persistUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

export const authService = new AuthService();
