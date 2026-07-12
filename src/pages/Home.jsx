import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
  Não existe uma "página inicial" de conteúdo no PitStop — a raiz "/"
  apenas encaminha para o lugar certo dependendo de quem está logado:

    - ninguém logado      -> tela de login
    - ADMIN                -> dashboard do resultado do dia
    - FUNCIONARIO           -> tela de lavagens (seu dia a dia)
*/
export const Home = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="protected-loading">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin() ? '/admin' : '/admin/lavagens'} replace />;
};

export default Home;
