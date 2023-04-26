import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import classNames from "classnames";
import Link from "next/link";

interface SignInFormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });
  const session = useSession()

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn("credentials", {
      ...data,
      callbackUrl: "/",
      redirect: true,
    });

    if (!result?.ok) {
      console.error("Error logging in:", result?.error);
    }
  };
  // if (typeof window !== "undefined") alert(JSON.stringify(session, null, 2))

  return (
    <>
      <Head>
        <title>Sign in - Cascade</title>
      </Head>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{
        backgroundImage: "url('/abstractBackground.svg')",
        backgroundSize: "cover",
      }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-500">
            Sign in
          </h2>
        </div>
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-gray-500">
                  Username
                </label>
                <div>
                  <input
                    {...register("username")}
                    className={classNames(
                      "focus:outline-none text-gray-700 block w-full sm:text-m font-medium border-b border-gray-200 focus:border-indigo-300",
                      {
                        "border-red-500": errors.username,
                      }
                    )}
                  />
                  {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-500">
                  Password
                </label>
                <div>
                  <input
                    type="password"
                    {...register("password")}
                    className={classNames(
                      "focus:outline-none text-gray-700 block w-full sm:text-m font-medium border-b border-gray-200 focus:border-indigo-300",
                      {
                        "border-red-500": errors.username,
                      }
                    )}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                </div>
              </div>

              <p className="text-gray-500 text-xs font-semibold">Don't have an account? <Link href="/signup" style={{ color: "#3856C5" }}>Sign up</Link></p>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage
