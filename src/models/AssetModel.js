export class AssetModel {
    constructor({
        id = null,
        slug = '',
        title = 'Untitled Asset',
        categoryId = '',
        price = 0,
        packCount = 0,
        modelCount = 0,
        
        // Format: YYYY-MM-DD
        initialReleaseDate = '', // Ngày ra mắt đầu tiên
        latestReleaseDate = '',  // Ngày cập nhật gần nhất (Latest release/update)

        // THUỘC TÍNH ĐỘC QUYỀN
        isExclusive = false,
        
        // Nhóm Media
        media = {
            cover: '',      // Ảnh đại diện thumbnail
            gallery: []     // Mảng các ảnh chi tiết cho slider
        },

        // =====================================
        // THUỘC TÍNH CHO FREE ASSET DOWNLOAD
        // =====================================
        download = {
            url: '',          // Link tải trực tiếp (VD: Google Drive, Mega, host riêng...)
            fileSize: '',     // Dung lượng file (VD: '125 MB')
            format: '',       // Định dạng (VD: '.zip', '.unitypackage')
            license: ''       // Giấy phép (VD: 'CC0', 'Personal Use Only')
        },

        // Nhóm Nội dung
        shortDescription = '',
        fullDescription = [], // Mảng các đoạn văn (paragraphs)
        features = [],        // Mảng các tính năng
        
        // Nhóm Thông số kỹ thuật
        techSpecs = {
            rigged: 'No',
            animated: 'No',
            polycount: 'Unknown'
        },

        // Nhóm Link mua hàng (dành cho asset trả phí hoặc donate)
        links = {
            unity: '',
            itch: '',
            fab: '',        // Thêm Fab
            cgtrader: '',   // Thêm CG Trader
            unreal: ''      // Thêm Unreal Marketplace
        },

    } = {}) {
        // Gán dữ liệu
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.categoryId = categoryId;
        this.price = price;
        this.packCount = packCount;
        this.modelCount = modelCount;
        this.initialReleaseDate = initialReleaseDate;
        this.latestReleaseDate = latestReleaseDate;
        this.media = media;
        this.isExclusive = isExclusive;
        this.download = download;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.features = features;
        this.techSpecs = techSpecs;
        this.links = links;
    }

    // --- Các hàm tiện ích (Getters) tích hợp sẵn trong Model ---
    
    // Tự động format giá tiền: Nếu giá là 0 thì hiển thị chữ "Free", ngược lại thêm dấu $
    get displayPrice() {
        return this.price === 0 ? 'Free' : `$${this.price.toFixed(2)}`;
    }

    // Tự động lấy năm ra mắt từ releaseDate
    get releaseYear() {
        if (!this.initialReleaseDate) return '';
        return new Date(this.initialReleaseDate).getFullYear();
    }

    // Getter kiểm tra Asset này có cho phép tải trực tiếp không
    get isDownloadable() {
        // Hợp lệ tải khi: giá = 0 (Free) VÀ có điền url tải xuống
        return this.price === 0 && this.download && this.download.url !== '';
    }

    // Getter kiểm tra Asset này có độc quyền trên web hay không
    get isWebExclusive() {
        return this.isExclusive;
    }
}