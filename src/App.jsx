import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { onAuthStateChanged, signOut } from "firebase/auth";

// Pages
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import CreateArticle from "./pages/Articles/CreateArticle";
import Articles from "./pages/Articles/Articles";
import Article from "./pages/Articles/Article";
import CreateActivities from "./pages/Activity/CreateActivities";
import ViewActivities from "./pages/Activity/ViewActivities";
import Activity from "./pages/Activity/Activity";
import Profile from "./pages/Profile/Profile";
import CreateTeam from "./pages/CreateTeam";
import ViewTeams from "./pages/Team/ViewTeams";
import EditTeam from "./pages/Team/EditTeam";
import MemberShip from "./pages/membership/MemberShip";
import MemberShipForm from "./pages/membership/MemberShipForm";
import ServiceRequests from "./pages/Service/ServiceRequests";
import ServiceForm from "./pages/Service/ServiceForm";
import Events from "./pages/Events/Events";
import { auth } from "./firebase.config";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/admin/*" element={<ProtectedRoutes />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

function ProtectedRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team/create" element={<CreateTeam />} />
          <Route path="/teams" element={<ViewTeams />} />
          <Route path="/activities/create" element={<CreateActivities />} />
          <Route path="/activities" element={<ViewActivities />} />
          <Route path="/activity/:activityId" element={<Activity />} />
          <Route path="/articles/create" element={<CreateArticle />} />
          <Route path="/articles/:articleId" element={<Article />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team/edit/:teamId" element={<EditTeam />} />
          <Route path="/membership" element={<MemberShip />} />
          <Route path="/membership/create" element={<MemberShipForm />} />
          <Route path="/servicerequest/create" element={<ServiceForm />} />
          <Route path="/servicerequests" element={<ServiceRequests />} />
          <Route path="/events" element={<Events />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  ) : (
    <Navigate to="/" replace />
  );
}

export default App;
