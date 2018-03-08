import CircularProgress from 'material-ui/Progress/CircularProgress';
import { StyleRules, withStyles } from 'material-ui/styles';
import * as React from 'react';

enum Status {
  None,
  Pending,
  Rejected,
  Resolved
}

interface ILoaderProps {
  promise: Promise<any>
  catch?: (err: any) => React.ReactNode
  loader?: () => React.ReactNode | React.ReactNode
}

interface ILoaderState {
  status: Status;
  error: any;
}


class Loader extends React.Component<ILoaderProps, ILoaderState> {
  promise = null;
  unmounted = false;

  constructor(props) {
    super(props)
    this.state = {
      status: Status.None,
      error: null,
    };
    this.handlePromise = this.handlePromise.bind(this);
    this.handlePromiseResult = this.handlePromiseResult.bind(this);
  }

  componentWillReceiveProps(nP) {
    if (nP.promise !== this.props.promise) {
      this.setState({
        status: Status.None
      })
      this.handlePromise(nP.promise)
    }
  }

  handlePromise(prom) {
    this.promise = prom;
    this.setState({
      status: Status.Pending
    });
    prom
      .then(
        _ => this.handlePromiseResult(prom, null, Status.Resolved),
        err => this.handlePromiseResult(prom, err, Status.Rejected),
    )
  }

  handlePromiseResult(prom, res, status) {
    if (this.promise !== prom && !this.unmounted) {
      return;
    }
    this.setState({
      status: status,
      error: res
    });
  }

  componentDidMount() {
    if (this.props.promise) {
      this.handlePromise(this.props.promise)
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { status, error } = this.state;
    const { loader, children } = this.props;

    switch (status) {
      case Status.None:
        return children;
      case Status.Pending:
        return loader
          ? typeof loader === 'function'
            ? loader()
            : loader
          : <DefaultLoader />;
      case Status.Resolved:
        return children;
      case Status.Rejected:
        if (this.props.catch) {
          return this.props.catch(error);
        }
        break
    }
    return null
  }
}

const defaultLoaderStyles: StyleRules = {
  loader: {
    position: 'absolute',
    zIndex: 1,
    paddingTop: 20,
    paddingLeft: '50%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loaderWrapper: {
    minHeight: '30px',
    overflow: 'hidden',
  }
}

const DefaultLoader = withStyles(defaultLoaderStyles)(
  ({ classes }) =>
    <div className={classes.loaderWrapper}>
      <div className={classes.loader}>
        <CircularProgress color='primary' />
      </div>
    </div>
);

export default Loader