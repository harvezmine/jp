import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Use the project's existing compiler; no test dependency or Node TS loader required.
const source = await readFile(new URL("../src/lib/help-validation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { isValidPhone, validateHelp, validateContact, readHelpValues, readContactValues } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const base = {
  category: "doa",
  urgency: "biasa",
  message: "Saya ingin ditemani bercerita.",
  name: "Rani",
  phone: "081234567890",
  email: "",
  city: "",
  contactPreference: "whatsapp",
  isAnonymous: false,
  isConfidential: true,
};

for (const phone of ["081234567890", "+62 812-3456-7890", "(021) 1234 5678", "12345678", "+123456789012345"]) {
  test(`accepts reachable-number formatting: ${phone}`, () => assert.equal(isValidPhone(phone), true));
}
for (const phone of [
  "--------",
  "++++++++",
  "() () ()",
  "1234567",
  "1234567890123456",
  "08abc123456",
  "0812+345678",
  "",
]) {
  test(`rejects invalid number: ${JSON.stringify(phone)}`, () => assert.equal(isValidPhone(phone), false));
}
test("a valid story can be submitted", () => assert.deepEqual(validateHelp(base), {}));
test("anonymous stories do not require a name or contact when opted out", () =>
  assert.deepEqual(
    validateHelp({ ...base, isAnonymous: true, name: "", phone: "", contactPreference: "tidak_perlu" }),
    {},
  ));
test("email preference requires email, not phone", () => {
  assert.ok(validateHelp({ ...base, contactPreference: "email", phone: "", email: "invalid" }).email);
  assert.deepEqual(validateHelp({ ...base, contactPreference: "email", phone: "", email: "rani@example.com" }), {});
});
test("the first step validates only the selected need", () => {
  assert.deepEqual(validateHelp({ ...base, message: "", name: "", phone: "" }, 0), {});
  assert.ok(validateHelp({ ...base, category: "" }, 0).category);
});
test("invalid categories, urgency and contact choices are rejected on the server", () => {
  const errors = validateHelp({ ...base, category: "unknown", urgency: "unknown", contactPreference: "unknown" });
  assert.deepEqual(Object.keys(errors).sort(), ["category", "contact_preference", "urgency"]);
});
test("story length is checked without silently shortening it", () => {
  assert.ok(validateHelp({ ...base, message: "singkat" }).message);
  assert.equal(validateHelp({ ...base, message: "a".repeat(4000) }).message, undefined);
  assert.ok(validateHelp({ ...base, message: "a".repeat(4001) }).message);
});
test("changing contact preferences discards unselected contact details", () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    category: "doa",
    message: base.message,
    name: "Rani",
    phone: base.phone,
    email: "rani@example.com",
    is_anonymous: "on",
    is_confidential: "on",
    contact_preference: "tidak_perlu",
  }))
    form.set(key, value);
  let values = readHelpValues(form);
  assert.equal(values.name, "");
  assert.equal(values.phone, "");
  assert.equal(values.email, "");
  assert.equal(values.isConfidential, true);
  form.set("contact_preference", "email");
  values = readHelpValues(form);
  assert.equal(values.phone, "");
  assert.equal(values.email, "rani@example.com");
  form.set("contact_preference", "telepon");
  values = readHelpValues(form);
  assert.equal(values.phone, base.phone);
  assert.equal(values.email, "");
});
test("contact messages accept either email or phone but validate both when supplied", () => {
  const contact = { name: "Rani", email: "", phone: "", subject: "", message: "Saya ingin bertanya." };
  assert.ok(validateContact(contact).email);
  assert.deepEqual(validateContact({ ...contact, phone: base.phone }), {});
  assert.deepEqual(validateContact({ ...contact, email: "rani@example.com" }), {});
  assert.ok(validateContact({ ...contact, email: "rani@example.com", phone: "--------" }).phone);
});
test("contact reader preserves oversized input for server validation", () => {
  const form = new FormData();
  form.set("name", " Rani ");
  form.set("message", "a".repeat(4001));
  const values = readContactValues(form);
  assert.equal(values.name, "Rani");
  assert.equal(values.message.length, 4001);
  assert.ok(validateContact(values).message);
});
test("uploaded files cannot be treated as story text", () => {
  const form = new FormData();
  form.set("message", new Blob(["Not text input"]), "story.txt");
  assert.equal(readHelpValues(form).message, "");
});
