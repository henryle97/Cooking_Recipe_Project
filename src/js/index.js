import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likeView from './view/likeView';
import {elements, renderLoader, clearLoader, elementString} from './view/base';


/** Global state of the application
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};



/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    // const query = 'pizza';

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearList();
        renderLoader(elements.searchContainer);
        try {
            // 4) Search for recipes
            await state.search.getResult();

            // 5) Render result on UI
            clearLoader();
            if (state.search.result.length !== 0) {
                searchView.renderResults(state.search.result);
            }
            
        } catch(error) {
            console.log(error);
            alert('Something wrong with the search');
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();     // ngan chan hanh dong mac dinh la submit ve he thong, thay vao do se xu ly bang ham duoi
    controlSearch();
});

// //TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();     // ngan chan hanh dong mac dinh la submit ve he thong, thay vao do se xu ly bang ham duoi
//     controlSearch();
// });

// element.closest(selector) method : duyet tu target len tren trong to tien TREE: chon to tien gan nhat la 'btn-inline'
elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest(`.${elementString.button}`);

    if (btn) {
        // Get page goto 
        const goto = parseInt(btn.dataset.goto);
        // console.log('goto = ' + goto);
        searchView.clearList();
        searchView.renderResults(state.search.result, goto);
    }

}); 

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get id recipe (after # address url - hash)
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for render
        recipeView.clearRecipe();
        listView.clearShoppingList();
        renderLoader(elements.recipe);

        // Hightlight selected item  : if condition ensure searchview existed 
        if (state.search) {
            searchView.hightlightSelect(id);
        }

        // Create new recipe object 
        state.recipe = new Recipe(id);
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            // Render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe);

            // Change like  button if it was liked 
            if (state.likes) {
                likeView.toggleLikeButton(state.likes.isLiked(id));
            }

            
        } catch(error) {
            console.log(error);
            alert('Error process recipe');
        }
        
    }
};

// Handling hashchange (khi click vao 1 recipe) and  load (tải xong trang)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button click
elements.recipe.addEventListener('click', event => {

    //Get element not exist when loaded document : use closest() method // matches()
        if (event.target.matches('.btn-decrease, .btn-decrease *')) {
            // Decrease serving 
            if (state.recipe.serving > 1) {
                state.recipe.updateServing('dec');
                // recipeView.renderRecipe(state.recipe);           -- shouldn't render  again all 
                recipeView.updateServingIngredients(state.recipe);

            }
    
        } else if (event.target.matches('.btn-increase, .btn-increase *')) {
            // Increase serving
            state.recipe.updateServing('inc');
            recipeView.updateServingIngredients(state.recipe);
    
        } else if (event.target.matches('.recipe__btn, .recipe__btn *')) {
            controlShoppingList();
        } else if (event.target.matches('.recipe__love, .recipe__love *')) {
            controlLike();
        }
});


/*****************************
 * SHOPPING LIST CONTROLLER****
 ******************************/
const controlShoppingList = () => {
    // Prepare for render UI
    listView.clearShoppingList();

    // Get list object
    if (!state.list) {
        state.list = new List();
    }

    // Add item to state.list and render item list 
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item);
    });

};
// Handle delele and update list item event
elements.shoppingList.addEventListener('click', event=> {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button 
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        console.log(event.target);
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    } 
});

/************************
 * **LIKE CONTROLLER ***
 ***********************/

window.addEventListener('load', () => {
    //Create new likes object 
    state.likes = new Likes();

    // Read like from storage
    state.likes.readStorage();

    // Display liked view
    if (state.likes.likes.length !== 0) {
        state.likes.likes.forEach(like => {
            likeView.renderLikes(like);
        });
    }
    
});

const controlLike = () =>{
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    // Check xem user da like recipe hay chua
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state 
        const newLike = state.likes.addLike(
                currentID,
                state.recipe.title,
                state.recipe.author,
                state.recipe.img
        );
        
        // Toggle the like button
        likeView.toggleLikeButton(true);
        // Add like to UI list
        likeView.renderLikes(newLike);
            
    } else {
        // Remove like to the state 
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likeView.toggleLikeButton(false);

        // Remove like to UI list
        likeView.deleteLike(currentID);
    }
};











