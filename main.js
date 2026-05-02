/* =============================================
   CURSOR
============================================= */
const dot  = document.getElementById('cDot');
const ring = document.getElementById('cRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
});

document.addEventListener('mouseover', function(e) {
  if (e.target.closest('a') || e.target.closest('button')) {
    ring.classList.add('big');
  } else {
    ring.classList.remove('big');
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
  requestAnimationFrame(animateRing);
}
animateRing();

/* =============================================
   BOTTOM NAV — ACTIVE SECTION HIGHLIGHT
============================================= */
var sections  = document.querySelectorAll('section[id]');
var navLinks  = document.querySelectorAll('.nav-pill .nav-link');

function updateNav() {
  var scrollY = window.scrollY + window.innerHeight / 2;
  sections.forEach(function(sec) {
    var top    = sec.offsetTop;
    var bottom = top + sec.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      var match = document.querySelector('.nav-pill .nav-link[href="#' + sec.id + '"]');
      if (match) match.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateNav);
updateNav();

/* =============================================
   SCROLL REVEAL — FIXED (no illegal invocation)
============================================= */
var revealEls = document.querySelectorAll('.reveal');

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(function(el) {
  revealObserver.observe(el);
});

/* =============================================
   COUNTER ANIMATION
============================================= */
var counterEls = document.querySelectorAll('[data-target]');

var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) return;
    var el     = entry.target;
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '+';
    var current = 0;
    var steps   = 60;
    var step    = target / steps;
    var timer   = setInterval(function() {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 22);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counterEls.forEach(function(el) {
  counterObserver.observe(el);
});

/* =============================================
   HERO NAME PARALLAX
============================================= */
var heroWrap = document.getElementById('heroWrap');

window.addEventListener('scroll', function() {
  if (!heroWrap) return;
  var y = window.scrollY;
  var opacity = 1 - (y / 480);
  heroWrap.style.transform = 'translateY(' + (y * 0.28) + 'px)';
  heroWrap.style.opacity   = Math.max(0, opacity).toString();
});

/* =============================================
   PROJECT CARD TILT ON MOUSE
============================================= */
var projCards = document.querySelectorAll('.proj-card');

projCards.forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var cx   = rect.left + rect.width  / 2;
    var cy   = rect.top  + rect.height / 2;
    var dx   = (e.clientX - cx) / rect.width  * 4;
    var dy   = (e.clientY - cy) / rect.height * 2;
    card.style.transform  = 'translateY(-4px) rotateY(' + dx + 'deg) rotateX(' + (-dy) + 'deg)';
    card.style.transition = 'transform .08s ease';
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform  = '';
    card.style.transition = 'transform .4s ease, border-color .3s, box-shadow .3s';
  });
});

/* =============================================
   CONTACT FORM — SEND VIA MAILTO
============================================= */
var sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', function() {
    sendMessage();
  });
}

document.querySelectorAll('.finput').forEach(function(inp) {
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && inp.tagName !== 'TEXTAREA') {
      sendMessage();
    }
  });
});

function sendMessage() {
  var name    = document.getElementById('fName').value.trim();
  var email   = document.getElementById('fEmail').value.trim();
  var subject = document.getElementById('fSubject').value.trim();
  var message = document.getElementById('fMsg').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️  Please fill in name, email and message');
    return;
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('⚠️  Please enter a valid email address');
    return;
  }

  var body = 'Hi Tirthraj,\n\nMy name is ' + name + ' (' + email + ').\n\n' + message + '\n\nBest regards,\n' + name;
  var mailto = 'mailto:tirthrajbhalodiya2003@gmail.com'
    + '?subject=' + encodeURIComponent(subject || 'Message from ' + name)
    + '&body='    + encodeURIComponent(body);

  window.location.href = mailto;

  showToast('✉️  Opening your email client...');

  document.getElementById('fName').value    = '';
  document.getElementById('fEmail').value   = '';
  document.getElementById('fSubject').value = '';
  document.getElementById('fMsg').value     = '';
}

function showToast(msg) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3500);
}
