export class ReviewModel {
    constructor({
        id = null,
        assetId = null,
        authorName = 'Anonymous',
        rating = 5,
        content = '',
        createdAt = ''
    } = {}) {
        this.id = id;
        this.assetId = assetId;
        this.authorName = authorName;
        this.rating = rating;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Tiện ích format ngày tháng (VD: "Nov 01, 2026")
    get displayDate() {
        if (!this.createdAt) return '';
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(this.createdAt).toLocaleDateString('en-US', options);
    }
}