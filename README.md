# `@stratedge/remitbot-mcp` (v2.4.0)

Deterministic Model Context Protocol (MCP) payment policy gate and pre-settlement verifier for autonomous AI agents and institutional treasury rails (`x402`, `ACH`, `Fedwire`, `USDC`).

- **Canonical Specification:** [https://www.stratedgeworkflow.com/specifications/remitbot](https://www.stratedgeworkflow.com/specifications/remitbot)
- **Zenodo Archival DOI:** `10.5281/zenodo.23175482`
- **Platform:** [https://remitbot.ai](https://remitbot.ai)

## Architecture

- `src/canonical.js` — RFC 8785 JSON Canonicalization Scheme (JCS) & SHA-256 receipt hashing
- `src/policy.js` — Fail-closed counterparty allowlist, currency, and velocity limit evaluator
- `src/attestation.js` — Hardware Security Module (HSM) & VPC enclave receipt attestation
- `schemas/` — JSON Schema Draft 2020-12 definitions for payment intents, policies, and receipts
