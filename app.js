// 熠达通 - 全局交互逻辑

// ==================== 工具函数 ====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function toast(msg, type = 'info') {
    const colors = { info: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#e94560' };
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const el = document.createElement('div');
    el.style.cssText = `
        position:fixed;bottom:2rem;right:2rem;z-index:9999;
        background:white;border-left:4px solid ${colors[type]};
        padding:1rem 1.5rem;border-radius:12px;
        box-shadow:0 8px 30px rgba(0,0,0,0.15);
        display:flex;align-items:center;gap:0.75rem;
        font-family:'Noto Sans SC',sans-serif;font-size:0.9rem;
        animation:slideIn 0.3s ease;max-width:320px;
    `;
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2500);
}

function modal(title, content, actions = []) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;
        display:flex;align-items:center;justify-content:center;
        animation:fadeIn 0.2s ease;
    `;
    const btns = actions.map(a =>
        `<button onclick="this.closest('.modal-overlay').remove();${a.fn||''}" style="
            padding:0.75rem 1.5rem;border-radius:10px;border:none;cursor:pointer;
            font-size:0.9rem;font-weight:500;font-family:inherit;
            background:${a.primary ? 'linear-gradient(135deg,#e94560,#ff6b6b)' : '#f3f4f6'};
            color:${a.primary ? 'white' : '#1a1a2e'};
        ">${a.label}</button>`
    ).join('');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div style="background:white;border-radius:20px;padding:2rem;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2);">
            <h3 style="font-size:1.2rem;font-weight:700;color:#1a1a2e;margin-bottom:1rem;">${title}</h3>
            <div style="color:#6b7280;font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem;">${content}</div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end;">${btns}</div>
        </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

// ==================== 全局样式注入 ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-overlay > div { animation: scaleIn 0.2s ease; }
    .ripple { position:relative; overflow:hidden; }
    .ripple::after { content:''; position:absolute; border-radius:50%; background:rgba(255,255,255,0.3); transform:scale(0); animation:rippleAnim 0.6s linear; pointer-events:none; }
    @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }
`;
document.head.appendChild(style);

// ==================== 通知按钮 ====================
document.addEventListener('DOMContentLoaded', () => {
    const notifBtn = $('.notification-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            modal('📬 消息通知', `
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                    <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;border-left:3px solid #e94560;">
                        <div style="font-weight:600;color:#1a1a2e;margin-bottom:0.25rem;">🔥 华为项目投标截止提醒</div>
                        <div style="font-size:0.8rem;color:#6b7280;">距截止还有 4 天 6 小时</div>
                    </div>
                    <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;border-left:3px solid #10b981;">
                        <div style="font-weight:600;color:#1a1a2e;margin-bottom:0.25rem;">✅ 广州家具展标书已提交</div>
                        <div style="font-size:0.8rem;color:#6b7280;">2小时前</div>
                    </div>
                    <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;border-left:3px solid #3b82f6;">
                        <div style="font-weight:600;color:#1a1a2e;margin-bottom:0.25rem;">🤖 AI发现3条新匹配招标</div>
                        <div style="font-size:0.8rem;color:#6b7280;">刚刚</div>
                    </div>
                </div>
            `, [{ label: '全部已读', fn: "toast('已标记全部已读','success')" }, { label: '关闭' }]);
        });
    }

    // ==================== 用户头像 ====================
    const avatar = $('.user-avatar');
    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', () => {
            modal('👤 个人中心', `
                <div style="text-align:center;margin-bottom:1rem;">
                    <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#d4a574,#c49a6c);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#1a1a2e;margin:0 auto 0.75rem;">小</div>
                    <div style="font-weight:700;font-size:1.1rem;">小方方</div>
                    <div style="color:#6b7280;font-size:0.85rem;">展览展台设计 · 10年经验</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;text-align:center;">
                    <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;"><div style="font-size:1.25rem;font-weight:700;color:#e94560;">28</div><div style="font-size:0.75rem;color:#6b7280;">本月完成</div></div>
                    <div style="padding:0.75rem;background:#faf8f5;border-radius:10px;"><div style="font-size:1.25rem;font-weight:700;color:#10b981;">85%</div><div style="font-size:0.75rem;color:#6b7280;">中标率</div></div>
                </div>
            `, [{ label: '退出登录' }, { label: '个人设置', primary: true }]);
        });
    }

    initPageFeatures();
});

function initPageFeatures() {
    const page = document.title;
    console.log('当前页面:', page);
    
    if (page.includes('工作台') || page.includes('熠达通 -') && !page.includes('设计') && !page.includes('标书') && !page.includes('招标')) {
        if (typeof initDashboard === 'function') initDashboard();
    }
    if (page.includes('设计工作台')) {
        if (typeof initDesign === 'function') initDesign();
    }
    if (page.includes('标书制作')) {
        if (typeof initDocument === 'function') initDocument();
    }
    if (page.includes('招标信息')) {
        if (typeof initBidInfo === 'function') initBidInfo();
    }
}
