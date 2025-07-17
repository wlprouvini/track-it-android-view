
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se as variáveis de ambiente não estiverem configuradas, criar um cliente mock
let supabase: any;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Cliente mock para desenvolvimento local
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      signUp: ({ email, password }: { email: string; password: string }) => {
        // Simular cadastro local
        const users = JSON.parse(localStorage.getItem('local-users') || '[]');
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          return Promise.resolve({ error: { message: 'Usuário já existe' } });
        }
        
        const newUser = { 
          id: Date.now().toString(), 
          email, 
          password,
          created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('local-users', JSON.stringify(users));
        
        return Promise.resolve({ error: null });
      },
      signInWithPassword: ({ email, password }: { email: string; password: string }) => {
        // Simular login local
        const users = JSON.parse(localStorage.getItem('local-users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (!user) {
          return Promise.resolve({ error: { message: 'Email ou senha incorretos' } });
        }
        
        localStorage.setItem('current-user', JSON.stringify(user));
        return Promise.resolve({ error: null });
      },
      signOut: () => {
        localStorage.removeItem('current-user');
        return Promise.resolve();
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Verificar usuário atual no localStorage
        const currentUser = localStorage.getItem('current-user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          setTimeout(() => callback('SIGNED_IN', { user }), 100);
        }
        
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    }
  };
}

export { supabase }
