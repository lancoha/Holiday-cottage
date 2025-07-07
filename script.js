document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => io.observe(s));

  const gallery    = document.getElementById('gallery');
  const showAllBtn = gallery.querySelector('.show-all');
  const photoModal = document.getElementById('photo-modal');
  const closeBtn   = document.getElementById('close-modal');

  showAllBtn.addEventListener('click', () => {
    photoModal.classList.add('active');
    document.body.classList.add('modal-open');
  });
  closeBtn.addEventListener('click', () => {
    photoModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && photoModal.classList.contains('active')) {
      closeBtn.click();
    }
  });

  const map = document.getElementById('map');
  document.getElementById('enable-map').addEventListener('click', (evt) => {
    map.classList.toggle('interactive');
    evt.target.textContent = map.classList.contains('interactive')
      ? 'Disable map interaction'
      : 'Enable map interaction';
  });

  const PRICE = 128;
  flatpickr("#calendar", {
    mode: "range",
    inline: true,
    minDate: "today",
    onChange: dates => updateBooking(dates)
  });

  function updateBooking(dates) {
    const ci    = document.getElementById('checkin'),
          co    = document.getElementById('checkout'),
          nights= document.getElementById('nights'),
          cost1 = document.getElementById('cost-total1'),
          svc   = document.getElementById('service-fee'),
          tot   = document.getElementById('total');

    if (dates.length === 2) {
      const [start, end] = dates;
      ci.textContent = start.toLocaleDateString();
      co.textContent = end.toLocaleDateString();
      const n = Math.round((end - start)/(1000*60*60*24));
      nights.textContent = n;
      const c = n*PRICE;
      cost1.textContent = c.toFixed(2);
      const fee = c*0.1725;
      svc.textContent = fee.toFixed(2);
      tot.textContent = (c+fee).toFixed(2);
    }
  }

  document.getElementById('reserve').addEventListener('click', () => {
    const ci = document.getElementById('checkin').textContent,
          co = document.getElementById('checkout').textContent;
    if (ci === '—' || co === '—') {
      alert('Please select your check-in and check-out dates.');
    } else {
      alert(`Reservation requested from ${ci} to ${co}.`);
    }
  });

  const galleryImgs = Array.from(document.querySelectorAll('.tour-grid img'));
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = lightbox.querySelector('.lightbox-img');
  const btnClose     = lightbox.querySelector('.lightbox-close');
  const btnPrev      = lightbox.querySelector('.lightbox-prev');
  const btnNext      = lightbox.querySelector('.lightbox-next');
  let currentIndex  = 0;

  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => {
      currentIndex = i;
      openLightbox();
    });
  });

  function openLightbox() {
    lbImg.src = galleryImgs[currentIndex].src;
    lightbox.classList.add('active');
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
    lbImg.src = galleryImgs[currentIndex].src;
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImgs.length;
    lbImg.src = galleryImgs[currentIndex].src;
  }

  btnClose.addEventListener('click', closeLightbox);
  btnPrev .addEventListener('click', showPrev);
  btnNext .addEventListener('click', showNext);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

});
