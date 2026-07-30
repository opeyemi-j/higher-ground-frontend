document.addEventListener('DOMContentLoaded', function () {

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky header shadow
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  // Mobile nav toggle
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Testimonial slider
  var track = document.getElementById('testiTrack');
  var slides = track ? track.children : [];
  var dotsWrap = document.getElementById('testiDots');
  var current = 0;
  var autoTimer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    Array.from(dotsWrap.children).forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  if (track && slides.length) {
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        var idx = Array.from(dotsWrap.children).indexOf(this);
        clearInterval(autoTimer);
        goTo(idx);
        startAuto();
      });
      dotsWrap.appendChild(dot);
    }
    goTo(0);
    startAuto();
  }

  // Contact form validation + submission
  // Point this at your deployed backend, e.g. 'https://api.highergroundschool.ng/api/enroll'
  var API_URL = 'https://higher-ground-backend-production.up.railway.app/api/enroll';

  var form = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function setError(fieldId, message) {
    var errorEl = document.getElementById('err-' + fieldId);
    var input = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message || '';
    if (input) input.classList.toggle('invalid', !!message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+()\-\s]{7,}$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMsg.textContent = '';

      var name = document.getElementById('parentName').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();

      var valid = true;

      if (name.length < 2) {
        setError('parentName', 'Please enter your full name.');
        valid = false;
      } else {
        setError('parentName', '');
      }

      if (!isValidEmail(email)) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('email', '');
      }

      if (!isValidPhone(phone)) {
        setError('phone', 'Please enter a valid phone number.');
        valid = false;
      } else {
        setError('phone', '');
      }

      if (!valid) return;

      var payload = {
        parentName: name,
        email: email,
        phone: phone,
        stage: document.getElementById('stage').value,
        message: document.getElementById('message').value.trim(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            return data;
          });
        })
        .then(function () {
          successMsg.style.color = '';
          successMsg.textContent = 'Thanks, ' + name.split(' ')[0] + '! We\'ll be in touch within one working day.';
          form.reset();
        })
        .catch(function (err) {
          successMsg.style.color = '#E24B4A';
          successMsg.textContent = 'Sorry, something went wrong: ' + err.message + '. Please try again or call us directly.';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }

  // Back to top
  var backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
