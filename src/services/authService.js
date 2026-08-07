import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const TOKEN_KEY = 'pet_passport_session_token';

function getInitialsAvatar(name) {
  const initials = (name || 'Traveler').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#6366F1"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#FFFFFF" font-size="38" font-family="system-ui, sans-serif" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function hashPassword(password, saltHex) {
  if (!window.crypto?.subtle) {
    throw new Error('Web Crypto API (SubtleCrypto) is required for secure authentication.');
  }
  const enc = new TextEncoder();
  const salt = saltHex ? new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))) : enc.encode('pet_passport_default_salt');
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const exported = await crypto.subtle.exportKey('raw', key);
  return Array.from(new Uint8Array(exported)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomSaltHex() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSecureToken() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
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
            avatarUrl: session.user.user_metadata?.avatar_url || getInitialsAvatar(session.user.email.split('@')[0]),
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
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    if (isSupabaseConfigured) {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return {
          id: data.user.id,
          email: data.user.email,
          name: email.split('@')[0],
          avatarUrl: getInitialsAvatar(email.split('@')[0])
        };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatarUrl: getInitialsAvatar(email.split('@')[0])
        };
      }
    }

    const existingUser = await dbStore.getUserByEmail(email);

    if (isSignUp) {
      if (existingUser) {
        throw new Error('An account already exists with this email. Please sign in instead.');
      }

      const saltHex = generateRandomSaltHex();
      const passwordHash = await hashPassword(password, saltHex);
      const userName = email.split('@')[0];

      const newUser = {
        id: 'usr_' + generateSecureToken(),
        email,
        passwordHash,
        salt: saltHex,
        name: userName,
        avatarUrl: getInitialsAvatar(userName),
        createdAt: new Date().toISOString()
      };

      await dbStore.saveUser(newUser);

      const token = generateSecureToken();
      localStorage.setItem(TOKEN_KEY, token);
      await dbStore.saveSession(token, newUser);

      return newUser;
    } else {
      if (!existingUser) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      const userSalt = existingUser.salt || 'pet_passport_default_salt';
      const passwordHash = await hashPassword(password, userSalt);

      if (existingUser.passwordHash && existingUser.passwordHash !== passwordHash) {
        throw new Error('Invalid email or password. Please try again.');
      }

      const token = generateSecureToken();
      localStorage.setItem(TOKEN_KEY, token);
      await dbStore.saveSession(token, existingUser);

      return existingUser;
    }
  },

  async loginWithOAuthProvider(provider) {
    if (!isSupabaseConfigured) {
      throw new Error(`OAuth sign-in with ${provider} requires Supabase backend configuration. Please sign in with Email/Password.`);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return null;
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

