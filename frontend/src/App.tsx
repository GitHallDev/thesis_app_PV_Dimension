// import * as anime from 'animejs';
import { animate } from "animejs";
import { useEffect, useRef } from "react";
import Header from "./core/common/header";
import SunSection from "./core/common/accueil/sunSection";
import Footer from "./core/common/footer";

const App = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animate(root.current!, {
      opacity: [0, 1],
      duration: 1000,
    });
  }, []);

  return (
    <div className="bg-gray-950">
      <Header logoSrc="/logo.png" appName="Solar Dimension" />
      <div ref={root}>
        <SunSection />
        <Footer />
      </div>
    </div>
  );
};
export default App;
