import axios from 'axios';
import {proxy, key} from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    // Hàm asysnc (hàm bất đồng bộ) : cho phép viết các thao tác bất đồng bộ phía trong
    async getResult() {
        
        try {

            // Get API bằng axios - trả về 1 promise 
            // await : dừng việc thực thi, chờ lấy kết quả promise object) từ sever xong mới xử lý tiếp 
            console.log(`http://127.0.0.1:8080/recipe-rest-pj1/api/search?q=${encodeURIComponent(this.query)}`);

            const res = await axios(`http://127.0.0.1:8080/recipe-rest-pj1/api/search?q=${encodeURIComponent(this.query)}`);
            
            // Get recipes : return recipes array  
            this.result = res.data.recipes;         // Tạo 1 field result cho lớp Search 

            
        } catch (error) {
            // alert(error);
            this.result = "error";
        } 
    }
}


//http://food2fork.com/api/search 
// API key : 4db37576ff731933991afe14c16858fc


