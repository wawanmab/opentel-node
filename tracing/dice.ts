import { trace, Span } from '@opentelemetry/api';

const tracer = trace.getTracer('dice-lib', '0.0.2');

function rollOnce(i: number, min: number, max: number) {
  return tracer.startActiveSpan(`rollOnce:${i}`, (span: Span) => {
    const result = Math.floor(Math.random() * (max - min + 1) + min);
    span.end();
    return result;
  });
}

export function rollTheDice(rolls: number, min: number, max: number) {
  // Create a span
  return tracer.startActiveSpan('rollTheDice-Span', (span: Span) => {
    const result: number[] = [];
    for (let i = 0; i < rolls; i++) {
      result.push(rollOnce(i, min, max));
    }
    // span must be ended
    span.end();
    return result;
  });
}