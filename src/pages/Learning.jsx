import bg from "../images/home-bg.png";

function Learning() {
  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >
      <div className="home-content">
        <h1>Learn Page</h1>
        <p>Work in progress...</p>
      </div>
    </div>
  );
}

export default Learning;