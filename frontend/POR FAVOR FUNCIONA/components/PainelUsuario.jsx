function PainelUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div className="painel-usuario">

      <header className="usuario-header">
        <div>
          <h1>Authly</h1>
          <p>
            Hey, {usuario?.nome}! 
          </p>
        </div>
      </header>

      <main className="musicas">

        <h2>Listen to your music</h2>

        <div className="musicas-grid">

          <div className="musica-card">
            <div className="capa-musica">
              
            </div>

            <h3>Music title</h3>
            <p>Artist name</p>

            <button className="play-button">
              ▶ Play
            </button>
          </div>

          <div className="musica-card">
            <div className="capa-musica">
              
            </div>

            <h3>Another song</h3>
            <p>Artist name</p>

            <button className="play-button">
              ▶ Play
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default PainelUsuario;