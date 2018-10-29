export default class Likes {
    constructor() {
        this.likes = [];
        
    }

    addLike(id, title, author,img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        // Persist data
        this.persistData();
        
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);  
        this.persistData();  

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id ===id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    // Part Store in localStorage 
    persistData() {
        // JSON.stringify() : convert a object js to string 
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {

        // Convert JSON string to objects array  
        const storage = JSON.parse(localStorage.getItem('likes'));      // return object array 
        if (storage) {
           this.likes = storage;
        }

    }
}