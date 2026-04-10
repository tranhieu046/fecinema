const STORAGE_KEYS = {
  bookingDraft: 'latteCinemaBookingDraft',
  tickets: 'latteCinemaTickets',
  loggedIn: 'latteCinemaLoggedIn'
};

const SEAT_PRICES = {
  standard: 70000,
  vip: 90000,
  couple: 120000
};

const SEAT_LABELS = {
  standard: 'Ghế thường',
  vip: 'Ghế VIP',
  couple: 'Ghế đôi'
};

const SEAT_LAYOUT = [
  { row: 'A', seats: ['standard', 'standard', 'standard', 'booked', 'booked', 'standard', 'standard', 'standard', 'standard', 'standard'] },
  { row: 'B', seats: ['standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'booked', 'standard'] },
  { row: 'C', seats: ['standard', 'standard', 'standard', 'vip', 'vip', 'vip', 'vip', 'vip', 'vip', 'vip'] },
  { row: 'D', seats: ['standard', 'standard', 'vip', 'vip', 'vip', 'vip', 'vip', 'vip', 'booked', 'vip'] },
  { row: 'E', seats: ['standard', 'standard', 'standard', 'vip', 'vip', 'vip', 'vip', 'standard', 'standard', 'standard'] },
  { row: 'F', seats: ['standard', 'standard', 'standard', 'couple', 'couple', 'couple', 'couple', 'standard', 'standard', 'standard'] },
  { row: 'G', seats: ['standard', 'booked', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard'] },
  { row: 'H', seats: ['standard', 'standard', 'booked', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard', 'standard'] }
];

const DEFAULT_TICKETS = [
  {
    id: 'BK24041019',
    code: 'BK24041019',
    movieTitle: 'Lật Mặt 8: Vòng Tay Nắng',
    poster: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
    cinemaName: 'CGV Vincom Thủ Đức',
    roomName: 'Phòng 04',
    showtime: '19:30 · 10/04/2026',
    format: '2D',
    seats: ['B4', 'B5', 'D6', 'D7'],
    totalPrice: 320000,
    createdAt: '10/04/2026 18:58',
    statusKey: 'paid',
    statusLabel: 'Đã Thanh Toán'
  },
  {
    id: 'BK24041109',
    code: 'BK24041109',
    movieTitle: 'Địa Đạo: Mặt Trời Trong Bóng Tối',
    poster: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
    cinemaName: 'Lotte Cinema Gò Vấp',
    roomName: 'Phòng 07',
    showtime: '21:15 · 11/04/2026',
    format: 'IMAX',
    seats: ['E8', 'E9'],
    totalPrice: 180000,
    createdAt: '10/04/2026 20:10',
    statusKey: 'pending',
    statusLabel: 'Chờ Xử Lý'
  }
];

function safeParseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getBookingDraft() {
  return safeParseJSON(sessionStorage.getItem(STORAGE_KEYS.bookingDraft), null);
}

function saveBookingDraft(draft) {
  sessionStorage.setItem(STORAGE_KEYS.bookingDraft, JSON.stringify(draft));
}

function clearBookingDraft() {
  sessionStorage.removeItem(STORAGE_KEYS.bookingDraft);
}

function getStoredTickets() {
  return safeParseJSON(localStorage.getItem(STORAGE_KEYS.tickets), []);
}

function saveStoredTickets(tickets) {
  localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
}

function getAllTickets() {
  const storedTickets = getStoredTickets();
  return storedTickets.length > 0 ? storedTickets : [...DEFAULT_TICKETS];
}

function formatCurrency(amount) {
  return `${Number(amount || 0).toLocaleString('vi-VN')}đ`;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function createBookingDraftFromDOM() {
  const activeMovie = document.querySelector('.movie-item.active');
  const activeCinema = document.querySelector('.cinema-item.active');
  const activeDate = document.querySelector('.date-tab.active');
  const activeTime = document.querySelector('.time-slot.active');

  if (!activeMovie || !activeCinema || !activeDate || !activeTime) {
    return null;
  }

  const formatType = activeTime.closest('.showtime-format')?.querySelector('.format-type')?.textContent.trim() || '2D Phụ đề';
  const movieTitle = activeMovie.querySelector('.movie-item-name')?.textContent.trim() || 'Chưa chọn phim';
  const cinemaName = activeCinema.querySelector('.cinema-item-name')?.textContent.trim() || 'Chưa chọn rạp';
  const cinemaAddress = activeCinema.querySelector('.cinema-item-address')?.textContent.trim() || '';
  const dayLabel = activeDate.querySelector('.date-tab-day')?.textContent.trim() || '';
  const dateLabel = activeDate.querySelector('.date-tab-date')?.textContent.trim() || '';
  const timeLabel = activeTime.textContent.trim();

  return {
    movieId: activeMovie.dataset.movie || '',
    movieTitle,
    poster: activeMovie.dataset.poster || activeMovie.querySelector('img')?.getAttribute('src') || 'assets/images/img-item-1.jpg',
    genre: activeMovie.dataset.genre || activeMovie.querySelector('.movie-item-genre')?.textContent.trim() || '',
    duration: activeMovie.dataset.duration || activeMovie.querySelector('.movie-item-duration')?.textContent.trim() || '',
    rating: activeMovie.dataset.rating || activeMovie.querySelector('.rating-badge')?.textContent.trim() || '',
    cinemaId: activeCinema.dataset.cinema || '',
    cinemaName,
    cinemaAddress,
    showtimeDate: activeDate.dataset.date || '',
    showtimeDay: dayLabel,
    showtimeDateLabel: dateLabel,
    showtimeTime: timeLabel,
    showtimeFormat: formatType,
    showtimeLabel: `${timeLabel} - ${dayLabel} ${dateLabel}`,
    seats: [],
    totalPrice: 0,
    expiresAt: Date.now() + 10 * 60 * 1000
  };
}

function updateLoginUI(openBtn) {
  if (!openBtn) {
    return;
  }

  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true';
  if (!isLoggedIn) {
    openBtn.textContent = 'Đăng nhập/Đăng kí';
    return;
  }

  openBtn.textContent = 'Đăng xuất';
}

function initAuthModal() {
  const modal = document.getElementById('registerModal');
  const openBtn = document.getElementById('openBtn');
  const closeBtn = document.getElementById('closeBtn');
  const overlay = document.getElementById('overlay');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  updateLoginUI(openBtn);

  if (!modal || !openBtn || !closeBtn || !overlay || !loginTab || !registerTab || !loginForm || !registerForm) {
    return;
  }

  const openModal = () => {
    if (localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true') {
      localStorage.removeItem(STORAGE_KEYS.loggedIn);
      updateLoginUI(openBtn);
      return;
    }
    modal.classList.remove('hidden');
  };

  const closeModal = () => modal.classList.add('hidden');

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', function () {
      const input = this.previousElementSibling;
      if (!input) {
        return;
      }
      input.type = input.type === 'password' ? 'text' : 'password';
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });

  const mockSubmit = (form, message) => {
    const submitBtn = form.querySelector('.submit-btn');
    if (!submitBtn) {
      return;
    }
    submitBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEYS.loggedIn, 'true');
      updateLoginUI(openBtn);
      closeModal();
      alert(message);
    });
  };

  mockSubmit(loginForm, 'Đăng nhập demo thành công.');
  mockSubmit(registerForm, 'Đăng ký demo thành công.');
}

function initHomeSlider() {
  const section = document.querySelector('.section-1');
  if (!section) {
    return;
  }

  const wrapper = section.querySelector('.slider-wrapper');
  const slides = section.querySelectorAll('.slide');
  const nextBtn = section.querySelector('.next-btn');
  const prevBtn = section.querySelector('.prev-btn');
  const dotsContainer = section.querySelector('.slider-dots');

  if (!wrapper || slides.length === 0 || !dotsContainer) {
    return;
  }

  let currentIndex = 0;
  let slideInterval = null;

  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function updateSlider() {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  function resetAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    slideInterval = setInterval(nextSlide, 4000);
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  resetAutoPlay();
}

function initBookingPage() {
  const bookingSection = document.querySelector('.booking-section');
  if (!bookingSection) {
    return;
  }

  const movieItems = bookingSection.querySelectorAll('.movie-item');
  const cinemaItems = bookingSection.querySelectorAll('.cinema-item');
  const dateTabs = bookingSection.querySelectorAll('.date-tab');
  const timeSlots = bookingSection.querySelectorAll('.time-slot:not(.disabled)');
  const summaryMovie = document.getElementById('summary-movie');
  const summaryCinema = document.getElementById('summary-cinema');
  const summaryShowtime = document.getElementById('summary-showtime');
  const continueBtn = document.getElementById('booking-continue-btn');

  const updateSummaryShowtime = () => {
    const activeDate = bookingSection.querySelector('.date-tab.active');
    const activeTime = bookingSection.querySelector('.time-slot.active');
    if (!summaryShowtime || !activeDate || !activeTime) {
      return;
    }
    const day = activeDate.querySelector('.date-tab-day')?.textContent.trim() || '';
    const date = activeDate.querySelector('.date-tab-date')?.textContent.trim() || '';
    summaryShowtime.textContent = `${activeTime.textContent.trim()} - ${day} ${date}`;
  };

  movieItems.forEach((item) => {
    item.addEventListener('click', function () {
      movieItems.forEach((movie) => movie.classList.remove('active'));
      this.classList.add('active');
      if (summaryMovie) {
        summaryMovie.textContent = this.querySelector('.movie-item-name')?.textContent.trim() || '';
      }
    });
  });

  cinemaItems.forEach((item) => {
    item.addEventListener('click', function () {
      cinemaItems.forEach((cinema) => cinema.classList.remove('active'));
      this.classList.add('active');
      if (summaryCinema) {
        summaryCinema.textContent = this.querySelector('.cinema-item-name')?.textContent.trim() || '';
      }
    });
  });

  dateTabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      dateTabs.forEach((dateTab) => dateTab.classList.remove('active'));
      this.classList.add('active');
      updateSummaryShowtime();
    });
  });

  timeSlots.forEach((slot) => {
    slot.addEventListener('click', function () {
      timeSlots.forEach((timeSlot) => timeSlot.classList.remove('active'));
      this.classList.add('active');
      updateSummaryShowtime();
    });
  });

  updateSummaryShowtime();

  continueBtn?.addEventListener('click', () => {
    const draft = createBookingDraftFromDOM();
    if (!draft) {
      alert('Vui lòng chọn đầy đủ phim, rạp và suất chiếu.');
      return;
    }
    saveBookingDraft(draft);
    window.location.href = 'seat-selection.html';
  });
}

function renderSeatSelectionSummary(summaryContainer, selectedSeats) {
  if (!summaryContainer) {
    return { totalPrice: 0 };
  }

  if (selectedSeats.length === 0) {
    summaryContainer.innerHTML = '<div class="seat-selection-inner-summary-empty">Chưa chọn ghế nào. Hãy chọn ghế để tiếp tục thanh toán.</div>';
    return { totalPrice: 0 };
  }

  const grouped = selectedSeats.reduce((result, seat) => {
    result[seat.type] = result[seat.type] || [];
    result[seat.type].push(seat);
    return result;
  }, {});

  let totalPrice = 0;
  summaryContainer.innerHTML = Object.entries(grouped).map(([type, seats]) => {
    const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    totalPrice += subtotal;
    return `
      <div class="seat-selection-inner-summary-block">
        <div class="seat-selection-inner-summary-row">
          <span class="seat-selection-inner-summary-label">${SEAT_LABELS[type]} × ${seats.length}<br><span class="seat-selection-inner-summary-seats">${seats.map((seat) => seat.code).join(', ')}</span></span>
          <span class="seat-selection-inner-summary-price">${formatCurrency(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  return { totalPrice };
}

function initSeatSelectionPage() {
  const seatPage = document.querySelector('.seat-selection-page');
  if (!seatPage) {
    return;
  }

  const draft = getBookingDraft() || {
    movieTitle: 'Không còn chúng ta',
    cinemaName: 'LatteCinema Vincom Bà Triệu',
    showtimeLabel: '14:00 - Hôm nay 09/03',
    showtimeTime: '14:00',
    showtimeDateLabel: '09/03/2026',
    showtimeFormat: '2D Phụ đề',
    poster: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
    seats: []
  };

  const subtitle = document.getElementById('seat-selection-subtitle');
  const movieName = document.getElementById('seat-selection-movie-name');
  const cinemaName = document.getElementById('seat-selection-cinema-name');
  const showtime = document.getElementById('seat-selection-showtime');
  const rowLabels = document.getElementById('seat-selection-row-labels');
  const seatGrid = document.getElementById('seat-selection-grid');
  const colLabels = document.getElementById('seat-selection-col-labels');
  const summaryItems = document.getElementById('seat-selection-summary-items');
  const totalPrice = document.getElementById('seat-selection-total-price');
  const continueBtn = document.getElementById('seat-selection-continue');

  if (!rowLabels || !seatGrid || !colLabels || !summaryItems || !totalPrice || !continueBtn) {
    return;
  }

  subtitle.textContent = `${draft.movieTitle} - ${draft.cinemaName}`;
  movieName.textContent = draft.movieTitle;
  cinemaName.textContent = draft.cinemaName;
  showtime.textContent = draft.showtimeLabel;

  const selectedCodes = new Set(draft.seats || []);

  rowLabels.innerHTML = SEAT_LAYOUT.map((row) => `<span class="seat-selection-inner-row-label">${row.row}</span>`).join('');
  colLabels.innerHTML = Array.from({ length: 10 }, (_, index) => `<span class="seat-selection-inner-col-label">${index + 1}</span>`).join('');

  function getSelectedSeatObjects() {
    return Array.from(selectedCodes).map((code) => {
      const row = code.charAt(0);
      const seatNumber = Number(code.slice(1));
      const rowData = SEAT_LAYOUT.find((seatRow) => seatRow.row === row);
      const type = rowData?.seats[seatNumber - 1] || 'standard';
      return {
        code,
        type,
        price: SEAT_PRICES[type] || 0
      };
    });
  }

  function persistDraft(total) {
    saveBookingDraft({
      ...draft,
      seats: Array.from(selectedCodes),
      totalPrice: total,
      expiresAt: draft.expiresAt || Date.now() + 10 * 60 * 1000
    });
  }

  function refreshSummary() {
    const selectedSeatObjects = getSelectedSeatObjects();
    const summary = renderSeatSelectionSummary(summaryItems, selectedSeatObjects);
    totalPrice.textContent = formatCurrency(summary.totalPrice);
    continueBtn.disabled = selectedSeatObjects.length === 0;
    persistDraft(summary.totalPrice);
  }

  function renderSeatGrid() {
    seatGrid.innerHTML = SEAT_LAYOUT.map((row) => {
      const buttons = row.seats.map((type, index) => {
        const code = `${row.row}${index + 1}`;
        const seatClasses = ['seat-selection-inner-seat'];

        if (type === 'booked') {
          seatClasses.push('seat-selection-inner-seat-booked');
        } else {
          seatClasses.push(`seat-selection-inner-seat-${type}`);
        }

        if (selectedCodes.has(code)) {
          seatClasses.push('seat-selection-inner-seat-selected');
        }

        return `
          <button
            class="${seatClasses.join(' ')}"
            type="button"
            data-seat-code="${code}"
            ${type === 'booked' ? 'disabled' : ''}
            title="${code}"
          ></button>
        `;
      }).join('');

      return `<div class="seat-selection-inner-seat-row">${buttons}</div>`;
    }).join('');

    seatGrid.querySelectorAll('.seat-selection-inner-seat:not(.seat-selection-inner-seat-booked)').forEach((button) => {
      button.addEventListener('click', () => {
        const seatCode = button.dataset.seatCode;
        if (!seatCode) {
          return;
        }

        if (selectedCodes.has(seatCode)) {
          selectedCodes.delete(seatCode);
        } else {
          selectedCodes.add(seatCode);
        }

        renderSeatGrid();
        refreshSummary();
      });
    });
  }

  renderSeatGrid();
  refreshSummary();

  continueBtn.addEventListener('click', () => {
    if (selectedCodes.size === 0) {
      alert('Hãy chọn ít nhất một ghế trước khi thanh toán.');
      return;
    }
    window.location.href = 'payment.html';
  });
}

function initPaymentPage() {
  const paymentPage = document.querySelector('.payment-page');
  if (!paymentPage) {
    return;
  }

  const draft = getBookingDraft();
  if (!draft || !draft.seats || draft.seats.length === 0) {
    window.location.href = 'seat-selection.html';
    return;
  }

  const subtitle = document.getElementById('payment-subtitle');
  const moviePoster = document.getElementById('payment-movie-poster');
  const movieName = document.getElementById('payment-movie-name');
  const cinemaName = document.getElementById('payment-cinema-name');
  const showtime = document.getElementById('payment-showtime');
  const seatBadge = document.getElementById('payment-seat-badge');
  const seatCount = document.getElementById('payment-seat-count');
  const totalPrice = document.getElementById('payment-total-price');
  const countdown = document.getElementById('payment-countdown');
  const submitBtn = document.getElementById('payment-submit-btn');
  const submitInlineBtn = document.getElementById('payment-submit-inline');

  subtitle.textContent = `${draft.movieTitle} - ${draft.cinemaName}`;
  moviePoster.src = draft.poster;
  moviePoster.alt = draft.movieTitle;
  movieName.textContent = draft.movieTitle;
  cinemaName.textContent = draft.cinemaName;
  showtime.textContent = `${draft.showtimeTime} · ${draft.showtimeDateLabel} · ${draft.showtimeFormat}`;
  seatBadge.textContent = `Ghế: ${draft.seats.join(', ')}`;
  seatCount.textContent = `${draft.seats.length} vé`;
  totalPrice.textContent = formatCurrency(draft.totalPrice);
  submitInlineBtn.textContent = `👛 THANH TOÁN ${formatCurrency(draft.totalPrice)}`;

  const expiresAt = draft.expiresAt || Date.now() + 10 * 60 * 1000;
  saveBookingDraft({ ...draft, expiresAt });

  const updateCountdown = () => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
    countdown.textContent = `${minutes}:${seconds}`;

    const isExpired = remaining === 0;
    submitBtn.disabled = isExpired;
    submitInlineBtn.disabled = isExpired;

    if (isExpired) {
      submitBtn.textContent = 'HẾT THỜI GIAN GIỮ GHẾ';
      submitInlineBtn.textContent = '⏱ HẾT THỜI GIAN';
    }
  };

  updateCountdown();
  const timer = setInterval(() => {
    updateCountdown();
    if (Date.now() >= expiresAt) {
      clearInterval(timer);
    }
  }, 1000);

  const completePayment = () => {
    if (Date.now() >= expiresAt) {
      alert('Đơn vé đã hết thời gian giữ ghế. Vui lòng chọn lại ghế.');
      return;
    }

    const ticketCode = `BK${Date.now().toString().slice(-8)}`;
    const ticket = {
      id: ticketCode,
      code: ticketCode,
      movieTitle: draft.movieTitle,
      poster: draft.poster,
      cinemaName: draft.cinemaName,
      roomName: 'Phòng 04',
      showtime: `${draft.showtimeTime} · ${draft.showtimeDateLabel}`,
      format: draft.showtimeFormat,
      seats: draft.seats,
      totalPrice: draft.totalPrice,
      createdAt: formatDateTime(new Date()),
      statusKey: 'paid',
      statusLabel: 'Đã Thanh Toán'
    };

    const currentTickets = getAllTickets().filter((item) => item.id !== ticket.id);
    saveStoredTickets([ticket, ...currentTickets]);
    clearBookingDraft();
    window.location.href = 'my-tickets.html';
  };

  submitBtn.addEventListener('click', completePayment);
  submitInlineBtn.addEventListener('click', completePayment);
}

function createTicketCard(ticket) {
  const statusClassMap = {
    paid: 'my-tickets-inner-card-status-paid',
    confirmed: 'my-tickets-inner-card-status-paid',
    pending: 'my-tickets-inner-card-status-pending',
    cancelled: 'my-tickets-inner-card-status-cancelled'
  };

  const statusClass = statusClassMap[ticket.statusKey] || 'my-tickets-inner-card-status-pending';
  const showQrButton = ticket.statusKey !== 'cancelled';
  const showCancelButton = ticket.statusKey !== 'cancelled';

  return `
    <article class="my-tickets-inner-card" data-ticket-id="${ticket.id}">
      <div class="my-tickets-inner-card-poster">
        <img src="${ticket.poster}" alt="${ticket.movieTitle}">
      </div>
      <div class="my-tickets-inner-card-body">
        <div class="my-tickets-inner-card-header">
          <h2 class="my-tickets-inner-card-title">${ticket.movieTitle}</h2>
          <span class="my-tickets-inner-card-status ${statusClass}">${ticket.statusLabel}</span>
        </div>
        <div class="my-tickets-inner-card-details">
          <div class="my-tickets-inner-card-row"><span class="my-tickets-inner-card-row-icon"><i class="fa-solid fa-location-dot"></i></span><span>${ticket.cinemaName}</span><span class="my-tickets-inner-card-dot">·</span><span>${ticket.roomName}</span></div>
          <div class="my-tickets-inner-card-row"><span class="my-tickets-inner-card-row-icon"><i class="fa-solid fa-calendar-days"></i></span><span>${ticket.showtime}</span><span class="my-tickets-inner-card-format">${ticket.format}</span></div>
          <div class="my-tickets-inner-card-row"><span class="my-tickets-inner-card-seat-dot"></span><span>Ghế: <strong>${ticket.seats.join(', ')}</strong></span></div>
        </div>
        <div class="my-tickets-inner-card-footer">
          <div class="my-tickets-inner-card-meta">
            <span class="my-tickets-inner-card-price">${formatCurrency(ticket.totalPrice)}</span>
            <span class="my-tickets-inner-card-code">Mã: ${ticket.code}</span>
            <span class="my-tickets-inner-card-date">${ticket.createdAt}</span>
          </div>
          <div class="my-tickets-inner-card-actions">
            ${showQrButton ? '<button class="my-tickets-inner-card-qr" type="button">QR Xem Vé</button>' : ''}
            ${showCancelButton ? '<button class="my-tickets-inner-card-cancel" type="button">Hủy vé</button>' : ''}
          </div>
        </div>
      </div>
    </article>
  `;
}

function initMyTicketsPage() {
  const page = document.querySelector('.my-tickets-page');
  if (!page) {
    return;
  }

  const list = document.getElementById('my-tickets-list');
  const emptyState = document.getElementById('my-tickets-empty');
  const tabs = page.querySelectorAll('[data-ticket-filter]');
  const searchInput = document.getElementById('my-tickets-search');
  const reloadButton = document.getElementById('my-tickets-reload');

  let activeFilter = 'all';
  let query = '';
  let tickets = getAllTickets();

  const renderTickets = () => {
    const filteredTickets = tickets.filter((ticket) => {
      const matchesFilter = activeFilter === 'all' || ticket.statusKey === activeFilter;
      const searchableText = [ticket.movieTitle, ticket.code, ticket.cinemaName, ticket.seats.join(' ')].join(' ').toLowerCase();
      const matchesQuery = searchableText.includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });

    if (filteredTickets.length === 0) {
      list.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    list.innerHTML = filteredTickets.map(createTicketCard).join('');
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeFilter = tab.dataset.ticketFilter || 'all';
      tabs.forEach((item) => item.classList.toggle('my-tickets-inner-tab-active', item === tab));
      renderTickets();
    });
  });

  searchInput?.addEventListener('input', (event) => {
    query = event.target.value;
    renderTickets();
  });

  reloadButton?.addEventListener('click', () => {
    query = '';
    if (searchInput) {
      searchInput.value = '';
    }
    tickets = getAllTickets();
    renderTickets();
  });

  list?.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.my-tickets-inner-card');
    if (!card) {
      return;
    }

    const ticketId = card.dataset.ticketId;
    if (!ticketId) {
      return;
    }

    if (target.closest('.my-tickets-inner-card-qr')) {
      alert(`QR demo cho mã vé ${ticketId}`);
      return;
    }

    if (target.closest('.my-tickets-inner-card-cancel')) {
      tickets = tickets.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket;
        }
        return {
          ...ticket,
          statusKey: 'cancelled',
          statusLabel: 'Đã Hủy'
        };
      });
      saveStoredTickets(tickets);
      renderTickets();
    }
  });

  renderTickets();
}

function initCinemaPage() {
  const sidebarCinemaItems = document.querySelectorAll('.sidebar-cinema-item');
  sidebarCinemaItems.forEach((item) => {
    item.addEventListener('click', function () {
      sidebarCinemaItems.forEach((cinema) => cinema.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const timeButtons = document.querySelectorAll('.time-btn:not(.disabled)');
  timeButtons.forEach((button) => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthModal();
  initHomeSlider();
  initBookingPage();
  initSeatSelectionPage();
  initPaymentPage();
  initMyTicketsPage();
  initCinemaPage();
});