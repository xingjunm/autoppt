// 版式检查：node audit_overlap.js <weekNN 文件夹>
// 在 1920×1080 和 1366×768 下逐页检查教师版与学生版：文字互相重叠（OV）、超出画布（OUT）、内容太靠上留白过多（只列出页码:底边位置）。
// 输出 ok 表示该课件没有问题；出现 OV / OUT 必须修。
// 已知的“假重叠”：翻牌卡的正反面（.flip .front/.back 同时在页面里）、界面示意里故意盖在上面的弹出菜单。看截图确认后可以忽略；第 1 周示例里的 4 处就是这种。
const { chromium } = require('playwright');
const root=require('path').resolve(process.argv[2]||'.');
(async () => {
  const b = await chromium.launch();
  for (const [vw,vh] of [[1920,1080],[1366,768]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  for (const f of ['lecture1','lecture2','lab1','student/lecture1','student/lecture2','student/lab1']) {
    await p.goto(`file://${root}/${f}.html`); await p.waitForTimeout(2500);
    const n = await p.evaluate(()=>Reveal.getTotalSlides());
    const res=[];
    for (let i=0;i<n;i++){
      const r = await p.evaluate(i=>{
        Reveal.slide(i); const s=Reveal.getCurrentSlide();
        s.querySelectorAll('.fragment').forEach(x=>x.classList.add('visible'));
        const sr=s.getBoundingClientRect(), k=sr.width/1920;
        const items=[]; let maxB=0, out=0;
        const tw=document.createTreeWalker(s,NodeFilter.SHOW_TEXT);let t;
        while((t=tw.nextNode())){
          if(!t.textContent.trim())continue; const pe=t.parentElement;
          if(pe.closest('aside,.w1-nav,.backend-warn,.chrome-top,.chrome-foot'))continue;
          const cs=getComputedStyle(pe); if(cs.visibility==='hidden'||+cs.opacity===0)continue;
          if(pe.closest('svg')) continue;
          if(!pe.offsetParent && cs.position!=='fixed')continue;
          const rg=document.createRange();rg.selectNodeContents(t);
          for(const q of rg.getClientRects()){ if(q.width<2)continue; const y2=(q.bottom-sr.top)/k,x2=(q.right-sr.left)/k; if(y2>1082||x2>1922) out++; maxB=Math.max(maxB,y2); items.push({el:pe,x1:(q.left-sr.left)/k,y1:(q.top-sr.top)/k,x2,y2,t:t.textContent.trim().slice(0,10)});}
        }
        s.querySelectorAll('svg,img,canvas').forEach(e=>{if(e.closest('aside'))return;const q=e.getBoundingClientRect();if(q.width>2&&q.height>2&&e.offsetParent!==null||e.tagName==='svg')maxB=Math.max(maxB,Math.min(1080,(q.bottom-sr.top)/k));});
        let ov=[];
        for(let x=0;x<items.length;x++)for(let y=x+1;y<items.length;y++){const a=items[x],c=items[y]; if(a.el===c.el||a.el.contains(c.el)||c.el.contains(a.el))continue;
          const ox=Math.min(a.x2,c.x2)-Math.max(a.x1,c.x1), oy=Math.min(a.y2,c.y2)-Math.max(a.y1,c.y1); if(ox>4&&oy>6) ov.push(a.t+'/'+c.t);}
        return {cls:s.className,maxB:Math.round(maxB),out,ov:[...new Set(ov)].slice(0,3)};
      },i);
      if((r.maxB<840 && !/m-section|m-cover|m-statement/.test(r.cls))||r.out||r.ov.length) res.push(`${i+1}:${r.maxB}${r.out?' OUT'+r.out:''}${r.ov.length?' OV '+r.ov.join(';'):''}`);
    }
    console.log(vw, f, n, res.join(' | ')||'ok');
  }
  console.log('errors',JSON.stringify(errs.filter(e=>!/ERR_FILE/.test(e))));
  await p.close();
  }
  await b.close();
})();
