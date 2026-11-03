import { CategoryModel } from '../models/CategoryModel'

export const categoriesData = [
    new CategoryModel({ id: 'all', slug: 'all', name: 'All' }), // Hệ thống mặc định
    new CategoryModel({ id: 'characters', slug: 'characters', name: 'Characters' }),
    new CategoryModel({ id: 'environment', slug: 'environment', name: 'Environment' }),
    new CategoryModel({ id: 'ui-kit', slug: 'ui-kit', name: 'UI Kit' }),
    new CategoryModel({ id: 'templates', slug: 'templates', name: 'Templates' }),
    new CategoryModel({ id: 'vfx', slug: 'vfx', name: 'VFX & Particles' })
]