import React, { useState } from "react";
import BaseContext from "./context";
import jwtDecode from "jwt-decode";
import axios from "axios";

const { Provider: BaseProvider } = BaseContext;

const { REACT_APP_AUTH_URL: AUTH_URL } = process.env;

const initialState = token => ({
  isAuthenticating: false,
  user: token ? jwtDecode(token) : undefined
});

const Provider = props => {
  const [state, setState] = useState(
    initialState(localStorage.getItem("authToken"))
  );

  const setAuthenticatingStatus = status =>
    setState(prevState => ({
      ...prevState,
      isAuthenticating: status
    }));

  const setUserFromJWT = jwt =>
    setState(prevState => ({
      ...prevState,
      user: jwtDecode(jwt)
    }));

  const loginWithTemporaryToken = async payload => {
    setAuthenticatingStatus(true);

    const res = await axios.post(`${AUTH_URL}/confirm`, {
      payload
    });

    if (res.status === 200) {
      const token = res.data;

      setAuthenticatingStatus(false);
      setUserFromJWT(token);

      localStorage.setItem("authToken", token);
    }
  };

  const logout = () => {
    setState(prevState => ({ ...prevState, user: undefined }));
    localStorage.setItem("authToken", undefined);
  };

  const actions = {
    loginWithTemporaryToken,
    logout
  };

  return <BaseProvider value={[state, actions]}>{props.children}</BaseProvider>;
};

export default Provider;
