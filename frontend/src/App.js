import React from "react";
import { useSelector } from "react-redux";
import Login from "./Views/Login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Views/Sidebar/sidebar";
import ViewBugPage from "./Views/Pages/viewBugs";
import CreateBugPage from "./Views/Components/Bug Create/edit/bugForm";

function App() {
  const { auth } = useSelector(state => state);
  const Wrapper = ({ title }) => (
    <div className="page-container">
      <CreateBugPage title={title} />
    </div>
  );
  return (
    <Router>
      {!auth.LoggedIn ? <Login /> :
        <>
          <Sidebar />
          <Routes>
            <Route path="/viewbugs" element={<ViewBugPage />}></Route>
            <Route path="/createbugs" element={<Wrapper title="Create Bug" />} />
          </Routes>
        </>
      }
    </Router>
  );
}

export default App;
