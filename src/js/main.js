// main.js — pcb-order-website 全局交互

const WA_NUMBER = 'YOUR_NUMBER'; // TODO: 替换为真实 WhatsApp 号码

document.addEventListener('DOMContentLoaded', () => {

  // 更新所有 WhatsApp 链接
  if (WA_NUMBER !== 'YOUR_NUMBER') {
    document.querySelectorAll('[href*="wa.me/YOUR_NUMBER"]').forEach(el => {
      el.href = el.href.replace(/YOUR_NUMBER/g, WA_NUMBER);
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.svc-card, .why-card, .process-step, .spec-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Ticker pause on hover
  const ticker = document.querySelector('.ticker-inner');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

});
