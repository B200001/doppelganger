import { useSelector } from 'react-redux';
import { RootState } from '../store';
import '../styles/ResultPage.scss';

const ResultPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  console.log(currentUser);

  return (
    <div className="result-page">
      <h2>Thank You!</h2>
      {currentUser && <p>Thank you, {currentUser.email}, for submitting your answers.</p>}
      <p>Your answers have been successfully submitted.</p>
    </div>
  );
};

export default ResultPage;
