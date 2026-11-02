/* 第 6 周公用小工具 */
(function () {
  const K = (W1.k6 = W1.k6 || {});
  K.C = { blue: '#0B3D91', rust: '#B4471F', teal: '#12806F', amber: '#C98A0B', ink: '#1C1D21', ink2: '#4A4F5C', ink3: '#7A7F8B', rule: '#CFC8B8', paper: '#F5F2EA', paper2: '#EDE8DC' };
  K.b64 = (s) => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  K.fmt = (n) => Number(n).toLocaleString('en-US');
  K.num = (v) => (Number.isInteger(v) ? String(v) : (Math.round(v * 100) / 100).toString()).replace('-', '−');
  K.base = () => (location.pathname.includes('/student/') ? '../' : '');
})();
