# AI Chat - DeepSeek API 聊天界面

一个基于 DeepSeek API 的现代化聊天界面，支持 DeepSeek-V3 和 DeepSeek-R1 模型。

## 功能特点

- 🎯 支持 DeepSeek-V3 和 DeepSeek-R1 模型
- 💬 流式输出响应
- 📝 Markdown 格式支持
- 📚 聊天历史记录管理
- 🌓 深色模式支持
- 💅 现代化 UI 设计

## 技术栈

- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- DeepSeek API

## 本地开发

1. 克隆项目

```bash
git clone https://github.com/yangjin15/ai-chat
cd ai-chat
```

2. 安装依赖

```bash
npm install
```

3. 创建环境变量文件

创建 `.env.local` 文件并添加你的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=your-api-key
```

4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 部署

项目可以部署到任何支持 Next.js 的平台，如 Vercel：

```bash
npm run build
npm start
```
