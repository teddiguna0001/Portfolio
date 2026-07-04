// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  
  const setIcon = () => {
    themeToggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  };
  setIcon();
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setIcon();
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Reveal animations on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });

  // Active navigation link based on scroll position
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-link')];
  
  const activateNav = () => {
    const top = window.scrollY + 120;
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (top >= section.offsetTop) current = section.id;
    });
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  };
  
  activateNav();
  window.addEventListener('scroll', activateNav, { passive: true });

  // Form handling with Formspree
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('https://formspree.io/f/xdaryvzv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          // Success!
          submitBtn.textContent = '✓ Sent Successfully!';
          submitBtn.style.backgroundColor = '#10b981';
          contactForm.reset();
          
          // Reset button after 3 seconds
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
          }, 3000);
        } else {
          // Error response from Formspree
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        // Network or other errors
        console.error('Form submission error:', error);
        submitBtn.textContent = '❌ Error - Try Again';
        submitBtn.style.backgroundColor = '#ef4444';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }
});
