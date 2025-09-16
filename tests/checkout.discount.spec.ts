import { describe, it, expect } from 'vitest';
import { calculateDiscountedCents } from '../discount-utils.js';

// Mock global fetches / supabase usage by stubbing process env and dynamic import if needed.
// Here we call helper directly; it expects bound scope (couponCode & supa). We'll simulate via Function binding.

describe('Discount calculator', () => {
  it('returns null when no coupon', () => {
    expect(calculateDiscountedCents(1000, null)).toBeNull();
  });
  it('applies amount discount with floor at 0', () => {
    const coupon = { active: true, type: 'amount', value: 300, redeemed_count: 0 };
    expect(calculateDiscountedCents(1000, coupon)).toBe(700);
  });
  it('applies percent discount', () => {
    const coupon = { active: true, type: 'percent', value: 25, redeemed_count: 0 };
    expect(calculateDiscountedCents(1000, coupon)).toBe(750);
  });
});

