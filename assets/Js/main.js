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
    // 1. Xử lý click chọn Phim ở cột đầu tiên
    const movieItems = document.querySelectorAll('.movie-item');
    const summaryMovie = document.getElementById('summary-movie');

    movieItems.forEach(item => {
        item.addEventListener('click', function() {
            // Xóa trạng thái active của tất cả phim, sau đó gán cho phim vừa click
            movieItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Cập nhật tên phim xuống thanh Tóm tắt đơn hàng bên dưới
            if (summaryMovie) {
                const movieName = this.querySelector('.movie-item-name').textContent;
                summaryMovie.textContent = movieName;
            }
        });
    });

    // 2. Xử lý click chọn Rạp ở cột thứ hai
    const cinemaItems = document.querySelectorAll('.cinema-item');
    const summaryCinema = document.getElementById('summary-cinema');

    cinemaItems.forEach(item => {
        item.addEventListener('click', function() {
            // Xóa trạng thái active của tất cả rạp, gán cho rạp vừa click
            cinemaItems.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Cập nhật tên rạp xuống thanh Tóm tắt đơn hàng
            if (summaryCinema) {
                const cinemaName = this.querySelector('.cinema-item-name').textContent;
                summaryCinema.textContent = cinemaName;
            }
        });
    });

    // 3. Xử lý click chọn tab Ngày chiếu
    const dateTabs = document.querySelectorAll('.date-tab');

    dateTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Đổi trạng thái active cho ngày được chọn
            dateTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Gọi hàm ghép chuỗi ngày + giờ để hiển thị
            updateSummaryShowtime();
        });
    });

    // 4. Xử lý click chọn Giờ chiếu
    const timeSlots = document.querySelectorAll('.time-slot:not(.disabled)');
    const summaryShowtime = document.getElementById('summary-showtime');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Đổi trạng thái active cho giờ được chọn (bỏ qua các nút đã bị mờ - disabled)
            timeSlots.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Gọi hàm ghép chuỗi ngày + giờ
            updateSummaryShowtime();
        });
    });

    // 5. Hàm ghép Ngày và Giờ thành một chuỗi hoàn chỉnh
    function updateSummaryShowtime() {
        if (!summaryShowtime) return; // Nếu không có DOM này thì thoát
        
        // Tìm ngày và giờ đang được chọn
        const activeDate = document.querySelector('.date-tab.active');
        const activeTime = document.querySelector('.time-slot.active');
        
        // Nếu chọn đủ cả hai thì xuất ra định dạng (VD: 14:00 - Hôm nay 09/03)
        if (activeDate && activeTime) {
            const day = activeDate.querySelector('.date-tab-day').textContent;
            const date = activeDate.querySelector('.date-tab-date').textContent;
            const time = activeTime.textContent;
            summaryShowtime.textContent = `${time} - ${day} ${date}`;
        }
    }

    // 6. Xử lý click chọn Rạp ở cột Sidebar (dành riêng cho trang cinema.html)
    const sidebarCinemaItems = document.querySelectorAll('.sidebar-cinema-item');

    sidebarCinemaItems.forEach(item => {
        item.addEventListener('click', function() {
            // Đổi trạng thái rạp đang được chọn ở danh sách dọc
            sidebarCinemaItems.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 7. Tạo hiệu ứng chuyển động khi rê chuột vào các nút giờ chiếu (Trang cinema.html)
    const timeBtns = document.querySelectorAll('.time-btn:not(.disabled)');

    timeBtns.forEach(btn => {
        // Rê chuột vào: đẩy nút lên trên 2px
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        // Rút chuột ra: trả về vị trí cũ
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });