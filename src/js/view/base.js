export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchList : document.querySelector('.results__list'),
    searchContainer: document.querySelector('.results'),
    searchResPage : document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likeList: document.querySelector('.likes__list')
}

export const elementString = {
    loader : 'loader',
    button: 'btn-inline'
};

// Trạng thái chờ kết quả tìm kiếm 
export const renderLoader = parent => {
    const loader = `
        <div class="${elementString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;

    parent.insertAdjacentHTML('afterbegin', loader);
};

// Delete a element not exist yet
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}