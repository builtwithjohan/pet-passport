import { openDB } from 'idb';

const DB_NAME = 'pet_passport_db';
const DB_VERSION = 3;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'token' });
      }

      if (!db.objectStoreNames.contains('pets')) {
        const petStore = db.createObjectStore('pets', { keyPath: 'id' });
        petStore.createIndex('ownerId', 'ownerId', { unique: false });
      }

      if (!db.objectStoreNames.contains('pet_shares')) {
        const shareStore = db.createObjectStore('pet_shares', { keyPath: 'id' });
        shareStore.createIndex('shareCode', 'shareCode', { unique: true });
        shareStore.createIndex('petId', 'petId', { unique: false });
      }

      if (!db.objectStoreNames.contains('document_blobs')) {
        db.createObjectStore('document_blobs', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('pet_photos')) {
        db.createObjectStore('pet_photos', { keyPath: 'id' });
      }
    }
  });
}

export const dbStore = {
  // Users
  async saveUser(user) {
    const db = await initDB();
    await db.put('users', user);
  },

  async getUserByEmail(email) {
    const db = await initDB();
    const tx = db.transaction('users', 'readonly');
    const index = tx.store.index('email');
    return index.get(email);
  },

  async getUserById(id) {
    const db = await initDB();
    return db.get('users', id);
  },

  // Sessions
  async saveSession(token, user, expiresInDays = 30) {
    const db = await initDB();
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
    await db.put('sessions', {
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt
    });
  },

  async getSession(token) {
    const db = await initDB();
    await this.pruneExpiredSessions();
    const session = await db.get('sessions', token);
    if (!session) return null;
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      await db.delete('sessions', token);
      return null;
    }
    return session;
  },

  async deleteSession(token) {
    const db = await initDB();
    await db.delete('sessions', token);
  },

  async pruneExpiredSessions() {
    try {
      const db = await initDB();
      const sessions = await db.getAll('sessions');
      const now = new Date();
      for (const s of sessions) {
        if (s.expiresAt && new Date(s.expiresAt) < now) {
          await db.delete('sessions', s.token);
        }
      }
    } catch (err) {
      console.warn('Failed to prune expired sessions:', err);
    }
  },

  // Pets
  async getPetsForUser(userId) {
    const db = await initDB();
    const tx = db.transaction('pets', 'readonly');
    const index = tx.store.index('ownerId');
    return index.getAll(userId);
  },

  async savePet(pet) {
    const db = await initDB();
    await db.put('pets', pet);
  },

  async savePetsBulk(pets) {
    const db = await initDB();
    const tx = db.transaction('pets', 'readwrite');
    for (const pet of pets) {
      await tx.store.put(pet);
    }
    await tx.done;
  },

  async deletePet(petId) {
    const db = await initDB();
    await db.delete('pets', petId);
  },

  // Family Shares
  async saveShare(shareRecord) {
    const db = await initDB();
    await db.put('pet_shares', shareRecord);
  },

  async getShareByCode(shareCode) {
    const db = await initDB();
    const tx = db.transaction('pet_shares', 'readonly');
    const index = tx.store.index('shareCode');
    return index.get(shareCode);
  },

  // Document Blobs (Heavy Binary Persistence)
  async saveDocumentBlob(docId, blob) {
    const db = await initDB();
    await db.put('document_blobs', { id: docId, blob, createdAt: new Date().toISOString() });
  },

  async getDocumentBlob(docId) {
    const db = await initDB();
    const rec = await db.get('document_blobs', docId);
    return rec?.blob || null;
  },

  async deleteDocumentBlob(docId) {
    const db = await initDB();
    await db.delete('document_blobs', docId);
  },

  // Pet Profile Photos (Heavy Image Persistence)
  async savePetPhotoBlob(petId, blob) {
    const db = await initDB();
    await db.put('pet_photos', { id: petId, blob, createdAt: new Date().toISOString() });
  },

  async getPetPhotoBlob(petId) {
    const db = await initDB();
    const rec = await db.get('pet_photos', petId);
    return rec?.blob || null;
  },

  async deletePetPhotoBlob(petId) {
    const db = await initDB();
    await db.delete('pet_photos', petId);
  }
};
