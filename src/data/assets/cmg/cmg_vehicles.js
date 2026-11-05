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
// DỮ LIỆU MẪU: DANH MỤC 5 - VEHICLES, MECHS & MOUNTS (PACK 25 -> 30)
// =========================================================================
export const mockVehicleAssets = [
    // ---------------------------------------------------------------------
    // PACK 25: TOP RATED + EXCLUSIVE + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 25,
        slug: 'stylized-skyships-steampunk-airships',
        title: 'Stylized Skyships & Steampunk Airships',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['vehicles', 'airship', 'skyship', 'steampunk', 'boats', 'flying'],

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
            shortDescription: '15 modular flying airships, pirate galleons, and hot air balloons for floating island worlds.',
            fullDescription: [
                'Bộ sưu tập 15 khinh khí cầu, tàu bay Steampunk và thuyền buồm lơ lửng được thiết kế đồng bộ tuyệt đối với hệ sinh thái đảo bay Grand Archipelago.',
                'Toàn bộ cánh quạt động cơ, bánh lái, mỏ neo và cánh buồm đều được tách rời Mesh kèm thiết lập trục xoay (Pivot Point) chính xác tại tâm, sẵn sàng kết nối với C# Controller.'
            ],
            features: [
                '15 mẫu phương tiện trên không: Tàu chiến Steampunk, Thuyền buồm bay, Khinh khí cầu & Tàu thương nhân',
                'Hơn 40 bộ phận nâng cấp rời: Động cơ phản lực, Cánh quạt đồng, Đại bác, Cánh buồm & Mỏ neo',
                'Đã thiết lập sẵn Custom Properties và phân cấp Parent-Child chuẩn cho hoạt ảnh xoay cánh quạt',
                'Bề mặt Matte Clay kết hợp chi tiết kim loại đồng (Brass) ấm áp'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 55,
            polycount: '1,200 - 4,200 tris / ship',
            rigged: 'No (Separated Propellers & Rudder Pivots)',
            animated: 'Yes (Spinning Propellers & Sails)',
            textures: '1x 4K Master Color Atlas (.png)',
            renderPipeline: 'Unity URP & Blender 5'
        },

        dates: {
            initialRelease: '2026-06-25',
            latestUpdate: '2026-10-19',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 1120,
            views: 8340,
            downloads: 465
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã bổ sung thêm 3 mẫu thuyền buồm cỡ nhỏ và hiệu ứng khói ống xả',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 26: NEW RELEASE + LAUNCH EDITION + 40% DISCOUNT
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 26,
        slug: 'sci-fi-mechs-cyber-tanks',
        title: 'Sci-Fi Mechs & Cyber-Tanks',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['mechs', 'tanks', 'scifi', 'robots', 'vehicles', 'hard-surface'],

        flags: {
            isExclusive: false,
            isLaunchEdition: true,
            isFeatured: true
        },

        pricing: {
            price: 27.00,
            originalPrice: 45.00,
            discount: 40,
            discountEndsIn: '5 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '12 customizable bipedal battle mechs, hover-tanks, and combat drones with hard-surface topology.',
            fullDescription: [
                'Dàn khí tài quân sự tương lai gồm 12 cỗ máy chiến đấu রোবট (Bipedal Mechs), xe tăng đệm từ (Hover-tanks) và Drone hộ tống được dựng hình theo kỹ thuật Hard-Surface Modeling chuẩn mực.',
                'Khớp hông xoay 360 độ và ngàm gắn vũ khí đôi cho phép người chơi tự do lắp ráp (Custom Loadout) giữa pháo Laser, bệ phóng tên lửa và súng máy hạng nặng.'
            ],
            features: [
                '6 Robot chiến đấu hai chân (Mechs), 4 Xe tăng tương lai & 2 Drone chiến thuật',
                '16 loại vũ khí hạng nặng tháo lắp linh hoạt qua hệ thống Socket',
                'Cấu trúc lưới Quad Topology sạch sẽ, vát cạnh (Bevel) bắt sáng sắc nét',
                'Tích hợp kênh Emission đổi màu đèn giáp theo phe phái'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 28,
            polycount: '2,200 - 3,800 tris',
            rigged: 'Yes (Custom Mech Armature)',
            animated: 'Yes (Walk, Strafe, Shoot, Destroyed)',
            textures: '4K Albedo + 4K Neon Emission',
            renderPipeline: 'Unity URP 6.3+ & FBX'
        },

        dates: {
            initialRelease: '2026-10-29',
            latestUpdate: '2026-11-04',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 640,
            views: 4510,
            downloads: 235
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 27: BEST-SELLER + MILD DISCOUNT (20%) + ROADMAP (CURRENT - 80%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 27,
        slug: 'cute-kart-racing-arcade-cars',
        title: 'Cute Kart Racing & Arcade Cars',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['kart', 'racing', 'cars', 'arcade', 'vehicles', 'casual'],

        flags: {
            isExclusive: true,
            isLaunchEdition: false,
            isFeatured: false
        },

        pricing: {
            price: 24.00,
            originalPrice: 30.00,
            discount: 20,
            discountEndsIn: '6 days'
        },

        media: {
            cover: mediaBase.cover,
            gallery: mediaBase.gallery,
            videoUrl: ''
        },

        content: {
            shortDescription: '20 colorful stylized go-karts, monster trucks, and racing item-box power-ups.',
            fullDescription: [
                'Khởi tạo ngay tựa game đua xe vui nhộn kiểu Arcade Kart Racing với 20 mẫu xe đua đủ phong cách: từ xe Go-kart cổ điển, xe thể thao mui trần, xe kem cho đến xe bọ cánh cứng.',
                'Bốn bánh xe và vô lăng đã được tách riêng và đặt trục chuẩn để tích hợp tức thì với Unity WheelCollider.'
            ],
            features: [
                '20 mẫu xe đua Kart ngộ nghĩnh với kích thước vừa vặn cho các nhân vật Chibi & Cube Animals',
                '30 phụ kiện độ xe: Bộ lốp địa hình, Ống xả lửa Nitro, Cánh gió sau & Đèn pha',
                'Đi kèm 10 vật phẩm đua xe (Item Boxes, Tên lửa, Vỏ chuối, Khiên bảo vệ, Tiền vàng)',
                'Hỗ trợ đổi màu sơn xe nhanh chóng qua Texture Atlas phân vùng'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 60,
            polycount: '800 - 1,650 tris / kart',
            rigged: 'No (WheelCollider Ready Pivots)',
            animated: 'No',
            textures: '1x 4K Racing Palette Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-07-19',
            latestUpdate: '2026-10-14',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 790,
            views: 6120,
            downloads: 390
        },

        roadmap: {
            status: 'current',
            progress: 80,
            note: 'Đang hoàn thiện thêm 8 bộ cánh lượn (Glider Wings) khi xe bay qua dốc cao',
            estimatedDelivery: 'Cuối tháng 11/2026'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 28: STANDARD PACK (NO DISCOUNT)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 28,
        slug: 'fantasy-mounts-war-chariots',
        title: 'Fantasy Mounts & War Chariots',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['mounts', 'horses', 'chariots', 'wagons', 'fantasy', 'rpg'],

        flags: {
            isExclusive: false,
            isLaunchEdition: false,
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
            shortDescription: '10 armored fantasy steeds, merchant caravans, and royal carriages for RPG worlds.',
            fullDescription: [
                'Gói phương tiện di chuyển và thú cưỡi thời Trung Cổ dành cho các tựa game Fantasy RPG: bao gồm chiến mã mặc giáp, sói khổng lồ, xe ngựa hoàng gia, xe hàng thương nhân và chiến xa.',
                'Đi kèm điểm neo (Mount Seat Bone) chuẩn xác trên yên cưỡi để nhân vật Hiệp sĩ ngồi khớp vị trí tự động.'
            ],
            features: [
                '6 Thú cưỡi (Ngựa chiến, Kỳ lân, Sói băng, Gấu giáp sắt, Đà điểu, Lợn rừng)',
                '8 Phương tiện kéo: Xe ngựa Hoàng gia, Xe lồng sắt, Xe hàng thương nhân & Chiến xa',
                'Yên cưỡi và giáp ngựa có thể bật/tắt tùy theo cấp độ nâng cấp của người chơi'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 14,
            polycount: '1,400 - 2,600 tris',
            rigged: 'Yes (Quadruped Rig + Wagon Wheels)',
            animated: 'Yes (Gallop, Trot, Idle, Jump)',
            textures: '1x 4K Fantasy Color Atlas',
            renderPipeline: 'Unity URP & Built-in'
        },

        dates: {
            initialRelease: '2026-08-02',
            latestUpdate: '2026-09-15',
            availableIn: ''
        },

        links: {
            unity: 'https://assetstore.unity.com/',
            fab: 'https://www.fab.com/',
            cgtrader: 'https://www.cgtrader.com/'
        },

        metrics: {
            likes: 460,
            views: 3680,
            downloads: 190
        },

        roadmap: {
            status: null,
            progress: 0,
            note: '',
            estimatedDelivery: ''
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 29: 100% FREE ASSET (DIRECT DOWNLOAD) + ROADMAP (PREV)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 29,
        slug: 'lowpoly-city-cars-delivery-starter-free',
        title: 'Lowpoly City Cars & Delivery Starter',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['free', 'cars', 'city', 'delivery', 'vehicles', 'starter'],

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
            url: '/downloads/cmg-city-cars-starter-free.zip',
            fileSize: '21.5 MB',
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
            shortDescription: 'Free pack of 10 stylized city vehicles: taxi, police car, ambulance, food truck, and scooters.',
            fullDescription: [
                'Bộ sưu tập 10 phương tiện giao thông đô thị miễn phí 100% với đường nét bo tròn đáng yêu, phù hợp làm xe cộ di chuyển trên đường phố hoặc làm phương tiện chính cho game giao hàng (Delivery Sim).',
                'Toàn bộ bánh xe và cánh cửa đều được tách rời hoàn chỉnh để lập trình viên thử nghiệm vật lý xe.'
            ],
            features: [
                '10 phương tiện đô thị: Xe Sedan, Taxi, Xe Cảnh sát, Xe Cứu thương, Xe Cứu hỏa, Xe tải giao hàng, Xe bán kem & Xe tay ga',
                'Đã tách rời 4 bánh xe cho từng model kèm tâm xoay chuẩn xác',
                'Miễn phí 100% cho cả dự án cá nhân và thương mại'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 10,
            polycount: '450 - 950 tris',
            rigged: 'No (Separated Wheels & Doors)',
            animated: 'No',
            textures: '1x 4K Color Atlas (.png)',
            renderPipeline: 'All Pipelines'
        },

        dates: {
            initialRelease: '2026-04-28',
            latestUpdate: '2026-09-25',
            availableIn: ''
        },

        links: {
            itch: 'https://itch.io/'
        },

        metrics: {
            likes: 1750,
            views: 13100,
            downloads: 5640
        },

        roadmap: {
            status: 'prev',
            progress: 100,
            note: 'Đã tách rời toàn bộ bánh xe và cửa xe trong bản cập nhật v1.1',
            estimatedDelivery: 'Đã hoàn thành'
        }
    }),

    // ---------------------------------------------------------------------
    // PACK 30: COMING SOON + ROADMAP (NEXT - 40%)
    // ---------------------------------------------------------------------
    new CmgAssetModel({
        id: 30,
        slug: 'galactic-starfighters-space-fleet',
        title: 'Galactic Starfighters & Space Fleet',
        categoryId: 'vehicles',
        publisher: 'Cute Magic',
        tags: ['spaceship', 'starfighter', 'scifi', 'space', 'vehicles', 'upcoming'],

        flags: {
            isExclusive: true,
            isLaunchEdition: true,
            isFeatured: false
        },

        pricing: {
            price: 48.00,
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
            shortDescription: '18 modular space fighters, cargo cruisers, and a giant mothership with thruster VFX.',
            fullDescription: [
                'Hạm đội tàu chiến không gian gồm 18 mẫu phi thuyền từ tiêm kích đánh chặn cỡ nhỏ, tàu vận tải liên hành tinh cho đến Tàu Mẹ (Mothership) khổng lồ.',
                'Mọi cánh tàu, buồng lái, động cơ phản lực và tháp pháo Laser đều có thể hoán đổi cho nhau để tạo ra hàng trăm biến thể phi thuyền độc nhất.'
            ],
            features: [
                '18 mẫu phi thuyền không gian chia theo 3 phe phái với ngôn ngữ thiết kế riêng biệt',
                'Hệ thống lắp ghép Modular: Thân tàu, Cánh chính, Động cơ đẩy & Vũ khí Laser',
                'Tặng kèm Particle VFX tia lửa động cơ phản lực và đạn Plasma'
            ]
        },

        techSpecs: {
            packCount: 1,
            modelCount: 42,
            polycount: '900 - 4,500 tris',
            rigged: 'No (Landing Gear & Wing Fold Pivots)',
            animated: 'Yes (Landing Gear & Thruster Glow)',
            textures: '4K Albedo + 4K Thruster Emission',
            renderPipeline: 'Unity URP 6.3+'
        },

        dates: {
            initialRelease: '2026-12-15',
            latestUpdate: '2026-12-15',
            availableIn: '5 tuần nữa'
        },

        links: {},

        metrics: {
            likes: 295,
            views: 1420,
            downloads: 0
        },

        roadmap: {
            status: 'next',
            progress: 40,
            note: 'Đang dựng mô hình Tàu Mẹ (Mothership) và hiệu ứng tia lửa phản lực',
            estimatedDelivery: 'Giữa tháng 12/2026'
        }
    })
]