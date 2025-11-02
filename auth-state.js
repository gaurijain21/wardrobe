// auth-state.js - Global authentication state handler
import { auth, onUser, signInWithGoogle, signOutUser as firebaseSignOut } from "./firebase.js";
import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Track current user globally
window.currentAppUser = null;

// Check for redirect result when page loads
async function checkRedirectResult() {
  try {
    console.log("Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      console.log("✅ Sign-in successful via redirect:", result.user.email);
      // The onUser listener will handle the UI update
      return true;
    }
  } catch (error) {
    console.error("❌ Redirect error:", error);
    alert("Sign-in failed: " + error.message);
  }
  return false;
}

// Initialize auth state listener
onUser((user) => {
  window.currentAppUser = user;
  console.log("Global auth state:", user ? user.email : "Not signed in");
  
  // Update UI elements that show user info
  updateAuthUI(user);
});

function updateAuthUI(user) {
  // Get UI elements
  const userInfo = document.getElementById('user-info');
  const authButtons = document.getElementById('auth-buttons');
  
  if (!authButtons) return; // Not on a page with auth UI
  
  if (user) {
    // User is signed in
    if (userInfo) {
      userInfo.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span class="text-indigo-600 font-semibold text-sm">${user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</span>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-700">${user.displayName || 'User'}</div>
            <div class="text-xs text-gray-500">${user.email}</div>
          </div>
        </div>
      `;
    }
    
    authButtons.innerHTML = `
      <button id="signout-btn" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
        <i data-feather="log-out" class="w-4 h-4 mr-2"></i>
        Sign Out
      </button>
    `;
    
    // Add sign out handler
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', handleSignOut);
    }
  } else {
    // User is signed out
    if (userInfo) {
      userInfo.innerHTML = `
        <div class="flex items-center space-x-2">
          <i data-feather="info" class="w-4 h-4 text-gray-400"></i>
          <span class="text-gray-500 text-sm">Sign in to save and organize your outfits</span>
        </div>
      `;
    }
    
    authButtons.innerHTML = `
      <button id="signin-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
        <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>
    `;
    
    // Add sign in handler
    const signinBtn = document.getElementById('signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', handleSignIn);
    }
  }
  
  // Re-initialize feather icons if available
  if (window.feather) {
    feather.replace();
  }
}

async function handleSignIn() {
  const signinBtn = document.getElementById('signin-btn');
  if (!signinBtn) return;
  
  try {
    signinBtn.disabled = true;
    signinBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Signing in...
    `;
    
    console.log("Initiating Google sign-in...");
    await signInWithGoogle();
    // The page will redirect to Google, so we won't reach here
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Failed to sign in: " + error.message);
    signinBtn.disabled = false;
    updateAuthUI(null); // Reset the button
  }
}

async function handleSignOut() {
  try {
    await firebaseSignOut();
    // Show brief success message
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.innerHTML = `
        <div class="flex items-center space-x-2">
          <i data-feather="check-circle" class="w-4 h-4 text-green-500"></i>
          <span class="text-green-600 text-sm">Signed out successfully</span>
        </div>
      `;
      if (window.feather) feather.replace();
      
      setTimeout(() => {
        updateAuthUI(null);
      }, 2000);
    }
  } catch (error) {
    console.error("Sign out error:", error);
    alert("Failed to sign out. Please try again.");
  }
}

// Check for redirect result on page load
checkRedirectResult();

export { updateAuthUI };