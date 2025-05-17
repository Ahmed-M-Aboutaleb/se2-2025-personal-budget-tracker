"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { logout, setCredentials } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import axios from "axios";
function Refresher() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    const localToken = localStorage.getItem("accessToken");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.id != null) {
          const user = data;
          dispatch(
            setCredentials({
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              username: user.username,
              token: localToken as string,
            })
          );
        }
      })
      .catch((error) => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        router.push("/");
      });
  }, []);
  return <></>;
}

export default Refresher;
