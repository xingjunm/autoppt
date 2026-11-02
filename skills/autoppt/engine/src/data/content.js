/* 课程组撰写的内容（选择卡、参考答案等）。参考答案为课程组观点，可按授课教师的讲法修改。
   pick 组件：<div data-comp="pick" data-src="PICK_DEMO">；opts = [[键, 文字, 颜色类]]，items = [{t, a, why, img?}] */
window.PICK_DEMO = {
  opts: [['a', '第一类', 'blue'], ['b', '第二类', 'rust'], ['c', '第三类', 'teal']],
  items: [
    { t: '情境一：一句具体的描述', a: 'a', why: '判断依据：……' },
    { t: '情境二', a: 'b', why: '……' },
    { t: '情境三', a: 'c', why: '……' },
    { t: '情境四', a: 'a', why: '……' },
    { t: '情境五', a: 'b', why: '……' },
    { t: '情境六', a: 'c', why: '……' },
  ],
};
