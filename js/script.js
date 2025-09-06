document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Functionality ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
    const overlay = document.getElementById('overlay');

    if (mobileMenuBtn && mobileNav && overlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        overlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        if (closeMobileNavBtn) {
            closeMobileNavBtn.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // --- Active Class to Nav Links on Scroll ---
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 100)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // --- Login/Logout UI Toggle (Client-side simulation) ---
    const navLoginBtn = document.getElementById('navLoginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    // Simple client-side flag to simulate login state
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Persist across sessions

    function updateLoginUI(loggedInState) {
        isLoggedIn = loggedInState;
        localStorage.setItem('isLoggedIn', loggedInState); // Save state
        if (navLoginBtn && mobileLoginBtn && logoutBtn && mobileLogoutBtn) {
            if (isLoggedIn) {
                navLoginBtn.style.display = 'none';
                mobileLoginBtn.style.display = 'none';
                logoutBtn.style.display = 'block';
                mobileLogoutBtn.style.display = 'block';
                const startAdventureBtn = document.getElementById('startAdventureBtn');
                if (startAdventureBtn) {
                    startAdventureBtn.textContent = 'Book Your Adventure';
                }
            } else {
                navLoginBtn.style.display = 'block';
                mobileLoginBtn.style.display = 'block';
                logoutBtn.style.display = 'none';
                mobileLogoutBtn.style.display = 'none';
                const startAdventureBtn = document.getElementById('startAdventureBtn');
                if (startAdventureBtn) {
                    startAdventureBtn.textContent = 'Start Your Adventure';
                }
            }
        }
    }

    // Initialize UI state on page load
    updateLoginUI(isLoggedIn); 

    // Logout functionality (client-side simulation)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Logged out (simulated)!');
            updateLoginUI(false);
            window.location.href = 'index.html'; // Redirect to home after logout
        });
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Logged out (simulated)!');
            updateLoginUI(false);
            window.location.href = 'index.html'; // Redirect to home after logout
        });
    }

    // --- Login Page Specific Functionality (Tabs - Adjusted) ---
    const loginTab = document.getElementById('loginTab');
    const loginForm = document.getElementById('loginForm');

    if (loginTab && loginForm) {
        // If it's the login.html page, ensure the login form is visible and active tab is set
        if (window.location.pathname.includes('login.html')) {
            loginTab.classList.add('active');
            loginForm.style.display = 'block';
        }
    }


    // --- Booking Form Pre-fill from URL Parameters ---
    const urlParams = new URLSearchParams(window.location.search);
    const packageName = urlParams.get('package');
    const eventName = urlParams.get('event');

    const preferredPackageInput = document.getElementById('preferredPackage');
    const adventureTypeSelect = document.getElementById('adventureType');
    const bookingAmountInput = document.getElementById('bookingAmount');

    if (preferredPackageInput && adventureTypeSelect && bookingAmountInput) {
        if (packageName) {
            preferredPackageInput.value = packageName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            if (packageName.includes('trek')) {
                adventureTypeSelect.value = 'trekking';
                bookingAmountInput.value = '4500';
            } else if (packageName.includes('camp')) {
                adventureTypeSelect.value = 'camping';
                bookingAmountInput.value = '3500';
            }
        } else if (eventName) {
            preferredPackageInput.value = eventName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            adventureTypeSelect.value = 'event';
            bookingAmountInput.value = '1000';
        }
    }

    // --- Razorpay Payment Submission Logic (Requires Node.js Backend) ---
    const bookingForm = document.querySelector('.booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const adventureType = document.getElementById('adventureType').value;
            const preferredPackage = document.getElementById('preferredPackage').value;
            const startDate = document.getElementById('startDate').value;
            const numGuests = document.getElementById('numGuests').value;
            const message = document.getElementById('message').value;
            const amount = document.getElementById('bookingAmount').value;

            if (!firstName || !lastName || !email || !adventureType || !startDate || !numGuests || !amount) {
                alert('Please fill in all required fields.');
                return;
            }
            if (parseFloat(amount) <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
            if (numGuests <= 0) {
                alert('Number of guests must be at least 1.');
                return;
            }

            const bookingData = {
                firstName, lastName, email, phone, adventureType,
                preferredPackage, startDate, numGuests, message,
                amount: parseFloat(amount)
            };

            console.log('Attempting to create Razorpay order with data:', bookingData);
            alert('Razorpay payment initiation simulated. This requires a Node.js backend to create the order and verify payment.');

            // Placeholder for actual Razorpay integration
            // In a real app, you'd make a fetch call to your backend:
            /*
            try {
                const response = await fetch('http://localhost:3000/api/bookings/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                });

                const orderResponse = await response.json();

                if (!response.ok) {
                    throw new Error(orderResponse.message || 'Failed to create order on server.');
                }

                const options = {
                    key: orderResponse.key_id,
                    amount: orderResponse.amount,
                    currency: orderResponse.currency,
                    name: "Karbi Anglong Adventures",
                    description: `Booking for ${preferredPackage || adventureType}`,
                    order_id: orderResponse.orderId,
                    handler: async function (response) {
                        // This handler runs after successful payment on Razorpay's side
                        // You'd then verify the payment on your backend
                        const verifyResponse = await fetch('http://localhost:3000/api/bookings/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });
                        const verifyResult = await verifyResponse.json();
                        if (verifyResponse.ok && verifyResult.success) {
                            alert('Booking Confirmed! Your payment was successful.');
                            bookingForm.reset();
                        } else {
                            alert('Payment successful, but verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: `${firstName} ${lastName}`,
                        email: email,
                        contact: phone,
                    },
                    theme: {
                        color: "#E63946"
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();

                rzp.on('payment.failed', function (response) {
                    alert('Payment Failed: ' + response.error.description);
                });

            } catch (error) {
                console.error('Error initiating booking or payment:', error);
                alert('Booking initiation failed: ' + error.message);
            }
            */
        });
    }

    // --- Payment Method Visual Selection (for booking.html) ---
    const paymentMethodItems = document.querySelectorAll('.payment-method-item');
    if (paymentMethodItems.length > 0) {
        paymentMethodItems.forEach(item => {
            item.addEventListener('click', () => {
                paymentMethodItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                const radioButton = item.querySelector('input[type="radio"]');
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
        });
    }

    // --- User Authentication (Login Page) ---
    const loginEmailPassBtn = document.getElementById('loginEmailPassBtn');
    const signInGoogleBtn = document.getElementById('signInGoogleBtn');
    const signInFacebookBtn = document.getElementById('signInFacebookBtn');

    if (loginEmailPassBtn) {
        loginEmailPassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            console.log(`Attempting to login with Email: ${email}, Password: ${password}`);
            alert('Login with Email/Password simulated. This requires a backend to authenticate.');
            // In a real app, you'd send this to your backend for authentication
            // Example: fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
            updateLoginUI(true); // Simulate successful login
            window.location.href = 'index.html';
        });
    }
    if (signInGoogleBtn) {
        signInGoogleBtn.addEventListener('click', () => {
            console.log('Attempting Google login...');
            alert('Google login simulated. This requires a backend and OAuth setup.');
            // In a real app, you'd redirect to your backend's Google OAuth endpoint
            updateLoginUI(true); // Simulate successful login
            window.location.href = 'index.html';
        });
    }
    if (signInFacebookBtn) {
        signInFacebookBtn.addEventListener('click', () => {
            console.log('Attempting Facebook login...');
            alert('Facebook login simulated. This requires a backend and OAuth setup.');
            updateLoginUI(true); // Simulate successful login
            window.location.href = 'index.html';
        });
    }


    // --- User Authentication (Register Page) ---
    const registerForm = document.getElementById('registerForm');
    const registerEmailPassBtn = document.getElementById('registerEmailPassBtn');
    const registerGoogleBtn = document.getElementById('registerGoogleBtn');
    const registerFacebookBtn = document.getElementById('registerFacebookBtn');
    const registerPhoneBtn = document.getElementById('registerPhoneBtn');
    const phoneOtpSection = document.getElementById('phoneOtpSection');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpInputGroup = document.getElementById('otpInputGroup');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');

    if (registerEmailPassBtn) {
        registerEmailPassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            console.log(`Attempting to register with Email: ${email}, Name: ${name}`);
            alert('Registration with Email/Password simulated. This requires a backend to register the user.');
            // In a real app, send data to backend: fetch('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
            updateLoginUI(true); // Simulate successful registration
            window.location.href = 'index.html';
        });
    }

    if (registerGoogleBtn) {
        registerGoogleBtn.addEventListener('click', () => {
            console.log('Attempting Google registration...');
            alert('Google registration simulated. This requires a backend and OAuth setup.');
            updateLoginUI(true); // Simulate successful registration
            window.location.href = 'index.html';
        });
    }
    if (registerFacebookBtn) {
        registerFacebookBtn.addEventListener('click', () => {
            console.log('Attempting Facebook registration...');
            alert('Facebook registration simulated. This requires a backend and OAuth setup.');
            updateLoginUI(true); // Simulate successful registration
            window.location.href = 'index.html';
        });
    }

    if (registerPhoneBtn) {
        registerPhoneBtn.addEventListener('click', () => {
            console.log('Showing phone OTP section...');
            if (phoneOtpSection) {
                phoneOtpSection.style.display = 'block';
                // Scroll to the phone section for better UX
                phoneOtpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const phoneNumber = document.getElementById('phoneInput').value;
            if (!phoneNumber) {
                alert('Please enter a phone number.');
                return;
            }
            console.log(`Attempting to send OTP to: ${phoneNumber}`);
            alert('OTP sent (simulated)! Please enter it below. This requires a backend to send the actual OTP.');
            if (otpInputGroup) {
                otpInputGroup.style.display = 'block'; // Show OTP input
            }
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', () => {
            const otpCode = document.getElementById('otpCode').value;
            if (!otpCode) {
                alert('Please enter the OTP code.');
                return;
            }
            console.log(`Attempting to verify OTP: ${otpCode}`);
            alert('OTP verification simulated. This requires a backend to verify the OTP.');
            updateLoginUI(true); // Simulate successful registration
            window.location.href = 'index.html';
        });
    }


    // --- Admin Authentication (Admin Login Page) ---
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn'); // In admin-dashboard.html
    const mobileAdminLogoutBtn = document.getElementById('mobileAdminLogoutBtn'); // In admin-dashboard.html mobile nav

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const adminEmail = document.getElementById('adminEmail').value;
            const adminPassword = document.getElementById('adminPassword').value;

            // Simple client-side check for demonstration ONLY. NOT SECURE for production.
            if (adminEmail === 'admin@example.com' && adminPassword === 'adminpass') {
                alert('Admin Login Successful (simulated)!');
                localStorage.setItem('isAdminLoggedIn', 'true'); // Simulate admin login state
                window.location.href = 'dashboard.html'; // Redirect to dashboard.html within admin folder
            } else {
                alert('Invalid Admin Credentials (simulated).');
            }
            console.log(`Attempting Admin login with Email: ${adminEmail}, Password: ${adminPassword}`);
            // In a real app, send this to your backend for secure admin authentication
        });
    }

    // Admin Logout (client-side simulation)
    function updateAdminLoginUI(loggedInState) {
        localStorage.setItem('isAdminLoggedIn', loggedInState);
        // Logic to show/hide admin-specific UI elements if any
    }

    // Check if on admin dashboard page
    if (window.location.pathname.includes('admin/dashboard.html')) {
        if (adminLogoutBtn) { // Ensure button exists on this page
            adminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Admin Logged out (simulated)!');
                window.location.href = 'login.html'; // Redirect to admin login page
            });
        }
        if (mobileAdminLogoutBtn) { // Ensure button exists on this page
            mobileAdminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Admin Logged out (simulated)!');
                window.location.href = 'login.html'; // Redirect to admin login page
            });
        }

        // Enforce admin login for dashboard access
        if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
            alert('Unauthorized access. Please log in as admin.');
            window.location.href = 'login.html'; // Redirect to admin login page
        }
    }

}); // End of DOMContentLoaded
