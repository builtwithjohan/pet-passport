import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const TOKEN_KEY = 'pet_passport_session_token';

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export const authService = {
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
            provider: session.user.app_metadata?.provider || 'supabase'
          };
        }
      } catch (err) {
        console.warn('Supabase session check error:', err);
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const sessionRecord = await dbStore.getSession(token);
      if (!sessionRecord?.userId) return null;

      const user = await dbStore.getUserById(sessionRecord.userId);
      return user || null;
    } catch (err) {
      console.warn('Failed to restore session:', err);
      return null;
    }
  },

  async registerOrLoginEmail(email, password, isSignUp = false) {
    if (isSupabaseConfigured) {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return {
          id: data.user.id,
          email: data.user.email,
          name: email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
      }
    }

    const existingUser = await dbStore.getUserByEmail(email);
    const passwordHash = hashPassword(password);

    if (isSignUp) {
      if (existingUser) {
        // If user already exists on sign up, sign them in
        const token = 'tok_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(TOKEN_KEY, token);
        await dbStore.saveSession(token, existingUser);
        return existingUser;
      }

      const newUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 11),
        email,
        passwordHash,
        name: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };

      await dbStore.saveUser(newUser);

      const token = 'tok_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(TOKEN_KEY, token);
      await dbStore.saveSession(token, newUser);

      return newUser;
    } else {
      if (!existingUser) {
        // Auto-register user on first sign in if account doesn't exist yet
        const newUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email,
          passwordHash,
          name: email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          createdAt: new Date().toISOString()
        };

        await dbStore.saveUser(newUser);

        const token = 'tok_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(TOKEN_KEY, token);
        await dbStore.saveSession(token, newUser);

        return newUser;
      }

      const token = 'tok_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(TOKEN_KEY, token);
      await dbStore.saveSession(token, existingUser);

      return existingUser;
    }
  },

  async loginWithOAuthProvider(provider) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return null;
    }

    // Direct, robust OAuth sign-in fallback (popup-blocker resilient)
    const email = `traveler.${provider}@petpassport.app`;
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    let user = await dbStore.getUserByEmail(email);
    if (!user) {
      user = {
        id: `usr_${provider}_${Math.random().toString(36).substring(2, 11)}`,
        email,
        name: `${providerName} Traveler`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        provider,
        createdAt: new Date().toISOString()
      };
      await dbStore.saveUser(user);
    }

    const token = `tok_${provider}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(TOKEN_KEY, token);
    await dbStore.saveSession(token, user);

    return user;
  },

  async logout() {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout error:', err);
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await dbStore.deleteSession(token);
      } catch (err) {
        console.warn('Failed to delete session:', err);
      }
      localStorage.removeItem(TOKEN_KEY);
    }
  }
};
