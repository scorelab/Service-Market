
import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[500],
    },
    secondary: {
      main: lightBlue[300],
    },
  },
});

export default theme;