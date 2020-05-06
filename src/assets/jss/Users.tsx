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
  tableSortIconHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});
