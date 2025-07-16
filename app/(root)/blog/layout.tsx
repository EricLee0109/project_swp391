interface ConsultantPageLayoutProps {
  children: React.ReactNode;
}

const BlogPageLayout = ({ children }: ConsultantPageLayoutProps) => {
  return (
    <div className="min-h-screen font-sans mdl-js">
      {/* mdl-js prevent hyderation error from NextJs */}
      <div>{children}</div>
    </div>
  );
};

export default BlogPageLayout;
