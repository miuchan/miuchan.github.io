# Experience Systems Atlas

miuchan.github.io 现已重构为零依赖的静态站点，使用原生 HTML、CSS 与 JavaScript
展示整个代码库的结构、知识资产与交互 Demo。仓库持续托管全部历史资源，包括研究文档、交互原型、博客长文与履历材料。

## 快速预览

- `index.html`：站点入口，聚合仓库概览、知识流、资源索引与协作工具。
- `assets/css/styles.css`：设计系统与响应式布局定义，确保高对比度与可访问性。
- `assets/js/main.js`：以数据驱动方式渲染全部卡片、过滤器与表达式解释器。
- `docs/`：可引用的研究文稿，目前包含《计算奇点 470 年上界证明》。
- `public/demo/`：20 个跨学科交互 Demo，覆盖 CPU 架构、可视化、组织运营等主题。
- `public/blog/`：59 篇 HTML 长文与档案索引，保留历史主题与专题样式。
- `public/resume/`：在线履历及配套静态资源，支持合作前的角色匹配与沟通。

## 本地预览

由于站点完全静态，可直接在浏览器打开 `index.html`，或使用任意 HTTP
服务器（如 `python -m http.server`）托管根目录以验证相对路径。

## Aya 形式化验证工具链

仓库内自带纯 Python 实现的 Aya Engine，用于对 `.aya` 文件执行结构校验：

1. 确保系统提供 Python 3.10+。
2. 执行 `scripts/run_aya.sh` 自动发现并编译 `formal/` 目录下的全部 `.aya` 文件。
3. 或直接运行 `python3 -m tools.aya compile formal/HelloAya.aya` 验证单个文件。

GitHub Actions 工作流会在推送和 Pull Request 时自动安装 Python 3.11 并调用同一脚本，
使用内置的 Aya Engine 校验形式化资产，确保持续集成流程稳定。

## 维护指南

1. **新增资源**：更新 `assets/js/main.js` 中的 `artifactEntries` 列表，确保搜索索引与过滤器同步。
2. **研究文稿**：将 Markdown 或 HTML 文档置于 `docs/` 或 `public/blog/`，并在附录或档案索引中登记。
3. **样式扩展**：复用 `styles.css` 中的色彩、阴影与圆角变量，保持体验一致。
4. **历史兼容**：`public/` 下的路径保持不变，以保证既有外部链接可用。

## 许可证

本仓库以 MIT 许可发布。欢迎 fork、复用或将内容嵌入共创项目。
