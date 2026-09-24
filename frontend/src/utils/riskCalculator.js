/**
 * Risk Assessment module based on README specifications:
 * 0 – 30       LOW
 * 31 – 60      MEDIUM
 * 61 – 80      HIGH
 * 81 – 100     CRITICAL
 */

export function getSeverityFromScore(score) {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getSeverityBadgeClass(severity) {
  switch (severity?.toUpperCase()) {
    case 'LOW':
      return 'bg-severity-low/10 text-severity-low border border-severity-low/30';
    case 'MEDIUM':
      return 'bg-severity-medium/10 text-severity-medium border border-severity-medium/30';
    case 'HIGH':
      return 'bg-severity-high/10 text-severity-high border border-severity-high/30';
    case 'CRITICAL':
      return 'bg-severity-critical/15 text-severity-critical border border-severity-critical/40 shadow-sm shadow-severity-critical/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

const ATTACK_BASE_SEVERITY = {
  Normal: 5,
  Analysis: 45,
  Backdoor: 85,
  Backdoors: 85,
  DoS: 82,
  Exploits: 84,
  Fuzzers: 55,
  Generic: 65,
  Reconnaissance: 50,
  Shellcode: 92,
  Worms: 95,
};

const SENSITIVE_PORTS = [22, 23, 80, 443, 445, 1433, 3306, 3389, 8080];

export function calculateRiskScore({
  attackType = 'Normal',
  confidence = 0.5,
  port = 80,
  failedAttempts = 0,
}) {
  const normType = attackType.trim();
  const baseRisk = ATTACK_BASE_SEVERITY[normType] ?? 50;

  if (normType.toLowerCase() === 'normal') {
    const normalScore = Math.min(25, Math.round(15 * (1 - confidence)));
    return {
      score: normalScore,
      severity: getSeverityFromScore(normalScore),
    };
  }

  // Weight confidence factor
  let score = baseRisk * (0.6 + 0.4 * confidence);

  // Sensitive target port penalty
  if (SENSITIVE_PORTS.includes(Number(port))) {
    score += 5;
  }

  // Failed authentication attempts factor
  if (failedAttempts > 0) {
    const attemptBonus = Math.min(20, Math.round(failedAttempts * 0.4));
    score += attemptBonus;
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    score: finalScore,
    severity: getSeverityFromScore(finalScore),
  };
}
