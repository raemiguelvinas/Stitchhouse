import bg from "../images/home-bg.png";

function Saved() {
  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >
      <div className="home-content">
        <h1>Saved Page</h1>
        <p>Work in progress...</p>
      </div>
    </div>
  );
}

export default Saved;