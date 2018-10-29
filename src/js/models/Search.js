import axios from 'axios';
import {proxy, key} from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(this.result);
        } catch (error) {
            alert(error);
        } 
    }
}


//http://food2fork.com/api/search 
// API key : 4db37576ff731933991afe14c16858fc


