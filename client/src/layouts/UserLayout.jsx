import Navbar from "../components/Navbar";

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}

export default UserLayout;