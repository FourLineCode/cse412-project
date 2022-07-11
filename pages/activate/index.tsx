import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ActivatePage() {
  const toast = useToast();
  const router = useRouter();
  const tempRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const error = useMemo(() => {
    return (
      password.length < 6 ||
      password.length > 32 ||
      tempPassword.length < 6 ||
      tempPassword.length > 32 ||
      confirmPassword.length < 6 ||
      confirmPassword.length > 32
    );
  }, [password]);

  const handleFormSubmit = async () => {
    if (error) {
      return toast({
        title: "Invalid Password",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setLoading(true);

    await new Promise((res) => setTimeout(res, 2000));
    console.log({ tempPassword, password, confirmPassword });

    setLoading(false);
  };

  const onKeyDownHandler = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await handleFormSubmit();
    }
  };

  useEffect(() => {
    if (tempRef.current) {
      tempRef.current.focus();
    }
  }, []);

  return (
    <Center bgGradient="linear(to-b, gray.700, gray.900)" w="100vw" h="100vh">
      <Box p="6" bg="gray.900" rounded="xl">
        <Text pb="3" fontSize="32" fontWeight="extrabold" textAlign="center">
          Activate Account
        </Text>
        <FormControl>
          <Box>
            <FormLabel htmlFor="tempPassword">Temporary Password</FormLabel>
            <Input
              id="tempPassword"
              name="tempPassword"
              type="password"
              isRequired
              ref={tempRef}
              placeholder="Temporary Password..."
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              onKeyDown={onKeyDownHandler}
            />
          </Box>
          <HStack spacing="3" py="3">
            <Box h="0.5" bg="gray.500" w="100%" />
            <Text textAlign="center" w="100%" fontSize="12" fontWeight="bold" color="gray.500">
              New Password
            </Text>
            <Box h="0.5" bg="gray.500" w="100%" />
          </HStack>
          <VStack spacing="4">
            <Box>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                isRequired
                placeholder="New Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Box>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                isRequired
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Button
              type="submit"
              bg="blue.500"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.700" }}
              w="100%"
              fontSize="16"
              fontWeight="bold"
              isLoading={loading}
              onClick={handleFormSubmit}
            >
              Activate Account
            </Button>
          </VStack>
        </FormControl>
        <HStack spacing={2} justifyContent="center" pt="5">
          <Text>Already Activated?</Text>
          <NextLink href="/signin">
            <Text
              color="green.500"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
            >
              Sign In
            </Text>
          </NextLink>
        </HStack>
      </Box>
    </Center>
  );
}
