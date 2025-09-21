// Demo-Version für Testing ohne echte Supabase-Verbindung
export const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      console.log('Demo SignUp für:', email);
      
      // Simuliere erfolgreiche Anmeldung nach 2 Sekunden
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { 
        data: { 
          user: { 
            id: Date.now().toString(), 
            email: email,
            user_metadata: options?.data || {}
          } 
        }, 
        error: null 
      };
    },
    
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    
    onAuthStateChange: (callback) => {
      // Simuliere sofortigen Login für Demo
      setTimeout(() => {
        const demoUser = { 
          id: '123', 
          email: 'demo@coachingspace.de',
          user_metadata: { is_demo_user: true }
        };
        callback('SIGNED_IN', { user: demoUser });
      }, 100);
      
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => console.log('Demo: Unsubscribed') 
          } 
        } 
      };
    }
  }
};