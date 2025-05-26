let alreadyStarted = false;

export async function initMsw() {
  // strict 모드로 인해 2번 실행되는거 방지(콘솔창 경고를 없애기 위함)
  if (alreadyStarted) return;
  alreadyStarted = true;

  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }
}
