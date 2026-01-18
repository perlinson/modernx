# modernx-gui

现代化的可视化调试工具，为 ModernX 应用提供实时状态监控和模型编辑功能。

## 🎯 特性

- 📊 **实时状态监控** - 实时查看应用状态变化
- 📝 **模型编辑器** - 在线编辑 State、Effects、Reducers
- 📋 **Logger 集成** - 集中查看应用日志
- 🎨 **现代化 UI** - 渐变背景、毛玻璃效果、响应式设计
- 🔄 **实时同步** - WebSocket 实时数据同步
- 📤 **动作历史** - 完整的 action 记录和时间轴

## 🚀 快速开始

### 安装
```bash
npm install modernx-gui
```

### 启动 GUI
```bash
# 在项目目录中启动
npx modernx-gui

# 或指定端口
npx modernx-gui --port 3001
```

### 在应用中集成
```javascript
// 在你的 ModernX 应用中
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  // 发送初始状态
  ws.send(JSON.stringify({
    type: 'state',
    payload: store.getState()
  }));
  
  // 发送模型信息
  ws.send(JSON.stringify({
    type: 'models',
    payload: models
  }));
});

// 发送日志
function sendLog(level, message, data) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({
      type: 'logger',
      level,
      message,
      data
    }));
  }
}
```

## 📊 功能详解

### 仪表板
- 📈 实时统计数据（动作数、模型数、连接时长、状态变化）
- 🎯 状态概览
- 📊 性能监控

### 状态监控
- 🌳 完整状态树显示
- 🔄 实时状态更新
- 📝 JSON 格式化
- 📋 状态复制功能

### 动作历史
- 📅 完整的 action 记录
- ⏰ 时间戳显示
- 📦 Payload 详细信息
- 🔍 搜索和过滤

### 模型详情
- 📦 每个模型的完整状态
- 🔍 状态计数显示
- 📋 复制状态功能
- 🎯 模型高亮

### Logger 日志
- 📝 实时日志流
- 🎨 颜色编码的日志级别
- 📤 日志导出功能
- 🗑️ 日志清空功能
- 📜 自动滚动

### 模型编辑器
- **State 编辑**: JSON 格式，实时验证
- **Effects 编辑**: JavaScript 代码编辑器
- **Reducers 编辑**: JavaScript 代码编辑器
- 💾 实时保存和重置
- 🔄 模型热更新

## 🎨 UI 特性

- 🌈 **渐变背景** - 紫色到蓝色的现代渐变
- 🔮 **毛玻璃效果** - 半透明背景和模糊效果
- 📱 **响应式设计** - 适配不同屏幕尺寸
- ✨ **动画过渡** - 平滑的悬停和切换动画
- 🎯 **图标系统** - Font Awesome 图标

## 🔧 技术实现

### WebSocket 通信
```javascript
// GUI 端
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'state':
      this.renderState(data.payload);
      break;
    case 'action':
      this.renderAction(data.payload);
      break;
    case 'logger':
      this.renderLog(data);
      break;
  }
};
```

### 模型编辑
```javascript
// 保存模型
saveModel() {
  const newState = JSON.parse(document.getElementById('state-editor').value);
  
  this.ws.send(JSON.stringify({
    type: 'save-model',
    payload: {
      namespace: this.currentEditingModel.namespace,
      state: newState,
      effects: document.getElementById('effects-editor').value,
      reducers: document.getElementById('reducers-editor').value
    }
  }));
}
```

### Logger 集成
```javascript
// 应用端
function sendLog(level, message, data = null) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({
      type: 'logger',
      level,
      message,
      data
    }));
  }
}
```

## 📋 使用场景

1. **开发调试** - 实时查看状态变化和动作执行
2. **性能分析** - 监控应用性能和瓶颈
3. **模型设计** - 可视化设计和编辑模型
4. **日志分析** - 集中查看和分析应用日志
5. **团队协作** - 共享状态和调试信息
6. **教学演示** - 展示 ModernX 的工作原理

## 🎯 最佳实践

### 1. 日志分级
```javascript
// 使用不同级别的日志
sendLog('info', '用户登录成功', { userId: 123 });
sendLog('warn', 'API 响应缓慢', { duration: 2000 });
sendLog('error', '网络请求失败', { error: 'timeout' });
```

### 2. 模型编辑
```javascript
// 在 GUI 中编辑模型后，应用会收到 save-model 事件
case 'save-model':
  handleSaveModel(action.payload);
  break;
```

### 3. 性能监控
```javascript
// 监控状态变化
const prevState = JSON.stringify(this.currentState);
this.currentState = data.payload;
if (prevState !== newState) {
  this.stats.stateChanges++;
}
```

## 🚀 版本历史

- **v1.3.0** - 添加 Logger 集成和模型编辑器
- **v1.2.0** - 现代化 UI 设计
- **v1.1.5** - 修复路径问题
- **v1.1.0** - 添加完整 HTML 界面
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](/USAGE.md)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**🎨 让 ModernX 开发更加可视化！**
