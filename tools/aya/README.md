# Aya Engine

`tools/aya/` 目录包含一个纯 Python 实现的 Aya Engine：

- `engine.py`：核心解析与结构校验逻辑。
- `__main__.py`：命令行入口，可通过 `python -m tools.aya` 调用。
- `aya`：兼容旧工作流的可执行包装脚本。

该实现会对 `.aya` 文件执行基础语法与缩进检查，保证仓库中的形式化资产在
本地开发与 CI 环境均可快速验证，无需下载 Java JAR 文件。
