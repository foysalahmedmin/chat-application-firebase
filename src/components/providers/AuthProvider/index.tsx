import { app } from "@/firebase/firebase.config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth/web-extension";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// ----------------------
// Type Definitions
// ----------------------
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  updateProfile: (user: User, name: string, photo: string) => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithMeta: () => Promise<UserCredential>;
  signInWithGitHub: () => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ----------------------
// Firebase
// ----------------------
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const metaProvider = new FacebookAuthProvider();
const gitHubProvider = new GithubAuthProvider();

// ----------------------
// Context & Hook
// ----------------------
export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return auth;
};

// ----------------------
// Provider
// ----------------------
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const SignUp = (email: string, password: string): Promise<UserCredential> => {
    setIsLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const UpdateProfile = async (
    user: User,
    name: string,
    photo: string
  ): Promise<void> => {
    await updateProfile(user, {
      displayName: name,
      photoURL: photo,
    });
  };

  const SignInWithGoogle = (): Promise<UserCredential> => {
    setIsLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const SignInWithMeta = (): Promise<UserCredential> => {
    setIsLoading(true);
    return signInWithPopup(auth, metaProvider);
  };

  const SignInWithGitHub = (): Promise<UserCredential> => {
    setIsLoading(true);
    return signInWithPopup(auth, gitHubProvider);
  };

  const SignIn = (email: string, password: string): Promise<UserCredential> => {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const SignOut = (): Promise<void> => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo: AuthContextType = {
    user,
    isLoading,
    updateProfile: UpdateProfile,
    signInWithGoogle: SignInWithGoogle,
    signInWithMeta: SignInWithMeta,
    signInWithGitHub: SignInWithGitHub,
    signUp: SignUp,
    signIn: SignIn,
    signOut: SignOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
