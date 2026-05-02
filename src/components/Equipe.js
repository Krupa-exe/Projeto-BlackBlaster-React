import Sobre from "./Sobre";
import Social from "./Social";

function Equipe(props) {
  // Pega as iniciais do nome para o avatar
  const iniciais = props.nome
    .split(" ")       // Separar nome completo
    .slice(0, 2)      // Dois primeiros nomes
    .map((p) => p[0]) // Primeiras letras
    .join("");        // Juntas as duas letras  

  return (
    <div className="card-membro">

      {/* Avatar com as iniciais do membro */}
      <div className="membro-avatar">{iniciais}</div>

      <Sobre usuario={props.nome} profissao={props.cargo} anos={props.idade} />
      <Social link={props.linked} gith={props.github} />

    </div>
  );
};

export default Equipe;