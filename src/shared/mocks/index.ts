export async function initMsw() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }
}
