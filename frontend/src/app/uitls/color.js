export const getColorForStatus = (status) => {
  if (
    status === 'unknown' ||
    status === 'uninstalling' ||
    status === 'pending_install' ||
    status === 'pending_upgrade' ||
    status === 'pending_rollback'
  ) {
    return 'warning';
  }
  if (status === 'uninstalled' || status === 'superseded' || status === 'failed' || status === 'unhealthy') {
    return 'error';
  }
  if (status === 'deployed') {
    return 'info';
  }
  if (status === 'healthy') {
    return 'success';
  }
};
