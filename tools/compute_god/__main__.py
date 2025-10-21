"""CLI entry point for the Compute-God Standard Model validator."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict

from .registry import Registry
from .validator import Validator


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate Standard Model data against the Compute-God ruleset",
    )
    parser.add_argument(
        "registry",
        nargs="?",
        default=Path("formal/compute_god_standard_model.json"),
        type=Path,
        help="Path to the registry JSON file",
    )
    parser.add_argument(
        "--json",
        dest="as_json",
        action="store_true",
        help="Emit the validation report as JSON",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        registry = Registry.from_path(args.registry)
    except FileNotFoundError as error:
        parser.error(str(error))
        return 2
    validator = Validator(registry)
    report = validator.run()

    if args.as_json:
        payload: Dict[str, Any] = {
            "source": str(registry.source),
            "passed": report.passed,
            "sections": [
                {
                    "name": section.name,
                    "passed": section.passed,
                    "messages": section.messages,
                }
                for section in report.sections
            ],
        }
        json.dump(payload, sys.stdout, indent=2, ensure_ascii=False)
        sys.stdout.write("\n")
    else:
        print(report.summary())

    return 0 if report.passed else 1


if __name__ == "__main__":  # pragma: no cover - CLI entry
    raise SystemExit(main())
