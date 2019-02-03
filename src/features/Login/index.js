import React from 'react';
import gSNormal from 'assets/btn_google_signin_dark_normal_web.png';
import gSFocus from 'assets/btn_google_signin_dark_focus_web.png';
import gSPressed from 'assets/btn_google_signin_dark_pressed_web.png';
import { API_SERVER_URL } from 'config/index';
import './styles/index.scss';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.loginStyle = {
      backgroundImage: `url(${gSNormal})`
    };
  }

  componentDidMount () {}

  render () {
    return (
      <div className="content-parent">
        <div className="login-selection">
          <div
            onMouseEnter={() => {
              this.loginStyle = {backgroundImage: `url(${gSFocus})`};
              this.forceUpdate();
            }}
            onMouseLeave={() => {
              this.loginStyle = {backgroundImage: `url(${gSNormal})`};
              this.forceUpdate();
            }}
            onMouseDown={() => {
              this.loginStyle = {backgroundImage: `url(${gSPressed})`};
              this.forceUpdate();
            }}
            onMouseUp={() => {
              this.loginStyle = {backgroundImage: `url(${gSFocus})`};
              this.forceUpdate();
            }}
            onClick={() => {
              window.location.href = `${API_SERVER_URL}/login`;
            }}
            className="google-sign-in"
            style={this.loginStyle}
          />
        </div>
      </div>
    );
  }
}

export default Login;

