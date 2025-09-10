# Chrome 扩展程序调试指南

## 问题诊断步骤

### 1. 检查扩展程序是否正确安装
1. 访问 `chrome://extensions/`
2. 确认扩展程序已启用
3. 检查是否有错误提示

### 2. 查看后台脚本日志
1. 在扩展程序页面，点击"检查视图" → "服务工作进程"
2. 查看控制台输出
3. 点击扩展程序图标触发操作，观察日志

### 3. 检查权限设置
```javascript
// 在控制台中运行以下代码检查权限
chrome.permissions.getAll((permissions) => {
  console.log('Current permissions:', permissions);
});
```

### 4. 手动检查 Cookie
```javascript
// 在控制台中运行以检查 Cookie
chrome.cookies.getAll({domain: "mozi-login.alibaba.net"}, (cookies) => {
  console.log('Cookies found:', cookies);
});
```

### 5. 测试不同的域名格式
```javascript
// 测试各种域名格式
const testDomains = [
  "mozi-login.alibaba.net",
  ".mozi-login.alibaba.net", 
  "https://mozi-login.alibaba.net"
];

testDomains.forEach(domain => {
  chrome.cookies.getAll({domain: domain}, (cookies) => {
    console.log(`Domain ${domain}:`, cookies.length, 'cookies');
  });
});
```

## 常见问题及解决方案

### 问题1: 扩展程序图标变灰
**原因**: 权限不足或清单文件错误
**解决**: 检查 manifest.json 中的 permissions 和 host_permissions

### 问题2: 点击后无反应
**原因**: JavaScript 错误或消息传递失败
**解决**: 查看后台脚本和弹出窗口的控制台日志

### 问题3: Cookie 清除不完整
**原因**: 域名匹配不准确或 Cookie 属性限制
**解决**: 使用多种方式获取 Cookie，检查 HttpOnly 和 Secure 标志

### 问题4: 在某些页面无效
**原因**: 内容安全策略(CSP)限制
**解决**: 确保使用后台脚本而非内容脚本执行 Cookie 操作

## 高级调试技巧

### 1. 启用详细日志
在 background.js 开头添加：
```javascript
console.log('Background script loaded at:', new Date().toISOString());
```

### 2. 监控 Cookie 变化
```javascript
chrome.cookies.onChanged.addListener((changeInfo) => {
  console.log('Cookie changed:', changeInfo);
});
```

### 3. 检查网络请求
在开发者工具的 Network 标签页中查看 Cookie 相关的请求头

### 4. 使用 Chrome 扩展程序开发者工具
安装 "Extension Reloader" 等开发工具来快速重载扩展程序

## 测试清单

- [ ] 扩展程序正确安装并启用
- [ ] 权限设置正确
- [ ] 后台脚本无错误
- [ ] 弹出窗口正常显示
- [ ] Cookie 检查功能工作正常
- [ ] Cookie 清除功能工作正常
- [ ] 在不同网站上测试
- [ ] 检查控制台无错误信息