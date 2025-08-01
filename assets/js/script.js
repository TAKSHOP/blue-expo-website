/* Blue Expo JavaScript Functionality */

$(document).ready(function() {
    'use strict';

    // ==================== Global Variables ====================
    let isScrolling = false;
    const $window = $(window);
    const $document = $(document);
    const $body = $('body');

    // ==================== Initialize AOS Animation ====================
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // ==================== Initialize Swiper Slider ====================
    function initHeroSwiper() {
        if (typeof Swiper !== 'undefined' && $('.hero-swiper').length) {
            const heroSwiper = new Swiper('.hero-swiper', {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    slideChange: function() {
                        // Track slide changes for analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'hero_slide_change', {
                                event_category: 'engagement',
                                event_label: 'slide_' + (this.activeIndex + 1)
                            });
                        }
                    }
                }
            });
            
            return heroSwiper;
        }
        return null;
    }

    // ==================== Navigation Functionality ====================
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        const scrollTop = $window.scrollTop();
        const $navbar = $('.navbar');
        
        if (scrollTop > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }
    }

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            if (target.length) {
                const offsetTop = target.offset().top - 80;
                
                $('html, body').animate({
                    scrollTop: offsetTop
                }, 800, 'easeInOutQuart');
                
                // Close mobile menu if open
                $('.navbar-collapse').collapse('hide');
            }
        });
    }

    // Active navigation highlighting
    function updateActiveNavigation() {
        const scrollTop = $window.scrollTop() + 100;
        
        $('section[id]').each(function() {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionHeight = $section.outerHeight();
            const sectionId = $section.attr('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                $('.navbar-nav .nav-link').removeClass('active');
                $(`.navbar-nav .nav-link[href="#${sectionId}"]`).addClass('active');
            }
        });
    }

    // ==================== Contact Form Functionality ====================
    
    function initContactForm() {
        const $form = $('#contactForm');
        const $submitBtn = $form.find('button[type="submit"]');
        const originalBtnText = $submitBtn.html();

        // Form validation
        function validateForm() {
            let isValid = true;
            const requiredFields = $form.find('[required]');
            
            requiredFields.each(function() {
                const $field = $(this);
                const value = $field.val().trim();
                
                // Remove previous error styling
                $field.removeClass('is-invalid');
                $field.next('.invalid-feedback').remove();
                
                if (!value) {
                    isValid = false;
                    $field.addClass('is-invalid');
                    $field.after('<div class="invalid-feedback">この項目は必須です。</div>');
                }
                
                // Email validation
                if ($field.attr('type') === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        $field.addClass('is-invalid');
                        $field.next('.invalid-feedback').remove();
                        $field.after('<div class="invalid-feedback">正しいメールアドレスを入力してください。</div>');
                    }
                }
            });
            
            return isValid;
        }

        // Real-time validation
        $form.find('[required]').on('blur', function() {
            const $field = $(this);
            const value = $field.val().trim();
            
            $field.removeClass('is-invalid is-valid');
            $field.next('.invalid-feedback, .valid-feedback').remove();
            
            if (!value) {
                $field.addClass('is-invalid');
                $field.after('<div class="invalid-feedback">この項目は必須です。</div>');
            } else {
                if ($field.attr('type') === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        $field.addClass('is-invalid');
                        $field.after('<div class="invalid-feedback">正しいメールアドレスを入力してください。</div>');
                    } else {
                        $field.addClass('is-valid');
                        $field.after('<div class="valid-feedback">正しい形式です。</div>');
                    }
                } else {
                    $field.addClass('is-valid');
                    $field.after('<div class="valid-feedback">入力完了。</div>');
                }
            }
        });

        // Form submission
        $form.on('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showAlert('error', 'すべての必須項目を正しく入力してください。');
                return;
            }
            
            // Show loading state
            $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>送信中...');
            
            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                // Show success message
                showAlert('success', 'お問い合わせを受け付けました。3営業日以内にご返信いたします。');
                
                // Reset form
                $form[0].reset();
                $form.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
                $form.find('.valid-feedback, .invalid-feedback').remove();
                
                // Reset button
                $submitBtn.prop('disabled', false).html(originalBtnText);
                
                // Scroll to top of form
                $('html, body').animate({
                    scrollTop: $form.offset().top - 100
                }, 500);
                
            }, 2000); // Simulate network delay
        });
    }

    // ==================== Alert System ====================
    
    function showAlert(type, message, duration = 5000) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
                <i class="${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $body.append(alertHtml);
        
        // Auto dismiss
        if (duration > 0) {
            setTimeout(function() {
                $('.alert').fadeOut(300, function() {
                    $(this).remove();
                });
            }, duration);
        }
    }

    // ==================== Newsletter Subscription ====================
    
    function initNewsletterForm() {
        $('.newsletter .btn').on('click', function() {
            const $input = $(this).siblings('input[type="email"]');
            const email = $input.val().trim();
            const $btn = $(this);
            const originalText = $btn.text();
            
            if (!email) {
                showAlert('error', 'メールアドレスを入力してください。', 3000);
                $input.focus();
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('error', '正しいメールアドレスを入力してください。', 3000);
                $input.focus();
                return;
            }
            
            // Show loading
            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
            
            // Simulate subscription
            setTimeout(function() {
                showAlert('success', 'メルマガ登録が完了しました。ありがとうございます！');
                $input.val('');
                $btn.prop('disabled', false).text(originalText);
            }, 1500);
        });
        
        // Enter key support
        $('.newsletter input[type="email"]').on('keypress', function(e) {
            if (e.which === 13) {
                $(this).siblings('.btn').click();
            }
        });
    }

    // ==================== Scroll Animations ====================
    
    function initScrollAnimations() {
        // Back to top button
        function initBackToTop() {
            const $backToTop = $('<button id="back-to-top" class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px; display: none; z-index: 1000; border-radius: 50%; width: 50px; height: 50px;"><i class="fas fa-chevron-up"></i></button>');
            $body.append($backToTop);
            
            $window.on('scroll', function() {
                if ($window.scrollTop() > 300) {
                    $backToTop.fadeIn();
                } else {
                    $backToTop.fadeOut();
                }
            });
            
            $backToTop.on('click', function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 800, 'easeInOutQuart');
            });
        }
        
        // Counter animation for stats (if added later)
        function animateCounters() {
            $('.counter').each(function() {
                const $counter = $(this);
                const target = parseInt($counter.text());
                
                if (target > 0) {
                    $counter.text('0');
                    $({ countNum: 0 }).animate({
                        countNum: target
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function() {
                            $counter.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $counter.text(target);
                        }
                    });
                }
            });
        }
        
        // Trigger counter animation when in viewport
        $window.on('scroll', function() {
            $('.counter').each(function() {
                const $counter = $(this);
                const elementTop = $counter.offset().top;
                const viewportBottom = $window.scrollTop() + $window.height();
                
                if (!$counter.hasClass('animated') && elementTop < viewportBottom - 100) {
                    $counter.addClass('animated');
                    animateCounters();
                }
            });
        });
        
        initBackToTop();
    }

    // ==================== Hero Section Enhancements ====================
    
    function initHeroSection() {
        // Initialize hero swiper
        const heroSwiper = initHeroSwiper();
        
        // Emergency alert functionality
        function initEmergencyAlert() {
            const $alertBanner = $('.emergency-alert');
            const $closeBtn = $alertBanner.find('.alert-close');
            
            // Close alert banner
            $closeBtn.on('click', function() {
                $alertBanner.slideUp(300, function() {
                    $(this).remove();
                    // Store in localStorage that user closed the alert
                    localStorage.setItem('emergency_alert_closed', 'true');
                });
            });
            
            // Check if alert was previously closed
            if (localStorage.getItem('emergency_alert_closed') === 'true') {
                $alertBanner.hide();
            }
        }
        
        // Weather widget functionality
        function initWeatherWidget() {
            const $weatherWidget = $('.weather-widget');
            if ($weatherWidget.length) {
                // Simulate weather data (replace with actual API call)
                const weatherData = {
                    date: '2024年8月15日（土）',
                    condition: '晴れ時々曇り',
                    temperature: '28°C',
                    humidity: '65%',
                    wind: '北東 2m/s',
                    icon: '☀️'
                };
                
                $weatherWidget.find('.weather-date').text(weatherData.date);
                $weatherWidget.find('.weather-condition').text(weatherData.condition);
                $weatherWidget.find('.weather-temp').text(weatherData.temperature);
                $weatherWidget.find('.weather-icon').text(weatherData.icon);
                
                // Add detailed info if elements exist
                $weatherWidget.find('.weather-humidity').text(weatherData.humidity);
                $weatherWidget.find('.weather-wind').text(weatherData.wind);
            }
        }
        
        // Typing effect for hero title (optional enhancement)
        function initTypingEffect() {
            const $typingElement = $('.typing-effect');
            if ($typingElement.length) {
                const text = $typingElement.text();
                $typingElement.text('');
                
                let i = 0;
                const typeWriter = function() {
                    if (i < text.length) {
                        $typingElement.text($typingElement.text() + text.charAt(i));
                        i++;
                        setTimeout(typeWriter, 100);
                    }
                };
                
                setTimeout(typeWriter, 1000);
            }
        }
        
        initEmergencyAlert();
        initWeatherWidget();
        initTypingEffect();
        
        return heroSwiper;
    }

    // ==================== Social Media Integration ====================
    
    function initSocialSharing() {
        // Add social sharing functionality
        function shareToSocial(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const description = encodeURIComponent('茨城県筑西市で開催される地域貢献イベント「Blue Expo（ブルーエキスポ）」');
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=ブルーエキスポ,茨城,筑西市`;
                    break;
                case 'line':
                    shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        // Add click handlers for social sharing (if share buttons are added)
        $(document).on('click', '[data-share]', function(e) {
            e.preventDefault();
            const platform = $(this).data('share');
            shareToSocial(platform);
        });
    }

    // ==================== Mobile Menu Enhancements ====================
    
    function initMobileMenu() {
        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            const $navbar = $('.navbar-collapse');
            if ($navbar.hasClass('show') && !$(e.target).closest('.navbar').length) {
                $navbar.collapse('hide');
            }
        });
        
        // Prevent body scroll when mobile menu is open
        $('.navbar-toggler').on('click', function() {
            setTimeout(function() {
                if ($('.navbar-collapse').hasClass('show')) {
                    $body.addClass('menu-open');
                } else {
                    $body.removeClass('menu-open');
                }
            }, 300);
        });
        
        // Handle dropdown menus in mobile
        $('.navbar-nav .dropdown-toggle').on('click', function(e) {
            if ($window.width() < 992) {
                e.preventDefault();
                const $dropdown = $(this).next('.dropdown-menu');
                $('.navbar-nav .dropdown-menu').not($dropdown).slideUp(200);
                $dropdown.slideToggle(200);
            }
        });
    }

    // ==================== Performance Optimizations ====================
    
    function initPerformanceOptimizations() {
        // Lazy loading for images (if more images are added)
        function lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
        
        // Throttle scroll events
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollDependentElements);
                ticking = true;
            }
        }
        
        function updateScrollDependentElements() {
            handleNavbarScroll();
            updateActiveNavigation();
            ticking = false;
        }
        
        $window.on('scroll', requestTick);
        
        lazyLoadImages();
    }

    // ==================== Accessibility Enhancements ====================
    
    function initAccessibilityFeatures() {
        // Keyboard navigation for custom elements
        $(document).on('keydown', '.custom-button', function(e) {
            if (e.which === 13 || e.which === 32) { // Enter or Space
                e.preventDefault();
                $(this).click();
            }
        });
        
        // Skip to main content link
        if (!$('#skip-to-main').length) {
            $body.prepend('<a href="#main-content" id="skip-to-main" class="sr-only sr-only-focusable">メインコンテンツにスキップ</a>');
        }
        
        // Focus management for modal dialogs (if added)
        function manageFocus() {
            $(document).on('shown.bs.modal', function(e) {
                const $modal = $(e.target);
                const $focusableElements = $modal.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if ($focusableElements.length) {
                    $focusableElements.first().focus();
                }
            });
        }
        
        manageFocus();
    }

    // ==================== Error Handling ====================
    
    function initErrorHandling() {
        // Global error handler
        window.addEventListener('error', function(e) {
            console.error('JavaScript Error:', e.error);
            // Optionally send error to analytics or logging service
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }

    // ==================== Analytics Integration ====================
    
    function initAnalytics() {
        // Track user interactions
        function trackEvent(action, category, label) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label
                });
            }
        }
        
        // Track button clicks
        $(document).on('click', '.btn', function() {
            const buttonText = $(this).text().trim();
            const section = $(this).closest('section').attr('id') || 'unknown';
            trackEvent('button_click', section, buttonText);
        });
        
        // Track form submissions
        $(document).on('submit', 'form', function() {
            const formId = $(this).attr('id') || 'unknown_form';
            trackEvent('form_submit', 'contact', formId);
        });
        
        // Track scroll depth
        let scrollDepthMarks = [25, 50, 75, 100];
        let scrollDepthReached = [];
        
        $window.on('scroll', function() {
            const scrollTop = $window.scrollTop();
            const docHeight = $document.height() - $window.height();
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            scrollDepthMarks.forEach(mark => {
                if (scrollPercent >= mark && !scrollDepthReached.includes(mark)) {
                    scrollDepthReached.push(mark);
                    trackEvent('scroll_depth', 'engagement', `${mark}%`);
                }
            });
        });
    }

    // ==================== Initialization ====================
    
    function init() {
        // Initialize all functionality
        initSmoothScrolling();
        initContactForm();
        initNewsletterForm();
        initScrollAnimations();
        const heroSwiper = initHeroSection();
        initSocialSharing();
        initMobileMenu();
        initPerformanceOptimizations();
        initAccessibilityFeatures();
        initErrorHandling();
        initAnalytics();
        
        // Initial calls
        handleNavbarScroll();
        updateActiveNavigation();
        
        // Store swiper instance globally if needed
        if (heroSwiper) {
            window.BlueExpo.heroSwiper = heroSwiper;
        }
        
        console.log('Blue Expo website initialized successfully!');
    }
    
    // Start initialization
    init();
    
    // ==================== Public API ====================
    
    // Expose useful functions globally
    window.BlueExpo = {
        showAlert: showAlert,
        heroSwiper: null, // Will be set during initialization
        trackEvent: function(action, category, label) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label
                });
            }
        },
        updateWeather: function(weatherData) {
            const $weatherWidget = $('.weather-widget');
            if ($weatherWidget.length && weatherData) {
                $weatherWidget.find('.weather-date').text(weatherData.date || '');
                $weatherWidget.find('.weather-condition').text(weatherData.condition || '');
                $weatherWidget.find('.weather-temp').text(weatherData.temperature || '');
                $weatherWidget.find('.weather-icon').text(weatherData.icon || '');
                $weatherWidget.find('.weather-humidity').text(weatherData.humidity || '');
                $weatherWidget.find('.weather-wind').text(weatherData.wind || '');
            }
        },
        showEmergencyAlert: function(message, type = 'warning') {
            const alertClass = type === 'danger' ? 'alert-danger' : 'alert-warning';
            const $existingAlert = $('.emergency-alert');
            
            if ($existingAlert.length) {
                $existingAlert.find('.alert-message').text(message);
                $existingAlert.removeClass('alert-warning alert-danger').addClass(alertClass);
                $existingAlert.show();
            } else {
                const alertHtml = `
                    <div class="emergency-alert alert ${alertClass} mb-0 text-center position-relative">
                        <div class="container">
                            <strong><i class="fas fa-exclamation-triangle me-2"></i>緊急のお知らせ</strong>
                            <span class="alert-message ms-2">${message}</span>
                            <button type="button" class="alert-close btn-close position-absolute end-0 me-3" style="top: 50%; transform: translateY(-50%);"></button>
                        </div>
                    </div>
                `;
                $('body').prepend(alertHtml);
            }
        }
    };
    
});

// ==================== Service Worker Registration ====================

// Register service worker for PWA functionality (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ==================== Custom Easing Functions ====================

// Add custom easing for jQuery animations
$.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
};