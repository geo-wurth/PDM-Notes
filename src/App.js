import React, { useState } from 'react';
import { useHistory, Route } from 'react-router-dom';

import Notas from './Notas';

import AppContext from './AppContext';

import useDidMount from './mountControlls';

function App ()
{
    let history = useHistory();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [autenticado, setAutenticado] = useState(false);
    const [loginInvalido, setLoginInvalido] = useState(false);

    useDidMount(() =>
    {
        if (autenticado) {
            history.push('/notas');
        }
        else {
            history.push('/login');
        }
    });

    function userAutenticado ()
    {
        setAutenticado(true, history.push('/notas'));
    }

    function logout ()
    {
        setNome('');
        setSenha('');

        setAutenticado(false, history.push('/login'));
    }

    const validarAcesso = function ()
    {
        if (nome === 'user' && senha === 'user') {
            userAutenticado();
        }
        else {
            setLoginInvalido(true);
        }
    }

    return <>
        <AppContext.Provider value={ {
            autenticado, userAutenticado, logout
        } }>
            <Route exact path="/login" render={ () => <div>
                <div className="container">
                    <h1 className="pt-4 text-center">Autenticação do usuário</h1>
                    { loginInvalido && (<p style={ { color: "red" } }> Usuário e/ou senha inválido(s)! Tente novamente</p>) }
                    <div className="row">
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="user" placeholder="Usuário" value={ nome } onChange={ (e) => setNome(e.target.value) }></input>
                                <label htmlFor="user">Usuário</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="pass" placeholder="Senha" value={ senha } onChange={ (e) => setSenha(e.target.value) }></input>
                                <label htmlFor="pass">Senha</label>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-secondary my-2 w-100" onClick={ validarAcesso }>Acessar</button>
                </div>
            </div>
            } />
            <Route exact path="/notas" render={ () => <div>
                <Notas />
            </div>
            } />
        </AppContext.Provider></>;
}

export default App;