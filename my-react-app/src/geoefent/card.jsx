import profielfoto from './assets/profielfoto.jpg';

function Card() {
  return (
    <div className="card">
        <img className='card-image' src={profielfoto} alt="profiel foto" />
        <h2 className='card-title'>Boudewijn</h2>
        <p className='card-text'>study software development and play baseball</p>
    </div>
  );
}

export default Card;