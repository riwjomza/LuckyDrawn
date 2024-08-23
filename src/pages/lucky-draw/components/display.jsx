import { PureComponent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';
import './display.css';
import headphone1 from "../../../assets/images/headphone1.jpg";
import headphone2 from "../../../assets/images/headphne2.jpg";
import cardtop from "../../../assets/images/Lucky.png";
import frame from "../../../assets/images/frame4.png";
import bg from "../../../assets/images/BG30.png";
import jackpot from "../../../assets/images/giphy3.gif";
import gift from "../../../assets/images/SpecialGift.png";
import money1 from "../../../assets/images/money1.jpg";
import money2 from "../../../assets/images/money2.jpg";
import TableDp from './table';
import bgdp from "../../../assets/images/BGmain.png";

class RandomPicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: false,
      currentChoice: '',
      showConfetti: false
    };

    this.interval = null;
    this.intervalDuration = 25;
    this.duration = 5000;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.pickChoice = this.pickChoice.bind(this);
    this.setChoice = this.setChoice.bind(this);
    this.showWinner = this.showWinner.bind(this);
  }
  start() {
    clearInterval(this.interval);
    this.interval = setInterval(this.setChoice, this.intervalDuration);
    this.setState({ isRunning: true });
    setTimeout(() => {
      if (this.state.isRunning) {
        this.stop();
        this.showWinner(this.state.currentChoice); // Directly use currentChoice
      }
    }, this.duration);
  }
  
  stop() {
    clearInterval(this.interval);
    this.setState({ isRunning: false });
  }

  reset() {
    clearInterval(this.interval);
    this.setState({ isRunning: false, currentChoice: '', showConfetti: false });
  }

  pickChoice() {
    const { items } = this.props;
    const choice = items[Math.floor(Math.random() * items.length)];
    return choice;
  }

  setChoice() {
    this.setState({ currentChoice: this.pickChoice() });
  }
  showWinner(winner) {

    const empNo = winner.split(' ')[0]; // Assuming empNo is the first part before the first space
    const Fname = winner.split(' ')[1];
    const Sname = winner.split(' ')[2];
    const Depart = winner.split(' ')[3];
   // Determine the prize based on the selected item
   let prize;

   if (this.props.selectedItem === 'เงินรางวัล 5,000฿') {
       prize = 'Money';
   } else if (this.props.selectedItem === 'หูฟังเทพ') {
       prize = 'Headphone';
   } else if (this.props.selectedItem === 'Mystery Gift') {
       prize = 'MysteryGift';
   } else {
       prize = 'Unknown';
   }

   console.log('Winner:', winner);
   console.log('Extracted EmpNo:', empNo);
   console.log('Extracted Fname:', Fname);
   console.log('Extracted Sname:', Sname);
   console.log('Extracted Depart:', Depart);
   console.log('Prize:', prize); 

   this.reset();
   this.setState({ showConfetti: true });

   Swal.fire({
       title: `${winner}!`,
       width: 600,
       padding: '3em',
       color: '#716add',
       background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
       backdrop: `
           rgba(0,0,123,0.4)
           url(${jackpot})
           left top
           no-repeat
       `,
       html: `
           <h4>ยินดีด้วยคุณได้รับรางวัล:</br>${this.props.selectedItem}</h4>
           <img src="${`http://61.7.233.106/hana_register/pic/allpic/${empNo}.jpg` || bg}" alt="Selected Item" style="width: 200px; height: 200px; margin-left:25%; border-radius: 8px; margin-top: 10px;" />
       `,
       confirmButtonText: 'ยืนยัน',
       cancelButtonText: 'สละสิทธิ์ ',
       showCancelButton: true,
       cancelButtonColor: '#d33',
       confirmButtonColor: '#3085d6',
   }).then((result) => {
       this.setState({ showConfetti: false });

       if (result.isConfirmed) {
           return fetch('http://10.50.10.5:8000/Service_Riw.svc/rest/AddLucky/', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   fdeptcode: Depart,
                   fempname: Fname,
                   fempno: empNo,
                   fprizename: prize,
                   fsurname: Sname,
                   fconfirm:"Y"
               })
           });
       } else {
        return fetch('http://10.50.10.5:8000/Service_Riw.svc/rest/AddLucky/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              fdeptcode: Depart,
              fempname: Fname,
              fempno: empNo,
              fprizename: prize,
              fsurname: Sname,
              fconfirm:"N"
          })
      });
       }
   }).then(response => response.text()) // Use text() to handle plain text responses
   .then(text => {
       console.log('API Response:', text);
       if (text.includes('Insert successfully')) {
           Swal.fire('Success!', 'The winner has been added successfully.', 'success');
           window.location.reload();
   
      
      
          }
        else if(text.includes('No more Prize')){
            Swal.fire('Error', 'All these prizes have been taken.', 'error');
             }
        else {
           Swal.fire('Error', 'There was a problem adding the winner.', 'error');
       }
   })
   .catch(error => {
       console.error('Error adding winner:', error);
       Swal.fire('Error', 'An error occurred while adding the winner. Please try again later.', 'error');
   });
}
render() {
  const { isRunning, currentChoice, showConfetti } = this.state;

  return (
    <div className="RandomPicker">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}
      <RandomPickerChoice
        choice={currentChoice}
        isRunning={isRunning}
        intervalDuration={this.intervalDuration}
      />
      <RandomPickerControls
        isRunning={isRunning}
        hasChoice={currentChoice.trim().length > 0}
        start={this.start}
        stop={this.stop}
        reset={this.reset}
      />
    </div>
  );
}
}

RandomPicker.propTypes = {
  items: PropTypes.array.isRequired,
  selectedImage: PropTypes.string, // Ensure this is included
  selectedItem: PropTypes.string
};
class RandomPickerChoice extends PureComponent {
  render() {
    const { choice, isRunning } = this.props;
    const content = choice.trim().length > 0 ? choice : '??????';

    return (
      <div className="RandomPicker__choice">
        <span
          className={`RandomPicker__choiceItem ${isRunning ? 'spinning' : ''}`}
          style={{
            animationDuration: isRunning ? `${this.props.intervalDuration}ms` : '0ms'
          }}
        >
          {content}
        </span>
      </div>
    );
  }
}

RandomPickerChoice.propTypes = {
  choice: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  intervalDuration: PropTypes.number.isRequired,
};


class RandomPickerControls extends PureComponent {
  render() {
    const {
      isRunning,
      start,
      stop,
    } = this.props;

    return (
      <div className="RandomPicker__controls">
      <button
  className={`my-8 absolute text-white bg-gradient-to-r w-52 h-20 text-4xl from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 ${isRunning && 'RandomPicker__button--stop spinning'}`}
  onClick={isRunning ? stop : start}
>
  {isRunning ? 'Stop' : 'Draw'}
</button>
      </div>
    );
  }
}

RandomPickerControls.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};


const itemMapping = {
  money1: { name: 'เงินรางวัล 5,000฿', image: money1 },
  headphone1: { name: 'หูฟังเทพ', image: headphone1 },
  gift: { name: 'Mystery Gift', image: gift }
};

const Display = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [namesList, setNamesList] = useState([]);
  const [prizes, setPrizes] = useState({});
  const [prizeName, setPrizeName] = useState(''); // State for PRIZENAME
  const [showTable, setShowTable] = useState(false); // State to toggle TableDp visibility

  useEffect(() => {
    const savedSelectedItem = localStorage.getItem('selectedItem') || '';
    setSelectedItem(savedSelectedItem);

    const fetchNames = async () => {
      try {
        const response = await fetch('http://10.50.10.5:8000/Service_Riw.svc/rest/showNameEmp');
        const data = await response.json();
        const transformedData = data.showNameEmpResult.map(item => `${item.FEmpNo} ${item.FEmpName} ${item.FSurname} ${item.FDeptCode} `);
        setNamesList(transformedData);
        // console.log(1,setNamesList)
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    const fetchPrizes = async () => {
      try {
        const response = await fetch('http://10.50.10.5:8000/Service_Riw.svc/rest/ShowAllPrize');
        const data = await response.json();
        const prizesData = {};
        data.ShowAllPrizeResult.forEach(prize => {
          prizesData[prize.Prize] = prize.Prizenum;
        });
        setPrizes(prizesData);
      } catch (error) {
        console.error('Error fetching prizes:', error);
      }
    };

    fetchNames();
    fetchPrizes();
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedItem(value);
    setPrizeName(getPrizeName(value)); // Set PRIZENAME based on selection
    setShowTable(false); // Hide the table when a new item is selected
    localStorage.setItem('selectedItem', value);

  };

  // const handleSelectChange = (event) => {
  //   setSelectedItem(event.target.value);
  // };
  const getPrizeName = (prize) => {
    if (prize === 'money1') return 'Money';
    if (prize === 'headphone1') return 'Headphone';
    if (prize === 'gift') return 'MysteryGift';
    return '';
  };

  const getPrizeNum = (prize) => {
    if (prize === 'money1') return prizes['Money'];
    if (prize === 'headphone1') return prizes['Headphone'];
    if (prize === 'gift') return prizes['MysteryGift'];
    return 0;
  };



  const selectedImage = selectedItem ? itemMapping[selectedItem]?.image : bg;
  const selectedItemName = selectedItem ? itemMapping[selectedItem]?.name : 'No Item Selected';

  return (
    <main>
      <div className="background-image-container">
        <img src={cardtop} alt="Background" className="background-image" />
      </div>

      <select
        id="month-select"
        className="mb-3 w-full rounded-2xl bg-zinc-100 outline-cyan-400 px-5 py-3"
        onChange={handleSelectChange}
        value={selectedItem}
      >
        <option value="">Select an item</option>
        <option value="money1">เงินรางวัล 5,000฿</option>
        <option value="headphone1">หูฟังเทพ</option>
        <option value="gift">Mystery Gift</option>
      </select>

      <div>
        <img src={frame} className="absolute h-1/3 w-2/3 pr-16 pb-16" />
        <div
          reverse="true"
          className="slider"
          style={{
            "--width": "200px",
            "--height": "200px",
            "--quantity": "9",
          }}
        >
          <div className="list">
            <div className="item" style={{ "--position": 1 }}>
              <img src={money1} alt="money1" />
            </div>
            <div className="item" style={{ "--position": 2 }}>
              <img src={money2} alt="money2" />
            </div>
            <div className="item" style={{ "--position": 3 }}>
              <img src={headphone1} alt="headphone1" />
            </div>
            <div className="item" style={{ "--position": 4 }}>
              <img src={headphone2} alt="headphone2" />
            </div>
            <div className="item" style={{ "--position": 5 }}>
              <img src={gift} alt="gift" />
            </div>
          </div>
        </div>
      </div>

      <div   className="grid grid-cols-3 gap-4 items-left justify-center card2 border mt-20 relative p-4 rounded-lg"
  style={{
    backgroundImage: `url(${bgdp})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
>
        {/* Left Frame - 1/3 of the grid */}
        <div className="col-span-1  border-amber-100 border-4 p-4 flex flex-col items-center justify-center">
          <div className='relative font-mono text-2xl font-bold text-left'>
            <h2 className='text-center text-amber-500 text-3xl'>รางวัล: {selectedItemName}</h2>
            <div className='text-center text-amber-500 text-3xl'>จำนวน {getPrizeNum(selectedItem)} รางวัล</div>
            <img src={selectedImage} alt="selected item" className='border-amber-100 border-4 rounded-lg h-auto w-auto my-2' />
          </div>
        </div>

        {/* Right Frame - 2/3 of the grid */}
        <div className="col-span-2 border-amber-100 border-4 p-4 flex flex-col items-center justify-center">
          {selectedItem ? (
            <RandomPicker items={namesList} selectedImage={selectedImage} selectedItem={selectedItemName} />
          ) : (
            <p>Please select an item to start picking.</p>
          )}
        </div>
      </div>

      {selectedItem && (

        <button
          className="mt-4 mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
          onClick={() => setShowTable(!showTable)} // Toggle showTable state
        >
          {showTable ? 'Hide Winners' : 'Show Winners'}
        </button>
      )}

      {showTable && <TableDp prizeName={prizeName} />}
    </main>
  );
};

export default Display;