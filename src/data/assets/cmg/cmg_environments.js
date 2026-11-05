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
// DỮ LIỆU MẪU: DANH MỤC 2 - ENVIRONMENTS (PACK 7 -> 12)
// =========================================================================
export const mockEnvironmentAssets = [
    // ---------------------------------------------------------------------
    // PACK 7: HOT PACK TRÊN MEGA MENU + GIẢM GIÁ 50% + LAUNCH EDITION
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 7,
        slug: 'stylized-island-mega-pack',
        title: 'Stylized Island Mega Pack',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['island', 'floating', 'tropical', 'mega-pack', 'water-shader', 'urp'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: true
        },

        pricing: {
            price: 35.00,
            originalPrice: 70.00,
            discount: 50,
            discountEndsIn: '6 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '120+ modular tropical & floating island assets with stylized foam water shaders.',
            fullDescription: [
                'Đại gói môi trường quần đảo nhiệt đới và đảo bay (Floating Islands) được chế tác tỉ mỉ với các đường vát cạnh mềm mại và tông màu rực rỡ, mang lại sức sống tức thì cho các tựa game Casual, Adventure và Idle Tycoon.',
                'Đi kèm hệ thống dữ liệu vị trí JSON và công cụ Spawner giúp tái tạo lại toàn bộ các cảnh Demo trong Unity chỉ với một cú nhấp chuột.'
            ],
            features: [
                'Hơn 120 mô hình: Đảo chính, Đảo vệ tinh, Cầu gỗ, Thuyền buồm, Đá ngầm & Thực vật biển',
                'Tích hợp sẵn Stylized Water Shader (hỗ trợ bọt sóng tự động quanh mép đảo)',
                '5 Demo Scenes hoàn chỉnh ánh sáng, sẵn sàng đưa vào sản xuất (Production Ready)',
                'Toàn bộ vách đá và địa hình được ghép nối Modular không lộ vết cắt'
            ]
        },

        techSpecs: {
            packCount: 3,
            modelCount: 125,
            polycount: '150 - 2,400 tris',
            rigged: 'No',
            animated: 'Yes (Water, Windmill & Clouds)',
            textures: '2x 4K Color & Gradient Atlas',
            renderPipeline: 'Unity URP 6.3+ & Built-in'
        },

        dates: {
            initialRelease: '2026-10-25',
            latestUpdate: '2026-11-01',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 1150,
            views: 8940,
            downloads: 620
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã phát hành chính thức kèm công cụ JSON Scene Importer',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 8: TOP RATED + EXCLUSIVE + ROADMAP (CURRENT - 80%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 8,
        slug: 'grand-archipelago-floating-dioramas',
        title: 'Grand Archipelago – Floating Dioramas',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['archipelago', 'diorama', 'floating-island', 'biomes', 'sky', 'stylized'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: true
        },

        pricing: {
            price: 49.00,
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
            shortDescription: '10 complete self-contained floating island dioramas across 4 distinct fantasy biomes.',
            fullDescription: [
                'Dòng sản phẩm chủ lực Grand Archipelago mang đến 10 hòn đảo Diorama lơ lửng tuyệt đẹp, được thiết kế như những mô hình Art Toy thu nhỏ với bề mặt đất sét mịn màng (Smooth Matte Clay) và ánh sáng ấm áp.',
                'Cực kỳ lý tưởng để làm màn hình chọn màn chơi (Level Selection), sảnh chờ (Main Menu Hub) hoặc đấu trường thu nhỏ cho game chiến thuật theo lượt trên di động.'
            ],
            features: [
                '10 Diorama đảo bay độc lập thuộc 4 hệ sinh thái: Thảo nguyên, Sa mạc, Núi lửa & Băng giá',
                'Hỗ trợ chuyển đổi trạng thái theo mùa (Xuân, Hạ, Thu, Đông) tự động qua C# Script',
                'Đạt chuẩn hiệu năng 60 FPS ổn định trên các thiết bị di động tầm trung',
                'Mọi đối tượng đều được gắn sẵn định danh gốc và trục xoay (Pivot) chuẩn xác tại tâm đáy'
            ]
        },

        techSpecs: {
            packCount: 4,
            modelCount: 210,
            polycount: '4,500 - 8,200 tris / full diorama',
            rigged: 'No',
            animated: 'Yes (Floating & Cloud Loops)',
            textures: '4x 4K Biome Color Atlases',
            renderPipeline: 'Unity URP & Blender 5'
        },

        dates: {
            initialRelease: '2026-06-20',
            latestUpdate: '2026-10-18',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 980,
            views: 7650,
            downloads: 490
        },

        roadmap: {
            status: 'current',
            progress: 80,
            note: 'Đang hoàn thiện thêm 2 đảo chủ đề Mùa Đông & Giáng Sinh',
            estimatedDelivery: 'Giữa tháng 11/2026'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 9: BEST-SELLER + MILD DISCOUNT (25%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 9,
        slug: 'cozy-farm-village-modular-world',
        title: 'Cozy Farm & Village Modular World',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['farm', 'village', 'cozy', 'harvest', 'crops', 'countryside'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
            isFeatured: true
        },

        pricing: {
            price: 30.00,
            originalPrice: 40.00,
            discount: 25,
            discountEndsIn: '5 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '95 charming farm buildings, crops, hay bales, and countryside props for farming sims.',
            fullDescription: [
                'Tất cả những gì bạn cần để xây dựng một tựa game nông trại yên bình: từ nhà kho đỏ đặc trưng, cối xay gió, hàng rào gỗ, cuộn rơm vàng ươm cho đến các luống cây trồng theo từng giai đoạn phát triển.',
                'Từng mô hình như cây ngô, bí ngô, cà chua đều được cách điệu hóa với khối hình rõ ràng, dễ nhận diện từ góc nhìn từ trên xuống (Top-down / Isometric).'
            ],
            features: [
                '95 tài nguyên nông trại: Nhà cửa, Chuồng gia súc, Cối xay gió, Xe kéo, Cuộn rơm & Nông cụ',
                '10 loại cây trồng (Ngô, Lúa mì, Cà rốt, Bí ngô...) chia sẵn 4 giai đoạn lớn lên',
                'Hệ thống mảnh đất ruộng, đường mòn và hàng rào lắp ghép theo lưới (Grid-snapping)',
                'Màu sắc tươi sáng, ấm áp theo bảng màu Color-blocking đặc trưng'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 95,
            polycount: '80 - 1,450 tris',
            rigged: 'No',
            animated: 'Yes (Windmill Blades)',
            textures: '1x 4K Master Atlas (.png)',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-06-05',
            latestUpdate: '2026-09-12',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 760,
            views: 5890,
            downloads: 380
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 10: STANDARD PACK + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 10,
        slug: 'lowpoly-dungeon-castle-ruins',
        title: 'Lowpoly Dungeon & Castle Ruins',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['dungeon', 'castle', 'ruins', 'rpg', 'traps', 'modular'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 28.00,
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
            shortDescription: '80 modular dungeon walls, glowing crystal caverns, chests, and interactive traps.',
            fullDescription: [
                'Thiết kế các hầm ngục tối tăm nhưng vẫn giữ được nét nghệ thuật Stylized cuốn hút. Gói tài nguyên cung cấp đầy đủ gạch lát sàn, tường đá rêu phong, cổng vòm, bẫy chông và rương kho báu.',
                'Mọi mô hình kiến trúc đều tuân thủ kích thước chuẩn (2m x 2m và 4m x 4m) giúp việc xây dựng màn chơi bằng ProGrid hoặc Tilemap 3D cực kỳ nhanh chóng.'
            ],
            features: [
                '80 mảnh ghép Modular: Tường, Sàn, Cầu thang xoắn, Cột trụ, Cửa sắt & Hầm mộ',
                '15 loại bẫy cơ khí (Bẫy chông, Rìu lắc, Sàn sập) đã tách riêng phần chuyển động',
                'Đi kèm Prefab đuốc lửa, tinh thể phát sáng (Emission) và bình độc dược',
                'Đã mở sẵn UV2 hoàn chỉnh phục vụ Bake Lightmap trong Unity'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 80,
            polycount: '120 - 950 tris',
            rigged: 'No',
            animated: 'Yes (Chests & Traps)',
            textures: '4K Albedo + 4K Emission',
            renderPipeline: 'Unity URP / HDRP'
        },

        dates: {
            initialRelease: '2026-07-22',
            latestUpdate: '2026-08-30',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 485,
            views: 4120,
            downloads: 230
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã cập nhật UV2 chuẩn cho toàn bộ tường & sàn hầm ngục',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 11: 100% FREE ASSET (DIRECT DOWNLOAD)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 11,
        slug: 'floating-sky-shrine-mini-diorama-free',
        title: 'Floating Sky Shrine – Mini Diorama',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['free', 'diorama', 'shrine', 'floating-island', 'starter'],

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
            url: '/downloads/cmg-floating-sky-shrine-free.zip',
            fileSize: '28.4 MB',
            format: '.fbx, .unitypackage, .blend',
            license: 'CC0 - Commercial & Personal Use',
            version: '1.0.2'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: 'A free mystical floating island diorama with ancient stone gates, sakura trees, and lanterns.',
            fullDescription: [
                'Một hòn đảo Diorama đền thờ cổ kính lơ lửng giữa mây trời với cây hoa anh đào và cổng đá phát sáng — hoàn toàn miễn phí để bạn trải nghiệm chất lượng dòng sản phẩm Grand Archipelago.',
                'Bao gồm trọn bộ Scene mẫu đã thiết lập sẵn Post-Processing, Lighting và Skybox trong Unity URP.'
            ],
            features: [
                '18 mô hình chi tiết: Đảo đá bay, Cổng cổ đại, Đèn lồng đá, Cầu thang, Cây Sakura & Mây',
                'Tặng kèm 1 Scene Unity URP đã thiết lập ánh sáng như hình Render',
                'Miễn phí 100% cho mọi mục đích sử dụng (Kể cả dự án thương mại)'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 18,
            polycount: '3,200 tris (Toàn bộ Diorama)',
            rigged: 'No',
            animated: 'Yes (Floating Stones)',
            textures: '1x 4K Color Atlas',
            renderPipeline: 'Unity URP & Blender 5'
        },

        dates: {
            initialRelease: '2026-05-28',
            latestUpdate: '2026-09-05',
            availableIn: ''
        },

        links: {
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 1520,
            views: 11400,
            downloads: 4890
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 12: COMING SOON + ROADMAP (NEXT - 45%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 12,
        slug: 'cyber-city-neon-district',
        title: 'Cyber-City Neon District',
        categoryId: 'environments',
        publisher: 'Cute Magic',
        tags: ['cyberpunk', 'city', 'scifi', 'neon', 'buildings', 'upcoming'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: false
        },

        pricing: {
            price: 55.00,
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
            shortDescription: '140+ futuristic stylized buildings, holographic billboards, and modular street props.',
            fullDescription: [
                'Khu phố tương lai rực rỡ ánh đèn Neon được thiết kế đồng bộ hoàn hảo với gói nhân vật Sci-Fi Cyberpunk Mercenaries.',
                'Tập trung vào hệ thống tòa nhà lắp ghép theo tầng, biển quảng cáo Hologram trong suốt và hệ thống đường phố thông minh.'
            ],
            features: [
                'Hơn 140 mô hình: Tòa nhà chọc trời, Quán mì Ramen, Trạm tàu điện, Biển hiệu Neon & Máy bán hàng',
                'Hỗ trợ Shader Hologram nhấp nháy và mặt đường phản chiếu ánh đèn đêm',
                'Tối ưu hóa Occlusion Culling cho môi trường đô thị dày đặc'
            ]
        },

        techSpecs: {
            packCount: 2,
            modelCount: 140,
            polycount: '200 - 3,500 tris',
            rigged: 'No',
            animated: 'Yes (Holograms & Fans)',
            textures: '4K Albedo + 4K Neon Emission',
            renderPipeline: 'Unity URP 6.3+'
        },

        dates: {
            initialRelease: '2026-12-10',
            latestUpdate: '2026-12-10',
            availableIn: '1 tháng nữa'
        },

        links: {},

        metrics: {
            likes: 310,
            views: 1580,
            downloads: 0
        },

        roadmap: {
            status: 'next',
            progress: 45,
            note: 'Đang dựng hệ thống đường giao thông Modular & biển hiệu Hologram',
            estimatedDelivery: 'Tháng 12/2026'
        }
    })
]