import SocialAuthentication from "@/components/partials/SocialAuthentication";
import { useAuth } from "@/components/providers/AuthProvider";
import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

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

  const [passShow, setPassShow] = useState(false);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const user = result.user;

      if (!user) throw new Error("Sign-in failed!");

      alert("Sign-in successful!");

      reset();
      navigate("/", { replace: true });
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
      <div className="container">
        <div className="hero py-10 min-h-screen items-center">
          <div className="card flex-shrink-0 w-full bg-foreground/25 py-6 max-w-sm">
            <h1 className="text-center font-bold py-6 text-2xl">SIGN-IN</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
              <div className="form-control mb-6">
                <input
                  type="text"
                  {...register("email", { required: "Email is required" })}
                  placeholder="email"
                  className="input input-bordered"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-6">
                <span className="relative">
                  <input
                    type={passShow ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    placeholder="password"
                    className="input input-bordered w-full pr-10"
                  />
                  <label className="swap swap-rotate absolute right-4 top-0 bottom-0 my-auto">
                    <input
                      onChange={togglePasswordVisibility}
                      type="checkbox"
                    />
                    <p className="swap-off fill-current text-xl">
                      <Eye />
                    </p>
                    <p className="swap-on fill-current text-xl">
                      <EyeClosed />
                    </p>
                  </label>
                </span>
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="form-control mt-6">
                <input type="submit" value="LogIn" className="primary-btn" />
              </div>
            </form>
            <p className="text-secondary text-center">
              New here?{" "}
              <Link to="/authentication/sign-up" className="text-primary">
                Create a new account.
              </Link>
            </p>
            <SocialAuthentication />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
