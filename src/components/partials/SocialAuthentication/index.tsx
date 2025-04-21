import { useAuth } from "@/components/providers/AuthProvider";
import { UserCredential } from "firebase/auth";
import { Github } from "lucide-react";
import { Location, useLocation, useNavigate } from "react-router";

const SocialAuthentication = () => {
  const location = useLocation() as Location & {
    state?: { from?: { pathname: string } };
  };
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGitHub } = useAuth();

  const googleHandler = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithGoogle();
      if (result.user) {
        alert("Signed-In Successfully");
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Google Sign-In failed!");
      }
    }
  };

  const githubHandler = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithGitHub();
      if (result.user) {
        alert("Signed-In Successfully");
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("GitHub Sign-In failed!");
      }
    }
  };

  return (
    <div className="flex gap-6 justify-center items-center my-5">
      <button onClick={googleHandler} aria-label="Sign in with Google">
        <Github className="text-4xl text-primary" />
      </button>
      <button onClick={githubHandler} aria-label="Sign in with GitHub">
        <Github className="text-4xl text-primary" />
      </button>
    </div>
  );
};

export default SocialAuthentication;
