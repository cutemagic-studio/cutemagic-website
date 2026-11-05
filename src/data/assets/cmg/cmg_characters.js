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
// DỮ LIỆU MẪU: DANH MỤC 1 - CHARACTERS (PACK 1 -> 6)
// =========================================================================
export const mockCharacterAssets = [
    // ---------------------------------------------------------------------
    // PACK 1: TOP RATED + EXCLUSIVE + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 1,
        slug: 'cute-magic-cube-animals',
        title: 'Cute Magic – Cube Animals',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['animals', 'cube', 'pets', 'mobile', 'stylized', 'urp'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: true
        },

        pricing: {
            price: 25.00,
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
            shortDescription: '50 adorable cube-shaped animal characters with custom URP mobile shaders.',
            fullDescription: [
                'Bộ sưu tập 50 loài động vật hình khối vuông vắn, đáng yêu được thiết kế chuyên biệt cho các tựa game Casual, Nông trại và Pet Simulator trên nền tảng di động.',
                'Toàn bộ mô hình sử dụng chung một Texture Atlas 4K duy nhất giúp giảm thiểu Draw Calls tối đa, đi kèm hệ thống xương (Rig) đồng nhất để dùng chung kho Animation.'
            ],
            features: [
                '50 mẫu động vật đa dạng: Thú cưng, Gia súc, Động vật hoang dã & Thần thoại',
                'Tối ưu hóa hoàn hảo với chỉ 1 Material & 1 Color Texture Atlas (4096x4096)',
                'Bao gồm 12 Animation cơ bản: Idle, Walk, Run, Jump, Eat, Sleep, Happy, Hit',
                'Tích hợp sẵn Custom Toon/Clay Shader cho Unity URP'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 50,
            polycount: '350 - 620 tris / model',
            rigged: 'Yes (Generic Rig)',
            animated: 'Yes (12 Loops)',
            textures: '1x 4K Color Atlas (.png)',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-05-10',
            latestUpdate: '2026-10-15',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 842,
            views: 6420,
            downloads: 415
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã cập nhật thêm 10 thú biển trong bản v1.2',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 2: NEW RELEASE + LAUNCH EDITION + 50% DISCOUNT
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 2,
        slug: 'stylized-zombie-horde',
        title: 'Stylized Zombie Horde',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['zombie', 'survival', 'halloween', 'undead', 'lowpoly'],

        flags: {
            isExclusive: false,
            isLaunchEdition: true,
            isFeatured: true
        },

        pricing: {
            price: 25.00,
            originalPrice: 50.00,
            discount: 50,
            discountEndsIn: '4 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '15 quirky low-poly zombie characters with modular limbs and survival props.',
            fullDescription: [
                'Mang đến làn gió vui nhộn cho thể loại game sinh tồn Zombie với 15 nhân vật xác sống phong cách Stylized Art Toy độc đáo, màu sắc bắt mắt nhưng không kém phần ma mị.',
                'Hệ thống chi (tay, chân, đầu) của quái vật được tách rời linh hoạt, cho phép lập trình viên dễ dàng tạo hiệu ứng rơi rụng bộ phận khi nhận sát thương trong combat.'
            ],
            features: [
                '15 nhân vật Zombie đa nghề nghiệp: Cảnh sát, Đầu bếp, Bác sĩ, Cầu thủ...',
                'Hỗ trợ tách rời tay và chân quái vật (Modular Monster Limbs) cho hiệu ứng vật lý Ragdoll',
                'Tương thích hoàn toàn với hệ thống Mixamo Humanoid Rig',
                'Tặng kèm 10 vũ khí cận chiến sinh tồn gắn sẵn vào xương bàn tay'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 15,
            polycount: '1,200 - 1,850 tris',
            rigged: 'Yes (Humanoid)',
            animated: 'Yes (8 Zombie Walks & Attacks)',
            textures: '2x 4K Matte Clay Atlas',
            renderPipeline: 'Unity URP 6.3+ & FBX'
        },

        dates: {
            initialRelease: '2026-10-28',
            latestUpdate: '2026-11-02',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 530,
            views: 3890,
            downloads: 210
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 3: PREMIUM HIGH-TICKET PACK + TOP VIEWS
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 3,
        slug: 'sci-fi-cyberpunk-mercenaries',
        title: 'Sci-Fi Cyberpunk Mercenaries',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['scifi', 'cyberpunk', 'shooter', 'heroes', 'futuristic'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: true
        },

        pricing: {
            price: 45.00,
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
            shortDescription: '5 elite futuristic cyber-mercenaries with glowing neon accents and sci-fi weaponry.',
            fullDescription: [
                'Đội hình 5 lính đánh thuê tương lai được chăm chút kỹ lưỡng về Topology và các góc vát (Bevel) mượt mà, kết hợp hoàn hảo giữa bề mặt Matte Clay và chi tiết phát sáng Emission.',
                'Phù hợp cho các dự án game Top-down Shooter, Action RPG hoặc MOBA trên cả PC lẫn Mobile.'
            ],
            features: [
                '5 Class nhân vật chuyên biệt: Striker, Hacker, Heavy Gunner, Ninja, Medic',
                'Tích hợp Emission Map riêng biệt để tùy chỉnh màu đèn Neon theo phe phái (Team Color)',
                'Đi kèm 15 phụ kiện Cyberware và vũ khí Laser tháo lắp tự do',
                'Cấu trúc lưới (Quad Topology) cực sạch, tối ưu cho biến dạng xương mượt mà'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 5,
            polycount: '2,800 - 3,400 tris',
            rigged: 'Yes (Humanoid + Weapon Bones)',
            animated: 'No (Mixamo Ready)',
            textures: '4K Albedo + 4K Emission Map',
            renderPipeline: 'URP / HDRP / Blender 5'
        },

        dates: {
            initialRelease: '2026-08-12',
            latestUpdate: '2026-09-20',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            cgtrader: 'https://www.cgtrader.com/',
            artStation: 'https://www.artstation.com/'
        },

        metrics: {
            likes: 695,
            views: 5120,
            downloads: 184
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã bổ sung gói 5 vũ khí hạng nặng',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 4: STANDARD BEST-SELLER + MILD DISCOUNT (20%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 4,
        slug: 'fantasy-rpg-knights',
        title: 'Fantasy RPG Knights',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['fantasy', 'rpg', 'knights', 'medieval', 'warriors'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 35.00,
            originalPrice: 45.00,
            discount: 22,
            discountEndsIn: '7 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '8 valiant medieval knights and paladins with interchangeable helmets, shields, and swords.',
            fullDescription: [
                'Xây dựng quân đoàn hiệp sĩ thời Trung Cổ với 8 mẫu nhân vật mang phong cách Stylized đặc trưng: giáp trụ dày dặn, đường nét bo tròn khỏe khoắn và bảng màu tương phản cao.',
                'Mọi mũ giáp, khiên và kiếm đều được thiết kế theo chuẩn Pivot Point đồng bộ, sẵn sàng gắn vào nhân vật thông qua script chỉ với 1 dòng lệnh.'
            ],
            features: [
                '8 Hiệp sĩ Hoàng gia từ Lính canh, Kỵ sĩ đến Đại Paladin',
                '24 trang bị đi kèm: 8 Kiếm, 8 Khiên và 8 Mũ giáp có thể hoán đổi chéo',
                'Đã thiết lập sẵn Custom Properties và Prefab chuẩn cho Unity',
                'Bao gồm 3 cấp độ LOD (LOD0, LOD1, LOD2) cho các trận chiến đông quân'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 8,
            polycount: '1,600 - 2,200 tris (LOD0)',
            rigged: 'Yes (Humanoid)',
            animated: 'Yes (5 Combat Stances)',
            textures: '4K Color Palette Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-07-04',
            latestUpdate: '2026-08-19',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 412,
            views: 3250,
            downloads: 165
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 5: 100% FREE ASSET (DIRECT DOWNLOAD) + ROADMAP (CURRENT)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 5,
        slug: 'stylized-chibi-villagers-free',
        title: 'Chibi Villagers Starter Pack',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['free', 'chibi', 'villagers', 'npc', 'starter'],

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
            url: '/downloads/cmg-chibi-villagers-v1.zip',
            fileSize: '42.5 MB',
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
            shortDescription: 'Free starter pack of 6 cute chibi townsfolk NPCs to prototype your cozy village game.',
            fullDescription: [
                'Gói tài nguyên miễn phí 100% dành tặng cộng đồng Game Dev để bạn kiểm nghiệm chất lượng kỹ thuật (Topology, UV, Rigging và Shader) của Cute Magic trước khi quyết định đầu tư các gói lớn.',
                'Bao gồm 6 NPC dân làng đáng yêu, sẵn sàng thả vào các bối cảnh thị trấn hoặc nông trại.'
            ],
            features: [
                '6 NPC dân làng: Nông dân, Thợ rèn, Chủ quán trọ, Thương nhân, Thủy thủ, Trưởng làng',
                'Miễn phí hoàn toàn cho cả dự án cá nhân lẫn thương mại',
                'Đính kèm file gốc Blender 5 (.blend) và gói Unity URP cấu hình sẵn'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 6,
            polycount: '850 - 1,100 tris',
            rigged: 'Yes (Humanoid)',
            animated: 'Yes (Idle, Walk, Wave)',
            textures: '4K Color Atlas (.png)',
            renderPipeline: 'All Pipelines'
        },

        dates: {
            initialRelease: '2026-04-20',
            latestUpdate: '2026-10-01',
            availableIn: ''
        },

        links: {
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 1240,
            views: 9850,
            downloads: 3420
        },

        roadmap: {
            status: 'current',
            progress: 90,
            note: 'Đang hoàn thiện thêm 4 khuôn mặt biểu cảm (Blendshapes)',
            estimatedDelivery: 'Tuần sau'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 6: COMING SOON + ROADMAP (NEXT)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 6,
        slug: 'mythical-monster-companions',
        title: 'Mythical Monster Companions',
        categoryId: 'characters',
        publisher: 'Cute Magic',
        tags: ['monsters', 'dragons', 'fantasy', 'companions', 'upcoming'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: false
        },

        pricing: {
            price: 30.00,
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
            shortDescription: '20 elemental baby dragons, golems, and mythical beasts with evolution stages.',
            fullDescription: [
                'Bộ sưu tập 20 quái thú thần thoại theo 4 nguyên tố (Lửa, Nước, Tự nhiên, Bóng tối) được thiết kế theo 2 cấp độ tiến hóa.',
                'Đặc biệt chú trọng vào cấu trúc chi quái vật (Monster Limbs), cánh và đuôi với hệ thống xương phụ hỗ trợ Dynamic Bone mượt mà.'
            ],
            features: [
                '10 loài quái thú x 2 cấp độ tiến hóa (Tổng cộng 20 Models)',
                'Thiết kế tỉ mỉ phần vuốt, sừng và cánh theo phong cách Toy Clay',
                'Tặng kèm hiệu ứng Particle cơ bản cho từng hệ nguyên tố'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 20,
            polycount: '900 - 1,750 tris',
            rigged: 'Yes (Custom Creature Rig)',
            animated: 'Yes (Fly, Roar, Attack, Idle)',
            textures: '4K Gradient & Color Atlas',
            renderPipeline: 'Unity URP'
        },

        dates: {
            initialRelease: '2026-11-25',
            latestUpdate: '2026-11-25',
            availableIn: '3 tuần nữa'
        },

        links: {},

        metrics: {
            likes: 185,
            views: 940,
            downloads: 0
        },

        roadmap: {
            status: 'next',
            progress: 35,
            note: 'Đang Rigging hệ thống cánh rồng & tối ưu Topology',
            estimatedDelivery: 'Cuối tháng 11/2026'
        }
    })
]