// upload.js
import { onUser, signInWithGoogle, createOutfit } from "./firebase.js";

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
  submitBtn.disabled = !(fileChosen && categoryChosen && currentUser);
}

function selectCategory(cat) {
  categoryChosen = cat;
  hiddenCategory.value = cat;

  // visual highlight (no layout change; just tailwind classes)
  categoryBtns.forEach(btn => {
    const isActive = btn.dataset.category === cat;
    btn.classList.toggle("ring-2", isActive);
    btn.classList.toggle("ring-indigo-500", isActive);
    btn.classList.toggle("bg-indigo-50", isActive);
  });

  updateSubmitState();
}

// --- Auth ---
onUser(async (user) => {
  if (!user) {
    try { await signInWithGoogle(); } catch (e) {
      console.warn("Sign-in failed or cancelled.", e);
    }
  }
  currentUser = user || null;
  updateSubmitState();
});

// --- File preview ---
fileInput?.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  fileChosen = f || null;
  if (f) {
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
  if (!currentUser) return alert("Please sign in first.");
  if (!fileChosen) return alert("Please select a photo.");
  if (!categoryChosen) return alert("Please choose a category.");

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  // Combine fields (you can extend schema later)
  const notes = [
    nameInput?.value?.trim() ? `Name: ${nameInput.value.trim()}` : "",
    notesInput?.value?.trim() || ""
  ].filter(Boolean).join(" • ");

  try {
    await createOutfit({
      userId: currentUser.uid,
      file: fileChosen,
      category: categoryChosen,
      notes,
      colors: [] // you can add a colors picker later
    });

    // Go to the category page you just saved to
    window.location.href = `category.html?type=${encodeURIComponent(categoryChosen)}`;
  } catch (err) {
    console.error(err);
    alert("Failed to save. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Outfit";
  }
});
