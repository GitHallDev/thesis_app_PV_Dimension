// src/core/common/header/index.tsx;
import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { Button } from "@/components/ui/button";
import SolarPanel from "../../../assets/trace.svg";
import { ModeToggle } from "@/components/mode-toggle";
import { Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { all_routes } from "@/routers/all_routes";

interface HeaderProps {
  logoSrc: string;
  appName: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc, appName }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);
  const navigate = useNavigate();

  const routes = all_routes;

  useEffect(() => {
    if (rootRef.current) {
      scopeRef.current = createScope({ root: rootRef }).add(() => {
        animate(rootRef.current!, {
          opacity: [0, 1],
          tranlateY: [-20, 0],
          duration: 800,
          easing: "easeOutCubic",
        });
      });
    }
    return () => {
      scopeRef?.current?.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-between h-16 top-0 left-0 right-0 fixed z-10 opacity-0 backdrop-blur-md py-4 px-8"
    >
      {/* <img src={SolarPanel} alt={appName} className="h-8 w-8" /> */}
      <div className=" rounded-full flex items-center justify-center shadow-lg">
        <Sun className="w-8 h-8 text-primary" />
      </div>
      <span className="text-xl font-bold text-white">{appName}</span>
      <div className="flex items-center gap-10">
        <Button
          variant="link"
          size="lg"
          className="text-lg hover:cursor-pointer"
          onClick={() => {
            navigate(routes.login);
          }}
        >
          Se connecter
        </Button>
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};

export default Header;
