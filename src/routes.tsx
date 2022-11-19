import type { FC } from "react";
import { Route, Switch } from "wouter";

import { Home } from "./pages";

const Router: FC = () => (
  <Switch>
    <Route path="/" component={Home} />
    <Route>404, Not Found</Route>
  </Switch>
);

export default Router;
