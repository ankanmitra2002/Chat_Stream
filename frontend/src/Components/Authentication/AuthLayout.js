import React from "react";
import { Box, Container, Text, Tabs } from "@chakra-ui/react";

const AuthLayout = ({ children, showTabs = true }) => {
  return (
    <Container
      maxW="2xl"
      centerContent
      style={{ width: "100%", height: "100%" }}
    >
      <Box
        d="flex"
        justifyContent="center"
        p="4"
        bg="white"
        w="100%"
        m="10px 0 10px 0"
        borderRadius="10px"
        borderWidth="1px"
        boxShadow="outline"
      >
        <Text fontFamily="Libre Baskerville" fontSize="2xl" textAlign="center">
          Chat-Stream
        </Text>
      </Box>
      <Box
        width="100%"
        bg="white"
        p="4"
        borderRadius="8px"
        borderWidth="1px"
        borderColor="black"
        boxShadow="outline"
      >
        {showTabs ? (
          <Tabs variant="soft-rounded" colorScheme="blue">
            {children}
          </Tabs>
        ) : (
          children
        )}
      </Box>
    </Container>
  );
};

export default AuthLayout;
