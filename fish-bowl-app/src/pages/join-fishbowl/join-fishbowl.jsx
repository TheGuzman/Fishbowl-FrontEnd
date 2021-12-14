import { useParams } from 'react-router'; import React, { useState, useEffect, useRef } from "react";
import { styled } from '@mui/material/styles';
import io from "socket.io-client"
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import { Button } from '@mui/material';
import Peer from 'peerjs';
import './join-fishbowl.css'


const Page = styled('div')({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'paper.main',
    flexDirection: 'column',
})

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    height: '20em',
    maxHeight: '20em',
    overflow: 'auto',
    width: '80%',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '10px',
    paddingBottom: '10px',
    marginTop: '25px',
}))
const Form = styled('form')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
})

const TextArea = styled('input')(({ theme }) => ({
    width: '80%',
    height: '2em',
    borderRadius: '4em',
    marginTop: '0.5em',
    paddingLeft: '10px',
    fontSize: '1.3rem',
    backgroundColor: 'transparent',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    outline: 'none',
    color: theme.palette.text,
    letterSpacing: '1px',
}))

const SendButton = styled(Button)(({ theme }) => ({
    variant: 'contained',
    width: '10%',
    height: '2em',
    marginTop: '0.5em',
    borderRadius: '4em',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
}))


const MyRow = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
})

const MyMessage = styled('div')(({ theme }) => ({
    width: 'fit-content',
    backgroundColor: theme.palette.primary.light,
    padding: '10px',
    marginRight: '5px',
    textAlign: 'center',
    borderRadius: '10px',
}))

const SenderName = styled('p')(({ theme }) => ({
    color: theme.palette.text,
    margin: '0 0.2em',
    textAlign: 'center',
    fontSize: '0.7em',
}))

const PartnerRow = styled(MyRow)({
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
})

const PartnerMessage = styled('div')(({ theme }) => ({
    width: 'fit-content',
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.text,
    border: '1px solid lightgray',
    padding: '10px',
    marginLeft: '5px',
    textAlign: 'center',
    borderRadius: '10px',
}))

export default function JoinFishbowlPage() {

    const { roomId } = useParams()
    // const [name, setYourName] = useState(null)
    let [user, setUser] = useState(null)
    const [yourID, setYourID] = useState();
    // const [allIDs, setAllIDs] = useState({});
    // const [room, setRoomID] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [streams, updateStream] = useState([]); 


    useEffect(() => {
        fetch("http://localhost:3001/user", {
            method: 'GET',
            headers: {
                "Authorization": sessionStorage.getItem('sesion')
            }
        })
            .then(r => r.json())
            .then(d => { setUser(d); console.log(d) })
    }, [])


    const socketRef = useRef();

    const peers = {}

   
    
   
    useEffect( () =>{
        const connectRoom = async () => {
            const myPeer = new Peer();
        socketRef.current = io.connect('http://localhost:3001');
        console.log(socketRef.current)
        console.log('emitiendo join-room',roomId);
        socketRef.current.emit('join-room', roomId);

        socketRef.current.on("your id", id => {
            setYourID(id);
        })
        socketRef.current.on("message", (message) => {
            console.log('Llega un mensajitooooo',message)
            receivedMessage(message);
        })

        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            addVideoStream(stream)
            myPeer.on('call', call => {
                call.answer(stream)
                call.on('stream', userVideoStream => {
                    addVideoStream(userVideoStream)
                })
            })
            function connectToNewUser(userId, stream) {
                const call = myPeer.call(userId, stream);
                let newUserStream;
                call.on('stream', userVideoStream => {
                    newUserStream = userVideoStream;
                    addVideoStream(userVideoStream)
                })
                call.on('close', () => {
                    // video.remove()
                    const i = streams.findIndex( s => s === newUserStream);
                    streams.splice(i,1);
                    updateStream([...streams]);
                })
        
                peers[userId] = call
            }
            socketRef.current.on('user-connected', userId => {
                connectToNewUser(userId, stream)
                console.log(userId)
            })
        })
 
        socketRef.current.on('user-disconnected', userId => {
            if (peers[userId]) peers[userId].close()
        })
        myPeer.on('open', id => {
            // socketRef.current.emit('join-room', roomId, id)
        })
    }
    connectRoom();
    }, []);

    function receivedMessage(message) {
        setMessages(oldMsgs => [...oldMsgs, message]);
    }

    function sendMessage(e) {
        e.preventDefault();
        const messageObject = {
            body: message,
            id: yourID,
            name: user.name,
            roomId: roomId,
        };
        setMessage("");
        socketRef.current.emit("send message", messageObject);
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }
    const handleKeypress = e => {
        if (e.keyCode === 13) {
            sendMessage();
        }
    };

    

function addVideoStream(stream) {
        // video.srcObject = stream
        // video.addEventListener('loadedmetadata', () => {
        //     video.play()
        // })
        // const videoGrid = document.getElementById('video-grid')
        // videoGrid.append(video)
        streams.push(stream);
        updateStream([...streams])
    }




    return (
        <Stack>
            <Stack>
                <div id="video-grid">
                    {streams.map((s,i) => <Video key={i} stream={s} />)}
                </div>
            </Stack>
            <Page>
                <Container>
                    {messages.map((message, index) => {
                        if (message.id === yourID) {
                            return (
                                <MyRow key={index}>
                                    <MyMessage>
                                        {message.body}
                                    </MyMessage>
                                </MyRow>
                            )
                        }
                        return (
                            <PartnerRow key={index}>
                                <PartnerMessage>
                                    {message.body}
                                </PartnerMessage>
                                <SenderName>
                                    {message.name}
                                </SenderName>
                            </PartnerRow>
                        )
                    })}
                </Container>
                <Form onSubmit={sendMessage}>
                    <TextArea value={message} onChange={handleChange} placeholder="Say something..." />
                    <SendButton onKeyPress={handleKeypress} type='submit'>Send</SendButton>
                </Form>
            </Page>
        </Stack>

    );
};


const Video = ({ stream }) => {
    const localVideo = React.createRef();
    useEffect(() => {
      if (localVideo.current) localVideo.current.srcObject = stream;
    }, [stream, localVideo]);
  
    return <video style={{ height: 200, width: 200 }} ref={localVideo} autoPlay />
  };