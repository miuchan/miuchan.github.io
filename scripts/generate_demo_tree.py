#!/usr/bin/env python3
"""Generate a JSON tree of available demos under public/demo."""
from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DEMO_ROOT = REPO_ROOT / 'public' / 'demo'


def prettify(name: str) -> str:
    tokens = name.replace('-', ' ').replace('_', ' ').split()
    if not tokens:
        return name
    pretty_tokens = []
    for token in tokens:
        if not token:
            continue
        if token.isdigit():
            pretty_tokens.append(token)
            continue
        if len(token) <= 3:
            pretty_tokens.append(token.upper())
            continue
        pretty_tokens.append(token[0].upper() + token[1:])
    return ' '.join(pretty_tokens) or name


def build_tree(directory: Path) -> dict | None:
    children = []
    for child in sorted(directory.iterdir(), key=lambda p: p.name.lower()):
        if child.name.startswith('.'):
            continue
        if child.is_dir():
            child_node = build_tree(child)
            if child_node and (child_node['path'] or child_node['children']):
                children.append(child_node)

    index = directory / 'index.html'
    path = str(index.relative_to(DEMO_ROOT)) if index.exists() else None

    if not path and not children:
        return None

    return {
        'name': directory.name,
        'label': prettify(directory.name),
        'path': path,
        'children': children
    }


def main() -> None:
    if not DEMO_ROOT.exists():
        raise SystemExit(f'Demo root not found: {DEMO_ROOT}')

    tree = []
    for entry in sorted(DEMO_ROOT.iterdir(), key=lambda p: p.name.lower()):
        if entry.name.startswith('.') or not entry.is_dir():
            continue
        node = build_tree(entry)
        if node:
            tree.append(node)

    output_path = DEMO_ROOT / 'demo-tree.json'
    output_path.write_text(json.dumps(tree, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Wrote {output_path.relative_to(REPO_ROOT)}')


if __name__ == '__main__':
    main()
