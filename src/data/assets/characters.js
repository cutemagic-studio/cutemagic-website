import { AssetModel } from '../../models/AssetModel'
import dummyThumb from '../../assets/asset_gallery/thumb.webp'

import dummyGallery01 from '../../assets/asset_gallery/sub_thumb_01.webp'
import dummyGallery02 from '../../assets/asset_gallery/sub_thumb_02.webp'
import dummyGallery03 from '../../assets/asset_gallery/sub_thumb_03.webp'
import dummyGallery04 from '../../assets/asset_gallery/sub_thumb_04.webp'
import dummyGallery05 from '../../assets/asset_gallery/sub_thumb_05.webp'
import dummyGallery06 from '../../assets/asset_gallery/sub_thumb_06.webp'

const mediaBase = { 
    cover: dummyThumb, 
    gallery: [dummyGallery01, dummyGallery02, dummyGallery03, dummyGallery04, dummyGallery05, dummyGallery06] 
}

export const characterAssets = [
    new AssetModel({
        id: 1, slug: 'stylized-funny-male-character', title: 'Stylized Funny Male Character',
        categoryId: 'characters', price: 0, packCount: 1, modelCount: 12,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase, badges: ['HOT', 'NEW'],
        isExclusive: true,
        download: {
            url: 'https://cutemagic-studio.github.io/cutemagic-website/favicon.svg',
            fileSize: '45.2 MB',
            format: '.unitypackage',
            license: 'CC0 (Public Domain)'
        },
        links: {
            unity: 'http',
            itch: 'http',
            fab: 'http',
            cgtrader: 'http',
            unreal: 'http'
        },
        shortDescription: 'A stylized goofy male character with three looks: underwear, relaxed outfit, and business suit.',
        features: ['**1 Stylized Male Character**', '**Three Looks**', '**Rigged Face**'],
        techSpecs: { rigged: 'Yes', animated: 'Yes', polycount: '12,000 Tris' }
    }),
    new AssetModel({
        id: 2, slug: 'cute-magic-cube-animals', title: 'Cute Magic – Cube Animals',
        categoryId: 'characters', price: 19.99, packCount: 1, modelCount: 50,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase, badges: ['-20%'],
        links: {
            unity: 'http',
            itch: 'http',
            fab: 'http',
            cgtrader: 'http',
            unreal: 'http'
        },
        shortDescription: '50 adorable cube-shaped animal characters with custom URP mobile shaders.',
        features: ['**50 Cute Animals**', '**Single-texture atlas**'],
        techSpecs: { rigged: 'Yes', animated: 'Yes', polycount: '1,000 Tris' }
    }),
    new AssetModel({
        id: 3, slug: 'fantasy-rpg-knights', title: 'Fantasy RPG Knights',
        categoryId: 'characters', price: 35.00, packCount: 2, modelCount: 8,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase,
        links: {
            unity: 'http',
            itch: 'http',
            fab: 'http',
            cgtrader: 'http',
            unreal: 'http'
        },
        shortDescription: 'Modular knight characters with interchangeable armors and weapons for RPG games.',
        features: ['**Modular Armors**', '**Epic Weapons**', '**Mixamo Ready**'],
        techSpecs: { rigged: 'Yes', animated: 'No', polycount: '15,000 Tris' }
    }),
    new AssetModel({
        id: 4, slug: 'sci-fi-cyberpunk-mercs', title: 'Sci-Fi Cyberpunk Mercenaries',
        categoryId: 'characters', price: 45.00, packCount: 1, modelCount: 5,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase,
        links: {
            unity: 'http',
            itch: 'http',
            fab: 'http',
            cgtrader: 'http',
            unreal: 'http'
        },
        shortDescription: 'Highly detailed cyberpunk mercenaries with glowing LED parts and modular gear.',
        features: ['**5 Unique Mercs**', '**LED Emissive Maps**'],
        techSpecs: { rigged: 'Yes', animated: 'Yes', polycount: '25,000 Tris' }
    }),
    new AssetModel({
        id: 5, slug: 'stylized-zombie-horde', title: 'Stylized Zombie Horde',
        categoryId: 'characters', price: 25.00, packCount: 3, modelCount: 15,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase, badges: ['TRENDING'],
        links: {
            unity: 'http',
            itch: 'http',
            fab: 'http',
            cgtrader: 'http',
            unreal: 'http'
        },
        shortDescription: 'A horde of low-poly zombies perfect for survival and wave-defense games.',
        features: ['**15 Zombie Variations**', '**Dismemberment Ready**'],
        techSpecs: { rigged: 'Yes', animated: 'Yes', polycount: '5,000 Tris' }
    })
]