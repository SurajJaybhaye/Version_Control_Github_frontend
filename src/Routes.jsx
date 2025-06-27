import React from "react";
import { useEffect } from 'react';
import {useNavigate, useRoutes} from 'react-router-dom';

import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/user/Profile";
import Create from "./components/user/Create";
import RepoDetail from "./components/user/RepoDetail";


import {useAuth} from "./authContext";


const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<Create/>
        },
        {
  path: "/profile/:reponame",
  element: <RepoDetail />, // Create a new component for repo details
}
    ]);

    return element;
}

export default ProjectRoutes;