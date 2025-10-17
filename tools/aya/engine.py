"""Lightweight Aya engine for structural validation of Aya source files."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
from typing import Iterable, List, Optional, Sequence, Tuple


@dataclass(frozen=True)
class CompilationResult:
    """Structured information produced by compiling a single Aya file."""

    path: Path
    module: str
    imports: Sequence[str]
    definitions: Sequence[str]


class AyaCompilationError(RuntimeError):
    """Raised when Aya source code fails structural validation."""

    def __init__(self, path: Path, line: int, message: str) -> None:
        self.path = path
        self.line = line
        self.message = message
        super().__init__(f"{path}:{line}: {message}")


class AyaEngine:
    """A tiny Aya checker used for local development and CI."""

    MODULE_PATTERN = re.compile(r"^module\s+([A-Za-z][A-Za-z0-9_.]*)$")
    IMPORT_PATTERN = re.compile(r"^open\s+import\s+([A-Za-z][A-Za-z0-9_.]*)$")
    DEF_PATTERN = re.compile(
        r"^def\s+([A-Za-z][A-Za-z0-9_-]*)\s*(\([^)]*\))?\s*:\s*(.+?)\s*=>\s*$"
    )

    def compile(self, path: Path | str) -> CompilationResult:
        """Validate a single Aya file and return a summary of its structure."""

        file_path = Path(path)
        if not file_path.exists():
            raise AyaCompilationError(file_path, 0, "File does not exist")
        if file_path.suffix != ".aya":
            raise AyaCompilationError(file_path, 0, "Expected a .aya source file")

        lines = file_path.read_text(encoding="utf-8").splitlines()
        if not lines:
            raise AyaCompilationError(file_path, 1, "File is empty")

        self._validate_symbols(lines, file_path)

        module_name: Optional[str] = None
        imports: List[str] = []
        definitions: List[str] = []
        current_def_indent: Optional[int] = None

        for idx, raw_line in enumerate(lines, start=1):
            if "\t" in raw_line:
                raise AyaCompilationError(
                    file_path, idx, "Tabs are not allowed; use spaces for indentation"
                )

            stripped = raw_line.strip()
            if not stripped or stripped.startswith("//"):
                continue

            indent = len(raw_line) - len(raw_line.lstrip(" "))
            if indent % 2 != 0:
                raise AyaCompilationError(
                    file_path, idx, "Indentation must use multiples of two spaces"
                )

            if current_def_indent is not None and indent <= current_def_indent:
                current_def_indent = None

            if current_def_indent is not None:
                # Inside a definition body.
                if indent <= current_def_indent:
                    raise AyaCompilationError(
                        file_path, idx, "Definition body must be indented"
                    )
                continue

            if module_name is None:
                module_name = self._parse_module(file_path, idx, stripped)
                continue

            if stripped.startswith("open import "):
                if indent != 0:
                    raise AyaCompilationError(
                        file_path, idx, "Imports must not be indented"
                    )
                import_name = self._parse_import(file_path, idx, stripped)
                if import_name in imports:
                    raise AyaCompilationError(
                        file_path, idx, f"Duplicate import '{import_name}'"
                    )
                imports.append(import_name)
                continue

            if stripped.startswith("def "):
                if indent != 0:
                    raise AyaCompilationError(
                        file_path, idx, "Definitions must start at the first column"
                    )
                def_name = self._parse_definition(file_path, idx, stripped)
                if def_name in definitions:
                    raise AyaCompilationError(
                        file_path, idx, f"Duplicate definition '{def_name}'"
                    )
                definitions.append(def_name)
                current_def_indent = indent
                continue

            raise AyaCompilationError(
                file_path,
                idx,
                "Unrecognised statement. Expected an import or a definition",
            )

        if module_name is None:
            raise AyaCompilationError(file_path, 1, "Missing module declaration")
        if not definitions:
            raise AyaCompilationError(
                file_path, len(lines), "Module must contain at least one definition"
            )

        return CompilationResult(
            path=file_path,
            module=module_name,
            imports=tuple(imports),
            definitions=tuple(definitions),
        )

    def _parse_module(self, path: Path, line_no: int, statement: str) -> str:
        match = self.MODULE_PATTERN.match(statement)
        if not match:
            raise AyaCompilationError(path, line_no, "Invalid module declaration")
        return match.group(1)

    def _parse_import(self, path: Path, line_no: int, statement: str) -> str:
        match = self.IMPORT_PATTERN.match(statement)
        if not match:
            raise AyaCompilationError(path, line_no, "Invalid import statement")
        return match.group(1)

    def _parse_definition(self, path: Path, line_no: int, statement: str) -> str:
        match = self.DEF_PATTERN.match(statement)
        if not match:
            raise AyaCompilationError(path, line_no, "Invalid definition header")
        return match.group(1)

    def _validate_symbols(self, lines: Iterable[str], path: Path) -> None:
        """Ensure parentheses, brackets and braces are balanced."""

        pairs = {"(": ")", "[": "]", "{": "}"}
        closing = {closing: opening for opening, closing in pairs.items()}
        stack: List[Tuple[str, int, int]] = []

        for line_no, raw_line in enumerate(lines, start=1):
            # Strip comments to avoid counting pairs inside them.
            code = raw_line.split("//", 1)[0]
            idx = 0
            while idx < len(code):
                ch = code[idx]
                if ch == "\\":
                    # Skip escaped characters (used for lambdas like \x).
                    idx += 2
                    continue
                if ch in pairs:
                    stack.append((ch, line_no, idx + 1))
                elif ch in closing:
                    if not stack or stack[-1][0] != closing[ch]:
                        raise AyaCompilationError(
                            path,
                            line_no,
                            f"Unmatched closing '{ch}'",
                        )
                    stack.pop()
                idx += 1

        if stack:
            opener, line_no, column = stack[-1]
            raise AyaCompilationError(
                path,
                line_no,
                f"Unclosed symbol '{opener}' at column {column}",
            )
