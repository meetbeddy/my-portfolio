import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import NavBar from "./components/layouts/NavBar";
import SideBar from "./components/layouts/SideBar";
import HomePage from "./components/pages/home/HomePage";
import Contact from "./components/pages/contact/Contact";
import About from "./components/pages/about/About";
import Work from "./components/pages/work/Work";
import Skills from "./components/pages/skills/Skills";
import { AnimatePresence } from "framer-motion";

import "./App.css";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <SideBar />
      <NavBar />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.key}>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/skills" component={Skills} />
          <Route exact path="/works" component={Work} />
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;
