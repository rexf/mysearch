import React, {useState, useEffect} from 'react';
import {ReactMic} from 'react-mic'
import {IconButton, InputLabel, OutlinedInput} from "@material-ui/core";
// import './App.css';
import {MicRounded} from "@material-ui/icons";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechMsg = window.SpeechSynthesisUtterance;
const speech = window.speechSynthesis;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'zh-HK';

const msg = new speechMsg("");
msg.lang = 'zh-HK';

export const SearchWithMic = ({children}) => {

    const [isMicOn, setIsMicOn] = useState(false);
    const [lastText, setLastText] = useState("");
    const [lastTime, setLastTime] = useState(new Date());

    const searchBoxStyle = {
        justifyContent: 'center',
        width: '600px'
    };

    const containerStyle = {
        position: 'absolute',
        left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    };

    function inputChange(e) {
        if (e.target.value.length > 3) {
            let lastSearchText = e.target.value;
            setLastText(lastSearchText)
            setLastTime(new Date());
            console.log("Search In: " + lastSearchText);

            var timeTxt = lastTime.getHours() + ":" +lastTime.getMinutes();

            msg.text = timeTxt + " " + lastSearchText;
            speech.speak(msg);
        }
    }

    useEffect(() => {
        handleListen()
    }, [isMicOn])

    const handleListen = () => {
        if (isMicOn) {
            mic.start()
            mic.onend = () => {
                mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Stopped Mic on Click')
            }
        }
        mic.onstart = () => {
            // console.log('Mics on')
        }

        mic.onresult = event => {
            const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ')
            setLastText(transcript);
            setLastTime(new Date());
            console.log("Transcript In: " + transcript);
            msg.text = lastTime.toLocaleTimeString() + " " + transcript;
            speech.speak(msg);
            mic.onerror = event => {
                console.log(event.error);
            }
        }
    }
    let outlinedInput = <OutlinedInput style={searchBoxStyle} id="search-box" color="primary" onChange={inputChange}/>
    return (
        <div style={containerStyle}>
            <InputLabel htmlFor="search-box">Start your search here</InputLabel>
            {outlinedInput}
            <IconButton variant="outlined" color={isMicOn ? "secondary" : "primary"}
                        onClick={() => setIsMicOn(!isMicOn)}><MicRounded/></IconButton>
            <ReactMic record={isMicOn} className="sound-wave"/>
        </div>
    );
}