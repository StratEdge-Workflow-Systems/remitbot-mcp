#!/usr/bin/env node
"use strict";

const { canonicalize, sha256Hex } = require("./src/canonical");
const { validatePolicyEnvelope } = require("./src/policy");
const { signEnclaveAttestation } = require("./src/attestation");
const { ENCLAVE_METADATA } = require("./src/enclave");

function evaluatePaymentIntent(intent, policy) {
  if (!intent || typeof intent !== "object") {
    throw new TypeError("intent object is required");
  }
  if (!policy || typeof policy !== "object") {
    throw new TypeError("policy object is required");
  }

  const reasons = [];
  let disposition = "ALLOW";

  const amount = Number(intent.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return buildReceipt(intent, policy, "BLOCK", ["invalid_amount"]);
  }

  if (Array.isArray(policy.allowedCurrencies) && !policy.allowedCurrencies.includes(intent.currency)) {
    disposition = "BLOCK";
    reasons.push("currency_not_allowed");
  }

  if (Array.isArray(policy.allowlistedPayees) && !policy.allowlistedPayees.includes(intent.payee)) {
    if (policy.blockUnlistedPayee !== false) {
      disposition = "BLOCK";
      reasons.push("payee_not_allowlisted");
    } else if (disposition !== "BLOCK") {
      disposition = "HOLD";
      reasons.push("new_payee_requires_approval");
    }
  }

  if (typeof policy.maxSinglePayment === "number" && amount > policy.maxSinglePayment) {
    disposition = "BLOCK";
    reasons.push("exceeds_single_payment_limit");
  } else if (typeof policy.holdThreshold === "number" && amount > policy.holdThreshold && disposition !== "BLOCK") {
    disposition = "HOLD";
    reasons.push("exceeds_auto_approval_threshold");
  }

  if (typeof policy.periodRemaining === "number" && amount > policy.periodRemaining) {
    disposition = "BLOCK";
    reasons.push("exceeds_period_budget");
  }

  return buildReceipt(intent, policy, disposition, reasons);
}

function buildReceipt(intent, policy, disposition, reasons) {
  const payload = {
    agentId: String(intent.agentId || ""),
    amount: String(intent.amount),
    currency: String(intent.currency || "USD"),
    disposition,
    payee: String(intent.payee || ""),
    policyVersion: String(policy.version || "2.4.0"),
    purpose: String(intent.purpose || ""),
    rail: String(intent.rail || "x402"),
    reasons
  };
  const canonical = canonicalize(payload);
  const receiptHash = "sha256:" + sha256Hex(canonical);
  return { ...payload, receiptHash };
}

module.exports = {
  evaluatePaymentIntent,
  canonicalize,
  validatePolicyEnvelope,
  signEnclaveAttestation,
  ENCLAVE_METADATA
};
