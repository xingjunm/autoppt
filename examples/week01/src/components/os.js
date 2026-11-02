/* 互动G-1：Windows / macOS 切换（本次会话内记住） */
(function () {
  const apply = (os) => { document.documentElement.dataset.os = os; document.querySelectorAll('[data-comp=os] button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.os === os)); };
  apply(W1.store.get('os', 'win'));
  W1.reg('os', {
    init(el) { el.querySelectorAll('button').forEach((b) => { b.type = 'button'; b.addEventListener('click', () => { W1.store.set('os', b.dataset.os); apply(b.dataset.os); }); }); apply(W1.store.get('os', 'win')); },
    reset() {}
  });
})();
