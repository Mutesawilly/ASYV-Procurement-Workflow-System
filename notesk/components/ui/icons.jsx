import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";

export const Icons = {
  gitHub: (props) => <FaGithub {...props} />,
  google: (props) => <FcGoogle {...props} />,
  spinner: (props) => <FaSpinner {...props} />,
};