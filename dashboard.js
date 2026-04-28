// 熠达通 - 首页工作台交互

function initDashboard() {
    // 快捷操作按钮
    const actions = $$('.action-btn');
    actions.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            const label = btn.querySelector('.action-label');
            if (!label) return;
            const text = label.textContent;
            if (text === '新建项目') {
                modal('➕ 新建项目', `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;color:#1a1a2e;display:block;margin-bottom:0.5rem;">项目名称</label>
                            <input id="projName" type="text" placeholder="请输入项目名称" style="width:100%;padding:0.75rem;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;font-family:inherit;outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;color:#1a1a2e;display:block;margin-bottom:0.5rem;">关联招标</label>
                            <select style="width:100%;padding:0.75rem;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;font-family:inherit;outline:none;">
                                <option>上海国际车展展台设计 (预算:80-120万)</option>
                                <option>华为新品发布会展厅 (预算:200万+)</option>
                                <option>北京文创博览会特装展位 (预算:50-80万)</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;color:#1a1a2e;display:block;margin-bottom:0.5rem;">项目类型</label>
                            <div style="display:flex;gap:0.5rem;">
                                <span style="padding:0.5rem 1rem;background:rgba(233,69,96,0.1);border:2px solid #e94560;border-radius:8px;font-size:0.85rem;cursor:pointer;">展览展台</span>
                                <span style="padding:0.5rem 1rem;background:#faf8f5;border:2px solid transparent;border-radius:8px;font-size:0.85rem;cursor:pointer;">品牌展厅</span>
                                <span style="padding:0.5rem 1rem;background:#faf8f5;border:2px solid transparent;border-radius:8px;font-size:0.85rem;cursor:pointer;">活动会场</span>
                            </div>
                        </div>
                    </div>
                `, [
                    { label: '取消' },
                    { label: '创建项目', primary: true, fn: `toast('项目创建成功！','success');setTimeout(()=>{const overlay=document.querySelector('.modal-overlay');if(overlay)overlay.remove();setTimeout(()=>window.location.href='design.html',300)},500)` }
                ]);
            } else if (text === '抓取招标') {
                toast('正在抓取最新招标信息...', 'info');
                setTimeout(() => toast('发现 8 条新招标信息！', 'success'), 1500);
            } else if (text === '开始设计') {
                window.location.href = 'design.html';
            } else if (text === '生成标书') {
                window.location.href = 'document.html';
            }
        });
    });

    // 招标项目列表点击
    const bidItems = $$('.bid-item');
    bidItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.bid-title')?.textContent || '项目';
            const meta = item.querySelector('.bid-meta')?.textContent || '';
            modal('📋 ' + title, `
                <div style="display:flex;flex-direction:column;gap:1rem;">
                    <div style="padding:1rem;background:#faf8f5;border-radius:10px;">
                        <div style="font-size:0.8rem;color:#6b7280;margin-bottom:0.5rem;">项目详情</div>
                        <div style="font-size:0.95rem;color:#1a1a2e;">${meta}</div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                        <div style="padding:0.75rem;background:#faf8f5;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;font-weight:700;color:#e94560;">78%</div>
                            <div style="font-size:0.75rem;color:#6b7280;">需求匹配度</div>
                        </div>
                        <div style="padding:0.75rem;background:#faf8f5;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;font-weight:700;color:#f59e0b;">中等</div>
                            <div style="font-size:0.75rem;color:#6b7280;">竞争程度</div>
                        </div>
                    </div>
                </div>
            `, [
                { label: '稍后处理' },
                { label: '立即跟进', primary: true, fn: "toast('已添加到跟进列表','success')" },
                { label: '创建项目', primary: true, fn: `window.location.href='design.html'` }
            ]);
        });
    });

    // 设计预览点击
    const designItems = $$('.design-item');
    designItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.querySelector('.design-name')?.textContent || '设计';
            const type = item.querySelector('.design-type')?.textContent || '';
            toast(`打开${type}: ${name}`, 'info');
            setTimeout(() => window.location.href = 'design.html', 500);
        });
    });

    // 时间线点击
    const timelineItems = $$('.timeline-item');
    timelineItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const title = item.querySelector('.timeline-title')?.textContent || '日程';
            const desc = item.querySelector('.timeline-desc')?.textContent || '';
            toast(`${title} - ${desc}`, 'info');
        });
    });

    // 流水线阶段点击
    const stages = $$('.stage');
    stages.forEach(stage => {
        stage.style.cursor = 'pointer';
        stage.addEventListener('click', () => {
            const name = stage.querySelector('.stage-name')?.textContent || '';
            if (name === '信息收集') window.location.href = 'bidinfo.html';
            else if (name === '方案设计') window.location.href = 'design.html';
            else if (name === '标书制作' || name === '投标提交') window.location.href = 'document.html';
            else toast(`${name} - 功能开发中...`, 'warning');
        });
    });
}
