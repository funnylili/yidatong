// 项目数据存储
let projects = JSON.parse(localStorage.getItem('yidatong_projects') || '[]');
let currentFilter = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    updateStats();
});

// 打开新建项目弹窗
function openNewProjectModal() {
    document.getElementById('newProjectModal').classList.add('show');
    document.getElementById('projectName').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('location').value = '';
    document.getElementById('requirements').value = '';
    document.getElementById('notes').value = '';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('newProjectModal').classList.remove('show');
}

// 创建项目
function createProject() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) {
        showToast('请输入项目名称');
        return;
    }
    
    const project = {
        id: Date.now(),
        name: name,
        type: document.getElementById('projectType').value,
        client: document.getElementById('clientName').value,
        budget: document.getElementById('budget').value,
        deadline: document.getElementById('deadline').value,
        location: document.getElementById('location').value,
        requirements: document.getElementById('requirements').value,
        notes: document.getElementById('notes').value,
        status: 'in_progress',
        progress: 10,
        createdAt: new Date().toISOString()
    };
    
    projects.unshift(project);
    saveProjects();
    closeModal();
    renderProjects();
    updateStats();
    showToast('项目创建成功');
}

// 保存项目到本地存储
function saveProjects() {
    localStorage.setItem('yidatong_projects', JSON.stringify(projects));
}

// 筛选项目
function filterProjects(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProjects();
}

// 渲染项目列表
function renderProjects() {
    const list = document.getElementById('projectList');
    const filtered = projects.filter(p => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'urgent') return isUrgent(p);
        return p.status === currentFilter;
    });
    
    if (filtered.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:3rem;color:#6b7280;"><div style="font-size:3rem;opacity:0.5;">📁</div><p>暂无项目</p><p style="font-size:0.9rem;">点击右上角"新建项目"开始</p></div>';
        document.getElementById('projectCount').textContent = '0 个项目';
        return;
    }
    
    document.getElementById('projectCount').textContent = filtered.length + ' 个项目';
    
    list.innerHTML = filtered.map(p => {
        const badge = getStatusBadge(p);
        const meta = getProjectMeta(p);
        return `
            <div class="project-item" onclick="openProjectDetail(${p.id})">
                <div class="project-info">
                    <div class="project-name">
                        ${p.name}
                        ${badge}
                    </div>
                    <div class="project-meta">
                        ${meta}
                    </div>
                </div>
                <div class="project-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-outline" onclick="openBidDocument(${p.id})">生成标书</button>
                    <button class="btn btn-primary" onclick="window.location.href='document.html?project=${p.id}'">标书制作</button>
                </div>
            </div>
        `;
    }).join('');
}

// 获取状态标签
function getStatusBadge(project) {
    if (isUrgent(project)) {
        return '<span class="project-badge warning">紧急</span>';
    }
    switch(project.status) {
        case 'in_progress': return '<span class="project-badge">进行中</span>';
        case 'pending': return '<span class="project-badge warning">待投标</span>';
        case 'completed': return '<span class="project-badge success">已完成</span>';
        default: return '';
    }
}

// 获取项目元信息
function getProjectMeta(project) {
    const metas = [];
    if (project.client) metas.push('客户: ' + project.client);
    if (project.budget) metas.push('预算: ' + project.budget + '万');
    if (project.deadline) metas.push('截止: ' + project.deadline);
    if (project.location) metas.push(project.location);
    return metas.join(' | ');
}

// 判断是否紧急
function isUrgent(project) {
    if (!project.deadline) return false;
    const deadline = new Date(project.deadline);
    const now = new Date();
    const daysLeft = (deadline - now) / (1000 * 60 * 60 * 24);
    return daysLeft <= 7 && daysLeft > 0;
}

// 更新统计数据
function updateStats() {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === 'in_progress').length;
    const pending = projects.filter(p => p.status === 'pending').length;
    const totalBudget = projects.reduce((sum, p) => {
        const budget = parseFloat(p.budget) || 0;
        return sum + budget;
    }, 0);
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('budgetSum').textContent = totalBudget;
}

// 打开项目详情
function openProjectDetail(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    alert('项目: ' + project.name + '\n\n类型: ' + project.type + '\n客户: ' + project.client + '\n预算: ' + project.budget + '万\n截止: ' + project.deadline + '\n地点: ' + project.location + '\n\n招标要求:\n' + project.requirements);
}

// 打开标书制作（从项目提取要求）
function openBidDocument(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    // 跳转到标书制作，并带入项目要求
    window.location.href = 'document.html?project=' + id + '&name=' + encodeURIComponent(project.name) + '&requirements=' + encodeURIComponent(project.requirements);
}

// 显示提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 更新首页项目数量
function updateProjectCount() {
    const count = projects.length;
    const countEl = document.getElementById('project-count');
    if (countEl) countEl.textContent = count;
}