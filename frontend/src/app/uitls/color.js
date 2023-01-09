export const getColorForStatus = (status) => {
  if (
    status === 'unknown' ||
    status === 'uninstalling' ||
    status === 'pending_install' ||
    status === 'pending_upgrade' ||
    status === 'pending_rollback' ||
    status === 'warning' ||
    status === 'disabled'
  ) {
    return 'warning';
  }
  if (
    status === 'uninstalled' ||
    status === 'superseded' ||
    status === 'failed' ||
    status === 'unhealthy' ||
    status === 'error'
  ) {
    return 'error';
  }
  if (status === 'deployed' || status === 'info') {
    return 'info';
  }
  if (status === 'healthy' || status === 'active') {
    return 'success';
  }
};
