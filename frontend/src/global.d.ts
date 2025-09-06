// type pour les fichiers css
declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}
