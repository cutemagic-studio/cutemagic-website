export class AssetModel {
    constructor({
        id = null,
        slug = '',
        title = 'Untitled Asset',
        categoryId = '',
        // price = 0,
        packCount = 0,
        modelCount = 0,
        
        // Format: YYYY-MM-DD
        // initialReleaseDate = '', // Ngày ra mắt đầu tiên
        // latestReleaseDate = '',  // Ngày cập nhật gần nhất (Latest release/update)

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

        // content = {
        //     shortDescription: '',
        //     fullDescription: [], // Mảng các đoạn văn (paragraphs)
        //     features: [], // Mảng các tính năng
        // },
        
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
            fab: '',       
            cgtrader: '',   
            turboSquid: '',
            artStation: ''      
        },

        // =====================================
        // NHÓM GIÁ CẢ & KHUYẾN MÃI (Dùng cho New Releases)
        // =====================================
        price = 0,
        originalPrice = null,  // Giá gốc (VD: 50.00)
        discount = null,       // % Giảm giá (VD: 50)
        discountEndsIn = '',   // Đếm ngược (VD: '5 days')
        isLaunchEdition = false, // Huy hiệu Vương miện

        // price = {
        //     price: 0,
        //     originalPrice: null,  // Giá gốc (VD: 50.00)
        //     discount: null,       // % Giảm giá (VD: 50)
        //     discountEndsIn: '',   // Đếm ngược (VD: '5 days')
        //     isLaunchEdition: false, // Huy hiệu Vương miện
        // },
        
        // =====================================
        // NHÓM THỜI GIAN (Dùng cho Coming Soon)
        // =====================================
        // Format: YYYY-MM-DD
        initialReleaseDate = '', // Ngày ra mắt đầu tiên
        latestReleaseDate = '',  // Ngày cập nhật gần nhất
        availableIn = '',        // Khoảng thời gian chờ (VD: '2 tuần nữa')
        // dateTime = {
        //     initialReleaseDate: '', // Ngày ra mắt đầu tiên
        //     latestReleaseDate: '',  // Ngày cập nhật gần nhất
        //     availableInDate: '',        // Khoảng thời gian chờ (VD: '2 tuần nữa')
        // },

        // =====================================
        // NHÓM THỐNG KÊ (Dùng cho Top Rated)
        // =====================================
        metrics = {
            likes: 0,
            views: 0,
            downloads: 0
        },

        // =====================================
        // THUỘC TÍNH CHO ROADMAP (MỚI)
        // =====================================
        roadmap = {
            // Nhận 1 trong 3 giá trị: 'prev' (Đã xong), 'current' (Đang làm), 'next' (Sắp tới). 
            // Nếu để null hoặc rỗng thì Asset này sẽ không hiện trên Roadmap.
            status: null, 
            progress: 0,          // Phần trăm tiến độ (VD: 85)
            note: '',             // Ghi chú ngắn (VD: 'Đang tối ưu LOD', 'Đang Rigging')
            estimatedDelivery: '' // Thời gian dự kiến (VD: 'Đầu tháng sau')
        },

    } = {}) {
        // Gán dữ liệu
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.categoryId = categoryId;
        // this.price = price;
        this.packCount = packCount;
        this.modelCount = modelCount;
        // this.initialReleaseDate = initialReleaseDate;
        // this.latestReleaseDate = latestReleaseDate;
        this.media = media;
        this.isExclusive = isExclusive;
        this.download = download;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.features = features;
        this.techSpecs = techSpecs;
        this.links = links;

        this.price = price;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.discountEndsIn = discountEndsIn;
        this.isLaunchEdition = isLaunchEdition;

        this.initialReleaseDate = initialReleaseDate;
        this.latestReleaseDate = latestReleaseDate;
        this.availableIn = availableIn;

        this.metrics = metrics;

        this.roadmap = roadmap;
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

    // [MỚI] Tự động format dòng chữ nhỏ hiển thị trên Roadmap Node
    get subText() {
        if (!this.roadmap || !this.roadmap.status) return '';
        
        // Cột Tháng Trước (Đã hoàn thành)
        if (this.roadmap.status === 'prev') {
            return `${this.modelCount > 0 ? this.modelCount + ' Models • ' : ''}Đã lên kệ`;
        }
        
        // Cột Tháng Này (Đang thực hiện)
        if (this.roadmap.status === 'current') {
            const noteText = this.roadmap.note ? ` • ${this.roadmap.note}` : '';
            return `Tiến độ: ${this.roadmap.progress}%${noteText}`;
        }
        
        // Cột Tháng Sau (Dự kiến)
        if (this.roadmap.status === 'next') {
            return `Dự kiến: ${this.roadmap.estimatedDelivery || 'Sắp ra mắt'}`;
        }

        return '';
    }
}