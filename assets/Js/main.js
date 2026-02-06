// Login
    //  Lấy các phần tử cần thiết
    const modal = document.getElementById('registerModal');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');

    // Tab và Form
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    //  Logic Ẩn/Hiện Modal (Như cũ)
    openBtn.onclick = () => modal.classList.remove('hidden');

    const closeModal = () => modal.classList.add('hidden');
    closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;

    //  LOGIC CHUYỂN TAB (MỚI THÊM)

    // Khi bấm vào Tab Đăng Nhập
    loginTab.onclick = () => {
      // Đổi màu tab
      loginTab.classList.add('active');
      registerTab.classList.remove('active');

      // Đổi form hiển thị
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    };

    // Khi bấm vào Tab Đăng Ký
    registerTab.onclick = () => {
      // Đổi màu tab
      registerTab.classList.add('active');
      loginTab.classList.remove('active');

      // Đổi form hiển thị
      registerForm.classList.remove('hidden'); // Hiện form đăng ký
      loginForm.classList.add('hidden');       // Ẩn form đăng nhập
    };
    document.querySelector('.toggle-password').onclick = function () {
      const input = this.previousElementSibling;
      input.type = input.type === 'password' ? 'text' : 'password';
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    };
    // End login

    // Slide-banner
    document.addEventListener('DOMContentLoaded', function () {
      //  Chọn vùng làm việc là .section-1
      const section1 = document.querySelector('.section-1');

      if (section1) {
        const wrapper = section1.querySelector('.slider-wrapper');
        const slides = section1.querySelectorAll('.slide');
        const nextBtn = section1.querySelector('.next-btn');
        const prevBtn = section1.querySelector('.prev-btn');
        const dotsContainer = section1.querySelector('.slider-dots');

        let currentIndex = 0;
        const totalSlides = slides.length;
        let slideInterval;

        //  TẠO DẤU CHẤM (DOTS) TỰ ĐỘNG
        slides.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.classList.add('dot');
          if (index === 0) dot.classList.add('active');

          // Bấm vào dot để chuyển slide
          dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            resetTimer();
          });

          dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        //  HÀM CẬP NHẬT SLIDER (Di chuyển ảnh & đổi màu dot)
        function updateSlider() {
          // Dịch chuyển khung wrapper
          wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

          // Cập nhật dot active
          dots.forEach(d => d.classList.remove('active'));
          if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
          }
        }

        //  CHUYỂN SLIDE TIẾP THEO
        function nextSlide() {
          currentIndex++;
          if (currentIndex >= totalSlides) {
            currentIndex = 0; // Quay về đầu
          }
          updateSlider();
        }

        //  QUAY LẠI SLIDE TRƯỚC
        function prevSlide() {
          currentIndex--;
          if (currentIndex < 0) {
            currentIndex = totalSlides - 1; // Quay về cuối
          }
          updateSlider();
        }

        //  GÁN SỰ KIỆN CHO NÚT BẤM
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
          });
        }

        //  TỰ ĐỘNG CHẠY (AUTO PLAY - 4 giây)
        function startAutoPlay() {
          slideInterval = setInterval(nextSlide, 4000);
        }

        function resetTimer() {
          clearInterval(slideInterval);
          startAutoPlay();
        }

        // Bắt đầu chạy
        startAutoPlay();
      }
    });
    // End Slide-banner