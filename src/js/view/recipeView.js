import {elements} from './base';
import {Fraction} from 'fractional';
export const clearRecipe = () => {
    elements.recipe.innerHTML ='';
};

// Format cho số lượng nguyên liệu dạng số thực sang phân số 
//EX : 4.5 => 4 1/2 , 0.25 => 1/4

const formatCount = count => {

    // Lấy 2 chữ sô thập phân
    const newCount = Math.round(count * 100) / 100;
    console.log(newCount)
    if (newCount) {
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
        if (!dec) return newCount;

        // Nếu newCount < 1 thì convert a/b
        if (int === 0) {
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } 
        // Nếu newCount >= 1 thì convert a b/c
        else {
            const fr = new Fraction(newCount-int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    
    return '?';
};

const createIngredient = ingredient => 
    `<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <!--<span class="recipe__unit">${ingredient.unit}</span>-->
            ${ingredient.ingredient}
        </div>
    </li>
    `;

const createStep = step => 

        `<li class="">
            <div class="row">
                <div class="col-2">
                    <span class="badge badge-pill badge-danger p-3 " style="font-size: 1.3rem">
                        <i class="fa fa-bookmark-o fa-1g" aria-hidden="true"></i>
                        Bước ${step.number + 1}</span>
                </div>
                <div class="col-10">
                    <p>${step.description}</p>
                </div>
            </div>
    </li>`

;

export const renderRecipe = recipe => {
    const markup  = `
    <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> phút</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.service}</span>
                    <span class="recipe__info-text"> người</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(el => createIngredient(el)).join('')}
                </ul>

                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Thêm vào danh sách mua</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">Các bước thực hiện</h2>
                <div class="row">
                    <ul class="list-unstyled">
                        ${recipe.steps.map(el => createStep(el)).join('')}
                        
                    </ul>
                </div>
            </div>`;    

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// 
export const updateServingIngredients = recipe => {
    
    // Update serving 
    document.querySelector('.recipe__info-data--people').textContent = recipe.service;

    // Update ingredients 
    const countElements =  Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    })
   
};