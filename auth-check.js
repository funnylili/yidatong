// 熠达通 - 权限检查模块

// 检查用户是否登录
function checkLogin() {
  const userStr = localStorage.getItem('yidatong_user');
  if (!userStr) {
    window.location.href = 'login.html';
    return null;
  }
  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (e) {
    localStorage.removeItem('yidatong_user');
    window.location.href = 'login.html';
    return null;
  }
}

// 检查用户是否付费
function isPaidUser() {
  const user = checkLogin();
  return user && user.isPaid === true;
}

// 获取当前用户
function getCurrentUser() {
  return checkLogin();
}

// 登出
function logout() {
  localStorage.removeItem('yidatong_user');
  window.location.href = 'login.html';
}

// 显示升级提示
function showUpgradeTip() {
  const tip = document.createElement('div');
  tip.id = 'upgradeOverlay';
  tip.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#161b22;border:1px solid rgba(233,69,96,.3);border-radius:16px;padding:32px;max-width:400px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:16px;">🔒</div>
        <div style="color:#fff;font-size:1.2rem;font-weight:700;margin-bottom:12px;">该功能需要付费解锁</div>
        <div style="color:rgba(255,255,255,.5);font-size:.85rem;margin-bottom:24px;line-height:1.6;">
          免费用户可查看每日招标信息<br>
          付费用户可使用AI生成、导出等高级功能
        </div>
        <div style="margin-bottom:20px;">
          <div style="color:#e94560;font-size:1.5rem;font-weight:800;">¥99/月</div>
          <div style="color:rgba(255,255,255,.4);font-size:.75rem;">年付仅需¥899</div>
        </div>
        <div style="display:flex;gap:12px;">
          <button onclick="document.getElementById('upgradeOverlay').remove()" style="flex:1;padding:12px;background:rgba(255,255,255,.1);border:none;border-radius:8px;color:#fff;cursor:pointer;">稍后再说</button>
          <button onclick="alert('请联系管理员：V funfun0')" style="flex:1;padding:12px;background:#e94560;border:none;border-radius:8px;color:#fff;cursor:pointer;font-weight:600;">立即升级</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(tip);
}

// 检查功能权限
function checkFeatureAccess(feature) {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.isPaid) return true;
  
  const freeFeatures = ['viewBids', 'viewProjects', 'basicInfo'];
  if (freeFeatures.includes(feature)) {
    return true;
  }
  
  showUpgradeTip();
  return false;
}

// 导出函数
window.YidaTongAuth = {
  checkLogin,
  isPaidUser,
  getCurrentUser,
  logout,
  checkFeatureAccess,
  showUpgradeTip
};