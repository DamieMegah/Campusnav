
import Header from '../components/Header';
import HallSearch from '../components/HallSearch';
import Footer from '../components/Footer';


function Home() {
  return (
    <div>
      <Header />
      <div className="body-container">
       <main className="main-content">
        <h1 className="home-text">Search for Hall</h1>
        <HallSearch />
        <Footer />
       </main>
     </div>
    </div>
  );
}

export default Home;
