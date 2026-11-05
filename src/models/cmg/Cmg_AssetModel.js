export class CmgAssetModel {
    constructor(data = {}) {
        // ==========================================
        // 1. ĐỊNH DANH CỐT LÕI (CORE IDENTITY)
        // ==========================================
        this.id = data.id ?? null;
        this.slug = data.slug || this._generateSlug(data.title);
        this.title = data.title || 'Untitled Asset';
        this.categoryId = data.categoryId || 'all';
        this.publisher = data.publisher || 'Cute Magic';
        this.tags = Array.isArray(data.tags) ? data.tags : [];

        // ==========================================
        // 2. CỜ TRẠNG THÁI & HUY HIỆU (FLAGS & BADGES)
        // ==========================================
        this.flags = {
            isExclusive: Boolean(data.flags?.isExclusive ?? data.isExclusive ?? false),
            isLaunchEdition: Boolean(data.flags?.isLaunchEdition ?? data.price?.isLaunchEdition ?? data.isLaunchEdition ?? false),
            isFeatured: Boolean(data.flags?.isFeatured ?? data.isFeatured ?? false),
        };

        // ==========================================
        // 3. GIÁ CẢ & KHUYẾN MÃI (PRICING)
        // Đổi tên nhóm thành 'pricing' để không đụng độ với thuộc tính 'price'
        // ==========================================
        const rawPriceObj = typeof data.price === 'object' && data.price !== null ? data.price : {};
        const rawPricing = data.pricing || rawPriceObj;

        this.pricing = {
            price: Number(rawPricing.price ?? (typeof data.price === 'number' ? data.price : 0)),
            originalPrice: rawPricing.originalPrice ?? data.originalPrice ?? null,
            discount: rawPricing.discount ?? data.discount ?? null,
            discountEndsIn: rawPricing.discountEndsIn ?? data.discountEndsIn ?? '',
            currency: rawPricing.currency || 'USD'
        };

        // ==========================================
        // 4. NỘI DUNG MÔ TẢ (CONTENT)
        // ==========================================
        this.content = {
            shortDescription: data.content?.shortDescription ?? data.shortDescription ?? '',
            fullDescription: Array.isArray(data.content?.fullDescription) 
                ? data.content.fullDescription 
                : (Array.isArray(data.fullDescription) ? data.fullDescription : []),
            features: Array.isArray(data.content?.features) 
                ? data.content.features 
                : (Array.isArray(data.features) ? data.features : [])
        };

        // ==========================================
        // 5. HÌNH ẢNH & ĐA PHƯƠNG TIỆN (MEDIA)
        // ==========================================
        this.media = {
            cover: data.media?.cover || '',
            gallery: Array.isArray(data.media?.gallery) ? data.media.gallery : [],
            videoUrl: data.media?.videoUrl || '',       // Dự phòng cho video trailer YouTube
            sketchfabId: data.media?.sketchfabId || ''  // Dự phòng nhúng 3D Viewer
        };

        // ==========================================
        // 6. THÔNG SỐ KỸ THUẬT 3D (TECH SPECS)
        // Gom cả packCount và modelCount vào đây cho đúng bản chất kỹ thuật
        // ==========================================
        this.techSpecs = {
            packCount: Number(data.techSpecs?.packCount ?? data.packCount ?? 0),
            modelCount: Number(data.techSpecs?.modelCount ?? data.modelCount ?? 0),
            polycount: data.techSpecs?.polycount || 'Low Poly',
            rigged: data.techSpecs?.rigged || 'No',
            animated: data.techSpecs?.animated || 'No',
            textures: data.techSpecs?.textures || 'Color Atlas (4K)',
            renderPipeline: data.techSpecs?.renderPipeline || 'URP / Built-in'
        };

        // ==========================================
        // 7. TẢI XUỐNG TRỰC TIẾP (FREE / DIRECT DOWNLOAD)
        // ==========================================
        this.download = {
            url: data.download?.url || '',
            fileSize: data.download?.fileSize || '',
            format: data.download?.format || '.fbx, .unitypackage',
            license: data.download?.license || 'Standard License',
            version: data.download?.version || '1.0.0'
        };

        // ==========================================
        // 8. LIÊN KẾT CỬA HÀNG (STORE LINKS)
        // ==========================================
        this.links = {
            unity: data.links?.unity || '',
            fab: data.links?.fab || '',
            itch: data.links?.itch || '',
            cgtrader: data.links?.cgtrader || '',
            turboSquid: data.links?.turboSquid || '',
            artStation: data.links?.artStation || ''
        };

        // ==========================================
        // 9. THỜI GIAN & LỊCH TRÌNH (DATES & TIMELINE)
        // ==========================================
        const rawDates = data.dates || data.dateTime || {};
        this.dates = {
            initialRelease: rawDates.initialRelease ?? rawDates.initialReleaseDate ?? data.initialReleaseDate ?? '',
            latestUpdate: rawDates.latestUpdate ?? rawDates.latestReleaseDate ?? data.latestReleaseDate ?? '',
            availableIn: rawDates.availableIn ?? rawDates.availableInDate ?? data.availableIn ?? ''
        };

        // ==========================================
        // 10. THỐNG KÊ TƯƠNG TÁC (METRICS)
        // ==========================================
        const rawMetrics = data.metrics || data.stats || {};
        this.metrics = {
            likes: Number(rawMetrics.likes ?? data.likes ?? 0),
            views: Number(rawMetrics.views ?? data.views ?? 0),
            downloads: Number(rawMetrics.downloads ?? data.downloads ?? 0)
        };

        // ==========================================
        // 11. TIẾN ĐỘ DỰ ÁN (ROADMAP)
        // ==========================================
        this.roadmap = {
            status: data.roadmap?.status || null, // 'prev' | 'current' | 'next' | null
            progress: Number(data.roadmap?.progress ?? 0),
            note: data.roadmap?.note || '',
            estimatedDelivery: data.roadmap?.estimatedDelivery || ''
        };
    }

    // =========================================================================
    // CÁC GETTER TIỆN ÍCH THÔNG MINH (COMPUTED PROPERTIES TRÊN MODEL)
    // Giúp gọi trực tiếp trong Template mà không cần tính toán lại ở Component
    // =========================================================================

    /** Kiểm tra xem đây có phải là Asset miễn phí không */
    get isFree() {
        return this.pricing.price === 0;
    }

    /** Kiểm tra xem Asset có đang giảm giá không */
    get hasDiscount() {
        return Boolean(this.pricing.discount && this.pricing.discount > 0 && this.pricing.originalPrice);
    }

    /** Trả về chuỗi giá tiền đã format đẹp (VD: 'Free' hoặc '$25.00') */
    get displayPrice() {
        return this.isFree ? 'Free' : `$${this.pricing.price.toFixed(2)}`;
    }

    /** Kiểm tra xem Asset này có nằm trên bảng Roadmap không */
    get isInRoadmap() {
        return ['prev', 'current', 'next'].includes(this.roadmap.status);
    }

    // =========================================================================
    // LỚP TƯƠNG THÍCH NGƯỢC (BACKWARD COMPATIBILITY ALIASES)
    // Cực kỳ quan trọng: Giúp toàn bộ các file Vue/Pinia cũ vẫn chạy mượt 100%
    // khi gọi asset.price, asset.shortDescription, asset.likes...
    // =========================================================================
    
    get price() { return this.pricing.price; }
    set price(val) { this.pricing.price = Number(val); }

    get originalPrice() { return this.pricing.originalPrice; }
    get discount() { return this.pricing.discount; }
    get discountEndsIn() { return this.pricing.discountEndsIn; }

    get shortDescription() { return this.content.shortDescription; }
    get fullDescription() { return this.content.fullDescription; }
    get features() { return this.content.features; }

    get packCount() { return this.techSpecs.packCount; }
    get modelCount() { return this.techSpecs.modelCount; }

    get isExclusive() { return this.flags.isExclusive; }
    get isLaunchEdition() { return this.flags.isLaunchEdition; }

    get releaseDate() { return this.dates.latestUpdate || this.dates.initialRelease; }
    get initialReleaseDate() { return this.dates.initialRelease; }
    get latestReleaseDate() { return this.dates.latestUpdate; }
    get availableIn() { return this.dates.availableIn; }

    get likes() { return this.metrics.likes; }
    set likes(val) { this.metrics.likes = Number(val); }

    // Hàm nội bộ tự động tạo slug từ title nếu quên nhập slug
    _generateSlug(title = '') {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}