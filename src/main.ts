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
let room_number: string = "";

let player_one_clicks: number = 0;
let player_two_clicks: number = 0;
let player_three_clicks: number = 0;
let player_four_clicks: number = 0;

socket.on('connect', () => { 
  console.log('connected to server');
});

socket.on('select-room', (prompt: string) => {
  let room_str: string | null;
  if(prompt === 'room is full, please select another room') {
    room_str = window.prompt(prompt);
  } else {
    room_str = window.prompt('please enter a room number to join');
  }
  
  if(room_str) {
    socket.emit('room_number', room_str);
  }

})

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
  document.querySelector<HTMLDivElement>('#players-connected')!.innerText = `Total Users Connected: ${users_connected}`;
});

socket.on('users_in_room', (users_in_room: number) => { 
  document.querySelector<HTMLDivElement>('#players-in-room')!.innerText = `Users in Room: ${users_in_room}`;
});

socket.on('room_number', (new_room_number: string) => {
  room_number = new_room_number;
  document.querySelector<HTMLDivElement>('#room-number')!.innerText = `Room number: ${room_number}`;
});

socket.on('assign_player', (player: number) => { 
  document.querySelector<HTMLDivElement>('#player-number')!.innerText = `You are Player: ${player}`;
  player_number = player;
  console.log(`player: ${player}`);
});

socket.on('client_state', (update: any) => { 
  const temp_player = update.player_temp;
  const temp_clicks = update.clicks;
  const temp_state = update.state;

  if(temp_player === 1) {
    player_one_clicks = temp_clicks;
    document.querySelector<HTMLDivElement>('#player-one')!.innerText = `Player 1: ${player_one_clicks}`;
  } else if(temp_player === 2) {
    player_two_clicks = temp_clicks;
    document.querySelector<HTMLDivElement>('#player-two')!.innerText = `Player 2: ${player_two_clicks}`;
  } else if(temp_player === 3) {
    player_three_clicks = temp_clicks;
    document.querySelector<HTMLDivElement>('#player-three')!.innerText = `Player 3: ${player_three_clicks}`;
  } else if(temp_player === 4) {
    player_four_clicks = temp_clicks;
    document.querySelector<HTMLDivElement>('#player-four')!.innerText = `Player 4: ${player_four_clicks}`;
  }

  document.querySelector<HTMLDivElement>('#client-state')!.innerText = temp_state;
});


function buttonClicked(player: number) {
  //document.querySelector<HTMLDivElement>('#client-state')!.innerText = `Player ${player} clicked`;
  if(player === player_number) {
    console.log('button clicked');
    socket.emit('player_clicked', player);
  } else {
    console.log('not your button to click');
  }
}
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
window.buttonClicked = buttonClicked;