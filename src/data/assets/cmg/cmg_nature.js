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
// DỮ LIỆU MẪU: DANH MỤC 4 - TREES & FOLIAGE (PACK 19 -> 24)
// =========================================================================
export const mockNatureAssets = [
    // ---------------------------------------------------------------------
    // PACK 19: TOP BEST-SELLER + EXCLUSIVE + STYLIZED TREE PACK
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 19,
        slug: 'stylized-lowpoly-tree-pack',
        title: 'Stylized Lowpoly Tree Pack',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['trees', 'forest', 'nature', 'lowpoly', 'foliage', 'wind-shader'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: true
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
            shortDescription: '60+ optimized low-poly trees, bushes, and logs with custom vertex-animation wind shaders.',
            fullDescription: [
                'Gói tài nguyên cây xanh biểu tượng của CuteMagic, cung cấp hơn 60 mô hình cây cối phong cách Lowpoly với các mảng khối tròn trịa, màu sắc tươi tắn và tối ưu hóa tuyệt đối cho hiệu năng game di động.',
                'Tích hợp sẵn Vertex Shader giúp tán lá chuyển động đu đưa theo gió một cách mượt mà mà không tốn chi phí tính toán xương phức tạp.'
            ],
            features: [
                '60+ mẫu cây đa dạng: Sồi, Thông, Bạch dương, Cây bụi, Thân cây mục & Nấm rừng',
                'Tích hợp Custom Wind Shader (tán lá lay động theo hướng gió tùy chỉnh qua Material)',
                'Chia sẵn 3 kích thước (Nhỏ, Vừa, Lớn) cho từng loại cây giúp việc rải cảnh (Foliage Painting) đa dạng hơn',
                'Sử dụng chung 1 bảng màu Color Palette Atlas chuẩn xác'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 64,
            polycount: '90 - 750 tris',
            rigged: 'No (Vertex Wind Animation Shader)',
            animated: 'Yes (Wind Shaking)',
            textures: '1x 4K Color Gradient Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-04-15',
            latestUpdate: '2026-09-10',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 1450,
            views: 10200,
            downloads: 710
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã phát hành bản cập nhật bổ sung Shader gió tối ưu cho URP 6.x',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 20: NEW RELEASE + LAUNCH EDITION + 35% DISCOUNT
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 20,
        slug: 'enchanted-magical-forest-biome',
        title: 'Enchanted Magical Forest Biome',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['magical', 'forest', 'fantasy', 'glow', 'mushrooms', 'biome'],

        flags: {
            isExclusive: false,
            isLaunchEdition: true,
            isFeatured: true
        },

        pricing: {
            price: 22.75,
            originalPrice: 35.00,
            discount: 35,
            discountEndsIn: '4 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '80 glowing magical plants, giant crystal mushrooms, ancient roots, and bioluminescent spores.',
            fullDescription: [
                'Mang đến vẻ đẹp huyền ảo cho khu rừng ma thuật với hơn 80 loại thực vật phát sáng kỳ bí: nấm khổng lồ, dây leo phát quang, hoa đom đóm và rễ cây cổ thụ rêu phong.',
                'Tất cả các chi tiết phát sáng đều được cấu hình kênh Emission độc lập, đi kèm hiệu ứng hạt (Particle Systems) đom đóm bay lơ lửng tạo chiều sâu tuyệt vời cho bối cảnh ban đêm.'
            ],
            features: [
                '80 mô hình thực vật kỳ ảo: Cây linh hồn, Nấm phát sáng, Hoa đom đóm & Rễ cây cổ thụ',
                'Hệ thống Particle System đom đóm và bào tử phát sáng đi kèm sẵn trong Prefab',
                'Shader tùy chỉnh độ rực sáng (Emission Intensity) theo thời gian thực trong ngày'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 82,
            polycount: '110 - 980 tris',
            rigged: 'No',
            animated: 'Yes (Bioluminescent Pulse & Spores)',
            textures: '4K Albedo + 4K Magic Emission Map',
            renderPipeline: 'Unity URP 6.3+'
        },

        dates: {
            initialRelease: '2026-10-26',
            latestUpdate: '2026-11-02',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 540,
            views: 3910,
            downloads: 215
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 21: STANDARD PACK + MILD DISCOUNT (15%) + ROADMAP (CURRENT - 85%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 21,
        slug: 'tropical-palm-jungle-foliage',
        title: 'Tropical Palm & Jungle Foliage',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['tropical', 'palm', 'jungle', 'summer', 'plants', 'leaves'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 21.25,
            originalPrice: 25.00,
            discount: 15,
            discountEndsIn: '9 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '50 stylized tropical palms, banana trees, ferns, and jungle bushes for summer island maps.',
            fullDescription: [
                'Hoàn thiện bối cảnh nhiệt đới cho các hòn đảo và khu rừng rậm với 50 mẫu dừa, cọ, dương xỉ và bụi rậm đặc trưng.',
                'Tán lá cọ được thiết kế phân tầng tối ưu hóa số lượng đa giác (Polygon) nhưng vẫn đảm bảo độ cong mềm mại tự nhiên khi có gió thổi.'
            ],
            features: [
                '50 mô hình thực vật nhiệt đới: Cây dừa cao, Cọ lùn, Dương xỉ khổng lồ & Dây leo rừng',
                'Tương thích hoàn hảo với gói Stylized Island Mega Pack',
                'Hỗ trợ uốn cong lá theo hướng gió nhiệt đới mạnh'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 50,
            polycount: '150 - 850 tris',
            rigged: 'No (Vertex Palm Wind Shader)',
            animated: 'Yes (Tropical Breeze)',
            textures: '1x 4K Vibrant Jungle Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-06-12',
            latestUpdate: '2026-10-05',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 620,
            views: 4780,
            downloads: 290
        },

        roadmap: {
            status: 'current',
            progress: 85,
            note: 'Đang tinh chỉnh lại Shader uốn cong thân cây cọ khi chịu gió lớn',
            estimatedDelivery: 'Giữa tháng 11/2026'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 22: STANDARD PACK (NO DISCOUNT)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 22,
        slug: 'autumn-cherry-blossom-trees',
        title: 'Autumn & Cherry Blossom Trees',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['autumn', 'sakura', 'cherry-blossom', 'seasonal', 'trees', 'pink'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 24.00,
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
            shortDescription: '45 seasonal trees featuring pink sakura cherry blossoms and warm orange-red autumn maples.',
            fullDescription: [
                'Mang màu sắc theo mùa vào tựa game của bạn với 45 mẫu cây hoa anh đào hồng rực rỡ và cây phong lá đỏ, lá vàng đặc trưng của mùa thu.',
                'Đi kèm hiệu ứng hạt cánh hoa rơi (Falling Petals) và lá rụng tạo cảm giác thơ mộng, thư giãn.'
            ],
            features: [
                '45 mẫu cây mùa thu và mùa xuân: Phong đỏ, Bạch quả vàng, Hoa anh đào & Cây bụi rụng lá',
                'Tặng kèm Particle System hiệu ứng cánh hoa anh đào bay và lá phong rơi',
                'Dễ dàng thay đổi màu sắc tán lá qua Color Tint chung của Material'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 45,
            polycount: '120 - 900 tris',
            rigged: 'No',
            animated: 'Yes (Wind & Falling Leaves)',
            textures: '1x 4K Seasonal Palette Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-07-08',
            latestUpdate: '2026-08-25',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 510,
            views: 3950,
            downloads: 220
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 23: 100% FREE ASSET (DIRECT DOWNLOAD) + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 23,
        slug: 'lowpoly-grass-rock-patches-free',
        title: 'Lowpoly Grass & Rock Patches',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['free', 'grass', 'rocks', 'ground', 'terrain', 'starter'],

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
            url: '/downloads/cmg-lowpoly-grass-rocks-free.zip',
            fileSize: '15.2 MB',
            format: '.fbx, .unitypackage, .blend',
            license: 'CC0 - Commercial & Personal Use',
            version: '1.1.0'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: 'Free starter pack of 25 stylized grass tufts, flower patches, and mossy rock formations.',
            fullDescription: [
                'Gói tài nguyên mặt đất miễn phí 100% bao gồm các khóm cỏ, cụm hoa dại nhiều màu sắc và các tảng đá rêu phong giúp làm phong phú thêm phần chân nền địa hình (Terrain Details).',
                'Tương thích hoàn hảo với công cụ rải cỏ tự động (Terrain Detail Painter) của Unity.'
            ],
            features: [
                '25 mô hình nền: 10 khóm cỏ thấp, 8 cụm hoa dại & 7 tảng đá rêu phong',
                'Tối ưu hóa đa giác cực thấp, thích hợp làm grass mesh số lượng lớn',
                'Miễn phí hoàn toàn cho mọi dự án game'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 25,
            polycount: '15 - 180 tris',
            rigged: 'No',
            animated: 'Yes (Grass Vertex Bending)',
            textures: '1x 4K Color Atlas (.png)',
            renderPipeline: 'All Pipelines'
        },

        dates: {
            initialRelease: '2026-04-10',
            latestUpdate: '2026-09-18',
            availableIn: ''
        },

        links: {
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 1890,
            views: 14200,
            downloads: 6400
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã bổ sung thêm 10 mẫu hoa dại nhiều màu trong bản v1.1',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 24: COMING SOON + ROADMAP (NEXT - 50%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 24,
        slug: 'winter-pine-snowy-peak-forest',
        title: 'Winter Pine & Snowy Peak Forest',
        categoryId: 'nature',
        publisher: 'Cute Magic',
        tags: ['winter', 'snow', 'pine', 'mountain', 'forest', 'upcoming'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: false
        },

        pricing: {
            price: 32.00,
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
            shortDescription: '55 snow-covered pine trees, frozen rocks, icicles, and winter mountain terrain props.',
            fullDescription: [
                'Khu rừng mùa đông phủ đầy tuyết trắng với 55 mẫu cây thông tuyết, mỏm đá đóng băng và nhũ băng sắc nhọn, mang lại cảm giác giá lạnh nhưng vô cùng ấm áp theo phong cách nghệ thuật Clay Toy.',
                'Tích hợp công nghệ Triplanar Snow Shader giúp phủ lớp tuyết tự động lên mặt trên của mọi vật thể mà không cần chỉnh sửa UV thủ công.'
            ],
            features: [
                '55 mô hình mùa đông: Thông phủ tuyết trắng, Cây khô đóng băng, Đá tảng tuyết & Nhũ băng',
                'Tích hợp Triplanar Snow Shader tự động phủ tuyết bề mặt theo chiều thẳng đứng',
                'Tặng kèm hiệu ứng hạt tuyết rơi (Snowfall Particle System)'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 55,
            polycount: '100 - 920 tris',
            rigged: 'No',
            animated: 'Yes (Snow Wind Bending)',
            textures: '4K Albedo + 4K Snow Mask',
            renderPipeline: 'Unity URP 6.3+'
        },

        dates: {
            initialRelease: '2026-12-05',
            latestUpdate: '2026-12-05',
            availableIn: '4 tuần nữa'
        },

        links: {},

        metrics: {
            likes: 380,
            views: 1720,
            downloads: 0
        },

        roadmap: {
            status: 'next',
            progress: 50,
            note: 'Đang hoàn thiện cơ chế Triplanar Snow Shader tự động phủ tuyết',
            estimatedDelivery: 'Đầu tháng 12/2026'
        }
    })
]