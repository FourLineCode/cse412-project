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
  const idRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const error = useMemo(() => {
    return (
      !(password.trim() && tempPassword.trim() && confirmPassword.trim()) ||
      password.trim().length < 4 ||
      password.trim().length > 32 ||
      tempPassword.trim().length < 4 ||
      tempPassword.trim().length > 32 ||
      confirmPassword.trim().length < 4 ||
      confirmPassword.trim().length > 32 ||
      password.trim() !== confirmPassword.trim()
    );
  }, [password, confirmPassword, tempPassword]);

  const formattedId = useMemo(() => {
    const arr = id.split("").filter((char) => char !== "-");
    const parts = [arr.slice(0, 4), arr.slice(4, 5), arr.slice(5, 7), arr.slice(7, 10)].filter(
      (part) => part.length > 0
    );
    return parts.map((part) => part.join("")).join("-");
  }, [id]);

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

    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          oldPassword: tempPassword.trim(),
          newPassword: password.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Successfully activated account",
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        router.push("/signin");
      } else {
        toast({
          title: "Couldn't activate account",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setLoading(false);
  };

  const onKeyDownHandler = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await handleFormSubmit();
    }
  };

  useEffect(() => {
    if (idRef.current) {
      idRef.current.focus();
    }
  }, []);

  return (
    <Center
      bg="white"
      _dark={{ bgGradient: "linear(to-b, gray.700, gray.900)" }}
      w="100vw"
      h="100vh"
    >
      <Box p="6" bg="gray.200" _dark={{ bg: "gray.900" }} rounded="xl" maxW="md" w="100%">
        <Text pb="3" fontSize="32" fontWeight="extrabold" textAlign="center">
          Activate Account
        </Text>
        <FormControl>
          <VStack spacing="4">
            <Box w="100%">
              <FormLabel htmlFor="id">Student ID</FormLabel>
              <Input
                id="id"
                name="id"
                type="text"
                isRequired
                autoFocus
                ref={idRef}
                placeholder="2020-3-60-333"
                value={formattedId}
                onChange={(e) => e.target.value.length <= 13 && setId(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Box w="100%">
              <FormLabel htmlFor="tempPassword">Temporary Password</FormLabel>
              <Input
                id="tempPassword"
                name="tempPassword"
                type="password"
                isRequired
                placeholder="Temporary Password..."
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
          </VStack>
          <HStack spacing="3" py="3">
            <Box h="0.5" bg="gray.500" w="100%" />
            <Text textAlign="center" w="100%" fontSize="12" fontWeight="bold" color="gray.500">
              New Password
            </Text>
            <Box h="0.5" bg="gray.500" w="100%" />
          </HStack>
          <VStack spacing="4">
            <Box w="100%">
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
            <Box w="100%">
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
              w="100%"
              fontSize="16"
              fontWeight="bold"
              colorScheme="blue"
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
