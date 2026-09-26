// Code như lồn không có gì để soi đâu =)))

function active(a) {
  const section = a.parentElement;

  const sec1 = document.querySelector('.sec_1');
  const sec2 = document.querySelector('.sec_2');
  const sec3 = document.querySelector('.sec_3');

  const s1isOpen = sec1.classList.contains('active');
  const s2isOpen = sec2.classList.contains('active');
  const s3isOpen = sec3.classList.contains('active');

  if (section.classList.contains('sec_1')) {
    // ===========  SECTION 2 IS OPEN  ==============
    if (s2isOpen) { // card 2th is opening, close the first one will close the second
      // ========  BOTH SECTIONS ARE OPEN  ==========
      if (s3isOpen) { // 2 other cards are opeing, close 1 to close them both
        document.querySelectorAll('[class^="sec_"]')
          .forEach(sec => sec.classList.remove('active')); // remove all shit
      } else {
        sec2.classList.remove('active');
        section.classList.remove('active');
      }
    } else section.classList.toggle('active'); // if upper conditions unmet then only first card works
  } else if (section.classList.contains('sec_2')) {
    // ===========  SECTION 3 IS OPEN  =============
    if (s3isOpen) {
      sec3.classList.remove('active');
      section.classList.remove('active');
    } else section.classList.toggle('active');
    // ==========  SECTION 1 IS CLOSED  ============
    if (!s1isOpen) {
      sec1.classList.add('active');
      section.classList.add('active');
    }
  } else if (section.classList.contains('sec_3')) {
    // =====  BOTH S1 & S2 ARE CLOSED OR ONLY S2 CLOSED  =====
    if ((!s1isOpen && !s2isOpen) || (s1isOpen && !s2isOpen)) {
      document.querySelectorAll('[class^="sec_"]')
        .forEach(sec => {
          if (sec.classList.contains('sec_4')) return;
          else sec.classList.add('active');
        });// add all shit
    } else section.classList.toggle('active');
  }
}

let zoomScale = 1;
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;

const overlay = document.getElementById('lightbox_overlay');
const img = document.getElementById('lightbox_img');
const wrapper = document.getElementById('lightbox_wrapper');

function zoom(input) {
  const zoomImg = document.getElementById(input);
  if (!zoomImg) return;

  // check object's bg img through img's id
  const bgStyle = window.getComputedStyle(zoomImg).backgroundImage;
  const imgSrc = bgStyle.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

  if (imgSrc && (imgSrc !== 'none')) {
    img.src = imgSrc; // bring zoomed img to lightbox
    // inital settings
    zoomScale = 1;
    translateX = 0;
    translateY = 0;

    // open transition 
    img.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    img.style.transform = 'translate(0px, 0px) scale(1)';

    // fuck it we ball
    overlay.classList.add('active');

    // move/zoom transition, not to be confused with open transition
    setTimeout(() => {
      img.style.transition = 'transform 0.08s ease-out';
    }, 300);
  }
}

function closeLightbox() {
  // close transition
  img.style.transition = "transform 0.3s ease-in-out";
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.9)`;
  // fuck it we ball
  overlay.classList.remove('active');
}

function updateTransform() {
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
}







// =========================================================
//                  EVENT LISTENERS TAB
// =========================================================
// Copilot AI wrote all of ts event, i have no fucking idea how it works
// =================== SCROLL TO ZOOM
wrapper.addEventListener('wheel', function (e) {
  e.preventDefault();

  const zoomSpeed = 0.15;
  if (e.deltaY < 0) {
    // max zoom
    zoomScale = Math.min(zoomScale + zoomSpeed, 5);
  } else {
    // min zoom
    zoomScale = Math.max(zoomScale - zoomSpeed, 0.5);
  }
  updateTransform();
}, { passive: false });
// =================== DRAG IMAGE
wrapper.addEventListener('mousedown', function (e) {
  if (e.button !== 0) return;
  isDragging = true;

  img.style.transition = 'none';

  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

window.addEventListener('mousemove', function (e) {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

window.addEventListener('mouseup', function () {
  if (isDragging) {
    isDragging = false;
    img.style.transition = 'transform 0.08s ease-out';
  }
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') return closeLightbox();
});