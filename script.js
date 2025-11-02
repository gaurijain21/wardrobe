// script.js
import { onUser, getRecentOutfits } from "./firebase.js";

// Render outfit grid
function renderOutfitGrid(containerEl, outfits) {
  if (!containerEl) return;
  
  containerEl.innerHTML = "";
  
  if (!outfits || outfits.length === 0) {
    containerEl.innerHTML = `
      <div class="text-center py-12 col-span-full">
        <i data-feather="image" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
        <p class="text-gray-500">No outfits yet. Upload your first outfit!</p>
      </div>
    `;
    if (window.feather) feather.replace();
    return;
  }
  
  const frag = document.createDocumentFragment();
  
  outfits.forEach(outfit => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer";
    
    card.innerHTML = `
      <img src="${outfit.imageUrl}" alt="${outfit.category}" class="w-full aspect-square object-cover">
      <div class="p-3">
        <div class="text-sm text-gray-500 capitalize">${outfit.category}</div>
        ${outfit.notes ? `<div class="text-xs text-gray-600 mt-1 truncate">${outfit.notes}</div>` : ''}
      </div>
    `;
    
    frag.appendChild(card);
  });
  
  containerEl.appendChild(frag);
  
  if (window.feather) feather.replace();
}

// Load recent outfits when user is signed in
async function loadRecentOutfits(userId) {
  const recentGrid = document.getElementById("recent-grid");
  if (!recentGrid) return;
  
  try {
    // Show loading state
    recentGrid.innerHTML = `
      <div class="text-center py-12 col-span-full">
        <div class="animate-pulse">
          <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500">Loading your outfits...</p>
        </div>
      </div>
    `;
    
    const outfits = await getRecentOutfits(userId, 8);
    renderOutfitGrid(recentGrid, outfits);
  } catch (error) {
    console.error("Error loading recent outfits:", error);
    recentGrid.innerHTML = `
      <div class="text-center py-12 col-span-full">
        <i data-feather="alert-circle" class="w-12 h-12 text-red-400 mx-auto mb-4"></i>
        <p class="text-red-500">Failed to load outfits</p>
      </div>
    `;
    if (window.feather) feather.replace();
  }
}

// Listen for auth state changes
onUser((user) => {
  if (user) {
    console.log("User signed in, loading recent outfits...");
    loadRecentOutfits(user.uid);
  } else {
    console.log("User signed out");
    const recentGrid = document.getElementById("recent-grid");
    if (recentGrid) {
      recentGrid.innerHTML = `
        <div class="text-center py-12 col-span-full">
          <i data-feather="lock" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
          <p class="text-gray-500">Sign in to see your outfits</p>
        </div>
      `;
      if (window.feather) feather.replace();
    }
  }
});