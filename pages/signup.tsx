import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import axios from "axios";

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
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign up for an account
                </h2>
            </div>  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    {...register("username")}
                                    className={`text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.username ? 'border-red-500' : ''}`}
                                />
                                {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    {...register("password")}
                                    className={`text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing up...' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default SignUpPage;