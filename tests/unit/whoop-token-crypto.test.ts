/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import {
  decryptWhoopToken,
  encryptWhoopToken,
} from '@/modules/training/infrastructure/whoop-token-crypto';

describe('WHOOP token encryption', () => {
  const secret = 'test-secret-that-is-long-enough-for-token-encryption';

  it('round trips a token without storing the plaintext', () => {
    const token = 'whoop-sensitive-refresh-token';
    const encrypted = encryptWhoopToken(token, secret);

    expect(encrypted).not.toContain(token);
    expect(decryptWhoopToken(encrypted, secret)).toBe(token);
  });

  it('rejects ciphertext encrypted with a different key', () => {
    const encrypted = encryptWhoopToken('token', secret);

    expect(() =>
      decryptWhoopToken(encrypted, 'different-secret-that-is-also-long-enough')
    ).toThrow();
  });
});
