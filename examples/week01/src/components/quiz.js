/* 互动C：概念测验 */
W1.reg('quiz', {
  init(el) {
    const qs = el.querySelectorAll('.q');
    const score = el.querySelector('.score');
    const upd = () => {
      const done = el.querySelectorAll('.q.done').length, right = el.querySelectorAll('.q.right').length;
      if (score) score.textContent = done ? `已答 ${done} / ${qs.length} 题，答对 ${right} 题` : `共 ${qs.length} 题，点选你的答案`;
    };
    qs.forEach((q) => {
      const ans = +q.dataset.answer;
      q.querySelectorAll('.opts button').forEach((b, i) => {
        b.type = 'button';
        b.addEventListener('click', () => {
          if (q.classList.contains('done')) return;
          q.classList.add('done', i === ans ? 'right' : 'wrong');
          b.classList.add('picked');
          q.querySelectorAll('.opts button')[ans].classList.add('correct');
        });
      });
      q.addEventListener('click', upd);
    });
    upd(); el.__upd = upd;
  },
  reset(el) {
    el.querySelectorAll('.q').forEach((q) => { q.classList.remove('done', 'right', 'wrong'); q.querySelectorAll('button').forEach((b) => b.classList.remove('picked', 'correct')); });
    el.__upd && el.__upd();
  }
});
