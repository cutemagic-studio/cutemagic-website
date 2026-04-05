<template>
    <button :class="[
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg active:scale-95',
        // Variants
        variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200' : '',
        variant === 'outline' ? 'border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600' : '',
        variant === 'ghost' ? 'text-gray-600 hover:bg-gray-100' : '',
        // Sizes
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-6 py-3 text-base'
    ]">
        <slot>{{ label }}</slot>
    </button>
</template>

<script setup>
defineProps({
    label: { type: String, default: 'Button' },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'outline', 'ghost'].includes(value)
    },
    size: { type: String, default: 'md' }
})
</script>