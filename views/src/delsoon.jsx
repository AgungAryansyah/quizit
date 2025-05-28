import featureicon from './assets/test.png'

function Card(){
    return(
        <div className="card">
            <img className="card-image" src={featureicon} alt="feature-icon"></img>
            <h2 className='card-title'>Create Quiz</h2>
            <p className='card-info'>You can create your own quiz</p>
        </div>
    );
}

export default Card