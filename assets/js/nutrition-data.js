/**
 * Chipotle Nutrition Calculator - Single Source of Truth Dataset
 * Strictly derived from:
 * 1. servings.txt
 * 2. Menu & ingredients.txt
 */

(function (window) {
  "use strict";

  // Helper to parse fiber safely (handling "<1" as 0.5g for math)
  function parseFiber(val) {
    if (val === "<1") return 0.5;
    var num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  // Master Ingredient Dictionary
  var INGREDIENTS = {
    // Tortillas & Bases
    "flour-tortilla-burrito": {
      id: "flour-tortilla-burrito",
      name: "Flour Tortilla (Burrito)",
      datasetName: "Flour Tortilla – Burrito",
      category: "Tortilla & Base",
      serving: "4.2 oz",
      hasNutrition: true,
      calories: 320,
      protein: 8,
      carbs: 50,
      fat: 9,
      fiber: 3,
      fiberDisplay: "3g",
      sugar: 0,
      sodium: 600
    },
    "flour-tortilla-taco": {
      id: "flour-tortilla-taco",
      name: "Soft Flour Tortilla (Taco)",
      datasetName: "Flour Tortilla – Taco",
      category: "Tortilla & Base",
      serving: "1.1 oz (1 each)",
      hasNutrition: true,
      calories: 80,
      protein: 2,
      carbs: 13,
      fat: 2.5,
      fiber: parseFiber("<1"),
      fiberDisplay: "<1g",
      sugar: 0,
      sodium: 160
    },
    "crispy-corn-tortilla": {
      id: "crispy-corn-tortilla",
      name: "Crispy Corn Tortilla",
      datasetName: "Crispy Corn Tortilla",
      category: "Tortilla & Base",
      serving: "1 each",
      hasNutrition: true,
      calories: 70,
      protein: 1,
      carbs: 10,
      fat: 3,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 0
    },
    "chips": {
      id: "chips",
      name: "Tortilla Chips",
      datasetName: "Chips",
      category: "Sides & Chips",
      serving: "4 oz",
      hasNutrition: true,
      calories: 540,
      protein: 7,
      carbs: 73,
      fat: 25,
      fiber: 7,
      fiberDisplay: "7g",
      sugar: 1,
      sodium: 390
    },

    // Proteins & Mains
    "chicken": {
      id: "chicken",
      name: "Chicken",
      datasetName: "Chicken",
      category: "Protein",
      serving: "4 oz",
      hasNutrition: true,
      calories: 180,
      protein: 32,
      carbs: 0,
      fat: 7,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 0,
      sodium: 310
    },
    "steak": {
      id: "steak",
      name: "Steak",
      datasetName: "Steak",
      category: "Protein",
      serving: "4 oz",
      hasNutrition: true,
      calories: 150,
      protein: 21,
      carbs: 1,
      fat: 6,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 330
    },
    "barbacoa": {
      id: "barbacoa",
      name: "Barbacoa",
      datasetName: "Barbacoa",
      category: "Protein",
      serving: "4 oz",
      hasNutrition: true,
      calories: 170,
      protein: 24,
      carbs: 2,
      fat: 7,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 530
    },
    "carnitas": {
      id: "carnitas",
      name: "Carnitas",
      datasetName: "Carnitas",
      category: "Protein",
      serving: "4 oz",
      hasNutrition: true,
      calories: 210,
      protein: 23,
      carbs: 0,
      fat: 12,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 0,
      sodium: 450
    },
    "sofritas": {
      id: "sofritas",
      name: "Sofritas (Plant-Based)",
      datasetName: "Sofritas",
      category: "Protein",
      serving: "4 oz",
      hasNutrition: true,
      calories: 150,
      protein: 8,
      carbs: 9,
      fat: 10,
      fiber: 3,
      fiberDisplay: "3g",
      sugar: 5,
      sodium: 560
    },
    // Rice & Grains
    "white-rice": {
      id: "white-rice",
      name: "White Rice",
      datasetName: "White Rice",
      category: "Rice & Beans",
      serving: "4 oz",
      hasNutrition: true,
      calories: 210,
      protein: 4,
      carbs: 40,
      fat: 4,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 350
    },
    "brown-rice": {
      id: "brown-rice",
      name: "Brown Rice",
      datasetName: "Brown Rice",
      category: "Rice & Beans",
      serving: "4 oz",
      hasNutrition: true,
      calories: 210,
      protein: 4,
      carbs: 36,
      fat: 6,
      fiber: 2,
      fiberDisplay: "2g",
      sugar: 0,
      sodium: 190
    },

    // Beans
    "black-beans": {
      id: "black-beans",
      name: "Black Beans",
      datasetName: "Black Beans",
      category: "Rice & Beans",
      serving: "4 oz",
      hasNutrition: true,
      calories: 130,
      protein: 8,
      carbs: 22,
      fat: 1.5,
      fiber: 7,
      fiberDisplay: "7g",
      sugar: 2,
      sodium: 210
    },
    "pinto-beans": {
      id: "pinto-beans",
      name: "Pinto Beans",
      datasetName: "Pinto Beans",
      category: "Rice & Beans",
      serving: "4 oz",
      hasNutrition: true,
      calories: 130,
      protein: 8,
      carbs: 21,
      fat: 1.5,
      fiber: 8,
      fiberDisplay: "8g",
      sugar: 1,
      sodium: 210
    },

    // Fajitas & Toppings
    "fajita-vegetables": {
      id: "fajita-vegetables",
      name: "Fajita Vegetables",
      datasetName: "Fajita Vegetables",
      category: "Toppings & Extras",
      serving: "3.5 oz",
      hasNutrition: true,
      calories: 20,
      protein: 1,
      carbs: 5,
      fat: 0,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 2,
      sodium: 150
    },
    "romaine-lettuce": {
      id: "romaine-lettuce",
      name: "Romaine Lettuce",
      datasetName: "Romaine Lettuce",
      category: "Toppings & Extras",
      serving: "1.5 oz",
      hasNutrition: true,
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 0
    },
    "cheese": {
      id: "cheese",
      name: "Monterey Jack Cheese",
      datasetName: "Cheese",
      category: "Toppings & Extras",
      serving: "1 oz",
      hasNutrition: true,
      calories: 110,
      protein: 6,
      carbs: 1,
      fat: 8,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 0,
      sodium: 190
    },
    "sour-cream": {
      id: "sour-cream",
      name: "Sour Cream",
      datasetName: "Sour Cream",
      category: "Toppings & Extras",
      serving: "2 oz",
      hasNutrition: true,
      calories: 110,
      protein: 2,
      carbs: 2,
      fat: 9,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 2,
      sodium: 30
    },
    "guacamole": {
      id: "guacamole",
      name: "Guacamole",
      datasetName: "Guacamole",
      category: "Toppings & Extras",
      serving: "4 oz",
      hasNutrition: true,
      calories: 230,
      protein: 2,
      carbs: 8,
      fat: 22,
      fiber: 6,
      fiberDisplay: "6g",
      sugar: 1,
      sodium: 370
    },
    "queso-blanco": {
      id: "queso-blanco",
      name: "Queso Blanco",
      datasetName: "Queso Blanco",
      category: "Toppings & Extras",
      serving: "2 oz",
      hasNutrition: true,
      calories: 120,
      protein: 5,
      carbs: 4,
      fat: 9,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 1,
      sodium: 250
    },

    // Salsas & Dressings
    "fresh-tomato-salsa": {
      id: "fresh-tomato-salsa",
      name: "Fresh Tomato Salsa (Mild)",
      datasetName: "Fresh Tomato Salsa",
      category: "Salsas & Dressings",
      serving: "3.5 oz",
      hasNutrition: true,
      calories: 25,
      protein: 0,
      carbs: 4,
      fat: 0,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 1,
      sodium: 550
    },
    "roasted-chili-corn-salsa": {
      id: "roasted-chili-corn-salsa",
      name: "Roasted Chili-Corn Salsa (Medium)",
      datasetName: "Roasted Chili-Corn Salsa",
      category: "Salsas & Dressings",
      serving: "3.5 oz",
      hasNutrition: true,
      calories: 80,
      protein: 3,
      carbs: 16,
      fat: 1.5,
      fiber: 3,
      fiberDisplay: "3g",
      sugar: 4,
      sodium: 330
    },
    "tomatillo-green-chili-salsa": {
      id: "tomatillo-green-chili-salsa",
      name: "Tomatillo Green-Chili Salsa (Medium)",
      datasetName: "Tomatillo Green-Chili Salsa",
      category: "Salsas & Dressings",
      serving: "3.5 oz",
      hasNutrition: true,
      calories: 15,
      protein: 0,
      carbs: 4,
      fat: 0,
      fiber: 0,
      fiberDisplay: "0g",
      sugar: 2,
      sodium: 260
    },
    "tomatillo-red-chili-salsa": {
      id: "tomatillo-red-chili-salsa",
      name: "Tomatillo Red-Chili Salsa (Hot)",
      datasetName: "Tomatillo Red-Chili Salsa",
      category: "Salsas & Dressings",
      serving: "3.5 oz",
      hasNutrition: true,
      calories: 30,
      protein: 0,
      carbs: 4,
      fat: 0,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 0,
      sodium: 500
    },
    "chipotle-honey-vinaigrette": {
      id: "chipotle-honey-vinaigrette",
      name: "Chipotle-Honey Vinaigrette",
      datasetName: "Chipotle-Honey Vinaigrette",
      category: "Salsas & Dressings",
      serving: "2 oz",
      hasNutrition: true,
      calories: 220,
      protein: 1,
      carbs: 18,
      fat: 16,
      fiber: 1,
      fiberDisplay: "1g",
      sugar: 12,
      sodium: 850
    },
  };

  // Menu Categories and Ingredient lists from "Menu & ingredients.txt"
  var MENUS = {
    "burrito": {
      key: "burrito",
      title: "Burrito Nutrition Calculator",
      shortTitle: "Burrito",
      badge: "Classic Foil-Wrapped",
      image: "burrito.jpg",
      imageAlt: "Realistic photo of a foil-wrapped Chipotle burrito",
      description: "Build your custom Chipotle burrito. Select your tortilla, rice, beans, protein, and toppings to calculate calories, macros, and sodium instantly.",
      categories: [
        {
          name: "Tortilla & Base",
          items: ["flour-tortilla-burrito"]
        },
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Rice & Beans",
          items: ["white-rice", "brown-rice", "black-beans", "pinto-beans"]
        },
        {
          name: "Fajitas & Toppings",
          items: ["fajita-vegetables", "romaine-lettuce", "cheese", "sour-cream", "guacamole", "queso-blanco"]
        },
        {
          name: "Salsas & Sauces",
          items: ["fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    },

    "burrito-bowl": {
      key: "burrito-bowl",
      title: "Burrito Bowl Nutrition Calculator",
      shortTitle: "Burrito Bowl",
      badge: "Bowl Favorite",
      image: "burrito-bowl.jpg",
      imageAlt: "Realistic photo of a Chipotle burrito bowl with chicken and toppings",
      description: "Calculate calories and macros for your custom Chipotle Burrito Bowl. Select your favorite rice, beans, meats, fresh salsas, guacamole, and queso.",
      categories: [
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Rice & Beans",
          items: ["white-rice", "brown-rice", "black-beans", "pinto-beans"]
        },
        {
          name: "Fajitas & Toppings",
          items: ["fajita-vegetables", "romaine-lettuce", "cheese", "sour-cream", "guacamole", "queso-blanco"]
        },
        {
          name: "Salsas & Sauces",
          items: ["fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    },

    "quesadilla": {
      key: "quesadilla",
      title: "Quesadilla Nutrition Calculator",
      shortTitle: "Quesadilla",
      badge: "Cheesy & Grilled",
      image: "quesadilla.jpg",
      imageAlt: "Realistic photo of a golden cheese quesadilla",
      description: "Customize your grilled Chipotle quesadilla. Calculate exact nutrition with your choice of protein, Monterey Jack cheese, fajita veggies, salsas, and dipping sides.",
      categories: [
        {
          name: "Tortilla & Base",
          items: ["flour-tortilla-burrito"]
        },
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Cheese & Fajitas",
          items: ["cheese", "fajita-vegetables"]
        },
        {
          name: "Sides & Dips",
          items: ["sour-cream", "guacamole", "queso-blanco", "fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    },

    "salad": {
      key: "salad",
      title: "Salad Nutrition Calculator",
      shortTitle: "Salad",
      badge: "Fresh Greens Base",
      image: "salad.jpg",
      imageAlt: "Realistic photo of a fresh Chipotle salad bowl",
      description: "Build your Chipotle salad with fresh romaine lettuce, lean proteins, beans, veggies, salsas, and the famous Chipotle-Honey Vinaigrette dressing.",
      categories: [
        {
          name: "Salad Base",
          items: ["romaine-lettuce"]
        },
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Rice & Beans",
          items: ["white-rice", "brown-rice", "black-beans", "pinto-beans"]
        },
        {
          name: "Veggies & Toppings",
          items: ["fajita-vegetables", "cheese", "sour-cream", "guacamole", "queso-blanco"]
        },
        {
          name: "Salsas & Dressings",
          items: ["chipotle-honey-vinaigrette", "fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    },

    "tacos": {
      key: "tacos",
      title: "Tacos Nutrition Calculator",
      shortTitle: "Tacos",
      badge: "Soft or Crispy",
      image: "tacos.jpg",
      imageAlt: "Realistic photo of three Chipotle tacos",
      description: "Calculate calories and nutrition for your Chipotle tacos. Choose soft flour or crispy corn tortillas, protein, rice, beans, salsas, and toppings.",
      categories: [
        {
          name: "Tortillas & Shells",
          items: ["flour-tortilla-taco", "crispy-corn-tortilla"]
        },
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Rice & Beans",
          items: ["white-rice", "brown-rice", "black-beans", "pinto-beans"]
        },
        {
          name: "Toppings & Cheese",
          items: ["fajita-vegetables", "romaine-lettuce", "cheese", "sour-cream", "guacamole", "queso-blanco"]
        },
        {
          name: "Salsas",
          items: ["fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    },

    "kids-meal": {
      key: "kids-meal",
      title: "Kid's Meal Nutrition Calculator",
      shortTitle: "Kid's Meal",
      badge: "Build Your Own Kids Meal",
      image: "kids-meal.jpg",
      imageAlt: "Realistic photo of a Chipotle kid's meal combo",
      description: "Customize a Chipotle Kid's Meal. Calculate nutrition for small tortillas, protein, rice, beans, cheese, guacamole, salsas, and sides.",
      categories: [
        {
          name: "Tortillas & Shells",
          items: ["crispy-corn-tortilla", "flour-tortilla-taco"]
        },
        {
          name: "Proteins",
          items: ["chicken", "steak", "barbacoa", "carnitas", "sofritas"]
        },
        {
          name: "Rice & Beans",
          items: ["white-rice", "brown-rice", "black-beans", "pinto-beans"]
        },
        {
          name: "Cheese & Toppings",
          items: ["cheese", "queso-blanco", "guacamole"]
        },
        {
          name: "Salsas",
          items: ["fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        },
      ]
    },

    "chips-and-sides": {
      key: "chips-and-sides",
      title: "Chips & Sides Nutrition Calculator",
      shortTitle: "Chips & Sides",
      badge: "Dips & Snacks",
      image: "chips-and-sides.jpg",
      imageAlt: "Realistic photo of tortilla chips with dips",
      description: "Track calories, fat, and sodium for Chipotle tortilla chips, fresh guacamole, queso blanco, and signature salsas.",
      categories: [
        {
          name: "Chips",
          items: ["chips"]
        },
        {
          name: "Dips & Guac",
          items: ["guacamole", "queso-blanco"]
        },
        {
          name: "Signature Salsas & Sauces",
          items: ["fresh-tomato-salsa", "roasted-chili-corn-salsa", "tomatillo-green-chili-salsa", "tomatillo-red-chili-salsa"]
        }
      ]
    }
  };

  // Export to global window
  window.ChipotleData = {
    ingredients: INGREDIENTS,
    menus: MENUS,
    parseFiber: parseFiber
  };

})(window);
