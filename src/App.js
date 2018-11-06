import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from "react-emotion";
import { parse } from "query-string";
import { AuthContext, Provider } from "./AuthContext";

const { REACT_APP_AUTH_URL: AUTH_URL } = process.env;

const AuthBox = styled("div")`
  margin: 64px auto;
`;

const ReceiveToken = props => {
  const { payload } = parse(props.location.search);

  const [state, actions] = useContext(AuthContext);
  const { loginWithTemporaryToken } = actions;

  useEffect(() => payload && loginWithTemporaryToken(payload), [payload]);

  return <span>{(state.user && state.user.username) || "Not Logged In"}</span>;
};

const App = () => {
  return (
    <Router>
      <Provider>
        <AuthBox>
          <Route exact path="/">
            <form method="POST" action={`${AUTH_URL}/register`}>
              <input id="email" name="email" />
              <input type="submit" />
            </form>
          </Route>
          <Route path="/auth" component={ReceiveToken} />
        </AuthBox>
      </Provider>
    </Router>
  );
};

export default App;
