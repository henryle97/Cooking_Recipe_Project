import {elements} from './base';

/**
 * Quản lý render kết quả tìm kiếm công thức món ăn 
 */

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearList = () => {
    elements.searchList.innerHTML = '';
    elements.searchResPage.innerHTML ='';
}

export const hightlightSelect = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`a[href="#${id}"`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 20) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accum, cur) => {
            if(accum + cur.length <= limit) {
                newTitle.push(cur);

            }
            return accum + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    
    return  title;
}

const renderRecipe = recipe => {
    const markup = `<li>
                        <a class="results__link" href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                                <p class="results__author">${recipe.publisher}</p>
                            </div>
                        </a>
                    </li>`;
    elements.searchList.insertAdjacentHTML('beforeend', markup);
    
    
};

// type : 'prev' or 'next'
const createButton = (page, type) => {
    const button = `
                <button class="btn-inline results__btn--${type}"s data-goto=${type === 'next' ? page + 1 : page - 1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'left' : 'right'}"></use>
                    </svg>
                    <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
                </button>`;

    return button;

};

const renderButton = (page,numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage);
    // console.log('pages = ' + pages);

    let button;
    if (page === 1 && pages > 1) {
        // Only Button next
        button = createButton(page, 'next');

    } else if (page < pages) {
        // Display both button 
        button =
        `${createButton(page, 'prev')}
         ${createButton(page, 'next')}`
         
    } else if (page === pages && pages > 1 ) {
        // Only button prev
        button = createButton(page, 'prev');
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1 , resPerPage = 10) => {

    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(recipe => {
        renderRecipe(recipe);
    });

    renderButton(page,recipes.length, resPerPage);
}; 


