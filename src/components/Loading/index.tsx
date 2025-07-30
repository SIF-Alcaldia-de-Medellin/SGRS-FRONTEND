import './Loading.css';

const Loading = () => {
    return (
        <div className='loading-container'>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div>Cargando...</div>
        </div>
    );
}

export default Loading;