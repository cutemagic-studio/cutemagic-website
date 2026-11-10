<!-- src/components/admin/tabs/asset_manager/components/RichTextEditor.vue -->
<template>
    <div class="border-2 border-[#8470FF] rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-blue-600 transition-colors">
        
        <!-- THANH CÔNG CỤ ĐỊNH DẠNG (TOOLBAR) -->
        <div class="px-3 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-1.5 select-none">
            
            <!-- Nhóm 1: Định dạng chữ cơ bản -->
            <button type="button" @mousedown.prevent="exec('bold')" title="In đậm (Ctrl+B)"
                class="w-7 h-7 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 font-black text-xs text-slate-800 flex items-center justify-center cursor-pointer">
                B
            </button>
            <button type="button" @mousedown.prevent="exec('italic')" title="In nghiêng (Ctrl+I)"
                class="w-7 h-7 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 italic font-serif font-bold text-xs text-slate-800 flex items-center justify-center cursor-pointer">
                I
            </button>
            <button type="button" @mousedown.prevent="exec('underline')" title="Gạch chân (Ctrl+U)"
                class="w-7 h-7 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 underline font-bold text-xs text-slate-800 flex items-center justify-center cursor-pointer">
                U
            </button>

            <div class="w-px h-4 bg-slate-300 mx-1"></div>

            <!-- Nhóm 2: Tiêu đề Mục (Giống Key Highlights:, Key Features:) & Danh sách Bullet -->
            <button type="button" @mousedown.prevent="insertSectionHeading" title="Tạo dòng Tiêu đề in đậm (VD: Key Highlights:)"
                class="px-2 h-7 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 font-black text-[11px] text-slate-800 flex items-center gap-1 cursor-pointer">
                <span>📌 Tiêu đề mục</span>
            </button>
            <button type="button" @mousedown.prevent="exec('insertUnorderedList')" title="Danh sách dấu chấm tròn (• Bullet List)"
                class="px-2 h-7 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 font-bold text-[11px] text-slate-800 flex items-center gap-1 cursor-pointer">
                <span>• Danh sách</span>
            </button>

            <div class="w-px h-4 bg-slate-300 mx-1"></div>

            <!-- Nhóm 3: Tô màu nền Highlight (Làm nổi bật từ khóa) -->
            <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-300">
                <span class="text-[10px] font-black uppercase text-slate-400 mr-1">🖍️ Nền:</span>
                <button v-for="hl in highlightColors" :key="hl.color" type="button"
                    @mousedown.prevent="applyHighlight(hl.color)"
                    :title="`Tô nền ${hl.name}`"
                    class="w-4 h-4 rounded-full border border-black/20 hover:scale-125 transition-transform cursor-pointer"
                    :style="{ backgroundColor: hl.color }">
                </button>
                <button type="button" @mousedown.prevent="applyHighlight('transparent')" title="Xóa màu nền"
                    class="w-4 h-4 rounded-full border border-slate-300 text-[9px] font-bold flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer">
                    ✕
                </button>
            </div>

            <!-- Nhóm 4: Màu chữ nổi bật -->
            <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-300">
                <span class="text-[10px] font-black uppercase text-slate-400 mr-1">A Chữ:</span>
                <button v-for="tc in textColors" :key="tc.color" type="button"
                    @mousedown.prevent="exec('foreColor', tc.color)"
                    :title="`Màu chữ ${tc.name}`"
                    class="w-4 h-4 rounded-full border border-black/20 hover:scale-125 transition-transform cursor-pointer"
                    :style="{ backgroundColor: tc.color }">
                </button>
            </div>

            <!-- Nút Xóa định dạng & Chuyển xem HTML -->
            <div class="ml-auto flex items-center gap-1.5">
                <button type="button" @mousedown.prevent="exec('removeFormat')" title="Xóa mọi định dạng vùng đang bôi đen"
                    class="px-2 h-7 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-300 text-[10px] font-black text-slate-600 cursor-pointer">
                    🧹 Xóa Format
                </button>
                <button type="button" @click="showRawHtml = !showRawHtml"
                    class="px-2 h-7 rounded-lg border text-[10px] font-mono font-black cursor-pointer transition-colors"
                    :class="showRawHtml ? 'bg-slate-900 text-[#ffe600] border-slate-900' : 'bg-white text-slate-500 border-slate-300'">
                    &lt;/&gt;
                </button>
            </div>
        </div>

        <!-- VÙNG SOẠN THẢO TRỰC QUAN (WYSIWYG) -->
        <div
            v-show="!showRawHtml"
            ref="editorRef"
            contenteditable="true"
            @input="onEditorInput"
            @blur="onEditorInput"
            :placeholder="placeholder"
            class="cmg-rich-editor p-4 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none overflow-y-auto"
            :style="{ minHeight }"
        ></div>

        <!-- VÙNG XEM/SỬA MÃ HTML THÔ (NẾU BẤM NÚT </>) -->
        <textarea
            v-if="showRawHtml"
            :value="modelValue"
            @input="onRawInput"
            rows="6"
            class="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 focus:outline-none"
        ></textarea>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Nhập nội dung và bôi đen để in đậm, tạo danh sách hoặc tô màu nền...' },
    minHeight: { type: String, default: '180px' }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const showRawHtml = ref(false)
let isInternalChange = false

// Bảng màu nền Highlight đồng bộ thương hiệu Cute Magic
const highlightColors = [
    { name: 'Vàng Neon', color: '#ffe600' },
    { name: 'Xanh Ngọc', color: '#a6e6e2' },
    { name: 'Xanh Lá', color: '#a7e4a9' },
    { name: 'Cam Đào', color: '#f8cd9f' },
    { name: 'Hồng Pastel', color: '#ffc2d4' }
]

// Bảng màu chữ nhấn mạnh
const textColors = [
    { name: 'Mặc định', color: '#1e293b' },
    { name: 'Hồng CuteMagic', color: '#ff005b' },
    { name: 'Xanh Dương', color: '#2563eb' },
    { name: 'Xanh Ngọc Lục Bảo', color: '#059669' }
]

const exec = (command, value = null) => {
    editorRef.value?.focus()
    document.execCommand(command, false, value)
    onEditorInput()
}

const applyHighlight = (color) => {
    editorRef.value?.focus()
    if (!document.execCommand('hiliteColor', false, color)) {
        document.execCommand('backColor', false, color)
    }
    onEditorInput()
}

// Tạo nhanh tiêu đề đậm kiểu "Key Highlights:"
const insertSectionHeading = () => {
    editorRef.value?.focus()
    const selection = window.getSelection()
    const selectedText = selection?.toString()?.trim()
    if (selectedText) {
        document.execCommand('insertHTML', false, `<p class="font-bold text-base mt-3 mb-1"><strong>${selectedText}</strong></p>`)
    } else {
        document.execCommand('bold', false, null)
    }
    onEditorInput()
}

const onEditorInput = () => {
    if (!editorRef.value) return
    isInternalChange = true
    emit('update:modelValue', editorRef.value.innerHTML)
}

const onRawInput = (e) => {
    const val = e.target.value
    emit('update:modelValue', val)
    if (editorRef.value) {
        editorRef.value.innerHTML = val
    }
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (isInternalChange) {
            isInternalChange = false
            return
        }
        if (editorRef.value && editorRef.value.innerHTML !== (newVal || '')) {
            editorRef.value.innerHTML = newVal || ''
        }
    }
)

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.innerHTML = props.modelValue || ''
    }
})
</script>

<style scoped>
.cmg-rich-editor:empty:before {
    content: attr(placeholder);
    color: #94a3b8;
    pointer-events: none;
}
:deep(.cmg-rich-editor ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.4rem 0;
}
:deep(.cmg-rich-editor ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.4rem 0;
}
:deep(.cmg-rich-editor li) {
    margin-bottom: 0.25rem;
}
:deep(.cmg-rich-editor p) {
    margin-bottom: 0.4rem;
}
:deep(.cmg-rich-editor strong),
:deep(.cmg-rich-editor b) {
    font-weight: 800;
}
</style>