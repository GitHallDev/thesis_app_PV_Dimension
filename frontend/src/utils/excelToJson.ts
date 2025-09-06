import * as XLSX from "xlsx";

export const excelToJson = (file: File): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const arrayBuffer = e?.target?.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Lire la première feuille
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convertir la feuille en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(jsonData);
        // Tu peux maintenant utiliser jsonData comme tu veux (ex : l'afficher ou le stocker dans un état)

        resolve(jsonData as any[][]); // Cast jsonData to expected type any[][]
        // resolve(twoDArray as any[][]);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// import * as XLSX from 'xlsx';

// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   const reader = new FileReader();

//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     // Lire la première feuille
//     const worksheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[worksheetName];

//     // Convertir la feuille en JSON
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     console.log(jsonData);
//     // Tu peux maintenant utiliser jsonData comme tu veux (ex : l'afficher ou le stocker dans un état)
//   };

//   reader.readAsArrayBuffer(file);
// };
