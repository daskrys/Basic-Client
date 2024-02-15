import './style.css'
import { io } from 'socket.io-client'

declare global {
  interface Window {
    buttonClicked: (player: number) => void;
  }
}

const glitchURL:string = "https://comfortable-hyper-sunday.glitch.me/";
const socket: any = io(glitchURL);
let player_number: number = 0;

socket.on('connect', () => { 
  console.log('connected to server');
});

socket.on('disconnect', () => { 
  console.log('disconnected from server')
});

socket.on('disconnected', () => { 
  console.log('disconnected from server')
});

socket.on('users_connected', (users_connected: number) => {
  const previous = document.querySelector<HTMLDivElement>('#players-connected')!.innerText;
  console.log(previous);
  document.querySelector<HTMLDivElement>('#players-connected')!.innerText = previous;
  document.querySelector<HTMLDivElement>('#players-connected')!.innerText = `Users connected: ${users_connected}`;
});

socket.on('room_number', (room_number: number) => {
  document.querySelector<HTMLDivElement>('#room-number')!.innerText = `Room number: ${room_number}`;
});

socket.on('assign_player', (player: number) => { 
  document.querySelector<HTMLDivElement>('#player-number')!.innerText = `You are Player: ${player}`;
  player_number = player;
  console.log(`player: ${player}`);
});

socket.on('client_state', (client_state: string) => { 
  document.querySelector<HTMLDivElement>('#client-state')!.innerText = client_state;
  console.log(client_state);
});

function buttonClicked(player: number) {
  //document.querySelector<HTMLDivElement>('#client-state')!.innerText = `Player ${player} clicked`;
  if(player == player_number) {
    console.log('button clicked');
    socket.emit('player_clicked', player);
  } else {
    console.log('not your button to click');
  }
}

//document.querySelector<HTMLDivElement>('#app')!.innerHTML = ``;
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
window.buttonClicked = buttonClicked;