import { useEffect } from "react";
import { useLogout } from "next-auth-static-site";

export default function Logout() {
  const logout = useLogout();

  useEffect(() => {
    logout({
      apiRequest: false,
      callbackUrl: `/`,
    });
  }, []);

  return null;
}
