import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePassword, generatePassword, sha1Hex, findInRangeResponse } from '../shared/passwordPolicy.js';

test('SHA-1 of "password" matches the well-known digest', async () => {
  assert.equal(await sha1Hex('password'), '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
});

test('range parser finds suffix and ignores padding rows', () => {
  const body = 'AAAA:0\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:9545824\r\n';
  assert.equal(findInRangeResponse(body, '1e4c9b93f3f0682250b6cf8331b7ee68fd8'), 9545824);
  assert.equal(findInRangeResponse(body, 'AAAA'), 0);
  assert.equal(findInRangeResponse(body, 'FFFF'), 0);
});

test('strength meter orders passwords sensibly', () => {
  const s = (p) => evaluatePassword(p).score;
  assert.equal(s(''), -1);
  assert.equal(s('Password123'), 0);
  assert.ok(s('Zq8!vLm2#pXw') >= 3);
  assert.ok(s('correct-horse-battery-staple-92') >= 3);
  assert.ok(s('abc12') <= 1);
});

test('meter notices passwords containing the username', () => {
  const r = evaluatePassword('rida-Zk29!vXq', { username: 'rida' });
  assert.equal(r.noPersonalInfo, false);
  assert.ok(r.score <= 1);
});

test('generator respects length and character-set options', () => {
  for (let i = 0; i < 200; i++) {
    const pw = generatePassword({ length: 18 });
    assert.equal(pw.length, 18);
    assert.match(pw, /[a-z]/);
    assert.match(pw, /[A-Z]/);
    assert.match(pw, /\d/);
    assert.match(pw, /[^A-Za-z0-9]/);
    assert.doesNotMatch(pw, /[O0oIl1|]/);
  }
  const digitsOnly = generatePassword({ length: 12, lowercase: false, uppercase: false, symbols: false, numbers: true });
  assert.match(digitsOnly, /^\d{12}$/);
  assert.equal(generatePassword({ length: 3 }).length, 8, 'never shorter than the policy minimum');
  assert.equal(generatePassword({ length: 500 }).length, 64, 'never longer than the policy maximum');
});

test('generated passwords are unique and pass the meter', () => {
  const set = new Set();
  for (let i = 0; i < 500; i++) set.add(generatePassword({ length: 16 }));
  assert.equal(set.size, 500);
  for (const pw of [...set].slice(0, 50)) assert.ok(evaluatePassword(pw).meetsPolicy);
});

// ---------------------------------------------------------------------------
// Strict email validation
// ---------------------------------------------------------------------------
import { validateEmail, emailDomain } from '../shared/emailPolicy.js';

test('email validation accepts normal addresses', () => {
  for (const e of ['ridazaibb04@gmail.com', 'rida.zaib04@gmail.com', 'student@uog.edu.pk', 'rida_zaib@yahoo.com', 'a.b-c@sub.example.org']) {
    assert.equal(validateEmail(e).ok, true, e);
  }
});

test('email validation rejects malformed addresses', () => {
  for (const e of ['', 'nodomain', 'a@@b.com', 'a b@gmail.com', '.rida12@gmail.com', 'rida..z@gmail.com', 'rida@localhost', 'rida@x.c', 'rida@-bad.com', 'rida@bad-.com']) {
    assert.equal(validateEmail(e).ok, false, e);
  }
});

test('Gmail rules: 6-30 chars, letters/digits/dots only (so admin@gmail.com cannot exist)', () => {
  assert.equal(validateEmail('admin@gmail.com').ok, false);
  assert.equal(validateEmail('ab@gmail.com').ok, false);
  assert.equal(validateEmail('name_x12@gmail.com').ok, false);
  assert.equal(validateEmail('r.i.d.a.z.a.i.b@gmail.com').ok, true);
  assert.equal(validateEmail('x'.repeat(31) + '@gmail.com').ok, false);
});

test('typo domains get a "did you mean" suggestion', () => {
  const r = validateEmail('ridazaib04@gmial.com');
  assert.equal(r.ok, false);
  assert.equal(r.suggestion, 'ridazaib04@gmail.com');
});

test('disposable and generic role addresses are refused', () => {
  assert.equal(validateEmail('someone@mailinator.com').ok, false);
  assert.equal(validateEmail('test@yahoo.com').ok, false);
  assert.equal(validateEmail('info@gmail.com').ok, false);
  assert.equal(emailDomain('A@B.Com'), 'b.com');
});

test('email addresses with capital letters are refused, with a lowercase suggestion', () => {
  for (const e of ['Ridazaibb04@gmail.com', 'ridazaibb04@Gmail.com', 'RIDAZAIBB04@GMAIL.COM']) {
    const r = validateEmail(e);
    assert.equal(r.ok, false, e);
    assert.match(r.message, /lowercase/);
    assert.equal(r.suggestion, e.toLowerCase());
  }
  assert.equal(validateEmail('ridazaibb04@gmail.com').ok, true);
});
