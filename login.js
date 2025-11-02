// login.js
import { auth, signInWithGoogle, onUser } from "./firebase.js";
import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("google-login");
const status = document.getElementById("status");

async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("✅ Redirect sign-in successful:", result.user.email);
      status.textContent = `Signed in as ${result.user.displayName}`;
      // redirect to home
      setTimeout(() => (window.location.href = "index.html"), 1000);
      return true;
    }
  } catch (error) {
    console.error("Redirect sign-in error:", error);
  }
  return false;
}

loginBtn.addEventListener("click", async () => {
  status.textContent = "Redirecting to Google sign-in...";
  try {
    await signInWithGoogle(); // performs redirect
  } catch (err) {
    console.error("Sign-in error:", err);
    status.textContent = "Error: " + err.message;
  }
});

(async () => {
  // 1️⃣ Wait for redirect result first
  const alreadyHandled = await handleRedirectResult();
  if (alreadyHandled) return;

  // 2️⃣ Then listen for normal logged-in users
  onUser((user) => {
    if (user) {
      console.log("Already signed in:", user.email);
      status.textContent = `Welcome back, ${user.displayName}!`;
      setTimeout(() => (window.location.href = "index.html"), 1000);
    } else {
      console.log("Not signed in yet.");
    }
  });
})();
