import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";

// Définition des props attendues par le composant
interface Props {
  file_max_size: number;
  accepted_types: Array<string>;
  onFileUpload: (file: File) => void;
}

const FileDropzone = ({
  file_max_size,
  accepted_types,
  onFileUpload,
}: Props) => {
  // État pour l'effet visuel de drag
  const [dragActive, setDragActive] = useState(false);
  // État pour afficher un message d'erreur
  const [error, setError] = useState<string | null>(null);
  // Référence vers l'élément input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser le champ input
  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Valider le type et la taille du fichier
  const validateFile = (file: File): boolean => {
    console.log("filetype: ", file.type);
    if (!accepted_types.includes(file.type)) {
      setError(
        "Format de fichier non accepté. Utilisez un fichier CSV, XLS ou XLSX."
      );
      toast(
        "Format de fichier non accepté. Utilisez un fichier CSV, XLS ou XLSX."
      );
      resetInput();
      return false;
    }

    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > file_max_size) {
      // setError(`Le fichier dépasse la taille maximale de ${file_max_size} Mo.`);
      toast(`Le fichier dépasse la taille maximale de ${file_max_size} Mo.`);
      resetInput();
      return false;
    }

    setError(null); // Pas d'erreur
    return true;
  };

  // Gestion du fichier une fois sélectionné
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileUpload(file);
    }
  };

  // Gestion du drag & drop
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Gestion de l'input fichier classique
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept=".csv, .xls, .xlsx"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-input"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`text-sm flex flex-col justify-center items-center border-2 rounded-lg p-6 m-4 text-center transition-all duration-200 ${
          dragActive
            ? "bg-gray-100 border-dashed border-primary text-gray-500"
            : "hover:bg-gray-50 hover:scale-105 hover:cursor-pointer"
        }`}
      >
        <Upload className="size-20 text-primary mb-2" />
        <p className="text-sm text-gray-600">
          Importez un fichier (max {file_max_size} Mo) - Formats acceptés : CSV,
          XLS, XLSX
        </p>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </label>
    </div>
  );
};

export default FileDropzone;
