
import React, { useState } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    try {

      await loginUser(formData);
      navigate("/"); // перенаправляем на главную
    } catch (err) {

      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="h-full bg-neutral-200 dark:bg-neutral-700">
      <div className="container h-full p-10">
        <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="lg:flex">
                {/* Левая часть */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12"> 
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="/logo.png"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        Welcome Back
                      </h4>
                    </div>

                    <form>
                      {error && <div className="bg-red-100 text-red-800 p-2 mb-4">{error}</div>}
                      <p className="mb-4">Please login to your account</p>

                      <TEInput
                        name="username"
                        type="text"
                        label="Username"
                        className="mb-4"
                        value={formData.username}
                        onChange={handleChange}
                      />

                      <TEInput
                        name="password"
                        type="password"
                        label="Password"
                        className="mb-4"
                        value={formData.password}
                        onChange={handleChange}
                      />

                      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                      <div className="text-center">
                        <TERipple rippleColor="light" className="w-full">
                          <button
                            className="w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase text-white shadow transition duration-150 ease-in-out"
                            type="button"
                             style={{
                              background: "linear-gradient(to right, #00F260 ,#45a247,#2b5876, #283c86)",
                            }}
                            onClick={handleLogin}
                          >
                            Log in
                          </button>
                        </TERipple>
                        <a href="#!" className="block mt-2 text-sm text-blue-500">Forgot password?</a>
                      </div>

                      <div className="flex items-center justify-between pt-6">
                        <p className="mb-0 mr-2">Don't have an account?</p>
                        <a
                          href="/register"
                          className="inline-block border-2 border-danger px-6 pt-2 text-xs font-medium uppercase text-danger transition hover:bg-neutral-500 hover:bg-opacity-10"
                        >
                          Register
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Правая часть */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg"
                  style={{
                    background: "linear-gradient(to right, #283c86, #2b5876, #45a247, #00F260)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:px-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      We are more than just a tool
                    </h4>
                    <p className="text-sm">
                      Generate high-quality synthetic data for training and experimentation.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
