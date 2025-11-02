<!-- script.js -->
<script>
const STORAGE_KEY = "wardrobe_outfits_v1";

function getOutfits() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveOutfits(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addOutfit(item) {
  const list = getOutfits();
  list.unshift(item); // newest first
  saveOutfits(list);
}

function getRecent(limit = 8) {
  return getOutfits().slice(0, limit);
}

function renderOutfitGrid(containerEl, outfits) {
  containerEl.innerHTML = "";
  if (!outfits.length) {
    containerEl.innerHTML = `<p class="text-gray-500">No outfits yet. Add one!</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  outfits.forEach(o => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow hover:shadow-lg overflow-hidden";
    card.innerHTML = `
      <img src="${o.imageDataUrl}" alt="${o.title ?? o.category}" class="w-full aspect-square object-cover">
      <div class="p-3">
        <div class="text-sm text-gray-500 capitalize">${o.category}</div>
        <div class="font-medium text-gray-800 truncate">${o.title || "Untitled outfit"}</div>
        ${o.tags?.length ? `<div class="mt-1 text-xs text-gray-500 truncate">#${o.tags.join(" #")}</div>` : ""}
      </div>
    `;
    frag.appendChild(card);
  });
  containerEl.appendChild(frag);
}

// Home page: render "Recently Added"
document.addEventListener("DOMContentLoaded", () => {
  const recentWrap = document.querySelector("#recent-grid");
  if (recentWrap) {
    renderOutfitGrid(recentWrap, getRecent(8));
  }
});
</script>
