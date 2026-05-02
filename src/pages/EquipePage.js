import Equipe from "../components/Equipe";

export default function EquipePage() {
  return (
    <div>

      <h1>Nossa Equipe</h1>
      <p className="equipe-subtitulo">As pessoas por trás do BlackBlaster</p>

      <div className="equipe-grid">
        <Equipe nome="Andrey Nery Lima Bonat"         cargo="Desenvolvedor" idade={29} linked="https://linkedin.com/in/andrey_bonat"    github="https://github.com/andrey_bonat" />
        <Equipe nome="Arthur Albert Schmaiske Quoos"  cargo="Desenvolvedor" idade={22} linked="https://linkedin.com/in/arthur_quoos"    github="https://github.com/arthur_quoos" />
        <Equipe nome="Eric Tan Hui Zhen"              cargo="Desenvolvedor" idade={20} linked="https://linkedin.com/in/eric_zhen"       github="https://github.com/eric_zhen" />
        <Equipe nome="João Vitor Krupa Inglês"        cargo="Desenvolvedor" idade={21} linked="https://linkedin.com/in/joao_ingles"     github="https://github.com/joao_ingles" />
        <Equipe nome="João Vitor Zambão"              cargo="Desenvolvedor" idade={22} linked="https://linkedin.com/in/joao_zambao"     github="https://github.com/joao_zambao" />
      </div>

    </div>
  );
}