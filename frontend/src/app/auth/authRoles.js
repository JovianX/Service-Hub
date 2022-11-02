/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'operator'],
  user: ['admin', 'staff', 'user'],
  onlyGuest: [],
};

export default authRoles;
