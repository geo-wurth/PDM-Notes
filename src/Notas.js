import React, { useState, useContext } from 'react';

import AppContext from './AppContext';

import useDidMount from './mountControlls';

function Notas ()
{
    let { autenticado, logout } = useContext(AppContext);

    const [filtro, setFiltro] = useState('');
    const [notas, setNotas] = useState([]);
    const [newNota, setNewNota] = useState(false);
    const [selectNota, setSelectNota] = useState(false);
    const [authentication] = useState(autenticado);

    const [newTitulo, setNewTitulo] = useState('');
    const [newCategoria, setNewCategoria] = useState('');
    const [newConteudo, setNewConteudo] = useState('');
    const [newDate] = useState(Date());

    const [showId, setShowId] = useState(0);
    const [showTitulo, setShowTitulo] = useState('');
    const [showCategoria, setShowCategoria] = useState('');
    const [showConteudo, setShowConteudo] = useState('');
    const [showDate, setShowDate] = useState('');

    async function createNotas (nota) {

        const result = await fetch('http://localhost:4000/notas', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...nota
            })
        });

        console.log('Create result: ', result);

        await readNotas();

        setNewNota(false);
        setSelectNota(false);
    }

    async function readNotas () {

        const result = await fetch('http://localhost:4000/notas');
        const json = await result.json();

        setNotas(json);
    }

    async function readNota (id) {

        const result = await fetch(`http://localhost:4000/notas/${ id }`);
        const json = await result.json();

        setShowId(json.id);
        setShowTitulo(json.titulo);
        setShowCategoria(json.categoria);
        setShowConteudo(json.conteudo);
        setShowDate(json.data);

        await readNotas();
    }

    async function updateNotas (nota) {

        const result = await fetch(`http://localhost:4000/notas/${ nota.id }`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...nota
            })
        });

        console.log('Updade result: ', result);

        await readNotas();

        setNewNota(false);
        setSelectNota(false);
    }

    async function deleteNotas (id) {

        const result = await fetch(`http://localhost:4000/notas/${ id }`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Delete result: ', result);

        await readNotas();

        setNewNota(false);
        setSelectNota(false);
    }

    useDidMount(() => {

        if (!authentication) {
            logout();
        }
        else {
            readNotas();
        }
    });

    function showNota (id) {

        readNota(id);

        setNewNota(false);
        setSelectNota(true);
    }

    function showCadastroNota () {

        setNewNota(true);
        setSelectNota(false);
    }

    function pesquisarNota()
    {
        //não funcionou e apagou a lista de notas.
    }

    return (<>
        <div className="container mb-5">
            <h1 className="my-3 text-center bg-secondary text-light">Gestão de notas</h1>

            <div className="row">
                <div className="col-auto">
                    <div className="row mb-3">
                        <div className="col-8">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="pesquisa" placeholder="Pesquisar"  value={ filtro } onChange={ (e) => setFiltro(e.target.value) }></input>
                                <label htmlFor="pesquisa">Pesquisar</label>
                            </div>
                        </div>
                        <div className="col-4">
                            <button type="button" className="btn btn-secondary h-100" onClick={ (e) =>
                        {
                            pesquisarNota();
                        } }>Pesquisar</button>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col"><h2>Todas as notas</h2></div>
                        <div className="col-auto"><button className="btn btn-secondary" onClick={ (e) =>
                        {
                            showCadastroNota();
                        } }>+</button></div>
                    </div>

                    <ul className="list-group my-3">
                        { notas.map(nota => <li className="list-group-item" key={ nota.id } onClick={ (e) => { showNota(nota.id) } }>{ nota.titulo }</li>) }
                    </ul>

                    <div>
                        <button className="btn btn-secondary w-100" onClick={ logout }>Sair</button>
                    </div>
                </div>

                <div className="col">
                    { newNota ? <>
                        <div>
                            <div>
                                <h2>Cadastro de notas</h2>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="titulo" className="form-label">Título</label>
                                <input type="text" className="form-control" id="titulo" value={ newTitulo } onChange={ (e) => setNewTitulo(e.target.value) } />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Categoria</label>
                                <input type="text" className="form-control" id="categoria" value={ newCategoria } onChange={ (e) => setNewCategoria(e.target.value) } />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="conteudo" className="form-label">Conteudo</label>
                                <textarea type="text" className="form-control" id="conteudo" value={ newConteudo } onChange={ (e) => setNewConteudo(e.target.value) } />
                            </div>

                            <div className="text-end">
                                <button className="btn btn-secondary" onClick={ (e) => createNotas(Object.assign({}, { titulo: newTitulo, categoria: newCategoria, conteudo: newConteudo, data: newDate })) } > Cadastrar nota</button>
                            </div>
                        </div>
                    </> : "" }
                    
                    { selectNota ? <>
                        <div>
                            <div className="row">
                                <div className="col">
                                    <h2>Alteração de notas</h2>
                                </div>

                                <div className="col text-end">
                                    <button className="btn btn-danger" onClick={ (e) => deleteNotas(showId) }>Apagar nota</button>
                                </div>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="titulo" placeholder="Título" value={ showTitulo } onChange={ (e) => setShowTitulo(e.target.value) }></input>
                                <label htmlFor="titulo">Título</label>
                            </div>
                            
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="categoria" placeholder="Categoria" value={ showCategoria } onChange={ (e) => setShowCategoria(e.target.value) }></input>
                                <label htmlFor="categoria">Categoria</label>
                            </div>
                            
                            <div className="form-floating mb-3">
                                <textarea type="text" className="form-control" id="conteudo" placeholder="Conteúdo" style= { {height: "100px"} }  value={ showConteudo } onChange={ (e) => setShowConteudo(e.target.value) }></textarea>
                                <label htmlFor="conteudo">Conteudo</label>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <span className="fw-bold">Data: </span>
                                    <span>{showDate}</span>
                                </div>
                            </div>

                            <div className="text-end">
                                <button className="btn btn-success" onClick={ (e) => updateNotas(Object.assign({}, { id: showId, titulo: showTitulo, categoria: showCategoria, conteudo: showConteudo, data: newDate })) } > Alterar nota</button>
                            </div>
                        </div>
                    </> : "" }
                    { !newNota && !selectNota ? <>
                        <div>
                            <h1>Bem vindo</h1>
                        </div>
                    </> : "" }
                </div>
            </div>
        </div>
    </>
    );
}

export default Notas;