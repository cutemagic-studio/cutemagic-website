import { CmgAssetModel } from '../../../models/cmg/Cmg_AssetModel'

import dummyThumb from '../../../assets/asset_gallery/thumb.webp'

import dummyGallery01 from '../../../assets/asset_gallery/sub_thumb_01.webp'
import dummyGallery02 from '../../../assets/asset_gallery/sub_thumb_02.webp'
import dummyGallery03 from '../../../assets/asset_gallery/sub_thumb_03.webp'
import dummyGallery04 from '../../../assets/asset_gallery/sub_thumb_04.webp'
import dummyGallery05 from '../../../assets/asset_gallery/sub_thumb_05.webp'
import dummyGallery06 from '../../../assets/asset_gallery/sub_thumb_06.webp'

const mediaBase = { 
    cover: dummyThumb, 
    gallery: [dummyGallery01, dummyGallery02, dummyGallery03, dummyGallery04, dummyGallery05, dummyGallery06] 
}

// =========================================================================
// DỮ LIỆU MẪU: DANH MỤC 3 - INTERIORS & PROPS (PACK 13 -> 18)
// =========================================================================
export const mockInteriorAssets = [
    // ---------------------------------------------------------------------
    // PACK 13: TOP RATED + EXCLUSIVE + 20 ROOMS COLLECTION + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 13,
        slug: '20-room-cozy-interior-mega-pack',
        title: '20-Room Cozy Interior Mega Pack',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['interior', 'furniture', 'cozy', 'rooms', 'isometric', 'house'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: true
        },

        pricing: {
            price: 42.00,
            originalPrice: null,
            discount: null,
            discountEndsIn: ''
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '20 pre-built isometric room dioramas and 250+ stylized low-poly furniture props.',
            fullDescription: [
                'Bộ sưu tập khổng lồ gồm 20 căn phòng nội thất góc nhìn Isometric đã được bài trí sẵn cùng hơn 250 món đồ gia dụng rời: từ phòng ngủ ấm cúng, phòng khách hiện đại, phòng làm việc, thư viện cho đến tiệm bánh và quán cà phê.',
                'Mọi đồ vật đều được xử lý cạnh bo tròn mềm mại (Beveled Edges), bề mặt Matte Clay chống chói và chia trục xoay (Pivot) chuẩn xác giúp người chơi dễ dàng kéo thả trong các tựa game Decor & Life Simulation.'
            ],
            features: [
                '20 căn phòng mẫu hoàn chỉnh (Pre-assembled Room Prefabs) sẵn sàng đưa vào game',
                'Hơn 250 món nội thất độc lập: Sofa, Giường, Tủ sách, Cây cảnh trong nhà, Đèn bàn & Đồ trang trí',
                'Cánh tủ, ngăn kéo và cửa phòng được tách rời Mesh để làm hiệu ứng đóng/mở tương tác',
                'Sử dụng duy nhất 1 Texture Atlas 4K cho toàn bộ 20 căn phòng, cực kỳ nhẹ cho Mobile'
            ]
        },

        techSpecs: {
            packCount: 2,
            modelCount: 255,
            polycount: '40 - 850 tris / prop',
            rigged: 'No (Separated Pivots for Doors/Drawers)',
            animated: 'No',
            textures: '1x 4K Master Color Atlas (.png)',
            renderPipeline: 'Unity URP & Blender 5'
        },

        dates: {
            initialRelease: '2026-05-18',
            latestUpdate: '2026-10-10',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 1320,
            views: 9480,
            downloads: 580
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã hoàn thiện đủ 20 phòng mẫu kèm dữ liệu JSON Layout',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 14: NEW RELEASE + LAUNCH EDITION + 40% DISCOUNT
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 14,
        slug: 'fantasy-alchemist-magic-shop',
        title: 'Fantasy Alchemist & Magic Shop',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['alchemist', 'magic', 'potions', 'fantasy', 'shop', 'interior'],

        flags: {
            isExclusive: false,
            isLaunchEdition: true,
            isFeatured: true
        },

        pricing: {
            price: 24.00,
            originalPrice: 40.00,
            discount: 40,
            discountEndsIn: '3 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '110+ magical interior props including glowing potion bottles, spellbooks, and cauldrons.',
            fullDescription: [
                'Biến căn phòng trống thành xưởng giả kim thuật đầy mê hoặc với hơn 110 đạo cụ phép thuật: vạc nấu thuốc sủi bọt, kệ gỗ cổ kính, sách phép thuật bay lơ lửng, quả cầu tiên tri và hàng chục lọ thuốc đa hình dạng.',
                'Kết hợp hoàn hảo giữa chất liệu gỗ mộc ấm áp và hiệu ứng phát sáng (Emission) lung linh cho các tinh thể và bình dược thảo.'
            ],
            features: [
                '35 mẫu bình thuốc (Potions) với chất lỏng bên trong được tách lớp riêng biệt',
                '75 đồ nội thất & đạo cụ: Vạc phép, Bàn giả kim, Cân tiểu ly, Cuộn giấy cổ, Nến chảy & Đá Rune',
                'Đi kèm Shader chất lỏng phát sáng và Particle khói ma thuật cho Unity URP',
                'Tặng kèm 2 Demo Scenes: Cửa tiệm bán thuốc (Ban ngày) & Phòng thí nghiệm phù thủy (Ban đêm)'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 112,
            polycount: '60 - 920 tris',
            rigged: 'No',
            animated: 'Yes (Floating Books & Bubbling Cauldron)',
            textures: '4K Color Atlas + 4K Emission Map',
            renderPipeline: 'Unity URP 6.3+ & FBX'
        },

        dates: {
            initialRelease: '2026-10-30',
            latestUpdate: '2026-11-03',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 615,
            views: 4320,
            downloads: 245
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 15: BEST-SELLER + MILD DISCOUNT (20%) + ROADMAP (CURRENT - 75%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 15,
        slug: 'modern-gaming-streamer-room',
        title: 'Modern Gaming & Streamer Room',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['gaming', 'streamer', 'modern', 'pc', 'cyber', 'room'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 20.00,
            originalPrice: 25.00,
            discount: 20,
            discountEndsIn: '8 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '85 trendy streamer setup props: dual monitors, RGB gaming chairs, mics, and art toys.',
            fullDescription: [
                'Gói nội thất chuyên dụng cho các tựa game mô phỏng Youtuber / Streamer Tycoon. Cung cấp trọn bộ góc máy tính hiện đại với màn hình cong, bàn phím cơ, ghế Gaming công thái học, đèn LED Nanoleaf treo tường và kệ trưng bày Art Toy.',
                'Các chi tiết đèn LED trên thùng máy PC và tường được tách kênh Emission giúp lập trình viên dễ dàng tạo hiệu ứng đổi màu RGB động trong game.'
            ],
            features: [
                '85 mô hình chi tiết: PC Case trong suốt, Màn hình đa cỡ, Mic thu âm, Camera, Đèn Ringlight & Ghế Gaming',
                'Bộ sưu tập 12 mô hình Art Toy nhỏ xinh để trang trí kệ sách phía sau lưng Streamer',
                'Hỗ trợ đổi màu đèn LED RGB mượt mà thông qua Material Property Block',
                'Bố cục hợp lý, dễ dàng nâng cấp từng món đồ từ cấp độ Cũ (Tier 1) lên Hiện đại (Tier 3)'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 85,
            polycount: '50 - 1,100 tris',
            rigged: 'No (Swivel Chair & Monitor Arm Pivots)',
            animated: 'Yes (PC Cooling Fans)',
            textures: '4K Albedo + 4K RGB Emission',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-08-05',
            latestUpdate: '2026-10-22',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 740,
            views: 5610,
            downloads: 340
        },

        roadmap: {
            status: 'current',
            progress: 75,
            note: 'Đang bổ sung thêm 10 mẫu thùng PC Custom tản nhiệt nước & máy chơi game Arcade',
            estimatedDelivery: 'Cuối tháng 11/2026'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 16: STANDARD PACK (NO DISCOUNT)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 16,
        slug: 'medieval-tavern-inn-interior',
        title: 'Medieval Tavern & Inn Interior',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['tavern', 'medieval', 'inn', 'rpg', 'props', 'food'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 26.00,
            originalPrice: null,
            discount: null,
            discountEndsIn: ''
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '90 rustic tavern furniture pieces, oak barrels, hearth fireplaces, and feast dishes.',
            fullDescription: [
                'Tái hiện không khí náo nhiệt, ấm áp của quán rượu thời Trung Cổ — nơi các hiệp sĩ và nhà thám hiểm dừng chân nhận nhiệm vụ.',
                'Bao gồm hệ thống tường gỗ, quầy bar bằng đá, thùng rượu sồi, lò sưởi bập bùng lửa, đèn chùm bánh xe cùng hàng loạt món ăn, cốc bia sủi bọt.'
            ],
            features: [
                '90 mô hình nội thất quán trọ: Bàn dài, Ghế đẩu, Quầy pha chế, Thùng gỗ sồi, Lò sưởi & Cầu thang',
                '25 đạo cụ bàn tiệc: Cốc bia gỗ, Đùi gà nướng, Bánh mì, Phô mai, Đĩa bạc & Nến',
                'Cấu trúc tường và sàn gỗ ghép nối theo kích thước chuẩn Modular',
                'Tặng kèm hiệu ứng lửa lò sưởi và ánh sáng nến ấm áp'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 90,
            polycount: '60 - 1,050 tris',
            rigged: 'No',
            animated: 'Yes (Fireplace Flame)',
            textures: '1x 4K Warm Color Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-07-14',
            latestUpdate: '2026-09-01',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 430,
            views: 3490,
            downloads: 195
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 17: 100% FREE ASSET (DIRECT DOWNLOAD) + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 17,
        slug: 'cute-kitchen-food-props-starter-free',
        title: 'Cute Kitchen & Food Props Starter',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['free', 'kitchen', 'cooking', 'food', 'props', 'starter'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 0,
            originalPrice: null,
            discount: null,
            discountEndsIn: ''
        },

        download: {
            url: '/downloads/cmg-cute-kitchen-props-free.zip',
            fileSize: '19.8 MB',
            format: '.fbx, .unitypackage, .blend',
            license: 'CC0 - Commercial & Personal Use',
            version: '1.2.0'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: 'Free pack of 35 stylized kitchen appliances, cookware, and delicious low-poly meals.',
            fullDescription: [
                'Gói đạo cụ nhà bếp và ẩm thực miễn phí 100%, cực kỳ phù hợp cho các tựa game nấu ăn (Cooking Co-op), quản lý nhà hàng hoặc trang trí nhà cửa.',
                'Tất cả mô hình từ tủ lạnh, lò nướng, nồi chiên không dầu cho đến đĩa khoai tây chiên, bánh ngọt đều mang phong cách bo tròn mũm mĩm đặc trưng của Cute Magic.'
            ],
            features: [
                '20 thiết bị & dụng cụ bếp: Tủ lạnh, Bếp ga, Lò vi sóng, Nồi chiên, Chảo, Dao thớt & Bồn rửa',
                '15 món ăn & nguyên liệu đã chế biến sẵn sàng gắn vào tay nhân vật',
                'Cửa tủ lạnh và lò nướng đã tách riêng trục xoay để mở ra đóng vào mượt mà',
                'Miễn phí hoàn toàn cho mọi dự án game'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 35,
            polycount: '45 - 480 tris',
            rigged: 'No (Interactive Door Pivots)',
            animated: 'No',
            textures: '1x 4K Color Atlas (.png)',
            renderPipeline: 'All Pipelines'
        },

        dates: {
            initialRelease: '2026-05-02',
            latestUpdate: '2026-10-12',
            availableIn: ''
        },

        links: {
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 1680,
            views: 12300,
            downloads: 5120
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã cập nhật thêm 15 món ăn & nguyên liệu nấu bếp trong bản v1.2',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 18: COMING SOON + ROADMAP (NEXT - 25%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 18,
        slug: 'sci-fi-spaceship-bridge-lab',
        title: 'Sci-Fi Spaceship Bridge & Lab',
        categoryId: 'interiors',
        publisher: 'Cute Magic',
        tags: ['scifi', 'spaceship', 'laboratory', 'interior', 'futuristic', 'upcoming'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: false
        },

        pricing: {
            price: 38.00,
            originalPrice: null,
            discount: null,
            discountEndsIn: ''
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '100+ modular sci-fi corridors, command bridge consoles, cryo-pods, and research labs.',
            fullDescription: [
                'Xây dựng nội thất tàu vũ trụ hoặc trạm nghiên cứu không gian với các vách ngăn kim loại vát cạnh chuẩn Hard-Surface Stylized, cửa trượt tự động Airlock và bàn bản đồ sao Hologram.',
                'Thiết kế tối ưu cho các tựa game Sci-Fi Survival, Space Colony hoặc Social Deduction (kiểu suy luận trên tàu vũ trụ).'
            ],
            features: [
                'Hơn 100 mảnh ghép: Hành lang tàu vũ trụ, Khoang lái chính, Buồng ngủ đông (Cryo-pod) & Phòng Y tế',
                'Hệ thống cửa trượt tự động và màn hình điều khiển Hologram đa lớp',
                'Tối ưu hóa Topology sạch sẽ từ giáo trình Hard-Surface chuyên sâu'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 100,
            polycount: '120 - 1,600 tris',
            rigged: 'No',
            animated: 'Yes (Sliding Airlocks & Holo-Tables)',
            textures: '4K Albedo + 4K Sci-Fi Emission',
            renderPipeline: 'Unity URP 6.3+'
        },

        dates: {
            initialRelease: '2026-12-20',
            latestUpdate: '2026-12-20',
            availableIn: '6 tuần nữa'
        },

        links: {},

        metrics: {
            likes: 245,
            views: 1190,
            downloads: 0
        },

        roadmap: {
            status: 'next',
            progress: 25,
            note: 'Đang dựng mô hình khoang lái chính & bàn điều khiển Hologram',
            estimatedDelivery: 'Cuối tháng 12/2026'
        }
    })
]