# Clear Mozi Login Cookies - Chrome Extension

一个用于清除 `mozi-login.alibaba.net` 域名下所有 Cookie 的 Chrome 扩展程序。

## 功能特性

- 清除指定域名下的所有 Cookie
- 友好的弹出界面
- 实时状态反馈
- 检查当前 Cookie 数量

## 安装步骤

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 打开右上角的"开发者模式"开关
3. 点击"加载已解压的扩展程序"
4. 选择此项目文件夹
5. 扩展程序安装完成

## 使用方法

1. 点击浏览器工具栏中的扩展程序图标
2. 在弹出窗口中点击"Clear Cookies"按钮
3. 查看状态信息确认操作结果

## 故障排除

### 插件无效的可能原因：

1. **权限不足**：确保 manifest.json 中包含了正确的权限
2. **域名匹配问题**：Cookie 的域名可能包含子域名或路径
3. **HTTPS/HTTP 协议问题**：确保使用正确的协议
4. **Cookie 属性限制**：某些 Cookie 可能有 HttpOnly 或 Secure 标志

### 调试方法：

1. 打开 Chrome 开发者工具 (F12)
2. 切换到 Console 标签页
3. 查看是否有错误信息
4. 检查 Network 标签页的 Cookie 信息

### 检查步骤：

1. 使用插件的"Check Cookies"功能查看当前 Cookie
2. 检查浏览器控制台的日志输出
3. 确认在目标网站上使用插件
4. 验证扩展程序权限设置

## 文件结构

```
chrome-extension/
├── manifest.json       # 扩展程序配置
├── background.js       # 后台服务工作者
├── popup.html         # 弹出窗口界面
├── popup.js           # 弹出窗口逻辑
├── icons/             # 图标文件
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # 说明文档
```

## 注意事项

- 此扩展程序需要 Cookie 和存储权限
- 仅在有 Cookie 存在时才会显示清除结果
- 建议在目标网站页面上使用以获得最佳效果