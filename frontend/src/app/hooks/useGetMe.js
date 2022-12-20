import { useSelector } from 'react-redux';

import { selectUser } from 'app/store/userSlice';

export const useGetMe = () => {
  const user = useSelector(selectUser);
  console.log(user);
  return user;
};
