import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";


export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  // const isAuthenticated = false;
  

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
}
