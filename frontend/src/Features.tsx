import { Outlet,useLocation } from "react-router";
import Header from "@/core/common/header";
import SidebarPage from "@/core/common/sidebar";
import { useEffect,useState } from "react";
import { all_routes } from "@/routers/all_routes";

const Preloader=()=>{
    return  <div id="global-loader">
        <div className="page-loader"></div>
    </div>
}

const Features=()=>{
    const routes= all_routes;
    const [showloader,setShowLoader]=useState(true);

    useEffect(()=>{
        if(location.pathname=== routes.dashboard||
            location.pathname===routes.manageProject||
            location.pathname===routes.map
        ){
            // voir le loader quand on navige sur une nouvelle route
            setShowLoader(true);

            // masquer le loader après 2 secondes
            const timeoutId=setTimeout(()=>{
                setShowLoader(false);
            },2000)

            return()=>{
                clearTimeout(timeoutId) // réinitialiser le timeout lorsque le composant est affiché
            }
        }else{
            setShowLoader(false);
        }
        // window.scrollTo(0,0)
    },[location.pathname])

    return showloader ?(<>
    <Preloader/>
    <Outlet />
    </>):(<>
    <Outlet/>
    </>)
};
export default Features;