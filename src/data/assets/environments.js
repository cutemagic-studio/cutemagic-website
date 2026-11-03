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

export const environmentAssets = [
    new AssetModel({
        id: 6, slug: 'stylized-lowpoly-tree-pack', title: 'Stylized Lowpoly Tree Pack',
        categoryId: 'environment', price: 0, packCount: 3, modelCount: 150,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
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
        
        shortDescription: 'Complete collection of stylized trees, foliage, and modular dioramas.',
        features: ['**150+ Foliage Models**', '**URP/HDRP Ready**'],
        techSpecs: { rigged: 'No', animated: 'No', polycount: '500 Tris avg' }
    }),
    new AssetModel({
        id: 7, slug: 'grand-archipelago-dioramas', title: 'Grand Archipelago',
        categoryId: 'environment', price: 49.99, packCount: 5, modelCount: 320,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
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
        shortDescription: 'Modular floating island dioramas featuring smooth matte clay-like finishes.',
        features: ['**Floating Islands**', '**Clay-like shading**'],
        techSpecs: { rigged: 'No', animated: 'No', polycount: 'Various' }
    }),
    new AssetModel({
        id: 8, slug: 'low-poly-apartment', title: 'Low Poly Apartment Interior',
        categoryId: 'environment', price: 39.99, packCount: 4, modelCount: 879,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
        media: mediaBase, badges: ['BEST SELLER'],
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
        shortDescription: 'Build modern apartments with over 800 ready-to-use prefabs.',
        features: ['**879 Prefabs**', '**Modular Walls**'],
        techSpecs: { rigged: 'No', animated: 'No', polycount: 'Lowpoly' }
    }),
    new AssetModel({
        id: 9, slug: 'stylized-desert-oasis', title: 'Stylized Desert Oasis',
        categoryId: 'environment', price: 24.99, packCount: 2, modelCount: 120,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
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
        shortDescription: 'Sand dunes, palm trees, ruins, and props to build a beautiful desert.',
        features: ['**Modular Ruins**', '**Stylized Cacti**'],
        techSpecs: { rigged: 'No', animated: 'No', polycount: 'Lowpoly' }
    }),
    new AssetModel({
        id: 10, slug: 'spooky-graveyard-pack', title: 'Spooky Graveyard Pack',
        categoryId: 'environment', price: 15.99, packCount: 1, modelCount: 85,
        initialReleaseDate: '2025-05-12',
        latestReleaseDate: '2026-11-01',
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
        shortDescription: 'Tombstones, dead trees, and spooky fences for Halloween-themed levels.',
        features: ['**Tombstones & Gates**', '**Fog Particles included**'],
        techSpecs: { rigged: 'No', animated: 'No', polycount: 'Lowpoly' }
    })
]