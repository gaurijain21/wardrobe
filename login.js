// login.js
import { auth, signInWithGoogle, onUser } from "./firebase.js";
import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("google-login");
const status = document.getElementById("status");

// Flag to prevent multiple redirects
let hasRedirected = false;

async function handleRedirectResult() {
  try {
    console.log("Checking for redirect result...");
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      console.log("✅ Sign-in successful via redirect:", result.user.email);
      status.textContent = `Signed in as ${result.user.displayName}. Redirecting...`;
      
      // Mark that we've handled the redirect
      hasRedirected = true;
      
      // Wait a bit longer to ensure Firebase session is fully established
      setTimeout(() => {
        console.log("Redirecting to index.html...");
        window.location.replace("index.html"); // Use replace instead of href
      }, 1500);
      
      return true;
    } else {
      console.log("No redirect result found");
    }
  } catch (error) {
    console.error("❌ Redirect sign-in error:", error);
    status.textContent = "Sign-in error: " + error.message;
  }
  
  return false;
}

// Handle login button click
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    if (loginBtn.disabled) return;
    
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";
    status.textContent = "Redirecting to Google...";
    
    try {
      await signInWithGoogle(); // This will redirect the page
    } catch (err) {
      console.error("Sign-in initiation error:", err);
      status.textContent = "Error: " + err.message;
      loginBtn.disabled = false;
      loginBtn.textContent = "Continue with Google";
    }
  });
}

// Check auth state
function checkAuthState() {
  onUser((user) => {
    if (hasRedirected) {
      // Already handling redirect, don't do anything
      return;
    }
    
    if (user) {
      console.log("✅ User already signed in:", user.email);
      status.textContent = `Already signed in as ${user.displayName}. Redirecting...`;
      
      hasRedirected = true;
      setTimeout(() => {
        window.location.replace("index.html");
      }, 1000);
    } else {
      console.log("ℹ️ No user signed in");
      status.textContent = "";
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Continue with Google";
      }
    }
  });
}

// Initialize on page load
(async () => {
  console.log("Login page loaded");
  
  // First check if we're coming back from Google redirect
  const redirectHandled = await handleRedirectResult();
  
  // Only check normal auth state if we didn't handle a redirect
  if (!redirectHandled) {
    checkAuthState();
  }
})();