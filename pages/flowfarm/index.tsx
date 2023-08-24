import React from 'react';
import Image from 'next/image';
import ModalFarm from '../../components/staking/Modalfarm';
import Navbar from '../../stakecomponents/Navbar';
import StakeToken from '../../stakecomponents/StakeToken';
import Stake from '../../stakecomponents/Stake';

const App = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [activeButton, setActiveButton] = React.useState<string | null>(null);

    const handleButtonClick = (buttonText: string) => {
        if (buttonText === 'FlowFarm') {
            setActiveButton(buttonText);
            setModalOpen(true);
        } else {
            // Aquí puedes agregar la lógica para abrir el otro modal
        }
    }

            return (
                <div className="bg-gradient-to-t from-gray-100 to-green-400 flex flex-col">
                            <header className="relative p-0 bg-farmbanner bg-contain bg-no-repeat shadow-none min-h-[16vh] lg:min-h-[50vh] md:min-h-[28vh] m-0" style={{ backgroundPosition: 'top', marginBottom: '-4vh' }}>
                            </header>           
                <main className=" flex-grow flex items-start justify-center pb-20">
                            <div className="p-8 border-none rounded-lg shadow-none bg-none">
                            <div className=" grid grid-cols-2 gap-4 md:gap-10 md:grid-cols-3 lg:gap-36">
                        {buttonsData.map((button, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleButtonClick(button.text)} 
                            className="relative flex items-end justify-center w-full h-40 md:w-40 border rounded-md bg-gradient-to-t from-gray-500 to-orange-300 text-white p-2 mb-4 shadow-md shadow-slate-400 focus:outline-none">
                            <div className="absolute inset-0 z-0">
                            <Image src={button.imageSrc} alt={button.text} width={500} height={300} priority={true} />
                        </div>
                        <div className="z-20">{button.text}</div>
                    </button>))}
                            
                        </div>
                    </div>
                </main>
                <ModalFarm isOpen={modalOpen} onClose={() => setModalOpen(false)} title={activeButton || ''}>
                    <Navbar />
                    <StakeToken />
                    <Stake />
                </ModalFarm>
            </div>
        );
    };

    const buttonsData = [
        { text: 'FlowFarm', imageSrc: '/img/flowFarm2.png' },
        { text: 'Chickens', imageSrc: '/img/gallofarm.png' },
        { text: 'Cows', imageSrc: '/img/vacafarm.png' },
        { text: 'Vegetables', imageSrc: '/img/vegetablefarm.png' },
        { text: 'Goat', imageSrc: '/img/cabra.png' },
        { text: 'Fruits', imageSrc: '/img/fruitsfarm.png' },
    ];

    export default App;
