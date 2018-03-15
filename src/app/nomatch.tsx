import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import * as React from 'react';

const NoMatch = ({ classes }) => (
  <div>
    <Typography className={classes.header} variant='headline'>
      Page not found ;(
    </Typography>
    <Typography className={classes.header} variant='subheading'>
      404
    </Typography>
  </div>
);

const styles = {
  header: {
    color: 'rgba(0,0,0,0.87)',
    fontSize: '2.5rem',
  },
}

export default withStyles(styles)(NoMatch);