// upload.js
import { onUser, signInWithGoogle, signOutUser, createOutfit } from "./firebase.js";

let currentUser = null;
let fileChosen = null;
let categoryChosen = null;

const fileInput = document.getElementById("outfit-upload");
const previewImg = document.getElementById("outfit-preview");
const previewContainer = document.getElementById("preview-container");

const nameInput = document.getElementById("outfit-name");
const notesInput = document.getElementById("outfit-notes");

const hiddenCategory = document.getElementById("selected-category");
const submitBtn = document.getElementById("submit-outfit");

const categoryBtns = Array.from(document.querySelectorAll(".category-btn"));

// Auth UI elements
const signedOutView = document.getElementById("signed-out-view");
const signedInView = document.getElementById("signed-in-view");
const signinBtn = document.getElementById("signin-btn");
const signoutBtn = document.getElementById("signout-btn");
const userEmailEl = document.getElementById("user-email");

function updateAuthUI(user) {
  if (user) {
    signedOutView.classList.add("hidden");
    signedInView.classList.remove("hidden");
    userEmailEl.textContent = user.email;
  } else {
    signedOutView.classList.remove("hidden");
    signedInView.classList.add("hidden");
  }
}

function updateSubmitState() {
  const canSubmit = fileChosen && categoryChosen && currentUser;
  submitBtn.disabled = !canSubmit;
  
  // Update button text to show what's missing
  if (!currentUser) {
    submitBtn.textContent = "Please sign in first";
  } else if (!fileChosen) {
    submitBtn.textContent = "Please select a photo";
  } else if (!categoryChosen) {
    submitBtn.textContent = "Please choose a category";
  } else {
    submitBtn.textContent = "Save Outfit";
  }
}

function selectCategory(cat) {
  categoryChosen = cat;
  hiddenCategory.value = cat;

  // visual highlight
  categoryBtns.forEach(btn => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle("ring-2", isActive);
    btn.classList.toggle("ring-indigo-500", isActive);
    btn.classList.toggle("bg-indigo-50", isActive);
  });

  console.log("Category selected:", cat);
  updateSubmitState();
}

// --- Auth handlers ---
signinBtn?.addEventListener("click", async () => {
  try {
    signinBtn.disabled = true;
    signinBtn.textContent = "Signing in...";
    await signInWithGoogle();
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Sign-in failed. Please try again.");
    signinBtn.disabled = false;
    signinBtn.textContent = "Sign in with Google";
  }
});

signoutBtn?.addEventListener("click", async () => {
  try {
    await signOutUser();
    currentUser = null;
    updateAuthUI(null);
    updateSubmitState();
  } catch (error) {
    console.error("Sign-out error:", error);
    alert("Sign-out failed. Please try again.");
  }
});

// --- Listen for auth state changes ---
onUser((user) => {
  console.log("Auth state changed:", user ? user.email : "Not signed in");
  currentUser = user || null;
  updateAuthUI(user);
  updateSubmitState();
  
  // Re-initialize feather icons for the auth section
  if (window.feather) {
    feather.replace();
  }
});

// --- File preview ---
fileInput?.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  fileChosen = f || null;
  if (f) {
    console.log("File selected:", f.name);
    const url = URL.createObjectURL(f);
    previewImg.src = url;
    previewContainer.classList.remove("hidden");
  }
  updateSubmitState();
});

// --- Category buttons ---
categoryBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    selectCategory(btn.dataset.category);
  });
});

// --- Submit handler ---
submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  
  console.log("Submit clicked. User:", currentUser?.email, "File:", fileChosen?.name, "Category:", categoryChosen);
  
  if (!currentUser) {
    alert("Please sign in with Google first.");
    return;
  }
  
  if (!fileChosen) {
    alert("Please select a photo.");
    return;
  }
  
  if (!categoryChosen) {
    alert("Please choose a category.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  const notes = [
    nameInput?.value?.trim() ? `Name: ${nameInput.value.trim()}` : "",
    notesInput?.value?.trim() || ""
  ].filter(Boolean).join(" • ");

  try {
    console.log("Creating outfit...");
    await createOutfit({
      userId: currentUser.uid,
      file: fileChosen,
      category: categoryChosen,
      notes,
      colors: []
    });

    console.log("Outfit saved successfully!");
    alert("Outfit saved successfully!");
    window.location.href = `category.html?type=${encodeURIComponent(categoryChosen)}`;
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save: " + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Outfit";
  }
});

// Initial state
updateSubmitState();