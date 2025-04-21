import SocialAuthentication from "@/components/partials/SocialAuthentication";
import { useAuth } from "@/components/providers/AuthProvider";
import { db, storage } from "@/firebase/firebase.config";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

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

  const [passShow, setPassShow] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      const result = await signUp(data.email, data.password);
      const user = result?.user;

      if (!user) throw new Error("Sign-up failed!");

      const date = new Date().getTime();
      const photo = data.photoFile[0];
      const storageRef = ref(storage, `${data.name + date}`);

      await uploadBytesResumable(storageRef, photo);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: data.name,
        email: data.email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, {
        displayName: data.name,
        photoURL: downloadURL,
      });

      alert("Sign-up successful!");

      reset();
      navigate("/");
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
      <div className="container">
        <div className="hero py-10 min-h-screen items-center">
          <div className="card flex-shrink-0 w-full max-w-sm py-6 bg-foreground/25">
            <h1 className="text-center font-bold py-6 text-2xl">SIGN-UP</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
              <div className="form-control mb-6">
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-6">
                <input
                  type="file"
                  {...register("photoFile", { required: true })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-6">
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-6">
                <span className="relative">
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
                    className="input input-bordered w-full pr-10"
                    required
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
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="form-control mt-6">
                <input type="submit" value="Sign-Up" className="primary-btn" />
              </div>
            </form>
            <p className="text-secondary text-center">
              Already registered?{" "}
              <Link to="/authentication/sign-in" className="text-primary">
                Go to SignIn.
              </Link>
            </p>
            <SocialAuthentication />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
