function Sobre(props) {
  return (
    <div className="membro-sobre">
      <h2>{props.usuario}</h2>
      <span className="membro-cargo">{props.profissao}</span>
      <span className="membro-idade">{props.anos} anos</span>
    </div>
  );
};

export default Sobre;