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

export default function StudentSignInPage() {
  const toast = useToast();
  const router = useRouter();
  const idRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const idError = useMemo(() => {
    const regex = /^[0-9]{4}-[0-9]{1}-[0-9]{2}-[0-9]{3}$/;
    return !regex.test(id);
  }, [id]);
  const passwordError = useMemo(() => {
    return password.length < 6 || password.length > 32;
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

    await new Promise((res) => setTimeout(res, 2000));
    console.log({ id, password });

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
    <Center bgGradient="linear(to-b, gray.700, gray.900)" w="100vw" h="100vh">
      <Box p="6" bg="gray.900" rounded="xl">
        <Text pb="3" fontSize="32" fontWeight="extrabold" textAlign="center">
          Sign In
        </Text>
        <FormControl>
          <VStack spacing="4">
            <Box>
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
                onChange={(e) => setId(e.target.value)}
                onKeyDown={onKeyDownHandler}
              />
            </Box>
            <Box>
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
              bg="green.500"
              _hover={{ bg: "green.600" }}
              _active={{ bg: "green.700" }}
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
            bg="blue.500"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
            w="100%"
            fontSize="16"
            fontWeight="bold"
            onClick={() => router.push("/activate")}
          >
            Activate Account
          </Button>
          <Button
            bg="red.500"
            _hover={{ bg: "red.600" }}
            _active={{ bg: "red.700" }}
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
