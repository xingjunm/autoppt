/* 互动G-2：验收清单（本次会话内保留，同一 key 的清单互相同步） */
(function () {
  const key = (el) => 'check:' + (el.dataset.key || 'lab');
  function sync(el) {
    const st = W1.store.get(key(el), {});
    el.querySelectorAll('input[type=checkbox]').forEach((c, i) => { c.checked = !!st[i]; c.closest('label').classList.toggle('ok', c.checked); });
  }
  const all = (k) => document.querySelectorAll(`[data-comp=checklist]`).forEach((e) => key(e) === k && sync(e));
  W1.reg('checklist', {
    init(el) {
      el.querySelectorAll('input[type=checkbox]').forEach((c, i) => c.addEventListener('change', () => { const st = W1.store.get(key(el), {}); st[i] = c.checked; W1.store.set(key(el), st); all(key(el)); }));
      sync(el);
    },
    reset(el) { W1.store.set(key(el), {}); all(key(el)); }
  });
})();
