import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/chatProvider.js";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics.js";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", whiteSpace: "pre-wrap" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.photo}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#cef8af" : "white"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginRight: 2,
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                // borderRadius: `10px 0px 15px ${
                //   m.sender._id === user._id ? "0" : "15px"
                // }`,
                // borderRadius: `${
                //   m.sender._id === user._id ? "0" : "15px 15px 15px 0"
                // }`,
                borderRadius: `10px ${
                  m.sender._id === user._id ? "0px" : "10px"
                } 10px ${m.sender._id === user._id ? "10px" : "0px"}`,
                padding: "5px 15px",
                maxWidth: "75%",
              }}
              dangerouslySetInnerHTML={{ __html: m.content }}
            >
              {/* {m.content} */}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
