// src/core/common/accueil/sunSection.tsx
import { useGLTF, Environment, OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { animate } from "animejs";
import { Mesh } from "three";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { all_routes } from "@/routers/all_routes";

const Sun: React.FC = () => {
  const meshRef = useRef<Mesh>(null!);

  const gltf = useGLTF("/sun.glb");
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.03; // rotation lente
  });

  return (
    <>
      // soleil principale
      <group position={[0, 0, 2]}>
        <primitive ref={meshRef} object={gltf.scene} scale={[1, 1, 1]} />
      </group>
    </>
  );
};

const SunSection: React.FC = () => {
  const navigate = useNavigate();
  const routes = all_routes;
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 2000,
        ease: "easeOutExpo",
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="pt-12 opacity-0 w-full">
      <section className="relative z-10 h-screen bg-[#000] text-white ">
        {/* Contenu texte */}
        <div className="relative flex flex-col items-center justify-center text-center h-1/2  ">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-primary">
            Faites entrer le Soleil dans votre quotidien
          </h1>
          <p className="text-xl max-w-2xl leading-relaxed mb-6">
            Chaque toit a le pouvoir de produire de l’énergie. Le vôtre aussi.{" "}
            <br />
            Prenez le contrôle de votre énergie. <br /> Le Soleil s’en occupe
          </p>
          <Button size={"lg"} onClick={() => navigate(routes.dashboard)} className="hover:cursor-pointer">
            Découvrir
          </Button>
        </div>

        {/* Soleil 3D */}
        <div className="relative bottom-8 inset-0 z-10 flex items-end justify-center pointer-events-none ">
          <div className="relative w-[700px] h-[700px] sm:w-[700px] sm:h-[700px]">
            <Canvas
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              camera={{ position: [0, 0, 5], fov: 45 }}
            >
              <ambientLight intensity={0.5} />
              <Stars
                radius={100} // Taille du champ d'étoiles
                depth={50} // Profondeur dans la scène
                count={5000} // Nombre d'étoiles
                factor={4} // Taille des étoiles
                saturation={0}
                fade
                speed={1} // vitesse de rotation
              />
              <Environment preset="sunset" />
              <Sun />
            </Canvas>

            {/* Glow simulé */}
            <div className="absolute inset-0 rounded-full bg-orange-500 blur-3xl opacity-30 z-[-1]" />
          </div>
        </div>
      </section>

      <section className=" bg-[#000] text-white pt-20 ">
        <div className=" relative flex items-center justify-end h-full m-5  ">
          <img src="/Header_Pannel_picture.jpg" alt="" />

          <div className="absolute right-12 max-w-2xl p-8  rounded-lg  ">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                // backdropFilter: "blur(1px)",
              }}
              className="absolute inset-0   blur-3xl opacity-70 "
            />

            <h1 className="text-5xl font-bold m-4 text">
              Chaque rayon compte <br /> Et si vous commenciez à les utiliser ?
            </h1>
            <p className="text-xl max-w-2xl leading-relaxed mb-6 ">
              Installer des panneaux solaires, c’est plus qu’un choix écologique
              : c’est un pas vers l’indépendance, l’économie et un avenir plus
              serein. Le Soleil brille déjà pour vous. Il ne reste qu’à le
              capter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SunSection;
