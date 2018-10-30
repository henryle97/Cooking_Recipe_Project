import axios from 'axios';
// import {proxy, key} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            console.log(`http://127.0.0.1:8080/recipe-rest-pj1/api/recipe?id=${this.id}`);
            const res = await axios(`http://127.0.0.1:8080/recipe-rest-pj1/api/recipe?id=${this.id}`);
            
            const recipe = res.data;
            console.log(res);
            // console.log(recipe);
            this.title = recipe.name;
            this.author = "HisiterBK";
            this.img = recipe.imgUrl;
            this.url = "http://google.com";
            this.ingredients = recipe.fullIngredients;
            this.time = recipe.cookTime;
            this.service = 4;
            this.steps = recipe.steps;


        } catch(error) {
            console.log(error);
            alert('Something went wrong');
        } 
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        // const numIng = this.ingredients.length;
        // const periods = Math.ceil(numIng / 3);
        // this.time = periods * 15;

    }

    calcServing() {
    }

    // Chỉnh sửa cấu trúc ingredient để dễ sử dụng 
    // String -> Object {count, ingredient}
    parseIngredients() {
        // const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        // const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        // const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // 1) Uniform unit 
            let ingredient = el.toLowerCase();

            // unitsLong.forEach((unit, i) => {
            //     ingredient = ingredient.replace(unit, unitsShort[i]);
            // });

            // 2) Remove paratheses (Note replace only return string , not change self-string)
            // ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3) Parse ingredients into {count, unit and ingredient}
            // Ex : 4 1/2 cup unbleached high-gluten, bread, or all-purpose flour, chilled
            // => {count: 4.5, unit: 'cup', ingredient: unbleached...}
            const arrIng = ingredient.split(' ');

            // Find index of unit 
            // const indexUnit = arrIng.findIndex(el => units.includes(el));

            let objIng;
            // let count = 0;
            // Full (maybe not) count + unit + ingredient 
            // if (indexUnit !== -1) {

            //     //Check arrIng[0] có là số ko
            //     if (!isNaN(parseInt(arrIng[0])) ) {

            //         // Get count :
            //         // EX: 4 1/2 => arrCount =['4','1/2'] => eval("4+1/2") = 4.5
            //         // EX: 4 => arrCount =['4'] => eval('4) = 4 
            //         const arrCount = arrIng.slice(0, indexUnit);
            //         if (arrCount.length === 1) {
            //             count = eval(arrCount[0]);
            //         } else {
            //             count = eval(arrIng.slice(0, indexUnit).join("+"));
            //         }
            //     } else {
            //         count = 1;
            //     }
                
            //     objIng = {
            //         count: count,
            //         unit: arrIng[indexUnit],
            //         ingredient: arrIng.slice(indexUnit+1, arrIng.length).join(" ")
            //     };
            // } 
            // // Only count + ingredient (first element of arrIng is number)
            // else 

            if (eval(arrIng[0])) {
                objIng = {
                    count: eval(arrIng[0]),      // convert to int hệ thập phân
                    ingredient: arrIng.slice(1, arrIng.length).join(' ')
                };
            } 

            // // only ingredient
            // else if (indexUnit === -1) {
            //     objIng = {
            //         count: 1,
            //         unit: "", 
            //         ingredient: arrIng.join(' ')
            //     };    
            // }

            // not count 
            
            // Return last result 
            return objIng;
        });

        this.ingredients =  newIngredients;
        console.log(this.ingredients);
    }

    parseSteps() {
        const newSteps = this.steps.map((el, ind) => {
            let objStep = {
                number : ind,
                description : el
            };

            return objStep;
        });

        this.steps = newSteps;
    }

    updateServing(type) {
        const newServing = (type === 'dec') ? (this.service-1) : (this.service + 1);
        
        this.ingredients.forEach(ing => {
            ing.count = ing.count * newServing / this.service;
            
        });
        this.service = newServing;
        
    }   
}