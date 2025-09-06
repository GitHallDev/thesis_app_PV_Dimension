import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sun,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-accent to-secondary rounded-full">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl  font-bold">Solar Dimension</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              Votre partenaire pour un dimensionnement solaire optimal et des
              installations durables. Ensemble, construisons un avenir
              énergétique durable.
            </p>

            {/* Newsletter */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  Newsletter
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Recevez nos dernières actualités et conseils solaires
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-black-700 border-slate-600 text-white placeholder:text-slate-400 flex-1"
                  />
                  <Button className="bg-black hover:bg-accent/90 hover:text-black px-4">
                   S'abonner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg  font-bold mb-6 text-white">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span>+223 xx - xx - xx - xx</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span>contact@solardimension.ml</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span>Bamako, Mali</span>
              </div>
            </div>
          </div>

          {/* Social & Links */}
          <div>
            <h4 className="text-lg  font-bold mb-6 text-white">
              Suivez-nous
            </h4>
            <div className="flex gap-3 mb-8">
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-accent rounded-lg transition-colors group"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-gray" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-accent rounded-lg transition-colors group"
              >
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-gray" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-accent rounded-lg transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-gray" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-accent rounded-lg transition-colors group"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-gray" />
              </a>
            </div>

            <div className="space-y-2">
              <a
                href="#"
                className="block text-slate-400 hover:text-accent transition-colors"
              >
                À propos
              </a>
              <a
                href="#"
                className="block text-slate-400 hover:text-accent transition-colors"
              >
                Services
              </a>
              <a
                href="#"
                className="block text-slate-400 hover:text-accent transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="block text-slate-400 hover:text-accent transition-colors"
              >
                Carrières
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-center md:text-left">
              &copy; 2025 Solar Dimension. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                Mentions Légales
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                Politique de Confidentialité
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
