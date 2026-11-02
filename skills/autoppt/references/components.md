# 互动组件

## 接口
```js
/* src/components/myviz.js —— 文件头写清：做什么、数据从哪来、与哪个 Python 脚本对照 */
(function () {
  W1.reg('myviz', {
    init(el) {            // el = <div data-comp="myviz">；页面加载时调用一次
      const draw = () => { /* 读控件 → 计算 → 写 el.innerHTML 的一部分 */ el.__last = {/* 关键状态，供测试读取 */}; };
      el.querySelector('[data-v=eps]').addEventListener('input', draw);
      el.__reset = () => { /* 恢复默认值 */ draw(); };
      el.__reset();
    },
    reset(el) { el.__reset(); }   // 按 R 或“重置”按钮时调用
  });
})();
```
- 在页面底部 `<script src="src/components/myviz.js"></script>`（放在 `deck.js` 之后）。
- 有 `data-comp` 的页自动出现“重置（R）”按钮。
- 方向键、空格在控件聚焦时交给控件，不翻页。
- 把关键状态挂在 `el.__last`、把计算函数挂在 `el.__xxx`，交互测试脚本就能直接读。

## 真实计算 + 与 Python 对照（核心原则）
1. `tools/toyN.py` 用 NumPy / scikit-learn 生成数据、训练小模型，把**数据、权重、若干对照值**写进 `src/data/dataN.js`（`window.DN = {...}`）。
2. 组件在浏览器里用同样的公式现场计算（例如逻辑回归的 softmax、FGSM 的梯度、TF-IDF + 线性模型）。
3. 测试脚本把 JS 结果和对照值逐项比较，最大差写进 TESTING.md（如 `< 2e-6`）。
4. 讲稿和页面上的数字都来自这里；手工设定的示意数据标“示意”。

## 现成组件
| 组件 | 标记 | 说明 |
|---|---|---|
| quiz | `<div class="stage" data-comp="quiz"><div class="quiz"><div class="q" data-answer="1"><p class="qt">题</p><div class="opts"><button>…</button>…</div><p class="exp">解析</p></div>…</div><p class="score"></p></div>` | 小测；点选后显示对错与解析 |
| pick | `<div class="stage pk-big" data-comp="pick" data-src="PICK_DEMO">` + `.btns [data-act=open]` + `.pk-score` + `.pk-grid` | 选择卡；数据在 `src/data/content.js`：`{opts:[[键,文字,颜色]], items:[{t,a,why,img?}]}` |
| flip | `data-comp="flip"` 内 `.flipgrid > .flip > .front + .back`，可选 `[data-act=all]` | 先判断再翻开 |
| checklist | `<div class="checks" data-comp="checklist" data-key="lab">` 内 `<label><input type="checkbox"><span>…</span></label>` | 验收清单；同一 key 在各页同步（本次会话内保留） |
| code | `.code.copyable`（复制按钮）；`data-comp="lines"`（逐行讲解）、`errdemo`（错误 / 修正对照）、`diff` | 代码页 |
| labfill | `.code[data-cell="key" data-from data-to]`、`.term.out[data-out="key"]`、`img[data-img="key:0"]` | 从 `window.LAB`（run_lab.py 生成）填入代码、输出、图片——保证三者出自同一次运行 |
| weekfill | `<b data-lab="mean"></b>` | 把 `LAB.nums` 里的数字填进正文 |

## 原课程里做过的互动（部分，可作为思路）
最近邻分类“规则 vs 学习”（第 1 周）、网格世界里的 Q 学习（第 12 周）、手写数字对抗样本与准确率曲线、后门植入、文本“攻防台”（第 13 周）、公平滑块（三种公平不能兼得）、差分隐私噪声、文本水印 z 分数（第 14 周）。共同点：**学生拖一下、点一下就能看到真实计算的结果**，而不是播放动画。

## 需要大模型 / GPU 的结果
制作环境通常跑不了大模型。做法：
- 写 `tools/run_xxx.py`，由教师在自己电脑上运行，结果写进 `src/data/xxx_run.js`（`window.XXX = {...}`）。
- 未运行时文件内容是 `window.XXX = null;`，页面显示占位“教师机实测结果待填入”，教师版页面顶部有红色提示条。
- 支持 `XXX_FAKE=1` 生成假数据，只用来测试版式；**测完必须恢复为 null**。
- 永远不编造模型输出。
