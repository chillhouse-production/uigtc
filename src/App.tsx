import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup'>('signin');

  return (
    <>
      {currentPage === 'signin' && (
        <SignIn onSwitchToSignUp={() => setCurrentPage('signup')} />
      )}
      {currentPage === 'signup' && (
        <SignUp onSwitchToSignIn={() => setCurrentPage('signin')} />
      )}
    </>
  );
}

export default App;
