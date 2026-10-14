"use strict";
const assert = require("assert");
const { evaluatePaymentIntent, signEnclaveAttestation } = require("./index");

const policy = {
  version: "2.4.0",
  allowedCurrencies: ["USD", "USDC"],
  allowlistedPayees: ["vendor_aws", "vendor_coreweave"],
  maxSinglePayment: 50000,
  holdThreshold: 10000,
  periodRemaining: 100000
};

const r1 = evaluatePaymentIntent({ agentId: "agent-1", amount: 2500, currency: "USDC", payee: "vendor_aws", rail: "x402" }, policy);
assert.strictEqual(r1.disposition, "ALLOW");
assert.ok(r1.receiptHash.startsWith("sha256:"));

const r2 = evaluatePaymentIntent({ agentId: "agent-1", amount: 25000, currency: "USDC", payee: "vendor_aws" }, policy);
assert.strictEqual(r2.disposition, "HOLD");

const r3 = evaluatePaymentIntent({ agentId: "agent-1", amount: 2500, currency: "USDC", payee: "untrusted_party" }, policy);
assert.strictEqual(r3.disposition, "BLOCK");

const att = signEnclaveAttestation(r1);
assert.ok(att.signature.startsWith("sig:"));
console.log("remitbot-mcp: all deterministic policy & attestation tests passed.");
