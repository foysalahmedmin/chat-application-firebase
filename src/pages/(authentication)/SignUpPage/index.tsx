import SocialAuthentication from "@/components/partials/SocialAuthentication";
import { useAuth } from "@/components/providers/AuthProvider";
import { db, storage } from "@/firebase/firebase.config";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Eye, EyeClosed, ImagePlus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router";

// Define form input types
interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  photoFile: FileList;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const location = useLocation() as Location & {
    state?: { from?: { pathname: string } };
  };
  const from = location.state?.from?.pathname || "/";

  const [passShow, setPassShow] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      const result = await signUp(data.email, data.password);
      const user = result?.user;

      if (!user) throw new Error("Sign-up failed!");

      const date = new Date().getTime();
      const photo = data.photoFile[0];

      let photoURL = null;
      if (photo) {
        const storageRef = ref(storage, `${data.name + date}`);
        await uploadBytesResumable(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user?.uid), {
        uid: user?.uid,
        displayName: user?.displayName,
        search: user?.displayName?.toLowerCase(),
        email: user?.email,
        photoURL: photoURL,
      });

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      });

      alert("Sign-up successful!");

      reset();
      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Sign-Up failed!");
      }
    }
  };

  const togglePasswordVisibility = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassShow(event.target.checked);
  };

  return (
    <section className="min-h-screen">
      <div className="container mx-auto">
        <div className="py-10 min-h-screen flex justify-center items-center">
          <div className="flex-shrink-0 w-full max-w-xl py-6 bg-card shadow-2xl">
            <h1 className="text-center font-bold py-6 text-2xl">SIGN-UP</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Name"
                    className="form-control w-full"
                    required
                  />
                </div>
                <label className="flex px-4 items-center gap-2 cursor-pointer h-10 bg-muted">
                  <input
                    type="file"
                    {...register("photoFile")}
                    className="hidden"
                  />
                  <span className="text-sm">Upload Photo</span>
                  <ImagePlus className="size-6" />
                </label>
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                  className="form-control w-full"
                  required
                />
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
                <input
                  type="submit"
                  value="Sign-Up"
                  className="button w-full"
                />
              </div>
            </form>
            <p className="text-center">
              Already registered?{" "}
              <Link
                to="/authentication/sign-in"
                className="text-primary font-semibold"
                state={{ from }}
              >
                Go to SignIn.
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

export default SignUpPage;
