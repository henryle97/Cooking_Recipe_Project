import $ from 'jquery';
require('jquery-ui/ui/widgets/autocomplete');

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
// Biến toàn cục : chứa các object quan trọng
const state = {};



/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    
    // 1) Get query from view
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();                        // Xóa dữ liệu nhập 
        searchView.clearList();                         // Xóa kết quả tìm kiếm cũ 
        recipeView.clearRecipe();
        renderLoader(elements.searchContainer);
        try {
            // 4) Search for recipes
            await state.search.getResult();

            // 5) Render result on UI
            clearLoader();
            
            // console.log(state.search.result);
            if (state.search.result.length !== 0) {
                searchView.renderResults(state.search.result);
            }
            
        } catch(error) {
            // console.log(error);
            // alert('Something wrong with the search');
            searchView.renderNotFound();
            clearLoader();
        }

    }
}


// Phải đặt trên hàm autocomplete
const getRecipes = async (request, response) => {
    let query = request.term;
    let search = new Search(query);
    try {
        await search.getResult();

        let recipes = search.result;
        console.log(recipes);
        console.log(recipes.length);
        if (recipes != "error") {
            
            let recipesName = recipes.map(rp => rp.name);
            // response(recipesName);      // return recipesName
            console.log(recipes);
            response(recipes);
        }
        
    } catch(error) {
        console.log(error);
    }
}

// Xử lý suggest tìm kiếm 
$(".search__field").autocomplete({
    source: getRecipes,
    // focus: function (event, ui) {
    //     $(".search__field").val(ui.item.name);
    //     return false;
    // },
    select: function (event, ui) {
        $(".search__field").val(ui.item.name);
        return false;
    }
})
    .data("ui-autocomplete")._renderItem = function (ul, item) {
    return $("<li>")
        .data("item.autocomplete", item)
        .append(`
            <a class="results__link" style="max-width:350px" href="#${item.id}">
                <figure class="results__fig">
                    <img src="${item.imgUrl}" alt="">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${item.name}</h4>
                </div>
            </a>`)
        .appendTo(ul);
    };



// Xử lý sự kiện user click tìm kiếm 
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();     // ngan chan hanh dong mac dinh la submit ve he thong, thay vao do se xu ly bang ham duoi
    controlSearch();
});


// Xử lý sự kiện click chuyển trang các kết quả tìm kiếm được
// Note : element.closest(selector) method : duyet tu target len tren trong to tien TREE: chon to tien gan nhat la 'btn-inline'
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
    // console.log(id);

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
            state.recipe.parseSteps();

            // Calculate serving and time
            // state.recipe.calcTime();
            // state.recipe.calcServing();

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

// Handling recipe button click : Xử lý sự kiện tăng, giảm số người ăn 
elements.recipe.addEventListener('click', event => {

    //Get element not exist when loaded document : use closest() method // matches()
        if (event.target.matches('.btn-decrease, .btn-decrease *')) {
            // Decrease serving 
            if (state.recipe.service > 1) {
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


    // Nếu chưa tồn tại thì tạo list nguyên liệu cần mua 
    if (!state.list) {
        state.list = new List();
    }

    // Add item to state.list and render item list 
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.ingredient);
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












