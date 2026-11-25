import { UserAccount } from '../types';

const USER_STORAGE_KEY = 'scanny_user_account_v1';
const INTRO_SEEN_KEY = 'scanny_intro_seen_v1';
const REGISTERED_USERS_KEY = 'scanny_registered_users_v1';

interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export function hasSeenIntro(): boolean {
  return localStorage.getItem(INTRO_SEEN_KEY) === 'true';
}

export function markIntroSeen(): void {
  localStorage.setItem(INTRO_SEEN_KEY, 'true');
}

export function resetIntroSeen(): void {
  localStorage.removeItem(INTRO_SEEN_KEY);
}

export function getCurrentUser(): UserAccount | null {
  try {
    const sessionRaw = sessionStorage.getItem(USER_STORAGE_KEY);
    if (sessionRaw) {
      return JSON.parse(sessionRaw) as UserAccount;
    }

    const localRaw = localStorage.getItem(USER_STORAGE_KEY);
    if (!localRaw) return null;
    const parsed = JSON.parse(localRaw) as UserAccount;

    // Legacy guest sessions should not persist permanently across new tabs
    if (parsed.isGuest) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getRegisteredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUserRecord[]) : [];
  } catch {
    return [];
  }
}

export function registerAccount(
  name: string,
  email: string,
  password: string
): { user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) return { error: 'Please enter your name.' };
  if (!cleanEmail || !cleanEmail.includes('@')) return { error: 'Please enter a valid email address.' };
  if (password.length < 4) return { error: 'Password must be at least 4 characters.' };

  const users = getRegisteredUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    return { error: 'An account with this email already exists. Please sign in.' };
  }

  const newRecord: StoredUserRecord = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: btoa(password),
  };

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, newRecord]));

  const account: UserAccount = {
    id: newRecord.id,
    name: newRecord.name,
    email: newRecord.email,
    isGuest: false,
    signedInAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(account));
  return { user: account };
}

export function signInAccount(
  email: string,
  password: string
): { user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!password) {
    return { error: 'Please enter your password.' };
  }

  const users = getRegisteredUsers();
  const matched = users.find((u) => u.email === cleanEmail);

  if (matched) {
    if (matched.passwordHash !== btoa(password)) {
      return { error: 'Incorrect password. Please try again.' };
    }
    const account: UserAccount = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      isGuest: false,
      signedInAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(account));
    return { user: account };
  }

  // Smooth local sign-in for first-time email usage
  const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
  const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
  const newRecord: StoredUserRecord = {
    id: `usr-${Date.now()}`,
    name: formattedName,
    email: cleanEmail,
    passwordHash: btoa(password),
  };
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, newRecord]));

  const account: UserAccount = {
    id: newRecord.id,
    name: newRecord.name,
    email: newRecord.email,
    isGuest: false,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(account));
  return { user: account };
}

export function continueAsGuest(): UserAccount {
  const guest: UserAccount = {
    id: 'guest',
    name: 'Guest User',
    email: '',
    isGuest: true,
    signedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guest));
  return guest;
}

export function signOutAccount(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}
