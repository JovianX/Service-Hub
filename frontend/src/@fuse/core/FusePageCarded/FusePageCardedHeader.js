import clsx from 'clsx';

function FusePageCardedHeader(props) {
  return (
    <div className={clsx('FusePageCarded-header', 'container')}>{props.header && props.header}</div>
  );
}

export default FusePageCardedHeader;
