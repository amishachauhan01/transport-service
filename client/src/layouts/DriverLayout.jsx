import Navbar from "../components/Navbar";

function DriverLayout({ children }) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}

export default DriverLayout;