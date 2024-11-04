function initSliderReview() {
  new Swiper('.reviews__slider', {
    slidesPerView: 1,
    loop: false,
    speed: 500,
    spaceBetween: 20,
    navigation: {
      nextEl: '.reviews__nav-next',
      prevEl: '.reviews__nav-prev',
    },
    pagination: {
      el: '.reviews__pagination',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
    },
  });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function animateInfoStats() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const infoStatNum = entry.target.querySelector('span');
        animateValue(infoStatNum, 0, infoStatNum.dataset.num, 1000);
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);

  const infoStatItems = document.querySelectorAll('.info__item');
  infoStatItems.forEach((prodRateChart) => {
    observer.observe(prodRateChart);
  });
}

function init() {
  initSliderReview();
  animateInfoStats();
  animateBorderShadowItems('.advantages__item');
}

document.addEventListener('DOMContentLoaded', init);
