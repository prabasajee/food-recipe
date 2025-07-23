document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active-section');
        });
    });
    
    // Recipe Data
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            description: "A traditional Italian pasta dish with eggs, cheese, pancetta, and pepper.",
            cookTime: "20 min",
            difficulty: "Medium",
            ingredients: ["spaghetti", "eggs", "parmesan cheese", "pancetta", "black pepper", "salt"],
            icon: "🍝"
        },
        {
            id: 2,
            title: "Grilled Chicken Salad",
            description: "Fresh mixed greens with grilled chicken, tomatoes, and balsamic dressing.",
            cookTime: "15 min",
            difficulty: "Easy",
            ingredients: ["chicken breast", "mixed greens", "tomatoes", "cucumber", "balsamic vinegar", "olive oil"],
            icon: "🥗"
        },
        {
            id: 3,
            title: "Beef Stir Fry",
            description: "Quick and flavorful beef stir fry with vegetables and teriyaki sauce.",
            cookTime: "25 min",
            difficulty: "Medium",
            ingredients: ["beef strips", "broccoli", "bell peppers", "onion", "garlic", "teriyaki sauce", "rice"],
            icon: "🥩"
        },
        {
            id: 4,
            title: "Margherita Pizza",
            description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
            cookTime: "30 min",
            difficulty: "Hard",
            ingredients: ["pizza dough", "tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"],
            icon: "🍕"
        },
        {
            id: 5,
            title: "Chicken Curry",
            description: "Aromatic and spicy chicken curry with coconut milk and spices.",
            cookTime: "40 min",
            difficulty: "Medium",
            ingredients: ["chicken", "coconut milk", "onion", "garlic", "ginger", "curry powder", "tomatoes", "rice"],
            icon: "🍛"
        },
        {
            id: 6,
            title: "Fish Tacos",
            description: "Fresh fish tacos with cabbage slaw and lime crema.",
            cookTime: "20 min",
            difficulty: "Easy",
            ingredients: ["white fish", "corn tortillas", "cabbage", "lime", "sour cream", "cilantro", "avocado"],
            icon: "🌮"
        },
        {
            id: 7,
            title: "Mushroom Risotto",
            description: "Creamy Italian rice dish with mixed mushrooms and parmesan.",
            cookTime: "35 min",
            difficulty: "Hard",
            ingredients: ["arborio rice", "mushrooms", "vegetable broth", "onion", "white wine", "parmesan cheese", "butter"],
            icon: "🍚"
        },
        {
            id: 8,
            title: "Caesar Salad",
            description: "Classic Caesar salad with crispy croutons and parmesan cheese.",
            cookTime: "10 min",
            difficulty: "Easy",
            ingredients: ["romaine lettuce", "croutons", "parmesan cheese", "caesar dressing", "anchovies", "lemon"],
            icon: "🥬"
        }
    ];
    
    // Global state
    let selectedIngredients = [];
    let filteredRecipes = recipes;
    
    // Recipe rendering functions
    function createRecipeCard(recipe) {
        return `
            <div class="recipe-card">
                <div class="recipe-image">
                    ${recipe.icon}
                </div>
                <div class="recipe-content">
                    <div class="recipe-title">${recipe.title}</div>
                    <div class="recipe-description">${recipe.description}</div>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookTime}</span>
                        <span><i class="fas fa-chart-bar"></i> ${recipe.difficulty}</span>
                    </div>
                    <div class="recipe-ingredients">
                        <h4>Ingredients:</h4>
                        <div class="ingredient-list">
                            ${recipe.ingredients.map(ingredient => 
                                `<span class="ingredient-tag">${ingredient}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderRecipes(recipesToRender, containerId) {
        const container = document.getElementById(containerId);
        if (recipesToRender.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No recipes found</h3>
                    <p>Try adjusting your search criteria or removing some ingredient filters.</p>
                </div>
            `;
        } else {
            container.innerHTML = recipesToRender.map(recipe => createRecipeCard(recipe)).join('');
        }
    }
    
    // Initialize all recipes view
    renderRecipes(recipes, 'recipes-grid');
    
    // Featured recipes (first 4)
    renderRecipes(recipes.slice(0, 4), 'featured-recipes');
    
    // Search and Filter functionality
    const recipeSearch = document.getElementById('recipe-search');
    const ingredientInput = document.getElementById('ingredient-input');
    const selectedIngredientsContainer = document.getElementById('selected-ingredients');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchSummary = document.getElementById('search-summary');
    
    // Ingredient filter functionality
    ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ingredient = this.value.trim().toLowerCase();
            
            if (ingredient && !selectedIngredients.includes(ingredient)) {
                selectedIngredients.push(ingredient);
                this.value = '';
                updateIngredientTags();
                updateFilteredRecipes();
            }
        }
    });
    
    function updateIngredientTags() {
        selectedIngredientsContainer.innerHTML = selectedIngredients.map(ingredient => `
            <span class="selected-ingredient">
                ${ingredient}
                <button class="remove-ingredient" data-ingredient="${ingredient}">×</button>
            </span>
        `).join('');
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-ingredient').forEach(button => {
            button.addEventListener('click', function() {
                const ingredient = this.getAttribute('data-ingredient');
                selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
                updateIngredientTags();
                updateFilteredRecipes();
            });
        });
    }
    
    // Recipe name search functionality
    recipeSearch.addEventListener('input', function() {
        updateFilteredRecipes();
    });
    
    function updateFilteredRecipes() {
        const searchTerm = recipeSearch.value.toLowerCase();
        
        filteredRecipes = recipes.filter(recipe => {
            // Check if recipe matches search term
            const matchesSearch = searchTerm === '' || 
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm);
            
            // Check if recipe contains all selected ingredients
            const matchesIngredients = selectedIngredients.length === 0 ||
                selectedIngredients.every(ingredient =>
                    recipe.ingredients.some(recipeIngredient =>
                        recipeIngredient.toLowerCase().includes(ingredient)
                    )
                );
            
            return matchesSearch && matchesIngredients;
        });
        
        renderRecipes(filteredRecipes, 'filtered-recipes');
        updateSearchSummary();
    }
    
    function updateSearchSummary() {
        const searchTerm = recipeSearch.value;
        const hasFilters = searchTerm || selectedIngredients.length > 0;
        
        if (!hasFilters) {
            searchSummary.innerHTML = '<p>Enter a recipe name or add ingredient filters to search recipes.</p>';
        } else {
            let summaryText = `Showing ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''}`;
            
            if (searchTerm) {
                summaryText += ` matching "${searchTerm}"`;
            }
            
            if (selectedIngredients.length > 0) {
                summaryText += ` with ingredients: ${selectedIngredients.join(', ')}`;
            }
            
            searchSummary.innerHTML = `<p>${summaryText}</p>`;
        }
    }
    
    // Clear filters functionality
    clearFiltersBtn.addEventListener('click', function() {
        recipeSearch.value = '';
        selectedIngredients = [];
        updateIngredientTags();
        updateFilteredRecipes();
    });
    
    // Initialize search summary
    updateSearchSummary();
    
    // Auto-focus on search when search section is opened
    document.querySelector('a[href="#search"]').addEventListener('click', function() {
        setTimeout(() => {
            recipeSearch.focus();
        }, 100);
    });
});