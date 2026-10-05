// ===== Global Interactivity Script =====
// Makes all buttons, tabs, and interactive elements functional

document.addEventListener('DOMContentLoaded', function() {

  // === 1. Tab Group Switching ===
  document.querySelectorAll('.tab-group').forEach(function(group) {
    const tabs = group.querySelectorAll('.tab-btn');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        // Show feedback toast
        showToast('已切换到：' + tab.textContent.trim());
      });
    });
  });

  // === 2. All secondary/outline buttons get click feedback ===
  document.querySelectorAll('.btn').forEach(function(btn) {
    if (btn.onclick || btn.tagName === 'A') return; // skip if already has handler or is a link
    btn.addEventListener('click', function(e) {
      // Ripple effect
      btn.style.transform = 'scale(0.96)';
      setTimeout(function() { btn.style.transform = ''; }, 150);
    });
  });

  // === 3. Checkboxes in health plan ===
  document.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    if (cb.disabled) return;
    cb.addEventListener('change', function() {
      const label = cb.closest('label');
      if (label) {
        const text = label.querySelector('span');
        if (text && !text.dataset.original) {
          text.dataset.original = text.textContent;
        }
        if (cb.checked) {
          text.style.textDecoration = 'line-through';
          text.style.color = 'var(--color-muted-text)';
          label.style.background = 'var(--color-primary-light)';
          showToast('✅ 已打卡');
        } else {
          text.style.textDecoration = 'none';
          text.style.color = 'var(--color-text)';
          label.style.background = 'var(--color-surface)';
          showToast('取消打卡');
        }
      }
    });
  });

  // === 4. Table row buttons (查看, 编辑 etc) ===
  document.querySelectorAll('table .btn').forEach(function(btn) {
    if (btn.onclick) return;
    btn.addEventListener('click', function() {
      const row = btn.closest('tr');
      if (!row) return;
      const name = row.querySelector('td:nth-child(2)');
      const nameText = name ? name.textContent.trim().split('\n')[0].trim() : '该条目';
      const action = btn.textContent.trim();
      showToast(action + '：' + nameText);
    });
  });

  // === 5. Stat cards click feedback ===
  document.querySelectorAll('.stat-card, .card-interactive').forEach(function(card) {
    card.addEventListener('click', function() {
      card.style.transform = 'scale(0.98)';
      setTimeout(function() { card.style.transform = ''; }, 200);
    });
  });

  // === 6. Header icon buttons ===
  document.querySelectorAll('.header-icon-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const label = btn.getAttribute('aria-label') || '操作';
      if (label === '通知') {
        showToast('📬 你有 3 条未读通知');
        // Remove badge after clicking
        const badge = btn.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';
      } else {
        showToast(label);
      }
    });
  });

  // === 7. Search input ===
  document.querySelectorAll('.header-search input').forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        showToast('🔍 搜索：' + input.value.trim());
      }
    });
  });

  // === 8. Export buttons ===
  document.querySelectorAll('.btn').forEach(function(btn) {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('导出') && !btn.onclick) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('📥 正在导出文件…');
        btn.disabled = true;
        setTimeout(function() {
          btn.disabled = false;
          showToast('✅ 导出完成（演示模式）');
        }, 1500);
      });
    }
  });

  // === 9. Data entry button (health data page) ===
  document.querySelectorAll('[data-anchor-id="health-data.add-btn"]').forEach(function(btn) {
    if (btn.onclick) return;
    btn.addEventListener('click', function() {
      showToast('📝 数据录入面板（功能开发中）');
    });
  });

  // === 10. Pagination buttons ===
  document.querySelectorAll('table').forEach(function(table) {
    const pagination = table.closest('.card')?.querySelector('button');
    if (!pagination) return;
    const container = table.closest('.card');
    container?.querySelectorAll('.btn').forEach(function(btn) {
      const text = btn.textContent.trim();
      if (text === '上一页' || text === '下一页' || /^\d+$/.test(text) || text === '...') {
        if (!btn.onclick) {
          btn.addEventListener('click', function() {
            if (text === '...') return;
            if (btn.disabled) return;
            showToast('📄 跳转到第 ' + text + ' 页');
          });
        }
      }
    });
  });

  // === Toast Notification System ===
  function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'global-toast';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0F172A;color:#F8FAFC;padding:0.75rem 1.5rem;border-radius:12px;font-size:0.85rem;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.15);animation:toastIn 0.3s ease;max-width:90vw;text-align:center;';
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { toast.remove(); }, 300);
    }, 2000);
  }

  // Add toast animation
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(style);
  }

  // === 11. Share button ===
  document.querySelectorAll('.btn').forEach(function(btn) {
    if (btn.textContent.trim() === '分享' && !btn.onclick) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({ title: 'AI 健康管理系统', url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href).then(function() {
            showToast('🔗 链接已复制到剪贴板');
          });
        }
      });
    }
  });

  // === 12. Model cards selection ===
  document.querySelectorAll('.model-card').forEach(function(card) {
    if (card.onclick) return;
    card.addEventListener('click', function() {
      document.querySelectorAll('.model-card').forEach(function(c) {
        c.classList.remove('selected');
        const info = c.querySelector('div:last-child');
        if (info && !c.classList.contains('selected')) {
          info.style.color = 'var(--color-muted-text)';
          info.textContent = '点击切换';
        }
      });
      card.classList.add('selected');
      const info = card.querySelector('div:last-child');
      if (info) {
        info.style.color = 'var(--color-primary)';
        info.textContent = '✓ 当前使用';
      }
      showToast('🔄 模型已切换');
    });
  });

  // === 13. Toggle switches feedback ===
  document.querySelectorAll('.toggle-switch input').forEach(function(toggle) {
    toggle.addEventListener('change', function() {
      showToast(toggle.checked ? '✅ 已开启' : '⛔ 已关闭');
    });
  });

});
