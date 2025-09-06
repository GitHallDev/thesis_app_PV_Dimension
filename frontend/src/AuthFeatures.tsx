import React from "react";
import { Outlet } from "react-router";

const AuthFeatures=()=>{
    return(
        <div className="account-page">
            <div className="main-wrapper"><Outlet /></div>
        </div>
    )
}

export default AuthFeatures;