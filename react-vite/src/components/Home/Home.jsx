import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(state => state.session.user);

  if (!user) {
    return (
      <>
        <h1>Unlock Your Music Adventure</h1>
      </>
    );
  }

  return <div className='bg-background min-h-screen'>Home</div>;
};

export default Home;

