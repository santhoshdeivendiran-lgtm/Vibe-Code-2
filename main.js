/**
 * Spice & Spoon - Interactive Functionality
 * Mobile navigation, table booking modal, menu filters, lightbox, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initReservationModal();
  initMenuFilters();
  initGalleryLightbox();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const toggleDrawer = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    toggleBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleDrawer());
  overlay.addEventListener('click', () => toggleDrawer(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

/* --------------------------------------------------------------------------
   3. Table Reservation Modal
   -------------------------------------------------------------------------- */
function initReservationModal() {
  const modal = document.getElementById('reservation-modal');
  const openButtons = document.querySelectorAll('[data-action="book-table"]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const form = document.getElementById('reservation-form');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Reserving...';

      setTimeout(() => {
        closeModal();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Table booked successfully! We will send a confirmation SMS shortly.');
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Menu Category Filters (Our Menu Page)
   -------------------------------------------------------------------------- */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const categoryBlocks = document.querySelectorAll('.menu-category-block');

  if (!filterButtons.length || !categoryBlocks.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-filter');

      categoryBlocks.forEach(block => {
        const blockCategory = block.getAttribute('data-category');
        if (targetCategory === 'all' || blockCategory === targetCategory) {
          block.style.display = 'block';
          block.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          block.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Gallery Lightbox
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery photo';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showToast('Thank you! Your message has been sent to Spice & Spoon.');
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   7. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E58925" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
