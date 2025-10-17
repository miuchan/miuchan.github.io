"""Command line interface for the Aya engine."""
from __future__ import annotations

import argparse
from pathlib import Path
import sys
from typing import Iterable, Sequence

from .engine import AyaCompilationError, AyaEngine, CompilationResult


def _compile(engine: AyaEngine, paths: Sequence[Path]) -> int:
    exit_code = 0
    for path in paths:
        try:
            result = engine.compile(path)
        except AyaCompilationError as error:
            print(error, file=sys.stderr)
            exit_code = 1
            continue
        else:
            _print_success(result)
    return exit_code


def _print_success(result: CompilationResult) -> None:
    try:
        relative_path = result.path.relative_to(Path.cwd()).as_posix()
    except ValueError:
        relative_path = result.path.as_posix()
    imports = ", ".join(result.imports) if result.imports else "(none)"
    defs = ", ".join(result.definitions)
    print(f"[OK] {relative_path} -> module {result.module}")
    print(f"      imports: {imports}")
    print(f"      definitions: {defs}")


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="aya", description="Aya engine CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    compile_parser = subparsers.add_parser(
        "compile", help="Validate Aya source files"
    )
    compile_parser.add_argument(
        "paths",
        nargs="+",
        type=Path,
        help="Paths to Aya source files",
    )

    args = parser.parse_args(list(argv) if argv is not None else None)
    engine = AyaEngine()

    if args.command == "compile":  # pragma: no branch - exhaustive by design
        return _compile(engine, args.paths)

    return 1


if __name__ == "__main__":  # pragma: no cover - convenience execution
    raise SystemExit(main())
