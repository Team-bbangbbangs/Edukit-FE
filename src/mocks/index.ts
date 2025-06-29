let alreadyStarted = false;

export async function initMsw() {
  if (alreadyStarted) return;
  alreadyStarted = true;

  if (typeof window !== 'undefined') {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }
}
