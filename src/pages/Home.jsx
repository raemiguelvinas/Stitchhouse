import bg from "../images/home-bg.png";

function Home() {
  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >
      <div className="home-content">
        <h1>Home Page</h1>
        <p>Welcome to Stitchhouse!</p>
      </div>
    </div>
  );
}

export default Home;