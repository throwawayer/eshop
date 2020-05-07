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
  tableActionButton: {
    width: '34px',
    height: '34px',
    padding: '0',
  },
  tableActionButtonIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  tooltip: {
    padding: '10px 15px',
    minWidth: '130px',
    lineHeight: '1.7em',
    border: 'none',
    borderRadius: '3px',
    maxWidth: '200px',
    textAlign: 'center',
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    textShadow: 'none',
    textTransform: 'none',
    letterSpacing: 'normal',
    wordBreak: 'normal',
    wordSpacing: 'normal',
    wordWrap: 'normal',
    whiteSpace: 'normal',
    lineBreak: 'auto',
  },
  datePicker: {
    display: 'block',
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
