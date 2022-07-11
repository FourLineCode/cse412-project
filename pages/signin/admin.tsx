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
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../stores/useAuth";

export default function AdminSignInPage() {
  const toast = useToast();
  const router = useRouter();
  const auth = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailError = useMemo(() => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return !regex.test(email);
  }, [email]);
  const passwordError = useMemo(() => {
    return password.length < 4 || password.length > 32;
  }, [password]);

  const handleFormSubmit = async () => {
    if (emailError || passwordError) {
      return toast({
        title: "Invalid Email or Password",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        auth.setAuth(data.user, data.token);
        router.push("/dashboard");

        toast({
          title: "Successfully signed in",
          status: "success",
          duration: 3000,
          isClosable: false,
        });
      } else {
        toast({
          title: data.error,
          status: "error",
          duration: 3000,
          isClosable: false,
        });
      }
    } catch (error) {
      setLoading(false);
    }

    setLoading(false);
  };

  const onKeyDownHandler = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await handleFormSubmit();
    }
  };

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <Center bgGradient="linear(to-b, gray.700, gray.900)" w="100vw" h="100vh">
      <Box p="6" bg="gray.900" rounded="xl" maxW="md" w="100%">
        <Text pb="3" fontSize="32" fontWeight="extrabold" textAlign="center">
          Sign In
        </Text>
        <FormControl>
          <VStack spacing="4">
            <Box w="100%">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="text"
                isRequired
                ref={emailRef}
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Box w="100%">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                isRequired
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Button
              type="submit"
              bg="red.500"
              _hover={{ bg: "red.600" }}
              _active={{ bg: "red.700" }}
              w="100%"
              fontSize="16"
              fontWeight="bold"
              isLoading={loading}
              onClick={handleFormSubmit}
            >
              Sign In
            </Button>
          </VStack>
        </FormControl>
        <HStack spacing="3" py="3">
          <Box h="0.5" bg="gray.500" w="100%" />
          <Text fontSize="12" fontWeight="bold" color="gray.500">
            OR
          </Text>
          <Box h="0.5" bg="gray.500" w="100%" />
        </HStack>
        <VStack spacing="3">
          <Button
            bg="green.500"
            _hover={{ bg: "green.600" }}
            _active={{ bg: "green.700" }}
            w="100%"
            fontSize="16"
            fontWeight="bold"
            onClick={() => router.push("/signin")}
          >
            Student Panel
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
