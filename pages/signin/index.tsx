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
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../stores/useAuth";

export default function StudentSignInPage() {
  const toast = useToast();
  const router = useRouter();
  const auth = useAuth();
  const idRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const idError = useMemo(() => {
    const regex = /^[0-9]{4}-[0-9]{1}-[0-9]{2}-[0-9]{3}$/;
    return !regex.test(id);
  }, [id]);
  const passwordError = useMemo(() => {
    return password.length < 4 || password.length > 32;
  }, [password]);

  const formattedId = useMemo(() => {
    const arr = id.split("").filter((char) => char !== "-");
    const parts = [arr.slice(0, 4), arr.slice(4, 5), arr.slice(5, 7), arr.slice(7, 10)].filter(
      (part) => part.length > 0
    );
    return parts.map((part) => part.join("")).join("-");
  }, [id]);

  const handleFormSubmit = async () => {
    if (idError || passwordError) {
      return toast({
        title: "Invalid ID or Password",
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
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();

      if (data.success) {
        auth.setAuth(data.user, data.token);
        router.push("/home");

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
          Sign In
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
              w="100%"
              fontSize="16"
              fontWeight="bold"
              colorScheme="green"
              isLoading={loading}
              onClick={handleFormSubmit}
            >
              Sign In
            </Button>
          </VStack>
        </FormControl>
        <HStack spacing="3" py="3">
          <Box h="0.5" bg="gray.300" w="100%" />
          <Text fontSize="12" fontWeight="bold" color="gray.300">
            OR
          </Text>
          <Box h="0.5" bg="gray.300" w="100%" />
        </HStack>
        <VStack spacing="3">
          <Button
            colorScheme="blue"
            w="100%"
            fontSize="16"
            fontWeight="bold"
            onClick={() => router.push("/activate")}
          >
            Activate Account
          </Button>
          <Button
            colorScheme="red"
            w="100%"
            fontSize="16"
            fontWeight="bold"
            onClick={() => router.push("/signin/admin")}
          >
            Admin & Faculty Panel
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
