import axios from 'axios';
import {proxy, key} from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        
        try {

            // Get API bằng axios 
            const res = await axios(`http://127.0.0.1:8080/recipe-rest-pj1/api/search?q=${this.query}`);
            
            console.log(res);
            // Get recipes : return recipes array  
            this.result = res.data.recipes;         // Tạo 1 field result cho lớp Search 
 
            // console.log(res);
        } catch (error) {
            // alert(error);
            this.result = "error";
        } 
    }
}


//http://food2fork.com/api/search 
// API key : 4db37576ff731933991afe14c16858fc


