// 熠达通 - 设计工作台交互

function initDesign() {
    console.log('initDesign 开始执行');
    initStageCards();
    initToolbar();
    initCanvas();
    initLayers();
    initVersions();
    initAIPanel();
    initBottomToolbar();
    
    // 全局备用点击监听
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.stage-card');
        if (card) {
            const name = card.querySelector('.stage-name-large')?.textContent;
            console.log('全局监听到卡片点击:', name);
            if (name?.includes('手稿')) openSketchMode();
            else if (name?.includes('电脑') || name?.includes('绘图')) openDrawingMode();
            else if (name?.includes('视频')) openVideoMode();
        }
    });
}

// 阶段卡片切换
function initStageCards() {
    const cards = $$('.stage-card');
    console.log('找到卡片数量:', cards.length);
    cards.forEach((card, i) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = card.querySelector('.stage-name-large')?.textContent;
            console.log('点击了卡片:', name);
            if (name?.includes('手稿')) openSketchMode();
            else if (name?.includes('电脑') || name?.includes('绘图')) openDrawingMode();
            else if (name?.includes('视频')) openVideoMode();
            else toast('请点击具体模式卡片', 'info');
        });
    });
}

// 手稿模式
function openSketchMode() {
    console.log('openSketchMode 被调用');
    const canvas = $('.canvas-container');
    if (!canvas) {
        console.error('找不到 canvas-container');
        toast('找不到画布容器', 'error');
        return;
    }
    canvas.innerHTML = `
        <div style="width:100%;height:100%;position:relative;background:#fffef5;">
            <canvas id="sketchCanvas" style="width:100%;height:100%;cursor:crosshair;touch-action:none;"></canvas>
            <div style="position:absolute;top:1rem;left:1rem;display:flex;gap:0.5rem;flex-wrap:wrap;z-index:10;">
                <button onclick="setColor('#1a1a2e')" style="width:32px;height:32px;background:#1a1a2e;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;" title="黑色"></button>
                <button onclick="setColor('#e94560')" style="width:32px;height:32px;background:#e94560;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;" title="红色"></button>
                <button onclick="setColor('#3b82f6')" style="width:32px;height:32px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;" title="蓝色"></button>
                <button onclick="setColor('#10b981')" style="width:32px;height:32px;background:#10b981;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;" title="绿色"></button>
                <button onclick="setColor('#f59e0b')" style="width:32px;height:32px;background:#f59e0b;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;" title="黄色"></button>
                <button onclick="setColor('white');setBrushSize(20)" style="width:32px;height:32px;background:white;border-radius:50%;border:3px solid #ddd;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;" title="橡皮擦">橡</button>
            </div>
            <div style="position:absolute;top:1rem;right:1rem;display:flex;gap:0.5rem;align-items:center;z-index:10;">
                <span style="font-size:0.8rem;color:#6b7280;">粗细:</span>
                <input type="range" id="brushSize" min="1" max="30" value="3" style="width:100px;" oninput="setBrushSize(this.value)">
                <button onclick="clearSketch()" style="padding:0.5rem 1rem;background:rgba(233,69,96,0.1);border:1px solid #e94560;border-radius:8px;color:#e94560;cursor:pointer;font-size:0.85rem;font-family:inherit;">清空</button>
                <button onclick="saveSketch()" style="padding:0.5rem 1rem;background:#e94560;border:none;border-radius:8px;color:white;cursor:pointer;font-size:0.85rem;font-family:inherit;">保存</button>
            </div>
            <div style="position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);font-size:0.85rem;color:#6b7280;background:rgba(255,255,255,0.9);padding:0.5rem 1.25rem;border-radius:20px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">✏️ 手稿模式 - 在画布上自由绘制</div>
        </div>
    `;
    setTimeout(() => initSketchCanvas(), 100);
    toast('已进入手稿绘制模式，开始画画吧！', 'success');
}

function initSketchCanvas() {
    const canvas = document.getElementById('sketchCanvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let color = '#1a1a2e';
    let size = 3;

    window.setColor = (c) => { color = c; };
    window.setBrushSize = (s) => { size = parseInt(s); };
    window.clearSketch = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); toast('画布已清空', 'info'); };
    window.saveSketch = () => { toast('手稿已保存到图层库', 'success'); };

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    canvas.addEventListener('mousedown', e => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('mousemove', e => {
        if (!drawing) return;
        const p = getPos(e);
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseleave', () => drawing = false);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!drawing) return;
        const p = getPos(e);
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });
    canvas.addEventListener('touchend', () => drawing = false);
}

// 电脑绘图模式
function openDrawingMode() {
    const canvas = $('.canvas-container');
    if (!canvas) return;
    canvas.innerHTML = `
        <div style="width:100%;height:100%;position:relative;background:#f8fafc;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem;">
            <div style="text-align:center;">
                <div style="font-size:4rem;margin-bottom:1rem;">💻</div>
                <div style="font-size:1.1rem;font-weight:600;color:#1a1a2e;margin-bottom:0.5rem;">电脑绘图模式</div>
                <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1.5rem;">上传或导入设计文件</div>
                <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                    <button onclick="simulateUpload('CAD图纸')" style="padding:0.75rem 1.5rem;background:rgba(59,130,246,0.1);border:2px dashed #3b82f6;border-radius:12px;color:#3b82f6;cursor:pointer;font-size:0.9rem;font-family:inherit;">📐 导入CAD</button>
                    <button onclick="simulateUpload('3D模型')" style="padding:0.75rem 1.5rem;background:rgba(139,92,246,0.1);border:2px dashed #8b5cf6;border-radius:12px;color:#8b5cf6;cursor:pointer;font-size:0.9rem;font-family:inherit;">🧊 导入3D模型</button>
                    <button onclick="simulateUpload('效果图')" style="padding:0.75rem 1.5rem;background:rgba(16,185,129,0.1);border:2px dashed #10b981;border-radius:12px;color:#10b981;cursor:pointer;font-size:0.9rem;font-family:inherit;">🖼 上传效果图</button>
                </div>
            </div>
            <div id="uploadProgress" style="display:none;width:60%;text-align:center;">
                <div style="font-size:0.9rem;color:#6b7280;margin-bottom:0.5rem;" id="uploadLabel">正在处理...</div>
                <div style="height:8px;background:rgba(0,0,0,0.05);border-radius:4px;overflow:hidden;">
                    <div id="progressBar" style="height:100%;background:linear-gradient(90deg,#e94560,#ff6b6b);border-radius:4px;width:0%;transition:width 0.1s;"></div>
                </div>
            </div>
        </div>
    `;
    window.simulateUpload = (type) => {
        const prog = document.getElementById('uploadProgress');
        const bar = document.getElementById('progressBar');
        const label = document.getElementById('uploadLabel');
        prog.style.display = 'block';
        label.textContent = `正在处理${type}...`;
        let w = 0;
        const iv = setInterval(() => {
            w += Math.random() * 15;
            if (w >= 100) { w = 100; clearInterval(iv); setTimeout(() => { toast(`${type}导入成功！`, 'success'); prog.style.display = 'none'; }, 300); }
            bar.style.width = w + '%';
        }, 100);
    };
    toast('已进入电脑绘图模式', 'success');
}

// 视频模式
function openVideoMode() {
    const canvas = $('.canvas-container');
    if (!canvas) return;
    canvas.innerHTML = `
        <div style="width:100%;height:100%;position:relative;background:#0f0f1a;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem;">
            <div style="text-align:center;color:white;">
                <div style="font-size:4rem;margin-bottom:1rem;">🎬</div>
                <div style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">动态视频生成</div>
                <div style="font-size:0.85rem;opacity:0.7;margin-bottom:1.5rem;">基于设计方案自动生成展台漫游视频</div>
                <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                    <button onclick="generateVideo('漫游动画')" style="padding:0.75rem 1.5rem;background:rgba(233,69,96,0.2);border:2px solid #e94560;border-radius:12px;color:#ff6b6b;cursor:pointer;font-size:0.9rem;font-family:inherit;">🎥 生成漫游动画</button>
                    <button onclick="generateVideo('方案演示')" style="padding:0.75rem 1.5rem;background:rgba(212,165,116,0.2);border:2px solid #d4a574;border-radius:12px;color:#d4a574;cursor:pointer;font-size:0.9rem;font-family:inherit;">📽 方案演示视频</button>
                    <button onclick="generateVideo('施工动画')" style="padding:0.75rem 1.5rem;background:rgba(59,130,246,0.2);border:2px solid #3b82f6;border-radius:12px;color:#93c5fd;cursor:pointer;font-size:0.9rem;font-family:inherit;">🏗 施工过程动画</button>
                </div>
            </div>
            <div id="videoProgress" style="display:none;width:60%;text-align:center;">
                <div style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-bottom:0.75rem;" id="videoLabel">AI正在生成视频...</div>
                <div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;">
                    <div id="videoBar" style="height:100%;background:linear-gradient(90deg,#e94560,#d4a574);border-radius:4px;width:0%;transition:width 0.15s;"></div>
                </div>
                <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;">预计需要 2-3 分钟</div>
            </div>
        </div>
    `;
    window.generateVideo = (type) => {
        const prog = document.getElementById('videoProgress');
        const bar = document.getElementById('videoBar');
        const label = document.getElementById('videoLabel');
        prog.style.display = 'block';
        label.textContent = `AI正在生成${type}...`;
        let w = 0;
        const iv = setInterval(() => {
            w += Math.random() * 8;
            if (w >= 100) { w = 100; clearInterval(iv); setTimeout(() => { toast(`${type}生成完成！可下载查看`, 'success'); }, 300); }
            bar.style.width = w + '%';
        }, 150);
    };
    toast('已进入视频生成模式', 'success');
}

// 工具栏
function initToolbar() {
    const toolBtns = $$('.canvas-tools .tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 画布拖拽上传
function initCanvas() {
    const container = $('.canvas-container');
    if (!container) return;
    container.addEventListener('dragover', e => { e.preventDefault(); container.style.borderColor = '#e94560'; });
    container.addEventListener('dragleave', () => { container.style.borderColor = ''; });
    container.addEventListener('drop', e => {
        e.preventDefault();
        container.style.borderColor = '';
        const files = e.dataTransfer.files;
        if (files.length) toast(`已上传: ${files[0].name}`, 'success');
    });
    container.addEventListener('click', () => {
        if (container.querySelector('canvas') || container.querySelector('button')) return;
        openSketchMode();
    });
}

// 图层管理
function initLayers() {
    const layerItems = $$('.layer-item');
    layerItems.forEach(item => {
        item.addEventListener('click', () => {
            layerItems.forEach(l => l.classList.remove('active'));
            item.classList.add('active');
            const name = item.querySelector('.layer-name')?.textContent;
            toast(`已选中图层: ${name}`, 'info');
        });
    });

    const addBtn = $('.layer-panel .panel-header .tool-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal('➕ 新建图层', `
                <div style="display:flex;flex-direction:column;gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem;font-weight:500;display:block;margin-bottom:0.5rem;">图层名称</label>
                        <input type="text" placeholder="如：立面图、顶视图..." style="width:100%;padding:0.75rem;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;font-family:inherit;outline:none;">
                    </div>
                    <div>
                        <label style="font-size:0.85rem;font-weight:500;display:block;margin-bottom:0.5rem;">图层类型</label>
                        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                            <span style="padding:0.4rem 0.75rem;background:rgba(233,69,96,0.1);border:1px solid #e94560;border-radius:6px;font-size:0.8rem;cursor:pointer;">手绘稿</span>
                            <span style="padding:0.4rem 0.75rem;background:#faf8f5;border:1px solid transparent;border-radius:6px;font-size:0.8rem;cursor:pointer;">CAD图纸</span>
                            <span style="padding:0.4rem 0.75rem;background:#faf8f5;border:1px solid transparent;border-radius:6px;font-size:0.8rem;cursor:pointer;">3D渲染</span>
                            <span style="padding:0.4rem 0.75rem;background:#faf8f5;border:1px solid transparent;border-radius:6px;font-size:0.8rem;cursor:pointer;">纹理素材</span>
                        </div>
                    </div>
                </div>
            `, [{ label: '取消' }, { label: '创建', primary: true, fn: "toast('图层已创建','success')" }]);
        });
    }

    // 图层操作按钮
    $$('.layer-action-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const icon = btn.textContent;
            if (icon === '👁') { btn.style.opacity = btn.style.opacity === '0.3' ? '1' : '0.3'; toast('图层可见性已切换', 'info'); }
            if (icon === '🔒') toast('图层已锁定', 'warning');
        });
    });
}

// 版本历史
function initVersions() {
    const versionItems = $$('.version-item');
    versionItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.querySelector('.version-name')?.textContent;
            modal('🔄 版本恢复', `确定要恢复到 <strong>${name}</strong> 吗？<br><br>当前未保存的修改将会丢失。`, [
                { label: '取消' },
                { label: '确认恢复', primary: true, fn: `toast('已恢复到 ${name}','success')` }
            ]);
        });
    });
}

// AI助手面板
function initAIPanel() {
    const suggestions = $$('.ai-suggestion');
    suggestions.forEach(s => {
        s.style.cursor = 'pointer';
        s.addEventListener('click', () => {
            toast('AI建议已采纳，正在应用...', 'info');
            setTimeout(() => toast('方案已优化完成', 'success'), 1200);
        });
    });
}

// 底部工具栏
function initBottomToolbar() {
    const btns = $$('.bottom-toolbar .toolbar-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.trim();
            if (text.includes('手稿')) openSketchMode();
            else if (text.includes('绘图')) openDrawingMode();
            else if (text.includes('视频')) openVideoMode();
            else if (text.includes('生成标书')) {
                modal('📄 生成标书', `
                    <div style="display:flex;flex-direction:column;gap:0.75rem;">
                        <div style="padding:1rem;background:#faf8f5;border-radius:10px;">
                            <div style="font-weight:600;margin-bottom:0.5rem;">当前方案</div>
                            <div style="font-size:0.85rem;color:#6b7280;">华为新品发布会展厅 · V3.2 · 3个设计文件</div>
                        </div>
                        <div style="font-size:0.9rem;color:#6b7280;">AI将自动将设计方案整合到标书的技术方案章节，包括效果图、平面图和设计说明。</div>
                    </div>
                `, [
                    { label: '取消' },
                    { label: '生成标书', primary: true, fn: "toast('正在生成标书...','info');setTimeout(()=>window.location.href='document.html',1000)" }
                ]);
            }
        });
    });

    // 保存版本按钮
    const saveBtn = $('.btn-primary');
    if (saveBtn && saveBtn.textContent.includes('保存')) {
        saveBtn.addEventListener('click', () => {
            modal('💾 保存版本', `
                <div>
                    <label style="font-size:0.85rem;font-weight:500;display:block;margin-bottom:0.5rem;">版本备注</label>
                    <input type="text" placeholder="如：调整灯光效果、更新材质..." style="width:100%;padding:0.75rem;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;font-family:inherit;outline:none;">
                </div>
            `, [
                { label: '取消' },
                { label: '保存', primary: true, fn: "toast('版本 V3.3 已保存','success')" }
            ]);
        });
    }

    // 导出按钮
    const exportBtn = $('.btn-secondary');
    if (exportBtn && exportBtn.textContent.includes('导出')) {
        exportBtn.addEventListener('click', () => {
            modal('📤 导出方案', `
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                    <div onclick="this.style.borderColor='#e94560'" style="padding:1rem;background:#faf8f5;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;">📄 导出为 PDF（含效果图）</div>
                    <div onclick="this.style.borderColor='#e94560'" style="padding:1rem;background:#faf8f5;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;">🖼 导出效果图（JPG/PNG）</div>
                    <div onclick="this.style.borderColor='#e94560'" style="padding:1rem;background:#faf8f5;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;">📐 导出CAD文件（DWG）</div>
                    <div onclick="this.style.borderColor='#e94560'" style="padding:1rem;background:#faf8f5;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;">🎬 导出视频（MP4）</div>
                </div>
            `, [
                { label: '取消' },
                { label: '导出', primary: true, fn: "toast('正在导出，请稍候...','info')" }
            ]);
        });
    }
}
