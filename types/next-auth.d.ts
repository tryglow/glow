import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    uid: string;
    teamId: string;
    features: {
      showGlowTour?: boolean;
    };
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    };
    currentTeamId: string;
    features: {
      showGlowTour?: boolean;
    };
  }
}
