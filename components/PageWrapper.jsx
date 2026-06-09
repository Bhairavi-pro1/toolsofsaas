import AdSidebar from './AdSidebar';

export default function PageWrapper({ children }) {
  return (
    <div className="page-wrapper">
      <AdSidebar side="left" delay={0} />
      <div className="container">
        {children}
      </div>
      <AdSidebar side="right" delay={600} />
    </div>
  );
}
