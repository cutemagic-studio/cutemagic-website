<template>
    <span :class="[
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm',
        type === 'new' ? 'bg-green-100 text-green-700 border border-green-200' : '',
        type === 'free' ? 'bg-blue-100 text-blue-700 border border-blue-200' : '',
        type === 'hot' ? 'bg-red-100 text-red-700 border border-red-200' : '',
        type === 'pro' ? 'bg-amber-100 text-amber-700 border border-amber-200' : '',
    ]">
        {{ label }}
    </span>
</template>

<script setup>
defineProps({
    label: { type: String, required: true },
    type: {
        type: String,
        default: 'new',
        validator: (value) => ['new', 'free', 'hot', 'pro'].includes(value)
    }
})
</script>