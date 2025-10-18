# Aya Engine

`tools/aya/` 目录包含一个纯 Python 实现的 Aya Engine，同时也作为 [PyPI](https://pypi.org/project/aya-engine/) 上发布的 `aya-engine` 包源码：

- `engine.py`：核心解析与结构校验逻辑。
- `__main__.py`：命令行入口，可通过 `python -m tools.aya` 或安装后的 `aya` 命令调用。
- `aya`：兼容旧工作流的可执行包装脚本。
- `__about__.py`：对外暴露的版本信息。

通过 `pip install aya-engine` 安装后，即可使用 `aya compile path/to/file.aya` 验证 Aya 源码。仓库中的脚本与 CI 会直接复用同一实现，保证本地开发与持续集成行为一致。
