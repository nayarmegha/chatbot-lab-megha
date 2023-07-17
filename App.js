import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [respond, setRespond] = useState(true);
  const [status, setStatus] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(["Answer 1", "Answer 2", "Answer 3"]);
  const [question, setQuestion] = useState([
    "Question 1",
    "Question 2",
    "Question 3",
  ]);
  const [quiz, setQuiz] = useState({
    quest: "",
    ans: "",
  });

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello, welcome to simple trivia! Say 'Random Quiz' when you're ready to play!",
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  }, []);

  function createNewQuiz() {
    fetch("https://the-trivia-api.com/v2/questions", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const question = result[0].question["text"];
        const answer = result[0].correctAnswer;
        setQuiz({
          quest: result[0].question["text"],
          ans: result[0].correctAnswer,
        });
        console.log("first: ", quiz.quest);
        console.log("first: ", quiz.ans);
        console.log(result[0].question["text"]);
        console.log(result[0].correctAnswer);
        return question;
      })
      .then((question) => {
        console.log("second: ", quiz.quest);
        console.log("second: ", quiz.ans);
        addBotMessage(question);
      })
      .catch((error) => console.log("error", error));
  }

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      //console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    console.log("User message text:", userMessages[0].text);
    console.log(respond);
    // Simple chatbot logic (aka Checkpoint 2 onwards) here!
    if (respond) {
      if (userMessages[0].text == "Yes") {
        setRespond(false);
        addBotMessage(question[status]);
      } else if (userMessages[0].text == "Random Quiz") {
        setRespond(false);
        createNewQuiz();
        console.log(quiz);
      } else {
        addBotMessage("Say 'Random Question' when you're ready to play!");
      }
    } else {
      //user is giving an asnwer to a question
      if (userMessages[0].text == quiz.ans) {
        temp = score + 1;
        setScore(temp);
        addBotMessage("Correct! Press 'X' to exit game.");
        console.log(" Your score is: ", score);
        console.log("correct ans:", quiz.ans);
        createNewQuiz();
      } else if (userMessages[0].text == "X") {
        mess = "You score is: " + score;
        addBotMessage(mess);
      } else {
        addBotMessage("Sorry, wrong answer. Press 'X' to exit game.");
        console.log("correct ans:", quiz.ans);
        createNewQuiz();
      }
    }
  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        console.log("messages is:", messages);
        onSend(messages);
        console.log("Inside Gited Chat respond: ", respond);
        setTimeout(() => respondToUser(messages), 1000);
      }}
      user={{
        _id: 1,
        name: "Baker",
      }}
      renderUsernameOnMessage={true}
    />
  );
}
