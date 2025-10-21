"""Registry loader for the Compute-God Standard Model validator."""
from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
from typing import Any, Iterable, Mapping


@dataclass(frozen=True)
class Registry:
    """In-memory representation of the Standard Model registry."""

    source: Path
    data: Mapping[str, Any]

    @classmethod
    def from_path(cls, path: Path | str) -> "Registry":
        file_path = Path(path)
        if not file_path.exists():
            raise FileNotFoundError(f"Registry file not found: {file_path}")
        with file_path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        return cls(source=file_path, data=data)

    def particles(self) -> Iterable[Mapping[str, Any]]:
        return self._iter_collection("particles")

    def interactions(self) -> Iterable[Mapping[str, Any]]:
        return self._iter_collection("interactions")

    def constraints(self) -> Iterable[Mapping[str, Any]]:
        return self._iter_collection("constraints")

    def derived_states(self) -> Mapping[str, Any]:
        derived = self.data.get("derived_states", {})
        if not isinstance(derived, dict):
            raise TypeError("derived_states must be a mapping when present")
        return derived

    def _iter_collection(self, key: str) -> Iterable[Mapping[str, Any]]:
        collection = self.data.get(key, [])
        if not isinstance(collection, list):
            raise TypeError(f"{key} must be a list of mappings")
        for item in collection:
            if not isinstance(item, dict):
                raise TypeError(f"{key} entries must be objects; received {type(item)!r}")
            yield item
