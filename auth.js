// auth.js — NeilHunter Firebase Auth (compat, no ES modules)
// Firebase CDN scripts must be loaded BEFORE this file.

var Auth = (function () {

  var firebaseConfig = {
    apiKey:            "AIzaSyCAlRfpDHBbO9DgH_pppurPxVpSqJnzr-Q",
    authDomain:        "neil-hunter.firebaseapp.com",
    projectId:         "neil-hunter",
    storageBucket:     "neil-hunter.firebasestorage.app",
    messagingSenderId: "833964849235",
    appId:             "1:833964849235:web:fd20bfb1fb67d3f287eea6",
    measurementId:     "G-X5NHZCH2T8"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var auth = firebase.auth();
  var db   = firebase.firestore();

  // Persist session across tabs/refresh
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  // ── Sign Up ──────────────────────────────────────────────
  async function register(name, email, password) {
    try {
      var cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });

      // Save user to Firestore so admin can see them
      await db.collection('users').doc(cred.user.uid).set({
        uid:         cred.user.uid,
        displayName: name,
        email:       email,
        plan:        'FREE',
        searchesToday: 0,
        createdAt:   firebase.firestore.FieldValue.serverTimestamp()
      });

      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, error: friendlyError(err.code) };
    }
  }

  // ── Sign In ──────────────────────────────────────────────
  async function login(email, password) {
    try {
      var cred = await auth.signInWithEmailAndPassword(email, password);
      // Reload user to get fresh emailVerified status from Firebase
      await cred.user.reload();
      var freshUser = auth.currentUser;
      if (!freshUser.emailVerified) {
        await auth.signOut();
        return { ok: false, error: 'Please verify your email first. Check your inbox for the verification link.' };
      }
      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, error: friendlyError(err.code) };
    }
  }

  // ── Send Email Verification ─────────────────────────────
  async function sendVerification() {
    try {
      var user = auth.currentUser;
      if (user && !user.emailVerified) {
        await user.sendEmailVerification({
          url: window.location.origin + '/login.html'
        });
        // Sign out after sending verification so user must verify before logging in
        await auth.signOut();
      }
    } catch(e) { console.error('Verification email error:', e); }
  }

  // ── Sign Out ─────────────────────────────────────────────
  async function logout() {
    sessionStorage.setItem('nh_signed_out', '1');
    await auth.signOut();
    window.location.href = 'login.html';
  }

  function getSession() { return auth.currentUser; }

  function onSession(callback) { return auth.onAuthStateChanged(callback); }

  // Protected pages — redirects to login if not signed in
  function requireAuth() {
    return new Promise(function(resolve) {
      var unsubscribe = auth.onAuthStateChanged(function(user) {
        unsubscribe();
        if (user) { resolve(user); }
        else { window.location.href = 'login.html'; }
      });
    });
  }

  // ── Plan: read from Firestore, fallback to localStorage ──
  async function getPlanAsync(uid) {
    try {
      var doc = await db.collection('users').doc(uid).get();
      if (doc.exists && doc.data().plan) {
        var plan = doc.data().plan;
        localStorage.setItem('nh_plan_' + uid, plan); // cache it
        return plan;
      }
    } catch(e) {}
    return localStorage.getItem('nh_plan_' + uid) || 'FREE';
  }

  // Sync version (uses localStorage cache) — for pages that need it immediately
  function getPlan(uid) {
    return localStorage.getItem('nh_plan_' + uid) || 'FREE';
  }

  // ── Update plan in BOTH Firestore and localStorage ───────
  async function updatePlan(uid, plan) {
    localStorage.setItem('nh_plan_' + uid, plan);
    try {
      await db.collection('users').doc(uid).update({ plan: plan });
    } catch(e) {
      // If doc doesn't exist yet, set it
      try {
        await db.collection('users').doc(uid).set({ plan: plan }, { merge: true });
      } catch(e2) {}
    }
  }

  // ── Update searches count in Firestore ───────────────────
  async function recordSearch(uid) {
    try {
      await db.collection('users').doc(uid).update({
        searchesToday: firebase.firestore.FieldValue.increment(1)
      });
    } catch(e) {}
  }

  function friendlyError(code) {
    var map = {
      'auth/email-already-in-use':   'An account with this email already exists.',
      'auth/invalid-email':          'Please enter a valid email address.',
      'auth/weak-password':          'Password must be at least 6 characters.',
      'auth/user-not-found':         'No account found with this email.',
      'auth/wrong-password':         'Incorrect password. Please try again.',
      'auth/invalid-credential':     'Incorrect email or password.',
      'auth/too-many-requests':      'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  return {
    register:      register,
    login:         login,
    logout:        logout,
    getSession:    getSession,
    onSession:     onSession,
    requireAuth:   requireAuth,
    getPlan:       getPlan,
    getPlanAsync:  getPlanAsync,
    updatePlan:    updatePlan,
    recordSearch:  recordSearch,
    sendVerification: sendVerification
  };

})();
