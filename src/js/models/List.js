import uniqid from 'uniqid';


/*
 Lớp quản lý danh sách nguyên liệu cần mua 
*/
export default class List {
    constructor() {
        // List các nguyên liệu
        this.items = [];
    }

    // Thêm nguyên liệu mua
    addItem(count, ingredient) {
        const item = {
            id: uniqid(),
            count,
            ingredient
        };
        this.items.push(item);

        return item;
    }

    // Xóa nguyên liệu 
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id)
        this.items.splice(index,1);
    }

    // Cập nhật số lượng cần mua
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}