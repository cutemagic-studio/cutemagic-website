// src/models/cmg/Cmg_AssetModel.js

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
            videoUrl: data.media?.videoUrl || '',
            sketchfabId: data.media?.sketchfabId || ''
        };

        // ==========================================
        // 6. THÔNG SỐ KỸ THUẬT 3D (TECH SPECS)
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
        // 9. TIẾN ĐỘ DỰ ÁN (ROADMAP)
        // (Khởi tạo trước dates để getter availableIn tham chiếu được)
        // ==========================================
        this.roadmap = {
            status: data.roadmap?.status || null, // 'prev' | 'current' | 'next' | null
            progress: Number(data.roadmap?.progress ?? 0),
            note: data.roadmap?.note || '',
            estimatedDelivery: data.roadmap?.estimatedDelivery || ''
        };

        // ==========================================
        // 10. THỜI GIAN, LỊCH TRÌNH & SOFT DELETE (DATES)
        // ==========================================
        const rawDates = data.dates || data.dateTime || {};
        const todayStr = this._getTodayStr();
        const initialRel = rawDates.initialRelease ?? rawDates.initialReleaseDate ?? data.initialReleaseDate ?? todayStr;

        // Cột deleted_at phục vụ Soft Delete (null = đang tồn tại, chuỗi ngày giờ = đã xóa mềm)
        const rawDeletedAt = data.deleted_at ?? rawDates.deleted_at ?? null;
        this.deleted_at = rawDeletedAt || null;

        const self = this;
        this.dates = {
            // created_at: Ngày khởi tạo bản ghi thực tế vào hệ thống (Cố định)
            created_at: rawDates.created_at || initialRel || todayStr,
            // recordCreatedDate: Ngày tạo bản ghi cho phép Admin tinh chỉnh để xét gợi ý trạng thái
            recordCreatedDate: rawDates.recordCreatedDate || rawDates.created_at || initialRel || todayStr,
            initialRelease: initialRel,
            latestUpdate: rawDates.latestUpdate ?? rawDates.latestReleaseDate ?? data.latestReleaseDate ?? initialRel,
            deleted_at: this.deleted_at,

            // Getter tự động cho dates.availableIn (Tính động theo ngày dự kiến, không lưu cứng vào DB)
            get availableIn() {
                return self.computedAvailableIn;
            },
            set availableIn(_val) {
                // Bỏ qua việc gán cứng vì availableIn được tính tự động từ estimatedDelivery
            }
        };

        // ==========================================
        // 11. THỐNG KÊ TƯƠNG TÁC (METRICS)
        // ==========================================
        const rawMetrics = data.metrics || data.stats || {};
        this.metrics = {
            likes: Number(rawMetrics.likes ?? data.likes ?? 0),
            views: Number(rawMetrics.views ?? data.views ?? 0),
            downloads: Number(rawMetrics.downloads ?? data.downloads ?? 0)
        };
    }

    // =========================================================================
    // LOGIC TỰ ĐỘNG TÍNH NHÃN "AVAILABLE IN" & TRẠNG THÁI XÓA MỀM
    // =========================================================================

    /** Kiểm tra bản ghi có đang bị đánh dấu xóa mềm (Soft Deleted) hay không */
    get isDeleted() {
        return Boolean(this.deleted_at || this.dates?.deleted_at);
    }

    /**
     * Tự động tính nhãn "Available In" dựa trên Ngày dự kiến hoàn thành/phát hành so với Hôm nay.
     * Trả về chuỗi rỗng '' nếu Pack đã phát hành (Tiến độ 100% và Ngày dự kiến <= Hôm nay).
     */
    get computedAvailableIn() {
        const todayStr = this._getTodayStr();
        const targetStr = this.roadmap?.estimatedDelivery || this.dates?.initialRelease || '';
        const progress = Number(this.roadmap?.progress ?? 0);
        const status = this.roadmap?.status;

        // Nếu đã chọn trạng thái 'prev' (Đã phát hành) hoặc tiến độ 100% và ngày dự kiến <= hôm nay -> Đã ra mắt
        if (status === 'prev') return '';

        const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(String(targetStr).trim());
        if (!isIsoDate) {
            // Tương thích ngược nếu dữ liệu cũ chưa phải YYYY-MM-DD nhưng đang ở trạng thái 'next'/'current'
            if (status === 'next' || status === 'current') {
                return targetStr || 'Sắp ra mắt';
            }
            return '';
        }

        const targetTime = new Date(`${targetStr}T00:00:00`).getTime();
        const todayTime = new Date(`${todayStr}T00:00:00`).getTime();
        const diffDays = Math.round((targetTime - todayTime) / (1000 * 60 * 60 * 24));

        // Đã tới hoặc qua ngày phát hành VÀ tiến độ đạt 100% (hoặc không nằm trong diện đang làm) -> Đã phát hành
        if (diffDays <= 0 && (progress === 100 || (!status && progress === 0))) {
            return '';
        }

        if (diffDays === 0) return 'Ra mắt hôm nay';
        if (diffDays > 0) {
            if (diffDays < 7) return `${diffDays} ngày nữa`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần nữa`;
            return `${Math.round(diffDays / 30)} tháng nữa`;
        }

        // Trường hợp diffDays < 0 nhưng đang ở trạng thái 'current' / 'next' hoặc 0 < progress < 100
        return 'Đang hoàn thiện';
    }

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
    get availableIn() { return this.computedAvailableIn; }

    get likes() { return this.metrics.likes; }
    set likes(val) { this.metrics.likes = Number(val); }

    /**
     * Xuất ra Plain Object sạch để lưu lên Firebase Realtime Database
     * (Tuyệt đối KHÔNG lưu trường availableIn cứng vào Database)
     */
    toPlainObject() {
        const syncedDeletedAt = this.deleted_at ?? this.dates?.deleted_at ?? null;
        return {
            id: Number(this.id),
            slug: this.slug,
            title: this.title,
            categoryId: this.categoryId,
            publisher: this.publisher,
            tags: Array.isArray(this.tags) ? [...this.tags] : [],
            deleted_at: syncedDeletedAt,
            flags: { ...this.flags },
            pricing: { ...this.pricing },
            content: {
                shortDescription: this.content.shortDescription || '',
                fullDescription: [...(this.content.fullDescription || [])],
                features: [...(this.content.features || [])]
            },
            media: {
                cover: this.media.cover || '',
                gallery: [...(this.media.gallery || [])],
                videoUrl: this.media.videoUrl || '',
                sketchfabId: this.media.sketchfabId || ''
            },
            techSpecs: { ...this.techSpecs },
            download: { ...this.download },
            links: { ...this.links },
            dates: {
                created_at: this.dates.created_at || this._getTodayStr(),
                recordCreatedDate: this.dates.recordCreatedDate || this.dates.created_at || this._getTodayStr(),
                initialRelease: this.dates.initialRelease || this._getTodayStr(),
                latestUpdate: this.dates.latestUpdate || this.dates.initialRelease || this._getTodayStr(),
                deleted_at: syncedDeletedAt
                // Không lưu availableIn vào DB
            },
            metrics: { ...this.metrics },
            roadmap: { ...this.roadmap }
        };
    }

    _getTodayStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    _generateSlug(title = '') {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}