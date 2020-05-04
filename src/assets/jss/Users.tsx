import { createStyles } from '@material-ui/core/styles';
import { theme } from 'assets/jss/App';

export default createStyles({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  circularProgress: {
    marginLeft: '50%',
    left: '-80',
  },
});
