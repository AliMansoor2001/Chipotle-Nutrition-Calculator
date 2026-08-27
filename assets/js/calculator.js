/**
 * Chipotle Nutrition Calculator - Interactive Calculator Engine
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var calcContainer = document.querySelector("[data-menu-key]");
    if (!calcContainer || !window.ChipotleData) return;

    var menuKey = calcContainer.getAttribute("data-menu-key");
    var menuConfig = window.ChipotleData.menus[menuKey];
    var ingredientsMap = window.ChipotleData.ingredients;

    if (!menuConfig) {
      console.warn("Menu configuration not found for key:", menuKey);
      return;
    }

    // State: Set of selected ingredient IDs
    var selectedIds = new Set();

    // DOM Elements
    var categoriesContainer = document.getElementById("ingredientCategories");
    var statCalories = document.getElementById("statCalories");
    var statProtein = document.getElementById("statProtein");
    var statCarbs = document.getElementById("statCarbs");
    var statFat = document.getElementById("statFat");
    var statFiber = document.getElementById("statFiber");
    var statSugar = document.getElementById("statSugar");
    var statSodium = document.getElementById("statSodium");
    
    var macroBarProtein = document.getElementById("macroBarProtein");
    var macroBarCarbs = document.getElementById("macroBarCarbs");
    var macroBarFat = document.getElementById("macroBarFat");
    var macroPctProtein = document.getElementById("macroPctProtein");
    var macroPctCarbs = document.getElementById("macroPctCarbs");
    var macroPctFat = document.getElementById("macroPctFat");

    var selectedCountBadge = document.getElementById("selectedCountBadge");
    var breakdownTableBody = document.getElementById("breakdownTableBody");
    var breakdownEmptyMsg = document.getElementById("breakdownEmptyMsg");
    var selectedChipsContainer = document.getElementById("selectedChipsContainer");
    var clearAllBtn = document.getElementById("clearAllBtn");
    var clearAllBtnMobile = document.getElementById("clearAllBtnMobile");

    // Mobile floating bar elements
    var mobileBarCalories = document.getElementById("mobileBarCalories");
    var mobileBarProtein = document.getElementById("mobileBarProtein");
    var mobileBarCarbs = document.getElementById("mobileBarCarbs");
    var mobileBarFat = document.getElementById("mobileBarFat");
    var mobileToggleDrawerBtn = document.getElementById("mobileToggleDrawerBtn");
    var nutritionSummaryPanel = document.getElementById("nutritionSummaryPanel");

    // 1. Render Categories & Ingredient Cards
    function renderCategories() {
      if (!categoriesContainer) return;
      categoriesContainer.innerHTML = "";

      menuConfig.categories.forEach(function (category, catIndex) {
        var groupEl = document.createElement("section");
        groupEl.className = "calc-category-group";
        groupEl.setAttribute("aria-labelledby", "cat-heading-" + catIndex);

        var heading = document.createElement("div");
        heading.className = "calc-category-header";
        heading.innerHTML = '<h3 id="cat-heading-' + catIndex + '">' + category.name + '</h3>' +
                            '<span class="calc-category-count">' + category.items.length + ' options</span>';
        groupEl.appendChild(heading);

        var gridEl = document.createElement("div");
        gridEl.className = "calc-ingredient-grid";

        category.items.forEach(function (ingId) {
          var item = ingredientsMap[ingId];
          if (!item) return;

          var card = document.createElement("div");
          card.className = "ingredient-card" + (item.hasNutrition ? "" : " ingredient-card-nodata");
          card.id = "card-" + item.id;
          card.setAttribute("role", "checkbox");
          card.setAttribute("aria-checked", "false");
          card.setAttribute("tabindex", "0");
          card.dataset.id = item.id;

          var macroTagsHtml = "";
          if (item.hasNutrition) {
            macroTagsHtml = 
              '<div class="ing-macros">' +
                '<span class="macro-tag tag-cal"><strong>' + item.calories + '</strong> cal</span>' +
                '<span class="macro-tag"><strong>' + item.protein + 'g</strong> pro</span>' +
                '<span class="macro-tag"><strong>' + item.carbs + 'g</strong> carb</span>' +
                '<span class="macro-tag"><strong>' + item.fat + 'g</strong> fat</span>' +
              '</div>';
          } else {
            macroTagsHtml = 
              '<div class="ing-macros">' +
                '<span class="macro-tag tag-unavailable" title="' + (item.note || 'No nutrition data available') + '">⚠️ No Nutrition Data Available</span>' +
              '</div>';
          }

          var servingBadgeHtml = item.serving && item.serving !== "N/A"
            ? '<span class="serving-badge">' + item.serving + '</span>'
            : '';

          card.innerHTML = 
            '<div class="ing-checkbox-wrap">' +
              '<span class="custom-checkbox" aria-hidden="true">' +
                '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
                  '<polyline points="3 8.5 6.5 12 13 4.5"></polyline>' +
                '</svg>' +
              '</span>' +
            '</div>' +
            '<div class="ing-info">' +
              '<div class="ing-title-row">' +
                '<span class="ing-name">' + item.name + '</span>' +
                servingBadgeHtml +
              '</div>' +
              macroTagsHtml +
            '</div>';

          // Click / Key listener
          card.addEventListener("click", function () {
            toggleIngredient(item.id);
          });

          card.addEventListener("keydown", function (e) {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              toggleIngredient(item.id);
            }
          });

          gridEl.appendChild(card);
        });

        groupEl.appendChild(gridEl);
        categoriesContainer.appendChild(groupEl);
      });
    }

    // 2. Toggle Selection
    function toggleIngredient(id) {
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        selectedIds.add(id);
      }
      updateUI();
    }

    // 3. Clear All
    function clearAll() {
      selectedIds.clear();
      updateUI();
    }

    if (clearAllBtn) clearAllBtn.addEventListener("click", clearAll);
    if (clearAllBtnMobile) clearAllBtnMobile.addEventListener("click", clearAll);

    // 4. Update UI & Calculate
    function updateUI() {
      // Update cards
      var allCards = document.querySelectorAll(".ingredient-card");
      allCards.forEach(function (card) {
        var id = card.dataset.id;
        var isSelected = selectedIds.has(id);
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-checked", isSelected ? "true" : "false");
      });

      // Sum totals
      var totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        hasUnavailableItems: false
      };

      var selectedList = [];

      selectedIds.forEach(function (id) {
        var item = ingredientsMap[id];
        if (!item) return;
        selectedList.push(item);

        if (item.hasNutrition) {
          totals.calories += Number(item.calories) || 0;
          totals.protein += Number(item.protein) || 0;
          totals.carbs += Number(item.carbs) || 0;
          totals.fat += Number(item.fat) || 0;
          totals.fiber += Number(item.fiber) || 0;
          totals.sugar += Number(item.sugar) || 0;
          totals.sodium += Number(item.sodium) || 0;
        } else {
          totals.hasUnavailableItems = true;
        }
      });

      // Format Numbers
      function fmt(num, isDec) {
        if (isDec) {
          return num % 1 === 0 ? String(num) : num.toFixed(1);
        }
        return Math.round(num).toLocaleString();
      }

      if (statCalories) statCalories.textContent = fmt(totals.calories);
      if (statProtein) statProtein.textContent = fmt(totals.protein, true) + "g";
      if (statCarbs) statCarbs.textContent = fmt(totals.carbs, true) + "g";
      if (statFat) statFat.textContent = fmt(totals.fat, true) + "g";
      if (statFiber) statFiber.textContent = fmt(totals.fiber, true) + "g";
      if (statSugar) statSugar.textContent = fmt(totals.sugar, true) + "g";
      if (statSodium) statSodium.textContent = fmt(totals.sodium) + "mg";

      // Mobile floating bar updates
      if (mobileBarCalories) mobileBarCalories.textContent = fmt(totals.calories);
      if (mobileBarProtein) mobileBarProtein.textContent = fmt(totals.protein, true) + "g";
      if (mobileBarCarbs) mobileBarCarbs.textContent = fmt(totals.carbs, true) + "g";
      if (mobileBarFat) mobileBarFat.textContent = fmt(totals.fat, true) + "g";

      // Macro Distribution Ratio (Calorie % from macros)
      var calProtein = totals.protein * 4;
      var calCarbs = totals.carbs * 4;
      var calFat = totals.fat * 9;
      var totalMacroCal = calProtein + calCarbs + calFat;

      var pctProtein = 0;
      var pctCarbs = 0;
      var pctFat = 0;

      if (totalMacroCal > 0) {
        pctProtein = Math.round((calProtein / totalMacroCal) * 100);
        pctCarbs = Math.round((calCarbs / totalMacroCal) * 100);
        pctFat = 100 - pctProtein - pctCarbs;
        if (pctFat < 0) pctFat = 0;
      }

      if (macroBarProtein) macroBarProtein.style.width = pctProtein + "%";
      if (macroBarCarbs) macroBarCarbs.style.width = pctCarbs + "%";
      if (macroBarFat) macroBarFat.style.width = pctFat + "%";

      if (macroPctProtein) macroPctProtein.textContent = pctProtein + "%";
      if (macroPctCarbs) macroPctCarbs.textContent = pctCarbs + "%";
      if (macroPctFat) macroPctFat.textContent = pctFat + "%";

      // Update Selected Count Badge
      if (selectedCountBadge) {
        selectedCountBadge.textContent = selectedList.length === 1 
          ? "1 item selected" 
          : selectedList.length + " items selected";
      }

      // Update Selected Chips
      if (selectedChipsContainer) {
        selectedChipsContainer.innerHTML = "";
        if (selectedList.length === 0) {
          selectedChipsContainer.innerHTML = '<span class="empty-chips-text">No ingredients selected yet. Click options on the left to build your meal!</span>';
        } else {
          selectedList.forEach(function (item) {
            var chip = document.createElement("button");
            chip.type = "button";
            chip.className = "selected-chip" + (!item.hasNutrition ? " chip-nodata" : "");
            chip.title = "Click to remove " + item.name;
            chip.innerHTML = '<span class="chip-name">' + item.name + '</span>' +
                              (item.hasNutrition ? '<span class="chip-cal">' + item.calories + ' cal</span>' : '<span class="chip-cal">No Data</span>') +
                              '<span class="chip-remove" aria-label="Remove">&times;</span>';
            chip.addEventListener("click", function () {
              toggleIngredient(item.id);
            });
            selectedChipsContainer.appendChild(chip);
          });
        }
      }

      // Update Itemized Breakdown Table
      if (breakdownTableBody) {
        breakdownTableBody.innerHTML = "";
        if (selectedList.length === 0) {
          if (breakdownEmptyMsg) breakdownEmptyMsg.hidden = false;
        } else {
          if (breakdownEmptyMsg) breakdownEmptyMsg.hidden = true;
          selectedList.forEach(function (item) {
            var tr = document.createElement("tr");
            if (!item.hasNutrition) {
              tr.className = "row-nodata";
              tr.innerHTML = 
                '<td class="td-name"><strong>' + item.name + '</strong><br><small class="text-danger">⚠️ No nutrition data in official dataset</small></td>' +
                '<td>' + (item.serving || 'N/A') + '</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-num">-</td>' +
                '<td class="td-action"><button type="button" class="btn-remove-row" title="Remove">&times;</button></td>';
            } else {
              tr.innerHTML = 
                '<td class="td-name"><strong>' + item.name + '</strong></td>' +
                '<td>' + item.serving + '</td>' +
                '<td class="td-num"><strong>' + item.calories + '</strong></td>' +
                '<td class="td-num">' + item.protein + 'g</td>' +
                '<td class="td-num">' + item.carbs + 'g</td>' +
                '<td class="td-num">' + item.fat + 'g</td>' +
                '<td class="td-num">' + item.fiberDisplay + '</td>' +
                '<td class="td-num">' + item.sugar + 'g</td>' +
                '<td class="td-num">' + item.sodium + 'mg</td>' +
                '<td class="td-action"><button type="button" class="btn-remove-row" title="Remove">&times;</button></td>';
            }

            var removeBtn = tr.querySelector(".btn-remove-row");
            if (removeBtn) {
              removeBtn.addEventListener("click", function () {
                toggleIngredient(item.id);
              });
            }

            breakdownTableBody.appendChild(tr);
          });
        }
      }
    }

    // 5. Mobile Drawer Toggle
    if (mobileToggleDrawerBtn && nutritionSummaryPanel) {
      mobileToggleDrawerBtn.addEventListener("click", function () {
        var isOpen = nutritionSummaryPanel.classList.toggle("mobile-drawer-open");
        mobileToggleDrawerBtn.setAttribute("aria-expanded", String(isOpen));
        mobileToggleDrawerBtn.textContent = isOpen ? "Hide Details" : "View Breakdown";
      });
    }

    // Initialize View
    renderCategories();
    updateUI();
  });
})();
