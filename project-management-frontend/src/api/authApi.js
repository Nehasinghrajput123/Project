import api from "./axios";
export const register = async (register) => {
  const response = await api.post(
    "/auth/regiester",

    register,
  );

  return response.data;
};
/*
------------------------------------
Login API
------------------------------------
*/

export const loginUser = async (loginData) => {
  const response = await api.post(
    "/auth/login",

    loginData,
  );

  return response.data;
};

/*
------------------------------------
Logged In User Profile
------------------------------------
*/

export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};
