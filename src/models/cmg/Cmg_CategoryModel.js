export class CmgCategoryModel {
    constructor({ 
        id = '', 
        slug = '', 
        name = '', 
        description = '' 
    } = {}) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.description = description;
    }
}