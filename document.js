// 熠达通 - 标书制作交互

function initDocument() {
    initSidebarChapters();
    initEditorToolbar();
    initAIAssistant();
    initChecklist();
    initPanelTabs();
    initBottomActions();
    initInsertPlaceholders();
    initTemplates();
}

// 侧边栏章节导航
function initSidebarChapters() {
    const links = $$('.sidebar-menu a');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const name = link.textContent.trim().replace(/完成|编辑中|待填写/g, '').trim();
            loadChapter(name);
        });
    });
}

function loadChapter(name) {
    const page = $('.page-content');
    if (!page) return;
    const chapters = {
        '封面': `<h1>投标文件封面</h1>
            <div style="text-align:center;padding:3rem 0;border:2px solid rgba(0,0,0,0.08);border-radius:12px;margin:1rem 0;">
                <div style="font-size:2rem;font-weight:700;color:#1a1a2e;margin-bottom:1rem;">华为终端有限公司</div>
                <div style="font-size:1.5rem;color:#6b7280;margin-bottom:2rem;">2026新品发布会展厅设计搭建</div>
                <div style="font-size:1.2rem;font-weight:600;color:#e94560;margin-bottom:3rem;">投 标 文 件</div>
                <div style="font-size:0.95rem;color:#6b7280;line-height:2;">
                    <div>投标单位：<strong style="color:#1a1a2e;">熠达展览工程有限公司</strong></div>
                    <div>投标日期：<strong style="color:#1a1a2e;">2026年4月12日</strong></div>
                    <div>联系人：<strong style="color:#1a1a2e;">小方方</strong></div>
                </div>
            </div>`,
        '投标函': `<h1>投标函</h1>
            <p>致：华为终端有限公司采购部</p>
            <p>我方已仔细研究了贵方发布的《2026新品发布会展厅设计搭建》招标文件的全部内容，包括招标文件及其所有附件，我方愿意按照招标文件的要求，以人民币 <strong style="color:#e94560;">（大写）壹佰捌拾万元整（¥1,800,000.00）</strong> 的投标总价，承担本项目的全部工作。</p>
            <p>我方承诺：</p>
            <ul>
                <li>严格按照招标文件要求完成全部工作内容</li>
                <li>工期承诺：自合同签订之日起 <strong>45个工作日</strong> 内完成</li>
                <li>质量标准：达到国家展览工程验收标准</li>
                <li>本投标文件有效期为投标截止日后 <strong>90天</strong></li>
            </ul>`,
        '公司概况': `<h1>一、公司概况</h1>
            <h2>1.1 公司简介</h2>
            <p>熠达展览工程有限公司成立于2015年，是一家专注于展览展台设计与搭建的专业公司。公司拥有10年行业经验，累计完成展览项目200余个，服务客户涵盖汽车、科技、消费品等多个行业。</p>
            <h2>1.2 核心优势</h2>
            <ul>
                <li><strong>设计能力：</strong>拥有专业设计团队，具备手绘、3D建模、动态视频全流程设计能力</li>
                <li><strong>施工经验：</strong>10年展览搭建经验，熟悉各大展馆施工规范</li>
                <li><strong>项目管理：</strong>完善的项目管理体系，确保按时交付</li>
            </ul>`,
        '报价明细表': `<h1>报价明细表</h1>
            <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
                <thead>
                    <tr style="background:#1a1a2e;color:white;">
                        <th style="padding:0.75rem;text-align:left;border:1px solid rgba(255,255,255,0.1);">序号</th>
                        <th style="padding:0.75rem;text-align:left;border:1px solid rgba(255,255,255,0.1);">项目名称</th>
                        <th style="padding:0.75rem;text-align:right;border:1px solid rgba(255,255,255,0.1);">单价(元)</th>
                        <th style="padding:0.75rem;text-align:right;border:1px solid rgba(255,255,255,0.1);">数量</th>
                        <th style="padding:0.75rem;text-align:right;border:1px solid rgba(255,255,255,0.1);">合计(元)</th>
                    </tr>
                </thead>
                <tbody>
                    ${[['1','展台设计费','150,000','1式','150,000'],['2','主体结构搭建','800','900㎡','720,000'],['3','装饰材料','300','900㎡','270,000'],['4','灯光系统','200,000','1套','200,000'],['5','多媒体设备','300,000','1套','300,000'],['6','运输安装','80,000','1式','80,000'],['7','管理费','80,000','1式','80,000']].map(r => `
                    <tr style="border-bottom:1px solid rgba(0,0,0,0.05);">
                        ${r.map((c,i) => `<td style="padding:0.75rem;${i>1?'text-align:right;':''}">${c}</td>`).join('')}
                    </tr>`).join('')}
                    <tr style="background:#faf8f5;font-weight:700;">
                        <td colspan="4" style="padding:0.75rem;text-align:right;">合计</td>
                        <td style="padding:0.75rem;text-align:right;color:#e94560;">¥1,800,000</td>
                    </tr>
                </tbody>
            </table>`
    };
    const content = chapters[name];
    if (content) {
        page.innerHTML = content;
        toast(`已切换到: ${name}`, 'info');
    } else {
        page.innerHTML = `<h1>${name}</h1><p style="color:#6b7280;margin-top:1rem;">此章节内容待填写，点击右侧 AI 助手快速生成内容。</p>
        <div style="margin-top:2rem;padding:2rem;border:2px dashed rgba(233,69,96,0.3);border-radius:12px;text-align:center;cursor:pointer;" onclick="document.querySelector('.ai-btn').click()">
            <div style="font-size:2rem;margin-bottom:0.5rem;">🤖</div>
            <div style="color:#6b7280;">点击使用 AI 自动生成此章节内容</div>
        </div>`;
        toast(`${name} - 内容待填写`, 'warning');
    }
}

// 编辑器工具栏
function initEditorToolbar() {
    const toolBtns = $$('.toolbar-center .tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.title || btn.textContent;
            if (['撤销','重做'].includes(title)) { toast(`${title}`, 'info'); return; }
            if (title === '插入图片') {
                modal('🖼 插入图片', `
                    <div style="display:flex;flex-direction:column;gap:0.75rem;">
                        <div style="padding:2rem;border:2px dashed rgba(0,0,0,0.1);border-radius:12px;text-align:center;cursor:pointer;" onclick="toast('请选择图片文件','info')">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">📁</div>
                            <div style="color:#6b7280;font-size:0.9rem;">点击上传或拖拽图片</div>
                        </div>
                        <div style="font-size:0.85rem;color:#6b7280;">支持从设计工作台导入效果图</div>
                        <button onclick="toast('效果图已插入','success');this.closest('.modal-overlay').remove()" style="padding:0.75rem;background:rgba(233,69,96,0.1);border:1px solid #e94560;border-radius:10px;color:#e94560;cursor:pointer;font-family:inherit;">📐 从设计工作台导入</button>
                    </div>
                `, [{ label: '取消' }, { label: '插入', primary: true, fn: "toast('图片已插入','success')" }]);
            } else if (title === '插入表格') {
                modal('▦ 插入表格', `
                    <div style="display:flex;gap:1rem;align-items:center;">
                        <div><label style="font-size:0.85rem;display:block;margin-bottom:0.5rem;">行数</label>
                        <input type="number" value="5" min="1" max="50" style="width:80px;padding:0.5rem;border:2px solid rgba(0,0,0,0.08);border-radius:8px;font-family:inherit;"></div>
                        <div><label style="font-size:0.85rem;display:block;margin-bottom:0.5rem;">列数</label>
                        <input type="number" value="4" min="1" max="20" style="width:80px;padding:0.5rem;border:2px solid rgba(0,0,0,0.08);border-radius:8px;font-family:inherit;"></div>
                    </div>
                `, [{ label: '取消' }, { label: '插入', primary: true, fn: "toast('表格已插入','success')" }]);
            } else {
                toast(`${title} 功能`, 'info');
            }
        });
    });

    // 预览按钮
    const previewBtn = $('.toolbar-right .btn-secondary');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            modal('👁 标书预览', `
                <div style="text-align:center;padding:1rem;">
                    <div style="font-size:3rem;margin-bottom:1rem;">📄</div>
                    <div style="font-weight:600;margin-bottom:0.5rem;">华为新品发布会展厅 - 技术标书</div>
                    <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1rem;">共 45 页 · 完成度 78%</div>
                    <div style="display:flex;gap:0.5rem;justify-content:center;">
                        <span style="padding:0.35rem 0.75rem;background:rgba(16,185,129,0.1);color:#10b981;border-radius:6px;font-size:0.8rem;">✓ 封面</span>
                        <span style="padding:0.35rem 0.75rem;background:rgba(16,185,129,0.1);color:#10b981;border-radius:6px;font-size:0.8rem;">✓ 投标函</span>
                        <span style="padding:0.35rem 0.75rem;background:rgba(245,158,11,0.1);color:#f59e0b;border-radius:6px;font-size:0.8rem;">⏳ 报价表</span>
                        <span style="padding:0.35rem 0.75rem;background:rgba(107,114,128,0.1);color:#6b7280;border-radius:6px;font-size:0.8rem;">○ 业绩</span>
                    </div>
                </div>
            `, [{ label: '关闭' }, { label: '导出PDF', primary: true, fn: "toast('正在生成PDF...','info')" }]);
        });
    }

    // 保存按钮
    const saveBtn = $('.toolbar-right .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            toast('标书已自动保存', 'success');
        });
    }
}

// AI助手
function initAIAssistant() {
    const aiInput = $('.ai-input');
    const aiBtn = $('.ai-btn');
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            const query = aiInput?.value || '生成内容';
            if (!query.trim()) { toast('请输入生成需求', 'warning'); return; }
            toast('AI正在生成内容...', 'info');
            aiBtn.textContent = '生成中...';
            aiBtn.disabled = true;
            setTimeout(() => {
                aiBtn.textContent = '生成';
                aiBtn.disabled = false;
                const page = $('.page-content');
                if (page) {
                    const p = document.createElement('p');
                    p.style.cssText = 'background:rgba(233,69,96,0.03);border-left:3px solid #e94560;padding:1rem;border-radius:0 8px 8px 0;margin:1rem 0;';
                    p.innerHTML = `<strong>🤖 AI生成内容：</strong><br>${query}相关内容已自动生成。我公司在该领域拥有丰富的项目经验，曾成功完成多个同类型项目，具备完善的质量管理体系和专业的项目团队，能够确保项目按时、按质完成。`;
                    page.appendChild(p);
                    p.scrollIntoView({ behavior: 'smooth' });
                }
                toast('内容已生成并插入', 'success');
                if (aiInput) aiInput.value = '';
            }, 1500);
        });
    }

    // AI建议芯片
    $$('.ai-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            if (aiInput) aiInput.value = chip.textContent.replace(/^[^\s]+\s/, '');
            toast('已填入生成需求，点击生成按钮', 'info');
        });
    });
}

// 检查清单
function initChecklist() {
    $$('.checklist-item').forEach(item => {
        const checkbox = item.querySelector('.checklist-checkbox');
        const text = item.querySelector('.checklist-text');
        if (!checkbox || !text) return;
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const isChecked = checkbox.classList.contains('checked');
            if (isChecked) {
                checkbox.classList.remove('checked');
                checkbox.textContent = '✓';
                text.classList.remove('checked');
                toast('已取消勾选', 'info');
            } else {
                checkbox.classList.add('checked');
                checkbox.textContent = '✓';
                text.classList.add('checked');
                toast('已完成: ' + text.textContent, 'success');
            }
        });
    });
}

// 面板标签切换
function initPanelTabs() {
    const tabs = $$('.panel-tab');
    const sections = {
        'AI 助手': '.ai-section',
        '模板': '.template-grid',
        '检查': '.checklist'
    };
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            toast(`切换到: ${tab.textContent}`, 'info');
        });
    });
}

// 模板插入
function initTemplates() {
    $$('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.querySelector('.template-name')?.textContent;
            toast(`${name}模板已插入到文档`, 'success');
        });
    });
}

// 底部操作
function initBottomActions() {
    $$('.bottom-actions .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.trim();
            if (text.includes('Word')) {
                toast('正在导出Word文档...', 'info');
                setTimeout(() => toast('Word文档已导出到桌面', 'success'), 1500);
            } else if (text.includes('PDF')) {
                toast('正在生成PDF...', 'info');
                setTimeout(() => toast('PDF已生成，共45页', 'success'), 1500);
            } else if (text.includes('提交')) {
                modal('🚀 确认提交投标', `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <div style="padding:1rem;background:#fef3c7;border-radius:10px;border-left:3px solid #f59e0b;">
                            <strong>⚠️ 提交前请确认：</strong>
                            <ul style="margin-top:0.5rem;padding-left:1.25rem;font-size:0.9rem;">
                                <li>所有章节已填写完整</li>
                                <li>报价金额已核对无误</li>
                                <li>签字盖章已完成</li>
                                <li>投标截止时间：2026-04-12 18:00</li>
                            </ul>
                        </div>
                        <div style="font-size:0.9rem;color:#6b7280;">提交后将无法修改，请确认无误后再提交。</div>
                    </div>
                `, [
                    { label: '再检查一遍' },
                    { label: '确认提交', primary: true, fn: "toast('投标文件已成功提交！','success')" }
                ]);
            }
        });
    });
}

// 插入占位符
function initInsertPlaceholders() {
    $$('.insert-placeholder').forEach(ph => {
        ph.addEventListener('click', () => {
            const text = ph.textContent.trim();
            if (text.includes('组织架构')) {
                ph.innerHTML = `<div style="padding:1rem;background:#faf8f5;border-radius:8px;text-align:center;">
                    <div style="font-weight:600;margin-bottom:1rem;color:#1a1a2e;">项目组织架构图</div>
                    <div style="display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;">
                        <div style="text-align:center;"><div style="padding:0.5rem 1rem;background:#1a1a2e;color:white;border-radius:8px;font-size:0.85rem;">项目经理</div></div>
                    </div>
                    <div style="display:flex;justify-content:center;gap:1rem;margin-top:1rem;flex-wrap:wrap;">
                        ${['设计总监','技术负责人','施工队长','安全员'].map(r=>`<div style="padding:0.4rem 0.75rem;background:#e94560;color:white;border-radius:6px;font-size:0.8rem;">${r}</div>`).join('')}
                    </div>
                </div>`;
                toast('组织架构图已插入', 'success');
            } else if (text.includes('团队成员')) {
                ph.innerHTML = `<table style="width:100%;border-collapse:collapse;">
                    <tr style="background:#1a1a2e;color:white;">
                        ${['姓名','职位','资质','经验'].map(h=>`<th style="padding:0.6rem;text-align:left;font-size:0.85rem;">${h}</th>`).join('')}
                    </tr>
                    ${[['小方方','项目经理','一级建造师','10年'],['张设计','设计总监','高级室内设计师','8年'],['李工程','技术负责人','注册结构工程师','12年']].map(r=>`
                    <tr style="border-bottom:1px solid rgba(0,0,0,0.05);">
                        ${r.map(c=>`<td style="padding:0.6rem;font-size:0.85rem;">${c}</td>`).join('')}
                    </tr>`).join('')}
                </table>`;
                toast('团队成员表已插入', 'success');
            } else {
                toast('内容已插入', 'success');
                ph.style.borderStyle = 'solid';
                ph.style.borderColor = '#10b981';
                ph.innerHTML = '✅ ' + text.replace('点击插入', '已插入');
            }
        });
    });
}
