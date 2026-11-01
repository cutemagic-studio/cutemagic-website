<template>
    <div class="min-h-screen pt-0 pb-20 bg-gray-50 dark:bg-[#0b0e14] transition-colors duration-300">
        
        <!-- ==========================================
             1. THANH BREADCRUMB (Nền Solid + Chứa nút điều hướng)
             ========================================== -->
        <div :class="[
            'sticky top-0 z-50 bg-white dark:bg-[#161a23] transition-all duration-300',
            isScrolled 
                ? 'shadow-sm border-b border-gray-200 dark:border-slate-800' 
                : 'shadow-none border-transparent'
        ]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
                
                <!-- Đường dẫn Breadcrumb -->
                <nav class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <router-link to="/" class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Trang chủ
                    </router-link>
                    <span class="text-gray-300 dark:text-gray-700">/</span>
                    <span class="text-gray-900 dark:text-gray-200 font-bold truncate max-w-[120px] sm:max-w-none">Donate</span>
                </nav>

            </div>
        </div>
        
        <!-- ==========================================
             2. NỘI DUNG CHÍNH TRANG DONATE
             ========================================== -->
        <div class="max-w-7xl mx-auto px-6 pt-16">
            
            <div class="max-w-5xl mx-auto">
                
                <!-- KHU VỰC TEXT TIÊU ĐỀ -->
                <div class="max-w-3xl mx-auto text-center mb-20">
                    <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                        Your donation matters.
                    </h1>
                    
                    <p class="text-[15px] md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        For over a decade Cute Magic has provided <a href="#" class="underline underline-offset-4 hover:text-[#ff005b] font-medium transition-colors">free game assets</a> that can be used in personal, educational and commercial projects. Producing is done without corporate funding or subsidies. Instead, the generous support of the community make the creation of game assets possible. Thank you for joining my mission to make game development accessible for everyone.
                    </p>
                </div>

                <!-- KHU VỰC CÁC THẺ DONATE (CARDS) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    <!-- Card 1: One-time (Màu Xanh Ngọc) -->
                    <div class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
                        <!-- Thanh màu trên cùng -->
                        <div class="h-24 bg-[#a6e6e2] w-full"></div>
                        
                        <div class="px-6 pb-8 relative text-center">
                            <!-- Icon nổi (Hình đồng xu 1) -->
                            <div class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">One-time Tip</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">
                                A single donation to buy me a coffee and keep the asset forge running.
                            </p>
                            
                            <button class="w-full bg-[#29abe0] hover:bg-[#208ab5] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md cursor-pointer">
                                Support on Ko-fi
                            </button>
                        </div>
                    </div>

                    <!-- Card 2: Subscription (Màu Xanh Lá) -->
                    <div class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
                        <!-- Thanh màu trên cùng -->
                        <div class="h-24 bg-[#a7e4a9] w-full"></div>
                        
                        <div class="px-6 pb-8 relative text-center">
                            <!-- Icon nổi (Hình giỏ hàng/thành viên) -->
                            <div class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Monthly Supporter</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">
                                Join the community, get early access, and vote on upcoming asset packs.
                            </p>
                            
                            <button class="w-full bg-[#f96854] hover:bg-[#d85544] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md cursor-pointer">
                                Support on Patreon
                            </button>
                        </div>
                    </div>

                    <!-- Card 3: Custom (Màu Cam Đào) -->
                    <div class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
                        <!-- Thanh màu trên cùng -->
                        <div class="h-24 bg-[#f8cd9f] w-full"></div>
                        
                        <div class="px-6 pb-8 relative text-center">
                            <!-- Icon nổi (Hình tia chớp/sáng tạo) -->
                            <div class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Custom Donation</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">
                                Choose your own amount to support the project via PayPal.
                            </p>
                            
                            <button class="w-full bg-[#00457c] hover:bg-[#003159] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md cursor-pointer">
                                Donate via PayPal
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    </div>
</template>