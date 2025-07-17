
import React, { useState } from 'react';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <AuthLogin onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <AuthRegister onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default AuthScreen;
