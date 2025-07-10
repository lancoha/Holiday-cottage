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
  lightbox.classList.add('closing');
  lbImg.classList.add('closing');

  lightbox.addEventListener('animationend', () => {
    lightbox.classList.remove('active', 'closing');
    lbImg.classList.remove('closing');
  }, { once: true });
}
const layers   = lightbox.querySelectorAll('.lightbox-img');
let front      = 0;

function openLightbox() {
  layers[front].src = galleryImgs[currentIndex].src;
  layers[front].classList.add('show');
  lightbox.classList.add('active');
}

function changeImage(step){
  const next = (currentIndex + step + galleryImgs.length) % galleryImgs.length;
  const back = 1 - front;

  layers[back].src = galleryImgs[next].src;
  layers[back].classList.add('show');
  layers[back].classList.remove('hidden');

  layers[front].classList.remove('show');


  layers[front].addEventListener('transitionend', function tEnd(e){
    if(e.propertyName !== 'opacity') return;
    layers[front].removeEventListener('transitionend', tEnd);

    layers[front].classList.add('hidden');
    front = back;
    currentIndex = next;
  }, { once:true });
}

  btnPrev.addEventListener('click', () => changeImage(-1));
  btnNext.addEventListener('click', () => changeImage(+1));

  btnClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

});

document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('toggle-amenities');
  const box   = document.querySelector('.more-amenities');
  const label = btn.querySelector('.btn-label');
  const icon  = btn.querySelector('i');

  btn.addEventListener('click', () => {
    const isOpen = box.classList.contains('open');

    if (isOpen) {
      box.style.height = box.scrollHeight + 'px';
      requestAnimationFrame(() => box.style.height = '0');
      label.textContent = 'See more';
      icon.className = 'fas fa-chevron-down';
    } else {
      const full = box.scrollHeight;
      box.style.height = '0';
      box.classList.add('open');
      requestAnimationFrame(() => box.style.height = full + 'px');
      label.textContent = 'See less';
      icon.className = 'fas fa-chevron-up';
    }
    box.addEventListener('transitionend', function tidy(e){
      if (e.propertyName !== 'height') return;
      box.style.height = '';
      if (!isOpen) box.classList.add('open'); else box.classList.remove('open');
      box.removeEventListener('transitionend', tidy);
    }, { once:true });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const dBtn   = document.getElementById('toggle-desc');
  const dBox   = document.querySelector('.desc-more');
  const dLab   = dBtn.querySelector('.btn-label');
  const dIcon  = dBtn.querySelector('i');

  dBtn.addEventListener('click', () => {
    const open = dBox.classList.contains('open');

    if (open) {
      dBox.style.height = dBox.scrollHeight + 'px';
      requestAnimationFrame(()=> dBox.style.height = '0');
      dLab.textContent = 'See more';
      dIcon.className  = 'fas fa-chevron-down';
    } else {
      dBox.style.height = '0';
      dBox.classList.add('open');
      requestAnimationFrame(()=>{
        dBox.style.height = dBox.scrollHeight + 'px';
      });
      dLab.textContent = 'See less';
      dIcon.className  = 'fas fa-chevron-up';
    }

    dBox.addEventListener('transitionend', function tidy(e){
      if(e.propertyName !== 'height') return;
      dBox.style.height = '';
      dBox.classList.toggle('open', !open);
      dBox.removeEventListener('transitionend', tidy);
    }, { once:true });
  });
});

const nBtn  = document.getElementById('toggle-nearby');
const nBox  = document.querySelector('.nearby-more');
const nLab  = nBtn.querySelector('.btn-label');
const nIcon = nBtn.querySelector('i');

nBtn.addEventListener('click', () => {
  const opening = !nBox.classList.contains('open');
  const hTarget = opening ? nBox.scrollHeight : 0;

  nBox.style.height = opening ? '0' : nBox.scrollHeight + 'px';
  requestAnimationFrame(()=> nBox.style.height = hTarget + 'px');

  nBox.addEventListener('transitionend', function tidy(e){
    if(e.propertyName !== 'height') return;
    nBox.style.height = '';
    nBox.classList.toggle('open', opening);
    nBox.removeEventListener('transitionend', tidy);
  }, { once:true });

  nLab.textContent = opening ? 'See less' : 'See more';
  nIcon.className  = opening ? 'fas fa-chevron-up'
                             : 'fas fa-chevron-down';
});
