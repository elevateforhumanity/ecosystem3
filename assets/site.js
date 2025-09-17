// Site-wide header and footer injection
document.addEventListener('DOMContentLoaded', function() {
    // Inject header
    const headerDiv = document.getElementById('site-header');
    if (headerDiv) {
        headerDiv.innerHTML = `
            <!-- Top Banner -->
            <div class="bg-blue-900 text-white py-2 text-center text-sm">
                <div class="container mx-auto px-4">
                    🎓 <strong>WIOA Approved Programs</strong> • Free Training Available • 
                    <a href="/contact" class="text-yellow-300 hover:text-yellow-100 underline">Apply Today</a>
                </div>
            </div>

            <!-- Main Header -->
            <header class="bg-white shadow-lg sticky top-0 z-50">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between py-4">
                        <!-- Logo -->
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span class="text-white font-bold text-xl">E</span>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-gray-800">Elevate for Humanity</h1>
                                <p class="text-sm text-gray-600">Career Training & Development</p>
                            </div>
                        </div>

                        <!-- Desktop Navigation -->
                        <nav class="hidden lg:flex items-center space-x-8">
                            <a href="/" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                            
                            <!-- Programs Dropdown -->
                            <div class="relative group">
                                <button class="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                                    Programs
                                    <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div class="p-4">
                                        <h3 class="font-semibold text-gray-800 mb-3">Technology Programs</h3>
                                        <a href="/programs/cybersecurity" class="block py-2 text-gray-600 hover:text-blue-600">Cybersecurity</a>
                                        <a href="/programs/cloud-computing" class="block py-2 text-gray-600 hover:text-blue-600">Cloud Computing</a>
                                        
                                        <h3 class="font-semibold text-gray-800 mb-3 mt-4">Healthcare Programs</h3>
                                        <a href="/programs/cna-hha" class="block py-2 text-gray-600 hover:text-blue-600">CNA/HHA</a>
                                        
                                        <h3 class="font-semibold text-gray-800 mb-3 mt-4">Skilled Trades</h3>
                                        <a href="/programs/electrical" class="block py-2 text-gray-600 hover:text-blue-600">Electrical</a>
                                        <a href="/programs/construction" class="block py-2 text-gray-600 hover:text-blue-600">Construction</a>
                                        <a href="/programs/beauty" class="block py-2 text-gray-600 hover:text-blue-600">Cosmetology</a>
                                    </div>
                                </div>
                            </div>
                            
                            <a href="/about" class="text-gray-700 hover:text-blue-600 font-medium">About</a>
                            <a href="/employers" class="text-gray-700 hover:text-blue-600 font-medium">Employers</a>
                            <a href="/blog" class="text-gray-700 hover:text-blue-600 font-medium">Blog</a>
                            <a href="/contact" class="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                            <a href="/contact" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Apply Now</a>
                        </nav>

                        <!-- Mobile Menu Button -->
                        <button id="mobile-menu-btn" class="lg:hidden p-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile Menu -->
                    <div id="mobile-menu" class="lg:hidden hidden pb-4">
                        <div class="space-y-2">
                            <a href="/" class="block py-2 text-gray-700 hover:text-blue-600">Home</a>
                            
                            <!-- Mobile Programs -->
                            <div>
                                <button id="mobile-programs-btn" class="w-full text-left py-2 text-gray-700 hover:text-blue-600 flex items-center justify-between">
                                    Programs
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div id="mobile-programs-menu" class="hidden pl-4 space-y-1">
                                    <a href="/programs/cybersecurity" class="block py-1 text-gray-600 hover:text-blue-600">Cybersecurity</a>
                                    <a href="/programs/cloud-computing" class="block py-1 text-gray-600 hover:text-blue-600">Cloud Computing</a>
                                    <a href="/programs/cna-hha" class="block py-1 text-gray-600 hover:text-blue-600">CNA/HHA</a>
                                    <a href="/programs/electrical" class="block py-1 text-gray-600 hover:text-blue-600">Electrical</a>
                                    <a href="/programs/construction" class="block py-1 text-gray-600 hover:text-blue-600">Construction</a>
                                    <a href="/programs/beauty" class="block py-1 text-gray-600 hover:text-blue-600">Cosmetology</a>
                                </div>
                            </div>
                            
                            <a href="/about" class="block py-2 text-gray-700 hover:text-blue-600">About</a>
                            <a href="/employers" class="block py-2 text-gray-700 hover:text-blue-600">Employers</a>
                            <a href="/blog" class="block py-2 text-gray-700 hover:text-blue-600">Blog</a>
                            <a href="/contact" class="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
                            <a href="/contact" class="block py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700">Apply Now</a>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    // Inject footer
    const footerDiv = document.getElementById('site-footer');
    if (footerDiv) {
        footerDiv.innerHTML = `
            <footer class="bg-gray-900 text-white">
                <div class="container mx-auto px-4 py-12">
                    <div class="grid md:grid-cols-4 gap-8">
                        <!-- Company Info -->
                        <div>
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span class="text-white font-bold">E</span>
                                </div>
                                <span class="text-xl font-bold">Elevate for Humanity</span>
                            </div>
                            <p class="text-gray-400 mb-4">Empowering careers through quality education and training programs.</p>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                    </svg>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Programs -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Programs</h3>
                            <ul class="space-y-2">
                                <li><a href="/programs/cybersecurity" class="text-gray-400 hover:text-white">Cybersecurity</a></li>
                                <li><a href="/programs/cloud-computing" class="text-gray-400 hover:text-white">Cloud Computing</a></li>
                                <li><a href="/programs/cna-hha" class="text-gray-400 hover:text-white">CNA/HHA</a></li>
                                <li><a href="/programs/electrical" class="text-gray-400 hover:text-white">Electrical</a></li>
                                <li><a href="/programs/construction" class="text-gray-400 hover:text-white">Construction</a></li>
                                <li><a href="/programs/beauty" class="text-gray-400 hover:text-white">Cosmetology</a></li>
                            </ul>
                        </div>

                        <!-- Company -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Company</h3>
                            <ul class="space-y-2">
                                <li><a href="/about" class="text-gray-400 hover:text-white">About Us</a></li>
                                <li><a href="/employers" class="text-gray-400 hover:text-white">Employers</a></li>
                                <li><a href="/blog" class="text-gray-400 hover:text-white">Blog</a></li>
                                <li><a href="/contact" class="text-gray-400 hover:text-white">Contact</a></li>
                                <li><a href="/privacy" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <!-- Contact -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
                            <div class="space-y-2 text-gray-400">
                                <p>📧 info@elevateforhumanity.org</p>
                                <p>📞 (555) 123-4567</p>
                                <p>📍 123 Education Blvd<br>Learning City, LC 12345</p>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Elevate for Humanity. All rights reserved. | WIOA Approved Training Provider</p>
                    </div>
                </div>
            </footer>
        `;
    }

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileProgramsBtn = document.getElementById('mobile-programs-btn');
    const mobileProgramsMenu = document.getElementById('mobile-programs-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (mobileProgramsBtn && mobileProgramsMenu) {
        mobileProgramsBtn.addEventListener('click', function() {
            mobileProgramsMenu.classList.toggle('hidden');
        });
    }
});