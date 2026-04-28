// 熠达通 - 招标信息页交互

function initBidInfo() {
    initSearch();
    initFilters();
    initBidCards();
    initSortBtns();
    initPagination();
    initAIRecommendations();
    initStatCards();
}

// 搜索功能
function initSearch() {
    const input = $('.search-input');
    const btn = $('.search-btn');
    if (!btn) return;

    const allCards = $$('.bid-card');

    btn.addEventListener('click', () => doSearch(input?.value || ''));
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(input.value); });

    function doSearch(query) {
        if (!query.trim()) {
            allCards.forEach(c => c.style.display = '');
            toast('显示全部招标信息', 'info');
            return;
        }
        let found = 0;
        allCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const match = text.includes(query.toLowerCase());
            card.style.display = match ? '' : 'none';
            if (match) found++;
        });
        toast(`搜索"${query}"，找到 ${found} 条结果`, found > 0 ? 'success' : 'warning');
    }
}

// 筛选标签
function initFilters() {
    const tags = $$('.filter-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const text = tag.textContent;
            const allCards = $$('.bid-card');

            if (text === '全部') {
                allCards.forEach(c => c.style.display = '');
                toast('显示全部招标信息', 'info');
                return;
            }

            let shown = 0;
            allCards.forEach(card => {
                let show = true;
                if (text === '今日更新') show = card.textContent.includes('2026-04-06') || card.textContent.includes('2026-04-07');
                else if (text === '高匹配度') show = card.textContent.includes('9') && card.textContent.includes('%');
                else if (text === '50万以上') show = !card.textContent.includes('30-50万');
                else if (text === '100万以上') show = card.textContent.includes('200万') || card.textContent.includes('80-120万');
                else if (text === '即将截止') show = card.textContent.includes('4月12日') || card.textContent.includes('4月15日');
                card.style.display = show ? '' : 'none';
                if (show) shown++;
            });
            toast(`筛选"${text}"，共 ${shown} 条`, 'info');
        });
    });
}

// 招标卡片交互
function initBidCards() {
    $$('.bid-card').forEach(card => {
        // 收藏按钮
        const collectBtn = card.querySelector('.action-btn:first-child');
        if (collectBtn) {
            collectBtn.addEventListener('click', e => {
                e.stopPropagation();
                const isCollected = collectBtn.textContent.includes('已收藏');
                collectBtn.textContent = isCollected ? '📌 收藏' : '⭐ 已收藏';
                collectBtn.style.background = isCollected ? '' : 'rgba(245,158,11,0.1)';
                collectBtn.style.borderColor = isCollected ? '' : '#f59e0b';
                collectBtn.style.color = isCollected ? '' : '#f59e0b';
                toast(isCollected ? '已取消收藏' : '已收藏到关注列表', isCollected ? 'info' : 'success');
            });
        }

        // 详情按钮
        const detailBtn = card.querySelectorAll('.action-btn')[1];
        if (detailBtn) {
            detailBtn.addEventListener('click', e => {
                e.stopPropagation();
                const title = card.querySelector('.bid-title')?.textContent;
                const budget = card.querySelector('.bid-info-value.budget')?.textContent;
                const location = card.querySelectorAll('.bid-info-value')[1]?.textContent;
                const deadline = card.querySelectorAll('.bid-info-value')[2]?.textContent;
                const area = card.querySelectorAll('.bid-info-value')[3]?.textContent;
                const tags = [...card.querySelectorAll('.bid-tag')].map(t => t.textContent).join('、');

                modal('📋 招标详情', `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <div style="font-weight:700;font-size:1.05rem;color:#1a1a2e;">${title}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                            <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;">
                                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem;">预算金额</div>
                                <div style="font-weight:700;color:#e94560;">${budget || '-'}</div>
                            </div>
                            <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;">
                                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem;">项目地点</div>
                                <div style="font-weight:600;">${location || '-'}</div>
                            </div>
                            <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;">
                                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem;">投标截止</div>
                                <div style="font-weight:600;color:#f59e0b;">${deadline || '-'}</div>
                            </div>
                            <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;">
                                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem;">展位面积</div>
                                <div style="font-weight:600;">${area || '-'}</div>
                            </div>
                        </div>
                        <div>
                            <div style="font-size:0.8rem;color:#6b7280;margin-bottom:0.5rem;">项目标签</div>
                            <div style="font-size:0.85rem;">${tags}</div>
                        </div>
                        <div style="padding:0.75rem;background:rgba(16,185,129,0.05);border-radius:10px;border-left:3px solid #10b981;">
                            <div style="font-size:0.8rem;font-weight:600;color:#10b981;margin-bottom:0.25rem;">🤖 AI分析</div>
                            <div style="font-size:0.85rem;color:#6b7280;">该项目与您的历史业务高度匹配，建议优先跟进。竞争对手预计3-5家，胜算较大。</div>
                        </div>
                    </div>
                `, [
                    { label: '关闭' },
                    { label: '下载招标文件', fn: "toast('招标文件下载中...','info')" },
                    { label: '创建项目', primary: true, fn: "toast('项目已创建，跳转到设计工作台','success');setTimeout(()=>window.location.href='design.html',1000)" }
                ]);
            });
        }

        // 创建项目按钮
        const createBtn = card.querySelector('.action-btn-primary');
        if (createBtn) {
            createBtn.addEventListener('click', e => {
                e.stopPropagation();
                const title = card.querySelector('.bid-title')?.textContent;
                modal('➕ 创建项目', `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;font-size:0.9rem;color:#6b7280;">
                            关联招标：<strong style="color:#1a1a2e;">${title}</strong>
                        </div>
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;display:block;margin-bottom:0.5rem;">项目负责人</label>
                            <input type="text" value="小方方" style="width:100%;padding:0.75rem;border:2px solid rgba(0,0,0,0.08);border-radius:10px;font-size:0.95rem;font-family:inherit;outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.85rem;font-weight:500;display:block;margin-bottom:0.5rem;">优先级</label>
                            <div style="display:flex;gap:0.5rem;">
                                <span style="padding:0.4rem 0.75rem;background:rgba(233,69,96,0.1);border:2px solid #e94560;border-radius:8px;font-size:0.85rem;cursor:pointer;">🔴 高</span>
                                <span style="padding:0.4rem 0.75rem;background:#faf8f5;border:2px solid transparent;border-radius:8px;font-size:0.85rem;cursor:pointer;">🟡 中</span>
                                <span style="padding:0.4rem 0.75rem;background:#faf8f5;border:2px solid transparent;border-radius:8px;font-size:0.85rem;cursor:pointer;">🟢 低</span>
                            </div>
                        </div>
                    </div>
                `, [
                    { label: '取消' },
                    { label: '创建并开始设计', primary: true, fn: "toast('项目已创建！','success');setTimeout(()=>window.location.href='design.html',800)" }
                ]);
            });
        }

        // 卡片整体悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.cursor = 'pointer';
        });
    });
}

// 排序按钮
function initSortBtns() {
    const sortBtns = $$('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.style.background = '');
            btn.style.background = 'rgba(233,69,96,0.1)';
            btn.style.color = '#e94560';
            toast(`已按${btn.textContent.trim().replace(/^[^\s]+\s/, '')}排序`, 'info');
        });
    });
}

// 分页
function initPagination() {
    const pageBtns = $$('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent === '←' || btn.textContent === '→') {
                toast('加载更多招标信息...', 'info');
                return;
            }
            pageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            toast(`第 ${btn.textContent} 页`, 'info');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// AI推荐
function initAIRecommendations() {
    $$('.recommendation-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.rec-title')?.textContent;
            const meta = item.querySelector('.rec-meta')?.textContent;
            toast(`查看推荐项目: ${title}`, 'info');
        });
    });

    $$('.rec-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const title = btn.closest('.recommendation-item')?.querySelector('.rec-title')?.textContent;
            toast(`已打开: ${title}`, 'info');
        });
    });
}

// 统计卡片动画
function initStatCards() {
    $$('.stat-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const label = card.querySelector('.stat-label')?.textContent;
            const value = card.querySelector('.stat-value')?.textContent;
            toast(`${label}: ${value}`, 'info');
        });
    });

    // 数字滚动动画
    $$('.stat-value').forEach(el => {
        const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
        if (!target || isNaN(target)) return;
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const step = Math.ceil(target / 30);
        const iv = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(iv);
        }, 30);
    });
}
