"""Validation routines for the Compute-God Standard Model tool."""
from __future__ import annotations

from dataclasses import dataclass, field
from math import isclose
from typing import Any, Dict, List, Mapping, Sequence, Tuple

from .registry import Registry


@dataclass
class SectionReport:
    """Outcome for a single validation section."""

    name: str
    passed: bool
    messages: List[str] = field(default_factory=list)


@dataclass
class ValidationReport:
    """Aggregated report produced by the validator."""

    sections: List[SectionReport]

    @property
    def passed(self) -> bool:
        return all(section.passed for section in self.sections)

    def summary(self) -> str:
        lines = ["Compute-God Standard Model validation report"]
        for section in self.sections:
            status = "PASS" if section.passed else "FAIL"
            lines.append(f"- {section.name}: {status}")
            for message in section.messages:
                lines.append(f"    • {message}")
        lines.append(
            "Overall status: PASS" if self.passed else "Overall status: FAIL"
        )
        return "\n".join(lines)


class Validator:
    """Engine that performs all structural checks for the registry."""

    REQUIRED_FIELDS = {
        "name",
        "sector",
        "statistics",
        "chirality",
        "multiplet",
        "representations",
        "t3",
        "hypercharge",
        "charge",
        "baryon_number",
        "lepton_number",
        "mass_range",
        "spin",
    }

    REPRESENTATION_DIMENSIONS = {
        "su2": {
            "singlet": 1,
            "doublet": 2,
            "triplet": 3,
        },
        "su3": {
            "singlet": 1,
            "fundamental": 3,
            "antifundamental": 3,
            "adjoint": 8,
        },
    }

    REPRESENTATION_DYNKIN = {
        "su2": {
            "singlet": 0.0,
            "doublet": 0.5,
            "triplet": 2.0,
        },
        "su3": {
            "singlet": 0.0,
            "fundamental": 0.5,
            "antifundamental": 0.5,
            "adjoint": 3.0,
        },
    }

    def __init__(self, registry: Registry) -> None:
        self.registry = registry
        self._particle_index: Dict[str, Mapping[str, Any]] = {
            particle["name"]: particle for particle in registry.particles()
        }
        self._derived_states = registry.derived_states()

    def run(self) -> ValidationReport:
        sections = [
            self._validate_particle_fields(),
            self._validate_multiplet_consistency(),
            self._validate_charge_relation(),
            self._validate_mass_ranges(),
            self._validate_interactions(),
            self._validate_anomalies(),
            self._validate_constraints(),
        ]
        return ValidationReport(sections=sections)

    # ------------------------------------------------------------------
    # Particle validations
    # ------------------------------------------------------------------

    def _validate_particle_fields(self) -> SectionReport:
        messages: List[str] = []
        missing_count = 0
        for particle in self.registry.particles():
            missing = self.REQUIRED_FIELDS - particle.keys()
            if missing:
                missing_count += 1
                messages.append(
                    f"{particle.get('name', '<unnamed>')}: missing fields {sorted(missing)}"
                )
            representations = particle.get("representations", {})
            if not isinstance(representations, Mapping):
                missing_count += 1
                messages.append(
                    f"{particle.get('name', '<unnamed>')}: representations must be an object"
                )
                representations = {}
            for group, allowed in self.REPRESENTATION_DIMENSIONS.items():
                rep = representations.get(group)
                if rep not in allowed:
                    missing_count += 1
                    messages.append(
                        f"{particle['name']}: invalid {group} representation '{rep}'"
                    )
            mass_range = particle.get("mass_range", {})
            if not isinstance(mass_range, Mapping):
                missing_count += 1
                messages.append(f"{particle['name']}: mass_range must be an object")
            else:
                lower = mass_range.get("lower")
                upper = mass_range.get("upper")
                if lower is None or upper is None:
                    missing_count += 1
                    messages.append(
                        f"{particle['name']}: mass_range requires lower and upper bounds"
                    )
        passed = missing_count == 0
        if passed:
            messages.append("All particles include required metadata and representations")
        return SectionReport("Particle schema", passed, messages)

    def _validate_multiplet_consistency(self) -> SectionReport:
        messages: List[str] = []
        inconsistent = 0
        seen: Dict[Tuple[str, int], Mapping[str, Any]] = {}
        for particle in self.registry.particles():
            key = (particle["multiplet"], particle.get("generation", 0))
            existing = seen.get(key)
            if existing is None:
                seen[key] = particle
                continue
            for attr in ("hypercharge", "representations", "statistics", "chirality"):
                if particle.get(attr) != existing.get(attr):
                    inconsistent += 1
                    messages.append(
                        f"{particle['name']}: multiplet mismatch for attribute '{attr}'"
                    )
        passed = inconsistent == 0
        if passed:
            messages.append("Multiplet assignments are self-consistent across components")
        return SectionReport("Multiplet consistency", passed, messages)

    def _validate_charge_relation(self) -> SectionReport:
        messages: List[str] = []
        failures = 0
        for particle in self.registry.particles():
            if not particle.get("validate_charge_relation", True):
                continue
            t3 = float(particle["t3"])
            hypercharge = float(particle["hypercharge"])
            expected = t3 + hypercharge / 2.0
            if not isclose(expected, float(particle["charge"]), rel_tol=1e-9, abs_tol=1e-9):
                failures += 1
                messages.append(
                    f"{particle['name']}: electric charge {particle['charge']} disagrees with Q=T3+Y/2 ({expected})"
                )
        passed = failures == 0
        if passed:
            messages.append("Electric charges match the electroweak relation Q=T3+Y/2")
        return SectionReport("Charge quantisation", passed, messages)

    def _validate_mass_ranges(self) -> SectionReport:
        messages: List[str] = []
        failures = 0
        for particle in self.registry.particles():
            mass_range = particle.get("mass_range", {})
            lower_raw = mass_range.get("lower")
            upper_raw = mass_range.get("upper")
            if lower_raw is None or upper_raw is None:
                failures += 1
                messages.append(
                    f"{particle['name']}: mass_range must define both lower and upper bounds"
                )
                continue
            try:
                lower = float(lower_raw)
                upper = float(upper_raw)
            except (TypeError, ValueError):
                failures += 1
                messages.append(
                    f"{particle['name']}: mass bounds must be numeric (received {lower_raw!r}, {upper_raw!r})"
                )
                continue
            if lower > upper:
                failures += 1
                messages.append(
                    f"{particle['name']}: mass lower bound {lower} exceeds upper bound {upper}"
                )
            if lower < 0 or upper < 0:
                failures += 1
                messages.append(
                    f"{particle['name']}: mass bounds must be non-negative (received {lower}, {upper})"
                )
        passed = failures == 0
        if passed:
            messages.append("All mass ranges are physically sensible")
        return SectionReport("Mass bounds", passed, messages)

    # ------------------------------------------------------------------
    # Interaction checks
    # ------------------------------------------------------------------

    def _validate_interactions(self) -> SectionReport:
        messages: List[str] = []
        failures = 0
        for interaction in self.registry.interactions():
            incoming = interaction.get("incoming", [])
            outgoing = interaction.get("outgoing", [])
            name = interaction.get("name", "<unnamed interaction>")
            try:
                incoming_profiles = [self._state_profile(label) for label in incoming]
                outgoing_profiles = [self._state_profile(label) for label in outgoing]
            except KeyError as error:
                failures += 1
                messages.append(f"{name}: unknown state referenced: {error}")
                continue

            checks = set(interaction.get("checks", []))
            if "electric_charge" in checks:
                if not self._compare_sum(incoming_profiles, outgoing_profiles, "charge"):
                    failures += 1
                    messages.append(f"{name}: electric charge is not conserved")
            if "baryon_number" in checks:
                if not self._compare_sum(incoming_profiles, outgoing_profiles, "baryon"):
                    failures += 1
                    messages.append(f"{name}: baryon number is not conserved")
            if "lepton_number" in checks:
                if not self._compare_sum(incoming_profiles, outgoing_profiles, "lepton"):
                    failures += 1
                    messages.append(f"{name}: lepton number is not conserved")
            if "color" in checks:
                incoming_color = sum(profile["color_fundamental"] for profile in incoming_profiles)
                outgoing_color = sum(profile["color_fundamental"] for profile in outgoing_profiles)
                if incoming_color != outgoing_color:
                    failures += 1
                    messages.append(
                        f"{name}: color flow mismatch ({incoming_color} fundamentals in vs {outgoing_color} out)"
                    )
        passed = failures == 0
        if passed:
            messages.append("All declared interactions respect the tracked conservation laws")
        return SectionReport("Interactions", passed, messages)

    def _compare_sum(
        self,
        incoming: Sequence[Mapping[str, float]],
        outgoing: Sequence[Mapping[str, float]],
        key: str,
    ) -> bool:
        lhs = sum(profile[key] for profile in incoming)
        rhs = sum(profile[key] for profile in outgoing)
        return isclose(lhs, rhs, rel_tol=1e-9, abs_tol=1e-9)

    def _state_profile(self, label: str) -> Mapping[str, float]:
        if label in self._particle_index:
            particle = self._particle_index[label]
            representations = particle.get("representations", {})
            color_rep = representations.get("su3")
            return {
                "charge": float(particle["charge"]),
                "baryon": float(particle["baryon_number"]),
                "lepton": float(particle["lepton_number"]),
                "color_fundamental": 1
                if color_rep in {"fundamental", "antifundamental"}
                else 0,
            }
        if label in self._derived_states:
            state = self._derived_states[label]
            components = state.get("components", [])
            weights = state.get("weights", [])
            if len(components) != len(weights):
                raise KeyError(f"Derived state '{label}' has inconsistent weights")
            accum = {"charge": 0.0, "baryon": 0.0, "lepton": 0.0, "color_fundamental": 0.0}
            for component, weight in zip(components, weights):
                profile = self._state_profile(component)
                accum = {
                    key: accum[key] + profile[key] * float(weight)
                    for key in accum
                }
            accum["color_fundamental"] = 1.0 if accum["color_fundamental"] > 0 else 0.0
            return accum
        raise KeyError(label)

    # ------------------------------------------------------------------
    # Gauge anomaly checks
    # ------------------------------------------------------------------

    def _validate_anomalies(self) -> SectionReport:
        messages: List[str] = []
        failures = 0
        anomaly_totals: Dict[int, Dict[str, float]] = {}
        multiplets: Dict[Tuple[str, int, str], Mapping[str, Any]] = {}
        for particle in self.registry.particles():
            if particle.get("statistics") != "fermion":
                continue
            key = (particle["multiplet"], int(particle.get("generation", 0)), particle.get("chirality", "left"))
            multiplets.setdefault(key, particle)

        for (multiplet, generation, chirality), particle in multiplets.items():
            entry = anomaly_totals.setdefault(
                generation,
                {"su3": 0.0, "su2": 0.0, "u1": 0.0, "grav": 0.0},
            )
            sign = 1.0 if chirality == "left" else -1.0
            reps = particle.get("representations", {})
            su3_rep = reps.get("su3", "singlet")
            su2_rep = reps.get("su2", "singlet")
            su3_dynkin = self.REPRESENTATION_DYNKIN["su3"].get(su3_rep, 0.0)
            su2_dynkin = self.REPRESENTATION_DYNKIN["su2"].get(su2_rep, 0.0)
            su3_dim = self.REPRESENTATION_DIMENSIONS["su3"].get(su3_rep, 1)
            su2_dim = self.REPRESENTATION_DIMENSIONS["su2"].get(su2_rep, 1)
            hypercharge = float(particle.get("hypercharge", 0.0))

            entry["su3"] += sign * hypercharge * su3_dynkin * su2_dim
            entry["su2"] += sign * hypercharge * su2_dynkin * su3_dim
            entry["u1"] += sign * (hypercharge ** 3) * su3_dim * su2_dim
            entry["grav"] += sign * hypercharge * su3_dim * su2_dim
        tolerance = 1e-9
        for generation, totals in anomaly_totals.items():
            for key, value in totals.items():
                if not isclose(value, 0.0, abs_tol=tolerance):
                    failures += 1
                    messages.append(
                        f"Generation {generation}: anomaly {key} fails with residual {value:.3e}"
                    )
        passed = failures == 0
        if passed:
            messages.append(
                "Gauge and mixed anomalies cancel generation by generation"
            )
        return SectionReport("Anomalies", passed, messages)

    # ------------------------------------------------------------------
    # Experimental constraints
    # ------------------------------------------------------------------

    def _validate_constraints(self) -> SectionReport:
        messages: List[str] = []
        failures = 0
        for constraint in self.registry.constraints():
            name = constraint.get("name", "<unnamed constraint>")
            value = float(constraint.get("value", 0.0))
            prediction = float(constraint.get("prediction", 0.0))
            uncertainty = float(constraint.get("uncertainty", 0.0))
            sigma_limit = float(constraint.get("sigma_limit", 3.0))
            if uncertainty <= 0:
                failures += 1
                messages.append(
                    f"{name}: uncertainty must be positive (received {uncertainty})"
                )
                continue
            delta = abs(prediction - value)
            if delta > sigma_limit * uncertainty:
                failures += 1
                messages.append(
                    f"{name}: deviation {delta:.3e} exceeds {sigma_limit}σ tolerance"
                )
        passed = failures == 0
        if passed:
            messages.append(
                "Model predictions align with experimental inputs within configured tolerances"
            )
        return SectionReport("Experimental alignment", passed, messages)


__all__ = ["Validator", "ValidationReport", "SectionReport"]
