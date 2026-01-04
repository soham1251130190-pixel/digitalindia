const revealElements = document.querySelectorAll(
    '.hero-text, .section-header, .card'
  );
  
  function revealOnScroll() {
    revealElements.forEach(el => {
      if (el.classList.contains('revealed')) return;
  
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('revealed');
      }
    });
  }
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s ease';
  });
  
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  
  function openModal(modalId, titleId, textId, title, text, imageId = null, image = null) {
    document.getElementById(titleId).textContent = title;
    document.getElementById(textId).textContent = text;
  
    if (imageId && image) {
      document.getElementById(imageId).src = image;
    }
  
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = '';
  }
  
  window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
