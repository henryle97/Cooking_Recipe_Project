import axios from 'axios';
import {proxy, key} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            
            const recipe = res.data.recipe;
            // console.log(recipe);
            this.title = recipe.title;
            this.author = recipe.publisher;
            this.img = recipe.image_url;
            this.url = recipe.source_url;
            this.ingredients = recipe.ingredients;
        } catch(error) {
            console.log(error);
            alert('Something went wrong');
        } 
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServing() {
        this.serving = 4;
    }

    // Custom ingredients
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform unit 
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove paratheses (Note replace only return string , not change self-string)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3) Parse ingredients into count, unit and ingredient
            // Ex : 4 1/2 cup unbleached high-gluten, bread, or all-purpose flour, chilled
            // => {count: 4.5, unit: 'cup', ingredient: unbleached...}
            const arrIng = ingredient.split(' ');

            // Find index of unit 
            const indexUnit = arrIng.findIndex(el => units.includes(el));

            let objIng;
            let count = 0;
            // Full (maybe not) count + unit + ingredient 
            if (indexUnit !== -1) {

                //Check arrIng[0] có là số ko
                if (!isNaN(parseInt(arrIng[0])) ) {
                    // Get count :
                    // EX: 4 1/2 => arrCount =['4','1/2'] => eval("4+1/2") = 4.5
                    // EX: 4 => arrCount =['4'] => eval('4) = 4 
                    const arrCount = arrIng.slice(0, indexUnit);
                    if (arrCount.length === 1) {
                        count = eval(arrCount[0]);
                    } else {
                        count = eval(arrIng.slice(0, indexUnit).join("+"));
                    }
                } else {
                    count = 1;
                }
                
                objIng = {
                    count: count,
                    unit: arrIng[indexUnit],
                    ingredient: arrIng.slice(indexUnit+1, arrIng.length).join(" ")
                };
            } 
            // Only count + ingredient (first element of arrIng is number)
            else if (parseInt(arrIng[0],10)) {
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: "",
                    ingredient: arrIng.slice(1, arrIng.length).join(' ')
                };
            } 
            // only ingredient
            else if (indexUnit === -1) {
                objIng = {
                    count: 1,
                    unit: "", 
                    ingredient: arrIng.join(' ')
                };    
            }

            // not count 
            
            // Return last result 
            return objIng;
        });

        this.ingredients =  newIngredients;
    }

    updateServing(type) {
        const newServing = (type === 'dec') ? (this.serving-1) : (this.serving + 1);
        
        this.ingredients.forEach(ing => {
            ing.count = ing.count * newServing / this.serving;
            
        });
        this.serving = newServing;
        
    }   
}