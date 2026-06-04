// ── NeilHunter Toast ────────────────────────────────────
function toast(msg, type = 'success') {
  let wrap = document.getElementById('nh-toasts');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'nh-toasts';
    wrap.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  const dot = type === 'error' ? '#f87171' : '#34d399';
  t.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:10px;background:#1c2333;border:1px solid #2a3347;font-size:14px;color:#e8eaf0;box-shadow:0 4px 20px rgba(0,0,0,.4);min-width:200px;max-width:320px;animation:nhSlideUp .25s ease;pointer-events:all;font-family:'DM Sans',system-ui,sans-serif;`;
  t.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${dot};flex-shrink:0"></span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(8px)'; t.style.transition = '.3s ease'; setTimeout(() => t.remove(), 300); }, 2800);
}

// Inject keyframes once
(function(){
  if (document.getElementById('nh-toast-style')) return;
  const s = document.createElement('style');
  s.id = 'nh-toast-style';
  s.textContent = '@keyframes nhSlideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(s);
})();
