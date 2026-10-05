
import React, { useEffect, useState } from "react";
import api from "../src/api";

function PainelUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [musicas, setMusicas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get("/musicas")
      .then((response) => {
        console.log("RESPOSTA DA API:", response.data);

        const lista = Array.isArray(response.data)
          ? response.data
          : response.data.musicas || [];

        setMusicas(lista);
      })
      .catch((error) => {
        console.error("Erro ao buscar músicas:", error);
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="painel-usuario">


      <p>
        Hey, {usuario?.nome || "listener"}!
      </p>


      <main className="musicas">

        <h2>Listen to your music</h2>

        {musicas.length === 0 ? (
          <p>No music available.</p>
        ) : (

          <div className="musicas-grid">


            {musicas.map((musica) => {
              return (
                <div
                  className="musica-card"
                  key={musica.id || musica.titulo}
                >

                  <h3 title={musica.titulo}>
                    {musica.titulo || "Título não informado"}
                  </h3>

                  <p title={musica.artista}>
                    {musica.artista || "Artista não informado"}
                  </p>

                  <button
                    className="play-button"
                    type="button"
                    onClick={() => {
                      console.log("Tocar música:", musica);
                    }}
                    aria-label={`Tocar ${musica.titulo || "música"}`}
                  >
                    ▶ Play
                  </button>

                </div>
              );

            })}

          </div>

        )}

      </main>
    </div>
  );
}


export default PainelUsuario;
