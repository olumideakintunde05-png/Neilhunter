// sidebar.js — NeilHunter Sidebar
// Requires Firebase CDN + auth.js loaded before this file

function sbToggleCollapse() {
  var sb   = document.getElementById('nh-sidebar');
  var main = document.getElementById('nh-main');
  sb.classList.toggle('sb-collapsed');
  if (main) main.classList.toggle('sb-main-collapsed');
  localStorage.setItem('nh_sb_collapsed', sb.classList.contains('sb-collapsed'));
}

function sbOpenMobile() {
  document.getElementById('nh-sidebar').classList.add('sb-open');
  document.getElementById('nh-overlay').style.display = 'block';
}

function sbCloseMobile() {
  document.getElementById('nh-sidebar').classList.remove('sb-open');
  document.getElementById('nh-overlay').style.display = 'none';
}

function nhLogout() {
  Auth.logout();
}

// Populate sidebar with Firebase user info
function sbPopulateUser(user) {
  if (!user) return;
  var plan = Auth.getPlan(user.uid);

  var nameEl  = document.getElementById('sb-user-name');
  var emailEl = document.getElementById('sb-user-email');
  var planEl  = document.getElementById('sb-plan-badge');

  if (nameEl)  nameEl.textContent  = user.displayName || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (planEl) {
    if (plan === 'PRO') {
      planEl.textContent = '⭐ PRO Plan';
      planEl.className = 'sb-plan pro';
    } else if (plan === 'STARTER') {
      planEl.textContent = '⚡ Starter Plan';
      planEl.className = 'sb-plan starter';
    } else {
      planEl.innerHTML = 'FREE Plan — <a href="pricing.html">Upgrade</a>';
      planEl.className = 'sb-plan free';
    }
  }
}

// Init sidebar on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Restore collapsed state
  if (localStorage.getItem('nh_sb_collapsed') === 'true') {
    var sb = document.getElementById('nh-sidebar');
    if (sb) sb.classList.add('sb-collapsed');
    var main = document.getElementById('nh-main');
    if (main) main.classList.add('sb-main-collapsed');
  }

  // Mark active nav link
  var page = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sb-nav a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'dashboard.html')) {
      a.classList.add('active');
    }
  });
});
