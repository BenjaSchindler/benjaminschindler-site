import test from "node:test";
import assert from "node:assert/strict";
import { mentionsDoctor911System, responseHealthChecks } from "./eval-checks.mjs";

test("Doctor911 overview accepts documented products as well as legacy agent facts", () => {
  // These first three valid answers reproduced the old CI failure.
  for (const text of [
    "Experience: Doctor911 systems include OneClinik video consultations and PrexX web agents.",
    "Experience: Doctor911 products include PrexX agents and OneClinik video consultations.",
    "Experience: Doctor911’s PrexX agents support catalog search, authenticated support, and exam recommendations.",
    "He built four WhatsApp agents using LangGraph.",
    "He built an internal RAG assistant.",
  ]) assert.equal(mentionsDoctor911System(text), true, text);
});

test("Doctor911 overview still rejects empty, generic, or unrelated answers", () => {
  for (const text of ["", "He worked at Doctor911.", "He built useful AI products.", "MiAutoCheck generates vehicle valuations.", "He built EPE and worked at Unitti."]) {
    assert.equal(mentionsDoctor911System(text), false, text);
  }
});

test("negative-match checks cannot hide an empty or failed agent response", () => {
  const healthy = (r) => responseHealthChecks.every(check => check.fn(r));
  assert.equal(healthy({ text: "  ", traces: [] }), false);
  assert.equal(healthy({ text: "Something failed. Try again.", traces: [{ kind: "error", label: "api" }] }), false);
  assert.equal(healthy({ text: "Partial answer", traces: [{ kind: "error", label: "incomplete" }] }), false);
  assert.equal(healthy({ text: "I can help with Benjamin’s experience.", traces: [] }), true);
});

test("a rendered match table is an answer; scrolling or an empty report is not", () => {
  const healthy = (ui) => responseHealthChecks.every(check => check.fn({ text: "", traces: [], ui }));
  assert.equal(healthy([{ action: "match_report", report: { rows: [{ requirement: "Python", verdict: "met", evidence: "Python APIs at Unitti" }] } }]), true);
  assert.equal(healthy([{ action: "scroll_to", target: "experience" }]), false);
  assert.equal(healthy([{ action: "match_report", report: { rows: [] } }]), false);
  assert.equal(healthy([{ action: "match_report" }]), false);
});

test("an email draft card is an answer; an empty draft is not", () => {
  const healthy = (ui) => responseHealthChecks.every(check => check.fn({ text: "", traces: [], ui }));
  assert.equal(healthy([{ action: "email_draft", draft: { to: "b@example.com", subject: "Hi", body: "Hello Benjamin" } }]), true);
  assert.equal(healthy([{ action: "email_draft", draft: { to: "b@example.com", subject: "Hi", body: " " } }]), false);
});
