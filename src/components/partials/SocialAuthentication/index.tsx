import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/firebase/firebase.config";
import { UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Location, useLocation, useNavigate } from "react-router";

const SocialAuthentication = () => {
  const location = useLocation() as Location & {
    state?: { from?: { pathname: string } };
  };
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithMeta, signInWithGitHub } = useAuth();

  const googleHandler = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithGoogle();

      if (!result.user?.uid) {
        throw new Error("No user UID available");
      }

      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user?.uid,
          displayName: result.user?.displayName,
          search: result.user?.displayName?.toLowerCase(),
          email: result.user?.email,
          photoURL: result.user?.photoURL,
        });
      }

      alert("Signed-In Successfully");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Google Sign-In failed!");
      }
    }
  };

  const metaHandler = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithMeta();

      if (!result.user?.uid) {
        throw new Error("No user UID available");
      }

      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user?.uid,
          displayName: result.user?.displayName,
          search: result.user?.displayName?.toLowerCase(),
          email: result.user?.email,
          photoURL: result.user?.photoURL,
        });
      }

      alert("Signed in with Meta successfully!");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Meta Sign-In failed!");
      }
    }
  };

  const githubHandler = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithGitHub();

      if (!result.user?.uid) {
        throw new Error("No user UID available");
      }

      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user?.uid,
          displayName: result.user?.displayName,
          search: result.user?.displayName?.toLowerCase(),
          email: result.user?.email,
          photoURL: result.user?.photoURL,
        });
      }

      alert("Signed-In Successfully");
      navigate(from, { replace: true });
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
      <button
        className="cursor-pointer"
        onClick={googleHandler}
        aria-label="Sign in with Google"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 256 262"
        >
          <path
            fill="#4285f4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          />
          <path
            fill="#34a853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          />
          <path
            fill="#fbbc05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          />
          <path
            fill="#eb4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          />
        </svg>
      </button>
      <button
        className="cursor-pointer"
        onClick={metaHandler}
        aria-label="Sign in with Meta"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 256 171"
        >
          <defs>
            <linearGradient
              id="logosMetaIcon0"
              x1="13.878%"
              x2="89.144%"
              y1="55.934%"
              y2="58.694%"
            >
              <stop offset="0%" stop-color="#0064e1" />
              <stop offset="40%" stop-color="#0064e1" />
              <stop offset="83%" stop-color="#0073ee" />
              <stop offset="100%" stop-color="#0082fb" />
            </linearGradient>
            <linearGradient
              id="logosMetaIcon1"
              x1="54.315%"
              x2="54.315%"
              y1="82.782%"
              y2="39.307%"
            >
              <stop offset="0%" stop-color="#0082fb" />
              <stop offset="100%" stop-color="#0064e0" />
            </linearGradient>
          </defs>
          <path
            fill="#0081fb"
            d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82c3.677 5.947 9.16 8.466 14.751 8.466c7.211 0 13.808-1.79 26.52-19.372c10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927c0-23.52-5.484-49.623-17.564-68.273c-8.574-13.23-19.684-21.313-31.907-21.313c-13.22 0-23.859 9.97-35.815 27.75c-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07c-14.2 18.91-26.324 26.076-42.287 26.076c-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148z"
          />
          <path
            fill="url(#logosMetaIcon0)"
            d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0C85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49c6.802 8.243 11.565 10.7 17.752 10.7c15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363c-11.395 0-21.49-2.475-32.654-13.007c-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428c-10.923 0-20.2 7.666-27.963 19.39z"
          />
          <path
            fill="url(#logosMetaIcon1)"
            d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39c-10.976 16.568-17.698 41.245-17.698 64.944c0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148C0 83.772 7.514 55.24 21.802 33.206C34.48 13.666 52.774 0 73.757 0z"
          />
        </svg>
      </button>
      <button
        className="cursor-pointer"
        onClick={githubHandler}
        aria-label="Sign in with GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 256 250"
        >
          <path
            fill="#161614"
            d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002C256 57.307 198.691 0 128.001 0m-80.06 182.34c-.282.636-1.283.827-2.194.39c-.929-.417-1.45-1.284-1.15-1.922c.276-.655 1.279-.838 2.205-.399c.93.418 1.46 1.293 1.139 1.931m6.296 5.618c-.61.566-1.804.303-2.614-.591c-.837-.892-.994-2.086-.375-2.66c.63-.566 1.787-.301 2.626.591c.838.903 1 2.088.363 2.66m4.32 7.188c-.785.545-2.067.034-2.86-1.104c-.784-1.138-.784-2.503.017-3.05c.795-.547 2.058-.055 2.861 1.075c.782 1.157.782 2.522-.019 3.08m7.304 8.325c-.701.774-2.196.566-3.29-.49c-1.119-1.032-1.43-2.496-.726-3.27c.71-.776 2.213-.558 3.315.49c1.11 1.03 1.45 2.505.701 3.27m9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033c-1.448-.439-2.395-1.613-2.103-2.626c.301-1.01 1.747-1.484 3.207-1.028c1.446.436 2.396 1.602 2.095 2.622m10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95c-1.53.034-2.769-.82-2.786-1.86c0-1.065 1.202-1.932 2.733-1.958c1.522-.03 2.768.818 2.768 1.868m10.555-.405c.182 1.03-.875 2.088-2.387 2.37c-1.485.271-2.861-.365-3.05-1.386c-.184-1.056.893-2.114 2.376-2.387c1.514-.263 2.868.356 3.061 1.403"
          />
        </svg>
      </button>
    </div>
  );
};

export default SocialAuthentication;
