import { describe, it, expect } from 'vitest';

describe('Physics Simulation: Rolling Cylinder Pivoting Over Step', () => {
  const g = 9.8;

  function computePhysics(v0: number, R: number, h: number, M: number) {
    // 1. Initial rolling without slipping
    const omega0 = v0 / R;
    const keInitial = 0.75 * M * v0 * v0;

    // 2. Angular momentum about the edge before impact
    const L_edge = (M * v0 * (3 * R - 2 * h)) / 2;

    // 3. Moment of inertia about the edge
    const I_edge = 1.5 * M * R * R;

    // 4. Angular velocity just after impact
    const omega1 = (v0 * (3 * R - 2 * h)) / (3 * R * R);

    // 5. Kinetic energy after impact
    const keAfterImpact = 0.5 * I_edge * omega1 * omega1;

    // 6. Minimum velocity to climb over
    const v0Min = (Math.sqrt(12 * g * h) * R) / (3 * R - 2 * h);

    return {
      omega0,
      keInitial,
      L_edge,
      I_edge,
      omega1,
      keAfterImpact,
      v0Min,
    };
  }

  it('conserves angular momentum about the edge during the collision', () => {
    const M = 2.0;
    const R = 0.5;
    const h = 0.15;
    const v0 = 3.0;

    const res = computePhysics(v0, R, h, M);

    // L_before = M*v0*(R-h) + 1/2*M*R*v0 = M*v0*(3R-2h)/2
    const L_before = M * v0 * (R - h) + 0.5 * M * R * v0;
    // L_after = I_edge * omega1
    const L_after = res.I_edge * res.omega1;

    expect(L_before).toBeCloseTo(res.L_edge, 6);
    expect(L_after).toBeCloseTo(res.L_edge, 6);
  });

  it('dissipates kinetic energy during the inelastic collision', () => {
    const M = 2.0;
    const R = 0.5;
    const h = 0.15;
    const v0 = 3.0;

    const res = computePhysics(v0, R, h, M);

    // Kinetic energy after impact must be strictly less than before impact
    expect(res.keAfterImpact).toBeLessThan(res.keInitial);

    const energyLost = res.keInitial - res.keAfterImpact;
    expect(energyLost).toBeGreaterThan(0);
  });

  it('correctly calculates minimum velocity v0_min to climb step', () => {
    const M = 2.0;
    const R = 0.5;
    const h = 0.15;
    const v0 = 3.0;

    const res = computePhysics(v0, R, h, M);

    // When v0 = v0Min, KE after impact must exactly equal M*g*h
    const thresholdRes = computePhysics(res.v0Min, R, h, M);
    const requiredPE = M * g * h;

    expect(thresholdRes.keAfterImpact).toBeCloseTo(requiredPE, 3);
  });

  it('determines climbing outcome correctly for sub-critical and super-critical velocity', () => {
    const M = 2.0;
    const R = 0.5;
    const h = 0.15;
    const res = computePhysics(1.0, R, h, M);

    const vMin = res.v0Min;

    // Below threshold: should not climb
    const subCritical = computePhysics(vMin - 0.5, R, h, M);
    expect(subCritical.keAfterImpact).toBeLessThan(M * g * h);

    // Above threshold: should climb
    const superCritical = computePhysics(vMin + 0.5, R, h, M);
    expect(superCritical.keAfterImpact).toBeGreaterThan(M * g * h);
  });
});
