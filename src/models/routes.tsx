import { RouteProps } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon/SvgIcon';

type Icon = OverridableComponent<SvgIconTypeMap>;
export default interface RouteModel extends RouteProps {
  sidebarName: string;
  icon: Icon;
  isAdminOnly: boolean;
  isRegisteredOnly: boolean;
}
