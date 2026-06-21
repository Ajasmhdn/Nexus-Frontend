
/**
 * DEPRECATED: Use initialization from @/firebase instead.
 * This file is kept as a proxy to prevent breakages while migrating.
 */
import { initializeFirebase } from '@/firebase';

const { auth, firestore: db } = initializeFirebase();

export { auth, db };
