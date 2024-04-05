import { Button } from "@chakra-ui/react";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechToText = ({ onSpeechResult }) => {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();

  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      onSpeechResult(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening();
    }
  }, [listening, onSpeechResult, resetTranscript, transcript]);

  return (
    <div>
      {/* <button onClick={toggleListening}>{listening ? "Stop" : "Start"}</button> */}
      <Button
        bg={"#075e54"}
        onClick={toggleListening}
        borderRadius={"50%"}
        p={0}
        ml={1}
      >
        <FontAwesomeIcon
          icon={faMicrophone}
          style={{
            color: "white",
          }}
        />
      </Button>
    </div>
  );
};

export default SpeechToText;
