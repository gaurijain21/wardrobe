// upload.js
import { onUser, createOutfit } from "./firebase.js";

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

function updateSubmitState() {
  const canSubmit = fileChosen && categoryChosen && currentUser;
  submitBtn.disabled = !canSubmit;
  
  // Update button text to show what's missing
  if (!currentUser) {
    submitBtn.textContent = "⚠️ Please sign in first";
    submitBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    submitBtn.classList.remove("bg-indigo-600", "hover:bg-indigo-700");
  } else if (!fileChosen) {
    submitBtn.textContent = "📸 Please select a photo";
    submitBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    submitBtn.classList.remove("bg-indigo-600", "hover:bg-indigo-700");
  } else if (!categoryChosen) {
    submitBtn.textContent = "📁 Please choose a category";
    submitBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    submitBtn.classList.remove("bg-indigo-600", "hover:bg-indigo-700");
  } else {
    submitBtn.textContent = "💾 Save Outfit";
    submitBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
    submitBtn.classList.add("bg-indigo-600", "hover:bg-indigo-700");
  }
  
  console.log("📊 Submit state:", {
    user: currentUser?.email || "not signed in",
    file: fileChosen?.name || "no file",
    category: categoryChosen || "no category",
    canSubmit
  });
}

function selectCategory(cat) {
  categoryChosen = cat;
  if (hiddenCategory) {
    hiddenCategory.value = cat;
  }

  // visual highlight
  categoryBtns.forEach(btn => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle("ring-2", isActive);
    btn.classList.toggle("ring-indigo-500", isActive);
    btn.classList.toggle("bg-indigo-50", isActive);
  });

  console.log("✅ Category selected:", cat);
  updateSubmitState();
}

// --- Listen for auth state changes ---
onUser((user) => {
  console.log("👤 Upload page - Auth state changed:", user ? `${user.email} (${user.uid})` : "Not signed in");
  currentUser = user || null;
  
  // Show auth status to user
  const uploadSection = document.querySelector('main');
  if (!user && uploadSection) {
    // Show warning banner if not signed in
    let warningBanner = document.getElementById('auth-warning');
    if (!warningBanner) {
      warningBanner = document.createElement('div');
      warningBanner.id = 'auth-warning';
      warningBanner.className = 'bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6';
      warningBanner.innerHTML = `
        <div class="flex">
          <div class="flex-shrink-0">
            <i data-feather="alert-triangle" class="w-5 h-5 text-yellow-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              You need to sign in to save outfits. Please <a href="index.html" class="font-medium underline">return to home page</a> and sign in with Google.
            </p>
          </div>
        </div>
      `;
      uploadSection.insertBefore(warningBanner, uploadSection.firstChild);
      if (window.feather) feather.replace();
    }
  } else {
    // Remove warning if user is signed in
    const warningBanner = document.getElementById('auth-warning');
    if (warningBanner) {
      warningBanner.remove();
    }
  }
  
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
    console.log("📸 File selected:", f.name, `(${(f.size / 1024 / 1024).toFixed(2)} MB)`);
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
  
  console.log("🎯 Submit clicked");
  console.log("📊 Current state:", {
    user: currentUser?.email || "NOT SIGNED IN",
    userId: currentUser?.uid || "NO UID",
    file: fileChosen?.name || "NO FILE",
    category: categoryChosen || "NO CATEGORY"
  });
  
  if (!currentUser) {
    alert("⚠️ Please sign in first! Go back to the home page and click 'Sign in with Google'.");
    return;
  }
  
  if (!fileChosen) {
    alert("📸 Please select a photo first.");
    return;
  }
  
  if (!categoryChosen) {
    alert("📁 Please choose a category.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "💾 Saving...";
  submitBtn.classList.add("opacity-50");

  const notes = [
    nameInput?.value?.trim() ? `Name: ${nameInput.value.trim()}` : "",
    notesInput?.value?.trim() || ""
  ].filter(Boolean).join(" • ");

  try {
    console.log("🚀 Creating outfit...");
    const outfit = await createOutfit({
      userId: currentUser.uid,
      file: fileChosen,
      category: categoryChosen,
      notes,
      colors: []
    });

    console.log("✅ Outfit saved successfully!", outfit);
    alert("✅ Outfit saved successfully!");
    
    // Redirect to category page
    setTimeout(() => {
      window.location.href = `category.html?type=${encodeURIComponent(categoryChosen)}`;
    }, 500);
  } catch (err) {
    console.error("❌ Save error:", err);
    alert("❌ Failed to save: " + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "💾 Save Outfit";
    submitBtn.classList.remove("opacity-50");
  }
});

// Initial state
console.log("📄 Upload page loaded");
updateSubmitState();