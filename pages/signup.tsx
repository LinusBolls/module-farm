import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";

interface SignUpFormData {
    email: string;
    username: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required(),
});


const SignUpPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
    });

    const { mutate: signUp, isLoading } = useMutation(async (data: SignUpFormData) => {
        const response = await axios.post('/api/signup', data);
        return response.data;
    });

    const onSubmit = (data: SignUpFormData) => {
        signUp(data);
    };

    return (

        <>
            <Head>
                <title>Sign up - Cascade</title>
            </Head>
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{
                backgroundImage: "url('/abstractBackground.svg')",
                backgroundSize: "cover",
            }}>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-500">
                        Sign up
                    </h2>
                </div>
                <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-gray-500">
                                    Email address
                                </label>
                                <div>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className={classNames(
                                            "focus:outline-none text-gray-700 block w-full sm:text-m font-medium border-b border-gray-200 focus:border-indigo-300",
                                            {
                                                "border-red-500": errors.email,
                                            }
                                        )}
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-xs font-semibold text-gray-500">
                                    Username
                                </label>
                                <div>
                                    <input
                                        type="text"
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
                                                "border-red-500": errors.password,
                                            }
                                        )}
                                    />
                                    {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                                </div>
                            </div>

                            <p className="text-gray-500 text-xs font-semibold">Already have an account? <Link href="/signin" style={{ color: "#3856C5" }}>Sign in</Link></p>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:brightness-110 duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isLoading}
                                    style={{
                                        background: "#3856C5",
                                    }}
                                >
                                    {isLoading ? 'Signing up...' : 'Sign up'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;