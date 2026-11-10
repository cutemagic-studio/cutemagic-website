<!-- src/components/admin/tabs/asset_manager/components/AssetEditorModal.vue -->
<template>
    <!-- [CẬP NHẬT 1]: Đã xóa @click.self="$emit('close')" để chặn tắt nhầm khi bấm ra vùng nền đen -->
    <div v-if="show" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div
            class="bg-white rounded-3xl w-8xl max-w-8xl w-full h-[95vh] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border-2 border-[#8470FF]">

            <!-- Modal Header -->
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div>
                    <div class="flex items-center gap-3">
                        <span class="text-[12px] font-black uppercase tracking-widest text-blue-400">
                            {{ isEditMode ? `Chỉnh sửa Asset Pack #${formData.id}` : 'Tạo mới Asset Pack' }}
                        </span>
                        <span v-if="formData.dates?.created_at" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                            🕒 Created at: {{ formData.dates.created_at }}
                        </span>
                    </div>
                    <h3 class="text-lg font-black truncate max-w-lg">{{ formData.title || 'Untitled Asset Pack' }}</h3>
                </div>
                <!-- Bấm nút X phải qua hàm xác nhận handleRequestClose -->
                <button 
                    type="button"
                    @click="handleRequestClose"
                    class="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 text-white font-black text-sm cursor-pointer transition-colors"
                    title="Đóng cửa sổ (Có xác nhận)"
                >
                    ✕
                </button>
            </div>

            <!-- Thanh Chuyển 6 Nhóm Thuộc tính của CmgAssetModel -->
            <div
                class="px-6 pt-3 bg-slate-50 border-b-2 border-[#1e1e1e] flex items-center gap-2 overflow-x-auto shrink-0">
                <button v-for="mTab in modalTabs" :key="mTab.id" type="button" @click="activeModalTab = mTab.id"
                    :class="activeModalTab === mTab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2.5 rounded-t-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer">
                    {{ mTab.icon }} {{ mTab.label }}
                </button>
            </div>

            <!-- Nội dung Form theo từng Tab -->
            <div class="p-6 overflow-y-auto flex-1 space-y-5">

                <!-- TAB 1: ĐỊNH DANH & CỜ TRẠNG THÁI (IDENTITY & FLAGS) -->
                <div v-if="activeModalTab === 'identity'" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">
                                Mã ID (6 Chữ số) *
                            </label>
                            <select v-if="!isEditMode" v-model.number="formData.id"
                                class="w-full border-2 border-[#8470FF] bg-blue-50/50 rounded-xl px-3 py-2.5 text-sm font-mono font-black text-blue-700 focus:outline-none">
                                <option v-for="freeId in availablePoolIds" :key="freeId" :value="freeId">
                                    #{{ freeId }} (Chưa dùng)
                                </option>
                            </select>
                            <input v-else :value="`#${formData.id}`" disabled
                                class="w-full border-2 border-[#8470FF] bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-slate-500 cursor-not-allowed" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Tên Asset Pack (Title) *</label>
                            <input v-model="formData.title" @input="autoFillSlug" type="text"
                                placeholder="VD: Stylized Lowpoly Tree Pack"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Danh mục (Category) *</label>
                            <select v-model="formData.categoryId"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500">
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                    {{ cat.name }} ({{ cat.id }})
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Đường dẫn tĩnh (Slug)</label>
                            <input v-model="formData.slug" type="text" placeholder="stylized-lowpoly-tree-pack"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Nhà phát hành (Publisher)</label>
                            <input v-model="formData.publisher" type="text"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Từ khóa (Tags - Ngăn cách bằng dấu phẩy)</label>
                        <input v-model="tagsTextInput" type="text"
                            placeholder="trees, foliage, nature, lowpoly, stylized"
                            class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500" />
                    </div>

                    <!-- 3 Cờ Flags -->
                    <div class="pt-3 border-t border-slate-100">
                        <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Cờ Trạng thái &amp; Huy hiệu (Flags)</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label class="flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer"
                                :class="formData.flags.isFeatured ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'">
                                <input type="checkbox" v-model="formData.flags.isFeatured" class="w-4 h-4 accent-amber-500" />
                                <div>
                                    <p class="text-xs font-black text-slate-800">⭐ Featured Pack</p>
                                    <p class="text-[10px] font-bold text-slate-400">Ưu tiên hiển thị nổi bật</p>
                                </div>
                            </label>

                            <label class="flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer"
                                :class="formData.flags.isExclusive ? 'bg-purple-50 border-purple-300' : 'bg-slate-50 border-slate-200'">
                                <input type="checkbox" v-model="formData.flags.isExclusive" class="w-4 h-4 accent-purple-600" />
                                <div>
                                    <p class="text-xs font-black text-slate-800">💎 Exclusive</p>
                                    <p class="text-[10px] font-bold text-slate-400">Độc quyền Cute Magic</p>
                                </div>
                            </label>

                            <label class="flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer"
                                :class="formData.flags.isLaunchEdition ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'">
                                <input type="checkbox" v-model="formData.flags.isLaunchEdition" class="w-4 h-4 accent-blue-600" />
                                <div>
                                    <p class="text-xs font-black text-slate-800">🚀 Launch Edition</p>
                                    <p class="text-[10px] font-bold text-slate-400">Phiên bản mới ra mắt</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: GIÁ BÁN & KHUYẾN MÃI (PRICING) -->
                <div v-if="activeModalTab === 'pricing'" class="space-y-5">
                    <div class="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border-2 border-[#8470FF]">
                        <div>
                            <p class="text-xs font-black text-slate-800">Chế độ Miễn phí 100% (Free Starter Pack)</p>
                            <p class="text-[11px] text-slate-500">Đặt giá về $0.00 và kích hoạt nút Download trực tiếp</p>
                        </div>
                        <button type="button" @click="setAsFreePack"
                            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer">
                            🎁 Đặt làm Pack Miễn phí ($0)
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Giá bán hiện tại ($) *</label>
                            <input v-model.number="formData.pricing.price" type="number" step="0.5" min="0"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-black text-blue-600" />
                        </div>
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Giá gốc chưa giảm ($)</label>
                            <input v-model.number="formData.pricing.originalPrice" @input="recalculateDiscountPrice"
                                type="number" step="0.5" min="0" placeholder="Để trống nếu ko giảm"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-bold" />
                        </div>
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">% Giảm giá (Discount)</label>
                            <input v-model.number="formData.pricing.discount" @input="recalculateDiscountPrice"
                                type="number" min="0" max="100" placeholder="VD: 50"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-600" />
                        </div>
                        <div>
                            <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Thời hạn Sale (Ends In)</label>
                            <input v-model="formData.pricing.discountEndsIn" type="text" placeholder="VD: 3 days left"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-xs font-bold" />
                        </div>
                    </div>
                </div>

                <!-- TAB 3: NỘI DUNG MÔ TẢ (CONTENT - ĐÃ NÂNG CẤP RICH TEXT EDITOR) -->
                <div v-if="activeModalTab === 'content'" class="space-y-5">
                    <div>
                        <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">
                            Mô tả ngắn (Short Description - Hiển thị ở Card & Đầu trang Chi tiết)
                        </label>
                        <input v-model="formData.content.shortDescription" type="text"
                            class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-xs font-bold" />
                    </div>

                    <div>
                        <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">
                            📝 Mô tả chi tiết (Description - Hỗ trợ In đậm, Bullet List & Tô màu Highlight)
                        </label>
                        <RichTextEditor
                            v-model="fullDescriptionText"
                            min-height="220px"
                            placeholder="Nhập nội dung Description (VD: Key Highlights, Key Features, Compatibility...)"
                        />
                    </div>

                    <div>
                        <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">
                            ⚙️ Chi tiết Kỹ thuật & Tính năng (Technical Details / Features - Hỗ trợ Rich Text)
                        </label>
                        <RichTextEditor
                            v-model="featuresText"
                            min-height="180px"
                            placeholder="Nhập nội dung Technical Details hoặc danh sách tính năng..."
                        />
                    </div>
                </div>

                <!-- TAB 4: HÌNH ẢNH & THÔNG SỐ 3D (MEDIA & TECH SPECS) -->
                <div v-if="activeModalTab === 'media_tech'" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div class="md:col-span-2 space-y-3">
                            <div>
                                <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Ảnh bìa chính (Cover Image URL)</label>
                                <input v-model="formData.media.cover" type="text"
                                    class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-mono" />
                            </div>
                            <div>
                                <label class="block text-[12px] font-bold uppercase text-[#363636] mb-1.5">Danh sách Ảnh Gallery (Mỗi URL 1 dòng)</label>
                                <textarea v-model="galleryText" rows="3"
                                    class="w-full border-2 border-[#8470FF] rounded-xl p-3 text-xs font-mono"></textarea>
                            </div>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-2xl border-2 border-[#8470FF] text-center">
                            <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Xem trước Cover</p>
                            <img v-if="formData.media.cover" :src="formData.media.cover"
                                class="w-full h-32 object-cover rounded-xl border" />
                            <div v-else class="h-32 flex items-center justify-center text-xs text-slate-400">Chưa có ảnh</div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Số lượng Pack</label>
                            <input v-model.number="formData.techSpecs.packCount" type="number" min="1"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Tổng số 3D Models *</label>
                            <input v-model.number="formData.techSpecs.modelCount" type="number" min="0"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black text-blue-600" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Polycount</label>
                            <input v-model="formData.techSpecs.polycount" type="text" placeholder="800 - 2,500 tris"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Render Pipeline</label>
                            <input v-model="formData.techSpecs.renderPipeline" type="text" placeholder="Unity URP & Blender 5"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Rigged (Gắn xương)</label>
                            <input v-model="formData.techSpecs.rigged" type="text" placeholder="Yes (Humanoid)"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Animated (Hoạt ảnh)</label>
                            <input v-model="formData.techSpecs.animated" type="text" placeholder="Yes / No"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Textures &amp; Materials</label>
                            <input v-model="formData.techSpecs.textures" type="text" placeholder="1x 4K Color Atlas (.png)"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                    </div>
                </div>

                <!-- TAB 5: LINKS CỬA HÀNG & FILE DOWNLOAD (LINKS & DOWNLOAD) -->
                <div v-if="activeModalTab === 'links_download'" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Unity Asset Store URL</label>
                            <input v-model="formData.links.unity" type="text" placeholder="https://assetstore.unity.com/..."
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-mono" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Fab URL</label>
                            <input v-model="formData.links.fab" type="text" placeholder="https://www.fab.com/..."
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-mono" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Itch.io URL</label>
                            <input v-model="formData.links.itch" type="text" placeholder="https://itch.io/..."
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-mono" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">CGTrader URL</label>
                            <input v-model="formData.links.cgtrader" type="text" placeholder="https://www.cgtrader.com/..."
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-mono" />
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <p class="text-xs font-black text-slate-700 mb-3">📦 Cấu hình File Tải xuống Trực tiếp (Dành cho Pack Free)</p>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div class="md:col-span-2">
                                <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Đường dẫn File (Download URL)</label>
                                <input v-model="formData.download.url" type="text" placeholder="/downloads/cmg-starter-free.zip"
                                    class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-mono" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Dung lượng (File Size)</label>
                                <input v-model="formData.download.fileSize" type="text" placeholder="24.5 MB"
                                    class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Phiên bản (Version)</label>
                                <input v-model="formData.download.version" type="text" placeholder="1.2.0"
                                    class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ========================================================================= -->
                <!-- TAB 6: THỜI GIAN, ROADMAP & CHỈ SỐ (ĐÃ NÂNG CẤP LOGIC GỢI Ý TRẠNG THÁI) -->
                <!-- ========================================================================= -->
                <div v-if="activeModalTab === 'dates_roadmap'" class="space-y-5">

                    <!-- KHỐI 1: QUẢN LÝ NGÀY THÁNG & NHÃN AVAILABLE IN TỰ ĐỘNG -->
                    <div class="bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-200 space-y-4">
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                            <span class="text-xs font-black uppercase tracking-wider text-slate-700">
                                🗓️ Mốc Thời Gian Cốt Lõi (So sánh với Hôm nay: <strong class="text-blue-600 font-mono">{{ todayStr }}</strong>)
                            </span>
                            <span class="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                🔒 Ngày khởi tạo gốc (created_at): <strong class="text-slate-800">{{ formData.dates.created_at || todayStr }}</strong>
                            </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <!-- 1. Ngày tạo bản ghi (Tùy chỉnh linh hoạt để xét điều kiện) -->
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <label class="text-[10px] font-black uppercase text-slate-600">
                                        1. Ngày tạo bản ghi *
                                    </label>
                                    <button type="button" @click="formData.dates.recordCreatedDate = todayStr"
                                        class="text-[10px] font-black text-blue-600 underline cursor-pointer">
                                        Hôm nay
                                    </button>
                                </div>
                                <input 
                                    v-model="formData.dates.recordCreatedDate" 
                                    type="date"
                                    class="w-full bg-white border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black text-slate-800" 
                                />
                                <p class="text-[10px] text-slate-400 font-semibold mt-1">
                                    Cho phép tinh chỉnh để tính gợi ý trạng thái
                                </p>
                            </div>

                            <!-- 2. Ngày dự kiến bàn giao / Phát hành (Type Date) -->
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <label class="text-[10px] font-black uppercase text-indigo-700">
                                        2. Dự kiến hoàn thành / Phát hành *
                                    </label>
                                    <button type="button" @click="setTargetDateToday"
                                        class="text-[10px] font-black text-indigo-600 underline cursor-pointer">
                                        Hôm nay
                                    </button>
                                </div>
                                <input 
                                    v-model="formData.roadmap.estimatedDelivery" 
                                    @change="syncInitialReleaseDate"
                                    type="date"
                                    class="w-full bg-white border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black text-indigo-700" 
                                />
                                <p class="text-[10px] text-slate-400 font-semibold mt-1">
                                    Mốc đích để đối chiếu với ngày hôm nay
                                </p>
                            </div>

                            <!-- 3. Ngày cập nhật gần nhất (Latest Update) -->
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <label class="text-[10px] font-black uppercase text-blue-600">
                                        3. Cập nhật gần nhất (Update)
                                    </label>
                                    <button type="button" @click="formData.dates.latestUpdate = todayStr"
                                        class="text-[10px] font-black text-blue-600 underline cursor-pointer">
                                        Hôm nay
                                    </button>
                                </div>
                                <input 
                                    v-model="formData.dates.latestUpdate" 
                                    type="date"
                                    class="w-full bg-white border-2 border-blue-300 rounded-xl px-3 py-2 text-xs font-black text-blue-600" 
                                />
                                <p class="text-[10px] text-slate-400 font-semibold mt-1">
                                    Dùng để sắp xếp cột New Releases
                                </p>
                            </div>

                            <!-- 4. Nhãn Sắp ra mắt (Available In - Tự động tính, KHÔNG lưu vào DB) -->
                            <div>
                                <label class="block text-[10px] font-black uppercase text-amber-600 mb-1">
                                    ⏳ Nhãn Sắp ra mắt (Tự động)
                                </label>
                                <div class="w-full bg-amber-50/80 border-2 border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-amber-800 flex items-center justify-between">
                                    <span class="truncate">{{ computedAvailableInDisplay }}</span>
                                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 uppercase shrink-0">
                                        Auto
                                    </span>
                                </div>
                                <p class="text-[10px] text-amber-600/80 font-semibold mt-1">
                                    Tự tính theo Ngày dự kiến (Không lưu vào DB)
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- KHỐI 2: HỘP THÔNG BÁO GỢI Ý TRẠNG THÁI THÔNG MINH -->
                    <div 
                        class="p-4 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        :class="statusSuggestion.boxClass"
                    >
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="text-base">{{ statusSuggestion.icon }}</span>
                                <span class="text-xs font-black uppercase tracking-wider">
                                    Gợi ý Trạng thái từ Hệ thống:
                                </span>
                                <span class="px-2.5 py-0.5 rounded-lg text-xs font-black border" :class="statusSuggestion.badgeClass">
                                    {{ statusSuggestion.label }}
                                </span>
                            </div>
                            <p class="text-xs font-bold opacity-90 leading-relaxed">
                                {{ statusSuggestion.reason }}
                            </p>
                            <p class="text-[11px] font-mono opacity-75">
                                Biểu thức hiện tại: [Ngày tạo: {{ formData.dates.recordCreatedDate || '?' }}] • [Hôm nay: {{ todayStr }}] • [Dự kiến: {{ formData.roadmap.estimatedDelivery || '?' }}] • [Tiến độ: {{ formData.roadmap.progress }}%]
                            </p>
                        </div>

                        <!-- Nút bấm 1-Click để Admin áp dụng gợi ý nếu muốn -->
                        <div v-if="statusSuggestion.suggestedValue !== undefined && formData.roadmap.status !== statusSuggestion.suggestedValue" class="shrink-0">
                            <button 
                                type="button"
                                @click="applySuggestedStatus"
                                class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black shadow-md transition-colors cursor-pointer whitespace-nowrap"
                            >
                                ⚡ Chọn "{{ statusSuggestion.shortLabel }}"
                            </button>
                        </div>
                    </div>

                    <!-- KHỐI 3: QUẢN LÝ TIẾN ĐỘ & QUYẾT ĐỊNH TRẠNG THÁI CUỐI CÙNG CỦA ADMIN -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border-2 border-[#8470FF]">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
                                Trạng thái Pack / Roadmap (Quyết định của Admin)
                            </label>
                            <select v-model="formData.roadmap.status"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black">
                                <option :value="null">Không hiển thị trên Roadmap</option>
                                <option value="prev">✅ Đã phát hành (Completed / Released - prev)</option>
                                <option value="current">⚡ Đang thực hiện (In Progress - current)</option>
                                <option value="next">📅 Đã lên kế hoạch (Planned - next)</option>
                            </select>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <label class="text-[10px] font-black uppercase text-slate-500">
                                    Tiến độ hoàn thành ({{ formData.roadmap.progress }}%)
                                </label>
                                <div class="flex items-center gap-1">
                                    <button type="button" @click="formData.roadmap.progress = 0" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[9px] font-black cursor-pointer">0%</button>
                                    <button type="button" @click="formData.roadmap.progress = 50" class="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 text-[9px] font-black cursor-pointer">50%</button>
                                    <button type="button" @click="formData.roadmap.progress = 100" class="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[9px] font-black cursor-pointer">100%</button>
                                </div>
                            </div>
                            <input v-model.number="formData.roadmap.progress" type="range" min="0" max="100" step="5"
                                class="w-full accent-blue-600 mt-2 cursor-pointer" />
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
                                Ngày phát hành hiển thị (Initial Release)
                            </label>
                            <input 
                                v-model="formData.dates.initialRelease" 
                                type="date"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black" 
                            />
                        </div>

                        <div class="md:col-span-3">
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
                                Ghi chú tiến độ (Roadmap Note)
                            </label>
                            <input v-model="formData.roadmap.note" type="text"
                                placeholder="VD: Đang tối ưu thêm 10 mẫu cây mùa đông..."
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                    </div>

                    <!-- Điều chỉnh số liệu Metrics -->
                    <div class="grid grid-cols-3 gap-4 pt-2">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">❤️ Lượt Yêu thích (Likes)</label>
                            <input v-model.number="formData.metrics.likes" type="number" min="0"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">👁️ Lượt Xem (Views)</label>
                            <input v-model.number="formData.metrics.views" type="number" min="0"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">⬇️ Lượt Tải (Downloads)</label>
                            <input v-model.number="formData.metrics.downloads" type="number" min="0"
                                class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black" />
                        </div>
                    </div>
                </div>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-slate-50 border-t-2 border-[#1e1e1e] flex items-center justify-between shrink-0">
                <span class="text-xs font-bold text-slate-400">
                    Mọi thay đổi sẽ được lưu trực tiếp lên nhánh <code
                        class="text-blue-600 font-mono">cmg_assets/pack_{{ formData.id || 'new' }}</code>
                </span>
                <div class="flex items-center gap-3">
                    <!-- Nút Hủy bỏ cũng gọi qua hàm xác nhận handleRequestClose -->
                    <button type="button" @click="handleRequestClose"
                        class="px-4 py-2.5 rounded-xl border-2 border-[#8470FF] bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-xs font-black text-slate-600 cursor-pointer transition-colors">
                        Hủy bỏ
                    </button>
                    <button type="button" @click="onSubmit" :disabled="isSaving"
                        class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/25 cursor-pointer">
                        {{ isSaving ? 'Đang lưu lên Firebase...' : '💾 Lưu Asset Pack' }}
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getTodayDateString } from '../../../../../stores/useAssetStore'
import { useNotificationStore } from '../../../../../stores/useNotificationStore'
import { CmgAssetModel } from '../../../../../models/cmg/Cmg_AssetModel'

import RichTextEditor from './RichTextEditor.vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    isEditMode: { type: Boolean, default: false },
    initialData: { type: Object, default: () => ({}) },
    categories: { type: Array, default: () => [] },
    availablePoolIds: { type: Array, default: () => [] },
    isSaving: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'save'])
const notify = useNotificationStore()

const todayStr = getTodayDateString()
const activeModalTab = ref('identity')
const formData = ref(JSON.parse(JSON.stringify(new CmgAssetModel())))

// Các biến Text trung gian cho mảng (Tags, FullDescription, Features, Gallery) 
const tagsTextInput = ref('')
const fullDescriptionText = ref('')
const featuresText = ref('')
const galleryText = ref('')

const modalTabs = [
    { id: 'identity', icon: '🏷️', label: '1. Định danh & Cờ' },
    { id: 'pricing', icon: '💲', label: '2. Giá & Khuyến mãi' },
    { id: 'content', icon: '📝', label: '3. Nội dung & Tính năng' },
    { id: 'media_tech', icon: '🎨', label: '4. Ảnh & Thông số 3D' },
    { id: 'links_download', icon: '🔗', label: '5. Store Links & File' },
    { id: 'dates_roadmap', icon: '📅', label: '6. Ngày, Roadmap & Chỉ số' }
]

// Kiểm tra một chuỗi có phải định dạng ngày YYYY-MM-DD hợp lệ không
const isValidDateStr = (str) => /^\d{4}-\d{2}-\d{2}$/.test(String(str || '').trim())

// Đồng bộ dữ liệu khi mở Modal
watch(
    () => [props.show, props.initialData, props.isEditMode],
    ([isOpen]) => {
        if (isOpen && props.initialData) {
            activeModalTab.value = 'identity'
            const cloned = JSON.parse(JSON.stringify(props.initialData))

            // Bảo vệ ID khi ở chế độ Chỉnh sửa
            if (props.isEditMode && (!cloned.id || Number(cloned.id) < 100000)) {
                cloned.id = props.initialData.id
            }

            if (!cloned.dates) cloned.dates = {}
            if (!cloned.roadmap) cloned.roadmap = { status: null, progress: 0, estimatedDelivery: '', note: '' }

            // 1. Cột created_at (Lưu cố định ngày tạo thực tế của Pack, không chỉnh sửa)
            if (!props.isEditMode) {
                cloned.dates.created_at = todayStr
                cloned.dates.recordCreatedDate = todayStr
            } else {
                cloned.dates.created_at = cloned.dates.created_at || cloned.dates.initialRelease || todayStr
                cloned.dates.recordCreatedDate = cloned.dates.recordCreatedDate || cloned.dates.created_at || todayStr
            }

            // 2. Chuẩn hóa Ngày dự kiến bàn giao (estimatedDelivery) sang kiểu YYYY-MM-DD cho <input type="date">
            if (!isValidDateStr(cloned.roadmap.estimatedDelivery)) {
                cloned.roadmap.estimatedDelivery = isValidDateStr(cloned.dates.initialRelease)
                    ? cloned.dates.initialRelease
                    : todayStr
            }

            formData.value = cloned
            tagsTextInput.value = (formData.value.tags || []).join(', ')

            // fullDescriptionText.value = (formData.value.content?.fullDescription || []).join('\n')
            // featuresText.value = (formData.value.content?.features || []).join('\n')
            // [CẬP NHẬT 2 DÒNG NÀY ĐỂ ĐỌC RICH TEXT]:
            fullDescriptionText.value = arrayToRichHtml(formData.value.content?.fullDescription)
            featuresText.value = arrayToRichHtml(formData.value.content?.features)

            galleryText.value = (formData.value.media?.gallery || []).join('\n')
        }
    },
    { immediate: true, deep: true }
)

// Hàm tự động chuyển mảng chuỗi cũ (nếu có) thành HTML cho RichTextEditor
const arrayToRichHtml = (arrOrStr) => {
    if (!arrOrStr) return ''
    if (typeof arrOrStr === 'string') return arrOrStr
    if (Array.isArray(arrOrStr)) {
        // Nếu phần tử đầu tiên đã là mã HTML do RichTextEditor lưu -> trả về nguyên bản
        if (arrOrStr.length === 1 && /<[a-z][\s\S]*>/i.test(arrOrStr[0])) {
            return arrOrStr[0]
        }
        // Nếu là dữ liệu cũ (mỗi dòng 1 phần tử) -> bọc thành các thẻ <p>
        return arrOrStr.map(line => `<p>${line}</p>`).join('')
    }
    return ''
}

// ============================================================================
// [YÊU CẦU 1]: XÁC NHẬN TRƯỚC KHI ĐÓNG POPUP (KHÔNG CHO ĐÓNG KHI CLICK NỀN ĐEN)
// ============================================================================
const handleRequestClose = async () => {
    if (props.isSaving) return

    const confirmed = await notify.confirm({
        title: 'Xác nhận đóng cửa sổ biên tập?',
        message: 'Những thông tin bạn vừa nhập hoặc chỉnh sửa chưa được lưu sẽ bị hủy bỏ. Bạn có chắc chắn muốn đóng không?',
        highlightText: formData.value.title
            ? `#${formData.value.id || 'New'} - ${formData.value.title}`
            : 'Biểu mẫu Asset Pack chưa đặt tên',
        confirmText: 'Đồng ý Đóng',
        cancelText: 'Tiếp tục chỉnh sửa',
        variant: 'warning',
        icon: '⚠️'
    })

    if (confirmed) {
        emit('close')
    }
}

// ============================================================================
// [YÊU CẦU 2]: TỰ ĐỘNG TÍNH NHÃN "AVAILABLE IN" & GỢI Ý TRẠNG THÁI PACK
// ============================================================================
const setTargetDateToday = () => {
    formData.value.roadmap.estimatedDelivery = todayStr
    formData.value.dates.initialRelease = todayStr
}

const syncInitialReleaseDate = () => {
    if (isValidDateStr(formData.value.roadmap.estimatedDelivery)) {
        formData.value.dates.initialRelease = formData.value.roadmap.estimatedDelivery
    }
}

// Tính khoảng cách ngày giữa Ngày dự kiến hoàn thành và Ngày hôm nay
const daysUntilTarget = computed(() => {
    const targetStr = formData.value.roadmap?.estimatedDelivery || formData.value.dates?.initialRelease
    if (!isValidDateStr(targetStr)) return 0
    const targetTime = new Date(`${targetStr}T00:00:00`).getTime()
    const todayTime = new Date(`${todayStr}T00:00:00`).getTime()
    return Math.round((targetTime - todayTime) / (1000 * 60 * 60 * 24))
})

// Nhãn Available In tự động (Chỉ hiển thị, không lưu cứng vào Database)
const computedAvailableInDisplay = computed(() => {
    const diff = daysUntilTarget.value
    const progress = Number(formData.value.roadmap?.progress || 0)

    if (diff <= 0 && progress === 100) {
        return 'Đã ra mắt (Không gắn nhãn)'
    }
    if (diff === 0) {
        return 'Ra mắt Hôm nay'
    }
    if (diff > 0) {
        if (diff < 7) return `${diff} ngày nữa`
        if (diff < 30) return `${Math.ceil(diff / 7)} tuần nữa (${diff} ngày)`
        return `${Math.round(diff / 30)} tháng nữa (${diff} ngày)`
    }
    // Trường hợp diff < 0 nhưng tiến độ < 100%
    return `Đang hoàn thiện (Quá dự kiến ${Math.abs(diff)} ngày)`
})

/**
 * Hệ thống phân tích 3 điều kiện (a, b, c) để đưa ra lời gợi ý Trạng thái cho Admin:
 * a. Đã phát hành (prev): Ngày tạo <= Ngày dự kiến <= Ngày hôm nay VÀ Tiến độ == 100%
 * b. Đang thực hiện (current): Ngày tạo <= Ngày hôm nay <= Ngày dự kiến VÀ 0% < Tiến độ < 100%
 * c. Đã lên kế hoạch (next): Ngày tạo <= Ngày hôm nay <= Ngày dự kiến VÀ Tiến độ == 0%
 */
const statusSuggestion = computed(() => {
    const created = formData.value.dates?.recordCreatedDate || ''
    const target = formData.value.roadmap?.estimatedDelivery || ''
    const today = todayStr
    const progress = Number(formData.value.roadmap?.progress ?? 0)

    if (!isValidDateStr(created) || !isValidDateStr(target)) {
        return {
            icon: 'ℹ️',
            label: 'Chưa đủ dữ liệu ngày tháng',
            shortLabel: '',
            suggestedValue: undefined,
            reason: 'Vui lòng chọn đầy đủ Ngày tạo bản ghi và Ngày dự kiến hoàn thành/phát hành để hệ thống phân tích.',
            boxClass: 'bg-slate-50 border-slate-200 text-slate-600',
            badgeClass: 'bg-slate-200 text-slate-700 border-slate-300'
        }
    }

    // Kiểm tra tính hợp lệ cơ bản: Ngày tạo không được lớn hơn Ngày dự kiến hoặc Ngày hôm nay
    if (created > target) {
        return {
            icon: '⚠️',
            label: 'Mốc ngày chưa hợp lệ (Ngày tạo > Ngày dự kiến)',
            shortLabel: '',
            suggestedValue: undefined,
            reason: 'Ngày tạo bản ghi đang lớn hơn Ngày dự kiến hoàn thành/phát hành. Bạn hãy điều chỉnh lại mốc ngày nhé.',
            boxClass: 'bg-rose-50 border-rose-300 text-rose-800',
            badgeClass: 'bg-rose-100 text-rose-700 border-rose-300'
        }
    }

    // TRƯỜNG HỢP A: ĐÃ PHÁT HÀNH (Ngày tạo <= Ngày dự kiến <= Ngày hôm nay && Tiến độ == 100%)
    if (created <= target && target <= today && progress === 100) {
        return {
            icon: '✅',
            label: 'Đã phát hành (Completed / Released)',
            shortLabel: 'Đã phát hành (prev)',
            suggestedValue: 'prev',
            reason: 'Thỏa mãn điều kiện (a): Ngày tạo ≤ Ngày dự kiến phát hành ≤ Hôm nay và Tiến độ đạt 100%.',
            boxClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
            badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }
    }

    // TRƯỜNG HỢP B: ĐANG THỰC HIỆN (Ngày tạo <= Ngày hôm nay <= Ngày dự kiến && 0% < Tiến độ < 100%)
    if (created <= today && today <= target && progress > 0 && progress < 100) {
        return {
            icon: '⚡',
            label: 'Đang thực hiện (In Progress)',
            shortLabel: 'Đang thực hiện (current)',
            suggestedValue: 'current',
            reason: `Thỏa mãn điều kiện (b): Ngày tạo ≤ Hôm nay ≤ Ngày dự kiến và Tiến độ đang ở mức ${progress}% (0% < Tiến độ < 100%).`,
            boxClass: 'bg-blue-50 border-blue-300 text-blue-900',
            badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
        }
    }

    // TRƯỜNG HỢP C: ĐÃ LÊN KẾ HOẠCH (Ngày tạo <= Ngày hôm nay <= Ngày dự kiến && Tiến độ == 0%)
    if (created <= today && today <= target && progress === 0) {
        return {
            icon: '📅',
            label: 'Đã lên kế hoạch (Planned)',
            shortLabel: 'Đã lên kế hoạch (next)',
            suggestedValue: 'next',
            reason: 'Thỏa mãn điều kiện (c): Ngày tạo ≤ Hôm nay ≤ Ngày dự kiến và Tiến độ đang ở 0%.',
            boxClass: 'bg-amber-50 border-amber-300 text-amber-900',
            badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
        }
    }

    // CÁC TRƯỜNG HỢP NGOẠI LỆ (Giúp Admin dễ dàng nhận biết để tinh chỉnh)
    if (target < today && progress < 100) {
        return {
            icon: '⏰',
            label: 'Đang thực hiện - Quá hạn dự kiến (Gợi ý: Đang thực hiện)',
            shortLabel: 'Đang thực hiện (current)',
            suggestedValue: 'current',
            reason: `Ngày dự kiến (${target}) đã qua so với Hôm nay nhưng Tiến độ mới đạt ${progress}% (< 100%). Bạn có thể chọn "Đang thực hiện", tăng tiến độ lên 100% hoặc dời Ngày dự kiến.`,
            boxClass: 'bg-amber-50 border-amber-300 text-amber-900',
            badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
        }
    }

    if (today < target && progress === 100) {
        return {
            icon: '🎉',
            label: 'Hoàn thành sớm 100% trước ngày dự kiến (Gợi ý: Đã phát hành)',
            shortLabel: 'Đã phát hành (prev)',
            suggestedValue: 'prev',
            reason: `Tiến độ đã đạt 100% trước cả Ngày dự kiến (${target}). Nếu muốn xuất bản ngay, bạn hãy kéo Ngày dự kiến về Hôm nay (${today}) hoặc chọn "Đã phát hành".`,
            boxClass: 'bg-indigo-50 border-indigo-300 text-indigo-900',
            badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300'
        }
    }

    return {
        icon: '💡',
        label: 'Tùy chỉnh theo quyết định của Admin',
        shortLabel: '',
        suggestedValue: undefined,
        reason: 'Kiểm tra lại sự kết hợp giữa Ngày tạo bản ghi, Ngày dự kiến hoàn thành và Tiến độ (%) để nhận gợi ý chuẩn nhất.',
        boxClass: 'bg-slate-50 border-slate-200 text-slate-700',
        badgeClass: 'bg-slate-200 text-slate-700 border-slate-300'
    }
})

const applySuggestedStatus = () => {
    if (statusSuggestion.value.suggestedValue !== undefined) {
        formData.value.roadmap.status = statusSuggestion.value.suggestedValue
    }
}

// ============================================================================
// CÁC HÀM TIỆN ÍCH KHÁC & SUBMIT LƯU LÊN FIREBASE
// ============================================================================
const autoFillSlug = () => {
    if (!props.isEditMode) {
        formData.value.slug = (formData.value.title || '')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
    }
}

const recalculateDiscountPrice = () => {
    const orig = Number(formData.value.pricing.originalPrice)
    const disc = Number(formData.value.pricing.discount)
    if (orig > 0 && disc > 0 && disc <= 100) {
        formData.value.pricing.price = Number((orig * (1 - disc / 100)).toFixed(2))
    }
}

const setAsFreePack = () => {
    formData.value.pricing.price = 0
    formData.value.pricing.originalPrice = null
    formData.value.pricing.discount = null
    formData.value.pricing.discountEndsIn = ''
}

const onSubmit = () => {
    if (!formData.value.title?.trim()) {
        notify.warning('Thiếu thông tin bắt buộc', 'Vui lòng nhập Tên Asset Pack (Title)!')
        activeModalTab.value = 'identity'
        return
    }

    if (props.isEditMode && (!formData.value.id || Number(formData.value.id) < 100000)) {
        notify.error('Lỗi định danh ID', 'Không tìm thấy mã ID gốc của Asset Pack này. Vui lòng đóng modal và mở lại!')
        return
    }

    const payload = JSON.parse(JSON.stringify(formData.value))
    payload.tags = tagsTextInput.value.split(',').map(s => s.trim()).filter(Boolean)

    // payload.content.fullDescription = fullDescriptionText.value.split('\n').map(s => s.trim()).filter(Boolean)
    // payload.content.features = featuresText.value.split('\n').map(s => s.trim()).filter(Boolean)
    // [CẬP NHẬT 2 DÒNG NÀY ĐỂ LƯU NGUYÊN VẸN MÃ HTML TỪ RICH TEXT EDITOR]:
    payload.content.fullDescription = fullDescriptionText.value?.trim() ? [fullDescriptionText.value.trim()] : []
    payload.content.features = featuresText.value?.trim() ? [featuresText.value.trim()] : []

    payload.media.gallery = galleryText.value.split('\n').map(s => s.trim()).filter(Boolean)

    // Đảm bảo bảo toàn ID khi sửa
    if (props.isEditMode) {
        payload.id = Number(props.initialData.id)
    }

    // Bảo toàn created_at (ngày tạo thực tế vào DB) và recordCreatedDate (ngày tạo bản ghi tùy chỉnh)
    if (!payload.dates) payload.dates = {}
    payload.dates.created_at = props.isEditMode
        ? (props.initialData?.dates?.created_at || payload.dates.created_at || todayStr)
        : todayStr
    payload.dates.recordCreatedDate = payload.dates.recordCreatedDate || todayStr

    // [QUAN TRỌNG]: Xóa trường availableIn khỏi payload để KHÔNG lưu cứng vào Database
    delete payload.dates.availableIn

    emit('save', payload)
}
</script>