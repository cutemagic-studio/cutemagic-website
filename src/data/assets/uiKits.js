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

export const uiKitAssets = [
    new AssetModel({
        id: 11, slug: 'clean-minimalist-ui', title: 'Clean Minimalist UI Kit',
        categoryId: 'ui-kit', price: 29.99, packCount: 1, modelCount: 300, releaseDate: '2026-11-05',
        media: mediaBase, badges: ['NEW'],
        isExclusive: false,
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
        shortDescription: 'A versatile, clean UI kit perfect for modern mobile apps and simulation games.',
        techSpecs: { rigged: 'N/A', animated: 'Yes (UI Tweens)', polycount: '2D Sprites' }
    }),
    new AssetModel({
        id: 12, slug: 'fantasy-rpg-menu', title: 'Fantasy RPG Menu System',
        categoryId: 'ui-kit', price: 34.99, packCount: 1, modelCount: 250, releaseDate: '2026-04-15',
        media: mediaBase,
        isExclusive: false,
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
        shortDescription: 'Wood and iron themed UI elements for inventory, skill trees, and quests.',
        techSpecs: { rigged: 'N/A', animated: 'No', polycount: '2D Sprites' }
    }),
    new AssetModel({
        id: 13, slug: 'sci-fi-hud-interface', title: 'Sci-Fi HUD Interface',
        categoryId: 'ui-kit', price: 39.99, packCount: 2, modelCount: 400, releaseDate: '2026-08-10',
        media: mediaBase, badges: ['HOT'],
        isExclusive: false,
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
        shortDescription: 'Futuristic holograms, crosshairs, and sci-fi data panels for shooters.',
        techSpecs: { rigged: 'N/A', animated: 'Yes', polycount: '2D/3D Hybrid' }
    })
]