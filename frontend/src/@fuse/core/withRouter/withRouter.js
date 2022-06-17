import { useLocation, useNavigate } from 'react-router-dom';

function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Child {...props} navigate={navigate} location={location} />;
  };
}

export default withRouter;
