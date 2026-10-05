// ===== Data Store: 30 days, 10000+ health records =====
// Stored in localStorage for persistence

const DataStore = {
  KEY: 'health_data_v2',
  USERS_KEY: 'admin_users_v2',
  LOGS_KEY: 'admin_logs_v2',

  // ===== Generate 10000+ records =====
  generate() {
    const records = [];
    const categories = ['体征', '运动', '饮食', '睡眠'];
    const now = Date.now();
    const dayMs = 86400000;

    // Sign types per category
    const signTypes = [
      { name: '心率', unit: 'bpm', min: 60, max: 100, icon: '❤️' },
      { name: '收缩压', unit: 'mmHg', min: 90, max: 140, icon: '🩸' },
      { name: '舒张压', unit: 'mmHg', min: 60, max: 95, icon: '🩸' },
      { name: '血氧', unit: '%', min: 95, max: 100, icon: '' },
      { name: '体温', unit: '°C', min: 36.0, max: 37.5, icon: '🌡️' },
      { name: '体重', unit: 'kg', min: 67, max: 73, icon: '⚖️' },
    ];
    const exerciseTypes = [
      { name: '晨跑', unit: 'km', min: 2, max: 8 },
      { name: '快走', unit: '分钟', min: 15, max: 60 },
      { name: '游泳', unit: '分钟', min: 20, max: 45 },
      { name: '骑行', unit: 'km', min: 5, max: 20 },
      { name: '瑜伽', unit: '分钟', min: 20, max: 60 },
      { name: '力量训练', unit: '分钟', min: 15, max: 45 },
      { name: '篮球', unit: '分钟', min: 30, max: 90 },
    ];
    const dietTypes = [
      { name: '早餐', unit: '千卡', min: 300, max: 600 },
      { name: '午餐', unit: '千卡', min: 500, max: 900 },
      { name: '晚餐', unit: '千卡', min: 400, max: 700 },
      { name: '加餐', unit: '千卡', min: 100, max: 300 },
      { name: '饮水量', unit: 'ml', min: 200, max: 500 },
    ];
    const sleepTypes = [
      { name: '入睡时间', unit: '', min: 0, max: 0 },
      { name: '起床时间', unit: '', min: 0, max: 0 },
      { name: '深睡时长', unit: '小时', min: 1, max: 3 },
      { name: 'REM时长', unit: '小时', min: 1, max: 2.5 },
      { name: '睡眠评分', unit: '分', min: 60, max: 98 },
    ];

    function rand(min, max) {
      if (min === 0 && max === 0) return 0;
      return +(min + Math.random() * (max - min)).toFixed(1);
    }
    function randInt(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }

    // Generate 30 days × ~350 records/day ≈ 10500 records
    for (let d = 29; d >= 0; d--) {
      const dayStart = now - d * dayMs;
      const dateStr = new Date(dayStart).toISOString().split('T')[0];

      // Signs: 6 types × 3-5 readings/day = ~20/day
      signTypes.forEach(t => {
        const count = randInt(3, 5);
        for (let i = 0; i < count; i++) {
          const h = randInt(6, 22);
          const m = randInt(0, 59);
          records.push({
            id: records.length + 1,
            date: dateStr,
            time: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
            timestamp: dayStart + h * 3600000 + m * 60000,
            category: '体征',
            type: t.name,
            value: rand(t.min, t.max),
            unit: t.unit,
            icon: t.icon,
            device: t.name === '心率' || t.name === '血氧' ? '智能手表' : t.name.includes('压') ? '智能血压计' : '智能体脂秤',
            status: t.name === '收缩压' && rand(t.min, t.max) > 130 ? 'warning' : 'normal'
          });
        }
      });

      // Exercise: 2-4/day
      exerciseTypes.forEach(t => {
        if (Math.random() > 0.5) {
          const h = randInt(6, 20);
          records.push({
            id: records.length + 1,
            date: dateStr,
            time: `${String(h).padStart(2,'0')}:${String(randInt(0,59)).padStart(2,'0')}`,
            timestamp: dayStart + h * 3600000,
            category: '运动',
            type: t.name,
            value: rand(t.min, t.max),
            unit: t.unit,
            icon: '',
            device: '智能手表',
            status: 'normal',
            calories: randInt(100, 500)
          });
        }
      });

      // Diet: 4-6/day
      dietTypes.forEach(t => {
        const h = t.name === '早餐' ? randInt(7,9) : t.name === '午餐' ? randInt(11,13) : t.name === '晚餐' ? randInt(18,20) : randInt(9,21);
        records.push({
          id: records.length + 1,
          date: dateStr,
          time: `${String(h).padStart(2,'0')}:${String(randInt(0,59)).padStart(2,'0')}`,
          timestamp: dayStart + h * 3600000,
          category: '饮食',
          type: t.name,
          value: randInt(t.min, t.max),
          unit: t.unit,
          icon: '️',
          device: '手动录入',
          status: 'normal'
        });
      });

      // Sleep: 4-5/day
      sleepTypes.forEach(t => {
        let val;
        if (t.name === '入睡时间') val = `${randInt(22,23)}:${String(randInt(0,59)).padStart(2,'0')}`;
        else if (t.name === '起床时间') val = `${randInt(6,8)}:${String(randInt(0,59)).padStart(2,'0')}`;
        else val = rand(t.min, t.max);
        records.push({
          id: records.length + 1,
          date: dateStr,
          time: t.name.includes('时间') ? val : '07:00',
          timestamp: dayStart + 7 * 3600000,
          category: '睡眠',
          type: t.name,
          value: val,
          unit: t.unit,
          icon: '😴',
          device: '智能手表',
          status: t.name === '睡眠评分' && val < 70 ? 'warning' : 'normal'
        });
      });
    }
    return records;
  },

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    const records = this.generate();
    this.save(records);
    return records;
  },

  save(records) {
    localStorage.setItem(this.KEY, JSON.stringify(records));
  },

  // Filter by category
  filterByCategory(cat) {
    const all = this.load();
    return cat === '全部' ? all : all.filter(r => r.category === cat);
  },

  // Filter by date
  filterByDate(date) {
    return this.load().filter(r => r.date === date);
  },

  // Add record
  addRecord(record) {
    const all = this.load();
    record.id = all.length + 1;
    record.timestamp = Date.now();
    all.unshift(record);
    this.save(all);
    return record;
  },

  // Get stats
  getStats() {
    const all = this.load();
    return {
      total: all.length,
      days: [...new Set(all.map(r => r.date))].length,
      today: all.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
      byCategory: {
        '体征': all.filter(r => r.category === '体征').length,
        '运动': all.filter(r => r.category === '运动').length,
        '饮食': all.filter(r => r.category === '饮食').length,
        '睡眠': all.filter(r => r.category === '睡眠').length,
      }
    };
  },

  // ===== Admin Users =====
  loadUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    const users = this.generateUsers();
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return users;
  },

  generateUsers() {
    const names = ['张明', '李芳', '王强', '赵丽', '刘伟', '陈静', '杨帆', '黄磊', '周婷', '吴刚'];
    const phones = ['138****1234','139****5678','137****9012','136****3456','135****7890','133****2345','131****6789','130****0123','158****4567','159****8901'];
    return names.map((name, i) => ({
      id: i + 1,
      name,
      phone: phones[i],
      age: randInt(25, 65),
      gender: i % 2 === 0 ? '男' : '女',
      score: randInt(60, 95),
      vip: i < 3,
      status: i < 8 ? 'active' : 'banned',
      joined: `2026-${String(randInt(1,9)).padStart(2,'0')}-${String(randInt(1,28)).padStart(2,'0')}`,
      records: randInt(50, 500)
    }));
  },

  // ===== Admin Logs =====
  loadLogs() {
    try {
      const data = localStorage.getItem(this.LOGS_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    const logs = this.generateLogs();
    localStorage.setItem(this.LOGS_KEY, JSON.stringify(logs));
    return logs;
  },

  generateLogs() {
    const funcs = ['健康分析','健康问答','体检解读','月度总结','异常预警','智能计划','数据录入','报告生成'];
    const models = ['deepseek-chat','deepseek-reasoner'];
    const users = ['张明','李芳','王强','赵丽','刘伟','陈静','杨帆','黄磊','周婷','吴刚'];
    const logs = [];
    const now = Date.now();
    for (let i = 0; i < 50; i++) {
      const t = now - i * randInt(600000, 3600000);
      logs.push({
        id: i + 1,
        time: new Date(t).toLocaleString('zh-CN'),
        user: users[randInt(0, 9)],
        func: funcs[randInt(0, 7)],
        model: models[randInt(0, 1)],
        tokens: randInt(200, 3000),
        cost: +(randInt(1, 50) / 10).toFixed(2),
        duration: randInt(1, 15) + '.' + randInt(10, 99) + 's',
        status: Math.random() > 0.05 ? 'success' : 'error'
      });
    }
    return logs;
  },

  // ===== API Key persistence =====
  getApiKey() {
    return localStorage.getItem('deepseek_api_key') || '';
  },
  setApiKey(key) {
    localStorage.setItem('deepseek_api_key', key);
  }
};
