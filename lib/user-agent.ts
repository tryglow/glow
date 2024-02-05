export function isUserAgentMobile(userAgent: string | null) {
  if (!userAgent) {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}
