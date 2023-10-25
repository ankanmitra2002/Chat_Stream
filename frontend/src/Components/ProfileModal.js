import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSmallScreen] = useMediaQuery("(max-width: 576px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 405px)");
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          bg={"transparent"}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h={isSmallScreen ? "40%" : "50%"} w="50%">
          <ModalHeader
            fontSize={
              isSmallScreen ? (isVerySmallScreen ? "12px" : "15px") : "30px"
            }
            fontWeight="bold"
            // fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize={isSmallScreen ? "70px" : "150px"}
              src={user.photo}
              alt={user.name}
            />
            <Text
              fontSize={
                isSmallScreen ? (isVerySmallScreen ? "12px" : "15px") : "18px"
              }
              fontWeight="bold"
              // fontSize={{ base: "28px", md: "30px" }}
              // fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
              fontSize={isSmallScreen ? "10px" : "20px"}
              width={isSmallScreen ? "10%" : "20%"}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
