import { Box } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "./Navbar";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Box maxW="100vw" w="100%" minH="100vh">
      <Navbar />
      {children}
    </Box>
  );
}
