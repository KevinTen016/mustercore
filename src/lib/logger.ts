type Level = 'info' | 'warn' | 'error';

function emit(level: Level, msg: string, ctx?: Record<string, unknown>): void {
  console.log(JSON.stringify({ level, msg, ...ctx, ts: Date.now() }));
}

export const logger = {
  info:  (msg: string, ctx?: Record<string, unknown>) => emit('info',  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => emit('warn',  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => emit('error', msg, ctx),
};
