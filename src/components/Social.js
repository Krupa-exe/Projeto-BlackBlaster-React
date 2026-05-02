// importação do react-icons para deixar mais estilizado a página
import { FaLinkedin, FaGithub } from 'react-icons/fa';
 
function Social(props) {
  return (
    <div className="membro-social">
      {props.link && (
        <a href={props.link} target="_blank" rel="noreferrer" className="social-btn linkedin">
          <FaLinkedin /> LinkedIn
        </a>
      )}
      {props.gith && (
        <a href={props.gith} target="_blank" rel="noreferrer" className="social-btn github">
          <FaGithub /> GitHub
        </a>
      )}
    </div>
  );
}
 
export default Social;