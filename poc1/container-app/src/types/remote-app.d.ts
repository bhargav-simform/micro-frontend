interface MFEProps {
  basePath?: string
}

declare module 'mfe-app/App' {
  const MFEApp: React.FC<MFEProps>;
  export default MFEApp;
}

declare module 'header-app/Header' {
  const HeaderApp: React.FC<MFEProps>;
  export default HeaderApp;
}
