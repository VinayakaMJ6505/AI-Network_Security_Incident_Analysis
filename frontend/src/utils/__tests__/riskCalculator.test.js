import { describe, it, expect } from 'vitest';
import { calculateRiskScore, getSeverityFromScore, getSeverityBadgeClass } from '../riskCalculator';

describe('Risk Assessment Module (README Specification)', () => {
  describe('getSeverityFromScore', () => {
    it('returns LOW for score between 0 and 30', () => {
      expect(getSeverityFromScore(0)).toBe('LOW');
      expect(getSeverityFromScore(15)).toBe('LOW');
      expect(getSeverityFromScore(30)).toBe('LOW');
    });

    it('returns MEDIUM for score between 31 and 60', () => {
      expect(getSeverityFromScore(31)).toBe('MEDIUM');
      expect(getSeverityFromScore(45)).toBe('MEDIUM');
      expect(getSeverityFromScore(60)).toBe('MEDIUM');
    });

    it('returns HIGH for score between 61 and 80', () => {
      expect(getSeverityFromScore(61)).toBe('HIGH');
      expect(getSeverityFromScore(75)).toBe('HIGH');
      expect(getSeverityFromScore(80)).toBe('HIGH');
    });

    it('returns CRITICAL for score between 81 and 100', () => {
      expect(getSeverityFromScore(81)).toBe('CRITICAL');
      expect(getSeverityFromScore(95)).toBe('CRITICAL');
      expect(getSeverityFromScore(100)).toBe('CRITICAL');
    });

    it('handles boundary / edge case values correctly', () => {
      expect(getSeverityFromScore(-5)).toBe('LOW');
      expect(getSeverityFromScore(150)).toBe('CRITICAL');
    });
  });

  describe('calculateRiskScore', () => {
    it('computes low risk score for Normal traffic', () => {
      const result = calculateRiskScore({
        attackType: 'Normal',
        confidence: 0.99,
        port: 80,
      });
      expect(result.score).toBeLessThanOrEqual(30);
      expect(result.severity).toBe('LOW');
    });

    it('computes high/critical risk score for high confidence Worms or Backdoor or Exploits', () => {
      const result = calculateRiskScore({
        attackType: 'Backdoors',
        confidence: 0.95,
        port: 22,
        failedAttempts: 35,
      });
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(['HIGH', 'CRITICAL']).toContain(result.severity);
    });

    it('considers failed authentication attempts in risk calculation', () => {
      const lowAttempts = calculateRiskScore({
        attackType: 'Generic',
        confidence: 0.7,
        port: 80,
        failedAttempts: 0,
      });
      const highAttempts = calculateRiskScore({
        attackType: 'Generic',
        confidence: 0.7,
        port: 80,
        failedAttempts: 40,
      });
      expect(highAttempts.score).toBeGreaterThan(lowAttempts.score);
    });
  });

  describe('getSeverityBadgeClass', () => {
    it('provides distinct styling for each severity level', () => {
      expect(getSeverityBadgeClass('LOW')).toContain('severity-low');
      expect(getSeverityBadgeClass('MEDIUM')).toContain('severity-medium');
      expect(getSeverityBadgeClass('HIGH')).toContain('severity-high');
      expect(getSeverityBadgeClass('CRITICAL')).toContain('severity-critical');
    });
  });
});
