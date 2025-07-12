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

  const PRICE = 100;
const FEEDS = [
    'https://www.airbnb.si/calendar/ical/1128748175756155149.ics?s=7a4723f15a9dbc32ada0a672da93fe4a',
    'https://ical.booking.com/v1/export?t=767b718a-6929-44f7-8c09-3a84b52e86e8'
  ];

  const proxy = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

async function fetchFeed(url) {
  try {
    const res = await fetch(proxy(url));
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    const ics  = await res.text();
    const jcal = ICAL.parse(ics);
    const comp = new ICAL.Component(jcal);
    return comp.getAllSubcomponents('vevent').map(v => {
      const e    = new ICAL.Event(v);
      const from = e.startDate.toJSDate();
      const to   = e.endDate.toJSDate();
      to.setDate(to.getDate() - 1);
      return { from, to };
    });
  } catch (err) {
    console.error('ICS feed failed:', url, err);
    return [];
  }
}

  function mergeRanges(ranges){
    if(!ranges.length) return [];
    ranges.sort((a,b)=>a.from-b.from);
    const merged=[ranges[0]];
    for(const r of ranges.slice(1)){
      const last = merged[merged.length-1];
      if(r.from<=last.to.setHours(23,59,59,999)+1){ 
        last.to = new Date(Math.max(last.to, r.to));
      }else{
        merged.push(r);
      }
    }
    return merged;
  }

(async () => {
  let disabled = [];
  try {
    const all = (await Promise.all(FEEDS.map(fetchFeed))).flat();
    disabled   = mergeRanges(all);
  } finally { 
    flatpickr('#calendar', {
      mode    : 'range',
      inline  : true,
      minDate : 'today',
      disable : disabled,
      onChange: dates => updateBooking(dates)
    });
  }
})();


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
      const c = n * PRICE;
      cost1.textContent = c.toFixed(2);

      const pets = parseInt(document.getElementById('pets').value, 10) || 0;
      const petFee = pets * 10 * n;
      svc.textContent = petFee.toFixed(2);
      tot.textContent = (c + petFee).toFixed(2);

         }
        }

const form = document.getElementById('inquiry-form');
form.addEventListener('submit', e => {
  e.preventDefault();

  const first  = document.getElementById('first-name').value.trim();
  const last   = document.getElementById('last-name').value.trim();
  const email  = document.getElementById('email').value.trim();
  const guests = document.getElementById('guests').value;
  const pets   = document.getElementById('pets').value;
  const message = document.getElementById('message').value.trim();
  const ci     = document.getElementById('checkin').textContent;
  const co     = document.getElementById('checkout').textContent;
  const total  = document.getElementById('total').textContent;

  if (!first || !last || !email || ci==='—' || co==='—') {
    alert('Please fill in name, email and select dates.');
    return;
  }

  const body = encodeURIComponent(
    `Inquiry for Holiday Cottage\n\n` +
    `Name: ${first} ${last}\n` +
    `Email: ${email}\n` +
    `Guests: ${guests}\n` +
    `Pets: ${pets}\n` +
    
    `Check-in: ${ci}\n` +
    `Check-out: ${co}\n` +
    `Total: €${total}\n\n` +
    `Thank you!`
  );

  window.location.href = 
    `mailto:you@yourdomain.com?subject=${encodeURIComponent('Cottage Inquiry')}&body=${body}`;
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

  if (opening) {
    nBox.classList.add('open');
    nBox.style.height = '0';
    const full = nBox.scrollHeight;
    requestAnimationFrame(() => {
      nBox.style.height = full + 'px';
    });

  } else {
    const full = nBox.scrollHeight;
    nBox.style.height = full + 'px';

    nBox.classList.remove('open');

    requestAnimationFrame(() => {
      nBox.style.height = '0';
    });
  }

  nBox.addEventListener('transitionend', function tidy(e){
    if (e.propertyName !== 'height') return;
    nBox.style.height = '';
    nBox.style.paddingTop = '';
    nBox.removeEventListener('transitionend', tidy);
  }, { once:true });

  nLab.textContent = opening ? 'See less' : 'See more';
  nIcon.className  = opening ? 'fas fa-chevron-up'
                             : 'fas fa-chevron-down';
});
