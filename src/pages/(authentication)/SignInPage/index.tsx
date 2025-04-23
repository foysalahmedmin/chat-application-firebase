import SocialAuthentication from "@/components/partials/SocialAuthentication";
import { useAuth } from "@/components/providers/AuthProvider";
import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router";

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const location = useLocation() as Location & {
    state?: { from?: { pathname: string } };
  };
  const from = location.state?.from?.pathname || "/";

  const [passShow, setPassShow] = useState(false);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const user = result.user;

      if (!user) throw new Error("Sign-in failed!");

      alert("Sign-in successful!");

      reset();
      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Sign-In failed!");
      }
    }
  };

  const togglePasswordVisibility = (event: ChangeEvent<HTMLInputElement>) => {
    setPassShow(event.target.checked);
  };

  return (
    <section className="min-h-screen">
      <div className="container mx-auto">
        <div className="py-10 min-h-screen flex justify-center items-center">
          <div className="flex-shrink-0 w-full bg-card shadow-2xl py-6 max-w-xl">
            <h1 className="text-center font-bold py-6 text-2xl">SIGN-IN</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
              <div className="mb-6">
                <input
                  type="text"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email"
                  className="form-control w-full"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="form-control w-full">
                  <input
                    type={passShow ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[a-z])(?=.*\d).{6,}$/,
                        message:
                          "Password must contain uppercase, lowercase, number and special character",
                      },
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    placeholder="Password"
                    className="flex-1 appearance-none outline-none"
                    required
                  />
                  <label className="flex items-center justify-center cursor-pointer right-4 top-0 bottom-0 my-auto">
                    <div>
                      <input
                        className="peer hidden"
                        onChange={togglePasswordVisibility}
                        type="checkbox"
                      />
                      <p className="peer-checked:hidden block fill-current text-xl">
                        <Eye />
                      </p>
                      <p className="peer-checked:block hidden fill-current text-xl">
                        <EyeClosed />
                      </p>
                    </div>
                  </label>
                </span>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="mt-6">
                <input type="submit" value="LogIn" className="button w-full" />
              </div>
            </form>
            <p className="text-center">
              New here?{" "}
              <Link
                to="/authentication/sign-up"
                className="text-primary font-semibold"
                state={{ from }}
              >
                Create a new account.
              </Link>
            </p>
            <hr className="my-4 mx-auto w-1/2" />
            <SocialAuthentication />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
